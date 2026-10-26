// ============================================================================
// content/en/keywords.ts
// The English writing queue, by pillar (lib/autopilot/pillars.ts).
//
// Every keyword here is a query Google Autocomplete returned on 26 Oct 2026
// for a seed in one of our countries — Canada, the USA, the UK, Australia,
// Denmark, Finland, the Netherlands, Italy, Estonia, Türkiye — so each one is
// something people actually type, not a term the planner invented. Queries
// tied to one origin country ("…for bangladeshi") and navigational ones
// ("express entry login") were left out; so were outright duplicates.
//
// It replaces prisma/keywords.json as the planner's pool. That list, from
// June, was generic ("visa application help") and Canada-heavy, and with the
// founder framing it was turned into "spousal sponsorship for founders".
// ============================================================================
import type { Pillar } from '@/lib/autopilot/pillars';

export const EN_KEYWORDS_BY_PILLAR: Record<Exclude<Pillar, 'news'>, string[]> = {
  work: [
    'express entry points calculator',
    'express entry draw',
    'lmia job offer points in express entry',
    'canada work permit processing time',
    'canada work permit extension',
    'spouse open work permit',
    'educational credential assessment canada',
    'credential evaluation canada immigration',
    'finland work permit requirements',
    'finland work permit salary',
    'finland work permit processing time',
    'netherlands highly skilled migrant salary',
    'netherlands highly skilled migrant requirements',
    'denmark work permit processing time',
    'denmark pay limit scheme',
    'australia skilled visa points calculator',
    'australia skilled visa occupation list',
    'australia skilled visa requirements',
    'uk skilled worker visa salary threshold',
    'uk skilled worker visa requirements',
    'eb-2 niw requirements',
    'eb-2 niw processing time',
    'h1b to green card',
    'c10 work permit',
  ],
  business: [
    'alberta rural entrepreneur stream requirements',
    'alberta rural entrepreneur stream participating communities',
    'nova scotia entrepreneur stream',
    'new brunswick business immigration stream',
    'new brunswick post graduate entrepreneurial stream',
    'manitoba entrepreneur pathway',
    'manitoba business investor stream entrepreneur pathway',
    'uk innovator founder visa endorsement',
    'e-2 visa requirements',
    'e-2 visa to green card',
    'netherlands startup visa facilitator',
    'netherlands startup visa requirements',
    'netherlands startup visa processing time',
    'italy startup visa requirements',
    'estonia startup visa requirements',
    'finland startup permit',
    'australia national innovation visa',
    'estonia startup visa processing time',
    'eb-5 investment amount',
    'self employed visa canada',
  ],
  study: [
    'pgwp eligibility',
    'pgwp eligible programs',
    'pgwp processing time',
    'study permit canada requirements',
    'canada study permit cap',
    'study in finland for international students',
    'study in finland for free',
    'finland residence permit for studies',
    'study in netherlands for international students',
    'netherlands student visa requirements',
    'denmark student visa requirements',
    'study in italy for international students',
    'italy study visa requirements',
    'study in estonia for international students',
    'australia student visa requirements',
    'australia student visa processing time',
    'uk graduate visa',
    'f1 student visa usa requirements',
    'opt stem extension',
    'study in turkey for international students',
  ],
  life: [
    'cost of living in toronto',
    'cost of living in canada',
    'cost of living in helsinki',
    'cost of living in amsterdam',
    'cost of living in copenhagen',
    'health insurance in canada for new immigrants',
    'healthcare for newcomers in canada',
    'newcomer opening a bank account in canada',
    'tax filing for newcomers canada',
    'newcomers to canada tax benefits',
    'cost of living in ontario',
    'moving to finland with family',
    'learning finnish as an english speaker',
    'schools for expats in netherlands',
    'how to move and live in finland',
    'family reunification denmark',
    'income tax for newcomers canada',
    'cost of living in australia vs canada',
    'how to get health insurance for new immigrants',
    'is moving to finland worth it',
  ],
};
