'use client';

// A footer link that reports nav_click. The footer itself stays a server
// component; only this leaf needs the browser.
import React from 'react';
import { Link } from '@/navigation';
import { trackNav } from '@/lib/analytics';

export default function FooterLink({
  href,
  locale,
  label,
  className,
  children,
}: {
  href: string;
  /** Analytics label when the children are not plain text. */
  label?: string;
  locale: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href as any}
      className={className}
      onClick={() => trackNav({ locale, area: 'footer', label: label ?? (typeof children === 'string' ? children : href), href })}
    >
      {children}
    </Link>
  );
}
