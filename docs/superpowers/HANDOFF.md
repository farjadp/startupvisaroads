# Handoff — 6 Sep 2026

Read this before touching anything. It carries the state, the things that
will surprise you, and the decisions worth knowing before you change them.

## The single most important thing

**Nothing in this project was broken by code. It was broken by things that
were never switched on, and nothing reported it.** Three separate systems
were found today built, wired, tested and silently inert:

| System | What was wrong |
|---|---|
| The autopilot | **Zero Cloud Scheduler jobs existed, in all 30 regions.** Articles only ever appeared when someone triggered the endpoint by hand |
| Telegram lead forms | The bot token was revoked. `getMe` returned 401. Every contact, webinar and quiz submission had been failing |
| `lib/socials.ts` | 468 lines of working LinkedIn/X/Facebook code, called on every publish, with not one credential configured |

If something looks broken, check whether it is configured before you read the
code. That instinct would have saved most of a day.

## Where production actually is

**europe-west1**, service `startupvisaroads`,
`https://startupvisaroads-iyedgs6r2q-ew.a.run.app`.

There is a **stale duplicate service in us-central1**, 35 revisions behind,
serving no traffic, which answers on its own run.app URL and returns 404 for
anything added in the last year. It looked like a routing bug for ten
minutes. DEPLOY.md said us-central1 throughout and has been corrected.
Deleting the duplicate is Farjad's call and has not been done.

Pushing `main` deploys. Build takes 6–8 minutes.

## What runs on a schedule

All in europe-west1, all UTC, all created 6 Sep 2026 — before that there were
none.

```
06:00  svr-autopilot-en        1 English article
07:00  svr-autopilot-fa        1 Persian article, from the topic backlog
09:00  svr-social-insights-1   1 insight tweet per account
11:00  svr-autopilot-source-1  English, from the news feeds
14:00  svr-autopilot-source-2  English, from the news feeds
15:00  svr-social-insights-2   1 insight tweet per account
17:00  svr-social-short        Telegram, only on a day nothing published
18:00  svr-autopilot-digest    the daily report

08:00  svr-social-knowledge-08 1 English knowledge tweet  ⟍
12:00  svr-social-knowledge-12 1 English knowledge tweet   ⟩ @ashavidgroup
16:00  svr-social-knowledge-16 1 English knowledge tweet   ⟩ four separate jobs:
20:00  svr-social-knowledge-20 1 English knowledge tweet  ⟋ four in one minute is a bot
```

### The tweets themselves (6 Sep, evening)

The insight post is **written**, not extracted. It used to be the sentence
around a `<strong>` mark picked at random, which read exactly like what it was
— a line torn out of a page. `lib/social/write-insight.ts` writes it from the
article under the article pipeline's fact rules. A draft carrying a link, a
hashtag, an emoji, Latin digits in Persian prose, an English word inside
Persian text, or over its budget is rewritten once and then **dropped, never
trimmed**: a post cut mid-thought is the failure this replaced.

`lib/social/knowledge.ts` is the English account's own voice — routes,
countries, cities, business culture — on a nine-angle rotation, with no source
page behind it, so its fact rules are *stricter*: nothing that can change
(fees, thresholds, processing times, what a programme is accepting) and no
superlatives, which is where an unsourced post turns into a false claim.

Every post carries a Pexels photo with alt text. The photo is decoration and
never a reason a post does not happen. **A Turkish passport went out on a post
about Canada's PGWP** because the search term was "passport on a desk"; three
guards now stand in the way, in `lib/social/photo.ts`.

Hashtags are chosen per post, in the post's language.

### Two selection bugs, both found by looking at what actually published

- **A failed tweet burned the article.** Every attempt writes a `SocialPost`
  row including the failures, and selection counted every row as use. Two 403s
  put both English articles out of reach for 45 days, and the lane then
  reported "every article was used within 45 days" having published nothing at
  all. Only `posted` rows count now.
- **The legacy G-P articles were eligible.** `prefer: 'newest'` did not keep
  them out because the newest English articles are also theirs. Selection takes
  only articles with `aiModel` set.

**Only two English articles are the autopilot's own**, and both are about study
permits and PGWP. On an AI-venture account that is an odd fit, and it is
Farjad's call whether @ashavidgroup carries article tweets at all.

`svr-autopilot-source-fa` is deliberately **not** created: Persian starts at
one article a day so its quality can be read before the volume goes up.

## The digest is the thing that keeps this honest

`/api/cron/autopilot-digest` reports per **lane**, not per pipeline — asking
"is the autopilot working" answers yes while one locale is dead, which is
exactly how six weeks passed. It also reports social delivery, and names only
what is unhealthy so a good day stays three lines.

Two corrections already came out of it: it counted **dry runs as
publications** (reporting `fa: healthy — 1 published` against a database with
zero Persian articles), and the quiet-day route claimed "every article was
used within 45 days" when there were no articles at all. Both fixed. Expect
more of this: a diagnostic that names the wrong cause is worse than none.

## Social distribution

Destinations are **data**, in `lib/social/destinations.ts`. Each declares its
platform, the locales it accepts, its own credential keys, and `autoPost`.
Adding a destination is an entry, not a code path.

| Destination | State | Notes |
|---|---|---|
| Telegram `@visaroads` | **live** | Persian only. Posted by `@herosjourney_bot`, deliberately not the support bot — when that token died it took every lead form with it |
| X `@FarjadTalks` | **live** | Persian only, Premium so long-form, every post signed as sent by his digital assistant |
| X `@ashavidgroup` | **live** | English only, standard 280 limit |
| LinkedIn ×2 pages | **blocked** | see below |

Every attempt writes a `SocialPost` row **including skips**, because a skip
that leaves no trace is indistinguishable from a system nobody asked to run.
Nothing in the social path throws: an article must publish even when a
channel is misconfigured.

### The X traps, both of which cost time

- **Premium is not API access.** It is the consumer product.
- **Changing an app's permission does not upgrade a token that already
  exists.** Set Read and Write, save, *then* regenerate the token. A
  read-only token passes `verify_credentials` and fails at post time with a
  403 that reads like a code fault. `scripts/x-setup.ts` now reports
  `x-access-level` at mint time so this is knowable immediately.

### LinkedIn is blocked, and not on anything we can do

Community Management API **must be the only product on an application**. On
an app that already carries Share on LinkedIn the Request access button is
permanently disabled, and the explanation appears only in a tooltip — it
reads as "pending" rather than "impossible here". Farjad created a
single-product app; the access form then needs an **active** registered
company name, and Phase 1 already recorded that `Visa Roads Inc.` is closed.
That question is still open and blocks submission.

## The Persian site

`/fa` is its own site, not a translation. 21 paths, Persian keyword-first
copy, positioned as **mentorship for startup teams** through Denmark, the
Netherlands, Finland and Canada.

`content/fa/topics.ts` holds 14 human-picked article topics, one per priority
keyword Farjad named. The planner draws from it for `fa` and falls back to
the model when it runs dry, so the lane never stops for want of a topic. A
test locks the keyword coverage — it caught two real gaps the moment it was
written.

## Things that will bite you

- **Two Prisma schemas.** SQLite for dev, Postgres for production, and
  `migrate deploy` runs the production one on container start. A model added
  to one file only breaks the other environment silently.
- **The dev database is `prisma/dev.db`**, not `./dev.db`. The root one is a
  stale empty schema.
- **Tailwind scans `app`, `components`, `pages` and `lib`.** A class that
  appears only in an unscanned file emits no CSS and the element silently
  renders with whatever it inherited.
- **`@tailwindcss/typography` is not installed.** The `.prose` rules are
  hand-written in `globals.css`, so any `prose-*:` variant generates nothing
  at all — the one that was already in the code had never worked.
- **The preview browser in this environment keeps pages `hidden`**, which
  pauses `requestAnimationFrame`. Every screenshot is a frozen mid-animation
  frame. Check geometry and computed styles in the DOM instead.

## Owed, in rough priority

1. **Revoke the credentials that came through chat**: two LinkedIn client
   secrets, one LinkedIn access token, the X consumer keys and the AshaVid
   token set.
2. **Which active legal entity owns the VisaRoads page** — blocks the
   LinkedIn form and also settles what the site footer's disclaimer should
   say, which has been open since Phase 1.
3. Copy review of the programme figures, above all the **US entry-restriction
   paragraph** on `/fa/usa-eb2-niw`.
4. `WEBINAR_DATE` is null; the English countdown is hardcoded to 1 Jul 2026.
5. `/fa/privacy` and `/fa/terms` still 301 to English from the Persian footer.
6. The legacy G-P articles on `/en/blog` are another company's marketing under
   this byline. Excluded from tweet selection, still published.
7. On production: `npx tsx scripts/fix-fa-article-links.ts --write`, then
   resubmit the sitemap.
