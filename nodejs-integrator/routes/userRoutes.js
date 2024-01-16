const express = require("express");
const authController = require("./../controllers/authController");
const usersController = require("./../controllers/usersController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.patch(
  "/:userId/make-super-user",
  authController.protect,
  authController.restrictToSuperUser,
  usersController.makeSuperUser
);

module.exports = router;
