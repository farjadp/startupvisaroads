# VisaRoads 1.0.0 — store form answers

Every answer is derived from this app's code and its built artifacts (checked
14 Oct 2026), not copied from GOPLAZA. If the app changes, re-check the
evidence column before re-using an answer.

## Evidence used

| Fact | Evidence |
|---|---|
| Only network call | `src/content/news.ts` fetches `https://visaroads.com/rss.xml` and `/fa/rss.xml`. No user data in the request |
| Everything else leaving the app | Links only: the site, official sources and photo credits open in SFSafariViewController / Custom Tabs (`expo-web-browser`); Telegram opens via `Linking`. Nothing is posted |
| Stored data | On-device only (`AsyncStorage`): answers, steps, badges, language, appearance (`vr.state.v1`) and cached news articles (`vr.news.*`). Me › Settings › Delete my data clears answers, steps and badges; language and appearance are kept, and the cached public articles stay until uninstall. On iOS the chosen language is also written to the app's own `AppleLanguages` setting |
| Accounts | None. No sign-in, no sign-up |
| SDKs | Expo modules only. No analytics, crash, ads or attribution SDK |
| Android permissions | `INTERNET`, `VIBRATE` (template default). Storage and `SYSTEM_ALERT_WINDOW` blocked in `app.json` (`android.blockedPermissions`); `android/` is git-ignored, so EAS prebuilds and the blocks apply. The local `android/` folder predates the block and still lists them until the next `expo prebuild`. Check the production AAB (`bundletool dump manifest`). No `AD_ID` |
| iOS | `ITSAppUsesNonExemptEncryption = false`; no `UIBackgroundModes`; iPhone only (`supportsTablet: false`) |
| Purchases | None. No prices, no buy links. "Book a call" opens the site's booking page (a free consultation), not a purchase |

## App Store Connect

**New App**
- Name: `VisaRoads: Startup Visa Guide` (if taken: `VisaRoads – Founder Routes`)
- Primary language: English (Canada). Persian is not an App Store localisation; Persian readers get the English listing, and the app itself opens in Persian.
- Bundle ID `com.ashavid.visaroads` · SKU `visaroads-ios` · User access: Full

**Localisations to add:** French (`fr-FR`), Chinese Simplified (`zh-Hans`), Arabic (`ar-SA`). The copy for each is in `listing/`.

**App Information**
- Subtitle: from `listing/<locale>/subtitle.txt`
- Category: primary **Business**, secondary **Reference**
- Content rights: the app shows the photographers' credited Pexels photos and VisaRoads' own articles. Answer "Yes, contains third-party content" and confirm you have the rights (Pexels licence).
- Age rating: questionnaire below. Result: **4+**

**Age rating (7 steps)**
1. Features: Unrestricted Web Access **No** (links open specific pages in Safari View Controller; there's no general browser) · User-Generated Content **No** · Social Media **No** · Messaging **No** · Advertising **No**
2. Mature themes: all **None**
3. Medical or wellness: **None**
4. Sexuality or nudity: **None**
5. Violence: **None**
6. Chance-based: all **No**
7. Additional: no override (no account, no minimum age in Terms for the app)

**App Privacy**
- Privacy Policy URL: `https://visaroads.com/en/privacy` — the app section is live at `#mobile-app` (PR #33, verified 15 Oct 2026).
- Data collection: **"No, we do not collect data from this app."** Basis: nothing the user enters leaves the phone. The RSS request carries no personal data. visaroads.com keeps standard Cloud Run access logs (IP); Farjad confirmed on 15 Oct 2026 that they are used only for operations and security and never to identify, track or link visitors, so Apple does not treat them as collection.

**Pricing and availability:** Free · all countries **except China mainland** (needs an ICP filing) · Mac (Apple Silicon) and Vision Pro **off** · Release: **Manual**

**Version page**
- Promotional text, Description, Keywords: `listing/<locale>/`
- Support URL: `https://visaroads.com/en/contact` · Marketing URL: `https://visaroads.com`
- Copyright: `2026 Ashavid Inc.` (legal entity confirmed by Farjad, 15 Oct 2026)
- Screenshots: `app-store/screenshots/<locale>/` — 1206×2622, the 6.3" iPhone slot. No iPad.

**App Review Information**
- Sign-in required: **No**
- Notes:

```
VisaRoads is an information app for founders comparing startup-visa and entrepreneur immigration routes. There is no account and no sign-in; every feature works without one.

What to try: Roads › Start the pathfinder (seven questions) shows the closest route with its published rules as met / close / not yet, the conditions it cannot score, and the official source with the date it was checked. Tools has Canada's settlement funds and a route check. News lists articles from visaroads.com.

Languages: Me › Settings › Language. Persian and Arabic are right-to-left; switching direction restarts the app once, by design.

The app collects no data: answers and progress stay on the device and can be deleted in Me › Settings › Delete my data.

VisaRoads (Ashavid Inc.) gives business preparation, not legal or immigration advice, and is not affiliated with any government. Every figure links to its official government source.
```

## Google Play Console

**Create app:** name `listing/en/name.txt` · default language **English (United States)** (Persian `fa` is added as a translation) · App · Free

**Store listing:** for each of en-US, fa, fr-FR, zh-CN and ar: name, short description and full description from `listing/<locale>/`, plus:
- App icon: `play/icon-512.png`
- Feature graphic: `play/feature-graphic.png` (1024×500)
- Phone screenshots: `play/screenshots/<locale>/` (1080×1920, 7 each)

**Store settings:** category **Business** · contact email `farjad@visaroads.com` · website `https://visaroads.com`

**App content**
| Form | Answer |
|---|---|
| Privacy policy | `https://visaroads.com/en/privacy`, once it names the app (see above) |
| Ads | **No** |
| Advertising ID | **No** (no `AD_ID` permission, no ad or analytics SDK) |
| Sign in details | **All functionality is available without special access** |
| Target audience | **18 and over** (founders planning immigration). Keeps the app out of Families |
| News app | **No**. The News tab is the publisher's own guides; the app's purpose is route preparation, and it isn't a news aggregator |
| Government app | **No** (not affiliated with any government; the description says so) |
| Financial features | **None** |
| Health | **None** |

**Content rating (IARC):** category "All other app types" · downloaded ratings content No · users interact or exchange content **No** · online content **Yes** (articles from visaroads.com) · violence, sexuality, language None · controlled substances **No** · age-restricted products No · location sharing No · digital purchases No · web browser/search engine **No** · primarily news or educational: **No** (it's a planning tool). Expected: **Everyone / PEGI 3**.

**Data safety**
- Does the app collect or share any of the required user data types? **No**
- Is all user data encrypted in transit? **Yes** (the only request is HTTPS)
- Account creation: **None**
- Data deletion: there's no account. Answers and progress are deleted in Me › Settings › Delete my data; uninstalling removes everything.

**Release:** first upload is manual (AAB from EAS). Release name `1.0.0 (1)`. Release notes for each language from `listing/<locale>/release-notes.txt`, inside its language tag.

## Before submitting — owed

1. A native review of the fr, zh and ar copy, both store listings and in-app.
2. Production builds on EAS (you run them): `eas build -p ios --profile production` and `eas build -p android --profile production`.
