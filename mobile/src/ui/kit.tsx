// Building blocks. Square, ruled, flat (no shadows), sized from tokens,
// every control with a role, a label and its state.
import * as WebBrowser from 'expo-web-browser';
import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Platform, Pressable, ScrollView, View, useWindowDimensions, type ImageSourcePropType, type ViewStyle } from 'react-native';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';
import { useI18n } from '@/i18n/I18nProvider';
import type { Locale } from '@/i18n/locales';
import { useTheme } from '@/theme/ThemeProvider';
import { size, space } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { T } from './T';

const HIT = Platform.OS === 'android' ? size.touchMinAndroid : size.touchMin;

/** A scrolling screen. Every screen scrolls (spec 15); insets come from the device, never hard-coded. */
export function Screen({
  children,
  edges = ['top'],
  footer,
  contentStyle,
  scrim = edges.includes('top'),
  stickyFooter = true,
  background,
}: {
  children: ReactNode;
  /** Drawn behind the content, under the scroll (the onboarding flags). */
  background?: ReactNode;
  edges?: Edge[];
  footer?: ReactNode;
  contentStyle?: ViewStyle;
  /** Paints the status-bar area so scrolled content never runs under the clock (screens without a native header). */
  scrim?: boolean;
  /** False keeps the footer in the scroll flow (Welcome: a fixed footer hid the language chips on short phones). */
  stickyFooter?: boolean;
}) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  // A sticky footer only while text is near default size; above that it follows the content (spec 15).
  const sticky = footer && stickyFooter && fontScale <= 1.3;
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      {background}
      <ScrollView
        // Screens without a native header pad for the safe area themselves; screens with one let iOS inset under it.
        contentInsetAdjustmentBehavior={edges.includes('top') ? 'never' : 'automatic'}
        contentContainerStyle={[
          {
            // Android has no automatic content inset: a header-less screen pads for the status bar itself.
            paddingTop: edges.includes('top') || (scrim && Platform.OS === 'android') ? insets.top + space.s4 : space.s4,
            paddingBottom: sticky ? space.s6 : Math.max(insets.bottom, space.s4) + space.s6,
            paddingHorizontal: space.s6,
            gap: space.s5,
          },
          contentStyle,
        ]}
      >
        {children}
        {footer && !sticky ? <View style={{ gap: space.s3 }}>{footer}</View> : null}
      </ScrollView>
      {scrim ? <View accessible={false} pointerEvents="none" style={{ position: 'absolute', top: 0, start: 0, end: 0, height: insets.top, backgroundColor: c.bg }} /> : null}
      {sticky ? (
        <View style={{ paddingHorizontal: space.s6, paddingTop: space.s3, paddingBottom: Math.max(insets.bottom, space.s4), gap: space.s3, backgroundColor: c.bg, borderTopWidth: 1, borderTopColor: c.rule }}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}

export function AcidRule() {
  const { c } = useTheme();
  return <View accessible={false} style={{ width: 48, height: size.ruleAccent, backgroundColor: c.accent }} />;
}

export function Heading({ children, role = 'display-l', italicTail }: { children: string; role?: 'display-xl' | 'display-l' | 'display-m'; italicTail?: string }) {
  const { meta } = useI18n();
  return (
    <View style={{ gap: space.s3 }}>
      <T variant={role} accessibilityRole="header">
        {children}
        {italicTail ? (
          <T variant={role} tone="fgFaint" italic={meta.script === 'latin'}>
            {' '}
            {italicTail}
          </T>
        ) : null}
      </T>
      <AcidRule />
    </View>
  );
}

export function Label({ children }: { children: string }) {
  return (
    <T variant="label" tone="fgMuted" accessibilityRole="header">
      {children}
    </T>
  );
}

type ButtonKind = 'primary' | 'secondary' | 'link';

export function Button({
  label,
  onPress,
  kind = 'primary',
  icon = 'arrow',
  disabled,
  hint,
  lang,
}: {
  label: string;
  onPress: () => void;
  kind?: ButtonKind;
  icon?: IconName | null;
  disabled?: boolean;
  hint?: string;
  /** The label's language when it is not the UI's (the language picker). */
  lang?: Locale;
}) {
  const { c } = useTheme();
  if (kind === 'link') {
    return (
      <Pressable onPress={onPress} accessibilityRole="link" accessibilityHint={hint} hitSlop={8} style={{ minHeight: HIT, justifyContent: 'center' }}>
        {({ pressed }) => (
          <T variant="row" weight="bold" lang={lang} style={{ textDecorationLine: 'underline', opacity: pressed ? 0.6 : 1 }}>
            {label}
          </T>
        )}
      </Pressable>
    );
  }
  const primary = kind === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      accessibilityHint={hint}
      style={({ pressed }) => ({
        minHeight: size.button,
        paddingHorizontal: space.s5,
        paddingVertical: space.s3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: space.s3,
        backgroundColor: disabled ? c.disabledBg : primary ? (pressed ? c.buttonBgPressed : c.buttonBg) : pressed ? c.rowPressed : 'transparent',
        borderWidth: primary ? 0 : 1,
        borderColor: c.fg,
      })}
    >
      <T variant="row" weight="bold" lang={lang} tone={disabled ? 'disabledFg' : primary ? 'buttonFg' : 'fg'} style={{ flexShrink: 1 }}>
        {label}
      </T>
      {icon ? <Icon name={icon} tone={disabled ? 'disabledFg' : primary ? 'buttonFg' : 'fg'} /> : null}
    </Pressable>
  );
}

export function Chip({ label, selected, onPress, lang }: { label: string; selected: boolean; onPress: () => void; lang?: string }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      {...(lang ? { accessibilityLanguage: lang } : null)}
      hitSlop={(HIT - size.chip) / 2}
      style={({ pressed }) => ({
        minHeight: size.chip,
        paddingHorizontal: space.s4,
        justifyContent: 'center',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: c.fg,
        backgroundColor: selected ? c.fg : pressed ? c.rowPressed : 'transparent',
      })}
    >
      <T variant="row" weight="bold" tone={selected ? 'buttonFg' : 'fg'} lang={lang as never}>
        {label}
      </T>
    </Pressable>
  );
}

export type Tone = 'met' | 'close' | 'not-yet' | 'not-started' | 'done';

/** Status in words, never colour alone. "close" sits on acid (ink text, 14.8:1). */
export function StatusTag({ status, label }: { status: Tone; label: string }) {
  const { c } = useTheme();
  if (status === 'close') {
    return (
      <View style={{ paddingHorizontal: space.s2, paddingVertical: 2, backgroundColor: c.accent }}>
        <T variant="row" weight="bold" tone="onAccent">
          {label}
        </T>
      </View>
    );
  }
  const strong = status === 'met' || status === 'done';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      {strong ? <Icon name="check" size={16} /> : null}
      <T variant="row" weight="bold" tone={strong ? 'fg' : 'fgMuted'}>
        {label}
      </T>
    </View>
  );
}

/** One accessible row: "<condition>: <status>" (spec 20). */
export function StatusRow({ icon, label, status, statusLabel }: { icon?: IconName; label: string; status: Tone; statusLabel: string }) {
  const { c } = useTheme();
  const { fontScale } = useWindowDimensions();
  // At large text the status moves under the condition, so words are never broken mid-word.
  const stacked = fontScale > 1.5;
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${statusLabel}`}
      style={{ flexDirection: 'row', alignItems: stacked ? 'flex-start' : 'center', gap: space.s3, minHeight: size.row, paddingVertical: space.s2, borderBottomWidth: 1, borderBottomColor: c.rule }}
    >
      {icon ? <Icon name={icon} /> : null}
      <View style={{ flex: 1, flexDirection: stacked ? 'column' : 'row', alignItems: stacked ? 'flex-start' : 'center', gap: stacked ? space.s1 : space.s3 }}>
        <T variant="row" style={stacked ? undefined : { flex: 1 }}>
          {label}
        </T>
        <StatusTag status={status} label={statusLabel} />
      </View>
    </View>
  );
}

export function Ruled({ children }: { children: ReactNode }) {
  const { c } = useTheme();
  return <View style={{ borderTopWidth: 1, borderTopColor: c.fg }}>{children}</View>;
}

/** Whole-row checkbox (spec 7). */
export function CheckRow({ label, checked, onToggle, trailing }: { label: string; checked: boolean; onToggle: () => void; trailing?: string }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.s3,
        minHeight: size.row + 4,
        paddingVertical: space.s2,
        borderBottomWidth: 1,
        borderBottomColor: c.rule,
        backgroundColor: pressed ? c.rowPressed : 'transparent',
      })}
    >
      <View style={{ width: 22, height: 22, borderWidth: 1.5, borderColor: c.fg, backgroundColor: checked ? c.fg : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
        {checked ? <Icon name="check" size={16} tone="buttonFg" /> : null}
      </View>
      <T variant="row" style={{ flex: 1, textDecorationLine: checked ? 'line-through' : 'none' }} tone={checked ? 'fgMuted' : 'fg'}>
        {label}
      </T>
      {trailing ? (
        <T variant="row" weight="bold" importantForAccessibility="no">
          {trailing}
        </T>
      ) : null}
    </Pressable>
  );
}

/** Radio option (spec 6). */
export function RadioRow({ label, selected, onPress, muted }: { label: string; selected: boolean; onPress: () => void; muted?: boolean }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.s3,
        minHeight: 60,
        paddingVertical: space.s3,
        paddingHorizontal: selected ? space.s3 : 0,
        marginHorizontal: selected ? -space.s3 : 0,
        borderBottomWidth: 1,
        borderBottomColor: c.rule,
        backgroundColor: selected ? c.fg : pressed ? c.rowPressed : 'transparent',
      })}
    >
      <T variant="body" weight={selected ? 'bold' : 'medium'} tone={selected ? 'buttonFg' : muted ? 'fgMuted' : 'fg'} style={{ flex: 1 }}>
        {label}
      </T>
      <View style={{ width: 20, height: 20, borderRadius: 999, borderWidth: selected ? 0 : 1.5, borderColor: c.fg, backgroundColor: selected ? c.accent : 'transparent' }} />
    </Pressable>
  );
}

/** A navigation row with a chevron. */
export function LinkRow({ label, sub, icon, onPress, external, lang }: { label: string; sub?: string; icon?: IconName; onPress: () => void; external?: boolean; lang?: Locale }) {
  const { c } = useTheme();
  const { t } = useI18n();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={external ? 'link' : 'button'}
      accessibilityHint={external ? t('common.opensBrowser') : undefined}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.s3,
        minHeight: 60,
        paddingVertical: space.s3,
        borderBottomWidth: 1,
        borderBottomColor: c.rule,
        backgroundColor: pressed ? c.rowPressed : 'transparent',
      })}
    >
      {icon ? <Icon name={icon} /> : null}
      <View style={{ flex: 1, gap: 2 }}>
        <T variant="row" weight="bold" lang={lang}>
          {label}
        </T>
        {sub ? (
          <T variant="caption" tone="fgMuted">
            {sub}
          </T>
        ) : null}
      </View>
      <Icon name={external ? 'external' : 'chevron'} tone="fgMuted" />
    </Pressable>
  );
}

export function Progress({ value }: { value: number }) {
  const { c } = useTheme();
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants" style={{ height: size.progress, backgroundColor: c.progressTrack }}>
      <View style={{ width: `${Math.max(0, Math.min(100, value))}%`, height: size.progress, backgroundColor: c.progressFill }} />
    </View>
  );
}

/** Source line with its checked date: every figure carries one (Brand Book trust rule 4). */
export function SourceLine({ url, updated, onOpen }: { url: string; updated: string; onOpen?: () => void }) {
  const { t, date } = useI18n();
  const host = url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
  return (
    <Pressable
      onPress={() => {
        onOpen?.();
        void WebBrowser.openBrowserAsync(url);
      }}
      accessibilityRole="link"
      accessibilityHint={t('common.opensBrowser')}
      style={{ flexDirection: 'row', gap: space.s2, alignItems: 'flex-start', minHeight: HIT, paddingVertical: space.s2 }}
    >
      <Icon name="shield" size={16} tone="fgMuted" />
      <T variant="caption" tone="fgMuted" style={{ flex: 1 }}>
        {t('common.sourceChecked', { source: host, date: date(updated) })}{' '}
        <T variant="caption" weight="bold" style={{ textDecorationLine: 'underline' }}>
          {t('common.officialSource')}
        </T>
      </T>
    </Pressable>
  );
}

export function Disclaimer({ onAbout }: { onAbout?: () => void }) {
  const { t } = useI18n();
  return (
    <View style={{ gap: space.s1 }}>
      <T variant="caption" tone="fgMuted">
        {t('common.disclaimer')}
      </T>
      {onAbout ? <Button kind="link" label={t('common.aboutLink')} onPress={onAbout} /> : null}
    </View>
  );
}

export function Banner({ text, action, onAction }: { text: string; action?: string; onAction?: () => void }) {
  const { c } = useTheme();
  return (
    <View accessibilityRole="alert" style={{ flexDirection: 'row', alignItems: 'center', gap: space.s3, padding: space.s3, borderWidth: 1, borderColor: c.fg }}>
      <Icon name="alert" />
      <T variant="row" style={{ flex: 1 }}>
        {text}
      </T>
      {action && onAction ? <Button kind="link" label={action} onPress={onAction} /> : null}
    </View>
  );
}

/** A full-bleed photograph with a place caption. Never mirrored. */
export function Hero({ source, alt, caption, height = 200 }: { source: ImageSourcePropType; alt: string; caption?: string; height?: number }) {
  const { c } = useTheme();
  const { fontScale } = useWindowDimensions();
  const h = fontScale > 1.5 ? Math.round(height * 0.6) : height;
  return (
    <View style={{ marginHorizontal: -space.s6, height: h, backgroundColor: c.rule }}>
      <Image source={source} style={{ width: '100%', height: '100%' }} contentFit="cover" accessibilityLabel={alt} accessible accessibilityRole="image" />
      {caption ? (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ position: 'absolute', end: space.s3, bottom: space.s3, maxWidth: '80%', paddingHorizontal: space.s2, paddingVertical: 4, backgroundColor: c.photoPlateBg }}>
          <T variant="caption" tone="photoPlateFg" weight="bold" importantForAccessibility="no" maxFontSizeMultiplier={1.5} numberOfLines={2}>
            {caption}
          </T>
        </View>
      ) : null}
      <View accessible={false} style={{ position: 'absolute', start: space.s6, bottom: 0, width: 48, height: 4, backgroundColor: c.accent }} />
    </View>
  );
}
