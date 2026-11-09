# Case Studies: spec (decision-ready)

Status: spec. Nothing is built yet. Farjad picks the open decisions (section 12) and a visual option before work starts.
Owner: CPO. Inputs: cto via tech-lead, head-of-data via llm-engineer, coo via legal-compliance-specialist, head-of-mobile, product-designer, seo-strategist. Date: 9 Nov 2026.
Visual options: `docs/product/case-studies-options.html`.

## 1. Summary

- **What.** A Case Studies section on visaroads.com. English at `/en/case-studies` and Persian-first at `/fa/case-studies`; the Persian pages are written for Persian readers, not translated. The app follows in phase 2.
- **Two content types.**
  - (A) AI-assisted analyses of Canada Federal Court judicial-review decisions on IRCC refusals.
  - (B) Anonymised VisaRoads client cases, published with consent.
- **Grounding and approval.** Every claim on a type A page cites a paragraph of the decision. A machine check confirms that each quote appears in the paragraph it cites. Farjad approves every page in admin, and the server refuses approval while any claim is unchecked.
- **Naming.** We never name applicants. Only the neutral citation appears (e.g. "2025 FC 12"), linked to the Court's official copy. Party names never appear in titles, slugs, meta tags, JSON-LD or the app.
- **Source.** We fetch decisions only from decisions.fct-cf.gc.ca, never from CanLII. CanLII's robots.txt disallows all crawlers, and it is suing an AI company over scraping.
- **Build.** New Prisma models (`CaseStudy`, `ConsentRecord`). Reusing `Article` would leak cases into roughly 12 places that read published articles: socials, RSS, the autopilot corpus and the app news feed.
- **Phasing.**
  - Phase 0: the pipeline and its eval.
  - Phase 1: site and admin, about 11 engineer-days.
  - Phase 2: app API about 2 days, app screens about 1.5–2 weeks elapsed.
  - Type B goes live only after counsel has reviewed the consent form.
- **App.** No new tab; there are already 5. Cases appear as a "Cases" segment on each route page, a "News | Cases" switch in News, and a Today card when a followed route gets a new case.
- **Cost (estimate).** About $0.80 of model spend per type A case. The real cost is Farjad's review time: about 25 minutes per type A case and 15 minutes per type B case.
- **First five decisions.** All verified on the official site: 2025 FC 12, 2025 FC 1599, 2026 FC 146, 2026 FC 158 and 2026 FC 255. They cover start-up visa (SUV), C11 and study permits, with three allowed and two dismissed.

## 2. Content types

| | A. Court decision analysis | B. Own client case |
|---|---|---|
| Source | Official decision, decisions.fct-cf.gc.ca | Farjad's notes, saved to a file outside the repo (never pasted into chat) |
| Grounding | Paragraph pin-cite + exact quote for every claim | Span in the redacted notes for every claim |
| People | "the applicant"; neutral citation only | Fully anonymised; client approves the final text in each language |
| Outcome shown | Court's exact disposition (set aside and sent back / dismissed) | Only the VisaRoads stage (e.g. the evaluating body's approval); government outcome only with explicit consent |
| Gate | Farjad approves in admin; every claim marked checked | Same, plus a live (unrevoked) consent record |
| Launch | Phase 1 | Built in phase 1, **published only after counsel reviews the consent form** |

Scope out: other countries' courts (later); refugee/protection matters and decisions under confidentiality orders (never); full reproduction of decisions (never; short quotes only).

## 3. Page anatomy

**Index (`/en/case-studies`, `/fa/case-studies`)**
1. Hub intro. It must state the direct answer: "The Federal Court does not hear an appeal of a visa refusal; it hears a judicial review. If the Court agrees, the decision goes back to a different officer. It does not grant the visa."
2. Filters: route, outcome, country (Canada only for now), as query parameters.
3. List. Each item shows the citation, route, outcome, date and a one-line lesson. The index launches without client-case items; those are shown only once type B is live.

**Type A case page**
1. Badge "Court decision", route + country chips, decision date.
2. Outcome block, using the exact wording "Allowed: sent back for a new decision by a different officer" or "Dismissed: the refusal stands". When the outcome is Allowed, a fixed sentence says the visa was not granted.
3. In one line.
4. Facts.
5. The issue, and the standard of review in plain words.
6. What the Court held.
7. Why the officer erred, or didn't.
8. Lessons for your file. Each lesson links to the matching route guide checklist and must be based on a claim.
9. A ¶ chip on every claim. Clicking it shows the exact quote from that paragraph.
10. Source box:
    - neutral citation, Court and date;
    - "Read the official decision" link;
    - attribution;
    - "not produced in affiliation with, or with the endorsement of, the Government of Canada".
11. Disclaimer (a).

**Type B case page.** Same frame without ¶ chips. The source line reads "VisaRoads client, anonymised, shared with written consent", followed by disclaimer (b).

## 4. Editorial and approval workflow

States: `DRAFT → IN_REVIEW → APPROVED → SCHEDULED → PUBLISHED`. A page can move to `WITHDRAWN` from any state, after a correction or a consent withdrawal.

| Step | Who | Rule |
|---|---|---|
| Pick decision | seo-strategist proposes, Farjad agrees | Mix of routes and outcomes; check robots.txt allows the item |
| Run pipeline | local `case-study-writer` agent (new) | Stages in §6; any failed holding/disposition stops the case |
| Post | agent → `POST /api/agent-case-studies` (Bearer `AGENT_REPORTS_TOKEN`) | Lands in **IN_REVIEW**, never publishes; repost replaces only while DRAFT/IN_REVIEW |
| Review | Farjad, admin review screen | Claims beside their ¶ refs and official link; tick each claim; red-line scan result shown |
| Approve | Farjad only | Server refuses unless all claims checked + ≥1 para each (A) / live consent (B); `approvedBy` from admin session |
| Publish | Farjad now, or SCHEDULED → 15-min sources cron | Conditional update: `approvedAt IS NOT NULL AND publishAt <= now` |
| Share | Farjad, manually | No `afterPublish` auto-socials; type B never on socials in v1 |
| Withdraw | Farjad | Revoking a consent withdraws every linked case; unpublish everywhere within 5 business days (target: same day) |

Conflict I resolved: head-of-data proposed approving a local review packet before the POST, while cto proposed approval in admin. **Decision: one gate, in admin, enforced by the server.** The agent's packet is what gets posted. A local-only gate can't be audited and would leave two places where approval happens.

Re-check: a decision with a certified question can go to the Federal Court of Appeal. fact-checker re-checks those cases quarterly, using the sha256 and fetch date stored with each case.

## 5. Legal, consent, disclaimer

Not legal advice. Items marked **[counsel]** need a licensed Ontario lawyer before launch.

**Reproduction.**
- The Reproduction of Federal Law Order, SI/97-5 (https://laws-lois.justice.gc.ca/eng/regulations/SI-97-5/page-1.html), lets anyone reproduce federal court decisions without permission. Two conditions: due diligence on accuracy, and the reproduction must not be represented as an official version.
- The Federal Court's Important Notices page (https://www.fct-cf.gc.ca/en/pages/important-notices) asks for attribution and a no-endorsement line, and says commercial redistribution of multiple copies needs permission. **[counsel]:** how the two fit together for a commercial site.
- Until counsel answers, we comply with both:
  - short quotes with pin-cites;
  - a link to the official text;
  - the attribution and the no-endorsement line;
  - never a republished full decision.
- Farjad's per-claim check is our due diligence on accuracy.

**Fetching.**
- Use decisions.fct-cf.gc.ca only.
- Honour its robots.txt: it blocks specific items, which we never publish.
- Fetch at a low rate with an identifying user agent.
- The seo-strategist got a 403 with a default client. If the identified agent is refused, Farjad downloads the PDF by hand into the case folder. We do not spoof a browser.
- CanLII: no automated access at all. A person may read it by hand. We never copy its headnotes. Links always point to the Court's copy.

**Naming (type A).**
- Write "the applicant" or "the principal applicant / the spouse". No names, and no initials either.
- Nationality appears only when the reasoning turns on it. It is never combined with a city, school, employer, age or exact date.
- Where the Court already anonymised a decision, keep its designation as it is.
- PIPEDA's publicly-available exemption (SOR/2001-7 s.1(d)) is narrow **[counsel]**. Anonymising removes most of the risk.
- The same rule applies to EU and Quebec readers; GDPR and Law 25 are unverified.

**Tone.**
- Every evaluative statement is attributed to the Court ("The Court found… [para 23]").
- We never name officers or visa offices.
- The judge is named only as the decision's author, never next to criticism.
- No claim of bias or incompetence in our own voice.

**Own cases (type B).**
- Consent must be express, written and separate for each case, never bundled into the service contract and never a condition of service. The client approves the final text in each language; this also covers Competition Act s.74.02. No incentive.
- We keep the signed consent and the approved text while the page is live, plus 2 years.
- Withdrawal works through the same channels the client used to consent. We unpublish within 5 business days and ask search engines to drop their cached copies.
- Anonymisation checklist, all removed or generalised:
  - names, initials and nicknames;
  - exact dates, given as month/year or season instead;
  - nationality + city combinations;
  - employer, incubator, designated organisation and school;
  - UCI, file, receipt and passport numbers;
  - exact amounts, as ranges or dropped;
  - family composition and ages;
  - photos, voice, screenshots;
  - niche profession or rare business idea;
  - handles and company names;
  - officer and visa office.
- Re-identification test: would the client's employer, a relative or someone in their community recognise them? If yes, generalise further. Never invent facts.
- IRPA s.91: pages describe only our mentorship and business-plan work and the evaluating-body step. They never say we prepared, filed, advised on or represented an application. **[counsel]** on the boundary.

**Consent form outline (en; a natural Persian version is required and goes to counsel):**
1. Parties
2. Final text attached, in each language
3. Where it appears: site, /fa, app; social yes/no
4. Anonymisation applied, plus opt-ins (employer, quote, photo)
5. No payment, or disclosure of any benefit
6. Sensitive information acknowledged
7. Approval of the final wording
8. Withdrawal: how to ask, 5 business days, limits on copies already shared
9. Retention
10. Privacy contact and the right to complain to the OPC
11. Signature and date (electronic signature acceptable)

**Disclaimers (paste-ready):**
- (a) Court decision, EN: "An educational summary of a public Federal Court of Canada decision, not legal or immigration advice and not the official version. The official text is on the Court's website (linked). Every case turns on its own facts. VisaRoads Inc. is not affiliated with or endorsed by the Government of Canada or the Court. For your own case, consult a lawyer or a licensed consultant (RCIC)."
- (a) FA: «این صفحه خلاصه‌ای آموزشی از یک رأی عمومی دادگاه فدرال کاناداست؛ نه مشاوره حقوقی یا مهاجرتی است و نه نسخه رسمی رأی. متن معتبر را در سایت دادگاه بخوانید (لینک بالا). هر پرونده با شرایط خودش سنجیده می‌شود. ویزا رودز هیچ وابستگی‌ای به دولت کانادا یا دادگاه ندارد. برای پرونده خودتان با وکیل یا مشاور مهاجرت دارای مجوز (RCIC) صحبت کنید.»
- (b) Own case, EN: "A real VisaRoads client's experience, shared with their written consent; identifying details are removed or generalised. VisaRoads Inc. provides mentorship and business-plan services. It is not an immigration representative and gives no immigration advice. Results depend on each person's circumstances and on government decisions. This story is not a typical result or a promise of any outcome."
- (b) FA: «این تجربه واقعی یکی از مراجعان ویزا رودز است که با رضایت کتبی خودش و بدون جزئیات شناسایی‌کننده منتشر شده. ویزا رودز خدمات منتورینگ و نگارش طرح کسب‌وکار ارائه می‌دهد و نماینده یا مشاور مهاجرتی نیست. نتیجه هر پرونده به شرایط خود فرد و تصمیم مقام دولتی بستگی دارد؛ این تجربه نه نتیجه معمول است و نه تضمینی برای شما.»

**Red lines.** The pipeline's rules check scans for these, and so does Farjad's review:
1. Guarantee wording: "guaranteed approval", «تضمین ویزا», «قبولی قطعی».
2. "We got them their visa / PR / permit".
3. "The Court approved the visa" or "won the appeal".
4. Any success rate, approval count, "X of Y" or "100%".
5. "Your case is like this one, so you will…".
6. "We file / submit / represent you".
7. "Our immigration advice" or «مشاوره مهاجرتی ما».
8. Refund wording beyond the existing undertaking (money back only if we fail to get the evaluating body's approval within 12 months).
9. Bias or incompetence claims in our own voice.
10. "Official" or government symbols.
11. Company prices or fees.
12. "Typical result" or "this could be you".

## 6. AI pipeline (head-of-data)

**Where it runs.** A local Claude Code agent (`case-study-writer`, new) plus deterministic TypeScript checks in the repo (`npx tsx`). The same checks run as a CI regression gate.
- Why not a server cron: the server autopilot runs on OpenAI and lib/ has no Anthropic SDK.
- Volume is under 10 cases a week, and a human gate exists anyway.
- Type B notes never leave Farjad's Mac unredacted.

| # | Stage | Engine |
|---|---|---|
| 0 | Pre-redact type B notes (from `~/VisaRoads-private/cases/<id>/raw.md`) using Farjad's names list | deterministic |
| 1 | Fetch from decisions.fct-cf.gc.ca; store sha256 and fetch time | deterministic |
| 2 | Parse into numbered paragraphs, with the JUDGMENT block, style of cause and certified question | deterministic |
| 3 | Extract to the schema below, with structured output and no tools | Opus 5.5 |
| 4 | Ground: exact quote must sit inside the cited paragraphs; entailment check | deterministic + Haiku 5.5 |
| 5 | Anonymise in en and fa: name list, ID regexes, gazetteer, diff check | deterministic + Haiku |
| 6 | Draft en: every sentence carries claimIds | Sonnet 5.5 |
| 7 | Write fa from the claims plus a Persian reader brief, never from the en draft | Sonnet 5.5 |
| 8 | Trace and rules: claimId parity en/fa, `inventedNumbers` must be empty, red lines, fa lint | deterministic + Haiku |
| 9 | Fact-check only `external` claims (IRCC rules or figures stated outside the decision); never sees type B text | project `fact-checker` |
| 10 | POST, which puts the case IN_REVIEW for Farjad | — |

**Schema (core).**

```ts
interface ClaimA {
  id: string;
  kind: 'fact' | 'issue' | 'standard' | 'holding' | 'error_found' | 'no_error' | 'lesson';
  text: string;
  paras: number[];
  quote: string;
  speaker: 'court' | 'officer' | 'applicant' | 'respondent' | 'quoted_authority';
  external?: boolean;
  basedOn?: string[];
}
interface CaseA {
  citation: string;
  courtFile: string;
  url: string;
  decisionDate: string;
  sha256: string;
  programme: 'study' | 'work' | 'suv' | 'pnp_related' | 'other';
  disposition: 'allowed' | 'dismissed';
  dispositionQuote: string;
  remitted: boolean;
  certifiedQuestion: string | null;
  standardOfReview: ClaimA[]; facts: ClaimA[]; issues: ClaimA[];
  holdings: ClaimA[]; officerErred: ClaimA[]; lessons: ClaimA[];
}
interface ClaimB {
  id: string;
  kind: 'fact' | 'problem' | 'action' | 'outcome' | 'lesson';
  text: string;
  sourceSpan: { start: number; end: number };
  quote: string;
}
```

**Hard rules.**
- No fuzzy quote matching.
- A failed claim is dropped, never repaired. A failed holding or disposition stops the whole case.
- Holding, error_found and standard claims must have speaker `court` and come from the analysis section.
- The disposition regex and the model must agree. Any mismatch, an "allowed in part" outcome or a consent judgment blocks the case.
- A sentence with no claimIds (framing) may contain no number, date, name or legal proposition.

**Persian.**
- Titles use the word searchers use (ریجکتی / رفع ریجکتی). The body uses the glossary terms: بازبینی قضایی، انصاف رویه‌ای، معیار معقول بودن (رأی Vavilov)، معیار بازبینی، افسر مهاجرت.
- Paragraph references are written «بند ۲۳» with Persian digits. Citations stay in Latin script.
- Lint checks: نیم‌فاصله, ی/ک, گیومه, no em dash.
- Rubric: mean ≥ 4/5, with no item below 3.

**Eval before the first 5 publish.**
- 40 type A cases: 30 normal, 15 allowed / 15 dismissed, across all routes.
- 10 adversarial type A cases: consent judgment, certified question, consolidated applicants, long quotes from the officer.
- 10 synthetic type B cases with planted personal data.
- Pass bars:
  - disposition, remitted and certified question 100%;
  - holding correct ≥ 95%;
  - unsupported claims published 0;
  - planted personal data leaked 0;
  - en/fa claim parity 100%.
- Labelling takes about 8 hours. llm-engineer drafts the labels; Farjad spot-checks 10.

**Cost (estimate).**
- Type A: about $0.60 per case, about $0.80 with retries. Type B: about $0.35.
- At 10 a week, under $40 a month.
- The prices come from the claude-api skill. The Haiku price is unverified but barely moves the total.
- Under Claude Code, this is subscription quota rather than API spend.
- Human review: about 25 minutes per type A case and 15 minutes per type B case.

**Prerequisites in code.**
- Add `decisions.fct-cf.gc.ca` to `lib/autopilot/official-sources.ts`.
- Build the new ingest endpoint with an IN_REVIEW state. `/api/agent-articles` has no review state, so it is not reused as is.

## 7. Data model, routes, API (cto)

**Model.** Two new models, added to both `prisma/schema.prisma` and `prisma/schema.production.prisma`. JSON fields are stored as String.

- `CaseStudy` fields:
  - identity: `groupKey` (pairs en/fa), `locale`, `slug`, `type` (FC_DECISION | CLIENT_CASE), `status`;
  - content: `title`, `excerpt`, `content` (sanitised HTML), `keyTakeaway`, `summaryEn`;
  - decision: `court`, `citation`, `decisionDate`, `judge`, `route`, `country`, `outcome`, `officialUrl`;
  - analysis (JSON): `issues`, `lessons`, `claims` with `{id, kind, text, paras, quote, verified}`, `faq`;
  - provenance: `sourceSha256`, `fetchedAt`, `certifiedQuestion`, `consentRecordId`, `aiModel`;
  - workflow: `approvedBy`, `approvedAt`, `publishAt`, `publishedAt`, `withdrawnAt`, `withdrawnReason`, `supersededById`.
- `CaseStudy` constraints: unique (locale, slug) and unique (groupKey, locale). A case can exist in one locale only.
- I added `quote` per claim, plus `sourceSha256`, `fetchedAt` and `certifiedQuestion`, to the tech-lead's sketch. Mobile needs the quotes in the payload to work offline, and the appeal re-check needs the hash.
- `ConsentRecord` fields: `clientRef` (never a name), `scope`, `signedAt`, `documentUri` (private storage only), `revokedAt`, `recordedBy`.
- `publishAt` gets its own column. Agent-articles stores the release time in `createdAt`; don't repeat that.
- One migration. On db-f1-micro, confirm "successfully applied" in the boot logs.

**Admin.** Under `app/[locale]/(admin)/admin/case-studies`:
- a list, filterable by status and type;
- a review view: claims beside their ¶ refs and quote, a per-claim "checked" toggle, the official link, the consent record;
- approve, schedule and withdraw actions.

All of these go through `/api/admin/case-studies/*` with `getSessionFromRequest`, not through unauthenticated server actions (see §13).

**Routes.**
- Pages: `/en/case-studies`, `/en/case-studies/[slug]`, `/fa/case-studies`, `/fa/case-studies/[slug]`. Slugs are Latin, which is the current /fa convention.
- Slug pattern: `<route>-<year>-fc-<number>`, e.g. `start-up-visa-2025-fc-12`, `study-permit-2026-fc-255`.
  - **The applicant's surname never goes in the slug.** This overrides the seo-strategist's proposal (`…-2025-fc-12-shoaie`), which breaks the naming rule.
  - Flat routes, no programme folder: simpler routing, and the route filter covers the same need.
- `lib/fa/redirects.ts`: add `/case-studies/` to `DYNAMIC_PREFIXES`.
- `lib/fa/paths.ts`: add `/case-studies` only when the first Persian case is published. Until then `/fa/case-studies` 301s to English, so there is never an empty Persian index.
- A case with only one locale: the other locale's URL 301s to it, as the blog does at `blog/[slug]/page.tsx:86`. If neither exists, 404.
- Filters as query parameters. Filtered views are noindex, with the unfiltered index as canonical.

**App API (phase 2).** Copies the `app/api/app/news` conventions: revalidate 600, CORS, ETag/304, en fallback, newest 50 plus `since`.
- `GET /api/app/case-studies?locale=&since=` returns the list plus a **`withdrawn: [ids]`** array. The array is new and required, so the app's cache drops withdrawn cases; without it, a consent withdrawal is a privacy bug.
- `GET /api/app/case-studies/[slug]?locale=` adds `html` (via `sanitizeForApp`), issues, lessons, claims with quotes, and `officialUrl`.

## 8. App placement (head-of-mobile, phase 2)

- **No new tab.** There are already 5 (Today, countries, assess, news, me), the HIG/M3 maximum.
- **Route page.** Add a 5th segment, `cases`, after do / rules / money / after. It shows only when the route has at least one case; `pickTab` already handles a tab that is missing on a route.
- **News.** A "News | Cases" switch gives a browse-all list.
- **Today.** A card "New case on your route" when a followed route gets a case.
- **Case screen.**
  - Header with outcome, then In one line, Facts, What went wrong, and "Do this instead" (deep link `?tab=do`).
  - Source, with the official decision opening in an in-app browser.
  - Disclaimer.
  - Tapping a ¶ chip opens a bottom sheet with the original quote. In fa, a labelled unofficial translation goes below it.
- **Languages.** fr, ar and zh users get the English cases with a caption, the same pattern as `news.englishFeed`. English blocks keep LTR inside RTL layouts.
- **Offline.** Show the cache first. Pre-cache cases on followed routes and keep every opened case.
- **Links from the site.**
  - `visaroads.com/...` links won't open the app yet: there are no associatedDomains or intentFilters.
  - Bundle universal links with the next store build (Stage 6), which already needs one.
  - Until then, the site offers an "Open in app" `visaroads://` link.
- **Risk.** Five segments may truncate in fa/fr on 320 pt screens. The designer tests the longest labels; the ux-auditor gate runs on the spec and again after the build.
- **Dependency.** No mobile work starts until the other session's `mobile/` branch is merged. Phase 2 touches `countries/route/[key].tsx`, `routeTabParse.ts`, `news/index.tsx` and `home/index.tsx`.

## 9. SEO / AEO

**Demand.** Measured with Google autocomplete only, no volumes.
- English entry points are study permit refusals ("study permit refusal appeal / reconsideration", "judicial review study permit canada"), "c11 work permit" and "procedural fairness letter ircc".
- SUV and C11 refusal queries are thin but high-intent.
- Persian searchers use «رفع ریجکتی کانادا» and «دلایل ریجکتی ویزای تحصیلی کانادا». "Judicial review" barely registers in Persian. The «هزینه» (cost) intent can't be served, because we show no prices.

**Competitors.** dadkhah.ca and sobirovs.com post one article per decision and rank. Their posts are short summaries with no paragraph cites; that gap is our edge for AI answers.

**Markup.**
- schema.org has no LegalCase type (404), and Google has no legal-case rich result.
- Use `Article` JSON-LD with:
  - `about` set to a `CreativeWork` for the decision (name = citation, url = official URL, dateCreated);
  - `citation` = the official URL;
  - `reviewedBy` (`lib/seo.ts:412`);
  - BreadcrumbList.
- FAQPage is optional and only helps answer engines.

**hreflang.** Emit en, fa and x-default only when both rows of a group are published. `buildAlternates` takes the pair from the database.

**Sitemap, RSS, withdrawals.**
- A new sitemap block. No case-studies RSS at first, and cases never go into the blog feed.
- A withdrawn page 301s to its replacement if one exists, otherwise 404.

**Format.** The holding goes in one self-contained sentence near the top. Every claim carries "[para N]". Each page notes if the programme has changed since the decision. Whether SUV permanent residence is still open must be checked against IRCC by fact-checker before publishing; I have not verified it.

## 10. First 5 decisions (verified on decisions.fct-cf.gc.ca, 9 Nov 2026)

| # | Citation | Route | Outcome | Why it matters | Slug | Official URL |
|---|---|---|---|---|---|---|
| 1 | 2025 FC 12 (2 Jan 2025) | SUV work permit, 205(a) | Allowed | Officer said the language test results were missing when they were on file | `start-up-visa-2025-fc-12` | https://decisions.fct-cf.gc.ca/fc-cf/decisions/en/527166/1/document.do |
| 2 | 2025 FC 1599 (29 Sep 2025) | SUV PR, "artificial transaction" IRPR 89(b) | Dismissed | A procedural fairness letter that sets out the concerns was enough; a letter of support doesn't prove the business is genuine | `start-up-visa-2025-fc-1599` | https://decisions.fct-cf.gc.ca/fc-cf/decisions/en/529046/1/document.do |
| 3 | 2026 FC 146 (30 Jan 2026) | SUV work permit with family | Allowed | Travelling with spouse and child cannot by itself decide "will you leave Canada" | `start-up-visa-2026-fc-146` | https://decisions.fct-cf.gc.ca/fc-cf/decisions/en/529828/1/document.do |
| 4 | 2026 FC 158 (4 Feb 2026) | C11 entrepreneur work permit | Dismissed | Doubts that the business could succeed and that the applicant would leave; what a thin C11 plan looks like | `work-permit-c11-2026-fc-158` | https://decisions.fct-cf.gc.ca/fc-cf/decisions/en/529865/1/document.do |
| 5 | 2026 FC 255 (23 Feb 2026) | Study permit 216(1)(b), MBA | Allowed | Officer didn't engage with the study reasons and home ties | `study-permit-2026-fc-255` | https://decisions.fct-cf.gc.ca/fc-cf/decisions/en/529999/1/document.do |

- **Reserves** (verified): 2025 FC 1598 (study permit, allowed), 2026 FC 503 (SUV, essential team member, dismissed), 2025 FC 1742 (start-up founder, dismissed), 2025 FC 1604 (study permit, dismissed).
- **PNP.** No confirmed PNP-linked judicial review yet; it needs its own search.
- **Pin-cites.** The seo-strategist took the paragraph numbers from PDF text. The pipeline and fact-checker re-verify every one.
- **Mix.** Three of five involve Iranian applicants, which fits the /fa audience, but the pages state nationality only where the reasoning turns on it (see decision 6).

## 11. Effort and phasing (estimates)

| Phase | What | Owner | Estimate |
|---|---|---|---|
| 0 | Parser + quote checker + anonymiser + 60-case eval set; `case-study-writer` agent; red-line scanner | head-of-data → llm-engineer | ~4–6 engineer-days + ~8 h labelling (CPO estimate; head-of-data gave no day count) |
| 0 | Spike: can the Federal Court site link to a specific paragraph? | cto → tech-lead | 0.5 day |
| 0 | Counsel review of the [counsel] list + consent form (en/fa) | Farjad (spend) | external |
| 1 | Schemas + migration (1), ingest endpoint (1.5), consent model (1), admin review (2.5), public pages en+fa (2.5), SEO (1.5), QA + deploy (1) | cto | ~11 days (9–14) |
| 1 | First 5 type A cases published (en; fa for at least 3) | pipeline + Farjad review | ~2.5 h Farjad review |
| 2 | App API | cto | 1.5–2.5 days |
| 2 | App screens, spec, 2 ux-auditor gates, QA in 5 locales | head-of-mobile | ~1.5–2 weeks elapsed |
| 2+ | Universal links (with the Stage 6 store build) | head-of-mobile + cto | 1–2 days + store cycle |
| later | Type B live | after counsel + first signed consent | — |

Critical path: phase 0 eval → phase 1 admin gate → first publish. Phase 0 and the phase 1 build can run in parallel; they share only the claim shape fixed in §6 and §7.

## 12. Open decisions for Farjad

1. **Visual direction.** Options in `case-studies-options.html`: A Docket, B Long-read, C Lesson-first. **Recommend A.** It scales from 5 cases to 200, the outcome and the official link stay in view, and it loses nothing on mobile. C's lessons can appear as a link under "In one line".
2. **Neutral citation only, no party names anywhere,** including slugs, titles and JSON-LD. **Recommend yes.** We give up name-based search traffic, and we never rank for a person's name.
3. **Type B launch.** **Recommend:** build the consent model in phase 1 and publish no client case until counsel has reviewed the consent form and the first client has signed it against the final text.
4. **Counsel review before launch** (spend). This is a scoped one-off on 7 items: SI/97-5 vs the Court's commercial notice, PIPEDA s.1(d), the s.91 boundary, defamation/fair comment, GDPR/Law 25, the consent form, the testimonial guidance. **Recommend yes, before the first type A page goes live.** At minimum, the reproduction question before launch and the rest before type B.
5. **Type B shows only the VisaRoads stage** (the evaluating body's approval), and a government outcome only with explicit consent. **Recommend yes.**
6. **Nationality on type A pages.** **Recommend:** omit by default; state it alone only when the holding turns on it.
7. **Socials.** **Recommend:** no auto-share; type A shared manually; type B never on socials or in ads in v1.
8. **Raw client notes.** **Recommend:** file-only intake (never pasted into chat), deleted 7 days after you approve the redacted version.

## 13. Risks and adjacent issues

**Top risks.**
1. **A wrong holding or paragraph number on a published page.** Damages credibility, creates legal exposure and contradicts our "every claim cited" positioning. Mitigations:
   - exact-quote grounding with no fuzzy matching;
   - court-only speaker for holdings;
   - a 100% disposition bar in the eval;
   - the per-claim approval gate enforced by the server;
   - quarterly appeal re-check.
2. **Legal exposure with no RCIC and no counsel yet.** Covers s.91 framing, commercial reproduction terms and testimonial rules. Mitigations: the red-line scanner, fixed disclaimers, type B held back, and counsel review (decision 4).
3. **Client privacy leak.** Possible routes:
   - raw notes pasted into chat;
   - quasi-identifiers surviving into the Persian text;
   - the app cache keeping withdrawn cases.

   Mitigations: file-only intake, deterministic and model checks for personal data in both languages, the re-identification test, and the `withdrawn` ids in the app API.

**Adjacent issues, flagged and not solved here.**
- The server actions in `app/actions/articleActions.ts` have no session check; middleware protects only the admin pages. This is a security finding for `ciso`, outside this scope.
- The news app API never tells the app about deleted items.
- The Persian brand name is spelled both «ویزا رودز» and «ویزارودز» in the repo; pick one.
- The current blog page breaks the token rules: shadows, rounded corners, letter-spaced uppercase, and a bounce-style `pop` animation in the Tailwind config.
- The official decision site returned a 403 to a default client. Whether an identified pipeline fetch works is unverified; the fallback is a manual download.
