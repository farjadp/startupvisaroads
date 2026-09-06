import { describe, it, expect } from 'vitest';
import { xMessage, xLength } from '../x-message';
import { DESTINATIONS } from '../destinations';

const farjad = DESTINATIONS.find((d) => d.id === 'x-farjad')!;
const ashavid = DESTINATIONS.find((d) => d.id === 'x-ashavid')!;

const faArticle = {
  title: 'اثبات تمکن مالی ویزای استارتاپ با حساب ایرانی',
  locale: 'fa' as const,
  slug: 'funds',
  keyTakeaway: 'شرط تمکن مالی را هر مرجع خودش اعلام می‌کند و قابل مذاکره نیست؛ آنچه برای متقاضی ایرانی فرق می‌کند اثبات آن است، نه خود رقم.',
  excerpt: null,
};
const enArticle = {
  title: 'Denmark vs Finland for founding teams',
  locale: 'en' as const,
  slug: 'denmark-vs-finland',
  keyTakeaway: 'Finland requires two founders and Denmark accepts one. For a solo founder that single fact decides the route before any of the money does.',
  excerpt: null,
};

describe('the AshaVid lane (English)', () => {
  // X weighs every link as 23 characters however long it is, so the limit is
  // on the weighed count. Asserting raw .length asserts the wrong rule in
  // both directions: a valid post can exceed 280 real characters, and a
  // 280-character one can still be rejected.
  it('fits inside the standard limit as X counts it', () => {
    const m = xMessage(enArticle, ashavid, 'article');
    expect(xLength(m)).toBeLessThanOrEqual(280);
  });

  it('always carries hashtags, which Farjad asked for explicitly', () => {
    expect(xMessage(enArticle, ashavid, 'article')).toMatch(/#\w+/);
  });

  it('carries the article link', () => {
    expect(xMessage(enArticle, ashavid, 'article')).toContain('/en/blog/denmark-vs-finland');
  });

  it('writes in English, not Persian', () => {
    expect(xMessage(enArticle, ashavid, 'article')).not.toMatch(/[؀-ۿ]/);
  });

  it('carries no digital-assistant signature — that is the personal account only', () => {
    expect(xMessage(enArticle, ashavid, 'article')).not.toMatch(/assistant|دستیار/i);
  });

  // The insight tweet is a different shape: an idea, not an announcement.
  it('makes the insight tweet shorter than the article tweet', () => {
    expect(xLength(xMessage(enArticle, ashavid, 'insight')))
      .toBeLessThanOrEqual(xLength(xMessage(enArticle, ashavid, 'article')));
  });
});

describe('the personal lane (Persian)', () => {
  it('signs every message as the digital assistant', () => {
    for (const kind of ['article', 'insight'] as const) {
      expect(xMessage(faArticle, farjad, kind), kind).toContain('دستیار دیجیتال فرجاد');
    }
  });

  it('carries the channel, the personal site and the VisaRoads site', () => {
    const m = xMessage(faArticle, farjad, 'article');
    expect(m).toContain('t.me/visaroads');
    expect(m).toContain('farjadp.info');
    expect(m).toContain('visaroads.com');
  });

  // "خوشگل بیاد... محتوا مرتب باشه" — four bare URLs stacked with blank lines
  // between them is a link dump eight lines tall, not a footer.
  it('labels the links and groups them without blank lines between', () => {
    const m = xMessage(faArticle, farjad, 'article');
    expect(m).toContain('مقاله: ');
    expect(m).toContain('کانال: ');
    expect(m).toContain('وب‌سایت: ');
    const block = m.split('\n\n').find((p) => p.includes('کانال: '))!;
    expect(block.split('\n').length).toBe(3);
  });

  it('keeps the extra links off the insight post, which is one idea and a link', () => {
    const m = xMessage(faArticle, farjad, 'insight');
    expect(m).not.toContain('farjadp.info');
  });

  // Premium: long-form is available, so the takeaway must not be truncated
  // into a broken sentence the way the 240-character poster would.
  it('does not truncate the takeaway', () => {
    const m = xMessage(faArticle, farjad, 'article');
    expect(m).not.toContain('…');
    expect(m).toContain('نه خود رقم');
  });

  it('writes in Persian with Persian digits in prose', () => {
    const m = xMessage({ ...faArticle, keyTakeaway: 'حداقل 2 بنیان‌گذار لازم است.' }, farjad, 'article');
    expect(m).toMatch(/[؀-ۿ]/);
    expect(m).toContain('۲');
  });

  it('keeps programme codes Latin', () => {
    const m = xMessage({ ...faArticle, keyTakeaway: 'مسیر EB-2 NIW فرق دارد.' }, farjad, 'article');
    expect(m).toContain('EB-2 NIW');
  });

  it('carries hashtags too', () => {
    expect(xMessage(faArticle, farjad, 'article')).toMatch(/#[^\s#]+/);
  });

  // "محتوا مرتب باشه" — the parts have to be separated, not run together.
  it('separates the parts with blank lines rather than running them together', () => {
    expect(xMessage(faArticle, farjad, 'article')).toContain('\n\n');
  });

  it('puts the signature last, after the links', () => {
    const m = xMessage(faArticle, farjad, 'article');
    const sig = m.indexOf('دستیار دیجیتال فرجاد');
    for (const link of farjad.links ?? []) expect(m.indexOf(link)).toBeLessThan(sig);
  });
});

describe('both lanes', () => {
  it('never emits markup characters that would read as broken formatting', () => {
    const m = xMessage({ ...enArticle, title: '*bold* _x_ `y`' }, ashavid, 'article');
    expect(m).not.toMatch(/[*_`]/);
  });

  it('keeps the link intact when it has to cut something', () => {
    const long = { ...enArticle, keyTakeaway: 'word '.repeat(400) };
    const m = xMessage(long, ashavid, 'article');
    expect(xLength(m)).toBeLessThanOrEqual(280);
    expect(m).toContain('/en/blog/denmark-vs-finland');
  });
});

describe('the insight post', () => {
  const withPoint = { ...faArticle, insight: 'فنلاند دست‌کم دو بنیان‌گذار می‌خواهد و دانمارک به یک نفر هم اجازه اقدام می‌دهد.' };

  // Farjad's instruction. A standalone thought that does not ask for a click
  // is a different kind of post, and the same link three times a day is what
  // makes an account read as promotion.
  it('carries no link at all', () => {
    const m = xMessage(withPoint, farjad, 'insight');
    expect(m).not.toContain('http');
    expect(m).not.toContain('مقاله: ');
  });

  it('uses the point from the body, not the takeaway the article post used', () => {
    const m = xMessage(withPoint, farjad, 'insight');
    expect(m).toContain('دو بنیان‌گذار');
    expect(m).not.toContain(faArticle.keyTakeaway.slice(0, 40));
  });

  it('still signs the personal account and still carries hashtags', () => {
    const m = xMessage(withPoint, farjad, 'insight');
    expect(m).toContain('دستیار دیجیتال فرجاد');
    expect(m).toMatch(/#[^\s#]+/);
  });

  it('falls back to the takeaway when no point was extracted', () => {
    const m = xMessage(faArticle, farjad, 'insight');
    expect(m).toContain(faArticle.keyTakeaway.slice(0, 30));
  });

  it('keeps the English lane inside the limit without a link to spend on', () => {
    const m = xMessage({ ...enArticle, insight: 'Finland requires two founders where Denmark accepts one, and that decides the route.' }, ashavid, 'insight');
    expect(xLength(m)).toBeLessThanOrEqual(280);
    expect(m).not.toContain('http');
  });
});

describe('hashtags', () => {
  const article = {
    title: 'PGWP and DLI in 2026',
    locale: 'en' as const,
    slug: 'pgwp-dli-2026',
    keyTakeaway: 'Check the list before you enrol.',
    insight: 'Not every Designated Learning Institution leaves you eligible for a Post-Graduation Work Permit.',
  };
  const ashavid = DESTINATIONS.find((d) => d.id === 'x-ashavid')!;

  it('uses the hashtags chosen for this post', () => {
    const text = xMessage({ ...article, hashtags: ['#PGWP', '#StudyInCanada'] }, ashavid, 'insight');
    expect(text).toContain('#PGWP #StudyInCanada');
    expect(text).not.toContain('#StartupVisa');
  });

  it('falls back to the account’s own when the writer supplied none', () => {
    expect(xMessage(article, ashavid, 'insight')).toContain('#StartupVisa');
  });
});
