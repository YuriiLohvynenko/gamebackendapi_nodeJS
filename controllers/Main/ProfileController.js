import {getProfile as _getProfile} from "../../model/Auth"

module.exports = async function getProfile(req,res)
    {
        if (!req.body.ip && !req.body.token){
            res.json({
                'state'   : 'error',
                'message' : 'กรอกข้อมูลให้ครบถ้วน'
            })
        }

        const data = { 'ip' : req.body.ip,
        'token' : req.body.token}


        const check = await _getProfile(data) // model api call Auth::getProfile($data);
         console.log(check);
         res.json(check);
    }    