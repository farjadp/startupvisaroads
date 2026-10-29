import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  aiAssistantSessions,
  andFilters,
  buildWindows,
  displayPath,
  ga4SiteFilter,
  ga4WindowTotals,
  isAiAssistantSource,
  parseGa4Report,
  pathLocale,
  percentChange,
  rankGa4,
  rankRows,
  splitDailyRows,
  sumGscRows,
  type GscRow,
} from '../site-analytics/shape';
import { createCache } from '../site-analytics/cache';
import { getGa4, getSearchConsole, shapeGa4, shapeSearchConsole } from '../site-analytics';

const row = (keys: string[], clicks: number, impressions: number, position = 10): GscRow => ({
  keys,
  clicks,
  impressions,
  ctr: impressions ? clicks / impressions : 0,
  position,
});

const NOW = new Date('2026-10-26T15:00:00Z');
const W = buildWindows(NOW);

describe('buildWindows', () => {
  it('ends three days back and covers two back-to-back 28-day windows', () => {
    expect(W.current).toEqual({ startDate: '2026-09-26', endDate: '2026-10-23' });
    expect(W.previous).toEqual({ startDate: '2026-08-29', endDate: '2026-09-25' });
  });

  it('works across a month and year boundary in UTC', () => {
    const w = buildWindows(new Date('2027-01-02T00:30:00Z'));
    expect(w.current.endDate).toBe('2026-12-30');
    expect(w.current.startDate).toBe('2026-12-03');
    expect(w.previous.endDate).toBe('2026-12-02');
  });
});

describe('pathLocale and displayPath', () => {
  it('reads the locale from full URLs and from paths', () => {
    expect(pathLocale('https://visaroads.com/fa/blog/x')).toBe('fa');
    expect(pathLocale('https://visaroads.com/en')).toBe('en');
    expect(pathLocale('/en/startup-visa-canada')).toBe('en');
    expect(pathLocale('/fa?utm=1')).toBe('fa');
    expect(pathLocale('/')).toBe('other');
    expect(pathLocale('/family/x')).toBe('other');
    expect(pathLocale('/fantastic')).toBe('other');
  });

  it('shows Persian slugs decoded rather than percent-encoded', () => {
    expect(displayPath('https://visaroads.com/fa/%D9%88%DB%8C%D8%B2%D8%A7')).toBe('/fa/ویزا');
    expect(displayPath('/en/x?a=1')).toBe('/en/x?a=1');
  });
});

describe('percentChange', () => {
  it('returns null with no baseline', () => {
    expect(percentChange(5, 0)).toBeNull();
    expect(percentChange(15, 10)).toBeCloseTo(0.5);
    expect(percentChange(5, 10)).toBeCloseTo(-0.5);
  });
});

describe('sumGscRows', () => {
  it('recomputes CTR from sums and weights position by impressions', () => {
    const t = sumGscRows([row(['a'], 10, 100, 2), row(['b'], 0, 300, 20)]);
    expect(t.clicks).toBe(10);
    expect(t.impressions).toBe(400);
    expect(t.ctr).toBeCloseTo(0.025);
    expect(t.position).toBeCloseTo((2 * 100 + 20 * 300) / 400);
  });

  it('is all zeros for no rows instead of NaN', () => {
    expect(sumGscRows([])).toEqual({ clicks: 0, impressions: 0, ctr: 0, position: 0 });
  });
});

describe('splitDailyRows', () => {
  it('splits a 56-day report into the two windows and fills missing days', () => {
    const { current, previous, daily } = splitDailyRows(
      [row(['2026-09-01'], 3, 30), row(['2026-09-26'], 2, 20), row(['2026-10-23'], 1, 10), row(['2026-10-24'], 99, 99)],
      W,
    );
    expect(previous.clicks).toBe(3);
    expect(current.clicks).toBe(3); // 2026-10-24 is past the window and ignored
    expect(daily).toHaveLength(28);
    expect(daily[0]).toEqual({ date: '2026-09-26', clicks: 2, impressions: 20 });
    expect(daily[1]).toEqual({ date: '2026-09-27', clicks: 0, impressions: 0 });
    expect(daily[27].date).toBe('2026-10-23');
  });
});

describe('rankRows', () => {
  const cur = [
    row(['https://visaroads.com/en/a'], 5, 50),
    row(['https://visaroads.com/fa/b'], 8, 40),
    row(['https://visaroads.com/en/c'], 5, 90),
  ];
  const prev = [row(['https://visaroads.com/en/a'], 2, 10)];

  it('ranks by clicks then impressions and carries the previous clicks', () => {
    const r = rankRows(cur, prev, { pageIndex: 0 });
    expect(r.map((x) => x.key)).toEqual([
      'https://visaroads.com/fa/b',
      'https://visaroads.com/en/c',
      'https://visaroads.com/en/a',
    ]);
    expect(r[2].previousClicks).toBe(2);
    expect(r[0].previousClicks).toBeNull();
  });

  it('filters to one locale by page', () => {
    expect(rankRows(cur, prev, { pageIndex: 0, site: 'fa' }).map((x) => x.key)).toEqual(['https://visaroads.com/fa/b']);
  });

  it('merges [query, page] rows per query for a locale', () => {
    const qp = [
      row(['startup visa', 'https://visaroads.com/en/a'], 2, 20, 4),
      row(['startup visa', 'https://visaroads.com/en/c'], 1, 20, 8),
      row(['startup visa', 'https://visaroads.com/fa/b'], 9, 90),
      row(['ویزای استارتاپ', 'https://visaroads.com/fa/b'], 4, 40),
    ];
    const en = rankRows(qp, [], { keyIndex: 0, pageIndex: 1, site: 'en' });
    expect(en).toHaveLength(1);
    expect(en[0]).toMatchObject({ key: 'startup visa', clicks: 3, impressions: 40, position: 6 });
    const fa = rankRows(qp, [], { keyIndex: 0, pageIndex: 1, site: 'fa' });
    expect(fa.map((x) => x.key)).toEqual(['startup visa', 'ویزای استارتاپ']);
  });

  it('respects the limit', () => {
    expect(rankRows(cur, [], { limit: 2 })).toHaveLength(2);
  });
});

describe('shapeSearchConsole', () => {
  const raw = {
    daily: [row(['2026-10-01'], 10, 1000, 12), row(['2026-09-01'], 4, 500, 20)],
    pagesCurrent: [row(['https://visaroads.com/en/a'], 6, 600), row(['https://visaroads.com/fa/b'], 3, 300)],
    pagesPrevious: [row(['https://visaroads.com/en/a'], 4, 400)],
    queriesCurrent: [row(['q1'], 5, 100)],
    queriesPrevious: [],
    queryPageCurrent: [row(['q-fa', 'https://visaroads.com/fa/b'], 2, 50)],
    queryPagePrevious: [],
  };

  it('uses site-level totals for the whole site', () => {
    const d = shapeSearchConsole(raw, W, 'all');
    expect(d.totals.current.clicks).toBe(10);
    expect(d.totals.previous.clicks).toBe(4);
    expect(d.queries.map((q) => q.key)).toEqual(['q1']);
    expect(d.split.en.current.clicks).toBe(6);
    expect(d.split.fa.current.clicks).toBe(3);
    expect(d.split.fa.previous.clicks).toBe(0);
  });

  it('uses the locale page sums and [query, page] rows for /fa', () => {
    const d = shapeSearchConsole(raw, W, 'fa');
    expect(d.totals.current.clicks).toBe(3);
    expect(d.pages.map((p) => p.key)).toEqual(['https://visaroads.com/fa/b']);
    expect(d.queries.map((q) => q.key)).toEqual(['q-fa']);
  });
});

describe('GA4 shaping', () => {
  const report = (dims: string[], mets: string[], rows: Array<[string[], number[]]>) => ({
    dimensionHeaders: dims.map((name) => ({ name })),
    metricHeaders: mets.map((name) => ({ name })),
    rows: rows.map(([d, m]) => ({
      dimensionValues: d.map((value) => ({ value })),
      metricValues: m.map((v) => ({ value: String(v) })),
    })),
  });

  it('parses rows and treats bad numbers as zero', () => {
    const rows = parseGa4Report(report(['x'], ['m'], [[['a'], [NaN]]]));
    expect(rows).toEqual([{ dims: { x: 'a' }, metrics: { m: 0 } }]);
    expect(parseGa4Report(undefined)).toEqual([]);
    expect(parseGa4Report({})).toEqual([]);
  });

  it('reads per-window totals from the dateRange dimension', () => {
    const rows = parseGa4Report(
      report(['dateRange'], ['activeUsers', 'sessions'], [
        [['current'], [120, 150]],
        [['previous'], [100, 140]],
      ]),
    );
    expect(ga4WindowTotals(rows, 'activeUsers')).toEqual({ current: 120, previous: 100 });
    expect(ga4WindowTotals(rows, 'sessions')).toEqual({ current: 150, previous: 140 });
  });

  it('ranks a two-window report by the current window', () => {
    const rows = parseGa4Report(
      report(['landingPage', 'dateRange'], ['sessions'], [
        [['/en/a', 'current'], [5]],
        [['/fa/b', 'current'], [9]],
        [['/en/a', 'previous'], [7]],
        [['/en/old', 'previous'], [30]],
      ]),
    );
    expect(rankGa4(rows, 'landingPage', 'sessions')).toEqual([
      { key: '/fa/b', value: 9, previous: null },
      { key: '/en/a', value: 5, previous: 7 },
    ]);
  });

  it('picks out AI-assistant referrers', () => {
    expect(isAiAssistantSource('chatgpt.com')).toBe(true);
    expect(isAiAssistantSource('www.perplexity.ai')).toBe(true);
    expect(isAiAssistantSource('gemini.google.com')).toBe(true);
    expect(isAiAssistantSource('google')).toBe(false);
    expect(isAiAssistantSource('notchatgpt.com.evil')).toBe(false);

    const rows = parseGa4Report(
      report(['sessionSource', 'dateRange'], ['sessions'], [
        [['chatgpt.com', 'current'], [4]],
        [['perplexity.ai', 'current'], [1]],
        [['google', 'current'], [80]],
        [['chatgpt.com', 'previous'], [2]],
      ]),
    );
    const ai = aiAssistantSessions(rows);
    expect(ai.current).toBe(5);
    expect(ai.previous).toBe(2);
    expect(ai.sources[0]).toEqual({ key: 'chatgpt.com', value: 4, previous: 2 });
  });

  it('builds locale filters that do not match look-alike paths', () => {
    const f = ga4SiteFilter('fa') as any;
    const re = new RegExp(f.filter.stringFilter.value);
    expect(re.test('/fa')).toBe(true);
    expect(re.test('/fa/blog/x')).toBe(true);
    expect(re.test('/fa?x=1')).toBe(true);
    expect(re.test('/family')).toBe(false);
    expect(re.test('/en/fa')).toBe(false);
    expect(ga4SiteFilter('all')).toBeUndefined();
  });

  it('ANDs filters and drops empty ones', () => {
    const a = { filter: { fieldName: 'a' } };
    expect(andFilters(undefined)).toBeUndefined();
    expect(andFilters(a, undefined)).toBe(a);
    expect(andFilters(a, a)).toEqual({ andGroup: { expressions: [a, a] } });
  });

  it('shapes a batchRunReports response in request order', () => {
    const d = shapeGa4(
      [
        report(['dateRange'], ['activeUsers', 'sessions'], [[['current'], [10, 12]], [['previous'], [8, 9]]]),
        report(['landingPage', 'dateRange'], ['sessions'], [[['/en/a', 'current'], [6]]]),
        report(['sessionDefaultChannelGroup', 'dateRange'], ['sessions'], [[['Organic Search', 'current'], [7]]]),
        report(['sessionSource', 'dateRange'], ['sessions'], [[['chatgpt.com', 'current'], [2]]]),
        report(['dateRange'], ['eventCount'], [[['current'], [3]]]),
      ],
      W,
    );
    expect(d.users).toEqual({ current: 10, previous: 8 });
    expect(d.sessions).toEqual({ current: 12, previous: 9 });
    expect(d.leads).toEqual({ current: 3, previous: 0 });
    expect(d.aiAssistants.current).toBe(2);
    expect(d.landingPages[0].key).toBe('/en/a');
    expect(d.channels[0].key).toBe('Organic Search');
  });

  it('survives missing reports', () => {
    const d = shapeGa4([], W);
    expect(d.users).toEqual({ current: 0, previous: 0 });
    expect(d.landingPages).toEqual([]);
  });
});

describe('createCache', () => {
  it('shares one in-flight load and reuses it until the TTL passes', async () => {
    let t = 0;
    const cache = createCache(() => t);
    const load = vi.fn(async () => 'v');
    await Promise.all([cache.get('k', load, 100), cache.get('k', load, 100)]);
    expect(load).toHaveBeenCalledTimes(1);
    t = 50;
    await cache.get('k', load, 100);
    expect(load).toHaveBeenCalledTimes(1);
    t = 101;
    await cache.get('k', load, 100);
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('keeps failures for the shorter error TTL', async () => {
    let t = 0;
    const cache = createCache(() => t);
    const load = vi.fn(async () => {
      throw new Error('403');
    });
    await expect(cache.get('k', load, 1000, 10)).rejects.toThrow('403');
    await expect(cache.get('k', load, 1000, 10)).rejects.toThrow('403');
    expect(load).toHaveBeenCalledTimes(1);
    t = 11;
    await expect(cache.get('k', load, 1000, 10)).rejects.toThrow('403');
    expect(load).toHaveBeenCalledTimes(2);
  });
});

describe('fail closed', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('reports what is missing and calls nothing when unconfigured', async () => {
    vi.stubEnv('SEARCH_CONSOLE_SITE', '');
    vi.stubEnv('GA4_PROPERTY_ID', '');
    vi.stubEnv('K_SERVICE', '');
    vi.stubEnv('GOOGLE_SERVICE_ACCOUNT_KEY', '');
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const gsc = await getSearchConsole('all', NOW);
    const ga4 = await getGa4('all', NOW);
    expect(gsc.state).toBe('not_configured');
    expect(ga4.state).toBe('not_configured');
    if (gsc.state === 'not_configured') expect(gsc.missing[0]).toBe('SEARCH_CONSOLE_SITE');
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('rejects a G- measurement id in place of the property id', async () => {
    vi.stubEnv('GA4_PROPERTY_ID', 'G-SZ34QLY2ZV');
    vi.stubEnv('K_SERVICE', 'startupvisaroads');
    const ga4 = await getGa4('all', NOW);
    expect(ga4.state).toBe('not_configured');
    if (ga4.state === 'not_configured') expect(ga4.missing).toEqual(['GA4_PROPERTY_ID']);
  });
});
