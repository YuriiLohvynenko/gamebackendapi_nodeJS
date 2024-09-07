import {Truewallet as _truewallet} from "../../model/Auth"

async function Truewallet(req,res)
    {

        if (!req.body.customerid && !req.body.gift){
            return res.json({
                'state'   : 'error',
                'message' : 'กรอกข้อมูลให้ครบถ้วน'
            })
        }

        const data ={
            'customerid' : req.body.customerid,
            'gift' : req.body.gift,
        };

        const transf = await _truewallet(data) // model api call Auth::Truewallet($data);

        console.log(transf);
        res.json(transf);
        return;
    }
module.exports = Truewallet;