'use client';

// ============================================================================
// Component: components/fa/PathQuiz.tsx
// The /fa/which-path assessment. One question per screen, pure scoring from
// lib/fa/path-quiz, result with reasoning, optional lead capture. Copy lives
// in content/fa/which-path.ts; this file only sequences it.
// ============================================================================
import React, { useState, useTransition, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Send, RotateCcw } from 'lucide-react';
import { Link } from '@/navigation';
import { remember } from '@/lib/fa/quiz-memory';
import { recommendPath, type QuizAnswers, type Recommendation } from '@/lib/fa/path-quiz';
import { toPersianDigits } from '@/lib/fa/format';
import { questions, ui, intro } from '@/content/fa/which-path';
import { sendWhichPathLead } from '@/app/[locale]/(public)/which-path/actions';

type Stage = 'intro' | 'quiz' | 'result';

export default function PathQuiz() {
  const [stage, setStage] = useState<Stage>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [result, setResult] = useState<Recommendation | null>(null);
  const [leadState, setLeadState] = useState<'idle' | 'done' | 'error'>('idle');
  const [pending, startTransition] = useTransition();

  // Remember the outcome so every guide can tell this reader whether it is
  // the route they were pointed at. Declared with the other hooks, above
  // every early return, and a no-op until a result exists. Storage failures
  // are swallowed inside remember().
  useEffect(() => {
    if (result) remember({ href: result.href, title: result.title, at: new Date().toISOString() });
  }, [result]);

  const q = questions[step];
  const total = questions.length;
  const current = answers[q.id];

  const choose = (value: QuizAnswers[keyof QuizAnswers]) => setAnswers((a) => ({ ...a, [q.id]: value }));

  const next = () => {
    if (step < total - 1) {
      setStep(step + 1);
      return;
    }
    setResult(recommendPath(answers as QuizAnswers));
    setStage('result');
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setResult(null);
    setLeadState('idle');
    setStage('intro');
  };

  const submitLead = (form: FormData) => {
    for (const [k, v] of Object.entries(answers)) form.set(k, String(v));
    startTransition(async () => {
      const r = await sendWhichPathLead(form);
      setLeadState(r.success ? 'done' : 'error');
    });
  };

  if (stage === 'intro') {
    return (
      <div className="max-w-3xl">
        <span className="inline-block text-[11px] font-bold text-black bg-[#CCFF00] px-2 py-1 mb-6">{intro.eyebrow}</span>
        <h1 className="font-estedad font-black text-4xl md:text-6xl leading-tight mb-8">{intro.headline}</h1>
        <p className="text-lg md:text-xl leading-relaxed text-[#1a1a1a]/70 mb-10">{intro.sub}</p>
        <button
          type="button"
          onClick={() => setStage('quiz')}
          className="group inline-flex items-center gap-4 bg-[#1a1a1a] text-[#F2F0E9] px-8 py-5 hover:bg-[#CCFF00] hover:text-black transition-colors duration-300 font-bold"
        >
          {intro.start}
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <p className="mt-8 text-xs text-[#1a1a1a]/50 max-w-md">{intro.privacy}</p>
      </div>
    );
  }

  if (stage === 'quiz') {
    return (
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs font-bold text-[#1a1a1a]/50">{toPersianDigits(ui.stepOf(step + 1, total))}</span>
          <div className="flex gap-1" aria-hidden>
            {questions.map((_, i) => (
              <span key={i} className={`h-1 w-8 ${i <= step ? 'bg-[#1a1a1a]' : 'bg-[#1a1a1a]/15'}`}></span>
            ))}
          </div>
        </div>

        <h2 className="font-estedad font-black text-3xl md:text-4xl leading-tight mb-3">{q.title}</h2>
        {q.hint && <p className="text-sm text-[#1a1a1a]/60 mb-8">{q.hint}</p>}

        <div role="radiogroup" aria-label={q.title} className="grid gap-px bg-[#1a1a1a]/20 border border-[#1a1a1a]/20 mt-8">
          {q.options.map((o) => {
            const selected = current === o.value;
            return (
              <button
                key={String(o.value)}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => choose(o.value)}
                className={`text-start p-6 transition-colors ${selected ? 'bg-[#1a1a1a] text-[#F2F0E9]' : 'bg-[#F2F0E9] hover:bg-[#1a1a1a]/5'}`}
              >
                <span className="block font-bold text-lg">{o.label}</span>
                {o.detail && <span className={`block text-sm mt-1 ${selected ? 'text-[#F2F0E9]/60' : 'text-[#1a1a1a]/50'}`}>{o.detail}</span>}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-10">
          <button
            type="button"
            onClick={() => (step === 0 ? setStage('intro') : setStep(step - 1))}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
          >
            <ArrowRight className="w-4 h-4" />
            {ui.back}
          </button>
          <button
            type="button"
            disabled={current === undefined}
            onClick={next}
            className="group inline-flex items-center gap-3 bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#CCFF00] hover:text-black transition-colors"
          >
            {step === total - 1 ? ui.finish : ui.next}
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="max-w-3xl">
      <span className="inline-block text-[11px] font-bold text-black bg-[#CCFF00] px-2 py-1 mb-6">{ui.resultLabel}</span>
      <h2 className="font-estedad font-black text-4xl md:text-6xl leading-tight mb-8">{result.title}</h2>
      <p className="text-lg md:text-xl leading-[1.9] text-[#1a1a1a]/80 mb-10">{result.why}</p>

      <div className="flex flex-wrap gap-4 mb-16">
        <Link href={result.href} className="group inline-flex items-center gap-4 bg-[#1a1a1a] text-[#F2F0E9] px-8 py-5 font-bold hover:bg-[#CCFF00] hover:text-black transition-colors">
          {ui.readMore}
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <button type="button" onClick={restart} className="inline-flex items-center gap-2 border border-[#1a1a1a] px-6 py-4 font-bold text-sm hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
          <RotateCcw className="w-4 h-4" />
          {ui.restart}
        </button>
      </div>

      <section className="border-t border-[#1a1a1a] pt-12">
        <h3 className="font-estedad font-black text-2xl md:text-3xl mb-4">{ui.lead.heading}</h3>
        <p className="text-[#1a1a1a]/70 leading-relaxed mb-8 max-w-xl">{ui.lead.body}</p>

        {leadState === 'done' ? (
          <p className="border-s-4 border-[#CCFF00] ps-6 py-4 font-bold">{ui.lead.done}</p>
        ) : (
          <form action={submitLead} className="grid gap-4 max-w-xl">
            <input name="name" required placeholder={ui.lead.name} className="border border-[#1a1a1a]/30 bg-transparent px-4 py-3 focus:border-[#1a1a1a] outline-none" />
            <input name="email" type="email" placeholder={ui.lead.email} className="border border-[#1a1a1a]/30 bg-transparent px-4 py-3 focus:border-[#1a1a1a] outline-none" dir="ltr" />
            <input name="telegram" placeholder={ui.lead.telegram} className="border border-[#1a1a1a]/30 bg-transparent px-4 py-3 focus:border-[#1a1a1a] outline-none" dir="ltr" />
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <button type="submit" disabled={pending} className="inline-flex items-center gap-3 bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-bold disabled:opacity-50 hover:bg-[#CCFF00] hover:text-black transition-colors">
                {pending ? ui.lead.sending : ui.lead.submit}
                <Send className="w-4 h-4" />
              </button>
              <a href={ui.lead.telegramUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold border-b border-[#1a1a1a] pb-0.5 hover:text-[#CCFF00] hover:border-[#CCFF00]">
                {ui.lead.telegramCta}
              </a>
            </div>
            {leadState === 'error' && <p className="text-sm text-[#b91c1c]">{ui.lead.error}</p>}
          </form>
        )}
      </section>

      <p className="mt-12 text-xs text-[#1a1a1a]/50 max-w-xl">{ui.disclaimer}</p>
    </div>
  );
}
