# SEO/GEO/AIO/AEO Hardening + Team & Contact Pages — Full Report

## Branch
`feat/seo-geo-aeo-hardening`

## Summary

This branch implements a trust-first SEO/GEO/AIO/AEO hardening pass across the entire Startup Visa Roads codebase, plus new team and contact pages with direct team member contact information.

---

## 1. Technical SEO Foundation

### `lib/seo.ts`
- Added stable schema `@id` constants: `ORGANIZATION_ID`, `WEBSITE_ID`, `LOGO_ID`
- Added `schemaLanguage()` for BCP-47 (`en-US` / `fa-IR`)
- Added locale-aware `defaultOgImage()`
- `LOGO_URL` points to the real logo asset (`/img/VisaRoads-Logo13.png`), not an OG image
- Added `normalizeSeoImageUrl()` — makes relative URLs absolute, rejects `data:` and `//` URLs
- Added `stripHtml()` — strips HTML from meta descriptions
- Added `isDataImageUrl()` — for `next/image` `unoptimized` flag
- Added `webPageJsonLd()` and `collectionPageJsonLd()` builders
- Updated `articleJsonLd()` — normalizes image, adds `inLanguage`, stable author `@id`
- Updated `faqJsonLd(faqs, locale)` — adds `inLanguage`
- Added `noindex`/`nofollow` support in `buildMetadata()`
- `buildAlternates()` only emits real alternates (fa is not a mirror of en)

### `app/sitemap.ts`
- Uses `EN_INDEXABLE_PATHS` and `FA_PATHS` registries
- Uses real database `updatedAt` for articles and categories
- Adds localized category entries with hreflang
- `revalidate = 600`

### `app/robots.ts`
- `revalidate = 86400`
- Explicitly welcomes AI/answer-engine crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Google-Extended, Applebot-Extended, ClaudeBot, Bytespider)

### `lib/pageMeta.ts`
- Centralized `EN_INDEXABLE_PATHS` route registry
- Metadata for book-meeting, webinar, unsubscribe
- `noindex` for unsubscribe and login
- Added `/team` to indexable paths and META

### `app/[locale]/(public)/unsubscribe/layout.tsx` (new)
- noindex metadata boundary

### `app/[locale]/(public)/book-meeting/page.tsx` and `webinar/page.tsx`
- Explicit metadata added

### `app/[locale]/(public)/europe/denmark/page.tsx`
- `permanentRedirect` for non-Persian access

### `app/[locale]/layout.tsx`
- Locale-aware OG image selection

### `components/JsonLd.tsx`
- Escapes `<` to prevent JSON-LD script breakout

### `lib/fa/content.ts`
- `isPartOf` uses canonical `WEBSITE_ID` (not inline object)

---

## 2. Blog Package

### `lib/blog.ts`
- Locale-safe article queries — legacy locale-less rows only served under `en`
- `computeReadingTime()` — computed at render time, not stored
- `getSafeQuickFacts()` — filters unsupported claims: `%`, `compliance`, `validated`, `official`, `approved`, `certified`, and standalone `\b20\d\d\b` (e.g. "Updated for 2026")
- `buildRelatedArticleBox()` — escapes HTML for slug/title/excerpt
- `buildBlogPageHref()` — builds pagination URLs preserving `q` and `category`
- Legacy fallback for `fa` returns empty (never serves English under Persian)
- Renamed misleading `sameCategory` variable to `fallbackLatest`

### `app/[locale]/(public)/blog/[slug]/page.tsx`
- Self-canonical metadata + correct locale hreflang
- `next/image` with `fill`, `priority`, `sizes`, `unoptimized` for data URLs
- Visible organization byline
- Published and updated dates
- FAQ schema only from `article.faq` (with visible-content parity)
- `stripHtml` on description
- Image normalized via `normalizeSeoImageUrl` in schema

### `app/[locale]/(public)/blog/page.tsx`
- `CollectionPage` + `Blog` schema
- `next/image` with `unoptimized` for data URLs
- Category links use clean `/blog/category/:slug` (not noindex query variants)
- Pagination uses `buildBlogPageHref` (preserves `q`)
- `noindex` for query variants

### `app/[locale]/(public)/blog/category/[slug]/page.tsx`
- `CollectionPage` + `BreadcrumbList` schema
- Reciprocal hreflang only between locales that actually have published articles
- `next/image` with `unoptimized` for data URLs

---

## 3. Autopilot Trust Hardening

### `lib/autopilot/official-sources.ts` (new)
- Typed registry of 19 official government sources (IRCC, Canadian provinces, USCIS, Migri, Business Finland, nyidanmark, Danish Business Authority, Startup Estonia, IND, Australian Home Affairs, UAE)
- HTTPS host roots only — no fabricated deep URLs
- `officialCitationUrl()` validates: HTTPS, no port/credential, host in allowlist
- `officialSourcesForBrief()` selects relevant authorities by programme paths and keywords
- `officialSourcePromptForBrief()` generates citation instructions for the writer

### `lib/autopilot/text.ts`
- `enforceLinks()` now preserves allowlisted official HTTPS citations with `target="_blank" rel="noopener noreferrer"`
- Non-official external links stripped to plain text
- Added `officialLinks` and `officialCitationCount` to output
- Added `decidePublishStatus()` — no official citation → DRAFT

### `lib/autopilot/writer.ts`
- Writer prompt receives official sources and requires inline citations for mutable programme claims
- No citation → DRAFT with warning persisted in AutopilotRun notes
- Removed pseudo-compliance prompts (`95%`, `validated for 2026`)

### `lib/autopilot/pipeline.ts`
- Hardened shared factual rules
- Warning persisted in AutopilotRun notes

### `lib/autopilot/source-writer.ts`
- Removed `rel="nofollow"` from editorial source citations
- `enforceLinks` runs after visuals so generated captions/SVGs cannot bypass it

### `lib/autopilot/inventory.ts`
- Removed closed routes: Canada startup work permit, Ontario Entrepreneur, Saskatchewan Entrepreneur
- Canada SUV remains only as a status guide, not active programme
- Added `/team` to both EN and FA link inventories

### `lib/autopilot/planner.ts`
- Seasonal hooks are neutral and verification-oriented (no unsupported cadence/intake claims)

### `app/api/cron/generate/route.ts`
- Legacy cron now saves as DRAFT (never auto-publishes through weaker `lib/ai.ts`)

### `lib/ai.ts`
- Removed prompt examples requesting `95% compliance`, `validated for 2026`, scored compliance/actionability, and reading-time generation

---

## 4. Unsupported Statistics Audit

Searched for `98% success`, `150+ founders`, `$10M raised`, `40% rejected`, `95% success`, `95% compliance` — **none found** in the codebase.

---

## 5. Discovery Assets

### `app/rss.xml/route.ts` (new)
- RSS 2.0 English feed, 20 most recent published articles

### `app/fa/rss.xml/route.ts` (new)
- RSS 2.0 Persian feed, 20 most recent published articles

### `public/llms.txt` (new)
- Machine-readable site guide with:
  - Legal boundary (not lawyers / not RCIC)
  - 2026 status note for changed/closed programs
  - Key page links
  - Official government sources referenced
  - Feed links

---

## 6. Team & Contact Pages

### `content/team.ts` (new)
- Bilingual team member data (7 members):
  - **Farjad** — Startup Mentor & Founder of Ashavid (Toronto) — Telegram @farjadtalks, WhatsApp, +1 (437) 661-1674
  - **Mohsen** — Account Manager & COO (Finland) — Telegram @mohsenkavian, WhatsApp, +98 919 761 2839, +358 41 7060295
  - **Meysam** — Startup Mentor (Denmark) — Telegram @Mayneech, +98 937 112 0408, +45 71 539 757
  - **Hamid** — Startup Mentor (Iran) — Telegram @Hamidrezasm, +98 921 413 4435
  - **Iman** — Product Manager
  - **Mohammad Ali** — Startup Mentor
  - **Hadi** — Startup Mentor

### `app/[locale]/(public)/team/page.tsx` (new)
- English team page with hero + team grid (contact info per member) + CTA
- Persian branch renders `FaTeam` component

### `content/fa/team.ts` (new)
- Persian page content for FaPageLayout-compatible metadata

### `components/fa/FaTeam.tsx` (new)
- Persian team page: hero + team grid with Telegram/WhatsApp/phone per member + closing CTA
- JSON-LD: faWebPageJsonLd + faqJsonLd + breadcrumbJsonLd

### `app/[locale]/(public)/contact/ContactEn.tsx` (updated)
- Added "Direct Lines" team contact section after the Protocol section
- Team grid with name, role, location, phone numbers, Telegram, WhatsApp
- Link to full team page

### `components/fa/FaContact.tsx` (updated)
- Added "تماس مستقیم با اعضای تیم" section between form and booking
- Team grid with contact info per member
- Link to Persian team page

### `content/fa/contact.ts` (updated)
- Added `teamSection` with heading, body, and teamPageLink

### Route registration
- `lib/fa/paths.ts` — `/team` added to `FA_PATHS` and `FA_PAIRED`
- `lib/pageMeta.ts` — `/team` added to `EN_INDEXABLE_PATHS` and `META`

---

## 7. Persian Hero (pre-existing, preserved)

The Persian homepage hero was redesigned before the SEO work:
- Old suitcase/globe visual removed
- Hero repositioned around startup preparation
- Persian copy shortened and clarified
- Visual three-step roadmap added
- Legal boundary ("حقوقی مهاجرت") explicit in positioning copy

---

## 8. Tests

### New test files
- `lib/__tests__/blog.test.ts` — locale, quick-fact, recommendation
- `lib/__tests__/json-ld.test.ts` — JSON-LD escape
- `lib/__tests__/page-meta.test.ts` — indexability
- `lib/__tests__/sitemap.test.ts` — sitemap coverage
- `lib/__tests__/discovery.test.ts` — llms.txt
- `lib/autopilot/__tests__/trust-hardening.test.ts` — allowlist, citation, publish decision

### Final results
```
Test Files:  21 passed (21)
Tests:       170 passed (170)
TypeScript:  0 errors
Build:       success
git diff --check: clean
```

---

## 9. Known Remaining Limitations

1. **Immigration route status pages** — public pages (Canada SUV, Ontario, Saskatchewan) not rewritten; requires official source verification.
2. **Search Console** — integration deferred to a later phase (needs exported data from user).
3. **Persian OG image content** — should be verified in browser.
4. **Hydration motion** — `Reveal`/`TiltCard` hydration errors observed in earlier browser inspection; not in scope of this work.

---

## 10. Files Changed

### Modified (31)
- `app/[locale]/(public)/blog/[slug]/page.tsx`
- `app/[locale]/(public)/blog/category/[slug]/page.tsx`
- `app/[locale]/(public)/blog/page.tsx`
- `app/[locale]/(public)/book-meeting/page.tsx`
- `app/[locale]/(public)/contact/ContactEn.tsx`
- `app/[locale]/(public)/europe/denmark/page.tsx`
- `app/[locale]/(public)/webinar/page.tsx`
- `app/[locale]/layout.tsx`
- `app/api/cron/autopilot/route.ts`
- `app/api/cron/generate/route.ts`
- `app/robots.ts`
- `app/sitemap.ts`
- `components/JsonLd.tsx`
- `components/fa/FaContact.tsx`
- `components/fa/FaHome.tsx`
- `content/fa/contact.ts`
- `content/fa/home.ts`
- `lib/__tests__/seo.test.ts`
- `lib/ai.ts`
- `lib/autopilot/__tests__/inventory.test.ts`
- `lib/autopilot/__tests__/sources.test.ts`
- `lib/autopilot/__tests__/text.test.ts`
- `lib/autopilot/inventory.ts`
- `lib/autopilot/pipeline.ts`
- `lib/autopilot/planner.ts`
- `lib/autopilot/source-writer.ts`
- `lib/autopilot/text.ts`
- `lib/autopilot/writer.ts`
- `lib/blog.ts`
- `lib/fa/__tests__/content.test.ts`
- `lib/fa/content.ts`
- `lib/fa/paths.ts`
- `lib/pageMeta.ts`
- `lib/seo.ts`

### New (14)
- `app/[locale]/(public)/team/page.tsx`
- `app/[locale]/(public)/unsubscribe/layout.tsx`
- `app/fa/rss.xml/route.ts`
- `app/rss.xml/route.ts`
- `components/fa/FaTeam.tsx`
- `content/fa/team.ts`
- `content/team.ts`
- `lib/__tests__/blog.test.ts`
- `lib/__tests__/discovery.test.ts`
- `lib/__tests__/json-ld.test.ts`
- `lib/__tests__/page-meta.test.ts`
- `lib/__tests__/sitemap.test.ts`
- `lib/autopilot/__tests__/trust-hardening.test.ts`
- `lib/autopilot/official-sources.ts`
- `public/llms.txt`

---

## Generated with Devin

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>
