// ============================================================================
// content/en/pnp-ontario.ts
// /en/pnp/ontario — the OINP Entrepreneur Stream is gone. Checked on ontario.ca
// on 2026-10-29 (see `sources`): the OINP hub (updated 27 Oct 2026) says every
// stream except the Ontario Workforce Priority stream is closed, and the old
// Entrepreneur Stream page now redirects to the Archives of Ontario. This page
// says so first and points to the provinces that still take entrepreneurs.
// The old stream's thresholds are deliberately not repeated: a reader who
// skims would take them as live. No VisaRoads price appears here, by rule.
// ============================================================================
import type { FaPage } from '@/lib/fa/content';

export const page: FaPage = {
  path: '/pnp/ontario',
  title: 'Ontario PNP Entrepreneur Stream 2026: Closed',
  description:
    'Ontario has closed the OINP Entrepreneur Stream. In 2026 the only open OINP stream is the Ontario Workforce Priority stream, which needs a job offer. What that means for founders, and the provinces still taking entrepreneurs.',
  keywords: [
    'ontario entrepreneur pnp',
    'oinp entrepreneur stream',
    'oinp entrepreneur stream closed',
    'ontario workforce priority stream',
    'ontario business immigration 2026',
  ],
  updated: '2026-10-29',
  entity: {
    name: 'Ontario Immigrant Nominee Program — Entrepreneur Stream',
    provider: 'Government of Ontario',
    country: 'Canada',
  },
  status: {
    tone: 'closed',
    title: 'The OINP has no entrepreneur stream',
    body: 'Ontario\'s OINP page (updated 27 October 2026) says the new Ontario Workforce Priority stream has launched "and all other streams are now closed". That stream is for people with a job offer and for self-employed physicians. There is no route for a founder who wants to start or buy a business in Ontario.',
    cta: { label: 'See the provinces taking entrepreneurs', href: '/pnp' },
  },
  facts: [
    { label: 'Entrepreneur Stream', value: 'Closed', note: 'the old stream page now redirects to the Archives of Ontario' },
    { label: 'Only open OINP stream', value: 'Ontario Workforce Priority', note: 'job offer required, or self-employed physician' },
    { label: 'Former streams removed', value: '25 June 2026', note: 'amendments to O. Reg. 422/17' },
  ],
  hero: {
    eyebrow: 'Canada · Ontario · OINP',
    headline: 'Ontario no longer nominates entrepreneurs',
    sub: 'For years the OINP Entrepreneur Stream was the provincial route for founders who wanted Toronto or Ottawa. It is closed. This page sets out what Ontario says now, what happens to files already submitted, and where a founder can still apply.',
    cta: { label: 'Compare the open provinces', href: '/pnp' },
  },

  sections: [
    {
      heading: 'Is the Ontario entrepreneur stream open in 2026?',
      body: [
        'No. The OINP page on ontario.ca, updated 27 October 2026, says the new Ontario Workforce Priority stream has launched and all other streams are now closed. The old Entrepreneur Stream page no longer exists on ontario.ca; its address now redirects to the Archives of Ontario.',
        'Ontario removed its eight former streams by amending Ontario Regulation 422/17, in force on 25 June 2026, and opened the new stream\'s Expression of Interest portal on 4 August 2026. Ontario calls this the first of a two-phase redesign and says to watch for more changes. It has published no entrepreneur stream, criteria or date.',
      ],
      callout: 'If someone offers to file an Ontario PNP entrepreneur application today, ask which open OINP stream they mean. There is none.',
    },
    {
      heading: 'What the Ontario Workforce Priority stream is',
      body: [
        'It is a stream for skilled workers with a qualifying job offer in any occupation. The employer starts the process: it registers with the OINP and applies for approval of the position, and only then can the worker register an Expression of Interest. Work experience, language and education requirements depend on the job\'s TEER category; for TEER 0 to 3 jobs, Ontario lists CLB 6 (CLB 5 for certain occupations) and a post-secondary credential. Self-employed physicians can apply without a job offer.',
        'It is not a business-owner route. Owning the company that offers you the job does not turn it into one, and the OINP checks that the job offer is genuine.',
      ],
    },
    {
      heading: 'If you already applied under the old stream',
      body: [
        'Ontario says applications submitted after an invitation under a former stream "will continue to be assessed against the eligibility requirements that were in effect when the application was submitted". Expressions of Interest that had not led to an invitation are withdrawn, and the people affected are told directly. If you are in that position, read the notice Ontario sent you, and work with a licensed representative.',
      ],
    },
    {
      heading: 'Where a founder can still go',
      body: [
        'Several provinces still take entrepreneurs, each with its own net worth, investment and residence rules: Alberta, Manitoba, Nova Scotia and New Brunswick, which we compare side by side, and British Columbia and Newfoundland and Labrador. Prince Edward Island still lists its stream but has invited no entrepreneur in 2026. Saskatchewan closed its entrepreneur and farm routes in March 2025.',
        'If you want to live in Ontario specifically, the provincial entrepreneur route is not available for now. Moving to a province you do not intend to live in is not a plan: every entrepreneur stream requires you to run the business there and live there.',
      ],
    },
    {
      heading: 'Where we come in',
      body: [
        'We are not immigration lawyers or licensed consultants, and we do not file applications. We mentor founders through the business side of a provincial entrepreneur file, and part of that is telling you when a stream has closed. For the legal filing, work with a licensed representative.',
      ],
    },
  ],

  faqs: [
    {
      q: 'Is the OINP Entrepreneur Stream still open?',
      a: 'No. Ontario\'s OINP page (updated 27 October 2026) says every stream except the new Ontario Workforce Priority stream is closed, and the Entrepreneur Stream page has been archived.',
    },
    {
      q: 'Can I immigrate to Ontario as an entrepreneur in 2026?',
      a: 'Not through the OINP. Its only open stream needs a job offer, or applies to self-employed physicians. Ontario has published no new entrepreneur stream.',
    },
    {
      q: 'What happens to an OINP entrepreneur application I already submitted?',
      a: 'Ontario says applications submitted after an invitation under a former stream are assessed against the requirements in effect when they were submitted.',
    },
    {
      q: 'Which provinces still have an entrepreneur stream?',
      a: 'Alberta, Manitoba, Nova Scotia, New Brunswick, British Columbia and Newfoundland and Labrador. PEI\'s stream is listed but invited no entrepreneur in 2026, and Saskatchewan closed its entrepreneur routes in March 2025.',
    },
  ],

  closing: [
    { label: 'Compare the open entrepreneur provinces', href: '/pnp' },
    { label: 'Alberta entrepreneur streams', href: '/pnp/alberta' },
    { label: 'Talk to us', href: '/contact' },
  ],

  sources: [
    { label: 'Government of Ontario — Ontario Immigrant Nominee Program (updated 27 Oct 2026)', url: 'https://www.ontario.ca/page/ontario-immigrant-nominee-program-oinp' },
    { label: 'Government of Ontario — 2026 OINP updates (25 June redesign, 4 August portal opening)', url: 'https://www.ontario.ca/page/2026-ontario-immigrant-nominee-program-updates' },
    { label: 'Government of Ontario — Ontario Workforce Priority stream', url: 'https://www.ontario.ca/page/ontario-workforce-priority-stream' },
  ],
};
