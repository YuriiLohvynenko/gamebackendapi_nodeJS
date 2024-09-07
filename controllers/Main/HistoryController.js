import {
  getDepositsv2,
  getTransfersv2,
  getWithdrawsv2,
} from "../../model/Auth";

function getHistory(req, res) {
  if (!req.body.id && !req.body.data) {
    return res.json({
      state: "error",
      message: "กรอกข้อมูลให้ครบถ้วน",
    });
  }

  const data = {
    id: req.body.id,
  };

  // $check = Auth::getHistory($data);
  const deposit = {};
  if (req.body.data == "deposit") {
    deposit["deposit"] = ""; // model api calljson_decode(Auth::getDeposits($data), true);
  } else if (req.body.data == "transfer") {
    deposit["transfer"] = ""; // model api calljson_decode(Auth::getTransfers($data), true);
  } else if (req.body.data == "withdraw") {
    deposit["withdraw"] = ""; // model api calljson_decode(Auth::getWithdraws($data), true);
  } else if (req.body.data == "all") {
    deposit["deposit"] = ""; // model api calljson_decode(Auth::getDeposits($data), true);
    deposit["transfer"] = ""; // model api calljson_decode(Auth::getTransfers($data), true);
    deposit["withdraw"] = ""; // model api calljson_decode(Auth::getWithdraws($data), true);
  }

  return res.json({
    data: deposit,
    state: "success",
  });
}

async function getHistoryv2(req, res) {
  if (!req.body.id && !req.body.data) {
    return res.json({
      state: "error",
      message: "กรอกข้อมูลให้ครบถ้วน",
    });
  }

  const data = {
    id: req.body.id,
  };

  const deposit = {};

  if (req.body.data == "deposit") {
    const sass = await getDepositsv2(data); //model api call json_decode(Auth::getDepositsv2($data), true);
    // $deposit = ""//model api call json_decode(Auth::getDepositsv2($data), true);
    deposit["_total"] = sass.length;
    deposit["_data"] = sass;
  } else if (req.body.data == "transfer") {
    const sass = await getTransfersv2(data); //model api call json_decode(Auth::getTransfersv2($data), true);
    // deposit = ""//model api call json_decode(Auth::getTransfersv2($data), true);
    deposit["_total"] = sass.length;
    deposit["_data"] = sass;
  } else if (req.body.data == "withdraw") {
    const sass = await getWithdrawsv2(data); //model api call json_decode(Auth::getWithdrawsv2($data), true);
    // deposit = json_decode(Auth::getWithdrawsv2($data), true);
    deposit["_total"] = sass.length;
    deposit["_data"] = sass;
  }
  
  return res.json({
    status: "success",
    data: deposit,
  });
}



module.exports = {
  // getHistory,
  getHistoryv2,
};
