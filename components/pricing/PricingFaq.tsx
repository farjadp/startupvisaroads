'use client';

// ============================================================================
// components/pricing/PricingFaq.tsx
// The FAQ accordion. Native <details>, so every answer is in the HTML (and in
// the FAQPage schema), it works with the keyboard and without JavaScript.
// Opening one records pricing_faq_open.
// ============================================================================
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { trackPricing } from '@/lib/analytics';
import type { FaqItem } from '@/lib/pricing/types';
import { Txt } from './Tracked';

export default function PricingFaq({ items, locale }: { items: FaqItem[]; locale: string }) {
  return (
    <div className="divide-y divide-[#1a1a1a]/20 border-y border-[#1a1a1a]">
      {items.map((f, i) => (
        <details
          key={i}
          className="group"
          onToggle={(e) => {
            if ((e.currentTarget as HTMLDetailsElement).open) trackPricing('pricing_faq_open', { locale, faq_question: f.q.slice(0, 100) });
          }}
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a] [&::-webkit-details-marker]:hidden">
            <span>
              <Txt s={f.q} />
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#1a1a1a] transition-colors duration-200 group-open:bg-[#CCFF00]">
              <ChevronDown className="h-5 w-5 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" aria-hidden />
            </span>
          </summary>
          <p className="max-w-3xl pb-6 leading-relaxed text-[#1a1a1a]/80">
            <Txt s={f.a} />
          </p>
        </details>
      ))}
    </div>
  );
}
