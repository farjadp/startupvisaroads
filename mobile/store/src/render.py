#!/usr/bin/env python3
"""Render VisaRoads store assets from raw device captures.

usage: python3 store/src/render.py <raw-dir> <out-dir>

raw-dir holds ios-<locale>-<screen>.png (1206x2622, iPhone 17 Pro) and
android-<locale>-<screen>.png (1080x1920). Writes, under out-dir:
  app-store/screenshots/<appStoreLocale>/<n>.jpg   1206x2622, RGB
  play/screenshots/<playLocale>/<n>.png            1080x1920, RGB
  play/feature-graphic.png                         1024x500, RGB
  play/icon-512.png, app-store/icon-1024.png
  listing/<locale>/*.txt                           copy-paste fields
Captions and copy come from store/listing.json.
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
SCRIPT = {'en': 'latin', 'fr': 'latin', 'fa': 'arabic', 'ar': 'arabic', 'zh': 'han'}
RTL = {'fa', 'ar'}
DARK_SCREENS = {'07-me'}


def chrome(html: Path, params: dict, w: int, h: int, out: Path) -> None:
    url = html.as_uri() + '?' + urllib.parse.urlencode(params)
    subprocess.run(
        [CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
         '--force-device-scale-factor=1', f'--window-size={w},{h}', '--virtual-time-budget=4000',
         f'--screenshot={out}', url],
        check=True, capture_output=True,
    )
    Image.open(out).convert('RGB').save(out)


def main(raw: Path, out: Path) -> None:
    data = json.loads((MOBILE / 'store/listing.json').read_text())
    screens = data['screens']
    for loc, d in data['locales'].items():
        targets = [('android', 'play/screenshots/' + d['playLocale'], 1080, 1920, 'png')]
        if 'appStoreLocale' in d:
            targets.append(('ios', 'app-store/screenshots/' + d['appStoreLocale'], 1206, 2622, 'jpg'))
        for plat, folder, w, h, ext in targets:
            dest = out / folder
            dest.mkdir(parents=True, exist_ok=True)
            for i, screen in enumerate(screens):
                src = raw / f'{plat}-{loc}-{screen}.png'
                if not src.exists():
                    print('missing', src)
                    continue
                params = {'img': str(src), 'cap': d['captions'][i], 'dir': 'rtl' if loc in RTL else 'ltr', 'lang': loc,
                          'script': SCRIPT[loc], 'dark': '1' if screen in DARK_SCREENS else '0', 'w': w, 'h': h}
                with tempfile.NamedTemporaryFile(suffix='.png') as tmp:
                    chrome(HERE / 'screenshot.html', params, w, h, Path(tmp.name))
                    im = Image.open(tmp.name).convert('RGB')
                    target = dest / f'{i + 1:02d}-{screen[3:]}.{ext}'
                    im.save(target, quality=92) if ext == 'jpg' else im.save(target)
        # copy-paste text
        ldir = out / 'listing' / loc
        ldir.mkdir(parents=True, exist_ok=True)
        for key, name in [('name', 'name'), ('subtitle', 'subtitle'), ('promo', 'promotional-text'), ('short', 'short-description'),
                          ('keywords', 'keywords'), ('description', 'description'), ('releaseNotes', 'release-notes')]:
            if key in d:
                (ldir / f'{name}.txt').write_text(d[key] + '\n')
        print('rendered', loc)

    play = out / 'play'
    shot = raw / 'android-en-03-result.png'
    chrome(HERE / 'feature-graphic.html', {'logo': str(MOBILE / 'assets/brand/logo-night.png'), 'shot': str(shot)}, 1024, 500, play / 'feature-graphic.png')
    Image.open(MOBILE / 'assets/store/play-icon-512.png').convert('RGB').save(play / 'icon-512.png')
    (out / 'app-store').mkdir(parents=True, exist_ok=True)
    Image.open(MOBILE / 'assets/icon.png').convert('RGB').save(out / 'app-store/icon-1024.png')
    print('done')


if __name__ == '__main__':
    main(Path(sys.argv[1]), Path(sys.argv[2]))
