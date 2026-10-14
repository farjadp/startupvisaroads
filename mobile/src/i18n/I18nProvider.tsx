import { getLocales } from 'expo-localization';
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { DevSettings, I18nManager, Platform, Settings } from 'react-native';
import * as Updates from 'expo-updates';
import { useStore } from '@/state/store';
import { pick, type Resolved, type Text } from '@/content/text';
import { fmtCount, fmtDate, fmtMoney } from './format';
import { LOCALES, pickDeviceLocale, type Locale, type LocaleMeta } from './locales';
import ar from './messages/ar';
import en, { type Messages } from './messages/en';
import fa from './messages/fa';
import fr from './messages/fr';
import zh from './messages/zh';

const CATALOGUES: Record<Locale, Messages> = { en, fa, fr, zh, ar };

type Vars = Record<string, string | number>;

type I18n = {
  locale: Locale;
  meta: LocaleMeta;
  t: (path: string, vars?: Vars) => string;
  pick: (text: Text) => Resolved;
  count: (n: number) => string;
  money: (n: number, currency: string) => string;
  date: (d: Date | string) => string;
};

const Ctx = createContext<I18n>(null as never);

function lookup(cat: Messages, path: string): string | undefined {
  const v = path.split('.').reduce<unknown>((acc, k) => (acc as Record<string, unknown> | undefined)?.[k], cat);
  return typeof v === 'string' ? v : undefined;
}

export function deviceLocale(): Locale {
  return pickDeviceLocale(getLocales().map((l) => l.languageTag));
}

/** True when switching to `locale` needs the app to restart for layout direction. */
export function needsDirectionRestart(locale: Locale): boolean {
  return LOCALES[locale].rtl !== I18nManager.isRTL;
}

const RESTART_KEY = 'VisaRoads_directionRestartAt';

/**
 * True when a restart into this locale's direction happened moments ago. On iOS the restart
 * cannot change direction in the same process (see below), so the app must
 * not restart again: it lays out in the chosen direction from the root view
 * instead, and the next launch is native in that direction.
 */
export function directionRestartJustTried(locale: Locale): boolean {
  if (Platform.OS !== 'ios') return false;
  const at: unknown = Settings.get(RESTART_KEY);
  const tried: unknown = Settings.get(`${RESTART_KEY}_locale`);
  return typeof at === 'number' && tried === locale && Date.now() - at < 20000;
}

/** iOS only: the app's own language (AppleLanguages), read by the system at the next launch. */
export function syncAppLanguage(locale: Locale): void {
  if (Platform.OS !== 'ios') return;
  const current: unknown = Settings.get('AppleLanguages');
  if (!Array.isArray(current) || current[0] !== locale) Settings.set({ AppleLanguages: [locale] });
}

/** Applies the locale's layout direction and restarts so every screen lays out again. */
export async function applyDirectionAndRestart(locale: Locale): Promise<void> {
  const rtl = LOCALES[locale].rtl;
  // iOS: expo-localization (supportsRTL) resets forceRTL on every launch to
  // the direction of the app's preferred language, which would undo
  // forceRTL below and loop the restart. Setting the app's own language
  // (the per-app language iOS offers in Settings) makes that reset agree.
  if (Platform.OS === 'ios') Settings.set({ AppleLanguages: [locale], [RESTART_KEY]: Date.now(), [`${RESTART_KEY}_locale`]: locale });
  I18nManager.allowRTL(rtl);
  I18nManager.forceRTL(rtl);
  // A development build's reloadAsync can neither reload nor reject, which
  // left the app on the splash; the dev reloader is the one that works there.
  if (__DEV__) return DevSettings.reload();
  try {
    await Updates.reloadAsync();
  } catch {
    // expo-updates cannot reload a development build; the dev menu can.
    DevSettings.reload();
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const { state } = useStore();
  const locale = state.locale ?? deviceLocale();

  const t = useCallback(
    (path: string, vars?: Vars) => {
      const raw = lookup(CATALOGUES[locale], path) ?? lookup(en, path) ?? path;
      return vars ? raw.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`)) : raw;
    },
    [locale],
  );

  const value = useMemo<I18n>(
    () => ({
      locale,
      meta: LOCALES[locale],
      t,
      pick: (text) => pick(text, locale),
      count: (n) => fmtCount(n, locale),
      money: (n, c) => fmtMoney(n, c, locale),
      date: (d) => fmtDate(d, locale),
    }),
    [locale, t],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
