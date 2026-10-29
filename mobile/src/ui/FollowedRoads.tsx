// The roads a user follows (v2 route keys), for Home and Me: in the order they
// were saved (app order, never ranked), each opening its route page. With
// `progress`, the road-map steps ticked; a route shut to the user's passport
// says so instead and shows no progress (passport gate).
import { router } from 'expo-router';
import { View } from 'react-native';
import { routeV2 } from '@shared/routes-v2';
import { extrasOf } from '@shared/routes-v2/extras';
import { COUNTRY_NAMES, FAMILY_ICON, type Country } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { Label, LinkRow, Ruled } from '@/ui/kit';

export function FollowedRoads({ progress = false }: { progress?: boolean }) {
  const { t, pick, count } = useI18n();
  const { state } = useStore();
  const passport = state.assess.citizenship && state.assess.citizenship !== 'skip' ? state.assess.citizenship : null;
  const routes = state.following.map((k) => routeV2(k)).filter((r) => !!r);
  if (!routes.length) return null;
  return (
    <View>
      <Label>{t('home.followed')}</Label>
      <Ruled>
        {routes.map((r) => {
          const country = pick(COUNTRY_NAMES[r.country as Country]).text;
          const shut = !!passport && !!r.blockedCitizenships?.codes.includes(passport);
          const steps = extrasOf(r.key)?.steps ?? [];
          const done = (state.journey[r.key] ?? []).filter((k) => steps.some((s) => s.key === k)).length;
          const runnable = r.status === 'open' || r.status === 'limited';
          const detail = shut
            ? [t('follow.notForPassport')]
            : [
                r.status !== 'open' ? t(`route2.statusShort.${r.status}`) : null,
                progress && runnable && steps.length ? t('road.stepsDone', { done: count(done), total: count(steps.length) }) : null,
              ];
          return (
            <LinkRow
              key={r.key}
              icon={FAMILY_ICON[r.family]}
              label={pick(r.name).text}
              sub={[country, ...detail].filter(Boolean).join(' · ')}
              onPress={() => router.push(`/(tabs)/countries/route/${r.key}`)}
            />
          );
        })}
      </Ruled>
    </View>
  );
}
