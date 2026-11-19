'use client';

// ============================================================================
// The "get the app" card inside blog articles, for phones only. Nothing is in
// the server HTML, so crawlers and the first paint never meet it. After load
// it is placed after the first quarter of the article, and only below what the
// reader can see, so nothing visible moves (no layout shift).
// The rules are in lib/app-prompt.ts.
// ============================================================================
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Play, X } from 'lucide-react';
import AppleMark from '@/components/AppleMark';
import type { AppCardCopy } from '@/content/app-card';
import { trackAppPrompt } from '@/lib/analytics';
import {
  detectPlatform,
  isInAppBrowser,
  isQuiet,
  markShownThisVisit,
  shownThisVisit,
  isSafeToInsert,
  openedFromApp,
  pickInsertIndex,
  rememberOutcome,
  SAFE_MARGIN_SCREENS,
  storeUrl,
  type AppPlatform,
  type AppPromptOutcome,
  type KeyValueStore,
  visitMemory,
} from '@/lib/app-prompt';

const INSERT_DELAY_MS = 2_500;

function session(): KeyValueStore | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function storage(): KeyValueStore | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

type Placement = { host: HTMLElement; platform: AppPlatform; href: string; inApp: boolean };

function placeCard(article: HTMLElement, locale: string): Placement | null {
  const userAgent = navigator.userAgent;
  const platform = detectPlatform({
    userAgent,
    shortestSide: Math.min(window.screen.width, window.screen.height),
    webdriver: navigator.webdriver,
  });
  if (!platform || openedFromApp(document.referrer) || isQuiet(storage(), Date.now(), shownThisVisit(session()))) return null;
  const href = storeUrl(platform, locale, process.env.NEXT_PUBLIC_APP_STORE_PROVIDER_TOKEN || undefined);
  if (!href) return null;

  const articleTop = article.getBoundingClientRect().top;
  const children = Array.from(article.children);
  const blocks = children.map((el) => ({ tag: el.tagName, top: el.getBoundingClientRect().top - articleTop }));
  const minTop = window.innerHeight * SAFE_MARGIN_SCREENS - articleTop;
  const target = children[pickInsertIndex(blocks, article.offsetHeight, minTop)];
  if (!target || !isSafeToInsert(target.getBoundingClientRect().top, window.innerHeight)) return null;

  const host = document.createElement('div');
  article.insertBefore(host, target);
  const inApp = isInAppBrowser(userAgent, 'TelegramWebview' in window || 'TelegramWebviewProxy' in window);
  return { host, platform, href, inApp };
}

export default function ArticleAppCard({ articleId, locale, copy }: { articleId: string; locale: 'en' | 'fa'; copy: AppCardCopy }) {
  const [placement, setPlacement] = useState<Placement | null>(null);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (visitMemory.answered) return;
    let host: HTMLElement | null = null;
    const timer = window.setTimeout(() => {
      const article = document.getElementById(articleId);
      const placed = article && placeCard(article, locale);
      if (!placed) return;
      host = placed.host;
      setPlacement(placed);
    }, INSERT_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
      host?.remove();
    };
  }, [articleId, locale]);

  const analytics = placement && {
    platform: placement.platform,
    locale,
    browser: placement.inApp ? ('in_app' as const) : ('standard' as const),
  };
  const platform = placement?.platform;
  const browser = analytics?.browser;

  // "Shown" means half the card was actually on screen, not merely in the page.
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !platform || !browser) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        trackAppPrompt('app_prompt_shown', { platform, locale, browser });
        rememberOutcome(storage(), 'seen', Date.now());
        markShownThisVisit(session());
        visitMemory.answered = true;
      },
      { threshold: 0.5 },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [platform, browser, locale]);

  if (!placement || !analytics) return null;

  const answer = (outcome: AppPromptOutcome) => {
    visitMemory.answered = true;
    rememberOutcome(storage(), outcome, Date.now());
  };

  const dismiss = () => {
    answer('dismissed');
    trackAppPrompt('app_prompt_dismiss', analytics);
    // Keep keyboard and screen-reader users where the card was.
    const next = placement.host.nextElementSibling as HTMLElement | null;
    placement.host.remove();
    setPlacement(null);
    if (next) {
      next.tabIndex = -1;
      next.focus({ preventScroll: true });
    }
  };

  const fa = locale === 'fa';
  const StoreMark = placement.platform === 'ios' ? <AppleMark className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" aria-hidden />;

  return createPortal(
    <aside
      ref={cardRef}
      lang={locale}
      dir={fa ? 'rtl' : 'ltr'}
      aria-label={copy.name[placement.platform]}
      className={`relative my-10 bg-[#1a1a1a] p-5 text-[#F2F0E9] ${fa ? 'font-vazir' : 'font-sans'}`}
    >
      <div className="flex min-h-11 items-center gap-2 pe-9">
        <Image src="/img/app-icon-144.png" alt="" width={44} height={44} className="!my-0 !-ms-2 !me-0 h-11 w-11 !rounded-none !border-0 !shadow-none" />
        <span className={`text-[#CCFF00] ${fa ? 'text-sm font-bold' : 'text-xs font-bold uppercase tracking-widest'}`}>{copy.label}</span>
      </div>
      {/* Divs, not p: the site's .prose rules in globals.css restyle every p in the article. */}
      <div className={`mt-2.5 ${fa ? 'font-estedad text-[23px] font-black leading-[1.55]' : 'font-serif text-[28px] leading-[1.14]'}`}>
        {copy.heading}
      </div>
      <div className={`mt-2.5 text-[15px] ${fa ? 'leading-[1.9]' : 'leading-[1.55]'}`}>{copy.body}</div>
      {/* Same tab on purpose: in-app browsers often block new windows, and the
          store app takes over from an ordinary https link. */}
      <a
        href={placement.href}
        onClick={() => {
          answer('clicked');
          trackAppPrompt('app_prompt_click', analytics);
        }}
        className="mt-[18px] flex h-12 w-full items-center justify-center gap-2 border-0 bg-[#CCFF00] text-[15px] font-bold !text-[#1a1a1a] !no-underline hover:!bg-[#CCFF00] focus:!bg-[#CCFF00] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#1a1a1a]"
      >
        {StoreMark}
        {copy.cta[placement.platform]}
      </a>
      <button
        type="button"
        onClick={dismiss}
        aria-label={copy.dismiss}
        className="absolute end-2 top-2 flex h-11 w-11 items-center justify-center text-[#F2F0E9] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#CCFF00]"
      >
        <X className="h-[18px] w-[18px]" aria-hidden />
      </button>
    </aside>,
    placement.host,
  );
}
