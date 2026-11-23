import { type Kysely, sql } from "kysely";

// Migrations use Kysely<any> on purpose: they must keep working even after
// the generated types in src/db/types.ts change.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = Kysely<any>;

export const up = async function up(db: AnyDb): Promise<void> {
  // citext is case-insensitive text: it keeps the capitalization a player
  // chose, but "Cody" and "cody" compare as equal, so they can't both exist
  // and lookups match either way.
  await sql`create extension if not exists citext`.execute(db);

  await db.schema
    .createTable("players")
    // The player's handle: 4-24 letters, numbers and underscores.
    .addColumn("id", sql`citext`, (col) =>
      col.primaryKey().check(sql`id ~ '^[A-Za-z0-9_]{4,24}$'`),
    )
    .addColumn("registered_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();
};

export const down = async function down(db: AnyDb): Promise<void> {
  // The citext extension is left installed; other tables may come to use it.
  await db.schema.dropTable("players").execute();
};
