// ============================================================================
// Page: app/[locale]/(public)/country/australia/page.tsx
// Layout: a guided route, built on the Finland page's pattern. A compact
// Sydney Harbour hero, a sticky rail whose Australian flag rises as the reader
// completes each stop, and one stop per question people actually search.
// Every stop opens with its question as the H2 and a ~50-word direct answer
// (the passage answer engines quote), then the detail: real tables, lists and
// a small game on top. All copy is rendered on the server, so crawlers and AI
// engines read the whole page. The one Australia-shaped game (which priority
// lane the invitations go to) lives next to this file in AustraliaWidgets.tsx.
//
// Subject: the National Innovation Visa (subclass 858) — invitation-only
// permanent residence, successor to the Global Talent programme.
//
// THIS REPLACES a page that had gone materially stale: it still described the
// NIV as a fresh alternative to subclass 188 and carried no figures at all.
// /australia/entrepreneur-stream was a near-duplicate of it, competing for the
// same query, and now 301s here — one English page per subject. The Persian
// twin is /fa/australia (content/fa/australia.ts), verified on the same date
// against the same sources; the two agree on every figure.
//
// THE SPINE OF THIS PAGE IS ONE NUMBER THE MARKETING NEVER CARRIES. From the
// Department's own invitation rounds: 2,166 EOIs and 248 invitations for
// April–June 2026; 1,815 and 146 for January–March. Roughly one invitation
// per nine expressions of interest. The invitation is the wall — not the visa
// application, which succeeds at a very high rate once you hold one.
//
// TWO CORRECTIONS TO WHAT CIRCULATES:
//   · Ministerial Direction 112 was revoked by Direction 120 on 25 July 2026.
//     Five priority groups now, not four, and it covers the whole Class BX
//     including on-hand Global Talent and Distinguished Talent applications.
//   · "Get a state nomination, it puts you in Priority 2" is the standard
//     advice and the published breakdown inverts it. April–June 2026:
//     Priority 2 drew fewer than 20 invitations, Priority 3 drew 192. The
//     quarter before, 15 against 113.
//
// AND THE THING THE NAME HIDES: this is not a startup visa. It is the
// Distinguished Talent visa renamed, assessed on the individual, and a team
// cannot apply together. Subclass 188 closed to new applications in 2024, so
// there is no startup route underneath it either.
//
// Figures verified 2026-09-09. The visa application charge rose on 1 July
// 2026; secondary sources disagree on the exact figure and Home Affairs
// blocks automated reads, so it is published with that caveat attached rather
// than as a settled number — and deliberately as a table, not a calculator,
// so the page never totals figures it cannot confirm.
//
// Rebuilt 2026-10-29 as a route guide. No figure changed. Not on this page,
// and so not in it: an English video (none exists for this route), a
// permanent-residence finder or citizenship roadmap (the visa IS permanent
// residence, and the page states no citizenship period). Sources link the
// Home Affairs home page only: no deep Home Affairs URL is recorded anywhere
// in this repo, and Home Affairs blocks automated reads, so none was guessed.
// The sector split (122+45+33+14+9+7+6+6) sums to 242 of the 248 invitations;
// it is shown as published.
//
// Photos (all local, all checked 2026-10-29): Sydney Harbour at dusk, the
// Sydney CBD from above, and a Melbourne tram — each genuinely Australia.
// ============================================================================

import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, Award, FileText, Globe, Lightbulb, ShieldAlert } from 'lucide-react';
import { Link } from '@/routing';
import { metaFor } from '@/lib/pageMeta';
import JsonLd from '@/components/JsonLd';
import { SITE_URL, faqJsonLd } from '@/lib/seo';
import { MAIN_CONTACT } from '@/content/contact';
import Flag from '@/components/route/flags';
import { RouteProvider, RouteRail, RouteStop, RouteFinish, type RouteStopDef, type RouteTheme } from '@/components/route/RouteProgress';
import {
  ApprovalDots,
  CopyButton,
  GateQuiz,
  OpenedTracker,
  ParallaxLayer,
  PerkOrCatch,
  StepWalker,
  type RouteStep,
} from '@/components/route/RouteWidgets';
import { LaneGuess, type Lane, type LaneRound } from './AustraliaWidgets';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/country/australia', locale);
}

// ─── Data ────────────────────────────────────────────────────────────────────

// When the figures were last verified, not when the layout changed.
const UPDATED = { iso: '2026-09-09', label: '9 Sep 2026' };
const PAGE_URL = `${SITE_URL}/en/country/australia`;

// The page's own palette: Australian green on near-black. #00843D reads only
// 4.22:1 on the paper (#F2F0E9), so text uses the deeper #006B31 (5.85:1 on
// paper, 6.67:1 on white, 5.76:1 on the soft tint). White on #00843D is
// 4.81:1. On the dark bands the green drops to 4.0:1, so text there uses the
// page's lighter #5cb87f (7.9:1 on #0a0e1a).
const THEME: RouteTheme = { accent: '#00843D', accentInk: '#FFFFFF', accentText: '#006B31', primary: '#0d1017', deep: '#0a0e1a', soft: '#E3F2E8', accentOnDark: '#5cb87f' };

const STOPS: RouteStopDef[] = [
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'startup', label: 'Not a startup visa' },
  { id: 'gate', label: 'The standard' },
  { id: 'odds', label: 'The odds' },
  { id: 'lanes', label: 'Priority lanes' },
  { id: 'steps', label: '5 stages' },
  { id: 'money', label: 'Cost' },
  { id: 'life', label: 'Life' },
  { id: 'promise', label: 'Guarantees' },
  { id: 'faq', label: 'FAQ' },
];

const criteria = [
  {
    title: 'An international record',
    body: 'Exceptional and outstanding achievement at a global scale, not a strong CV: international patents and IP, peer-reviewed publications with high citation counts, a business founded and exited or substantial capital raised, broad international media coverage, or remuneration far above the industry standard.',
  },
  {
    title: 'Still prominent',
    body: 'An achievement from a decade ago that did not continue will not carry the file. The assessor is asking where you stand in your field now.',
  },
  {
    title: 'A nominator of national standing',
    body: 'An Australian citizen, permanent resident, eligible New Zealand citizen, Australian organisation or government agency with a national reputation in Australia in your own field, to sign Form 1000.',
  },
  {
    title: 'Your own record, not the team’s',
    body: 'The application is individual: each co-founder applies separately on their own record. A founder at idea or seed stage does not meet the standard, however good the idea.',
  },
];

const evidence = [
  { title: 'Patents and IP', icon: Lightbulb, desc: 'International patents and intellectual property you hold, not applications pending.' },
  { title: 'Citations', icon: FileText, desc: 'Peer-reviewed publications with high citation counts in recognised journals.' },
  { title: 'Ventures and capital', icon: Globe, desc: 'Companies founded and exited, or substantial capital raised — measured, not asserted.' },
  { title: 'Income', icon: Award, desc: 'Remuneration far above the industry standard, which is itself a measure of your market value.' },
];

// Department invitation rounds, as reported 11 Aug 2026. The point of showing
// both quarters is that the shape is stable, not a one-off.
const rounds = [
  { period: 'Apr–Jun 2026', eois: '2,166', invites: '248', p1: '<5', p2: '<20', p3: '192', p4: '38' },
  { period: 'Jan–Mar 2026', eois: '1,815', invites: '146', p1: '0', p2: '15', p3: '113', p4: '18' },
];

// The same rounds for the lane game. Ranges ("<5", "<20") are drawn at their
// upper bound and say so under the chart.
const lanes: Lane[] = [
  { key: 'p1', label: 'Priority 1' },
  { key: 'p2', label: 'Priority 2', sub: 'Government nomination on Form 1000 — the standard advice' },
  { key: 'p3', label: 'Priority 3', sub: 'Exceptional achievement in a Tier 1 sector — the direct route' },
  { key: 'p4', label: 'Priority 4' },
];

const laneRounds: LaneRound[] = [
  { period: 'Apr–Jun 2026', values: { p1: { shown: '<5', n: 5 }, p2: { shown: '<20', n: 20 }, p3: { shown: '192', n: 192 }, p4: { shown: '38', n: 38 } } },
  { period: 'Jan–Mar 2026', values: { p1: { shown: '0', n: 0 }, p2: { shown: '15', n: 15 }, p3: { shown: '113', n: 113 }, p4: { shown: '18', n: 18 } } },
];

const sectorSplit = [
  { name: 'Critical technologies', n: 122 },
  { name: 'Health industries', n: 45 },
  { name: 'Renewables', n: 33 },
  { name: 'Financial services', n: 14 },
  { name: 'Agri-food', n: 9 },
  { name: 'Defence and space', n: 7 },
  { name: 'Education', n: 6 },
  { name: 'Sports and arts', n: 6 },
];

const tiers = [
  {
    tier: 'Tier 1',
    sectors: [
      { name: 'Critical technologies', detail: 'artificial intelligence, advanced robotics, cyber security, quantum, photonics, biotechnology, autonomous systems, advanced ICT, advanced manufacturing and materials, clean energy generation and storage, and positioning, timing and sensing' },
      { name: 'Renewables and low emission technologies', detail: 'renewable generation, green metals, renewable hydrogen, waste-to-energy' },
      { name: 'Health industries', detail: 'medical manufacturing, genomics, pharmaceuticals, antimicrobial resistance, implantable devices' },
    ],
  },
  {
    tier: 'Tier 2',
    sectors: [
      { name: 'Agri-food and AgTech', detail: '' },
      { name: 'Defence capabilities and space', detail: '' },
      { name: 'Education', detail: '' },
      { name: 'Financial services and FinTech', detail: '' },
      { name: 'Infrastructure and transport', detail: '' },
      { name: 'Resources', detail: '' },
    ],
  },
];

const steps: RouteStep[] = [
  {
    title: 'Submit an EOI',
    who: 'Department of Home Affairs',
    body: 'An online Expression of Interest to the Department of Home Affairs, carrying the evidence of your achievements — patents, publications and citations, awards, funding rounds, media coverage, income.',
    note: 'You do not need a nominator at this stage. You do need the evidence.',
    figure: 'EOI',
    figureLabel: 'online, with your evidence',
  },
  {
    title: 'Wait for an invitation',
    who: 'The wall',
    body: 'This is the stage that decides the outcome. In the April–June 2026 round the Department received 2,166 EOIs and issued 248 invitations. In January–March, 1,815 and 146.',
    note: 'Roughly one invitation for every nine EOIs. Everything else on this page is downstream of clearing this.',
    figure: '1 in 9',
    figureLabel: 'EOIs invited, Apr–Jun 2026',
  },
  {
    title: 'Lodge within 60 days',
    who: 'ImmiAccount',
    body: 'An invitation starts a 60-day clock to lodge the formal application in ImmiAccount and pay the charge. Miss it and you are back at the start.',
    note: 'Have the nominator lined up before the invitation arrives, not after.',
    figure: '60 days',
    figureLabel: 'from the invitation',
  },
  {
    title: 'Form 1000 and checks',
    who: 'Your nominator',
    body: 'Your nominator signs Form 1000, certifying your international record. Then identity documents, health examinations, biometrics and police certificates for you and every family member.',
    note: 'The nominator must hold a national reputation in Australia in your own field. A friend who happens to be a citizen is not eligible.',
    figure: 'Form 1000',
    figureLabel: 'signed by your nominator',
  },
  {
    title: 'Permanent residence',
    who: 'You and your family',
    body: 'The grant is permanent residence — for you, your partner and dependent children under 23, at the same time and in the same application. Medicare from day one.',
    note: 'No provisional stage, and no condition tying you to a particular state.',
    figure: 'Day 1',
    figureLabel: 'permanent residence',
  },
];

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to apply for Australia’s National Innovation Visa (subclass 858)',
  inLanguage: 'en',
  url: `${PAGE_URL}#steps`,
  step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.body, url: `${PAGE_URL}#steps` })),
};

// Visa application charge from 1 July 2026, as secondary sources report it.
// Not confirmed against Home Affairs — the caption and note say so.
const charges = [
  { label: 'Main applicant', amount: 'about AUD 6,235', note: 'Secondary sources; they disagree with each other' },
  { label: 'Each additional applicant aged 18 or over', amount: 'about AUD 3,120', note: 'Secondary sources' },
  { label: 'Each additional applicant under 18', amount: 'about AUD 1,560', note: 'Secondary sources' },
  { label: 'Second instalment — no functional English', amount: 'not stated here', note: 'Paid instead of a refusal, by the applicant and each family member 18 or over without functional English' },
];

const rights = [
  { title: 'Permanent residence on day one', content: 'The grant is permanent residence. No provisional stage, and no condition tying you to a particular state.', positive: true },
  { title: 'Invitation only', content: 'There is no way in unless the Australian government invites you. April–June 2026: 2,166 EOIs, 248 invitations.', positive: false },
  { title: 'Family in one application', content: 'Your partner and dependent children under 23 get permanent residence at the same time and in the same application.', positive: true },
  { title: 'No team applications', content: 'The application is individual. Each co-founder must apply separately on their own record; what fits inside one application is a partner and dependent children, not teammates.', positive: false },
  { title: 'Medicare', content: 'Medicare from day one, for you and the family granted with you.', positive: true },
  { title: 'The 60-day clock', content: 'An invitation starts a 60-day clock to lodge in ImmiAccount and pay the charge. Miss it and you are back at the start.', positive: false },
  { title: 'No points test, no sponsor', content: 'No points test, no sponsor and no investment threshold. Functional English is a lower bar than the points-tested visas use.', positive: true },
  { title: 'Under 18, or 55 and over', content: 'There is no absolute age cap, but these applicants must separately demonstrate exceptional benefit to the Australian community.', positive: false },
];

// Answers verbatim from the previous page; questions reworded as people search them.
const faqs = [
  {
    q: 'Is the National Innovation Visa a startup visa?',
    a: 'No, and the name misleads. Subclass 858 is Australia\'s Distinguished Talent visa renamed, and it replaced the Global Talent programme. It is assessed on the individual against a standard of exceptional and outstanding international achievement — not on a company, a business plan or a pitch deck. A founder at idea or seed stage does not meet it, however good the idea. There is no startup route underneath it either: subclass 188, the business innovation and investment stream, closed to new applications in 2024.',
  },
  {
    q: 'Can a founding team apply for the National Innovation Visa together?',
    a: 'No. The application is individual. Each co-founder must apply separately on their own record. What fits inside one application is a partner and dependent children, not teammates.',
  },
  {
    q: 'How hard is it to get a National Innovation Visa invitation, really?',
    a: 'The invitation is the wall. April–June 2026: 2,166 EOIs, 248 invitations. January–March 2026: 1,815 EOIs, 146 invitations. That is roughly one invitation for every nine expressions of interest. Once you hold an invitation the visa application itself succeeds at a very high rate — which is why quoting the grant rate without the invitation rate is so misleading.',
  },
  {
    q: "Doesn't the migration program have thousands of places?",
    a: 'It does — around 4,300 allocated to this category for 2025-26 — and that is not the constraint. Two published rounds issued 394 invitations between them. Places are not scarce; invitations are. Any pitch that sells you urgency on "the quota is filling up" has the mechanism backwards, and urgency produces weak files, which do not get invited.',
  },
  {
    q: 'Should I get a state nomination for the National Innovation Visa?',
    a: 'The standard advice is yes, because a government nomination on Form 1000 places you in Priority 2. The published breakdown inverts it. In April–June 2026 Priority 2 drew fewer than 20 invitations while Priority 3 — exceptional achievement in a Tier 1 sector — drew 192. The quarter before, 15 against 113. If you have a genuine Tier 1 record, the direct route is where the invitations actually are, and spending six months chasing a nomination can move you from the widest lane into the narrowest. Nomination is not a bad option; it is not the golden key it is sold as.',
  },
  {
    q: 'Which Ministerial Direction applies to the National Innovation Visa?',
    a: 'Direction 120, in force since 25 July 2026, which revoked Direction 112. There are now five priority groups rather than four — the fifth is a catch-all for all other Class BX applications — and the direction covers the whole Class BX, including Global Talent and Distinguished Talent applications still on hand. It applies to undecided applications lodged before it commenced, not only to new ones. Any guide still citing Direction 112 has not been reviewed since July.',
  },
  {
    q: 'What are the National Innovation Visa priority sectors?',
    a: 'Tier 1: critical technologies (artificial intelligence, advanced robotics, cyber security, quantum, photonics, biotechnology, autonomous systems, advanced ICT, advanced manufacturing and materials, clean energy generation and storage, and positioning, timing and sensing); renewables and low emission technologies (renewable generation, green metals, renewable hydrogen, waste-to-energy); and health industries (medical manufacturing, genomics, pharmaceuticals, antimicrobial resistance, implantable devices). Tier 2: agri-food and AgTech, defence capabilities and space, education, financial services and FinTech, infrastructure and transport, and resources.',
  },
  {
    q: 'What counts as exceptional and outstanding achievement?',
    a: 'Something measurable at a global scale, not a strong CV. International patents and IP. Peer-reviewed publications with high citation counts. Founding and exiting a business, or raising substantial capital. Broad international media coverage. Remuneration far above the industry standard. And one condition that gets lost: you must still be prominent. An achievement from a decade ago that did not continue will not carry the file.',
  },
  {
    q: 'Who can be my nominator on Form 1000?',
    a: 'An Australian citizen, permanent resident, eligible New Zealand citizen, an Australian organisation, or a government agency. The category matters less than the standing: they must have a national reputation in Australia in your own field. A former colleague who happens to be a citizen is not eligible, and a weak nominator is one of the recurring reasons strong files fail.',
  },
  {
    q: 'Is there an age limit for the National Innovation Visa?',
    a: 'No absolute cap. Applicants under 18, or 55 and over, must separately demonstrate exceptional benefit to the Australian community. Over 55 is not closed — it is harder, and the "still prominent" test does most of the work.',
  },
  {
    q: 'What English does the National Innovation Visa require?',
    a: 'Functional English — a lower bar than the points-tested visas use. If you do not have it the application is not refused; you pay a second instalment of the visa application charge instead. It applies to the applicant and to every accompanying family member aged 18 or over.',
  },
  {
    q: 'How much does the National Innovation Visa cost?',
    a: 'The visa application charge rose on 1 July 2026. Secondary sources put the main applicant near AUD 6,235, with roughly AUD 3,120 per additional applicant aged 18 or over and AUD 1,560 under 18 — but those sources disagree with each other, and we could not read the figure off Home Affairs directly. The charge is indexed every 1 July, so take the current number from the Department before you budget, and treat any figure quoted to you without a date as unreliable.',
  },
];

// Home Affairs blocks automated reads and no deep Home Affairs URL is recorded
// in this repo, so every entry links the Department's home page.
const HOME_AFFAIRS = 'https://immi.homeaffairs.gov.au/';
const sources = [
  { name: 'Department of Home Affairs — National Innovation visa (subclass 858)', what: 'Eligibility, the nominator and Form 1000, the 60-day lodgement window, family members, functional English and the visa application charge.', checked: '9 Sep 2026' },
  { name: 'Department of Home Affairs — invitation rounds', what: 'EOIs, invitations, priority groups and sectors for January–March and April–June 2026, as reported 11 Aug 2026.', checked: '9 Sep 2026' },
  { name: 'Ministerial Direction 120', what: 'In force 25 July 2026, revoking Direction 112: the five priority groups and the Tier 1 and Tier 2 sectors.', checked: '9 Sep 2026' },
];

// Three English articles on visaroads.com about Australia, each fetched on
// 2026-10-29 (HTTP 200) for its title, description, cover, date and reading
// time. There is no /blog/category/australia (404), so no category link.
const reads = [
  {
    slug: 'how-to-qualify-for-skilled-worker-visa-australia',
    stage: 'If 858 is out of reach',
    title: 'How to Qualify for a Skilled Worker Visa in Australia',
    excerpt: 'The criteria for an Australian skilled worker visa: minimum requirements, points calculation and documentation.',
    date: { iso: '2026-10-01', label: '1 Oct 2026' },
    minutes: 6,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/10/d94211ba6057c15debbbb5eec31c65c2.jpg',
  },
  {
    slug: 'how-startup-founders-meet-australia-partner-visa-requirements',
    stage: 'With your partner',
    title: 'How Startup Founders Can Meet Australia Partner Visa Requirements',
    excerpt: 'Meeting Australia’s partner visa requirements as a founder, with practical steps for relationship and business documentation.',
    date: { iso: '2026-10-14', label: '14 Oct 2026' },
    minutes: 6,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/10/75a99bbd6c80489d9fa8ab6e5e1c0704.jpg',
  },
  {
    slug: 'build-investable-mvp-australia-skilled-migration-points',
    stage: 'Building the evidence',
    title: 'Build an Investable MVP for Australia’s Skilled Migration Points',
    excerpt: 'Shaping an MVP that shows traction and commercial promise, with tactical steps for validation and documentation.',
    date: { iso: '2026-09-16', label: '16 Sep 2026' },
    minutes: 6,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/09/fc6e35c5eeab9d031fb0aaa5cf39939d.jpg',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

const label = 'font-sans text-xs font-bold uppercase tracking-[0.18em]';

export default function AustraliaPage() {
  return (
    <div className="w-full overflow-x-clip bg-[#F2F0E9] text-[#1a1a1a]">
      <JsonLd data={[howToJsonLd, faqJsonLd(faqs.map((f) => ({ question: f.q, answer: f.a })), 'en')]} />

      <RouteProvider stops={STOPS} flag="au" theme={THEME}>
        {/* ── Hero: the answer up front ── */}
        <header className="relative overflow-hidden bg-[#0a0e1a] text-white">
          <Image
            src="/fa/img/australia.webp"
            alt="Sydney Harbour at dusk, the Opera House sails at left and the arch of the Harbour Bridge crossing the water"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_45%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/95 via-[#0a0e1a]/75 to-[#0a0e1a]/30" />

          <div className="container relative mx-auto grid grid-cols-1 items-end gap-8 px-6 pb-12 pt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <nav aria-label="Breadcrumb" className="font-sans text-xs text-white/60 lg:col-span-2">
              <ol className="flex flex-wrap gap-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link href="/country" className="hover:text-white">Countries</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-white/85">Australia</li>
              </ol>
            </nav>

            <div>
              <div className={`mb-5 flex items-center gap-3 text-white/75 ${label}`}>
                <Flag code="au" uid="hero" width={44} />
                National Innovation Visa · Subclass 858
              </div>
              <h1>
                <span className="block font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.02em]">
                  Australia <em className="text-[#5cb87f]">by invitation.</em>
                </span>
                <span className="mt-4 block max-w-[46ch] font-sans text-lg font-medium leading-snug">
                  The Australian National Innovation Visa (subclass 858) in 2026, step by step
                </span>
              </h1>
              <p className="mt-3 max-w-[56ch] font-sans text-base leading-relaxed text-white/70">
                Permanent residence on day one, with no points test, no sponsor and no investment threshold — and no way in unless the Australian
                government invites you. In April–June 2026 it received 2,166 expressions of interest and issued 248 invitations.
              </p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-white/60">
                <span>By <span className="text-white">Farjad P.D</span></span>
                <span>Updated <time dateTime={UPDATED.iso} className="text-white">{UPDATED.label}</time></span>
                <span>Figures checked against Home Affairs invitation rounds and Ministerial Direction 120</span>
              </p>
              <p className="mt-5 max-w-[60ch] border-l-2 border-[#5cb87f] pl-3 font-sans text-sm text-white/70">
                <strong className="text-white">The rules moved in July 2026.</strong> Ministerial Direction 120 revoked Direction 112 on 25 July: five
                priority groups now, not four. The visa application charge rose on 1 July.
              </p>
            </div>

            <aside aria-label="How to use this page" className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <p className={`text-[#5cb87f] ${label}`}>Your route through this page</p>
              <ol className="my-4 list-decimal space-y-1 pl-5 font-sans text-sm text-white/75">
                <li>Check your record against the standard</li>
                <li>See how few EOIs are invited</li>
                <li>Find the lane the invitations go to</li>
                <li>Walk the five stages</li>
                <li>Sort perks from catches</li>
              </ol>
              <a href="#gate" className="inline-flex items-center gap-2 rounded-full bg-[#00843D] px-5 py-3 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
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
          question="What is Australia’s National Innovation Visa (subclass 858)?"
          task="Read the four facts"
          completeOn="view"
          message="Snapshot read"
          answer={
            <p>
              The National Innovation Visa, subclass 858, is invitation-only permanent residence that replaced the Global Talent programme. There is no
              points test, no sponsor and no investment threshold, and your partner and dependent children under 23 get permanent residence in the same
              application. The catch is the invitation: 248 were issued from 2,166 expressions of interest in April–June 2026.
            </p>
          }
        >
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { stat: 'Day 1', label: 'Permanent residence', sub: 'no provisional stage' },
              { stat: '1 in 9', label: 'EOIs invited', sub: 'April–June 2026 round' },
              { stat: '60', label: 'Days to lodge', sub: 'after an invitation' },
              { stat: 'U-23', label: 'Children included', sub: 'PR at the same time' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white p-5 transition-transform hover:-translate-y-1">
                <dt className="order-2 mt-2 font-sans text-sm font-bold">{s.label}</dt>
                <dd className="order-1 font-serif text-4xl text-[#006B31]">{s.stat}</dd>
                <dd className="order-3 font-sans text-xs text-[#1a1a1a]/55">{s.sub}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 grid max-w-5xl grid-cols-1 gap-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            <p>
              <strong className="text-[#1a1a1a]">Permanent residence on day one. 248 invitations last quarter.</strong> No points test, no sponsor, no
              investment threshold — and no way in unless the Australian government invites you.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">The invitation is the wall.</strong> Once you hold an invitation the visa application itself succeeds
              at a very high rate. Everything else on this page is downstream of clearing it.
            </p>
          </div>
        </RouteStop>

        {/* 02 — The misnomer */}
        <RouteStop
          id="startup"
          number={2}
          tone="white"
          eyebrow="First, the misnomer"
          question="Is the National Innovation Visa a startup visa?"
          task="Read why not"
          completeOn="view"
          message="Misnomer cleared"
          answer={
            <p>
              No. Subclass 858 is Australia&rsquo;s Distinguished Talent visa renamed, assessed on the individual against a standard of exceptional and
              outstanding international achievement — not on a company, a business plan or a pitch deck. A founding team cannot apply together, and
              subclass 188, the business innovation and investment stream, closed to new applications in 2024.
            </p>
          }
        >
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="grid content-start gap-5 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              <p>
                Subclass 858 is Australia&rsquo;s <strong className="text-[#1a1a1a]">Distinguished Talent visa renamed</strong>, and it replaced the
                Global Talent programme. It is assessed on the individual against a standard of exceptional and outstanding international achievement —
                not on a company, a business plan or a deck.
              </p>
              <p>
                Two consequences follow. A founding team cannot apply together: the application is individual, and each co-founder needs their own
                record. And a founder at idea or seed stage does not meet the standard, however good the idea.
              </p>
              <p>
                There is no safety net beneath it, either. Subclass 188 — the business innovation and investment stream —{' '}
                <strong className="text-[#1a1a1a]">closed to new applications in 2024</strong>. Australia today has no startup visa in the sense that
                Denmark, Finland and Estonia have one.
              </p>
              <ul className="flex flex-wrap gap-2 font-sans text-sm">
                {[
                  { href: '/country/denmark', label: 'Start-up Denmark' },
                  { href: '/country/finland', label: 'Finland startup permit' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex items-center gap-1.5 rounded-full border border-[#1a1a1a]/15 px-3.5 py-1.5 transition-colors hover:border-[#006B31] hover:text-[#006B31]">
                      {l.label} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <figure className="relative min-h-[280px] overflow-hidden rounded-2xl">
              <Image
                src="/fa/img/australia-2.webp"
                alt="Aerial view of Sydney's central business district, dense office towers with the harbour beyond"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </figure>
          </div>
        </RouteStop>

        {/* 03 — Who qualifies */}
        <RouteStop
          id="gate"
          number={3}
          eyebrow="The standard · exceptional and outstanding"
          question="Who qualifies for the National Innovation Visa?"
          task="Answer all four"
          answer={
            <p>
              Someone whose record is exceptional and outstanding at an international level, and still current: international patents, highly cited
              research, a company founded and exited or substantial capital raised, broad international media coverage, or pay far above the industry
              standard. You also need a nominator with a national reputation in Australia in your own field, who signs Form 1000.
            </p>
          }
        >
          <GateQuiz
            stopId="gate"
            criteria={criteria}
            strongNote="Then the wall is the invitation: in April–June 2026, 248 of 2,166 EOIs drew one."
            gapNote="There is no startup route underneath: subclass 188 closed to new applications in 2024."
          >
            <h3 className="font-serif text-xl">How many EOIs get an invitation?</h3>
            <div>
              <p className="mb-2 font-sans text-sm text-[#1a1a1a]/60">
                <b className="tabular-nums text-[#1a1a1a]">248 of 2,166</b> EOIs drew an invitation in April–June 2026 — about 11 in 100
              </p>
              <ApprovalDots approved={11} />
            </div>
            <ul className="grid gap-1.5 font-sans text-sm text-[#1a1a1a]/65">
              <li><b className="tabular-nums text-[#1a1a1a]">146 of 1,815</b> the quarter before, January–March 2026</li>
              <li><b className="tabular-nums text-[#1a1a1a]">55+</b> or under 18: exceptional benefit to the Australian community, shown separately</li>
            </ul>
            <Link href="/book-meeting" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#00843D] px-5 py-3 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
              Get a free read on your record <ArrowRight className="h-4 w-4" />
            </Link>
          </GateQuiz>

          <div className="mt-10">
            <h3 className="mb-2 font-serif text-2xl">What carries weight in the file</h3>
            <p className="mb-6 max-w-2xl font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              Not a strong CV — something measurable at a global scale. These are what carry weight, and the file is built by making them countable
              rather than asserting them.
            </p>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {evidence.map((c) => (
                <li key={c.title} className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-5">
                  <c.icon aria-hidden="true" className="mb-4 h-6 w-6 text-[#006B31]" />
                  <h4 className="mb-2 font-serif text-xl">{c.title}</h4>
                  <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]/65">{c.desc}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
              <p className="border-l-2 border-[#00843D] pl-4 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
                <strong className="text-[#1a1a1a]">And the condition that gets lost in every checklist: you must still be prominent.</strong> An
                achievement from a decade ago that did not continue will not carry the file. The assessor is asking where you stand in your field now.
              </p>
              <p className="border-l-2 border-[#00843D] pl-4 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
                <strong className="text-[#1a1a1a]">The nominator.</strong> The category matters less than the standing: a national reputation in
                Australia in your own field. A former colleague who happens to be a citizen is not eligible, and a weak nominator is one of the
                recurring reasons strong files fail.
              </p>
            </div>
          </div>
        </RouteStop>

        {/* 04 — The odds */}
        <RouteStop
          id="odds"
          number={4}
          tone="night"
          eyebrow="Invitation rounds · Department of Home Affairs"
          question="How hard is it to get a National Innovation Visa invitation?"
          task="Read both rounds"
          completeOn="view"
          message="Rounds read"
          answer={
            <p>
              The invitation is the wall. The Department received 2,166 expressions of interest and issued 248 invitations in April–June 2026, and 1,815
              and 146 in January–March: roughly one invitation for every nine EOIs. Places are not the constraint — around 4,300 were allocated for
              2025-26. Once invited, the visa application itself succeeds at a very high rate.
            </p>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse font-sans text-sm">
              <caption className="pb-3 text-left font-bold text-white">
                National Innovation Visa invitation rounds, 2026 (Department of Home Affairs, as reported 11 Aug 2026)
              </caption>
              <thead>
                <tr className="border-b border-white/20 text-left text-[11px] uppercase tracking-[0.1em] text-white/60">
                  {['Round', 'EOIs', 'Invitations', 'Priority 1', 'Priority 2', 'Priority 3', 'Priority 4'].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rounds.map((r) => (
                  <tr key={r.period} className="border-b border-white/10">
                    <th scope="row" className="px-4 py-4 text-left font-bold">{r.period}</th>
                    <td className="px-4 py-4 font-serif text-2xl tabular-nums">{r.eois}</td>
                    <td className="px-4 py-4 font-serif text-2xl tabular-nums text-[#5cb87f]">{r.invites}</td>
                    <td className="px-4 py-4 tabular-nums text-white/70">{r.p1}</td>
                    <td className="px-4 py-4 tabular-nums text-white/70">{r.p2}</td>
                    <td className="px-4 py-4 font-bold tabular-nums">{r.p3}</td>
                    <td className="px-4 py-4 tabular-nums text-white/70">{r.p4}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <p className="max-w-[64ch] font-sans text-[15px] leading-relaxed text-white/70">
              The Department publishes what each round did. These are the only figures worth planning against — and note the shape holds across both
              quarters, so this is not a one-off. Once you hold an invitation the visa application itself succeeds at a very high rate, which is exactly
              why quoting a grant rate without an invitation rate misleads.
            </p>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <h3 className="font-serif text-2xl">Places are not scarce; invitations are</h3>
              <dl className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <dt className="order-2 font-sans text-xs text-white/60">places allocated, 2025-26 (around)</dt>
                  <dd className="order-1 font-serif text-4xl tabular-nums">4,300</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="order-2 font-sans text-xs text-white/60">invitations across the two published rounds</dt>
                  <dd className="order-1 font-serif text-4xl tabular-nums text-[#5cb87f]">394</dd>
                </div>
              </dl>
              <p className="mt-4 font-sans text-sm leading-relaxed text-white/65">
                Any pitch that sells you urgency on &ldquo;the quota is filling up&rdquo; has the mechanism backwards, and urgency produces weak files,
                which do not get invited.
              </p>
            </div>
          </div>
        </RouteStop>

        {/* 05 — Priority lanes */}
        <RouteStop
          id="lanes"
          number={5}
          eyebrow="Priority groups · Ministerial Direction 120"
          question="Does a state nomination help you get a National Innovation Visa invitation?"
          task="Guess the lane"
          answer={
            <p>
              Less than the standard advice says. A government nomination on Form 1000 places you in Priority 2, but in April–June 2026 Priority 2 drew
              fewer than 20 invitations while Priority 3 — exceptional achievement in a Tier 1 sector — drew 192. The quarter before, 15 against 113.
              Ministerial Direction 120 has set the priority groups since 25 July 2026.
            </p>
          }
        >
          <LaneGuess
            stopId="lanes"
            prompt="The standard advice: get a state nomination, it puts you in Priority 2. Which lane drew more invitations in April–June 2026?"
            lanes={lanes}
            choices={['p2', 'p3']}
            answer="p3"
            rounds={laneRounds}
            rightNote="Priority 3 drew 192 invitations; Priority 2 fewer than 20. If your record is genuinely Tier 1, the direct route is where the invitations are."
            wrongNote="Priority 2 drew fewer than 20 invitations; Priority 3 drew 192. Six months spent chasing a nomination can move you out of the widest lane into the narrowest."
            scaleNote="Ranges published as “<5” and “<20” are drawn at their upper bound."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="grid content-start gap-6">
              <div className="font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
                <h3 className="mb-2 font-serif text-2xl text-[#1a1a1a]">State nomination is the narrowest lane</h3>
                <p>
                  The standard advice is to chase a government nomination on Form 1000, because it places you in Priority 2. Read the columns again.
                  Priority 2 drew fewer than 20 invitations in the better of these two quarters, and 15 in the other. Priority 3 — exceptional
                  achievement in a Tier 1 sector — drew 192 and 113. If your record is genuinely Tier 1, the direct route is where the invitations are,
                  and six months spent chasing a nomination can move you out of the widest lane into the narrowest.
                </p>
              </div>
              <div className="rounded-2xl bg-[#0d1017] p-6 font-sans text-sm leading-relaxed text-white/75">
                <h3 className="mb-2 font-serif text-2xl text-white">Direction 120, not 112</h3>
                <p>
                  In force since <strong className="text-white">25 July 2026</strong>, revoking Direction 112. Five priority groups rather than four —
                  the fifth is a catch-all for all other Class BX applications — covering the whole Class BX, including Global Talent and Distinguished
                  Talent applications still on hand, and undecided applications lodged before it commenced.
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
                <caption className="pb-2 text-left font-bold">Where the 248 went: invitations by sector, April–June 2026</caption>
                <thead>
                  <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                    <th scope="col" className="px-4 py-3">Sector</th>
                    <th scope="col" className="px-4 py-3 text-right">Invitations</th>
                    <th scope="col" className="w-[40%] px-4 py-3"><span className="sr-only">Share of the largest sector</span></th>
                  </tr>
                </thead>
                <tbody>
                  {sectorSplit.map((s) => (
                    <tr key={s.name} className="border-b border-[#1a1a1a]/10 last:border-0">
                      <th scope="row" className="px-4 py-2.5 text-left font-normal">{s.name}</th>
                      <td className="px-4 py-2.5 text-right tabular-nums">{s.n}</td>
                      <td className="px-4 py-2.5" aria-hidden="true">
                        <span className="block h-2 rounded-full bg-[#00843D]/70" style={{ width: `${(s.n / sectorSplit[0].n) * 100}%` }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 font-sans text-xs leading-relaxed text-[#1a1a1a]/55">
                Critical technologies took almost half of one quarter&rsquo;s invitations. Outside the three Tier 1 sectors you are competing globally
                for a few dozen a quarter.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="mb-4 font-serif text-2xl">Which sectors are Tier 1 and Tier 2?</h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              {tiers.map((t) => (
                <div key={t.tier} className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-5">
                  <p className={`mb-3 text-[#006B31] ${label}`}>{t.tier}</p>
                  <ul className="grid gap-2.5 font-sans text-sm">
                    {t.sectors.map((s) => (
                      <li key={s.name}>
                        <b className="block">{s.name}</b>
                        {s.detail && <span className="text-[#1a1a1a]/60">{s.detail}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </RouteStop>

        {/* 06 — How to apply */}
        <RouteStop
          id="steps"
          number={6}
          tone="white"
          eyebrow="Step by step · five stages, one that decides it"
          question="How do you apply for the National Innovation Visa?"
          task="Walk to stage 5"
          answer={
            <p>
              In five stages. Submit an Expression of Interest with evidence of your achievements; wait for an invitation, which is the stage that
              decides the outcome; lodge the formal application in ImmiAccount within 60 days of being invited; provide Form 1000 signed by your
              nominator plus identity, health, biometric and police checks; then receive permanent residence for you and your family.
            </p>
          }
        >
          <StepWalker stopId="steps" steps={steps} />
          <p className="mt-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            <strong className="text-[#1a1a1a]">Have the nominator lined up before the invitation arrives.</strong> The 60-day clock to lodge starts the
            day you are invited; miss it and you are back at the start.
          </p>
        </RouteStop>

        {/* 07 — Cost */}
        <RouteStop
          id="money"
          number={7}
          eyebrow="Visa application charge · from 1 July 2026"
          question="How much does the National Innovation Visa cost in 2026?"
          task="Read the charges"
          completeOn="view"
          message="Charges read"
          answer={
            <p>
              The visa application charge rose on 1 July 2026. Secondary sources put the main applicant near AUD 6,235, with roughly AUD 3,120 per
              additional applicant aged 18 or over and AUD 1,560 under 18, but they disagree with each other. The charge is indexed every 1 July, so
              take the current figure from Home Affairs.
            </p>
          }
        >
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
                <caption className="pb-2 text-left font-bold">
                  Visa application charge from 1 July 2026, as reported by secondary sources (not confirmed with Home Affairs)
                </caption>
                <thead>
                  <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                    <th scope="col" className="px-4 py-3">Applicant</th>
                    <th scope="col" className="px-4 py-3">Charge</th>
                    <th scope="col" className="px-4 py-3">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {charges.map((c) => (
                    <tr key={c.label} className="border-b border-[#1a1a1a]/10 last:border-0">
                      <th scope="row" className="px-4 py-3 text-left font-normal">{c.label}</th>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums">{c.amount}</td>
                      <td className="px-4 py-3 text-xs text-[#1a1a1a]/60">{c.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid content-start gap-4 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
              <p className="rounded-2xl bg-[#E3F2E8] p-5 text-[#1a1a1a]">
                <strong>Why no calculator here.</strong> Those sources disagree with each other, and we could not read the figure off Home Affairs
                directly. Treat any figure quoted to you without a date as unreliable, and take the current number from the Department before you
                budget.
              </p>
              <p>
                <strong className="text-[#1a1a1a]">Functional English</strong> — a lower bar than the points-tested visas use. If you do not have it the
                application is not refused; you pay a second instalment of the visa application charge instead. It applies to the applicant and to
                every accompanying family member aged 18 or over.
              </p>
            </div>
          </div>
        </RouteStop>

        {/* 08 — Rights */}
        <RouteStop
          id="life"
          number={8}
          tone="white"
          eyebrow="Perk or catch?"
          question="What does the National Innovation Visa give you and your family?"
          task="Guess all eight"
          answer={
            <p>
              Permanent residence from the day it is granted, with no provisional stage and no condition tying you to a particular state. Your partner and
              dependent children under 23 get it at the same time, in the same application, and Medicare applies from day one. What it does not give is
              a team visa: each co-founder applies separately.
            </p>
          }
        >
          <PerkOrCatch stopId="life" items={rights} />
        </RouteStop>

        {/* Photo band */}
        <figure className="relative flex min-h-[360px] items-end overflow-hidden bg-[#0a0e1a] text-white">
          <ParallaxLayer>
            <Image
              src="/fa/img/australia-3.webp"
              alt="A pink tram on a tree-lined Melbourne street, its destination sign lit, pedestrians on the footpath"
              fill
              sizes="100vw"
              className="object-cover object-[center_55%]"
            />
          </ParallaxLayer>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0e1a]/20 to-[#0a0e1a]/90" />
          <figcaption className="container relative mx-auto flex flex-wrap items-end justify-between gap-5 px-6 py-10">
            <div>
              <p className={`text-[#5cb87f] ${label}`}>Stage 5 · Permanent residence</p>
              <p className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
                No provisional stage.<br />
                <span className="italic text-[#5cb87f]">No state condition.</span>
              </p>
            </div>
            <span className="font-sans text-xs text-white/60">A tram in Melbourne</span>
          </figcaption>
        </figure>

        {/* 09 — Guarantees */}
        <RouteStop
          id="promise"
          number={9}
          eyebrow="Our role · what we will not promise"
          question="Can anyone guarantee a National Innovation Visa invitation?"
          task="Read what we will not promise"
          completeOn="view"
          message="Promise read"
          answer={
            <p>
              No. The gate is a government invitation that nobody outside the Department of Home Affairs controls, issued at a published rate near one in
              nine. That is why we offer no refund undertaking on this route. If anyone sells you a guaranteed invitation, or a refund if the invitation
              does not come, walk away.
            </p>
          }
        >
          <div className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
            <p className="font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              We are not registered migration agents and we do not lodge in ImmiAccount. What we work on is the part that is actually movable: the
              strength of your evidence. Auditing and documenting the record; establishing which sector and priority you sit in; deciding honestly
              whether the direct route or a nomination is better for you; identifying nominators who really do hold a national reputation in your field;
              writing the EOI narrative so it connects to Australia&rsquo;s stated priorities. On the legal stage we work alongside a MARA-registered
              agent, not instead of one.
            </p>
            <div className="rounded-2xl border-l-4 border-[#b45309] bg-white p-6">
              <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]/80">
                <ShieldAlert aria-hidden="true" className="mr-2 inline h-4 w-4 text-[#b45309]" />
                <strong>There is no refund undertaking on this route, and the reason matters.</strong> On our other routes an identified body evaluates
                the case — Business Finland, the Danish expert panel, a technopark committee — and we undertake to obtain its approval. Here the gate is a
                government invitation nobody outside the Department controls, at a published rate near one in nine. An undertaking tied to that would be
                a promise we could not keep. If anyone sells you a guaranteed invitation, or a refund if the invitation does not come, walk away.
              </p>
            </div>
          </div>
        </RouteStop>

        {/* 10 — FAQ */}
        <RouteStop
          id="faq"
          number={10}
          tone="white"
          eyebrow="Questions that actually get asked"
          question="What else do people ask about the National Innovation Visa?"
          task="Open three answers"
          answer={
            <p>
              Twelve answers to what people actually ask about subclass 858: whether it is a startup visa, whether a team can apply together, the real
              invitation odds, the places allocated, state nomination, Ministerial Direction 120, the priority sectors, what counts as exceptional
              achievement, nominators, age, English and the 2026 charge.
            </p>
          }
        >
          <div className="max-w-4xl border-t border-[#1a1a1a]/10">
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
          <OpenedTracker stopId="faq" need={3} message="Questions answered" />
        </RouteStop>

        {/* Sources */}
        <section aria-labelledby="sources-h" className="border-b border-[#1a1a1a]/10 bg-[#F2F0E9] px-6 py-14">
          <div className="container mx-auto">
            <p className={`text-[#006B31] ${label}`}>Where these figures come from</p>
            <h2 id="sources-h" className="mt-2 font-serif text-3xl">Sources</h2>
            <ol className="mt-6 grid max-w-4xl list-decimal gap-2 pl-5 font-sans text-sm">
              {sources.map((s) => (
                <li key={s.name}>
                  <a href={HOME_AFFAIRS} target="_blank" rel="noopener noreferrer" className="font-bold underline decoration-[#00843D] underline-offset-2 hover:text-[#006B31]">
                    {s.name}
                  </a>{' '}
                  <span className="text-[#1a1a1a]/60">{s.what} Checked {s.checked}.</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 max-w-3xl font-sans text-xs text-[#1a1a1a]/55">
              Each link goes to the Department of Home Affairs home page, immi.homeaffairs.gov.au. Home Affairs blocks automated reads, so we link the
              Department rather than a page address we could not confirm.
            </p>
          </div>
        </section>

        {/* Book a session */}
        <section id="book" aria-labelledby="book-h" className="scroll-mt-32 bg-[#0a0e1a] px-6 py-16 text-white">
          <div className="container mx-auto grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <div>
              <RouteFinish />
              <p className={`text-[#5cb87f] ${label}`}>Talk it through</p>
              <h2 id="book-h" className="mt-2 font-serif text-4xl leading-tight">
                Does your record <span className="italic text-[#5cb87f]">actually clear it?</span>
              </h2>
              <p className="mt-3 max-w-[52ch] font-sans text-white/70">
                That is the only question worth answering first, and it is answerable before you spend anything. If the honest answer is no, we would
                rather tell you which route does fit.
              </p>
              <ul className="my-5 flex flex-wrap gap-2 font-sans text-xs">
                {['Free · 60 minutes', 'Online, Google Meet', 'Link sent after booking'].map((p) => (
                  <li key={p} className="rounded-full border border-white/25 px-3 py-1.5">{p}</li>
                ))}
              </ul>
              <Link href="/book-meeting" className="inline-flex items-center gap-2 rounded-full bg-[#00843D] px-6 py-3.5 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
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
                <p className={`text-[#006B31] ${label}`}>Keep reading</p>
                <h2 id="reads-h" className="mt-2 font-serif text-3xl md:text-4xl">More Australia guides</h2>
              </div>
              <Link href="/country" className="inline-flex items-center gap-1.5 font-sans text-sm font-bold text-[#006B31] hover:underline">
                All jurisdictions <ArrowRight className="h-4 w-4" />
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
                      <span className={`text-[#006B31] ${label}`}>{r.stage}</span>
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

      {/* Notice — the previous page had none; this says only what the header comment supports. */}
      <section className="border-t border-[#1a1a1a]/10 bg-[#F9F9F9] px-6 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <ShieldAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#1a1a1a]/30" />
            <p className="font-sans text-[11px] leading-relaxed text-[#1a1a1a]/55">
              <strong>Notice:</strong> Figures on this page were verified on 9 September 2026 against the Department of Home Affairs&apos; published
              invitation rounds (as reported 11 August 2026) and Ministerial Direction 120. The visa application charge is shown as secondary sources
              report it: they disagree with each other, and Home Affairs blocks automated reads, so it could not be confirmed directly. This page is for
              information only. VisaRoads Inc., an Ashavid company, is not a registered migration agent and does not lodge applications. Always verify
              current requirements and charges with the Department of Home Affairs at{' '}
              <a href={HOME_AFFAIRS} target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-[#006B31]">immi.homeaffairs.gov.au</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-[#1a1a1a]/10" data-faq>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 transition-colors hover:text-[#006B31] group-open:text-[#006B31] [&::-webkit-details-marker]:hidden">
        <h3 className="font-serif text-xl leading-snug">{q}</h3>
        <span aria-hidden="true" className="font-serif text-2xl transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="max-w-[72ch] pb-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/65">{a}</p>
    </details>
  );
}
