const express = require("express");
const authController = require("./../controllers/authController");
const usersController = require("./../controllers/usersController");

const router = express.Router();

router.post("/login", authController.login);
router.get("/", authController.restrictToSuperUser, usersController.allUsers);

router.post(
  "/signup",
  authController.restrictToSuperUser,
  authController.signup
);
router.get(
  "/logout",
  authController.restrictToSuperUser,
  authController.logout
);

router.delete(
  "/",
  authController.restrictToSuperUser,
  usersController.deleteUser
);

module.exports = router;
