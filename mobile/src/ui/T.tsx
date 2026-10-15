// The one text component. Type comes from a token role and the active
// locale's script, so no screen ever picks a font or a size by hand.
import { Children, type ReactNode, type Ref } from 'react';
import { Text, useWindowDimensions, type TextProps, type TextStyle } from 'react-native';
import { isolateLatin } from '@/i18n/bidi';
import { useI18n } from '@/i18n/I18nProvider';
import type { Locale } from '@/i18n/locales';
import { LOCALES } from '@/i18n/locales';
import { fontFor, type Weight } from '@/theme/fonts';
import { useTheme } from '@/theme/ThemeProvider';
import { space, typeSpec, type Palette, type TypeRole } from '@/theme/tokens';

const DISPLAY: TypeRole[] = ['display-xl', 'display-l', 'display-m', 'figure', 'headline'];
const DEFAULT_WEIGHT: Partial<Record<TypeRole, Weight>> = { row: 'medium', label: 'bold', 'tab-label': 'bold' };

export type TProps = TextProps & {
  variant?: TypeRole;
  tone?: keyof Pick<Palette, 'fg' | 'fgMuted' | 'fgFaint' | 'error' | 'buttonFg' | 'onAccent' | 'photoPlateFg' | 'disabledFg'>;
  weight?: Weight;
  italic?: boolean;
  /** Set when the text is in a language other than the UI's (e.g. English content in an fr screen). */
  lang?: Locale;
  style?: TextStyle | TextStyle[];
  ref?: Ref<Text>;
};

/** Rough advance of a Latin character, in em, for deciding whether a name fits on one line. */
const LATIN_EM = 0.55;

export function T({ variant: role = 'body', tone = 'fg', weight, italic, lang, style, children, ...rest }: TProps) {
  const { meta } = useI18n();
  const { c } = useTheme();
  const { fontScale, width } = useWindowDimensions();
  const textMeta = lang ? LOCALES[lang] : meta;
  const s = typeSpec(role, textMeta.script);
  const display = DISPLAY.includes(role);
  const font = fontFor(textMeta.script, display, weight ?? DEFAULT_WEIGHT[role] ?? 'regular', italic && textMeta.script === 'latin');
  // English inside a right-to-left screen stays left-to-right (spec, Localisation).
  const foreignLtr = lang && !LOCALES[lang].rtl && meta.rtl;
  // Latin names inside right-to-left text are isolated so their parentheses and
  // word order survive the bidi algorithm (src/i18n/bidi.ts). A name is kept on
  // one line only while it fits in most of the screen's text width at the
  // current text size; otherwise it may wrap rather than break mid-word.
  let content: ReactNode = children;
  if (textMeta.rtl && !foreignLtr) {
    const keepWhole = Math.floor((0.85 * (width - 2 * space.s6)) / (LATIN_EM * s.fontSize * Math.min(fontScale, s.maxScale)));
    const iso = (n: ReactNode) => (typeof n === 'string' ? isolateLatin(n, keepWhole) : n);
    content = Array.isArray(children) ? Children.map(children, iso) : iso(children);
  }
  return (
    <Text
      allowFontScaling
      maxFontSizeMultiplier={s.maxScale}
      {...(lang ? { accessibilityLanguage: lang } : null)}
      style={[
        {
          color: c[tone],
          fontSize: s.fontSize,
          // Above the larger default text sizes the font's own line height is used: a fixed
          // line height dropped the last line of wrapped text at iOS accessibility sizes.
          lineHeight: fontScale > 1.3 ? undefined : Math.round(s.fontSize * s.lineHeight),
          letterSpacing: s.letterSpacingEm * s.fontSize,
          textTransform: s.uppercase ? 'uppercase' : 'none',
          ...font,
          // Natural alignment follows the text's language, not only the native layer
          // (which on iOS can lag one launch behind a language switch).
          writingDirection: textMeta.rtl ? 'rtl' : 'ltr',
        },
        // The text node's own direction, so RN does not swap 'left' to right inside an RTL layout.
        foreignLtr ? { direction: 'ltr', writingDirection: 'ltr', textAlign: 'left' } : null,
        ...(Array.isArray(style) ? style : [style]),
      ]}
      {...rest}
    >
      {content}
    </Text>
  );
}
