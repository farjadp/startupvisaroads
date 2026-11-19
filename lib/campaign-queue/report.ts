// ============================================================================
// lib/campaign-queue/report.ts
// Who opened, who clicked, and how each link did. Per-link click events exist
// only from this feature onward. Older clicks are known per person and link
// but not how many times, so each counts once.
// ============================================================================
import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export const RECIPIENT_FILTERS = ['all', 'opened', 'clicked', 'not-opened', 'failed'] as const;
export type RecipientFilter = (typeof RECIPIENT_FILTERS)[number];

export interface LinkReportRow {
  url: string;
  people: number;
  clicks: number;
}

export interface RecipientReportRow {
  id: string;
  recipient: string | null;
  name: string | null;
  channel: string;
  status: string;
  error: string | null;
  version: number;
  sentAt: Date;
  openCount: number;
  openedAt: Date | null;
  clickCount: number;
  clickedAt: Date | null;
  links: { url: string; clicks: number }[];
}

function parseUrls(value: string | null): string[] {
  try {
    const parsed: unknown = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed.filter((u): u is string => typeof u === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Clicks by this person on this link. With a single link, the person's total
 * also covers clicks from before per-link tracking; with several it cannot be
 * divided, so an untracked link counts once.
 */
function clicksOnLink(
  log: { id: string; clickCount: number },
  url: string,
  urls: string[],
  counts: Map<string, number>,
): number {
  const tracked = counts.get(`${log.id} ${url}`) ?? 0;
  return urls.length === 1 ? Math.max(tracked, log.clickCount, 1) : Math.max(tracked, 1);
}

async function clickCounts(where: Prisma.CampaignLinkClickWhereInput) {
  const rows = await prisma.campaignLinkClick.groupBy({ by: ['logId', 'url'], where, _count: { _all: true } });
  return new Map(rows.map((r) => [`${r.logId} ${r.url}`, r._count._all]));
}

export async function getCampaignLinkReport(campaignId: string): Promise<LinkReportRow[]> {
  const [logs, counts] = await Promise.all([
    prisma.campaignLog.findMany({
      where: { campaignId, clickCount: { gt: 0 } },
      select: { id: true, clickedUrls: true, clickCount: true },
    }),
    clickCounts({ campaignId }),
  ]);

  const links = new Map<string, LinkReportRow>();
  for (const log of logs) {
    const urls = parseUrls(log.clickedUrls);
    for (const url of urls) {
      const row = links.get(url) ?? { url, people: 0, clicks: 0 };
      row.people++;
      row.clicks += clicksOnLink(log, url, urls, counts);
      links.set(url, row);
    }
  }
  return [...links.values()].sort((a, b) => b.clicks - a.clicks || a.url.localeCompare(b.url));
}

export async function getCampaignRecipientReport(
  campaignId: string,
  opts: { show?: string; q?: string; page?: string; pageSize?: number },
) {
  const show: RecipientFilter = RECIPIENT_FILTERS.includes(opts.show as RecipientFilter)
    ? (opts.show as RecipientFilter)
    : 'all';
  const q = (opts.q ?? '').trim().toLowerCase().slice(0, 100);
  const pageSize = opts.pageSize ?? 50;

  const where: Prisma.CampaignLogWhereInput = { campaignId };
  if (show === 'opened') where.openCount = { gt: 0 };
  if (show === 'clicked') where.clickCount = { gt: 0 };
  if (show === 'not-opened') Object.assign(where, { status: 'SENT', openCount: 0 });
  if (show === 'failed') where.status = 'FAILED';

  if (q) {
    const matches = await prisma.marketingContact.findMany({
      where: { OR: [{ email: { contains: q } }, { phone: { contains: q } }] },
      select: { id: true },
      take: 1000,
    });
    where.contactId = { in: matches.map((c) => c.id) };
  }

  const total = await prisma.campaignLog.count({ where });
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const requested = Number.parseInt(opts.page ?? '1', 10);
  const page = Math.min(pages, Math.max(1, Number.isNaN(requested) ? 1 : requested));

  const logs = await prisma.campaignLog.findMany({
    where,
    orderBy: { sentAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const logIds = logs.map((l) => l.id);
  const [contacts, counts] = await Promise.all([
    prisma.marketingContact.findMany({
      where: { id: { in: logs.map((l) => l.contactId) } },
      select: { id: true, email: true, phone: true, name: true },
    }),
    clickCounts({ logId: { in: logIds } }),
  ]);
  const contactById = new Map(contacts.map((c) => [c.id, c]));

  const rows: RecipientReportRow[] = logs.map((log) => {
    const contact = contactById.get(log.contactId);
    const urls = parseUrls(log.clickedUrls);
    return {
      id: log.id,
      recipient: (log.channel === 'SMS' ? contact?.phone : contact?.email) ?? null,
      name: contact?.name ?? null,
      channel: log.channel,
      status: log.status,
      error: log.error,
      version: log.contentVersion ?? 1,
      sentAt: log.sentAt,
      openCount: log.openCount,
      openedAt: log.openedAt,
      clickCount: log.clickCount,
      clickedAt: log.clickedAt,
      links: urls.map((url) => ({ url, clicks: clicksOnLink(log, url, urls, counts) })),
    };
  });

  return { show, q, page, pages, total, rows };
}

/** Sent, opened and clicked per version of the content. */
export async function getCampaignVersionReport(campaignId: string) {
  const [campaign, older] = await Promise.all([
    prisma.campaign.findUnique({ where: { id: campaignId }, select: { contentVersion: true, subject: true } }),
    prisma.campaignContentVersion.findMany({
      where: { campaignId },
      orderBy: { version: 'asc' },
      select: { version: true, subject: true, replacedAt: true },
    }),
  ]);
  if (!campaign) return [];

  const versions = [
    ...older.map((v) => ({ ...v, current: false })),
    { version: campaign.contentVersion, subject: campaign.subject, replacedAt: null as Date | null, current: true },
  ];

  return Promise.all(
    versions.map(async (v) => {
      // Logs from before versioning have no number and belong to version 1.
      const scope: Prisma.CampaignLogWhereInput =
        v.version === 1
          ? { campaignId, OR: [{ contentVersion: null }, { contentVersion: 1 }] }
          : { campaignId, contentVersion: v.version };
      const [sent, opened, clicked] = await Promise.all([
        prisma.campaignLog.count({ where: { ...scope, status: 'SENT' } }),
        prisma.campaignLog.count({ where: { ...scope, openCount: { gt: 0 } } }),
        prisma.campaignLog.count({ where: { ...scope, clickCount: { gt: 0 } } }),
      ]);
      return { ...v, sent, opened, clicked };
    }),
  );
}
