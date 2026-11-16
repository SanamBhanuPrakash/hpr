import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Real MySQL is always the default — SQLite is strictly opt-in via
// DB_DRIVER=sqlite (see db-sqlite.js), only ever set for the isolated
// staging backend copy's own .env. Production's .env never sets this, so
// promoting staging's code to production later can't accidentally carry
// the SQLite driver over — it still needs an explicit DB_DRIVER unset/mysql
// choice either way, which matches how every other env difference between
// staging and production already works in this project.
let db;
if (process.env.DB_DRIVER === "sqlite") {
  const { default: sqliteDb } = await import("./db-sqlite.js");
  db = sqliteDb;
} else {
  db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
  });
}

export default db;