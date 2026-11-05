import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/prisma', () => ({ default: {} }));
vi.mock('@/lib/socials', () => ({ shareToSocials: vi.fn() }));
vi.mock('@/lib/covers', () => ({ backfillCovers: vi.fn() }));

import { parseAgentArticle } from '@/lib/agent-articles';

const now = new Date('2026-11-05T12:00:00Z');
const base = { locale: 'en', slug: 'canada-levels-plan-2027', title: 'T', excerpt: 'E', content: '<p>x</p>' };

describe('parseAgentArticle', () => {
  it('publishes now when publishAt is absent or past', () => {
    const a = parseAgentArticle(base, now);
    const b = parseAgentArticle({ ...base, publishAt: '2026-11-01T00:00:00Z' }, now);
    expect(a.ok && a.publishAt).toBe(null);
    expect(b.ok && b.publishAt).toBe(null);
  });

  it('holds an article with a future publishAt', () => {
    const r = parseAgentArticle({ ...base, publishAt: '2026-11-06T09:00:00Z' }, now);
    expect(r.ok && r.publishAt?.toISOString()).toBe('2026-11-06T09:00:00.000Z');
  });

  it('refuses bad slugs, locales and missing fields', () => {
    expect(parseAgentArticle({ ...base, slug: 'Has Spaces' }, now).ok).toBe(false);
    expect(parseAgentArticle({ ...base, locale: 'de' }, now).ok).toBe(false);
    expect(parseAgentArticle({ ...base, content: '' }, now).ok).toBe(false);
    expect(parseAgentArticle({ ...base, publishAt: 'soon' }, now).ok).toBe(false);
    expect(parseAgentArticle({ ...base, publishAt: '2028-12-01T00:00:00Z' }, now).ok).toBe(false);
  });
});
