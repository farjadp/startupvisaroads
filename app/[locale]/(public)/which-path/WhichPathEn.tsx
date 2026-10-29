// ============================================================================
// app/[locale]/(public)/which-path/WhichPathEn.tsx
// The English page body for /en/which-path. Server-rendered around one client
// island (the quiz), so the H1, the explanation of every outcome and the
// links to each guide are in the HTML that crawlers and answer engines read.
//
// Copy and outcomes: ./en-copy.ts. Scoring: lib/fa/path-quiz.ts (shared with
// /fa/which-path, untouched). The English site's other self-assessment, the
// Express Entry calculator, lives at /en/tools and is linked, not repeated.
//
// Not ported from the Persian page: RouteCompare and Eligibility, the two
// widgets under the Persian quiz. Their data (lib/fa/programmes.ts) carries
// Persian names and notes, and they are shared components this page may not
// edit.
// ============================================================================
import React from 'react';
import Image from 'next/image';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from '@/routing';
import JsonLd from '@/components/JsonLd';
import { ASHAVID, FOUNDER_ID, ORGANIZATION_ID, SITE_URL, breadcrumbJsonLd, webPageJsonLd } from '@/lib/seo';
import { MAIN_CONTACT } from '@/content/contact';
import WhichPathQuizEn from './WhichPathQuizEn';
import { EN_META, EN_PATH, EN_RESULT, EN_UPDATED, OUTCOMES, enQuestions } from './en-copy';

const PAGE_URL = `${SITE_URL}/en${EN_PATH}`;
const label = 'font-sans text-xs font-bold uppercase tracking-[0.18em]';

function jsonLd() {
  return [
    {
      ...webPageJsonLd({ title: EN_META.title, description: EN_META.description, url: PAGE_URL, locale: 'en' }),
      dateModified: EN_UPDATED.iso,
      author: { '@id': FOUNDER_ID },
      primaryImageOfPage: `${SITE_URL}/fa/img/which-path.webp`,
      mainEntity: { '@id': `${PAGE_URL}#assessment` },
    },
    breadcrumbJsonLd([
      { name: 'Home', url: `${SITE_URL}/en` },
      { name: 'Which route fits you?', url: PAGE_URL },
    ]),
    // The English twin of faServiceJsonLd(): what the assessment is a door to.
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${PAGE_URL}#assessment`,
      name: 'Free immigration route assessment for founders',
      description: EN_META.description,
      url: PAGE_URL,
      serviceType: 'Startup visa and entrepreneur immigration mentorship',
      provider: { '@id': ORGANIZATION_ID },
      brand: { '@type': 'Organization', name: ASHAVID.name, url: ASHAVID.url },
      areaServed: 'Worldwide',
      availableLanguage: [{ '@type': 'Language', name: 'English', alternateName: 'en' }],
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD', description: 'The assessment is free.' },
    },
  ];
}

export default function WhichPathEn() {
  return (
    <div className="w-full overflow-x-clip bg-[#F2F0E9] text-[#1a1a1a]">
      <JsonLd data={jsonLd()} />

      {/* ── Hero ── */}
      <header className="relative overflow-hidden bg-[#1a1a1a] text-white">
        <Image
          src="/fa/img/which-path.webp"
          alt="A gravel road running between two dry-stone walls into fog"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/95 via-[#1a1a1a]/80 to-[#1a1a1a]/40" />
        <div className="container relative mx-auto px-6 pb-12 pt-8">
          <nav aria-label="Breadcrumb" className="mb-10 font-sans text-xs text-white/65">
            <ol className="flex flex-wrap gap-2">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="text-white/90">Which route fits you?</li>
            </ol>
          </nav>
          <p className={`mb-5 text-[#CCFF00] ${label}`}>Free route assessment</p>
          <h1 className="max-w-[20ch] font-serif text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] tracking-[-0.02em]">
            Which immigration route fits you?
            <span className="mt-4 block max-w-[46ch] font-sans text-lg font-medium leading-snug tracking-normal">
              A free three-minute assessment for founders: Europe, Türkiye, Atlantic Canada or the US
            </span>
          </h1>
          <p className="mt-5 max-w-[60ch] font-sans text-base leading-relaxed text-white/75">
            This assessment won&apos;t tell you that you &ldquo;qualify&rdquo;. It tells you which of the routes open today &mdash; in Europe, Atlantic
            Canada or the United States &mdash; matches your real situation, why, and what is still missing. Sometimes the right answer is &ldquo;not
            yet&rdquo;, and that is an answer too.
          </p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-white/65">
            <span>By <span className="text-white">Farjad P.D</span></span>
            <span>Updated <time dateTime={EN_UPDATED.iso} className="text-white">{EN_UPDATED.label}</time></span>
            <span>Thresholds taken from our route guides, each checked against its official source</span>
          </p>
          <a
            href="#assessment"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#CCFF00] px-6 py-3.5 font-sans text-sm font-bold text-[#1a1a1a] transition-transform hover:-translate-y-0.5"
          >
            Take the assessment <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* ── The quiz ── */}
      <section id="assessment" aria-label="The assessment" className="scroll-mt-24 px-6 py-16 md:py-24">
        <div className="container mx-auto min-h-[60vh]">
          <WhichPathQuizEn />
        </div>
      </section>

      {/* ── What it can recommend ── */}
      <section aria-labelledby="outcomes-h" className="border-t border-[#1a1a1a]/10 bg-white px-6 py-16">
        <div className="container mx-auto max-w-5xl">
          <p className={`text-[#1a1a1a]/55 ${label}`}>How it decides</p>
          <h2 id="outcomes-h" className="mt-2 font-serif text-3xl md:text-4xl">Which routes can the assessment recommend?</h2>
          <p className="mt-4 max-w-[68ch] font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
            Nine outcomes, tested in a fixed order: a research profile goes to the EB-2 NIW, threshold-level capital with a track record goes to
            Atlantic Canada, an operating business with workable English goes to Europe or Türkiye by team size, goal and budget, and everything
            else is &ldquo;not yet&rdquo;. The Canada Start-up Visa is not on the list: it has been paused since 30 June 2026.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left font-sans text-sm">
              <caption className="mb-3 text-left font-sans text-xs text-[#1a1a1a]/55">
                The nine results and the answers that lead to each, in the order the assessment tests them.
              </caption>
              <thead>
                <tr className="border-b-2 border-[#1a1a1a]">
                  <th scope="col" className="py-3 pr-4 font-bold">Result</th>
                  <th scope="col" className="py-3 pr-4 font-bold">When the assessment suggests it</th>
                  <th scope="col" className="py-3 font-bold">Guide</th>
                </tr>
              </thead>
              <tbody>
                {OUTCOMES.map((o) => {
                  const r = EN_RESULT[o.path];
                  return (
                    <tr key={o.path} className="border-b border-[#1a1a1a]/10 align-top">
                      <th scope="row" className="py-3 pr-4 font-bold">{r.title}</th>
                      <td className="py-3 pr-4 text-[#1a1a1a]/70">{o.when}</td>
                      <td className="py-3">
                        <Link href={r.href} className="inline-flex items-center gap-1 font-bold underline decoration-[#1a1a1a]/30 underline-offset-4 hover:decoration-[#1a1a1a]">
                          {r.guide}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-serif text-2xl">What the seven questions ask</h3>
              <ol className="mt-3 grid list-decimal gap-1.5 pl-5 font-sans text-[15px] text-[#1a1a1a]/70">
                {enQuestions.map((q) => (
                  <li key={q.id}>{q.title}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-serif text-2xl">Want a Canadian points score instead?</h3>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
                This assessment chooses between entrepreneur routes. If you are weighing Canada&apos;s skilled-worker system, our Express Entry CRS
                calculator is in the tools section.
              </p>
              <Link href="/tools" className="mt-4 inline-flex items-center gap-2 font-sans text-sm font-bold underline decoration-[#1a1a1a]/30 underline-offset-4 hover:decoration-[#1a1a1a]">
                Open the self-assessment tools <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Talk it through ── */}
      <section aria-labelledby="book-h" className="bg-[#1a1a1a] px-6 py-16 text-white">
        <div className="container mx-auto grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
          <div>
            <p className={`text-[#CCFF00] ${label}`}>Talk it through</p>
            <h2 id="book-h" className="mt-2 font-serif text-3xl leading-tight md:text-4xl">Bring your result to a free session.</h2>
            <p className="mt-3 max-w-[52ch] font-sans text-white/75">
              Get an honest read on your team, your numbers and whether the suggested route is the right one. If it isn&apos;t, we&apos;ll say so.
            </p>
            <Link href="/book-meeting" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#CCFF00] px-6 py-3.5 font-sans text-sm font-bold text-[#1a1a1a] transition-transform hover:-translate-y-0.5">
              Book a free session <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <address className="grid gap-2 font-sans text-sm not-italic text-white/80">
            <a href={MAIN_CONTACT.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-white">Telegram {MAIN_CONTACT.telegramHandle}</a>
            <a href={MAIN_CONTACT.tel} className="tabular-nums hover:text-white">Phone &amp; WhatsApp {MAIN_CONTACT.phone}</a>
            <a href={`mailto:${MAIN_CONTACT.email}`} className="hover:text-white">{MAIN_CONTACT.email}</a>
          </address>
        </div>
      </section>

      {/* ── Notice ── */}
      <section className="border-t border-[#1a1a1a]/10 bg-[#F9F9F9] px-6 py-8">
        <div className="container mx-auto flex max-w-4xl items-start gap-4">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#1a1a1a]/30" aria-hidden="true" />
          <p className="font-sans text-[11px] leading-relaxed text-[#1a1a1a]/55">
            <strong>Notice:</strong> The thresholds behind this assessment were last checked on {EN_UPDATED.label}. The assessment is triage, provided
            for informational purposes only: it suggests which guide to read next, not whether you will be accepted. VisaRoads Inc., an Ashavid
            company, is a startup mentorship and business advisory firm, not an immigration law firm. Always verify current requirements with the
            official body for your route before you act.
          </p>
        </div>
      </section>
    </div>
  );
}
