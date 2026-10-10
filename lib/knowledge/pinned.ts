// ============================================================================
// lib/knowledge/pinned.ts
// Official pages every article on their topic must be written against.
//
// Registered the same way the three default feeds are: the hourly watch tick
// creates any that are missing, so adding one is a line here rather than a
// trip through the admin. Pinned means the digest goes into every prompt on
// these topics.
//
// The first three came out of the 8 Sep settlement-funds article, which
// invented a "six-month statement" rule for Denmark and Finland because no
// official page was on file for the writer to read.
// ============================================================================
import prisma from '@/lib/prisma';
import { createSource, normaliseUrl, SourceError } from './sources';

export type PinnedSource = { url: string; title: string; topics: string[] };

export const PINNED_OFFICIAL_SOURCES: PinnedSource[] = [
  {
    url: 'https://migri.fi/en/start-up-entrepreneur',
    title: 'Migri — Residence permit for a start-up entrepreneur',
    topics: ['finland', 'migri', 'start-up entrepreneur', 'proof of funds', 'تمکن مالی', 'فنلاند'],
  },
  {
    url: 'https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Self-support---SIRI/',
    title: 'SIRI — Financial self-support on specific SIRI schemes',
    topics: ['denmark', 'start-up denmark', 'self-support', 'proof of funds', 'تمکن مالی', 'دانمارک'],
  },
  {
    url: 'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Start-up-Denmark',
    title: 'SIRI — Start-up Denmark',
    topics: ['denmark', 'start-up denmark', 'دانمارک'],
  },
];

/** Create any pinned source not yet on file. Returns the titles it created. */
export async function ensurePinnedOfficialSources(): Promise<string[]> {
  const created: string[] = [];
  for (const s of PINNED_OFFICIAL_SOURCES) {
    const exists = await prisma.source.findUnique({ where: { url: normaliseUrl(s.url) }, select: { id: true } });
    if (exists) continue;
    try {
      await createSource({ kind: 'html', cadence: 'once', url: s.url, title: s.title, trust: 'official', locale: null, pinned: true, topics: s.topics });
      created.push(s.title);
    } catch (e) {
      // Registered by someone else between the check and the create.
      if (e instanceof SourceError && e.status === 409) continue;
      console.error(`knowledge/pinned: could not register ${s.url}`, e);
    }
  }
  return created;
}
