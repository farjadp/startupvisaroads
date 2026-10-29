// ============================================================================
// Page: app/[locale]/(public)/europe/netherlands/page.tsx
// Serves both locales. /fa renders the Persian-first page from
// content/fa/europe-netherlands.ts through FaPageLayout, unchanged. /en is a
// guided route in the shape of /country/finland: a compact hero, a sticky
// rail whose Dutch flag rises as the reader completes each stop, and one stop
// per question people actually search. Every stop opens with its question as
// the H2 and a ~50-word direct answer built only from facts already on this
// page, then the detail: real tables, lists and a small game. All copy is
// rendered on the server, so crawlers and AI engines read the whole page.
//
// Rebuilt 2026-10-29 from the previous "Dutch Modernism" editorial page
// (orange, ink and paper). Every fact, figure, caveat and the 20 facts were
// kept; the 20 facts are now phrased as the questions founders ask, with the
// original fact title kept above each verbatim answer.
//
// Figures, reconciled 2026-10-29 with content/fa/europe-netherlands.ts
// (verified against ind.nl on 2026-09-08):
//   - IND fee €423 (2026), re-checked 2026-10-29 on ind.nl/en/fees-costs-of-an-
//     application: "Start-up: first application €423" and "change in purpose
//     of stay: self-employed after start up €423".
//   - Means of support about €21,200 single / €29,700 family for twelve
//     months. The single figure re-checked 2026-10-29: ind.nl/en/required-
//     amounts-income-requirements gives €1,766.77 a month with holiday
//     allowance (valid 1 Jul to 31 Dec 2026), × 12 ≈ €21,200. The family
//     figure is the Persian module's (8 Sep 2026); that IND page shows no
//     separate family amount, so it was not re-confirmed. The amounts follow
//     the statutory minimum wage and change on 1 January and 1 July.
//   - The startup permit is not extended. After a year you file a new
//     self-employed application, scored on RVO's points system; a facilitator
//     statement can simplify the transition (english.rvo.nl, business.gov.nl,
//     both checked 2026-10-29).
//   - "The facilitator submits your application" was wrong: you or your
//     authorised representative apply to the IND, and RVO assesses the plan
//     and advises the IND (business.gov.nl, published by IND and RVO).
//   - 185-day limit on a non-EU driving licence: confirmed on rdw.nl, which
//     counts it from relocation and says some licences can be exchanged.
//   - Not verified on an official site: the ban on Dutch social welfare in
//     year one, and the €500–€1,000 a month facilitator range (business.gov.nl
//     only says facilitators are private and their costs vary). The range is
//     shown as a private market range, never as a VisaRoads price.
// The 20 facts keep their original wording except the sentences corrected
// above; the original titles of facts 7 and 11 were changed because they
// stated the corrected claims.
//
// Photos: both Unsplash images from the previous page are genuine Amsterdam
// canal scenes and return 200 (checked 2026-10-29).
// ============================================================================

import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from '@/routing';
import { metaFor } from '@/lib/pageMeta';
import { buildMetadata, faqJsonLd } from '@/lib/seo';
import { setRequestLocale } from 'next-intl/server';
import FaPageLayout from '@/components/fa/FaPageLayout';
import { page as faPage } from '@/content/fa/europe-netherlands';
import { faMeta } from '@/lib/fa/content';
import JsonLd from '@/components/JsonLd';
import { MAIN_CONTACT } from '@/content/contact';
import Flag from '@/components/route/flags';
import { RouteProvider, RouteRail, RouteStop, RouteFinish, type RouteStopDef, type RouteTheme } from '@/components/route/RouteProgress';
import { CopyButton, OpenedTracker, ParallaxLayer } from '@/components/route/RouteWidgets';
import { PerkOrCatchNL, RulesQuiz, SeenTracker, StepTrail, TimelineSlider, type Milestone, type TrailStep } from './NetherlandsWidgets';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'fa') return buildMetadata(faMeta(faPage, locale));
  return metaFor('/europe/netherlands', locale);
}

// ─── Data ────────────────────────────────────────────────────────────────────

// The date the page's figures were last checked against official sources.
const UPDATED = { iso: '2026-10-29', label: '29 Oct 2026' };

// The previous page's own palette: Dutch orange on ink and paper, with the
// flag's blue for figures. Contrast (WCAG 2.x): accentInk #1a1a1a on #F97316
// 6.21:1; accentText #B4400A on #F2F0E9 5.01:1, on white 5.71:1, on the soft
// tint #FDEBDC 4.92:1; primary #21468B on white 9.08:1, on #F2F0E9 7.96:1.
const THEME: RouteTheme = { accent: '#F97316', accentInk: '#1a1a1a', accentText: '#B4400A', primary: '#21468B', deep: '#1a1a1a', soft: '#FDEBDC' };

const STOPS: RouteStopDef[] = [
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'rules', label: '5 rules' },
  { id: 'facilitator', label: 'Facilitator' },
  { id: 'steps', label: '4 steps' },
  { id: 'money', label: 'Money' },
  { id: 'life', label: 'Life' },
  { id: 'after', label: 'After year 1' },
  { id: 'faq', label: '20 facts' },
];

// The 5 Non-Negotiable Rules, verbatim.
const rules = [
  { title: 'The Facilitator Contract', body: 'An official agreement with an approved incubator is mandatory.' },
  { title: 'True Innovation', body: 'No standard cafes or grocery stores. Must be new to the Dutch market (e.g. AI, Green-Tech).' },
  { title: 'Flawless Business Plan', body: 'Clear problem, solution, and team. The Dutch invest in capable people.' },
  { title: 'KvK Registration', body: 'Commitment to legally registering the company in the Netherlands.' },
  { title: 'Financial Solvency', body: 'Prove you have about €21,200 (single) or €29,700 (family) in a recognized bank to survive year one.' },
];

// The 3 Agency Lies, verbatim.
const lies = [
  { lie: 'Lie 1: "We\'ll write the idea for you."', truth: 'This is Visa Fraud. You will face deep technical interviews with facilitators. If you didn\'t write it, you will freeze and face rejection.' },
  { lie: 'Lie 2: "No English required."', truth: 'IND doesn\'t need IELTS, but pitching to Dutch investors and clients requires fluent business English.' },
  { lie: 'Lie 3: "It costs €20,000+."', truth: 'The government fee is €423 (2026). Facilitators charge €500-€1000/mo (a private market range). Agencies asking for €20k+ are charging massive hidden fees.' },
];

// The first four milestones of the timeline: everything up to arrival.
const steps: TrailStep[] = [
  {
    title: 'The Blueprint',
    who: 'You',
    body: 'It starts with you. Develop an innovative idea, build an MVP, and write a bulletproof Pitch Deck before contacting anyone.',
    note: 'You will face deep technical interviews with facilitators. If you didn\'t write it, you will freeze and face rejection.',
    figure: 'Prep',
    figureLabel: 'before you contact anyone',
  },
  {
    title: 'The Matchmaking',
    who: 'Facilitator',
    body: 'Find approved Facilitators via the RVO. Pitch online, pass interviews, and sign the official mentorship agreement.',
    note: 'Expect to pay your facilitator between €500 and €1,000 monthly for desk space, mentoring, and administrative support. That is a private market range: facilitators are private organisations, so costs and conditions vary.',
    figure: '2–3',
    figureLabel: 'months, usually, to the facilitator agreement',
  },
  {
    title: 'Legal Green Light',
    who: 'IND and RVO',
    body: 'You or your authorised representative apply to the IND, which asks the RVO to assess your step-by-step plan. Pay the €423 fee, wait, and get your 1-year visa approved.',
    note: 'The official application fee charged by the IND is €423 in 2026, not the tens of thousands of euros that immigration agencies claim.',
    figure: '1–3',
    figureLabel: 'months more, IND and embassy',
  },
  {
    title: 'The Dutch Landing',
    who: 'Municipality and KvK',
    body: 'Arrive in NL, register at the municipality for your BSN, and officially register your startup at the Dutch Chamber of Commerce (KvK).',
    note: 'No BSN = you don\'t exist. You need a registered address to get it. A good facilitator lets you use their office temporarily.',
    figure: '3–6',
    figureLabel: 'months from a serious start to arrival',
  },
];

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to apply for the Netherlands startup visa',
  inLanguage: 'en',
  step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.body })),
};

// The full "Zero to Citizenship" timeline, verbatim.
const milestones: Milestone[] = [
  { when: 'Before you start', title: 'The Blueprint', body: steps[0].body },
  { when: '2–3 months', title: 'The Matchmaking', body: steps[1].body },
  { when: '+1–3 months', title: 'Legal Green Light', body: steps[2].body },
  { when: 'Month 3–6', title: 'The Dutch Landing', body: steps[3].body },
  { when: 'Year 2', title: 'The Trial Year', body: 'Build for 12 months. The startup permit is not extended: you file a new application for a Self-Employed Residence Permit (valid up to 2 years, and renewable), scored on RVO\'s points system. A declaration from your facilitator can simplify the transition.' },
  { when: 'Year 5+', title: 'The Endgame', body: 'Maintain the business, pay taxes, integrate. After 5 years of legal residence, apply for Permanent Residency or Citizenship.' },
];

const costs = [
  { item: 'IND application fee, start-up', amount: '€423', who: 'IND (government), 2026', note: 'The official application fee, not the tens of thousands of euros that immigration agencies claim. Revised each January.' },
  { item: 'IND fee, self-employed permit after the start-up year', amount: '€423', who: 'IND (government), 2026', note: 'A new application, not an extension.' },
  { item: 'Means of support, single', amount: '~€21,200 for 12 months', who: 'IND requirement', note: 'Follows the statutory minimum wage; changes on 1 January and 1 July.' },
  { item: 'Means of support, family', amount: '~€29,700 for 12 months', who: 'IND requirement', note: 'Follows the statutory minimum wage; changes on 1 January and 1 July.' },
  { item: 'Facilitator', amount: '€500–€1,000 a month', who: 'Private market range', note: 'Desk space, mentoring and administrative support. Facilitators are private organisations, so costs vary. Not a government fee, and not a VisaRoads price.' },
];

const rights = [
  { title: 'Spouse work rights', content: 'In most cases, accompanying spouses or partners get unrestricted working rights: their residence card states that work is allowed without a work permit (TWV). They can work full-time for any employer without needing a visa sponsor.', positive: true },
  { title: 'A side job for you', content: 'The main visa holder is only allowed to work on their startup. You cannot take a side job as a regular employee to make extra cash.', positive: false },
  { title: 'Social welfare', content: 'You must prove you can financially sustain yourself. You are strictly prohibited from claiming Dutch social welfare benefits during your first year.', positive: false },
  { title: 'Profit in year one', content: 'To secure your second-year visa, you don\'t need a million-euro profit, but you must show a working prototype (MVP), active networking, or initial clients.', positive: true },
  { title: 'Your first address', content: 'A high-quality facilitator will allow you to use their official office address as your temporary postal address so you can get your BSN immediately.', positive: true },
  { title: 'Health insurance', content: 'You must purchase Dutch basic health insurance shortly after arriving. It is a legal requirement, not an option.', positive: false },
  { title: 'Your driving licence', content: 'Your non-EU driver\'s license is only valid for your first 185 days after you relocate to the Netherlands. After that, you need a Dutch licence: in some cases you can exchange yours, otherwise you must pass the expensive Dutch driving exams.', positive: false },
  { title: 'Renting a flat', content: 'The Netherlands has a severe housing crisis. Never pay a deposit for an apartment you haven\'t physically visited and verified.', positive: false },
];

// The 20 Brutal Truths & Facts. `fact` and `a` are verbatim from the previous
// page; `q` phrases each one as the question founders search.
const facts = [
  { fact: 'Strictly a 1-Year Visa', q: 'Is the Dutch startup visa a multi-year permit?', a: 'The Dutch Startup Visa is not a permanent or multi-year permit. It is strictly a 12-month trial period to establish your business.' },
  { fact: 'The Facilitator is Mandatory', q: 'Can I apply for the Dutch startup visa on my own?', a: 'You cannot apply directly on your own. You must have a signed mentorship agreement with a government-approved Dutch facilitator (incubator).' },
  { fact: 'Innovation is Required', q: 'Does my business have to be innovative?', a: 'Your business cannot be a traditional shop or service. It must introduce new technology, a novel market approach, or an innovative social process.' },
  { fact: 'No State Funds Allowed', q: 'Can I claim Dutch social welfare during my first year?', a: 'You must prove you can financially sustain yourself. You are strictly prohibited from claiming Dutch social welfare benefits during your first year.' },
  { fact: 'Real IND Fees are Low', q: 'How much is the IND application fee?', a: 'The official application fee charged by the IND is €423 in 2026, not the tens of thousands of euros that immigration agencies claim.' },
  { fact: 'KvK Registration', q: 'Do I have to register my startup with the KvK?', a: 'You and your facilitator must commit to registering your startup with the Dutch Chamber of Commerce (KvK) as soon as you arrive.' },
  { fact: 'No Extension: Apply as Self-Employed', q: 'Does the startup visa renew after one year?', a: 'After one year, the visa does not auto-renew, and the IND does not extend it. You file a new application for a Self-Employed permit, scored on RVO\'s points system, and you must prove tangible progress.' },
  { fact: 'Profitability is Not Expected Immediately', q: 'Do I need to be profitable to get the second-year permit?', a: 'To secure your second-year visa, you don\'t need a million-euro profit, but you must show a working prototype (MVP), active networking, or initial clients.' },
  { fact: 'Heavy Solvency Requirements', q: 'How much money do I need to show?', a: 'You must show about €21,200 (single founder) or €29,700 (with family) in a recognized bank account to prove you can survive the first year. The amounts follow the Dutch statutory minimum wage and change on 1 January and 1 July.' },
  { fact: 'Sanctioned Bank Issues', q: 'Can I show funds held in a bank in a sanctioned country?', a: 'The IND frequently rejects financial statements from banks in sanctioned countries (like Iran). Funds usually need to be in a third-country account.' },
  { fact: 'Third-Party Funding', q: 'Can a facilitator or third party fund my stay?', a: 'Yes. The IND accepts a facilitator or third party covering your living costs, provided the amount is paid into your Dutch bank account and covers the whole period (up to one year).' },
  { fact: 'Monthly Facilitator Costs', q: 'How much does a facilitator cost?', a: 'Expect to pay your facilitator between €500 and €1,000 monthly for desk space, mentoring, and administrative support. That is a private market range, not a government fee: facilitators are private organisations, so costs vary.' },
  { fact: 'The BSN is Everything', q: 'What is a BSN and why do I need it?', a: 'You cannot open a bank account or get health insurance without a Citizen Service Number (BSN), which requires you to register a physical address.' },
  { fact: 'The Temporary Address Hack', q: 'How can I get a BSN before I find an apartment?', a: 'A high-quality facilitator will allow you to use their official office address as your temporary postal address so you can get your BSN immediately.' },
  { fact: 'Housing Scams are Rampant', q: 'How do I avoid housing scams in the Netherlands?', a: 'The Netherlands has a severe housing crisis. Never pay a deposit for an apartment you haven\'t physically visited and verified.' },
  { fact: 'Mandatory Health Insurance', q: 'Is Dutch health insurance mandatory?', a: 'You must purchase Dutch basic health insurance shortly after arriving. It is a legal requirement, not an option.' },
  { fact: 'The 6-Month Driving Limit', q: 'Can I drive in the Netherlands on my non-EU licence?', a: 'Your non-EU driver\'s license is only valid for your first 185 days after you relocate to the Netherlands. After that, you need a Dutch licence: in some cases you can exchange yours, otherwise you must pass the expensive Dutch driving exams.' },
  { fact: 'The Spouse Golden Ticket', q: 'Can my spouse work in the Netherlands?', a: 'In most cases, accompanying spouses or partners get unrestricted working rights: their residence card states that work is allowed without a work permit (TWV). They can work full-time for any employer without needing a visa sponsor.' },
  { fact: 'Main Applicant Employment Ban', q: 'Can I take a side job while on the startup visa?', a: 'The main visa holder is only allowed to work on their startup. You cannot take a side job as a regular employee to make extra cash.' },
  { fact: 'Fluent English is Unofficial but Vital', q: 'Do I need an IELTS score or fluent English?', a: 'While the IND does not ask for an IELTS score, you cannot pitch to facilitators, secure funding, or survive in the business ecosystem without fluent business English.' },
];

// Official sources for what this page states. The IND start-up, self-employed
// and required-amounts pages are the ones content/fa/europe-netherlands.ts was
// verified against (8 Sep 2026). Checked in a browser on 29 Oct 2026: the IND
// fee table and required amounts, the two RVO pages, business.gov.nl (published
// by IND and RVO) and RDW. The IND start-up page hides its requirements behind
// a nationality form, so its detail was not re-read on 29 Oct.
const sources = [
  { name: 'IND — Start-up', href: 'https://ind.nl/en/residence-permits/work/start-up', what: 'The 1-year permit and its requirements.', checked: '8 Sep 2026' },
  { name: 'IND — Fees: costs of an application', href: 'https://ind.nl/en/fees-costs-of-an-application', what: '€423 for the start-up permit and for the self-employed permit after it, 2026.', checked: '29 Oct 2026' },
  { name: 'IND — Required amounts income requirements', href: 'https://ind.nl/en/required-amounts-income-requirements', what: 'The means of support, tied to the statutory minimum wage.', checked: '29 Oct 2026' },
  { name: 'IND — Residence permit for a self-employed person', href: 'https://ind.nl/en/residence-permits/work/residence-permit-self-employed-person', what: 'The permit you apply for after the start-up year.', checked: '8 Sep 2026' },
  { name: 'IND — Permanent residence permit', href: 'https://ind.nl/en/replace-extend-renew-and-change/permanent-residency/permanent-residence-permit', what: 'Permanent residence after 5 years of legal residence.', checked: null },
  { name: 'RVO — Residence permit for foreign startups', href: 'https://english.rvo.nl/topics/residence-permit-foreign-startups', what: 'Who applies, and the facilitator statement for the self-employed permit.', checked: '29 Oct 2026' },
  { name: 'RVO — Requirements for a residence permit for foreign startups', href: 'https://english.rvo.nl/topics/residence-permit-foreign-startups/requirements', what: 'Facilitator, innovation, step-by-step plan, KVK registration, financial resources.', checked: '29 Oct 2026' },
  { name: 'Business.gov.nl (IND and RVO) — Residence permit for foreign startups', href: 'https://business.gov.nl/coming-to-the-netherlands/permits-and-visa/residence-permit-for-foreign-startups/', what: 'Who files the application, RVO\'s advice to the IND, and that facilitators are private and set their own fees.', checked: '29 Oct 2026' },
  { name: 'RDW — Driving with a foreign driving licence', href: 'https://www.rdw.nl/en/driving-licence/foreign-driving-licence/driving-with-a-foreign-driving-licence', what: 'The 185-day limit for licences issued outside the EU/EFTA.', checked: '29 Oct 2026' },
];

// Three guides, one per stage of the move, from visaroads.com/sitemap.xml.
// Each URL returned 200 on 2026-10-29; title, excerpt, date, reading time and
// cover are taken from the published article.
const reads = [
  {
    slug: 'how-facilitators-shape-success-with-the-netherlands-startup-visa',
    stage: 'Choosing a facilitator',
    title: 'How Facilitators Shape Success With the Netherlands Startup Visa',
    excerpt: 'Their role from application to business growth, recent recognition changes, and how to choose the right one.',
    date: { iso: '2026-10-09', label: '9 Oct 2026' },
    minutes: 12,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/10/603cff53640865ab9126d7eff025a2c9.jpg',
  },
  {
    slug: 'proof-of-funds-netherlands-startup-visa-requirements',
    stage: 'Proving your funds',
    title: 'Proof of Funds Requirements for the Netherlands Startup Visa',
    excerpt: 'Eligible sources, required documentation and common pitfalls for founders and families.',
    date: { iso: '2026-10-05', label: '5 Oct 2026' },
    minutes: 7,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/10/2e8df136acd8e06a0151ac6ba33b7834.jpg',
  },
  {
    slug: 'housing-cost-of-living-startup-founders-netherlands',
    stage: 'After you land',
    title: 'Housing and Cost of Living for Startup Founders in the Netherlands',
    excerpt: 'Securing housing, managing expenses and budgeting for the first year in the Netherlands.',
    date: { iso: '2026-09-15', label: '15 Sep 2026' },
    minutes: 7,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/09/3cd5a8629e3f23987ccda57f561acb45.jpg',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

const label = 'font-sans text-xs font-bold uppercase tracking-[0.18em]';

export default async function NetherlandsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // /fa/europe/netherlands is Persian-first copy, not a translation.
  if (locale === 'fa') {
    return <FaPageLayout page={faPage} trail={[{ name: 'هلند', path: faPage.path }]} />;
  }

  return (
    <div className="w-full overflow-x-clip bg-[#F2F0E9] text-[#1a1a1a]">
      <JsonLd data={[howToJsonLd, faqJsonLd(facts.map((f) => ({ question: f.q, answer: f.a })), 'en')]} />

      <RouteProvider stops={STOPS} flag="nl" theme={THEME}>
        {/* ── Hero: the answer up front ── */}
        <header className="relative overflow-hidden bg-[#1a1a1a] text-white">
          <Image
            src="https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1800&q=80&auto=format&fit=crop"
            alt="An Amsterdam canal on a sunny day, lined with trees, gabled houses and moored boats"
            fill
            priority
            unoptimized
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/95 via-[#1a1a1a]/80 to-[#1a1a1a]/35" />
          {/* The tricolour, faint, at the flag's own 3:2 proportions. */}
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-12 grid aspect-[3/2] w-[540px] grid-rows-3 opacity-10">
            <span className="bg-[#AE1C28]" />
            <span className="bg-white" />
            <span className="bg-[#21468B]" />
          </div>

          <div className="container relative mx-auto grid grid-cols-1 items-end gap-8 px-6 pb-12 pt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <nav aria-label="Breadcrumb" className="font-sans text-xs text-white/60 lg:col-span-2">
              <ol className="flex flex-wrap gap-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link href="/country" className="hover:text-white">Countries</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-white/85">Netherlands</li>
              </ol>
            </nav>

            <div>
              <div className={`mb-5 flex items-center gap-3 text-white/75 ${label}`}>
                <Flag code="nl" uid="hero" width={36} />
                Western Europe · Facilitator route
              </div>
              <h1>
                <span className="block font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.02em]">
                  Dutch <em className="text-[#F97316]">Modernism.</em>
                </span>
                <span className="mt-4 block max-w-[46ch] font-sans text-lg font-medium leading-snug">
                  The Netherlands startup visa (1-year startup residence permit) in 2026, step by step
                </span>
              </h1>
              <p className="mt-3 max-w-[56ch] font-sans text-base leading-relaxed text-white/70">
                It is not a golden ticket for anyone. It is a strict 1-year trial period for real entrepreneurs. We expose the agency myths and provide the
                exact roadmap from zero to Dutch citizenship.
              </p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-white/60">
                <span>By <span className="text-white">Farjad P.D</span></span>
                <span>Updated <time dateTime={UPDATED.iso} className="text-white">{UPDATED.label}</time></span>
                <span>IND figures checked 8 Sep 2026; IND fee and RVO rules re-checked 29 Oct 2026</span>
              </p>
              <p className="mt-5 max-w-[60ch] border-l-2 border-[#F97316] pl-3 font-sans text-sm text-white/70">
                <strong className="text-white">The Uncensored Truth about the Netherlands Startup Visa.</strong> You don&apos;t apply to the government first:
                your ticket in is an approved Dutch facilitator, and the permit is not extended after twelve months.
              </p>
            </div>

            <aside aria-label="How to use this page" className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <p className={`text-[#F97316] ${label}`}>Your route through this page</p>
              <ol className="my-4 list-decimal space-y-1 pl-5 font-sans text-sm text-white/75">
                <li>Check yourself against the five rules</li>
                <li>Learn what a facilitator does</li>
                <li>Walk the four steps to landing</li>
                <li>Sort perks from catches</li>
                <li>Drag yourself from zero to the endgame</li>
              </ol>
              <a href="#rules" className="inline-flex items-center gap-2 rounded-full bg-[#F97316] px-5 py-3 font-sans text-sm font-bold text-[#1a1a1a] transition-transform hover:-translate-y-0.5">
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
          question="What is the Netherlands startup visa?"
          task="Read the four facts"
          answer={
            <p>
              The Netherlands startup visa is a strict one-year temporary residence permit for founders of an innovative business, and it is not extended.
              You need an agreement with a facilitator recognised by the RVO before you apply. The IND fee is €423 (2026), and you must show about €21,200
              (single) or €29,700 (family) for the year.
            </p>
          }
        >
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { stat: '12 mo', label: 'Trial period', sub: 'not a permanent or multi-year permit' },
              { stat: '1', label: 'Facilitator contract', sub: 'with an approved incubator, mandatory' },
              { stat: '€423', label: 'IND fee', sub: 'the official application fee, 2026' },
              { stat: '~€21.2k', label: 'Funds to show', sub: 'single, for 12 months; ~€29,700 with family' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white p-5 transition-transform hover:-translate-y-1">
                <dt className="order-2 mt-2 font-sans text-sm font-bold">{s.label}</dt>
                <dd className="order-1 font-serif text-4xl text-[#21468B]">{s.stat}</dd>
                <dd className="order-3 font-sans text-xs text-[#1a1a1a]/55">{s.sub}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 max-w-5xl">
            <h3 className="mb-3 font-serif text-2xl">Not a permanent pass. A 12-month trial.</h3>
            <div className="grid grid-cols-1 gap-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
              <p>
                The Netherlands wants top-tier global talent, but they aren&apos;t looking for fake businesses just to grant Schengen access. This visa is a
                strict 1-year temporary residence permit.
              </p>
              <p>
                You don&apos;t apply directly to the government initially. Your ticket in is a <strong className="text-[#1a1a1a]">Facilitator</strong>—an
                approved Dutch business incubator. You must pitch to them and win their mentorship. They are the gatekeepers.
              </p>
            </div>
          </div>
          <SeenTracker stopId="snapshot" message="Snapshot read" />
        </RouteStop>

        {/* 02 — Who qualifies */}
        <RouteStop
          id="rules"
          number={2}
          eyebrow="5 Non-Negotiable Rules"
          question="Who qualifies for the Netherlands startup visa?"
          task="Answer all five"
          answer={
            <p>
              You qualify if you meet five rules: a signed agreement with an approved facilitator, a truly innovative business that is new to the Dutch
              market, a clear business plan with a capable team, a commitment to register the company with the KvK, and about €21,200 (single) or €29,700
              (family) in a recognized bank.
            </p>
          }
        >
          <RulesQuiz stopId="rules" criteria={rules}>
            <div className="rounded-xl bg-[#1a1a1a] p-5 text-[#F2F0E9]">
              <h3 className="mb-4 font-serif text-2xl text-[#F97316]">The 3 Agency Lies</h3>
              <ul className="grid gap-4">
                {lies.map((l) => (
                  <li key={l.lie}>
                    <strong className="mb-1 block font-sans text-sm text-[#FCA5A5]">{l.lie}</strong>
                    <p className="font-sans text-sm text-[#F2F0E9]/80">{l.truth}</p>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/book-meeting" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F97316] px-5 py-3 font-sans text-sm font-bold text-[#1a1a1a] transition-transform hover:-translate-y-0.5">
              Get a free read on your idea <ArrowRight className="h-4 w-4" />
            </Link>
          </RulesQuiz>
          <p className="mt-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            <strong className="text-[#1a1a1a]">What innovative means here:</strong> your business cannot be a traditional shop or service. It must introduce
            new technology, a novel market approach, or an innovative social process.
          </p>
        </RouteStop>

        {/* 03 — The facilitator */}
        <RouteStop
          id="facilitator"
          number={3}
          tone="white"
          eyebrow="The gatekeeper"
          question="What does a facilitator do for the Netherlands startup visa?"
          task="Read what they do"
          answer={
            <p>
              A facilitator is an experienced mentor or incubator recognised by the RVO. You pitch to them, pass their interviews and sign a mentorship
              agreement; you or your representative then apply to the IND, which asks the RVO to assess your plan. Facilitators are private, so costs vary:
              €500 to €1,000 a month is a typical market range.
            </p>
          }
        >
          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: 'You find them via the RVO', b: 'Find approved Facilitators via the RVO. Pitch online, pass interviews, and sign the official mentorship agreement.' },
              { t: 'They interview you hard', b: 'You will face deep technical interviews with facilitators. If you didn\'t write it, you will freeze and face rejection.' },
              { t: 'The RVO assesses your plan', b: 'You or your authorised representative apply to the IND. The RVO assesses your step-by-step plan and advises the IND.' },
              { t: 'They can house your BSN', b: 'A high-quality facilitator will allow you to use their official office address as your temporary postal address so you can get your BSN immediately.' },
              { t: 'You register the company together', b: 'You and your facilitator must commit to registering your startup with the Dutch Chamber of Commerce (KvK) as soon as you arrive.' },
              { t: 'Their statement helps in year two', b: 'After a year you apply for a self-employed residence permit. A statement from your facilitator can simplify the transition; without one you must meet the standard self-employed requirements.' },
            ].map((x, i) => (
              <li key={x.t} className="rounded-2xl border border-[#1a1a1a]/10 bg-[#F2F0E9] p-5">
                <span className="font-sans text-xs tabular-nums text-[#B4400A]">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-1 font-serif text-xl">{x.t}</h3>
                <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#1a1a1a]/65">{x.b}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            <strong className="text-[#1a1a1a]">What it costs:</strong> expect to pay your facilitator between €500 and €1,000 monthly for desk space,
            mentoring, and administrative support. That is a private market range, not a government fee and not a VisaRoads price: facilitators are
            private organisations, so costs and conditions vary.
          </p>
          <SeenTracker stopId="facilitator" message="Facilitator understood" />
        </RouteStop>

        {/* 04 — How to apply */}
        <RouteStop
          id="steps"
          number={4}
          eyebrow="The process"
          question="How do you apply for the Netherlands startup visa?"
          task="Walk to step 4"
          answer={
            <p>
              Build your idea, MVP and pitch deck yourself first. Finding an RVO-recognised facilitator and signing the agreement usually takes 2 to 3
              months. You then apply to the IND, which asks the RVO to assess your plan; pay the €423 fee and allow 1 to 3 months more. Arrival is realistic
              3 to 6 months after a serious start.
            </p>
          }
        >
          <StepTrail stopId="steps" steps={steps} />
        </RouteStop>

        {/* Photo band */}
        <figure className="relative flex min-h-[360px] items-end overflow-hidden bg-[#1a1a1a] text-white">
          <ParallaxLayer>
            <Image
              src="https://images.unsplash.com/photo-1468436385273-8abca6dfd8d3?w=1800&q=80&auto=format&fit=crop"
              alt="Bicycles parked against the green railing of a bridge over an Amsterdam canal, with tree-lined quays and a bridge behind"
              fill
              unoptimized
              className="object-cover object-[center_60%]"
            />
          </ParallaxLayer>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1a1a]/20 to-[#1a1a1a]/90" />
          <figcaption className="container relative mx-auto flex flex-wrap items-end justify-between gap-5 px-6 py-10">
            <div>
              <p className={`text-[#F97316] ${label}`}>Step 4 · The Dutch Landing</p>
              <p className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
                Register for your BSN.<br />
                <span className="italic text-[#F97316]">Then buy a bicycle.</span>
              </p>
              <p className="mt-2 max-w-[46ch] font-sans text-sm text-white/70">In the Netherlands, the cyclist is king.</p>
            </div>
            <span className="font-sans text-xs text-white/55">Bicycles on an Amsterdam canal bridge</span>
          </figcaption>
        </figure>

        {/* 05 — Money */}
        <RouteStop
          id="money"
          number={5}
          eyebrow="Fees and solvency"
          question="How much money do you need for the Netherlands startup visa?"
          task="Read the four figures"
          answer={
            <p>
              The IND application fee is €423 in 2026. You must also show about €21,200 (single) or €29,700 (family) for twelve months; the amounts
              follow the minimum wage and change on 1 January and 1 July. Facilitators are private and typically charge €500 to €1,000 a month. Agencies
              asking for €20,000 or more are charging massive hidden fees.
            </p>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
              <caption className="pb-2 text-left font-bold">What the Netherlands startup visa costs: official fee, funds to show and facilitator</caption>
              <thead>
                <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                  <th scope="col" className="px-4 py-3">Item</th>
                  <th scope="col" className="px-4 py-3">Amount</th>
                  <th scope="col" className="px-4 py-3">Set by</th>
                  <th scope="col" className="px-4 py-3">Note</th>
                </tr>
              </thead>
              <tbody>
                {costs.map((c) => (
                  <tr key={c.item} className="border-b border-[#1a1a1a]/10 last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-normal">{c.item}</th>
                    <td className="whitespace-nowrap px-4 py-3 font-bold tabular-nums text-[#21468B]">{c.amount}</td>
                    <td className="px-4 py-3">{c.who}</td>
                    <td className="px-4 py-3 text-xs text-[#1a1a1a]/60">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid max-w-5xl grid-cols-1 gap-4 font-sans text-sm leading-relaxed text-[#1a1a1a]/70 md:grid-cols-3">
            <p>
              <strong className="text-[#1a1a1a]">Sanctioned banks.</strong> The IND frequently rejects financial statements from banks in sanctioned countries
              (like Iran). Funds usually need to be in a third-country account.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">Third-party funding.</strong> The IND accepts a facilitator or third party covering your living costs,
              provided the amount is paid into your Dutch bank account and covers the whole period (up to one year).
            </p>
            <p>
              <strong className="text-[#1a1a1a]">No state funds.</strong> You must prove you can financially sustain yourself. You are strictly prohibited from
              claiming Dutch social welfare benefits during your first year.
            </p>
          </div>
          <SeenTracker stopId="money" message="Money mapped" />
        </RouteStop>

        {/* 06 — Life on the permit */}
        <RouteStop
          id="life"
          number={6}
          tone="white"
          eyebrow="Perk or catch?"
          question="What rights and restrictions come with the Netherlands startup visa?"
          task="Guess all eight"
          answer={
            <p>
              In most cases your spouse or partner gets unrestricted working rights and can work for any Dutch employer. You, the main applicant, may only work on your
              startup: no side job, and no Dutch social welfare in your first year. You also need a BSN and Dutch basic health insurance, and your non-EU
              licence is valid for only 185 days after you relocate.
            </p>
          }
        >
          <PerkOrCatchNL stopId="life" items={rights} />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className="font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              <h3 className="mb-3 font-serif text-2xl text-[#1a1a1a]">Arrival Survival Guide</h3>
              <p className="mb-3">
                <strong className="text-[#1a1a1a]">The BSN Monster:</strong> No BSN = you don&apos;t exist. You need a registered address to get it. A good
                facilitator lets you use their office temporarily.
              </p>
              <p className="mb-3">
                <strong className="text-[#1a1a1a]">The Housing Crisis:</strong> Finding an apartment is brutal. Beware of scammers—never send deposits without
                seeing the place.
              </p>
              <p>
                <strong className="text-[#1a1a1a]">The Car Trap:</strong> Road tax and gas are insanely expensive. Buy a bicycle and a train card. In the
                Netherlands, the cyclist is king.
              </p>
            </div>
            <div className="self-start rounded-2xl border-l-4 border-[#F97316] bg-[#FDEBDC] p-6">
              <h3 className="mb-3 font-serif text-2xl text-[#B4400A]">The Golden Ticket: Spouse Visa</h3>
              <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]/80">
                While the main applicant works on the startup, the spouse in most cases gets <strong>full, unrestricted working rights!</strong> They can be hired immediately
                by any Dutch company without a visa sponsor. This is how smart couples survive the first year.
              </p>
            </div>
          </div>
        </RouteStop>

        {/* 07 — After the first year */}
        <RouteStop
          id="after"
          number={7}
          eyebrow="Zero to Citizenship"
          question="What happens after the first year of the Netherlands startup visa?"
          task="Drag to the endgame"
          answer={
            <p>
              The startup visa is not extended. Before your 12 months end, you file a new application for a self-employed residence permit, scored on
              RVO&apos;s points system, showing tangible progress such as a working MVP, active networking or initial clients. A facilitator declaration can
              simplify it. After five years of legal residence you can apply for permanent residency or citizenship.
            </p>
          }
        >
          <TimelineSlider stopId="after" milestones={milestones} />
          <div className="mt-6 grid max-w-5xl grid-cols-1 gap-4 font-sans text-sm leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            <p>
              <strong className="text-[#1a1a1a]">A new application, not a renewal.</strong> After one year, the visa does not auto-renew, and the IND does
              not extend it. You file a new application for a Self-Employed permit, scored on RVO&apos;s points system, and you must prove tangible progress.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">Progress, not profit.</strong> To secure your second-year visa, you don&apos;t need a million-euro profit, but
              you must show a working prototype (MVP), active networking, or initial clients.
            </p>
          </div>
        </RouteStop>

        {/* 08 — The 20 facts */}
        <RouteStop
          id="faq"
          number={8}
          tone="white"
          eyebrow="20 Brutal Truths & Facts"
          question="Netherlands startup visa: frequently asked questions"
          task="Open three answers"
          answer={
            <p>
              No-nonsense details every applicant must know before applying: twenty facts, from the one-year limit and the facilitator contract to solvency,
              sanctioned banks, the BSN, housing scams and your spouse&apos;s right to work. Each one is phrased as the question founders ask, with the original answer underneath.
            </p>
          }
        >
          <div className="grid grid-cols-1 gap-x-16 border-t border-[#1a1a1a]/10 lg:grid-cols-2 lg:border-t-0">
            {[facts.slice(0, 10), facts.slice(10)].map((col, c) => (
              <div key={c} className="lg:border-t lg:border-[#1a1a1a]/10">
                {col.map((f, i) => (
                  <FaqItem key={f.q} n={c * 10 + i + 1} fact={f.fact} q={f.q} a={f.a} />
                ))}
              </div>
            ))}
          </div>
          <OpenedTracker stopId="faq" need={3} message="Questions answered" />
        </RouteStop>

        {/* Sources */}
        <section aria-labelledby="sources-h" className="border-b border-[#1a1a1a]/10 bg-[#F2F0E9] px-6 py-14">
          <div className="container mx-auto">
            <p className={`text-[#B4400A] ${label}`}>Where these figures come from</p>
            <h2 id="sources-h" className="mt-2 font-serif text-3xl">Sources</h2>
            <ol className="mt-6 grid max-w-4xl list-decimal gap-2 pl-5 font-sans text-sm">
              {sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-bold underline decoration-[#F97316] underline-offset-2 hover:text-[#B4400A]">
                    {s.name}
                  </a>{' '}
                  <span className="text-[#1a1a1a]/60">{s.what}{s.checked ? ` Checked ${s.checked}.` : ''}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Book a session */}
        <section id="book" aria-labelledby="book-h" className="scroll-mt-32 bg-[#1a1a1a] px-6 py-16 text-white">
          <div className="container mx-auto grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <div>
              <RouteFinish />
              <p className={`text-[#F97316] ${label}`}>Scale in Amsterdam</p>
              <h2 id="book-h" className="mt-2 font-serif text-4xl leading-tight">
                Bring your idea to a <span className="italic text-[#F97316]">free session.</span>
              </h2>
              <p className="mt-3 max-w-[52ch] font-sans text-white/70">
                Find your Facilitator and validate your concept for the Dutch market. Pick a time, come prepared, and get an honest read on your idea, your
                numbers and whether the Netherlands is the right route. If it isn&apos;t, we&apos;ll say so.
              </p>
              <ul className="my-5 flex flex-wrap gap-2 font-sans text-xs">
                {['Free · 60 minutes', 'Online, Google Meet', 'Link sent after booking'].map((p) => (
                  <li key={p} className="rounded-full border border-white/25 px-3 py-1.5">{p}</li>
                ))}
              </ul>
              <Link href="/book-meeting" className="inline-flex items-center gap-2 rounded-full bg-[#F97316] px-6 py-3.5 font-sans text-sm font-bold text-[#1a1a1a] transition-transform hover:-translate-y-0.5">
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
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={`text-[#B4400A] ${label}`}>Keep reading</p>
                <h2 id="reads-h" className="mt-2 font-serif text-3xl md:text-4xl">More Netherlands guides</h2>
              </div>
              <Link href="/blog/category/netherlands-startup-visa" className="inline-flex items-center gap-1.5 font-sans text-sm font-bold text-[#B4400A] hover:underline">
                All Netherlands articles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="grid snap-x snap-mandatory auto-cols-[82%] grid-flow-col gap-4 overflow-x-auto pb-2 md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:overflow-visible">
              {reads.map((r) => (
                <li key={r.slug} className="group snap-start overflow-hidden rounded-2xl border border-[#1a1a1a]/10 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1a1a1a]/10">
                  <Link href={`/blog/${r.slug}`} className="block">
                    <span className="relative block aspect-video overflow-hidden">
                      <Image src={r.cover} alt="" fill sizes="(min-width: 768px) 33vw, 82vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </span>
                    <span className="grid gap-2 p-5">
                      <span className={`text-[#B4400A] ${label}`}>{r.stage}</span>
                      <h3 className="font-serif text-xl leading-snug">{r.title}</h3>
                      <span className="font-sans text-sm text-[#1a1a1a]/65">{r.excerpt}</span>
                      <span className="font-sans text-xs tabular-nums text-[#1a1a1a]/50">
                        <time dateTime={r.date.iso}>{r.date.label}</time> · {r.minutes} min read
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </RouteProvider>

      {/* Disclaimer, verbatim */}
      <section className="border-t border-[#1a1a1a]/10 bg-[#F9F9F9] px-6 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#1a1a1a]/30" />
            <p className="font-sans text-[11px] leading-relaxed text-[#1a1a1a]/55">
              <strong>Non-Legal Service Notice:</strong> Startup Visa Roads assists with business modeling and facilitator introductions. We are{' '}
              <span className="underline">NOT</span> an immigration law firm. Final decisions are made by the IND (Immigration and Naturalisation Service) based
              on advice from the RVO.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqItem({ n, fact, q, a }: { n: number; fact: string; q: string; a: string }) {
  return (
    <details className="group border-b border-[#1a1a1a]/10" data-faq>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 transition-colors hover:text-[#B4400A] group-open:text-[#B4400A] [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a]/50">
            {n}. {fact}
          </span>
          <h3 className="mt-1 font-serif text-xl leading-snug">{q}</h3>
        </span>
        <span aria-hidden="true" className="font-serif text-2xl transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="max-w-[72ch] border-l-2 border-[#F97316] pb-1 pl-4 mb-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">{a}</p>
    </details>
  );
}
