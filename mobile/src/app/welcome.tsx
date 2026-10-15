import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { PATH_PHOTO } from '@/content/routes';
import { deviceLocale, useI18n } from '@/i18n/I18nProvider';
import { LOCALES, LOCALE_ORDER, type Locale } from '@/i18n/locales';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Button, Chip, Disclaimer, Hero, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

const LOGO_PAPER = require('../../assets/brand/logo-paper.png');
const LOGO_NIGHT = require('../../assets/brand/logo-night.png');

export default function Welcome() {
  const { mode } = useTheme();
  const { state, set } = useStore();
  const { t, meta } = useI18n();
  const current = state.locale ?? deviceLocale();

  // Choosing a language of the other direction applies it before anything
  // else renders (spec 13): store it, then restart into the new layout.
  // Choosing a language of the other direction restarts the app into it;
  // the root layout saves the choice and restarts (spec 13).
  const choose = (l: Locale) => set({ locale: l });

  const enter = (to: 'pathfinder' | 'browse') => {
    set({ onboarded: true, locale: current });
    router.replace('/(tabs)/roads');
    if (to === 'pathfinder') router.push('/pathfinder');
  };

  return (
    <Screen
      footer={
        <>
          <Button label={t('welcome.start')} onPress={() => enter('pathfinder')} />
          <Button kind="link" label={t('welcome.browse')} onPress={() => enter('browse')} />
          <Disclaimer />
        </>
      }
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* The official logo in its own colours (Brand Book: the logo keeps navy, crimson and gold). */}
        <Image
          source={mode === 'night' ? LOGO_NIGHT : LOGO_PAPER}
          style={{ width: 132, height: 40 }}
          contentFit="contain"
          accessible
          accessibilityRole="header"
          accessibilityLabel={t('app.name')}
        />
        <T variant="label" tone="fgMuted">
          {t('app.by')}
        </T>
      </View>
      <Hero source={PATH_PHOTO} alt={t('welcome.photoAlt')} height={180} />
      <T variant="display-xl" accessibilityRole="header">
        {t('welcome.title1')}
        {'\n'}
        <T variant="display-xl" tone="fgFaint" italic={meta.script === 'latin'}>
          {t('welcome.title2')}
        </T>
      </T>
      <T variant="body" tone="fgMuted">
        {t('welcome.lead')}
      </T>
      <View style={{ gap: space.s2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2 }}>
          <Icon name="globe" size={16} tone="fgMuted" />
          <T variant="label" tone="fgMuted" accessibilityRole="header">
            {t('welcome.language')}
          </T>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.s6 }} contentContainerStyle={{ gap: space.s2, paddingVertical: 4, paddingHorizontal: space.s6 }} accessibilityRole="radiogroup">
          {LOCALE_ORDER.map((l) => (
            <Chip key={l} label={LOCALES[l].endonym} lang={l} selected={l === current} onPress={() => choose(l)} />
          ))}
        </ScrollView>
      </View>
    </Screen>
  );
}
