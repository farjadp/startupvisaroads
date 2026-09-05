// ============================================================================
// Component: components/fa/FaHome.tsx
// The Persian home page. Same editorial visual language as the English home
// (paper, ink, acid lime, hairline borders) but a native RTL composition with
// its own copy, its own sections and its own link set — not a mirrored
// translation. Copy lives in content/fa/home.ts.
// ============================================================================
import React from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowUpLeft, Send } from 'lucide-react';
import { Link } from '@/navigation';
import JsonLd from '@/components/JsonLd';
import { faqJsonLd } from '@/lib/fa/content';
import { faDate, isoDate } from '@/lib/fa/format';
import { home } from '@/content/fa/home';

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
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] font-vazir">
      <JsonLd data={[faqJsonLd(h.faqs)]} />

      {/* 1. HERO */}
      <section className="min-h-[80vh] flex flex-col justify-between pb-12">
        <div className="flex justify-between items-start border-t border-[#1a1a1a] pt-4">
          <span className="text-xs tracking-wide">{h.hero.est}</span>
          <span className="text-xs tracking-wide hidden md:block">{h.hero.kicker}</span>
        </div>

        <div className="mt-20">
          <h1 className="font-estedad font-black text-[14vw] leading-[0.95] text-[#1a1a1a]">
            {h.hero.headline_1}
            <br />
            <span className="ms-[12vw] font-bold text-[#1a1a1a]/60">{h.hero.headline_2}</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-end justify-between gap-10 mt-12">
          <div className="max-w-xl">
            <p className="font-estedad font-bold text-2xl md:text-3xl leading-snug mb-4">{h.hero.positioning}</p>
            <p className="text-lg leading-relaxed text-[#1a1a1a]/70">{h.hero.sub}</p>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <Link
              href={h.hero.primary.href}
              className="group flex items-center justify-between gap-4 bg-[#1a1a1a] text-[#F2F0E9] px-8 py-6 hover:bg-[#CCFF00] hover:text-black transition-colors duration-300"
            >
              <span className="font-bold">{h.hero.primary.label}</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
            </Link>
            <a
              href={h.hero.secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 border border-[#1a1a1a] px-8 py-4 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors duration-300"
            >
              <span className="font-bold text-sm">{h.hero.secondary.label}</span>
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. TICKER */}
      <div className="border-y border-[#1a1a1a] py-6 overflow-hidden" dir="ltr">
        <div className="animate-marquee whitespace-nowrap flex gap-24">
          {[...h.ticker, ...h.ticker].map((item, i) => (
            <span key={i} className="font-estedad font-black text-4xl md:text-6xl text-[#1a1a1a]/20">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 3. PATHS */}
      <section className="py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <h2 className="font-estedad font-black text-5xl md:text-7xl leading-tight">
            {h.paths.heading_1}
            <br />
            <span className="font-bold text-[#1a1a1a]/40">{h.paths.heading_2}</span>
          </h2>
          <p className="text-[#1a1a1a]/60 max-w-sm mb-2">{h.paths.sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1a1a]/20 border border-[#1a1a1a]/20">
          {h.paths.cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group bg-[#F2F0E9] p-8 md:p-12 min-h-[320px] flex flex-col justify-between hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors duration-500"
            >
              <div>
                <span className="inline-block text-[11px] font-bold text-[#1a1a1a] bg-[#CCFF00] px-2 py-1 mb-6 group-hover:text-black">
                  {c.eyebrow}
                </span>
                <h3 className="font-estedad font-black text-3xl md:text-4xl mb-4">{c.title}</h3>
                <p className="leading-relaxed text-[#1a1a1a]/70 group-hover:text-[#F2F0E9]/70 max-w-md">{c.body}</p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm font-bold group-hover:text-[#CCFF00]">
                <span>ادامه</span>
                <ArrowUpLeft className="w-4 h-4 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. METHOD */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="sticky top-12">
              <span className="inline-block text-xs font-bold text-[#CCFF00] bg-black px-2 py-1 mb-6">{h.method.label}</span>
              <h2 className="font-estedad font-black text-5xl mb-6 leading-tight">{h.method.heading}</h2>
              <div className="w-12 h-1 bg-[#CCFF00] mb-6"></div>
              <p className="text-sm text-[#1a1a1a]/60 max-w-xs leading-relaxed">{h.method.intro}</p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-16">
            {h.method.steps.map((s) => (
              <div key={s.n} className="border-b border-[#1a1a1a]/20 pb-12">
                <span className="inline-block text-xs font-bold text-[#CCFF00] bg-black px-2 py-1 mb-4">{s.n}</span>
                <h3 className="font-estedad font-black text-4xl md:text-5xl mb-4">{s.title}</h3>
                <p className="text-lg text-[#1a1a1a]/70 max-w-xl leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. IRANIAN-SPECIFIC */}
      <section className="py-24 bg-[#1a1a1a] text-[#F2F0E9] -mx-4 md:-mx-8 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          <span className="inline-block text-xs font-bold text-black bg-[#CCFF00] px-2 py-1 mb-6">{h.iranian.label}</span>
          <h2 className="font-estedad font-black text-4xl md:text-6xl mb-16 leading-tight max-w-3xl">{h.iranian.heading}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {h.iranian.items.map((it) => (
              <div key={it.title} className="border-s border-[#CCFF00]/30 ps-6 hover:border-[#CCFF00] transition-colors duration-500">
                <h3 className="font-estedad font-bold text-2xl mb-4 text-[#CCFF00]">{it.title}</h3>
                <p className="text-sm text-[#F2F0E9]/70 leading-relaxed">{it.body}</p>
              </div>
            ))}
          </div>

          <Link
            href={h.iranian.cta.href}
            className="inline-flex items-center gap-3 mt-16 font-bold border-b border-[#CCFF00] pb-1 hover:text-[#CCFF00] transition-colors"
          >
            {h.iranian.cta.label}
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. FOUNDER + FAQ */}
      <section className="py-32 border-t border-[#1a1a1a]/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <span className="inline-block text-xs font-bold text-[#CCFF00] bg-black px-2 py-1 mb-6">{h.founder.label}</span>
            <h3 className="font-estedad font-black text-4xl mb-8 leading-tight">
              «{h.founder.quote}»
            </h3>
            <div className="text-lg text-[#1a1a1a]/70 space-y-6 leading-relaxed">
              {h.founder.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-12">
              <p className="font-estedad font-bold text-xl">{h.founder.name}</p>
              <p className="text-xs text-[#1a1a1a]/50 mb-3">{h.founder.role}</p>
              <a
                href={h.founder.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold border-b border-[#1a1a1a] pb-0.5 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                {h.founder.telegramLabel}
              </a>
            </div>
          </div>

          <div>
            <span className="inline-block text-xs font-bold text-[#CCFF00] bg-black px-2 py-1 mb-6">پرسش‌های رایج</span>
            {h.faqs.map((f) => (
              <div key={f.q} className="border-b border-[#1a1a1a]/20 py-6 group">
                <details className="cursor-pointer">
                  <summary className="list-none flex justify-between items-start gap-4 font-estedad font-bold text-xl hover:text-[#555] transition-colors">
                    <span>{f.q}</span>
                    <span className="shrink-0 text-sm text-[#CCFF00] bg-black px-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                  </summary>
                  <p className="mt-4 text-[#1a1a1a]/60 leading-relaxed">{f.a}</p>
                </details>
              </div>
            ))}
            <Link href="/faq" className="inline-flex items-center gap-2 mt-8 text-sm font-bold border-b border-[#1a1a1a] pb-0.5 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors">
              همه‌ی سؤالات متداول
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. JOURNAL */}
      {articles.length > 0 && (
        <section className="py-24 border-t border-[#1a1a1a]/10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="inline-block text-xs font-bold text-[#CCFF00] bg-black px-2 py-1 mb-6">{h.journal.label}</span>
              <h2 className="font-estedad font-black text-5xl">
                {h.journal.heading_1} <span className="font-bold text-[#1a1a1a]/40">{h.journal.heading_2}</span>
              </h2>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-sm font-bold hover:text-[#CCFF00] transition-colors">
              {h.journal.all}
              <ArrowLeft size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {articles.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden mb-6 border border-[#1a1a1a]/10">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1a1a1a]/5 flex items-center justify-center font-estedad font-black text-[#1a1a1a]/20 text-4xl">
                      مجله
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 mb-4">
                  {post.category && (
                    <span className="text-[10px] font-bold text-[#1a1a1a] border border-[#1a1a1a] px-2 py-1">{post.category.name}</span>
                  )}
                  <time dateTime={isoDate(post.createdAt)} className="text-[10px] text-[#1a1a1a]/50">
                    {faDate(post.createdAt)}
                  </time>
                </div>
                <h3 className="font-estedad font-bold text-2xl leading-snug group-hover:text-[#CCFF00] transition-colors">{post.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 8. CHANNELS */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
        <span className="inline-block text-xs font-bold text-[#CCFF00] bg-black px-2 py-1 mb-6">{h.channels.label}</span>
        <h2 className="font-estedad font-black text-4xl md:text-6xl mb-16 leading-tight">{h.channels.heading}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1a1a1a]/20 border border-[#1a1a1a]/20">
          {h.channels.items.map((c) => {
            const inner = (
              <>
                <div>
                  <h3 className="font-estedad font-black text-2xl mb-3">{c.title}</h3>
                  <p className="text-sm text-[#1a1a1a]/60 leading-relaxed">{c.body}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold border-b border-[#1a1a1a] pb-0.5 group-hover:text-[#CCFF00] group-hover:border-[#CCFF00] transition-colors">
                  {c.cta.label}
                  <ArrowLeft className="w-4 h-4" />
                </span>
              </>
            );
            const cls = 'group bg-[#F2F0E9] p-8 min-h-[260px] flex flex-col justify-between';
            return c.external ? (
              <a key={c.title} href={c.cta.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {inner}
              </a>
            ) : (
              <Link key={c.title} href={c.cta.href} className={cls}>
                {inner}
              </Link>
            );
          })}
        </div>
      </section>

      {/* 9. CLOSING */}
      <section className="py-32 flex flex-col items-center justify-center text-center">
        <p className="text-xs tracking-[0.3em] mb-6 text-[#1a1a1a]/50">{h.closing.kicker}</p>
        <Link href={h.closing.href} className="relative group">
          <h2 className="font-estedad font-black text-6xl md:text-9xl text-[#1a1a1a] leading-tight">{h.closing.headline}</h2>
          <div className="h-2 w-0 bg-[#CCFF00] group-hover:w-full transition-all duration-500 ease-out mt-4"></div>
        </Link>
      </section>
    </div>
  );
}
