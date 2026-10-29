'use client';

// ============================================================================
// app/[locale]/(public)/which-path/WhichPathQuizEn.tsx
// The English assessment. Same sequencing as components/fa/PathQuiz.tsx (one
// question per screen, the shared scorer, a result with its reason, optional
// lead capture), with English copy from ./en-copy and left-to-right arrows.
//
// Two deliberate differences from the Persian quiz:
//  - The page's H1 lives in the server-rendered hero, so this component never
//    renders one; its screens use H2.
//  - It does not call lib/fa/quiz-memory's remember(). That store greets
//    readers on the Persian guides with a Persian title and a Persian guide
//    path; writing an English result into it would greet them wrongly.
// ============================================================================
import React, { useState, useTransition } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Send } from 'lucide-react';
import { Link } from '@/routing';
import type { QuizAnswers } from '@/lib/fa/path-quiz';
import { trackLead } from '@/lib/analytics';
import { sendWhichPathLead } from './actions';
import { enIntro, enQuestions, enUi, recommendPathEn, type EnRecommendation } from './en-copy';

type Stage = 'intro' | 'quiz' | 'result';

const btnDark =
  'inline-flex items-center gap-3 rounded-full bg-[#1a1a1a] px-7 py-4 font-sans text-sm font-bold text-[#F2F0E9] transition-colors hover:bg-[#CCFF00] hover:text-[#1a1a1a]';

export default function WhichPathQuizEn() {
  const [stage, setStage] = useState<Stage>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [result, setResult] = useState<EnRecommendation | null>(null);
  const [leadState, setLeadState] = useState<'idle' | 'done' | 'error'>('idle');
  const [pending, startTransition] = useTransition();

  const q = enQuestions[step];
  const total = enQuestions.length;
  const current = answers[q.id];

  const choose = (value: QuizAnswers[keyof QuizAnswers]) => setAnswers((a) => ({ ...a, [q.id]: value }));

  const next = () => {
    if (step < total - 1) {
      setStep(step + 1);
      return;
    }
    setResult(recommendPathEn(answers as QuizAnswers));
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
    form.set('locale', 'en');
    startTransition(async () => {
      try {
        const r = await sendWhichPathLead(form);
        if (r.success) trackLead('path_quiz', 'en', r.eventId);
        setLeadState(r.success ? 'done' : 'error');
      } catch {
        setLeadState('error');
      }
    });
  };

  if (stage === 'intro') {
    return (
      <div className="max-w-3xl">
        <span className="mb-6 inline-block bg-[#CCFF00] px-2 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a]">{enIntro.eyebrow}</span>
        <ol className="mb-8 grid gap-1 font-sans text-[15px] text-[#1a1a1a]/70 sm:grid-cols-2">
          {enQuestions.map((x, i) => (
            <li key={x.id} className="flex gap-2">
              <span className="tabular-nums text-[#1a1a1a]/40">{i + 1}.</span>
              {x.title}
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => setStage('quiz')} className={`group ${btnDark} px-8 py-5 text-base`}>
          {enIntro.start}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
        <p className="mt-6 max-w-md font-sans text-xs text-[#1a1a1a]/55">{enIntro.privacy}</p>
      </div>
    );
  }

  if (stage === 'quiz') {
    return (
      <div className="max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <span className="font-sans text-xs font-bold tabular-nums text-[#1a1a1a]/55" aria-live="polite">
            {enUi.stepOf(step + 1, total)}
          </span>
          <div className="flex gap-1" aria-hidden="true">
            {enQuestions.map((_, i) => (
              <span key={i} className={`h-1 w-6 sm:w-8 ${i <= step ? 'bg-[#1a1a1a]' : 'bg-[#1a1a1a]/15'}`} />
            ))}
          </div>
        </div>

        <h2 className="mb-3 font-serif text-3xl leading-tight md:text-4xl">{q.title}</h2>
        {q.hint && <p className="font-sans text-sm text-[#1a1a1a]/60">{q.hint}</p>}

        <div role="radiogroup" aria-label={q.title} className="mt-8 grid gap-px border border-[#1a1a1a]/20 bg-[#1a1a1a]/20">
          {q.options.map((o) => {
            const selected = current === o.value;
            return (
              <button
                key={String(o.value)}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => choose(o.value)}
                className={`p-5 text-left transition-colors sm:p-6 ${selected ? 'bg-[#1a1a1a] text-[#F2F0E9]' : 'bg-[#F2F0E9] hover:bg-[#1a1a1a]/5'}`}
              >
                <span className="block font-sans text-lg font-bold">{o.label}</span>
                {o.detail && <span className={`mt-1 block font-sans text-sm ${selected ? 'text-[#F2F0E9]/70' : 'text-[#1a1a1a]/55'}`}>{o.detail}</span>}
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => (step === 0 ? setStage('intro') : setStep(step - 1))}
            className="inline-flex items-center gap-2 font-sans text-sm font-bold text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
          >
            <ArrowLeft className="h-4 w-4" />
            {enUi.back}
          </button>
          <button
            type="button"
            disabled={current === undefined}
            onClick={next}
            className={`group ${btnDark} disabled:cursor-not-allowed disabled:opacity-30`}
          >
            {step === total - 1 ? enUi.finish : enUi.next}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="max-w-3xl">
      <span className="mb-6 inline-block bg-[#CCFF00] px-2 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a]">{enUi.resultLabel}</span>
      <h2 className="mb-6 font-serif text-4xl leading-tight md:text-6xl" data-result={result.path}>
        {result.title}
      </h2>
      <p className="mb-6 font-sans text-lg leading-relaxed text-[#1a1a1a]/80 md:text-xl">{result.why}</p>
      {result.note && (
        <p className="mb-8 border-l-4 border-[#1a1a1a] bg-white px-4 py-3 font-sans text-sm text-[#1a1a1a]/75">
          <strong className="text-[#1a1a1a]">Note for applicants from sanctioned countries.</strong> {result.note}
        </p>
      )}

      <div className="mb-16 flex flex-wrap gap-4">
        <Link href={result.href} className={`group ${btnDark} px-8 py-5`}>
          {enUi.readMore}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
        <button
          type="button"
          onClick={restart}
          className="inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] px-6 py-4 font-sans text-sm font-bold transition-colors hover:bg-[#1a1a1a] hover:text-[#F2F0E9]"
        >
          <RotateCcw className="h-4 w-4" />
          {enUi.restart}
        </button>
      </div>

      <section aria-labelledby="lead-h" className="border-t border-[#1a1a1a] pt-12">
        <h3 id="lead-h" className="mb-4 font-serif text-2xl md:text-3xl">{enUi.lead.heading}</h3>
        <p className="mb-8 max-w-xl font-sans leading-relaxed text-[#1a1a1a]/70">{enUi.lead.body}</p>

        {leadState === 'done' ? (
          <p className="border-l-4 border-[#CCFF00] py-4 pl-6 font-sans font-bold" role="status">{enUi.lead.done}</p>
        ) : (
          <form action={submitLead} className="grid max-w-xl gap-4">
            <label className="grid gap-1 font-sans text-xs font-bold text-[#1a1a1a]/60">
              {enUi.lead.name}
              <input name="name" required autoComplete="name" className="border border-[#1a1a1a]/30 bg-white px-4 py-3 text-base font-normal text-[#1a1a1a] outline-none focus:border-[#1a1a1a]" />
            </label>
            <label className="grid gap-1 font-sans text-xs font-bold text-[#1a1a1a]/60">
              {enUi.lead.email}
              <input name="email" type="email" autoComplete="email" className="border border-[#1a1a1a]/30 bg-white px-4 py-3 text-base font-normal text-[#1a1a1a] outline-none focus:border-[#1a1a1a]" />
            </label>
            <label className="grid gap-1 font-sans text-xs font-bold text-[#1a1a1a]/60">
              {enUi.lead.telegram}
              <input name="telegram" className="border border-[#1a1a1a]/30 bg-white px-4 py-3 text-base font-normal text-[#1a1a1a] outline-none focus:border-[#1a1a1a]" />
            </label>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <button type="submit" disabled={pending} className={`${btnDark} disabled:opacity-50`}>
                {pending ? enUi.lead.sending : enUi.lead.submit}
                <Send className="h-4 w-4" />
              </button>
              <a
                href={enUi.lead.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-[#1a1a1a] pb-0.5 font-sans text-sm font-bold hover:border-[#1a1a1a]/40 hover:text-[#1a1a1a]/60"
              >
                {enUi.lead.telegramCta}
              </a>
            </div>
            {leadState === 'error' && <p className="font-sans text-sm text-[#b91c1c]" role="alert">{enUi.lead.error}</p>}
          </form>
        )}
      </section>

      <p className="mt-12 max-w-xl font-sans text-xs text-[#1a1a1a]/55">{enUi.disclaimer}</p>
    </div>
  );
}
