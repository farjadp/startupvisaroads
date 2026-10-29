'use client';
// ============================================================================
// app/[locale]/(public)/startup-visa-canada/_shared/SuvWidgets.tsx
// The games specific to the Start-up Visa reference pages. Like the shared
// route widgets, each renders all of its copy on the server, so the text is
// in the HTML whether or not the game ever runs.
//
//  - Checklist:     tick every item to complete the stop (documents, vetting).
//  - FairOrFlag:    flip cards — a fair practice or a red flag?
//  - FeeCalculator: IRCC fees and settlement funds for a household, from the
//                   official figures passed in by the page. No market ranges.
// ============================================================================
import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useRoute } from '@/components/route/RouteProgress';

const cad = (n: number) => `$${n.toLocaleString('en-CA')}`;

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

/* ── Checklist ──────────────────────────────────────────────────────────── */

export function Checklist({
  stopId,
  items,
  message,
  progressLabel,
  doneNote,
}: {
  stopId: string;
  items: { title: string; body: string }[];
  message: string;
  progressLabel: string;
  doneNote: string;
}) {
  const { complete } = useRoute();
  const [ticked, setTicked] = useState<Set<number>>(() => new Set());
  const toggle = (i: number) =>
    setTicked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  useEffect(() => {
    if (ticked.size === items.length) complete(stopId, message);
  }, [ticked, items.length, complete, stopId, message]);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <ul className="grid gap-2">
        {items.map((it, i) => {
          const on = ticked.has(i);
          return (
            <li key={it.title}>
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle(i)}
                className={`grid w-full grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-2xl border p-4 text-left transition-colors ${
                  on ? 'border-[var(--ra)] bg-[var(--rs)]' : 'border-[#1a1a1a]/10 bg-white hover:border-[var(--ra)]'
                }`}
              >
                <span className={`mt-0.5 grid h-5 w-5 place-items-center rounded border-[1.5px] ${on ? 'border-[var(--ra)] bg-[var(--ra)] text-[var(--ra-ink)]' : 'border-[#1a1a1a]/40'}`}>
                  {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
                <span>
                  <span className="block font-sans text-sm font-bold">{it.title}</span>
                  <span className="block font-sans text-sm leading-relaxed text-[#1a1a1a]/70">{it.body}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="self-start rounded-2xl border border-[#1a1a1a]/10 bg-white p-6 lg:sticky lg:top-20" aria-live="polite">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--ra-text)]">{progressLabel}</p>
        <div className="my-3 h-3 overflow-hidden rounded-full bg-[#1a1a1a]/10">
          <div className="h-full bg-[var(--ra)] transition-[width] duration-500" style={{ width: `${(ticked.size / items.length) * 100}%` }} />
        </div>
        <p className="font-serif text-2xl tabular-nums">
          {ticked.size} of {items.length}
        </p>
        <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
          {ticked.size === items.length ? doneNote : 'Tick each one you already have, or have checked. Whatever is left is your to-do list.'}
        </p>
      </div>
    </div>
  );
}

/* ── Fair practice or red flag ──────────────────────────────────────────── */

export function FairOrFlag({ stopId, items }: { stopId: string; items: { title: string; content: string; fair: boolean }[] }) {
  const { complete } = useRoute();
  const [guesses, setGuesses] = useState<Record<number, boolean>>({});
  const answered = Object.keys(guesses).length;
  const right = items.filter((it, i) => i in guesses && guesses[i] === it.fair).length;
  const guess = (i: number, v: boolean) => setGuesses((prev) => (i in prev ? prev : { ...prev, [i]: v }));

  useEffect(() => {
    if (answered === items.length) complete(stopId, `You spotted ${right} of ${items.length}`);
  }, [answered, right, items.length, complete, stopId]);

  return (
    <>
      <p className="mb-4 block font-sans text-sm tabular-nums text-[#1a1a1a]/65" aria-live="polite">
        Fair practice or red flag? · {right}/{answered} right so far
      </p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => {
          const flipped = i in guesses;
          return (
            <li key={it.title} className="min-h-[250px] [perspective:900px]">
              <div className={`relative h-full transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
                <div className="absolute inset-0 flex flex-col justify-between gap-3 rounded-2xl border border-[#1a1a1a]/10 bg-white p-4 [backface-visibility:hidden]">
                  <h3 className="font-serif text-xl leading-snug">{it.title}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    <Toggle pressed={false} onClick={() => guess(i, true)}>Fair</Toggle>
                    <Toggle pressed={false} onClick={() => guess(i, false)}>Red flag</Toggle>
                  </div>
                </div>
                <div
                  className={`absolute inset-0 flex flex-col gap-2.5 overflow-auto rounded-2xl border p-4 font-sans text-sm leading-relaxed [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    it.fair ? 'border-[#1a1a1a]/10 bg-[#EEF3EC]' : 'border-[var(--ra)]/30 bg-[var(--rs)]'
                  }`}
                >
                  <span className={`font-sans text-[11px] font-bold uppercase tracking-[0.16em] ${it.fair ? 'text-[#2F5D2A]' : 'text-[var(--ra-text)]'}`}>
                    {it.fair ? 'Fair practice' : 'Red flag'} · {it.title}
                  </span>
                  <p>{it.content}</p>
                  {flipped && <span className="mt-auto text-xs font-bold">{guesses[i] === it.fair ? '✓ You called it' : '✗ Not quite'}</span>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/* ── Fee calculator ─────────────────────────────────────────────────────── */

export interface FeeTable {
  principalProcessing: number;
  rprf: number;
  spouseProcessing: number;
  child: number;
  biometricsPerPerson: number;
  biometricsFamilyMax: number;
  /** Settlement funds by family size 1–7, then per extra person. */
  funds: number[];
  fundsExtra: number;
}

export function FeeCalculator({ stopId, t }: { stopId: string; t: FeeTable }) {
  const { complete } = useRoute();
  const [spouse, setSpouse] = useState(false);
  const [children, setChildren] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched) complete(stopId, 'Household fees worked out');
  }, [touched, complete, stopId]);

  const people = 1 + (spouse ? 1 : 0) + children;
  const rows: { label: string; v: number }[] = [
    { label: 'Your processing fee', v: t.principalProcessing },
    { label: 'Your right of permanent residence fee', v: t.rprf },
    ...(spouse ? [{ label: 'Spouse or partner: processing', v: t.spouseProcessing }, { label: 'Spouse or partner: right of permanent residence fee', v: t.rprf }] : []),
    ...(children ? [{ label: `${children} dependent ${children === 1 ? 'child' : 'children'}`, v: children * t.child }] : []),
    { label: people > 1 ? 'Biometrics, family applying together' : 'Biometrics', v: people > 1 ? t.biometricsFamilyMax : t.biometricsPerPerson },
  ];
  const total = rows.reduce((s, r) => s + r.v, 0);
  const funds = people <= 7 ? t.funds[people - 1] : t.funds[6] + (people - 7) * t.fundsExtra;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="grid content-start gap-5 rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        <div>
          <p className="mb-2 font-sans text-sm font-bold">Is a spouse or partner coming with you?</p>
          <div className="flex gap-1.5">
            <Toggle pressed={!spouse} onClick={() => { setSpouse(false); setTouched(true); }}>No</Toggle>
            <Toggle pressed={spouse} onClick={() => { setSpouse(true); setTouched(true); }}>Yes</Toggle>
          </div>
        </div>
        <div>
          <p className="mb-2 font-sans text-sm font-bold">Dependent children</p>
          <div className="flex flex-wrap gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <Toggle key={n} pressed={children === n} onClick={() => { setChildren(n); setTouched(true); }}>{n}</Toggle>
            ))}
          </div>
        </div>
        <p className="font-sans text-xs leading-relaxed text-[#1a1a1a]/60">
          IRCC&apos;s own figures only. Medical exams, police certificates, translations and travel are not included: they are charged by others and
          vary.
        </p>
      </div>
      <div className="rounded-2xl bg-[var(--rd)] p-6 text-white" aria-live="polite">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--ra-dark)]">IRCC fees for {people} {people === 1 ? 'person' : 'people'}</p>
        <ul className="mt-3 grid gap-1.5 font-sans text-sm text-white/80">
          {rows.map((r) => (
            <li key={r.label} className="flex justify-between gap-4 border-b border-white/10 pb-1.5">
              <span>{r.label}</span>
              <span className="tabular-nums text-white">{cad(r.v)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-serif text-4xl tabular-nums">{cad(total)}</p>
        <p className="font-sans text-xs text-white/65">Government fees, CAD. The right of permanent residence fee is normally paid when the application is approved.</p>
        <div className="mt-5 rounded-xl border border-white/15 bg-white/5 p-4">
          <p className="font-sans text-xs uppercase tracking-[0.14em] text-white/65">Settlement funds you must also hold</p>
          <p className="mt-1 font-serif text-3xl tabular-nums">{cad(funds)}</p>
          <p className="font-sans text-xs text-white/65">Not a fee: your own money, not borrowed, which travels with you.</p>
        </div>
      </div>
    </div>
  );
}
