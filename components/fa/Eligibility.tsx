'use client';

// ============================================================================
// Component: components/fa/Eligibility.tsx
// Six answers, and the reader sees which thresholds they clear today.
//
// «هزینه» is the most-searched Persian query on this subject and a paragraph
// does not answer it — a reader wants to know whether 500,000 dollars is
// their problem or not. The scoring lives in lib/fa/programmes.ts as a pure
// function, so what is on screen is testable.
//
// The tone is deliberate: a miss is «نزدیک» or «هنوز نه», never a rejection,
// and every condition the calculator cannot measure is listed rather than
// quietly ignored — a reader who clears every number still has a panel to
// convince.
// ============================================================================
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Check, Minus, ArrowLeft } from 'lucide-react';
import { Link } from '@/navigation';
import { assess, assessAll, RULES, type Applicant, type Assessment } from '@/lib/fa/programmes';
import { toPersianDigits } from '@/lib/fa/format';

const DEFAULTS: Applicant = { netWorthCad: 0, investableCad: 0, founders: 1, age: 32, clb: 5, venture: 'idea' };

const VERDICT = {
  clears: { label: 'همه‌ی آستانه‌ها را دارید', cls: 'bg-[#CCFF00] text-[#1a1a1a]' },
  close: { label: 'یک شرط مانده', cls: 'bg-[#1a1a1a] text-[#F2F0E9]' },
  'not-yet': { label: 'هنوز نه', cls: 'border border-[#1a1a1a]/30 text-[#1a1a1a]/70' },
} as const;

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-[#1a1a1a]/60 mb-2">{label}</span>
      {children}
      {hint && <span className="block mt-1 text-[11px] text-[#1a1a1a]/45">{hint}</span>}
    </label>
  );
}

const inputCls =
  'w-full bg-transparent border border-[#1a1a1a]/30 px-3 py-2.5 text-base focus:outline-none focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#CCFF00]';

function Result({ a }: { a: Assessment }) {
  const v = VERDICT[a.verdict];
  return (
    <div className="border border-[#1a1a1a] bg-[#F2F0E9]">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-[#1a1a1a]/20">
        <h3 className="font-estedad font-bold text-lg">{a.rule.name}</h3>
        <span className={`text-xs font-bold px-3 py-1.5 ${v.cls}`}>{v.label}</span>
      </div>
      <ul className="p-5 space-y-2.5">
        {a.checks.map((c) => (
          <li key={c.label} className="flex items-start gap-3 text-sm">
            <span
              aria-hidden
              className={`mt-0.5 w-4 h-4 shrink-0 grid place-items-center ${c.status === 'pass' ? 'bg-[#CCFF00]' : 'bg-[#1a1a1a]/10'}`}
            >
              {c.status === 'pass' ? <Check className="w-3 h-3" /> : <Minus className="w-3 h-3 opacity-50" />}
            </span>
            <span className={c.status === 'pass' ? '' : 'text-[#1a1a1a]/60'}>
              <span className="font-bold">{c.label}</span>
              {c.detail && <span className="text-[#1a1a1a]/55"> — <span dir="ltr" className="inline-block">{toPersianDigits(c.detail)}</span></span>}
            </span>
          </li>
        ))}
      </ul>
      {a.unscored.length > 0 && (
        <div className="px-5 pb-5">
          <p className="text-xs font-bold text-[#1a1a1a]/60 mb-2">این‌ها را این ماشین‌حساب نمی‌سنجد:</p>
          <ul className="space-y-1.5 text-xs text-[#1a1a1a]/60">
            {a.unscored.map((u) => (
              <li key={u} className="flex gap-2"><span aria-hidden className="mt-[0.7em] h-px w-3 bg-[#1a1a1a]/40 shrink-0" />{u}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="px-5 pb-5">
        <Link href={a.rule.href} className="group inline-flex items-center gap-2 text-sm font-bold hover:text-[#1a1a1a]/70">
          راهنمای کامل {a.rule.name}
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default function Eligibility({ only }: { only?: string }) {
  const [a, setA] = useState<Applicant>(DEFAULTS);
  const [shown, setShown] = useState(false);
  const reduced = useReducedMotion();
  const rule = only ? RULES.find((r) => r.key === only) : undefined;

  const results = useMemo(() => (rule ? [assess(rule, a)] : assessAll(a)), [rule, a]);
  const set = <K extends keyof Applicant>(k: K, v: Applicant[K]) => { setA((p) => ({ ...p, [k]: v })); setShown(true); };

  return (
    <section className="my-16 border-t-2 border-[#1a1a1a] pt-10" aria-labelledby="calc-heading">
      <h2 id="calc-heading" className="font-estedad font-black text-2xl md:text-3xl mb-2">
        {rule ? 'آستانه‌های این مسیر را دارید؟' : 'کدام مسیر آستانه‌هایش با شما می‌خواند؟'}
      </h2>
      <p className="text-sm text-[#1a1a1a]/60 mb-8 max-w-[60ch] leading-relaxed">
        شش عدد، و همان‌جا می‌بینید کجا ایستاده‌اید. این تریاژ است، نه مشاوره — و پذیرش هیچ برنامه‌ای فقط عدد نیست.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <Field label="دارایی خالص (دلار کانادا)" hint="مجموع دارایی‌ها منهای بدهی‌ها">
          <input dir="ltr" type="number" min={0} step={10000} className={inputCls} value={a.netWorthCad || ''} onChange={(e) => set('netWorthCad', Number(e.target.value))} />
        </Field>
        <Field label="سرمایه‌ی قابل انتقال (دلار کانادا)" hint="آنچه واقعاً می‌توانید منتقل و خرج کنید">
          <input dir="ltr" type="number" min={0} step={10000} className={inputCls} value={a.investableCad || ''} onChange={(e) => set('investableCad', Number(e.target.value))} />
        </Field>
        <Field label="تعداد بنیان‌گذاران">
          <input dir="ltr" type="number" min={1} max={10} className={inputCls} value={a.founders} onChange={(e) => set('founders', Math.max(1, Number(e.target.value)))} />
        </Field>
        <Field label="سن">
          <input dir="ltr" type="number" min={18} max={80} className={inputCls} value={a.age} onChange={(e) => set('age', Number(e.target.value))} />
        </Field>
        <Field label="سطح زبان (CLB)" hint="پایین‌ترین نمره در چهار مهارت">
          <input dir="ltr" type="number" min={0} max={12} className={inputCls} value={a.clb} onChange={(e) => set('clb', Number(e.target.value))} />
        </Field>
        <Field label="مرحله‌ی کسب‌وکار">
          <select className={inputCls} value={a.venture} onChange={(e) => set('venture', e.target.value as Applicant['venture'])}>
            <option value="idea">ایده</option>
            <option value="mvp">MVP</option>
            <option value="revenue">درآمد دارد</option>
          </select>
        </Field>
      </div>

      <AnimatePresence initial={false}>
        {shown && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            {results.map((r) => <Result key={r.rule.key} a={r} />)}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-xs text-[#1a1a1a]/50 leading-relaxed max-w-[70ch]">
        مبالغی که به ارز دیگری اعلام شده‌اند با نرخ تقریبی بازبینی‌شده در ۱۵ شهریور ۱۴۰۵ به دلار کانادا تبدیل شده‌اند. هر رقم را پیش از تصمیم‌گیری با مرجع رسمی همان برنامه بسنجید.
      </p>
    </section>
  );
}
