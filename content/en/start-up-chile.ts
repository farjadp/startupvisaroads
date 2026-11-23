// ============================================================================
// content/en/start-up-chile.ts
// Start-Up Chile, CORFO's equity-free accelerator, for the BIG 13 call
// (Build, Ignite, Growth). English twin of content/fa/start-up-chile.ts:
// same figures, written in the same pass.
//
// Every figure was read on 2026-11-23 in the official documents:
//   - BIG 13 Terms & Conditions (English consolidated text of CORFO
//     RE N°1.457 de 2025 as amended by RE N°1.411 de 2026) — "T&C" below;
//   - CORFO's Spanish consolidated text, Nov 2026 ("Refundido no oficial");
//   - RE N°1.457 de 2025 itself (only where the 2026 text did not change it);
//   - the BIG 13 call notice of 3 Nov 2026 and CORFO's three call pages;
//   - the BIG 13 brochure (Start-Up Chile's own, English, 2026);
//   - SERMIG's residence pages, Ley 21.325, its regulation (DS 296/2022),
//     DS 177/2022 and DS 4.236.
// Both consolidated texts say the resolutions prevail over them.
//
// NOT confirmed by any official document, so NOT stated as fact here:
// a March 2027 programme start (CORFO's calendar has benefit delivery in
// May–June 2027), a 25-minute interview, "270+ mentors" (the brochure says
// +500), the coworking building and 24/7 access, help with a RUT, which
// SERMIG subcategory participants receive, places per call in the bases
// (only web copy gives them), a passport valid 18 months, the tax treatment
// of the grant, and how long founders wait for the first payment (labelled
// as founders' experience below).
// No country of departure is described. No VisaRoads price appears here.
// ============================================================================
import type { FaFaq, FaPage } from '@/lib/fa/content';

const TC = 'https://startupchile.org/content/uploads/terms-conditions-big-13.pdf';

const COMMON_FAQS: FaFaq[] = [
  {
    q: 'What is Start-Up Chile?',
    a: 'A public accelerator run by CORFO, Chile\'s economic development agency. It gives technology startups from any country a non-repayable grant, takes no equity, and asks the team leader to move to Chile and work on the startup full-time for the length of the programme. It runs three tracks: Build for pre-acceleration, Ignite for acceleration and Growth for scale-ups.',
  },
  {
    q: 'Does Start-Up Chile take equity?',
    a: 'No. The money is a CORFO subsidy (subsidio), not an investment: no shares, no convertible note, no repayment if the startup fails. What it does ask is co-financing: you cover 10%, 20% or 50% of the project\'s total cost depending on the track, and you account for every peso spent. If the programme is terminated for a reason that is your fault, you must return the whole subsidy received (BIG 13 T&C, pp. 90–91).',
  },
  {
    q: 'How much is the grant?',
    a: 'Up to CLP 15,000,000 on Build, CLP 30,000,000 on Ignite and CLP 75,000,000 on Growth (BIG 13 T&C, pp. 12, 31, 48). The brochure converts these to about USD 16,000, 33,000 and 83,000. Ignite teams that qualify can apply for an extension of exactly CLP 20,000,000. The grant is paid in pesos, so the dollar value moves with the exchange rate.',
  },
  {
    q: 'When is the deadline for BIG 13?',
    a: '24 November 2026 at 13:00 Chile time (GMT-3), the same for all three tracks. The call opened on 3 November 2026. CORFO\'s calendar puts evaluation until 26 January 2027, results between 27 January and 3 February 2027, and delivery of the benefit between 3 May and 30 June 2027. CORFO and Start-Up Chile run two calls a year.',
  },
  {
    q: 'Do I get a visa?',
    a: 'A foreign team leader has to obtain a temporary residence visa before arriving in Chile, using the programme\'s acceptance letter, and CORFO signs the subsidy agreement only once that visa is available (BIG 13 T&C, p. 69). Start-Up Chile says the visa is a two-year work visa arranged through an agreement with Chile\'s migration service; the law itself says a temporary residence lasts "up to two years" (Ley 21.325, art. 72). You cannot enter as a tourist and switch inside Chile.',
  },
  {
    q: 'Can I apply alone?',
    a: 'Yes, in practice. The rules require one team leader, at least 18, holding at least 10% of the equity, and list additional "executors" as optional, up to three. No official text says "solo founders welcome" in those words, but nothing requires a co-founder.',
  },
  {
    q: 'Which startups are excluded?',
    a: 'Startups that mainly sell consulting, advisory or professional services tailored to each client, and businesses run under a franchise licence (BIG 13 T&C, p. 7). Since 2026 the technology must be the way the value is delivered, not just a sales channel, and it must be developed, adapted or integrated by your own team. Teams that took part in a CORFO programme of the same family must wait 12 months after it ends.',
  },
  {
    q: 'Do I have to stay in Chile after the programme?',
    a: 'No. The obligation is to be in Chile, full-time, for the execution period: up to 4 months on Build, up to 6 on Ignite and up to 8 on Growth, plus any extension. Staying afterwards is your decision and runs through ordinary Chilean immigration law: an extension of the temporary residence, then permanent residence after at least 24 months.',
  },
];

const DEEP_DIVE_FAQS: FaFaq[] = [
  {
    q: 'How is the written application scored?',
    a: 'On a 1-to-7 scale, with the same weights on all three tracks: team 20%; project value 50% (market opportunity 15, product or service 15, traction and validation 10, impact in Chile 10); growth potential 30% (scalability 15, growth strategy 15). You need at least 4.00 on team, at least 4.00 on product or service, and at least 4.00 overall. Then up to three times as many startups as the budget can fund go to interview (BIG 13 T&C, pp. 13–15).',
  },
  {
    q: 'What happens in the interview?',
    a: 'It is remote, with the team leader, and you are told at least seven business days ahead. It is scored on four criteria: the team leader 30%, the role Chile plays in the project 30%, the problem 20% and the technology base 20%. Not showing up counts as withdrawal. The official documents do not state a duration; the 25 minutes you may have read is not in them. Your final grade is the simple average of the written stage and the interview (BIG 13 T&C, pp. 15–17).',
  },
  {
    q: 'What is the 5% relocation bonus?',
    a: 'New in 2026: if the team leader\'s habitual residence on the day the call opened is outside Chile, and the leader will relocate, the final grade gets a 5% bonus. You prove it with a residence certificate or another official document from your country of residence, at most 90 days old at the opening of the call. It cannot be combined with Chile\'s other 5% bonus (for companies holding the 40-hour-week seal), and the final grade cannot exceed 7.00 (BIG 13 T&C, pp. 17–18).',
  },
  {
    q: 'What does Start-Up Chile do for women founders?',
    a: 'On Build, at most 50% of approved projects may be led by men, so at least half go to women-led teams, unless there are not enough eligible women-led applications. On Ignite a woman team leader gets 90/10 co-financing instead of 80/20, and on Growth 60/40 instead of 50/50. Women leaders on every track get access to the Female Founder Factor programme (RE N°1.457, pp. 6, 16; BIG 13 T&C, pp. 12, 18, 31, 48).',
  },
  {
    q: 'How much can I pay myself from the grant?',
    a: 'On Build and Ignite the team leader, and each executor who relocates, can be paid up to CLP 1,300,000 net a month from the subsidy. There is an extra CLP 300,000 a month in total for leaders with children under 12, an alternative housing allowance of up to CLP 800,000 a month, and a one-off relocation allowance of up to CLP 500,000 for a foreign leader moving to Chile. These are 2026 figures; the 2025 rules had CLP 1,000,000 and CLP 200,000. We found no equivalent cap for Growth (BIG 13 T&C, pp. 83–84).',
  },
  {
    q: 'When does the money actually arrive?',
    a: 'CORFO pays the subsidy as an advance by default, but only after the resolution approving your agreement is fully processed, after you deliver a guarantee for 100% of the advance, and after you show your tax and social-security payments are up to date (BIG 13 T&C, pp. 73–76). CORFO\'s BIG 13 calendar places delivery of the benefit between 3 May and 30 June 2027. No official document says how long after arrival the first payment comes; founders who went through the programme describe waiting one to three months after landing. That is their experience, not a rule. Plan your savings accordingly.',
  },
  {
    q: 'What kind of guarantee does CORFO ask for?',
    a: 'One of: a vale vista, a bank guarantee payable on sight, a term deposit, an insurance policy payable on first demand, or a surety certificate from a guarantee institution. It must cover 100% of each advance, stay valid at least 25 business days past the report due date, and be delivered within 30 days of CORFO\'s request. Its cost can be charged to the project (BIG 13 T&C, pp. 75–76).',
  },
  {
    q: 'Do I need a Chilean company?',
    a: 'Not to apply to Build or Ignite: foreign applicants apply as natural persons, and the brochure says non-Chilean entrepreneurs must do so. Growth is for companies with a 2-to-10-year tax history. For the Ignite extension of CLP 20,000,000, the beneficiary must be a company or, by then, have set up a one-person company (EIRL) or hold at least 10% of a new Chilean company (BIG 13 T&C, pp. 38–39).',
  },
  {
    q: 'How many places are there?',
    a: 'The rules do not fix a number. The call notice fixes budgets: up to CLP 518,000,000 for Build, CLP 1,746,500,000 for Ignite and CLP 2,167,200,000 for Growth, each of which can be increased by up to 30%. Start-Up Chile\'s own pages speak of generations of up to 50 startups on Build, up to 30 on Ignite and 10 to 15 on Growth, two a year. There is no official acceptance rate.',
  },
  {
    q: 'What happens after the two years of temporary residence?',
    a: 'Three options under Chilean law. Permanent residence (residencia definitiva) after at least 24 months on temporary residence, applied for online between 90 and 10 days before the temporary permit expires; time spent abroad raises the 24 months (more than 2 to 6 months away: 30 months; more than 6 to 12: 36; more than 12: 48). An extension (prórroga) of the temporary residence for up to two more years, renewable. Or leaving: there is no obligation to stay (DS 296/2022, arts. 62, 65, 70).',
  },
  {
    q: 'What does an entrepreneur show for permanent residence?',
    a: 'SERMIG\'s page lists for business owners: the Carpeta Tributaria from Chile\'s tax service (SII), the company\'s deed of incorporation and amendments, a certificate that the company is in good standing, the latest income tax return for the company and for you, and the VAT returns. A police certificate at most 60 days old is also needed. Dependants (spouse or civil partner, children) apply on their own files once you qualify.',
  },
  {
    q: 'Can I become Chilean?',
    a: 'Naturalisation is open to people aged 18 or over who hold permanent residence and have lived in Chile for five years or more, counted from the electronic stamp (Estampado Electrónico) of the temporary residence that led to permanent residence. So the Start-Up Chile years can count toward the five (Ley 21.325 and SERMIG\'s nationality page).',
  },
  {
    q: 'What makes the grant smaller than it looks?',
    a: 'Five rules. Recovered taxes cannot be paid from the subsidy. Flights are economy class only, and at most one computer per person can be charged. Purchases above CLP 2,000,000 on Build, 5,000,000 on Ignite and 10,000,000 on Growth need CORFO\'s prior approval and three quotes. If the project costs less than budgeted, you return the subsidy above the approved percentage. And spending counts only from the date the resolution approving your agreement is fully processed (BIG 13 T&C, pp. 78–83).',
  },
  {
    q: 'Is the grant taxed?',
    a: 'None of the official programme documents says how the subsidy is treated for income tax or VAT. Ask a Chilean accountant before you budget; the rules do say that taxes you can recover may not be paid from the grant.',
  },
];

export const page: FaPage = {
  path: '/start-up-chile',
  title: 'Start-Up Chile 2026: BIG 13 Grants, Visa and Selection',
  description:
    'Start-Up Chile BIG 13, checked against CORFO\'s rules: equity-free grants of CLP 15M, 30M or 75M, co-financing, scoring, the visa, and residence after 2 years.',
  keywords: [
    'start-up chile',
    'startup chile big 13',
    'start-up chile build ignite growth',
    'corfo start-up chile grant',
    'chile startup visa',
    'start-up chile equity free',
    'start-up chile application checklist',
  ],
  updated: '2026-11-23',

  image: 'chile',
  imageAlt: 'Santiago de Chile on a hazy day, the Gran Torre Santiago rising above the city with the snow-capped Andes behind',
  gallery: [
    { src: 'chile-2', alt: 'A wide avenue in Santiago\'s Providencia district with the glass Gran Torre Santiago and modern office buildings under a blue sky', caption: 'Providencia, Santiago: the business district around the Costanera Center.' },
    { src: 'chile-3', alt: 'A busy cobbled pedestrian street in central Santiago lined with historic stone buildings, people walking in the sun', caption: 'Central Santiago. The rules require you to live in Chile for the whole programme; they do not name a city.' },
  ],
  entity: {
    name: 'Start-Up Chile (Build, Ignite and Growth; BIG 13 call)',
    provider: 'CORFO (Corporación de Fomento de la Producción), Government of Chile',
    country: 'Chile',
  },
  facts: [
    { label: 'Type', value: 'Equity-free grant (CORFO subsidy)', note: 'Not a loan, no shares' },
    { label: 'Build grant', value: 'Up to CLP 15,000,000', note: 'About USD 16,000; you co-finance 10%' },
    { label: 'Ignite grant', value: 'Up to CLP 30,000,000', note: '+ CLP 20,000,000 extension; you co-finance 20%' },
    { label: 'Growth grant', value: 'Up to CLP 75,000,000', note: 'About USD 83,000; you co-finance 50%' },
    { label: 'BIG 13 deadline', value: '24 Nov 2026, 13:00 (GMT-3)', note: 'Results 27 Jan – 3 Feb 2027' },
    { label: 'Team leader', value: '18+ and at least 10% equity', note: 'Full-time, living in Chile' },
    { label: 'Written score', value: 'At least 4.00 out of 7', note: 'On team, on product and overall' },
    { label: 'Leader pay from grant', value: 'Up to CLP 1,300,000 net a month', note: 'Build and Ignite, 2026 rules' },
    { label: 'Residence', value: 'Temporary residence, up to 2 years', note: 'Permanent residence after 24 months' },
  ],
  hero: {
    eyebrow: 'Latin America · Chile · CORFO · Start-Up Chile BIG 13',
    headline: 'Start-Up Chile: an equity-free grant, if you move to Chile',
    sub: 'Start-Up Chile is CORFO\'s accelerator, open to technology startups from any country. It gives a non-repayable grant of up to CLP 15 million, 30 million or 75 million depending on the track, takes no equity, and asks the team leader to live in Chile and work on the startup full-time while the programme runs. In return you co-finance part of the cost, post a guarantee for every advance and account for every peso. This guide takes each figure from CORFO\'s 2026 rules for the BIG 13 call, SERMIG and Chilean law, cites where it comes from, and says plainly where no official answer exists.',
    cta: { label: 'Free route assessment', href: '/which-path' },
  },
  status: {
    tone: 'changed',
    title: 'BIG 13 closes on 24 November 2026 at 13:00 Chile time',
    body: 'The call opened on 3 November 2026 for all three tracks. CORFO\'s calendar: evaluation until 26 January 2027, results between 27 January and 3 February 2027, delivery of the benefit between 3 May and 30 June 2027. BIG 13 runs on CORFO RE N°1.457 de 2025 as amended by RE N°1.411 de 2026; several 2025 figures you will still see quoted elsewhere (CLP 1,000,000 pay cap, 24-month wait for past participants, fixed interview caps) were changed in 2026. CORFO opens two calls a year.',
    cta: { label: 'Official BIG 13 terms (PDF)', href: TC },
  },

  sections: [
    {
      heading: 'What Start-Up Chile is, and what "equity-free" really means',
      lead: {
        type: 'tiles',
        tiles: [
          { value: '0%', label: 'Equity taken', sub: 'a CORFO subsidy, not an investment' },
          { value: '3', label: 'Tracks', sub: 'Build, Ignite, Growth' },
          { value: '10–50%', label: 'Your co-financing', sub: 'cash or valued contributions' },
          { value: '100%', label: 'Guarantee per advance', sub: 'bank guarantee, policy or deposit' },
        ],
      },
      body: [
        'Start-Up Chile is a public accelerator run by CORFO, Chile\'s economic development agency. It pays technology startups from any country a non-repayable grant, takes no shares, and in return requires the team leader to live in Chile and work only on the startup for the length of the programme (BIG 13 T&C, pp. 5–8).',
        '"Equity-free" is accurate but incomplete. The grant is a subsidy (subsidio) that covers part of an approved project budget. You pay the rest: 10% of the total on Build, 20% on Ignite and 50% on Growth, less for women-led teams on Ignite and Growth. That share can be new cash or "valued" contributions such as existing assets or salaries, and there is no minimum cash share (RE N°1.457, pp. 12–13).',
        'The subsidy is paid in advance by default, but each advance needs a guarantee for 100% of its amount: a bank guarantee, a vale vista, a term deposit, an insurance policy or a surety certificate. You report every month, file a final report within a month of the end, keep receipts for three years and answer CORFO surveys for five (BIG 13 T&C, pp. 73–80, 88). If the programme is terminated for a reason attributable to you, you return the whole subsidy you received.',
        'Chile\'s return is not a share of your company. CORFO scores "impact in Chile" in the written stage and the role Chile plays in your project in the interview; it wants activity, jobs and technology in the country.',
      ],
      callout: 'Equity-free is not free of conditions: a 100% guarantee for every advance, monthly reporting, and repayment of the whole grant if you are terminated for your own fault.',
    },
    {
      heading: 'The three tracks side by side',
      lead: {
        type: 'tracks',
        caption: 'BIG 13: the grant and who pays what',
        legend: ['CORFO subsidy', 'Your co-financing'],
        tracks: [
          {
            name: 'Build',
            stage: 'Pre-acceleration: a validated idea to a prototype or early MVP',
            figure: 'CLP 15M',
            figureSub: 'about USD 16,000 (brochure)',
            rows: [
              { label: 'Execution', value: '4 months (+1)' },
              { label: 'Track record', value: 'Sales start ≤ 12 months' },
              { label: 'Next step', value: 'Pitch for Ignite' },
            ],
            split: { funder: 90 },
            note: 'At least half of approved Build projects go to women-led teams.',
          },
          {
            name: 'Ignite',
            stage: 'Acceleration: a working MVP with early market validation',
            figure: 'CLP 30M',
            figureSub: '+ CLP 20M extension if approved',
            rows: [
              { label: 'Execution', value: 'Up to 6 months (+1)' },
              { label: 'Track record', value: 'Up to 36 months' },
              { label: 'Extension', value: 'CLP 20M, up to 6 months' },
            ],
            split: { funder: 80 },
            altSplit: { funder: 90, label: 'Woman team leader' },
          },
          {
            name: 'Growth',
            stage: 'Scale-up: an established company with sales',
            figure: 'CLP 75M',
            figureSub: 'about USD 83,000 (brochure)',
            rows: [
              { label: 'Execution', value: 'Up to 8 months (+2)' },
              { label: 'Company age', value: '24 to 120 months' },
              { label: '12-month sales', value: '2,400–25,000 UF' },
            ],
            split: { funder: 50 },
            altSplit: { funder: 60, label: 'Woman team leader' },
          },
        ],
      },
      body: [
        'Pick the track your startup qualifies for today, not the one you hope to reach: the limits are checked against dates. Build: commercial activity started no more than 12 months before the call. Ignite: up to 36 months, and an MVP or functional prototype you prove with a video of up to 120 seconds. Growth: a company whose start of activities with the tax service was between 24 and 120 months before the call, with worldwide sales of 2,400 to 25,000 UF over the last 12 months (BIG 13 T&C, pp. 5, 24, 28, 42–43).',
        'The caps are CLP 15,000,000 on Build, CLP 30,000,000 on Ignite and CLP 75,000,000 on Growth (BIG 13 T&C, pp. 12, 31, 48). CORFO covers up to 90%, 80% and 50% of the project\'s total cost; a woman team leader gets 90% on Ignite and 60% on Growth. The dollar figures are the brochure\'s own conversions and move with the exchange rate.',
        'Execution periods: Build 4 months, extendable by 1; Ignite up to 6 months, extendable by 1, plus up to 6 more with the extension; Growth up to 8 months, extendable by 2 (BIG 13 T&C, pp. 11, 30, 48). The brochure describes Ignite as a 4-month programme with 6 months to spend the budget, and Growth as 6 months with 8; the T&C give only the execution periods.',
      ],
      table: {
        caption: 'BIG 13 tracks: the official figures',
        head: ['', 'Build', 'Ignite', 'Growth'],
        rows: [
          ['Grant cap', 'CLP 15,000,000', 'CLP 30,000,000', 'CLP 75,000,000'],
          ['CORFO / you', '90 / 10', '80 / 20 (women: 90 / 10)', '50 / 50 (women: 60 / 40)'],
          ['Execution', '4 months, +1', 'Up to 6 months, +1', 'Up to 8 months, +2'],
          ['Track record', 'Commercial start ≤ 12 months before the call', 'Up to 36 months', 'Tax registration 24–120 months; sales 2,400–25,000 UF in 12 months'],
          ['Product proof', '90-second pitch video', '90-second pitch + 120-second MVP video', '90-second pitch video'],
          ['After', 'Pitch to move into Ignite (MVP required)', 'CLP 20,000,000 extension, up to 6 months', '—'],
          ['Call budget', 'CLP 518,000,000', 'CLP 1,746,500,000', 'CLP 2,167,200,000'],
        ],
        note: 'Sources: BIG 13 T&C pp. 5–53; call notice of 3 Nov 2026 for budgets (each can rise by 30%). Start-Up Chile\'s Ignite web page still says CLP 25M and links the BIG 11 terms; the 2026 rules say CLP 30M.',
      },
      bullets: [
        'Build to Ignite: the best Build teams can pitch to continue into Ignite; a committee decides, and since 2026 the team must show an MVP (BIG 13 T&C, pp. 19–22).',
        'Ignite extension: exactly CLP 20,000,000 and up to 6 more months; by then the beneficiary must be a company, an EIRL, or a founder holding at least 10% of a new Chilean company (BIG 13 T&C, pp. 38–39).',
        'Places: the rules fix budgets, not numbers. Start-Up Chile\'s pages speak of up to 50 startups per Build generation, up to 30 per Ignite generation and 10 to 15 per Growth generation, two generations a year.',
      ],
    },
    {
      heading: 'Who can apply, and who cannot',
      lead: {
        type: 'checks',
        label: 'The four conditions that decide admissibility',
        columns: 2,
        items: [
          { label: 'Technology-based', note: 'Technology delivers the value, built or adapted by your team' },
          { label: 'Not a service or franchise', note: 'No consulting or client-by-client services' },
          { label: 'A team leader 18+ with 10% equity', note: 'Cannot be changed after applying' },
          { label: 'Full-time, in Chile', note: 'For the whole execution period' },
        ],
      },
      body: [
        'Start-Up Chile is open to Chilean and foreign natural persons, and to legal entities incorporated in Chile; Growth also takes foreign companies. There is no nationality restriction; the brochure says the programme is "agnostic to nationalities" and to industry. Non-Chilean entrepreneurs apply as natural persons, says the brochure (BIG 13 T&C, pp. 5–7; brochure, p. 17).',
        'Since 2026 the technology test is stricter: technology must be "the means through which the value proposition is delivered", not merely a channel or support, and it must be "developed, adapted or integrated by the project team" (BIG 13 T&C, p. 62). A marketplace that merely uses Shopify, or an agency that builds apps for clients, fails it.',
      ],
      terms: [
        { term: 'Excluded', text: 'Projects that "consist mainly of providing consulting, advisory or professional services tailored to each client", and businesses run under a franchise licence (BIG 13 T&C, p. 7).' },
        { term: 'Team leader', text: 'At least 18, holding at least 10% of the equity directly or indirectly, dedicated exclusively to the startup and living in Chile for the whole execution. The leader can be replaced only for a certified health condition (BIG 13 T&C, pp. 5–6).' },
        { term: 'Team', text: 'Up to three additional executors, all optional, so a solo founder can apply. Team members named in the application cannot be swapped later.' },
        { term: 'Past participants', text: 'Leaders, founders or beneficiaries of an executed CORFO project in a related programme wait 12 months after it ends (2026 rule; it was 24 months in 2025) (BIG 13 T&C, p. 58).' },
        { term: 'Other exclusions', text: 'People on Chile\'s registry of child-support debtors; projects already co-financed by the listed CORFO instruments; more than one application per project, person and track in the same call.' },
      ],
      callout: 'The question that sinks most applications from outside Chile is not the product, it is "why Chile". Impact in Chile is 10% of the written score and the role of Chile is 30% of the interview.',
    },
    {
      heading: 'What you get: visa, money for living, coworking and soft landing',
      lead: {
        type: 'tiles',
        tiles: [
          { value: 'CLP 1.3M', label: 'Leader\'s monthly pay', sub: 'net, from the grant; Build and Ignite' },
          { value: '+300K', label: 'Children under 12', sub: 'CLP a month, in total' },
          { value: '500K', label: 'Relocation allowance', sub: 'CLP, once, foreign leader' },
          { value: 'Up to 2 yrs', label: 'Temporary residence', sub: 'obtained before you arrive' },
        ],
      },
      body: [
        'The grant can pay the team leader, and each executor who relocates, up to CLP 1,300,000 net a month on Build and Ignite. A leader with children under 12 can add CLP 300,000 a month in total. Instead of part of that, a housing allowance of up to CLP 800,000 a month is possible, and a foreign leader without Chilean residence can claim a one-off relocation allowance of up to CLP 500,000 (BIG 13 T&C, pp. 83–84). These are the 2026 figures; the 2025 rules had CLP 1,000,000 and CLP 200,000, and some websites still quote them. We found no pay cap written for Growth.',
        'The visa: a foreign team leader must apply for a temporary residence visa with the programme\'s acceptance letter, before arriving in Chile, within CORFO\'s deadline. CORFO formalises the subsidy agreement only once the visa is available, and visa costs can be charged to the project (BIG 13 T&C, pp. 69, 78). Start-Up Chile describes it as a two-year work visa for the whole team, through an agreement with Chile\'s migration service; Ley 21.325 sets temporary residence at "up to two years" (art. 72). No official document names which SERMIG subcategory participants receive.',
        'The family: Chilean law lets a temporary resident bring a spouse or civil partner and children (under 18, with a disability, or under 24 and studying) as dependants, who may work and whose permits cannot outlast yours (Ley 21.325, art. 74). The programme documents do not mention family visas, so this is the general rule, not a programme benefit.',
        'Coworking and soft landing: the brochure promises a free coworking space, full assistance with the visa process, the opportunity to open a Chilean bank account and support from an alumnus; CORFO\'s call pages describe cowork space and infrastructure provided through a sponsoring entity. The building, its address and 24/7 access are not in any official document, and neither is help getting a RUT (tax number). The brochure counts more than 500 volunteer mentors, 150 investors and VC networks and 110 corporate and government partners (brochure, pp. 27, 31–32).',
      ],
      callout: 'The visa comes before the money: no visa, no signed agreement, no advance. Start your police certificate and passport the day you are accepted.',
    },
    {
      heading: 'Selection: five steps from form to result',
      lead: {
        type: 'steps',
        steps: [
          { label: 'Application', who: 'You, on startupchile.charly.io', chip: 'By 24 Nov 2026, 13:00' },
          { label: 'Admissibility', who: 'CORFO', chip: 'Within 30 days of close' },
          { label: 'Written evaluation', who: 'External evaluators', chip: '4.00 minimums' },
          { label: 'Interview', who: 'Team leader, remote', chip: '7 business days\' notice' },
          { label: 'Committee decision', who: 'CORFO subcommittee', chip: 'Results 27 Jan – 3 Feb 2027' },
        ],
      },
      body: [
        'You apply online on Start-Up Chile\'s portal (startupchile.charly.io), in Spanish or English, with a pitch video of at most 90 seconds: public, without a password, on a platform that shows the upload date, and available for the whole evaluation. Only the first 90 seconds are watched. Ignite also asks for a first video of up to 120 seconds proving the MVP works. Two or more empty fields, or three or more empty drop-downs, make the application inadmissible (BIG 13 T&C, pp. 9–10, 28, 57).',
        'CORFO checks admissibility within 30 days of the close, external evaluators score the written application, the best go to a remote interview with the team leader, and a CORFO subcommittee decides; results go to the startup email you registered. Start-Up Chile describes the same five steps: form, eligibility, judges, interview, committees.',
      ],
      checklist: {
        title: 'Before you press submit',
        intro: 'From the BIG 13 rules and the live application form. The full field-by-field checklist is in the downloads below.',
        items: [
          'One track chosen, and my dates fit its track-record limit.',
          'One language (English or Spanish) used in every answer and video.',
          'The team leader is final: 18+, at least 10% equity, ready to live in Chile full-time.',
          'Pitch video: 90 seconds or less, public, no password, upload date visible.',
          'Ignite: a second video of up to 120 seconds showing the MVP working.',
          'No empty fields and no empty drop-downs.',
          'Every past CORFO co-financing declared.',
          'Submitted well before 13:00 Chile time on 24 November 2026, and the confirmation email received.',
        ],
      },
    },
    {
      heading: 'How you are scored',
      lead: {
        type: 'tiles',
        label: 'Written stage, all three tracks',
        tiles: [
          { value: '20%', label: 'Team', sub: 'composition, qualification, experience' },
          { value: '50%', label: 'Project value', sub: 'market 15 · product 15 · traction 10 · Chile 10' },
          { value: '30%', label: 'Growth potential', sub: 'scalability 15 · strategy 15' },
          { value: '4.00', label: 'Minimum out of 7', sub: 'on team, on product and overall' },
        ],
      },
      body: [
        'The written application is graded from 1 to 7 with the same weights on Build, Ignite and Growth. To reach interview you need at least 4.00 on the team criterion, 4.00 on product or service, and 4.00 overall. CORFO then invites up to three times as many startups as the budget can fund; ties at the cut-off all go through (BIG 13 T&C, pp. 13–15). The 2025 rules used fixed caps of 60, 90 and 50 interviews instead.',
        'The interview has four criteria, again the same for all tracks: team leader 30%, the role of Chile in the project 30%, the problem 20% and the technology base 20%, which includes a demonstration. Your final grade is the simple average of the two stages, plus the 5% relocation bonus if it applies, capped at 7.00 (BIG 13 T&C, pp. 16–18).',
      ],
      visual: {
        type: 'columns',
        caption: 'Interview weights, all tracks (%)',
        items: [
          { label: 'Team leader', value: 30, display: '30%' },
          { label: 'Role of Chile', value: 30, display: '30%' },
          { label: 'Problem', value: 20, display: '20%' },
          { label: 'Technology', value: 20, display: '20%' },
        ],
      },
      table: {
        caption: 'Written evaluation, criterion by criterion',
        head: ['Criterion', 'Weight', 'What it asks'],
        rows: [
          ['Team', '20%', 'Composition, qualification and experience (minimum 4.00)'],
          ['Market opportunity', '15%', 'Size, sources, who pays'],
          ['Product or service', '15%', 'What is new and how it works (minimum 4.00)'],
          ['Traction and validation', '10%', 'Results already achieved, not projections'],
          ['Impact in Chile', '10%', 'What the project does in and for Chile'],
          ['Scalability', '15%', 'Revenue that grows faster than cost'],
          ['Growth strategy', '15%', 'How you will reach the market'],
        ],
        note: 'BIG 13 T&C pp. 13–15, 32–33, 49–51. Tie-break order in the interview: team leader, role of Chile, technology, problem.',
      },
    },
    {
      heading: 'Women founders and the 5% relocation bonus',
      lead: {
        type: 'checks',
        label: 'Two rules that change the odds',
        columns: 2,
        items: [
          { label: 'At least 50% of Build places', note: 'for women-led startups, if enough apply' },
          { label: 'Better co-financing', note: 'Ignite 90/10 and Growth 60/40 with a woman leader' },
          { label: 'Female Founder Factor', note: 'a programme for women leaders on every track' },
          { label: '+5% on the final grade', note: 'leader living outside Chile who relocates' },
        ],
      },
      body: [
        'On Build, "up to 50%" of approved projects may be led by a man, so at least half go to women-led teams; the cap rises only if there are not enough eligible women-led projects. A project approved under this rule must prove the leader\'s registered sex at formalisation. A woman team leader also gets better co-financing on Ignite (90/10 instead of 80/20) and Growth (60/40 instead of 50/50), and access to the Female Founder Factor on every track (RE N°1.457, pp. 6, 16, 52; BIG 13 T&C, p. 18).',
        'The relocation bonus is new in 2026. If, on the day the call opened, the team leader\'s habitual residence is outside Chile and the leader will relocate, the final grade gets a 5% bonus. The proof is a residence certificate or another official document from your country of residence, no older than 90 days before the opening. Without proof, no bonus. It does not stack with the 5% bonus for companies holding Chile\'s 40-hour-week seal, and the grade stays capped at 7.00 (BIG 13 T&C, pp. 17–18).',
      ],
    },
    {
      heading: 'The BIG 13 timeline',
      lead: {
        type: 'steps',
        caption: 'CORFO\'s calendar, the same for all three tracks',
        steps: [
          { label: 'Call opens', chip: '3 Nov 2026' },
          { label: 'Call closes', chip: '24 Nov 2026, 13:00' },
          { label: 'Evaluation', chip: '25 Nov 2026 – 26 Jan 2027' },
          { label: 'Results', chip: '27 Jan – 3 Feb 2027' },
          { label: 'Benefit delivered', chip: '3 May – 30 Jun 2027' },
        ],
      },
      body: [
        'Every date here is on CORFO\'s three BIG 13 call pages and in the call notice of 3 November 2026. Questions go to startupchile@corfo.cl until three business days before the close.',
        'The execution period starts when the resolution approving your subsidy agreement is fully processed, and that agreement is signed only once your residence visa is available (BIG 13 T&C, pp. 69, 78). There is a mandatory Orientation Day. No official document gives a March 2027 start date, though the application form asks whether the leader can dedicate 100% from March 2027; treat March as the earliest you should be free, and May to June 2027 as when CORFO plans to deliver the benefit.',
      ],
      timeline: {
        caption: 'From application to the end of Build, at the earliest',
        items: [
          { when: '24 November 2026', what: 'Application closes at 13:00 Chile time.' },
          { when: 'By about 24 December 2026', what: 'Admissibility checked (30 days after close).' },
          { when: 'December 2026 – January 2027', what: 'Written evaluation and remote interviews.' },
          { when: '27 January – 3 February 2027', what: 'Results by email.' },
          { when: 'February – April 2027', what: 'Visa from abroad with the acceptance letter; guarantee ready.' },
          { when: '3 May – 30 June 2027', what: 'Agreement formalised and the benefit delivered, per CORFO\'s calendar.' },
          { when: 'Up to 4, 6 or 8 months later', what: 'End of execution on Build, Ignite or Growth; final report within one month.' },
        ],
      },
    },
    {
      heading: 'Visa documents',
      lead: {
        type: 'checks',
        label: 'What SERMIG asks of everyone applying from abroad',
        icon: 'number',
        items: [
          { label: 'The acceptance letter', note: 'from Start-Up Chile' },
          { label: 'A passport valid at least 1 year', note: 'from the date you apply' },
          { label: 'Police certificates', note: 'at most 60 days old, apostilled or legalised' },
          { label: 'Apply from outside Chile', note: 'not as a tourist inside Chile' },
        ],
      },
      body: [
        'The programme documents say only that the temporary residence visa is obtained before arriving in Chile and requires the programme\'s acceptance letter (BIG 13 T&C, p. 69). The rest is Chile\'s general rule for temporary residence, set by DS 177/2022 and SERMIG.',
        'A passport valid for at least one year from the date of application (DS 177, art. 11 a). Police certificates from your country of origin and from every country you lived in during the last five years, for applicants 18 and over, no older than 60 days, apostilled or legalised. Other public documents at most 60 days old, private ones at most 30 (DS 177, art. 8). Applications are made from abroad: a tourist in Chile cannot apply for residence (Ley 21.325, art. 58). Once approved, you have 90 days to enter, and the permit runs from the date you enter.',
        'Each Chilean consulate sets its own practical details, and countries outside the Apostille Convention need the full legalisation chain instead of an apostille. Read SERMIG\'s own page for your case before you order documents; the 60-day limit means ordering them too early is as bad as too late.',
      ],
      callout: 'The 18-month passport and "police certificate up to one year old" quoted in some guides are not in any official document we read. SERMIG\'s rule is a passport valid one year and certificates no older than 60 days.',
    },
    {
      heading: 'After the programme: the two-year residence and what comes next',
      lead: {
        type: 'years',
        caption: 'From temporary residence to Chilean nationality',
        milestones: [
          { at: 0, year: 'Year 0', label: 'Temporary residence', sub: 'up to 2 years' },
          { at: 2, year: 'Month 24', label: 'Permanent residence', sub: 'apply 90 to 10 days before expiry' },
          { at: 5, year: 'Year 5', label: 'Nationality', sub: 'counted from the first temporary permit' },
        ],
      },
      body: [
        'Nothing obliges you to stay in Chile after the programme. If you want to, the route runs through ordinary immigration law, not through Start-Up Chile.',
        'Permanent residence (residencia definitiva) needs at least 24 months on temporary residence, applied for online on SERMIG\'s portal no more than 90 and no fewer than 10 days before the temporary permit expires (DS 296/2022, arts. 62, 65). The subcategory you hold must allow it. For people whose ground is running a business, the regulation looks for two tax years of effective company operation or 18 months of continuous investment (art. 66 d).',
        'Time abroad raises the 24 months: up to 2 months away, 24 months; more than 2 and up to 6, 30 months; more than 6 and up to 12, 36 months; more than 12, 48 months (DS 296/2022, art. 65 No. 3, and SERMIG\'s page).',
        'If you are not ready for permanent residence, you can extend (prórroga) the temporary residence from inside Chile, between 90 and 10 days before it expires, for up to two more years, renewable. A self-employed holder must show SII records of activity for at least 60% of the permit period (DS 177, art. 21 b; DS 296/2022, art. 70; DS 4.236, art. 4).',
        'Naturalisation is open at 18 or over to permanent residents who have lived in Chile five years or more, counted from the electronic stamp of the temporary residence that led to permanent residence (SERMIG nationality page). SERMIG\'s fee for permanent residence was CLP 142,726 for applications up to 30 November 2026; it moves monthly with the dollar.',
      ],
      table: {
        caption: 'Permanent residence: time abroad against months required',
        head: ['Time abroad during temporary residence', 'Months of residence required'],
        rows: [
          ['2 months or less', '24'],
          ['More than 2, up to 6 months', '30'],
          ['More than 6, up to 12 months', '36'],
          ['More than 12 months', '48'],
        ],
        note: 'DS 296/2022 art. 65 No. 3; serviciomigraciones.cl/residencia-definitiva.',
      },
      checklist: {
        title: 'Permanent residence: what a business owner files',
        intro: 'SERMIG\'s list for business owners. The self-employed list is different (SII start-of-activity certificate, fee-receipt report, pension and health certificates).',
        items: [
          'Carpeta Tributaria from the SII.',
          'Deed of incorporation of the company and its amendments.',
          'Certificate that the company is in good standing.',
          'Latest income tax return of the company and my own.',
          'VAT payment returns.',
          'Police certificate no older than 60 days.',
          'Dependants file separately once I qualify.',
        ],
      },
    },
    {
      heading: 'Money warnings',
      lead: {
        type: 'checks',
        label: 'What to budget before you go',
        icon: 'alert',
        columns: 2,
        items: [
          { label: 'Living costs until the first advance', note: 'no official date after arrival' },
          { label: 'A guarantee for 100% of each advance', note: 'cost chargeable to the project' },
          { label: 'Your co-financing share', note: '10%, 20% or 50% of the total' },
          { label: 'Repayment if terminated for fault', note: 'the whole subsidy, at nominal value' },
        ],
      },
      body: [
        'Plan for months in Chile before the grant pays you. The first advance needs a fully processed resolution, a guarantee for 100% of the amount and proof that tax and social-security payments are up to date, and the agreement needs your visa first (BIG 13 T&C, pp. 69, 73–76). CORFO\'s calendar puts delivery of the benefit between 3 May and 30 June 2027. How long after landing the money comes is not in any official document. Founders who went through the programme describe a wait of one to three months after arrival; that is their experience, not a rule, and your own will depend on how fast your visa and guarantee are ready.',
      ],
      bullets: [
        'Spending counts only from the date the resolution approving your agreement is fully processed; contributions count from the approval notice (BIG 13 T&C, p. 82).',
        'Purchases above CLP 2,000,000 net on Build, 5,000,000 on Ignite and 10,000,000 on Growth need CORFO\'s prior approval and three quotes, or CORFO recognises only the cheapest quote (RE N°1.457, pp. 63–64).',
        'Flights from the grant are economy class only; at most one computer per participant (BIG 13 T&C, p. 78).',
        'Not payable from the grant: recovered taxes, capital-market investments, debts, real estate, personal and leisure costs, urban transport, alcohol, pet expenses (BIG 13 T&C, p. 83).',
        'If the project costs less than budgeted, you return the subsidy above the approved percentage; overruns are yours (BIG 13 T&C, p. 83).',
        'Terminated for a reason attributable to you, including leaving Chile or not working full-time: you return the whole subsidy received, and CORFO calls the guarantee if you do not (BIG 13 T&C, pp. 8, 90–91).',
        'Tax: the official documents do not say how the grant is taxed. Ask a Chilean accountant.',
        'The peso moves: a CLP figure that was USD 33,000 in the brochure can be worth noticeably less, or more, by the time it is paid.',
      ],
      callout: 'Bring enough of your own money for the first months in Chile, plus your co-financing share. The grant reimburses a project; it is not a salary that starts on the day you land.',
    },
  ],

  faqs: [...COMMON_FAQS, ...DEEP_DIVE_FAQS],
  faqGroups: [
    { heading: 'Frequently asked questions', faqs: COMMON_FAQS },
    { heading: 'Scoring, money, the visa and residence, in detail', faqs: DEEP_DIVE_FAQS },
  ],
  downloadsIntro:
    'The BIG 13 application, field by field: all 8 sections of the portal with each question\'s format and character limit, read from the live form on 23 November 2026, with space for your answers. Free to share with attribution; not legal advice.',
  downloads: [
    {
      title: 'Start-Up Chile BIG 13 application checklist (Word)',
      description: 'Every portal question with its format and limit, and an empty column for your draft answers. Edit it, share it with your co-founders.',
      file: 'visaroads-start-up-chile-big13-checklist-en.docx',
      kind: 'docx',
      meta: ['DOCX', 'English', 'About 110 fields'],
    },
    {
      title: 'Start-Up Chile BIG 13 application checklist (PDF)',
      description: 'The same checklist as a PDF, to print and tick off, or to read on your phone next to the portal.',
      file: 'visaroads-start-up-chile-big13-checklist-en.pdf',
      kind: 'pdf',
      meta: ['PDF', 'English', 'Print-ready'],
    },
    {
      title: 'Start-Up Chile BIG 13 application checklist, Persian edition (Word)',
      description: 'The same checklist in Persian (فارسی), set right to left, for Persian-speaking co-founders.',
      file: 'visaroads-start-up-chile-big13-checklist-fa.docx',
      kind: 'docx',
      meta: ['DOCX', 'Persian'],
    },
    {
      title: 'Start-Up Chile BIG 13 application checklist, Persian edition (PDF)',
      description: 'The Persian checklist as a PDF.',
      file: 'visaroads-start-up-chile-big13-checklist-fa.pdf',
      kind: 'pdf',
      meta: ['PDF', 'Persian'],
    },
  ],
  closing: [
    { label: 'Free route assessment', href: '/which-path' },
    { label: 'Compare with Spain', href: '/europe/spain' },
    { label: 'Compare with Belgium', href: '/europe/belgium' },
    { label: 'Book a consultation', href: '/book-meeting' },
  ],
  sources: [
    { label: 'Start-Up Chile — BIG 13 Terms & Conditions (consolidated RE N°1.457/2025 as amended by RE N°1.411/2026, PDF)', url: TC },
    { label: 'CORFO — Bases Start-Up Chile, consolidated text, Nov 2026 (Spanish, PDF)', url: 'https://saowcsblobassets.blob.core.windows.net/assets/CONV/26BLD-2/Bases%20Start-Up%20Chile%20-%20Refundido%20No%20Oficial%20(nov%202026).pdf' },
    { label: 'CORFO — RE N°1.457 de 2025, Start-Up Chile rules (PDF)', url: 'https://saowcsblobassets.blob.core.windows.net/assets/PG/12983/RE%20N%C2%B01457%20de%202025%20de%20Start-Up%20Chile%20de%20Corfo.pdf' },
    { label: 'CORFO — BIG 13 call notice, 3 Nov 2026 (PDF)', url: 'https://saowcsblobassets.blob.core.windows.net/assets/CONV/26BLD-2/Aviso_BIG_Start-UpChile_3.11.pdf' },
    { label: 'CORFO — Start-Up Chile Build 13 call', url: 'https://www.corfo.gob.cl/sites/cpp/convocatoria/start-up-chile-build-13/' },
    { label: 'CORFO — Start-Up Chile Ignite 13 call', url: 'https://www.corfo.gob.cl/sites/cpp/convocatoria/start-up-chile-ignite-13/' },
    { label: 'CORFO — Start-Up Chile Growth 13 call', url: 'https://www.corfo.gob.cl/sites/cpp/convocatoria/start-up-chile-growth-13/' },
    { label: 'CORFO — Start-Up Chile programme page', url: 'https://www.corfo.gob.cl/sites/cpp/programa/startup-chile/' },
    { label: 'Start-Up Chile — BIG 13 brochure (PDF)', url: 'https://startupchile.org/content/uploads/brochure-big-13-eng-2026-1.pdf' },
    { label: 'Start-Up Chile — Apply', url: 'https://startupchile.org/en/apply/' },
    { label: 'SERMIG — Temporary residence', url: 'https://serviciomigraciones.cl/en/residencia-temporal-permit/' },
    { label: 'SERMIG — Permanent residence (residencia definitiva)', url: 'https://serviciomigraciones.cl/residencia-definitiva/' },
    { label: 'SERMIG — Extension of temporary residence (prórroga)', url: 'https://serviciomigraciones.cl/residencia-temporal/prorroga/' },
    { label: 'SERMIG — Dependants', url: 'https://serviciomigraciones.cl/residencia-temporal/calidad-de-dependiente/' },
    { label: 'SERMIG — Nationality', url: 'https://serviciomigraciones.cl/nacionalidad/' },
    { label: 'SERMIG — Migration fees', url: 'https://serviciomigraciones.cl/aranceles-migratorios/' },
    { label: 'BCN — Ley 21.325, Migration and Foreigners Act', url: 'https://www.bcn.cl/leychile/navegar?idNorma=1158549' },
    { label: 'BCN — DS 296/2022, regulation of Ley 21.325', url: 'https://www.bcn.cl/leychile/navegar?idNorma=1172573' },
    { label: 'BCN — DS 177/2022, temporary residence subcategories', url: 'https://www.bcn.cl/leychile/navegar?idNorma=1176043' },
  ],
};
