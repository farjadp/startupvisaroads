// ============================================================================
// GET /api/cron/social-short[?dry=1]
//
// The quiet-day post. Runs once a day; if something published today it does
// nothing, and otherwise it sends one idea from the article that has gone
// longest without attention.
//
// The selection is pure and tested in lib/social/pick-article.ts; this route
// only supplies the rows and the clock.
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authorisedCron } from '@/lib/cron-auth';
import { shouldPostShort, pickForShortPost, REUSE_DAYS } from '@/lib/social/pick-article';
import { sendToChannel } from '@/lib/social/telegram';
import { DESTINATIONS } from '@/lib/social/destinations';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (!(await authorisedCron(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const dryRun = req.nextUrl.searchParams.get('dry') === '1';
  const now = new Date();

  const channel = DESTINATIONS.find((d) => d.platform === 'telegram');
  const locales = channel?.locales ?? ['fa'];

  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED', locale: { in: locales } },
    select: { id: true, slug: true, title: true, locale: true, keyTakeaway: true, excerpt: true, createdAt: true, coverImage: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  if (!shouldPostShort(articles as never, now)) {
    return NextResponse.json({ ok: true, action: 'none', reason: 'an article published today' });
  }

  const priorPosts = await prisma.socialPost.findMany({
    where: { kind: 'short', destination: channel?.id },
    select: { articleId: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 500,
  });

  const picked = pickForShortPost(articles as never, priorPosts, now);
  if (!picked) {
    return NextResponse.json({ ok: true, action: 'none', reason: `every article was used within ${REUSE_DAYS} days` });
  }

  const full = articles.find((a) => a.id === picked.id)!;
  if (dryRun) return NextResponse.json({ ok: true, dryRun: true, wouldPost: { id: full.id, title: full.title } });

  const result = await sendToChannel({ ...full, locale: full.locale as 'en' | 'fa' }, 'short');
  return NextResponse.json({ ok: true, action: 'short', article: full.slug, ...result });
}
