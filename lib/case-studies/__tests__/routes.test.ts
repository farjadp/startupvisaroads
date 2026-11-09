// Route handlers for case studies, with prisma mocked: auth, ingest rules,
// and the approve/publish gate as the admin screen sees it.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

const db = vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- loose mock signatures for prisma
  const fn = () => vi.fn(async (..._args: any[]): Promise<any> => null);
  const d = {
    caseStudy: { findUnique: fn(), findUniqueOrThrow: fn(), findMany: fn(), create: fn(), updateMany: fn() },
    consentRecord: { findUnique: fn(), findMany: fn(), create: fn(), update: fn() },
    setting: { findMany: fn(), upsert: fn() },
    $transaction: vi.fn(async (cb: (tx: unknown) => unknown): Promise<any> => null),
  };
  return d;
});
vi.mock('@/lib/prisma', () => ({ default: db }));

import { POST as agentPost, GET as agentGet } from '@/app/api/agent-case-studies/route';
import { GET as adminList } from '@/app/api/admin/case-studies/route';
import { GET as adminGet } from '@/app/api/admin/case-studies/[id]/route';
import { PATCH as claimPatch } from '@/app/api/admin/case-studies/[id]/claims/route';
import { POST as transitionPost } from '@/app/api/admin/case-studies/[id]/transition/route';
import { GET as settingsGet, PUT as settingsPut } from '@/app/api/admin/case-studies/settings/route';
import { GET as consentsGet, POST as consentsPost } from '@/app/api/admin/case-studies/consents/route';
import { POST as revokePost } from '@/app/api/admin/case-studies/consents/[id]/revoke/route';
import { signJWT } from '@/lib/auth';

const SECRET = 'test-secret-at-least-16-chars';
const TOKEN = 'agent-token-for-tests';

const fcBody = (over: Record<string, unknown> = {}) => ({
  groupKey: '2025-fc-12',
  locale: 'en',
  slug: 'start-up-visa-2025-fc-12',
  type: 'FC_DECISION',
  title: 'Officer did not engage with the business plan',
  content: '<p>The Court set the decision aside and sent it back.</p>',
  citation: '2025 FC 12',
  route: 'start-up-visa',
  outcome: 'allowed',
  officialUrl: 'https://decisions.fct-cf.gc.ca/fc-cf/decisions/en/item/1/index.do',
  claims: [
    { id: 'c1', kind: 'holding', text: 'Unreasonable.', paras: [24], quote: 'unreasonable', verified: true },
    { id: 'c2', kind: 'fact', text: 'Plan filed.', paras: [3], quote: 'plan', verified: true },
  ],
  ...over,
});

const req = (url: string, init: { method?: string; body?: unknown; headers?: Record<string, string> } = {}) =>
  new NextRequest(`http://localhost${url}`, {
    method: init.method ?? 'GET',
    headers: init.headers,
    body: init.body === undefined ? undefined : typeof init.body === 'string' ? init.body : JSON.stringify(init.body),
  });
const bearer = (t: string) => ({ authorization: `Bearer ${t}` });
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

let cookie: Record<string, string> = {};

const row = (over: Record<string, unknown> = {}) => ({
  id: 'cs1',
  groupKey: '2025-fc-12',
  locale: 'en',
  slug: 'start-up-visa-2025-fc-12',
  type: 'FC_DECISION',
  status: 'IN_REVIEW',
  title: 't',
  excerpt: null,
  content: '<p>x</p>',
  keyTakeaway: null,
  summaryEn: null,
  court: null,
  citation: '2025 FC 12',
  decisionDate: null,
  judge: null,
  route: 'start-up-visa',
  country: 'canada',
  outcome: 'allowed',
  officialUrl: 'https://decisions.fct-cf.gc.ca/x',
  issues: '[]',
  lessons: '[]',
  claims: JSON.stringify([
    { id: 'c1', kind: 'holding', text: 't', paras: [24], quote: 'q', verified: true },
    { id: 'c2', kind: 'fact', text: 't', paras: [3], quote: 'q', verified: false },
  ]),
  faq: '[]',
  redLines: '[]',
  sourceSha256: null,
  fetchedAt: null,
  certifiedQuestion: null,
  consentRecordId: null,
  aiModel: null,
  sample: false,
  approvedBy: null,
  approvedAt: null,
  publishAt: null,
  publishedAt: null,
  withdrawnAt: null,
  withdrawnReason: null,
  supersededById: null,
  createdAt: new Date('2026-11-01'),
  updatedAt: new Date('2026-11-02'),
  ...over,
});

const env = { jwt: process.env.JWT_SECRET, token: process.env.AGENT_REPORTS_TOKEN, cron: process.env.CRON_SECRET };

beforeEach(async () => {
  process.env.JWT_SECRET = SECRET;
  process.env.AGENT_REPORTS_TOKEN = TOKEN;
  delete process.env.CRON_SECRET;
  for (const model of Object.values(db)) {
    if (typeof model === 'function') model.mockReset();
    else Object.values(model).forEach((f) => f.mockReset());
  }
  db.$transaction.mockImplementation(async (cb: (tx: unknown) => unknown) => cb(db));
  db.setting.findMany.mockResolvedValue([]);
  const session = await signJWT({ username: 'farjad', exp: Math.floor(Date.now() / 1000) + 3600 }, SECRET);
  cookie = { cookie: `admin_session=${session}` };
});
afterEach(() => {
  process.env.JWT_SECRET = env.jwt;
  process.env.AGENT_REPORTS_TOKEN = env.token;
  if (env.cron === undefined) delete process.env.CRON_SECRET;
  else process.env.CRON_SECRET = env.cron;
});

describe('POST /api/agent-case-studies', () => {
  it('401 without a bearer token', async () => {
    const res = await agentPost(req('/api/agent-case-studies', { method: 'POST', body: fcBody() }));
    expect(res.status).toBe(401);
    expect(db.caseStudy.create).not.toHaveBeenCalled();
  });

  it('401 with the wrong bearer token', async () => {
    const res = await agentPost(req('/api/agent-case-studies', { method: 'POST', body: fcBody(), headers: bearer('nope') }));
    expect(res.status).toBe(401);
  });

  it('400 on bad JSON and on an invalid payload', async () => {
    expect((await agentPost(req('/api/agent-case-studies', { method: 'POST', body: '{', headers: bearer(TOKEN) }))).status).toBe(400);
    const res = await agentPost(req('/api/agent-case-studies', { method: 'POST', body: fcBody({ citation: 'x' }), headers: bearer(TOKEN) }));
    expect(res.status).toBe(400);
  });

  it('413 over 400 KB', async () => {
    const res = await agentPost(req('/api/agent-case-studies', { method: 'POST', body: fcBody({ content: 'x'.repeat(400_001) }), headers: bearer(TOKEN) }));
    expect(res.status).toBe(413);
  });

  it('200 with the right token: created IN_REVIEW, every claim unchecked', async () => {
    db.caseStudy.findUnique.mockResolvedValue(null);
    db.caseStudy.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({ ...row(), ...data, id: 'new1' }));
    const res = await agentPost(req('/api/agent-case-studies', { method: 'POST', body: fcBody(), headers: bearer(TOKEN) }));
    expect(res.status).toBe(200);
    const data = db.caseStudy.create.mock.calls[0][0].data;
    expect(data.status).toBe('IN_REVIEW');
    expect(JSON.parse(data.claims).every((c: { verified: boolean }) => c.verified === false)).toBe(true);
    expect(data.approvedAt).toBeNull();
    const json = await res.json();
    expect(json).toMatchObject({ ok: true, id: 'new1', status: 'IN_REVIEW', created: true, claimsTotal: 2, claimsChecked: 0 });
  });

  it('stores red-line hits found in the text', async () => {
    db.caseStudy.findUnique.mockResolvedValue(null);
    db.caseStudy.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({ ...row(), ...data }));
    await agentPost(req('/api/agent-case-studies', {
      method: 'POST',
      body: fcBody({ keyTakeaway: 'We guarantee your visa will be approved.' }),
      headers: bearer(TOKEN),
    }));
    expect(JSON.parse(db.caseStudy.create.mock.calls[0][0].data.redLines).length).toBeGreaterThan(0);
  });

  it('repost of an APPROVED case is 409 and changes nothing', async () => {
    db.caseStudy.findUnique.mockResolvedValue({ id: 'cs1', status: 'APPROVED' });
    const res = await agentPost(req('/api/agent-case-studies', { method: 'POST', body: fcBody(), headers: bearer(TOKEN) }));
    expect(res.status).toBe(409);
    expect(db.caseStudy.updateMany).not.toHaveBeenCalled();
    expect(db.caseStudy.create).not.toHaveBeenCalled();
  });

  it('repost while IN_REVIEW replaces the row and resets the ticks', async () => {
    db.caseStudy.findUnique.mockResolvedValue({ id: 'cs1', status: 'IN_REVIEW' });
    db.caseStudy.updateMany.mockResolvedValue({ count: 1 });
    db.caseStudy.findUniqueOrThrow.mockResolvedValue(row());
    const res = await agentPost(req('/api/agent-case-studies', { method: 'POST', body: fcBody(), headers: bearer(TOKEN) }));
    expect(res.status).toBe(200);
    const call = db.caseStudy.updateMany.mock.calls[0][0];
    expect(call.where).toEqual({ id: 'cs1', status: { in: ['DRAFT', 'IN_REVIEW'] } });
    expect(JSON.parse(call.data.claims).some((c: { verified: boolean }) => c.verified)).toBe(false);
  });

  it('GET lists review rows with the token, 401 without', async () => {
    expect((await agentGet(req('/api/agent-case-studies'))).status).toBe(401);
    db.caseStudy.findMany.mockResolvedValue([]);
    expect((await agentGet(req('/api/agent-case-studies', { headers: bearer(TOKEN) }))).status).toBe(200);
  });
});

describe('admin routes require a session', () => {
  const calls: [string, () => Promise<Response>][] = [
    ['list', () => adminList(req('/api/admin/case-studies'))],
    ['get', () => adminGet(req('/api/admin/case-studies/cs1'), ctx('cs1'))],
    ['claims', () => claimPatch(req('/x', { method: 'PATCH', body: { claimId: 'c1', verified: true } }), ctx('cs1'))],
    ['transition', () => transitionPost(req('/x', { method: 'POST', body: { action: 'approve' } }), ctx('cs1'))],
    ['settings GET', () => settingsGet(req('/x'))],
    ['settings PUT', () => settingsPut(req('/x', { method: 'PUT', body: { courtPagesClearedByCounsel: true } }))],
    ['consents GET', () => consentsGet(req('/x'))],
    ['consents POST', () => consentsPost(req('/x', { method: 'POST', body: { clientRef: 'VR-1', scope: 's', signedAt: '2026-11-01' } }))],
    ['revoke', () => revokePost(req('/x', { method: 'POST', body: { reason: 'r' } }), ctx('k1'))],
  ];
  for (const [name, call] of calls) {
    it(`${name}: 401 without a session, no DB access`, async () => {
      const res = await call();
      expect(res.status).toBe(401);
      expect(db.caseStudy.findUnique).not.toHaveBeenCalled();
      expect(db.caseStudy.updateMany).not.toHaveBeenCalled();
      expect(db.setting.upsert).not.toHaveBeenCalled();
      expect(db.consentRecord.create).not.toHaveBeenCalled();
    });
  }
  it('the agent token does not open admin routes', async () => {
    expect((await adminList(req('/api/admin/case-studies', { headers: bearer(TOKEN) }))).status).toBe(401);
  });
});

describe('admin transitions', () => {
  const post = (body: unknown) => transitionPost(req('/x', { method: 'POST', body, headers: cookie }), ctx('cs1'));

  it('approve is 409 with reasons while a claim is unchecked', async () => {
    db.caseStudy.findUnique.mockResolvedValue(row());
    const res = await post({ action: 'approve' });
    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.reasons.join(' ')).toMatch(/1 of 2 claims are not checked/);
    expect(db.caseStudy.updateMany).not.toHaveBeenCalled();
  });

  it('approve succeeds once every claim is checked, recording the session user', async () => {
    const checked = row({ claims: JSON.stringify([{ id: 'c1', kind: 'holding', text: 't', paras: [24], quote: 'q', verified: true }]) });
    db.caseStudy.findUnique.mockResolvedValue(checked);
    db.caseStudy.updateMany.mockResolvedValue({ count: 1 });
    db.caseStudy.findUniqueOrThrow.mockResolvedValue({ ...checked, status: 'APPROVED' });
    const res = await post({ action: 'approve' });
    expect(res.status).toBe(200);
    const call = db.caseStudy.updateMany.mock.calls[0][0];
    expect(call.where).toMatchObject({ id: 'cs1', status: 'IN_REVIEW' });
    expect(call.data).toMatchObject({ status: 'APPROVED', approvedBy: 'farjad' });
  });

  it('publish is 409 while the counsel switch is off', async () => {
    const approved = row({
      status: 'APPROVED',
      approvedAt: new Date(),
      claims: JSON.stringify([{ id: 'c1', kind: 'holding', text: 't', paras: [24], quote: 'q', verified: true }]),
    });
    db.caseStudy.findUnique.mockResolvedValue(approved);
    const res = await post({ action: 'publish' });
    expect(res.status).toBe(409);
    expect((await res.json()).reasons.join(' ')).toMatch(/counsel/);
    expect(db.caseStudy.updateMany).not.toHaveBeenCalled();
  });

  it('publish with the switch on uses the conditional update', async () => {
    const approved = row({
      status: 'APPROVED',
      approvedAt: new Date(),
      claims: JSON.stringify([{ id: 'c1', kind: 'holding', text: 't', paras: [24], quote: 'q', verified: true }]),
    });
    db.caseStudy.findUnique.mockResolvedValue(approved);
    db.setting.findMany.mockResolvedValue([{ key: 'caseStudies.courtPagesClearedByCounsel', value: 'true' }]);
    db.caseStudy.updateMany.mockResolvedValue({ count: 1 });
    db.caseStudy.findUniqueOrThrow.mockResolvedValue({ ...approved, status: 'PUBLISHED' });
    const res = await post({ action: 'publish' });
    expect(res.status).toBe(200);
    expect(db.caseStudy.updateMany.mock.calls[0][0].where).toMatchObject({ id: 'cs1', status: 'APPROVED', approvedAt: { not: null } });
  });

  it('withdraw needs a reason', async () => {
    db.caseStudy.findUnique.mockResolvedValue(row());
    expect((await post({ action: 'withdraw' })).status).toBe(400);
  });

  it('unknown action is 400', async () => {
    expect((await post({ action: 'delete' })).status).toBe(400);
  });
});

describe('claim ticks', () => {
  const patch = (body: unknown) => claimPatch(req('/x', { method: 'PATCH', body, headers: cookie }), ctx('cs1'));

  it('ticks a claim while IN_REVIEW', async () => {
    db.caseStudy.findUnique.mockResolvedValue(row());
    db.caseStudy.updateMany.mockResolvedValue({ count: 1 });
    const res = await patch({ claimId: 'c2', verified: true });
    expect(await res.json()).toEqual({ ok: true, claimsChecked: 2, claimsTotal: 2 });
  });
  it('409 outside IN_REVIEW', async () => {
    db.caseStudy.findUnique.mockResolvedValue(row({ status: 'APPROVED' }));
    expect((await patch({ claimId: 'c2', verified: true })).status).toBe(409);
  });
  it('404 for an unknown claim', async () => {
    db.caseStudy.findUnique.mockResolvedValue(row());
    expect((await patch({ claimId: 'zz', verified: true })).status).toBe(404);
  });
});

describe('consents', () => {
  it('revoking withdraws every linked case in one transaction', async () => {
    db.consentRecord.findUnique.mockResolvedValue({ id: 'k1', revokedAt: null });
    db.caseStudy.updateMany.mockResolvedValue({ count: 2 });
    const res = await revokePost(req('/x', { method: 'POST', body: { reason: 'client asked' }, headers: cookie }), ctx('k1'));
    expect(await res.json()).toEqual({ ok: true, withdrawn: 2 });
    expect(db.$transaction).toHaveBeenCalledTimes(1);
    expect(db.caseStudy.updateMany.mock.calls[0][0]).toMatchObject({
      where: { consentRecordId: 'k1', status: { not: 'WITHDRAWN' } },
      data: { status: 'WITHDRAWN' },
    });
  });
  it('rejects a clientRef that looks like a name', async () => {
    const res = await consentsPost(req('/x', { method: 'POST', body: { clientRef: 'Jane Doe', scope: 's', signedAt: '2026-11-01' }, headers: cookie }));
    expect(res.status).toBe(400);
    expect(db.consentRecord.create).not.toHaveBeenCalled();
  });
  it('records recordedBy from the session', async () => {
    db.consentRecord.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({ id: 'k2', ...data }));
    const res = await consentsPost(req('/x', { method: 'POST', body: { clientRef: 'VR-2026-014', scope: 's', signedAt: '2026-11-01' }, headers: cookie }));
    expect(res.status).toBe(200);
    expect(db.consentRecord.create.mock.calls[0][0].data.recordedBy).toBe('farjad');
  });
});

describe('settings', () => {
  it('defaults both switches off', async () => {
    expect(await (await settingsGet(req('/x', { headers: cookie }))).json()).toEqual({ courtPagesClearedByCounsel: false, clientCasesEnabled: false });
  });
  it('rejects a non-boolean', async () => {
    expect((await settingsPut(req('/x', { method: 'PUT', body: { clientCasesEnabled: 'yes' }, headers: cookie }))).status).toBe(400);
  });
});
