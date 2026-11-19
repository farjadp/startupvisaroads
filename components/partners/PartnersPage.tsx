// ============================================================================
// components/partners/PartnersPage.tsx
// The B2B partner page, /en/partners and /fa/partners (layout A, picked by
// Farjad on 19 Nov 2026): hero copy beside the booking card, then the
// two-lane collaboration, the routes with their official gates, scope, the
// people, the FAQ and a closing call. One component, two locales; the copy
// in content/partners.ts is written separately per language.
// ============================================================================
import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, Check, X, ChevronDown } from 'lucide-react';
import { Link } from '@/navigation';
import { MAIN_CONTACT } from '@/content/contact';
import type { PartnerCopy } from '@/content/partners';
import Reveal from '@/components/fa/motion/Reveal';
import BookingEmbed from '@/components/partners/BookingEmbed';
import BreathingImage from '@/components/partners/BreathingImage';
import HandoffLanes from '@/components/partners/HandoffLanes';
import PartnerCta, { BOOKING_ANCHOR } from '@/components/partners/PartnerCta';
import StickyBookBar from '@/components/partners/StickyBookBar';

const HERO_ID = 'partners-hero';

export default function PartnersPage({ copy, locale }: { copy: PartnerCopy; locale: string }) {
  const isRtl = locale === 'fa';
  const display = isRtl ? 'font-estedad font-black' : 'font-serif';
  const body = isRtl ? 'font-vazir' : 'font-sans';
  const kicker = isRtl ? 'text-xs font-bold' : 'text-xs font-bold uppercase tracking-widest';

  return (
    <div className={`w-full bg-[#F2F0E9] text-[#1a1a1a] pb-24 lg:pb-0 ${body}`}>
      {/* 1. Hero + booking card */}
      <section id={HERO_ID} className="border-b border-[#1a1a1a] px-4 pb-14 pt-6 md:px-8 md:pt-10">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <p className={`mb-6 flex items-center gap-2 text-[#1a1a1a]/70 ${kicker}`}>
              <span className="h-3 w-3 shrink-0 border border-[#1a1a1a] bg-[#CCFF00] motion-safe:animate-pulse" aria-hidden />
              {copy.eyebrow}
            </p>
            <h1 className={`text-5xl leading-[0.98] tracking-tight md:text-7xl [text-wrap:balance] ${display}`}>
              {copy.h1a}
              <br />
              <span className={`text-[#1a1a1a]/45 ${isRtl ? '' : 'italic'}`}>{copy.h1b}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#1a1a1a]/85">{copy.lede}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <PartnerCta label={copy.ctaBook} locale={locale} placement="hero" variant="ink" />
              <a
                href="#how"
                className="inline-flex min-h-12 items-center justify-center border border-[#1a1a1a] px-6 py-3 font-bold transition-colors duration-200 hover:bg-[#1a1a1a] hover:text-[#F2F0E9]"
              >
                {copy.ctaHow}
              </a>
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <LaneList title={copy.keep.title} items={copy.keep.items} mark="bg-[#1a1a1a]" kicker={kicker} />
              <LaneList title={copy.build.title} items={copy.build.items} mark="border border-[#1a1a1a] bg-[#CCFF00]" kicker={kicker} />
            </div>
          </div>

          <div id={BOOKING_ANCHOR} className="scroll-mt-28 self-start lg:sticky lg:top-28 lg:col-span-5">
            <BreathingImage
              src="/fa/img/mentorship.webp"
              alt={copy.heroImageAlt}
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
              className="h-40 border border-b-0 border-[#1a1a1a] md:h-48"
            />
            <BookingEmbed
              copy={copy.booking}
              locale={locale}
              email={MAIN_CONTACT.b2bEmail}
              telegram={MAIN_CONTACT.telegram}
              telegramHandle={MAIN_CONTACT.telegramHandle}
            />
          </div>
        </div>
      </section>

      {/* 2. How the collaboration works */}
      <section id="how" className="scroll-mt-28 border-b border-[#1a1a1a] px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <Reveal>
            <h2 className={`text-4xl leading-tight md:text-5xl ${display}`}>{copy.handoff.title}</h2>
            <p className="mb-10 mt-4 max-w-2xl text-lg leading-relaxed text-[#1a1a1a]/75">{copy.handoff.intro}</p>
          </Reveal>
          <HandoffLanes copy={copy.handoff} locale={locale} />
        </div>
      </section>

      {/* 3. Routes, each with its official gate */}
      <section className="border-b border-[#1a1a1a] px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <Reveal>
            <h2 className={`text-4xl leading-tight md:text-5xl ${display}`}>{copy.routes.title}</h2>
            <p className="mb-10 mt-4 max-w-2xl text-lg leading-relaxed text-[#1a1a1a]/75">{copy.routes.intro}</p>
          </Reveal>
          <ul className="grid gap-px border border-[#1a1a1a] bg-[#1a1a1a] sm:grid-cols-2 lg:grid-cols-4">
            {copy.routes.items.map((r, i) => (
              <Reveal as="li" key={r.key} delay={0.08 * i} className="group flex flex-col bg-[#F2F0E9]">
                <div className="relative h-40 overflow-hidden border-b border-[#1a1a1a]">
                  <Image
                    src={r.image}
                    alt={r.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className={`text-2xl ${display}`}>{r.name}</h3>
                  <p className={`mb-3 text-[#1a1a1a]/70 ${isRtl ? 'text-sm' : 'text-xs uppercase tracking-widest'}`}>{r.permit}</p>
                  <p className="flex-1 text-sm leading-relaxed">{r.gate}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
                    <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-[#1a1a1a]/70">
                      {copy.routes.source}:&nbsp;<bdi dir="ltr">{r.sourceLabel}</bdi>
                    </a>
                    <Link href={r.href} className="inline-flex min-h-11 items-center gap-1 font-bold hover:underline">
                      {copy.routes.guide}
                      <ArrowUpRight className={`h-4 w-4 ${isRtl ? '-scale-x-100' : ''}`} aria-hidden />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-8 flex max-w-3xl items-start gap-3 text-[#1a1a1a]/80">
            <span className="mt-2 h-3 w-3 shrink-0 border border-[#1a1a1a] bg-[#CCFF00]" aria-hidden />
            <p className="leading-relaxed">
              {copy.routes.canada.text}{' '}
              <a href={copy.routes.canada.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {copy.routes.source}:&nbsp;<bdi dir="ltr">{copy.routes.canada.sourceLabel}</bdi>
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* 4. Scope */}
      <section className="bg-[#1a1a1a] px-4 py-14 text-[#F2F0E9] md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className={`text-4xl leading-tight md:text-5xl ${display}`}>{copy.scope.title}</h2>
          </Reveal>
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8">
            <ScopeList title={copy.scope.do.title} items={copy.scope.do.items} kind="do" kicker={kicker} />
            <ScopeList title={copy.scope.dont.title} items={copy.scope.dont.items} kind="dont" kicker={kicker} />
          </div>
          <p className="border-t border-[#F2F0E9]/20 pt-6 text-sm leading-relaxed text-[#F2F0E9]/75 lg:col-span-8 lg:col-start-5">{copy.disclaimer}</p>
        </div>
      </section>

      {/* 5. Who is behind it */}
      <section className="border-b border-[#1a1a1a] px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <Reveal>
            <h2 className={`text-4xl leading-tight md:text-5xl ${display}`}>{copy.who.title}</h2>
            <p className="mb-10 mt-4 max-w-2xl text-lg leading-relaxed text-[#1a1a1a]/75">{copy.who.body}</p>
          </Reveal>
          <ul className="grid gap-6 md:grid-cols-3">
            {copy.who.people.map((p, i) => (
              <Reveal as="li" key={p.name} delay={0.08 * i} className="flex gap-4 border-t-2 border-[#1a1a1a] pt-5">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center bg-[#CCFF00] text-2xl ${display}`} aria-hidden>
                  {p.name.charAt(0)}
                </span>
                <div>
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p className="text-sm text-[#1a1a1a]/70">{p.role}</p>
                  <p className="mt-2 text-sm leading-relaxed">{p.line}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <Link href="/team" className="inline-flex min-h-11 items-center gap-1 font-bold underline underline-offset-4">
              {copy.who.teamLink}
              <ArrowUpRight className={`h-4 w-4 ${isRtl ? '-scale-x-100' : ''}`} aria-hidden />
            </Link>
            <p className="text-[#1a1a1a]/70">{copy.who.entity}</p>
          </div>
        </div>
      </section>

      {/* 6. FAQ: native details, so every answer is in the HTML */}
      <section className="border-b border-[#1a1a1a] px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className={`text-4xl leading-tight md:text-5xl ${display}`}>{copy.faq.title}</h2>
          </Reveal>
          <div className="divide-y divide-[#1a1a1a]/20 border-y border-[#1a1a1a] lg:col-span-8">
            {copy.faq.items.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" aria-hidden />
                </summary>
                <p className="pb-5 leading-relaxed text-[#1a1a1a]/80">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Closing call */}
      <section className="bg-[#CCFF00] px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className={`text-4xl leading-tight md:text-6xl ${display}`}>{copy.final.title}</h2>
            <p className="mt-4 text-lg leading-relaxed">{copy.final.body}</p>
          </div>
          <PartnerCta label={copy.ctaBook} locale={locale} placement="final" variant="ink" />
        </div>
      </section>

      <StickyBookBar label={copy.sticky} locale={locale} heroId={HERO_ID} />
    </div>
  );
}

function LaneList({ title, items, mark, kicker }: { title: string; items: string[]; mark: string; kicker: string }) {
  return (
    <div>
      <p className={`mb-2 ${kicker}`}>{title}</p>
      <ul>
        {items.map((x) => (
          <li key={x} className="flex items-start gap-3 border-b border-[#1a1a1a]/15 py-2.5">
            <span className={`mt-2 h-2 w-2 shrink-0 ${mark}`} aria-hidden />
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScopeList({ title, items, kind, kicker }: { title: string; items: string[]; kind: 'do' | 'dont'; kicker: string }) {
  const Icon = kind === 'do' ? Check : X;
  return (
    <div>
      <p className={`mb-4 ${kind === 'do' ? 'text-[#CCFF00]' : 'text-[#F2F0E9]/70'} ${kicker}`}>{title}</p>
      <ul className="space-y-4">
        {items.map((x) => (
          <li key={x} className="flex items-start gap-3 leading-relaxed">
            <Icon className={`mt-1 h-5 w-5 shrink-0 ${kind === 'do' ? 'text-[#CCFF00]' : 'text-[#F2F0E9]/60'}`} aria-hidden />
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}
