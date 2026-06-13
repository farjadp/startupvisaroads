# Changelog

Record changes before each git push with date/time (minute precision).

## 2026-06-13 11:48
- **SEO & AIO Enhancements**: Integrated Article, Breadcrumb, and FAQ JSON-LD structured data; added alternate canonical tags; implemented ISR (Incremental Static Regeneration) for blog post pages; added HTML sanitization to prevent XSS.
- **Admin Category Management**: Developed `/admin/categories` CRUD interface with automatic slug generation and safety reassignments; created default seed list of 8 primary categories.
- **AI Writer Restrictions**: Updated AI writer prompts to enforce category selection from the database instead of creating ad-hoc names; refactored generate API to match case-insensitively and fall back gracefully.
- **Base64 Image Storage**: Converted AI cover/in-text images and manual tiptap uploads to inline Base64 data URLs to fix 404 errors caused by stateless, multi-instance Cloud Run containers.
- **Blog System & Admin CRUD**: Implemented Farsi/English paginated blog index; created full article editor with Tiptap, cover image uploader, and instant draft/publish controls.

## 2026-06-11 13:11
- Expanded the Netherlands Startup Visa page (`app/[locale]/europe/netherlands/page.tsx`) with a detailed roadmap, the 5 strict rules, the 3 agency lies, and a 20-fact comprehensive FAQ section (2-column grid layout).
- Fixed Unsplash image 404 issues on the Netherlands page by using stable photo IDs.

## 2026-02-13 20:06
- Fixed `IRANSansX` font path issue in `globals.css` and configured it in `tailwind.config.ts`.
- Updated Startup Work Permit form: added phone/email fields, updated designated org options, and implemented Telegram notification.

## 2026-02-13 19:33
- Fixed build error in PNP Brochure page: added missing `videoOpen` state and `VideoBriefing` modal.

## 2026-01-08 10:55
- Added Telegram notification support for contact form submissions.
- Updated About page with "The Architect" section and fixed icon imports.

## 2025-12-27 19:45
- Fixed `LifestyleCompass` typing for score updates.

## 2025-12-27 19:38
- Added new country pages under `app/australia/` and `app/country/`.
- Added privacy and terms pages.
- Updated header, footer, and contact page.
- Added `LifestyleCompass` component.

## 2025-12-27 18:43
- Added PNP province pages (New Brunswick, Newfoundland, PEI).
- Added `PNPMasterAssessment` component and updated `app/pnp/page.tsx`.

## 2025-12-27 15:00
- Added new PNP province pages (Saskatchewan, Manitoba, Nova Scotia).
- Updated `app/layout.tsx` and `tailwind.config.ts`.

## 2025-12-27 14:24
- Added PNP overview and province pages under `app/pnp/`.
- Added new hero variants and `SmartAudit` component.
- Updated navigation and adjusted layout/hero/contact content.
