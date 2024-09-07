import {withdrow as _withdrow} from "../../model/Withdraw";
const axios = require("axios");
var crypto = require('crypto')
var shasum = crypto.createHash('sha1');

async function Withdrow(req,res)
    {
        if (!req.body.ip && !req.body.token) {
            return res.json({
                'state'   : 'error',
                'message' : 'กรอกข้อมูลให้ครบถ้วน'
            })
        }

        // axios
        // .post(
        //   `https://www.google.com/recaptcha/api/siteverify?secret=${req.body.secret}&response=${req.body.response}&remoteip=${req.body.ip}`,
        //   {},
        //   {
        //     headers: {
        //       "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        //     },
        //   }
        // ).then(async (response) => {
        //     if (response.data['success'] == true && response.data['action'] == 'withdraw') {

                // $data = {
                //     'ip' : req.body.ip,
                //     'token' : req.body.token
                //     ,'refId' : shasum.update(req.body.captcha).digest('hex') 
                // }
                var data = {
                    'ip' : req.body.ip,
                    'token' : req.body.token
                };
                const with_id = await _withdrow(data) // model api call Withdrow::withdrow($data);
                // res.json(with_id);
                if (with_id) {
                    if (with_id == 1) {
                        return res.json({
                            'state'   : 'success',
                            'message' : 'ถอนเงินสำเร็จ กรุณารอแอดมินทำรายการ'
                        });
                    } else {
                        return res.json({
                            'state'   : 'error',
                            'message' : with_id
                        })
                    }
                }
                res.json(with_id);
        //     } else {
        //         return res.json({
        //             'message' : 'กรุณาลองอีกครั้ง! เออเร่อแคปช่า', 'state' : 'error'
        //         })
        //     }
        // })

        
    }

    module.exports = Withdrow