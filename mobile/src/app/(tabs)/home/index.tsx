// Home (v2, option 3A "result first", Farjad 15 Oct 2026): the last result
// leads, then the roads the user follows, then news on those countries. With
// no result yet, the two doors. All of it reads the v2 assessment and v2
// route keys; the v1 pathfinder retired on 27 Oct 2026.
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { routeV2 } from '@shared/routes-v2';
import { cachedFeed, fetchFeed, type Feed } from '@/content/news';
import type { Country } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { Doors } from '@/ui/Doors';
import { FollowedRoads } from '@/ui/FollowedRoads';
import { Button, Disclaimer, Heading, Label, LinkRow, Ruled, Screen } from '@/ui/kit';
import { MatchCard } from '@/ui/MatchCard';
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
  const { t } = useI18n();
  const { state } = useStore();
  const followed = state.following.map((k) => routeV2(k)).filter((r) => !!r);
  const myCountries = [...new Set(followed.map((r) => r.country as Country))];
  const fresh = !state.assessAt && followed.length === 0;

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
          {state.assessAt ? <Label>{t('home.lastResult')}</Label> : null}
          {state.assessAt ? <MatchCard /> : <Button label={t('start.assessTitle')} onPress={() => router.push('/assessment')} />}
          <FollowedRoads />
          <RoadNews countries={myCountries} />
        </>
      )}
      <Disclaimer onAbout={() => router.navigate('/(tabs)/me/about')} />
    </Screen>
  );
}
