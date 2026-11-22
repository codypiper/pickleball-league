import { type Kysely, sql } from "kysely";

// Migrations use Kysely<any> on purpose: they must keep working even after
// the generated types in src/db/types.ts change.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = Kysely<any>;

export async function up(db: AnyDb): Promise<void> {
  await db.schema
    .createTable("singles_games")
    .addColumn("id", "integer", (col) =>
      col.primaryKey().generatedAlwaysAsIdentity(),
    )
    // Player handles. If a player's handle changes, their games follow it;
    // a player who has games can't be deleted.
    .addColumn("first_server_id", sql`citext`, (col) =>
      col
        .notNull()
        .references("players.id")
        .onUpdate("cascade")
        .onDelete("restrict"),
    )
    .addColumn("second_server_id", sql`citext`, (col) =>
      col
        .notNull()
        .references("players.id")
        .onUpdate("cascade")
        .onDelete("restrict"),
    )
    .addColumn("first_server_points", "smallint", (col) =>
      col.notNull().check(sql`first_server_points >= 0`),
    )
    .addColumn("second_server_points", "smallint", (col) =>
      col.notNull().check(sql`second_server_points >= 0`),
    )
    .addColumn("played_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addCheckConstraint(
      "singles_games_different_players",
      sql`first_server_id <> second_server_id`,
    )
    // The winner is whoever scored more points, and must win by at least 2
    // (which also rules out ties).
    .addCheckConstraint(
      "singles_games_win_by_two",
      sql`abs(first_server_points - second_server_points) >= 2`,
    )
    // Games are played to 11: the winning score must be at least 11, and a
    // game that goes past 11 ends as soon as someone leads by 2 (e.g. 13-11).
    .addCheckConstraint(
      "singles_games_winning_score",
      sql`greatest(first_server_points, second_server_points) >= 11`,
    )
    .addCheckConstraint(
      "singles_games_extended_game_margin",
      sql`greatest(first_server_points, second_server_points) = 11
        or abs(first_server_points - second_server_points) = 2`,
    )
    .execute();

  // For looking up a player's games and filtering by date.
  await db.schema
    .createIndex("singles_games_first_server_id_idx")
    .on("singles_games")
    .column("first_server_id")
    .execute();
  await db.schema
    .createIndex("singles_games_second_server_id_idx")
    .on("singles_games")
    .column("second_server_id")
    .execute();
  await db.schema
    .createIndex("singles_games_played_at_idx")
    .on("singles_games")
    .column("played_at")
    .execute();
}

export async function down(db: AnyDb): Promise<void> {
  await db.schema.dropTable("singles_games").execute();
}
