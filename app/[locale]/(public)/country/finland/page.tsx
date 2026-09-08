// ============================================================================
// Page: app/[locale]/(public)/country/finland/page.tsx
// Style: Nordic Immersive Editorial — Full Photography Experience
// Vibe: Aurora · Deep tech · Snow · Silence & Speed
//
// Figures verified 2026-09-08 against migri.fi (start-up entrepreneur, income
// requirement, processing fees, permanent residence permit, period of
// residence), valtioneuvosto.fi (the 2026 permit reform) and the Ministry of
// Economic Affairs and Employment working-group report TEM 2025:36 — the
// source of the approval-rate and post-issuance-supervision numbers.
// Income thresholds and Migri fees are revised every January; re-check both.
// ============================================================================

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Snowflake,
  Wifi,
  Rocket,
  Gamepad2,
  CheckCircle,
  Users,
  Lightbulb,
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  Globe,
  Home,
  ChevronRight,
  Award,
  Briefcase,
  GraduationCap,
  Languages,
  Plane,
  Banknote,
  DollarSign,
  FileText,
  Fingerprint,
  Clock,
  Activity,
} from 'lucide-react';
import type { Metadata } from 'next';
import { metaFor } from '@/lib/pageMeta';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/country/finland', locale);
}

// ─── Data ────────────────────────────────────────────────────────────────────

const steps = [
  {
    num: '01',
    title: 'Eligibility Statement',
    icon: FileText,
    body: 'Apply to Business Finland for a positive Eligibility Statement. You submit a full business plan in English: market need, competitor analysis, go-to-market strategy, revenue model, first-year work and budget plan, founder CVs and evidence of traction. Business Finland does not normally interview you — it judges the written file.',
    note: 'Free today. The statement is valid for 4 months, and your Migri application must be filed inside that window.',
  },
  {
    num: '02',
    title: 'Residence permit via Enter Finland',
    icon: Clock,
    body: 'With a positive statement, each founder files a separate first residence permit application in Enter Finland. The first permit must be applied for from outside Finland. Migri does not re-judge your business — it checks the general conditions and your personal means of support.',
    note: '€650 online (€800 on paper). Family members file their own applications alongside yours.',
  },
  {
    num: '03',
    title: 'Identification & Fast Track',
    icon: Fingerprint,
    body: 'Visit a Finnish mission or a VFS Global service point within the deadline Migri gives you, show your passport and give fingerprints. Once the application is complete and identification is done, the Fast Track service targets a decision in about two weeks.',
    note: 'The two weeks run from a complete file — not from the day you decide to apply.',
  },
  {
    num: '04',
    title: 'D visa (optional, recommended)',
    icon: Plane,
    body: 'Apply for a D visa at the same time as the permit. On a positive decision you can fly to Finland immediately and collect the physical residence permit card inside the country, instead of waiting for it abroad.',
    note: '€95 online (€120 on paper), per person.',
  },
  {
    num: '05',
    title: 'Arrive & register',
    icon: Home,
    body: 'Enter Finland, register your municipality of residence with the Digital and Population Data Services Agency (DVV), and register the company with the PRH (Finnish Patent and Registration Office) if you have not already.',
    note: 'First permit is issued for up to 2 years; the extended permit for up to 4 more.',
  },
];

const scoringCriteria = [
  {
    title: 'Innovation',
    icon: Lightbulb,
    desc: 'A clear competitive advantage in international markets. Business Finland applies broadly the same test it uses for its Tempo funding — novelty and new value, not immediate profitability.',
    score: 'Required',
  },
  {
    title: 'International demand',
    icon: TrendingUp,
    desc: 'Real demand potential outside Finland, with a defined go-to-market strategy and customer segments. A profitable local consultancy, shop or restaurant is rejected.',
    score: 'Required',
  },
  {
    title: 'Founder team',
    icon: Users,
    desc: 'At least two founders holding more than 60% of the company between them, both working full-time on it with no side jobs, with complementary skills. Solo founders are effectively out.',
    score: 'Required',
  },
  {
    title: 'Funding for year one',
    icon: DollarSign,
    desc: 'Access to enough money to run the early stage. Finland sets no statutory minimum — unlike Austria (€30k), France (€30k) or Italy (€50k) — but you must budget year one and show where the money comes from.',
    score: 'Required',
  },
];

// 2026 Migri income requirement — net, per month, by region group.
// Group 1: Helsinki, Espoo, Vantaa, Kauniainen. Group 2: other large
// municipalities. Group 3: everywhere else.
const financials = [
  { label: 'Single applicant', eur: '€1,210 / €1,090 / €1,030', total: '€29,040 over two years' },
  { label: 'Applicant + spouse', eur: '€1,820 / €1,640 / €1,550', total: '€43,680 over two years' },
  { label: '+ first child', eur: '+€610 / €550 / €520', total: '€58,320 over two years' },
  { label: '+ second child', eur: '+€480 / €430 / €410', total: '€69,840 over two years' },
  { label: '+ each further child', eur: '+€360 / €320 / €310', total: 'added on top' },
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
  { title: 'Your own permit', content: 'Tied to your startup — entrepreneurship in that company must remain your main occupation. This is checked again at extension.', positive: false },
  { title: 'Spouse work rights', content: 'An open work right: full-time, any job, any sector, no restrictions. In many families this is what funds year one.', positive: true },
  { title: 'Fast Track', content: 'Migri targets a decision in about two weeks once the online application is complete and identification is done.', positive: true },
  { title: 'Schengen travel', content: 'Visa-free travel across the Schengen area for up to 90 days in any 180-day period.', positive: true },
  { title: 'Healthcare', content: 'Access to Finland\'s public health system once your residence is registered — low, capped client fees rather than free.', positive: true },
  { title: 'Education', content: 'Free, world-leading public education for your children, including Finnish-language support at school.', positive: true },
  { title: 'You must actually move', content: 'Around 22% of first-permit holders had their permit cancelled in post-issuance supervision for never entering Finland or never starting the business.', positive: false },
  { title: 'Social benefits', content: 'Kela benefits depend on residence-based eligibility, not on arrival. Claiming them straight after arrival contradicts your means-of-support evidence at extension.', positive: false },
];

const sectors = [
  { icon: Gamepad2, name: 'Gaming', desc: 'Home to Supercell, Rovio, Remedy. A massive ecosystem for game devs.' },
  { icon: Wifi, name: 'Connectivity & 6G', desc: 'Nokia\'s heritage lives on. Deep tech in telecom and quantum computing.' },
  { icon: Snowflake, name: 'Clean Energy', desc: 'Smart grids, bio-economy, battery technology, and sustainable materials.' },
  { icon: Activity, name: 'Health Tech', desc: 'Digital health records, genomics, and personalized medicine.' },
  { icon: Rocket, name: 'Deep Tech & AI', desc: 'Strong academic-industry collaboration in AI and machine learning.' },
  { icon: Globe, name: 'EduTech', desc: 'Leveraging Finland\'s reputation as a global leader in education.' },
];

// Permanent residence, for applications filed on or after 8 January 2026.
const prRoutes = [
  {
    n: '01',
    title: 'Long residence',
    icon: Home,
    reqs: ['6 years continuous on an A permit', '2 years of work in Finland', 'Finnish or Swedish at B1'],
    note: 'Applicants aged 65+ are exempt from the language requirement.',
  },
  {
    n: '02',
    title: 'High income',
    icon: Banknote,
    reqs: ['4 years continuous on an A permit', 'At least €40,000 taxable income in the most recently completed tax assessment'],
    note: 'No language requirement and no work-history requirement.',
  },
  {
    n: '03',
    title: 'Finnish degree',
    icon: GraduationCap,
    reqs: ['Master\'s, licentiate or doctoral degree from a Finnish university, or a university bachelor\'s (not a university of applied sciences)', 'Language at A2, or 15 credits of Finnish/Swedish studies at a higher education institution'],
    note: 'No minimum residence period and no work-history requirement — the fastest route on the board.',
  },
  {
    n: '04',
    title: 'Foreign advanced degree',
    icon: Award,
    reqs: ['4 years continuous on an A permit', 'Master\'s, licentiate or doctoral degree recognised in Finland', '2 years of work in Finland'],
    note: 'The realistic route for a founder arriving with an Iranian master\'s or PhD. The work-history condition is not waivable.',
  },
  {
    n: '05',
    title: 'Superior language skills',
    icon: Languages,
    reqs: ['4 years continuous on an A permit', '3 years of work in Finland', 'Finnish or Swedish at C1'],
    note: 'For people who go all-in on the language early.',
  },
];

const faqs = [
  {
    q: 'Is there a minimum capital investment required?',
    a: 'No. Finland sets no statutory minimum investment for the startup, unlike Austria (€30,000), France (€30,000) or Italy (€50,000). You must show the company has access to enough funding for its early stage and budget your first year — and, separately, prove your own personal means of support to Migri.',
  },
  {
    q: 'Can I apply as a solo founder?',
    a: 'In practice, no. Business Finland expects at least two founders who together hold more than 60% of the company, both working full-time on it with no side employment, with complementary skills. Solo applications are the most common reason Iranian founders are refused. If you are alone, look at Denmark or Estonia instead.',
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
    a: 'For applications filed on or after 1 October 2024 the general residence period is eight years, reduced to five years if you meet the Finnish or Swedish language requirement. Residence time alone is not enough: you must also establish your identity, have a clean record, have met your payment obligations and — since 17 December 2025 — have sufficient financial resources. A citizenship test is being added from 1 January 2027.',
  },
  {
    q: 'Do I have to live in Finland, or can I travel freely?',
    a: 'You can travel and visit home whenever you like — but the permit is granted on the basis that you actually relocate and run the startup from Finland. In post-issuance supervision, about 22% of first-permit holders had their permit cancelled for never entering the country or never starting the business. Long absences also affect how your residence period is counted for permanent residence and citizenship.',
  },
  {
    q: 'What is changing in 2026?',
    a: 'The government has announced that the start-up entrepreneur permit will be reformed because the current system "is not effective in attracting start-up entrepreneurs to Finland". Legislative drafting began in early 2026. The separate free Business Finland statement is to be folded into the Migri application, the evaluation becomes chargeable, Migri will pre-screen general conditions and add hearings or interviews, and a Finnish business ID will no longer be required for a first permit if operations have not started.',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function FinlandPage() {
  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a] overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════
          HERO — FULL-BLEED
      ═══════════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[700px] flex flex-col justify-end overflow-hidden">
        {/* Background Image — Finland Aurora or Snow */}
        <Image
          src="https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=1800&q=85&auto=format&fit=crop"
          alt="Finland Winter Landscape"
          fill
          priority
          unoptimized={true}
          className="object-cover object-center"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#002F6C] via-[#002F6C]/60 to-[#002F6C]/20" />

        {/* Finnish cross accent — top right */}
        <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none opacity-20">
          <div className="absolute top-0 left-[38%] w-[24%] h-full bg-white" />
          <div className="absolute top-[38%] left-0 w-full h-[24%] bg-white" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 pb-20">
          <div className="flex items-center gap-3 mb-8">
            {/* Mini Finnish flag */}
            <div className="relative w-8 h-6 border border-white/20 bg-white overflow-hidden">
              <div className="absolute top-0 left-[30%] w-[20%] h-full bg-[#002F6C]" />
              <div className="absolute top-[40%] left-0 w-full h-[25%] bg-[#002F6C]" />
            </div>
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              Startup Finland · Fast Track Permit
            </span>
          </div>

          <h1 className="font-serif text-white mb-6" style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85, letterSpacing: '-0.03em' }}>
            FINLAND<br />
            <span className="italic text-[#00BFA5]">STARTUP.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mt-12">
            <p className="font-serif text-white/90 text-2xl md:text-3xl leading-snug">
              Silence and Speed.{' '}
              <span className="text-white font-bold">A two-week decision — if you get through the gate.</span>
            </p>
            <div className="space-y-6">
              <p className="font-sans text-white/80 text-sm leading-relaxed border-l-2 border-[#00BFA5] pl-5">
                The world&apos;s happiest country runs one of the fastest founder permits in Europe: no minimum investment,
                a decision in roughly two weeks on the Fast Track, family included, spouse free to work.
                The catch is the gate — in 2024 and 2025 about 92% of applications to Business Finland were refused.
                This page covers both halves of that sentence.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#00BFA5] text-[#002F6C] px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#002F6C] transition-all duration-300"
                >
                  Assess My Startup <ArrowRight size={14} />
                </Link>
                <a
                  href="#process"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  How It Works <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#F2F0E9] z-10" />
      </section>

      {/* ═══════════════════════════════════════════════════════
          REFORM NOTICE
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#00BFA5]/10 border-y border-[#00BFA5]/40">
        <div className="container mx-auto px-6 py-8">
          <div className="flex gap-5 items-start max-w-4xl">
            <AlertTriangle className="w-5 h-5 text-[#002F6C] shrink-0 mt-1" />
            <div>
              <p className="font-sans text-sm font-bold uppercase tracking-widest text-[#002F6C] mb-2">
                The rules are moving — two changes for 2026
              </p>
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed">
                The Finnish government has announced a reform of the start-up entrepreneur permit: the separate, free
                Business Finland statement becomes part of the Migri application, the evaluation becomes chargeable, and
                interviews are added. Legislative drafting began in early 2026. Separately, the permanent residence rules
                were rewritten for applications filed on or after 8 January 2026 and now run on five distinct routes.
                Both are explained below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          KEY STATS — DARK BAND
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#002F6C] text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { stat: '~2 Weeks', label: 'Fast Track', sub: 'from a complete application' },
              { stat: '~8%', label: 'Approval Rate', sub: 'Business Finland, 2024–2025' },
              { stat: '2+', label: 'Founders Required', sub: 'holding over 60% between them' },
              { stat: '€0', label: 'Minimum Investment', sub: 'no statutory capital threshold' },
            ].map((s, i) => (
              <div key={i} className="py-10 px-8 hover:bg-white/5 transition-colors text-center">
                <p className="font-serif text-5xl text-[#00BFA5] mb-2">{s.stat}</p>
                <p className="font-sans text-sm font-bold text-white mb-1">{s.label}</p>
                <p className="font-sans text-xs text-white/40">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ABOUT SECTION — SPLIT IMAGE / TEXT
      ═══════════════════════════════════════════════════════ */}
      <section className="py-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Image — Helsinki architecture */}
          <div className="relative h-80 lg:h-auto order-2 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1521319696238-d9d15c195f2a?w=900&q=80&auto=format&fit=crop&crop=left"
              alt="Helsinki Cathedral and cityscape"
              fill
              unoptimized={true}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F2F0E9] hidden lg:block" />
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-20 bg-[#F2F0E9]">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#002F6C] mb-6">
              How the permit works
            </span>
            <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-8" style={{ letterSpacing: '-0.02em' }}>
              Two bodies.<br />
              <span className="italic text-[#00BFA5]">One judgement.</span>
            </h2>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed mb-6">
              The <strong>Start-up Entrepreneur Residence Permit</strong> splits the decision cleanly in two.
              <strong> Business Finland</strong> evaluates the business and issues an Eligibility Statement — Migri does not
              second-guess your idea and has delegated that judgement entirely.
              <strong> Migri</strong> then checks the general immigration conditions and your personal means of support, and issues the permit.
            </p>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed">
              If you know the Canadian Startup Visa, the shape is familiar: an expert verdict on the company, then a
              relatively mechanical immigration file. The difference is that in Finland one state agency makes that call,
              it is free today, there is no annual quota, and the answer usually arrives in weeks — not a scattered market
              of private incubators with fees and caps. Business Finland applies broadly the same criteria it uses for
              its Tempo grant: innovation, international demand and team capability, not near-term profit.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          YOUTUBE VIDEO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white border-y border-[#1a1a1a]/10">
        <div className="container mx-auto max-w-5xl text-center">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#002F6C] block mb-4">
            Ultimate Step-by-Step Guide
          </span>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-12 text-[#1a1a1a]" style={{ letterSpacing: '-0.02em' }}>
            Watch the Comprehensive<br />
            <span className="italic text-[#00BFA5]">Masterclass</span>
          </h2>
          <div className="relative w-full overflow-hidden shadow-2xl shadow-[#002F6C]/10 border border-[#1a1a1a]/10" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full border-0"
              src="https://www.youtube.com/embed/UyEsOpfswjk"
              title="The Finland Startup Visa in 2026: from idea approval to permanent residence"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          REALITY CHECK
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#001B3D] text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
            <div className="lg:col-span-5">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#00BFA5] block mb-4">
                Before you get excited
              </span>
              <h2 className="font-serif text-5xl md:text-6xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                92% are<br />
                <span className="italic text-white/30">refused.</span>
              </h2>
            </div>
            <div className="lg:col-span-7 flex flex-col justify-end">
              <p className="font-sans text-white/60 text-base leading-relaxed">
                These figures come from the Finnish Ministry of Economic Affairs and Employment working-group report
                (TEM 2025:36). No agency likes showing them, which is exactly why you should see them before you spend
                a year and a lot of money on this route.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { stat: '107 → 1,068', label: 'Applications per year', sub: 'Business Finland evaluations, 2018 to 2024 — roughly tenfold growth.' },
              { stat: '~92%', label: 'Refused in 2024–2025', sub: 'Around one in twelve files gets a positive statement.' },
              { stat: '42%', label: 'Are repeat applications', sub: 'At least one team member had already been rejected. One person applied twelve times.' },
              { stat: '~22%', label: 'Permits later cancelled', sub: 'First-permit holders who never entered Finland or never started the business.' },
            ].map((s, i) => (
              <div key={i} className="p-7 border border-white/10 hover:border-[#00BFA5] hover:bg-white/5 transition-all duration-300">
                <p className="font-serif text-4xl text-[#00BFA5] mb-3">{s.stat}</p>
                <p className="font-sans text-sm font-bold text-white mb-2">{s.label}</p>
                <p className="font-sans text-xs text-white/50 leading-relaxed">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-start gap-3 bg-[#00BFA5]/10 border border-[#00BFA5]/40 p-6 max-w-4xl">
            <ShieldAlert className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
            <p className="font-sans text-xs text-[#00BFA5] leading-relaxed">
              <strong>What this means for you.</strong> A weak file burns time and credibility, because refusals are on
              record and visible on your next attempt. Business Finland assessors also report a rising volume of
              AI-written business plans and agency-built packages — fake websites, invented LinkedIn profiles, off-the-shelf
              plans. Iranian and Russian applicants are among the largest groups, so those files get read closely. For a
              genuine team that is not bad news; it just means your case has to be visibly your own.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STEP-BY-STEP PROCESS
      ═══════════════════════════════════════════════════════ */}
      <section id="process" className="py-28 px-6 bg-[#F2F0E9]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
            <div className="lg:col-span-5">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#002F6C] block mb-4">
                Step-by-Step Guide
              </span>
              <h2 className="font-serif text-5xl md:text-6xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                The 5-Step<br />
                <span className="italic text-[#1a1a1a]/30">Process</span>
              </h2>
            </div>
            <div className="lg:col-span-7 flex flex-col justify-end">
              <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed">
                From securing Business Finland&apos;s statement to the Fast Track lane at Migri (the Finnish Immigration Service),
                and on to registering your residence and your company.
              </p>
              <div className="mt-8 flex items-start gap-3 bg-white border border-[#1a1a1a]/10 p-5">
                <Clock className="w-4 h-4 text-[#002F6C] shrink-0 mt-0.5" />
                <p className="font-sans text-xs text-[#1a1a1a]/60 leading-relaxed">
                  <strong>Realistic timeline:</strong> preparing a genuinely competitive Business Finland package is the
                  long pole — usually months, not weeks. The permit stage that follows is the fast one.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-0">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="group grid grid-cols-1 lg:grid-cols-12 border-t border-[#1a1a1a]/10 hover:bg-white transition-colors py-10 gap-8"
                >
                  <div className="lg:col-span-1">
                    <span className="font-serif text-5xl text-[#00BFA5]/40 group-hover:text-[#00BFA5] transition-colors select-none">
                      {step.num}
                    </span>
                  </div>
                  <div className="lg:col-span-3 flex items-start gap-4">
                    <Icon className="w-5 h-5 text-[#002F6C] shrink-0 mt-1" />
                    <h3 className="font-serif text-2xl">{step.title}</h3>
                  </div>
                  <div className="lg:col-span-8 space-y-3">
                    <p className="font-sans text-[#1a1a1a]/60 text-sm leading-relaxed">{step.body}</p>
                    <p className="font-sans text-xs text-[#002F6C] border-l border-[#00BFA5] pl-3">
                      {step.note}
                    </p>
                  </div>
                </div>
              );
            })}
            <div className="border-t border-[#1a1a1a]/10" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          AURORA IMAGE BREAK
      ═══════════════════════════════════════════════════════ */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=1600&q=80&auto=format&fit=crop"
          alt="Northern Lights over Finland"
          fill
          unoptimized={true}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001B3D]/90 to-[#001B3D]/30" />
        <div className="relative z-10 h-full flex items-center px-6">
          <div className="container mx-auto">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#00BFA5] mb-3">
              Lifestyle & Innovation
            </p>
            <p className="font-serif text-white text-4xl md:text-6xl leading-tight max-w-2xl" style={{ letterSpacing: '-0.02em' }}>
              #1 Happiest Country.<br />
              <span className="italic text-white/60">Nine years running.</span>
            </p>
            <p className="font-sans text-white/50 text-xs mt-4 max-w-md">
              World Happiness Report 2026 — Finland has topped the ranking every year since 2018.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SCORING CRITERIA / BUSINESS FINLAND
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F2F0E9]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-16">
            <div className="lg:col-span-4">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#002F6C] block mb-4">
                The Gatekeeper
              </span>
              <h2 className="font-serif text-5xl leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
                Business Finland Requirements
              </h2>
              <div className="w-10 h-0.5 bg-[#00BFA5] mb-8" />
              <p className="font-sans text-[#1a1a1a]/60 text-sm leading-relaxed mb-6">
                Before applying for the residence permit you must secure a positive Eligibility Statement.
                The evaluation is made on the written file — Business Finland does not normally interview applicants,
                though it can put further questions in writing, and the coming reform adds hearings.
              </p>
              <p className="font-sans text-[#1a1a1a]/60 text-sm leading-relaxed">
                Alongside the four criteria, you must document real progress: demos, prototypes, first customer
                conversations, pilots or letters of intent, plus any registered IP.
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              {scoringCriteria.map((c, i) => {
                const Icon = c.icon;
                return (
                  <div
                    key={i}
                    className="group p-8 bg-white border border-[#1a1a1a]/8 hover:border-[#00BFA5] hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <Icon className="w-8 h-8 text-[#002F6C] group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-serif text-xl text-[#00BFA5]/60">{c.score}</span>
                    </div>
                    <h3 className="font-serif text-2xl mb-3">{c.title}</h3>
                    <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed">{c.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#002F6C]/5 border border-[#002F6C]/20 p-6 max-w-4xl">
            <Clock className="w-4 h-4 text-[#002F6C] shrink-0 mt-0.5" />
            <p className="font-sans text-xs text-[#1a1a1a]/70 leading-relaxed">
              <strong>Four-month clock.</strong> A positive Eligibility Statement is valid for four months from issue.
              Your Migri application has to be filed inside that window, or you start again with Business Finland.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINANCIAL REQUIREMENTS — SPLIT WITH AERIAL IMAGE
      ═══════════════════════════════════════════════════════ */}
      <section className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Aerial image of Helsinki */}
          <div className="relative h-72 lg:h-auto order-2 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1549646690-cb64ecfdf4e4?w=900&q=80&auto=format&fit=crop&crop=right"
              alt="Helsinki Coastline"
              fill
              unoptimized={true}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001B3D] via-transparent to-transparent lg:bg-gradient-to-l lg:from-[#001B3D] lg:via-transparent" />
          </div>

          {/* Financials */}
          <div className="order-1 lg:order-2 bg-[#001B3D] text-white px-10 md:px-16 py-20">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#00BFA5] block mb-4">
              2026 Requirements
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mb-4 leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Proof of Funds
            </h2>
            <p className="font-sans text-white/60 text-sm leading-relaxed mb-4">
              You must show sufficient personal means to live in Finland for the whole permit period. This is not an
              investment — the money stays in your own account and pays for your own life. The business itself has no
              statutory minimum capital.
            </p>
            <p className="font-sans text-white/40 text-xs leading-relaxed mb-10">
              Net figures per month, in three regional groups: capital region (Helsinki, Espoo, Vantaa, Kauniainen) /
              other large municipalities / everywhere else. Two-year totals shown at the capital-region rate.
            </p>

            <div className="space-y-0 border-t border-white/10">
              {financials.map((f, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center gap-6 py-5 border-b border-white/10 hover:bg-white/5 transition-colors px-2"
                >
                  <span className="font-sans text-sm text-white/80">{f.label}</span>
                  <div className="text-right shrink-0">
                    <p className="font-serif text-lg text-[#00BFA5]">{f.eur}</p>
                    <p className="font-sans text-xs text-white/50">{f.total}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-start gap-3 bg-white/5 border border-white/15 p-5">
              <AlertTriangle className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
              <p className="font-sans text-xs text-white/70 leading-relaxed">
                <strong className="text-white">A two-year permit needs two years of funds.</strong> If your resources
                only cover one year, Migri can issue a one-year permit instead. And do not treat the balance as a
                photograph: withdrawing the money afterwards is a known abuse pattern named in the government working
                group&apos;s own report, and the funds are expected to remain available for the permit period.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          GOVERNMENT FEES
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white border-y border-[#1a1a1a]/8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-12">
            <div className="lg:col-span-5">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#002F6C] block mb-4">
                What it costs
              </span>
              <h2 className="font-serif text-5xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                Government<br />
                <span className="italic text-[#00BFA5]">fees, 2026</span>
              </h2>
            </div>
            <div className="lg:col-span-7 flex flex-col justify-end">
              <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed">
                Separate from proof of funds and from any advisory fee. Migri revises its tariff each January and the
                amount you pay is the one in force on the day you file. On top of these, budget for VFS service charges
                at identification, certified translation, and legalisation of documents.
              </p>
            </div>
          </div>

          <div className="border-t border-[#1a1a1a]/10">
            <div className="hidden md:grid grid-cols-12 gap-4 py-4 border-b border-[#1a1a1a]/10">
              <span className="col-span-5 font-sans text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/40">Application</span>
              <span className="col-span-2 font-sans text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/40">Online</span>
              <span className="col-span-2 font-sans text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/40">Paper</span>
              <span className="col-span-3 font-sans text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/40">Note</span>
            </div>
            {fees.map((f, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 py-5 border-b border-[#1a1a1a]/10 items-baseline hover:bg-[#F2F0E9] transition-colors">
                <span className="md:col-span-5 font-sans text-sm text-[#1a1a1a]">{f.label}</span>
                <span className="md:col-span-2 font-serif text-xl text-[#00BFA5]">{f.online}</span>
                <span className="md:col-span-2 font-serif text-lg text-[#1a1a1a]/50">{f.paper}</span>
                <span className="md:col-span-3 font-sans text-xs text-[#1a1a1a]/50">{f.note}</span>
              </div>
            ))}
          </div>

          <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed mt-8 max-w-3xl">
            <strong>Rule of thumb.</strong> A family of four filing online — founder, spouse, two children, all with
            D visas — pays roughly €2,500–€2,600 in Migri fees alone, before translation, legalisation and VFS charges.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          RIGHTS & RESTRICTIONS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F2F0E9]">
        <div className="container mx-auto">
          <div className="mb-16">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#002F6C] block mb-4">
              Your 2-Year Permit
            </span>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <h2 className="font-serif text-5xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                Rights &<br /> Restrictions
              </h2>
              <p className="font-sans text-[#1a1a1a]/60 text-sm leading-relaxed self-end">
                The start-up permit is an A permit, so the years count towards permanent residence and citizenship.
                It is also conditional: at extension, Migri looks for a registered Finnish company, a product that has
                genuinely been developed, a founder whose main occupation is still this startup, and real residence in Finland.
                Extension approval rates run at roughly 80–90% — far higher than the first permit.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {rights.map((r, i) => (
              <div
                key={i}
                className={`p-7 border transition-all hover:shadow-md group ${
                  r.positive
                    ? 'bg-white border-[#1a1a1a]/8 hover:border-[#00BFA5]'
                    : 'bg-[#002F6C]/5 border-[#002F6C]/20 hover:border-[#002F6C]/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {r.positive ? (
                    <CheckCircle className="w-5 h-5 text-[#00BFA5] shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-[#002F6C] shrink-0" />
                  )}
                  <h3 className="font-sans text-xs font-bold uppercase tracking-widest">
                    {r.title}
                  </h3>
                </div>
                <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed">{r.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FAMILY — FULL BLEED + TEXT
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Content */}
          <div className="bg-[#002F6C] text-white px-10 md:px-16 py-24">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#00BFA5] block mb-4">
              Bringing Your Family
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Your Family Gets<br />
              <span className="italic">More Freedom</span><br />
              Than You Do.
            </h2>
            <p className="font-sans text-white/70 text-sm leading-relaxed mb-10">
              Your spouse and children apply alongside you and use the same Fast Track. Crucially, your spouse receives an{' '}
              <strong className="text-white">open work right</strong> — full-time, any job, no restrictions — while your own
              permit stays tied to the startup. In many families the spouse&apos;s salary is what funds year one.
            </p>

            <div className="space-y-6">
              {[
                { icon: Users, title: 'Who qualifies', body: 'Spouse or registered partner, plus unmarried children under 18. Each files their own application; each adds to the means-of-support figure.' },
                { icon: Briefcase, title: 'Open work right for the spouse', body: 'Full-time, any sector, no restrictions — unlike the founder\'s permit, which is tied to the company.' },
                { icon: GraduationCap, title: 'School and healthcare', body: 'Free public education from pre-primary to university, with Finnish-language support at school for migrant pupils, plus access to public healthcare once residence is registered.' },
                { icon: Award, title: 'Child benefit', body: 'Paid monthly until the child turns 17 — subject to Kela residence-based eligibility, not automatic on arrival.' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex gap-5 items-start border-t border-white/10 pt-5">
                    <Icon className="w-5 h-5 text-[#00BFA5] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-sans text-sm font-bold text-white mb-1">{item.title}</p>
                      <p className="font-sans text-sm text-white/60">{item.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image — Finnish forest/family */}
          <div className="relative h-80 lg:h-auto">
            <Image
              src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=900&q=80&auto=format&fit=crop"
              alt="Scandinavian lifestyle"
              fill
              unoptimized={true}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PRIORITY SECTORS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#001B3D] text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
            <div className="lg:col-span-5">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#00BFA5] block mb-4">
                Where Finland Excels
              </span>
              <h2 className="font-serif text-5xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                Priority<br />
                <span className="italic text-white/40">Sectors</span>
              </h2>
            </div>
            <div className="lg:col-span-7 flex flex-col justify-end">
              <p className="font-sans text-white/60 text-base leading-relaxed">
                Finland has the highest venture capital investment per capita in Europe and a deep-tech heritage rooted in
                Nokia, concentrated around Helsinki and the Slush ecosystem. Aligning your startup with these sectors
                strengthens the international-demand argument Business Finland is looking for.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sectors.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="group p-7 border border-white/10 hover:border-[#00BFA5] hover:bg-white/5 transition-all duration-300"
                >
                  <Icon className="w-7 h-7 text-[#00BFA5] mb-5 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-serif text-xl mb-2 text-white">{s.name}</h3>
                  <p className="font-sans text-xs text-white/50">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PERMANENT RESIDENCE — FIVE ROUTES
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F2F0E9]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
            <div className="lg:col-span-5">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#002F6C] block mb-4">
                Long-Term Vision
              </span>
              <h2 className="font-serif text-5xl md:text-6xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                Five routes to<br />
                <span className="italic text-[#00BFA5]">permanent residence</span>
              </h2>
            </div>
            <div className="lg:col-span-7 flex flex-col justify-end">
              <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed">
                The permanent residence rules were rewritten for applications filed on or after 8 January 2026. There are now
                five distinct routes; every one of them requires that you still meet the conditions for a continuous (A) residence permit.
                Years spent on the start-up permit count towards all of them.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prRoutes.map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} className="p-8 bg-white border border-[#1a1a1a]/8 hover:border-[#00BFA5] hover:shadow-lg transition-all duration-300 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <Icon className="w-7 h-7 text-[#002F6C]" />
                    <span className="font-serif text-2xl text-[#00BFA5]/40">{r.n}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-5">{r.title}</h3>
                  <ul className="space-y-2 mb-6 flex-1">
                    {r.reqs.map((req, j) => (
                      <li key={j} className="flex gap-3 items-start">
                        <CheckCircle className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
                        <span className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-sans text-xs text-[#1a1a1a]/50 border-t border-[#1a1a1a]/10 pt-4 leading-relaxed">{r.note}</p>
                </div>
              );
            })}

            {/* Citizenship card */}
            <div className="p-8 bg-[#002F6C] text-white flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <Globe className="w-7 h-7 text-[#00BFA5]" />
                <span className="font-serif text-2xl text-white/25">Next</span>
              </div>
              <h3 className="font-serif text-2xl mb-5">Finnish citizenship</h3>
              <p className="font-sans text-sm text-white/70 leading-relaxed mb-5">
                For applications filed on or after 1 October 2024 the general residence period is <strong className="text-white">8 years</strong>,
                reduced to <strong className="text-white">5 years</strong> if you meet the Finnish or Swedish language requirement.
              </p>
              <ul className="space-y-2 mb-6 flex-1">
                {['Established identity', 'Clean record and met payment obligations', 'Sufficient financial resources (since 17 Dec 2025)', 'Proven language skills, e.g. the YKI test'].map((c, j) => (
                  <li key={j} className="flex gap-3 items-start">
                    <CheckCircle className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
                    <span className="font-sans text-sm text-white/70 leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
              <p className="font-sans text-xs text-[#00BFA5] border-t border-white/15 pt-4 leading-relaxed">
                A citizenship test is being added from 1 January 2027. Language, not money, is the bottleneck on this path.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white border-t border-[#1a1a1a]/8">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-16">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#002F6C] block mb-4">
              Common Questions
            </span>
            <h2 className="font-serif text-5xl" style={{ letterSpacing: '-0.02em' }}>FAQ</h2>
          </div>

          <div className="border-t border-[#1a1a1a]/10">
            {faqs.map((faq, i) => (
              <details key={i} className="group border-b border-[#1a1a1a]/10">
                <summary className="flex justify-between items-center py-6 cursor-pointer list-none hover:text-[#00BFA5] transition-colors group-open:text-[#00BFA5]">
                  <span className="font-serif text-xl pr-8 leading-snug">{faq.q}</span>
                  <ChevronRight className="w-5 h-5 shrink-0 group-open:rotate-90 transition-transform text-current" />
                </summary>
                <div className="pb-6 pt-1">
                  <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          DISCLAIMER
      ═══════════════════════════════════════════════════════ */}
      <section className="py-8 px-6 bg-[#F9F9F9] border-t border-[#1a1a1a]/8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex gap-4 items-start">
            <ShieldAlert className="shrink-0 w-4 h-4 text-[#1a1a1a]/30 mt-0.5" />
            <p className="font-sans text-[11px] text-[#1a1a1a]/45 leading-relaxed">
              <strong>Regulatory Notice:</strong> Figures on this page were verified on 8 September 2026 against official
              Business Finland and Migri documentation, the Finnish Government&apos;s announcement on reforming start-up
              entrepreneur permits, and the Ministry of Economic Affairs and Employment working-group report TEM 2025:36.
              They are provided for informational purposes only. Visa Roads Inc. is a strategic business advisory firm — we
              are <span className="underline">NOT</span> an immigration law firm or recruitment agency. A positive
              Eligibility Statement does not guarantee a residence permit. Income thresholds and processing fees are revised
              every January and the law itself is under reform — always verify current figures at{' '}
              <a href="https://migri.fi" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#00BFA5] transition-colors">migri.fi</a>.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
