# Persian Magazine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Get `/fa/blog` publishing real Persian articles, on two lanes, and make it impossible for the pipeline to go silent again without anyone noticing.

**Architecture:** Two lanes over the existing autopilot — a news lane fed by authority feeds (Canadian today, European after Task 4) and a guide lane driven by a Persian-first topic backlog. Everything pure goes in `lib/` so tests never boot the router. A digest job turns the pipeline's own `AutopilotRun` rows into a message a human reads.

**Tech Stack:** Next.js 15 App Router · Prisma · vitest · Telegram Bot API (already used by the site's forms) · no new dependencies.

**Spec:** `docs/superpowers/specs/2026-09-06-persian-magazine.md`

## Global Constraints

- **No new dependency** without asking first. Every task below is achievable with what is installed.
- **TypeScript, no `any`** in new code. Pure logic lives in `lib/`; components stay thin.
- **Every programme claim needs an official citation or the article does not publish.** `decidePlannedPublication` is not to be weakened. Task 4 widens *which authorities* count, never *whether* a citation is required.
- **Persian copy rules** (from `houseStyle('fa')`): written register (`می‌رسد` not `می‌رسه`), نیم‌فاصله always, Persian digits inside Persian prose, programme names and acronyms stay Latin with a Persian gloss on first mention, callouts use `border-r-4` because the page is RTL.
- **SEO / AEO / GEO, on every article, both locales:** `Article` + `FAQPage` + `BreadcrumbList` JSON-LD; `inLanguage` `fa-IR` for Persian; **ISO dates in JSON-LD and `<time datetime>`, Jalali only in visible text**; `keyTakeaway` populated (40–60 words that answer the question outright — this is the answer-engine quote); `summaryEn` populated **even on Persian articles**, because that is what lets an English-language answer engine cite a Persian source; `hreflang` emitted only where an `en`/`fa` pair genuinely exists.
- **No Persian article may link to a retired `/fa` path.** `FA_SITE_PAGES` is the only internal link inventory for `fa`.
- **Commit after every task.** Tests green before each commit.

---

### Task 1: Digest summariser (pure)

**Files:**
- Create: `lib/autopilot/digest.ts`
- Test: `lib/autopilot/__tests__/digest.test.ts`

Turns `AutopilotRun` rows into a decision: is the pipeline healthy, degraded, or silent. No I/O, no formatting for a specific channel — that is Task 2.

**Steps:**
- [ ] Write the failing test: `summarise([], now)` reports `silent` when there are no runs inside the window.
- [ ] Write the failing test: runs exist but every one has `created === 0` → `degraded`, and the reason lists the distinct `notes`/warnings.
- [ ] Write the failing test: a locale with runs and `created > 0` → `healthy`; a second locale with none → the summary flags **that locale**, not the whole pipeline. This is the exact shape of the current bug: English was fine while Persian was silent for weeks.
- [ ] Write the failing test: a run with `finishedAt === null` older than the window counts as a **stuck** run, not a healthy one.
- [ ] Run the tests, watch them fail.
- [ ] Implement `summarise(runs, now, windowHours)` returning `{ locale, state, created, reasons }[]`.
- [ ] Run the tests, watch them pass.
- [ ] Commit.

### Task 2: Digest delivery

**Files:**
- Create: `app/api/cron/autopilot-digest/route.ts`
- Modify: `lib/autopilot/digest.ts` (add the message builder)
- Test: `lib/autopilot/__tests__/digest.test.ts`

**Decision (spec §8):** Telegram. The site's three forms already post there, so it adds no dependency and no new secret beyond what exists. Revisable.

**Steps:**
- [ ] Write the failing test: the message builder renders a silent Persian lane in Persian digits and names the window in plain language.
- [ ] Write the failing test: a healthy pipeline produces a **short** message, not a wall — nobody reads a daily wall.
- [ ] Run, fail, implement the builder, run, pass.
- [ ] Add the route, authorised exactly like `/api/cron/autopilot` (`CRON_SECRET` bearer, or an admin session). Reuse `authorised()` rather than re-implementing it.
- [ ] Verify by hand: `curl` the route locally with the dev secret and read the payload.
- [ ] Document the Cloud Scheduler job in `DEPLOY.md` next to the existing four.
- [ ] Commit.

### Task 3: Persian topic backlog

**Files:**
- Create: `content/fa/topics.ts`
- Modify: `lib/autopilot/planner.ts` (the `fa` branch only)
- Test: `lib/fa/__tests__/topics.test.ts`

**Decision (spec §8):** a typed module in the repo, like every other piece of Persian content, so it is reviewed and tested. Not a database table — that is a bigger build for a list that changes a few times a year.

Seeded with the four differentiators that have no English equivalent and are the reason to have a Persian magazine at all: انتقال وجه و اثبات تمکن مالی تحت تحریم · محل مصاحبه (دبی، ایروان، آنکارا، تفلیس) · تفاوت منتورشیپ با «مؤسسه مهاجرتی» · مدارک ایرانی (ترجمه رسمی، تأییدیه تحصیلی، روزنامه رسمی).

**Steps:**
- [ ] Write the failing test: every topic's `targetPath` is a member of `FA_PATHS`.
- [ ] Write the failing test: no two topics share a `slug`, and none duplicates an existing published Persian article title.
- [ ] Write the failing test: every topic carries the Persian query it is written for, so the file documents intent rather than being a list of headlines.
- [ ] Run, fail, write `content/fa/topics.ts`, run, pass.
- [ ] Write the failing test: the planner, for `locale === 'fa'`, draws from the backlog before inventing a topic from the site's own pages.
- [ ] Run, fail, wire the `fa` branch, run, pass.
- [ ] Commit.

### Task 4: European sources — spike, then add

**Files:**
- Modify: `lib/autopilot/sources.ts` (`SOURCES`)
- Test: `lib/autopilot/__tests__/sources.test.ts`

**This task starts as a spike and its output is an answer, not code.** All three current feeds are Canadian. Check each candidate authority actually publishes something machine-readable: Migri (FI) · Business Finland (FI) · SIRI / nyidanmark (DK) · IND (NL) · Startup Estonia (EE).

**Steps:**
- [ ] For each candidate, fetch the likely feed URL and record: does it return a parseable feed, how often does it update, is it in English.
- [ ] Report the findings before changing `SOURCES`. **An authority without a usable feed is left out, not scraped.**
- [ ] Write the failing test: every entry in `SOURCES` has an `https` `feedUrl` and a `freshDays` between 1 and 30.
- [ ] Write the failing test: the set of source slugs is unique.
- [ ] Run, fail, add the verified entries, run, pass.
- [ ] Confirm each new authority's hostname is already accepted by `officialCitationUrl` — after PR #9, `migri.fi`, `www.nyidanmark.dk`, `ind.nl` and `startupestonia.ee` all are. If one is not, add it to `OFFICIAL_SOURCES`, never to a bypass.
- [ ] Commit.

### Task 5: Persian article SEO / AEO / GEO audit

**Files:**
- Modify: whichever of `lib/autopilot/pipeline.ts`, `lib/seo.ts`, `app/[locale]/(public)/blog/[slug]/page.tsx` the audit shows to be wrong
- Test: `lib/__tests__/json-ld.test.ts`, `lib/__tests__/seo.test.ts`

Much of this surface already exists. **Verify before rebuilding** — the article page already emits `articleJsonLd`, `faqJsonLd` and a breadcrumb and renders `keyTakeaway`; `app/sitemap.ts` already lists published articles per locale.

**Steps:**
- [ ] Write a failing test for each property in Global Constraints that is not already covered: `inLanguage: 'fa-IR'` on a Persian article; ISO date in JSON-LD while the visible date is Jalali; `hreflang` absent when no `en` counterpart exists.
- [ ] Run them. **Some will pass — that is the point.** Record which properties already hold so the task does not rebuild working code.
- [ ] Fix only what fails.
- [ ] Write the failing test: the Persian writer populates `keyTakeaway`, `faq` and `summaryEn`. `summaryEn` on a Persian article is not a mistake — it is what lets an English-language answer engine quote a Persian source, and it is the single highest-leverage GEO field on this site.
- [ ] Run, fail, fix the `fa` prompt path, run, pass.
- [ ] Write the failing test: no Persian article body links to a path outside `FA_SITE_PAGES`.
- [ ] Run, fail, fix, pass.
- [ ] Commit.

### Task 6: Persian lane end-to-end dry run

**Files:** none — this task produces an answer and a report.

**Steps:**
- [ ] Run the planned lane: `npx tsx` equivalent of `/api/cron/autopilot?n=1&locale=fa&publish=1&dry=1` against the dev database.
- [ ] Read the output and check, in order: a brief was built · the article reached target length · `enforceLinks` kept at least one official citation · `decidePlannedPublication` returned `PUBLISHED` and not `DRAFT`.
- [ ] Repeat for the source lane.
- [ ] Report what each stage did. If the gate still returns `DRAFT`, the warning PR #9 added names the reason — follow it rather than guessing.
- [ ] **Decision (spec §8):** cadence starts at **one** Persian article a day, not the documented two. Nothing has ever published; ramp only after the quality has been read by a human.

---

## What this plan does not do

- It does not fix the Cloud Scheduler. If Task 45 in Notion shows no `fa` runs at all, the jobs were never created, and no code here changes that.
- It does not translate the twenty existing English articles.
- It does not touch the English lanes.
