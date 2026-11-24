// ============================================================================
// Component: components/Header.tsx
// Option A (chosen 23 Nov 2026): five top items, a Destinations panel grouped
// by region, one CTA to the route quiz. The link lists live in lib/nav.ts,
// shared with the drawer and the footer.
//
// Menus follow the disclosure pattern, not role="menu": a real button with
// aria-expanded opens each panel on click or Enter (hover too, for a mouse),
// Escape closes it and returns focus to the button, and focus leaving the
// item closes it.
// ============================================================================

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Menu } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { localeSwitchTarget } from '@/lib/fa/paths';
import { NAV, type NavLocale } from '@/lib/nav';
import { trackNav } from '@/lib/analytics';
import DestinationsPanel from '@/components/nav/DestinationsPanel';
import MobileDrawer from '@/components/nav/MobileDrawer';

const HOVER_CLOSE_MS = 160;

export default function Header() {
  const locale = (useLocale() === 'fa' ? 'fa' : 'en') as NavLocale;
  const isFa = locale === 'fa';
  const nav = NAV[locale];
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // A mouse that hovers a panel open and then clicks must not close it.
  const openedByHover = useRef<string | null>(null);
  const barRef = useRef<HTMLElement>(null);

  // /fa and /en are different sites: the switch goes to the paired page, or
  // to the other home, never to a path that 301s.
  const otherLocale: NavLocale = isFa ? 'en' : 'fa';
  const langHref = localeSwitchTarget(pathname, otherLocale) || '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A new page closes everything.
  useEffect(() => {
    setOpenMenu(null);
    setDrawerOpen(false);
  }, [pathname]);

  // Escape closes an open panel and puts focus back on its button; a click
  // outside the bar closes it too.
  useEffect(() => {
    if (!openMenu) {
      openedByHover.current = null;
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const key = openMenu;
      setOpenMenu(null);
      triggers.current[key]?.focus();
    };
    const onDown = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [openMenu]);

  const cancelHoverClose = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };
  const hoverOpen = (key: string) => (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    cancelHoverClose();
    setOpenMenu((m) => {
      if (m !== key) openedByHover.current = key;
      return key;
    });
  };
  const hoverClose = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    cancelHoverClose();
    hoverTimer.current = setTimeout(() => setOpenMenu(null), HOVER_CLOSE_MS);
  };
  const blurClose = (key: string) => (e: React.FocusEvent<HTMLElement>) => {
    // Safari does not focus a link on click, so relatedTarget is null there;
    // outside clicks are handled by the mousedown listener instead.
    if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) {
      setOpenMenu((m) => (m === key ? null : m));
    }
  };

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    // The bar is inert while the drawer is open; focus it once the drawer's
    // cleanup has lifted that, or the call is silently ignored.
    setTimeout(() => menuButtonRef.current?.focus(), 0);
  }, []);

  // On the paper background the bar is ink on paper; once scrolled it turns ink.
  const onDark = scrolled;
  const text = onDark ? 'text-paper' : 'text-ink';
  const navLabel = isFa
    ? 'font-vazir text-[13.5px] font-bold'
    : 'font-sans text-xs font-bold uppercase tracking-[0.15em]';
  const action = isFa
    ? 'font-vazir text-[13.5px] font-bold'
    : 'font-sans text-xs font-bold uppercase tracking-widest';
  // Acid on paper is ~1:1, so before the bar turns dark the accent for
  // hover, open and focus is ink: an underline, not a colour change.
  const focusRing = `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
    onDark ? 'focus-visible:outline-acid' : 'focus-visible:outline-ink'
  }`;
  const hoverAccent = onDark ? 'hover:text-acid' : 'hover:underline hover:decoration-2 hover:underline-offset-8';
  const openAccent = onDark ? 'text-acid' : `${text} underline decoration-2 underline-offset-8`;
  const barAccent = onDark ? 'bg-acid' : 'bg-ink';

  const click = (label: string, href: string, area: 'header' | 'cta' = 'header') =>
    trackNav({ locale, area, label, href });

  return (
    <>
      <header
        ref={barRef}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,padding] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none ${
          scrolled ? 'border-b border-acid/20 bg-ink py-4 shadow-2xl' : 'bg-transparent py-8 md:py-10'
        }`}
      >
        <div className="container relative mx-auto flex items-center justify-between gap-6 px-6 lg:px-12">
          <Link
            href="/"
            onClick={() => click('VisaRoads', '/')}
            className={`relative z-10 shrink-0 font-serif text-3xl font-bold tracking-tight transition-colors ${text} ${focusRing}`}
          >
            VisaRoads
            <span className={`text-acid transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0'}`}>.</span>
          </Link>

          {/* Desktop */}
          <nav aria-label={nav.ui.primaryNav} className="hidden lg:block">
            <ul className="flex items-center gap-8 xl:gap-10">
              {nav.top.map((item) => {
                if (item.kind === 'link') {
                  const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href as any}
                        aria-current={pathname === item.href ? 'page' : undefined}
                        onClick={() => click(item.label, item.href)}
                        className={`relative py-2 ${navLabel} transition-colors ${hoverAccent} ${text} ${focusRing}`}
                      >
                        {item.label}
                        {current && <span className={`absolute -bottom-1 start-0 h-[2px] w-full ${barAccent}`} aria-hidden="true" />}
                      </Link>
                    </li>
                  );
                }
                const key = item.kind === 'destinations' ? 'destinations' : item.key;
                const panelId = `nav-panel-${key}`;
                const expanded = openMenu === key;
                const wide = item.kind === 'destinations';
                return (
                  <li
                    key={key}
                    className={wide ? '' : 'relative'}
                    onPointerEnter={hoverOpen(key)}
                    onPointerLeave={hoverClose}
                    onBlur={blurClose(key)}
                  >
                    <button
                      ref={(el) => {
                        triggers.current[key] = el;
                      }}
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => {
                        if (openedByHover.current === key) {
                          openedByHover.current = null;
                          return;
                        }
                        setOpenMenu(expanded ? null : key);
                      }}
                      className={`flex items-center gap-1 py-2 ${navLabel} transition-colors ${hoverAccent} ${expanded ? openAccent : text} ${focusRing}`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-3 w-3 opacity-60 transition-transform motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                    {/* The panel hangs from the bar, not the button: the
                        Destinations panel spans the container width; About
                        is a short list under its own button. pt bridges the
                        gap so the pointer can travel into it. */}
                    <div
                      className={`absolute top-full z-20 pt-4 ${expanded ? 'block' : 'hidden'} ${
                        wide ? 'inset-x-6 lg:inset-x-12' : 'end-0 w-max min-w-[240px]'
                      }`}
                    >
                      {item.kind === 'destinations' ? (
                        <DestinationsPanel id={panelId} nav={nav} locale={locale} pathname={pathname} onNavigate={() => setOpenMenu(null)} />
                      ) : (
                        <ul id={panelId} className="flex flex-col gap-1 border-t-2 border-acid bg-ink p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                          {item.links.map((l) => (
                            <li key={l.href}>
                              <Link
                                href={l.href as any}
                                aria-current={pathname === l.href ? 'page' : undefined}
                                onClick={() => {
                                  trackNav({ locale, area: 'header', label: l.label, href: l.href });
                                  setOpenMenu(null);
                                }}
                                className={`block py-1.5 ${isFa ? 'font-vazir text-[15px]' : 'font-serif text-base'} transition-colors hover:text-acid focus-visible:text-acid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid ${
                                  pathname === l.href ? 'text-acid' : 'text-paper/85'
                                }`}
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

          <div className="flex items-center gap-4">
            <Link
              href={langHref as any}
              locale={otherLocale}
              hrefLang={otherLocale}
              lang={otherLocale}
              onClick={() => click(nav.ui.otherLanguage, langHref)}
              className={`hidden border px-3 py-2 lg:inline-block ${
                otherLocale === 'fa' ? 'font-vazir text-[13px] font-bold' : 'font-sans text-xs font-bold tracking-widest'
              } transition-colors hover:border-acid hover:bg-acid hover:text-ink ${
                onDark ? 'border-paper/25 text-paper' : 'border-ink/25 text-ink'
              } ${focusRing}`}
            >
              {nav.ui.otherLanguage}
            </Link>

            <Link
              href={nav.cta.href as any}
              onClick={() => click(nav.cta.label, nav.cta.href, 'cta')}
              className={`group hidden items-center gap-3 bg-acid px-6 py-3 text-ink transition-colors lg:flex ${action} ${
                onDark ? 'hover:bg-paper' : 'hover:bg-ink hover:text-acid'
              } ${focusRing}`}
            >
              {nav.cta.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              aria-label={nav.ui.menu}
              className={`flex h-11 w-11 items-center justify-center transition-colors lg:hidden ${text} ${focusRing}`}
            >
              <Menu className="h-8 w-8" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer
        id="mobile-drawer"
        open={drawerOpen}
        onClose={closeDrawer}
        nav={nav}
        locale={locale}
        pathname={pathname}
        langHref={langHref}
        otherLocale={otherLocale}
      />
    </>
  );
}
