// ============================================================================
// Page: /high-impact-startup-pilot — /en here; /fa renders
// content/fa/high-impact-startup-pilot.ts through ./_fa.tsx, the RTL twin of
// this file (paired for hreflang).
//
// Canada's announced replacement for the paused Start-up Visa. Visual identity
// is the Canada Start-up Visa family's own (startup-visa-canada/_shared):
// paper body, ink type, Canadian red, deep-red hero, the Canadian flag.
//
// THE DESIGN IDEA: a file with blanks. Almost everything about this pilot is
// unpublished, so the page is built like a dossier whose fields are either
// filled in ink with a source, or left as an empty ruled line. Three states,
// three forms, no badges:
//   filled   — ink text + the canada.ca link it came from
//   reported — an acid highlight: trade press or think-tank, not IRCC
//   blank    — a dotted rule and the words "not published"
// Each fact is stated ONCE. The quotes section is the evidence, the file is
// the record, the timeline is the history, "why 2027" is our one opinion and
// is marked as such. If IRCC publishes criteria, fill the blank and cite the
// page; never fill a blank with a plausible number.
//
// Sources read 2026-11-05 (SOURCES below). "2027" is NOT in any document we
// could open: IRCC's 19 Dec 2025 notice said details would follow "in 2026".
//
// Photographs: public/fa/img/high-impact{,-2,-3}.webp, Pexels, credited in
// credits.json: the Peace Tower (the decision sits in Ottawa), the Toronto
// and Vancouver skylines (where the old programme's admissions concentrated).
// Motion: ./_motion.tsx plus the fa/motion primitives; nothing moves under
// reduced motion and no content depends on an animation.
//
// SEO / AEO / GEO: one H1; a 45-word answer block first (data-speakable);
// definition paragraph; the file is a real <table> with caption and scopes;
// dated timeline with <time>; FAQ mirrors FAQPage JSON-LD word for word;
// WebPage + BreadcrumbList + FAQPage JSON-LD with dateModified, author and
// citations; every claim attributed where it is made.
// ============================================================================
import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from '@/routing';
import JsonLd from '@/components/JsonLd';
import Flag from '@/components/route/flags';
import { MAIN_CONTACT } from '@/content/contact';
import { FOUNDER_ID, SITE_URL, breadcrumbJsonLd, buildMetadata, faqJsonLd, webPageJsonLd } from '@/lib/seo';
import HighImpactFa from './_fa';
import { page as fa } from '@/content/fa/high-impact-startup-pilot';
import { faMeta } from '@/lib/fa/content';
import { SUV_ORGS, SUV_RULES, SUV_SOURCES, SUV_STATE, SUV_UNOFFICIAL } from '@/lib/canada-suv';
import { FaqList, SourcesSection, label, type SourceItem } from '../startup-visa-canada/_shared/suv-guide';
import HeroImage from '@/components/fa/motion/HeroImage';
import Parallax from '@/components/fa/motion/Parallax';
import Reveal from '@/components/fa/motion/Reveal';
import ScrollProgress from '@/components/fa/motion/ScrollProgress';
import { Count, FileTable, RiseWords, Stagger, Stamp, TimelineDraw, type FileRow, type TimelineItem } from './_motion';

const PATH = '/high-impact-startup-pilot';
const CHECKED = { iso: '2026-11-05', label: '5 Nov 2026' };
const PAUSED_LABEL = new Date(SUV_STATE.pausedOn).toLocaleDateString('en-CA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const META = {
  path: PATH,
  title: 'High Impact Start-up Pilot Canada: What We Know',
  description:
    'IRCC plans a High Impact Start-up Pilot to replace the paused Start-up Visa. What is official, what is only reported, what is unpublished. Updated 5 Nov 2026.',
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'fa') return buildMetadata(faMeta(fa, locale));
  if (locale !== 'en') return {};
  return buildMetadata({ ...META, locale, modifiedTime: `${CHECKED.iso}T12:00:00Z` });
}

// ─── Sources ────────────────────────────────────────────────────────────────

const SRC = {
  notice: 'https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/immigration-measures-entrepreneurs.html',
  binder: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/transparency/transition-binders/deputy-minister-2026/economic-immigration.html',
  gazette: 'https://gazette.gc.ca/rp-pr/p1/2025/2025-12-20/html/index-eng.html',
  assessing:
    'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/permanent-residence/economic-classes/start-business/assessing-application.html',
  about: SUV_SOURCES.about,
  press: 'https://immigration.ca/canada-plans-high-impact-start-up-visa-pilot-after-pausing-existing-program/',
  rbc: 'https://www.rbc.com/en/thought-leadership/wp-content/uploads/sites/27/2026/09/A-Smarter-Immigration-Strategy-Report-EN.pdf',
} as const;

function Src({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-0.5 font-bold underline underline-offset-2 ${light ? 'decoration-[#FF8F85] hover:text-[#FF8F85]' : 'decoration-[#D52B1E] hover:text-[#B01C12]'}`}
    >
      {children} <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
    </a>
  );
}

// ─── The three forms a fact can take ────────────────────────────────────────

/** Trade press or think-tank: highlighted, never in ink alone. */
function Reported({ children }: { children: React.ReactNode }) {
  return (
    <mark className="bg-[#CCFF00] px-1 py-0.5 text-[#1a1a1a] [box-decoration-break:clone]">
      {children} <span className="font-sans text-[10px] font-bold uppercase tracking-[0.16em]">· reported</span>
    </mark>
  );
}

/** The maple leaf from the official flag's construction sheet, on its own. */
function MapleLeaf({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="3000 150 3600 4400" className={className} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M4890 4430l-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z"
      />
    </svg>
  );
}

// ─── Content ─────────────────────────────────────────────────────────────────

/** Verbatim. These three lines are the whole official record of the pilot. */
const QUOTES: { text: string; who: string; when: string; href: string; official: boolean }[] = [
  {
    text: 'a new, targeted pilot program for immigrant entrepreneurs',
    who: 'IRCC notice, immigration measures for entrepreneurs',
    when: '19 December 2025',
    href: SRC.notice,
    official: true,
  },
  {
    text: 'launch of a new High Impact Start-up Pilot to replace the Start-Up Visa Program',
    who: 'IRCC, Deputy Minister transition binder, economic immigration',
    when: '2026',
    href: SRC.binder,
    official: true,
  },
  {
    text: 'elite entrepreneurs',
    who: 'IRCC 2026–27 Departmental Plan, as quoted by immigration.ca',
    when: 'March 2026',
    href: SRC.press,
    official: false,
  },
];

const FILE: FileRow[] = [
  { field: 'Status', old: { kind: 'filled', text: `Paused since ${PAUSED_LABEL}`, href: SRC.about }, pilot: { kind: 'filled', text: 'Announced. Not open', href: SRC.binder } },
  { field: 'Opens', old: { kind: 'filled', text: 'Closed to new applications' }, pilot: { kind: 'blank' } },
  { field: 'Who qualifies', old: { kind: 'filled', text: 'Founders with a qualifying business and a commitment certificate', href: SRC.assessing }, pilot: { kind: 'blank' } },
  { field: 'Who backs the founder', old: { kind: 'filled', text: 'A designated organization: venture fund, angel group or incubator', href: SRC.assessing }, pilot: { kind: 'blank' } },
  { field: 'Minimum committed capital', old: { kind: 'filled', text: `CAD $${SUV_ORGS.ventureCapitalMinimum.toLocaleString('en-CA')} from a venture fund, or $${SUV_ORGS.angelMinimum.toLocaleString('en-CA')} from an angel group`, href: SRC.assessing }, pilot: { kind: 'blank' } },
  { field: 'Language', old: { kind: 'filled', text: `CLB ${SUV_RULES.language.benchmark} in all four skills`, href: SRC.assessing }, pilot: { kind: 'blank' } },
  { field: 'Intake', old: { kind: 'reported', text: 'About 5,605 admissions in 2024', href: SRC.press }, pilot: { kind: 'reported', text: `About ${SUV_UNOFFICIAL.reportedOnly.annualCap.toLocaleString('en-CA')} a year`, href: SRC.press } },
  { field: 'Processing', old: { kind: 'blank' }, pilot: { kind: 'reported', text: `${SUV_UNOFFICIAL.reportedOnly.processingTargetMonths}-month target` } },
];

const PILOT_FILLED = FILE.filter((r) => r.pilot.kind === 'filled').length;

const TIMELINE: TimelineItem[] = [
  { when: '19 Dec 2025', iso: '2025-12-19', what: 'IRCC stops new Start-up Visa work permit applications and announces a targeted pilot for immigrant entrepreneurs to follow.' },
  { when: '20 Dec 2025', iso: '2025-12-20', what: 'New Ministerial Instructions on the Start-up Business Class and the Self-employed Persons Class appear in the Canada Gazette.' },
  { when: '31 Dec 2025', iso: '2025-12-31', what: 'Designated organizations stop issuing commitment certificates for new applications.' },
  { when: '30 Jun 2026', iso: '2026-06-30', what: 'IRCC’s pause date: the last day to file with a valid 2025 certificate.' },
  { when: '2026', iso: '2026', what: 'IRCC’s transition binder names the “High Impact Start-up Pilot”, with no date or criteria.' },
  { when: '2027', iso: '2027', ours: true, what: 'Our expectation for the launch. Not an IRCC date.' },
];

const BEFORE: { title: string; body: string }[] = [
  { title: 'Evidence of traction, kept dated', body: 'Revenue, signed customers, usage and product milestones, each with a date and a source. “Measurable economic impact” is the only test IRCC has hinted at, and any version of it will ask for proof.' },
  { title: 'A clean cap table and a real company', body: 'Clear ownership, founder agreements, IP assigned to the company, funds you can trace. The old programme turned on structure as often as on the idea.' },
  { title: 'Language results that will not expire', body: 'The Start-up Visa needed CLB 5 in all four skills from a test taken less than two years before filing. Expect the pilot to ask at least that, and time the test to the opening, not before it.' },
  { title: 'A plan that does not depend on one door', body: 'Nothing here is certain until IRCC publishes. Founders who must move this year should compare the routes open today and treat the pilot as upside.' },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: 'What is the High Impact Start-up Pilot?',
    a: 'It is the pilot IRCC has announced to replace the Start-up Visa Program, which stopped taking new applications in 2026. IRCC’s 2026 transition binder calls it the “High Impact Start-up Pilot”. IRCC has not published its criteria, intake or opening date.',
  },
  {
    q: 'When will the High Impact Start-up Pilot launch?',
    a: 'IRCC has not announced a launch date. Its December 2025 notice said more information would follow in 2026, and none has been published as of 5 November 2026. VisaRoads expects a 2027 launch; that is our inference, not an IRCC statement.',
  },
  {
    q: 'Is the High Impact Start-up Pilot the same as the Start-up Visa?',
    a: 'No. It is the announced replacement. IRCC says the pilot will replace the Start-up Visa Program and address problems observed in it. The old programme is paused, not renamed.',
  },
  {
    q: 'Is “High Impact” the official name?',
    a: 'It appears as “High Impact Start-up Pilot” in IRCC’s 2026 transition binder. The 2026–27 Departmental Plan, as quoted by the trade press, says “new high impact Start-Up Visa pilot”. IRCC has not announced a final name.',
  },
  {
    q: 'Can I apply for the High Impact Start-up Pilot now?',
    a: 'No. There is nothing to file under the pilot, and the Start-up Visa is paused. No one can reserve a place, so do not pay anyone for a pilot slot.',
  },
  {
    q: 'Will my Start-up Visa commitment certificate work for the pilot?',
    a: 'Unknown. IRCC has not said whether commitment certificates or any part of the old process carry over.',
  },
  {
    q: 'How many people will the pilot admit?',
    a: 'IRCC has published no figure for the pilot. The official 2026 admissions target for all federal business programs combined is 500. A cap of about 2,000 a year circulates in trade press and is not an IRCC number.',
  },
  {
    q: 'What should founders do while waiting for the pilot?',
    a: 'Keep dated evidence of traction, keep ownership and IP clean, plan the language test for the opening rather than before it, and compare the routes that are open today. Nothing can be reserved in advance.',
  },
];

const SOURCE_LIST: SourceItem[] = [
  { name: 'IRCC: measures for entrepreneurs (19 Dec 2025)', href: SRC.notice, what: 'The notice that closed the Start-up Visa to new applications and promised a targeted pilot.', checked: CHECKED.label },
  { name: 'IRCC: Deputy Minister transition binder 2026, economic immigration', href: SRC.binder, what: 'Names the “High Impact Start-up Pilot”; business programs target of 500 for 2026.', checked: CHECKED.label },
  { name: 'IRCC: Start-up Visa Program', href: SRC.about, what: 'Programme status: paused; backlog reason.', checked: CHECKED.label },
  { name: 'IRCC: Start-up Business Class, assessing the application', href: SRC.assessing, what: 'The old programme’s capital minimums, language level and commitment-certificate rules.', checked: CHECKED.label },
  { name: 'Canada Gazette Part I, 20 Dec 2025', href: SRC.gazette, what: 'Index entry for the new Ministerial Instructions (title only).', checked: CHECKED.label },
  { name: 'immigration.ca (trade press, March 2026)', href: SRC.press, what: 'Quotes the 2026–27 Departmental Plan; analysis is the author’s, not IRCC’s.', checked: CHECKED.label },
  { name: 'RBC Thought Leadership, A Smarter Immigration Strategy (Sept 2026)', href: SRC.rbc, what: 'A think-tank suggestion to pilot a temporary entrepreneurship pathway. A recommendation, not policy.', checked: CHECKED.label },
];

export default async function HighImpactStartupPilotPage({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'fa') notFound();
  setRequestLocale(locale);
  if (locale === 'fa') return <HighImpactFa />;

  const url = `${SITE_URL}/en${PATH}`;
  const jsonLd = [
    {
      ...webPageJsonLd({ title: META.title, description: META.description, url, locale: 'en' }),
      dateModified: CHECKED.iso,
      author: { '@id': FOUNDER_ID },
      citation: SOURCE_LIST.map((s) => s.href),
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['[data-speakable]'] },
    },
    breadcrumbJsonLd([
      { name: 'Home', url: `${SITE_URL}/en` },
      { name: 'Canada Start-up Visa', url: `${SITE_URL}/en/startup-visa-canada` },
      { name: 'High Impact Start-up Pilot', url },
    ]),
    faqJsonLd(FAQS.map((f) => ({ question: f.q, answer: f.a })), 'en'),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <ScrollProgress />
      <div className="w-full bg-[#F2F0E9] text-[#1a1a1a]">
        {/* ===== HERO ===== */}
        <header className="relative overflow-hidden bg-[#2A0C0A] text-white">
          <div className="absolute inset-0">
            <HeroImage
              src="/fa/img/high-impact.webp"
              alt="The Peace Tower of Canada’s Parliament in Ottawa, the Canadian flag flying from its spire against a blue sky"
              sizes="100vw"
              className="h-full w-full"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A0C0A] via-[#2A0C0A]/85 to-[#2A0C0A]/15" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#2A0C0A] to-transparent" />

          <div className="container relative mx-auto px-6 pb-16 pt-8 lg:pb-20">
            <nav aria-label="Breadcrumb" className="font-sans text-xs text-white/65">
              <ol className="flex flex-wrap gap-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link href="/startup-visa-canada" className="hover:text-white">Canada Start-up Visa</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-white/85">High Impact Start-up Pilot</li>
              </ol>
            </nav>

            <div className="mt-10 max-w-3xl">
              <div className={`mb-5 flex flex-wrap items-center gap-3 text-white/80 ${label}`}>
                <Flag code="ca" uid="hip-hero" width={44} />
                Canada · Government of Canada pilot
                <Stamp className="inline-flex items-center rounded-full border-2 border-[#D52B1E] bg-[#D52B1E]/90 px-3 py-1 text-[11px] tracking-[0.14em] text-white">
                  Announced · not yet open
                </Stamp>
              </div>

              <h1>
                <span className="block font-serif text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.02em]">
                  High Impact <br />Start-up Pilot
                </span>
                <span className="mt-4 block max-w-[46ch] font-sans text-lg font-medium leading-snug">
                  Canada’s announced replacement for the paused Start-up Visa.
                </span>
              </h1>

              <p data-speakable className="mt-4 max-w-[60ch] font-sans text-base leading-relaxed text-white/80">
                IRCC has announced a High Impact Start-up Pilot to replace the Start-up Visa, which is paused. It has published no criteria, no intake and no opening date. We expect a 2027 launch. That is our expectation, not an announcement.
              </p>

              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-white/65">
                <span>By <span className="text-white">Farjad P.D</span></span>
                <span>Updated <time dateTime={CHECKED.iso} className="text-white">{CHECKED.label}</time></span>
                <span>Checked against IRCC and the Canada Gazette</span>
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#file" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D52B1E] px-6 py-3.5 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
                  Open the file <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <Link href="/book-meeting" className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3.5 font-sans text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#1a1a1a]">
                  Book a free session
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* ===== IN IRCC'S OWN WORDS ===== */}
        <section aria-labelledby="words-h" className="border-b border-[#1a1a1a]/10 bg-white px-6 py-16 lg:py-20">
          <div className="container mx-auto">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              <div>
                <p className={`text-[#B01C12] ${label}`}>The whole official record</p>
                <h2 id="words-h" className="mt-2 font-serif text-4xl leading-tight">What IRCC has actually said</h2>
                <p className="mt-4 max-w-[40ch] font-sans text-[15px] leading-relaxed text-[#1a1a1a]/75">
                  The High Impact Start-up Pilot is the programme IRCC plans to run in place of the Canada Start-up Visa, which gave permanent residence to founders backed by a designated venture fund, angel group or incubator. Everything the government has published about the pilot fits in three lines. The third is second-hand.
                </p>
              </div>

              <ol className="divide-y divide-[#1a1a1a]/10 border-y border-[#1a1a1a]/10">
                {QUOTES.map((q, i) => (
                  <li key={q.href + i} className="grid gap-3 py-8 md:grid-cols-[3rem_minmax(0,1fr)] md:gap-6">
                    <span className="font-serif text-3xl text-[#D52B1E]" aria-hidden="true">{i + 1}</span>
                    <div>
                      <blockquote className="font-serif text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.15]">
                        “{q.official ? <RiseWords text={q.text} delay={i * 0.15} /> : <Reported><RiseWords text={q.text} delay={i * 0.15} /></Reported>}”
                      </blockquote>
                      <p className="mt-3 font-sans text-sm text-[#1a1a1a]/70">
                        <Src href={q.href}>{q.who}</Src>, {q.when}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ===== FIGURE: Toronto ===== */}
        <figure className="relative border-b border-[#1a1a1a]/10 bg-[#1a1a1a]">
          <Parallax distance={40} className="h-[46vw] max-h-[560px] min-h-[260px]">
            <Image
              src="/fa/img/high-impact-2.webp"
              alt="The Toronto skyline across the lake, the CN Tower in the centre, on a clear day"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </Parallax>
          <figcaption className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-6 py-4 font-sans text-xs text-white/70">
            <span>Toronto. With Vancouver, where most of the old programme’s admissions settled, by the trade press’s count.</span>
            <span className="flex items-center gap-2"><Flag code="ca" uid="hip-fig" width={28} /> Ontario, Canada</span>
          </figcaption>
        </figure>

        {/* ===== THE FILE ===== */}
        <section id="file" aria-labelledby="file-h" className="scroll-mt-24 border-b border-[#1a1a1a]/10 px-6 py-16 lg:py-20">
          <div className="container mx-auto">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className={`text-[#B01C12] ${label}`}>The file</p>
                <h2 id="file-h" className="mt-2 max-w-3xl font-serif text-4xl leading-tight">Old programme, new pilot, field by field</h2>
              </div>
              <p className="font-serif text-2xl leading-tight">
                <Count to={PILOT_FILLED} className="text-[#D52B1E]" /> of {FILE.length} pilot fields filled
              </p>
            </div>

            <div className="mt-8">
              <FileTable rows={FILE} oldTitle="Start-up Visa" pilotTitle="High Impact Start-up Pilot" />
            </div>

            <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-sans text-xs text-[#1a1a1a]/70">
              <div className="flex items-center gap-2"><dt className="font-bold text-[#1a1a1a]">Ink</dt><dd>stated by IRCC, linked to the page.</dd></div>
              <div className="flex items-center gap-2"><dt><mark className="bg-[#CCFF00] px-1 font-bold text-[#1a1a1a]">Highlight</mark></dt><dd>trade press or think-tank, not IRCC.</dd></div>
              <div className="flex items-center gap-2"><dt className="font-bold text-[#B01C12]">Dotted line</dt><dd>nothing published. We do not fill it in.</dd></div>
            </dl>
          </div>
        </section>

        {/* ===== TIMELINE ===== */}
        <section aria-labelledby="timeline-h" className="border-b border-[#1a1a1a]/10 bg-white px-6 py-16 lg:py-20">
          <div className="container mx-auto">
            <p className={`text-[#B01C12] ${label}`}>How we got here</p>
            <h2 id="timeline-h" className="mt-2 max-w-3xl font-serif text-4xl leading-tight">From pause to pilot, as far as the record goes</h2>

            <TimelineDraw items={TIMELINE} />
            <p className="mt-10 max-w-[70ch] font-sans text-xs text-[#1a1a1a]/65">
              31 December 2025 and 30 June 2026 are two deadlines of the old programme, both from IRCC. <Src href={SRC.gazette}>Canada Gazette, 20 Dec 2025</Src>
            </p>
          </div>
        </section>

        {/* ===== WHY 2027: the one opinion on the page ===== */}
        <section aria-labelledby="why2027-h" className="relative isolate overflow-hidden bg-[#2A0C0A] text-white">
          <div className="absolute inset-0 -z-10">
            <Parallax distance={48} className="h-full">
              <Image
                src="/fa/img/high-impact-3.webp"
                alt="Glass office towers in downtown Vancouver under an overcast sky, a construction crane among them"
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
            </Parallax>
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#2A0C0A] via-[#2A0C0A]/80 to-[#2A0C0A]/25" />
          <MapleLeaf className="pointer-events-none absolute -bottom-16 right-4 h-[120%] w-auto text-[#D52B1E] opacity-20" />
          <div className="container relative mx-auto grid gap-10 px-6 py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:py-24">
            <div>
              <p className={`text-[#FF8F85] ${label}`}>Our reading, marked as such</p>
              <h2 id="why2027-h" className="mt-3 font-serif text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02]">
                The old door shut on {PAUSED_LABEL}. <span className="text-[#FF8F85]">We expect the new one to open in 2027.</span>
              </h2>
            </div>
            <Reveal className="space-y-4 font-sans text-[15px] leading-relaxed text-white/80 lg:pt-8" delay={0.15}>
              <p>
                No IRCC document gives a date. What the record gives is this: in December 2025 IRCC said more information would come in 2026. 2026 is nearly over with nothing published. A programme with no published criteria has to publish them before it can take a file, so an opening this year is unlikely.
              </p>
              <p>
                That is the whole basis for 2027, together with what circulates in the immigration trade. The day IRCC gives a date, this section is replaced by it.
              </p>
              <p className="flex items-center gap-3 border-t border-white/15 pt-4 text-sm text-white/70">
                <Flag code="ca" uid="hip-band" width={40} />
                Applications already filed under the Start-up Visa are still processed. Nothing can be filed under the pilot.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ===== WHY A NEW DESIGN ===== */}
        <section aria-labelledby="why-h" className="border-b border-[#1a1a1a]/10 px-6 py-16 lg:py-20">
          <div className="container mx-auto grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div>
              <p className={`text-[#B01C12] ${label}`}>Three readings</p>
              <h2 id="why-h" className="mt-2 font-serif text-4xl leading-tight">Why Canada is replacing the Start-up Visa</h2>
            </div>
            <Reveal><dl className="divide-y divide-[#1a1a1a]/10 border-y border-[#1a1a1a]/10">
              <div className="grid gap-2 py-6 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8">
                <dt className="font-serif text-xl">IRCC</dt>
                <dd className="font-sans text-[15px] leading-relaxed text-[#1a1a1a]/80">
                  A backlog. The programme was paused to address its application inventory and client wait times: more applications arrived than there were admission spaces. <Src href={SRC.about}>IRCC</Src>
                </dd>
              </div>
              <div className="grid gap-2 py-6 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8">
                <dt className="font-serif text-xl">RBC <span className="block font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#B01C12]">think-tank</span></dt>
                <dd className="font-sans text-[15px] leading-relaxed text-[#1a1a1a]/80">
                  <Reported>Capital over proof</Reported>. RBC’s September 2026 report says the programme granted permanent residence on the strength of capital or incubator backing, “regardless of whether the business idea proved genuine or successful”, and suggests piloting a <em>temporary</em> entrepreneurship pathway instead. A recommendation, not policy. <Src href={SRC.rbc}>RBC</Src>
                </dd>
              </div>
              <div className="grid gap-2 py-6 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8">
                <dt className="font-serif text-xl">Trade press <span className="block font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#B01C12]">inference</span></dt>
                <dd className="font-sans text-[15px] leading-relaxed text-[#1a1a1a]/80">
                  <Reported>Smaller and stricter</Reported>: a more selective pilot with closer scrutiny of the business and of designated organizations. Read out of IRCC’s wording, not written by IRCC. <Src href={SRC.press}>immigration.ca</Src>
                </dd>
              </div>
            </dl></Reveal>
          </div>
        </section>

        {/* ===== PREPARE ===== */}
        <section aria-labelledby="prep-h" className="border-b border-[#1a1a1a]/10 bg-white px-6 py-16 lg:py-20">
          <div className="container mx-auto">
            <p className={`text-[#B01C12] ${label}`}>While you wait</p>
            <h2 id="prep-h" className="mt-2 max-w-3xl font-serif text-4xl leading-tight">Four things worth doing whatever the final rules say</h2>
            <Stagger
              as="ol"
              className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2"
              itemClassName="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 border-t-2 border-[#1a1a1a] pt-5"
              items={BEFORE.map((b, i) => (
                <React.Fragment key={b.title}>
                  <span className="font-serif text-4xl leading-none text-[#D52B1E]" aria-hidden="true">0{i + 1}</span>
                  <div>
                    <h3 className="font-serif text-2xl leading-snug">{b.title}</h3>
                    <p className="mt-2 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/75">{b.body}</p>
                  </div>
                </React.Fragment>
              ))}
            />
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section aria-labelledby="faq-h" className="border-b border-[#1a1a1a]/10 px-6 py-16 lg:py-20">
          <div className="container mx-auto">
            <p className={`text-[#B01C12] ${label}`}>Straight answers</p>
            <h2 id="faq-h" className="mt-2 mb-8 font-serif text-4xl leading-tight">High Impact Start-up Pilot: frequently asked questions</h2>
            <FaqList faqs={FAQS} />
          </div>
        </section>

        {/* ===== NEXT STEPS ===== */}
        <section aria-labelledby="next-h" className="bg-[#2A0C0A] px-6 py-16 text-white">
          <div className="container mx-auto grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className={`text-[#FF8F85] ${label}`}>Talk it through</p>
              <h2 id="next-h" className="mt-2 font-serif text-4xl leading-tight">Need to move before 2027?</h2>
              <p className="mt-3 max-w-[52ch] font-sans text-white/75">
                We compare the routes open today and tell you plainly whether waiting for the pilot makes sense for your company. Nobody can reserve a place in it, including us.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/book-meeting" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D52B1E] px-6 py-3.5 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
                  Book a free session <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/which-path" className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3.5 font-sans text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#1a1a1a]">
                  Find your path
                </Link>
              </div>
            </div>
            <nav aria-label="Related guides" className="grid gap-2.5 font-sans text-sm">
              {[
                { href: '/startup-visa-canada', t: 'Canada Start-up Visa: status and the open work permit' },
                { href: '/pnp', t: 'Provincial Nominee Programs for entrepreneurs, compared' },
                { href: '/startup-visa-canada/requirements', t: 'Start-up Visa requirements, kept for reference' },
                { href: '/country', t: 'Routes open today, country by country' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 transition-colors hover:bg-white/10">
                  <span>{l.t}</span> <ArrowRight className="h-4 w-4 shrink-0 text-[#FF8F85]" aria-hidden="true" />
                </Link>
              ))}
              <p className="mt-2 text-xs text-white/60">Or write to {MAIN_CONTACT.email}</p>
            </nav>
          </div>
        </section>

        <SourcesSection sources={SOURCE_LIST} />

        <p className="bg-white px-6 pb-12 pt-0">
          <span className="container mx-auto block font-sans text-xs text-[#1a1a1a]/60">
            General information, not legal advice. Immigration rules change; confirm on canada.ca before you act.
          </span>
        </p>
      </div>
    </>
  );
}
