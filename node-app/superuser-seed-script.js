// superuser-seed-script.js
const { User } = require("./models");
const catchAsync = require("./utils/catchAsync");

const seedSuperUser = catchAsync(async () => {
  const superUserExists = await User.findOne({ where: { superUser: true } });

  if (!superUserExists) {
    await User.create({
      firstName: "super",
      lastName: "user",
      email: "super@user.com",
      password: "!super?",
      superUser: true,
    });

    console.log("Superuser created successfully.");
  } else {
    console.log("Superuser already exists.");
  }
});

if (process.env.CREATE_SUPERUSER === "true") {
  seedSuperUser();
} else {
  console.log("Superuser creation skipped.");
}
