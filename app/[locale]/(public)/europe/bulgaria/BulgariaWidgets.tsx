'use client';
// ============================================================================
// Page-local games for /en/europe/bulgaria.
//  - PointsCounter: the six criteria of Article 7 of the Ordinance and their
//    published maximums (3, 3, 1, 1, 1, 5 = 14, pass at 8). The reader scores
//    their own file; nothing is invented, the arithmetic is the Ordinance's.
//  - StepTrail: the shared StepWalker lays its markers on a fixed five-column
//    grid; Bulgaria's route has seven steps, so this copy uses seven columns.
// Same CSS variables as components/route/RouteWidgets.tsx, so the theme set
// on RouteProvider carries over. All copy arrives as props and is rendered on
// the server, so the text is in the HTML whether or not the game runs.
// ============================================================================
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useRoute } from '@/components/route/RouteProgress';

function Toggle({ pressed, onClick, children, label }: { pressed: boolean; onClick: () => void; children: React.ReactNode; label?: string }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      onClick={onClick}
      className={`min-w-10 rounded-full border px-3.5 py-1.5 font-sans text-sm tabular-nums transition-colors ${
        pressed ? 'border-[var(--rp)] bg-[var(--rp)] text-white' : 'border-[#1a1a1a]/15 bg-[#F2F0E9] hover:border-[var(--rp)]'
      }`}
    >
      {children}
    </button>
  );
}

/* ── Points counter ─────────────────────────────────────────────────────── */

export interface Criterion {
  title: string;
  max: number;
  body: string;
  /** True for the one criterion that is also a mandatory attachment. */
  mandatory?: boolean;
}

export function PointsCounter({ stopId, criteria, pass, total }: { stopId: string; criteria: Criterion[]; pass: number; total: number }) {
  const { complete } = useRoute();
  const [score, setScore] = useState<Record<number, number>>({});
  const answered = Object.keys(score).length;
  const sum = Object.values(score).reduce((a, b) => a + b, 0);
  const fundsZero = criteria.some((c, i) => c.mandatory && score[i] === 0);

  const set = (i: number, v: number) => {
    const next = { ...score, [i]: v };
    setScore(next);
    if (Object.keys(next).length === criteria.length) complete(stopId, 'Points counted');
  };

  let title = `${answered} of ${criteria.length} scored`;
  let body = 'Give each criterion the points you honestly think your file would earn today.';
  if (answered === criteria.length) {
    if (fundsZero) {
      title = 'Incomplete file';
      body = 'Proof of funds is a mandatory attachment as well as a criterion. Without it the file is incomplete, whatever the other points.';
    } else if (sum >= pass) {
      title = `${sum} of ${total}: above the line`;
      body = `On your own estimate you clear the ${pass}-point pass mark. The expert council does the real scoring, so leave room for it to mark you lower than you would.`;
    } else {
      title = `${sum} of ${total}: below the line`;
      body = `You need ${pass - sum} more. The business plan (up to 5) and the financial forecast (up to 3) are the points most in your own hands.`;
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <ol className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        {criteria.map((c, i) => (
          <li key={c.title} className="grid gap-1.5 border-b border-dashed border-[#1a1a1a]/10 py-4 first:pt-0 last:border-0 last:pb-0">
            <h3 className="font-serif text-xl">
              {c.title} <span className="font-sans text-sm text-[#1a1a1a]/55">· up to {c.max}</span>
            </h3>
            <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]/65">{c.body}</p>
            <div className="mt-1 flex flex-wrap gap-1.5" role="group" aria-label={`Points for ${c.title}`}>
              {Array.from({ length: c.max + 1 }, (_, v) => (
                <Toggle key={v} pressed={score[i] === v} onClick={() => set(i, v)} label={`${v} of ${c.max} points`}>
                  {v}
                </Toggle>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div className="grid content-start gap-4 self-start rounded-2xl bg-[var(--rd)] p-6 text-white lg:sticky lg:top-20" aria-live="polite">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--ra-dark)]">Your estimate</p>
        <p className="font-serif text-6xl tabular-nums">
          {sum}
          <span className="text-2xl text-white/50"> / {total}</span>
        </p>
        <div className="relative h-3 overflow-hidden rounded-full bg-white/15">
          <div className="h-full bg-[var(--ra)] transition-[width] duration-500" style={{ width: `${(sum / total) * 100}%` }} />
          <span className="absolute top-0 h-full w-0.5 bg-white" style={{ left: `${(pass / total) * 100}%` }} aria-hidden="true" />
        </div>
        <p className="font-sans text-xs text-white/60">Pass mark: {pass} points (the white line).</p>
        <div>
          <p className="font-serif text-2xl">{title}</p>
          <p className="mt-1.5 font-sans text-sm leading-relaxed text-white/70">{body}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Step trail ─────────────────────────────────────────────────────────── */

export interface TrailStep {
  title: string;
  who: string;
  body: string;
  note: string;
  figure: string;
  figureLabel: string;
}

export function StepTrail({ stopId, steps }: { stopId: string; steps: TrailStep[] }) {
  const { complete } = useRoute();
  const [cur, setCur] = useState(0);
  const [seen, setSeen] = useState(0);
  const last = steps.length - 1;
  const go = (i: number) => {
    const n = Math.max(0, Math.min(last, i));
    setCur(n);
    setSeen((s) => Math.max(s, n));
    if (n === last) complete(stopId, `All ${steps.length} steps walked`);
  };
  return (
    <div>
      <div aria-hidden="true" className="relative mb-5 grid grid-cols-7">
        <span className="absolute left-[7%] right-[7%] top-[18px] h-0.5 bg-[#1a1a1a]/10 md:top-[22px]" />
        <span className="absolute left-[7%] top-[18px] h-0.5 bg-[var(--ra)] transition-[width] duration-500 md:top-[22px]" style={{ width: `${(cur / last) * 86}%` }} />
        {steps.map((s, i) => (
          <button key={s.title} type="button" tabIndex={-1} onClick={() => go(i)} className="relative grid justify-items-center gap-2 px-0.5 text-center">
            <span
              className={`grid h-9 w-9 place-items-center rounded-full border-2 font-sans text-xs tabular-nums transition-all md:h-11 md:w-11 md:text-sm ${
                i === cur ? 'scale-110 border-[var(--ra)] bg-[var(--ra)] text-[var(--ra-ink)]' : i <= seen ? 'border-[var(--ra)] bg-white' : 'border-[#1a1a1a]/10 bg-white'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className={`hidden font-sans text-xs leading-tight md:block ${i === cur ? 'font-bold text-[#1a1a1a]' : 'text-[#1a1a1a]/55'}`}>{s.title}</span>
          </button>
        ))}
      </div>
      <ol className="grid gap-3">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className={`grid grid-cols-1 gap-4 rounded-2xl border border-[#1a1a1a]/10 bg-white p-6 md:grid-cols-[minmax(0,1fr)_auto] ${i === cur ? 'motion-safe:animate-fade-up' : 'hidden'}`}
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
