import {transfer} from "../../model/transfer"
var crypto = require("crypto");
var shasum = crypto.createHash("sha1");

async function Transfer(req, res) {
  if (
    !req.body.ip &&
    !req.body.token &&
    !req.body.amount &&
    !req.body.bonus
  ) {
    return res.json({
      state: "error",
      message: "กรอกข้อมูลให้ครบถ้วน",
    });
  }
  // axios
  //   .post(
  //     `https://www.google.com/recaptcha/api/siteverify?secret=${req.body.secret}&response=${req.body.response}&remoteip=${req.body.ip}`,
  //     {},
  //     {
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
  //       },
  //     }
  //   )
  //   .then(async (response) => {
  //     if (
  //       response.data["success"] == true &&
  //       response.data["action"] == "transfer"
  //     ) {
        const data = {
          ip: req.body.ip,
          token: req.body.token,
          amount: req.body.amount,
          bonus: req.body.bonus
        };

        const tranf = await transfer(data); // model api call Withdrow::withdrow($data); Transfer::transfer($data);
        console.log(tranf);
        return res.json(tranf);
        
    //   } else {
    //     return res.json({
    //       message: "กรุณาลองอีกครั้ง! เออเร่อแคปช่า",
    //       state: "error",
    //     });
    //   }
    // });
}
module.exports = Transfer;
