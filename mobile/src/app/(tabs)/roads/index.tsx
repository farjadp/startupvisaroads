// Roads root: the result when there is one (1.2), otherwise the routes list
// with the pathfinder entry (spec 3, empty state 26).
import { router } from 'expo-router';
import { View } from 'react-native';
import { ROUTE_ORDER, ROUTES, PATH_PHOTO, ruleFor, sourceFor, type RouteKey } from '@/content/routes';
import { otherRoads, roadView } from '@/engine/road';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { space } from '@/theme/tokens';
import { Button, Disclaimer, Heading, Hero, Label, LinkRow, Ruled, Screen, SourceLine, StatusRow } from '@/ui/kit';
import { NotScored } from '@/ui/NotScored';
import { CHECK_ICON, checkLabel } from '@/ui/phrases';
import { ScoreBlock } from '@/ui/ScoreBlock';
import { T } from '@/ui/T';
import { mentorIsPrimary } from '@/engine/readiness';
import { completeAnswers } from '@/engine/readiness';

function AllRoads() {
  const { t, pick } = useI18n();
  return (
    <View>
      <Label>{t('roads.all')}</Label>
      <Ruled>
        {ROUTE_ORDER.map((k) => (
          <LinkRow key={k} label={pick(ROUTES[k].name).text} icon="route" onPress={() => router.push(`/(tabs)/roads/${k}`)} />
        ))}
      </Ruled>
    </View>
  );
}

export default function Roads() {
  const { state, openedSource } = useStore();
  const i18n = useI18n();
  const { t, pick, count } = i18n;
  const outcome = state.outcome;

  if (!outcome) {
    return (
      <Screen>
        <Heading>{t('roads.title')}</Heading>
        <Hero source={PATH_PHOTO} alt={t('welcome.photoAlt')} height={160} />
        <T variant="body" tone="fgMuted">
          {t('roads.emptyLead')}
        </T>
        <Button label={t('roads.start')} onPress={() => router.push('/pathfinder')} />
        <AllRoads />
      </Screen>
    );
  }

  const { skipped } = completeAnswers(state.answers);
  const skippedNote = skipped.length ? t('result.skipped', { n: count(skipped.length) }) : null;

  if (outcome === 'too-early') {
    // No "other roads that fit" here: a list of roads with "every scored rule met"
    // under "none of the roads fits" contradicts the answer (trust rule: honest result).
    return (
      <Screen>
        <Heading italicTail={t('result.tooEarlyTail')}>{t('result.tooEarlyTitle')}</Heading>
        <T variant="body">{t('result.tooEarlyBody')}</T>
        {skippedNote ? (
          <T variant="caption" tone="fgMuted">
            {skippedNote}
          </T>
        ) : null}
        <Button kind="secondary" label={t('result.retake')} onPress={() => router.push('/pathfinder')} />
        <Disclaimer onAbout={() => router.push('/(tabs)/me/about')} />
        <AllRoads />
      </Screen>
    );
  }

  const key: RouteKey = outcome;
  const route = ROUTES[key];
  const v = roadView(key, state.answers, state.done[key], { sourceOpened: state.sourcesOpened.includes(key), newsRead: state.newsRead });
  const src = sourceFor(key);
  const rule = ruleFor(key);
  const unscored = i18n.locale === 'fa' && rule ? rule.unscored ?? [] : route.unscoredEn;
  const unscoredLang = i18n.locale === 'fa' ? 'fa' : 'en';
  const others = otherRoads(outcome, state.answers);
  const primaryMentor = mentorIsPrimary(v.score);

  return (
    <Screen edges={[]} scrim>
      <Hero source={route.photo.source} alt={pick(route.photo.alt).text} caption={pick(route.photo.alt).text} height={210} />
      <Heading role="display-m" italicTail={t('result.closest')}>
        {pick(route.name).text}
      </Heading>
      <ScoreBlock score={v.score} level={v.level.level} next={v.level.next} pointsToNext={v.level.pointsToNext} />

      <View>
        <Label>{t('result.rules')}</Label>
        <Ruled>
          {v.checks.map((c) => (
            <StatusRow key={c.key} icon={CHECK_ICON[c.key]} label={checkLabel(c, i18n)} status={c.status} statusLabel={t(`status.${c.status}`)} />
          ))}
          <StatusRow icon="doc" label={i18n.pick(STEPS_LABEL).text} status={v.stepsDone.length ? 'done' : 'not-started'} statusLabel={v.stepsDone.length ? `${count(v.stepsDone.length)} / ${count(v.steps.length)}` : t('status.not-started')} />
        </Ruled>
        {v.noThresholds ? (
          <T variant="caption" tone="fgMuted" style={{ marginTop: space.s2 }}>
            {t('result.noThresholds')}
          </T>
        ) : null}
      </View>

      <View style={{ gap: space.s2 }}>
        <NotScored gaps={v.gaps} items={unscored} itemsLang={unscoredLang} />
        <T variant="caption" tone="fgMuted">
          {t('result.noApproval')}
          {skippedNote ? ` ${skippedNote}` : ''}
        </T>
      </View>

      <View style={{ gap: space.s3 }}>
        <Button label={t('result.checklist')} onPress={() => router.push(`/(tabs)/roads/${key}`)} />
        {primaryMentor ? (
          <Button kind="secondary" label={t('me.mentor')} onPress={() => router.navigate('/(tabs)/me/mentor')} />
        ) : (
          <Button kind="link" label={t('me.mentor')} onPress={() => router.navigate('/(tabs)/me/mentor')} />
        )}
      </View>

      <SourceLine url={src.url} updated={src.updated} onOpen={() => openedSource(key)} />
      <Disclaimer onAbout={() => router.navigate('/(tabs)/me/about')} />

      <OtherRoads list={others} />
      <Button kind="link" label={t('result.retake')} onPress={() => router.push('/pathfinder')} />
    </Screen>
  );
}

const STEPS_LABEL = { en: 'Your steps', fa: 'قدم‌های شما', fr: 'Vos étapes', zh: '您的步骤', ar: 'خطواتك' };

function OtherRoads({ list }: { list: { key: RouteKey; notYet: number; close: number }[] }) {
  const { t, pick, count } = useI18n();
  if (!list.length) return null;
  return (
    <View>
      <Label>{t('result.otherRoads')}</Label>
      <Ruled>
        {list.map((r) => (
          <LinkRow
            key={r.key}
            label={pick(ROUTES[r.key].name).text}
            sub={r.notYet + r.close === 0 ? t('result.gapClear') : [r.notYet ? `${count(r.notYet)} ${t('status.not-yet')}` : '', r.close ? `${count(r.close)} ${t('status.close')}` : ''].filter(Boolean).join(' · ')}
            onPress={() => router.push(`/(tabs)/roads/${r.key}`)}
          />
        ))}
      </Ruled>
    </View>
  );
}
