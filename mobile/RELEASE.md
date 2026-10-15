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

`runtimeVersion` uses the `fingerprint` policy. Any native change (a new native package, an `app.json` plugin, icon or permission change, an Expo SDK upgrade) changes the fingerprint. Builds with the old fingerprint ignore updates for the new one. Those changes need a new store build.
