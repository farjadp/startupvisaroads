import { describe, it, expect, vi } from 'vitest';

const boom = () => Promise.reject(new Error('postgres://user:secret@host/db refused'));

vi.mock('@/lib/prisma', () => ({
  default: new Proxy(
    {},
    {
      get: (_t, model) =>
        new Proxy(
          {},
          {
            get: (_m, method) => {
              // Only the page-view section reads successfully; everything else is down.
              if (model === 'pageView') return async () => (method === 'count' ? 3 : []);
              return boom;
            },
          },
        ),
    },
  ),
}));

import { loadDashboard } from '@/lib/admin-dashboard/load';

describe('loadDashboard', () => {
  it('keeps working sections when others fail, without leaking the error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const d = await loadDashboard(new Date('2026-11-18T12:00:00Z'));
    spy.mockRestore();
    expect(d.traffic.state).toBe('ok');
    if (d.traffic.state === 'ok') expect(d.traffic.data.allTime).toBe(3);
    for (const section of [d.content, d.email, d.systems]) {
      expect(section.state).toBe('error');
      if (section.state === 'error') expect(section.message).not.toContain('secret');
    }
  });
});
