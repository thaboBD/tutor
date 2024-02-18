const { User } = require("../models");
const { sequelize } = require("../models");
const AppError = require("../utils/appError");
const catchAsync = require("./../utils/catchAsync");

/* @example
 * // Request
 * PATCH /users/make-superuser/123
 *
 * // Response (Success)
 * {
 *   "status": "success",
 *   "data": {
 *     "data": {
 *       // Updated user object with superUser set to true
 *     }
 *   }
 * }
 *
 * // Response (User not found)
 * {
 *   "status": "error",
 *   "error": {
 *     "message": "User not found",
 *     "statusCode": 400
 *   }
 * }
 *
 * // Response (User is already a super user)
 * {
 *   "status": "error",
 *   "error": {
 *     "message": "User 123 is already a super user",
 *     "statusCode": 405
 *   }
 * }
 */
exports.makeSuperUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findByPk(userId);

  if (!user) {
    return next(new AppError("User not found", 400));
  }

  if (user.superUser) {
    return next(new AppError(`User ${user.id} is already a super user`, 405));
  }

  user.superUser = true;
  await user.save();

  res.status(200).json({
    status: "success",
    data: {
      data: user,
    },
  });
});

exports.deleteUser = catchAsync(async(req,res,next) => {
  const user = await User.findByPk(req.body.id)

  if(!user)return next(new AppError("User not found", 400))

  await user.destroy()

  res.status(200).json({
    status: "deleted",
  });
})

exports.allUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({});

  res.status(200).json({
    status: "success",
    users,
  });
});
