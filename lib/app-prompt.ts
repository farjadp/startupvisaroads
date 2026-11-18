// ============================================================================
// The rules behind the phone "get the app" card inside blog articles
// (components/blog/ArticleAppCard.tsx). Pure functions, so every decision is
// testable without a browser: who counts as a phone, where in an article the
// card may go, whether inserting it now could move what the reader sees, and
// how long an answer lasts.
// ============================================================================
import { APP_STORE_LINKS } from '@/lib/app-links';

export type AppPlatform = 'ios' | 'android';
export type AppPromptOutcome = 'seen' | 'dismissed' | 'clicked';

export const STORAGE_KEY = 'vr_app_prompt';
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

const TEXT_BLOCKS = new Set(['P', 'UL', 'OL']);

/**
 * Where the card goes: the index of the block to insert before, or -1. It sits
 * in the second half of the article, so only someone reading deep ever meets
 * it, preferably at a section break, and always right after running text so it
 * never splits a heading from its paragraph or crowds another box.
 */
export function pickInsertIndex(blocks: ArticleBlock[], articleHeight: number): number {
  if (articleHeight <= 0) return -1;
  const candidates = blocks.flatMap((block, i) => {
    const position = block.top / articleHeight;
    const afterText = i > 0 && TEXT_BLOCKS.has(blocks[i - 1].tag);
    return afterText && position >= 0.5 && position <= 0.85 ? [{ i, tag: block.tag }] : [];
  });
  return (candidates.find((c) => c.tag === 'H2') ?? candidates.find((c) => c.tag === 'P'))?.i ?? -1;
}

/**
 * The card may enter the page only a full screen below what the reader can
 * see. Nothing on screen moves, on browsers without scroll anchoring too.
 */
export function isSafeToInsert(slotTopInViewport: number, viewportHeight: number): boolean {
  return viewportHeight > 0 && slotTopInViewport >= viewportHeight * 2;
}

export type KeyValueStore = Pick<Storage, 'getItem' | 'setItem'>;

/** True while an earlier answer still stands. Blocked or corrupt storage reads as "no answer". */
export function isQuiet(store: KeyValueStore | null, now: number): boolean {
  if (!store) return false;
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return false;
    const until = (JSON.parse(raw) as { until?: unknown }).until;
    return typeof until === 'number' && until > now;
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
export function storeUrl(platform: AppPlatform, locale: string, appleProviderToken?: string): string | null {
  const campaign = `web_prompt_${locale === 'fa' ? 'fa' : 'en'}`;
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
