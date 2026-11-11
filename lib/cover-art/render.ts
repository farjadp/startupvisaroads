// ============================================================================
// lib/cover-art/render.ts
// Draws an article cover in code: the country's colour edge to edge, the
// country's name huge and faint behind, and the headline on a paper card with the site's hard offset shadow. The
// real flag sits small at the head of the card. No image model is involved,
// so a cover is never off-subject, never off-brand, and costs nothing.
//
// Why sharp and not next/og: Satori cannot shape Persian (letters come out
// unjoined) and has no bidi. sharp's text input is Pango + HarfBuzz + FriBidi,
// which joins Persian, honours the half-space (ZWNJ) and wraps right to left.
//
// Fonts: Pango finds them through fontconfig, pointed at assets/covers/fonts
// by FONTCONFIG_FILE (set here before sharp loads, and in the Dockerfile).
// On macOS sharp's Pango does not consult fontconfig, so a local render falls
// back to system faces; the layout is still right, the faces are not. Preview
// real covers with `scripts/render-cover-samples.ts` inside node:20-alpine.
// ============================================================================
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import type { CoverCountry } from './countries';

type SharpFn = (typeof import('sharp'))['default'];
type Img = { data: Buffer; width: number; height: number };

export const COVER_WIDTH = 1600;
export const COVER_HEIGHT = 900;

const ASSETS = path.join(process.cwd(), 'assets', 'covers');

const C = {
  paper: '#F2F0E9',
  ink: '#1A1A1A',
  acid: '#CCFF00',
  night: '#121417',
  muted: '#666562',
};

export type CoverSpec = {
  title: string;
  locale: 'en' | 'fa';
  /** The eyebrow beside the flag, already in the cover's language ("Canada · Business"). */
  label: string;
  /** Already formatted in the cover's language ("Nov 2026", "آبان ۱۴۰۵"). */
  date: string;
  country: CoverCountry | null;
};

let sharpPromise: Promise<SharpFn> | null = null;
function loadSharp(): Promise<SharpFn> {
  // Must be set before fontconfig initialises, i.e. before the first text render.
  process.env.FONTCONFIG_FILE ??= path.join(ASSETS, 'fonts.conf');
  sharpPromise ??= import('sharp').then((m) => ((m as unknown as { default?: SharpFn }).default ?? (m as unknown as SharpFn)));
  return sharpPromise;
}

/** Pango markup is XML: a headline with "&" or "<" must not break the render. */
export function escapeMarkup(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

type TextOpts = { colour: string; alpha?: number; tracking?: number; width?: number; align?: 'left' | 'right' };

async function text(sharp: SharpFn, s: string, font: string, o: TextOpts): Promise<Img> {
  const attrs = [`foreground="${o.colour}"`];
  if (o.alpha !== undefined) attrs.push(`fgalpha="${Math.round(o.alpha * 100)}%"`);
  if (o.tracking) attrs.push(`letter_spacing="${o.tracking}"`);
  const { data, info } = await sharp({
    text: {
      text: `<span ${attrs.join(' ')}>${escapeMarkup(s)}</span>`,
      font,
      rgba: true,
      dpi: 72,
      wrap: 'word',
      ...(o.width ? { width: o.width } : {}),
      ...(o.align ? { align: o.align } : {}),
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

/** sharp refuses an overlay that leaves the canvas; keep only the part inside it. */
async function clipped(sharp: SharpFn, img: Img, x: number, y: number): Promise<{ input: Buffer; left: number; top: number } | null> {
  const left = Math.max(0, -x);
  const top = Math.max(0, -y);
  const width = Math.min(img.width - left, COVER_WIDTH - Math.max(0, x));
  const height = Math.min(img.height - top, COVER_HEIGHT - Math.max(0, y));
  if (width <= 0 || height <= 0) return null;
  const input = left || top || width < img.width || height < img.height
    ? await sharp(img.data).extract({ left, top, width, height }).png().toBuffer()
    : img.data;
  return { input, left: Math.max(0, x), top: Math.max(0, y) };
}

async function asset(sharp: SharpFn, file: string, size: { width: number; height?: number }): Promise<Img> {
  const raw = await readFile(path.join(ASSETS, file));
  const { data, info } = await sharp(raw, { density: file.endsWith('.svg') ? 300 : 72 })
    // A flag is stretched to an exact 4:3 box; a mark keeps its proportions.
    .resize(size.height ? { ...size, fit: 'fill' } : { width: size.width })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

const FONTS = {
  en: {
    giant: (px: number) => `DM Serif Display ${px}`,
    title: (px: number) => `DM Serif Display ${px}`,
    label: 'Space Grotesk Medium 28',
    wordmark: 'Space Grotesk Bold 25',
    date: 'Space Grotesk Medium 24',
    titleSizes: [76, 69, 62, 56, 50],
    giantPx: 470,
  },
  fa: {
    giant: (px: number) => `Estedad Black ${px}`,
    title: (px: number) => `Estedad Black ${px}`,
    label: 'Vazirmatn SemiBold 29',
    wordmark: 'Vazirmatn ExtraBold 27',
    date: 'Vazirmatn SemiBold 26',
    titleSizes: [62, 56, 50, 45, 41],
    giantPx: 400,
  },
} as const;

const MAX_TITLE_LINES = 3;

// Geometry, in cover pixels (1600 × 900; one "unit" of the approved sketch = 16px).
const G = {
  edge: 86, // side margin of the card and the mark tile
  bottom: 80,
  cardWidth: 900,
  padX: 48,
  padTop: 40,
  padBottom: 36,
  gap: 26,
  shadow: 19,
  flagHeight: 33,
  flagBorder: 2,
  footerMark: 84,
};

/** Fit the headline: the largest size that keeps it to three lines. */
async function fitTitle(sharp: SharpFn, spec: CoverSpec, width: number): Promise<Img> {
  const f = FONTS[spec.locale];
  const align = spec.locale === 'fa' ? 'right' : 'left';
  let last: Img | null = null;
  for (const px of f.titleSizes) {
    const probe = await text(sharp, spec.locale === 'fa' ? 'سگ' : 'Hg', f.title(px), { colour: C.ink });
    const img = await text(sharp, spec.title, f.title(px), { colour: C.ink, width, align });
    last = img;
    if (Math.round(img.height / probe.height) <= MAX_TITLE_LINES) return img;
  }
  return last!;
}

/** Render one cover to PNG bytes. Deterministic: the same spec gives the same image. */
export async function renderCover(spec: CoverSpec): Promise<Buffer> {
  const sharp = await loadSharp();
  const rtl = spec.locale === 'fa';
  const f = FONTS[spec.locale];
  const bg = spec.country?.bg ?? C.night;
  const W = COVER_WIDTH;
  const H = COVER_HEIGHT;

  // ── measure everything that sits on the card ──
  const inner = G.cardWidth - G.padX * 2;
  const flag = spec.country
    ? await asset(sharp, `flags/${spec.country.code}.svg`, { width: Math.round((G.flagHeight * 4) / 3), height: G.flagHeight })
    : null;
  const flagBox = flag ? { w: flag.width + G.flagBorder * 2, h: flag.height + G.flagBorder * 2 } : { w: 0, h: 0 };
  const labelText = rtl ? spec.label : spec.label.toUpperCase();
  const label = await text(sharp, labelText, f.label, { colour: C.ink, tracking: rtl ? 0 : 3000 });
  const title = await fitTitle(sharp, spec, inner);
  const footMark = await asset(sharp, 'mark-ink.png', { width: G.footerMark });
  const wordmark = await text(sharp, rtl ? 'ویزارودز' : 'VISAROADS', f.wordmark, { colour: C.ink, tracking: rtl ? 0 : 2000 });
  const date = await text(sharp, spec.date, f.date, { colour: C.muted });

  const headH = Math.max(flagBox.h, label.height);
  const footH = Math.max(footMark.height, wordmark.height, date.height);
  const cardH = G.padTop + headH + G.gap + title.height + G.gap + footH + G.padBottom;
  const cardX = rtl ? W - G.edge - G.cardWidth : G.edge;
  const cardY = H - G.bottom - cardH;
  const shadowX = cardX + (rtl ? -G.shadow : G.shadow);

  // ── the flat shapes, in one transparent SVG laid over the giant name ──
  // No mark in the corner: the brand sits once, in the card's footer.
  const shapes = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
      `<rect x="${shadowX}" y="${cardY + G.shadow}" width="${G.cardWidth}" height="${cardH}" fill="${C.ink}"/>` +
      `<rect x="${cardX}" y="${cardY}" width="${G.cardWidth}" height="${cardH}" fill="${C.paper}"/>` +
      (flag
        ? `<rect x="${rtl ? cardX + G.cardWidth - G.padX - flagBox.w : cardX + G.padX}" y="${cardY + G.padTop + (headH - flagBox.h) / 2}" width="${flagBox.w}" height="${flagBox.h}" fill="${C.ink}"/>`
        : '') +
      `</svg>`,
  );

  // ── the giant faint name behind everything ──
  const giantWord = spec.country ? (rtl ? spec.country.fa : spec.country.en) : rtl ? 'ویزارودز' : 'VisaRoads';
  const giant = await text(sharp, giantWord, f.giant(f.giantPx), { colour: '#FFFFFF', alpha: 0.13 });
  const giantY = rtl ? Math.round(f.giantPx * 0.02) : -Math.round(f.giantPx * 0.1);
  const giantX = rtl ? W - giant.width + 24 : -24;

  const layers: { input: Buffer; left: number; top: number }[] = [];
  const push = async (img: Img, x: number, y: number) => {
    const l = await clipped(sharp, img, Math.round(x), Math.round(y));
    if (l) layers.push(l);
  };

  await push(giant, giantX, giantY);
  layers.push({ input: await sharp(shapes).png().toBuffer(), left: 0, top: 0 });

  const headY = cardY + G.padTop;
  const innerStart = cardX + G.padX;
  const innerEnd = cardX + G.cardWidth - G.padX;
  if (flag) {
    const fx = rtl ? innerEnd - flagBox.w + G.flagBorder : innerStart + G.flagBorder;
    await push(flag, fx, headY + (headH - flagBox.h) / 2 + G.flagBorder);
  }
  const labelGap = flag ? 16 : 0;
  await push(label, rtl ? innerEnd - flagBox.w - labelGap - label.width : innerStart + flagBox.w + labelGap, headY + (headH - label.height) / 2);

  const titleY = headY + headH + G.gap;
  await push(title, rtl ? innerEnd - title.width : innerStart, titleY);

  const footY = titleY + title.height + G.gap;
  const mid = (h: number) => footY + (footH - h) / 2;
  if (rtl) {
    await push(footMark, innerEnd - footMark.width, mid(footMark.height));
    await push(wordmark, innerEnd - footMark.width - 14 - wordmark.width, mid(wordmark.height));
    await push(date, innerStart, mid(date.height));
  } else {
    await push(footMark, innerStart, mid(footMark.height));
    await push(wordmark, innerStart + footMark.width + 14, mid(wordmark.height));
    await push(date, innerEnd - date.width, mid(date.height));
  }

  return sharp({ create: { width: W, height: H, channels: 4, background: bg } })
    .composite(layers).png({ compressionLevel: 9, palette: false }).toBuffer();
}
