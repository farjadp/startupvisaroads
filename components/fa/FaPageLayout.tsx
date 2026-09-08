// ============================================================================
// Component: components/fa/FaPageLayout.tsx
// Renders one Persian content page from its FaPage module.
//
// MOTION THESIS — focal moment: the hero, where the brand photograph wipes in
// from the reading edge behind the headline. Everything after is quiet: short decelerating reveals, an
// interactive stepper where the content is a sequence, an FAQ that opens
// with real height. Reduced motion removes the spatial moves and keeps the
// state changes. Copy never lives here — it lives in content/fa/<page>.ts.
// ============================================================================
import React from 'react';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/navigation';
import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/seo';
import { faqJsonLd, breadcrumbJsonLd, faWebPageJsonLd, type FaPage, type FaCta, type FaSection } from '@/lib/fa/content';
import { faDate, isoDate } from '@/lib/fa/format';
import { TELEGRAM_URL, CONTACT } from '@/content/fa/home';
import { videosById } from '@/content/fa/videos';
import StatusBanner from './StatusBanner';
import FactsPanel from './FactsPanel';
import VideoRail from './VideoRail';
import Reveal from './motion/Reveal';
import MaskText from './motion/MaskText';
import Rule from './motion/Rule';
import Parallax from './motion/Parallax';
import SectionNav from './motion/SectionNav';
import Eligibility from './Eligibility';
import QuizEcho from './QuizEcho';
import Flag from './Flag';
import { flagFor } from '@/lib/fa/flags';
import { RULES } from '@/lib/fa/programmes';
import HeroImage from './motion/HeroImage';
import ScrollProgress from './motion/ScrollProgress';
import Stepper, { type Step } from './motion/Stepper';
import Faq from './motion/Faq';
import Downloads from './motion/Downloads';

// Absolute URLs and explicit /en/ paths render as plain anchors; everything
// else goes through the locale-aware Link.
const isExternal = (href: string) => /^https?:\/\//.test(href) || href.startsWith('/en/');
const NUMBERED = /^([۰-۹0-9]{1,2})[.۰-۹]?\s*[.\-–—:]?\s*/;

function Cta({ cta, primary, dark, acid }: { cta: FaCta; primary?: boolean; dark?: boolean; acid?: boolean }) {
  const cls = acid
    // The hero is now a dark field, where the ink-on-paper primary button
    // would disappear. Acid on ink is the one pairing that survives an
    // arbitrary photograph behind it.
    ? 'group inline-flex items-center gap-4 bg-[#CCFF00] text-[#1a1a1a] px-8 py-5 hover:bg-[#F2F0E9] transition-colors duration-300'
    : primary
    ? 'group inline-flex items-center gap-4 bg-[#1a1a1a] text-[#F2F0E9] px-8 py-5 hover:bg-[#CCFF00] hover:text-black transition-colors duration-300'
    : dark
      ? 'group inline-flex items-center gap-3 border border-[#F2F0E9]/40 text-[#F2F0E9] px-6 py-4 hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] transition-colors duration-300'
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

/** Bullets written as "۱. …" become steps; everything else stays a list. */
function stepsOf(s: FaSection): Step[] | null {
  if (!s.bullets || s.bullets.length < 3) return null;
  const parsed = s.bullets.map((b) => {
    const m = b.match(NUMBERED);
    if (!m) return null;
    const rest = b.slice(m[0].length);
    const cut = rest.search(/[—–:.]/);
    const title = cut > 0 && cut < 70 ? rest.slice(0, cut).trim() : rest.slice(0, 60).trim();
    const body = cut > 0 && cut < 70 ? rest.slice(cut + 1).trim() : rest;
    return { n: m[1], title, body: body || rest };
  });
  return parsed.every(Boolean) ? (parsed as Step[]) : null;
}

function Section({ s, i }: { s: FaSection; i: number }) {
  const steps = stepsOf(s);
  return (
    <Reveal as="section" id={`s${i + 1}`} className="scroll-mt-28">
      <Rule className="mb-5" />
      <MaskText as="h2" text={s.heading} className="font-estedad font-black text-3xl md:text-4xl leading-tight mb-6 max-w-3xl [text-wrap:balance]" />
      <div className="space-y-5 text-lg leading-[1.9] text-[#1a1a1a]/80 max-w-[70ch]">
        {s.body.map((p, j) => <p key={j}>{p}</p>)}
        {steps ? (
          <div className="pt-2"><Stepper steps={steps} /></div>
        ) : s.bullets ? (
          <ul className="space-y-3 pt-1">
            {s.bullets.map((b, j) => (
              <Reveal as="li" key={j} delay={Math.min(j * 0.05, 0.3)} className="flex gap-4">
                <span className="mt-[0.85em] h-px w-5 bg-[#1a1a1a] shrink-0" aria-hidden />
                <span>{b}</span>
              </Reveal>
            ))}
          </ul>
        ) : null}
        {s.callout && (
          <aside className="mt-4 bg-[#1a1a1a] text-[#F2F0E9] p-7 md:p-8 border-t-2 border-[#CCFF00]">
            <p className="font-estedad font-bold text-xl md:text-2xl leading-relaxed [text-wrap:pretty]">{s.callout}</p>
          </aside>
        )}
      </div>
    </Reveal>
  );
}

export default function FaPageLayout({ page, trail }: { page: FaPage; trail: { name: string; path: string }[] }) {
  const img = page.image ? `/fa/img/${page.image}.webp` : null;
  const gallery = page.gallery ?? [];
  // Spread the gallery evenly through the sections so the page breathes
  // instead of front-loading every picture.
  const slotFor = (i: number) => Math.floor(((i + 1) * page.sections.length) / (gallery.length + 1));
  // A guide that describes a programme we hold thresholds for gets the
  // calculator, matched on path so no content module has to opt in.
  const rule = RULES.find((r) => r.href === page.path);
  const flag = flagFor(page.path);
  const mid = Math.min(3, Math.max(1, Math.floor(page.sections.length / 2)));
  const before = page.sections.slice(0, mid);
  const after = page.sections.slice(mid);

  return (
    <article className="w-full bg-[#F2F0E9] font-vazir">
      <ScrollProgress />
      <JsonLd data={[faWebPageJsonLd(page), faqJsonLd(page.faqs), breadcrumbJsonLd(SITE_URL, [{ name: 'خانه', path: '' }, ...trail])]} />

      {/* HERO — the authored moment.
          One dark field: the photograph is the ground and the headline sits
          on it. The previous hero put a portrait strip beside the text on the
          same paper as the body, so the page opened with no anchor. A two-stop
          scrim guarantees contrast at the reading edge whatever the
          photograph does. */}
      <header className="relative isolate overflow-hidden bg-[#1a1a1a] text-[#F2F0E9]">
        {img && (
          <div className="absolute inset-0">
            <HeroImage src={img} alt={page.imageAlt ?? ''} sizes="100vw" className="h-full w-full" />
            {/* Solid at the reading edge, opening up towards the far edge, so
                the photograph is still visible without ever competing with
                Persian text for contrast. */}
            <div className="absolute inset-0 bg-gradient-to-l from-[#1a1a1a] via-[#1a1a1a]/65 to-[#1a1a1a]/15" />
            <div className="absolute inset-0 bg-[#1a1a1a]/10" />
          </div>
        )}

        <div className="relative px-4 md:px-8 max-w-[1400px] mx-auto">
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#F2F0E9]/55 pt-10 md:pt-12">
            <Link href="/" className="hover:text-[#CCFF00]">خانه</Link>
            {trail.map((t) => (
              <React.Fragment key={t.path}>
                <span className="text-[#F2F0E9]/25">/</span>
                {t.path === page.path ? <span className="text-[#F2F0E9]">{t.name}</span> : <Link href={t.path} className="hover:text-[#CCFF00]">{t.name}</Link>}
              </React.Fragment>
            ))}
          </nav>

          <div className="max-w-[62ch] pt-10 pb-12 md:pt-14 md:pb-24">
            <Reveal>
              {/* The eyebrow was a chip floating on the photograph; it
                  belongs above the headline it introduces. */}
              <p className="flex items-center gap-3 text-[13px] text-[#CCFF00]">
                {/* The country's own flag where we can draw it exactly;
                    otherwise the acid rule, never an approximated flag. */}
                {flag ? (
                  <Flag code={flag} className="h-4 w-auto shrink-0 text-[#F2F0E9]" />
                ) : (
                  <span className="h-px w-8 bg-[#CCFF00]" aria-hidden />
                )}
                {page.hero.eyebrow}
              </p>
              <MaskText text={page.hero.headline} className="mt-5 font-estedad font-black text-[2.5rem] md:text-6xl lg:text-[4.5rem] leading-[1.13] max-w-[19ch] [text-wrap:balance]" />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 text-lg md:text-xl leading-[1.9] text-[#F2F0E9]/75 max-w-[56ch]">{page.hero.sub}</p>
            </Reveal>
            <Reveal delay={0.18} className="mt-10">
              <Cta cta={page.hero.cta} acid />
            </Reveal>
          </div>

          <QuizEcho pagePath={page.path} />

          {/* The review date was sitting next to the primary action, competing
              with it. It is provenance, so it reads as provenance. */}
          <div className="border-t border-[#F2F0E9]/15 py-4 text-xs text-[#F2F0E9]/55">
            آخرین بازبینی: <time dateTime={isoDate(page.updated)}>{faDate(page.updated)}</time>
          </div>
        </div>
      </header>

      <div className="px-4 md:px-8 max-w-[1400px] mx-auto border-x border-[#1a1a1a]/10">
        {page.status && <StatusBanner status={page.status} />}
        {page.facts && (
          <FactsPanel
            facts={page.facts}
            caption={`ارقام به تاریخ بازبینی این صفحه است و مرجع رسمی هر برنامه ممکن است آن‌ها را تغییر دهد.`}
          />
        )}

        {/* BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-16 md:py-24">
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-28">
              <SectionNav
                items={[
                  ...page.sections.map((s, i) => ({ id: `s${i + 1}`, label: s.heading })),
                  ...(page.faqs.length > 0 ? [{ id: 'faq', label: 'سؤالات متداول' }] : []),
                ]}
              />
              <div className="mt-10 pt-6 border-t border-[#1a1a1a]/15 space-y-3 text-xs">
                <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold hover:text-[#CCFF00]">
                  <Send className="w-3.5 h-3.5" /> سؤال دارید؟ در تلگرام بپرسید
                </a>
                <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#1a1a1a]">
                  <MessageCircle className="w-3.5 h-3.5" /><span dir="ltr">{CONTACT.whatsappNumber}</span>
                </a>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9 space-y-16 md:space-y-24">
            {before.map((s, i) => <Section key={i} s={s} i={i} />)}

            {/* mid-page breather: a different photograph, with the positioning line */}
            {gallery[0] && after.length > 0 && (
              <Reveal as="figure" className="relative -mx-4 md:mx-0 overflow-hidden">
                <Parallax className="aspect-[21/9] bg-[#1a1a1a]">
                  <div className="relative w-full h-full">
                    <Image src={`/fa/img/${gallery[0].src}.webp`} alt={gallery[0].alt} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover opacity-80" />
                  </div>
                </Parallax>
                <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-10 bg-gradient-to-t from-[#1a1a1a] to-transparent">
                  <p className="font-estedad font-bold text-[#F2F0E9] text-xl md:text-3xl max-w-[28ch] leading-snug [text-wrap:balance]">ما وکیل مهاجرتی نیستیم — شما را برای پذیرش آماده می‌کنیم.</p>
                </figcaption>
              </Reveal>
            )}

            {after.map((s, i) => {
              const idx = mid + i;
              const shot = gallery.slice(1).find((_, k) => slotFor(k + 1) === idx + 1);
              return (
                <React.Fragment key={idx}>
                  <Section s={s} i={idx} />
                  {shot && (
                    <Reveal as="figure" className="-mx-4 md:mx-0">
                      <div className="relative aspect-[16/9] bg-[#1a1a1a] overflow-hidden">
                        <Image src={`/fa/img/${shot.src}.webp`} alt={shot.alt} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover" />
                      </div>
                      {shot.caption && <figcaption className="mt-3 text-xs text-[#1a1a1a]/55">{shot.caption}</figcaption>}
                    </Reveal>
                  )}
                </React.Fragment>
              );
            })}

            {rule && <Eligibility only={rule.key} />}

            {page.faqs.length > 0 && (
              <Reveal as="section" className="scroll-mt-28">
                <div id="faq" />
                <h2 className="font-estedad font-black text-3xl md:text-4xl mb-10">سؤالات متداول</h2>
                {(page.faqGroups ?? [{ heading: '', faqs: page.faqs }]).map((g, gi) => (
                  <div key={gi} id={g.heading ? `faq-${gi + 1}` : undefined} className={gi > 0 ? 'mt-14 scroll-mt-28' : ''}>
                    {g.heading && <h3 className="font-estedad font-bold text-xl text-[#1a1a1a]/60 mb-4">{g.heading}</h3>}
                    <Faq items={g.faqs} idPrefix={`faq${gi}`} />
                  </div>
                ))}
              </Reveal>
            )}

            {page.downloads && page.downloads.length > 0 && (
              <Reveal as="div" className="pt-4">
                <Downloads
                  items={page.downloads}
                  intro="گزارش‌ها و اینفوگرافیک‌هایی که این راهنما از آن‌ها ساخته شده — برای خواندن آفلاین و فرستادن برای هم‌بنیان‌گذارتان."
                />
              </Reveal>
            )}
          </div>
        </div>

        {page.videos && page.videos.length > 0 && (
          <VideoRail videos={videosById(page.videos)} intro="توضیح ویدیویی همین مسیر، از زبان فرجاد — با جزئیاتی که در متن جا نمی‌گیرد." />
        )}
      </div>

      {/* CLOSING */}
      <section className="py-24 border-t border-[#1a1a1a] bg-[#1a1a1a] text-[#F2F0E9]">
        <div className="px-4 md:px-8 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8">
            <h2 className="font-estedad font-black text-4xl md:text-6xl leading-tight mb-10 max-w-[20ch] [text-wrap:balance]">هنوز مطمئن نیستید این مسیر برای شماست؟</h2>
            <div className="flex flex-wrap gap-4">
              {page.closing.map((c, i) => <Cta key={c.href} cta={c} primary={i === 0} dark={i !== 0} />)}
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
