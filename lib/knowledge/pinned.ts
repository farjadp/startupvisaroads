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

export type PinnedSource = { url: string; title: string; topics: string[]; kind?: 'html' | 'pdf' };

/** Topics every High Impact Start-up Pilot article is written against. */
const PILOT_TOPICS = ['high impact start-up pilot', 'high impact startup pilot', 'start-up visa replacement', 'start-up visa paused', 'suv', 'پایلوت high impact', 'جایگزین ویزای استارتاپ کانادا', 'ویزای استارتاپ کانادا'];

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

  // ── Canada: the Start-up Visa pause and its announced replacement ─────────
  // Read 5 Nov 2026 for the High Impact Start-up Pilot guide. Pinned so the
  // writer cannot describe the pilot as open, or invent its criteria, cap or
  // date, none of which IRCC has published. The Canada Gazette entry is a
  // title only; the Ministerial Instructions text has not been read.
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/immigration-measures-entrepreneurs.html',
    title: 'IRCC — Immigration measures for entrepreneurs (19 Dec 2025 notice)',
    topics: PILOT_TOPICS,
  },
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/transparency/transition-binders/deputy-minister-2026/economic-immigration.html',
    title: 'IRCC — Deputy Minister transition binder 2026: economic immigration (names the High Impact Start-up Pilot)',
    topics: [...PILOT_TOPICS, 'federal business programs target', 'levels plan', 'self-employed persons'],
  },
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/about.html',
    title: 'IRCC — Start-up Visa Program (status: paused)',
    topics: PILOT_TOPICS,
  },
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/permanent-residence/economic-classes/start-business/assessing-application.html',
    title: 'IRCC — Start-up Business Class: assessing the application (capital minimums, CLB 5, commitment certificates)',
    topics: [...PILOT_TOPICS, 'commitment certificate', 'designated organization', 'venture capital fund', 'angel investor group', 'incubator', 'clb 5'],
  },
  {
    url: 'https://gazette.gc.ca/rp-pr/p1/2025/2025-12-20/html/index-eng.html',
    title: 'Canada Gazette Part I, 20 Dec 2025 (index: New Ministerial Instructions, Start-up Business Class)',
    topics: PILOT_TOPICS,
  },
];

/**
 * Pages that are NOT official but are worth having on file next to the ones
 * above: trade press and think-tank reporting the pilot's planning documents
 * and the old programme's numbers. Registered pinned with their own trust
 * level, so a writer sees them labelled and the citation gate still refuses
 * to present them as IRCC. Anything taken from these is attributed to them
 * in the article text ("immigration.ca reports…", "RBC argues…").
 */
export const PINNED_REPORTING_SOURCES: (PinnedSource & { trust: 'press' | 'commentary' })[] = [
  {
    url: 'https://immigration.ca/canada-plans-high-impact-start-up-visa-pilot-after-pausing-existing-program/',
    title: 'immigration.ca — Canada plans "high impact" Start-up Visa pilot (24 Mar 2026; quotes the 2026-27 Departmental Plan)',
    topics: [...PILOT_TOPICS, 'elite entrepreneurs', 'departmental plan', 'start-up visa admissions'],
    trust: 'press',
  },
  {
    url: 'https://www.rbc.com/en/thought-leadership/wp-content/uploads/sites/27/2026/09/A-Smarter-Immigration-Strategy-Report-EN.pdf',
    title: 'RBC Thought Leadership — A Smarter Immigration Strategy (Sept 2026; suggests a temporary entrepreneurship pathway)',
    topics: [...PILOT_TOPICS, 'temporary entrepreneurship pathway', 'provincial nominee program', 'rbc'],
    kind: 'pdf',
    trust: 'commentary',
  },
];

/** Create any pinned source not yet on file. Returns the titles it created. */
export async function ensurePinnedOfficialSources(): Promise<string[]> {
  const created: string[] = [];
  const all: (PinnedSource & { trust?: 'official' | 'press' | 'commentary' })[] = [
    ...PINNED_OFFICIAL_SOURCES.map((s) => ({ ...s, trust: 'official' as const })),
    ...PINNED_REPORTING_SOURCES,
  ];
  for (const s of all) {
    const exists = await prisma.source.findUnique({ where: { url: normaliseUrl(s.url) }, select: { id: true } });
    if (exists) continue;
    try {
      await createSource({ kind: s.kind ?? 'html', cadence: 'once', url: s.url, title: s.title, trust: s.trust ?? 'official', locale: null, pinned: true, topics: s.topics });
      created.push(s.title);
    } catch (e) {
      // Registered by someone else between the check and the create.
      if (e instanceof SourceError && e.status === 409) continue;
      console.error(`knowledge/pinned: could not register ${s.url}`, e);
    }
  }
  return created;
}
