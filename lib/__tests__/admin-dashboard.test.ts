import { describe, it, expect } from 'vitest';
import {
  classifyRunError,
  completeDayWindows,
  rollingWindows,
  runErrorKinds,
  summarizeAutopilot,
  summarizeContent,
  summarizeEmail,
  summarizeTraffic,
  type ContentInput,
  type ContentSummary,
  type EmailInput,
  type SystemsSummary,
} from '@/lib/admin-dashboard/metrics';
import { buildSuggestions, RULES, type SuggestionInput } from '@/lib/admin-dashboard/suggestions';
import { searchOpportunities } from '@/lib/site-analytics/shape';

const NOW = new Date('2026-11-18T12:00:00Z');
const daysAgo = (d: number, hour = 10) => new Date(Date.UTC(2026, 10, 18 - d, hour));
const inDays = (d: number) => new Date(NOW.getTime() + d * 86_400_000);

describe('completeDayWindows', () => {
  it('ends at the start of today and spans two equal windows', () => {
    const w = completeDayWindows(NOW);
    expect(w.end.toISOString()).toBe('2026-11-18T00:00:00.000Z');
    expect(w.start.toISOString()).toBe('2026-10-21T00:00:00.000Z');
    expect(w.previousStart.toISOString()).toBe('2026-09-23T00:00:00.000Z');
  });
});

describe('rollingWindows', () => {
  it('runs up to now, so sends from today are inside the current window', () => {
    const w = rollingWindows(NOW);
    expect(w.end).toEqual(NOW);
    expect(w.start.toISOString()).toBe('2026-10-21T12:00:00.000Z');
    expect(w.previousStart.toISOString()).toBe('2026-09-23T12:00:00.000Z');
    const earlierToday = new Date('2026-11-18T09:00:00Z');
    expect(earlierToday >= w.start && earlierToday <= w.end).toBe(true);
  });
});

describe('summarizeTraffic', () => {
  const rows = [
    { path: '/en', createdAt: daysAgo(1) },
    { path: '/en', createdAt: daysAgo(2) },
    { path: '/fa/blog/x', createdAt: daysAgo(1) },
    { path: '/en', createdAt: daysAgo(30) },
    { path: '/junk', createdAt: daysAgo(1) },
    { path: '/en', createdAt: daysAgo(0) }, // today is partial
    { path: '/en', createdAt: daysAgo(90) }, // outside both windows
  ];
  const s = summarizeTraffic(rows, NOW);

  it('counts both windows and leaves out today', () => {
    expect(s.total).toEqual({ current: 4, previous: 1 });
    expect(s.byLocale.en).toEqual({ current: 2, previous: 1 });
    expect(s.byLocale.fa).toEqual({ current: 1, previous: 0 });
  });

  it('fills all 28 days and keeps junk paths out of the tables', () => {
    expect(s.daily).toHaveLength(28);
    expect(s.daily.at(-1)).toEqual({ date: '2026-11-17', en: 1, fa: 1 });
    expect(s.topPages.map((p) => p.path)).toEqual(['/en', '/fa/blog/x']);
    expect(s.topPages[0]).toEqual({ path: '/en', views: 2, previous: 1 });
  });
});

const contentInput = (over: Partial<ContentInput> = {}): ContentInput => ({
  byStatus: [
    { locale: 'en', status: 'PUBLISHED', count: 10 },
    { locale: 'fa', status: 'DRAFT', count: 3 },
  ],
  recentPublished: [
    { locale: 'en', createdAt: daysAgo(2) },
    { locale: 'fa', createdAt: daysAgo(40) },
  ],
  scheduled: [{ id: 'a', title: 'A', locale: 'en', createdAt: inDays(2) }],
  lastScheduledAt: inDays(40),
  dataReports: [{ locale: 'en', count: 2 }],
  caseStudies: [{ status: 'IN_REVIEW', count: 2 }],
  autopilotDrafts14d: 1,
  ...over,
});

describe('summarizeContent', () => {
  it('compares publishing windows and finds locales with no schedule', () => {
    const s = summarizeContent(contentInput(), NOW);
    expect(s.published).toEqual({ current: 1, previous: 1 });
    expect(s.publishedByLocale.fa).toEqual({ current: 0, previous: 1 });
    expect(s.next7Days.map((a) => a.id)).toEqual(['a']);
    expect(s.scheduleGaps).toEqual(['fa']);
    expect(s.overdueScheduled).toBe(0);
  });

  it('treats a row over an hour past its time as overdue, and a fresh one as the cron’s job', () => {
    const s = summarizeContent(
      contentInput({
        scheduled: [
          { id: 'late', title: 'L', locale: 'en', createdAt: new Date(NOW.getTime() - 2 * 3_600_000) },
          { id: 'fresh', title: 'F', locale: 'en', createdAt: new Date(NOW.getTime() - 5 * 60_000) },
        ],
      }),
      NOW,
    );
    expect(s.overdueScheduled).toBe(1);
    expect(s.next7Days).toEqual([]);
  });
});

const emailInput = (over: Partial<EmailInput> = {}): EmailInput => ({
  contacts: { total: 100, withEmail: 90, unsubscribed: 5, reachable: 85 },
  campaigns: [
    { id: 'big', name: 'Big', status: 'DONE', createdAt: daysAgo(5), updatedAt: daysAgo(5), sentAt: daysAgo(5) },
    { id: 'test', name: 'test', status: 'DONE', createdAt: daysAgo(9), updatedAt: daysAgo(9), sentAt: daysAgo(9) },
  ],
  logs: [
    { campaignId: 'big', status: 'SENT', count: 95, openEvents: 40, clickEvents: 90, lastAt: daysAgo(5) },
    { campaignId: 'big', status: 'FAILED', count: 5, openEvents: 0, clickEvents: 0, lastAt: daysAgo(5) },
    { campaignId: 'test', status: 'SENT', count: 2, openEvents: 0, clickEvents: 0, lastAt: daysAgo(9) },
  ],
  uniqueOpens: [{ campaignId: 'big', count: 30 }],
  uniqueClicks: [{ campaignId: 'big', count: 10 }],
  sentLast28: 97,
  sentPrevious28: 0,
  ...over,
});

describe('summarizeEmail', () => {
  it('reports per-campaign truth, keeps tests in totals and out of the table', () => {
    const s = summarizeEmail(emailInput(), NOW);
    expect(s.sent).toBe(97);
    expect(s.failed).toBe(5);
    expect(s.hiddenTestCampaigns).toBe(1);
    expect(s.campaigns).toHaveLength(1);
    expect(s.campaigns[0]).toMatchObject({ sent: 95, failed: 5, uniqueOpens: 30, uniqueClicks: 10, stuckHours: null });
  });

  const sending = (lastAt: Date) =>
    emailInput({
      campaigns: [{ id: 's', name: 'S', status: 'SENDING', createdAt: daysAgo(3), updatedAt: daysAgo(3), sentAt: null }],
      logs: [{ campaignId: 's', status: 'SENT', count: 5, openEvents: 0, clickEvents: 0, lastAt }],
    });

  it('flags SENDING only after more than a day of silence', () => {
    expect(summarizeEmail(sending(new Date(NOW.getTime() - 20 * 3_600_000)), NOW).campaigns[0].stuckHours).toBeNull();
    expect(summarizeEmail(sending(new Date(NOW.getTime() - 30 * 3_600_000)), NOW).campaigns[0].stuckHours).toBe(30);
  });
});

describe('autopilot errors', () => {
  it('classifies the failures seen in production', () => {
    expect(classifyRunError('Too many database connections opened: FATAL: remaining connection slots')).toBe('database');
    expect(classifyRunError('429 You have no credits remaining.')).toBe('credits');
    expect(classifyRunError('something else')).toBe('other');
  });

  it('reads the errors column defensively', () => {
    expect(runErrorKinds(null)).toEqual([]);
    expect(runErrorKinds('[]')).toEqual([]);
    expect(runErrorKinds('not json')).toEqual(['other']);
    expect(runErrorKinds(JSON.stringify([{ error: 'no credits' }, { error: 'no credits' }]))).toEqual(['credits']);
  });

  it('counts a run once per kind and separates the two weeks', () => {
    const base = { requested: 1, created: 0, finishedAt: NOW };
    const s = summarizeAutopilot(
      [
        { ...base, startedAt: daysAgo(1), errors: JSON.stringify([{ error: 'connection slots' }, { error: 'connection slots' }]) },
        { ...base, startedAt: daysAgo(2), errors: null, created: 2 },
        { ...base, startedAt: daysAgo(10), errors: JSON.stringify([{ error: 'x' }]) },
        { ...base, startedAt: new Date(NOW.getTime() - 3 * 3_600_000), errors: null, finishedAt: null },
      ],
      NOW,
    );
    expect(s.runs).toEqual({ current: 3, previous: 1 });
    expect(s.runsWithErrors).toEqual({ current: 1, previous: 1 });
    expect(s.byKind.database.runs).toBe(1);
    expect(s.articlesCreated).toBe(2);
    expect(s.unfinished).toBe(1);
  });
});

describe('searchOpportunities', () => {
  const row = (key: string, clicks: number, impressions: number, position: number) => ({
    keys: [key],
    clicks,
    impressions,
    ctr: impressions ? clicks / impressions : 0,
    position,
  });

  it('judges pages against the site’s own CTR', () => {
    const o = searchOpportunities(
      [row('https://visaroads.com/en/a', 90, 1000, 3), row('https://visaroads.com/en/b', 1, 500, 6), row('https://visaroads.com/en/c', 0, 500, 40)],
      [row('https://visaroads.com/en/a', 90, 900, 3), row('https://visaroads.com/en/gone', 12, 300, 8)],
      [row('near', 0, 40, 12), row('far', 0, 400, 35), row('rare', 0, 5, 11)],
    );
    expect(o.lowCtrPages.map((p) => p.path)).toEqual(['/en/b']);
    expect(o.strikingQueries.map((q) => q.query)).toEqual(['near']);
    expect(o.decliningPages).toEqual([{ path: '/en/gone', clicks: 0, previousClicks: 12 }]);
  });
});

describe('buildSuggestions', () => {
  const systems = (): SystemsSummary => ({
    autopilot: summarizeAutopilot([], NOW),
    ingest: { pending: 0, running: 0, failed: 0, stuck: 0 },
    social: { posted: 0, failed: 0, skipped: 0, failedDestinations: [] },
    reports: { last7Days: 4, telegramFailed: 0, latestByAgent: [{ agent: 'seo', at: daysAgo(2).toISOString(), ageDays: 2 }] },
    sources: { errored: 0, waiting: 0 },
    openArticleReviews: 0,
  });
  const quietContent = (): ContentSummary =>
    summarizeContent(
      contentInput({
        scheduled: [
          { id: 'a', title: 'A', locale: 'en', createdAt: inDays(1) },
          { id: 'b', title: 'B', locale: 'fa', createdAt: inDays(2) },
        ],
        caseStudies: [],
        autopilotDrafts14d: 0,
      }),
      NOW,
    );
  const input = (over: Partial<SuggestionInput> = {}): SuggestionInput => ({
    now: NOW,
    adminBase: '/en/admin',
    searchConsole: 'ok',
    ga4: 'ok',
    opportunities: null,
    ga4Sessions: null,
    ga4Leads: null,
    content: quietContent(),
    traffic: null,
    email: summarizeEmail(emailInput({ logs: [], uniqueOpens: [], uniqueClicks: [] }), NOW),
    systems: systems(),
    ...over,
  });
  const ids = (i: SuggestionInput) => buildSuggestions(i).items.map((s) => s.id);

  it('says only the standing lead gap when everything is healthy', () => {
    expect(ids(input())).toEqual(['leads-not-stored']);
  });

  it('stays silent about a section it could not read', () => {
    expect(ids(input({ content: null, email: null, systems: null, traffic: null }))).toEqual(['leads-not-stored']);
  });

  it('puts urgent items first and gives each one evidence and a link', () => {
    const s = systems();
    s.autopilot.byKind.database = { runs: 3, lastAt: daysAgo(1).toISOString() };
    const { items } = buildSuggestions(input({ searchConsole: 'not_configured', ga4: 'not_configured', systems: s }));
    expect(items.map((i) => i.id)).toEqual(['google-not-connected', 'autopilot-db', 'leads-not-stored']);
    expect(items[0].evidence).toBe('۰ از ۲');
    expect(items[1].evidence).toBe('۳ اجرا');
    for (const item of items) {
      expect(item.href).toBeTruthy();
      expect(item.why).toBeTruthy();
    }
  });

  it('drops old credit failures once runs have moved on', () => {
    const s = systems();
    s.autopilot.byKind.credits = { runs: 3, lastAt: daysAgo(RULES.creditErrorDays + 1).toISOString() };
    expect(ids(input({ systems: s }))).not.toContain('autopilot-credits');
    s.autopilot.byKind.credits.lastAt = daysAgo(1).toISOString();
    expect(ids(input({ systems: s }))).toContain('autopilot-credits');
  });

  it('flags a stuck campaign and a high failure rate', () => {
    const email = summarizeEmail(
      emailInput({
        campaigns: [{ id: 's', name: 'S', status: 'SENDING', createdAt: daysAgo(4), updatedAt: daysAgo(4), sentAt: null }],
        logs: [
          { campaignId: 's', status: 'SENT', count: 90, openEvents: 0, clickEvents: 0, lastAt: daysAgo(3) },
          { campaignId: 's', status: 'FAILED', count: 10, openEvents: 0, clickEvents: 0, lastAt: daysAgo(3) },
        ],
      }),
      NOW,
    );
    expect(ids(input({ email }))).toEqual(['campaign-stuck-s', 'campaign-failures-s', 'leads-not-stored']);
  });

  it('needs enough earlier traffic before calling a drop', () => {
    const traffic = (previous: number, current: number) => ({ ...summarizeTraffic([], NOW), total: { current, previous } });
    expect(ids(input({ traffic: traffic(100, 10) }))).not.toContain('traffic-drop');
    expect(ids(input({ traffic: traffic(1000, 600) }))).toContain('traffic-drop');
    expect(ids(input({ traffic: traffic(1000, 800) }))).not.toContain('traffic-drop');
  });

  it('caps the list and reports what it left out', () => {
    const s = systems();
    s.autopilot.byKind.database = { runs: 1, lastAt: daysAgo(1).toISOString() };
    s.autopilot.unfinished = 1;
    s.ingest.failed = 1;
    s.social = { posted: 0, failed: 1, skipped: 0, failedDestinations: ['x'] };
    s.reports.telegramFailed = 1;
    s.openArticleReviews = 1;
    s.sources = { errored: 1, waiting: 1 };
    const out = buildSuggestions(input({ systems: s, searchConsole: 'error' }));
    expect(out.items).toHaveLength(RULES.maxShown);
    expect(out.hidden).toBeGreaterThan(0);
  });
});
