// ============================================================================
// content/en/pnp-pei.ts
// /en/pnp/pei — PEI PNP Business Work Permit Stream. Checked on
// princeedwardisland.ca on 2026-10-12 (see `sources`). The headline fact is
// the draw table: zero entrepreneur invitations in 2026. Keep that in front
// of the requirements until PEI invites business candidates again.
// No VisaRoads price appears here, by rule.
// ============================================================================
import type { FaPage } from '@/lib/fa/content';

export const page: FaPage = {
  path: '/pnp/pei',
  title: 'PEI PNP Entrepreneur (Work Permit Stream) 2026: Zero Invitations',
  description:
    'PEI\'s Business Work Permit Stream in 2026: no entrepreneur has been invited in any of the ten draws this year. The requirements ($600,000 net worth, $150,000 investment, CLB 4) and what to do instead.',
  keywords: [
    'pei pnp entrepreneur',
    'pei business work permit stream',
    'pei pnp business impact',
    'pei entrepreneur draw 2026',
    'prince edward island entrepreneur immigration',
  ],
  updated: '2026-10-12',
  entity: {
    name: 'PEI Provincial Nominee Program — Business Work Permit Stream',
    provider: 'Government of Prince Edward Island',
    country: 'Canada',
  },
  status: {
    tone: 'paused',
    title: 'No entrepreneur invited in 2026',
    body: 'PEI has not announced a pause, and the stream is still listed. But its draw table shows zero business invitations in all ten draws from 15 January to 7 October 2026, against 1,319 for workers, and PEI says it is prioritising skilled workers in sectors such as healthcare and trades. Plan as if this stream were closed until a draw says otherwise.',
    cta: { label: 'Compare the open provinces', href: '/pnp' },
  },
  facts: [
    { label: 'Entrepreneur invitations in 2026', value: '0', note: '10 draws, 15 January to 7 October' },
    { label: 'Minimum net worth', value: 'CAD 600,000' },
    { label: 'Investment', value: 'CAD 150,000', note: 'within 12 months of landing' },
    { label: 'Language', value: 'CLB 4' },
    { label: 'Age', value: '21 to 59' },
    { label: 'Application fee', value: 'CAD 10,000', note: 'partly refundable before the interview' },
  ],
  hero: {
    eyebrow: 'Canada · Prince Edward Island · PEI PNP',
    headline: 'PEI: the entrepreneur stream nobody is being invited to',
    sub: 'Prince Edward Island has one entrepreneur pathway, the Business Work Permit Stream. On paper it is open. In 2026 it has invited no one. This page sets out the requirements for the day PEI resumes, and the provinces that are inviting entrepreneurs now.',
    cta: { label: 'See the provinces that are inviting', href: '/pnp' },
  },

  sections: [
    {
      heading: 'Is the PEI entrepreneur stream open in 2026?',
      body: [
        'Officially, yes: the Work Permit Stream page still describes the stream with no closure or pause notice. In practice, no. PEI\'s Expression of Interest draw table has a column for business work permit entrepreneur invitations, and it reads 0 in every one of the ten draws held from 15 January to 7 October 2026. Over the same period PEI issued 1,319 invitations to workers and Express Entry candidates.',
        'PEI says it is currently selecting and prioritising skilled workers in higher-demand sectors such as healthcare and trades, and it reserves the right to limit intake or exclude streams from draws.',
      ],
      callout: 'If someone is selling you a PEI entrepreneur file today, ask them to show you the last PEI draw that invited an entrepreneur.',
    },
    {
      heading: 'Work Permit Stream requirements',
      body: ['For when PEI invites entrepreneurs again, the published requirements are:'],
      bullets: [
        'A verifiable personal net worth of at least CAD 600,000 from legal sources. Business equity counts only if you own at least 70% of the business, and only up to CAD 180,000.',
        'Age 21 to 59 at the time of application, at least a secondary school education, and CLB/NCLC 4.',
        'Transferable management skills and past employment or business ownership experience.',
        'Net worth verification by a designated verifier (Grant Thornton or MNP), engaged within 15 days of the invitation and reported within 90 days.',
        'An interview with the Office of Immigration, where the Performance Agreement is signed.',
      ],
    },
    {
      heading: 'What the Performance Agreement commits you to',
      bullets: [
        'Invest at least CAD 150,000 in the business within 12 months of landing in PEI.',
        'Operate the business for at least twelve consecutive months, with at least CAD 75,000 in eligible operating expenses.',
        'Be physically present in PEI at least 274 days a year, and report in person within 30 days of arriving.',
        'A new start-up must be 100% yours unless PEI deems it of significant economic benefit. When buying an existing business, you need at least one third of the equity or an equity investment of at least CAD 1,000,000.',
      ],
      body: ['The current documents mention no deposit. The obligations are these:'],
    },
    {
      heading: 'Steps and fees',
      bullets: [
        '1. Create an EOI profile (free). It stays active for 6 months and is scored out of 200, plus a 10-point bilingual bonus.',
        '2. If invited, submit the application within 60 days, with the net worth verification.',
        '3. Interview and sign the Performance Agreement.',
        '4. Receive a letter of support and apply to IRCC for a work permit.',
        '5. Arrive, operate the business for at least 12 months, then request nomination and apply to IRCC for permanent residence.',
      ],
      body: [
        'The application fee is CAD 10,000, paid to Island Investment Development Inc. PEI refunds it in full if your file is not accepted, refunds CAD 7,500 if you are declined or withdraw before the interview, and keeps it all after the interview.',
      ],
    },
    {
      heading: 'What to do instead',
      body: [
        'If you are drawn to Atlantic Canada, Nova Scotia invited entrepreneurs four times in 2026 and New Brunswick\'s business stream is active and assessed outside the draw system. If your budget is closer to CAD 300,000 of net worth, Alberta\'s Rural Entrepreneur Stream is open and asks for a CAD 100,000 investment. We compare all five on one page.',
      ],
    },
    {
      heading: 'Where we come in',
      body: [
        'We are not immigration lawyers or licensed consultants, and we do not file applications. We mentor founders through the business side of a provincial entrepreneur file, and part of that is telling you when a stream is not inviting anyone. For the legal filing, work with a licensed representative.',
      ],
    },
  ],

  faqs: [
    {
      q: 'Is the PEI PNP entrepreneur stream open in 2026?',
      a: 'It is still listed and PEI has not announced a pause, but it invited zero entrepreneurs in all ten 2026 draws up to 7 October. PEI says it is prioritising skilled workers.',
    },
    {
      q: 'What is the minimum net worth for the PEI Work Permit Stream?',
      a: 'CAD 600,000, verified by a designated verifier. Business equity counts only if you own at least 70% of the business, and only up to CAD 180,000.',
    },
    {
      q: 'How much do I have to invest in PEI?',
      a: 'At least CAD 150,000 within 12 months of landing, with at least CAD 75,000 in eligible operating expenses over at least 12 consecutive months of operation.',
    },
    {
      q: 'Does PEI still require an escrow deposit?',
      a: 'The current guide and Performance Agreement mention no deposit. The application fee is CAD 10,000, refundable in full if your file is not accepted and in part before the interview.',
    },
    {
      q: 'When are PEI draws held?',
      a: 'Roughly monthly, usually on the third Thursday. PEI publishes the results, including the number of business invitations, on its Expression of Interest draws page.',
    },
  ],

  closing: [
    { label: 'Compare the five entrepreneur provinces', href: '/pnp' },
    { label: 'Nova Scotia Entrepreneur stream', href: '/pnp/nova-scotia' },
    { label: 'Talk to us', href: '/contact' },
  ],

  sources: [
    { label: 'Government of PEI — Expression of Interest draws (2026)', url: 'https://www.princeedwardisland.ca/en/information/office-of-immigration/expression-of-interest-draws' },
    { label: 'Government of PEI — Work Permit Stream', url: 'https://www.princeedwardisland.ca/en/information/office-of-immigration/work-permit-stream' },
    { label: 'Government of PEI — Immigrate to PEI as an entrepreneur', url: 'https://www.princeedwardisland.ca/en/topic/immigrate-to-pei-as-an-entrepreneur' },
    { label: 'Government of PEI — Work Permit Stream Performance Agreement (PDF)', url: 'https://www.princeedwardisland.ca/sites/default/files/forms/work_permit_pa_oct_2018.pdf' },
  ],
};
