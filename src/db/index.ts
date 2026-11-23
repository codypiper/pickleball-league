import { neon } from "@neondatabase/serverless";
import { Kysely } from "kysely";
import { NeonDialect } from "kysely-neon";
import type { DB } from "./types";

const db = new Kysely<DB>({
  dialect: new NeonDialect({
    neon: neon(process.env.DATABASE_URL!),
  }),
});

export default db;
