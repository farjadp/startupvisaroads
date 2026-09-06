// ============================================================================
// lib/social/x-message.ts
// What goes out on X, per destination and per shape. Pure.
//
// The two accounts are not translations of each other. @ashavidgroup carries
// the English lane for an English audience inside the standard character
// limit; the personal account carries the Persian lane, has Premium, and
// therefore has room for the whole thought instead of a truncated one.
//
// The personal account also signs every message. Farjad asked for it and it
// is the right default anyway: a reader deserves to know a post was sent by
// software rather than typed by the person whose name is on the account.
// ============================================================================
import { SITE_URL } from '@/lib/seo';
import { toPersianDigits } from '@/lib/fa/format';
import type { Destination } from './destinations';

export type XKind = 'article' | 'insight';

export type XArticle = {
  title: string;
  locale: 'en' | 'fa';
  slug: string;
  keyTakeaway?: string | null;
  excerpt?: string | null;
};

/** X counts every link as this many characters however long it is. */
const LINK_WEIGHT = 23;

const HASHTAGS: Record<'en' | 'fa', string[]> = {
  en: ['#StartupVisa', '#Founders', '#Immigration', '#Entrepreneurship'],
  fa: ['#استارتاپ_ویزا', '#مهاجرت_کارآفرینی', '#ویزای_استارتاپ'],
};

const plain = (s: string) => s.replace(/[*_`~\[\]]/g, '').replace(/[ \t]+/g, ' ').trim();

/** Persian digits in prose; programme codes and acronyms stay Latin. */
const digits = (t: string, locale: 'en' | 'fa') =>
  locale === 'fa' ? t.replace(/(?<![A-Za-z0-9-])\d+(?![A-Za-z0-9-])/g, (d) => toPersianDigits(d)) : t;

const url = (a: XArticle) => `${SITE_URL}/${a.locale}/blog/${a.slug}`;

/**
 * Length as X counts it: every link weighs LINK_WEIGHT whatever its real
 * length. Exported because a test asserting raw `.length` is asserting the
 * wrong rule — a message can run past 280 real characters and still be a
 * valid post, and one that fits in 280 real characters can still be rejected.
 */
export function xLength(text: string): number {
  return text.split(/\s+/).reduce((n, w) => n + (/^https?:\/\//.test(w) ? LINK_WEIGHT : w.length) + 1, -1);
}

function clip(s: string, max: number): string {
  if (s.length <= max) return s;
  const room = max - 1;
  const cut = s.slice(0, room);
  const at = cut.lastIndexOf(' ');
  return `${(at > room * 0.6 ? cut.slice(0, at) : cut).trimEnd()}…`;
}

/**
 * Build one message.
 *
 * The body is the only elastic part. Links, hashtags and the signature are
 * fixed: a cut link is unclickable, hashtags were asked for explicitly, and a
 * signature that only appears when there is room is not a disclosure.
 */
export function xMessage(a: XArticle, d: Destination, kind: XKind): string {
  const locale = a.locale;
  const tags = HASHTAGS[locale].slice(0, kind === 'insight' ? 2 : 3).join(' ');
  const link = url(a);

  const idea = digits(plain(a.keyTakeaway || a.excerpt || a.title), locale);
  const title = digits(plain(a.title), locale);

  // The article post announces a piece; the insight post is an idea from one.
  const opening = kind === 'article' ? `${title}\n\n${idea}` : idea;

  // Labelled and grouped, not stacked. Four bare URLs each on their own line
  // with a blank line between them is a link dump eight lines tall; the same
  // four with a word in front and single line breaks reads as a footer.
  const label = locale === 'fa'
    ? { article: 'مقاله', channel: 'کانال', site: 'وب‌سایت' }
    : { article: 'Article', channel: 'Channel', site: 'Web' };

  const block: string[] = [`${label.article}: ${link}`];
  if (kind === 'article' && d.links?.length) {
    const extra = d.links.filter((l) => l !== link);
    const channel = extra.find((l) => l.includes('t.me'));
    const sites = extra.filter((l) => !l.includes('t.me')).map((l) => l.replace(/^https?:\/\/(www\.)?/, ''));
    if (channel) block.push(`${label.channel}: ${channel.replace(/^https?:\/\//, '')}`);
    if (sites.length) block.push(`${label.site}: ${sites.join(' · ')}`);
  }

  const tail: string[] = [block.join('\n'), tags];
  if (d.signature) tail.push(`— ${d.signature}`);

  const fixed = tail.join('\n\n');

  if (!d.charLimit) {
    // Long-form: nothing is cut, and the parts are separated so it reads tidy.
    return `${opening}\n\n${fixed}`;
  }

  // Everything but the body is fixed, so the body absorbs the limit.
  const room = d.charLimit - xLength(fixed) - 2;
  const body = room > 30 ? clip(opening, room) : '';
  return body ? `${body}\n\n${fixed}` : fixed;
}
