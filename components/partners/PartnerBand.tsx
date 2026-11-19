// ============================================================================
// components/partners/PartnerBand.tsx
// A one-line pointer to /partners for the English services and mentorship
// pages: practitioners who land there are sent to the page written for them.
// ============================================================================
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';

export default function PartnerBand() {
  return (
    <section className="border-t border-[#1a1a1a] bg-[#F2F0E9] px-6 py-10">
      <div className="container mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="font-sans text-lg">
          <span className="font-bold">RCIC or immigration lawyer?</span> You keep the client and the legal file; we build the business side of their startup case.
        </p>
        <Link
          href="/partners"
          className="inline-flex min-h-12 shrink-0 items-center gap-2 border border-[#1a1a1a] px-6 py-3 font-sans font-bold transition-colors duration-200 hover:bg-[#1a1a1a] hover:text-[#F2F0E9]"
        >
          The partner programme
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
