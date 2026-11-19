// ============================================================================
// The rules behind the phone "get the app" prompts: the card inside blog
// articles (components/blog/ArticleAppCard.tsx) and the slim bar on every
// other page (components/AppBar.tsx). Pure functions, so every decision is
// testable without a browser: who counts as a phone, when a visitor has shown
// interest, where the card goes, where nothing may appear, how long an answer
// lasts. Both prompts share one answer: a "no" to one silences the other.
// ============================================================================
import { APP_STORE_LINKS } from '@/lib/app-links';

export type AppPlatform = 'ios' | 'android';
export type AppPromptOutcome = 'seen' | 'dismissed' | 'clicked';

export const STORAGE_KEY = 'vr_app_prompt';

/**
 * The answer for this visit, shared by the card and the bar. It also stands
 * in for localStorage when storage is blocked.
 */
export const visitMemory = { answered: false };
const DAY_MS = 86_400_000;
/** Seen and ignored: a week off, so it is not in every article. "No": three months. Tapped: a year. */
export const QUIET_DAYS: Record<AppPromptOutcome, number> = { seen: 7, dismissed: 90, clicked: 365 };

const BOT = /bot\b|bot\/|crawl|spider|slurp|lighthouse|pagespeed|headless|google-inspectiontool|googleother/i;

export type DeviceSignals = {
  userAgent: string;
  /** The shorter side of the screen in CSS px. Android tablets and unfolded foldables fail this. */
  shortestSide: number;
  webdriver?: boolean;
};

/**
 * The store to offer, or null for anything that is not clearly a phone. iPads
 * report a Mac user agent (and the app is listed for iPhone), Android tablets
 * omit "Mobile", and "desktop site" on a phone looks like a desktop: all of
 * them get nothing, which is the safe side of a wrong guess.
 */
export function detectPlatform({ userAgent, shortestSide, webdriver }: DeviceSignals): AppPlatform | null {
  if (webdriver || BOT.test(userAgent) || shortestSide >= 600) return null;
  if (/\b(iPhone|iPod)\b/.test(userAgent)) return 'ios';
  if (/\bAndroid\b/.test(userAgent) && /\bMobile\b/.test(userAgent)) return 'android';
  return null;
}

/** Telegram, Instagram and friends. Reported to analytics, because store links behave differently there. */
export function isInAppBrowser(userAgent: string, hasTelegramBridge = false): boolean {
  return (
    hasTelegramBridge ||
    /Telegram|Instagram|FBAN|FBAV|FB_IAB|Twitter|LinkedInApp|Snapchat|TikTok|musical_ly|BytedanceWebview|Line\/|MicroMessenger|; wv\)/i.test(userAgent)
  );
}

/** The site opened from inside our own Android app (Custom Tabs sets this referrer). */
export function openedFromApp(referrer: string): boolean {
  return referrer.startsWith('android-app://com.ashavid.visaroads');
}

export type ArticleBlock = { tag: string; top: number };

// Older articles put running text straight into the body, so a link or bold
// phrase can be the block before a heading. Those count as text too.
const TEXT_BLOCKS = new Set(['P', 'UL', 'OL', 'A', 'STRONG', 'EM', 'B', 'I', 'SUP', 'SPAN', 'CODE']);

/**
 * Where the card goes: the index of the block to insert before, or -1. Past
 * the first quarter of the article, so a reader meets it after a section or
 * two, at a section break when one comes before mid-article, and always right
 * after running text so it never splits a heading from its paragraph or
 * crowds another box. `minTop` (px from the article top) keeps it below the
 * reader's screen; see isSafeToInsert.
 */
export function pickInsertIndex(blocks: ArticleBlock[], articleHeight: number, minTop = 0): number {
  if (articleHeight <= 0) return -1;
  const candidates = blocks.flatMap((block, i) => {
    const position = block.top / articleHeight;
    const afterText = i > 0 && TEXT_BLOCKS.has(blocks[i - 1].tag);
    const ok = afterText && block.top >= minTop && position >= 0.25 && position <= 0.85 && (block.tag === 'H2' || block.tag === 'P');
    return ok ? [{ i, tag: block.tag, position }] : [];
  });
  return (candidates.find((c) => c.tag === 'H2' && c.position <= 0.5) ?? candidates[0])?.i ?? -1;
}

/** A quarter screen of margin below what the reader sees. */
export const SAFE_MARGIN_SCREENS = 1.25;

/**
 * The card may enter the page only below what the reader can see, with a
 * margin. Nothing on screen moves, on browsers without scroll anchoring too.
 */
export function isSafeToInsert(slotTopInViewport: number, viewportHeight: number): boolean {
  return viewportHeight > 0 && slotTopInViewport >= viewportHeight * SAFE_MARGIN_SCREENS;
}

/** Second page of the visit: a few seconds, so the bar never lands mid-navigation. */
export const SECOND_PAGE_DWELL_MS = 4_000;
/** First page: a screen read, over at least fifteen seconds. */
export const FIRST_PAGE_DWELL_MS = 15_000;
export const FIRST_PAGE_SCROLL_SCREENS = 1;

export type Engagement = { pagesThisVisit: number; dwellMs: number; scrolledPx: number; viewportPx: number };

/** When the bar may appear: never at first paint, only after real interest. */
export function hasEngaged({ pagesThisVisit, dwellMs, scrolledPx, viewportPx }: Engagement): boolean {
  if (pagesThisVisit >= 2 && dwellMs >= SECOND_PAGE_DWELL_MS) return true;
  return dwellMs >= FIRST_PAGE_DWELL_MS && viewportPx > 0 && scrolledPx >= viewportPx * FIRST_PAGE_SCROLL_SCREENS;
}

/**
 * Pages where the bar never appears: forms, booking, sign-in, unsubscribe,
 * campaign landings, the app page (Safari's own banner is there), tools with
 * inputs. Paths come without the locale (usePathname from @/navigation).
 */
export const BAR_EXCLUDED = [
  '/admin',
  '/login',
  '/contact',
  '/book-meeting',
  '/unsubscribe',
  '/landing',
  '/app',
  '/webinar',
  '/which-path',
  '/startupworkpermit',
  '/tools',
  '/usa/assessment',
] as const;

/** Blog articles carry the inline card instead; the blog index gets the bar. */
export function isArticlePath(pathname: string): boolean {
  return /^\/blog\/(?!category\/)[^/]+\/?$/.test(pathname);
}

export function barAllowedOn(pathname: string): boolean {
  if (isArticlePath(pathname)) return false;
  return !BAR_EXCLUDED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** The on-screen keyboard shrinks the visual viewport well below the layout one. */
export function isKeyboardLikelyOpen(visualHeight: number, layoutHeight: number): boolean {
  return layoutHeight > 0 && visualHeight / layoutHeight < 0.75;
}

export type KeyValueStore = Pick<Storage, 'getItem' | 'setItem'>;

/**
 * True while an earlier answer still stands. Blocked or corrupt storage reads
 * as "no answer". A view with no answer only quiets later visits: within the
 * same visit (`sameVisit`) a reload must not make the prompt vanish.
 */
export function isQuiet(store: KeyValueStore | null, now: number, sameVisit = false): boolean {
  if (!store) return false;
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return false;
    const { until, outcome } = JSON.parse(raw) as { until?: unknown; outcome?: unknown };
    if (outcome === 'seen' && sameVisit) return false;
    return typeof until === 'number' && until > now;
  } catch {
    return false;
  }
}

const VISIT_KEY = 'vr_app_prompt_visit';

/** Marks this browser tab's visit as one in which a prompt was shown. */
export function markShownThisVisit(session: KeyValueStore | null): void {
  try {
    session?.setItem(VISIT_KEY, '1');
  } catch {
    // Blocked: visitMemory in the components covers client-side navigation.
  }
}

export function shownThisVisit(session: KeyValueStore | null): boolean {
  try {
    return session?.getItem(VISIT_KEY) === '1';
  } catch {
    return false;
  }
}

export function rememberOutcome(store: KeyValueStore | null, outcome: AppPromptOutcome, now: number): void {
  if (!store) return;
  try {
    store.setItem(STORAGE_KEY, JSON.stringify({ outcome, until: now + QUIET_DAYS[outcome] * DAY_MS }));
  } catch {
    // Private mode or a full disk: the component's in-memory flag still holds for this visit.
  }
}

/**
 * The listing with campaign data, so installs can be traced to this prompt.
 * Google Play reads `referrer`. Apple needs the provider token from App Store
 * Connect for `ct` to count, so without one the plain link is used.
 */
export type PromptPlacement = 'article' | 'bar';

export function storeUrl(platform: AppPlatform, locale: string, appleProviderToken?: string, placement: PromptPlacement = 'article'): string | null {
  const campaign = `web_${placement === 'bar' ? 'bar' : 'prompt'}_${locale === 'fa' ? 'fa' : 'en'}`;
  const base = platform === 'ios' ? APP_STORE_LINKS.appStore : APP_STORE_LINKS.googlePlay;
  if (!base) return null;
  const url = new URL(base);
  if (platform === 'android') {
    url.searchParams.set('referrer', `utm_source=visaroads.com&utm_medium=app_prompt&utm_campaign=${campaign}`);
  } else if (appleProviderToken) {
    url.searchParams.set('pt', appleProviderToken);
    url.searchParams.set('ct', campaign);
    url.searchParams.set('mt', '8');
  }
  return url.toString();
}
