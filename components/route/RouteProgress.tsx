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

export interface RouteStopDef {
  id: string;
  label: string;
}

interface RouteState {
  stops: RouteStopDef[];
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

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function RouteProvider({ stops, children }: { stops: RouteStopDef[]; children: React.ReactNode }) {
  const [done, setDone] = useState<Set<string>>(() => new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [prRoute, setPrRoute] = useState<number | null>(null);
  const snow = useRef<((count: number) => void) | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const doneRef = useRef<Set<string>>(new Set());

  const complete = useCallback(
    (id: string, message: string) => {
      if (doneRef.current.has(id)) return;
      const next = new Set(doneRef.current).add(id);
      doneRef.current = next;
      setDone(next);
      const finished = next.size === stops.length;
      setToast(`${finished ? 'Route complete' : `✓ ${message}`} · ${next.size}/${stops.length}`);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2400);
      snow.current?.(finished ? 120 : 28);
    },
    [stops.length],
  );

  const registerSnow = useCallback((fn: (count: number) => void) => {
    snow.current = fn;
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const value = useMemo(() => ({ stops, done, complete, prRoute, setPrRoute }), [stops, done, complete, prRoute]);

  return (
    <RouteContext.Provider value={value}>
      {children}
      <Snow register={registerSnow} />
      <div
        role="status"
        className={`fixed left-1/2 bottom-5 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#1a1a1a] px-5 py-2.5 font-sans text-sm text-[#F2F0E9] shadow-lg transition-transform duration-300 ${
          toast ? 'translate-y-0' : 'translate-y-[200%]'
        }`}
      >
        {toast}
      </div>
    </RouteContext.Provider>
  );
}

/** A flag that climbs its pole as the route fills in. `flag` is drawn in an 18 × 11 user space. */
export function FlagPole({ progress, flag, width, light = false }: { progress: number; flag: React.ReactNode; width: number; light?: boolean }) {
  const drop = 32 * (1 - Math.min(Math.max(progress, 0), 1));
  return (
    <svg width={width} height={width * 1.5} viewBox="0 0 40 60" aria-hidden="true" className="block shrink-0 overflow-visible">
      <line x1="3" y1="3" x2="3" y2="60" strokeWidth="1.6" className={light ? 'stroke-white/60' : 'stroke-[#1a1a1a]/45'} />
      <circle cx="3" cy="3" r="2.5" className={light ? 'fill-white/60' : 'fill-[#1a1a1a]/45'} />
      <g className="transition-transform duration-[900ms] ease-out motion-reduce:transition-none" style={{ transform: `translateY(${drop}px)` }}>
        <g transform="translate(4 5) scale(1.8889)">
          <g className={progress >= 1 ? 'origin-left animate-flutter motion-reduce:animate-none [transform-box:fill-box]' : ''}>{flag}</g>
        </g>
      </g>
    </svg>
  );
}

/** Sticky rail: the pole, the count, and one chip per stop. */
export function RouteRail({ flag }: { flag: React.ReactNode }) {
  const { stops, done } = useRoute();
  return (
    <nav aria-label="Your progress through this guide" className="sticky top-[4.5rem] z-40 border-b border-[#1a1a1a]/10 bg-[#F2F0E9]/90 backdrop-blur">
      <div className="container mx-auto flex items-center gap-3 px-6 py-1.5">
        <div className="flex shrink-0 items-end gap-1.5" title="Complete the route to raise the flag">
          <FlagPole progress={done.size / stops.length} flag={flag} width={26} />
          <span className="font-sans text-xs tabular-nums text-[#1a1a1a]/60">
            {done.size}/{stops.length}
          </span>
        </div>
        <ol className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {stops.map((s) => {
            const isDone = done.has(s.id);
            return (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans text-xs transition-colors ${
                    isDone ? 'border-[#00BFA5] bg-[#DDF4EF]' : 'border-[#1a1a1a]/10 bg-white hover:border-[#00BFA5]'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full border-[1.5px] ${isDone ? 'border-[#00BFA5] bg-[#00BFA5]' : 'border-[#1a1a1a]/40'}`} />
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
export function RouteFinish({ flag }: { flag: React.ReactNode }) {
  const { stops, done } = useRoute();
  const finished = done.size === stops.length;
  return (
    <div className="mb-6 flex items-end gap-4">
      <FlagPole progress={done.size / stops.length} flag={flag} width={84} light />
      <span className="pb-1 font-sans text-xs tabular-nums text-white/60">
        {finished ? 'Flag raised. Route complete.' : `${done.size}/${stops.length} checkpoints`}
      </span>
    </div>
  );
}

type Tone = 'paper' | 'white' | 'night';
const TONES: Record<Tone, { section: string; eyebrow: string; muted: string; number: string; answer: string }> = {
  paper: { section: 'bg-[#F2F0E9] text-[#1a1a1a]', eyebrow: 'text-[#00796B]', muted: 'text-[#1a1a1a]/60', number: 'border-[#1a1a1a]/15 text-[#1a1a1a]/50', answer: 'text-[#1a1a1a]/85' },
  white: { section: 'bg-white text-[#1a1a1a]', eyebrow: 'text-[#00796B]', muted: 'text-[#1a1a1a]/60', number: 'border-[#1a1a1a]/15 text-[#1a1a1a]/50', answer: 'text-[#1a1a1a]/85' },
  night: { section: 'bg-[#001B3D] text-white', eyebrow: 'text-[#00BFA5]', muted: 'text-white/60', number: 'border-white/20 text-white/55', answer: 'text-white/80' },
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
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          timer = setTimeout(() => complete(id, message ?? 'Checkpoint reached'), 1200);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
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
                isDone ? 'border-[#00BFA5] bg-[#00BFA5] text-[#00261F]' : tone === 'night' ? 'border-white/50' : 'border-[#1a1a1a]/40'
              }`}
            >
              {isDone && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            {task}
          </span>
        </div>
        <div className={`mb-8 max-w-[68ch] border-l-[3px] border-[#00BFA5] pl-4 font-sans text-[1.05rem] leading-relaxed ${t.answer}`}>{answer}</div>
        {children}
      </div>
    </section>
  );
}

function Snow({ register }: { register: (fn: (count: number) => void) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    type Flake = { x: number; y: number; r: number; vy: number; ph: number; life: number };
    let flakes: Flake[] = [];
    let running = false;
    const fit = () => {
      c.width = window.innerWidth * window.devicePixelRatio;
      c.height = window.innerHeight * window.devicePixelRatio;
    };
    fit();
    window.addEventListener('resize', fit);
    const frame = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const f of flakes) {
        f.y += f.vy;
        f.ph += 0.03;
        f.x += Math.sin(f.ph) * 0.8;
        if (f.y > c.height * 0.7) f.life -= 0.02;
        ctx.globalAlpha = Math.max(f.life, 0) * 0.9;
        ctx.fillStyle = '#00BFA5';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      flakes = flakes.filter((f) => f.life > 0 && f.y < c.height + 20);
      if (flakes.length) requestAnimationFrame(frame);
      else {
        running = false;
        ctx.clearRect(0, 0, c.width, c.height);
      }
    };
    register((count) => {
      if (prefersReducedMotion()) return;
      const dpr = window.devicePixelRatio;
      for (let i = 0; i < count; i++) {
        flakes.push({ x: Math.random() * c.width, y: -10 - Math.random() * c.height * 0.3, r: (1.5 + Math.random() * 3) * dpr, vy: (1 + Math.random() * 2) * dpr, ph: Math.random() * 6, life: 1 });
      }
      if (!running) {
        running = true;
        requestAnimationFrame(frame);
      }
    });
    return () => window.removeEventListener('resize', fit);
  }, [register]);
  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 h-full w-full" />;
}

/** For components that also live outside route guides (the chapter video). */
export function useOptionalRoute(): RouteState | null {
  return useContext(RouteContext);
}
