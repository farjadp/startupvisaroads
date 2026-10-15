import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { Disclaimer, Heading, Label, LinkRow, Ruled, Screen } from '@/ui/kit';

export default function Assess() {
  const { t, meta } = useI18n();
  const { state } = useStore();
  return (
    <Screen>
      <Heading>{t('assess.title')}</Heading>
      <Ruled>
        <LinkRow icon="compass" label={t('assess.start')} sub={t('assess.startSub')} onPress={() => router.push('/pathfinder')} />
        {state.outcome ? <LinkRow icon="route" label={t('assess.result')} onPress={() => router.push('/(tabs)/assess/result')} /> : null}
      </Ruled>
      <Label>{t('assess.tools')}</Label>
      <Ruled>
        <LinkRow icon="people" label={t('tools.funds')} sub={t('tools.fundsDesc')} onPress={() => router.push('/(tabs)/assess/funds')} />
        <LinkRow icon="calculator" label={t('tools.check')} sub={t('tools.checkDesc')} onPress={() => router.push('/(tabs)/assess/check')} />
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
