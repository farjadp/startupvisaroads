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
import * as cheerio from 'cheerio';
import prisma from '@/lib/prisma';
import { generateAndSaveImage, wrapPhoto } from '@/lib/ai';
import { brandPrompt } from '@/lib/autopilot/art-direction';
import { generateBrandImage, imagesBlocked } from '@/lib/autopilot/images';
import { chatJson } from '@/lib/autopilot/pipeline';

export type BackfillOptions = {
  /** How many articles to do in one pass. Each one is a model call and an image. */
  limit?: number;
  locale?: 'en' | 'fa';
  /** One specific article, by slug. */
  slug?: string;
  /** Pick the articles and write the prompts, generate nothing, change nothing. */
  dryRun?: boolean;
  /**
   * Replace a cover that already exists. Requires `slug`, deliberately: a
   * model occasionally returns something off-brand (flux made toy robots of
   * "robotic components" once), and that is a one-article fix, never a
   * reason to re-buy every cover on the blog.
   */
  force?: boolean;
  /**
   * Redo covers that already exist, across `limit` articles. Separate from
   * `force` because it spends real money per article: it is for the day the
   * art direction itself changes, not for a single bad render.
   */
  forceAll?: boolean;
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

Write the scene for that photograph in ONE sentence: ONE concrete real-world object, material, threshold or space that carries the article's subject sideways.

Name ONE subject and at most one secondary object, and say where it sits. Do not write a list of props — a frame with a box AND a laptop AND keys AND a plant looks styled and cheap, and it is the single most common way these covers fail. Most of the frame should be empty surface, wall, floor or air. Do not describe a mood, a metaphor or what the scene "suggests"; describe only what is physically in front of the camera.

The scene is rendered with a fixed art direction, and a scene that fights it wins — so it must not ask for anything on this list:
- NO writing surface of any kind: no notepads, paper, documents, labels, signage, books, passports, forms, whiteboards, business cards, maps. A laptop or phone may appear only closed or dark, never showing anything.
- NO warm light: no sunlight streaming, no golden hour, no lamplight, no afternoon glow. The light is flat, cool, overcast daylight from one side.
- NO flags, no maple leaf, no landmarks, no skylines, no national symbols, and no city named in the frame.
- NO faces, no posed professionals, no meeting rooms, no handshakes. A hand or a partial figure at the edge of frame is the most a person may be.

Colour is cool, desaturated and NEUTRAL — bone, pale grey, near-black, with no green, teal or blue cast over the frame. At most one small object may carry a sharp yellow-green accent, and it is never the subject.

It must read as a photograph taken on assignment, never as something rendered: no toys, no miniatures, no glossy synthetic surfaces, no impossibly tidy arrangement.

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
  // force only ever touches the one article named on the command line;
  // forceAll is the deliberate, explicit exception to that.
  const force = Boolean(opts.forceAll) || Boolean(opts.force && opts.slug);
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
      ...(force ? {} : { OR: [{ coverImage: null }, { coverImage: '' }] }),
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

// ---------------------------------------------------------------------------
// In-article photographs
// ---------------------------------------------------------------------------
// The writer places photos while it writes, through placeVisuals — and when
// Fal was locked it replaced every [VISUAL_n] with nothing, so the bodies
// kept their SVG diagrams and lost all their photography. Those articles
// cannot be re-written without rewriting the prose, so the photos are put
// back here instead, against the headings that are already in the body.
//
// Covers go to gpt-image-2 and these go to Fal, which is the split asked
// for: one frame per article carries the article everywhere it is linked,
// while these are read in passing and there are two of them per piece.

type InlinePlan = { heading: string; scene: string; caption: string };

/** Two scenes for this body, each tied to a heading it will sit under. */
async function inlinePlans(title: string, headings: string[]): Promise<InlinePlan[]> {
  const prompt = `An article on a startup-visa and global-mobility advisory blog needs TWO editorial photographs placed inside the body.

TITLE: ${title}
HEADINGS IT WILL SIT UNDER:
${headings.map((h, i) => `${i + 1}. ${h}`).join('\n')}

For each of the two headings, write the scene for one photograph and a short caption.

The scene is ONE concrete real-world object, material, threshold or space, plus at most one secondary object, and you say where it sits. Never a list of arranged props. Most of the frame is empty surface, wall, floor or air. Describe only what is physically in front of the camera — no mood, no metaphor, no "suggesting".

Nothing on this list may appear:
- NO writing surface: no paper, documents, notepads, labels, stickers, signage, books, passports, forms, whiteboards, business cards, maps. A laptop or phone only closed or dark.
- NO warm light: the light is flat, cool, overcast daylight from one side.
- NO flags, no maple leaf, no landmarks, no skylines.
- NO faces, no posed professionals, no meeting rooms, no handshakes.
- NO toys, miniatures, glossy synthetic surfaces or anything that reads as rendered rather than photographed.

Colour is cool, desaturated and neutral — bone, pale grey, near-black, with no green or teal cast. One small object may carry a sharp yellow-green accent.

The caption is one plain sentence, under 15 words, that says something true about the subject of that section. It never says "pictured" or "shown above".

Return JSON: {"photos":[{"heading":"<the heading, copied exactly>","scene":"...","caption":"..."},{...}]}`;
  const out = await chatJson<{ photos?: InlinePlan[] }>(prompt, 0.8);
  return (out.photos ?? []).filter((p) => p?.scene && p?.heading).slice(0, 2);
}

/** The headings a photo can sit under: evenly spaced, never the first one. */
function chooseHeadings(all: string[]): string[] {
  const usable = all.slice(1); // the first section is the article's opening
  if (usable.length === 0) return [];
  if (usable.length === 1) return usable;
  return [usable[Math.floor(usable.length / 3)], usable[Math.floor((usable.length * 2) / 3)]].filter(
    (h, i, a) => h && a.indexOf(h) === i,
  );
}

/**
 * Put photographs back into bodies that have none. Each photo goes after the
 * paragraph that follows its heading, which is where the writer would have
 * put it, and a body is written back only once both of its photos are in.
 */
export async function backfillInlinePhotos(opts: BackfillOptions = {}): Promise<BackfillResult> {
  const limit = Math.max(1, Math.min(opts.limit ?? 5, 50));
  const result: BackfillResult = { blocked: null, considered: 0, done: [], failed: [] };

  const blocked = opts.dryRun ? null : imagesBlocked();
  if (blocked) {
    result.blocked = blocked;
    return result;
  }

  // Candidates are filtered in JS: "has no <img>" is not a query a database
  // index helps with, and the set of published articles is small.
  const candidates = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      ...(opts.locale ? { locale: opts.locale } : {}),
      ...(opts.slug ? { slug: opts.slug } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit * 4,
    select: { id: true, slug: true, title: true, content: true },
  });
  const redo = Boolean(opts.forceAll) || Boolean(opts.force && opts.slug);
  const articles = candidates.filter((a) => redo || !a.content.includes('<img')).slice(0, limit);
  result.considered = articles.length;

  for (const article of articles) {
    try {
      const $ = cheerio.load(article.content, null, false);
      const headings = $('h2')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(Boolean);
      const targets = chooseHeadings(headings);
      if (targets.length === 0) throw new Error('no h2 headings to place a photo under');

      const plans = await inlinePlans(article.title, targets);
      if (plans.length === 0) throw new Error('no photo plans returned');

      if (opts.dryRun) {
        result.done.push({ slug: article.slug, scene: plans.map((p) => `[${p.heading}] ${p.scene}`).join(' || '), coverImage: null });
        continue;
      }

      let placed = 0;
      for (const [i, plan] of plans.entries()) {
        const heading = $('h2').filter((_, el) => $(el).text().trim() === plan.heading.trim()).first();
        if (heading.length === 0) continue;
        const url = await generateBrandImage(plan.scene, 'inline');
        if (!url) continue;
        // After the first paragraph of the section, so the reader has the
        // section's opening sentence before the picture interrupts.
        const anchor = heading.nextAll('p').first();
        const figure = wrapPhoto(url, plan.caption ?? '', i);
        if (anchor.length > 0) anchor.after(figure);
        else heading.after(figure);
        placed++;
      }
      if (placed === 0) throw new Error('every photo for this article failed');

      await prisma.article.update({ where: { id: article.id }, data: { content: $.html() } });
      result.done.push({ slug: article.slug, scene: `${placed} photo(s) placed`, coverImage: null });
      console.log(`covers: ${article.slug} ← ${placed} in-article photo(s)`);
    } catch (e) {
      const reason = e instanceof Error ? e.message : String(e);
      console.error(`covers: ${article.slug} inline photos failed — ${reason}`);
      result.failed.push({ slug: article.slug, reason });
    }
  }

  return result;
}
