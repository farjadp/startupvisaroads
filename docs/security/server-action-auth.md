# Server action authorisation, click-tracker redirect, unsubscribe token

Branch `fix/server-action-auth`, 9 Nov 2026. Static review plus local unit tests; nothing was run against production.

## The problem

Next.js treats every exported `'use server'` function as a public POST endpoint. Anyone holding the action ID (it ships in the `_next` client bundle) can call it from any path with a `Next-Action` header. A check at page level does not cover the action. ("A page-level authentication check does not extend to the Server Actions defined within it. Always re-verify inside the action." Source: https://nextjs.org/docs/app/guides/data-security, updated 2026-10-06.) `middleware.ts` guards admin *pages* only, so these actions had no protection:

- **Critical.** `app/actions/articleActions.ts`: `createArticle`, `updateArticle` and `deleteArticle` had no auth check. An anonymous caller could publish, deface or delete any article. Publishing also fires `shareToSocials`, which posts to X, LinkedIn, Facebook and Telegram under the brand.
- **Critical.** `app/actions/settingActions.ts` `saveSettings` let anyone overwrite the social API credentials stored in the DB, i.e. hijack or break the brand's social posting.
- **High.** `app/actions/aiActions.ts`: anyone could fill or wipe the AI-writer queue, and the queue feeds the paid generation cron.

## Inventory

| File | Export | Mutates | Caller | Auth before → after |
|---|---|---|---|---|
| app/actions/articleActions.ts | createArticle | DB write, social posts | admin ArticleForm | none → `requireAdmin()` (throws) |
| app/actions/articleActions.ts | updateArticle | DB write, social posts | admin ArticleForm | none → `requireAdmin()` (throws) |
| app/actions/articleActions.ts | deleteArticle | DB delete | admin articles list | none → `requireAdmin()` (throws) |
| app/actions/aiActions.ts | addAiKeywords | DB write (AI queue, paid generation) | admin AiWriterUI | none → `requireAdmin()` (throws) |
| app/actions/aiActions.ts | clearCompletedKeywords | DB delete | admin AiWriterUI | none → `requireAdmin()` (throws) |
| app/actions/aiActions.ts | importKeywordStrategy | DB write | admin AiWriterUI | none → `requireAdmin()`, returns `{success:false,error:'Unauthorized'}` |
| app/actions/settingActions.ts | saveSettings | DB write (social API credentials) | admin SettingsForm | none → `requireAdmin()`, returns `{success:false,error:'Unauthorized'}` |
| app/actions.ts | sendTelegramNotification | Telegram message, OpenAI Ads lead event | public PNPStrategicAssessment | public, stays public |
| app/[locale]/(public)/contact/actions.ts | sendContactForm | Telegram, lead event | public contact form | public, stays public |
| app/[locale]/(public)/webinar/actions.ts | registerWebinar | Telegram, calendar webhook, lead event | public webinar form | public, rate limited, stays public |
| app/[locale]/(public)/startupworkpermit/actions.ts | submitStartupRecoveryForm | Telegram text and file upload, lead event | public recovery form | public, stays public |
| app/[locale]/(public)/which-path/actions.ts | sendWhichPathLead | Telegram, lead event | public quiz | public, stays public |
| app/[locale]/(public)/usa/assessment/actions.ts | sendUsaAssessment | Telegram, lead event | public assessment | public, stays public |

`app/[locale]/(public)/which-path/en-copy.ts` is not a server module. The grep hit is a comment (line 21) saying the file has no directive. I re-grepped app/, lib/ and components/ for indented, inline `'use server'` and found none.

## What changed

- `lib/admin-guard.ts`: `requireAdmin()` reads the `admin_session` cookie through `next/headers` and checks it with the same `verifyJWT(token, getJwtSecret())` call and `username` check as `middleware.ts`. It fails closed. A missing cookie, a bad or expired token, a missing or weak `JWT_SECRET`, a missing or non-string `username`, or any error all throw `UnauthorizedError`.
- Each of the seven admin actions calls the guard before any other work. The UI contracts still hold:
  - `importKeywordStrategy` and `saveSettings` still return `{success, error}`.
  - The other five throw. `createArticle` already threw on bad input.
  - A logged-in admin sees no change.
- 4a, open redirect, fixed. `app/api/marketing/track/click/route.ts` used to redirect to any `?url=`. It now redirects only to visaroads.com, its subdomains, the `SITE_URL` host, or a URL with a valid `sig`. Anything else goes to the site home page and is not recorded. Relative paths now resolve against `SITE_URL` rather than `req.url`, which carries Cloud Run's internal host. Campaign links to outside sites (canada.ca and others) keep working because the sender now signs every link it rewrites (`trackifyHtml`).
- 4b, unauthenticated unsubscribe, fixed. `/api/unsubscribe` now requires `token = HMAC(normalised email)` and returns 403 without one. It no longer returns `deletedCount`, which used to reveal whether an address was on the list. Contacts are still hard-deleted, because the schema has no "unsubscribed" field and this branch adds no migration. The sender (`app/api/marketing/campaigns/[id]/send/route.ts`, both test and bulk sends) adds the token through `buildUnsubscribeUrl`. It refuses to send at all when no signing key is configured, so no email goes out with a dead unsubscribe link. The unsubscribe page passes the token through and locks the email field when a token is present.
- `lib/signed-links.ts` holds the HMAC helpers. Each use has its own label (`visaroads:<purpose>:v1:`), so a value signed for one purpose never verifies for another. The key is `LINK_SIGNING_SECRET`, falling back to `JWT_SECRET`. The new variable is documented in `.env.example`.

## Tests

- `lib/__tests__/admin-guard.test.ts` (8 tests): missing cookie, malformed token, wrong-secret token, expired token, missing `JWT_SECRET`, weak `JWT_SECRET`, payload with no, empty or numeric `username`, and a valid token.
- `lib/__tests__/admin-actions-auth.test.ts` (28 tests): every admin action × {no cookie, invalid token, token signed with another secret} is rejected and no Prisma mock is called. Each action also passes with a valid session. With the guard reverted in `articleActions.ts`, 9 of these tests fail, so they do catch the hole.
- `lib/__tests__/signed-links.test.ts` (25 tests):
  - redirect allowlist: allowed and refused targets, including `//evil`, `/\evil`, a look-alike suffix domain, and `javascript:` and `data:` URLs
  - signed external URLs, plus redirect and recording behaviour at the route level
  - the token is bound to the email, separated by purpose, and fails closed with no secret
  - route level: 403 without a token or with another address's token, 200 with a valid one and no count leak
- `npx tsc --noEmit`: clean. `npx vitest run`: 71 files, 773 tests, all passing (baseline before this branch: 68 files, 712 tests).

## Remaining risks and follow-ups (ranked)

1. **High, deploy note.** Unsubscribe links in campaigns sent before this deploy have no token, so they now get a 403 telling the reader to contact us. CASL requires unsubscribe to keep working for 60 days after a send. **Decision for Farjad.** Either honour these by hand through support for 60 days, or, if no campaigns have gone out in the last 60 days, nothing needs doing. Rotating `JWT_SECRET` (or `LINK_SIGNING_SECRET`) also invalidates every link already sent. If `JWT_SECRET` might be rotated, set a separate `LINK_SIGNING_SECRET` on Cloud Run.
2. **Medium.** The public lead actions have no rate limiting except `registerWebinar`. That covers `sendTelegramNotification` (app/actions.ts:5), `sendContactForm` (contact/actions.ts:5), `submitStartupRecoveryForm` (startupworkpermit/actions.ts:5), `sendWhichPathLead` (which-path/actions.ts:19) and `sendUsaAssessment` (usa/assessment/actions.ts:15). Each one sends a Telegram message and an OpenAI Ads `reportLead` conversion, so a script can flood the admin chat and pollute ad conversion data.
3. **Medium.** `sendTelegramNotification` (app/actions.ts:5-30) takes `formData: any` with no length limits or validation. The recovery form (startupworkpermit/actions.ts:14-27) has no limits on field length and no type or size check on the uploaded file before it is forwarded to Telegram; only Next's default 1 MB body limit for server actions applies. The other public actions truncate their fields.
4. **Low.** `app/api/marketing/track/open/route.ts:4` lets anyone who knows a `logId` inflate open counts (logIds appear in every email). The click route has the same issue for allowed targets. This is analytics integrity only.
5. **Low.** The middleware matcher excludes `/api`, so each admin API route must check auth itself. I spot-checked: every route under `app/api` either checks auth, is a cron behind `authorisedCron`, or is intentionally public (`track`, `app/*`, `marketing/track/*`, `unsubscribe`, `admin/logout`). Any new admin route needs an explicit check. `requireAdmin()` works there too.
6. **Low, hardening.** Mark `lib/admin-guard.ts` and the action files `import 'server-only'`. Next 16 renames `middleware.ts` to `proxy.ts`; plan the migration.
