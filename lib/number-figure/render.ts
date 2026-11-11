// ============================================================================
// "The number", layout B (stacked), as approved on 10 Nov 2026.
// ----------------------------------------------------------------------------
// Night canvas, the figure large in acid, the article's sentence as caption,
// a small chart drawn as inline SVG, the source inside the frame.
// Tailwind classes only (lib/ is in tailwind.config content); SVG geometry is
// presentation attributes, which the sanitizer keeps. Class names are written
// out in full: Tailwind finds classes by reading the source, not by running it. Persian is dir="rtl"
// with the chart mirrored; every printed digit is the article's own.
// ============================================================================

import type { FigurePlan, FigurePoint } from './extract';
import type { Locale } from './numbers';

const PAPER = '#F2F0E9';
const ACID = '#CCFF00';
const MUTED = '#9D9C99';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const W = 400;

/** x for a mark of width w that starts at the reading edge. */
const edge = (rtl: boolean, x: number, w = 0) => (rtl ? W - x - w : x);
/**
 * The SVG carries direction="rtl" for Persian, and in a right-to-left SVG
 * text-anchor "start" is already the right edge. So the reading-edge anchor
 * is "start" in both languages; only x positions are mirrored.
 */
const anchor = (_rtl: boolean, start: boolean) => (start ? 'start' : 'end');

function bars(points: FigurePoint[], rtl: boolean): { body: string; height: number } {
  const max = Math.max(...points.map((p) => p.magnitude));
  const room = 90; // value text after the longest bar
  const row = 44;
  const parts: string[] = [];
  points.forEach((p, i) => {
    const y = i * row;
    const w = Math.max(3, ((W - room) * p.magnitude) / max);
    const fill = p.highlight ? `fill="${ACID}"` : `fill="${PAPER}" fill-opacity="0.28"`;
    parts.push(
      `<text x="${edge(rtl, 0)}" y="${y + 14}" fill="${PAPER}" font-size="13" font-weight="700" text-anchor="${anchor(rtl, true)}">${esc(p.label)}</text>`,
      `<rect x="${edge(rtl, 0, w).toFixed(1)}" y="${y + 21}" width="${w.toFixed(1)}" height="18" ${fill}/>`,
      `<text x="${edge(rtl, w + 8).toFixed(1)}" y="${y + 35}" fill="${p.highlight ? ACID : MUTED}" font-size="${p.highlight ? 14 : 13}" font-weight="${p.highlight ? 700 : 400}" text-anchor="${anchor(rtl, true)}">${esc(p.value)}</text>`,
    );
  });
  return { body: parts.join(''), height: points.length * row };
}

function timeline(points: FigurePoint[], rtl: boolean): { body: string; height: number } {
  const max = Math.max(...points.map((p) => p.magnitude));
  const top = 26;
  const base = 96;
  const pad = 40;
  const step = points.length > 1 ? (W - 2 * pad) / (points.length - 1) : 0;
  const xy = points.map((p, i) => ({ p, x: edge(rtl, pad + i * step), y: base - ((base - top) * p.magnitude) / max }));
  const line = xy.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const parts = [
    `<line x1="0" y1="${base}" x2="${W}" y2="${base}" stroke="${PAPER}" stroke-opacity="0.3" stroke-width="2"/>`,
    `<polyline points="${line}" fill="none" stroke="${PAPER}" stroke-opacity="0.5" stroke-width="2"/>`,
  ];
  for (const c of xy) {
    parts.push(
      `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="${c.p.highlight ? 7 : 5}" fill="${c.p.highlight ? ACID : PAPER}"/>`,
      `<text x="${c.x.toFixed(1)}" y="${(c.y - 14).toFixed(1)}" fill="${c.p.highlight ? ACID : MUTED}" font-size="13" font-weight="${c.p.highlight ? 700 : 400}" text-anchor="middle">${esc(c.p.value)}</text>`,
      `<text x="${c.x.toFixed(1)}" y="${base + 22}" fill="${PAPER}" font-size="12" font-weight="700" text-anchor="middle">${esc(c.p.label)}</text>`,
    );
  }
  return { body: parts.join(''), height: base + 30 };
}

function count(n: number, rtl: boolean): { body: string; height: number } {
  const size = 14;
  const gap = 6;
  const perRow = 20;
  const parts: string[] = [];
  for (let i = 0; i < n; i++) {
    const col = i % perRow;
    const r = Math.floor(i / perRow);
    parts.push(`<rect x="${edge(rtl, col * (size + gap), size)}" y="${r * (size + gap)}" width="${size}" height="${size}" fill="${ACID}"/>`);
  }
  return { body: parts.join(''), height: Math.ceil(n / perRow) * (size + gap) - gap };
}

export function renderFigure(plan: FigurePlan, locale: Locale): string {
  const rtl = locale === 'fa';
  const chart = plan.kind === 'bars' ? bars(plan.points, rtl) : plan.kind === 'timeline' ? timeline(plan.points, rtl) : count(plan.points[0].magnitude, rtl);
  const aria = plan.points.map((p) => (p.label ? `${p.label}: ${p.value}` : p.value)).join(' · ');
  const svg =
    `<svg viewBox="0 0 ${W} ${chart.height}" direction="${rtl ? 'rtl' : 'ltr'}" class="block h-auto w-full overflow-visible" role="img" aria-label="${esc(aria)}">${chart.body}</svg>`;

  const eyebrow = rtl ? 'عدد' : 'The number';
  const sourceLabel = rtl ? 'منبع' : 'Source';
  const t = rtl
    ? { eyebrow: 'font-vazir text-sm', big: 'font-estedad font-extrabold text-5xl leading-tight sm:text-6xl', cap: 'font-vazir text-base leading-loose sm:text-lg', src: 'font-vazir text-xs leading-relaxed' }
    : { eyebrow: 'font-sans text-xs uppercase tracking-[0.14em]', big: 'font-serif text-5xl leading-none sm:text-7xl', cap: 'font-sans text-base leading-snug sm:text-lg', src: 'font-sans text-xs leading-relaxed' };

  return (
    `<figure class="not-prose my-10" data-number-figure="${plan.kind}">` +
    `<div dir="${rtl ? 'rtl' : 'ltr'}" class="flex flex-col gap-5 bg-[#121417] px-6 py-7 text-[#F2F0E9] ${rtl ? 'text-right' : 'text-left'} sm:px-8 sm:py-8">` +
    `<div class="flex items-center justify-between gap-3 ${t.eyebrow} text-[#9D9C99]"><span>${eyebrow}</span><span class="block h-1 w-6 bg-[#CCFF00]" aria-hidden="true"></span></div>` +
    `<span class="${t.big} text-[#CCFF00]">${esc(plan.headline)}</span>` +
    `<span class="max-w-[44ch] ${t.cap}">${esc(plan.caption)}</span>` +
    svg +
    `<span class="border-t border-[#F2F0E9]/15 pt-4 ${t.src} text-[#9D9C99]">${sourceLabel}: ${esc(plan.source)}</span>` +
    `</div></figure>`
  );
}
