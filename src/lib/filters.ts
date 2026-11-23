/** Games are played in LA, so date filters use LA calendar days. */
export const LEAGUE_TIME_ZONE = "America/Los_Angeles";

/**
 * Leaderboard filters, read from the URL's query parameters so a filtered
 * leaderboard can be shared as a link, e.g. `/?from=2025-10-25&to=2025-11-19`.
 * Add new filters (like a player name search) here.
 */
export type LeaderboardFilters = {
  /** First day to include, as YYYY-MM-DD */
  from?: string;
  /** Last day to include, as YYYY-MM-DD */
  to?: string;
};

type SearchParams = Record<string, string | string[] | undefined>;

/** Reads the filters from query parameters, ignoring any that are invalid. */
export const parseLeaderboardFilters = (
  searchParams: SearchParams,
): LeaderboardFilters => {
  return {
    from: parseDate(searchParams.from),
    to: parseDate(searchParams.to),
  };
};

/** The query string for a set of filters, leaving out empty ones. */
export const toSearchParams = (filters: LeaderboardFilters): string => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  return params.toString();
};

/** Accepts a real calendar date written as YYYY-MM-DD. */
const parseDate = (value: string | string[] | undefined) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined;
  }
  // Rejects dates like 2025-02-30, which Date would roll over to March.
  const date = new Date(`${value}T00:00:00Z`);
  if (isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return undefined;
  }
  return value;
};

/** Oct 25, 2025 */
export const formatDate = (value: string): string => {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/** "All games", "Oct 25, 2025 – Nov 19, 2025", "Since Oct 25, 2025", ... */
export const describeDateRange = ({ from, to }: LeaderboardFilters): string => {
  if (from && to) {
    return from === to
      ? formatDate(from)
      : `${formatDate(from)} – ${formatDate(to)}`;
  }
  if (from) return `Since ${formatDate(from)}`;
  if (to) return `Through ${formatDate(to)}`;
  return "All games";
};
