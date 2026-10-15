'use client';

// ============================================================================
// components/app-page/Phone.tsx
// A phone drawn in code, showing the app's v2 screens. The store screenshots
// on disk are from v1 (pathfinder, readiness score), so they would advertise
// an app that no longer exists; these screens follow the v2 flow and the
// Brand Book (night canvas, paper text, acid as the one accent).
// ============================================================================
import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { AppPageCopy, ScreenKey } from '@/content/app-page';

const EASE = [0.16, 1, 0.3, 1] as const;

export type FundsFigure = { amount: string; usd: string; eur: string; checked: string };

type Props = {
  screen: ScreenKey;
  copy: AppPageCopy['screens'];
  funds: FundsFigure;
  isFa: boolean;
  /** Formats a number in the page's digits. */
  num: (n: number) => string;
  className?: string;
};

const STATE_DOT: Record<'met' | 'open' | 'judged', string> = {
  met: 'bg-[#CCFF00]',
  open: 'border border-[#F2F0E9]/60',
  judged: 'bg-[#F2F0E9]/25',
};

export default function Phone({ screen, copy, funds, isFa, num, className }: Props) {
  const reduced = useReducedMotion();
  const tabIndex = screen === 'assess' || screen === 'results' || screen === 'funds' ? 2 : screen === 'route' ? 1 : 0;

  return (
    <div className={`relative ${className ?? ''}`}>
      {/* Frame */}
      <div className="relative mx-auto aspect-[9/19.5] w-full rounded-[2.6rem] bg-[#0b0c0e] p-[10px] shadow-[0_40px_80px_-20px_rgba(18,20,23,0.55),0_0_0_1px_rgba(242,240,233,0.08)_inset]">
        <div className="relative h-full w-full overflow-hidden rounded-[2.05rem] bg-[#121417] text-[#F2F0E9]" dir={isFa ? 'rtl' : 'ltr'}>
          {/* Status bar + island */}
          <div className="flex items-center justify-between px-6 pt-3 text-[10px] font-sans font-bold" dir="ltr">
            <span>9:41</span>
            <span className="h-[18px] w-[72px] rounded-full bg-black" />
            <span className="flex items-center gap-1">
              <span className="h-[7px] w-[14px] rounded-[2px] border border-[#F2F0E9]/70 p-[1px]"><span className="block h-full w-3/4 rounded-[1px] bg-[#F2F0E9]" /></span>
            </span>
          </div>

          <div className="relative h-[calc(100%-5.25rem)] px-4 pt-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={screen}
                className="absolute inset-x-4 top-4 bottom-0"
                initial={reduced ? { opacity: 0 } : { opacity: 0, x: isFa ? -24 : 24, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, x: isFa ? 24 : -24, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {screen === 'start' && <StartScreen copy={copy} isFa={isFa} />}
                {screen === 'assess' && <AssessScreen copy={copy} isFa={isFa} />}
                {screen === 'results' && <ResultsScreen copy={copy} isFa={isFa} num={num} />}
                {screen === 'route' && <RouteScreen copy={copy} isFa={isFa} funds={funds} />}
                {screen === 'funds' && <FundsScreen copy={copy} isFa={isFa} funds={funds} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Tab bar */}
          <div className={`absolute inset-x-0 bottom-0 flex h-[3.6rem] items-start justify-around border-t border-[#F2F0E9]/10 bg-[#121417] px-2 pt-2 ${isFa ? 'font-vazir' : 'font-sans'}`}>
            {copy.tabs.map((t, i) => (
              <div key={t} className="relative flex flex-col items-center gap-1">
                <span className={`h-[3px] w-5 rounded-full transition-colors duration-500 ${i === tabIndex ? 'bg-[#CCFF00]' : 'bg-[#F2F0E9]/15'}`} />
                <span className={`text-[8.5px] transition-colors duration-500 ${i === tabIndex ? 'text-[#F2F0E9]' : 'text-[#F2F0E9]/45'}`}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function display(isFa: boolean) {
  return isFa ? 'font-estedad font-bold' : 'font-serif';
}
function body(isFa: boolean) {
  return isFa ? 'font-vazir' : 'font-sans';
}

function StartScreen({ copy, isFa }: { copy: AppPageCopy['screens']; isFa: boolean }) {
  const s = copy.start;
  return (
    <div className="flex h-full flex-col">
      <div className="mb-auto">
        <svg viewBox="0 0 120 40" className="h-9 w-24" aria-hidden>
          <motion.path
            d="M4 32 C 30 30, 60 8, 112 6"
            fill="none"
            stroke="#CCFF00"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
          />
        </svg>
        <p className={`mt-4 text-[26px] leading-[1.05] ${display(isFa)}`}>{s.hello}</p>
      </div>
      <div className="mb-6 space-y-2.5">
        {[
          { t: s.choose, sub: s.chooseSub, accent: false },
          { t: s.assess, sub: s.assessSub, accent: true },
        ].map((d, i) => (
          <motion.div
            key={d.t}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.12, duration: 0.5, ease: EASE }}
            className={`flex items-center justify-between rounded-2xl px-4 py-4 ${d.accent ? 'bg-[#CCFF00] text-[#1a1a1a]' : 'bg-[#F2F0E9]/[0.07] text-[#F2F0E9]'}`}
          >
            <div>
              <p className={`text-[14px] ${display(isFa)}`}>{d.t}</p>
              <p className={`text-[10px] opacity-70 ${body(isFa)}`}>{d.sub}</p>
            </div>
            <span className={`text-lg ${isFa ? 'rotate-180' : ''}`} aria-hidden>→</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AssessScreen({ copy, isFa }: { copy: AppPageCopy['screens']; isFa: boolean }) {
  const a = copy.assess;
  return (
    <div className={`flex h-full flex-col ${body(isFa)}`}>
      <div className="flex items-center justify-between text-[10px] text-[#F2F0E9]/60">
        <span>{a.progress}</span>
        <span>{a.skip}</span>
      </div>
      <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-[#F2F0E9]/15">
        <motion.div className="h-full bg-[#CCFF00]" initial={{ width: '20%' }} animate={{ width: '30%' }} transition={{ duration: 0.9, ease: EASE }} />
      </div>
      <p className={`mt-6 text-[19px] leading-snug ${display(isFa)}`}>{a.question}</p>
      <div className="mt-5 space-y-2">
        {a.options.map((o, i) => (
          <motion.div
            key={o}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.4, ease: EASE }}
            className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-[11.5px] ${i === 2 ? 'border-[#CCFF00] bg-[#CCFF00]/10' : 'border-[#F2F0E9]/15'}`}
          >
            <span className={`grid h-3.5 w-3.5 place-items-center rounded-full border ${i === 2 ? 'border-[#CCFF00]' : 'border-[#F2F0E9]/40'}`}>
              {i === 2 && <motion.span className="h-1.5 w-1.5 rounded-full bg-[#CCFF00]" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, duration: 0.3 }} />}
            </span>
            {o}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ResultsScreen({ copy, isFa, num }: { copy: AppPageCopy['screens']; isFa: boolean; num: (n: number) => string }) {
  const r = copy.results;
  return (
    <div className={`flex h-full flex-col ${body(isFa)}`}>
      <div className="flex items-center justify-between">
        <p className={`text-[22px] ${display(isFa)}`}>{r.title}</p>
        <span className="rounded-full border border-[#F2F0E9]/25 px-2 py-0.5 text-[8.5px] uppercase tracking-wider text-[#F2F0E9]/60">{copy.exampleTag}</span>
      </div>
      <div className="mt-4 space-y-2.5">
        {r.routes.map((route, i) => (
          <motion.div
            key={route.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.12, duration: 0.5, ease: EASE }}
            className="rounded-2xl bg-[#F2F0E9]/[0.06] p-3.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[9px] font-bold tracking-widest text-[#F2F0E9]/50" dir="ltr">{route.country}</p>
                <p className={`text-[13px] leading-tight ${display(isFa)}`}>{route.name}</p>
              </div>
              {route.pct != null ? (
                <span className="text-[20px] font-sans font-bold text-[#CCFF00]" dir="ltr">
                  {isFa ? `${num(route.pct)}٪` : `${route.pct}%`}
                </span>
              ) : (
                <span className="rounded-md bg-[#F2F0E9]/10 px-2 py-1 text-[10px] font-bold">{r.met(route.met![0], route.met![1])}</span>
              )}
            </div>
            {route.pct != null && (
              <>
                <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-[#F2F0E9]/15">
                  <motion.div className="h-full bg-[#CCFF00]" initial={{ width: 0 }} animate={{ width: `${route.pct}%` }} transition={{ delay: 0.3 + i * 0.12, duration: 1, ease: EASE }} />
                </div>
                <p className="mt-1.5 text-[9px] text-[#F2F0E9]/55">{r.basedOn(route.conds!)}</p>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RouteScreen({ copy, isFa, funds }: { copy: AppPageCopy['screens']; isFa: boolean; funds: FundsFigure }) {
  const r = copy.route;
  const label = { met: r.met, open: r.open, judged: r.judged };
  return (
    <div className={`flex h-full flex-col ${body(isFa)}`}>
      <p className="text-[10px] text-[#F2F0E9]/55">{r.country}</p>
      <p className={`text-[22px] leading-tight ${display(isFa)}`}>{r.name}</p>
      <div className="mt-4 space-y-2">
        {r.items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, x: isFa ? 12 : -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.45, ease: EASE }}
            className="flex items-center justify-between rounded-xl bg-[#F2F0E9]/[0.06] px-3 py-2.5"
          >
            <span className="flex items-center gap-2.5 text-[11.5px]">
              <span className={`h-2.5 w-2.5 rounded-full ${STATE_DOT[it.state]}`} />
              {it.label}
            </span>
            <span className={`text-[9px] ${it.state === 'met' ? 'text-[#CCFF00]' : 'text-[#F2F0E9]/55'}`}>{label[it.state]}</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-auto mb-5 flex items-center gap-2 rounded-xl border border-dashed border-[#F2F0E9]/25 px-3 py-2.5 text-[9.5px] text-[#F2F0E9]/70"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#CCFF00]" />
        <span>{r.source} <span dir="ltr">{funds.checked}</span></span>
      </motion.div>
    </div>
  );
}

function FundsScreen({ copy, isFa, funds }: { copy: AppPageCopy['screens']; isFa: boolean; funds: FundsFigure }) {
  const f = copy.funds;
  const route = copy.route;
  return (
    <div className={`flex h-full flex-col ${body(isFa)}`}>
      <p className={`text-[22px] ${display(isFa)}`}>{f.title}</p>
      <p className="mt-1 text-[10px] text-[#F2F0E9]/55">{route.name} · {f.single}</p>
      <div className="mt-4 rounded-2xl bg-[#CCFF00] p-4 text-[#1a1a1a]">
        <p className="text-[9px] font-bold tracking-widest opacity-70" dir="ltr">DKK</p>
        <motion.p
          className="mt-1 text-[26px] font-sans font-bold leading-none"
          dir="ltr"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {funds.amount}
        </motion.p>
        <p className="mt-1 text-[10px] opacity-75">{f.perYear}</p>
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        {[
          { cur: 'USD', v: funds.usd, l: f.usd },
          { cur: 'EUR', v: funds.eur, l: f.eur },
        ].map((x, i) => (
          <motion.div
            key={x.cur}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.45, ease: EASE }}
            className="rounded-xl bg-[#F2F0E9]/[0.07] p-3"
          >
            <p className="text-[8.5px] text-[#F2F0E9]/55">{x.l}</p>
            <p className="text-[14px] font-sans font-bold" dir="ltr">{x.v}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-auto mb-5 flex items-center gap-2 rounded-xl border border-dashed border-[#F2F0E9]/25 px-3 py-2.5 text-[9.5px] text-[#F2F0E9]/70">
        <span className="h-1.5 w-1.5 rounded-full bg-[#CCFF00]" />
        <span>{route.source} <span dir="ltr">{funds.checked}</span></span>
      </div>
    </div>
  );
}
