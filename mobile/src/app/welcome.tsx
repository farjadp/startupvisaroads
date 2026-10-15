import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';
import { PATH_PHOTO } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { Button, Disclaimer, Hero, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

const LOGO_PAPER = require('../../assets/brand/logo-paper.png');
const LOGO_NIGHT = require('../../assets/brand/logo-night.png');

export default function Welcome() {
  const { mode } = useTheme();
  const { t, meta } = useI18n();

  // The language was chosen on the screen before (2A). Both ways in pass through
  // "Roads to follow" (3B), which is optional, then land where the user asked.
  const enter = (to: 'pathfinder' | 'browse') => router.push({ pathname: '/follow', params: { next: to } });

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
    </Screen>
  );
}
