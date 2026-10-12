// ============================================================================
// content/en/usa-why-petitions-fail.ts
// English twin of content/fa/usa-why-petitions-fail.ts.
// ============================================================================
import type { FaPage } from '@/lib/fa/content';

export const page: FaPage = {
  path: '/usa/why-petitions-fail',
  title: 'Why Strong Founder O-1A and EB-1A Petitions Get RFEs and Denials',
  description:
    'Six recurring patterns behind RFEs and denials in founder O-1A, EB-1A and NIW petitions: the weak exhibit that sinks the file, salary as the third criterion, patents without uptake, impact only inside your own company, and courtesy recommendation letters.',
  keywords: ['O-1A denial reasons', 'O-1A RFE founder', 'EB-1A denied why', 'NIW RFE startup', 'extraordinary ability petition mistakes'],
  updated: '2026-10-12',
  hero: {
    eyebrow: 'United States · RFEs and denials',
    headline: 'Good founders get denied too. Usually for one of six reasons.',
    sub: 'Most petitions that draw an RFE or a denial do not have a weak founder behind them. They chose or presented the evidence badly. Learn these six patterns before you build the file, not after the USCIS letter.',
    cta: { label: 'Score your profile', href: '/usa/assessment' },
  },

  sections: [
    {
      heading: '1. One weak exhibit sinks the file',
      body: [
        'The instinct is to send everything. It works the other way. The officer reads the file as a whole, and one weak exhibit — an article on an unknown site, an award everyone receives — raises questions about the rest.',
        'A shorter file of stronger exhibits wins. If an exhibit needs a paragraph of your own explanation to persuade, it probably does not belong.',
      ],
    },
    {
      heading: '2. Salary as the third criterion',
      body: [
        'High salary is an O-1A criterion, but it is usually weak for a startup founder: early-stage founder salaries tend to be low, and a salary you pay yourself is not a fair comparison with the market.',
        'If your third criterion is salary, treat it as a supplement and build another.',
      ],
    },
    {
      heading: '3. Patents without outside uptake',
      body: [
        'A patent is not, on its own, an original contribution of major significance. It shows something new was registered. What carries the criterion is others citing it, industry using it, or other companies licensing it.',
      ],
    },
    {
      heading: '4. Impact only inside your own company',
      body: [
        'Revenue growth, a funding round and happy customers matter to your company. For "original contribution" and "critical role", USCIS asks what your work changed outside it.',
        'Strong evidence usually comes from outside: another company adopting your method, an industry report naming your product, data showing the market moved because of your work.',
      ],
    },
    {
      heading: '5. Courtesy recommendation letters',
      body: [
        'A letter that only says "she is exceptional" carries little weight, especially from a colleague or your own investor. A useful letter is specific: who the writer is, how they know the work, and exactly what the work changed.',
        'A letter is corroboration, not a substitute. A claim no objective document supports is worth little.',
      ],
    },
    {
      heading: '6. An accelerator as the membership criterion',
      body: [
        'Getting into Y Combinator or a top accelerator is a real achievement, but the membership criterion needs an association whose rules require outstanding achievement for admission, judged by recognised experts. Most accelerators are not defined that way.',
        'The achievement may still help other criteria, such as a critical role or the organisation\'s reputation.',
      ],
    },
    {
      heading: 'The prevention: an evidence data room from day one',
      body: [
        'Keep every piece of evidence in one place from the start, like an investor data room: a link and PDF of each press item, every judging invitation, revenue and user data, investor letters, and every place others have used your work.',
        'That is the work of our readiness programme: before the attorney, we build, test and organise the evidence, so the petition stands on strong exhibits.',
      ],
      callout: 'We are not US immigration attorneys. Petitions and RFE responses are the work of a US-licensed attorney.',
    },
  ],

  faqs: [
    {
      q: 'What is an RFE, and does it mean a denial?',
      a: 'An RFE (Request for Evidence) is USCIS asking for more evidence. It is not a denial, but it means the officer is not yet persuaded. A good RFE response is usually better evidence, not more explanation.',
    },
    {
      q: 'Does sending more evidence improve the odds?',
      a: 'Not necessarily. The file is read as a whole, and weak evidence can dilute strong evidence. Shorter files of solid exhibits tend to do better.',
    },
    {
      q: 'Is a patent enough for the original-contribution criterion?',
      a: 'No. It needs evidence of impact: citations, industry use, or licences to other companies.',
    },
    {
      q: 'Who should write my recommendation letters?',
      a: 'The strongest come from independent experts who have not worked directly with you but know your work and can say exactly what it changed.',
    },
  ],
  closing: [
    { label: 'US readiness assessment', href: '/usa/assessment' },
    { label: 'Founder readiness programme', href: '/usa/founder-readiness' },
    { label: 'Talk to us', href: '/contact' },
  ],
};
