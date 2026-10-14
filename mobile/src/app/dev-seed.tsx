// Development only: visaroads://dev-seed?preset=ns&locale=fa&mode=night&to=/(tabs)/me
// Puts the app into a known state so screens can be reviewed in every
// language and mode without tapping through the pathfinder. In a release
// build it changes nothing and goes home.
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import type { StoredAnswers } from '@/engine/readiness';
import { outcomeFor } from '@/engine/road';
import { LOCALES, type Locale } from '@/i18n/locales';
import { useStore, type ModePref } from '@/state/store';

const PRESETS: Record<string, StoredAnswers> = {
  ns: { goal: 'residency', team: 'solo', business: 'revenue', language: 'mid', capital: '200to500', background: 'professional', horizon: 'medium' },
  finland: { goal: 'residency', team: 'team', business: 'mvp', language: 'high', capital: '50to200', background: 'professional', horizon: 'medium' },
  early: { goal: 'growth', team: 'solo', business: 'idea', language: 'low', capital: 'under50', background: 'none', horizon: 'urgent' },
};

export default function DevSeed() {
  const p = useLocalSearchParams<{ preset?: string; locale?: string; mode?: string; to?: string; steps?: string }>();
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
      set(patch);
      setDone(true);
    })();
  }, []);

  if (!done) return null;
  return <Redirect href={(__DEV__ && p.to ? p.to : '/(tabs)/roads') as never} />;
}
