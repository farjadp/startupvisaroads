// ============================================================================
// Pure shaping for the admin dashboard's Search Console and GA4 numbers: the
// date windows, the per-locale split and the rows the page renders. No I/O
// here, so all of it is covered by lib/__tests__/site-analytics.test.ts.
// ============================================================================

export type SiteFilter = 'all' | 'en' | 'fa';
export type PathLocale = 'en' | 'fa' | 'other';

export interface DateWindow {
  startDate: string; // YYYY-MM-DD, inclusive
  endDate: string;
}

export interface Windows {
  current: DateWindow;
  previous: DateWindow;
}

/** Search Console finalises a day 2–3 days late; ending both windows here keeps GSC and GA4 comparable. */
export const DATA_LAG_DAYS = 3;
export const WINDOW_DAYS = 28;

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number): Date {
  const out = new Date(d.getTime());
  out.setUTCDate(out.getUTCDate() + days);
  return out;
}

/** The last 28 complete days and the 28 before them, in UTC. */
export function buildWindows(now: Date, lagDays = DATA_LAG_DAYS, days = WINDOW_DAYS): Windows {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = addDays(today, -lagDays);
  const start = addDays(end, -(days - 1));
  const prevEnd = addDays(start, -1);
  const prevStart = addDays(prevEnd, -(days - 1));
  return {
    current: { startDate: isoDay(start), endDate: isoDay(end) },
    previous: { startDate: isoDay(prevStart), endDate: isoDay(prevEnd) },
  };
}

/** Which half of the site a URL or path belongs to. GSC gives full URLs, GA4 gives paths. */
export function pathLocale(urlOrPath: string): PathLocale {
  let path = urlOrPath;
  if (/^https?:\/\//i.test(urlOrPath)) {
    try {
      path = new URL(urlOrPath).pathname;
    } catch {
      return 'other';
    }
  }
  if (path === '/fa' || path.startsWith('/fa/') || path.startsWith('/fa?')) return 'fa';
  if (path === '/en' || path.startsWith('/en/') || path.startsWith('/en?')) return 'en';
  return 'other';
}

export function matchesSite(urlOrPath: string, site: SiteFilter): boolean {
  return site === 'all' || pathLocale(urlOrPath) === site;
}

/** Strips scheme and host so tables show `/en/blog/…` rather than the full URL. */
export function displayPath(urlOrPath: string): string {
  if (!/^https?:\/\//i.test(urlOrPath)) return urlOrPath || '/';
  try {
    const u = new URL(urlOrPath);
    return decodeURI(u.pathname) + u.search;
  } catch {
    return urlOrPath;
  }
}

/** Relative change, or null when there is nothing to compare against. */
export function percentChange(current: number, previous: number): number | null {
  if (!previous) return null;
  return (current - previous) / previous;
}

// --------------------------------------------------------------------------
// Search Console
// --------------------------------------------------------------------------

export interface GscRow {
  keys?: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscTotals {
  clicks: number;
  impressions: number;
  ctr: number; // 0..1
  position: number; // impression-weighted, 0 when there were no impressions
}

/**
 * Sums rows into one set of totals. Position is averaged by impressions, which
 * is how Search Console itself averages it; summing CTRs would be wrong, so CTR
 * is recomputed from the sums.
 */
export function sumGscRows(rows: GscRow[]): GscTotals {
  let clicks = 0;
  let impressions = 0;
  let weightedPosition = 0;
  for (const r of rows) {
    clicks += r.clicks;
    impressions += r.impressions;
    weightedPosition += r.position * r.impressions;
  }
  return {
    clicks,
    impressions,
    ctr: impressions ? clicks / impressions : 0,
    position: impressions ? weightedPosition / impressions : 0,
  };
}

export interface DailyPoint {
  date: string;
  clicks: number;
  impressions: number;
}

/** Splits a 56-day `date` report into the two windows' totals plus the current window's daily series. */
export function splitDailyRows(rows: GscRow[], windows: Windows): {
  current: GscTotals;
  previous: GscTotals;
  daily: DailyPoint[];
} {
  const inWindow = (date: string, w: DateWindow) => date >= w.startDate && date <= w.endDate;
  const cur = rows.filter((r) => inWindow(r.keys?.[0] ?? '', windows.current));
  const prev = rows.filter((r) => inWindow(r.keys?.[0] ?? '', windows.previous));

  // Days with no impressions are missing from the API response; fill them so the chart has no gaps.
  const byDate = new Map(cur.map((r) => [r.keys![0], r]));
  const daily: DailyPoint[] = [];
  for (let d = new Date(`${windows.current.startDate}T00:00:00Z`); isoDay(d) <= windows.current.endDate; d = addDays(d, 1)) {
    const key = isoDay(d);
    const row = byDate.get(key);
    daily.push({ date: key, clicks: row?.clicks ?? 0, impressions: row?.impressions ?? 0 });
  }

  return { current: sumGscRows(cur), previous: sumGscRows(prev), daily };
}

/** Totals for one locale, built from `page` rows. */
export function localeTotals(pageRows: GscRow[], site: SiteFilter): GscTotals {
  return sumGscRows(pageRows.filter((r) => matchesSite(r.keys?.[0] ?? '', site)));
}

export interface RankedRow {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  previousClicks: number | null; // null: not seen in the previous window
}

/**
 * Groups rows by the key at `keyIndex`, keeping only rows whose page (at
 * `pageIndex`, if any) is in `site`, then ranks by clicks, impressions second.
 * Rows from a `[query, page]` report are merged per query, which is how a
 * locale gets its own top-queries list.
 */
export function rankRows(
  current: GscRow[],
  previous: GscRow[],
  opts: { keyIndex?: number; pageIndex?: number; site?: SiteFilter; limit?: number } = {},
): RankedRow[] {
  const { keyIndex = 0, pageIndex, site = 'all', limit = 10 } = opts;
  const group = (rows: GscRow[]) => {
    const map = new Map<string, GscRow[]>();
    for (const r of rows) {
      const keys = r.keys ?? [];
      if (pageIndex !== undefined && !matchesSite(keys[pageIndex] ?? '', site)) continue;
      const k = keys[keyIndex] ?? '';
      const list = map.get(k);
      if (list) list.push(r);
      else map.set(k, [r]);
    }
    return map;
  };

  const prev = group(previous);
  const ranked: RankedRow[] = [];
  for (const [key, rows] of group(current)) {
    const t = sumGscRows(rows);
    const p = prev.get(key);
    ranked.push({ key, ...t, previousClicks: p ? sumGscRows(p).clicks : null });
  }
  ranked.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions || a.key.localeCompare(b.key));
  return ranked.slice(0, limit);
}

// --------------------------------------------------------------------------
// GA4
// --------------------------------------------------------------------------

/** One report from the GA4 Data API `runReport` / `batchRunReports` response. */
export interface Ga4Report {
  dimensionHeaders?: Array<{ name: string }>;
  metricHeaders?: Array<{ name: string }>;
  rows?: Array<{
    dimensionValues?: Array<{ value?: string }>;
    metricValues?: Array<{ value?: string }>;
  }>;
}

export interface Ga4Row {
  dims: Record<string, string>;
  metrics: Record<string, number>;
}

export function parseGa4Report(report: Ga4Report | undefined): Ga4Row[] {
  if (!report?.rows) return [];
  const dimNames = (report.dimensionHeaders ?? []).map((h) => h.name);
  const metNames = (report.metricHeaders ?? []).map((h) => h.name);
  return report.rows.map((row) => {
    const dims: Record<string, string> = {};
    const metrics: Record<string, number> = {};
    dimNames.forEach((n, i) => (dims[n] = row.dimensionValues?.[i]?.value ?? ''));
    metNames.forEach((n, i) => {
      const v = Number(row.metricValues?.[i]?.value ?? 0);
      metrics[n] = Number.isFinite(v) ? v : 0;
    });
    return { dims, metrics };
  });
}

/** The date-range names the requests use; GA4 echoes them in the `dateRange` dimension. */
export const CURRENT = 'current';
export const PREVIOUS = 'previous';

/** Reads one metric for each window out of a report with no dimensions but two date ranges. */
export function ga4WindowTotals(rows: Ga4Row[], metric: string): { current: number; previous: number } {
  const pick = (name: string) =>
    rows.filter((r) => (r.dims.dateRange ?? CURRENT) === name).reduce((s, r) => s + (r.metrics[metric] ?? 0), 0);
  return { current: pick(CURRENT), previous: pick(PREVIOUS) };
}

export interface Ga4RankedRow {
  key: string;
  value: number;
  previous: number | null;
}

/** Ranks a one-dimension, one-metric, two-window report by the current window. */
export function rankGa4(rows: Ga4Row[], dimension: string, metric: string, limit = 10): Ga4RankedRow[] {
  const cur = new Map<string, number>();
  const prev = new Map<string, number>();
  for (const r of rows) {
    const key = r.dims[dimension] ?? '';
    const target = (r.dims.dateRange ?? CURRENT) === PREVIOUS ? prev : cur;
    target.set(key, (target.get(key) ?? 0) + (r.metrics[metric] ?? 0));
  }
  return [...cur.entries()]
    .map(([key, value]) => ({ key, value, previous: prev.has(key) ? prev.get(key)! : null }))
    .sort((a, b) => b.value - a.value || a.key.localeCompare(b.key))
    .slice(0, limit);
}

/**
 * Referrers that are AI assistants. GA4 files these under Referral; pulling
 * them out is the one measurable trace of AI-search (GEO) visibility, since no
 * API reports citations that send no click.
 */
const AI_SOURCE = /(^|\.)(chatgpt\.com|chat\.openai\.com|openai\.com|perplexity\.ai|gemini\.google\.com|bard\.google\.com|copilot\.microsoft\.com|claude\.ai|you\.com|phind\.com|meta\.ai|deepseek\.com|grok\.com|chat\.mistral\.ai)$/i;

export function isAiAssistantSource(source: string): boolean {
  const s = source.trim().toLowerCase();
  return AI_SOURCE.test(s) || s === 'chatgpt' || s === 'perplexity';
}

/** Sessions from AI assistants per window, out of a `sessionSource` × two-window report. */
export function aiAssistantSessions(rows: Ga4Row[]): { current: number; previous: number; sources: Ga4RankedRow[] } {
  const ai = rows.filter((r) => isAiAssistantSource(r.dims.sessionSource ?? ''));
  return { ...ga4WindowTotals(ai, 'sessions'), sources: rankGa4(ai, 'sessionSource', 'sessions', 5) };
}

/** Builds the GA4 `dimensionFilter` that limits a report to one half of the site. */
export function ga4SiteFilter(site: SiteFilter, dimension = 'landingPage'): Record<string, unknown> | undefined {
  if (site === 'all') return undefined;
  return {
    filter: {
      fieldName: dimension,
      stringFilter: { matchType: 'FULL_REGEXP', value: `^/${site}(/.*|\\?.*)?$` },
    },
  };
}

/** ANDs filters together, dropping the empty ones. */
export function andFilters(...filters: Array<Record<string, unknown> | undefined>): Record<string, unknown> | undefined {
  const present = filters.filter((f): f is Record<string, unknown> => !!f);
  if (present.length === 0) return undefined;
  if (present.length === 1) return present[0];
  return { andGroup: { expressions: present } };
}
