const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

const generateFakeUser = () => {
  const password = faker.internet.password();
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phoneNumber: "123456789",
    password: bcrypt.hashSync(password, 10),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};

const usersData = Array.from({ length: 2 }, (_, index) => generateFakeUser());

module.exports = usersData;
