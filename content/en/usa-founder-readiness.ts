// ============================================================================
// content/en/usa-founder-readiness.ts
// English twin of content/fa/usa-founder-readiness.ts — see its header for
// the three deliberate choices: the name, no fee keyed to approval, and no
// refund undertaking. No figure appears anywhere on this page.
// ============================================================================
import type { FaPage } from '@/lib/fa/content';
import { USA_IRAN_STATUS_EN } from '@/lib/usa/travel-ban';

export const page: FaPage = {
  path: '/usa/founder-readiness',
  title: 'US Founder Petition Readiness Programme — O-1A, EB-1A and NIW',
  description:
    'A nine-to-twelve-month programme that builds the evidence for an O-1A, EB-1A or EB-2 NIW petition before the attorney: profile assessment, evidence plan, business plan and data room. Petitions are filed by a US-licensed immigration attorney.',
  keywords: ['O-1A petition preparation', 'O-1 evidence building founder', 'NIW business plan', 'EB-1A evidence strategy', 'US visa mentorship founder'],
  updated: '2026-10-12',
  status: USA_IRAN_STATUS_EN,
  entity: { name: 'US founder petition readiness', provider: 'Startup Visa Roads', country: 'United States', type: 'Service' },
  facts: [
    { label: 'Duration', value: '9–12 months', note: 'depending on where you start' },
    { label: 'Who files', value: 'A US-licensed attorney', note: 'not us' },
    { label: 'Final output', value: 'Evidence data room', note: 'ready to hand to the attorney' },
    { label: 'Fee structure', value: 'Fixed per deliverable', note: 'never tied to visa approval' },
  ],
  hero: {
    eyebrow: 'United States · Readiness programme',
    headline: 'The attorney files the petition. We build its evidence.',
    sub: 'An O-1A, EB-1A or NIW petition stands on documents, not prose. Most founders reach an attorney before they have enough of them. This programme is the nine to twelve months before the attorney.',
    cta: { label: 'Start with the assessment', href: '/usa/assessment' },
  },

  sections: [
    {
      heading: 'Who does what, plainly',
      body: [],
      bullets: [
        'Our work: profile assessment, an evidence plan, support while you build it, business plans, and organising every document for the attorney.',
        'The attorney\'s work: legal advice, the final choice of route, drafting and filing the petition, and answering RFEs.',
      ],
      callout: 'We are not US immigration attorneys and we do not give US legal advice. Petitions and legal advice are handled by a US-licensed immigration attorney.',
    },
    {
      heading: 'Four stages',
      body: [],
      bullets: [
        'Assessment: your passport, the O-1A criteria, the NIW threshold and where you are starting from. If the US route is not realistic for you, we say so here.',
        'Evidence plan: which three criteria to build, with what documents, in what order. For most founders, judging, press and a critical role.',
        'Building: monthly support while the evidence is built — from finding judging opportunities to documenting your work\'s effect outside your own company. For E-2 and NIW, a business plan an attorney can argue from.',
        'Handover: an organised data room with every document, an exhibit list per criterion, and a note for the attorney on strengths and weak points.',
      ],
    },
    {
      heading: 'Fees',
      body: [
        'The fee is fixed per deliverable and agreed in writing before work starts. No part of our fee depends on visa approval, because the filing and the decision are not in our hands. The attorney\'s fee is separate and agreed directly between you and the attorney.',
      ],
    },
    {
      heading: 'Who it is for',
      body: [
        'A founder whose citizenship opens the US routes — Canadian citizenship, for example — and who either has two O-1A criteria and is working on a third, or holds an advanced degree and works in a field of national importance.',
        'If you hold only an Iranian passport, US visa issuance is currently suspended. We would point you to the Canadian or European routes instead; the evidence you build for those carries over to the US later.',
      ],
    },
  ],

  faqs: [
    {
      q: 'Do you file US visa petitions?',
      a: 'No. Petitions and legal advice are the work of a US-licensed immigration attorney. Our work is building and organising the evidence before the attorney.',
    },
    {
      q: 'Do you guarantee approval?',
      a: 'No. Nobody can guarantee a USCIS decision. That is why our fee is tied to defined deliverables, not to approval.',
    },
    {
      q: 'Why is there no price on the site?',
      a: 'Because the scope depends on where you start. After the assessment we set out the fee for each deliverable, in writing, before work begins.',
    },
    {
      q: 'Can I join with an Iranian passport?',
      a: 'You can, but while the restriction stands and you hold no second citizenship, a US petition cannot proceed to a visa. We go through that plainly before anything starts.',
    },
  ],
  closing: [
    { label: 'US readiness assessment', href: '/usa/assessment' },
    { label: 'Why good petitions fail', href: '/usa/why-petitions-fail' },
    { label: 'Talk to us', href: '/contact' },
  ],
};
