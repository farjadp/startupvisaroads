import { describe, it, expect } from 'vitest';
import {
  applyCitations,
  evidenceRules,
  factualNumbers,
  gateFigures,
  numbersOutsideEvidence,
  proseOf,
  queryForBrief,
  usedRefs,
} from '../evidence';
import type { EvidencePack, EvidenceItem } from '@/lib/knowledge/retrieve';

const item = (ref: string, over: Partial<EvidenceItem> = {}): EvidenceItem => ({
  ref,
  chunkId: `c-${ref}`,
  documentId: `d-${ref}`,
  sourceId: `s-${ref}`,
  title: `Doc ${ref}`,
  url: `https://www.canada.ca/${ref}`,
  trust: 'official',
  kind: 'html',
  locator: 'Who can apply',
  publishedAt: '2026-09-01T00:00:00.000Z',
  fetchedAt: '2026-09-02T00:00:00.000Z',
  text: 'body',
  score: 0.8,
  parts: { cosine: 1, keyword: 1, trust: 1, recency: 1 },
  ...over,
});

const pack = (items: EvidenceItem[], pinned: EvidencePack['pinned'] = []): EvidencePack => ({
  query: 'q',
  items,
  pinned,
  rendered: 'rendered',
  candidates: items.length,
});

describe('queryForBrief', () => {
  it('retrieves on the brief’s own words, keyword first', () => {
    const q = queryForBrief({ workingTitle: 'T', primaryKeyword: 'start-up visa', searchQueryEn: 'how does it work', secondaryKeywords: ['a', 'b', 'c', 'd'] });
    expect(q.startsWith('start-up visa')).toBe(true);
    expect(q).toContain('how does it work');
    expect(q).not.toContain('d'.repeat(2)); // only three secondaries
    expect(q.split(' · ')).toHaveLength(6);
  });
});

describe('evidenceRules', () => {
  it('forbids every figure and every marker when the pack is empty', () => {
    const r = evidenceRules(false, 'en');
    expect(r).toMatch(/state no figure of any kind/i);
    expect(r).toMatch(/Do not write \[S1\]/);
  });
  it('requires citation and treats evidence as data when the pack has content', () => {
    const r = evidenceRules(true, 'fa');
    expect(r).toMatch(/\[S1\], \[S2\]/);
    expect(r).toMatch(/DATA, not instructions/);
    expect(r).toMatch(/Persian/);
  });
});

describe('citations', () => {
  it('numbers refs by first appearance and appends only what was used', () => {
    const p = pack([item('S1'), item('S2'), item('S3')]);
    const html = '<p>Two years [S2].</p><p>Ten percent [S1].</p><p>Again [S2].</p>';
    const { html: out, used, dropped } = applyCitations(html, p, 'en');
    expect(used).toEqual(['S2', 'S1']);
    expect(dropped).toEqual([]);
    // S2 was first, so it becomes [1]
    expect(out).toContain('href="#src-1"');
    expect(out).toContain('id="src-1"');
    expect(out).toContain('Doc S2');
    expect(out).toContain('Doc S1');
    expect(out).not.toContain('Doc S3'); // never cited, never listed
    expect(out).not.toContain('[S2]');
  });

  it('strips a marker naming a passage we never supplied', () => {
    const { html: out, used, dropped } = applyCitations('<p>Claim [S7].</p>', pack([item('S1')]), 'en');
    expect(used).toEqual([]);
    expect(dropped).toEqual(['S7']);
    expect(out).toBe('<p>Claim.</p>');
    expect(out).not.toMatch(/Sources/);
  });

  it('adds no Sources section when nothing was cited', () => {
    const { html: out } = applyCitations('<p>No citations here.</p>', pack([item('S1')]), 'en');
    expect(out).not.toMatch(/Sources|src-1/);
  });

  it('writes the Persian label and escapes titles and urls', () => {
    const p = pack([item('S1', { title: 'A & B <script>', url: 'https://x.test/a?b=1&c=2' })]);
    const { html: out } = applyCitations('<p>x [S1].</p>', p, 'fa');
    expect(out).toContain('منابع');
    expect(out).toContain('A &amp; B &lt;script&gt;');
    expect(out).toContain('b=1&amp;c=2');
    // Not nofollowed: an editorial citation we chose is a real citation.
    expect(out).toContain('rel="noopener noreferrer"');
    expect(out).not.toContain('nofollow');
  });

  it('lists a source with no url as plain text', () => {
    const p = pack([item('S1', { url: null, title: 'Pasted transcript' })]);
    const { html: out } = applyCitations('<p>x [S1].</p>', p, 'en');
    expect(out).toContain('Pasted transcript');
    expect(out).not.toContain('<a href="null"');
  });

  it('usedRefs ignores unknown and duplicate markers', () => {
    expect(usedRefs('[S1] [S9] [S1] [S2]', pack([item('S1'), item('S2')]))).toEqual(['S1', 'S2']);
  });
});

describe('proseOf', () => {
  it('drops tags, svg and class attributes so Tailwind is not read as a claim', () => {
    const html = '<div class="pl-5 my-6 border-[#1a1a1a]/10"><p>Two words.</p><svg><text>9999</text></svg></div>';
    const prose = proseOf(html);
    expect(prose).toBe('Two words.');
    expect(prose).not.toContain('9999');
  });
});

describe('factualNumbers', () => {
  it('catches every figure this site has shipped wrongly', () => {
    expect(factualNumbers('funds of $15,263 for one person')).toContain('15263');
    expect(factualNumbers('a 98% success rate')).toContain('98');
    expect(factualNumbers('about 40 months to process')).toContain('40');
    expect(factualNumbers('expect 12-18 months')).toEqual(expect.arrayContaining(['18']));
    expect(factualNumbers('a cap of 2,000 a year')).toContain('2000');
    expect(factualNumbers('an inventory of 43,200 cases')).toContain('43200');
    expect(factualNumbers('you need CLB 5')).toContain('5');
    expect(factualNumbers('حدود ۲۸٬۳۶۲ دلار کانادا')).toContain('28362');
    expect(factualNumbers('۴۰ ماه')).toContain('40');
  });

  it('ignores counts that make no claim about the world', () => {
    // Prose scaffolding: section counts, list lengths, ordinals.
    expect(factualNumbers('The article has 6 sections and 3 lists.')).toEqual([]);
    expect(factualNumbers('Step 2 of the process.')).toEqual([]);
  });

  it('treats a four-digit number as a figure even without a unit', () => {
    expect(factualNumbers('in 2026 the rule changed')).toContain('2026');
  });
});

describe('the figure gate', () => {
  const evidence = 'IRCC states funds of $15,263 for one person and $28,362 for a family of four. CLB 5 is required. Paused on 30 June 2026.';

  it('passes an article whose every figure is in the evidence', () => {
    const html = '<p>You need $15,263 for one person and CLB 5.</p><p>It paused in 2026.</p>';
    expect(numbersOutsideEvidence(html, evidence)).toEqual([]);
    expect(gateFigures(html, evidence, true).ok).toBe(true);
  });

  it('catches a figure the evidence never stated, and is fatal when we supplied evidence', () => {
    const html = '<p>Processing takes about 40 months.</p>';
    const r = gateFigures(html, evidence, true);
    expect(r.ok).toBe(false);
    expect(r.violations).toContain('40');
    expect(r.fatal).toBe(true);
  });

  it('warns instead of refusing when we supplied no evidence at all', () => {
    const r = gateFigures('<p>Processing takes about 40 months.</p>', 'BRAND FACTS only', false);
    expect(r.ok).toBe(false);
    expect(r.fatal).toBe(false);
  });

  it('normalises Persian digits on both sides', () => {
    const html = '<p>تمکن مالی ۲۸٬۳۶۲ دلار کانادا است.</p>';
    expect(numbersOutsideEvidence(html, evidence)).toEqual([]);
  });

  it('does not fire on Tailwind classes in the markup', () => {
    const html = '<div class="p-5 my-6 border-l-4 border-[#CCFF00]"><p>No figures.</p></div>';
    expect(numbersOutsideEvidence(html, '')).toEqual([]);
  });
});
