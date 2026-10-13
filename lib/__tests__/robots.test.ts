import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/seo', () => ({ SITE_URL: 'https://visaroads.com' }));

import robots from '@/app/robots';

describe('robots', () => {
  it('repeats the private-path disallows in every named crawler group', () => {
    const { rules } = robots();
    const groups = Array.isArray(rules) ? rules : [rules];
    expect(groups.length).toBeGreaterThan(1);
    for (const g of groups.filter((x) => x.disallow !== '/')) {
      expect(g.disallow).toEqual(expect.arrayContaining(['/api/', '/admin']));
    }
  });

  it('shuts Bytespider out entirely', () => {
    const group = (robots().rules as { userAgent: string; disallow?: string | string[] }[]).find((g) => g.userAgent === 'Bytespider');
    expect(group?.disallow).toBe('/');
  });

  it('names the Anthropic search and user agents', () => {
    const agents = (robots().rules as { userAgent: string }[]).map((g) => g.userAgent);
    expect(agents).toEqual(expect.arrayContaining(['ClaudeBot', 'Claude-SearchBot', 'Claude-User']));
  });
});
