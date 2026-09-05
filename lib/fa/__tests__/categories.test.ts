import { describe, it, expect } from 'vitest';
import { faCategoryLabel } from '../categories';
import { DEFAULT_CATEGORIES } from '@/lib/categories';
import slugify from 'slugify';

describe('faCategoryLabel', () => {
  it('has a Persian label for every default category', () => {
    for (const name of DEFAULT_CATEGORIES) {
      const slug = slugify(name, { lower: true, strict: true });
      const label = faCategoryLabel(slug, name);
      expect(label, name).not.toBe(name);
      expect(label).toMatch(/[؀-ۿ]/);
    }
  });

  it('falls back to the given name for an unknown slug', () => {
    expect(faCategoryLabel('something-new', 'Something New')).toBe('Something New');
  });
});
