import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST || "localhost", // Change localhost to host.docker.internal
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT || "5432"), // Parse the port as integer
  ssl: {
    rejectUnauthorized: false, // This option is required if you're using self-signed certificates
  },
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error executing query", err);
  } else {
    console.log("Query result", res.rows);
  }
});
