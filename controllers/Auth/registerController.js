import { registerUser } from "../../model/Auth";
require("dotenv").config();
const chance = require("chance")();

async function registerController(req, res) {
  if (
    req.body.username == null ||
    req.body.password == null ||
    req.body.passwordconf == null ||
    req.body.firstname == null ||
    req.body.lastname == null ||
    req.body.regisip == null ||
    req.body.bankid == null ||
    req.body.bankaccount == null ||
    req.body.line == null ||
    req.body.referer == null ||
    req.body.sex == null ||
    req.body.age == null
  ) {
    return res.json({
      state: "error",
      message: "กรุณากรอกข้อมูลให้ครบถ้วน",
    });
  }

  if (req.body.password != req.body.passwordconf) {
    return res.json({
      state: "error",
      message: "รหัสผ่านไม่ตรงกัน กรุณาลองใหม่อีกครั้ง",
    });
  }

  if (req.body.username.length != 10 || isNaN(req.body.username)) {
    return res.json({
      state: "error",
      message: "หมายเลขโทรศัพท์ ผิดพลาด",
    });
  }

  if (! new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!=.*[!@#\$%\^&\*])(?=.{8,})").test(req.body.password)) {
    return res.json({
      state: "error",
      message:
        "รหัสผ่านควรมี 8 ถึง 24 ตัวอักษร และต้องมีตัวพิมน์ใหญ่อย่างน้อย 1 ตัวอักษร (0-9, a-z, A-Z) อักษรพิเศษไม่สามารถใช้งานได้",
    });
  }

  if (req.body.firstname.length < 1 || req.body.lastname.length < 1) {
    return res.json({
      state: "error",
      message: "ชื่อและนามสกุล ผิดพลาด",
    });
  }

  const freecode = chance.string({ length: 4 });
  const freecode1 = chance.integer({ min: 1000, max: 9999 });
  const freecode2 = chance.string({ length: 4 });
  const random = chance.integer({ min: 10000000, max: 99999999 });

  const data = {
    SLOT_USER: process.env.AG_KEY + random,
    SL_USERNAME: req.body.username,
    SL_PASSWORD: req.body.password,
    SL_FIRSTNAME: req.body.firstname,
    SL_LASTNAME: req.body.lastname,
    SL_REGISIP: req.body.regisip,
    SL_REGISDATE: new Date(),
    SL_BANK_ID: req.body.bankid,
    SL_BANKID: req.body.bankaccount,
    SL_LINEID: req.body.line,
    SL_FREECODE: freecode + "-" + freecode1 + "-" + freecode2,
    SL_REFERER: req.body.referer,
    SL_SEX: req.body.sex,
    SL_AGE: req.body.age,
  };

  const response = await registerUser(data); //regiseteruser call(data);
 
 console.log(response);

  if (response == 1) {
    return res.json({
      state: "success",
      message: "Register Successfully!",
    });
  } else if (response == 0) {
    return res.json({
      state: "error",
      message: "เบอร์มือถือ " + req.body.username + " ถูกใช้งานแล้ว",
    });
  } else if (response == 2) {

    return res.json({
      state: "error",
      message:
        "ชื่อนามสกุลนี้ "+req.body.firstname +
        " " +
        req.body.lastname +
        " ถูกใช้งานแล้ว",
    });
  } else if (response == 3) {
    return res.json({
      state: "error",
      message: "หมายเลขบัญชี " + req.body.bankaccount + " ถูกใช้งานแล้ว",
    });
  } else if (response == 4) {
    return res.json({
      state: "error",
      message: "ไม่สามารถเชื่อมต่อกับระบบได้ กรุณาติดต่อแอดมิน",
    });
  } else if (response == 5) {
    return res.json({
      state: "error",
      message: "ไม่พบธนาคารที่ต้องการ กรุณาใช้ธนาคารที่เรามีให้",
    });
  }
};

module.exports = registerController
