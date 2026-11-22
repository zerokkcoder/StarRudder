import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const url = new URL(connectionString);
const pool = mysql.createPool({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.replace(/^\//, ""),
  charset: "utf8mb4",
  waitForConnections: true,
  connectionLimit: 10,
});

// mysql2 的 charset 选项在本机会话上可能仍落到 utf8，显式设置确保 emoji 可写入
pool.on("connection", (connection) => connection.query("SET NAMES utf8mb4"));

export const db = drizzle(pool, { schema, mode: "default" });
export { schema };
