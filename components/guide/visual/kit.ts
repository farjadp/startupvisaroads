// ============================================================================
// components/guide/visual/kit.ts
// Shared tokens for the guide visual kit: the two scripts' display fonts, the
// fold copy, and a digit helper. Every kit component reads the route palette
// set by RouteProvider (--ra accent, --ra-ink, --ra-text, --rp primary,
// --rd deep, --rs soft), so one component serves every country's colours.
// ============================================================================
import { toPersianDigits } from '@/lib/fa/format';

export type Lang = 'en' | 'fa';
/** The surface the visual sits on, so tiles contrast with their section. */
export type Surface = 'paper' | 'white';

export const display = (lang: Lang) => (lang === 'fa' ? 'font-estedad font-black' : 'font-serif');
export const text = (lang: Lang) => (lang === 'fa' ? '' : 'font-sans');
/** Small caps-style label. Persian is never letter-spaced (it breaks joining). */
export const eyebrow = (lang: Lang) => (lang === 'fa' ? 'text-xs font-bold' : 'font-sans text-xs font-bold uppercase tracking-[0.16em]');
export const tile = (surface: Surface) => (surface === 'white' ? 'bg-[#F2F0E9]' : 'bg-white');
export const num = (n: number | string, lang: Lang) => (lang === 'fa' ? toPersianDigits(n) : String(n));
