# Persian Site — Phase 3: Pivot & Redesign

**Date:** 2026-09-06 · **Owner:** Farjad P.D · **Spec addendum to:** `docs/superpowers/specs/2026-09-05-persian-site.md`

## Why this phase exists

1. **The Canada Start-up Visa is closed to new applications** (PR intake closed 31 Dec 2025; SUV work permit closed 19 Dec 2025). A "high-impact" replacement pilot is announced for 2026 — 2,000 principals/year, ~12-month target, sector quotas (cleantech, AI, life sciences), staged capital and job milestones — but has no confirmed opening date. Phase 2 built four Persian pages that describe SUV as open. That is now the most important factual error on the site.
2. Farjad's direction: pivot the Persian home toward **European start-up visas — Finland, Denmark, Estonia** (+ Netherlands, which has a video) — and **Atlantic provincial entrepreneur streams — New Brunswick, Nova Scotia**.
3. Use the **@FarjadTalks YouTube catalogue** inside the content (30 videos catalogued; 12 relevant).
4. Inner pages read like a newspaper. Add **imagery, motion, interactivity, and 3D on every page** (decided by Farjad after the bundle-cost concern was raised).
5. Contact details from farjadp.com: **WhatsApp +1 (437) 661-1674, farjad@ashavid.ca, LinkedIn, Instagram** — Telegram stays first.

## Decisions (2026-09-06)

| Decision | Choice |
|---|---|
| SUV pages | Keep all four with a **closure banner**, rewrite the hero and opening to the current state, add a **2026 pilot** section and an **alternatives** block. Sub-pages keep their content with a banner and a note. |
| New Persian pages | `/europe/finland`, `/europe/denmark`, `/europe/estonia`, `/pnp/new-brunswick`, `/pnp/nova-scotia` — Persian-first, paired with English where the English page exists. |
| 3D | `three` + `@react-three/fiber` + `drei`, one shared scene (`RoadsScene`) with per-page variants, `next/dynamic` `ssr:false`, mounted only in view, `prefers-reduced-motion` → static SVG. On **every** page. Bundle cost accepted by Farjad. |
| Motion | `motion` (framer). One authored focal moment per page (hero arrival), quiet reveals elsewhere, reduced-motion path everywhere. |
| Imagery | Brand images generated with the existing Fal pipeline (`brandPrompt` from `lib/autopilot/art-direction.ts`) into `public/fa/img/*.webp`; YouTube thumbnails for video cards. No stock. |
| Craft floor | Per impeccable: no eyebrow labels above headings, no section numbers, no `border-left > 1px` callouts, no hard offset shadows, no same-size icon-card grids, real icon system, themed browser surfaces, one authored motion moment. |
| Assessment | `recommendPath` no longer returns `suv`. Outcomes: `europe` (Finland/Denmark/Estonia by founder count and stage), `atlantic` (NB/NS when funded ≥ ~CAD 150k investment + 500k net worth), `eb2niw`, `too-early`. |

## Facts for the new pages (verified 2026-09-06, re-verify before publish)

- **NB Business Immigration Stream (NBBIS):** net worth ≥ CAD 500k (300k farming), eligible investment ≥ 150k, ≥1 job, CLB 5, age 22–55, 3 yrs ownership or 5 yrs senior management, EOI + 65/100 points. Replaced the old Entrepreneurial Stream.
- **Nova Scotia Entrepreneur:** net worth ≥ CAD 600k (400k outside Halifax), investment ≥ 150k, ≥33.3% ownership, 3 yrs ownership or 5 yrs senior mgmt, work permit first → nomination after 12 months operating, 1 FT job.
- **Finland Start-up Permit:** ≥2 founders moving to Finland, Business Finland Eligibility Statement (≤4 months old at application), international scalability, personal funds ≈ €1,030–1,210/month for a year (by municipality), permit up to 2 years renewable, no investment required.
- **Start-up Denmark:** expert panel approves the business plan (≈6 weeks), up to 3 founders, funds ≈ DKK 153,696 for the first year (single), permit up to 2 years then +3.
- **Estonia Startup Visa:** Startup Committee approval (≈10 business days), tech-based scalable startup with an MVP, €800/month personal funds, D-visa €120 or TRP €350/380 for 2+3 years.

## Tasks

### A — Content truth first (ship before anything visual)

- [ ] **A1** `lib/fa/paths.ts`: add the five new paths; pair `/europe/finland`↔`/europe/finland`, `/europe/denmark`↔`/country/denmark`, `/pnp/new-brunswick`↔`/pnp/new-brunswick`, `/pnp/nova-scotia`↔`/pnp/nova-scotia`, `/europe/estonia`→null. Update `FA_SITE_PAGES`, tests, header + footer link sets. Redirect map already handles the rest.
- [ ] **A2** `components/fa/StatusBanner.tsx` + `content/fa/suv-status.ts` (one source: closure dates, pilot facts, `updated`). Apply to the four SUV pages; rewrite pillar hero/opening; add «پایلوت ۲۰۲۶» and «مسیرهای باز» sections; sub-pages get banner + one-paragraph note.
- [ ] **A3** Five new content modules + routes (Finland, Denmark, Estonia, NB, NS). Branch the existing `/europe/finland`, `/pnp/new-brunswick`, `/pnp/nova-scotia` routes like PNP; `/europe/denmark` and `/europe/estonia` are new Persian-only routes (English Denmark lives at `/country/denmark`).
- [ ] **A4** Quiz: new outcomes, new tests, new result copy. FAQ: update SUV answers, add Europe/Atlantic groups. PNP hub: elevate NB/NS. Home: re-point path cards.
- [ ] **A5** Contact + footer: WhatsApp, email, LinkedIn, Instagram. `content/fa/home.ts` gains a `CONTACT` constant used everywhere.

### B — YouTube

- [ ] **B1** `content/fa/videos.ts` catalogue (id, title, tags, pages) from the scraped list; `next.config` adds `i.ytimg.com`.
- [ ] **B2** `components/fa/VideoCard.tsx` lite facade (thumbnail → iframe on click, `VideoObject` JSON-LD), `VideoRail` for a page's related videos. Wire into `FaPageLayout` (`videos` prop) and the home.

### C — Redesign (Persuade for home/paths, Read for guides)

- [ ] **C1** Install `motion`, `three`, `@react-three/fiber`, `@react-three/drei`. `components/fa/three/RoadsScene.tsx`: globe with great-circle arcs from Tehran to the page's destinations, acid-lime arc draw-on as the authored moment, ink/paper materials, idle slow rotation, pauses offscreen, static SVG fallback for reduced motion / no WebGL.
- [ ] **C2** `scripts/gen-fa-assets.ts`: generate ~12 brand images (home + each destination + mentorship + about) via `brandPrompt`, save `public/fa/img/<name>.webp` (cwebp), commit the files.
- [ ] **C3** Redesign `FaPageLayout` and `FaHome` to the craft floor: hero = image + scene + headline (no eyebrow); sections alternate text/media; steps become an interactive stepper; key facts become an interactive comparison; callouts restyled; FAQ accordion with motion; scroll progress; CSS-3D tilt on path cards; counters; themed selection/scrollbar/focus. Motion thesis per page written in the component header.
- [ ] **C4** Batched inspection round (desktop + mobile), fix, one confirm round. Lighthouse on `/fa` and one guide.

### D — Bookkeeping

- [ ] Notion: Phase 3 cards, project status. Memory. Sitemap re-check. `npm test`, `tsc` green at every commit.
