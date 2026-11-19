// Editing a campaign part-way through, and the who-opened / who-clicked report.
import { describe, it, expect, vi, beforeEach } from 'vitest';

const h = vi.hoisted(() => ({ fake: null as any, session: { username: 'admin' } as { username: string } | null }));

vi.mock('@/lib/prisma', () => ({
  default: new Proxy({}, { get: (_t, key: string) => h.fake.db[key] }),
}));
vi.mock('@/lib/auth', async (original) => ({
  ...(await original<typeof import('@/lib/auth')>()),
  getSessionFromRequest: async () => h.session,
}));

import { NextRequest } from 'next/server';
import { createFakeDb } from './fake-db';
import { updateCampaignContent } from '@/lib/campaign-queue/content';
import { getCampaignLinkReport, getCampaignRecipientReport, getCampaignVersionReport } from '@/lib/campaign-queue/report';
import { PUT as contentPut } from '@/app/api/marketing/campaigns/[id]/content/route';
import { GET as trackClick } from '@/app/api/marketing/track/click/route';
import { clickSignature } from '@/lib/signed-links';

const ctx = { params: Promise.resolve({ id: 'c1' }) };
const edit = { name: 'C', subject: 'New', body: '<p>New</p>', expectedVersion: 1 };

const campaign = (over: Record<string, unknown> = {}) => {
  const row = { id: 'c1', name: 'C', type: 'EMAIL', status: 'PAUSED', subject: 'Old', body: '<p>Old</p>', smsBody: null, contentVersion: 1, ...over };
  h.fake.state.campaigns.push(row);
  return row;
};
const log = (id: string, over: Record<string, unknown> = {}) =>
  h.fake.state.logs.push({
    id, campaignId: 'c1', contactId: id, channel: 'EMAIL', status: 'SENT', sentAt: new Date('2026-11-18T15:00:00Z'),
    openCount: 0, openedAt: null, clickCount: 0, clickedAt: null, clickedUrls: '[]', error: null, contentVersion: null, ...over,
  });
const contact = (id: string, email: string | null) => h.fake.state.contacts.push({ id, email, phone: null, name: null });
const put = (body: unknown, type = 'application/json') =>
  new NextRequest('http://localhost/x', { method: 'PUT', body: JSON.stringify(body), headers: { 'content-type': type } });

beforeEach(() => {
  h.fake = createFakeDb();
  h.session = { username: 'admin' };
  process.env.JWT_SECRET = 'test-secret-at-least-16-chars';
});

describe('updateCampaignContent', () => {
  it.each(['PAUSED', 'SENDING'])('edits a %s campaign, keeping the old version', async (status) => {
    campaign({ status });
    log('a');
    const r = await updateCampaignContent('c1', edit);
    expect(r).toMatchObject({ ok: true, contentVersion: 2 });
    expect(h.fake.state.campaigns[0]).toMatchObject({ subject: 'New', body: '<p>New</p>', contentVersion: 2, status });
    expect(h.fake.state.versions).toEqual([expect.objectContaining({ campaignId: 'c1', version: 1, subject: 'Old', body: '<p>Old</p>' })]);
  });

  it('does not touch what was already sent', async () => {
    campaign();
    log('a', { status: 'SENT' });
    const before = { ...h.fake.state.logs[0] };
    await updateCampaignContent('c1', edit);
    expect(h.fake.state.logs[0]).toEqual(before);
  });

  it('asks for a pause while the campaign is queued', async () => {
    campaign({ status: 'QUEUED' });
    expect(await updateCampaignContent('c1', edit)).toMatchObject({ ok: false, status: 409, error: expect.stringMatching(/pause/i) });
    expect(h.fake.state.campaigns[0].subject).toBe('Old');
  });

  it.each(['DONE', 'FAILED'])('refuses a %s campaign', async (status) => {
    campaign({ status });
    expect(await updateCampaignContent('c1', edit)).toMatchObject({ ok: false, status: 409 });
  });

  it('does not create a version before anyone was sent anything', async () => {
    campaign({ status: 'DRAFT' });
    expect(await updateCampaignContent('c1', edit)).toMatchObject({ ok: true, contentVersion: 1 });
    expect(h.fake.state.versions).toHaveLength(0);
    expect(h.fake.state.campaigns[0].subject).toBe('New');
  });

  it('does not create a version when only the name changes', async () => {
    campaign();
    log('a');
    await updateCampaignContent('c1', { name: 'Renamed', subject: 'Old', body: '<p>Old</p>', expectedVersion: 1 });
    expect(h.fake.state.campaigns[0]).toMatchObject({ name: 'Renamed', contentVersion: 1 });
    expect(h.fake.state.versions).toHaveLength(0);
  });

  it('refuses to overwrite a newer version', async () => {
    campaign({ contentVersion: 2 });
    expect(await updateCampaignContent('c1', edit)).toMatchObject({ ok: false, status: 409 });
  });

  it('leaves everything alone if the campaign is resumed mid-save', async () => {
    campaign();
    log('a');
    const updateMany = h.fake.db.campaign.updateMany;
    h.fake.db.campaign.updateMany = async () => ({ count: 0 });
    expect(await updateCampaignContent('c1', edit)).toMatchObject({ ok: false, status: 409 });
    h.fake.db.campaign.updateMany = updateMany;
    expect(h.fake.state.versions).toHaveLength(0);
  });

  it('requires a subject and body for email and text for SMS', async () => {
    campaign();
    expect((await updateCampaignContent('c1', { ...edit, subject: ' ' })).ok).toBe(false);
    expect((await updateCampaignContent('c1', { ...edit, body: '' })).ok).toBe(false);
    expect((await updateCampaignContent('c1', { ...edit, subject: 'a\nBcc: x@example.com' })).ok).toBe(false);
    h.fake.state.campaigns[0].type = 'SMS';
    expect((await updateCampaignContent('c1', { name: 'C', smsBody: '', expectedVersion: 1 })).ok).toBe(false);
  });
});

describe('content route', () => {
  it('needs an admin session and JSON', async () => {
    campaign();
    h.session = null;
    expect((await contentPut(put(edit), ctx)).status).toBe(401);
    h.session = { username: 'admin' };
    expect((await contentPut(put(edit, 'text/plain'), ctx)).status).toBe(415);
    expect(h.fake.state.campaigns[0].subject).toBe('Old');
    expect((await contentPut(put(edit), ctx)).status).toBe(200);
  });
});

describe('click tracking', () => {
  const click = (logId: string, url: string) =>
    trackClick(new NextRequest(`http://localhost/t?logId=${logId}&url=${encodeURIComponent(url)}&sig=${clickSignature(url)}`));

  it('records every click on a link, per person', async () => {
    log('a');
    await click('a', 'https://example.com/x');
    await click('a', 'https://example.com/x');
    expect(h.fake.state.logs[0].clickCount).toBe(2);
    expect(JSON.parse(h.fake.state.logs[0].clickedUrls)).toEqual(['https://example.com/x']);
    expect(h.fake.state.clicks).toEqual([
      expect.objectContaining({ campaignId: 'c1', logId: 'a', url: 'https://example.com/x' }),
      expect.objectContaining({ campaignId: 'c1', logId: 'a', url: 'https://example.com/x' }),
    ]);
  });

  it('records nothing for a forged link', async () => {
    log('a');
    await trackClick(new NextRequest('http://localhost/t?logId=a&url=https%3A%2F%2Fevil.example&sig=bad'));
    expect(h.fake.state.clicks).toHaveLength(0);
  });
});

describe('reports', () => {
  const X = 'https://example.com/x';
  const Y = 'https://example.com/y';

  beforeEach(() => {
    campaign({ contentVersion: 2 });
    contact('a', 'ann@example.com');
    contact('b', 'bob@example.com');
    log('a', { openCount: 3, openedAt: new Date('2026-11-18T16:00:00Z'), clickCount: 3, clickedUrls: JSON.stringify([X, Y]) });
    log('b', { openCount: 1, clickCount: 1, clickedUrls: JSON.stringify([X]), contentVersion: 2 });
    log('c');
    log('d', { status: 'FAILED', error: 'bad address' });
    h.fake.state.clicks.push(
      { campaignId: 'c1', logId: 'a', url: X }, { campaignId: 'c1', logId: 'a', url: X }, { campaignId: 'c1', logId: 'a', url: Y },
    );
  });

  it('counts people and clicks per link, including clicks from before per-link tracking', async () => {
    expect(await getCampaignLinkReport('c1')).toEqual([
      { url: X, people: 2, clicks: 3 }, // a clicked twice; b's older click counts once
      { url: Y, people: 1, clicks: 1 },
    ]);
  });

  it('keeps older clicks when the person only clicked one link', async () => {
    h.fake.state.logs[1].clickCount = 4;
    h.fake.state.clicks.push({ campaignId: 'c1', logId: 'b', url: X });
    const [first] = await getCampaignLinkReport('c1');
    expect(first).toEqual({ url: X, people: 2, clicks: 6 });
  });

  it.each([
    ['opened', ['a', 'b']],
    ['clicked', ['a', 'b']],
    ['not-opened', ['c']],
    ['failed', ['d']],
    ['all', ['a', 'b', 'c', 'd']],
  ])('filters recipients: %s', async (show, ids) => {
    const r = await getCampaignRecipientReport('c1', { show });
    expect(r.rows.map((x) => x.id).sort()).toEqual(ids);
    expect(r.total).toBe(ids.length);
  });

  it('shows who the person is and what they clicked', async () => {
    const r = await getCampaignRecipientReport('c1', { show: 'clicked', q: 'ANN' });
    expect(r.rows).toHaveLength(1);
    expect(r.rows[0]).toMatchObject({
      recipient: 'ann@example.com', openCount: 3, clickCount: 3, version: 1,
      links: [{ url: X, clicks: 2 }, { url: Y, clicks: 1 }],
    });
  });

  it('keeps the row of a deleted contact', async () => {
    const r = await getCampaignRecipientReport('c1', { show: 'not-opened' });
    expect(r.rows[0].recipient).toBeNull();
  });

  it('pages and survives bad paging input', async () => {
    const r = await getCampaignRecipientReport('c1', { page: '-4', pageSize: 2 });
    expect(r).toMatchObject({ page: 1, pages: 2, total: 4 });
    expect(r.rows).toHaveLength(2);
    expect((await getCampaignRecipientReport('c1', { page: '99', pageSize: 2 })).page).toBe(2);
  });

  it('compares versions', async () => {
    h.fake.state.versions.push({ campaignId: 'c1', version: 1, subject: 'Old', replacedAt: new Date('2026-11-18T17:00:00Z') });
    const r = await getCampaignVersionReport('c1');
    expect(r).toEqual([
      expect.objectContaining({ version: 1, subject: 'Old', sent: 2, opened: 1, clicked: 1 }),
      expect.objectContaining({ version: 2, subject: 'Old', current: true, sent: 1, opened: 1, clicked: 1 }),
    ]);
  });
});
