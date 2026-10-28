// Development only: visaroads://dev-seed?preset=ns&locale=fa&mode=night&to=/(tabs)/me
// Puts the app into a known state so screens can be reviewed in every
// language and mode without tapping through the assessment. In a release
// build it changes nothing and goes home. The old pathfinder presets (ns,
// finland, early) now follow the v2 route their v1 road became, and &steps=
// ticks that route's road-map steps (v2 step keys). &follow=a,b follows those v2
// routes (after any preset), for a Home with several roads.
// A locale that flips layout direction restarts the app, and Android then
// replays the activity's launch link, often an older dev-seed. So the target
// is kept across the restart and the replayed link is ignored once.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { routeV2 } from '@shared/routes-v2';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import type { AssessAnswers } from '@/content/assessment';
import type { StoredAnswers } from '@/engine/readiness';
import { outcomeFor } from '@/engine/road';
import { needsDirectionRestart } from '@/i18n/I18nProvider';
import { LOCALES, type Locale } from '@/i18n/locales';
import { V1_TO_V2 } from '@/state/migrate';
import { useStore, type ModePref } from '@/state/store';

const PRESETS: Record<string, StoredAnswers> = {
  ns: { goal: 'residency', team: 'solo', business: 'revenue', language: 'mid', capital: '200to500', background: 'professional', horizon: 'medium' },
  finland: { goal: 'residency', team: 'team', business: 'mvp', language: 'high', capital: '50to200', background: 'professional', horizon: 'medium' },
  early: { goal: 'growth', team: 'solo', business: 'idea', language: 'low', capital: 'under50', background: 'none', horizon: 'urgent' },
};

// v2 assessment samples (&assess=founder): a finished assessment, so the results
// and Home can be reviewed without tapping through ten screens.
const PENDING = 'vr.devseed.pending';

const ASSESS: Record<string, AssessAnswers> = {
  founder: { goal: 'startup', residence: 'IR', citizenship: 'IR', age: '30', degree: 'master', work: '5', english: 'good', french: 'none', liquid: '3', netWorth: '3', income: '3', investment: '2', businessStage: 'mvp', admission: 'no', jobOffer: 'no', endorsement: 'no' },
  talent: { goal: 'talent', residence: 'CA', citizenship: 'IN', age: '35', degree: 'phd', work: '10', english: 'veryGood', french: 'basic', liquid: '4', netWorth: '5', income: '5', investment: '3', businessStage: 'none', admission: 'skip', jobOffer: 'yes', endorsement: 'no', talent: ['publications', 'citations', 'judging'] },
};

export default function DevSeed() {
  const p = useLocalSearchParams<{ assess?: string; preset?: string; locale?: string; mode?: string; to?: string; steps?: string; follow?: string }>();
  const { set, reset } = useStore();
  const [done, setDone] = useState(false);
  const [to, setTo] = useState(p.to);

  useEffect(() => {
    if (!__DEV__) return setDone(true);
    void (async () => {
      // Just back from a direction restart: the state is already stored; go where that seed was going.
      const pending = await AsyncStorage.getItem(PENDING).catch(() => null);
      if (pending) {
        await AsyncStorage.removeItem(PENDING).catch(() => {});
        const { to: target, at } = JSON.parse(pending) as { to?: string; at: number };
        if (Date.now() - at < 30000) {
          setTo(target);
          return setDone(true);
        }
      }
      if (p.preset === 'none') await reset();
      const answers = p.preset ? PRESETS[p.preset] : undefined;
      const patch: Parameters<typeof set>[0] = { onboarded: true };
      if (p.locale && p.locale in LOCALES) patch.locale = p.locale as Locale;
      if (p.mode === 'paper' || p.mode === 'night' || p.mode === 'system') patch.mode = p.mode as ModePref;
      if (answers) {
        const { outcome } = outcomeFor(answers);
        const route = outcome === 'too-early' ? null : V1_TO_V2[outcome];
        patch.following = route ? [route] : [];
        if (route && p.steps) patch.journey = { [route]: p.steps.split(',') };
      }
      if (p.follow) {
        patch.following = p.follow.split(',').filter((k) => !!routeV2(k));
        // &steps= ticks the first followed road when the roads are given.
        if (p.steps && patch.following[0]) patch.journey = { [patch.following[0]]: p.steps.split(',') };
      }
      if (p.assess && ASSESS[p.assess]) {
        patch.assess = ASSESS[p.assess];
        patch.assessAt = new Date().toISOString();
        patch.assessStep = -1;
      }
      // The root layout persists the state and restarts; keep the target for the relaunch.
      if (patch.locale && needsDirectionRestart(patch.locale)) await AsyncStorage.setItem(PENDING, JSON.stringify({ to: p.to, at: Date.now() })).catch(() => {});
      set(patch);
      setDone(true);
    })();
  }, []);

  if (!done) return null;
  return <Redirect href={(__DEV__ && to ? to : '/(tabs)/home') as never} />;
}
