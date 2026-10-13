// ============================================================================
// Component: components/fa/FaPnpHub.tsx
// /fa/pnp — the Entrepreneur PNP product page. Unlike FaPageLayout (a long
// guide), this is a hub: what we do, every province at a glance with its
// status, the route in six steps, and links on to the guides. Copy lives in
// content/fa/pnp.ts.
// ============================================================================
import React from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Link } from '@/navigation';
import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/seo';
import { faqJsonLd, breadcrumbJsonLd, faWebPageJsonLd } from '@/lib/fa/content';
import { faDate, isoDate } from '@/lib/fa/format';
import { TELEGRAM_URL } from '@/content/fa/home';
import { page, provinces, otherProvinces, route, service, related, CHECKED } from '@/content/fa/pnp';
import Reveal from './motion/Reveal';
import MaskText from './motion/MaskText';
import Rule from './motion/Rule';
import HeroImage from './motion/HeroImage';
import Faq from './motion/Faq';

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const faNum = (n: number) => String(n).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

/** /en/ paths and absolute URLs are plain anchors; the rest stay in /fa. */
function SmartLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  if (/^https?:\/\//.test(href)) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
  }
  if (href.startsWith('/en/')) return <a href={href} className={className}>{children}</a>;
  return <Link href={href} className={className}>{children}</Link>;
}

function SectionHead({ id, title, lead }: { id: string; title: string; lead?: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-28 mb-10 md:mb-14">
      <Rule className="mb-5" />
      <MaskText as="h2" text={title} className="font-estedad font-black text-3xl md:text-5xl leading-tight max-w-[22ch] [text-wrap:balance]" />
      {lead && <p className="mt-5 text-lg leading-[1.9] text-[#1a1a1a]/70 max-w-[64ch]">{lead}</p>}
    </div>
  );
}

export default function FaPnpHub() {
  const trail = [{ name: 'برنامه‌های استانی', path: page.path }];

  return (
    <article className="w-full bg-[#F2F0E9] font-vazir">
      <JsonLd data={[faWebPageJsonLd(page), faqJsonLd(page.faqs), breadcrumbJsonLd(SITE_URL, [{ name: 'خانه', path: '' }, ...trail])]} />

      {/* HERO */}
      <header className="relative isolate overflow-hidden bg-[#1a1a1a] text-[#F2F0E9]">
        <div className="absolute inset-0">
          <HeroImage src={`/fa/img/${page.image}.webp`} alt={page.imageAlt ?? ''} sizes="100vw" className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#1a1a1a] via-[#1a1a1a]/70 to-[#1a1a1a]/20" />
        </div>

        <div className="relative px-4 md:px-8 max-w-[1400px] mx-auto">
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#F2F0E9]/55 pt-10 md:pt-12">
            <Link href="/" className="hover:text-[#CCFF00]">خانه</Link>
            <span className="text-[#F2F0E9]/25">/</span>
            <span className="text-[#F2F0E9]">برنامه‌های استانی</span>
          </nav>

          <div className="max-w-[62ch] pt-10 pb-12 md:pt-14 md:pb-20">
            <Reveal>
              <p className="flex items-center gap-3 text-[13px] text-[#CCFF00]">
                <span className="h-px w-8 bg-[#CCFF00]" aria-hidden />
                {page.hero.eyebrow}
              </p>
              <MaskText text={page.hero.headline} className="mt-5 font-estedad font-black text-[2.5rem] md:text-6xl lg:text-[4.5rem] leading-[1.13] max-w-[19ch] [text-wrap:balance]" />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 text-lg md:text-xl leading-[1.9] text-[#F2F0E9]/75 max-w-[58ch]">{page.hero.sub}</p>
            </Reveal>
            <Reveal delay={0.18} className="mt-10 flex flex-wrap gap-4">
              <Link href={page.hero.cta.href} className="group inline-flex items-center gap-4 bg-[#CCFF00] text-[#1a1a1a] px-8 py-5 font-bold hover:bg-[#F2F0E9] transition-colors duration-300">
                {page.hero.cta.label}
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <a href="#provinces" className="inline-flex items-center gap-3 border border-[#F2F0E9]/40 px-6 py-4 font-bold hover:bg-[#F2F0E9] hover:text-[#1a1a1a] transition-colors duration-300">
                مقایسه‌ی استان‌ها
              </a>
            </Reveal>
          </div>

          <div className="border-t border-[#F2F0E9]/15 py-4 text-xs text-[#F2F0E9]/55">
            آخرین بازبینی: <time dateTime={isoDate(page.updated)}>{faDate(page.updated)}</time>
          </div>
        </div>
      </header>

      <div className="px-4 md:px-8 max-w-[1400px] mx-auto border-x border-[#1a1a1a]/10 py-16 md:py-24 space-y-24 md:space-y-32">

        {/* PROVINCES — the five we specialise in */}
        <section>
          <SectionHead
            id="provinces"
            title="پنج استانی که با آن‌ها کار می‌کنیم"
            lead={<>همه‌ی ارقام از صفحه‌های رسمی خود استان است و در <time dateTime={CHECKED}>{faDate(CHECKED)}</time> بازبینی شده. مبالغ به دلار کانادا است. هر راهنما منبع رسمی‌اش را فهرست کرده؛ استان‌ها آستانه‌ها را بی‌اعلام تغییر می‌دهند.</>}
          />
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-[#1a1a1a]/15 border border-[#1a1a1a]/15">
            {provinces.map((p, i) => (
              <Reveal as="li" key={p.href} delay={Math.min(i * 0.05, 0.25)} className="bg-[#F2F0E9]">
                <SmartLink href={p.href} className="group flex h-full flex-col p-7 md:p-8 hover:bg-white transition-colors duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-estedad font-black text-2xl md:text-3xl">{p.name}</h3>
                      <p dir="ltr" className="mt-1 text-xs text-[#1a1a1a]/55 text-start">{p.stream}</p>
                    </div>
                    <span className={`shrink-0 mt-2 h-2.5 w-2.5 rounded-full ${p.open ? 'bg-[#7FB800]' : 'bg-[#C2410C]'}`} aria-hidden />
                  </div>
                  <p className={`mt-5 text-sm leading-relaxed font-bold ${p.open ? 'text-[#1a1a1a]/80' : 'text-[#C2410C]'}`}>{p.status}</p>
                  <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 text-sm">
                    <dt className="text-[#1a1a1a]/55">دارایی خالص</dt><dd>{p.netWorth}</dd>
                    <dt className="text-[#1a1a1a]/55">سرمایه‌گذاری</dt><dd>{p.investment}</dd>
                    <dt className="text-[#1a1a1a]/55">زبان</dt><dd dir="ltr" className="text-end">{p.language}</dd>
                    <dt className="text-[#1a1a1a]/55">پیش از نامزدی</dt><dd>{p.beforeNomination}</dd>
                  </dl>
                  <span className="mt-auto pt-8 inline-flex items-center gap-2 font-bold text-sm">
                    {p.guide === 'fa' ? 'راهنمای کامل' : 'راهنمای انگلیسی'}
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </span>
                </SmartLink>
              </Reveal>
            ))}
            {/* The sixth cell closes the grid with the one action that fits every reader. */}
            <Reveal as="li" delay={0.25} className="bg-[#1a1a1a] text-[#F2F0E9]">
              <Link href="/which-path" className="group flex h-full flex-col justify-between p-7 md:p-8 hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors duration-300">
                <p className="font-estedad font-black text-2xl md:text-3xl leading-snug">نمی‌دانید کدام استان؟</p>
                <p className="mt-4 text-sm leading-relaxed opacity-75">در چند دقیقه ببینید دارایی، سابقه و زبان شما با کدام مسیر می‌خواند.</p>
                <span className="mt-8 inline-flex items-center gap-2 font-bold text-sm">ارزیابی رایگان <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /></span>
              </Link>
            </Reveal>
          </ul>

          <div className="mt-14">
            <h3 className="font-estedad font-bold text-xl mb-5">استان‌های دیگر</h3>
            <ul className="border-t border-[#1a1a1a]/20">
              {otherProvinces.map((o) => (
                <li key={o.name} className="border-b border-[#1a1a1a]/20">
                  {o.href ? (
                    <SmartLink href={o.href} className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4 hover:bg-white/60 transition-colors">
                      <span className="font-bold">{o.name}</span>
                      <span className="text-sm text-[#1a1a1a]/60 flex items-center gap-2">{o.note} <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /></span>
                    </SmartLink>
                  ) : (
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                      <span className="font-bold">{o.name}</span>
                      <span className="text-sm text-[#1a1a1a]/60">{o.note}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SERVICE — the product */}
        <section className="-mx-4 md:-mx-8 px-4 md:px-8 py-16 md:py-24 bg-[#1a1a1a] text-[#F2F0E9]">
          <div id="service" className="scroll-mt-28 mb-12 md:mb-16 max-w-[64ch]">
            <span className="block h-px w-12 bg-[#CCFF00] mb-5" aria-hidden />
            <h2 className="font-estedad font-black text-3xl md:text-5xl leading-tight [text-wrap:balance]">کار ما در مسیر کارآفرینی استانی</h2>
            <p className="mt-5 text-lg leading-[1.9] text-[#F2F0E9]/70">
              ما وکیل یا مشاور رسمی مهاجرت نیستیم و پرونده ثبت نمی‌کنیم. کار ما پیش از ثبت است: شما و کسب‌وکارتان را برای پذیرش استان آماده می‌کنیم.
            </p>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {service.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.08}>
                <p className="font-estedad font-black text-5xl text-[#CCFF00]">{faNum(i + 1)}</p>
                <h3 className="mt-4 font-estedad font-bold text-2xl">{s.title}</h3>
                <p className="mt-3 leading-[1.9] text-[#F2F0E9]/70">{s.body}</p>
              </Reveal>
            ))}
          </ol>
          <div className="mt-14 flex flex-wrap gap-4">
            <Link href="/mentorship" className="group inline-flex items-center gap-4 bg-[#CCFF00] text-[#1a1a1a] px-8 py-5 font-bold hover:bg-[#F2F0E9] transition-colors duration-300">
              برنامه‌ی منتورشیپ
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 border border-[#F2F0E9]/40 px-6 py-4 font-bold hover:bg-[#F2F0E9] hover:text-[#1a1a1a] transition-colors duration-300">
              سؤال در تلگرام <Send className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* ROUTE */}
        <section>
          <SectionHead
            id="route"
            title="مسیر، از امروز تا اقامت دائم"
            lead="ترتیب کلی در هر پنج استان یکی است: اول مجوز کار، بعد اداره‌ی واقعی کسب‌وکار، بعد نامزدی. جزئیات هر استان در راهنمای خودش است."
          />
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            {route.map((s, i) => (
              <Reveal as="li" key={s.title} delay={Math.min(i * 0.05, 0.25)} className="border-t border-[#1a1a1a] pt-5">
                <p className="text-sm text-[#1a1a1a]/50">مرحله‌ی {faNum(i + 1)}</p>
                <h3 className="mt-2 font-estedad font-bold text-xl">{s.title}</h3>
                <p className="mt-3 leading-[1.9] text-[#1a1a1a]/70">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* RELATED */}
        <section>
          <SectionHead id="related" title="صفحه‌های مرتبط" />
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]/15 border border-[#1a1a1a]/15">
            {related.map((r) => (
              <li key={r.href} className="bg-[#F2F0E9]">
                <SmartLink href={r.href} className="group flex h-full flex-col p-6 hover:bg-white transition-colors duration-300">
                  <span className="font-estedad font-bold text-lg flex items-center justify-between gap-4">
                    {r.label}
                    <ArrowLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-1 transition-transform" />
                  </span>
                  <span className="mt-2 text-sm text-[#1a1a1a]/60 leading-relaxed">{r.note}</span>
                </SmartLink>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl">
          <SectionHead id="faq" title="سؤالات متداول" />
          <Faq items={page.faqs} idPrefix="pnp" />
        </section>
      </div>

      {/* CLOSING */}
      <section className="py-24 border-t border-[#1a1a1a] bg-[#1a1a1a] text-[#F2F0E9]">
        <div className="px-4 md:px-8 max-w-[1400px] mx-auto">
          <h2 className="font-estedad font-black text-4xl md:text-6xl leading-tight mb-10 max-w-[20ch] [text-wrap:balance]">کدام استان برای پرونده‌ی شما منطقی است؟</h2>
          <div className="flex flex-wrap gap-4">
            {page.closing.map((c, i) => (
              <SmartLink
                key={c.href}
                href={c.href}
                className={i === 0
                  ? 'group inline-flex items-center gap-4 bg-[#CCFF00] text-[#1a1a1a] px-8 py-5 font-bold hover:bg-[#F2F0E9] transition-colors duration-300'
                  : 'group inline-flex items-center gap-3 border border-[#F2F0E9]/40 px-6 py-4 font-bold hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] transition-colors duration-300'}
              >
                {c.label}
                {/^https?:/.test(c.href) ? <Send className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
              </SmartLink>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
