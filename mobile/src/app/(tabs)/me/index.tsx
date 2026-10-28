// Me / Progress (4.1, on v2 since 27 Oct 2026): the last assessment result in
// brief (the same figure, coverage and unchecked count as the results screen),
// the roads followed with their road-map progress, badges only for real
// milestones (rule 4), learning points, and the mentor as a secondary link.
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { routeV2 } from '@shared/routes-v2';
import { extrasOf } from '@shared/routes-v2/extras';
import { allPoints } from '@/engine/points';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space, size } from '@/theme/tokens';
import { FollowedRoads } from '@/ui/FollowedRoads';
import { Icon, type IconName } from '@/ui/Icon';
import { Button, Disclaimer, Heading, Label, LinkRow, Ruled, Screen } from '@/ui/kit';
import { MatchCard } from '@/ui/MatchCard';
import { T } from '@/ui/T';

function SettingsButton() {
  const { t } = useI18n();
  return (
    <Pressable
      onPress={() => router.push('/(tabs)/me/settings')}
      accessibilityRole="button"
      accessibilityLabel={t('me.settings')}
      hitSlop={8}
      style={{ width: size.touchMin, height: size.touchMin, alignItems: 'center', justifyContent: 'center' }}
    >
      <Icon name="gear" size={22} />
    </Pressable>
  );
}

function Badge({ icon, label, earned }: { icon: IconName; label: string; earned: boolean }) {
  const { c } = useTheme();
  const { t } = useI18n();
  return (
    <View
      accessible
      accessibilityLabel={earned ? label : `${label}, ${t('me.notEarned')}`}
      style={{ flexBasis: '30%', flexGrow: 1, minHeight: 104, padding: space.s3, justifyContent: 'space-between', gap: space.s2, borderWidth: 1, borderStyle: earned ? 'solid' : 'dashed', borderColor: earned ? c.fg : c.fgFaint }}
    >
      <View style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: earned ? c.accent : 'transparent', borderWidth: earned ? 0 : 1, borderStyle: 'dashed', borderColor: c.fgFaint }}>
        <Icon name={icon} color={earned ? c.onAccent : c.fgMuted} />
      </View>
      <T variant="row" weight="bold" tone={earned ? 'fg' : 'fgMuted'}>
        {label}
      </T>
    </View>
  );
}

/** Learning points (spec 2026-10-27): only here, never beside a match %, with the not-approval line under the total. */
function LearningPoints() {
  const { state } = useStore();
  const { t, pick, count } = useI18n();
  // Points and badges are never shown for a route this user cannot run (spec: paused, closed, or shut to their passport).
  const passport = state.assess.citizenship && state.assess.citizenship !== 'skip' ? state.assess.citizenship : null;
  const runnable = (key: string) => {
    const r = routeV2(key);
    return !!r && (r.status === 'open' || r.status === 'limited') && !(passport && r.blockedCitizenships?.codes.includes(passport));
  };
  const routes = allPoints(state, extrasOf).routes.filter((r) => runnable(r.key));
  const total = routes.reduce((s, r) => s + r.points, 0);
  if (!routes.length) return null;
  return (
    <View style={{ gap: space.s2 }}>
      <Label>{t('me.learning')}</Label>
      <T variant="figure" accessibilityLabel={t('me.learningA11y', { n: count(total) })}>
        {count(total)}
      </T>
      <T variant="caption" tone="fgMuted">
        {t('me.learningNote')}
      </T>
      <Ruled>
        {routes.map((r) => {
          const route = routeV2(r.key);
          if (!route) return null;
          const badges = r.badges.map((b) => t(`me.roadBadges.${b}`)).join(' · ');
          return (
            <LinkRow
              key={r.key}
              label={pick(route.name).text}
              sub={[t('me.learningA11y', { n: count(r.points) }), badges].filter(Boolean).join(' · ')}
              onPress={() => router.navigate(`/(tabs)/countries/route/${r.key}`)}
            />
          );
        })}
      </Ruled>
    </View>
  );
}

export default function Me() {
  const { state } = useStore();
  const { t } = useI18n();
  // The same signal as the results screen: a finished v2 assessment.
  const assessed = !!state.assessAt;

  const badges: { id: string; icon: IconName; earned: boolean }[] = [
    { id: 'assessment', icon: 'compass', earned: assessed },
    { id: 'funds', icon: 'coins', earned: state.fundsUsed },
    { id: 'sources', icon: 'shield', earned: state.sourcesOpened.length >= 3 },
  ];

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Heading>{t('me.title')}</Heading>
        </View>
        <SettingsButton />
      </View>
      {assessed ? (
        <View style={{ gap: space.s2 }}>
          <Label>{t('home.lastResult')}</Label>
          <MatchCard picture={false} />
        </View>
      ) : (
        <>
          <T variant="body" tone="fgMuted">
            {t('me.emptyLead')}
          </T>
          <Button label={t('me.start')} onPress={() => router.push('/assessment')} />
        </>
      )}
      <FollowedRoads progress />
      <View>
        <Label>{t('me.earned')}</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.s3, marginTop: space.s2 }}>
          {badges.map((b) => (
            <Badge key={b.id} icon={b.icon} label={t(`me.badges.${b.id}`)} earned={b.earned} />
          ))}
        </View>
      </View>
      <LearningPoints />
      {/* No v2 score sets the mentor's weight (the v1 readiness bands retired), so it stays secondary. */}
      <Button kind="link" label={t('me.mentor')} onPress={() => router.push('/(tabs)/me/mentor')} />
      <Disclaimer onAbout={() => router.push('/(tabs)/me/about')} />
    </Screen>
  );
}
