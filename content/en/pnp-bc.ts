// ============================================================================
// content/en/pnp-bc.ts
// /en/pnp/bc — BC PNP Entrepreneur Immigration, the Base and Regional streams.
// The English twin of content/fa/pnp-bc.ts: same sections, same order, same
// figures, checked 2026-11-01 against:
//   - welcomebc.ca, "For entrepreneurs and businesses" (eligibility table
//     last updated 10 Sep 2025; fees; the two process walkthroughs;
//     processing times).
//   - welcomebc.ca, "Invitations to apply" (Entrepreneur Immigration table,
//     last updated 29 Oct 2026): eleven draws from 13 Jan to 20 Oct 2026.
//   - BC PNP, Entrepreneur Immigration – Base Program Guide, effective
//     27 May 2024 (85 pp.). Regional-stream figures come from the guide's
//     "Streams at a Glance" table and the WelcomeBC page; the Regional
//     adaptability sub-tables are NOT reproduced because the Regional guide
//     itself was not in hand.
// Where a figure is our estimate (e.g. "three to four years"), the page says so.
// The Persian page's section on Iranian applicants is framed here as
// applicants from sanctioned countries (e.g. Iran), same facts.
// No VisaRoads price appears here, by rule.
// ============================================================================
import type { FaFaq, FaPage } from '@/lib/fa/content';

/** The questions asked before anyone has read anything. */
const COMMON_FAQS: FaFaq[] = [
  {
    q: 'Is the BC PNP entrepreneur stream open in 2026?',
    a: 'Yes, and it is active. From 13 January to 20 October 2026 the province held eleven invitation rounds, roughly one a month. In the Base stream each round invited 7 to 15 people with a lowest score of 115 to 121. In the Regional stream most rounds invited fewer than 5 people, with a lowest score of 105 to 129.',
  },
  {
    q: 'What are the minimum net worth and investment for BC PNP?',
    a: 'In the Base stream, a net worth of at least CAD 600,000 and an eligible personal investment of at least CAD 200,000. In the Regional stream, CAD 300,000 and CAD 100,000. Net worth includes the assets of your spouse and dependent children; the minimum investment must come from your own money, not a loan.',
  },
  {
    q: 'What is the difference between the Base and Regional streams?',
    a: 'The Regional stream halves the financial thresholds, but it is only for a new business in a participating community outside Metro Vancouver. It requires an exploratory visit and a 90-day community referral before you register, at least 51% ownership and a language result on the day you register, counts management experience only in the last 5 years, and does not accept a co-registrant. The Base stream works anywhere in the province, also accepts buying an existing business, and one-third ownership is enough.',
  },
  {
    q: 'How many points do I need to enter the pool?',
    a: 'Out of 200, the Base stream needs at least 115 points in total and at least 40 in the business concept section; the net worth (5), investment (8) and job creation (4) sections also have their own minimums. The Regional stream needs at least 105 in total, with no separate minimum for the concept. A profile stays in the pool for 180 days.',
  },
  {
    q: 'What are the BC PNP government fees?',
    a: 'CAD 300 to register, CAD 3,500 for the full application and CAD 500 for a request for review, all paid only through the province\'s online portal and non-refundable unless you withdraw before processing starts. The net worth verification report, language test, credential assessment, and IRCC work permit and permanent residence fees are separate.',
  },
  {
    q: 'How much time do I have to spend in British Columbia?',
    a: 'You must be physically in the province for at least 75% of the time you hold the work permit and live within 50 km of your business. If you submit the final report on day 610, that means at least 457 days of presence. You must also be in Canada when you submit the final report and stay until the nomination decision.',
  },
  {
    q: 'How long does it take from registration to permanent residence?',
    a: 'Official times: a registration score within 6 weeks, up to 6 months in the pool, 4 months to apply and 4 months of assessment, up to 12 months to arrive, 18 to 20 months running the business, 4 months to assess the final report, then the IRCC permanent residence file. Altogether usually three to four years. That is our estimate, not an official figure.',
  },
  {
    q: 'What happens to my spouse and children?',
    a: 'Your spouse or partner can get an open work permit and your children study permits for school. At the end, the permanent residence application for you, your spouse and dependent children goes to IRCC together. Your children\'s age for federal requirements is locked in on the date of your initial registration, not the date of nomination.',
  },
];

/** The mechanics that decide a file, from the Base Program Guide. */
const DEEP_DIVE_FAQS: FaFaq[] = [
  {
    q: 'What counts towards net worth and what does not?',
    a: 'Cash and bank accounts, term deposits redeemable within 12 months, real estate, shares, bonds and funds, the value of your share in businesses, pensions and other assets such as jewellery, minus mortgages and debts. A future inheritance does not count. Your share in a company or property must be proven with a legal document such as a title deed or shareholders\' agreement, not by your word. Hiding part of your assets is itself a reason for refusal.',
  },
  {
    q: 'What exactly do "active owner-manager" and "senior manager" mean?',
    a: 'An active owner-manager owned at least 10% of the company and was personally involved on site in day-to-day operations and decision-making; a shareholder who only attends the annual meeting does not count. A senior manager, with less than 10% ownership, supervised at least three full-time employees, had the authority to hire and fire or to recommend it, and held a job classed as TEER 0 or 1 in the National Occupational Classification.',
  },
  {
    q: 'I do not have a post-secondary degree. Can I register?',
    a: 'Only if you were the active owner-manager, for at least 36 of the last 60 months, of a business 100% owned by you, your spouse or your children. Otherwise your education score is zero and the system will not let you register. Language courses such as ESL do not count as post-secondary credentials. If invited, you may also be asked for an Educational Credential Assessment (ECA).',
  },
  {
    q: 'How are the experience and ownership points (24) scored?',
    a: 'Owner-manager experience: under 12 months 0, 12 to 24 months 4, 25 to 36 months 6, 37 to 48 months 12, 49 to 59 months 15, 60 months or more 20 points. Senior manager experience: under 24 months 0, 25 to 48 months 4, 49 to 59 months 8, 60 months or more 12 points. Plus 4 points if you owned 100% of a business for at least 36 of the last 60 months.',
  },
  {
    q: 'How are the net worth and investment points scored?',
    a: 'Net worth (12 points, minimum 5): cash and liquid assets under CAD 50,000 0, 50,000 to 200,000 2, 200,000 to 400,000 3, 400,000 or more 4 points; total net worth 600,000 to 800,000 5, 800,000 to 2 million 6, 2 to 5 million 7, 5 million or more 8 points. Total proposed personal investment (20 points, minimum 8): 200,000 to 400,000 8, 400,000 to 600,000 10, 600,000 to 1 million 11, 1 to 2 million 12, 2 to 4 million 14, 4 to 8 million 16, 8 million or more 20 points.',
  },
  {
    q: 'How are the job creation and regional points scored?',
    a: 'Jobs (12 points, minimum 4): 1 job 4 points, 2 jobs 5, 3 jobs 6, 4 jobs 7, 5 jobs 8, 6 jobs 9, 7 to 9 jobs 10, 10 to 19 jobs 11, 20 jobs or more 12. Your own job and your spouse\'s do not count. Regional development (12 points, no minimum): Mainland/Southwest, meaning Metro Vancouver and its surroundings, 0; Vancouver Island and Coast, and Thompson/Okanagan 6; Cariboo 10; Northeast, Kootenay, Nechako and North Coast 12 points.',
  },
  {
    q: 'How are the adaptability points (40) scored?',
    a: 'Language: below CLB 4 0, CLB 4 four points, CLB 5 or higher 6 points (if you claim language points you must upload a valid result at registration). Education: high school or less 0, associate degree or trades certificate 4, bachelor\'s degree or post-graduate diploma 7, master\'s or doctorate 10. Age: under 25 0, 25 to 34 four, 35 to 44 eight, 45 to 54 six, 55 to 64 four, 65 or older 0. Exploratory visit: no visit or more than 3 years ago 0, 1 to 3 years ago 3, less than a year ago but not to the business region 5, less than a year ago to the same region 8. At least 12 months of legal work or study in Canada in the last 10 years: 8 points.',
  },
  {
    q: 'What exactly is the Business Concept scored on?',
    a: 'Commercial viability, 30 points: business model 10 (unclear 1, acceptable 5, excellent 10), market and product 4, eligible investment 4 (CAD 200,000 to 400,000 1 point up to 800,000 or more 4), substantiation of the investment 6, ownership percentage 4 (100% 4, over 50% 3, 50% or less 0), risk 2 (zero if you have external financing, invest more than half your net worth or have a co-registrant). Transferability of skills, 15 points: based on how closely the industry of your experience matches the NAICS code of the proposed business; owner-manager experience in an unrelated industry 5 points up to more than 60 months of direct experience 15 points; senior manager experience at most 10. Economic benefits, 35 points: key sector and significant economic benefit 23 (neither 3, one 10, one key sector and one benefit 16, one key sector and two benefits 23), job creation plan assessment 6, TEER 0 or 1 jobs up to 6.',
  },
  {
    q: 'Which are the key sectors and the "significant economic benefits"?',
    a: 'Key sectors: aerospace; agrifood, including food and beverage production and processing; clean technology; digital media and entertainment; forestry and wood products; information and communications technology; life sciences; mining; natural gas. Being in one of these sectors must be the core of the concept, not a side line. Significant benefits: buying 100% of an existing business outside Metro Vancouver for owner succession; using a technology or method that similar businesses in the province do not yet commonly use; export-oriented manufacturing (not a trading company); readiness to commercialise a proprietary technology whose research and development is complete; a documented partnership with Indigenous communities; supplying a product or service to an underserved market with proven demand; training and support services for growth in the technology sector.',
  },
  {
    q: 'What are the rules for a partnership with a co-registrant?',
    a: 'Base stream only. Both people register under one concept separately, within 30 days of the first registration, and each must meet every requirement individually: net worth of CAD 600,000, a personal investment of CAD 200,000 from their own money, at least one full-time job. When buying an existing business, each person\'s share of the purchase price counts up to CAD 150,000. Both scores are lowered to the lower of the two, and you lose the 2 risk points. If invited, each application is assessed separately and there is no guarantee both will be approved.',
  },
  {
    q: 'Which expenses count as eligible investment and which do not?',
    a: 'Counted: new equipment, leasehold improvements, new marketing costs, operating costs such as rent and wages up to 6 months for a new business and 3 months for a purchase or franchise, start-up inventory up to 3 months, and buying an existing business up to CAD 150,000 of the value of the business itself. A vehicle only if it is essential, and up to CAD 15,000. Not counted: cash, working capital and reserves, wages for yourself, your family and partners, refundable deposits, buying property and its costs, research and development, and every cost of the immigration file, from a representative\'s fee to the verification report and BC PNP fees.',
  },
  {
    q: 'When should I make the investment? Can I make it earlier?',
    a: 'No investment made before the date of your invitation to apply counts, and the province says explicitly not to make any financial commitment until you have signed the performance agreement and received your work permit; any money you spend before then is at your own risk. After you arrive on the work permit, you have 610 days to make the whole committed investment, and the first full-time job must be created within 420 days.',
  },
  {
    q: 'What exactly does "full-time equivalent job" mean?',
    a: 'At least 30 hours a week and 1,560 hours a year, for a Canadian citizen or permanent resident, as a direct employee at the main business location, not remote. An independent contractor does not count, and neither does anyone who owns 10% or more of the company. For nomination you must show the job was filled for at least 180 consecutive days before the final report and that its wage matches its occupational level.',
  },
  {
    q: 'After the invitation, how is the net worth verification report prepared?',
    a: 'Only after the invitation do you contract one of the approved verification firms, whose list comes with the invitation; do not approach them before you are invited. You give them the federal immigration form Schedule 4A, its Section J (the narrative of how your wealth was accumulated) and all supporting documents. The firm may take up to 60 days and its report is valid for 12 months. Documents not in English need a certified translation, and both the original and the translation must be notarised. Even with a positive report, the final decision on net worth rests with BC PNP.',
  },
  {
    q: 'If my file is refused, what can I do?',
    a: 'You can request a review of three kinds of decision: an ineligible registration, an application refused at stage one, and a nomination refused at stage two. The deadline is 30 days if you live in Canada (holding a work permit counts as living in Canada) and 60 days if you are outside Canada; the fee is CAD 500 and non-refundable. A review only checks that the decision was fair and within a reasonable range; it is not a place for new evidence or a fresh argument. A cancelled nomination cannot be reviewed, and a reviewed decision is final.',
  },
  {
    q: 'What are the consequences of misrepresentation?',
    a: 'Misrepresentation means giving false or misleading information, or withholding information that creates a false picture, whether by you or your representative, at any stage, including in an interview. The result is a refused registration or application, or a cancelled nomination, and the province can refuse to accept any other registration or application from you for up to two years. Exaggerating information to get more points is treated the same way.',
  },
  {
    q: 'Do I need a representative? Who can be a paid representative?',
    a: 'You do not; the program is designed so you can do it yourself, and the province says a file with a representative gets no advantage or speed. If you pay someone to represent you, only a consultant who is a member of the College of Immigration and Citizenship Consultants (CICC) or a lawyer who is a member of a provincial law society is allowed. Any paid help in preparing a registration or application must be declared, and using an unauthorised representative can get the file refused or the nomination cancelled. We are not representatives and do not present ourselves as representatives.',
  },
];

export const page: FaPage = {
  path: '/pnp/bc',
  title: 'BC PNP Entrepreneur Immigration 2026: Base vs Regional, Points, Draws',
  description:
    'BC PNP Entrepreneur 2026: Base (CAD 600,000 net worth, 200,000 investment) vs Regional (300,000 / 100,000), the 200-point grid, monthly draws, steps to PR.',
  keywords: [
    'bc pnp entrepreneur immigration',
    'bc pnp entrepreneur base stream',
    'bc pnp regional stream',
    'bc pnp entrepreneur points calculator',
    'bc pnp entrepreneur draws 2026',
    'british columbia entrepreneur immigration requirements',
    'bc pnp entrepreneur net worth verification',
    'bc pnp performance agreement final report',
  ],
  updated: '2026-11-01',

  image: 'bc',
  imageAlt: 'Aerial view of downtown Vancouver towers on the water, with the Coast Mountains behind',
  gallery: [
    { src: 'bc-2', alt: 'A boat on Okanagan Lake at Kelowna, between mountains and clouds', caption: 'The Regional stream is for communities outside Metro Vancouver; in the Base stream, too, a business in Thompson/Okanagan earns 6 regional points and one in the north of the province 12.' },
    { src: 'bc-3', alt: 'The British Columbia Parliament Buildings in Victoria and sailing boats in the Inner Harbour', caption: 'The province nominates, but permanent residence is granted by the federal immigration department (IRCC), and BC PNP has no authority over that decision.' },
  ],
  entity: {
    name: 'BC Provincial Nominee Program — Entrepreneur Immigration (Base and Regional streams)',
    provider: 'Government of British Columbia',
    country: 'Canada',
  },
  facts: [
    { label: 'Entrepreneur draws in 2026', value: '11 rounds, every month', note: '13 January to 20 October; lowest Base score 115 to 121' },
    { label: 'Minimum net worth', value: 'CAD 600,000', note: 'Regional stream: CAD 300,000' },
    { label: 'Minimum investment', value: 'CAD 200,000', note: 'Regional stream: CAD 100,000' },
    { label: 'Minimum ownership', value: 'One third', note: 'Regional stream: 51%' },
    { label: 'Management experience', value: '3 years as owner-manager or 4 years as senior manager', note: 'in the last 10 years; Regional in the last 5 years' },
    { label: 'Language', value: 'CLB 4 in all four skills', note: 'Regional: on the day you register' },
    { label: 'Score threshold', value: '115 of 200', note: 'and 40 of 80 for the concept; Regional 105' },
    { label: 'Job creation', value: 'At least 1 full-time job', note: 'within 420 days, for a citizen or permanent resident' },
    { label: 'Provincial fees', value: 'CAD 300 + CAD 3,500', note: 'review CAD 500' },
    { label: 'Set-up period', value: '610 days', note: 'final report between day 550 and day 610' },
    { label: 'Presence in the province', value: 'At least 75% of your work-permit time', note: 'living within 50 km of the business' },
  ],
  hero: {
    eyebrow: 'Canada · British Columbia · BC PNP Entrepreneur Immigration',
    headline: 'British Columbia: the province that invites entrepreneurs every month',
    sub: 'In 2026 British Columbia has held eleven entrepreneur invitation rounds, one a month. Its financial threshold is the highest of all the provinces we work with, but it has one thing the others do not: predictability. It has two streams, Base for the whole province including Vancouver, and Regional for smaller communities at half the capital. Working from the program\'s official 85-page guide, this page explains the requirements of both streams, the full 200-point grid, the exact definition of eligible investment and an eligible job, the steps and fees, the performance agreement and final report, and the ways to challenge a decision, and says where we stand beside you on this route.',
    cta: { label: 'Free route assessment', href: '/which-path' },
  },
  status: {
    tone: 'changed',
    title: 'Invitations every month in 2026, with a lowest score of 115 to 121',
    body: 'From 13 January to 20 October 2026 the province held eleven invitation rounds and invited 7 to 15 people each time in the Base stream; the lowest score among those invited was between 115 and 121, almost exactly the pool entry threshold. In the Regional stream most rounds invited fewer than 5 people, with a lowest score of 105 to 129. What it means for you: if you get into the pool, the chance of an invitation is real, not theoretical.',
    cta: { label: '2026 invitation table', href: 'https://www.welcomebc.ca/immigrate-to-b-c/about-the-bc-provincial-nominee-program/invitations-to-apply' },
  },

  sections: [
    {
      heading: 'What BC entrepreneur immigration is and how it leads to permanent residence',
      visual: {
        type: 'phases',
        caption: 'The route in two phases: before arrival and after arrival',
        note: 'Outside Canada up to step 4; from step 5 in the province on a work permit. Permanent residence only at the last step.',
        phases: [
          {
            title: 'Phase 1: before arrival',
            note: 'Registration to work permit',
            steps: [
              'Preparation and business concept',
              'Online registration and a score out of 200',
              'Invitation, net worth verification, full application and interview',
              'Performance agreement and work permit support letter',
            ],
          },
          {
            title: 'Phase 2: after arrival',
            note: 'Up to 610 days in the province',
            steps: [
              'Running the business, investing and creating the job',
              'Final report and nomination certificate',
              'Permanent residence file with IRCC',
            ],
          },
        ],
      },
      body: [
        'The British Columbia Provincial Nominee Program (BC PNP) has two streams for entrepreneurs: the Base stream (Entrepreneur Immigration – Base) and the Regional stream. Both follow the same logic. You submit a business concept, register in the province\'s system and are scored out of 200 points; if invited, you send a full application, sign a performance agreement with the province, arrive on a work permit and actually launch the business, and once you have met your commitments the province nominates you for permanent residence.',
        'The order is the key point: permanent residence is not granted at the start. First a temporary work permit, then up to twenty months of actually running the business in the province, then nomination, and finally the permanent residence file with the federal immigration department (IRCC). The official program guide has one blunt sentence: BC PNP has no authority over whether IRCC grants you permanent residence. Anyone promising direct residence for an investment in British Columbia is describing a program that does not exist.',
        'There is a third stream, Strategic Projects, for foreign companies that open a branch in the province with at least CAD 500,000 in equity investment and bring up to five key staff. This page is not about it.',
      ],
    },
    {
      heading: 'Why British Columbia: the 2026 draws',
      visual: {
        type: 'columns',
        caption: 'Base stream invitations per round, 2026',
        series: 0,
        items: [
          { label: '13 Jan', value: 7, display: '7', sub: '115', tip: '13 January 2026: 7 invitations, lowest score 115' },
          { label: '10 Feb', value: 13, display: '13', sub: '121', tip: '10 February 2026: 13 invitations, lowest score 121' },
          { label: '10 Mar', value: 7, display: '7', sub: '117', tip: '10 March 2026: 7 invitations, lowest score 117' },
          { label: '14 Apr', value: 14, display: '14', sub: '115', tip: '14 April 2026: 14 invitations, lowest score 115' },
          { label: '5 May', value: 8, display: '8', sub: '115', tip: '5 May 2026: 8 invitations, lowest score 115' },
          { label: '2 Jun', value: 15, display: '15', sub: '117', tip: '2 June 2026: 15 invitations, lowest score 117' },
          { label: '30 Jun', value: 14, display: '14', sub: '118', tip: '30 June 2026: 14 invitations, lowest score 118' },
          { label: '28 Jul', value: 10, display: '10', sub: '117', tip: '28 July 2026: 10 invitations, lowest score 117' },
          { label: '25 Aug', value: 11, display: '11', sub: '116', tip: '25 August 2026: 11 invitations, lowest score 116' },
          { label: '22 Sep', value: 10, display: '10', sub: '119', tip: '22 September 2026: 10 invitations, lowest score 119' },
          { label: '20 Oct', value: 10, display: '10', sub: '118', tip: '20 October 2026: 10 invitations, lowest score 118' },
        ],
        subLabel: 'The number under each column: the lowest score among those invited in that round.',
        note: 'Source: welcomebc.ca invitation table, updated 29 October 2026. The Regional stream had fewer than 5 invitations in most rounds, and the exact number is not published.',
      },
      keyFacts: [
        { value: '11', label: 'invitation rounds from 13 January to 20 October 2026' },
        { value: '115 to 121', label: 'lowest score among those invited, Base stream' },
        { value: '7 to 15', label: 'invitations per round, Base stream' },
        { value: 'Fewer than 5', label: 'invitations in most rounds, Regional stream' },
      ],
      table: {
        caption: '2026 entrepreneur invitation rounds (welcomebc.ca, updated 29 October 2026)',
        head: ['Date', 'Base: lowest score / number', 'Regional: lowest score / number'],
        rows: [
          ['13 January', '115 / 7', '—'],
          ['10 February', '121 / 13', '105 / fewer than 5'],
          ['10 March', '117 / 7', '129 / fewer than 5'],
          ['14 April', '115 / 14', '—'],
          ['5 May', '115 / 8', '115 / fewer than 5'],
          ['2 June', '117 / 15', '117 / fewer than 5'],
          ['30 June', '118 / 14', '113 / fewer than 5'],
          ['28 July', '117 / 10', '—'],
          ['25 August', '116 / 11', '116 / 5'],
          ['22 September', '119 / 10', '119 / fewer than 5'],
          ['20 October', '118 / 10', '118 / fewer than 5'],
        ],
        note: 'Total Base stream invitations to 20 October: 119 people over eleven rounds. The province does not publish exact counts below five.',
      },
      body: [
        'From 13 January to 20 October 2026 the province held eleven entrepreneur invitation rounds, roughly once a month. In the Base stream each round invited between 7 and 15 people, and the lowest score among them was between 115 and 121. In other words, in most rounds simply clearing the 115 threshold was enough. In the Regional stream most rounds invited fewer than 5 people, and the lowest score swung from 105 to 129, because registrations are few and one or two strong files push the number up.',
        'This pattern differs from most other provinces: Prince Edward Island has invited no entrepreneurs this year, Nova Scotia has held four rounds, and Alberta does not publish entrepreneur draws. British Columbia costs more, but its queue moves and you can build a timeline around it.',
      ],
      callout: 'Invitations go to eligible registrations received before the round date. Do not rush registration with an incomplete concept: once submitted, the business concept cannot be changed, the profile stays in the pool for six months, and the next round is a month away.',
    },
    {
      heading: 'Base stream versus Regional stream',
      visual: {
        type: 'bars',
        caption: 'The thresholds of the two streams',
        series: ['Base stream', 'Regional stream'],
        shared: false,
        groups: [
          {
            label: 'Minimum net worth (CAD)',
            values: [
              { value: 600000, display: '600,000', series: 0 },
              { value: 300000, display: '300,000', series: 1 },
            ],
          },
          {
            label: 'Minimum personal investment (CAD)',
            values: [
              { value: 200000, display: '200,000', series: 0 },
              { value: 100000, display: '100,000', series: 1 },
            ],
          },
          {
            label: 'Minimum ownership share',
            values: [
              { value: 33.33, display: '33.33%', series: 0 },
              { value: 51, display: '51%', series: 1 },
            ],
          },
          {
            label: 'Score threshold (out of 200)',
            values: [
              { value: 115, display: '115', series: 0 },
              { value: 105, display: '105', series: 1 },
            ],
          },
          {
            label: 'Window for counting management experience (years)',
            values: [
              { value: 10, display: 'last 10 years', series: 0 },
              { value: 5, display: 'last 5 years', series: 1 },
            ],
          },
        ],
        note: 'Each row has its own scale; Regional is half the money, but asks for more ownership and more recent experience.',
      },
      choice: {
        question: 'Can you travel to British Columbia before registering?',
        options: [
          {
            title: 'Yes, I have a visa or a travel history',
            body: 'Both streams are open. In the Regional stream the visit and the community referral are a condition of registration and the thresholds are halved; in the Base stream the same visit earns up to 8 adaptability points if it is to the region of the proposed business.',
          },
          {
            title: 'No, not for now',
            body: 'The Regional stream is effectively closed, because without a visit there is no referral. Plan for the Base stream, calculate your score without the 8 visit points, and take the CAD 600,000 net worth and CAD 200,000 investment as your baseline.',
          },
        ],
      },
      table: {
        caption: 'The two streams at a glance',
        head: ['Criterion', 'Base stream', 'Regional stream'],
        rows: [
          ['Minimum net worth', 'CAD 600,000', 'CAD 300,000'],
          ['Minimum personal investment', 'CAD 200,000', 'CAD 100,000'],
          [
            'Management experience',
            '3 years as owner-manager or 4 years as senior manager, in the last 10 years',
            'The same, in the last 5 years',
          ],
          ['Minimum ownership share', 'One third (33.33%)', '51%'],
          ['Type of business', 'New, or buying and expanding an existing one', 'New only, aligned with community priorities'],
          ['Location', 'Anywhere in the province, including Vancouver', 'Participating communities outside Metro Vancouver'],
          [
            'Exploratory visit and referral',
            'Recommended; no referral needed',
            'Both required; referral valid for 90 days',
          ],
          ['Language CLB 4', 'Proof by the final report', 'Proof on the day you register'],
          ['Co-registrant', 'Allowed', 'Not allowed'],
          [
            'Points',
            '120 self-declared + 80 concept; concept minimum 40; threshold 115',
            '140 + 60; no concept minimum; threshold 105',
          ],
          ['Registration scoring', 'Up to 6 weeks', 'Up to 4 weeks'],
          ['Earliest final report', '18 months after the work permit', '12 months after the work permit'],
        ],
      },
      body: [
        'The Regional stream cuts the financial thresholds exactly in half, but in exchange it ties you to a participating community outside the Metro Vancouver region and requires an exploratory visit and that community\'s referral before you register. The official figures for both streams, from the program guide\'s "Streams at a Glance" table and the WelcomeBC page:',
      ],
      bullets: [
        'Personal net worth: Base at least CAD 600,000; Regional at least CAD 300,000. The assets of your spouse and dependent children count too, and all of it must be legal and provable.',
        'Eligible personal investment: Base at least CAD 200,000; Regional at least CAD 100,000. This money must come from your own net worth, not from a loan.',
        'Management experience: in both streams at least 3 years as an active owner-manager, or 4 years as a senior manager, or a combination of 1 year as owner-manager and 2 years as senior manager. In the Base stream this experience counts within the last 10 years, in the Regional stream within the last 5 years.',
        'Ownership share: Base at least one third (33.33%); Regional at least 51%.',
        'Type of business: in the Base stream a new business or buying and expanding an existing one; in the Regional stream only a new business, aligned with the economic priorities of the community that referred you.',
        'Location: Base anywhere in the province, including Vancouver; Regional only in participating communities outside Metro Vancouver.',
        'Exploratory visit and referral: in the Base stream a visit is recommended but not required and no referral is needed; in the Regional stream both are required and the referral is valid for only 90 days.',
        'Language: both streams CLB 4 in all four skills. In the Base stream you can provide the result up to the final report; in the Regional stream it must be uploaded on the day you register.',
        'Partner: in the Base stream you can enter with a BC PNP co-registrant under one concept; in the Regional stream you cannot. A partnership with a local partner is allowed in both.',
        'Points: Base 120 self-declared and 80 concept, a minimum of 40 for the concept, total threshold 115; Regional 140 self-declared and 60 concept, no concept minimum, total threshold 105.',
        'Registration scoring time: Base up to six weeks; Regional up to four weeks. Final report: Base at the earliest 18 months after the work permit; Regional at the earliest 12 months.',
      ],
      callout: 'If your passport needs a Canadian visitor visa (Iran\'s does, for example), the exploratory visit means a temporary visa application, which is a separate and uncertain file, and BC PNP gives no support letter for it. If you cannot travel, the Regional stream is effectively closed and you should plan for the Base stream.',
    },
    {
      heading: 'Personal requirements: net worth, experience, education, language',
      checklist: {
        title: 'Have these in place before you register',
        intro: 'Every item is verified with documents at the application stage; exaggerating at registration is misrepresentation.',
        items: [
          'The net worth of me, my spouse and dependent children, minus all debts, is at least CAD 600,000 (Regional: CAD 300,000), and I have a document for every item.',
          'My share in any company or property can be proven with a legal document (title deed, shareholders\' agreement); I have not counted a future inheritance.',
          'At least 3 years as an active owner-manager with 10% ownership or more, or 4 years as a senior manager supervising 3 full-time employees in a TEER 0/1 role, in the last 10 years (Regional: 5 years).',
          'I have a post-secondary credential; or I owned 100% of a business for at least 36 of the last 60 months.',
          'I have, or have a plan for, a valid language test (IELTS General, CELPIP, TEF or TCF) with at least CLB 4 in all four skills; in the Regional stream it must be in hand on the day I register.',
          'I am not in Canada without legal status, I have no open refugee claim and no removal order.',
          'I can move at least CAD 200,000 (Regional: CAD 100,000) of my own personal money, not a loan, to Canada and show its source.',
        ],
      },
      body: [
        'Net worth means all the assets of you, your spouse and your dependent children minus all debts: cash and bank accounts, term deposits redeemable within 12 months, real estate, shares, bonds and funds, the current value of your share in businesses, pensions and assets such as jewellery and collections, minus mortgages and personal debts. A future inheritance does not count. Your share in a company or property is accepted only with a legal document. You must declare all of it; hiding part of your assets is itself a reason for refusal.',
      ],
      terms: [
        {
          term: 'Experience',
          text: 'An "active owner-manager" is someone who owned at least 10% of the company and was personally involved on site, in day-to-day operations and in decision-making. A "senior manager" is someone who, with less than 10% ownership, supervised at least three full-time employees, had the authority to hire and fire or to recommend it, and held a job in TEER 0 or 1 of the National Occupational Classification. A shareholder who only attends the annual meeting is not an owner-manager.',
        },
        {
          term: 'Education',
          text: 'A post-secondary credential from a recognised institution (a university degree, a technical diploma or a certificate); or instead, at least 36 of the last 60 months as the active owner-manager of a business 100% owned by you and your family. If invited, you may be asked for an Educational Credential Assessment (ECA). Language courses do not count.',
        },
        {
          term: 'Language',
          text: 'CLB 4 in all four skills, listening, speaking, reading and writing, with one of the approved English or French tests, less than two years old when you submit it. In the Base stream you have until the final report to provide it, but if you want points for it at registration it must be uploaded then.',
        },
        {
          term: 'Immigration status',
          text: 'Anyone who is inadmissible to Canada, is in Canada without legal status or working without a work permit, has an open refugee claim or has a removal order cannot be nominated.',
        },
      ],
    },
    {
      heading: 'Eligible business: what is accepted',
      choice: {
        question: 'Will you build or buy?',
        options: [
          {
            title: 'A new business',
            body: 'Allowed in both streams. The six-digit NAICS code is set in advance and cannot be changed after registration. Up to 6 months of operating costs and 3 months of start-up inventory count as eligible investment.',
          },
          {
            title: 'Buying an existing business',
            body: 'Base stream only. The current owner must have run it for at least five years; up to CAD 150,000 of the value of the business itself counts, plus at least CAD 50,000 of genuine expansion; existing jobs must be kept, and operating costs count for only 3 months.',
          },
        ],
      },
      body: [
        'The business must operate with the main aim of earning profit from selling goods or services and have the potential for lasting commercial success. The province does not pre-approve any concept. Before registering you must have decided the exact type of business and its structure and identified it with a six-digit NAICS code, because after the registration is submitted the concept cannot be changed, and if the business plan at the application stage differs materially from the registration concept, the file is refused.',
        'Buying an existing business (Base stream only): you must name a specific business in the registration, and the current owner must have run it for at least five years. The province counts up to CAD 150,000 of the value of the business itself as eligible investment, not the professional costs of the purchase, and you must spend at least another CAD 50,000 on genuine improvement or expansion: new equipment and technology, upgrading the premises, creating jobs. Ongoing costs and opening a new branch do not count as expansion, and neither does buying property. Existing jobs must be kept.',
        'Ownership: at least one third; if your share is less than one third, you must put in at least CAD 1 million of equity. In the scoring, however, only ownership above 50% earns points.',
      ],
      bullets: [
        'Franchise: allowed if the brand has at least five years of operating history and sound finances, you receive the franchise disclosure document before deciding, and at the application stage you show the franchisor\'s written consent. Buying an existing franchise location only with an expansion plan that matches the franchisor\'s requirements.',
        'Seasonal business: only if you are in the province all year and actively run it.',
        'Agriculture: the business plan must be based on the provincial agriculture ministry\'s farm planning workbook and show contact with local suppliers and service providers.',
        'Regulated industries such as food and aquaculture, cannabis and alcohol, child care and schools, financial services, forestry and mining, health, oil and gas, passenger transport, pharmaceuticals, care facilities and telecommunications: allowed, but if you do not properly address the licensing requirements, the province says it is unlikely to approve the application.',
      ],
    },
    {
      heading: 'Ineligible businesses',
      body: ['Proposing any of these disqualifies the registration at the outset:'],
      bullets: [
        'Any immigration-linked investment scheme, passive investment, or arrangement with a redemption option on the capital.',
        'Bed and breakfasts, hobby farms and home-based businesses.',
        'Payday loans, cheque cashing, money changing and currency exchange, cash machines and pawnbrokers.',
        'Tanning salons, DVD rental, coin-operated laundries and fully automated car washes.',
        'Scrap metal recycling and second-hand goods, unless with value-added services such as repair or refurbishment.',
        'Real estate development, and real estate, insurance or business brokerage.',
        'Pure goods trading (import and export), unless you show added value in the province.',
        'Producing or selling sexual content or services, and any business that could harm the reputation of the program or the provincial government.',
      ],
    },
    {
      heading: 'Eligible investment: which spending counts',
      table: {
        caption: 'Limits on eligible investment',
        head: ['Item', 'Counts?', 'Limit or condition'],
        rows: [
          [
            'New equipment, leasehold improvements, new marketing',
            'Yes',
            'No stated limit; must be necessary for the business',
          ],
          [
            'Ongoing operating costs (rent, wages, utilities)',
            'Yes, limited',
            'Up to 6 months for a new business; up to 3 months for a purchase or franchise',
          ],
          ['Inventory', 'Yes, limited', 'Up to 3 months of start-up inventory; for a purchase, only for a substantially new product'],
          ['Vehicle', 'Only if essential', 'Maximum CAD 15,000'],
          [
            'Purchase price of an existing business',
            'Yes, limited',
            'Up to CAD 150,000 of the business value, excluding professional fees; + at least CAD 50,000 of expansion',
          ],
          ['Cash, working capital, reserves', 'No', '—'],
          ['Wages for yourself, family and partners', 'No', '—'],
          ['Refundable deposits, buying property', 'No', '—'],
          ['Research and development', 'No', '—'],
          [
            'Immigration file costs (representative, verification report, financial statements, BC PNP fees)',
            'No',
            '—',
          ],
          [
            'Any spending before the invitation date',
            'No',
            'And the province advises making no commitment before the performance agreement and work permit',
          ],
        ],
      },
      body: [
        'Eligible investment means the costs necessary to set up and run a new business, or to buy, improve and run an existing one, all going to a single business location: new equipment, leasehold improvements, new marketing costs, start-up inventory, and buying an existing business. It has several limits you need to build into the financial model:',
      ],
      bullets: [
        'Ongoing operating costs such as rent, wages, utilities and accounting: at most 6 months for a new non-franchise business, and 3 months for a purchased business or a new franchise location. When buying a business, these costs do not count towards the CAD 50,000 of expansion.',
        'Inventory: up to 3 months of start-up inventory for a new business; for a purchase, up to 3 months of inventory for a new product that is substantially different from the current products.',
        'Vehicle: only if you prove it is essential, and at most CAD 15,000 of its price.',
        'Not counted: cash, working capital and reserves, wages for yourself, your family and partners, refundable deposits, buying property and its costs, research and development, and all the costs of the immigration file: a representative\'s fee, the net worth verification report, reviewed financial statements and BC PNP fees.',
        'Timing: no investment made before the invitation date counts, and the province explicitly advises making no financial commitment before you sign the performance agreement and receive the work permit.',
        'Source: the minimum investment comes from your personal money, with proof of origin. A bank loan or a partner\'s money is allowed only above the minimum, and the concept must say where it comes from and what it is for.',
      ],
    },
    {
      heading: 'Job creation: one full-time job, precisely defined',
      keyFacts: [
        { value: '1 job', label: 'at least, for a citizen or permanent resident' },
        { value: '30 hours', label: 'a week; 1,560 hours a year' },
        { value: '420 days', label: 'deadline for the first job after arrival' },
        { value: '180 days', label: 'filled continuously before the final report' },
      ],
      checklist: {
        title: 'A job the province accepts',
        intro: 'A committed job must meet all of these to count in the final report.',
        items: [
          'The worker is a Canadian citizen or permanent resident.',
          'They are a direct employee of the company, not an independent contractor.',
          'At least 30 hours a week and 1,560 hours a year (can be split between several continuous employees).',
          'They work at the main business location, not remotely.',
          'They are not me, my spouse or a shareholder with 10% or more.',
          'The job was created within 420 days of arrival.',
          'The wage matches the TEER level of the job and the WorkBC average.',
          'It was filled for at least 180 consecutive days before the final report, and I have payroll and insurance records.',
          'If I bought an existing business, the previous jobs have been kept too.',
        ],
      },
      body: [
        'You must create at least one new, permanent, full-time equivalent job for a Canadian citizen or permanent resident, within 420 days (about 14 months) of arriving on the work permit, and show the business can support long-term employment. Full-time equivalent means at least 30 hours a week and 1,560 hours a year, which can be split between several continuous employees.',
        'An independent contractor does not count; only a direct employee. Anyone who owns 10% or more of the company does not count, and neither does your own job or your spouse\'s. The employee must work at the main business location, not remotely. The wage must match the TEER level of the job, and TEER 0 and 1 jobs earn extra points in the business concept. If you bought an existing business, you must also keep its current jobs.',
        'For nomination you must prove you kept the committed number of jobs continuously filled for at least 180 consecutive days before the final report.',
      ],
    },
    {
      heading: 'The 200-point system: the self-declared section (120 points)',
      visual: {
        type: 'bars',
        caption: 'The Base stream\'s 200 points, broken down',
        series: ['Self-declared (120)', 'Business concept (80)'],
        shared: true,
        groups: [
          { label: 'Adaptability', values: [{ value: 40, display: '40', series: 0 }] },
          { label: 'Economic benefits', values: [{ value: 35, display: '35', series: 1 }] },
          { label: 'Commercial viability', values: [{ value: 30, display: '30', series: 1 }] },
          { label: 'Experience and ownership', values: [{ value: 24, display: '24', series: 0 }] },
          { label: 'Proposed investment', values: [{ value: 20, display: '20 (minimum 8)', series: 0 }] },
          { label: 'Transferability of skills', values: [{ value: 15, display: '15', series: 1 }] },
          { label: 'Net worth', values: [{ value: 12, display: '12 (minimum 5)', series: 0 }] },
          { label: 'Jobs', values: [{ value: 12, display: '12 (minimum 4)', series: 0 }] },
          { label: 'Regional development', values: [{ value: 12, display: '12', series: 0 }] },
        ],
        note: 'The business concept has a minimum of 40 out of 80 and the total threshold is 115. Source: the official EI Base guide, 27 May 2024.',
      },
      table: {
        caption: 'The six self-declared sections of the Base stream',
        head: ['Section', 'Maximum', 'Minimum', 'Top score for'],
        rows: [
          ['Experience and ownership', '24', '—', '60 months as owner-manager (20) + 100% ownership for 36 months (4)'],
          ['Net worth', '12', '5', 'CAD 400,000 in cash (4) + CAD 5 million in total (8)'],
          ['Total proposed investment', '20', '8', 'CAD 8 million or more'],
          ['Jobs', '12', '4', '20 jobs or more'],
          ['Regional development', '12', '—', 'Northeast, Kootenay, Nechako, North Coast'],
          [
            'Adaptability',
            '40',
            '—',
            'CLB 5+ (6), master\'s/doctorate (10), age 35 to 44 (8), a visit to the same region in the last year (8), 12 months in Canada (8)',
          ],
          ['Total', '120', '', 'Regional stream: 140'],
        ],
        note: 'The full tables for each section, step by step, are in the questions at the bottom of the page.',
      },
      body: [
        'Your registration is scored out of 200 points. 120 points are self-declared and the system calculates them on the spot; the 80 points of the business concept are read and scored by provincial officers within six weeks, who then also verify all the self-declared points. Exaggerating to get more points is misrepresentation. The six self-declared sections in the Base stream:',
      ],
      bullets: [
        'Experience and ownership, 24 points: owner-manager experience from 4 points for 12 to 24 months up to 20 points for 60 months or more; senior manager experience from 4 points for 25 to 48 months up to 12 points for 60 months or more; plus 4 points for 100% ownership for at least 36 of the last 60 months.',
        'Net worth, 12 points with a minimum of 5: up to 4 points for cash and liquid assets (CAD 400,000 or more), and 5 to 8 points for total net worth from CAD 600,000 to CAD 5 million or more.',
        'Total proposed personal investment, 20 points with a minimum of 8: CAD 200,000 to 400,000 is 8 points, rising step by step to 20 points for CAD 8 million or more.',
        'Jobs, 12 points with a minimum of 4: one job 4 points, two jobs 5, three jobs 6, and up to 12 points for 20 jobs or more.',
        'Regional development, 12 points with no minimum: Metro Vancouver and the Southwest 0; Vancouver Island and Thompson/Okanagan 6; Cariboo 10; Northeast, Kootenay, Nechako and North Coast 12. You must work in that location and live within 50 km of it.',
        'Adaptability, 40 points with no minimum: language up to 6, education up to 10, age up to 8 (highest for 35 to 44), exploratory visit up to 8 (highest for a visit to the same region in the last year), and 8 points for at least 12 months of legal work or study in Canada in the last 10 years. The full table is in the questions at the bottom of the page.',
      ],
      callout: 'You can calculate your own self-declared score from these tables. If with an average concept (40 to 50 points) you do not reach 115, work on the variables you can change before registering: the business location, the number of jobs, the investment amount, and the visit.',
    },
    {
      heading: 'The 200-point system: the business concept (80 points)',
      table: {
        caption: 'The business concept score, broken down',
        head: ['Factor', 'Sub-factor', 'Points'],
        rows: [
          ['Commercial viability (30)', 'Business model', '1 / 5 / 10'],
          ['', 'Market and product', '1 / 4'],
          ['', 'Eligible investment', '1 to 4 (CAD 200,000 to 800,000+)'],
          ['', 'Substantiation of the investment', '0 / 4 / 6'],
          ['', 'Ownership percentage', '0 (≤50%) / 3 (>50%) / 4 (100%)'],
          ['', 'Risk', '0 or 2'],
          ['Transferability of skills (15)', 'Owner-manager experience in a similar industry (NAICS)', '5 to 15'],
          ['', 'Senior manager experience in a similar industry', '0 to 10'],
          ['Economic benefits (35)', 'Key sector and significant benefit', '3 / 10 / 16 / 23'],
          ['', 'Job creation plan assessment', '0 / 1 / 6'],
          ['', 'TEER 0 or 1 jobs', '0 / 4 / 6'],
          ['Total', '', '80; minimum 40 (Regional stream: 60, no minimum)'],
        ],
      },
      body: [
        'The business concept at registration is something like an executive summary: the business model and operations from start to finish, the product or service, your own role and duties and how they relate to your experience, the market entry strategy, and staffing with reasons. The guide says plainly not to put general market statistics and research in it. If you are buying an existing business, you must also include the target business, its revenue and profit for the last two years, the expansion plan, its financial health and your valuation method. At least 40 points from this section are required, and it has three factors:',
      ],
      bullets: [
        'Commercial viability, 30 points: business model 10 (unclear 1, acceptable 5, excellent 10; excellent means, on top of full clarity, at least three of: investment and jobs consistent with the model, a clear profitability strategy, an internally consistent operating plan, and your duties matching your experience); market and product 4 (competitive advantage, high value, a product new to the market, or competitive analysis and an entry strategy); eligible investment 4; substantiation of the investment 6 (0 unsupported, 4 proportionate to the type and scale, 6 proportionate to the market and product and industry standard); ownership percentage 4 (100% 4, over 50% 3, 50% or less 0); risk 2 (zero with external financing, an investment of more than half your net worth, or a co-registrant).',
        'Transferability of skills, 15 points: how closely the industry of your experience in the last 10 years matches the proposed business. Direct experience means the same industry group (the first four digits of the NAICS code), related means the same subsector (the first three digits). Owner-manager experience: from 5 points for an unrelated industry to 15 for more than 60 months of direct experience. Senior manager experience: from zero to 10. The province matches your declared NAICS code against your experience.',
        'Economic benefits, 35 points: key sector and significant economic benefit 23 (neither 3, one 10, one key sector and one benefit 16, one key sector and at least two benefits 23); job creation plan assessment 6 (unsupported 1, proportionate 6); TEER 0 or 1 jobs up to 6 (one 4, two or more 6).',
      ],
      callout: 'With a good model (5), market (4), a minimum but substantiated investment (1 and 6), 100% ownership (4), no risk (2), direct experience (15), no key sector (3), a sensible job plan (6) and one TEER 1 job (4), you reach 50 points. That arithmetic shows why a key sector or a documented economic benefit, which makes a difference of 7 to 20 points, has to be in the design of the business from day one, not in the wording.',
    },
    {
      heading: 'Thresholds, the pool and invitations',
      keyFacts: [
        { value: '115', label: 'total threshold, Base stream' },
        { value: '40', label: 'business concept minimum out of 80' },
        { value: '105', label: 'total threshold, Regional stream' },
        { value: '180 days', label: 'profile validity in the pool' },
      ],
      table: {
        caption: 'Minimums and deadlines',
        head: ['Item', 'Base stream', 'Regional stream'],
        rows: [
          ['Total threshold', '115 of 200', '105 of 200'],
          ['Business concept minimum', '40 of 80', 'None'],
          ['Other minimums', 'Net worth 5, investment 8, jobs 4', '—'],
          ['Validity in the pool', '180 days', '180 days'],
          ['Active registrations at once', 'Only one', 'Only one'],
          ['Co-registrant', 'Everyone\'s score set to the lowest; registration within 30 days of the first', 'Not available'],
          ['Declining an invitation', 'The registration fee is not refunded', 'The same'],
        ],
      },
      body: [
        'In the Base stream, to enter the pool you need at least 115 points in total and at least 40 concept points, and you must also clear the minimums in the net worth (5), investment (8) and jobs (4) sections. In the Regional stream the total threshold is 105 and there is no separate minimum for the concept. After scoring, you receive an email with your total score and pool status, and the score breakdown is visible in the system.',
        'An eligible profile stays in the pool for 180 days; if you are not invited in that time it expires and you must register again, paying the fee again. The province invites the highest scores and has the right to limit the number of registrations accepted. Each person can have only one active registration or application at any time. If you decline an invitation, the registration fee is not refunded.',
        'With a co-registrant, both people\'s scores are lowered to the lower one: if two partners score 154 and 118, both enter the pool with 118, and each must separately clear 40 and 115.',
      ],
    },
    {
      heading: 'Steps, timeline and fees',
      visual: {
        type: 'bars',
        caption: 'The longest each stage takes (months)',
        shared: true,
        groups: [
          { label: 'Registration score', values: [{ value: 1.5, display: 'up to 6 weeks', series: 0 }] },
          { label: 'Time in the pool until invitation', values: [{ value: 6, display: 'up to 6 months', series: 0 }] },
          { label: 'Preparing and submitting the application', values: [{ value: 4, display: 'up to 120 days', series: 0 }] },
          { label: 'Application decision', values: [{ value: 4, display: 'about 4 months', series: 0 }] },
          { label: 'Arrival on a work permit', values: [{ value: 12, display: 'up to 12 months', series: 0 }] },
          { label: 'Running the business until the final report', values: [{ value: 20, display: '18 to 20 months', series: 1 }] },
          { label: 'Final report decision', values: [{ value: 4, display: 'about 4 months', series: 0 }] },
        ],
        note: 'The province\'s official times for about 80% of files; IRCC\'s time for permanent residence is separate. The real total is usually three to four years, our estimate.',
      },
      keyFacts: [
        { value: 'CAD 300', label: 'registration fee' },
        { value: 'CAD 3,500', label: 'full application fee' },
        { value: 'CAD 500', label: 'request for review fee' },
        { value: '4 months', label: 'official time for the application and final report decisions' },
      ],
      table: {
        caption: 'Official fees and times',
        head: ['Stage', 'Provincial fee', 'Official time (about 80% of files)'],
        rows: [
          ['Registration', 'CAD 300, non-refundable', 'Score within 6 weeks'],
          [
            'Full application',
            'CAD 3,500; refunded only if you withdraw before processing starts',
            'Decision within 4 months',
          ],
          [
            'Net worth verification report',
            'Paid to the verification firm, depending on complexity',
            'Up to 60 days; valid 12 months',
          ],
          ['Final report', '—', 'Decision within 4 months'],
          ['Request for review', 'CAD 500, non-refundable', '6 months'],
          ['Work permit and permanent residence', 'IRCC fees, separate', 'According to the IRCC queue'],
        ],
        note: 'Payment only through the BC PNP online portal. A request to pay by wire transfer, cheque or gift card is fraud.',
      },
      body: [
        'The provincial fees are three items, paid only through BC PNP\'s own online portal: CAD 300 for registration, CAD 3,500 for the full application, and CAD 500 for a request for review. A fee is refunded only if you withdraw before processing starts; the review fee never. If anyone asks you to pay a provincial fee by wire transfer, cheque or gift card, it is fraud, and the province itself says to report it to PNP.fraud.tips@gov.bc.ca.',
        'Outside these three items, the net worth verification report is prepared by an approved verification firm for a fee that depends on the complexity of your assets; the language test, credential assessment, exploratory visit, reviewed financial statements at the end of the period, and IRCC work permit and permanent residence fees are also separate. The province\'s official times for about 80% of files: registration score 6 weeks, application decision 4 months, final report decision 4 months, review 6 months.',
      ],
      bullets: [
        '1. Preparation: choosing the stream, the city, the type of business and the NAICS code; in the Regional stream, contacting the community, visiting and getting the 90-day referral.',
        '2. Online registration: creating a profile in BCPNP Online with a personal email, completing every section and paying CAD 300; concept score within 6 weeks; 180 days in the pool.',
        '3. Invitation and application: within 120 days, the net worth verification report, a full business plan and documents (at most 50 attachments, each up to 3 MB) and CAD 3,500; answering the province\'s concerns; a possible interview in Vancouver; decision within 4 months.',
        '4. Performance agreement and work permit: signing the agreement, a 90-day approval letter to apply to IRCC for a work permit, arrival within 365 days; the permit is usually for two years; an open work permit for your spouse and study permits for your children.',
        '5. Arrival and launch: arrival report within 60 days, progress report by day 365, first job by day 420, the whole investment and all commitments by day 610.',
        '6. Final report and nomination: between day 550 and day 610 (Regional stream at the earliest month 12), with reviewed financial statements; 4 months of assessment; signing the declaration of nomination conditions; a nomination certificate valid for 180 days.',
        '7. Permanent residence: the file for you, your spouse and dependent children under the provincial nominee class with IRCC, with medical and security checks; the province supports your work permit in the meantime.',
      ],
      callout: 'From registration to the permanent resident card, with the province\'s official times and IRCC\'s current queue for provincial nominees, plan for three to four years. That is our estimate, not an official figure.',
    },
    {
      heading: 'Net worth verification and the source of funds',
      keyFacts: [
        { value: 'After the invitation', label: 'only then contract a firm' },
        { value: '60 days', label: 'maximum time to prepare the report' },
        { value: '12 months', label: 'report validity' },
        { value: 'Schedule 4A', label: 'federal form, with Section J (wealth narrative)' },
      ],
      checklist: {
        title: 'The net worth verification file for the verification firm',
        intro: 'Only after the invitation. The firm is chosen from the official list that comes with the invitation and has up to 60 days.',
        items: [
          'The federal immigration department\'s Schedule 4A form, complete, for me and my spouse.',
          'Section J of the same form: the narrative of how the wealth was accumulated, year by year, which matches the documents below.',
          'Bank statements for me and my spouse for the last two years, all accounts.',
          'The deed for every property with a current valuation and the outstanding mortgage.',
          'For a share in any company: articles of incorporation, shareholders\' agreement, financial statements and a defensible valuation.',
          'Shares, bonds, funds and term deposits redeemable within 12 months.',
          'Pensions and other assets (jewellery, collections) with documents.',
          'All debts: mortgage, personal loans, credit cards.',
          'The source of every large inflow: deed of sale, contract, certificate of inheritance (a future inheritance does not count).',
          'Every non-English document with a certified translation, and both the original and the translation notarised.',
        ],
      },
      body: [
        'After the invitation, and only after the invitation, you contract one of the province\'s approved verification firms, whose list comes with the invitation. The firm reviews the whole net worth of you, your spouse and dependent children and how it was accumulated, from the documents, and writes a report saying what amount can be verified and where further review is needed; one copy for you and one sent directly to the province. This can take up to 60 days and the report is valid for 12 months.',
        'You give the firm the federal immigration department\'s Schedule 4A form, Section J of the same form, meaning the narrative of how your wealth was accumulated, and all the supporting documents in the application guide. Every document not in English must have a certified translation, and both the original and the translation must be notarised. Failing to declare your full net worth, or lacking satisfactory documents for your assets and their source, is each on its own a reason to refuse the application. Even with a positive report, the final decision rests with BC PNP, which can ask for more documents.',
      ],
      callout: 'The cost of this report does not count as eligible investment, and do not involve any firm before the invitation: the province says the same and does not accept a report prepared before the invitation.',
    },
    {
      heading: 'Full application, interview and performance agreement',
      keyFacts: [
        { value: '120 days', label: 'deadline to submit after the invitation' },
        { value: '50 attachments', label: 'maximum, each up to 3 MB' },
        { value: 'Vancouver', label: 'location of a possible in-person interview' },
        { value: '90 days', label: 'validity of the approval letter for the work permit' },
      ],
      checklist: {
        title: 'Before submitting the full application (120 days from the invitation)',
        items: [
          'The net worth verification report has been issued and is less than 12 months old.',
          'The business plan does not differ materially from the registration concept in type of business, location, ownership, investment and jobs.',
          'The business plan shows the market entry strategy and the commercial viability under my ownership.',
          'For a business purchase: proof it is active and profitable, not in bankruptcy, the owner\'s five-year history, and the CAD 50,000 expansion plan.',
          'For a franchise: the disclosure document and the franchisor\'s written consent.',
          'Education credentials and, if needed, an assessment (ECA), the language result if I claimed points for it, documents from previous visits to the province.',
          'At most 50 attachments, each up to 3 MB, merged by document type.',
          'Anyone\'s paid help in preparing the file has been declared, and the paid representative, if any, is a CICC member or a lawyer.',
          'I am ready for the interview in Vancouver: I can explain my work history and every number in the business plan without looking.',
          'CAD 3,500 is ready to pay through the portal.',
        ],
      },
      body: [
        'From the invitation date you have 120 days to send the full application with the net worth verification report, all documents and a comprehensive business plan. The business plan must be consistent with the registration concept and show commercial viability under your ownership with a market entry strategy; for a business purchase, it must show the business is active and profitable, is not in bankruptcy, will grow under your management and can sustain more staff. A material difference between the application and the registration is a reason for refusal.',
        'If the province has a concern about the content of the application, it gives you a chance to respond; failing to respond in time and satisfactorily is a reason for refusal, and the same concern can be raised again at later stages. You may be invited to an in-person interview in Vancouver; there you are asked about your work history and business plan, and false information in an interview is also misrepresentation.',
        'Once the application is approved, you sign a performance agreement specific to your file, built from the information in your application, business plan and interview: the type and location of the business, ownership percentage, investment amount, number of jobs, the residence requirement and active management. You cannot change any of its terms unilaterally. Then you receive an approval letter (the work permit support letter) valid for 90 days and use it to apply to IRCC for a work permit. The province issues at most two approval letters.',
      ],
    },
    {
      heading: 'Arrival and the set-up period: 610 days',
      timeline: {
        caption: 'Deadlines, from the date the work permit is issued',
        items: [
          { when: 'Before arrival: 90 days', what: 'Apply to IRCC for a work permit with the approval letter' },
          { when: 'Day 0', what: 'Work permit issue date = agreement start date' },
          { when: 'By day 60', what: 'Arrival report: address, work permit, funds moved to a financial institution in the province' },
          { when: '180 days before the work permit expires', what: 'Ask the province for an extension support letter' },
          { when: 'By day 365', what: 'Post-arrival progress report' },
          { when: 'By day 420', what: 'Create the first full-time job' },
          { when: '180 days before the final report', what: 'Jobs continuously filled' },
          { when: 'Day 550 to 610', what: 'Final report; once only' },
          { when: 'Day 610', what: 'Deadline for meeting the whole performance agreement' },
        ],
      },
      body: [
        'You must arrive in British Columbia with a valid work permit within 365 days of the date of the approval letter, or the file is closed. The work permit issue date is the "start date" of your agreement and every deadline is counted from it. The work permit is usually for two years; your spouse or partner can get an open work permit and your children study permits for school.',
        'Within 60 days of arrival you submit an arrival report, with your contact details in the province, your work permit, and whether you have moved the required funds to a financial institution in British Columbia. By day 365 you send a post-arrival progress report explaining your involvement in the community and the progress of the business. By day 610 the whole business plan must be carried out, the investment made, the job created and the agreement\'s commitments met.',
        'If your work permit expires within 180 days, you ask the province for an extension support letter, and the province can ask for proof of progress. If you see you will not meet a commitment, you must tell the province in writing with an explanation; the agreement cannot be changed unilaterally.',
      ],
    },
    {
      heading: 'Final report, nomination conditions and permanent residence',
      keyFacts: [
        { value: 'Day 550 to 610', label: 'window for submitting the final report, once only' },
        { value: '75%', label: 'physical presence in the province during the work permit' },
        { value: '50 km', label: 'maximum distance between home and business' },
        { value: '180 days', label: 'validity of the nomination certificate for the IRCC file' },
      ],
      checklist: {
        title: 'What the final report must prove',
        intro: 'You can submit only one final report. Every item with documents, not with explanation.',
        items: [
          'The eligible investment in the amount in the agreement (at least CAD 200,000 / CAD 100,000) has been made and every cost has an invoice and receipt.',
          'The investment money came from my personal net worth and the transfer chain from the source account to Canada has no gaps.',
          'The committed job or jobs were filled for at least 180 consecutive days: contracts, pay slips, T4s, insurance records.',
          'I was in the province for at least 75% of my work-permit time: passport stamps and travel records.',
          'I lived within 50 km of the business: lease or deed, utility bills.',
          'Day-to-day management was mine: licences, the company bank account, contracts in my name.',
          'The type, location and ownership percentage of the business are as stated in the performance agreement.',
          'The business\'s financial statements have been reviewed by a chartered professional accountant (CPA) with no conflict of interest (review engagement).',
          'At most 50 attachments of 3 MB, merged by type.',
          'I am in Canada when I submit and will stay until the nomination decision.',
        ],
      },
      body: [
        'You submit the final report between day 550 and day 610 after the work permit is issued (in the Regional stream at the earliest month 12) through the system, once only, with at most 50 attachments of 3 MB and the business\'s financial statements reviewed by a chartered professional accountant (CPA) with no conflict of interest. You must prove the investment was made and came from your own money, the job was filled for 180 consecutive days, you were in the province for at least 75% of the time and lived within 50 km of the business. The province can ask for more documents, visit the business site or interview you. You must be in Canada when you submit and stay until the decision.',
        'On approval, you sign the declaration of nomination conditions: until the federal file is finished, the type and location of the business, ownership percentage, jobs, residence and active management must stay the same, you work only for this business, you keep your legal status, and you report any change: ownership, location, address, marital status or number of dependants, immigration status, a refused work permit or visa, and any absence from the province of more than three weeks. Then a nomination certificate valid for 180 days is issued.',
        'Before the certificate expires, you apply to IRCC for permanent residence for yourself and your family under the provincial nominee class. IRCC carries out medical and security checks and can ask for proof that you still meet the nomination conditions. The age of dependent children is locked in on the date of the initial registration. If your work permit is about to expire during this period, the province still issues a support letter.',
      ],
    },
    {
      heading: 'Request for review, cancellation and misrepresentation',
      keyFacts: [
        { value: '30 / 60 days', label: 'review deadline, living in Canada / outside Canada' },
        { value: 'CAD 500', label: 'non-refundable fee' },
        { value: '3 decisions', label: 'reviewable: refused registration, refused application, refused nomination' },
        { value: '2 years', label: 'ban after misrepresentation' },
      ],
      table: {
        caption: 'Review: what, by when, how much',
        head: ['Item', 'Rule'],
        rows: [
          [
            'Reviewable decisions',
            'Ineligible registration; refused application (stage 1); refused nomination (stage 2)',
          ],
          ['Not reviewable', 'Cancelled nomination; IRCC decisions'],
          [
            'Deadline',
            '30 calendar days if you live in Canada (holding a work permit counts as living in Canada); 60 days if outside Canada',
          ],
          ['Fee', 'CAD 500, non-refundable'],
          [
            'How',
            'In writing, through the system, with the applicant\'s own address, stating why the decision was unfair or unreasonable',
          ],
          ['What is not considered', 'New evidence; a fresh argument; mere dissatisfaction with the result'],
          ['Outcome', 'Decision upheld, or overturned and reassessed; final, with no second review'],
          ['Consequence of misrepresentation', 'Refusal or cancellation, and no registration or application accepted for up to 2 years'],
        ],
      },
      body: [
        'Three provincial decisions can be reviewed: an ineligible registration, an application refused at stage one, and a nomination refused at stage two. The deadline is 30 calendar days from the date of notice if you live in Canada (someone in Canada on a work permit counts as living there) and 60 days if you are outside Canada. The request is in writing, through the system, with reasons, with the applicant\'s own address, not the representative\'s, and with CAD 500, non-refundable. A review only assesses whether the decision followed a fair process and was within the reasonable range of the evidence at the time; it is not a place for new evidence or a fresh argument, and dissatisfaction with the result is not enough. The outcome is either the decision upheld or overturned and reassessed, and it is final.',
        'A cancelled nomination cannot be reviewed. The province cancels a nomination if you do not meet the nomination conditions, fail to report a significant change, obstruct an inspection, use an unauthorised paid representative, or gave false information; also if you no longer live in the province, are in Canada without status or have a removal order.',
        'Misrepresentation means giving false or misleading information, or withholding information that creates a false picture, at any stage and by anyone, you or your representative. The result is a refused registration or application or a cancelled nomination, and the province can refuse to accept any registration or application from you for up to two years.',
      ],
    },
    {
      heading: 'Representatives: not required, but a paid one is regulated',
      body: [
        'The province says explicitly that you do not need a representative for registration and application, that the program is designed to be done by the applicant, and that a file with a representative gets no special attention, faster processing or better outcome. If anyone gave you paid help in preparing the registration or application, you must declare it; failing to declare it is a reason for refusal.',
      ],
      terms: [
        {
          term: 'Paid representative',
          text: 'Can only be a consultant who is a member of the College of Immigration and Citizenship Consultants (CICC) or a lawyer who is a member of a provincial law society; anyone else who takes money for representation is unauthorised and puts the file at risk. An unpaid representative, such as a family member, is allowed, but if it turns out they were paid, they are disqualified and your file may be refused. You can have only one representative at a time and any change must be recorded in the system. The legal declaration at registration is your signature; even if a representative filled in the form, you are responsible for its accuracy.',
        },
      ],
    },
    {
      heading: 'Applicants from sanctioned countries (e.g. Iran)',
      body: [
        'These four issues are in no official table, but for applicants from sanctioned countries such as Iran they decide the timing and the outcome of the file:',
      ],
      terms: [
        {
          term: 'Exploratory visit',
          text: 'The 8 adaptability points in the Base stream and the mandatory condition of the Regional stream depend on a trip that, for passports such as Iran\'s, requires a Canadian temporary resident visa. The province gives no support letter for this visa. If you have no valid visa or travel history, calculate your score without these 8 points and take the Base stream as your baseline.',
        },
        {
          term: 'Moving the money',
          text: 'The issue is not only proving the assets but getting them there. The arrival report asks whether you have moved the required funds to a financial institution in British Columbia, and in the final report you must show the investment was made from your personal money with a documented source. For money coming from a sanctioned country such as Iran, the chain of documents from the source account to the Canadian account must have no gaps. Plan the transfer before you register, not after the invitation; this is exactly where good files fall months behind.',
        },
        {
          term: 'Documents',
          text: 'Every document not in English (for example, in Persian) must have a certified translation, and both the original and the translation must be notarised. The Section J narrative of Schedule 4A must match those documents: a property sale with the deed and a valuation, a company share with the articles and financial statements, an inheritance with a certificate of inheritance. A future inheritance and an asset whose title is not in your name do not count.',
        },
        {
          term: 'Language',
          text: 'CLB 4 means roughly IELTS General with 4 in listening and writing, 4 in speaking and 3.5 in reading, or the equivalent in CELPIP; the result must be less than two years old when you submit it. In the Base stream you have until the final report, but CLB 5 gives two more points and is worth having from the start.',
        },
      ],
    },
    {
      heading: 'British Columbia compared with the other provinces',
      choice: {
        question: 'Which province fits your situation?',
        options: [
          {
            title: 'Net worth close to CAD 300,000',
            body: 'Rural Alberta or the BC Regional stream; both need the support or referral of a community, and usually a visit.',
            cta: { label: 'Alberta guide', href: '/pnp/alberta' },
          },
          {
            title: 'CAD 500,000 to 600,000, no visit',
            body: 'The BC Base stream with monthly invitations, or Manitoba with no invitation rounds and CLB 5, or New Brunswick with the shortest period before nomination.',
            cta: { label: 'Compare the six provinces', href: '/pnp' },
          },
          {
            title: 'You want Vancouver or a large market',
            body: 'Only the BC Base stream; with zero regional points, so make up the points elsewhere: more jobs, more investment, a key sector.',
            cta: { label: 'The points system', href: '/pnp/bc' },
          },
        ],
      },
      table: {
        caption: 'Six entrepreneur provinces, autumn 2026',
        head: ['Province', 'Net worth', 'Investment', 'Language', 'Invitation status'],
        rows: [
          [
            'British Columbia (Base / Regional)',
            'CAD 600,000 / 300,000',
            'CAD 200,000 / 100,000',
            'CLB 4',
            '11 monthly rounds in 2026',
          ],
          ['Alberta (rural)', 'CAD 300,000', 'CAD 100,000', 'CLB 4', 'Open; with support from a rural community'],
          ['Manitoba', 'CAD 500,000', 'CAD 250,000 (150,000 outside Winnipeg)', 'CLB 5', 'No rounds; EOI answered within 4 weeks'],
          [
            'Nova Scotia',
            'CAD 600,000 (400,000 outside Halifax)',
            'CAD 150,000 (100,000 outside Halifax)',
            'CLB 5',
            '4 rounds in 2026',
          ],
          ['New Brunswick', 'CAD 500,000', 'CAD 150,000', 'CLB 4', 'Active; shortest period (6 months)'],
          ['Prince Edward Island', 'CAD 600,000', 'CAD 150,000', 'CLB 4', 'Zero invitations in 2026'],
        ],
        note: 'Figures in Canadian dollars; each province has its own guide with official sources.',
      },
      body: [
        'If your net worth is closer to CAD 300,000 and you cannot travel, Alberta\'s rural stream has the same threshold but needs the written support of a rural community, which usually also involves a visit. Manitoba has no invitation rounds and answers an EOI within four weeks, with a net worth of CAD 500,000 and CLB 5. New Brunswick has the shortest period before nomination, six months. Nova Scotia accepts CAD 400,000 net worth and CAD 100,000 investment outside Halifax, but requires CLB 5 and selects by invitation.',
        'In this comparison British Columbia is the most expensive and has the longest set-up period, but it is the only province that publishes a monthly invitation table with numbers, it has the largest market in western Canada, and its points system is transparent enough that you know where you stand in the queue before you pay a dollar. We have put all six provinces side by side on one page.',
      ],
    },
    {
      heading: 'What we do on this route',
      body: [
        'We are not immigration lawyers or licensed consultants, we do not act as representatives and we do not file applications. Our work is the business side of the file, the part on which the 80 concept points, the business plan at the application stage, the interview and the performance agreement are built:',
      ],
      bullets: [
        'Choosing the stream and location: Base or Regional, Vancouver or a region that earns 6 to 12 points, depending on whether an exploratory visit is possible for you, and an exact calculation of your self-declared score before you pay the registration fee.',
        'Designing the business for points: choosing a NAICS code that matches your experience to earn the 15 transferability points, and placing a key sector or a provable economic benefit at the core of the concept, not at its edge.',
        'Writing the concept and business plan: a Business Concept that clears 40 points, then a business plan and financial model for the application stage consistent with that concept, with investment and jobs substantiated to industry standard.',
        'Assessing a business purchase: if you are buying an existing business in the Base stream, checking that the five-year history, price, CAD 50,000 expansion plan and existing jobs match the province\'s definitions.',
        'Interview preparation and an asset plan: practice for the Vancouver interview, and a timeline for proving and moving funds for applicants from sanctioned countries, from before registration to the arrival report.',
      ],
      callout: 'You file the legal application yourself, or a CICC-member consultant or a lawyer does. We stay beside you, not in their place.',
    },
  ],

  faqs: [...COMMON_FAQS, ...DEEP_DIVE_FAQS],
  faqGroups: [
    { heading: 'Common questions', faqs: COMMON_FAQS },
    { heading: 'Points, investment, jobs and review tables: the detail from the official guide', faqs: DEEP_DIVE_FAQS },
  ],

  closing: [
    { label: 'Compare the six entrepreneur provinces', href: '/pnp' },
    { label: 'Alberta: the lowest financial threshold', href: '/pnp/alberta' },
    { label: 'Free route assessment', href: '/which-path' },
    { label: 'Book a consultation', href: '/book-meeting' },
  ],

  sources: [
    { label: 'WelcomeBC — For entrepreneurs and businesses: eligibility, fees, process, processing times (updated 10 Sep 2025)', url: 'https://www.welcomebc.ca/immigrate-to-b-c/for-entrepreneurs-and-businesses' },
    { label: 'WelcomeBC — Invitations to apply: Entrepreneur Immigration draws 2026 (updated 29 Oct 2026)', url: 'https://www.welcomebc.ca/immigrate-to-b-c/about-the-bc-provincial-nominee-program/invitations-to-apply' },
    { label: 'BC PNP — Entrepreneur Immigration – Base Program Guide, effective 27 May 2024 (PDF, 85 pp.)', url: 'https://www.welcomebc.ca/immigrate-to-b-c/documents' },
    { label: 'IRCC — Schedule 4A: Economic Classes – Provincial Nominees – Business Nominees', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/imm0008-schedule-4a.html' },
    { label: 'IRCC — Provincial nominees: how to apply', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html' },
  ],
};
