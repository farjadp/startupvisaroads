import { describe, it, expect } from 'vitest';
import { faCategoryGuide, faCategoryLabel } from '../categories';
import { isFaPath } from '../paths';
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

describe('country categories', () => {
  it('gives each live country category a Persian label', () => {
    expect(faCategoryLabel('finland', 'Finland')).toBe('فنلاند');
    expect(faCategoryLabel('denmark', 'Denmark')).toBe('دانمارک');
    expect(faCategoryLabel('canada', 'Canada')).toBe('کانادا');
  });

  it('links a country category to a real Persian guide, titled with the phrase people search', () => {
    const fi = faCategoryGuide('finland');
    expect(fi?.path).toBe('/europe/finland');
    expect(fi?.title).toContain('ویزای استارتاپ فنلاند');
    for (const slug of ['finland', 'denmark', 'canada', 'netherlands', 'estonia', 'italy', 'turkiye', 'australia']) {
      const g = faCategoryGuide(slug);
      expect(g, slug).not.toBeNull();
      expect(isFaPath(g!.path), `${slug} → ${g!.path}`).toBe(true);
      expect(g!.description).toMatch(/[؀-ۿ]/);
      expect(g!.description).not.toMatch(/[0-9۰-۹]/); // no figures in copy that nobody re-checks
    }
  });

  it('returns null for a category with no Persian guide', () => {
    expect(faCategoryGuide('mentorship-and-business-planning')).toBeNull();
    expect(faCategoryGuide('usa')).toBeNull();
  });
});
