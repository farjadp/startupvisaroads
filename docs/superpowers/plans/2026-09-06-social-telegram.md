# Telegram Distribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Every published article reaches the Telegram channel in its own language, and a short post keeps the channel alive on days nothing is published — with any failure visible in the daily digest rather than silent.

**Architecture:** Destinations become typed data; a `SocialPost` row records every attempt; message building is pure and tested; the send is the only impure part. The publish hook already exists (`shareToSocials` in `createArticleFromPayload`) and is extended rather than replaced.

**Tech Stack:** Prisma (dual schema), Telegram Bot API over `fetch`, vitest. No new dependency.

**Spec:** `docs/superpowers/specs/2026-09-06-social-distribution.md`

## Global Constraints

- **Both Prisma schemas must change together.** `prisma/schema.prisma` is SQLite for dev, `prisma/schema.production.prisma` is Postgres for prod, and `migrate deploy` runs the production one on container start. A model added to one file only will break the other environment.
- **No new dependency.** Telegram is a `fetch` to `api.telegram.org`.
- **Plain text, never `parse_mode`.** Captions come from a model and article bodies from the database; markup that cannot execute is markup that cannot be injected. Same rule the lead forms already follow.
- **Fail loud.** Every attempt writes a `SocialPost` row including failures, every failure logs, and the daily digest reports them. Social posting is the easiest thing to lose silently — nothing on the site changes when it stops.
- **Never post the same article to the same destination twice.** The `SocialPost` row is the guard.
- **Persian copy rules** apply to anything a reader sees: written register, نیم‌فاصله, Persian digits in prose.
- **A missing credential is a skip, not a crash.** The publish path must never fail an article because a channel is misconfigured.
- **Commit after every task, tests green first.**

---

### Task 1: `SocialPost`, in both schemas

**Files:** `prisma/schema.prisma` · `prisma/schema.production.prisma` · `prisma/migrations/<ts>_add_social_post/migration.sql`

- [ ] Add the model to **both** schema files: `id`, `articleId`, `destination`, `status` (`posted` | `failed` | `skipped`), `postedAt`, `remoteUrl`, `error`, `createdAt`; unique on `(articleId, destination)`; index on `(destination, createdAt)`.
- [ ] Hand-write the Postgres migration to match, following the two existing hand-named migrations.
- [ ] `npx prisma generate`, then `npx prisma db push` against dev.
- [ ] Verify the unique constraint actually prevents a duplicate, in a scratch script.
- [ ] Commit.

### Task 2: The destination registry

**Files:** Create `lib/social/destinations.ts` · Test `lib/social/__tests__/destinations.test.ts`

- [ ] Write the failing test: a destination declares its platform, the locales it accepts, its credential keys and `autoPost`.
- [ ] Write the failing test: `destinationsFor('fa')` returns the Persian-carrying destinations and excludes English-only ones.
- [ ] Write the failing test: a destination whose credentials are absent is reported as unconfigured rather than returned as postable — the caller must be able to tell "not set up" from "failed".
- [ ] Run, fail, implement, pass.
- [ ] Commit.

### Task 3: The two Telegram messages (pure)

**Files:** Create `lib/social/telegram-message.ts` · Test `lib/social/__tests__/telegram-message.test.ts`

- [ ] Failing test: the article message carries the title, a few lines of framing, and the canonical article URL, in the article's own language.
- [ ] Failing test: it stays inside Telegram's caption limit (1024 with a photo) and its length is driven by the framing, not by truncating the URL — a cut link is worse than no framing.
- [ ] Failing test: Persian articles render Persian digits in prose and keep programme codes Latin.
- [ ] Failing test: nothing in the output can be read as markup, since it is sent without `parse_mode`.
- [ ] Failing test: the short post carries one idea and a link, and is materially shorter than the article post.
- [ ] Run, fail, implement, pass.
- [ ] Commit.

### Task 4: Sending, and the publish hook

**Files:** Create `lib/social/telegram.ts` · Modify `lib/socials.ts` · Test as above

- [ ] Failing test: a missing token returns `skipped`, never throws — an article must publish even when a channel is misconfigured.
- [ ] Failing test: an existing `SocialPost` row for the same article and destination prevents a second send.
- [ ] Implement `sendToChannel` (photo + caption when there is a cover, message otherwise), writing a `SocialPost` row either way.
- [ ] Extend `shareToSocials` to include Telegram destinations.
- [ ] Verify by hand against a scratch channel before the real one.
- [ ] Commit.

### Task 5: The short post, on quiet days

**Files:** Create `app/api/cron/social-short/route.ts` · `lib/social/pick-article.ts` + test

- [ ] Failing test: `shouldPost(today, articles, posts)` is false when something published today, true otherwise.
- [ ] Failing test: it picks an article that has not been used for a short post recently, and never the same one twice running.
- [ ] Failing test: it returns nothing rather than repeating itself when every article has been used recently.
- [ ] Implement, wire the route behind `authorisedCron`, document the scheduler job in `DEPLOY.md`.
- [ ] Commit.

### Task 6: The digest reports social

**Files:** Modify `lib/autopilot/digest.ts` + test

- [ ] Failing test: a destination with only failures in the window appears in the digest.
- [ ] Failing test: a fully healthy day still renders short — the digest must not become a wall.
- [ ] Implement, run, pass.
- [ ] Commit.

---

## Not in this plan

LinkedIn and X, which are the next two slices · Facebook · post scheduling by time of day · metrics.
