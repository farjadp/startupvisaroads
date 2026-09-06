// The Pexels call is not tested. The two guards that decide whether a picture
// may go out are, because both exist because of a picture that already did.
import { describe, it, expect } from 'vitest';
import { claimsAnotherPlace, NATIONAL } from '../photo';

describe('claimsAnotherPlace', () => {
  it('rejects the Turkish passport that went out on a post about Canada', () => {
    const photo = {
      alt: 'Flat lay of a Republic of Turkey passport beside a laptop and coffee',
      url: 'https://www.pexels.com/photo/turkish-passport-laptop-123/',
    };
    expect(claimsAnotherPlace(photo, 'passport on a desk')).toBe(true);
  });

  it('keeps a photo of the place the post is actually about', () => {
    const photo = { alt: 'A university campus in Toronto, Canada in autumn', url: 'https://www.pexels.com/photo/toronto-campus-1/' };
    expect(claimsAnotherPlace(photo, 'Toronto university campus Canada')).toBe(false);
  });

  it('leaves a picture with no country in it alone', () => {
    const photo = { alt: 'A desk with papers and a laptop', url: 'https://www.pexels.com/photo/desk-papers-9/' };
    expect(claimsAnotherPlace(photo, 'desk with documents')).toBe(false);
  });
});

describe('NATIONAL', () => {
  it('names the searches that return somebody else’s country', () => {
    for (const q of ['passport on a desk', 'a flag on a building', 'visa application form', 'banknote close up']) {
      expect(NATIONAL.test(q)).toBe(true);
    }
    expect(NATIONAL.test('Copenhagen harbour at dusk')).toBe(false);
  });
});
