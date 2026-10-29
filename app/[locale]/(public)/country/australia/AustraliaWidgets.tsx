'use client';
// ============================================================================
// Page-local game for /country/australia. The shared widgets have no
// "where do the invitations actually go" piece, and that is the one decision
// this route turns on: the standard advice says chase a state nomination
// (Priority 2), and the Department's published rounds say the direct Tier 1
// lane (Priority 3) is where the invitations are. The reader guesses first,
// then sees both quarters. Same CSS variables as the shared widgets.
//
// Every number is rendered on the server and is in the HTML before the guess;
// the guess only reveals it visually.
// ============================================================================
import React, { useState } from 'react';
import { useRoute } from '@/components/route/RouteProgress';

export interface Lane {
  key: string;
  label: string;
  /** What the lane is, where the page states it. */
  sub?: string;
}

export interface LaneRound {
  period: string;
  /** Per lane: the published figure as text, and the value the bar is drawn at. */
  values: Record<string, { shown: string; n: number }>;
}

export function LaneGuess({
  stopId,
  prompt,
  lanes,
  choices,
  answer,
  rounds,
  rightNote,
  wrongNote,
  scaleNote,
}: {
  stopId: string;
  prompt: string;
  lanes: Lane[];
  /** Lane keys the reader can pick between. */
  choices: string[];
  answer: string;
  rounds: LaneRound[];
  rightNote: string;
  wrongNote: string;
  scaleNote: string;
}) {
  const { complete } = useRoute();
  const [pick, setPick] = useState<string | null>(null);
  const revealed = pick !== null;
  const max = Math.max(...rounds.flatMap((r) => Object.values(r.values).map((v) => v.n)), 1);
  const byKey = Object.fromEntries(lanes.map((l) => [l.key, l]));

  const choose = (key: string) => {
    if (revealed) return;
    setPick(key);
    complete(stopId, key === answer ? 'You called the lane' : 'Lane revealed');
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.3fr)]">
      <div className="grid content-start gap-4 rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        <p className="font-sans text-sm font-bold">{prompt}</p>
        <div className="grid gap-2">
          {choices.map((key) => {
            const l = byKey[key];
            const chosen = pick === key;
            const right = revealed && key === answer;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={chosen}
                disabled={revealed}
                onClick={() => choose(key)}
                className={`grid gap-0.5 rounded-xl border px-4 py-3 text-left font-sans transition-colors ${
                  right
                    ? 'border-[var(--ra)] bg-[var(--rs)]'
                    : chosen
                      ? 'border-[#B4531A] bg-[#FBEBDD]'
                      : 'border-[#1a1a1a]/15 bg-[#F2F0E9] enabled:hover:border-[var(--rp)]'
                }`}
              >
                <span className="text-sm font-bold">{l.label}</span>
                {l.sub && <span className="text-xs text-[#1a1a1a]/60">{l.sub}</span>}
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="min-h-[3rem] font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
          {revealed ? (
            <>
              <b className="text-[#1a1a1a]">{pick === answer ? '✓ You called it. ' : '✗ Not quite. '}</b>
              {pick === answer ? rightNote : wrongNote}
            </>
          ) : (
            'Pick one to see the published breakdown.'
          )}
        </p>
      </div>

      <div className="grid content-start gap-5 rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        {rounds.map((r) => (
          <figure key={r.period} className="grid gap-2">
            <figcaption className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-[var(--ra-text)]">Invitations by priority group · {r.period}</figcaption>
            <ul className="grid gap-1.5">
              {lanes.map((l) => {
                const v = r.values[l.key];
                if (!v) return null;
                return (
                  <li key={l.key} className="grid grid-cols-[6.5rem_minmax(0,1fr)_3rem] items-center gap-3 font-sans text-sm">
                    <span className="text-[#1a1a1a]/70">{l.label}</span>
                    <span aria-hidden="true" className="block h-2.5 overflow-hidden rounded-full bg-[#1a1a1a]/10">
                      <span
                        className={`block h-full rounded-full transition-[width] duration-700 ${l.key === answer ? 'bg-[var(--ra)]' : 'bg-[#1a1a1a]/35'}`}
                        style={{ width: revealed ? `${Math.max(2, (v.n / max) * 100)}%` : '0%' }}
                      />
                    </span>
                    <span className={`text-right tabular-nums transition-opacity duration-500 ${revealed ? 'opacity-100' : 'opacity-0'} ${l.key === answer ? 'font-bold' : ''}`}>
                      {v.shown}
                    </span>
                  </li>
                );
              })}
            </ul>
          </figure>
        ))}
        <p className="font-sans text-xs text-[#1a1a1a]/55">{scaleNote}</p>
      </div>
    </div>
  );
}
