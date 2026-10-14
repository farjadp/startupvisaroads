# Visa Roads app — v1 design

Date: 14 Oct 2026. Status: design, nothing built.
Sketch: https://claude.ai/artifact/89ojbFHFhdyUqd12P6t59F (15 artboards: six screens in paper and night, three in Persian).
Brand: the Brand Book in Notion; tokens in `design/tokens.json`.

## What v1 is

A discovery and preparation app for founders weighing a startup-visa or
entrepreneur-immigration route. Five UI languages (en, fa, fr, zh, ar). No
account required. Gamified as **readiness**, never as odds.

v1 is explicitly **not** case tracking for paying clients. That is v2, and it
starts where v1's level ladder ends (Applicant).

Decisions already taken (Farjad, 14 Oct 2026): both paper and night modes;
the editorial paper/ink/acid brand; photographs and icons, restrained;
the sketch's direction is approved.

Decisions still open: the four from the sketch review (one road vs top three
on the result screen; level names; the fourth tab; default mode), the French
and Chinese audiences, native stores vs PWA first, and whether news needs
push in v1.

## Screen inventory

Six moments were sketched. The full v1 inventory is 17 screens, in five
groups. "Data" names what the screen reads; the API section defines it.

### 0 · Shell

| # | Screen | Purpose | Data |
|---|---|---|---|
| 0.1 | Welcome | Pick a language, start the pathfinder or browse | `GET /app/v1/locales` |
| 0.2 | Tab bar | Roads · Tools · News · Me | — |
| 0.3 | Settings | Language, mode (paper / night / system), notification topics, "delete my data" | local |

### 1 · Roads (discover)

| # | Screen | Purpose | Data |
|---|---|---|---|
| 1.1 | Pathfinder question ×7 | One question per screen, progress rail, "rather not say" always offered | `GET /app/v1/pathfinder` (question set, per locale) |
| 1.2 | Result | The closest road, readiness score, what moved it, what was not scored | `POST /app/v1/pathfinder/score` |
| 1.3 | Route guide | One route: the fact that changes the decision first, thresholds, timeline, costs, sources, "what we do" | `GET /app/v1/routes/{key}` |
| 1.4 | Route comparison | Sortable table; absent requirement sorts lowest, as on the site | `GET /app/v1/routes` |
| 1.5 | Requirements checklist | Per route: documents and conditions, each markable done, with the date it was checked | `GET /app/v1/routes/{key}/requirements` |

### 2 · Tools

| # | Screen | Purpose | Data |
|---|---|---|---|
| 2.1 | Tools index | Calculators by country | static |
| 2.2 | Settlement funds | Family size → CAD figure, IRCC table with its date | `GET /app/v1/figures/settlement-funds` |
| 2.3 | Route eligibility | Six inputs against a route's thresholds; verdict clears / close / not yet | `GET /app/v1/routes` + local scoring |
| 2.4 | Express Entry CRS | Port of `lib/express-entry/crs-engine.ts` | engine ships in the app |
| 2.5 | Cost estimate | Government fees + biometrics + proof-of-funds floor per route, each line cited | `GET /app/v1/routes/{key}` (fees block) |

### 3 · News

| # | Screen | Purpose | Data |
|---|---|---|---|
| 3.1 | Feed | Filter by country and category; "my roads" default once a result exists | `GET /app/v1/news?country=&program=&locale=` |
| 3.2 | Item | Key takeaway first, then body; source badge (official / our analysis); original-language notice when machine-translated | `GET /app/v1/news/{slug}` |

### 4 · Me (progress)

| # | Screen | Purpose | Data |
|---|---|---|---|
| 4.1 | Progress | Level ladder, score, earned and unearned badges, next moves with points | local + `POST /app/v1/progress` when signed in |
| 4.2 | Talk to a mentor | The one lead form: name, contact, chosen route, score snapshot | `POST /app/v1/leads` |
| 4.3 | Sign in (optional) | Email magic link; only to sync progress across devices | `POST /app/v1/auth/magic-link` |

## Gamification rules

These are product rules, not polish. They exist because the brand forbids
anything that reads as odds of approval.

1. **Readiness is preparation, not chance.** The sentence appears under the
   score on every result screen. The score never changes because a draw
   happened or a quota moved.
2. **Score composition (0–100), per route:**
   - up to 50 from threshold checks the route defines (`Rule` in
     `lib/fa/programmes.ts`): pass 100 %, within 20 % of the bar 50 %, else 0;
   - up to 40 from checklist items marked done, weighted by the route;
   - up to 10 from engagement (read this route's news, opened its sources).
   Engagement is capped at 10 so reading cannot outweigh doing.
3. **Levels:** Explorer 0–24 · Planner 25–49 · Ready 50–79 · Applicant 80–100.
   Names are placeholders; see open decisions.
4. **Badges** are earned for real milestones only (seven answers, funds
   counted, language test booked, business brief written, sources read on
   three routes). None for opening the app or for streaks of opening it.
5. **Streak** exists for one thing: following your route's news, weekly not
   daily. It never affects the score.
6. **Unscored conditions are always listed** under the score. The result
   screen never shows a route as "met" in full.
7. **Vocabulary:** "met", "close", "not yet", "not started". Never
   "failed", "rejected", "ineligible". In Persian: «دارید», «نزدیک»,
   «هنوز نه», «شروع نشده».
8. **The CTA appears at Planner.** Below 25 the "Talk to a mentor" button
   is a text link; from Planner it is the primary button. Selling to an
   Explorer is selling to someone who does not yet know what they need.

## Localisation

- UI in five languages, from one message catalogue per locale. Numbers,
  currency and dates come from `Intl` with the locale; Persian digits and
  Jalali dates in fa prose, Latin digits for programme codes and currency.
- **Content is not translated by machine for publication.** Route guides and
  figures are code-driven and localised by hand (en and fa exist; fr, zh, ar
  are new work and go route by route). News items ship in their original
  language with an on-device translation the reader opts into, labelled
  machine-translated, never cached as content.
- Font stack by script, not locale (`font.latin / arabic / han` in tokens).
  Arabic script: no letter-spacing, no uppercase, line-height 1.8 body.
- RTL for fa and ar: mirrored layout, mirrored arrows, start/end logical
  properties everywhere. Photographs are not mirrored.
- Chinese needs its own line-height and no italic; `display-l` in zh is Noto
  Serif SC 900, not an italic second line.

## API needs

The site has no public API today; every app endpoint is new. They live in
the same Next.js project under `app/api/app/v1/`, read-only except leads and
progress, cached at the edge, versioned in the path. Figures carry their
source and date in the payload, never only in copy.

### Read endpoints

| Endpoint | Returns | Backed by today |
|---|---|---|
| `GET /app/v1/locales` | the five locales, their script, direction, display name | new constant |
| `GET /app/v1/routes` | every route's `Rule` (thresholds, currency, `unscored`, `updated`, `source`) plus name per locale | `lib/fa/programmes.ts` `RULES` — **needs en/fr/zh/ar names**, today Persian only |
| `GET /app/v1/routes/{key}` | the guide: lead fact, sections, timeline, fees, FAQ, sources, photos with credits | `content/fa/*.ts` modules — **needs a locale-neutral content contract**; today fa-only typed modules and en JSX pages |
| `GET /app/v1/routes/{key}/requirements` | checklist items with ids, weights, source, date | **new**; derive from the guides' «مدارک» sections, then maintain as data |
| `GET /app/v1/pathfinder` | question set per locale | `lib/fa/path-quiz.ts` `QuizAnswers` keys — **needs the questions as data**, today in JSX |
| `GET /app/v1/figures/settlement-funds` | IRCC table, extra-per-person, `updated` | `lib/canada-suv.ts` — note the table is dated 29 Jul 2025 and IRCC revises every July: **re-verify before launch** |
| `GET /app/v1/news` | items filtered by `country`, `program`, `locale`; `keyTakeaway`, `summaryEn`, source kind, date | `Article` — **needs two new fields**: `country` (ISO) and `program` (enum: entrepreneur, startup-visa, talent, draws) and a `sourceKind` (official / analysis). Today only `categoryId` |
| `GET /app/v1/news/{slug}` | the item | `Article` |

### Write endpoints

| Endpoint | Does | Notes |
|---|---|---|
| `POST /app/v1/pathfinder/score` | returns the recommendation and score; the app can also compute it offline with the same engine | `recommendPath` + `assess`, ported to a shared package |
| `POST /app/v1/leads` | stores the lead **in the database** (new `Lead` model) and then notifies Telegram | today leads go to Telegram only and are lost if the bot token is revoked, which has happened |
| `POST /app/v1/progress` | upserts a signed-in user's progress snapshot | new `AppUser`, `Progress` models; nothing stored for anonymous users |
| `POST /app/v1/auth/magic-link` | email sign-in | Resend is already wired |

### One engine, two consumers

`recommendPath`, `assess`, `settlementFundsFor` and the CRS engine move to
`packages/engine/` (pure TypeScript, no Prisma, no Next). The site imports it;
the app bundles it. The figures the engine needs (`RULES`, the IRCC table)
also move there, so the API and the app cannot disagree, and the four places
the PNP figures live today become one.

### Non-functional

- Every payload with a figure carries `updated` and `source`.
- Edge cache 1 h for routes and figures, 5 min for news; `ETag` on all.
- Rate limit leads and auth per IP (`lib/rateLimit.ts` exists).
- CORS limited to the app's origins; the PWA runs on `app.visaroads.com`.
- No personal data in URLs. Anonymous progress never leaves the device.

## Platform

Recommendation: **Expo (React Native) targeting iOS, Android and web**, one
codebase, the web build served as the PWA at `app.visaroads.com`. Reasons:
GOPLAZA already went through both stores from Expo; web output means the PWA
question is not a fork; the engine is TypeScript either way.

Mainland China cannot be served through Google Play, and an App Store listing
there needs an ICP filing. Until the Chinese audience is known, zh ships on
web and the global App Store only.

## Open decisions (Farjad)

1. Result screen: one road, or top three with the gap between them.
2. Level names in five languages.
3. Fourth tab: Me, or Mentor.
4. Default mode on first open: paper, night, or follow the system.
5. French audience (Francophone Africa → Canada implies Quebec routes, absent
   today) and Chinese audience (diaspora vs mainland).
6. Push notifications in v1, and for what: draws and rule changes on
   followed routes only, or all news.
7. Store release vs PWA-first.

## Build order (for the plan that follows this spec)

1. `packages/engine/` — move the four engines and the figures; tests travel.
2. `Article.country / program / sourceKind` migration + backfill script.
3. `Lead` model; the three Telegram forms write to it first, then notify.
4. `app/api/app/v1/*` read endpoints, cached.
5. Expo app skeleton: tokens, fonts by script, RTL, the tab bar, paper and night.
6. Pathfinder → Result → Progress, offline-capable.
7. Tools: settlement funds, eligibility, CRS.
8. News feed and item.
9. Lead form and magic link.
10. fr / zh / ar message catalogues and route content, route by route.
