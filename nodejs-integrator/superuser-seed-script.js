// superuser-seed-script.js
const { User } = require("./models");
const catchAsync = require("./utils/catchAsync");

const seedSuperUser = async (firstName, lastName, email, phoneNumber, password) => {
  const superUserExists = await User.findOne({ where: { phoneNumber: phoneNumber, superUser: true } });

  if (!superUserExists) {
    await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      superUser: true
    });

    console.log("Superuser created successfully.");
  } else {
    console.log("Superuser already exists.");
  }
};

if (process.env.CREATE_SUPERUSER === "true") {
  const firstName=process.env.SUPER_USER_FIRST_NAME
  const lastName=process.env.SUPER_USER_LAST_NAME
  const email=process.env.SUPER_USER_EMAIL
  const phoneNumber=process.env.SUPER_USER_PHONE_NUMBER
  const password=process.env.SUPER_USER_PASSWORD

  if(!email || !phoneNumber || !password){
    console.error("SUPER_USER_EMAIL, SUPER_USER_PHONE_NUMBER, SUPER_USER_PASSWORD are required in ENV to proceed.");
    return;
  }

  console.log("PHONE NUMBER: ", phoneNumber);

  seedSuperUser(firstName, lastName, email, phoneNumber, password);
} else {
  console.log("Superuser creation skipped.");
}
