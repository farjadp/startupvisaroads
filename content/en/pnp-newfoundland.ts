// ============================================================================
// content/en/pnp-newfoundland.ts
// /en/pnp/newfoundland — NL PNP International Entrepreneur and International
// Graduate Entrepreneur. Figures read on gov.nl.ca on 2026-10-29 (IE overview
// updated 4 May 2026, IE and IGE eligibility criteria, EOI prioritisation
// criteria updated 23 Mar 2026); gov.nl.ca was down for maintenance when
// re-opened the same evening, so the quotes come from the 29 Oct fact check
// in the shared notes. Replaced the old page, which ranked candidates "out of
// 120 points" (no such scale on gov.nl.ca), called the exploratory visit not
// mandatory (it is, from outside NL), and cited nothing.
// No VisaRoads price appears here, by rule.
// ============================================================================
import type { FaPage } from '@/lib/fa/content';

export const page: FaPage = {
  path: '/pnp/newfoundland',
  title: 'Newfoundland and Labrador Entrepreneur PNP 2026: Requirements',
  description:
    'NL PNP International Entrepreneur in 2026: EOI open, CAD 600,000 net worth, CAD 200,000 investment for 33.3% ownership, one full-time job, CLB 5, age 21 to 59, and a required visit. Plus the graduate stream. Cited to gov.nl.ca.',
  keywords: [
    'newfoundland entrepreneur pnp',
    'nl pnp international entrepreneur',
    'newfoundland international graduate entrepreneur',
    'newfoundland business immigration',
    'nl pnp entrepreneur requirements',
  ],
  updated: '2026-10-29',
  entity: {
    name: 'Newfoundland and Labrador Provincial Nominee Program — Entrepreneur categories',
    provider: 'Government of Newfoundland and Labrador',
    country: 'Canada',
  },
  facts: [
    { label: 'EOI system', value: 'Open', note: 'gov.nl.ca, May 2026' },
    { label: 'Net worth', value: 'CAD 600,000', note: 'personal and business assets transferable to Canada' },
    { label: 'Investment', value: 'CAD 200,000', note: 'for at least 33.3% ownership, or CAD 1 million in equity' },
    { label: 'Jobs to create', value: '1 full-time', note: 'for a Canadian citizen or permanent resident' },
    { label: 'Language', value: 'CLB 5' },
    { label: 'Age', value: '21 to 59' },
  ],
  hero: {
    eyebrow: 'Canada · Newfoundland and Labrador · NL PNP',
    headline: 'Newfoundland and Labrador: an open entrepreneur stream on the Atlantic',
    sub: 'NL runs two entrepreneur categories: International Entrepreneur for experienced business owners, and International Graduate Entrepreneur for graduates of Memorial University and College of the North Atlantic. Its Expression of Interest system is open. Here is what each asks, cited to gov.nl.ca.',
    cta: { label: 'Compare the entrepreneur provinces', href: '/pnp' },
  },

  sections: [
    {
      heading: 'Is the NL entrepreneur stream open in 2026?',
      body: [
        'Yes. The International Entrepreneur page on gov.nl.ca (updated 4 May 2026) says: "The Expression of Interest system is currently open." Selection is by prioritisation criteria that NL lists without a published points weighting, so there is no score you can calculate in advance.',
      ],
    },
    {
      heading: 'International Entrepreneur requirements',
      body: ['gov.nl.ca lists these eligibility criteria:'],
      bullets: [
        'At least CAD 600,000 in personal and business assets that can be transferred to Canada.',
        'Invest at least CAD 200,000 in a business you own at least 33.3% of, or invest CAD 1 million in equity.',
        'Create at least one full-time job for a Canadian citizen or permanent resident.',
        'Age 21 to 59, and CLB 5 or higher in English or French.',
        'Either 2 or more years of business ownership and management (with at least 25% ownership) in the last 5 years, or 5 or more years in a senior management role in the last 10 years.',
        'If you live outside NL, you must visit the province before you submit your application.',
      ],
      callout: 'The visit is a requirement, not a tip. Plan it before you write the business plan, not after.',
    },
    {
      heading: 'International Graduate Entrepreneur',
      body: [
        'This category is for graduates of Memorial University or College of the North Atlantic who hold a valid post-graduate work permit. NL sets no net worth or investment amount for it. Instead you must have run a business in NL, owning at least 33.3% of it, for at least one full year, show a business continuity plan with verified finances, and have CLB 7 or higher.',
      ],
    },
    {
      heading: 'Businesses NL does not accept',
      body: ['The ineligible list includes, among others:'],
      bullets: [
        'Businesses run remotely rather than from NL.',
        'Real estate development and property rental.',
        'Taxi companies, pawnbrokers and payday loan businesses.',
        'Home-based businesses.',
      ],
    },
    {
      heading: 'Where we come in',
      body: [
        'We are not immigration lawyers or licensed consultants, and we do not file applications. We mentor founders through the business side of a provincial entrepreneur file: the concept, the investment plan, the visit and the job you will create. For the legal filing, work with a licensed representative.',
      ],
    },
  ],

  faqs: [
    {
      q: 'Is the Newfoundland and Labrador entrepreneur program open?',
      a: 'Yes. gov.nl.ca says the International Entrepreneur Expression of Interest system is currently open (page updated 4 May 2026).',
    },
    {
      q: 'How much money do I need for the NL International Entrepreneur category?',
      a: 'At least CAD 600,000 in transferable personal and business assets, and an investment of at least CAD 200,000 for at least 33.3% ownership, or CAD 1 million in equity.',
    },
    {
      q: 'Is the exploratory visit mandatory in Newfoundland and Labrador?',
      a: 'Yes, if you live outside the province: you must visit NL before submitting your application.',
    },
    {
      q: 'How are NL entrepreneur candidates scored?',
      a: 'NL selects Expressions of Interest by published prioritisation criteria, with no points weighting stated. There is no official points total to aim for.',
    },
    {
      q: 'Is there an entrepreneur route for international graduates in NL?',
      a: 'Yes. Graduates of Memorial University or College of the North Atlantic with a valid post-graduate work permit can apply after running an NL business, with at least 33.3% ownership, for one full year. CLB 7 is required.',
    },
  ],

  closing: [
    { label: 'Compare the entrepreneur provinces', href: '/pnp' },
    { label: 'Nova Scotia Entrepreneur stream', href: '/pnp/nova-scotia' },
    { label: 'Talk to us', href: '/contact' },
  ],

  sources: [
    { label: 'Government of NL — International Entrepreneur (updated 4 May 2026)', url: 'https://www.gov.nl.ca/immigration/immigrating-to-newfoundland-and-labrador/provincial-nominee-program/entrepreneurs/international-entrepreneur/' },
    { label: 'Government of NL — International Entrepreneur eligibility criteria', url: 'https://www.gov.nl.ca/immigration/immigrating-to-newfoundland-and-labrador/provincial-nominee-program/entrepreneurs/international-entrepreneur/eligibility-criteria/' },
    { label: 'Government of NL — International Graduate Entrepreneur eligibility criteria', url: 'https://www.gov.nl.ca/immigration/immigrating-to-newfoundland-and-labrador/provincial-nominee-program/entrepreneurs/international-graduate-entrepreneur/eligibility-criteria/' },
    { label: 'Government of NL — Expression of Interest prioritisation criteria (updated 23 Mar 2026)', url: 'https://www.gov.nl.ca/immigration/expression-of-interest-model-prioritization-criteria/' },
  ],
};
