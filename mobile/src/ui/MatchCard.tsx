// The v2 result in brief, for Home (3A) and Me: the closest route with its %,
// the coverage the % rests on, the conditions not checked here and the first
// gap; tapping opens the full results. Never a bigger figure than the results
// screen shows, never a % without its coverage (trust rules).
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { toUsdExact } from '@shared/fx';
import { ROUTES_V2, routeV2 } from '@shared/routes-v2';
import { rank } from '@shared/routes-v2/match';
import { metCount, preferredFamily, toProfile, topGaps } from '@/content/assessment';
import type { Country } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { CountryPicture } from '@/ui/CountryPicture';
import { Flag } from '@/ui/Flag';
import { T } from '@/ui/T';

export function MatchCard({ picture = true }: { picture?: boolean }) {
  const { t, pick, count } = useI18n();
  const { c } = useTheme();
  const { state } = useStore();
  const ranked = rank(ROUTES_V2, toProfile(state.assess), toUsdExact, preferredFamily(state.assess));
  const best = ranked[0];
  if (!best) {
    return (
      <Pressable
        onPress={() => router.push('/(tabs)/assess/results')}
        accessibilityRole="button"
        style={({ pressed }) => ({ borderWidth: 1.5, borderColor: c.fg, padding: space.s4, gap: space.s2, opacity: pressed ? 0.85 : 1 })}
      >
        <T variant="body">{t('assess2.nothingScored')}</T>
        <T variant="row" weight="bold" style={{ textDecorationLine: 'underline' }}>
          {t('home.seeResult')}
        </T>
      </Pressable>
    );
  }
  const route = routeV2(best.route)!;
  const gap = topGaps(best, 1)[0];
  const gapLabel = gap ? pick(route.criteria.find((cr) => cr.key === gap)!.label).text : null;
  const pct = `${count(best.pct ?? 0)}${t('assess2.pctSign')}`;
  // Every % carries its coverage; a thin result shows what is met instead of a %.
  const coverage = t('assess2.coverage', { n: count(best.coverage.scored), total: count(best.coverage.of) });
  const unchecked = best.coverage.of - best.coverage.scored;
  const uncheckedLine = unchecked > 0 ? t('assess2.unchecked', { n: count(unchecked) }) : null;
  const figure = best.thin ? t('assess2.thinMet', { met: count(metCount(best)), n: count(best.coverage.scored) }) : pct;
  const figureA11y = best.thin ? `${figure}, ${t('assess2.notChance')}` : t('assess2.matchA11y', { pct });
  return (
    <Pressable
      onPress={() => router.push('/(tabs)/assess/results')}
      accessibilityRole="button"
      accessibilityLabel={[pick(route.name).text, figureA11y, coverage, uncheckedLine, gapLabel ? t('home.closeFirst', { item: gapLabel }) : ''].filter(Boolean).join('. ')}
      style={({ pressed }) => ({ borderWidth: 1.5, borderColor: c.fg, opacity: pressed ? 0.85 : 1 })}
    >
      {picture ? <CountryPicture country={route.country as Country} height={120} /> : null}
      <View style={{ padding: space.s4, gap: space.s2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2 }}>
          <Flag country={route.country as Country} width={18} />
          <T variant="row" weight="bold" lang={pick(route.name).lang} style={{ flexShrink: 1 }}>
            {pick(route.name).text}
          </T>
        </View>
        <T variant={best.thin ? 'headline' : 'figure'}>{figure}</T>
        <T variant="caption" tone="fgMuted">
          {best.thin ? t('assess2.notChance') : t('assess2.matchLine')}
        </T>
        <T variant="caption" tone="fgMuted">
          {[best.thin ? `${coverage} · ${t('assess2.thin')}` : coverage, uncheckedLine].filter(Boolean).join(' · ')}
        </T>
        {gapLabel ? <T variant="body">{t('home.closeFirst', { item: gapLabel })}</T> : null}
        <T variant="row" weight="bold" style={{ textDecorationLine: 'underline' }}>
          {t('home.seeResult')}
        </T>
      </View>
    </Pressable>
  );
}
