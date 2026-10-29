'use client';
// ============================================================================
// Spain-shaped games for /en/europe/spain.
//  - MeansCalculator: the IPREM criterion for entrepreneurs (100% for the
//    holder, 150% for a two-person household, +50% per further member), IPREM
//    2026 = €600 a month. The monthly figure is the administration's; the
//    multi-month totals are our arithmetic and are labelled as such.
//  - SpainSteps: the shared StepWalker, laid out for six steps (the shared one
//    is a fixed five-column grid).
// All copy arrives as props or is rendered on the server-visible markup.
// ============================================================================
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useRoute } from '@/components/route/RouteProgress';
import type { RouteStep } from '@/components/route/RouteWidgets';

const eur = (n: number) => `€${Math.round(n).toLocaleString('en')}`;

function Toggle({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 font-sans text-sm transition-colors ${
        pressed ? 'border-[var(--rp)] bg-[var(--rp)] text-white' : 'border-[#1a1a1a]/15 bg-[#F2F0E9] hover:border-[var(--rp)]'
      }`}
    >
      {children}
    </button>
  );
}

/** IPREM 2026, € a month, and the shares the criterion applies. */
export interface MeansRule {
  iprem: number;
  holder: number;
  twoPerson: number;
  eachFurther: number;
}

export function MeansCalculator({ stopId, rule }: { stopId: string; rule: MeansRule }) {
  const { complete } = useRoute();
  const [partner, setPartner] = useState(false);
  const [others, setOthers] = useState(0);
  const [months, setMonths] = useState(36);

  const people = 1 + (partner ? 1 : 0) + others;
  const monthly =
    people === 1 ? rule.iprem * rule.holder : rule.iprem * rule.twoPerson + rule.iprem * rule.eachFurther * (people - 2);
  const touch = () => complete(stopId, 'Funds worked out');

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="grid content-start gap-5 rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        <div>
          <p className="mb-2 font-sans text-sm font-bold">Spouse or partner coming with you?</p>
          <div className="flex flex-wrap gap-1.5">
            <Toggle pressed={!partner} onClick={() => { setPartner(false); touch(); }}>No</Toggle>
            <Toggle pressed={partner} onClick={() => { setPartner(true); touch(); }}>Yes</Toggle>
          </div>
        </div>
        <div>
          <p className="mb-2 font-sans text-sm font-bold">Other family members (children, dependent parents)</p>
          <div className="flex flex-wrap gap-1.5">
            {[0, 1, 2, 3, 4].map((n) => (
              <Toggle key={n} pressed={others === n} onClick={() => { setOthers(n); touch(); }}>{n === 4 ? '4' : String(n)}</Toggle>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-sans text-sm font-bold">Cover how many months?</p>
          <div className="flex flex-wrap gap-1.5">
            {[12, 24, 36].map((m) => (
              <Toggle key={m} pressed={months === m} onClick={() => { setMonths(m); touch(); }}>{m} months</Toggle>
            ))}
          </div>
          <p className="mt-2 font-sans text-xs text-[#1a1a1a]/55">
            36 months covers the whole first permit. Under the old two-year permit, 24 months was the common practice.
          </p>
        </div>
      </div>
      <div className="grid content-start gap-3 self-start rounded-2xl bg-[var(--rd)] p-6 text-white" aria-live="polite">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--ra-dark)]">
          Household of {people}
        </p>
        <p>
          <span className="block font-serif text-5xl tabular-nums">{eur(monthly)}</span>
          <span className="font-sans text-sm text-white/70">a month: the administration&apos;s IPREM criterion, 2026</span>
        </p>
        <p className="border-t border-white/15 pt-3">
          <span className="block font-serif text-3xl tabular-nums text-[var(--ra-dark)]">{eur(monthly * months)}</span>
          <span className="font-sans text-sm text-white/70">
            over {months} months. Our multiplication, not a published UGE figure.
          </span>
        </p>
        <p className="font-sans text-xs text-white/60">
          The money must be your own: no third-party guarantee or undertaking, and you may be asked for a year of bank statements.
        </p>
      </div>
    </div>
  );
}

export function SpainSteps({ stopId, steps }: { stopId: string; steps: RouteStep[] }) {
  const { complete } = useRoute();
  const [cur, setCur] = useState(0);
  const [seen, setSeen] = useState(0);
  const last = steps.length - 1;
  const go = (i: number) => {
    const n = Math.max(0, Math.min(last, i));
    setCur(n);
    setSeen((s) => Math.max(s, n));
    if (n === last) complete(stopId, 'All six steps walked');
  };
  return (
    <div>
      <div aria-hidden="true" className="relative mb-5 grid grid-cols-6">
        <span className="absolute left-[8.33%] right-[8.33%] top-[18px] h-0.5 bg-[#1a1a1a]/10" />
        <span className="absolute left-[8.33%] top-[18px] h-0.5 bg-[var(--ra)] transition-[width] duration-500" style={{ width: `${(cur / last) * 83.33}%` }} />
        {steps.map((s, i) => (
          <button key={s.title} type="button" tabIndex={-1} onClick={() => go(i)} className="relative grid min-w-0 justify-items-center gap-2 px-0.5 text-center">
            <span
              className={`grid h-9 w-9 place-items-center rounded-full border-2 font-sans text-xs tabular-nums transition-all md:h-10 md:w-10 ${
                i === cur ? 'scale-110 border-[var(--ra)] bg-[var(--ra)] text-[var(--ra-ink)]' : i <= seen ? 'border-[var(--ra)] bg-white' : 'border-[#1a1a1a]/10 bg-white'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className={`hidden font-sans text-xs leading-tight sm:block ${i === cur ? 'font-bold text-[#1a1a1a]' : 'text-[#1a1a1a]/55'}`}>{s.title}</span>
          </button>
        ))}
      </div>
      <ol className="grid gap-3">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className={`grid grid-cols-1 gap-4 rounded-2xl border border-[#1a1a1a]/10 bg-white p-6 md:grid-cols-[minmax(0,1fr)_auto] ${
              i === cur ? 'motion-safe:animate-fade-up' : 'hidden'
            }`}
          >
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--ra-text)]">
                Step {i + 1} of {steps.length} · {s.who}
              </p>
              <h3 className="mb-2 mt-1 font-serif text-2xl">{s.title}</h3>
              <p className="max-w-[64ch] font-sans text-sm leading-relaxed text-[#1a1a1a]/70">{s.body}</p>
              <p className="mt-3 rounded-lg bg-[var(--rs)] px-3 py-2.5 font-sans text-sm">{s.note}</p>
            </div>
            <dl className="md:text-right">
              <dd className="font-serif text-3xl text-[var(--rp)]">{s.figure}</dd>
              <dt className="font-sans text-xs text-[#1a1a1a]/55">{s.figureLabel}</dt>
            </dl>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => go(cur - 1)} disabled={cur === 0} className="inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] px-5 py-2.5 font-sans text-sm font-bold disabled:opacity-30">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button type="button" onClick={() => go(cur + 1)} className="inline-flex items-center gap-2 rounded-full bg-[var(--ra)] px-5 py-2.5 font-sans text-sm font-bold text-[var(--ra-ink)] transition-transform hover:-translate-y-0.5">
          {cur === last ? (<>Done <Check className="h-4 w-4" /></>) : (<>Next step <ArrowRight className="h-4 w-4" /></>)}
        </button>
      </div>
    </div>
  );
}
