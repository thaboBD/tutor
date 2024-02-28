const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

let config = {
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "",
  database: process.env.POSTGRES_DB || "thabo-chatbot-db",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  dialect: process.env.DB_DIALECT || "postgres",
  migrationStorageTableName: "sequelize_migrations",
  seederStorageTableName: "sequelize_seeds",
};

module.exports = {
  development: config,
  test: config,
  production: config,
};
