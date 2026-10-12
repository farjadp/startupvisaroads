import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'fa'],

    // Used when no locale matches
    defaultLocale: 'en',

    // next-intl would otherwise send an HTTP Link header claiming every page
    // exists in both locales, with x-default on the unprefixed URL. /fa is not
    // a mirror of /en, so that header advertised redirects and contradicted
    // the per-page hreflang built by buildAlternates() in lib/seo.ts.
    alternateLinks: false
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
