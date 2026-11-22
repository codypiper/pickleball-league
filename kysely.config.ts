import { loadEnvConfig } from "@next/env";
import { PostgresDialect } from "kysely";
import { defineConfig } from "kysely-ctl";
import { Pool } from "pg";

// Load .env.local etc. the same way Next.js does.
loadEnvConfig(process.cwd());

// Migrations run inside a transaction, so they need a direct (unpooled)
// connection rather than Neon's pooled or HTTP endpoints.
const connectionString =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable not set (or DATABASE_URL_UNPOOLED)",
  );
}

export default defineConfig({
  dialect: new PostgresDialect({ pool: new Pool({ connectionString }) }),
  migrations: { migrationFolder: "src/db/migrations" },
});
