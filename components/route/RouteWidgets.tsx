'use client';
// ============================================================================
// Component: components/route/RouteWidgets.tsx
// The interactive pieces of a route guide: the eligibility quiz, the step
// walker, the means-of-support calculator, the perk-or-catch cards, the
// permanent-residence finder and the years roadmap. Each one receives its copy
// as props from the server page and renders that copy in full on the server,
// so the text is in the HTML whether or not the game ever runs.
// ============================================================================
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useRoute } from './RouteProgress';
import Flag from './flags';

const eur = (n: number) => `€${Math.round(n).toLocaleString('en')}`;

function Toggle({ pressed, onClick, children, dark = false }: { pressed: boolean; onClick: () => void; children: React.ReactNode; dark?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 font-sans text-sm transition-colors ${
        pressed ? 'border-[var(--rp)] bg-[var(--rp)] text-white' : dark ? 'border-white/25 text-white hover:border-white/60' : 'border-[#1a1a1a]/15 bg-[#F2F0E9] hover:border-[var(--rp)]'
      }`}
    >
      {children}
    </button>
  );
}

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

/* ── Eligibility quiz ───────────────────────────────────────────────────── */

/**
 * `strongNote` follows the all-yes verdict and `gapNote` follows the list of
 * gaps; both are country-specific, so they come from the page.
 */
export function GateQuiz({
  stopId,
  criteria,
  strongNote = '',
  gapNote = '',
  children,
}: {
  stopId: string;
  criteria: { title: string; body: string }[];
  strongNote?: string;
  gapNote?: string;
  children?: React.ReactNode;
}) {
  const WORDS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
  const { complete } = useRoute();
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const answered = Object.keys(answers).length;
  const yes = Object.values(answers).filter(Boolean).length;
  const missing = criteria.filter((_, i) => answers[i] === false).map((c) => c.title.toLowerCase());

  const answer = (i: number, v: boolean) => setAnswers((prev) => ({ ...prev, [i]: v }));

  useEffect(() => {
    if (answered === criteria.length) complete(stopId, 'Gate checked');
  }, [answered, criteria.length, complete, stopId]);

  let title = `${answered} of ${criteria.length} answered`;
  let body = 'Each "not yet" is a part of your file to fix before you apply.';
  if (answered === criteria.length) {
    if (yes === criteria.length) {
      title = 'Strong on paper';
      body = `You meet all ${WORDS[criteria.length] ?? criteria.length} tests as you describe them. ${strongNote}`.trim();
    } else if (yes >= 2) {
      title = 'Close, with gaps';
      body = `Fix before applying: ${missing.join(', ')}. ${gapNote}`.trim();
    } else {
      title = 'Not ready yet';
      body = `Missing: ${missing.join(', ')}. Applying now mostly burns time. Another country may fit your team better.`;
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <ol className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        {criteria.map((c, i) => (
          <li key={c.title} className="grid gap-1.5 border-b border-dashed border-[#1a1a1a]/10 py-4 first:pt-0 last:border-0 last:pb-0">
            <h3 className="font-serif text-xl">{c.title}</h3>
            <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]/65">{c.body}</p>
            <div className="mt-1 gap-1.5 flex">
              <Toggle pressed={answers[i] === true} onClick={() => answer(i, true)}>We have this</Toggle>
              <Toggle pressed={answers[i] === false} onClick={() => answer(i, false)}>Not yet</Toggle>
            </div>
          </li>
        ))}
      </ol>
      <div className="grid content-start gap-4 self-start rounded-2xl border border-[#1a1a1a]/10 bg-white p-6 lg:sticky lg:top-20">
        <div className="block" aria-live="polite">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--ra-text)]">Your readiness</p>
          <div className="my-3 h-3 overflow-hidden rounded-full bg-[#1a1a1a]/10">
            <div className="h-full bg-gradient-to-r from-[#B4531A] to-[var(--ra)] transition-[width] duration-500" style={{ width: `${(yes / criteria.length) * 100}%` }} />
          </div>
          <p className="font-serif text-2xl">{title}</p>
          <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#1a1a1a]/65">{body}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

/** 100 dots, eight lit: the approval rate as something you can see. */
export function ApprovalDots({ approved = 8 }: { approved?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);
  const lit = new Set(Array.from({ length: approved }, (_, i) => Math.round((i + 0.5) * (100 / approved))));
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setPlay(true);
        io.disconnect();
      }
    }, { threshold: 0.8 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} aria-hidden="true" className="grid max-w-[340px] grid-cols-[repeat(20,minmax(0,1fr))] gap-1">
      {Array.from({ length: 100 }, (_, i) => (
        <i key={i} className={`aspect-square rounded-full ${lit.has(i) ? `bg-[var(--ra)] ${play ? 'motion-safe:animate-pop' : ''}` : 'bg-[#1a1a1a]/10'}`} />
      ))}
    </div>
  );
}

/* ── Step walker ────────────────────────────────────────────────────────── */

export interface RouteStep {
  title: string;
  who: string;
  body: string;
  note: string;
  figure: string;
  figureLabel: string;
}

export function StepWalker({ stopId, steps }: { stopId: string; steps: RouteStep[] }) {
  const WORDS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const { complete } = useRoute();
  const [cur, setCur] = useState(0);
  const [seen, setSeen] = useState(0);
  const last = steps.length - 1;
  const go = (i: number) => {
    const n = Math.max(0, Math.min(last, i));
    setCur(n);
    setSeen((s) => Math.max(s, n));
    if (n === last) complete(stopId, `All ${WORDS[steps.length] ?? steps.length} steps walked`);
  };
  return (
    <div>
      <div aria-hidden="true" className="relative mb-5 grid-cols-5 grid">
        <span className="absolute left-[10%] right-[10%] top-[22px] h-0.5 bg-[#1a1a1a]/10" />
        <span className="absolute left-[10%] top-[22px] h-0.5 bg-[var(--ra)] transition-[width] duration-500" style={{ width: `${(cur / last) * 80}%` }} />
        {steps.map((s, i) => (
          <button key={s.title} type="button" tabIndex={-1} onClick={() => go(i)} className="relative grid justify-items-center gap-2 px-1 text-center">
            <span
              className={`grid h-11 w-11 place-items-center rounded-full border-2 font-sans text-sm tabular-nums transition-all ${
                i === cur ? 'scale-110 border-[var(--ra)] bg-[var(--ra)] text-[var(--ra-ink)]' : i <= seen ? 'border-[var(--ra)] bg-white' : 'border-[#1a1a1a]/10 bg-white'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className={`font-sans text-[11px] leading-tight md:text-xs ${i === cur ? 'font-bold text-[#1a1a1a]' : 'text-[#1a1a1a]/55'}`}>{s.title}</span>
          </button>
        ))}
      </div>
      <ol className="grid gap-3">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className={`grid grid-cols-1 gap-4 rounded-2xl border border-[#1a1a1a]/10 bg-white p-6 md:grid-cols-[minmax(0,1fr)_auto] ${
              i === cur ? 'motion-safe:animate-fade-up' : 'hidden'
            }`}
          >
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--ra-text)]">
                Step {i + 1} of {steps.length} · {s.who}
              </p>
              <h3 className="mb-2 mt-1 font-serif text-2xl">{s.title}</h3>
              <p className="max-w-[64ch] font-sans text-sm leading-relaxed text-[#1a1a1a]/70">{s.body}</p>
              <p className="mt-3 rounded-lg bg-[var(--rs)] px-3 py-2.5 font-sans text-sm">{s.note}</p>
            </div>
            <dl className="md:text-right">
              <dd className="font-serif text-3xl text-[var(--rp)]">{s.figure}</dd>
              <dt className="font-sans text-xs text-[#1a1a1a]/55">{s.figureLabel}</dt>
            </dl>
          </li>
        ))}
      </ol>
      <div className="mt-4 gap-2 flex">
        <button type="button" onClick={() => go(cur - 1)} disabled={cur === 0} className="inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] px-5 py-2.5 font-sans text-sm font-bold disabled:opacity-30">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button type="button" onClick={() => go(cur + 1)} className="inline-flex items-center gap-2 rounded-full bg-[var(--ra)] px-5 py-2.5 font-sans text-sm font-bold text-[var(--ra-ink)] transition-transform hover:-translate-y-0.5">
          {cur === last ? (<>Done <Check className="h-4 w-4" /></>) : (<>Next step <ArrowRight className="h-4 w-4" /></>)}
        </button>
      </div>
    </div>
  );
}

/* ── Means-of-support calculator ────────────────────────────────────────── */

export interface FundsTable {
  regions: string[];
  single: number[];
  couple: number[];
  /** First child, second child, each further child — per region. */
  children: number[][];
  fees: { permit: number; spouse: number; child: number; dVisa: number };
  months: number;
}

export function FundsCalculator({ stopId, t }: { stopId: string; t: FundsTable }) {
  const { complete } = useRoute();
  const [region, setRegion] = useState(0);
  const [spouse, setSpouse] = useState(false);
  const [kids, setKids] = useState(0);
  const [dVisa, setDVisa] = useState(true);
  const [shown, setShown] = useState(t.single[0] * t.months);

  let monthly = spouse ? t.couple[region] : t.single[region];
  for (let k = 0; k < kids; k++) monthly += t.children[Math.min(k, t.children.length - 1)][region];
  const total = monthly * t.months;
  const people = 1 + Number(spouse) + kids;
  const fees: [string, number][] = [
    ['Your permit', t.fees.permit],
    ...(spouse ? ([['Spouse permit', t.fees.spouse]] as [string, number][]) : []),
    ...(kids ? ([[`Child permits × ${kids}`, t.fees.child * kids]] as [string, number][]) : []),
    ...(dVisa ? ([[`D visas × ${people}`, t.fees.dVisa * people]] as [string, number][]) : []),
  ];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(total);
      return;
    }
    const from = shown;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / 500, 1);
      setShown(from + (total - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // `shown` is the animation's own output; restarting on it would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const touch = <T,>(fn: (v: T) => void) => (v: T) => {
    fn(v);
    complete(stopId, 'Your number is set');
  };

  return (
    <div className="grid-cols-1 gap-5 grid md:grid-cols-2">
      <div className="grid gap-5 rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        <div>
          <p className="mb-2 font-sans text-sm font-bold">Where will you live?</p>
          <div className="flex flex-wrap gap-1.5">
            {t.regions.map((r, i) => (
              <Toggle key={r} pressed={region === i} onClick={() => touch(setRegion)(i)}>{r}</Toggle>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-sans text-sm font-bold">Spouse coming with you?</p>
          <Switch on={spouse} label="Spouse coming with you" onClick={() => touch(setSpouse)(!spouse)} />
        </div>
        <div>
          <p className="mb-2 font-sans text-sm font-bold">Children under 18</p>
          <div className="inline-flex items-center overflow-hidden rounded-full border border-[#1a1a1a]/15">
            <button type="button" aria-label="Fewer children" onClick={() => touch(setKids)(Math.max(0, kids - 1))} className="h-9 w-10 bg-[#F2F0E9] text-lg">−</button>
            <span className="min-w-11 text-center font-sans tabular-nums" aria-live="polite">{kids}</span>
            <button type="button" aria-label="More children" onClick={() => touch(setKids)(Math.min(6, kids + 1))} className="h-9 w-10 bg-[#F2F0E9] text-lg">+</button>
          </div>
        </div>
        <div>
          <p className="mb-2 font-sans text-sm font-bold">Add the D visa so you can fly in on the decision?</p>
          <Switch on={dVisa} label="Add the D visa" onClick={() => touch(setDVisa)(!dVisa)} />
        </div>
      </div>
      <div className="rounded-2xl bg-[var(--rd)] p-6 text-white" aria-live="polite">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--ra-dark)]">To show for a two-year permit</p>
        <p className="mb-1 mt-2 font-serif text-5xl tabular-nums">{eur(shown)}</p>
        <p className="font-sans text-sm text-white/60">
          <span className="tabular-nums">{eur(monthly)}</span> net per month × {t.months} months
        </p>
        <div className="mt-5 grid gap-1.5 font-sans text-sm text-white/65">
          <p className="text-white/45">Migri fees, online</p>
          {fees.map(([label, v]) => (
            <div key={label} className="flex justify-between gap-3 border-t border-white/10 pt-1.5">
              <span>{label}</span>
              <span className="tabular-nums text-white">{eur(v)}</span>
            </div>
          ))}
          <div className="flex justify-between gap-3 border-t border-white/10 pt-1.5">
            <span>Fees total</span>
            <span className="tabular-nums text-white">{eur(fees.reduce((a, [, v]) => a + v, 0))}</span>
          </div>
        </div>
        <p className="mt-4 font-sans text-xs leading-relaxed text-white/55">
          The money has to stay available for the whole permit period. Temporary transfers made only to get the visa are a known abuse pattern that Migri looks for.
        </p>
      </div>
    </div>
  );
}

/* ── Perk or catch ──────────────────────────────────────────────────────── */

export function PerkOrCatch({ stopId, items }: { stopId: string; items: { title: string; content: string; positive: boolean }[] }) {
  const { complete } = useRoute();
  const [guesses, setGuesses] = useState<Record<number, boolean>>({});
  const answered = Object.keys(guesses).length;
  const right = items.filter((it, i) => i in guesses && guesses[i] === it.positive).length;

  const guess = (i: number, v: boolean) => setGuesses((prev) => (i in prev ? prev : { ...prev, [i]: v }));

  useEffect(() => {
    if (answered === items.length) complete(stopId, `You spotted ${right} of ${items.length}`);
  }, [answered, right, items.length, complete, stopId]);

  return (
    <>
      <p className="mb-4 font-sans text-sm tabular-nums text-[#1a1a1a]/60 block" aria-live="polite">
        Guess each card · {right}/{answered} right so far
      </p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => {
          const flipped = i in guesses;
          return (
            <li key={it.title} className="min-h-[236px] [perspective:900px]">
              <div className={`relative h-full transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
                <div className="flex flex-col justify-between gap-3 border border-[#1a1a1a]/10 bg-white p-4 absolute inset-0 rounded-2xl [backface-visibility:hidden]">
                  <h3 className="font-serif text-xl">{it.title}</h3>
                  <div className="block">
                    <p className="mb-1.5 font-sans text-xs text-[#1a1a1a]/55">Perk or catch?</p>
                    <div className="flex gap-1.5">
                      <Toggle pressed={false} onClick={() => guess(i, true)}>Perk</Toggle>
                      <Toggle pressed={false} onClick={() => guess(i, false)}>Catch</Toggle>
                    </div>
                  </div>
                </div>
                <div
                  className={`flex flex-col gap-2.5 border p-4 font-sans text-sm leading-relaxed absolute inset-0 overflow-auto rounded-2xl border-t [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    it.positive ? 'border-[color-mix(in_srgb,var(--ra)_30%,transparent)] bg-[var(--rs)]' : 'border-[#B4531A]/25 bg-[#FBEBDD]'
                  }`}
                >
                  <span className={`font-sans text-[11px] font-bold uppercase tracking-[0.16em] ${it.positive ? 'text-[var(--ra-text)]' : 'text-[#B4531A]'}`}>
                    {it.positive ? 'Perk' : 'Catch'} · {it.title}
                  </span>
                  <p>{it.content}</p>
                  {flipped && <span className="mt-auto text-xs font-bold">{guesses[i] === it.positive ? '✓ You called it' : '✗ Not quite'}</span>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/* ── Permanent residence finder ─────────────────────────────────────────── */

/** One question in the finder. The answer is the index of the chosen option. */
export interface PrQuestion {
  key: string;
  q: string;
  /** In display order; index 0 is the default. For yes/no use ['No', 'Yes']. */
  options: string[];
}

export interface PrRoute {
  title: string;
  /** Minimum years of residence; 0 for "no minimum". */
  years: number;
  reqs: string[];
  note: string;
  /** Answer index each question needs at least, keyed by PrQuestion.key. */
  needs: Record<string, number>;
}

export function PrFinder({ stopId, questions, routes }: { stopId: string; questions: PrQuestion[]; routes: PrRoute[] }) {
  const { complete, setPrRoute } = useRoute();
  const [a, setA] = useState<Record<string, number>>(() => Object.fromEntries(questions.map((q) => [q.key, 0])));
  const [touched, setTouched] = useState(false);
  const maxYears = Math.max(...routes.map((r) => r.years), 1);

  const open = routes.map((r) => Object.entries(r.needs).every(([k, min]) => (a[k] ?? 0) >= min));
  const best = open.reduce((bi, o, i) => (o && (bi < 0 || routes[i].years < routes[bi].years) ? i : bi), -1);

  const set = (key: string, v: number) => {
    setA((prev) => ({ ...prev, [key]: v }));
    setTouched(true);
    complete(stopId, 'Residence route found');
  };

  useEffect(() => {
    if (touched && best >= 0) setPrRoute(best);
  }, [best, touched, setPrRoute]);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.3fr)]">
      <div className="grid content-start gap-5 rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        {questions.map((q) => (
          <div key={q.key}>
            <p className="mb-2 font-sans text-sm font-bold">{q.q}</p>
            <div className="flex flex-wrap gap-1.5">
              {q.options.map((o, i) => (
                <Toggle key={o} pressed={a[q.key] === i} onClick={() => set(q.key, i)}>{o}</Toggle>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ol className="grid gap-2.5" aria-live="polite">
        {routes.map((r, i) => (
          <li
            key={r.title}
            className={`grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1.5 rounded-2xl border bg-white p-4 transition-all ${
              open[i] ? 'border-[var(--ra)]' : 'border-[#1a1a1a]/10 opacity-50'
            } ${i === best ? 'ring-[3px] ring-[color-mix(in_srgb,var(--ra)_35%,transparent)]' : ''}`}
          >
            <h3 className="font-serif text-xl">
              {r.title}
              {i === best && (
                <span className="ml-2 inline-block rounded-full bg-[var(--ra)] px-2 py-1 align-middle font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--ra-ink)]">
                  Fastest for you
                </span>
              )}
            </h3>
            <span className="font-sans text-sm tabular-nums">{r.years ? `${r.years} yrs` : 'no wait'}</span>
            <span aria-hidden="true" className="col-span-2 block h-1.5 overflow-hidden rounded-full bg-[#1a1a1a]/10">
              <span className="block h-full bg-[var(--ra)] transition-[width] duration-500" style={{ width: open[i] ? `${Math.max(6, (r.years / maxYears) * 100)}%` : '0%' }} />
            </span>
            <ul className="col-span-2 grid gap-0.5 font-sans text-sm text-[#1a1a1a]/70">
              {r.reqs.map((q) => (
                <li key={q} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ra)]" />
                  {q}
                </li>
              ))}
            </ul>
            <p className="col-span-2 font-sans text-xs text-[#1a1a1a]/55">{r.note}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── Years roadmap ──────────────────────────────────────────────────────── */

/**
 * Copy for the years roadmap. Phase bodies may use {toPr}, {toCitizenship}
 * and {route}; they are filled in as the reader drags the slider. Copy only,
 * no functions, so the server page can pass it straight through.
 */
export interface RoadmapCopy {
  prep: { title: string; sub: string };
  arrive: { title: string; sub: string };
  /** Year the first permit is renewed, and the label for it. */
  extension: { year: number; title: string; sub: string };
  /** Residence years to citizenship, with and without the language requirement. Omit `withLanguage` where there is no shorter path. */
  citizenship: { years: number; withLanguage?: number; languageQuestion?: string };
  phases: {
    first: { title: string; body: string };
    extended: { title: string; body: string };
    resident: { title: string; body: string };
    citizen: { title: string; body: string };
  };
}

const fill = (t: string, v: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_, k: string) => v[k] ?? '');

export function YearsRoadmap({ stopId, routes, defaultRoute, copy }: { stopId: string; routes: PrRoute[]; defaultRoute: number; copy: RoadmapCopy }) {
  const { complete, prRoute, setPrRoute, flag } = useRoute();
  const [lang, setLang] = useState(false);
  const [year, setYear] = useState(0);
  const route = prRoute !== null && routes[prRoute].years > 0 ? prRoute : defaultRoute;
  const prY = routes[route].years;
  const citY = lang && copy.citizenship.withLanguage ? copy.citizenship.withLanguage : copy.citizenship.years;
  const maxY = Math.max(copy.citizenship.years, prY);
  const pos = (y: number) => 15 + (y / maxY) * 75;
  const more = (n: number) => `${n} more year${n > 1 ? 's' : ''}`;
  const vars = { toPr: more(prY - year), toCitizenship: more(citY - year), route: routes[route].title.toLowerCase() };

  const marks = [
    { id: 'prep', at: 10, y: -1, up: true, big: false, t: copy.prep.title, s: copy.prep.sub },
    { id: 'arrive', at: pos(0), y: 0, up: false, big: false, t: copy.arrive.title, s: copy.arrive.sub },
    { id: 'ext', at: pos(copy.extension.year), y: copy.extension.year, up: true, big: false, t: copy.extension.title, s: copy.extension.sub },
    { id: 'pr', at: pos(prY), y: prY, up: false, big: false, t: 'Permanent residence', s: routes[route].title },
    { id: 'cit', at: pos(citY), y: citY, up: true, big: true, t: 'Citizenship', s: `${citY} years${lang && copy.citizenship.withLanguage ? ', with language' : ''}` },
  ];

  const phase =
    year < copy.extension.year ? copy.phases.first : year < prY ? copy.phases.extended : year < citY ? copy.phases.resident : copy.phases.citizen;

  const done = () => complete(stopId, 'Road mapped');

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end gap-x-8 gap-y-4">
        <div>
          <p className="mb-2 font-sans text-sm font-bold">Your permanent residence route</p>
          <div className="flex flex-wrap gap-1.5">
            {routes.map((r, i) =>
              r.years ? (
                <Toggle key={r.title} pressed={route === i} onClick={() => { setPrRoute(i); done(); }}>
                  {r.title} · {r.years}y
                </Toggle>
              ) : null,
            )}
          </div>
        </div>
        {copy.citizenship.withLanguage && (
          <div>
            <p className="mb-2 font-sans text-sm font-bold">{copy.citizenship.languageQuestion ?? 'Will you meet the language requirement?'}</p>
            <Switch on={lang} label={copy.citizenship.languageQuestion ?? 'Language requirement'} onClick={() => { setLang(!lang); done(); }} />
          </div>
        )}
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
        <label htmlFor={`${stopId}-year`} className="font-sans text-xs text-[#1a1a1a]/55">Years in the country</label>
        <input
          id={`${stopId}-year`}
          type="range"
          min={0}
          max={maxY}
          step={1}
          value={year}
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

/* ── Small helpers ──────────────────────────────────────────────────────── */

export function AuroraCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const x = c?.getContext('2d');
    if (!c || !x) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let t = 0;
    let raf = 0;
    const size = () => {
      c.width = c.offsetWidth;
      c.height = c.offsetHeight;
    };
    size();
    window.addEventListener('resize', size);
    const bands: [string, number, number][] = [['0,191,165', 0.22, 0], ['80,140,255', 0.14, 2], ['0,191,165', 0.12, 4]];
    const draw = () => {
      x.clearRect(0, 0, c.width, c.height);
      for (const [rgb, a, o] of bands) {
        const g = x.createLinearGradient(0, 0, 0, c.height);
        g.addColorStop(0, `rgba(${rgb},0)`);
        g.addColorStop(0.35, `rgba(${rgb},${a})`);
        g.addColorStop(0.8, `rgba(${rgb},0)`);
        x.fillStyle = g;
        x.beginPath();
        x.moveTo(0, c.height);
        for (let px = 0; px <= c.width; px += 16) x.lineTo(px, c.height * 0.25 + Math.sin(px / 180 + t + o) * 40 + Math.sin(px / 70 + t * 1.7 + o) * 14);
        x.lineTo(c.width, c.height);
        x.fill();
      }
      t += 0.006;
      if (!still) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
    };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full mix-blend-screen" />;
}

export function ParallaxLayer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        const box = el.parentElement?.getBoundingClientRect();
        if (box) el.style.transform = `translateY(${(box.top + box.height / 2 - window.innerHeight / 2) * -0.15}px)`;
        queued = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div ref={ref} className="absolute inset-x-0 -inset-y-[12%]">
      {children}
    </div>
  );
}

export function CopyButton({ value }: { value: string }) {
  const [label, setLabel] = useState('Copy');
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setLabel('Copied');
        } catch {
          setLabel('Copy failed');
        }
        setTimeout(() => setLabel('Copy'), 1800);
      }}
      className="rounded-full border border-white/30 px-3 py-1.5 font-sans text-xs text-white transition-colors hover:bg-white/10"
    >
      {label}
    </button>
  );
}

/** Completes a stop once the reader has opened `need` of its <details> answers. */
export function OpenedTracker({ stopId, need, message }: { stopId: string; need: number; message: string }) {
  const { complete } = useRoute();
  useEffect(() => {
    const root = document.getElementById(stopId);
    if (!root) return;
    const opened = new Set<EventTarget>();
    const onToggle = (e: Event) => {
      if (e.target instanceof HTMLDetailsElement && e.target.open) {
        opened.add(e.target);
        if (opened.size >= need) complete(stopId, message);
      }
    };
    root.addEventListener('toggle', onToggle, true);
    return () => root.removeEventListener('toggle', onToggle, true);
  }, [stopId, need, message, complete]);
  return null;
}
