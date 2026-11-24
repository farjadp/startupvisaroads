'use client';

// ============================================================================
// components/pricing/Tracked.tsx
// The pricing page's tracked links: the CTA (pricing_cta_click with
// route_key) and the partner link (pricing_partner_click), plus Txt, which
// marks [[TBD]] in dev output so a gap is impossible to miss. (Production
// never receives TBD text: lib/pricing/resolve.ts drops it.)
// ============================================================================
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import NextLink from 'next/link';
import { Link } from '@/navigation';
import { trackPricing } from '@/lib/analytics';
import { TBD } from '@/lib/pricing/types';

export function Txt({ s }: { s: string }) {
  if (!s.includes(TBD)) return <>{s}</>;
  const parts = s.split(TBD);
  return (
    <>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          {p}
          {i < parts.length - 1 && (
            <mark dir="ltr" className="mx-0.5 rounded-sm bg-amber-300 px-1 font-mono text-[0.8em] font-bold text-[#1a1a1a]">
              TBD
            </mark>
          )}
        </React.Fragment>
      ))}
    </>
  );
}

const CTA_VARIANTS = {
  ink: 'bg-[#1a1a1a] text-[#F2F0E9] border-[#1a1a1a] hover:bg-[#CCFF00] hover:text-[#1a1a1a]',
  acid: 'bg-[#CCFF00] text-[#1a1a1a] border-[#1a1a1a] hover:bg-[#F2F0E9]',
  outline: 'bg-transparent text-[#1a1a1a] border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#F2F0E9]',
} as const;

/**
 * A pricing button. `href` is already final (lib/pricing/resolve.ctaHref):
 * an on-site path tagged ?from=pricing&route=<key>, opened in the same tab, or
 * an https link with UTM, opened in a new one. Every click is pricing_cta_click
 * with route_key.
 */
export function PricingCta({
  href,
  label,
  routeKey,
  locale,
  variant = 'ink',
  className = '',
}: {
  href: string;
  label: string;
  routeKey: string;
  locale: string;
  variant?: keyof typeof CTA_VARIANTS;
  className?: string;
}) {
  const external = href.startsWith('https://');
  const cls = `inline-flex min-h-12 items-center justify-center gap-2 border px-6 py-3 font-bold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a] ${CTA_VARIANTS[variant]} ${className}`;
  const onClick = () => trackPricing('pricing_cta_click', { locale, route_key: routeKey });
  const inner = (
    <>
      <span>{label}</span>
      <ArrowUpRight className={`h-5 w-5 shrink-0 ${locale === 'fa' ? '-scale-x-100' : ''}`} aria-hidden />
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener" onClick={onClick} className={cls}>
      {inner}
    </a>
  ) : (
    <NextLink href={href} onClick={onClick} className={cls}>
      {inner}
    </NextLink>
  );
}

export function PartnerLink({ label, locale, arrow }: { label: string; locale: string; arrow: string }) {
  return (
    <Link
      href="/partners"
      onClick={() => trackPricing('pricing_partner_click', { locale })}
      className="inline-flex min-h-11 items-center gap-2 font-bold underline decoration-[#CCFF00] decoration-2 underline-offset-4 hover:decoration-[#F2F0E9]"
    >
      {label} <span aria-hidden>{arrow}</span>
    </Link>
  );
}
