import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './routing';
import { verifyJWT, getJwtSecret } from './lib/auth';
import { faRedirectTarget } from './lib/fa/redirects';

const intlMiddleware = createMiddleware(routing);

const CANONICAL_HOST = 'visaroads.com';
const ALIAS_HOSTS = new Set(['www.visaroads.com', 'startupvisaroads.com', 'www.startupvisaroads.com']);

// Returns the verified admin payload, or null. Fails closed: if the JWT secret
// is misconfigured we treat the request as unauthenticated rather than crashing.
async function getAdminPayload(request: NextRequest): Promise<any | null> {
  const sessionCookie = request.cookies.get('admin_session')?.value;
  if (!sessionCookie) return null;
  try {
    const payload = await verifyJWT(sessionCookie, getJwtSecret());
    return payload && payload.username ? payload : null;
  } catch {
    return null;
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // One canonical host: www and the old startupvisaroads.com domain answer
  // with a 301 to visaroads.com. Behind Cloud Run request.url carries the
  // internal host, so read the host the visitor actually asked for. The
  // run.app URL (Cloud Scheduler) and localhost are not in the list.
  const host = (request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '').toLowerCase().split(':')[0];
  if (ALIAS_HOSTS.has(host)) {
    return NextResponse.redirect(`https://${CANONICAL_HOST}${pathname}${request.nextUrl.search}`, 301);
  }

  const isAdminPath = /^\/(en|fa)\/admin(\/|$)/.test(pathname) || pathname === '/admin';
  const isLoginPage = /^\/(en|fa)\/admin\/login(\/|$)/.test(pathname) || pathname === '/admin/login';

  if (isAdminPath && !isLoginPage) {
    const payload = await getAdminPayload(request);
    if (!payload) {
      const localeMatch = pathname.match(/^\/(en|fa)/);
      const locale = localeMatch ? localeMatch[1] : 'en';

      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isLoginPage) {
    const payload = await getAdminPayload(request);
    if (payload) {
      const localeMatch = pathname.match(/^\/(en|fa)/);
      const locale = localeMatch ? localeMatch[1] : 'en';
      return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
    }
  }

  // A /fa path with no Persian page goes to English with a 301, so the
  // signal is permanent for crawlers and the reader never sees English
  // rendered inside the Persian shell.
  const faTarget = faRedirectTarget(pathname);
  if (faTarget) {
    return NextResponse.redirect(new URL(faTarget, request.url), 301);
  }

  return intlMiddleware(request);
}

export const config = {
    // Match all pathnames except for:
    // - /api routes
    // - /_next (Next.js internals)
    // - /_vercel (Vercel internals)
    // - static files (paths with dots)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
