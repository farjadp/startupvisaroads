# Spec — social distribution

**Date:** 6 Sep 2026 · **Path:** architectural · **Status:** awaiting approval

## 1. What is being asked

Every published article should reach:

- **A Telegram channel**, in two forms: the article itself with a few lines of
  framing, a title and a link; and a separate short, punchy post distilled from
  an article's body.
- **LinkedIn** — Farjad's personal profile, the VisaRoads company page and the
  AshaVid company page — Persian articles in Persian, English in English, each
  with its own hashtags and the article link.
- **X** — Farjad's account and AshaVid's, same shape as LinkedIn.

## 2. What already exists

This is the third system today found built, wired and silently inert, so the
gap is much narrower than the request suggests.

`lib/socials.ts` (468 lines) already implements LinkedIn, X (`twitter-api-v2`)
and Facebook posting. It already generates captions **per locale** — Persian
for `fa`, English for `en` — already asks for 5–10 platform-specific hashtags,
already uploads the cover image, and already strips HTML. It is already called
from `lib/articles.ts:108` inside `createArticleFromPayload`, which is the path
the autopilot publishes through, and from the admin article actions. The
`Article` model already carries `sharedToLinkedin`, `sharedToTwitter` and
`sharedToFacebook`.

**And it has never posted anything.** Not one of the eight credentials it reads
is set on Cloud Run or locally. Like the empty Cloud Scheduler and the dead
Telegram token, it reports nothing and does nothing.

So the real work is: Telegram (absent entirely), multiple destinations per
platform (the module assumes one), credentials, and — above all — making
failure visible.

## 3. The X problem, stated plainly

**An X Premium subscription does not grant API access.** Premium is the
consumer product; posting programmatically needs an X Developer account, an
app, and OAuth user tokens per account. Two accounts means two sets of user
tokens. The free developer tier's write allowance is small and the paid tiers
are not cheap; exact figures change often enough that they should be checked
rather than quoted here.

This does not block anything else. Telegram and LinkedIn have no equivalent
obstacle, so X is designed for but sequenced last.

## 4. Decisions taken

From Farjad, 6 Sep 2026:

- **A separate publishing bot** for the channel, not the support bot. Today the
  support bot's token was dead and every lead form was failing; one credential
  should not be able to take down both lead capture and publishing.
- **Auto-post, at the moment the article publishes.** Farjad's call, against
  the recommendation to queue for review. Recorded because it is a real
  exposure: model-written text goes out under his own name with no human in the
  loop. The design therefore carries a per-destination `autoPost` switch, so
  any one destination can be moved to review without redesign.
- **All three LinkedIn destinations** — personal profile, VisaRoads page,
  AshaVid page.
- **The short Telegram post runs on days with no new article**, drawing on
  older pieces, so the channel stays alive without posting twice about the same
  article.

## 5. Design

### 5.1 Destinations as data

The current module hardcodes one destination per platform. Replace with a typed
registry: each destination has an id, a platform, a locale filter (`fa`, `en`
or both), the credential keys it needs, and `autoPost`.

This is what makes "personal profile plus two company pages" a configuration
rather than three code paths, and it is what lets one destination be disabled
without touching the others.

### 5.2 A record per attempt

Three booleans on `Article` cannot express six destinations, and cannot express
"failed, retry tomorrow". A `SocialPost` table — article, destination, status,
posted-at, remote URL, error — replaces them. It also answers the question the
short-post job needs to ask: which articles have not been used recently.

The existing booleans stay, written alongside, until nothing reads them.

### 5.3 Telegram channel, two shapes

**Article post:** cover image, title, three or four lines of framing in the
article's language, and the link. Fires when the article publishes.

**Short post:** a distilled claim from an older article — one idea, no preamble,
with a link. Fires only on a day when nothing was published, picked from
articles not posted about recently.

### 5.4 Failure must be loud

Every system found broken today failed silently. Social posting is the easiest
of all to miss, because nothing on the site changes when it stops.

So: every attempt writes a `SocialPost` row including failures, every failure
logs, and **the daily digest reports social delivery beside the writing
lanes**. A destination that has failed every attempt for a day appears in the
same Telegram message that already reports the lanes.

### 5.5 Order of work

1. Telegram channel — no API obstacle, and it is Farjad's own audience.
2. LinkedIn — three destinations, one credential flow.
3. X — last, because it needs a developer account that does not exist yet.

## 6. Out of scope

Facebook (already coded, no page named) · Instagram · scheduling posts at
"optimal times" · engagement metrics · replying to comments.

## 7. Success criteria

1. A published Persian article appears in the Telegram channel in Persian, with
   a working link, within minutes.
2. An English article reaches LinkedIn in English with English hashtags; a
   Persian one reaches it in Persian with Persian hashtags.
3. A day with no new article still produces one short channel post.
4. A destination whose credential dies shows up in the next daily digest.
5. No article is posted twice to the same destination.

## 8. Open questions

- Channel username, and which locale(s) it carries — Persian only, or both?
- LinkedIn tokens expire in about sixty days. Refresh flow, or a calendar
  reminder and a manual re-paste?
- Should the English lane post to the Persian channel at all?
