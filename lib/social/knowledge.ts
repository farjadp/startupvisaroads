// ============================================================================
// lib/social/knowledge.ts
// The English account's own voice: three to five posts a day that are not
// about an article at all.
//
// @ashavidgroup publishes one English article every few days, and an account
// that only speaks when the blog does is silent six days a week. Farjad asked
// for posts about the places founders move to — routes, countries, cities,
// how business is actually done there, what is worth knowing about a culture
// before you land. That is a different job from the insight post: there is no
// source page, so the rules about fact have to be stricter, not looser.
//
// The hard rule is durability. Anything that changes — a fee, a quota, a
// processing time, a threshold, who is open to applications this month — is
// forbidden outright, because there is no source here to check it against and
// a confidently wrong immigration claim is the one mistake this account cannot
// afford. What is left is what stays true: geography, language, ecosystems,
// business custom, the shape of a route.
// ============================================================================
import { chatJson } from '@/lib/autopilot/pipeline';
import { findPhoto, type Photo } from './photo';

/** Everything but the body is fixed, and 280 has to hold the hashtags too. */
const MAX_BODY = 200;

/**
 * The rotation. Not a list of topics — a list of *angles*, so the model picks
 * the subject and two runs on the same theme do not produce the same post.
 */
export const THEMES = [
  'a startup or founder visa route in one country, explained in plain words — who it is for and what it asks of a team, without any figure that could change',
  'a city outside the obvious ones that founders relocate to, and what actually makes it workable — talent, language, cost of living relative to the region, how easy it is to hire',
  'how business is really done in one country: meeting culture, hierarchy, punctuality, how a first email should read, what reads as rude',
  'a country worth knowing for its own sake — history, geography, food, something a person moving there would be glad to have been told',
  'a distinction people mix up: two routes, two permits or two statuses that sound alike and are not',
  'what a founder should have ready long before they apply anywhere — documents, company structure, proof of what they claim',
  'a country whose ecosystem is stronger than its reputation, and the sector it is genuinely good at',
  'the everyday practicalities of moving a small team abroad: banking, schooling, healthcare registration, the residence card queue',
  'a language or communication habit that changes how business feels in one country — how directness, silence or small talk is read there',
] as const;
// The count is deliberately odd. The rotation steps by the gap between runs,
// and an even count with a four-hour gap walked between two themes for ever.

const RULES = `Rules, all of them:
- ONE point. Complete on its own. A reader gets the whole thing without a link and without context from another post.
- Say something specific enough to be worth reading. "Portugal is welcoming to founders" is a wasted post; what its D2 route actually asks of a team is a post.
- NEVER state anything that can change: no fees, no salary or investment thresholds, no processing times, no quotas, no application windows, no "as of this year", no claim about what a programme is currently accepting. If a number would help and it is not permanent, describe the shape instead.
- Never invent a statistic, a ranking, a survey or a quote. If you are not confident it is durably true, write about something else.
- No superlatives and no rankings of any kind: not "the leading", not "the biggest", not "most of the country's", not "the first", not "world-class". They read as facts, they are almost never checkable, and one wrong one costs the account its credibility.
- No advice that reads as legal or immigration advice for an individual case.
- Friendly and human. Contractions are fine. No emoji, no links, no @mentions, no "thread", no "1/".
- Do not start with "Did you know" and do not start with the country's name in bold caps.
- Never first-person singular. Never salesy.

Also choose:
- 2 or 3 hashtags, English, no spaces, relevant and not generic filler.
- a photo search term for a stock library: two to four English words for something real and photographable. If the post is about a particular country or city, NAME IT in the term ("Tallinn old town", "Vienna coffee house"). If it names no place, choose a plain everyday scene with nothing national in it — a desk with papers, a café table, a meeting room. Never a passport, flag, visa, banknote or ID card unless the country is named in the term: a stock library will return some other country's, and a Turkish passport on a post about Canada is what this rule exists to stop. Never an abstract noun, never a metaphor for a piece of jargon ("cap table" returns a man in a cap), never text in the image.`;

export type KnowledgePost = { text: string; hashtags: string[]; photoQuery: string; topic: string };

const HASHTAG = /^#[A-Za-z0-9_]{2,30}$/;

/** Why a draft is unfit, or null. Same contract as the insight guard. */
export function rejectKnowledge(p: { post?: string; hashtags?: unknown; topic?: string }): string | null {
  const text = (p.post ?? '').trim();
  if (!text) return 'empty';
  if (text.length > MAX_BODY) return `too long (${text.length} > ${MAX_BODY})`;
  if (text.length < 60) return 'too short to carry a point';
  if (/https?:\/\//.test(text)) return 'contains a link';
  if (/(^|\s)[#@]\S/.test(text)) return 'hashtags belong in the hashtags field';
  if (/\p{Extended_Pictographic}/u.test(text)) return 'contains an emoji';
  // Superlatives are where an unsourced post turns into a false claim, and
  // the model reaches for them when a subject is thin.
  const superlative = /\b(the (leading|biggest|largest|best|first|top|fastest)|most of the|world[- ]class|number one|unrivalled|unmatched)\b/i;
  if (superlative.test(text)) return 'contains an unverifiable superlative';
  if (!(p.topic ?? '').trim()) return 'no topic given';
  const tags = Array.isArray(p.hashtags) ? p.hashtags : [];
  if (tags.length < 2 || tags.length > 3) return 'needs two or three hashtags';
  if (!tags.every((t) => typeof t === 'string' && HASHTAG.test(t))) return 'a hashtag is malformed';
  return null;
}

/** The message as it goes out: body, blank line, hashtags. */
export function knowledgeMessage(p: KnowledgePost): string {
  return `${p.text}\n\n${p.hashtags.join(' ')}`;
}

function prompt(theme: string, avoid: string[]): string {
  const recent = avoid.length
    ? `\n\nRecent posts covered these, so choose something else entirely — a different country and a different angle:\n${avoid.map((t) => `- ${t}`).join('\n')}`
    : '';
  return `Write one standalone post for X, in English, for an account read by founders looking at moving a company abroad.

Angle for this one: ${theme}

Voice: warm and friendly, like a well-travelled colleague telling you something useful over coffee — an equal, not a lecturer. Plain words, Canadian spelling, at most one exclamation mark and usually none. Banned outright: "In today's fast-paced world", "It's important to note", "delve", "navigate the complexities", "unlock", "seamless", "robust", "leverage", "game-changer", "landscape", "journey", "hidden gem".

Shape: one or two short paragraphs, at most ${MAX_BODY} characters.

${RULES}${recent}

Reply as JSON: {"post": "...", "hashtags": ["#...", "#..."], "photo": "...", "topic": "a four-to-eight word description of what this post is about, for avoiding repeats"}`;
}

/**
 * One knowledge post, or null.
 *
 * Null is a real answer here too: nothing about this account requires a post
 * at a given hour, and an empty one costs more than a missed slot.
 */
export async function writeKnowledge(theme: string, avoid: string[] = []): Promise<KnowledgePost | null> {
  let last = '';
  for (const [i, temperature] of [0.9, 0.5].entries()) {
    try {
      const ask = i === 0 ? prompt(theme, avoid) : `${prompt(theme, avoid)}\n\nA previous attempt was rejected: ${last}. Fix that and write it again.`;
      const reply = await chatJson<{ post?: string; hashtags?: string[]; photo?: string; topic?: string }>(ask, temperature);
      const draft = { ...reply, post: (reply.post ?? '').replace(/^["“]|["”]$/g, '').trim() };
      const bad = rejectKnowledge(draft);
      if (!bad) {
        return {
          text: draft.post,
          hashtags: (draft.hashtags ?? []).slice(0, 3),
          photoQuery: (reply.photo ?? '').trim().slice(0, 60),
          topic: (reply.topic ?? '').trim().slice(0, 120),
        };
      }
      last = bad;
      console.warn(`social/knowledge: draft rejected — ${bad}`);
    } catch (e) {
      console.error(`social/knowledge: model call failed — ${e instanceof Error ? e.message : String(e)}`);
      return null;
    }
  }
  return null;
}

/**
 * The theme for this run: the one least recently used, so the account moves
 * through the rotation instead of returning to whatever the model likes most.
 */
export function nextTheme(recentTopics: string[], at: Date = new Date()): string {
  // The rotation is by slot, not by content matching: comparing topics to
  // themes needs a similarity judgement, and a wrong one silently pins the
  // account to a single theme. The hour and day give a spread that is
  // deterministic and easy to reason about.
  const slot = (at.getUTCFullYear() * 366 + dayOfYear(at)) * 24 + at.getUTCHours();
  return THEMES[(slot + recentTopics.length) % THEMES.length];
}

function dayOfYear(d: Date): number {
  return Math.floor((Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - Date.UTC(d.getUTCFullYear(), 0, 0)) / 86_400_000);
}

/** The photo for a post, or null. Never a reason not to post. */
export async function knowledgePhoto(p: KnowledgePost): Promise<Photo | null> {
  return p.photoQuery ? findPhoto(p.photoQuery) : null;
}
