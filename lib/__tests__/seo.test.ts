import { describe, it, expect } from 'vitest';
import {
  buildAlternates,
  buildMetadata,
  defaultOgImage,
  organizationJsonLd,
  articleJsonLd,
  schemaLanguage,
  SITE_URL,
  websiteJsonLd,
  webPageJsonLd,
  blogJsonLd,
  faqJsonLd,
  isDataImageUrl,
  localizedArchiveAlternates,
  normalizeSeoImageUrl,
  selfLocalizedAlternates,
  stripHtml,
} from '../seo';

describe('buildAlternates', () => {
  it('emits both languages for a paired path', () => {
    const a = buildAlternates('/mentorship', 'en') as any;
    expect(a.canonical).toBe(`${SITE_URL}/en/mentorship`);
    expect(a.languages.en).toBe(`${SITE_URL}/en/mentorship`);
    expect(a.languages.fa).toBe(`${SITE_URL}/fa/mentorship`);
    expect(a.languages['x-default']).toBe(`${SITE_URL}/en/mentorship`);
  });

  it('maps a paired path whose slugs differ per locale', () => {
    const a = buildAlternates('/startup-visa-canada', 'en') as any;
    expect(a.languages.fa).toBe(`${SITE_URL}/fa/canada-startup-visa`);
  });

  it('omits fa for an English-only path', () => {
    const a = buildAlternates('/usa/eb5', 'en') as any;
    expect(a.languages.fa).toBeUndefined();
    expect(a.languages.en).toBe(`${SITE_URL}/en/usa/eb5`);
    expect(a.languages['x-default']).toBe(`${SITE_URL}/en/usa/eb5`);
  });

  it('omits en for a Persian-only path and self-references x-default', () => {
    const a = buildAlternates('/which-path', 'fa') as any;
    expect(a.canonical).toBe(`${SITE_URL}/fa/which-path`);
    expect(a.languages.en).toBeUndefined();
    expect(a.languages.fa).toBe(`${SITE_URL}/fa/which-path`);
    expect(a.languages['x-default']).toBe(`${SITE_URL}/fa/which-path`);
  });

  it('strips an incoming locale prefix before pairing', () => {
    const a = buildAlternates('/fa/canada-startup-visa', 'fa') as any;
    expect(a.canonical).toBe(`${SITE_URL}/fa/canada-startup-visa`);
    expect(a.languages.en).toBe(`${SITE_URL}/en/startup-visa-canada`);
  });

  it('never generates a fanull x-default for an unknown Persian path', () => {
    const a = buildAlternates('/dynamic-page', 'fa') as any;
    expect(a.languages['x-default']).toBe(`${SITE_URL}/fa/dynamic-page`);
    expect(JSON.stringify(a)).not.toContain('null');
  });

  it('emits reciprocal archive alternates only for locales with published articles', () => {
    expect(localizedArchiveAlternates('/blog/category/news', 'fa', ['en', 'fa'])).toEqual({
      canonical: `${SITE_URL}/fa/blog/category/news`,
      languages: {
        en: `${SITE_URL}/en/blog/category/news`,
        fa: `${SITE_URL}/fa/blog/category/news`,
        'x-default': `${SITE_URL}/en/blog/category/news`,
      },
    });
    expect(localizedArchiveAlternates('/blog/category/news', 'fa', ['fa'])).toEqual({
      canonical: `${SITE_URL}/fa/blog/category/news`,
      languages: {
        fa: `${SITE_URL}/fa/blog/category/news`,
        'x-default': `${SITE_URL}/fa/blog/category/news`,
      },
    });
  });
});

describe('schema identity and localization', () => {
  it('uses stable organization, website, and logo nodes', () => {
    const organization = organizationJsonLd() as any;
    const website = websiteJsonLd() as any;

    expect(organization['@id']).toBe(`${SITE_URL}/#organization`);
    expect(organization.logo).toEqual({
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: `${SITE_URL}/img/VisaRoads-Logo13.png`,
      contentUrl: `${SITE_URL}/img/VisaRoads-Logo13.png`,
      width: 2000,
      height: 2000,
    });
    expect(website['@id']).toBe(`${SITE_URL}/#website`);
    expect(website.publisher).toEqual({ '@id': `${SITE_URL}/#organization` });
    expect(website).not.toHaveProperty('potentialAction');
  });

  it('maps supported locales to BCP-47 language tags', () => {
    expect(schemaLanguage('en')).toBe('en-US');
    expect(schemaLanguage('fa')).toBe('fa-IR');
  });

  it('uses the locale-specific default social image', () => {
    expect(defaultOgImage('en')).toBe(`${SITE_URL}/en/opengraph-image`);
    expect(defaultOgImage('fa')).toBe(`${SITE_URL}/fa/opengraph-image`);

    const metadata = buildMetadata({
      title: 'عنوان',
      description: 'توضیحات',
      path: '/which-path',
      locale: 'fa',
    }) as any;
    expect(metadata.openGraph.images[0].url).toBe(`${SITE_URL}/fa/opengraph-image`);
    expect(metadata.twitter.images).toEqual([`${SITE_URL}/fa/opengraph-image`]);
  });

  it('normalizes safe stored images and excludes data or insecure URLs from metadata and schema', () => {
    expect(normalizeSeoImageUrl('/uploads/cover.jpg')).toBe(`${SITE_URL}/uploads/cover.jpg`);
    expect(normalizeSeoImageUrl('https://cdn.example.com/cover.jpg')).toBe('https://cdn.example.com/cover.jpg');
    expect(normalizeSeoImageUrl('http://cdn.example.com/cover.jpg')).toBeNull();
    expect(normalizeSeoImageUrl('data:image/png;base64,abc')).toBeNull();
    expect(isDataImageUrl('data:image/png;base64,abc')).toBe(true);

    const metadata = buildMetadata({
      title: 'Article',
      description: '<p>Useful <strong>summary</strong></p>',
      path: '/blog/article',
      locale: 'en',
      image: 'data:image/png;base64,abc',
      type: 'article',
    }) as any;
    const schema = articleJsonLd({
      title: 'Article',
      description: '<p>Useful summary</p>',
      url: `${SITE_URL}/en/blog/article`,
      image: 'data:image/png;base64,abc',
      datePublished: '2026-01-01',
      dateModified: '2026-01-02',
      locale: 'en',
    }) as any;

    expect(metadata.description).toBe('Useful summary');
    expect(metadata.openGraph.images[0].url).toBe(`${SITE_URL}/en/opengraph-image`);
    expect(schema).not.toHaveProperty('image');
    expect(schema.description).toBe('Useful summary');
    expect(stripHtml('<p>Hello <em>world</em></p>')).toBe('Hello world');
  });

  it('adds locale to FAQ structured data', () => {
    const faq = faqJsonLd([{ question: 'Question?', answer: 'Answer.' }], 'fa') as any;
    expect(faq.inLanguage).toBe('fa-IR');
  });

  it('supports noindex,follow discovery pages without changing noindex,nofollow defaults', () => {
    const discovery = buildMetadata({
      title: 'Search',
      description: 'Filtered articles',
      path: '/blog',
      locale: 'en',
      noindex: true,
      nofollow: false,
    }) as any;
    const privatePage = buildMetadata({
      title: 'Unsubscribe',
      description: 'Email preferences',
      path: '/unsubscribe',
      locale: 'en',
      noindex: true,
    }) as any;

    expect(discovery.robots).toEqual({ index: false, follow: true });
    expect(privatePage.robots).toEqual({ index: false, follow: false });
  });

  it('builds self-referencing article alternates with x-default', () => {
    expect(selfLocalizedAlternates('/blog/example', 'fa')).toEqual({
      canonical: `${SITE_URL}/fa/blog/example`,
      languages: {
        fa: `${SITE_URL}/fa/blog/example`,
        'x-default': `${SITE_URL}/fa/blog/example`,
      },
    });
  });

  it('connects articles and pages to stable graph nodes with BCP-47 language', () => {
    const url = `${SITE_URL}/fa/blog/example`;
    const article = articleJsonLd({
      title: 'عنوان',
      description: 'توضیحات',
      url,
      datePublished: '2026-01-01T00:00:00.000Z',
      dateModified: '2026-01-02T00:00:00.000Z',
      locale: 'fa',
    }) as any;
    const page = webPageJsonLd({
      title: 'عنوان',
      description: 'توضیحات',
      url,
      locale: 'fa',
    }) as any;

    expect(article['@id']).toBe(`${url}#article`);
    expect(article.mainEntityOfPage).toEqual({ '@type': 'WebPage', '@id': `${url}#webpage` });
    expect(article.author).toEqual({
      '@type': 'Organization',
      '@id': `${SITE_URL}/#editorial-team-fa`,
      name: 'تیم تحریریه استارتاپ ویزا رودز',
      url: `${SITE_URL}/fa/blog`,
    });
    expect(article).not.toHaveProperty('reviewedBy');
    expect(article.publisher).toEqual({ '@id': `${SITE_URL}/#organization` });
    expect(article.inLanguage).toBe('fa-IR');
    expect(page['@id']).toBe(`${url}#webpage`);
    expect(page.isPartOf).toEqual({ '@id': `${SITE_URL}/#website` });
    expect(page.about).toEqual({ '@id': `${SITE_URL}/#organization` });
    expect(page.inLanguage).toBe('fa-IR');
  });

  it('describes the journal as a Blog linked to its collection page', () => {
    const url = `${SITE_URL}/en/blog`;
    expect(blogJsonLd({
      title: 'The Journal',
      description: 'Guides and analysis',
      url,
      locale: 'en',
    })).toMatchObject({
      '@type': 'Blog',
      '@id': `${url}#blog`,
      url,
      inLanguage: 'en-US',
      isPartOf: { '@id': `${url}#webpage` },
      publisher: { '@id': `${SITE_URL}/#organization` },
    });
  });
});
