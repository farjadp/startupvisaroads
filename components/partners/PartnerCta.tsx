'use client';

// ============================================================================
// components/partners/PartnerCta.tsx
// "Book a partner call" anywhere on /partners. It is a plain #book link, so
// without JavaScript it still scrolls to the booking card (which links the
// booking page). With JavaScript it also opens the calendar in place and
// records a GA4 event, so the reader needs one click, not two.
// ============================================================================
import React from 'react';
import { CalendarDays } from 'lucide-react';
import { trackPartner, type PartnerPlacement } from '@/lib/analytics';

export const OPEN_CALENDAR_EVENT = 'partners:open-calendar';
export const BOOKING_ANCHOR = 'book';

const VARIANTS = {
  acid: 'bg-[#CCFF00] text-[#1a1a1a] border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#CCFF00]',
  ink: 'bg-[#1a1a1a] text-[#F2F0E9] border border-[#1a1a1a] hover:bg-[#CCFF00] hover:text-[#1a1a1a]',
  outline: 'bg-transparent text-[#1a1a1a] border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#F2F0E9]',
} as const;

export function openPartnerCalendar(): void {
  window.dispatchEvent(new CustomEvent(OPEN_CALENDAR_EVENT));
}

export default function PartnerCta({
  label,
  locale,
  placement,
  variant = 'acid',
  className = '',
}: {
  label: string;
  locale: string;
  placement: PartnerPlacement;
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  return (
    <a
      href={`#${BOOKING_ANCHOR}`}
      onClick={() => {
        trackPartner('partner_cta_click', { locale, placement });
        openPartnerCalendar();
      }}
      className={`inline-flex min-h-12 items-center justify-center gap-3 px-6 py-3 font-bold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a] ${VARIANTS[variant]} ${className}`}
    >
      <CalendarDays className="h-5 w-5 shrink-0" aria-hidden />
      <span>{label}</span>
    </a>
  );
}
