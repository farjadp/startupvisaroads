// ============================================================================
// Component: components/guide/EnGuideLayout.tsx
// Renders one English guide from a typed content module — the English
// counterpart of components/fa/FaPageLayout.tsx, built for the US cluster
// (/country/usa, /usa/o-1a, /usa/e-2 …) so a guide is a content module, not a
// 300-line bespoke page.
//
// It reuses the FaPage shape on purpose: the two locales of a paired page are
// written in the same pass and carry the same facts, and one type keeps them
// honest. Copy never lives here — it lives in content/en/<page>.ts.
// ============================================================================
import React from 'react';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from '@/navigation';
import JsonLd from '@/components/JsonLd';
import { SITE_URL, WEBSITE_ID, ORGANIZATION_ID, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import type { FaPage, FaCta, FaSection } from '@/lib/fa/content';

const isExternal = (href: string) => /^https?:\/\//.test(href);

function Cta({ cta, primary, dark }: { cta: FaCta; primary?: boolean; dark?: boolean }) {
  const cls = primary
    ? 'group inline-flex items-center gap-4 bg-[#CCFF00] text-[#1a1a1a] px-8 py-5 font-bold hover:bg-[#F2F0E9] transition-colors'
    : dark
      ? 'group inline-flex items-center gap-3 border border-[#F2F0E9]/40 text-[#F2F0E9] px-6 py-4 font-bold hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] transition-colors'
      : 'group inline-flex items-center gap-3 border border-[#1a1a1a] px-6 py-4 font-bold hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors';
  const inner = (
    <>
      <span>{cta.label}</span>
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </>
  );
  return isExternal(cta.href) ? (
    <a href={cta.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  ) : (
    <Link href={cta.href} className={cls}>{inner}</Link>
  );
}

function Section({ s, i }: { s: FaSection; i: number }) {
  return (
    <section id={`s${i + 1}`} className="scroll-mt-28">
      <div className="h-px w-12 bg-[#1a1a1a] mb-5" aria-hidden />
      <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-6 max-w-3xl [text-wrap:balance]">{s.heading}</h2>
      <div className="space-y-5 text-lg leading-relaxed text-[#1a1a1a]/80 max-w-[70ch]">
        {s.body.map((p, j) => <p key={j}>{p}</p>)}
        {s.bullets && (
          <ul className="space-y-3 pt-1">
            {s.bullets.map((b, j) => (
              <li key={j} className="flex gap-4">
                <span className="mt-[0.8em] h-px w-5 bg-[#1a1a1a] shrink-0" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        {s.callout && (
          <aside className="mt-4 bg-[#1a1a1a] text-[#F2F0E9] p-7 md:p-8 border-t-2 border-[#CCFF00]">
            <p className="font-serif text-xl md:text-2xl leading-snug [text-wrap:pretty]">{s.callout}</p>
          </aside>
        )}
      </div>
    </section>
  );
}

function webPageJsonLd(page: FaPage) {
  const url = `${SITE_URL}/en${page.path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: 'en',
    dateModified: page.updated,
    ...(page.sources?.length
      ? { citation: page.sources.map((s) => ({ '@type': 'WebPage', name: s.label, url: s.url })) }
      : {}),
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORGANIZATION_ID },
    ...(page.entity
      ? {
          about: {
            '@type': page.entity.type ?? 'GovernmentService',
            name: page.entity.name,
            ...(page.entity.provider ? { provider: { '@type': 'GovernmentOrganization', name: page.entity.provider } } : {}),
            ...(page.entity.country ? { areaServed: { '@type': 'Country', name: page.entity.country } } : {}),
            ...(page.facts?.length
              ? {
                  additionalProperty: page.facts.map((f) => ({
                    '@type': 'PropertyValue',
                    name: f.label,
                    value: f.value,
                    ...(f.note ? { description: f.note } : {}),
                  })),
                }
              : {}),
          },
        }
      : {}),
  };
}

const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-CA', { day: 'numeric', month: 'long', year: 'numeric' });

export default function EnGuideLayout({
  page,
  trail,
  extra,
}: {
  page: FaPage;
  trail: { name: string; path: string }[];
  /** Rendered after the sections, before the FAQ — a form, a link grid. */
  extra?: React.ReactNode;
}) {
  const crumbs = [{ name: 'Home', path: '' }, ...trail];
  return (
    <article className="w-full bg-[#F2F0E9] text-[#1a1a1a]">
      <JsonLd
        data={[
          webPageJsonLd(page),
          ...(page.faqs.length ? [faqJsonLd(page.faqs.map((f) => ({ question: f.q, answer: f.a })), 'en')] : []),
          breadcrumbJsonLd(crumbs.map((c) => ({ name: c.name, url: `${SITE_URL}/en${c.path}` }))),
        ]}
      />

      <header className="bg-[#1a1a1a] text-[#F2F0E9]">
        <div className="px-4 md:px-8 max-w-[1400px] mx-auto">
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#F2F0E9]/55 pt-28 md:pt-32">
            {crumbs.map((t, i) => (
              <React.Fragment key={t.path || 'home'}>
                {i > 0 && <span className="text-[#F2F0E9]/25">/</span>}
                {t.path === page.path ? (
                  <span className="text-[#F2F0E9]">{t.name}</span>
                ) : (
                  <Link href={t.path || '/'} className="hover:text-[#CCFF00]">{t.name}</Link>
                )}
              </React.Fragment>
            ))}
          </nav>
          <div className="max-w-[64ch] pt-10 pb-14 md:pt-14 md:pb-24">
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#CCFF00]">
              <span className="h-px w-8 bg-[#CCFF00]" aria-hidden />
              {page.hero.eyebrow}
            </p>
            <h1 className="mt-6 font-serif text-[2.6rem] md:text-6xl lg:text-7xl leading-[1.02] tracking-tight max-w-[20ch] [text-wrap:balance]">
              {page.hero.headline}
            </h1>
            <p className="mt-8 text-lg md:text-xl leading-relaxed text-[#F2F0E9]/75 max-w-[58ch]">{page.hero.sub}</p>
            <div className="mt-10">
              <Cta cta={page.hero.cta} primary />
            </div>
          </div>
          <div className="border-t border-[#F2F0E9]/15 py-4 text-xs text-[#F2F0E9]/55">
            Last reviewed: <time dateTime={page.updated}>{longDate(page.updated)}</time>
          </div>
        </div>
      </header>

      <div className="px-4 md:px-8 max-w-[1400px] mx-auto border-x border-[#1a1a1a]/10">
        {page.status && (
          <aside role="status" className="my-10 bg-[#1a1a1a] text-[#F2F0E9] p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start">
            <ShieldAlert className="w-8 h-8 text-[#CCFF00] shrink-0" aria-hidden />
            <div className="flex-1">
              <h2 className="font-serif text-2xl md:text-3xl leading-tight mb-3">{page.status.title}</h2>
              <p className="text-[#F2F0E9]/80 leading-relaxed max-w-3xl">{page.status.body}</p>
            </div>
            {page.status.cta && <Cta cta={page.status.cta} primary />}
          </aside>
        )}

        {page.facts && page.facts.length > 0 && (
          <section className="my-14">
            <h2 className="sr-only">Key facts</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]/20 border border-[#1a1a1a]">
              {page.facts.map((f) => (
                <div key={f.label} className="bg-[#F2F0E9] p-6 flex flex-col justify-between min-h-[8.5rem]">
                  <dt className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/55 mb-3">{f.label}</dt>
                  <dd>
                    <span className="block font-serif text-2xl leading-tight [text-wrap:balance]">{f.value}</span>
                    {f.note && <span className="block mt-2 text-xs text-[#1a1a1a]/55 leading-relaxed">{f.note}</span>}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-[#1a1a1a]/50">Figures are as of the review date above; the official source for each can change them.</p>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-16 md:py-24">
          <aside className="lg:col-span-3 hidden lg:block">
            <nav aria-label="On this page" className="sticky top-28 space-y-3 text-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/45">On this page</p>
              {page.sections.map((s, i) => (
                <a key={i} href={`#s${i + 1}`} className="block text-[#1a1a1a]/65 hover:text-[#1a1a1a] leading-snug">{s.heading}</a>
              ))}
              {page.faqs.length > 0 && <a href="#faq" className="block text-[#1a1a1a]/65 hover:text-[#1a1a1a]">FAQ</a>}
              {page.sources && page.sources.length > 0 && <a href="#sources" className="block text-[#1a1a1a]/65 hover:text-[#1a1a1a]">Official sources</a>}
            </nav>
          </aside>

          <div className="lg:col-span-9 space-y-16 md:space-y-24">
            {page.sections.map((s, i) => <Section key={i} s={s} i={i} />)}

            {extra}

            {page.faqs.length > 0 && (
              <section id="faq" className="scroll-mt-28">
                <h2 className="font-serif text-3xl md:text-4xl mb-10">Frequently asked questions</h2>
                <div className="border-t border-[#1a1a1a]/20">
                  {page.faqs.map((f) => (
                    <details key={f.q} className="group border-b border-[#1a1a1a]/20">
                      <summary className="cursor-pointer list-none py-6 flex items-start justify-between gap-6">
                        <span className="font-serif text-xl leading-snug">{f.q}</span>
                        <span aria-hidden className="shrink-0 mt-1 w-8 h-8 border border-[#1a1a1a] grid place-items-center text-lg group-open:rotate-45 group-open:bg-[#1a1a1a] group-open:text-[#CCFF00] transition-transform">+</span>
                      </summary>
                      <p className="pb-6 text-lg leading-relaxed text-[#1a1a1a]/75 max-w-[70ch]">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {page.sources && page.sources.length > 0 && (
              <section id="sources" className="scroll-mt-28 border-t border-[#1a1a1a]/20 pt-10">
                <h2 className="font-serif text-2xl md:text-3xl mb-2">Official sources</h2>
                <p className="text-sm text-[#1a1a1a]/60 mb-6">
                  Every figure above was checked against these pages on <time dateTime={page.updated}>{longDate(page.updated)}</time>. Governments change thresholds without notice — confirm on the source before you act.
                </p>
                <ul className="space-y-3">
                  {page.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-[#1a1a1a]/30 underline-offset-4 hover:decoration-[#1a1a1a] break-words">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>

      <section className="py-24 bg-[#1a1a1a] text-[#F2F0E9]">
        <div className="px-4 md:px-8 max-w-[1400px] mx-auto">
          <h2 className="font-serif text-4xl md:text-6xl leading-tight mb-10 max-w-[20ch] [text-wrap:balance]">Not sure this route is yours?</h2>
          <div className="flex flex-wrap gap-4">
            {page.closing.map((c, i) => <Cta key={c.href} cta={c} primary={i === 0} dark={i !== 0} />)}
          </div>
        </div>
      </section>
    </article>
  );
}
