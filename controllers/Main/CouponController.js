import axios from "axios";
import {getCoupon as _getCoupon} from "../../model/Auth"

const getCoupon = async (req, res) => {
  if (!req.body.ip && !req.body.token && !req.body.code) {
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
  //   .then( async (response) => {
  //     if (
  //       response.data["success"] == true &&
  //       response.data["action"] == "coupon"
  //     ) {
        const data = {
          ip: req.body.ip,
          token: req.body.token,
          code: req.body.code
        };

        const check = await _getCoupon(data); //model api call Auth::getCoupon($data);
        // return console.log(check);
        res.json(check);
    //   } else {
    //     return res.json({
    //       message: "กรุณาลองอีกครั้ง! เออเร่อแคปช่า",
    //       state: "error",
    //     });
    //   }
    // });
};

module.exports = getCoupon;
