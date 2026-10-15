// Start (v2, option 1B, Farjad 15 Oct 2026): right after the language, two
// doors. "Choose a road" opens the Countries tab; "Get assessed" opens the
// assessment (the v1 pathfinder until v2's lands); "Just look around" goes
// Home. Any of them ends onboarding.
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { Doors } from '@/ui/Doors';
import { Button, Disclaimer, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

const LOGO_PAPER = require('../../assets/brand/logo-paper.png');
const LOGO_NIGHT = require('../../assets/brand/logo-night.png');

export default function Start() {
  const { mode } = useTheme();
  const { t, meta } = useI18n();
  const { set } = useStore();

  const go = (to: 'countries' | 'assess' | 'home') => {
    set({ onboarded: true });
    if (to === 'countries') return router.replace('/(tabs)/countries');
    router.replace('/(tabs)/home');
    if (to === 'assess') router.push('/assessment');
  };

  return (
    <Screen
      footer={
        <>
          <Button kind="link" label={t('start.look')} onPress={() => go('home')} />
          <Disclaimer />
        </>
      }
      stickyFooter={false}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* The official logo in its own colours (Brand Book: the logo keeps navy, crimson and gold). */}
        <Image source={mode === 'night' ? LOGO_NIGHT : LOGO_PAPER} style={{ width: 132, height: 40 }} contentFit="contain" accessible accessibilityRole="header" accessibilityLabel={t('app.name')} />
        <T variant="label" tone="fgMuted">
          {t('app.by')}
        </T>
      </View>
      {/* Capped lower than the role's 1.5: at accessibility sizes "commencer ?" broke mid-word (HIG Dynamic Type). */}
      <T variant="display-xl" accessibilityRole="header" maxFontSizeMultiplier={1.1} style={{ marginTop: space.s4 }}>
        {t('start.title1')}
        {'\n'}
        <T variant="display-xl" tone="fgFaint" italic={meta.script === 'latin'} maxFontSizeMultiplier={1.1}>
          {t('start.title2')}
        </T>
      </T>
      <Doors onRoad={() => go('countries')} onAssess={() => go('assess')} />
    </Screen>
  );
}
