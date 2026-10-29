// ============================================================================
// Per-instance memo for the analytics fetchers. Both APIs are slow and
// quota-limited and Search Console data only moves once a day, so a result is
// kept for hours; a failure is kept for minutes so a broken grant doesn't hit
// Google on every admin page load. Concurrent callers share one request.
// ============================================================================

interface Entry<T> {
  expiresAt: number;
  promise: Promise<T>;
}

export const OK_TTL_MS = 6 * 60 * 60 * 1000;
export const ERROR_TTL_MS = 5 * 60 * 1000;

export function createCache(now: () => number = Date.now) {
  const entries = new Map<string, Entry<unknown>>();

  return {
    get<T>(key: string, load: () => Promise<T>, ttl = OK_TTL_MS, errorTtl = ERROR_TTL_MS): Promise<T> {
      const hit = entries.get(key) as Entry<T> | undefined;
      if (hit && hit.expiresAt > now()) return hit.promise;

      const entry: Entry<T> = { expiresAt: Number.POSITIVE_INFINITY, promise: load() };
      entries.set(key, entry);
      entry.promise.then(
        () => (entry.expiresAt = now() + ttl),
        () => (entry.expiresAt = now() + errorTtl),
      );
      return entry.promise;
    },
    clear() {
      entries.clear();
    },
  };
}
