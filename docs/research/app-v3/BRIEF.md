# Research brief — app content v3 (shared by every country agent)

Repo worktree: `/Users/farjad/Downloads/Work-Studio/startupvisaroads/.claude/worktrees/app-content` (branch `feat/app-content-v3`). Work only there. Do not commit, do not touch files outside the ones named in your task, never `git add -A`.

Read first: `docs/superpowers/specs/2026-10-27-app-content-v3.md`, `lib/routes-v2/types.ts`, `lib/routes-v2/extras-types.ts`, and your countries' current routes in `lib/routes-v2/*.ts` (match.ts shows how criteria are scored).

## 1. Read the notebooks (Farjad's Gemini Notebook, already signed in)

Use the built-in browser tools (`mcp__Claude_Browser__*`). Open your OWN tab with `tabs_create` and pass its `tabId` to every call — other agents share the pane. Navigate straight to `https://notebook.google.com/notebook/<id>`, wait ~5 s, then `javascript_tool` with `document.body.innerText` (slice it in 25,000-character chunks if long). That returns the sources list, the whole chat history and any open Studio report. To read another Studio report, click its row in the Studio panel (right side) and read innerText again. Read only: never type in the chat, never generate Studio items, never edit or delete anything. Close your tab at the end.

Notebooks rest mostly on YouTube and contradict themselves. **They are leads and structure, not sources.** Every figure, fee, threshold, processing time, step and ranking you write must come from an official government or programme page (or, for rankings, the institution that publishes the index: UNDP, World Happiness Report, Vision of Humanity/GPI, World Bank, WIPO, EF, Henley, OECD) that you actually opened with WebFetch, cited with its URL and today's date `2026-10-27`. If you cannot open the official page, leave the item out and say so in the report.

## 2. Compare and report — `docs/research/app-v3/<cc>.md` (one per country)

For each existing route: a table of every conflict between notebook, our current data and the official page: field, ours, notebook, official, verdict (ours right / ours wrong → new value / notebook only, unverified), URL. Then things the notebook covers that our data lacks. Then the Studio items in each notebook (title, kind: video/infographic/slides/mind map/quiz/flashcards/report). Short, in English. Do NOT edit the existing route files — the lead applies corrections.

## 3. Write the data — `lib/routes-v2/extras/<cc>.ts`

```ts
import type { CountryProfile, RouteExtras } from '../extras-types';
export const EXTRAS_<CC>: Record<string, RouteExtras> = { '<route-key>': { funds, steps, documents, realities, timeline, quiz, media } };
export const PROFILE_<CC>: CountryProfile = { strengths, weaknesses, indicators };
```

- Every route of the country gets extras. Funds: split per person / founder / team / spouse / child and kept (`show`) vs paid (`spend`) vs invested (`invest`); team routes (e.g. Finland, Denmark) must make clear funds are per founder.
- Steps: 4–8, in order, each with the official portal link where it is done.
- Documents: what the authority's own checklist lists.
- Realities: 3–6 (challenges, tips, myths debunked), drawn from the notebooks but each checked; give a source URL where the claim is factual.
- Timeline: years to PR and to citizenship, dual-citizenship rule, language requirement.
- Quiz: exactly 5 questions per route, 3–4 options, answers from the official data, `why` one sentence.
- Media: one `MediaLead` per Studio video / infographic / slide deck / mind map in the relevant notebook (`notebookId`, kind, title).
- Profile: 3–5 strengths, 3–5 weaknesses (honest, for an immigrant founder/student/worker), and indicators with the latest year available.

Text: `{ en, fa }`, both required. Persian must read as written by a native Persian editor, not translated: load the `persian-writing` skill first. Use ZWNJ (نیم‌فاصله), Persian digits in fa text, «» quotes, official acronyms in Latin (PPA, IRCC, RVO). Voice: plain, factual, no hype, no "guarantee", never "chance of approval". Never mention VisaRoads prices or company figures.

## 4. New countries only — `lib/routes-v2/<cc>.ts`

`export const ROUTES_<CC>: RouteV2[]` following types.ts exactly, like the existing files (criteria with weights and scoreable tests where the profile can decide them, money, fees, processing, pr, sources, `verified`, `review`). Cover each family the country really offers to immigrants: startup/innovation, entrepreneur/self-employed, study, talent, skilled-worker points (`express`). Keys `<cc>-<slug>`. Do not register them in index.ts — the lead does that.

## 5. Check

`cd <worktree> && npx tsc --noEmit -p tsconfig.json 2>&1 | grep routes-v2` must print nothing for your files. Finish with a short summary: files written, conflicts found (count and the three most important), what you could not verify.
