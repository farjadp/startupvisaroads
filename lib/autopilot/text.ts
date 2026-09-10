// ============================================================================
// lib/autopilot/text.ts
// Pure text helpers for the content autopilot. No model calls, no DB — so
// every guard that decides whether an article ships can be unit-tested.
//
// Two guards live here:
//  · inventedNumbers — a rewrite that introduces a digit nobody gave it has
//    invented a fact. Comparing digit tokens before/after catches that class
//    without another model call.
//  · enforceLinks — the writer never invents a path. Every <a href> is checked
//    against the inventory after the prose is final; unknown paths and
//    non-official outbound links are demoted to plain text. A blog that 404s
//    inside itself is worse than no blog.
// ============================================================================
import * as cheerio from 'cheerio';
import type { Inventory } from './inventory';
import { SITE_URL, type Locale } from '@/lib/seo';
import { officialCitationUrl } from './official-sources';

const OWN_HOSTS = new Set([new URL(SITE_URL).host, 'visaroads.com', 'www.visaroads.com']);

/** `https://visaroads.com/en/pnp` → `/en/pnp`; other hosts → null. */
export function ownPath(href: string): string | null {
  if (!/^(https?:)?\/\//i.test(href)) return href;
  try {
    const u = new URL(href.startsWith('//') ? `https:${href}` : href);
    return OWN_HOSTS.has(u.host) ? `${u.pathname}${u.search}${u.hash}` : null;
  } catch {
    return null;
  }
}

/** Every number in a text, as Latin-digit tokens (Persian/Arabic digits folded). */
export function numberTokens(text: string): Set<string> {
  const latin = text
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
  return new Set((latin.match(/\d+/g) ?? []).filter((n) => n.length <= 6));
}

/** Numbers present in `after` that were not in `before`. */
export function inventedNumbers(before: string, after: string): string[] {
  const had = numberTokens(before);
  return [...numberTokens(after)].filter((n) => !had.has(n));
}

/** Word count of HTML prose; SVG diagrams and tags do not count. */
export function wordCountHtml(html: string): number {
  const $ = cheerio.load(html, null, false);
  $('svg, script, style').remove();
  // Tags become spaces so `</h2><p>` does not glue two words together.
  return $.html().replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

/** `pnp/ontario` → `/pnp/ontario`; `/en/pnp/ontario/?x=1` → `/pnp/ontario`. */
export function normalisePath(href: string, locale: Locale): string {
  let p = href.trim();
  if (!p.startsWith('/')) p = `/${p}`;
  p = p.split(/[#?]/)[0];
  p = p.replace(/^\/(en|fa)(?=\/|$)/, '');
  if (p === '') p = '/';
  if (p.length > 1) p = p.replace(/\/+$/, '');
  void locale;
  return p;
}

/**
 * Keep only links we can prove exist; everything else becomes plain text.
 * Known paths are rewritten with the locale prefix the router expects.
 */
export function enforceLinks(html: string, inv: Inventory): {
  html: string;
  links: string[];
  officialLinks: string[];
  officialCitationCount: number;
} {
  const label = new Map(inv.targets.map((t) => [t.path, t.label]));
  const used = new Set<string>();
  const officialLinks = new Set<string>();
  let officialCitationCount = 0;
  const $ = cheerio.load(html, null, false);

  $('a').each((_, el) => {
    const $a = $(el);
    const rawHref = ($a.attr('href') ?? '').trim();
    const text = $a.text();
    const officialUrl = officialCitationUrl(rawHref);
    if (officialUrl) {
      officialLinks.add(officialUrl);
      officialCitationCount++;
      $a.attr('href', officialUrl);
      $a.attr('target', '_blank');
      $a.attr('rel', 'noopener noreferrer');
      return;
    }

    const href = rawHref && !/^(mailto:|tel:)/i.test(rawHref) ? ownPath(rawHref) : null;
    if (!href) {
      $a.replaceWith(text);
      return;
    }
    const path = normalisePath(href, inv.locale);
    if (!label.has(path)) {
      $a.replaceWith(text);
      return;
    }
    used.add(path);
    $a.attr('href', `/${inv.locale}${path}`);
    if (text.trim().startsWith('/')) $a.text(label.get(path) ?? text);
  });

  return { html: $.html(), links: [...used], officialLinks: [...officialLinks], officialCitationCount };
}

export function decidePlannedPublication(
  publishRequested: boolean,
  officialCitationCount: number,
): { status: 'DRAFT' | 'PUBLISHED'; warning?: string } {
  if (!publishRequested || officialCitationCount > 0) return { status: publishRequested ? 'PUBLISHED' : 'DRAFT' };
  return {
    status: 'DRAFT',
    warning: 'Publication downgraded to DRAFT: no allowlisted official citation survived link enforcement.',
  };
}

/**
 * Words that carry no subject. Every Persian title on this site contains most
 * of them, so leaving them in makes any two titles look alike.
 */
const STOPWORDS = new Set([
  'برای', 'با', 'از', 'در', 'به', 'که', 'را', 'و', 'یا', 'این', 'آن', 'است', 'چه', 'چیست',
  'وقتی', 'دارید', 'کنید', 'چگونه', 'راهنمای', 'عملی', 'کامل', 'باید', 'های', 'ها', 'یک',
  'ویزای', 'استارتاپ', 'مهاجرت', 'کجا', 'دقیقا', 'دقیقاً', 'شما', 'چرا',
  // English, for the lane that writes in it. Same reasoning: these words are
  // in half the titles on the site and say nothing about the subject.
  'the', 'and', 'for', 'with', 'your', 'you', 'what', 'how', 'why', 'when', 'where',
  'guide', 'complete', 'practical', 'from', 'into', 'about', 'that', 'this', 'are',
  'visa', 'startup', 'immigration', 'canada', 'canadas',
]);

/** Content words of a title, without the punctuation a writer adds. */
function subjectWords(title: string): Set<string> {
  return new Set(
    title
      .replace(/[«»"'’:،.؟?!()\[\]{}\-—–]/g, ' ')
      .replace(/\u200c/g, ' ')
      .split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 2 && !STOPWORDS.has(w)),
  );
}

/**
 * Whether two titles are about the same thing.
 *
 * Substring matching was the whole bug: the backlog says "اثبات تمکن مالی برای
 * ویزای استارتاپ وقتی حساب ایرانی دارید" and the writer published "اثبات تمکن
 * مالی ویزای استارتاپ با حساب بانکی ایرانی". Neither contains the other, so
 * the topic never counted as written and the Persian lane published it four
 * times in three days. Shared subject words are what actually distinguishes
 * one topic here from another.
 */
export function sameSubject(a: string, b: string): boolean {
  const x = subjectWords(a);
  const y = subjectWords(b);
  if (!x.size || !y.size) return false;
  let shared = 0;
  for (const w of x) if (y.has(w)) shared++;
  return shared / Math.min(x.size, y.size) >= 0.6;
}
