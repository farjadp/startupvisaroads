import { describe, expect, it } from 'vitest';
import { metaFor } from '../pageMeta';

describe('page metadata', () => {
  it('describes the book-meeting session as free, with no price', () => {
    const metadata = metaFor('/book-meeting', 'en') as any;

    expect(metadata.title.absolute).toContain('Free Startup Consultation');
    expect(metadata.description.toLowerCase()).toContain('free');
    expect(metadata.description).not.toMatch(/\$\s?\d/);
  });

  it('provides English webinar metadata', () => {
    const metadata = metaFor('/webinar', 'en') as any;

    expect(metadata.title.absolute).toContain('Startup Visa Canada Webinar');
    expect(metadata.description).toContain('2026');
    expect(metadata.alternates.canonical).toContain('/en/webinar');
  });

  it('marks unsubscribe as noindex and nofollow', () => {
    const metadata = metaFor('/unsubscribe', 'en') as any;

    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
