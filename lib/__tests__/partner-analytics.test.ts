import { afterEach, describe, expect, it, vi } from 'vitest';
import { trackPartner } from '@/lib/analytics';

describe('trackPartner', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is a no-op on the server', () => {
    expect(() => trackPartner('partner_cta_click', { locale: 'en', placement: 'hero' })).not.toThrow();
  });

  it('is a no-op when GA4 is not configured', () => {
    vi.stubGlobal('window', {});
    expect(() => trackPartner('partner_calendar_open', { locale: 'fa', placement: 'booking' })).not.toThrow();
  });

  it('sends the event to gtag with the page type and placement', () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    trackPartner('partner_contact_click', { locale: 'fa', placement: 'booking', channel: 'telegram' });
    expect(gtag).toHaveBeenCalledWith('event', 'partner_contact_click', {
      locale: 'fa',
      placement: 'booking',
      channel: 'telegram',
      page_type: 'partners',
    });
  });
});
