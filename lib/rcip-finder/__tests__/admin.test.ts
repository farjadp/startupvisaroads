import { beforeEach, describe, expect, it, vi } from 'vitest';

const prismaMock = vi.hoisted(() => ({
  setting: { upsert: vi.fn(async () => ({})) },
  contactReport: { updateMany: vi.fn(async () => ({ count: 1 })) },
}));
const guard = vi.hoisted(() => ({ allow: true }));

vi.mock('@/lib/prisma', () => ({ default: prismaMock }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/lib/admin-guard', () => {
  class UnauthorizedError extends Error {}
  return {
    UnauthorizedError,
    requireAdmin: vi.fn(async () => {
      if (!guard.allow) throw new UnauthorizedError('Unauthorized');
      return { username: 'admin' };
    }),
  };
});

import { resolveContactReport, setContactPolicy } from '@/app/actions/finderAdminActions';
import { isFinderFilter, userWhere } from '@/lib/rcip-finder/admin';

beforeEach(() => {
  guard.allow = true;
  prismaMock.setting.upsert.mockClear();
  prismaMock.contactReport.updateMany.mockClear();
});

describe('finder admin actions', () => {
  it('refuses a visitor without an admin session and writes nothing', async () => {
    guard.allow = false;
    expect(await setContactPolicy('off')).toEqual({ success: false, error: 'Unauthorized' });
    expect(await resolveContactReport('r1')).toEqual({ success: false, error: 'Unauthorized' });
    expect(prismaMock.setting.upsert).not.toHaveBeenCalled();
    expect(prismaMock.contactReport.updateMany).not.toHaveBeenCalled();
  });

  it('accepts only all, safe and off', async () => {
    expect(await setContactPolicy('everything')).toEqual({ success: false, error: 'Unknown policy.' });
    expect(prismaMock.setting.upsert).not.toHaveBeenCalled();
    expect(await setContactPolicy('safe')).toEqual({ success: true });
    expect(prismaMock.setting.upsert).toHaveBeenCalledWith(expect.objectContaining({ update: { value: 'safe' } }));
  });

  it('resolves only an open report', async () => {
    await resolveContactReport('r1');
    expect(prismaMock.contactReport.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'r1', resolvedAt: null } }));
  });
});

describe('sign-up filters', () => {
  it('maps the filter and search to a where clause', () => {
    expect(userWhere('all', null)).toEqual({});
    expect(userWhere('optin', 'A@B')).toEqual({ marketingOptIn: true, email: { contains: 'a@b' } });
    expect(userWhere('verified', null)).toEqual({ verifiedAt: { not: null } });
    expect(isFinderFilter('optin')).toBe(true);
    expect(isFinderFilter('drop table')).toBe(false);
  });
});
