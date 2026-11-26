import { describe, expect, it, vi } from 'vitest';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-at-least-sixteen-chars';
vi.mock('@/lib/prisma', () => ({ default: { finderUser: { update: vi.fn(async () => ({ id: 'u1' })) } } }));
vi.mock('@/lib/rcip-finder/service', () => ({ completeStep: vi.fn(async () => undefined) }));

import { NextRequest } from 'next/server';
import { GET } from '@/app/api/finder/auth/verify/route';
import { signLoginToken } from '@/lib/rcip-finder/session';
import { SITE_URL } from '@/lib/seo';

describe('sign-in link', () => {
  it('redirects to the public site, never to the container address', async () => {
    const token = await signLoginToken('a@example.com', 'fa');
    const res = await GET(new NextRequest(`http://0.0.0.0:8080/api/finder/auth/verify?token=${token}`));
    expect(res.headers.get('location')).toBe(`${SITE_URL}/fa/data-reports/rcip-employers?signin=ok`);
    expect(res.headers.get('set-cookie')).toContain('finder_session=');
  });

  it('sends an expired or forged link to the English page with a notice', async () => {
    const res = await GET(new NextRequest('http://0.0.0.0:8080/api/finder/auth/verify?token=bad'));
    expect(res.headers.get('location')).toBe(`${SITE_URL}/en/data-reports/rcip-employers?signin=expired`);
  });
});
