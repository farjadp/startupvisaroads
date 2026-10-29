'use client';
// ============================================================================
// Component: components/fa/FaRoute.tsx
// The interactive parts of a Persian guide, in the same design as the English
// guides (components/route): a section that completes when read, the
// requirements self-check, the step walker and a copy button. All copy is
// rendered by the server and passed in; these only add state.
// ============================================================================
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useRoute } from '@/components/route/RouteProgress';

const FA = '۰۱۲۳۴۵۶۷۸۹';
export const fa = (n: number | string) => String(n).replace(/\d/g, (d) => FA[Number(d)]);
/** «۱، ۲ و ۳» */
const faList = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join('، ')} و ${xs[xs.length - 1]}`);

/** One stop of a Persian guide, completed on view or when its detail is opened. */
export function FaStop({ id, message, className, children }: { id: string; message: string; className?: string; children: React.ReactNode }) {
  const { complete } = useRoute();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    // Seen = half the section, or half the screen for a section taller than two screens.
    const io = new IntersectionObserver(
      ([e]) => {
        const need = Math.min(e.boundingClientRect.height, window.innerHeight) * 0.5;
        if (e.isIntersecting && e.intersectionRect.height >= need) {
          timer = setTimeout(() => complete(id, message), 1500);
          io.disconnect();
        }
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    );
    io.observe(el);
    const onToggle = (e: Event) => {
      if (e.target instanceof HTMLDetailsElement && e.target.open) complete(id, message);
    };
    el.addEventListener('toggle', onToggle, true);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      el.removeEventListener('toggle', onToggle, true);
    };
  }, [id, message, complete]);

  return (
    <section ref={ref} id={id} aria-labelledby={`${id}-q`} className={className}>
      {children}
    </section>
  );
}

/** The tick beside a stop's task line, filled once the stop is complete. */
export function FaTick({ id, dark = false }: { id: string; dark?: boolean }) {
  const { done } = useRoute();
  const isDone = done.has(id);
  return (
    <span
      className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-[1.5px] transition-colors ${
        isDone ? 'border-[var(--ra)] bg-[var(--ra)] text-[var(--ra-ink)]' : dark ? 'border-white/50' : 'border-[#1a1a1a]/40'
      }`}
    >
      {isDone && <Check className="h-3 w-3" strokeWidth={3} />}
    </span>
  );
}

function Toggle({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
        pressed ? 'border-[var(--rp)] bg-[var(--rp)] text-white' : 'border-[#1a1a1a]/15 bg-[#F2F0E9] hover:border-[var(--rp)]'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * A requirements list the reader checks themselves against — the Persian
 * twin of the English GateQuiz. The conditions are the section's own bullets.
 */
export function FaCheck({ stopId, items }: { stopId: string; items: string[] }) {
  const { complete } = useRoute();
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const total = items.length;
  const answered = Object.keys(answers).length;
  const yes = Object.values(answers).filter(Boolean).length;
  const gaps = items.map((_, i) => i).filter((i) => answers[i] === false);

  useEffect(() => {
    if (answered === total) complete(stopId, 'شرایط را با خودتان سنجیدید');
  }, [answered, total, complete, stopId]);

  let title = `${fa(answered)} از ${fa(total)} پاسخ داده شد`;
  let body = 'هر «هنوز نه» بخشی از پرونده است که پیش از درخواست باید درست شود.';
  if (answered === total) {
    if (yes === total) {
      title = 'روی کاغذ آماده‌اید';
      body = 'همه‌ی شرط‌ها را دارید. قدم بعد این است که هر کدام را با مدرک نشان دهید؛ پرونده باید معلوم کند کار خود شماست.';
    } else if (yes * 2 >= total) {
      title = 'نزدیک، با چند کمبود';
      body = `پیش از درخواست، شرط${gaps.length > 1 ? '‌های' : ''} ${faList(gaps.map((g) => fa(g + 1)))} را درست کنید. ردشدن در سابقه می‌ماند و درخواست بعدی را سخت‌تر می‌کند.`;
    } else {
      title = 'هنوز آماده نیست';
      body = 'با این وضعیت، درخواست بیشتر وقت و هزینه می‌سوزاند. ارزیابی رایگان مسیر شاید مسیر مناسب‌تری نشان دهد.';
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <ol className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
        {items.map((t, i) => (
          <li key={i} className="grid gap-2 border-b border-dashed border-[#1a1a1a]/10 py-4 first:pt-0 last:border-0 last:pb-0">
            <p className="text-base leading-[1.9] text-[#1a1a1a]/80">
              <span className="me-2 font-estedad font-black text-[var(--ra-text)]">{fa(i + 1)}.</span>
              {t}
            </p>
            <div className="flex gap-1.5">
              <Toggle pressed={answers[i] === true} onClick={() => setAnswers((p) => ({ ...p, [i]: true }))}>داریم</Toggle>
              <Toggle pressed={answers[i] === false} onClick={() => setAnswers((p) => ({ ...p, [i]: false }))}>هنوز نه</Toggle>
            </div>
          </li>
        ))}
      </ol>
      <div className="grid content-start gap-4 self-start rounded-2xl border border-[#1a1a1a]/10 bg-white p-6 lg:sticky lg:top-44" aria-live="polite">
        <p className="text-xs font-bold text-[var(--ra-text)]">آمادگی شما</p>
        <div className="h-3 overflow-hidden rounded-full bg-[#1a1a1a]/10">
          <div className="h-full bg-gradient-to-l from-[#B4531A] to-[var(--ra)] transition-[width] duration-500" style={{ width: `${(yes / total) * 100}%` }} />
        </div>
        <p className="font-estedad text-2xl font-black">{title}</p>
        <p className="text-sm leading-[1.9] text-[#1a1a1a]/65">{body}</p>
      </div>
    </div>
  );
}

export type FaStep = { n: string; title: string; body: string };

/** The Persian twin of the English StepWalker: a track of numbered steps, one card open. */
export function FaSteps({ stopId, steps }: { stopId: string; steps: FaStep[] }) {
  const { complete } = useRoute();
  const [cur, setCur] = useState(0);
  const [seen, setSeen] = useState(0);
  const last = steps.length - 1;
  const go = (i: number) => {
    const n = Math.max(0, Math.min(last, i));
    setCur(n);
    setSeen((s) => Math.max(s, n));
    if (n === last) complete(stopId, 'همه‌ی مراحل را دیدید');
  };
  return (
    <div>
      <div aria-hidden="true" className="relative mb-5 flex justify-between gap-1">
        <span className="absolute inset-x-5 top-[22px] h-0.5 bg-[#1a1a1a]/10" />
        <span
          className="absolute start-5 top-[22px] h-0.5 bg-[var(--ra)] transition-[width] duration-500"
          style={{ width: `calc((100% - 2.5rem) * ${cur / Math.max(last, 1)})` }}
        />
        {steps.map((_, i) => (
          <button key={i} type="button" tabIndex={-1} onClick={() => go(i)} className="relative">
            <span
              className={`grid h-11 w-11 place-items-center rounded-full border-2 font-estedad text-base font-black transition-all ${
                i === cur ? 'scale-110 border-[var(--ra)] bg-[var(--ra)] text-[var(--ra-ink)]' : i <= seen ? 'border-[var(--ra)] bg-white' : 'border-[#1a1a1a]/10 bg-white'
              }`}
            >
              {fa(i + 1)}
            </span>
          </button>
        ))}
      </div>
      <ol className="grid gap-3">
        {steps.map((s, i) => (
          <li key={i} className={`rounded-2xl border border-[#1a1a1a]/10 bg-white p-6 ${i === cur ? 'motion-safe:animate-fade-up' : 'hidden'}`}>
            <p className="text-xs font-bold text-[var(--ra-text)]">
              مرحله‌ی {fa(i + 1)} از {fa(steps.length)}
            </p>
            <h3 className={`mt-1 font-estedad font-black leading-snug ${s.title.length > 70 ? 'text-xl' : 'text-2xl'} ${s.body ? 'mb-2' : ''}`}>{s.title}</h3>
            {s.body && <p className="max-w-[68ch] text-base leading-[1.9] text-[#1a1a1a]/75">{s.body}</p>}
          </li>
        ))}
      </ol>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => go(cur - 1)} disabled={cur === 0} className="inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] px-5 py-2.5 text-sm font-bold disabled:opacity-30">
          <ArrowRight className="h-4 w-4" /> قبلی
        </button>
        <button type="button" onClick={() => go(cur + 1)} className="inline-flex items-center gap-2 rounded-full bg-[var(--ra)] px-5 py-2.5 text-sm font-bold text-[var(--ra-ink)] transition-transform hover:-translate-y-0.5">
          {cur === last ? (<>تمام <Check className="h-4 w-4" /></>) : (<>مرحله‌ی بعد <ArrowLeft className="h-4 w-4" /></>)}
        </button>
      </div>
    </div>
  );
}

export function FaCopy({ value }: { value: string }) {
  const [label, setLabel] = useState('کپی');
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setLabel('کپی شد');
        } catch {
          setLabel('کپی نشد');
        }
        setTimeout(() => setLabel('کپی'), 1800);
      }}
      className="rounded-full border border-white/30 px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/10"
    >
      {label}
    </button>
  );
}
