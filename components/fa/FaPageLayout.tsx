// ============================================================================
// Component: components/fa/FaPageLayout.tsx
// Renders one Persian content page from its FaPage module: hero, dated
// sections, FAQ with FAQPage JSON-LD, closing CTAs. Every Persian programme
// page uses this, so the visual system and the structured data are decided
// once. Copy never lives here — it lives in content/fa/<page>.ts.
// ============================================================================
import React from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Link } from '@/navigation';
import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/seo';
import { faqJsonLd, breadcrumbJsonLd, type FaPage, type FaCta } from '@/lib/fa/content';
import { faDate, isoDate } from '@/lib/fa/format';
import { TELEGRAM_URL, CONTACT } from '@/content/fa/home';
import StatusBanner from './StatusBanner';

// Absolute URLs and explicit /en/ paths render as plain anchors; everything
// else goes through the locale-aware Link. A Persian page may deliberately
// send the reader to English (province detail, the IRCC list) — but only
// when the copy says so.
const isExternal = (href: string) => /^https?:\/\//.test(href) || href.startsWith('/en/');

function Cta({ cta, primary }: { cta: FaCta; primary?: boolean }) {
  const cls = primary
    ? 'group inline-flex items-center gap-4 bg-[#1a1a1a] text-[#F2F0E9] px-8 py-5 hover:bg-[#CCFF00] hover:text-black transition-colors duration-300'
    : 'group inline-flex items-center gap-3 border border-[#1a1a1a] px-6 py-4 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors duration-300';
  const inner = (
    <>
      <span className="font-bold">{cta.label}</span>
      {/^https?:/.test(cta.href) ? <Send className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
    </>
  );
  return isExternal(cta.href) ? (
    <a href={cta.href} {...(/^https?:/.test(cta.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={cls}>{inner}</a>
  ) : (
    <Link href={cta.href} className={cls}>{inner}</Link>
  );
}

export default function FaPageLayout({ page, trail }: { page: FaPage; trail: { name: string; path: string }[] }) {
  return (
    <article className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] font-vazir">
      <JsonLd data={[faqJsonLd(page.faqs), breadcrumbJsonLd(SITE_URL, [{ name: 'خانه', path: '' }, ...trail])]} />

      {/* HERO */}
      <header className="pt-10 pb-16 md:pb-24 border-b border-[#1a1a1a]">
        <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#1a1a1a]/50 mb-10">
          <Link href="/" className="hover:text-[#1a1a1a]">خانه</Link>
          {trail.map((t) => (
            <React.Fragment key={t.path}>
              <span>/</span>
              {t.path === page.path ? <span className="text-[#1a1a1a]">{t.name}</span> : <Link href={t.path} className="hover:text-[#1a1a1a]">{t.name}</Link>}
            </React.Fragment>
          ))}
        </nav>

        <span className="inline-block text-[11px] font-bold text-black bg-[#CCFF00] px-2 py-1 mb-6">{page.hero.eyebrow}</span>
        <h1 className="font-estedad font-black text-4xl md:text-6xl lg:text-7xl leading-tight max-w-4xl mb-8">{page.hero.headline}</h1>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <p className="text-lg md:text-xl leading-relaxed text-[#1a1a1a]/70 max-w-2xl">{page.hero.sub}</p>
          <div className="shrink-0"><Cta cta={page.hero.cta} primary /></div>
        </div>
        <p className="mt-10 text-xs text-[#1a1a1a]/50">
          آخرین بازبینی: <time dateTime={isoDate(page.updated)}>{faDate(page.updated)}</time>
        </p>
      </header>

      {page.status && <StatusBanner status={page.status} />}

      {/* BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-16 md:py-24">
        {/* sticky TOC */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-28">
            <span className="block text-[10px] font-bold text-[#1a1a1a]/40 mb-4">در این صفحه</span>
            <ol className="space-y-3 text-sm">
              {page.sections.map((s, i) => (
                <li key={i}>
                  <a href={`#s${i + 1}`} className="text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:border-b hover:border-[#CCFF00] transition-colors">{s.heading}</a>
                </li>
              ))}
              {page.faqGroups
                ? page.faqGroups.map((g, gi) => (
                    <li key={gi}><a href={`#faq-${gi + 1}`} className="text-[#1a1a1a]/70 hover:text-[#1a1a1a]">{g.heading}</a></li>
                  ))
                : page.faqs.length > 0 && (
                    <li><a href="#faq" className="text-[#1a1a1a]/70 hover:text-[#1a1a1a]">سؤالات متداول</a></li>
                  )}
            </ol>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 text-xs font-bold border-b border-[#1a1a1a] pb-0.5 hover:text-[#CCFF00] hover:border-[#CCFF00]"
            >
              <Send className="w-3.5 h-3.5" />
              سؤال دارید؟ در تلگرام بپرسید
            </a>
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="mt-3 block text-xs text-[#1a1a1a]/60 hover:text-[#1a1a1a]" dir="ltr">
              WhatsApp {CONTACT.whatsappNumber}
            </a>
          </div>
        </aside>

        <div className="lg:col-span-9 space-y-16 md:space-y-20">
          {page.sections.map((s, i) => (
            <section key={i} id={`s${i + 1}`} className="scroll-mt-28">
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-xs font-bold text-[#CCFF00] bg-black px-2 py-1 shrink-0">{String(i + 1).padStart(2, '0').replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])}</span>
                <h2 className="font-estedad font-black text-3xl md:text-4xl leading-tight">{s.heading}</h2>
              </div>
              <div className="space-y-5 text-lg leading-[1.9] text-[#1a1a1a]/80 max-w-3xl">
                {s.body.map((p, j) => <p key={j}>{p}</p>)}
                {s.bullets && (
                  <ul className="space-y-3 ps-1">
                    {s.bullets.map((b, j) => (
                      <li key={j} className="flex gap-3">
                        <span className="mt-3 w-2 h-2 bg-[#CCFF00] shrink-0"></span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.callout && (
                  <p className="border-s-4 border-[#CCFF00] bg-[#1a1a1a] text-[#F2F0E9] ps-6 pe-6 py-5 font-bold">{s.callout}</p>
                )}
              </div>
            </section>
          ))}

          {page.faqs.length > 0 && (
            <section id="faq" className="scroll-mt-28 border-t border-[#1a1a1a] pt-16">
              <h2 className="font-estedad font-black text-3xl md:text-4xl mb-10">سؤالات متداول</h2>
              {(page.faqGroups ?? [{ heading: '', faqs: page.faqs }]).map((g, gi) => (
                <div key={gi} id={g.heading ? `faq-${gi + 1}` : undefined} className={gi > 0 ? 'mt-14 scroll-mt-28' : ''}>
                  {g.heading && <h3 className="font-estedad font-bold text-xl text-[#1a1a1a]/60 mb-4 border-b border-[#1a1a1a]/20 pb-3">{g.heading}</h3>}
                  {g.faqs.map((f) => (
                    <div key={f.q} className="border-b border-[#1a1a1a]/20 py-6 group">
                      <details>
                        <summary className="list-none cursor-pointer flex justify-between items-start gap-4 font-estedad font-bold text-xl hover:text-[#555] transition-colors">
                          <span>{f.q}</span>
                          <span className="shrink-0 text-sm text-[#CCFF00] bg-black px-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                        </summary>
                        <p className="mt-4 text-[#1a1a1a]/70 leading-[1.9] max-w-3xl">{f.a}</p>
                      </details>
                    </div>
                  ))}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>

      {/* CLOSING */}
      <section className="py-24 border-t border-[#1a1a1a] bg-[#1a1a1a] text-[#F2F0E9] -mx-4 md:-mx-8 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-xs tracking-[0.3em] text-[#F2F0E9]/50 mb-6">قدم بعدی</p>
          <h2 className="font-estedad font-black text-4xl md:text-6xl leading-tight mb-12 max-w-3xl">
            هنوز مطمئن نیستید این مسیر برای شماست؟
          </h2>
          <div className="flex flex-wrap gap-4 [&_a]:!text-[#F2F0E9] [&_a]:!border-[#F2F0E9]/40 [&_a:hover]:!bg-[#CCFF00] [&_a:hover]:!text-black [&_a:hover]:!border-[#CCFF00]">
            {page.closing.map((c, i) => <Cta key={c.href} cta={c} primary={i === 0} />)}
          </div>
        </div>
      </section>
    </article>
  );
}
