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
  /** Positive for a winning streak, negative for a losing streak */
  streak: number;
  /** Record in games where the player served first */
  firstServe: WinLoss;
  /** Record in games where the player served second */
  secondServe: WinLoss;
};

export type WinLoss = { wins: number; losses: number };

/**
 * Builds the leaderboard from singles games. `games` must be in the order
 * they were played (oldest first) so streaks come out right.
 */
export const buildLeaderboard = (
  games: SinglesGameResult[],
): LeaderboardRow[] => {
  const rows = new Map<string, LeaderboardRow>();

  const record = (
    playerId: string,
    pointsFor: number,
    pointsAgainst: number,
    servedFirst: boolean,
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
        firstServe: { wins: 0, losses: 0 },
        secondServe: { wins: 0, losses: 0 },
      };
      rows.set(playerId, row);
    }

    const won = pointsFor > pointsAgainst;
    const serveRecord = servedFirst ? row.firstServe : row.secondServe;
    if (won) {
      row.wins += 1;
      serveRecord.wins += 1;
      row.streak = row.streak > 0 ? row.streak + 1 : 1;
    } else {
      row.losses += 1;
      serveRecord.losses += 1;
      row.streak = row.streak < 0 ? row.streak - 1 : -1;
    }
    row.pointsFor += pointsFor;
    row.pointsAgainst += pointsAgainst;
  };

  for (const game of games) {
    record(
      game.firstServerId,
      game.firstServerPoints,
      game.secondServerPoints,
      true,
    );
    record(
      game.secondServerId,
      game.secondServerPoints,
      game.firstServerPoints,
      false,
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
};

/** 0.739, 1.000 */
export const formatWinPct = (winPct: number): string => {
  return winPct.toFixed(3);
};

/** 10-2 */
export const formatRecord = ({ wins, losses }: WinLoss): string => {
  return `${wins}-${losses}`;
};

/** +5, -3, 0 */
export const formatSigned = (value: number): string => {
  return value > 0 ? `+${value}` : `${value}`;
};
