#!/usr/bin/env python3
"""Render VisaRoads store assets from raw device captures.

usage: python3 store/src/render.py <raw-dir> <out-dir> [screens.json]

screens.json defaults to store/screenshots-v3.json (screens, captions,
kickers, feature-graphic text). raw-dir holds ios-<locale>-<screen>.png
(1320x2868, iPhone 17 Pro Max) and android-<locale>-<screen>.png (Pixel 7,
1080x2400). Writes, under out-dir:
  app-store/screenshots/<appStoreLocale>/6.9in/<n>.jpg   1320x2868, RGB
  app-store/screenshots/<appStoreLocale>/6.5in/<n>.jpg   1284x2778, RGB
  play/screenshots/<playLocale>/<n>.png                  1080x1920, RGB
  play/feature-graphic.png                               1024x500, RGB
  play/icon-512.png, app-store/icon-1024.png
  listing/<locale>/*.txt                                 copy-paste fields, if the json has them
Frame: screenshot-b.html (option B, chosen 17 Nov 2026): paper and ink
slides alternate, the app's own screen name as the kicker.
"""
import json
import subprocess
import sys
import tempfile
import urllib.parse
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
MOBILE = HERE.parent.parent
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
FRAME = HERE / 'screenshot-b.html'
SCRIPT = {'en': 'latin', 'fr': 'latin', 'fa': 'arabic', 'ar': 'arabic', 'zh': 'han'}
RTL = {'fa', 'ar'}
DARK_SCREENS: set[str] = set()
IOS_SIZES = [('6.9in', 1320, 2868), ('6.5in', 1284, 2778)]
PLAY_SIZE = (1080, 1920)
FEATURE_SHOT = 'android-en-04-countries.png'


def chrome(html: Path, params: dict, w: int, h: int, out: Path) -> None:
    url = html.as_uri() + '?' + urllib.parse.urlencode(params)
    subprocess.run(
        [CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
         '--force-device-scale-factor=1', f'--window-size={w},{h}', '--virtual-time-budget=4000',
         f'--screenshot={out}', url],
        check=True, capture_output=True,
    )
    Image.open(out).convert('RGB').save(out)


def frame(src: Path, loc: str, d: dict, i: int, screen: str, w: int, h: int, target: Path) -> None:
    params = {'img': str(src), 'cap': d['captions'][i], 'kicker': d.get('kickers', [''] * 99)[i],
              'dir': 'rtl' if loc in RTL else 'ltr', 'lang': loc, 'script': SCRIPT[loc],
              'dark': '1' if screen in DARK_SCREENS else '0', 'tone': 'paper' if i % 2 == 0 else 'ink', 'w': w, 'h': h}
    with tempfile.NamedTemporaryFile(suffix='.png') as tmp:
        chrome(FRAME, params, w, h, Path(tmp.name))
        im = Image.open(tmp.name).convert('RGB')
        target.parent.mkdir(parents=True, exist_ok=True)
        im.save(target, quality=92) if target.suffix == '.jpg' else im.save(target)


def main(raw: Path, out: Path, listing: Path = MOBILE / 'store/screenshots-v3.json') -> None:
    data = json.loads(listing.read_text())
    screens = data['screens']
    for loc, d in data['locales'].items():
        for i, screen in enumerate(screens):
            name = f'{i + 1:02d}-{screen[3:]}'
            src = raw / f'android-{loc}-{screen}.png'
            if src.exists():
                frame(src, loc, d, i, screen, *PLAY_SIZE, out / 'play/screenshots' / d['playLocale'] / f'{name}.png')
            else:
                print('missing', src)
            if 'appStoreLocale' in d:
                src = raw / f'ios-{loc}-{screen}.png'
                if not src.exists():
                    print('missing', src)
                    continue
                for size, w, h in IOS_SIZES:
                    frame(src, loc, d, i, screen, w, h, out / 'app-store/screenshots' / d['appStoreLocale'] / size / f'{name}.jpg')
        # copy-paste text, when the json carries it
        fields = [('name', 'name'), ('subtitle', 'subtitle'), ('promo', 'promotional-text'), ('short', 'short-description'),
                  ('keywords', 'keywords'), ('description', 'description'), ('releaseNotes', 'release-notes')]
        if any(k in d for k, _ in fields):
            ldir = out / 'listing' / loc
            ldir.mkdir(parents=True, exist_ok=True)
            for key, fname in fields:
                if key in d:
                    (ldir / f'{fname}.txt').write_text(d[key] + '\n')
        print('rendered', loc)

    play = out / 'play'
    play.mkdir(parents=True, exist_ok=True)
    shot = raw / FEATURE_SHOT
    if shot.exists():
        fg = data.get('featureGraphic', {})
        chrome(HERE / 'feature-graphic.html', {'logo': str(MOBILE / 'assets/brand/logo-night.png'), 'shot': str(shot),
                                               'h1': fg.get('h1', ''), 'h1em': fg.get('h1em', ''), 'tag': fg.get('tagline', '')},
               1024, 500, play / 'feature-graphic.png')
    else:
        print('no feature graphic: missing', shot)
    Image.open(MOBILE / 'assets/store/play-icon-512.png').convert('RGB').save(play / 'icon-512.png')
    (out / 'app-store').mkdir(parents=True, exist_ok=True)
    Image.open(MOBILE / 'assets/icon.png').convert('RGB').save(out / 'app-store/icon-1024.png')
    print('done')


if __name__ == '__main__':
    main(Path(sys.argv[1]), Path(sys.argv[2]), *(Path(a) for a in sys.argv[3:4]))
