import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const cookieStore = { value: undefined as string | undefined };
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === 'admin_session' && cookieStore.value !== undefined ? { name, value: cookieStore.value } : undefined,
  }),
}));

import { requireAdmin, UnauthorizedError } from '@/lib/admin-guard';
import { signJWT } from '@/lib/auth';

const SECRET = 'test-secret-at-least-16-chars';
const exp = () => Math.floor(Date.now() / 1000) + 3600;

describe('requireAdmin', () => {
  const original = process.env.JWT_SECRET;
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    cookieStore.value = undefined;
  });
  afterEach(() => {
    process.env.JWT_SECRET = original;
  });

  it('rejects when the cookie is missing', async () => {
    await expect(requireAdmin()).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('rejects a malformed token', async () => {
    cookieStore.value = 'not-a-jwt';
    await expect(requireAdmin()).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('rejects a token signed with another secret', async () => {
    cookieStore.value = await signJWT({ username: 'admin', exp: exp() }, 'some-other-secret-value');
    await expect(requireAdmin()).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('rejects an expired token', async () => {
    cookieStore.value = await signJWT({ username: 'admin', exp: Math.floor(Date.now() / 1000) - 10 }, SECRET);
    await expect(requireAdmin()).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('rejects when JWT_SECRET is missing, even for a token that was valid', async () => {
    cookieStore.value = await signJWT({ username: 'admin', exp: exp() }, SECRET);
    delete process.env.JWT_SECRET;
    await expect(requireAdmin()).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('rejects when JWT_SECRET is too weak', async () => {
    process.env.JWT_SECRET = 'short';
    cookieStore.value = await signJWT({ username: 'admin', exp: exp() }, 'short');
    await expect(requireAdmin()).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('rejects a valid signature whose payload has no username', async () => {
    cookieStore.value = await signJWT({ role: 'admin', exp: exp() }, SECRET);
    await expect(requireAdmin()).rejects.toBeInstanceOf(UnauthorizedError);
    cookieStore.value = await signJWT({ username: '', exp: exp() }, SECRET);
    await expect(requireAdmin()).rejects.toBeInstanceOf(UnauthorizedError);
    cookieStore.value = await signJWT({ username: 42, exp: exp() }, SECRET);
    await expect(requireAdmin()).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('returns the session for a valid admin token', async () => {
    cookieStore.value = await signJWT({ username: 'admin', exp: exp() }, SECRET);
    await expect(requireAdmin()).resolves.toMatchObject({ username: 'admin' });
  });
});
