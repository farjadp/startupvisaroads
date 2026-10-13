// ============================================================================
// content/en/pnp-new-brunswick.ts
// /en/pnp/new-brunswick — New Brunswick Business Immigration Stream (NBBIS),
// which replaced the Entrepreneurial Stream. Checked on gnb.ca and the March
// 2025 guide on 2026-10-12 (see `sources`). No VisaRoads price, by rule.
// ============================================================================
import type { FaPage } from '@/lib/fa/content';

export const page: FaPage = {
  path: '/pnp/new-brunswick',
  title: 'New Brunswick Business Immigration Stream (NBBIS) 2026',
  description:
    'New Brunswick\'s Business Immigration Stream, which replaced the Entrepreneurial Stream: $500,000 net worth, $150,000 investment, 33.3% ownership, CLB 4, 65 of 100 points, and nomination after six months of operation.',
  keywords: [
    'new brunswick entrepreneurial stream',
    'new brunswick business immigration stream',
    'nbbis requirements',
    'new brunswick pnp entrepreneur',
    'new brunswick business draw',
  ],
  updated: '2026-10-12',
  entity: {
    name: 'New Brunswick Provincial Nominee Program — Business Immigration Stream',
    provider: 'Government of New Brunswick',
    country: 'Canada',
  },
  facts: [
    { label: 'Minimum net worth', value: 'CAD 500,000', note: 'CAD 300,000 for agriculture' },
    { label: 'Minimum investment', value: 'CAD 150,000' },
    { label: 'Ownership', value: 'At least 33.3%' },
    { label: 'Language', value: 'CLB 4', note: 'all four skills' },
    { label: 'Age', value: '19 to 59' },
    { label: 'Points needed', value: '65 of 100' },
  ],
  hero: {
    eyebrow: 'Canada · New Brunswick · NBBIS',
    headline: 'New Brunswick: the Entrepreneurial Stream is gone, its successor is open',
    sub: 'New Brunswick replaced its Entrepreneurial Stream with the Business Immigration Stream. The thresholds are among the lowest in Atlantic Canada and you can ask for nomination after six months of operation, but the list of businesses it will not accept is long. We help you pick one it will.',
    cta: { label: 'See whether New Brunswick fits your profile', href: '/contact' },
  },

  sections: [
    {
      heading: 'What is the New Brunswick Business Immigration Stream?',
      body: [
        'The New Brunswick Business Immigration Stream (NBBIS) is the province\'s current route for entrepreneurs. It replaced the Entrepreneurial Stream, whose forms are now kept only for existing clients. You start or buy a business in New Brunswick, run it on a work permit under a Business Performance Agreement, and then ask the province to nominate you for permanent residence.',
        'New Brunswick describes the stream as current and active. Unlike its worker streams, it is not on New Brunswick\'s list of streams with scheduled draws, and no business draw results are published.',
      ],
    },
    {
      heading: 'NBBIS requirements',
      body: ['From the stream page and the official guide (March 2025):'],
      bullets: [
        'Personal net worth of at least CAD 500,000, or CAD 300,000 if you invest in agriculture, verified by a designated third party within 90 days of your invitation. Gifts or inheritances received less than six months before you apply do not count.',
        'An eligible investment of at least CAD 150,000 and control of at least 33.3% of the business equity.',
        'Two years of qualifying experience within the last five, as an owner of at least 51% or as a senior manager running daily operations and supervising at least two employees.',
        'Age 19 to 59, CLB 4 in all four skills, and at least a Canadian high school diploma or its foreign equivalent.',
        'At least one full-time job (30 hours a week or more) for a Canadian citizen or permanent resident who is not you or a family member.',
        'At least 65 of 100 points on the selection grid, and living in New Brunswick 75% of the time, within 100 km of the business.',
      ],
      callout: 'E-commerce and online businesses, consultancies, home-based businesses and B&Bs are among the excluded types. Check your idea against the list before you spend anything on a plan.',
    },
    {
      heading: 'From EOI to nomination: the steps',
      bullets: [
        '1. Write the business plan and submit a free EOI on the Immigration New Brunswick portal. It stays valid for 12 months.',
        '2. If invited, submit the full application within 90 calendar days.',
        '3. Interview, if New Brunswick asks for one (no interpreters are allowed).',
        '4. Sign the Business Performance Agreement within 60 days and receive a work permit support letter. Apply to IRCC and move to New Brunswick.',
        '5. Report your arrival within one month and open the business within nine months.',
        '6. After at least six consecutive months of operation, request nomination. A site visit and an interview follow.',
        '7. Apply to IRCC for permanent residence. The guide also requires one year of operation within two years of your arrival.',
      ],
      body: ['New Brunswick does not publish processing times for individual applications.'],
    },
    {
      heading: 'Exploratory visit and points',
      body: [
        'For most applicants the exploratory visit is optional and worth 5 of the 25 business-plan points: at least five full business days in New Brunswick within the 12 months before you apply. If you are investing in agriculture it is mandatory, and must happen before you submit your EOI.',
      ],
    },
    {
      heading: 'Government fees',
      body: [
        'The EOI is free. The application fee is a non-refundable CAD 2,000, with no extra charge for family members. There is no deposit in the current stream. IRCC charges its own work permit and permanent residence fees.',
      ],
    },
    {
      heading: 'Where we come in',
      body: [
        'We are not immigration lawyers or licensed consultants, and we do not file applications. We mentor the founder: choosing a business that is not on the excluded list, the business plan and financial model the province scores, the exploratory visit, and interview preparation. For the legal filing, work with a licensed representative.',
      ],
    },
  ],

  faqs: [
    {
      q: 'Is the New Brunswick Entrepreneurial Stream still open?',
      a: 'No. It was replaced by the New Brunswick Business Immigration Stream (NBBIS), which is current and active. The old stream\'s forms are kept only for existing clients.',
    },
    {
      q: 'What are the investment and net worth requirements for NBBIS?',
      a: 'A net worth of at least CAD 500,000 (CAD 300,000 for agriculture) and an eligible investment of at least CAD 150,000, with at least 33.3% ownership.',
    },
    {
      q: 'Does New Brunswick hold business draws?',
      a: 'No business draws are published. New Brunswick\'s scheduled draws cover its Skilled Worker, Express Entry and Strategic Initiative streams.',
    },
    {
      q: 'When can I request nomination in New Brunswick?',
      a: 'After at least six consecutive months of operating the business under your Business Performance Agreement. The guide also requires one year of operation within two years of arrival.',
    },
    {
      q: 'Can I run an online business under NBBIS?',
      a: 'No. E-commerce and online businesses, consultancies, home-based businesses and B&Bs are among the excluded business types.',
    },
  ],

  closing: [
    { label: 'Compare the five entrepreneur provinces', href: '/pnp' },
    { label: 'Talk to us about your business case', href: '/contact' },
    { label: 'All destinations', href: '/country' },
  ],

  sources: [
    { label: 'Government of New Brunswick — Business Immigration Stream', url: 'https://www.gnb.ca/en/topic/family-home-community/immigration/provincial-nominee-program/business-immigration-stream.html' },
    { label: 'NB Business Immigration Stream guide, March 2025 (PDF)', url: 'https://www.gnb.ca/content/dam/GNB3/t/fhc-fmc/immigration/docs/nb-business-immigration-stream-guide.pdf' },
    { label: 'Government of New Brunswick — Provincial Nominee Program', url: 'https://www.gnb.ca/en/topic/family-home-community/immigration/provincial-nominee-program.html' },
    { label: 'Government of New Brunswick — Invitation and selection rounds', url: 'https://www.gnb.ca/en/topic/family-home-community/immigration/invitation-selection-rounds.html' },
  ],
};
