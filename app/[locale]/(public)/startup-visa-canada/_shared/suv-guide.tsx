// ============================================================================
// app/[locale]/(public)/startup-visa-canada/_shared/suv-guide.tsx
// The pieces the three English Start-up Visa reference pages share:
// /requirements, /cost and /designated-organizations. The leading underscore
// keeps this folder out of the router.
//
// Every page that uses this must say the programme is PAUSED. The status
// band is SuvStatusNotice (facts from lib/canada-suv.ts); the reference note
// under it is the English of content/fa/suv-status.ts › suvSubpageStatus.
//
// IRCC fees: lib/canada-suv.ts carries no fee table, and the Persian modules'
// fee figures were out of date. The table below was read off IRCC's fee list
// on 29 Oct 2026 (FEES_SOURCE) and is the only place these pages take a fee
// from.
// ============================================================================
import React from 'react';
import Image from 'next/image';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from '@/routing';
import JsonLd from '@/components/JsonLd';
import SuvStatusNotice from '@/components/SuvStatusNotice';
import Flag from '@/components/route/flags';
import { RouteFinish, type RouteTheme } from '@/components/route/RouteProgress';
import { CopyButton } from '@/components/route/RouteWidgets';
import { MAIN_CONTACT } from '@/content/contact';
import { FOUNDER_ID, SITE_URL, breadcrumbJsonLd, faqJsonLd, webPageJsonLd } from '@/lib/seo';
import { SUV_SOURCES, SUV_STATE, SUV_VERIFIED } from '@/lib/canada-suv';

// ─── Dates ───────────────────────────────────────────────────────────────────

/** The Persian modules' `updated`: the day the programme's status was last read off canada.ca. */
export const STATUS_CHECKED = { iso: SUV_VERIFIED, label: '12 Sep 2026' };
/** The day the fees, language tests, settlement funds and designated-organisation page were re-read for these English pages. */
export const FIGURES_CHECKED = { iso: '2026-10-29', label: '29 Oct 2026' };

export const PAUSED_ON_LABEL = new Date(SUV_STATE.pausedOn).toLocaleDateString('en-CA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// ─── Theme ───────────────────────────────────────────────────────────────────

// Canadian red. Contrast (WCAG 2.x): accentInk #FFFFFF on #D52B1E 5.01:1;
// accentText #B01C12 on #F2F0E9 6.10:1, on white 6.95:1, on soft #FBE7E4
// 5.84:1; accentOnDark #FF8F85 on deep #2A0C0A 8.24:1.
export const THEME: RouteTheme = {
  accent: '#D52B1E',
  accentInk: '#FFFFFF',
  accentText: '#B01C12',
  primary: '#7F1D16',
  deep: '#2A0C0A',
  soft: '#FBE7E4',
  accentOnDark: '#FF8F85',
};

export const label = 'font-sans text-xs font-bold uppercase tracking-[0.18em]';
export const cad = (n: number) => `$${n.toLocaleString('en-CA')}`;

// ─── Official figures ────────────────────────────────────────────────────────

export const FEES_SOURCE = 'https://ircc.canada.ca/english/information/fees/fees.asp';
export const LANGUAGE_SOURCE = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/language-testing.html';
export const ESSENTIAL_PERSON_SOURCE = 'https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=651&top=6';

/** IRCC fee list, Start-up Visa (business immigration), CAD, read 29 Oct 2026. */
export const IRCC_FEES = {
  principalProcessing: 1895,
  rprf: 600,
  spouseProcessing: 990,
  child: 270,
  biometricsPerPerson: 85,
  biometricsFamilyMax: 170,
  workPermit: 155,
  openWorkPermitHolder: 100,
} as const;

// ─── Pages ───────────────────────────────────────────────────────────────────

export const PILLAR = { href: '/startup-visa-canada', title: 'Canada Start-up Visa' };
export const SUBPAGES = [
  { key: 'requirements', href: '/startup-visa-canada/requirements', title: 'Requirements and documents', blurb: 'Language, settlement funds, ownership rules and the full document list.' },
  { key: 'cost', href: '/startup-visa-canada/cost', title: 'Cost', blurb: 'IRCC fees, designated-organisation charges and the costs people forget.' },
  { key: 'designated-organizations', href: '/startup-visa-canada/designated-organizations', title: 'Designated organizations', blurb: 'Incubators, angel groups and VC funds: how to vet one and spot a fake.' },
] as const;
export type SubpageKey = (typeof SUBPAGES)[number]['key'];

// ─── Structured data ─────────────────────────────────────────────────────────

export function subpageJsonLd({
  path,
  title,
  description,
  crumb,
  citation,
  howTo,
  faqs,
}: {
  path: string;
  title: string;
  description: string;
  crumb: string;
  citation: string[];
  howTo: { name: string; steps: { title: string; body: string }[] };
  faqs: { q: string; a: string }[];
}) {
  const url = `${SITE_URL}/en${path}`;
  return [
    {
      ...webPageJsonLd({ title, description, url, locale: 'en' }),
      dateModified: FIGURES_CHECKED.iso,
      author: { '@id': FOUNDER_ID },
      citation,
    },
    breadcrumbJsonLd([
      { name: 'Home', url: `${SITE_URL}/en` },
      { name: PILLAR.title, url: `${SITE_URL}/en${PILLAR.href}` },
      { name: crumb, url },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: howTo.name,
      inLanguage: 'en',
      step: howTo.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.body })),
    },
    faqJsonLd(faqs.map((f) => ({ question: f.q, answer: f.a })), 'en'),
  ];
}

export function SubpageJsonLd(props: Parameters<typeof subpageJsonLd>[0]) {
  return <JsonLd data={subpageJsonLd(props)} />;
}

// ─── Hero ────────────────────────────────────────────────────────────────────

export function SuvHero({
  crumb,
  brand,
  phrase,
  lede,
  checkedAgainst,
  routeItems,
  start,
}: {
  crumb: string;
  brand: React.ReactNode;
  phrase: string;
  lede: React.ReactNode;
  checkedAgainst: string;
  routeItems: string[];
  start: string;
}) {
  return (
    <header className="relative overflow-hidden bg-[#2A0C0A] text-white">
      <Image
        src="/fa/img/canada-startup-visa.webp"
        alt="A closed green roller shutter above a yellow-painted kerb"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2A0C0A]/95 via-[#2A0C0A]/80 to-[#2A0C0A]/40" />

      <div className="container relative mx-auto grid grid-cols-1 items-end gap-8 px-6 pb-12 pt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <nav aria-label="Breadcrumb" className="font-sans text-xs text-white/65 lg:col-span-2">
          <ol className="flex flex-wrap gap-2">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href={PILLAR.href} className="hover:text-white">{PILLAR.title}</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="text-white/85">{crumb}</li>
          </ol>
        </nav>

        <div>
          <div className={`mb-5 flex flex-wrap items-center gap-3 text-white/80 ${label}`}>
            <Flag code="ca" uid="hero" width={40} />
            Canada · Start-up Visa
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D52B1E] px-3 py-1 text-[11px] tracking-[0.14em] text-white">
              <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" /> Paused since {PAUSED_ON_LABEL}
            </span>
          </div>
          <h1>
            <span className="block font-serif text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.02em]">{brand}</span>
            <span className="mt-4 block max-w-[46ch] font-sans text-lg font-medium leading-snug">{phrase}</span>
          </h1>
          <div className="mt-3 max-w-[58ch] font-sans text-base leading-relaxed text-white/75">{lede}</div>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-white/65">
            <span>By <span className="text-white">Farjad P.D</span></span>
            <span>Updated <time dateTime={STATUS_CHECKED.iso} className="text-white">{STATUS_CHECKED.label}</time></span>
            <span>Figures checked against {checkedAgainst} on <time dateTime={FIGURES_CHECKED.iso} className="text-white">{FIGURES_CHECKED.label}</time></span>
          </p>
        </div>

        <aside aria-label="How to use this page" className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
          <p className={`text-[#FF8F85] ${label}`}>Your route through this page</p>
          <ol className="my-4 list-decimal space-y-1 pl-5 font-sans text-sm text-white/80">
            {routeItems.map((r) => <li key={r}>{r}</li>)}
          </ol>
          <a href={start} className="inline-flex items-center gap-2 rounded-full bg-[#D52B1E] px-5 py-3 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
            Start the route <ArrowRight className="h-4 w-4" />
          </a>
        </aside>
      </div>
    </header>
  );
}

// ─── Status: band + reference note + sibling links ───────────────────────────

export function SuvStatus({ current }: { current: SubpageKey }) {
  return (
    <>
      <SuvStatusNotice variant="band" />
      <section aria-label="About this page" className="border-b border-[#1a1a1a]/10 bg-[#FBE7E4] px-6 py-6">
        <div className="container mx-auto grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-center">
          <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]/80">
            <strong className="text-[#1a1a1a]">This page is a reference, not an application guide.</strong> It describes the Start-up Visa as it stood
            before the pause, for two readers: anyone with an application already in progress, and anyone comparing it with the entrepreneur pilot IRCC
            says will replace it. These rules belong to the paused programme and do not apply to that pilot.
          </p>
          <nav aria-label="Canada Start-up Visa guides">
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <li>
                <Link href={PILLAR.href} className="flex h-full flex-col rounded-xl border border-[#1a1a1a]/10 bg-white px-4 py-3 transition-colors hover:border-[#D52B1E]">
                  <span className="font-sans text-sm font-bold">Programme status and overview</span>
                  <span className="font-sans text-xs text-[#1a1a1a]/65">The pause, files in progress, the open work permit.</span>
                </Link>
              </li>
              {SUBPAGES.map((p) =>
                p.key === current ? (
                  <li key={p.key} aria-current="page" className="flex flex-col rounded-xl border border-[#D52B1E] bg-white px-4 py-3">
                    <span className="font-sans text-sm font-bold">{p.title} <span className="font-normal text-[#B01C12]">· you are here</span></span>
                    <span className="font-sans text-xs text-[#1a1a1a]/65">{p.blurb}</span>
                  </li>
                ) : (
                  <li key={p.key}>
                    <Link href={p.href} className="flex h-full flex-col rounded-xl border border-[#1a1a1a]/10 bg-white px-4 py-3 transition-colors hover:border-[#D52B1E]">
                      <span className="font-sans text-sm font-bold">{p.title}</span>
                      <span className="font-sans text-xs text-[#1a1a1a]/65">{p.blurb}</span>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}

// ─── Sanctioned-country note ─────────────────────────────────────────────────

export function SanctionsNote({ children, title = 'For applicants from sanctioned countries, such as Iran' }: { children: React.ReactNode; title?: string }) {
  return (
    <aside className="mt-6 max-w-4xl rounded-2xl border border-[#7F1D16]/25 bg-white p-5 font-sans text-sm leading-relaxed text-[#1a1a1a]/75">
      <p className={`mb-2 text-[#B01C12] ${label}`}>{title}</p>
      {children}
    </aside>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="max-w-4xl border-t border-[#1a1a1a]/10">
      {faqs.map((f) => (
        <details key={f.q} className="group border-b border-[#1a1a1a]/10" data-faq>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 transition-colors hover:text-[#B01C12] group-open:text-[#B01C12] [&::-webkit-details-marker]:hidden">
            <h3 className="font-serif text-xl leading-snug">{f.q}</h3>
            <span aria-hidden="true" className="font-serif text-2xl transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="max-w-[72ch] pb-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

// ─── Tables ──────────────────────────────────────────────────────────────────

export function DataTable({ caption, head, rows, note, wide = false }: { caption: string; head: string[]; rows: (string | number)[][]; note?: React.ReactNode; wide?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full overflow-hidden rounded-2xl bg-white font-sans text-sm ${wide ? 'min-w-[600px]' : 'min-w-[480px]'}`}>
        <caption className="pb-2 text-left font-bold">{caption}</caption>
        <thead>
          <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/60">
            {head.map((h) => <th key={h} scope="col" className="px-4 py-3">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={String(r[0])} className="border-b border-[#1a1a1a]/10 last:border-0">
              <th scope="row" className="px-4 py-3 text-left font-normal">{r[0]}</th>
              {r.slice(1).map((c, i) => <td key={i} className="px-4 py-3 tabular-nums">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {note && <p className="mt-2 font-sans text-xs text-[#1a1a1a]/60">{note}</p>}
    </div>
  );
}

// ─── Sources ─────────────────────────────────────────────────────────────────

export interface SourceItem {
  name: string;
  href: string;
  what: string;
  checked: string;
}

export function SourcesSection({ sources }: { sources: SourceItem[] }) {
  return (
    <section aria-labelledby="sources-h" className="border-b border-[#1a1a1a]/10 bg-white px-6 py-14">
      <div className="container mx-auto">
        <p className={`text-[#B01C12] ${label}`}>Where these figures come from</p>
        <h2 id="sources-h" className="mt-2 font-serif text-3xl">Sources</h2>
        <ol className="mt-6 grid max-w-4xl list-decimal gap-2 pl-5 font-sans text-sm">
          {sources.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="break-words font-bold underline decoration-[#D52B1E] underline-offset-2 hover:text-[#B01C12]">
                {s.name}
              </a>{' '}
              <span className="text-[#1a1a1a]/65">{s.what} Checked {s.checked}.</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** The canada.ca pages every SUV sub-page leans on for its status. */
export const STATUS_SOURCES: SourceItem[] = [
  { name: 'IRCC — Start-up Visa Program', href: SUV_SOURCES.program, what: 'Programme status: paused on 30 June 2026, files already accepted still processed.', checked: '29 Oct 2026' },
  { name: 'IRCC — Start-up Visa: who can apply', href: SUV_SOURCES.eligibility, what: 'Voting rights, CLB 5, the settlement funds table (updated 29 July 2025), the cap of 10 group applications and the 6-month filing window.', checked: '29 Oct 2026' },
];

// ─── Booking ─────────────────────────────────────────────────────────────────

export function BookingSection({ heading, body, extra }: { heading: React.ReactNode; body: string; extra?: React.ReactNode }) {
  return (
    <section id="book" aria-labelledby="book-h" className="scroll-mt-32 bg-[#2A0C0A] px-6 py-16 text-white">
      <div className="container mx-auto grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
        <div>
          <RouteFinish />
          <p className={`text-[#FF8F85] ${label}`}>Talk it through</p>
          <h2 id="book-h" className="mt-2 font-serif text-4xl leading-tight">{heading}</h2>
          <p className="mt-3 max-w-[52ch] font-sans text-white/75">{body}</p>
          {extra}
          <ul className="my-5 flex flex-wrap gap-2 font-sans text-xs">
            {['Free · 60 minutes', 'Online, Google Meet', 'Link sent after booking'].map((p) => (
              <li key={p} className="rounded-full border border-white/25 px-3 py-1.5">{p}</li>
            ))}
          </ul>
          <Link href="/book-meeting" className="inline-flex items-center gap-2 rounded-full bg-[#D52B1E] px-6 py-3.5 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
            Book a free session <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <address className="grid gap-2.5 not-italic">
          <p className={`text-white/65 ${label}`}>Or reach us directly</p>
          {[
            { k: 'Phone & WhatsApp', v: MAIN_CONTACT.phone, copy: MAIN_CONTACT.phoneE164, links: [{ label: 'Call', href: MAIN_CONTACT.tel }, { label: 'WhatsApp', href: MAIN_CONTACT.whatsapp }] },
            { k: 'Email', v: MAIN_CONTACT.email, copy: MAIN_CONTACT.email, links: [{ label: 'Email', href: `mailto:${MAIN_CONTACT.email}` }] },
            { k: 'Telegram', v: MAIN_CONTACT.telegramHandle, copy: null, links: [{ label: 'Open', href: MAIN_CONTACT.telegram }] },
          ].map((c) => (
            <div key={c.k} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5 rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-white/60">{c.k}</span>
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
  );
}

// ─── Related articles ────────────────────────────────────────────────────────

// English articles from visaroads.com/sitemap.xml, each fetched 29 Oct 2026
// (200, title, description, og:image, datePublished, read time). The
// sitemap has no English article on the Start-up Visa itself, so these are
// the closest Canada and founder-route pieces. Curated, so the page stays
// static.
const READS = [
  {
    slug: 'fastest-way-canada-permanent-residency-tech-founders-2026',
    stage: 'Compare routes',
    title: 'Fastest Way to Canada Permanent Residency for Tech Founders in 2026',
    excerpt: 'The routes to Canadian permanent residency open to tech founders in 2026, with their timelines, risks and requirements.',
    date: { iso: '2026-10-24', label: '24 Oct 2026' },
    minutes: 11,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/10/967f36fe04e78423bc347306ef4f96be.jpg',
  },
  {
    slug: 'how-to-navigate-the-canada-work-permit-process-step-by-step',
    stage: 'Work in Canada',
    title: 'How to navigate the Canada work permit process step by step',
    excerpt: 'The main work permit pathways for professionals and founders, with timelines, documents and common mistakes.',
    date: { iso: '2026-09-19', label: '19 Sep 2026' },
    minutes: 9,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/09/8140a12b044e2c2a2b6aba72e7cd1cb3.jpg',
  },
  {
    slug: 'which-asian-countries-offer-real-startup-visas-similar-to-canada',
    stage: 'Look further',
    title: 'Which Asian Countries Offer ‘Real’ Startup Visas Similar to Canada?',
    excerpt: 'South Korea, Singapore and Japan compared with the start-up visas of Canada and the Netherlands.',
    date: { iso: '2026-07-10', label: '10 Jul 2026' },
    minutes: 3,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/07/bd1b5a23ed013765e558a92005f129c7.jpg',
  },
];

export function RelatedReads() {
  return (
    <section aria-labelledby="reads-h" className="bg-[#F2F0E9] px-6 py-16">
      <div className="container mx-auto">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={`text-[#B01C12] ${label}`}>Keep reading</p>
            <h2 id="reads-h" className="mt-2 font-serif text-3xl md:text-4xl">More Canada guides</h2>
          </div>
          <Link href="/blog/category/canada" className="inline-flex items-center gap-1.5 font-sans text-sm font-bold text-[#B01C12] hover:underline">
            All Canada articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ul className="grid snap-x snap-mandatory auto-cols-[82%] grid-flow-col gap-4 overflow-x-auto pb-2 md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:overflow-visible">
          {READS.map((r) => (
            <li key={r.slug} className="group snap-start overflow-hidden rounded-2xl border border-[#1a1a1a]/10 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2A0C0A]/10">
              <Link href={`/blog/${r.slug}`} className="block">
                <span className="relative block aspect-video overflow-hidden">
                  <Image src={r.cover} alt="" fill sizes="(min-width: 768px) 33vw, 82vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </span>
                <span className="grid gap-2 p-5">
                  <span className={`text-[#B01C12] ${label}`}>{r.stage}</span>
                  <span className="font-serif text-xl leading-snug">{r.title}</span>
                  <span className="font-sans text-sm text-[#1a1a1a]/65">{r.excerpt}</span>
                  <span className="font-sans text-xs tabular-nums text-[#1a1a1a]/55">
                    <time dateTime={r.date.iso}>{r.date.label}</time> · {r.minutes} min read
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── Notice ──────────────────────────────────────────────────────────────────

export function SuvNotice({ children }: { children?: React.ReactNode }) {
  return (
    <section className="border-t border-[#1a1a1a]/10 bg-[#F9F9F9] px-6 py-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-start gap-4">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#1a1a1a]/40" />
          <p className="font-sans text-[11px] leading-relaxed text-[#1a1a1a]/60">
            <strong>Regulatory Notice:</strong> The programme&apos;s status on this page was read off canada.ca on 12 September 2026, and fees,
            language tests, settlement funds and the designated-organization page were re-checked on 29 October 2026. The Start-up Visa has been
            paused since {PAUSED_ON_LABEL}; nothing here is an invitation to apply. {children} This page is provided for informational purposes only.
            VisaRoads Inc., an Ashavid company, is a strategic business advisory firm — we are <span className="underline">NOT</span> an immigration
            law firm. IRCC revises its pages without notice — always verify current rules and figures at{' '}
            <a href={SUV_SOURCES.program} target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-[#B01C12]">canada.ca</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
