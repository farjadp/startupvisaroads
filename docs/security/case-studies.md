# Security review: Case Studies (feat/case-studies)

Date: 9 Nov 2026. Scope: `git diff c16186f..HEAD -- app lib components scripts .claude` (86c5b23). This was a static review plus local unit probes. Nothing was run against prod.

Counts: Critical 0, High 1 (fixed), Medium 1, Low 4, Info 5. One adjacent High sits outside scope and is flagged only.

## Findings

### H1. Stored XSS in the admin review preview through control characters in URL schemes (FIXED, a0ec181)
- Evidence: `lib/sanitize.ts:24-31`. `isSafeUrl` runs `trim().toLowerCase().startsWith('javascript:')` on the value after entity decoding. `lib/case-studies/payload.ts` (`sanitiseCaseHtml`) relied on it. The result is rendered with `dangerouslySetInnerHTML` at `app/[locale]/(admin)/admin/case-studies/_components/CaseReview.tsx:286`.
- Reproduced locally: `sanitiseCaseHtml('<a href="java&#x09;script:alert(1)">')` kept the href. So did `&#x0A;` and a leading `&#x01;`. Browsers drop ASCII tab/newline anywhere in a URL, and C0 controls at its ends, before they read the scheme (WHATWG URL parser). Each of these runs as `javascript:`.
- Exploit: whoever holds `AGENT_REPORTS_TOKEN` posts a case. So can a pipeline whose LLM output was steered by the decision text. The case contains a link like that. When Farjad clicks it in the review preview, it runs in the admin origin. From there it can call `/api/admin/case-studies/**`: tick claims, approve, flip `courtPagesClearedByCounsel`, publish.
- Impact: the agent token becomes admin. The review gate stops working.
- Fix: in `sanitiseCaseHtml`, strip `[\u0000- \u007f-\u009f]` and then apply a scheme allowlist: relative URLs, http, https, mailto, and `data:image/` only in `img src`. It also drops `srcset`. Regression test: `lib/case-studies/__tests__/sanitise-url-schemes.test.ts`.
- Follow-up: rows ingested before a0ec181 are not re-sanitised. Repost them, or sanitise on read in `GET /api/admin/case-studies/[id]`.

### Adjacent High, out of scope and not fixed: the same bypass on public article pages
`lib/sanitize.ts:24-31` has the same weakness, and every Article body goes through it. Those bodies come from admin server actions and `/api/agent-articles` and are rendered publicly with `dangerouslySetInnerHTML`. That makes it a click-to-run stored XSS on visaroads.com. Fix `isSafeUrl` the same way: strip control characters and whitespace, then use a scheme allowlist. Owner: cto.

### M1. Turning a publishing switch off does not unpublish — FIXED in 6f3617a
- Status: fixed. Every public read (`listPublished`, `getPublished`, `getPair`, `countPublished`, `listForSitemap`, `findRedirectTarget`) filters on `type in [types whose switch is ON]`, read once per request via React `cache`, failing closed. Rows keep their status, so switching back ON restores the pages. Samples stay hidden in production. In dev, sample FC pages now 404 unless the counsel switch is ON. Tests: `lib/case-studies/__tests__/security-fixes.test.ts`.
- Evidence: `lib/case-studies/public.ts:94-101`. `publishedWhere` filters on status, `publishedAt` and `withdrawnAt` only. The switches (`lib/case-studies/settings.ts`) are checked only at publish and release (`workflow.ts:105-110`).
- Exploit/impact: counsel withdraws clearance, and Farjad sets `courtPagesClearedByCounsel` to false. Every FC_DECISION page that is already published stays live and stays in the sitemap. The same applies to CLIENT_CASE pages with `clientCasesEnabled`. Spec §12a treats the switch as the legal kill switch.
- Fix: make `publishedWhere` async, or pass settings into it, and add `type: { in: [...enabled types] }`. The same change covers `listForSitemap` and `findRedirectTarget`. Alternatively, have a switch-off withdraw the affected rows in a transaction.

### L1. Admin JSON handlers accept any Content-Type — FIXED in fa9088d
- Status: fixed. `readJsonObject` returns 415 unless the Content-Type is `application/json`, and 403 when an `Origin` header names a host other than the request's (`x-forwarded-host`, else `Host`). GET is untouched. The admin fetch helper already sends `Content-Type: application/json` with every body.
- Evidence: `lib/case-studies/admin-http.ts:19-28` (`readJsonObject` uses `req.text()`).
- Exploit: a `text/plain` form can carry a JSON body. `admin_session` is `SameSite=Lax` (`app/api/admin/login/route.ts:58-61`), so a cross-site POST arrives without the cookie. Only a same-site origin can do this, for example any subdomain of visaroads.com.
- Fix: return 415 unless the Content-Type is `application/json`, and check `Origin` against `SITE_URL` on PUT, POST and PATCH.

### L2. Unbounded same-host redirect recursion in the fetcher
- Evidence: `scripts/case-studies/fetch.ts:66-71`.
- Impact: a redirect loop on the Court's site keeps the local script running forever, at one request per 5 s. Every hop is checked against the host allowlist, so this is not SSRF.
- Fix: add a `hops` parameter and stop after 5.

### L3. `assertOutsideRepo` uses cwd and ignores symlinks
- Evidence: `scripts/case-studies/lib/paths.ts:36-41`.
- Exploit: the check misses in two cases. One is running from a subdirectory or another checkout. The other is a `CASE_STUDIES_DIR` that is a symlink into the repo. In both cases full decision texts can land in the tree, and a broad `git add` would commit them.
- Fix: compare `realpathSync(dir)` against `realpathSync(git rev-parse --show-toplevel)`. Also add a `.gitignore` guard for `raw.html`, `raw.pdf` and `raw.md`.

### L4. Publish/release reads the settings outside the conditional update — FIXED in 43e36ac
- Status: fixed. Publish and scheduled release re-read the switches (and, for release, the consent) inside a Serializable interactive `$transaction` together with the conditional `updateMany`. On Postgres a concurrent switch write can make the transaction fail with a serialization error, which surfaces as a 500 on publish or an error on that cron run. Retrying is safe.
- Evidence: `workflow.ts:299-302` and `:369-382`.
- Impact: a switch-off made in the milliseconds between the settings read and the `updateMany` does not stop that one publish. This is a TOCTOU race with a narrow window.
- Fix: run the read and the update in one `$transaction`. M1's read-time filter also covers this.

## Info
- I1: `scripts/case-studies/lib/anthropic.ts:17`. `ANTHROPIC_BASE_URL` can send `ANTHROPIC_API_KEY` to any host. This is local env only. Pin it to https and log the host when it is overridden.
- I2: `issues` and `lessons` are stored as `unknown[]` (`payload.ts:248-249`). They are safe today: the public `buildLessons` passes hrefs through `safeHref` (internal or https only), and React 19 blocks `javascript:` hrefs. Validate their shape at ingest anyway.
- I3: `reopen` (`workflow.ts:305-311`) keeps the claim ticks. A reopened case can be re-approved without re-ticking. This is acceptable because the content cannot change without a repost, and a repost resets every tick.
- I4: middleware is `middleware.ts`. Next 16 deprecates the name in favour of `proxy.ts`, and the old name still runs. The admin path regex covers `/(en|fa)/admin/case-studies`. Migrate before the old name is removed.
- I5: two long strings (300+ characters) are in `scripts/case-studies/eval/cases/adversarial.json`. They are synthetic over-length fixtures. The real-decision labels (`fc-real.json`) hold one short holding quote per case. The party name in `trace.json` is invented. No judge names or full texts are committed.

## Checklist
- Authn, agent: `app/api/agent-case-studies/route.ts:23-28` mirrors `agent-articles` exactly (Bearer plus `safeCompare`, falling back to `authorisedCron`), on both POST and GET. Pass.
- Authn, admin: all 7 handlers under `app/api/admin/case-studies/**` call `adminUser` before reading the body. Pass. Admin pages sit behind `middleware.ts:38`. Pass.
- Server actions: the diff adds no `"use server"`. The edits to existing actions only add `requireAdmin()`. Pass.
- Gate: approval needs every claim `verified === true`, para refs on FC claims, zero red-line hits, citation, URL and outcome for FC, and a live consent for CLIENT_CASE (`workflow.ts:47-80`). Pass.
- The poster cannot set `verified` (`payload.ts:133`, `workflow.ts:186`). Pass.
- Publish, schedule and release require the switches and re-run the whole gate. The cron uses mode `release` (`workflow.ts:361-386`). Pass.
- Conditional updates on status and `updatedAt` for approve, publish, schedule and claim ticks. Pass.
- Ingest can only replace DRAFT/IN_REVIEW, and does so conditionally (`workflow.ts:208-215`). Pass.
- Consent revoke withdraws linked cases in one transaction. Pass.
- Settings PUT has a key allowlist and accepts only strict booleans. Pass.
- Input validation: hand-written and strict, with unknown keys rejected and size caps (400 KB body). Pass.
- `officialUrl`: requires `https:` and an exact hostname `decisions.fct-cf.gc.ca`, so no lookalikes or `javascript:` (`payload.ts:155-167`). Pass.
- XSS: H1 is fixed. The public pages do not render `content`.
- JSON-LD: `components/JsonLd.tsx` escapes `<` as `<`, so a `</script>` breakout is not possible. Pass.
- Privacy: `PAGE_SELECT` and `LIST_SELECT` are whitelists that exclude `judge`, `consentRecordId` and `content`. JSON-LD takes fields through `jsonLdInputFrom`. The sitemap selects locale, slug, groupKey and updatedAt only. `documentUri` shows up only in admin handlers. Pass.
- Sample rows: excluded in production (`public.ts:90-100`) and noindex elsewhere. Pass.
- Pipeline fetch: host allowlist on every redirect hop, `redirect: 'manual'`, https only, no port or userinfo. The UA identifies itself and browser-like UAs are refused. The API key comes only from env and is never logged. Pass (L2 and L3 aside).
- Raw material lives under `~/VisaRoads-private` by default, outside the repo. `git ls-files` shows no raw files. Pass (L3).
- Cookies: `admin_session` is HttpOnly, Secure in prod, SameSite=Lax. Pass.
- Error leakage: handlers return generic 500s and send details to the server log. Pass.
- Rate limiting: not applicable. Every new POST requires a token or a session.
- Prisma raw queries: none in the diff. Pass.
- File uploads, CORS and redirects: none added. `permanentRedirect` targets come from the DB (locale and slug). Pass.

## Dependencies
`package.json` and `package-lock.json` are unchanged against c16186f. I did not run `npm audit` for this review, because there is no dependency change.

## Secret scan
I did not run a full scan. The diff reads `AGENT_REPORTS_TOKEN` and `ANTHROPIC_API_KEY` from env only, and no literals were seen in the files I reviewed.
