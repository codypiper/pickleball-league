import { getSinglesLeaderboard } from "@/db/queries/leaderboard";
import { formatRecord, formatSigned, formatWinPct } from "@/lib/leaderboard";

export default async function Home() {
  const rows = await getSinglesLeaderboard();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Singles</p>

      {rows.length === 0 ? (
        <p className="mt-8 text-zinc-500 dark:text-zinc-400">No games yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 text-left text-xs tracking-wide text-zinc-500 uppercase dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Player
                </th>
                <NumericHeader>Win</NumericHeader>
                <NumericHeader>Loss</NumericHeader>
                <NumericHeader>Win %</NumericHeader>
                <NumericHeader>Points For</NumericHeader>
                <NumericHeader>Points Against</NumericHeader>
                <NumericHeader>Point Differential</NumericHeader>
                <NumericHeader>W/L Streak</NumericHeader>
                <NumericHeader>First Serve</NumericHeader>
                <NumericHeader>Second Serve</NumericHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {rows.map((row) => (
                <tr key={row.playerId}>
                  <th scope="row" className="px-4 py-3 text-left font-medium">
                    {row.playerId}
                  </th>
                  <NumericCell>{row.wins}</NumericCell>
                  <NumericCell>{row.losses}</NumericCell>
                  <NumericCell>{formatWinPct(row.winPct)}</NumericCell>
                  <NumericCell>{row.pointsFor}</NumericCell>
                  <NumericCell>{row.pointsAgainst}</NumericCell>
                  <NumericCell>
                    {formatSigned(row.pointDifferential)}
                  </NumericCell>
                  <NumericCell
                    className={
                      row.streak > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {formatSigned(row.streak)}
                  </NumericCell>
                  <NumericCell>{formatRecord(row.firstServe)}</NumericCell>
                  <NumericCell>{formatRecord(row.secondServe)}</NumericCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function NumericHeader({ children }: { children: React.ReactNode }) {
  return (
    <th scope="col" className="px-4 py-3 text-right font-medium">
      {children}
    </th>
  );
}

function NumericCell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 text-right tabular-nums ${className}`}>
      {children}
    </td>
  );
}
