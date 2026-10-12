// ============================================================================
// content/en/usa-o-1a.ts
// "O-1A for founders" — English twin of content/fa/usa-o-1a.ts. Same facts,
// same corrections (one-year extensions, 8 CFR 214.2(o)(13) on immigrant
// intent); the two move together.
// ============================================================================
import type { FaPage } from '@/lib/fa/content';
import { USA_IRAN_STATUS_EN } from '@/lib/usa/travel-ban';

export const page: FaPage = {
  path: '/usa/o-1a',
  title: 'O-1A Visa for Startup Founders — the 8 Criteria and How to Build Three',
  description:
    'The O-1A visa for startup founders: the eight USCIS criteria in plain language, which three are realistic for a founder, how long it lasts and how extensions really work, how it sits with a green card, and the passport question that comes first.',
  keywords: ['O-1A visa for founders', 'O-1 visa startup founder', 'O-1A criteria', 'O-1A self-petition own company', 'extraordinary ability visa founder'],
  updated: '2026-10-12',
  status: USA_IRAN_STATUS_EN,
  entity: { name: 'O-1A Individuals with Extraordinary Ability', provider: 'USCIS', country: 'United States' },
  facts: [
    { label: 'Criteria needed', value: '3 of 8', note: 'or one major internationally recognised award' },
    { label: 'Lottery or annual cap', value: 'None' },
    { label: 'Initial validity', value: 'Up to 3 years' },
    { label: 'Extensions', value: 'Up to 1 year each', note: 'same activity; a new event needs a new petition' },
    { label: 'Filed green-card petition', value: 'Not a ground to deny', note: '8 CFR 214.2(o)(13)' },
    { label: 'Who files', value: 'US employer or agent', note: 'your own US company can be the employer' },
  ],
  hero: {
    eyebrow: 'United States · O-1A',
    headline: 'O-1A: the visa for founders who built the evidence first',
    sub: 'No lottery, no annual cap, and your own company can file. In exchange it asks for three of eight USCIS criteria, each backed by a document a stranger can verify. This guide says which criteria are realistic for a founder, and how they get built in nine to twelve months.',
    cta: { label: 'Score your own criteria', href: '/usa/assessment' },
  },

  sections: [
    {
      heading: 'What the O-1A actually is',
      body: [
        'The O-1A is a temporary US work visa for people with "extraordinary ability" in the sciences, education, business or athletics. For a founder, the business category is where the case is made.',
        'Three things separate it from the H-1B. There is no lottery and no annual cap. The US company you founded can be the petitioning employer, as long as the employer–employee relationship is real — for example, a board that could remove you. And if you work across several clients or projects, a US agent can file one petition covering them.',
        '"Extraordinary" does not mean famous. In law it means you are among the small percentage who have risen to the top of the field — and you show it with documents, not description.',
      ],
    },
    {
      heading: 'The eight criteria, read as a founder',
      body: ['You need at least three of these eight (or a one-time major international award). They are ordered from most to least realistic for a founder:'],
      bullets: [
        'Press: published material about you or your work in major media or a respected trade publication. Paid placements and your own blog do not count.',
        'Judging: judging the work of others — a startup competition, an accelerator selection panel, a grant panel, peer review.',
        'Critical role: a critical or essential role at an organisation with a distinguished reputation. Your own company can qualify, if its reputation is documented.',
        'Original contribution: original work of major significance that is used outside your own company. A good product is not enough; its effect on others has to be shown.',
        'Award: a nationally or internationally recognised prize for excellence.',
        'Membership: membership in an association that requires outstanding achievement and is judged by recognised experts.',
        'Authorship: scholarly articles in professional journals or major media.',
        'High salary: compensation that is high relative to others in the field. Weak as a third criterion — better as a supplement.',
      ],
      callout: 'For most founders the three realistic criteria are press, judging and a critical role. All three can be built deliberately in nine to twelve months.',
    },
    {
      heading: 'Counting criteria is not enough',
      body: [
        'USCIS reviews in two steps. First: does each piece of evidence actually meet the criterion as defined? Then: taken together, does the evidence show this person is at the top of the field?',
        'That is why three strong exhibits beat six average ones. A single weak exhibit can colour the reading of the whole file.',
      ],
    },
    {
      heading: 'Validity and extensions: what usually gets said wrong',
      body: [
        'The initial petition is approved for up to three years. After that, extensions to continue the same activity are granted for up to one year at a time.',
        'A new event or activity — a new company, a new role — can support a new petition and a fresh period of up to three years. "The O-1 renews in three-year increments" is not accurate.',
        'There is no overall cap on years in O-1 status. As long as the activity and the evidence continue, extensions remain possible.',
      ],
    },
    {
      heading: 'O-1A and the green card',
      body: [
        'The O-1 has no foreign-residence requirement. Under 8 CFR 214.2(o)(13), filing an immigrant petition for you is not a ground to deny the O-1. In practice, the O-1A is a common way to enter and keep building toward EB-1A or EB-2 NIW.',
        'The EB-1A criteria resemble the O-1A list, but the bar is much higher and requires sustained acclaim. The evidence you build for the O-1A, if it keeps growing, becomes the foundation of the green-card case.',
      ],
      callout: '"The O-1A is not dual intent", as some summaries put it, is misleading. The label is not used for O-1, but the rule does the same job.',
    },
    {
      heading: 'When to bring in an attorney',
      body: ['A simple rule that immigration attorneys in this field use too:'],
      bullets: [
        'No criterion complete: too early. This is the time to build evidence.',
        'Two criteria complete and working on a third: time to consult.',
        'Nine months or less to filing: time to assemble the petition — ideally before you relocate, close a round or make your first hire.',
      ],
    },
    {
      heading: 'Where we fit',
      body: [
        'We are not US immigration attorneys and we do not file petitions. A US-licensed immigration attorney files.',
        'Our work comes before the attorney: assessing the profile, a nine-to-twelve-month plan to build three strong criteria (judging, press, a critical role, measurable impact), and one evidence data room the attorney can build the petition straight from.',
      ],
    },
  ],

  faqs: [
    {
      q: 'Can my own company sponsor me for an O-1A?',
      a: 'Yes. Your US company can be the petitioning employer as long as the employer–employee relationship is real — for example, a board or investors who can control your work. The exact structure is for your attorney to set.',
    },
    {
      q: 'How long does an O-1A last, and how is it extended?',
      a: 'Up to three years initially. Extensions to continue the same activity are up to one year at a time. A new event or activity can support a new petition with a fresh period of up to three years.',
    },
    {
      q: 'Can I apply for a green card while on an O-1A?',
      a: 'Yes. The O-1 has no foreign-residence requirement, and the regulations say a filed immigrant petition is not a ground to deny the O-1. Many founders enter on an O-1A and later file EB-1A or EB-2 NIW.',
    },
    {
      q: 'Does Y Combinator or a top accelerator count as the membership criterion?',
      a: 'Not on its own. The membership criterion needs an association whose admission requires outstanding achievement, judged by recognised experts. Accelerator admission may support other criteria.',
    },
    {
      q: 'Can an Iranian national get an O-1A?',
      a: 'On an Iranian passport alone, visa issuance is currently suspended: the presidential proclamation suspends both immigrant and non-immigrant visas for Iranian nationals. Iranians with a second citizenship, such as Canadian, should check their position with a US attorney.',
    },
    {
      q: 'How long does the O-1A take?',
      a: 'With three strong criteria ready, assembling the petition takes weeks to a few months, and premium processing gets a USCIS decision within 15 business days. If the criteria still need building, nine to twelve months is realistic.',
    },
  ],
  closing: [
    { label: 'US readiness assessment', href: '/usa/assessment' },
    { label: 'Compare every US route', href: '/country/usa' },
    { label: 'Talk to us', href: '/contact' },
  ],
};
