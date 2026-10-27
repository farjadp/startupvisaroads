# Route page v3 — layout A, the road map (Farjad chose A, 27 Oct 2026)

The route page becomes a journey the user walks. It reads `RouteV2` (unchanged) plus `RouteExtras` and `CountryProfile` (`lib/routes-v2/extras-types.ts`). A section with no data is not shown.

**Who gets the journey.** The journey (§2), the checkpoint (§3), the document checklist (§4) and the mentor button (§10) appear only when the route is **runnable for this user**: status open or limited, **and** not closed to the user's citizenship or residence (the passport gate in the v2 flow spec §3). Otherwise the page shows only the facts, money, conditions, timeline, sources and the reason in neutral words ("Not open to citizens of …, per <source>"; "Paused by <authority> since <date>"). No follow prompt, no quiz, no points, no "close the gap" offer (trust rules).

## Order on the page

Every section title is a `Label` (accessibility role header), so VoiceOver's rotor and TalkBack's heading navigation jump section to section; with up to ten sections this is how a screen-reader user scans the page. Long lists are capped (below) so the page stays scannable for everyone.

1. **Header** (as today): flag, family, route name, the deciding authority, an "unverified" banner before any figure, the deciding fact, and a status banner.
2. **Your road**: "3 of 7 steps" in text, with the progress bar as its decorative twin (the bar is hidden from screen readers; the text is read). One row per `steps[]` item. The state comes from what the user ticked: done (check icon + "Done"), here (the first step not done, map-pin icon + "Now" tag, ink text on an acid chip, never acid text on paper), ahead (empty circle + "Ahead" read by screen readers). State is carried by icon **and** word, never by icon or colour alone.
   - Tapping a step expands it in place: detail, how long it takes (as the authority states it, with its source), "Open the official page" (external `LinkRow`), and one native toggle control "Mark done" / "Not done". Steps may be ticked out of order; no reordering.
   - The last row is the **outcome**, not a step: flag icon, "Residence, then permanent residence — decided by <authority>". It is never tickable, never counted in "n of m", never earns points, and never shows a "Now" tag. The user prepares the steps; the authority decides the outcome.
   - Use "step" in copy, not "station", so the metaphor stays out of the way in five languages.
3. **Check what you know**: two rows.
   - "Road quiz — 5 questions", trailing "Best: 4 of 5" (no points on this page; points live only on Me, see below).
   - "Watch the road" only when an exported video exists in the app; hidden until then. When shown: never autoplays, captions in all five languages (WCAG 1.2.2), transcript reachable.
4. **Documents**: checklist grouped by stage (apply / visa / permit / renewal, each stage a sub-heading), "6 of 10 ready" in text with the progress bar as decorative twin; reuses `CheckRow`. Shows the first stage expanded and the others as one row each ("Visa — 1 of 3 ready", tap to expand), so ten-plus documents never become one long wall.
5. **Money for your team**: see "Team-funds steppers" below.
6. **Conditions** (as today): those we can check, those the authority decides. When the user has an assessment, each checkable condition carries met / close / not yet (never failed, rejected, ineligible), the line "Match with published criteria; not a chance of approval", the unscored conditions listed beside it, and a link to the disclaimer.
7. **What no one tells you**: `realities[]`, the first three shown, then "Show all n". Each with an icon **and** a text tag for its kind ("Challenge", "Tip", "Myth"), never the icon alone. A reality that states a figure (money, time, a count, a rate) must carry its `source` and checked date; a reality without a source states no figure. No reality may state or imply odds, refusal rates or approval rates.
8. **From residence to citizenship**: a three-node timeline, Arrive → "Can apply for permanent residence after n years" → "Can apply for citizenship after n years", then one line on dual citizenship and one on language, then the `SourceLine` with its checked date. Wording is always "can apply after", never "you get" or "PR in n years" (no guarantees). Laid out horizontally only when it fits; stacked vertically at fontScale > 1.3 or whenever any node label would wrap past two lines (French). The connecting arrows mirror in fa/ar; the nodes keep their order from the start edge.
9. **About the country**: one row → country page, which gains strengths, weaknesses and indicators (rank "of N", year, source per figure).
10. Mentor button (secondary, runnable routes only, never the only action on the page), sources with dates, disclaimer (as today).

**Disclaimer reach.** The page is long, so the disclaimer line and its link appear in three places, not only at the bottom: under the money totals (§5), under the conditions when they are scored (§6), and at the foot (§10).

## Team-funds steppers (§5)

- **Which controls appear** is decided by the data, never by guess:
  - Founders (1–5): only when a `FundLine` has `per: 'founder'` or `per: 'team'`.
  - Spouse: only when a line has `per: 'spouse'` or `per: 'family'`. It is a native **Switch** (iOS `Switch`, Android M3 switch) with a visible label, not an on/off stepper.
  - Children (0–4): only when a line has `per: 'child'` or `per: 'family'`.
  - When the authority publishes no amount for a family member, the control is not shown and one line says so ("<authority> publishes no extra amount for a spouse or children"), so an unchanged total is never read as "family costs nothing".
- **Stepper build** follows the existing funds stepper (`mobile/src/app/(tabs)/assess/funds.tsx`): one element with role adjustable on iOS (swipe up/down changes the value), label = the question, value = "2 founders"; − and + each at least 44×44 pt / 48×48 dp with 8 dp between them; − disabled at the minimum, + at the maximum, with a disabled look that still meets 3:1 for the outline. On Android the − and + are separate labelled buttons ("Fewer founders", "More founders") because TalkBack has no adjustable role. The new total is announced (iOS announcement, Android polite live region) as one sentence.
- **Totals** are three stacked lines, never side by side: "Kept in your account" (`kind: 'show'`), "Paid out — fees and deposits" (`kind: 'spend'`), "Invested in the business" (`kind: 'invest'`). Each line in the official currency, about USD, and about the home currency (v2 flow spec §5, the existing FX with its rate date). Currency amounts in Latin digits in every locale; counts ("2 founders") in Persian digits in fa.
- **Never sum different bases.** Amounts with `basis` once and per year are totalled separately ("once" / "each year"); a total never adds a yearly amount to a one-off one.
- **Every line carries its source** (`FundLine.source`) and checked date, expandable under the total ("How this is counted"); approximate lines say "about".
- **Only the authority's figures.** "Paid out" holds official fees, deposits and investment minimums only, never a VisaRoads or partner price (no company prices anywhere).
- Footnote under the totals: "The published minimum only; meeting it is not approval." Then the disclaimer link.
- At fontScale > 1.35 each total stacks label over amount (existing `useAmountRow`), and the stepper value moves under its controls.

## Quiz screen (`/route/quiz/[key]`)

- Opens as a **sheet** on iOS (self-contained task) with a "Close" button at the top start; on Android as a full-screen destination with the top-app-bar Back. System Back / edge-swipe / predictive Back stay live. Leaving mid-quiz drops the attempt without a confirmation dialog and without guilt copy; the best score is kept.
- One question per screen, "Question 2 of 5" in text (the bar, if any, is decorative). 3–4 options as `RadioRow`s inside one radio group. "Check" is disabled until an option is chosen. Options are shuffled per attempt so the answer is never in a fixed position.
- After "Check": the options lock, the chosen and the correct answer are marked by icon **and** word ("Your answer", "Correct answer"), never colour alone, and the one-line why is shown and announced (live region / announcement). Wrong-answer copy is neutral ("Not this one"), never "Wrong", "Failed" or a buzzer sound. Then "Next"; on the last question "See result".
- Result screen: "4 of 5", the best so far, "Try again" and "Back to the road". No timer, no streak, no "only x% get this right", no comparison with other users.
- Finishing 5/5 earns the road's badge ("Knows the road"). The badge is shown quietly (no confetti, no bounce; the brand easing only, off under Reduce Motion / Remove animations) with one line: "You know how this road works. Knowing it is preparation, not a chance of approval."
- Answers come from the route's official data, never from the notebooks. Each question's why cites the source the answer comes from. No question asks about approval odds, refusal rates or "how likely".

## Points and badges

Points are for learning and preparing, never for eligibility or approval.

- 10 per correct quiz answer (best attempt), 5 per step ticked, 2 per document ready. Points are **derived** from `journey`, `docs` and `quizBest` every time, never stored, so unticking a step or a document removes its points (no tick/untick farming) and deleting data from Me zeroes them.
- Points never feed the match %, are never shown on the route page, the results screen or Home beside a match %, and are never phrased as "progress to approval", "visa points" or anything that echoes points-based immigration systems (Express Entry CRS, the UK points test). Copy says "learning points".
- The Me tab shows the total and the badges, and directly under the total the sentence: "Points track what you've learned and prepared. They are not a chance of approval." with the disclaimer link.
- Badges only for real milestones: "Knows the road" (quiz 5/5), "Papers in order" (every document on a route ticked), "Road walked" (every step on a route ticked). No badge for opening the app, visiting, or time spent.
- No streaks, no daily nagging, no notifications about points, no leaderboard, no "you're losing points", no badge that expires.
- Points and badges are never shown for a route the user cannot run.

## State (on the phone, `AppState` v1 + new fields)

- `journey: Record<routeKey, stepKey[]>`
- `docs: Record<routeKey, docKey[]>`
- `quizBest: Record<routeKey, { right: number; of: number }>` (so a quiz with other than five questions still reads correctly)
- `team: { founders: number; spouse: boolean; children: number }`
- All four are cleared by "Delete my data" in Me, with the rest of the profile. Points are computed, not stored.

## Accessibility and RTL

- Each step row's header reads as one element with its state ("Step 4 of 7, Register the company, now, collapsed"), role button with expanded/collapsed state. When expanded, its link and its "Mark done" toggle are separate focusable elements after it, in reading order.
- Every progress bar has a text twin; the bar itself is hidden from screen readers. The timeline is a list for screen readers ("1 of 3, Arrive …").
- RTL mirrors the layout with logical start/end; the road line runs down the start edge. Icons that show direction (chevrons, arrows, the timeline connectors) flip; checkmarks, the map pin, the flag and country flags do not.
- Numerals: counts and quiz scores in Persian digits in fa; currency amounts and programme codes in Latin digits; dates in fa prose Jalali. Arabic follows the app's existing ar formatter.
- Strings are ICU messages, never concatenated ("{done} of {total} steps", "Best: {right} of {of}", "{points, plural, …} learning points"); Arabic needs all six plural forms.
- No uppercase or letter-spacing on Arabic-script labels; Chinese never italic.
- Touch targets at least 44×44 pt (iOS) and 48×48 dp with 8 dp spacing (Android).
- Contrast: "Now" and any acid element follow the Brand Book (ink on acid, never acid text on paper); muted step text and disabled stepper controls meet 4.5:1 / 3:1 in paper and night.
- Motion: expanding a step and the badge use the one brand curve; all off under Reduce Motion / Remove animations. Nothing scroll-jacked.

## Auditor review (27 Oct 2026, design review, no build)

Fixed in this spec: journey, quiz, checklist, points and mentor button gated on the passport gate as well as route status; outcome row made untickable and attributed to the authority; points kept off the route page and away from match %, derived not stored, untick removes them, with the "not a chance of approval" sentence under the total; quiz neutral wrong-answer copy, no confetti, sheet with live Back; family controls shown only when the authority publishes an amount, spouse as a native Switch, Android − / + buttons, no mixed-basis totals, source per fund line, no company prices; timeline "can apply after", stacked for French and large text; reality figures require a source; section headers as accessibility headings, documents and realities capped for scanability; disclaimer repeated under money and scored conditions; ICU plurals; data cleared on delete.

Open for Farjad:
- The v2 flow spec says "Match % is the only number in the app". A learning-points total is a second number. Keep points (with the guards above), or drop the total and keep badges only?
- Weighting: a perfect quiz gives 50 points while ten ready documents give 20, so learning outweighs preparing. Rebalance (e.g. 5 per document), or accept because points never touch the match %?
