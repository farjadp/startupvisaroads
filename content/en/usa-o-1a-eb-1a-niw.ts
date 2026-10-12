// ============================================================================
// content/en/usa-o-1a-eb-1a-niw.ts
// English twin of content/fa/usa-o-1a-eb-1a-niw.ts.
// ============================================================================
import type { FaPage } from '@/lib/fa/content';
import { USA_IRAN_STATUS_EN } from '@/lib/usa/travel-ban';

export const page: FaPage = {
  path: '/usa/o-1a-eb-1a-niw',
  title: 'O-1A vs EB-1A vs EB-2 NIW — Which Should a Founder File First?',
  description:
    'O-1A, EB-1A and EB-2 NIW compared for startup founders: which is temporary and which a green card, what each requires, and the order that makes sense for three common founder profiles.',
  keywords: ['O-1A vs EB-1A', 'EB-1A vs NIW', 'O-1 vs NIW founder', 'which US visa for startup founder', 'EB-1A or NIW first'],
  updated: '2026-10-12',
  status: USA_IRAN_STATUS_EN,
  facts: [
    { label: 'O-1A', value: 'Temporary visa', note: '3 of 8 criteria; employer or agent files' },
    { label: 'EB-1A', value: 'Green card', note: '3 of 10 criteria with sustained acclaim; self-petition' },
    { label: 'EB-2 NIW', value: 'Green card', note: 'advanced degree or equivalent + the three Dhanasar prongs' },
  ],
  hero: {
    eyebrow: 'United States · Routes compared',
    headline: 'O-1A, EB-1A or NIW: the real question is the order, not the choice',
    sub: 'These three are not rivals. They feed on the same kind of evidence and, for most founders, follow one another. This page sets out what each one asks for and where to start.',
    cta: { label: 'See where you stand', href: '/usa/assessment' },
  },

  sections: [
    {
      heading: 'The three routes at a glance',
      body: [],
      bullets: [
        'O-1A is a temporary work visa. It needs three of eight USCIS criteria. A US employer — which can be your own company — or an agent files. Initial validity is up to three years.',
        'EB-1A is a green card you petition for yourself. Its criteria resemble the O-1A list, but it is three of ten at a much higher standard: sustained national or international acclaim and a place at the very top of the field.',
        'EB-2 NIW is also a self-petitioned green card. The base requirement is an advanced degree, or a bachelor\'s plus five years of progressive experience, and the case is judged on the three Matter of Dhanasar prongs: the work has substantial merit and national importance, you are well positioned to advance it, and on balance it benefits the US to waive the job-offer requirement.',
      ],
    },
    {
      heading: 'The core difference: your standing, or your work\'s importance',
      body: [
        'O-1A and EB-1A are about you: are you at the top of your field? NIW is about the work: does what you will do in the US matter nationally, and are you well placed to do it?',
        'So a founder with no press or awards yet, but with a master\'s degree and a venture in health, energy, AI or advanced manufacturing, may be closer to NIW than to O-1A. Funding and fame are not standalone NIW requirements, but a real business plan and evidence of progress are.',
      ],
    },
    {
      heading: 'A sensible order for three common profiles',
      body: [],
      bullets: [
        'You have press, judging or a critical role: O-1A first, to enter and work. Keep building, and file EB-1A once the acclaim is sustained. Consider NIW in parallel.',
        'You have an advanced degree and work in a field of national importance, but no O-1A evidence: take NIW seriously, and build the O-1A criteria alongside it.',
        'Neither is ready: nine to twelve months of evidence-building. Building three O-1A criteria usually strengthens an NIW case at the same time.',
      ],
    },
    {
      heading: 'Why temporary first, green card second',
      body: [
        'A filed immigrant petition is not a ground to deny an O-1, so holding an O-1A while building a green-card case is not a conflict. The temporary visa lets you work in the US and build exactly the evidence that strengthens an EB-1A.',
        'The reverse — filing EB-1A early on thin evidence — can produce a denial you will later have to explain.',
      ],
    },
  ],

  faqs: [
    {
      q: 'What is the difference between O-1A and EB-1A?',
      a: 'O-1A is a temporary work visa needing three of eight criteria; EB-1A is a green card needing three of ten at a much higher standard, with sustained acclaim. The criteria look alike; the weight of evidence does not.',
    },
    {
      q: 'Is NIW easier than EB-1A?',
      a: 'It depends on the profile. EB-1A is about your standing at the top of the field; NIW is about the national importance of your work and needs an advanced degree or its equivalent. For many professionals and founders, NIW is the more realistic one.',
    },
    {
      q: 'Can I file EB-1A and NIW at the same time?',
      a: 'Yes, two immigrant petitions can be filed concurrently and some applicants do. Weigh the cost and strategy with your attorney.',
    },
    {
      q: 'Do I need funding or fame for NIW?',
      a: 'Not as standalone requirements. For a founder, investment, revenue, customers and expert support help show you are well positioned, and a real business plan is needed.',
    },
  ],
  closing: [
    { label: 'US readiness assessment', href: '/usa/assessment' },
    { label: 'EB-2 NIW guide', href: '/usa/eb2-niw' },
    { label: 'Talk to us', href: '/contact' },
  ],
};
