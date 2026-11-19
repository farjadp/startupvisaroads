'use client';

// ============================================================================
// components/partners/StickyBookBar.tsx
// Phone-only "Book a partner call" bar. It appears once the hero is behind
// the reader and hides while the booking card itself is on screen, so it
// never covers the calendar it points to.
// ============================================================================
import React, { useEffect, useState } from 'react';
import PartnerCta, { BOOKING_ANCHOR } from '@/components/partners/PartnerCta';

export default function StickyBookBar({ label, locale, heroId }: { label: string; locale: string; heroId: string }) {
  const [heroVisible, setHeroVisible] = useState(true);
  const [bookingVisible, setBookingVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    const booking = document.getElementById(BOOKING_ANCHOR);
    if (!hero || !booking || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setHeroVisible(e.isIntersecting);
        if (e.target === booking) setBookingVisible(e.isIntersecting);
      }
    });
    io.observe(hero);
    io.observe(booking);
    return () => io.disconnect();
  }, [heroId]);

  const show = !heroVisible && !bookingVisible;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#1a1a1a] bg-[#F2F0E9]/95 p-3 backdrop-blur transition-transform duration-300 motion-reduce:transition-none lg:hidden ${show ? 'translate-y-0' : 'pointer-events-none translate-y-full'}`}
      aria-hidden={!show}
    >
      <PartnerCta label={label} locale={locale} placement="sticky" className="w-full" />
    </div>
  );
}
