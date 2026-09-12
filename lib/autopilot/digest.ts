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

    // A dry run records a created count and inserts nothing. Counting it is
    // how this digest reported "fa: healthy — 1 published" against a database
    // that held zero Persian articles, which is precisely the false
    // confidence it exists to prevent.
    const isDry = (r: RunRow) => /dry[- ]?run/i.test(r.notes ?? '');
    const real = mine.filter((r) => !isDry(r));
    const created = real.reduce((n, r) => n + (r.created ?? 0), 0);

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
    if (!real.length) state = 'silent';
    else if (stuck) state = 'stuck';
    else if (created === 0) state = 'degraded';
    else state = 'healthy';

    if (state === 'silent') {
      push(
        mine.length
          ? `Only dry runs in the last ${windowHours} hour${windowHours === 1 ? '' : 's'} — nothing was published.`
          : `No autopilot run in the last ${windowHours} hour${windowHours === 1 ? '' : 's'}.`,
      );
    }
    if (state === 'stuck') push('A run started and never finished.');

    return { locale, state, runs: real.length, created, reasons };
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
/**
 * Queues that need a person. Both exist because of decisions taken on
 * purpose — an item needs approval before it is written, an article needs
 * checking after its source moved — and both fail the same way: nobody looks.
 * A queue reported once a day is a queue; a queue reported nowhere is a
 * backlog that grows until someone notices the site is wrong.
 */
export type QueueSummary = { suggestions?: number; reviews?: number };

export function buildDigest(lanes: LaneSummary[], now: Date, social: SocialSummary[] = [], queues: QueueSummary = {}): string {
  const created = lanes.reduce((n, l) => n + l.created, 0);
  const worst = lanes.some((l) => l.state !== 'healthy');

  const head = `${worst ? '⚠️' : '✅'} Autopilot · ${now.toISOString().slice(0, 16).replace('T', ' ')} UTC · ${created} published`;

  const lines = lanes.map((l) => `${ICON[l.state]} ${l.locale}: ${l.state} — ${l.runs} run(s), ${l.created} published`);

  const detail = lanes
    .filter((l) => l.state !== 'healthy' && l.reasons.length)
    .flatMap((l) => [`\n${l.locale}:`, ...l.reasons.slice(0, 4).map((r) => `· ${clip(r, REASON_CHARS)}`)]);

  // Only unhealthy destinations get a line. A healthy day must stay short.
  const socialLines = social
    .filter((d) => d.state !== 'healthy')
    .map((d) => `${d.state === 'failing' ? '⚠️' : '🔌'} ${d.destination}: ${d.state}${d.reasons.length ? ` — ${clip(d.reasons[0], REASON_CHARS)}` : ''}`);

  const queueLines: string[] = [];
  if (queues.reviews) {
    queueLines.push(`📌 ${queues.reviews} article(s) need review — a source they cite has changed since they were written.`);
  }
  if (queues.suggestions) {
    queueLines.push(`📥 ${queues.suggestions} triaged source item(s) waiting for approval in the admin.`);
  }

  return clip([head, ...lines, ...socialLines, ...queueLines, ...detail].join('\n'), TELEGRAM_LIMIT);
}

// ── Social delivery ────────────────────────────────────────────────────────
// Social posting is the easiest thing in this system to lose without noticing,
// because when it stops, nothing on the site changes. It gets reported beside
// the writing lanes for the same reason the lanes are reported per locale:
// an aggregate "social is fine" hides the one destination that is not.

export type SocialRow = {
  destination: string;
  /** posted | failed | skipped */
  status: string;
  createdAt: Date;
  error: string | null;
};

export type SocialState = 'healthy' | 'failing' | 'unconfigured';

export type SocialSummary = {
  destination: string;
  state: SocialState;
  posted: number;
  failed: number;
  reasons: string[];
};

export function summariseSocial(rows: SocialRow[], now: Date, windowHours = DEFAULT_WINDOW_HOURS): SocialSummary[] {
  const since = new Date(now.getTime() - windowHours * 3_600_000);
  const byDest = new Map<string, SocialRow[]>();
  for (const r of rows) {
    if (r.createdAt < since) continue;
    byDest.set(r.destination, [...(byDest.get(r.destination) ?? []), r]);
  }

  return [...byDest.entries()].map(([destination, rs]) => {
    const posted = rs.filter((r) => r.status === 'posted').length;
    const failed = rs.filter((r) => r.status === 'failed').length;
    const skipped = rs.filter((r) => r.status === 'skipped').length;

    const reasons: string[] = [];
    for (const r of rs) {
      const e = r.error?.trim();
      if (e && !reasons.includes(e)) reasons.push(e);
    }

    // A destination nobody has configured is not broken. Calling it broken
    // every day is how a digest teaches its reader to stop opening it.
    let state: SocialState;
    if (posted > 0) state = 'healthy';
    else if (failed > 0) state = 'failing';
    else if (skipped > 0) state = 'unconfigured';
    else state = 'healthy';

    return { destination, state, posted, failed, reasons };
  });
}
