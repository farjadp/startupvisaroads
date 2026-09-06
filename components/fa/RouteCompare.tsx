'use client';

// ============================================================================
// Component: components/fa/RouteCompare.tsx
// The four routes side by side, sortable by the column the reader cares
// about. The site's whole thesis is "which route", but until now the numbers
// that decide it were spread across six pages — a reader had to hold them in
// their head. Built from the same lib/fa/programmes.ts rules the calculator
// uses, so the two can never disagree.
//
// The table scrolls inside itself rather than making the page scroll
// sideways, and every cell that has no threshold says so rather than
// rendering an empty box a reader has to interpret.
// ============================================================================
import React, { useState } from 'react';
import { ArrowUpDown, ArrowLeft } from 'lucide-react';
import { Link } from '@/navigation';
import { RULES } from '@/lib/fa/programmes';
import { sortRules, toCad, type ColKey } from '@/lib/fa/compare';
import Flag from './Flag';
import { flagFor } from '@/lib/fa/flags';
import { toPersianDigits } from '@/lib/fa/format';

const money = (n: number | null) => (n === null ? '—' : toPersianDigits(n.toLocaleString('en-US')));

const COLS: { key: ColKey; label: string; sortable: boolean }[] = [
  { key: 'name', label: 'مسیر', sortable: false },
  { key: 'founders', label: 'حداقل بنیان‌گذار', sortable: true },
  { key: 'netWorth', label: 'دارایی خالص', sortable: true },
  { key: 'investment', label: 'سرمایه‌گذاری', sortable: true },
  { key: 'funds', label: 'تمکن مالی سالانه', sortable: true },
  { key: 'clb', label: 'زبان', sortable: true },
];

export default function RouteCompare() {
  const [sort, setSort] = useState<{ key: ColKey; dir: 1 | -1 }>({ key: 'netWorth', dir: 1 });

  const rows = sortRules(RULES, sort.key, sort.dir);
  const toggle = (key: ColKey) => setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: 1 }));

  return (
    <section className="my-16" aria-labelledby="compare-heading">
      <h2 id="compare-heading" className="font-estedad font-black text-2xl md:text-3xl mb-2">مقایسه‌ی مسیرها</h2>
      <p className="text-sm text-[#1a1a1a]/60 mb-6 max-w-[60ch] leading-relaxed">
        روی عنوان هر ستون بزنید تا بر همان مرتب شود. «—» یعنی آن برنامه چنین شرطی ندارد، نه اینکه عددش را نمی‌دانیم.
      </p>

      <div className="overflow-x-auto border border-[#1a1a1a]">
        <table className="w-full min-w-[46rem] text-sm border-collapse">
          <caption className="sr-only">مقایسه‌ی آستانه‌های مالی و شرایط پایه‌ی مسیرهای استارتاپ ویزا و کارآفرینی</caption>
          <thead>
            <tr className="bg-[#1a1a1a] text-[#F2F0E9]">
              {COLS.map((c) => (
                <th key={c.key} scope="col" className="text-start font-bold p-3.5 whitespace-nowrap"
                    aria-sort={sort.key === c.key ? (sort.dir === 1 ? 'ascending' : 'descending') : undefined}>
                  {c.sortable ? (
                    <button type="button" onClick={() => toggle(c.key)} className={`inline-flex items-center gap-1.5 hover:text-[#CCFF00] transition-colors ${sort.key === c.key ? 'text-[#CCFF00]' : ''}`}>
                      {c.label}
                      <ArrowUpDown className="w-3 h-3 opacity-60" aria-hidden />
                    </button>
                  ) : c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-t border-[#1a1a1a]/15 hover:bg-[#1a1a1a]/[0.03] transition-colors">
                <th scope="row" className="text-start p-3.5 font-bold">
                  <Link href={r.href} className="group inline-flex items-center gap-2 hover:text-[#1a1a1a]/70">
                    {flagFor(r.href) && <Flag code={flagFor(r.href)!} className="h-3.5 w-auto shrink-0 text-[#1a1a1a]" />}
                    {r.name}
                    <ArrowLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:-translate-x-0.5 transition-all" aria-hidden />
                  </Link>
                </th>
                <td className="p-3.5">{toPersianDigits(r.founders?.min ?? 1)}{r.founders?.max ? ` تا ${toPersianDigits(r.founders.max)}` : ''}</td>
                <td className="p-3.5" dir="ltr">{money(toCad(r.netWorth))}</td>
                <td className="p-3.5" dir="ltr">{money(toCad(r.investment))}</td>
                <td className="p-3.5" dir="ltr">{money(toCad(r.yearlyFunds))}</td>
                <td className="p-3.5">{r.clb ? `CLB ${toPersianDigits(r.clb)}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-[#1a1a1a]/50">همه‌ی مبالغ به دلار کانادا، با نرخ تقریبی بازبینی‌شده در ۱۵ شهریور ۱۴۰۵.</p>
    </section>
  );
}
