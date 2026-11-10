// ============================================================================
// components/case-studies/Marks.tsx
// Small shared atoms of the Docket design: outcome mark, type badge, label,
// sample banner, a Latin run inside Persian text.
// Outcome is shape + words, never colour alone: a hollow circle for Allowed,
// a filled square for Dismissed. Acid is not used for "Allowed".
// ============================================================================
import React from 'react';
import { isFavourable, type CaseOutcome } from '@/lib/case-studies/outcomes';
import { COPY, type Lang } from './copy';

export function OutcomeMark({ outcome, lang, className = '' }: { outcome: CaseOutcome; lang: Lang; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-bold ${className}`}>
      <span
        aria-hidden
        className={`h-2.5 w-2.5 flex-none border-2 border-current ${isFavourable(outcome) ? 'rounded-full' : 'bg-current'}`}
      />
      {COPY[lang].outcomeLabel[outcome]}
    </span>
  );
}

export function TypeBadge({ type, lang }: { type: 'FC_DECISION' | 'CLIENT_CASE'; lang: Lang }) {
  const t = COPY[lang];
  const tone = type === 'FC_DECISION' ? 'bg-ink text-paper' : 'border border-ink text-ink';
  const text = lang === 'fa' ? 'text-xs font-bold leading-snug' : 'text-[11px] font-bold uppercase leading-tight tracking-[0.15em]';
  return <span className={`inline-block px-2.5 py-1 ${tone} ${text}`}>{type === 'FC_DECISION' ? t.courtBadge : t.clientBadge}</span>;
}

/** The small label above a value. Persian never takes letter-spacing or uppercase. */
export function Label({ lang, children, as: As = 'span', className = '' }: { lang: Lang; children: React.ReactNode; as?: 'span' | 'p' | 'h2'; className?: string }) {
  const style = lang === 'fa' ? 'text-xs font-bold leading-snug' : 'text-[11px] font-bold uppercase leading-tight tracking-[0.15em]';
  return <As className={`${style} ${className}`}>{children}</As>;
}

/** A citation, statute or URL: never reorders inside Persian text. */
export function Ltr({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={className}>
      {children}
    </bdi>
  );
}

export function SampleBanner({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <div role="note" className="border-y border-ink bg-acid text-ink">
      <p className="mx-auto max-w-[1240px] px-6 py-3 text-sm">
        <strong className="font-bold">{t.sampleTitle}.</strong> {t.sampleBody}
      </p>
    </div>
  );
}
