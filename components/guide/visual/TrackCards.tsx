// ============================================================================
// components/guide/visual/TrackCards.tsx
// A programme's tracks side by side: name and stage, the headline figure,
// a few labelled rows, and the cost split drawn as a bar (the funder's share
// against the applicant's), with an optional second bar for a group that
// gets a different split. One column on phones, one card per track from md.
// The split widths come from the numbers; every number is also in the prose.
// ============================================================================
import React from 'react';
import { type Lang, type Surface, display, eyebrow, num, text, tile } from './kit';

export interface Split {
  /** The funder's share, in percent; the applicant pays the rest. */
  funder: number;
  /** What this bar is, e.g. "Women-led". Omit for the standard split. */
  label?: string;
}

export interface Track {
  name: string;
  stage: string;
  figure: string;
  figureSub?: string;
  rows: { label: string; value: string }[];
  split: Split;
  altSplit?: Split;
  /** One short line under the card, e.g. what comes next. */
  note?: string;
}

function Bar({ split, legend, lang, thin }: { split: Split; legend: [string, string]; lang: Lang; thin?: boolean }) {
  const you = 100 - split.funder;
  const pct = (n: number) => (lang === 'fa' ? `${num(n, lang)}٪` : `${n}%`);
  return (
    <div>
      {split.label && <p className="mb-1 text-xs font-bold text-[var(--ra-text)]">{split.label}</p>}
      <div
        role="img"
        aria-label={`${split.label ? split.label + ': ' : ''}${legend[0]} ${pct(split.funder)}, ${legend[1]} ${pct(you)}`}
        className={`flex w-full overflow-hidden rounded-full ${thin ? 'h-3' : 'h-6'}`}
      >
        <span className="grid place-items-center bg-[var(--rp)] text-[11px] font-bold text-white" style={{ width: `${split.funder}%` }}>
          {!thin && pct(split.funder)}
        </span>
        <span className="grid place-items-center bg-[var(--ra)] text-[11px] font-bold text-[var(--ra-ink)]" style={{ width: `${you}%` }}>
          {!thin && you >= 10 && pct(you)}
        </span>
      </div>
      {thin && (
        <p className="mt-1 text-xs text-[#1a1a1a]/65">
          {legend[0]} {pct(split.funder)} · {legend[1]} {pct(you)}
        </p>
      )}
    </div>
  );
}

export default function TrackCards({
  tracks,
  legend,
  lang = 'en',
  surface = 'paper',
  caption,
}: {
  tracks: Track[];
  /** Names of the two bar segments: funder, applicant. */
  legend: [string, string];
  lang?: Lang;
  surface?: Surface;
  caption?: string;
}) {
  const cols = tracks.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';
  return (
    <figure className={text(lang)}>
      {caption && <figcaption className={`mb-3 text-[var(--ra-text)] ${eyebrow(lang)}`}>{caption}</figcaption>}
      <ul className={`grid grid-cols-1 gap-3 ${cols}`}>
        {tracks.map((t, i) => (
          <li key={t.name} className={`flex flex-col overflow-hidden rounded-2xl border border-[#1a1a1a]/10 ${tile(surface)}`}>
            <div className="h-1.5 bg-[var(--rp)]" style={{ opacity: 0.45 + i * 0.275 }} aria-hidden="true" />
            <div className="flex flex-1 flex-col gap-4 p-5">
              <div>
                <p className={`text-2xl leading-tight ${display(lang)}`}>{t.name}</p>
                <p className="mt-1 text-sm leading-snug text-[#1a1a1a]/70">{t.stage}</p>
              </div>
              <p>
                <span className={`block text-[2rem] leading-none text-[var(--rp)] ${display(lang)}`}>{t.figure}</span>
                {t.figureSub && <span className="mt-1 block text-xs text-[#1a1a1a]/65">{t.figureSub}</span>}
              </p>
              <dl className="divide-y divide-[#1a1a1a]/10 border-y border-[#1a1a1a]/10 text-sm">
                {t.rows.map((r) => (
                  <div key={r.label} className="flex justify-between gap-3 py-2">
                    <dt className="text-[#1a1a1a]/65">{r.label}</dt>
                    <dd className="text-end font-bold">{r.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-auto space-y-3">
                <Bar split={t.split} legend={legend} lang={lang} />
                {t.altSplit && <Bar split={t.altSplit} legend={legend} lang={lang} thin />}
              </div>
              {t.note && <p className="text-xs leading-relaxed text-[#1a1a1a]/65">{t.note}</p>}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#1a1a1a]/70" aria-hidden="true">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[var(--rp)]" />{legend[0]}</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[var(--ra)]" />{legend[1]}</span>
      </p>
    </figure>
  );
}
