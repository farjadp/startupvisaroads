// ============================================================================
// /en/europe/bulgaria — the Bulgarian Startup Visa certificate, in English.
// A guided route in the shape of /country/finland: a compact hero, a sticky
// rail whose Bulgarian flag rises as the reader completes each stop, and one
// stop per question people search. Each stop opens with its question as the
// H2 and a 45–60-word direct answer, then the detail.
//
// Source of truth: content/fa/europe-bulgaria.ts (updated 2026-10-29), which
// was verified against the MIG Ordinance (Decree No. 318 of 7 Oct 2022), the
// Foreigners in the Republic of Bulgaria Act (arts. 24p and 25), MIG's NIMS
// guidelines and the 2026 minimum wage. Every fact, caveat, FAQ and source in
// that module is carried here; nothing is added. Spot-checked 2026-10-29
// against the English Ordinance text MIG publishes: art. 6(3) and 6(5),
// art. 7 (30 days, 14 days, 7 days), art. 13 (two-year extension), art. 15.
//
// The module's advice for Iranian passport holders is kept as a labelled note
// for applicants from sanctioned countries, not as the page's framing.
//
// Photos are the site's own (public/fa/img/bulgaria*.webp), checked by eye on
// 2026-10-29: Alexander Nevsky Cathedral in Sofia, Plovdiv's old town, and
// Vitosha Boulevard in Sofia.
// ============================================================================

import React from 'react';
import Image from 'next/image';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from '@/routing';
import JsonLd from '@/components/JsonLd';
import { faqJsonLd } from '@/lib/seo';
import { MAIN_CONTACT } from '@/content/contact';
import Flag from '@/components/route/flags';
import { RouteProvider, RouteRail, RouteStop, RouteFinish, type RouteStopDef, type RouteTheme } from '@/components/route/RouteProgress';
import { CopyButton, GateQuiz, OpenedTracker, ParallaxLayer, PerkOrCatch } from '@/components/route/RouteWidgets';
import { PointsCounter, StepTrail, type Criterion, type TrailStep } from './BulgariaWidgets';
import { SOURCES, UPDATED } from './meta';

// ─── Data ────────────────────────────────────────────────────────────────────

// Bulgarian green for highlights, a deep red from the flag for figures.
// Contrast (WCAG 2.x): accentInk #00140E on accent #00966E 5.05:1;
// accentText #00704F on #F2F0E9 5.37:1, on white 6.12:1, on soft 5.19:1;
// primary #A51E10 on white 7.52:1, on #F2F0E9 6.59:1; accentOnDark #2FC594
// on deep #0B2A21 6.97:1 (the accent itself only reaches 4.09:1 there).
const THEME: RouteTheme = {
  accent: '#00966E',
  accentInk: '#00140E',
  accentText: '#00704F',
  primary: '#A51E10',
  deep: '#0B2A21',
  soft: '#DCF1E9',
  accentOnDark: '#2FC594',
};

const STOPS: RouteStopDef[] = [
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'points', label: '14 points' },
  { id: 'money', label: 'Money' },
  { id: 'documents', label: 'Documents' },
  { id: 'steps', label: '7 steps' },
  { id: 'after', label: 'Renewal & PR' },
  { id: 'company', label: 'Company & tax' },
  { id: 'catches', label: 'Catches' },
  { id: 'compare', label: 'Compare' },
  { id: 'help', label: 'Our role' },
  { id: 'faq', label: 'FAQ' },
];

// The module's `facts`, in order.
const snapshot = [
  { label: 'Proof of funds', value: '€1,860.60', note: 'Three times the 2026 minimum wage, held at least 30 consecutive days' },
  { label: 'Minimum investment', value: 'None', note: '€51,129 counts only for one optional point' },
  { label: 'Points to pass', value: '8 of 14', note: 'Six criteria; the business plan is worth up to 5' },
  { label: 'Review time', value: '30 days', note: 'Plus 14 days to fix any gaps' },
  { label: 'Certificate fee', value: 'Free', note: 'To issue and to extend' },
  { label: 'Team on the certificate', value: 'Up to 3', note: 'The applicant and two team members' },
  { label: 'Certificate validity', value: '1 year', note: 'Extended by 2 years on a progress report' },
  { label: 'Stake in a Bulgarian company', value: 'At least 50%', note: 'After the D visa, not before it' },
  { label: 'Signature', value: 'Qualified e-signature', note: 'A detached .p7s signature in NIMS' },
  { label: 'Permanent residence', value: 'After 5 years', note: 'With no more than 30 months away' },
];

// Article 7(5) of the Ordinance, each criterion once.
const criteria: Criterion[] = [
  {
    title: 'Personal funds',
    max: 3,
    mandatory: true,
    body: 'A bank document showing at least three monthly minimum wages in your own personal account for 30 consecutive days before you apply. Also a mandatory attachment.',
  },
  {
    title: 'Financial forecast and capital',
    max: 3,
    body: 'A comprehensive, realistic forecast for three years, month by month: revenue, direct costs, operating costs and net profit, with revenue growing over the period.',
  },
  {
    title: 'Customer network',
    max: 1,
    body: 'Sales of at least BGN 100,000 (€51,129) over the last two years, proven by contracts, invoices and bank statements. Optional.',
  },
  {
    title: 'Investment',
    max: 1,
    body: 'An investment contract or letter of intent for at least BGN 100,000 from a venture capital fund. Optional.',
  },
  {
    title: 'Patent or utility model',
    max: 1,
    body: 'A valid patent for an invention or a valid utility model registration in the EU, the US or an OECD country, related to the project. Optional.',
  },
  {
    title: 'Business plan and presentation',
    max: 5,
    body: 'Realistic assumptions, readiness to reach the market and earn revenue within six months, scalability, the ability to build a team and hire up to ten people in year one, and export potential.',
  },
];

const steps: TrailStep[] = [
  {
    title: 'Prepare',
    who: 'You',
    body: 'Write the business plan and the monthly three-year financial forecast, get the bank proof of funds held for 30 days, arrange the translations you need, and obtain a qualified electronic signature.',
    note: 'Solve the qualified electronic signature first. Without it the application cannot be filed.',
    figure: '30 days',
    figureLabel: 'funds held before you file',
  },
  {
    title: 'Fill in NIMS',
    who: 'NIMS (enims.egov.bg)',
    body: 'Register in the NIMS system, choose the Ministry of Innovation and Growth procedure and complete the form: implementation period 12 months, budget exactly 0.00, team and activity details, and the attachments uploaded.',
    note: 'The budget field must read exactly 0.00, because the certificate is free.',
    figure: '0.00',
    figureLabel: 'in the budget field',
  },
  {
    title: 'Sign and file',
    who: 'Qualified e-signature',
    body: 'Download the application file, sign it separately with your qualified electronic signature to produce a detached .p7s file, upload that signature and submit.',
    note: 'The whole application is signed with a qualified signature, not a simple one.',
    figure: '.p7s',
    figureLabel: 'detached signature',
  },
  {
    title: 'Expert council',
    who: 'Ministry of Innovation and Growth',
    body: 'The expert council reviews the file within 30 days. If it finds gaps, you get 14 days to fix them. The minister’s decision is announced within 7 days.',
    note: 'The decision is reasoned and can be appealed under Bulgaria’s Administrative Procedure Code.',
    figure: '30 days',
    figureLabel: 'to review a complete file',
  },
  {
    title: 'D visa',
    who: 'Bulgarian embassy',
    body: 'With the certificate, apply for a type D visa at a Bulgarian embassy. Get the document list from the embassy where you apply.',
    note: 'Usually a passport, a criminal record certificate, health insurance, proof of accommodation and proof of means.',
    figure: 'Type D',
    figureLabel: 'long-stay visa',
  },
  {
    title: 'Company',
    who: 'In Bulgaria',
    body: 'Enter Bulgaria and register a company, or buy shares, so that you hold at least 50% of the capital in the field the certificate was issued for.',
    note: 'After the D visa, not before it. That is the order Article 24p sets.',
    figure: '≥ 50%',
    figureLabel: 'of the company’s capital',
  },
  {
    title: 'Residence permit',
    who: 'Migration authority',
    body: 'Apply to the migration authority for a long-term residence permit, with the D visa, the certificate and your shareholding.',
    note: 'The certificate is one condition for this permit, not the permit itself.',
    figure: '1 + 2',
    figureLabel: 'years: certificate, then extension',
  },
];

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to apply for the Bulgaria startup visa',
  inLanguage: 'en',
  step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.body })),
};

// "Ready to file?" — the three mandatory attachments, plus the two things
// without which the file cannot be signed or read.
const readiness = [
  { title: 'Passport copy', body: 'A copy of your identity document (passport) with photo and personal details. Mandatory.' },
  { title: 'Business plan and presentation', body: 'The plan, built around the five questions of the business-plan criterion, plus the monthly three-year forecast. Mandatory.' },
  { title: 'Bank proof of funds', body: 'At least three monthly minimum wages (€1,860.60 in 2026) in your personal account for 30 consecutive days before filing. Mandatory.' },
  { title: 'Qualified electronic signature', body: 'Issued only by authorised providers under the EU eIDAS rules, after identity checks. Without it, NIMS will not accept the application.' },
  { title: 'Certified Bulgarian translations', body: 'Article 6(5): attachments and a business plan prepared in English must come with a certified, legalised Bulgarian translation.' },
];

const optionalDocs = [
  'A patent for an invention or a utility model certificate',
  'An investment contract with an international fund, with the fund’s recommendation',
  'An investment contract or letter of intent from a Bulgarian fund',
  'A Seal of Excellence from the Horizon programmes',
  'An award from a European Commission or European Space Agency innovation competition',
  'At least two Q1 or Q2 articles in Scopus or Web of Science',
  'Your degree certificate',
  'Proof of sales',
  'A letter of cooperation with Bulgarian partners',
];

const costs = [
  { item: 'Proof of personal funds', amount: '€1,860.60', status: 'Mandatory', note: '3 × €620.20, the 2026 monthly minimum wage, held 30 consecutive days before filing. A little over US$2,000.' },
  { item: 'Proof of funds if the 2027 draft is adopted', amount: '€1,980', status: 'From Jan 2027, if adopted', note: 'A draft decree proposes a €660 minimum wage from 1 January 2027. The wage on your filing day is what counts.' },
  { item: 'Minimum investment', amount: 'None', status: '—', note: 'The scheme sets no investment threshold.' },
  { item: 'Sales over the last two years', amount: 'BGN 100,000 = €51,129.19', status: 'Optional, 1 point', note: 'Customer-network criterion. Converted at the fixed rate of 1.95583.' },
  { item: 'Venture capital contract or letter of intent', amount: 'BGN 100,000 = €51,129.19', status: 'Optional, 1 point', note: 'Investment criterion.' },
  { item: 'Issuing and extending the certificate', amount: 'Free', status: 'Article 14', note: 'Enter the budget as exactly 0.00 in NIMS.' },
  { item: 'D visa, residence card, certified translations, e-signature, company registration', amount: 'Separate costs', status: 'Not set by MIG', note: 'Not shown here: none of these could be read off an official Bulgarian page.' },
];

const perksAndCatches = [
  { title: 'The certificate fee', content: 'Free to issue and free to extend (Article 14 of the Ordinance).', positive: true },
  { title: 'The review clock', content: 'The expert council decides within 30 days of filing, with 14 days to fix any gaps.', positive: true },
  { title: 'The scoring', content: 'Six criteria and 14 points, published in the Ordinance itself. You can score your own file before you spend anything.', positive: true },
  { title: 'The money', content: 'No minimum investment. The only required amount is three minimum wages: €1,860.60 in 2026.', positive: true },
  { title: 'The signature', content: 'A qualified electronic signature from an authorised EU provider, with identity checks. No signature, no application.', positive: false },
  { title: 'The translations', content: 'English attachments need a certified, legalised Bulgarian translation. Budget the time and cost.', positive: false },
  { title: 'The first year', content: 'The certificate lasts one year. Visa, arrival, company and a real start all have to fit inside it for the progress report.', positive: false },
  { title: 'The 50% rule', content: 'Your residence is tied to majority ownership. An investor who wants 55% breaks the condition.', positive: false },
];

const comparison = [
  { country: 'Bulgaria', plus: 'Transparent points-based criteria, very low proof of funds, a free certificate decided in 30 days, 10% corporate tax.', minus: 'A one-year certificate, the 50% shareholding rule, a qualified electronic signature and translations into Bulgarian.' },
  { country: 'Spain', plus: 'A decision in 20 days with positive silence, a first residence permit of three years, and family at the same time.', minus: 'ENISA’s assessment is qualitative, and citizenship takes ten years.' },
  { country: 'Italy', plus: 'A thirty-day committee.', minus: '€50,000 for the team, and a first residence permit of one year.' },
  { country: 'Estonia', plus: 'Fast and cheap.', minus: 'An MVP is required.' },
  { country: 'Denmark', plus: 'A transparent scoring panel, like Bulgaria’s.', minus: 'An annual quota and much higher proof of funds.' },
];

const commonFaqs = [
  {
    q: 'What exactly is the Bulgarian startup visa?',
    a: 'The name misleads: it is not a visa but a certificate. Bulgaria’s Ministry of Innovation and Growth (MIG) issues a "Startup Visa" certificate for a technology or innovative project, and under Article 24p of the Foreigners in the Republic of Bulgaria Act it is one of the documents needed for a long-term residence permit. The entry visa (type D) comes from an embassy and the residence card from the migration authority. The certificate is necessary, not sufficient.',
  },
  {
    q: 'How much money do I need to show?',
    a: 'Less than you might think. The only mandatory amount is three times Bulgaria’s monthly minimum wage, held in your own account for at least 30 consecutive days before you apply. The 2026 minimum wage is €620.20 a month, so that is €1,860.60, a little over US$2,000. The €51,000 figure you see in infographics is optional and worth one point.',
  },
  {
    q: 'How long does it take?',
    a: 'Under the Ordinance, the expert council reviews the file within 30 days of filing. If it finds gaps, you have 14 days to fix them, and the assessment follows within a month of the fix. The minister’s decision is announced within 7 days. That covers only the certificate; the D visa and the residence card take their own time.',
  },
  {
    q: 'How does the scoring work?',
    a: 'Six criteria, 14 points in total, 8 to pass: personal funds (up to 3), a three-year financial forecast (up to 3), a customer network, meaning real sales (1), a fund investment (1), a patent or utility model (1), and the business plan and presentation (up to 5). So you can reach 8 with no sales, no investor and no patent, but only with strong funds evidence, a strong financial model and a very good business plan.',
  },
  {
    q: 'How many of us can apply together?',
    a: 'The certificate is issued in the applicant’s name and, under Article 10 of the Ordinance, can also name two other team members, provided the business plan justifies why they are needed. So at most three people on one certificate.',
  },
  {
    q: 'Do I need to register a company before applying?',
    a: 'No. Article 24p of the Foreigners Act sets the order: the residence permit goes to someone who holds the D visa and the certificate and who, after the D visa was issued, became a partner or shareholder holding at least 50% of the capital of a Bulgarian company. Company after visa. A road map that puts company registration before the visa has the law’s order backwards.',
  },
  {
    q: 'Is there a government fee?',
    a: 'Issuing and extending the certificate is free (Article 14 of the Ordinance), and in the online system you must enter the budget as exactly 0.00. The D visa, the residence card, certified translations, the electronic signature and company registration have separate costs.',
  },
  {
    q: 'When can I get permanent residence after the certificate?',
    a: 'The certificate lasts one year and is extended by two more on a progress report. Under Article 25 of the Foreigners Act, permanent residence follows five years of lawful, continuous residence, provided you have not spent more than 30 months in total outside Bulgaria in those five years.',
  },
];

const deepFaqs = [
  {
    q: 'Exactly how much is the proof of funds in euros and dollars?',
    a: 'Bulgaria’s monthly minimum wage from 1 January 2026 is €620.20 (the former BGN 1,213). Three times that is €1,860.60; in US dollars a little over $2,000, depending on the day’s rate. One warning: the government has put forward a draft of €660 for 2027; if adopted, the amount needed from January 2027 is €1,980. What counts is the minimum wage on the day you file, and we suggest keeping somewhat more than the minimum in the account to be safe.',
  },
  {
    q: 'If the funds are mandatory, why do they also score points?',
    a: 'Because the Ordinance makes them both a mandatory attachment and the first assessment criterion, worth up to 3 points. In practice, correct and complete evidence earns full points; incomplete evidence loses the points and leaves the file incomplete. The key detail is "30 consecutive days": a balance that arrived a week before filing is not enough.',
  },
  {
    q: 'What is the €51,000 figure?',
    a: 'It is BGN 100,000, which at the fixed conversion rate of 1.95583 is €51,129.19. It appears in two optional criteria: real sales of at least that amount over the last two years (the customer-network criterion, 1 point), and a contract or letter of intent for at least that amount from a venture capital fund (the investment criterion, 1 point). Neither is a requirement. The Ordinance is still written in leva because it was adopted before Bulgaria joined the euro in 2026.',
  },
  {
    q: 'What earns the business plan its 5 points?',
    a: 'Article 7 names five questions: are the assumptions, forecasts and plans realistic; are you ready to reach the market and generate revenue within six months; is the project scalable; can it build a team and hire up to ten people in the first year; and does it have export potential. These five questions make up the largest share of the score, and unlike a patent or an investor they are entirely in your own hands.',
  },
  {
    q: 'What should the three-year financial forecast look like?',
    a: 'The Ordinance is precise: a forecast for three years from the application date, month by month, with revenue, direct costs, operating costs and net profit, and with revenue growing over the three years. That means 36 columns, not three annual figures. A tidy spreadsheet with its assumptions explained earns these 3 points; a few attractive growth charts do not.',
  },
  {
    q: 'What does "innovative" mean under the Ordinance?',
    a: 'Paragraph 6 of the Ordinance’s supplementary provisions defines an innovative project as one with at least one of three things: a valid patent for an invention, a valid utility model registration certificate, or an innovation that is new to the global or European market and better than existing solutions. For most software startups it is the third, and the business plan carries the burden of proving it.',
  },
  {
    q: 'Can I apply in English?',
    a: 'The application form can be completed in English or Bulgarian (Article 6(3)). But paragraph 5 of the same article says attachments and a business plan prepared in English must come with a certified, legalised Bulgarian translation. Confirm the ministry’s practice before you file, through its official address (startupvisa@mig.gov.bg); do not count on English alone being enough.',
  },
  {
    q: 'What is the qualified electronic signature, and where do I get one?',
    a: 'Under the ministry’s technical guidelines, the whole application in NIMS (enims.egov.bg) is signed with a qualified electronic signature: you download the application file, create a detached signature (a .p7s file) with the signature provider’s software and upload it. Qualified signatures are issued only by providers authorised under the EU eIDAS rules, after verifying your identity. For most applicants outside Europe this is the most practical bottleneck of the whole route.',
  },
  {
    q: 'Who sits on the expert council?',
    a: 'For each file, the Minister of Innovation and Growth sets up a council by separate order. Under Article 4 it may include representatives of the Ministry of Education and Science, the Patent Office, universities, the Bulgarian Academy of Sciences and business organisations, and two representatives of non-profit organisations connected with startups and venture capital funds must be invited. So your plan is read by people from the ecosystem, not only by civil servants.',
  },
  {
    q: 'What is the right order after the certificate?',
    a: 'The certificate, then a D visa from a Bulgarian embassy, then entry, then registering a Bulgarian company or buying shares so you hold at least 50% of the capital in the field named in the certificate, then an application for a long-term residence permit to the migration authority. That is the order of Article 24p of the Foreigners Act. Get the D visa document list from the embassy where you apply; it is usually a passport, a criminal record certificate, health insurance, proof of accommodation and proof of means.',
  },
  {
    q: 'How does the extension work?',
    a: 'In the last month of the certificate’s validity you submit a report of the work done to the ministry electronically, including proof that you are a partner or shareholder holding at least 50% of a Bulgarian company (Article 13). The council gives its opinion within a month, and the minister extends the certificate by two years or refuses. The extension is also free. Anyone who has not set up the company or done the work in year one gets stuck here.',
  },
  {
    q: 'What gets the certificate revoked?',
    a: 'Article 15 names three cases: false information, or not reporting changes within 7 days; changes that make the project, or the conditions of Article 24p, impossible to carry out, such as your stake falling below 50%; and a breach of Bulgarian law formally reported by a state body. A revocation is notified to the migration authority and is grounds for withdrawing residence.',
  },
  {
    q: 'What if I am refused?',
    a: 'The minister’s decision is reasoned, announced within 7 days, and can be appealed under Bulgaria’s Administrative Procedure Code. But because the assessment is points-based, the reason for a refusal is usually clear: which criterion did not score. In most cases, improving the business plan and the financial model and applying again is quicker than an appeal.',
  },
  {
    q: 'Can a traditional business use this route?',
    a: 'No. A café, restaurant, shop or ordinary consulting service does not fit the Ordinance’s definition of a technology or innovative project. Bulgaria’s Foreigners Act has other routes for investors and ordinary business owners, with much higher financial conditions.',
  },
];

// No English Bulgaria articles exist in visaroads.com/sitemap.xml (checked
// 2026-10-29), so these are the English guides to the routes this page
// compares Bulgaria with. Each returned 200 on the dev server.
const related = [
  { href: '/country/italy', flag: 'it' as const, title: 'Italia Startup Visa', blurb: 'The MIMIT committee decides in 30 days on documents alone, with €50,000 required for the team.' },
  { href: '/country/denmark', flag: 'dk' as const, title: 'Denmark Startup Visa 2026', blurb: 'A transparent scoring panel like Bulgaria’s, with an annual quota and much higher self-support.' },
  { href: '/europe/netherlands', flag: 'nl' as const, title: 'Netherlands Startup Visa', blurb: 'A one-year permit that starts with a recognised Dutch facilitator, not with the government.' },
];

// ─── Page ────────────────────────────────────────────────────────────────────

const label = 'font-sans text-xs font-bold uppercase tracking-[0.18em]';
const prose = 'font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70';

export default function BulgariaEn() {
  return (
    <div className="w-full overflow-x-clip bg-[#F2F0E9] text-[#1a1a1a]">
      <JsonLd data={[howToJsonLd, faqJsonLd([...commonFaqs, ...deepFaqs].map((f) => ({ question: f.q, answer: f.a })), 'en')]} />

      <RouteProvider stops={STOPS} flag="bg" theme={THEME}>
        {/* ── Hero ── */}
        <header className="relative overflow-hidden bg-[#0B2A21] text-white">
          <Image
            src="/fa/img/bulgaria.webp"
            alt="The domes of the Alexander Nevsky Cathedral in Sofia against a clear blue sky: the gilded main dome with its cross and a small scaffold beside it, green copper domes and white stone walls with arched windows below"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B2A21]/95 via-[#0B2A21]/80 to-[#0B2A21]/35" />
          {/* The tricolour, faint, at the flag's own 5:3 proportions. */}
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-12 grid aspect-[5/3] w-[540px] grid-rows-3 opacity-10">
            <span className="bg-white" />
            <span className="bg-[#00966E]" />
            <span className="bg-[#D62612]" />
          </div>

          <div className="container relative mx-auto grid grid-cols-1 items-end gap-8 px-6 pb-12 pt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <nav aria-label="Breadcrumb" className="font-sans text-xs text-white/60 lg:col-span-2">
              <ol className="flex flex-wrap gap-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link href="/country" className="hover:text-white">Countries</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-white/85">Bulgaria</li>
              </ol>
            </nav>

            <div>
              <div className={`mb-5 flex items-center gap-3 text-white/75 ${label}`}>
                <Flag code="bg" uid="hero" width={36} />
                Bulgaria · Ministry of Innovation and Growth
              </div>
              <h1>
                <span className="block font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.02em]">
                  Bulgaria <em className="text-[#2FC594]">Startup.</em>
                </span>
                <span className="mt-4 block max-w-[46ch] font-sans text-lg font-medium leading-snug">
                  The Bulgaria startup visa (MIG Startup Visa certificate) in 2026, step by step
                </span>
              </h1>
              <p className="mt-3 max-w-[56ch] font-sans text-base leading-relaxed text-white/70">
                Bulgaria’s Ministry of Innovation and Growth scores your project on six criteria and 14 points, and issues a certificate at 8, free and
                within 30 days. The only money required is three minimum wages: €1,860. The €51,000 in the infographics is optional and worth one
                point. The hard parts are elsewhere: the electronic signature, the translations, and getting the visa and the company in the right order.
              </p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-white/60">
                <span>By <span className="text-white">Farjad P.D</span></span>
                <span>Updated <time dateTime={UPDATED.iso} className="text-white">{UPDATED.label}</time></span>
                <span>Figures checked against the MIG Ordinance, the Foreigners Act, MIG’s NIMS guidelines and the 2026 minimum wage</span>
              </p>
              <p className="mt-5 max-w-[60ch] border-l-2 border-[#2FC594] pl-3 font-sans text-sm text-white/70">
                <strong className="text-white">A certificate, not a visa.</strong> MIG issues the certificate, a Bulgarian embassy issues the D visa, and
                the migration authority issues the residence permit. Three bodies, in that order.
              </p>
            </div>

            <aside aria-label="How to use this page" className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <p className={`text-[#2FC594] ${label}`}>Your route through this page</p>
              <ol className="my-4 list-decimal space-y-1 pl-5 font-sans text-sm text-white/75">
                <li>Score your project on the 14 points</li>
                <li>Check you are ready to file</li>
                <li>Walk the seven steps</li>
                <li>Sort perks from catches</li>
                <li>Compare Bulgaria with the rest of Europe</li>
              </ol>
              <a href="#points" className="inline-flex items-center gap-2 rounded-full bg-[#00966E] px-5 py-3 font-sans text-sm font-bold text-[#00140E] transition-transform hover:-translate-y-0.5">
                Start the route <ArrowRight className="h-4 w-4" />
              </a>
            </aside>
          </div>
        </header>

        <RouteRail />

        {/* 01 — What it is */}
        <RouteStop
          id="snapshot"
          number={1}
          eyebrow="At a glance"
          question="What is the Bulgaria startup visa?"
          task="Read the snapshot"
          completeOn="view"
          message="Snapshot read"
          answer={
            <p>
              The Bulgaria startup visa is a certificate, not a visa. The Ministry of Innovation and Growth issues it, free and within 30 days, to a
              technology or innovative project scoring 8 of 14 points. It is one condition for a long-term residence permit, alongside a D visa and at
              least 50% of a Bulgarian company acquired after that visa.
            </p>
          }
        >
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {snapshot.map((s) => (
              <div key={s.label} className="flex flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white p-4 transition-transform hover:-translate-y-1">
                <dt className="order-2 mt-2 font-sans text-sm font-bold">{s.label}</dt>
                <dd className="order-1 font-serif text-2xl leading-tight text-[#A51E10] md:text-3xl">{s.value}</dd>
                <dd className="order-3 font-sans text-xs text-[#1a1a1a]/55">{s.note}</dd>
              </div>
            ))}
          </dl>
          <div className={`mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 ${prose}`}>
            <p>
              Bulgaria amended its Foreigners Act in 2021 (Article 24p) to create a route for non-EU entrepreneurs, and in October 2022 the Council of
              Ministers adopted the implementing Ordinance (Decree No. 318). The Ministry of Innovation and Growth (MIG) runs it.
            </p>
            <p>
              What MIG issues is a “certificate for a high-tech and/or innovative project”, known as the Startup Visa. The ministry says plainly that it
              is not enough to relocate: it is only one condition for a long-term residence permit. The full route involves three bodies: MIG for the
              certificate, an embassy for the D visa, and the migration authority for the residence permit.
            </p>
            <p>
              Two things set it apart from its neighbours. The assessment is points-based and transparent, with its criteria published in the
              Ordinance. And the entry is cheap: low proof of funds, no minimum investment, and no government fee for the certificate.
            </p>
          </div>
          <p className="mt-6 max-w-[68ch] rounded-xl bg-[#DCF1E9] px-4 py-3 font-sans text-sm leading-relaxed">
            Bulgaria has been a full Schengen member since January 2025 and in the euro area since January 2026. The Ordinance was written before the
            euro and states every figure in leva; this page converts them at the fixed rate of 1.95583.
          </p>
        </RouteStop>

        {/* 02 — The points */}
        <RouteStop
          id="points"
          number={2}
          eyebrow="Article 7 · six criteria"
          question="How is the Bulgaria startup visa scored?"
          task="Score all six criteria"
          answer={
            <p>
              An expert council scores six criteria for 14 points, and you need 8 to pass: personal funds (up to 3), a three-year financial forecast (up
              to 3), real sales (1), a venture fund investment (1), a patent or utility model (1), and the business plan and presentation (up to 5).
              Funds, forecast and plan alone total 11.
            </p>
          }
        >
          <PointsCounter stopId="points" criteria={criteria} pass={8} total={14} />

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
                <caption className="pb-2 text-left font-bold">The six criteria of Article 7 and their maximum points</caption>
                <thead>
                  <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                    <th scope="col" className="px-4 py-3">Criterion</th>
                    <th scope="col" className="px-4 py-3">Max points</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {criteria.map((c) => (
                    <tr key={c.title} className="border-b border-[#1a1a1a]/10">
                      <th scope="row" className="px-4 py-3 text-left font-normal">{c.title}</th>
                      <td className="px-4 py-3 font-bold tabular-nums text-[#A51E10]">{c.max}</td>
                      <td className="px-4 py-3 text-xs text-[#1a1a1a]/60">{c.mandatory ? 'Mandatory attachment' : c.max === 1 ? 'Optional' : 'Assessed on every file'}</td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" className="px-4 py-3 text-left font-bold">Total, and pass mark</th>
                    <td className="px-4 py-3 font-bold tabular-nums text-[#A51E10]">14</td>
                    <td className="px-4 py-3 text-xs text-[#1a1a1a]/60">At least 8 to pass</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={prose}>
              <h3 className="mb-2 font-serif text-2xl text-[#1a1a1a]">The simple arithmetic</h3>
              <p>
                Funds, the financial model and the business plan add up to 11 points and are entirely in your hands. The three middle criteria (sales,
                an investor, a patent) are worth one point each. So a file with no sales, no investor and no patent has to take at least 8 of those 11.
                There is very little room for error in the business plan and the financial model.
              </p>
              <p className="mt-3">
                Two lines in circulating decks are not conditions. “Hire up to ten people in the first year” is one sub-question of the business-plan
                criterion, and “two key members” is Article 10’s limit on who the certificate can name. And intellectual property counts once, not twice.
              </p>
            </div>
          </div>
        </RouteStop>

        {/* 03 — Money */}
        <RouteStop
          id="money"
          number={3}
          eyebrow="€1,860, not €51,000"
          question="How much money do you need for the Bulgaria startup visa?"
          task="Read the money table"
          completeOn="view"
          message="Money mapped"
          answer={
            <p>
              The only required amount is three times Bulgaria’s monthly minimum wage, held in your personal account for 30 consecutive days before you
              apply: 3 × €620.20 = €1,860.60 in 2026, a little over US$2,000. There is no minimum investment. The €51,129 figure is optional, worth one
              point, and the certificate itself is free.
            </p>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
              <caption className="pb-2 text-left font-bold">What the Bulgarian startup visa certificate requires and costs, 2026</caption>
              <thead>
                <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                  <th scope="col" className="px-4 py-3">Item</th>
                  <th scope="col" className="px-4 py-3">Amount</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Note</th>
                </tr>
              </thead>
              <tbody>
                {costs.map((c) => (
                  <tr key={c.item} className="border-b border-[#1a1a1a]/10 last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-normal">{c.item}</th>
                    <td className="px-4 py-3 font-bold tabular-nums text-[#A51E10]">{c.amount}</td>
                    <td className="px-4 py-3">{c.status}</td>
                    <td className="px-4 py-3 text-xs text-[#1a1a1a]/60">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid max-w-5xl grid-cols-1 gap-4 font-sans text-sm leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            <p>
              <strong className="text-[#1a1a1a]">The €51,000 myth.</strong> A widely shared financial infographic puts “at least €51,130 of investment
              or prior sales” at the top of the money requirements. In the Ordinance both items carry “where applicable” and are worth one point each out
              of 14. Not having them does not get a file refused.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">Thirty consecutive days.</strong> Money deposited a few days before filing is not enough. Keep the
              balance steady from at least five or six weeks before you file. And this amount is only for the certificate: the embassy separately asks
              for proof of means to live in Bulgaria for the D visa.
            </p>
          </div>
        </RouteStop>

        {/* 04 — Documents */}
        <RouteStop
          id="documents"
          number={4}
          tone="white"
          eyebrow="Three mandatory, the rest optional"
          question="What documents do you need for the Bulgaria startup visa?"
          task="Check all five"
          answer={
            <p>
              MIG’s technical guidelines list thirteen attachments, and three are mandatory: a copy of your passport, the business plan and project
              presentation, and bank proof of funds held for 30 consecutive days. The whole application is signed with a qualified electronic
              signature, and English attachments need a certified Bulgarian translation. The optional documents still strengthen the business plan.
            </p>
          }
        >
          <GateQuiz
            stopId="documents"
            criteria={readiness}
            strongNote="Attach every optional document you have as well: the council uses them to judge how realistic the plan is and how strong the team is."
            gapNote="Sort the electronic signature first; it takes the longest to arrange from outside Europe."
          >
            <h3 className="font-serif text-xl">The optional attachments</h3>
            <ul className="grid gap-1.5 font-sans text-sm text-[#1a1a1a]/65">
              {optionalDocs.map((d) => (
                <li key={d} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00966E]" />
                  {d}
                </li>
              ))}
            </ul>
          </GateQuiz>
          <p className="mt-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            <strong className="text-[#1a1a1a]">Optional is not useless.</strong> The optional documents that earn no direct points (articles, awards,
            a Seal of Excellence, a Bulgarian partner, your degree) are what the expert council uses to judge how realistic the business plan is and how
            capable the team is, and that is the 5-point criterion. Attach whatever you have.
          </p>
        </RouteStop>

        {/* 05 — Steps */}
        <RouteStop
          id="steps"
          number={5}
          eyebrow="The process"
          question="How do you apply for the Bulgaria startup visa?"
          task="Walk to step 7"
          answer={
            <p>
              Prepare the plan, forecast, funds proof, translations and a qualified e-signature. File in NIMS (enims.egov.bg) with a 12-month period and
              a 0.00 budget, signed with a detached .p7s file. The council decides within 30 days. Then get a D visa, enter Bulgaria, take at least 50%
              of a company and apply for residence.
            </p>
          }
        >
          <StepTrail stopId="steps" steps={steps} />
          <div className="mt-6 max-w-[68ch] rounded-xl border-l-4 border-[#A51E10] bg-white px-4 py-3 font-sans text-sm leading-relaxed text-[#1a1a1a]/75">
            <strong className="text-[#1a1a1a]">Company after the visa, not before.</strong> A widely shared road map puts “register a Bulgarian company”
            as step two, before the D visa. Article 24p says the opposite: the residence permit goes to someone who became a partner or shareholder
            after the D visa was issued. If you have already registered a company before the visa, check with a Bulgarian lawyer before your next step
            that this order will not cause problems with the migration authority.
          </div>
        </RouteStop>

        {/* Photo band */}
        <figure className="relative flex min-h-[360px] items-end overflow-hidden bg-[#0B2A21] text-white">
          <ParallaxLayer>
            <Image
              src="/fa/img/bulgaria-3.webp"
              alt="Vitosha Boulevard in Sofia on an overcast day: people walking on patterned brick paving, black street lamps, bare trees, colourful apartment blocks and a church dome at the end of the street"
              fill
              sizes="100vw"
              className="object-cover object-[center_45%]"
            />
          </ParallaxLayer>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B2A21]/20 to-[#0B2A21]/90" />
          <figcaption className="container relative mx-auto flex flex-wrap items-end justify-between gap-5 px-6 py-10">
            <div>
              <p className={`text-[#2FC594] ${label}`}>Step 4 · The expert council</p>
              <p className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
                Decided in Sofia.<br />
                <span className="italic text-[#2FC594]">Filed from anywhere.</span>
              </p>
              <p className="mt-2 max-w-[46ch] font-sans text-sm text-white/70">
                Sofia is home to the Ministry of Innovation and Growth and most of Bulgaria’s startup ecosystem. The application itself is entirely
                online.
              </p>
            </div>
            <span className="font-sans text-xs text-white/55">Vitosha Boulevard, Sofia</span>
          </figcaption>
        </figure>

        {/* 06 — After the certificate */}
        <RouteStop
          id="after"
          number={6}
          tone="white"
          eyebrow="Renewal and permanent residence"
          question="What happens after the certificate: renewal and permanent residence?"
          task="Read the timeline"
          completeOn="view"
          message="Timeline read"
          answer={
            <p>
              The certificate lasts one year. In its last month you file a progress report with proof you hold at least 50% of a Bulgarian company, and
              it is extended by two years, free. Report any change within 7 days. Permanent residence follows five years of lawful, continuous
              residence with no more than 30 months away.
            </p>
          }
        >
          <ol className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {[
              { when: 'Year 0', t: 'Certificate, one year', b: 'D visa, arrival, company and a real start, all inside the first year.' },
              { when: 'Within 7 days', t: 'Report every change', b: 'Any change to the company, team or project, reported electronically to MIG. Not reporting is itself grounds for revocation.' },
              { when: 'End of year 1', t: 'Extension, two years', b: 'A progress report in the last month, with proof of at least 50% of a Bulgarian company. The council answers within a month.' },
              { when: 'Year 5', t: 'Permanent residence', b: 'After five years of lawful, continuous residence, with no more than 30 months outside Bulgaria (Article 25).' },
            ].map((x) => (
              <li key={x.t} className="rounded-2xl border border-[#1a1a1a]/10 bg-[#F2F0E9] p-5">
                <span className="font-sans text-xs font-bold tabular-nums text-[#00704F]">{x.when}</span>
                <h3 className="mt-1 font-serif text-xl">{x.t}</h3>
                <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#1a1a1a]/65">{x.b}</p>
              </li>
            ))}
          </ol>
          <div className={`mt-6 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 ${prose}`}>
            <p>
              <strong className="text-[#1a1a1a]">The 50% line.</strong> A stake below 50%, or an activity other than the one in the certificate, removes
              the Article 24p condition. If you plan to raise money, build that dilution ceiling into your plans from day one.
            </p>
            <p className="rounded-xl bg-[#DCF1E9] px-4 py-3 text-[#1a1a1a]/80">
              The 50% rule looks minor until an investor wants to buy 55%. Your residence is tied to majority ownership, which limits this route for a
              startup with a heavy funding round ahead.
            </p>
          </div>
        </RouteStop>

        {/* 07 — Company and tax */}
        <RouteStop
          id="company"
          number={7}
          eyebrow="Company and tax, without hype"
          question="What company do you set up in Bulgaria, and what tax does it pay?"
          task="Read the basics"
          completeOn="view"
          message="Company basics read"
          answer={
            <p>
              The usual vehicle is a limited liability company: an EOOD for a single owner or an OOD for several partners, with a token legal minimum
              capital that is no obstacle. Corporate income tax in Bulgaria is 10%, among the lowest in the EU, and dividend tax is 5%, for every
              Bulgarian company, not only startup visa holders.
            </p>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] max-w-3xl overflow-hidden rounded-2xl bg-white font-sans text-sm">
              <caption className="pb-2 text-left font-bold">Company form and headline tax rates in Bulgaria</caption>
              <thead>
                <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                  <th scope="col" className="px-4 py-3">Item</th>
                  <th scope="col" className="px-4 py-3">Figure</th>
                  <th scope="col" className="px-4 py-3">Note</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Company form, one owner', 'EOOD', 'Limited liability company with a sole owner'],
                  ['Company form, several partners', 'OOD', 'Limited liability company'],
                  ['Legal minimum capital', 'Token', 'No real obstacle'],
                  ['Corporate income tax', '10%', 'Among the lowest in the EU; applies to every Bulgarian company'],
                  ['Dividend tax', '5%', 'Applies to every Bulgarian company'],
                ].map(([i, f, n]) => (
                  <tr key={i} className="border-b border-[#1a1a1a]/10 last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-normal">{i}</th>
                    <td className="px-4 py-3 font-bold tabular-nums text-[#A51E10]">{f}</td>
                    <td className="px-4 py-3 text-xs text-[#1a1a1a]/60">{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            <strong className="text-[#1a1a1a]">Low corporate tax is not the whole bill.</strong> It does not remove personal income tax, social
            security or monthly bookkeeping. Talk to a Bulgarian accountant about the structure and running costs before you register the company.
          </p>
        </RouteStop>

        {/* Photo band */}
        <figure className="relative flex min-h-[360px] items-end overflow-hidden bg-[#0B2A21] text-white">
          <ParallaxLayer>
            <Image
              src="/fa/img/bulgaria-2.webp"
              alt="A steep cobbled lane in Plovdiv's old town: a two-storey red house with white decoration under its windows, a yellow house beside it, stone walls, green trees and a black-and-white cat sitting by the wall"
              fill
              sizes="100vw"
              className="object-cover object-[center_55%]"
            />
          </ParallaxLayer>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B2A21]/20 to-[#0B2A21]/90" />
          <figcaption className="container relative mx-auto flex flex-wrap items-end justify-between gap-5 px-6 py-10">
            <div>
              <p className={`text-[#2FC594] ${label}`}>Step 6 · The company</p>
              <p className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
                Name the place in the plan.<br />
                <span className="italic text-[#2FC594]">Keep the field the same.</span>
              </p>
              <p className="mt-2 max-w-[48ch] font-sans text-sm text-white/70">
                Plovdiv, Bulgaria’s second city. State where you will operate in the business plan; the company must work in the field the certificate
                was issued for.
              </p>
            </div>
            <span className="font-sans text-xs text-white/55">Old town, Plovdiv</span>
          </figcaption>
        </figure>

        {/* 08 — Catches */}
        <RouteStop
          id="catches"
          number={8}
          tone="white"
          eyebrow="Perk or catch?"
          question="What are the catches of the Bulgaria startup visa?"
          task="Guess all eight"
          answer={
            <p>
              The perks are real: a free certificate, a 30-day decision, published scoring and no minimum investment. The catches are practical: a
              qualified electronic signature, certified Bulgarian translations, a one-year certificate that leaves little time, residence tied to holding
              at least 50% of the company, scattered official information on the D visa, and a small home market.
            </p>
          }
        >
          <PerkOrCatch stopId="catches" items={perksAndCatches} />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className={prose}>
              <h3 className="mb-3 font-serif text-2xl text-[#1a1a1a]">What the sales pitch leaves out</h3>
              <ul className="grid gap-3">
                <li>
                  <strong className="text-[#1a1a1a]">The qualified electronic signature.</strong> Without it the application cannot be filed, and only
                  authorised European providers issue it, after identity checks. Solve it before anything else.
                </li>
                <li>
                  <strong className="text-[#1a1a1a]">Certified Bulgarian translations.</strong> The Ordinance asks for a legalised translation of English
                  attachments. Put the cost and the time in your plan.
                </li>
                <li>
                  <strong className="text-[#1a1a1a]">A short first year.</strong> Visa, entry, company registration and the start of operations all have
                  to happen inside the one-year certificate, so the progress report has something to say.
                </li>
                <li>
                  <strong className="text-[#1a1a1a]">Scattered official information.</strong> Official information on the D visa and residence card for
                  this route is more scattered than for the certificate. Get the lists from the embassy and the migration authority directly, not from
                  presentations and videos.
                </li>
                <li>
                  <strong className="text-[#1a1a1a]">A small home market.</strong> Bulgaria has about six and a half million people; the export-potential
                  question in the business plan is not a formality.
                </li>
              </ul>
            </div>
            <aside aria-labelledby="sanctions-h" className="self-start rounded-2xl border-l-4 border-[#A51E10] bg-[#F2F0E9] p-6">
              <p className={`text-[#A51E10] ${label}`}>Note for applicants from sanctioned countries</p>
              <h3 id="sanctions-h" className="mt-2 font-serif text-2xl">If you hold an Iranian or other sanctioned-country passport</h3>
              <ul className="mt-3 grid gap-2.5 font-sans text-sm leading-relaxed text-[#1a1a1a]/75">
                <li>The funds evidence must come from a bank the expert council can read and trust. A balance in an Iranian bank account is of little practical use; set up an account outside Iran at least six weeks before filing.</li>
                <li>Getting a qualified electronic signature on an Iranian passport may run into the provider’s identity-verification limits. Ask the provider about Iranian nationality before you pay.</li>
                <li>Opening the company’s bank account in Bulgaria with an Iranian shareholder is slow and paperwork-heavy because of anti-money-laundering and sanctions rules. Plan the first months on that assumption.</li>
                <li>Iranian criminal record certificates and identity documents for the D visa need certification by the Ministry of Foreign Affairs and the embassy (Iran is not a party to the Apostille Convention), plus certified translation. Start that chain early.</li>
                <li>Do not define the plan’s market as Iran or the Iranian diaspora. The export and scalability questions measure the European and global market.</li>
              </ul>
            </aside>
          </div>
        </RouteStop>

        {/* 09 — Compare */}
        <RouteStop
          id="compare"
          number={9}
          eyebrow="Bulgaria against the rest of Europe"
          question="How does the Bulgaria startup visa compare with other European startup visas?"
          task="Read the comparison"
          completeOn="view"
          message="Comparison read"
          answer={
            <p>
              Bulgaria has the most transparent points scoring, very low proof of funds, a free 30-day certificate and 10% corporate tax, but a one-year
              certificate, the 50% rule, a qualified e-signature and Bulgarian translations. Spain gives three years at once, Italy asks €50,000, Estonia
              needs an MVP, and Denmark has a quota.
            </p>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
              <caption className="pb-2 text-left font-bold">Bulgaria compared with four other European startup routes</caption>
              <thead>
                <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                  <th scope="col" className="px-4 py-3">Country</th>
                  <th scope="col" className="px-4 py-3">In its favour</th>
                  <th scope="col" className="px-4 py-3">The trade-off</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((c) => (
                  <tr key={c.country} className={`border-b border-[#1a1a1a]/10 last:border-0 ${c.country === 'Bulgaria' ? 'bg-[#DCF1E9]' : ''}`}>
                    <th scope="row" className="px-4 py-3 text-left font-bold">{c.country}</th>
                    <td className="px-4 py-3">{c.plus}</td>
                    <td className="px-4 py-3 text-[#1a1a1a]/70">{c.minus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            <strong className="text-[#1a1a1a]">A simple rule.</strong> If you have little capital, a genuinely innovative project and are ready to keep a
            majority of the company yourself, Bulgaria is the cheapest way into the European Union. If a heavy funding round is coming in the next year
            or two, take the 50% rule seriously.
          </p>
        </RouteStop>

        {/* 10 — Our role */}
        <RouteStop
          id="help"
          number={10}
          tone="white"
          eyebrow="What we do, and what we promise"
          question="What does VisaRoads do on a Bulgaria startup visa file?"
          task="Read how we work"
          completeOn="view"
          message="Terms read"
          answer={
            <p>
              We are not Bulgarian immigration lawyers and we do not file the D visa or residence application for you. Our work comes before that:
              getting your project to the Ministry of Innovation and Growth’s certificate. Fees are paid in three instalments tied to real events, and the
              refund undertaking covers the certificate only.
            </p>
          }
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 font-serif text-2xl">What we do</h3>
              <ul className="grid gap-2 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
                {[
                  'An honest self-assessment against the same 14-point table, and telling you before you spend money if you will not reach 8.',
                  'The business plan and presentation, built on the five questions of the sixth criterion: realism, market entry within six months, scalability, team, export.',
                  'The monthly three-year financial forecast, in the form the Ordinance asks for.',
                  'Completing the NIMS form and organising the attachments, and guidance on getting the electronic signature and the translations.',
                  'Support at the next stage (D visa, company registration, the progress report for the extension) alongside a Bulgarian lawyer and accountant.',
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00966E]" />
                    {t}
                  </li>
                ))}
              </ul>
              <h3 className="mb-3 mt-8 font-serif text-2xl">Phases, instalments and term</h3>
              <ol className="grid gap-2 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
                <li><strong className="text-[#1a1a1a]">Phase 1.</strong> Contract, self-assessment against the points table, market research, and the business plan and financial model. First instalment on signing.</li>
                <li><strong className="text-[#1a1a1a]">Phase 2.</strong> Filing in NIMS, through to the Startup Visa certificate. Second instalment when the certificate is issued.</li>
                <li><strong className="text-[#1a1a1a]">Phase 3.</strong> Support preparing the D visa documents.</li>
                <li><strong className="text-[#1a1a1a]">Phase 4.</strong> Residence issued. Third instalment when residence is issued.</li>
                <li>The contract runs twelve months from signing and payment of the first instalment. Each instalment is tied to a real event in the file, not to the passing of time.</li>
              </ol>
            </div>
            <div>
              <h3 className="mb-3 font-serif text-2xl">The refund undertaking: exactly where it applies</h3>
              <p className={prose}>
                What we undertake is to obtain the Startup Visa certificate from Bulgaria’s Ministry of Innovation and Growth for your project, and only
                that. If we do not obtain it within twelve months of the first instalment, 100% of what you paid is refunded at the day’s euro rate. That
                includes the case where the expert council does not award enough points because the business plan or financial model was weak: that is
                our work, and our responsibility.
              </p>
              <ul className="mt-4 grid gap-2 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
                <li><strong className="text-[#1a1a1a]">No refund</strong> if the embassy or the migration authority refuses the visa or residence. That decision belongs to another body and is outside our undertaking.</li>
                <li><strong className="text-[#1a1a1a]">No refund</strong> if the refusal comes from your own personal or identity issues: problems with your passport or translations, forged documents, a criminal record, inability to obtain the electronic signature, or not having, and being unable to provide, the 30-day funds evidence.</li>
                <li><strong className="text-[#1a1a1a]">No refund</strong> if you do not pay government, translation and signature costs on time or do not provide personal documents, and the delay exceeds two months; the contract is then terminated unilaterally in VisaRoads’ favour.</li>
                <li>If you withdraw at any stage, the remaining instalments must be settled within seven working days.</li>
              </ul>
              <p className="mt-4 rounded-xl bg-[#DCF1E9] px-4 py-3 font-sans text-sm leading-relaxed text-[#1a1a1a]/80">
                Do not confuse this refund undertaking with a “residence guarantee”. Nobody outside Bulgaria’s ministry, embassy and migration authority
                can guarantee their decision, and if anyone sells you a residence guarantee, walk away.
              </p>
            </div>
          </div>
        </RouteStop>

        {/* 11 — FAQ */}
        <RouteStop
          id="faq"
          number={11}
          eyebrow="Questions founders ask"
          question="Bulgaria startup visa: frequently asked questions"
          task="Open three answers"
          answer={
            <p>
              Twenty-two answers: what the certificate is and is not, the money, the timing and the scoring, then the detail that decides a file, from
              the monthly forecast and the qualified signature to the expert council, the extension, revocation and refusals.
            </p>
          }
        >
          <div className="grid max-w-4xl gap-12">
            {[
              { heading: 'The most common questions', items: commonFaqs },
              { heading: 'Points, documents, signature and extension, in detail', items: deepFaqs },
            ].map((g) => (
              <div key={g.heading}>
                <h3 className={`mb-2 text-[#00704F] ${label}`}>{g.heading}</h3>
                <div className="border-t border-[#1a1a1a]/10">
                  {g.items.map((f) => (
                    <details key={f.q} className="group border-b border-[#1a1a1a]/10" data-faq>
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 transition-colors hover:text-[#00704F] group-open:text-[#00704F] [&::-webkit-details-marker]:hidden">
                        <h4 className="font-serif text-xl leading-snug">{f.q}</h4>
                        <span aria-hidden="true" className="font-serif text-2xl transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="max-w-[72ch] pb-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/65">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <OpenedTracker stopId="faq" need={3} message="Questions answered" />
        </RouteStop>

        {/* Sources */}
        <section aria-labelledby="sources-h" className="border-b border-[#1a1a1a]/10 bg-white px-6 py-14">
          <div className="container mx-auto">
            <p className={`text-[#00704F] ${label}`}>Where these figures come from</p>
            <h2 id="sources-h" className="mt-2 font-serif text-3xl">Sources</h2>
            <ol className="mt-6 grid max-w-4xl list-decimal gap-2 pl-5 font-sans text-sm">
              {SOURCES.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="break-words font-bold underline decoration-[#00966E] underline-offset-2 hover:text-[#00704F]">
                    {s.name}
                  </a>{' '}
                  <span className="text-[#1a1a1a]/60">{s.what} Checked {UPDATED.label}.</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Book a session */}
        <section id="book" aria-labelledby="book-h" className="scroll-mt-32 bg-[#0B2A21] px-6 py-16 text-white">
          <div className="container mx-auto grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <div>
              <RouteFinish />
              <p className={`text-[#2FC594] ${label}`}>Talk it through</p>
              <h2 id="book-h" className="mt-2 font-serif text-4xl leading-tight">
                Bring your project to a <span className="italic text-[#2FC594]">free session.</span>
              </h2>
              <p className="mt-3 max-w-[52ch] font-sans text-white/70">
                Pick a time, come prepared, and get an honest read on your project against the 14 points, your numbers and whether Bulgaria is the
                right route. If it isn&apos;t, we&apos;ll say so.
              </p>
              <ul className="my-5 flex flex-wrap gap-2 font-sans text-xs">
                {['Free · 60 minutes', 'Online, Google Meet', 'Link sent after booking'].map((p) => (
                  <li key={p} className="rounded-full border border-white/25 px-3 py-1.5">{p}</li>
                ))}
              </ul>
              <Link href="/book-meeting" className="inline-flex items-center gap-2 rounded-full bg-[#00966E] px-6 py-3.5 font-sans text-sm font-bold text-[#00140E] transition-transform hover:-translate-y-0.5">
                Book a free session <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <address className="grid gap-2.5 not-italic">
              <p className={`text-white/60 ${label}`}>Or reach us directly</p>
              {[
                { k: 'Phone & WhatsApp', v: MAIN_CONTACT.phone, copy: MAIN_CONTACT.phoneE164, links: [{ label: 'Call', href: MAIN_CONTACT.tel }, { label: 'WhatsApp', href: MAIN_CONTACT.whatsapp }] },
                { k: 'Email', v: MAIN_CONTACT.email, copy: MAIN_CONTACT.email, links: [{ label: 'Email', href: `mailto:${MAIN_CONTACT.email}` }] },
                { k: 'Telegram', v: MAIN_CONTACT.telegramHandle, copy: null, links: [{ label: 'Open', href: MAIN_CONTACT.telegram }] },
              ].map((c) => (
                <div key={c.k} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5 rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-white/55">{c.k}</span>
                  <span className="col-start-2 row-span-2 row-start-1 flex flex-wrap justify-end gap-1.5">
                    {c.copy && <CopyButton value={c.copy} />}
                    {c.links.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="rounded-full border border-white/30 px-3 py-1.5 font-sans text-xs transition-colors hover:bg-white/10"
                      >
                        {l.label}
                      </a>
                    ))}
                  </span>
                  <span className="select-all break-all font-sans text-lg tabular-nums">{c.v}</span>
                </div>
              ))}
            </address>
          </div>
        </section>

        {/* Related guides */}
        <section aria-labelledby="reads-h" className="bg-[#F2F0E9] px-6 py-16">
          <div className="container mx-auto">
            <div className="mb-6">
              <p className={`text-[#00704F] ${label}`}>Keep reading</p>
              <h2 id="reads-h" className="mt-2 font-serif text-3xl md:text-4xl">More European startup visa guides</h2>
              <p className="mt-2 max-w-[60ch] font-sans text-sm text-[#1a1a1a]/60">
                We have no English Bulgaria articles yet. These are the routes this page compares Bulgaria with.
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.href} className="group rounded-2xl border border-[#1a1a1a]/10 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0B2A21]/10">
                  <Link href={r.href} className="grid gap-3 p-5">
                    <Flag code={r.flag} uid={`read-${r.flag}`} width={40} />
                    <h3 className="font-serif text-xl leading-snug">{r.title}</h3>
                    <span className="font-sans text-sm text-[#1a1a1a]/65">{r.blurb}</span>
                    <span className="inline-flex items-center gap-1.5 font-sans text-sm font-bold text-[#00704F]">
                      Read the guide <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </RouteProvider>

      {/* Notice */}
      <section className="border-t border-[#1a1a1a]/10 bg-[#F9F9F9] px-6 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#1a1a1a]/30" />
            <p className="font-sans text-[11px] leading-relaxed text-[#1a1a1a]/55">
              <strong>Regulatory Notice:</strong> Figures on this page were checked on 29 October 2026 against the Ordinance on the Startup Visa
              certificate, the Foreigners in the Republic of Bulgaria Act, the Ministry of Innovation and Growth’s published guidance and the 2026
              minimum wage. They are provided for informational purposes only. VisaRoads Inc., an Ashavid company, is a strategic business advisory firm;
              we are <span className="underline">NOT</span> an immigration law firm. A Startup Visa certificate does not guarantee a D visa or a residence
              permit. The minimum wage, and with it the proof of funds, changes each January; always verify current requirements with the Ministry of
              Innovation and Growth at{' '}
              <a href="https://www.mig.government.bg/?lang=en" target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-[#00704F]">
                mig.government.bg
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
