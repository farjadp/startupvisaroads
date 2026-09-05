// ============================================================================
// lib/autopilot/originality.ts
// The check that turns "we intend to write our own thing" into something
// enforced: word shingles of the finished article against the source text.
// Any ten-word run in common is not coincidence, it is a copied sentence.
// Pure functions, no model call — an article that fails here costs nothing
// more than the passes already spent, and never an image.
// ============================================================================

export const normaliseForCompare = (s: string) =>
  s
    .replace(/<[^>]+>/g, ' ') // tags
    .replace(/‌/g, ' ') // نیم‌فاصله → space, so spacing choices cannot mask a match
    .replace(/[ً-ْ]/g, '') // harakat
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ') // punctuation
    .replace(/\s+/g, ' ')
    .trim();

export function shingles(text: string, k: number): Set<string> {
  const w = normaliseForCompare(text).split(' ').filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i + k <= w.length; i++) out.add(w.slice(i, i + k).join(' '));
  return out;
}

/**
 * How much of our article is verbatim from the source. `sample` is the first
 * matching run, which is what an admin actually wants to see in the ledger.
 */
export function originality(body: string, sourceText: string, k = 10): { shared: number; ratio: number; sample: string | null } {
  const src = shingles(sourceText, k);
  const mine = [...shingles(body, k)];
  if (!mine.length) return { shared: 0, ratio: 0, sample: null };
  const hits = mine.filter((s) => src.has(s));
  return { shared: hits.length, ratio: hits.length / mine.length, sample: hits[0] ?? null };
}

/**
 * Thresholds carried over from the Charana engine, which set them from a real
 * run: an honest retelling of a statistic shares two to four ten-word runs
 * (the numbers and the authority's name come out in the same order); a copied
 * paragraph shares dozens, and the source fed back as our own text scored 386.
 * Six sits well below "copied" with headroom above "restated a fact". A
 * rejected article is written into the ledger with the offending run, so a
 * mis-set threshold shows up as a reason an admin can read.
 */
export const MAX_OVERLAP_SHINGLES = 6;
export const MAX_OVERLAP_RATIO = 0.02;

export function tooClose(o: { shared: number; ratio: number }): boolean {
  return o.shared > MAX_OVERLAP_SHINGLES || o.ratio > MAX_OVERLAP_RATIO;
}
