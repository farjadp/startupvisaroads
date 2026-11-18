# Store screenshots, v3 (app v4: 68 routes, 17 countries)

Rendered set: `build-v3/` (made 17 Nov 2026 from `main` at b949679).

| Store | Folder | Size | Locales |
|---|---|---|---|
| App Store 6.9" | `build-v3/app-store/screenshots/<locale>/6.9in/` | 1320×2868 JPG | en-US, fr-FR, zh-Hans, ar-SA |
| App Store 6.5" | `build-v3/app-store/screenshots/<locale>/6.5in/` | 1284×2778 JPG | same |
| Google Play phone | `build-v3/play/screenshots/<locale>/` | 1080×1920 PNG | en-US, fa, fr-FR, zh-CN, ar |
| Play feature graphic | `build-v3/play/feature-graphic.png` | 1024×500 PNG | en |

Persian is Play only (no Persian App Store locale). Eight slots, in order: Today, results, route page (Rules tab), countries, Express Entry, assessment, funds, news. Captions and kickers: `screenshots-v3.json`. Frame: `src/screenshot-b.html` (option B, chosen by Farjad 17 Nov 2026: paper and ink slides alternate, the app's own screen name in an acid plate, a phone drawn in CSS). Persian and Arabic set in Vazirmatn.

## Re-render

```
python3 mobile/store/src/render.py <raw-dir> mobile/store/build-v3 mobile/store/screenshots-v3.json
```

`<raw-dir>` holds `ios-<locale>-<slot>.png` (iPhone 17 Pro Max simulator, 1320×2868) and `android-<locale>-<slot>.png` (AVD `visaroads`, Pixel 7, 1080×2400). Raw captures are not committed.

## How the raws were made

Dev builds from this branch, Metro from `mobile/`. Demo data is fictional: the dev-seed `talent` assessment (citizen of India living in Canada), following `nl-startup` and `ca-pnp-nova-scotia`, and Express Entry rows written straight into AsyncStorage (score 398). No real person.

- iOS: `xcrun simctl openurl <udid> 'visaroads://dev-seed?to=…'` per screen; status bar via `simctl status_bar override --time 9:41`. Locale via `dev-seed?locale=xx`.
- Android: the dev-seed screen keeps its first target, so screens are opened with router links (`visaroads:///assess/results`), and the locale is written into `vr.state.v1` in `databases/RKStorage` with `run-as` while the app is stopped. Status bar via System UI demo mode.
- Route slot: `ie-critical-skills`, Rules tab, scrolled so the tabs and the met/close tiles show.
- Check every raw for dev overlays before rendering: Metro's "Refreshing…" banner (Metro restarts when Gradle writes into `mobile/android`), LogBox toasts, and Android "isn't responding" dialogs when the Mac is loaded.

## UX audit (17 Nov 2026)

`ux-auditor`: **PASS WITH FIXES, 17/20.** Fixed before this render: fa slot 05 «لحظه‌ای» instead of «زنده», fr slot 07 "dans votre devise", zh slot 06 "每题可跳过", real DM Serif italic on the feature graphic. Open, none blocking: Android status bar shows Wi-Fi with "!" and iOS battery shows charging (recapture with demo mode `-e fully true` / `--batteryState discharging`); no Persian feature graphic yet; Chinese captions use PingFang SC rather than the Brand Book's Noto SC; Arabic-script display face (Vazirmatn here, Estedad in the Brand Book) is Farjad's call.
