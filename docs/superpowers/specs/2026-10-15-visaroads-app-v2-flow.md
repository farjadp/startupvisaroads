# VisaRoads App v2: flow and information architecture

Status: draft for the UX auditor, then Farjad. Source: Farjad's brief of 15 Oct 2026
(Notion: "VisaRoads App v2 — Brief, proposals and plan", and the App v2 board).
Builds on the v1 spec (2026-10-14-visa-roads-app.md) and what shipped in #38/#39.

## Decisions already taken

- Assessment results show **"% match with the published criteria"**, never a chance of approval.
- **Countries (10):** Canada, Denmark, Finland, Italy, Netherlands, Türkiye, United States, Estonia, Israel, UAE. Israel is shown to everyone.
- **Route families (5):**
  - startup / innovation / golden
  - entrepreneur
  - study
  - US talent (NIW, EB-1, EB-2, O-1)
  - Canada Express Entry / PNP
- **Money in three amounts:** the country's currency, USD, and the home currency. FX comes from our server (Gheymat if feasible); the phone never calls a third party.
- **Imagery:** real, credited photos for places; Gemini illustrations for tools and empty states, marked as illustration.
- No account needed; everything is kept on the phone. A magic link is optional (Phase 3).

### Decided after the auditor review (Farjad, 15 Oct 2026)

- **Photos in lists:** small real-photo thumbnails are allowed in lists (the Countries grid, result cards). A page still has at most one large photo.
- **Results:** the primary button is "See what to close first", and the mentor review is the second button.
- **v1 readiness score and levels are retired.** Match % is the only number in the app. Checklist progress is shown as progress, never as a score.

## 1. Launch and first run

```
cold start
 └─ ink intro (first launch only; later: fade)          [built, #38]
     └─ language (2C, on ink, faded flags)              [built, #38]
         └─ Start: two doors
             ├─ A. Choose a road  → Countries → Country → Route
             └─ B. Get assessed   → Assessment (8–10 questions) → Results
```

**Start screen (new, replaces Welcome).**
- Two large doors on one screen, stacked vertically (never side by side, so French and large text sizes wrap instead of clipping), each with one line of copy and a verb. Imagery: one photo at most on this screen (see §6); default is the photo on "Choose a road" and a Gemini illustration on "Get assessed". Each door is one accessible button (role button, label = verb + line), at least 48×48 dp / 44×44 pt; the trailing arrow mirrors in fa/ar.
  - "Choose a road": "I know where I want to go"
  - "Get assessed": "Show me the roads that fit me"
- The disclaimer goes underneath.
- A third, quiet text link "Just look around" opens Home. This is the only way to "skip both doors"; without it the Start screen has no exit.
- Choosing any door replaces Start with the tab shell (Start is not left in the back stack). Door A opens the Countries tab at its root; door B pushes Assessment inside the Assess tab. System Back / edge-swipe from there returns to the tab root, then (Android) leaves the app, never back to Start.
- "Roads to follow" (3B) stops being an onboarding step. Following now happens from a route page (a follow toggle). This keeps onboarding to one decision.

## 2. Returning user: tabs

Five tabs (the iOS maximum):

| Tab | Purpose |
|---|---|
| **Home** (dashboard) | Last assessment result (top 3 routes with %, each with the "not a chance of approval" line, the unscored-conditions count and a link to the disclaimer), followed routes, latest news for those countries, one quiet mentor card (shown only once the user has a result or a followed route, never to a first-time Explorer) |
| **Countries** | The 10 countries → country page → route page |
| **Assess** | Run or re-run the assessment; the route tools (CRS, net worth, study costs, US talent check, startup readiness, funds) |
| **News** | As now, filtered by followed countries |
| **Me** | Profile (the answers), saved routes, checklist progress, settings, booking |

A returning user opens on **Home**. A first-time user who skips both doors also ends up on Home, with an empty state that leads to the two doors.

## 3. Countries → Country → Route

- **Countries:** a grid of cards (one column at the largest text sizes; order mirrors in fa/ar; names sorted by the active locale's collation). Each card has a real photo, the flag as a small mark (decorative), the name, and how many routes it has in our five families. There's a filter by family, e.g. "show only countries with a startup visa".
- **Country page:**
  - a hero photo with credit
  - one paragraph: what this country is like for founders and students (sourced)
  - routes grouped by family, each row showing its family icon (4A), name, and three facts: money, time, path to permanent residence. Under the facts, one source line per row ("IRCC · checked 12 Oct 2026"). Facts are text, never colour or icon alone; the row is one accessible element whose label reads name and all three facts.
  - a funds card in three currencies
- **Route page (v2):**
  - the deciding fact first
  - every condition, as met / close / not yet against the profile when an assessment exists
  - conditions that can't be scored, listed
  - money in three currencies
  - steps checklist, timeline and official fees (Phase 2)
  - sources with their dates
  - Follow toggle (native Switch, label "Follow <route>", state on/off announced)
  - CTA "Talk through this route", **only** when the user can run the route; a route closed to the user's citizenship or residence shows why in neutral words ("Not open to citizens of …, per <source>") and carries no CTA, no follow prompt and no "close the gap" offer
  - when conditions are scored against the profile: the line "Match with published criteria; not a chance of approval" and a link to the disclaimer (we prepare the case, we do not file it; we are not immigration lawyers)

## 4. Assessment v2

8–10 questions, one per screen, progress shown as text ("Question 3 of 9", the total updating when Q10 is added or removed; the bar is decorative), resumable, and every question skippable ("prefer not to say"). An intro screen says what is asked, that citizenship and assets are sensitive, that answers stay on this phone, and that they can be deleted from Me at any time. Back goes to the previous question (system Back / edge-swipe), never out of the assessment without saving.

1. **Goal:** start a company / run or buy a business / study / work as an expert (talent) / not sure.
2. **Citizenship and country of residence** (two pickers). Also sets the home currency.
3. **Age band.**
4. **Highest degree and field** (STEM / business / other).
5. **Work experience:** years, and whether managerial.
6. **Language:** English level (bands that map to CLB / IELTS), French, and others.
7. **Family:** spouse or partner; number of children.
8. **Assets:**
   - movable (cash and investments), in bands, entered in the home currency
   - immovable (property), in bands
   - Bands are defined once in USD (aligned to the route thresholds, so "close" can be computed) and shown converted to the home currency, rounded, with the rate date. If no rate exists for the home currency (e.g. the rial until Gheymat is live), the bands show in USD with a one-line note. The answer is stored as the USD band, so a later rate change never silently moves the result.
9. **Business:** none / idea / MVP / revenue / existing company (years, staff).
10. **Talent signals** (shown only when the goal is "expert" or "not sure"): publications, citations, patents, awards, press, judging.

**Engine.**
- Each route lists its criteria with weights. A criterion is *scoreable* (age, money, degree, language band) or *unscoreable* (committee approval, quota, the "national interest").
- `match % = Σ(weight × state) / Σ(weight of scoreable criteria)`, where state is met = 1, close = 0.5, not yet = 0.
- Unscoreable criteria are always listed with the result.
- A skipped question makes the criteria it feeds **unscored for this user**: they leave the denominator and are listed with the unscoreable ones ("You chose not to answer"). They are never counted as "not yet".
- Every % carries its coverage: "Based on 5 of 8 conditions; 3 are decided by the programme or not answered". If scoreable weight is under half of the route's total weight, the % is not ranked above routes with fuller coverage and the card says "Few conditions can be checked in advance".
- A route the user cannot run (citizenship, residence) is not given a %, is not ranked, and appears only under "See all" with the neutral reason. Never "ineligible", "failed" or "rejected".
- Routes are ranked by match %; ties break by the family the user picked, then by coverage.
- The same engine runs on the site (shared `packages/engine`).

**Results.**
- The top 3 routes are cards showing the %, their country photo and the two biggest gaps.
- "See all" lists the rest.
- Every card says "Match with published criteria; not a chance of approval", lists its unscored conditions (or their count, one tap to the list), and the results screen links to the disclaimer.
- The % is printed as text in the locale's digits and percent form (fa "۷۵٪", ar "٧٥٪"); any ring or bar is decorative. No colour scale (no red/green) on the %.
- Primary CTA: "See what to close first" (opens the top route at its gaps). Secondary: "Review this result with a mentor (free, 20 min)" (see §7; the mentor CTA is not pushed on a first-time Explorer).
- Booking prefill: before anything leaves the phone, a review sheet shows the exact profile summary to be sent, each field removable, citizenship and assets **unticked by default**; nothing is sent until the user taps Send. Cancel/Done per HIG sheets.

## 5. Money in three amounts

Wherever a figure appears (funds, net worth, investment, fees, tuition), it is shown in three forms:
- the official amount in its currency, primary and unchanged
- "about USD …", with the rate date and source (omitted when the official amount is already USD)
- "about <home currency> …", with the rate date and source (omitted when it equals either line above)
- The three are stacked lines, never side by side, and read by a screen reader as one sentence ("50,000 Canadian dollars, about 36,000 US dollars, about …, ECB rate of 14 Oct 2026"). Currency amounts use Latin digits in every locale; the rate date in fa prose is Jalali with Persian digits. Rial amounts say "toman" or "rial" explicitly, never both, never unlabelled.

The home currency comes from assessment question 2, and can be changed in Me. FX is fetched by the app from `visaroads.com/api/app/v1/fx` (cached daily), which proxies Gheymat or an FX provider. If a rate is more than 30 days old, a warning shows (text plus icon, not colour alone); at more than 90 days, or when no rate exists, the line is replaced by "Rate not available" rather than vanishing. For the rial, the source and whether it's the market rate are labelled.

## 6. Motion and imagery

- **Motion:**
  - one curve (tokens `motion.ease`) everywhere
  - shared-element transitions: a country card photo grows into the country hero, and a route row into the route header, only if they run on the native stack and leave the iOS edge-swipe back and Android predictive Back intact; otherwise drop them for the standard push
  - the assessment's progress bar fills
  - results cards rise in a stagger (whole sequence under 400 ms; cards are tappable and announced from the first frame)
  - Reduce Motion (iOS) and Remove animations (Android) get a cross-fade or no animation instead
- **Photos:** real and credited, one per screen at most (v1 rule), one per country and one per route family. Credits live in Me › Credits. Note: the Countries grid and the results cards as drafted put several photos on one screen; see Auditor notes for the decision owed.
- **Illustrations (Gemini):** monochrome ink plus acid line art in one style, for the tools, empty states and the assessment intro. Two variants: ink lines on paper (acid only as a fill behind ink, never as a line on paper, 1.03:1) and paper lines on night. Decorative ones are hidden from screen readers; one that carries meaning gets a label starting "Illustration:". Never people's faces presented as real.

## 7. CTAs (where people book a session)

One primary CTA per screen. None in onboarding; no timers or pressure. No CTA on a route the user cannot run.

| Place | CTA | Weight |
|---|---|---|
| Results (after an assessment) | Review this result with a mentor | secondary (primary is "See what to close first") |
| Route page, after the conditions | Talk through this route | secondary |
| A tool shows a gap (funds, net worth, language) | How to close this gap | secondary |
| Home (only after a result or a followed route) | Next available session (one card; no seat counts, countdowns or "only N left") | quiet |
| End of a news article on a followed route | Ask about this change | quiet |

## 8. Data model (shared `lib/`, used by site and app)

- `countries`: code, names in 5 languages, currency, photo, sources.
- `routes`: key, country, family, names, deciding fact, criteria (with weight, scoreable flag and the comparison against the profile), money lines (from `lib/funds.ts` style), timeline, fees, sources and checked dates.
- `profile` (phone only): the answers to the assessment, in encrypted storage (SecureStore / Keystore) because it holds citizenship and assets; Me has "Delete my answers".
- `fx`: daily rates from our API, with date and source.

The current flat 9-route list (`mobile/src/content/routes.ts` + `lib/fa/programmes.ts`) migrates into this, with no figure kept in two places.

## 9. Build order (maps to the App v2 board)

1. Data model and research for 10 countries × 5 families (V2-3, V2-4)
2. Start screen with two doors, and the Home / Countries / Assess tabs shell (V2-5, V2-12, V2-13)
3. Countries → Country → Route v2 (V2-6, V2-7, V2-8)
4. FX API + three currencies (V2-14): before the assessment, because asset bands are shown in the home currency
5. Assessment v2 + engine + results (V2-9, V2-10, V2-11)
6. Visual system v2 + imagery (V2-23, V2-24): runs alongside 2–4
7. Phase 2 tools, then Phase 3 growth

## FX sources (checked 15 Oct 2026)

- **ECB reference rates** (official, daily, free): about 30 currencies including USD, CAD, DKK, TRY, CNY, ILS, GBP, INR. These are the default.
- **Pegs** (official central-bank pegs): AED 3.6725 and SAR 3.75 per USD.
- **Gheymat** (`api.gheymat.today`, Farjad's product) for the **Iranian rial, free market**, in toman.
  - Use the partner endpoint `/v1/partner/index/latest` with a `gk_client_` key, server-side only. It covers USD, EUR, CAD, GBP, AED and TRY; crosses are computed by us, because Gheymat doesn't convert.
  - **Blocker:** production returned `status: insufficient_data` for USD on 15 Oct, which suggests its live sources are switched off. Farjad needs to turn them on and issue a partner key.
  - Until then the rial line is hidden, and the USD and own-currency lines still show.
- Labels: "ECB rate of {date}", "official peg" or "Iran free market (Gheymat), {date}".

## Open

- Gheymat: live data and a partner key (Farjad).
- Which Israel and UAE routes fit our families: research (V2-4).
- Level names from v1 (Explorer / Planner / Ready / Applicant): the v2 dashboard may replace the readiness score with match %. Decide after the auditor review.

## Auditor notes (15 Oct 2026)

Design review, no build. Fixed in this spec: disclaimer and "not a chance of approval" line reachable from Home, results and scored route pages; no CTA/offer on routes the user cannot run (Israel stays visible to all, per the decision, but carries no offer to those who cannot apply); skipped answers treated as unscored, not "not yet"; coverage shown with every %; asset bands stored in USD; FX moved before the assessment in the build order; booking prefill needs explicit review, sensitive fields off by default; mentor CTA demoted on results and hidden on Home for a first-time Explorer; Start screen exit and back-stack behaviour; source line on every country-row fact; motion kept off the native back gestures; illustration variants per mode; profile encrypted on device.

Owed by Farjad:
- One photo per screen (v1 rule) against a 10-photo Countries grid and 3-photo results. Either amend the rule to "one hero photo per screen; small thumbnails in lists allowed" or make the cards typographic.
- Results primary CTA: the auditor made "See what to close first" primary and the mentor review secondary, under the rule that the mentor CTA is not pushed on an Explorer. Confirm.
- Match % vs the v1 readiness score and level names: if both stay, they must never sit side by side with different numbers.
