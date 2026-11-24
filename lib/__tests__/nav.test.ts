import { afterEach, describe, expect, it, vi } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { NAV, allNavHrefs, footerColumns } from '@/lib/nav';
import { faRedirectTarget } from '@/lib/fa/redirects';
import { trackNav } from '@/lib/analytics';

const PUBLIC = path.join(process.cwd(), 'app', '[locale]', '(public)');

/** A static route exists when its folder holds a page.tsx. */
function hasPage(href: string): boolean {
  const dir = href === '/' ? PUBLIC : path.join(PUBLIC, ...href.split('/').filter(Boolean));
  return existsSync(path.join(dir, 'page.tsx'));
}

describe('nav links', () => {
  for (const locale of ['en', 'fa'] as const) {
    it(`every ${locale} header and footer link is a real page`, () => {
      const missing = allNavHrefs(locale).filter((h) => !hasPage(h));
      expect(missing).toEqual([]);
    });
  }

  it('no Persian link lands on a redirect out of /fa', () => {
    const redirected = allNavHrefs('fa').filter((h) => faRedirectTarget(`/fa${h === '/' ? '' : h}`) !== null);
    expect(redirected).toEqual([]);
  });

  it('the top bar stays at five items in both locales', () => {
    expect(NAV.en.top).toHaveLength(5);
    expect(NAV.fa.top).toHaveLength(5);
  });

  // The footer is the crawl path of last resort: every link the old header or
  // footer carried must still be on every page somewhere.
  const OLD_EN = [
    '/services', '/country/canada', '/startup-visa-canada', '/high-impact-startup-pilot', '/pnp', '/pnp/bc',
    '/pnp/alberta', '/pnp/manitoba', '/pnp/nova-scotia', '/pnp/new-brunswick', '/pnp/pei', '/country/usa',
    '/usa/o-1a', '/usa/eb2-niw', '/usa/eb1', '/country/denmark', '/country/finland', '/europe/netherlands',
    '/country/italy', '/europe/spain', '/europe/bulgaria', '/europe/belgium', '/europe/estonia',
    '/uk/innovator-founder', '/country/uae', '/country/australia', '/country/turkey', '/start-up-chile',
    '/country/israel', '/country', '/which-path', '/tools', '/faq', '/mentorship', '/app', '/pricing', '/blog',
    '/about', '/partners', '/webinar', '/contact', '/book-meeting', '/data-reports', '/login',
  ];
  const OLD_FA = [
    '/pnp', '/pnp/bc', '/pnp/alberta', '/pnp/manitoba', '/pnp/nova-scotia', '/pnp/new-brunswick', '/pnp/pei',
    '/canada-startup-visa', '/high-impact-startup-pilot', '/europe/denmark', '/europe/netherlands',
    '/europe/finland', '/europe/italy', '/europe/spain', '/europe/bulgaria', '/europe/belgium', '/europe/estonia',
    '/uk/innovator-founder', '/usa', '/usa/o-1a', '/usa-eb2-niw', '/australia', '/turkey-tech-visa',
    '/start-up-chile', '/israel', '/which-path', '/mentorship', '/app', '/pricing', '/faq', '/blog', '/about',
    '/partners', '/webinar', '/contact', '/data-reports',
  ];
  for (const [locale, old] of [['en', OLD_EN], ['fa', OLD_FA]] as const) {
    it(`the ${locale} footer keeps every link the old menus had`, () => {
      const footer = new Set(footerColumns(locale).flatMap((c) => c.groups.flatMap((g) => g.links.map((l) => l.href))));
      expect(old.filter((h) => !footer.has(h))).toEqual([]);
    });
  }
});

describe('trackNav', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('is a no-op without gtag', () => {
    vi.stubGlobal('window', {});
    expect(() => trackNav({ locale: 'en', area: 'header', label: 'Pricing', href: '/pricing' })).not.toThrow();
  });

  it('sends nav_click with where and what', () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    trackNav({ locale: 'fa', area: 'drawer', label: 'قیمت‌ها', href: '/pricing' });
    expect(gtag).toHaveBeenCalledWith('event', 'nav_click', {
      locale: 'fa', nav_area: 'drawer', link_text: 'قیمت‌ها', link_url: '/pricing',
    });
  });
});
