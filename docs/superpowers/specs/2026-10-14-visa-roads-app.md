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
the sketch's direction is approved. Later the same day: **v1 ships natively
to the iOS App Store and Google Play** from one Expo / React Native codebase.

Decisions still open: the four from the sketch review (one road vs top three
on the result screen; level names; the fourth tab; default mode), the French
and Chinese audiences, and whether news needs push in v1. Proposed defaults
for each are in "Open decisions" below.

UX audit (14 Oct 2026, design review, no build): the requirements it added
are in "Native UX requirements" near the end. They are binding for the
build; the sketch is a visual sketch and does not override them.

## Screen inventory

Six moments were sketched. The full v1 inventory is 17 screens, in five
groups. "Data" names what the screen reads; the API section defines it.

### 0 · Shell

| # | Screen | Purpose | Data |
|---|---|---|---|
| 0.1 | Welcome | First launch only. Pick a language (pre-selected from the device locale), start the pathfinder or browse. Must work offline | bundled copy of the locales list (the endpoint is for updates, never a first-launch dependency) |
| 0.2 | Tab bar | Roads · Tools · News · Me | — |
| 0.3 | Settings | Pushed from Me. Language, mode (system / paper / night; default system), "delete my data" (and "delete my account" when signed in), about and disclaimer, privacy policy, photo credits. Notification topics only if push ships | local |

### 1 · Roads (discover)

| # | Screen | Purpose | Data |
|---|---|---|---|
| 1.1 | Pathfinder question ×7 | One question per screen, progress rail, "rather not say" always offered | `GET /app/v1/pathfinder` (question set, per locale) |
| 1.2 | Result | The closest road, readiness score with the readiness sentence under it, what moved it, what was not scored, the disclaimer line, the source and checked date; then (proposed default) "Other roads that fit": up to three rows, each with its gap as conditions ("2 not yet · 1 close"), no score race, no offer or CTA on a road the user cannot run | `POST /app/v1/pathfinder/score` |
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
| 4.1 | Progress | Level ladder, score with the readiness sentence and the unscored conditions under it, earned and unearned badges, next moves with points, disclaimer link. Empty state before the pathfinder: one line and "Start the pathfinder" | local + `POST /app/v1/progress` when signed in |
| 4.2 | Talk to a mentor | The one lead form: name, contact, chosen route, score snapshot. Consent line and privacy-policy link above the submit button; what is sent is shown before sending | `POST /app/v1/leads` |
| 4.3 | Sign in (optional) | Email magic link; only to sync progress across devices. Opens via universal link (iOS) / verified app link (Android). Signed-in users can delete the account in the app (App Store 5.1.1(v)); Google Play also needs a public deletion URL | `POST /app/v1/auth/magic-link` |

## Gamification rules

These are product rules, not polish. They exist because the brand forbids
anything that reads as odds of approval.

1. **Readiness is preparation, not chance.** The sentence appears under the
   score **wherever a score is shown** (Result, Progress, route guide, the
   lead form's score snapshot), and is part of the score's spoken label.
   The score never changes because a draw happened or a quota moved.
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
   daily. It never affects the score. A missed week is never announced,
   counted down or framed as a loss; the streak simply restarts.
6. **Unscored conditions are always listed** under the score, on every
   screen that shows a score. No screen shows a route as "met" in full.
   Copy never refers to a status by colour ("green rows"): statuses are
   words, and the palette has no green.
7. **Vocabulary:** "met", "close", "not yet", "not started". Never
   "failed", "rejected", "ineligible". In Persian: «دارید», «نزدیک»,
   «هنوز نه», «شروع نشده».
8. **The CTA appears at Planner.** Below 25 the "Talk to a mentor" button
   is a text link; from Planner it is the primary button. Selling to an
   Explorer is selling to someone who does not yet know what they need.
   The level shown, the points to the next level and the CTA weight all
   come from the one score through the bands in rule 3, never set by hand
   (the sketch shows 42 as "Explorer", "18 points to the next level" and a
   primary mentor button: under rule 3, 42 is Planner and 8 points from
   Ready; see Open decisions).
9. **The disclaimer is reachable from every screen that shows a score or a
   verdict** (Result, Progress, route eligibility, CRS, cost estimate,
   settlement funds): the line under the score or the source line, with a
   link to the full text in Settings › About.

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
  Serif SC 900, not an italic second line (`display-han-l`, `body-han`,
  `label-han` in tokens, proposed).
- Where route content is not yet written in the UI language (proposed: fr
  and zh; ar is in the same position until its content exists), the English
  block is labelled "This guide is in English" in the UI language, carries
  `accessibilityLanguage="en"` so screen readers switch voice, and in ar is
  laid out LTR inside the RTL screen (`writingDirection: 'ltr'`, start
  aligned to the left edge of the block) rather than right-aligned English.
- Digits: the sketch sets currency in Persian digits («۶۰۰٬۰۰۰ CAD») while
  the rule above says Latin digits for currency. One rule must win before
  the catalogues are written (see Open decisions).
- Comparison symbols (≥, ≤) are mirrored by the bidi algorithm in RTL and
  read badly by screen readers in fa/ar: every threshold row gets a spoken
  label in words («دست‌کم ۶۰۰ هزار دلار کانادا»), the symbol is visual only.
- Switching between an LTR and an RTL language needs `I18nManager.forceRTL`
  and an app reload; the Welcome screen does it before anything else
  renders, Settings says "the app will restart" before doing it.
- Uppercase labels are a style; catalogues hold sentence case. French
  strings run ~20 % longer: no fixed widths on chips, buttons or tab labels.

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

Decided 14 Oct 2026: **Expo (React Native), native store release on iOS and
Android**, one codebase. GOPLAZA already went through both stores from Expo;
the engine is TypeScript either way. A web/PWA build at `app.visaroads.com`
stays possible from the same codebase but is not a v1 target; the CORS note
above applies only if it ships.

Mainland China cannot be served through Google Play, and an App Store listing
there needs an ICP filing. The earlier plan ("zh ships on web and the global
App Store only") assumed a web build; with store-first v1 the zh UI ships in
both global store builds and the mainland storefront is excluded, unless
Farjad decides otherwise (Open decisions 5).

## Open decisions (Farjad)

Proposed defaults are in italics; the audit's view follows each.

1. Result screen: one road, or top three with the gap between them.
   *One closest road plus up to three "other roads that fit" with the gap as
   conditions.* Audit: supports it (one primary decision, low cognitive
   load). The gap is counted in conditions, never as a score difference
   or a ranking that reads as odds.
2. Level names in five languages. Also: the sketch's level label, points to
   next level and mentor-CTA weight contradict the bands in rule 3 (42 shown
   as Explorer). Either the bands or the sketch is wrong.
3. Fourth tab: Me, or Mentor. *Me.* Audit: supports it; a Mentor tab would
   put an offer one tap away for every Explorer, against rule 8, and a tab
   must be a place, not an action (HIG, Material).
4. Default mode on first open: paper, night, or follow the system.
   *Follow the system*, with a manual override in Settings. Audit: supports
   it (HIG and Material both expect it).
5. French audience (Francophone Africa → Canada implies Quebec routes, absent
   today) and Chinese audience (diaspora vs mainland). *fr and zh: UI
   translated, route content English until written by hand.* Audit:
   acceptable with the labelling rules in Localisation; ar is in the same
   position and needs the same rule stated.
6. Push notifications in v1, and for what: draws and rule changes on
   followed routes only, or all news. *None in v1.* Audit: supports it; it
   also removes the notification-permission prompt and the
   notification-topics setting from v1.
7. Store release vs PWA-first. **Decided: store release (14 Oct 2026).**
8. Error colour (`theme.*.error` in tokens, proposed): the Brand Book has
   none; forms need one.
9. Digits for currency in fa: Latin (spec rule) or Persian (sketch).

## Native UX requirements (UX audit, 14 Oct 2026)

The sketch is 390×844 web artboards with fixed px type, text arrows and a
hand-drawn tab bar. The platform governs structure, navigation, gestures,
insets, accessibility and system controls; the brand governs colour, type,
imagery, copy and motion. Colours and type come from `design/tokens.json`
1.1.0 roles, never raw hex.

### Navigation

1. Root: Welcome (first launch only, no tab bar) → four tabs, Roads · Tools
   · News · Me. Each tab owns a native stack (`react-native-screens`), so
   iOS edge-swipe back and Android system / predictive Back work on every
   pushed screen. Enable predictive back in the Android app config; intercept
   Back only on the lead form with unsaved input (dialog: Discard / Keep
   editing).
2. Pathfinder is a full-screen modal over the tabs with a Close button in
   the header and a per-question back; Back on Android steps to the previous
   question, then closes. Answers persist locally; closing never asks "are
   you sure". Re-opening offers to resume.
3. Roads root is Result when a result exists, otherwise the routes list with
   the pathfinder entry. Route guide, comparison and checklist push on the
   Roads stack.
4. Tab bar: labels always visible, `tab-label` type, selected tab marked
   with `theme.*.indicator` (ink in paper, acid in night) plus label weight
   and `accessibilityState.selected`; re-tapping the active tab pops to root,
   then scrolls to top. Height 49 pt (iOS) / 80 dp (Android) plus the bottom
   inset. Hidden only inside the pathfinder modal. Settings is a header
   button on Me, not a tab.
5. Tab roots draw their title in content (`display-l`,
   `accessibilityRole="header"`); pushed screens use the native-stack
   header. The Result hero uses a transparent header with the back button
   on a `photo-plate` square, positioned by the header (safe-area aware),
   not absolutely at 52 px.

### Components

6. Pathfinder options: `Pressable` rows, `accessibilityRole="radio"` with
   `checked` state inside a `radiogroup`; no auto-advance; Next is disabled
   (`disabled-*` tokens, `accessibilityState.disabled`) until a choice;
   "rather not say" is a choice.
7. Checklist and next moves: whole-row `Pressable`, role `checkbox`, min
   height `size.row`, never a web checkbox.
8. Settlement-funds stepper: role `adjustable` with increment / decrement
   actions and `accessibilityValue.text` ("3 people"); the result amount
   is announced on change (`accessibilityLiveRegion="polite"` on Android,
   `announceForAccessibility` on iOS).
9. Filter and language chips: horizontal `ScrollView` per row (never
   clipped), visual 40, hit area 48 via `hitSlop`, gap 8, selected state
   exposed. Lists: `FlatList` (news) and `SectionList` (checklist) with
   `RefreshControl` on remote data.
10. Settings: language and mode as radio lists; destructive actions through
    the system alert with a destructive button; transient feedback as a
    snackbar (Android) or inline banner (iOS), never a dialog.
11. Lead form: `textContentType` / `autoComplete` for name, email, phone;
    correct keyboard types; errors under the field in `theme.*.error` with
    an icon and text, announced; the keyboard never covers the focused field
    or the submit button.
12. Sources and articles open in the in-app browser (SFSafariViewController
    / Custom Tabs), not a WebView. Images via `expo-image`, with alt text in
    the UI language; news thumbnails are decorative. Photo credits are
    reachable (caption or Settings › Photo credits).
13. Icons are SVG; text arrows ("→") become icons. Directional icons mirror
    in RTL; photos, logos, the check mark and digits do not.

### Insets, text size, layout

14. `react-native-safe-area-context` everywhere; Android edge-to-edge with
    a status-bar style per mode; no hard-coded 56/60 px top padding.
    Bottom CTAs sit at `max(inset.bottom, 16)`.
15. Every screen scrolls. The sketch's fixed frames with flex spacers are
    not layouts. A bottom CTA is sticky only while `fontScale <= 1.3`;
    above that it follows the content.
16. `allowFontScaling` always on; `maxFontSizeMultiplier` per type role
    from tokens (`$extensions.app.maxScale`). Test at iOS AX5 and Android
    200 %. Rows use `minHeight`; the score line wraps; the hero photo
    shrinks above `fontScale` 1.5. No text below 11.
17. Line-height and letter-spacing are converted for React Native as the
    tokens' type description says; display sizes use `nativeLineHeight`.
18. Phone portrait only in v1 unless decided otherwise.

### Accessibility

19. Every control: role, label in the UI language, state, and a hint where
    the result is not obvious. Section labels are headers.
20. The score block is one element: "Readiness 42 out of 100, level
    <level>. Readiness measures your preparation, not your chances." Each
    status row is one element: "<condition>: <status>". Progress bars and
    rails are hidden; their text is read.
21. Focus moves to the screen heading on navigation and to the question on
    each new pathfinder step.
22. Language chips carry their own `accessibilityLanguage`.
23. Visible focus (`theme.*.focus`) for hardware keyboard and switch
    access. Reduce Motion / Remove animations honoured (tokens, motion).

### States (every remote-data screen)

24. Loading: static placeholders, no shimmer under reduced motion. Cached
    first. Offline: cached content with a banner "Offline. Showing the
    version checked <date>". Error: plain sentence and Retry, never a blank
    screen.
25. Welcome, pathfinder, result, settlement funds, eligibility and CRS work
    with no network on first launch (bundled questions, rules, IRCC table,
    engine), each figure still showing its source and date.
26. Empty states: Roads before a result (pathfinder entry); Progress before
    a result (one line + "Start the pathfinder"); News "My roads" before a
    result (filter hidden), and with no items (say so, offer "All news").
27. Lead form: submitting (button disabled, spinner with a label), success
    (what happens next, no promises), failure (input kept, Retry), offline
    (submit disabled with the reason). Magic link: sent, expired, opened on
    another device.

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
