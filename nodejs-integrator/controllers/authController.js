const { User } = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { createSendToken, decodeJwt } = require("../utils/authUtils");
const { Op } = require("sequelize");

exports.signup = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    passwordConfirm,
  } = req.body;

  if (password !== passwordConfirm) {
    return next(new AppError("Passwords must match", 400));
  }

  const newUser = await User.create({
    firstName: firstName || "",
    lastName: lastName || "",
    email: email || "",
    phoneNumber: phoneNumber || "",
    password: password || "",
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({
    where: { email },
    attributes: ["id", "phoneNumber", "password"],
  });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "logged_out", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  const phone = req.body.From.split(":")[1];
  const currentUser = await User.findOne({
    where: {
      phoneNumber: { [Op.like]: `%${phone}` },
    },
  });

  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});

exports.restrictToSuperUser = catchAsync(async (req, res, next) => {
  console.log("RESTRICTING");
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await decodeJwt(token);

  console.log("TOKENER", token)
  console.log("DECODED", decoded)
  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  req.user = currentUser;
  next();
});
