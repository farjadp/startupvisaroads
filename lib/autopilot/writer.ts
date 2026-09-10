// ============================================================================
// lib/autopilot/writer.ts
// Brief → draft → expand → humanise → link enforcement → visuals → row.
//
// The draft is asked for the answer-engine fields (keyTakeaway, summaryEn,
// structured FAQ) alongside the body, so the article is quotable by design
// and not by luck. Visuals reuse the photo/diagram machinery in lib/ai.ts.
// ============================================================================
import prisma from '@/lib/prisma';
import { wrapDiagram, wrapPhoto } from '@/lib/ai';
import { generateBrandImage, imagesBlocked } from './images';
import { createArticleFromPayload } from '@/lib/articles';
import type { Locale } from '@/lib/seo';
import { BRAND_FACTS, buildInventory, linkBlock, type Inventory } from './inventory';
import { AIO_RULES, FACT_RULES, WRITER_MODEL, chatJson, chatText, expand, houseStyle, humanise, type GenerateResult } from './pipeline';
import { planBriefs, type Brief } from './planner';
import { officialSourcePromptForBrief } from './official-sources';
import { decidePlannedPublication, enforceLinks, sameSubject, wordCountHtml } from './text';

type Visual =
  | { type: 'PHOTO'; prompt: string; caption: string }
  | { type: 'DIAGRAM'; svgCode: string; caption: string };

type Draft = {
  title: string;
  slugEn: string;
  excerpt: string;
  keyTakeaway: string;
  summaryEn: string;
  contentHtml: string;
  faq: { q: string; a: string }[];
  tags: string[];
  quickFacts: Record<string, string>;
  coverImagePrompt: string;
  inTextVisuals: Visual[];
};

const DIAGRAM_SPEC = `DIAGRAM — for a process, steps, timeline, comparison or decision tree. Write the complete, valid SVG yourself:
• Opening tag: <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:800px">
• Brand colours: navy #1c3b6e (primary fills, arrows, headings), gold #f2b95e (accent boxes), white #ffffff (cards), light-gray #f4f5f8 (section fills), dark-text #374151.
• Define <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#1c3b6e"/></marker> in <defs>; connect with <line>/<path> and marker-end="url(#arrow)".
• Labels in <text> with font-size 13–14, inside or adjacent to their shapes; <rect rx="8"> for cards, <circle> for steps, <polygon> for decisions.
• Generous padding, no external fonts, no images, no foreignObject.`;

export function wordTarget(depth: Brief['depth']): { min: number; target: number } {
  return depth === 'deep' ? { min: 1900, target: 2300 } : { min: 1000, target: 1250 };
}

/**
 * Two calls, not one. Asking gpt-4o for a 2,000-word HTML body inside a JSON
 * string comes back at ~250 words: the JSON mode truncates long string
 * values. So the body is written as plain HTML first, and the metadata
 * (title, takeaway, FAQ, visuals) is derived from the finished body in a
 * second, JSON call — which also keeps the takeaway consistent with the text.
 */
async function draftBody(brief: Brief, inv: Inventory): Promise<string> {
  const lang = inv.locale === 'fa' ? 'Persian (Farsi)' : 'English';
  const { min, target } = wordTarget(brief.depth);
  const html = await chatText(
    `Write the body of an article for visaroads.com, in ${lang}, for this brief.

BRIEF: ${JSON.stringify(brief, null, 2)}

BRAND FACTS (the only things you may say about us): ${BRAND_FACTS}

Linkable paths (use ONLY these for internal links, as <a href="/path">natural anchor</a> with locale-agnostic paths; every path in brief.mustLink must appear at least once; link 3–6 times in total, spread through the body, never two links in one sentence, never the path as the visible text):
${linkBlock(inv)}

${officialSourcePromptForBrief(brief)}

${FACT_RULES}

${AIO_RULES}

${houseStyle(inv.locale)}

Length: ${min}–${target + 200} words of prose — write the full article, every section complete, no placeholders, no "…". Structure: 5–8 <h2> sections. Title: do NOT include one (no <h1>); it is written separately. Place exactly two visual placeholders on their own lines at natural breakpoints: [VISUAL_1] after the first major section, [VISUAL_2] mid-article. Do not include a FAQ section — it is produced separately.

Return ONLY the HTML body. No <html>/<body>, no code fence, no commentary.`,
    0.7,
  );
  return html.replace(/^```(?:html)?\s*/i, '').replace(/\s*```$/, '').trim();
}

type Meta = Omit<Draft, 'contentHtml'>;

export async function draftMeta(brief: Brief, body: string, inv: Inventory): Promise<Meta> {
  const lang = inv.locale === 'fa' ? 'Persian (Farsi)' : 'English';
  const d = await chatJson<Partial<Meta>>(
    `Below is a finished ${lang} article for visaroads.com. Produce its metadata and its two visuals. Everything must be consistent with the article; add no fact that is not in it.

BRIEF: ${JSON.stringify({ workingTitle: brief.workingTitle, angle: brief.angle, primaryKeyword: brief.primaryKeyword, imageScenes: brief.imageScenes })}

Visuals: the article contains [VISUAL_1] and [VISUAL_2]. For each decide PHOTO or DIAGRAM from what surrounds it. Prefer DIAGRAM wherever the surrounding section contains a process, a comparison, a timeline or a decision — a diagram earns its place, a photograph only decorates.
PHOTO — write ONE sentence naming a concrete scene: the objects, the place, the time of day. Nothing else. Do NOT describe lighting, lens, mood, colour grading, film stock or composition, and do not write the words "editorial", "cinematic" or "photorealistic": the house art direction supplies all of that and your adjectives fight with it. No people's faces, no crowds, no meeting rooms, no handshakes, no flags, no landmarks, no visible writing on paper or screens. The scene must contain NOTHING WITH WRITING ON IT — no paper, documents, forms, books, notebooks, sticky notes, passports, maps, signage or screens showing content; those render as garbled pseudo-text. Good: "A bicycle leaning against a concrete wall beside a glass stairwell in Vancouver." Bad: "A dramatic cinematic shot of diverse professionals reviewing documents."
${DIAGRAM_SPEC}

Return JSON with ALL keys (article-language fields in ${lang}; summaryEn and slugEn always in English):
{
  "title": "statement or how-to, ≤ 70 chars, no colon-subtitle, no rhetorical question",
  "slugEn": "kebab-case ASCII slug from the English meaning of the title, ≤ 60 chars",
  "excerpt": "one or two sentences, no clickbait",
  "keyTakeaway": "40–60 words that answer the article's central question OUTRIGHT and standalone — no 'in this article', no pronoun referring to the title. This is the passage an answer engine quotes.",
  "summaryEn": "2–3 English sentences an answer engine can quote; name the programme and the authority; no site paths",
  "faq": [{"q":"question a person would type","a":"2–3 sentence direct answer, from the article"}] (4–6 items),
  "tags": ["3–6 tags"],
  "quickFacts": {"suitableFor":"e.g. Tech founders","requirements":"include only when grounded in the cited article body"},
  "coverImagePrompt": "editorial photo prompt for the cover, built from brief.imageScenes[0]",
  "inTextVisuals": [{"type":"PHOTO","prompt":"…","caption":"…"},{"type":"DIAGRAM","svgCode":"<svg …>…</svg>","caption":"…"}]
}

ARTICLE:
${body}`,
    0.5,
  );

  const faq = Array.isArray(d.faq) ? d.faq.filter((f) => f && typeof f.q === 'string' && typeof f.a === 'string') : [];
  if (!d.title || !d.keyTakeaway) throw new Error('meta missing title/keyTakeaway');
  return {
    title: String(d.title).trim(),
    slugEn: String(d.slugEn ?? '').trim(),
    excerpt: String(d.excerpt ?? '').trim(),
    keyTakeaway: String(d.keyTakeaway).trim(),
    summaryEn: String(d.summaryEn ?? '').trim(),
    faq,
    tags: Array.isArray(d.tags) ? d.tags.map(String).slice(0, 8) : [],
    quickFacts: d.quickFacts && typeof d.quickFacts === 'object' ? (d.quickFacts as Record<string, string>) : {},
    coverImagePrompt: String(d.coverImagePrompt ?? brief.imageScenes[0]),
    inTextVisuals: Array.isArray(d.inTextVisuals) ? (d.inTextVisuals as Visual[]).slice(0, 2) : [],
  };
}

/** Fill [VISUAL_n] with photos/diagrams; a failed image never aborts the article. */
export async function placeVisuals(html: string, visuals: Visual[], dryRun: boolean): Promise<string> {
  let out = html;
  await Promise.all(
    visuals.map(async (v, i) => {
      let replacement = '';
      if (v.type === 'DIAGRAM' && v.svgCode?.trim().startsWith('<svg')) {
        replacement = wrapDiagram(v.svgCode, v.caption ?? '');
      } else if (v.type === 'PHOTO' && v.prompt && !dryRun) {
        const url = await generateBrandImage(v.prompt, 'inline');
        if (url) replacement = wrapPhoto(url, v.caption ?? '', i);
      }
      out = out.replace(`[VISUAL_${i + 1}]`, replacement);
    }),
  );
  return out.replace(/\[VISUAL_\d+\]/g, '');
}

type RunOpts = { publish?: boolean; dryRun?: boolean };

/** How many extra briefs to plan, so a refused one does not empty the day. */
const SPARES = 2;

async function writeOne(brief: Brief, inv: Inventory, opts: RunOpts, result: GenerateResult): Promise<void> {
  try {
    const { min, target } = wordTarget(brief.depth);

    let body = await draftBody(brief, inv);
    const stages = [`draft ${wordCountHtml(body)}`];
    // Up to two expansions: a draft that lands at half the brief is usual for
    // a deep guide, and one pass rarely closes the whole gap.
    for (let i = 0; i < 2 && wordCountHtml(body) < min; i++) {
      body = await expand(body, inv.locale, target);
      stages.push(`expand ${wordCountHtml(body)}`);
    }
    body = await humanise(body, inv.locale);
    stages.push(`humanise ${wordCountHtml(body)}`);
    console.log(`autopilot/writer: "${brief.workingTitle}" words: ${stages.join(' → ')} (min ${min})`);
    const d = await draftMeta(brief, body, inv);
    body = await placeVisuals(body, d.inTextVisuals, !!opts.dryRun);
    const linked = enforceLinks(body, inv);
    body = linked.html;
    const publication = decidePlannedPublication(!!opts.publish, linked.officialCitationCount);
    if (publication.warning) {
      result.warnings.push({ title: d.title, warning: publication.warning });
      // Cloud Scheduler throws the response body away, so a warning that only
      // travels in the JSON is a warning nobody ever reads. This is the line
      // that turns "the blog quietly stopped updating" into something
      // greppable in the Cloud Run logs.
      console.warn(`autopilot/writer: DRAFT (no official citation survived) — "${d.title}"`);
    }

    if (Object.keys(d.quickFacts).length) {
      body = `<script type="application/json" id="quick-facts-data">${JSON.stringify(d.quickFacts)}</script>\n${body}`;
    }

    // The last net. The planner should never hand out a topic already
    // written, but it did for three days, and nothing downstream noticed that
    // it was publishing the same article again under a slightly different
    // title and a `-1` slug. A repeat is worth losing an article over.
    // Including what this run has already written: the inventory is read once
    // at the start, so a three-article run could otherwise repeat itself.
    const repeat = [...inv.recentTitles, ...result.created.map((c) => c.title)].find((t) => sameSubject(t, d.title));
    if (repeat) {
      result.skipped.push({ title: d.title, reason: `already published as "${repeat}"` });
      console.warn(`autopilot/writer: SKIPPED as a repeat of "${repeat}" — "${d.title}"`);
      return;
    }

    const coverImage = opts.dryRun ? null : await generateBrandImage(d.coverImagePrompt, 'cover');

    if (opts.dryRun) {
      result.created.push({ id: 'dry-run', slug: d.slugEn || 'dry-run', title: d.title });
      console.log(`autopilot/writer (dry): "${d.title}" — ${wordCountHtml(body)} words, links ${linked.links.join(', ') || 'none'}`);
      return;
    }

    const article = await createArticleFromPayload(
      {
        title: d.title,
        excerpt: d.excerpt,
        category: brief.category,
        tags: d.tags,
        content: body,
        coverImage,
        slugSource: d.slugEn,
        keyTakeaway: d.keyTakeaway,
        summaryEn: d.summaryEn,
        faq: d.faq,
        aiModel: WRITER_MODEL,
        // The id first, in a shape a later run can parse. The prose after it
        // is for a human reading the row; the tag is what stops the lane
        // rewriting the same backlog topic every morning.
        topicSeed: `${brief.topicSlug ? `[topic:${brief.topicSlug}] ` : ''}${brief.whyNow} — ${brief.angle}`,
        internalLinks: linked.links,
      },
      { locale: inv.locale, status: publication.status },
    );
    result.created.push({ id: article.id, slug: article.slug, title: article.title });
  } catch (e) {
    result.errors.push({ title: brief.workingTitle, error: e instanceof Error ? e.message : String(e) });
  }
}

/**
 * Generate `n` planned posts in `locale`. Briefs are independent and run
 * concurrently so a day's batch fits inside one invocation; one failure does
 * not stop the run. Every run leaves an AutopilotRun row.
 */
export async function runPlanned(n: number, locale: Locale, opts: RunOpts = {}): Promise<GenerateResult> {
  const result: GenerateResult = { created: [], errors: [], skipped: [], warnings: [] };
  const run = await prisma.autopilotRun.create({ data: { requested: n, locale, mode: 'planned', notes: opts.dryRun ? 'dry-run' : null } });

  let inv: Inventory;
  let briefs: Brief[];
  try {
    inv = await buildInventory(locale);
    // Spares, because a brief can be refused after it is written: the title
    // the writer lands on may turn out to be a subject the site already
    // covers, and a day that plans exactly one article then publishes nothing
    // is how the Persian lane went quiet while looking healthy.
    briefs = await planBriefs(n + SPARES, inv);
  } catch (e) {
    result.errors.push({ error: `plan: ${e instanceof Error ? e.message : String(e)}` });
    await finish(run.id, result, opts);
    return result;
  }

  // The day's quota concurrently, as before — a batch has to fit in one
  // invocation. The spares come after, one at a time and only while the quota
  // is short, so they cost nothing on a normal day.
  await Promise.all(briefs.slice(0, n).map((b) => writeOne(b, inv, opts, result)));
  for (const brief of briefs.slice(n)) {
    if (result.created.length >= n) break;
    console.log(`autopilot/writer: ${result.created.length}/${n} written — trying the spare "${brief.workingTitle}"`);
    await writeOne(brief, inv, opts, result);
  }
  await finish(run.id, result, opts);
  return result;
}

async function finish(runId: string, r: GenerateResult, opts: RunOpts) {
  const blocked = opts.dryRun ? null : imagesBlocked();
  await prisma.autopilotRun.update({
    where: { id: runId },
    data: {
      finishedAt: new Date(),
      created: r.created.length,
      errors: r.errors.length ? JSON.stringify(r.errors) : null,
      skipped: r.skipped.length ? JSON.stringify(r.skipped) : null,
      notes: [opts.dryRun ? 'dry-run' : null, ...r.warnings.map((w) => w.warning), blocked ? `images skipped: ${blocked}` : null].filter(Boolean).join(' · ').slice(0, 1000) || null,
    },
  });
}
