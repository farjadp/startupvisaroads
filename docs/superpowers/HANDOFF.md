# Handoff — state of play

**Last updated:** 2026-09-06 · Update this file at the end of a session, do not append to it.

## Where things stand

`main` is **live on visaroads.com** and carries PR #3, #4, #5. **PR #6 is open and unmerged** (three photographs per Persian guide).

> Pushing `main` deploys to production — `trigger.yaml`, Cloud Build → Cloud Run `europe-west1`, ~10 minutes. Merging a PR **is** deploying. Confirm before doing it.

Farjad also runs **Devin** on this repo (PR #4 was Devin's). Expect commits and branches that did not come from your session. `git fetch origin --prune` and check which branch you are actually on before any reset or merge.

## What the site is

Mentoring a portfolio of **startup teams** through **startup visa and entrepreneur-immigration routes**. Four routes: **Denmark, the Netherlands, Finland, Canada.** Estonia is a secondary fast/low-cost option, never a headline. Not immigration advice, not "Canada startup visa" — Farjad corrected that twice.

`/fa` is a standalone Persian site with its own IA, not a translation of `/en`.

## The load-bearing files

| Concern | File |
|---|---|
| Which `/fa` paths exist + hreflang pairing | `lib/fa/paths.ts` — **add here first**, or the path 301s away |
| Persian page copy | `content/fa/<page>.ts`, rendered by `components/fa/FaPageLayout.tsx` |
| AEO/GEO layer | `FaPage.facts` + `.entity` → visible panel *and* `WebPage.about` PropertyValue; `faMeta()` for per-page OG |
| Imagery | `FaPage.image` / `imageAlt` / `gallery[]`; generate with `scripts/gen-fa-assets.ts` |
| SUV closure status | `content/fa/suv-status.ts` — one source for all four SUV pages |
| 3D globe | `components/fa/three/RoadsScene.tsx` + `lib/fa/land.ts` (needs coastlines or it is a black disc) |
| Autopilot trust gate | `lib/autopilot/text.ts:decidePlannedPublication`, wired into **both** writers |

Checks: `npm test` (171) · `npx tsc --noEmit` · `npm run build`.

## Open items

**Farjad owes:**
1. Copy review of the programme figures on the five destination pages — provincial thresholds, European means-of-support, and above all the **US entry-restriction paragraph** on `/fa/usa-eb2-niw`, the most time-sensitive claim on the site
2. `WEBINAR_DATE` in `content/fa/webinar.ts` is `null`; the **English** webinar countdown is hardcoded to 1 July 2026 and has been expired for two months
3. Decide whether `/fa/privacy` and `/fa/terms` get Persian versions — they 301 to English from the Persian footer
4. Submit each of the three Telegram-backed forms once on production to confirm delivery (which-path, contact, webinar)
5. Whether to merge PR #6

**Owed on production, after any deploy:**
- `npx tsx scripts/fix-fa-article-links.ts --write` against the **production** database. It has never run on real rows — the dev DB has no Persian articles. Persian articles written before the IA existed still link to paths that now 301 out of Persian.
- Resubmit the sitemap in Search Console
- Lighthouse with the 3D scene present

## Decisions worth knowing before you change them

- **Personal phone numbers are deliberately not rendered.** Three were Iranian `+98`, on `index,follow` pages listed in the sitemap, on a site about leaving Iran. Data kept in `content/team.ts` behind a header note; Telegram and WhatsApp still carry every member's routing. Restore per person with consent, not as a block.
- **Unverifiable track-record claims were removed** from the English home ($10M+ raised, 98% approval rate, 150+ founders relocated, 12-month average). An approval-rate claim contradicts our own copy telling readers that guarantee claims are a scam signal. If any are substantiated, restore them **with a source**.
- **Both autopilot writers are gated** on an allowlisted government citation. Two of the three harvest feeds are not government sources — `cicnews.com` is an immigration law firm's marketing property. Do not loosen this to raise volume; a short week means add a feed.
- **`/en/europe/finland` permanently redirects** to `/en/country/finland` (176-word stub vs 1,020-word page, both were indexable and competing). Persian Finland keeps its own URL and pairs with `/en/country/finland`.

## Known gaps nobody has taken

- Nine unused IRANSansX font weights ship in `public/fonts` and are declared in `globals.css`, referenced nowhere
- English display fonts still load on Persian pages
- `/country/*` vs `/europe/*` remains two namespaces for the same countries; only the Finland collision was resolved
