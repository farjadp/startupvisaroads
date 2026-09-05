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
//    against the inventory after the prose is final; unknown paths and all
//    outbound links are demoted to plain text. A blog that 404s inside itself
//    is worse than no blog.
// ============================================================================
import * as cheerio from 'cheerio';
import type { Inventory } from './inventory';
import { SITE_URL, type Locale } from '@/lib/seo';

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
export function enforceLinks(html: string, inv: Inventory): { html: string; links: string[] } {
  const label = new Map(inv.targets.map((t) => [t.path, t.label]));
  const used = new Set<string>();
  const $ = cheerio.load(html, null, false);

  $('a').each((_, el) => {
    const $a = $(el);
    const rawHref = ($a.attr('href') ?? '').trim();
    const text = $a.text();

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

  return { html: $.html(), links: [...used] };
}
