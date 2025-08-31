require("dotenv").config();

const PORT = process.env.PORT || 3001;

const DB = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
};

const JWT = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES || "7d",
};

module.exports = { PORT, DB, JWT };
