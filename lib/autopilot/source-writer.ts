// ============================================================================
// lib/autopilot/source-writer.ts
// Write visaroads articles from what immigration publications are covering,
// without ever republishing their words.
//
//   1. HARVEST (sources.ts) hands us articles we have not used before.
//   2. READ turns one source article into a FACT SHEET plus a visaroads
//      angle. The model is asked for discrete claims ("IRCC issued 3,500
//      ITAs on 4 Sep 2026") and for why a founder should care — not for a
//      summary. It may refuse (`usable: false`); refusals go into the ledger
//      so the same article is never re-read.
//   3. WRITE drafts an original piece from the fact sheet, our brand facts
//      and our link inventory — the same body/meta split, voice and guards
//      the planned writer uses.
//   4. The ORIGINALITY GATE compares the finished body against the source
//      with ten-word shingles. Too close and the article is thrown away —
//      before any money is spent on images.
//   5. Attribution: an "Sources" block at the foot of the body, and the
//      ledger keeps the provenance on the row.
// ============================================================================
import prisma from '@/lib/prisma';
import { createArticleFromPayload } from '@/lib/articles';
import type { Locale } from '@/lib/seo';
import { BRAND_FACTS, buildInventory, linkBlock, type Inventory } from './inventory';
import { originality, tooClose } from './originality';
import { AIO_RULES, FACT_RULES, WRITER_MODEL, chatJson, chatText, expand, houseStyle, humanise, type GenerateResult } from './pipeline';
import { generateBrandImage, imagesBlocked } from './images';
import { harvest, markLedger, type SourceArticle } from './sources';
import { decidePlannedPublication, enforceLinks, sameSubject, wordCountHtml } from './text';
import { draftMeta, placeVisuals, wordTarget } from './writer';
import type { Brief } from './planner';

// ---------------------------------------------------------------------------
// 1. Read a source article into a fact sheet
// ---------------------------------------------------------------------------
type Fact = { claim: string; attributedTo: string };
type SourceBrief = {
  usable: boolean;
  rejectReason: string;
  category: string;
  workingTitle: string;
  angle: string;
  whyNow: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchQueryEn: string;
  facts: Fact[];
  mustLink: string[];
  imageScenes: [string, string];
  depth: 'standard' | 'deep';
};

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const arr = (v: unknown) => (Array.isArray(v) ? v.map(String).map((s) => s.trim()).filter(Boolean) : []);

async function readSource(article: SourceArticle, inv: Inventory): Promise<SourceBrief> {
  const lang = inv.locale === 'fa' ? 'Persian (Farsi)' : 'English';
  const raw = await chatJson<Record<string, unknown>>(
    `You are the content editor of Startup Visa Roads (visaroads.com). ${BRAND_FACTS}

Below is an article published by ${article.sourceName}. Your job is NOT to summarise or rewrite it. Your job is to (a) pull out the checkable facts it reports, and (b) decide what visaroads would write about the same subject that is genuinely ours: what it means for a founder or skilled professional choosing a pathway, and what they should do about it.

Mark usable: false — and say why in one sentence — when any of these is true:
- it is an advertisement, a paid placement or a product promotion;
- it is a news item with nothing left to act on, or about an event that has passed;
- it is partisan politics, a crime story, or about the private life of a named individual;
- it is only about refugees, citizenship ceremonies, ministerial travel or ceremonial announcements with no programme consequence;
- the subject has nothing to do with immigrating, working or building a business in Canada, the USA, Europe, Australia or the UAE;
- the facts cannot be restated without depending on the source's own wording.
When usable is false, leave every other field empty.

A usable article must produce an angle we can defend: a practical consequence, a decision the reader faces, or a link into what the site actually covers.

INVENTORY of linkable paths (mustLink only from here; at least two, one of them a programme page):
${linkBlock(inv)}

Categories (pick exactly one): ${JSON.stringify(inv.categories.map((c) => c.name))}

Return JSON:
{
  "usable": true|false,
  "rejectReason": "one sentence, empty when usable",
  "category": "…",
  "workingTitle": "statement or how-to in ${lang}, ≤ 70 chars, specific",
  "angle": "visaroads' own angle in one sentence — what WE add that the source did not",
  "whyNow": "…",
  "primaryKeyword": "…", "secondaryKeywords": ["…"], "searchQueryEn": "the English question this answers",
  "facts": [{"claim":"one discrete, checkable fact from the source, with its number/date if it has one","attributedTo":"who measured or said it — IRCC, the province, the reporter; 'reported' when the source does not say"}],
  "mustLink": ["/path", "/path"],
  "imageScenes": ["cover scene: a concrete object, workspace or place, no faces, no text, no flags", "inline scene"],
  "depth": "standard"|"deep"
}

SOURCE ARTICLE — title: ${article.title}
published: ${article.publishedAt?.toISOString().slice(0, 10) ?? 'unknown'}
---
${article.text}
---`,
    0.4,
  );

  const known = new Set(inv.targets.map((t) => t.path));
  const catNames = inv.categories.map((c) => c.name);
  const scenes = arr(raw.imageScenes);
  const facts = Array.isArray(raw.facts)
    ? (raw.facts as Record<string, unknown>[]).map((f) => ({ claim: str(f?.claim), attributedTo: str(f?.attributedTo) || 'reported' })).filter((f) => f.claim)
    : [];
  return {
    usable: raw.usable === true,
    rejectReason: str(raw.rejectReason),
    category: catNames.find((c) => c.toLowerCase() === str(raw.category).toLowerCase()) ?? catNames[0] ?? '',
    workingTitle: str(raw.workingTitle),
    angle: str(raw.angle),
    whyNow: str(raw.whyNow),
    primaryKeyword: str(raw.primaryKeyword),
    secondaryKeywords: arr(raw.secondaryKeywords),
    searchQueryEn: str(raw.searchQueryEn),
    facts,
    mustLink: arr(raw.mustLink).filter((p) => known.has(p)),
    imageScenes: [scenes[0] ?? '', scenes[1] ?? ''],
    depth: raw.depth === 'deep' ? 'deep' : 'standard',
  };
}

/** A usable brief missing what the writer needs is a skip, not a crash. */
function briefGap(b: SourceBrief): string | null {
  if (!b.workingTitle) return 'no title';
  if (!b.angle) return 'no angle';
  if (!b.facts.length) return 'no facts extracted';
  if (!b.mustLink.length) return 'no internal link chosen';
  if (!b.imageScenes[0] || !b.imageScenes[1]) return 'no image scenes';
  return null;
}

// ---------------------------------------------------------------------------
// 2. Draft from the fact sheet
// ---------------------------------------------------------------------------
async function draftFromFacts(brief: SourceBrief, article: SourceArticle, inv: Inventory): Promise<string> {
  const lang = inv.locale === 'fa' ? 'Persian (Farsi)' : 'English';
  const { min, target } = wordTarget(brief.depth);
  const html = await chatText(
    `Write the body of an original ${lang} article for visaroads.com on this subject.

You are writing FROM A FACT SHEET, not from another article. You have never seen the original wording and must not try to reconstruct it. Do not translate. Do not follow the source's structure. Build the piece around visaroads' angle below, with our own headings, our own order and our own examples.

ANGLE (this is the article): ${brief.angle}
WORKING TITLE: ${brief.workingTitle}
WHY NOW: ${brief.whyNow}
KEYWORDS: ${[brief.primaryKeyword, ...brief.secondaryKeywords].filter(Boolean).join(', ')}
ENGLISH QUERY THIS ANSWERS: ${brief.searchQueryEn}

REPORTED FACTS — each one must carry its attribution in the prose the first time it appears ("according to ${article.sourceName}…", "IRCC reported…"). Do not state a reported fact bare:
${brief.facts.map((f) => `- ${f.claim} [${f.attributedTo}]`).join('\n')}

BRAND FACTS (the only things you may say about us): ${BRAND_FACTS}

Linkable paths (use ONLY these for internal links, as <a href="/path">natural anchor</a>; every path in mustLink appears at least once; link 3–6 times, spread through the body, never the path as visible text):
${linkBlock(inv)}
mustLink: ${brief.mustLink.join(', ')}

${FACT_RULES}
One more rule, and it is absolute: the REPORTED FACTS above are the ONLY things you may attribute to anyone, and the only numbers, dates and scores you may state. Everything else in the article is visaroads' own explanation, built from stable programme rules and general, uncontroversial knowledge. Never invent a quote, a statistic, a price, a deadline or a person.

${AIO_RULES}

${houseStyle(inv.locale)}

Length: ${min}–${target + 200} words of prose — the full article, every section complete. Structure: 5–8 <h2> sections. No <h1>. Place exactly two visual placeholders on their own lines: [VISUAL_1] after the first major section, [VISUAL_2] mid-article. No FAQ section — it is produced separately. No "Sources" section — it is appended separately.

Return ONLY the HTML body. No <html>/<body>, no code fence, no commentary.`,
    0.7,
  );
  return html.replace(/^```(?:html)?\s*/i, '').replace(/\s*```$/, '').trim();
}

function sourcesBlock(article: SourceArticle, locale: Locale): string {
  const label = locale === 'fa' ? 'منبع' : 'Source';
  const date = article.publishedAt ? ` (${article.publishedAt.toISOString().slice(0, 10)})` : '';
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  return `\n<section class="mt-12 pt-6 border-t border-[#1a1a1a]/10 font-sans text-sm text-[#1a1a1a]/60 not-prose"><p><strong>${label}:</strong> <a href="${esc(article.url)}" rel="noopener noreferrer" target="_blank">${esc(article.title)}</a> — ${esc(article.sourceName)}${date}</p></section>`;
}

// ---------------------------------------------------------------------------
// 3. Run
// ---------------------------------------------------------------------------
type RunOpts = { publish?: boolean; dryRun?: boolean };

/**
 * Write up to `n` posts from external sources, sequentially: each article is
 * three model passes plus images, and the harvest is shared state. Anything
 * this run does not reach stays `new` in the ledger for the next run.
 */
export async function runFromSources(n: number, locale: Locale, opts: RunOpts = {}): Promise<GenerateResult & { notes: string[] }> {
  const result: GenerateResult & { notes: string[] } = { created: [], errors: [], skipped: [], warnings: [], notes: [] };
  const run = await prisma.autopilotRun.create({ data: { requested: n, locale, mode: 'source', notes: opts.dryRun ? 'dry-run' : null } });

  let inv: Inventory;
  let articles: SourceArticle[];
  try {
    inv = await buildInventory(locale);
    // Over-fetch: the reader refuses roughly half of what it is handed (a
    // first run rejected 2 of 2), and a refusal costs one cheap read.
    const h = await harvest(n * 3);
    articles = h.articles;
    result.notes.push(...h.notes);
  } catch (e) {
    result.errors.push({ error: `harvest: ${e instanceof Error ? e.message : String(e)}` });
    await finish(run.id, result);
    return result;
  }
  if (!articles.length) result.notes.push('nothing new to write from');

  for (const article of articles) {
    if (result.created.length >= n) break;
    try {
      const brief = await readSource(article, inv);
      const gap = brief.usable ? briefGap(brief) : null;
      if (!brief.usable || gap) {
        const reason = brief.usable ? `brief incomplete: ${gap}` : brief.rejectReason || 'rejected without a reason';
        if (!opts.dryRun) await markLedger(article.ledgerId, 'skipped', reason);
        result.skipped.push({ title: article.title, reason });
        continue;
      }

      // Before any drafting, because a repeat costs three model passes and an
      // image before anyone sees it. The English lane has no human backlog to
      // deduplicate against — its topics come from whatever the feeds carried
      // this week, and feeds repeat themselves for days.
      const seen = [...inv.recentTitles, ...result.created.map((c) => c.title)];
      const echo = seen.find((t) => sameSubject(t, brief.workingTitle));
      if (echo) {
        const reason = `same subject as "${echo}"`;
        if (!opts.dryRun) await markLedger(article.ledgerId, 'skipped', reason);
        result.skipped.push({ title: brief.workingTitle, reason });
        console.warn(`autopilot/source-writer: SKIPPED as a repeat of "${echo}" — "${brief.workingTitle}"`);
        continue;
      }

      const { min, target } = wordTarget(brief.depth);
      let body = await draftFromFacts(brief, article, inv);
      const stages = [`draft ${wordCountHtml(body)}`];
      for (let i = 0; i < 2 && wordCountHtml(body) < min; i++) {
        body = await expand(body, inv.locale, target);
        stages.push(`expand ${wordCountHtml(body)}`);
      }
      body = await humanise(body, inv.locale);
      stages.push(`humanise ${wordCountHtml(body)}`);
      console.log(`autopilot/source-writer: "${brief.workingTitle}" words: ${stages.join(' → ')} (min ${min})`);

      // Originality gate — before any image is paid for.
      const o = originality(body, article.text);
      if (tooClose(o)) {
        const reason = `overlap with source: ${o.shared} shared ten-word runs — "${o.sample?.slice(0, 80) ?? ''}"`;
        if (!opts.dryRun) await markLedger(article.ledgerId, 'skipped', reason);
        result.skipped.push({ title: article.title, reason });
        continue;
      }

      const planBrief: Brief = {
        category: brief.category,
        workingTitle: brief.workingTitle,
        angle: brief.angle,
        whyNow: brief.whyNow,
        primaryKeyword: brief.primaryKeyword,
        secondaryKeywords: brief.secondaryKeywords,
        searchQueryEn: brief.searchQueryEn,
        mustLink: brief.mustLink,
        imageScenes: brief.imageScenes,
        depth: brief.depth,
      };
      const d = await draftMeta(planBrief, body, inv);
      body = await placeVisuals(body, d.inTextVisuals, !!opts.dryRun);
      const linked = enforceLinks(body, inv);
      body = linked.html;
      const publication = decidePlannedPublication(!!opts.publish, linked.officialCitationCount);
      if (publication.warning) {
        // This writer's feeds are mostly secondary outlets, so it downgrades
        // more often than the planned one — which makes an unreported
        // downgrade here even easier to miss. Say it where the logs are.
        result.warnings.push({ title: d.title, warning: publication.warning });
        console.warn(`autopilot/source-writer: DRAFT (no official citation survived) — "${d.title}"`);
      }
      if (Object.keys(d.quickFacts).length) {
        body = `<script type="application/json" id="quick-facts-data">${JSON.stringify(d.quickFacts)}</script>\n${body}`;
      }
      body += sourcesBlock(article, inv.locale);

      if (opts.dryRun) {
        result.created.push({ id: 'dry-run', slug: d.slugEn || 'dry-run', title: d.title });
        console.log(`autopilot/source-writer (dry): "${d.title}" — ${wordCountHtml(body)} words, overlap ${o.shared}, links ${linked.links.join(', ') || 'none'}`);
        continue;
      }

      // The writer renames the piece, so the title that ships is not the one
      // checked above.
      const repeat = seen.find((t) => sameSubject(t, d.title));
      if (repeat) {
        const reason = `already published as "${repeat}"`;
        await markLedger(article.ledgerId, 'skipped', reason);
        result.skipped.push({ title: d.title, reason });
        console.warn(`autopilot/source-writer: SKIPPED as a repeat of "${repeat}" — "${d.title}"`);
        continue;
      }

      const coverImage = await generateBrandImage(d.coverImagePrompt, 'cover');

      const created = await createArticleFromPayload(
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
          topicSeed: `${brief.primaryKeyword ? `[kw:${brief.primaryKeyword}] ` : ''}${article.sourceName}: ${article.title} — ${brief.angle}`,
          internalLinks: linked.links,
        },
        // Same gate as the planned writer: a piece whose only sourcing is a
        // secondary outlet (cicnews.com is an immigration firm's own marketing
        // property) must not auto-publish as though it were authoritative.
        { locale: inv.locale, status: publication.status },
      );
      await markLedger(article.ledgerId, 'used', brief.angle, created.id);
      result.created.push({ id: created.id, slug: created.slug, title: created.title });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!opts.dryRun) await markLedger(article.ledgerId, 'failed', msg);
      result.errors.push({ title: article.title, error: msg });
    }
  }

  const blocked = opts.dryRun ? null : imagesBlocked();
  if (blocked) result.notes.push(`images skipped: ${blocked}`);
  await finish(run.id, result);
  return result;
}

async function finish(runId: string, r: GenerateResult & { notes: string[] }) {
  await prisma.autopilotRun.update({
    where: { id: runId },
    data: {
      finishedAt: new Date(),
      created: r.created.length,
      errors: r.errors.length ? JSON.stringify(r.errors) : null,
      skipped: r.skipped.length ? JSON.stringify(r.skipped) : null,
      notes: r.notes.join(' · ').slice(0, 1000) || null,
    },
  });
}
