'use client';

// ============================================================================
// components/partners/BookingEmbed.tsx
// Farjad's Google Calendar appointment schedule, behind a click.
//
// - Nothing from Google loads until the reader asks: no third-party request
//   or cookie before intent, and the iframe can never be the LCP element.
// - The placeholder and the frame have the same fixed height, so opening it
//   shifts nothing (CLS 0).
// - If the browser blocks third-party cookies or Google entirely, the
//   booking page in a new tab and the email / Telegram links still work;
//   they are in the server HTML, so they work without JavaScript too.
// - A booking happens inside Google's cross-origin frame and cannot be seen
//   from this page. GA4 gets the intent: calendar opened, fallbacks used.
// ============================================================================
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ExternalLink, Mail, Send } from 'lucide-react';
import { trackPartner } from '@/lib/analytics';
import { OPEN_CALENDAR_EVENT, BOOKING_ANCHOR } from '@/components/partners/PartnerCta';
import {
  BOOKING_FRAME_HEIGHT,
  PARTNER_BOOKING_EMBED_URL,
  PARTNER_BOOKING_URL,
  type PartnerCopy,
} from '@/content/partners';

interface Props {
  copy: PartnerCopy['booking'];
  locale: string;
  email: string;
  telegram: string;
  telegramHandle: string;
}

export default function BookingEmbed({ copy, locale, email, telegram, telegramHandle }: Props) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const isRtl = locale === 'fa';

  // A ref, not the state updater: React may run an updater twice, which
  // would send the GA4 event twice.
  const openedRef = useRef(false);
  const openCalendar = useCallback(
    (fromButton: boolean) => {
      if (openedRef.current) return;
      openedRef.current = true;
      // Count the first open only; CTA clicks are recorded by the CTA itself.
      trackPartner('partner_calendar_open', { locale, placement: fromButton ? 'booking' : 'cta' });
      setOpen(true);
    },
    [locale],
  );

  useEffect(() => {
    const onOpen = () => openCalendar(false);
    window.addEventListener(OPEN_CALENDAR_EVENT, onOpen);
    // Arriving on /partners#book (the email CTA can link there) opens it straight away.
    if (window.location.hash === `#${BOOKING_ANCHOR}`) onOpen();
    return () => window.removeEventListener(OPEN_CALENDAR_EVENT, onOpen);
  }, [openCalendar]);

  return (
    <div className="bg-[#1a1a1a] text-[#F2F0E9]">
      <div className="p-5 md:p-7">
        <h2 className={`text-2xl md:text-3xl leading-tight ${isRtl ? 'font-estedad font-black' : 'font-serif'}`}>{copy.title}</h2>
      </div>

      <div className="relative mx-5 md:mx-7 bg-white">
        {/* Fixed height shared by placeholder and frame: no layout shift. */}
        <div className="relative h-[600px] w-full overflow-hidden" data-height={BOOKING_FRAME_HEIGHT}>
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[#F2F0E9] px-6 text-center text-[#1a1a1a]">
              <CalendarSketch active={open} />
              {open ? (
                <p role="status" className="sr-only">{copy.title}</p>
              ) : (
                <button
                  type="button"
                  onClick={() => openCalendar(true)}
                  className="inline-flex min-h-12 items-center gap-2 border border-[#1a1a1a] bg-[#CCFF00] px-6 py-3 font-bold transition-colors duration-200 hover:bg-[#1a1a1a] hover:text-[#CCFF00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]"
                >
                  {copy.open}
                </button>
              )}
              <p className="max-w-xs text-sm leading-relaxed text-[#1a1a1a]/75">{copy.note}</p>
            </div>
          )}
          {open && (
            <iframe
              src={PARTNER_BOOKING_EMBED_URL}
              title={copy.frameTitle}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              className="absolute inset-0 h-full w-full border-0"
            />
          )}
        </div>
      </div>

      <div className="space-y-3 p-5 md:p-7 text-sm">
        <a
          href={PARTNER_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackPartner('partner_calendar_new_tab', { locale, placement: 'booking' })}
          className="inline-flex min-h-11 items-center gap-2 font-bold underline decoration-[#CCFF00] decoration-2 underline-offset-4 hover:text-[#CCFF00]"
        >
          <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
          {copy.newTab}
        </a>
        <p className="text-[#F2F0E9]/75">{copy.fallback}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a
            href={`mailto:${email}`}
            onClick={() => trackPartner('partner_contact_click', { locale, placement: 'booking', channel: 'email' })}
            className="inline-flex min-h-11 items-center gap-2 hover:text-[#CCFF00]"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden />
            <span>{copy.email}:</span> <span dir="ltr">{email}</span>
          </a>
          <a
            href={telegram}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackPartner('partner_contact_click', { locale, placement: 'booking', channel: 'telegram' })}
            className="inline-flex min-h-11 items-center gap-2 hover:text-[#CCFF00]"
          >
            <Send className="h-4 w-4 shrink-0" aria-hidden />
            <span>{copy.telegram}:</span> <span dir="ltr">{telegramHandle}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/** A drawn month grid: a few slots light up in turn, hinting at free times. Still under reduced motion. */
function CalendarSketch({ active }: { active: boolean }) {
  // Free slots, each with its own delay so they light up in turn.
  const slots: Record<number, string> = {
    3: '[animation-delay:0s]',
    9: '[animation-delay:0.5s]',
    12: '[animation-delay:1s]',
    17: '[animation-delay:1.5s]',
    23: '[animation-delay:2s]',
    26: '[animation-delay:2.5s]',
  };
  return (
    <div className="grid grid-cols-7 gap-1.5" aria-hidden>
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          className={`h-5 w-5 sm:h-6 sm:w-6 ${
            slots[i] !== undefined
              ? `border border-[#1a1a1a] bg-[#CCFF00] motion-safe:animate-pulse ${slots[i]}`
              : `bg-[#1a1a1a]/10 ${active ? 'motion-safe:animate-pulse' : ''}`
          }`}
        />
      ))}
    </div>
  );
}
