// Home (B1 "photo stack", Farjad 28 Oct 2026): where you are on each road you
// follow, as photo cards; then your last result as a strip (no % here: the
// figure and its coverage live on the results screen); then news on your
// countries. Assessed but following nothing: one card to go and follow a road.
// With nothing yet, the two doors.
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { toUsdExact } from '@shared/fx';
import { ROUTES_V2, routeV2 } from '@shared/routes-v2';
import { rank } from '@shared/routes-v2/match';
import { preferredFamily, toProfile } from '@/content/assessment';
import { cachedFeed, fetchFeed, type Feed } from '@/content/news';
import type { Country } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { Doors } from '@/ui/Doors';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { Flag } from '@/ui/Flag';
import { Icon } from '@/ui/Icon';
import { Button, Disclaimer, Heading, Label, LinkRow, Ruled, Screen } from '@/ui/kit';
import { RoadStack } from '@/ui/RoadStack';
import { T } from '@/ui/T';

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
  const items = (feed?.items ?? []).filter((i) => i.countries.some((k) => countries.includes(k))).slice(0, 2);
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

/** The closest road from the last assessment, in one row: no figure, so no readiness sentence is needed here. */
function ResultStrip({ best }: { best: string | null }) {
  const { t, pick, date } = useI18n();
  const { c } = useTheme();
  const { state } = useStore();
  const route = best ? routeV2(best) : null;
  const when = state.assessAt ? t('home.lastResultOn', { date: date(state.assessAt) }) : t('home.lastResult');
  const label = route ? pick(route.name) : null;
  return (
    <Pressable
      onPress={() => router.push('/(tabs)/assess/results')}
      accessibilityRole="button"
      accessibilityLabel={label ? t('home.resultA11y', { route: label.text }) : `${when}. ${t('home.seeResult')}`}
      style={({ pressed }) => ({ borderWidth: 1.5, borderColor: c.fg, minHeight: 56, paddingHorizontal: space.s4, paddingVertical: space.s3, flexDirection: 'row', alignItems: 'center', gap: space.s3, opacity: pressed ? 0.85 : 1 })}
    >
      {route ? <Flag country={route.country as Country} width={20} /> : null}
      <View style={{ flex: 1, gap: 2 }}>
        <T variant="row" weight="bold" lang={label?.lang}>
          {label ? label.text : t('home.seeResult')}
        </T>
        <T variant="caption" tone="fgMuted">
          {when}
        </T>
      </View>
      <Icon name="chevron" tone="fgMuted" />
    </Pressable>
  );
}

/** Assessed, following nothing: the one thing to do next. */
function FollowCard() {
  const { t } = useI18n();
  const { c } = useTheme();
  return (
    <View style={{ borderWidth: 1.5, borderColor: c.fg, padding: space.s4, gap: space.s4 }}>
      <T variant="headline">{t('home.followPrompt')}</T>
      <Button label={t('home.followCta')} onPress={() => router.push('/(tabs)/assess/results')} />
    </View>
  );
}

export default function Home() {
  const { t } = useI18n();
  const { state } = useStore();
  const followed = state.following.map((k) => routeV2(k)).filter((r) => !!r);
  const myCountries = [...new Set(followed.map((r) => r.country as Country))];
  const fresh = !state.assessAt && followed.length === 0;
  const ranked = state.assessAt ? rank(ROUTES_V2, toProfile(state.assess), toUsdExact, preferredFamily(state.assess)) : [];
  const best = ranked[0]?.route ?? null;
  // Following nothing yet: news follows the countries of the closest roads instead.
  const newsCountries = followed.length ? myCountries : [...new Set(ranked.slice(0, 3).map((m) => routeV2(m.route)!.country as Country))];

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
          {followed.length ? <RoadStack /> : <FollowCard />}
          {state.assessAt ? followed.length ? <ResultStrip best={best} /> : null : <Button label={t('start.assessTitle')} kind="secondary" onPress={() => router.push('/assessment')} />}
          <RoadNews countries={newsCountries} />
        </>
      )}
      <Disclaimer onAbout={() => router.navigate('/(tabs)/me/about')} />
    </Screen>
  );
}
