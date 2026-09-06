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

  const seen = [...prior];
  const sent: unknown[] = [];

  for (let i = 0; i < count; i++) {
    const picked = pickForShortPost(articles as never, seen, now);
    if (!picked) {
      if (!sent.length) {
        return NextResponse.json({ ok: true, action: 'none', reason: explainNoPick(articles as never, seen, now) });
      }
      break;
    }

    // The point comes from the article body, chosen from the phrases the
    // writer marked decisive. Without this the insight repeats the takeaway
    // the article post already carried, and the account reads as a bot.
    const source = articles.find((x) => x.id === picked.id)!;
    const points = extractInsights(source.content ?? '', source.locale === 'fa' ? 'fa' : 'en');
    const a = {
      ...picked,
      locale: picked.locale as 'en' | 'fa',
      insight: points[Math.floor(Math.random() * points.length)] ?? null,
    };
    if (dryRun) {
      // Show what each destination would actually send, not just which
      // article was chosen — the message differs per account.
      const previews = DESTINATIONS.filter((d) => d.platform === 'x' && d.locales.includes(a.locale))
        .map((d) => ({ destination: d.id, text: xMessage(a, d, 'insight') }));
      sent.push({ article: a.slug, previews });
    } else {
      sent.push({ article: a.slug, results: await shareToX(a, 'insight') });
    }
    // Recorded before the next pick, so the loop cannot choose it twice.
    seen.push({ articleId: a.id, createdAt: now });
  }

  return NextResponse.json({ ok: true, action: 'insight', requested: count, sent });
}
