import {getCredit} from "../../model/Auth"

const getCheckcredit = async (req, res) => {
  if (!req.body.ip && !req.body.token) {
    const response = {
      state: "error",
      message: "กรอกข้อมูลให้ครบถ้วน",
    };
    return res.json(response);
  }

  const data = {
    ip: req.body.ip,
    token: req.body.token,
  };

  const check = await getCredit(data); // model api call Auth::getCredit($data);
  // return console.log(check);
  return res.json(check);
};

module.exports = getCheckcredit;