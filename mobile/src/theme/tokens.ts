// Reads design/tokens.json (the one source shared with the website) and
// resolves it into what React Native needs. Nothing in the app hard-codes a
// brand value; if a colour or size is wrong, fix it in tokens.json.
import raw from '@design/tokens.json';

type Raw = Record<string, any>;
const tokens = raw as Raw;

function resolve(value: unknown): string {
  if (typeof value !== 'string') return String(value);
  const ref = /^\{(.+)\}$/.exec(value);
  if (!ref) return value;
  const node = ref[1].split('.').reduce<Raw>((acc, k) => acc?.[k], tokens);
  return resolve(node?.$value);
}

export type Mode = 'paper' | 'night';

export type Palette = {
  bg: string;
  fg: string;
  fgMuted: string;
  fgFaint: string;
  rule: string;
  accent: string;
  onAccent: string;
  indicator: string;
  progressTrack: string;
  progressFill: string;
  buttonBg: string;
  buttonFg: string;
  buttonBgPressed: string;
  rowPressed: string;
  disabledBg: string;
  disabledFg: string;
  focus: string;
  error: string;
  photoPlateBg: string;
  photoPlateFg: string;
};

const camel = (k: string) => k.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

function palette(mode: Mode): Palette {
  const roles = tokens.theme[mode] as Raw;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(roles)) {
    if (v && typeof v === 'object' && '$value' in v) out[camel(k)] = resolve((v as Raw).$value);
  }
  return out as Palette;
}

export const palettes: Record<Mode, Palette> = { paper: palette('paper'), night: palette('night') };

export const raw_acid = resolve(tokens.color.acid.$value);
export const raw_ink = resolve(tokens.color.ink.$value);
export const raw_paper = resolve(tokens.color.paper.$value);

export type TypeRole =
  | 'display-xl'
  | 'display-l'
  | 'display-m'
  | 'figure'
  | 'headline'
  | 'body'
  | 'row'
  | 'caption'
  | 'label'
  | 'tab-label';

export type TypeSpec = {
  fontSize: number;
  lineHeight: number;
  letterSpacingEm: number;
  weight: number;
  uppercase: boolean;
  maxScale: number;
};

function spec(name: string, script: Script): TypeSpec {
  const node = tokens.type[name];
  const v = node.$value;
  const app = node.$extensions?.app ?? {};
  // Estedad's ascent is taller than DM Serif's: a Latin-tight line clips its digits.
  const arabicLine = script === 'arabic' ? app.nativeLineHeightArabic : undefined;
  return {
    fontSize: v.fontSize,
    lineHeight: arabicLine ?? app.nativeLineHeight ?? v.lineHeight,
    letterSpacingEm: v.letterSpacing ?? 0,
    weight: v.fontWeight,
    uppercase: v.textTransform === 'uppercase',
    maxScale: app.maxScale ?? 2,
  };
}

/** Per script, the token name each role resolves to. */
export type Script = 'latin' | 'arabic' | 'han';

const ROLE_BY_SCRIPT: Record<Script, Record<TypeRole, string>> = {
  latin: {
    'display-xl': 'display-xl',
    'display-l': 'display-l',
    'display-m': 'display-m',
    figure: 'figure',
    headline: 'headline',
    body: 'body',
    row: 'row',
    caption: 'caption',
    label: 'label-latin',
    'tab-label': 'tab-label',
  },
  arabic: {
    'display-xl': 'display-arabic-xl',
    'display-l': 'display-arabic-l',
    'display-m': 'display-arabic-l',
    figure: 'figure',
    headline: 'headline',
    body: 'body-arabic',
    row: 'row',
    caption: 'caption',
    label: 'label-arabic',
    'tab-label': 'tab-label',
  },
  han: {
    'display-xl': 'display-han-l',
    'display-l': 'display-han-l',
    'display-m': 'display-han-l',
    figure: 'figure',
    headline: 'headline',
    body: 'body-han',
    row: 'row',
    caption: 'caption',
    label: 'label-han',
    'tab-label': 'tab-label',
  },
};

export function typeSpec(role: TypeRole, script: Script): TypeSpec {
  const s = spec(ROLE_BY_SCRIPT[script][role], script);
  // Arabic and Han scripts never take letter-spacing or uppercase (Brand Book).
  if (script !== 'latin') return { ...s, letterSpacingEm: 0, uppercase: false };
  return s;
}

const px = (v: string) => parseFloat(v);

export const space = {
  s1: px(tokens.space['1'].$value),
  s2: px(tokens.space['2'].$value),
  s3: px(tokens.space['3'].$value),
  s4: px(tokens.space['4'].$value),
  s5: px(tokens.space['5'].$value),
  s6: px(tokens.space['6'].$value),
  s8: px(tokens.space['8'].$value),
  s10: px(tokens.space['10'].$value),
};

export const size = {
  touchMin: px(tokens.size['touch-min'].$value),
  touchMinAndroid: px(tokens.size['touch-min-android'].$value),
  button: px(tokens.size.button.$value),
  chip: px(tokens.size.chip.$value),
  row: px(tokens.size.row.$value),
  icon: px(tokens.size.icon.$value),
  thumbnail: px(tokens.size.thumbnail.$value),
  ruleAccent: px(tokens.size['rule-accent'].$value),
  progress: px(tokens.size.progress.$value),
};

export const motion = {
  ease: tokens.motion.ease.$value as [number, number, number, number],
  state: px(tokens.motion.duration.state.$value),
  step: px(tokens.motion.duration.step.$value),
  reveal: px(tokens.motion.duration.reveal.$value),
};
