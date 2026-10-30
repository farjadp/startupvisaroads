// ============================================================================
// content/en/pnp-saskatchewan.ts
// /en/pnp/saskatchewan — SINP Entrepreneur and Farm are permanently closed.
// Checked on saskatchewan.ca on 2026-10-29 (see `sources`): "Effective March
// 27, 2025, the Saskatchewan Immigrant Nominee Program has permanently closed
// all Entrepreneur and Farm immigration pathways." The old page told readers
// SINP was "aggressively recruiting"; this one says it is closed, first.
// The old thresholds are deliberately not repeated. No VisaRoads price here.
// ============================================================================
import type { FaPage } from '@/lib/fa/content';

export const page: FaPage = {
  path: '/pnp/saskatchewan',
  title: 'Saskatchewan Entrepreneur PNP (SINP): Permanently Closed',
  description:
    'Saskatchewan permanently closed the SINP Entrepreneur and Farm pathways on 27 March 2025. No new EOIs or applications are accepted. What happens to files in progress, and the provinces still taking entrepreneurs.',
  keywords: [
    'saskatchewan entrepreneur pnp',
    'sinp entrepreneur',
    'sinp entrepreneur closed',
    'sinp farm owner operator',
    'saskatchewan business immigration',
  ],
  updated: '2026-10-29',
  entity: {
    name: 'Saskatchewan Immigrant Nominee Program — Entrepreneur and Farm categories',
    provider: 'Government of Saskatchewan',
    country: 'Canada',
  },
  status: {
    tone: 'closed',
    title: 'Closed permanently on 27 March 2025',
    body: 'Saskatchewan says: "Effective March 27, 2025, the Saskatchewan Immigrant Nominee Program has permanently closed all Entrepreneur and Farm immigration pathways." No new applications or Expressions of Interest are accepted and no invitations are issued. Applications already in the system are processed to completion.',
    cta: { label: 'See the provinces taking entrepreneurs', href: '/pnp' },
  },
  facts: [
    { label: 'Entrepreneur category', value: 'Closed', note: 'permanently, since 27 March 2025' },
    { label: 'Farm Owner and Operator', value: 'Closed', note: 'including the Young Farmer stream' },
    { label: 'Applications already submitted', value: 'Processed to completion' },
  ],
  hero: {
    eyebrow: 'Canada · Saskatchewan · SINP',
    headline: 'Saskatchewan has closed its entrepreneur and farm routes for good',
    sub: 'The SINP Entrepreneur category and the Farm Owner and Operator category were among the cheaper provincial routes for founders and farmers. Saskatchewan closed both permanently in March 2025. This page sets out what that means and where to look instead.',
    cta: { label: 'Compare the open provinces', href: '/pnp' },
  },

  sections: [
    {
      heading: 'Is the SINP Entrepreneur category open?',
      body: [
        'No, and Saskatchewan has said it will not reopen. Its Entrepreneur and Farm Owner and Operator pages both carry the same notice: effective 27 March 2025, the SINP has permanently closed all Entrepreneur and Farm immigration pathways. No new applications are accepted, no new Expressions of Interest are considered, and no further invitations to apply are issued.',
        'The word that matters is "permanently". This is not a pause between draws. Saskatchewan\'s skilled-worker streams are separate and are not covered here.',
      ],
      callout: 'If someone offers to file a Saskatchewan entrepreneur or farm application today, they are offering something the province no longer accepts.',
    },
    {
      heading: 'If you already applied',
      body: [
        'Saskatchewan says all existing applications in its system will continue to be processed to completion. If you hold a Business Performance Agreement, its terms still apply to you. For questions about your own file, the SINP gives a contact email and phone line on the same page.',
      ],
    },
    {
      heading: 'Where a founder can still go',
      body: [
        'Several provinces still take entrepreneurs: Alberta, Manitoba, Nova Scotia and New Brunswick, which we compare side by side, and British Columbia and Newfoundland and Labrador. Prince Edward Island still lists its stream but has invited no entrepreneur in 2026, and Ontario closed its entrepreneur stream in 2026.',
        'Every one of these requires you to live in the province and run the business there. Pick the province first and the stream second.',
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
      q: 'Is the Saskatchewan entrepreneur program still open?',
      a: 'No. Saskatchewan permanently closed all SINP Entrepreneur and Farm immigration pathways effective 27 March 2025.',
    },
    {
      q: 'Is the SINP Farm Owner and Operator category open?',
      a: 'No. It closed permanently on 27 March 2025 together with the Entrepreneur category, including the Young Farmer stream.',
    },
    {
      q: 'What happens to an SINP entrepreneur application I already submitted?',
      a: 'Saskatchewan says all existing applications in its system will continue to be processed to completion.',
    },
    {
      q: 'Which provinces still have an entrepreneur stream?',
      a: 'Alberta, Manitoba, Nova Scotia, New Brunswick, British Columbia and Newfoundland and Labrador. PEI\'s stream is listed but invited no entrepreneur in 2026, and Ontario closed its stream in 2026.',
    },
  ],

  closing: [
    { label: 'Compare the open entrepreneur provinces', href: '/pnp' },
    { label: 'Manitoba Business Investor Stream', href: '/pnp/manitoba' },
    { label: 'Talk to us', href: '/contact' },
  ],

  sources: [
    { label: 'Government of Saskatchewan — SINP Entrepreneur (closure notice, effective 27 Mar 2025)', url: 'https://www.saskatchewan.ca/residents/moving-to-saskatchewan/live-in-saskatchewan/by-immigrating/saskatchewan-immigrant-nominee-program/browse-sinp-programs/entrepreneur/applicants-entrepreneurs' },
    { label: 'Government of Saskatchewan — SINP Farm Owners and Operators (closure notice)', url: 'https://www.saskatchewan.ca/residents/moving-to-saskatchewan/live-in-saskatchewan/by-immigrating/saskatchewan-immigrant-nominee-program/browse-sinp-programs/farm-owner-and-operator/applicants-farm-owners-and-operators' },
  ],
};
