// ============================================================================
// Page: app/[locale]/(public)/country/finland/page.tsx
// Style: Nordic Immersive Editorial — Full Photography Experience
// Vibe: Aurora · Deep tech · Snow · Silence & Speed
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
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  Clock,
  Activity
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
    body: 'Apply to Business Finland for a positive Eligibility Statement. You must submit a comprehensive business plan demonstrating an innovative, highly scalable business model and the team’s capability to execute it.',
    note: 'Must have at least 2 founders who together own over 60% of the company.',
  },
  {
    num: '02',
    title: 'Fast Track Residence Permit',
    icon: Clock,
    body: 'Once Business Finland approves your idea, apply via Enter Finland for the Startup Residence Permit. Using the Fast Track service, processing takes a maximum of 14 days.',
    note: 'You must visit a Finnish mission (embassy/consulate) or VFS Global to prove identity within 5 days of applying online.',
  },
  {
    num: '03',
    title: 'D-Visa (Optional)',
    icon: Globe,
    body: 'You can apply for a D-Visa simultaneously with your permit. This allows you to travel to Finland immediately upon approval without waiting for the physical residence permit card to be mailed abroad.',
    note: 'Speeds up your arrival significantly.',
  },
  {
    num: '04',
    title: 'Arrive & Register',
    icon: Home,
    body: 'Enter Finland, visit the Digital and Population Data Services Agency (DVV) to register your municipality of residence, and finalize your company registration with the PRH (Finnish Patent and Registration Office).',
    note: 'Initial permit is valid for up to 2 years.',
  }
];

const scoringCriteria = [
  {
    title: 'Innovation',
    icon: Lightbulb,
    desc: 'Does the business model provide a significant competitive advantage? Are you bringing something genuinely new to the market?',
    score: 'Required',
  },
  {
    title: 'Scalability',
    icon: TrendingUp,
    desc: 'Rapid global growth potential. A local consulting firm or restaurant will be rejected immediately.',
    score: 'Required',
  },
  {
    title: 'Team Capacity',
    icon: Users,
    desc: 'Diverse, capable founder team with the skills to execute. Solo founders are generally not accepted; aim for 2+ founders.',
    score: 'Required',
  },
  {
    title: 'Financial Viability',
    icon: DollarSign,
    desc: 'Demonstrated ability to fund early-stage operations and a clear path to securing further venture capital or revenue.',
    score: 'Required',
  },
];

const financials = [
  { label: 'Single applicant', eur: '~€1,210 / month', total: '€14,520 / year' },
  { label: 'Applicant + spouse', eur: '~€1,910 / month', total: '€22,920 / year' },
  { label: 'With spouse + 1 child', eur: '~€2,410 / month', total: '€28,920 / year' },
  { label: 'Each additional child', eur: '+ €500 / month', total: '+ €6,000 / year' },
];

const rights = [
  { title: 'Work Permit Type', content: 'Closed to your startup, but allows you to work fully on building your business.', positive: false },
  { title: 'Fast Track Service', content: 'Guaranteed 14-day processing if you use the Fast Track lane and submit digitally.', positive: true },
  { title: 'Schengen Travel', content: 'Visa-free travel across the Schengen zone for up to 90 days per 180-day period.', positive: true },
  { title: 'Public Healthcare', content: 'Full access to Finland\'s world-class public healthcare system once registered.', positive: true },
  { title: 'Education', content: 'Free, world-leading education for your children.', positive: true },
  { title: 'Social Security', content: 'Eligible for Kela (Social Insurance Institution of Finland) benefits upon establishing permanent residency.', positive: true },
];

const sectors = [
  { icon: Gamepad2, name: 'Gaming', desc: 'Home to Supercell, Rovio, Remedy. A massive ecosystem for game devs.' },
  { icon: Wifi, name: 'Connectivity & 6G', desc: 'Nokia\'s heritage lives on. Deep tech in telecom and quantum computing.' },
  { icon: Snowflake, name: 'Clean Energy', desc: 'Smart grids, bio-economy, battery technology, and sustainable materials.' },
  { icon: Activity, name: 'Health Tech', desc: 'Digital health records, genomics, and personalized medicine.' },
  { icon: Rocket, name: 'Deep Tech & AI', desc: 'Strong academic-industry collaboration in AI and machine learning.' },
  { icon: Globe, name: 'EduTech', desc: 'Leveraging Finland\'s reputation as a global leader in education.' },
];

const faqs = [
  {
    q: 'Do I need a local Finnish partner or sponsor?',
    a: 'No. The Finnish Startup Permit allows foreign entrepreneurs to hold 100% ownership. However, having at least two founders who collectively own more than 60% of the company is highly recommended by Business Finland.',
  },
  {
    q: 'Is there a minimum capital investment required?',
    a: 'No statutory minimum investment is required for the business itself, unlike some Golden Visas. You only need to prove personal financial means (e.g., ~€14,520 for a single applicant for the first year) and demonstrate that the company has a plausible financial plan.',
  },
  {
    q: 'Can I apply as a solo founder?',
    a: 'While legally possible, Business Finland strongly prefers teams of at least two founders with complementary skills. Solo founders face a much higher rate of rejection for the Eligibility Statement.',
  },
  {
    q: 'How long does the Business Finland evaluation take?',
    a: 'The Eligibility Statement from Business Finland typically takes 2 to 4 weeks. Once approved, the actual residence permit via the Fast Track takes a maximum of 14 days.',
  },
  {
    q: "What is the path to Permanent Residence?",
    a: "After 4 continuous years of residing in Finland on an 'A' permit (the Startup Permit is usually an 'A' permit), you can apply for permanent residence. After 5 years, you can apply for Finnish citizenship, provided you meet language requirements (Finnish or Swedish).",
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
              <span className="text-white font-bold">14-Day Processing.</span>
            </p>
            <div className="space-y-6">
              <p className="font-sans text-white/80 text-sm leading-relaxed border-l-2 border-[#00BFA5] pl-5">
                The world's happiest country offers one of the fastest founder visas globally. 
                With Business Finland's approval, you and your family can secure a residence permit in just two weeks via the Fast Track.
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
          KEY STATS — DARK BAND
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#002F6C] text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { stat: '14 Days', label: 'Fast Track', sub: 'maximum processing time' },
              { stat: '2 Yrs', label: 'Initial Permit', sub: 'fully renewable' },
              { stat: '2+', label: 'Founders Needed', sub: 'strongly preferred by Business Finland' },
              { stat: '4 Yrs', label: 'To Permanent Residence', sub: 'followed by citizenship eligibility' },
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
              The Ecosystem
            </span>
            <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-8" style={{ letterSpacing: '-0.02em' }}>
              The Engine Behind<br />
              <span className="italic text-[#00BFA5]">Slush & Supercell.</span>
            </h2>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed mb-6">
              Finland is a paradox. It is quiet, calm, and incredibly stable, yet it operates at a blistering pace when it comes to technology. 
              The <strong>Finnish Startup Permit</strong> is designed for high-growth founders who want to build global, scalable companies from a base of absolute stability.
            </p>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed">
              With the highest amount of VC investment per capita in Europe and a deep-tech heritage rooted in companies like Nokia, Finland offers an unparalleled environment for innovation. 
              The process begins with an Eligibility Statement from Business Finland, focusing heavily on team capacity and global scalability.
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
              src="https://www.youtube.com/embed/onSFM-LkXxU" 
              title="How to Get the Finland Startup Visa in 2026: Ultimate Guide" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STEP-BY-STEP PROCESS
      ═══════════════════════════════════════════════════════ */}
      <section id="process" className="py-28 px-6 bg-[#001B3D] text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
            <div className="lg:col-span-5">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#00BFA5] block mb-4">
                Step-by-Step Guide
              </span>
              <h2 className="font-serif text-5xl md:text-6xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                The 4-Step<br />
                <span className="italic text-white/30">Process</span>
              </h2>
            </div>
            <div className="lg:col-span-7 flex flex-col justify-end">
              <p className="font-sans text-white/50 text-base leading-relaxed">
                From securing Business Finland's blessing to navigating the Fast Track lane at Migri (Finnish Immigration Service).
              </p>
              {/* Fast Track Note */}
              <div className="mt-8 flex items-start gap-3 bg-[#00BFA5]/10 border border-[#00BFA5]/40 p-5">
                <Clock className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
                <p className="font-sans text-xs text-[#00BFA5] leading-relaxed">
                  <strong>The D-Visa Advantage:</strong> Applying for a D-visa concurrently with your residence permit allows you to travel to Finland immediately upon a positive decision, picking up your physical card once inside the country.
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
                    <span className="font-serif text-5xl text-[#00BFA5]/30 group-hover:text-[#00BFA5] transition-colors select-none">
                      {step.num}
                    </span>
                  </div>
                  <div className="lg:col-span-3 flex items-start gap-4">
                    <Icon className="w-5 h-5 text-[#00BFA5] shrink-0 mt-1" />
                    <h3 className="font-serif text-2xl">{step.title}</h3>
                  </div>
                  <div className="lg:col-span-8 space-y-3">
                    <p className="font-sans text-white/70 text-sm leading-relaxed">{step.body}</p>
                    <p className="font-sans text-xs text-[#00BFA5] border-l border-[#00BFA5] pl-3">
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
              <span className="italic text-white/60">Seven years running.</span>
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
                Before applying for the residence permit, you must secure a positive Eligibility Statement. 
                Business Finland strictly evaluates your business plan for rapid scalability and global ambition.
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
              2025 Requirements
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mb-4 leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Proof of Funds
            </h2>
            <p className="font-sans text-white/60 text-sm leading-relaxed mb-10">
              You must demonstrate sufficient personal funds to live in Finland for at least one year. 
              The business itself does not require a minimum statutory investment.
            </p>

            <div className="space-y-0 border-t border-white/10">
              {financials.map((f, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-5 border-b border-white/10 hover:bg-white/5 transition-colors px-2"
                >
                  <span className="font-sans text-sm text-white/80">{f.label}</span>
                  <div className="text-right">
                    <p className="font-serif text-xl text-[#00BFA5]">{f.eur}</p>
                    <p className="font-sans text-xs text-white/50">{f.total}</p>
                  </div>
                </div>
              ))}
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
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#002F6C] block mb-4">
              Your 2-Year Permit
            </span>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <h2 className="font-serif text-5xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                Rights &<br /> Restrictions
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              Your spouse and children can join you simultaneously through the Fast Track. 
              Crucially, your spouse receives an <strong className="text-white">Open Work Permit</strong>, meaning they can work full-time in any job without restrictions.
            </p>

            <div className="space-y-6">
              {[
                { icon: Users, title: 'Who qualifies', body: 'Spouse/registered partner + unmarried children under 18.' },
                { icon: Briefcase, title: 'Open Work Permit for spouse', body: 'Full-time, any sector, no restrictions — unlike the entrepreneur\'s closed permit.' },
                { icon: Award, title: 'Healthcare & education', body: 'Access to Finland\'s free public healthcare and world-renowned education system.' },
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
                Finland is a global leader in specific deep-tech and digital niches. Aligning your startup with these sectors can increase your chances of securing the Business Finland Eligibility Statement.
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
          ROADMAP — TIMELINE
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F2F0E9]">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#002F6C] block mb-4">
              Long-Term Vision
            </span>
            <h2 className="font-serif text-5xl md:text-6xl" style={{ letterSpacing: '-0.02em' }}>
              Your Road to<br />
              <span className="italic">Finnish Citizenship</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-0.5 bg-[#1a1a1a]/10" />

            {[
              { phase: 'Year 1–2', title: 'Initial Permit', color: '#002F6C', desc: 'Launch your startup. Register your residence. Use the D-Visa for quick entry.', dot: '#00BFA5' },
              { phase: 'Year 3–4', title: 'Extension', color: '#001B3D', desc: 'Extend your permit. Show business activity and sufficient income.', dot: '#002F6C' },
              { phase: 'Year 4+', title: 'Permanent Residency', color: '#1a1a1a', desc: 'Apply after 4 continuous years on a continuous (A) permit.', dot: '#1a1a1a' },
              { phase: 'Year 5+', title: 'Finnish Passport', color: '#002F6C', desc: 'Full EU citizenship after passing the Finnish or Swedish language proficiency test.', dot: '#002F6C' },
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
              <strong>Regulatory Notice:</strong> All information is sourced from official Business Finland and Migri documentation and is provided for informational purposes only. Visa Roads Inc. is a strategic business advisory firm — we are <span className="underline">NOT</span> an immigration law firm or recruitment agency. Approval of an Eligibility Statement does not guarantee a residence permit. Financial thresholds are subject to annual revision — always verify current figures at <a href="https://migri.fi" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#00BFA5] transition-colors">migri.fi</a>.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}