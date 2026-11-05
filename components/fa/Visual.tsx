// ============================================================================
// Component: components/fa/Visual.tsx
// Charts drawn in code from a guide's own figures — no image files, nothing
// borrowed. Three forms, each for one job:
//   - columns: one series over time (e.g. invitations per draw), with a
//     second fact printed under each column instead of on a second axis.
//   - bars:    horizontal bars. Either small multiples (each group on its
//     own scale, e.g. net worth / investment for two streams) or one shared
//     scale across groups (e.g. how long each stage takes, points per part).
//   - phases:  a two- or three-phase route, step chips in order.
//
// Plain HTML and CSS, so RTL lays out by itself and nothing ships to the
// client. Series colours were run through the dataviz validator against the
// paper surface (light): blue #3A6EA5 and Canada red #D80027 pass lightness,
// chroma, CVD (ΔE 19.4 protan) and contrast. Plain ink failed the chroma
// check, so it is never a series colour here. Values are always printed as
// text beside the mark, so identity and size are never colour-alone; a
// legend appears for two series. Hover shows a tooltip with the full note.
// ============================================================================
import React from 'react';
import type { FaVisual } from '@/lib/fa/content';

const SERIES = ['#3A6EA5', '#D80027'] as const;

function Frame({ caption, note, legend, children }: { caption?: string; note?: string; legend?: string[]; children: React.ReactNode }) {
  return (
    <figure className="my-7 max-w-[68ch]">
      {caption && (
        <figcaption className="mb-3 flex items-center gap-3 text-sm font-bold text-[#1a1a1a]">
          <span className="h-2 w-2 bg-[var(--ra,#CCFF00)] border border-[#1a1a1a]" aria-hidden />
          {caption}
        </figcaption>
      )}
      <div className="rounded-2xl border border-[#1a1a1a]/12 bg-white p-5 md:p-6">
        {legend && legend.length > 1 && (
          <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#1a1a1a]/70">
            {legend.map((l, i) => (
              <li key={i} className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: SERIES[i % SERIES.length] }} aria-hidden />
                {l}
              </li>
            ))}
          </ul>
        )}
        {children}
      </div>
      {note && <p className="mt-2 text-sm leading-relaxed text-[#1a1a1a]/60">{note}</p>}
    </figure>
  );
}

function Tip({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute bottom-full start-1/2 z-10 mb-2 hidden w-max max-w-[16rem] -translate-x-1/2 rounded-lg bg-[#1a1a1a] px-3 py-2 text-xs leading-relaxed text-white shadow-lg group-hover:block group-focus-within:block rtl:translate-x-1/2"
    >
      {text}
    </span>
  );
}

function Columns({ v }: { v: Extract<FaVisual, { type: 'columns' }> }) {
  const max = Math.max(...v.items.map((i) => i.value), 1);
  return (
    <Frame caption={v.caption} note={v.note}>
      <div className="flex items-end gap-1.5 md:gap-2" style={{ height: '11rem' }} role="list" aria-label={v.caption}>
        {v.items.map((it, i) => (
          <div key={i} role="listitem" tabIndex={0} className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end outline-none" aria-label={it.tip ?? `${it.label}: ${it.display ?? it.value}`}>
            <Tip text={it.tip} />
            <span className="mb-1 text-[11px] font-bold text-[#1a1a1a]/80 md:text-xs">{it.display ?? it.value}</span>
            <span
              className="w-full max-w-[2.25rem] rounded-t-[4px] transition-opacity group-hover:opacity-80"
              style={{ height: `${Math.max(4, (it.value / max) * 100)}%`, background: SERIES[v.series ?? 1] }}
              aria-hidden
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5 border-t border-[#1a1a1a]/15 pt-2 md:gap-2">
        {v.items.map((it, i) => (
          <div key={i} className="min-w-0 flex-1 text-center">
            <p className="truncate text-[10px] leading-tight text-[#1a1a1a]/60 md:text-[11px]">{it.label}</p>
            {it.sub && <p className="mt-0.5 text-[10px] font-bold leading-tight text-[#1a1a1a]/80 md:text-[11px]">{it.sub}</p>}
          </div>
        ))}
      </div>
      {v.subLabel && <p className="mt-2 text-xs text-[#1a1a1a]/55">{v.subLabel}</p>}
    </Frame>
  );
}

function Bars({ v }: { v: Extract<FaVisual, { type: 'bars' }> }) {
  const all = v.groups.flatMap((g) => g.values.map((x) => x.value));
  const sharedMax = Math.max(...all, 1);
  return (
    <Frame caption={v.caption} note={v.note} legend={v.series}>
      <div className="space-y-5">
        {v.groups.map((g, gi) => {
          const max = v.shared ? sharedMax : Math.max(...g.values.map((x) => x.value), 1);
          return (
            <div key={gi}>
              <p className="mb-2 text-sm font-bold text-[#1a1a1a]">{g.label}</p>
              <div className="space-y-1.5">
                {g.values.map((x, xi) => (
                  <div key={xi} tabIndex={0} className="group relative flex items-center gap-3 outline-none" aria-label={x.tip ?? `${g.label}: ${x.display}`}>
                    <Tip text={x.tip} />
                    <div className="h-3.5 flex-1 rounded-[4px] bg-[#1a1a1a]/[0.06]">
                      <div
                        className="h-full rounded-[4px] transition-opacity group-hover:opacity-80"
                        style={{ width: `${Math.max(2, (x.value / max) * 100)}%`, background: SERIES[(x.series ?? 0) % SERIES.length] }}
                        aria-hidden
                      />
                    </div>
                    <span className="w-28 shrink-0 text-xs font-bold text-[#1a1a1a]/85 md:w-36">{x.display}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
}

function Phases({ v, lang }: { v: Extract<FaVisual, { type: 'phases' }>; lang: 'fa' | 'en' }) {
  let n = 0;
  return (
    <Frame caption={v.caption} note={v.note}>
      <ol className={`grid gap-4 ${v.phases.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {v.phases.map((p, pi) => (
          <li key={pi} className="rounded-xl border border-[#1a1a1a]/12 p-4" style={{ borderTop: `3px solid ${SERIES[pi % SERIES.length]}` }}>
            <p className="font-estedad text-base font-black leading-snug">{p.title}</p>
            {p.note && <p className="mt-1 text-xs text-[#1a1a1a]/60">{p.note}</p>}
            <ol className="mt-3 space-y-2">
              {p.steps.map((s, si) => {
                n += 1;
                return (
                  <li key={si} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#1a1a1a]/85">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: SERIES[pi % SERIES.length] }} aria-hidden>
                      {lang === 'en' ? n : n.toLocaleString('fa-IR')}
                    </span>
                    {s}
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

export default function Visual({ visual, lang = 'fa' }: { visual: FaVisual; lang?: 'fa' | 'en' }) {
  if (visual.type === 'columns') return <Columns v={visual} />;
  if (visual.type === 'bars') return <Bars v={visual} />;
  return <Phases v={visual} lang={lang} />;
}
