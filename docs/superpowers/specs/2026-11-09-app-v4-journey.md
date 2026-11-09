# VisaRoads app v4: journey, Home, Me, News, Express Entry

Date: 9 Nov 2026. Decided by Farjad from rendered options (artifact "VisaRoads App v4 Options"):
Home **A** (next step), journey **A+B** (segmented tabs on route pages, picker sheets for the
assessment and tools), Express Entry **B** (one screen, live score), Me **A** (case door on top),
News **A** (in-app reader, synced).

Farjad's brief (9 Nov): "Fix the design and the customer journey. Don't make people scroll where
they don't need to; use alternatives like combo boxes. Home does nothing. Me will soon give access
to their case file. News must open inside the app, no website needed, but stay up to date and
synced. Tools: open Express Entry inside the app, on the new IRCC update."

## Constraints (every stage)

- **OTA only.** No new native dependency, no `app.json` / `eas.json` change, no new permission.
  Runtime fingerprint must stay `99a8c4c3…` (iOS build 7) / `38452566…` (Android versionCode 4).
  Push notifications, sign-in and the case file itself are a later store build (stage 6, not here).
- **Trust rules** (Brand Book, spec 2026-10-15): "% match with the published criteria", never a
  chance of approval; every figure carries a source and a checked date; unscored conditions are
  always listed; routes the user cannot run get no %, rank or offer; no VisaRoads prices anywhere.
- **Figures live in `lib/`**, read by the app through `@shared/*`. Never copy a figure into
  `mobile/`. The CRS engine is `lib/express-entry` with `config/*.json`; Metro must watch `config/`.
- **Five languages.** Every new string goes into `mobile/src/i18n/messages/{en,fa,fr,zh,ar}.ts`
  (the `Messages` type enforces the key set). Persian is written with the `persian-writing` skill
  (ZWNJ, Persian digits, «», Latin acronyms). Never "guarantee", "chance", "approval", "failed",
  "rejected". The Skip option is "Prefer not to say" / «فعلاً نه», never «رد شدن».
- **Accessibility.** Touch targets ≥ 44 pt iOS / 48 dp Android; text contrast per `design/tokens.json`;
  every control has a role and label; `useReduceMotion` respected; works at fontScale 1.35+ (stack
  rows, one column) and in RTL (fa, ar). Progress bars are decorative and the value is also text.
- **UX gate.** The `ux-auditor` agent reviews before and after each stage; its P0/P1 findings are
  fixed before the stage's PR is opened.
- **Tests.** `cd mobile && npx tsc --noEmit && npm test` must pass. Pure logic (sheet state,
  CRS adapter, news cache, home "next step" selection) gets `node --test` tests beside the module.

## 1. Shared UI: `Sheet`, `Picker`, `Segments`

New in `mobile/src/ui/kit.tsx` (or sibling files under `mobile/src/ui/`):

- **`Sheet`**: a bottom sheet built on React Native `Modal` (`transparent`, `animationType="slide"`,
  `statusBarTranslucent`), dim backdrop (`rgba(0,0,0,.45)`), a card in `c.bg` with a 1.5 pt `c.fg`
  top rule, 20 pt top radius, drag handle, title (`Label`), optional sub, body, bottom safe-area
  padding. Closes on backdrop press, Android back, and swipe down (PanResponder, ≥ 60 pt).
  `accessibilityViewIsModal`, focus moves to the title on open (`AccessibilityInfo.setAccessibilityFocus`).
  Reduce Motion → `animationType="fade"`. Max height 85 % of the window; body scrolls inside.
- **`PickerRow`**: a ruled row "label … value ›" (`minHeight` = touch min) that opens a `Sheet`
  listing options as `RadioRow`s; choosing closes the sheet and calls `onChange`. Accepts a muted
  trailing option (Prefer not to say). Value text uses `lang` for script-correct fonts. Empty
  value shows the placeholder "Choose" in `fgMuted`.
- **`Segments`**: a horizontal segmented control (2–4 items), `accessibilityRole="tablist"` /
  `"tab"` with `selected` state, the selected item filled `c.indicator` with `c.bg` text (acid is
  never the only mark on paper), 1.5 pt border, equal widths, labels shrink then wrap at large
  text, mirrored order in RTL by the layout direction itself.

## 2. Assessment (stage 1)

`mobile/src/app/assessment.tsx` keeps its ten questions, order and `AssessAnswers` fields, and
becomes **two screens of `PickerRow`s** instead of ten screens of `RadioRow`s:

1. "You": age, residence, citizenship, degree, English, French, work years, managerial.
2. "Money and plan": liquid, net worth, investment, income, business stage, revenue, talent signals,
   admission, job offer, endorsement, goal (the exact field list and grouping follow
   `ASSESS_ORDER` in `content/assessment.ts`; only the presentation changes).

Each row opens its options in a `Sheet`; the current value shows in the row. Choosing a value
closes the sheet and, when the next row is still empty, opens it after 250 ms (auto-advance;
off when Reduce Motion is on, and never past the last row). A "Prefer not to say" option stays on
every sheet. Progress "7 of 10 answered" is text under the title. "See results" is enabled when
every field has a value (an answer or skip); when disabled its helper text says what is missing
("3 questions left"). Resume works as before (`assessStep` now = 0 or 1).

Quick fixes in the same stage: the Next/See results button explains why it is disabled; the
Skip label is "Prefer not to say" in every language; the results screen's "based on 2 of 4
conditions" line is the same size as the percentage and the unscored conditions are named
under it (auditor P1 #5, 27 Oct).

## 3. Route page (stage 2)

`mobile/src/app/(tabs)/countries/route/[key].tsx`: replace the three folding `Chapter`s with a
`Segments` control under the fact: **Do · Rules · Money · After** (Money is split out of Rules
because the money block is the longest). Each segment renders one chapter's existing components
(`YourRoad`, `CheckWhatYouKnow`, `Documents` → Do; criteria + status tally → Rules; `TeamMoney`,
money lines, fees, FX line → Money; `ToCitizenship`, realities, country profile → After). Sources
with dates and the disclaimer stay under every segment. The selected segment is remembered per
route for the session. Deep links `?tab=rules` select a segment (used by Home "see what to close
first" → Rules).

About and Mentor open as `Sheet`s from wherever they are linked (Disclaimer's "About us",
results and route pages' mentor link), so the tab never jumps (auditor P1 #3). The existing
`/me/about` and `/me/mentor` screens stay for Settings.

## 4. Express Entry in the app (stage 3)

New screen `mobile/src/app/(tabs)/assess/express-entry.tsx`, linked from Assess › Tools (replacing
the browser link) and from Home.

- **One screen, live score.** A score block on top: the total in `figure` type, "of 1,270", the
  line "IRCC grid of 3 Nov 2026 · checked {lastVerified}" read from `config/crs-points.json`
  (`rulesVersion`, `lastVerified`, `source`). Under it, `PickerRow`s in four `Label`led groups:
  **You** (age, marital status, spouse coming), **Language** (first test + four CLB bands; second
  language optional; test type is display only), **Education and work** (education, foreign work,
  Canadian work, high-wage Canadian experience, certificate of qualification, Canadian education),
  **Offers and ties** (job offer wage band, provincial nomination, sibling in Canada), and a
  **Spouse** group that appears only when a spouse is coming (education, language, Canadian work).
  Every change recalculates with `calculateCrs` from `@shared/express-entry/crs-engine` and
  animates the total (no animation under Reduce Motion).
- **Breakdown** under the rows: core human capital, labour market integration (with the note
  "experience path or job-offer path, whichever is higher, since 3 Nov 2026"), skill
  transferability, additional. Then **"Closest gain"**: the single input change that adds the most
  points (computed by trying each picker's next option), stated as "CLB 9 in all four abilities:
  +38". Then **"Categories you may fit"** from `category-matcher` when an NOC is chosen (NOC picker
  searches `config/noc-codes.json` by code or title; optional).
- Language input is in **CLB bands** (CLB 4–10+), not raw test scores, with a one-line helper
  "Convert your IELTS/CELPIP/TEF score on visaroads.com" linking the site's converter; the app
  does not duplicate `language-conversion.json` logic in v4.
- **Last draws** block at the bottom: from `GET /api/app/draws` (site, below), the last three
  rounds (date, type, CRS cut-off, ITAs) with the user's score compared ("your 412 is 77 below").
  Cached in AsyncStorage; offline shows the saved date. Source line: IRCC rounds page, fetched date.
- Answers persist in the store (`crs: Partial<CrsInputs>`, `crsAt`), phone-only. Home reads the
  total.
- Metro: add `path.join(repoRoot, 'config')` to `watchFolders`; `@shared/express-entry/*` resolves
  through the existing alias; JSON imports work in Metro.

**Site endpoint `GET /api/app/draws`** (`app/api/app/draws/route.ts`): fetches
`https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json` server-side,
caches 6 h (`revalidate = 21600`), returns the newest 10 rounds as
`{ source, fetchedAt, rounds: [{ date, roundType, program, crsCutoff, invitations, drawNumber }] }`.
Public, CORS `*`, `Cache-Control: public, max-age=3600`. Never cached in the app for longer than 7
days without a "saved on" line.

## 5. News in the app (stage 4)

**Site endpoint `GET /api/app/news?locale=en|fa&since=<ISO>`** (`app/api/app/news/route.ts`):
published, not-withdrawn articles of that locale, newest first, up to 50 (or those updated since
`since`), as `{ generatedAt, items: [{ id, slug, title, excerpt, html, coverImage, category,
countries, publishedAt, updatedAt, url }] }`. `html` is the article body sanitised to the tag set
the app renders (p, h2, h3, ul, ol, li, strong, em, a, blockquote, img, table/tr/td/th, br);
`countries` are matched by the same keyword table the app uses today (moved to `lib/news-countries.ts`
so the site and the app share one table; the app's `KEYWORDS` is deleted). ETag on `generatedAt`;
`Cache-Control: public, max-age=600`.

**App** (`mobile/src/content/news.ts`, `(tabs)/news/index.tsx`, new `(tabs)/news/[slug].tsx`):

- Sync: on tab focus and pull-to-refresh, `GET …?since=<last generatedAt>`; merge by `id`
  (`updatedAt` wins), keep the newest 50 per locale in AsyncStorage, drop the rest. Offline banner
  with the saved date as today. The RSS path is removed once the endpoint is live.
- List: chips built from `COUNTRY_ORDER` (17) plus My roads / All; a chip is shown only when it
  has items. Row: country label, title, date, cover thumbnail.
- Reader: title, country · date, cover, the body rendered natively by a small renderer
  (`mobile/src/ui/Html.tsx`: the tag set above → `T` variants, lists with bullets/numbers, links
  open in the browser, images via `expo-image` with width-fitted height, tables as stacked rows at
  phone width). No WebView. Footer: "Read on visaroads.com" (`url`) and Share (`Share.share`).
  Reading marks `newsRead`.
- fr/zh/ar read the English feed, with the existing "in English" caption.

## 6. Home (stage 5)

`mobile/src/app/(tabs)/home/index.tsx` becomes **"Today"** in three blocks, nothing else:

1. **Next step** (acid-filled card): for the first followed route that is runnable and not
   finished, the first unticked step from `extrasOf(key).steps` ("Step 3 of 7: get the ENISA
   report", "usually 10 working days" when `takes` exists). Tap → route page, Do segment. If no
   route is followed but an assessment exists → the best match with "See what to close first" →
   Rules. If nothing yet → the two doors (unchanged).
2. **Express Entry** card: the saved total and the latest draw's cut-off with the gap; if no CRS
   yet, "Work out your score" → the calculator. Hidden when the user follows no Canadian route
   *and* has no CRS answers.
3. **New on your countries**: two newest items from the news cache for the followed countries
   (or the top-3 match countries), opening the in-app reader.

Selection logic (`mobile/src/engine/next-step.ts`, tested): runnable = status open/limited and
not blocked for the user's passport; finished = all steps ticked; order = `following` order.
`RoadStack` and `ResultStrip` are removed from Home (RoadStack stays in Me via FollowedRoads).

## 7. Me (stage 5)

`mobile/src/app/(tabs)/me/index.tsx`:

1. **Your case** card on top (border 1.5 pt): "Your case file", "Documents, appointments and
   messages from your mentor will appear here. Coming in December 2026." Button "Tell me when it's
   ready" → `Sheet` with a Telegram button (`https://t.me/ashavidsupport`) and "Open the website"
   (`/{locale}/contact`). Stores `caseInterest: true` (phone only) so the button becomes "You'll be
   told". No account, no network call.
2. **Progress**: `FollowedRoads progress` as compact rows (name, "3 / 7", chevron).
3. **Learning points** as one row ("Learning points · 85" → the existing list in a `Sheet`).
4. Rows: Settings, About, Mentor (the badges block is removed; earned badges show as a caption on
   the route rows: "Assessed · Funds").

## Out of scope (stage 6, needs a store build)

Push notifications for draws, sign-in, the case file backend, video.

## Build order

| PR | Stage | Files (app) | Files (site) |
|---|---|---|---|
| 1 | Sheet, Picker, Segments; assessment on sheets; quick fixes | `ui/kit.tsx`, `ui/Sheet.tsx`, `ui/PickerRow.tsx`, `ui/Segments.tsx`, `app/assessment.tsx`, `assess/results.tsx`, messages | — |
| 2 | Route page segments; About/Mentor sheets | `countries/route/[key].tsx`, `ui/kit.tsx` (Disclaimer), `ui/MatchCard.tsx` | — |
| 3 | Express Entry | `assess/express-entry.tsx`, `assess/index.tsx`, `engine/crs.ts`, `state/store.tsx`, `metro.config.js`, messages | `app/api/app/draws/route.ts` |
| 4 | News | `content/news.ts`, `news/index.tsx`, `news/[slug].tsx`, `ui/Html.tsx`, messages | `app/api/app/news/route.ts`, `lib/news-countries.ts` |
| 5 | Home, Me | `home/index.tsx`, `me/index.tsx`, `engine/next-step.ts`, `state/store.tsx`, messages | — |

Site endpoints ship first (they are harmless without the app) so each app PR can be tested
against production.

## Amendments from the UX pre-build review (9 Nov 2026, PASS WITH CHANGES)

These override the sections above where they differ.

1. **Sheet.** Square top corners (`radius.none`), 1.5 pt `c.fg` top rule, a visible Done/Close
   button in the header; swipe-down is a shortcut, never the only way to close; `onRequestClose`
   handles Android Back; `onAccessibilityEscape` closes on iOS; the drag handle is hidden from
   screen readers; focus moves to the title in `onShow`, and returns to the opening row on close;
   options are a `radiogroup` with `selected` state. A sheet with a text input (NOC search) is
   measured above the keyboard.
2. **Auto-advance.** Never on a timer. After a choice the sheet closes and the next empty row
   scrolls into view and takes focus; it opens only when tapped. Exception, assessment only: with
   no screen reader on and Reduce Motion off, the next sheet opens after the previous one has
   fully dismissed (`onDismiss`). No auto-advance in Express Entry.
3. **Segments.** Labels never below `caption` size; at fontScale > 1.3 or when any label wraps,
   the control renders as a `PickerRow` ("Section: Rules ›"); each tab's label includes its
   position ("Rules, 2 of 4"); after a switch the scroll puts the control at the top. The chosen
   segment persists per route across sessions.
4. **Express Entry.** The animated total is hidden from screen readers; a separate accessible text
   "412 of 1,270, up 38" is announced once after the sheet closes (`announceForAccessibility` on
   iOS, `accessibilityLiveRegion="polite"` on Android). A compact total pins to the top once the
   score block scrolls away. "Closest gain" is titled **"What adds the most points on this grid"**
   with the line "Arithmetic on IRCC's grid, not advice."; only language, education and work are
   tried (never age, marital status, spouse, sibling). Categories block is titled **"Category
   draws that list your NOC"** with "other conditions apply". Draws: compare like with like only:
   "Last general draw, {date}: {cutoff}. Your score: {n}. Cut-offs change every round and do not
   predict the next." The grid date comes from `rulesVersion` / `lastVerified`, never a literal.
5. **News reader.** h2/h3 have `role=header`; links are nested Text with `role=link` and the
   article ends with a "Links in this article" list; only https opens via `Linking.openURL`;
   visaroads.com article links open in the reader when cached. `alt` is the image label, empty alt
   = decorative; the API drops images without alt and sends width/height. Table rows read as
   "Header: value". Text direction follows the article's locale, not the UI locale.
6. **Home.** No % anywhere on Home. Best-match card: route name and "{n} conditions close"; never a
   blocked route; if every followed route is blocked, say so and make no offer. Express Entry
   card: "Your score {n} · last general draw {cutoff} ({date}) · not a prediction." A "usually 10
   working days" line carries its source and checked date or links to them on the route page. The
   step text is a header.
7. **Me case card.** No "You'll be told" state (nothing can tell them). Copy: "Your case file:
   coming later." Button "How you'll hear about it" → Sheet: "We announce it on our Telegram
   channel." → `https://t.me/visaroads`. Any date comes from config and the card hides once it has
   passed. Mentor wording stays neutral. Drop `caseInterest`.
8. **AX and RTL.** Above fontScale 1.3 `PickerRow` stacks label over value; signed and ratio
   figures are bidi-isolated (U+2066–2069); in fa, CRS totals, cut-offs and draw dates use Persian
   digits and Jalali dates while programme codes and NOC stay Latin; `figure` keeps its `maxScale`
   cap; draw rows stack.
