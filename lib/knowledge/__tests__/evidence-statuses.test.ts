import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ docs: vi.fn(), sources: vi.fn(), update: vi.fn() }));

vi.mock('@/lib/prisma', () => ({
  default: {
    sourceDocument: { findMany: mocks.docs, update: mocks.update },
    sourceChunk: { findMany: vi.fn().mockResolvedValue([]) },
    source: { findMany: mocks.sources },
  },
}));

import { EVIDENCE_STATUSES, markDocument } from '../queue';
import { pinnedDigests, retrieveEvidence } from '../retrieve';

beforeEach(() => {
  mocks.docs.mockReset().mockResolvedValue([]);
  mocks.sources.mockReset().mockResolvedValue([]);
  mocks.update.mockReset().mockResolvedValue({});
});

// Retrieval read only `ready`, so every item the source writer read left the
// evidence store: ~150 passages fell to 6 between 15 and 24 Oct 2026.
describe('what counts as evidence', () => {
  it('keeps documents the writer used or declined, never the ones triage refused', () => {
    expect(EVIDENCE_STATUSES).toEqual(expect.arrayContaining(['ready', 'used', 'declined']));
    expect(EVIDENCE_STATUSES).not.toContain('ignored');
    expect(EVIDENCE_STATUSES).not.toContain('new');
  });

  it('retrieves from every evidence status', async () => {
    await retrieveEvidence('canada start-up visa');
    expect(mocks.docs.mock.calls[0][0].where.status).toEqual({ in: [...EVIDENCE_STATUSES] });
  });

  it('reads pinned digests from every evidence status', async () => {
    await pinnedDigests();
    const where = mocks.sources.mock.calls[0][0].where;
    expect(where.documents.some.status).toEqual({ in: [...EVIDENCE_STATUSES] });
  });

  it('records a writer refusal as declined, which retrieval still reads', async () => {
    await markDocument('d1', 'declined', 'already published');
    expect(mocks.update.mock.calls[0][0].data.status).toBe('declined');
    expect(EVIDENCE_STATUSES).toContain(mocks.update.mock.calls[0][0].data.status);
  });
});
