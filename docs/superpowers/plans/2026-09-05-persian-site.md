# Persian Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the half-built `/fa` mirror with a standalone Persian site — its own IA, its own content, correct hreflang — inside the same Next.js codebase.

**Architecture:** `/fa` stops mirroring `/en`. A Persian path allowlist drives routing, sitemap, hreflang pairing, and the autopilot link inventory from one source of truth (`lib/fa/paths.ts`). Every `/fa` path outside that list 301s to `/en`. UI chrome lives in `messages/*.json`; page copy lives in typed `content/fa/*.ts` modules.

**Tech Stack:** Next.js 16 App Router, next-intl, Tailwind, Prisma, Vitest, `next/font/local` (Estedad).

**Spec:** `docs/superpowers/specs/2026-09-05-persian-site.md`

## Global Constraints

- TypeScript only. Functional React components only. Tailwind classes only — no inline styles.
- Tests live under `lib/**/__tests__/**/*.test.ts` — that is the only path `vitest.config.ts` includes. Any logic that needs a test must live under `lib/`.
- Run tests with `npm test` (`vitest run`). Typecheck with `npx tsc --noEmit`.
- Persian digits (۰–۹) in prose and dates. **Latin** digits for programme codes (EB-2, EB-5, SUV), currency amounts, and phone numbers.
- Jalali dates in Persian UI; ISO 8601 in every `<time datetime>` attribute and all JSON-LD.
- Persian copy is keyword-first Persian writing, never a translation of the English page.
- Positioning line, verbatim: «ما وکیل مهاجرتی نیستیم — شما را برای پذیرش آماده می‌کنیم.»
- Only messaging channel is Telegram: `https://t.me/farjadtalks` and `https://t.me/Heros_Journey`. There is no WhatsApp number.
- Commit after every task. Small, focused commits.

---

# Phase 1 — Foundation

Everything in Phase 1 is engineering with no Persian copywriting. It must all land before any Persian page is built, because Phase 2 pages consume `FA_PATHS`, the content-module type, and the Estedad font.

---

### Task 1: The Persian path allowlist

The single source of truth for "which paths exist in Persian". Sitemap, hreflang, middleware redirects, and the autopilot inventory all read from here — so the four can never drift apart.

**Files:**
- Create: `lib/fa/paths.ts`
- Test: `lib/fa/__tests__/paths.test.ts`

**Interfaces:**
- Produces: `FA_PATHS: readonly FaPath[]`, `type FaPath`, `isFaPath(path: string): boolean`, `FA_PAIRED: Record<FaPath, string | null>` (Persian path → the English path it is an hreflang pair with, or `null` when it has no English equivalent).

- [ ] **Step 1: Write the failing test**

```ts
// lib/fa/__tests__/paths.test.ts
import { describe, it, expect } from 'vitest';
import { FA_PATHS, FA_PAIRED, isFaPath } from '../paths';

describe('FA_PATHS', () => {
  it('contains the pillar page and the home path', () => {
    expect(FA_PATHS).toContain('');
    expect(FA_PATHS).toContain('/canada-startup-visa');
  });

  it('excludes retired mirror paths', () => {
    expect(FA_PATHS).not.toContain('/pnp/ontario');
    expect(FA_PATHS).not.toContain('/country/denmark');
    expect(FA_PATHS).not.toContain('/usa/eb5');
  });

  it('has no duplicates and every entry is normalised', () => {
    expect(new Set(FA_PATHS).size).toBe(FA_PATHS.length);
    for (const p of FA_PATHS) {
      expect(p === '' || p.startsWith('/')).toBe(true);
      expect(p.endsWith('/')).toBe(false);
    }
  });
});

describe('isFaPath', () => {
  it('accepts listed paths and rejects unlisted ones', () => {
    expect(isFaPath('/faq')).toBe(true);
    expect(isFaPath('/pnp/ontario')).toBe(false);
  });

  it('ignores a trailing slash', () => {
    expect(isFaPath('/faq/')).toBe(true);
  });
});

describe('FA_PAIRED', () => {
  it('covers every FA path exactly', () => {
    expect(Object.keys(FA_PAIRED).sort()).toEqual([...FA_PATHS].sort());
  });

  it('pairs shared paths with their English twin', () => {
    expect(FA_PAIRED['']).toBe('');
    expect(FA_PAIRED['/mentorship']).toBe('/mentorship');
    expect(FA_PAIRED['/blog']).toBe('/blog');
  });

  it('leaves Persian-only pages unpaired', () => {
    expect(FA_PAIRED['/canada-startup-visa/cost']).toBeNull();
    expect(FA_PAIRED['/which-path']).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/fa/__tests__/paths.test.ts`
Expected: FAIL — "Failed to resolve import ... ../paths"

- [ ] **Step 3: Write the implementation**

```ts
// ============================================================================
// lib/fa/paths.ts
// The Persian site's path allowlist — the one place that answers
// "does this page exist in Persian?".
//
// /fa is NOT a mirror of /en. Sitemap, hreflang pairing, the middleware
// redirect layer and the autopilot link inventory all read this list, so a
// page cannot be advertised in one place and 404 (or bounce to English) in
// another. Adding a Persian page means adding it here first.
// ============================================================================

/** Persian paths, locale-agnostic (no `/fa` prefix). `''` is the home page. */
export const FA_PATHS = [
  '',
  '/canada-startup-visa',
  '/canada-startup-visa/requirements',
  '/canada-startup-visa/cost',
  '/canada-startup-visa/designated-organizations',
  '/pnp',
  '/usa-eb2-niw',
  '/which-path',
  '/mentorship',
  '/faq',
  '/blog',
  '/about',
  '/contact',
  '/webinar',
] as const;

export type FaPath = (typeof FA_PATHS)[number];

const FA_SET: ReadonlySet<string> = new Set(FA_PATHS);

/** Strip one trailing slash so `/faq/` and `/faq` are the same path. */
function normalise(path: string): string {
  if (!path || path === '/') return '';
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

/** Does this locale-agnostic path exist on the Persian site? */
export function isFaPath(path: string): boolean {
  return FA_SET.has(normalise(path));
}

/**
 * Persian path → the English path it forms an hreflang pair with, or null
 * when the page is Persian-only. Only paired paths may emit hreflang
 * alternates; an unpaired Persian page that advertises an English twin sends
 * Google to a page that does not exist.
 */
export const FA_PAIRED: Record<FaPath, string | null> = {
  '': '',
  '/canada-startup-visa': '/startup-visa-canada',
  '/canada-startup-visa/requirements': null,
  '/canada-startup-visa/cost': null,
  '/canada-startup-visa/designated-organizations': null,
  '/pnp': '/pnp',
  '/usa-eb2-niw': '/usa/eb2-niw',
  '/which-path': null,
  '/mentorship': '/mentorship',
  '/faq': null,
  '/blog': '/blog',
  '/about': '/about',
  '/contact': '/contact',
  '/webinar': '/webinar',
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/fa/__tests__/paths.test.ts`
Expected: PASS, 7 tests

- [ ] **Step 5: Commit**

```bash
git add lib/fa/paths.ts lib/fa/__tests__/paths.test.ts
git commit -m "feat(fa): add the Persian path allowlist and hreflang pairing table"
```

---

### Task 2: hreflang pairing in `lib/seo.ts`

Today `buildAlternates` claims every path exists in both locales. That is the lie the sitemap repeats 37 times.

**Files:**
- Modify: `lib/seo.ts:58-69` (`buildAlternates`)
- Test: `lib/__tests__/seo.test.ts`

**Interfaces:**
- Consumes: `FA_PAIRED`, `FaPath` from Task 1.
- Produces: `buildAlternates(path: string, locale: string)` — same signature, new behaviour.

- [ ] **Step 1: Write the failing test**

```ts
// lib/__tests__/seo.test.ts
import { describe, it, expect } from 'vitest';
import { buildAlternates, SITE_URL } from '../seo';

describe('buildAlternates', () => {
  it('emits both languages for a paired path', () => {
    const a = buildAlternates('/mentorship', 'en') as any;
    expect(a.canonical).toBe(`${SITE_URL}/en/mentorship`);
    expect(a.languages.en).toBe(`${SITE_URL}/en/mentorship`);
    expect(a.languages.fa).toBe(`${SITE_URL}/fa/mentorship`);
    expect(a.languages['x-default']).toBe(`${SITE_URL}/en/mentorship`);
  });

  it('maps a paired path whose slugs differ per locale', () => {
    const a = buildAlternates('/startup-visa-canada', 'en') as any;
    expect(a.languages.fa).toBe(`${SITE_URL}/fa/canada-startup-visa`);
  });

  it('omits fa for an English-only path', () => {
    const a = buildAlternates('/usa/eb5', 'en') as any;
    expect(a.languages.fa).toBeUndefined();
    expect(a.languages.en).toBe(`${SITE_URL}/en/usa/eb5`);
    expect(a.languages['x-default']).toBe(`${SITE_URL}/en/usa/eb5`);
  });

  it('omits en for a Persian-only path and self-references x-default', () => {
    const a = buildAlternates('/which-path', 'fa') as any;
    expect(a.canonical).toBe(`${SITE_URL}/fa/which-path`);
    expect(a.languages.en).toBeUndefined();
    expect(a.languages.fa).toBe(`${SITE_URL}/fa/which-path`);
    expect(a.languages['x-default']).toBe(`${SITE_URL}/fa/which-path`);
  });

  it('strips an incoming locale prefix before pairing', () => {
    const a = buildAlternates('/fa/canada-startup-visa', 'fa') as any;
    expect(a.canonical).toBe(`${SITE_URL}/fa/canada-startup-visa`);
    expect(a.languages.en).toBe(`${SITE_URL}/en/startup-visa-canada`);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/__tests__/seo.test.ts`
Expected: FAIL — the `fa` language key is present on `/usa/eb5`, and `/startup-visa-canada` pairs to `/fa/startup-visa-canada`

- [ ] **Step 3: Write the implementation**

Add the import at the top of `lib/seo.ts`:

```ts
import { FA_PAIRED, isFaPath, type FaPath } from '@/lib/fa/paths';
```

Replace `buildAlternates` (currently `lib/seo.ts:58-69`) with:

```ts
/** English path → Persian path, derived from FA_PAIRED so there is one table. */
const EN_TO_FA = new Map<string, string>(
  (Object.entries(FA_PAIRED) as [FaPath, string | null][])
    .filter((e): e is [FaPath, string] => e[1] !== null)
    .map(([fa, en]) => [en, fa]),
);

/**
 * Build canonical + hreflang alternates.
 *
 * `/fa` is not a mirror of `/en`, so an alternate is emitted only when the
 * page genuinely exists in that locale. Advertising a twin that 301s (or
 * 404s) is worse than advertising nothing.
 */
export function buildAlternates(path: string, locale: string): Metadata['alternates'] {
  const clean = normalizePath(path);
  const isFa = locale === 'fa';

  const faPath = isFa ? (isFaPath(clean) ? clean : null) : (EN_TO_FA.get(clean) ?? null);
  const enPath = isFa ? (FA_PAIRED[clean as FaPath] ?? null) : clean;

  const languages: Record<string, string> = {};
  if (enPath !== null) languages.en = `${SITE_URL}/en${enPath}`;
  if (faPath !== null) languages.fa = `${SITE_URL}/fa${faPath}`;
  languages['x-default'] = enPath !== null ? `${SITE_URL}/en${enPath}` : `${SITE_URL}/fa${faPath}`;

  return { canonical: `${SITE_URL}/${locale}${clean}`, languages };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/__tests__/seo.test.ts && npx tsc --noEmit`
Expected: PASS, 5 tests; typecheck clean

- [ ] **Step 5: Commit**

```bash
git add lib/seo.ts lib/__tests__/seo.test.ts
git commit -m "fix(seo): emit hreflang only for locale pairs that actually exist"
```

---

### Task 3: Split the sitemap by locale

**Files:**
- Modify: `app/sitemap.ts:9-63`
- Test: manual — `app/` is outside the vitest include path, so verify by fetching the route.

**Interfaces:**
- Consumes: `FA_PATHS` (Task 1), `buildAlternates` (Task 2).

- [ ] **Step 1: Rewrite the static-path section**

Replace the `STATIC_PATHS` constant and the `alternates` helper with:

```ts
import { FA_PATHS, FA_PAIRED, type FaPath } from '@/lib/fa/paths';

/** English pages. This list is the English site and nothing else. */
const EN_PATHS = [
  '', '/about', '/services', '/mentorship', '/contact', '/blog',
  '/startup-visa-canada', '/startupworkpermit',
  '/pnp', '/pnp/ontario', '/pnp/bc', '/pnp/alberta', '/pnp/saskatchewan',
  '/pnp/manitoba', '/pnp/new-brunswick', '/pnp/newfoundland',
  '/pnp/nova-scotia', '/pnp/pei',
  '/usa/eb1', '/usa/eb2-niw', '/usa/eb5',
  '/europe/netherlands', '/europe/finland',
  '/australia/entrepreneur-stream', '/uae/golden-visa',
  '/country/canada', '/country/usa', '/country/australia',
  '/country/uae', '/country/denmark', '/country/finland',
  '/privacy', '/terms',
];

/** en → fa, derived from the pairing table so the two can never drift. */
const EN_TO_FA = new Map<string, string>(
  (Object.entries(FA_PAIRED) as [FaPath, string | null][])
    .filter((e): e is [FaPath, string] => e[1] !== null)
    .map(([fa, en]) => [en, fa]),
);

function pairFor(locale: 'en' | 'fa', path: string) {
  const fa = locale === 'fa' ? path : EN_TO_FA.get(path);
  const en = locale === 'fa' ? FA_PAIRED[path as FaPath] : path;
  const languages: Record<string, string> = {};
  if (en != null) languages.en = `${SITE_URL}/en${en}`;
  if (fa != null) languages.fa = `${SITE_URL}/fa${fa}`;
  return { languages };
}
```

- [ ] **Step 2: Rewrite the emit loop**

Replace the single `for (const path of STATIC_PATHS)` loop with:

```ts
  for (const [locale, paths] of [['en', EN_PATHS], ['fa', [...FA_PATHS]]] as const) {
    for (const path of paths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' || path === '/blog' ? 'daily' : 'weekly',
        priority: path === '' ? 1 : 0.7,
        alternates: pairFor(locale, path),
      });
    }
  }
```

- [ ] **Step 3: Verify the output**

Run: `npm run dev`, then in another shell:

```bash
curl -s localhost:3000/sitemap.xml | grep -c '<url>'
```

Expected: `33 + 14 + <published article count>`. Then confirm no retired Persian URL is advertised:

```bash
curl -s localhost:3000/sitemap.xml | grep -E 'fa/(pnp/ontario|country/|usa/eb5|europe/)' | wc -l
```

Expected: `0`

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts
git commit -m "fix(seo): split the sitemap into real en and fa path lists"
```

---

### Task 4: 301 the retired Persian mirror paths

**Files:**
- Create: `lib/fa/redirects.ts`
- Test: `lib/fa/__tests__/redirects.test.ts`
- Modify: `middleware.ts` (add the check ahead of `intlMiddleware(request)`)

**Interfaces:**
- Consumes: `isFaPath` (Task 1).
- Produces: `faRedirectTarget(pathname: string): string | null` — the `/en/...` path to 301 to, or `null` to leave the request alone.

- [ ] **Step 1: Write the failing test**

```ts
// lib/fa/__tests__/redirects.test.ts
import { describe, it, expect } from 'vitest';
import { faRedirectTarget } from '../redirects';

describe('faRedirectTarget', () => {
  it('redirects a retired Persian mirror path to English', () => {
    expect(faRedirectTarget('/fa/pnp/ontario')).toBe('/en/pnp/ontario');
    expect(faRedirectTarget('/fa/country/denmark')).toBe('/en/country/denmark');
  });

  it('leaves a real Persian page alone', () => {
    expect(faRedirectTarget('/fa/canada-startup-visa')).toBeNull();
    expect(faRedirectTarget('/fa')).toBeNull();
    expect(faRedirectTarget('/fa/')).toBeNull();
  });

  it('leaves Persian blog articles alone', () => {
    expect(faRedirectTarget('/fa/blog/some-article')).toBeNull();
  });

  it('never touches English or admin paths', () => {
    expect(faRedirectTarget('/en/pnp/ontario')).toBeNull();
    expect(faRedirectTarget('/fa/admin')).toBeNull();
    expect(faRedirectTarget('/fa/admin/login')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/fa/__tests__/redirects.test.ts`
Expected: FAIL — "Failed to resolve import ... ../redirects"

- [ ] **Step 3: Write the implementation**

```ts
// ============================================================================
// lib/fa/redirects.ts
// A /fa URL that has no Persian page must go to English, not render English
// copy inside the Persian shell. Serving English under /fa is what made the
// old mirror worthless: the reader loses trust and Google sees a duplicate.
// ============================================================================
import { isFaPath } from './paths';

/** Persian sub-trees that exist but are not in the static allowlist. */
const DYNAMIC_PREFIXES = ['/blog/', '/admin'];

/** `/fa/<retired>` → `/en/<retired>`; null when the request should proceed. */
export function faRedirectTarget(pathname: string): string | null {
  if (!pathname.startsWith('/fa')) return null;

  const rest = pathname.slice(3); // '' | '/' | '/some/path'
  if (rest === '' || rest === '/') return null;
  if (!rest.startsWith('/')) return null; // e.g. '/false-positive'

  if (DYNAMIC_PREFIXES.some((p) => rest === p.replace(/\/$/, '') || rest.startsWith(p))) {
    return null;
  }
  if (isFaPath(rest)) return null;

  return `/en${rest}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/fa/__tests__/redirects.test.ts`
Expected: PASS, 4 tests

- [ ] **Step 5: Wire it into the middleware**

In `middleware.ts`, add the import:

```ts
import { faRedirectTarget } from './lib/fa/redirects';
```

and insert this immediately before the final `return intlMiddleware(request);`:

```ts
  // A /fa path with no Persian page goes to English with a 301, so the
  // signal is permanent for crawlers and the reader never sees English
  // rendered inside the Persian shell.
  const faTarget = faRedirectTarget(pathname);
  if (faTarget) {
    return NextResponse.redirect(new URL(faTarget, request.url), 301);
  }
```

- [ ] **Step 6: Verify in the running app**

Run: `npm run dev`, then:

```bash
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' localhost:3000/fa/pnp/ontario
```

Expected: `301 http://localhost:3000/en/pnp/ontario`

```bash
curl -s -o /dev/null -w '%{http_code}\n' localhost:3000/fa/blog
```

Expected: `200`

- [ ] **Step 7: Commit**

```bash
git add lib/fa/redirects.ts lib/fa/__tests__/redirects.test.ts middleware.ts
git commit -m "feat(fa): 301 retired Persian mirror paths to their English pages"
```

---

### Task 5: Persian number and date formatting

**Files:**
- Create: `lib/fa/format.ts`
- Test: `lib/fa/__tests__/format.test.ts`

**Interfaces:**
- Produces: `toPersianDigits(input: string | number): string`, `faDate(date: Date | string): string` (Jalali, e.g. `۱۵ شهریور ۱۴۰۵`), `isoDate(date: Date | string): string` (`YYYY-MM-DD`, for `<time datetime>` and JSON-LD).

- [ ] **Step 1: Write the failing test**

```ts
// lib/fa/__tests__/format.test.ts
import { describe, it, expect } from 'vitest';
import { toPersianDigits, faDate, isoDate } from '../format';

describe('toPersianDigits', () => {
  it('converts Latin digits', () => {
    expect(toPersianDigits('1405')).toBe('۱۴۰۵');
    expect(toPersianDigits(42)).toBe('۴۲');
  });

  it('leaves non-digit characters untouched', () => {
    expect(toPersianDigits('EB-2 NIW')).toBe('EB-۲ NIW');
    expect(toPersianDigits('سلام')).toBe('سلام');
  });
});

describe('faDate', () => {
  it('renders a Jalali date with Persian digits and a Persian month name', () => {
    const out = faDate('2026-09-05T00:00:00Z');
    expect(out).toContain('شهریور');
    expect(out).toMatch(/^[۰-۹]/);
    expect(out).not.toMatch(/[0-9]/);
  });

  it('accepts a Date as well as a string', () => {
    expect(faDate(new Date('2026-09-05T00:00:00Z'))).toBe(faDate('2026-09-05T00:00:00Z'));
  });
});

describe('isoDate', () => {
  it('returns a machine-readable Gregorian date', () => {
    expect(isoDate('2026-09-05T12:34:56Z')).toBe('2026-09-05');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/fa/__tests__/format.test.ts`
Expected: FAIL — "Failed to resolve import ... ../format"

- [ ] **Step 3: Write the implementation**

Uses the platform `Intl` Persian calendar — no date library is added.

```ts
// ============================================================================
// lib/fa/format.ts
// Persian presentation of numbers and dates.
//
// Persian digits are for prose. Programme codes (EB-2), currency amounts and
// phone numbers stay Latin — callers decide, this module only converts what
// it is handed. Machine-readable dates stay Gregorian ISO: Jalali belongs in
// the visible text, never in <time datetime> or JSON-LD.
// ============================================================================

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** `1405` → `۱۴۰۵`. Non-digit characters pass through unchanged. */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

const JALALI = new Intl.DateTimeFormat('fa-IR', {
  calendar: 'persian',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** `2026-09-05` → `۱۵ شهریور ۱۴۰۵`. For display only. */
export function faDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return JALALI.format(d);
}

/** `2026-09-05` — for <time datetime> and JSON-LD, never for display in fa. */
export function isoDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/fa/__tests__/format.test.ts`
Expected: PASS, 5 tests

- [ ] **Step 5: Commit**

```bash
git add lib/fa/format.ts lib/fa/__tests__/format.test.ts
git commit -m "feat(fa): add Persian digit and Jalali date formatting"
```

---

### Task 6: Estedad as the Persian display font

Vazirmatn is a text face. Persian headings currently inherit it at one weight, so the typographic hierarchy that `DM_Serif_Display` gives the English site simply does not exist in Persian.

**Files:**
- Create: `public/fonts/Estedad-Bold.woff2`, `public/fonts/Estedad-Black.woff2` (download step below)
- Modify: `app/[locale]/layout.tsx:6-36` (font declarations) and `:96-100` (body class)
- Modify: `tailwind.config.ts:11-18`

- [ ] **Step 1: Fetch the font files**

Estedad is SIL OFL licensed and is not on Google Fonts, so it is self-hosted rather than loaded through `next/font/google` the way Vazirmatn is.

```bash
mkdir -p public/fonts
curl -L -o /tmp/estedad.zip https://github.com/aminabedi68/Estedad/releases/latest/download/Estedad-WebFonts.zip
unzip -j /tmp/estedad.zip '*Estedad-Bold.woff2' '*Estedad-Black.woff2' -d public/fonts/
ls -la public/fonts/
```

Expected: both `.woff2` files present. If the release asset name has changed, browse `https://github.com/aminabedi68/Estedad/releases` and take the current web-fonts archive — do not substitute a different family.

- [ ] **Step 2: Declare the font in the layout**

In `app/[locale]/layout.tsx`, add to the imports:

```ts
import localFont from 'next/font/local';
```

and after the `vazir` declaration:

```ts
// Persian display face. Vazirmatn is a text font; without a display weight
// the Persian headings flatten to a single voice.
const estedad = localFont({
  src: [
    { path: '../../public/fonts/Estedad-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Estedad-Black.woff2', weight: '900', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-estedad',
});
```

- [ ] **Step 3: Register the variable and the Tailwind class**

In the same file, change the `fontVariables` line to:

```ts
  const fontVariables = `${dmSerif.variable} ${space.variable} ${vazir.variable} ${estedad.variable}`;
```

In `tailwind.config.ts`, add to `fontFamily` (keep every existing entry):

```ts
        estedad: ["var(--font-estedad)", "var(--font-vazir)", "sans-serif"],
```

- [ ] **Step 4: Verify it loads**

Run: `npm run dev`, open `http://localhost:3000/fa`, and in the browser console:

```js
document.fonts.check('700 24px Estedad')
```

Expected: `true`. Also confirm `getComputedStyle(document.documentElement).getPropertyValue('--font-estedad')` is non-empty.

- [ ] **Step 5: Commit**

```bash
git add public/fonts tailwind.config.ts "app/[locale]/layout.tsx"
git commit -m "feat(fa): self-host Estedad as the Persian display face"
```

---

### Task 7: Locale-partition the autopilot link inventory

`SITE_PAGES` currently hands the Persian writer 35 locale-agnostic paths with Persian labels. After Task 4, most of those 301 to English — so every Persian article would link its reader out of Persian.

**Files:**
- Modify: `lib/autopilot/inventory.ts:32-68` (`SITE_PAGES`), `:86` (target construction)
- Test: `lib/autopilot/__tests__/inventory.test.ts`

**Interfaces:**
- Consumes: `FA_PATHS`, `isFaPath` (Task 1).
- Produces: `SITE_PAGES` keeps its shape and stays the English list; new `FA_SITE_PAGES: FaPage[]` where `type FaPage = { path: string; label: string; kind: LinkTarget['kind'] }`; `buildInventory` keeps its signature.

- [ ] **Step 1: Write the failing test**

```ts
// lib/autopilot/__tests__/inventory.test.ts
import { describe, it, expect } from 'vitest';
import { SITE_PAGES, FA_SITE_PAGES } from '../inventory';
import { isFaPath } from '@/lib/fa/paths';

describe('FA_SITE_PAGES', () => {
  it('only offers paths that exist on the Persian site', () => {
    for (const p of FA_SITE_PAGES) {
      expect(isFaPath(p.path), `${p.path} is not a Persian path`).toBe(true);
    }
  });

  it('offers no retired mirror path', () => {
    const paths = FA_SITE_PAGES.map((p) => p.path);
    expect(paths).not.toContain('/pnp/ontario');
    expect(paths).not.toContain('/country/denmark');
    expect(paths).not.toContain('/usa/eb5');
  });

  it('includes the Persian pillar and the assessment lead magnet', () => {
    const paths = FA_SITE_PAGES.map((p) => p.path);
    expect(paths).toContain('/canada-startup-visa');
    expect(paths).toContain('/which-path');
  });

  it('has a non-empty Persian label for every entry', () => {
    for (const p of FA_SITE_PAGES) expect(p.label.trim().length).toBeGreaterThan(0);
  });
});

describe('SITE_PAGES', () => {
  it('is the English list and keeps the province pages', () => {
    const paths = SITE_PAGES.map((p) => p.path);
    expect(paths).toContain('/pnp/ontario');
    expect(paths).toContain('/usa/eb5');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/autopilot/__tests__/inventory.test.ts`
Expected: FAIL — `FA_SITE_PAGES` is not exported

- [ ] **Step 3: Write the implementation**

In `lib/autopilot/inventory.ts`, change the `Page` type to drop the `fa` field:

```ts
type Page = { path: string; en: string; kind: LinkTarget['kind'] };
```

Delete the `fa:` property from every entry in `SITE_PAGES` (the list otherwise stays exactly as it is — it is now explicitly the English inventory). Then add, immediately after `SITE_PAGES`:

```ts
export type FaPage = { path: string; label: string; kind: LinkTarget['kind'] };

/**
 * The Persian site's link inventory. It is a different set of pages from the
 * English one, not a translation of it — /fa has its own IA. Every path here
 * must be in FA_PATHS, otherwise the writer mints links that 301 the reader
 * out of Persian mid-article.
 */
export const FA_SITE_PAGES: FaPage[] = [
  { path: '/canada-startup-visa', label: 'راهنمای کامل ویزای استارتاپ کانادا (SUV)', kind: 'program' },
  { path: '/canada-startup-visa/requirements', label: 'شرایط و مدارک ویزای استارتاپ کانادا', kind: 'program' },
  { path: '/canada-startup-visa/cost', label: 'هزینه‌های ویزای استارتاپ کانادا', kind: 'program' },
  { path: '/canada-startup-visa/designated-organizations', label: 'سازمان‌های تأییدشده (Designated Organizations)', kind: 'program' },
  { path: '/pnp', label: 'برنامه‌های استانی کانادا (PNP)', kind: 'program' },
  { path: '/usa-eb2-niw', label: 'ویزای EB-2 NIW آمریکا برای متخصصان ایرانی', kind: 'program' },
  { path: '/which-path', label: 'کدام مسیر مهاجرت برای شما مناسب است؟ (ارزیابی رایگان)', kind: 'tool' },
  { path: '/mentorship', label: 'برنامه منتورشیپ و آماده‌سازی بنیان‌گذاران', kind: 'page' },
  { path: '/faq', label: 'سؤالات متداول مهاجرت استارتاپی', kind: 'page' },
  { path: '/webinar', label: 'وبینار رایگان مهاجرت استارتاپی', kind: 'page' },
  { path: '/about', label: 'درباره ما', kind: 'page' },
  { path: '/contact', label: 'تماس و مشاوره', kind: 'page' },
  { path: '/blog', label: 'مجله', kind: 'page' },
];
```

Then change the target construction inside `buildInventory` (currently line 86) to:

```ts
  const targets: LinkTarget[] =
    locale === 'fa'
      ? FA_SITE_PAGES.map((p) => ({ path: p.path, label: p.label, kind: p.kind }))
      : SITE_PAGES.map((p) => ({ path: p.path, label: p.en, kind: p.kind }));
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test && npx tsc --noEmit`
Expected: PASS — the new inventory tests plus the existing 63; typecheck clean

- [ ] **Step 5: Commit**

```bash
git add lib/autopilot/inventory.ts lib/autopilot/__tests__/inventory.test.ts
git commit -m "fix(autopilot): give the Persian writer its own link inventory"
```

---

### Task 8: Repair internal links in already-published Persian articles

Articles written before Task 7 still link to paths that now 301. `enforceLinks` already demotes an unknown path to plain text, so the repair is to re-run it with the new Persian inventory rather than to write new logic.

**Files:**
- Create: `scripts/fix-fa-article-links.ts`
- Test: `lib/autopilot/__tests__/enforce-links-fa.test.ts`

**Interfaces:**
- Consumes: `enforceLinks` (`lib/autopilot/text.ts:70`), `buildInventory` (Task 7).

- [ ] **Step 1: Write the failing test**

```ts
// lib/autopilot/__tests__/enforce-links-fa.test.ts
import { describe, it, expect } from 'vitest';
import { enforceLinks } from '../text';
import { FA_SITE_PAGES } from '../inventory';
import type { Inventory } from '../inventory';

const faInv: Inventory = {
  locale: 'fa',
  targets: FA_SITE_PAGES.map((p) => ({ path: p.path, label: p.label, kind: p.kind })),
  recentTitles: [],
  recentCategories: [],
  categories: [],
};

describe('enforceLinks with the Persian inventory', () => {
  it('demotes a retired mirror link to plain text, keeping the words', () => {
    const html = '<p>درباره <a href="/fa/pnp/ontario">برنامه استانی انتاریو</a> بخوانید.</p>';
    const { html: out, links } = enforceLinks(html, faInv);
    expect(out).not.toContain('<a');
    expect(out).toContain('برنامه استانی انتاریو');
    expect(links).not.toContain('/pnp/ontario');
  });

  it('keeps a link to a real Persian page', () => {
    const html = '<p><a href="/fa/canada-startup-visa">ویزای استارتاپ کانادا</a></p>';
    const { html: out, links } = enforceLinks(html, faInv);
    expect(out).toContain('href="/fa/canada-startup-visa"');
    expect(links).toContain('/canada-startup-visa');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/autopilot/__tests__/enforce-links-fa.test.ts`
Expected: PASS if Task 7 landed correctly. If the first case FAILS with the link retained, Task 7's `buildInventory` branch is wrong — fix that before continuing.

- [ ] **Step 3: Write the migration script**

```ts
// ============================================================================
// scripts/fix-fa-article-links.ts
// Persian articles published before the Persian site had its own IA link to
// paths that now 301 to English. Re-run enforceLinks with the new Persian
// inventory: retired paths lose their <a> and keep their words.
//
//   npx tsx scripts/fix-fa-article-links.ts          # report only
//   npx tsx scripts/fix-fa-article-links.ts --write  # apply
// ============================================================================
import prisma from '../lib/prisma';
import { buildInventory } from '../lib/autopilot/inventory';
import { enforceLinks } from '../lib/autopilot/text';

async function main() {
  const write = process.argv.includes('--write');
  const inv = await buildInventory('fa');
  const articles = await prisma.article.findMany({
    where: { locale: 'fa' },
    select: { id: true, slug: true, content: true },
  });

  let changed = 0;
  for (const a of articles) {
    if (!a.content) continue;
    const { html } = enforceLinks(a.content, inv);
    if (html === a.content) continue;
    changed++;
    console.log(`${write ? 'fixing' : 'would fix'}  ${a.slug}`);
    if (write) {
      await prisma.article.update({ where: { id: a.id }, data: { content: html } });
    }
  }

  console.log(`\n${changed}/${articles.length} Persian articles ${write ? 'updated' : 'need updating'}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 4: Dry-run, then apply**

```bash
npx tsx scripts/fix-fa-article-links.ts
```

Expected: a list of slugs and an `N/M` count. Read the list before writing. Then:

```bash
npx tsx scripts/fix-fa-article-links.ts --write
npx tsx scripts/fix-fa-article-links.ts
```

Expected: the second report shows `0/M`.

- [ ] **Step 5: Commit**

```bash
git add scripts/fix-fa-article-links.ts lib/autopilot/__tests__/enforce-links-fa.test.ts
git commit -m "fix(fa): strip retired internal links from published Persian articles"
```

> **Note for production:** this script edits article rows, so it must be run against the production database too, after the deploy. Add it to the go-live checklist rather than assuming the dev run covers it.

---

### Task 9: The Persian content-module contract

Phase 2 writes fourteen pages. They share one shape, so the shape is defined and tested once.

**Files:**
- Create: `lib/fa/content.ts`
- Test: `lib/fa/__tests__/content.test.ts`

**Interfaces:**
- Produces: `type FaPage`, `type FaSection`, `type FaFaq`, `type FaCta`, and `faqJsonLd(faqs: FaFaq[]): object`.

- [ ] **Step 1: Write the failing test**

```ts
// lib/fa/__tests__/content.test.ts
import { describe, it, expect } from 'vitest';
import { faqJsonLd } from '../content';

describe('faqJsonLd', () => {
  const faqs = [
    { q: 'ویزای استارتاپ کانادا چقدر طول می‌کشد؟', a: 'حدود ۳۷ ماه.' },
    { q: 'آیا نیاز به سرمایه شخصی دارم؟', a: 'بله، برای اثبات تمکن مالی.' },
  ];

  it('emits a FAQPage with one entry per question', () => {
    const ld = faqJsonLd(faqs) as any;
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('FAQPage');
    expect(ld.mainEntity).toHaveLength(2);
    expect(ld.mainEntity[0].name).toBe(faqs[0].q);
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe(faqs[0].a);
    expect(ld.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
  });

  it('declares the answer language as Persian', () => {
    const ld = faqJsonLd(faqs) as any;
    expect(ld.inLanguage).toBe('fa-IR');
  });

  it('returns no mainEntity for an empty list', () => {
    expect((faqJsonLd([]) as any).mainEntity).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/fa/__tests__/content.test.ts`
Expected: FAIL — "Failed to resolve import ... ../content"

- [ ] **Step 3: Write the implementation**

```ts
// ============================================================================
// lib/fa/content.ts
// The shape every Persian page module exports.
//
// UI chrome (nav, footer, buttons, form labels) lives in messages/fa.json.
// Page copy lives here, in typed modules under content/fa/, because a 600-line
// marketing page is FAQ arrays and repeated section shapes — that reads as
// TypeScript and does not survive as deep JSON keys.
// ============================================================================

export type FaFaq = { q: string; a: string };

export type FaSection = {
  heading: string;
  /** Paragraphs, in order. Plain text — no HTML. */
  body: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
};

export type FaCta = {
  label: string;
  /** Locale-agnostic internal path (must be in FA_PATHS) or an absolute URL. */
  href: string;
};

export type FaPage = {
  /** Locale-agnostic path, must be a member of FA_PATHS. */
  path: string;
  /** <title>, brandless — buildMetadata appends the brand. */
  title: string;
  description: string;
  /** The Persian queries this page is written for. Documentation, not output. */
  keywords: string[];
  hero: { headline: string; sub: string; cta: FaCta };
  sections: FaSection[];
  faqs: FaFaq[];
  closing: FaCta[];
};

/** Persian FAQPage structured data — the AEO/GEO surface for this page. */
export function faqJsonLd(faqs: FaFaq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'fa-IR',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/fa/__tests__/content.test.ts`
Expected: PASS, 3 tests

- [ ] **Step 5: Commit**

```bash
git add lib/fa/content.ts lib/fa/__tests__/content.test.ts
git commit -m "feat(fa): define the Persian page content contract and FAQ JSON-LD"
```

---

### Task 10: Translate the shared chrome

`Footer.tsx`, `HeroSection.tsx` and `CTASection.tsx` render hardcoded English on every Persian page. Nothing in Phase 2 looks Persian until this lands.

**Files:**
- Modify: `messages/en.json`, `messages/fa.json`
- Modify: `components/Footer.tsx`, `components/HeroSection.tsx`, `components/CTASection.tsx`
- Test: `lib/fa/__tests__/messages.test.ts`

**Interfaces:**
- Produces: message namespaces `Footer`, `HeroHome`, `Cta` in both catalogs.

- [ ] **Step 1: Write the failing test**

This guards the real failure mode — a key added to one catalog and forgotten in the other.

```ts
// lib/fa/__tests__/messages.test.ts
import { describe, it, expect } from 'vitest';
import en from '@/messages/en.json';
import fa from '@/messages/fa.json';

/** Every leaf key path in a nested message object. */
function keyPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object'
      ? keyPaths(v as Record<string, unknown>, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  );
}

describe('message catalogs', () => {
  it('en and fa have exactly the same keys', () => {
    const e = keyPaths(en).sort();
    const f = keyPaths(fa).sort();
    expect(f.filter((k) => !e.includes(k)), 'keys only in fa').toEqual([]);
    expect(e.filter((k) => !f.includes(k)), 'keys only in en').toEqual([]);
  });

  it('has no empty Persian string', () => {
    for (const [k, v] of Object.entries(fa)) {
      for (const [kk, vv] of Object.entries(v as Record<string, unknown>)) {
        if (typeof vv === 'string') expect(vv.trim(), `${k}.${kk}`).not.toBe('');
      }
    }
  });

  it('covers the shared chrome namespaces', () => {
    for (const ns of ['Footer', 'HeroHome', 'Cta', 'Navigation']) {
      expect(Object.keys(fa)).toContain(ns);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/fa/__tests__/messages.test.ts`
Expected: FAIL — `Footer`, `HeroHome` and `Cta` are missing from both catalogs

- [ ] **Step 3: Add `resolveJsonModule` if the import errors**

If `npx tsc --noEmit` complains about importing JSON, add to `tsconfig.json` under `compilerOptions`:

```json
    "resolveJsonModule": true,
```

- [ ] **Step 4: Add the namespaces to both catalogs**

Read each component first to collect its exact hardcoded strings — do not invent copy that is not on the page:

```bash
grep -nE '>[A-Za-z][^<>{}]{3,}<' components/Footer.tsx components/HeroSection.tsx components/CTASection.tsx
```

Add the harvested strings to `messages/en.json` under `Footer`, `HeroHome` and `Cta`, then write the Persian equivalents into `messages/fa.json` under the same keys. Persian chrome is written for Persian readers, not translated word-for-word — but the key sets must match exactly, which the test enforces.

- [ ] **Step 5: Wire the three components**

In each of `Footer.tsx`, `HeroSection.tsx`, `CTASection.tsx`: add `useTranslations` (client components) or `getTranslations` (server components) following the pattern already in `components/Header.tsx`, and replace every hardcoded string with a `t('key')` call. Change no layout, no class names.

- [ ] **Step 6: Run tests and check the page**

Run: `npm test && npx tsc --noEmit`
Expected: PASS; typecheck clean

Run `npm run dev` and open `http://localhost:3000/fa` — the footer, hero and CTA must be Persian, with no English left.

- [ ] **Step 7: Commit**

```bash
git add messages components/Footer.tsx components/HeroSection.tsx components/CTASection.tsx lib/fa/__tests__/messages.test.ts tsconfig.json
git commit -m "feat(fa): translate the shared chrome and lock catalog key parity"
```

---

### Task 11: Jalali dates on Persian blog pages

**Files:**
- Modify: `app/[locale]/(public)/blog/page.tsx`, `app/[locale]/(public)/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `faDate`, `isoDate` (Task 5).

- [ ] **Step 1: Find every rendered date**

```bash
grep -nE 'toLocaleDateString|createdAt|publishedAt|updatedAt' "app/[locale]/(public)/blog/page.tsx" "app/[locale]/(public)/blog/[slug]/page.tsx"
```

- [ ] **Step 2: Replace display dates**

Both files already compute `const isRtl = locale === 'fa';`. For every date rendered as visible text, use:

```tsx
<time dateTime={isoDate(article.createdAt)}>
  {isRtl ? faDate(article.createdAt) : article.createdAt.toLocaleDateString('en-CA')}
</time>
```

Leave every `datePublished` / `dateModified` in the JSON-LD blocks as ISO — Jalali in structured data is invalid.

- [ ] **Step 3: Verify**

Run `npm run dev`, open a Persian article at `http://localhost:3000/fa/blog/<slug>`. The visible date must read as Jalali with Persian digits; then check the page source shows `"datePublished":"20` (still ISO) in the JSON-LD.

- [ ] **Step 4: Commit**

```bash
git add "app/[locale]/(public)/blog"
git commit -m "feat(fa): render Jalali article dates while keeping ISO in structured data"
```

---

## Phase 1 gate

Before any Phase 2 task starts, all of this must be true:

```bash
npm test && npx tsc --noEmit
```

- [ ] Tests pass, typecheck clean
- [ ] `curl -s -o /dev/null -w '%{http_code}' localhost:3000/fa/pnp/ontario` → `301`
- [ ] `curl -s localhost:3000/sitemap.xml | grep -cE 'fa/(pnp/ontario|country/|usa/eb5)'` → `0`
- [ ] `/fa` renders Persian chrome — no English in the header, footer, hero or CTA
- [ ] `npx tsx scripts/fix-fa-article-links.ts` reports `0/M`

---

# Phase 2 — The Persian pages

Fourteen pages, one per task, in the order below. Later pages link to earlier ones, so the order matters.

**Every Phase 2 task follows the same five steps.** Written out once here; each task below supplies only what is specific to it — the path, the content brief, and the internal links.

- [ ] **Step A: Write the content module** at `content/fa/<name>.ts`, exporting `const page: FaPage` typed against `lib/fa/content.ts`. Fill `keywords` with the Persian queries from the brief; they document what the page is for.
- [ ] **Step B: Write the route** at `app/[locale]/(public)/<path>/page.tsx`. It must:
  - `notFound()` when `locale !== 'fa'` — these routes are Persian-only and must not render an empty English page,
  - call `setRequestLocale(locale)`,
  - export `generateMetadata` built with `buildMetadata({ ...page, path, locale })`,
  - render `<JsonLd data={[faqJsonLd(page.faqs)]} />`,
  - use `font-estedad` on headings and `font-vazir` on body text,
  - end with the closing CTAs.
- [ ] **Step C: Verify** — `npx tsc --noEmit`, then open `http://localhost:3000/fa<path>` and confirm: no English body copy, no `[object Object]`, the FAQ block renders, and every internal link is in `FA_PATHS`.
- [ ] **Step D: Check the structured data** — view source and confirm one `FAQPage` block with `"inLanguage":"fa-IR"` and one `<link rel="canonical">` pointing at the `/fa` URL.
- [ ] **Step E: Commit** — `git commit -m "feat(fa): add the <name> page"`.

**Content rules for every page in this phase:**
- Write Persian, do not translate English. If a sentence reads like a translation, it is wrong.
- Never claim to be a lawyer or a licensed immigration consultant. `BRAND_FACTS` in `lib/autopilot/inventory.ts:71` is the boundary of what may be claimed.
- State numbers only where they are known and current; where a range is honest, give the range.
- Every page carries at least one Telegram CTA and one path into `/which-path` or `/contact`.

---

### Task 12: `/fa` home

**Files:** Create `content/fa/home.ts`; modify `app/[locale]/(public)/page.tsx` to branch to the Persian composition when `locale === 'fa'`.

**Brief:** Persian-first hero carrying the positioning line verbatim. Then: who this is for (بنیان‌گذار، متخصص فنی، صاحب کسب‌وکار)؛ the four paths as cards linking to `/canada-startup-visa`, `/pnp`, `/usa-eb2-niw`, `/which-path`؛ why mentorship differs from a «مؤسسه مهاجرتی»؛ the four conversion channels.
**Keywords:** مهاجرت استارتاپی، ویزای استارتاپ، منتورشیپ مهاجرت، مشاوره ویزای استارتاپ
**Links out:** `/canada-startup-visa`, `/pnp`, `/usa-eb2-niw`, `/which-path`, `/mentorship`, `/faq`

---

### Task 13: `/fa/canada-startup-visa` — the pillar page

**Files:** Create `content/fa/canada-startup-visa.ts` and `app/[locale]/(public)/canada-startup-visa/page.tsx`.

**Brief:** The longest page on the Persian site. Sections: SUV چیست؛ چه کسی واجد شرایط است؛ نقش سازمان تأییدشده؛ مراحل از ایده تا اقامت دائم؛ زمان‌بندی واقعی و صف فعلی؛ مجوز کار موقت؛ اشتباهات رایج ایرانی‌ها. Then a section that exists nowhere in English: **مسائل خاص متقاضیان ایرانی** — انتقال وجه و اثبات تمکن مالی تحت تحریم، محل مصاحبه (دبی / ایروان / آنکارا / تفلیس)، ترجمه رسمی مدارک ایرانی.
**Keywords:** ویزای استارتاپ کانادا، استارتاپ ویزا کانادا، SUV کانادا، اقامت کانادا از طریق استارتاپ
**Links out:** `/canada-startup-visa/requirements`, `/canada-startup-visa/cost`, `/canada-startup-visa/designated-organizations`, `/which-path`, `/mentorship`

---

### Task 14: `/fa/canada-startup-visa/requirements`

**Brief:** شرایط زبان (CLB 5 و آزمون‌های پذیرفته‌شده)، تمکن مالی (مبالغ فعلی به تفکیک اندازه خانواده، ارقام لاتین)، شرایط استارتاپ و سهام، مدارک لازم به تفکیک، و مدارک ایرانی: ترجمه رسمی، تأییدیه تحصیلی، سابقه شرکت و روزنامه رسمی.
**Keywords:** شرایط ویزای استارتاپ کانادا، مدارک استارتاپ ویزا، تمکن مالی ویزای استارتاپ کانادا
**Links out:** `/canada-startup-visa`, `/canada-startup-visa/cost`, `/which-path`

---

### Task 15: `/fa/canada-startup-visa/cost`

**Brief:** The most-searched money question, answered honestly. هزینه‌های دولتی (ارقام لاتین با ارز)، هزینه سازمان تأییدشده و بازه‌های واقعی آن، هزینه آماده‌سازی و بیزینس‌پلن، هزینه‌های جانبی (ترجمه، مدارک پزشکی، سفر برای مصاحبه)، و یک جدول جمع‌بندی بازه‌ای. یک بخش صریح درباره‌ی اینکه چه هزینه‌هایی **نشانه‌ی کلاهبرداری** است.
**Keywords:** هزینه ویزای استارتاپ کانادا، قیمت استارتاپ ویزا، هزینه سازمان تأییدشده
**Links out:** `/canada-startup-visa`, `/canada-startup-visa/designated-organizations`, `/contact`

---

### Task 16: `/fa/canada-startup-visa/designated-organizations`

**Brief:** DO چیست و چرا وجود دارد؛ سه نوع (انکوباتور، شتاب‌دهنده/VC، فرشته سرمایه‌گذار) و تفاوت تعهدنامه‌ها؛ چطور یک DO را ارزیابی کنیم؛ علائم هشدار؛ نقش ما در آماده‌سازی برای مصاحبه‌ی DO. Do **not** publish a list of organizations with claims about them — link to the official IRCC list instead as an outbound reference.
**Keywords:** سازمان تأییدشده کانادا، designated organization، انکوباتور مورد تأیید کانادا
**Links out:** `/canada-startup-visa`, `/mentorship`, `/contact`

---

### Task 17: `/fa/pnp` — one hub, not nine province pages

**Brief:** PNP چیست و تفاوت آن با SUV؛ کدام استان‌ها برای کارآفرین و متخصص ایرانی واقع‌بینانه‌اند؛ رابطه با Express Entry؛ چه زمانی PNP بهتر از SUV است. Province detail stays English — link to `/en/pnp` for the full breakdown and say so plainly.
**Keywords:** برنامه استانی کانادا، PNP کانادا، نامینیشن استانی
**Links out:** `/canada-startup-visa`, `/which-path`, `/faq`

---

### Task 18: `/fa/usa-eb2-niw`

**Brief:** EB-2 NIW چیست؛ سه معیار Dhanasar به زبان ساده؛ چرا برای متخصصان و پژوهشگران ایرانی مناسب است؛ مدارک و شواهد لازم؛ مسئله‌ی مصاحبه و محل آن برای متقاضیان ایرانی؛ زمان‌بندی و صف فعلی. Programme codes stay Latin: EB-2, NIW, I-140.
**Keywords:** EB-2 NIW، ویزای استعداد برتر آمریکا، گرین کارت بدون کارفرما، NIW ایرانی
**Links out:** `/which-path`, `/mentorship`, `/contact`

---

### Task 19: `/fa/which-path` — the assessment lead magnet

**Files:** Create `content/fa/which-path.ts`, `app/[locale]/(public)/which-path/page.tsx`, and a client component `components/fa/PathQuiz.tsx`.

**Brief:** A **new, simple Persian flow** — do not reuse `PNPStrategicAssessment` or `SmartAudit`. Six questions: هدف (اقامت / رشد کسب‌وکار / تحصیل خانواده)، وضعیت کسب‌وکار (ایده / MVP / درآمد)، سطح زبان، سرمایه در دسترس (بازه‌ای)، سابقه فنی یا پژوهشی، بازه زمانی. The result is a recommended path (SUV / PNP / EB-2 NIW / «هنوز زود است») with two sentences of reasoning and a link to that path's page, plus an email capture.

The scoring must be a **pure function under `lib/`** so it is testable:

**Files (logic):** Create `lib/fa/path-quiz.ts`; test `lib/fa/__tests__/path-quiz.test.ts`.
**Interfaces:** `type QuizAnswers`, `recommendPath(a: QuizAnswers): { path: 'suv' | 'pnp' | 'eb2niw' | 'too-early'; why: string; href: string }`.

Write the test first, covering: an idea-stage founder with no capital → `too-early`; a revenue-stage founder with capital and CLB 5 → `suv`; a PhD researcher with publications → `eb2niw`; a skilled employee with high language and no business → `pnp`. Then implement, then build the UI on top.

**Keywords:** کدام مسیر مهاجرت، ارزیابی رایگان مهاجرت، تست واجد شرایط بودن مهاجرت
**Links out:** all four destination pages, `/contact`

---

### Task 20: `/fa/mentorship`

**Brief:** The offer page. برنامه ۸ هفته‌ای: هفته به هفته چه اتفاقی می‌افتد؛ خروجی‌های ملموس (بیزینس‌پلن، مدل مالی، پیچ‌دک، آمادگی مصاحبه)؛ برای چه کسی مناسب **نیست**؛ تفاوت با مؤسسه مهاجرتی؛ نحوه شروع. State the positioning line verbatim here.
**Keywords:** منتورشیپ مهاجرت، دوره آماده‌سازی استارتاپ ویزا، مشاوره بیزینس پلن مهاجرت
**Links out:** `/which-path`, `/contact`, `/webinar`

---

### Task 21: `/fa/faq` — the AEO surface

**Brief:** 25–35 real questions in Persian, grouped: SUV، هزینه‌ها، مدارک، مسائل ایرانی‌ها، منتورشیپ، زمان‌بندی. Each answer is 40–80 words and directly answerable — this page is written to be quoted by an answer engine, so the first sentence of every answer must stand alone. This is the largest `faqs` array on the site and its `FAQPage` JSON-LD is the point of the page.
**Keywords:** سوالات متداول ویزای استارتاپ، آیا ویزای استارتاپ کانادا معتبر است
**Links out:** every other Persian page — this is the hub

---

### Task 22: `/fa/about`

**Brief:** Trust, in a market full of scams. داستان تأسیس؛ تیم و پیشینه‌ی واقعی (exited founders, investment bankers, grant-committee members — as in `BRAND_FACTS`)؛ چرا وکیل مهاجرت نیستیم و این چه معنایی دارد؛ چطور یک مؤسسه‌ی کلاهبردار را تشخیص دهید. Ashavid and Toronto must appear.
**Keywords:** درباره استارتاپ ویزا رودز، تیم مشاوره مهاجرت استارتاپی
**Links out:** `/mentorship`, `/contact`

---

### Task 23: `/fa/contact`

**Brief:** All four channels on one page, in order of Iranian preference: تلگرام (`@farjadtalks`, `@Heros_Journey`)، فرم ارزیابی رایگان (link to `/which-path`)، رزرو جلسه (reuse the existing booking iframe from `app/[locale]/(public)/book-meeting/page.tsx:132-151`)، وبینار. Say what happens after each and how long a reply takes. No WhatsApp.
**Keywords:** تماس با ما، رزرو مشاوره مهاجرت استارتاپی
**Links out:** `/which-path`, `/webinar`

---

### Task 24: `/fa/webinar`

**Brief:** A Persian rewrite of the existing webinar page, not a translation. موضوع وبینار؛ برای چه کسی؛ چه چیزی یاد می‌گیرید؛ ثبت‌نام ایمیلی. Reuse the existing server action in `app/[locale]/(public)/webinar/actions.ts` — the form is the same, the copy is new. Keep the existing Telegram links.
**Keywords:** وبینار رایگان مهاجرت، وبینار ویزای استارتاپ کانادا
**Links out:** `/which-path`, `/mentorship`

---

### Task 25: Persian blog index

**Files:** Modify `app/[locale]/(public)/blog/page.tsx`.

**Brief:** The blog already filters by locale (`:71`). What is missing is Persian framing: a Persian intro paragraph, Persian category labels, Jalali dates (already done in Task 11), and Persian empty-state copy. Do not build a second blog.
**Links out:** `/canada-startup-visa`, `/faq`

---

## Phase 2 gate

- [ ] Every path in `FA_PATHS` returns 200 with Persian body copy:

```bash
for p in "" /canada-startup-visa /canada-startup-visa/requirements /canada-startup-visa/cost \
  /canada-startup-visa/designated-organizations /pnp /usa-eb2-niw /which-path /mentorship \
  /faq /blog /about /contact /webinar; do
  printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' "localhost:3000/fa$p")" "/fa$p"
done
```

Expected: `200` on all fourteen.

- [ ] No English body copy on any `/fa` page (read each one).
- [ ] `npm test && npx tsc --noEmit` clean.
- [ ] Every `FAQPage` block validates at `https://validator.schema.org/`.
- [ ] Production deploy, then run `npx tsx scripts/fix-fa-article-links.ts --write` against the production database.

---

## Self-review notes

- **Spec coverage:** §3 IA → Tasks 12–25 (one task per row). §4.1 routing → Tasks 1, 4. §4.2 content storage → Tasks 9, 10. §4.3 SEO → Tasks 2, 3, and Step D of every Phase 2 task. §4.4 locale UX → Tasks 5, 6, 11. §4.5 autopilot inventory → Tasks 7, 8. Success criteria 1→Task 4, 2→Tasks 2/3, 3→Task 10, 4→Tasks 12–24, 5→Task 9 + Step D, 6→Tasks 7/8.
- **Naming:** `FaPage` is deliberately two different things in two files — `lib/fa/content.ts` exports the page content type, `lib/autopilot/inventory.ts` exports `FaPage` as a link-inventory row. They are never imported together. If that ever changes, rename the inventory one to `FaLinkTarget`.
- **Not covered by tests:** anything under `app/` — `vitest.config.ts` includes only `lib/**/__tests__/**`. That is why Tasks 3, 4, 6, 11 and all of Phase 2 end in a curl or browser check instead of an assertion.
