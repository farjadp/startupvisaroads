// ============================================================================
// Component: components/nav/MobileDrawer.tsx
// The phone and tablet menu: a modal dialog with a focus trap, Escape to
// close, the page behind it made inert, and the CTA pinned at the bottom so
// it is always on screen (the old overlay pushed "Book consultation" below
// eight 36px headings). Destinations and About open as accordions, so there
// is never a third level to back out of.
// ============================================================================
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Link } from '@/navigation';
import Flag from '@/components/fa/Flag';
import { flagFor } from '@/lib/fa/flags';
import { trackNav } from '@/lib/analytics';
import type { NavCopy, NavLocale } from '@/lib/nav';
import { StatusTag, sharedFlag } from '@/components/nav/DestinationsPanel';

type Props = {
  id: string;
  open: boolean;
  onClose: () => void;
  nav: NavCopy;
  locale: NavLocale;
  pathname: string;
  langHref: string;
  otherLocale: NavLocale;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function MobileDrawer({ id, open, onClose, nav, locale, pathname, langHref, otherLocale }: Props) {
  const isFa = locale === 'fa';
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [section, setSection] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);

  const display = isFa ? 'font-estedad font-bold text-2xl' : 'font-serif text-3xl';
  const subLink = isFa ? 'font-vazir text-base' : 'font-sans text-base';
  const micro = isFa ? 'font-vazir text-xs' : 'font-sans text-[11px] uppercase tracking-widest';
  const action = isFa ? 'font-vazir text-sm font-bold' : 'font-sans text-xs font-bold uppercase tracking-widest';

  // Reset the accordions each time the drawer opens.
  useEffect(() => {
    if (open) {
      setSection(null);
      setRegion(null);
    }
  }, [open]);

  // Modal behaviour: focus in, trap Tab, Escape out, page behind inert,
  // no background scroll. Focus goes back to the menu button via onClose.
  // The inert set is taken when the drawer opens; a portal mounted while it
  // is open stays live, but the focus trap still keeps Tab inside.
  useEffect(() => {
    if (!open) return;
    const behind = Array.from(document.querySelectorAll<HTMLElement>('body > *:not(script)')).filter(
      (el) => !el.contains(panelRef.current),
    );
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    const targets = [...behind, main, footer].filter((el): el is HTMLElement => !!el && !el.contains(panelRef.current));
    targets.forEach((el) => el.setAttribute('inert', ''));
    document.body.classList.add('overflow-hidden');
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    // The drawer is lg:hidden: widening the window past the breakpoint must
    // close it, or the page stays inert behind an invisible dialog.
    const wide = window.matchMedia('(min-width: 1024px)');
    const onWide = (e: MediaQueryListEvent) => {
      if (e.matches) onClose();
    };
    wide.addEventListener('change', onWide);
    return () => {
      wide.removeEventListener('change', onWide);
      document.removeEventListener('keydown', onKey);
      targets.forEach((el) => el.removeAttribute('inert'));
      document.body.classList.remove('overflow-hidden');
    };
  }, [open, onClose]);

  const go = (label: string, href: string, area: 'drawer' | 'cta' = 'drawer') => {
    trackNav({ locale, area, label, href });
    onClose();
  };

  const toggle = (key: string) => setSection((s) => (s === key ? null : key));

  return (
    <div
      id={id}
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={nav.ui.primaryNav}
      hidden={!open}
      // `hidden` alone loses to Tailwind's display utilities, so the class
      // carries the state too.
      className={`fixed inset-0 z-[60] flex-col bg-ink text-paper lg:hidden ${open ? 'flex' : 'hidden'}`}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <Link href="/" onClick={() => go('VisaRoads', '/')} className="font-serif text-2xl font-bold tracking-tight text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acid">
          VisaRoads<span className="text-acid">.</span>
        </Link>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={nav.ui.close}
          className="flex h-11 w-11 items-center justify-center text-acid focus-visible:outline focus-visible:outline-2 focus-visible:outline-acid"
        >
          <X className="h-7 w-7" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label={nav.ui.primaryNav} className="flex-1 overflow-y-auto px-6 pb-6">
        <ul className="flex flex-col">
          {nav.top.map((item) => {
            if (item.kind === 'link') {
              return (
                <li key={item.href} className="border-b border-paper/10">
                  <Link
                    href={item.href as any}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    onClick={() => go(item.label, item.href)}
                    className={`${display} block py-3.5 transition-colors hover:text-acid focus-visible:text-acid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid ${
                      pathname === item.href ? 'text-acid' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }
            const key = item.kind === 'destinations' ? 'destinations' : item.key;
            const expanded = section === key;
            const subId = `${id}-${key}`;
            return (
              <li key={key} className="border-b border-paper/10">
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={subId}
                  onClick={() => toggle(key)}
                  className={`${display} flex w-full items-center justify-between py-3.5 text-start transition-colors focus-visible:text-acid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid ${
                    expanded ? 'text-acid' : ''
                  }`}
                >
                  {item.label}
                  <ChevronDown className={`h-6 w-6 shrink-0 transition-transform motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                <div id={subId} hidden={!expanded} className="pb-4">
                  {item.kind === 'destinations' ? (
                    <ul className="flex flex-col">
                      {nav.regions.map((r) => {
                        const rOpen = region === r.key;
                        const rId = `${subId}-${r.key}`;
                        const flag = isFa ? sharedFlag(r.links) : null;
                        return (
                          <li key={r.key}>
                            <button
                              type="button"
                              aria-expanded={rOpen}
                              aria-controls={rId}
                              onClick={() => setRegion((x) => (x === r.key ? null : r.key))}
                              className={`${subLink} flex min-h-[44px] w-full items-center justify-between ps-3 text-start focus-visible:text-acid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid ${rOpen ? 'text-acid' : 'text-paper/90'}`}
                            >
                              <span className="flex items-center gap-2">
                                {flag && <Flag code={flag} className="h-3 w-auto shrink-0 text-paper" />}
                                {r.title}
                              </span>
                              <span className="flex items-center gap-2 text-paper/60">
                                <span aria-hidden="true">{r.links.length.toLocaleString(isFa ? 'fa-IR' : 'en')}</span>
                                <ChevronDown className={`h-4 w-4 transition-transform motion-reduce:transition-none ${rOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                              </span>
                            </button>
                            <ul id={rId} hidden={!rOpen} className={`mb-2 ms-3 flex-col border-s border-paper/15 ps-4 ${rOpen ? 'flex' : 'hidden'}`}>
                              {r.links.map((l) => {
                                const own = isFa && !flag ? flagFor(l.href) : null;
                                return (
                                  <li key={l.href}>
                                    <Link
                                      href={l.href as any}
                                      aria-current={pathname === l.href ? 'page' : undefined}
                                      onClick={() => go(l.label, l.href)}
                                      className={`${subLink} flex min-h-[40px] items-center gap-2 transition-colors hover:text-acid focus-visible:text-acid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid ${
                                        l.isNew || pathname === l.href ? 'text-acid' : 'text-paper/85'
                                      }`}
                                    >
                                      {own && <Flag code={own} className="h-4 w-auto shrink-0 text-paper" />}
                                      <span>
                                        {l.label}
                                        {l.status && <StatusTag status={l.status} isFa={isFa} />}
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </li>
                        );
                      })}
                      {nav.start.links.map((l) => (
                        <li key={l.href}>
                          <Link
                            href={l.href as any}
                            onClick={() => go(l.label, l.href)}
                            className={`${subLink} flex min-h-[44px] items-center ps-3 text-paper/90 transition-colors hover:text-acid focus-visible:text-acid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid`}
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="flex flex-col">
                      {item.links.map((l) => (
                        <li key={l.href}>
                          <Link
                            href={l.href as any}
                            aria-current={pathname === l.href ? 'page' : undefined}
                            onClick={() => go(l.label, l.href)}
                            className={`${subLink} flex min-h-[44px] items-center ps-3 text-paper/90 transition-colors hover:text-acid focus-visible:text-acid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid`}
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-3 border-t border-paper/10 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
        <Link
          href={nav.cta.href as any}
          onClick={() => go(nav.cta.label, nav.cta.href, 'cta')}
          className={`${action} bg-acid px-6 py-4 text-center text-ink transition-colors hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid`}
        >
          {nav.cta.label}
        </Link>
        <div className={`flex items-center justify-between gap-4 ${isFa ? 'font-vazir text-sm' : 'font-sans text-sm'}`}>
          {nav.secondary && (
            <Link
              href={nav.secondary.href as any}
              onClick={() => go(nav.secondary!.label, nav.secondary!.href)}
              className="py-2 text-paper underline decoration-acid underline-offset-4 hover:text-acid focus-visible:text-acid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid"
            >
              {nav.secondary.label}
            </Link>
          )}
          <span className="flex items-center gap-4">
            <Link
              href={langHref as any}
              locale={otherLocale}
              hrefLang={otherLocale}
              lang={otherLocale}
              onClick={() => go(nav.ui.otherLanguage, langHref)}
              className={`py-2 text-paper/80 hover:text-acid focus-visible:text-acid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid ${otherLocale === 'fa' ? 'font-vazir' : 'font-sans'}`}
            >
              {nav.ui.otherLanguage}
            </Link>
            {nav.login && (
              <Link
                href={nav.login.href as any}
                onClick={() => go(nav.login!.label, nav.login!.href)}
                className="py-2 text-paper/80 hover:text-acid focus-visible:text-acid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid"
              >
                {nav.login.label}
              </Link>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
