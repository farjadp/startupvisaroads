// ============================================================================
// lib/knowledge/queue.ts
// What the source-driven writer is allowed to write from, and what is waiting
// for a person to say yes.
//
// This replaces the harvest half of lib/autopilot/sources.ts. That function
// did three jobs in one pass — fetch the feeds, ledger the URLs, hydrate the
// text — inside the writing run, which meant a slow feed ate the writing
// budget and a refused item had already cost a full read. Discovery and
// reading now happen on their own schedule (watch.ts, ingest.ts), and this
// module only answers a question about rows that already exist.
//
// THE APPROVAL RULE
// Decided 12 Sep 2026: an official source scoring 5 out of 5 may be written
// without being asked; everything else waits in the admin as a suggestion and
// is written on one click. So the same queue is read two ways, and `mode`
// says which.
//
// The lane going quiet is the risk this creates, and it is the failure this
// project has had twice. So `pendingCount` exists and the run notes say how
// many are waiting: a silent lane with a full queue must be visible without
// anyone going looking.
// ============================================================================
import prisma from '@/lib/prisma';
import { AUTO_WRITE_THRESHOLD, WRITE_THRESHOLD } from './triage';

/** One document, in the shape the source writer already expects. */
export type WritableDocument = {
  documentId: string;
  sourceId: string;
  sourceSlug: string;
  sourceName: string;
  trust: string;
  url: string;
  title: string;
  publishedAt: Date | null;
  relevance: number | null;
  /** Plain text of the original, a working input. Never published. */
  text: string;
};

export type QueueMode = 'auto' | 'any';

const FRESH_DAYS = 21;

/**
 * Documents worth writing from, best first.
 *
 * `auto` is what a scheduled run may take unasked: an official source, top
 * score. `any` is what the admin can write from on request, which is every
 * document that cleared triage.
 */
export async function writableDocuments(n: number, locale: 'en' | 'fa', mode: QueueMode = 'auto'): Promise<WritableDocument[]> {
  const since = new Date(Date.now() - FRESH_DAYS * 864e5);
  const rows = await prisma.sourceDocument.findMany({
    where: {
      status: 'ready',
      articleIds: '[]', // never written from
      text: { not: '' },
      source: {
        enabled: true,
        ...(mode === 'auto' ? { trust: 'official' } : {}),
        // A source with no language set is fair game for either lane: most
        // official pages are English and the Persian lane writes from them
        // routinely, which is the point of a fact sheet.
        OR: [{ locale }, { locale: null }],
      },
      ...(mode === 'auto' ? { relevance: { gte: AUTO_WRITE_THRESHOLD } } : { relevance: { gte: WRITE_THRESHOLD } }),
      OR: [{ publishedAt: { gte: since } }, { publishedAt: null, fetchedAt: { gte: since } }],
    },
    orderBy: [{ relevance: 'desc' }, { publishedAt: 'desc' }, { fetchedAt: 'desc' }],
    take: n,
    include: { source: { select: { id: true, title: true, url: true, trust: true } } },
  });

  return rows
    .filter((d) => d.url)
    .map((d) => ({
      documentId: d.id,
      sourceId: d.source.id,
      sourceSlug: slugFor(d.source.url, d.source.title),
      sourceName: d.source.title ?? hostOf(d.source.url) ?? 'a source',
      trust: d.source.trust,
      url: d.url as string,
      title: d.title,
      publishedAt: d.publishedAt,
      relevance: d.relevance,
      text: d.text,
    }));
}

/** One specific document, for the admin's "write from this now". */
export async function writableDocumentById(documentId: string): Promise<WritableDocument | null> {
  const d = await prisma.sourceDocument.findUnique({
    where: { id: documentId },
    include: { source: { select: { id: true, title: true, url: true, trust: true } } },
  });
  if (!d || !d.url || !d.text) return null;
  return {
    documentId: d.id,
    sourceId: d.source.id,
    sourceSlug: slugFor(d.source.url, d.source.title),
    sourceName: d.source.title ?? hostOf(d.source.url) ?? 'a source',
    trust: d.source.trust,
    url: d.url,
    title: d.title,
    publishedAt: d.publishedAt,
    relevance: d.relevance,
    text: d.text,
  };
}

/**
 * How many cleared triage but are not eligible for an unasked run. This is
 * the number that makes a deliberately quiet lane distinguishable from a
 * broken one.
 */
export async function pendingCount(locale: 'en' | 'fa'): Promise<number> {
  const since = new Date(Date.now() - FRESH_DAYS * 864e5);
  return prisma.sourceDocument.count({
    where: {
      status: 'ready',
      articleIds: '[]',
      text: { not: '' },
      relevance: { gte: WRITE_THRESHOLD },
      source: { enabled: true, OR: [{ locale }, { locale: null }] },
      NOT: { AND: [{ relevance: { gte: AUTO_WRITE_THRESHOLD } }, { source: { trust: 'official' } }] },
      OR: [{ publishedAt: { gte: since } }, { publishedAt: null, fetchedAt: { gte: since } }],
    },
  });
}

/** Record the outcome of a writing attempt on the document it came from. */
export async function markDocument(
  documentId: string,
  status: 'used' | 'ignored' | 'failed',
  reason?: string,
  articleId?: string,
): Promise<void> {
  await prisma.sourceDocument
    .update({
      where: { id: documentId },
      data: {
        status,
        reason: reason?.slice(0, 500) ?? null,
        ...(articleId ? { articleIds: JSON.stringify([articleId]) } : {}),
      },
    })
    .catch((e) => console.error('knowledge/queue: could not mark', documentId, e instanceof Error ? e.message : e));
}

// ---------------------------------------------------------------------------
const hostOf = (url: string | null) => {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
};

/** A stable short name for logs and for the old ledger's sourceSlug column. */
function slugFor(url: string | null, title: string | null): string {
  const host = hostOf(url);
  if (host) return host.split('.')[0];
  return (title ?? 'source').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
}
