// ============================================================================
// lib/knowledge/adapters/html.ts
// A web page → plain text with heading markers the chunker understands.
//
// This is a sibling of htmlToText in lib/autopilot/sources.ts, not a
// replacement: that one flattens headings and caps at 9,000 chars because it
// feeds a one-shot fact sheet. Here the whole page is the point, and a
// heading path is what makes a chunk citable ("Eligibility > Funding").
// ============================================================================
import * as cheerio from 'cheerio';

export const FETCH_UA = 'VisaRoadsBot/1.0 (+https://visaroads.com/about; knowledge sources)';
const FETCH_TIMEOUT_MS = 20_000;
export const MAX_HTML_CHARS = 400_000;

export type Fetched = { ok: true; status: number; body: Buffer; contentType: string; finalUrl: string } | { ok: false; status: number; error: string };

export async function fetchUrl(url: string, accept = 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8'): Promise<Fetched> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': FETCH_UA, Accept: accept }, signal: ctl.signal, cache: 'no-store', redirect: 'follow' });
    if (!res.ok) {
      const blocked = res.status === 403 || res.status === 503 || res.status === 429;
      return { ok: false, status: res.status, error: blocked ? `blocked by the site (HTTP ${res.status}); it likely sits behind bot protection` : `HTTP ${res.status}` };
    }
    const body = Buffer.from(await res.arrayBuffer());
    return { ok: true, status: res.status, body, contentType: res.headers.get('content-type') ?? '', finalUrl: res.url || url };
  } catch (e) {
    return { ok: false, status: 0, error: e instanceof Error && e.name === 'AbortError' ? 'timed out' : e instanceof Error ? e.message : String(e) };
  } finally {
    clearTimeout(timer);
  }
}

export type Extracted = { title: string; text: string; publishedAt: Date | null; language: string | null };

const date = (s: string | undefined | null) => {
  const d = s ? new Date(s) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
};

export function htmlToStructuredText(html: string): Extracted {
  const $ = cheerio.load(html.slice(0, MAX_HTML_CHARS));
  const title = ($('meta[property="og:title"]').attr('content') || $('title').first().text() || $('h1').first().text() || '').replace(/\s+/g, ' ').trim();
  const publishedAt =
    date($('meta[property="article:published_time"]').attr('content')) ||
    date($('meta[name="date"]').attr('content')) ||
    date($('meta[name="dcterms.modified"]').attr('content')) ||
    date($('time[datetime]').first().attr('datetime'));
  const language = ($('html').attr('lang') || '').slice(0, 2).toLowerCase() || null;

  $('script, style, iframe, noscript, nav, footer, header, aside, form, svg, button, [role="navigation"], [aria-hidden="true"], .sharedaddy, .related, .wp-block-embed, .breadcrumb, .cookie, #cookie').remove();
  $('[hidden], [style*="display:none"], [style*="display: none"]').remove();
  $('a').each((_, el) => {
    $(el).replaceWith($(el).text());
  });

  const extract = (root: ReturnType<typeof $>): string[] => {
    const parts: string[] = [];
    root.find('h1, h2, h3, h4, p, li, td, th, blockquote, pre, dt, dd').each((_, el) => {
      const tag = (el as { tagName?: string }).tagName?.toLowerCase() ?? '';
      // Skip nodes nested inside another collected node (li inside li, p inside blockquote).
      if ($(el).parents('li, blockquote, td, dd').length && tag !== 'li') return;
      const t = $(el).text().replace(/\s+/g, ' ').trim();
      if (t.length < 2) return;
      if (tag === 'h1') parts.push(`# ${t}`);
      else if (tag === 'h2') parts.push(`## ${t}`);
      else if (tag === 'h3' || tag === 'h4') parts.push(`### ${t}`);
      else if (tag === 'li') parts.push(`• ${t}`);
      else parts.push(t);
    });
    return parts;
  };
  const candidates = [...$('article').toArray().map((el) => $(el)), ...$('main').toArray().map((el) => $(el)), $.root()];
  let best: string[] = [];
  let bestProse = 0;
  for (const c of candidates) {
    const parts = extract(c);
    const prose = parts.filter((p) => !p.startsWith('#')).join('').length;
    if (prose > bestProse) {
      best = parts;
      bestProse = prose;
    }
  }
  // Consecutive bullets share a paragraph; everything else is its own.
  const lines: string[] = [];
  for (const p of best) {
    if (p.startsWith('• ') && lines.length && lines[lines.length - 1].startsWith('• ')) lines[lines.length - 1] += `\n${p}`;
    else lines.push(p);
  }
  const text = lines.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
  return { title, text, publishedAt, language };
}
