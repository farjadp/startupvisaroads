// ============================================================================
// GET /api/cron/social-knowledge[?n=1&dry=1]
//
// The English account's daily posts that are not about an article: routes,
// countries, cities, business culture. Scheduled a few times a day rather than
// as one burst, because four tweets in one minute is a bot and four across a
// day is an account.
//
// Only the destinations that carry English and post without a human. Today
// that is @ashavidgroup; adding another is an entry in destinations.ts.
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authorisedCron } from '@/lib/cron-auth';
import { DESTINATIONS } from '@/lib/social/destinations';
import { postToX } from '@/lib/social/x';
import { writeKnowledge, knowledgeMessage, knowledgePhoto, nextTheme } from '@/lib/social/knowledge';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

/** How far back a topic still counts as "just said that". */
const AVOID_DAYS = 21;

export async function GET(req: NextRequest) {
  if (!(await authorisedCron(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const q = req.nextUrl.searchParams;
  const dryRun = q.get('dry') === '1';
  const count = Math.min(5, Math.max(1, Number(q.get('n') ?? 1) || 1));
  const now = new Date();

  const targets = DESTINATIONS.filter((d) => d.platform === 'x' && d.locales.includes('en') && d.autoPost);
  if (!targets.length) {
    return NextResponse.json({ ok: true, action: 'none', reason: 'no English X destination posts automatically' });
  }

  const recent = await prisma.socialPost.findMany({
    where: { kind: 'knowledge', status: 'posted', createdAt: { gte: new Date(now.getTime() - AVOID_DAYS * 86_400_000) } },
    select: { topic: true },
    orderBy: { createdAt: 'desc' },
    take: 40,
  });
  const avoid = recent.map((r) => r.topic ?? '').filter(Boolean);

  const sent: unknown[] = [];

  for (let i = 0; i < count; i++) {
    const post = await writeKnowledge(nextTheme(avoid, now), avoid);
    if (!post) {
      sent.push({ status: 'none', reason: 'no draft passed the guard' });
      continue;
    }
    // Added to the avoid list immediately, so a run of three does not produce
    // three posts about the same country.
    avoid.unshift(post.topic);

    const text = knowledgeMessage(post);
    const found = await knowledgePhoto(post);
    const photo = found.photo;

    if (dryRun) {
      sent.push({
        topic: post.topic,
        text,
        photo: photo
          ? { query: found.query, alt: photo.alt, by: photo.photographer, source: photo.sourceUrl }
          : { query: found.query, none: found.reason },
        destinations: targets.map((d) => d.id),
      });
      continue;
    }

    for (const d of targets) {
      const r = await postToX(d, text, photo);
      try {
        await prisma.socialPost.create({
          data: {
            destination: d.id,
            kind: 'knowledge',
            topic: post.topic,
            status: r.status,
            error: r.error ?? null,
            remoteUrl: r.remoteUrl ?? null,
            postedAt: r.status === 'posted' ? new Date() : null,
          },
        });
      } catch (e) {
        console.error(`social/knowledge: could not record the attempt — ${e instanceof Error ? e.message : String(e)}`);
      }
      sent.push({ topic: post.topic, result: r });
    }
  }

  return NextResponse.json({ ok: true, action: 'knowledge', requested: count, sent });
}
