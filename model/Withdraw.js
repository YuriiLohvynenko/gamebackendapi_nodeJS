const connection = require("../connection.js");
const crypt = require("crypto");
var dayjs = require("dayjs");
const axios = require("axios");
const FormData = require("form-data");
async function withdrow(data) {
  const io = (await (await connection).execute("select * from account_session where SL_SESSION=? and SL_LOGINIP=?", [data["token"], data["ip"]]))[0][0];
  if(io) {
    const customerid = io.CustomerID;
    var a = (await (await connection).execute("select * from credit_withdrawlog where CustomerID=? and WITHDRAW_STATUS=1", [customerid]))[0][0];
    if(a) {
      return "ไม่สามารถถอนได้! มีรายการถอนกำลังรอดำเนินการ";
    }
    a = (await (await connection).execute("select * from account_users where CustomerID=?", [customerid]))[0][0];
    var SLOT_USERNAME;
    var SL_USERNAME;
    var SL_FIRSTNAME;
    var SL_LASTNAME;
    var SL_BANKID;
    var BANK_ID;
    var SL_STATUS;
    var freecredit_user;
    if(a) {
      SLOT_USERNAME = a.SLOT_USER;
      SL_USERNAME = a.SL_USERNAME;
      SL_FIRSTNAME = a.SL_FIRSTNAME;
      SL_LASTNAME = a.SL_LASTNAME;
      SL_BANKID = a.SL_BANKID;
      BANK_ID = a.SL_BANK_ID;
      SL_STATUS = a.SL_STATUS;
      if(SL_STATUS == "free") {
        freecredit_user = 1;
      } else {
        freecredit_user = 0;
      }
    } else {
      return "ไม่พบยูสเซอร์";
    }
    // const refId = (
    //   await (
    //     await connection
    //   ).execute("select * from credit_withdrawlog where REFID=?", [
    //     data["refId"],
    //   ])
    // )[0][0];
    // if (refId) {
    //   return {
    //     message: "ไม่สามารถถอนเงินได้ เลขรายการซ้ำกัน",
    //     state: "error",
    //   };
    // }
    const form_data = new FormData();
    form_data.append("username", SLOT_USERNAME);
    let jsonData = await axios.post("https://mftx.slotxo-api.com/?agent=" + process.env.AG_AGENT + "&method=gc", form_data, {
      headers: form_data.getHeaders()
    });
    let myData = jsonData.data;
    console.log(myData["balance"]);
    if(myData["result"] == "ok") {
      var mybalance = myData["balance"].toString();
      let credit_before = mybalance.replace(",", "");
      // credit_before = 600; //temp data
      if(credit_before < 300) {
        return "ลูกค้าจำเป็นต้องถอนเงินขั้นต่ำ 300 บาท";
      } 
      else {
        if(freecredit_user == 1) {
          if(credit_before < 500) {
            return "ท่านติดสถานะเครดิตฟรี จำเป็นต้องถอนขั้นต่ำ 500.00 บาท";
          }
        }
        if(credit_before < 5) {
          (await connection).execute("update credit_turnover set TURN_STATUS=1 where CustomerID=? and TURN_STATUS=0");
        }
        if(freecredit_user == 1 && credit_before < 500) {
          return "ท่านมียอดเงินคงเหลือไม่เพียงพอ จำเป็นต้องมียอดเงินคงเหลืออย่างน้อย 500.00 บาท";
        }
        if(freecredit_user == 0 && credit_before < 300) {
          return("ยอดเงินคงเหลือต่ำกว่า 300.00 ไม่สามารถถอนได้ ตอนนี้ท่านมี " + Number(credit_before).toFixed(2) + " บาท");
        }
        if(freecredit_user != 1) {
          d = (await (await connection).execute("select * from logs_transferlog where CustomerID=? order by WITHDRAW_TXID desc", [customerid]))[0][0];
          if(d) {
            const TURNOVER_ID = d.TURNOVER_ID;
            console.log(TURNOVER_ID);
            const WITHDRAW_AMOUNT = d.WITHDRAW_AMOUNT;
            console.log(WITHDRAW_AMOUNT);
            if(TURNOVER_ID == null || TURNOVER_ID == "") {
              if(WITHDRAW_AMOUNT == credit_before) {
                return "ลูกค้าจำเป็นต้องมีรายการเล่นอย่างน้อย 1 ครั้ง";
              }
            } 
            else {
              const f = (await (await connection).execute("SELECT * FROM `credit_turnover` WHERE `ID`=?", [TURNOVER_ID]))[0][0];
              if(f) {
                const TURN_AMOUNT = f.TURN_AMOUNT;
                if(TURN_AMOUNT > credit_before) {
                  return("ลูกค้าต้องทำยอดคงเหลือให้ถึง " + Number(TURN_AMOUNT).toFixed(2) + " บาท");
                }
              } else {
                return "ไม่สามารถเช็คยอดเทรินได้";
              }
            }
          }
        }
        if(credit_before < 300) {
          return "เครดิตของลูกค้าไม่เพียงพอสำหรับการถอน";
        } 
        else {
          const form_data = new FormData();
          form_data.append("username", SLOT_USERNAME);
          form_data.append("amount", "-" + credit_before);
          let jsonData = await axios.post("https://mftx.slotxo-api.com/?agent=" + process.env.AG_AGENT + "&method=tc", form_data, {
            headers: form_data.getHeaders()
          });
          let myData = jsonData.data;
          console.log(myData);
          let mycondition = "ok"; //myData["result"]
          if(myData["result"] == "ok") {
            let credit_after = myData["balance"];
            // credit_after = 300;
            if(freecredit_user == 1) {
              credit_before = 50;
            } 
            else {
              const transfer = (await (await connection).execute("select * from logs_transferlog where CustomerID=? order by WITHDRAW_DATETIME desc", [customerid]))[0][0];
              if(transfer) {
                if(transfer.BONUS_ID == 0) {
                  credit_before = credit_before;
                } else {
                  if(transfer.BONUS_ID > 4) {
                    const i = (await (await connection).execute("select * from logs_transferlog where CustomerID=? order by WITHDRAW_DATETIME desc", [customerid]))[0][0];
                    if(i) {
                      if(i.SL_WITHDRAW == 0) {
                        credit_before = credit_before;
                      } else {
                        credit_before = i.SL_WITHDRAW;
                      }
                    } else {
                      return "ไม่สามารถถอนเงินได้คะ เนื่องจากไม่พบโบนัสในระบบ กรุณาติดต่อแอดมินคะ";
                    }
                  }
                }
              }
            }
            await (await connection).execute("insert into credit_withdrawlog (CustomerID,WITHDRAW_AMOUNT,WITHDRAW_BEFORE,WITHDRAW_AFTER,WITHDRAW_DATETIME,WITHDRAW_STATUS) values(?,?,?,?,?,?)", [
              customerid,
              credit_before,
              credit_before,
              credit_after,
              dayjs().format("YYYY-M-D H:mm:ss"),
              0
            ]);
            const g = (await (await connection).execute("select * from credit_withdrawlog where CustomerID=? and WITHDRAW_STATUS=? order by WITHDRAW_TXID desc", [customerid, 0]))[0][0];
            if(g) {
              const txid = g.WITHDRAW_TXID;
              const WITHDRAW_DATETIME = g.WITHDRAW_DATETIME;
              await (await connection).execute("update credit_turnover set TURN_STATUS=1 where CustomerID=? and TURN_STATUS=0", [customerid]);
              await (await connection).execute("update credit_withdrawlog set WITHDRAW_STATUS=1 where WITHDRAW_TXID=?", [txid]);
              const h = (await (await connection).execute("select * from bank_information where BANK_ID=?", [
                BANK_ID,
              ]))[0][0];
              var BANK_NAME;
              if(h) {
                BANK_NAME = h.BANK_NAME;
              }
              const myform_data = new FormData();
              // let username_temp = SLOT_USERNAME.toString();
              // let temp2 = username_temp.toUpperCase();
              let mymessage = Number(credit_before).toFixed(2) + " บาท\n\nUsername: " + SLOT_USERNAME + "\nหมายเลขโทรศัพท์: " + SL_USERNAME + "\nเวลาที่แจ้งถอน: " + WITHDRAW_DATETIME + " น.\n\nชื่อ นามสกุล: " + SL_FIRSTNAME + " " + SL_LASTNAME + "\nธนาคาร: " + BANK_NAME + "\nหมายเลขบัญชี: " + SL_BANKID;
              myform_data.append("message", mymessage);
              var config = {
                method: 'post',
                url: 'https://notify-api.line.me/api/notify',
                headers: {
                  'Authorization': 'Bearer ' + process.env.AG_LINE_WITHDRAW,
                  ...myform_data.getHeaders()
                },
                data: myform_data
              };
              axios(config).then(function(response) {
                console.log(JSON.stringify(response.data));
              }).catch(function(error) {
                console.log(error);
              });
              return 1;
            } else {
              return "มีอะไรบางอย่างผิดพลาด";
            }
          } else {
            return "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาติดต่อแอดมิน";
          }
        }
      }
    } else {
      return "ไม่สามารถเช็คเครดิตได้ กรุณาลองอีกครั้งหรือติดต่อแอดมิน";
    }
  } else {
    return "ไม่พบบัญชีของลูกค้า";
  }
}
module.exports = {
  withdrow
};