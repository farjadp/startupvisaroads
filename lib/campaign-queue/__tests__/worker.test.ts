// The worker, with sendEmail and sendSms mocked: nothing here can reach Resend
// or Twilio. The first describe is the hard requirement from the 18 Nov 2026
// incident: deploying this code must not send anything by itself.
import { describe, it, expect, vi, beforeEach } from 'vitest';

const h = vi.hoisted(() => ({
  fake: null as any,
  sendEmail: vi.fn(),
  sendSms: vi.fn(),
  settings: {} as Record<string, string>,
}));

vi.mock('@/lib/prisma', () => ({
  default: new Proxy({}, { get: (_t, key: string) => h.fake.db[key] }),
}));
vi.mock('@/lib/marketing', async (original) => ({
  ...(await original<typeof import('@/lib/marketing')>()),
  sendEmail: h.sendEmail,
  sendSms: h.sendSms,
  getMarketingSettings: async () => h.settings,
}));

import { createFakeDb } from './fake-db';
import { runCampaignQueue } from '@/lib/campaign-queue/worker';

const WED_1000 = new Date('2026-11-18T15:00:00Z');
const FRI_1000 = new Date('2026-11-20T15:00:00Z');
const THU_1000 = new Date('2026-11-19T15:00:00Z');

const run = (at: Date, over: Record<string, unknown> = {}) =>
  runCampaignQueue({ now: () => at, sendGapMs: 0, ...over });

function campaign(over: Record<string, unknown> = {}) {
  const row = {
    id: 'c1',
    name: 'Campaign',
    type: 'EMAIL',
    status: 'QUEUED',
    subject: 'Hello',
    body: '<p>Hi</p>',
    smsBody: 'Hi',
    dailyLimit: 20,
    sendStartAt: new Date('2026-11-01T00:00:00Z'),
    sendDays: '1,2,3,4',
    sendWindowStart: null,
    sendWindowEnd: null,
    queuedAt: new Date('2026-11-01T00:00:00Z'),
    pausedReason: null,
    leaseId: null,
    leaseUntil: null,
    sentAt: null,
    ...over,
  };
  h.fake.state.campaigns.push(row);
  if (!h.fake.state.campaignGroups.some((g: any) => g.campaignId === row.id)) {
    h.fake.state.campaignGroups.push({ campaignId: row.id, groupId: 'g1' });
  }
  return row;
}

function contact(id: string, over: Record<string, unknown> = {}) {
  const row = {
    id,
    email: `${id}@example.com`,
    phone: null,
    tags: '[]',
    groupId: 'g1',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    ...over,
  };
  h.fake.state.contacts.push(row);
  return row;
}

const contacts = (n: number) => Array.from({ length: n }, (_, i) => contact(`p${String(i).padStart(3, '0')}`));
const legacyLog = (contactId: string, over: Record<string, unknown> = {}) =>
  h.fake.state.logs.push({
    id: `old-${contactId}`,
    campaignId: 'c1',
    contactId,
    channel: 'EMAIL',
    status: 'SENT',
    sentAt: new Date('2026-11-10T15:00:00Z'),
    sendKey: null,
    addressKey: null,
    ...over,
  });
const sentTo = () => h.sendEmail.mock.calls.map(([args]: any[]) => args.to);

beforeEach(() => {
  h.fake = createFakeDb();
  h.sendEmail.mockReset().mockResolvedValue({ data: { id: 'x' }, error: null });
  h.sendSms.mockReset().mockResolvedValue({ sid: 'x' });
  h.settings = {
    marketing_resend_api_key: 're_test',
    marketing_twilio_sid: 'AC',
    marketing_twilio_token: 't',
    marketing_twilio_from: '+15550000000',
    marketing_sender_email: 'hello@example.com',
  };
  process.env.JWT_SECRET = 'test-secret-at-least-16-chars';
});

describe('deploying this code sends nothing', () => {
  it('leaves the interrupted incident campaign alone', async () => {
    const row = campaign({
      status: 'SENDING',
      dailyLimit: null,
      sendStartAt: null,
      sendDays: null,
      queuedAt: null,
    });
    contacts(5);
    const before = { ...row };

    const result = await run(WED_1000);

    expect(h.sendEmail).not.toHaveBeenCalled();
    expect(h.fake.state.logs).toHaveLength(0);
    expect(h.fake.state.campaigns[0]).toEqual(before);
    expect(result.sent).toBe(0);
  });

  it.each(['DRAFT', 'SCHEDULED', 'SENDING', 'PAUSED', 'DONE', 'FAILED'])(
    'ignores a %s campaign even with queue settings',
    async (status) => {
      campaign({ status });
      contacts(3);
      await run(WED_1000);
      expect(h.sendEmail).not.toHaveBeenCalled();
    },
  );

  it.each([
    ['no daily limit', { dailyLimit: null }],
    ['a zero daily limit', { dailyLimit: 0 }],
    ['no queuedAt', { queuedAt: null }],
    ['no send days', { sendDays: null }],
  ])('ignores a QUEUED row with %s', async (_name, over) => {
    campaign(over);
    contacts(3);
    await run(WED_1000);
    expect(h.sendEmail).not.toHaveBeenCalled();
  });
});

describe('pacing', () => {
  it('sends the daily limit over the day and no more', async () => {
    campaign({ dailyLimit: 3, sendWindowStart: 540, sendWindowEnd: 1020 });
    contacts(10);
    for (let i = 0; i < 40; i++) await run(new Date(Date.parse('2026-11-18T13:00:00Z') + i * 15 * 60_000));
    expect(h.sendEmail).toHaveBeenCalledTimes(3);
  });

  it('counts the day in Toronto, not UTC', async () => {
    campaign({ dailyLimit: 5 });
    contacts(10);
    for (let i = 0; i < 5; i++) {
      legacyLog(`p00${i}`, { sentAt: new Date('2026-11-19T04:30:00Z') }); // Wed 23:30 Toronto
    }
    await run(new Date('2026-11-19T04:50:00Z')); // still Wednesday there
    expect(h.sendEmail).not.toHaveBeenCalled();
    await run(new Date('2026-11-19T05:00:00Z')); // Thursday 00:00 there
    expect(h.sendEmail).toHaveBeenCalledTimes(1);
  });

  it('sends only on the send days', async () => {
    campaign();
    contacts(3);
    await run(FRI_1000);
    expect(h.sendEmail).not.toHaveBeenCalled();
    await run(THU_1000);
    expect(h.sendEmail).toHaveBeenCalled();
  });

  it('keeps every campaign under the global ceiling', async () => {
    h.settings.marketing_max_emails_per_day = '2';
    campaign({ id: 'c1', dailyLimit: 500, queuedAt: new Date('2026-11-01T00:00:00Z') });
    campaign({ id: 'c2', dailyLimit: 500, queuedAt: new Date('2026-11-02T00:00:00Z') });
    contacts(10);
    await run(new Date('2026-11-19T04:45:00Z'));
    expect(h.sendEmail).toHaveBeenCalledTimes(2);
  });

  it('stops when the time budget is spent', async () => {
    campaign();
    contacts(5);
    await run(new Date('2026-11-19T04:45:00Z'), { budgetMs: 0 });
    expect(h.sendEmail).not.toHaveBeenCalled();
  });
});

describe('never twice', () => {
  it('resuming skips everyone with any log, including failures', async () => {
    campaign({ dailyLimit: 100 });
    contacts(4);
    legacyLog('p000');
    legacyLog('p001', { status: 'FAILED' });
    legacyLog('p002', { status: 'CLAIMED' });

    for (let i = 0; i < 4; i++) await run(new Date(Date.parse('2026-11-19T04:00:00Z') + i * 15 * 60_000));

    expect(sentTo()).toEqual(['p003@example.com']);
    expect(h.fake.state.campaigns[0].status).toBe('DONE');
  });

  it('two overlapping ticks do not send anything twice', async () => {
    campaign({ dailyLimit: 500 });
    contacts(6);
    const at = new Date('2026-11-19T04:45:00Z');
    await Promise.all([run(at), run(at)]);
    expect(new Set(sentTo()).size).toBe(sentTo().length);
    expect(sentTo().length).toBeGreaterThan(0);
  });

  it('takes over a lease that has expired, but not a live one', async () => {
    campaign({ leaseId: 'other', leaseUntil: new Date(WED_1000.getTime() + 60_000) });
    contacts(2);
    await run(WED_1000);
    expect(h.sendEmail).not.toHaveBeenCalled();
    h.fake.state.campaigns[0].leaseUntil = new Date(WED_1000.getTime() - 1);
    await run(WED_1000);
    expect(h.sendEmail).toHaveBeenCalled();
  });

  it('writes the claim before sending and stops at the database key', async () => {
    campaign();
    contact('a');
    h.sendEmail.mockImplementation(async () => {
      expect(h.fake.state.logs[0]).toMatchObject({ status: 'CLAIMED', sendKey: 'c1:EMAIL:a' });
      return { data: { id: 'x' }, error: null };
    });
    await run(WED_1000);
    expect(h.fake.state.logs[0]).toMatchObject({ status: 'SENT', addressKey: 'c1:EMAIL:a@example.com' });
  });

  it('does not send when another writer already holds the key', async () => {
    campaign();
    contact('a');
    const create = h.fake.db.campaignLog.create;
    h.fake.db.campaignLog.create = async () => {
      throw Object.assign(new Error('unique'), { code: 'P2002' });
    };
    await run(WED_1000);
    h.fake.db.campaignLog.create = create;
    expect(h.sendEmail).not.toHaveBeenCalled();
  });

  it('a crash after claiming costs that one recipient, never a repeat', async () => {
    campaign({ dailyLimit: 100 });
    contacts(2);
    legacyLog('p000', { status: 'CLAIMED', sendKey: 'c1:EMAIL:p000', sentAt: new Date(WED_1000.getTime() - 60_000) });
    await run(WED_1000);
    expect(sentTo()).toEqual(['p001@example.com']);
  });

  it('sends once to an address held by two contacts, in any case', async () => {
    h.fake.state.campaignGroups.push({ campaignId: 'c1', groupId: 'g2' });
    campaign({ dailyLimit: 100 });
    contact('a', { email: 'Same@Example.com' });
    contact('b', { email: ' same@example.com ', groupId: 'g2' });
    for (let i = 0; i < 3; i++) await run(new Date(Date.parse('2026-11-19T04:00:00Z') + i * 15 * 60_000));
    expect(sentTo()).toEqual(['same@example.com']);
    expect(h.fake.state.campaigns[0].status).toBe('DONE');
  });

  it('skips a second contact whose address already got this campaign', async () => {
    campaign({ dailyLimit: 100 });
    contact('a', { email: 'same@example.com' });
    contact('b', { email: 'same@example.com' });
    legacyLog('a');
    await run(WED_1000);
    expect(h.sendEmail).not.toHaveBeenCalled();
  });
});

describe('re-checks at send time', () => {
  it('skips someone who unsubscribes while the batch is running', async () => {
    campaign({ dailyLimit: 500 });
    contacts(2);
    h.sendEmail.mockImplementationOnce(async () => {
      h.fake.state.contacts[1].tags = '["unsubscribed"]';
      return { data: { id: 'x' }, error: null };
    });
    await run(new Date('2026-11-19T04:45:00Z'));
    expect(sentTo()).toEqual(['p000@example.com']);
  });

  it('skips a contact deleted by a signed unsubscribe link', async () => {
    campaign({ dailyLimit: 500 });
    contacts(2);
    h.sendEmail.mockImplementationOnce(async () => {
      h.fake.state.contacts.splice(1, 1);
      return { data: { id: 'x' }, error: null };
    });
    await run(new Date('2026-11-19T04:45:00Z'));
    expect(sentTo()).toEqual(['p000@example.com']);
  });

  it('treats an unsubscribe on a twin contact as covering the address', async () => {
    campaign();
    contact('a', { email: 'same@example.com' });
    contact('b', { email: 'SAME@example.com', tags: '["unsubscribed"]' });
    await run(WED_1000);
    expect(h.sendEmail).not.toHaveBeenCalled();
  });

  it('stops the batch as soon as the campaign is paused', async () => {
    campaign({ dailyLimit: 500 });
    contacts(5);
    h.sendEmail.mockImplementationOnce(async () => {
      h.fake.state.campaigns[0].status = 'PAUSED';
      return { data: { id: 'x' }, error: null };
    });
    await run(new Date('2026-11-19T04:45:00Z'));
    expect(h.sendEmail).toHaveBeenCalledTimes(1);
  });
});

describe('failures', () => {
  it('records an error Resend returns instead of calling it sent', async () => {
    campaign();
    contact('a');
    h.sendEmail.mockResolvedValue({ data: null, error: { name: 'validation_error', message: 'bad address', statusCode: 422 } });
    await run(WED_1000);
    expect(h.fake.state.logs[0]).toMatchObject({ status: 'FAILED', error: expect.stringContaining('bad address') });
    expect(h.fake.state.campaigns[0].status).not.toBe('PAUSED');
  });

  it.each([
    ['invalid key', { name: 'invalid_api_key', message: 'API key is invalid', statusCode: 401 }],
    ['unverified domain', { name: 'validation_error', message: 'The example.com domain is not verified', statusCode: 403 }],
    ['rate limit', { name: 'rate_limit_exceeded', message: 'Too many requests', statusCode: 429 }],
    ['quota', { name: 'daily_quota_exceeded', message: 'Quota reached', statusCode: 429 }],
  ])('pauses on %s, shows why, and keeps the recipient for the resume', async (_name, error) => {
    campaign({ dailyLimit: 500 });
    contacts(5);
    h.sendEmail.mockResolvedValue({ data: null, error });

    const result = await run(new Date('2026-11-19T04:45:00Z'));

    expect(h.sendEmail).toHaveBeenCalledTimes(1);
    expect(h.fake.state.campaigns[0]).toMatchObject({ status: 'PAUSED', leaseId: null });
    expect(h.fake.state.campaigns[0].pausedReason).toContain(error.message);
    expect(h.fake.state.logs).toHaveLength(0);
    expect(result.paused).toEqual(['c1']);
  });

  it('pauses after three failures in a row, across ticks', async () => {
    campaign({ dailyLimit: 100 });
    contacts(6);
    h.sendEmail.mockRejectedValue(new Error('socket hang up'));
    for (let i = 0; i < 6; i++) await run(new Date(Date.parse('2026-11-19T03:00:00Z') + i * 15 * 60_000));
    expect(h.sendEmail).toHaveBeenCalledTimes(3);
    expect(h.fake.state.campaigns[0].status).toBe('PAUSED');
    // A network error may have reached Resend, so these are not retried.
    expect(h.fake.state.logs.map((l: any) => l.status)).toEqual(['FAILED', 'FAILED', 'FAILED']);
  });

  it('pauses without sending when no API key is configured', async () => {
    delete h.settings.marketing_resend_api_key;
    campaign();
    contacts(2);
    await run(WED_1000);
    expect(h.sendEmail).not.toHaveBeenCalled();
    expect(h.fake.state.campaigns[0]).toMatchObject({ status: 'PAUSED' });
    expect(h.fake.state.campaigns[0].pausedReason).toMatch(/Resend/);
  });

  it('one broken campaign does not stop the next', async () => {
    campaign({ id: 'c1', type: 'SMS', queuedAt: new Date('2026-11-01T00:00:00Z') });
    campaign({ id: 'c2', queuedAt: new Date('2026-11-02T00:00:00Z') });
    contact('a', { phone: '+15551112222' });
    delete h.settings.marketing_twilio_sid;
    await run(WED_1000);
    expect(h.sendEmail).toHaveBeenCalled();
  });
});

describe('content and channels', () => {
  it('puts a signed unsubscribe link and tracking on the public site URL', async () => {
    h.settings.marketing_unsubscribe_url = 'admin'; // the autofill value seen in the settings form
    campaign();
    contact('a');
    await run(WED_1000);
    const { html, fromEmail, subject } = h.sendEmail.mock.calls[0][0];
    expect(html).toMatch(/https:\/\/[^"]+\/unsubscribe\?email=a%40example\.com(&amp;|&)token=/);
    expect(html).toContain(`/api/marketing/track/open?logId=${h.fake.state.logs[0].id}`);
    expect(fromEmail).toBe('hello@example.com');
    expect(subject).toBe('Hello');
  });

  it('sends SMS through the same queue', async () => {
    campaign({ type: 'SMS' });
    contact('a', { email: null, phone: '+1 (555) 111-2222' });
    await run(WED_1000);
    expect(h.sendSms).toHaveBeenCalledTimes(1);
    expect(h.sendSms.mock.calls[0][0]).toMatchObject({ to: '+15551112222', body: 'Hi' });
    expect(h.fake.state.logs[0]).toMatchObject({ channel: 'SMS', status: 'SENT' });
  });

  it('marks the campaign done once nobody is left', async () => {
    campaign();
    contact('a');
    await run(WED_1000);
    expect(h.fake.state.campaigns[0]).toMatchObject({ status: 'DONE', leaseId: null });
    expect(h.fake.state.campaigns[0].sentAt).toBeInstanceOf(Date);
  });

  it('releases the lease after a tick', async () => {
    campaign();
    contacts(50);
    await run(WED_1000);
    expect(h.fake.state.campaigns[0]).toMatchObject({ status: 'QUEUED', leaseId: null, leaseUntil: null });
  });
});
