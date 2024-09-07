const connection = require("../connection.js");
const crypt = require("crypto");
var dayjs = require("dayjs");
const axios = require("axios");
const FormData = require('form-data');

async function Truewallet(data) {
  const bank = (
    await (await connection).execute(
      "select * from bank_setting where bank_type=22 and bank_status=0"
    )
  )[0][0];

  if (bank) {
    const user = (
      await (
        await connection
      ).execute("select * from account_users where CustomerID=?", [
        data["customerid"],
      ])
    )[0][0];

    if (user) {
      var SL_USERNAME = user.SL_USERNAME;
      var CustomerID = user.CustomerID;
      var SL_BANKID = user.SL_BANKID;
      var SLOT_USER = user.SLOT_USER;

      const replace_gift = data["gift"].replace(
        "https://gift.truemoney.com/campaign/?v=",
        ""
      );

      if (!replace_gift) {
        return {
          message: "ลิ้งค์ของขวัญไม่ถูกต้อง",
          state: "error",
        };
      }
      console.log(replace_gift);
      var jsonData = "";
      try {
        jsonData = 
          await axios.get(
            "https://gift.truemoney.com/campaign/vouchers/" +
              replace_gift +
              "/verify?mobile=" +
              bank.bank_number
          );

          console.log("jsondata" +jsonData);
      } catch (e) {
        jsonData = e.response.data
      }
      console.log(jsonData.status.code);
      // jsonData.status.code = "SUCCESS"; // temp data
      if (jsonData.status.code == "VOUCHER_NOT_FOUND") {
        return {
          message: "ไม่พบซองของขวัญนี้!",
          state: "error",
        };
      } else if (
        jsonData.status.code == "TARGET_USER_REDEEMED" ||
        jsonData.status.code == "VOUCHER_OUT_OF_STOCK"
      ) {
        return {
          message: "ซองของขวัญนี้ถูกใช้ไปแล้ว!",
          state: "error",
        };
      } else if (jsonData.status.code == "SUCCESS") {
        var jsonData2 = "";
        try {
          jsonData2 = 
            await axios.post(
              "https://gift.truemoney.com/campaign/vouchers/" +
                replace_gift +
                "/redeem",
              { mobile: bank.bank_number, voucher_hash: replace_gift },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            console.log("jsondata2" +jsonData2);
        } catch (e) {
          jsonData2 = e.response.data
        }

        console.log(jsonData2);
        // jsonData2["status"]["code"] = "SUCCESS"; //temp data
        if (jsonData2["status"]["code"] != "SUCCESS") {
          return {
            message: "ไม่สามารถเติมเงินได้!",
            state: "error",
          };
        } else {
          var BALANCE_BEFORE;
          var amount_baht = Number(jsonData.data.voucher.amount_baht);
          const amount = amount_baht.toFixed(2);

          await (
            await connection
          ).execute(
            "insert into bank_transaction (DEPOSIT_WALLET_ID,DEPOSIT_CLIENTID,DEPOSIT_AMOUNT,DEPOSIT_DATE,DEPOSIT_OWNER,DEPOSIT_OWNERCODE,DEPOSIT_BANKCODE,DEPOSIT_TXSTATUS) values(?,?,?,?,?,?,?,?)",
            [
              replace_gift,
              SL_USERNAME,
              amount,
              dayjs().format("YYYY-M-D H:mm:ss"),
              bank.bank_name,
              "WALLET",
              "WALLET",
              2,
            ]
          );

          const logs_balance = (
            await (
              await connection
            ).execute("select * from logs_balance where CustomerID=?", [
              CustomerID,
            ])
          )[0][0];

          if (!logs_balance) {
            (
              await connection
            ).execute("insert into logs_balance (CustomerID) values(?)", [
              CustomerID,
            ]);
          } else {
            BALANCE_BEFORE = logs_balance.SL_BALANCE;
          }
          console.log("amount" + amount);
          await (
            await connection
          ).execute(
            "UPDATE `logs_balance` SET `SL_DEPOSIT`=cast(`SL_DEPOSIT` as decimal(14,2))+?,`SL_BALANCE`=cast(`SL_BALANCE` as decimal(14,2))+? WHERE `CustomerID`=?",
            [amount, amount, CustomerID]
          );


          const balance2 = (
            await (
              await connection
            ).execute("select * from logs_balance where CustomerID=?", [
              CustomerID,
            ])
          )[0][0];

          const BALANCE_AFTER = balance2.SL_BALANCE;

          if (
            BALANCE_BEFORE != BALANCE_AFTER &&
            BALANCE_BEFORE < BALANCE_AFTER
          ) {
            await (
              await connection
            ).execute(
              "insert into logs_depositlog (CustomerID,DEPOSIT_TYPE,DEPOSIT_TXID,DEPOSIT_AMOUNT,WALLET_BEFORE,WALLET_AFTER,DEPOSIT_DATETIME,DEPOSIT_STATUS) values(?,?,?,?,?,?,?,?)",
              [
                CustomerID,
                "wallet",
                replace_gift,
                amount,
                BALANCE_BEFORE,
                BALANCE_AFTER,
                dayjs().format("YYYY-M-D H:mm:ss"),
                2,
              ]
            );
            const myform_data = new FormData();
            let mymessage = amount +
              " บาท\n\nBANKID: " +
              SL_BANKID +
              "\nUsername: " +
              SLOT_USER.toUpperCase() +
              "\nหมายเลขโทรศัพท์: " +
              SL_USERNAME +
              "\nเวลาที่ฝากเงิน: " +
              dayjs().format("YYYY-M-D H:mm:ss") +
              " น.\nวอลเล็ทซองของขวัญ: " +
              bank.bank_number +
              "\nโค้ดซองของขวัญ: " +
              replace_gift;
            myform_data.append("message", mymessage);

            var config = {
              method: 'post',
              url: 'https://notify-api.line.me/api/notify',
              headers: { 
                'Authorization': 'Bearer ' + process.env.AG_LINE_DEPOSIT, 
                ...myform_data.getHeaders()
              },
              data : myform_data
            };
            console.log(config);
            axios(config)
            .then(function (response) {
              
              console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
              console.log(error);
            });
            

            return {
              message: "เติมเงินสำเร็จ จำนวน " + amount + "!",
              state: "success",
            };
          } else {
            return {
              message: "มีบางอย่างผิดพลาดกรุณาติดต่อแอดมิน!",
              state: "error",
            };
          }
        }
      }
    } else {
      return {
        message: "ไม่พบยูสเซอร์",
        state: "error",
      };
    }
  } else {
    return {
      message: "แจ้งปิดระบบฝากเงินช่องทาง TrueMoney Wallet ชั่วคราว",
      state: "error",
    };
  }
}

async function registerUser(data) {
  const flag = (
    await (
      await connection
    ).execute("select * from account_users where SL_USERNAME=?", [
      data["SL_USERNAME"],
    ])
  )[0][0];

  if (!flag) {
    const flag1 = (
      await (
        await connection
      ).execute(
        "select * from account_users where SL_FIRSTNAME=? and SL_LASTNAME=?",
        [data["SL_FIRSTNAME"], data["SL_LASTNAME"]]
      )
    )[0][0];

    if (flag1) {
      return 2;
    } else {
      const oc = (
        await (
          await connection
        ).execute("select * from bank_information where BANK_CODE_X=?", [
          data["SL_BANK_ID"],
        ])
      )[0][0];

      if (!oc) {
        return 5;
      }

      if (oc.BANK_ID == 1) {
        const flag2 = (
          await (
            await connection
          ).execute(
            "select * from account_users where SL_BANK_ID=? and SL_BANKID like '" +
              "%" +
              data["SL_BANKID"].slice(-3) +
              "'",
            [1]
          )
        )[0][0];
        if (!flag2[0].SL_BANKID) {
          return 3;
        }
      } else {
        const flag3 = (
          await (
            await connection
          ).execute(
            "select * from account_users where SL_BANK_ID=? and SL_BANKID like '" +
              "%" +
              data["SL_BANKID"].slice(-5) +
              "'",
            [oc.BANK_ID]
          )
        )[0][0];

        if (flag3 && flag3.SL_BANKID) {
          return 3;
        }
      }
      const form_data = new FormData();
      form_data.append('username', data["SLOT_USER"]);
      form_data.append('password', data["SL_PASSWORD"]);
      console.log(data["SLOT_USER"]);
      let jsonData = await axios.post("https://mftx.slotxo-api.com/?agent=" +
      process.env.AG_AGENT +
      "&method=cu", form_data, 
          { headers: form_data.getHeaders() });
      // let data = res.data;
      // const jsonData = (
      //   await axios.post(
      //     "https://mftx.slotxo-api.com/?agent=" +
      //       process.env.AG_AGENT +
      //       "&method=cu",
      //     { username: data["SLOT_USER"], password: data["SL_PASSWORD"] }
      //   )
      // )["data"];
      let myData = jsonData.data;
      console.log(myData);
      if ((myData["result"] == "ok")) {
        // Register Success

        const arr = [
          data["SLOT_USER"],
          data["SL_USERNAME"],
          crypt.createHash("md5").update(data["SL_PASSWORD"]).digest("hex"),
          data["SL_FIRSTNAME"],
          data["SL_LASTNAME"],
          data["SL_REGISIP"],
          data["SL_REGISDATE"],
          oc.BANK_ID,
          data["SL_BANKID"],
          data["SL_LINEID"],
          data["SL_FREECODE"],
          data["SL_REFERER"],
          data["SL_SEX"],
          data["SL_AGE"],
        ];

        await (await connection).execute(
          "insert into account_users (SLOT_USER,SL_USERNAME,SL_PASSWORD,SL_FIRSTNAME,SL_LASTNAME,SL_REGISIP,SL_REGISDATE,SL_BANK_ID,SL_BANKID,SL_LINEID,SL_FREECODE,SL_REFERER,SL_SEX,SL_AGE) value(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          arr
        );

        return 1;
      } else {
        return 4;
      }
    }
  } else {
    return 0;
  }
}

async function checkUser(data) {
    const flag = (
      await (
        await connection
      ).execute("select * from account_users where SL_USERNAME=?", [
        data["username"],
      ])
    )[0][0];
    if(flag){
      return 0;
    }
    else{
      return 1;
    }
}

async function login(data) {
  const result = (await (
    await connection
  ).execute(
    "SELECT * FROM `account_users` where `SL_USERNAME`=? and SL_PASSWORD=?",
    [
      data["username"],
      crypt.createHash("md5").update(data["password"]).digest("hex")
    ])
  )[0][0];

  if (result) {
    const customerid = result.CustomerID;
    const sl_sessionsha1 = crypt
      .createHash("sha1")
      .update(
        data["ip"] +
          "|" + dayjs().format("YYYY-M-D H:mm:ss") +
          "|" +
          data["password"]
      )
      .digest("hex");

    const sl_session = (await (
      await connection
    ).execute("select * from account_session where CustomerID=?", [
      customerid,
    ]))[0][0];

    if (sl_session) {
      await (
        await connection
      ).execute(
        "Update account_session set SL_SESSION=?,SL_LOGINIP=?,DATE=? where CustomerID=?",
        [
          sl_sessionsha1,
          data["ip"],
          dayjs().format("YYYY-M-D H:mm:ss"),
          customerid,
        ]
      );
    } else {
      await (
        await connection
      ).execute(
        "INSERT INTO account_session (CustomerID,SL_SESSION,DATE,SL_LOGINIP) values (?,?,?,?) ",
        [
          customerid,
          sl_sessionsha1,
          dayjs().format("YYYY-M-D H:mm:ss"),
          data["ip"],
        ]
      );
    }

    await (
      await connection
    ).execute("UPDATE account_users set SL_LASTLOGIN=? where CustomerID=?", [
      dayjs().format("YYYY-M-D H:mm:ss"),
      customerid,
    ]);

    var bankname, bankcode;

    var d = (
      await (
        await connection
      ).execute("select * from bank_information where BANK_ID=?", [
        result.SL_BANK_ID,
      ])
    )[0][0];

    if (d) {
      bankname = d.BANK_NAME;
      bankcode = d.BANK_CODE;
    } else {
      bankname = null;
      bankcode = null;
    }

    return {
      message: "Login Successfully!",
      token: sl_sessionsha1,
      password: data["password"],
      ip: data["ip"],
      uid: customerid,
      user: result.SLOT_USER,
      username: result.SL_USERNAME,
      firstname: result.SL_FIRSTNAME,
      lastname: result.SL_LASTNAME,
      bankname: bankname,
      bankid: result.SL_BANKID,
      bankcode: bankcode,
      regisdate: result.SL_REGISDATE,
      state: "success",
    };
  } else {
    return {
      message: "Username หรือ Password ผิดพลาด โปรดตรวจสอบข้อมูล",
      state: "error",
    };
  }
}

async function getCredit(data) {
  var io = (
    await (
      await connection
    ).execute(
      "SELECT * FROM `account_session` WHERE `SL_SESSION` = ? AND `SL_LOGINIP` = ?",
      [data["token"], data["ip"]]
    )
  )[0][0];

  if (io) {
    const customerid = io.CustomerID;
    const b = (
      await (
        await connection
      ).execute("SELECT * FROM `account_users` WHERE `CustomerID` = ?", [
        customerid,
      ])
    )[0][0];

    if (b) {
      const SLOT_USERNAME = b.SLOT_USER;
      const form_data = new FormData();
      form_data.append("username", SLOT_USERNAME);
      let jsonData = await axios.post("https://mftx.slotxo-api.com/?agent=" +
        process.env.AG_AGENT +
        "&method=gc", form_data, 
        { headers: form_data.getHeaders() });
      let myData = jsonData.data;
      console.log(myData["balance"]);

      if (myData["result"] == "ok") {
        var mybalance = myData["balance"].toString();
        let credit_balance = mybalance.replace(",", "");
        if (credit_balance < 5) {
          {
            await (
              await connection
            ).execute(
              "Update credit_turnover set TURN_STATUS=1 where CustomerID=?",
              [customerid]
            );
          }
        } else {
          return {
            message: myData["balance"],
            state: "success",
          };
        }
      } else {
        return {
          message: "ระบบมีปัญหา ไม่สามารถเช็คเครดิตได้",
          state: "error",
        };
      }
    } else {
      return {
        message: "ไม่พบยูสเซอร์",
        state: "error",
      };
    }
  }
}

async function getProfile(data) {
  const io = (
    await (
      await connection
    ).execute(
      "Select * from account_session where SL_SESSION = ? and SL_LOGINIP = ?",
      [data["token"], data["ip"]]
    )
  )[0][0];

  if (io) {
    const customerid = io.CustomerID;
    const b = (
      await (
        await connection
      ).execute("SELECT * FROM `account_users` WHERE `CustomerID` = ?", [
        customerid,
      ])
    )[0][0];

    if (b) {
      firstname = b.SL_FIRSTNAME;
      lastname = b.SL_LASTNAME;
      bankid = b.SL_BANKID;
      lineid = b.SL_LINEID;
      regisdate = b.SL_REGISDATE;
      SL_USERNAME = b.SL_USERNAME;
      SLOT_USER = b.SLOT_USER;
      const form_data = new FormData();
      form_data.append('username', SLOT_USER);
      console.log(SLOT_USER);
      let jsonData = await axios.post("https://mftx.slotxo-api.com/?agent=" +
      process.env.AG_AGENT +
      "&method=gc", form_data, 
          { headers: form_data.getHeaders() });

      let myData = jsonData.data;
      console.log(myData);
      // const jsonData = (
      //   await axios.post(
      //     "https://connect.mafia88.club/?agent=" +
      //       process.env.AG_AGENT +
      //       "&method=gc",
      //     { username: SLOT_USER }
      //   )
      // )["data"];

      if (myData["result"] == "ok") {
        // const credit_balance = (myData["balance"].toString()).replace(",", "");
        var credit_balance = myData["balance"];
        
        if (credit_balance < 5) {
          {
            await (
              await connection
            ).execute(
              "update credit_turnover set TURN_STATUS=1 where CustomerID=? and TURN_STATUS=?",
              [customerid, 0]
            );
          }
        }
        var DEPOSIT_TOTAL = 0;
        var TRANSFER_TOTAL = 0;
        var WITHDRAW_TOTAL = 0;

        const aa = (
          await (
            await connection
          ).execute(
            "SELECT DISTINCT `DEPOSIT_TXID` FROM `logs_depositlog` WHERE `CustomerID`=? GROUP BY `DEPOSIT_TXID`",
            [customerid]
          )
        )[0]; //updated

        for (var res of aa) { //updated
          var bb = (
            await (
              await connection
            ).execute(
              "select * from logs_depositlog where DEPOSIT_TXID=? and CustomerID=? ",
              [res.DEPOSIT_TXID, customerid]
            )
          )[0][0];

          DEPOSIT_TOTAL += bb.DEPOSIT_AMOUNT;
        }

        const cc = (await (
          await connection
        ).execute(
          "select distinct WITHDRAW_TXID from logs_transferlog where CustomerID=? and WITHDRAW_STATUS=? group BY WITHDRAW_TXID",
          [customerid, 2]
        ))[0][0];

        var WITHDRAW_TOTAL = 0;
        for (res in cc) {
          d = (
            await (
              await connection
            ).execute(
              "select * from logs_transferlog where WITHDRAW_TXID=? and CustomerID=?",
              [res.WITHDRAW_TXID, customerid]
            )
          )[0][0];

          WITHDRAW_TOTAL += d.WITHDRAW_AMOUNT;
        }
        var WALLET_BALANCE = 0;
        const ee = (
          await (
            await connection
          ).execute("select * from logs_balance where CustomerID=?", [
            customerid,
          ])
        )[0][0];

        if (ee) {
          var OLD_BALANCE = ee.SL_BALANCE_OLD;
          WALLET_BALANCE = OLD_BALANCE + DEPOSIT_TOTAL - TRANSFER_TOTAL;
        }

        if (WALLET_BALANCE < 0) {
          WALLET_BALANCE = 0;
        }

        await (
          await connection
        ).execute(
          "update logs_balance set SL_DEPOSIT=?,SL_WITHDRAW=?,SL_BALANCE=? where CustomerID = ?",
          [DEPOSIT_TOTAL, TRANSFER_TOTAL, WALLET_BALANCE, customerid]
        );
      } else {
        await (
          await connection
        ).execute(
          "insert into logs_balance (CustomerID,SL_DEPOSIT,SL_WITHDRAW,SL_BALANCE) values (?,?,?,?)",
          [customerid, 0, 0, 0]
        );
        WALLET_BALANCE = 0;
      }

      const d = (
        await (
          await connection
        ).execute("select * from bank_information where BANK_ID=?", [
          b.SL_BANK_ID,
        ])
      )[0][0];
      var bankname = "";
      var bankcode = "";
      if (d) {
        bankname = d.BANK_NAME;
        bankcode = d.BANK_CODE;
      } else {
        bankname = null;
        bankcode = null;
      }

      const g = (
        await (await connection).execute(
          "select * from credit_turnover where CustomerID and TURN_STATUS = 0 order by ID desc"
        )
      )[0][0];

      var turn = 0;
      if (g) {
        turn = g.TURN_AMOUNT;
      }
      console.log(bankcode);
      console.log(credit_balance);
      var sbankcode = "";
      if(bankcode !== null){
        sbankcode = bankcode.toString();
      }
      return {
        slotuser: SLOT_USER,
        username: SL_USERNAME,
        firstname: firstname,
        lastname: lastname,
        bankname: bankname,
        bankid: bankid,
        lineid: lineid,
        regisdate: regisdate,
        bankcode: sbankcode.toLowerCase(),
        balance: Number(WALLET_BALANCE).toFixed(2),
        credit: Number(credit_balance).toFixed(2),
        turnover: turn,
        total_deposit: Number(DEPOSIT_TOTAL).toFixed(2),
        total_withdraw: Number(WITHDRAW_TOTAL).toFixed(2),
        state: "success",
      };
    } else {
      return {
        message: "ไม่สามารถเชื่อมจ่อกับเซริฟ์เวอร์ได้ กรุณาติดต่อแอดมิน",
        state: "error",
      };
    }
  } else {
    return {
      message: "ไม่พบยูสเซอร์",
      state: "error",
    };
  }
}

async function getCoupon(data) {
  const io = (
    await (
      await connection
    ).execute(
      "select * from account_session where SL_SESSION=?  and SL_LOGINIP=?",
      [data.token, data.ip]
    )
  )[0][0];

  if (io) {
    const customerid = io.CustomerID;
    const b = (
      await (
        await connection
      ).execute("select * from account_users where CustomerID=?", [customerid])
    )[0][0];

    if (b) {
      var SLOT_USER = b.SLOT_USER;
      var SL_FREECODE = b.SL_FREECODE;
      var SL_STATUS = b.SL_STATUS;

      const code = (
        await (
          await connection
        ).execute("select * from table_coupon where CODE=?", [data["code"]])
      )[0][0];

      if (code) {
        if (code.STATUS == 1) {
          return {
            message: "ขออภัยคะ โค้ดถูกใช้งานไปแล้ว!",
            state: "error",
          };
        }
        if (SL_STATUS == "free") {
          return {
            message: "ขออภัยคะ คุณติดสถานะฟรีเครดิต กรุณาเติมเงินเพื่อปลดล็อค!",
            state: "error",
          };
        }

        var FREECREDIT_NORMAL = code.AMOUNT;
        var FREECREDIT_VIP = code.AMOUNT;

        var freecredit;
        if (SL_STATUS == "vip") {
          freecredit = FREECREDIT_VIP;
        } else if (SL_STATUS == "normal") freecredit = FREECREDIT_NORMAL;
        else {
          return {
            message: "ขออภัย ลูกค้าไม่สามารถรับเครดิตฟรีซ้ำได้คะ",
            state: "error",
          };
        }

        const form_data = new FormData();
        form_data.append("username", SLOT_USER);
        let jsonData = await axios.post("https://mftx.slotxo-api.com/?agent=" +
        process.env.AG_AGENT +
        "&method=gc", form_data, 
        { headers: form_data.getHeaders() });
        let myData = jsonData.data;
        console.log(myData["balance"]);


        if (myData["result"] == "ok") {
          var mybalance = myData["balance"].toString();
          let credit_before = mybalance.replace(",", "");

          if (credit_before < 5) {
            await (await connection).execute(
              "update credit_turnover set TURN_STATUS =1 where CustomerID=? and TURN_STATUS=0"
            );

            const form_data2 = new FormData();
            form_data2.append("username", SLOT_USER);
            form_data2.append("amount", freecredit);
            let jsonData2 = await axios.post("https://mftx.slotxo-api.com/?agent=" +
            process.env.AG_AGENT +
            "&method=tc", form_data2, 
              { headers: form_data2.getHeaders() });
            let myData2 = jsonData2.data;

            if (myData2["result"] == "ok") {
              {
                await (
                  await connection
                ).execute("update table_coupon set STATUS=1 and DATE_TIME=? and CustomerID=? where ID=?", [
                  dayjs().format("Y-M-D"),
                  customerid,
                  code.ID
                ]);
              }
              if (SL_STATUS != "free") {
                {
                  await (
                    await connection
                  ).execute(
                    "update account_users set SL_STATUS = free where CustomerID=?",
                    [customerid]
                  );
                }

                await (
                  await connection
                ).execute(
                  "insert into account_statuslog (CustomerID,SL_STATUS,DATETIME) values(?,?,?)",
                  [customerid, "free", dayjs().format("YYYY-M-D H:mm:ss")]
                );
              }

              return {
                message:
                  "ยินดีด้วยคะ ลูกค้ารับเครดิตฟรีสำเร็จแล้ว ยอดเงินคงเหลือคือ " +
                  myData2["balance"] +
                  " บาท",
                state: "success",
              };
            } else {
              return {
                message: "รับเครดิตฟรีไม่สำเร็จ กรุณาติดต่อแอดมินคะ",
                state: "error",
              };
            }
          } else {
            return {
              message:
                "ลูกค้าไม่สามารถรับเครดิตฟรีได้คะ เนื่องจากมีเครดิตมากกว่า 5 บาท",
              state: "error",
            };
          }
        } else {
          return {
            message:
              "ระบบผิดพลาดไม่สามารถเช็คเงินลูกค้าได้คะ กรุณาลองใหม่พายหลัง",
            state: "error",
          };
        }
      } else {
        if (SL_FREECODE != data["code"]) {
          return {
            message: "โค้ดเครดิตฟรีไม่ถูกต้อง",
            state: "error",
          };
        }

        const flag = (
          await (
            await connection
          ).execute("select * from credit_freelog where CustomerID=?", [
            customerid,
          ])
        )[0][0];

        if (flag) {
          return {
            message: "ลูกค้าเคยรับเครดิตฟรีแล้วคะ",
            state: "error",
          };
        }

        const h = (
          await (await connection).execute(
            "select * from codesms_setting where ID=11"
          )
        )[0][0];

        var maxuser = "0";
        if (h) {
          if (h.status == 0) {
            maxuser = h.Max_user;
          } else {
            maxuser = "0";
          }
        } else {
          maxuser = "0";
        }

        const j = (
          await (
            await connection
          ).execute("select * from credit_freelog where FREE_DATETIME = ?", [
            dayjs().format("Y-M-D"),
          ])
        )[0].length;

        if (j > Number(maxuser)) {
          return {
            message:
              "ขออภัย เครดิตฟรีเต็มแล้วคะ ลูกค้าสามารถรับได้อีกทีในวันถัดไปนะคะ ขอบคุณคะ",
            state: "error",
          };
        }

        const k = (
          await (await connection).execute("select * from codesms_setting")
        )[0][0];

        const FREECREDIT_NORMAL = k.Max_credit;
        const FREECREDIT_VIP = k.Max_credit;
        var freecredit;
        if (SL_STATUS == "vip") {
          freecredit = FREECREDIT_VIP;
        } else if (SL_STATUS == "normal") {
          freecredit = FREECREDIT_NORMAL;
        } else {
          return {
            message: "ขออภัย ลูกค้าไม่สามารถรับเครดิตฟรีซ้ำได้คะ",
            state: "error",
          };
        }

        const p = (
          await (
            await connection
          ).execute("select * from credit_freelog where CustomerID=?", [
            customerid,
          ])
        )[0][0];

        if (!p) {
          const form_data = new FormData();
          form_data.append("username", SLOT_USER);
          let jsonData = await axios.post("https://mftx.slotxo-api.com/?agent=" +
            process.env.AG_AGENT +
            "&method=gc", form_data, 
              { headers: form_data.getHeaders() });
          let myData = jsonData.data;

          console.log(myData);

          if (myData["result"] == "ok") {
            var mybalance = myData["balance"].toString();
            let credit_before = mybalance.replace(",", "");
            // credit_before = 2; //temp data
            if (credit_before < 5) {
              const form_data2 = new FormData();
              form_data2.append("username", SLOT_USER);
              form_data2.append("amount", freecredit);
              let jsonData2 = await axios.post("https://mftx.slotxo-api.com/?agent=" +
              process.env.AG_AGENT +
              "&method=tc", form_data2, 
                { headers: form_data2.getHeaders() });
              let myData2 = jsonData2.data;

              console.log(myData2);

              if (myData2["result"] == "ok") {
                await (
                  await connection
                ).execute(
                  "insert into credit_freelog (CustomerID,FREE_CODE,FREE_AMOUNT,FREE_DATETIME) values(?,?,?,?)",
                  [
                    customerid,
                    data["code"],
                    freecredit,
                    dayjs().format("YYYY-M-D H:mm:ss"),
                  ]
                );

                if (SL_STATUS != "free") {
                  (
                    await (
                      await connection
                    ).execute(
                      "update account_users set SL_STATUS='free' where CustomerID=?",
                      [customerid]
                    )
                  )[0][0];

                  await (
                    await connection
                  ).execute(
                    "insert into account_statuslog (CustomerID,SL_STATUS,DATETIME) values(?,?,?)",
                    [
                      customerid,
                      'free',
                      dayjs().format("YYYY-M-D H:mm:ss"),
                    ]
                  );
                }

                return {
                  message:
                    "ยินดีด้วยคะ ลูกค้ารับเครดิตฟรีสำเร็จแล้ว ยอดเงินคงเหลือคือ " +
                    myData2["balance"] +
                    " บาท",
                  state: "success",
                };
              } else {
                return {
                  message: "รับเครดิตฟรีไม่สำเร็จ กรุณาติดต่อแอดมินคะ",
                  state: "error",
                };
              }
            } else {
              return {
                message:
                  "ลูกค้าไม่สามารถรับเครดิตฟรีได้คะ เนื่องจากมีเครดิตมากกว่า 5 บาท",
                state: "error",
              };
            }
          } else {
            return {
              message:
                "ระบบผิดพลาดไม่สามารถเช็คเงินลูกค้าได้คะ กรุณาลองใหม่พายหลัง",
              state: "error",
            };
          }
        } else {
          return {
            message:
              "ลูกค้าไม่สามารถรับเครดิตฟรีได้คะ เนื่องจากเคยรับเครดิตฟรีไปแล้ว",
            state: "error",
          };
        }
      }
    }
  } else {
    return {
      message: "ไม่พบยูสเซอร์",
      state: "error",
    };
  }
}

async function getBankv2() {
  const bank = (
    await (await connection).execute(
      "select * from bank_setting where bank_status=0 order by rating asc"
    )
  )[0];

  const master = [];
  for (var res of bank) {
    var infor = (
      await (
        await connection
      ).execute("select * from bank_information where BANK_ID=?", [
        res.bank_type,
      ])
    )[0][0];
    var name_en="", name_th="";
    if(infor){
      name_en = infor.BANK_CODE.toLowerCase();
      name_th = infor.BANK_NAME;
    }

    var namefi = res.bank_name.split(" ");
    master.push({
      nameAccount: namefi[0],
      account: res.bank_number,
      cashActive: res.bank_status,
      name_en: name_en,
      name_th: name_th,
    });
  }

  return {
    data: master,
    state: "success",
  };
}

async function Alert() {
  const bank = (await(await connection).execute(
    "select * from bank_setting where bank_status=0 and bank_type=1"
  ))[0][0];
  if(bank){
    const infor = (
      await (
        await connection
      ).execute("select * from bank_information where BANK_ID=?", [
        bank.bank_type,
      ])
    )[0][0];
  
    const namefi = bank.bank_name.split(" ");
    var name_en='', name_th='';
    if(infor){
      name_en = infor.BANK_CODE.toLowerCase();
      name_th = infor.BANK_NAME;
    }
    return {
      data: {
        nameAccount: namefi[0],
        account: bank.bank_number,
        cashActive: bank.bank_status,
        name_en: name_en,
        name_th: name_th,
      },
      state: "success",
    };
  }
  else {
    return {
      state:"error"
    }
  }
  
}

async function chgPassword(data) {
  console.log(data["new_pass"]);
  if (! new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!=.*[!@#\$%\^&\*])(?=.{8,})").test(data["new_pass"])) {
    return "5";
  }

  if (data["old_pass"] == data["new_pass"]) {
    return "6";
  }

  var io = (
    await (
      await connection
    ).execute(
      "select * from account_session where SL_SESSION=? and SL_LOGINIP=?",
      [data["token"], data["ip"]]
    )
  )[0][0];

  if (io) {
    var customerid = io.CustomerID;
    var flag1 = (await 
    (
      await connection
    ).execute(
      "select * from account_users where SL_PASSWORD=? and SLOT_USER=? and CustomerID=?",
      [
        crypt.createHash("md5").update(data["old_pass"]).digest("hex"),
        data["username"], 
        customerid
      ])
    )[0][0];
   
    if (flag1) {
      const form_data = new FormData();
      form_data.append('username', data["username"]);
      form_data.append('password', data["new_pass"]);
  
      let jsonData = await axios.post("https://mftx.slotxo-api.com/?agent=" +
      process.env.AG_AGENT +
      "&method=sp", form_data, 
      { headers: form_data.getHeaders() });
      let myData = jsonData.data;
      console.log(myData);
      // var jsonData = axios.post(
      //   "https://mftx.slotxo-api.com/?agent=" +
      //     process.env.AG_AGENT +
      //     "&method=sp"
      // )[0][0];

      if (myData["result"] == "ok") {
        (
          await (await connection).execute(
            "insert into logs_chgpassword (CustomerID,SLOT_USER,OLD_PASS,NEW_PASS) values (?,?,?,?)",
            [
              customerid, 
              data["username"],
              data["old_pass"],
              data["new_pass"]
            ]
          )
        );
        (
          await (
            await connection
          ).execute(
            "update account_users set SL_PASSWORD=? where CustomerID=?",
            [
              crypt.createHash("md5").update(data["new_pass"]).digest("hex"),
              customerid,
            ]
          )
        );
        (
          await (
            await connection
          ).execute(
            "update account_session set SL_SESSION=0 and SL_ADMIN_SESSION=? and SL_LOGINIP=0 where CustomerID=?",
            [null, customerid]
          )
        );
        return "1";
      } else {
        return "4";
      }
    } else {
      return "2";
    }
  } else {
    return "3";
  }
}

async function getPromotion() {
  const bank = (await (await connection).execute(
    "select * from bonus_settings where SL_STATUS=1 order by ID asc"
  ))[0];

  const master = [];

  for (var res of bank) {
    master.push({
      bonus_title: res.SL_TITLE,
      bonus_content: res.SL_CONTENT,
      bonus_image: res.SL_IMAGE,
      bonus_func: res.SL_FUNC,
    });
  }

  return {
    data: master,
    state: "success",
  };
}

async function getDepositsv2(res) {
  return (
    await (
      await connection
    ).execute(
      "select * from logs_depositlog where CustomerID=? and DEPOSIT_STATUS=2 order by DEPOSIT_DATETIME desc limit 10",
      [res["id"]]
    )
  )[0];
}

async function getTransfersv2(res) {
  const data = (
    await (
      await connection
    ).execute(
      "select * from logs_transferlog where CustomerID=? order by WITHDRAW_DATETIME desc limit 10",
      [res["id"]]
    )
  )[0];

  return data;
}

async function getWithdrawsv2(res) {
  return (
    await (
      await connection
    ).execute(
      "select * from credit_withdrawlog where CustomerID=? order by WITHDRAW_DATETIME desc limit 10",
      [res["id"]]
    )
  )[0];
}

async function getTransfers(res) {
  return (data = (
    await (
      await connection
    ).execute(
      "select logs_transferlog.CustomerID,logs_transferlog.WITHDRAW_TXID,account_users.CustomerID,logs_transferlog.WITHDRAW_STATUS,logs_transferlog.WITHDRAW_AMOUNT,logs_transferlog.WITHDRAW_DATETIME,logs_transferlog.TURNOVER_ID from logs_transferlog full join account_users on logs_transferlog.CustomerID = account_users.CustomerID where logs_transferlog.CustomerID=? order by logs_transferlog.CustomerID desc limit 10",
      [res["id"]]
    )
  )[0]);
}

async function getWithdraws(res) {
  return (await (await connection).execute(
    "select credit_withdrawlog.CustomerID, credit_withdrawlog.WITHDRAW_TXID, account_users.CustomerID, credit_withdrawlog.WITHDRAW_STATUS, credit_withdrawlog.WITHDRAW_AMOUNT, credit_withdrawlog.WITHDRAW_DATETIME, credit_withdrawlog.WITHDRAW_TEXT from credit_withdrawlog full join account_users on credit_withdrawlog.CustomerID = account_users.CustomerID where credit_withdrawlog.CustomerID=? order by credit_withdrawlog.CustomerID desc limit 10"
  ),
  [res["id"]])[0];
}

async function getDeposits(res) {
  return (
    await (
      await connection
    ).execute(
      "select logs_depositlog.CustomerID,logs_depositlog.ID, account_users.CustomerID, logs_depositlog.DEPOSIT_TYPE, logs_depositlog.DEPOSIT_AMOUNT,logs_depositlog.DEPOSIT_DATETIME from logs_depositlog where logs_depositlog.CustomerID=? order by logs_depositlog.CustomerID desc limit 10",
      [res["id"]]
    )
  )[0];
}

module.exports = {
  checkUser,
  getDeposits,
  getWithdraws,
  getTransfers,
  login,
  getCredit,
  getProfile,
  getCoupon,
  getBankv2,
  Alert,
  chgPassword,
  getPromotion,
  getDepositsv2,
  getTransfersv2,
  getWithdrawsv2,
  Truewallet,
  registerUser,
};
