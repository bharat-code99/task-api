import pg from "pg";
import { env } from "../config/env.js";

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
});

pool.on("error", (err) => {
  console.log("Unexpected error on idle PostgreSQL client", err);
});

export const query = (text, params) => pool.query(text, params);
