import {
  checkUser as _checkUser,
  login,
  chgPassword as _chgPassword,
} from "../../model/Auth";

const loginController = async (req, res) => {
  if (!req.body.username && !req.body.password && !req.body.ip) {
    console.log({
      state: "error",
      message: "กรอกข้อมูลให้ครบถ้วน",
    });
    return res.json({
      state: "error",
      message: "กรอกข้อมูลให้ครบถ้วน",
    });
  }
  var data = {
    username: req.body.username,
    password: req.body.password,
    ip: req.body.ip,
  };

  const response = await login(data); //model call for login Auth::login($data);

  console.log(response);
  res.json(response);
  // return res.json({
  //   state: "success",
  //   message: response.token,
  // });
};

const checkUser = async (req, res) => {
  if (!req.body.username) {
    const temp = {
      state: "error",
      message: "กรอกข้อมูลให้ครบถ้วน",
    };
    console.log(temp);
    return;
  }
  const data = {
    username: req.body.username,
  };
  const response = await _checkUser(data); //model call Auth::chgPassword($data);

  var resTosend;

  if (response == "1") {
    resTosend = {
      state: "success",
      message: "เบอร์โทรศัพท์นี้สามารถใช้งานได้",
    };
  } else if (response == "0") {
    resTosend = {
      state: "error",
      message: "เบอร์โทรศัพท์นี้มีนระบบแล้ว",
    };
  }
  res.json(resTosend);
};

const chgPassword = async (req, res) => {
  console.log(req.body.ip);
  if (
    !req.body.ip &&
    !req.body.token &&
    !req.body.username &&
    !req.body.old_pass &&
    !req.body.new_pass
  ) {
    const temp = {
      state: "error",
      message: "กรอกข้อมูลให้ครบถ้วน",
    };
    res.json(temp);
    return;
  }

  const data = {
    ip: req.body.ip,
    token: req.body.token,
    username: req.body.username,
    old_pass: req.body.old_pass,
    new_pass: req.body.new_pass,
  };
  console.log(data);
  const response = await _chgPassword(data); //model call Auth::chgPassword($data);

  var resTosend;

  if (response == "1") {
    resTosend = {
      state: "success",
      message: "เปลี่ยนรหัสผ่านสำเร็จ รหัสผ่านใหม่คือ : "+ req.body.new_pass,
    };
  } else if (response == "2") {
    resTosend = {
      state: "error",
      message: "รหัสผ่านเก่าไม่ถูกต้อง!",
  };
  } else if (response == "3") {
    resTosend = {
      state: "error",
      message: "ไม่พบยูสเซอร์",
    };
  } else if (response == "4") {
    resTosend = {
      state: "error",
      message: "ไม่สามารถเชื่อมจ่อกับเซริฟ์เวอร์ได้ กรุณาติดต่อแอดมิน",
    };
  } else if (response == "5") {
    resTosend = {
      state: "error",
      message:
        "รหัสผ่านควรมี 8 ถึง 24 ตัวอักษร และต้องมีตัวพิมน์ใหญ่อย่างน้อย 1 ตัวอักษร (0-9, a-z, A-Z) อักษรพิเศษไม่สามารถใช้งานได้",
    };
  } else if (response == "6") {
    resTosend = {
      state: "error",
      message:
        "ขออภัยคุณใช้รหัสผ่านนี้อยู่ กรุณาเปลี่ยนรหัสผ่านใหม่ให้ต่างจากเดิม!",
    };
  }

  res.json(resTosend);
};

module.exports = {
  loginController,
  checkUser,
  chgPassword,
};
