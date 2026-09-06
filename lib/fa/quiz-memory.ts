// ============================================================================
// lib/fa/quiz-memory.ts
// Remembering what /fa/which-path told the reader, so a guide can say whether
// it is the route they were pointed at.
//
// Two rules this module exists to enforce:
//   1. Storage is allowed to throw. Private windows, blocked site data and
//      full quotas all raise on plain reads. Every entry point swallows it
//      and behaves as if nothing was remembered.
//   2. What is remembered is a convenience, never the only place a fact
//      appears. A reader who arrives with cleared storage must lose nothing
//      but the greeting.
// ============================================================================

const KEY = 'fa:which-path:v1';
/** A recommendation older than this is not worth greeting someone with. */
export const MAX_AGE_DAYS = 60;

export type Remembered = {
  /** Locale-agnostic path of the recommended guide, e.g. `/europe/finland`. */
  href: string;
  /** Persian title of that recommendation, as the quiz phrased it. */
  title: string;
  /** ISO timestamp of when the quiz was taken. */
  at: string;
};

/** Whether a remembered recommendation is still worth showing. Pure. */
export function isFresh(rec: Remembered, now: Date = new Date()): boolean {
  const at = Date.parse(rec.at);
  if (Number.isNaN(at)) return false;
  const days = (now.getTime() - at) / 86_400_000;
  return days >= 0 && days <= MAX_AGE_DAYS;
}

/** What a given guide should say about a remembered recommendation. Pure. */
export type Echo = { kind: 'match' | 'other'; title: string; href: string };

export function echoFor(rec: Remembered | null, pagePath: string, now?: Date): Echo | null {
  if (!rec || !isFresh(rec, now)) return null;
  if (rec.href === pagePath) return { kind: 'match', title: rec.title, href: rec.href };
  return { kind: 'other', title: rec.title, href: rec.href };
}

export function remember(rec: Remembered): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(rec));
  } catch {
    // Storage is a nicety here. Losing it costs the reader nothing.
  }
}

export function recall(): Remembered | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Remembered>;
    if (typeof parsed?.href !== 'string' || typeof parsed?.title !== 'string' || typeof parsed?.at !== 'string') return null;
    return parsed as Remembered;
  } catch {
    return null;
  }
}

export function forget(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing to do */
  }
}
