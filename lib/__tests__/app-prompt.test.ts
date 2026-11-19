import { describe, expect, it } from 'vitest';
import {
  STORAGE_KEY,
  detectPlatform,
  barAllowedOn,
  hasEngaged,
  isArticlePath,
  isInAppBrowser,
  isKeyboardLikelyOpen,
  isQuiet,
  markShownThisVisit,
  shownThisVisit,
  isSafeToInsert,
  openedFromApp,
  pickInsertIndex,
  rememberOutcome,
  storeUrl,
  type KeyValueStore,
} from '@/lib/app-prompt';

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1';
const IPHONE_CHROME = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0 Mobile/15E148 Safari/604.1';
const IPAD = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15';
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Mobile Safari/537.36';
const ANDROID_TABLET = 'Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';
const GOOGLEBOT = 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const INSTAGRAM = `${IPHONE} Instagram 350.0`;
const ANDROID_WEBVIEW = 'Mozilla/5.0 (Linux; Android 14; Pixel 8; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0 Mobile Safari/537.36';

const phone = (userAgent: string, shortestSide = 390) => detectPlatform({ userAgent, shortestSide });

function memoryStore(): KeyValueStore & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v) };
}

describe('detectPlatform', () => {
  it('offers the App Store on iPhones, in any browser', () => {
    expect(phone(IPHONE)).toBe('ios');
    expect(phone(IPHONE_CHROME)).toBe('ios');
  });
  it('offers Google Play on Android phones', () => expect(phone(ANDROID)).toBe('android'));
  it('stays silent on iPads, Android tablets and unfolded foldables', () => {
    expect(phone(IPAD, 820)).toBeNull();
    expect(phone(ANDROID_TABLET, 800)).toBeNull();
    expect(phone(ANDROID, 720)).toBeNull();
  });
  it('stays silent for crawlers and automation', () => {
    expect(phone(GOOGLEBOT, 412)).toBeNull();
    expect(detectPlatform({ userAgent: ANDROID, shortestSide: 390, webdriver: true })).toBeNull();
  });
  it('stays silent for unknown devices', () => expect(phone('Mozilla/5.0 (X11; Linux x86_64)')).toBeNull());
});

describe('isInAppBrowser', () => {
  it('recognises social app browsers and Android webviews', () => {
    expect(isInAppBrowser(INSTAGRAM)).toBe(true);
    expect(isInAppBrowser(ANDROID_WEBVIEW)).toBe(true);
    expect(isInAppBrowser(IPHONE, true)).toBe(true);
  });
  it('leaves ordinary browsers alone', () => {
    expect(isInAppBrowser(IPHONE)).toBe(false);
    expect(isInAppBrowser(ANDROID)).toBe(false);
  });
});

it('recognises a visit that came from our own app', () => {
  expect(openedFromApp('android-app://com.ashavid.visaroads/')).toBe(true);
  expect(openedFromApp('https://www.google.com/')).toBe(false);
});

describe('pickInsertIndex', () => {
  const at = (tag: string, top: number) => ({ tag, top });

  it('takes the first section break after the first quarter', () => {
    const blocks = [at('H2', 0), at('P', 100), at('P', 280), at('H2', 320), at('P', 400), at('H2', 700)];
    expect(pickInsertIndex(blocks, 1000)).toBe(3);
  });
  it('falls back to the first paragraph break when no heading comes before mid-article', () => {
    expect(pickInsertIndex([at('P', 0), at('P', 300), at('P', 600), at('H2', 800)], 1000)).toBe(1);
  });
  it('keeps below the reader with minTop', () => {
    const blocks = [at('H2', 0), at('P', 100), at('H2', 300), at('P', 350), at('H2', 600), at('P', 650)];
    expect(pickInsertIndex(blocks, 1000, 500)).toBe(4);
  });
  it('accepts a heading after inline text in older articles', () => {
    expect(pickInsertIndex([at('H2', 0), at('UL', 100), at('A', 290), at('H2', 310), at('A', 780)], 1000)).toBe(3);
  });
  it('never separates a heading from its text or sits against another box', () => {
    expect(pickInsertIndex([at('H2', 0), at('H2', 350), at('DIV', 400), at('P', 650), at('DIV', 700)], 1000)).toBe(-1);
  });
  it('stays out of the opening and the very end', () => {
    expect(pickInsertIndex([at('P', 0), at('P', 200), at('P', 900)], 1000)).toBe(-1);
  });
  it('gives up on an empty article', () => expect(pickInsertIndex([], 0)).toBe(-1));
});

describe('isSafeToInsert', () => {
  it('needs the slot below the screen with a margin', () => {
    expect(isSafeToInsert(1100, 844)).toBe(true);
    expect(isSafeToInsert(900, 844)).toBe(false);
  });
  it('refuses a slot the reader has already passed', () => expect(isSafeToInsert(-200, 844)).toBe(false));
});

describe('hasEngaged (the bar)', () => {
  const base = { pagesThisVisit: 1, dwellMs: 0, scrolledPx: 0, viewportPx: 800 };
  it('is false at first paint', () => expect(hasEngaged(base)).toBe(false));
  it('needs both time and scroll on the first page', () => {
    expect(hasEngaged({ ...base, dwellMs: 60_000 })).toBe(false);
    expect(hasEngaged({ ...base, scrolledPx: 5_000, dwellMs: 3_000 })).toBe(false);
    expect(hasEngaged({ ...base, scrolledPx: 800, dwellMs: 15_000 })).toBe(true);
  });
  it('accepts a second page after a short pause', () => {
    expect(hasEngaged({ ...base, pagesThisVisit: 2, dwellMs: 1_000 })).toBe(false);
    expect(hasEngaged({ ...base, pagesThisVisit: 2, dwellMs: 4_000 })).toBe(true);
  });
});

describe('where the bar may appear', () => {
  it.each(['/admin/users', '/login', '/contact', '/book-meeting', '/unsubscribe', '/landing/pnp-landing', '/app', '/webinar', '/which-path', '/startupworkpermit', '/tools/express-entry', '/usa/assessment', '/blog/some-article'])(
    'not on %s',
    (p) => expect(barAllowedOn(p)).toBe(false),
  );
  it.each(['/', '/blog', '/blog/category/canada', '/country/finland', '/applications', '/contact-us-guide', '/usa/eb1'])('on %s', (p) =>
    expect(barAllowedOn(p)).toBe(true),
  );
  it('tells articles from the blog index and categories', () => {
    expect(isArticlePath('/blog/x')).toBe(true);
    expect(isArticlePath('/blog')).toBe(false);
    expect(isArticlePath('/blog/category/x')).toBe(false);
  });
});

it('reads a much shorter visual viewport as an open keyboard', () => {
  expect(isKeyboardLikelyOpen(400, 800)).toBe(true);
  expect(isKeyboardLikelyOpen(760, 800)).toBe(false);
});

describe('dismissal memory', () => {
  const now = Date.UTC(2026, 10, 18);
  const day = 86_400_000;

  it('keeps quiet for 90 days after a dismissal', () => {
    const s = memoryStore();
    rememberOutcome(s, 'dismissed', now);
    expect(isQuiet(s, now + 89 * day)).toBe(true);
    expect(isQuiet(s, now + 91 * day)).toBe(false);
  });
  it('keeps quiet for a year after a tap through', () => {
    const s = memoryStore();
    rememberOutcome(s, 'clicked', now);
    expect(isQuiet(s, now + 364 * day)).toBe(true);
    expect(isQuiet(s, now + 366 * day)).toBe(false);
  });
  it('steps back for a week after the card was seen and ignored', () => {
    const s = memoryStore();
    rememberOutcome(s, 'seen', now);
    expect(isQuiet(s, now + 6 * day)).toBe(true);
    expect(isQuiet(s, now + 8 * day)).toBe(false);
  });
  it('does not let an unanswered view hide the prompt again in the same visit', () => {
    const s = memoryStore();
    rememberOutcome(s, 'seen', now);
    expect(isQuiet(s, now + day, true)).toBe(false);
    rememberOutcome(s, 'dismissed', now);
    expect(isQuiet(s, now + day, true)).toBe(true);
  });
  it('remembers that a prompt was shown this visit', () => {
    const s = memoryStore();
    expect(shownThisVisit(s)).toBe(false);
    markShownThisVisit(s);
    expect(shownThisVisit(s)).toBe(true);
    expect(shownThisVisit(null)).toBe(false);
  });
  it('treats corrupt data as no answer', () => {
    const s = memoryStore();
    s.data.set(STORAGE_KEY, '{oops');
    expect(isQuiet(s, now)).toBe(false);
  });
  it('survives blocked storage', () => {
    const blocked: KeyValueStore = {
      getItem: () => { throw new Error('SecurityError'); },
      setItem: () => { throw new Error('SecurityError'); },
    };
    expect(isQuiet(blocked, now)).toBe(false);
    expect(() => rememberOutcome(blocked, 'dismissed', now)).not.toThrow();
    expect(isQuiet(null, now)).toBe(false);
    expect(() => rememberOutcome(null, 'clicked', now)).not.toThrow();
  });
});

describe('storeUrl', () => {
  it('tags Google Play with an install referrer', () => {
    const url = new URL(storeUrl('android', 'fa')!);
    expect(url.searchParams.get('id')).toBe('com.ashavid.visaroads');
    expect(url.searchParams.get('referrer')).toContain('utm_campaign=web_prompt_fa');
  });
  it('keeps the App Store link plain without a provider token', () => {
    expect(storeUrl('ios', 'en')).toBe('https://apps.apple.com/app/visaroads-immigration-routes/id6823019451');
  });
  it('names the bar as its own campaign', () => {
    expect(new URL(storeUrl('android', 'en', undefined, 'bar')!).searchParams.get('referrer')).toContain('utm_campaign=web_bar_en');
  });
  it('adds Apple campaign fields when a provider token exists', () => {
    const url = new URL(storeUrl('ios', 'en', '12345')!);
    expect(url.searchParams.get('pt')).toBe('12345');
    expect(url.searchParams.get('ct')).toBe('web_prompt_en');
  });
});
