// ============================================================================
// lib/autopilot/quality.ts
// The gates that keep the autopilot from rebuilding what the October 2026
// prune removed (lib/blog-prune.ts): sixty posts of 300–700 words, titled
// "The Ultimate Guide to…" / "Navigating…", a dozen of them the same
// Netherlands article. Three checks, all pure, all run after the body is
// final and before any image is paid for:
//
//   1. length   — a body still well short of the brief after two expansion
//                 passes publishes as a DRAFT, not as a thin page;
//   2. title    — the template openers that marked the June batch put the
//                 article in DRAFT so a person renames it;
//   3. sameness — a body that repeats an article we already published is
//                 skipped, like a repeated title already is.
// ============================================================================
import { shingles } from './originality';

/** Below this share of the brief's minimum, a body is too thin to publish. */
export const LENGTH_FLOOR_SHARE = 0.7;

export function lengthFloor(min: number): number {
  return Math.round(min * LENGTH_FLOOR_SHARE);
}

/**
 * Title openers and verbs the June 2026 batch was built from. Matched as
 * words, so "Ultimately" or "Explorer" do not trip it.
 */
const TEMPLATE_TITLE = /^(?:(?:a|an|the|your)\s+)?(?:comprehensive|ultimate|definitive)\b|\b(?:comprehensive|ultimate|complete|essential|definitive)\s+guide\b|\b(?:navigating|mastering|unlocking|unveiling|exploring|demystifying|leveraging)\b/i;

export function isTemplateTitle(title: string): boolean {
  return TEMPLATE_TITLE.test(title.trim());
}

/**
 * Six-word runs. Calibrated on the live site on 13 Oct 2026: across the 33
 * September–October English posts, distinct articles share at most 3.7% of
 * their runs with any other; the two September posts on the paused Start-Up
 * Visa ("overhaul", "dilemma"), which say the same thing twice, share 8.3%.
 *
 * What it cannot catch: two model rewrites of one topic share almost no
 * text — the two Persian settlement-funds articles with identical titles
 * share 1.5%. Topic repeats are the title check's job (sameSubject in
 * text.ts); this one catches the body that repeats an article we published.
 */
const SAMENESS_K = 6;
export const MAX_SAMENESS = 0.06;

export type OwnArticle = { title: string; content: string };

/** The published article this body overlaps most, and by how much. */
export function closestOwnArticle(body: string, corpus: OwnArticle[]): { title: string; ratio: number } | null {
  const mine = [...shingles(body, SAMENESS_K)];
  if (!mine.length) return null;
  let best: { title: string; ratio: number } | null = null;
  for (const a of corpus) {
    const theirs = shingles(a.content, SAMENESS_K);
    if (!theirs.size) continue;
    let hits = 0;
    for (const s of mine) if (theirs.has(s)) hits++;
    const ratio = hits / mine.length;
    if (!best || ratio > best.ratio) best = { title: a.title, ratio };
  }
  return best;
}

export type QualityVerdict = {
  /** Set when the article must not be written at all. */
  skip?: string;
  /** Reasons to hold a written article as a DRAFT instead of publishing. */
  draft: string[];
};

export function qualityVerdict(input: {
  title: string;
  words: number;
  min: number;
  closest: { title: string; ratio: number } | null;
}): QualityVerdict {
  if (input.closest && input.closest.ratio > MAX_SAMENESS) {
    return {
      skip: `repeats "${input.closest.title}" (${Math.round(input.closest.ratio * 100)}% of its six-word runs)`,
      draft: [],
    };
  }
  const draft: string[] = [];
  const floor = lengthFloor(input.min);
  if (input.words < floor) draft.push(`too thin: ${input.words} words, floor ${floor}`);
  if (isTemplateTitle(input.title)) draft.push(`template title: "${input.title}"`);
  return { draft };
}
