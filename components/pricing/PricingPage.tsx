// ============================================================================
// components/pricing/PricingPage.tsx
// /en/pricing and /fa/pricing. Hero with the main CTA, a card per visible
// route group, the comparison table (cards on a phone), the costs billed
// apart from our fee, how payment works, the FAQ and a closing call with the
// partner link. Every word and number comes from the resolved document
// (lib/pricing/resolve.ts) or the fixed lines in lib/pricing/chrome.ts; a
// section with nothing approved to show is left out, never shown half-empty.
//
// Photographs: public/fa/img/{finland,finland-3,denmark,denmark-2,
// netherlands,netherlands-2,high-impact}.webp, Pexels, credited in
// public/fa/img/credits.json. No branded infographics: the cost-layers
// figure is drawn in code.
// ============================================================================
import React from 'react';
import { Building2, Check, Landmark, Languages, Minus, Scale } from 'lucide-react';
import Reveal from '@/components/fa/motion/Reveal';
import BreathingImage from '@/components/partners/BreathingImage';
import Image from 'next/image';
import { CHROME, groupMeta } from '@/lib/pricing/chrome';
import { CURRENCY_NAME, ctaHref, formatAmount, type CopyView, type GroupView } from '@/lib/pricing/resolve';
import { ASSESSMENT_PATH } from '@/lib/pricing/defaults';
import type { PricingLocale } from '@/lib/pricing/types';
import PriceCard from './PriceCard';
import PaymentTimeline from './PaymentTimeline';
import PricingFaq from './PricingFaq';
import { PartnerLink, PricingCta, Txt } from './Tracked';

const EXTRA_ICONS = [Landmark, Scale, Languages, Building2];

export default function PricingPage({ locale, groups, copy, showDrafts }: { locale: PricingLocale; groups: GroupView[]; copy: CopyView; showDrafts: boolean }) {
  const isRtl = locale === 'fa';
  const chrome = CHROME[locale];
  const { tbdBanner, ...cardChrome } = chrome;
  const display = isRtl ? 'font-estedad font-black' : 'font-serif';
  const body = isRtl ? 'font-vazir' : 'font-sans';
  const kicker = isRtl ? 'text-sm font-bold' : 'text-xs font-bold uppercase tracking-widest';
  const h2 = `text-4xl leading-tight md:text-5xl [text-wrap:balance] ${display}`;
  const num = (n: number) => formatAmount(n, locale);
  const cmp = copy.comparison;

  return (
    <div className={`w-full bg-[#F2F0E9] text-[#1a1a1a] ${body}`}>
      {showDrafts && (
        <p className="border-b border-[#1a1a1a] bg-amber-300 px-4 py-2 text-center text-sm font-bold" role="note">
          {tbdBanner}
        </p>
      )}

      {/* 1. Hero */}
      <section className="border-b border-[#1a1a1a] px-4 pb-14 pt-8 md:px-8 md:pb-20 md:pt-12">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            {copy.hero.eyebrow && (
              <p className={`mb-6 flex items-center gap-2 text-[#1a1a1a]/70 ${kicker}`}>
                <span className="h-3 w-3 shrink-0 border border-[#1a1a1a] bg-[#CCFF00] motion-safe:animate-pulse" aria-hidden />
                <Txt s={copy.hero.eyebrow} />
              </p>
            )}
            <h1 className={`text-5xl leading-[1.02] tracking-tight md:text-7xl [text-wrap:balance] ${display}`}>
              <Txt s={copy.hero.title} />
            </h1>
            {copy.hero.lede && (
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#1a1a1a]/85">
                <Txt s={copy.hero.lede} />
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <PricingCta href={ctaHref(ASSESSMENT_PATH, 'hero', locale)} label={copy.hero.cta} routeKey="hero" locale={locale} />
              <a href="#routes" className="inline-flex min-h-12 items-center justify-center border border-[#1a1a1a] px-6 py-3 font-bold transition-colors duration-200 hover:bg-[#1a1a1a] hover:text-[#F2F0E9]">
                {chrome.seeRoutes}
              </a>
            </div>
          </div>

          {/* Photo collage + the three-costs figure */}
          <div className="relative lg:col-span-6">
            <div className="grid grid-cols-6 grid-rows-6 gap-3 h-[22rem] md:h-[28rem]">
              <BreathingImage
                src="/fa/img/finland-3.webp"
                alt={isRtl ? 'بندر هلسینکی هنگام طلوع' : 'Helsinki harbour at sunrise'}
                sizes="(min-width: 1024px) 30vw, 70vw"
                priority
                className="col-span-4 row-span-6 border border-[#1a1a1a]"
              />
              <div className="relative col-span-2 row-span-3 overflow-hidden border border-[#1a1a1a]">
                <Image src="/fa/img/denmark-2.webp" alt={isRtl ? 'پل و ساحل کپنهاگ هنگام غروب' : 'Copenhagen waterfront at dusk'} fill sizes="20vw" className="object-cover" />
              </div>
              <div className="relative col-span-2 row-span-3 overflow-hidden border border-[#1a1a1a]">
                <Image src="/fa/img/netherlands-2.webp" alt={isRtl ? 'دوچرخه‌ها روی پلی در آمستردام' : 'Bicycles on a canal bridge in Amsterdam'} fill sizes="20vw" className="object-cover" />
              </div>
            </div>
            <figure className="relative -mt-16 w-[85%] border border-[#1a1a1a] bg-[#FBFAF6] p-5 shadow-[8px_8px_0_#1a1a1a] ltr:ml-auto ltr:mr-4 rtl:ml-4 rtl:mr-auto md:w-[70%]">
              <figcaption className={`mb-3 ${kicker}`}>{chrome.layers.title}</figcaption>
              <ul className="space-y-2 text-sm font-bold">
                <li className="flex items-center gap-3">
                  <span className="h-6 w-[38%] border border-[#1a1a1a] bg-[#CCFF00] motion-safe:origin-left motion-safe:animate-[pricingGrow_900ms_ease-out_both] rtl:motion-safe:origin-right" aria-hidden />
                  {chrome.layers.ours}
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-6 w-[24%] border border-[#1a1a1a] bg-[#1a1a1a] motion-safe:origin-left motion-safe:animate-[pricingGrow_900ms_150ms_ease-out_both] rtl:motion-safe:origin-right" aria-hidden />
                  {chrome.layers.gov}
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-6 w-[30%] border border-dashed border-[#1a1a1a] bg-[repeating-linear-gradient(135deg,#1a1a1a1f_0_6px,transparent_6px_12px)] motion-safe:origin-left motion-safe:animate-[pricingGrow_900ms_300ms_ease-out_both] rtl:motion-safe:origin-right" aria-hidden />
                  {chrome.layers.third}
                </li>
              </ul>
            </figure>
          </div>
        </div>
      </section>

      {/* 2. Price cards */}
      <section id="routes" className="scroll-mt-24 border-b border-[#1a1a1a] px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <Reveal>
            <h2 className={h2}>
              <Txt s={copy.cards.title} />
            </h2>
            {copy.cards.intro && (
              <p className="mb-10 mt-4 max-w-2xl text-lg leading-relaxed text-[#1a1a1a]/75">
                <Txt s={copy.cards.intro} />
              </p>
            )}
          </Reveal>
          <div className="grid items-start gap-8 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((g) => {
              const meta = groupMeta(g.key, locale);
              return (
                <PriceCard
                  key={g.key}
                  g={g}
                  locale={locale}
                  chrome={cardChrome}
                  theme={meta.theme}
                  guides={meta.guides}
                  flag={meta.flag}
                  prices={g.prices.map((p) => ({ label: p.label, amount: p.amount ? num(p.amount) : null }))}
                  currency={{ name: CURRENCY_NAME[locale][g.currency], code: g.currency }}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Comparison: a table from md up, a card per row on a phone */}
      {cmp.rows.length > 0 && cmp.typicalHeading && (
        <section className="border-b border-[#1a1a1a] px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-[1280px]">
            <Reveal>
              <h2 className={h2}>
                <Txt s={cmp.title} />
              </h2>
              {cmp.intro && (
                <p className="mb-10 mt-4 max-w-2xl text-lg leading-relaxed text-[#1a1a1a]/75">
                  <Txt s={cmp.intro} />
                </p>
              )}
            </Reveal>
            <table className="hidden w-full border-collapse border border-[#1a1a1a] text-start md:table">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  <th scope="col" className="w-2/5 p-4 text-start" />
                  <th scope="col" className={`bg-[#CCFF00] p-4 text-start text-xl ${display}`}>
                    <Txt s={cmp.usHeading} />
                  </th>
                  <th scope="col" className={`p-4 text-start text-xl text-[#1a1a1a]/70 ${display}`}>
                    <Txt s={cmp.typicalHeading} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {cmp.rows.map((r, i) => (
                  <tr key={i} className="border-b border-[#1a1a1a]/20 transition-colors duration-200 last:border-0 hover:bg-[#FBFAF6]">
                    <th scope="row" className="p-4 text-start font-bold">
                      <Txt s={r.label} />
                    </th>
                    <td className="bg-[#CCFF00]/25 p-4">
                      <span className="flex items-start gap-2">
                        <Check className="mt-1 h-4 w-4 shrink-0" aria-hidden />
                        <span>
                          <Txt s={r.us} />
                        </span>
                      </span>
                    </td>
                    <td className="p-4 text-[#1a1a1a]/75">
                      <Txt s={r.typical} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="space-y-4 md:hidden">
              {cmp.rows.map((r, i) => (
                <li key={i} className="border border-[#1a1a1a] bg-[#FBFAF6]">
                  <p className="border-b border-[#1a1a1a] p-4 font-bold">
                    <Txt s={r.label} />
                  </p>
                  <dl className="grid grid-cols-2 text-sm">
                    <div className="bg-[#CCFF00]/40 p-4 ltr:border-r rtl:border-l border-[#1a1a1a]">
                      <dt className="mb-1 font-bold">
                        <Txt s={cmp.usHeading} />
                      </dt>
                      <dd>
                        <Txt s={r.us} />
                      </dd>
                    </div>
                    <div className="p-4">
                      <dt className="mb-1 font-bold text-[#1a1a1a]/70">
                        <Txt s={cmp.typicalHeading} />
                      </dt>
                      <dd className="text-[#1a1a1a]/75">
                        <Txt s={r.typical} />
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 4. Costs billed apart from our fee */}
      {copy.extras.items.length > 0 && (
        <section className="bg-[#1a1a1a] px-4 py-14 text-[#F2F0E9] md:px-8 md:py-20">
          <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <h2 className={h2}>
                <Txt s={copy.extras.title} />
              </h2>
              {copy.extras.intro && (
                <p className="mt-4 leading-relaxed text-[#F2F0E9]/75">
                  <Txt s={copy.extras.intro} />
                </p>
              )}
            </Reveal>
            <ul className="grid gap-px border border-[#F2F0E9]/25 bg-[#F2F0E9]/25 sm:grid-cols-2 lg:col-span-8">
              {copy.extras.items.map((it, i) => {
                const Icon = EXTRA_ICONS[i % EXTRA_ICONS.length];
                return (
                  <Reveal as="li" key={i} delay={0.06 * i} className="group bg-[#1a1a1a] p-6 transition-colors duration-300 hover:bg-[#242424]">
                    <span className="mb-4 flex h-11 w-11 items-center justify-center border border-[#F2F0E9]/40 transition-colors duration-300 group-hover:border-[#CCFF00] group-hover:bg-[#CCFF00] group-hover:text-[#1a1a1a]">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="text-lg font-bold">
                      <Txt s={it.title} />
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#F2F0E9]/75">
                      <Txt s={it.body} />
                    </p>
                  </Reveal>
                );
              })}
            </ul>
            <p className="flex items-start gap-3 border-t border-[#F2F0E9]/20 pt-6 text-sm leading-relaxed text-[#F2F0E9]/80 lg:col-span-8 lg:col-start-5">
              <Minus className="mt-0.5 h-4 w-4 shrink-0 text-[#CCFF00]" aria-hidden />
              {chrome.feeOnly}
            </p>
          </div>
        </section>
      )}

      {/* 5. How payment works */}
      {copy.payment.steps.length > 0 && (
        <section className="border-b border-[#1a1a1a] px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-[1280px]">
            <Reveal>
              <h2 className={h2}>
                <Txt s={copy.payment.title} />
              </h2>
              {copy.payment.intro && (
                <p className="mb-12 mt-4 max-w-2xl text-lg leading-relaxed text-[#1a1a1a]/75">
                  <Txt s={copy.payment.intro} />
                </p>
              )}
            </Reveal>
            <PaymentTimeline steps={copy.payment.steps} numbers={copy.payment.steps.map((_, i) => num(i + 1))} locale={locale} />
          </div>
        </section>
      )}

      {/* 6. FAQ */}
      {copy.faq.items.length > 0 && (
        <section className="border-b border-[#1a1a1a] px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <h2 className={h2}>
                <Txt s={copy.faq.title} />
              </h2>
            </Reveal>
            <div className="lg:col-span-8">
              <PricingFaq items={copy.faq.items} locale={locale} />
            </div>
          </div>
        </section>
      )}

      {/* 7. Final call + partner link */}
      <section className="relative overflow-hidden bg-[#1a1a1a] px-4 py-16 text-[#F2F0E9] md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[1280px] items-end gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <h2 className={`text-4xl leading-tight md:text-6xl [text-wrap:balance] ${display}`}>
              <Txt s={copy.final.title} />
            </h2>
            {copy.final.body && (
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#F2F0E9]/80">
                <Txt s={copy.final.body} />
              </p>
            )}
            <div className="mt-8">
              <PricingCta href={ctaHref(ASSESSMENT_PATH, 'final', locale)} label={copy.final.cta} routeKey="final" locale={locale} variant="acid" />
            </div>
          </Reveal>
          <div className="border-t border-[#F2F0E9]/25 pt-6 text-sm lg:col-span-4 lg:border-t-0 lg:pt-0">
            <p className="mb-1 text-[#F2F0E9]/70">
              <Txt s={copy.final.partnerPrompt} />
            </p>
            <PartnerLink label={copy.final.partnerLink} locale={locale} arrow={chrome.partnerArrow} />
          </div>
        </div>
      </section>
    </div>
  );
}
