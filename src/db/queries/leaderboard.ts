import db from "@/db";
import { LEAGUE_TIME_ZONE } from "@/lib/filters";
import { buildLeaderboard } from "@/lib/leaderboard";
import { sql } from "kysely";
import { cacheLife } from "next/cache";

/**
 * The singles leaderboard, optionally limited to games played between two
 * dates (inclusive, as Pacific calendar days). Each date range is cached
 * separately and refreshed about once a minute, so new games show up shortly
 * after they're entered.
 */
export const getSinglesLeaderboard = async (from?: string, to?: string) => {
  "use cache";
  cacheLife("minutes");

  const games = await db
    .selectFrom("singles_games")
    .select([
      "first_server_id as firstServerId",
      "second_server_id as secondServerId",
      "first_server_points as firstServerPoints",
      "second_server_points as secondServerPoints",
    ])
    // From midnight Pacific time at the start of `from`...
    .$if(from !== undefined, (qb) =>
      qb.where(
        "played_at",
        ">=",
        sql<Date>`${from}::timestamp at time zone ${LEAGUE_TIME_ZONE}`,
      ),
    )
    // ...up to (not including) midnight Pacific time after `to`.
    .$if(to !== undefined, (qb) =>
      qb.where(
        "played_at",
        "<",
        sql<Date>`(${to}::date + 1)::timestamp at time zone ${LEAGUE_TIME_ZONE}`,
      ),
    )
    .orderBy("played_at")
    .orderBy("id")
    .execute();

  return buildLeaderboard(games);
};
