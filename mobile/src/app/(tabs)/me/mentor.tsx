// Talk to a mentor (4.2). v1 sends nothing from the app: the lead endpoint
// does not exist yet, and the site's leads currently go to Telegram only.
// The reader chooses the channel; this screen shows what to mention.
import * as WebBrowser from 'expo-web-browser';
import { Linking, View } from 'react-native';
import { toUsdExact } from '@shared/fx';
import { ROUTES_V2, routeV2 } from '@shared/routes-v2';
import { rank } from '@shared/routes-v2/match';
import { metCount, preferredFamily, toProfile } from '@/content/assessment';
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
  // What to mention: the closest route from the v2 assessment, with its figure and the coverage it rests on.
  const best = state.assessAt ? rank(ROUTES_V2, toProfile(state.assess), toUsdExact, preferredFamily(state.assess))[0] : undefined;
  const road = best ? routeV2(best.route) : undefined;
  const bookUrl = `https://visaroads.com/${meta.siteLocale === 'fa' ? 'fa/contact' : 'en/book-meeting'}`;

  return (
    <Screen edges={[]}>
      <T variant="body">{t('mentor.lead')}</T>
      {best && road ? (
        <View style={{ gap: space.s2, padding: space.s4, borderWidth: 1, borderColor: c.fg }}>
          <Label>{t('mentor.mention')}</Label>
          <T variant="row" weight="bold" lang={pick(road.name).lang}>
            {pick(road.name).text}
          </T>
          <T variant="row">
            {best.thin ? t('assess2.thinMet', { met: count(metCount(best)), n: count(best.coverage.scored) }) : `${count(best.pct ?? 0)}${t('assess2.pctSign')} · ${t('assess2.matchLine')}`}
          </T>
          <T variant="caption" tone="fgMuted">
            {[t('assess2.coverage', { n: count(best.coverage.scored), total: count(best.coverage.of) }), best.coverage.of > best.coverage.scored ? t('assess2.unchecked', { n: count(best.coverage.of - best.coverage.scored) }) : null, best.thin ? t('assess2.notChance') : null].filter(Boolean).join(' · ')}
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
