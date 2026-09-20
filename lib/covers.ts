// ============================================================================
// lib/covers.ts
// Cover backfill: give a published article that has no cover the same
// branded photograph the autopilot would have made for it at write time.
//
// It exists because of a real gap, not a hypothetical one. The Fal account
// locked for a top-up on 14 Sep 2026; generateBrandImage is deliberately
// silent about a failed image, so articles kept publishing and every one of
// them landed with coverImage = null. Re-running the writer would rewrite
// the prose; this only fills the hole.
//
// The scene is derived from the article itself rather than stored, because
// nothing keeps the writer's original imageScenes after the row is written.
// ============================================================================
import prisma from '@/lib/prisma';
import { generateAndSaveImage } from '@/lib/ai';
import { brandPrompt } from '@/lib/autopilot/art-direction';
import { imagesBlocked } from '@/lib/autopilot/images';
import { chatJson } from '@/lib/autopilot/pipeline';

export type BackfillOptions = {
  /** How many articles to do in one pass. Each one is a model call and an image. */
  limit?: number;
  locale?: 'en' | 'fa';
  /** One specific article, by slug. */
  slug?: string;
  /** Pick the articles and write the prompts, generate nothing, change nothing. */
  dryRun?: boolean;
};

export type BackfillResult = {
  blocked: string | null;
  considered: number;
  done: { slug: string; scene: string; coverImage: string | null }[];
  failed: { slug: string; reason: string }[];
};

/** One editorial scene for this article, under the rules the planner uses. */
async function coverScene(article: { title: string; excerpt: string | null; keyTakeaway: string | null }): Promise<string> {
  const prompt = `An article on a startup-visa and global-mobility advisory blog needs one cover photograph.

TITLE: ${article.title}
SUMMARY: ${article.keyTakeaway ?? article.excerpt ?? ''}

Write the scene for that photograph in ONE sentence: a concrete real-world object, material, threshold or space that carries the article's subject sideways. No people's faces, no posed professionals, no meeting rooms, no handshakes. Nothing with writing on it — no paper, documents, passports, signage or screens. No flags, no landmarks, no skylines, no maps.

Return JSON: {"scene":"..."}`;
  const out = await chatJson<{ scene?: string }>(prompt, 0.8);
  const scene = (out.scene ?? '').trim();
  if (!scene) throw new Error('no scene returned');
  return scene;
}

/**
 * Fill in missing covers, newest first. Sequential on purpose: five images
 * at once is a spike on someone's rate limit for no gain, and a failure
 * part-way through leaves the rows it already wrote intact.
 */
export async function backfillCovers(opts: BackfillOptions = {}): Promise<BackfillResult> {
  const limit = Math.max(1, Math.min(opts.limit ?? 10, 50));
  const result: BackfillResult = { blocked: null, considered: 0, done: [], failed: [] };

  // The same gate the autopilot uses — no point paying for an image that
  // production would only inline as base64.
  const blocked = opts.dryRun ? null : imagesBlocked();
  if (blocked) {
    result.blocked = blocked;
    return result;
  }

  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [{ coverImage: null }, { coverImage: '' }],
      ...(opts.locale ? { locale: opts.locale } : {}),
      ...(opts.slug ? { slug: opts.slug } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: { id: true, slug: true, title: true, excerpt: true, keyTakeaway: true },
  });
  result.considered = articles.length;

  for (const article of articles) {
    try {
      const scene = await coverScene(article);
      if (opts.dryRun) {
        result.done.push({ slug: article.slug, scene, coverImage: null });
        continue;
      }
      // 16:9 — the frame the article header and the blog cards crop to.
      const coverImage = await generateAndSaveImage(brandPrompt(scene), { raw: true, size: 'landscape_16_9' });
      await prisma.article.update({ where: { id: article.id }, data: { coverImage } });
      result.done.push({ slug: article.slug, scene, coverImage });
      console.log(`covers: ${article.slug} ← ${coverImage}`);
    } catch (e) {
      const reason = e instanceof Error ? e.message : String(e);
      console.error(`covers: ${article.slug} failed — ${reason}`);
      result.failed.push({ slug: article.slug, reason });
    }
  }

  return result;
}
