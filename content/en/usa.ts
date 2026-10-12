// ============================================================================
// content/en/usa.ts
// /en/country/usa — hub of the US cluster, English twin of content/fa/usa.ts.
// Replaced the 2025 bespoke "National Interest" page, whose claims ("the red
// carpet is rolled out") no longer matched the law or the travel restrictions.
// Same verification as the Persian hub (2026-10-12); the two move together.
// ============================================================================
import type { FaPage } from '@/lib/fa/content';
import { USA_IRAN_STATUS_EN } from '@/lib/usa/travel-ban';

export const page: FaPage = {
  path: '/country/usa',
  title: 'US Visa Routes for Startup Founders — Seven Routes Compared',
  description:
    'Seven US visa routes for startup founders on one page: O-1A, E-2, TN, H-1B, L-1A, EB-1A and EB-2 NIW. Which fit the founder personally, which depend on nationality, where the $100,000 H-1B payment stands, and the passport question that comes first.',
  keywords: ['US visa for startup founders', 'immigrate to USA as a founder', 'US startup visa', 'founder visa USA', 'O-1A E-2 NIW comparison'],
  updated: '2026-10-12',
  status: USA_IRAN_STATUS_EN,
  entity: { name: 'US visa routes for startup founders', provider: 'USCIS', country: 'United States' },
  facts: [
    { label: 'Best temporary fit for a founder', value: 'O-1A', note: 'no lottery; your own company can file' },
    { label: 'Green cards without an employer', value: 'EB-1A and EB-2 NIW', note: 'self-petitioned' },
    { label: 'Nationality-dependent', value: 'E-2 and TN', note: 'Iran no; Canada yes' },
    { label: 'Annual H-1B cap', value: '85,000', note: '65,000 regular + 20,000 US master\'s' },
    { label: 'NIW threshold', value: 'Advanced degree', note: 'or a bachelor\'s + 5 years\' progressive experience' },
    { label: 'Iranian passport alone', value: 'Visas suspended', note: 'Proclamation 10998, from 1 Jan 2026' },
  ],
  hero: {
    eyebrow: 'United States · Founder routes',
    headline: 'The US for founders: seven routes, one question first',
    sub: 'The US has no "startup visa". Founders choose among seven temporary and permanent routes, each with its own conditions. The first question, though, is not the visa — it is the passport. This page puts all seven side by side and links to the full guide for each.',
    cta: { label: 'US readiness assessment', href: '/usa/assessment' },
  },

  sections: [
    {
      heading: 'Passport first, visa second',
      body: [
        'Three of the seven routes turn directly on nationality. The E-2 is only for nationals of treaty countries, and Iran has been off that list since 2020. The TN is only for Canadian and Mexican citizens. And since 1 January 2026, US visa issuance of any kind is suspended for Iranian passport holders.',
        'For an Iranian with a second citizenship the picture changes completely. A Canadian citizen qualifies for the E-2 on the Canadian passport, and the restriction on Iranian nationals does not cover travel on another country\'s passport. That is why, for most founders we work with, the realistic order is Canada, then Canadian citizenship, then the US.',
      ],
      callout: 'Dual nationals: have both passports reviewed by a US immigration attorney before you act.',
    },
    {
      heading: 'Five temporary visas',
      body: [],
      bullets: [
        'O-1A, extraordinary ability: the strongest temporary route for a founder. Three of eight USCIS criteria, no lottery, and your own company can be the employer. Up to three years initially.',
        'E-2, treaty investor: personal capital at risk in a real business. No legal minimum. Spouse may work. No direct path to a green card.',
        'TN, USMCA professionals: Canadian and Mexican citizens only, in USMCA-listed occupations. It does not cover a founder who controls the company; useful for early hires.',
        'H-1B, specialty occupation: a lottery under an 85,000 cap, weighted by wage level from fiscal year 2027. Since January 2025 a founder owning more than 50% can be the beneficiary, but the initial approval and first extension are each capped at 18 months.',
        'L-1A, new office: for a founder with an operating company abroad who has worked there for at least one of the past three years. It needs real physical premises, and the first approval is at most one year.',
      ],
    },
    {
      heading: 'Two green cards without an employer',
      body: [],
      bullets: [
        'EB-1A: the O-1A logic at a much higher standard — three of ten criteria and sustained acclaim. You petition for yourself.',
        'EB-2 NIW: a master\'s degree, or a bachelor\'s plus five years\' experience, and the three Dhanasar prongs — substantial merit and national importance, being well positioned to advance the work, and a net benefit to the US in waiving the job offer. Funding and fame are not standalone requirements.',
      ],
      callout: 'The common advice from attorneys in this field: enter on a temporary visa and build evidence first, then file for the green card.',
    },
    {
      heading: 'The $100,000 H-1B payment: where it stands',
      body: [
        'A September 2025 proclamation imposed a $100,000 payment on certain new H-1B petitions. On 8 June 2026 a federal court in Massachusetts vacated the DHS and State Department guidance implementing it, and on 24 July the First Circuit refused to stay that ruling.',
        'It is not over. A court in Washington, DC upheld the payment in December 2025 as within the President\'s authority, and that appeal is pending. A September 2026 proclamation extended the payment to 21 September 2027, and USCIS says it will collect it if the court order is lifted.',
      ],
    },
    {
      heading: 'Which route for which founder',
      body: [],
      bullets: [
        'You have documented press, judging or a critical role: O-1A, then EB-1A once the acclaim is sustained.',
        'You are a treaty-country national with personal capital: E-2, with NIW or EB-1A in parallel.',
        'You hold an advanced degree and work in a field of national importance: EB-2 NIW.',
        'You run an operating company in your home country: L-1A, with a real office and team.',
        'You lack O-1 criteria but have a genuine specialty role: H-1B, while building the O-1A criteria.',
        'You are in the US on F-1 or an employer visa: your current status first; working outside it puts it at risk.',
      ],
    },
    {
      heading: 'Where we fit',
      body: [
        'We are not US immigration attorneys and we do not file petitions. Petitions and legal advice are the work of a US-licensed immigration attorney.',
        'Our value comes before the attorney: assessing the profile, building the evidence over nine to twelve months (judging, press, a critical role, measurable impact), business plans for E-2 and NIW, and handing the attorney an organised file.',
      ],
    },
  ],

  faqs: [
    {
      q: 'Does the US have a startup visa?',
      a: 'Not in the Canadian or European sense. Founders use existing routes: O-1A, E-2, L-1A and H-1B as temporary visas, and EB-1A or EB-2 NIW as green cards.',
    },
    {
      q: 'Can Iranian nationals get a US visa right now?',
      a: 'Not on an Iranian passport alone. Proclamation 10998 has suspended immigrant and non-immigrant visas for Iranian nationals since 1 January 2026. Dual nationals travelling on a passport from a country not on the list are not covered by the suspension.',
    },
    {
      q: 'What is the best US visa for a startup founder?',
      a: 'For most founders the O-1A, because there is no lottery and their own company can be the employer — but it needs evidence. With a treaty nationality and personal capital, the E-2 is the other option.',
    },
    {
      q: 'Is Canadian permanent residence enough for a TN or E-2?',
      a: 'No. Both are based on citizenship. Canadian citizenship is required, not PR.',
    },
    {
      q: 'Has the $100,000 H-1B fee been abolished?',
      a: 'Its implementing guidance was vacated by a Massachusetts court in June 2026, but appeals are pending, a DC court upheld it, and a September 2026 proclamation extended it to September 2027. Check the current position with an attorney before filing.',
    },
  ],
  closing: [
    { label: 'US readiness assessment', href: '/usa/assessment' },
    { label: 'Founder readiness programme', href: '/usa/founder-readiness' },
    { label: 'Talk to us', href: '/contact' },
  ],
};
