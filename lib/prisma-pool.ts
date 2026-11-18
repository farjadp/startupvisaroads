// ============================================================================
// Connection budget for the production database.
//
// Cloud SQL db-f1-micro allows 25 connections and keeps 3 for superusers, so
// the application has 22. Prisma's default pool is sized from the CPU count and
// stays open while idle, so every Cloud Run instance kept several connections
// whether it was busy or not. Five or six instances filled the database, and
// the next query that needed a new connection failed with "remaining
// connection slots are reserved".
//
// Production never had more than 3 connections active at once, so a small pool
// costs nothing: a query that finds both connections busy waits its turn.
//
//   instances x DB_CONNECTION_LIMIT must stay under 22, with room for a deploy
//   (old and new revisions overlap) and for `prisma migrate deploy`.
// ============================================================================

export const DEFAULT_CONNECTION_LIMIT = 2;
export const DEFAULT_POOL_TIMEOUT_SECONDS = 20;

type PoolEnv = Record<string, string | undefined>;

function positiveInteger(value: string | undefined, fallback: number): number {
  if (!value || !/^\d+$/.test(value.trim())) return fallback;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Adds pool limits to a PostgreSQL URL. Limits already in the URL win, and
 * other databases (SQLite in development) pass through untouched. The URL is
 * appended to rather than re-serialised so an encoded password and the Cloud
 * SQL `host=/cloudsql/...` socket path stay exactly as they were.
 */
export function withPoolLimits(url: string, env: PoolEnv = process.env): string {
  if (!/^postgres(ql)?:\/\//i.test(url)) return url;

  const queryStart = url.indexOf('?');
  const existing = new URLSearchParams(queryStart === -1 ? '' : url.slice(queryStart + 1));
  const additions = new URLSearchParams();

  if (!existing.has('connection_limit')) {
    additions.set(
      'connection_limit',
      String(positiveInteger(env.DB_CONNECTION_LIMIT, DEFAULT_CONNECTION_LIMIT)),
    );
  }
  if (!existing.has('pool_timeout')) {
    additions.set(
      'pool_timeout',
      String(positiveInteger(env.DB_POOL_TIMEOUT_SECONDS, DEFAULT_POOL_TIMEOUT_SECONDS)),
    );
  }

  const suffix = additions.toString();
  if (!suffix) return url;
  if (queryStart === -1) return `${url}?${suffix}`;
  return /[?&]$/.test(url) ? `${url}${suffix}` : `${url}&${suffix}`;
}
