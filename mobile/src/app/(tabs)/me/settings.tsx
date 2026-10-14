// Settings (0.3): language and appearance as radio lists, data deletion
// through the system's destructive alert, about / privacy / credits.
import Constants from 'expo-constants';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { needsDirectionRestart, useI18n } from '@/i18n/I18nProvider';
import { LOCALES, LOCALE_ORDER, type Locale } from '@/i18n/locales';
import { useStore, type ModePref } from '@/state/store';
import { space } from '@/theme/tokens';
import { Banner, Label, LinkRow, RadioRow, Ruled, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

export default function Settings() {
  const { state, set, reset } = useStore();
  const { t, locale, meta } = useI18n();
  const [notice, setNotice] = useState<string | null>(null);

  const chooseLanguage = (l: Locale) => {
    if (l === locale) return;
    if (!needsDirectionRestart(l)) return set({ locale: l });
    // Say the app will restart before doing it (spec, Localisation).
    Alert.alert(t('settings.restartTitle'), `${meta.rtl ? '\u200F' : '\u200E'}${t('settings.restartBody', { language: `\u2068${LOCALES[l].endonym}\u2069` })}`, [
      { text: t('settings.cancel'), style: 'cancel' },
      {
        text: t('settings.restart'),
        onPress: () => {
          // The root layout saves it and restarts in the new direction.
          set({ locale: l });
        },
      },
    ]);
  };

  const confirmDelete = () =>
    Alert.alert(t('settings.deleteTitle'), t('settings.deleteBody'), [
      { text: t('settings.cancel'), style: 'cancel' },
      {
        text: t('settings.delete'),
        style: 'destructive',
        onPress: async () => {
          await reset();
          setNotice(t('settings.deleted'));
        },
      },
    ]);

  const modes: ModePref[] = ['system', 'paper', 'night'];
  return (
    <Screen edges={[]}>
      {notice ? <Banner text={notice} /> : null}
      <View accessibilityRole="radiogroup">
        <Label>{t('settings.language')}</Label>
        <Ruled>
          {LOCALE_ORDER.map((l) => (
            <RadioRow key={l} label={LOCALES[l].endonym} selected={l === locale} onPress={() => chooseLanguage(l)} />
          ))}
        </Ruled>
      </View>
      <View accessibilityRole="radiogroup">
        <Label>{t('settings.appearance')}</Label>
        <Ruled>
          {modes.map((m) => (
            <RadioRow key={m} label={t(`settings.${m}`)} selected={state.mode === m} onPress={() => set({ mode: m })} />
          ))}
        </Ruled>
      </View>
      <Ruled>
        <LinkRow icon="shield" label={t('settings.about')} onPress={() => router.push('/(tabs)/me/about')} />
        <LinkRow icon="doc" external label={t('settings.privacy')} onPress={() => void WebBrowser.openBrowserAsync(`https://visaroads.com/${meta.siteLocale}/privacy`)} />
        <LinkRow icon="globe" label={t('settings.credits')} onPress={() => router.push('/(tabs)/me/credits')} />
        <LinkRow icon="alert" label={t('settings.deleteData')} onPress={confirmDelete} />
      </Ruled>
      <T variant="caption" tone="fgMuted">
        {t('settings.version', { v: Constants.expoConfig?.version ?? '1.0.0' })}
      </T>
      <View style={{ height: space.s4 }} />
    </Screen>
  );
}
