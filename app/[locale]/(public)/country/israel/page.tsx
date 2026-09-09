// ============================================================================
// Page: app/[locale]/(public)/country/israel/page.tsx
// Style: Editorial, matching /country/denmark — full-bleed hero, dark stat
// band, alternating light/dark sections, FAQ, closing CTA.
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
//
// 3. Nationals of states Israel designates as enemy states — Iran among them
//    — cannot use this route, and the page says so in its own section rather
//    than in a footnote. The Persian twin at /fa/israel leads with it, because
//    that site's whole readership is affected.
//
// The defence-linked innovation programmes (INNOFENSE with DDR&D/MAFAT,
// INNOTAL, MEIMAD, the cyber tracks) get exactly one neutral sentence in the
// ecosystem section. They are publicly announced government programmes; they
// are not this page's subject and the Persian twin omits them entirely.
//
// Verified 2026-09-09 against the Israel Innovation Authority's Innovation
// Visa and Ideation (Tnufa) programme pages, the 2024 re-approval of the
// procedure with PIBA, the 2017 landing-pad announcement, and Israeli entry
// law for nationals of designated enemy states.
// ============================================================================

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ChevronRight,
  Users,
  Lightbulb,
  ShieldAlert,
  FileText,
  Globe,
  Building,
  Banknote,
  Beaker,
  Rocket,
  CircleDollarSign,
} from 'lucide-react';
import type { Metadata } from 'next';
import { metaFor } from '@/lib/pageMeta';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/country/israel', locale);
}

// ─── Data ────────────────────────────────────────────────────────────────────

const steps = [
  {
    num: '01',
    title: 'Win a Landing Pad',
    icon: Building,
    body: 'Pitch your project to an approved supporting framework — an incubator or accelerator the programme calls a "landing pad". It must issue a formal letter confirming it will host and support you for the duration of your stay in Israel.',
    note: 'Without that letter nothing downstream starts. This is the real gate, not the immigration desk.',
  },
  {
    num: '02',
    title: 'Apply to the Innovation Authority',
    icon: FileText,
    body: 'File with the Israel Innovation Authority: business plan, CV, the landing pad letter, and a declaration of the financial means to cover your living costs for the whole stay. A professional evaluator assesses the project and a committee decides.',
    note: 'You must have at least two years of experience in the field of the idea you are proposing.',
  },
  {
    num: '03',
    title: 'Recommendation, Not a Visa',
    icon: ShieldAlert,
    body: 'Approval produces a formal recommendation letter to the Population and Immigration Authority (PIBA). The Innovation Authority does not issue visas and never has — it recommends. PIBA decides.',
    note: 'Read every offer that claims otherwise as a warning sign.',
  },
  {
    num: '04',
    title: 'PIBA Issues the B/2',
    icon: Globe,
    body: 'Apply at an Israeli consulate abroad, or — if you are visa-exempt on entry — inside Israel within 30 days of arrival. PIBA issues the B/2 Innovation visa for a period of up to two years.',
    note: 'Spouse and children under 18 do not get innovation visas: they apply separately for B/2 tourist visas, extendable to match your stay.',
  },
  {
    num: '05',
    title: 'Build, Then Convert',
    icon: Rocket,
    body: 'All R&D must happen inside Israel. If the project matures into a product or a stable company, apply for the B/1 expert work visa at least three months before your current visa expires — recognised as an Expert by that company, as employee or shareholder.',
    note: 'B/1 is where a work permit finally appears. B/2 never was one.',
  },
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

const criteria = [
  {
    title: 'Not Israeli',
    icon: Globe,
    desc: 'The applicant must be neither a citizen nor a resident of Israel.',
  },
  {
    title: 'Two Years In The Field',
    icon: Users,
    desc: 'Documented experience relevant to the idea you are proposing, and the capacity to carry it forward.',
  },
  {
    title: 'Real Technological Novelty',
    icon: Lightbulb,
    desc: 'A high level of technological innovation, a workable feasibility plan, and a project that genuinely needs professional and logistical support to become a product.',
  },
  {
    title: 'Commercial Reach',
    icon: Beaker,
    desc: 'Significant commercial potential, global markets in particular, on a path that ends in an industrial company established in Israel.',
  },
];

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

const faqs = [
  {
    q: 'Is the Innovation Visa a work permit?',
    a: 'No, and this is the single most common misunderstanding. B/2 is a residence and visit permit. The holder may not enter an employer–employee relationship with an Israeli company or draw a salary from one, and must work on the approved project only. The work permit arrives later, if at all, as the B/1 expert visa.',
  },
  {
    q: 'How long does it last?',
    a: 'Up to two years. It is meant to be the window in which a technological idea becomes a product or a company — not a settlement route in itself.',
  },
  {
    q: 'Who actually decides?',
    a: 'Three bodies in sequence. A landing pad must accept you and put that in writing. The Israel Innovation Authority then evaluates the project and, if it approves, issues a recommendation. The Population and Immigration Authority issues — or refuses — the visa. Only the third of those is an immigration decision, and only the first is something you can work on directly.',
  },
  {
    q: 'Is the list of twelve landing pads current?',
    a: 'We could not confirm that it is. The list circulating everywhere — Tel Aviv Global, Samurai Incubate, TechForGood, Trendlines, MATI Haifa, Hebrew University, Lighthouse, TheHive by Gvahim, Alon MedTech, Terralab, Kitchen Hub, Initech — comes from the 2017 pilot announcement, and no newer official source we found restates it. Treat it as a starting point for your own enquiry with the Innovation Authority, not as today\'s roster.',
  },
  {
    q: 'How much money do I need to show?',
    a: 'There is no published minimum. The requirement is a declaration demonstrating the financial resources to cover your living costs throughout your stay. Estimates circulate — commonly $15,000 to $50,000 a year — but they are practitioners\' figures, not a rule, and we do not repeat them as one. Israel is an expensive country and the declaration is assessed against real costs.',
  },
  {
    q: 'Does the landing pad pay me anything?',
    a: 'No. It provides workspace, technological infrastructure, administrative, business and logistical support, mentorship, and access to the local ecosystem and investors. It does not fund your living costs, and acceptance carries no commitment to pay you anything at all.',
  },
  {
    q: 'Can Tnufa money pay my salary?',
    a: 'No. Salaries and overheads are explicitly excluded. Tnufa is money to build the thing, not money to live on — budget accordingly, or you discover the gap in month three.',
  },
  {
    q: 'Can my family come with me?',
    a: 'A spouse and children under 18, yes — but not on innovation visas. They apply through the ordinary route for B/2 tourist visas, which can be extended to run alongside your permit for its full duration.',
  },
  {
    q: 'What happens at the end of two years?',
    a: 'If the project has become a product or a stable company, you may apply for the B/1 expert work visa: you must be recognised as an Expert by that company, as an employee or as a shareholder continuing to develop it. File at least three months before your current visa expires. PIBA decides, on a recommendation from the Chief Scientist\'s office. B/1 carries a work permit, which B/2 never did.',
  },
  {
    q: 'Can nationals of any country apply?',
    a: 'No. Israel designates certain states as enemy states — Iran, Lebanon, Syria and Iraq among them — and its law bars the Interior Minister from granting entry or residence permits to their citizens, outside a narrow humanitarian exception with a very small quota that has nothing to do with entrepreneurship. Holding a second nationality does not automatically remove the restriction, which attaches to citizenship rather than to the passport you travel on. If this describes you, take the question to an Israeli immigration lawyer and treat any adviser who answers it confidently without seeing your file as a warning sign.',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function IsraelPage() {
  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a] overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[700px] flex flex-col justify-end overflow-hidden">
        <Image
          src="/fa/img/israel.webp"
          alt="The Tel Aviv coastline on a stormy day, the city's office towers standing behind the beach"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/60 to-transparent" />

        <div className="relative z-10 container mx-auto px-6 pb-20">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/60 block mb-8">
            Israel Innovation Visa · B/2 Innovation
          </span>

          <h1
            className="font-serif text-white mb-6"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85, letterSpacing: '-0.03em' }}
          >
            ISRAEL<br />
            <span className="italic text-[#0038B8]">INNOVATION.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mt-12">
            <p className="font-serif text-white/80 text-2xl md:text-3xl leading-snug">
              Two years to turn an idea into a company.{' '}
              <span className="text-white font-bold">And it is not a work permit.</span>
            </p>
            <div className="space-y-6">
              <p className="font-sans text-white/60 text-sm leading-relaxed border-l-2 border-[#0038B8] pl-5">
                The gate is not an immigration officer. It is an incubator: an approved
                &ldquo;landing pad&rdquo; must accept you and say so in writing before the Israel
                Innovation Authority will even look at your file.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#0038B8] text-white px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#0038B8] transition-all duration-300"
                >
                  Talk To Us <ArrowRight size={14} />
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

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#F2F0E9] z-10" />
      </section>

      {/* ═══════════════════════════════════════════════════════
          KEY STATS
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#0a0e1a] text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { stat: 'B/2', label: 'Visa Type', sub: 'residence, not work' },
              { stat: '2 Yrs', label: 'Maximum Stay', sub: 'then convert or leave' },
              { stat: '2 Yrs', label: 'Experience Required', sub: 'in the field of the idea' },
              { stat: '100%', label: 'Of R&D In Israel', sub: 'a condition, not a preference' },
            ].map((s, i) => (
              <div key={i} className="py-10 px-8 hover:bg-white/5 transition-colors text-center">
                <p className="font-serif text-5xl text-[#4d7fff] mb-2">{s.stat}</p>
                <p className="font-sans text-sm font-bold text-white mb-1">{s.label}</p>
                <p className="font-sans text-xs text-white/40">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          THE PROGRAMME
      ═══════════════════════════════════════════════════════ */}
      <section className="py-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          <div className="relative h-80 lg:h-auto order-2 lg:order-1">
            <Image
              src="/fa/img/israel-2.webp"
              alt="The two towers of the Azrieli Center in Tel Aviv seen from below against a clear sky"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F2F0E9] hidden lg:block" />
          </div>

          <div className="order-1 lg:order-2 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-20 bg-[#F2F0E9]">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#0038B8] mb-6">
              The Programme
            </span>
            <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-8" style={{ letterSpacing: '-0.02em' }}>
              A Recommendation,<br />
              <span className="italic">Not A Visa.</span>
            </h2>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed mb-6">
              Israel&rsquo;s technology sector is roughly a fifth of its GDP, and the Innovation Visa
              exists to pull founders into it. Announced as a pilot in 2017, the current procedure
              was approved in <strong className="text-[#1a1a1a]">2024</strong> together with the
              Population and Immigration Authority.
            </p>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed mb-6">
              Understand the decision chain before anything else, because almost every
              misdescription of this route starts here. The{' '}
              <strong className="text-[#1a1a1a]">Israel Innovation Authority does not issue
              visas</strong>. It evaluates your project and, if it approves, writes a
              recommendation. PIBA issues the visa. And before either of them will act, a landing
              pad has to have accepted you.
            </p>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed">
              The Authority also runs the funding programmes a founder here would use — Ideation
              (Tnufa) at idea stage, the technological incubators above it — and, with the Ministry
              of Defense, a set of dual-use programmes that are outside the scope of this page.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PROCESS
      ═══════════════════════════════════════════════════════ */}
      <section id="process" className="py-28 px-6 bg-[#0d1017] text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
            <div className="lg:col-span-5">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#4d7fff] block mb-4">
                Step-by-Step
              </span>
              <h2 className="font-serif text-5xl md:text-6xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                Five Stages,<br />
                <span className="italic text-white/50">In This Order.</span>
              </h2>
            </div>
            <div className="lg:col-span-7 flex items-end">
              <p className="font-sans text-white/50 text-base leading-relaxed">
                Each stage produces the input for the next one. Skipping to the immigration
                question is the most expensive mistake available on this route: without a landing
                pad&rsquo;s letter there is no file to submit.
              </p>
            </div>
          </div>

          <div className="space-y-px bg-white/10">
            {steps.map((s) => (
              <div key={s.num} className="bg-[#0d1017] p-10 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 hover:bg-[#12161f] transition-colors">
                <div className="md:col-span-2 flex items-start gap-4">
                  <span className="font-serif text-4xl text-[#4d7fff]">{s.num}</span>
                  <s.icon className="w-6 h-6 text-white/30 mt-2" />
                </div>
                <div className="md:col-span-4">
                  <h3 className="font-serif text-3xl leading-tight">{s.title}</h3>
                </div>
                <div className="md:col-span-6">
                  <p className="font-sans text-white/60 text-sm leading-relaxed mb-4">{s.body}</p>
                  <p className="font-sans text-white/40 text-xs leading-relaxed border-l border-[#4d7fff]/50 pl-4">
                    {s.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          WHAT THE AUTHORITY LOOKS FOR
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F2F0E9]">
        <div className="container mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#0038B8] block mb-4">
            Eligibility
          </span>
          <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-16" style={{ letterSpacing: '-0.02em' }}>
            What They Are<br />
            <span className="italic text-[#1a1a1a]/40">Actually Asking For.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#1a1a1a]/10">
            {criteria.map((c) => (
              <div key={c.title} className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-white transition-colors">
                <c.icon className="w-6 h-6 text-[#0038B8] mb-6" />
                <h3 className="font-serif text-2xl mb-4">{c.title}</h3>
                <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 border-l-2 border-[#0038B8] pl-6 max-w-3xl">
            <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed">
              Two conditions sit outside that grid and are missed more often than any of them. All
              research and development must be carried out{' '}
              <strong>inside Israel</strong>. And you must file a declaration of the financial
              means to support yourself for the whole stay — the landing pad contributes nothing
              towards your living costs.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          LANDING PADS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white border-y border-[#1a1a1a]/8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
            <div className="lg:col-span-5">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#0038B8] block mb-4">
                The Real Gate
              </span>
              <h2 className="font-serif text-5xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                The Twelve<br />
                <span className="italic text-[#1a1a1a]/40">Landing Pads.</span>
              </h2>
            </div>
            <div className="lg:col-span-7 flex items-end">
              <div className="bg-[#fff7ed] border-l-4 border-[#b45309] p-6">
                <p className="font-sans text-sm text-[#1a1a1a]/80 leading-relaxed">
                  <strong>This list is from 2017.</strong> It was published when the programme was
                  announced as a pilot, and no newer official source we could find restates it. It
                  is printed here with its date because that is the honest way to print it — take
                  it as a starting point for your own enquiry with the Innovation Authority, never
                  as today&rsquo;s roster.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#1a1a1a]/10">
            {landingPads.map((p) => (
              <div key={p.name} className="border-r border-b border-[#1a1a1a]/10 p-8 hover:bg-[#F2F0E9] transition-colors">
                <h3 className="font-sans text-base font-bold mb-2">{p.name}</h3>
                <p className="font-sans text-sm text-[#1a1a1a]/50 leading-relaxed">{p.note}</p>
              </div>
            ))}
          </div>

          <p className="font-sans text-sm text-[#1a1a1a]/50 leading-relaxed mt-8 max-w-3xl">
            What a landing pad gives: workspace, technological infrastructure, administrative,
            business and logistical support, mentorship, and a route into the local ecosystem and
            its investors. What it does not give: money to live on.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MONEY
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#0d1017] text-white">
        <div className="container mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#4d7fff] block mb-4">
            The Money
          </span>
          <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
            Four Different Things<br />
            <span className="italic text-white/40">People Keep Confusing.</span>
          </h2>
          <p className="font-sans text-white/50 text-base leading-relaxed max-w-2xl mb-16">
            Your own means, the idea-stage grant, the incubator programme, and what you owe back
            are four separate questions with four different answers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            {money.map((m) => (
              <div key={m.label} className="bg-[#0d1017] p-10 hover:bg-[#12161f] transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <CircleDollarSign className="w-5 h-5 text-[#4d7fff]" />
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-white/40">
                    {m.label}
                  </span>
                </div>
                <p className="font-serif text-4xl mb-5 text-[#4d7fff]">{m.figure}</p>
                <p className="font-sans text-sm text-white/60 leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 border-l-2 border-[#4d7fff] pl-6 max-w-3xl">
            <p className="font-sans text-sm text-white/70 leading-relaxed">
              <Banknote className="w-4 h-4 inline mr-2 text-[#4d7fff]" />
              Tnufa is money to build the product, not money to live on — salaries and overheads
              are explicitly excluded. Budget for both separately, or the gap turns up in month
              three.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          WHO CANNOT USE THIS ROUTE
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F2F0E9]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#b45309] block mb-4">
                Access
              </span>
              <h2 className="font-serif text-5xl leading-tight mb-8" style={{ letterSpacing: '-0.02em' }}>
                Who Cannot<br />
                <span className="italic text-[#1a1a1a]/40">Use This Route.</span>
              </h2>
              <div className="relative h-64 hidden lg:block">
                <Image
                  src="/fa/img/israel-3.webp"
                  alt="A street café in Tel Aviv in daylight, tables under green awnings and customers seated outside"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <p className="font-sans text-[#1a1a1a]/70 text-base leading-relaxed">
                Israel designates certain states as enemy states — <strong>Iran, Lebanon, Syria and
                Iraq</strong> among them — and its law bars the Interior Minister from granting
                citizenship, residence permits, or permits to enter and stay to their citizens.
                A humanitarian exception exists; its quota is very small and its subject matter has
                nothing to do with entrepreneurship or investment.
              </p>
              <p className="font-sans text-[#1a1a1a]/70 text-base leading-relaxed">
                A second nationality does not automatically resolve this. The restriction attaches
                to citizenship of a designated state, not to the document you travel on, and we
                found no official source saying dual nationals are outside it. There may also be
                consequences under the law of the other country — Iranian law and the Iranian
                passport itself prohibit travel to Israel.
              </p>
              <div className="bg-white border-l-4 border-[#b45309] p-6">
                <p className="font-sans text-sm text-[#1a1a1a]/80 leading-relaxed">
                  If any of this describes you, take the question to an Israeli immigration lawyer.
                  Treat any adviser who answers it confidently without seeing your file — or who
                  sells you this route as a migration pathway — as a warning sign. Our Persian
                  guide at{' '}
                  <Link href="/fa/israel" className="text-[#0038B8] underline underline-offset-2">
                    /fa/israel
                  </Link>{' '}
                  says the same thing at greater length, because its whole readership is affected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white border-t border-[#1a1a1a]/8">
        <div className="container mx-auto max-w-4xl">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#0038B8] block mb-4">
            Questions
          </span>
          <h2 className="font-serif text-5xl leading-tight mb-16" style={{ letterSpacing: '-0.02em' }}>
            The Ones That<br />
            <span className="italic text-[#1a1a1a]/40">Actually Get Asked.</span>
          </h2>

          <div className="divide-y divide-[#1a1a1a]/10 border-y border-[#1a1a1a]/10">
            {faqs.map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="font-serif text-xl md:text-2xl cursor-pointer list-none flex items-start justify-between gap-6">
                  <span>{f.q}</span>
                  <ChevronRight className="w-5 h-5 mt-1.5 shrink-0 text-[#0038B8] transition-transform group-open:rotate-90" />
                </summary>
                <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed mt-4 pr-12">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CLOSING
      ═══════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 bg-[#0a0e1a] text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-8" style={{ letterSpacing: '-0.02em' }}>
            Not sure this is<br />
            <span className="italic text-[#4d7fff]">your route?</span>
          </h2>
          <p className="font-sans text-white/60 text-base leading-relaxed mb-12">
            We do not file Israeli innovation visa applications, and we will say so plainly rather
            than sell you an introduction. What we do is founder-side work on the routes we can
            actually run — and telling you honestly which of them fits.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#0038B8] text-white px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#0038B8] transition-all duration-300"
            >
              Talk To Us <ArrowRight size={14} />
            </Link>
            <Link
              href="/country"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              All Jurisdictions <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
