'use client';
// ============================================================================
// Component: components/fa/FaRoute.tsx
// The progress layer for the Persian guides: each section of a guide is a
// stop, completed when the reader has seen it or opened its detail. The copy
// itself is rendered by FaPageLayout on the server; this file only adds state.
// ============================================================================
import React, { useEffect, useRef } from 'react';
import { useRoute } from '@/components/route/RouteProgress';

/** One section of a Persian guide, completed on view or when its detail is opened. */
export function FaStop({ id, message, className, children }: { id: string; message: string; className?: string; children: React.ReactNode }) {
  const { complete } = useRoute();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    // Seen = half the section, or half the screen for a section taller than
    // two screens, held for a moment so a fast scroll past does not count.
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
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}

const FA = '۰۱۲۳۴۵۶۷۸۹';
const fa = (n: number) => String(n).replace(/\d/g, (d) => FA[Number(d)]);
/** «۱، ۲ و ۳» */
const faList = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join('، ')} و ${xs[xs.length - 1]}`);

/**
 * A requirements list the reader checks themselves against. The conditions
 * are the section's own bullets, rendered in full on the server; the buttons
 * and the verdict panel only add the self-check.
 */
export function FaCheck({ stopId, items }: { stopId: string; items: string[] }) {
  const { complete } = useRoute();
  const [answers, setAnswers] = React.useState<Record<number, boolean>>({});
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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <ol className="border border-[#1a1a1a] bg-white">
        {items.map((t, i) => (
          <li key={i} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-dashed border-[#1a1a1a]/20 p-5 last:border-b-0">
            <span className="font-estedad text-xl font-black leading-none text-[#1a1a1a]/30">{fa(i + 1)}</span>
            <p className="text-base leading-[1.9] text-[#1a1a1a]/85">{t}</p>
            <div className="col-start-2 flex gap-2">
              {[
                { v: true, label: 'داریم' },
                { v: false, label: 'هنوز نه' },
              ].map((o) => (
                <button
                  key={o.label}
                  type="button"
                  aria-pressed={answers[i] === o.v}
                  onClick={() => setAnswers((prev) => ({ ...prev, [i]: o.v }))}
                  className={`border px-4 py-1.5 text-sm font-bold transition-colors ${
                    answers[i] === o.v ? 'border-[#1a1a1a] bg-[#1a1a1a] text-[#F2F0E9]' : 'border-[#1a1a1a]/25 hover:border-[#1a1a1a]'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div className="grid content-start gap-4 self-start bg-[#1a1a1a] p-6 text-[#F2F0E9] lg:sticky lg:top-44" aria-live="polite">
        <p className="text-xs text-[#F2F0E9]/60">آمادگی شما</p>
        <div className="h-2.5 overflow-hidden bg-[#F2F0E9]/15">
          <div className="h-full bg-[#CCFF00] transition-[width] duration-500" style={{ width: `${(yes / total) * 100}%` }} />
        </div>
        <p className="font-estedad text-2xl font-black">{title}</p>
        <p className="text-sm leading-[1.9] text-[#F2F0E9]/75">{body}</p>
      </div>
    </div>
  );
}
