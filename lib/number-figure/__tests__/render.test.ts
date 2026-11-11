import { describe, expect, it } from 'vitest';
import * as cheerio from 'cheerio';
import { extractFigures, insertNumberFigures, numberFiguresOn, renderFigure } from '..';
import { sanitizeHtml } from '@/lib/sanitize';
import { EN_LEVELS, EN_UNCITED, FA_LEVELS, autopilotBody } from './fixtures';

const OFFICIAL = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html';

const figureOf = (html: string) => cheerio.load(html, null, false)('figure[data-number-figure]');

describe('renderFigure — English', () => {
  const plan = extractFigures(autopilotBody(OFFICIAL), 'en')[0];
  const $ = cheerio.load(renderFigure(plan, 'en'), null, false);

  it('is layout B: eyebrow, big number, caption, chart, source, in that order, left to right', () => {
    const frame = $('figure > div');
    expect(frame.attr('dir')).toBe('ltr');
    expect(frame.attr('class')).toContain('bg-[#121417]');
    const parts = frame.children().toArray().map((el) => (el as { tagName: string }).tagName);
    expect(parts).toEqual(['div', 'span', 'span', 'svg', 'span']);
    expect(frame.children().eq(0).text()).toBe('The number');
    expect(frame.children().eq(1).text()).toBe('34 months');
    expect(frame.children().eq(1).attr('class')).toContain('text-[#CCFF00]');
    expect(frame.children().eq(2).text()).toBe(plan.caption);
    expect(frame.children().eq(4).text()).toBe('Source: Proof of citizenship: processing times, 2026-10-19');
  });

  it('draws one bar per point, to scale, with only the new value in acid', () => {
    const rects = $('svg rect').toArray().map((r) => ({ w: Number($(r).attr('width')), x: Number($(r).attr('x')), fill: $(r).attr('fill') }));
    expect(rects).toHaveLength(2);
    expect(rects.map((r) => r.fill)).toEqual(['#F2F0E9', '#CCFF00']);
    expect(rects.every((r) => r.x === 0)).toBe(true);
    expect(rects[0].w / rects[1].w).toBeCloseTo(5 / 34, 2);
    expect($('svg text').toArray().map((t) => $(t).text())).toEqual(['Before the new law', 'five months', 'October 2026', '34 months']);
  });

  it('uses no inline styles and no image', () => {
    expect($.html()).not.toMatch(/style=|<img/);
  });
});

describe('renderFigure — Persian', () => {
  const plan = extractFigures(FA_LEVELS, 'fa')[0];
  const html = renderFigure(plan, 'fa');
  const $ = cheerio.load(html, null, false);

  it('runs right to left in the Persian faces', () => {
    const frame = $('figure > div');
    expect(frame.attr('dir')).toBe('rtl');
    expect(frame.attr('class')).toContain('text-right');
    expect(frame.children().eq(0).text()).toBe('عدد');
    expect(frame.children().eq(1).attr('class')).toContain('font-estedad');
    expect(frame.children().eq(4).text()).toBe('منبع: بودجه ۲۰۲۶، نمودار ۳٫۱، داده IRCC تا ۳۱ اوت ۲۰۲۶');
  });

  it('prints Persian digits only', () => {
    const visible = [frame($), ...$('svg text').toArray().map((t) => $(t).text())].join(' ');
    expect(visible).toMatch(/[۰-۹]/);
    expect(visible).not.toMatch(/[0-9]/);
    function frame(q: cheerio.CheerioAPI) {
      return q('figure > div > span').toArray().map((s) => q(s).text()).join(' ');
    }
  });

  it('mirrors the chart: bars grow from the right edge', () => {
    const rects = $('svg rect').toArray().map((r) => Number($(r).attr('x')) + Number($(r).attr('width')));
    expect(rects).toHaveLength(3);
    for (const right of rects) expect(right).toBeCloseTo(400, 1);
    // In a right-to-left SVG "start" is the right edge (anchoring "end" put
    // the labels off the canvas on 10 Nov).
    expect($('svg').attr('direction')).toBe('rtl');
    expect($('svg text').first().attr('text-anchor')).toBe('start');
    expect(Number($('svg text').first().attr('x'))).toBe(400);
  });
});

describe('insertNumberFigures', () => {
  it('puts the figure right after the paragraph that cites it', () => {
    const body = `<p>Intro.</p>${EN_LEVELS}<p>After.</p>`;
    const { html, figures } = insertNumberFigures(body, 'en');
    expect(figures).toHaveLength(1);
    const $ = cheerio.load(html, null, false);
    const fig = $('figure[data-number-figure]');
    expect(fig.prev().text()).toContain('971,815');
    expect(fig.next().text()).toBe('After.');
    expect(fig.children('div').children('span').first().text()).toBe('370,000');
  });

  it('adds nothing to an article without official, cited figures', () => {
    const body = `<p>Intro.</p>${EN_UNCITED}`;
    expect(insertNumberFigures(body, 'en')).toEqual({ html: body, figures: [] });
  });

  it('adds one figure by default and never twice', () => {
    const once = insertNumberFigures(FA_LEVELS, 'fa');
    expect(figureOf(once.html)).toHaveLength(1);
    const twice = insertNumberFigures(once.html, 'fa');
    expect(twice.html).toBe(once.html);
    expect(figureOf(insertNumberFigures(`${EN_LEVELS}<p>x</p>${autopilotBody(OFFICIAL)}`, 'en', 3).html)).toHaveLength(2);
  });

  it('survives the article sanitizer intact', () => {
    const { html } = insertNumberFigures(autopilotBody(OFFICIAL), 'en');
    const clean = sanitizeHtml(html);
    const fig = figureOf(clean);
    expect(fig).toHaveLength(1);
    expect(fig.find('svg rect')).toHaveLength(2);
    expect(fig.find('svg text')).toHaveLength(4);
    expect(clean).toMatch(/viewBox="0 0 400 88"/);
  });
});

describe('the env switch', () => {
  it('is off unless NUMBER_FIGURES is 1, true or on', () => {
    expect(numberFiguresOn({})).toBe(false);
    expect(numberFiguresOn({ NUMBER_FIGURES: '' })).toBe(false);
    expect(numberFiguresOn({ NUMBER_FIGURES: '0' })).toBe(false);
    expect(numberFiguresOn({ NUMBER_FIGURES: 'yes please' })).toBe(false);
    expect(numberFiguresOn({ NUMBER_FIGURES: '1' })).toBe(true);
    expect(numberFiguresOn({ NUMBER_FIGURES: 'true' })).toBe(true);
    expect(numberFiguresOn({ NUMBER_FIGURES: 'ON' })).toBe(true);
  });
});
