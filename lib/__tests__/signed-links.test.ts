import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const db = vi.hoisted(() => ({
  campaignLog: {
    findUnique: vi.fn(async (..._a: unknown[]): Promise<any> => ({ id: 'log1', clickedUrls: '[]', clickedAt: null })),
    update: vi.fn(async (..._a: unknown[]): Promise<any> => ({})),
  },
  marketingContact: { deleteMany: vi.fn(async (..._a: unknown[]): Promise<any> => ({ count: 1 })) },
}));
vi.mock('@/lib/prisma', () => ({ default: db }));

import { NextRequest } from 'next/server';
import {
  buildUnsubscribeUrl,
  clickSignature,
  resolveClickTarget,
  unsubscribeToken,
  verifyUnsubscribeToken,
} from '@/lib/signed-links';
import { GET as click } from '@/app/api/marketing/track/click/route';
import { POST as unsubscribe } from '@/app/api/unsubscribe/route';

const SECRET = 'test-secret-at-least-16-chars';
const env = { ...process.env };

beforeEach(() => {
  process.env.JWT_SECRET = SECRET;
  delete process.env.LINK_SIGNING_SECRET;
  db.campaignLog.findUnique.mockClear();
  db.campaignLog.update.mockClear();
  db.marketingContact.deleteMany.mockClear();
});
afterEach(() => {
  process.env = { ...env };
});

describe('click tracker redirect allowlist', () => {
  it.each([
    ['/en/blog', 'https://visaroads.com/en/blog'],
    ['https://visaroads.com/fa', 'https://visaroads.com/fa'],
    ['https://app.visaroads.com/x', 'https://app.visaroads.com/x'],
  ])('allows own target %s', (raw, expected) => {
    expect(resolveClickTarget(raw, null)?.href).toBe(expected);
  });

  it.each([
    'https://evil.example/phish',
    '//evil.example/x',
    '/\\evil.example/x',
    'https://visaroads.com.evil.example/',
    'https://evilvisaroads.com/',
    'javascript:alert(1)',
    'data:text/html,hi',
  ])('refuses unsigned %s', (raw) => {
    expect(resolveClickTarget(raw, null)).toBeNull();
  });

  it('allows an external URL only with a valid signature', () => {
    const raw = 'https://www.canada.ca/en/immigration.html';
    expect(resolveClickTarget(raw, clickSignature(raw))?.href).toBe(raw);
    expect(resolveClickTarget(raw, clickSignature('https://other.example/'))).toBeNull();
    expect(resolveClickTarget(raw, 'forged')).toBeNull();
  });

  it('never signs javascript: even with a valid signature', () => {
    const raw = 'javascript:alert(1)';
    expect(resolveClickTarget(raw, clickSignature(raw))).toBeNull();
  });

  it('route sends a foreign url to the home page and does not record it', async () => {
    const res = await click(new NextRequest('http://internal:8080/api/marketing/track/click?logId=log1&url=https%3A%2F%2Fevil.example%2F'));
    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    expect(res.headers.get('location')).toBe('https://visaroads.com/');
    expect(db.campaignLog.update).not.toHaveBeenCalled();
  });

  it('route follows a signed external url and records the click', async () => {
    const raw = 'https://www.canada.ca/en.html';
    const res = await click(new NextRequest(
      `http://internal:8080/api/marketing/track/click?logId=log1&url=${encodeURIComponent(raw)}&sig=${clickSignature(raw)}`,
    ));
    expect(res.headers.get('location')).toBe(raw);
    expect(db.campaignLog.update).toHaveBeenCalledTimes(1);
  });

  it('route resolves a relative url against the site, not the internal host', async () => {
    const res = await click(new NextRequest('http://internal:8080/api/marketing/track/click?url=%2Fen%2Fblog'));
    expect(res.headers.get('location')).toBe('https://visaroads.com/en/blog');
  });
});

describe('unsubscribe token', () => {
  it('is bound to the normalised email', () => {
    const t = unsubscribeToken('Someone@Example.com ');
    expect(verifyUnsubscribeToken('someone@example.com', t)).toBe(true);
    expect(verifyUnsubscribeToken('other@example.com', t)).toBe(false);
    expect(verifyUnsubscribeToken('someone@example.com', '')).toBe(false);
    expect(verifyUnsubscribeToken('someone@example.com', undefined)).toBe(false);
  });

  it('is not interchangeable with a click signature', () => {
    expect(verifyUnsubscribeToken('a@b.co', clickSignature('a@b.co'))).toBe(false);
  });

  it('fails closed when no secret is configured', () => {
    const t = unsubscribeToken('a@b.co');
    delete process.env.JWT_SECRET;
    expect(verifyUnsubscribeToken('a@b.co', t)).toBe(false);
    expect(() => unsubscribeToken('a@b.co')).toThrow();
  });

  it('prefers LINK_SIGNING_SECRET over JWT_SECRET', () => {
    const fromJwt = unsubscribeToken('a@b.co');
    process.env.LINK_SIGNING_SECRET = 'another-secret-of-16-plus';
    expect(verifyUnsubscribeToken('a@b.co', fromJwt)).toBe(false);
  });

  it('buildUnsubscribeUrl carries email and a verifying token', () => {
    const url = new URL(buildUnsubscribeUrl('https://visaroads.com/unsubscribe?src=mail', 'a+b@c.co'));
    expect(url.searchParams.get('src')).toBe('mail');
    expect(url.searchParams.get('email')).toBe('a+b@c.co');
    expect(verifyUnsubscribeToken('a+b@c.co', url.searchParams.get('token'))).toBe(true);
  });
});

describe('POST /api/unsubscribe', () => {
  const post = (body: unknown) =>
    unsubscribe(new NextRequest('http://localhost/api/unsubscribe', { method: 'POST', body: JSON.stringify(body) }));

  it('refuses a request without a token after the CASL grace cutoff', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2027-01-09T00:00:00Z'));
    try {
      const res = await post({ email: 'victim@example.com' });
      expect(res.status).toBe(403);
      expect(db.marketingContact.deleteMany).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it('refuses a token for another address', async () => {
    const res = await post({ email: 'victim@example.com', token: unsubscribeToken('attacker@example.com') });
    expect(res.status).toBe(403);
    expect(db.marketingContact.deleteMany).not.toHaveBeenCalled();
  });

  it('refuses when no secret is configured', async () => {
    const token = unsubscribeToken('a@b.co');
    delete process.env.JWT_SECRET;
    const res = await post({ email: 'a@b.co', token });
    expect(res.status).toBe(403);
    expect(db.marketingContact.deleteMany).not.toHaveBeenCalled();
  });

  it('rejects a missing email with 400', async () => {
    expect((await post({})).status).toBe(400);
  });

  it('removes the contact with a valid token and does not leak a count', async () => {
    const res = await post({ email: ' A@B.co', token: unsubscribeToken('a@b.co') });
    expect(res.status).toBe(200);
    expect(db.marketingContact.deleteMany).toHaveBeenCalledWith({ where: { email: 'a@b.co' } });
    expect(await res.json()).not.toHaveProperty('deletedCount');
  });
});
