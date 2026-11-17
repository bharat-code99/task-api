import { app } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";

await pool.query("SELECT 1");

const server = app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});

function shutdown(signal) {
  console.log(`${signal} received: closing server`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
