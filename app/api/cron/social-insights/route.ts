// ============================================================================
// GET /api/cron/social-insights[?n=2&dry=1]
//
// The two-or-three-a-day insight tweets Farjad asked for: an idea taken from
// an article rather than an announcement of one, on both accounts, each in
// its own language.
//
// It runs whether or not something published today — that is the difference
// from the Telegram quiet-day post. The channel wants one voice a day; the X
// accounts want a steady few.
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authorisedCron } from '@/lib/cron-auth';
import { pickForShortPost, explainNoPick } from '@/lib/social/pick-article';
import { shareToX } from '@/lib/social/x';
import { xMessage } from '@/lib/social/x-message';
import { DESTINATIONS } from '@/lib/social/destinations';
import { extractInsights } from '@/lib/social/insights';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/** Locales any X destination carries, so we only fetch articles that can go out. */
const X_LOCALES = [...new Set(DESTINATIONS.filter((d) => d.platform === 'x').flatMap((d) => d.locales))];

export async function GET(req: NextRequest) {
  if (!(await authorisedCron(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const q = req.nextUrl.searchParams;
  const dryRun = q.get('dry') === '1';
  const count = Math.min(3, Math.max(1, Number(q.get('n') ?? 2) || 2));
  const now = new Date();

  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED', locale: { in: X_LOCALES } },
    select: { id: true, slug: true, title: true, locale: true, keyTakeaway: true, excerpt: true, createdAt: true, content: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  const prior = await prisma.socialPost.findMany({
    where: { kind: 'insight' },
    select: { articleId: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 500,
  });

  // Pick per locale, not once for everything. Choosing globally and then
  // fanning out to whichever destinations match let two English picks starve
  // the Persian account entirely — which is exactly what the first dry run
  // did.
  const locales = [...new Set(DESTINATIONS.filter((d) => d.platform === 'x').flatMap((d) => d.locales))];
  const seen = [...prior];
  const sent: unknown[] = [];

  for (const locale of locales) {
    for (let i = 0; i < count; i++) {
      const picked = pickForShortPost(articles as never, seen, now, { locale, prefer: 'newest' });
      if (!picked) break;

      const source = articles.find((x) => x.id === picked.id)!;
      // The point comes from the article body, chosen from the phrases the
      // writer marked decisive. Without this the insight repeats the takeaway
      // the article post already carried, and the account reads as a bot.
      const points = extractInsights(source.content ?? '', locale);
      const a = {
        ...picked,
        locale,
        insight: points.length ? points[Math.floor(Math.random() * points.length)] : null,
      };

      if (dryRun) {
        const previews = DESTINATIONS.filter((d) => d.platform === 'x' && d.locales.includes(locale))
          .map((d) => ({ destination: d.id, text: xMessage(a, d, 'insight') }));
        sent.push({ locale, article: a.slug, points: points.length, previews });
      } else {
        sent.push({ locale, article: a.slug, results: await shareToX(a, 'insight') });
      }
      // Recorded before the next pick, so the loop cannot choose it twice.
      seen.push({ articleId: a.id, createdAt: now });
    }
  }

  if (!sent.length) {
    return NextResponse.json({ ok: true, action: 'none', reason: explainNoPick(articles as never, seen, now) });
  }

  return NextResponse.json({ ok: true, action: 'insight', requested: count, sent });
}
