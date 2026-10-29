// ============================================================================
// app/[locale]/(public)/faq/FaqEn.tsx
// The English FAQ page body for /en/faq. Plain and server-rendered: a short
// hero, a client-side filter, eight groups of details/summary questions, the
// official sources, a contact band and the notice. Data: ./en-faqs.ts.
// ============================================================================
import React from 'react';
import Image from 'next/image';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from '@/routing';
import JsonLd from '@/components/JsonLd';
import { FOUNDER_ID, SITE_URL, breadcrumbJsonLd, faqJsonLd, webPageJsonLd } from '@/lib/seo';
import { MAIN_CONTACT } from '@/content/contact';
import FaqSearch from './FaqSearch';
import { ALL_FAQS, FAQ_GROUPS, FAQ_META, FAQ_PATH, FAQ_SANCTIONS_LABEL, FAQ_SOURCES, FAQ_UPDATED, type EnFaq } from './en-faqs';

const PAGE_URL = `${SITE_URL}/en${FAQ_PATH}`;
const label = 'font-sans text-xs font-bold uppercase tracking-[0.18em]';

/** The answer exactly as the page shows it, note included, for FAQPage. */
const fullAnswer = (f: EnFaq) => (f.note ? `${f.a} ${FAQ_SANCTIONS_LABEL}: ${f.note}` : f.a);

function jsonLd() {
  return [
    {
      ...webPageJsonLd({ title: FAQ_META.title, description: FAQ_META.description, url: PAGE_URL, locale: 'en' }),
      dateModified: FAQ_UPDATED.iso,
      author: { '@id': FOUNDER_ID },
      citation: FAQ_SOURCES.map((s) => s.url),
    },
    breadcrumbJsonLd([
      { name: 'Home', url: `${SITE_URL}/en` },
      { name: 'FAQ', url: PAGE_URL },
    ]),
    faqJsonLd(ALL_FAQS.map((f) => ({ question: f.q, answer: fullAnswer(f) })), 'en'),
  ];
}

export default function FaqEn() {
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
          className="object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/95 via-[#1a1a1a]/85 to-[#1a1a1a]/50" />
        <div className="container relative mx-auto px-6 pb-12 pt-8">
          <nav aria-label="Breadcrumb" className="mb-10 font-sans text-xs text-white/65">
            <ol className="flex flex-wrap gap-2">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="text-white/90">FAQ</li>
            </ol>
          </nav>
          <p className={`mb-5 text-[#CCFF00] ${label}`}>{ALL_FAQS.length} questions · short, direct answers</p>
          <h1 className="max-w-[22ch] font-serif text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] tracking-[-0.02em]">
            Startup immigration FAQ
            <span className="mt-4 block max-w-[48ch] font-sans text-lg font-medium leading-snug tracking-normal">
              The Canada Start-up Visa, European startup visas, Atlantic Canada, costs, documents and the EB-2 NIW
            </span>
          </h1>
          <p className="mt-5 max-w-[62ch] font-sans text-base leading-relaxed text-white/75">
            Every answer gives the answer in its first sentence, then explains. If your question isn&apos;t here, ask it on Telegram: you&apos;ll get
            an answer there, and if it&apos;s a good question it gets added to this page.
          </p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-white/65">
            <span>By <span className="text-white">Farjad P.D</span></span>
            <span>Updated <time dateTime={FAQ_UPDATED.iso} className="text-white">{FAQ_UPDATED.label}</time></span>
            <span>Figures checked against IRCC, Migri, New to Denmark, IND, Estonia&apos;s Police and Border Guard Board, New Brunswick and Nova Scotia</span>
          </p>
          <a
            href={MAIN_CONTACT.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#CCFF00] px-6 py-3.5 font-sans text-sm font-bold text-[#1a1a1a] transition-transform hover:-translate-y-0.5"
          >
            Ask your question on Telegram <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* ── Search + jump links ── */}
      <section className="border-b border-[#1a1a1a]/10 px-6 py-10">
        <div className="container mx-auto grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <FaqSearch total={ALL_FAQS.length} />
          <nav aria-label="FAQ sections">
            <p className={`mb-3 text-[#1a1a1a]/60 ${label}`}>Jump to</p>
            <ul className="flex flex-wrap gap-2">
              {FAQ_GROUPS.map((g) => (
                <li key={g.id}>
                  <a href={`#${g.id}`} className="inline-block rounded-full border border-[#1a1a1a]/25 px-3 py-1.5 font-sans text-xs font-bold hover:border-[#1a1a1a] hover:bg-white">
                    {g.heading} <span className="tabular-nums text-[#1a1a1a]/50">{g.faqs.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* ── Questions ── */}
      <div id="faq-list" className="px-6 py-14">
        <div className="container mx-auto grid max-w-4xl gap-14">
          {FAQ_GROUPS.map((g) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} data-faq-group className="scroll-mt-24">
              <h2 id={`${g.id}-h`} className="font-serif text-3xl leading-tight md:text-4xl">{g.heading}</h2>
              <div className="mt-5 border-t border-[#1a1a1a]/15">
                {g.faqs.map((f) => (
                  <details key={f.q} className="group border-b border-[#1a1a1a]/10" data-faq>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 transition-colors hover:text-[#1a1a1a]/70 [&::-webkit-details-marker]:hidden">
                      <h3 className="font-serif text-xl leading-snug">{f.q}</h3>
                      <span aria-hidden="true" className="font-serif text-2xl transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <div className="max-w-[72ch] pb-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/75">
                      <p>{f.a}</p>
                      {f.note && (
                        <p className="mt-3 border-l-4 border-[#CCFF00] bg-white px-4 py-3 text-sm text-[#1a1a1a]/75">
                          <strong className="text-[#1a1a1a]">{FAQ_SANCTIONS_LABEL}:</strong> {f.note}
                        </p>
                      )}
                    </div>
                  </details>
                ))}
              </div>
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-sm">
                <span className="text-[#1a1a1a]/55">Read the guide:</span>
                {g.links.map((l) => (
                  <Link key={l.href} href={l.href} className="font-bold underline decoration-[#1a1a1a]/30 underline-offset-4 hover:decoration-[#1a1a1a]">
                    {l.label}
                  </Link>
                ))}
              </p>
            </section>
          ))}
        </div>
      </div>

      {/* ── Sources ── */}
      <section aria-labelledby="sources-h" className="border-t border-[#1a1a1a]/10 bg-white px-6 py-14">
        <div className="container mx-auto max-w-4xl">
          <h2 id="sources-h" className="font-serif text-3xl">Sources</h2>
          <p className="mt-2 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/60">
            The official pages behind the figures above. Market ranges (incubator fees, total costs) and press reporting are labelled as such in the
            answers; they are not official figures.
          </p>
          <ul className="mt-5 grid gap-2 font-sans text-sm">
            {FAQ_SOURCES.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="break-words underline decoration-[#1a1a1a]/30 underline-offset-4 hover:decoration-[#1a1a1a]">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Next steps ── */}
      <section aria-labelledby="next-h" className="bg-[#1a1a1a] px-6 py-16 text-white">
        <div className="container mx-auto grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
          <div>
            <p className={`text-[#CCFF00] ${label}`}>Still deciding?</p>
            <h2 id="next-h" className="mt-2 font-serif text-3xl leading-tight md:text-4xl">Start with the free route assessment.</h2>
            <p className="mt-3 max-w-[52ch] font-sans text-white/75">
              Seven questions, three minutes, and a suggested route with the reason, or an honest &ldquo;not yet&rdquo;.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/which-path" className="inline-flex items-center gap-2 rounded-full bg-[#CCFF00] px-6 py-3.5 font-sans text-sm font-bold text-[#1a1a1a] transition-transform hover:-translate-y-0.5">
                Take the assessment <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/book-meeting" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 font-sans text-sm font-bold transition-colors hover:bg-white/10">
                Book a free session
              </Link>
            </div>
          </div>
          <address className="grid gap-2 font-sans text-sm not-italic text-white/80">
            <a href={MAIN_CONTACT.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-white">Telegram {MAIN_CONTACT.telegramHandle}</a>
            <a href={MAIN_CONTACT.tel} className="tabular-nums hover:text-white">Phone &amp; WhatsApp {MAIN_CONTACT.phone}</a>
            {MAIN_CONTACT.emails.map((e) => (
              <a key={e} href={`mailto:${e}`} className="hover:text-white">{e}</a>
            ))}
          </address>
        </div>
      </section>

      {/* ── Notice ── */}
      <section className="border-t border-[#1a1a1a]/10 bg-[#F9F9F9] px-6 py-8">
        <div className="container mx-auto flex max-w-4xl items-start gap-4">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#1a1a1a]/30" aria-hidden="true" />
          <p className="font-sans text-[11px] leading-relaxed text-[#1a1a1a]/55">
            <strong>Notice:</strong> The answers on this page were checked on {FAQ_UPDATED.label} and are provided for informational purposes only.
            VisaRoads Inc., an Ashavid company, is a startup mentorship and business advisory firm, not an immigration law firm, and does not file
            applications. Programmes, thresholds and fees change, sometimes without notice: always verify current requirements with the official body
            for your route before you act.
          </p>
        </div>
      </section>
    </div>
  );
}
