require("dotenv").config();

const dialect = process.env.DB_DIALECT || "postgres";
const shared = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || (dialect === "mysql" ? 3306 : 5432)),
  dialect,
  logging: process.env.DB_LOGGING === "true",
  ...(process.env.DB_SSL === "true"
    ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: true } } }
    : {}),
};

module.exports = {
  development: shared,
  test: shared,
  production: shared,
};