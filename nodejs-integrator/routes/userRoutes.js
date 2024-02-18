const express = require("express");
const authController = require("./../controllers/authController");
const usersController = require("./../controllers/usersController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.get("/", usersController.restrictToSuperUser,  usersController.allUsers);
router.delete('/', usersController.restrictToSuperUser, usersController.deleteUser);

module.exports = router;
