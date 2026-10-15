// First screen on a new install (onboarding 2C, Farjad 15 Oct 2026): on ink,
// straight out of the intro. "Hello" cycles through the five languages with
// that language's flag faded behind it; choosing one stops on it. Flags are
// mood only: each language is always named in its own script, and nothing
// is applied until Continue, so a right-to-left choice restarts the app here,
// before anything else is shown. Settings changes it later.
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, I18nManager, Pressable, StyleSheet, View } from 'react-native';
import { deviceLocale, translate } from '@/i18n/I18nProvider';
import { LOCALES, LOCALE_ORDER, type Locale } from '@/i18n/locales';
import { useStore } from '@/state/store';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { motion, space } from '@/theme/tokens';
import { Button, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

const GREETING: Record<Locale, string> = { en: 'Hello', fa: 'سلام', fr: 'Bonjour', zh: '你好', ar: 'مرحبًا' };

// Farjad's choice of flag per language (15 Oct 2026): UK, Lion and Sun, France, China, Saudi Arabia.
const FLAG: Record<Locale, number> = {
  en: require('../../assets/flags/lang-en.jpg'),
  fa: require('../../assets/flags/lang-fa.jpg'),
  fr: require('../../assets/flags/lang-fr.jpg'),
  zh: require('../../assets/flags/lang-zh.jpg'),
  ar: require('../../assets/flags/lang-ar.jpg'),
};

const CYCLE_MS = 1800;
// 0.12, not 0.15: over a flag's white, fg-muted (#9D9C99) drops to 4.34:1 at 0.15 and holds 4.82:1 at 0.12 (WCAG 1.4.3).
const WASH = 0.12;
const ease = Easing.bezier(...motion.ease);

/** The five flags stacked full-bleed; only the shown language's is visible, faded into the ink. */
function FlagBackdrop({ shown }: { shown: Locale }) {
  const [levels] = useState(() => Object.fromEntries(LOCALE_ORDER.map((l) => [l, new Animated.Value(l === shown ? 1 : 0)])) as Record<Locale, Animated.Value>);
  useEffect(() => {
    Animated.parallel(LOCALE_ORDER.map((l) => Animated.timing(levels[l], { toValue: l === shown ? 1 : 0, duration: 700, easing: ease, useNativeDriver: true }))).start();
  }, [shown, levels]);
  return (
    <View pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants" style={StyleSheet.absoluteFill}>
      {LOCALE_ORDER.map((l) => (
        <Animated.Image
          key={l}
          source={FLAG[l]}
          resizeMode="cover"
          style={[StyleSheet.absoluteFill, { width: undefined, height: undefined, opacity: Animated.multiply(levels[l], WASH) }]}
        />
      ))}
    </View>
  );
}

function LanguageRow({ locale, selected, onPress }: { locale: Locale; selected: boolean; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLanguage={locale}
      style={({ pressed }) => ({
        // Each row reads in its own script's direction, so the mark always sits where its name starts.
        direction: LOCALES[locale].rtl ? 'rtl' : 'ltr',
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.s3,
        minHeight: 60,
        paddingVertical: space.s2,
        borderBottomWidth: 1,
        borderBottomColor: c.rule,
        backgroundColor: pressed ? c.rowPressed : 'transparent',
      })}
    >
      <View accessible={false} style={{ width: 12, height: 12, borderRadius: 999, borderWidth: selected ? 0 : 1.5, borderColor: c.fgMuted, backgroundColor: selected ? c.indicator : 'transparent' }} />
      <T variant="display-m" lang={locale} style={{ flex: 1 }}>
        {LOCALES[locale].endonym}
      </T>
    </Pressable>
  );
}

function LanguageScreen() {
  const { state, set } = useStore();
  const [choice, setChoice] = useState<Locale>(state.locale ?? deviceLocale());
  const [touched, setTouched] = useState(false);
  const [cycle, setCycle] = useState(() => LOCALE_ORDER.indexOf(state.locale ?? deviceLocale()));
  const [reduceMotion, setReduceMotion] = useState(true);
  const [greet] = useState(() => new Animated.Value(1));

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => setReduceMotion(false));
  }, []);

  // Until a language is picked, the greeting and the flag walk through all five.
  useEffect(() => {
    if (touched || reduceMotion) return;
    const id = setInterval(() => setCycle((i) => (i + 1) % LOCALE_ORDER.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [touched, reduceMotion]);

  const shown: Locale = touched || reduceMotion ? choice : LOCALE_ORDER[cycle];

  useEffect(() => {
    greet.setValue(0);
    Animated.timing(greet, { toValue: 1, duration: 450, easing: ease, useNativeDriver: true }).start();
  }, [shown, greet]);

  // Choosing a language of the other direction restarts the app (the root layout does it once the choice is saved).
  const restarts = LOCALES[choice].rtl !== I18nManager.isRTL;
  const pickLanguage = (l: Locale) => {
    setTouched(true);
    setChoice(l);
  };
  const proceed = () => {
    set({ locale: choice });
    if (!restarts) router.replace('/welcome');
  };

  return (
    <Screen
      scrim={false}
      background={<FlagBackdrop shown={shown} />}
      footer={
        <>
          {restarts ? (
            <T variant="caption" tone="fgMuted" lang={choice}>
              {translate(choice, 'language.restartNote')}
            </T>
          ) : null}
          <Button label={translate(choice, 'language.continue')} lang={choice} onPress={proceed} />
        </>
      }
    >
      <StatusBar style="light" />
      <Animated.View
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        style={{ minHeight: 200, justifyContent: 'flex-end', opacity: greet, transform: [{ translateY: greet.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}
      >
        <T variant="display-xl" lang={shown}>
          {GREETING[shown]}
        </T>
      </Animated.View>
      <T variant="label" tone="fgMuted" lang={choice} accessibilityRole="header">
        {translate(choice, 'language.label')}
      </T>
      <View accessibilityRole="radiogroup">
        {LOCALE_ORDER.map((l) => (
          <LanguageRow key={l} locale={l} selected={l === choice} onPress={() => pickLanguage(l)} />
        ))}
      </View>
    </Screen>
  );
}

export default function Language() {
  return (
    <ThemeProvider force="night">
      <LanguageScreen />
    </ThemeProvider>
  );
}
