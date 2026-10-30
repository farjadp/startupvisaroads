// ============================================================================
// content/en/pnp-bc.ts
// /en/pnp/bc — BC PNP Entrepreneur Immigration (Base and Regional streams).
// Checked on welcomebc.ca on 2026-10-29 (see `sources`): the Entrepreneur
// Immigration page (last updated 10 Sep 2025) for every threshold, and the
// News page (updated 26 Aug 2026) for the end of the Tech draws on 3 Dec 2024
// and the 2026 Care / Build / Innovate priorities.
// Replaced the old page, which led with "weekly" Tech draws that ended in 2024,
// placed the Base stream in Greater Vancouver only, and cited nothing.
// No VisaRoads price appears here, by rule.
// ============================================================================
import type { FaPage } from '@/lib/fa/content';

export const page: FaPage = {
  path: '/pnp/bc',
  title: 'BC PNP Entrepreneur Immigration 2026: Base and Regional Streams',
  description:
    'BC PNP Entrepreneur Immigration in 2026: the Base stream ($600,000 net worth, $200,000 investment) and the Regional stream ($300,000, $100,000), one new full-time job, CLB 4. Cited to WelcomeBC.',
  keywords: [
    'bc pnp entrepreneur',
    'bc pnp entrepreneur base stream',
    'bc pnp regional stream',
    'british columbia entrepreneur immigration',
    'bc pnp tech draw',
  ],
  updated: '2026-10-29',
  entity: {
    name: 'BC Provincial Nominee Program — Entrepreneur Immigration',
    provider: 'Government of British Columbia',
    country: 'Canada',
  },
  facts: [
    { label: 'Base: personal net worth', value: 'CAD 600,000' },
    { label: 'Base: personal investment', value: 'CAD 200,000' },
    { label: 'Regional: personal net worth', value: 'CAD 300,000' },
    { label: 'Regional: personal investment', value: 'CAD 100,000' },
    { label: 'Jobs to create', value: '1 full-time', note: 'for a Canadian citizen or permanent resident, both streams' },
    { label: 'Language', value: 'CLB 4' },
  ],
  hero: {
    eyebrow: 'Canada · British Columbia · BC PNP',
    headline: 'BC PNP for entrepreneurs: two streams, one province',
    sub: 'British Columbia nominates entrepreneurs through two streams. The Base stream works anywhere in the province. The Regional stream costs half as much, outside Metro Vancouver, but needs a community to refer you. This page sets out both, cited to WelcomeBC.',
    cta: { label: 'Compare the entrepreneur provinces', href: '/pnp' },
  },

  sections: [
    {
      heading: 'Base stream or Regional stream?',
      body: [
        'The Base stream is for people who want to start a new business, or take over and grow an existing one, anywhere in British Columbia. The Regional stream is for people who want to start a new business outside the Metro Vancouver Regional District, in a participating community they intend to make their home.',
        'The money is the main difference: the Regional stream asks for half the net worth and half the investment. The trade-off is that a community has to accept you first.',
      ],
    },
    {
      heading: 'Base stream requirements',
      body: ['WelcomeBC lists these minimums for the Base stream:'],
      bullets: [
        'A personal net worth of at least CAD 600,000.',
        'At least 3 years as a business owner-manager in the last 10 years. BC may accept an eligible post-secondary degree instead.',
        'An eligible personal investment of at least CAD 200,000 in the business.',
        'At least one new full-time job for a Canadian citizen or permanent resident.',
        'CLB 4 in English or French.',
        'An exploratory visit is recommended but not required.',
      ],
    },
    {
      heading: 'Regional stream requirements',
      body: ['And these for the Regional stream:'],
      bullets: [
        'A personal net worth of at least CAD 300,000.',
        'At least 3 years as a business owner-manager in the last 5 years. BC may accept an eligible post-secondary degree instead.',
        'An eligible personal investment of at least CAD 100,000, in a new business aligned with the economic priorities of the community that refers you.',
        'At least one new full-time job for a Canadian citizen or permanent resident.',
        'CLB 4 in English or French.',
        'An exploratory visit to the community, then a completed referral form from that community. You cannot register without the referral.',
      ],
      callout: 'The Regional stream starts with the community, not with BC PNP. Contact the community, visit it, then ask for the referral.',
    },
    {
      heading: 'Businesses BC does not accept',
      body: ['BC lists businesses that are ineligible under both streams. Among them:'],
      bullets: [
        'Passive investments, investments with a redemption option, and immigration-linked investment schemes.',
        'Bed and breakfasts, hobby farms and home-based businesses.',
        'Payday loan, cheque cashing, money changing and cash machine businesses, and pawnbrokers.',
        'Coin-operated laundries, automated car washes, tanning salons and DVD rental stores.',
        'Real estate development or brokerage, insurance brokerage and business brokerage.',
        'Import/export trading, unless the business adds value.',
      ],
    },
    {
      heading: 'What happened to BC PNP Tech?',
      body: [
        'The weekly Tech draws are over. WelcomeBC says the final draw for priority technology occupations took place on 3 December 2024. Occupations on the former tech list remain eligible, and BC now reaches tech talent through High Economic Impact invitations across all sectors.',
        'In 2026 BC set three priorities for its skilled-worker streams: Care (healthcare and the care economy), Build (certified workers in 9 in-demand skilled trades) and Innovate (High Economic Impact invitations for top talent and entrepreneurs). Those are worker routes with a job offer; this page is about the entrepreneur streams.',
      ],
    },
    {
      heading: 'Where we come in',
      body: [
        'We are not immigration lawyers or licensed consultants, and we do not file applications. We mentor founders through the business side of a provincial entrepreneur file: the business concept, the investment plan and the job you will create. For the legal filing, work with a licensed representative.',
      ],
    },
  ],

  faqs: [
    {
      q: 'How much do I need for the BC PNP Entrepreneur Base stream?',
      a: 'A personal net worth of at least CAD 600,000 and an eligible personal investment of at least CAD 200,000, plus one new full-time job for a Canadian citizen or permanent resident.',
    },
    {
      q: 'How much do I need for the BC PNP Regional stream?',
      a: 'A personal net worth of at least CAD 300,000 and an eligible personal investment of at least CAD 100,000, plus one new full-time job, an exploratory visit and a referral from a participating community.',
    },
    {
      q: 'Is the Base stream only for Vancouver?',
      a: 'No. The Base stream applies anywhere in British Columbia. The Regional stream is the one restricted to participating communities outside Metro Vancouver.',
    },
    {
      q: 'Does BC PNP still hold Tech draws?',
      a: 'No. WelcomeBC says the final Tech draw was on 3 December 2024. Tech occupations remain eligible and are reached through High Economic Impact invitations.',
    },
    {
      q: 'Is an exploratory visit required for BC PNP entrepreneurs?',
      a: 'For the Regional stream, yes: you must visit the community before it refers you. For the Base stream it is recommended but not required.',
    },
  ],

  closing: [
    { label: 'Compare the entrepreneur provinces', href: '/pnp' },
    { label: 'Alberta entrepreneur streams', href: '/pnp/alberta' },
    { label: 'Talk to us', href: '/contact' },
  ],

  sources: [
    { label: 'WelcomeBC — Entrepreneur Immigration: Base and Regional streams (last updated 10 Sep 2025)', url: 'https://www.welcomebc.ca/immigrate-to-b-c/entrepreneur-immigration' },
    { label: 'WelcomeBC — BC PNP News: final Tech draw and the 2026 Care, Build and Innovate priorities', url: 'https://www.welcomebc.ca/immigrate-to-b-c/news' },
  ],
};
