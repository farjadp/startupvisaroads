// Security review fixes (docs/security/case-studies.md): M1 kill switch on
// public reads, L4 switch re-read inside the publish/release transaction, L1
// Content-Type and Origin guard on mutating admin routes. Prisma is mocked.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

type Row = Record<string, unknown>;

const db = vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- loose mock signatures for prisma
  const fn = () => vi.fn(async (..._args: any[]): Promise<any> => null);
  return {
    caseStudy: { findMany: fn(), findFirst: fn(), findUnique: fn(), findUniqueOrThrow: fn(), count: fn(), updateMany: fn() },
    consentRecord: { findUnique: fn() },
    setting: { findMany: fn(), upsert: fn() },
    $transaction: vi.fn(async (cb: (tx: unknown) => unknown): Promise<unknown> => cb(null)),
  };
});
vi.mock('@/lib/prisma', () => ({ default: db }));

import { listPublished, getPublished, getPair, findRedirectTarget, countPublished, listForSitemap } from '@/lib/case-studies/public';
import { releaseDueCaseStudies, transitionCaseStudy } from '@/lib/case-studies/workflow';
import { GET as settingsGet, PUT as settingsPut } from '@/app/api/admin/case-studies/settings/route';
import { signJWT } from '@/lib/auth';

const COUNSEL_ON = [{ key: 'caseStudies.courtPagesClearedByCounsel', value: 'true' }];

const resetDb = () => {
  for (const m of Object.values(db)) {
    if (typeof m === 'function') m.mockReset();
    else Object.values(m).forEach((f) => f.mockReset());
  }
};

/** Just enough of Prisma's where semantics for the clauses public.ts builds. */
function matches(row: Row, where: Row): boolean {
  return Object.entries(where).every(([k, cond]) => {
    const v = row[k];
    if (cond === null) return v === null;
    if (typeof cond === 'object' && !(cond instanceof Date)) {
      const c = cond as { in?: unknown[]; lte?: Date };
      if (c.in) return c.in.includes(v);
      if (c.lte) return v instanceof Date && v.getTime() <= c.lte.getTime();
      return true;
    }
    return v === cond;
  });
}

const base = {
  status: 'PUBLISHED',
  publishedAt: new Date('2026-11-01'),
  withdrawnAt: null,
  supersededById: null,
  sample: false,
  type: 'FC_DECISION',
  route: 'start-up-visa',
  country: 'canada',
  title: 't',
  excerpt: null,
  keyTakeaway: null,
  court: 'Federal Court',
  citation: '2025 FC 12',
  decisionDate: new Date('2025-01-10'),
  outcome: 'allowed',
  officialUrl: null,
  certifiedQuestion: null,
  claims: '[]',
  lessons: '[]',
  faq: '[]',
  updatedAt: new Date('2026-11-01'),
};
const rows: Row[] = [
  { ...base, id: 'en1', groupKey: 'g1', locale: 'en', slug: 'suv-2025-fc-12' },
  { ...base, id: 'fa1', groupKey: 'g1', locale: 'fa', slug: 'suv-fa' },
  // A withdrawn page superseded by the published FC page en1.
  { ...base, id: 'old', groupKey: 'g2', locale: 'en', slug: 'old-page', status: 'WITHDRAWN', withdrawnAt: new Date('2026-11-02'), supersededById: 'en1' },
];

describe('M1: a switch OFF hides published pages from every public read', () => {
  beforeEach(() => {
    resetDb();
    const where = (a: unknown) => (a as { where?: Row }).where ?? {};
    db.caseStudy.findMany.mockImplementation(async (a: unknown) => rows.filter((r) => matches(r, where(a))));
    db.caseStudy.findFirst.mockImplementation(async (a: unknown) => rows.find((r) => matches(r, where(a))) ?? null);
    db.caseStudy.count.mockImplementation(async (a: unknown) => rows.filter((r) => matches(r, where(a))).length);
  });

  it('switch OFF: nothing is listed, served, paired, counted, mapped or redirected to', async () => {
    db.setting.findMany.mockResolvedValue([]);
    expect(await listPublished({ locale: 'en' })).toEqual([]);
    expect(await getPublished('en', 'suv-2025-fc-12')).toBeNull();
    expect(await getPair('g1')).toEqual([]);
    expect(await countPublished('en')).toBe(0);
    expect(await listForSitemap()).toEqual([]);
    expect(await findRedirectTarget('en', 'old-page')).toBeNull(); // superseded: replacement hidden
    expect(await findRedirectTarget('en', 'suv-fa')).toBeNull(); // other-locale twin hidden
    // The rows themselves were not touched.
    expect(db.caseStudy.updateMany).not.toHaveBeenCalled();
  });

  it('the client-case switch alone does not reveal court pages', async () => {
    db.setting.findMany.mockResolvedValue([{ key: 'caseStudies.clientCasesEnabled', value: 'true' }]);
    expect(await listForSitemap()).toEqual([]);
  });

  it('a failed settings read fails closed', async () => {
    db.setting.findMany.mockRejectedValue(new Error('db down'));
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await getPublished('en', 'suv-2025-fc-12')).toBeNull();
    spy.mockRestore();
  });

  it('switch back ON: the same rows are public again', async () => {
    db.setting.findMany.mockResolvedValue(COUNSEL_ON);
    expect((await listPublished({ locale: 'en' })).map((i) => i.slug)).toEqual(['suv-2025-fc-12']);
    expect((await getPublished('en', 'suv-2025-fc-12'))?.id).toBe('en1');
    expect(await getPair('g1')).toHaveLength(2);
    expect(await countPublished('en')).toBe(1);
    expect((await listForSitemap()).map((s) => s.slug).sort()).toEqual(['suv-2025-fc-12', 'suv-fa']);
    expect(await findRedirectTarget('en', 'old-page')).toBe('/en/case-studies/suv-2025-fc-12');
    expect(await findRedirectTarget('en', 'suv-fa')).toBe('/fa/case-studies/suv-fa');
  });
});

describe('L4: publish and release re-read the switches inside the transaction', () => {
  const scheduled = {
    ...base,
    id: 'r1',
    locale: 'en',
    slug: 'suv-2025-fc-12',
    status: 'SCHEDULED',
    approvedAt: new Date('2026-11-01'),
    consentRecordId: null,
    redLines: '[]',
    officialUrl: 'https://decisions.fct-cf.gc.ca/fc-cf/decisions/en/item/1/index.do',
    claims: JSON.stringify([{ id: 'c1', kind: 'holding', text: 't', paras: [3], quote: 'q', verified: true }]),
  };
  // Outside the transaction the switch reads ON; inside it, it has just gone OFF.
  const tx = {
    caseStudy: { updateMany: vi.fn(async () => ({ count: 1 })) },
    consentRecord: { findUnique: vi.fn(async () => null) },
    setting: { findMany: vi.fn(async (): Promise<Row[]> => []) },
  };

  beforeEach(() => {
    resetDb();
    Object.values(tx).forEach((m) => Object.values(m).forEach((f) => f.mockClear()));
    tx.setting.findMany.mockResolvedValue([]);
    db.setting.findMany.mockResolvedValue(COUNSEL_ON);
    db.caseStudy.updateMany.mockResolvedValue({ count: 1 });
    db.$transaction.mockImplementation(async (cb: (t: unknown) => unknown) => cb(tx));
  });

  it('release holds the row when the switch read inside the transaction is OFF', async () => {
    db.caseStudy.findMany.mockResolvedValue([scheduled]);
    const r = await releaseDueCaseStudies(new Date('2026-11-09'));
    expect(r.released).toEqual([]);
    expect(r.held[0].reasons.join(' ')).toMatch(/counsel/);
    expect(tx.setting.findMany).toHaveBeenCalled();
    expect(tx.caseStudy.updateMany).not.toHaveBeenCalled();
    expect(db.caseStudy.updateMany).not.toHaveBeenCalled();
  });

  it('release publishes through the transaction client when the switch is ON inside it', async () => {
    db.caseStudy.findMany.mockResolvedValue([scheduled]);
    tx.setting.findMany.mockResolvedValue(COUNSEL_ON);
    const r = await releaseDueCaseStudies(new Date('2026-11-09'));
    expect(r.released).toEqual(['en/suv-2025-fc-12']);
    expect(tx.caseStudy.updateMany).toHaveBeenCalledTimes(1);
    expect(db.caseStudy.updateMany).not.toHaveBeenCalled();
  });

  it('publish is refused when the switch read inside the transaction is OFF', async () => {
    db.caseStudy.findUnique.mockResolvedValue({ ...scheduled, status: 'APPROVED' });
    const r = await transitionCaseStudy('r1', 'publish', { username: 'farjad' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reasons.join(' ')).toMatch(/counsel/);
    expect(tx.caseStudy.updateMany).not.toHaveBeenCalled();
  });
});

describe('L1: mutating admin routes need JSON and a same-origin Origin', () => {
  const SECRET = 'test-secret-at-least-16-chars';
  const prevJwt = process.env.JWT_SECRET;
  let cookie = '';
  beforeEach(async () => {
    resetDb();
    db.setting.findMany.mockResolvedValue([]);
    process.env.JWT_SECRET = SECRET;
    cookie = `admin_session=${await signJWT({ username: 'farjad', exp: Math.floor(Date.now() / 1000) + 3600 }, SECRET)}`;
  });
  afterEach(() => {
    if (prevJwt === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = prevJwt;
  });
  const url = 'https://www.visaroads.com/api/admin/case-studies/settings';
  const put = (headers: Record<string, string>) =>
    settingsPut(
      new NextRequest(url, {
        method: 'PUT',
        headers: { cookie, host: 'www.visaroads.com', ...headers },
        body: JSON.stringify({ clientCasesEnabled: false }),
      }),
    );

  it('415 without application/json', async () => {
    expect((await put({ 'content-type': 'text/plain' })).status).toBe(415);
    expect(db.setting.upsert).not.toHaveBeenCalled();
  });

  it('403 when Origin names another host', async () => {
    expect((await put({ 'content-type': 'application/json', origin: 'https://evil.visaroads.com' })).status).toBe(403);
    expect((await put({ 'content-type': 'application/json', origin: 'null' })).status).toBe(403);
    expect(db.setting.upsert).not.toHaveBeenCalled();
  });

  it('same-origin JSON passes', async () => {
    const res = await put({ 'content-type': 'application/json; charset=utf-8', origin: 'https://www.visaroads.com' });
    expect(res.status).toBe(200);
    expect(db.setting.upsert).toHaveBeenCalledTimes(1);
  });

  it('GET is unaffected by a foreign Origin and no Content-Type', async () => {
    const res = await settingsGet(new NextRequest(url, { headers: { cookie, origin: 'https://evil.example' } }));
    expect(res.status).toBe(200);
  });
});
