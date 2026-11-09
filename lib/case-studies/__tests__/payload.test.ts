import { describe, it, expect } from 'vitest';
import { parseCaseStudyPayload } from '@/lib/case-studies/payload';
import { isValidClientRef, parseConsentInput } from '@/lib/case-studies/consent';

const fcBody = (over: Record<string, unknown> = {}) => ({
  groupKey: '2025-fc-12',
  locale: 'en',
  slug: 'start-up-visa-2025-fc-12',
  type: 'FC_DECISION',
  title: 'Officer ignored the business plan',
  content: '<p onclick="x()">Body <a href="javascript:alert(1)">x</a></p><script>alert(1)</script><p style="color:red">ok</p>',
  citation: '2025 FC 12',
  route: 'start-up-visa',
  outcome: 'allowed',
  officialUrl: 'https://decisions.fct-cf.gc.ca/fc-cf/decisions/en/item/1/index.do',
  decisionDate: '2025-01-06',
  claims: [{ id: 'c1', kind: 'holding', text: 'The decision was unreasonable.', paras: [24], quote: 'unreasonable', verified: true }],
  ...over,
});

describe('parseCaseStudyPayload', () => {
  it('accepts a valid FC payload, forces verified false and sanitises HTML', () => {
    const r = parseCaseStudyPayload(fcBody());
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.payload.claims[0].verified).toBe(false);
    expect(r.payload.content).not.toMatch(/script|onclick|javascript:|style=/);
    expect(r.payload.content).toContain('Body');
    expect(r.payload.country).toBe('canada');
  });

  const bad: [string, Record<string, unknown>][] = [
    ['unknown key', { extra: 1 }],
    ['FC slug without citation pattern', { slug: 'start-up-visa' }],
    ['slug with a surname suffix', { slug: 'start-up-visa-2025-fc-12-shoaie' }],
    ['citation mismatch', { citation: '2025 FC 13' }],
    ['bad citation', { citation: '2025 FCA 12' }],
    ['official URL on another host', { officialUrl: 'https://canlii.org/x' }],
    ['official URL over http', { officialUrl: 'http://decisions.fct-cf.gc.ca/x' }],
    ['missing outcome', { outcome: undefined }],
    ['no claims', { claims: [] }],
    ['claim without paras', { claims: [{ id: 'c1', kind: 'holding', text: 't', paras: [], quote: 'q' }] }],
    ['claim without quote', { claims: [{ id: 'c1', kind: 'holding', text: 't', paras: [3], quote: ' ' }] }],
    ['claim with unknown key', { claims: [{ id: 'c1', kind: 'holding', text: 't', paras: [3], quote: 'q', speaker: 'court' }] }],
    ['bad locale', { locale: 'fr' }],
    ['bad sha', { sourceSha256: 'abc' }],
    ['content only a script', { content: '<script>x</script>' }],
  ];
  for (const [name, over] of bad) {
    it(`rejects ${name}`, () => {
      expect(parseCaseStudyPayload(fcBody(over)).ok).toBe(false);
    });
  }

  it('client case: free slug, no outcome, claims optional', () => {
    const r = parseCaseStudyPayload(
      fcBody({ type: 'CLIENT_CASE', slug: 'founder-approval-story', citation: undefined, officialUrl: undefined, outcome: undefined, claims: [] }),
    );
    expect(r.ok).toBe(true);
  });
});

describe('consent input', () => {
  it('accepts internal refs, rejects names and emails', () => {
    expect(isValidClientRef('VR-2026-014')).toBe(true);
    expect(isValidClientRef('Jane Doe')).toBe(false);
    expect(isValidClientRef('jane@example.com')).toBe(false);
    expect(isValidClientRef('JaneDoe')).toBe(false);
  });
  it('rejects a future signedAt', () => {
    const r = parseConsentInput({ clientRef: 'VR-1', scope: 'en text', signedAt: '2030-01-01' }, new Date('2026-11-09'));
    expect(r.ok).toBe(false);
  });
  it('stores text scope as JSON', () => {
    const r = parseConsentInput({ clientRef: 'VR-1', scope: 'English page only', signedAt: '2026-11-01' }, new Date('2026-11-09'));
    expect(r.ok && JSON.parse(r.input.scope)).toEqual({ text: 'English page only' });
  });
});
