// ============================================================================
// lib/fa/redirects.ts
// A /fa URL that has no Persian page must go to English, not render English
// copy inside the Persian shell. Serving English under /fa is what made the
// old mirror worthless: the reader loses trust and Google sees a duplicate.
// ============================================================================
import { isFaPath } from './paths';

/** Persian sub-trees that exist but are not in the static allowlist. */
const DYNAMIC_PREFIXES = ['/blog/', '/admin'];

/** `/fa/<retired>` -> `/en/<retired>`; null when the request should proceed. */
export function faRedirectTarget(pathname: string): string | null {
  if (!pathname.startsWith('/fa')) return null;

  const rest = pathname.slice(3); // '' | '/' | '/some/path'
  if (rest === '' || rest === '/') return null;
  if (!rest.startsWith('/')) return null; // e.g. '/false-positive'

  if (DYNAMIC_PREFIXES.some((p) => rest === p.replace(/\/$/, '') || rest.startsWith(p))) {
    return null;
  }
  if (isFaPath(rest)) return null;

  return `/en${rest}`;
}
