const express = require("express");
const router = express.Router();

const registerController = require("./controllers/Auth/registerController");
const {checkUser,chgPassword,loginController} = require("./controllers/Auth/loginController");
const Withdrow = require("./controllers/Main/WithdrawController");
const Transfer = require("./controllers/Main/TransferController");
const getCoupon = require("./controllers/Main/CouponController");
const getCheckcredit = require("./controllers/Main/CheckController");
const getProfile = require("./controllers/Main/ProfileController");
const getPromotion = require("./controllers/Main/PromotionController");
const {getBankv2} = require("./controllers/Main/BankController")
const {getHistoryv2} = require("./controllers/Main/HistoryController");
const {Alert} = require("./controllers/Main/AlertController");
const Truewallet = require("./controllers/Main/TruewalletController")

router.post("/register", registerController);
router.post("/checkuser", checkUser);
router.post("/chgPassword", chgPassword);
router.post("/login", loginController);
router.post("/withdraw", Withdrow);
router.post("/transfer", Transfer);
router.post("/coupon", getCoupon);
router.post("/checkcredit", getCheckcredit);
router.post("/profile", getProfile);
router.get("/promotion", getPromotion);
router.get("/bankv2", getBankv2);
router.post("/history-data", getHistoryv2);
router.get("/alert", Alert);
router.post("/truewallet", Truewallet);

module.exports = router;
