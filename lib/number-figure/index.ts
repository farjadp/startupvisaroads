// ============================================================================
// "The number" figures inside articles: (article HTML, locale) → HTML with
// zero or more figure blocks, each placed right after the paragraph that
// cites its figure to an official source. See extract.ts for the rules.
//
// Off unless NUMBER_FIGURES=1 (the autopilot writer checks numberFiguresOn()).
// ============================================================================

import * as cheerio from 'cheerio';
import { extractFigures, type FigurePlan } from './extract';
import type { Locale } from './numbers';
import { renderFigure } from './render';

export { extractFigures, renderFigure };
export type { FigurePlan };

/** The env switch. Anything but "1"/"true"/"on" keeps the feature off. */
export function numberFiguresOn(env: Record<string, string | undefined> = process.env): boolean {
  return /^(1|true|on)$/i.test((env.NUMBER_FIGURES ?? '').trim());
}

/**
 * Insert up to `max` figures (default 1) after the paragraphs that cite them.
 * Bodies that already carry a figure are returned unchanged, so running the
 * step twice never doubles it.
 */
export function insertNumberFigures(html: string, locale: Locale, max = 1): { html: string; figures: FigurePlan[] } {
  if (!html || html.includes('data-number-figure=')) return { html, figures: [] };
  const plans = extractFigures(html, locale);
  // One figure per paragraph at most.
  const chosen: FigurePlan[] = [];
  for (const p of plans) {
    if (chosen.length >= max) break;
    if (!chosen.some((c) => c.paragraphIndex === p.paragraphIndex)) chosen.push(p);
  }
  if (chosen.length === 0) return { html, figures: [] };

  const $ = cheerio.load(html, null, false);
  const paragraphs = $('p').toArray();
  for (const plan of chosen) $(paragraphs[plan.paragraphIndex]).after(renderFigure(plan, locale));
  return { html: $.html(), figures: chosen };
}
