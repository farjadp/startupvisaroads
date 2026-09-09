// ============================================================================
// Page: app/[locale]/(public)/country/turkey/page.tsx
// Style: Editorial, matching /country/denmark, /country/israel and
// /country/australia.
//
// Subject: the Türkiye Tech Visa — in force 16 September 2024, run by the
// Ministry of Industry and Technology with the Ministry of Labour, decided in
// practice by a technopark jury.
//
// This is the English twin of /fa/turkey-tech-visa, which had been Persian-
// only since it was written on 8 Sep 2026. Everything here comes from that
// guide's verification pass, so the two must move together — above all the
// intake number and the local-hiring caveat.
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
//
// NO LIRA FIGURES IN PROSE. Turkish inflation moves them between reviews and
// last year's number is worse than no number. The one lira amount on the page
// is the statutory 500,000 capital condition, which is a rule rather than a
// cost. Same rule as the Persian guide.
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
  Rocket,
  Home,
  Scale,
} from 'lucide-react';
import type { Metadata } from 'next';
import { metaFor } from '@/lib/pageMeta';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/country/turkey', locale);
}

// ─── Data ────────────────────────────────────────────────────────────────────

const steps = [
  {
    num: '01',
    title: 'File On The Portal',
    icon: FileText,
    body: 'Register at turkiyetechvisa.gov.tr with your personal details, CV and business plan. The Ministry of Industry and Technology checks only that the file is complete.',
    note: 'The Ministry is the gateway, not the judge. This step decides nothing about your idea.',
  },
  {
    num: '02',
    title: 'Referral To A Technopark',
    icon: Building,
    body: 'The system refers your file to one of Türkiye’s accredited technoparks for the substantive assessment. There are more than a hundred of them.',
    note: 'You do not choose the technopark; the portal routes the file.',
  },
  {
    num: '03',
    title: 'The Jury Decides',
    icon: Users,
    body: 'A technopark jury of industry specialists and university academics assesses technological innovation, scalability and R&D capacity. There may be a virtual or in-person interview.',
    note: 'This is the only real gate on the route. No intermediary controls this vote — treat a guaranteed approval as a warning sign.',
  },
  {
    num: '04',
    title: 'Certificate, Then Work Permit',
    icon: Rocket,
    body: 'On a positive score the Ministry issues the Tech Visa certificate without re-assessing, and the file passes to the Ministry of Labour for a work permit of up to three years.',
    note: 'Three years is the longest first permit of any route on this site. Denmark gives two; the Netherlands twelve months.',
  },
  {
    num: '05',
    title: 'Incorporate And Settle',
    icon: Home,
    body: 'Enter Türkiye, register a new Turkish company, complete the notary work, and collect residence cards. Three to six months end to end when nothing goes wrong.',
    note: 'Your existing company abroad does not transfer. You incorporate fresh, and its shareholding need not mirror the old one.',
  },
];

const criteria = [
  {
    title: 'Technological Innovation',
    icon: Lightbulb,
    desc: 'Technology-based, software development, or genuine technological novelty — with commercialisation potential and global scalability.',
  },
  {
    title: 'R&D Capacity',
    icon: Scale,
    desc: 'Evidence you can actually run the research and development, not only describe it. Portfolio, CV and track record in the field.',
  },
  {
    title: 'What Türkiye Gains',
    icon: Globe,
    desc: 'A question the European routes ask less directly: what does your startup add to Türkiye’s workforce, economy and technology ecosystem? It has to be written into the plan.',
  },
  {
    title: 'A Defensible Team',
    icon: Users,
    desc: 'Every member’s role must be specialist and defensible. Padding a team with unrelated people is what sinks otherwise sound files.',
  },
];

const rejected = [
  'A simple online shop',
  'Ordinary import and export',
  'A digital marketing agency',
  'Traditional service businesses generally',
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

// ─── Component ───────────────────────────────────────────────────────────────

export default function TurkeyPage() {
  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a] overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[700px] flex flex-col justify-end overflow-hidden">
        <Image
          src="/fa/img/turkey.webp"
          alt="The Bosphorus shore in Istanbul in evening light, restaurants and low buildings by the water with the glass towers of the business district behind"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/60 to-transparent" />

        <div className="relative z-10 container mx-auto px-6 pb-20">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/60 block mb-8">
            Türkiye Tech Visa · In force 16 September 2024
          </span>

          <h1
            className="font-serif text-white mb-6"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85, letterSpacing: '-0.03em' }}
          >
            TÜRKIYE<br />
            <span className="italic text-[#E30A17]">THREE YEARS.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mt-12">
            <p className="font-serif text-white/80 text-2xl md:text-3xl leading-snug">
              The longest first permit on this site.{' '}
              <span className="text-white font-bold">And 22 startups in 18 months.</span>
            </p>
            <div className="space-y-6">
              <p className="font-sans text-white/60 text-sm leading-relaxed border-l-2 border-[#E30A17] pl-5">
                The Ministry is the gateway, not the judge — a technopark jury decides, and it is
                strict about technological innovation and R&D. The route is open. It is also narrow,
                and you should know that before you spend a year on it.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#E30A17] text-white px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#E30A17] transition-all duration-300"
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

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#F2F0E9] z-10" />
      </section>

      {/* ═══════════════════════════════════════════════════════
          KEY STATS
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#0a0e1a] text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { stat: '3 Yrs', label: 'Work Permit', sub: 'longest first permit here' },
              { stat: '22', label: 'Startups Admitted', sub: 'Sep 2024 – Mar 2026' },
              { stat: '20%', label: 'Minimum Shareholding', sub: 'per foreign partner' },
              { stat: '100+', label: 'Technoparks', sub: 'one of them judges you' },
            ].map((s, i) => (
              <div key={i} className="py-10 px-8 hover:bg-white/5 transition-colors text-center">
                <p className="font-serif text-5xl text-[#ff5a63] mb-2">{s.stat}</p>
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
              src="/fa/img/turkey-2.webp"
              alt="The Istanbul skyline: glass office towers flying Turkish flags above dense low-rise housing with red tiled roofs"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F2F0E9] hidden lg:block" />
          </div>

          <div className="order-1 lg:order-2 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-20 bg-[#F2F0E9]">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E30A17] mb-6">
              The Programme
            </span>
            <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-8" style={{ letterSpacing: '-0.02em' }}>
              The Ministry Is<br />
              <span className="italic">The Gateway.</span>
            </h2>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed mb-6">
              A government programme in force since 16 September 2024, run by the Ministry of
              Industry and Technology with the Ministry of Labour and Social Security. It targets
              two groups: specialists with critical technology expertise, and startups with an
              innovative business model doing technology-led work.
            </p>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed mb-6">
              Understand the decision chain, because this is where most descriptions go wrong. The
              Ministry checks completeness. The portal refers your file to an accredited{' '}
              <strong className="text-[#1a1a1a]">technopark, whose jury decides</strong> — industry
              specialists and university academics. On a positive score the Ministry issues the
              certificate without re-assessing.
            </p>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed">
              The output is a work permit of up to three years and access to a network of more than
              a hundred technoparks.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          THE NUMBER
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#0d1017] text-white">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <p className="font-serif text-[#ff5a63]" style={{ fontSize: 'clamp(6rem,14vw,11rem)', lineHeight: 0.8 }}>
              22
            </p>
          </div>
          <div className="lg:col-span-7">
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
              Foreign startups admitted<br />
              <span className="italic text-white/50">in eighteen months.</span>
            </h2>
            <p className="font-sans text-white/60 text-base leading-relaxed mb-4">
              Between 16 September 2024, when the programme came into force, and 3 March 2026.
              Nobody is hiding this figure — it comes from Türkiye&rsquo;s own ecosystem reporting.
            </p>
            <p className="font-sans text-white/60 text-base leading-relaxed">
              It does not mean the route is closed. It means the programme is young and small, and
              that you should go with a real file rather than a hopeful one. If someone is selling
              this as a busy motorway, or offering a guaranteed approval, they have not looked at
              this number — the decision belongs to a technopark jury, and no intermediary controls
              its vote.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PROCESS
      ═══════════════════════════════════════════════════════ */}
      <section id="process" className="py-28 px-6 bg-[#F2F0E9]">
        <div className="container mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E30A17] block mb-4">
            Step-by-Step
          </span>
          <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-16" style={{ letterSpacing: '-0.02em' }}>
            Portal To<br />
            <span className="italic text-[#1a1a1a]/40">Residence Card.</span>
          </h2>

          <div className="space-y-px bg-[#1a1a1a]/10">
            {steps.map((s) => (
              <div key={s.num} className="bg-[#F2F0E9] p-10 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 hover:bg-white transition-colors">
                <div className="md:col-span-2 flex items-start gap-4">
                  <span className="font-serif text-4xl text-[#E30A17]">{s.num}</span>
                  <s.icon className="w-6 h-6 text-[#1a1a1a]/30 mt-2" />
                </div>
                <div className="md:col-span-4">
                  <h3 className="font-serif text-3xl leading-tight">{s.title}</h3>
                </div>
                <div className="md:col-span-6">
                  <p className="font-sans text-[#1a1a1a]/60 text-sm leading-relaxed mb-4">{s.body}</p>
                  <p className="font-sans text-[#1a1a1a]/45 text-xs leading-relaxed border-l border-[#E30A17]/50 pl-4">
                    {s.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          WHAT THE JURY WANTS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white border-y border-[#1a1a1a]/8">
        <div className="container mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E30A17] block mb-4">
            The Assessment
          </span>
          <h2 className="font-serif text-5xl leading-tight mb-16" style={{ letterSpacing: '-0.02em' }}>
            What The Jury<br />
            <span className="italic text-[#1a1a1a]/40">Is Sensitive To.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#1a1a1a]/10">
            {criteria.map((c) => (
              <div key={c.title} className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-[#F2F0E9] transition-colors">
                <c.icon className="w-6 h-6 text-[#E30A17] mb-6" />
                <h3 className="font-serif text-2xl mb-4">{c.title}</h3>
                <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h3 className="font-serif text-2xl mb-4">Set aside at assessment</h3>
              <ul className="space-y-2">
                {rejected.map((r) => (
                  <li key={r} className="font-sans text-sm text-[#1a1a1a]/60 flex items-center gap-3">
                    <span className="w-4 h-px bg-[#E30A17]" aria-hidden />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-l-2 border-[#E30A17] pl-6">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed">
                <strong>A warning that comes from practice on this route:</strong> padding the team
                with unrelated people — older family members, or generic roles like &ldquo;social
                media manager&rdquo; — raises jury scrutiny and endangers the whole file. If you
                cannot explain in a paragraph why a person is necessary to this startup, their
                presence weakens you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          THE TWO RULES
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#0d1017] text-white">
        <div className="container mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#ff5a63] block mb-4">
            The General Rules
          </span>
          <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
            Two Conditions That<br />
            <span className="italic text-white/40">Make Or Break The Team.</span>
          </h2>
          <p className="font-sans text-white/50 text-base leading-relaxed max-w-2xl mb-16">
            Neither belongs to the programme. Both are the general Turkish work-permit rules for a
            foreign company partner, which is exactly why founders meet them late.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            <div className="bg-[#0d1017] p-10">
              <p className="font-serif text-4xl text-[#ff5a63] mb-5">20% · TRY 500,000</p>
              <p className="font-sans text-sm text-white/60 leading-relaxed mb-4">
                Every foreign partner must hold at least 20% of the shares and contribute at least
                TRY 500,000 of capital. One exception: the criteria do not apply where the
                individual&rsquo;s capital share is USD 100,000 or more.
              </p>
              <p className="font-sans text-xs text-white/40 leading-relaxed">
                This is not the minimum company registration capital, which is lower. Equal splits
                are not required — three co-founders at roughly a third each clear 20% comfortably,
                and the rule itself caps a foreign founding team at five.
              </p>
            </div>
            <div className="bg-[#0d1017] p-10">
              <p className="font-serif text-4xl text-[#ff5a63] mb-5">5 : 1</p>
              <p className="font-sans text-sm text-white/60 leading-relaxed mb-4">
                The general rule in Turkish labour law is five Turkish citizens employed per foreign
                employee, from the seventh month. Programme write-ups say Tech Visa startups are
                exempt, and technopark companies are in practice assessed more flexibly.
              </p>
              <div className="border-l-2 border-[#ff5a63] pl-4">
                <p className="font-sans text-xs text-white/70 leading-relaxed">
                  <ShieldAlert className="w-3.5 h-3.5 inline mr-1.5 text-[#ff5a63]" />
                  <strong>We could not find explicit official text granting a blanket
                  exemption.</strong> For three foreign founders, &ldquo;exempt&rdquo; against
                  &ldquo;treated flexibly&rdquo; is zero hires against fifteen — and you find out in
                  month seven. Get this in writing from the technopark or the Ministry of Labour
                  before you commit money.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          WHERE IT LEADS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F2F0E9]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E30A17] block mb-4">
                Honestly
              </span>
              <h2 className="font-serif text-5xl leading-tight mb-8" style={{ letterSpacing: '-0.02em' }}>
                Where This<br />
                <span className="italic text-[#1a1a1a]/40">Does Not Lead.</span>
              </h2>
              <div className="relative h-64 hidden lg:block">
                <Image
                  src="/fa/img/turkey-3.webp"
                  alt="A passenger ferry at an Istanbul pier on a rainy evening, commuters disembarking and a queue waiting under umbrellas"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <p className="font-sans text-[#1a1a1a]/70 text-base leading-relaxed">
                <strong>This route does not reach EU membership or a European passport.</strong> If
                Europe is your horizon, Türkiye is not your destination, and Denmark or Estonia is
                the page you want. We would rather say that here than after you have signed.
              </p>
              <p className="font-sans text-[#1a1a1a]/70 text-base leading-relaxed">
                If your horizon is building a real business on sane time and cost, it is the most
                serious option on that list. Three years of permit, over a hundred technoparks, and
                a cost of living well below Western Europe.
              </p>
              <p className="font-sans text-[#1a1a1a]/70 text-base leading-relaxed">
                Two more things to plan around. An inflationary economy means a lira budget needs
                rewriting every few months — set long-term planning in euros or dollars and keep
                lira only for day-to-day payments. And opening a corporate bank account as a
                foreign national takes time; assume it for the first months rather than hoping.
              </p>
              <div className="bg-white border-l-4 border-[#E30A17] p-6">
                <p className="font-sans text-sm text-[#1a1a1a]/80 leading-relaxed">
                  We deliberately publish no lira figures for fees and running costs. Turkish
                  inflation moves them month to month, and last year&rsquo;s number is worse than no
                  number — you budget against it and come up short. The structure is on this page;
                  the day&rsquo;s estimate belongs in a conversation.
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
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E30A17] block mb-4">
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
                  <ChevronRight className="w-5 h-5 mt-1.5 shrink-0 text-[#E30A17] transition-transform group-open:rotate-90" />
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
            Would a jury call<br />
            <span className="italic text-[#ff5a63]">this innovative?</span>
          </h2>
          <p className="font-sans text-white/60 text-base leading-relaxed mb-12">
            That is the question the route turns on, and it is answerable before you spend anything.
            We work on the file up to the technopark decision — and we say no when the honest answer
            is no.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#E30A17] text-white px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#E30A17] transition-all duration-300"
            >
              Assess My Startup <ArrowRight size={14} />
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
