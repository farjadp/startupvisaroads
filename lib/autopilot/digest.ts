// ============================================================================
// lib/autopilot/digest.ts
// Reads the pipeline's own AutopilotRun rows and decides, per locale, whether
// the lane is working.
//
// WHY THIS EXISTS
// The Persian lane published nothing for the entire life of the Persian site
// and the English lane stopped for six weeks, and nobody learned either from
// the software. The failure was reported — `decidePlannedPublication` returns
// a warning — but only into the cron endpoint's HTTP response, which Cloud
// Scheduler discards. A pipeline that can fail silently will.
//
// The unit here is the LANE, not the pipeline. "Is the autopilot working"
// answers yes while one locale is dead, which is exactly how six weeks
// passed. Every expected locale is reported, including ones with no rows at
// all — an absent lane is the loudest signal there is, and a summary built
// only from rows that exist can never show it.
//
// Pure: no Prisma, no fetch, no formatting for any particular channel. The
// caller supplies the rows and the clock.
// ============================================================================

/** One AutopilotRun, narrowed to what a health decision needs. */
export type RunRow = {
  locale: string;
  mode: string;
  startedAt: Date;
  /** Null while a run is in flight — or forever, if it died mid-run. */
  finishedAt: Date | null;
  created: number;
  /** JSON `[{title?, error}]`, or null. Written by the writers; may be malformed. */
  errors: string | null;
  /** JSON `[{title, reason}]`, or null. */
  skipped: string | null;
  notes: string | null;
};

export type LaneState =
  /** Ran and produced articles. */
  | 'healthy'
  /** Ran and produced nothing — the gate, the model or the feeds refused. */
  | 'degraded'
  /** Did not run at all inside the window. */
  | 'silent'
  /** Started and never finished. */
  | 'stuck';

export type LaneSummary = {
  locale: string;
  state: LaneState;
  runs: number;
  created: number;
  /** Distinct, human-readable causes — never the same sentence twice. */
  reasons: string[];
};

export const DEFAULT_LOCALES = ['en', 'fa'] as const;
export const DEFAULT_WINDOW_HOURS = 26; // a day, plus slack for a late cron
const DEFAULT_STUCK_MINUTES = 120; // a batch takes minutes, not hours

export type SummariseOptions = {
  windowHours?: number;
  stuckMinutes?: number;
  locales?: readonly string[];
};

/** Parse a JSON column without letting a malformed row break the digest. */
function readEntries(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((e) => {
        if (typeof e === 'string') return e;
        const o = e as { error?: unknown; reason?: unknown };
        return typeof o?.error === 'string' ? o.error : typeof o?.reason === 'string' ? o.reason : null;
      })
      .filter((s): s is string => Boolean(s));
  } catch {
    // A row we cannot read is not a reason to report nothing about the lane.
    return [];
  }
}

export function summarise(runs: RunRow[], now: Date, opts: SummariseOptions = {}): LaneSummary[] {
  const windowHours = opts.windowHours ?? DEFAULT_WINDOW_HOURS;
  const stuckMinutes = opts.stuckMinutes ?? DEFAULT_STUCK_MINUTES;
  const locales = opts.locales ?? DEFAULT_LOCALES;

  const since = new Date(now.getTime() - windowHours * 3_600_000);
  const stuckBefore = new Date(now.getTime() - stuckMinutes * 60_000);

  return locales.map((locale) => {
    const mine = runs.filter((r) => r.locale === locale && r.startedAt >= since);
    const created = mine.reduce((n, r) => n + (r.created ?? 0), 0);

    const reasons: string[] = [];
    const push = (s: string) => {
      const t = s.trim();
      if (t && !reasons.includes(t)) reasons.push(t);
    };
    for (const r of mine) {
      if (r.notes) push(r.notes);
      for (const e of readEntries(r.errors)) push(e);
    }

    const stuck = mine.some((r) => r.finishedAt === null && r.startedAt < stuckBefore);

    let state: LaneState;
    if (!mine.length) state = 'silent';
    else if (stuck) state = 'stuck';
    else if (created === 0) state = 'degraded';
    else state = 'healthy';

    if (state === 'silent') push(`No autopilot run in the last ${windowHours} hour${windowHours === 1 ? '' : 's'}.`);
    if (state === 'stuck') push('A run started and never finished.');

    return { locale, state, runs: mine.length, created, reasons };
  });
}

// ── Message ────────────────────────────────────────────────────────────────
// Written in English with Latin digits on purpose. The Persian copy rules —
// written register, نیم‌فاصله, Persian digits — govern prose a reader reads on
// the site. This is an ops alert that sits beside the Cloud Run logs and
// DEPLOY.md, and a number you have to convert before you can act on it is
// worse, not more consistent.

/** Telegram rejects anything longer; losing the tail loses other lanes. */
const TELEGRAM_LIMIT = 4096;
const REASON_CHARS = 160;

const ICON: Record<LaneState, string> = {
  healthy: '✅',
  degraded: '⚠️',
  silent: '🔇',
  stuck: '⏳',
};

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/**
 * One line per lane, and reasons only where something is wrong. A healthy day
 * is three lines, so the day it is not stands out instead of arriving as the
 * same wall of text as every other day.
 */
export function buildDigest(lanes: LaneSummary[], now: Date): string {
  const created = lanes.reduce((n, l) => n + l.created, 0);
  const worst = lanes.some((l) => l.state !== 'healthy');

  const head = `${worst ? '⚠️' : '✅'} Autopilot · ${now.toISOString().slice(0, 16).replace('T', ' ')} UTC · ${created} published`;

  const lines = lanes.map((l) => `${ICON[l.state]} ${l.locale}: ${l.state} — ${l.runs} run(s), ${l.created} published`);

  const detail = lanes
    .filter((l) => l.state !== 'healthy' && l.reasons.length)
    .flatMap((l) => [`\n${l.locale}:`, ...l.reasons.slice(0, 4).map((r) => `· ${clip(r, REASON_CHARS)}`)]);

  return clip([head, ...lines, ...detail].join('\n'), TELEGRAM_LIMIT);
}
