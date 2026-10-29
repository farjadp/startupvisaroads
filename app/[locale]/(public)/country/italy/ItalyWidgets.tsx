'use client';
// ============================================================================
// Component: app/[locale]/(public)/country/italy/ItalyWidgets.tsx
// Page-local games for the Italy route guide. The shared widgets in
// components/route are Finland-shaped (a four-test quiz with Finnish verdicts,
// a means-of-support calculator, a citizenship roadmap); Italy needs a
// founder-cap counter, a choice between the two funding doors and a renewal
// ladder with no citizenship figure on it. Same CSS variables as the shared widgets, so the theme carries.
//
// Every piece of copy here is passed in from, or repeats, the server page —
// and every text a crawler needs is rendered whether or not the game runs.
// ============================================================================
import React, { useState } from 'react';
import { Check } from 'lucide-react';
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

/* ── Founder cap ────────────────────────────────────────────────────────── */

/** Five seats as of right, five more only exceptionally, none beyond ten. */
export function TeamCap({ stopId }: { stopId: string }) {
  const { complete } = useRoute();
  const [n, setN] = useState<number | null>(null);
  const pick = (v: number) => {
    setN(v);
    complete(stopId, 'Team counted');
  };

  let title = 'How many of you will apply?';
  let body = 'Pick your team size. Every seat is a co-founder with a self-employment relationship and a share of the capital.';
  if (n !== null) {
    if (n <= 5) {
      title = n === 1 ? 'One seat, within the cap' : `${n} seats, within the cap`;
      body =
        'Up to five certificates may be issued for each innovative startup. All the team’s applications must be sent at the same time, and €50,000 is for the whole team — for a team, the guidelines call it “purely indicative”.';
    } else if (n <= 10) {
      title = `${n} seats: only exceptionally`;
      body =
        'Above five, the committee may grant more only in exceptional circumstances, depending on the nature of the business. If you are six, you are redesigning the structure — better now than after the files go in.';
    } else {
      title = 'More than ten: not possible';
      body = 'In no case more than ten certificates per startup. Nobody joins as a passive investor, and nobody joins as an employee.';
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        <p className="mb-3 font-sans text-sm font-bold">Founders applying together</p>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 11 }, (_, i) => i + 1).map((v) => (
            <Toggle key={v} pressed={n === v} onClick={() => pick(v)}>
              {v === 11 ? '11+' : v}
            </Toggle>
          ))}
        </div>
        <ol aria-hidden="true" className="mt-6 grid grid-cols-10 gap-1.5">
          {Array.from({ length: 10 }, (_, i) => {
            const seat = i + 1;
            const filled = n !== null && seat <= n;
            const firm = seat <= 5;
            return (
              <li
                key={seat}
                className={`grid aspect-square place-items-center rounded-lg border-2 font-sans text-xs tabular-nums transition-colors ${
                  firm ? 'border-solid' : 'border-dashed'
                } ${filled ? (firm ? 'border-[var(--ra)] bg-[var(--ra)] text-[var(--ra-ink)]' : 'border-[#B4531A] bg-[#FBEBDD] text-[#7a3510]') : 'border-[#1a1a1a]/15 text-[#1a1a1a]/40'}`}
              >
                {seat}
              </li>
            );
          })}
        </ol>
        <p className="mt-2 flex justify-between font-sans text-[11px] text-[#1a1a1a]/55">
          <span>1–5 · the cap</span>
          <span>6–10 · exceptional only</span>
        </p>
      </div>
      <div className="grid content-start gap-2 self-start rounded-2xl border border-[#1a1a1a]/10 bg-white p-6" aria-live="polite">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--ra-text)]">The guidelines say</p>
        <p className="font-serif text-2xl">{title}</p>
        <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]/65">{body}</p>
      </div>
    </div>
  );
}

/* ── Two doors ──────────────────────────────────────────────────────────── */

export interface Door {
  key: string;
  choice: string;
  figure: string;
  body: string;
  fine: string;
}

/** Both doors are always rendered in full; choosing one marks it as yours. */
export function DoorPicker({ stopId, doors }: { stopId: string; doors: Door[] }) {
  const { complete } = useRoute();
  const [pick, setPick] = useState<string | null>(null);
  const choose = (k: string) => {
    setPick(k);
    complete(stopId, 'Door chosen');
  };
  return (
    <div>
      <p className="mb-2 font-sans text-sm font-bold">Which door are you taking?</p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {doors.map((d) => (
          <Toggle key={d.key} pressed={pick === d.key} onClick={() => choose(d.key)}>
            {d.choice}
          </Toggle>
        ))}
      </div>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {doors.map((d) => {
          const on = pick === d.key;
          return (
            <li
              key={d.key}
              className={`rounded-2xl border bg-white p-6 transition-all ${
                on ? 'border-[var(--ra)] ring-[3px] ring-[color-mix(in_srgb,var(--ra)_35%,transparent)]' : pick ? 'border-[#1a1a1a]/10 opacity-60' : 'border-[#1a1a1a]/10'
              }`}
            >
              <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--ra-text)]">
                {d.choice}
                {on && <span className="ml-2 rounded-full bg-[var(--ra)] px-2 py-0.5 text-[10px] text-[var(--ra-ink)]">Your door</span>}
              </p>
              <p className="mt-2 font-serif text-4xl tabular-nums text-[var(--rp)]">{d.figure}</p>
              <p className="mt-3 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">{d.body}</p>
              <p className="mt-3 rounded-lg bg-[var(--rs)] px-3 py-2.5 font-sans text-sm">{d.fine}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Renewal ladder ─────────────────────────────────────────────────────── */

export interface Rung {
  year: number;
  title: string;
  body: string;
}

/** A year slider over the permit's renewals. Completes on reaching the last rung. */
export function RenewalLadder({ stopId, rungs }: { stopId: string; rungs: Rung[] }) {
  const { complete } = useRoute();
  const max = rungs[rungs.length - 1].year;
  const [year, setYear] = useState(0);
  const current = rungs.reduce((acc, r, i) => (year >= r.year ? i : acc), 0);
  const pos = (y: number) => (y / max) * 100;

  return (
    <div className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
      <div aria-hidden="true" className="relative mx-3 mb-10 mt-2 h-1 rounded bg-[#1a1a1a]/10">
        <span className="absolute left-0 top-0 h-1 rounded bg-[var(--ra)] transition-[width] duration-500" style={{ width: `${pos(year)}%` }} />
        {rungs.map((r, i) => (
          <span key={r.year} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${pos(r.year)}%` }}>
            <span className={`block h-4 w-4 rounded-full border-[3px] border-[var(--ra)] transition-colors ${i <= current ? 'bg-[var(--ra)]' : 'bg-white'}`} />
            <span className="absolute left-1/2 top-5 -translate-x-1/2 font-sans text-[11px] tabular-nums text-[#1a1a1a]/55">Y{r.year}</span>
          </span>
        ))}
      </div>
      <label htmlFor={`${stopId}-year`} className="font-sans text-xs text-[#1a1a1a]/55">
        Years in Italy
      </label>
      <input
        id={`${stopId}-year`}
        type="range"
        min={0}
        max={max}
        step={1}
        value={year}
        onChange={(e) => {
          const y = Number(e.target.value);
          setYear(y);
          if (y >= max) complete(stopId, 'Renewals mapped');
        }}
        className="mt-1 w-full accent-[var(--ra)]"
      />
      <ol className="mt-5 grid gap-2.5" aria-live="polite">
        {rungs.map((r, i) => (
          <li
            key={r.year}
            className={`grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 rounded-xl border p-4 transition-colors ${
              i === current ? 'border-[var(--ra)] bg-[var(--rs)]' : 'border-[#1a1a1a]/10'
            }`}
          >
            <span className="font-serif text-3xl tabular-nums text-[var(--rp)]">Y{r.year}</span>
            <span>
              <b className="flex items-center gap-2 font-sans text-sm">
                {r.title}
                {i < current && <Check className="h-4 w-4 text-[var(--ra-text)]" aria-label="passed" />}
              </b>
              <span className="mt-0.5 block font-sans text-sm leading-relaxed text-[#1a1a1a]/65">{r.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
