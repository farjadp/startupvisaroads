// ============================================================================
// Component: components/fa/FaHome.tsx
// The Persian home page. Persuade mode: the visitor must understand within
// one viewport that the Canada SUV closed and five routes are open, then
// pick one. Copy lives in content/fa/home.ts.
//
// MOTION THESIS — focal moment: the hero, where the roads globe draws five
// routes out of Tehran while the brand photograph wipes in beside the
// headline. Supporting grammar: quiet reveals, CSS-3D tilt on the six route
// cards (the page's one interactive object), an FAQ that opens with real
// height. Reduced motion keeps every state change and drops the spatial ones.
// ============================================================================
import React from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowUpLeft, Send, MessageCircle } from 'lucide-react';
import { Link } from '@/navigation';
import JsonLd from '@/components/JsonLd';
import { faqJsonLd, faServiceJsonLd, faRoutesJsonLd } from '@/lib/fa/content';
import { faDate, isoDate } from '@/lib/fa/format';
import { home, CONTACT } from '@/content/fa/home';
import { videosById } from '@/content/fa/videos';
import VideoRail from './VideoRail';
import Reveal from './motion/Reveal';
import TiltCard from './motion/TiltCard';
import Faq from './motion/Faq';

type Article = {
  id: string;
  slug: string;
  title: string;
  coverImage: string | null;
  createdAt: Date;
  category: { name: string } | null;
};

export default function FaHome({ articles }: { articles: Article[] }) {
  const h = home;

  return (
    <div className="w-full bg-[#F2F0E9] font-vazir">
      <JsonLd
        data={[
          faServiceJsonLd(),
          faRoutesJsonLd(h.paths.cards.filter((c) => c.href !== '/which-path').map((c) => ({ name: c.title, path: c.href, description: c.body }))),
          faqJsonLd(h.faqs),
        ]}
      />

      {/* 1. HERO — the authored moment */}
      <section aria-labelledby="fa-home-heading" className="border-b border-ink/20">
        <div className="mx-auto max-w-[1400px] px-5 pb-7 pt-5 sm:px-8 lg:pb-9 lg:pt-8">
          <div className="grid items-center gap-12 pb-10 lg:grid-cols-12 lg:gap-10 lg:pb-14 xl:gap-16">
            <div className="min-w-0 lg:col-span-7">
              <h1 id="fa-home-heading" className="font-estedad text-[clamp(2.5rem,7.6vw,4.5rem)] font-black leading-[1.5] text-ink lg:text-[clamp(3rem,4.7vw,4.25rem)]">
                <span className="block">{h.hero.headline_1}</span>
                <span className="block">{h.hero.headline_2}</span>
                <span className="relative isolate inline-block">
                  <span aria-hidden="true" className="absolute -inset-x-2 bottom-[0.17em] -z-10 h-[0.48em] -rotate-2 bg-acid" />
                  {h.hero.headline_3}
                </span>
              </h1>
              <p className="mt-6 max-w-[49ch] text-base leading-[2] text-ink/80 sm:text-lg">{h.hero.sub}</p>
              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
                <Link href={h.hero.primary.href} aria-describedby="hero-assessment-note" className="group inline-flex min-h-14 items-center justify-center gap-5 rounded-xl bg-ink px-6 py-4 font-bold text-paper transition-colors duration-200 hover:bg-acid hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
                  {h.hero.primary.label}
                  <ArrowLeft aria-hidden="true" className="h-5 w-5 transition-transform duration-200 motion-safe:group-hover:-translate-x-1" />
                </Link>
                <a href={h.hero.secondary.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-2 py-3 text-sm font-bold text-ink underline-offset-8 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
                  <Send aria-hidden="true" className="h-4 w-4" />
                  {h.hero.secondary.label}
                  <span className="sr-only"> در تلگرام (پنجره‌ی جدید)</span>
                </a>
              </div>
              <p id="hero-assessment-note" className="mt-3 text-xs leading-6 text-ink/70">{h.hero.assessmentNote}</p>
              <p className="mt-7 max-w-[55ch] border-t border-ink/15 pt-4 text-xs leading-6 text-ink/75">{h.hero.positioning}</p>
            </div>

            <div className="min-w-0 lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl bg-ink px-6 pb-6 pt-8 text-paper sm:px-8 sm:pt-10 lg:px-7 xl:px-9">
                <div aria-hidden="true" className="absolute left-0 top-0 h-14 w-14 bg-acid [clip-path:polygon(0_0,100%_0,0_100%)]" />
                <h2 className="max-w-[20ch] font-estedad text-2xl font-bold leading-[1.65] sm:text-3xl">{h.hero.roadmap.heading}</h2>
                <p className="mt-2 text-sm leading-7 text-paper/75">{h.hero.roadmap.intro}</p>
                <ol className="mt-8">
                  {h.hero.roadmap.steps.map((step, i) => (
                    <li key={step.n} className="group relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 pb-8 last:pb-0">
                      {i < h.hero.roadmap.steps.length - 1 && <span aria-hidden="true" className="absolute bottom-0 right-5 top-10 w-px bg-paper/25" />}
                      <span aria-hidden="true" className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border font-estedad text-sm font-bold ${i === 0 ? 'border-acid bg-acid text-ink' : 'border-paper/35 bg-ink text-acid'}`}>{step.n}</span>
                      <div className="pt-1">
                        <h3 className="font-estedad text-lg font-bold leading-8">{step.title}</h3>
                        <p className="mt-1 text-sm leading-[1.9] text-paper/75">{step.body}</p>
                        <p className="mt-3 flex items-start gap-2 text-xs font-medium leading-6 text-acid">
                          <ArrowLeft aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" />
                          {step.output}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                <Link href={h.hero.roadmap.cta.href} className="mt-8 flex min-h-12 items-center justify-between gap-4 border-t border-paper/25 pt-5 text-sm font-bold text-paper transition-colors hover:text-acid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acid">
                  {h.hero.roadmap.cta.label}
                  <ArrowUpLeft aria-hidden="true" className="h-5 w-5 shrink-0" />
                </Link>
              </div>
            </div>
          </div>
          <nav aria-label={h.hero.routesLabel} className="flex flex-col gap-3 border-t border-ink/20 pt-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <p className="text-sm text-ink/75">{h.hero.routesLabel}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1 sm:gap-x-7">
              {h.hero.routes.map((route) => (
                <li key={route.href}>
                  <Link href={route.href} className="group inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
                    {route.label}
                    <ArrowUpLeft aria-hidden="true" className="h-3.5 w-3.5 text-ink/60 transition-transform motion-safe:group-hover:-translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* 2. TICKER */}
      <div className="border-b border-[#1a1a1a] py-6 overflow-hidden" dir="ltr" aria-hidden>
        <div className="animate-marquee whitespace-nowrap flex gap-24">
          {[...h.ticker, ...h.ticker].map((item, i) => (
            <span key={i} className="font-estedad font-black text-4xl md:text-6xl text-[#1a1a1a]/15">{item}</span>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-[1400px] mx-auto border-x border-[#1a1a1a]/10">
        {/* 3. THE SERVICE — stated plainly, before anything else */}
        <section className="py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-5">
            <h2 className="font-estedad font-black text-4xl md:text-5xl leading-[1.1] mb-6 [text-wrap:balance]">{h.service.heading}</h2>
            <p className="text-lg text-[#1a1a1a]/75 leading-[1.9] max-w-[46ch]">{h.service.lead}</p>
            <Link href={h.service.cta.href} className="group inline-flex items-center gap-3 mt-8 font-bold border-b border-[#1a1a1a] pb-1 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors">
              {h.service.cta.label}
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </Reveal>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#1a1a1a]/20 border border-[#1a1a1a]">
            {h.service.items.map((it, i) => (
              <Reveal key={it.title} delay={i * 0.06} className="bg-[#F2F0E9] p-7 min-h-[11rem] flex flex-col justify-between">
                <h3 className="font-estedad font-black text-2xl leading-tight">{it.title}</h3>
                <p className="mt-4 text-[#1a1a1a]/70 leading-[1.85]">{it.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 4. PATHS — the one interactive object */}
        <section className="py-24">
          <Reveal className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <h2 className="font-estedad font-black text-5xl md:text-7xl leading-[1.05] [text-wrap:balance]">
              {h.paths.heading_1}
              <br />
              <span className="font-bold text-[#1a1a1a]/40">{h.paths.heading_2}</span>
            </h2>
            <p className="text-[#1a1a1a]/65 max-w-[42ch] mb-2 leading-relaxed">{h.paths.sub}</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {h.paths.cards.map((c, i) => (
              <Reveal key={c.href} delay={Math.min(i * 0.06, 0.3)}>
                <TiltCard className="h-full">
                  <Link
                    href={c.href}
                    className="group relative block h-full min-h-[300px] p-8 bg-[#F2F0E9] border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors duration-500 [transform:translateZ(0)]"
                  >
                    <span className="text-[11px] font-bold text-[#1a1a1a]/60 group-hover:text-[#CCFF00] transition-colors" dir="auto">{c.eyebrow}</span>
                    <h3 className="mt-6 font-estedad font-black text-3xl leading-tight [transform:translateZ(24px)]">{c.title}</h3>
                    <p className="mt-4 leading-[1.85] text-[#1a1a1a]/70 group-hover:text-[#F2F0E9]/70 max-w-[38ch]">{c.body}</p>
                    <span className="absolute bottom-7 start-8 inline-flex items-center gap-2 text-sm font-bold group-hover:text-[#CCFF00]">
                      ادامه
                      <ArrowUpLeft className="w-4 h-4 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  </Link>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 4. METHOD */}
        <section className="py-24 border-t border-[#1a1a1a]/10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-4">
            <div className="sticky top-28">
              <h2 className="font-estedad font-black text-5xl leading-[1.1] mb-6 [text-wrap:balance]">{h.method.heading}</h2>
              <p className="text-[#1a1a1a]/65 max-w-[40ch] leading-[1.9]">{h.method.intro}</p>
            </div>
          </Reveal>
          <div className="lg:col-span-8 divide-y divide-[#1a1a1a]/20">
            {h.method.steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08} className="py-12 first:pt-0 grid grid-cols-12 gap-6">
                <span className="col-span-2 md:col-span-1 font-estedad font-black text-2xl text-[#1a1a1a]/30">{s.n}</span>
                <div className="col-span-10 md:col-span-11">
                  <h3 className="font-estedad font-black text-3xl md:text-4xl mb-4 leading-tight">{s.title}</h3>
                  <p className="text-lg text-[#1a1a1a]/75 max-w-[62ch] leading-[1.9]">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      {/* 5. IRANIAN-SPECIFIC — ink, with the photograph */}
      <section className="py-24 bg-[#1a1a1a] text-[#F2F0E9] border-y border-[#1a1a1a]">
        <div className="px-4 md:px-8 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="font-estedad font-black text-4xl md:text-6xl leading-[1.1] mb-14 max-w-[20ch] [text-wrap:balance]">{h.iranian.heading}</h2>
            </Reveal>
            <div className="space-y-10">
              {h.iranian.items.map((it, i) => (
                <Reveal key={it.title} delay={i * 0.08}>
                  <h3 className="font-estedad font-bold text-2xl mb-3 text-[#CCFF00]">{it.title}</h3>
                  <p className="text-[#F2F0E9]/70 leading-[1.9] max-w-[60ch]">{it.body}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <Link href={h.iranian.cta.href} className="inline-flex items-center gap-3 mt-14 font-bold border-b border-[#CCFF00] pb-1 hover:text-[#CCFF00] transition-colors">
                {h.iranian.cta.label}
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-5 relative aspect-[4/5] hidden lg:block">
            <Image src="/fa/img/which-path.webp" alt="" fill sizes="40vw" className="object-cover opacity-85" />
          </Reveal>
        </div>
      </section>

      <div className="px-4 md:px-8 max-w-[1400px] mx-auto border-x border-[#1a1a1a]/10">
        {/* 6. FOUNDER + FAQ */}
        <section className="py-28 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <Reveal>
            <h2 className="font-estedad font-black text-4xl leading-[1.15] mb-8 [text-wrap:balance]">«{h.founder.quote}»</h2>
            <div className="text-lg text-[#1a1a1a]/75 space-y-6 leading-[1.9] max-w-[58ch]">
              {h.founder.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="mt-12 flex items-center gap-5">
              <div className="relative w-16 h-16 overflow-hidden bg-[#1a1a1a] border border-[#1a1a1a]">
                <Image src="/fa/img/about.webp" alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div>
                <p className="font-estedad font-bold text-xl">{h.founder.name}</p>
                <p className="text-xs text-[#1a1a1a]/50">{h.founder.role}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-5 text-sm">
              <a href={h.founder.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold border-b border-[#1a1a1a] pb-0.5 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors">
                <Send className="w-3.5 h-3.5" />{h.founder.telegramLabel}
              </a>
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#1a1a1a]">
                <MessageCircle className="w-3.5 h-3.5" /><span dir="ltr">{CONTACT.whatsappNumber}</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-estedad font-black text-3xl mb-8">پرسش‌های رایج</h2>
            <Faq items={h.faqs} idPrefix="home" />
            <Link href="/faq" className="inline-flex items-center gap-2 mt-8 text-sm font-bold border-b border-[#1a1a1a] pb-0.5 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors">
              همه‌ی سؤالات متداول
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Reveal>
        </section>

        {/* 7. JOURNAL */}
        {articles.length > 0 && (
          <section className="py-24 border-t border-[#1a1a1a]/10">
            <Reveal className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
              <h2 className="font-estedad font-black text-5xl">
                {h.journal.heading_1} <span className="font-bold text-[#1a1a1a]/40">{h.journal.heading_2}</span>
              </h2>
              <Link href="/blog" className="hidden md:flex items-center gap-2 text-sm font-bold hover:text-[#CCFF00] transition-colors">
                {h.journal.all}
                <ArrowLeft size={16} />
              </Link>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {articles.map((post, i) => (
                <Reveal key={post.id} delay={i * 0.07}>
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden mb-5 border border-[#1a1a1a]/10 bg-[#1a1a1a]">
                      {post.coverImage ? (
                        <Image src={post.coverImage} alt={post.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                      ) : (
                        <div className="w-full h-full grid place-items-center font-estedad font-black text-[#F2F0E9]/20 text-4xl">مجله</div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mb-3 text-[10px] text-[#1a1a1a]/55">
                      {post.category && <span className="border border-[#1a1a1a]/40 px-2 py-1 text-[#1a1a1a]">{post.category.name}</span>}
                      <time dateTime={isoDate(post.createdAt)}>{faDate(post.createdAt)}</time>
                    </div>
                    <h3 className="font-estedad font-bold text-2xl leading-snug group-hover:text-[#CCFF00] transition-colors">{post.title}</h3>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* 8. VIDEOS */}
        <VideoRail
          heading="از یوتیوب فرجاد"
          intro="آخرین وبینار درباره‌ی کشورهای دارای ویزای استارتاپ، مسیر شش‌ماهه‌ی نیوبرانزویک، و اینکه چطور یک استارتاپ برای مهاجرت می‌سازیم."
          videos={videosById(['cXAWOW-Wdco', 'Fl1Q7gUU06A', 'qODv_KLFGbk'])}
        />

        {/* 9. CHANNELS */}
        <section className="py-24 border-t border-[#1a1a1a]/10">
          <Reveal>
            <h2 className="font-estedad font-black text-4xl md:text-6xl mb-14 leading-[1.1] [text-wrap:balance]">{h.channels.heading}</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-[#1a1a1a]/20 border border-[#1a1a1a]/20">
            {h.channels.items.map((c, i) => {
              const inner = (
                <>
                  <div>
                    <h3 className="font-estedad font-black text-2xl mb-3">{c.title}</h3>
                    <p className="text-sm text-[#1a1a1a]/65 leading-relaxed">{c.body}</p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold border-b border-[#1a1a1a] pb-0.5 group-hover:text-[#CCFF00] group-hover:border-[#CCFF00] transition-colors" dir="auto">
                    {c.cta.label}
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                </>
              );
              const cls = 'group bg-[#F2F0E9] p-8 min-h-[240px] flex flex-col justify-between';
              return (
                <Reveal key={c.title} delay={i * 0.05}>
                  {c.external ? (
                    <a href={c.cta.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                  ) : (
                    <Link href={c.cta.href} className={cls}>{inner}</Link>
                  )}
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* 10. CLOSING */}
        <section className="py-32 flex flex-col items-center justify-center text-center">
          <p className="text-xs tracking-[0.3em] mb-6 text-[#1a1a1a]/50">{h.closing.kicker}</p>
          <Link href={h.closing.href} className="relative group">
            <h2 className="font-estedad font-black text-6xl md:text-9xl text-[#1a1a1a] leading-tight">{h.closing.headline}</h2>
            <div className="h-2 w-0 bg-[#CCFF00] group-hover:w-full transition-all duration-500 ease-out mt-4"></div>
          </Link>
        </section>
      </div>
    </div>
  );
}
