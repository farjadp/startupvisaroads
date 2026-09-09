# Handoff — 9 Sep 2026

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

### The route guides were rebuilt on official sources (8 Sep 2026)

Four guides rewritten and one built from scratch, each verified against the
programme's own authority rather than against the Persian material in
circulation. Ten commits, `e16b027` → `241335a`, all live.

**Every guide now carries one fact that changes the reader's decision**, and
in each case the material we were handed said the opposite:

| Route | The correction |
|---|---|
| Denmark | Permanent residence is **8 years**, not the 5 everyone repeats. Four only with all four supplementary conditions. And renewal is **not** light-touch: the expert panel assesses the business again |
| Estonia | **Estonia does not permit dual citizenship.** An Iranian who cannot renounce reaches permanent residence and stops. The passport line in every Persian guide is unreachable for this audience |
| Netherlands | The startup permit **cannot be extended**. IND says so plainly. Twelve months, then a fresh self-employed application on RVO's points system — there is no second startup year |
| Türkiye | **22 foreign startups admitted** between 16 Sep 2024 and 3 Mar 2026. The route is open but narrow |
| Finland | (unchanged this session) ~92% refused by Business Finland |

**The refund undertaking now says what the contracts say.** Farjad supplied
four signed contracts. The undertaking covers exactly one failure: not
obtaining the evaluating body's approval within **12 months of the first
instalment**, then 100% back at the currency rate of the day. It does **not**
cover a residence refusal by SIRI/Migri/IND/an embassy, or a refusal traced
to the applicant's own papers. Denmark had been promising a refund "if the
file does not reach residence" — a promise covering refusals nobody here
controls. Corrected on Denmark, Finland, and the Canada cost page's
scam-signal list, which had quietly become a description of our own offer.

**No VisaRoads figure appears anywhere on the site.** Farjad's rule, 8 Sep:
instalment structure yes — contract signing / approval / permit issued —
amounts never. It surfaced because the Netherlands NotebookLM deck carries
our pricing and would otherwise have flowed onto the page. Government and
statutory numbers are the opposite: welcome, cited, with the year they apply
to.

**Türkiye is a new top-level route**, `/fa/turkey-tech-visa`, deliberately
not under `/europe` — it is the one route here that leads nowhere near an EU
passport, and the menu should not imply otherwise. It has three Istanbul
photographs, two of Farjad's videos, a flag, and a place in the quiz and the
comparison table.

**`lib/fa/programmes.ts` and the pages hold the same thresholds twice.** Its
own header warns they must move together, and this session proved the point:
four guides were rebuilt before the table caught up. If you change a figure
on a page, change it there too.

## The Israel guide (9 Sep 2026)

`344e567 → 71b211e`, three commits, both locales, live.

**`/fa/israel` is the first Persian route page that is a reference rather than
an offer, and every unusual thing about it follows from that.** Iran is a
designated enemy state under Israeli law: the Interior Minister is barred from
granting entry or stay permits to citizens of enemy states outside a small
humanitarian quota, and Iranian law and the Iranian passport separately
prohibit travel to Israel. The reader `/fa` is written for cannot use this
route.

So, deliberately, and each of these will look like an omission to someone
tidying up later:

| What | Why |
|---|---|
| The access bar is the status banner, above the fold | In Persian-language material this programme is sold as a migration pathway with that half left out. The page is what a reader puts in front of whoever sold it to them |
| **No instalment structure and no refund undertaking** — the only Persian guide without them | Publishing our commercial terms on a route we cannot run is selling something unreachable. `lib/fa/__tests__/israel.test.ts` locks this |
| **Not in `lib/fa/programmes.ts`, not a `which-path` outcome** | Both derive from `RULES`; an entry would rank Israel against routes a reader can actually take. The passport bar is not a threshold anyone clears |
| No flag | The legislated spec fixes the field and the two blue bands but not the Star of David between them, and every hexagram figure available is a reconstruction. Same rule that keeps the US flag off `/fa/usa-eb2-niw` |
| The defence-linked programmes appear in English only | INNOFENSE/DDR&D, INNOTAL, MEIMAD and the cyber tracks get one neutral out-of-scope sentence on `/en/country/israel` and nothing on the Persian page |

**Two source findings worth not re-deriving.** The procedure was *re-approved
in 2024* with PIBA, so the programme is live rather than a lapsed 2017 pilot —
but the **twelve landing pads list is still the 2017 announcement**, and
nothing newer restates it. Both pages print that list with its date. And
**Tnufa is NIS 200,000 at 80% of an approved budget capped at NIS 250,000**;
the 85%-over-two-years version in circulation is a superseded structure.

**No proof-of-funds figure appears on either page.** Israel publishes none.
The $15,000–$50,000 a year that circulates is a practitioner estimate, and
printing it would turn an estimate into a rule — the same reasoning that keeps
lira amounts off the Türkiye guide.

## The Australia guide (9 Sep 2026)

`77965a7 → 2703b39`. `/fa/australia` is new, `/country/australia` was
rewritten, and `/australia/entrepreneur-stream` is gone and 301s into it.

**The deck Farjad supplied is a sales deck, and the page is built against it
rather than from it.** Three corrections, all from the Department's own
material:

| The deck says | What is actually true |
|---|---|
| Priority hierarchy per Ministerial Direction 112 | **Direction 120 revoked 112 on 25 July 2026** — three days before the deck is dated. Five priority groups now, and it covers the whole Class BX including on-hand Global Talent and Distinguished Talent files |
| Get a state nomination; Priority 2 is the key | **Priority 2 drew fewer than 20 invitations** in Apr–Jun 2026 and 15 in Jan–Mar, against **192 and 113 for Priority 3**. The recommended lane is the narrowest one |
| A golden window of opportunity | **2,166 EOIs → 248 invitations** (Apr–Jun 2026); **1,815 → 146** (Jan–Mar). Roughly one in nine |

**And the thing the name hides: it is not a startup visa.** Subclass 858 is
the Distinguished Talent visa renamed, assessed on the individual; a team
cannot apply together; and subclass 188 closed to new applications in 2024, so
there is no startup route underneath it. A seed-stage founder does not clear
this bar, and the page says so in its first section.

**No refund undertaking — and the reason differs from Israel's.** Israel has
none because we cannot deliver the route at all. Australia has none because
there is no evaluating body to undertake against. See owed item 17.

**Two English pages had to become one.** `/country/australia` and
`/australia/entrepreneur-stream` were near-duplicates competing for the same
query, and both had gone stale. The country page survives; the other 301s via
`next.config.ts` redirects (bare and locale-prefixed) and is out of
`EN_INDEXABLE_PATHS` and the autopilot inventory. **This retired a live URL —
reversible by dropping the redirect and restoring the page from `2703b39^`.**

**Not in `lib/fa/programmes.ts`, and for a sharper reason than Israel's.** The
NIV sets no financial threshold at all, and `compare.ts` sorts an absent
threshold as the *lowest* barrier — so an entry would rank the hardest route
on the site as its most accessible one.

**The visa application charge is the one figure published with a caveat.** It
rose on 1 July 2026, secondary sources disagree (≈AUD 6,235 for the main
applicant), and Home Affairs blocks automated reads, so both pages tell the
reader to take the number from the Department before budgeting.

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
  frame. Check geometry and computed styles in the DOM instead. It also
  reports `clientWidth: 0` and `naturalWidth: 0` for lazy images at random —
  both produced false alarms this session. Before believing a measurement,
  repeat it on a page you know is fine.
- **Validate a deploy-poll sentinel before you wait on it.** Two polls this
  session watched for the wrong string: one matched text the *previous*
  commit had already put in the nav, the other watched for `unscored` copy
  that is never in the server HTML because it renders inside a client
  component. Pick a string, confirm an existing analogue of it is present,
  then poll.
- **The Persian pages throw a hydration error in dev.** Site-wide and
  pre-existing — `/fa/europe/estonia` does it too and was untouched. Not
  chased. Likely the Jalali date or the quiz-memory `localStorage` read.

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

### Opened 8 Sep 2026

8. **Two country guides are blocked on source material**: Norway and Sweden.
   (Israel and Australia were two of the original four and are now written —
   see below.) Their NotebookLM notebooks exist but have never been exported; Estonia, the Netherlands and Türkiye only got written because
   PDFs were sitting in Drive. The Claude in Chrome extension cannot reach
   `notebook.google.com` — several attempts, and after the site permission
   was changed the connected profile still had no site access at all. Export
   to Drive is the path that works.
9. **Norway and Sweden have no startup visa.** Norway is self-employment via
   UDI, Sweden via Migrationsverket. There is no evaluating body, so the
   refund undertaking cannot be written the way it is on the other four.
   Needs a decision before either page is drafted.
10. ~~**Israel**: an Iranian passport holder cannot enter.~~ **Settled 9 Sep
    2026** — Farjad asked for the page in both locales, and it was built and
    shipped. See "The Israel guide" below.
11. **The Netherlands commercial model needs a conversation.** The brief says
    «طرح و ایده و موارد بیزینس را ما انجام میدهیم» and that a team «دو خانواده
    جای خالی دارد». IND requires an active role — "more than a shareholder or
    financier" — and the facilitator may hold no majority interest. That is
    not on the page; the page says we do not sell a seat in another team's
    startup. If placement really is the intent, the failure lands on the
    client at the IND stage.
12. **The Denmark contract must cap the pitch deck at 15 pages**, not the 20
    the Finland contract uses. Over 15 is a published Start-up Denmark
    screen-out reason, so the current wording commits us to something that
    gets the file rejected.
13. **Türkiye is not in `lib/fa/programmes.ts`'s scored thresholds beyond the
    capital condition, and not in the eligibility calculator's venture
    stage.** Deliberate — the technopark committee's bar is a business-plan
    judgement and inventing an MVP requirement would be a guess.
14. **Video view counts are a floor with a 1,000 threshold**, refreshed with
    `scripts/fetch-video-views.ts`. Twelve of twenty-four videos sit below it
    and show no count. If that threshold is wrong it is one constant.
15. **No Persian guide has an English twin except Denmark, Finland, Israel
    and Australia.** Türkiye, Estonia and the Netherlands are Persian-only.

16. **`/turkey-tech-visa` is missing from `FA_SITE_PAGES`** in
    `lib/autopilot/inventory.ts`, so a Persian article the autopilot writes
    can never link to the Türkiye guide. Found 9 Sep while adding Israel to
    the same list; not fixed, because the right fix is a test asserting every
    route in `FA_PATHS` has an inventory entry, and that is its own change.

17. **The Australia contract needs its own milestone definition.** Every other
    contract ties the refund undertaking to an evaluating body's approval. The
    NIV has no such body — the gate is a government invitation at roughly one
    in nine — so `/fa/australia` carries no undertaking and no instalment
    structure, and says why. Before anything is signed for Australia, decide
    what the instalments attach to.

18. **`/fa/which-path` sends every research profile to EB-2 NIW**, with a
    caveat about US entry restrictions for Iranian nationals attached to the
    recommendation. Australia's NIV is the direct analogue, carries no such
    restriction, and grants permanent residence on day one. Whether the
    research branch should offer it — instead of, or alongside, NIW — is a
    question about advice rather than code, and is Farjad's call. Left
    unchanged deliberately.
