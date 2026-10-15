// Home (v2, option 3A "result first", Farjad 15 Oct 2026): the last result
// leads, then the roads the user follows, then news on those countries. With
// no result yet, the two doors. Until the v2 assessment ships, the result is
// the v1 pathfinder's closest road, shown without a score (the readiness
// score is retired; match % arrives with the v2 engine).
import * as WebBrowser from 'expo-web-browser';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { toUsdExact } from '@shared/fx';
import { ROUTES_V2, routeV2 } from '@shared/routes-v2';
import { rank } from '@shared/routes-v2/match';
import { metCount, preferredFamily, toProfile, topGaps } from '@/content/assessment';
import { cachedFeed, fetchFeed, type Feed } from '@/content/news';
import { COUNTRY_NAMES, ROUTE_TYPE, ROUTES, type Country } from '@/content/routes';
import { roadView } from '@/engine/road';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { CountryPicture } from '@/ui/CountryPicture';
import { Doors } from '@/ui/Doors';
import { Flag } from '@/ui/Flag';
import { Button, Disclaimer, Heading, Label, LinkRow, Ruled, Screen } from '@/ui/kit';
import { checkLabel } from '@/ui/phrases';
import { T } from '@/ui/T';

/** The v2 result: best match with its %, coverage and first gap (spec §4, Home 3A). */
function MatchCard() {
  const { t, pick, count } = useI18n();
  const { c } = useTheme();
  const { state } = useStore();
  const ranked = rank(ROUTES_V2, toProfile(state.assess), toUsdExact, preferredFamily(state.assess));
  const best = ranked[0];
  if (!best) return null;
  const route = routeV2(best.route)!;
  const gap = topGaps(best, 1)[0];
  const gapLabel = gap ? pick(route.criteria.find((cr) => cr.key === gap)!.label).text : null;
  const pct = `${count(best.pct ?? 0)}${t('assess2.pctSign')}`;
  // Every % carries its coverage; a thin result shows what is met instead of a %.
  const coverage = t('assess2.coverage', { n: count(best.coverage.scored), total: count(best.coverage.of) });
  const figure = best.thin ? t('assess2.thinMet', { met: count(metCount(best)), n: count(best.coverage.scored) }) : pct;
  const figureA11y = best.thin ? `${figure}, ${t('assess2.notChance')}` : t('assess2.matchA11y', { pct });
  return (
    <Pressable
      onPress={() => router.push('/(tabs)/assess/results')}
      accessibilityRole="button"
      accessibilityLabel={[pick(route.name).text, figureA11y, coverage, gapLabel ? t('home.closeFirst', { item: gapLabel }) : ''].filter(Boolean).join('. ')}
      style={({ pressed }) => ({ borderWidth: 1.5, borderColor: c.fg, opacity: pressed ? 0.85 : 1 })}
    >
      <CountryPicture country={route.country as Country} height={120} />
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
          {best.thin ? `${coverage} · ${t('assess2.thin')}` : coverage}
        </T>
        {gapLabel ? <T variant="body">{t('home.closeFirst', { item: gapLabel })}</T> : null}
        <T variant="row" weight="bold" style={{ textDecorationLine: 'underline' }}>
          {t('home.seeResult')}
        </T>
      </View>
    </Pressable>
  );
}

function ResultCard() {
  const i18n = useI18n();
  const { t, pick } = i18n;
  const { c } = useTheme();
  const { state } = useStore();
  const outcome = state.outcome;
  if (!outcome) return null;
  if (outcome === 'too-early') {
    return (
      <View style={{ borderWidth: 1.5, borderColor: c.fg, padding: space.s4, gap: space.s2 }}>
        <T variant="body">{t('home.tooEarly')}</T>
        <Button kind="link" label={t('home.seeResult')} onPress={() => router.push('/(tabs)/assess/result')} />
      </View>
    );
  }
  const route = ROUTES[outcome];
  const v = roadView(outcome, state.answers, state.done[outcome], { sourceOpened: false, newsRead: false });
  // The one condition to close first: a "not yet" before a "close".
  const gap = v.checks.find((ch) => ch.status === 'not-yet') ?? v.checks.find((ch) => ch.status === 'close');
  return (
    <Pressable
      onPress={() => router.push('/(tabs)/assess/result')}
      accessibilityRole="button"
      accessibilityLabel={[pick(route.name).text, t('home.closest'), gap ? t('home.closeFirst', { item: checkLabel(gap, i18n) }) : ''].filter(Boolean).join(', ')}
      style={({ pressed }) => ({ borderWidth: 1.5, borderColor: c.fg, opacity: pressed ? 0.85 : 1 })}
    >
      <Image source={route.photo.source} style={{ height: 120 }} contentFit="cover" accessible={false} />
      <View style={{ padding: space.s4, gap: space.s2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2 }}>
          <Flag country={route.country} width={18} />
          <T variant="row" weight="bold" style={{ flexShrink: 1 }}>
            {pick(route.name).text}
          </T>
        </View>
        <T variant="caption" tone="fgMuted">
          {t('home.closest')}
        </T>
        {gap ? <T variant="body">{t('home.closeFirst', { item: checkLabel(gap, i18n) })}</T> : null}
        <T variant="row" weight="bold" style={{ textDecorationLine: 'underline' }}>
          {t('home.seeResult')}
        </T>
      </View>
    </Pressable>
  );
}

function RoadNews({ countries }: { countries: Country[] }) {
  const { t, meta } = useI18n();
  const [feed, setFeed] = useState<Feed | null>(null);
  const lang = meta.siteLocale;
  useEffect(() => {
    let live = true;
    void cachedFeed(lang).then((f) => live && f && setFeed(f));
    fetchFeed(lang)
      .then((f) => live && setFeed(f))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [lang]);
  const items = (feed?.items ?? []).filter((i) => i.countries.some((k) => countries.includes(k))).slice(0, 3);
  if (!items.length) return null;
  return (
    <View>
      <Label>{t('home.news')}</Label>
      <Ruled>
        {items.map((i) => (
          <LinkRow key={i.link} external label={i.title} lang={lang} onPress={() => void WebBrowser.openBrowserAsync(i.link)} />
        ))}
      </Ruled>
    </View>
  );
}

export default function Home() {
  const { t, pick } = useI18n();
  const { state } = useStore();
  const outcomeCountry = state.outcome && state.outcome !== 'too-early' ? ROUTES[state.outcome].country : null;
  const myCountries = [...new Set([...(outcomeCountry ? [outcomeCountry] : []), ...state.following.map((k) => ROUTES[k].country)])];
  const fresh = !state.assessAt && !state.outcome && state.following.length === 0;

  return (
    <Screen>
      <Heading>{t('home.title')}</Heading>
      {fresh ? (
        <>
          <T variant="body" tone="fgMuted">
            {t('home.emptyLead')}
          </T>
          <Doors onRoad={() => router.navigate('/(tabs)/countries')} onAssess={() => router.push('/assessment')} />
        </>
      ) : (
        <>
          {state.assessAt || state.outcome ? <Label>{t('home.lastResult')}</Label> : null}
          {/* The v2 result replaces the v1 pathfinder's once there is one. */}
          {state.assessAt ? <MatchCard /> : <ResultCard />}
          {!state.assessAt && !state.outcome ? <Button label={t('start.assessTitle')} onPress={() => router.push('/assessment')} /> : null}
          {state.following.length ? (
            <View>
              <Label>{t('home.followed')}</Label>
              <Ruled>
                {state.following.map((k) => (
                  <LinkRow key={k} icon={ROUTE_TYPE[k]} label={pick(ROUTES[k].name).text} sub={pick(COUNTRY_NAMES[ROUTES[k].country]).text} onPress={() => router.push(`/(tabs)/countries/${k}`)} />
                ))}
              </Ruled>
            </View>
          ) : null}
          <RoadNews countries={myCountries} />
        </>
      )}
      <Disclaimer onAbout={() => router.navigate('/(tabs)/me/about')} />
    </Screen>
  );
}
