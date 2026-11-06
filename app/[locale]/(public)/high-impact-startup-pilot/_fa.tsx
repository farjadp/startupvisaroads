// ============================================================================
// app/[locale]/(public)/high-impact-startup-pilot/_fa.tsx
// The Persian twin of the pilot page: same dossier, same three forms a fact
// can take (ink / highlight / dotted blank), same photographs and motion,
// written right to left in the Persian site's own type (Estedad display,
// Vazir text, Persian digits in prose, Latin for programme codes and
// quotations, Jalali for the review date, ISO in <time> and JSON-LD).
//
// Copy lives in content/fa/high-impact-startup-pilot.ts: `page` for the
// metadata, facts, FAQ and sources; QUOTES_FA / FILE_FA / TIMELINE_FA /
// BEFORE_FA / READINGS_FA for the dossier. Nothing here is translated at
// render time.
// ============================================================================
import React from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight, Send } from 'lucide-react';
import { Link } from '@/navigation';
import JsonLd from '@/components/JsonLd';
import Flag from '@/components/fa/Flag';
import Faq from '@/components/fa/motion/Faq';
import HeroImage from '@/components/fa/motion/HeroImage';
import Parallax from '@/components/fa/motion/Parallax';
import Reveal from '@/components/fa/motion/Reveal';
import ScrollProgress from '@/components/fa/motion/ScrollProgress';
import { SITE_URL } from '@/lib/seo';
import { breadcrumbJsonLd, faWebPageJsonLd, faqJsonLd, type FaCta } from '@/lib/fa/content';
import { faDate, isoDate, toPersianDigits } from '@/lib/fa/format';
import { page, BEFORE_FA, FILE_FA, QUOTES_FA, READINGS_FA, TIMELINE_FA } from '@/content/fa/high-impact-startup-pilot';
import { Count, FileTable, RiseWords, Stagger, Stamp, TimelineDraw, type MotionLabels } from './_motion';

const LABELS: MotionLabels = {
  notPublished: 'منتشر نشده',
  reported: '· گزارش‌شده',
  filters: { all: 'همه‌ی فیلدها', official: 'فقط گفته‌های IRCC', blank: 'فقط جاهای خالی' },
  field: 'فیلد',
  paused: 'متوقف',
  announced: 'اعلام‌شده',
  caption: 'مقایسه‌ی فیلد به فیلد ویزای استارتاپ متوقف‌شده‌ی کانادا و پایلوت اعلام‌شده‌ی High Impact Start-up؛ خط نقطه‌چین یعنی IRCC چیزی منتشر نکرده',
  empty: 'در این نما چیزی نیست.',
  source: 'منبع',
  ours: 'برآورد ما',
};

const eyebrow = 'font-vazir text-[13px] font-bold text-[#B01C12]';
const eyebrowLight = 'font-vazir text-[13px] font-bold text-[#FF8F85]';

function Src({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-0.5 font-bold underline underline-offset-4 ${light ? 'decoration-[#FF8F85] hover:text-[#FF8F85]' : 'decoration-[#D52B1E] hover:text-[#B01C12]'}`}
    >
      {children} <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
    </a>
  );
}

function Reported({ children }: { children: React.ReactNode }) {
  return (
    <mark className="bg-[#CCFF00] px-1 py-0.5 text-[#1a1a1a] [box-decoration-break:clone]">
      {children} <span className="font-vazir text-[10px] font-bold">· گزارش‌شده</span>
    </mark>
  );
}

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

function Cta({ cta, tone }: { cta: FaCta; tone: 'red' | 'outline-light' | 'outline-dark' }) {
  const cls =
    tone === 'red'
      ? 'group inline-flex items-center gap-3 rounded-full bg-[#D52B1E] px-6 py-3.5 font-vazir text-sm font-bold text-white transition-transform hover:-translate-y-0.5'
      : tone === 'outline-light'
        ? 'group inline-flex items-center gap-3 rounded-full border border-white/40 px-6 py-3.5 font-vazir text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#1a1a1a]'
        : 'group inline-flex items-center gap-3 rounded-full border border-[#1a1a1a] px-6 py-3.5 font-vazir text-sm font-bold text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-white';
  const external = /^https?:/.test(cta.href);
  const inner = (
    <>
      <span>{cta.label}</span>
      {external ? <Send className="h-4 w-4" aria-hidden="true" /> : <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />}
    </>
  );
  return external ? (
    <a href={cta.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  ) : (
    <Link href={cta.href} className={cls}>{inner}</Link>
  );
}

const PILOT_FILLED = FILE_FA.filter((r) => r.pilot.kind === 'filled').length;

export default function HighImpactFa() {
  const trail = [
    { name: 'خانه', path: '' },
    { name: 'ویزای استارتاپ کانادا', path: '/canada-startup-visa' },
    { name: 'پایلوت High Impact Start-up', path: page.path },
  ];

  return (
    <article className="w-full bg-[#F2F0E9] font-vazir text-[#1a1a1a]">
      <ScrollProgress />
      <JsonLd data={[faWebPageJsonLd(page), faqJsonLd(page.faqs), breadcrumbJsonLd(SITE_URL, trail)]} />

      {/* ===== HERO ===== */}
      <header className="relative isolate overflow-hidden bg-[#2A0C0A] text-white">
        <div className="absolute inset-0">
          <HeroImage src="/fa/img/high-impact.webp" alt={page.imageAlt ?? ''} sizes="100vw" className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#2A0C0A] via-[#2A0C0A]/85 to-[#2A0C0A]/15" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#2A0C0A] to-transparent" />
        </div>

        <div className="container relative mx-auto px-6 pb-16 pt-8 lg:pb-20">
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-white/60">
            {trail.map((t, i) => (
              <React.Fragment key={t.path}>
                {i > 0 && <span className="text-white/30">/</span>}
                {t.path === page.path ? <span className="text-white/90">{t.name}</span> : <Link href={t.path} className="hover:text-white">{t.name}</Link>}
              </React.Fragment>
            ))}
          </nav>

          <div className="mt-10 max-w-3xl">
            <Reveal>
              <p className="flex flex-wrap items-center gap-3 text-[13px] font-bold text-white/80">
                <Flag code="ca" className="h-5 w-auto shrink-0" />
                کانادا · پایلوت دولت فدرال
                <Stamp className="inline-flex items-center rounded-full border-2 border-[#D52B1E] bg-[#D52B1E]/90 px-3 py-1 text-[11px] text-white">
                  اعلام‌شده · هنوز باز نشده
                </Stamp>
              </p>
              <h1 className="mt-5 font-estedad text-[2.4rem] font-black leading-[1.13] md:text-6xl lg:text-[4.2rem] [text-wrap:balance]">
                پایلوت <span dir="ltr" className="inline-block">High Impact Start-up</span>
                <span className="mt-3 block max-w-[30ch] font-vazir text-lg font-bold leading-snug md:text-xl">
                  جایگزین اعلام‌شده‌ی ویزای استارتاپ کانادا.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p data-speakable className="mt-5 max-w-[56ch] text-base leading-[1.9] text-white/80 md:text-lg">
                {page.hero.sub}
              </p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60">
                <span>نویسنده: <span className="text-white">فرجاد پورمحمد</span></span>
                <span>آخرین بازبینی: <time dateTime={isoDate(page.updated)} className="text-white">{faDate(page.updated)}</time></span>
                <span>تطبیق‌شده با IRCC و Canada Gazette</span>
              </p>
            </Reveal>
            <Reveal delay={0.18} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#file" className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#D52B1E] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
                پرونده را باز کنید <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
              </a>
              <Cta cta={page.hero.cta} tone="outline-light" />
            </Reveal>
          </div>
        </div>
      </header>

      {/* ===== IN IRCC'S OWN WORDS ===== */}
      <section aria-labelledby="words-h" className="border-b border-[#1a1a1a]/10 bg-white px-6 py-16 lg:py-20">
        <div className="container mx-auto grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <p className={eyebrow}>کل سابقه‌ی رسمی</p>
            <h2 id="words-h" className="mt-2 font-estedad text-3xl font-black leading-tight md:text-4xl">IRCC واقعاً چه گفته است</h2>
            <p className="mt-4 max-w-[42ch] text-[15px] leading-[1.9] text-[#1a1a1a]/75">
              پایلوت High Impact Start-up برنامه‌ای است که IRCC می‌خواهد جای ویزای استارتاپ کانادا بگذارد؛ ویزایی که به بنیان‌گذارانِ پشتیبانی‌شده با یک صندوق سرمایه‌گذاری، گروه فرشته یا انکوباتور تأییدشده اقامت دائم می‌داد. هر چه دولت درباره‌ی پایلوت منتشر کرده در سه سطر جا می‌شود. سومی دست‌دوم است.
            </p>
          </div>

          <ol className="divide-y divide-[#1a1a1a]/10 border-y border-[#1a1a1a]/10">
            {QUOTES_FA.map((q, i) => (
              <li key={q.href + i} className="grid gap-3 py-8 md:grid-cols-[3rem_minmax(0,1fr)] md:gap-6">
                <span className="font-estedad text-3xl font-black text-[#D52B1E]" aria-hidden="true">{toPersianDigits(i + 1)}</span>
                <div>
                  <blockquote dir="ltr" lang="en" className="text-start font-serif text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.15]">
                    “{q.official ? <RiseWords text={q.text} delay={i * 0.15} /> : <Reported><RiseWords text={q.text} delay={i * 0.15} /></Reported>}”
                  </blockquote>
                  <p className="mt-3 text-sm text-[#1a1a1a]/70">
                    <Src href={q.href}>{q.who}</Src>، {q.when}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== FIGURE: Toronto ===== */}
      <figure className="relative border-b border-[#1a1a1a]/10 bg-[#1a1a1a]">
        <Parallax distance={40} className="h-[46vw] max-h-[560px] min-h-[260px]">
          <Image src="/fa/img/high-impact-2.webp" alt={page.gallery?.[0]?.alt ?? ''} fill sizes="100vw" className="object-cover object-center" />
        </Parallax>
        <figcaption className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-6 py-4 text-xs text-white/70">
          <span>{page.gallery?.[0]?.caption}</span>
          <span className="flex items-center gap-2"><Flag code="ca" className="h-3.5 w-auto" /> انتاریو، کانادا</span>
        </figcaption>
      </figure>

      {/* ===== THE FILE ===== */}
      <section id="file" aria-labelledby="file-h" className="scroll-mt-24 border-b border-[#1a1a1a]/10 px-6 py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className={eyebrow}>پرونده</p>
              <h2 id="file-h" className="mt-2 max-w-3xl font-estedad text-3xl font-black leading-tight md:text-4xl">برنامه‌ی قدیمی، پایلوت جدید، فیلد به فیلد</h2>
            </div>
            <p className="font-estedad text-2xl font-black leading-tight">
              <Count to={PILOT_FILLED} digits="fa" className="text-[#D52B1E]" /> از {toPersianDigits(FILE_FA.length)} فیلد پایلوت پر شده
            </p>
          </div>

          <div className="mt-8">
            <FileTable rows={FILE_FA} oldTitle="ویزای استارتاپ" pilotTitle="پایلوت High Impact Start-up" labels={LABELS} rtl />
          </div>

          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-xs text-[#1a1a1a]/70">
            <div className="flex items-center gap-2"><dt className="font-bold text-[#1a1a1a]">جوهر</dt><dd>گفته‌ی IRCC، با لینک به صفحه‌اش.</dd></div>
            <div className="flex items-center gap-2"><dt><mark className="bg-[#CCFF00] px-1 font-bold text-[#1a1a1a]">هایلایت</mark></dt><dd>رسانه یا اندیشکده، نه IRCC.</dd></div>
            <div className="flex items-center gap-2"><dt className="font-bold text-[#B01C12]">خط نقطه‌چین</dt><dd>چیزی منتشر نشده. ما پرش نمی‌کنیم.</dd></div>
          </dl>
        </div>
      </section>

      {/* ===== TIMELINE ===== */}
      <section aria-labelledby="timeline-h" className="border-b border-[#1a1a1a]/10 bg-white px-6 py-16 lg:py-20">
        <div className="container mx-auto">
          <p className={eyebrow}>چطور به این‌جا رسیدیم</p>
          <h2 id="timeline-h" className="mt-2 max-w-3xl font-estedad text-3xl font-black leading-tight md:text-4xl">از توقف تا پایلوت، تا جایی که سند هست</h2>
          <TimelineDraw items={TIMELINE_FA} labels={LABELS} rtl />
          <p className="mt-10 max-w-[70ch] text-xs leading-relaxed text-[#1a1a1a]/65">
            ۳۱ دسامبر ۲۰۲۵ و ۳۰ ژوئن ۲۰۲۶ دو ددلاین جداگانه‌ی برنامه‌ی قدیمی‌اند، هر دو از IRCC. <Src href={page.sources?.[4]?.url ?? '#'}>Canada Gazette، ۲۰ دسامبر ۲۰۲۵</Src>
          </p>
        </div>
      </section>

      {/* ===== WHY 2027 ===== */}
      <section aria-labelledby="why2027-h" className="relative isolate overflow-hidden bg-[#2A0C0A] text-white">
        <div className="absolute inset-0 -z-10">
          <Parallax distance={48} className="h-full">
            <Image src="/fa/img/high-impact-3.webp" alt={page.gallery?.[1]?.alt ?? ''} fill sizes="100vw" className="object-cover object-center" />
          </Parallax>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-l from-[#2A0C0A] via-[#2A0C0A]/80 to-[#2A0C0A]/25" />
        <MapleLeaf className="pointer-events-none absolute -bottom-16 left-4 h-[120%] w-auto text-[#D52B1E] opacity-20" />
        <div className="container relative mx-auto grid gap-10 px-6 py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:py-24">
          <div>
            <p className={eyebrowLight}>برداشت ما، با همین برچسب</p>
            <h2 id="why2027-h" className="mt-3 font-estedad text-[clamp(1.9rem,4.2vw,3.3rem)] font-black leading-[1.2] [text-wrap:balance]">
              درِ قدیمی ۳۰ ژوئن ۲۰۲۶ بسته شد. <span className="text-[#FF8F85]">انتظار ما این است که درِ جدید در ۲۰۲۷ باز شود.</span>
            </h2>
          </div>
          <Reveal className="space-y-4 text-[15px] leading-[1.9] text-white/80 lg:pt-8" delay={0.15}>
            <p>هیچ سند IRCC تاریخی نمی‌دهد. چیزی که سند می‌دهد این است: در دسامبر ۲۰۲۵ IRCC گفت اطلاعات بیشتر در ۲۰۲۶ می‌آید. ۲۰۲۶ تقریباً تمام شده و چیزی منتشر نشده. برنامه‌ای که هنوز شرط پذیرش ندارد، باید اول شرط‌ها را منتشر کند و بعد پرونده بگیرد؛ پس بازشدن در امسال بعید است.</p>
            <p>کل پایه‌ی ۲۰۲۷ همین است، به‌اضافه‌ی آنچه در فضای مهاجرت می‌چرخد. روزی که IRCC تاریخ بدهد، این بخش با همان جایگزین می‌شود.</p>
            <p className="flex items-center gap-3 border-t border-white/15 pt-4 text-sm text-white/70">
              <Flag code="ca" className="h-5 w-auto shrink-0" />
              پرونده‌های ثبت‌شده‌ی ویزای استارتاپ همچنان بررسی می‌شوند. برای پایلوت چیزی برای ثبت وجود ندارد.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== THREE READINGS ===== */}
      <section aria-labelledby="why-h" className="border-b border-[#1a1a1a]/10 px-6 py-16 lg:py-20">
        <div className="container mx-auto grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <p className={eyebrow}>سه خوانش</p>
            <h2 id="why-h" className="mt-2 font-estedad text-3xl font-black leading-tight md:text-4xl">چرا کانادا ویزای استارتاپ را عوض می‌کند</h2>
          </div>
          <Reveal>
            <dl className="divide-y divide-[#1a1a1a]/10 border-y border-[#1a1a1a]/10">
              {READINGS_FA.map((r) => (
                <div key={r.who} className="grid gap-2 py-6 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-8">
                  <dt className="font-estedad text-xl font-black">
                    {r.who}
                    {r.tag && <span className="block font-vazir text-[11px] font-bold text-[#B01C12]">{r.tag}</span>}
                  </dt>
                  <dd className="text-[15px] leading-[1.9] text-[#1a1a1a]/80">
                    {r.reported ? <Reported>{r.lead}</Reported> : <strong>{r.lead}</strong>} {r.body} <Src href={r.href}>{r.who === 'رسانه‌ها' ? 'immigration.ca' : r.who}</Src>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ===== PREPARE ===== */}
      <section aria-labelledby="prep-h" className="border-b border-[#1a1a1a]/10 bg-white px-6 py-16 lg:py-20">
        <div className="container mx-auto">
          <p className={eyebrow}>تا باز شدن</p>
          <h2 id="prep-h" className="mt-2 max-w-3xl font-estedad text-3xl font-black leading-tight md:text-4xl">چهار کاری که در هر نسخه‌ای از قواعد به درد می‌خورد</h2>
          <Stagger
            as="ol"
            className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2"
            itemClassName="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 border-t-2 border-[#1a1a1a] pt-5"
            items={BEFORE_FA.map((b, i) => (
              <React.Fragment key={b.title}>
                <span className="font-estedad text-4xl font-black leading-none text-[#D52B1E]" aria-hidden="true">{toPersianDigits(`0${i + 1}`)}</span>
                <div>
                  <h3 className="font-estedad text-2xl font-black leading-snug">{b.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.9] text-[#1a1a1a]/75">{b.body}</p>
                </div>
              </React.Fragment>
            ))}
          />
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section aria-labelledby="faq-h" className="border-b border-[#1a1a1a]/10 px-6 py-16 lg:py-20">
        <div className="container mx-auto">
          <p className={eyebrow}>پاسخ‌های سرراست</p>
          <h2 id="faq-h" className="mb-8 mt-2 font-estedad text-3xl font-black leading-tight md:text-4xl">پایلوت High Impact Start-up: سؤالات متداول</h2>
          <Faq items={page.faqs} idPrefix="hip" />
        </div>
      </section>

      {/* ===== CLOSING ===== */}
      <section aria-labelledby="next-h" className="bg-[#2A0C0A] px-6 py-16 text-white">
        <div className="container mx-auto grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className={eyebrowLight}>با هم مرور کنیم</p>
            <h2 id="next-h" className="mt-2 font-estedad text-3xl font-black leading-tight md:text-4xl [text-wrap:balance]">باید پیش از ۲۰۲۷ حرکت کنید؟</h2>
            <p className="mt-3 max-w-[52ch] leading-[1.9] text-white/75">
              مسیرهای باز امروز را مقایسه می‌کنیم و صریح می‌گوییم صبر برای پایلوت برای شرکت شما معنی دارد یا نه. هیچ‌کس نمی‌تواند در آن جا رزرو کند، ما هم نه.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {page.closing.map((c, i) => <Cta key={c.href} cta={c} tone={i === 0 ? 'red' : 'outline-light'} />)}
            </div>
          </div>
          <div className="text-sm text-white/60">
            <Flag code="ca" className="h-6 w-auto" />
            <p className="mt-3 max-w-[44ch] leading-[1.9]">ما وکیل مهاجرتی نیستیم؛ تیم و استارتاپ شما را برای پذیرش آماده می‌کنیم.</p>
          </div>
        </div>
      </section>

      {/* ===== SOURCES ===== */}
      {page.sources && (
        <section id="sources" aria-labelledby="sources-h" className="border-b border-[#1a1a1a]/10 bg-white px-6 py-14">
          <div className="container mx-auto">
            <p className={eyebrow}>این ارقام از کجا آمده</p>
            <h2 id="sources-h" className="mt-2 font-estedad text-2xl font-black md:text-3xl">منابع رسمی</h2>
            <p className="mb-6 mt-2 max-w-[70ch] text-sm leading-[1.9] text-[#1a1a1a]/60">
              همه‌ی ارقام این صفحه در تاریخ <time dateTime={isoDate(page.updated)}>{faDate(page.updated)}</time> با این صفحه‌ها تطبیق داده شده است. دولت‌ها قواعد را بی‌اعلام تغییر می‌دهند؛ پیش از هر تصمیم، منبع را خودتان ببینید.
            </p>
            <ol className="grid max-w-4xl list-decimal gap-2 ps-5 text-sm">
              {page.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="break-words font-bold underline decoration-[#D52B1E] underline-offset-4 hover:text-[#B01C12]">{s.label}</a>
                </li>
              ))}
            </ol>
            <p className="mt-6 max-w-[70ch] text-xs leading-relaxed text-[#1a1a1a]/60">اطلاعات عمومی است، نه مشاوره‌ی حقوقی. قواعد مهاجرت تغییر می‌کند؛ پیش از اقدام، canada.ca را ببینید.</p>
          </div>
        </section>
      )}
    </article>
  );
}
