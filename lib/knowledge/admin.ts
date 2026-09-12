// ============================================================================
// lib/knowledge/admin.ts
// Read models for the admin pages. Kept out of the route files because Next
// treats every export of a route module as an HTTP handler.
// ============================================================================
import prisma from '@/lib/prisma';

export const parseList = (s: string): string[] => {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
};

export type SourceRow = Awaited<ReturnType<typeof listSources>>[number];

export async function listSources() {
  const rows = await prisma.source.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { documents: true } },
      documents: { select: { status: true, charCount: true, articleIds: true, _count: { select: { chunks: true } } } },
      jobs: { where: { status: { in: ['pending', 'running'] } }, select: { step: true, status: true }, take: 1 },
    },
  });
  return rows.map((s) => ({
    id: s.id,
    kind: s.kind,
    cadence: s.cadence,
    url: s.url,
    title: s.title,
    trust: s.trust,
    locale: s.locale,
    pinned: s.pinned,
    topics: parseList(s.topics),
    enabled: s.enabled,
    status: s.status,
    lastError: s.lastError,
    lastCheckedAt: s.lastCheckedAt?.toISOString() ?? null,
    createdAt: s.createdAt.toISOString(),
    documents: s._count.documents,
    ready: s.documents.filter((d) => d.status === 'ready').length,
    chunks: s.documents.reduce((n, d) => n + d._count.chunks, 0),
    chars: s.documents.reduce((n, d) => n + d.charCount, 0),
    usedIn: s.documents.reduce((n, d) => n + parseList(d.articleIds).length, 0),
    job: s.jobs[0] ? `${s.jobs[0].status}:${s.jobs[0].step}` : null,
  }));
}

/** One source as the detail page shows it; the GET route returns the same shape so the page can reload in place. */
export async function sourceDetail(id: string) {
  const source = await prisma.source.findUnique({
    where: { id },
    include: {
      documents: { orderBy: { fetchedAt: 'desc' }, select: { id: true, url: true, title: true, publishedAt: true, fetchedAt: true, charCount: true, language: true, digest: true, relevance: true, status: true, reason: true, articleIds: true, _count: { select: { chunks: true } } } },
      jobs: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  });
  if (!source) return null;
  return {
    id: source.id,
    kind: source.kind,
    cadence: source.cadence,
    url: source.url,
    title: source.title,
    trust: source.trust,
    locale: source.locale,
    pinned: source.pinned,
    topics: parseList(source.topics),
    enabled: source.enabled,
    status: source.status,
    lastError: source.lastError,
    lastCheckedAt: source.lastCheckedAt?.toISOString() ?? null,
    notes: source.notes,
    createdAt: source.createdAt.toISOString(),
    documents: source.documents.map((d) => ({
      id: d.id,
      url: d.url,
      title: d.title,
      publishedAt: d.publishedAt?.toISOString() ?? null,
      fetchedAt: d.fetchedAt.toISOString(),
      charCount: d.charCount,
      language: d.language,
      digest: d.digest,
      relevance: d.relevance,
      status: d.status,
      reason: d.reason,
      articleIds: parseList(d.articleIds),
      chunks: d._count.chunks,
    })),
    jobs: source.jobs.map((j) => ({ id: j.id, step: j.step, status: j.status, attempts: j.attempts, error: j.error, updatedAt: j.updatedAt.toISOString() })),
  };
}

export type SourceDetailData = NonNullable<Awaited<ReturnType<typeof sourceDetail>>>;
