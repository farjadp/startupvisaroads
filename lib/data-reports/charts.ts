// ============================================================================
// lib/data-reports/charts.ts
// Charts for data reports, drawn as inline SVG inside the article HTML.
//
// Same visual family as "The number" figures (lib/number-figure/render.ts):
// night canvas, paper marks, acid for the one thing to look at, the source
// inside the frame. Tailwind classes only (lib/ is in tailwind.config
// content), written out in full so Tailwind finds them; SVG geometry is
// presentation attributes, which the sanitizer keeps.
//
// Meaning is never carried by colour alone: a hollow bar is a value to read
// with caution (small sample, seasonal), and the caption says which.
// Persian is dir="rtl" with the chart mirrored. The caller passes every
// printed string, so the digits on the page are the report's own.
//
// This file has no imports on purpose: the article build scripts under
// content/agent-articles load it directly with Node.
// ============================================================================

export type ChartLocale = 'en' | 'fa';
export type BarTone = 'plain' | 'highlight' | 'hollow';

export type BarRow = {
  label: string;
  /** Bar length. */
  value: number;
  /** What is printed after the bar. */
  display: string;
  /** Small grey text after the label, e.g. "n = 7". */
  note?: string;
  tone?: BarTone;
};

export type PairRow = {
  label: string;
  a: number;
  b: number;
  aDisplay: string;
  bDisplay: string;
};

export type FigureText = {
  eyebrow: string;
  title: string;
  caption?: string;
  source: string;
};

const PAPER = '#F2F0E9';
const ACID = '#CCFF00';
const MUTED = '#9D9C99';
const W = 400;

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** x for a mark of width w that starts at the reading edge. */
const edge = (rtl: boolean, x: number, w = 0) => (rtl ? W - x - w : x);

const num = (n: number) => n.toFixed(1).replace(/\.0$/, '');

/**
 * Width kept free after the longest bar for its value text. SVG text cannot
 * be measured here, so this is an estimate: about 0.58 em per character, which
 * holds for digits and for both typefaces, plus the gap before the text.
 */
export function roomFor(displays: string[], fontSize: number): number {
  const longest = Math.max(...displays.map((d) => d.length), 0);
  return Math.min(W * 0.6, Math.max(96, Math.ceil(longest * fontSize * 0.58) + 14));
}

function barMark(rtl: boolean, y: number, w: number, tone: BarTone, height = 14): string {
  const x = num(edge(rtl, 0, w));
  if (tone === 'hollow') {
    return `<rect x="${x}" y="${y + 1}" width="${num(Math.max(2, w - 2))}" height="${height - 2}" fill="none" stroke="${PAPER}" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="4 3"/>`;
  }
  const fill = tone === 'highlight' ? `fill="${ACID}"` : `fill="${PAPER}" fill-opacity="0.32"`;
  return `<rect x="${x}" y="${y}" width="${num(w)}" height="${height}" ${fill}/>`;
}

/** Horizontal bars, one row per item: label above, bar and value below. */
export function barsSvg(rows: BarRow[], locale: ChartLocale): string {
  const rtl = locale === 'fa';
  const max = Math.max(...rows.map((r) => r.value), 0) || 1;
  const room = roomFor(rows.map((r) => r.display), 13);
  const rowH = 42;
  const parts: string[] = [];
  rows.forEach((r, i) => {
    const y = i * rowH;
    const tone = r.tone ?? 'plain';
    const w = Math.max(3, ((W - room) * r.value) / max);
    const note = r.note ? `<tspan fill="${MUTED}" font-weight="400" font-size="11" dx="8">${esc(r.note)}</tspan>` : '';
    parts.push(
      `<text x="${edge(rtl, 0)}" y="${y + 13}" fill="${PAPER}" font-size="13" font-weight="700" text-anchor="start">${esc(r.label)}${note}</text>`,
      barMark(rtl, y + 20, w, tone),
      `<text x="${num(edge(rtl, w + 8))}" y="${y + 32}" fill="${tone === 'highlight' ? ACID : PAPER}" font-size="13" font-weight="${tone === 'highlight' ? 700 : 400}" text-anchor="start">${esc(r.display)}</text>`,
    );
  });
  const height = rows.length * rowH - 4;
  const aria = rows.map((r) => `${r.label}: ${r.display}`).join(' · ');
  return `<svg viewBox="0 0 ${W} ${height}" direction="${rtl ? 'rtl' : 'ltr'}" class="block h-auto w-full overflow-visible" role="img" aria-label="${esc(aria)}">${parts.join('')}</svg>`;
}

/** Two bars per row on one shared scale: a (paper) against b (acid). */
export function pairedBarsSvg(rows: PairRow[], legend: { a: string; b: string }, locale: ChartLocale): string {
  const rtl = locale === 'fa';
  const max = Math.max(...rows.flatMap((r) => [r.a, r.b]), 0) || 1;
  const room = roomFor(rows.flatMap((r) => [r.aDisplay, r.bDisplay]), 12);
  const top = 26;
  const rowH = 58;
  const parts: string[] = [
    `<rect x="${edge(rtl, 0, 12)}" y="2" width="12" height="12" fill="${PAPER}" fill-opacity="0.32"/>`,
    `<text x="${edge(rtl, 18)}" y="13" fill="${PAPER}" font-size="12" text-anchor="start">${esc(legend.a)}</text>`,
    `<rect x="${edge(rtl, 200, 12)}" y="2" width="12" height="12" fill="${ACID}"/>`,
    `<text x="${edge(rtl, 218)}" y="13" fill="${PAPER}" font-size="12" text-anchor="start">${esc(legend.b)}</text>`,
  ];
  rows.forEach((r, i) => {
    const y = top + i * rowH;
    const wa = Math.max(3, ((W - room) * r.a) / max);
    const wb = Math.max(3, ((W - room) * r.b) / max);
    parts.push(
      `<text x="${edge(rtl, 0)}" y="${y + 13}" fill="${PAPER}" font-size="13" font-weight="700" text-anchor="start">${esc(r.label)}</text>`,
      barMark(rtl, y + 20, wa, 'plain', 12),
      `<text x="${num(edge(rtl, wa + 8))}" y="${y + 31}" fill="${PAPER}" font-size="12" text-anchor="start">${esc(r.aDisplay)}</text>`,
      barMark(rtl, y + 35, wb, 'highlight', 12),
      `<text x="${num(edge(rtl, wb + 8))}" y="${y + 46}" fill="${ACID}" font-size="12" font-weight="700" text-anchor="start">${esc(r.bDisplay)}</text>`,
    );
  });
  const height = top + rows.length * rowH - 8;
  const aria = rows.map((r) => `${r.label}: ${legend.a} ${r.aDisplay}, ${legend.b} ${r.bDisplay}`).join(' · ');
  return `<svg viewBox="0 0 ${W} ${height}" direction="${rtl ? 'rtl' : 'ltr'}" class="block h-auto w-full overflow-visible" role="img" aria-label="${esc(aria)}">${parts.join('')}</svg>`;
}

/** The frame around a chart: eyebrow, title, optional caption, the chart, the source. */
export function chartFigure(svg: string, text: FigureText, locale: ChartLocale): string {
  const rtl = locale === 'fa';
  const t = rtl
    ? { eyebrow: 'font-vazir text-sm', title: 'font-estedad font-extrabold text-xl leading-relaxed sm:text-2xl', cap: 'font-vazir text-sm leading-loose', src: 'font-vazir text-xs leading-relaxed' }
    : { eyebrow: 'font-sans text-xs uppercase tracking-[0.14em]', title: 'font-serif text-2xl leading-tight sm:text-3xl', cap: 'font-sans text-sm leading-snug', src: 'font-sans text-xs leading-relaxed' };
  const sourceLabel = rtl ? 'منبع' : 'Source';
  return (
    `<figure class="not-prose my-10" data-report-chart="1">` +
    `<div dir="${rtl ? 'rtl' : 'ltr'}" class="flex flex-col gap-4 bg-[#121417] px-6 py-7 text-[#F2F0E9] ${rtl ? 'text-right' : 'text-left'} sm:px-8 sm:py-8">` +
    `<div class="flex items-center justify-between gap-3 ${t.eyebrow} text-[#9D9C99]"><span>${esc(text.eyebrow)}</span><span class="block h-1 w-6 bg-[#CCFF00]" aria-hidden="true"></span></div>` +
    `<span class="${t.title}">${esc(text.title)}</span>` +
    (text.caption ? `<span class="max-w-[60ch] ${t.cap} text-[#9D9C99]">${esc(text.caption)}</span>` : '') +
    `<div class="${rtl ? 'font-vazir' : 'font-sans'} pt-2">${svg}</div>` +
    `<span class="border-t border-[#F2F0E9]/15 pt-4 ${t.src} text-[#9D9C99]">${sourceLabel}: ${esc(text.source)}</span>` +
    `</div></figure>`
  );
}

/** A table wider than the article column scrolls sideways inside this wrapper instead of pushing the page. */
export function scrollTable(tableHtml: string): string {
  return `<div class="my-6 overflow-x-auto">${tableHtml}</div>`;
}

export function barChart(rows: BarRow[], text: FigureText, locale: ChartLocale): string {
  return chartFigure(barsSvg(rows, locale), text, locale);
}

export function pairedBarChart(rows: PairRow[], legend: { a: string; b: string }, text: FigureText, locale: ChartLocale): string {
  return chartFigure(pairedBarsSvg(rows, legend, locale), text, locale);
}
