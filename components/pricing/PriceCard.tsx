'use client';

// ============================================================================
// components/pricing/PriceCard.tsx
// One route group. Photo band in the route's own colours, the fixed fee (the
// first tier large, the others listed; with no number, "price after the
// assessment"), the fixed lines (assessment first, legal line),
// an Included / Billed-separately toggle and the payment milestones, which
// expand. Hover lifts the card onto an offset shadow; reduced motion keeps
// the shadow and drops the movement.
// ============================================================================
import React, { useId, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, ChevronDown, Clock, Info, Minus } from 'lucide-react';
import { Link } from '@/navigation';
import type { GroupView } from '@/lib/pricing/resolve';
import type { RouteTheme } from '@/components/route/RouteProgress';
import { CANADA_KEYS, legalLine, type CardChrome } from '@/lib/pricing/chrome';
import { TBD } from '@/lib/pricing/types';
import { PricingCta, Txt } from './Tracked';

export default function PriceCard({
  g,
  locale,
  chrome,
  theme,
  guides,
  prices,
  currency,
}: {
  g: GroupView;
  locale: string;
  chrome: CardChrome;
  theme: RouteTheme;
  guides: { label: string; href: string }[];
  /** Pre-formatted on the server ('20,000' / '۲۰٬۰۰۰'); null amount = TBD, dev only. */
  prices: { label: string; amount: string | null }[];
  currency: { name: string; code: string };
}) {
  const isRtl = locale === 'fa';
  const display = isRtl ? 'font-estedad font-black' : 'font-serif';
  const available = (['in', 'out'] as const).filter((t) => (t === 'in' ? g.includes : g.excludes).length > 0);
  // Only timing depends on the preference; `initial` stays identical (see useHydratedReducedMotion).
  const reduced = useReducedMotion();
  const [picked, setPicked] = useState<'in' | 'out'>('in');
  const tab = available.includes(picked) ? picked : available[0];
  const setTab = setPicked;
  const [open, setOpen] = useState(false);
  const id = useId();
  const soon = g.status === 'soon';
  const lists = { in: g.includes, out: g.excludes };
  const hasLists = available.length > 0;
  const single = available.length === 1;
  const isCanada = CANADA_KEYS.includes(g.key);
  const legal = legalLine(g.key, chrome);
  const [lead, ...rest] = prices;

  return (
    <article
      id={g.key}
      className={`group relative flex scroll-mt-28 flex-col border border-[#1a1a1a] bg-[#FBFAF6] shadow-[0_0_0_#1a1a1a] transition-[transform,box-shadow] duration-300 ease-out hover:shadow-[8px_8px_0_#1a1a1a] focus-within:shadow-[8px_8px_0_#1a1a1a] motion-safe:hover:-translate-x-1 motion-safe:hover:-translate-y-1 ${soon ? 'md:col-span-2 xl:col-span-1' : ''}`}
    >
      <div className="relative h-44 overflow-hidden border-b border-[#1a1a1a]" style={{ backgroundColor: theme.primary }}>
        {!g.image && (
          // No credited photograph for this route: stripes in its own colours, drawn in code.
          <span
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{ backgroundImage: `repeating-linear-gradient(180deg, ${theme.accent} 0 14px, transparent 14px 28px)` }}
          />
        )}
        {g.image && (
          <Image
            src={g.image}
            alt={g.imageAlt}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"
            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${soon ? 'grayscale-[35%]' : ''}`}
          />
        )}
        <span className="absolute inset-x-0 bottom-0 h-2" style={{ backgroundColor: theme.accent }} aria-hidden />
        {soon && (
          <span className="absolute top-4 bg-[#1a1a1a] px-3 py-1 text-xs font-bold text-[#F2F0E9] ltr:left-4 rtl:right-4">{chrome.soon}</span>
        )}
        {g.awaitingLegalReview && (
          <span className="absolute inset-x-4 top-4 border border-[#1a1a1a] bg-amber-300 px-3 py-2 text-xs font-bold text-[#1a1a1a]">{chrome.awaitingReview}</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className={`text-2xl leading-tight md:text-[1.7rem] ${display}`}>
          <Txt s={g.title} />
        </h3>
        {g.summary && (
          <p className="mt-3 leading-relaxed text-[#1a1a1a]/80">
            <Txt s={g.summary} />
          </p>
        )}

        {/* Price: the first tier large, the others as a list */}
        {!soon && (
          <div className="mt-6 border-t border-[#1a1a1a] pt-5">
            {lead ? (
              <>
                <p className="text-sm text-[#1a1a1a]/70">
                  <Txt s={lead.label} />
                </p>
                <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                  <span className={`text-5xl leading-none tracking-tight ${display}`}>{lead.amount ?? <Txt s={TBD} />}</span>
                  <span className="text-lg font-bold">{currency.name}</span>
                  {currency.code !== currency.name && <bdi dir="ltr" className="text-sm text-[#1a1a1a]/60">{currency.code}</bdi>}
                </p>
                {rest.length > 0 && (
                  <ul className="mt-4 divide-y divide-[#1a1a1a]/15 border-y border-[#1a1a1a]/15">
                    {rest.map((p, i) => (
                      <li key={i} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                        <span className="text-[#1a1a1a]/80">
                          <Txt s={p.label} />
                        </span>
                        <span className="shrink-0 whitespace-nowrap">
                          <span className={`text-xl ${display}`}>{p.amount ?? <Txt s={TBD} />}</span> <span className="font-bold">{currency.name}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className={`text-2xl leading-snug ${display}`}>{chrome.priceLater}</p>
            )}
            {g.note && (
              <p className="mt-4 flex items-start gap-2 border border-[#1a1a1a] bg-[#F2F0E9] px-3 py-2 text-sm font-bold leading-relaxed">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>
                  <Txt s={g.note} />
                </span>
              </p>
            )}
            <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed">
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0" style={{ backgroundColor: theme.accent }} aria-hidden />
              <span>{chrome.assessmentFirst}</span>
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[#1a1a1a]/65">{chrome.feeOnly}</p>
          </div>
        )}
        {soon && <p className="mt-6 border-t border-[#1a1a1a] pt-5 text-sm font-bold text-[#1a1a1a]/70">{chrome.soonNote}</p>}

        {legal && (
          <p className="mt-4 border-[#1a1a1a] bg-[#F2F0E9] p-3 text-sm font-bold leading-relaxed ltr:border-l-4 rtl:border-r-4" style={{ borderColor: theme.accent }}>
            {legal}
          </p>
        )}

        {/* Included / billed separately */}
        {hasLists && (
          <div className="mt-6">
            {single ? (
              <p className="border border-[#1a1a1a] bg-[#1a1a1a] px-3 py-2.5 text-center text-sm font-bold text-[#F2F0E9]">{tab === 'in' ? chrome.included : chrome.excluded}</p>
            ) : (
            <div role="tablist" aria-label={`${chrome.included} / ${chrome.excluded}`} className="grid grid-cols-2 border border-[#1a1a1a] text-sm font-bold">
              {(['in', 'out'] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  type="button"
                  id={`${id}-tab-${t}`}
                  aria-selected={tab === t}
                  aria-controls={`${id}-panel`}
                  onClick={() => setTab(t)}
                  onKeyDown={(e) => {
                    if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
                      e.preventDefault();
                      const next = tab === 'in' ? 'out' : 'in';
                      setTab(next);
                      document.getElementById(`${id}-tab-${next}`)?.focus();
                    }
                  }}
                  tabIndex={tab === t ? 0 : -1}
                  className={`min-h-11 px-3 transition-colors duration-200 ${tab === t ? 'bg-[#1a1a1a] text-[#F2F0E9]' : 'bg-transparent hover:bg-[#1a1a1a]/5'}`}
                >
                  {t === 'in' ? chrome.included : chrome.excluded}
                </button>
              ))}
            </div>
            )}
            <div id={`${id}-panel`} role={single ? undefined : 'tabpanel'} aria-labelledby={single ? undefined : `${id}-tab-${tab}`} className="border-x border-b border-[#1a1a1a] p-4">
              <AnimatePresence mode="wait" initial={false}>
                <motion.ul
                  key={tab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.18 }}
                  className="space-y-2 text-sm leading-relaxed"
                >
                  {lists[tab].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {tab === 'in' ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: theme.accentText }} aria-hidden />
                      ) : (
                        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-[#1a1a1a]/50" aria-hidden />
                      )}
                      <span>
                        <Txt s={item} />
                      </span>
                    </li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          </div>
        )}

        {g.duration && (
          <p className="mt-4 flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 shrink-0" aria-hidden />
            <span className="text-[#1a1a1a]/70">{chrome.duration}:</span>
            <span className="font-bold">
              <Txt s={g.duration} />
            </span>
          </p>
        )}

        {/* Payment milestones */}
        {g.milestones.length > 0 && (
          <div className="mt-4 border-t border-[#1a1a1a]/20 pt-2">
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`${id}-milestones`}
              onClick={() => setOpen((v) => !v)}
              className="flex min-h-11 w-full items-center justify-between gap-3 text-sm font-bold"
            >
              {open ? chrome.hideMilestones : chrome.showMilestones}
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} aria-hidden />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={`${id}-milestones`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <ol className="relative space-y-3 pb-2 pt-1 ltr:pl-6 rtl:pr-6">
                    <span className="absolute bottom-3 top-2 w-px bg-[#1a1a1a]/30 ltr:left-[7px] rtl:right-[7px]" aria-hidden />
                    {g.milestones.map((m, i) => (
                      <li key={i} className="relative text-sm leading-relaxed">
                        <span
                          className="absolute top-1 flex h-[15px] w-[15px] items-center justify-center border border-[#1a1a1a] text-[9px] font-bold ltr:-left-6 rtl:-right-6"
                          style={{ backgroundColor: theme.accent, color: theme.accentInk }}
                          aria-hidden
                        />
                        <Txt s={m} />
                      </li>
                    ))}
                  </ol>
                  {isCanada && <p className="pb-2 text-xs leading-relaxed text-[#1a1a1a]/70">{chrome.canadaMilestones}</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-6">
          <PricingCta href={g.ctaHref} label={g.ctaLabel} routeKey={g.key} locale={locale} variant={soon ? 'outline' : 'ink'} className={soon ? '' : 'w-full sm:w-auto'} />
          {guides.length > 0 && (
            <p className="flex flex-wrap items-center gap-x-3 text-sm">
              <span className="text-[#1a1a1a]/60">{chrome.guide}:</span>
              {guides.map((gd) => (
                <Link key={gd.href} href={gd.href} className="inline-flex min-h-11 items-center gap-1 font-bold underline underline-offset-4 hover:no-underline">
                  {gd.label}
                  <ArrowUpRight className={`h-3.5 w-3.5 ${isRtl ? '-scale-x-100' : ''}`} aria-hidden />
                </Link>
              ))}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
