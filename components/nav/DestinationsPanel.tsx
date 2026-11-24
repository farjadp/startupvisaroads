// ============================================================================
// Component: components/nav/DestinationsPanel.tsx
// The desktop Destinations panel: four region columns and a "Start here"
// column with the route quiz. Sized to fit one 1280x800 screen without
// scrolling — the old single list of 32 links did not.
// ============================================================================
'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import Flag from '@/components/fa/Flag';
import { flagFor } from '@/lib/fa/flags';
import { trackNav } from '@/lib/analytics';
import type { NavCopy, NavLink, NavLocale } from '@/lib/nav';

/** The one flag every link in a region shares, or null when they differ. */
export function sharedFlag(links: NavLink[]) {
  if (links.length < 2) return null;
  const first = flagFor(links[0].href);
  return first && links.every((l) => flagFor(l.href) === first) ? first : null;
}

export function StatusTag({ status, isFa }: { status: string; isFa: boolean }) {
  return (
    <span
      className={`ms-2 inline-block border border-paper/30 px-1.5 align-[2px] leading-tight text-paper/70 ${
        isFa ? 'font-vazir text-xs' : 'font-sans text-[11px] tracking-wide'
      }`}
    >
      {status}
    </span>
  );
}

type Props = {
  id: string;
  nav: NavCopy;
  locale: NavLocale;
  pathname: string;
  onNavigate: () => void;
};

export default function DestinationsPanel({ id, nav, locale, pathname, onNavigate }: Props) {
  const isFa = locale === 'fa';
  const linkFont = isFa ? 'font-vazir text-[15px]' : 'font-serif text-base';
  const micro = isFa ? 'font-vazir text-xs' : 'font-sans text-[10px] uppercase tracking-widest';

  const click = (label: string, href: string, area: 'mega' | 'cta' = 'mega') => {
    trackNav({ locale, area, label, href });
    onNavigate();
  };

  return (
    <div id={id} className="border-t-2 border-acid bg-ink p-7 text-paper shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="grid grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.2fr)] gap-7">
        {nav.regions.map((region) => {
          const flag = isFa ? sharedFlag(region.links) : null;
          return (
            <div key={region.key} className="min-w-0">
              <p id={`${id}-${region.key}`} className={`${micro} mb-3 flex items-center justify-between gap-2 border-b border-paper/10 pb-2 text-acid`}>
                <span className="flex items-center gap-2">
                  {flag && <Flag code={flag} className="h-3 w-auto shrink-0 text-paper" />}
                  {region.title}
                </span>
                <span className="text-paper/60" aria-hidden="true">{region.links.length.toLocaleString(isFa ? 'fa-IR' : 'en')}</span>
              </p>
              <ul aria-labelledby={`${id}-${region.key}`} className="flex flex-col gap-2">
                {region.links.map((l) => {
                  const own = isFa && !flag ? flagFor(l.href) : null;
                  const current = pathname === l.href;
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href as any}
                        aria-current={current ? 'page' : undefined}
                        onClick={() => click(l.label, l.href)}
                        className={`${linkFont} flex items-start gap-2 leading-snug transition-colors hover:text-acid focus-visible:text-acid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid ${
                          l.isNew || current ? 'text-acid' : 'text-paper/85'
                        }`}
                      >
                        {own && <Flag code={own} className="mt-[0.2em] h-4 w-auto shrink-0 text-paper" />}
                        <span>
                          {l.label}
                          {l.status && <StatusTag status={l.status} isFa={isFa} />}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        <div className="flex min-w-0 flex-col gap-4">
          <p className={`${micro} border-b border-paper/10 pb-2 text-acid`}>{nav.start.title}</p>
          <div className="flex flex-col gap-3 bg-paper/[0.06] p-5">
            <p className={isFa ? 'font-estedad text-lg font-bold leading-snug' : 'font-serif text-xl leading-tight'}>
              {nav.start.quiz.title}
            </p>
            <p className={`${isFa ? 'font-vazir' : 'font-sans'} text-sm leading-relaxed text-paper/75`}>{nav.start.quiz.body}</p>
            <Link
              href={nav.start.quiz.href as any}
              onClick={() => click(nav.start.quiz.action, nav.start.quiz.href, 'cta')}
              className={`group inline-flex items-center gap-2 self-start bg-acid px-4 py-2.5 text-ink transition-colors hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid ${
                isFa ? 'font-vazir text-sm font-bold' : 'font-sans text-xs font-bold uppercase tracking-widest'
              }`}
            >
              {nav.start.quiz.action}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
          <ul className="flex flex-col gap-2">
            {nav.start.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href as any}
                  onClick={() => click(l.label, l.href)}
                  className={`${linkFont} text-paper/85 transition-colors hover:text-acid focus-visible:text-acid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
