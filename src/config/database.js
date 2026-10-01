const { Sequelize } = require("sequelize");

const dialect = process.env.DB_DIALECT || "postgres";

if (!["postgres", "mysql"].includes(dialect)) {
  throw new Error('DB_DIALECT must be either "postgres" or "mysql".');
}

const sequelize = new Sequelize(
  process.env.DB_NAME || "portfolio",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "",
  {
    dialect,
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || (dialect === "mysql" ? 3306 : 5432)),
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    ...(process.env.DB_SSL === "true"
      ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: true } } }
      : {}),
  },
);

module.exports = sequelize;