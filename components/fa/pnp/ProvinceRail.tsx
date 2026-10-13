// ============================================================================
// components/fa/pnp/ProvinceRail.tsx
// A slim strip under a province guide's hero: the five provinces as photo
// chips, the current one marked, plus the hub. Lets a reader comparing
// provinces move sideways without going back up to the hub.
// ============================================================================
import React from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { provinces } from '@/content/fa/pnp';

export default function ProvinceRail({ current }: { current: string }) {
  return (
    <nav aria-label="استان‌های کارآفرینی کانادا" className="bg-[#1a1a1a] text-[#F2F0E9] border-t border-[#F2F0E9]/10">
      <div className="px-4 md:px-8 max-w-[1400px] mx-auto flex items-center gap-6 py-4">
        <Link href="/pnp" className="shrink-0 text-xs text-[#F2F0E9]/60 hover:text-[#CCFF00] transition-colors">
          همه‌ی استان‌ها
        </Link>
        <ul className="flex gap-2 overflow-x-auto snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -my-1 py-1">
          {provinces.map((p) => {
            const active = p.href === current;
            const inner = (
              <>
                <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[#F2F0E9]/10">
                  <Image src={`/fa/img/${p.image}.webp`} alt="" fill sizes="32px" className="object-cover" />
                </span>
                <span className="whitespace-nowrap text-sm font-bold">{p.name}</span>
                <span className={`h-1.5 w-1.5 rounded-full ${p.open ? 'bg-[#CCFF00]' : 'bg-[#F97316]'}`} aria-label={p.open ? 'پذیرش فعال' : 'بدون دعوت در ۲۰۲۶'} />
              </>
            );
            const cls = `flex items-center gap-2.5 ps-1 pe-4 py-1 rounded-full border transition-colors ${active ? 'border-[#CCFF00] bg-[#CCFF00]/10' : 'border-[#F2F0E9]/15 hover:border-[#F2F0E9]/50'}`;
            return (
              <li key={p.href} className="snap-start">
                {p.guide === 'en'
                  ? <a href={p.href} hrefLang="en" className={cls}>{inner}</a>
                  : <Link href={p.href} className={cls} aria-current={active ? 'page' : undefined}>{inner}</Link>}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
