'use client';

// ============================================================================
// Component: components/fa/PathQuiz.tsx
// The /fa/which-path hero and assessment. The headline and the numbers sit on
// one side; the quiz sits in a dark card on the other and starts at question
// one — no separate intro screen to click past. One question per step, pure
// scoring from lib/fa/path-quiz, a result painted in the destination's own
// colours with its flag, a few nearby routes from the atlas, and optional
// lead capture. Copy lives in content/fa/which-path.ts; this file only
// sequences it.
// ============================================================================
import React, { useState, useTransition, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Send, RotateCcw } from 'lucide-react';
import { Link } from '@/navigation';
import { remember } from '@/lib/fa/quiz-memory';
import { recommendPath, type QuizAnswers, type Recommendation } from '@/lib/fa/path-quiz';
import { ATLAS, NEARBY, atlasByKey, countryCount, openCount, type AtlasRoute } from '@/lib/fa/route-atlas';
import { flagFor } from '@/lib/fa/flags';
import { toPersianDigits as fa } from '@/lib/fa/format';
import { questions, ui, intro } from '@/content/fa/which-path';
import { sendWhichPathLead } from '@/app/[locale]/(public)/which-path/actions';
import { trackLead } from '@/lib/analytics';
import Flag from './Flag';
import { themeFor } from './faThemes';
import AtlasFlag from './AtlasFlag';

const input = 'w-full border border-[#1a1a1a]/30 bg-white px-4 py-3 outline-none focus:border-[#1a1a1a]';

export default function PathQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [result, setResult] = useState<Recommendation | null>(null);
  const [leadState, setLeadState] = useState<'idle' | 'done' | 'error'>('idle');
  const [pending, startTransition] = useTransition();
  const cardRef = useRef<HTMLDivElement>(null);

  // Remember the outcome so every guide can tell this reader whether it is
  // the route they were pointed at. Storage failures are swallowed inside
  // remember().
  useEffect(() => {
    if (result) remember({ href: result.href, title: result.title, at: new Date().toISOString() });
  }, [result]);

  const q = questions[step];
  const total = questions.length;
  const current = answers[q.id];

  // On a phone the card is below the fold of the headline; keep it in view
  // as the reader moves through it.
  const keepInView = () => cardRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });

  const choose = (value: QuizAnswers[keyof QuizAnswers]) => setAnswers((a) => ({ ...a, [q.id]: value }));

  const next = () => {
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      setResult(recommendPath(answers as QuizAnswers));
    }
    keepInView();
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setResult(null);
    setLeadState('idle');
    keepInView();
  };

  const submitLead = (form: FormData) => {
    for (const [k, v] of Object.entries(answers)) form.set(k, String(v));
    startTransition(async () => {
      const r = await sendWhichPathLead(form);
      if (r.success) trackLead('path_quiz', 'fa', r.eventId);
      setLeadState(r.success ? 'done' : 'error');
    });
  };

  const stats = [
    { n: countryCount, label: intro.stats.countries },
    { n: ATLAS.length, label: intro.stats.routes },
    { n: openCount, label: intro.stats.open },
  ];

  return (
    <>
      <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="lg:sticky lg:top-28">
          <span className="mb-6 inline-block bg-[#CCFF00] px-2 py-1 text-[11px] font-bold text-black">{intro.eyebrow}</span>
          <h1 className="mb-6 font-estedad text-4xl font-black leading-tight md:text-6xl">{intro.headline(fa(countryCount))}</h1>
          <p className="mb-8 max-w-[52ch] text-lg leading-relaxed text-[#1a1a1a]/75">{intro.sub}</p>
          <dl className="mb-8 flex gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-estedad text-4xl font-black leading-none">{fa(s.n)}</dd>
                <dd className="mt-2 text-xs text-[#1a1a1a]/65">{s.label}</dd>
              </div>
            ))}
          </dl>
          <FlagStrip />
          <p className="mt-8 max-w-md text-xs leading-6 text-[#1a1a1a]/60">{intro.privacy}</p>
        </div>

        <div ref={cardRef} className="scroll-mt-24">
          {result ? <Result result={result} onRestart={restart} /> : (
            <div className="bg-[#1a1a1a] p-6 text-[#F2F0E9] md:p-8">
              <Road step={step} total={total} />
              <p className="mb-2 text-xs font-bold text-[#F2F0E9]/65">{fa(ui.stepOf(step + 1, total))}</p>
              <h2 className="mb-2 font-estedad text-2xl font-black leading-snug md:text-3xl">{q.title}</h2>
              {q.hint && <p className="text-sm leading-7 text-[#F2F0E9]/70">{q.hint}</p>}

              <div role="radiogroup" aria-label={q.title} className="mt-6 grid gap-2">
                {q.options.map((o) => {
                  const selected = current === o.value;
                  return (
                    <button
                      key={String(o.value)}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => choose(o.value)}
                      className={`border p-4 text-start transition-colors duration-200 ${
                        selected ? 'border-[#CCFF00] bg-[#F2F0E9] text-[#1a1a1a]' : 'border-[#F2F0E9]/20 hover:border-[#F2F0E9]/60'
                      }`}
                    >
                      <span className="block font-bold">{o.label}</span>
                      {o.detail && <span className={`mt-0.5 block text-sm ${selected ? 'text-[#1a1a1a]/70' : 'text-[#F2F0E9]/65'}`}>{o.detail}</span>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  disabled={step === 0}
                  onClick={() => setStep(step - 1)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#F2F0E9]/70 hover:text-[#F2F0E9] disabled:invisible"
                >
                  <ArrowRight className="h-4 w-4" />
                  {ui.back}
                </button>
                <button
                  type="button"
                  disabled={current === undefined}
                  onClick={next}
                  className="group inline-flex items-center gap-3 bg-[#CCFF00] px-7 py-3.5 font-bold text-[#1a1a1a] transition-colors hover:bg-[#F2F0E9] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {step === total - 1 ? ui.finish : ui.next}
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {result && (
        <section className="mt-12 grid gap-8 border-t border-[#1a1a1a] pt-10 md:grid-cols-2">
          <div>
            <h3 className="mb-3 font-estedad text-2xl font-black md:text-3xl">{ui.lead.heading}</h3>
            <p className="max-w-xl leading-relaxed text-[#1a1a1a]/75">{ui.lead.body}</p>
          </div>
          {leadState === 'done' ? (
            <p className="self-start border-s-4 border-[#CCFF00] py-4 ps-6 font-bold">{ui.lead.done}</p>
          ) : (
            <form action={submitLead} className="grid gap-3">
              <input name="name" required placeholder={ui.lead.name} aria-label={ui.lead.name} className={input} />
              <input name="email" type="email" placeholder={ui.lead.email} aria-label={ui.lead.email} className={input} dir="ltr" />
              <input name="telegram" placeholder={ui.lead.telegram} aria-label={ui.lead.telegram} className={input} dir="ltr" />
              <div className="mt-1 flex flex-wrap items-center gap-4">
                <button type="submit" disabled={pending} className="inline-flex items-center gap-3 bg-[#1a1a1a] px-7 py-3.5 font-bold text-[#F2F0E9] transition-colors hover:bg-[#CCFF00] hover:text-black disabled:opacity-50">
                  {pending ? ui.lead.sending : ui.lead.submit}
                  <Send className="h-4 w-4" />
                </button>
                <a href={ui.lead.telegramUrl} target="_blank" rel="noopener noreferrer" className="border-b border-[#1a1a1a] pb-0.5 text-sm font-bold hover:border-[#1a1a1a]/40">
                  {ui.lead.telegramCta}
                </a>
              </div>
              {leadState === 'error' && <p className="text-sm text-[#b91c1c]">{ui.lead.error}</p>}
            </form>
          )}
          <p className="text-xs leading-6 text-[#1a1a1a]/60 md:col-span-2">{ui.disclaimer}</p>
        </section>
      )}
    </>
  );
}

/** Seven stops on a line: the questions done, the one open, the rest. */
function Road({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-6 flex items-center" aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className={`h-0.5 flex-1 transition-colors duration-300 ${i <= step ? 'bg-[#CCFF00]' : 'bg-[#F2F0E9]/20'}`} />}
          <span
            className={`h-3 w-3 shrink-0 rounded-full transition-colors duration-300 ${
              i < step ? 'bg-[#CCFF00]' : i === step ? 'bg-[#1a1a1a] ring-2 ring-[#CCFF00]' : 'bg-[#F2F0E9]/25'
            }`}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

/** Every flag the atlas carries, once each — what "14 countries" looks like. */
function FlagStrip() {
  const seen = new Set<string>();
  const one: AtlasRoute[] = [];
  for (const r of ATLAS) {
    const k = r.region === 'canada' ? 'canada' : r.key;
    if (!seen.has(k)) {
      seen.add(k);
      one.push(r);
    }
  }
  return (
    <a href="#atlas-heading" className="flex flex-wrap items-center gap-2" aria-label="رفتن به اطلس مسیرها">
      {one.map((r) => (
        <span key={r.key} className={r.status === 'closed' ? 'opacity-50 grayscale' : ''}>
          <AtlasFlag route={r} className="h-5" />
        </span>
      ))}
    </a>
  );
}

function Result({ result, onRestart }: { result: Recommendation; onRestart: () => void }) {
  const theme = themeFor(result.href);
  const code = flagFor(result.href);
  const nearby = NEARBY[result.path].map(atlasByKey).filter((r): r is AtlasRoute => Boolean(r));
  const tooEarly = result.path === 'too-early';
  return (
    <div
      style={{ '--rd': tooEarly ? '#1a1a1a' : theme.deep, '--ra': tooEarly ? '#CCFF00' : (theme.accentOnDark ?? theme.accent) } as React.CSSProperties}
      className="border-t-[6px] border-[var(--ra)] bg-[var(--rd)] p-6 text-[#F2F0E9] md:p-8"
    >
      <div className="mb-5 flex items-center gap-3">
        {code && <Flag code={code} className="h-8 w-auto text-[#F2F0E9]" />}
        <span className="text-xs font-bold text-[var(--ra)]">{ui.resultLabel}</span>
      </div>
      <h2 className="mb-5 font-estedad text-3xl font-black leading-tight md:text-4xl">{result.title}</h2>
      <p className="mb-8 leading-8 text-[#F2F0E9]/85">{result.why}</p>

      <div className="flex flex-wrap gap-3">
        <Link href={result.href} className="group inline-flex items-center gap-3 bg-[#F2F0E9] px-6 py-3.5 font-bold text-[#1a1a1a] transition-colors hover:bg-[#CCFF00]">
          {ui.readMore}
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        </Link>
        <button type="button" onClick={onRestart} className="inline-flex items-center gap-2 border border-[#F2F0E9]/40 px-5 py-3 text-sm font-bold transition-colors hover:border-[#F2F0E9]">
          <RotateCcw className="h-4 w-4" />
          {ui.restart}
        </button>
      </div>

      {nearby.length > 0 && (
        <div className="mt-8 border-t border-[#F2F0E9]/15 pt-6">
          <p className="mb-3 text-xs font-bold text-[#F2F0E9]/70">{ui.nearby}</p>
          <ul className="flex flex-wrap gap-2">
            {nearby.map((r) => (
              <li key={r.key}>
                <Link href={r.href} className="inline-flex items-center gap-2 border border-[#F2F0E9]/20 bg-[#F2F0E9]/5 px-3 py-2 text-sm font-bold transition-colors hover:border-[#F2F0E9]/60">
                  <AtlasFlag route={r} className="h-4" />
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
