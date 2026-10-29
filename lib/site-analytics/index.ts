// ============================================================================
// Search Console and GA4 for the admin home. Server-only: it reads env vars
// and service-account credentials (google-auth.ts) and never reaches the
// browser. Each panel resolves to `ok`, `not_configured` (an env var or the
// credentials are missing — fail closed, call nothing) or `error` (Google
// refused or timed out), so the page can always render.
//
// Env:
//   SEARCH_CONSOLE_SITE  e.g. sc-domain:visaroads.com
//   GA4_PROPERTY_ID      the numeric property id, not the G- measurement id
//   GOOGLE_SERVICE_ACCOUNT_KEY  optional, local dev only (see google-auth.ts)
// ============================================================================
import { createCache } from './cache';
import { credentialSource, getAccessToken, serviceAccountEmail } from './google-auth';
import {
  CURRENT,
  PREVIOUS,
  aiAssistantSessions,
  andFilters,
  buildWindows,
  ga4SiteFilter,
  ga4WindowTotals,
  localeTotals,
  parseGa4Report,
  rankGa4,
  rankRows,
  splitDailyRows,
  type DailyPoint,
  type Ga4RankedRow,
  type Ga4Report,
  type GscRow,
  type GscTotals,
  type RankedRow,
  type SiteFilter,
  type Windows,
} from './shape';

export type Panel<T> =
  | { state: 'ok'; data: T; fetchedAt: string }
  | { state: 'not_configured'; missing: string[] }
  | { state: 'error'; message: string; serviceAccount: string | null };

export interface SearchConsoleData {
  windows: Windows;
  totals: { current: GscTotals; previous: GscTotals };
  /** Whole site only: Search Console has no per-locale daily series without a far bigger query. */
  daily: DailyPoint[];
  split: Record<'en' | 'fa', { current: GscTotals; previous: GscTotals }>;
  pages: RankedRow[];
  queries: RankedRow[];
}

export interface Ga4Data {
  windows: Windows;
  users: { current: number; previous: number };
  sessions: { current: number; previous: number };
  leads: { current: number; previous: number };
  aiAssistants: { current: number; previous: number; sources: Ga4RankedRow[] };
  landingPages: Ga4RankedRow[];
  channels: Ga4RankedRow[];
}

const cache = createCache();
const REQUEST_TIMEOUT_MS = 20_000;

function missingCredentials(): string[] {
  return credentialSource() ? [] : ['Google credentials (runs on Cloud Run, or GOOGLE_SERVICE_ACCOUNT_KEY locally)'];
}

async function googleError(res: Response, api: string): Promise<Error> {
  let detail = '';
  try {
    detail = (await res.json())?.error?.message ?? '';
  } catch {
    // body was not JSON
  }
  const hint =
    res.status === 403 || res.status === 401
      ? 'The service account has no access yet, or the API is not enabled on the project.'
      : res.status === 429
        ? 'Quota exhausted for now; it resets within the hour.'
        : '';
  return new Error([`${api} returned ${res.status}.`, hint, detail].filter(Boolean).join(' '));
}

async function toError<T>(err: unknown): Promise<Panel<T>> {
  const message = err instanceof Error ? err.message : 'Unknown error';
  console.error('[site-analytics]', message);
  return { state: 'error', message, serviceAccount: await serviceAccountEmail() };
}

// --------------------------------------------------------------------------
// Search Console
// --------------------------------------------------------------------------

interface GscRaw {
  daily: GscRow[];
  pagesCurrent: GscRow[];
  pagesPrevious: GscRow[];
  queriesCurrent: GscRow[];
  queriesPrevious: GscRow[];
  queryPageCurrent: GscRow[];
  queryPagePrevious: GscRow[];
}

async function gscQuery(
  site: string,
  token: string,
  body: { startDate: string; endDate: string; dimensions: string[]; rowLimit: number },
): Promise<GscRow[]> {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, type: 'web' }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: 'no-store',
  });
  if (!res.ok) throw await googleError(res, 'Search Console');
  return (await res.json()).rows ?? [];
}

async function loadGsc(site: string, w: Windows): Promise<GscRaw> {
  const token = await getAccessToken();
  const q = (window: { startDate: string; endDate: string }, dimensions: string[]) =>
    gscQuery(site, token, { ...window, dimensions, rowLimit: 25_000 });
  const both = { startDate: w.previous.startDate, endDate: w.current.endDate };

  const [daily, pagesCurrent, pagesPrevious, queriesCurrent, queriesPrevious, queryPageCurrent, queryPagePrevious] =
    await Promise.all([
      q(both, ['date']),
      q(w.current, ['page']),
      q(w.previous, ['page']),
      q(w.current, ['query']),
      q(w.previous, ['query']),
      q(w.current, ['query', 'page']),
      q(w.previous, ['query', 'page']),
    ]);
  return { daily, pagesCurrent, pagesPrevious, queriesCurrent, queriesPrevious, queryPageCurrent, queryPagePrevious };
}

/** Shapes the raw reports for one half of the site. Exported for tests. */
export function shapeSearchConsole(raw: GscRaw, windows: Windows, site: SiteFilter): SearchConsoleData {
  const whole = splitDailyRows(raw.daily, windows);
  const totalsFor = (s: 'en' | 'fa') => ({
    current: localeTotals(raw.pagesCurrent, s),
    previous: localeTotals(raw.pagesPrevious, s),
  });
  const split = { en: totalsFor('en'), fa: totalsFor('fa') };

  return {
    windows,
    // The whole-site headline uses Google's site-level totals; a locale's comes from its pages.
    totals: site === 'all' ? { current: whole.current, previous: whole.previous } : split[site],
    daily: whole.daily,
    split,
    pages: rankRows(raw.pagesCurrent, raw.pagesPrevious, { pageIndex: 0, site }),
    queries:
      site === 'all'
        ? rankRows(raw.queriesCurrent, raw.queriesPrevious)
        : rankRows(raw.queryPageCurrent, raw.queryPagePrevious, { keyIndex: 0, pageIndex: 1, site }),
  };
}

export async function getSearchConsole(site: SiteFilter, now = new Date()): Promise<Panel<SearchConsoleData>> {
  const property = process.env.SEARCH_CONSOLE_SITE?.trim();
  const missing = [...(property ? [] : ['SEARCH_CONSOLE_SITE']), ...missingCredentials()];
  if (missing.length) return { state: 'not_configured', missing };

  const windows = buildWindows(now);
  try {
    const { raw, fetchedAt } = await cache.get(`gsc:${property}:${windows.current.endDate}`, async () => ({
      raw: await loadGsc(property!, windows),
      fetchedAt: new Date().toISOString(),
    }));
    return { state: 'ok', data: shapeSearchConsole(raw, windows, site), fetchedAt };
  } catch (err) {
    return toError(err);
  }
}

// --------------------------------------------------------------------------
// GA4
// --------------------------------------------------------------------------

function ga4Requests(w: Windows, site: SiteFilter) {
  const dateRanges = [
    { ...w.current, name: CURRENT },
    { ...w.previous, name: PREVIOUS },
  ];
  const onSite = ga4SiteFilter(site);
  const base = { dateRanges, ...(onSite ? { dimensionFilter: onSite } : {}) };
  return [
    { ...base, metrics: [{ name: 'activeUsers' }, { name: 'sessions' }] },
    {
      ...base,
      dimensions: [{ name: 'landingPage' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 100,
    },
    {
      ...base,
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
    },
    {
      ...base,
      dimensions: [{ name: 'sessionSource' }],
      metrics: [{ name: 'sessions' }],
      limit: 500,
    },
    {
      dateRanges,
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: andFilters(
        { filter: { fieldName: 'eventName', stringFilter: { matchType: 'EXACT', value: 'generate_lead' } } },
        ga4SiteFilter(site, 'pagePath'),
      ),
    },
  ];
}

/** Shapes one batchRunReports response (reports in ga4Requests order). Exported for tests. */
export function shapeGa4(reports: Ga4Report[], windows: Windows): Ga4Data {
  const [totals, landing, channels, sources, leads] = [0, 1, 2, 3, 4].map((i) => parseGa4Report(reports[i]));
  return {
    windows,
    users: ga4WindowTotals(totals, 'activeUsers'),
    sessions: ga4WindowTotals(totals, 'sessions'),
    leads: ga4WindowTotals(leads, 'eventCount'),
    aiAssistants: aiAssistantSessions(sources),
    landingPages: rankGa4(landing, 'landingPage', 'sessions'),
    channels: rankGa4(channels, 'sessionDefaultChannelGroup', 'sessions', 8),
  };
}

async function loadGa4(property: string, w: Windows, site: SiteFilter): Promise<Ga4Report[]> {
  const token = await getAccessToken();
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:batchRunReports`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: ga4Requests(w, site) }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: 'no-store',
  });
  if (!res.ok) throw await googleError(res, 'GA4');
  return (await res.json()).reports ?? [];
}

export async function getGa4(site: SiteFilter, now = new Date()): Promise<Panel<Ga4Data>> {
  const property = process.env.GA4_PROPERTY_ID?.trim().replace(/^properties\//, '');
  const valid = !!property && /^\d+$/.test(property);
  const missing = [...(valid ? [] : ['GA4_PROPERTY_ID']), ...missingCredentials()];
  if (missing.length) return { state: 'not_configured', missing };

  const windows = buildWindows(now);
  try {
    const { reports, fetchedAt } = await cache.get(`ga4:${property}:${site}:${windows.current.endDate}`, async () => ({
      reports: await loadGa4(property!, windows, site),
      fetchedAt: new Date().toISOString(),
    }));
    return { state: 'ok', data: shapeGa4(reports, windows), fetchedAt };
  } catch (err) {
    return toError(err);
  }
}
