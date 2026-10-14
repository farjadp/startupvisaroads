import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useI18n } from '@/i18n/I18nProvider';
import { Disclaimer, Heading, LinkRow, Ruled, Screen } from '@/ui/kit';

export default function Tools() {
  const { t, meta } = useI18n();
  return (
    <Screen>
      <Heading>{t('tools.title')}</Heading>
      <Ruled>
        <LinkRow icon="people" label={t('tools.funds')} sub={t('tools.fundsDesc')} onPress={() => router.push('/(tabs)/tools/funds')} />
        <LinkRow icon="calculator" label={t('tools.check')} sub={t('tools.checkDesc')} onPress={() => router.push('/(tabs)/tools/check')} />
        <LinkRow
          icon="speech"
          external
          label={t('tools.crs')}
          sub={t('tools.crsDesc')}
          onPress={() => void WebBrowser.openBrowserAsync(`https://visaroads.com/${meta.siteLocale === 'fa' ? 'fa' : 'en'}/tools/express-entry`)}
        />
      </Ruled>
      <Disclaimer onAbout={() => router.navigate('/(tabs)/me/about')} />
    </Screen>
  );
}
