# Sanitizer URL scheme bypass (`lib/sanitize.ts`)

Date: 9 Nov 2026 · Branch: `fix/sanitize-url-allowlist` (from `origin/main` bb752b2) · Severity: **High**

## Finding

**Stored XSS on public article pages via control characters in `javascript:` URLs.**

- Evidence: `lib/sanitize.ts:24-32` (pre-fix) checked
  `value.trim().toLowerCase().startsWith('javascript:')`.
- Sink: `app/[locale]/(public)/blog/[slug]/page.tsx:226` runs `sanitizeHtml` and `:410` renders it with
  `dangerouslySetInnerHTML`.
- Sources: admin article actions (`app/actions/articleActions.ts:16,72`), `POST /api/agent-articles`
  (`lib/agent-articles.ts:112`), autopilot LLM output (`lib/articles.ts:92`). The LLM path means a
  prompt injection in a crawled source can get HTML into an article that nobody reviews first.
- Exploit: `<a href="java&#x09;script:alert(document.cookie)">Read more</a>`. Cheerio decodes the entity,
  so the sanitizer sees `java\tscript:…`. That does not start with `javascript:`, so it is kept. The browser's URL
  parser removes ASCII tab/LF/CR anywhere in the URL and C0 controls/space at its ends, reads the scheme as
  `javascript`, and runs the code on click in the visaroads.com origin. `&#x01;javascript:`, `java&#x0A;script:` and
  `java&#x0D;script:` work the same way.
- Impact: script runs in the site origin for every reader who clicks. The admin session is the
  valuable target: an admin who previews or reads a poisoned article can have admin actions run as them.
  Nothing else blocks it because the site sends no CSP (no `Content-Security-Policy` in `next.config.*` or
  `middleware.ts`).
- The sink sanitizes at render time, so the fix also covers HTML already stored in the database. No backfill is needed.

## Root cause

1. A blocklist (`javascript:`, `vbscript:`) applied to the raw string, while the browser normalises the URL before it reads the
   scheme.
2. The URL attribute set was incomplete: `poster`, `background`, `cite`, `data` and `ping` were never checked.
   `srcset` was checked as one string instead of per candidate.

## Fix

`lib/sanitize.ts`:

- New exported `isSafeUrl(value, attr, tag = '')`:
  1. It strips `[\u0000- \u007f-\u009f�]` (all C0 controls, space, DEL, C1, and U+FFFD, which is what the parser turns NUL into)
     from **anywhere** in the value, then lowercases it. This strips more than the browser does, so a value can only look more like a scheme,
     never less. The check fails closed.
  2. It reads the scheme with `/^([a-z][a-z0-9+.-]*):/`. If there is no scheme the URL is relative (path, `#frag`, `?q`, `//host`) and is allowed.
  3. `data:` is allowed only as `data:image/…` in `src`/`srcset` on `img`/`source`.
  4. Otherwise the scheme must be on the allowlist: `http`, `https`, `mailto`, `tel`.
- The URL attribute set is now `href, src, xlink:href, action, formaction, poster, background, cite, data, ping, srcset`.
- `srcset` is split on commas. Each candidate's URL is its first whitespace-separated token, and the whole attribute is dropped
  if any candidate fails.
- The SVG `<use>` external-href check used raw `startsWith('http')`, so `\x01https://…` bypassed it. It is dead code, because
  `use` is in `DISALLOWED_SVG_CHILDREN` and is removed first. It is now a backstop that keeps only `#fragment` refs.
- The exported API of `sanitizeHtml`, `sanitizeForApp` and `extractFaqs` is unchanged.

### Decisions

- **`data:image/svg+xml` is kept in `<img src>`.** An SVG loaded through `<img>` runs in secure static mode: no script and
  no external loads. It only becomes dangerous if the user opens the image in its own tab. Modern browsers block top-level
  navigation to `data:` URLs, and the link to it would itself be a `data:` href, which we drop.
- **Protocol-relative `//host/x` is kept by design.** It resolves to `https://host/x` on an https page, which is the same as
  an off-site https link. It is a phishing and redirect concern, not script execution.
- **Behaviour change:** schemes other than http/https/mailto/tel (`ftp:`, `sms:`, `tg:`, `whatsapp:`, `file:`, `blob:` and others) are now
  dropped. A repo grep of `href|src="scheme:` found only https/http/mailto, plus `javascript:`/`data:` in test fixtures. `data:image/` in a
  `src` on tags other than `img`/`source` (for example `<video src>`) is now dropped.

## Tests

`lib/__tests__/sanitize-url-schemes.test.ts`: 43 tests, all through `sanitizeHtml` except two direct `isSafeUrl` groups.

- Dropped: tab, LF and CR entities; literal `\n`; leading spaces; leading `&#x01;`; DEL plus literal C1; `JaVaScRiPt:`;
  `JaVa\nScRiPt:`; `&#106;avascript:` and a fully entity-encoded scheme; `vbscript:`; `data:text/html` on href and on img src;
  `data:image` on href and on `<video src>`; `file:`; an unknown scheme; one bad srcset candidate among good ones; `data:text/html`
  srcset; `poster`, `background`, `cite`, `ping` and `data` attributes; svg `<a>` href/xlink:href; svg `<use>`.
- NUL: the test pins real cheerio behaviour. `&#x00;` and literal `\u0000` both become U+FFFD. `java�script:` would not run
  in a browser anyway (it is a relative URL), but it is dropped because U+FFFD is stripped before the check.
- Entity note: `&#x85;` is **not** C1 after parsing. HTML maps `&#x80;`–`&#x9F;` through the windows-1252 table (to U+2026), which makes
  the value relative and harmless. The C1 test therefore uses a literal `\u0085`.
- Kept: https, http, a relative path, `guides/a:b`, `#anchor`, `?page=2`, mailto, tel, `//evil.example/x`, `data:image/png` and
  `data:image/svg+xml` img src, a good srcset with x and w descriptors, and a non-URL attribute containing `javascript:`.
- Against the pre-fix `lib/sanitize.ts`, 19 of the 43 tests fail, so the tests catch the bug.
- Results: `npx tsc --noEmit` is clean and `npx vitest run` passes 73 files and 830 tests.

## Residual risks

1. **No CSP** (Medium, hardening). A `script-src` policy without `'unsafe-inline'` would make the next sanitizer bypass a
   non-event. It needs a nonce setup for Next.js inline scripts and JSON-LD, which is separate work.
2. **`style` attributes pass mostly unchecked** (Low/Medium). Only `expression(` and `javascript:` are blocked. Article HTML can
   still use `position:fixed` full-page overlays (phishing UI) and `url(https://…)` beacons. No modern browser runs script from CSS
   `url()`. Suggestion: allowlist CSS properties or drop `style` on public articles.
3. **camelCase SVG children are not stripped** (Low). `$('svg').find('foreignObject, animateMotion, animateTransform')` does not
   match: the parser stores `foreignObject` in camelCase and the selector match fails. Probe:
   `<svg><foreignObject><img src=x onerror=…>` comes out as `<svg><foreignObject><img src="x">`. The global attribute pass still strips
   `on*` and bad URLs inside it, so there is no bypass today, but that layer of the defence does nothing. Fix: filter on
   `tagName.toLowerCase()`. **Fixed in the same PR** (CISO review): SVG children are now matched on the lowercased tag name;
   regression test in `lib/__tests__/sanitize-url-schemes.test.ts`.
4. **The sanitizer is an attribute blocklist, not an allowlist.** New HTML features that take URLs or script in attributes not on
   the list would pass. The longer-term fix is an element and attribute allowlist (DOMPurify via `isomorphic-dompurify`, or
   `sanitize-html`).
5. **Parser differential (mXSS).** The server parses with parse5 via cheerio and the browser re-parses the serialized output.
   Probes with `noscript`, `svg>style`, `template`, `textarea` and `select` produced no executable output, but the probing was not exhaustive.
6. **Off-site and protocol-relative links** stay allowed (by design). LLM-injected phishing links are a content-review issue.
7. Adjacent: `components/admin/marketing/MarketingEditor.tsx:366` renders the `htmlSource` preview with
   `dangerouslySetInnerHTML` and no `sanitizeHtml`. It is admin-only, but it is a self-XSS or pasted-content vector inside the admin
   origin. Flagged only.

## `dangerouslySetInnerHTML` sink inventory (main, 2026-11-09)

| Sink | Source of HTML | Sanitized? | Risk |
|---|---|---|---|
| `app/[locale]/(public)/blog/[slug]/page.tsx:410` | Article content (admin, `/api/agent-articles`, autopilot LLM) | Yes, `sanitizeHtml` at render (`:226`) | Covered by this fix; stored HTML needs no backfill |
| `components/admin/marketing/MarketingEditor.tsx:366` | Campaign email body typed/pasted by admin | **No** | Low: admin-only, self-XSS / pasted HTML in the admin origin. Fix: `sanitizeHtml` the preview, or render it in a sandboxed `<iframe srcdoc>` (keeps email CSS) |
| `app/[locale]/(public)/page.tsx:94` | `t.raw('locations')` from `messages/*.json` | No | None: repo-controlled translation strings |
| `components/JsonLd.tsx:12` | `JSON.stringify(item)` with `<` escaped to `\u003c` | n/a | None |
| `app/not-found.tsx:81`, `app/[locale]/not-found.tsx:85` | Static `<style>` literal | n/a | None |

Other sanitizers: `sanitizeForApp` (`lib/sanitize.ts`, mobile news; keeps only `^https?://` after trim, rendered by the native app, not a browser), `cleanHtml` (`lib/socials.ts`, text only), `escapeHtml` (`lib/blog.ts`), `escapeXml` (both RSS routes). Case Studies has its own `sanitiseCaseHtml` on `feat/case-studies` (PR #96), which wraps `sanitizeHtml` and adds the same allowlist; once both merge, its `isSafeCaseUrl` can be replaced by `isSafeUrl`. No `innerHTML`, `insertAdjacentHTML`, `document.write`, `srcdoc`, `rehype-raw` or `html-react-parser` in app/components/lib.
