// ============================================================================
// Page: app/[locale]/(public)/country/canada/page.tsx
// Style: Modernist Editorial + "Northern Red" Theme
// Context: Canada Country Profile & Strategic Pivot (Post-2025 Changes)
//
// Layout: a guided route, built on the Finland page's pattern. A compact
// Toronto hero, a sticky rail whose Canadian flag rises as the reader
// completes each stop, and one stop per question people actually search.
// Every stop opens with its question as the H2 and a ~50-word direct answer
// (the passage answer engines quote), then the detail. All copy is rendered
// on the server. The two Canada-shaped games (HQ picker, which-door finder)
// live next to this file in CanadaWidgets.tsx.
//
// The Start-up Visa status comes from lib/canada-suv.ts (canada.ca, verified
// 2026-09-12) via SuvStatusNotice and SUV_STATE; never restate it by hand.
// lib/routes-v2/canada-us.ts re-checked the SUV pages on 2026-10-15 and found
// canada.ca names no successor programme; the shared notice still says IRCC
// "says a targeted entrepreneur pilot will replace the programme". Re-read
// canada.ca and reconcile lib/canada-suv.ts, not this page.
//
// Corrected 2026-10-29 from verified sources in the repo:
//  - C11 is for business owners seeking only temporary residence (at least
//    51% control, up to 18 months at a time); IRCC directs founders who want
//    to stay to the provincial streams (C60). Source: content/en/c10-work-
//    permit.ts, read on canada.ca 2026-10-13. The old page sold C11 as a road
//    to PR.
//  - Express Entry job-offer CRS points were removed on 25 March 2025.
//    Source: lib/routes-v2/canada-us.ts, CRS criteria checked 2026-10-15. The
//    old page promised "additional points for Canadian job".
//  - Provincial entrepreneur streams (AB, MB, NS, NB) are open: routes-v2,
//    provincial sites checked 2026-10-12.
//
// NOT verified against any source (kept as the page's own claims, worded as
// before): the ecosystem figures (#3 tech hub, AI researchers per capita,
// USMCA "duty-free"), the three HQ city descriptions, and the ICT bullets
// (no Letter of Support, 100% ownership, spouse work authorisation). There
// is no ICT source in the repo. Check them before quoting them anywhere else.
//
// Photos: Toronto (Unsplash 1517935706615, CN Tower, Rogers Centre, the
// waterfront) and Vancouver (Unsplash 1559511260, skyline over a marina),
// both checked by eye on 2026-10-29. No English video exists for Canada; the
// Canada videos in content/fa/videos.ts are Persian and stay off this page.
// ============================================================================

import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from '@/routing';
import { metaFor } from '@/lib/pageMeta';
import JsonLd from '@/components/JsonLd';
import SuvStatusNotice from '@/components/SuvStatusNotice';
import { SUV_SOURCES, SUV_STATE } from '@/lib/canada-suv';
import { MAIN_CONTACT } from '@/content/contact';
import Flag from '@/components/route/flags';
import { RouteProvider, RouteRail, RouteStop, RouteFinish, type RouteStopDef, type RouteTheme } from '@/components/route/RouteProgress';
import { CopyButton, GateQuiz, ParallaxLayer, PerkOrCatch, StepWalker, type RouteStep } from '@/components/route/RouteWidgets';
import { DoorFinder, HqPicker, type Door, type HqCity } from './CanadaWidgets';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/country/canada', locale);
}

// ─── Data ────────────────────────────────────────────────────────────────────

// The latest check date of the sources the figures rest on (routes-v2, 15 Oct).
const UPDATED = { iso: '2026-10-15', label: '15 Oct 2026' };

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** "2026-06-30" → "30 June 2026", without a Date (a UTC parse can slip a day). */
const longDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};
const PAUSED_ON = longDate(SUV_STATE.pausedOn);

// The page's own palette: Canadian red on ink and paper. #D80027 reads at
// 4.66:1 on the paper (#F2F0E9) and 5.32:1 on white, and white on it at
// 5.32:1, so the red itself is the text accent. On the ink bands (#1a1a1a) it
// drops to 3.27:1, so text there uses the lighter #FF6B7F (6.35:1).
const THEME: RouteTheme = { accent: '#D80027', accentInk: '#FFFFFF', accentText: '#D80027', primary: '#1a1a1a', deep: '#1a1a1a', soft: '#FBE5E9', accentOnDark: '#FF6B7F' };

const STOPS: RouteStopDef[] = [
  { id: 'status', label: 'SUV status' },
  { id: 'routes', label: 'Open routes' },
  { id: 'test', label: 'Real business' },
  { id: 'steps', label: '5 steps' },
  { id: 'hq', label: 'Choose HQ' },
  { id: 'door', label: 'Road to PR' },
];

const routeCards = [
  {
    eyebrow: 'Permanent residency',
    title: 'Start-up Visa',
    badge: 'Paused',
    body: 'The direct PR route, and it is paused. IRCC is not accepting new applications; files submitted before the pause are still being processed, and an open work permit remains available to those applicants while their application is assessed.',
    foot: 'Closed to new applications',
  },
];

// The page's "ICT & C11" card, with C11 corrected to IRCC's own definition.
const ictBullets = ['No Letter of Support needed.', 'Full control of your equity (100% ownership).', 'Immediate work authorization for spouse.'];

const rights = [
  { title: 'No Letter of Support', content: 'Neither route needs a designated organisation behind you. You do not wait for an incubator, an angel group or a venture fund to say yes.', positive: true },
  { title: 'Open today', content: 'Unlike the Start-up Visa, the operational work permits are open to new applications today.', positive: true },
  { title: 'Your equity stays yours', content: 'Full control of your equity (100% ownership). Under C11 you must control at least 51% of the business.', positive: true },
  { title: 'Spouse can work', content: 'Immediate work authorization for spouse. Check the current spousal open work permit rules on canada.ca for your route before you plan on it.', positive: true },
  { title: 'C11 is temporary', content: 'For owners seeking only temporary residence: at least 51% control, up to 18 months at a time. Founders who intend to stay go to the provincial streams.', positive: false },
  { title: 'Job-offer points', content: 'Express Entry job-offer CRS points were removed on 25 March 2025. A Canadian job no longer adds points on its own.', positive: false },
  { title: 'A paper company', content: 'A virtual office and a passive holding company are, in our view, the weakest case you can present to an officer.', positive: false },
  { title: 'The officer decides', content: 'We prepare your work permit application on the significant-benefit case. The decision is the officer\'s, not ours.', positive: false },
];

// The page's own standard, from its "No more passive income" warning.
const criteria = [
  { title: 'Premises', body: 'A real place of business in Canada. A virtual office is, in our view, the weakest case you can present to an officer.' },
  { title: 'People in Canada', body: 'Staff on the ground, not only you. Our Canadian hiring strategy work starts here.' },
  { title: 'Revenue you can evidence', body: 'Sales an officer can see in documents, not projections alone.' },
  { title: 'An operating business', body: 'Something that trades, not a passive holding company. A business that exists only on paper does not survive scrutiny.' },
];

const steps: RouteStep[] = [
  {
    title: 'Choose your HQ',
    who: 'Toronto, Waterloo or Calgary',
    body: 'Most founders default to Toronto, but cost-efficiency lies elsewhere. Match the city to your sector: Toronto for finance and SaaS, Waterloo for deep tech, Calgary for energy and cleantech.',
    note: 'Premises are part of your case. A virtual office is the weakest one you can present.',
    figure: '3',
    figureLabel: 'cities compared below',
  },
  {
    title: 'Incorporate',
    who: 'Canadian vs foreign entity',
    body: 'Incorporation and shareholder agreement structuring: decide whether the operating company is Canadian or a branch of your foreign entity. An executive transfer (ICT) runs through your Canadian branch.',
    note: 'Under C11 you must control at least 51% of the business.',
    figure: '51%',
    figureLabel: 'minimum control under C11',
  },
  {
    title: 'Business plan',
    who: 'Significant benefit',
    body: 'A business plan focused on knowledge transfer and job creation, structured to show the company as a significant benefit to Canada\'s economy. For C11, IRCC wants a concrete start-up plan rather than a market study, with the business funds shown separately from the money your family will live on.',
    note: 'We prepare the application on that basis. The decision is the officer\'s, not ours.',
    figure: 'No LMIA',
    figureLabel: 'C10, C11 and C60 are LMIA-exempt',
  },
  {
    title: 'Port of entry',
    who: 'Border officer',
    body: 'Interview prep for border officers: the point-of-entry strategy. The decision belongs to an officer, at IRCC or at the Canada Border Services Agency, who assesses your file on its own facts.',
    note: 'Bring evidence of premises, people in Canada and revenue.',
    figure: 'POE',
    figureLabel: 'point of entry',
  },
  {
    title: 'Toward PR',
    who: 'Express Entry or a province',
    body: 'Convert to PR later via Express Entry, or through a provincial entrepreneur stream, which supports a C60 work permit and decides on nomination after the operating period. Express Entry job-offer CRS points were removed on 25 March 2025.',
    note: 'C11 is temporary by design: up to 18 months at a time, for owners seeking only temporary residence.',
    figure: '18 mo',
    figureLabel: 'C11 maximum at a time',
  },
];

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to set up a Canadian operating business for a founder work permit',
  inLanguage: 'en',
  step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.body })),
};

const ecosystem = [
  { label: 'Tech ranking', stat: '#3', body: 'Toronto is the 3rd largest tech hub in North America, trailing only Silicon Valley and NYC.' },
  { label: 'AI leadership', stat: 'Godfathers', body: 'Home to Hinton & Bengio. Montreal and Toronto have the highest concentration of AI researchers per capita.' },
  { label: 'Market access', stat: 'USMCA', body: 'Duty-free access to the US market. Launch in Toronto, sell in New York.' },
];

const cities: HqCity[] = [
  { city: 'Toronto (GTA)', sector: 'Finance & SaaS', body: 'Highest cost, highest density. Essential for Fintech and Enterprise SaaS. Access to 6M+ population.' },
  { city: 'Waterloo', sector: 'Deep Tech', body: '"The Quantum Valley". Home to Google HQ Canada and top engineering talent from UWaterloo. Lower rent than Toronto.' },
  { city: 'Calgary', sector: 'Energy & CleanTech', body: 'Highest GDP per capita. Aggressive provincial incentives for tech. Low corporate tax.' },
];

const doors: Record<Door['key'], Door> = {
  suv: {
    key: 'suv',
    title: 'Stay with your Start-up Visa file',
    body: `Applications filed before ${PAUSED_ON} are still being processed, and if you are eligible you can still apply for an open work permit while yours is assessed.`,
    link: { label: 'Start-up Visa guide', href: '/startup-visa-canada' },
  },
  c11: {
    key: 'c11',
    title: 'C11: business owner, temporary residence',
    body: 'For owners who control at least 51% of the business and want to run it in Canada and then leave. Issued for up to 18 months at a time; not a road to permanent residence.',
    link: { label: 'C10, C11 and C60 compared', href: '/c10-work-permit' },
  },
  ict: {
    key: 'ict',
    title: 'Executive transfer (ICT), then Express Entry',
    body: 'Launch your Canadian branch and transfer yourself as an executive. Convert to PR later via Express Entry, remembering that job-offer CRS points were removed on 25 March 2025.',
    link: { label: 'Talk it through, free', href: '/book-meeting' },
  },
  pnp: {
    key: 'pnp',
    title: 'A provincial entrepreneur stream (C60)',
    body: 'The province approves you, signs a performance agreement and supports a C60 work permit. You run the business, usually for up to 2 years, and the province then decides on nomination.',
    link: { label: 'Compare the five provinces', href: '/pnp' },
  },
};

const routeTable = [
  { route: 'Start-up Visa', status: `Paused since ${PAUSED_ON}`, who: 'Applicants who filed before the pause', own: '—', length: '—', pr: 'Was the direct PR route' },
  { route: 'Executive transfer (ICT)', status: 'Open', who: 'A founder whose company opens a Canadian branch', own: 'Full control (100%) possible', length: '—', pr: 'Later, via Express Entry' },
  { route: 'C11 business owner', status: 'Open', who: 'Owners seeking only temporary residence', own: 'At least 51%', length: 'Up to 18 months at a time', pr: 'No; IRCC points to the provincial streams' },
  { route: 'Provincial entrepreneur (C60)', status: 'Open in Alberta, Manitoba, Nova Scotia and New Brunswick', who: 'Founders who want to settle', own: 'Set by each province', length: 'Usually up to 2 years before nomination', pr: 'Provincial nomination, then PR' },
];

const sources = [
  { name: 'IRCC — Start-up Visa Program', href: SUV_SOURCES.program, what: 'The pause, the date, and what happens to files already filed.', checked: '15 Oct 2026' },
  { name: 'IRCC — About the Start-up Visa', href: SUV_SOURCES.about, what: 'Programme status and the open work permit for applicants in process.', checked: '15 Oct 2026' },
  { name: 'IRCC — Business owners seeking only temporary residence [R205(a) – C11]', href: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/temporary-residents/foreign-workers/exemption-codes/entrepreneurs-self-employed-seeking-only-temp-residence-r205-c11.html', what: 'The 51% control rule, the 18-month maximum and the business-plan evidence.', checked: '13 Oct 2026' },
  { name: 'IRCC — Provincial business candidates [R205(a) – C60]', href: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/temporary-residents/foreign-workers/exemption-codes/canadian-interests-significant-benefit-entrepreneurs-self-employed-candidates-seeking-operate-business-r205-c11.html', what: 'The work permit for founders in a provincial entrepreneur stream.', checked: '13 Oct 2026' },
  { name: 'IRCC — Significant benefit to Canada [R205(a) – C10]', href: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/temporary-residents/foreign-workers/exemption-codes/canadian-interests-significant-benefit-general-guidelines-r205-c10.html', what: 'What "significant benefit" means, and who decides.', checked: '13 Oct 2026' },
  { name: 'IRCC — Express Entry: CRS criteria', href: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score/crs-criteria.html', what: 'Job-offer points removed on 25 March 2025.', checked: '15 Oct 2026' },
  { name: 'Alberta — AAIP Rural Entrepreneur Stream', href: 'https://www.alberta.ca/aaip-rural-entrepreneur-stream-eligibility', what: 'Stream open.', checked: '12 Oct 2026' },
  { name: 'Manitoba — MPNP Entrepreneur Pathway', href: 'https://immigratemanitoba.com/mpnp/bis/ep/eligibility/', what: 'Stream open.', checked: '12 Oct 2026' },
  { name: 'Nova Scotia — NSNP Entrepreneur', href: 'https://liveinnovascotia.com/entrepreneur', what: 'Stream open.', checked: '12 Oct 2026' },
  { name: 'New Brunswick — Business Immigration Stream', href: 'https://www.gnb.ca/en/topic/family-home-community/immigration/provincial-nominee-program/business-immigration-stream.html', what: 'Stream open.', checked: '12 Oct 2026' },
];

// Three guides, one per stage of the move. Curated rather than queried so the
// page stays static; swap a slug here if an article is withdrawn.
const reads = [
  {
    slug: 'fastest-way-canada-permanent-residency-tech-founders-2026',
    stage: 'Before you choose',
    title: 'Fastest Way to Canada Permanent Residency for Tech Founders in 2026',
    excerpt: 'The Start-up Visa, Express Entry and provincial nominee routes compared: timelines, risks and requirements for tech founders.',
    date: { iso: '2026-10-24', label: '24 Oct 2026' },
    minutes: 11,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/10/967f36fe04e78423bc347306ef4f96be.jpg',
  },
  {
    slug: 'how-to-navigate-the-canada-work-permit-process-step-by-step',
    stage: 'Getting the permit',
    title: 'How to navigate the Canada work permit process step by step',
    excerpt: 'The main pathways, timelines, documentation and common pitfalls of the Canada work permit process.',
    date: { iso: '2026-09-19', label: '19 Sep 2026' },
    minutes: 9,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/09/8140a12b044e2c2a2b6aba72e7cd1cb3.jpg',
  },
  {
    slug: 'how-to-switch-from-canadian-work-permit-to-permanent-residence',
    stage: 'After you land',
    title: 'How to switch from a Canadian work permit to permanent residence',
    excerpt: 'Moving from a work permit to PR, comparing Express Entry and PNP options in BC, Alberta and Manitoba.',
    date: { iso: '2026-09-10', label: '10 Sep 2026' },
    minutes: 12,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/09/cd3d470f2552a7f42c731838581812a0.jpg',
  },
];

const label = 'font-sans text-xs font-bold uppercase tracking-[0.18em]';
const linkCls = 'underline decoration-[#1a1a1a]/30 underline-offset-4 hover:decoration-[#D80027]';

// ─── Page ────────────────────────────────────────────────────────────────────

// setRequestLocale before the first <Link>: without it next-intl reads
// headers(), Next renders the route dynamically and streams <title> and
// the meta tags into <body> instead of <head>.
export default async function CanadaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="w-full overflow-x-clip bg-[#F2F0E9] text-[#1a1a1a]">
      <JsonLd data={[howToJsonLd]} />

      <RouteProvider stops={STOPS} flag="ca" theme={THEME}>
        {/* ── Hero: the answer up front ── */}
        <header className="relative overflow-hidden bg-[#1a1a1a] text-white">
          <Image
            src="https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1800&q=80&auto=format&fit=crop"
            alt="Aerial view of downtown Toronto at sunset: the CN Tower, the Rogers Centre dome and the Lake Ontario waterfront"
            fill
            priority
            unoptimized
            className="object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/95 via-[#1a1a1a]/80 to-[#1a1a1a]/35" />
          <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#D80027] opacity-20 blur-[150px]" />

          <div className="container relative mx-auto grid grid-cols-1 items-end gap-8 px-6 pb-12 pt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <nav aria-label="Breadcrumb" className="font-sans text-xs text-white/60 lg:col-span-2">
              <ol className="flex flex-wrap gap-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link href="/country" className="hover:text-white">Countries</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-white/85">Canada</li>
              </ol>
            </nav>

            <div>
              <div className={`mb-5 flex items-center gap-3 text-white/75 ${label}`}>
                <Flag code="ca" uid="hero" width={40} />
                Destination: Canada · Founder routes
              </div>
              <h1>
                <span className="block font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.02em]">
                  True <em className="text-[#FF6B7F]">North.</em>
                </span>
                <span className="mt-4 block max-w-[46ch] font-sans text-lg font-medium leading-snug">
                  Immigrating to Canada as a startup founder in 2026: the Start-up Visa pause and the routes still open
                </span>
              </h1>
              <p className="mt-3 max-w-[58ch] font-sans text-base leading-relaxed text-white/70">
                Canada remains the primary destination for founders scaling into the US market, the gateway to North America. However, the landscape has
                shifted: with the Start-up Visa paused and closed to new applications, founders are turning to operational work permits (ICT and C11) and
                provincial entrepreneur streams to secure their foothold.
              </p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-white/60">
                <span>By <span className="text-white">Farjad P.D</span></span>
                <span>Updated <time dateTime={UPDATED.iso} className="text-white">{UPDATED.label}</time></span>
                <span>Start-up Visa status and Express Entry rules checked against canada.ca</span>
              </p>
              <p className="mt-5 max-w-[60ch] border-l-2 border-[#FF6B7F] pl-3 font-sans text-sm text-white/75">
                <strong className="text-white">The Start-up Visa is paused.</strong> IRCC stopped accepting new applications on {PAUSED_ON} and has not
                published what replaces it. Build your strategy around the routes that are open now.
              </p>
            </div>

            <aside aria-label="How to use this page" className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <p className={`text-[#FF6B7F] ${label}`}>Your route through this page</p>
              <ol className="my-4 list-decimal space-y-1 pl-5 font-sans text-sm text-white/75">
                <li>Check where the Start-up Visa stands</li>
                <li>Sort the open routes&apos; perks from catches</li>
                <li>Test your business against the real-business bar</li>
                <li>Walk the five steps</li>
                <li>Choose your HQ city</li>
                <li>Find your door to permanent residence</li>
              </ol>
              <a href="#status" className="inline-flex items-center gap-2 rounded-full bg-[#D80027] px-5 py-3 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
                Start the route <ArrowRight className="h-4 w-4" />
              </a>
            </aside>
          </div>
        </header>

        <RouteRail />

        {/* 01 — Start-up Visa status */}
        <RouteStop
          id="status"
          number={1}
          eyebrow={`Start-up Visa · status: ${SUV_STATE.label}`}
          question="Is the Canada Start-up Visa still open in 2026?"
          task="Read the status"
          completeOn="view"
          message="Status read"
          answer={
            <p>
              No. The Canada Start-up Visa is paused: IRCC stopped accepting new applications on {PAUSED_ON}. Files submitted before the pause are still
              being processed, and eligible applicants can still apply for an open work permit while their application is assessed. IRCC has not published
              what replaces it, so plan around the routes open now.
            </p>
          }
        >
          <SuvStatusNotice variant="inline" showRoutesLink={false} className="max-w-4xl" />
          <div className="mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
            {routeCards.map((c) => (
              <div key={c.title} className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
                <p className={`text-[#1a1a1a]/55 ${label}`}>{c.eyebrow}</p>
                <h3 className="mt-2 font-serif text-3xl">{c.title}</h3>
                <span className="mt-2 inline-block rounded bg-[#D80027]/10 px-2 py-1 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#D80027]">{c.badge}</span>
                <p className="mt-4 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">{c.body}</p>
                <p className="mt-4 flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#1a1a1a]/55">
                  <span className="h-2 w-2 rounded-full bg-[#1a1a1a]" /> {c.foot}
                </p>
              </div>
            ))}
            <div className="flex flex-col justify-between gap-4 rounded-2xl bg-[#1a1a1a] p-6 text-white">
              <p className="font-sans text-sm leading-relaxed text-white/75">
                The full programme, as it stood and as it stands, is on our Start-up Visa guide: eligibility, designated organisations, settlement funds
                and what the pause means for a file already in process. This page covers what a founder can do instead.
              </p>
              <Link href="/startup-visa-canada" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#D80027] px-5 py-3 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
                View Start-up Visa details <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </RouteStop>

        {/* 02 — The open routes */}
        <RouteStop
          id="routes"
          number={2}
          tone="white"
          eyebrow="The pivot · operational work permits"
          question="What can founders use instead of the Canada Start-up Visa?"
          task="Guess all eight"
          answer={
            <p>
              Founders who still want to build in Canada are turning to operational work permits. An executive transfer (ICT) lets your company open a
              Canadian branch and transfer you; C11 covers owners of at least 51% who want only temporary residence, for up to 18 months. Both are open to
              new applications and need no Letter of Support.
            </p>
          }
        >
          <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="relative overflow-hidden rounded-2xl bg-[#1a1a1a] p-8 text-[#F2F0E9]">
              <div aria-hidden="true" className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-[#D80027] opacity-20" />
              <p className={`relative text-[#FF6B7F] ${label}`}>High velocity</p>
              <h3 className="relative mt-2 font-serif text-4xl">ICT &amp; C11</h3>
              <p className="relative mt-1 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white/60">Operational work permits</p>
              <p className="relative mt-5 font-sans text-sm leading-relaxed text-white/80">
                The strategic alternative. Launch your Canadian branch and transfer yourself as an Executive (ICT), or run your own business under C11, which
                IRCC limits to owners of at least 51% seeking only temporary residence, for up to 18 months at a time.{' '}
                <strong className="text-white">Routes that are open to new applications today.</strong> Convert to PR later via Express Entry or a provincial
                entrepreneur stream; Express Entry job-offer CRS points were removed on 25 March 2025.
              </p>
              <ul className="relative mt-5 grid gap-2 font-sans text-sm">
                {ictBullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B7F]" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              <h3 className="mb-2 font-serif text-xl text-[#1a1a1a]">C11 is not a road to permanent residence</h3>
              <p>
                IRCC&apos;s own instructions describe C11 as the code for someone who wants to run, including establish, their own business in Canada and
                then leave. If your goal is permanent residence through a business, IRCC directs you to the provincial business streams, which issue C60
                work permits. Stop 6 sorts out which door is yours.
              </p>
              <Link href="/c10-work-permit" className="mt-4 inline-flex items-center gap-1.5 font-bold text-[#D80027] hover:underline">
                C10, C11 and C60 work permits compared <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <h3 className="mb-3 font-serif text-2xl">Perk or catch? Eight things to know about the open routes</h3>
          <PerkOrCatch stopId="routes" items={rights} />
        </RouteStop>

        {/* 03 — Reality check */}
        <RouteStop
          id="test"
          number={3}
          eyebrow="Reality check · no more passive income"
          question="Will a virtual office or a passive holding company work for a Canadian work permit?"
          task="Answer all four"
          answer={
            <p>
              In our view, no. A business that exists only on paper does not survive scrutiny, whichever route you take. We will not put forward a file
              without a real operating business behind it: premises, people in Canada, and revenue you can evidence. A virtual office and a passive holding
              company are the weakest case you can present to an officer.
            </p>
          }
        >
          <GateQuiz
            stopId="test"
            criteria={criteria}
            strongNote="Now the business plan has to show it: knowledge transfer, job creation and a significant benefit to Canada."
            gapNote="Each one is something an officer can ask you to evidence."
          >
            <h3 className="font-serif text-xl">&ldquo;No more passive income.&rdquo;</h3>
            <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]/65">
              In our experience, a business that exists only on paper does not survive scrutiny. Whichever route you take, we will not put forward a file
              without a real operating business behind it.
            </p>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#1a1a1a]">
              Our service includes: Commercial Lease Negotiation &amp; Canadian Hiring Strategy.
            </p>
            <Link href="/book-meeting" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#D80027] px-5 py-3 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
              Get a free read on your business <ArrowRight className="h-4 w-4" />
            </Link>
          </GateQuiz>
        </RouteStop>

        {/* 04 — The process */}
        <RouteStop
          id="steps"
          number={4}
          tone="white"
          eyebrow="The architect's approach"
          question="How do you set up a Canadian business for a founder work permit?"
          task="Walk to step 5"
          answer={
            <p>
              Choose a headquarters city, incorporate and structure the shareholder agreement (Canadian or foreign entity), write a business plan built on
              knowledge transfer and job creation, prepare for the interview with the border officer at the port of entry, then plan the move to permanent
              residence through Express Entry or a provincial entrepreneur stream.
            </p>
          }
        >
          <StepWalker stopId="steps" steps={steps} />
          <p className="mt-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            <strong className="text-[#1a1a1a]">We don&apos;t just file forms. We build the Canadian narrative.</strong> We structure your company as a
            &ldquo;significant benefit&rdquo; to Canada&apos;s economy and prepare your work permit application on that basis. The decision is the
            officer&apos;s, not ours.
          </p>
        </RouteStop>

        {/* Photo band */}
        <figure className="relative flex min-h-[360px] items-end overflow-hidden bg-[#1a1a1a] text-white">
          <ParallaxLayer>
            <Image
              src="https://images.unsplash.com/photo-1559511260-66a654ae982a?w=1800&q=80&auto=format&fit=crop"
              alt="Downtown Vancouver's skyline reflected in the harbour, with a marina in the foreground"
              fill
              unoptimized
              className="object-cover object-[center_45%]"
            />
          </ParallaxLayer>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1a1a]/20 to-[#1a1a1a]/90" />
          <figcaption className="container relative mx-auto flex flex-wrap items-end justify-between gap-5 px-6 py-10">
            <div>
              <p className={`text-[#FF6B7F] ${label}`}>Northbound</p>
              <p className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
                Launch in Canada.<br />
                <span className="italic text-[#FF6B7F]">Sell across North America.</span>
              </p>
            </div>
            <span className="font-sans text-xs text-white/55">Vancouver, British Columbia</span>
          </figcaption>
        </figure>

        {/* 05 — Where to base the company */}
        <RouteStop
          id="hq"
          number={5}
          eyebrow="Select HQ · ecosystem data"
          question="Where should a founder base a startup in Canada: Toronto, Waterloo or Calgary?"
          task="Pick your sector"
          answer={
            <p>
              Most founders default to Toronto: highest cost, highest density, and essential for fintech and enterprise SaaS. Cost-efficiency lies
              elsewhere. Waterloo, &ldquo;the Quantum Valley&rdquo;, offers top engineering talent at lower rent than Toronto, and Calgary offers
              aggressive provincial incentives for tech and low corporate tax, with energy and cleantech its strength.
            </p>
          }
        >
          <HqPicker stopId="hq" cities={cities} />

          <div className="mt-12">
            <h3 className="font-serif text-2xl">Why Canada? It&apos;s not just about the passport. It&apos;s about the talent density.</h3>
            <dl className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              {ecosystem.map((s) => (
                <div key={s.label} className="flex flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white p-6 transition-transform hover:-translate-y-1">
                  <dt className={`order-1 text-[#1a1a1a]/55 ${label}`}>{s.label}</dt>
                  <dd className="order-2 mt-3 font-serif text-4xl text-[#D80027]">{s.stat}</dd>
                  <dd className="order-3 mt-2 font-sans text-sm text-[#1a1a1a]/65">{s.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </RouteStop>

        {/* 06 — Road to permanent residence */}
        <RouteStop
          id="door"
          number={6}
          tone="white"
          eyebrow="Your road to permanent residence"
          question="How do founders get permanent residence in Canada now the Start-up Visa is paused?"
          task="Find your door"
          answer={
            <p>
              Through a provincial entrepreneur stream or Express Entry. Alberta, Manitoba, Nova Scotia and New Brunswick each approve a founder, sign a
              performance agreement and support a C60 work permit, then decide on nomination after the operating period. An executive transferred under ICT
              can later apply through Express Entry. C11 is for temporary residence only.
            </p>
          }
        >
          <DoorFinder stopId="door" doors={doors} />

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[760px] overflow-hidden rounded-2xl bg-[#F2F0E9] font-sans text-sm">
              <caption className="pb-2 text-left font-bold">Canadian routes for founders, as of {UPDATED.label}</caption>
              <thead>
                <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                  <th scope="col" className="px-4 py-3">Route</th>
                  <th scope="col" className="px-4 py-3">New applications</th>
                  <th scope="col" className="px-4 py-3">Who it suits</th>
                  <th scope="col" className="px-4 py-3">Ownership</th>
                  <th scope="col" className="px-4 py-3">Length</th>
                  <th scope="col" className="px-4 py-3">Toward PR</th>
                </tr>
              </thead>
              <tbody>
                {routeTable.map((r) => (
                  <tr key={r.route} className="border-b border-[#1a1a1a]/10 align-top last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-bold">{r.route}</th>
                    <td className="px-4 py-3">{r.status}</td>
                    <td className="px-4 py-3">{r.who}</td>
                    <td className="px-4 py-3">{r.own}</td>
                    <td className="px-4 py-3">{r.length}</td>
                    <td className="px-4 py-3">{r.pr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav aria-label="Open Canadian routes for founders" className="mt-8 grid max-w-4xl gap-3 font-sans text-sm">
            <p className={`text-[#D80027] ${label}`}>The open routes, one guide each</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              <li><Link href="/pnp" className={linkCls}>Entrepreneur PNP: the five provinces compared</Link></li>
              <li><Link href="/pnp/alberta" className={linkCls}>Alberta</Link></li>
              <li><Link href="/pnp/manitoba" className={linkCls}>Manitoba</Link></li>
              <li><Link href="/pnp/nova-scotia" className={linkCls}>Nova Scotia</Link></li>
              <li><Link href="/pnp/new-brunswick" className={linkCls}>New Brunswick</Link></li>
              <li><Link href="/c10-work-permit" className={linkCls}>C10, C11 and C60 work permits</Link></li>
            </ul>
          </nav>
        </RouteStop>

        {/* Sources */}
        <section aria-labelledby="sources-h" className="border-b border-[#1a1a1a]/10 bg-[#F2F0E9] px-6 py-14">
          <div className="container mx-auto">
            <p className={`text-[#D80027] ${label}`}>Where these facts come from</p>
            <h2 id="sources-h" className="mt-2 font-serif text-3xl">Sources</h2>
            <ol className="mt-6 grid max-w-4xl list-decimal gap-2 pl-5 font-sans text-sm">
              {sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="break-words font-bold underline decoration-[#D80027] underline-offset-2 hover:text-[#D80027]">
                    {s.name}
                  </a>{' '}
                  <span className="text-[#1a1a1a]/60">{s.what} Checked {s.checked}.</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 max-w-4xl font-sans text-xs text-[#1a1a1a]/55">
              The ecosystem figures and city descriptions in stop 5 are our own summary and are not taken from these sources.
            </p>
          </div>
        </section>

        {/* Book a session */}
        <section id="book" aria-labelledby="book-h" className="scroll-mt-32 bg-[#1a1a1a] px-6 py-16 text-white">
          <div className="container mx-auto grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <div>
              <RouteFinish />
              <p className={`text-[#FF6B7F] ${label}`}>Northbound</p>
              <h2 id="book-h" className="mt-2 font-serif text-4xl leading-tight">
                Bring your plan to a <span className="italic text-[#FF6B7F]">free session.</span>
              </h2>
              <p className="mt-3 max-w-[52ch] font-sans text-white/70">
                The Start-up Visa is paused and IRCC has not published what replaces it. Build your strategy around the routes that are open now. Pick a
                time and get an honest read on your business and whether Canada is the right route. If it isn&apos;t, we&apos;ll say so.
              </p>
              <ul className="my-5 flex flex-wrap gap-2 font-sans text-xs">
                {['Free · 60 minutes', 'Online, Google Meet', 'Link sent after booking'].map((p) => (
                  <li key={p} className="rounded-full border border-white/25 px-3 py-1.5">{p}</li>
                ))}
              </ul>
              <Link href="/book-meeting" className="inline-flex items-center gap-2 rounded-full bg-[#D80027] px-6 py-3.5 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
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
                <p className={`text-[#D80027] ${label}`}>Keep reading</p>
                <h2 id="reads-h" className="mt-2 font-serif text-3xl md:text-4xl">More Canada guides</h2>
              </div>
              <Link href="/blog/category/canada" className="inline-flex items-center gap-1.5 font-sans text-sm font-bold text-[#D80027] hover:underline">
                All Canada articles <ArrowRight className="h-4 w-4" />
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
                      <span className={`text-[#D80027] ${label}`}>{r.stage}</span>
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

      {/* Notice — the old page had none; this says only what the sources support. */}
      <section className="border-t border-[#1a1a1a]/10 bg-[#F9F9F9] px-6 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#1a1a1a]/30" />
            <p className="font-sans text-[11px] leading-relaxed text-[#1a1a1a]/55">
              <strong>Regulatory Notice:</strong> The Start-up Visa status and the Express Entry rule on this page were checked against canada.ca on 15
              October 2026, the C10, C11 and C60 instructions on 13 October 2026, and the provincial entrepreneur streams on 12 October 2026. They are
              provided for informational purposes only. VisaRoads Inc., an Ashavid company, is not an immigration law firm and does not file work permit
              applications. Rules change; always verify the current position at{' '}
              <a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-[#D80027]">canada.ca</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
