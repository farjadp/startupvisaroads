// ============================================================================
// lib/autopilot/pipeline.ts
// The parts of the autopilot that do not care where the topic came from:
// the voice, the answer-engine rules, and the two rewrite passes with their
// guards. Both the planned writer and (Sprint 2) the source-driven writer run
// through here, so a reader cannot tell which pipeline produced an article.
//
// Ported from the Charana blog engine (lib/blog/pipeline.ts) with two changes:
// content is HTML, not markdown, and the fact rule is loosened for immigration
// programme rules (see FACT_RULES) because an immigration article with no
// programme facts in it is useless.
// ============================================================================
import OpenAI from 'openai';
import type { Locale } from '@/lib/seo';
import { inventedNumbers, wordCountHtml } from './text';

// gpt-4.1 follows length instructions; gpt-4o returned 550–850 words when asked for 1,900.
export const WRITER_MODEL = process.env.AUTOPILOT_MODEL ?? 'gpt-4.1';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build' });

export type GenerateResult = {
  created: { id: string; slug: string; title: string }[];
  errors: { title?: string; error: string }[];
  skipped: { title: string; reason: string }[];
  warnings: { title?: string; warning: string }[];
};

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

/** What may be stated as fact, and how. */
export const FACT_RULES = `Fact rules — follow all of them:
- State a programme rule only when it is grounded in a source supplied in this prompt. Name the responsible authority in full on first mention. Mutable claims about eligibility, thresholds, documents, fees, dates, quotas, processing or programme availability need the citation or attribution required by this prompt; otherwise omit them and tell the reader to verify with the authority.
- NEVER state a specific draw score, draw date, processing time in weeks, quota count, acceptance rate, fee amount or price unless it was given to you in this prompt. If a number would help but you were not given it, describe the shape without inventing the figure.
- Never invent a case study, a named client, a quote, a statistic, a survey or a percentage.
- Anything about Startup Visa Roads itself must come from BRAND FACTS only.`;

/** Rules that make an article quotable by answer engines, not just rankable. */
export const AIO_RULES = `Answer-engine rules (AEO/AIO/GEO) — follow all of them:
- Every <h2> is a question a person would actually type, or a plain noun phrase. The first two sentences under it answer that heading completely on their own, before any context. A section that only makes sense after reading the previous one cannot be quoted.
- Include at least one HTML table when the topic contains anything comparable — options, requirements, provinces, documents, timelines. Header row plus 3–6 rows, first column the thing being compared, no empty cells, no cell longer than a short phrase. Do not fabricate a table for a topic with nothing to compare.
- State entities in full at least once, with their acronym in parentheses.
- Attach a date or period to anything time-sensitive so a stale claim is visibly stale.
- Bold the decisive phrase in each section with <strong>, once, never whole sentences.`;

export function houseStyle(locale: Locale): string {
  const brand = `Voice: a senior strategist talking to a founder — direct, no-nonsense, specific, occasionally blunt about what gets cases rejected. Never salesy. First person is only "we at Startup Visa Roads" and only for things in BRAND FACTS; never "I", never invented anecdotes. No filler intro ("In today's world…"), no "in this article". Open with the reader's situation in two sentences. End with a short "What to do next" section that points to one or two site pages. Do not use <hr>. Use <h2> for sections and <h3> for sub-points; never <h1> (the title is rendered separately). Callouts: <div class="p-5 my-6 border-l-4 border-[#CCFF00] bg-[#1a1a1a]/[0.02] rounded-r-lg font-sans"><strong>Key note:</strong> …</div>. Tables: <table class="min-w-full my-6 border-collapse border border-[#1a1a1a]/10">. Lists: <ul class="list-disc pl-5 my-4">, never longer than six items.`;
  if (locale === 'fa') {
    return `${brand}
Persian rules: written register, not spoken (می‌رسد not می‌رسه, است not ـه, را not رو); second-person plural خودمانی but respectful ("بررسی کنید"); نیم‌فاصله always; Persian digits inside Persian text; keep programme names, acronyms and authorities in Latin (IRCC, CRS, SUV, EB-2 NIW, USCIS, OINP) with a Persian gloss on first mention; direction is RTL so use border-r-4 instead of border-l-4 in callouts.`;
  }
  return `${brand}
English rules: Canadian spelling (programme is fine, but "labour", "centre"); short paragraphs (2–4 sentences); no exclamation marks.`;
}

export function humanVoice(locale: Locale): string {
  const common = `- Vary sentence length hard: some very short. Some longer, with a clause that adds a concrete detail. Never three sentences in a row of similar length.
- No paragraph may open with the same word as the one before it; no three consecutive sentences starting with "This"/"این".
- No tricolon padding ("fast, easy and secure") and no bullet list longer than six items.
- Cut hedging stacks: pick "usually" or "often", never both. Cut adverbs. Prefer verbs to nominalisations.
- NEVER first-person singular. The writer is a team, not a person with memories.
- Add NO new fact. Not a number, not a percentage, not a price, not a year, not a programme, not a city, not a client, not an anecdote. Every figure, place and date in your output must already appear in the article you were given. If a paragraph feels thin, make the existing point sharper — do not invent an example to fill it.
- Exactly one place where the article takes a position ("Our view: …" / "به نظر ما…") and gives the reason.
- One concrete, checkable detail per section — a document name, an authority, a step, a period.`;
  if (locale === 'fa') {
    return `${common}
- Delete AI-isms outright: "در دنیای امروز", "قابل توجه است که", "به طور کلی", "در نهایت", "بیایید", "مهم است بدانید", "شایان ذکر است", "بدون شک", "در عصر حاضر", "می‌تواند به شما کمک کند تا", "نقش مهمی ایفا می‌کند".
- Keep the written register, نیم‌فاصله and Persian digits.`;
  }
  return `${common}
- Delete AI-isms outright: "In today's fast-paced world", "It's important to note", "Additionally", "Furthermore", "In conclusion", "delve", "navigate the complexities", "unlock", "seamless", "robust", "leverage", "game-changer", "landscape", "journey", "tapestry", "at the end of the day".`;
}

// ---------------------------------------------------------------------------
// Model call
// ---------------------------------------------------------------------------
/** Long-form output. gpt-4o stops at ~4k tokens unless told otherwise, which silently truncates a 2,000-word article. */
const MAX_OUTPUT_TOKENS = 12000;

export async function chatText(prompt: string, temperature: number): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: WRITER_MODEL,
    temperature,
    max_tokens: MAX_OUTPUT_TOKENS,
    messages: [{ role: 'user', content: prompt }],
  });
  return (completion.choices[0]?.message?.content ?? '').trim();
}

export async function chatJson<T>(prompt: string, temperature: number): Promise<T> {
  const completion = await openai.chat.completions.create({
    model: WRITER_MODEL,
    temperature,
    max_tokens: MAX_OUTPUT_TOKENS,
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: prompt }],
  });
  const raw = completion.choices[0]?.message?.content ?? '{}';
  return JSON.parse(raw) as T;
}

/** Strip a ```html fence if the model wrapped its answer. */
function unfence(text: string): string {
  return text.replace(/^```(?:html)?\s*/i, '').replace(/\s*```$/, '').trim();
}

// ---------------------------------------------------------------------------
// Structural guard shared by both passes
// ---------------------------------------------------------------------------
const count = (html: string, re: RegExp) => (html.match(re) ?? []).length;

/**
 * A rewrite must keep the skeleton: the visual markers, the links, the
 * tables, and the <h2>s. `expand` is allowed to ADD sections (it is asked to
 * add a "Common mistakes" one); `humanise` may not change the count at all.
 */
export function structureDrift(before: string, after: string, opts: { allowNewSections?: boolean } = {}): string | null {
  const h2Before = count(before, /<h2[\s>]/gi);
  const h2After = count(after, /<h2[\s>]/gi);
  if (opts.allowNewSections ? h2After < h2Before : h2After !== h2Before) return 'h2 count changed';
  for (const m of ['[VISUAL_1]', '[VISUAL_2]']) if (before.includes(m) && !after.includes(m)) return `${m} lost`;
  if (count(before, /<a\s/gi) > count(after, /<a\s/gi)) return 'links lost';
  if (count(before, /<table[\s>]/gi) > count(after, /<table[\s>]/gi)) return 'table lost';
  // A pass that loses more than a fifth of the prose has edited, not rewritten.
  // (expand must not shrink at all; humanise gets a little slack.) Checked
  // last so a structural reason, which is more actionable, wins the log line.
  const wb = wordCountHtml(before);
  const wa = wordCountHtml(after);
  if (wa < wb * (opts.allowNewSections ? 1 : 0.8)) return `shortened ${wb} → ${wa} words`;
  return null;
}

async function guarded(
  name: 'humanise' | 'expand',
  body: string,
  pass: (extra: string) => Promise<string>,
): Promise<string> {
  const driftOpts = { allowNewSections: name === 'expand' };
  let out = unfence(await pass(''));
  let bad = inventedNumbers(body, out);
  let drift = structureDrift(body, out, driftOpts);
  if (!bad.length && !drift) return out;

  console.warn(`autopilot/${name}: rejected —`, bad.length ? `invented ${bad.join(', ')}` : drift, '; retrying');
  const extra = [
    bad.length ? `\nThe previous attempt invented figures that are not in the article: ${bad.join(', ')}. Do not introduce those, or any other number, percentage, year, price, programme or place that is not already in the text below.` : '',
    drift ? `\nThe previous attempt changed the structure (${drift}). Keep every existing <h2>, every <a>, every <table> and the [VISUAL_n] markers exactly${name === 'expand' ? ' (adding a section is fine; removing one is not)' : ''}, and do not shorten the text.` : '',
  ].join('');
  out = unfence(await pass(extra));
  bad = inventedNumbers(body, out);
  drift = structureDrift(body, out, driftOpts);
  if (!bad.length && !drift) return out;

  console.warn(`autopilot/${name}: rejected again —`, bad.length ? `invented ${bad.join(', ')}` : drift, '; keeping the draft');
  return body;
}

// ---------------------------------------------------------------------------
// Passes
// ---------------------------------------------------------------------------

/** Grow a short draft with substance — examples, a table, a checklist — never filler. */
export async function expand(body: string, locale: Locale, target: number): Promise<string> {
  return guarded('expand', body, (extra) =>
    chatText(
      `This ${locale === 'fa' ? 'Persian' : 'English'} HTML article is ${wordCountHtml(body)} words; it should be about ${target}. Expand it to roughly ${target} words by adding SUBSTANCE only: a concrete example under each thin section, one comparison table or checklist where it helps, a short "Common mistakes" section if there is none. Keep every existing heading, fact, number, link, table, callout and the [VISUAL_1] / [VISUAL_2] markers exactly. Do not add filler sentences, do not add an intro or a conclusion paragraph, and do not introduce ANY number, percentage, year, price, programme, authority, city or company that is not already in the text below.
${extra}
Return only the HTML body (no <html>, no <h1>, no code fence).

ARTICLE:
${body}`,
      0.7,
    ),
  );
}

/** The voice pass. A stiffer article is a much cheaper mistake than a confident wrong one. */
export async function humanise(body: string, locale: Locale): Promise<string> {
  return guarded('humanise', body, (extra) =>
    chatText(
      `Rewrite the following ${locale === 'fa' ? 'Persian' : 'English'} HTML article so it reads as written by one experienced strategist, not a template. Keep every fact, number, heading, link (href and anchor text), table, callout, <strong> and the [VISUAL_1] / [VISUAL_2] markers exactly; do not add or remove sections; keep the total length within 10% of the original — this is a rewrite, not an edit; do NOT condense, merge or drop paragraphs. Change the prose, not the substance:

${humanVoice(locale)}
${extra}
Return only the HTML body (no <html>, no <h1>, no code fence).

ARTICLE:
${body}`,
      0.9,
    ),
  );
}
