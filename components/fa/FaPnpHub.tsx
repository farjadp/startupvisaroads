// ============================================================================
// Component: components/fa/FaPnpHub.tsx
// /fa/pnp — the Entrepreneur PNP product page. A hub, not a guide: what we
// do, every province at a glance, the route, and links on to the guides.
// Copy lives in content/fa/pnp.ts.
//
// LOOK — a landscape-led, hushed page: full-bleed Canadian photographs on an
// ink canvas, paper bands for reading, the acid accent kept for the one
// primary action per band. Motion is slow (a breathing hero, decelerating
// reveals, one parallax band) and every bit of it drops under reduced motion.
//
// SEARCH — the answer comes first (summary), the figures sit in a real
// <table> with a caption, sources are cited on the page and in schema, and
// the province list is emitted as an ItemList.
// ============================================================================
import React from 'react';
import Image from 'next/image';
import { ArrowLeft, Send, ArrowDown } from 'lucide-react';
import { Link } from '@/navigation';
import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/seo';
import { faqJsonLd, breadcrumbJsonLd, faWebPageJsonLd } from '@/lib/fa/content';
import { faDate, isoDate } from '@/lib/fa/format';
import { TELEGRAM_URL } from '@/content/fa/home';
import { page, provinces, otherProvinces, route, service, related, summary, CHECKED } from '@/content/fa/pnp';
import Reveal from './motion/Reveal';
import MaskText from './motion/MaskText';
import Rule from './motion/Rule';
import Faq from './motion/Faq';
import Parallax from './motion/Parallax';
import SlowZoom from './motion/SlowZoom';
import Stepper from './motion/Stepper';
import CountUp from './motion/CountUp';
import Flag from './Flag';
import ProvinceCards from './pnp/ProvinceCards';

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const faNum = (n: number) => String(n).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

/** /en/ paths and absolute URLs are plain anchors; the rest stay in /fa. */
function SmartLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  if (/^https?:\/\//.test(href)) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
  }
  if (href.startsWith('/en/')) return <a href={href} hrefLang="en" className={className}>{children}</a>;
  return <Link href={href} className={className}>{children}</Link>;
}

function SectionHead({ id, title, lead, dark }: { id: string; title: string; lead?: React.ReactNode; dark?: boolean }) {
  return (
    <div id={id} className="mb-10 md:mb-14 scroll-mt-28">
      <Rule className="mb-5" />
      <MaskText as="h2" text={title} className={`font-estedad font-black text-3xl md:text-5xl leading-tight max-w-[22ch] [text-wrap:balance] ${dark ? 'text-[#F2F0E9]' : ''}`} />
      {lead && <p className={`mt-5 text-lg leading-[1.9] max-w-[64ch] ${dark ? 'text-[#F2F0E9]/70' : 'text-[#1a1a1a]/70'}`}>{lead}</p>}
    </div>
  );
}

/** The province list as schema.org ItemList, so the hub is read as a directory. */
function itemListJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'مسیرهای کارآفرینی استانی کانادا',
    itemListOrder: 'https://schema.org/ItemListUnordered',
    numberOfItems: provinces.length,
    itemListElement: provinces.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${p.name} — ${p.stream}`,
      url: p.guide === 'fa' ? `${SITE_URL}/fa${p.href}` : `${SITE_URL}${p.href}`,
    })),
  };
}

const openCount = provinces.filter((p) => p.open).length;

export default function FaPnpHub() {
  const trail = [{ name: 'برنامه‌های استانی', path: page.path }];
  const [band, closingShot] = page.gallery ?? [];

  return (
    <article className="w-full bg-[#F2F0E9] font-vazir">
      <JsonLd data={[faWebPageJsonLd(page), faqJsonLd(page.faqs), itemListJsonLd(), breadcrumbJsonLd(SITE_URL, [{ name: 'خانه', path: '' }, ...trail])]} />

      {/* HERO — the landscape is the ground; the headline sits on its quiet side. */}
      <header className="relative isolate overflow-hidden bg-[#121417] text-[#F2F0E9] min-h-[88svh] flex flex-col">
        <SlowZoom src={`/fa/img/${page.image}.webp`} alt={page.imageAlt ?? ''} className="!absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#121417]/95 via-[#121417]/55 to-[#121417]/10" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#121417] via-[#121417]/60 to-transparent" />

        <div className="relative flex-1 flex flex-col px-4 md:px-8 max-w-[1400px] w-full mx-auto">
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#F2F0E9]/55 pt-10 md:pt-12">
            <Link href="/" className="hover:text-[#CCFF00]">خانه</Link>
            <span className="text-[#F2F0E9]/25">/</span>
            <span className="text-[#F2F0E9]">برنامه‌های استانی</span>
          </nav>

          <div className="max-w-[62ch] mt-auto pt-16 pb-10 md:pb-14">
            <Reveal>
              <p className="flex items-center gap-3 text-[13px] text-[#F2F0E9]/80">
                <Flag code="ca" className="h-4 w-auto shrink-0" />
                {page.hero.eyebrow}
              </p>
              <MaskText text={page.hero.headline} className="mt-5 font-estedad font-black text-[2.6rem] md:text-6xl lg:text-[5rem] leading-[1.1] max-w-[16ch] [text-wrap:balance]" />
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 text-lg md:text-xl leading-[1.9] text-[#F2F0E9]/75 max-w-[56ch]">{page.hero.sub}</p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-4">
              <Link href={page.hero.cta.href} className="group inline-flex items-center gap-4 bg-[#CCFF00] text-[#1a1a1a] px-8 py-5 font-bold hover:bg-[#F2F0E9] transition-colors duration-300">
                {page.hero.cta.label}
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <a href="#provinces" className="group inline-flex items-center gap-3 border border-[#F2F0E9]/35 px-6 py-4 font-bold backdrop-blur-sm hover:bg-[#F2F0E9] hover:text-[#1a1a1a] transition-colors duration-300">
                مقایسه‌ی استان‌ها
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </a>
            </Reveal>
          </div>

          {/* Three numbers a reader can quote; each one is on the page below with its source. */}
          <dl className="grid grid-cols-3 border-t border-[#F2F0E9]/15 py-6 md:py-8 gap-4">
            <div>
              <dt className="text-xs text-[#F2F0E9]/55">استان‌های تخصص ما</dt>
              <dd className="mt-1 font-estedad font-black text-2xl md:text-4xl"><CountUp text={faNum(provinces.length)} /></dd>
            </div>
            <div>
              <dt className="text-xs text-[#F2F0E9]/55">پذیرش فعال کارآفرین</dt>
              <dd className="mt-1 font-estedad font-black text-2xl md:text-4xl"><CountUp text={`${faNum(openCount)} استان`} /></dd>
            </div>
            <div>
              <dt className="text-xs text-[#F2F0E9]/55">کمترین دارایی خالص</dt>
              <dd className="mt-1 font-estedad font-black text-2xl md:text-4xl"><CountUp text="۳۰۰٬۰۰۰ دلار" /></dd>
            </div>
          </dl>
          <p className="pb-5 text-xs text-[#F2F0E9]/45">
            آخرین بازبینی با منابع رسمی: <time dateTime={isoDate(page.updated)}>{faDate(page.updated)}</time>
          </p>
        </div>
      </header>

      {/* SUMMARY — the answer first, in a form an answer engine can lift whole. */}
      <section aria-labelledby="summary-h" className="px-4 md:px-8 max-w-[1400px] mx-auto py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <Rule className="mb-5" />
          <h2 id="summary-h" className="font-estedad font-black text-3xl md:text-4xl leading-tight">به زبان ساده</h2>
        </div>
        <Reveal className="lg:col-span-8">
          <p className="font-estedad font-bold text-xl md:text-2xl leading-[1.8] [text-wrap:pretty]">{summary.answer}</p>
          <ul className="mt-8 space-y-4 text-lg leading-[1.9] text-[#1a1a1a]/75">
            {summary.points.map((pt) => (
              <li key={pt} className="flex gap-4">
                <span className="mt-[0.85em] h-px w-5 bg-[#1a1a1a] shrink-0" aria-hidden />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <div className="px-4 md:px-8 max-w-[1400px] mx-auto pb-24 md:pb-32 space-y-24 md:space-y-32">
        {/* PROVINCES */}
        <section>
          <SectionHead
            id="provinces"
            title="پنج استانی که با آن‌ها کار می‌کنیم"
            lead="هر استان مسیر کارآفرینی خودش را دارد، با آستانه، روش انتخاب و زمان متفاوت. روی هر استان بزنید تا راهنمای کاملش را ببینید."
          />
          <ProvinceCards>
            <Reveal as="li" delay={0.3} className="bg-[#121417] text-[#F2F0E9]">
              <Link href="/which-path" className="group flex h-full min-h-[18rem] flex-col justify-between p-8 hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors duration-500">
                <p className="font-estedad font-black text-3xl leading-snug">نمی‌دانید کدام استان؟</p>
                <p className="mt-4 leading-relaxed opacity-75">در چند دقیقه ببینید دارایی، سابقه و زبان شما با کدام مسیر می‌خواند.</p>
                <span className="mt-8 inline-flex items-center gap-2 font-bold">ارزیابی رایگان <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /></span>
              </Link>
            </Reveal>
          </ProvinceCards>
        </section>

        {/* COMPARISON — the same figures as a real table, for readers and for machines. */}
        <section>
          <SectionHead
            id="compare"
            title="مقایسه‌ی شرایط در یک نگاه"
            lead={<>همه‌ی ارقام از صفحه‌های رسمی خود استان است و در <time dateTime={CHECKED}>{faDate(CHECKED)}</time> بازبینی شده. مبالغ به دلار کانادا است؛ استان‌ها آستانه‌ها را بی‌اعلام تغییر می‌دهند.</>}
          />
          <Reveal>
            <div className="overflow-x-auto border border-[#1a1a1a]">
              <table className="w-full min-w-[860px] text-start text-sm">
                <caption className="sr-only">مقایسه‌ی مسیرهای کارآفرینی استانی آلبرتا، منیتوبا، نوااسکوشیا، نیوبرانزویک و جزیره‌ی پرنس ادوارد در اکتبر ۲۰۲۶</caption>
                <thead className="bg-[#121417] text-[#F2F0E9]">
                  <tr>
                    <th scope="col" className="p-4 text-start font-bold">استان</th>
                    <th scope="col" className="p-4 text-start font-bold">وضعیت (اکتبر ۲۰۲۶)</th>
                    <th scope="col" className="p-4 text-start font-bold">حداقل دارایی خالص</th>
                    <th scope="col" className="p-4 text-start font-bold">حداقل سرمایه‌گذاری</th>
                    <th scope="col" className="p-4 text-start font-bold">زبان</th>
                    <th scope="col" className="p-4 text-start font-bold">پیش از نامزدی</th>
                  </tr>
                </thead>
                <tbody>
                  {provinces.map((p) => (
                    <tr key={p.href} className="border-t border-[#1a1a1a]/15 align-top hover:bg-white transition-colors">
                      <th scope="row" className="p-4 text-start font-normal">
                        <SmartLink href={p.href} className="font-estedad font-bold text-lg underline decoration-[#1a1a1a]/25 underline-offset-4 hover:decoration-[#1a1a1a]">{p.name}</SmartLink>
                        <span dir="ltr" className="block text-xs text-[#1a1a1a]/50 mt-1 text-end">{p.stream}</span>
                      </th>
                      <td className={`p-4 leading-relaxed ${p.open ? '' : 'text-[#C2410C] font-bold'}`}>{p.status}</td>
                      <td className="p-4 leading-relaxed">{p.netWorth}</td>
                      <td className="p-4 leading-relaxed">{p.investment}</td>
                      <td className="p-4 leading-relaxed" dir="ltr">{p.language}</td>
                      <td className="p-4 leading-relaxed">{p.beforeNomination}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </section>
      </div>

      {/* BAND — the one parallax moment, carrying the positioning line. */}
      {band && (
        <figure className="relative overflow-hidden bg-[#121417]">
          <Parallax distance={60} className="h-[60svh] min-h-[22rem]">
            <div className="relative w-full h-full">
              <Image src={`/fa/img/${band.src}.webp`} alt={band.alt} fill sizes="100vw" className="object-cover opacity-85" />
            </div>
          </Parallax>
          <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-[#121417] via-[#121417]/30 to-transparent">
            <div className="px-4 md:px-8 max-w-[1400px] w-full mx-auto pb-12 md:pb-16">
              <p className="font-estedad font-black text-[#F2F0E9] text-3xl md:text-5xl max-w-[22ch] leading-[1.3] [text-wrap:balance]">ما وکیل مهاجرتی نیستیم — شما و کسب‌وکارتان را برای پذیرش استان آماده می‌کنیم.</p>
              {band.caption && <p className="mt-4 text-sm text-[#F2F0E9]/60">{band.caption}</p>}
            </div>
          </figcaption>
        </figure>
      )}

      {/* SERVICE — the product */}
      <section className="bg-[#121417] text-[#F2F0E9] py-20 md:py-28">
        <div className="px-4 md:px-8 max-w-[1400px] mx-auto">
          <SectionHead
            id="service"
            dark
            title="کار ما در مسیر کارآفرینی استانی"
            lead="ما پرونده ثبت نمی‌کنیم؛ کار ما پیش از ثبت است. ثبت را خودتان یا مشاور رسمی دارای مجوز انجام می‌دهد، با پرونده‌ای که از قبل آماده است."
          />
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#F2F0E9]/10">
            {service.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.1} className="bg-[#121417] p-8 md:p-10">
                <p className="font-estedad font-black text-6xl text-[#CCFF00]/90">{faNum(i + 1)}</p>
                <h3 className="mt-6 font-estedad font-bold text-2xl">{s.title}</h3>
                <p className="mt-3 leading-[1.9] text-[#F2F0E9]/70">{s.body}</p>
              </Reveal>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/mentorship" className="group inline-flex items-center gap-4 bg-[#CCFF00] text-[#1a1a1a] px-8 py-5 font-bold hover:bg-[#F2F0E9] transition-colors duration-300">
              برنامه‌ی منتورشیپ
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 border border-[#F2F0E9]/35 px-6 py-4 font-bold hover:bg-[#F2F0E9] hover:text-[#1a1a1a] transition-colors duration-300">
              سؤال در تلگرام <Send className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <div className="px-4 md:px-8 max-w-[1400px] mx-auto py-24 md:py-32 space-y-24 md:space-y-32">
        {/* ROUTE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <SectionHead
              id="route"
              title="مسیر، از امروز تا اقامت دائم"
              lead="ترتیب کلی در هر پنج استان یکی است: اول مجوز کار، بعد اداره‌ی واقعی کسب‌وکار، بعد نامزدی. جزئیات هر استان در راهنمای خودش است."
            />
          </div>
          <div className="lg:col-span-7">
            <Stepper steps={route.map((s, i) => ({ n: faNum(i + 1), title: s.title, body: s.body }))} />
          </div>
        </section>

        {/* OTHER PROVINCES */}
        <section>
          <SectionHead id="others" title="استان‌های دیگر کانادا" lead="این استان‌ها مسیر کارآفرینی‌ای ندارند که امروز به کارآفرین ایرانی توصیه کنیم، یا مسیرشان مهارتی است. راهنمای انگلیسی‌شان را به‌روز نگه می‌داریم." />
          <ul className="border-t border-[#1a1a1a]/20">
            {otherProvinces.map((o) => (
              <li key={o.name} className="border-b border-[#1a1a1a]/20">
                {o.href ? (
                  <SmartLink href={o.href} className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5 hover:bg-white/60 transition-colors">
                    <span className="font-estedad font-bold text-lg">{o.name}</span>
                    <span className="text-sm text-[#1a1a1a]/60 flex items-center gap-2">{o.note} <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /></span>
                  </SmartLink>
                ) : (
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5">
                    <span className="font-estedad font-bold text-lg">{o.name}</span>
                    <span className="text-sm text-[#1a1a1a]/60">{o.note}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* RELATED */}
        <section>
          <SectionHead id="related" title="صفحه‌های مرتبط" />
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]/15 border border-[#1a1a1a]/15">
            {related.map((r, i) => (
              <Reveal as="li" key={r.href} delay={Math.min(i * 0.05, 0.25)} className="bg-[#F2F0E9]">
                <SmartLink href={r.href} className="group flex h-full flex-col p-6 md:p-7 hover:bg-white transition-colors duration-300">
                  <span className="font-estedad font-bold text-lg flex items-center justify-between gap-4">
                    {r.label}
                    <ArrowLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-1 transition-transform" />
                  </span>
                  <span className="mt-2 text-sm text-[#1a1a1a]/60 leading-relaxed">{r.note}</span>
                </SmartLink>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <SectionHead id="faq" title="سؤالات متداول" />
          </div>
          <div className="lg:col-span-8">
            <Faq items={page.faqs} idPrefix="pnp" />
          </div>
        </section>

        {/* SOURCES */}
        {page.sources && (
          <section id="sources" className="scroll-mt-28 border-t border-[#1a1a1a]/20 pt-10">
            <h2 className="font-estedad font-black text-2xl md:text-3xl mb-2">منابع رسمی</h2>
            <p className="text-sm text-[#1a1a1a]/60 mb-6">
              ارقام این صفحه در <time dateTime={isoDate(page.updated)}>{faDate(page.updated)}</time> با این صفحه‌ها تطبیق داده شده است. پیش از هر تصمیم، منبع را خودتان ببینید.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3" dir="ltr">
              {page.sources.map((s) => (
                <li key={s.url} className="text-start text-sm">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-[#1a1a1a]/30 underline-offset-4 hover:decoration-[#1a1a1a] break-words">{s.label}</a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* CLOSING — a second landscape, the last call to action on it. */}
      <section className="relative isolate overflow-hidden bg-[#121417] text-[#F2F0E9]">
        {closingShot && (
          <div className="absolute inset-0 -z-10">
            <Image src={`/fa/img/${closingShot.src}.webp`} alt={closingShot.alt} fill sizes="100vw" className="object-cover opacity-45" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#121417] via-[#121417]/70 to-[#121417]/30" />
          </div>
        )}
        <div className="px-4 md:px-8 max-w-[1400px] mx-auto py-28 md:py-36">
          <Reveal>
            <h2 className="font-estedad font-black text-4xl md:text-6xl leading-tight mb-10 max-w-[18ch] [text-wrap:balance]">کدام استان برای پرونده‌ی شما منطقی است؟</h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap gap-4">
            {page.closing.map((c, i) => (
              <SmartLink
                key={c.href}
                href={c.href}
                className={i === 0
                  ? 'group inline-flex items-center gap-4 bg-[#CCFF00] text-[#1a1a1a] px-8 py-5 font-bold hover:bg-[#F2F0E9] transition-colors duration-300'
                  : 'group inline-flex items-center gap-3 border border-[#F2F0E9]/40 px-6 py-4 font-bold hover:bg-[#F2F0E9] hover:text-[#1a1a1a] transition-colors duration-300'}
              >
                {c.label}
                {/^https?:/.test(c.href) ? <Send className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
              </SmartLink>
            ))}
          </Reveal>
        </div>
      </section>
    </article>
  );
}
