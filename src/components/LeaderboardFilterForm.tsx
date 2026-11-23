"use client";

import { type LeaderboardFilters, toSearchParams } from "@/lib/filters";
import Link from "next/link";
import { useRouter } from "next/navigation";

const inputClassName =
  "mt-1 block rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:[color-scheme:dark]";

/**
 * Date range filters for the leaderboard. Applying them updates the URL's
 * query parameters, so the filtered leaderboard can be shared as a link.
 */
const LeaderboardFilterForm = ({
  filters,
}: {
  filters: LeaderboardFilters;
}) => {
  const router = useRouter();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Without JavaScript the form still works as a plain GET form; with it,
    // empty fields are left out so shared links stay clean.
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = toSearchParams({
      from: data.get("from")?.toString(),
      to: data.get("to")?.toString(),
    });
    router.push(query ? `/?${query}` : "/");
  };

  const isFiltered = Object.values(filters).some(Boolean);

  return (
    <form
      // Remount when the URL changes so the inputs show the current filters.
      key={toSearchParams(filters)}
      action="/"
      method="get"
      onSubmit={onSubmit}
      className="mt-6 flex flex-wrap items-end gap-3"
    >
      <label className="text-sm font-medium">
        From
        <input
          type="date"
          name="from"
          defaultValue={filters.from}
          className={inputClassName}
        />
      </label>
      <label className="text-sm font-medium">
        To
        <input
          type="date"
          name="to"
          defaultValue={filters.to}
          className={inputClassName}
        />
      </label>
      <button
        type="submit"
        className="rounded-md bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Apply
      </button>
      {isFiltered && (
        <Link
          href="/"
          className="px-2 py-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Clear
        </Link>
      )}
    </form>
  );
};

export default LeaderboardFilterForm;
