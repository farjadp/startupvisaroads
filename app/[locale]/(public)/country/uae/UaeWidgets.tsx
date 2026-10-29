'use client';
// ============================================================================
// Page-local games for /country/uae. The shared GateQuiz asks the reader to
// meet every test at once, which is how a startup panel works. The UAE has no
// panel: each residency tier has its own door, and any one door is enough. So
// the eligibility game here is a tier finder — answer yes or no to each door
// and see which tiers open — and the city game matches a sector to Dubai or
// Abu Dhabi. Same CSS variables as the shared widgets, so the theme carries.
// ============================================================================
import React, { useEffect, useState } from 'react';
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

/* ── Tier finder ────────────────────────────────────────────────────────── */

export interface TierDoor {
  key: string;
  /** The tier this door opens, e.g. "Golden Visa · Investor". */
  tier: string;
  question: string;
  detail: string;
}

/**
 * One yes/no question per door. Doors are alternatives: a single "yes" is
 * enough for that tier. The verdict lists every tier the reader opened.
 */
export function TierFinder({ stopId, doors, noneNote }: { stopId: string; doors: TierDoor[]; noneNote: string }) {
  const { complete } = useRoute();
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const answered = Object.keys(answers).length;
  const open = Array.from(new Set(doors.filter((d) => answers[d.key]).map((d) => d.tier)));

  useEffect(() => {
    if (answered === doors.length) complete(stopId, 'Tier found');
  }, [answered, doors.length, complete, stopId]);

  let title = `${answered} of ${doors.length} answered`;
  let body = 'Any single "yes" is enough for that tier. You do not need them all.';
  if (open.length && answered < doors.length) {
    title = `${open.length} tier${open.length > 1 ? 's' : ''} open so far`;
    body = 'Keep going: another door may suit you better.';
  }
  if (answered === doors.length) {
    if (open.length) {
      title = open.length > 1 ? `${open.length} tiers open to you` : 'One tier open to you';
      body = 'Pick the one that matches the asset you can document most cleanly. The company and the bank account behind it come next.';
    } else {
      title = 'No tier fits yet';
      body = noneNote;
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <ol className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        {doors.map((d) => (
          <li key={d.key} className="grid gap-1.5 border-b border-dashed border-[#1a1a1a]/10 py-4 first:pt-0 last:border-0 last:pb-0">
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ra-text)]">{d.tier}</p>
            <h3 className="font-serif text-xl leading-snug">{d.question}</h3>
            <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]/65">{d.detail}</p>
            <div className="mt-1 flex gap-1.5">
              <Toggle pressed={answers[d.key] === true} onClick={() => setAnswers((p) => ({ ...p, [d.key]: true }))}>Yes</Toggle>
              <Toggle pressed={answers[d.key] === false} onClick={() => setAnswers((p) => ({ ...p, [d.key]: false }))}>No</Toggle>
            </div>
          </li>
        ))}
      </ol>
      <div className="grid content-start gap-4 self-start rounded-2xl border border-[#1a1a1a]/10 bg-white p-6 lg:sticky lg:top-20">
        <div aria-live="polite">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--ra-text)]">Your tiers</p>
          <div className="my-3 h-3 overflow-hidden rounded-full bg-[#1a1a1a]/10">
            <div className="h-full bg-[var(--ra)] transition-[width] duration-500" style={{ width: `${(answered / doors.length) * 100}%` }} />
          </div>
          <p className="font-serif text-2xl">{title}</p>
          <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#1a1a1a]/65">{body}</p>
          {open.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {open.map((t) => (
                <li key={t} className="rounded-full border border-[var(--ra)] bg-[var(--rs)] px-3 py-1 font-sans text-xs font-bold">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── City picker ────────────────────────────────────────────────────────── */

export interface Arena {
  city: string;
  role: string;
  body: string;
  zones: string[];
  sectors: string[];
}

/** Tap your sector; the city built for it lights up. */
export function ArenaPicker({ stopId, arenas }: { stopId: string; arenas: Arena[] }) {
  const { complete } = useRoute();
  const [sector, setSector] = useState<string | null>(null);
  const match = sector ? arenas.findIndex((a) => a.sectors.includes(sector)) : -1;

  const pick = (s: string) => {
    setSector(s);
    complete(stopId, 'City matched');
  };

  return (
    <div>
      <p className="mb-2 font-sans text-sm font-bold">What does your business do?</p>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {arenas.flatMap((a) => a.sectors).map((s) => (
          <Toggle key={s} pressed={sector === s} onClick={() => pick(s)}>
            {s}
          </Toggle>
        ))}
      </div>
      <p className="mb-4 min-h-[1.5rem] font-sans text-sm text-[#1a1a1a]/65" aria-live="polite">
        {match >= 0 ? (
          <>
            <b className="text-[#1a1a1a]">{arenas[match].city}</b> is the city optimised for {sector && (sector === sector.toUpperCase() ? sector : sector.toLowerCase())}.
          </>
        ) : (
          'Pick a sector to see which city is built for it.'
        )}
      </p>
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {arenas.map((a, i) => (
          <li
            key={a.city}
            className={`rounded-2xl border p-6 transition-colors md:p-8 ${
              match === i ? 'border-[var(--ra)] bg-[var(--rs)]' : match >= 0 ? 'border-[#1a1a1a]/10 bg-white opacity-60' : 'border-[#1a1a1a]/10 bg-white'
            }`}
          >
            <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--ra-text)]">{a.role}</p>
            <h3 className="mb-3 mt-1 font-serif text-3xl">{a.city}</h3>
            <p className="max-w-[48ch] font-sans text-sm leading-relaxed text-[#1a1a1a]/70">{a.body}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${a.city} free zones and programmes`}>
              {a.zones.map((z) => (
                <li key={z} className="rounded-md bg-[#1a1a1a] px-3 py-1 font-sans text-xs font-bold uppercase text-white">
                  {z}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
