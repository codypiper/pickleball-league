import { neon } from "@neondatabase/serverless";
import { Kysely } from "kysely";
import { NeonDialect } from "kysely-neon";

// No tables yet. Table definitions go here as the schema is added.
type Database = Record<string, never>;

export const db = new Kysely<Database>({
  dialect: new NeonDialect({
    neon: neon(process.env.DATABASE_URL!),
  }),
});
