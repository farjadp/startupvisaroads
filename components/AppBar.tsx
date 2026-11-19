'use client';

// ============================================================================
// The slim "get the app" bar for phones, on every public page except blog
// articles (they carry ArticleAppCard), forms, booking, sign-in, unsubscribe,
// campaign landings and /app. Nothing is in the server HTML. It appears only
// after real interest (lib/app-prompt.ts hasEngaged), is fixed to the bottom
// so it moves nothing, covers 56px, and steps aside while the keyboard or the
// menu is open. One answer silences both prompts.
// ============================================================================
import { useEffect, useRef, useState } from 'react';
import { Play, X } from 'lucide-react';
import AppleMark from '@/components/AppleMark';
import { usePathname } from '@/navigation';
import type { AppBarCopy } from '@/content/app-card';
import { trackAppPrompt } from '@/lib/analytics';
import {
  barAllowedOn,
  detectPlatform,
  hasEngaged,
  isInAppBrowser,
  isKeyboardLikelyOpen,
  isQuiet,
  markShownThisVisit,
  shownThisVisit,
  openedFromApp,
  rememberOutcome,
  storeUrl,
  visitMemory,
  type AppPlatform,
  type AppPromptOutcome,
  type KeyValueStore,
} from '@/lib/app-prompt';

const PAGES_KEY = 'vr_pages';
// Distinct pages this visit, kept here when sessionStorage is blocked.
const pagesSeen = new Set<string>();

function session(): KeyValueStore | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function local(): KeyValueStore | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function countPage(pathname: string): number {
  pagesSeen.add(pathname);
  try {
    const stored = new Set<string>(JSON.parse(window.sessionStorage.getItem(PAGES_KEY) ?? '[]') as string[]);
    stored.add(pathname);
    window.sessionStorage.setItem(PAGES_KEY, JSON.stringify([...stored].slice(-20)));
    return Math.max(stored.size, pagesSeen.size);
  } catch {
    return pagesSeen.size;
  }
}

/** The keyboard, a focused field, or the open mobile menu (it locks body scroll). */
function somethingElseIsUp(): boolean {
  const el = document.activeElement;
  const typing = el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  const vv = window.visualViewport;
  return typing || (vv ? isKeyboardLikelyOpen(vv.height, window.innerHeight) : false) || document.body.style.overflow === 'hidden';
}

type Device = { platform: AppPlatform; href: string; inApp: boolean };

export default function AppBar({ locale, copy }: { locale: 'en' | 'fa'; copy: AppBarCopy }) {
  const pathname = usePathname();
  const [device, setDevice] = useState<Device | null>(null);
  const [engaged, setEngaged] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [closed, setClosed] = useState(false);
  const shownRef = useRef(false);

  // Once per load: is this a phone that has not answered yet?
  useEffect(() => {
    if (visitMemory.answered) return;
    const userAgent = navigator.userAgent;
    const platform = detectPlatform({
      userAgent,
      shortestSide: Math.min(window.screen.width, window.screen.height),
      webdriver: navigator.webdriver,
    });
    if (!platform || openedFromApp(document.referrer) || isQuiet(local(), Date.now(), shownThisVisit(session()))) return;
    const href = storeUrl(platform, locale, process.env.NEXT_PUBLIC_APP_STORE_PROVIDER_TOKEN || undefined, 'bar');
    if (!href) return;
    setDevice({ platform, href, inApp: isInAppBrowser(userAgent, 'TelegramWebview' in window || 'TelegramWebviewProxy' in window) });
  }, [locale]);

  // Per page: count it, then watch time and scroll until the visitor has shown interest.
  useEffect(() => {
    if (!device || engaged || !barAllowedOn(pathname)) return;
    const pages = countPage(pathname);
    const start = Date.now();
    let scrolled = 0;
    const onScroll = () => {
      scrolled = Math.max(scrolled, window.scrollY);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const timer = window.setInterval(() => {
      if (hasEngaged({ pagesThisVisit: pages, dwellMs: Date.now() - start, scrolledPx: scrolled, viewportPx: window.innerHeight })) {
        setEngaged(true);
      }
    }, 1_000);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearInterval(timer);
    };
  }, [device, engaged, pathname]);

  // While visible, step aside for the keyboard, a focused field or the menu.
  useEffect(() => {
    if (!device || !engaged || closed) return;
    const check = () => setBlocked(somethingElseIsUp());
    check();
    const vv = window.visualViewport;
    window.addEventListener('focusin', check);
    window.addEventListener('focusout', check);
    vv?.addEventListener('resize', check);
    const timer = window.setInterval(check, 500);
    return () => {
      window.removeEventListener('focusin', check);
      window.removeEventListener('focusout', check);
      vv?.removeEventListener('resize', check);
      window.clearInterval(timer);
    };
  }, [device, engaged, closed]);

  const visible = Boolean(device && engaged && !closed && !blocked && barAllowedOn(pathname));
  const analytics = device && {
    platform: device.platform,
    locale,
    browser: device.inApp ? ('in_app' as const) : ('standard' as const),
    placement: 'bar' as const,
  };

  useEffect(() => {
    if (!visible || !analytics || shownRef.current) return;
    shownRef.current = true;
    trackAppPrompt('app_prompt_shown', analytics);
    rememberOutcome(local(), 'seen', Date.now());
    markShownThisVisit(session());
  }, [visible, analytics]);

  if (!visible || !device || !analytics) return null;

  const answer = (outcome: AppPromptOutcome) => {
    visitMemory.answered = true;
    rememberOutcome(local(), outcome, Date.now());
  };
  const fa = locale === 'fa';

  return (
    <aside
      lang={locale}
      dir={fa ? 'rtl' : 'ltr'}
      aria-label={copy.name[device.platform]}
      className={`fixed inset-x-0 bottom-0 z-30 bg-[#1a1a1a] pb-[env(safe-area-inset-bottom)] text-[#F2F0E9] ${fa ? 'font-vazir' : 'font-sans'}`}
    >
      <div className="flex h-14 items-center gap-2 ps-4 pe-1">
        <span className="min-w-0 flex-1 text-[13px] leading-tight min-[360px]:text-sm">{copy.line}</span>
        {/* Same tab on purpose: in-app browsers often block new windows. */}
        <a
          href={device.href}
          onClick={() => {
            answer('clicked');
            trackAppPrompt('app_prompt_click', analytics);
          }}
          className="inline-flex h-11 shrink-0 items-center gap-1.5 bg-[#CCFF00] px-3.5 text-sm font-bold text-[#1a1a1a] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#1a1a1a]"
        >
          {device.platform === 'ios' ? <AppleMark className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" aria-hidden />}
          {copy.store[device.platform]}
        </a>
        <button
          type="button"
          onClick={() => {
            answer('dismissed');
            trackAppPrompt('app_prompt_dismiss', analytics);
            setClosed(true);
          }}
          aria-label={copy.dismiss}
          className="flex h-11 w-11 shrink-0 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#CCFF00]"
        >
          <X className="h-[18px] w-[18px]" aria-hidden />
        </button>
      </div>
    </aside>
  );
}
