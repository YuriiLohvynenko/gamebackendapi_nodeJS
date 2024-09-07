import {getBankv2 as _getBankv2} from "../../model/Auth";

// const getBank = (req, res) => {
//   const bank = ""; // model api call  Auth::getBank();
//   console.log(bank);
//   return;
// };
const getBankv2 = async (req, res) => {
  const bank = await _getBankv2(); // model api call  Auth::getBank();
  console.log(bank);
  res.json(bank);
  return;
};

module.exports = {  getBankv2 };
