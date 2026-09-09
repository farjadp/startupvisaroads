// ============================================================================
// Page: app/[locale]/(public)/country/australia/page.tsx
// Style: Editorial, matching /country/denmark and /country/israel.
//
// Subject: the National Innovation Visa (subclass 858) — invitation-only
// permanent residence, successor to the Global Talent programme.
//
// THIS REPLACES a page that had gone materially stale: it still described the
// NIV as a fresh alternative to subclass 188 and carried no figures at all.
// /australia/entrepreneur-stream was a near-duplicate of it, competing for the
// same query, and now 301s here — one English page per subject.
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
// than as a settled number.
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
  Award,
  Send,
  Home,
  AlertTriangle,
} from 'lucide-react';
import type { Metadata } from 'next';
import { metaFor } from '@/lib/pageMeta';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/country/australia', locale);
}

// ─── Data ────────────────────────────────────────────────────────────────────

const steps = [
  {
    num: '01',
    title: 'Submit an EOI',
    icon: Send,
    body: 'An online Expression of Interest to the Department of Home Affairs, carrying the evidence of your achievements — patents, publications and citations, awards, funding rounds, media coverage, income.',
    note: 'You do not need a nominator at this stage. You do need the evidence.',
  },
  {
    num: '02',
    title: 'Wait For An Invitation',
    icon: AlertTriangle,
    body: 'This is the stage that decides the outcome. In the April–June 2026 round the Department received 2,166 EOIs and issued 248 invitations. In January–March, 1,815 and 146.',
    note: 'Roughly one invitation for every nine EOIs. Everything else on this page is downstream of clearing this.',
  },
  {
    num: '03',
    title: 'Lodge Within 60 Days',
    icon: FileText,
    body: 'An invitation starts a 60-day clock to lodge the formal application in ImmiAccount and pay the charge. Miss it and you are back at the start.',
    note: 'Have the nominator lined up before the invitation arrives, not after.',
  },
  {
    num: '04',
    title: 'Form 1000 And Checks',
    icon: Award,
    body: 'Your nominator signs Form 1000, certifying your international record. Then identity documents, health examinations, biometrics and police certificates for you and every family member.',
    note: 'The nominator must hold a national reputation in Australia in your own field. A friend who happens to be a citizen is not eligible.',
  },
  {
    num: '05',
    title: 'Permanent Residence',
    icon: Home,
    body: 'The grant is permanent residence — for you, your partner and dependent children under 23, at the same time and in the same application. Medicare from day one.',
    note: 'No provisional stage, and no condition tying you to a particular state.',
  },
];

// Department invitation rounds, as reported 11 Aug 2026. The point of showing
// both quarters is that the shape is stable, not a one-off.
const rounds = [
  { period: 'Apr–Jun 2026', eois: '2,166', invites: '248', p1: '<5', p2: '<20', p3: '192', p4: '38' },
  { period: 'Jan–Mar 2026', eois: '1,815', invites: '146', p1: '0', p2: '15', p3: '113', p4: '18' },
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

const evidence = [
  {
    title: 'Patents And IP',
    icon: Lightbulb,
    desc: 'International patents and intellectual property you hold, not applications pending.',
  },
  {
    title: 'Citations',
    icon: FileText,
    desc: 'Peer-reviewed publications with high citation counts in recognised journals.',
  },
  {
    title: 'Ventures And Capital',
    icon: Globe,
    desc: 'Companies founded and exited, or substantial capital raised — measured, not asserted.',
  },
  {
    title: 'Income',
    icon: Award,
    desc: 'Remuneration far above the industry standard, which is itself a measure of your market value.',
  },
];

const faqs = [
  {
    q: 'Is this a startup visa?',
    a: 'No, and the name misleads. Subclass 858 is Australia\'s Distinguished Talent visa renamed, and it replaced the Global Talent programme. It is assessed on the individual against a standard of exceptional and outstanding international achievement — not on a company, a business plan or a pitch deck. A founder at idea or seed stage does not meet it, however good the idea. There is no startup route underneath it either: subclass 188, the business innovation and investment stream, closed to new applications in 2024.',
  },
  {
    q: 'Can a founding team apply together?',
    a: 'No. The application is individual. Each co-founder must apply separately on their own record. What fits inside one application is a partner and dependent children, not teammates.',
  },
  {
    q: 'How hard is it, really?',
    a: 'The invitation is the wall. April–June 2026: 2,166 EOIs, 248 invitations. January–March 2026: 1,815 EOIs, 146 invitations. That is roughly one invitation for every nine expressions of interest. Once you hold an invitation the visa application itself succeeds at a very high rate — which is why quoting the grant rate without the invitation rate is so misleading.',
  },
  {
    q: "Doesn't the migration program have thousands of places?",
    a: 'It does — around 4,300 allocated to this category for 2025-26 — and that is not the constraint. Two published rounds issued 394 invitations between them. Places are not scarce; invitations are. Any pitch that sells you urgency on "the quota is filling up" has the mechanism backwards, and urgency produces weak files, which do not get invited.',
  },
  {
    q: 'Should I get a state nomination?',
    a: 'The standard advice is yes, because a government nomination on Form 1000 places you in Priority 2. The published breakdown inverts it. In April–June 2026 Priority 2 drew fewer than 20 invitations while Priority 3 — exceptional achievement in a Tier 1 sector — drew 192. The quarter before, 15 against 113. If you have a genuine Tier 1 record, the direct route is where the invitations actually are, and spending six months chasing a nomination can move you from the widest lane into the narrowest. Nomination is not a bad option; it is not the golden key it is sold as.',
  },
  {
    q: 'Which Ministerial Direction applies?',
    a: 'Direction 120, in force since 25 July 2026, which revoked Direction 112. There are now five priority groups rather than four — the fifth is a catch-all for all other Class BX applications — and the direction covers the whole Class BX, including Global Talent and Distinguished Talent applications still on hand. It applies to undecided applications lodged before it commenced, not only to new ones. Any guide still citing Direction 112 has not been reviewed since July.',
  },
  {
    q: 'What are the priority sectors?',
    a: 'Tier 1: critical technologies (artificial intelligence, advanced robotics, cyber security, quantum, photonics, biotechnology, autonomous systems, advanced ICT, advanced manufacturing and materials, clean energy generation and storage, and positioning, timing and sensing); renewables and low emission technologies (renewable generation, green metals, renewable hydrogen, waste-to-energy); and health industries (medical manufacturing, genomics, pharmaceuticals, antimicrobial resistance, implantable devices). Tier 2: agri-food and AgTech, defence capabilities and space, education, financial services and FinTech, infrastructure and transport, and resources.',
  },
  {
    q: 'What counts as exceptional and outstanding achievement?',
    a: 'Something measurable at a global scale, not a strong CV. International patents and IP. Peer-reviewed publications with high citation counts. Founding and exiting a business, or raising substantial capital. Broad international media coverage. Remuneration far above the industry standard. And one condition that gets lost: you must still be prominent. An achievement from a decade ago that did not continue will not carry the file.',
  },
  {
    q: 'Who can be my nominator?',
    a: 'An Australian citizen, permanent resident, eligible New Zealand citizen, an Australian organisation, or a government agency. The category matters less than the standing: they must have a national reputation in Australia in your own field. A former colleague who happens to be a citizen is not eligible, and a weak nominator is one of the recurring reasons strong files fail.',
  },
  {
    q: 'Is there an age limit?',
    a: 'No absolute cap. Applicants under 18, or 55 and over, must separately demonstrate exceptional benefit to the Australian community. Over 55 is not closed — it is harder, and the "still prominent" test does most of the work.',
  },
  {
    q: 'What English is required?',
    a: 'Functional English — a lower bar than the points-tested visas use. If you do not have it the application is not refused; you pay a second instalment of the visa application charge instead. It applies to the applicant and to every accompanying family member aged 18 or over.',
  },
  {
    q: 'What does it cost?',
    a: 'The visa application charge rose on 1 July 2026. Secondary sources put the main applicant near AUD 6,235, with roughly AUD 3,120 per additional applicant aged 18 or over and AUD 1,560 under 18 — but those sources disagree with each other, and we could not read the figure off Home Affairs directly. The charge is indexed every 1 July, so take the current number from the Department before you budget, and treat any figure quoted to you without a date as unreliable.',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function AustraliaPage() {
  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a] overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[700px] flex flex-col justify-end overflow-hidden">
        <Image
          src="/fa/img/australia.webp"
          alt="Sydney Harbour at dusk, the Opera House sails at left and the arch of the Harbour Bridge crossing the water"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/60 to-transparent" />

        <div className="relative z-10 container mx-auto px-6 pb-20">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/60 block mb-8">
            National Innovation Visa · Subclass 858
          </span>

          <h1
            className="font-serif text-white mb-6"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85, letterSpacing: '-0.03em' }}
          >
            AUSTRALIA<br />
            <span className="italic text-[#00843D]">BY INVITATION.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mt-12">
            <p className="font-serif text-white/80 text-2xl md:text-3xl leading-snug">
              Permanent residence on day one.{' '}
              <span className="text-white font-bold">248 invitations last quarter.</span>
            </p>
            <div className="space-y-6">
              <p className="font-sans text-white/60 text-sm leading-relaxed border-l-2 border-[#00843D] pl-5">
                No points test, no sponsor, no investment threshold — and no way in unless the
                Australian government invites you. In April–June 2026 it received 2,166 expressions
                of interest and issued 248 invitations.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#00843D] text-white px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#00843D] transition-all duration-300"
                >
                  Assess My Profile <ArrowRight size={14} />
                </Link>
                <a
                  href="#numbers"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  The Numbers <ChevronRight size={14} />
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
              { stat: 'Day 1', label: 'Permanent Residence', sub: 'no provisional stage' },
              { stat: '1 in 9', label: 'EOIs Invited', sub: 'April–June 2026 round' },
              { stat: '60', label: 'Days To Lodge', sub: 'after an invitation' },
              { stat: 'U-23', label: 'Children Included', sub: 'PR at the same time' },
            ].map((s, i) => (
              <div key={i} className="py-10 px-8 hover:bg-white/5 transition-colors text-center">
                <p className="font-serif text-5xl text-[#5cb87f] mb-2">{s.stat}</p>
                <p className="font-sans text-sm font-bold text-white mb-1">{s.label}</p>
                <p className="font-sans text-xs text-white/40">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          NOT A STARTUP VISA
      ═══════════════════════════════════════════════════════ */}
      <section className="py-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          <div className="relative h-80 lg:h-auto order-2 lg:order-1">
            <Image
              src="/fa/img/australia-2.webp"
              alt="Aerial view of Sydney's central business district, dense office towers with the harbour beyond"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F2F0E9] hidden lg:block" />
          </div>

          <div className="order-1 lg:order-2 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-20 bg-[#F2F0E9]">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#00843D] mb-6">
              First, The Misnomer
            </span>
            <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-8" style={{ letterSpacing: '-0.02em' }}>
              This Is Not A<br />
              <span className="italic">Startup Visa.</span>
            </h2>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed mb-6">
              Subclass 858 is Australia&rsquo;s <strong className="text-[#1a1a1a]">Distinguished
              Talent visa renamed</strong>, and it replaced the Global Talent programme. It is
              assessed on the individual against a standard of exceptional and outstanding
              international achievement — not on a company, a business plan or a deck.
            </p>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed mb-6">
              Two consequences follow. A founding team cannot apply together: the application is
              individual, and each co-founder needs their own record. And a founder at idea or seed
              stage does not meet the standard, however good the idea.
            </p>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed">
              There is no safety net beneath it, either. Subclass 188 — the business innovation and
              investment stream — <strong className="text-[#1a1a1a]">closed to new applications in
              2024</strong>. Australia today has no startup visa in the sense that Denmark, Finland
              and Estonia have one.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          THE NUMBERS
      ═══════════════════════════════════════════════════════ */}
      <section id="numbers" className="py-28 px-6 bg-[#0d1017] text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
            <div className="lg:col-span-5">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#5cb87f] block mb-4">
                Invitation Rounds
              </span>
              <h2 className="font-serif text-5xl md:text-6xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                The Invitation<br />
                <span className="italic text-white/40">Is The Wall.</span>
              </h2>
            </div>
            <div className="lg:col-span-7 flex items-end">
              <p className="font-sans text-white/50 text-base leading-relaxed">
                The Department publishes what each round did. These are the only figures worth
                planning against — and note the shape holds across both quarters, so this is not a
                one-off. Once you hold an invitation the visa application itself succeeds at a very
                high rate, which is exactly why quoting a grant rate without an invitation rate
                misleads.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-white/20">
                  {['Round', 'EOIs', 'Invitations', 'Priority 1', 'Priority 2', 'Priority 3', 'Priority 4'].map((h) => (
                    <th key={h} className="text-left font-sans text-xs font-bold uppercase tracking-widest text-white/40 py-4 px-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rounds.map((r) => (
                  <tr key={r.period} className="border-b border-white/10">
                    <td className="font-sans text-sm py-5 px-4 font-bold">{r.period}</td>
                    <td className="font-serif text-2xl py-5 px-4">{r.eois}</td>
                    <td className="font-serif text-2xl py-5 px-4 text-[#5cb87f]">{r.invites}</td>
                    <td className="font-sans text-sm py-5 px-4 text-white/60">{r.p1}</td>
                    <td className="font-sans text-sm py-5 px-4 text-white/60">{r.p2}</td>
                    <td className="font-sans text-sm py-5 px-4 text-white font-bold">{r.p3}</td>
                    <td className="font-sans text-sm py-5 px-4 text-white/60">{r.p4}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-16">
            <div className="border-l-2 border-[#5cb87f] pl-6">
              <h3 className="font-serif text-2xl mb-4">State nomination is the narrowest lane</h3>
              <p className="font-sans text-sm text-white/60 leading-relaxed">
                The standard advice is to chase a government nomination on Form 1000, because it
                places you in Priority 2. Read the columns again. Priority 2 drew fewer than 20
                invitations in the better of these two quarters, and 15 in the other. Priority 3 —
                exceptional achievement in a Tier 1 sector — drew 192 and 113. If your record is
                genuinely Tier 1, the direct route is where the invitations are, and six months
                spent chasing a nomination can move you out of the widest lane into the narrowest.
              </p>
            </div>
            <div className="border-l-2 border-[#5cb87f] pl-6">
              <h3 className="font-serif text-2xl mb-4">Where the 248 went</h3>
              <ul className="space-y-2">
                {sectorSplit.map((s) => (
                  <li key={s.name} className="flex items-center gap-4">
                    <span className="font-sans text-sm text-white/60 w-44 shrink-0">{s.name}</span>
                    <span className="h-2 bg-[#5cb87f]/60" style={{ width: `${(s.n / 122) * 60}%` }} />
                    <span className="font-sans text-xs text-white/40">{s.n}</span>
                  </li>
                ))}
              </ul>
              <p className="font-sans text-xs text-white/40 leading-relaxed mt-5">
                Critical technologies took almost half of one quarter&rsquo;s invitations. Outside
                the three Tier 1 sectors you are competing globally for a few dozen a quarter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PROCESS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F2F0E9]">
        <div className="container mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#00843D] block mb-4">
            Step-by-Step
          </span>
          <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-16" style={{ letterSpacing: '-0.02em' }}>
            Five Stages, And<br />
            <span className="italic text-[#1a1a1a]/40">One That Decides It.</span>
          </h2>

          <div className="space-y-px bg-[#1a1a1a]/10">
            {steps.map((s) => (
              <div key={s.num} className="bg-[#F2F0E9] p-10 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 hover:bg-white transition-colors">
                <div className="md:col-span-2 flex items-start gap-4">
                  <span className="font-serif text-4xl text-[#00843D]">{s.num}</span>
                  <s.icon className="w-6 h-6 text-[#1a1a1a]/30 mt-2" />
                </div>
                <div className="md:col-span-4">
                  <h3 className="font-serif text-3xl leading-tight">{s.title}</h3>
                </div>
                <div className="md:col-span-6">
                  <p className="font-sans text-[#1a1a1a]/60 text-sm leading-relaxed mb-4">{s.body}</p>
                  <p className="font-sans text-[#1a1a1a]/45 text-xs leading-relaxed border-l border-[#00843D]/50 pl-4">
                    {s.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          EVIDENCE
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white border-y border-[#1a1a1a]/8">
        <div className="container mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#00843D] block mb-4">
            The Standard
          </span>
          <h2 className="font-serif text-5xl leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
            &ldquo;Exceptional And<br />
            <span className="italic text-[#1a1a1a]/40">Outstanding.&rdquo;</span>
          </h2>
          <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed max-w-2xl mb-16">
            Not a strong CV — something measurable at a global scale. These are what carry weight,
            and the file is built by making them countable rather than asserting them.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#1a1a1a]/10">
            {evidence.map((c) => (
              <div key={c.title} className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-[#F2F0E9] transition-colors">
                <c.icon className="w-6 h-6 text-[#00843D] mb-6" />
                <h3 className="font-serif text-2xl mb-4">{c.title}</h3>
                <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 border-l-2 border-[#00843D] pl-6 max-w-3xl">
            <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed">
              <strong>And the condition that gets lost in every checklist: you must still be
              prominent.</strong> An achievement from a decade ago that did not continue will not
              carry the file. The assessor is asking where you stand in your field now.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          WHAT WE DO / DO NOT PROMISE
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F2F0E9]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#00843D] block mb-4">
                Our Role
              </span>
              <h2 className="font-serif text-5xl leading-tight mb-8" style={{ letterSpacing: '-0.02em' }}>
                What We Will<br />
                <span className="italic text-[#1a1a1a]/40">Not Promise.</span>
              </h2>
              <div className="relative h-64 hidden lg:block">
                <Image
                  src="/fa/img/australia-3.webp"
                  alt="A pink tram on a tree-lined Melbourne street, its destination sign lit, pedestrians on the footpath"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <p className="font-sans text-[#1a1a1a]/70 text-base leading-relaxed">
                We are not registered migration agents and we do not lodge in ImmiAccount. What we
                work on is the part that is actually movable: the strength of your evidence.
                Auditing and documenting the record; establishing which sector and priority you sit
                in; deciding honestly whether the direct route or a nomination is better for you;
                identifying nominators who really do hold a national reputation in your field;
                writing the EOI narrative so it connects to Australia&rsquo;s stated priorities. On
                the legal stage we work alongside a MARA-registered agent, not instead of one.
              </p>
              <div className="bg-white border-l-4 border-[#b45309] p-6">
                <p className="font-sans text-sm text-[#1a1a1a]/80 leading-relaxed">
                  <ShieldAlert className="w-4 h-4 inline mr-2 text-[#b45309]" />
                  <strong>There is no refund undertaking on this route, and the reason matters.</strong>{' '}
                  On our other routes an identified body evaluates the case — Business Finland, the
                  Danish expert panel, a technopark committee — and we undertake to obtain its
                  approval. Here the gate is a government invitation nobody outside the Department
                  controls, at a published rate near one in nine. An undertaking tied to that would
                  be a promise we could not keep. If anyone sells you a guaranteed invitation, or a
                  refund if the invitation does not come, walk away.
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
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#00843D] block mb-4">
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
                  <ChevronRight className="w-5 h-5 mt-1.5 shrink-0 text-[#00843D] transition-transform group-open:rotate-90" />
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
            Does your record<br />
            <span className="italic text-[#5cb87f]">actually clear it?</span>
          </h2>
          <p className="font-sans text-white/60 text-base leading-relaxed mb-12">
            That is the only question worth answering first, and it is answerable before you spend
            anything. If the honest answer is no, we would rather tell you which route does fit.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#00843D] text-white px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#00843D] transition-all duration-300"
            >
              Assess My Profile <ArrowRight size={14} />
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
