// ============================================================================
// content/en/pnp-alberta.ts
// /en/pnp/alberta — the AAIP entrepreneur streams. Every figure checked on
// alberta.ca on 2026-10-12 (see `sources`); provincial thresholds and
// allocations change during the year, so re-check before editing `updated`.
// No VisaRoads price appears here, by rule.
// ============================================================================
import type { FaPage } from '@/lib/fa/content';

export const page: FaPage = {
  path: '/pnp/alberta',
  title: 'Alberta Rural Entrepreneur Stream (AAIP) 2026: Requirements and Steps',
  description:
    'AAIP entrepreneur streams in 2026: Rural Entrepreneur ($300,000 net worth, $100,000 investment), Graduate and Foreign Graduate Entrepreneur, the 60-nomination business allocation, and every step from EOI to nomination.',
  keywords: [
    'alberta rural entrepreneur stream',
    'aaip entrepreneur stream requirements',
    'alberta pnp allocation 2026',
    'alberta pnp draw 2026 entrepreneur',
    'alberta foreign graduate entrepreneur stream',
  ],
  updated: '2026-10-12',
  entity: {
    name: 'Alberta Advantage Immigration Program — Rural Entrepreneur Stream',
    provider: 'Government of Alberta',
    country: 'Canada',
  },
  facts: [
    { label: 'Minimum net worth', value: 'CAD 300,000', note: 'Rural Entrepreneur Stream' },
    { label: 'Minimum investment', value: 'CAD 100,000', note: 'from your own (or your spouse\'s) equity' },
    { label: 'Ownership', value: '51%', note: '100% when buying an existing business' },
    { label: 'Language', value: 'CLB 4' },
    { label: 'Business experience', value: '3 years as owner-manager', note: 'or 4 years as senior manager, within the past 10 years' },
    { label: '2026 entrepreneur allocation', value: '60 nominations', note: '36 issued by 7 October 2026' },
  ],
  hero: {
    eyebrow: 'Canada · Alberta · AAIP entrepreneur streams',
    headline: 'Alberta: a small town signs for you before the province does',
    sub: 'The Rural Entrepreneur Stream is Alberta\'s main door for business owners from abroad. It asks for less money than most provinces, but it starts somewhere unusual: a rural community has to back your plan in writing before you can even enter the pool. We build that plan, the community pitch and the interview with you.',
    cta: { label: 'See whether Alberta fits your profile', href: '/contact' },
  },

  sections: [
    {
      heading: 'What is the Alberta Rural Entrepreneur Stream?',
      body: [
        'The Rural Entrepreneur Stream (RES) is part of the Alberta Advantage Immigration Program (AAIP). It lets an experienced business owner start or buy a business in a rural Alberta community, run it on a work permit, and then be nominated by Alberta for permanent residence. A community with fewer than 100,000 people, outside the Calgary and Edmonton census metropolitan areas, counts as rural.',
        'Alberta says it is currently accepting Expressions of Interest (EOIs) under the stream. It is a points-based pool: Alberta may invite the highest-ranking candidates, and nothing is guaranteed by meeting the minimums.',
      ],
    },
    {
      heading: 'Rural Entrepreneur Stream requirements',
      body: ['The minimums Alberta publishes for the stream:'],
      bullets: [
        'Net worth of at least CAD 300,000.',
        'An investment of at least CAD 100,000 from your own equity or your spouse\'s. Alberta cut this from CAD 200,000 on 3 April 2023.',
        'At least 51% ownership of a new business, or 100% of an existing business you buy (succession).',
        'At least 3 years as an active business owner-manager, or 4 years as a senior manager, within the past 10 years.',
        'Language at CLB/NCLC 4 and at least a high school education, assessed by an ECA if earned abroad.',
        'At least one full-time job for a Canadian citizen or permanent resident. A succession purchase does not need a new job.',
        'An exploratory visit to the community (in person or by video) and a Community Support Letter from a participating rural community, both before your EOI.',
      ],
      callout: 'The Community Support Letter is the real filter. Communities sign for plans that fill a gap they actually have, which is why the plan comes before the paperwork.',
    },
    {
      heading: 'From EOI to nomination: the steps and deadlines',
      body: ['Alberta sets a clock at almost every stage:'],
      bullets: [
        '1. Submit an EOI. It stays in the pool for 12 months.',
        '2. If you are invited, submit the full Business Application within 90 days.',
        '3. If approved, sign the Business Performance Agreement within 14 days.',
        '4. Alberta issues a letter supporting a two-year work permit. Apply to IRCC within 3 months and arrive within 12 months.',
        '5. Report your arrival within 30 days, then file progress reports every 6 months while you run the business.',
        '6. After at least 12 months of operating the business under the agreement, submit the Final Report for Nomination.',
        '7. If Alberta nominates you, the nomination is valid for 6 months: apply to IRCC for permanent residence inside that window.',
      ],
      callout: 'Already running a business in rural Alberta for at least a year? Alberta lets established owners skip the performance agreement and apply for nomination directly.',
    },
    {
      heading: 'AAIP allocation 2026 and entrepreneur draws',
      body: [
        'Alberta\'s total nomination allocation for 2026 is 6,603, after IRCC added 200 spaces in August. Of that, 60 nominations are for the entrepreneur streams. On 7 October 2026 Alberta reported 36 issued, 24 remaining and 214 business applications in process.',
        'Alberta publishes draw results for its worker streams, not for its entrepreneur streams: business applications are evaluated as they are received, and no entrepreneur draw dates or cut-off scores are published. If you see an "Alberta entrepreneur draw" score online, it did not come from alberta.ca.',
        'In August 2026 Alberta also published guidance on "economic establishment" for the entrepreneur streams. The eligibility criteria did not change, but Alberta now checks after approval that the business keeps meeting that test.',
      ],
    },
    {
      heading: 'Graduate and Foreign Graduate Entrepreneur streams',
      body: [
        'Two other AAIP entrepreneur streams are open. The Graduate Entrepreneur Stream is for graduates of an Alberta publicly funded post-secondary institution (at least two years of full-time study) who hold a valid post-graduation work permit. It asks for CLB 7 and 34% ownership, and has no mandatory minimum investment.',
        'The Foreign Graduate Entrepreneur Stream (formerly the Foreign Graduate Start-Up Visa Stream) is for founders with a degree from outside Canada completed in the last 10 years. It needs CLB 5, six months of business experience, a recommendation from an AAIP-designated agency, and an investment of CAD 100,000 in an urban centre or CAD 50,000 in a regional area.',
      ],
    },
    {
      heading: 'What it costs in government fees',
      body: [
        'Alberta charges CAD 200 for each EOI and a non-refundable CAD 3,500 for the Business Application. Federal work permit and permanent residence fees are charged separately by IRCC. Your own investment in the business is not a fee: it is capital you put into a company you own.',
      ],
    },
    {
      heading: 'Where we come in',
      body: [
        'We are not immigration lawyers or licensed consultants, and we do not file applications. We mentor the founder: choosing a business that a rural community actually needs, the business plan and financial model Alberta assesses, the community pitch, and preparation for the questions you will be asked. For the legal filing, work with a licensed representative.',
      ],
    },
  ],

  faqs: [
    {
      q: 'What is the minimum investment for the Alberta Rural Entrepreneur Stream?',
      a: 'CAD 100,000 from your own or your spouse\'s equity, with a minimum net worth of CAD 300,000. Alberta lowered the investment from CAD 200,000 on 3 April 2023.',
    },
    {
      q: 'Is the Alberta Rural Entrepreneur Stream open in 2026?',
      a: 'Yes. Alberta says it is currently accepting Expressions of Interest under the stream. The 2026 entrepreneur allocation is 60 nominations, of which 36 had been issued by 7 October 2026.',
    },
    {
      q: 'Does Alberta publish entrepreneur stream draw scores?',
      a: 'No. Alberta publishes draws for its worker streams only. Business applications are evaluated as they are received, and no entrepreneur draw dates or minimum scores are published.',
    },
    {
      q: 'Do I need a Community Support Letter?',
      a: 'Yes. Before you submit an EOI you need an exploratory visit to the community and a Community Support Letter from a participating rural Alberta community.',
    },
    {
      q: 'How long do I have to run the business before Alberta nominates me?',
      a: 'At least 12 months under the Business Performance Agreement, on a work permit Alberta supports for two years. You then file the Final Report for Nomination.',
    },
    {
      q: 'Can I apply if my English is basic?',
      a: 'The Rural Entrepreneur Stream minimum is CLB 4 in English or French. The Foreign Graduate Entrepreneur Stream asks for CLB 5 and the Graduate Entrepreneur Stream for CLB 7.',
    },
  ],

  closing: [
    { label: 'Compare the five entrepreneur provinces', href: '/pnp' },
    { label: 'Talk to us about your business case', href: '/contact' },
    { label: 'All destinations', href: '/country' },
  ],

  sources: [
    { label: 'Alberta.ca — AAIP Rural Entrepreneur Stream: eligibility', url: 'https://www.alberta.ca/aaip-rural-entrepreneur-stream-eligibility' },
    { label: 'Alberta.ca — AAIP Rural Entrepreneur Stream: how to apply', url: 'https://www.alberta.ca/aaip-rural-entrepreneur-stream-how-to-apply' },
    { label: 'Alberta.ca — AAIP processing information (allocations and nominations table)', url: 'https://www.alberta.ca/aaip-processing-information' },
    { label: 'Alberta.ca — AAIP updates', url: 'https://www.alberta.ca/aaip-updates' },
    { label: 'Alberta.ca — AAIP Graduate Entrepreneur Stream: eligibility', url: 'https://www.alberta.ca/aaip-graduate-entrepreneur-stream-eligibility' },
    { label: 'Alberta.ca — AAIP Foreign Graduate Entrepreneur Stream: eligibility', url: 'https://www.alberta.ca/aaip-foreign-graduate-entrepreneur-stream-eligibility' },
  ],
};
