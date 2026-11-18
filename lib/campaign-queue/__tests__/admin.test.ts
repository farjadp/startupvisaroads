// Admin actions and the routes around them. Nothing here reaches a provider.
import { describe, it, expect, vi, beforeEach } from 'vitest';

const h = vi.hoisted(() => ({
  fake: null as any,
  session: { username: 'admin' } as { username: string } | null,
  sendEmail: vi.fn(),
  runQueue: vi.fn(),
  settings: {} as Record<string, string>,
}));

vi.mock('@/lib/prisma', () => ({
  default: new Proxy({}, { get: (_t, key: string) => h.fake.db[key] }),
}));
vi.mock('@/lib/auth', async (original) => ({
  ...(await original<typeof import('@/lib/auth')>()),
  getSessionFromRequest: async () => h.session,
}));
vi.mock('@/lib/marketing', async (original) => ({
  ...(await original<typeof import('@/lib/marketing')>()),
  sendEmail: h.sendEmail,
  getMarketingSettings: async () => h.settings,
}));

import { NextRequest } from 'next/server';
import { createFakeDb } from './fake-db';
import {
  getCampaignQueueSummary,
  pauseCampaign,
  previewCampaignQueue,
  queueCampaign,
} from '@/lib/campaign-queue/admin';
import { GET as queueGet, POST as queuePost } from '@/app/api/marketing/campaigns/[id]/queue/route';
import { POST as legacySend } from '@/app/api/marketing/campaigns/[id]/send/route';
import { DELETE as campaignDelete, PATCH as campaignPatch } from '@/app/api/marketing/campaigns/route';
import { POST as unsubscribe } from '@/app/api/unsubscribe/route';
import { unsubscribeToken } from '@/lib/signed-links';
import { suppressionKey } from '@/lib/campaign-queue/address';

const NOW = new Date('2026-11-18T15:00:00Z');
const input = { dailyLimit: 20, sendDays: [1, 2, 3, 4], windowStart: '09:00', windowEnd: '17:00' };
const ctx = { params: Promise.resolve({ id: 'c1' }) };

const campaign = (over: Record<string, unknown> = {}) => {
  const row = {
    id: 'c1', name: 'C', type: 'EMAIL', status: 'DRAFT', subject: 'S', body: '<p>x</p>', smsBody: null,
    dailyLimit: null, sendStartAt: null, sendDays: null, sendWindowStart: null, sendWindowEnd: null,
    queuedAt: null, pausedReason: null, leaseId: null, leaseUntil: null, sentAt: null, ...over,
  };
  h.fake.state.campaigns.push(row);
  h.fake.state.campaignGroups.push({ campaignId: 'c1', groupId: 'g1' });
  return row;
};
const contacts = (n: number) => {
  for (let i = 0; i < n; i++) {
    h.fake.state.contacts.push({
      id: `p${i}`, email: `p${i}@example.com`, phone: null, tags: '[]', groupId: 'g1', createdAt: new Date(0),
    });
  }
};
const log = (contactId: string, status: string) =>
  h.fake.state.logs.push({ id: `l-${contactId}`, campaignId: 'c1', contactId, channel: 'EMAIL', status, sentAt: new Date('2026-11-10T15:00:00Z'), openCount: 0, clickCount: 0 });
const json = (body: unknown, url = 'http://localhost/api/x', method = 'POST') =>
  new NextRequest(url, { method, body: JSON.stringify(body), headers: { 'content-type': 'application/json' } });

beforeEach(() => {
  h.fake = createFakeDb();
  h.session = { username: 'admin' };
  h.sendEmail.mockReset().mockResolvedValue({ data: { id: 'x' }, error: null });
  h.settings = { marketing_resend_api_key: 're_test', marketing_sender_email: 'hello@example.com', marketing_sender_name: 'VR' };
  process.env.JWT_SECRET = 'test-secret-at-least-16-chars';
});

describe('preview', () => {
  it('states what the confirm step must show and changes nothing', async () => {
    const row = campaign();
    contacts(45);
    const before = { ...row };
    const r = await previewCampaignQueue('c1', input, NOW);
    expect(r).toMatchObject({
      ok: true,
      preview: { remaining: 45, dailyLimit: 20, sendDays: [1, 2, 3, 4], estimatedFinish: '2026-11-23', sender: 'VR <hello@example.com>' },
    });
    expect(h.fake.state.campaigns[0]).toEqual(before);
  });
});

describe('queueCampaign', () => {
  const confirmed = (remaining: number) => ({ ...input, confirm: true, expectedRemaining: remaining });

  it('resumes an interrupted campaign only with explicit settings', async () => {
    campaign({ status: 'SENDING' });
    contacts(3);
    log('p0', 'SENT');
    expect((await queueCampaign('c1', { confirm: true, expectedRemaining: 2 }, NOW)).ok).toBe(false);
    expect(h.fake.state.campaigns[0].status).toBe('SENDING');

    expect((await queueCampaign('c1', confirmed(2), NOW)).ok).toBe(true);
    expect(h.fake.state.campaigns[0]).toMatchObject({ status: 'QUEUED', dailyLimit: 20, sendDays: '1,2,3,4', sendWindowStart: 540, sendWindowEnd: 1020, queuedAt: NOW });
  });

  it('needs the confirm flag', async () => {
    campaign();
    contacts(1);
    expect(await queueCampaign('c1', { ...input, expectedRemaining: 1 }, NOW)).toMatchObject({ ok: false, status: 400 });
    expect(h.fake.state.campaigns[0].status).toBe('DRAFT');
  });

  it('refuses when the audience changed since the confirm screen', async () => {
    campaign();
    contacts(3);
    expect(await queueCampaign('c1', confirmed(2), NOW)).toMatchObject({ ok: false, status: 409 });
  });

  it('needs an explicit yes above 50 a day', async () => {
    campaign();
    contacts(3);
    expect((await queueCampaign('c1', { ...confirmed(3), dailyLimit: 51 }, NOW)).ok).toBe(false);
    expect((await queueCampaign('c1', { ...confirmed(3), dailyLimit: 51, acknowledgeHighVolume: true }, NOW)).ok).toBe(true);
  });

  it.each(['DONE', 'FAILED', 'QUEUED'])('refuses a %s campaign', async (status) => {
    campaign({ status });
    contacts(1);
    expect(await queueCampaign('c1', confirmed(1), NOW)).toMatchObject({ ok: false, status: 409 });
    expect(h.fake.state.campaigns[0].status).toBe(status);
  });

  it('refuses without a Resend key', async () => {
    delete h.settings.marketing_resend_api_key;
    campaign();
    contacts(1);
    expect(await queueCampaign('c1', confirmed(1), NOW)).toMatchObject({ ok: false, status: 422 });
  });

  it('closes an interrupted campaign that has nobody left', async () => {
    campaign({ status: 'SENDING' });
    contacts(1);
    log('p0', 'SENT');
    expect((await queueCampaign('c1', confirmed(0), NOW)).ok).toBe(true);
    expect(h.fake.state.campaigns[0].status).toBe('DONE');
  });

  it('clears the pause reason on resume', async () => {
    campaign({ status: 'PAUSED', pausedReason: 'bad key' });
    contacts(1);
    await queueCampaign('c1', confirmed(1), NOW);
    expect(h.fake.state.campaigns[0]).toMatchObject({ status: 'QUEUED', pausedReason: null });
  });
});

describe('pauseCampaign', () => {
  it('pauses only a queued campaign', async () => {
    campaign({ status: 'QUEUED' });
    expect((await pauseCampaign('c1')).ok).toBe(true);
    expect(h.fake.state.campaigns[0].status).toBe('PAUSED');
    expect(await pauseCampaign('c1')).toMatchObject({ ok: false, status: 409 });
  });
});

describe('summary', () => {
  it('counts from the database, shows Interrupted, and offers no next send', async () => {
    campaign({ status: 'SENDING' });
    contacts(300);
    for (let i = 0; i < 250; i++) log(`p${i}`, 'SENT');
    log('p250', 'FAILED');
    log('p251', 'CLAIMED');
    const s = await getCampaignQueueSummary('c1', NOW);
    expect(s).toMatchObject({ state: 'INTERRUPTED', sent: 250, failed: 1, unconfirmed: 1, remaining: 48, nextSendAt: null });
  });

  it('gives the next send for a queued campaign', async () => {
    campaign({ status: 'QUEUED', dailyLimit: 20, sendDays: '1,2,3,4', sendStartAt: new Date(0), queuedAt: new Date(0) });
    contacts(2);
    const s = await getCampaignQueueSummary('c1', NOW);
    expect(s?.state).toBe('QUEUED');
    expect(s?.nextSendAt).toEqual(NOW);
  });
});

describe('routes', () => {
  it('a signed unsubscribe leaves a suppression for the email and phone', async () => {
    h.fake.state.contacts.push({ id: 'a', email: 'a@example.com', phone: '+1 555 111 2222', tags: '[]', groupId: 'g1', createdAt: new Date(0) });
    const res = await unsubscribe(json({ email: 'a@example.com', token: unsubscribeToken('a@example.com') }));
    expect(res.status).toBe(200);
    expect(h.fake.state.contacts).toHaveLength(0);
    expect(h.fake.state.suppressions.map((r: any) => r.key).sort()).toEqual(
      [suppressionKey('EMAIL', 'a@example.com'), suppressionKey('SMS', '+15551112222')].sort(),
    );
  });

  it('every queue action needs an admin session', async () => {
    h.session = null;
    campaign();
    contacts(1);
    expect((await queueGet(new NextRequest('http://localhost/x'), ctx)).status).toBe(401);
    for (const action of ['preview', 'queue', 'pause']) {
      expect((await queuePost(json({ action, ...input, confirm: true, expectedRemaining: 1 }), ctx)).status).toBe(401);
    }
    expect(h.fake.state.campaigns[0].status).toBe('DRAFT');
  });

  it('rejects an unknown action and a non-JSON body', async () => {
    campaign();
    expect((await queuePost(json({ action: 'send-all' }), ctx)).status).toBe(400);
    const plain = new NextRequest('http://localhost/x', { method: 'POST', body: '{"action":"pause"}', headers: { 'content-type': 'text/plain' } });
    expect((await queuePost(plain, ctx)).status).toBe(415);
  });

  it('the old send endpoint no longer sends a campaign', async () => {
    campaign();
    contacts(2);
    const res = await legacySend(json({}), ctx);
    expect(res.status).toBe(410);
    expect(h.sendEmail).not.toHaveBeenCalled();
    expect(h.fake.state.campaigns[0].status).toBe('DRAFT');
  });

  it('test send still works and writes no log', async () => {
    campaign();
    contacts(2);
    const res = await legacySend(json({ testEmail: 'me@example.com' }), ctx);
    expect(res.status).toBe(200);
    expect(h.sendEmail).toHaveBeenCalledTimes(1);
    expect(h.sendEmail.mock.calls[0][0].to).toBe('me@example.com');
    expect(h.fake.state.logs).toHaveLength(0);
  });

  it('a test send reports the error Resend returns', async () => {
    campaign();
    h.sendEmail.mockResolvedValue({ data: null, error: { name: 'invalid_api_key', message: 'API key is invalid', statusCode: 401 } });
    const res = await legacySend(json({ testEmail: 'me@example.com' }), ctx);
    expect(res.status).toBe(500);
    expect((await res.json()).error).toContain('API key is invalid');
  });

  it('PATCH cannot put a campaign in the queue', async () => {
    campaign();
    const res = await campaignPatch(json({ id: 'c1', status: 'QUEUED' }, 'http://localhost/x', 'PATCH'));
    expect(res.status).toBe(400);
    expect(h.fake.state.campaigns[0].status).toBe('DRAFT');
  });

  it.each(['QUEUED', 'PAUSED', 'SENDING'])('a %s campaign cannot be edited or deleted', async (status) => {
    campaign({ status });
    expect((await campaignPatch(json({ id: 'c1', subject: 'New' }, 'http://localhost/x', 'PATCH'))).status).toBe(409);
    expect((await campaignDelete(json({ id: 'c1' }, 'http://localhost/x', 'DELETE'))).status).toBe(409);
  });
});
