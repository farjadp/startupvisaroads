// ============================================================================
// GET /api/cron/social-short[?dry=1&force=1&n=2]
//
// The quiet-day post. Runs once a day; if something published today it does
// nothing, and otherwise it sends one idea from the article that has gone
// longest without attention.
//
// `force=1` skips the quiet-day check, for posting to the channel by hand on
// a day that already had an article. `n` sends up to three, each from a
// different article — the reuse window and the unique constraint still apply,
// so it cannot repeat itself however many times it is called.
//
// The selection is pure and tested in lib/social/pick-article.ts; this route
// only supplies the rows and the clock.
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authorisedCron } from '@/lib/cron-auth';
import { shouldPostShort, pickForShortPost, explainNoPick } from '@/lib/social/pick-article';
import { sendToChannel } from '@/lib/social/telegram';
import { DESTINATIONS } from '@/lib/social/destinations';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (!(await authorisedCron(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const q = req.nextUrl.searchParams;
  const dryRun = q.get('dry') === '1';
  const force = q.get('force') === '1';
  const count = Math.min(3, Math.max(1, Number(q.get('n') ?? 1) || 1));
  const now = new Date();

  const channel = DESTINATIONS.find((d) => d.platform === 'telegram');
  const locales = channel?.locales ?? ['fa'];

  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED', locale: { in: locales } },
    select: { id: true, slug: true, title: true, locale: true, keyTakeaway: true, excerpt: true, createdAt: true, coverImage: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  if (!force && !shouldPostShort(articles as never, now)) {
    return NextResponse.json({ ok: true, action: 'none', reason: 'an article published today' });
  }

  const priorPosts = await prisma.socialPost.findMany({
    // Only what actually went out, and only rows that have an article: a
    // failed attempt is not use, and counting it as use put the article out of
    // reach for 45 days over a bad token.
    where: { kind: 'short', destination: channel?.id, status: 'posted', articleId: { not: null } },
    select: { articleId: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 500,
  });

  // Each send is recorded, so the next pick in this loop already sees the
  // previous one as used and cannot choose the same article twice.
  const seen = priorPosts.map((p) => ({ articleId: p.articleId!, createdAt: p.createdAt }));
  const sent: unknown[] = [];

  for (let i = 0; i < count; i++) {
    const picked = pickForShortPost(articles as never, seen, now);
    if (!picked) {
      if (!sent.length) {
        return NextResponse.json({ ok: true, action: 'none', reason: explainNoPick(articles as never, seen, now) });
      }
      break;
    }

    const full = articles.find((a) => a.id === picked.id)!;
    if (dryRun) {
      sent.push({ dryRun: true, article: full.slug, title: full.title });
    } else {
      const result = await sendToChannel({ ...full, locale: full.locale as 'en' | 'fa' }, 'short');
      sent.push({ article: full.slug, ...result });
    }
    seen.push({ articleId: full.id, createdAt: now });
  }

  return NextResponse.json({ ok: true, action: 'short', requested: count, sent });
}
