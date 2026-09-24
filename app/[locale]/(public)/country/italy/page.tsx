// ============================================================================
// Page: app/[locale]/(public)/country/italy/page.tsx
// Style: Editorial, matching /country/turkey, /country/denmark and
// /country/israel.
//
// Subject: the Italia Startup Visa — a self-employment visa in the "startup"
// category, decided by a technical committee at MIMIT on documents alone.
//
// This is the English twin of /fa/europe/italy, written in the same pass.
// Everything here comes from that guide's verification against the two
// official MIMIT guideline PDFs (the original and the 20/03/2018 revision,
// which is the operative one), so the two pages must move together.
//
// THE FACT THIS PAGE LEADS WITH: a maximum of five Certificates of No
// Impediment per startup, ten only in exceptional cases. Almost every English
// and Persian write-up of this route says there is no cap on founders. The
// guidelines say there is, in a sentence, and a six-person team deserves to
// read it before it builds a cap table.
//
// THE OTHER THING NOBODY SAYS: the published guidelines predate Law 193/2024.
// They still define a startup as "operating no longer than 4 years" and say
// nothing about the EU SME test or the consultancy exclusion. The visa
// procedure in them is current; the startup-law definition in them is not. A
// file built only on the PDF is built on something incomplete.
//
// WHAT WE DO NOT CLAIM. That the 500-place sub-quota of the 2026–2028 Flow
// Decree belongs to startup founders. It is shared with four other
// categories, among them entrepreneurs investing €500,000 and hiring three
// people. The bigger number is the one in circulation; the accurate one is
// here.
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
  Scale,
  Stamp,
} from 'lucide-react';
import type { Metadata } from 'next';
import { metaFor } from '@/lib/pageMeta';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/country/italy', locale);
}

// ─── Data ────────────────────────────────────────────────────────────────────

const steps = [
  {
    num: '01',
    title: 'Email The Committee',
    icon: FileText,
    body: 'The application form, a passport copy, a cover letter declaring at least €50,000 in available funds and the documents evidencing them, and — depending on the route — a business plan and deck, or a certified incubator’s undertaking to host you. In English or Italian.',
    note: 'There is no portal and no fee. The whole first stage is an email to italiastartupvisa@mise.gov.it.',
  },
  {
    num: '02',
    title: 'Completeness Check',
    icon: Scale,
    body: 'The programme secretariat at MIMIT checks the file is complete before the committee sees it, and asks the Questura of the city where you intend to establish the company for a provisional clearance.',
    note: 'Your city is a question on the form. "Not decided yet" stalls the file here, before anyone has read the idea.',
  },
  {
    num: '03',
    title: 'The Committee Votes',
    icon: Users,
    body: 'The technical committee — chaired by MIMIT’s Director General for Industrial Policy, with the chairs of AIFI, APSTI, IBAN, Netval and PNICube — decides by simple majority within 30 days of the complete file.',
    note: 'No interview, no call, no hearing. What you sent is what is judged.',
  },
  {
    num: '04',
    title: 'Consulate, Within Three Months',
    icon: Stamp,
    body: 'The nulla osta arrives by email. You take the originals to the Italian consulate for your region, together with proof of accommodation and last year’s income, and collect a one-year self-employment visa.',
    note: 'Three months from the date on the certificate. Miss it and the file is dead — you start again from step one.',
  },
  {
    num: '05',
    title: 'Eight Days After Landing',
    icon: Rocket,
    body: 'You have 180 days from visa issue to enter Italy, and 8 days from arrival to lodge the residence permit application at a post office: a €16 revenue stamp, a €30.46 bulletin, a €50 contribution, a full passport photocopy, two photographs and proof of accommodation. Fingerprints at the Questura follow.',
    note: 'The eight days land in the week you are least organised. Know the post-office kit before you fly.',
  },
];

const criteria = [
  {
    title: 'One Of Three Indicators',
    icon: Lightbulb,
    desc: '15% of costs on R&D; or a third of the team holding doctorates or three years of research, or two thirds holding a master’s; or a patent, or original software registered with SIAE. One is enough — but it must be evidenced, not asserted.',
  },
  {
    title: 'A CV That Fits The Plan',
    icon: Users,
    desc: 'The guidelines name an applicant whose studies and career are irrelevant to the business as a reason to refuse. A founder pivoting into a field they have never worked in is the commonest way a sound-looking file fails.',
  },
  {
    title: 'A Prior Link To Italy',
    icon: Globe,
    desc: 'Also named, and rarely quoted: the absence of any previous connection with Italy and its innovation ecosystem counts against you. A university letter, a first Italian customer, a science park, an incubator — something real.',
  },
  {
    title: 'Money To Match The Plan',
    icon: Scale,
    desc: 'The committee weighs funds against the scale of what you have promised. €50,000 is the statutory floor and, for a team, the guidelines call it "purely indicative" — the adequate figure may be considerably higher.',
  },
];

const refused = [
  'A business whose prevalent activity is consultancy',
  'Agency or brokerage work',
  'Retail and traditional services with no R&D',
  'A plan with no evidenced innovation indicator',
];

const faqs = [
  {
    q: 'Who actually decides?',
    a: 'A technical committee at the Ministry of Enterprises and Made in Italy, chaired by the Director General for Industrial Policy, Competitiveness and SMEs. Its members are the chairs of the main bodies of the Italian innovation ecosystem: AIFI’s venture capital committee, the science and technology parks association APSTI, the business angel network IBAN, the university research network Netval and the academic incubator association PNICube. They vote by simple majority. Your file is not read by an immigration officer; it is read by people whose job is assessing startups.',
  },
  {
    q: 'How much money do I have to show?',
    a: '€50,000 for a new startup — and that figure is for the whole team, not per founder. €100,000 if you are joining an existing registered innovative startup that has been operating at least three years, and that amount must come from your own resources. Separately, every applicant must evidence income in the previous year above roughly €8,400, the threshold for exemption from health-service co-payments. Funds must be liquid and readily convertible, evidenced by letters from the banks holding them or commitment letters from investors, VC funds or equity crowdfunding platforms.',
  },
  {
    q: 'How many founders can apply?',
    a: 'A maximum of five certificates per innovative startup. In exceptional circumstances, depending on the nature of the business, the committee may grant more — but never more than ten. This is in the official guidelines, and it contradicts most write-ups of the route, which say there is no limit. Every team member must be a co-founder with a self-employment relationship to the company and a share of its capital; no statutory minimum percentage applies. All the team’s applications must be sent at the same time, and anyone joining a project that has already received certificates must show a further €50,000 on top of what the original team declared.',
  },
  {
    q: 'Is there an interview?',
    a: 'Not with the committee. The assessment is entirely documentary — there is no hearing, no call, and nothing to prepare for beyond the file itself. If you go through a certified incubator, the incubator will usually run its own screening and pitch session before signing, because in that route the judgement on the business is largely deferred to it. That is the only interview on this path.',
  },
  {
    q: 'What does the incubator route change?',
    a: 'An undertaking to host, signed by a certified incubator’s legal representative, substitutes for the committee’s assessment of the business model; the committee’s certificate then mainly validates the financial resources and the legal fit. Italy gave incubators that role deliberately, to concentrate talent attraction in a limited number of hubs of proven reliability. One correction to what circulates widely: the undertaking does not exempt you from evidencing funds. The guidelines are explicit that applicants on this route still provide the financial documentation. What it does allow is that the value of the incubator’s in-kind services — space, equipment, mentoring — may be counted towards the total.',
  },
  {
    q: 'How do I find a certified incubator?',
    a: 'The official, current list is published in the dedicated section of the Business Register (Registro delle Imprese) and is downloadable from the Italia Startup Visa portal, which also carries an ecosystem map showing where incubators and innovative startups sit geographically. Certification is not nominal: an incubator must have adequate premises and equipment, a technical and management structure of recognised competence, and working relationships with universities and research centres.',
  },
  {
    q: 'What gets a file refused?',
    a: 'The guidelines name two families. Lack of innovativeness: the business model is judged to lack real technological substance, or none of the three article 25 indicators is evidenced. And a weak business plan, under which three things are listed explicitly — no previous link with Italy and its innovation ecosystem; an applicant whose studies or professional experience are irrelevant to the field; and financial resources inadequate to the scale of activity the plan promises. Irregularities in the funding documentation fall here too.',
  },
  {
    q: 'What happens if I am refused?',
    a: 'You have ten days from notification to send your observations to the committee’s email address, and the committee then has 30 days to grant or refuse definitively. If you send nothing, the refusal becomes final. You may apply again, but the committee will only consider a new file if it contains significant new elements compared with the previous one — the same application with cosmetic edits goes nowhere.',
  },
  {
    q: 'What changed under Law 193/2024?',
    a: 'Three things, in force since December 2024. An innovative startup must now meet the EU definition of a small or medium enterprise. A company whose prevalent activity is consultancy or agency work is expressly excluded — a hard exclusion that a lot of pitch decks have not caught up with. And the base period in the special section of the Business Register was shortened from five years to three, extendable to five on the conditions in article 25(2-bis), with further two-year extensions for companies that scale. Note the direction: it was shortened, not extended, which is the opposite of what is usually reported. MIMIT’s circular of 29 July 2025 set out how this is applied.',
  },
  {
    q: 'Does the quota limit me?',
    a: 'The visa is issued within the self-employment quota of the Flow Decree. The DPCM of 2 October 2025, published on 15 October, sets the 2026–2028 programming: 76,850 entries a year, of which 650 are self-employment, and within those a sub-quota of 500. That 500 is not reserved for startup founders — it is shared with entrepreneurs investing at least €500,000 and creating three jobs, regulated professionals, company directors and auditors, and renowned artists or highly qualified specialists. In practice the quota has not been the bottleneck on this route; the quality of the file is.',
  },
  {
    q: 'What happens after the first year?',
    a: 'Up to 60 days before expiry you apply to the Questura. The self-employment permit renews for a maximum of two years, and then for a further two. After five years you can apply for the EU long-term residence permit, which does not expire. Renewal requires the company’s visura camerale showing registration in the special section for innovative startups, and proof of lawful income above the health-service exemption minimum — so by then you must actually have incorporated. One condition people miss: you must not have been outside Italy for more than six continuous months.',
  },
  {
    q: 'What if the startup fails?',
    a: 'This is the least-quoted line in the guidelines and it matters: if, after renewal, the company no longer meets the article 25 requirements, the residence permit is not revoked. That is a real cushion, and more than several other routes offer. Read it precisely, though — it speaks to the position after renewal, and the first renewal still needs a registered company and sufficient income. The first year has to be worked.',
  },
  {
    q: 'I am already in Italy. Do I have to leave?',
    a: 'No. Italia Startup Hub exists for exactly this. Holders of any kind of valid residence permit — study, work, family — can convert it to a self-employment permit for an innovative startup without leaving the country, and the certificate of no impediment usually issues in around 20 days. For someone who studied in Italy it is the shortest entrepreneurial route in Europe: the language is there, and so is the link to the ecosystem whose absence the committee counts against outside applicants.',
  },
  {
    q: 'Is Italy a low-tax place to build?',
    a: 'No, and it is not sold here as one. Corporate tax (IRES) is 24%, with regional IRAP on top. What the Startup Act gives instead is real but different: exemption from stamp duty and Business Register fees, tax relief for investors putting money into innovative startups, flexible labour rules, simplified access to the SME guarantee fund for loans, and equity crowdfunding. Build the financial model on low setup and maintenance cost and access to capital, not on a low tax rate. Note also that an innovative startup may not distribute profits while it holds that status.',
  },
  {
    q: 'Why Italy rather than Finland or Estonia?',
    a: 'Three honest reasons. Market and industrial base: Italy is the EU’s second manufacturing economy, so a hardware, industrial, machinery, fashion, design or food-tech venture finds customers, suppliers and a supply chain that the small northern economies do not have. Team size: five founders per startup is more room than Denmark’s hard annual cap allows. And, for applicants from countries with thin consular coverage, Italy maintains a working embassy in more places than Denmark or Estonia do — including Tehran, where national type D applications are accepted, so there is no third-country trip for biometrics. Against that: slower local bureaucracy, mid-to-high corporate tax, and a higher funds threshold than Estonia or Finland.',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ItalyPage() {
  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a] overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[700px] flex flex-col justify-end overflow-hidden">
        <Image
          src="/fa/img/italy.webp"
          alt="Florence from above in evening light: the Ponte Vecchio over the Arno, terracotta roofs across the city and hills behind it"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/60 to-transparent" />

        <div className="relative z-10 container mx-auto px-6 pb-20">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/60 block mb-8">
            Italia Startup Visa · Decided by MIMIT in 30 days
          </span>

          <h1
            className="font-serif text-white mb-6"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85, letterSpacing: '-0.03em' }}
          >
            ITALY<br />
            <span className="italic text-[#34d17d]">FIVE SEATS.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mt-12">
            <p className="font-serif text-white/80 text-2xl md:text-3xl leading-snug">
              A committee of venture capitalists reads your file.{' '}
              <span className="text-white font-bold">And nobody interviews you.</span>
            </p>
            <div className="space-y-6">
              <p className="font-sans text-white/60 text-sm leading-relaxed border-l-2 border-[#008C45] pl-5">
                Thirty days from a complete file to a decision, free of charge, on documents alone.
                What the write-ups leave out: a hard ceiling of five certificates per startup, a
                three-month clock on the certificate, and a consultancy exclusion added in December
                2024.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#008C45] text-white px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#008C45] transition-all duration-300"
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
              { stat: '30 Days', label: 'To A Decision', sub: 'from the complete file' },
              { stat: '€50k', label: 'Funds Required', sub: 'for the whole team' },
              { stat: '5', label: 'Certificates Per Startup', sub: 'ten only exceptionally' },
              { stat: '€0', label: 'Cost Of Assessment', sub: 'the committee charges nothing' },
            ].map((s, i) => (
              <div key={i} className="py-10 px-8 hover:bg-white/5 transition-colors text-center">
                <p className="font-serif text-5xl text-[#34d17d] mb-2">{s.stat}</p>
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
              src="/fa/img/italy-2.webp"
              alt="The Porta Nuova business district in Milan: glass office towers, a curved retail building, a construction crane and people walking beside the water"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F2F0E9] hidden lg:block" />
          </div>

          <div className="order-1 lg:order-2 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-20 bg-[#F2F0E9]">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#008C45] mb-6">
              The Programme
            </span>
            <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-8" style={{ letterSpacing: '-0.02em' }}>
              Three Bodies,<br />
              <span className="italic">One Chain.</span>
            </h2>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed mb-6">
              Italy recognised the &ldquo;innovative startup&rdquo; in law in 2012 and attached a
              package of tax, funding and labour measures to it. The Italia Startup Visa is that
              law&rsquo;s immigration branch: a simplified, digitised, fast-track version of the
              ordinary self-employment visa, for people who want to found one.
            </p>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed mb-6">
              Three bodies, and none of them does another&rsquo;s job. The{' '}
              <strong className="text-[#1a1a1a]">MIMIT committee decides on the venture</strong> and
              issues the certificate of no impediment. The consulate issues the one-year visa. The
              Questura issues the residence permit after you land.
            </p>
            <p className="font-sans text-[#1a1a1a]/60 text-base leading-relaxed">
              Understand the consequence: the hardest judgement — is this genuinely an innovative
              startup — happens first, and happens on paper. The certificate is not residence. It is
              the key that turns the next lock.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          THE CAP
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#0d1017] text-white">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <p className="font-serif text-[#34d17d]" style={{ fontSize: 'clamp(6rem,14vw,11rem)', lineHeight: 0.8 }}>
              5
            </p>
          </div>
          <div className="lg:col-span-7">
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
              Certificates per startup.<br />
              <span className="italic text-white/50">Ten only exceptionally.</span>
            </h2>
            <p className="font-sans text-white/60 text-base leading-relaxed mb-4">
              Most descriptions of this route — in English and in Persian — say there is no limit on
              the number of founders. The guidelines say otherwise, in one sentence: a maximum of
              five certificates of no impediment may be issued for each innovative startup, and in
              exceptional circumstances the committee may allow more, but in no case more than ten.
            </p>
            <p className="font-sans text-white/60 text-base leading-relaxed">
              If you are six, you are redesigning the structure — better now than after the files go
              in. And every one of those five must be a genuine co-founder with a self-employment
              relationship and a share of the capital. Nobody joins as a passive investor, and
              nobody joins as an employee.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PROCESS
      ═══════════════════════════════════════════════════════ */}
      <section id="process" className="py-28 px-6 bg-[#F2F0E9]">
        <div className="container mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#008C45] block mb-4">
            Step-by-Step
          </span>
          <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-16" style={{ letterSpacing: '-0.02em' }}>
            An Email To<br />
            <span className="italic text-[#1a1a1a]/40">A Residence Card.</span>
          </h2>

          <div className="space-y-px bg-[#1a1a1a]/10">
            {steps.map((s) => (
              <div key={s.num} className="bg-[#F2F0E9] p-10 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 hover:bg-white transition-colors">
                <div className="md:col-span-2 flex items-start gap-4">
                  <span className="font-serif text-4xl text-[#008C45]">{s.num}</span>
                  <s.icon className="w-6 h-6 text-[#1a1a1a]/30 mt-2" />
                </div>
                <div className="md:col-span-4">
                  <h3 className="font-serif text-3xl leading-tight">{s.title}</h3>
                </div>
                <div className="md:col-span-6">
                  <p className="font-sans text-[#1a1a1a]/60 text-sm leading-relaxed mb-4">{s.body}</p>
                  <p className="font-sans text-[#1a1a1a]/45 text-xs leading-relaxed border-l border-[#008C45]/50 pl-4">
                    {s.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          WHAT THE COMMITTEE WANTS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white border-y border-[#1a1a1a]/8">
        <div className="container mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#008C45] block mb-4">
            The Assessment
          </span>
          <h2 className="font-serif text-5xl leading-tight mb-16" style={{ letterSpacing: '-0.02em' }}>
            What The Committee<br />
            <span className="italic text-[#1a1a1a]/40">Is Sensitive To.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#1a1a1a]/10">
            {criteria.map((c) => (
              <div key={c.title} className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-[#F2F0E9] transition-colors">
                <c.icon className="w-6 h-6 text-[#008C45] mb-6" />
                <h3 className="font-serif text-2xl mb-4">{c.title}</h3>
                <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h3 className="font-serif text-2xl mb-4">Refused on the definition</h3>
              <ul className="space-y-2">
                {refused.map((r) => (
                  <li key={r} className="font-sans text-sm text-[#1a1a1a]/60 flex items-center gap-3">
                    <span className="w-4 h-px bg-[#008C45]" aria-hidden />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-l-2 border-[#008C45] pl-6">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed">
                <strong>The guidelines on this site&rsquo;s official portal predate Law
                193/2024.</strong> They still describe a startup as one &ldquo;operating no longer
                than 4 years&rdquo;, and they carry nothing about the EU SME test or the consultancy
                exclusion. The visa procedure in them is current; the startup-law definition in them
                is not. If you build the file from the PDF alone, you have built it on something
                incomplete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          THE TWO ROUTES
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#0d1017] text-white">
        <div className="container mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#34d17d] block mb-4">
            Two Doors
          </span>
          <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
            Found One, Or<br />
            <span className="italic text-white/40">Join One.</span>
          </h2>
          <p className="font-sans text-white/50 text-base leading-relaxed max-w-2xl mb-16">
            The thresholds are not close together, and the second door is far less travelled than
            the consultancies advertising it suggest.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            <div className="bg-[#0d1017] p-10">
              <p className="font-serif text-4xl text-[#34d17d] mb-5">€50,000</p>
              <p className="font-sans text-sm text-white/60 leading-relaxed mb-4">
                To found a new innovative startup. For the whole team, not per founder, and it may
                be pooled — one founder&rsquo;s money, several founders&rsquo;, or a third-party
                investor&rsquo;s, with a single cover letter for the team.
              </p>
              <p className="font-sans text-xs text-white/40 leading-relaxed">
                For teams the guidelines call this &ldquo;purely indicative&rdquo;: the committee
                judges adequacy against the scale of the plan, and the figure it considers adequate
                may be considerably above the statutory minimum. Five founders showing exactly
                €50,000 is a weak file, not a compliant one.
              </p>
            </div>
            <div className="bg-[#0d1017] p-10">
              <p className="font-serif text-4xl text-[#34d17d] mb-5">€100,000</p>
              <p className="font-sans text-sm text-white/60 leading-relaxed mb-4">
                To join an existing innovative startup. It must be an s.r.l. or s.p.a., operating at
                least three years, registered in the special section. You take the position of
                chairman, CEO, board member or auditor, sign a Job Agreement with the company, and
                your background must match its core business.
              </p>
              <div className="border-l-2 border-[#34d17d] pl-4">
                <p className="font-sans text-xs text-white/70 leading-relaxed">
                  <ShieldAlert className="w-3.5 h-3.5 inline mr-1.5 text-[#34d17d]" />
                  <strong>The money must be your own,</strong> and the committee explicitly
                  discourages multiple applications aimed at the same company, assessing them case
                  by case even when they arrive at different times. Treat any offer of a
                  ready-made Italian startup to join with the scepticism that deserves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ALREADY IN ITALY
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white border-y border-[#1a1a1a]/8">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#008C45] block mb-4">
              Italia Startup Hub
            </span>
            <h2 className="font-serif text-5xl leading-tight mb-8" style={{ letterSpacing: '-0.02em' }}>
              If You Are<br />
              <span className="italic text-[#1a1a1a]/40">Already Here.</span>
            </h2>
            <p className="font-sans text-[#1a1a1a]/70 text-base leading-relaxed mb-5">
              A separate programme, for holders of any valid Italian residence permit — study, work,
              family. You convert it to a self-employment permit for an innovative startup without
              leaving the country and without a consulate appointment, and the certificate of no
              impediment usually issues in around twenty days.
            </p>
            <p className="font-sans text-[#1a1a1a]/70 text-base leading-relaxed">
              For someone who studied in Italy this is the shortest entrepreneurial route in Europe.
              They have the language, and they already have the thing the committee counts the
              absence of against everybody else: a link to the Italian innovation ecosystem.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="relative h-80">
              <Image
                src="/fa/img/italy-3.webp"
                alt="A crossing in central Turin on a winter morning: tram rails over stone paving, arcaded buildings and a corner palazzo"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HONESTLY
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F2F0E9]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#008C45] block mb-4">
                Honestly
              </span>
              <h2 className="font-serif text-5xl leading-tight mb-8" style={{ letterSpacing: '-0.02em' }}>
                What Italy Is<br />
                <span className="italic text-[#1a1a1a]/40">Not Good At.</span>
              </h2>
              <div className="border-l-2 border-[#008C45] pl-6">
                <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed">
                  <Building className="w-4 h-4 inline mr-2 text-[#008C45]" />
                  The committee stage is English-speaking and digital. The post office, the Questura,
                  the Chamber of Commerce and your accountant are none of those things.
                </p>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <p className="font-sans text-[#1a1a1a]/70 text-base leading-relaxed">
                <strong>It is not a low-tax jurisdiction.</strong> IRES is 24% with regional IRAP on
                top, and an innovative startup may not distribute profits while it holds that
                status. What the Startup Act gives is exemption from Business Register fees and
                stamp duty, investor tax relief, flexible labour rules, simplified loan guarantees
                and equity crowdfunding. Build the model on cheap setup and access to capital, not
                on a low rate.
              </p>
              <p className="font-sans text-[#1a1a1a]/70 text-base leading-relaxed">
                <strong>Thirty days is the decision, not the journey.</strong> That clock starts
                only on a complete file, and the commonest cause of months of delay is a file that
                never started it. The three-month life of the certificate and the eight-day deadline
                after arrival have each killed applications whose substance was fine.
              </p>
              <p className="font-sans text-[#1a1a1a]/70 text-base leading-relaxed">
                <strong>The official portal is neglected.</strong> Parts of it have not been updated
                in years and some links are broken. That is not a reason to distrust the route — the
                committee and the procedure are real and running — but it is a reason to check any
                figure you read there against the current law.
              </p>
              <p className="font-sans text-[#1a1a1a]/70 text-base leading-relaxed">
                And the strength, stated plainly: Italy is the EU&rsquo;s second manufacturing
                economy. If your venture touches hardware, machinery, industrial automation, food,
                fashion or design, the customers and the supply chain are there in a way they are
                not in a small northern market. That, and not the tax rate, is the reason to choose
                it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white border-t border-[#1a1a1a]/8">
        <div className="container mx-auto max-w-4xl">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#008C45] block mb-4">
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
                  <ChevronRight className="w-5 h-5 mt-1.5 shrink-0 text-[#008C45] transition-transform group-open:rotate-90" />
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
            Which of the three<br />
            <span className="italic text-[#34d17d]">indicators do you meet?</span>
          </h2>
          <p className="font-sans text-white/60 text-base leading-relaxed mb-12">
            That is the question this route turns on, and it is answerable in an afternoon, before
            anyone spends anything. We work on the file up to the committee&rsquo;s decision — and
            we say no when the honest answer is no.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#008C45] text-white px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#008C45] transition-all duration-300"
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
