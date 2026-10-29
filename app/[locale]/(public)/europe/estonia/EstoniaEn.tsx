// ============================================================================
// Component: app/[locale]/(public)/europe/estonia/EstoniaEn.tsx
// The English /en/europe/estonia guide. A guided route in the shape of
// /country/finland: a compact hero, a sticky rail whose Estonian flag rises
// as the reader completes each stop, and one stop per question people search.
// Every stop opens with its question as the H2 and a ~50-word direct answer
// built only from facts on this page. Rendered on the server.
//
// Source of truth: content/fa/europe-estonia.ts (updated 2026-10-27; figures
// verified 2026-09-08 against politsei.ee, the Aliens Act and abudhabi.mfa.ee).
// Every section, fact, caveat and all 19 FAQs are carried over. The Persian
// module's advice for Iranian applicants is kept as a labelled note for
// applicants from sanctioned countries, not as the page's framing. Estonia is
// presented as what it is on this site: a fast, low-cost secondary option,
// not a headline route.
//
// Re-checked 2026-10-29 on official pages:
//   - politsei.ee start-up page: committee decides within 10 working days of a
//     complete application; TRP up to 5 years, extendable up to 10 at a time;
//     four times the subsistence level. It also states a 90-day deadline for
//     the TRP decision — shown next to the module's "about two months".
//   - politsei.ee state fees: €350 in Estonia, €380 at a foreign
//     representation, from 1 Jan 2025.
//   - vm.ee: D visa state fee €120, up to 365 days. (startupestonia.ee still
//     says €80 for a long-stay visa; the Foreign Ministry's figure is used.)
//   - politsei.ee long-term resident: 5 years on a TRP, B1, stable legal
//     income, health insurance, registered address.
//   - politsei.ee citizenship: 8 years, at least 5 on a permanent basis,
//     language exam, Constitution and Citizenship Act test, legal income;
//     the application needs proof of release from the other citizenship.
//   - abudhabi.mfa.ee TRP: "Do not travel to UAE unless you have secured a
//     booking with the Embassy"; fingerprints in person.
//   - emta.ee: dividends taxed at 22/78 from 2025. e-resident.gov.ee: VAT 24%
//     from 1 July 2025, registration above €40,000 turnover.
// No VisaRoads prices anywhere; the instalment structure only.
// ============================================================================

import React from 'react';
import Image from 'next/image';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from '@/routing';
import JsonLd from '@/components/JsonLd';
import { FOUNDER_ID, SITE_URL, breadcrumbJsonLd, faqJsonLd, webPageJsonLd } from '@/lib/seo';
import { MAIN_CONTACT } from '@/content/contact';
import Flag from '@/components/route/flags';
import { RouteProvider, RouteRail, RouteStop, RouteFinish, type RouteStopDef, type RouteTheme } from '@/components/route/RouteProgress';
import {
  CopyButton,
  GateQuiz,
  OpenedTracker,
  ParallaxLayer,
  PerkOrCatch,
  StepWalker,
  YearsRoadmap,
  type PrRoute,
  type RoadmapCopy,
  type RouteStep,
} from '@/components/route/RouteWidgets';

export const EN_META = {
  title: 'Estonia Startup Visa 2026: Committee, MVP, Costs, Steps',
  description:
    'Estonia’s Startup Committee decides in 10 working days. €880 a month in funds, D visa €120, permit €350–€380, an MVP required, no dual citizenship.',
};

// ─── Data ────────────────────────────────────────────────────────────────────

// The module's `updated` date: when the figures were last checked.
const UPDATED = { iso: '2026-10-27', label: '27 Oct 2026' };
const PATH = '/europe/estonia';
const PAGE_URL = `${SITE_URL}/en${PATH}`;

// Estonian blue on paper, the flag's black-blue for dark bands.
// Contrast (WCAG 2.x): accentInk #FFFFFF on accent #0072CE 4.89:1;
// accentText #005EA8 on #F2F0E9 5.82:1, on white 6.63:1, on soft 5.64:1;
// accentOnDark #7DB9F0 on deep #0A1726 8.66:1; primary #003A70 on white 11.42:1.
const THEME: RouteTheme = {
  accent: '#0072CE',
  accentInk: '#FFFFFF',
  accentText: '#005EA8',
  primary: '#003A70',
  deep: '#0A1726',
  soft: '#E2EEFA',
  accentOnDark: '#7DB9F0',
};

const STOPS: RouteStopDef[] = [
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'what', label: 'e-Residency?' },
  { id: 'gate', label: 'The gate' },
  { id: 'steps', label: '5 steps' },
  { id: 'money', label: 'Money' },
  { id: 'tax', label: 'Tax' },
  { id: 'life', label: 'Life' },
  { id: 'residence', label: 'PR & passport' },
  { id: 'compare', label: 'vs DK & FI' },
  { id: 'sanctioned', label: 'Sanctioned?' },
  { id: 'faq', label: 'FAQ' },
  { id: 'role', label: 'Our role' },
];

const snapshot = [
  { label: 'Minimum founders', value: '1', note: 'No legal cap on team size' },
  { label: 'Product', value: 'MVP required', note: 'An idea on paper is refused' },
  { label: 'Personal funds', value: '€880 / month', note: 'Four times the €220 subsistence level, 2026' },
  { label: 'Who evaluates', value: 'Startup Committee', note: 'Members from Estonia’s startup community; decision within 10 working days' },
  { label: 'Required investment', value: 'None' },
  { label: 'Government fees', value: 'D visa €120 · permit €350', note: '€380 at a foreign representation' },
  { label: 'Permit length', value: 'D visa ≤ 1 yr · TRP ≤ 5 yrs', note: 'TRP extendable up to 10 years at a time' },
  { label: 'Permanent residence', value: '5 years + B1' },
  { label: 'Dual citizenship', value: 'Not allowed' },
];

const criteria = [
  { title: 'Technology-based', body: 'The core of the business is software or hardware, not a human service with a website on top.' },
  { title: 'Innovative', body: 'In this ecosystem that means your solution does a job several times faster or cheaper, not merely that it is new.' },
  { title: 'Scalable', body: 'Revenue can grow without costs and headcount growing in a straight line with it. Estonia’s home market is about 1.4 million people, so the plan has to think globally from day one.' },
  { title: 'A built MVP', body: 'At least a prototype or MVP, preferably with a sign of market pull: first users, a first transaction, a market-test result. Numbers, such as monthly or annual revenue, beat adjectives.' },
];

const rejected = [
  'Restaurants and cafés',
  'Physical shops',
  'Traditional digital-marketing agencies',
  'Service and construction companies',
  'Solo consulting',
  'Freelancing',
  'Private tutoring',
  'Beauty salons',
  'Ordinary medical laboratories',
];

const steps: RouteStep[] = [
  {
    title: 'Prepare the file',
    who: 'You',
    body: 'Write the business plan and pitch deck, gather every team member’s CV, and document your MVP. Everything is in English, and the quality of these documents is what gets assessed.',
    note: 'Missing MVP documentation is the most common reason a file is incomplete — and an incomplete file never starts the clock.',
    figure: 'EN',
    figureLabel: 'every document in English',
  },
  {
    title: 'Committee evaluation',
    who: 'Startup Committee, via Startup Estonia',
    body: 'Submit the evaluation application through the Startup Estonia system. The Startup Committee decides one thing only: whether your company is a startup as the law defines it.',
    note: 'The 10 working days run from a complete application. The evaluation is free.',
    figure: '10',
    figureLabel: 'working days, from a complete file',
  },
  {
    title: 'Startup code',
    who: 'On approval',
    body: 'A positive opinion comes with a startup code, which you need for the next stage. Because the committee has already approved you, your idea is not re-assessed from scratch at the permit stage.',
    note: 'The committee’s approval is not residence. It is the key that turns the next lock.',
    figure: 'Code',
    figureLabel: 'needed for the visa or permit',
  },
  {
    title: 'D visa or residence permit',
    who: 'Estonian representation or PPA',
    body: 'Apply for a long-stay D visa or a temporary residence permit (TRP). Both need biometrics, so you must appear in person. The D visa takes about a month; the TRP about two months, and PPA’s own deadline for a decision is 90 days.',
    note: 'D visa €120. TRP €350 in Estonia, €380 at a representation abroad.',
    figure: '€120',
    figureLabel: 'D visa · TRP €350–€380',
  },
  {
    title: 'Arrive and register',
    who: 'Estonia',
    body: 'Enter Estonia, register the company and your address. If you came in on a D visa, apply for the TRP from inside Estonia; it needs a registered Estonian company.',
    note: 'The TRP is issued for up to five years and can be extended for up to ten years at a time.',
    figure: '≤ 5 yrs',
    figureLabel: 'first TRP',
  },
];

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to apply for the Estonia startup visa',
  inLanguage: 'en',
  step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.body })),
};

const fees = [
  { label: 'Startup Committee evaluation', amount: 'Free', note: 'No state fee' },
  { label: 'Long-stay D visa', amount: '€120', note: 'Per adult; valid up to one year' },
  { label: 'Temporary residence permit for business — filed in Estonia', amount: '€350', note: 'PPA tariff from 1 Jan 2025' },
  { label: 'Temporary residence permit for business — filed at a foreign representation', amount: '€380', note: 'PPA tariff from 1 Jan 2025' },
];

const otherCosts = [
  'Schengen health insurance with at least €30,000 of cover.',
  'Official translation of your documents.',
  'Travel to a third country, if there is no Estonian representation where you live.',
  'Company registration and a legal address — a non-resident company needs a physical address and a contact person in Estonia.',
];

const taxRows = [
  { label: 'Profit kept and reinvested in the company', value: '0%', note: 'No corporate income tax while profit stays in the company' },
  { label: 'Profit distributed to shareholders', value: '22%', note: 'Charged as 22/78 of the net amount paid out' },
  { label: 'Standard VAT rate', value: '24%', note: 'Since 1 July 2025 — not zero' },
  { label: 'Mandatory VAT registration', value: '€40,000', note: 'Annual turnover threshold — not €20,000' },
];

const perks = [
  { title: 'Solo founders welcome', content: 'There is no legal cap on team size and you can apply alone or with co-founders — unlike Finland, which requires two founders.', positive: true },
  { title: 'No investment required', content: 'There is no minimum capital to inject into the company. What you need is personal means of support: €880 a month per founder at the 2026 level.', positive: true },
  { title: 'Family can come', content: 'Your spouse and children can get residence with you, and your spouse may work and study. The funds you must show rise with each family member.', positive: true },
  { title: 'A fallback if it fails', content: 'If the startup does not work out you need not leave at once: find an employer and switch your temporary residence from startup to employment. It is not automatic — you must meet that scheme’s conditions.', positive: true },
  { title: 'You must build first', content: 'An idea on paper is refused. The committee wants a working MVP, ideally with first users or transactions behind it.', positive: false },
  { title: '183 days a year', content: 'The Aliens Act defines residing in Estonia as being there at least 183 days a year. Years you fall short do not come back later.', positive: false },
  { title: 'Housing in Tallinn', content: 'Finding a flat as a newcomer is hard; landlords usually want proof of income or a year of funds, and the residence permit needs an official lease.', positive: false },
  { title: 'Long, dark winters', content: 'Take this seriously. The ecosystem’s own resources name winter as a real adjustment challenge.', positive: false },
];

const prRoutes: PrRoute[] = [
  {
    title: 'Long-term resident',
    years: 5,
    reqs: ['5 years of continuous residence on a temporary permit', 'Estonian at B1', 'Stable legal income', 'Health insurance', 'Registered address and a valid permit'],
    note: 'Estonian is a Finno-Ugric language, unrelated to English or most languages founders already speak. B1 takes far longer than a few months.',
    needs: {},
  },
];

const roadmap: RoadmapCopy = {
  prep: { title: 'Before you move', sub: 'MVP, committee, startup code' },
  arrive: { title: 'Arrive', sub: 'D visa or TRP, register the company' },
  extension: { year: 1, title: 'TRP', sub: 'D visa lasts up to 1 year' },
  citizenship: { years: 8 },
  phases: {
    first: { title: 'First year: D visa or TRP', body: 'Register the company and your address; if you came on a D visa, apply for the TRP from inside Estonia. Start Estonian classes now, not in year four.' },
    extended: { title: 'Temporary residence permit, up to 5 years', body: 'Spend at least 183 days a year in Estonia. Long-term residence in {toPr}, with Estonian at B1.' },
    resident: { title: 'Long-term resident', body: 'Citizenship is possible in {toCitizenship} — but only if you can give up your current citizenship.' },
    citizen: { title: 'Eligible to apply for citizenship', body: 'Eight years of residence, at least five on a permanent basis, B1 Estonian, the Constitution and Citizenship Act test, stable legal income, an oath of loyalty, and release from your other citizenship.' },
  },
};

const compare = [
  { country: 'Estonia', code: 'ee' as const, speed: '10 working days', solo: 'Yes', judged: 'A built product (MVP)', catchText: 'Smaller ecosystem and home market', dual: 'Not allowed' },
  { country: 'Denmark', code: 'dk' as const, speed: 'Six-week panel, transparent scoring', solo: 'Yes', judged: 'A plan on paper is assessed too', catchText: 'A hard cap of 75 places; higher cost of living', dual: 'Allowed since 2015' },
  { country: 'Finland', code: 'fi' as const, speed: 'Longer than Estonia', solo: 'No — two founders required', judged: 'The business and team', catchText: 'Very high refusal rate', dual: '—' },
];

const sanctionedNotes = [
  'Estonia has no representation in Iran for these services. The nearest options are the Estonian embassies in Abu Dhabi and Ankara, and biometrics must be given in person.',
  'Book the appointment before you travel. The embassy in Abu Dhabi says plainly: do not travel to the UAE without a confirmed booking. Appointments are online, and no file is accepted without one.',
  'Your funds must sit in an account you can prove, with several months of statements. Balances held in Iranian banks are, in practice, not accepted.',
  'Opening a traditional Estonian bank account is hard before you hold a residence card and a physical address. Plan the first months around fintechs such as Wise — and expect some friction there too on an Iranian passport.',
  'Do not define your market as Iran or the Iranian diaspora. The committee looks for a global view from day one.',
  'Estonia does not allow dual citizenship, and leaving Iranian citizenship is, in practice, close to impossible. For an Iranian applicant the route realistically ends at permanent residence.',
];

const faqs = [
  {
    q: 'Does the Estonia startup visa require an investment?',
    a: 'No. There is no mandatory minimum capital to inject into the company, which is the biggest difference from investment routes. What you need is personal means of support: four times the subsistence level, which is €880 a month at the 2026 level (about €10,560 for a year), for each founder.',
  },
  {
    q: 'How long does it take?',
    a: 'The Startup Committee gives its opinion within 10 working days of receiving a complete application — faster than Denmark’s six-week panel or Finland’s evaluation. After that, a D visa takes about a month and a temporary residence permit about two months. The longest part is usually building the MVP and the file, not the government review.',
  },
  {
    q: 'Do I need a language certificate?',
    a: 'Not for the visa itself — no IELTS, no TOEFL, no Estonian. But the business plan, pitch deck and CVs must be in English, and their quality is what gets assessed. For permanent residence, Estonian at B1 is a non-negotiable condition.',
  },
  {
    q: 'Can my family come with me?',
    a: 'Yes. Your spouse and children can get residence with you, and your spouse may work and study. The funds you must show rise with each family member, and the residence permit also needs an official lease.',
  },
  {
    q: 'What happens if the committee says no?',
    a: 'You can get feedback, genuinely improve the product and the file, and apply again. Resubmitting the same form unchanged gets the same result. The most common reasons for refusal are the ones you could predict from the start: no MVP, or a business that does not scale.',
  },
  {
    q: 'What is the path to permanent residence and Estonian citizenship?',
    a: 'Permanent (long-term) residence after five years of continuous residence, with Estonian at B1 and a stable legal income. Citizenship after eight years, at least five of them on a permanent basis, plus B1 and the Constitution test. But Estonia does not allow dual citizenship: you must give up your previous one. If your country makes that practically impossible, the route ends at permanent residence, not a passport.',
  },
];

const deepDiveFaqs = [
  {
    q: 'Who decides on my startup?',
    a: 'The Startup Committee. According to Startup Estonia its members are selected from Estonia’s startup community, and you apply through the Startup Estonia system. The Ministry of the Interior formed the committee by ministerial order, but the ministry itself does not assess your file. The committee decides one thing: whether your company is a startup as the law defines it. The visa or residence permit is issued by a different body, the Police and Border Guard Board (PPA). Per politsei.ee the committee gives its opinion within 10 working days of a complete application. “Complete” matters: an incomplete file never starts that clock.',
  },
  {
    q: 'What does the committee look for, and what is refused outright?',
    a: 'Three things together: technology-based, innovative and scalable. The working definition of innovation in this ecosystem is that your solution does a job several times faster or cheaper, not merely that it is new. Scalable means revenue can grow without costs and headcount growing in a straight line. The refusal list is short but explicit: restaurants and cafés, physical shops, traditional digital-marketing agencies, service and construction companies, solo consulting, freelancing, private tutoring, beauty salons and ordinary medical laboratories. The rule behind all of them is the same: if revenue is tied to your hours, it is not a startup.',
  },
  {
    q: 'Do I really need an MVP?',
    a: 'Yes, and it is the toughest filter on this route. An idea on paper is refused. You need at least a prototype or MVP, and ideally a sign of market pull: first users, a first transaction, a market-test result. If you have a number — monthly or annual revenue — show it; the committee is more comfortable with numbers than adjectives. This is exactly where Estonia differs from Denmark: the Danish panel assesses a plan, the Estonian committee assesses something built.',
  },
  {
    q: 'Should I get a D visa or go straight to a residence permit?',
    a: 'It depends on whether you have registered the company. The long-stay D visa is valid for up to a year, costs €120 and suits a quick entry and set-up. The temporary residence permit (TRP), per politsei.ee, is issued for up to five years and can be extended for up to ten years at a time — but it requires a company registered in Estonia. The common path: enter on a D visa, register the company, and apply for the TRP from inside Estonia. Because you already hold the committee’s approval, your idea is not re-assessed from scratch at that stage.',
  },
  {
    q: 'How much money do I need to show, and where does the figure come from?',
    a: 'The law sets no fixed figure. It says sufficient income means four times the subsistence level, which the State Budget Act sets each year. At the 2026 level that base is €220, so you need €880 a month — about €10,560 for a year. The €800 figure repeated in many guides is wrong. The amount rises if your spouse comes with you. Because the base changes every year, recalculate before you apply.',
  },
  {
    q: 'What are the government fees?',
    a: 'The committee’s evaluation is free. The long-stay D visa is €120. A residence permit for business, under the PPA tariff from 1 January 2025, is €350 if you apply in Estonia and €380 at a representation abroad. On top of these, budget for Schengen health insurance with at least €30,000 of cover, official translation of documents, and travel to a third country.',
  },
  {
    q: 'What is the “zero tax” story — and where is it wrong?',
    a: 'The true part: Estonia charges no corporate income tax on profit that stays in the company and is reinvested. That zero is real and a big advantage. But “zero tax” is not the whole picture: as soon as profit is distributed to shareholders, corporate tax applies at 22% (charged as 22/78). And the claim in some guides that “there is no tax up to €20,000 turnover and VAT is zero” is false: mandatory VAT registration starts at €40,000 of annual turnover, and Estonia’s VAT rate has been 24% since 1 July 2025, not zero. Build your financial model on the right numbers.',
  },
  {
    q: 'I have heard I must spend 51% of my time in Estonia. Is that right?',
    a: 'Roughly — but the real, citable figure is different. Estonia’s Aliens Act defines residing in Estonia as being present at least 183 days a year. The “51%” that gets quoted is a rounded retelling of those 183 days. Temporary absence in specific cases — study, serious illness, pregnancy and childbirth, a work posting — is counted, provided it is not more than one consecutive year. If permanent residence is your horizon, take the 183 days seriously from year one; years you fall short do not come back later.',
  },
  {
    q: 'How does the route to permanent residence work?',
    a: 'After five years of continuous residence on a temporary permit you can apply for a long-term resident’s permit. The conditions: a registered address, a valid permit, a stable legal income, health insurance and — non-negotiable — Estonian at B1. Estonian is a Finno-Ugric language with no resemblance to Indo-European languages; reaching B1 is not a matter of a few months. If permanent residence is your horizon, start classes in year one, not year four.',
  },
  {
    q: 'And an Estonian passport? Here we have to be honest.',
    a: 'The legal condition is eight years of residence, at least five of them on a permanent basis, plus B1 Estonian, the Constitution and Citizenship Act test, a stable legal income and an oath of loyalty. But one more condition changes everything for many applicants: Estonia does not accept dual citizenship, and you must give up your previous one. For a citizen of a country that does not, in practice, let you leave — Iran is the clearest case — this route realistically reaches permanent residence and stops there. If a European passport is your end goal, Denmark, which has accepted dual citizenship since 2015, is the more logical route. We say this because it changes your decision.',
  },
  {
    q: 'What happens if the startup fails?',
    a: 'You do not have to leave the country straight away. You can look for work in the Estonian labour market and, once you find an employer, change the basis of your temporary residence from startup to employment. This is one of Estonia’s most real advantages over routes where the permit is tied entirely to one company — but it is not automatic, and you must meet the conditions of the relevant employment scheme.',
  },
  {
    q: 'Is e-Residency the same as residence?',
    a: 'No, and it is the most common misunderstanding about Estonia. e-Residency is a digital identity that lets you register a European company and run it online. It gives no right to live in Estonia, it is not a visa, and it does not let you enter Estonia or the Schengen area. It is useful — it makes registering the company simpler and can be done before you apply for a visa — but do not confuse it with residence, and keep your distance from anyone who sells the two as one.',
  },
  {
    q: 'Can I change my business model later?',
    a: 'An ordinary startup pivot is fine, as long as the technological, scalable nature of the business — the thing the committee approved — is kept. If the change is so fundamental that it becomes a different business, assume you need to be re-evaluated and check with PPA before acting.',
  },
  {
    q: 'How many people can be on the team?',
    a: 'The law sets no cap: you can apply alone or with several co-founders — unlike Finland, which requires two founders. Two practical points: every team member’s CV is reviewed, and “can this team execute this idea?” is one of the main criteria; and means of support is counted per person, so each founder must separately show €880 a month for themselves.',
  },
];

const sources = [
  { name: 'Police and Border Guard Board (PPA) — For start-up entrepreneurs', href: 'https://www.politsei.ee/en/instructions/residence-permit-for-business/for-start-up-entrepreneurs', what: 'The expert committee, the 10 working days, permit length, four times the subsistence level, the 90-day decision deadline.' },
  { name: 'PPA — State fee amounts: residence permit and rights of residence', href: 'https://www.politsei.ee/en/instructions/state-fee-amounts/residence-permit-and-rights-of-residence', what: '€350 in Estonia, €380 at a foreign representation, from 1 January 2025.' },
  { name: 'Ministry of Foreign Affairs — Application for a long-stay (D) visa', href: 'https://www.vm.ee/en/consular-visa-and-travel-information/visa-information/application-long-stay-d-visa', what: 'The €120 D visa fee, up to 365 days, in-person application with fingerprints.' },
  { name: 'PPA — Long-term resident’s residence permit', href: 'https://www.politsei.ee/en/instructions/residence-permit-for-a-permanent-resident/long-term-resident-s-residence-permit', what: 'Five years on a temporary permit, B1, income, insurance, registered address.' },
  { name: 'PPA — Estonian citizenship for an adult', href: 'https://www.politsei.ee/en/instructions/estonian-citizenship-for-an-adult', what: 'Eight years, five on a permanent basis, language exam and Constitution test; proof of release from another citizenship.' },
  { name: 'Riigi Teataja — Aliens Act', href: 'https://www.riigiteataja.ee/en/eli/ee/522042016002/consolide/current', what: 'The 183-days-a-year definition of residing in Estonia.' },
  { name: 'Embassy of Estonia in Abu Dhabi — Temporary residence permit', href: 'https://abudhabi.mfa.ee/temporary-residence-permit-trp/', what: 'Appointment before travel; fingerprints in person.' },
  { name: 'Startup Estonia — Startup visa', href: 'https://startupestonia.ee/startup-visa/', what: 'Where the committee application is filed; what counts as a startup.' },
  { name: 'Estonian Tax and Customs Board — Taxation of dividends', href: 'https://emta.ee/en/business-client/taxes-and-payment/income-and-social-taxes/taxation-dividends', what: 'Distributed profit taxed at 22/78 from 2025.' },
  { name: 'e-Residency — A guide to VAT for e-residents', href: 'https://www.e-resident.gov.ee/blog/posts/a-guide-to-vat-for-e-residents/', what: 'VAT at 24% from 1 July 2025; registration above €40,000 turnover.' },
];

const webPage = {
  ...webPageJsonLd({ title: EN_META.title, description: EN_META.description, url: PAGE_URL, locale: 'en' }),
  dateModified: UPDATED.iso,
  author: { '@id': FOUNDER_ID },
  citation: sources.map((s) => s.href),
};

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', url: `${SITE_URL}/en` },
  { name: 'Countries', url: `${SITE_URL}/en/country` },
  { name: 'Estonia startup visa', url: PAGE_URL },
]);

// Two English articles from the sitemap (both 200, checked 2026-10-29) and the
// Denmark guide, the route this page points readers to for a passport.
const reads = [
  {
    href: '/blog/what-startup-founders-should-expect-when-moving-to-estonia-2026',
    stage: 'After you land',
    title: 'What Startup Founders Should Expect When Moving to Estonia in 2026',
    excerpt: 'Digital government, a lively tech scene and an accessible move — and the daily-life challenges that come with them.',
    date: { iso: '2026-10-26', label: '26 Oct 2026' },
    meta: '6 min read',
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/10/336156ac71632082f77d1dc97ba8da46.jpg',
  },
  {
    href: '/blog/build-scalable-tech-startup-estonia-midcareer-founder',
    stage: 'Before you apply',
    title: 'Build a Scalable Tech Startup in Estonia as a Midcareer Founder',
    excerpt: 'Why success hinges on credible, locally relevant business plans and pitch decks.',
    date: { iso: '2026-10-10', label: '10 Oct 2026' },
    meta: '7 min read',
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/10/dde61bded49bd3d33345f84c04dd0285.jpg',
  },
] as const;

// ─── Page ────────────────────────────────────────────────────────────────────

const label = 'font-sans text-xs font-bold uppercase tracking-[0.18em]';
const th = 'px-4 py-3';

export default function EstoniaEn() {
  return (
    <div className="w-full overflow-x-clip bg-[#F2F0E9] text-[#1a1a1a]">
      <JsonLd data={[webPage, breadcrumbs, howToJsonLd, faqJsonLd([...faqs, ...deepDiveFaqs].map((f) => ({ question: f.q, answer: f.a })), 'en')]} />

      <RouteProvider stops={STOPS} flag="ee" theme={THEME}>
        {/* ── Hero ── */}
        <header className="relative overflow-hidden bg-[#0A1726] text-white">
          <Image
            src="/fa/img/estonia.webp"
            alt="A cobbled lane in Tallinn’s Old Town with an Estonian flag hanging from a wall, an iron street lamp and the Kullassepa street sign"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_45%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1726]/95 via-[#0A1726]/80 to-[#0A1726]/40" />

          <div className="container relative mx-auto grid grid-cols-1 items-end gap-8 px-6 pb-12 pt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <nav aria-label="Breadcrumb" className="font-sans text-xs text-white/60 lg:col-span-2">
              <ol className="flex flex-wrap gap-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link href="/country" className="hover:text-white">Countries</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-white/85">Estonia</li>
              </ol>
            </nav>

            <div>
              <div className={`mb-5 flex items-center gap-3 text-white/75 ${label}`}>
                <Flag code="ee" uid="hero" width={36} />
                Estonia · Startup visa
              </div>
              <h1>
                <span className="block font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.02em]">
                  Estonia <em className="text-[#7DB9F0]">Startup.</em>
                </span>
                <span className="mt-4 block max-w-[46ch] font-sans text-lg font-medium leading-snug">
                  The Estonia startup visa in 2026, step by step
                </span>
              </h1>
              <p className="mt-3 max-w-[58ch] font-sans text-base leading-relaxed text-white/70">
                The country that gave the world Skype, Wise and Bolt has one of Europe’s fastest startup evaluations: a decision in ten working days
                — Denmark’s panel takes six weeks — no required investment and the lowest personal funds. In return, an idea on paper is refused — you need an MVP.
              </p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-white/60">
                <span>By <span className="text-white">Farjad P.D</span></span>
                <span>Updated <time dateTime={UPDATED.iso} className="text-white">{UPDATED.label}</time></span>
                <span>Figures checked against politsei.ee, the Aliens Act and the Estonian embassy in Abu Dhabi</span>
              </p>
              <p className="mt-5 max-w-[60ch] border-l-2 border-[#7DB9F0] pl-3 font-sans text-sm text-white/70">
                <strong className="text-white">Fast and cheap, not a passport route.</strong> Estonia does not allow dual citizenship. Treat it as a quick,
                low-cost way into Europe for a founder who has already built something — and check the end of the road before you start.
              </p>
            </div>

            <aside aria-label="How to use this page" className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <p className={`text-[#7DB9F0] ${label}`}>Your route through this page</p>
              <ol className="my-4 list-decimal space-y-1 pl-5 font-sans text-sm text-white/75">
                <li>Check your startup against the committee’s tests</li>
                <li>Walk the five steps</li>
                <li>Work out your money and your tax</li>
                <li>Sort perks from catches</li>
                <li>See where the road ends</li>
              </ol>
              <a href="#gate" className="inline-flex items-center gap-2 rounded-full bg-[#0072CE] px-5 py-3 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
                Start the route <ArrowRight className="h-4 w-4" />
              </a>
            </aside>
          </div>
        </header>

        <RouteRail />

        {/* 01 — Snapshot */}
        <RouteStop
          id="snapshot"
          number={1}
          eyebrow="At a glance"
          question="What are the key facts of the Estonia startup visa?"
          task="Read the nine facts"
          completeOn="view"
          message="Snapshot read"
          answer={
            <p>
              One founder is enough and no investment is required, but you must have a working MVP. Each founder shows €880 a month in personal funds.
              The Startup Committee decides within 10 working days; the D visa costs €120 and the residence permit €350, or €380 abroad. Permanent
              residence takes five years and B1 Estonian. Dual citizenship is not allowed.
            </p>
          }
        >
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {snapshot.map((s) => (
              <div key={s.label} className="flex flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white p-5">
                <dt className="order-2 mt-2 font-sans text-sm font-bold">{s.label}</dt>
                <dd className="order-1 font-serif text-3xl text-[#003A70]">{s.value}</dd>
                {s.note && <dd className="order-3 font-sans text-xs text-[#1a1a1a]/55">{s.note}</dd>}
              </div>
            ))}
          </dl>
        </RouteStop>

        {/* 02 — What it is */}
        <RouteStop
          id="what"
          number={2}
          tone="white"
          eyebrow="Two bodies, one route"
          question="What is the Estonia startup visa, and is e-Residency the same thing?"
          task="Read the difference"
          completeOn="view"
          message="Difference understood"
          answer={
            <p>
              It is a route for non-EU founders of technology-based, scalable businesses. The Startup Committee, drawn from Estonia’s startup community,
              decides whether your company is a startup in law; the Police and Border Guard Board (PPA) then issues the visa or residence permit.
              e-Residency is different: a digital identity for running a company online, not residence.
            </p>
          }
        >
          <div className="grid max-w-5xl grid-cols-1 gap-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            <p>
              <strong className="text-[#1a1a1a]">The committee’s approval is not residence.</strong> It is the key that turns the next lock. The Ministry of
              the Interior formed the committee by ministerial order, which is why politsei.ee calls it an expert committee of the ministry — but the
              ministry itself does not assess your file.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">e-Residency gives no right to live in Estonia.</strong> It is not a visa and does not let you enter Estonia or
              the Schengen area. It is useful, and can be a good first step because it makes registering the company simpler — but if anyone sells it to
              you as “residence”, walk away.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">The real advantage is speed and cost.</strong> The evaluation is free and takes ten working days; in Denmark it
              takes six weeks and in Finland longer. The personal funds are lower than both.
            </p>
            <p className="rounded-xl bg-[#E2EEFA] p-4 text-[#1a1a1a]">
              The price of that speed is one hard condition: the committee wants something already built. Denmark assesses a plan; Estonia assesses a
              product.
            </p>
          </div>
        </RouteStop>

        {/* 03 — The gate */}
        <RouteStop
          id="gate"
          number={3}
          eyebrow="The Startup Committee’s tests"
          question="What does Estonia’s Startup Committee look for?"
          task="Answer all four"
          answer={
            <p>
              Three qualities at once — technology-based, innovative and scalable — plus a built MVP, ideally with first users or transactions. Innovation
              here means doing a job several times faster or cheaper. Restaurants, shops, agencies, consulting, freelancing, tutoring and salons are
              refused: if revenue is tied to your hours, it is not a startup.
            </p>
          }
        >
          <GateQuiz
            stopId="gate"
            criteria={criteria}
            strongNote="Now make the file prove it: MVP documentation, real numbers, and a team whose CVs show they can execute this idea."
            gapNote="A missing MVP is the most common reason for refusal, and an incomplete file never starts the 10-day clock."
          >
            <h3 className="font-serif text-xl">Refused outright</h3>
            <ul className="flex flex-wrap gap-1.5 font-sans text-xs">
              {rejected.map((r) => (
                <li key={r} className="rounded-full border border-[#1a1a1a]/15 px-2.5 py-1 text-[#1a1a1a]/70">{r}</li>
              ))}
            </ul>
            <p className="font-sans text-sm text-[#1a1a1a]/65">The rule behind every one: if revenue is tied to your hours, it is not a startup.</p>
            <Link href="/book-meeting" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#0072CE] px-5 py-3 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
              Get a free read on your startup <ArrowRight className="h-4 w-4" />
            </Link>
          </GateQuiz>
        </RouteStop>

        {/* 04 — Steps */}
        <RouteStop
          id="steps"
          number={4}
          tone="white"
          eyebrow="The process"
          question="How do you apply for the Estonia startup visa?"
          task="Walk to step 5"
          answer={
            <p>
              Prepare an English business plan, pitch deck, team CVs and MVP documentation; apply to the Startup Committee through Startup Estonia; get
              your startup code within 10 working days of a complete file; apply in person for a D visa or residence permit; arrive, register the
              company, and switch to the permit if you came on a D visa.
            </p>
          }
        >
          <StepWalker stopId="steps" steps={steps} />
          <p className="mt-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            <strong className="text-[#1a1a1a]">The ten working days start only when the file is complete.</strong> An incomplete file never starts the clock —
            and the most common gap is missing MVP documentation. Building the MVP and the file usually takes longer than any government review.
          </p>
        </RouteStop>

        {/* Photo band */}
        <figure className="relative flex min-h-[360px] items-end overflow-hidden bg-[#0A1726] text-white">
          <ParallaxLayer>
            <Image
              src="/fa/img/estonia-2.webp"
              alt="A street in Tallinn’s Old Town with pastel façades, red tiled roofs and pedestrians on an overcast day"
              fill
              sizes="100vw"
              className="object-cover object-[center_45%]"
            />
          </ParallaxLayer>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A1726]/20 to-[#0A1726]/90" />
          <figcaption className="container relative mx-auto flex flex-wrap items-end justify-between gap-5 px-6 py-10">
            <div>
              <p className={`text-[#7DB9F0] ${label}`}>Step 5 · Arrive</p>
              <p className="mt-2 max-w-[30ch] font-serif text-3xl leading-tight md:text-4xl">
                Tallinn’s Old Town is small.<br />
                <span className="italic text-[#7DB9F0]">So is the ecosystem — and it is reachable.</span>
              </p>
            </div>
            <span className="font-sans text-xs text-white/55">Tallinn Old Town</span>
          </figcaption>
        </figure>

        {/* 05 — Money */}
        <RouteStop
          id="money"
          number={5}
          eyebrow="Means of support and state fees · 2026"
          question="How much money do you need for the Estonia startup visa in 2026?"
          task="Read both tables"
          completeOn="view"
          message="Money mapped"
          answer={
            <p>
              Each founder must show four times the subsistence level: €880 a month at the 2026 level, about €10,560 for a year, more with a spouse and
              children. The committee’s evaluation is free, the D visa costs €120, and the residence permit €350 in Estonia or €380 at a representation
              abroad. No investment in the company is required.
            </p>
          }
        >
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
                <caption className="pb-2 text-left font-bold">Personal means of support, per founder, 2026</caption>
                <thead>
                  <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                    <th scope="col" className={th}>Item</th>
                    <th scope="col" className={th}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Subsistence level (set yearly by the State Budget Act)', '€220 / month'],
                    ['Required: four times the subsistence level', '€880 / month'],
                    ['For one year', 'about €10,560'],
                    ['With a spouse and children', 'Higher — rises per family member'],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-[#1a1a1a]/10 last:border-0">
                      <th scope="row" className={`${th} text-left font-normal`}>{k}</th>
                      <td className={`${th} tabular-nums`}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 font-sans text-xs text-[#1a1a1a]/55">
                Counted per person: each founder shows €880 a month for themselves. The €800 figure repeated in many guides is wrong.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
                <caption className="pb-2 text-left font-bold">Government fees</caption>
                <thead>
                  <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                    <th scope="col" className={th}>Application</th>
                    <th scope="col" className={th}>Fee</th>
                    <th scope="col" className={th}>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f) => (
                    <tr key={f.label} className="border-b border-[#1a1a1a]/10 last:border-0">
                      <th scope="row" className={`${th} text-left font-normal`}>{f.label}</th>
                      <td className={`${th} tabular-nums`}>{f.amount}</td>
                      <td className={`${th} text-xs text-[#1a1a1a]/60`}>{f.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 grid max-w-5xl grid-cols-1 gap-6 font-sans text-sm leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-serif text-xl text-[#1a1a1a]">Also budget for</h3>
              <ul className="grid list-disc gap-1 pl-5">
                {otherCosts.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
            <p>
              <strong className="text-[#1a1a1a]">Re-check two numbers every January.</strong> The subsistence level, which the State Budget Act sets each
              year and which the €880 is four times of, and the state fees, last changed on 1 January 2025. Recalculate before you apply.
            </p>
          </div>
        </RouteStop>

        {/* 06 — Tax */}
        <RouteStop
          id="tax"
          number={6}
          tone="white"
          eyebrow="“Zero tax” — what is true and what is not"
          question="Is Estonia really zero tax for startups?"
          task="Read the four rates"
          completeOn="view"
          message="Tax read"
          answer={
            <p>
              Only on profit you keep: Estonia charges no corporate income tax while profit stays in the company and is reinvested. Distributed profit is
              taxed at 22%, charged as 22/78. VAT is not zero — the standard rate is 24% since 1 July 2025 — and mandatory VAT registration starts at
              €40,000 of annual turnover, not €20,000.
            </p>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] max-w-4xl overflow-hidden rounded-2xl bg-[#F2F0E9] font-sans text-sm">
              <caption className="pb-2 text-left font-bold">Estonian company tax, the numbers that matter</caption>
              <thead>
                <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                  <th scope="col" className={th}>What</th>
                  <th scope="col" className={th}>Rate or threshold</th>
                  <th scope="col" className={th}>Note</th>
                </tr>
              </thead>
              <tbody>
                {taxRows.map((r) => (
                  <tr key={r.label} className="border-b border-[#1a1a1a]/10 last:border-0">
                    <th scope="row" className={`${th} text-left font-normal`}>{r.label}</th>
                    <td className={`${th} font-bold tabular-nums text-[#003A70]`}>{r.value}</td>
                    <td className={`${th} text-xs text-[#1a1a1a]/60`}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/70">
            For a startup that ploughs profit back into growth for years, the 0% on retained profit is a real lever. Build your financial model on 0% for
            retained profit and 22% for distributed profit — not on “Estonia has no tax”.
          </p>
        </RouteStop>

        {/* 07 — Life */}
        <RouteStop
          id="life"
          number={7}
          eyebrow="Perk or catch?"
          question="What do you get with the Estonia startup visa, and what are the catches?"
          task="Guess all eight"
          answer={
            <p>
              You can apply alone, invest nothing, bring your family — your spouse may work and study — and switch to an employment basis if the startup
              fails. In return you must build an MVP first, spend at least 183 days a year in Estonia, find housing in a tight Tallinn market and live
              through long, dark winters.
            </p>
          }
        >
          <PerkOrCatch stopId="life" items={perks} />
          <div className="mt-8 max-w-4xl font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
            <h3 className="mb-2 font-serif text-2xl text-[#1a1a1a]">If the startup does not work out</h3>
            <p>
              You will read this in few places, and it is worth knowing: if the business does not take off, you do not have to leave straight away. You
              can look for work in Estonia and, once you find an employer, change the basis of your temporary residence from startup to employment. It is
              not automatic — you must meet the conditions of that employment scheme — but the existence of this route makes Estonia less risky than
              routes where the permit is tied entirely to one company.
            </p>
          </div>
        </RouteStop>

        {/* 08 — PR and citizenship */}
        <RouteStop
          id="residence"
          number={8}
          tone="white"
          eyebrow="The end of the road"
          question="How do you get permanent residence and citizenship in Estonia?"
          task="Drag yourself through the years"
          answer={
            <p>
              After five years of continuous residence you can apply for a long-term resident’s permit with B1 Estonian, a stable legal income, health
              insurance. Citizenship needs eight years of residence, at least five on a permanent basis, plus a language and
              Constitution test — and you must give up your other citizenship, because Estonia does not allow dual citizenship.
            </p>
          }
        >
          <YearsRoadmap stopId="residence" routes={prRoutes} defaultRoute={0} copy={roadmap} />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              <h3 className="mb-2 font-serif text-2xl text-[#1a1a1a]">The 183-day rule</h3>
              <p>
                The Aliens Act defines residing in Estonia as being there at least 183 days a year. The “51%” that gets quoted is a rounded retelling of
                those 183 days. Temporary absence for study, serious illness, pregnancy and childbirth or a work posting is counted, provided it does not
                exceed one consecutive year.
              </p>
              <h3 className="mb-2 mt-6 font-serif text-2xl text-[#1a1a1a]">Long-term residence</h3>
              <p>
                Five years of continuous residence on a temporary permit, a registered address, a valid permit, a stable legal income, health insurance and
                Estonian at B1. Estonian is a Finno-Ugric language; reaching B1 is not a matter of a few months, so start in year one.
              </p>
            </div>
            <div className="rounded-2xl bg-[#003A70] p-6 font-sans text-sm leading-relaxed text-white/80">
              <h3 className="mb-2 font-serif text-2xl text-white">Estonian citizenship — the honest version</h3>
              <p>
                Eight years of residence, at least five of them on a permanent basis, B1 Estonian, the Constitution and Citizenship Act test, a stable
                legal income and an oath of loyalty.
              </p>
              <p className="mt-3">
                <strong className="text-white">Estonia does not allow dual citizenship.</strong> You must give up your previous citizenship. If your country
                makes that practically impossible, this route reaches permanent residence and stops there. If a European passport is your end goal,
                Denmark — which has accepted dual citizenship since 2015 — is the more logical route.
              </p>
              <Link href="/country/denmark" className="mt-4 inline-flex items-center gap-1.5 font-bold text-[#7DB9F0] hover:underline">
                Read the Denmark guide <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </RouteStop>

        {/* Photo band */}
        <figure className="relative flex min-h-[340px] items-end overflow-hidden bg-[#0A1726] text-white">
          <ParallaxLayer>
            <Image
              src="/fa/img/estonia-3.webp"
              alt="Tallinn skyline: the Town Hall spire above the Old Town’s tiled roofs, with the glass towers of the modern business district behind"
              fill
              sizes="100vw"
              className="object-cover object-[center_40%]"
            />
          </ParallaxLayer>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A1726]/20 to-[#0A1726]/90" />
          <figcaption className="container relative mx-auto px-6 py-10">
            <p className="max-w-[34ch] font-serif text-3xl leading-tight md:text-4xl">
              About 1.4 million people. <span className="italic text-[#7DB9F0]">Plan for the world from day one.</span>
            </p>
            <p className="mt-2 max-w-[52ch] font-sans text-sm text-white/70">
              Estonia’s home market is small, so the committee wants to see a plan that thinks globally from the start.
            </p>
          </figcaption>
        </figure>

        {/* 09 — Compare */}
        <RouteStop
          id="compare"
          number={9}
          eyebrow="Estonia, Denmark or Finland"
          question="Is the Estonia startup visa better than Denmark’s or Finland’s?"
          task="Compare the three"
          completeOn="view"
          message="Routes compared"
          answer={
            <p>
              It depends on what you have and where you want to end up. If you have a built product and want a fast, low-cost way into Europe, Estonia.
              If you are still at the plan stage, or your end goal is a passport, Denmark. Finland has a stronger ecosystem but requires two founders and
              refuses most applicants.
            </p>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
              <caption className="pb-2 text-left font-bold">Three European startup routes side by side</caption>
              <thead>
                <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                  <th scope="col" className={th}>Country</th>
                  <th scope="col" className={th}>Evaluation</th>
                  <th scope="col" className={th}>Solo founder</th>
                  <th scope="col" className={th}>What is judged</th>
                  <th scope="col" className={th}>Main catch</th>
                  <th scope="col" className={th}>Dual citizenship</th>
                </tr>
              </thead>
              <tbody>
                {compare.map((c) => (
                  <tr key={c.country} className="border-b border-[#1a1a1a]/10 last:border-0">
                    <th scope="row" className={`${th} text-left`}>
                      <span className="inline-flex items-center gap-2">
                        <Flag code={c.code} uid={`cmp-${c.code}`} width={22} />
                        {c.country}
                      </span>
                    </th>
                    <td className={th}>{c.speed}</td>
                    <td className={th}>{c.solo}</td>
                    <td className={th}>{c.judged}</td>
                    <td className={th}>{c.catchText}</td>
                    <td className={th}>{c.dual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            Estonia is also the cheapest of the three, and its 0% tax on retained profit is real. The trade-off: an MVP is mandatory, the ecosystem and home
            market are smaller, and dual citizenship is not allowed.{' '}
            <Link href="/country/finland" className="font-bold text-[#005EA8] hover:underline">Finland guide</Link> ·{' '}
            <Link href="/country/denmark" className="font-bold text-[#005EA8] hover:underline">Denmark guide</Link>
          </p>
        </RouteStop>

        {/* 10 — Applicants from sanctioned countries */}
        <RouteStop
          id="sanctioned"
          number={10}
          tone="white"
          eyebrow="Note for applicants from sanctioned countries"
          question="What should applicants from sanctioned countries such as Iran plan for?"
          task="Read the six notes"
          completeOn="view"
          message="Notes read"
          answer={
            <p>
              Practical friction rather than different rules. There is no Estonian representation in Iran for these services, so you file in Abu Dhabi or
              Ankara and must book before you travel. Funds held in Iranian banks are not accepted in practice, banking is hard at first, and because
              Estonia bars dual citizenship the route realistically ends at permanent residence.
            </p>
          }
        >
          <ol className="grid max-w-5xl list-decimal grid-cols-1 gap-3 pl-5 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            {sanctionedNotes.map((n) => <li key={n} className="pl-1">{n}</li>)}
          </ol>
        </RouteStop>

        {/* 11 — FAQ */}
        <RouteStop
          id="faq"
          number={11}
          eyebrow="Questions founders ask"
          question="Estonia startup visa: frequently asked questions"
          task="Open three answers"
          answer={<p>Twenty answers, from investment and timelines to how the Startup Committee decides, the real tax picture, the 183-day rule and why the road ends at permanent residence for many applicants.</p>}
        >
          <FaqGroups />
          <OpenedTracker stopId="faq" need={3} message="Questions answered" />
        </RouteStop>

        {/* 12 — Our role */}
        <RouteStop
          id="role"
          number={12}
          tone="white"
          eyebrow="How we work"
          question="What does VisaRoads do on an Estonia file, and what does the refund undertaking cover?"
          task="Read the terms"
          completeOn="view"
          message="Terms read"
          answer={
            <p>
              We are not Estonian immigration lawyers and we do not file your PPA application. Our work comes before it: getting you to the Startup
              Committee’s approval. If we fail to obtain that approval within twelve months of the first instalment, every amount paid is refunded. A
              visa or residence refusal is not covered.
            </p>
          }
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              <h3 className="mb-2 font-serif text-2xl text-[#1a1a1a]">What we do</h3>
              <ul className="grid list-disc gap-1.5 pl-5">
                <li>An honest check of whether your business is a “startup” by the committee’s definition — and saying so before you spend money.</li>
                <li>Helping get the product to a state where it can be presented as an MVP; this is the hardest part of the Estonian route.</li>
                <li>An English business plan, financial model and pitch deck to the standard the committee expects, and team CVs written the way they are read.</li>
                <li>Preparing the evaluation file and following it through to the startup code; after a refusal, analysing the feedback and deciding whether to reapply.</li>
                <li>Support at the next stage — the visa or TRP, the embassy appointment in a third country, and family documents — alongside the lawyer or adviser who files the case.</li>
              </ul>
              <h3 className="mb-2 mt-6 font-serif text-2xl text-[#1a1a1a]">Phases and instalments</h3>
              <p className="mb-2">The work runs in four phases, paid in three instalments, each tied to a real event in the file rather than to the passing of time:</p>
              <ol className="grid list-decimal gap-1.5 pl-5">
                <li>Contract, idea review, market check, business plan and pitch deck, and MVP documentation. First instalment on signing.</li>
                <li>The committee’s approval and the startup code. Second instalment when the approval is issued.</li>
                <li>Support preparing documents and filing the visa or residence application.</li>
                <li>Residence issued for you and your family. Third instalment when residence is issued.</li>
              </ol>
              <p className="mt-2">The contract runs for twelve months from signing and payment of the first instalment.</p>
            </div>
            <div className="font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              <h3 className="mb-2 font-serif text-2xl text-[#1a1a1a]">The refund undertaking — exactly where it applies</h3>
              <p>
                What we undertake is obtaining the Startup Committee’s approval, and only that. If we do not obtain it within twelve months of the first
                instalment, 100% of the amounts received are refunded at the euro rate of the day. That includes a refusal by the committee because of
                structural, technical or content weaknesses in the business plan or pitch deck — that work is ours, and so is the responsibility.
              </p>
              <ul className="mt-3 grid list-disc gap-1.5 pl-5">
                <li>No refund if PPA or an embassy refuses the visa or residence, or the case officer raises an objection. That decision belongs to another body.</li>
                <li>No refund if the refusal is due to your own personal or identity issues: problems with civil documents or translations, your passport, a forged document, a criminal record, or not having and being unable to provide proof of funds.</li>
                <li>No refund if you do not pay government, embassy and biometric fees on time, or do not provide personal documents and the Estonian state’s requirements, and the delay exceeds two months; the contract is then terminated in VisaRoads’ favour.</li>
                <li>If you withdraw at any stage, the remaining instalments are due within seven working days.</li>
              </ul>
              <p className="mt-4 rounded-xl bg-[#E2EEFA] p-4 text-[#1a1a1a]">
                Do not confuse this refund undertaking with a “residence guarantee”. Nobody outside the committee and PPA can guarantee their decision, and
                anyone who sells you a guaranteed residence is someone to walk away from. What our contract contains is money back in one defined case —
                not a positive decision.
              </p>
            </div>
          </div>
        </RouteStop>

        {/* Sources */}
        <section aria-labelledby="sources-h" className="border-b border-[#1a1a1a]/10 bg-[#F2F0E9] px-6 py-14">
          <div className="container mx-auto">
            <p className={`text-[#005EA8] ${label}`}>Where these figures come from</p>
            <h2 id="sources-h" className="mt-2 font-serif text-3xl">Sources</h2>
            <ol className="mt-6 grid max-w-4xl list-decimal gap-2 pl-5 font-sans text-sm">
              {sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-bold underline decoration-[#0072CE] underline-offset-2 hover:text-[#005EA8]">
                    {s.name}
                  </a>{' '}
                  <span className="text-[#1a1a1a]/60">{s.what}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 max-w-4xl font-sans text-xs text-[#1a1a1a]/55">
              Figures verified on 8 September 2026 and re-checked on 27 October 2026 (the evaluating body and the permit fee abroad); fees and the 183-day rule
              re-confirmed on the pages above on 29 October 2026.
            </p>
          </div>
        </section>

        {/* Book a session */}
        <section id="book" aria-labelledby="book-h" className="scroll-mt-32 bg-[#0A1726] px-6 py-16 text-white">
          <div className="container mx-auto grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <div>
              <RouteFinish />
              <p className={`text-[#7DB9F0] ${label}`}>Talk it through</p>
              <h2 id="book-h" className="mt-2 font-serif text-4xl leading-tight">
                Bring your MVP to a <span className="italic text-[#7DB9F0]">free session.</span>
              </h2>
              <p className="mt-3 max-w-[52ch] font-sans text-white/70">
                Pick a time, come prepared, and get an honest read on whether your company is a startup in the committee’s eyes and whether Estonia is the
                right route for where you want to end up. If it isn&apos;t, we&apos;ll say so.
              </p>
              <ul className="my-5 flex flex-wrap gap-2 font-sans text-xs">
                {['Free · 60 minutes', 'Online, Google Meet', 'Link sent after booking'].map((p) => (
                  <li key={p} className="rounded-full border border-white/25 px-3 py-1.5">{p}</li>
                ))}
              </ul>
              <Link href="/book-meeting" className="inline-flex items-center gap-2 rounded-full bg-[#0072CE] px-6 py-3.5 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
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
              <p className={`text-[#005EA8] ${label}`}>Keep reading</p>
              <h2 id="reads-h" className="mt-2 font-serif text-3xl md:text-4xl">More Estonia guides</h2>
            </div>
            <ul className="grid snap-x snap-mandatory auto-cols-[82%] grid-flow-col gap-4 overflow-x-auto pb-2 md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:overflow-visible">
              {reads.map((r) => (
                <li key={r.href} className="group snap-start overflow-hidden rounded-2xl border border-[#1a1a1a]/10 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0A1726]/10">
                  <Link href={r.href} className="block">
                    <span className="relative block aspect-video overflow-hidden">
                      <Image src={r.cover} alt="" fill sizes="(min-width: 768px) 33vw, 82vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </span>
                    <span className="grid gap-2 p-5">
                      <span className={`text-[#005EA8] ${label}`}>{r.stage}</span>
                      <h3 className="font-serif text-xl leading-snug">{r.title}</h3>
                      <span className="font-sans text-sm text-[#1a1a1a]/65">{r.excerpt}</span>
                      <span className="font-sans text-xs tabular-nums text-[#1a1a1a]/50">
                        <time dateTime={r.date.iso}>{r.date.label}</time> · {r.meta}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
              <li className="group snap-start overflow-hidden rounded-2xl border border-[#1a1a1a]/10 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0A1726]/10">
                <Link href="/country/denmark" className="block">
                  <span className="relative grid aspect-video place-items-center bg-[#0A1726]">
                    <Flag code="dk" uid="read-dk" width={96} />
                  </span>
                  <span className="grid gap-2 p-5">
                    <span className={`text-[#005EA8] ${label}`}>If you want a passport</span>
                    <h3 className="font-serif text-xl leading-snug">The Denmark startup visa, step by step</h3>
                    <span className="font-sans text-sm text-[#1a1a1a]/65">
                      A plan on paper can be assessed, solo founders are accepted, and Denmark has allowed dual citizenship since 2015.
                    </span>
                    <span className="font-sans text-xs text-[#1a1a1a]/50">Country guide</span>
                  </span>
                </Link>
              </li>
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
              <strong>Regulatory Notice:</strong> Figures on this page were verified on 8 September 2026 and re-checked on 27 October 2026 against the
              Police and Border Guard Board, the Aliens Act, the Ministry of Foreign Affairs and the Estonian embassy in Abu Dhabi. They are provided for
              informational purposes only. VisaRoads Inc., an Ashavid company, is a strategic business advisory firm — we are{' '}
              <span className="underline">NOT</span> an immigration law firm and do not file PPA applications. The Startup Committee’s approval does not
              guarantee a visa or residence permit. The subsistence level and state fees change, usually in January — always verify current figures at{' '}
              <a href="https://www.politsei.ee/en" target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-[#005EA8]">politsei.ee</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqGroups() {
  const groups = [
    { heading: 'Frequently asked', blurb: '', items: faqs },
    {
      heading: 'The committee, tax and permanent residence, in detail',
      blurb: 'Several answers here contradict figures in circulation; in each case the official source won: €880 not €800, a €40,000 VAT threshold not €20,000, 24% VAT not zero, and 183 days a year rather than “51%”.',
      items: deepDiveFaqs,
    },
  ];
  return (
    <div className="grid max-w-4xl gap-12">
      {groups.map((g) => (
        <div key={g.heading}>
          <h3 className={`mb-2 text-[#005EA8] ${label}`}>{g.heading}</h3>
          {g.blurb && <p className="mb-4 max-w-2xl font-sans text-sm text-[#1a1a1a]/55">{g.blurb}</p>}
          <div className="border-t border-[#1a1a1a]/10">
            {g.items.map((f) => (
              <details key={f.q} className="group border-b border-[#1a1a1a]/10" data-faq>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 transition-colors hover:text-[#005EA8] group-open:text-[#005EA8] [&::-webkit-details-marker]:hidden">
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
  );
}
