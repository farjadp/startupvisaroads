// ============================================================================
// Page: app/[locale]/(public)/country/finland/page.tsx
// Layout: a guided route. A compact aurora hero, a sticky rail whose Finnish
// flag rises as the reader completes each stop, and one stop per question
// people actually search. Every stop opens with its question as the H2 and a
// ~50-word direct answer (the passage answer engines quote), then the detail:
// real tables, ordered lists, and a small game on top. All copy is rendered
// on the server, so crawlers and AI engines read the whole page.
//
// Figures verified 2026-09-08 against migri.fi (start-up entrepreneur, income
// requirement, processing fees, permanent residence permit, period of
// residence), valtioneuvosto.fi (the 2026 permit reform) and the Ministry of
// Economic Affairs and Employment working-group report TEM 2025:36 — the
// source of the approval-rate and post-issuance-supervision numbers. Note the
// two supervision denominators: a cancellation review opens on 22% of permits
// issued; 71% is the share of decided reviews that end in cancellation.
// Income thresholds and Migri fees are revised every January; re-check both.
//
// Re-checked 2026-10-27: Business Finland's startup-permit page ("at least 60%
// holding"); the Government's 2024 release on the 8/5-year citizenship period;
// Migri's notices on the 17 Dec 2025 financial-resources rule and the citizenship
// test (applications filed on or after 1 March 2027). Extension approval is
// computed from TEM 2025:36: 113/141 in 2024, 62/95 to Sep 2025.
//
// Photos: only two Unsplash images here are genuinely Finland (the aurora and
// Helsinki Cathedral). The old page's "Scandinavian lifestyle" shot was a
// Canadian lodge, and two other Unsplash IDs now return 404.
// ============================================================================

import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
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
  ApprovalDots,
  AuroraCanvas,
  OpenedTracker,
  CopyButton,
  FundsCalculator,
  GateQuiz,
  ParallaxLayer,
  PerkOrCatch,
  PrFinder,
  StepWalker,
  YearsRoadmap,
  type FundsTable,
  type PrQuestion,
  type PrRoute,
  type RoadmapCopy,
  type RouteStep,
} from '@/components/route/RouteWidgets';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/country/finland', locale);
}

// ─── Data ────────────────────────────────────────────────────────────────────

const UPDATED = { iso: '2026-10-27', label: '27 Oct 2026' };
const PAGE_URL = `${SITE_URL}/en/country/finland`;

// Finnish blue for figures, the site's teal for highlights.
const THEME: RouteTheme = { accent: '#00BFA5', accentInk: '#00261F', accentText: '#00796B', primary: '#002F6C', deep: '#001B3D', soft: '#DDF4EF' };

const STOPS: RouteStopDef[] = [
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'video', label: 'Video' },
  { id: 'gate', label: 'The gate' },
  { id: 'steps', label: '5 steps' },
  { id: 'money', label: 'Money' },
  { id: 'life', label: 'Life' },
  { id: 'residence', label: 'PR route' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'faq', label: 'FAQ' },
];

// The English walkthrough on @ashavidgroup. The Persian one (UyEsOpfswjk on
// @FarjadTalks) belongs to /fa/europe/finland, never to this page.
const VIDEO = {
  id: 'onSFM-LkXxU',
  title: 'How to Get the Finland Startup Visa in 2026: Ultimate Guide',
  length: '34:42',
  seconds: 2082,
  uploadDate: '2026-06-17T20:30:55-07:00',
  duration: 'PT34M42S',
  poster: 'https://i.ytimg.com/vi/onSFM-LkXxU/maxresdefault.jpg',
  // From the video's own description.
  chapters: [
    { at: '00:00', label: 'Introduction and the Finland opportunity' },
    { at: '00:40', label: 'Who am I?' },
    { at: '02:25', label: 'What this video covers' },
    { at: '03:10', label: 'Disclaimer' },
    { at: '04:20', label: 'Startup permit vs. standard entrepreneur permit' },
    { at: '06:56', label: 'Step 1: the Business Finland gate', highlight: true },
    { at: '07:40', label: 'Requirements and the 60% equity rule', highlight: true },
    { at: '10:40', label: 'The zero-to-100 timeline', highlight: true },
    { at: '13:20', label: 'The extended permit' },
    { at: '14:20', label: '2026 costs and personal proof of funds', highlight: true },
    { at: '17:40', label: 'Four red flags that get you rejected', highlight: true },
    { at: '21:20', label: 'The Finnish ecosystem' },
    { at: '22:50', label: 'How to apply' },
    { at: '29:08', label: 'FAQ' },
    { at: '32:32', label: 'Final thing' },
  ] satisfies Chapter[],
};

const toSeconds = (at: string) => at.split(':').reduce((t, part) => t * 60 + Number(part), 0);

const videoJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: VIDEO.title,
  description: 'A walkthrough of the Finnish start-up entrepreneur permit: Business Finland\'s Eligibility Statement, the Migri Fast Track, family rights and the routes to permanent residence.',
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

const criteria = [
  { title: 'Innovation', body: 'A clear competitive advantage in international markets. Business Finland applies broadly the same test it uses for its Tempo funding — novelty and new value, not immediate profitability.' },
  { title: 'International demand', body: 'Real demand potential outside Finland, with a defined go-to-market strategy and customer segments. A profitable local consultancy, shop or restaurant is rejected.' },
  { title: 'Founder team', body: 'At least two founders holding at least 60% of the company between them, both working full-time on it with no side jobs, with complementary skills. Solo founders are effectively out.' },
  { title: 'Funding for year one', body: 'Access to enough money to run the early stage. Finland sets no statutory minimum — unlike Austria (€30k), France (€30k) or Italy (€50k) — but you must budget year one and show where the money comes from.' },
];

const sectors = [
  { name: 'Gaming', desc: 'Home to Supercell, Rovio, Remedy. A massive ecosystem for game devs.' },
  { name: 'Connectivity & 6G', desc: 'Nokia\'s heritage lives on. Deep tech in telecom and quantum computing.' },
  { name: 'Clean energy', desc: 'Smart grids, bio-economy, battery technology, and sustainable materials.' },
  { name: 'Health tech', desc: 'Digital health records, genomics, and personalized medicine.' },
  { name: 'Deep tech & AI', desc: 'Strong academic-industry collaboration in AI and machine learning.' },
  { name: 'EduTech', desc: 'Leveraging Finland\'s reputation as a global leader in education.' },
];

const steps: RouteStep[] = [
  {
    title: 'Eligibility Statement',
    who: 'Business Finland',
    body: 'Apply to Business Finland for a positive Eligibility Statement. You submit a full business plan in English: market need, competitor analysis, go-to-market strategy, revenue model, first-year work and budget plan, founder CVs and evidence of traction. Business Finland does not normally interview you — it judges the written file.',
    note: 'Free today. The statement is valid for 4 months, and your Migri application must be filed inside that window.',
    figure: 'Free',
    figureLabel: 'today',
  },
  {
    title: 'Residence permit',
    who: 'Enter Finland',
    body: 'With a positive statement, each founder files a separate first residence permit application in Enter Finland. The first permit must be applied for from outside Finland. Migri does not re-judge your business — it checks the general conditions and your personal means of support.',
    note: '€800 on paper. Family members file their own applications alongside yours.',
    figure: '€650',
    figureLabel: 'online, per founder',
  },
  {
    title: 'Identification',
    who: 'Fast Track',
    body: 'Visit a Finnish mission or a VFS Global service point within the deadline Migri gives you, show your passport and give fingerprints. Once the application is complete and identification is done, the Fast Track service targets a decision in about two weeks.',
    note: 'The two weeks run from a complete file — not from the day you decide to apply.',
    figure: '~2 wk',
    figureLabel: 'to a decision',
  },
  {
    title: 'D visa',
    who: 'Optional, recommended',
    body: 'Apply for a D visa at the same time as the permit. On a positive decision you can fly to Finland immediately and collect the physical residence permit card inside the country, instead of waiting for it abroad.',
    note: '€120 on paper, per person. The D visa is valid for 100 days.',
    figure: '€95',
    figureLabel: 'online, per person',
  },
  {
    title: 'Arrive & register',
    who: 'DVV and PRH',
    body: 'Enter Finland, register your municipality of residence with the Digital and Population Data Services Agency (DVV), and register the company with the PRH (Finnish Patent and Registration Office) if you have not already.',
    note: 'First permit is issued for up to 2 years; the extended permit for up to 4 more.',
    figure: '2 + 4',
    figureLabel: 'years, first + extended',
  },
];

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to apply for the Finland startup permit',
  inLanguage: 'en',
  step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.body })),
};

// 2026 Migri income requirement — net, per month, by region group.
// Group 1: Helsinki, Espoo, Vantaa, Kauniainen. Group 2: other large
// municipalities. Group 3: everywhere else.
const funds: FundsTable = {
  regions: ['Helsinki region', 'Other large city', 'Elsewhere'],
  single: [1210, 1090, 1030],
  couple: [1820, 1640, 1550],
  children: [
    [610, 550, 520],
    [480, 430, 410],
    [360, 320, 310],
  ],
  fees: { permit: 650, spouse: 750, child: 400, dVisa: 95 },
  months: 24,
};

const fundRows = [
  { label: 'Single applicant', v: funds.single, plus: false },
  { label: 'Applicant + spouse', v: funds.couple, plus: false },
  { label: '+ first child', v: funds.children[0], plus: true },
  { label: '+ second child', v: funds.children[1], plus: true },
  { label: '+ each further child', v: funds.children[2], plus: true },
];

// 2026 Migri processing fees.
const fees = [
  { label: 'Business Finland Eligibility Statement', online: 'Free', paper: '—', note: 'Will become chargeable under the coming reform' },
  { label: 'Start-up entrepreneur — first permit', online: '€650', paper: '€800', note: 'Per founder' },
  { label: 'Family ties — adult (spouse)', online: '€750', paper: '€800', note: 'Per adult' },
  { label: 'Family ties — child under 18', online: '€400', paper: '€430', note: 'Per child' },
  { label: 'D visa', online: '€95', paper: '€120', note: 'Optional, per person' },
];

const rights = [
  { title: 'Spouse work rights', content: 'An open work right: full-time, any job, any sector, no restrictions. In many families this is what funds year one.', positive: true },
  { title: 'Your own permit', content: 'Tied to your startup — entrepreneurship in that company must remain your main occupation. This is checked again at extension.', positive: false },
  { title: 'Fast Track', content: 'Migri targets a decision in about two weeks once the online application is complete and identification is done.', positive: true },
  { title: 'You must actually move', content: 'A cancellation review is opened on 22% of startup permits issued — against 4–8% for other permit types — and 71% of decided reviews end in cancellation, for not living in Finland or never starting the business.', positive: false },
  { title: 'Schengen travel', content: 'Visa-free travel across the Schengen area for up to 90 days in any 180-day period.', positive: true },
  { title: 'Social benefits', content: 'Kela benefits depend on residence-based eligibility, not on arrival. Claiming them straight after arrival contradicts your means-of-support evidence at extension.', positive: false },
  { title: 'Healthcare', content: 'Access to Finland\'s public health system once your residence is registered — low, capped client fees rather than free.', positive: true },
  { title: 'Education', content: 'Free, world-leading public education for your children, including Finnish-language support at school.', positive: true },
];

const family = [
  { title: 'Who qualifies', body: 'Spouse or registered partner, plus unmarried children under 18. Each files their own application; each adds to the means-of-support figure.' },
  { title: 'Open work right for the spouse', body: 'Full-time, any sector, no restrictions — unlike the founder\'s permit, which is tied to the company.' },
  { title: 'School and healthcare', body: 'Free public education from pre-primary to university, with Finnish-language support at school for migrant pupils, plus access to public healthcare once residence is registered.' },
  { title: 'Child benefit', body: 'Paid monthly until the child turns 17 — subject to Kela residence-based eligibility, not automatic on arrival.' },
];

const prQuestions: PrQuestion[] = [
  { key: 'finnishDegree', q: 'Will you hold a Finnish university degree?', options: ['No', 'Yes'] },
  { key: 'foreignDegree', q: 'A master’s or PhD from abroad, recognised in Finland?', options: ['No', 'Yes'] },
  { key: 'income', q: 'Expect €40,000+ taxable income a year?', options: ['No', 'Yes'] },
  { key: 'language', q: 'Finnish or Swedish level you can reach', options: ['None', 'A2', 'B1', 'C1'] },
];

const roadmap: RoadmapCopy = {
  prep: { title: 'Before you move', sub: 'Plan, statement, Fast Track' },
  arrive: { title: 'Arrive', sub: 'D visa, register with DVV' },
  extension: { year: 2, title: 'Extension', sub: 'Up to 4 more years' },
  citizenship: { years: 8, withLanguage: 5, languageQuestion: 'Finnish or Swedish for citizenship?' },
  phases: {
    first: { title: 'First permit, up to 2 years', body: 'Build the company and live in Finland. A cancellation review opens on 22% of startup permits, mostly for not really living here.' },
    extended: { title: 'Extended permit, up to 4 more years', body: 'Same business, actively developed, genuine residence. Permanent residence in {toPr}.' },
    resident: { title: 'Permanent resident', body: 'Via the {route} route. Citizenship in {toCitizenship}.' },
    citizen: { title: 'Eligible to apply for citizenship', body: 'You also need a clean record, met payment obligations and proof of financial resources. A citizenship test applies from 1 March 2027.' },
  },
};

// Permanent residence, for applications filed on or after 8 January 2026.
// Ordered fastest first; `needs` drives the finder.
const prRoutes: PrRoute[] = [
  {
    title: 'Finnish degree',
    years: 0,
    reqs: ['Master\'s, licentiate or doctoral degree from a Finnish university, or a university bachelor\'s (not a university of applied sciences)', 'Language at A2, or 15 credits of Finnish/Swedish studies at a higher education institution'],
    note: 'No minimum residence period and no work-history requirement — the fastest route on the board.',
    needs: { finnishDegree: 1, language: 1 },
  },
  {
    title: 'High income',
    years: 4,
    reqs: ['4 years continuous on an A permit', 'At least €40,000 taxable income in the most recently completed tax assessment'],
    note: 'No language requirement and no work-history requirement.',
    needs: { income: 1 },
  },
  {
    title: 'Foreign advanced degree',
    years: 4,
    reqs: ['4 years continuous on an A permit', 'Master\'s, licentiate or doctoral degree recognised in Finland', '2 years of work in Finland'],
    note: 'The realistic route for a founder arriving with a master\'s or PhD earned abroad. The work-history condition is not waivable.',
    needs: { foreignDegree: 1 },
  },
  {
    title: 'Superior language skills',
    years: 4,
    reqs: ['4 years continuous on an A permit', '3 years of work in Finland', 'Finnish or Swedish at C1'],
    note: 'For people who go all-in on the language early.',
    needs: { language: 3 },
  },
  {
    title: 'Long residence',
    years: 6,
    reqs: ['6 years continuous on an A permit', '2 years of work in Finland', 'Finnish or Swedish at B1'],
    note: 'Applicants aged 65+ are exempt from the language requirement.',
    needs: { language: 2 },
  },
];

const faqs = [
  {
    q: 'Is there a minimum capital investment required?',
    a: 'No. Finland sets no statutory minimum investment for the startup, unlike Austria (€30,000), France (€30,000) or Italy (€50,000). You must show the company has access to enough funding for its early stage and budget your first year — and, separately, prove your own personal means of support to Migri.',
  },
  {
    q: 'Can I apply as a solo founder?',
    a: 'In practice, no. Business Finland expects at least two founders who together hold at least 60% of the company, both working full-time on it with no side employment, with complementary skills. If you are alone, look at Denmark or Estonia instead.',
  },
  {
    q: 'What are the real odds of approval?',
    a: 'Low. In 2024 and 2025 roughly 92% of applications to Business Finland were refused — an approval rate of about 8%. Applications grew from 107 in 2018 to 1,068 in 2024, and 42% of them are repeats where at least one team member had already been rejected. Anyone promising you a guaranteed approval has not read the numbers.',
  },
  {
    q: 'How long does the whole process take?',
    a: 'The Business Finland evaluation usually takes a few weeks. After a positive statement, if you file a complete online application in Enter Finland and complete identification within the deadline, Migri\'s Fast Track targets a decision in about two weeks. Preparing the Business Finland package is normally the longest part of the timeline.',
  },
  {
    q: 'How much money do I need to show, and can I withdraw it afterwards?',
    a: 'In 2026 a single applicant needs net income or savings of €1,210 per month in the capital region, €1,090 in other large municipalities and €1,030 elsewhere — and enough to cover the whole permit period, so about €29,040 for a two-year permit at the capital-region rate. Withdrawing the money after obtaining a certificate is a genuine risk: Migri expects the funds to remain available for the permit period, and the Finnish government working group named temporary money transfers made purely to obtain a visa as a known abuse pattern.',
  },
  {
    q: 'Can my spouse work?',
    a: 'Yes, without restriction. A spouse on a family residence permit has an open work right — full-time, any job, any sector. Your own permit is the restricted one: entrepreneurship in your startup must remain your main occupation, and that is examined again at extension.',
  },
  {
    q: 'What is the path to permanent residence?',
    a: 'For applications filed on or after 8 January 2026 there are five routes: six years on an A permit plus two years of work plus B1 language; or four years plus at least €40,000 taxable income with no language requirement; or a Finnish master\'s, licentiate, doctoral or university bachelor\'s degree plus A2 language with no residence-period requirement at all; or four years plus a recognised foreign master\'s, licentiate or doctoral degree plus two years of work; or four years plus three years of work plus C1 language. Years spent on the start-up permit count towards all of them.',
  },
  {
    q: 'When can I apply for Finnish citizenship?',
    a: 'For applications filed on or after 1 October 2024 the general residence period is eight years; for applicants who meet the Finnish or Swedish language requirement it is five. Residence time alone is not enough: you must also establish your identity, have a clean record and have met your payment obligations. For applications filed on or after 17 December 2025 you must also show sufficient financial resources: a reliable account of how you supported yourself over the past two years, with no more than three months in total on unemployment benefit or social assistance. A citizenship test applies to applications filed on or after 1 March 2027; the first test is expected in March 2027.',
  },
  {
    q: 'Do I have to live in Finland, or can I travel freely?',
    a: 'You can travel and visit home whenever you like — but the permit is granted on the basis that you actually relocate and run the startup from Finland. Between April 2024 and September 2025 a cancellation review was opened on 22% of startup permits issued — against 4–8% for other Finnish permit types — and of the 246 reviews decided, 71% ended in the permit being cancelled, 93% of them first permits. The two reasons: the holder was not genuinely living in Finland, and the business was never actually started. Long absences also affect how your residence period is counted for permanent residence and citizenship.',
  },
  {
    q: 'What is changing in 2026?',
    a: 'The government has announced that the start-up entrepreneur permit will be reformed because the current system "is not effective in attracting start-up entrepreneurs to Finland". Legislative drafting began in early 2026. The separate free Business Finland statement is to be folded into the Migri application, the evaluation becomes chargeable, Migri will pre-screen general conditions and add hearings or interviews, and a Finnish business ID will no longer be required for a first permit if operations have not started.',
  },
];

// How the evaluation actually works, from the Ministry of Economic Affairs and
// Employment working-group report TEM 2025:36 — the only public document that
// explains how Business Finland decides and why so many files fail. Anything
// the report proposes but has not legislated is labelled a proposal in the
// answer, so a reader cannot mistake a recommendation for a current rule.
const deepDiveFaqs = [
  {
    q: 'Who actually decides on my startup?',
    a: 'Two bodies, two separate jobs. Migri does not independently assess your business model at all — it has delegated that judgement entirely to Business Finland and limits itself to the general immigration conditions and your means of support. Inside Business Finland, the decision sits exclusively with the Financing Centre (Rahoituskeskus); the corporate side only prepares files, answers questions and analyses data, and has no final say. A positive statement is an absolute precondition and must be obtained before you file the permit application.',
  },
  {
    q: 'What exactly does Business Finland measure?',
    a: 'Broadly the criteria it uses for its own Tempo startup grant. Unlike traditional entrepreneurship, the focus is rapid international growth potential and tolerance of higher risk, not near-term profit. Four axes: innovation and genuine novelty with a clear competitive advantage internationally; international demand potential, assessed against the target market\'s situation and forecast; a suitable founder team — at least two founders holding 60% or more between them, working full-time with no side activity, with complementary skills and the management capability to grow a company; and access to enough funding for launch and year one.',
  },
  {
    q: 'What has to be in the Business Finland package?',
    a: 'A working checklist: a clear description of the idea with a precise definition of the customer need and target market; a go-to-market strategy including customer segments and how you reach the first paying customer; the revenue model and initial pricing; a long-term growth plan; your unique competitive advantage against named competitors and existing alternatives; documented current progress — demos, prototypes, first customer conversations, pilots or letters of intent; your IP position; and a first-year work and financial plan with itemised costs and where the money comes from. Plus founder CVs and passport copies.',
  },
  {
    q: 'Will Business Finland interview me?',
    a: 'Not by default today — the assessment is made on the written file, and follow-up questions are also put in writing. That is precisely what is changing. The government working group proposed three methods: a hearing at the embassy during identification, a remote video interview run by Business Finland, and a Denmark-style video pitch judged by an expert panel. Importantly, none of these requires a change in the law — they can be implemented under the current framework, so they may arrive before the reform is legislated. Migri has decided to pilot a written hearing at the identification stage.',
  },
  {
    q: 'How much cash does the company actually need?',
    a: 'Finnish law sets no fixed figure. The working group\'s own international comparison notes Austria (€30,000), France (€30,000) and Italy (€50,000) all impose statutory minimums; Finland does not. Instead Business Finland tests whether the startup has access to sufficient funding for its earliest stage, and requires you to estimate the first year\'s financial need, itemise the costs and explain how they will be covered. Your personal means of support is an entirely separate test run by Migri, and it can come from savings or other lawful assets rather than startup revenue.',
  },
  {
    q: 'Why are 92% really refused?',
    a: 'The report lists the reasons, and none of them is arbitrary strictness. Volume grew from 107 applications in 2018 to 1,068 in 2024 while average quality fell. Because the evaluation is free and unlimited, "trial applications" have become a phenomenon: 42% are repeats and one person applied twelve times. Assessors face business plans written entirely by AI and agency-built packages with fabricated websites and fake LinkedIn profiles. The Finnish Border Guard has recorded permit holders at the border who could not describe their own startup. In 2024 this volume of weak files cost Business Finland roughly €500,000 — which is exactly why the evaluation is being made chargeable.',
  },
  {
    q: 'I have heard about forged Business Finland statements. What is that?',
    a: 'It is a systemic gap, not a rumour. Business Finland processes evaluations in a system called UMA-lite that has no technical connection to Migri\'s main UMA system — the two do not even share a case reference. So the statement is handed to the applicant, who then attaches it to their own Migri application. That indirect loop has produced repeated cases of forged Business Finland statements, and cases where an applicant gave contradictory information to the two agencies. The proposed fix is a restricted view inside UMA for Business Finland assessors so the statement is filed directly there, estimated at around €200,000 to build. For a genuine applicant this is good news: the loophole closes and clean files move faster.',
  },
  {
    q: 'Do I need Business Finland again for the extension?',
    a: 'It is not mandatory. But Migri can request an expert opinion from Business Finland when the profitability or continuity of the business under its original model is unclear — in practice, whenever the company is not yet profitable, which is nearly always, since a startup is very rarely profitable at its first extension two years in.',
  },
  {
    q: 'What does section 80b really require at extension?',
    a: 'The current law sets two conditions: the new permit must be for the same business activity or an equivalent one, and the business must either be profitable or still meet Business Finland\'s criteria for an innovative, fast-growing startup. In practice Migri looks at formal company registration, a positive growth outlook and personal means of support. The working group has proposed writing seven criteria explicitly into the law: an active Finnish business ID (Y-tunnus); continuing startup character; a team with the skills and resources to continue; demonstrable active development of the product during the previous permit period with a concrete commercialisation plan; realistic evidence of future profitability; the founder\'s full-time focus on this startup; and genuine residence in Finland. Those are still proposals — but they are already assessed in practice, so plan for them from day one.',
  },
  {
    q: 'What are the real extension statistics?',
    a: 'Far better than for the first permit. In 2024 there were 113 positive decisions against 28 negative; to the end of September 2025, 62 positive against 33 negative — an approval rate of about 80% in 2024 and about 65% so far in 2025. Cancellations of extended permits are rare: twelve in total across 2024 and 2025. One caveat hides inside those numbers: far fewer people reach the extension stage than hold a first permit, because a cancellation review opens on 22% of permits issued and 71% of decided reviews end in cancellation — 93% of those at the first-permit stage.',
  },
  {
    q: 'Why should I not claim social benefits after arriving?',
    a: 'It is one of the most damaging mistakes flagged in supervision. Applicants who file for housing allowance, unemployment benefit or the startup grant (Starttiraha) immediately after arrival directly contradict what they told the immigration process — that they had savings and sufficient personal means. That contradiction is treated as grounds to doubt the original information and, ultimately, to refuse the extension. If your means-of-support evidence was real, your first year should not run on social benefits.',
  },
  {
    q: 'Which nationalities dominate these statistics?',
    a: 'Russia, Iran, Turkey and Pakistan are the largest source countries for Business Finland statement applications. For startup permits actually granted since 2018 the order is Russia, Turkey, India and Iran. Among permits cancelled in post-issuance supervision, most concern Russian nationals, followed by Turkish, Iranian and Chinese. The report also states plainly that the largest applicant countries are those under international sanctions — Iran and Russia — and stresses the need for closer monitoring of possible sanctions circumvention and dual-use technology.',
  },
  {
    q: 'What does that mean for my own file?',
    a: 'If you come from one of the largest source countries — above all one under international sanctions — expect your file to be read more closely, and have documented answers ready for three things before you apply: a clear, traceable origin for the funds you present as means of support; your supply chain and customers, if the business depends on a counterparty in a sanctioned country; and the nature of your technology, if it could be considered dual-use. For a genuine team this is not bad news — it just means the file has to be visibly your own work rather than a package someone assembled for you.',
  },
  {
    q: 'What type of permit is it, and how long is the D visa valid?',
    a: 'The startup permit is always issued as a continuous, or A, permit. That means you are entitled to a registered municipality of residence (kotikunta) and the years count towards permanent residence. The first permit is two years by default. In recent years more than 80% of applicants have used the fast track; in that case a long-stay D visa valid for 100 days is placed in your passport at the same time as the positive decision, letting you and your family fly to Finland immediately without waiting for the physical residence card.',
  },
  {
    q: 'Which of these changes are settled, and which are only proposals?',
    a: 'Settled: the government has formally announced that the start-up entrepreneur permit will be reformed, and legislative drafting began in early 2026. Still only proposals: the integrated two-stage model where you file and pay at Migri first and Migri then requests the Business Finland assessment; Migri pre-screening before a file is referred; the shared UMA system; adding interviews; and writing the seven extension criteria into section 80b. Until those are enacted, the current rules apply and the Business Finland statement is still obtained separately and free of charge. We track the commencement dates and keep this page current.',
  },
];


const sources = [
  { name: 'Migri — Start-up entrepreneur', href: 'https://migri.fi/en/start-up-entrepreneur', what: 'Who the permit is for, how to apply, Fast Track.', checked: '8 Sep 2026' },
  { name: 'Migri — Income requirement', href: 'https://migri.fi/en/working-in-finland/income-requirement', what: 'The 2026 monthly thresholds by region and family size.', checked: '8 Sep 2026' },
  { name: 'Migri — Processing fees from 1 January 2026', href: 'https://migri.fi/en/-/changes-to-finnish-immigration-service-processing-fees-as-of-1-january-2026', what: 'Permit, family and D visa fees.', checked: '8 Sep 2026' },
  { name: 'Migri — Permanent residence permit', href: 'https://migri.fi/en/permanent-residence-permit', what: 'The five routes for applications from 8 January 2026.', checked: '8 Sep 2026' },
  { name: 'Business Finland — Startup permit', href: 'https://www.businessfinland.fi/en/do-business-with-finland/startup-in-finland/startup-permit', what: 'The Eligibility Statement and the 60% founder holding.', checked: '27 Oct 2026' },
  { name: 'Finnish Government — valtioneuvosto.fi', href: 'https://valtioneuvosto.fi/en/', what: 'The 2026 permit reform and the 8/5-year citizenship period.', checked: '27 Oct 2026' },
  { name: 'Ministry of Economic Affairs and Employment — report TEM 2025:36', href: 'https://julkaisut.valtioneuvosto.fi/', what: 'Approval rates, volumes, supervision and extension statistics.', checked: '8 Sep 2026' },
];

// Three guides, one per stage of the move. Curated rather than queried so the
// page stays static; swap a slug here if an article is withdrawn.
const reads = [
  {
    slug: 'finland-start-up-permit-process-2026-step-by-step',
    stage: 'Before you apply',
    title: 'Step-by-step process for the Finland Start-up Permit in 2026',
    excerpt: 'Every document and milestone in the 2026 process, with sequencing tips and common pitfalls.',
    date: { iso: '2026-09-08', label: '8 Sep 2026' },
    minutes: 6,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/09/0b9f72e020d2c7b54250cf154a1a8c6a.jpg',
  },
  {
    slug: 'essential-guide-startup-founders-moving-helsinki',
    stage: 'After you land',
    title: 'Essential guide for startup founders moving to Helsinki',
    excerpt: 'Housing, budgeting, community building and healthcare for founders on the start-up permit.',
    date: { iso: '2026-09-20', label: '20 Sep 2026' },
    minutes: 6,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/09/1ecc056ca624599ca0a56cc4521a010b.jpg',
  },
  {
    slug: 'moving-to-finland-with-family-housing-schools-settling-in',
    stage: 'With your family',
    title: 'Moving to Finland with family: housing, schools and settling in',
    excerpt: 'Finding housing, enrolling in schools and daycare, registering for healthcare and settling in.',
    date: { iso: '2026-10-28', label: '28 Oct 2026' },
    minutes: 6,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/10/d2f4e15c9ae6cd6b894665fb93aefb7d.jpg',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

const eur = (n: number) => `€${n.toLocaleString('en')}`;
const label = 'font-sans text-xs font-bold uppercase tracking-[0.18em]';

export default function FinlandPage() {
  return (
    <div className="w-full overflow-x-clip bg-[#F2F0E9] text-[#1a1a1a]">
      <JsonLd data={[videoJsonLd, howToJsonLd, faqJsonLd([...faqs, ...deepDiveFaqs].map((f) => ({ question: f.q, answer: f.a })), 'en')]} />

      <RouteProvider stops={STOPS} flag="fi" theme={THEME}>
        {/* ── Hero: the answer up front ── */}
        <header className="relative overflow-hidden bg-[#001B3D] text-white">
          <Image
            src="https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=1800&q=80&auto=format&fit=crop"
            alt="Northern lights over a Finnish pine forest"
            fill
            priority
            unoptimized
            className="object-cover object-[center_40%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001B3D]/95 via-[#001B3D]/75 to-[#001B3D]/30" />
          <AuroraCanvas />
          {/* Nordic cross at the flag's own proportions. */}
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-12 aspect-[18/11] w-[540px] opacity-10">
            <span className="absolute left-[27.78%] top-0 h-full w-[16.67%] bg-white" />
            <span className="absolute left-0 top-[36.36%] h-[27.27%] w-full bg-white" />
          </div>

          <div className="container relative mx-auto grid grid-cols-1 items-end gap-8 px-6 pb-12 pt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <nav aria-label="Breadcrumb" className="font-sans text-xs text-white/60 lg:col-span-2">
              <ol className="flex flex-wrap gap-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link href="/country" className="hover:text-white">Countries</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-white/85">Finland</li>
              </ol>
            </nav>

            <div>
              <div className={`mb-5 flex items-center gap-3 text-white/75 ${label}`}>
                <Flag code="fi" uid="hero" width={36} />
                Startup Finland · Fast Track permit
              </div>
              <h1>
                <span className="block font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.02em]">
                  Finland <em className="text-[#00BFA5]">Startup.</em>
                </span>
                <span className="mt-4 block max-w-[46ch] font-sans text-lg font-medium leading-snug">
                  The Finland startup visa (start-up entrepreneur permit) in 2026, step by step
                </span>
              </h1>
              <p className="mt-3 max-w-[56ch] font-sans text-base leading-relaxed text-white/70">
                A decision in about two weeks, no minimum investment, family included and the spouse free to work. The catch is the gate:
                about 92% of applications to Business Finland were refused in 2024 and 2025.
              </p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-white/60">
                <span>By <span className="text-white">Farjad P.D</span></span>
                <span>Updated <time dateTime={UPDATED.iso} className="text-white">{UPDATED.label}</time></span>
                <span>Figures checked against Migri, Business Finland and TEM 2025:36</span>
              </p>
              <p className="mt-5 max-w-[60ch] border-l-2 border-[#00BFA5] pl-3 font-sans text-sm text-white/70">
                <strong className="text-white">The rules are moving in 2026.</strong> The free Business Finland statement is being folded into the Migri
                application and will become chargeable, with interviews added. Permanent residence now runs on five routes.
              </p>
            </div>

            <aside aria-label="How to use this page" className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <p className={`text-[#00BFA5] ${label}`}>Your route through this page</p>
              <ol className="my-4 list-decimal space-y-1 pl-5 font-sans text-sm text-white/75">
                <li>Check your team against the gate</li>
                <li>Walk the five steps</li>
                <li>Work out your money</li>
                <li>Sort perks from catches</li>
                <li>Map your road to a Finnish passport</li>
              </ol>
              <a href="#gate" className="inline-flex items-center gap-2 rounded-full bg-[#00BFA5] px-5 py-3 font-sans text-sm font-bold text-[#00261F] transition-transform hover:-translate-y-0.5">
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
          question="What is the Finland startup visa?"
          task="Read the four facts"
          completeOn="view"
          message="Snapshot read"
          answer={
            <p>
              The Finland startup visa is the start-up entrepreneur residence permit. Business Finland first judges the business and issues an Eligibility
              Statement; Migri then checks your personal means of support and issues a permit for up to two years. There is no minimum investment and Fast
              Track targets a decision in about two weeks, but about 92% of statements were refused in 2024–2025.
            </p>
          }
        >
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { stat: '~2 wk', label: 'Fast Track', sub: 'from a complete application' },
              { stat: '~8%', label: 'Approval rate', sub: 'Business Finland, 2024–2025' },
              { stat: '2+', label: 'Founders required', sub: 'holding at least 60% between them' },
              { stat: '€0', label: 'Minimum investment', sub: 'no statutory capital threshold' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white p-5 transition-transform hover:-translate-y-1">
                <dt className="order-2 mt-2 font-sans text-sm font-bold">{s.label}</dt>
                <dd className="order-1 font-serif text-4xl text-[#002F6C]">{s.stat}</dd>
                <dd className="order-3 font-sans text-xs text-[#1a1a1a]/55">{s.sub}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 grid max-w-5xl grid-cols-1 gap-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            <p>
              <strong className="text-[#1a1a1a]">Two bodies, one judgement.</strong> Business Finland evaluates the business and issues the Eligibility
              Statement. Migri does not second-guess your idea; it has delegated that judgement entirely, and checks the general immigration conditions and
              your personal means of support.
            </p>
            <p>
              If you know the Canadian Startup Visa, the shape is familiar: an expert verdict on the company, then a relatively mechanical immigration
              file. The difference is that in Finland one state agency makes that call, it is free today, there is no annual quota, and the answer usually
              arrives in weeks.
            </p>
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
          eyebrow="02 · The 35-minute masterclass"
          heading={<>Finland startup visa <span className="italic text-[#00BFA5]">video guide</span></>}
          intro="The whole route on camera, recorded June 2026: the Business Finland gate, the 60% rule, the timeline, 2026 costs and the four red flags. Pick a chapter to jump straight to it."
          note={<>Recorded June 2026. Where the video and this page disagree, the figures on this page are the current ones.</>}
          channel={{ handle: MAIN_CONTACT.youtubeHandle, url: MAIN_CONTACT.youtube }}
        />

        {/* 03 — Who qualifies */}
        <RouteStop
          id="gate"
          number={3}
          eyebrow="Business Finland's four tests"
          question="Who qualifies for the Finland startup permit?"
          task="Answer all four"
          answer={
            <p>
              You need at least two founders holding at least 60% of the company, working on it full-time, with an innovative business that has real
              demand outside Finland and a funded plan for the first year. Business Finland judges the written file, usually without an interview, using
              broadly the same criteria as its Tempo grant.
            </p>
          }
        >
          <GateQuiz
            stopId="gate"
            criteria={criteria}
            strongNote="What decides it now is whether the file is visibly your own work: real traction, named competitors, an itemised first-year budget."
            gapNote="A refusal stays on record and is visible on your next attempt."
          >
            <h3 className="font-serif text-xl">Why are about 92% of applications refused?</h3>
            <div>
              <p className="mb-2 font-sans text-sm text-[#1a1a1a]/60"><b className="tabular-nums text-[#1a1a1a]">8 in 100</b> files got a positive statement in 2024–2025</p>
              <ApprovalDots />
            </div>
            <ul className="grid gap-1.5 font-sans text-sm text-[#1a1a1a]/65">
              <li><b className="tabular-nums text-[#1a1a1a]">107 → 1,068</b> applications a year, 2018 to 2024</li>
              <li><b className="tabular-nums text-[#1a1a1a]">42%</b> are repeats; one person applied twelve times</li>
              <li><b className="tabular-nums text-[#1a1a1a]">22% → 71%</b> a cancellation review opens on 22% of permits issued; 71% of the 246 decided reviews ended in cancellation</li>
            </ul>
            <Link href="/book-meeting" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#00BFA5] px-5 py-3 font-sans text-sm font-bold text-[#00261F] transition-transform hover:-translate-y-0.5">
              Get a free read on your file <ArrowRight className="h-4 w-4" />
            </Link>
          </GateQuiz>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              <h3 className="mb-2 font-serif text-xl text-[#1a1a1a]">What has to be in the file</h3>
              <p>
                Alongside the four criteria, document real progress: demos, prototypes, first customer conversations, pilots or letters of intent, plus any
                registered IP. Assessors report a rising volume of AI-written plans and agency-built packages with fake websites and invented LinkedIn
                profiles, and files from the largest source countries, several under international sanctions, are read closely. Your case has to be
                visibly your own.
              </p>
            </div>
            <div>
              <h3 className="mb-3 font-serif text-xl">Sectors that make the international-demand case easier</h3>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {sectors.map((s) => (
                  <li key={s.name} className="rounded-xl border border-[#1a1a1a]/10 bg-white px-4 py-3">
                    <b className="block font-sans text-sm">{s.name}</b>
                    <span className="font-sans text-xs text-[#1a1a1a]/60">{s.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </RouteStop>

        {/* 04 — How to apply */}
        <RouteStop
          id="steps"
          number={4}
          tone="white"
          eyebrow="The process"
          question="How do you apply for the Finland startup permit?"
          task="Walk to step 5"
          answer={
            <p>
              Get a positive Eligibility Statement from Business Finland, file your residence permit in Enter Finland from outside Finland, give
              fingerprints at a Finnish mission or VFS Global, add a D visa if you want to fly in on the decision, then register in Finland. Fast Track
              targets a decision in about two weeks from a complete file.
            </p>
          }
        >
          <StepWalker stopId="steps" steps={steps} />
          <p className="mt-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            <strong className="text-[#1a1a1a]">Realistic timeline:</strong> preparing a genuinely competitive Business Finland package is the long pole —
            usually months, not weeks. The permit stage that follows is the fast one.
          </p>
        </RouteStop>

        {/* Photo band */}
        <figure className="relative flex min-h-[360px] items-end overflow-hidden bg-[#001B3D] text-white">
          <ParallaxLayer>
            <Image
              src="https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=1800&q=80&auto=format&fit=crop"
              alt="Helsinki Cathedral above Senate Square, seen from the harbour"
              fill
              unoptimized
              className="object-cover object-[center_40%]"
            />
          </ParallaxLayer>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#001B3D]/20 to-[#001B3D]/90" />
          <figcaption className="container relative mx-auto flex flex-wrap items-end justify-between gap-5 px-6 py-10">
            <div>
              <p className={`text-[#00BFA5] ${label}`}>Step 5 · Arrive</p>
              <p className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
                Land on the D visa.<br />
                <span className="italic text-[#00BFA5]">Register in Helsinki.</span>
              </p>
              <p className="mt-2 max-w-[46ch] font-sans text-sm text-white/70">
                Finland has topped the World Happiness Report every year since 2018 — the 2026 report makes it nine years running.
              </p>
            </div>
            <span className="font-sans text-xs text-white/55">Helsinki Cathedral, Senate Square</span>
          </figcaption>
        </figure>

        {/* 05 — Money */}
        <RouteStop
          id="money"
          number={5}
          eyebrow="Means of support · 2026 Migri figures"
          question="How much money do you need for the Finland startup visa in 2026?"
          task="Set up your family"
          answer={
            <p>
              A single founder must show €1,210 a month net in the Helsinki region, €1,090 in other large cities and €1,030 elsewhere: about €29,040 for a
              two-year permit at the Helsinki rate. With a spouse it rises to €1,820 a month. The first permit costs €650 online per founder, and the
              Business Finland statement is free today.
            </p>
          }
        >
          <FundsCalculator stopId="money" t={funds} />

          <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
                <caption className="pb-2 text-left font-bold">Monthly net income or savings to show, 2026 (Migri)</caption>
                <thead>
                  <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                    <th scope="col" className="px-4 py-3">Household</th>
                    {funds.regions.map((r) => <th key={r} scope="col" className="px-4 py-3">{r}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {fundRows.map((row) => (
                    <tr key={row.label} className="border-b border-[#1a1a1a]/10 last:border-0">
                      <th scope="row" className="px-4 py-3 text-left font-normal">{row.label}</th>
                      {row.v.map((v, i) => <td key={i} className="px-4 py-3 tabular-nums">{row.plus ? '+' : ''}{eur(v)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 font-sans text-xs text-[#1a1a1a]/55">
                Helsinki region: Helsinki, Espoo, Vantaa and Kauniainen. Two-year totals at the Helsinki rate: €29,040 single, €43,680 with a spouse,
                €58,320 with one child, €69,840 with two.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
                <caption className="pb-2 text-left font-bold">Government processing fees, 2026</caption>
                <thead>
                  <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                    <th scope="col" className="px-4 py-3">Application</th>
                    <th scope="col" className="px-4 py-3">Online</th>
                    <th scope="col" className="px-4 py-3">Paper</th>
                    <th scope="col" className="px-4 py-3">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f) => (
                    <tr key={f.label} className="border-b border-[#1a1a1a]/10 last:border-0">
                      <th scope="row" className="px-4 py-3 text-left font-normal">{f.label}</th>
                      <td className="px-4 py-3 tabular-nums">{f.online}</td>
                      <td className="px-4 py-3 tabular-nums">{f.paper}</td>
                      <td className="px-4 py-3 text-xs text-[#1a1a1a]/60">{f.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 grid max-w-5xl grid-cols-1 gap-4 font-sans text-sm leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            <p>
              <strong className="text-[#1a1a1a]">A two-year permit needs two years of funds.</strong> If your resources only cover one year, Migri can issue a
              one-year permit instead. This is not an investment: the money stays in your own account and pays for your own life, and it is expected to
              remain available for the whole permit period.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">Rule of thumb.</strong> A family of four filing online — founder, spouse, two children, all with D visas —
              pays roughly €2,500–€2,600 in Migri fees alone, before translation, legalisation and VFS charges. Migri revises its tariff each January; you
              pay the one in force on the day you file.
            </p>
          </div>
        </RouteStop>

        {/* 06 — Rights */}
        <RouteStop
          id="life"
          number={6}
          tone="white"
          eyebrow="Perk or catch?"
          question="What rights does the startup permit give you and your family?"
          task="Guess all eight"
          answer={
            <p>
              Your spouse gets an open work right, your children get free public schooling and the family can travel across Schengen. In return, the
              startup must stay your main occupation, you must genuinely live in Finland, and claiming social benefits right after arrival contradicts the
              means-of-support evidence you gave Migri.
            </p>
          }
        >
          <PerkOrCatch stopId="life" items={rights} />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <div className="font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              <h3 className="mb-2 font-serif text-2xl text-[#1a1a1a]">Your family gets more freedom than you do</h3>
              <p>
                Your spouse and children apply alongside you and use the same Fast Track. The start-up permit is an A permit, so the years count towards
                permanent residence and citizenship. At extension, Migri looks for a registered Finnish company, a product that has genuinely been
                developed, a founder whose main occupation is still this startup, and real residence in Finland. Extension approval ran at about 80% in
                2024 and about 65% in 2025.
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {family.map((f) => (
                <li key={f.title} className="rounded-xl border border-[#1a1a1a]/10 bg-[#F2F0E9] p-4">
                  <h4 className="font-sans text-sm font-bold">{f.title}</h4>
                  <p className="mt-1 font-sans text-sm text-[#1a1a1a]/65">{f.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </RouteStop>

        {/* 07 — Permanent residence */}
        <RouteStop
          id="residence"
          number={7}
          eyebrow="Permanent residence · applications from 8 Jan 2026"
          question="How do you get permanent residence in Finland after the startup permit?"
          task="Find your fastest route"
          answer={
            <p>
              Years on the startup permit count towards permanent residence. Since 8 January 2026 there are five routes: four years with €40,000 taxable
              income; four years with a recognised master&apos;s or PhD and two years of work; four years with C1 language and three years of work; six
              years with B1 and two years of work; or a Finnish degree with A2 and no minimum residence.
            </p>
          }
        >
          <PrFinder stopId="residence" questions={prQuestions} routes={prRoutes} />
          <p className="mt-4 font-sans text-xs text-[#1a1a1a]/55">Every route requires that you still meet the conditions for a continuous (A) residence permit.</p>
        </RouteStop>

        {/* 08 — Roadmap */}
        <RouteStop
          id="roadmap"
          number={8}
          tone="white"
          eyebrow="Zero to 100"
          question="How long does it take to get Finnish citizenship through the startup permit?"
          task="Drag yourself through the years"
          answer={
            <p>
              Plan on a first permit of up to two years, an extension of up to four more, permanent residence after four to six years depending on your
              route, and citizenship after eight years of residence, or five if you meet the Finnish or Swedish language requirement.
            </p>
          }
        >
          <YearsRoadmap stopId="roadmap" routes={prRoutes} defaultRoute={4} copy={roadmap} />
          <ol className="mt-6 grid grid-cols-2 gap-3 font-sans text-sm text-[#1a1a1a]/65 md:grid-cols-5">
            {[
              ['Before you move', 'Business plan, Eligibility Statement, ~2-week Fast Track'],
              ['Year 0', 'Arrive on the D visa, register with DVV'],
              ['Year 2', 'Extension for up to 4 more years'],
              ['Year 4–6', 'Permanent residence, depending on route'],
              ['Year 5–8', 'Citizenship: 5 years with language, otherwise 8'],
            ].map(([t, s]) => (
              <li key={t} className="border-t-2 border-[#1a1a1a]/10 pt-2">
                <b className="block text-[#1a1a1a]">{t}</b>
                {s}
              </li>
            ))}
          </ol>
          <div className="mt-8 max-w-3xl rounded-2xl bg-[#002F6C] p-6 font-sans text-sm leading-relaxed text-white/75">
            <h3 className="mb-2 font-serif text-2xl text-white">Finnish citizenship</h3>
            <p>
              For applications filed on or after 1 October 2024 the general residence period is <strong className="text-white">8 years</strong>, or{' '}
              <strong className="text-white">5 years</strong> for applicants who meet the Finnish or Swedish language requirement. You also need an
              established identity, a clean record and met payment obligations, sufficient financial resources (applications from 17 December 2025), and
              proven language skills, for example the YKI test. A citizenship test applies to applications filed on or after 1 March 2027. Language, not
              money, is the bottleneck on this path.
            </p>
          </div>
        </RouteStop>

        {/* 09 — FAQ */}
        <RouteStop
          id="faq"
          number={9}
          eyebrow="Questions founders ask"
          question="Finland startup visa: frequently asked questions"
          task="Open three answers"
          answer={<p>Twenty-five answers, from solo founders and spouse work rights to how Business Finland actually decides and what is changing in the 2026 reform.</p>}
        >
          <FaqGroups />
          <OpenedTracker stopId="faq" need={3} message="Questions answered" />
        </RouteStop>

        {/* Sources */}
        <section aria-labelledby="sources-h" className="border-b border-[#1a1a1a]/10 bg-white px-6 py-14">
          <div className="container mx-auto">
            <p className={`text-[#00796B] ${label}`}>Where these figures come from</p>
            <h2 id="sources-h" className="mt-2 font-serif text-3xl">Sources</h2>
            <ol className="mt-6 grid max-w-4xl list-decimal gap-2 pl-5 font-sans text-sm">
              {sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-bold underline decoration-[#00BFA5] underline-offset-2 hover:text-[#00796B]">
                    {s.name}
                  </a>{' '}
                  <span className="text-[#1a1a1a]/60">{s.what} Checked {s.checked}.</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Book a session */}
        <section id="book" aria-labelledby="book-h" className="scroll-mt-32 bg-[#001B3D] px-6 py-16 text-white">
          <div className="container mx-auto grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <div>
              <RouteFinish />
              <p className={`text-[#00BFA5] ${label}`}>Talk it through</p>
              <h2 id="book-h" className="mt-2 font-serif text-4xl leading-tight">
                Bring your file to a <span className="italic text-[#00BFA5]">free session.</span>
              </h2>
              <p className="mt-3 max-w-[52ch] font-sans text-white/70">
                Pick a time, come prepared, and get an honest read on your team, your numbers and whether Finland is the right route. If it isn&apos;t,
                we&apos;ll say so.
              </p>
              <ul className="my-5 flex flex-wrap gap-2 font-sans text-xs">
                {['Free · 60 minutes', 'Online, Google Meet', 'Link sent after booking'].map((p) => (
                  <li key={p} className="rounded-full border border-white/25 px-3 py-1.5">{p}</li>
                ))}
              </ul>
              <Link href="/book-meeting" className="inline-flex items-center gap-2 rounded-full bg-[#00BFA5] px-6 py-3.5 font-sans text-sm font-bold text-[#00261F] transition-transform hover:-translate-y-0.5">
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
                <p className={`text-[#00796B] ${label}`}>Keep reading</p>
                <h2 id="reads-h" className="mt-2 font-serif text-3xl md:text-4xl">More Finland guides</h2>
              </div>
              <Link href="/blog/category/finland" className="inline-flex items-center gap-1.5 font-sans text-sm font-bold text-[#00796B] hover:underline">
                All Finland articles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="grid snap-x snap-mandatory auto-cols-[82%] grid-flow-col gap-4 overflow-x-auto pb-2 md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:overflow-visible">
              {reads.map((r) => (
                <li key={r.slug} className="group snap-start overflow-hidden rounded-2xl border border-[#1a1a1a]/10 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#001B3D]/10">
                  <Link href={`/blog/${r.slug}`} className="block">
                    <span className="relative block aspect-video overflow-hidden">
                      <Image src={r.cover} alt="" fill sizes="(min-width: 768px) 33vw, 82vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </span>
                    <span className="grid gap-2 p-5">
                      <span className={`text-[#00796B] ${label}`}>{r.stage}</span>
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

      {/* Disclaimer */}
      <section className="border-t border-[#1a1a1a]/10 bg-[#F9F9F9] px-6 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#1a1a1a]/30" />
            <p className="font-sans text-[11px] leading-relaxed text-[#1a1a1a]/45">
              <strong>Regulatory Notice:</strong> Figures on this page were verified on 8 September 2026, and the citizenship rules re-checked on 27 October
              2026, against official Business Finland and Migri documentation, the Finnish Government&apos;s announcement on reforming start-up
              entrepreneur permits, and the Ministry of Economic Affairs and Employment working-group report TEM 2025:36. They are provided for
              informational purposes only. VisaRoads, a brand of Ashavid Inc., is a strategic business advisory firm — we are{' '}
              <span className="underline">NOT</span> an immigration law firm or recruitment agency. A positive Eligibility Statement does not guarantee a
              residence permit. Income thresholds and processing fees are revised every January and the law itself is under reform — always verify current
              figures at{' '}
              <a href="https://migri.fi" target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-[#00BFA5]">migri.fi</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqGroups() {
  const groups = [
    { heading: 'The permit', blurb: '', items: faqs },
    {
      heading: 'Inside the evaluation',
      blurb: 'How Business Finland actually decides, drawn from the Ministry of Economic Affairs and Employment working-group report TEM 2025:36 — the only public document that explains the mechanics. Proposals that are not yet law are labelled as such.',
      items: deepDiveFaqs,
    },
  ];
  return (
    <div className="grid max-w-4xl gap-12">
      {groups.map((g) => (
        <div key={g.heading}>
          <h3 className={`mb-2 text-[#00796B] ${label}`}>{g.heading}</h3>
          {g.blurb && <p className="mb-4 max-w-2xl font-sans text-sm text-[#1a1a1a]/55">{g.blurb}</p>}
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
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 transition-colors hover:text-[#00796B] group-open:text-[#00796B] [&::-webkit-details-marker]:hidden">
        <h4 className="font-serif text-xl leading-snug">{q}</h4>
        <span aria-hidden="true" className="font-serif text-2xl transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="max-w-[72ch] pb-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/65">{a}</p>
    </details>
  );
}
