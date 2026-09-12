// ============================================================================
// lib/knowledge/review.ts
// Articles whose ground has moved.
//
// A published article cites passages from a document. When a watch tick
// re-reads that document and the text has changed, every article written
// from it may now be stating something the authority no longer says. That is
// the one automatic signal we get, and on an immigration site it is the
// signal that matters most: the Start-up Visa pages were wrong for months
// because nothing watched the source they were built on.
//
// It deliberately does NOT try to judge whether the change is material. A
// hash is a hash; deciding whether a reworded sentence changes the advice is
// a person's job, and guessing it with a model would give us a queue nobody
// trusts. The row says what changed and how much; a human resolves it.
// ============================================================================
import prisma from '@/lib/prisma';

export const CHANGED_SOURCE = 'source changed';

function parseIds(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.map(String).filter(Boolean) : [];
  } catch {
    return [];
  }
}

/**
 * Flag every article written from this document. Idempotent on
 * (articleId, documentId): a source that changes weekly must not produce a
 * new row every week for the same unresolved question.
 */
export async function flagArticlesForReview(documentId: string, reason: string, detail?: string): Promise<number> {
  const doc = await prisma.sourceDocument.findUnique({ where: { id: documentId }, select: { articleIds: true, title: true } });
  if (!doc) return 0;
  const articleIds = parseIds(doc.articleIds);
  if (!articleIds.length) return 0;

  let flagged = 0;
  for (const articleId of articleIds) {
    // The article may have been deleted since; a review row pointing at
    // nothing is noise in the queue.
    const exists = await prisma.article.findUnique({ where: { id: articleId }, select: { id: true } }).catch(() => null);
    if (!exists) continue;
    try {
      const existing = await prisma.articleReview.findUnique({ where: { articleId_documentId: { articleId, documentId } }, select: { id: true, resolvedAt: true } });
      if (existing && !existing.resolvedAt) continue; // already waiting
      if (existing) {
        // Resolved once, and the source has moved again: reopen it rather
        // than leaving a stale "handled" on a fresh change.
        await prisma.articleReview.update({ where: { id: existing.id }, data: { resolvedAt: null, resolvedBy: null, reason, detail: detail ?? null, createdAt: new Date() } });
      } else {
        await prisma.articleReview.create({ data: { articleId, documentId, reason, detail: detail ?? null } });
      }
      flagged++;
    } catch (e) {
      console.error('knowledge/review: could not flag', articleId, e instanceof Error ? e.message : e);
    }
  }
  if (flagged) console.warn(`knowledge/review: ${flagged} article(s) need review — "${doc.title}" ${reason}`);
  return flagged;
}

export async function openReviews(limit = 50) {
  const rows = await prisma.articleReview.findMany({
    where: { resolvedAt: null },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  if (!rows.length) return [];

  // Two extra reads rather than a relation: ArticleReview deliberately has no
  // foreign keys, so a deleted article or document cannot block the write
  // that records a change.
  const articles = await prisma.article.findMany({
    where: { id: { in: [...new Set(rows.map((r) => r.articleId))] } },
    select: { id: true, title: true, slug: true, locale: true, status: true, updatedAt: true },
  });
  const documents = await prisma.sourceDocument.findMany({
    where: { id: { in: [...new Set(rows.map((r) => r.documentId).filter((id): id is string => !!id))] } },
    select: { id: true, title: true, url: true, fetchedAt: true, source: { select: { title: true, trust: true } } },
  });
  const byArticle = new Map(articles.map((a) => [a.id, a]));
  const byDocument = new Map(documents.map((d) => [d.id, d]));

  return rows.map((r) => {
    const a = byArticle.get(r.articleId);
    const d = r.documentId ? byDocument.get(r.documentId) : undefined;
    return {
      id: r.id,
      reason: r.reason,
      detail: r.detail,
      createdAt: r.createdAt.toISOString(),
      article: a
        ? { id: a.id, title: a.title, slug: a.slug, locale: a.locale, status: a.status, updatedAt: a.updatedAt.toISOString() }
        : { id: r.articleId, title: '(deleted article)', slug: '', locale: 'en', status: 'GONE', updatedAt: r.createdAt.toISOString() },
      document: d
        ? { id: d.id, title: d.title, url: d.url, fetchedAt: d.fetchedAt.toISOString(), sourceName: d.source.title, trust: d.source.trust }
        : null,
    };
  });
}

export type OpenReview = Awaited<ReturnType<typeof openReviews>>[number];

export async function resolveReview(id: string, by: string): Promise<void> {
  await prisma.articleReview.update({ where: { id }, data: { resolvedAt: new Date(), resolvedBy: by.slice(0, 120) } });
}

export async function openReviewCount(): Promise<number> {
  return prisma.articleReview.count({ where: { resolvedAt: null } });
}
