'use client';
// ============================================================================
// Page-local games for /country/canada. The shared widgets in
// components/route/RouteWidgets.tsx are built for a startup permit with a PR
// clock and a citizenship clock. Canada's page has neither: the Start-up Visa
// is paused, and the open routes are work permits whose road to permanent
// residence depends on which door you take. So this page gets two small
// choosers instead: one that matches a sector to a headquarters city, and one
// that sends a founder to the right door. Every outcome is also stated in the
// server-rendered table and copy on the page, so nothing here is hidden from
// a crawler. Same CSS variables as the shared widgets, so the theme carries.
// ============================================================================
import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from '@/routing';
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

/* ── Headquarters picker ────────────────────────────────────────────────── */

export interface HqCity {
  city: string;
  /** The sector the page pairs with this city. */
  sector: string;
  body: string;
}

/** Pick what you build; the city the page pairs with that sector lights up. */
export function HqPicker({ stopId, cities }: { stopId: string; cities: HqCity[] }) {
  const { complete } = useRoute();
  const [pick, setPick] = useState<number | null>(null);

  const choose = (i: number) => {
    setPick(i);
    complete(stopId, 'HQ chosen');
  };

  return (
    <div>
      <p className="mb-2 font-sans text-sm font-bold">What does your company build?</p>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {cities.map((c, i) => (
          <Toggle key={c.sector} pressed={pick === i} onClick={() => choose(i)}>
            {c.sector}
          </Toggle>
        ))}
      </div>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-3" aria-live="polite">
        {cities.map((c, i) => (
          <li
            key={c.city}
            className={`rounded-2xl border bg-white p-6 transition-all ${
              pick === i ? 'border-[var(--ra)] ring-[3px] ring-[color-mix(in_srgb,var(--ra)_30%,transparent)]' : pick === null ? 'border-[#1a1a1a]/10' : 'border-[#1a1a1a]/10 opacity-60'
            }`}
          >
            <h3 className="font-serif text-2xl">
              {c.city}
              {pick === i && (
                <span className="ml-2 inline-block rounded-full bg-[var(--ra)] px-2 py-1 align-middle font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--ra-ink)]">
                  Your match
                </span>
              )}
            </h3>
            <span className="mb-3 mt-2 inline-block rounded bg-[#1a1a1a] px-2 py-1 font-sans text-xs font-bold uppercase tracking-[0.1em] text-white">{c.sector}</span>
            <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]/70">{c.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Which door? ────────────────────────────────────────────────────────── */

export interface Door {
  key: 'suv' | 'c11' | 'ict' | 'pnp';
  title: string;
  body: string;
  link: { label: string; href: string };
}

type Answer = boolean | null;

/**
 * Three yes/no questions, asked one after another, that land on one of four
 * doors. The doors' copy comes from the page, so the outcome and the table
 * below it always say the same thing.
 */
export function DoorFinder({ stopId, doors }: { stopId: string; doors: Record<Door['key'], Door> }) {
  const { complete } = useRoute();
  const [filed, setFiled] = useState<Answer>(null);
  const [stay, setStay] = useState<Answer>(null);
  const [branch, setBranch] = useState<Answer>(null);

  const touch = (fn: () => void) => () => {
    fn();
    complete(stopId, 'Your door is found');
  };

  const door: Door | null =
    filed === true ? doors.suv : filed === false && stay === false ? doors.c11 : filed === false && stay === true && branch === true ? doors.ict : filed === false && stay === true && branch === false ? doors.pnp : null;

  const questions: { q: string; value: Answer; set: (v: boolean) => void; show: boolean }[] = [
    {
      q: 'Did you file a Start-up Visa application before the pause?',
      value: filed,
      set: (v) => {
        setFiled(v);
        setStay(null);
        setBranch(null);
      },
      show: true,
    },
    {
      q: 'Do you want to settle in Canada permanently?',
      value: stay,
      set: (v) => {
        setStay(v);
        setBranch(null);
      },
      show: filed === false,
    },
    {
      q: 'Do you run a company outside Canada that can open a Canadian branch and transfer you as an executive?',
      value: branch,
      set: setBranch,
      show: filed === false && stay === true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <ol className="grid content-start gap-5 rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        {questions
          .filter((q) => q.show)
          .map((q, i) => (
            <li key={q.q} className="motion-safe:animate-fade-up">
              <p className="mb-2 font-sans text-sm font-bold">
                <span className="mr-2 tabular-nums text-[var(--ra-text)]">{i + 1}.</span>
                {q.q}
              </p>
              <div className="flex gap-1.5">
                <Toggle pressed={q.value === true} onClick={touch(() => q.set(true))}>Yes</Toggle>
                <Toggle pressed={q.value === false} onClick={touch(() => q.set(false))}>No</Toggle>
              </div>
            </li>
          ))}
      </ol>
      <div className="rounded-2xl bg-[var(--rd)] p-6 text-white" aria-live="polite">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--ra-dark)]">Your door</p>
        {door ? (
          <>
            <p className="mb-2 mt-2 flex items-start gap-2 font-serif text-3xl leading-tight">
              <Check className="mt-1.5 h-6 w-6 shrink-0 text-[var(--ra-dark)]" strokeWidth={3} />
              {door.title}
            </p>
            <p className="font-sans text-sm leading-relaxed text-white/75">{door.body}</p>
            <Link href={door.link.href} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--ra)] px-5 py-2.5 font-sans text-sm font-bold text-[var(--ra-ink)] transition-transform hover:-translate-y-0.5">
              {door.link.label} <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        ) : (
          <p className="mt-2 font-sans text-sm leading-relaxed text-white/65">Answer the questions on the left. Each answer narrows the four doors to one.</p>
        )}
      </div>
    </div>
  );
}
