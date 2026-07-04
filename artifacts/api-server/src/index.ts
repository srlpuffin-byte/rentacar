import app from "./app";
import { logger } from "./lib/logger";
import { pool } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function runMigrations() {
  try {
    // Ensure vehicles table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        category TEXT NOT NULL,
        transmission TEXT NOT NULL,
        fuel TEXT NOT NULL,
        seats INTEGER NOT NULL,
        price_per_day NUMERIC(10,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'available',
        rating NUMERIC(3,1) NOT NULL DEFAULT 4.5,
        image_url TEXT NOT NULL DEFAULT '',
        featured BOOLEAN NOT NULL DEFAULT false,
        description TEXT
      )
    `);
    // Add image_urls column if it doesn't exist (idempotent)
    await pool.query(`
      ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS image_urls text[]
    `);
    logger.info("Database migrations applied successfully");
  } catch (err) {
    logger.error({ err }, "Failed to apply database migrations");
    throw err;
  }
}

runMigrations().then(() => {
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}).catch(() => {
  process.exit(1);
});
