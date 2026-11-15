import { describe, expect, it } from 'vitest';
import { barChart, barsSvg, pairedBarChart, roomFor } from '@/lib/data-reports/charts';
import { sanitizeHtml } from '@/lib/sanitize';

const rows = [
  { label: 'North Okanagan-Shuswap', value: 548, display: '548', tone: 'highlight' as const },
  { label: 'Claresholm', value: 17, display: '17', note: 'n = 6', tone: 'hollow' as const },
];
const text = { eyebrow: 'October 2026', title: 'Vacancies', caption: 'cap', source: 'Job Bank open data' };

describe('data report charts', () => {
  it('leaves more room after the bars when the value text is long', () => {
    expect(roomFor(['548'], 13)).toBe(96);
    expect(roomFor(['548 vacancies · 237 postings'], 13)).toBeGreaterThan(200);
    expect(roomFor(['x'.repeat(200)], 13)).toBe(240); // never more than 60% of the width
  });

  it('scales bars to the largest value and labels every row for screen readers', () => {
    const svg = barsSvg(rows, 'en');
    expect(svg).toContain('aria-label="North Okanagan-Shuswap: 548 · Claresholm: 17"');
    expect(svg).toContain('width="304"'); // 400 wide minus 96 for the value text
    expect(svg).toContain('stroke-dasharray'); // the hollow bar is a shape, not only a colour
    expect(svg).toContain('n = 6');
  });

  it('mirrors the chart for Persian', () => {
    const svg = barsSvg(rows, 'fa');
    expect(svg).toContain('direction="rtl"');
    expect(svg).toContain('<rect x="96" y="20" width="304"');
  });

  it('escapes text', () => {
    expect(barChart([{ label: '<b>&"', value: 1, display: '1' }], text, 'en')).toContain('&lt;b&gt;&amp;&quot;');
  });

  it('survives the article sanitizer unchanged', () => {
    for (const html of [
      barChart(rows, text, 'fa'),
      pairedBarChart([{ label: 'Mining', a: 1.4, b: 1.9, aDisplay: '1.4%', bDisplay: '1.9%' }], { a: 'Listings', b: 'Postings' }, text, 'en'),
    ]) {
      // cheerio writes <rect></rect> where the renderer wrote <rect/>; nothing else may change.
      expect(sanitizeHtml(html).replace(/><\/rect>/g, '/>')).toBe(html);
    }
  });
});
