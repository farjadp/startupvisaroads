// ============================================================================
// Page: app/[locale]/(public)/country/israel/page.tsx
// Layout: a guided route, built on the Finland page's pattern. A compact Tel
// Aviv hero, a sticky rail whose Israeli flag rises as the reader completes
// each stop, and one stop per question people actually search. Every stop
// opens with its question as the H2 and a ~50-word direct answer (the passage
// answer engines quote), then the detail: real tables, lists, and a small game
// on top. All copy is rendered on the server, so crawlers and AI engines read
// the whole page. The three Israel-shaped games (passport check, Tnufa sorter,
// the two-year B/1 clock) live next to this file in IsraelWidgets.tsx.
//
// Subject: the Israel Innovation Visa (B/2 Innovation) — recommended by the
// Israel Innovation Authority, issued by the Population and Immigration
// Authority (PIBA), gated by acceptance at a "landing pad".
//
// THREE EDITORIAL DECISIONS WORTH KNOWING BEFORE YOU EDIT THIS.
//
// 1. The twelve landing pads are dated. That list — Tel Aviv Global, Samurai
//    Incubate, TechForGood, Trendlines, MATI Haifa, Hebrew University,
//    Lighthouse, TheHive by Gvahim, Alon MedTech, Terralab, Kitchen Hub,
//    Initech — comes from the 2017 pilot announcement, and nothing newer
//    confirms it is the current roster. The page prints it WITH its date
//    rather than as today's roster, which is the whole difference between a
//    reference and a lie of omission.
//
// 2. No proof-of-funds figure appears. Israel publishes none for this visa —
//    only "a declaration of means". The $15k–$50k a year that circulates is a
//    practitioner estimate. Printing it would turn an estimate into a rule.
//    (It survives only inside the FAQ answer that explains why it is not one.)
//
// 3. Nationals of states Israel designates as enemy states — Iran among them
//    — cannot use this route, and the page says so in the hero and in its own
//    stop, second on the route, with a passport check. The Persian twin at
//    /fa/israel leads with it, because that site's whole readership is affected.
//
// The defence-linked innovation programmes (INNOFENSE with DDR&D/MAFAT,
// INNOTAL, MEIMAD, the cyber tracks) get exactly one neutral sentence in the
// snapshot. They are publicly announced government programmes; they are not
// this page's subject and the Persian twin omits them entirely.
//
// Verified 2026-09-09 against the Israel Innovation Authority's Innovation
// Visa and Ideation (Tnufa) programme pages, the 2024 re-approval of the
// procedure with PIBA, the 2017 landing-pad announcement, and Israeli entry
// law for nationals of designated enemy states.
//
// Open questions, from lib/routes-v2/tr-il-ae.ts (checked 15 Oct 2026, marked
// verified: false, so not used to change this page): it records that the IIA
// CEO decides after an examiner's review, first come first served (this page
// says "a committee decides"), and that gov.il still hosts only the 2016 pilot
// procedure 5.3.0029 while the IIA says the procedure was approved in 2024.
// Re-check both against the IIA page before the next edit.
//
// No English video exists for this route, so there is no video stop. No
// English blog article about Israel exists either, so "keep reading" links
// comparable country guides instead.
//
// Photos: all three are local files and genuinely Israel — the Tel Aviv shore,
// the Azrieli Center towers, and Café Noir on a Tel Aviv street.
// ============================================================================

import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from '@/routing';
import { metaFor } from '@/lib/pageMeta';
import JsonLd from '@/components/JsonLd';
import { faqJsonLd } from '@/lib/seo';
import { MAIN_CONTACT } from '@/content/contact';
import Flag, { type FlagCode } from '@/components/route/flags';
import { RouteProvider, RouteRail, RouteStop, RouteFinish, type RouteStopDef, type RouteTheme } from '@/components/route/RouteProgress';
import { CopyButton, GateQuiz, OpenedTracker, ParallaxLayer, PerkOrCatch, StepWalker, type RouteStep } from '@/components/route/RouteWidgets';
import { ConversionClock, PassportCheck, TnufaCheck, type ClockCopy, type PassportOption, type TnufaItem } from './IsraelWidgets';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/country/israel', locale);
}

// ─── Data ────────────────────────────────────────────────────────────────────

// When the facts were last verified (see the header). Keep in step with layout.tsx.
const UPDATED = { iso: '2026-09-09', label: '9 Sep 2026' };

// The page's own palette: the flag's blue on near-black. #0038B8 reads at
// 8.2:1 on the paper (#F2F0E9) and 9.3:1 on white, and white on it at 9.3:1,
// so the flag blue itself is the text accent. On the dark bands it drops to
// about 2:1, so text there uses the page's lighter #4d7fff (5.3:1 on #0a0e1a).
const THEME: RouteTheme = { accent: '#0038B8', accentInk: '#FFFFFF', accentText: '#0038B8', primary: '#0038B8', deep: '#0a0e1a', soft: '#E6ECFA', accentOnDark: '#4d7fff' };

const STOPS: RouteStopDef[] = [
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'passport', label: 'Your passport' },
  { id: 'gate', label: 'Eligibility' },
  { id: 'pads', label: 'Landing pads' },
  { id: 'steps', label: '5 steps' },
  { id: 'money', label: 'Money' },
  { id: 'life', label: 'Life on B/2' },
  { id: 'after', label: 'After 2 years' },
  { id: 'faq', label: 'FAQ' },
];

const passportOptions: PassportOption[] = [
  {
    label: 'Iran, Lebanon, Syria or Iraq',
    verdict: 'This route is closed to you.',
    body: 'Israel designates these states as enemy states, and its law bars the Interior Minister from granting citizenship, residence permits, or permits to enter and stay to their citizens. A humanitarian exception exists; its quota is very small and it has nothing to do with entrepreneurship or investment.',
    tone: 'closed',
  },
  {
    label: 'One of those, plus a second nationality',
    verdict: 'Not automatically resolved.',
    body: 'The restriction attaches to citizenship of a designated state, not to the document you travel on, and we found no official source saying dual nationals are outside it. Take the question to an Israeli immigration lawyer before anything else.',
    tone: 'closed',
  },
  {
    label: 'Israeli citizen or resident',
    verdict: 'Not this route.',
    body: 'The applicant must be neither a citizen nor a resident of Israel.',
    tone: 'closed',
  },
  {
    label: 'Another country',
    verdict: 'Not one of the four named here.',
    body: 'Israel designates certain states as enemy states, Iran, Lebanon, Syria and Iraq among them, so the list may be longer than these four: confirm yours is not on it. If it is not, the real gate is next: a landing pad\'s written acceptance.',
    tone: 'check',
  },
];

const criteria = [
  { title: 'Not Israeli', body: 'The applicant must be neither a citizen nor a resident of Israel.' },
  { title: 'Two years in the field', body: 'Documented experience relevant to the idea you are proposing, and the capacity to carry it forward.' },
  { title: 'Real technological novelty', body: 'A high level of technological innovation, a workable feasibility plan, and a project that genuinely needs professional and logistical support to become a product.' },
  { title: 'Commercial reach', body: 'Significant commercial potential, global markets in particular, on a path that ends in an industrial company established in Israel.' },
];

// The list as announced in 2017. Presented with its date on purpose — see the
// file header. Focus notes only where the 2017 announcement stated one.
const landingPads = [
  { name: 'Tel Aviv Global', note: 'A department of the Tel Aviv-Yafo Municipality, not a standalone body.' },
  { name: 'Samurai Incubate', note: 'Japanese seed investor, active in Israel.' },
  { name: 'TechForGood', note: 'Environmental and social impact ventures.' },
  { name: 'The Trendlines Group', note: 'Agritech, food tech and medical devices.' },
  { name: 'MATI Haifa', note: "SME development centre for Haifa's economy." },
  { name: 'Hebrew University of Jerusalem', note: 'University-linked commercialisation.' },
  { name: 'Lighthouse', note: 'Shared workspace with founder support.' },
  { name: 'TheHive by Gvahim', note: 'Non-profit; integrating skilled newcomers.' },
  { name: 'Alon MedTech Ventures', note: 'Medical technology.' },
  { name: 'Terralab Ventures', note: 'Early-stage venture investor.' },
  { name: 'Kitchen Hub', note: 'Food tech incubator.' },
  { name: 'Initech', note: 'Digital product development.' },
];

const steps: RouteStep[] = [
  {
    title: 'Win a landing pad',
    who: 'Incubator or accelerator',
    body: 'Pitch your project to an approved supporting framework — an incubator or accelerator the programme calls a "landing pad". It must issue a formal letter confirming it will host and support you for the duration of your stay in Israel.',
    note: 'Without that letter nothing downstream starts. This is the real gate, not the immigration desk.',
    figure: 'Letter',
    figureLabel: 'of acceptance, in writing',
  },
  {
    title: 'Apply to the Innovation Authority',
    who: 'Israel Innovation Authority',
    body: 'File with the Israel Innovation Authority: business plan, CV, the landing pad letter, and a declaration of the financial means to cover your living costs for the whole stay. A professional evaluator assesses the project and a committee decides.',
    note: 'You must have at least two years of experience in the field of the idea you are proposing.',
    figure: '2 yrs',
    figureLabel: 'experience in the field',
  },
  {
    title: 'Recommendation, not a visa',
    who: 'Innovation Authority → PIBA',
    body: 'Approval produces a formal recommendation letter to the Population and Immigration Authority (PIBA). The Innovation Authority does not issue visas and never has — it recommends. PIBA decides.',
    note: 'Read every offer that claims otherwise as a warning sign.',
    figure: 'IIA → PIBA',
    figureLabel: 'recommends, then decides',
  },
  {
    title: 'PIBA issues the B/2',
    who: 'Population and Immigration Authority',
    body: 'Apply at an Israeli consulate abroad, or — if you are visa-exempt on entry — inside Israel within 30 days of arrival. PIBA issues the B/2 Innovation visa for a period of up to two years.',
    note: 'Spouse and children under 18 do not get innovation visas: they apply separately for B/2 tourist visas, extendable to match your stay.',
    figure: '30 days',
    figureLabel: 'to apply in Israel, if visa-exempt',
  },
  {
    title: 'Build, then convert',
    who: 'B/1 expert work visa',
    body: 'All R&D must happen inside Israel. If the project matures into a product or a stable company, apply for the B/1 expert work visa at least three months before your current visa expires — recognised as an Expert by that company, as employee or shareholder.',
    note: 'B/1 is where a work permit finally appears. B/2 never was one.',
    figure: '3 months',
    figureLabel: 'before expiry, file for B/1',
  },
];

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to apply for the Israel Innovation Visa (B/2 Innovation)',
  inLanguage: 'en',
  step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.body })),
};

const money = [
  {
    label: 'Your own living costs',
    figure: 'No published figure',
    body: 'The rule asks for a declaration showing you can cover your living costs for the entire stay. Israel publishes no minimum. Any dollar figure you have been quoted is somebody\'s estimate, not a threshold — and the landing pad contributes nothing towards it.',
  },
  {
    label: 'Ideation (Tnufa) grant',
    figure: 'Up to NIS 200,000',
    body: '80% of an approved budget capped at NIS 250,000 per application. Prototype, IP protection and patent attorneys, early business development, materials and components, subcontractors and consultants, exhibitions. Explicitly NOT salaries and NOT overheads.',
  },
  {
    label: 'Technological incubator',
    figure: 'Up to NIS 3.5m',
    body: 'A different, larger programme: up to 85% of an approved budget over an operating period of up to two years, with the host incubator putting in the remaining 15%. You risk no capital of your own — and the incubator takes a substantial stake, reported as high as 50%.',
  },
  {
    label: 'Repayment',
    figure: 'Royalties only',
    body: 'The Innovation Authority shares the development risk and takes no share of the upside. Repayment is due only if the project reaches commercial sales, and then only as a royalty. No bank guarantee, no equity to the Authority, and nothing owed if the venture fails.',
  },
];

// What Tnufa covers and excludes, as the money section lists it.
const tnufaItems: TnufaItem[] = [
  { label: 'Building the prototype', covered: true },
  { label: 'Your own salary', covered: false },
  { label: 'IP protection and patent attorneys', covered: true },
  { label: 'Office overheads', covered: false },
  { label: 'Materials and components', covered: true },
  { label: 'Your rent and living costs', covered: false },
  { label: 'Subcontractors and consultants', covered: true },
  { label: 'Exhibitions', covered: true },
];

const rights = [
  { title: 'Two years to build', content: 'Up to two years: the window in which a technological idea becomes a product or a company.', positive: true },
  { title: 'Not a work permit', content: 'B/2 is a residence and visit permit. No employer–employee relationship with an Israeli company, no salary from one, and work on the approved project only.', positive: false },
  { title: 'Landing pad support', content: 'Workspace, technological infrastructure, administrative, business and logistical support, mentorship, and access to the local ecosystem and investors.', positive: true },
  { title: 'Money to live on', content: 'The landing pad does not fund your living costs, and Tnufa excludes salaries and overheads. You declare your own means for the whole stay.', positive: false },
  { title: 'Your family', content: 'A spouse and children under 18 can come, on B/2 tourist visas that can be extended to run alongside your permit for its full duration.', positive: true },
  { title: 'R&D location', content: 'All research and development must be carried out inside Israel. A condition, not a preference.', positive: false },
  { title: 'Grant repayment', content: 'Tnufa is repaid only if the project reaches commercial sales, and then only as a royalty. Nothing is owed if the venture fails.', positive: true },
  { title: 'A settlement route?', content: 'No. The B/2 is meant to be the window in which an idea becomes a product or a company — not a settlement route in itself.', positive: false },
];

const clock: ClockCopy = {
  months: 24,
  leadMonths: 3,
  phases: {
    build: { title: 'Build the product', body: 'Work only on the approved project, all R&D inside Israel. {left} until the latest point to file for B/1, if your B/2 runs the full two years.' },
    file: { title: 'File for the B/1 now', body: 'The B/1 application is due at least three months before your current visa expires. You need a product or a stable company that recognises you as an Expert, as employee or shareholder.' },
    end: { title: 'The B/2 has ended', body: 'Without a B/1, the stay ends here. The B/2 was never a settlement route.' },
  },
};

const faqs = [
  {
    q: 'Is the Israel Innovation Visa a work permit?',
    a: 'No, and this is the single most common misunderstanding. B/2 is a residence and visit permit. The holder may not enter an employer–employee relationship with an Israeli company or draw a salary from one, and must work on the approved project only. The work permit arrives later, if at all, as the B/1 expert visa.',
  },
  {
    q: 'How long does the Israel Innovation Visa last?',
    a: 'Up to two years. It is meant to be the window in which a technological idea becomes a product or a company — not a settlement route in itself.',
  },
  {
    q: 'Who decides on an Israel Innovation Visa application?',
    a: 'Three bodies in sequence. A landing pad must accept you and put that in writing. The Israel Innovation Authority then evaluates the project and, if it approves, issues a recommendation. The Population and Immigration Authority issues — or refuses — the visa. Only the third of those is an immigration decision, and only the first is something you can work on directly.',
  },
  {
    q: 'Is the list of twelve Israeli landing pads still current?',
    a: 'We could not confirm that it is. The list circulating everywhere — Tel Aviv Global, Samurai Incubate, TechForGood, Trendlines, MATI Haifa, Hebrew University, Lighthouse, TheHive by Gvahim, Alon MedTech, Terralab, Kitchen Hub, Initech — comes from the 2017 pilot announcement, and no newer official source we found restates it. Treat it as a starting point for your own enquiry with the Innovation Authority, not as today\'s roster.',
  },
  {
    q: 'How much money do I need to show for the Israel Innovation Visa?',
    a: 'There is no published minimum. The requirement is a declaration demonstrating the financial resources to cover your living costs throughout your stay. Estimates circulate — commonly $15,000 to $50,000 a year — but they are practitioners\' figures, not a rule, and we do not repeat them as one. Israel is an expensive country and the declaration is assessed against real costs.',
  },
  {
    q: 'Does the landing pad pay me anything?',
    a: 'No. It provides workspace, technological infrastructure, administrative, business and logistical support, mentorship, and access to the local ecosystem and investors. It does not fund your living costs, and acceptance carries no commitment to pay you anything at all.',
  },
  {
    q: 'Can the Tnufa grant pay my salary?',
    a: 'No. Salaries and overheads are explicitly excluded. Tnufa is money to build the thing, not money to live on — budget accordingly, or you discover the gap in month three.',
  },
  {
    q: 'Can my family come with me on the Israel Innovation Visa?',
    a: 'A spouse and children under 18, yes — but not on innovation visas. They apply through the ordinary route for B/2 tourist visas, which can be extended to run alongside your permit for its full duration.',
  },
  {
    q: 'What happens when the two-year Innovation Visa ends?',
    a: 'If the project has become a product or a stable company, you may apply for the B/1 expert work visa: you must be recognised as an Expert by that company, as an employee or as a shareholder continuing to develop it. File at least three months before your current visa expires. PIBA decides, on a recommendation from the Chief Scientist\'s office. B/1 carries a work permit, which B/2 never did.',
  },
  {
    q: 'Can nationals of any country apply for the Israel Innovation Visa?',
    a: 'No. Israel designates certain states as enemy states — Iran, Lebanon, Syria and Iraq among them — and its law bars the Interior Minister from granting entry or residence permits to their citizens, outside a narrow humanitarian exception with a very small quota that has nothing to do with entrepreneurship. Holding a second nationality does not automatically remove the restriction, which attaches to citizenship rather than to the passport you travel on. If this describes you, take the question to an Israeli immigration lawyer and treat any adviser who answers it confidently without seeing your file as a warning sign.',
  },
];

// Only one deep URL for this route exists in the repo (the IIA programme
// page, also cited in lib/routes-v2). Everything else links a domain root, or
// nothing, rather than a guessed path.
const sources: { name: string; href: string | null; what: string; checked: string }[] = [
  {
    name: 'Israel Innovation Authority — Innovation Visa for a Foreign Technology Entrepreneur',
    href: 'https://innovationisrael.org.il/en/programs/tech-innovation-visa/',
    what: 'Eligibility, the landing-pad letter, the recommendation to PIBA, and the 2024 re-approval of the procedure.',
    checked: '9 Sep 2026',
  },
  {
    name: 'Israel Innovation Authority — Ideation (Tnufa) programme',
    href: 'https://innovationisrael.org.il/',
    what: 'Grant ceiling, the 80% rate and NIS 250,000 budget cap, covered and excluded costs. Linked to the Authority\'s home page; the programme page is reached from there.',
    checked: '9 Sep 2026',
  },
  {
    name: 'Population and Immigration Authority (PIBA) — gov.il',
    href: 'https://www.gov.il/',
    what: 'The authority that issues the B/2 and B/1 visas. Linked to the gov.il home page rather than a guessed deep link.',
    checked: '9 Sep 2026',
  },
  {
    name: 'The 2017 pilot announcement of the twelve landing pads',
    href: null,
    what: 'As reported at the time by the Times of Israel and the Jewish Press. Nothing newer restates the list.',
    checked: '9 Sep 2026',
  },
  {
    name: 'Israeli entry law for nationals of designated enemy states',
    href: null,
    what: 'The bar on entry and residence permits for citizens of designated states, and its humanitarian exception.',
    checked: '9 Sep 2026',
  },
];

// No English article about Israel exists yet (sitemap checked 29 Oct 2026),
// so these are comparable country guides rather than Israel reads.
const related: { href: string; flag: FlagCode; stage: string; title: string; excerpt: string }[] = [
  {
    href: '/country/turkey',
    flag: 'tr',
    stage: 'Also gated by a host',
    title: 'Türkiye Tech Visa: Three Years, And 22 Startups',
    excerpt: 'A three-year work permit, decided by a technopark jury rather than the Ministry.',
  },
  {
    href: '/country/australia',
    flag: 'au',
    stage: 'Another innovation visa',
    title: 'National Innovation Visa (858): Australia By Invitation',
    excerpt: 'Australia\'s innovation route, which you enter by invitation only.',
  },
  {
    href: '/country/finland',
    flag: 'fi',
    stage: 'A startup permit with residence',
    title: 'Finland Startup Visa 2026',
    excerpt: 'Business Finland\'s gate, the Fast Track permit, family rights and five routes to permanent residence.',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

const label = 'font-sans text-xs font-bold uppercase tracking-[0.18em]';

// setRequestLocale before the first <Link>: without it next-intl reads
// headers(), Next renders the route dynamically and streams <title> and
// the meta tags into <body> instead of <head>.
export default async function IsraelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="w-full overflow-x-clip bg-[#F2F0E9] text-[#1a1a1a]">
      <JsonLd data={[howToJsonLd, faqJsonLd(faqs.map((f) => ({ question: f.q, answer: f.a })), 'en')]} />

      <RouteProvider stops={STOPS} flag="il" theme={THEME}>
        {/* ── Hero: the answer up front ── */}
        <header className="relative overflow-hidden bg-[#0a0e1a] text-white">
          <Image
            src="/fa/img/israel.webp"
            alt="Waves breaking on the rocky Tel Aviv shore under a cloudy sky, with the city's towers along the coast behind"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_60%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/95 via-[#0a0e1a]/80 to-[#0a0e1a]/35" />

          <div className="container relative mx-auto grid grid-cols-1 items-end gap-8 px-6 pb-12 pt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <nav aria-label="Breadcrumb" className="font-sans text-xs text-white/60 lg:col-span-2">
              <ol className="flex flex-wrap gap-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link href="/country" className="hover:text-white">Countries</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-white/85">Israel</li>
              </ol>
            </nav>

            <div>
              <div className={`mb-5 flex items-center gap-3 text-white/75 ${label}`}>
                <Flag code="il" uid="hero" width={36} />
                Israel Innovation Visa · B/2 Innovation
              </div>
              <h1>
                <span className="block font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.02em]">
                  Israel <em className="text-[#4d7fff]">Innovation.</em>
                </span>
                <span className="mt-4 block max-w-[46ch] font-sans text-lg font-medium leading-snug">
                  The Israel Innovation Visa for foreign technology entrepreneurs in 2026, step by step
                </span>
              </h1>
              <p className="mt-3 max-w-[56ch] font-sans text-base leading-relaxed text-white/70">
                Two years to turn an idea into a company. And it is not a work permit. The gate is not an immigration officer. It is an incubator: an
                approved &ldquo;landing pad&rdquo; must accept you and say so in writing before the Israel Innovation Authority will even look at your file.
              </p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-white/60">
                <span>By <span className="text-white">Farjad P.D</span></span>
                <span>Updated <time dateTime={UPDATED.iso} className="text-white">{UPDATED.label}</time></span>
                <span>Checked against the Israel Innovation Authority&apos;s programme pages</span>
              </p>
              <p className="mt-5 max-w-[60ch] border-l-2 border-[#FDBA74] pl-3 font-sans text-sm text-white/70">
                <strong className="text-white">Not open to every passport.</strong> Israeli law bars citizens of states it designates as enemy states
                &mdash; Iran, Lebanon, Syria and Iraq among them &mdash; from this route. <a href="#passport" className="text-white underline underline-offset-2">Check yours first.</a>
              </p>
            </div>

            <aside aria-label="How to use this page" className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <p className={`text-[#4d7fff] ${label}`}>Your route through this page</p>
              <ol className="my-4 list-decimal space-y-1 pl-5 font-sans text-sm text-white/75">
                <li>Check your passport against the law</li>
                <li>Test yourself on the four criteria</li>
                <li>Walk the five stages, in order</li>
                <li>Sort what Tnufa will and won&apos;t pay for</li>
                <li>Find your B/1 deadline</li>
              </ol>
              <a href="#passport" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-sans text-sm font-bold text-[#0038B8] transition-transform hover:-translate-y-0.5">
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
          question="What is the Israel Innovation Visa?"
          task="Read the four facts"
          completeOn="view"
          message="Snapshot read"
          answer={
            <p>
              The Israel Innovation Visa is a B/2 residence permit of up to two years for foreign technology founders. An approved landing pad must accept
              you in writing, the Israel Innovation Authority evaluates the project and recommends you, and the Population and Immigration Authority
              issues the visa. It is not a work permit, and all R&amp;D must happen in Israel.
            </p>
          }
        >
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { stat: 'B/2', label: 'Visa type', sub: 'residence, not work' },
              { stat: '2 yrs', label: 'Maximum stay', sub: 'then convert or leave' },
              { stat: '2 yrs', label: 'Experience required', sub: 'in the field of the idea' },
              { stat: '100%', label: 'Of R&D in Israel', sub: 'a condition, not a preference' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white p-5 transition-transform hover:-translate-y-1">
                <dt className="order-2 mt-2 font-sans text-sm font-bold">{s.label}</dt>
                <dd className="order-1 font-serif text-4xl text-[#0038B8]">{s.stat}</dd>
                <dd className="order-3 font-sans text-xs text-[#1a1a1a]/55">{s.sub}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 grid max-w-5xl grid-cols-1 gap-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70 md:grid-cols-3">
            <p>
              <strong className="text-[#1a1a1a]">A recommendation, not a visa.</strong> Israel&rsquo;s technology sector is roughly a fifth of its GDP,
              and the Innovation Visa exists to pull founders into it. Announced as a pilot in 2017, the current procedure was approved in{' '}
              <strong className="text-[#1a1a1a]">2024</strong> together with the Population and Immigration Authority.
            </p>
            <p>
              Understand the decision chain before anything else, because almost every misdescription of this route starts here. The{' '}
              <strong className="text-[#1a1a1a]">Israel Innovation Authority does not issue visas</strong>. It evaluates your project and, if it approves,
              writes a recommendation. PIBA issues the visa. And before either of them will act, a landing pad has to have accepted you.
            </p>
            <p>
              The Authority also runs the funding programmes a founder here would use — Ideation (Tnufa) at idea stage, the technological incubators
              above it — and, with the Ministry of Defense, a set of dual-use programmes that are outside the scope of this page.
            </p>
          </div>
        </RouteStop>

        {/* 02 — Who cannot use this route */}
        <RouteStop
          id="passport"
          number={2}
          tone="white"
          eyebrow="Access · before anything else"
          question="Can I apply for the Israel Innovation Visa with my passport?"
          task="Check your citizenship"
          answer={
            <p>
              Not with every passport. Israel designates certain states as enemy states — Iran, Lebanon, Syria and Iraq among them — and its law bars the
              Interior Minister from granting their citizens entry or residence permits. The humanitarian exception has a very small quota and nothing to
              do with entrepreneurship. A second nationality does not automatically remove the restriction.
            </p>
          }
        >
          <PassportCheck stopId="passport" options={passportOptions} />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <figure className="relative hidden min-h-[280px] overflow-hidden rounded-2xl lg:block">
              <Image
                src="/fa/img/israel-3.webp"
                alt="Café Noir on a Tel Aviv street in daylight, diners at tables under green awnings"
                fill
                sizes="(min-width: 1024px) 40vw, 0px"
                className="object-cover"
              />
            </figure>
            <div className="grid content-start gap-5 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              <p>
                Israel designates certain states as enemy states — <strong className="text-[#1a1a1a]">Iran, Lebanon, Syria and Iraq</strong> among them —
                and its law bars the Interior Minister from granting citizenship, residence permits, or permits to enter and stay to their citizens. A
                humanitarian exception exists; its quota is very small and its subject matter has nothing to do with entrepreneurship or investment.
              </p>
              <p>
                A second nationality does not automatically resolve this. The restriction attaches to citizenship of a designated state, not to the
                document you travel on, and we found no official source saying dual nationals are outside it. There may also be consequences under the
                law of the other country — Iranian law and the Iranian passport itself prohibit travel to Israel.
              </p>
              <div className="rounded-r-xl border-l-4 border-[#B4531A] bg-[#fff7ed] p-5 text-sm text-[#1a1a1a]/80">
                If any of this describes you, take the question to an Israeli immigration lawyer. Treat any adviser who answers it confidently without
                seeing your file — or who sells you this route as a migration pathway — as a warning sign. Our Persian guide at{' '}
                <Link href="/israel" locale="fa" className="font-bold text-[#0038B8] underline underline-offset-2">
                  /fa/israel
                </Link>{' '}
                says the same thing at greater length, because its whole readership is affected.
              </div>
            </div>
          </div>
        </RouteStop>

        {/* 03 — Eligibility */}
        <RouteStop
          id="gate"
          number={3}
          eyebrow="What they are actually asking for"
          question="Who is eligible for the Israel Innovation Visa?"
          task="Answer all four"
          answer={
            <p>
              You must be neither an Israeli citizen nor a resident, have at least two years of experience in the field of your idea, and bring real
              technological novelty with significant commercial potential, especially in global markets. All R&amp;D must happen inside Israel, and you
              must declare the means to cover your living costs for the whole stay.
            </p>
          }
        >
          <GateQuiz
            stopId="gate"
            criteria={criteria}
            strongNote="The next gate is not the Authority: it is a landing pad's written acceptance."
            gapNote="A professional evaluator assesses the project and a committee decides."
          >
            <h3 className="font-serif text-xl">Two conditions outside the grid</h3>
            <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]/65">
              Two conditions sit outside that grid and are missed more often than any of them. All research and development must be carried out{' '}
              <strong className="text-[#1a1a1a]">inside Israel</strong>. And you must file a declaration of the financial means to support yourself for
              the whole stay — the landing pad contributes nothing towards your living costs.
            </p>
            <Link href="/book-meeting" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#0038B8] px-5 py-3 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
              Get a free read on your route <ArrowRight className="h-4 w-4" />
            </Link>
          </GateQuiz>
        </RouteStop>

        {/* 04 — Landing pads */}
        <RouteStop
          id="pads"
          number={4}
          tone="white"
          eyebrow="The real gate"
          question="What is a landing pad for the Israel Innovation Visa?"
          task="Read the dated list"
          completeOn="view"
          message="Landing pads read"
          answer={
            <p>
              A landing pad is an approved incubator or accelerator that agrees, in a formal letter, to host and support you for your whole stay in
              Israel. Without that letter the Innovation Authority will not look at your file. Twelve were named when the pilot was announced in 2017; no
              newer official source we found restates that list.
            </p>
          }
        >
          <div className="mb-6 max-w-3xl rounded-r-xl border-l-4 border-[#B4531A] bg-[#fff7ed] p-5">
            <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]/80">
              <strong>This list is from 2017.</strong> It was published when the programme was announced as a pilot, and no newer official source we
              could find restates it. It is printed here with its date because that is the honest way to print it — take it as a starting point for your
              own enquiry with the Innovation Authority, never as today&rsquo;s roster.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] overflow-hidden rounded-2xl bg-[#F2F0E9] font-sans text-sm">
              <caption className="pb-2 text-left font-bold">The twelve landing pads named in the 2017 pilot announcement</caption>
              <thead>
                <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                  <th scope="col" className="px-4 py-3">Landing pad</th>
                  <th scope="col" className="px-4 py-3">Focus, as stated in 2017</th>
                </tr>
              </thead>
              <tbody>
                {landingPads.map((p) => (
                  <tr key={p.name} className="border-b border-[#1a1a1a]/10 last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-bold">{p.name}</th>
                    <td className="px-4 py-3 text-[#1a1a1a]/65">{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-3xl font-sans text-sm leading-relaxed text-[#1a1a1a]/65">
            What a landing pad gives: workspace, technological infrastructure, administrative, business and logistical support, mentorship, and a route
            into the local ecosystem and its investors. What it does not give: money to live on.
          </p>
        </RouteStop>

        {/* 05 — How to apply */}
        <RouteStop
          id="steps"
          number={5}
          eyebrow="Five stages, in this order"
          question="How do you apply for the Israel Innovation Visa?"
          task="Walk to stage 5"
          answer={
            <p>
              Get a landing pad&apos;s letter, then apply to the Israel Innovation Authority with your business plan, CV, that letter and a declaration of
              means. A professional evaluator assesses the project and a committee decides. Approval is a recommendation to PIBA, which issues the B/2 visa
              for up to two years, at a consulate abroad or, if visa-exempt, inside Israel.
            </p>
          }
        >
          <StepWalker stopId="steps" steps={steps} />
          <p className="mt-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            <strong className="text-[#1a1a1a]">Each stage produces the input for the next one.</strong> Skipping to the immigration question is the most
            expensive mistake available on this route: without a landing pad&rsquo;s letter there is no file to submit.
          </p>
        </RouteStop>

        {/* Photo band */}
        <figure className="relative flex min-h-[360px] items-end overflow-hidden bg-[#0a0e1a] text-white">
          <ParallaxLayer>
            <Image
              src="/fa/img/israel-2.webp"
              alt="The round and square towers of the Azrieli Center in Tel Aviv, seen from below against a clear blue sky"
              fill
              sizes="100vw"
              className="object-cover object-[center_35%]"
            />
          </ParallaxLayer>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0e1a]/25 to-[#0a0e1a]/90" />
          <figcaption className="container relative mx-auto flex flex-wrap items-end justify-between gap-5 px-6 py-10">
            <div>
              <p className={`text-[#4d7fff] ${label}`}>Stage 5 · Build, then convert</p>
              <p className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
                All R&amp;D in Israel.<br />
                <span className="italic text-[#4d7fff]">B/1 is where the work permit appears.</span>
              </p>
            </div>
            <span className="font-sans text-xs text-white/60">Azrieli Center, Tel Aviv</span>
          </figcaption>
        </figure>

        {/* 06 — Money */}
        <RouteStop
          id="money"
          number={6}
          eyebrow="Four different things people keep confusing"
          question="How much money do you need for the Israel Innovation Visa?"
          task="Sort all eight costs"
          answer={
            <p>
              Israel publishes no minimum: you file a declaration that you can cover your living costs for the whole stay, and the landing pad contributes
              nothing. The Ideation (Tnufa) grant pays up to NIS 200,000, 80% of an approved budget capped at NIS 250,000, but never salaries or
              overheads. It is repaid only as a royalty on commercial sales.
            </p>
          }
        >
          <TnufaCheck stopId="money" items={tnufaItems} rate={0.8} cap={250000} />

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
              <caption className="pb-2 text-left font-bold">
                Your own means, the idea-stage grant, the incubator programme, and what you owe back: four separate questions with four different answers
              </caption>
              <thead>
                <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                  <th scope="col" className="px-4 py-3">Question</th>
                  <th scope="col" className="px-4 py-3">Figure</th>
                  <th scope="col" className="px-4 py-3">What it means</th>
                </tr>
              </thead>
              <tbody>
                {money.map((m) => (
                  <tr key={m.label} className="border-b border-[#1a1a1a]/10 align-top last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-bold">{m.label}</th>
                    <td className="whitespace-nowrap px-4 py-3 font-serif text-lg text-[#0038B8]">{m.figure}</td>
                    <td className="px-4 py-3 leading-relaxed text-[#1a1a1a]/65">{m.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-3xl border-l-2 border-[#0038B8] pl-4 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
            Tnufa is money to build the product, not money to live on — salaries and overheads are explicitly excluded. Budget for both separately, or
            the gap turns up in month three.
          </p>
        </RouteStop>

        {/* 07 — Life on the B/2 */}
        <RouteStop
          id="life"
          number={7}
          tone="white"
          eyebrow="Perk or catch?"
          question="What can you do on the Israel Innovation Visa, and what can't you?"
          task="Guess all eight"
          answer={
            <p>
              The B/2 gives you up to two years in Israel to build an approved project, with a landing pad&apos;s workspace, mentorship and investor
              access, and your spouse and children under 18 can join on extendable B/2 tourist visas. It is not a work permit: no salary from an Israeli
              company, and all R&amp;D stays in Israel.
            </p>
          }
        >
          <PerkOrCatch stopId="life" items={rights} />
          <div className="mt-8 grid max-w-5xl grid-cols-1 gap-4 font-sans text-sm leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            <p>
              <strong className="text-[#1a1a1a]">Your family comes on a different visa.</strong> Spouse and children under 18 do not get innovation visas:
              they apply separately, through the ordinary route, for B/2 tourist visas, extendable to match your stay.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">Your own work is fenced.</strong> The holder may not enter an employer–employee relationship with an
              Israeli company or draw a salary from one, and must work on the approved project only.
            </p>
          </div>
        </RouteStop>

        {/* 08 — After two years */}
        <RouteStop
          id="after"
          number={8}
          eyebrow="Build, then convert"
          question="What happens after two years on the Israel Innovation Visa?"
          task="Find your B/1 deadline"
          answer={
            <p>
              If the project has become a product or a stable company, you can apply for the B/1 expert work visa, recognised as an Expert by that company
              as an employee or shareholder. File at least three months before your current visa expires. PIBA decides, and the B/1 carries the work
              permit the B/2 never did.
            </p>
          }
        >
          <ConversionClock stopId="after" copy={clock} />
          <p className="mt-4 max-w-[68ch] font-sans text-xs text-[#1a1a1a]/55">
            The clock assumes a B/2 issued for the full two years; PIBA issues it for up to two. Count back three months from your own expiry date.
          </p>
        </RouteStop>

        {/* 09 — FAQ */}
        <RouteStop
          id="faq"
          number={9}
          tone="white"
          eyebrow="The ones that actually get asked"
          question="Israel Innovation Visa: frequently asked questions"
          task="Open three answers"
          answer={<p>Ten answers, from whether the B/2 is a work permit and what Tnufa will not pay for, to whether the 2017 landing-pad list is current and which nationals Israeli law bars from the route.</p>}
        >
          <div className="max-w-4xl border-t border-[#1a1a1a]/10">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-[#1a1a1a]/10" data-faq>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 transition-colors hover:text-[#0038B8] group-open:text-[#0038B8] [&::-webkit-details-marker]:hidden">
                  <h3 className="font-serif text-xl leading-snug">{f.q}</h3>
                  <span aria-hidden="true" className="font-serif text-2xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-[72ch] pb-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/65">{f.a}</p>
              </details>
            ))}
          </div>
          <OpenedTracker stopId="faq" need={3} message="Questions answered" />
        </RouteStop>

        {/* Sources */}
        <section aria-labelledby="sources-h" className="border-b border-[#1a1a1a]/10 bg-[#F2F0E9] px-6 py-14">
          <div className="container mx-auto">
            <p className={`text-[#0038B8] ${label}`}>Where these facts come from</p>
            <h2 id="sources-h" className="mt-2 font-serif text-3xl">Sources</h2>
            <ol className="mt-6 grid max-w-4xl list-decimal gap-2 pl-5 font-sans text-sm">
              {sources.map((s) => (
                <li key={s.name}>
                  {s.href ? (
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-bold underline decoration-[#0038B8] underline-offset-2 hover:text-[#0038B8]">
                      {s.name}
                    </a>
                  ) : (
                    <b>{s.name}</b>
                  )}{' '}
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
              <p className={`text-[#4d7fff] ${label}`}>Talk it through</p>
              <h2 id="book-h" className="mt-2 font-serif text-4xl leading-tight">
                Not sure this is <span className="italic text-[#4d7fff]">your route?</span>
              </h2>
              <p className="mt-3 max-w-[52ch] font-sans text-white/70">
                We do not file Israeli innovation visa applications, and we will say so plainly rather than sell you an introduction. What we do is
                founder-side work on the routes we can actually run — and telling you honestly which of them fits.
              </p>
              <ul className="my-5 flex flex-wrap gap-2 font-sans text-xs">
                {['Free · 60 minutes', 'Online, Google Meet', 'Link sent after booking'].map((p) => (
                  <li key={p} className="rounded-full border border-white/25 px-3 py-1.5">{p}</li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/book-meeting" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-sans text-sm font-bold text-[#0038B8] transition-transform hover:-translate-y-0.5">
                  Book a free session <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/country" className="font-sans text-sm font-bold text-white/80 underline underline-offset-4 hover:text-white">
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

        {/* Related guides: no English Israel article exists yet, so comparable routes. */}
        <section aria-labelledby="reads-h" className="bg-[#F2F0E9] px-6 py-16">
          <div className="container mx-auto">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={`text-[#0038B8] ${label}`}>Keep reading</p>
                <h2 id="reads-h" className="mt-2 font-serif text-3xl md:text-4xl">Routes to compare with Israel</h2>
                <p className="mt-2 max-w-[60ch] font-sans text-sm text-[#1a1a1a]/60">
                  We have not published an English article on Israel yet. These guides cover the closest routes.
                </p>
              </div>
              <Link href="/country" className="inline-flex items-center gap-1.5 font-sans text-sm font-bold text-[#0038B8] hover:underline">
                All country guides <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="grid snap-x snap-mandatory auto-cols-[82%] grid-flow-col gap-4 overflow-x-auto pb-2 md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:overflow-visible">
              {related.map((r) => (
                <li key={r.href} className="snap-start overflow-hidden rounded-2xl border border-[#1a1a1a]/10 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0a0e1a]/10">
                  <Link href={r.href} className="grid h-full gap-3 p-5">
                    <Flag code={r.flag} uid={`read-${r.flag}`} width={40} />
                    <span className={`text-[#0038B8] ${label}`}>{r.stage}</span>
                    <h3 className="font-serif text-xl leading-snug">{r.title}</h3>
                    <span className="font-sans text-sm text-[#1a1a1a]/65">{r.excerpt}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </RouteProvider>

      {/* Notice. The old page carried none; this says only what the header records. */}
      <section className="border-t border-[#1a1a1a]/10 bg-[#F9F9F9] px-6 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#1a1a1a]/30" />
            <p className="font-sans text-[11px] leading-relaxed text-[#1a1a1a]/55">
              <strong>Notice:</strong> The facts on this page were checked on 9 September 2026 against the Israel Innovation Authority&apos;s Innovation
              Visa and Ideation (Tnufa) programme pages, the 2024 re-approval of the procedure with the Population and Immigration Authority, the 2017
              landing-pad announcement, and Israeli entry law. They are provided for informational purposes only. VisaRoads Inc., an Ashavid company, does
              not file Israeli innovation visa applications. Always verify the current rules with the{' '}
              <a href="https://innovationisrael.org.il/" target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-[#0038B8]">
                Israel Innovation Authority
              </a>{' '}
              and the Population and Immigration Authority.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
