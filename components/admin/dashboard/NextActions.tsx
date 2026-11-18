import Link from 'next/link';
import { ArrowLeft, CircleAlert, Flag, Lightbulb } from 'lucide-react';
import type { Severity, Suggestion } from '@/lib/admin-dashboard/suggestions';

const SEVERITY: Record<Severity, { label: string; icon: typeof Flag; tone: string }> = {
  urgent: { label: 'فوری', icon: CircleAlert, tone: 'text-red-700' },
  important: { label: 'مهم', icon: Flag, tone: 'text-amber-800' },
  opportunity: { label: 'فرصت', icon: Lightbulb, tone: 'text-green-800' },
};

/** The ranked "do this next" list. Persian and right-to-left inside the English admin. */
export default function NextActions({ items, hidden }: { items: Suggestion[]; hidden: number }) {
  return (
    <section dir="rtl" lang="fa" aria-labelledby="next-heading" className="mb-10 rounded-2xl border border-[#1a1a1a]/5 bg-white font-vazir shadow-sm">
      <div className="border-b border-[#1a1a1a]/5 px-6 py-5">
        <h2 id="next-heading" className="text-2xl font-bold text-[#1a1a1a]">کار بعدی</h2>
        <p className="mt-1 text-sm text-[#1a1a1a]/60">از روی داده‌های واقعی همین صفحه و به ترتیب فوریت.</p>
      </div>
      <ol className="divide-y divide-[#1a1a1a]/5">
        {items.map((item) => {
          const severity = SEVERITY[item.severity];
          const Icon = severity.icon;
          const inner = (
            <>
              <span className="text-xl font-bold leading-7 text-[#1a1a1a] sm:w-32 sm:shrink-0">{item.evidence}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold leading-7 text-[#1a1a1a]">{item.title}</span>
                <span className="block text-sm leading-6 text-[#1a1a1a]/65">{item.why}</span>
              </span>
              <span className={`flex items-center gap-1 text-xs font-bold sm:w-16 sm:shrink-0 ${severity.tone}`}>
                <Icon className="h-4 w-4" aria-hidden />
                {severity.label}
              </span>
              <span className="flex items-center gap-1 text-sm font-bold text-[#1f5fa8] sm:w-28 sm:shrink-0 sm:justify-end">
                {item.action}
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </span>
            </>
          );
          const row = 'flex flex-col gap-2 px-6 py-4 transition-colors hover:bg-[#1a1a1a]/[0.02] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1f5fa8] sm:flex-row sm:items-center sm:gap-5';
          return (
            <li key={item.id}>
              {item.href.startsWith('#') ? (
                <a href={item.href} className={row}>{inner}</a>
              ) : (
                <Link href={item.href} className={row}>{inner}</Link>
              )}
            </li>
          );
        })}
      </ol>
      {hidden > 0 && (
        <p className="border-t border-[#1a1a1a]/5 px-6 py-3 text-sm text-[#1a1a1a]/60">
          {hidden.toLocaleString('fa-IR')} مورد کم‌فوریت‌تر هم هست که بعد از این‌ها نشان داده می‌شود.
        </p>
      )}
    </section>
  );
}
