import db from "@/db";
import { buildLeaderboard } from "@/lib/leaderboard";
import { cacheLife } from "next/cache";

/**
 * The singles leaderboard. Cached and refreshed about once a minute, so new
 * games show up shortly after they're entered.
 */
export const getSinglesLeaderboard = async () => {
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
    .orderBy("played_at")
    .orderBy("id")
    .execute();

  return buildLeaderboard(games);
};
