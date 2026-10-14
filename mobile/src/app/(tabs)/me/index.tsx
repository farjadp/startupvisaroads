// Me / Progress (4.1). Level, points and CTA weight all derive from the one
// score through the bands (rule 8); badges only for real milestones (rule 4).
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { STEPS } from '@/content/checklist';
import { ROUTES, ruleFor } from '@/content/routes';
import { roadView } from '@/engine/road';
import { mentorIsPrimary, type Level } from '@/engine/readiness';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space, size } from '@/theme/tokens';
import { Icon, type IconName } from '@/ui/Icon';
import { Button, CheckRow, Disclaimer, Heading, Label, Ruled, Screen } from '@/ui/kit';
import { NotScored } from '@/ui/NotScored';
import { ScoreBlock } from '@/ui/ScoreBlock';
import { T } from '@/ui/T';

const LEVELS: Level[] = ['explorer', 'planner', 'ready', 'applicant'];

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

export default function Me() {
  const { state, toggleStep } = useStore();
  const i18n = useI18n();
  const { t, pick, count, locale } = i18n;
  const { c } = useTheme();
  const outcome = state.outcome;

  const header = (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <View style={{ flex: 1 }}>
        <Heading>{t('me.title')}</Heading>
      </View>
      <SettingsButton />
    </View>
  );

  const allDone = Object.values(state.done).flat();
  const badges: { id: string; icon: IconName; earned: boolean }[] = [
    { id: 'pathfinder', icon: 'compass', earned: outcome !== null },
    { id: 'funds', icon: 'coins', earned: state.fundsUsed },
    { id: 'language', icon: 'speech', earned: allDone.includes('language-test') },
    { id: 'brief', icon: 'doc', earned: allDone.includes('business-brief') },
    { id: 'sources', icon: 'shield', earned: state.sourcesOpened.length >= 3 },
  ];

  if (!outcome || outcome === 'too-early') {
    return (
      <Screen>
        {header}
        <T variant="body" tone="fgMuted">
          {outcome === 'too-early' ? t('result.tooEarlyBody') : t('me.emptyLead')}
        </T>
        <Button label={t('me.start')} onPress={() => router.push('/pathfinder')} />
        <View>
          <Label>{t('me.earned')}</Label>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.s3, marginTop: space.s2 }}>
            {badges.map((b) => (
              <Badge key={b.id} icon={b.icon} label={t(`me.badges.${b.id}`)} earned={b.earned} />
            ))}
          </View>
        </View>
        <Button kind="link" label={t('me.mentor')} onPress={() => router.push('/(tabs)/me/mentor')} />
        <Disclaimer onAbout={() => router.push('/(tabs)/me/about')} />
      </Screen>
    );
  }

  const v = roadView(outcome, state.answers, state.done[outcome], { sourceOpened: state.sourcesOpened.includes(outcome), newsRead: state.newsRead });
  const rule = ruleFor(outcome);
  const unscored = locale === 'fa' && rule ? rule.unscored ?? [] : ROUTES[outcome].unscoredEn;
  const next = v.steps.filter((s) => !v.stepsDone.includes(s)).slice(0, 3);
  const per = Math.round(40 / v.steps.length);
  const levelIndex = LEVELS.indexOf(v.level.level);

  return (
    <Screen>
      {header}
      <T variant="row" tone="fgMuted">
        {pick(ROUTES[outcome].name).text}
      </T>
      <ScoreBlock score={v.score} level={v.level.level} next={v.level.next} pointsToNext={v.level.pointsToNext} />

      <View accessible accessibilityLabel={LEVELS.map((l, i) => `${t(`levels.${l}`)}${i === levelIndex ? ' ✓' : ''}`).join(', ')} style={{ flexDirection: 'row', gap: 4 }}>
        {LEVELS.map((l, i) => (
          <View key={l} style={{ flex: 1, gap: 6 }}>
            <View style={{ height: 8, backgroundColor: i <= levelIndex ? c.indicator : c.rule }} />
            <T variant="caption" weight={i === levelIndex ? 'bold' : 'regular'} tone={i === levelIndex ? 'fg' : 'fgMuted'} numberOfLines={2}>
              {t(`levels.${l}`)}
            </T>
          </View>
        ))}
      </View>

      <NotScored gaps={v.gaps} items={unscored} itemsLang={locale === 'fa' ? 'fa' : 'en'} />

      <View>
        <Label>{t('me.earned')}</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.s3, marginTop: space.s2 }}>
          {badges.map((b) => (
            <Badge key={b.id} icon={b.icon} label={t(`me.badges.${b.id}`)} earned={b.earned} />
          ))}
        </View>
      </View>

      {next.length ? (
        <View>
          <Label>{t('me.nextMoves')}</Label>
          <Ruled>
            {next.map((s) => (
              <CheckRow key={s} label={pick(STEPS[s]).text} checked={false} onToggle={() => toggleStep(outcome, s)} trailing={t('me.points', { n: count(per) })} />
            ))}
          </Ruled>
          <Button kind="link" label={t('me.allSteps')} onPress={() => router.navigate(`/(tabs)/roads/${outcome}`)} />
        </View>
      ) : null}

      {mentorIsPrimary(v.score) ? (
        <Button label={t('me.mentor')} onPress={() => router.push('/(tabs)/me/mentor')} />
      ) : (
        <Button kind="link" label={t('me.mentor')} onPress={() => router.push('/(tabs)/me/mentor')} />
      )}
      <Disclaimer onAbout={() => router.push('/(tabs)/me/about')} />
    </Screen>
  );
}
