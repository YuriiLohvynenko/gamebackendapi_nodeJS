import {getPromotion as _getPromotion} from "../../model/Auth"
module.exports = async function getPromotion(req,res)
{
    const response = await _getPromotion() // model api call Auth::getPromotion();
    console.log(response)
    res.json(response);
    return;
}