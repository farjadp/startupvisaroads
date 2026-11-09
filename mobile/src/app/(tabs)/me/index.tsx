// Me (spec 2026-11-09 §7, amendment 7): the case file door on top (coming
// later, announced on the Telegram channel; no account, nothing stored), the
// last result as one row, progress on the roads followed as compact rows,
// learning points as one row opening the list in a sheet, then Settings, About
// and Mentor. The badges grid is gone; a road's earned badges are its caption.
import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, View } from 'react-native';
import { toUsdExact } from '@shared/fx';
import { ROUTES_V2, routeV2 } from '@shared/routes-v2';
import { extrasOf } from '@shared/routes-v2/extras';
import { rank } from '@shared/routes-v2/match';
import { preferredFamily, toProfile } from '@/content/assessment';
import { COUNTRY_NAMES, FAMILY_ICON, type Country } from '@/content/routes';
import { isRunnable } from '@/engine/next-step';
import { allPoints } from '@/engine/points';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { AboutSheet, MentorSheet } from '@/ui/InfoSheets';
import { Button, Disclaimer, Heading, Label, LinkRow, Ruled, Screen } from '@/ui/kit';
import { Sheet } from '@/ui/Sheet';
import { T } from '@/ui/T';

const CHANNEL_URL = 'https://t.me/visaroads';

function CaseCard() {
  const { t } = useI18n();
  const { c } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <View style={{ borderWidth: 1.5, borderColor: c.fg, padding: space.s4, gap: space.s3 }}>
      <T variant="headline" accessibilityRole="header">
        {t('me4.caseTitle')}
      </T>
      <Button kind="secondary" label={t('me4.caseHow')} onPress={() => setOpen(true)} />
      <Sheet open={open} onClose={() => setOpen(false)} title={t('me4.caseHow')}>
        <View style={{ gap: space.s4 }}>
          <T variant="body">{t('me4.caseSheet')}</T>
          <Button label={t('me4.caseChannel')} icon="external" onPress={() => void Linking.openURL(CHANNEL_URL).catch(() => {})} />
        </View>
      </Sheet>
    </View>
  );
}

export default function Me() {
  const { state } = useStore();
  const { t, pick, count, date } = useI18n();
  const [sheet, setSheet] = useState<'points' | 'about' | 'mentor' | null>(null);
  const close = () => setSheet(null);
  const passport = state.assess.citizenship && state.assess.citizenship !== 'skip' ? state.assess.citizenship : null;

  // The same signal as the results screen: a finished v2 assessment.
  const assessed = !!state.assessAt;
  const best = assessed ? rank(ROUTES_V2, toProfile(state.assess), toUsdExact, preferredFamily(state.assess))[0] : undefined;
  const bestRoute = best ? routeV2(best.route) : undefined;

  // Points and badges only for routes this user can run (spec: paused, closed, or shut to their passport).
  const points = allPoints(state, extrasOf).routes.filter((r) => {
    const route = routeV2(r.key);
    return !!route && isRunnable(route, passport);
  });
  const total = points.reduce((s, r) => s + r.points, 0);
  const badgesOf = (key: string) => (points.find((p) => p.key === key)?.badges ?? []).map((b) => t(`me.roadBadges.${b}`));
  const followed = state.following.map((k) => routeV2(k)).filter((r) => !!r);

  const go = (path: Parameters<typeof router.push>[0]) => {
    close();
    router.push(path);
  };

  return (
    <Screen>
      <Heading>{t('me.title')}</Heading>
      <CaseCard />

      {assessed ? (
        <Ruled>
          <LinkRow
            icon="compass"
            label={t('me4.lastResult')}
            sub={bestRoute ? t('me4.lastResultSub', { route: pick(bestRoute.name).text, date: date(state.assessAt!) }) : date(state.assessAt!)}
            onPress={() => router.push('/(tabs)/assess/results')}
          />
        </Ruled>
      ) : (
        <View style={{ gap: space.s3 }}>
          <T variant="body" tone="fgMuted">
            {t('me.emptyLead')}
          </T>
          <Button label={t('me.start')} onPress={() => router.push('/assessment')} />
        </View>
      )}

      {followed.length ? (
        <View>
          <Label>{t('me4.progress')}</Label>
          <Ruled>
            {followed.map((r) => {
              const steps = extrasOf(r.key)?.steps ?? [];
              const done = (state.journey[r.key] ?? []).filter((k) => steps.some((s) => s.key === k)).length;
              const country = pick(COUNTRY_NAMES[r.country as Country]).text;
              // A road the user cannot run says why and shows no progress (passport gate).
              const detail = !isRunnable(r, passport)
                ? [passport && r.blockedCitizenships?.codes.includes(passport) ? t('follow.notForPassport') : t(`route2.statusShort.${r.status}`)]
                : [steps.length ? t('me4.fraction', { done: count(done), total: count(steps.length) }) : null, ...badgesOf(r.key)];
              return <LinkRow key={r.key} icon={FAMILY_ICON[r.family]} label={pick(r.name).text} sub={[country, ...detail].filter(Boolean).join(' · ')} onPress={() => router.push(`/(tabs)/countries/route/${r.key}`)} />;
            })}
          </Ruled>
        </View>
      ) : null}

      <Ruled>
        {points.length ? <LinkRow icon="shield" label={t('me4.learningRow', { n: count(total) })} onPress={() => setSheet('points')} /> : null}
        <LinkRow icon="gear" label={t('me.settings')} onPress={() => router.push('/(tabs)/me/settings')} />
        <LinkRow icon="doc" label={t('me4.about')} onPress={() => setSheet('about')} />
        {/* No v2 score sets the mentor's weight, so the row stays neutral. */}
        <LinkRow icon="speech" label={t('me4.mentor')} onPress={() => setSheet('mentor')} />
      </Ruled>

      <Sheet open={sheet === 'points'} onClose={close} title={t('me.learning')} sub={t('me.learningNote')}>
        <View style={{ gap: space.s2 }}>
          <T variant="figure" accessibilityLabel={t('me.learningA11y', { n: count(total) })}>
            {count(total)}
          </T>
          <Ruled>
            {points.map((r) => {
              const route = routeV2(r.key);
              if (!route) return null;
              return (
                <LinkRow
                  key={r.key}
                  label={pick(route.name).text}
                  sub={[t('me.learningA11y', { n: count(r.points) }), ...badgesOf(r.key)].join(' · ')}
                  onPress={() => go(`/(tabs)/countries/route/${r.key}`)}
                />
              );
            })}
          </Ruled>
        </View>
      </Sheet>
      <AboutSheet open={sheet === 'about'} onClose={close} />
      <MentorSheet open={sheet === 'mentor'} onClose={close} />
      <Disclaimer />
    </Screen>
  );
}
