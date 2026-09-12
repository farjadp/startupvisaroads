// ============================================================================
// lib/knowledge/backfill.ts
// Carry the old SourceArticle ledger into SourceDocument, once.
//
// The point is not the text — most of those items are months-old news nobody
// will write from now. The point is the URLs. Without them the watch pass
// rediscovers every item the old harvester already used and the lane happily
// writes the same article a second time, which is exactly the bug that made
// the Persian lane publish one piece four times.
//
// So: one Source row per distinct old slug, one SourceDocument per old row
// carrying its status across, and NO ingest jobs. Nothing is re-read.
// Idempotent on the unique url, so it can run on every watch tick until the
// old table is dropped.
//
// When to delete this file: once production has run it and `SourceArticle` is
// dropped by a migration. Until then it is the reason a redeploy cannot
// resurrect old topics.
// ============================================================================
import prisma from '@/lib/prisma';

/** Old slug → what we now call it. Anything else gets a generic row. */
const KNOWN: Record<string, { title: string; url: string; trust: string }> = {
  ircc: {
    title: 'Immigration, Refugees and Citizenship Canada — newsroom',
    url: 'https://api.io.canada.ca/io-server/gc/news/en/v2?dept=departmentofcitizenshipandimmigration&sort=publishedDate&orderBy=desc&pick=30&format=atom&atomtitle=IRCC',
    trust: 'official',
  },
  cicnews: { title: 'CIC News', url: 'https://www.cicnews.com/feed', trust: 'press' },
  moving2canada: { title: 'Moving2Canada', url: 'https://moving2canada.com/feed/', trust: 'commentary' },
};

/** Old ledger status → new document status. */
function statusFor(old: string): { status: string; reason: string | null } {
  if (old === 'used') return { status: 'used', reason: null };
  if (old === 'skipped' || old === 'failed') return { status: 'ignored', reason: null };
  // `new` means the old harvester never got to it. Months later it is not
  // news, so it is ledgered as seen and not offered to anyone.
  return { status: 'ignored', reason: 'carried over unread from the old ledger' };
}

export type BackfillSummary = { sources: number; documents: number; skipped: number };

export async function backfillSourceArticles(): Promise<BackfillSummary> {
  const out: BackfillSummary = { sources: 0, documents: 0, skipped: 0 };

  const slugs = await prisma.sourceArticle.groupBy({ by: ['sourceSlug'] }).catch(() => null);
  if (!slugs || !slugs.length) return out;

  const sourceIdBySlug = new Map<string, string>();
  for (const { sourceSlug } of slugs) {
    const known = KNOWN[sourceSlug];
    const url = known?.url ?? `https://backfill.invalid/${sourceSlug}`;
    const existing = await prisma.source.findUnique({ where: { url }, select: { id: true } });
    if (existing) {
      sourceIdBySlug.set(sourceSlug, existing.id);
      continue;
    }
    const created = await prisma.source.create({
      data: {
        kind: 'html',
        cadence: known ? 'watch' : 'once',
        url,
        title: known?.title ?? sourceSlug,
        trust: known?.trust ?? 'press',
        topics: JSON.stringify(['canada']),
        watchMode: known ? 'feed' : null,
        watchEvery: known ? 12 : null,
        locale: 'en',
        // Not enabled when we do not know what it is: a row whose URL is a
        // placeholder must never be fetched.
        enabled: !!known,
        status: known ? 'pending' : 'ready',
        notes: 'backfilled from the pre-phase-3 SourceArticle ledger',
      },
    });
    sourceIdBySlug.set(sourceSlug, created.id);
    out.sources++;
  }

  // In pages, because the old ledger holds hundreds of rows and a single
  // findMany of all of them with their text is a large read for a cron tick.
  const PAGE = 200;
  for (let skip = 0; ; skip += PAGE) {
    const rows = await prisma.sourceArticle.findMany({ orderBy: { harvestedAt: 'asc' }, skip, take: PAGE });
    if (!rows.length) break;
    for (const row of rows) {
      const sourceId = sourceIdBySlug.get(row.sourceSlug);
      if (!sourceId) continue;
      const { status, reason } = statusFor(row.status);
      try {
        await prisma.sourceDocument.create({
          data: {
            sourceId,
            url: row.url,
            title: row.title.slice(0, 400),
            publishedAt: row.publishedAt,
            fetchedAt: row.harvestedAt,
            contentHash: '',
            text: row.text ?? '',
            charCount: row.text?.length ?? 0,
            status,
            reason: row.reason ?? reason,
            articleIds: row.articleId ? JSON.stringify([row.articleId]) : '[]',
          },
        });
        out.documents++;
      } catch {
        out.skipped++; // unique(url): already carried over, or discovered by watch
      }
    }
  }
  return out;
}
