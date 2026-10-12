// ============================================================================
// Component: components/usa/UsaCluster.tsx
// The US cluster's link grid — every US page links to its siblings, so the
// hub-and-spoke structure is real links, not a sitemap entry. The paths are
// the same in both locales except the hub and NIW, which predate the cluster.
// ============================================================================
import React from 'react';
import { Link } from '@/navigation';
import { USA_CLUSTER } from '@/lib/usa/cluster';

export default function UsaCluster({ locale, current }: { locale: 'en' | 'fa'; current: string }) {
  const fa = locale === 'fa';
  const items = USA_CLUSTER.filter((i) => (fa ? i.faPath : i.enPath) !== current);
  return (
    <nav aria-label={fa ? 'راهنماهای آمریکا' : 'US guides'} className="border-t border-[#1a1a1a] pt-8">
      <h2 className={fa ? 'font-estedad font-black text-2xl md:text-3xl mb-8' : 'font-serif text-2xl md:text-3xl mb-8'}>
        {fa ? 'بقیه‌ی راهنماهای آمریکا' : 'The rest of the US guides'}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#1a1a1a]/20 border border-[#1a1a1a]/20">
        {items.map((i) => (
          <li key={i.enPath} className="bg-[#F2F0E9]">
            <Link href={fa ? i.faPath : i.enPath} className="block p-6 h-full hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors group">
              <span className="block font-bold">{fa ? i.fa : i.en}</span>
              <span className="block mt-1 text-sm opacity-60">{fa ? i.faNote : i.enNote}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
