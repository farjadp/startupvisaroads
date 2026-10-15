// Development only: visaroads://dev-seed?preset=ns&locale=fa&mode=night&to=/(tabs)/me
// Puts the app into a known state so screens can be reviewed in every
// language and mode without tapping through the pathfinder. In a release
// build it changes nothing and goes home.
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import type { AssessAnswers } from '@/content/assessment';
import type { StoredAnswers } from '@/engine/readiness';
import { outcomeFor } from '@/engine/road';
import { LOCALES, type Locale } from '@/i18n/locales';
import { useStore, type ModePref } from '@/state/store';

const PRESETS: Record<string, StoredAnswers> = {
  ns: { goal: 'residency', team: 'solo', business: 'revenue', language: 'mid', capital: '200to500', background: 'professional', horizon: 'medium' },
  finland: { goal: 'residency', team: 'team', business: 'mvp', language: 'high', capital: '50to200', background: 'professional', horizon: 'medium' },
  early: { goal: 'growth', team: 'solo', business: 'idea', language: 'low', capital: 'under50', background: 'none', horizon: 'urgent' },
};

// v2 assessment samples (&assess=founder): a finished assessment, so the results
// and Home can be reviewed without tapping through ten screens.
const ASSESS: Record<string, AssessAnswers> = {
  founder: { goal: 'startup', residence: 'IR', citizenship: 'IR', age: '30', degree: 'master', work: '5', english: 'good', french: 'none', liquid: '3', netWorth: '3', income: '3', investment: '2', businessStage: 'mvp', admission: 'no', jobOffer: 'no', endorsement: 'no' },
  talent: { goal: 'talent', residence: 'CA', citizenship: 'IN', age: '35', degree: 'phd', work: '10', english: 'veryGood', french: 'basic', liquid: '4', netWorth: '5', income: '5', investment: '3', businessStage: 'none', admission: 'skip', jobOffer: 'yes', endorsement: 'no', talent: ['publications', 'citations', 'judging'] },
};

export default function DevSeed() {
  const p = useLocalSearchParams<{ assess?: string; preset?: string; locale?: string; mode?: string; to?: string; steps?: string }>();
  const { set, reset } = useStore();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!__DEV__) return setDone(true);
    void (async () => {
      if (p.preset === 'none') await reset();
      const answers = p.preset ? PRESETS[p.preset] : undefined;
      const patch: Parameters<typeof set>[0] = { onboarded: true };
      if (p.locale && p.locale in LOCALES) patch.locale = p.locale as Locale;
      if (p.mode === 'paper' || p.mode === 'night' || p.mode === 'system') patch.mode = p.mode as ModePref;
      if (answers) {
        const { outcome } = outcomeFor(answers);
        patch.answers = answers;
        patch.outcome = outcome;
        patch.step = 0;
        if (p.steps && outcome !== 'too-early') patch.done = { [outcome]: p.steps.split(',') as never };
      }
      if (p.assess && ASSESS[p.assess]) {
        patch.assess = ASSESS[p.assess];
        patch.assessAt = new Date().toISOString();
        patch.assessStep = -1;
      }
      set(patch);
      setDone(true);
    })();
  }, []);

  if (!done) return null;
  return <Redirect href={(__DEV__ && p.to ? p.to : '/(tabs)/home') as never} />;
}
