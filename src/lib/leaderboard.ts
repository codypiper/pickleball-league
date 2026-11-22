export type SinglesGameResult = {
  firstServerId: string;
  secondServerId: string;
  firstServerPoints: number;
  secondServerPoints: number;
};

export type LeaderboardRow = {
  playerId: string;
  wins: number;
  losses: number;
  winPct: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDifferential: number;
  /** Positive for a winning streak, negative for a losing streak. */
  streak: number;
};

/**
 * Builds the leaderboard from singles games. `games` must be in the order
 * they were played (oldest first) so streaks come out right.
 */
export function buildLeaderboard(games: SinglesGameResult[]): LeaderboardRow[] {
  const rows = new Map<string, LeaderboardRow>();

  const record = (
    playerId: string,
    pointsFor: number,
    pointsAgainst: number,
  ) => {
    let row = rows.get(playerId);
    if (!row) {
      row = {
        playerId,
        wins: 0,
        losses: 0,
        winPct: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        pointDifferential: 0,
        streak: 0,
      };
      rows.set(playerId, row);
    }

    const won = pointsFor > pointsAgainst;
    if (won) {
      row.wins += 1;
      row.streak = row.streak > 0 ? row.streak + 1 : 1;
    } else {
      row.losses += 1;
      row.streak = row.streak < 0 ? row.streak - 1 : -1;
    }
    row.pointsFor += pointsFor;
    row.pointsAgainst += pointsAgainst;
  };

  for (const game of games) {
    record(game.firstServerId, game.firstServerPoints, game.secondServerPoints);
    record(
      game.secondServerId,
      game.secondServerPoints,
      game.firstServerPoints,
    );
  }

  return [...rows.values()]
    .map((row) => ({
      ...row,
      winPct: row.wins / (row.wins + row.losses),
      pointDifferential: row.pointsFor - row.pointsAgainst,
    }))
    .sort(
      (a, b) =>
        b.winPct - a.winPct ||
        b.wins - a.wins ||
        b.pointDifferential - a.pointDifferential ||
        a.playerId.localeCompare(b.playerId),
    );
}

/** 0.739, 1.000 */
export function formatWinPct(winPct: number): string {
  return winPct.toFixed(3);
}

/** +5, -3, 0 */
export function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}
