"use strict";

const carsData = require("../seeds/cars");
const usersData = require("../seeds/users");
const bookingsData = require("../seeds/bookings");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log("START SEEDING FAKE DATA");
    await queryInterface.bulkInsert("Users", usersData, {});
    await queryInterface.bulkInsert("Cars", carsData, {});
    await queryInterface.bulkInsert("Bookings", bookingsData, {});
    console.log("FINISH SEEDING FAKE DATA");
  },

  down: async (queryInterface, Sequelize) => {
    console.log("START DROPPING FAKE DATA");
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Cars", null, {});
    await queryInterface.bulkDelete("Bookings", null, {});
    console.log("FINISH DROPPING FAKE DATA");
  },
};
