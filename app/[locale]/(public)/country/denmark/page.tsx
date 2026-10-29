// ============================================================================
// Page: app/[locale]/(public)/country/denmark/page.tsx
// Layout: a guided route, built on the Finland page's pattern. A compact Nyhavn
// hero, a sticky rail whose Danish flag rises as the reader completes each
// stop, and one stop per question people actually search. Every stop opens
// with its question as the H2 and a ~50-word direct answer (the passage answer
// engines quote), then the detail: real tables, lists, and a small game on
// top. All copy is rendered on the server, so crawlers and AI engines read the
// whole page. The two Denmark-shaped games (self-support calculator, road to
// citizenship) live next to this file in DenmarkWidgets.tsx.
//
// Figures verified 2026-09-08 against startupdenmarkprogramme.dk (the official
// application guide: three panel members, four criteria, 3.5 average, one
// appeal only, longer evaluation over holidays) and nyidanmark.dk (Start-up
// Denmark, its extension page, the self-support amounts, the permanent-residence
// conditions). Re-checked 2026-10-27: the panel is the independent expert panel
// appointed by the Danish Business Authority; side work of 8–15 hrs/week in a
// related role is on SIRI's sideline-employment page; the digital-government
// line cites the UN E-Government Survey rankings.
//
// Two figures to re-check every January: the self-support amounts — nyidanmark
// still publishes them at 2025 level as of September 2026 — and the SIRI fees,
// which rose on 1 January 2026 (DKK 3,060 applicant / 3,080 per family member).
// The 75-permit quota is counted per person, not per team, and resets 1 January.
//
// Photos: only the Nyhavn shot (Unsplash 1513622470522) is genuinely Denmark.
// The old page's "Danish offshore wind turbines — Ørsted" was onshore turbines
// in a wheat field with nothing to place them in Denmark, and its "family"
// image was a green sofa against a white wall; both are gone.
// ============================================================================

import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from '@/routing';
import { metaFor } from '@/lib/pageMeta';
import JsonLd from '@/components/JsonLd';
import { ORGANIZATION_ID, SITE_URL, faqJsonLd } from '@/lib/seo';
import { MAIN_CONTACT } from '@/content/contact';
import ChapterVideo, { type Chapter } from '@/components/guide/ChapterVideo';
import Flag from '@/components/route/flags';
import { RouteProvider, RouteRail, RouteStop, RouteFinish, type RouteStopDef, type RouteTheme } from '@/components/route/RouteProgress';
import {
  CopyButton,
  GateQuiz,
  OpenedTracker,
  PerkOrCatch,
  PrFinder,
  StepWalker,
  type PrQuestion,
  type PrRoute,
  type RouteStep,
} from '@/components/route/RouteWidgets';
import { CitizenshipRoadmap, SelfSupportCalculator, type DenmarkRoadmapCopy, type SelfSupportRow } from './DenmarkWidgets';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/country/denmark', locale);
}

// ─── Data ────────────────────────────────────────────────────────────────────

const UPDATED = { iso: '2026-10-27', label: '27 Oct 2026' };
const PAGE_URL = `${SITE_URL}/en/country/denmark`;

// The page's own palette: Danish red on near-black. #C8102E reads at 5.16:1 on
// the paper (#F2F0E9) and 5.88:1 on white, and white on it at 5.88:1, so the
// flag red itself is the text accent. On the dark bands the red drops to about
// 3.3:1, so text there uses the lighter #FF7A8C (7.7:1 on #0a0e1a).
const THEME: RouteTheme = { accent: '#C8102E', accentInk: '#FFFFFF', accentText: '#C8102E', primary: '#0d1017', deep: '#0a0e1a', soft: '#FBE9EC', accentOnDark: '#FF7A8C' };

const STOPS: RouteStopDef[] = [
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'video', label: 'Video' },
  { id: 'gate', label: 'The panel' },
  { id: 'steps', label: '5 steps' },
  { id: 'quota', label: 'The 75 cap' },
  { id: 'money', label: 'Money' },
  { id: 'life', label: 'Life' },
  { id: 'residence', label: 'PR route' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'faq', label: 'FAQ' },
];

// The English walkthrough on @ashavidgroup, recorded June 2026. It says
// permanent residence in four years; this page says eight, four only with all
// four supplementary conditions — the note under the player says so.
const VIDEO = {
  id: '0BORlKEWXBU',
  title: 'Denmark Startup Visa Explained: Costs, Rules & PR Path',
  length: '20:58',
  seconds: 1258,
  duration: 'PT20M58S',
  uploadDate: '2026-06-30T02:04:31-07:00',
  // No maxresdefault exists for this video; sddefault is the largest served.
  poster: 'https://i.ytimg.com/vi/0BORlKEWXBU/sddefault.jpg',
  chapters: [
    { at: '01:16', label: 'Why the Denmark startup visa' },
    { at: '03:28', label: 'The 75-place quota, and innovation and scalability', highlight: true },
    { at: '06:00', label: 'The rules: 15-page deck and 5-minute video pitch', highlight: true },
    { at: '08:49', label: 'The panel, the criteria, the score', highlight: true },
    { at: '12:07', label: 'The summer holiday trap' },
    { at: '12:42', label: 'Real costs and proof of funds', highlight: true },
    { at: '15:50', label: 'Perks and the spouse’s open work permit' },
    { at: '18:05', label: 'The road to permanent residence', highlight: true },
    { at: '19:10', label: 'Final tips' },
  ] satisfies Chapter[],
};

const toSeconds = (at: string) => at.split(':').reduce((t, part) => t * 60 + Number(part), 0);

const videoJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: VIDEO.title,
  description: 'A walkthrough of Start-up Denmark: the 75-place quota, the pitch deck and video pitch, how the expert panel scores you, proof of funds, and family rights.',
  inLanguage: 'en',
  thumbnailUrl: VIDEO.poster,
  uploadDate: VIDEO.uploadDate,
  duration: VIDEO.duration,
  contentUrl: `https://www.youtube.com/watch?v=${VIDEO.id}`,
  embedUrl: `https://www.youtube-nocookie.com/embed/${VIDEO.id}`,
  publisher: { '@id': ORGANIZATION_ID },
  // Key moments: one Clip per chapter.
  hasPart: VIDEO.chapters.map((c, i) => ({
    '@type': 'Clip',
    name: c.label,
    startOffset: toSeconds(c.at),
    endOffset: i < VIDEO.chapters.length - 1 ? toSeconds(VIDEO.chapters[i + 1].at) : VIDEO.seconds,
    url: `https://www.youtube.com/watch?v=${VIDEO.id}&t=${toSeconds(c.at)}s`,
  })),
};

// The panel's four criteria. Each of three panel members scores each 1–5.
const criteria = [
  { title: 'Innovation', body: 'How novel is your product, service, or business model? It must introduce something genuinely new to the market.' },
  { title: 'Market attractiveness', body: 'How large and accessible is your target market? The panel looks for real, measurable demand.' },
  { title: 'Scalability', body: "Can your business grow rapidly beyond Denmark's borders? The program targets companies with global ambitions." },
  { title: 'Team capability', body: 'Do the founders have the skills, experience, and resources to execute the plan successfully?' },
];

const sectors = [
  { name: 'Cleantech & green energy', desc: 'Wind, water management, waste-to-energy, carbon capture.' },
  { name: 'Life sciences', desc: 'Biotech, MedTech, digital health. Home to Novo Nordisk.' },
  { name: 'AI & deep tech', desc: 'Machine learning, robotics, advanced SaaS platforms.' },
  { name: 'Fintech', desc: 'Payments, WealthTech, InsurTech, RegTech.' },
  { name: 'Design & software', desc: 'SaaS, sound technology, sustainable design.' },
  { name: 'Food tech', desc: 'Alternative proteins, agri-efficiency, food safety.' },
];

const steps: RouteStep[] = [
  {
    title: 'Check eligibility',
    who: 'You and your co-founders',
    body: 'Open to non-EU/EEA/Swiss nationals only. Apply solo or as a team of up to 3 co-founders. Each person counts individually toward the 75-person annual cap.',
    note: 'Restaurants, retail stores, and import/export agencies are explicitly excluded.',
    figure: '1–3',
    figureLabel: 'founders per team',
  },
  {
    title: 'Pitch package',
    who: 'Deck and video, in English',
    body: 'Submit two documents in English: (1) a PDF Pitch Deck (max 15 pages) covering market analysis, GTM strategy, and why Denmark; (2) a Video Pitch (max 5 minutes) personally presenting your idea, scalability, and team.',
    note: 'No language certificate required — your video pitch IS the language assessment.',
    figure: '15 pp',
    figureLabel: 'deck, plus a 5-minute video',
  },
  {
    title: 'Expert panel',
    who: 'Virk.dk · Danish Business Authority',
    body: 'Submit on Virk.dk. The Secretariat screens first — incomplete files and ineligible business types are cut here and never reach the panel. Survivors go to three members of the independent expert panel appointed by the Danish Business Authority, who each score the four criteria 1–5. You need at least a 3.5 average across all four.',
    note: 'Usually up to 6 weeks — the official guide warns it runs longer over holidays and in busy periods. No interview: the panel sees only what you submitted.',
    figure: '3.5/5',
    figureLabel: 'average to pass',
  },
  {
    title: 'SIRI residence permit',
    who: 'SIRI',
    body: 'Panel approval is not a visa — it is permission to apply for one. Generate a Case Order ID with SIRI (Danish Agency for International Recruitment and Integration), pay, upload documents, and give biometrics within 14 days of submitting. SIRI states 2 months, and up to 4 months if it needs more information.',
    note: 'Fees: DKK 3,060 (~€410) for you, DKK 3,080 (~€413) for each accompanying family member — 2026 level, raised on 1 January.',
    figure: 'DKK 3,060',
    figureLabel: 'per founder, 2026',
  },
  {
    title: 'Arrive & launch',
    who: 'CPR, MitID, CVR',
    body: 'Enter Denmark, register your CPR number, activate MitID (digital ID), and get your CVR company registration. Your initial permit is valid for up to 2 years.',
    note: 'Give up your Danish address, or stay abroad more than 6 successive months, and the permit lapses. Dispensation exists, but it is an exception, not a plan.',
    figure: '2 yrs',
    figureLabel: 'initial permit',
  },
];

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to apply for the Start-up Denmark residence permit',
  inLanguage: 'en',
  step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: `${s.body} ${s.note}`, url: `${PAGE_URL}#steps` })),
};

// Self-support, not investment: proof you can carry your own living costs,
// because the permit bars you from Active Social Policy Act benefits.
// nyidanmark still publishes these at 2025 level as of September 2026, and
// revises them each January. Euro figures at ~7.46 DKK/EUR — the ~€17,000
// conversion this page used to carry was simply wrong. SIRI's wording for the
// two child rows is "one or more children": one amount, whatever the count.
const financials: [SelfSupportRow, SelfSupportRow, SelfSupportRow, SelfSupportRow] = [
  { label: 'Single applicant', dkk: 153240, eur: '~€20,500' },
  { label: 'Applicant + spouse', dkk: 306480, eur: '~€41,100' },
  { label: 'With spouse + child(ren)', dkk: 356904, eur: '~€47,800' },
  { label: 'With child(ren), no spouse', dkk: 203664, eur: '~€27,300' },
];

const fees = [
  { label: 'Start-up Denmark residence permit — you', dkk: 'DKK 3,060', eur: '~€410', note: '2026 level, raised on 1 January' },
  { label: 'Each accompanying family member', dkk: 'DKK 3,080', eur: '~€413', note: '2026 level, raised on 1 January' },
  { label: 'Extension (up to 3 years)', dkk: 'DKK 3,060', eur: '—', note: 'File no earlier than 3 months before expiry' },
  { label: 'Danish language classes', dkk: 'Free', eur: '—', note: 'After CPR registration, age 18+' },
];

const rights = [
  { title: 'Work permit type', content: 'Closed permit — only the approved startup.', positive: false },
  { title: 'Side work', content: '8–15 hrs/week in a closely related role, with separate authorization.', positive: true },
  { title: 'Schengen travel', content: 'Up to 90 days per 180-day period in Schengen countries, but no working.', positive: true },
  { title: 'Welfare benefits', content: 'NOT eligible for Danish public welfare. Receiving any can void your permit.', positive: false },
  { title: 'Free Danish classes', content: 'After CPR registration (18+), free Danish language courses are your right.', positive: true },
  { title: 'Voluntary work', content: 'Unpaid volunteer activities are fully permitted.', positive: true },
  { title: 'Renewal', content: 'Not automatic. The expert panel must assess your business again before you may apply to extend.', positive: false },
  { title: 'Absence', content: 'More than 6 successive months abroad, or giving up your Danish address, ends the permit.', positive: false },
];

const family = [
  { title: 'Who qualifies', body: 'Spouse/registered partner + children under 18 living with you.' },
  { title: 'Open Work Permit for spouse', body: 'Full-time, any sector, no restrictions — unlike the entrepreneur\'s closed permit.' },
  { title: 'Healthcare & education', body: 'Tax-funded healthcare and public schooling once you register your CPR address.' },
  { title: 'Child benefit is phased in', body: 'The full børne- og ungeydelse normally needs 6 of the last 10 years lived or worked in Denmark or the EEA. A family that has just arrived does not get the full rate.' },
];

const quotaTips = [
  'Apply as early as possible — ideally Q1 of the calendar year.',
  'Build the summer into your timeline — the official guide says evaluation runs longer over holiday periods.',
  'Past fundraising success elsewhere does not guarantee approval. Fit with Denmark matters most.',
  'Answer "Why Denmark specifically?" clearly in every part of your submission.',
];

// The general conditions every PR route shares, from the FAQ below.
const prBase = 'Prøve i Dansk 2 or higher, 3 years 6 months of full-time work (30+ hrs/week) or self-employment in the last 4 years, no Active Social Policy or Integration Act benefits for 4 years';

const prQuestions: PrQuestion[] = [
  { key: 'danish', q: 'Highest Danish exam you expect to pass', options: ['None', 'Prøve i Dansk 2', 'Prøve i Dansk 3'] },
  { key: 'work', q: '3½ years of full-time work or self-employment in the last 4?', options: ['No', 'Yes'] },
  { key: 'extras', q: 'How many of the four supplementary conditions will you meet?', options: ['0–1', '2–3', 'All 4'] },
];

// Ordered fastest first; `needs` drives the finder.
const prRoutes: PrRoute[] = [
  {
    title: 'Fast route',
    years: 4,
    reqs: [
      '4 years of lawful residence',
      'All 4 supplementary conditions: Prøve i Dansk 3; 4 years of employment within the last 4.5; active citizenship (the exam, or a year of documented civic participation); taxable income of at least DKK 346,155.57 (2026 level) in each of the last two years',
      prBase,
      'Employment of at least 15 hrs/week when the decision is made; no disqualifying convictions or overdue public debt',
    ],
    note: 'Rarely reachable for a founder. The hours are achievable; the income figure means your company pays you a real salary, two years running.',
    needs: { danish: 2, work: 1, extras: 2 },
  },
  {
    title: 'General route',
    years: 8,
    reqs: [
      '8 years of lawful residence',
      'At least 2 of the 4 supplementary conditions',
      prBase,
      'Employment of at least 15 hrs/week when the decision is made; no disqualifying convictions or overdue public debt',
    ],
    note: '"5 years to PR" is a marketing figure, not a Danish rule. Plan for eight years, and start Danish in year one.',
    needs: { danish: 1, work: 1, extras: 1 },
  },
];

const roadmap: DenmarkRoadmapCopy = {
  prep: { title: 'Before you move', sub: 'Deck, video, panel, SIRI' },
  arrive: { title: 'Arrive', sub: 'CPR, MitID, CVR' },
  extension: { year: 2, title: 'Extension', sub: 'Panel again, up to 3 years' },
  citizenship: { residence: 9, prHeld: 2 },
  phases: {
    first: { title: 'Initial permit, up to 2 years', body: 'Launch your startup. Get your CPR, MitID, CVR. Attend free Danish classes. More than 6 successive months abroad ends the permit.' },
    extended: { title: 'Extension, up to 3 years', body: 'The panel assesses the business again, then SIRI extends. What happens after year 5 is not set out in the official sources. Permanent residence in {toPr}.' },
    resident: { title: 'Permanent resident', body: 'Via the {route}. Citizenship in {toCitizenship}: PR must have been held for at least 2 years.' },
    citizen: { title: 'Eligible to apply for citizenship', body: 'You also need Prøve i Dansk 3, the citizenship test, 4 of the last 5 years self-supporting, and the signed declaration of loyalty. Dual citizenship is allowed.' },
  },
};

const timeline = [
  { phase: 'Year 1–2', title: 'Initial Permit', desc: 'Launch your startup. Get your CPR, MitID, CVR. Attend free Danish classes.' },
  { phase: 'Year 3–5', title: '3-Year Extension', desc: 'The panel assesses the business again, then SIRI extends by up to 3 years. What happens after year 5 is not set out in the official sources — do not plan on it. Start Danish classes: you will need the exam later.' },
  { phase: 'Year 8', title: 'Permanent Residency', desc: 'Eight lawful years, Prøve i Dansk 2, 3.5 years of full-time work or self-employment, and at least 2 of the 4 supplementary conditions. Four years only if you meet all 4.' },
  { phase: 'Year 10+', title: 'Danish Passport', desc: 'Nine years of continuous residence, but you must also have held PR for 2 years, passed Prøve i Dansk 3 and the citizenship test. Dual citizenship is allowed.' },
];

const faqs = [
  {
    q: 'Is a language certificate (IELTS/TOEFL) required?',
    a: "No formal language test is required. All documents must be in English. Your 5-minute video pitch is effectively the language assessment. Danish proficiency is not required to enter the program, but classes are free once you register your CPR address.",
  },
  {
    q: 'What if my application is rejected?',
    a: 'You receive a written panel statement with individual scores for each criterion. You may (1) appeal once to the Danish Business Authority — a fresh panel reviews, and the result is final; or (2) substantially improve your plan and reapply as a new application.',
  },
  {
    q: 'Can I change my business plan after arriving?',
    a: 'Minor pivots are fine. Significant changes — including starting an entirely new business — require a new residence permit application. You must always notify SIRI of material changes. You can start working on the new business as soon as you submit the new application.',
  },
  {
    q: 'Does the DKK financial requirement need to be frozen?',
    a: 'The funds are not locked, escrowed, or paid to anyone — they stay in your account. But treat "show it, then move it out" as a risk rather than a technique. What the rule asks for is that you can support yourself and your family for the stay; SIRI can ask for further documentation, and self-support is assessed again at extension. We do not sell that shortcut as a guarantee.',
  },
  {
    q: 'Is renewal a formality?',
    a: 'No — this is the most commonly mis-sold part of the programme. Before you can apply to extend, the Danish Business Authority\'s expert panel must assess your business again, and that assessment goes in with the application. The same four criteria, this time against a real company with real numbers. You must also still run the business yourself and still support your family. Extensions run up to 3 years, cost DKK 3,060, take about 4 months (up to 5), and cannot be filed earlier than 3 months before expiry — but file on time and you may stay and work while SIRI decides.',
  },
  {
    q: 'What is the real path to Permanent Residence?',
    a: 'Eight years of lawful residence, not five — "5 years to PR" is a marketing figure, not a Danish rule. On top of the time you need: no disqualifying convictions, no overdue public debt, no Active Social Policy or Integration Act benefits for 4 years, Prøve i Dansk 2 or higher, at least 3 years and 6 months of regular full-time work (30+ hrs/week) or self-employment in the last 4 years, employment of at least 15 hrs/week when the decision is made — and at least 2 of the 4 supplementary conditions. Meet all 4 and the residence requirement drops to 4 years.',
  },
  {
    q: 'Can a founder realistically reach the 4-year fast route?',
    a: 'Rarely, and the reason is money rather than language. The four supplementary conditions are Prøve i Dansk 3; 4 years of employment within the last 4.5; active citizenship (the exam, or a year of documented civic participation); and taxable income of at least DKK 346,155.57 (2026 level) in each of the last two years. Self-employment counts as employment if it is your main occupation and supports you — so the hours are achievable. The income figure is not: it means your company pays you a real salary, two years running. A startup that has not reached profitability does not do that. Plan for eight years, and start Danish in year one.',
  },
  {
    q: 'And Danish citizenship?',
    a: 'The general residence requirement is 9 years of continuous residence, but time alone is not the gate. You must hold permanent residence and have held it for at least 2 years when you are included in the naturalisation bill, pass Prøve i Dansk 3 and the citizenship test (indfødsretsprøven), have been self-supporting for 4 of the last 5 years, and sign the declaration of loyalty. So PR is the real bottleneck: get PR in year eight and the citizenship file is not complete before year ten. Denmark has allowed dual citizenship since 2015 — you do not have to renounce another nationality, which matters if renouncing is not practically possible.',
  },
  {
    q: "Why does Denmark reject some successful startups?",
    a: "Approval is about fit with Denmark's specific needs, not past success. Startups that raised capital in other markets have been rejected while early-stage startups in priority sectors were accepted. Clearly answer 'Why Denmark specifically?' in every part of your submission.",
  },
];

// Every URL here is already cited elsewhere in the repo (lib/routes-v2,
// lib/knowledge, lib/autopilot) and returned 200 on 29 Oct 2026, except the
// Danish Business Authority root, which refuses scripted requests (403).
const sources = [
  { name: 'SIRI (nyidanmark.dk) — Start-up Denmark', href: 'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Start-up-Denmark', what: 'The permit, SIRI fees, processing times, extension and absence rules, family members.', checked: '8 Sep 2026' },
  { name: 'SIRI — Self-support', href: 'https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Self-support---SIRI/', what: 'The self-support amounts, published at 2025 level.', checked: '8 Sep 2026' },
  { name: 'SIRI — Permanent residence', href: 'https://nyidanmark.dk/en-GB/Applying/Permanent%20residence%20permit/Permanent%20residence', what: 'The eight-year rule, the general conditions and the four supplementary conditions.', checked: '8 Sep 2026' },
  { name: 'Start-up Denmark — Application guide', href: 'https://startupdenmarkprogramme.dk/application-guide-startups', what: 'Pitch deck and video, the three-member panel, four criteria, the 3.5 average, the single appeal.', checked: '8 Sep 2026' },
  { name: 'Danish Business Authority', href: 'https://danishbusinessauthority.dk/', what: 'Appoints the independent expert panel and hears the appeal.', checked: '27 Oct 2026' },
  { name: 'UN E-Government Survey', href: 'https://publicadministration.un.org/egovkb/en-us/', what: 'Denmark ranked first in 2018, 2020, 2022 and 2024.', checked: '27 Oct 2026' },
];

// Three guides, one per stage of the move. Curated rather than queried so the
// page stays static; swap a slug here if an article is withdrawn. Checked on
// 29 Oct 2026: each returns 200 and the title, date, read time and cover below
// are the article's own.
const reads = [
  {
    slug: 'startup-denmark-vs-danish-work-permit-comparison',
    stage: 'Before you apply',
    title: 'Choosing between Startup Denmark and a Danish work permit',
    excerpt: 'Eligibility, application steps, business-plan demands, employer sponsorship and family rights, side by side.',
    date: { iso: '2026-09-07', label: '7 Sep 2026' },
    minutes: 10,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/09/9393049b94d5fc7a1ee538e2ed997e9d.jpg',
  },
  {
    slug: 'danish-residence-card-after-startup-denmark-approval',
    stage: 'After approval',
    title: 'How to obtain a Danish residence card after Startup Denmark approval',
    excerpt: 'A document-by-document guide to the residence card: the process, timelines and pitfalls before you arrive.',
    date: { iso: '2026-09-09', label: '9 Sep 2026' },
    minutes: 7,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/09/0c0e5a6dd82e31ea2b6328bc302a750b.jpg',
  },
  {
    slug: 'mapping-denmark-startup-ecosystem-founders-professionals',
    stage: 'Building in Denmark',
    title: 'Mapping Denmark’s startup ecosystem for founders and professionals',
    excerpt: 'Sector insights, investor profiles and practical steps for non-EU founders weighing Denmark as a landing point.',
    date: { iso: '2026-09-18', label: '18 Sep 2026' },
    minutes: 13,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/09/fa9e4654ec0450eff937aa460de44387.jpg',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

const dkk = (n: number) => `DKK ${n.toLocaleString('en')}`;
const label = 'font-sans text-xs font-bold uppercase tracking-[0.18em]';

// setRequestLocale before the first <Link>: without it next-intl reads
// headers(), Next renders the route dynamically and streams <title> and
// the meta tags into <body> instead of <head>.
export default async function DenmarkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="w-full overflow-x-clip bg-[#F2F0E9] text-[#1a1a1a]">
      <JsonLd data={[videoJsonLd, howToJsonLd, faqJsonLd(faqs.map((f) => ({ question: f.q, answer: f.a })), 'en')]} />

      <RouteProvider stops={STOPS} flag="dk" theme={THEME}>
        {/* ── Hero: the answer up front ── */}
        <header className="relative overflow-hidden bg-[#0a0e1a] text-white">
          <Image
            src="https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=1800&q=80&auto=format&fit=crop"
            alt="Nyhavn canal in Copenhagen: colourful gabled townhouses and moored wooden boats under an evening sky"
            fill
            priority
            unoptimized
            className="object-cover object-[center_45%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/95 via-[#0a0e1a]/80 to-[#0a0e1a]/35" />
          {/* Danish cross at the flag's own proportions (37:28). */}
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-12 aspect-[37/28] w-[540px] opacity-10">
            <span className="absolute left-[32.43%] top-0 h-full w-[10.81%] bg-white" />
            <span className="absolute left-0 top-[42.86%] h-[14.29%] w-full bg-white" />
          </div>

          <div className="container relative mx-auto grid grid-cols-1 items-end gap-8 px-6 pb-12 pt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <nav aria-label="Breadcrumb" className="font-sans text-xs text-white/60 lg:col-span-2">
              <ol className="flex flex-wrap gap-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link href="/country" className="hover:text-white">Countries</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-white/85">Denmark</li>
              </ol>
            </nav>

            <div>
              <div className={`mb-5 flex items-center gap-3 text-white/75 ${label}`}>
                <Flag code="dk" uid="hero" width={36} />
                Startup Denmark · Non-EU founder visa
              </div>
              <h1>
                <span className="block font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.02em]">
                  Denmark <em className="text-[#FF7A8C]">Startup.</em>
                </span>
                <span className="mt-4 block max-w-[46ch] font-sans text-lg font-medium leading-snug">
                  The Denmark startup visa (Start-up Denmark) in 2026, step by step
                </span>
              </h1>
              <p className="mt-3 max-w-[56ch] font-sans text-base leading-relaxed text-white/70">
                75 permits a year, decided not by an immigration officer but by an independent panel of Danish business experts, with no minimum
                investment and an open work permit for your spouse. The catches: renewal means a second panel assessment, and permanent residence takes
                eight years, not five.
              </p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-white/60">
                <span>By <span className="text-white">Farjad P.D</span></span>
                <span>Updated <time dateTime={UPDATED.iso} className="text-white">{UPDATED.label}</time></span>
                <span>Figures checked against SIRI (nyidanmark.dk), the Start-up Denmark application guide and the Danish Business Authority</span>
              </p>
              <p className="mt-5 max-w-[60ch] border-l-2 border-[#FF7A8C] pl-3 font-sans text-sm text-white/70">
                <strong className="text-white">The figures move every January.</strong> SIRI&apos;s fees rose on 1 January 2026; its self-support
                amounts are still published at the 2025 level.
              </p>
            </div>

            <aside aria-label="How to use this page" className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <p className={`text-[#FF7A8C] ${label}`}>Your route through this page</p>
              <ol className="my-4 list-decimal space-y-1 pl-5 font-sans text-sm text-white/75">
                <li>Score your startup on the panel&apos;s four criteria</li>
                <li>Walk the five steps</li>
                <li>Time your file against the 75-person cap</li>
                <li>Work out your self-support and fees</li>
                <li>Sort perks from catches</li>
                <li>Map your road to a Danish passport</li>
              </ol>
              <a href="#gate" className="inline-flex items-center gap-2 rounded-full bg-[#C8102E] px-5 py-3 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
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
          question="What is the Denmark startup visa?"
          task="Read the four facts"
          completeOn="view"
          message="Snapshot read"
          answer={
            <p>
              The Denmark startup visa is Start-up Denmark, a government-run route for non-EU founders. An independent expert panel appointed by the
              Danish Business Authority scores your pitch deck and video; with approval you apply to SIRI for a permit of up to two years. There is no
              minimum investment, and only 75 permits a year, counted per person.
            </p>
          }
        >
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { stat: '75', label: 'Visas per year', sub: 'per person, not per team' },
              { stat: '2 yrs', label: 'Initial permit', sub: 'extendable up to 3 yrs' },
              { stat: '3.5/5', label: 'Panel pass mark', sub: 'average across 4 criteria' },
              { stat: '8 yrs', label: 'To permanent residence', sub: '4 only with all four extras' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white p-5 transition-transform hover:-translate-y-1">
                <dt className="order-2 mt-2 font-sans text-sm font-bold">{s.label}</dt>
                <dd className="order-1 font-serif text-4xl text-[#C8102E]">{s.stat}</dd>
                <dd className="order-3 font-sans text-xs text-[#1a1a1a]/55">{s.sub}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 grid max-w-5xl grid-cols-1 gap-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-serif text-xl text-[#1a1a1a]">The world&apos;s most digital nation</h3>
              <p>
                Denmark ranked first in the UN E-Government Survey in 2018, 2020, 2022 and 2024, and you register a company online through Virk.
                The <strong className="text-[#1a1a1a]">Startup Denmark</strong> program is a nationally managed pathway for non-EU entrepreneurs
                building innovative, scalable businesses here.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-serif text-xl text-[#1a1a1a]">Judged on merit, not money</h3>
              <p>
                Unlike investment-based visas, there is no minimum capital requirement. Your idea is evaluated by a panel of Danish business experts on
                its innovation, market potential, scalability, and your team&apos;s capability. Panel approval is not a visa: it is permission to apply
                to SIRI for one.
              </p>
            </div>
          </div>
        </RouteStop>

        {/* 02 — Video */}
        <ChapterVideo
          sectionId="video"
          checkpoint="video"
          theme="route"
          id={VIDEO.id}
          title={VIDEO.title}
          length={VIDEO.length}
          poster={VIDEO.poster}
          chapters={VIDEO.chapters}
          eyebrow="02 · The 21-minute briefing"
          heading={<>What does the Start-up Denmark <span className="italic text-[#FF7A8C]">video guide</span> cover?</>}
          intro="The 75-person quota, the 15-page deck and 5-minute video pitch, how the panel scores you, the summer trap and the real cost. Pick a chapter to jump straight to it."
          note={<>Recorded June 2026. The video&apos;s &ldquo;PR in 4 years&rdquo; is the fast route, open only if you meet all four supplementary conditions; the general rule is eight years. The figures on this page are the current ones.</>}
          channel={{ handle: MAIN_CONTACT.youtubeHandle, url: MAIN_CONTACT.youtube }}
        />

        {/* 03 — Who qualifies */}
        <RouteStop
          id="gate"
          number={3}
          eyebrow="How you are judged"
          question="Who qualifies for the Start-up Denmark visa?"
          task="Answer all four"
          answer={
            <p>
              Non-EU/EEA/Swiss founders, solo or in a team of up to three, with an innovative, scalable business. Three panel members each score
              innovation, market attractiveness, scalability and team capability from 1 to 5, and you need at least a 3.5 average. There is no
              interview, and restaurants, retail stores and import/export agencies are excluded outright.
            </p>
          }
        >
          <GateQuiz
            stopId="gate"
            criteria={criteria}
            gapNote="If you are rejected you get the panel's scores per criterion, and may appeal once or reapply with a substantially improved plan."
          >
            <h3 className="font-serif text-xl">How the panel scores you</h3>
            <dl className="grid grid-cols-3 gap-2 text-center font-sans">
              {[
                ['3', 'panel members'],
                ['4', 'criteria, each 1–5'],
                ['3.5', 'average to pass'],
              ].map(([n, t]) => (
                <div key={t} className="flex flex-col rounded-xl bg-[#F2F0E9] px-2 py-3">
                  <dt className="order-2 text-[11px] text-[#1a1a1a]/60">{t}</dt>
                  <dd className="font-serif text-3xl tabular-nums text-[#C8102E]">{n}</dd>
                </div>
              ))}
            </dl>
            <p className="font-sans text-sm text-[#1a1a1a]/65">
              There is no interview. The panel works exclusively from your pitch deck and video.
            </p>
            <Link href="/book-meeting" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#C8102E] px-5 py-3 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
              Get a free read on your file <ArrowRight className="h-4 w-4" />
            </Link>
          </GateQuiz>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="grid content-start gap-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              <div>
                <h3 className="mb-2 font-serif text-xl text-[#1a1a1a]">Who can apply</h3>
                <ul className="grid list-disc gap-1.5 pl-5">
                  <li>Non-EU/EEA/Swiss nationals only.</li>
                  <li>Solo or as a team of up to 3 co-founders; each person counts individually toward the 75-person annual cap.</li>
                  <li>Restaurants, retail stores, and import/export agencies are explicitly excluded.</li>
                  <li>No language certificate: all documents are in English, and your 5-minute video pitch is the language assessment.</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-[#0d1017] p-6 text-white">
                <h3 className="mb-1 font-sans text-sm font-bold">If rejected</h3>
                <p className="text-sm text-white/65">
                  You receive a written panel statement with individual scores. You may appeal once to the Danish Business Authority (new panel, final
                  decision), or substantially improve your plan and reapply as a fresh application.
                </p>
              </div>
            </div>
            <div>
              <h3 className="mb-1 font-serif text-xl">Priority sectors: where Denmark wants to grow</h3>
              <p className="mb-3 font-sans text-sm leading-relaxed text-[#1a1a1a]/65">
                The Expert Panel is more favorably inclined toward businesses that address Denmark&apos;s national economic priorities. Pitching in
                these areas gives a strategic advantage — though exceptional ideas in other sectors can still succeed.
              </p>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {sectors.map((s) => (
                  <li key={s.name} className="rounded-xl border border-[#1a1a1a]/10 bg-white px-4 py-3">
                    <b className="block font-sans text-sm">{s.name}</b>
                    <span className="font-sans text-xs text-[#1a1a1a]/60">{s.desc}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-sans text-xs text-[#1a1a1a]/55">Priority sector: home to Vestas &amp; Ørsted. The world&apos;s green energy capital.</p>
            </div>
          </div>
        </RouteStop>

        {/* 04 — How to apply */}
        <RouteStop
          id="steps"
          number={4}
          tone="white"
          eyebrow="The process"
          question="How do you apply for the Start-up Denmark visa?"
          task="Walk to step 5"
          answer={
            <p>
              Check you are eligible, then submit a pitch deck of up to 15 pages and a video pitch of up to five minutes on Virk.dk. The panel usually
              takes up to six weeks. With approval, apply to SIRI, pay DKK 3,060 and give biometrics within 14 days; SIRI states two months. Then
              register your CPR, MitID and CVR.
            </p>
          }
        >
          <StepWalker stopId="steps" steps={steps} />
          <p className="mt-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            From eligibility check to registering your company in Copenhagen. Based on official Startup Denmark, SIRI, and Danish Business Authority
            guidelines.
          </p>
        </RouteStop>

        {/* 05 — The quota */}
        <RouteStop
          id="quota"
          number={5}
          eyebrow="Timing is everything"
          question="How does the 75-person Start-up Denmark quota work?"
          task="Read the four timing rules"
          completeOn="view"
          message="Quota understood"
          answer={
            <p>
              Denmark grants 75 Start-up Denmark permits a year, and the cap is counted per person, not per team: a three-founder team uses three of
              the 75. The count resets on 1 January, and evaluation runs longer over holidays and busy periods, so apply as early as possible, ideally
              in the first quarter.
            </p>
          }
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div>
              <p className="mb-6 max-w-[60ch] font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
                The cap applies per <em>person</em>, not per team. A 3-founder team uses 3 of the 75 slots, and the count resets on 1 January — so a
                team that applies late in the year is competing for what is left.
              </p>
              <ul className="grid gap-3">
                {quotaTips.map((tip, i) => (
                  <li key={tip} className="flex items-start gap-4 rounded-xl border border-[#1a1a1a]/10 bg-white p-4">
                    <span className="font-serif text-xl tabular-nums text-[#C8102E]">{i + 1}</span>
                    <p className="font-sans text-sm text-[#1a1a1a]/70">{tip}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-5 max-w-[64ch] rounded-xl border border-[#B4531A]/25 bg-[#FBEBDD] p-4 font-sans text-sm leading-relaxed text-[#1a1a1a]/75">
                <strong className="text-[#1a1a1a]">Timing:</strong> The panel&apos;s own guide says evaluation takes longer over holidays and in periods
                of high caseload — the panel is not sitting through the Danish summer. The 75-person cap resets 1 January and is counted per person, so
                apply in Q1 if your material is ready.
              </p>
            </div>
            <figure className="relative mx-auto flex aspect-square w-full max-w-sm flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#C8102E] text-white">
              <span aria-hidden="true" className="absolute left-[32.43%] top-0 h-full w-[10.81%] bg-white/10" />
              <span aria-hidden="true" className="absolute left-0 top-[42.86%] h-[14.29%] w-full bg-white/10" />
              <p className="relative font-serif text-[8rem] font-bold leading-none tabular-nums">75</p>
              <figcaption className="relative mt-2 px-8 text-center font-sans text-sm uppercase tracking-[0.2em] text-white/85">
                permits · per year
                <span className="mt-3 block text-[11px] normal-case tracking-normal text-white/75">Counted per person — a 3-founder team takes 3 slots</span>
              </figcaption>
            </figure>
          </div>
        </RouteStop>

        {/* 06 — Money */}
        <RouteStop
          id="money"
          number={6}
          tone="white"
          eyebrow="Self-support · SIRI figures"
          question="How much money do you need for the Start-up Denmark visa?"
          task="Set up your family"
          answer={
            <p>
              There is no minimum investment. Instead you document self-support: DKK 153,240 (about €20,500) as a single applicant, DKK 306,480 with a
              spouse, DKK 356,904 with a spouse and children, or DKK 203,664 with children and no spouse. SIRI&apos;s fee is DKK 3,060 for you and DKK
              3,080 for each family member.
            </p>
          }
        >
          <SelfSupportCalculator stopId="money" rows={financials} fees={{ founder: 3060, family: 3080 }} />

          <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] overflow-hidden rounded-2xl bg-[#F2F0E9] font-sans text-sm">
                <caption className="pb-2 text-left font-bold">Self-support to document, 2025 level (SIRI)</caption>
                <thead>
                  <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                    <th scope="col" className="px-4 py-3">Household</th>
                    <th scope="col" className="px-4 py-3">DKK</th>
                    <th scope="col" className="px-4 py-3">Approx. EUR</th>
                  </tr>
                </thead>
                <tbody>
                  {financials.map((f) => (
                    <tr key={f.label} className="border-b border-[#1a1a1a]/10 last:border-0">
                      <th scope="row" className="px-4 py-3 text-left font-normal">{f.label}</th>
                      <td className="px-4 py-3 tabular-nums">{dkk(f.dkk)}</td>
                      <td className="px-4 py-3 tabular-nums text-[#1a1a1a]/65">{f.eur}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 font-sans text-xs text-[#1a1a1a]/55">
                nyidanmark.dk still publishes these at the 2025 level and revises them each January.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] overflow-hidden rounded-2xl bg-[#F2F0E9] font-sans text-sm">
                <caption className="pb-2 text-left font-bold">Government fees (SIRI) and free services</caption>
                <thead>
                  <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                    <th scope="col" className="px-4 py-3">Item</th>
                    <th scope="col" className="px-4 py-3">DKK</th>
                    <th scope="col" className="px-4 py-3">Approx. EUR</th>
                    <th scope="col" className="px-4 py-3">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f) => (
                    <tr key={f.label} className="border-b border-[#1a1a1a]/10 last:border-0">
                      <th scope="row" className="px-4 py-3 text-left font-normal">{f.label}</th>
                      <td className="px-4 py-3 tabular-nums">{f.dkk}</td>
                      <td className="px-4 py-3 tabular-nums text-[#1a1a1a]/65">{f.eur}</td>
                      <td className="px-4 py-3 text-xs text-[#1a1a1a]/60">{f.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 grid max-w-5xl grid-cols-1 gap-4 font-sans text-sm leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            <p>
              <strong className="text-[#1a1a1a]">Proof of funds.</strong> Show you can support yourself, and any family who come with you, for the first
              year. A bank statement in your name, with the currency, date and account holder on it, is the usual evidence. The money is not frozen or
              paid to anyone, but it is there to live on: SIRI can ask for more documentation, and self-support is assessed again at extension.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">Budget beyond the minimum:</strong> the figures above are SIRI&apos;s floor, not a Copenhagen budget —
              rent there is the largest cost and runs well above the national average. Government fee DKK 3,060 (~€410) per founder · Danish language
              classes: free after CPR registration.
            </p>
          </div>
        </RouteStop>

        {/* 07 — Rights */}
        <RouteStop
          id="life"
          number={7}
          eyebrow="Perk or catch?"
          question="What rights does the Start-up Denmark permit give you and your family?"
          task="Guess all eight"
          answer={
            <p>
              Your own permit is closed: you may work only in the approved startup, plus 8–15 hours a week of related side work with separate
              authorization. Your spouse gets an open work permit. You get free Danish classes and Schengen travel, but no public welfare, and more
              than six successive months abroad ends the permit.
            </p>
          }
        >
          <PerkOrCatch stopId="life" items={rights} />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <div className="font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              <h3 className="mb-2 font-serif text-2xl text-[#1a1a1a]">Your family gets more freedom than you do</h3>
              <p>
                Your spouse/registered partner and children under 18 can join you with their own residence permits — and crucially, your spouse
                receives an <strong className="text-[#1a1a1a]">Open Work Permit</strong>, meaning they can work full-time in any job without
                restrictions. The Startup Denmark permit is a <strong className="text-[#1a1a1a]">closed work permit</strong>; understanding what you
                can and cannot do helps you plan your first two years correctly.
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {family.map((f) => (
                <li key={f.title} className="rounded-xl border border-[#1a1a1a]/10 bg-white p-4">
                  <h4 className="font-sans text-sm font-bold">{f.title}</h4>
                  <p className="mt-1 font-sans text-sm text-[#1a1a1a]/65">{f.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </RouteStop>

        {/* 08 — Permanent residence */}
        <RouteStop
          id="residence"
          number={8}
          tone="white"
          eyebrow="Permanent residence"
          question="How do you get permanent residence in Denmark after Start-up Denmark?"
          task="Find your fastest route"
          answer={
            <p>
              Plan on eight years of lawful residence, not five. You also need Prøve i Dansk 2, three and a half years of full-time work or
              self-employment in the last four, no Active Social Policy or Integration Act benefits for four years, and at least two of four
              supplementary conditions. Meet all four and the residence requirement drops to four years.
            </p>
          }
        >
          <PrFinder stopId="residence" questions={prQuestions} routes={prRoutes} />
          <p className="mt-4 max-w-[72ch] font-sans text-xs text-[#1a1a1a]/55">
            The four supplementary conditions: Prøve i Dansk 3; 4 years of employment within the last 4.5; active citizenship (the exam, or a year of
            documented civic participation); and taxable income of at least DKK 346,155.57 (2026 level) in each of the last two years. Self-employment
            counts as employment if it is your main occupation and supports you.
          </p>
        </RouteStop>

        {/* 09 — Roadmap */}
        <RouteStop
          id="roadmap"
          number={9}
          eyebrow="Long-term vision"
          question="How long does it take to get Danish citizenship through Start-up Denmark?"
          task="Drag yourself through the years"
          answer={
            <p>
              On the general route, ten years or more. Citizenship needs nine years of continuous residence, permanent residence held for at least
              two years, Prøve i Dansk 3, the citizenship test, and self-support for four of the last five years. Get PR in year eight and the file is
              not complete before year ten.
            </p>
          }
        >
          <CitizenshipRoadmap stopId="roadmap" routes={prRoutes} defaultRoute={1} copy={roadmap} />
          <ol className="mt-6 grid grid-cols-1 gap-4 font-sans text-sm text-[#1a1a1a]/65 sm:grid-cols-2 lg:grid-cols-4">
            {timeline.map((p) => (
              <li key={p.phase} className="border-t-2 border-[#1a1a1a]/10 pt-2">
                <span className="block text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">{p.phase}</span>
                <b className="block font-serif text-lg font-normal text-[#1a1a1a]">{p.title}</b>
                {p.desc}
              </li>
            ))}
          </ol>
          <div className="mt-8 max-w-3xl rounded-2xl bg-[#0d1017] p-6 font-sans text-sm leading-relaxed text-white/75">
            <h3 className="mb-2 font-serif text-2xl text-white">Danish citizenship</h3>
            <p>
              The general residence requirement is <strong className="text-white">9 years</strong> of continuous residence, and you must have held
              permanent residence for at least <strong className="text-white">2 years</strong> when you are included in the naturalisation bill. You
              also pass Prøve i Dansk 3 and the citizenship test (indfødsretsprøven), have been self-supporting for 4 of the last 5 years, and sign the
              declaration of loyalty. Denmark has allowed dual citizenship since 2015. PR, not the calendar, is the bottleneck on this path.
            </p>
          </div>
        </RouteStop>

        {/* 10 — FAQ */}
        <RouteStop
          id="faq"
          number={10}
          tone="white"
          eyebrow="Common questions"
          question="Denmark startup visa: frequently asked questions"
          task="Open three answers"
          answer={<p>Nine answers, from language tests and rejections to whether renewal is a formality, the real path to permanent residence and Danish citizenship.</p>}
        >
          <FaqGroups />
          <OpenedTracker stopId="faq" need={3} message="Questions answered" />
        </RouteStop>

        {/* Sources */}
        <section aria-labelledby="sources-h" className="border-b border-[#1a1a1a]/10 bg-[#F2F0E9] px-6 py-14">
          <div className="container mx-auto">
            <p className={`text-[#C8102E] ${label}`}>Where these figures come from</p>
            <h2 id="sources-h" className="mt-2 font-serif text-3xl">Sources</h2>
            <ol className="mt-6 grid max-w-4xl list-decimal gap-2 pl-5 font-sans text-sm">
              {sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-bold underline decoration-[#C8102E] underline-offset-2 hover:text-[#C8102E]">
                    {s.name}
                  </a>{' '}
                  <span className="text-[#1a1a1a]/60">{s.what} Checked {s.checked}.</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Book a session */}
        <section id="book" aria-labelledby="book-h" className="scroll-mt-32 bg-[#0a0e1a] px-6 py-16 text-white">
          <div className="container mx-auto grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <div>
              <RouteFinish />
              <p className={`text-[#FF7A8C] ${label}`}>Talk it through</p>
              <h2 id="book-h" className="mt-2 font-serif text-4xl leading-tight">
                Bring your pitch to a <span className="italic text-[#FF7A8C]">free session.</span>
              </h2>
              <p className="mt-3 max-w-[52ch] font-sans text-white/70">
                Pick a time, come prepared, and get an honest read on your concept against the expert panel&apos;s four criteria, your deck and video,
                and whether Denmark is the right route. If it isn&apos;t, we&apos;ll say so.
              </p>
              <ul className="my-5 flex flex-wrap gap-2 font-sans text-xs">
                {['Free · 60 minutes', 'Online, Google Meet', 'Link sent after booking'].map((p) => (
                  <li key={p} className="rounded-full border border-white/25 px-3 py-1.5">{p}</li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/book-meeting" className="inline-flex items-center gap-2 rounded-full bg-[#C8102E] px-6 py-3.5 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
                  Book a free session <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/country" className="font-sans text-sm text-white/70 underline underline-offset-4 hover:text-white">
                  Compare jurisdictions
                </Link>
              </div>
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
                <p className={`text-[#C8102E] ${label}`}>Keep reading</p>
                <h2 id="reads-h" className="mt-2 font-serif text-3xl md:text-4xl">More Denmark guides</h2>
              </div>
              <Link href="/blog/category/denmark" className="inline-flex items-center gap-1.5 font-sans text-sm font-bold text-[#C8102E] hover:underline">
                All Denmark articles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="grid snap-x snap-mandatory auto-cols-[82%] grid-flow-col gap-4 overflow-x-auto pb-2 md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:overflow-visible">
              {reads.map((r) => (
                <li key={r.slug} className="group snap-start overflow-hidden rounded-2xl border border-[#1a1a1a]/10 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0a0e1a]/10">
                  <Link href={`/blog/${r.slug}`} className="block">
                    <span className="relative block aspect-video overflow-hidden">
                      <Image src={r.cover} alt="" fill sizes="(min-width: 768px) 33vw, 82vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </span>
                    <span className="grid gap-2 p-5">
                      <span className={`text-[#C8102E] ${label}`}>{r.stage}</span>
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

      {/* Disclaimer — kept verbatim */}
      <section className="border-t border-[#1a1a1a]/10 bg-[#F9F9F9] px-6 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#1a1a1a]/30" />
            <p className="font-sans text-[11px] leading-relaxed text-[#1a1a1a]/45">
              <strong>Regulatory Notice:</strong> All information is sourced from official Startup
              Denmark, SIRI, and Danish Business Authority documentation and is provided for
              informational purposes only. VisaRoads Inc., an Ashavid company, is a strategic business advisory firm — we
              are <span className="underline">NOT</span> an immigration law firm or recruitment agency.
              Panel approval does not guarantee a residence permit; final decisions rest solely with SIRI.
              Financial thresholds are subject to annual revision — always verify current figures at{' '}
              <a href="https://www.nyidanmark.dk" target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-[#C8102E]">nyidanmark.dk</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqGroups() {
  const pick = (...qs: string[]) => qs.map((q) => faqs.find((f) => f.q === q)!).filter(Boolean);
  const groups = [
    {
      heading: 'Applying',
      items: pick('Is a language certificate (IELTS/TOEFL) required?', 'What if my application is rejected?', 'Why does Denmark reject some successful startups?'),
    },
    {
      heading: 'Living on the permit',
      items: pick('Does the DKK financial requirement need to be frozen?', 'Can I change my business plan after arriving?', 'Is renewal a formality?'),
    },
    {
      heading: 'Permanent residence and citizenship',
      items: pick('What is the real path to Permanent Residence?', 'Can a founder realistically reach the 4-year fast route?', 'And Danish citizenship?'),
    },
  ];
  return (
    <div className="grid max-w-4xl gap-12">
      {groups.map((g) => (
        <div key={g.heading}>
          <h3 className={`mb-2 text-[#C8102E] ${label}`}>{g.heading}</h3>
          <div className="border-t border-[#1a1a1a]/10">
            {g.items.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-[#1a1a1a]/10" data-faq>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 transition-colors hover:text-[#C8102E] group-open:text-[#C8102E] [&::-webkit-details-marker]:hidden">
        <h4 className="font-serif text-xl leading-snug">{q}</h4>
        <span aria-hidden="true" className="font-serif text-2xl transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="max-w-[72ch] pb-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/65">{a}</p>
    </details>
  );
}
