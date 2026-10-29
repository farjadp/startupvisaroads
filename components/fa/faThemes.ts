// ============================================================================
// components/fa/faThemes.ts
// The palette of each Persian guide — the same one its English twin uses, so
// the two languages read as one site. Matched on the guide's path, like the
// flag in lib/fa/flags.ts. Values are copied from the English pages' THEME
// constants; keep them in step if a twin's palette changes.
// ============================================================================
import type { RouteTheme } from '@/components/route/RouteProgress';

const FINLAND: RouteTheme = { accent: '#00BFA5', accentInk: '#00261F', accentText: '#00796B', primary: '#002F6C', deep: '#001B3D', soft: '#DDF4EF' };
const DENMARK: RouteTheme = { accent: '#C8102E', accentInk: '#FFFFFF', accentText: '#C8102E', primary: '#0d1017', deep: '#0a0e1a', soft: '#FBE9EC', accentOnDark: '#FF7A8C' };
const NETHERLANDS: RouteTheme = { accent: '#F97316', accentInk: '#1a1a1a', accentText: '#B4400A', primary: '#21468B', deep: '#1a1a1a', soft: '#FDEBDC' };
const ESTONIA: RouteTheme = { accent: '#0072CE', accentInk: '#FFFFFF', accentText: '#005EA8', primary: '#003A70', deep: '#0A1726', soft: '#E2EEFA', accentOnDark: '#7DB9F0' };
const ITALY: RouteTheme = { accent: '#34D17D', accentInk: '#0A0E1A', accentText: '#00753A', primary: '#00753A', deep: '#0D1017', soft: '#DDF3E6' };
const SPAIN: RouteTheme = { accent: '#FFC400', accentInk: '#1a1a1a', accentText: '#A30F1F', primary: '#A30F1F', deep: '#2B0A0F', soft: '#FFF4CC', accentOnDark: '#FFC400' };
const BULGARIA: RouteTheme = { accent: '#00966E', accentInk: '#00140E', accentText: '#00704F', primary: '#A51E10', deep: '#0B2A21', soft: '#DCF1E9', accentOnDark: '#2FC594' };
const TURKEY: RouteTheme = { accent: '#E30A17', accentInk: '#FFFFFF', accentText: '#B5000F', primary: '#A3000F', deep: '#0A0E1A', soft: '#FCE6E7', accentOnDark: '#FF5A63' };
const AUSTRALIA: RouteTheme = { accent: '#00843D', accentInk: '#FFFFFF', accentText: '#006B31', primary: '#0d1017', deep: '#0a0e1a', soft: '#E3F2E8', accentOnDark: '#5cb87f' };
const CANADA: RouteTheme = { accent: '#D80027', accentInk: '#FFFFFF', accentText: '#D80027', primary: '#1a1a1a', deep: '#1a1a1a', soft: '#FBE5E9', accentOnDark: '#FF6B7F' };
const CANADA_SUV: RouteTheme = { accent: '#D52B1E', accentInk: '#FFFFFF', accentText: '#B01C12', primary: '#7F1D16', deep: '#2A0C0A', soft: '#FBE7E4', accentOnDark: '#FF8F85' };
const ISRAEL: RouteTheme = { accent: '#0038B8', accentInk: '#FFFFFF', accentText: '#0038B8', primary: '#0038B8', deep: '#0a0e1a', soft: '#E6ECFA', accentOnDark: '#4d7fff' };
// No English twin in this design yet: the flag's own blue and red.
const UK: RouteTheme = { accent: '#C8102E', accentInk: '#FFFFFF', accentText: '#C8102E', primary: '#012169', deep: '#0B1534', soft: '#FBE9EC', accentOnDark: '#FF7A8C' };
const USA: RouteTheme = { accent: '#B31942', accentInk: '#FFFFFF', accentText: '#B31942', primary: '#0A3161', deep: '#0B1A33', soft: '#F8E6EB', accentOnDark: '#FF7A97' };
// The site's own colours, for any guide not listed.
const DEFAULT: RouteTheme = { accent: '#CCFF00', accentInk: '#1a1a1a', accentText: '#1a1a1a', primary: '#1a1a1a', deep: '#1a1a1a', soft: '#F1FFC2' };

const BY_PATH: Record<string, RouteTheme> = {
  '/europe/finland': FINLAND,
  '/europe/denmark': DENMARK,
  '/europe/netherlands': NETHERLANDS,
  '/europe/estonia': ESTONIA,
  '/europe/italy': ITALY,
  '/europe/spain': SPAIN,
  '/europe/bulgaria': BULGARIA,
  '/turkey-tech-visa': TURKEY,
  '/australia': AUSTRALIA,
  '/canada-startup-visa': CANADA_SUV,
  '/israel': ISRAEL,
  '/uk/innovator-founder': UK,
};

export function themeFor(path: string): RouteTheme {
  if (BY_PATH[path]) return BY_PATH[path];
  if (path.startsWith('/canada-startup-visa/')) return CANADA_SUV;
  if (path.startsWith('/pnp')) return CANADA;
  if (path.startsWith('/usa')) return USA;
  return DEFAULT;
}
