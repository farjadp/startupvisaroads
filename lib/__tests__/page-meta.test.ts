import { describe, expect, it } from 'vitest';
import { metaFor } from '../pageMeta';

describe('page metadata', () => {
  it('describes the paid book-meeting session accurately', () => {
    const metadata = metaFor('/book-meeting', 'en') as any;

    expect(metadata.title.absolute).toContain('Paid Startup Mentorship Session');
    expect(metadata.description).toContain('$140');
    expect(metadata.description.toLowerCase()).not.toContain('free consultation');
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
