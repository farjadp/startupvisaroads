// ============================================================================
// Component: components/fa/RouteAtlas.tsx
// Every route the Persian site has a guide for, as flag tiles grouped by
// region, on /fa/which-path. Deliberately short on words: flag, name, status
// and the one number that decides the route. The sentence lives in the
// guide; the official source for each number is folded at the end.
//
// Each tile's band is the guide's own palette (faThemes), so a reader who
// clicks through lands on the colour they clicked. Rendered on the server.
// ============================================================================
import React from 'react';
import { Link } from '@/navigation';
import { ATLAS, REGION_LABEL, STATUS_LABEL, type AtlasRegion, type AtlasRoute, type AtlasStatus } from '@/lib/fa/route-atlas';
import { toPersianDigits, faDate } from '@/lib/fa/format';
import AtlasFlag from './AtlasFlag';
import { themeFor } from './faThemes';

const REGIONS: AtlasRegion[] = ['europe', 'canada', 'beyond'];

const STATUS_CLS: Record<AtlasStatus, string> = {
  open: 'bg-[#DDF4E4] text-[#0B5A2A]',
  limited: 'bg-[#FFF1C2] text-[#6B4A00]',
  announced: 'bg-[#E2EEFA] text-[#0B3F73]',
  closed: 'bg-[#E6E3DA] text-[#4A4843]',
};

function Tile({ r }: { r: AtlasRoute }) {
  const theme = themeFor(r.href);
  const closed = r.status === 'closed';
  return (
    <li>
      <Link
        href={r.href}
        style={{ '--a': r.accent ?? theme.accent, '--t': r.accent ? '#1a1a1a' : theme.accentText } as React.CSSProperties}
        className={`group flex h-full flex-col border-t-[6px] p-4 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-16px_rgba(0,0,0,0.45)] motion-reduce:transform-none md:p-5 ${
          closed ? 'border-[#1a1a1a]/25 bg-transparent outline outline-1 -outline-offset-1 outline-[#1a1a1a]/15' : 'border-[var(--a)] bg-white'
        }`}
      >
        <span className="flex items-start justify-between gap-2">
          <span className={closed ? 'opacity-60 grayscale' : ''}>
            <AtlasFlag route={r} className="h-6 md:h-7" />
          </span>
          <span className={`px-1.5 py-0.5 text-[10px] font-bold leading-5 md:text-[11px] ${STATUS_CLS[r.status]}`}>{STATUS_LABEL[r.status]}</span>
        </span>
        <span className="mt-3 font-estedad text-lg font-black leading-snug md:text-xl">{r.name}</span>
        <span className="text-xs leading-5 text-[#1a1a1a]/70">{r.programme}</span>
        <span className={`mt-auto pt-4 font-estedad text-xl font-black leading-tight md:text-2xl ${closed ? 'text-[#1a1a1a]/60' : 'text-[var(--t)]'}`}>
          {r.figure}
        </span>
        <span className="text-[11px] leading-5 text-[#1a1a1a]/65 md:text-xs">{r.figureLabel}</span>
      </Link>
    </li>
  );
}

export default function RouteAtlas() {
  return (
    <section aria-labelledby="atlas-heading" className="py-16 md:py-20">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id="atlas-heading" className="font-estedad text-3xl font-black md:text-4xl">
          اطلس مسیرها
        </h2>
        <ul className="flex flex-wrap gap-2" aria-label="راهنمای برچسب‌ها">
          {(Object.keys(STATUS_LABEL) as AtlasStatus[]).map((s) => (
            <li key={s} className={`px-1.5 py-0.5 text-[11px] font-bold ${STATUS_CLS[s]}`}>
              {STATUS_LABEL[s]}
            </li>
          ))}
        </ul>
      </div>
      <p className="mb-2 max-w-[60ch] text-sm leading-7 text-[#1a1a1a]/70">
        هر کاشی به راهنمای کامل همان مسیر می‌رود. «باز» و «بسته» برای دارنده‌ی پاسپورت ایرانی است.
      </p>

      {REGIONS.map((region) => {
        const routes = ATLAS.filter((r) => r.region === region);
        return (
          <div key={region} className="mt-10">
            <h3 className="mb-4 flex items-baseline gap-3 font-estedad text-xl font-black md:text-2xl">
              {REGION_LABEL[region]}
              <span className="font-vazir text-sm font-normal text-[#1a1a1a]/60">{toPersianDigits(routes.length)} مسیر</span>
            </h3>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3 lg:grid-cols-4">
              {routes.map((r) => (
                <Tile key={r.key} r={r} />
              ))}
            </ul>
          </div>
        );
      })}

      <details className="group mt-10 border-t border-[#1a1a1a]/15 pt-4">
        <summary className="cursor-pointer text-sm font-bold text-[#1a1a1a]/75 hover:text-[#1a1a1a]">منبع رسمی هر عدد</summary>
        <ul className="mt-4 grid gap-x-8 gap-y-2 text-xs leading-6 text-[#1a1a1a]/70 md:grid-cols-2">
          {ATLAS.map((r) => (
            <li key={r.key}>
              <span className="font-bold text-[#1a1a1a]">{r.name}، {r.programme}:</span>{' '}
              <a href={r.source} target="_blank" rel="noopener noreferrer" dir="ltr" className="break-all underline decoration-[#1a1a1a]/30 underline-offset-2 hover:decoration-[#1a1a1a]">
                {new URL(r.source).hostname}
              </a>{' '}
              <span>(بازبینی راهنما: {faDate(r.updated)})</span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
