// First screen on a new install (onboarding 2A): the five languages, each in
// its own script, large, like a contents page. The device language is
// preselected; nothing is applied until Continue, so a right-to-left choice
// restarts the app here, on a near-empty screen, before anything else is
// shown. Settings changes it later.
import { router } from 'expo-router';
import { useState } from 'react';
import { I18nManager, Pressable, View } from 'react-native';
import { deviceLocale, translate } from '@/i18n/I18nProvider';
import { LOCALES, LOCALE_ORDER, type Locale } from '@/i18n/locales';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { Button, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

function LanguageRow({ locale, selected, onPress }: { locale: Locale; selected: boolean; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLanguage={locale}
      style={({ pressed }) => ({
        // Each row reads in its own script's direction, so the bar always sits where its name starts.
        direction: LOCALES[locale].rtl ? 'rtl' : 'ltr',
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.s4,
        minHeight: 72,
        paddingVertical: space.s3,
        borderBottomWidth: 1,
        borderBottomColor: c.rule,
        backgroundColor: pressed ? c.rowPressed : 'transparent',
      })}
    >
      {/* The bar marks the choice (radio state is announced). Indicator, not accent: acid alone on paper is 1.03:1 (tokens: theme.paper.indicator). */}
      <View accessible={false} style={{ width: 6, alignSelf: 'stretch', backgroundColor: selected ? c.indicator : 'transparent' }} />
      <T variant="display-l" lang={locale} style={{ flex: 1 }}>
        {LOCALES[locale].endonym}
      </T>
    </Pressable>
  );
}

export default function Language() {
  const { state, set } = useStore();
  const [choice, setChoice] = useState<Locale>(state.locale ?? deviceLocale());
  // Choosing a language of the other direction restarts the app (the root layout does it once the choice is saved).
  const restarts = LOCALES[choice].rtl !== I18nManager.isRTL;

  const proceed = () => {
    set({ locale: choice });
    if (!restarts) router.replace('/welcome');
  };

  return (
    <Screen
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
      <T variant="label" tone="fgMuted" lang={choice} accessibilityRole="header">
        {translate(choice, 'language.label')}
      </T>
      <View accessibilityRole="radiogroup">
        {LOCALE_ORDER.map((l) => (
          <LanguageRow key={l} locale={l} selected={l === choice} onPress={() => setChoice(l)} />
        ))}
      </View>
    </Screen>
  );
}
