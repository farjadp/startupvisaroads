// ============================================================================
// lib/social/photo.ts
// The picture that goes out with a post, from Pexels.
//
// A post with an image is seen; a wall of text scrolls past. That is the whole
// reason this exists, so it is also the whole limit on it: the photo is
// decoration, never evidence. Nothing here may decide whether a post happens
// — a missing key, a rate limit, a dead CDN and a search that matched nothing
// all end the same way, with `null` and a text-only post.
//
// Pexels does not require attribution. The photographer is carried anyway, so
// a person reading the logs can tell where a picture came from.
// ============================================================================

export type Photo = {
  data: Buffer;
  mimeType: string;
  /** Alt text for the tweet, so the post is readable with images off. */
  alt: string;
  photographer: string;
  sourceUrl: string;
};

/** X rejects anything larger; Pexels 'large' sits far below it. */
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Subjects that carry a nationality whether you asked for one or not.
 *
 * "passport on a desk" returned a Turkish passport, which went out attached to
 * a post about Canadian study permits. A stock library has no idea which
 * country a post is about, so a search for a national document is a coin toss
 * on getting the wrong flag in the picture. These are only allowed when the
 * query names the place itself.
 */
export const NATIONAL = /\b(passport|flag|visa|id card|identity card|banknote|currency|money|residence permit|green card)\b/i;

/**
 * Places a photo can claim to be, for catching the ones that claim a different
 * one from the post. Not exhaustive and does not need to be: it carries the
 * countries a founder-facing account actually writes about, which is where the
 * mistake is both likely and expensive.
 */
const PLACES = [
  'afghan', 'albania', 'america', 'argentin', 'australia', 'austria', 'belgium', 'brazil', 'bulgaria',
  'canada', 'chile', 'china', 'chinese', 'colombia', 'croatia', 'czech', 'denmark', 'danish', 'dubai',
  'dutch', 'egypt', 'emirat', 'estonia', 'finland', 'finnish', 'france', 'french', 'georgia', 'german',
  'greece', 'greek', 'hungar', 'iceland', 'india', 'indonesia', 'iran', 'ireland', 'irish', 'israel',
  'ital', 'japan', 'kazakh', 'korea', 'latvia', 'lithuania', 'malaysia', 'mexic', 'morocc', 'netherlands',
  'norway', 'norwegian', 'pakistan', 'peru', 'philippin', 'poland', 'polish', 'portugal', 'portuguese',
  'qatar', 'romania', 'russia', 'saudi', 'serbia', 'singapore', 'slovak', 'sloven', 'spain', 'spanish',
  'sweden', 'swedish', 'swiss', 'switzerland', 'thai', 'turkey', 'turkish', 'türkiye', 'ukrain',
  'united kingdom', 'britain', 'british', 'usa', 'vietnam',
];

type PexelsPhoto = {
  alt?: string | null;
  photographer?: string;
  url?: string;
  src?: { large?: string; large2x?: string; medium?: string };
};

/**
 * Place names in a query, as Pexels would have to describe them.
 *
 * "Tbilisi bakery" returned a photograph of a Turkish flag in a bakery
 * window — a fine picture of the wrong country, attached to a post about
 * Georgia. A picture that contradicts the post is worse than no picture, so a
 * proper noun in the query has to appear in what Pexels says the photo shows.
 */
function properNouns(query: string): string[] {
  return query
    .split(/\s+/)
    .filter((w) => /^[A-Z][\p{L}'-]{2,}$/u.test(w))
    .map((w) => w.toLowerCase());
}

function describes(p: PexelsPhoto, names: string[]): boolean {
  if (!names.length) return true;
  const haystack = `${p.alt ?? ''} ${p.url ?? ''}`.toLowerCase();
  return names.every((n) => haystack.includes(n));
}

/**
 * True when the photo announces a country the query did not ask for.
 *
 * This is the guard that would have kept a Turkish passport off a post about
 * Canada. It reads the description Pexels supplies, so it only catches what
 * the library itself admits to — which is enough, because the wrong-country
 * pictures are exactly the ones described by their country.
 */
export function claimsAnotherPlace(p: { alt?: string | null; url?: string }, query: string): boolean {
  const haystack = `${p.alt ?? ''} ${p.url ?? ''}`.toLowerCase();
  const asked = query.toLowerCase();
  return PLACES.some((place) => haystack.includes(place) && !asked.includes(place));
}

/**
 * A landscape photo for `query`, or null.
 *
 * One of the first few results at random rather than the top one: the same
 * query twice a week returning the same picture is what makes an account look
 * automated, which is the thing the picture was added to avoid.
 */
export async function findPhoto(query: string): Promise<Photo | null> {
  const key = process.env.PEXELS_API_KEY?.trim();
  if (!key) {
    console.warn('social/photo: PEXELS_API_KEY is not set — posting without a picture');
    return null;
  }
  if (!query.trim()) return null;

  // A national document with no country named is the one search guaranteed to
  // produce the wrong country. No picture is the right answer here.
  if (NATIONAL.test(query) && !properNouns(query).length) {
    console.warn(`social/photo: "${query}" asks for a national document without naming a country — posting without a picture`);
    return null;
  }

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape&size=medium`,
      { headers: { Authorization: key } },
    );
    if (!res.ok) {
      console.warn(`social/photo: Pexels search failed (${res.status}) for "${query}"`);
      return null;
    }

    const body = (await res.json()) as { photos?: PexelsPhoto[] };
    const usable = (body.photos ?? []).filter((p) => p.src?.large || p.src?.large2x || p.src?.medium);
    const names = properNouns(query);
    const photos = usable.filter((p) => describes(p, names) && !claimsAnotherPlace(p, query));
    if (!photos.length) {
      console.warn(
        usable.length
          ? `social/photo: nothing Pexels returned for "${query}" actually shows ${names.join(', ')} — posting without a picture`
          : `social/photo: Pexels had nothing for "${query}"`,
      );
      return null;
    }

    const chosen = photos[Math.floor(Math.random() * Math.min(photos.length, 8))];
    const src = chosen.src!.large ?? chosen.src!.large2x ?? chosen.src!.medium!;

    const file = await fetch(src);
    if (!file.ok) return null;
    const mimeType = file.headers.get('content-type') ?? '';
    if (!mimeType.startsWith('image/')) return null;

    const data = Buffer.from(await file.arrayBuffer());
    if (!data.length || data.length > MAX_BYTES) return null;

    return {
      data,
      mimeType,
      // Pexels' own alt text describes the picture; the query is the fallback
      // and is at least the subject.
      alt: (chosen.alt || query).slice(0, 900),
      photographer: chosen.photographer ?? 'unknown',
      sourceUrl: chosen.url ?? src,
    };
  } catch (e) {
    console.warn(`social/photo: ${e instanceof Error ? e.message : String(e)}`);
    return null;
  }
}
