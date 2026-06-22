// ============================================================================
// Page: app/[locale]/(public)/country/denmark/page.tsx
// Style: Nordic Immersive Editorial — Full Photography Experience
// Vibe: Copenhagen canals · Red cross · Wind turbines · Nordic light
// ============================================================================

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Wind,
  Thermometer,
  Building,
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
  Calendar,
  MapPin,
  DollarSign,
  FileText,
} from 'lucide-react';
import type { Metadata } from 'next';
import { metaFor } from '@/lib/pageMeta';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/country/denmark', locale);
}

// ─── Data ────────────────────────────────────────────────────────────────────

const steps = [
  {
    num: '01',
    title: 'Check Eligibility',
    icon: CheckCircle,
    body: 'Open to non-EU/EEA/Swiss nationals only. Apply solo or as a team of up to 3 co-founders. Each person counts individually toward the 75-person annual cap.',
    note: 'Restaurants, retail stores, and import/export agencies are explicitly excluded.',
  },
  {
    num: '02',
    title: 'Prepare Your Pitch Package',
    icon: FileText,
    body: 'Submit two documents in English: (1) a PDF Pitch Deck (max 15 pages) covering market analysis, GTM strategy, and why Denmark; (2) a Video Pitch (max 5 minutes) personally presenting your idea, scalability, and team.',
    note: 'No language certificate required — your video pitch IS the language assessment.',
  },
  {
    num: '03',
    title: 'Expert Panel Evaluation',
    icon: Users,
    body: 'Submit on Virk.dk. After an initial screen, at least 3 independent Danish Business Hub consultants score your plan on 4 criteria. You need an average of 3.5/5. Typical review: 2–6 weeks. Closed in July.',
    note: 'No interview. The panel judges solely on your submitted documents.',
  },
  {
    num: '04',
    title: 'SIRI Residence Permit',
    icon: Globe,
    body: "Upon panel approval, apply to SIRI (Danish Agency for International Recruitment and Integration). Generate a Case Order ID, pay DKK 3,060, upload documents, and submit biometrics within 14 days. Processing: ~1 month.",
    note: 'Government fee: DKK 3,060 (~€410).',
  },
  {
    num: '05',
    title: 'Arrive & Launch',
    icon: Home,
    body: 'Enter Denmark, register your CPR number, activate MitID (digital ID), and get your CVR company registration. Your initial permit is valid for up to 2 years.',
    note: 'Stay outside Denmark 6+ consecutive months and your permit is void.',
  },
];

const scoringCriteria = [
  {
    title: 'Innovation',
    icon: Lightbulb,
    desc: 'How novel is your product, service, or business model? It must introduce something genuinely new to the market.',
    score: '1–5',
  },
  {
    title: 'Market Attractiveness',
    icon: TrendingUp,
    desc: 'How large and accessible is your target market? The panel looks for real, measurable demand.',
    score: '1–5',
  },
  {
    title: 'Scalability',
    icon: Globe,
    desc: "Can your business grow rapidly beyond Denmark's borders? The program targets companies with global ambitions.",
    score: '1–5',
  },
  {
    title: 'Team Capability',
    icon: Users,
    desc: 'Do the founders have the skills, experience, and resources to execute the plan successfully?',
    score: '1–5',
  },
];

const financials = [
  { label: 'Single applicant', dkk: '153,240 DKK', eur: '~€17,000' },
  { label: 'Applicant + spouse', dkk: '306,480 DKK', eur: '~€34,000' },
  { label: 'With spouse + child(ren)', dkk: '356,904 DKK', eur: '~€43,000' },
  { label: 'With child(ren), no spouse', dkk: '203,664 DKK', eur: '~€22,500' },
];

const rights = [
  { title: 'Work Permit Type', content: 'Closed permit — only the approved startup.', positive: false },
  { title: 'Side Work', content: '8–15 hrs/week in a closely related role, with separate authorization.', positive: true },
  { title: 'Schengen Travel', content: 'Up to 90 days per 180-day period in Schengen countries, but no working.', positive: true },
  { title: 'Welfare Benefits', content: 'NOT eligible for Danish public welfare. Receiving any can void your permit.', positive: false },
  { title: 'Free Danish Classes', content: 'After CPR registration (18+), free Danish language courses are your right.', positive: true },
  { title: 'Voluntary Work', content: 'Unpaid volunteer activities are fully permitted.', positive: true },
];

const sectors = [
  { icon: Wind, name: 'Cleantech & Green Energy', desc: 'Wind, water management, waste-to-energy, carbon capture.' },
  { icon: Thermometer, name: 'Life Sciences', desc: 'Biotech, MedTech, digital health. Home to Novo Nordisk.' },
  { icon: Lightbulb, name: 'AI & Deep Tech', desc: 'Machine learning, robotics, advanced SaaS platforms.' },
  { icon: Building, name: 'Fintech', desc: 'Payments, WealthTech, InsurTech, RegTech.' },
  { icon: Globe, name: 'Design & Software', desc: 'SaaS, sound technology, sustainable design.' },
  { icon: Users, name: 'Food Tech', desc: 'Alternative proteins, agri-efficiency, food safety.' },
];

const faqs = [
  {
    q: 'Is a language certificate (IELTS/TOEFL) required?',
    a: "No formal language test is required. All documents must be in English. Your 5-minute video pitch is effectively the language assessment. Danish proficiency is not required to enter the program, but classes are free once you register your CPR address. 95%+ of Danes speak fluent English.",
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
    a: 'No. Funds do not need to be locked or earmarked. They simply need to appear on a recent bank statement. Many applicants present the funds briefly to obtain the statement.',
  },
  {
    q: "What is the path to Permanent Residence?",
    a: "After 5 lawful years in Denmark (initial 2-year permit + 3-year extension), you may apply for permanent residence, provided you pass the Danish integration tests. After several more years with PR status, you can apply for Danish citizenship — one of the world's strongest passports with full EU access.",
  },
  {
    q: "Why does Denmark reject some successful startups?",
    a: "Approval is about fit with Denmark's specific needs, not past success. Startups that raised capital in other markets have been rejected while early-stage startups in priority sectors were accepted. Clearly answer 'Why Denmark specifically?' in every part of your submission.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function DenmarkPage() {
  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a] overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════
          HERO — FULL-BLEED NYHAVN
      ═══════════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[700px] flex flex-col justify-end overflow-hidden">
        {/* Background Image — Nyhavn, Copenhagen */}
        <Image
          src="https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=1800&q=85&auto=format&fit=crop"
          alt="Nyhavn Canal, Copenhagen, Denmark"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/60 to-transparent" />

        {/* Danish cross accent — top right */}
        <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none opacity-10">
          <div className="absolute top-0 left-[38%] w-[24%] h-full bg-[#C8102E]" />
          <div className="absolute top-[38%] left-0 w-full h-[24%] bg-[#C8102E]" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 pb-20">
          <div className="flex items-center gap-3 mb-8">
            {/* Mini Danish flag */}
            <div className="relative w-8 h-6 overflow-hidden border border-white/20">
              <div className="absolute inset-0 bg-[#C8102E]" />
              <div className="absolute top-0 left-[38%] w-[20%] h-full bg-white" />
              <div className="absolute top-[38%] left-0 w-full h-[24%] bg-white" />
            </div>
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/60">
              Startup Denmark · Non-EU Founder Visa
            </span>
          </div>

          <h1 className="font-serif text-white mb-6" style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85, letterSpacing: '-0.03em' }}>
            DENMARK<br />
            <span className="italic text-[#C8102E]">STARTUP.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mt-12">
            <p className="font-serif text-white/80 text-2xl md:text-3xl leading-snug">
              75 visas a year. One expert panel.{' '}
              <span className="text-white font-bold">No minimum investment.</span>
            </p>
            <div className="space-y-6">
              <p className="font-sans text-white/60 text-sm leading-relaxed border-l-2 border-[#C8102E] pl-5">
                Denmark's government-run startup visa is decided not by an immigration officer, but by
                an independent panel of Danish industry experts — your idea is judged on merit.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#C8102E] text-white px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#C8102E] transition-all duration-300"
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
          KEY STATS — DARK BAND
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#0a0e1a] text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { stat: '75', label: 'Visas Per Year', sub: 'per person, not per team' },
              { stat: '2 Yrs', label: 'Initial Permit', sub: 'fully renewable' },
              { stat: '3.5/5', label: 'Panel Pass Mark', sub: 'average across 4 criteria' },
              { stat: '5 Yrs', label: 'To Permanent Residence', sub: 'then citizenship eligible' },
            ].map((s, i) => (
              <div key={i} className="py-10 px-8 hover:bg-white/5 transition-colors text-center">
                <p className="font-serif text-5xl text-[#C8102E] mb-2">{s.stat}</p>
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
          {/* Image — Copenhagen cycling street */}
          <div className="relative h-80 lg:h-auto order-2 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=900&q=80&auto=format&fit=crop&crop=left"
              alt="Nyhavn colorful canal houses, Copenhagen Denmark"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F2F0E9] hidden lg:block" />
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-20 bg-[#F2F0E9]">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] mb-6">
              The Program
            </span>
            <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-8" style={{ letterSpacing: '-0.02em' }}>
              The World's Most<br />
              <span className="italic">Digital Nation.</span>
            </h2>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed mb-6">
              Denmark consistently ranks #1 globally for digital government services — you can
              register a company in minutes. The{' '}
              <strong className="text-[#1a1a1a]">Startup Denmark</strong> program is a nationally
              managed pathway for non-EU entrepreneurs building innovative, scalable businesses here.
            </p>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed">
              Unlike investment-based visas, there is no minimum capital requirement. Your idea is
              evaluated by a panel of Danish business experts on its innovation, market potential,
              scalability, and your team's capability.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STEP-BY-STEP PROCESS
      ═══════════════════════════════════════════════════════ */}
      <section id="process" className="py-28 px-6 bg-[#0d1017] text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
            <div className="lg:col-span-5">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] block mb-4">
                Step-by-Step Guide
              </span>
              <h2 className="font-serif text-5xl md:text-6xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                The 5-Step<br />
                <span className="italic text-white/30">Process</span>
              </h2>
            </div>
            <div className="lg:col-span-7 flex flex-col justify-end">
              <p className="font-sans text-white/50 text-base leading-relaxed">
                From eligibility check to registering your company in Copenhagen. Based on official
                Startup Denmark, SIRI, and Danish Business Authority guidelines.
              </p>
              {/* July Warning */}
              <div className="mt-8 flex items-start gap-3 bg-amber-900/30 border border-amber-700/40 p-5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="font-sans text-xs text-amber-300/80 leading-relaxed">
                  <strong className="text-amber-300">July Closure:</strong> No evaluations in July. Submit after June 14th and your application moves to August. The 75-person cap resets January 1 and fills fast — apply in Q1.
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
                  className="group grid grid-cols-1 lg:grid-cols-12 border-t border-white/10 hover:bg-white/5 transition-colors py-10 gap-8"
                >
                  <div className="lg:col-span-1">
                    <span className="font-serif text-5xl text-[#C8102E]/30 group-hover:text-[#C8102E] transition-colors select-none">
                      {step.num}
                    </span>
                  </div>
                  <div className="lg:col-span-3 flex items-start gap-4">
                    <Icon className="w-5 h-5 text-[#C8102E] shrink-0 mt-1" />
                    <h3 className="font-serif text-2xl">{step.title}</h3>
                  </div>
                  <div className="lg:col-span-8 space-y-3">
                    <p className="font-sans text-white/60 text-sm leading-relaxed">{step.body}</p>
                    <p className="font-sans text-xs text-[#C8102E] border-l border-[#C8102E] pl-3">
                      {step.note}
                    </p>
                  </div>
                </div>
              );
            })}
            <div className="border-t border-white/10" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          WIND TURBINE IMAGE BREAK
      ═══════════════════════════════════════════════════════ */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1600&q=80&auto=format&fit=crop"
          alt="Danish offshore wind turbines — Ørsted"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/90 to-[#0a0e1a]/20" />
        <div className="relative z-10 h-full flex items-center px-6">
          <div className="container mx-auto">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] mb-3">
              Priority Sector
            </p>
            <p className="font-serif text-white text-4xl md:text-6xl leading-tight max-w-2xl" style={{ letterSpacing: '-0.02em' }}>
              Home to Vestas & Ørsted.<br />
              <span className="italic text-white/40">The world's green energy capital.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SCORING CRITERIA
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F2F0E9]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-16">
            <div className="lg:col-span-4">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] block mb-4">
                How You Are Judged
              </span>
              <h2 className="font-serif text-5xl leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
                The 4 Scoring Criteria
              </h2>
              <div className="w-10 h-0.5 bg-[#C8102E] mb-8" />
              <p className="font-sans text-[#1a1a1a]/60 text-sm leading-relaxed mb-6">
                At least 3 independent consultants from Danish Business Hubs evaluate your pitch
                package. Each scores all 4 criteria from 1–5. You need a combined average of{' '}
                <strong className="text-[#1a1a1a]">at least 3.5 out of 5</strong>.
              </p>
              <p className="font-sans text-[#1a1a1a]/60 text-sm leading-relaxed">
                There is no interview. The panel works exclusively from your pitch deck and video.
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              {scoringCriteria.map((c, i) => {
                const Icon = c.icon;
                return (
                  <div
                    key={i}
                    className="group p-8 bg-white border border-[#1a1a1a]/8 hover:border-[#C8102E] hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <Icon className="w-8 h-8 text-[#C8102E] group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-serif text-xl text-[#1a1a1a]/20">{c.score}</span>
                    </div>
                    <h3 className="font-serif text-2xl mb-3">{c.title}</h3>
                    <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed">{c.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rejection note */}
          <div className="bg-[#0d1017] text-white p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-1 flex justify-center">
              <div className="w-10 h-10 border border-[#C8102E] flex items-center justify-center">
                <span className="text-[#C8102E] font-bold text-lg">!</span>
              </div>
            </div>
            <div className="md:col-span-8">
              <p className="font-sans font-bold text-sm mb-1">If Rejected</p>
              <p className="font-sans text-sm text-white/60 leading-relaxed">
                You receive a written panel statement with individual scores. You may appeal once to
                the Danish Business Authority (new panel, final decision), or substantially improve your
                plan and reapply as a fresh application.
              </p>
            </div>
            <div className="md:col-span-3 flex justify-end">
              <Link href="/contact" className="font-sans text-xs font-bold uppercase tracking-widest border-b border-[#C8102E] text-[#C8102E] pb-1 hover:text-white hover:border-white transition-colors">
                Get Pre-Assessment →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINANCIAL REQUIREMENTS — SPLIT WITH AERIAL IMAGE
      ═══════════════════════════════════════════════════════ */}
      <section className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Aerial image of Copenhagen */}
          <div className="relative h-72 lg:h-auto order-2 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=900&q=80&auto=format&fit=crop&crop=right"
              alt="Copenhagen canals and waterfront"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1017] via-transparent to-transparent lg:bg-gradient-to-l lg:from-[#0d1017] lg:via-transparent" />
          </div>

          {/* Financials */}
          <div className="order-1 lg:order-2 bg-[#0d1017] text-white px-10 md:px-16 py-20">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] block mb-4">
              2025 Requirements
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mb-4 leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Proof of Funds
            </h2>
            <p className="font-sans text-white/50 text-sm leading-relaxed mb-10">
              Demonstrate sufficient funds for your first year in Denmark. Funds do not need to be
              frozen — they just need to appear on a recent bank statement.
            </p>

            <div className="space-y-0 border-t border-white/10">
              {financials.map((f, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-5 border-b border-white/10 hover:bg-white/5 transition-colors px-2"
                >
                  <span className="font-sans text-sm text-white/60">{f.label}</span>
                  <div className="text-right">
                    <p className="font-serif text-xl text-white">{f.dkk}</p>
                    <p className="font-sans text-xs text-[#C8102E]">{f.eur}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-5 border border-white/10 bg-white/5">
              <p className="font-sans text-xs text-white/50 leading-relaxed">
                <strong className="text-white">Copenhagen cost estimates:</strong> Apartment rent ~€800–€1,300/month · Food & transport for two ~€400/month ·
                Government fee DKK 3,060 (~€410) · Danish language classes: free after CPR registration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          RIGHTS & RESTRICTIONS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F2F0E9]">
        <div className="container mx-auto">
          <div className="mb-16">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] block mb-4">
              Your 2-Year Permit
            </span>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <h2 className="font-serif text-5xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                Rights &<br /> Restrictions
              </h2>
              <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed self-end">
                The Startup Denmark permit is a <strong>closed work permit</strong>. Understanding
                what you can and cannot do helps you plan your first two years correctly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rights.map((r, i) => (
              <div
                key={i}
                className={`p-7 border transition-all hover:shadow-md group ${
                  r.positive
                    ? 'bg-white border-[#1a1a1a]/8 hover:border-[#003D73]'
                    : 'bg-[#C8102E]/5 border-[#C8102E]/20 hover:border-[#C8102E]/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {r.positive ? (
                    <CheckCircle className="w-5 h-5 text-[#003D73] shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-[#C8102E] shrink-0" />
                  )}
                  <h3 className="font-sans text-sm font-bold uppercase tracking-widest">
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
          <div className="bg-[#003D73] text-white px-10 md:px-16 py-24">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#AEC6CF] block mb-4">
              Bringing Your Family
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Your Family Gets<br />
              <span className="italic">More Freedom</span><br />
              Than You Do.
            </h2>
            <p className="font-sans text-white/60 text-sm leading-relaxed mb-10">
              Your spouse/registered partner and children under 18 can join you with their own
              residence permits — and crucially, your spouse receives an{' '}
              <strong className="text-white">Open Work Permit</strong>, meaning they can work
              full-time in any job without restrictions.
            </p>

            <div className="space-y-6">
              {[
                { icon: Users, title: 'Who qualifies', body: 'Spouse/registered partner + children under 18 living with you.' },
                { icon: Briefcase, title: 'Open Work Permit for spouse', body: 'Full-time, any sector, no restrictions — unlike the entrepreneur\'s closed permit.' },
                { icon: Award, title: 'Healthcare & education', body: 'Access to Denmark\'s free public healthcare and education system from day one.' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex gap-5 items-start border-t border-white/10 pt-5">
                    <Icon className="w-5 h-5 text-[#AEC6CF] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-sans text-sm font-bold text-white mb-1">{item.title}</p>
                      <p className="font-sans text-sm text-white/60">{item.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image — Copenhagen family/harbor life */}
          <div className="relative h-80 lg:h-auto">
            <Image
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80&auto=format&fit=crop"
              alt="Modern Scandinavian living room interior design"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          75-CAP STRATEGY
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F2F0E9]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] block mb-4">
                Timing Is Everything
              </span>
              <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
                75 Slots.<br />
                <span className="italic text-[#1a1a1a]/30">Every Year.</span>
              </h2>
              <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed mb-10">
                The cap applies per <em>person</em>, not per team. A 3-founder team uses 3 of the
                75 slots. Real data: one approved team's permit numbers were 67, 68, and 69 — the
                cap was nearly full by mid-year.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Calendar, text: 'Apply as early as possible — ideally Q1 of the calendar year.' },
                  { icon: AlertTriangle, text: 'Avoid submitting after June 14 — July is a full evaluation closure month.' },
                  { icon: Lightbulb, text: 'Past fundraising success elsewhere does not guarantee approval. Fit with Denmark matters most.' },
                  { icon: MapPin, text: 'Answer "Why Denmark specifically?" clearly in every part of your submission.' },
                ].map((tip, i) => {
                  const Icon = tip.icon;
                  return (
                    <div key={i} className="flex gap-4 items-start p-5 bg-white border border-[#1a1a1a]/8 hover:border-[#C8102E] transition-colors group">
                      <Icon className="w-5 h-5 text-[#C8102E] shrink-0 mt-0.5" />
                      <p className="font-sans text-sm text-[#1a1a1a]/70">{tip.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual: Large stylized number */}
            <div className="relative bg-[#C8102E] aspect-square max-w-md mx-auto flex flex-col items-center justify-center overflow-hidden">
              {/* Danish cross overlay */}
              <div className="absolute top-0 left-[38%] w-[24%] h-full bg-white/10" />
              <div className="absolute top-[38%] left-0 w-full h-[24%] bg-white/10" />
              <div className="relative z-10 text-center">
                <p className="font-serif text-[10rem] leading-none text-white font-bold" style={{ textShadow: '0 0 60px rgba(255,255,255,0.1)' }}>75</p>
                <p className="font-sans text-sm uppercase tracking-[0.3em] text-white/80 mt-2">permits · per year</p>
                <div className="mt-8 px-8">
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[89%] bg-white rounded-full" />
                  </div>
                  <p className="font-sans text-[10px] text-white/50 text-center mt-2">Typical cap utilization — fills before year end</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PRIORITY SECTORS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#0d1017] text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
            <div className="lg:col-span-5">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] block mb-4">
                Where Denmark Wants to Grow
              </span>
              <h2 className="font-serif text-5xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                Priority<br />
                <span className="italic text-white/30">Sectors</span>
              </h2>
            </div>
            <div className="lg:col-span-7 flex flex-col justify-end">
              <p className="font-sans text-white/50 text-base leading-relaxed">
                The Expert Panel is more favorably inclined toward businesses that address Denmark's
                national economic priorities. Pitching in these areas gives a strategic advantage —
                though exceptional ideas in other sectors can still succeed.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sectors.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="group p-7 border border-white/10 hover:border-[#C8102E] hover:bg-white/5 transition-all duration-300"
                >
                  <Icon className="w-7 h-7 text-[#C8102E] mb-5 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-serif text-xl mb-2 text-white">{s.name}</h3>
                  <p className="font-sans text-xs text-white/50">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ROADMAP — TIMELINE
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F2F0E9]">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] block mb-4">
              Long-Term Vision
            </span>
            <h2 className="font-serif text-5xl md:text-6xl" style={{ letterSpacing: '-0.02em' }}>
              Your Road to<br />
              <span className="italic">Danish Citizenship</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-0.5 bg-[#1a1a1a]/10" />

            {[
              { phase: 'Year 1–2', title: 'Initial Permit', color: '#AEC6CF', desc: 'Launch your startup. Get your CPR, MitID, CVR. Attend free Danish classes.', dot: '#AEC6CF' },
              { phase: 'Year 3–5', title: '3-Year Extension', color: '#003D73', desc: 'Extend your permit. Scale your business, hire locally, prove impact.', dot: '#003D73' },
              { phase: 'Year 5+', title: 'Permanent Residency', color: '#0d1017', desc: 'Apply after 5 lawful years. Pass Danish integration tests.', dot: '#0d1017' },
              { phase: 'Year 9+', title: 'Danish Passport', color: '#C8102E', desc: 'Full EU citizenship. Visa-free access to 190+ countries.', dot: '#C8102E' },
            ].map((p, i) => (
              <div key={i} className="text-center px-4 mb-12 md:mb-0">
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-6 border-4 border-[#F2F0E9] shadow-md relative z-10"
                  style={{ backgroundColor: p.dot }}
                />
                <p className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-2">
                  {p.phase}
                </p>
                <h3 className="font-serif text-2xl mb-3">{p.title}</h3>
                <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed max-w-xs mx-auto">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white border-t border-[#1a1a1a]/8">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-16">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] block mb-4">
              Common Questions
            </span>
            <h2 className="font-serif text-5xl" style={{ letterSpacing: '-0.02em' }}>FAQ</h2>
          </div>

          <div className="border-t border-[#1a1a1a]/10">
            {faqs.map((faq, i) => (
              <details key={i} className="group border-b border-[#1a1a1a]/10">
                <summary className="flex justify-between items-center py-6 cursor-pointer list-none hover:text-[#C8102E] transition-colors group-open:text-[#C8102E]">
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
              <strong>Regulatory Notice:</strong> All information is sourced from official Startup
              Denmark, SIRI, and Danish Business Authority documentation and is provided for
              informational purposes only. Visa Roads Inc. is a strategic business advisory firm — we
              are <span className="underline">NOT</span> an immigration law firm or recruitment agency.
              Panel approval does not guarantee a residence permit; final decisions rest solely with SIRI.
              Financial thresholds are subject to annual revision — always verify current figures at{' '}
              <a href="https://www.nyidanmark.dk" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#C8102E] transition-colors">nyidanmark.dk</a>.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA — FULL-BLEED NYHAVN NIGHT
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-40 px-6 overflow-hidden">
        {/* Background image — Copenhagen at dusk */}
        <Image
          src="https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=1600&q=80&auto=format&fit=crop&crop=bottom"
          alt="Copenhagen Nyhavn at night"
          fill
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-[#0a0e1a]/85" />

        <div className="relative z-10 container mx-auto text-center text-white">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] mb-6">
            Ready to Apply?
          </p>
          <h2 className="font-serif mb-8 leading-tight" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.03em' }}>
            Build in Copenhagen.<br />
            <span className="italic text-white/30">Scale to Europe.</span>
          </h2>
          <p className="font-sans text-white/50 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
            We audit your concept against the Expert Panel's 4 criteria and craft a pitch deck and
            video that speaks the language of the Danish ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#C8102E] text-white px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-white hover:text-[#C8102E] transition-all duration-300"
            >
              Validate My Business Plan <ArrowRight size={16} />
            </Link>
            <Link
              href="/country"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              Compare Jurisdictions
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}