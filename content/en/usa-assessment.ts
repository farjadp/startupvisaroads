// ============================================================================
// content/en/usa-assessment.ts
// English twin of content/fa/usa-assessment.ts. The form is
// components/usa/UsaAssessment.tsx.
// ============================================================================
import type { FaPage } from '@/lib/fa/content';

export const page: FaPage = {
  path: '/usa/assessment',
  title: 'US Readiness Assessment for Founders — O-1A and EB-2 NIW in Two Minutes',
  description:
    'Find out in two minutes where you stand on the US route: which O-1A criteria you can document, whether you meet the EB-2 NIW threshold, and which doors your passport opens.',
  keywords: ['O-1A eligibility check', 'am I eligible for NIW', 'O-1 visa assessment founder', 'US visa readiness test'],
  updated: '2026-10-12',
  hero: {
    eyebrow: 'United States · Readiness assessment',
    headline: 'Before the attorney, know where you stand',
    sub: 'Three questions: your passport, the O-1A criteria, and the NIW threshold. The result shows as you answer, and you send nothing to see it. If you choose, send it to us — we read it ourselves and tell you what to build first.',
    cta: { label: 'Start the assessment', href: '/usa/assessment#assessment' },
  },

  sections: [
    {
      heading: 'What this assessment measures',
      body: [
        'This is not a legal opinion and it does not replace an attorney. It makes three things clear: whether your passport lets you into these routes at all, how many O-1A criteria you can document today, and whether you meet the EB-2 NIW threshold.',
        'Tick a criterion only if a document a stranger could check proves it. If in doubt, leave it. An optimistic assessment only wastes your time.',
      ],
    },
  ],

  faqs: [
    {
      q: 'Is the assessment free?',
      a: 'Yes. The result shows immediately, and sending it to us costs nothing.',
    },
    {
      q: 'Does the result mean I qualify for a visa?',
      a: 'No. It is a readiness filter, not a legal opinion. The decision on a petition rests with a US immigration attorney and, finally, with USCIS.',
    },
    {
      q: 'What happens after I send it?',
      a: 'We read it ourselves and reply by email within a few working days. If the US route is not realistic for you, we say so.',
    },
  ],
  closing: [
    { label: 'Founder readiness programme', href: '/usa/founder-readiness' },
    { label: 'Compare every US route', href: '/country/usa' },
    { label: 'Talk to us', href: '/contact' },
  ],
};
