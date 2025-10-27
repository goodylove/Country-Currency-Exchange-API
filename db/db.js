import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0,
});

connection.connect((err) => {
  if (err) {
    throw new Error("Error connecting to MySQL:", err.stack);
  }
  console.log("Connected to MySQL as ID", connection.threadId);
});

export default connection;
