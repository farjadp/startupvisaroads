// ============================================================================
// Server-side HTML sanitizer (built on cheerio, already a dependency).
// AI/admin generated HTML is rendered via dangerouslySetInnerHTML, so it must
// be stripped of script execution vectors before it ever reaches the DOM.
// ----------------------------------------------------------------------------
// Note: dangerouslySetInnerHTML does not run <script> tags, but it DOES run
// inline event handlers (onerror/onload/...) and `javascript:` URLs. We remove
// all of those, plus dangerous tags. data: URLs are only allowed for images.
// ============================================================================

import * as cheerio from 'cheerio';

const DISALLOWED_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'link', 'meta', 'base', 'svg', 'math'];

function isSafeUrl(value: string, attr: string): boolean {
  const v = value.trim().toLowerCase();
  if (v.startsWith('javascript:') || v.startsWith('vbscript:')) return false;
  if (v.startsWith('data:')) {
    // Only allow inline images, never data:text/html etc.
    return attr === 'src' && v.startsWith('data:image/');
  }
  return true;
}

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  const $ = cheerio.load(html, null, false);

  $(DISALLOWED_TAGS.join(',')).remove();

  $('*').each((_, node) => {
    const attribs: Record<string, string> = (node as any).attribs || {};
    for (const attr of Object.keys(attribs)) {
      const value = attribs[attr];
      const lower = attr.toLowerCase();

      // Strip all inline event handlers (onclick, onerror, onload, ...)
      if (lower.startsWith('on')) {
        $(node).removeAttr(attr);
        continue;
      }
      // Neutralise dangerous URL protocols
      if ((lower === 'href' || lower === 'src' || lower === 'xlink:href' || lower === 'srcset' || lower === 'action' || lower === 'formaction') && !isSafeUrl(value, lower)) {
        $(node).removeAttr(attr);
        continue;
      }
      // Block CSS-based script execution
      if (lower === 'style' && /expression\s*\(|javascript:|url\s*\(\s*['"]?\s*javascript:/i.test(value)) {
        $(node).removeAttr(attr);
      }
    }
  });

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
