'use client';
// ============================================================================
// Component: app/[locale]/(public)/europe/netherlands/NetherlandsWidgets.tsx
// Page-local versions of the route games, adapted from
// components/route/RouteWidgets.tsx for the Netherlands guide:
//   - RulesQuiz: the eligibility quiz for any number of rules (the shared
//     GateQuiz's result copy is written for Finland's four tests).
//   - StepTrail: the step walker for any number of steps (the shared one
//     lays out exactly five).
//   - PerkOrCatchNL: perk-or-catch cards whose "catch" side uses Dutch red,
//     so it stays distinct from the orange accent.
//   - TimelineSlider: drag through the six milestones from the first pitch
//     deck to permanent residency.
// Every piece of copy arrives as props from the server page and is rendered
// in full on the server, so the text is in the HTML whether or not JS runs.
// ============================================================================
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useRoute } from '@/components/route/RouteProgress';

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

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const word = (n: number) => WORDS[n] ?? String(n);

/* ── Eligibility quiz ───────────────────────────────────────────────────── */

export function RulesQuiz({ stopId, criteria, children }: { stopId: string; criteria: { title: string; body: string }[]; children?: React.ReactNode }) {
  const { complete } = useRoute();
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const total = criteria.length;
  const answered = Object.keys(answers).length;
  const yes = Object.values(answers).filter(Boolean).length;
  const missing = criteria.filter((_, i) => answers[i] === false).map((c) => c.title);

  useEffect(() => {
    if (answered === total) complete(stopId, 'Rules checked');
  }, [answered, total, complete, stopId]);

  let title = `${answered} of ${total} answered`;
  let body = 'Each "not yet" is a part of your file to fix before you pitch to a facilitator.';
  if (answered === total) {
    if (yes === total) {
      title = 'Strong on paper';
      body = `You meet all ${word(total)} rules as you describe them. What decides it now is the facilitator's interview: you have to defend an idea and a plan you wrote yourself.`;
    } else if (yes >= total - 2) {
      title = 'Close, with gaps';
      body = `Fix before you pitch: ${missing.join(', ')}.`;
    } else {
      title = 'Not ready yet';
      body = `Missing: ${missing.join(', ')}. Applying now mostly burns time and money.`;
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <ol className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        {criteria.map((c, i) => (
          <li key={c.title} className="grid gap-1.5 border-b border-dashed border-[#1a1a1a]/10 py-4 first:pt-0 last:border-0 last:pb-0">
            <h3 className="font-serif text-xl">{c.title}</h3>
            <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]/65">{c.body}</p>
            <div className="mt-1 flex gap-1.5">
              <Toggle pressed={answers[i] === true} onClick={() => setAnswers((p) => ({ ...p, [i]: true }))}>We have this</Toggle>
              <Toggle pressed={answers[i] === false} onClick={() => setAnswers((p) => ({ ...p, [i]: false }))}>Not yet</Toggle>
            </div>
          </li>
        ))}
      </ol>
      <div className="grid content-start gap-4 self-start rounded-2xl border border-[#1a1a1a]/10 bg-white p-6 lg:sticky lg:top-28">
        <div aria-live="polite">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--ra-text)]">Your readiness</p>
          <div className="my-3 h-3 overflow-hidden rounded-full bg-[#1a1a1a]/10">
            <div className="h-full bg-gradient-to-r from-[#AE1C28] to-[var(--ra)] transition-[width] duration-500" style={{ width: `${(yes / total) * 100}%` }} />
          </div>
          <p className="font-serif text-2xl">{title}</p>
          <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#1a1a1a]/65">{body}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Step walker ────────────────────────────────────────────────────────── */

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
  // The connecting line runs between the centres of the first and last columns.
  const inset = 50 / steps.length;
  const go = (i: number) => {
    const n = Math.max(0, Math.min(last, i));
    setCur(n);
    setSeen((s) => Math.max(s, n));
    if (n === last) complete(stopId, `All ${word(steps.length)} steps walked`);
  };
  return (
    <div>
      <div aria-hidden="true" className="relative mb-5 grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        <span className="absolute top-[22px] h-0.5 bg-[#1a1a1a]/10" style={{ left: `${inset}%`, right: `${inset}%` }} />
        <span className="absolute top-[22px] h-0.5 bg-[var(--ra)] transition-[width] duration-500" style={{ left: `${inset}%`, width: `${(cur / last) * (100 - 2 * inset)}%` }} />
        {steps.map((s, i) => (
          <button key={s.title} type="button" tabIndex={-1} onClick={() => go(i)} className="relative grid justify-items-center gap-2 px-1 text-center">
            <span
              className={`grid h-11 w-11 place-items-center rounded-full border-2 font-sans text-sm tabular-nums transition-all ${
                i === cur ? 'scale-110 border-[var(--ra)] bg-[var(--ra)] text-[var(--ra-ink)]' : i <= seen ? 'border-[var(--ra)] bg-white' : 'border-[#1a1a1a]/10 bg-white'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className={`font-sans text-[11px] leading-tight md:text-xs ${i === cur ? 'font-bold text-[#1a1a1a]' : 'text-[#1a1a1a]/55'}`}>{s.title}</span>
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

/* ── Perk or catch ──────────────────────────────────────────────────────── */

export function PerkOrCatchNL({ stopId, items }: { stopId: string; items: { title: string; content: string; positive: boolean }[] }) {
  const { complete } = useRoute();
  const [guesses, setGuesses] = useState<Record<number, boolean>>({});
  const answered = Object.keys(guesses).length;
  const right = items.filter((it, i) => i in guesses && guesses[i] === it.positive).length;

  const guess = (i: number, v: boolean) => setGuesses((prev) => (i in prev ? prev : { ...prev, [i]: v }));

  useEffect(() => {
    if (answered === items.length) complete(stopId, `You spotted ${right} of ${items.length}`);
  }, [answered, right, items.length, complete, stopId]);

  return (
    <>
      <p className="mb-4 font-sans text-sm tabular-nums text-[#1a1a1a]/60" aria-live="polite">
        Guess each card · {right}/{answered} right so far
      </p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => {
          const flipped = i in guesses;
          return (
            <li key={it.title} className="min-h-[236px] [perspective:900px]">
              <div className={`relative h-full transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
                <div className="absolute inset-0 flex flex-col justify-between gap-3 rounded-2xl border border-[#1a1a1a]/10 bg-white p-4 [backface-visibility:hidden]">
                  <h3 className="font-serif text-xl">{it.title}</h3>
                  <div>
                    <p className="mb-1.5 font-sans text-xs text-[#1a1a1a]/55">Perk or catch?</p>
                    <div className="flex gap-1.5">
                      <Toggle pressed={false} onClick={() => guess(i, true)}>Perk</Toggle>
                      <Toggle pressed={false} onClick={() => guess(i, false)}>Catch</Toggle>
                    </div>
                  </div>
                </div>
                <div
                  className={`absolute inset-0 flex flex-col gap-2.5 overflow-auto rounded-2xl border p-4 font-sans text-sm leading-relaxed [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    it.positive ? 'border-[color-mix(in_srgb,var(--ra)_30%,transparent)] bg-[var(--rs)]' : 'border-[#AE1C28]/25 bg-[#FBE7E9]'
                  }`}
                >
                  <span className={`font-sans text-[11px] font-bold uppercase tracking-[0.16em] ${it.positive ? 'text-[var(--ra-text)]' : 'text-[#AE1C28]'}`}>
                    {it.positive ? 'Perk' : 'Catch'} · {it.title}
                  </span>
                  <p>{it.content}</p>
                  {flipped && <span className="mt-auto text-xs font-bold">{guesses[i] === it.positive ? '✓ You called it' : '✗ Not quite'}</span>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/* ── Timeline slider ────────────────────────────────────────────────────── */

export interface Milestone {
  when: string;
  title: string;
  body: string;
}

/** Drag from the first pitch deck to the endgame. Completes when the reader reaches the last milestone. */
export function TimelineSlider({ stopId, milestones }: { stopId: string; milestones: Milestone[] }) {
  const { complete } = useRoute();
  const [at, setAt] = useState(0);
  const last = milestones.length - 1;
  const m = milestones[at];
  const set = (i: number) => {
    setAt(i);
    if (i === last) complete(stopId, 'Road mapped');
  };
  return (
    <div className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
      <ol className="mb-4 grid gap-2" style={{ gridTemplateColumns: `repeat(${milestones.length}, minmax(0, 1fr))` }}>
        {milestones.map((x, i) => (
          <li key={x.title}>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => set(i)}
              className={`block w-full border-t-4 pt-2 text-left font-sans text-[11px] leading-tight transition-colors md:text-xs ${
                i <= at ? 'border-[var(--ra)] text-[#1a1a1a]' : 'border-[#1a1a1a]/10 text-[#1a1a1a]/50'
              }`}
            >
              <b className="block tabular-nums">{x.when}</b>
              <span className="hidden sm:inline">{x.title}</span>
            </button>
          </li>
        ))}
      </ol>
      <label htmlFor={`${stopId}-range`} className="font-sans text-xs text-[#1a1a1a]/55">Drag through the timeline</label>
      <input
        id={`${stopId}-range`}
        type="range"
        min={0}
        max={last}
        step={1}
        value={at}
        aria-valuetext={`${m.when}: ${m.title}`}
        onChange={(e) => set(Number(e.target.value))}
        className="mt-1 w-full accent-[var(--ra)]"
      />
      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-[10rem_minmax(0,1fr)]" aria-live="polite">
        <span className="font-serif text-3xl leading-tight text-[var(--rp)] sm:row-span-2">{m.when}</span>
        <span className="font-sans font-bold">{m.title}</span>
        <span className="max-w-[64ch] font-sans text-sm leading-relaxed text-[#1a1a1a]/65">{m.body}</span>
      </div>
      {/* The full timeline, for readers without JavaScript and for crawlers. */}
      <ol className="sr-only">
        {milestones.map((x) => (
          <li key={x.title}>
            {x.when}, {x.title}: {x.body}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── Read-to-the-end tracker ────────────────────────────────────────────── */

/**
 * Completes a reading stop once its last line has been on screen for a moment.
 * RouteStop's own completeOn="view" waits for half the section to be visible,
 * which a section taller than two screens (these three, on a phone) never is.
 */
export function SeenTracker({ stopId, message }: { stopId: string; message: string }) {
  const { complete } = useRoute();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([e]) => {
      clearTimeout(timer);
      if (e.isIntersecting) timer = setTimeout(() => complete(stopId, message), 800);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [stopId, message, complete]);
  return <div ref={ref} aria-hidden="true" className="h-px" />;
}
