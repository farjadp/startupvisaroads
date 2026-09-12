// ============================================================================
// components/SuvStatusNotice.tsx
// The Start-up Visa pause, stated once, wherever an English page mentions the
// programme. It exists because the pause was being told four different ways
// across the site — "capped", "waitlisted", "30-40 month wait", or not at all
// on the paid landing page — and a reader who lands on the wrong one plans
// around an intake that does not exist.
//
// Facts come from lib/canada-suv.ts, which is quoted from canada.ca. Do not
// hardcode a date or a figure in here.
// ============================================================================
import React from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { SUV_SOURCES, SUV_STATE } from '@/lib/canada-suv';

const pausedOn = new Date(SUV_STATE.pausedOn).toLocaleDateString('en-CA', { day: 'numeric', month: 'long', year: 'numeric' });

type Props = {
  /** 'band' is the full-width dark strip; 'inline' is a compact box inside prose. */
  variant?: 'band' | 'inline';
  /** Adds the link to the open routes. Off where the page already offers them. */
  showRoutesLink?: boolean;
  className?: string;
};

export default function SuvStatusNotice({ variant = 'band', showRoutesLink = true, className = '' }: Props) {
  const body = (
    <>
      <span className="font-bold">The Canada Start-up Visa is paused.</span> IRCC stopped accepting new applications on {pausedOn}. Applications filed before that date are still being processed, and if you are eligible you can still apply for an open work permit while yours is assessed. IRCC says a targeted entrepreneur pilot will replace the programme, but has not published its criteria, its cap or an opening date.{' '}
      <a href={SUV_SOURCES.program} target="_blank" rel="noreferrer" className="underline">
        IRCC, Start-up Visa Program
      </a>
      .
    </>
  );

  if (variant === 'inline') {
    return (
      <div className={`border-l-4 border-[#b91c1c] bg-[#b91c1c]/5 p-5 font-sans text-sm leading-relaxed ${className}`}>
        <p className="text-[#1a1a1a]/80">{body}</p>
        {showRoutesLink && (
          <Link href="/which-path" className="mt-3 inline-block font-bold text-xs uppercase tracking-widest text-[#1a1a1a] underline decoration-[#1a1a1a]/30 hover:decoration-[#1a1a1a]">
            Routes open today
          </Link>
        )}
      </div>
    );
  }

  return (
    <section className={`bg-[#1a1a1a] text-[#F2F0E9] py-8 px-6 ${className}`}>
      <div className="container mx-auto flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <ShieldAlert className="w-8 h-8 text-[#CCFF00] shrink-0" />
        <p className="font-sans text-sm text-[#F2F0E9]/70 leading-relaxed">{body}</p>
        {showRoutesLink && (
          <Link
            href="/which-path"
            className="shrink-0 bg-[#CCFF00] text-[#1a1a1a] px-6 py-3 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors text-center"
          >
            Routes open today
          </Link>
        )}
      </div>
    </section>
  );
}
