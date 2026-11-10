import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { afterEach, describe, expect, it } from 'vitest';
import { COUNTRIES, detectCountry } from '../countries';
import { coverDate, coverLabel, coverSpec } from '../index';
import { COVER_HEIGHT, COVER_WIDTH, escapeMarkup, renderCover } from '../render';
import { coverStyle } from '@/lib/autopilot/images';

const code = (title: string, extra: Partial<Parameters<typeof detectCountry>[0]> = {}) => detectCountry({ title, ...extra })?.code ?? null;

describe('detectCountry', () => {
  it('reads the country from English and Persian headlines', () => {
    expect(code('Italy Startup Visa Requirements for Entrepreneurs in 2026')).toBe('it');
    expect(code('سقف تعداد بنیان‌گذار و تمکن مالی در استارتاپ ویزای ایتالیا')).toBe('it');
    expect(code('How Iranian Founders Can Overcome Dutch Bank and Sanctions Barriers')).toBe('nl');
    expect(code('ساختار هزینه زندگی در ترکیه برای خانواده مهاجر')).toBe('tr');
  });

  it('knows Canada by its route names when the headline never says Canada', () => {
    expect(code('Express Entry 100,000, provinces 95,000: the 2027 split')).toBe('ca');
    expect(code('High Impact Start-up Pilot: What IRCC Has Actually Said So Far')).toBe('ca');
    expect(code('Who Manitoba’s November 2026 PNP Draw Selected')).toBe('ca');
  });

  it('takes the country named first', () => {
    expect(code('Canada vs Australia for a first-time founder')).toBe('ca');
    expect(code('Australia or Canada: which startup route fits?')).toBe('au');
  });

  it('does not mistake British Columbia for Britain', () => {
    expect(code('British Columbia Entrepreneur Immigration: the 2026 draws')).toBe('ca');
  });

  it('does not read common Persian words as countries', () => {
    // «چک» is a cheque before it is Czechia; «رم» is inside ordinary words.
    expect(code('چک بانکی و گردش حساب برای تمکن مالی')).toBeNull();
    expect(code('چگونه یک فرم درخواست را کامل کنیم')).toBeNull();
  });

  it('falls back to the autopilot destination tag, then category and tags', () => {
    expect(code('How to price your first product', { topicSeed: '[family:founder-craft] [dest:finland] why' })).toBe('fi');
    expect(code('How to price your first product', { category: 'Australia Entrepreneurship' })).toBe('au');
    expect(code('How to price your first product', { tags: ['Denmark'] })).toBe('dk');
  });

  it('returns null for a general article rather than guessing', () => {
    expect(code('How to Read a Startup Visa Rejection Letter Before You Reapply')).toBeNull();
  });
});

describe('country table', () => {
  it('has a flag file for every country', () => {
    for (const c of COUNTRIES) {
      expect(fs.existsSync(path.join(process.cwd(), 'assets/covers/flags', `${c.code}.svg`)), c.code).toBe(true);
    }
  });

  it('has one entry per code', () => {
    expect(new Set(COUNTRIES.map((c) => c.code)).size).toBe(COUNTRIES.length);
  });

  // The paper card must stand out from the colour field, and the faint white
  // name must stay faint; both need a dark, saturated background.
  it('keeps every background dark enough for the paper card', () => {
    const lum = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const paper = lum('#F2F0E9');
    for (const c of COUNTRIES) {
      const ratio = (paper + 0.05) / (lum(c.bg) + 0.05);
      expect(ratio, `${c.code} ${c.bg}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('label and date', () => {
  const ca = COUNTRIES.find((c) => c.code === 'ca')!;
  const it_ = COUNTRIES.find((c) => c.code === 'it')!;

  it('never repeats the country when the category already names it', () => {
    expect(coverLabel(ca, 'Canada PNP', 'en')).toBe('Canada PNP');
    expect(coverLabel(ca, 'Work & Skilled Immigration', 'en')).toBe('Canada · Work & Skilled Immigration');
    expect(coverLabel(it_, 'Italy', 'en')).toBe('Italy');
  });

  it('writes the Persian label in Persian', () => {
    expect(coverLabel(it_, 'European Visas', 'fa')).toBe('ایتالیا · ویزاهای اروپا');
    expect(coverLabel(ca, 'Canada PNP', 'fa')).toBe('برنامه‌های استانی کانادا');
  });

  it('labels an article with no country by its category alone', () => {
    expect(coverLabel(null, 'Mentorship & Business Planning', 'en')).toBe('Mentorship & Business Planning');
    expect(coverLabel(null, null, 'fa')).toBe('ویزارودز');
  });

  it('dates the Persian cover in the Persian calendar', () => {
    const fa = coverDate(new Date('2026-11-08T12:00:00Z'), 'fa');
    expect(fa).toContain('آبان');
    expect(fa).toContain('۱۴۰۵');
    expect(coverDate(new Date('2026-11-08T12:00:00Z'), 'en')).toBe('Nov 2026');
  });

  it('builds a full spec from an article', () => {
    const spec = coverSpec({ title: ' Express Entry 100,000, provinces 95,000 ', locale: 'en', category: 'Work & Skilled Immigration', date: new Date('2026-11-06') });
    expect(spec).toMatchObject({ locale: 'en', title: 'Express Entry 100,000, provinces 95,000', date: 'Nov 2026' });
    expect(spec.country?.code).toBe('ca');
    expect(coverSpec({ title: 'x', locale: 'de' }).locale).toBe('en');
  });
});

describe('renderCover', () => {
  it('escapes Pango markup', () => {
    expect(escapeMarkup('Fees & <rules> "now"')).toBe('Fees &amp; &lt;rules&gt; &quot;now&quot;');
  });

  const cases = [
    coverSpec({ title: 'High Impact Start-up Pilot: What IRCC Has Actually Said So Far', locale: 'en', category: 'Canada Startup Visa' }),
    coverSpec({ title: 'سقف تعداد بنیان‌گذار و تمکن مالی در استارتاپ ویزای ایتالیا', locale: 'fa', category: 'European Visas' }),
    coverSpec({ title: 'Fees & <rules>: what a founder pays before the first invoice', locale: 'en', category: 'Mentorship & Business Planning' }),
    coverSpec({
      title: 'A deliberately long headline that keeps going well past what three lines on the paper card can hold, to prove the fitter shrinks it and still renders',
      locale: 'en',
      category: 'European Visas',
    }),
  ];

  for (const spec of cases) {
    it(`draws a ${COVER_WIDTH}×${COVER_HEIGHT} PNG: ${spec.locale} / ${spec.country?.code ?? 'no country'} / ${spec.title.slice(0, 30)}`, async () => {
      const png = await renderCover(spec);
      const meta = await sharp(png).metadata();
      expect(meta.format).toBe('png');
      expect(meta.width).toBe(COVER_WIDTH);
      expect(meta.height).toBe(COVER_HEIGHT);
    }, 30_000);
  }

  it('paints the country colour edge to edge', async () => {
    const spec = cases[0];
    const { data } = await sharp(await renderCover(spec)).extract({ left: 0, top: COVER_HEIGHT - 4, width: 4, height: 4 }).raw().toBuffer({ resolveWithObject: true });
    const hex = `#${[data[0], data[1], data[2]].map((v) => v.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
    expect(hex).toBe(spec.country!.bg.toUpperCase());
  }, 30_000);
});

describe('coverStyle', () => {
  const saved = process.env.COVER_STYLE;
  afterEach(() => {
    if (saved === undefined) delete process.env.COVER_STYLE;
    else process.env.COVER_STYLE = saved;
  });

  it('draws brand covers unless told to use photos', () => {
    delete process.env.COVER_STYLE;
    expect(coverStyle()).toBe('brand');
    process.env.COVER_STYLE = 'photo';
    expect(coverStyle()).toBe('photo');
    process.env.COVER_STYLE = 'anything-else';
    expect(coverStyle()).toBe('brand');
  });
});
