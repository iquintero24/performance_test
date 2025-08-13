import mysql from "mysql2/promise"; //the library is imported as a promise
import dotenv from "dotenv"; // library to be able to call the environment variables

dotenv.config(); // Load variables from .env

// a pool is created to make a connection to the database
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  connectionLimit: 10, // Maximum number of active connections at the same time
  waitForConnections: true, //If the limit is reached, new requests wait their turn
  queueLimit: 0, //Maximum number of requests waiting (0 = no limit)
});

async function testDatabaseConnection() {
  try {
    const conection = await pool.getConnection();
    console.log("successful connection to the database");
    conection.release();
  } catch (error) {
    console.error("error al conectrase a la base de datos", error.message);
  }
}
testDatabaseConnection();
