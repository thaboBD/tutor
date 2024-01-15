const { faker } = require("@faker-js/faker");

const generateFakeBooking = (userId, carId) => {
  return {
    userId,
    carId,
    cancelledAt: null,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};

const bookingsData = Array.from({ length: Math.min(2, 2) }, (_, index) =>
  generateFakeBooking(index + 1, index + 1)
);

module.exports = bookingsData;
