// CASL grace path for /api/unsubscribe: tokenless links from emails sent
// before signed tokens keep working until UNSUBSCRIBE_GRACE_UNTIL, tag the
// contact instead of deleting it, and the sender skips tagged contacts.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const db = vi.hoisted(() => ({
  marketingContact: {
    findMany: vi.fn(async (..._a: unknown[]): Promise<any> => []),
    update: vi.fn(async (..._a: unknown[]): Promise<any> => ({})),
    deleteMany: vi.fn(async (..._a: unknown[]): Promise<any> => ({ count: 1 })),
  },
}));
vi.mock('@/lib/prisma', () => ({ default: db }));

import { NextRequest } from 'next/server';
import { POST as unsubscribe } from '@/app/api/unsubscribe/route';
import { unsubscribeToken } from '@/lib/signed-links';
import {
  UNSUBSCRIBE_GRACE_UNTIL,
  isUnsubscribed,
  maskEmail,
  parseTags,
  selectRecipients,
  withUnsubscribedTag,
} from '@/lib/marketing';

const SECRET = 'test-secret-at-least-16-chars';
const env = { ...process.env };
let ipCounter = 0;

const post = (body: unknown, ip = `10.0.0.${++ipCounter}`) =>
  unsubscribe(
    new NextRequest('http://localhost/api/unsubscribe', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'x-forwarded-for': ip },
    }),
  );

const allWrites = () => [db.marketingContact.update, db.marketingContact.deleteMany];

beforeEach(() => {
  process.env.JWT_SECRET = SECRET;
  Object.values(db.marketingContact).forEach((m) => m.mockClear());
  db.marketingContact.findMany.mockResolvedValue([]);
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-11-20T12:00:00Z'));
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  process.env = { ...env };
});

describe('grace cutoff constant', () => {
  it('is 2027-01-08T23:59:59Z', () => {
    expect(new Date(UNSUBSCRIBE_GRACE_UNTIL).toISOString()).toBe('2027-01-08T23:59:59.000Z');
  });
});

describe('POST /api/unsubscribe, tokenless (grace path)', () => {
  it('before the cutoff: tags every matching contact, never deletes', async () => {
    db.marketingContact.findMany.mockResolvedValue([
      { id: 'c1', tags: '["vip"]' },
      { id: 'c2', tags: ['lead'] },
    ]);
    const res = await post({ email: ' Reader@Example.com ' });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, message: 'Unsubscribed successfully' });
    expect(db.marketingContact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: 'reader@example.com' } }),
    );
    expect(db.marketingContact.update).toHaveBeenCalledWith({ where: { id: 'c1' }, data: { tags: '["vip","unsubscribed"]' } });
    expect(db.marketingContact.update).toHaveBeenCalledWith({ where: { id: 'c2' }, data: { tags: ['lead', 'unsubscribed'] } });
    expect(db.marketingContact.deleteMany).not.toHaveBeenCalled();
  });

  it('treats an empty or null token as tokenless', async () => {
    expect((await post({ email: 'a@b.co', token: '' })).status).toBe(200);
    expect((await post({ email: 'a@b.co', token: null })).status).toBe(200);
    expect(db.marketingContact.deleteMany).not.toHaveBeenCalled();
  });

  it('does not re-tag an already unsubscribed contact', async () => {
    db.marketingContact.findMany.mockResolvedValue([{ id: 'c1', tags: '["unsubscribed"]' }]);
    expect((await post({ email: 'a@b.co' })).status).toBe(200);
    expect(db.marketingContact.update).not.toHaveBeenCalled();
  });

  it('gives the same reply whether or not the address exists', async () => {
    db.marketingContact.findMany.mockResolvedValue([]);
    const absent = await (await post({ email: 'nobody@example.com' })).json();
    db.marketingContact.findMany.mockResolvedValue([{ id: 'c1', tags: '[]' }]);
    const present = await (await post({ email: 'somebody@example.com' })).json();
    expect(absent).toEqual(present);
  });

  it('after the cutoff: 403, no DB access', async () => {
    vi.setSystemTime(new Date(UNSUBSCRIBE_GRACE_UNTIL));
    expect((await post({ email: 'a@b.co' })).status).toBe(403);
    vi.setSystemTime(new Date('2027-03-01T00:00:00Z'));
    expect((await post({ email: 'a@b.co' })).status).toBe(403);
    expect(db.marketingContact.findMany).not.toHaveBeenCalled();
    allWrites().forEach((m) => expect(m).not.toHaveBeenCalled());
  });

  it('rate limits per client IP with 429', async () => {
    const ip = '203.0.113.7';
    for (let i = 0; i < 5; i++) expect((await post({ email: `u${i}@b.co` }, ip)).status).toBe(200);
    const res = await post({ email: 'u6@b.co' }, ip);
    expect(res.status).toBe(429);
    expect(res.headers.get('retry-after')).toBeTruthy();
    expect(db.marketingContact.findMany).toHaveBeenCalledTimes(5);
    expect((await post({ email: 'other@b.co' }, '203.0.113.8')).status).toBe(200);
  });

  it('logs the use without the full email address', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    await post({ email: 'Jane.Doe@Example.com' });
    const lines = [...info.mock.calls, ...log.mock.calls].map((c) => c.join(' '));
    expect(lines.some((l) => l.includes('j***@example.com'))).toBe(true);
    lines.forEach((l) => {
      expect(l.toLowerCase()).not.toContain('jane.doe@example.com');
      expect(l.toLowerCase()).not.toContain('jane.doe');
    });
  });
});

describe('POST /api/unsubscribe, token present', () => {
  it('valid token: deletes as before, no tagging', async () => {
    const res = await post({ email: 'A@B.co', token: unsubscribeToken('a@b.co') });
    expect(res.status).toBe(200);
    expect(db.marketingContact.deleteMany).toHaveBeenCalledWith({ where: { email: 'a@b.co' } });
    expect(db.marketingContact.update).not.toHaveBeenCalled();
  });

  it('invalid token during grace: 403 and no DB access', async () => {
    for (const token of ['garbage', unsubscribeToken('someone-else@b.co'), 123, { x: 1 }]) {
      expect((await post({ email: 'a@b.co', token })).status).toBe(403);
    }
    expect(db.marketingContact.findMany).not.toHaveBeenCalled();
    allWrites().forEach((m) => expect(m).not.toHaveBeenCalled());
  });
});

describe('tag helpers', () => {
  it('parses both tag representations and survives malformed JSON', () => {
    expect(parseTags('["a","b"]')).toEqual(['a', 'b']);
    expect(parseTags(['a', 2, 'b'])).toEqual(['a', 'b']);
    expect(parseTags('not json')).toEqual([]);
    expect(parseTags('{"a":1}')).toEqual([]);
    expect(parseTags(null)).toEqual([]);
    expect(isUnsubscribed('not json')).toBe(false);
    expect(isUnsubscribed('["unsubscribed"]')).toBe(true);
    expect(isUnsubscribed(['unsubscribed'])).toBe(true);
  });

  it('adds the tag in the input representation', () => {
    expect(withUnsubscribedTag('[]')).toBe('["unsubscribed"]');
    expect(withUnsubscribedTag('broken')).toBe('["unsubscribed"]');
    expect(withUnsubscribedTag(['x'])).toEqual(['x', 'unsubscribed']);
  });

  it('masks email for logs', () => {
    expect(maskEmail('jane@example.com')).toBe('j***@example.com');
    expect(maskEmail('noatsign')).toBe('***');
  });
});

describe('campaign recipient selection', () => {
  it('skips contacts tagged unsubscribed, in either tag representation, and dedupes', () => {
    const groups = [
      { group: { contacts: [
        { id: '1', email: 'a@b.co', phone: null, tags: '[]' },
        { id: '2', email: 'gone@b.co', phone: null, tags: '["unsubscribed"]' },
        { id: '3', email: null, phone: '+1555', tags: ['unsubscribed'] },
      ] } },
      { group: { contacts: [
        { id: '1', email: 'a@b.co', phone: null, tags: '[]' },
        { id: '4', email: 'c@b.co', phone: null, tags: 'malformed' },
      ] } },
    ];
    expect(selectRecipients(groups).map((c) => c.id)).toEqual(['1', '4']);
  });
});
