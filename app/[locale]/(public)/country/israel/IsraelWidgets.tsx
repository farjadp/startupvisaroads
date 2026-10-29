'use client';
// ============================================================================
// Page-local games for /country/israel. None of the shared widgets fit three
// things this route has and the others do not: a nationality bar written into
// Israeli law, a grant whose covered and excluded costs are the whole budgeting
// question, and a two-year permit with a fixed deadline for the B/1 switch.
// The copy comes from the page as props, so it is in the server HTML whether or
// not the game runs. Same CSS variables as the shared widgets.
// ============================================================================
import React, { useEffect, useState } from 'react';
import { useRoute } from '@/components/route/RouteProgress';
import Flag from '@/components/route/flags';

const nis = (n: number) => `NIS ${Math.round(n).toLocaleString('en')}`;

function Toggle({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-left font-sans text-sm transition-colors ${
        pressed ? 'border-[var(--rp)] bg-[var(--rp)] text-white' : 'border-[#1a1a1a]/15 bg-[#F2F0E9] hover:border-[var(--rp)]'
      }`}
    >
      {children}
    </button>
  );
}

/* ── Can I apply with my passport? ──────────────────────────────────────── */

export interface PassportOption {
  label: string;
  verdict: string;
  body: string;
  /** 'closed' paints the verdict amber; 'check' paints it in the accent. */
  tone: 'closed' | 'check';
}

export function PassportCheck({ stopId, options }: { stopId: string; options: PassportOption[] }) {
  const { complete } = useRoute();
  const [pick, setPick] = useState<number | null>(null);
  const chosen = pick === null ? null : options[pick];

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <fieldset className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        <legend className="sr-only">Your citizenship</legend>
        <p className="mb-3 font-sans text-sm font-bold">Which describes your citizenship?</p>
        <div className="grid gap-2">
          {options.map((o, i) => (
            <Toggle
              key={o.label}
              pressed={pick === i}
              onClick={() => {
                setPick(i);
                complete(stopId, 'Passport checked');
              }}
            >
              {o.label}
            </Toggle>
          ))}
        </div>
      </fieldset>
      <div className="rounded-2xl bg-[var(--rd)] p-6 text-white" aria-live="polite">
        {chosen ? (
          <>
            <p className={`font-sans text-xs font-bold uppercase tracking-[0.18em] ${chosen.tone === 'closed' ? 'text-[#FDBA74]' : 'text-[var(--ra-dark)]'}`}>
              {chosen.label}
            </p>
            <p className="mt-2 font-serif text-3xl leading-tight">{chosen.verdict}</p>
            <p className="mt-3 max-w-[56ch] font-sans text-sm leading-relaxed text-white/75">{chosen.body}</p>
          </>
        ) : (
          <>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--ra-dark)]">Your answer</p>
            <p className="mt-2 font-serif text-3xl leading-tight">Pick one to see where you stand.</p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-white/60">This is the first question on this route, before any business plan.</p>
          </>
        )}
      </div>
      {/* Every answer, readable without the game. */}
      <dl className="sr-only">
        {options.map((o) => (
          <div key={o.label}>
            <dt>{o.label}</dt>
            <dd>
              {o.verdict} {o.body}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ── What will Tnufa pay for? ───────────────────────────────────────────── */

export interface TnufaItem {
  label: string;
  covered: boolean;
}

/**
 * Sort each cost into covered or not, then size a budget. The grant is
 * `rate` of an approved budget capped at `cap`, so it tops out at rate × cap.
 */
export function TnufaCheck({ stopId, items, rate, cap }: { stopId: string; items: TnufaItem[]; rate: number; cap: number }) {
  const { complete } = useRoute();
  const [guesses, setGuesses] = useState<Record<number, boolean>>({});
  const [budget, setBudget] = useState(150000);
  const answered = Object.keys(guesses).length;
  const right = items.filter((it, i) => i in guesses && guesses[i] === it.covered).length;
  const grant = rate * Math.min(budget, cap);

  useEffect(() => {
    if (answered === items.length) complete(stopId, `You sorted ${right} of ${items.length}`);
  }, [answered, right, items.length, complete, stopId]);

  const guess = (i: number, v: boolean) => setGuesses((prev) => (i in prev ? prev : { ...prev, [i]: v }));

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        <p className="mb-4 font-sans text-sm tabular-nums text-[#1a1a1a]/60" aria-live="polite">
          Can the Tnufa grant pay for it? · {right}/{answered} right so far
        </p>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {items.map((it, i) => {
            const shown = i in guesses;
            return (
              <li
                key={it.label}
                className={`grid gap-2 rounded-xl border p-3 transition-colors ${
                  !shown ? 'border-[#1a1a1a]/10 bg-[#F2F0E9]' : it.covered ? 'border-[color-mix(in_srgb,var(--ra)_30%,transparent)] bg-[var(--rs)]' : 'border-[#B4531A]/25 bg-[#FBEBDD]'
                }`}
              >
                <span className="font-sans text-sm font-bold">{it.label}</span>
                {shown ? (
                  <span className="font-sans text-xs">
                    <b className={it.covered ? 'text-[var(--ra-text)]' : 'text-[#92400E]'}>{it.covered ? 'Covered' : 'Not covered'}</b>
                    {' · '}
                    {guesses[i] === it.covered ? '✓ You called it' : '✗ Not quite'}
                  </span>
                ) : (
                  <span className="flex flex-wrap gap-1.5">
                    <Toggle pressed={false} onClick={() => guess(i, true)}>Covered</Toggle>
                    <Toggle pressed={false} onClick={() => guess(i, false)}>Not covered</Toggle>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="self-start rounded-2xl bg-[var(--rd)] p-6 text-white" aria-live="polite">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--ra-dark)]">Tnufa grant on your budget</p>
        <p className="mb-1 mt-2 font-serif text-5xl tabular-nums">{nis(grant)}</p>
        <p className="font-sans text-sm text-white/60">
          {Math.round(rate * 100)}% of {nis(Math.min(budget, cap))}
          {budget > cap ? ` (the budget cap)` : ''}
        </p>
        <label htmlFor={`${stopId}-budget`} className="mt-5 block font-sans text-xs text-white/60">
          Approved project budget: <span className="tabular-nums text-white">{nis(budget)}</span>
        </label>
        <input
          id={`${stopId}-budget`}
          type="range"
          min={25000}
          max={400000}
          step={25000}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="mt-1 w-full accent-[var(--ra-dark)]"
        />
        <div className="mt-4 grid gap-1.5 font-sans text-sm text-white/65">
          <div className="flex justify-between gap-3 border-t border-white/10 pt-1.5">
            <span>Grant</span>
            <span className="tabular-nums text-white">{nis(grant)}</span>
          </div>
          <div className="flex justify-between gap-3 border-t border-white/10 pt-1.5">
            <span>Left for you to fund</span>
            <span className="tabular-nums text-white">{nis(budget - grant)}</span>
          </div>
        </div>
        <p className="mt-4 font-sans text-xs leading-relaxed text-white/55">
          On top of this, your own living costs for the whole stay: no salaries, no overheads from Tnufa, and nothing from the landing pad.
        </p>
      </div>
    </div>
  );
}

/* ── The two-year clock ─────────────────────────────────────────────────── */

export interface ClockCopy {
  months: number;
  /** How many months before expiry the B/1 application must be filed. */
  leadMonths: number;
  phases: { build: { title: string; body: string }; file: { title: string; body: string }; end: { title: string; body: string } };
}

export function ConversionClock({ stopId, copy }: { stopId: string; copy: ClockCopy }) {
  const { complete, flag } = useRoute();
  const [month, setMonth] = useState(0);
  const fileBy = copy.months - copy.leadMonths;
  const pos = (m: number) => (m / copy.months) * 100;
  const phase = month < fileBy ? copy.phases.build : month < copy.months ? copy.phases.file : copy.phases.end;
  const left = fileBy - month;

  const marks = [
    { m: 0, t: 'B/2 issued', s: 'Month 0', up: true },
    { m: 12, t: 'Year one', s: 'Month 12', up: false },
    { m: fileBy, t: 'File for B/1', s: `By month ${fileBy}`, up: true },
    { m: copy.months, t: 'B/2 ends', s: `Month ${copy.months}`, up: false },
  ];

  return (
    <div className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
      <div className="overflow-x-auto pb-1.5">
        <div className="relative mx-[60px] h-[190px] min-w-[440px]" aria-hidden="true">
          <span className="absolute left-0 right-0 top-[92px] h-1 rounded bg-[#1a1a1a]/10" />
          <span className="absolute left-0 top-[92px] h-1 rounded bg-[var(--ra)] transition-[width] duration-500" style={{ width: `${pos(month)}%` }} />
          <span
            className="absolute top-[80px] h-7 rounded-lg border border-dashed border-[#B4531A] bg-[repeating-linear-gradient(135deg,#FBEBDD_0_8px,transparent_8px_16px)]"
            style={{ left: `${pos(fileBy)}%`, width: `${pos(copy.months) - pos(fileBy)}%` }}
          />
          {marks.map((k) => (
            <div key={k.t} className="absolute top-0 -ml-[60px] h-[190px] w-[120px]" style={{ left: `${pos(k.m)}%` }}>
              <span className={`absolute left-1/2 top-[86px] -ml-2 h-4 w-4 rounded-full border-[3px] border-[var(--ra)] transition-colors ${month >= k.m ? 'bg-[var(--ra)]' : 'bg-white'}`} />
              <span className={`absolute inset-x-0 text-center font-sans text-xs leading-snug text-[#1a1a1a]/55 ${k.up ? 'bottom-[116px]' : 'top-[116px]'}`}>
                <b className="block text-sm text-[#1a1a1a]">{k.t}</b>
                {k.s}
              </span>
            </div>
          ))}
          <span className="absolute top-[83px] z-10 -translate-x-1/2 drop-shadow-md transition-[left] duration-500" style={{ left: `${pos(month)}%` }}>
            {flag ? <Flag code={flag} uid="clock" width={32} /> : <span className="block h-4 w-6 rounded-sm bg-[var(--ra)]" />}
          </span>
        </div>
      </div>
      <label htmlFor={`${stopId}-month`} className="font-sans text-xs text-[#1a1a1a]/55">
        Months on the B/2 Innovation visa
      </label>
      <input
        id={`${stopId}-month`}
        type="range"
        min={0}
        max={copy.months}
        step={1}
        value={month}
        onChange={(e) => {
          const m = Number(e.target.value);
          setMonth(m);
          if (m >= fileBy) complete(stopId, 'Deadline found');
        }}
        className="mt-1 w-full accent-[var(--ra)]"
      />
      <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 gap-y-1" aria-live="polite">
        <span className="row-span-2 font-serif text-5xl tabular-nums text-[var(--rp)]">M{month}</span>
        <span className="font-sans font-bold">{phase.title}</span>
        <span className="font-sans text-sm text-[#1a1a1a]/60">
          {phase.body.replace('{left}', left > 0 ? `${left} month${left > 1 ? 's' : ''}` : 'no time')}
        </span>
      </div>
    </div>
  );
}
