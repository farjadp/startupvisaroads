import { describe, it, expect } from 'vitest';
import { countriesIn, NEWS_COUNTRIES, NEWS_COUNTRY_KEYWORDS } from '@/lib/news-countries';

describe('news-countries', () => {
  it('has exactly the 17 app countries, each with a regex', () => {
    expect(NEWS_COUNTRIES).toEqual(['CA', 'US', 'AU', 'DK', 'FI', 'EE', 'NL', 'IT', 'ES', 'AT', 'IE', 'NO', 'SE', 'BG', 'TR', 'IL', 'AE']);
    for (const c of NEWS_COUNTRIES) expect(NEWS_COUNTRY_KEYWORDS[c]).toBeInstanceOf(RegExp);
  });

  it('matches on the title', () => {
    expect(countriesIn('Express Entry draw: 150 invitations for transport occupations')).toEqual(['CA']);
    expect(countriesIn('Spain ENISA start-up certificate explained')).toEqual(['ES']);
    expect(countriesIn('Bulgaria start-up visa: what changed')).toEqual(['BG']);
  });

  it('matches on the excerpt too', () => {
    expect(countriesIn('Where founders go next', 'A look at Dublin and Tallinn as EU bases.')).toEqual(['EE', 'IE']);
  });

  it('matches Persian keywords', () => {
    expect(countriesIn('راهنمای ویزای استارتاپ کانادا')).toEqual(['CA']);
    expect(countriesIn('مهاجرت به هلند و دانمارک')).toEqual(['DK', 'NL']);
  });

  it('returns codes in the fixed country order and never duplicates', () => {
    expect(countriesIn('Canada vs Australia vs Canada')).toEqual(['CA', 'AU']);
  });

  it('is empty when nothing matches, and copes with null excerpts', () => {
    expect(countriesIn('Five habits of good founders', null)).toEqual([]);
    expect(countriesIn('', undefined)).toEqual([]);
  });

  it('does not take "usa" or "pei" inside words', () => {
    expect(countriesIn('Thousands trusted the Peiwan method')).toEqual([]);
  });
});
