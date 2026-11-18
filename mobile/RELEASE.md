# Releasing VisaRoads

EAS project: `@ashavid/visaroads` (https://expo.dev/accounts/ashavid/projects/visaroads). Run every command from `mobile/`.

## Store builds

```bash
eas build -p ios --profile production
eas build -p android --profile production
```

- Build numbers are kept by EAS (`appVersionSource: remote`, `autoIncrement`). Change `version` in `app.json` only for a new store version.
- Production builds listen on the `production` update channel; `preview` builds (internal distribution, Android APK) listen on `preview`.
- Upload: `eas submit -p ios` / `eas submit -p android`. The first Android upload must be manual in Play Console.

## Over-the-air updates (figures and copy)

A change to JavaScript, copy or figures, including the site's `lib/` modules the app imports, can ship without store review:

```bash
eas update --channel production --environment production --message "IRCC settlement funds 2027"
```

Try it on a preview build first with `--channel preview --environment preview`.

Phones download the update in the background on launch and use it from the next cold start, so launch time and the splash do not change and the app opens offline on the version it already has. The app never reloads on its own while someone is using it. The one exception is chosen by the user: switching language between left-to-right and right-to-left restarts the app, and that restart picks up an update already downloaded.

If an update crashes on launch, `expo-updates` falls back to the previous working version on that phone. To take a bad update back for everyone, run the command below and pick the bad update group; EAS republishes the one before it (or the version built into the app):

```bash
eas update:rollback
```

## When an update is not enough

**`eas.json` and `app.json` are part of the fingerprint.** Any edit to them, even the submit profile, changes the runtime version, so updates stop reaching the builds already on phones. Change them only when a new store build follows. (On 15 Oct 2026 adding `ascAppId` to the submit profile cut builds 1.0.0 (3)/(4) off from updates; it was reverted. Re-add it with the next native build.)

`runtimeVersion` uses the `fingerprint` policy. Any native change (a new native package, an `app.json` plugin, icon or permission change, an Expo SDK upgrade) changes the fingerprint. Builds with the old fingerprint ignore updates for the new one. Those changes need a new store build.

## Store versions and the runtime (checked 17 Nov 2026)

Measured from a fresh `npm ci` at main `b949679` (same app code as `0877184`):

| Change | iOS runtime | Android runtime |
|---|---|---|
| none (1.0.0, builds iOS 8 / Android 11) | `99a8c4c3` | `38452566` |
| `version` 1.0.0 → 1.0.1 in `app.json` | `7cf56aa4` | `c525597e` |
| `ascAppId` in the submit profile | `5166d86d` | `a21e9ed9` |

So a new store version (`version` bump) always starts a new runtime on both platforms. After it, builds on 1.0.0 only get updates published from a checkout whose `app.json` still says 1.0.0. Until most phones are on the new version, publish each OTA twice: once from main, once from a clean worktree of main with `version` set back to the old value. Verify each with `npx expo-updates fingerprint:generate --platform <p>` before publishing.

What can change without a build:
- Google Play: every store-listing field and graphic, any time.
- App Store: only the promotional text (170 characters). Description, What's New, keywords and screenshots belong to an App Store version, and a new version needs a new build with a higher `version`.
