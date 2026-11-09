import { router } from 'expo-router';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { Heading, Label, LinkRow, Ruled, Screen } from '@/ui/kit';
import { DisclaimerWithAbout } from '@/ui/InfoSheets';

// Route check (assess/check.tsx, v1 rules over the nine v1 roads in CAD) is no
// longer listed: the v2 assessment scores the published criteria of every
// route. The screen stays so an old link still opens (15 Oct 2026).
export default function Assess() {
  const { t } = useI18n();
  const { state } = useStore();
  return (
    <Screen>
      <Heading>{t('assess.title')}</Heading>
      <Ruled>
        <LinkRow icon="compass" label={t('assess.start')} sub={t('assess.startSub')} onPress={() => router.push('/assessment')} />
        {state.assessAt ? <LinkRow icon="route" label={t('assess.result')} onPress={() => router.push('/(tabs)/assess/results')} /> : null}
      </Ruled>
      <Label>{t('assess.tools')}</Label>
      <Ruled>
        <LinkRow icon="people" label={t('funds.title')} sub={t('tools.fundsDesc')} onPress={() => router.push('/(tabs)/assess/funds')} />
        <LinkRow icon="speech" label={t('tools.crs')} sub={t('tools.crsDesc')} onPress={() => router.push('/(tabs)/assess/express-entry')} />
      </Ruled>
      <DisclaimerWithAbout />
    </Screen>
  );
}
