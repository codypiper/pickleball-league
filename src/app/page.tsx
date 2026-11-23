import LeaderboardFilterForm from "@/components/LeaderboardFilterForm";
import Cell from "@/components/table/Cell";
import Header from "@/components/table/Header";
import { getSinglesLeaderboard } from "@/db/queries/leaderboard";
import { describeDateRange, parseLeaderboardFilters } from "@/lib/filters";
import { formatRecord, formatSigned, formatWinPct } from "@/lib/leaderboard";
import { Suspense } from "react";

const Home = ({ searchParams }: PageProps<"/">) => {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>

      {/* The filters come from the URL, so everything that depends on them
          streams in behind this boundary. */}
      <Suspense
        fallback={
          <p className="mt-8 text-zinc-500 dark:text-zinc-400">Loading…</p>
        }
      >
        <Leaderboard searchParams={searchParams} />
      </Suspense>
    </main>
  );
};

const Leaderboard = async ({
  searchParams,
}: Pick<PageProps<"/">, "searchParams">) => {
  const filters = parseLeaderboardFilters(await searchParams);
  const rows = await getSinglesLeaderboard(filters.from, filters.to);

  return (
    <>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Singles · {describeDateRange(filters)}
      </p>

      <LeaderboardFilterForm filters={filters} />

      {rows.length === 0 ? (
        <p className="mt-8 text-zinc-500 dark:text-zinc-400">No games found.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 text-left text-xs tracking-wide text-zinc-500 uppercase dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Player
                </th>
                <Header>Win</Header>
                <Header>Loss</Header>
                <Header>Win %</Header>
                <Header>Points For</Header>
                <Header>Points Against</Header>
                <Header>Point Differential</Header>
                <Header>Streak</Header>
                <Header>First Serve</Header>
                <Header>Second Serve</Header>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {rows.map((row) => (
                <tr key={row.playerId}>
                  <th scope="row" className="px-4 py-3 text-left font-medium">
                    {row.playerId}
                  </th>
                  <Cell>{row.wins}</Cell>
                  <Cell>{row.losses}</Cell>
                  <Cell>{formatWinPct(row.winPct)}</Cell>
                  <Cell>{row.pointsFor}</Cell>
                  <Cell>{row.pointsAgainst}</Cell>
                  <Cell>{formatSigned(row.pointDifferential)}</Cell>
                  <Cell
                    className={
                      row.streak > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {formatSigned(row.streak)}
                  </Cell>
                  <Cell>{formatRecord(row.firstServe)}</Cell>
                  <Cell>{formatRecord(row.secondServe)}</Cell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Home;
