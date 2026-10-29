'use client';
// ============================================================================
// Page-local games for /country/denmark. The shared FundsCalculator and
// YearsRoadmap in components/route/RouteWidgets.tsx are Finland-shaped:
// Finland sets a monthly amount per region and a two-year multiplier, and its
// citizenship clock runs from arrival. Denmark sets one self-support amount per
// household type, and citizenship needs nine years of residence AND permanent
// residence held for two years — so the passport follows PR, not the calendar.
// Same CSS variables as the shared widgets, so the theme carries over.
// ============================================================================
import React, { useState } from 'react';
import { useRoute } from '@/components/route/RouteProgress';
import Flag from '@/components/route/flags';
import type { PrRoute } from '@/components/route/RouteWidgets';

const dkk = (n: number) => `DKK ${n.toLocaleString('en')}`;

function Switch({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onClick} className="inline-flex items-center gap-2.5 font-sans text-sm">
      <span className={`relative h-[26px] w-11 rounded-full transition-colors ${on ? 'bg-[var(--ra)]' : 'bg-[#1a1a1a]/15'}`}>
        <span className={`absolute left-[3px] top-[3px] h-5 w-5 rounded-full bg-white transition-transform ${on ? 'translate-x-[18px]' : ''}`} />
      </span>
      {on ? 'Yes' : 'No'}
    </button>
  );
}

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

/* ── Self-support calculator ────────────────────────────────────────────── */

export interface SelfSupportRow {
  label: string;
  dkk: number;
  eur: string;
}

/**
 * Picks the SIRI self-support row for the household and adds up the SIRI
 * fees. Rows, in order: single, with spouse, with spouse and child(ren), with
 * child(ren) and no spouse. Fees are per person; the funds are per household.
 */
export function SelfSupportCalculator({
  stopId,
  rows,
  fees,
}: {
  stopId: string;
  rows: [SelfSupportRow, SelfSupportRow, SelfSupportRow, SelfSupportRow];
  fees: { founder: number; family: number };
}) {
  const { complete } = useRoute();
  const [spouse, setSpouse] = useState(false);
  const [kids, setKids] = useState(0);

  const row = spouse ? (kids ? rows[2] : rows[1]) : kids ? rows[3] : rows[0];
  const family = Number(spouse) + kids;
  const lines: [string, number][] = [
    ['Your permit', fees.founder],
    ...(family ? ([[`Family members × ${family}`, fees.family * family]] as [string, number][]) : []),
  ];

  const touch = (fn: () => void) => () => {
    fn();
    complete(stopId, 'Your number is set');
  };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div className="grid content-start gap-5 rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        <div>
          <p className="mb-2 font-sans text-sm font-bold">Spouse or registered partner coming with you?</p>
          <Switch on={spouse} label="Spouse or registered partner coming with you" onClick={touch(() => setSpouse(!spouse))} />
        </div>
        <div>
          <p className="mb-2 font-sans text-sm font-bold">Children under 18 coming with you</p>
          <div className="inline-flex items-center overflow-hidden rounded-full border border-[#1a1a1a]/15">
            <button type="button" aria-label="Fewer children" onClick={touch(() => setKids(Math.max(0, kids - 1)))} className="h-9 w-10 bg-[#F2F0E9] text-lg">−</button>
            <span className="min-w-11 text-center font-sans tabular-nums" aria-live="polite">{kids}</span>
            <button type="button" aria-label="More children" onClick={touch(() => setKids(Math.min(6, kids + 1)))} className="h-9 w-10 bg-[#F2F0E9] text-lg">+</button>
          </div>
        </div>
        <p className="font-sans text-xs leading-relaxed text-[#1a1a1a]/55">
          The self-support amount is set per household type; the SIRI fee is paid per person.
        </p>
      </div>
      <div className="rounded-2xl bg-[var(--rd)] p-6 text-white" aria-live="polite">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#FF7A8C]">Self-support to document · {row.label}</p>
        <p className="mb-1 mt-2 font-serif text-5xl tabular-nums">{dkk(row.dkk)}</p>
        <p className="font-sans text-sm text-white/60">{row.eur} · SIRI&apos;s published amount, 2025 level</p>
        <div className="mt-5 grid gap-1.5 font-sans text-sm text-white/65">
          <p className="text-white/45">SIRI fees, 2026 level</p>
          {lines.map(([l, v]) => (
            <div key={l} className="flex justify-between gap-3 border-t border-white/10 pt-1.5">
              <span>{l}</span>
              <span className="tabular-nums text-white">{dkk(v)}</span>
            </div>
          ))}
          <div className="flex justify-between gap-3 border-t border-white/10 pt-1.5">
            <span>Fees total</span>
            <span className="tabular-nums text-white">{dkk(lines.reduce((a, [, v]) => a + v, 0))}</span>
          </div>
        </div>
        <p className="mt-4 font-sans text-xs leading-relaxed text-white/55">
          The money is not frozen or paid to anyone, but it is there to live on: SIRI can ask for more documentation, and self-support is assessed again at extension.
        </p>
      </div>
    </div>
  );
}

/* ── Road to a Danish passport ──────────────────────────────────────────── */

export interface DenmarkRoadmapCopy {
  prep: { title: string; sub: string };
  arrive: { title: string; sub: string };
  extension: { year: number; title: string; sub: string };
  /** Years of residence for citizenship, and how long PR must already be held. */
  citizenship: { residence: number; prHeld: number };
  phases: {
    first: { title: string; body: string };
    extended: { title: string; body: string };
    resident: { title: string; body: string };
    citizen: { title: string; body: string };
  };
}

const fill = (t: string, v: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_, k: string) => v[k] ?? '');

/**
 * The shared YearsRoadmap with one change: the citizenship mark sits at
 * whichever comes later — the residence requirement, or PR plus the years PR
 * must already be held. The route comes from the PR finder via RouteProvider.
 */
export function CitizenshipRoadmap({ stopId, routes, defaultRoute, copy }: { stopId: string; routes: PrRoute[]; defaultRoute: number; copy: DenmarkRoadmapCopy }) {
  const { complete, prRoute, setPrRoute, flag } = useRoute();
  const [year, setYear] = useState(0);
  const route = prRoute !== null && routes[prRoute] && routes[prRoute].years > 0 ? prRoute : defaultRoute;
  const prY = routes[route].years;
  const citY = Math.max(copy.citizenship.residence, prY + copy.citizenship.prHeld);
  const maxY = citY;
  const pos = (y: number) => 15 + (y / maxY) * 75;
  const more = (n: number) => (n > 0 ? `${n} more year${n > 1 ? 's' : ''}` : 'now');
  const vars = { toPr: more(prY - year), toCitizenship: more(citY - year), route: routes[route].title.toLowerCase() };

  const marks = [
    { id: 'prep', at: 10, y: -1, up: true, big: false, t: copy.prep.title, s: copy.prep.sub },
    { id: 'arrive', at: pos(0), y: 0, up: false, big: false, t: copy.arrive.title, s: copy.arrive.sub },
    { id: 'ext', at: pos(copy.extension.year), y: copy.extension.year, up: true, big: false, t: copy.extension.title, s: copy.extension.sub },
    { id: 'pr', at: pos(prY), y: prY, up: false, big: false, t: 'Permanent residence', s: routes[route].title },
    { id: 'cit', at: pos(citY), y: citY, up: true, big: true, t: 'Citizenship', s: `Year ${citY}` },
  ];

  const phase = year < copy.extension.year ? copy.phases.first : year < prY ? copy.phases.extended : year < citY ? copy.phases.resident : copy.phases.citizen;
  const done = () => complete(stopId, 'Road mapped');

  return (
    <div>
      <div className="mb-5">
        <p className="mb-2 font-sans text-sm font-bold">Your permanent residence route</p>
        <div className="flex flex-wrap gap-1.5">
          {routes.map((r, i) => (
            <Toggle key={r.title} pressed={route === i} onClick={() => { setPrRoute(i); done(); }}>
              {r.title} · {r.years}y
            </Toggle>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        <div className="overflow-x-auto pb-1.5">
          <div className="relative h-[230px] min-w-[700px]" aria-hidden="true">
            <span className="absolute left-0 right-0 top-[112px] h-1 rounded bg-[#1a1a1a]/10" />
            <span className="absolute left-0 top-[112px] h-1 rounded bg-[var(--ra)] transition-[width] duration-500" style={{ width: `${pos(year)}%` }} />
            <span className="absolute left-0 top-[98px] h-8 w-[15%] rounded-lg border border-dashed border-[var(--ra)] bg-[repeating-linear-gradient(135deg,var(--rs)_0_8px,transparent_8px_16px)]" />
            {Array.from({ length: maxY + 1 }, (_, y) => (
              <span key={y} className="absolute top-[126px] -translate-x-1/2 font-sans text-[11px] tabular-nums text-[#1a1a1a]/50" style={{ left: `${pos(y)}%` }}>
                Y{y}
              </span>
            ))}
            {marks.map((m) => (
              <div key={m.id} className="absolute top-0 -ml-[70px] h-[230px] w-[140px] transition-[left] duration-500" style={{ left: `${m.at}%` }}>
                <span
                  className={`absolute left-1/2 rounded-full border-[3px] border-[var(--ra)] transition-colors ${m.big ? '-ml-3 top-[102px] h-6 w-6' : '-ml-2 top-[106px] h-4 w-4'} ${year >= m.y ? 'bg-[var(--ra)]' : 'bg-white'}`}
                />
                <span className={`absolute inset-x-0 text-center font-sans text-xs leading-snug text-[#1a1a1a]/55 ${m.up ? 'bottom-[136px]' : 'top-[146px]'}`}>
                  <b className="block text-sm text-[#1a1a1a]">{m.t}</b>
                  {m.s}
                </span>
              </div>
            ))}
            <span className="absolute top-[103px] z-10 -translate-x-1/2 drop-shadow-md transition-[left] duration-500" style={{ left: `${pos(year)}%` }}>
              <Flag code={flag} uid="roadmap" width={36} />
            </span>
          </div>
        </div>
        <label htmlFor={`${stopId}-year`} className="font-sans text-xs text-[#1a1a1a]/55">Years in Denmark</label>
        <input
          id={`${stopId}-year`}
          type="range"
          min={0}
          max={maxY}
          step={1}
          value={Math.min(year, maxY)}
          onChange={(e) => {
            const y = Number(e.target.value);
            setYear(y);
            if (y >= copy.extension.year) done();
          }}
          className="mt-1 w-full accent-[var(--ra)]"
        />
        <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 gap-y-1" aria-live="polite">
          <span className="row-span-2 font-serif text-5xl tabular-nums text-[var(--rp)]">Y{year}</span>
          <span className="font-sans font-bold">{fill(phase.title, vars)}</span>
          <span className="font-sans text-sm text-[#1a1a1a]/60">{fill(phase.body, vars)}</span>
        </div>
      </div>
    </div>
  );
}
