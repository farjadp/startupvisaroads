// ============================================================================
// components/fa/pnp/ProvinceCards.tsx
// Photo cards for the Entrepreneur PNP provinces. The hub shows all five; a
// province guide shows the other four under «استان‌های دیگر», so every guide
// links to every sibling with a descriptive anchor — the internal-link mesh
// is the point, the photographs make it something a reader wants to click.
// ============================================================================
import React from 'react';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/navigation';
import { provinces, type PnpProvince } from '@/content/fa/pnp';
import Reveal from '../motion/Reveal';

function Card({ p, i, compact }: { p: PnpProvince; i: number; compact?: boolean }) {
  const body = (
    <>
      <div className={`relative overflow-hidden bg-[#1a1a1a] ${compact ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
        <Image
          src={`/fa/img/${p.image}.webp`}
          alt={p.imageAlt}
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/70 via-transparent to-transparent" />
        <span className={`absolute top-4 start-4 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold backdrop-blur-sm ${p.open ? 'bg-[#F2F0E9]/90 text-[#1a1a1a]' : 'bg-[#C2410C]/90 text-white'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${p.open ? 'bg-[#4D7C0F]' : 'bg-white'}`} aria-hidden />
          {p.open ? 'پذیرش فعال' : 'بدون دعوت در ۲۰۲۶'}
        </span>
        <h3 className="absolute bottom-4 start-5 font-estedad font-black text-3xl md:text-4xl text-[#F2F0E9]">{p.name}</h3>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p dir="ltr" className="text-xs text-[#1a1a1a]/50 text-end">{p.stream}</p>
        <p className="mt-3 leading-[1.85] text-[#1a1a1a]/80">{p.tagline}</p>
        <span className="mt-auto pt-6 inline-flex items-center gap-2 font-bold text-sm">
          {p.guide === 'fa' ? `راهنمای کارآفرینی ${p.name}` : `راهنمای انگلیسی ${p.name}`}
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </span>
      </div>
    </>
  );
  const cls = 'group flex h-full flex-col bg-[#F2F0E9] hover:bg-white transition-colors duration-500';
  return (
    <Reveal as="li" delay={Math.min(i * 0.06, 0.3)}>
      {p.guide === 'en'
        ? <a href={p.href} hrefLang="en" className={cls}>{body}</a>
        : <Link href={p.href} className={cls}>{body}</Link>}
    </Reveal>
  );
}

export default function ProvinceCards({ exclude, compact, children }: { exclude?: string; compact?: boolean; children?: React.ReactNode }) {
  const list = provinces.filter((p) => p.href !== exclude);
  return (
    <ul className={`grid grid-cols-1 md:grid-cols-2 ${compact ? 'xl:grid-cols-4' : 'xl:grid-cols-3'} gap-px bg-[#1a1a1a]/15 border border-[#1a1a1a]/15`}>
      {list.map((p, i) => <Card key={p.href} p={p} i={i} compact={compact} />)}
      {children}
    </ul>
  );
}
