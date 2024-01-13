const { User } = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { createSendToken, decodeJwt } = require("../utils/authUtils");

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
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return next(new AppError("Please provide phone number and password!", 400));
  }

  const user = await User.findOne({
    where: { phoneNumber },
    attributes: ["id", "phoneNumber", "password"],
  });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect phone number or password", 401));
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
  const currentUser = await User.findOne({
    where: {
      phoneNumber: req.body.From,
    },
  });

  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});

exports.restrictToSuperUser = catchAsync((req, res, next) => {
  if (!req.user.superUser) {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  next();
});
