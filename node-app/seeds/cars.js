const { faker } = require("@faker-js/faker");
const { User } = require("../models");
const AppError = require("../utils/appError");

const superUser = (async () =>
  await User.findOne({ where: { superUser: true } }))();

if (!superUser) {
  return next(new AppError("Superuser must exist to create cars"));
}

const generateFakeCar = () => {
  return {
    make: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    year: faker.date.past().getYear(),
    color: faker.vehicle.color(),
    mileage: faker.number.int({ min: 1000, max: 90000 }).toString(),
    transmissionType: faker.helpers.arrayElement(["Automatic", "Manual"]),
    price: faker.number.float({ min: 10000, max: 50000, precision: 0.01 }),
    creatorId: superUser.id,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};

const carsData = Array.from({ length: 4 }, generateFakeCar);

module.exports = carsData;
