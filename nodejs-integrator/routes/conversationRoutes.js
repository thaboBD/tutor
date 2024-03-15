const express = require("express");
const authController = require("../controllers/authController");
const conversationsController = require("../controllers/conversationsController");

const router = express.Router();

router.post(
  "/",
  authController.protect,
  conversationsController.twilioRequestHook
);

module.exports = router;
