const connection = require("../connection.js");
var dayjs = require("dayjs");
const axios = require("axios");
const FormData = require("form-data");
async function transfer(data) {
	const io = (await (await connection).execute("select * from account_session where SL_SESSION=? and SL_LOGINIP=?", [data["token"], data["ip"]]))[0][0];
	if(io) {
		const customerid = io.CustomerID;
		const bonus = data["bonus"];
		var DEPOSIT_TOTAL = 0;
		var WITHDRAW_TOTAL = 0;
		const bb = (await (await connection).execute("select * from account_users where CustomerID=?", [
			customerid,
		]))[0][0];
		var SLOT_USERNAME;
		var SL_USERNAME;
		var SL_FIRSTNAME;
		var SL_LASTNAME;
		var SL_BANKID;
		var SL_STATUS;
		var bonus_message;
		if(bb) {
			SLOT_USERNAME = bb.SLOT_USER;
			SL_USERNAME = bb.SL_USERNAME;
			SL_FIRSTNAME = bb.SL_FIRSTNAME;
			SL_LASTNAME = bb.SL_LASTNAME;
			SL_BANKID = bb.SL_BANKID;
			SL_STATUS = bb.SL_STATUS;
		} else {
			return {
				message: "ไม่พบยูสเซอร์",
				state: "error",
			};
		}
		// const refId = (await (
		//   await connection
		// ).execute("select * from logs_transferlog where REFID=?", [
		//   data[refId],
		// ]))[0][0];
		// if (refId) {
		//   return {
		//     message: "ไม่สามารถย้ายเงินได้ เลขรายการซ้ำกัน",
		//     state: "error",
		//   };
		// }
		const a = (await (await connection).execute("select distinct DEPOSIT_TXID from logs_depositlog where CustomerID=? group by DEPOSIT_TXID", [customerid]))[0]; //updated
		for(var res of a) { //updated
			var b = (await (await connection).execute("select * from logs_depositlog where DEPOSIT_TXID=? and CustomerID=?", [res.DEPOSIT_TXID, customerid]))[0][0];
			if(b) {
				DEPOSIT_TOTAL += Number(b.DEPOSIT_AMOUNT);
			}
		}
		const c = (await (await connection).execute("select distinct WITHDRAW_TXID from logs_transferlog where CustomerID=? group by WITHDRAW_TXID", [customerid]))[0]; //updated
		for(var res of c) { //updated
			var d = (await (await connection).execute("select * from logs_transferlog where WITHDRAW_TXID=? and CustomerID=?", [res.WITHDRAW_TXID, customerid]))[0][0];
			if(d) {
				WITHDRAW_TOTAL += Number(d.WITHDRAW_AMOUNT);
			}
		}
		const e = (await (await connection).execute("select * from logs_balance where CustomerID=?", [
			customerid,
		]))[0][0];
		if(e) {
			const OLD_BALANCE = e.SL_BALANCE_OLD;
			var WALLET_BALANCE = OLD_BALANCE + DEPOSIT_TOTAL - WITHDRAW_TOTAL;
			if(WALLET_BALANCE < 0) {
				WALLET_BALANCE = 0;
			}
			(await (await connection).execute("update logs_balance set SL_DEPOSIT=? and SL_WITHDRAW=? and SL_BALANCE=? where CustomerID=?", [DEPOSIT_TOTAL, WITHDRAW_TOTAL, WALLET_BALANCE, customerid]));
		} else {
			(await (await connection).execute("INSERT INTO `logs_balance`(`CustomerID`, `SL_DEPOSIT`, `SL_WITHDRAW`, `SL_BALANCE`) VALUES (?,?,?,?)", [
				customerid,
				0,
				0,
				0,
			]));
		}
		if(isNaN(data["amount"])) {
			return {
				message: "กรุณากรอกจำนวนเงินให้ถูกต้อง",
				state: "error",
			};
		}
		const g = (await (await connection).execute("select * from credit_withdrawlog where CustomerID=? and WITHDRAW_STATUS=1", [customerid]))[0][0];
		if(g) {
			return {
				message: "ไม่สามารถย้ายเงินได้ คุณมีรายการถอนที่กำลังรอดำเนินการอยู่คะ",
				state: "error",
			};
		}
		const form_data = new FormData();
		form_data.append("username", SLOT_USERNAME);
		let jsonData = await axios.post("https://mftx.slotxo-api.com/?agent=" + process.env.AG_AGENT + "&method=gc", form_data, {
			headers: form_data.getHeaders()
		});
		let myData = jsonData.data;
		console.log("balance: " + myData["balance"]);
		if(myData["result"] == "ok") {
			var mybalance = myData["balance"].toString();
			let credit_balance = mybalance.replace(",", "");
			// credit_balance = 3; //temp data
			// const credit_balance = myData["balance"].replace(",", "");
			if(credit_balance < 5) {
				(await (await connection).execute("update credit_turnover set TURN_STATUS=1 where CustomerID=? and TURN_STATUS=0", [customerid]));
			}
			if(data["amount"] < 1) {
				return {
					message: "ไม่สามารถโยกเงินได้คะ เนื่องจากคุณลูกค้ามีจำนวนเงินน้อยกว่า 1 บาท",
					state: "error",
				};
			}
			if(credit_balance >= 5) {
				return {
					message: "ไม่สามารถโยกเงินได้คะ เนื่องจากคุณลูกค้ามีจำนวนเงินมากกว่า 5 บาท",
					state: "error",
				};
			} else {
				const h = (await (await connection).execute("select * from logs_balance where CustomerID=?", [customerid]))[0][0];
				if(h) {
					let wallet_before = h.SL_BALANCE;
					// wallet_before = 600; //temp data
					if(wallet_before < data["amount"] || wallet_before == 0) {
						return {
							message: "ไม่สามารถโยกเงินได้คะ เนื่องจากจำนวนเงินของลูกค้าไม่เพียงพอ",
							state: "error",
						};
					} else {
						const wallet_after = wallet_before - data["amount"];
						if(bonus > 1) {
							const i = (await (await connection).execute("select * from bonus_settings where SL_FUNC=?", [
								bonus,
							]))[0][0];
							var SL_ID;
							var SL_TURNOVER;
							var SL_BONUS;
							var SL_TITLE;
							var SL_MINIMUM;
							var SL_MAXBONUS;
							var SL_OEM;
							if(i) {
								SL_ID = i.ID;
								SL_TURNOVER = i.SL_TURNOVER;
								SL_BONUS = i.SL_BONUS;
								SL_TITLE = i.SL_TITLE;
								SL_MINIMUM = i.SL_MINIMUM;
								SL_MAXBONUS = i.SL_MAXBONUS;
								SL_OEM = i.SL_OEM;
							} else {
								return {
									message: "ไม่สามารถโยกเงินได้คะ เนื่องจากระบบโบนัสมีปัญหาอย่างร้ายแรง กรุณาติดต่อแอดมินคะ",
									state: "error",
								};
							}
							if(!i && bonus != 1) {
								return {
									message: "ไม่มีโบนัสที่ต้องการ",
									state: "error",
								};
							}
							if(i.SL_OEM == 1) {
								const f = (await (await connection).execute("select * from logs_transferlog where CustomerID=? and BONUS_ID=? and TURNOVER_ID is not null and WITHDRAW_DATETIME=? order by WITHDRAW_TXID desc", [customerid, i.ID, dayjs().format("YYYY-M-D h:mm:ss")]))[0][0];
								if(f) {
									return {
										message: "ไม่สามารถรับโบนัสได้ เนื่องจากคุณได้รับโบนัสวันนี้ไปแล้ว",
										state: "error",
									};
								}
							}
							if(i.SL_OEM == 2) {
								const onebonus = (await (await connection).execute("select * from logs_transferlog where CustomerID=? and BONUS_ID=? and TURNOVER_ID is not null order by WITHDRAW_TXID desc", [customerid, i.ID]))[0][0];
								if(onebonus) {
									return {
										message: "ไม่สามารถรับโบนัสได้ เนื่องจากคุณได้รับโบนัสนี้ไปแล้ว",
										state: "error",
									};
								}
							}
							var j;
							if(SL_OEM == 0) {
								if(bonus == 3) {
									//สมาชิกใหม่รับโบนัสทันที 100%
									j = (await (await connection).execute("select * from logs_transferlog where CustomerID=? and WITHDRAW_STATUS=2", [customerid]))[0][0];
									if(j) {
										var arr;
										arr = {
											message: "ไม่สามารถรับโบนัสได้ เนื่องจากมียอดเล่นเกมส์ไปแล้ว",
											state: "error",
										};
										return arr;
									}
								} else if(bonus == 4) {
									//ไม่มียอดฝากภายใน 7 วัน รับฟรี!
									j = (await (await connection).execute("select * from logs_transferlog where CustomerID=? and WITHDRAW_STATUS=2 order by WITHDRAW_DATETIME desc", [customerid]))[0][0];
									var WITHDRAW_DATETIME;
									WITHDRAW_DATETIME = j.WITHDRAW_DATETIME;
									var today;
									today = dayjs().format("ymd");
									var newDate = dayjs(Date.parse(WITHDRAW_DATETIME) / 1000).format("ymd");
									var dat7day;
									dat7day = today - newDate;
									if(dat7day < 7) {
										arr = {
											message: "ไม่สามารถรับโบนัสได้ เนื่องจากลูกค้ามียอดฝากภายใน 7 วัน",
											state: "error",
										};
										return arr;
									}
								} else if(bonus == 5) {
									j = (await (await connection).execute("select * from logs_transferlog where CustomerID=? and WITHDRAW_STATUS=2 and BONUS_ID=2", [customerid]))[0][0];
									if(j) {
										arr = {
											message: "ไม่สามารถรับโบนัสได้ เนื่องจากลูกค้าได้รับโบนัสนี้ไปแล้ว",
											state: "error",
										};
										return arr;
									}
								}
								if(data["amount"] < SL_MINIMUM) {
									var data;
									arr = {
										message: "ไม่สามารถย้ายเงินได้คะ จำเป็นต้องย้ายเงินขั้นต่ำ " + SL_MINIMUM + " บาท",
										state: "error",
									};
									return arr;
								}
								var bonuscredit;
								bonuscredit = (data["amount"] * SL_BONUS) / 100;
								if(bonuscredit > SL_MAXBONUS) {
									bonuscredit = SL_MAXBONUS;
								}
								var totalcredit;
								totalcredit = data["amount"] + bonuscredit;
								var TURN_AMOUNT;
								TURN_AMOUNT = totalcredit * SL_TURNOVER;
								bonus_message = "รับโบนัสเพิ่มจำนวน " + bonuscredit + " บาท ต้องทำยอดเงินคงเหลือให้ถึง " + TURN_AMOUNT + " บาท จึงจะสามารถถอนได้";
							} else {
								// โปรโมชั่น ตามที่กำหนด เช่น 19 ได้ 99
								if(data["amount"] != SL_MINIMUM) {
									arr = {
										message: "ไม่สามารถย้ายเงินได้คะ จำเป็นต้องย้ายเงิน " + SL_MINIMUM + " บาทเท่านั้น",
										state: "error",
									};
									return arr;
								}
								totalcredit = SL_MAXBONUS;
								//ยอดที่ได้รับ
								TURN_AMOUNT = SL_TURNOVER;
								//เทรินโอเวิอร์
								bonus_message = "รับเงินโบนัส " + totalcredit + " บาท ต้องทำยอดเงินคงเหลือให้ถึง " + TURN_AMOUNT + " บาท จึงจะสามารถถอนได้";
							}
						} else {
							totalcredit = data["amount"];
						}
						(await (await connection).execute("INSERT INTO `logs_transferlog`(`CustomerID`, `WITHDRAW_TYPE`, `WITHDRAW_AMOUNT`, `WITHDRAW_BEFORE`, `WITHDRAW_AFTER`, `WITHDRAW_DATETIME`) VALUES (?,?,?,?,?,?)", [
							customerid,
							process.env.AG_AGENT,
							data["amount"],
							wallet_before,
							wallet_after,
							dayjs().format("YYYY-M-D hh:mm:ss")
						]));
						const k = (await (await connection).execute("select * from logs_transferlog where CustomerID=? and WITHDRAW_STATUS=0 order by WITHDRAW_TXID desc", [customerid]))[0][0];
						if(k) {
							const txid = k.WITHDRAW_TXID;
							(await (await connection).execute("update logs_transferlog set WITHDRAW_STATUS=? where WITHDRAW_TXID=?", [DEPOSIT_TOTAL, txid]))[0][0];
							const form_data = new FormData();
							form_data.append("username", SLOT_USERNAME);
							form_data.append("amount", totalcredit);
							let jsonData = await axios.post("https://mftx.slotxo-api.com/?agent=" + process.env.AG_AGENT + "&method=tc", form_data, {
								headers: form_data.getHeaders()
							});
							let myData = jsonData.data;
							console.log("myData: " + myData);
							if(myData["result"] == "ok") {
								credit_balance = myData["balance"];
								if(bonus > 1) {
									(await (await connection).execute("update logs_transferlog set WITHDRAW_STATUS=2 and BONUS_ID = ? where WITHDRAW_TXID=?", [SL_ID, txid]));
									(await (await connection).execute("INSERT INTO `credit_turnover`(`CustomerID`, `WITHDRAW_TXID`, `CREDIT_AMOUNT`, `TURN_AMOUNT`, `TURN_DATETIME`) VALUES (?,?,?,?,?)", [
										customerid,
										txid,
										totalcredit,
										TURN_AMOUNT,
										dayjs().format("YYYY-M-D hh:mm:ss"),
									]));
									const l = (await (await connection).execute("SELECT * FROM `credit_turnover` WHERE `CustomerID`=? AND `WITHDRAW_TXID`=?", [customerid, txid]))[0][0];
									if(l) {
										const turn_id = l.ID;
										(await (await connection).execute("update logs_transferlog set TURNOVER_ID=? where WITHDRAW_TXID=?", [turn_id, txid]));
									}
								} else {
									(await (await connection).execute("update logs_transferlog set WITHDRAW_STATUS=2 where WITHDRAW_TXID=?", [txid]));
								}
								if(SL_STATUS != "vip") {
									(await (await connection).execute("update account_users set SL_STATUS = 'vip' where CustomerID=? ", [customerid]));
									(await (await connection).execute("INSERT INTO `account_statuslog`(`CustomerID`, `SL_STATUS`, `DATETIME`) VALUES (?,?,?)", [
										customerid, "vip",
										dayjs().format("YYYY-M-D hh:mm:ss"),
									]));
								}
							} else {
								(await (await connection).execute("UPDATE `logs_transferlog` SET `WITHDRAW_STATUS`=3 WHERE `WITHDRAW_TXID`=?", [k.WITHDRAW_TXID]));
								credit_balance = null;
								return {
									message: "การโยกเงินผิดพลาด เนื่องจากระบบปิดปรับปรุงชั่วคราว กรุณารอสักครู่ (1)",
									state: "error",
									code: "102",
								};
							}
							var jbosut;
							if(bonus > 1) {
								jbosut = SL_TITLE;
							} else {
								jbosut = "ไม่รับโบนัสและโปรโมชั่น";
							}
							const myform_data = new FormData();
							let temp1 = totalcredit.toString();
							let mymessage = "\nโยกเงิน " + totalcredit + " บาท\n\nUsername: " + SLOT_USERNAME + "\nหมายเลขโทรศัพท์: " + SL_USERNAME + "\nเวลาที่โยกเงิน: " + dayjs().format("YYYY-M-D h:mm:ss") + " น.\n\nชื่อ นามสกุล: " + SL_FIRSTNAME + " " + SL_LASTNAME + "\nหมายเลขบัญชี: " + SL_BANKID + "\nโบนัส: " + jbosut;
							myform_data.append("message", mymessage);
							var config = {
								method: 'post',
								url: 'https://notify-api.line.me/api/notify',
								headers: {
									'Authorization': 'Bearer ' + process.env.AG_LINE_DEPOSIT,
									...myform_data.getHeaders()
								},
								data: myform_data
							};
							axios(config).then(function(response) {
								console.log(JSON.stringify(response.data));
							}).catch(function(error) {
								console.log(error);
							});
							if(bonus > 1) {
								return {
									message: bonus_message,
									credit: Number(credit_balance).toFixed(2),
									state: "success",
								};
							} else {
								return {
									message: "ย้ายเงินเข้าเกมสำเร็จ จำนวนเงิน " + Number(totalcredit).toFixed(2) + " บาท",
									credit: Number(credit_balance).toFixed(2),
									state: "success",
								};
							}
						}
					}
				}
			}
		} else {
			return {
				message: "การโยกเงินผิดพลาด เนื่องจากระบบปิดปรับปรุงชั่วคราว กรุณารอสักครู่",
				state: "error",
				code: "101",
			};
		}
	} else {
		return {
			message: "ไม่พบบัญชีของลูกค้า",
			state: "error",
		};
	}
}
module.exports = {
	transfer
};