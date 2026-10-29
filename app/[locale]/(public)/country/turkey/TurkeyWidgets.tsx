'use client';
// ============================================================================
// Component: app/[locale]/(public)/country/turkey/TurkeyWidgets.tsx
// Türkiye-only games for the route guide. The shared GateQuiz carries Finland's
// result copy (a "refusal stays on record" line this page cannot source), and
// ApprovalDots shows a rate out of 100 where Türkiye only has a count. So this
// file keeps the same look and CSS variables with copy built from the page's
// own facts. All copy arrives as props or is rendered on the server pass, so
// the text is in the HTML whether or not the game ever runs.
// ============================================================================
import React, { useEffect, useRef, useState } from 'react';
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

/* ── The jury's four tests ──────────────────────────────────────────────── */

export function JuryQuiz({ stopId, criteria, children }: { stopId: string; criteria: { title: string; body: string }[]; children?: React.ReactNode }) {
  const { complete } = useRoute();
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const answered = Object.keys(answers).length;
  const yes = Object.values(answers).filter(Boolean).length;
  const missing = criteria.filter((_, i) => answers[i] === false).map((c) => (/^[A-Z](?![A-Z&])/.test(c.title) ? c.title[0].toLowerCase() + c.title.slice(1) : c.title));

  useEffect(() => {
    if (answered === criteria.length) complete(stopId, 'Jury test checked');
  }, [answered, criteria.length, complete, stopId]);

  let title = `${answered} of ${criteria.length} answered`;
  let body = 'Each "not yet" is a part of your file to fix before you apply.';
  if (answered === criteria.length) {
    if (yes === criteria.length) {
      title = 'Strong on paper';
      body = 'You meet all four tests as you describe them. What decides it now is the jury: technological innovation, scalability and R&D capacity, with what Türkiye gains written into the plan.';
    } else if (yes >= 2) {
      title = 'Close, with gaps';
      body = `Fix before applying: ${missing.join(', ')}. Twenty-two startups were admitted in eighteen months; go with a real file rather than a hopeful one.`;
    } else {
      title = 'Not ready yet';
      body = `Missing: ${missing.join(', ')}. Technopark juries set traditional and service businesses aside at the assessment stage.`;
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <ol className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        {criteria.map((c, i) => (
          <li key={c.title} className="grid gap-1.5 border-b border-dashed border-[#1a1a1a]/10 py-4 first:pt-0 last:border-0 last:pb-0">
            <h3 className="font-serif text-xl">{c.title}</h3>
            <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]/65">{c.body}</p>
            <div className="mt-1 flex gap-1.5">
              <Toggle pressed={answers[i] === true} onClick={() => setAnswers((p) => ({ ...p, [i]: true }))}>We have this</Toggle>
              <Toggle pressed={answers[i] === false} onClick={() => setAnswers((p) => ({ ...p, [i]: false }))}>Not yet</Toggle>
            </div>
          </li>
        ))}
      </ol>
      <div className="grid content-start gap-4 self-start rounded-2xl border border-[#1a1a1a]/10 bg-white p-6 lg:sticky lg:top-20">
        <div aria-live="polite">
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

/* ── Twenty-two dots ────────────────────────────────────────────────────── */

/** One dot per foreign startup admitted, 16 Sep 2024 – 3 Mar 2026. A count, not a rate: no denominator is published. */
export function IntakeDots({ count = 22, dark = false }: { count?: number; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);
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
    <div ref={ref} aria-hidden="true" className="grid max-w-[300px] grid-cols-[repeat(11,minmax(0,1fr))] gap-1.5">
      {Array.from({ length: count }, (_, i) => (
        <i
          key={i}
          className={`aspect-square rounded-full ${dark ? 'bg-[#ff5a63]' : 'bg-[var(--ra)]'} ${play ? 'motion-safe:animate-pop' : ''}`}
          style={{ animationDelay: `${i * 40}ms` }}
        />
      ))}
    </div>
  );
}

/* ── Team size against the two general rules ────────────────────────────── */

export function TeamCheck({ stopId }: { stopId: string }) {
  const { complete } = useRoute();
  const [n, setN] = useState<number | null>(null);

  const pick = (v: number) => {
    setN(v);
    complete(stopId, 'Team sized');
  };

  let verdict = 'Pick a team size to see how the two rules land on it.';
  let tone: 'ok' | 'warn' | 'no' | null = null;
  if (n !== null) {
    if (n > 5) {
      tone = 'no';
      verdict = 'Not possible. Each foreign partner needs at least 20% of the shares, which caps a foreign founding team at five.';
    } else if (n > 3) {
      tone = 'warn';
      verdict = 'Allowed by the 20% rule, but practice is teams of up to three: every member’s role has to be specialist and defensible, and padding a team raises jury scrutiny.';
    } else {
      tone = 'ok';
      verdict = 'Within the usual practice of teams of up to three. Equal splits are not required; each foreign partner only needs at least 20%.';
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div className="grid content-start gap-4 rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        <p className="font-sans text-sm font-bold">How many foreign founders?</p>
        <div className="flex flex-wrap gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((v) => (
            <Toggle key={v} pressed={n === v} onClick={() => pick(v)}>
              {v === 6 ? '6+' : v}
            </Toggle>
          ))}
        </div>
        <p
          aria-live="polite"
          className={`rounded-lg px-3 py-2.5 font-sans text-sm leading-relaxed ${
            tone === 'no' ? 'bg-[#FBEBDD]' : tone === 'warn' ? 'bg-[#FBEBDD]/60' : 'bg-[var(--rs)]'
          }`}
        >
          {verdict}
        </p>
      </div>
      <div className="grid content-start gap-3 rounded-2xl bg-[var(--rd)] p-6 font-sans text-sm leading-relaxed text-white/70">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff5a63]">Each foreign partner</p>
        <p className="font-serif text-3xl text-white">20% · TRY 500,000</p>
        <p>At least 20% of the shares and at least TRY 500,000 of capital, unless the individual’s capital share is USD 100,000 or more.</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-[#ff5a63]">If the hiring rule applies</p>
        <p className="font-serif text-3xl text-white">5 : 1</p>
        <p>
          Five Turkish citizens per foreign employee, from the seventh month.
          {n === 3 ? ' For your three founders, “exempt” against “treated flexibly” is zero hires against fifteen.' : ''}
        </p>
      </div>
    </div>
  );
}

/* ── Read-to-the-end checkpoint ─────────────────────────────────────────── */

/**
 * RouteStop's completeOn="view" waits for half the section to be on screen,
 * which a section taller than two screens (two of these stops on a phone)
 * never reaches. This sentinel sits at the end of the stop and completes it
 * once the reader scrolls that far.
 */
export function ReadTracker({ stopId, message }: { stopId: string; message: string }) {
  const { complete } = useRoute();
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        timer = setTimeout(() => complete(stopId, message), 600);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [stopId, message, complete]);
  return <span ref={ref} aria-hidden="true" className="block h-px" />;
}
