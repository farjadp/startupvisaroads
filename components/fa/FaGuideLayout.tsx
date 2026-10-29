// ============================================================================
// Component: components/fa/FaGuideLayout.tsx
// A Persian programme guide in the same design as its English twin
// (app/[locale]/(public)/country/*): the country's palette, a photo hero with
// the flag, byline and a route card, a sticky rail where the flag rises as
// sections are read, numbered stops whose first paragraph is the answer, the
// requirements self-check and step walker, the FAQ, sources and the closing.
//
// Every word comes from the page's content module and is rendered here on
// the server; long remainders fold behind "continue" but stay in the HTML.
// ============================================================================
import React from 'react';
import Image from 'next/image';
import { ArrowLeft, Send } from 'lucide-react';
import { Link } from '@/navigation';
import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/seo';
import { faqJsonLd, breadcrumbJsonLd, faWebPageJsonLd, type FaPage, type FaCta, type FaSection } from '@/lib/fa/content';
import { faDate, isoDate, toPersianDigits as fa } from '@/lib/fa/format';
import { TELEGRAM_URL, CONTACT } from '@/content/fa/home';
import { videosById } from '@/content/fa/videos';
import { flagFor } from '@/lib/fa/flags';
import { RULES } from '@/lib/fa/programmes';
import Flag, { type FlagCode } from '@/components/route/flags';
import { RouteProvider, RouteRail, RouteFinish, type RouteLabels } from '@/components/route/RouteProgress';
import VideoRail from './VideoRail';
import Eligibility from './Eligibility';
import QuizEcho from './QuizEcho';
import Downloads from './motion/Downloads';
import { FaStop, FaTick, FaCheck, FaSteps, FaCopy, type FaStep } from './FaRoute';
import { themeFor } from './faThemes';

const LABELS: Partial<RouteLabels> = {
  rail: 'پیشرفت شما در این راهنما',
  railTitle: 'با خواندن هر بخش، پرچم بالاتر می‌رود',
  routeComplete: 'مسیر کامل شد',
  flagRaised: 'پرچم بالا رفت؛ همه‌ی بخش‌ها را دیدید.',
  checkpoints: '{n} از {total} بخش',
  count: '{n} از {total}',
  digits: 'persian',
  font: 'font-vazir',
};

// No readiness verdict where it would mislead: the paused Canada Start-up
// Visa, and Israel, which is not open to the passports this site writes for.
const noSelfCheck = (path: string) => path === '/israel' || path.startsWith('/canada-startup-visa');

const NUMBERED = /^([۰-۹0-9]{1,2})[.۰-۹]?\s*[.\-–—:]?\s*/;
const isExternal = (href: string) => /^https?:\/\//.test(href) || href.startsWith('/en/');
const words = (t: string) => t.split(/\s+/).filter(Boolean).length;
/** A heading cut to a rail-sized label: up to the first colon, dash or question mark. */
const shortLabel = (h: string) => {
  const cut = h.split(/[:—–؟?]/)[0].trim();
  return cut.length > 28 ? `${cut.slice(0, 26).trim()}…` : cut;
};

/** Bullets written as "۱. …" become steps. */
function stepsOf(s: FaSection): FaStep[] | null {
  if (!s.bullets || s.bullets.length < 3) return null;
  const parsed = s.bullets.map((b) => {
    const m = b.match(NUMBERED);
    if (!m) return null;
    const rest = b.slice(m[0].length).trim();
    const cut = rest.search(/[—–:.؛]/);
    if (cut > 0 && cut < 70 && rest.slice(cut + 1).trim()) return { n: m[1], title: rest.slice(0, cut).trim(), body: rest.slice(cut + 1).trim() };
    return { n: m[1], title: rest.replace(/[.。]$/, ''), body: '' };
  });
  return parsed.every(Boolean) ? (parsed as FaStep[]) : null;
}

function Cta({ cta, className }: { cta: FaCta; className: string }) {
  const inner = (
    <>
      <span>{cta.label}</span>
      {/^https?:/.test(cta.href) ? <Send className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
    </>
  );
  return isExternal(cta.href) ? (
    <a href={cta.href} {...(/^https?:/.test(cta.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={className}>{inner}</a>
  ) : (
    <Link href={cta.href} className={className}>{inner}</Link>
  );
}

const PRIMARY = 'inline-flex items-center gap-2 rounded-full bg-[var(--ra)] px-6 py-3 text-sm font-bold text-[var(--ra-ink)] transition-transform hover:-translate-y-0.5';
const GHOST = 'inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10';

function Stop({ s, i, total, selfCheck }: { s: FaSection; i: number; total: number; selfCheck: boolean }) {
  const id = `s${i + 1}`;
  const steps = stepsOf(s);
  const [lead, ...rest] = s.body;
  const check = selfCheck && !steps && !!s.bullets && s.bullets.length >= 3 && s.bullets.length <= 8 && s.heading.slice(0, 24).includes('شرایط');
  const bullets = !steps && !check && s.bullets ? s.bullets : [];
  const restWords = words(rest.join(' ')) + words(bullets.join(' '));
  const fold = restWords > 60;
  const task = check ? 'شرایط را با خودتان بسنجید' : steps ? 'مراحل را تا آخر مرور کنید' : 'این بخش را بخوانید';
  const detail = (
    <div className="max-w-[68ch] space-y-4 text-base leading-[1.95] text-[#1a1a1a]/75">
      {rest.map((p, j) => <p key={j}>{p}</p>)}
      {bullets.length > 0 && (
        <ul className="space-y-2.5">
          {bullets.map((b, j) => (
            <li key={j} className="flex gap-3">
              <span className="mt-[0.8em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ra)]" aria-hidden />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  const white = i % 2 === 1;
  return (
    <FaStop id={id} message={`خواندید: ${shortLabel(s.heading)}`} className={`scroll-mt-40 border-b border-[#1a1a1a]/10 px-4 py-16 md:px-8 md:py-20 ${white ? 'bg-white' : 'bg-[#F2F0E9]'}`}>
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2">
          <span className="row-span-3 mt-1 h-fit rounded-lg border border-[#1a1a1a]/15 px-2 py-1 font-estedad text-xs font-black text-[#1a1a1a]/50">{fa(String(i + 1).padStart(2, '0'))}</span>
          <span className="text-xs font-bold text-[var(--ra-text)]">بخش {fa(i + 1)} از {fa(total)}</span>
          <h2 id={`${id}-q`} className="max-w-4xl font-estedad text-3xl font-black leading-[1.3] [text-wrap:balance] md:text-[2.5rem]">{s.heading}</h2>
          <span className="inline-flex items-center gap-2 text-xs text-[#1a1a1a]/60">
            <FaTick id={id} />
            {task}
          </span>
        </div>
        {lead && <p className="mb-8 max-w-[68ch] border-s-[3px] border-[var(--ra)] ps-4 text-[1.1rem] leading-[1.95] text-[#1a1a1a]/90">{lead}</p>}
        {rest.length > 0 || bullets.length > 0 ? (
          fold ? (
            <details className="group mb-6 max-w-[68ch]">
              <summary className="flex cursor-pointer list-none items-center gap-3 font-bold text-[#1a1a1a] [&::-webkit-details-marker]:hidden">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--rs)] text-base text-[var(--ra-text)] transition-transform group-open:rotate-45" aria-hidden>+</span>
                <span className="group-open:hidden">ادامه‌ی این بخش · حدود {fa(Math.max(1, Math.round(restWords / 200)))} دقیقه</span>
                <span className="hidden group-open:inline">بستن</span>
              </summary>
              <div className="pt-5">{detail}</div>
            </details>
          ) : (
            <div className="mb-6">{detail}</div>
          )
        ) : null}
        {steps && <FaSteps stopId={id} steps={steps} />}
        {check && s.bullets && <FaCheck stopId={id} items={s.bullets} />}
        {s.callout && (
          <aside className="mt-6 max-w-[68ch] rounded-2xl bg-[var(--rd)] p-6 text-white md:p-7">
            <p className="font-estedad text-lg font-bold leading-relaxed md:text-xl [text-wrap:pretty]">{s.callout}</p>
          </aside>
        )}
      </div>
    </FaStop>
  );
}

export default function FaGuideLayout({
  page,
  trail,
  extra,
  afterHero,
  beforeClosing,
}: {
  page: FaPage;
  trail: { name: string; path: string }[];
  extra?: React.ReactNode;
  afterHero?: React.ReactNode;
  beforeClosing?: React.ReactNode;
}) {
  const theme = themeFor(page.path);
  const flag = (flagFor(page.path) ?? (page.path.startsWith('/canada-startup-visa/') ? 'ca' : undefined)) as FlagCode | undefined;
  const img = page.image ? `/fa/img/${page.image}.webp` : null;
  const gallery = page.gallery ?? [];
  const rule = RULES.find((r) => r.href === page.path);
  const selfCheck = !noSelfCheck(page.path);
  const stops = [
    ...page.sections.map((s, i) => ({ id: `s${i + 1}`, label: shortLabel(s.heading) })),
    ...(page.faqs.length > 0 ? [{ id: 'faq', label: 'سؤالات متداول' }] : []),
  ];
  // Photographs spread evenly between the sections.
  const slotFor = (k: number) => Math.floor(((k + 1) * page.sections.length) / (gallery.length + 1));
  const groups = page.faqGroups ?? [{ heading: '', faqs: page.faqs }];

  return (
    <article className="w-full overflow-x-clip bg-[#F2F0E9] font-vazir text-[#1a1a1a]">
      <JsonLd data={[faWebPageJsonLd(page), faqJsonLd(page.faqs), breadcrumbJsonLd(SITE_URL, [{ name: 'خانه', path: '' }, ...trail])]} />
      <RouteProvider stops={stops} flag={flag} theme={theme} labels={LABELS}>
        {/* Hero: the answer up front, as on the English twin. */}
        <header className="relative isolate overflow-hidden bg-[var(--rd)] text-white">
          {img && <Image src={img} alt={page.imageAlt ?? ''} fill priority sizes="100vw" className="object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-l from-[color-mix(in_srgb,var(--rd)_95%,transparent)] via-[color-mix(in_srgb,var(--rd)_75%,transparent)] to-[color-mix(in_srgb,var(--rd)_30%,transparent)]" />
          <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-end gap-8 px-4 pb-12 pt-8 md:px-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <nav aria-label="breadcrumb" className="text-xs text-white/60 lg:col-span-2">
              <ol className="flex flex-wrap gap-2">
                <li><Link href="/" className="hover:text-white">خانه</Link></li>
                {trail.map((t) => (
                  <React.Fragment key={t.path}>
                    <li aria-hidden="true">/</li>
                    <li>{t.path === page.path ? <span aria-current="page" className="text-white/90">{t.name}</span> : <Link href={t.path} className="hover:text-white">{t.name}</Link>}</li>
                  </React.Fragment>
                ))}
              </ol>
            </nav>
            <div>
              <p className="mb-5 flex items-center gap-3 text-xs font-bold text-white/75">
                {flag ? <Flag code={flag} uid="hero" width={36} /> : <span className="h-px w-8 bg-[var(--ra-dark)]" aria-hidden />}
                {page.hero.eyebrow}
              </p>
              <h1 className="max-w-[19ch] font-estedad text-[2.4rem] font-black leading-[1.2] [text-wrap:balance] md:text-6xl">{page.hero.headline}</h1>
              <p className="mt-5 max-w-[58ch] text-base leading-[1.95] text-white/75 md:text-lg">{page.hero.sub}</p>
              <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60">
                <span>نوشته‌ی <span className="text-white">فرجاد پ.د</span></span>
                <span>آخرین بازبینی <time dateTime={isoDate(page.updated)} className="text-white">{faDate(page.updated)}</time></span>
                {page.sources && page.sources.length > 0 && <span>ارقام با منابع رسمی تطبیق داده شده</span>}
              </p>
              {page.status && (
                <div role="note" className="mt-5 max-w-[60ch] border-s-2 border-[var(--ra-dark)] ps-3 text-sm leading-[1.9] text-white/75">
                  <strong className="text-white">{page.status.title}.</strong> {page.status.body}
                  {page.status.cta && (
                    <>
                      {' '}
                      <Cta cta={page.status.cta} className="inline-flex items-center gap-1 font-bold text-[var(--ra-dark)] underline underline-offset-4" />
                    </>
                  )}
                </div>
              )}
            </div>
            <aside aria-label="مسیر شما در این صفحه" className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <p className="text-xs font-bold text-[var(--ra-dark)]">مسیر شما در این صفحه</p>
              <ol className="my-4 list-inside list-decimal space-y-1 text-sm text-white/75 marker:font-estedad">
                {page.sections.slice(0, 5).map((s) => <li key={s.heading}>{shortLabel(s.heading)}</li>)}
              </ol>
              <Cta cta={page.hero.cta} className={PRIMARY} />
            </aside>
            <div className="lg:col-span-2"><QuizEcho pagePath={page.path} /></div>
          </div>
        </header>

        {afterHero}

        <RouteRail />

        {page.facts && page.facts.length > 0 && (
          <section aria-label="اعداد کلیدی این مسیر" className="bg-[#F2F0E9] px-4 pt-12 md:px-8">
            <dl className="mx-auto grid max-w-[1200px] grid-cols-2 gap-3 md:grid-cols-4">
              {page.facts.map((f) => (
                <div key={f.label} className="flex flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white p-5 transition-transform hover:-translate-y-1">
                  <dt className="order-2 mt-2 text-sm font-bold">{f.label}</dt>
                  <dd className="order-1 font-estedad text-xl font-black leading-snug text-[var(--rp)] [text-wrap:balance] md:text-2xl">{f.value}</dd>
                  {f.note && <dd className="order-3 mt-1 text-xs leading-relaxed text-[#1a1a1a]/55">{f.note}</dd>}
                </div>
              ))}
            </dl>
            <p className="mx-auto mt-3 max-w-[1200px] text-xs text-[#1a1a1a]/50">ارقام به تاریخ بازبینی این صفحه است و مرجع رسمی هر برنامه ممکن است آن‌ها را تغییر دهد.</p>
          </section>
        )}

        {page.sections.map((s, i) => {
          const shot = gallery.find((_, k) => slotFor(k) === i + 1);
          return (
            <React.Fragment key={i}>
              <Stop s={s} i={i} total={page.sections.length} selfCheck={selfCheck} />
              {shot && (
                <figure className="relative m-0 flex min-h-[340px] items-end overflow-hidden bg-[var(--rd)] text-white">
                  <Image src={`/fa/img/${shot.src}.webp`} alt={shot.alt} fill sizes="100vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--rd)_20%,transparent)] to-[color-mix(in_srgb,var(--rd)_90%,transparent)]" />
                  <figcaption className="relative mx-auto flex w-full max-w-[1200px] flex-wrap items-end justify-between gap-4 px-4 py-10 md:px-8">
                    <p className="max-w-[26ch] font-estedad text-2xl font-black leading-snug md:text-3xl">ما وکیل مهاجرتی نیستیم — <span className="text-[var(--ra-dark)]">شما را برای پذیرش آماده می‌کنیم.</span></p>
                    {shot.caption && <span className="max-w-[40ch] text-xs text-white/60">{shot.caption}</span>}
                  </figcaption>
                </figure>
              )}
            </React.Fragment>
          );
        })}

        {(rule || extra) && (
          <div className="bg-[#F2F0E9] px-4 py-14 md:px-8">
            <div className="mx-auto max-w-[1200px] space-y-14">
              {rule && <Eligibility only={rule.key} />}
              {extra}
            </div>
          </div>
        )}

        {page.faqs.length > 0 && (
          <FaStop id="faq" message="خواندید: سؤالات متداول" className="scroll-mt-40 border-b border-[#1a1a1a]/10 bg-white px-4 py-16 md:px-8 md:py-20">
            <div className="mx-auto max-w-[1200px]">
              <div className="mb-6 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2">
                <span className="row-span-3 mt-1 h-fit rounded-lg border border-[#1a1a1a]/15 px-2 py-1 font-estedad text-xs font-black text-[#1a1a1a]/50">{fa(String(page.sections.length + 1).padStart(2, '0'))}</span>
                <span className="text-xs font-bold text-[var(--ra-text)]">سؤال‌های پرتکرار</span>
                <h2 id="faq-q" className="font-estedad text-3xl font-black leading-[1.3] md:text-[2.5rem]">سؤالات متداول</h2>
                <span className="inline-flex items-center gap-2 text-xs text-[#1a1a1a]/60"><FaTick id="faq" />سؤال‌هایتان را باز کنید</span>
              </div>
              <div className="grid max-w-4xl gap-12">
                {groups.map((g, gi) => (
                  <div key={gi} id={g.heading ? `faq-${gi + 1}` : undefined} className="scroll-mt-40">
                    {g.heading && <h3 className="mb-2 text-sm font-bold text-[var(--ra-text)]">{g.heading}</h3>}
                    <div className="border-t border-[#1a1a1a]/10">
                      {g.faqs.map((f) => (
                        <details key={f.q} className="group border-b border-[#1a1a1a]/10">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 transition-colors hover:text-[var(--ra-text)] group-open:text-[var(--ra-text)] [&::-webkit-details-marker]:hidden">
                            <h4 className="font-estedad text-lg font-bold leading-snug">{f.q}</h4>
                            <span aria-hidden="true" className="font-estedad text-2xl transition-transform group-open:rotate-45">+</span>
                          </summary>
                          <p className="max-w-[72ch] pb-6 text-base leading-[1.95] text-[#1a1a1a]/70">{f.a}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FaStop>
        )}

        {page.sources && page.sources.length > 0 && (
          <section id="sources" aria-labelledby="sources-h" className="border-b border-[#1a1a1a]/10 bg-[#F2F0E9] px-4 py-14 md:px-8">
            <div className="mx-auto max-w-[1200px]">
              <p className="text-xs font-bold text-[var(--ra-text)]">این ارقام از کجا آمده‌اند</p>
              <h2 id="sources-h" className="mt-2 font-estedad text-3xl font-black">منابع رسمی</h2>
              <p className="mt-2 max-w-[68ch] text-sm text-[#1a1a1a]/60">
                همه‌ی ارقام این صفحه در تاریخ <time dateTime={isoDate(page.updated)}>{faDate(page.updated)}</time> با این صفحه‌ها تطبیق داده شده است. پیش از هر تصمیم، منبع را خودتان ببینید.
              </p>
              <ol className="mt-6 grid max-w-4xl list-decimal gap-2 ps-5 text-sm" dir="ltr">
                {page.sources.map((s) => (
                  <li key={s.url} className="text-start">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-bold underline decoration-[var(--ra)] underline-offset-2 hover:text-[var(--ra-text)] break-words">{s.label}</a>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {page.downloads && page.downloads.length > 0 && (
          <div className="bg-[#F2F0E9] px-4 py-14 md:px-8">
            <div className="mx-auto max-w-[1200px]">
              <Downloads items={page.downloads} intro="گزارش‌ها و اینفوگرافیک‌هایی که این راهنما از آن‌ها ساخته شده — برای خواندن آفلاین و فرستادن برای هم‌بنیان‌گذارتان." />
            </div>
          </div>
        )}

        {page.videos && page.videos.length > 0 && (
          <div className="mx-auto max-w-[1400px] px-4 md:px-8">
            <VideoRail videos={videosById(page.videos)} intro="توضیح ویدیویی همین مسیر، از زبان فرجاد — با جزئیاتی که در متن جا نمی‌گیرد." />
          </div>
        )}

        {beforeClosing}

        {/* Closing: the booking band of the English twin, in Persian. */}
        <section aria-labelledby="closing-h" className="bg-[var(--rd)] px-4 py-16 text-white md:px-8">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <div>
              <RouteFinish />
              <p className="text-xs font-bold text-[var(--ra-dark)]">گفت‌وگو کنید</p>
              <h2 id="closing-h" className="mt-2 max-w-[20ch] font-estedad text-4xl font-black leading-tight [text-wrap:balance]">هنوز مطمئن نیستید این مسیر برای شماست؟</h2>
              <p className="mt-3 max-w-[52ch] leading-[1.95] text-white/70">
                ما وکیل مهاجرتی نیستیم — تیم و استارتاپ شما را برای پذیرش آماده می‌کنیم. وضعیتتان را بگویید تا صادقانه بگوییم این مسیر به شما می‌خورد یا نه.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {page.closing.map((c, i) => <Cta key={c.href} cta={c} className={i === 0 ? PRIMARY : GHOST} />)}
              </div>
            </div>
            <address className="grid gap-2.5 not-italic">
              <p className="text-xs font-bold text-white/60">یا مستقیم با ما در تماس باشید</p>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5 rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5">
                <span className="text-[11px] font-bold text-white/55">تلگرام</span>
                <span className="col-start-2 row-span-2 row-start-1 flex gap-1.5">
                  <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/30 px-3 py-1.5 text-xs transition-colors hover:bg-white/10">باز کردن</a>
                </span>
                <span className="text-lg" dir="ltr">@farjadtalks</span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5 rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5">
                <span className="text-[11px] font-bold text-white/55">واتساپ و تماس</span>
                <span className="col-start-2 row-span-2 row-start-1 flex gap-1.5">
                  <FaCopy value={CONTACT.whatsappNumber} />
                  <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/30 px-3 py-1.5 text-xs transition-colors hover:bg-white/10">واتساپ</a>
                </span>
                <span className="select-all text-lg tabular-nums" dir="ltr">{CONTACT.whatsappNumber}</span>
              </div>
            </address>
          </div>
        </section>
      </RouteProvider>
    </article>
  );
}
