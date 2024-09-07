import {Alert as _alert} from '../../model/Auth'

const Alert = async (req,res)=>{
    const Alert = await _alert() //model api call Auth::Alert();
    console.log(Alert)
    res.json(Alert);
    return;
}
module.exports = {Alert}