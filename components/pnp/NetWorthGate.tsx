'use client';
// ============================================================================
// components/pnp/NetWorthGate.tsx
// The first screen of any entrepreneur PNP file: verified personal net worth
// and language. The reader sets both and sees which open streams' minimums
// they clear. Floors come from lib/pnp-status.ts; clearing them is the entry
// ticket, not eligibility.
// ============================================================================
import React, { useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Link } from '@/navigation';
import { OPEN_FLOORS } from '@/lib/pnp-status';

type Lang = 'en' | 'fa';
const FA = '۰۱۲۳۴۵۶۷۸۹';
const faDigits = (s: string) => s.replace(/\d/g, (d) => FA[Number(d)]);

const MIN = 100_000;
const MAX = 1_000_000;
const STEP = 25_000;

export default function NetWorthGate({ lang }: { lang: Lang }) {
  const fa = lang === 'fa';
  const [worth, setWorth] = useState(400_000);
  const [clb, setClb] = useState(5);
  const [french, setFrench] = useState(false);

  const money = (x: number) => {
    const s = x.toLocaleString('en-US');
    return fa ? `${faDigits(s).replace(/,/g, '٬')} دلار` : `CAD ${s}`;
  };
  const num = (x: number) => (fa ? faDigits(String(x)) : String(x));

  const rows = useMemo(
    () =>
      OPEN_FLOORS.map((f) => {
        const moneyOk = worth >= f.netWorth;
        const langOk = f.french7 ? french : clb >= (f.clb ?? 0);
        return { f, moneyOk, langOk, ok: moneyOk && langOk };
      }),
    [worth, clb, french],
  );
  const cleared = rows.filter((r) => r.ok).length;
  const pct = ((worth - MIN) / (MAX - MIN)) * 100;

  return (
    <section id="net-worth-check" aria-labelledby="nwc-h" dir={fa ? 'rtl' : 'ltr'} className="scroll-mt-28 border-t border-[#1a1a1a]/10 px-4 py-20 md:py-24">
      <h2 id="nwc-h" className={`mb-4 max-w-[24ch] text-4xl leading-tight md:text-5xl ${fa ? 'font-estedad font-black' : 'font-serif'}`}>
        {fa ? 'اول دارایی خالص: از کدام در رد می‌شوید؟' : 'Net worth first: which doors does yours open?'}
      </h2>
      <p className={`mb-10 max-w-3xl text-[#1a1a1a]/70 ${fa ? 'text-lg leading-[1.9]' : 'font-sans leading-relaxed'}`}>
        {fa
          ? 'بیشتر مسیرهای باز ۵۰۰ تا ۶۰۰ هزار دلار دارایی خالص شخصی و تأییدشده می‌خواهند؛ این شرط پیش از هر طرح کسب‌وکاری پرونده‌ها را حذف می‌کند. دارایی خالص و سطح زبانتان را بگذارید.'
          : 'Most open streams want CAD 500,000 to 600,000 in verified personal net worth. That screen ends more files than any business plan. Set yours, and your language level.'}
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="grid content-start gap-8 self-start rounded-2xl border border-[#1a1a1a]/10 bg-white p-6 md:p-8 lg:sticky lg:top-32">
          <div>
            <label htmlFor="nwc-worth" className="text-xs font-bold">{fa ? 'دارایی خالص شخصی (دلار کانادا)' : 'Personal net worth (CAD)'}</label>
            <p className={`mt-1 text-3xl ${fa ? 'font-estedad font-black' : 'font-serif'}`} aria-live="polite">{money(worth)}{worth >= MAX ? '+' : ''}</p>
            <input
              id="nwc-worth"
              type="range"
              min={MIN}
              max={MAX}
              step={STEP}
              value={worth}
              onChange={(e) => setWorth(Number(e.target.value))}
              className="mt-4 w-full accent-[#1a1a1a]"
              style={{ background: `linear-gradient(${fa ? 'to left' : 'to right'}, #CCFF00 ${pct}%, transparent ${pct}%)` }}
            />
          </div>
          <div>
            <p id="nwc-clb" className="text-xs font-bold">{fa ? 'زبان انگلیسی یا فرانسه (CLB)' : 'English or French (CLB)'}</p>
            <div role="group" aria-labelledby="nwc-clb" className="mt-3 flex flex-wrap gap-1.5">
              {[3, 4, 5, 6, 7].map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={clb === c}
                  onClick={() => setClb(c)}
                  className={`min-w-11 rounded-full border px-4 py-1.5 text-sm transition-colors ${clb === c ? 'border-[#1a1a1a] bg-[#1a1a1a] text-[#F2F0E9]' : 'border-[#1a1a1a]/15 hover:border-[#1a1a1a]'}`}
                >
                  {c === 7 ? (fa ? '۷+' : '7+') : num(c)}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={french} onChange={(e) => setFrench(e.target.checked)} className="h-4 w-4 accent-[#1a1a1a]" />
            {fa ? 'فرانسه‌ی گفتاری در سطح ۷ کبک دارم' : 'I have spoken French at Quebec level 7'}
          </label>
          <div className="rounded-xl bg-[#1a1a1a] p-5 text-[#F2F0E9]" aria-live="polite">
            <p className={`text-4xl ${fa ? 'font-estedad font-black' : 'font-serif'}`}>
              <span className="text-[#CCFF00]">{num(cleared)}</span> / {num(rows.length)}
            </p>
            <p className="mt-1 text-sm text-[#F2F0E9]/70">
              {fa ? 'مسیر باز که حداقل مالی و زبانی‌اش را دارید' : 'open streams whose money and language floors you meet'}
            </p>
          </div>
        </div>

        <ol className="grid content-start gap-2">
          {rows.map(({ f, moneyOk, langOk, ok }, i) => {
            const name = f.href ? (
              <Link href={f.href} className="underline decoration-[#1a1a1a]/30 underline-offset-4 hover:decoration-[#1a1a1a]">{f.stream[lang]}</Link>
            ) : (
              f.stream[lang]
            );
            return (
              <li
                key={i}
                className={`grid grid-cols-[auto_1fr] items-start gap-4 rounded-2xl border p-4 transition-colors duration-300 md:p-5 ${ok ? 'border-[#1a1a1a] bg-[#CCFF00]/40' : 'border-[#1a1a1a]/10 bg-white/60'}`}
              >
                <span className={`grid h-8 w-8 place-items-center rounded-full transition-colors duration-300 ${ok ? 'bg-[#1a1a1a] text-[#CCFF00]' : 'bg-[#1a1a1a]/10 text-[#1a1a1a]/40'}`}>
                  {ok ? <Check className="h-4 w-4" strokeWidth={3} /> : <X className="h-4 w-4" />}
                  <span className="sr-only">{ok ? (fa ? 'دارید' : 'met') : fa ? 'ندارید' : 'not met'}</span>
                </span>
                <div>
                  <p className="font-bold">{name}</p>
                  <p className="mt-1 text-sm text-[#1a1a1a]/65">
                    <span className={moneyOk ? '' : 'font-bold text-[#B91C1C]'}>
                      {fa ? 'دارایی ' : 'Net worth '}{money(f.netWorth)}
                    </span>
                    {' · '}
                    {fa ? 'سرمایه‌گذاری ' : 'invest '}{money(f.investment)}
                    {' · '}
                    <span className={langOk ? '' : 'font-bold text-[#B91C1C]'}>
                      {f.french7 ? (fa ? 'فرانسه سطح ۷' : 'French level 7') : `CLB ${num(f.clb ?? 0)}`}
                    </span>
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="mt-4 max-w-3xl text-xs text-[#1a1a1a]/50">
        {fa
          ? 'این فقط حداقل‌های پول و زبان است. هر مسیر شرط مالکیت، تجربه‌ی مدیریت، ایجاد شغل و امتیاز هم دارد و رسیدن به حداقل یعنی دعوت تضمین‌شده نیست.'
          : 'These are only the money and language floors. Every stream also sets ownership, management experience, job creation and points, and meeting a floor does not guarantee an invitation.'}
      </p>
    </section>
  );
}
