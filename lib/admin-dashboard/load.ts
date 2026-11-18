// ============================================================================
// The admin home's database reads. The production database is a db-f1-micro
// that has run out of connections under load, so this file is deliberately
// polite: each section runs its queries one at a time, only two sections run
// together, results are memoised per instance for 10 minutes, and a section
// that fails or times out is reported on its own while the rest of the page
// still renders. Read-only: nothing here writes.
// ============================================================================
import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { DATA_REPORT_TAG } from '@/lib/data-reports';
import { NOT_WITHDRAWN } from '@/lib/legacy-redirects';
import { UNSUBSCRIBED_TAG } from '@/lib/marketing';
import { createCache } from '@/lib/site-analytics/cache';
import {
  DAY_MS,
  HOUR_MS,
  completeDayWindows,
  summarizeAutopilot,
  summarizeContent,
  summarizeEmail,
  summarizeTraffic,
  type ContentSummary,
  type EmailSummary,
  type SystemsSummary,
  type TrafficSummary,
} from './metrics';

export type Section<T> = { state: 'ok'; data: T; fetchedAt: string } | { state: 'error'; message: string };

export interface DashboardData {
  content: Section<ContentSummary>;
  traffic: Section<TrafficSummary>;
  email: Section<EmailSummary>;
  systems: Section<SystemsSummary>;
}

const OK_TTL_MS = 10 * 60 * 1000;
const ERROR_TTL_MS = 60 * 1000;
const SECTION_TIMEOUT_MS = 12_000;
const cache = createCache();

async function loadContent(now: Date): Promise<ContentSummary> {
  const live: Prisma.ArticleWhereInput = { AND: [NOT_WITHDRAWN] };
  const w = completeDayWindows(now);
  const byStatus = await prisma.article.groupBy({ by: ['locale', 'status'], where: live, _count: { _all: true } });
  const recentPublished = await prisma.article.findMany({
    where: { ...live, status: 'PUBLISHED', createdAt: { gte: w.previousStart, lt: w.end } },
    select: { locale: true, createdAt: true },
  });
  const scheduled = await prisma.article.findMany({
    where: { status: 'SCHEDULED', createdAt: { lte: new Date(now.getTime() + 7 * DAY_MS) } },
    orderBy: { createdAt: 'asc' },
    take: 100,
    select: { id: true, title: true, locale: true, createdAt: true },
  });
  const last = await prisma.article.aggregate({ where: { status: 'SCHEDULED' }, _max: { createdAt: true } });
  const dataReports = await prisma.article.groupBy({
    by: ['locale'],
    where: { ...live, status: 'PUBLISHED', tags: { some: { name: DATA_REPORT_TAG } } },
    _count: { _all: true },
  });
  const caseStudies = await prisma.caseStudy.groupBy({ by: ['status'], where: { sample: false }, _count: { _all: true } });
  const autopilotDrafts14d = await prisma.article.count({
    where: { status: 'DRAFT', aiModel: { not: null }, createdAt: { gte: new Date(now.getTime() - 14 * DAY_MS) } },
  });

  return summarizeContent(
    {
      byStatus: byStatus.map((r) => ({ locale: r.locale, status: r.status, count: r._count._all })),
      recentPublished,
      scheduled,
      lastScheduledAt: last._max.createdAt,
      dataReports: dataReports.map((r) => ({ locale: r.locale, count: r._count._all })),
      caseStudies: caseStudies.map((r) => ({ status: r.status, count: r._count._all })),
      autopilotDrafts14d,
    },
    now,
  );
}

async function loadTraffic(now: Date): Promise<TrafficSummary> {
  const w = completeDayWindows(now);
  const rows = await prisma.pageView.findMany({
    where: { createdAt: { gte: w.previousStart, lt: w.end } },
    select: { path: true, createdAt: true },
  });
  return summarizeTraffic(rows, now, await prisma.pageView.count());
}

/** `tags` is a text array on Postgres and a JSON string on the SQLite dev database. */
function hasUnsubscribedTag(): Prisma.MarketingContactWhereInput {
  const where = process.env.DATABASE_URL?.startsWith('postgres')
    ? { tags: { has: UNSUBSCRIBED_TAG } }
    : { tags: { contains: UNSUBSCRIBED_TAG } };
  return where as unknown as Prisma.MarketingContactWhereInput;
}

async function loadEmail(now: Date): Promise<EmailSummary> {
  const w = completeDayWindows(now);
  const hasEmail: Prisma.MarketingContactWhereInput = { AND: [{ email: { not: null } }, { email: { not: '' } }] };
  const unsubscribedWhere = hasUnsubscribedTag();

  const total = await prisma.marketingContact.count();
  const withEmail = await prisma.marketingContact.count({ where: hasEmail });
  const unsubscribed = await prisma.marketingContact.count({ where: unsubscribedWhere });
  const reachable = await prisma.marketingContact.count({ where: { AND: [hasEmail, { NOT: unsubscribedWhere }] } });

  const campaigns = await prisma.campaign.findMany({
    where: { type: { in: ['EMAIL', 'BOTH'] } },
    orderBy: { createdAt: 'desc' },
    take: 40,
    select: { id: true, name: true, status: true, createdAt: true, updatedAt: true, sentAt: true },
  });
  const email = { channel: 'EMAIL' };
  const logs = await prisma.campaignLog.groupBy({
    by: ['campaignId', 'status'],
    where: email,
    _count: { _all: true },
    _sum: { openCount: true, clickCount: true },
    _max: { sentAt: true },
  });
  const uniqueOpens = await prisma.campaignLog.groupBy({
    by: ['campaignId'],
    where: { ...email, openCount: { gt: 0 } },
    _count: { _all: true },
  });
  const uniqueClicks = await prisma.campaignLog.groupBy({
    by: ['campaignId'],
    where: { ...email, clickCount: { gt: 0 } },
    _count: { _all: true },
  });
  const sentLast28 = await prisma.campaignLog.count({
    where: { ...email, status: 'SENT', sentAt: { gte: w.start, lt: w.end } },
  });
  const sentPrevious28 = await prisma.campaignLog.count({
    where: { ...email, status: 'SENT', sentAt: { gte: w.previousStart, lt: w.start } },
  });

  return summarizeEmail(
    {
      contacts: { total, withEmail, unsubscribed, reachable },
      campaigns,
      logs: logs.map((l) => ({
        campaignId: l.campaignId,
        status: l.status,
        count: l._count._all,
        openEvents: l._sum.openCount ?? 0,
        clickEvents: l._sum.clickCount ?? 0,
        lastAt: l._max.sentAt,
      })),
      uniqueOpens: uniqueOpens.map((r) => ({ campaignId: r.campaignId, count: r._count._all })),
      uniqueClicks: uniqueClicks.map((r) => ({ campaignId: r.campaignId, count: r._count._all })),
      sentLast28,
      sentPrevious28,
    },
    now,
  );
}

async function loadSystems(now: Date): Promise<SystemsSummary> {
  const weekAgo = new Date(now.getTime() - 7 * DAY_MS);
  const hourAgo = new Date(now.getTime() - HOUR_MS);

  const runs = await prisma.autopilotRun.findMany({
    where: { startedAt: { gte: new Date(now.getTime() - 14 * DAY_MS) } },
    select: { startedAt: true, finishedAt: true, requested: true, created: true, errors: true },
  });
  const jobs = await prisma.ingestJob.groupBy({ by: ['status'], _count: { _all: true } });
  const failedJobs = await prisma.ingestJob.count({ where: { status: 'failed', updatedAt: { gte: weekAgo } } });
  const stuckJobs = await prisma.ingestJob.count({
    where: { OR: [{ status: 'running', updatedAt: { lt: hourAgo } }, { status: 'pending', runAfter: { lt: hourAgo } }] },
  });
  const social = await prisma.socialPost.groupBy({
    by: ['destination', 'status'],
    where: { createdAt: { gte: weekAgo } },
    _count: { _all: true },
  });
  const reportsLatest = await prisma.agentReport.groupBy({ by: ['agent'], _max: { createdAt: true } });
  const reportsWeek = await prisma.agentReport.count({ where: { createdAt: { gte: weekAgo } } });
  const telegramFailed = await prisma.agentReport.count({ where: { telegramStatus: 'failed', createdAt: { gte: weekAgo } } });
  const errored = await prisma.source.count({ where: { enabled: true, status: { in: ['error', 'blocked'] } } });
  const waiting = await prisma.sourceDocument.count({ where: { status: { in: ['new', 'ready'] } } });
  const openArticleReviews = await prisma.articleReview.count({ where: { resolvedAt: null } });

  const socialCount = (status: string) => social.filter((s) => s.status === status).reduce((n, s) => n + s._count._all, 0);
  return {
    autopilot: summarizeAutopilot(runs, now),
    ingest: {
      pending: jobs.find((j) => j.status === 'pending')?._count._all ?? 0,
      running: jobs.find((j) => j.status === 'running')?._count._all ?? 0,
      failed: failedJobs,
      stuck: stuckJobs,
    },
    social: {
      posted: socialCount('posted'),
      failed: socialCount('failed'),
      skipped: socialCount('skipped'),
      failedDestinations: social.filter((s) => s.status === 'failed').map((s) => s.destination),
    },
    reports: {
      last7Days: reportsWeek,
      telegramFailed,
      latestByAgent: reportsLatest
        .filter((r) => r._max.createdAt)
        .map((r) => ({
          agent: r.agent,
          at: r._max.createdAt!.toISOString(),
          ageDays: Math.floor((now.getTime() - r._max.createdAt!.getTime()) / DAY_MS),
        })),
    },
    sources: { errored, waiting },
    openArticleReviews,
  };
}

async function section<T>(name: string, load: () => Promise<T>): Promise<Section<T>> {
  try {
    return await cache.get(
      `dashboard:${name}`,
      async () => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        const timeout = new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error(`timed out after ${SECTION_TIMEOUT_MS} ms`)), SECTION_TIMEOUT_MS);
        });
        try {
          const data = await Promise.race([load(), timeout]);
          return { state: 'ok' as const, data, fetchedAt: new Date().toISOString() };
        } finally {
          clearTimeout(timer);
        }
      },
      OK_TTL_MS,
      ERROR_TTL_MS,
    );
  } catch (err) {
    // The raw error can carry connection details, so it goes to the log and not to the page.
    console.error(`[admin-dashboard] ${name}:`, err);
    return { state: 'error', message: 'The database did not answer in time. This section retries within a minute.' };
  }
}

export async function loadDashboard(now = new Date()): Promise<DashboardData> {
  const [content, traffic] = await Promise.all([
    section('content', () => loadContent(now)),
    section('traffic', () => loadTraffic(now)),
  ]);
  const [email, systems] = await Promise.all([
    section('email', () => loadEmail(now)),
    section('systems', () => loadSystems(now)),
  ]);
  return { content, traffic, email, systems };
}
