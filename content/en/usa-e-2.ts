// ============================================================================
// content/en/usa-e-2.ts
// "E-2 for founders" — English twin of content/fa/usa-e-2.ts. No dollar
// figure on purpose: the law sets no minimum (9 FAM 402.9-6(D)) and every
// number on this site needs an official source. The two locales move together.
// ============================================================================
import type { FaPage } from '@/lib/fa/content';

export const page: FaPage = {
  path: '/usa/e-2',
  title: 'E-2 Treaty Investor Visa for Founders — What "Substantial" Really Means',
  description:
    'The US E-2 visa for startup founders: which nationalities qualify (Canadian yes, Iranian no), why there is no legal minimum investment, what "at risk" and "control" mean, and the hidden cost of pairing E-2 with a green-card petition.',
  keywords: ['E-2 visa for founders', 'E-2 minimum investment', 'E-2 visa Canadian founder', 'E-2 treaty countries', 'E-2 gifted funds'],
  updated: '2026-10-12',
  entity: { name: 'E-2 Treaty Investor', provider: 'U.S. Department of State', country: 'United States' },
  facts: [
    { label: 'Nationality', value: 'Treaty country only', note: 'Canada yes; Iran no' },
    { label: 'Legal minimum investment', value: 'None', note: 'measured against the cost of the business' },
    { label: 'Ownership', value: 'At least 50%', note: 'or operational control' },
    { label: 'Spouse', value: 'Authorised to work' },
    { label: 'Direct path to a green card', value: 'None' },
    { label: 'Intent', value: 'To depart when status ends' },
  ],
  hero: {
    eyebrow: 'United States · E-2 Treaty Investor',
    headline: 'E-2: the visa for founders who put their own money at risk',
    sub: 'No lottery, no legal minimum, and renewable for as long as the business is real and operating. But it has two doors and both must open: a nationality with a US treaty, and capital that is genuinely at risk.',
    cta: { label: 'See which doors your passport opens', href: '/usa/assessment' },
  },

  sections: [
    {
      heading: 'Who the E-2 is for',
      body: [
        'The E-2 is a temporary visa for an investor who has put a substantial amount of capital into a real US business and will direct it.',
        'The first question is nationality, not money. The investor must be a national of a country with a qualifying treaty of commerce and navigation with the US, and at least 50% of the business must be owned by nationals of that country. The State Department publishes the list; Canada, the UK, Germany, France and Türkiye are on it. Iran is not: the US gave notice terminating the 1955 Treaty of Amity in October 2018, and since January 2020 E-1 and E-2 are no longer available to Iranian nationals.',
      ],
    },
    {
      heading: 'How much is "substantial"?',
      body: [
        'The law sets no figure. The investment is compared with the total cost of establishing or buying that particular business: a low-cost business needs a higher share of its total cost invested, an expensive one a lower share.',
        'Any number you hear as "the E-2 minimum" is an attorney\'s experience, not the law. What makes the case is how well the capital matches the business plan.',
      ],
    },
    {
      heading: 'The four conditions that make the case',
      body: [],
      bullets: [
        'At risk: the money must be spent or irrevocably committed — lease, equipment, hires, inventory. Funds sitting in a bank account are not an investment.',
        'Owned and controlled: the funds must belong to the investor and be under their control. Gifted funds are acceptable when ownership has genuinely passed to you and the source is documented. Loans secured by the business\'s own assets do not count.',
        'Real and operating: a business that produces goods or services. Passive investment — land, shares — is not enough.',
        'Not marginal: the business must have the capacity to earn more than a living for the investor and family, or make a significant economic contribution, such as jobs.',
      ],
    },
    {
      heading: 'E-2 and the green card: the hidden cost',
      body: [
        'The E-2 has no direct path to a green card, and the holder must intend to depart when status ends.',
        'Many founders enter on an E-2 and build an EB-1A or EB-2 NIW case in parallel. The strategy is common, but not free. A filed immigrant petition cannot on its own be the reason to deny E status, but at the next consular renewal the officer still has to be satisfied that the intent to depart exists, and that gets harder once a petition is on file. Time the two with your attorney.',
      ],
      callout: 'The E-2 is tied to the business. If it closes or pivots out of recognition, the basis for the visa goes with it.',
    },
    {
      heading: 'For Iranian founders, the route runs through Canada',
      body: [
        'An Iranian passport cannot support an E-2, and non-immigrant visa issuance to Iranian nationals is currently suspended in any case. An Iranian who has become a Canadian citizen, however, qualifies on the Canadian passport.',
        'That is why, for most founders we work with, the realistic order is Canada first, then Canadian citizenship, then the US. Dual nationals should have both passports reviewed by a US attorney before acting.',
      ],
    },
  ],

  faqs: [
    {
      q: 'What is the minimum investment for an E-2 visa?',
      a: 'There is no legal minimum. The investment is measured against the total cost of the business and must be enough to make its success likely. Figures quoted as minimums are attorneys\' experience, not the law.',
    },
    {
      q: 'Can Iranian nationals get an E-2 visa?',
      a: 'Not on Iranian nationality. The US terminated the Treaty of Amity with Iran, so Iran is no longer an E-2 treaty country. An Iranian who holds the citizenship of a treaty country, such as Canada, can apply on that citizenship.',
    },
    {
      q: 'Is Canadian permanent residence enough for an E-2?',
      a: 'No. The E-2 is based on citizenship, not residence. Canadian PR does not qualify; Canadian citizenship does.',
    },
    {
      q: 'Can the E-2 investment be a gift from family?',
      a: 'Yes, if ownership has genuinely passed to you, the funds are under your control, and the source is documented.',
    },
    {
      q: 'Can my spouse work on an E-2?',
      a: 'Yes. The spouse of an E-2 holder is authorised to work incident to status.',
    },
  ],
  closing: [
    { label: 'US readiness assessment', href: '/usa/assessment' },
    { label: 'Compare every US route', href: '/country/usa' },
    { label: 'Talk to us', href: '/contact' },
  ],
};
