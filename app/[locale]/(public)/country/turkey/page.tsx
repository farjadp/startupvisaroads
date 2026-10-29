// ============================================================================
// Page: app/[locale]/(public)/country/turkey/page.tsx
// Layout: a guided route, matching /country/finland. A compact hero, a sticky
// rail whose Turkish flag rises as the reader completes each stop, and one
// stop per question people actually search. Every stop opens with its
// question as the H2 and a ~50-word direct answer (the passage answer engines
// quote), then the detail: real tables, lists and a small game on top. All
// copy is rendered on the server, so crawlers and AI engines read the whole
// page. Rebuilt 2026-10-29 from the editorial version; no fact was added or
// dropped in the rebuild.
//
// Subject: the Türkiye Tech Visa — in force 16 September 2024, run by the
// Ministry of Industry and Technology with the Ministry of Labour, decided in
// practice by a technopark jury.
//
// This is the English twin of /fa/turkey-tech-visa, which had been Persian-
// only since it was written on 8 Sep 2026. Everything here comes from that
// guide's verification pass (turkiyetechvisa.gov.tr, the EY tax alert dating
// the entry into force, and Turkish work-permit practice for the baseline
// rules), so the two must move together — above all the intake number and
// the local-hiring caveat.
//
// THE NUMBER THIS PAGE LEADS WITH: 22 foreign startups admitted between
// 16 September 2024 and 3 March 2026. Eighteen months, twenty-two companies.
// The route is open, and it is narrow, and anyone deciding whether to spend a
// year on it deserves that first.
//
// THE CLAIM WE DELIBERATELY DO NOT REPEAT: that Tech Visa companies are
// exempt from the five-Turkish-employees-per-foreigner rule. The programme
// materials imply flexibility for technopark companies; no official text we
// could find grants a blanket exemption. For a three-founder team that is the
// difference between zero and fifteen hires, and it surfaces in month seven.
// Related, open: lib/routes-v2/tr-il-ae.ts notes that ÇSGB criterion B.5.2
// exempts foreigners working in a technopark from the employment and
// financial criteria without naming company partners, so whether the
// 20% / TRY 500,000 rule binds Tech Visa founders is itself unconfirmed.
//
// NO LIRA FIGURES IN PROSE. Turkish inflation moves them between reviews and
// last year's number is worse than no number. The one lira amount on the page
// is the statutory 500,000 capital condition, which is a rule rather than a
// cost. Same rule as the Persian guide.
//
// No video: the two Türkiye walkthroughs (yKUnvR4dTbE, aDAvrHfP3LI) are in
// Persian on @FarjadTalks and belong to /fa/turkey-tech-visa. No permanent-
// residence finder or years roadmap: this page states no PR or citizenship
// period, and the route does not lead to an EU passport.
//
// Photos: the three /fa/img/turkey*.webp files, checked 2026-10-29 — the
// Bosphorus shore, the Istanbul skyline and a ferry pier, all Istanbul.
// ============================================================================

import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from '@/routing';
import { metaFor } from '@/lib/pageMeta';
import JsonLd from '@/components/JsonLd';
import { SITE_URL, faqJsonLd } from '@/lib/seo';
import { MAIN_CONTACT } from '@/content/contact';
import Flag from '@/components/route/flags';
import { RouteProvider, RouteRail, RouteStop, RouteFinish, type RouteStopDef, type RouteTheme } from '@/components/route/RouteProgress';
import { CopyButton, OpenedTracker, ParallaxLayer, PerkOrCatch, StepWalker, type RouteStep } from '@/components/route/RouteWidgets';
import { IntakeDots, JuryQuiz, ReadTracker, TeamCheck } from './TurkeyWidgets';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/country/turkey', locale);
}

// ─── Data ────────────────────────────────────────────────────────────────────

const UPDATED = { iso: '2026-10-29', label: '29 Oct 2026' };
const PAGE_URL = `${SITE_URL}/en/country/turkey`;

// The page's own palette: flag red for highlights, a deeper red for figures,
// the night navy for dark bands. accentText is 6.2:1 on #F2F0E9 and 7.1:1 on
// white; white on the flag red is 4.9:1; #FF5A63 is 6.3:1 on the navy.
const THEME: RouteTheme = { accent: '#E30A17', accentInk: '#FFFFFF', accentText: '#B5000F', primary: '#A3000F', deep: '#0A0E1A', soft: '#FCE6E7', accentOnDark: '#FF5A63' };

const STOPS: RouteStopDef[] = [
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'gate', label: 'Jury test' },
  { id: 'steps', label: '5 steps' },
  { id: 'rules', label: 'Team rules' },
  { id: 'life', label: 'Perks' },
  { id: 'leads', label: 'Where it leads' },
  { id: 'faq', label: 'FAQ' },
];

const criteria = [
  {
    title: 'Technological innovation',
    body: 'Technology-based, software development, or genuine technological novelty — with commercialisation potential and global scalability.',
  },
  {
    title: 'R&D capacity',
    body: 'Evidence you can actually run the research and development, not only describe it. Portfolio, CV and track record in the field.',
  },
  {
    title: 'What Türkiye gains',
    body: 'A question the European routes ask less directly: what does your startup add to Türkiye’s workforce, economy and technology ecosystem? It has to be written into the plan.',
  },
  {
    title: 'A defensible team',
    body: 'Every member’s role must be specialist and defensible. Padding a team with unrelated people is what sinks otherwise sound files.',
  },
];

const rejected = ['A simple online shop', 'Ordinary import and export', 'A digital marketing agency', 'Traditional service businesses generally'];

const steps: RouteStep[] = [
  {
    title: 'File on the portal',
    who: 'Ministry of Industry and Technology',
    body: 'Register at turkiyetechvisa.gov.tr with your personal details, CV and business plan. The Ministry of Industry and Technology checks only that the file is complete.',
    note: 'The Ministry is the gateway, not the judge. This step decides nothing about your idea.',
    figure: 'Gateway',
    figureLabel: 'completeness check only',
  },
  {
    title: 'Technopark referral',
    who: 'The portal',
    body: 'The system refers your file to one of Türkiye’s accredited technoparks for the substantive assessment. There are more than a hundred of them.',
    note: 'You do not choose the technopark; the portal routes the file.',
    figure: '100+',
    figureLabel: 'accredited technoparks',
  },
  {
    title: 'The jury decides',
    who: 'Technopark jury',
    body: 'A technopark jury of industry specialists and university academics assesses technological innovation, scalability and R&D capacity. There may be a virtual or in-person interview.',
    note: 'This is the only real gate on the route. No intermediary controls this vote — treat a guaranteed approval as a warning sign.',
    figure: 'Jury',
    figureLabel: 'industry and academia',
  },
  {
    title: 'Certificate & permit',
    who: 'Ministry, then Ministry of Labour',
    body: 'On a positive score the Ministry issues the Tech Visa certificate without re-assessing, and the file passes to the Ministry of Labour for a work permit of up to three years.',
    note: 'Three years is the longest first permit of any route on this site. Denmark gives two; the Netherlands twelve months.',
    figure: '3 yrs',
    figureLabel: 'work permit, up to',
  },
  {
    title: 'Incorporate & settle',
    who: 'In Türkiye',
    body: 'Enter Türkiye, register a new Turkish company, complete the notary work, and collect residence cards. Three to six months end to end when nothing goes wrong.',
    note: 'Your existing company abroad does not transfer. You incorporate fresh, and its shareholding need not mirror the old one.',
    figure: '3–6 mo',
    figureLabel: 'end to end',
  },
];

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to apply for the Türkiye Tech Visa',
  inLanguage: 'en',
  url: `${PAGE_URL}#steps`,
  step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.body })),
};

// The two general Turkish work-permit rules for a foreign company partner.
const partnerRules = [
  { condition: 'Shareholding', rule: 'At least 20% of the shares, per foreign partner', note: 'Equal splits are not required. The rule itself caps a foreign founding team at five.' },
  { condition: 'Capital', rule: 'At least TRY 500,000, per foreign partner', note: 'Not the minimum company registration capital, which is lower.' },
  { condition: 'Exception', rule: 'The criteria do not apply where the individual’s capital share is USD 100,000 or more', note: '—' },
  { condition: 'Local hiring', rule: 'Five Turkish citizens employed per foreign employee, from the seventh month', note: 'Programme write-ups say Tech Visa startups are exempt; we could not find explicit official text granting a blanket exemption.' },
];

const rights = [
  { title: 'Three-year permit', content: 'The Tech Visa work permit is issued for up to three years — the longest first permit of any route on this site. Denmark gives two; the Netherlands twelve months.', positive: true },
  { title: '20% and TRY 500,000', content: 'Every foreign partner must hold at least 20% of the shares and contribute at least TRY 500,000 of capital, unless the individual’s capital share is USD 100,000 or more.', positive: false },
  { title: 'Your family', content: 'The programme lists a simplified residence process for family among its benefits.', positive: true },
  { title: 'Five Turkish employees', content: 'The general rule is five Turkish citizens per foreign employee from the seventh month. We could not find official text granting Tech Visa startups a blanket exemption.', positive: false },
  { title: 'Six months of consultancy', content: 'The programme’s own site lists six months of legal, financial and technical consultancy for the business you establish.', positive: true },
  { title: 'Free workspace', content: 'Workspace in technoparks and incubators is listed, but it depends on the technopark having capacity, and in Istanbul it is competitive. Do not treat it as guaranteed.', positive: false },
  { title: 'Cost of living', content: 'A cost of living well below Western Europe, with geographic proximity and more than a hundred technoparks.', positive: true },
  { title: 'A European passport', content: 'This route does not reach EU membership or a European passport. If Europe is your horizon, Türkiye is not your destination.', positive: false },
];

const provides = [
  { title: 'Consultancy', body: 'Six months of legal, financial and technical consultancy for the business you establish.' },
  { title: 'Workspace', body: 'In technoparks and incubators — subject to capacity, and competitive in Istanbul.' },
  { title: 'Financing support', body: 'Support for venture capital and project financing, plus mentorship.' },
  { title: 'Health cover', body: 'What the programme calls comprehensive free health cover. Not the same thing as SGK, the social security system a founder pays into monthly.' },
];

const firstPermits = [
  { route: 'Türkiye Tech Visa', length: 'Up to three years' },
  { route: 'Denmark', length: 'Two years' },
  { route: 'The Netherlands', length: 'Twelve months' },
];

const faqs = [
  {
    q: 'Who actually decides on my startup?',
    a: 'A technopark jury, not the Ministry. You file on the official portal, the Ministry of Industry and Technology checks only that the paperwork is complete, and the system refers your file to an accredited technopark whose jury — industry specialists and university academics — assesses technological innovation, scalability and R&D capacity. On a positive score the Ministry issues the certificate without re-assessing and the file goes to the Ministry of Labour for the three-year work permit.',
  },
  {
    q: 'What are the real odds?',
    a: 'The programme came into force on 16 September 2024. As of 3 March 2026 — roughly eighteen months later — twenty-two foreign startups had been admitted. Nobody is hiding that figure; it comes from Türkiye’s own ecosystem reporting. It does not mean the route is closed. It means the programme is young and small, and anyone selling it to you as a busy motorway has not looked. Anyone offering a guaranteed approval is selling something they do not control.',
  },
  {
    q: 'Is there an investment threshold?',
    a: 'The programme sets none of its own, but the general Turkish work-permit rules for a foreign company partner apply and they catch founders late: each foreign partner must hold at least 20% of the shares and contribute at least TRY 500,000 in capital. There is one exception — the criteria do not apply where the individual’s capital share is USD 100,000 or more. Note this is not the same as the minimum company registration capital, which is lower.',
  },
  {
    q: 'How many founders can we be?',
    a: 'Practice is teams of up to three, and the reason is risk rather than law: every member’s role has to be specialist and defensible. The rule itself implies a cap of five, since each foreign partner needs at least 20% of the shares. Equal splits are not required — three co-founders at roughly a third each clear the 20% condition comfortably. Including unrelated people, or generic roles like "social media manager", raises jury scrutiny and endangers the whole file.',
  },
  {
    q: 'Does the five-Turkish-employees rule apply to us?',
    a: 'Here we have to be precise rather than reassuring. The general rule in Turkish labour law is that foreign-owned companies must employ five Turkish citizens per foreign employee from the seventh month. Programme write-ups state that Tech Visa startups are exempt, and technopark and incentive-zone companies are in practice assessed more flexibly — but we could not find explicit official text granting a blanket, unconditional exemption. For a team of three foreign founders the difference between "exempt" and "treated flexibly" is zero hires against fifteen, and you find out in month seven. Get this one in writing from the technopark or the Ministry of Labour before you commit money.',
  },
  {
    q: 'How long is the permit, and what about family?',
    a: 'The Tech Visa work permit is issued for up to three years — the longest first permit of any route covered on this site. The programme lists a simplified residence process for family among its benefits. If what you need is runway, that is Türkiye’s central strength.',
  },
  {
    q: 'What does the government actually provide free?',
    a: 'The programme’s own site lists six months of legal, financial and technical consultancy for the business you establish; workspace in technoparks and incubators; support for venture capital and project financing; mentorship; and what it calls comprehensive free health cover. Two practical limits. Free workspace depends on the technopark having capacity, and in Istanbul it is competitive — do not treat it as guaranteed. And do not confuse the health claim with Türkiye’s social security system (SGK), under which a founder pays a monthly contribution; they are not the same thing.',
  },
  {
    q: 'Is a language certificate required?',
    a: 'No — neither English nor Turkish. But the plan and the pitch have to be professional, and if you are not fluent in Turkish at the notary you will need a sworn translator, which is a separate cost.',
  },
  {
    q: 'What gets rejected?',
    a: 'Traditional and service businesses: a simple online shop, ordinary import-export, a digital marketing agency. Technopark juries assess technological innovation and R&D capacity, and that category is set aside at the assessment stage.',
  },
  {
    q: 'How long does the whole thing take, and what slows it down?',
    a: 'Three to six months from first filing to a residence card, in the standard case with no complications. What lengthens it is predictable: files returned by the jury for correction or re-translation, waiting lists for space at oversubscribed technoparks, and banking bureaucracy — opening a corporate account as a foreign national in Türkiye takes time.',
  },
  {
    q: 'Can I move my existing company to Türkiye?',
    a: 'No. After the plan is approved and you arrive, you register a new Turkish company. The shareholding of your existing company elsewhere is not an obstacle and does not have to be reproduced — the only requirement is that each foreign partner holds at least 20%.',
  },
  {
    q: 'How does Türkiye compare with the European routes?',
    a: 'Its strengths are real: the longest first permit at three years, geographic proximity, a cost of living well below Western Europe, and more than a hundred technoparks. So are its weaknesses: the programme is very young and its intake small, an inflationary economy makes long-term financial planning hard, and — most importantly — this route does not lead to EU membership or a European passport. If Europe is your horizon, Türkiye is not your destination. If your horizon is building a business on sane time and cost, it is the most serious option on that list.',
  },
];

// Official sources. The programme site was checked in the 8 Sep 2026 pass;
// the ÇSGB criteria page is where the partner figures are published and was
// read on 15 Oct 2026 for the app (lib/routes-v2/tr-il-ae.ts). No EY URL is
// on file, so that entry links EY's home page rather than guess a deep link.
const sources = [
  { name: 'Türkiye Tech Visa — official programme site', href: 'https://turkiyetechvisa.gov.tr/', what: 'The programme, the three-year work permit, six months of consultancy, technopark workspace and family residence processing.', checked: '8 Sep 2026' },
  { name: 'Ministry of Labour and Social Security — work-permit evaluation criteria', href: 'https://calismaizni.csgb.gov.tr/calisma-izni/-calisma-izni-degerlendirme-kriterleri/', what: 'The general rules for a foreign company partner: 20% of the shares, TRY 500,000 of capital, the USD 100,000 exception and five Turkish employees per foreigner.', checked: '15 Oct 2026' },
  { name: 'EY — tax alert on the Türkiye Tech Visa (ey.com)', href: 'https://www.ey.com/', what: 'Dates the programme’s entry into force to 16 September 2024. Links to EY’s home page; search there for the alert.', checked: '8 Sep 2026' },
];

// The only three English articles on visaroads.com about Türkiye, from the
// sitemap on 29 Oct 2026, each fetched (HTTP 200) for title, description,
// cover, date and reading time. No /blog/category for Türkiye exists (404).
const reads = [
  {
    slug: 'understanding-banking-and-capital-for-turkiye-tech-visa',
    stage: 'Before you apply',
    title: 'Understanding Banking and Capital for the Türkiye Tech Visa',
    excerpt: 'The financial requirements, hidden costs and banking logistics founders face on the Tech Visa, and how to prepare for them.',
    date: { iso: '2026-09-21', label: '21 Sep 2026' },
    minutes: 7,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/09/1d01b13d92af7a376a691a6ee72c962c.jpg',
  },
  {
    slug: 'finding-housing-community-startup-founder-istanbul',
    stage: 'After you land',
    title: 'Finding Housing and Community as a Startup Founder in Istanbul',
    excerpt: 'Securing housing, managing local costs, getting past the language barrier and finding Istanbul’s tech and expat communities.',
    date: { iso: '2026-10-18', label: '18 Oct 2026' },
    minutes: 7,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/10/d2c77c1f2471bf193e3ffa829b4deff4.jpg',
  },
  {
    slug: 'what-international-students-should-know-about-studying-in-turkiye',
    stage: 'Another way in',
    title: 'What International Students Should Know About Studying in Türkiye',
    excerpt: 'Types of institutions, admissions, language requirements and scholarships for international students in Türkiye.',
    date: { iso: '2026-10-29', label: '29 Oct 2026' },
    minutes: 8,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/10/ce4b9f846c00d9365ccd5fb0f9043746.jpg',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

const label = 'font-sans text-xs font-bold uppercase tracking-[0.18em]';
const th = 'px-4 py-3';

export default function TurkeyPage() {
  return (
    <div className="w-full overflow-x-clip bg-[#F2F0E9] text-[#1a1a1a]">
      <JsonLd data={[howToJsonLd, faqJsonLd(faqs.map((f) => ({ question: f.q, answer: f.a })), 'en')]} />

      <RouteProvider stops={STOPS} flag="tr" theme={THEME}>
        {/* ── Hero: the answer up front ── */}
        <header className="relative overflow-hidden bg-[#0A0E1A] text-white">
          <Image
            src="/fa/img/turkey.webp"
            alt="The Bosphorus shore in Istanbul in low sun: waterfront restaurants and low buildings by the water, with the glass towers of the business district behind"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E1A]/95 via-[#0A0E1A]/80 to-[#0A0E1A]/35" />

          <div className="container relative mx-auto grid grid-cols-1 items-end gap-8 px-6 pb-12 pt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <nav aria-label="Breadcrumb" className="font-sans text-xs text-white/60 lg:col-span-2">
              <ol className="flex flex-wrap gap-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link href="/country" className="hover:text-white">Countries</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-white/85">Türkiye</li>
              </ol>
            </nav>

            <div>
              <div className={`mb-5 flex items-center gap-3 text-white/75 ${label}`}>
                <Flag code="tr" uid="hero" width={36} />
                Türkiye Tech Visa · In force 16 September 2024
              </div>
              <h1>
                <span className="block font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.02em]">
                  Türkiye. <em className="text-[#ff5a63]">Three years.</em>
                </span>
                <span className="mt-4 block max-w-[46ch] font-sans text-lg font-medium leading-snug">
                  The Türkiye Tech Visa in 2026, step by step
                </span>
              </h1>
              <p className="mt-3 max-w-[56ch] font-sans text-base leading-relaxed text-white/70">
                A work permit of up to three years, the longest first permit on this site, decided by a technopark jury rather than the Ministry. The
                catch is the intake: 22 foreign startups in 18 months, and the route leads nowhere near a European passport.
              </p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-white/60">
                <span>By <span className="text-white">Farjad P.D</span></span>
                <span>Updated <time dateTime={UPDATED.iso} className="text-white">{UPDATED.label}</time></span>
                <span>Figures checked against the Tech Visa programme (turkiyetechvisa.gov.tr) and the Ministry of Labour&apos;s work-permit rules</span>
              </p>
              <p className="mt-5 max-w-[60ch] border-l-2 border-[#E30A17] pl-3 font-sans text-sm text-white/70">
                <strong className="text-white">The Ministry is the gateway, not the judge</strong> — a technopark jury decides, and it is strict about
                technological innovation and R&amp;D. The route is open. It is also narrow, and you should know that before you spend a year on it.
              </p>
            </div>

            <aside aria-label="How to use this page" className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <p className={`text-[#ff5a63] ${label}`}>Your route through this page</p>
              <ol className="my-4 list-decimal space-y-1 pl-5 font-sans text-sm text-white/75">
                <li>Check your startup against the jury&apos;s four tests</li>
                <li>Walk the five steps</li>
                <li>Size your team against the two rules</li>
                <li>Sort perks from catches</li>
                <li>See where the route does not lead</li>
              </ol>
              <a href="#gate" className="inline-flex items-center gap-2 rounded-full bg-[#E30A17] px-5 py-3 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
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
          question="What is the Türkiye Tech Visa?"
          task="Read the four facts"
          completeOn="view"
          message="Snapshot read"
          answer={
            <p>
              The Türkiye Tech Visa is a government programme in force since 16 September 2024, run by the Ministry of Industry and Technology with the
              Ministry of Labour and Social Security. A technopark jury judges your startup; the Ministry then issues a certificate and the Ministry of
              Labour a work permit of up to three years. Twenty-two foreign startups were admitted in its first eighteen months.
            </p>
          }
        >
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { stat: '3 yrs', label: 'Work permit', sub: 'longest first permit here' },
              { stat: '22', label: 'Startups admitted', sub: 'Sep 2024 – Mar 2026' },
              { stat: '20%', label: 'Minimum shareholding', sub: 'per foreign partner' },
              { stat: '100+', label: 'Technoparks', sub: 'one of them judges you' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white p-5 transition-transform hover:-translate-y-1">
                <dt className="order-2 mt-2 font-sans text-sm font-bold">{s.label}</dt>
                <dd className="order-1 font-serif text-4xl text-[#A3000F]">{s.stat}</dd>
                <dd className="order-3 font-sans text-xs text-[#1a1a1a]/55">{s.sub}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="grid content-start gap-4 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              <h3 className="font-serif text-2xl text-[#1a1a1a]">The Ministry is the gateway</h3>
              <p>
                A government programme in force since 16 September 2024, run by the Ministry of Industry and Technology with the Ministry of Labour and
                Social Security. It targets two groups: specialists with critical technology expertise, and startups with an innovative business model
                doing technology-led work.
              </p>
              <p>
                Understand the decision chain, because this is where most descriptions go wrong. The Ministry checks completeness. The portal refers your
                file to an accredited <strong className="text-[#1a1a1a]">technopark, whose jury decides</strong> — industry specialists and university
                academics. On a positive score the Ministry issues the certificate without re-assessing.
              </p>
              <p>The output is a work permit of up to three years and access to a network of more than a hundred technoparks.</p>
            </div>

            <div className="rounded-2xl bg-[#0A0E1A] p-6 text-white md:p-8">
              <p className={`text-[#ff5a63] ${label}`}>The number</p>
              <p className="mt-2 flex items-end gap-4">
                <span className="font-serif text-[clamp(4.5rem,10vw,7rem)] leading-[0.8] text-[#ff5a63]">22</span>
                <span className="pb-1 font-serif text-2xl leading-tight">
                  Foreign startups admitted <span className="italic text-white/60">in eighteen months.</span>
                </span>
              </p>
              <div className="my-5">
                <IntakeDots dark />
                <p className="mt-2 font-sans text-xs text-white/55">One dot per startup, 16 Sep 2024 – 3 Mar 2026</p>
              </div>
              <div className="grid gap-3 font-sans text-sm leading-relaxed text-white/65">
                <p>
                  Between 16 September 2024, when the programme came into force, and 3 March 2026. Nobody is hiding this figure — it comes from
                  Türkiye&rsquo;s own ecosystem reporting.
                </p>
                <p>
                  It does not mean the route is closed. It means the programme is young and small, and that you should go with a real file rather than a
                  hopeful one. If someone is selling this as a busy motorway, or offering a guaranteed approval, they have not looked at this number — the
                  decision belongs to a technopark jury, and no intermediary controls its vote.
                </p>
              </div>
            </div>
          </div>
          <ReadTracker stopId="snapshot" message="Snapshot read" />
        </RouteStop>

        {/* 02 — Who qualifies */}
        <RouteStop
          id="gate"
          number={2}
          tone="white"
          eyebrow="What the jury is sensitive to"
          question="Who qualifies for the Türkiye Tech Visa?"
          task="Answer all four"
          answer={
            <p>
              A technology-based startup: software development or genuine technological novelty with commercialisation potential and global
              scalability, real R&amp;D capacity, a plan that says what it adds to Türkiye&rsquo;s workforce, economy and technology ecosystem, and a team
              in which every role is specialist and defensible. Simple online shops, ordinary import-export and digital marketing agencies are set aside.
            </p>
          }
        >
          <JuryQuiz stopId="gate" criteria={criteria}>
            <h3 className="font-serif text-xl">Set aside at assessment</h3>
            <ul className="grid gap-1.5 font-sans text-sm text-[#1a1a1a]/65">
              {rejected.map((r) => (
                <li key={r} className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-4 bg-[#E30A17]" />
                  {r}
                </li>
              ))}
            </ul>
            <Link href="/book-meeting" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#E30A17] px-5 py-3 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
              Get a free read on your file <ArrowRight className="h-4 w-4" />
            </Link>
          </JuryQuiz>

          <div className="mt-8 max-w-3xl border-l-2 border-[#E30A17] pl-6">
            <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
              <strong className="text-[#1a1a1a]">A warning that comes from practice on this route:</strong> padding the team with unrelated people — older
              family members, or generic roles like &ldquo;social media manager&rdquo; — raises jury scrutiny and endangers the whole file. If you cannot
              explain in a paragraph why a person is necessary to this startup, their presence weakens you.
            </p>
          </div>
        </RouteStop>

        {/* 03 — How to apply */}
        <RouteStop
          id="steps"
          number={3}
          eyebrow="Portal to residence card"
          question="How do you apply for the Türkiye Tech Visa?"
          task="Walk to step 5"
          answer={
            <p>
              File your CV, business plan and personal details on turkiyetechvisa.gov.tr. The Ministry of Industry and Technology checks the file is
              complete and the portal refers it to an accredited technopark, whose jury decides. On a positive score the Ministry issues the certificate,
              the Ministry of Labour a work permit of up to three years, and you incorporate in Türkiye.
            </p>
          }
        >
          <StepWalker stopId="steps" steps={steps} />
          <p className="mt-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            <strong className="text-[#1a1a1a]">Realistic timeline:</strong> three to six months from first filing to a residence card, in the standard
            case. What lengthens it is predictable: files returned by the jury for correction or re-translation, waiting lists at oversubscribed
            technoparks, and opening a corporate bank account as a foreign national.
          </p>
        </RouteStop>

        {/* Photo band */}
        <figure className="relative flex min-h-[360px] items-end overflow-hidden bg-[#0A0E1A] text-white">
          <ParallaxLayer>
            <Image
              src="/fa/img/turkey-2.webp"
              alt="The Istanbul skyline: glass office towers with Turkish flags on their roofs above dense low-rise housing with red tiled roofs, under a blue sky"
              fill
              sizes="100vw"
              className="object-cover object-[center_40%]"
            />
          </ParallaxLayer>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0E1A]/20 to-[#0A0E1A]/90" />
          <figcaption className="container relative mx-auto flex flex-wrap items-end justify-between gap-5 px-6 py-10">
            <div>
              <p className={`text-[#ff5a63] ${label}`}>Step 5 · Incorporate and settle</p>
              <p className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
                A new Turkish company.<br />
                <span className="italic text-[#ff5a63]">Then the residence cards.</span>
              </p>
              <p className="mt-2 max-w-[46ch] font-sans text-sm text-white/70">
                Türkiye&rsquo;s tech ecosystem is large, with more than a hundred technoparks. What is small is the Tech Visa programme itself.
              </p>
            </div>
            <span className="font-sans text-xs text-white/55">The Istanbul skyline</span>
          </figcaption>
        </figure>

        {/* 04 — The two general rules */}
        <RouteStop
          id="rules"
          number={4}
          tone="white"
          eyebrow="The general rules · make or break the team"
          question="What shareholding, capital and hiring rules apply to a Tech Visa team?"
          task="Size your team"
          answer={
            <p>
              Two general Turkish work-permit rules, not the programme&rsquo;s own. Each foreign partner must hold at least 20% of the shares and contribute
              at least TRY 500,000 of capital, unless the capital share is USD 100,000 or more. And foreign-owned companies must employ five Turkish
              citizens per foreign employee from month seven; no official text we found exempts Tech Visa startups outright.
            </p>
          }
        >
          <TeamCheck stopId="rules" />

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] overflow-hidden rounded-2xl bg-[#F2F0E9] font-sans text-sm">
              <caption className="pb-2 text-left font-bold">General Turkish work-permit conditions for a foreign company partner</caption>
              <thead>
                <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                  <th scope="col" className={th}>Condition</th>
                  <th scope="col" className={th}>Rule</th>
                  <th scope="col" className={th}>Note</th>
                </tr>
              </thead>
              <tbody>
                {partnerRules.map((r) => (
                  <tr key={r.condition} className="border-b border-[#1a1a1a]/10 last:border-0">
                    <th scope="row" className={`${th} text-left font-bold`}>{r.condition}</th>
                    <td className={th}>{r.rule}</td>
                    <td className={`${th} text-xs text-[#1a1a1a]/60`}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid max-w-5xl grid-cols-1 gap-6 font-sans text-sm leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            <p>
              <strong className="text-[#1a1a1a]">Neither belongs to the programme.</strong> Both are the general Turkish work-permit rules for a foreign
              company partner, which is exactly why founders meet them late. The TRY 500,000 condition is not the minimum company registration capital, which is
              lower. Equal splits are not required — three co-founders at roughly a third each clear 20% comfortably, and the rule itself caps a foreign
              founding team at five.
            </p>
            <div className="rounded-2xl border-l-4 border-[#E30A17] bg-[#FCE6E7] p-5">
              <p className="flex gap-2 text-[#1a1a1a]/80">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#B5000F]" aria-hidden="true" />
                <span>
                  <strong className="text-[#1a1a1a]">We could not find explicit official text granting a blanket exemption.</strong> Programme write-ups
                  say Tech Visa startups are exempt, and technopark companies are in practice assessed more flexibly. For three foreign founders,
                  &ldquo;exempt&rdquo; against &ldquo;treated flexibly&rdquo; is zero hires against fifteen — and you find out in month seven. Get this in
                  writing from the technopark or the Ministry of Labour before you commit money.
                </span>
              </p>
            </div>
          </div>
        </RouteStop>

        {/* 05 — Rights and catches */}
        <RouteStop
          id="life"
          number={5}
          eyebrow="Perk or catch?"
          question="What does the Türkiye Tech Visa give you and your family?"
          task="Guess all eight"
          answer={
            <p>
              A work permit of up to three years, a simplified residence process for family, six months of free legal, financial and technical
              consultancy, technopark workspace, venture-capital support and mentorship. The limits: workspace depends on technopark capacity and is
              competitive in Istanbul, and the programme&rsquo;s free health cover is not SGK, the social security system founders pay into monthly.
            </p>
          }
        >
          <PerkOrCatch stopId="life" items={rights} />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <div className="grid content-start gap-4 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              <h3 className="font-serif text-2xl text-[#1a1a1a]">What the government actually provides</h3>
              <p>
                The programme&rsquo;s own site lists the support below. Two practical limits: free workspace depends on the technopark having capacity, and
                in Istanbul it is competitive; and the health claim is not Türkiye&rsquo;s social security system (SGK), under which a founder pays a
                monthly contribution.
              </p>
              <p>
                <strong className="text-[#1a1a1a]">No language certificate</strong> is required, neither English nor Turkish. But the plan and the pitch have
                to be professional, and if you are not fluent in Turkish at the notary you will need a sworn translator, which is a separate cost.
              </p>
            </div>
            <ul className="grid grid-cols-1 content-start gap-3 sm:grid-cols-2">
              {provides.map((p) => (
                <li key={p.title} className="rounded-xl border border-[#1a1a1a]/10 bg-white p-4">
                  <h4 className="font-sans text-sm font-bold">{p.title}</h4>
                  <p className="mt-1 font-sans text-sm text-[#1a1a1a]/65">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </RouteStop>

        {/* 06 — Where it leads */}
        <RouteStop
          id="leads"
          number={6}
          tone="white"
          eyebrow="Honestly"
          question="Does the Türkiye Tech Visa lead to an EU passport?"
          task="Read where it leads"
          completeOn="view"
          message="Horizon checked"
          answer={
            <p>
              No. This route does not reach EU membership or a European passport; if Europe is your horizon, Denmark or Estonia is the page you want. If
              your horizon is building a real business on sane time and cost, it is the most serious option on that list: three years of permit, over a
              hundred technoparks and a cost of living well below Western Europe.
            </p>
          }
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="grid content-start gap-6 lg:col-span-5">
              <figure>
                <span className="relative block aspect-[16/9] overflow-hidden rounded-2xl">
                  <Image
                    src="/fa/img/turkey-3.webp"
                    alt="A white passenger ferry at an Istanbul pier on a grey, rainy evening: commuters walk off the gangway while a crowd waits under umbrellas"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </span>
                <figcaption className="mt-2 font-sans text-xs text-[#1a1a1a]/55">An Istanbul ferry pier at rush hour</figcaption>
              </figure>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[300px] overflow-hidden rounded-2xl bg-[#F2F0E9] font-sans text-sm">
                  <caption className="pb-2 text-left font-bold">Length of the first permit, routes on this site</caption>
                  <thead>
                    <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                      <th scope="col" className={th}>Route</th>
                      <th scope="col" className={th}>First permit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {firstPermits.map((p) => (
                      <tr key={p.route} className="border-b border-[#1a1a1a]/10 last:border-0">
                        <th scope="row" className={`${th} text-left font-normal`}>{p.route}</th>
                        <td className={`${th} tabular-nums`}>{p.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid content-start gap-6 font-sans text-base leading-relaxed text-[#1a1a1a]/70 lg:col-span-7">
              <p>
                <strong className="text-[#1a1a1a]">This route does not reach EU membership or a European passport.</strong> If Europe is your horizon,
                Türkiye is not your destination, and <Link href="/country/denmark" className="underline decoration-[#E30A17] underline-offset-2 hover:text-[#B5000F]">Denmark</Link> or
                Estonia is the page you want. We would rather say that here than after you have signed.
              </p>
              <p>
                If your horizon is building a real business on sane time and cost, it is the most serious option on that list. Three years of permit, over
                a hundred technoparks, and a cost of living well below Western Europe.
              </p>
              <p>
                Two more things to plan around. An inflationary economy means a lira budget needs rewriting every few months — set long-term planning in
                euros or dollars and keep lira only for day-to-day payments. And opening a corporate bank account as a foreign national takes time; assume
                it for the first months rather than hoping.
              </p>
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div className="rounded-2xl border border-[#1a1a1a]/10 p-5">
                  <h3 className={`mb-2 text-[#B5000F] ${label}`}>Strengths</h3>
                  <ul className="grid list-disc gap-1 pl-4">
                    <li>The longest first permit, at three years</li>
                    <li>Geographic proximity</li>
                    <li>A cost of living well below Western Europe</li>
                    <li>More than a hundred technoparks</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-[#1a1a1a]/10 p-5">
                  <h3 className={`mb-2 text-[#B4531A] ${label}`}>Weaknesses</h3>
                  <ul className="grid list-disc gap-1 pl-4">
                    <li>A very young programme with a small intake</li>
                    <li>An inflationary economy that makes long-term planning hard</li>
                    <li>No path to EU membership or a European passport</li>
                  </ul>
                </div>
              </div>
              <div className="border-l-4 border-[#E30A17] bg-[#F2F0E9] p-6">
                <p className="text-sm leading-relaxed text-[#1a1a1a]/80">
                  We deliberately publish no lira figures for fees and running costs. Turkish inflation moves them month to month, and last year&rsquo;s
                  number is worse than no number — you budget against it and come up short. The structure is on this page; the day&rsquo;s estimate
                  belongs in a conversation.
                </p>
              </div>
            </div>
          </div>
          <ReadTracker stopId="leads" message="Horizon checked" />
        </RouteStop>

        {/* 07 — FAQ */}
        <RouteStop
          id="faq"
          number={7}
          eyebrow="Questions founders ask"
          question="Türkiye Tech Visa: frequently asked questions"
          task="Open three answers"
          answer={
            <p>
              Twelve answers, from who actually decides and the real odds to the five-Turkish-employees rule, family, language, timing and how Türkiye
              compares with the European routes.
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
        <section aria-labelledby="sources-h" className="border-b border-[#1a1a1a]/10 bg-white px-6 py-14">
          <div className="container mx-auto">
            <p className={`text-[#B5000F] ${label}`}>Where these figures come from</p>
            <h2 id="sources-h" className="mt-2 font-serif text-3xl">Sources</h2>
            <ol className="mt-6 grid max-w-4xl list-decimal gap-2 pl-5 font-sans text-sm">
              {sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-bold underline decoration-[#E30A17] underline-offset-2 hover:text-[#B5000F]">
                    {s.name}
                  </a>{' '}
                  <span className="text-[#1a1a1a]/60">{s.what} Checked {s.checked}.</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 max-w-4xl font-sans text-xs text-[#1a1a1a]/55">
              The intake figure (22 foreign startups admitted between 16 September 2024 and 3 March 2026) comes from Türkiye&rsquo;s own ecosystem
              reporting.
            </p>
          </div>
        </section>

        {/* Book a session */}
        <section id="book" aria-labelledby="book-h" className="scroll-mt-32 bg-[#0A0E1A] px-6 py-16 text-white">
          <div className="container mx-auto grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <div>
              <RouteFinish />
              <p className={`text-[#ff5a63] ${label}`}>Talk it through</p>
              <h2 id="book-h" className="mt-2 font-serif text-4xl leading-tight">
                Would a jury call <span className="italic text-[#ff5a63]">this innovative?</span>
              </h2>
              <p className="mt-3 max-w-[52ch] font-sans text-white/70">
                That is the question the route turns on, and it is answerable before you spend anything. We work on the file up to the technopark decision
                — and we say no when the honest answer is no.
              </p>
              <ul className="my-5 flex flex-wrap gap-2 font-sans text-xs">
                {['Free · 60 minutes', 'Online, Google Meet', 'Link sent after booking'].map((p) => (
                  <li key={p} className="rounded-full border border-white/25 px-3 py-1.5">{p}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link href="/book-meeting" className="inline-flex items-center gap-2 rounded-full bg-[#E30A17] px-6 py-3.5 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
                  Book a free session <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/country" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 font-sans text-sm transition-colors hover:bg-white/10">
                  All jurisdictions
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
            <div className="mb-6">
              <p className={`text-[#B5000F] ${label}`}>Keep reading</p>
              <h2 id="reads-h" className="mt-2 font-serif text-3xl md:text-4xl">More Türkiye guides</h2>
            </div>
            <ul className="grid snap-x snap-mandatory auto-cols-[82%] grid-flow-col gap-4 overflow-x-auto pb-2 md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:overflow-visible">
              {reads.map((r) => (
                <li key={r.slug} className="group snap-start overflow-hidden rounded-2xl border border-[#1a1a1a]/10 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0A0E1A]/10">
                  <Link href={`/blog/${r.slug}`} className="block">
                    <span className="relative block aspect-video overflow-hidden">
                      <Image src={r.cover} alt="" fill sizes="(min-width: 768px) 33vw, 82vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </span>
                    <span className="grid gap-2 p-5">
                      <span className={`text-[#B5000F] ${label}`}>{r.stage}</span>
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

      {/* Notice */}
      <section className="border-t border-[#1a1a1a]/10 bg-[#F9F9F9] px-6 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#1a1a1a]/30" aria-hidden="true" />
            <p className="font-sans text-[11px] leading-relaxed text-[#1a1a1a]/55">
              <strong>Regulatory Notice:</strong> Figures on this page were verified on 8 September 2026 against the Türkiye Tech Visa programme&apos;s
              official site and the general Turkish work-permit rules for a foreign company partner. They are provided for informational purposes only.
              Always verify current rules at{' '}
              <a href="https://turkiyetechvisa.gov.tr/" target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-[#B5000F]">turkiyetechvisa.gov.tr</a>.
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
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 transition-colors hover:text-[#B5000F] group-open:text-[#B5000F] [&::-webkit-details-marker]:hidden">
        <h3 className="font-serif text-xl leading-snug">{q}</h3>
        <span aria-hidden="true" className="font-serif text-2xl transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="max-w-[72ch] pb-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/65">{a}</p>
    </details>
  );
}
