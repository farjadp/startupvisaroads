# Spec — Persian Site (نسخه‌ی فارسی)

**Status:** signed off 2026-09-05
**Date:** 2026-09-05
**Owner:** Farjad P.D

---

## 1. Problem

`/fa` today is a half-built mirror, and the mirror is the problem.

Measured state of the repo:

| Fact | Evidence |
|---|---|
| 48 public pages exist; **3** use translations | `app/[locale]/(public)/**/page.tsx` — only `page.tsx`, `tools/page.tsx`, `tools/express-entry/page.tsx` call `useTranslations`/`getTranslations` |
| `messages/fa.json` has 145 leaf strings; **102** belong to one calculator | keys: `Hero` 6, `Navigation` 28, `NotFound` 5, `Tools` 4, `ExpressEntry` 102 |
| Shared chrome is untranslated | `components/Footer.tsx`, `HeroSection.tsx`, `CTASection.tsx` → 0 translation calls. Only `Header.tsx` is wired. |
| One-off Persian page outside the i18n system | `app/[locale]/(public)/landing/pnp-landing/pnp-farsi/page.tsx` (688 lines) |
| Sitemap claims 37 Persian pages that are English | `app/sitemap.ts:44` emits `hreflang` alternates for `en` **and** `fa` on every static path |

Net effect: `/fa/services`, `/fa/pnp/ontario`, `/fa/about` render **English copy inside an RTL shell with a Persian font**, and the sitemap tells Google those are legitimate Persian pages. That is worse than having no Persian site: it burns crawl budget, creates thin/duplicate signals against the domain, and destroys trust with a Persian-speaking founder in the first three seconds.

## 2. Decision

**Do not translate the English site. Build a separate Persian site inside the same codebase.**

The Iranian founder arrives with a different question, searches different terms, distrusts a different set of things, and converts through a different channel. A 1:1 mirror can never serve that, which is exactly why the mirror stalled at 6% coverage.

### Decisions locked in brainstorming

| Decision | Choice |
|---|---|
| Architecture | One codebase, one deploy. `/fa` gets its **own route tree and own IA**, not a mirror of `/en`. |
| Content | **Persian keyword-first rewriting**, not translation. Written against Persian search intent, reviewed by Farjad. |
| URL slugs | **Latin** (`/fa/canada-startup-visa`) — clean for sharing and analytics. |
| Positioning | **Mentorship & readiness**: «ما وکیل مهاجرتی نیستیم — شما را برای پذیرش آماده می‌کنیم.» |
| Conversion channels | Telegram **+** free assessment form **+** existing booking system **+** Persian webinar — all four. |
| Untranslated pages | **301 redirect** `/fa/<untranslated>` → `/en/<same>`. Never serve English inside the Persian shell. |
| Locale UX | Persian digits (۱۲۳), Jalali dates, **Estedad** as the Persian display font. |
| Messaging channel | **Telegram only** (`@farjadtalks`, `@Heros_Journey`). No WhatsApp number exists. |
| Assessment tool | A **new, simple Persian-specific flow** — not a reuse of `PNPStrategicAssessment` / `SmartAudit`. |

## 3. Persian information architecture

Built from Persian search intent, not from the English sitemap. Each page targets one intent cluster.

| Path (`/fa/…`) | Primary intent | Notes |
|---|---|---|
| `/` | brand + routing | Persian-first hero, mentorship positioning, path chooser |
| `/canada-startup-visa` | «ویزای استارتاپ کانادا» | Pillar page — highest Persian volume |
| `/canada-startup-visa/requirements` | «شرایط ویزای استارتاپ کانادا» / «مدارک» | Separate intent, separate page |
| `/canada-startup-visa/cost` | «هزینه ویزای استارتاپ کانادا» | Top Persian query; must be honest about ranges |
| `/canada-startup-visa/designated-organizations` | «سازمان‌های تأییدشده» / «DO» | High-intent + trust builder |
| `/pnp` | «برنامه استانی کانادا» | Single hub page, not 9 province pages |
| `/usa-eb2-niw` | «EB-2 NIW ایرانی» | High demand, low Persian competition |
| `/which-path` | «کدام مسیر مهاجرت برای من» | Assessment tool = lead magnet |
| `/mentorship` | «منتورشیپ» / «دوره آماده‌سازی» | The actual offer |
| `/faq` | question-shaped queries | AEO/GEO surface — the stated top goal |
| `/blog` + `/blog/[slug]` | long-tail | Autopilot with `locale: 'fa'` |
| `/about` | trust | Founder story; scam-market differentiation |
| `/contact` | conversion | All four channels in one place |
| `/webinar` | conversion | Persian rewrite of the existing page |

**Iranian-specific content that has no English equivalent** and must be written natively — these are the differentiators, not extras:

- انتقال وجه و اثبات تمکن مالی تحت تحریم
- محل مصاحبه (دبی / ایروان / آنکارا / تفلیس)
- تفاوت منتورشیپ با «مؤسسه مهاجرتی» — چطور کلاهبرداری را تشخیص دهیم
- مدارک ایرانی: ترجمه رسمی، تأییدیه تحصیلی، سابقه شرکت

Everything not in the table above (Denmark, Finland, Netherlands, UAE, Australia, EB-1, EB-5, the nine individual PNP province pages, `country/*`, `landing/*`) is **English-only**. `/fa/<those>` returns a 301 to `/en/<those>`.

## 4. Technical approach

### 4.1 Routing

`routing.ts` gains a `pathnames` map so `/fa` can carry its own path set rather than mirroring `/en`. Persian-only pages live in their own route segments; the shared segments (`/blog`, `/contact`, `/mentorship`, `/webinar`) resolve per-locale to different content modules.

Redirect layer for the retired mirror paths lives in `middleware.ts`, ahead of `intlMiddleware`, as an explicit 301 map — not a catch-all, so a typo does not silently redirect.

### 4.2 Content storage

- `messages/{en,fa}.json` — **UI chrome only**: navigation, footer, buttons, form labels, validation messages, error states.
- `content/fa/<page>.ts` — **page content**: typed modules exporting a page-shaped object (hero, sections, FAQ arrays, CTA copy). Type-safe, diffable, no runtime cost, and long-form Persian prose stays readable in source instead of collapsing into deep JSON keys.

Rationale: 300–900 line marketing pages have FAQ arrays, embedded links, and repeated section shapes. Those belong in typed modules; only chrome belongs in flat message catalogs.

### 4.3 SEO

- `app/sitemap.ts` is rewritten: `en` paths and `fa` paths become **two separate lists**. `hreflang` alternates are emitted **only for paths that have a real pair** in both locales. `x-default` → `en`.
- `lib/seo.ts:buildAlternates` gains an explicit pairing table; it must stop assuming every path exists in every locale.
- Persian pages emit `FAQPage` and `Article` JSON-LD in Persian — this is the AEO/GEO surface.

### 4.4 Locale UX

| Item | Rule |
|---|---|
| Digits | Persian digits (۱۲۳) in prose and dates. **Latin** for program codes (EB-2, SUV), currency amounts, and phone numbers. |
| Dates | Jalali for article dates and event dates; ISO in `<time datetime>` and JSON-LD. |
| Display font | **Estedad** for Persian headings, replacing `DM_Serif_Display` under `fa`. Self-hosted via `next/font/local` (Estedad is SIL OFL; it is not on Google Fonts, so it cannot use `next/font/google` like Vazirmatn does). Without it the Persian typographic hierarchy collapses to a single weight. |
| Direction | Icons, arrows, and progress indicators must mirror; the RTL layout is native, not a flipped LTR layout. |

### 4.5 Autopilot — link inventory, not generation

**Persian generation already works.** `lib/autopilot/{writer,planner,source-writer,pipeline}.ts` all branch on `inv.locale === 'fa'` and prompt in Persian; the production schedule is 5 articles/day, 3 EN + 2 FA. Nothing to build there.

The real problem is `lib/autopilot/inventory.ts:33` — `SITE_PAGES` is a single list of **locale-agnostic paths carrying Persian labels**. So Persian articles link to `/fa/pnp/ontario`, `/fa/country/denmark`, `/fa/europe/finland` — every one of which this spec turns into a 301 to `/en`. Persian readers would be bounced out of Persian mid-article, and `enforceLinks` would keep minting those links.

Required:
- `SITE_PAGES` becomes locale-partitioned: the `fa` list contains only paths from the §3 IA table.
- A one-off migration rewrites internal links in **existing published `locale: 'fa'` articles** — retired paths are demoted to plain text, the same way `enforceLinks` demotes unknown links.
- Article dates render Jalali on Persian pages.

## 5. Out of scope

- Translating the remaining 34 English pages.
- A separate Persian domain or subdomain.
- Persian admin console (admin stays English).
- Payment handling for Iranian users (channel is conversational; no Stripe path).

## 6. Success criteria

1. No page under `/fa` renders English body copy. Every `/fa` URL either serves real Persian content or 301s to `/en`.
2. `hreflang` pairs exist only where both locales have real content; sitemap Persian entries match the IA table exactly.
3. Chrome (header, footer, hero, CTA, forms, 404) is fully translated — zero hardcoded English strings in shared components under `fa`.
4. All four conversion channels reachable from every Persian page.
5. Persian pages emit valid Persian `FAQPage` JSON-LD.
6. No published Persian article contains an internal link to a retired `/fa` path; the Persian autopilot inventory contains only paths from the §3 IA table.

## 7. Resolved (2026-09-05)

- **Display font:** Estedad, self-hosted via `next/font/local`.
- **Assessment:** new simple Persian flow at `/fa/which-path`; no reuse of the English assessment components.
- **Messaging:** Telegram only.
