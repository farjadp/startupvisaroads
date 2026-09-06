// ============================================================================
// lib/social/telegram-message.ts
// The two shapes a channel post takes. Pure: no Prisma, no fetch, no token.
//
// Sent without parse_mode, because captions are built from model output and
// article bodies out of the database — markup that cannot execute cannot be
// injected. Markup characters are stripped anyway: a caption that reads as
// broken formatting looks like a mistake to a human even when it is harmless
// to the API.
//
// The one hard rule is that the URL survives. A truncated link is unclickable,
// which makes the whole post pointless — so when a caption is too long the
// prose gives way, never the link.
// ============================================================================
import { SITE_URL } from '@/lib/seo';
import { toPersianDigits } from '@/lib/fa/format';

/** Telegram's limit for a photo caption. Plain messages allow more; this is
 *  the tighter of the two and the article post always carries a cover. */
export const CAPTION_LIMIT = 1024;

export type PostableArticle = {
  title: string;
  locale: 'en' | 'fa';
  slug: string;
  keyTakeaway?: string | null;
  excerpt?: string | null;
};

const T = {
  fa: { read: 'خواندن مقاله' },
  en: { read: 'Read the article' },
} as const;

export const articleUrl = (a: PostableArticle) => `${SITE_URL}/${a.locale}/blog/${a.slug}`;

/** Remove characters a reader would take for formatting. */
const plain = (s: string) => s.replace(/[*_`~\[\]]/g, '').replace(/\s+/g, ' ').trim();

/**
 * Persian digits belong in Persian prose; programme codes and acronyms stay
 * Latin. Converting only standalone runs leaves EB-2 and CLB 5 intact.
 */
function localiseDigits(text: string, locale: 'en' | 'fa'): string {
  if (locale !== 'fa') return text;
  return text.replace(/(?<![A-Za-z0-9-])\d+(?![A-Za-z0-9-])/g, (d) => toPersianDigits(d));
}

/**
 * Trim to `max` on a word boundary. The ellipsis counts towards `max`: a clip
 * that returns max+1 characters is the kind of off-by-one that only shows up
 * as a rejected API call at the one moment the caption is actually long.
 */
function clip(s: string, max: number): string {
  if (s.length <= max) return s;
  const room = max - 1; // the ellipsis
  const cut = s.slice(0, room);
  const at = cut.lastIndexOf(' ');
  return `${(at > room * 0.6 ? cut.slice(0, at) : cut).trimEnd()}…`;
}

/**
 * The post that goes out when an article publishes: title, a few lines of
 * framing, and the link.
 */
export function articleMessage(a: PostableArticle): string {
  const url = articleUrl(a);
  const t = T[a.locale];
  const title = localiseDigits(plain(a.title), a.locale);
  const framing = localiseDigits(plain(a.keyTakeaway || a.excerpt || ''), a.locale);

  // Everything except the prose is fixed, so the prose is what has to fit.
  const tail = `\n\n${t.read}:\n${url}`;
  const room = CAPTION_LIMIT - tail.length - title.length - 2;

  const body = room > 40 ? clip(framing, room) : '';
  return `${title}${body ? `\n\n${body}` : ''}${tail}`;
}

/**
 * The quiet-day post: one idea, then the link. Deliberately does not lead with
 * the headline — a channel where every post opens with a title reads as a feed
 * rather than as someone talking.
 *
 * The limit is Telegram's, not a tweet's. An earlier 280 came from habit and
 * cut every real keyTakeaway mid-sentence: those are written as 40–60 words
 * that answer the article's question outright, so truncating one destroys the
 * only thing the post was carrying. 700 fits any of them whole and still
 * refuses a runaway.
 */
const SHORT_LIMIT = 700;

/**
 * The insight post, on the channel.
 *
 * The same thought that goes to X, and like it, no link: the channel already
 * carried this article with its link when it published, and a second post
 * pointing at the same page reads as a repeat rather than as something worth
 * stopping for. The caption limit is Telegram's, because these arrive with a
 * picture.
 */
export function insightMessage(insight: string, locale: 'en' | 'fa'): string {
  return clip(localiseDigits(plain(insight), locale), CAPTION_LIMIT);
}

export function shortMessage(a: PostableArticle): string {
  const url = articleUrl(a);
  const idea = localiseDigits(plain(a.keyTakeaway || a.excerpt || a.title), a.locale);
  return `${clip(idea, SHORT_LIMIT)}\n\n${url}`;
}
