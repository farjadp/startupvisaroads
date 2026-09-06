// The model call is not tested here — the guard is. Everything that decides
// whether a draft is fit to post is pure, and it is the part that has to hold
// when a model returns something confident and wrong.
import { describe, it, expect } from 'vitest';
import { rejectReason } from '../write-insight';

const EN = 'Finland requires at least two founders with meaningful equity, so a solo founder is filtered out before the business plan is read.';
const FA = 'فنلاند تیم حداقل دو نفره می‌خواهد، پس بنیان‌گذار تنها پیش از خوانده‌شدن طرح کسب‌وکار کنار گذاشته می‌شود.';

describe('rejectReason', () => {
  it('passes a post that stands on its own', () => {
    expect(rejectReason(EN, 'en', 240)).toBeNull();
    expect(rejectReason(FA, 'fa', 600)).toBeNull();
  });

  it('rejects rather than trims an over-long draft', () => {
    // Trimming is what produced the mid-thought posts this module replaced.
    expect(rejectReason(EN, 'en', 80)).toMatch(/too long/);
  });

  it('rejects the things the message layer adds afterwards', () => {
    expect(rejectReason(`${EN} #StartupVisa`, 'en', 240)).toMatch(/hashtag/);
    expect(rejectReason(`${EN} https://visaroads.com`, 'en', 240)).toMatch(/link/);
    expect(rejectReason(`${EN} 🚀`, 'en', 240)).toMatch(/emoji/);
  });

  it('rejects Latin digits in Persian prose but keeps them in programme codes', () => {
    expect(rejectReason(`${FA} حدود 2 نفر.`, 'fa', 600)).toMatch(/Latin digits/);
    expect(rejectReason(`${FA} مسیر EB-2 NIW نیز هست.`, 'fa', 600)).toBeNull();
  });

  it('rejects an English word that wandered into a Persian sentence', () => {
    expect(rejectReason(`${FA} ریسک رد شدن بالا می‌رود—even اگر عدد کافی باشد.`, 'fa', 600)).toMatch(/English word/);
    // The names that are supposed to stay Latin all carry a capital.
    expect(rejectReason(`${FA} طبق مقررات Migri و مسیر e-Residency.`, 'fa', 600)).toBeNull();
  });

  it('rejects a fragment too short to carry a point', () => {
    expect(rejectReason('Deadline: August 4, 2026', 'en', 240)).toMatch(/too short/);
  });
});
