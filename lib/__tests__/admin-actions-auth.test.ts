// Every admin-only server action must reject an unauthenticated caller
// before it touches the database, and must still work for a real admin.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const cookieStore = { value: undefined as string | undefined };
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === 'admin_session' && cookieStore.value !== undefined ? { name, value: cookieStore.value } : undefined,
  }),
}));

const db = vi.hoisted(() => {
  const fn = () => vi.fn(async (..._args: unknown[]): Promise<any> => null);
  return {
    article: { findUnique: fn(), create: fn(), update: fn(), delete: fn() },
    aiKeyword: { createMany: fn(), deleteMany: fn(), findMany: fn() },
    setting: { upsert: fn() },
  };
});
vi.mock('@/lib/prisma', () => ({ default: db }));
vi.mock('@/lib/socials', () => ({ shareToSocials: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));

import { createArticle, updateArticle, deleteArticle } from '@/app/actions/articleActions';
import { addAiKeywords, clearCompletedKeywords, importKeywordStrategy } from '@/app/actions/aiActions';
import { saveSettings } from '@/app/actions/settingActions';
import { signJWT } from '@/lib/auth';
import { UnauthorizedError } from '@/lib/admin-guard';

const SECRET = 'test-secret-at-least-16-chars';

const allDbMocks = () =>
  Object.values(db).flatMap((model) => Object.values(model as Record<string, ReturnType<typeof vi.fn>>));

const articleForm = () => {
  const fd = new FormData();
  fd.set('title', 'Hello world');
  fd.set('content', '<p>Body</p>');
  fd.set('status', 'DRAFT');
  return fd;
};
const keywordForm = () => {
  const fd = new FormData();
  fd.set('keywords', 'one\ntwo');
  return fd;
};
const settingsForm = () => {
  const fd = new FormData();
  fd.set('LINKEDIN_AUTHOR_URN', 'urn:li:person:x');
  return fd;
};

// Actions that throw on a rejected caller.
const throwing: [string, () => Promise<unknown>][] = [
  ['createArticle', () => createArticle(articleForm())],
  ['updateArticle', () => updateArticle('a1', articleForm())],
  ['deleteArticle', () => deleteArticle('a1')],
  ['addAiKeywords', () => addAiKeywords(keywordForm())],
  ['clearCompletedKeywords', () => clearCompletedKeywords()],
];
// Actions whose UI reads a { success, error } result: they keep that contract.
const returning: [string, () => Promise<{ success: boolean; error?: string }>][] = [
  ['importKeywordStrategy', () => importKeywordStrategy()],
  ['saveSettings', () => saveSettings(settingsForm())],
];

const unauthenticated: [string, () => Promise<void>][] = [
  ['no cookie', async () => { cookieStore.value = undefined; }],
  ['invalid token', async () => { cookieStore.value = 'garbage.token.value'; }],
  ['token signed with another secret', async () => {
    cookieStore.value = await signJWT({ username: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }, 'attacker-chosen-secret');
  }],
];

describe('admin server actions reject unauthenticated callers', () => {
  const original = process.env.JWT_SECRET;
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    allDbMocks().forEach((m) => m.mockClear());
  });
  afterEach(() => {
    process.env.JWT_SECRET = original;
  });

  for (const [caseName, setup] of unauthenticated) {
    for (const [name, call] of throwing) {
      it(`${name}: ${caseName} -> throws, no DB call`, async () => {
        await setup();
        await expect(call()).rejects.toBeInstanceOf(UnauthorizedError);
        allDbMocks().forEach((m) => expect(m).not.toHaveBeenCalled());
      });
    }
    for (const [name, call] of returning) {
      it(`${name}: ${caseName} -> { success: false }, no DB call`, async () => {
        await setup();
        await expect(call()).resolves.toEqual({ success: false, error: 'Unauthorized' });
        allDbMocks().forEach((m) => expect(m).not.toHaveBeenCalled());
      });
    }
  }
});

describe('admin server actions accept a valid admin session', () => {
  const original = process.env.JWT_SECRET;
  beforeEach(async () => {
    process.env.JWT_SECRET = SECRET;
    allDbMocks().forEach((m) => m.mockClear());
    cookieStore.value = await signJWT({ username: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }, SECRET);
    db.article.create.mockResolvedValue({ id: 'a1', status: 'DRAFT' });
    db.article.update.mockResolvedValue({ id: 'a1', status: 'DRAFT', locale: 'en', slug: 's' });
    db.aiKeyword.findMany.mockResolvedValue([]);
  });
  afterEach(() => {
    process.env.JWT_SECRET = original;
  });

  it('createArticle writes the article', async () => {
    await createArticle(articleForm());
    expect(db.article.create).toHaveBeenCalledTimes(1);
  });
  it('updateArticle updates the article', async () => {
    await updateArticle('a1', articleForm());
    expect(db.article.update).toHaveBeenCalledTimes(1);
  });
  it('deleteArticle deletes the article', async () => {
    await deleteArticle('a1');
    expect(db.article.delete).toHaveBeenCalledWith({ where: { id: 'a1' } });
  });
  it('addAiKeywords queues keywords', async () => {
    await addAiKeywords(keywordForm());
    expect(db.aiKeyword.createMany).toHaveBeenCalledTimes(1);
  });
  it('clearCompletedKeywords clears', async () => {
    await clearCompletedKeywords();
    expect(db.aiKeyword.deleteMany).toHaveBeenCalledTimes(1);
  });
  it('importKeywordStrategy imports', async () => {
    const res = await importKeywordStrategy();
    expect(res.success).toBe(true);
    expect(db.aiKeyword.findMany).toHaveBeenCalledTimes(1);
  });
  it('saveSettings upserts', async () => {
    await expect(saveSettings(settingsForm())).resolves.toEqual({ success: true });
    expect(db.setting.upsert).toHaveBeenCalled();
  });
});
