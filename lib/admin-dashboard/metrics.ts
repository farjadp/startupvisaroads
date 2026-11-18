// ============================================================================
// Pure shaping for the admin home's own-database numbers. No I/O: load.ts runs
// the queries and hands the rows here, so every figure on the page can be
// tested from plain data.
// ============================================================================
import { pathLocale } from '@/lib/site-analytics/shape';

export const DAY_MS = 86_400_000;
export const HOUR_MS = 3_600_000;
export const WINDOW_DAYS = 28;

/** A SENDING campaign may pause for a daily batch, so only a silence longer than a day counts as stuck. */
export const STUCK_CAMPAIGN_HOURS = 26;
/** Campaigns below this many attempts are tests; they stay in the totals but leave the table. */
export const SMALL_CAMPAIGN_ATTEMPTS = 10;

export type Locale = 'en' | 'fa';
export const LOCALES: Locale[] = ['en', 'fa'];

export interface Compare {
  current: number;
  previous: number;
}

export function startOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/** The last `days` complete UTC days and the same span before them. Today is partial, so it is left out. */
export function completeDayWindows(now: Date, days = WINDOW_DAYS) {
  const end = startOfUtcDay(now);
  const start = new Date(end.getTime() - days * DAY_MS);
  const previousStart = new Date(start.getTime() - days * DAY_MS);
  return { previousStart, start, end };
}

function compareIn<T>(rows: T[], at: (row: T) => Date, w: ReturnType<typeof completeDayWindows>): Compare {
  let current = 0;
  let previous = 0;
  for (const row of rows) {
    const t = at(row).getTime();
    if (t >= w.start.getTime() && t < w.end.getTime()) current += 1;
    else if (t >= w.previousStart.getTime() && t < w.start.getTime()) previous += 1;
  }
  return { current, previous };
}

// --------------------------------------------------------------------------
// Traffic (PageView)
// --------------------------------------------------------------------------

export interface PageViewRow {
  path: string;
  createdAt: Date;
}

export interface TrafficDay {
  date: string;
  en: number;
  fa: number;
}

export interface TrafficSummary {
  /** Every row ever logged, for context next to the 28-day figures. */
  allTime: number;
  total: Compare;
  byLocale: Record<Locale, Compare>;
  daily: TrafficDay[];
  topPages: Array<{ path: string; views: number; previous: number }>;
  windowStart: string;
  windowEnd: string;
}

export function summarizeTraffic(rows: PageViewRow[], now: Date, allTime = 0, topN = 10): TrafficSummary {
  const w = completeDayWindows(now);
  const daily = new Map<string, TrafficDay>();
  for (let t = w.start.getTime(); t < w.end.getTime(); t += DAY_MS) {
    const date = isoDay(new Date(t));
    daily.set(date, { date, en: 0, fa: 0 });
  }

  const total: Compare = { current: 0, previous: 0 };
  const byLocale: Record<Locale, Compare> = { en: { current: 0, previous: 0 }, fa: { current: 0, previous: 0 } };
  const pages = new Map<string, { views: number; previous: number }>();

  for (const row of rows) {
    const t = row.createdAt.getTime();
    const isCurrent = t >= w.start.getTime() && t < w.end.getTime();
    const isPrevious = t >= w.previousStart.getTime() && t < w.start.getTime();
    if (!isCurrent && !isPrevious) continue;
    const bucket = isCurrent ? 'current' : 'previous';
    total[bucket] += 1;

    // /api/track accepts any path, so only real locale pages reach the charts and the table.
    const locale = pathLocale(row.path);
    if (locale === 'other') continue;
    byLocale[locale][bucket] += 1;
    const page = pages.get(row.path) ?? { views: 0, previous: 0 };
    if (isCurrent) {
      page.views += 1;
      daily.get(isoDay(row.createdAt))![locale] += 1;
    } else {
      page.previous += 1;
    }
    pages.set(row.path, page);
  }

  return {
    allTime,
    total,
    byLocale,
    daily: [...daily.values()],
    topPages: [...pages.entries()]
      .filter(([, p]) => p.views > 0)
      .map(([path, p]) => ({ path, ...p }))
      .sort((a, b) => b.views - a.views || a.path.localeCompare(b.path))
      .slice(0, topN),
    windowStart: isoDay(w.start),
    windowEnd: isoDay(new Date(w.end.getTime() - DAY_MS)),
  };
}

// --------------------------------------------------------------------------
// Content
// --------------------------------------------------------------------------

export interface ContentInput {
  byStatus: Array<{ locale: string; status: string; count: number }>;
  recentPublished: Array<{ locale: string; createdAt: Date }>;
  /** SCHEDULED rows, oldest first. createdAt is the moment each is released. */
  scheduled: Array<{ id: string; title: string; locale: string; createdAt: Date }>;
  lastScheduledAt: Date | null;
  dataReports: Array<{ locale: string; count: number }>;
  caseStudies: Array<{ status: string; count: number }>;
  autopilotDrafts14d: number;
}

export interface ContentSummary {
  counts: Record<Locale, { published: number; scheduled: number; draft: number }>;
  published: Compare;
  publishedByLocale: Record<Locale, Compare>;
  next7Days: Array<{ id: string; title: string; locale: string; at: string }>;
  /** Locales with nothing scheduled in the next 7 days. */
  scheduleGaps: Locale[];
  overdueScheduled: number;
  lastScheduledAt: string | null;
  dataReports: Record<Locale, number>;
  caseStudies: Record<string, number>;
  autopilotDrafts14d: number;
}

export function summarizeContent(input: ContentInput, now: Date): ContentSummary {
  const counts: ContentSummary['counts'] = {
    en: { published: 0, scheduled: 0, draft: 0 },
    fa: { published: 0, scheduled: 0, draft: 0 },
  };
  for (const row of input.byStatus) {
    if (row.locale !== 'en' && row.locale !== 'fa') continue;
    if (row.status === 'PUBLISHED') counts[row.locale].published += row.count;
    else if (row.status === 'SCHEDULED') counts[row.locale].scheduled += row.count;
    else if (row.status === 'DRAFT') counts[row.locale].draft += row.count;
  }

  const w = completeDayWindows(now);
  const at = (r: { createdAt: Date }) => r.createdAt;
  const horizon = now.getTime() + 7 * DAY_MS;
  const upcoming = input.scheduled.filter((a) => a.createdAt.getTime() > now.getTime() && a.createdAt.getTime() <= horizon);

  return {
    counts,
    published: compareIn(input.recentPublished, at, w),
    publishedByLocale: {
      en: compareIn(input.recentPublished.filter((r) => r.locale === 'en'), at, w),
      fa: compareIn(input.recentPublished.filter((r) => r.locale === 'fa'), at, w),
    },
    next7Days: upcoming.map((a) => ({ id: a.id, title: a.title, locale: a.locale, at: a.createdAt.toISOString() })),
    scheduleGaps: LOCALES.filter((l) => !upcoming.some((a) => a.locale === l)),
    // The 15-minute cron releases due rows, so one still here an hour later did not go out.
    overdueScheduled: input.scheduled.filter((a) => a.createdAt.getTime() < now.getTime() - HOUR_MS).length,
    lastScheduledAt: input.lastScheduledAt?.toISOString() ?? null,
    dataReports: {
      en: input.dataReports.find((r) => r.locale === 'en')?.count ?? 0,
      fa: input.dataReports.find((r) => r.locale === 'fa')?.count ?? 0,
    },
    caseStudies: Object.fromEntries(input.caseStudies.map((c) => [c.status, c.count])),
    autopilotDrafts14d: input.autopilotDrafts14d,
  };
}

// --------------------------------------------------------------------------
// Email
// --------------------------------------------------------------------------

export interface EmailInput {
  contacts: { total: number; withEmail: number; unsubscribed: number; reachable: number };
  campaigns: Array<{ id: string; name: string; status: string; createdAt: Date; updatedAt: Date; sentAt: Date | null }>;
  logs: Array<{ campaignId: string; status: string; count: number; openEvents: number; clickEvents: number; lastAt: Date | null }>;
  uniqueOpens: Array<{ campaignId: string; count: number }>;
  uniqueClicks: Array<{ campaignId: string; count: number }>;
  sentLast28: number;
  sentPrevious28: number;
}

export interface CampaignRow {
  id: string;
  name: string;
  status: string;
  sent: number;
  failed: number;
  uniqueOpens: number;
  uniqueClicks: number;
  openEvents: number;
  clickEvents: number;
  lastActivity: string | null;
  stuckHours: number | null;
}

export interface EmailSummary {
  contacts: EmailInput['contacts'];
  sent: number;
  failed: number;
  sent28: Compare;
  campaigns: CampaignRow[];
  hiddenTestCampaigns: number;
}

export function summarizeEmail(input: EmailInput, now: Date): EmailSummary {
  const opens = new Map(input.uniqueOpens.map((r) => [r.campaignId, r.count]));
  const clicks = new Map(input.uniqueClicks.map((r) => [r.campaignId, r.count]));
  const totalWith = (status: string) => input.logs.filter((l) => l.status === status).reduce((s, l) => s + l.count, 0);
  let hiddenTestCampaigns = 0;
  const rows: CampaignRow[] = [];

  for (const c of input.campaigns) {
    const logs = input.logs.filter((l) => l.campaignId === c.id);
    const count = (status: string) => logs.filter((l) => l.status === status).reduce((s, l) => s + l.count, 0);
    const campaignSent = count('SENT');
    const campaignFailed = count('FAILED');

    const lastLog = logs.reduce<number>((max, l) => Math.max(max, l.lastAt?.getTime() ?? 0), 0);
    const lastActivity = lastLog || c.updatedAt.getTime();
    const silentHours = (now.getTime() - lastActivity) / HOUR_MS;

    if (c.status !== 'SENDING' && c.status !== 'FAILED' && campaignSent + campaignFailed < SMALL_CAMPAIGN_ATTEMPTS) {
      hiddenTestCampaigns += 1;
      continue;
    }
    rows.push({
      id: c.id,
      name: c.name,
      status: c.status,
      sent: campaignSent,
      failed: campaignFailed,
      uniqueOpens: opens.get(c.id) ?? 0,
      uniqueClicks: clicks.get(c.id) ?? 0,
      openEvents: logs.reduce((s, l) => s + l.openEvents, 0),
      clickEvents: logs.reduce((s, l) => s + l.clickEvents, 0),
      lastActivity: new Date(lastActivity).toISOString(),
      stuckHours: c.status === 'SENDING' && silentHours > STUCK_CAMPAIGN_HOURS ? Math.floor(silentHours) : null,
    });
  }

  return {
    contacts: input.contacts,
    sent: totalWith('SENT'),
    failed: totalWith('FAILED'),
    sent28: { current: input.sentLast28, previous: input.sentPrevious28 },
    campaigns: rows,
    hiddenTestCampaigns,
  };
}

// --------------------------------------------------------------------------
// Systems
// --------------------------------------------------------------------------

export type RunErrorKind = 'database' | 'credits' | 'other';

export function classifyRunError(message: string): RunErrorKind {
  if (/too many database connections|connection slots|can't reach database|timed out fetching a new connection/i.test(message)) return 'database';
  if (/no credits|insufficient[_ ]quota|credit balance/i.test(message)) return 'credits';
  return 'other';
}

/** The distinct error kinds in one run's `errors` JSON. Unreadable JSON still counts as an error. */
export function runErrorKinds(errors: string | null): RunErrorKind[] {
  if (!errors) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(errors);
  } catch {
    return ['other'];
  }
  if (!Array.isArray(parsed)) return ['other'];
  const kinds = parsed.map((e) => classifyRunError(String((e as { error?: unknown } | null)?.error ?? '')));
  return [...new Set(kinds)];
}

export interface AutopilotRunRow {
  startedAt: Date;
  finishedAt: Date | null;
  requested: number;
  created: number;
  errors: string | null;
}

export interface AutopilotSummary {
  runs: Compare;
  runsWithErrors: Compare;
  articlesCreated: number;
  byKind: Record<RunErrorKind, { runs: number; lastAt: string | null }>;
  /** Started over two hours ago and never finished. */
  unfinished: number;
}

export function summarizeAutopilot(rows: AutopilotRunRow[], now: Date): AutopilotSummary {
  const start = now.getTime() - 7 * DAY_MS;
  const previousStart = start - 7 * DAY_MS;
  const out: AutopilotSummary = {
    runs: { current: 0, previous: 0 },
    runsWithErrors: { current: 0, previous: 0 },
    articlesCreated: 0,
    byKind: { database: { runs: 0, lastAt: null }, credits: { runs: 0, lastAt: null }, other: { runs: 0, lastAt: null } },
    unfinished: 0,
  };

  for (const run of rows) {
    const t = run.startedAt.getTime();
    const kinds = runErrorKinds(run.errors);
    if (t >= start) {
      out.runs.current += 1;
      out.articlesCreated += run.created;
      if (kinds.length) out.runsWithErrors.current += 1;
      for (const kind of kinds) {
        const entry = out.byKind[kind];
        entry.runs += 1;
        if (!entry.lastAt || t > Date.parse(entry.lastAt)) entry.lastAt = run.startedAt.toISOString();
      }
      if (!run.finishedAt && t < now.getTime() - 2 * HOUR_MS) out.unfinished += 1;
    } else if (t >= previousStart) {
      out.runs.previous += 1;
      if (kinds.length) out.runsWithErrors.previous += 1;
    }
  }
  return out;
}

export interface SystemsSummary {
  autopilot: AutopilotSummary;
  ingest: { pending: number; running: number; failed: number; stuck: number };
  social: { posted: number; failed: number; skipped: number; failedDestinations: string[] };
  reports: {
    last7Days: number;
    telegramFailed: number;
    latestByAgent: Array<{ agent: string; at: string; ageDays: number }>;
  };
  sources: { errored: number; waiting: number };
  openArticleReviews: number;
}
