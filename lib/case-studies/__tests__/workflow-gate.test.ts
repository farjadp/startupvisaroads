// The approval/publish gate (spec §4): pure functions, no DB.
import { describe, it, expect, vi, beforeEach } from 'vitest';

const db = vi.hoisted(() => {
  const fn = () => vi.fn(async (..._args: unknown[]): Promise<any> => null);
  const d = {
    caseStudy: { findMany: fn(), updateMany: fn() },
    consentRecord: { findUnique: fn() },
    setting: { findMany: fn() },
    // Interactive transaction: run the callback against the same mock client.
    $transaction: async (cb: (tx: unknown) => unknown): Promise<unknown> => cb(d),
  };
  return d;
});
vi.mock('@/lib/prisma', () => ({ default: db }));

import { approvalBlockers, publishBlockers, releaseDueCaseStudies, type GateRow } from '@/lib/case-studies/workflow';

const claim = (id: string, verified: boolean, paras = [12]) => ({ id, kind: 'holding', text: 't', paras, quote: 'q', verified });

const fc = (over: Partial<GateRow> = {}): GateRow => ({
  type: 'FC_DECISION',
  status: 'IN_REVIEW',
  claims: JSON.stringify([claim('c1', true), claim('c2', true)]),
  redLines: '[]',
  approvedAt: null,
  consentRecordId: null,
  citation: '2025 FC 12',
  officialUrl: 'https://decisions.fct-cf.gc.ca/fc-cf/decisions/en/item/1/index.do',
  outcome: 'allowed',
  ...over,
});
const client = (over: Partial<GateRow> = {}): GateRow =>
  fc({ type: 'CLIENT_CASE', citation: null, officialUrl: null, outcome: null, consentRecordId: 'k1', ...over });

const ON = { courtPagesClearedByCounsel: true, clientCasesEnabled: true };
const OFF = { courtPagesClearedByCounsel: false, clientCasesEnabled: false };
const liveConsent = { id: 'k1', revokedAt: null };

describe('approvalBlockers', () => {
  it('passes when every claim is checked and has a paragraph', () => {
    expect(approvalBlockers(fc(), null)).toEqual([]);
  });
  it('refuses while a claim is unchecked', () => {
    const r = approvalBlockers(fc({ claims: JSON.stringify([claim('c1', true), claim('c2', false)]) }), null);
    expect(r.join(' ')).toMatch(/1 of 2 claims are not checked/);
  });
  it('refuses with no claims', () => {
    expect(approvalBlockers(fc({ claims: '[]' }), null).join(' ')).toMatch(/no claims/);
  });
  it('refuses an FC claim without a paragraph', () => {
    expect(approvalBlockers(fc({ claims: JSON.stringify([claim('c1', true, [])]) }), null).join(' ')).toMatch(/paragraph/);
  });
  it('refuses on a red-line hit', () => {
    const redLines = JSON.stringify([{ rule: 1, label: 'guarantee', match: 'guaranteed', index: 0 }]);
    expect(approvalBlockers(fc({ redLines }), null).join(' ')).toMatch(/red-line/);
  });
  it('refuses outside IN_REVIEW', () => {
    expect(approvalBlockers(fc({ status: 'DRAFT' }), null).join(' ')).toMatch(/IN_REVIEW/);
  });
  it('client case needs a linked, unrevoked consent', () => {
    expect(approvalBlockers(client(), liveConsent)).toEqual([]);
    expect(approvalBlockers(client({ consentRecordId: null }), null).join(' ')).toMatch(/No consent/);
    expect(approvalBlockers(client(), { id: 'k1', revokedAt: new Date() }).join(' ')).toMatch(/revoked/);
  });
});

describe('publishBlockers', () => {
  const approved = { status: 'APPROVED', approvedAt: new Date() };
  it('counsel switch OFF blocks an FC page', () => {
    expect(publishBlockers(fc(approved), OFF, null).join(' ')).toMatch(/counsel/);
  });
  it('counsel switch ON allows it', () => {
    expect(publishBlockers(fc(approved), ON, null)).toEqual([]);
  });
  it('needs APPROVED and approvedAt', () => {
    expect(publishBlockers(fc(), ON, null).join(' ')).toMatch(/only APPROVED/);
    expect(publishBlockers(fc({ status: 'APPROVED' }), ON, null).join(' ')).toMatch(/Not approved/);
  });
  it('re-checks claims after approval', () => {
    const r = publishBlockers(fc({ ...approved, claims: JSON.stringify([claim('c1', false)]) }), ON, null);
    expect(r.join(' ')).toMatch(/not checked/);
  });
  it('client case blocked while clientCasesEnabled is off', () => {
    const r = publishBlockers(client(approved), { courtPagesClearedByCounsel: true, clientCasesEnabled: false }, liveConsent);
    expect(r.join(' ')).toMatch(/Client cases are switched off/);
  });
  it('client case blocked by a revoked consent even with the switch on', () => {
    expect(publishBlockers(client(approved), ON, liveConsent)).toEqual([]);
    expect(publishBlockers(client(approved), ON, { id: 'k1', revokedAt: new Date() }).join(' ')).toMatch(/revoked/);
  });
  it('release mode wants SCHEDULED', () => {
    expect(publishBlockers(fc({ status: 'SCHEDULED', approvedAt: new Date() }), ON, null, 'release')).toEqual([]);
    expect(publishBlockers(fc(approved), ON, null, 'release').join(' ')).toMatch(/only SCHEDULED/);
  });
});

describe('releaseDueCaseStudies', () => {
  const row = { ...fc({ status: 'SCHEDULED', approvedAt: new Date('2026-11-01') }), id: 'r1', locale: 'en', slug: 'start-up-visa-2025-fc-12' };
  beforeEach(() => {
    [db.caseStudy, db.consentRecord, db.setting].forEach((m) => Object.values(m).forEach((f) => f.mockReset()));
    db.caseStudy.findMany.mockResolvedValue([row]);
    db.caseStudy.updateMany.mockResolvedValue({ count: 1 });
  });

  it('holds a due FC page while the counsel switch is off', async () => {
    db.setting.findMany.mockResolvedValue([]);
    const r = await releaseDueCaseStudies(new Date('2026-11-09'));
    expect(r.released).toEqual([]);
    expect(r.held[0].reasons.join(' ')).toMatch(/counsel/);
    expect(db.caseStudy.updateMany).not.toHaveBeenCalled();
  });

  it('releases it once the switch is on, with a conditional update', async () => {
    db.setting.findMany.mockResolvedValue([{ key: 'caseStudies.courtPagesClearedByCounsel', value: 'true' }]);
    const now = new Date('2026-11-09');
    const r = await releaseDueCaseStudies(now);
    expect(r.released).toEqual(['en/start-up-visa-2025-fc-12']);
    expect(db.caseStudy.updateMany).toHaveBeenCalledWith({
      where: { id: 'r1', status: 'SCHEDULED', approvedAt: { not: null }, publishAt: { lte: now } },
      data: { status: 'PUBLISHED', publishedAt: now },
    });
  });

  it('treats any value other than "true" as off', async () => {
    db.setting.findMany.mockResolvedValue([{ key: 'caseStudies.courtPagesClearedByCounsel', value: 'TRUE' }]);
    expect((await releaseDueCaseStudies()).released).toEqual([]);
  });
});
