import { describe, it, expect } from 'vitest';
import { chunkText, estimateTokens } from '../chunk';
import { encodeVector, decodeVector, cosine } from '../embed';
import { htmlToStructuredText } from '../adapters/html';

const para = (n: number, word = 'fact') => Array.from({ length: n }, (_, i) => `${word} ${i} is stated here.`).join(' ');

describe('chunkText', () => {
  it('keeps a short document as one chunk with no locator', () => {
    const c = chunkText('Hello.\n\nWorld.');
    expect(c).toHaveLength(1);
    expect(c[0].text).toBe('Hello.\n\nWorld.');
    expect(c[0].locator).toBeNull();
  });

  it('splits on paragraph boundaries around the target size and overlaps', () => {
    const paras = Array.from({ length: 12 }, (_, i) => para(30, `p${i}`));
    const c = chunkText(paras.join('\n\n'), { target: 1500, max: 2000, overlap: 200 });
    expect(c.length).toBeGreaterThan(2);
    for (const ch of c) expect(ch.text.length).toBeLessThanOrEqual(2000 + 200);
    // Overlap: the last paragraph of chunk 0 reappears in chunk 1.
    const tail = c[0].text.split('\n\n').pop()!;
    expect(c[1].text.startsWith(tail)).toBe(true);
    expect(c.map((x) => x.ord)).toEqual(c.map((_, i) => i));
  });

  it('labels PDF pages and heading paths', () => {
    const raw = `# Guide\n\n## Eligibility\n\nYou need two years.\f### Funding\n\nA letter of support.\n\nMore.`;
    const c = chunkText(raw, { target: 40, max: 80, overlap: 0 });
    expect(c[0].locator).toBe('p.1 · Guide > Eligibility');
    expect(c[c.length - 1].locator).toContain('p.2');
    expect(c[c.length - 1].locator).toContain('Funding');
  });

  it('hard-splits a paragraph longer than max on sentence ends', () => {
    const c = chunkText(para(200), { target: 1000, max: 1200, overlap: 0 });
    expect(c.length).toBeGreaterThan(1);
    for (const ch of c) expect(ch.text.length).toBeLessThanOrEqual(1200);
    expect(c[0].text.endsWith('.')).toBe(true);
  });

  it('estimates Persian at fewer chars per token', () => {
    expect(estimateTokens('a'.repeat(400))).toBe(100);
    expect(estimateTokens('ب'.repeat(300))).toBe(100);
  });
});

describe('vectors', () => {
  it('round-trips through bytes and computes cosine', () => {
    const a = [1, 0, 0];
    const b = [0.5, 0.5, 0];
    const da = decodeVector(encodeVector(a));
    const db = decodeVector(encodeVector(b));
    expect(Array.from(da)).toEqual(a);
    expect(cosine(da, db)).toBeCloseTo(Math.SQRT1_2, 5);
    expect(cosine(da, da)).toBeCloseTo(1, 6);
  });
});

describe('htmlToStructuredText', () => {
  it('emits heading markers, bullets, title and date, and drops chrome', () => {
    const html = `<html lang="en"><head><title>Start-up Visa</title><meta property="article:published_time" content="2026-09-01T10:00:00Z"></head>
<body><nav>menu</nav><main><h1>Start-up Visa</h1><h2>Eligibility</h2><p>See <a href="https://x">the rules</a> now.</p><ul><li>Two years</li><li>Letter of support</li></ul><h3>Funding</h3><p>Money.</p></main><footer>f</footer><script>x()</script></body></html>`;
    const out = htmlToStructuredText(html);
    expect(out.title).toBe('Start-up Visa');
    expect(out.publishedAt?.toISOString()).toBe('2026-09-01T10:00:00.000Z');
    expect(out.language).toBe('en');
    expect(out.text).toBe('# Start-up Visa\n\n## Eligibility\n\nSee the rules now.\n\n• Two years\n• Letter of support\n\n### Funding\n\nMoney.');
  });
});
