'use client';
// ============================================================================
// Component: components/route/RouteProgress.tsx
// The game layer of a route guide. Each section of the page is a "stop"; the
// reader completes it by doing its small task (answer the quiz, walk the
// steps, set up the calculator…). Progress raises the country's flag up a
// pole in the sticky rail and again in the booking section.
//
// Everything a crawler or an answer engine needs is rendered by the server in
// the stops' children. This file only adds state on top, so the page reads in
// full with JavaScript off.
// ============================================================================
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { FLAGS, FlagShapes, type FlagCode } from './flags';

export interface RouteStopDef {
  id: string;
  label: string;
}

/**
 * A guide's palette. Components read these as CSS variables, so one set of
 * widgets serves every country in its own colours.
 */
export interface RouteTheme {
  /** Highlight: buttons, progress, ticks. */
  accent: string;
  /** Text on the accent. */
  accentInk: string;
  /** The accent dark enough to read as text on paper and white. */
  accentText: string;
  /** Figures and selected controls. */
  primary: string;
  /** Dark bands: video, booking, calculator result. */
  deep: string;
  /** Light tint of the accent: notes, completed chips. */
  soft: string;
  /** The accent as text on `deep`, when `accent` itself is too dark to reach 4.5:1 there. Defaults to `accent`. */
  accentOnDark?: string;
}

/** UI copy for the progress layer, so a Persian page can carry the same game. */
export interface RouteLabels {
  rail: string;
  railTitle: string;
  routeComplete: string;
  flagRaised: string;
  /** "{n}/{total} checkpoints" */
  checkpoints: string;
  /** The bare counter: "{n}/{total}". */
  count: string;
  digits: 'latin' | 'persian';
  /** Font utility for the rail, toast and finish line. */
  font: string;
}

const EN_LABELS: RouteLabels = {
  rail: 'Your progress through this guide',
  railTitle: 'Complete the route to raise the flag',
  routeComplete: 'Route complete',
  flagRaised: 'Flag raised. Route complete.',
  checkpoints: '{n}/{total} checkpoints',
  count: '{n}/{total}',
  digits: 'latin',
  font: 'font-sans',
};

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
export const formatDigits = (text: string, digits: RouteLabels['digits']) =>
  digits === 'persian' ? text.replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]) : text;

const fillCount = (tpl: string, n: number, total: number) => tpl.replace('{n}', String(n)).replace('{total}', String(total));

interface RouteState {
  stops: RouteStopDef[];
  /** No flag when the national symbol cannot be drawn to its legislated geometry (Israel, by the site's rule). */
  flag?: FlagCode;
  labels: RouteLabels;
  done: ReadonlySet<string>;
  complete: (id: string, message: string) => void;
  /** Index of the permanent-residence route the reader matched, shared by the finder and the roadmap. */
  prRoute: number | null;
  setPrRoute: (index: number) => void;
}

const RouteContext = createContext<RouteState | null>(null);

export function useRoute(): RouteState {
  const ctx = useContext(RouteContext);
  if (!ctx) throw new Error('useRoute must be used inside <RouteProvider>');
  return ctx;
}

export function RouteProvider({
  stops,
  flag,
  theme,
  labels: labelOverrides,
  children,
}: {
  stops: RouteStopDef[];
  flag?: FlagCode;
  theme: RouteTheme;
  labels?: Partial<RouteLabels>;
  children: React.ReactNode;
}) {
  const labels = useMemo(() => ({ ...EN_LABELS, ...labelOverrides }), [labelOverrides]);
  const [done, setDone] = useState<Set<string>>(() => new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [prRoute, setPrRoute] = useState<number | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const doneRef = useRef<Set<string>>(new Set());

  const complete = useCallback(
    (id: string, message: string) => {
      if (doneRef.current.has(id)) return;
      const next = new Set(doneRef.current).add(id);
      doneRef.current = next;
      setDone(next);
      const finished = next.size === stops.length;
      setToast(formatDigits(`${finished ? labels.routeComplete : `✓ ${message}`} · ${fillCount(labels.count, next.size, stops.length)}`, labels.digits));
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2400);
    },
    [stops.length, labels],
  );

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const value = useMemo(() => ({ stops, flag, labels, done, complete, prRoute, setPrRoute }), [stops, flag, labels, done, complete, prRoute]);
  // Custom properties are the one thing Tailwind cannot express statically.
  const vars = { '--ra': theme.accent, '--ra-ink': theme.accentInk, '--ra-text': theme.accentText, '--rp': theme.primary, '--rd': theme.deep, '--rs': theme.soft, '--ra-dark': theme.accentOnDark ?? theme.accent } as React.CSSProperties;

  return (
    <RouteContext.Provider value={value}>
      <div className="contents" style={vars}>
      {children}
      <div
        role="status"
        className={`fixed left-1/2 bottom-5 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#1a1a1a] px-5 py-2.5 ${labels.font} text-sm text-[#F2F0E9] shadow-lg transition-transform duration-300 ${
          toast ? 'translate-y-0' : 'translate-y-[200%]'
        }`}
      >
        {toast}
      </div>
      </div>
    </RouteContext.Provider>
  );
}

/** A flag that climbs its pole as the route fills in. The flag always keeps its official proportions. */
export function FlagPole({ progress, code, uid, width, light = false }: { progress: number; code?: FlagCode; uid: string; width: number; light?: boolean }) {
  // Without a national flag the pole carries a plain pennant in the guide's accent.
  const f = code ? FLAGS[code] : { w: 3, h: 2 };
  const fw = 34;
  const fh = (fw * f.h) / f.w;
  const drop = (53 - fh) * (1 - Math.min(Math.max(progress, 0), 1));
  return (
    <svg width={width} height={width * 1.5} viewBox="0 0 40 60" aria-hidden="true" className="block shrink-0 overflow-visible">
      <line x1="3" y1="3" x2="3" y2="60" strokeWidth="1.6" className={light ? 'stroke-white/60' : 'stroke-[#1a1a1a]/45'} />
      <circle cx="3" cy="3" r="2.5" className={light ? 'fill-white/60' : 'fill-[#1a1a1a]/45'} />
      <g className="transition-transform duration-[900ms] ease-out motion-reduce:transition-none" style={{ transform: `translateY(${drop}px)` }}>
        <g transform={`translate(4 5) scale(${fw / f.w})`}>
          <g className={progress >= 1 ? 'origin-left animate-flutter motion-reduce:animate-none [transform-box:fill-box]' : ''}>
            {code ? <FlagShapes code={code} uid={uid} /> : <rect width="3" height="2" className="fill-[var(--ra)]" />}
          </g>
        </g>
      </g>
    </svg>
  );
}

/** Sticky rail: the pole, the count, and one chip per stop. */
export function RouteRail() {
  const { stops, done, flag, labels } = useRoute();
  return (
    <nav aria-label={labels.rail} className="sticky top-[4.5rem] z-40 border-b border-[#1a1a1a]/10 bg-[#F2F0E9]/90 backdrop-blur">
      <div className="container mx-auto flex items-center gap-3 px-6 py-1.5">
        <div className="flex shrink-0 items-end gap-1.5" title={labels.railTitle}>
          <FlagPole progress={done.size / stops.length} code={flag} uid="rail" width={26} />
          <span className={`${labels.font} text-xs tabular-nums text-[#1a1a1a]/60`}>
            {formatDigits(fillCount(labels.count, done.size, stops.length), labels.digits)}
          </span>
        </div>
        <ol className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {stops.map((s) => {
            const isDone = done.has(s.id);
            return (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${labels.font} text-xs transition-colors ${
                    isDone ? 'border-[var(--ra)] bg-[var(--rs)]' : 'border-[#1a1a1a]/10 bg-white hover:border-[var(--ra)]'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full border-[1.5px] ${isDone ? 'border-[var(--ra)] bg-[var(--ra)]' : 'border-[#1a1a1a]/40'}`} />
                  {s.label}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

/** The big pole in the booking section, with the running count. */
export function RouteFinish() {
  const { stops, done, flag, labels } = useRoute();
  const finished = done.size === stops.length;
  return (
    <div className="mb-6 flex items-end gap-4">
      <FlagPole progress={done.size / stops.length} code={flag} uid="finish" width={84} light />
      <span className={`pb-1 ${labels.font} text-xs tabular-nums text-white/60`}>
        {finished ? labels.flagRaised : formatDigits(fillCount(labels.checkpoints, done.size, stops.length), labels.digits)}
      </span>
    </div>
  );
}

type Tone = 'paper' | 'white' | 'night';
const TONES: Record<Tone, { section: string; eyebrow: string; muted: string; number: string; answer: string }> = {
  paper: { section: 'bg-[#F2F0E9] text-[#1a1a1a]', eyebrow: 'text-[var(--ra-text)]', muted: 'text-[#1a1a1a]/60', number: 'border-[#1a1a1a]/15 text-[#1a1a1a]/50', answer: 'text-[#1a1a1a]/85' },
  white: { section: 'bg-white text-[#1a1a1a]', eyebrow: 'text-[var(--ra-text)]', muted: 'text-[#1a1a1a]/60', number: 'border-[#1a1a1a]/15 text-[#1a1a1a]/50', answer: 'text-[#1a1a1a]/85' },
  night: { section: 'bg-[var(--rd)] text-white', eyebrow: 'text-[var(--ra-dark)]', muted: 'text-white/60', number: 'border-white/20 text-white/55', answer: 'text-white/80' },
};

/**
 * One stop of the route: a section whose H2 is the question people search,
 * followed by a direct answer of about 50 words — the passage answer engines
 * quote. `completeOn` finishes the stop on view or on any click inside it;
 * interactive stops call `complete` themselves.
 */
export function RouteStop({
  id,
  number,
  eyebrow,
  question,
  answer,
  task,
  tone = 'paper',
  completeOn,
  message,
  children,
}: {
  id: string;
  number: number;
  eyebrow: string;
  question: string;
  answer: React.ReactNode;
  task: string;
  tone?: Tone;
  completeOn?: 'view' | 'click';
  message?: string;
  children: React.ReactNode;
}) {
  const { done, complete } = useRoute();
  const ref = useRef<HTMLElement>(null);
  const t = TONES[tone];
  const isDone = done.has(id);

  useEffect(() => {
    if (completeOn !== 'view' || !ref.current) return;
    let timer: ReturnType<typeof setTimeout>;
    // "Seen" means half the section, or half the screen for a section taller
    // than two screens — on a phone a long stop never shows half of itself.
    const io = new IntersectionObserver(
      ([e]) => {
        const need = Math.min(e.boundingClientRect.height, window.innerHeight) * 0.5;
        if (e.isIntersecting && e.intersectionRect.height >= need) {
          timer = setTimeout(() => complete(id, message ?? 'Checkpoint reached'), 1200);
          io.disconnect();
        }
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    );
    io.observe(ref.current);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [completeOn, complete, id, message]);

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-q`}
      onClickCapture={completeOn === 'click' ? () => complete(id, message ?? 'Checkpoint reached') : undefined}
      className={`scroll-mt-32 border-b border-[#1a1a1a]/10 px-6 py-16 md:py-20 ${t.section}`}
    >
      <div className="container mx-auto">
        <div className="mb-6 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2">
          <span className={`row-span-4 mt-1 h-fit rounded-lg border px-2 py-1 font-sans text-xs tabular-nums ${t.number}`}>
            {String(number).padStart(2, '0')}
          </span>
          <span className={`font-sans text-xs font-bold uppercase tracking-[0.18em] ${t.eyebrow}`}>{eyebrow}</span>
          <h2 id={`${id}-q`} className="max-w-4xl text-balance font-serif text-3xl leading-[1.08] tracking-[-0.01em] md:text-[2.6rem]">
            {question}
          </h2>
          <span className={`items-center gap-2 font-sans text-xs inline-flex ${t.muted}`}>
            <span
              className={`grid h-[18px] w-[18px] place-items-center rounded-full border-[1.5px] transition-colors ${
                isDone ? 'border-[var(--ra)] bg-[var(--ra)] text-[var(--ra-ink)]' : tone === 'night' ? 'border-white/50' : 'border-[#1a1a1a]/40'
              }`}
            >
              {isDone && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            {task}
          </span>
        </div>
        <div className={`mb-8 max-w-[68ch] border-l-[3px] border-[var(--ra)] pl-4 font-sans text-[1.05rem] leading-relaxed ${t.answer}`}>{answer}</div>
        {children}
      </div>
    </section>
  );
}

/** For components that also live outside route guides (the chapter video). */
export function useOptionalRoute(): RouteState | null {
  return useContext(RouteContext);
}
