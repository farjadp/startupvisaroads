// ============================================================================
// Server-side HTML sanitizer (built on cheerio, already a dependency).
// AI/admin generated HTML is rendered via dangerouslySetInnerHTML, so it must
// be stripped of script execution vectors before it ever reaches the DOM.
// ----------------------------------------------------------------------------
// Note: dangerouslySetInnerHTML does not run <script> tags, but it DOES run
// inline event handlers (onerror/onload/...) and `javascript:` URLs. We remove
// all of those, plus dangerous tags. URL attributes go through a scheme
// allowlist (isSafeUrl); data: URLs are only allowed for images.
//
// SVG IS allowed — AI-generated diagrams use inline SVG for crisp rendering.
// However, dangerous SVG sub-elements (script, use[href], foreignObject) are
// stripped to prevent XSS via SVG vectors.
// ============================================================================

import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';

// Tags that are unconditionally removed (SVG itself is intentionally NOT here).
const DISALLOWED_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'link', 'meta', 'base', 'math'];

// Dangerous tags that may appear inside <svg> and must be stripped.
const DISALLOWED_SVG_CHILDREN = ['script', 'use', 'foreignObject', 'animate', 'set', 'animateMotion', 'animateTransform'];

// Every attribute the browser resolves as a URL (navigation, fetch or ping).
const URL_ATTRS = new Set([
  'href', 'src', 'xlink:href', 'action', 'formaction', 'poster', 'background', 'cite', 'data', 'ping', 'srcset',
]);

const SAFE_SCHEMES = new Set(['http', 'https', 'mailto', 'tel']);

// Only these elements may carry an inline data:image/ in src/srcset.
const DATA_IMAGE_TAGS = new Set(['img', 'source']);

/**
 * Characters removed before the scheme is read: all ASCII C0 controls, space,
 * DEL and C1 controls, plus U+FFFD (what the HTML parser turns NUL into).
 * Browsers drop tab/LF/CR anywhere in a URL and C0 controls/space at its
 * ends, so `java\tscript:` and `\x01javascript:` run as javascript:. Removing
 * them everywhere is stricter than the browser: it can only make a value look
 * more like a scheme, never less, so the allowlist fails closed.
 */
const URL_IGNORED_CHARS = /[\u0000- \u007f-\u009f\ufffd]/g;

/**
 * Scheme allowlist for one URL attribute value (already entity-decoded by the
 * parser). No scheme = relative path, #fragment, ?query or //host: allowed.
 * data: only as data:image/ in src/srcset on img/source (SVG images included:
 * an SVG loaded through <img> runs no script). Everything else must be
 * http, https, mailto or tel.
 */
export function isSafeUrl(value: string, attr: string, tag = ''): boolean {
  const v = value.replace(URL_IGNORED_CHARS, '').toLowerCase();
  const m = /^([a-z][a-z0-9+.-]*):/.exec(v);
  if (!m) return true;
  const scheme = m[1];
  if (scheme === 'data') {
    return (attr === 'src' || attr === 'srcset') && DATA_IMAGE_TAGS.has(tag) && v.startsWith('data:image/');
  }
  return SAFE_SCHEMES.has(scheme);
}

/** srcset: every candidate's URL (first token) must pass; one bad candidate drops the attribute. */
function isSafeSrcset(value: string, tag: string): boolean {
  return value
    .split(',')
    .map((candidate) => candidate.trim().split(/\s+/)[0] ?? '')
    .filter((url) => url !== '')
    .every((url) => isSafeUrl(url, 'srcset', tag));
}

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  const $ = cheerio.load(html, null, false);

  // Remove globally disallowed tags
  $(DISALLOWED_TAGS.join(',')).remove();

  // Strip dangerous elements that can appear inside <svg> blocks
  // Matched on the lowercased tag name: the parser keeps SVG camelCase
  // (foreignObject, animateMotion), which a CSS type selector never matches.
  const svgDenied = new Set(DISALLOWED_SVG_CHILDREN.map((t) => t.toLowerCase()));
  $('svg')
    .find('*')
    .filter((_, el) => svgDenied.has(String((el as any).tagName || '').toLowerCase()))
    .remove();

  // Strip SVG <use> elements that reference external URLs (href/xlink:href)
  $('svg use').each((_, el) => {
    // Dead code today (`use` is removed above); kept as a backstop if it is ever
    // allowed again. Only same-document #fragment references survive.
    const href = ($(el).attr('href') || $(el).attr('xlink:href') || '').replace(URL_IGNORED_CHARS, '');
    if (href !== '' && !href.startsWith('#')) {
      $(el).remove();
    }
  });

  $('*').each((_, node) => {
    const attribs: Record<string, string> = (node as any).attribs || {};
    const tag = String((node as any).tagName || '').toLowerCase();
    for (const attr of Object.keys(attribs)) {
      const value = attribs[attr];
      const lower = attr.toLowerCase();

      // Strip all inline event handlers (onclick, onerror, onload, ...)
      if (lower.startsWith('on')) {
        $(node).removeAttr(attr);
        continue;
      }
      // Neutralise dangerous URL protocols
      if (URL_ATTRS.has(lower) && !(lower === 'srcset' ? isSafeSrcset(value, tag) : isSafeUrl(value, lower, tag))) {
        $(node).removeAttr(attr);
        continue;
      }
      // Block CSS-based script execution
      if (lower === 'style' && /expression\s*\(|javascript:|url\s*\(\s*['"']?\s*javascript:/i.test(value)) {
        $(node).removeAttr(attr);
      }
    }
  });

  return $.html();
}

// ----------------------------------------------------------------------------
// Stricter sanitiser for the mobile app (GET /api/app/news). The app renders
// HTML natively with a small renderer, so only the tags it understands are
// kept; everything else is unwrapped to its text (div, span, figure, …) or
// removed with its content (script, style, iframe, svg, …). Attributes are
// dropped except a[href] (http/https only) and img[src, alt] (http/https only).
// ----------------------------------------------------------------------------

const APP_ALLOWED_TAGS = new Set([
  'p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'a', 'blockquote', 'img',
  'table', 'thead', 'tbody', 'tr', 'td', 'th', 'br', 'hr',
]);

// Removed together with their content: the text inside is not article prose.
const APP_REMOVED_TAGS = [
  'script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'select', 'textarea',
  'link', 'meta', 'base', 'math', 'svg', 'noscript', 'template', 'head', 'title', 'video', 'audio',
  'canvas', 'source', 'track', 'map', 'area',
];

// Headings the renderer does not have are folded into the nearest it has.
const APP_HEADING_MAP: Record<string, string> = { h1: 'h2', h5: 'h4', h6: 'h4' };

function isHttpUrl(value: string | undefined): value is string {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim());
}

export function sanitizeForApp(html: string): string {
  if (!html) return '';
  const $ = cheerio.load(html, null, false);

  $(APP_REMOVED_TAGS.join(',')).remove();

  // Comments anywhere in the fragment.
  $.root()
    .find('*')
    .addBack()
    .contents()
    .each((_, node) => {
      if (node.type === 'comment') $(node).remove();
    });

  // Snapshot first: unwrapping moves children, and the loop must still visit them.
  const elements = $('*')
    .toArray()
    .filter((n): n is Element => n.type === 'tag');
  for (const el of elements) {
    const tag = el.tagName.toLowerCase();
    const mapped = APP_HEADING_MAP[tag];
    if (mapped) {
      el.tagName = mapped;
    } else if (!APP_ALLOWED_TAGS.has(tag)) {
      $(el).replaceWith($(el).contents());
      continue;
    }

    const name = el.tagName.toLowerCase();
    const attribs: Record<string, string> = { ...el.attribs };
    for (const attr of Object.keys(attribs)) $(el).removeAttr(attr);

    if (name === 'a') {
      if (isHttpUrl(attribs.href)) $(el).attr('href', attribs.href.trim());
      else $(el).replaceWith($(el).contents());
    } else if (name === 'img') {
      if (!isHttpUrl(attribs.src)) {
        $(el).remove();
        continue;
      }
      $(el).attr('src', attribs.src.trim());
      if (attribs.alt) $(el).attr('alt', attribs.alt);
    }
  }

  return $.html();
}

// ----------------------------------------------------------------------------
// Extract Q/A pairs from article HTML to emit FAQPage structured data.
// Heuristic: any heading (h2–h4) whose text ends with "?" is a question, and
// the following sibling content until the next heading is the answer.
// ----------------------------------------------------------------------------
export function extractFaqs(html: string): { question: string; answer: string }[] {
  if (!html) return [];
  const faqs: { question: string; answer: string }[] = [];
  try {
    const $ = cheerio.load(html, null, false);
    $('h2, h3, h4').each((_, el) => {
      const question = $(el).text().trim();
      if (!question.endsWith('?') && !question.endsWith('؟')) return;

      const answerParts: string[] = [];
      let next = $(el).next();
      let guard = 0;
      while (next.length && !/^h[1-4]$/i.test(next.prop('tagName') || '') && guard < 6) {
        const text = next.text().trim();
        if (text) answerParts.push(text);
        next = next.next();
        guard++;
      }
      const answer = answerParts.join(' ').trim();
      if (answer) faqs.push({ question, answer });
    });
  } catch {
    return [];
  }
  return faqs.slice(0, 10);
}
