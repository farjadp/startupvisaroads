'use client';
// ============================================================================
// components/case-studies/ParaChip.tsx
// The ¶ chip after every claim. A real button (aria-expanded/aria-controls)
// that reveals the exact quote from the cited paragraph. The quote is the
// decision's own English text; on Persian pages it keeps LTR and is labelled
// as the original.
// ============================================================================
import React, { useId, useState } from 'react';

type Props = {
  label: string;
  ariaLabel: string;
  heading: string;
  quote: string;
  /** Persian pages: label shown above the English original. */
  originalLabel?: string;
};

export default function ParaChip({ label, ariaLabel, heading, quote, originalLabel }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();
  if (!quote) return null;

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        className={`relative ms-1.5 inline-flex min-h-6 items-center whitespace-nowrap rounded-full border border-ink px-2 align-baseline text-xs font-bold leading-none transition-colors duration-150 after:absolute after:-inset-x-1 after:-inset-y-2.5 after:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
          open ? 'bg-ink text-paper' : 'hover:bg-[#E5E3DD]'
        }`}
      >
        {label}
      </button>
      <span id={id} hidden={!open} className="my-3 block border-s-[3px] border-ink bg-acid px-4 py-3 text-sm text-ink">
        <span className="mb-1 block text-xs font-bold">
          {heading}
          {originalLabel ? ` · ${originalLabel}` : ''}
        </span>
        <q lang="en" dir="ltr" className="block text-start font-sans leading-relaxed [quotes:none]">
          {quote}
        </q>
      </span>
    </>
  );
}
