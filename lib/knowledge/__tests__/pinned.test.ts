import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ findUnique: vi.fn(), createSource: vi.fn() }));

vi.mock('@/lib/prisma', () => ({ default: { source: { findUnique: mocks.findUnique } } }));
vi.mock('../sources', async (importOriginal) => {
  const real = await importOriginal<typeof import('../sources')>();
  return { ...real, createSource: mocks.createSource };
});

import { ensurePinnedOfficialSources, PINNED_OFFICIAL_SOURCES } from '../pinned';
import { officialCitationUrl } from '@/lib/autopilot/official-sources';
import { SourceError } from '../sources';

beforeEach(() => {
  mocks.findUnique.mockReset();
  mocks.createSource.mockReset();
});

describe('pinned official sources', () => {
  it('lists only pages the citation gate accepts as official', () => {
    for (const s of PINNED_OFFICIAL_SOURCES) expect(officialCitationUrl(s.url), s.url).not.toBeNull();
  });

  it('registers a missing page as a pinned official one-off', async () => {
    mocks.findUnique.mockResolvedValue(null);
    mocks.createSource.mockResolvedValue({});

    const created = await ensurePinnedOfficialSources();

    expect(created).toHaveLength(PINNED_OFFICIAL_SOURCES.length);
    expect(mocks.createSource).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'html', cadence: 'once', trust: 'official', pinned: true, url: PINNED_OFFICIAL_SOURCES[0].url }),
    );
  });

  it('leaves a page that is already on file alone', async () => {
    mocks.findUnique.mockResolvedValue({ id: 'x' });

    await expect(ensurePinnedOfficialSources()).resolves.toEqual([]);
    expect(mocks.createSource).not.toHaveBeenCalled();
  });

  it('treats a registration race as already done, and never throws', async () => {
    mocks.findUnique.mockResolvedValue(null);
    mocks.createSource.mockRejectedValueOnce(new SourceError('dup', 409)).mockRejectedValueOnce(new Error('db')).mockResolvedValue({});

    await expect(ensurePinnedOfficialSources()).resolves.toHaveLength(PINNED_OFFICIAL_SOURCES.length - 2);
  });
});
