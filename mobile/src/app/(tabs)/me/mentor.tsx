// Talk to a mentor (4.2). v1 sends nothing from the app: the lead endpoint
// does not exist yet, and the site's leads currently go to Telegram only.
// The reader chooses the channel; this screen shows what to mention.
import * as WebBrowser from 'expo-web-browser';
import { Linking, View } from 'react-native';
import { ROUTES } from '@/content/routes';
import { roadView } from '@/engine/road';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { Button, Label, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

export default function Mentor() {
  const { t, pick, meta, count } = useI18n();
  const { c } = useTheme();
  const { state } = useStore();
  const road = state.outcome && state.outcome !== 'too-early' ? state.outcome : null;
  const v = road ? roadView(road, state.answers, state.done[road], { sourceOpened: state.sourcesOpened.includes(road), newsRead: state.newsRead }) : null;
  const bookUrl = `https://visaroads.com/${meta.siteLocale === 'fa' ? 'fa/contact' : 'en/book-meeting'}`;

  return (
    <Screen edges={[]}>
      <T variant="body">{t('mentor.lead')}</T>
      {road && v ? (
        <View style={{ gap: space.s2, padding: space.s4, borderWidth: 1, borderColor: c.fg }}>
          <Label>{t('mentor.mention')}</Label>
          <T variant="row" weight="bold">
            {pick(ROUTES[road].name).text}
          </T>
          <T variant="row">
            {t('result.spoken', { score: count(v.score), level: t(`levels.${v.level.level}`) })}
          </T>
          <T variant="caption" tone="fgMuted">
            {t('common.readiness')}
          </T>
        </View>
      ) : null}
      <Button label={t('mentor.book')} icon="external" hint={t('common.opensBrowser')} onPress={() => void WebBrowser.openBrowserAsync(bookUrl)} />
      <Button kind="secondary" label={t('mentor.telegram')} icon="external" onPress={() => void Linking.openURL('https://t.me/farjadtalks')} />
      <T variant="caption" tone="fgMuted">
        {t('mentor.promise')}
      </T>
      <T variant="caption" tone="fgMuted">
        {t('common.disclaimer')}
      </T>
    </Screen>
  );
}
