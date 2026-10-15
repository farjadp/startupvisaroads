// Assessment v2 results (spec §4, Farjad 15 Oct 2026): the three closest
// routes as cards with "% match with the published criteria", coverage
// ("based on X of Y conditions") and the two biggest gaps; then the rest;
// then routes not open to this user (paused, or closed to their passport)
// with the reason and no %. Primary: "See what to close first". Secondary:
// the mentor review. Never "chance", never a ring, no count-up.
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { toUsdExact } from '@shared/fx';
import { ROUTES_V2, routeV2 } from '@shared/routes-v2';
import { match, rank, type MatchResult } from '@shared/routes-v2/match';
import { metCount, preferredFamily, toProfile, topGaps } from '@/content/assessment';
import { COUNTRY_NAMES, type Country } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { CountryPicture } from '@/ui/CountryPicture';
import { Flag } from '@/ui/Flag';
import { Button, Disclaimer, Heading, Label, LinkRow, Ruled, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

function ResultCard({ m, lead }: { m: MatchResult; lead?: boolean }) {
  const { t, pick, count } = useI18n();
  const { c } = useTheme();
  const route = routeV2(m.route)!;
  const name = pick(route.name);
  const gaps = topGaps(m)
    .map((k) => route.criteria.find((cr) => cr.key === k))
    .filter(Boolean)
    .map((cr) => pick(cr!.label).text);
  const pct = `${count(m.pct ?? 0)}${t('assess2.pctSign')}`;
  const coverage = t('assess2.coverage', { n: count(m.coverage.scored), total: count(m.coverage.of) });
  // Thin coverage: what is met, never a % (a "100%" on one checkable condition reads as "you qualify").
  const figure = m.thin ? t('assess2.thinMet', { met: count(metCount(m)), n: count(m.coverage.scored) }) : pct;
  const figureA11y = m.thin ? `${figure}, ${t('assess2.notChance')}` : t('assess2.matchA11y', { pct });
  return (
    <Pressable
      onPress={() => router.push(`/(tabs)/countries/route/${route.key}`)}
      accessibilityRole="button"
      accessibilityLabel={[name.text, figureA11y, coverage, gaps.length ? `${t('assess2.gaps')}: ${gaps.join('; ')}` : ''].filter(Boolean).join('. ')}
      style={({ pressed }) => ({ borderWidth: lead ? 1.5 : 1, borderColor: lead ? c.fg : c.rule, opacity: pressed ? 0.85 : 1 })}
    >
      {lead ? <CountryPicture country={route.country as Country} height={110} /> : null}
      <View style={{ padding: space.s4, gap: space.s2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2 }}>
          <Flag country={route.country as Country} width={18} />
          <T variant="row" weight="bold" lang={name.lang} style={{ flexShrink: 1 }}>
            {name.text}
          </T>
        </View>
        <T variant={lead && !m.thin ? 'figure' : 'headline'}>{figure}</T>
        <T variant="caption" tone="fgMuted">
          {m.thin ? t('assess2.notChance') : t('assess2.matchLine')}
        </T>
        <T variant="caption" tone="fgMuted">
          {m.thin ? `${coverage} · ${t('assess2.thin')}` : coverage}
        </T>
        {gaps.length ? (
          <View style={{ gap: 2, marginTop: space.s1 }}>
            <T variant="label" tone="fgMuted">
              {t('assess2.gaps')}
            </T>
            {gaps.map((g) => (
              <T key={g} variant="caption">
                {`– ${g}`}
              </T>
            ))}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function Results() {
  const { t, pick, count } = useI18n();
  const { state } = useStore();
  const [all, setAll] = useState(false);

  if (!state.assessAt) {
    return (
      <Screen edges={[]}>
        <T variant="body">{t('assess2.noResult')}</T>
        <Button label={t('assess.start')} onPress={() => router.push('/assessment')} />
      </Screen>
    );
  }

  const profile = toProfile(state.assess);
  const ranked = rank(ROUTES_V2, profile, toUsdExact, preferredFamily(state.assess));
  const closed = ROUTES_V2.map((r) => match(r, profile, toUsdExact)).filter((m) => !m.runnable);
  const top = ranked.slice(0, 3);
  // The goal they picked, when the closest routes are all elsewhere: its best
  // routes, even with low coverage, labelled with how much the % rests on.
  const goal = preferredFamily(state.assess);
  const forGoal = goal ? ranked.filter((m) => routeV2(m.route)?.family === goal && !top.includes(m)).slice(0, 3) : [];
  const rest = ranked.slice(3).filter((m) => !forGoal.includes(m));
  // Routes closed to their passport, one line per country: the reason is the same.
  const blocked = new Map<string, MatchResult[]>();
  for (const m of closed.filter((x) => x.blocked)) blocked.set(routeV2(m.route)!.country, [...(blocked.get(routeV2(m.route)!.country) ?? []), m]);
  const sub = (m: MatchResult) => {
    const r = routeV2(m.route)!;
    const country = pick(COUNTRY_NAMES[r.country as Country]).text;
    if (m.thin) return `${country} · ${t('assess2.thinMet', { met: count(metCount(m)), n: count(m.coverage.scored) })} · ${t('assess2.unchecked', { n: count(m.coverage.of - m.coverage.scored) })}`;
    return `${country} · ${count(m.pct ?? 0)}${t('assess2.pctSign')} · ${t('assess2.coverage', { n: count(m.coverage.scored), total: count(m.coverage.of) })}`;
  };

  return (
    <Screen edges={[]}>
      <Heading role="display-m">{t('assess2.resultsTitle')}</Heading>
      <T variant="body" tone="fgMuted">
        {t('assess2.resultsLead')}
      </T>
      {top.length === 0 ? <T variant="body">{t('assess2.nothingScored')}</T> : null}
      {top.map((m, i) => (
        <ResultCard key={m.route} m={m} lead={i === 0} />
      ))}
      {goal && forGoal.length ? (
        <View style={{ gap: space.s2 }}>
          <Label>{t('assess2.forGoal', { family: t(`families.${goal}`) })}</Label>
          <T variant="caption" tone="fgMuted">
            {t('assess2.forGoalNote')}
          </T>
          <Ruled>
            {forGoal.map((m) => (
              <LinkRow key={m.route} label={pick(routeV2(m.route)!.name).text} sub={sub(m)} onPress={() => router.push(`/(tabs)/countries/route/${m.route}`)} />
            ))}
          </Ruled>
        </View>
      ) : null}

      {top[0] ? <Button label={t('assess2.closeFirst')} onPress={() => router.push(`/(tabs)/countries/route/${top[0].route}`)} /> : null}
      <Button kind="secondary" label={t('assess2.mentor')} onPress={() => router.navigate('/(tabs)/me/mentor')} />

      {rest.length ? (
        <View>
          <Label>{t('assess2.others')}</Label>
          {all ? (
            <Ruled>
              {rest.map((m) => {
                const r = routeV2(m.route)!;
                return <LinkRow key={m.route} label={pick(r.name).text} sub={sub(m)} onPress={() => router.push(`/(tabs)/countries/route/${r.key}`)} />;
              })}
            </Ruled>
          ) : (
            <Button kind="link" icon={null} label={t('assess2.seeAll', { n: count(rest.length) })} onPress={() => setAll(true)} />
          )}
        </View>
      ) : null}

      {closed.length ? (
        <View>
          <Label>{t('assess2.notOpen')}</Label>
          <Ruled>
            {closed
              .filter((m) => !m.blocked)
              .map((m) => {
                const r = routeV2(m.route)!;
                return <LinkRow key={m.route} label={pick(r.name).text} sub={`${pick(COUNTRY_NAMES[r.country as Country]).text} · ${t(`route2.statusShort.${r.status}`)}`} onPress={() => router.push(`/(tabs)/countries/route/${r.key}`)} />;
              })}
            {[...blocked].map(([country, ms]) => {
              const r = routeV2(ms[0].route)!;
              const name = pick(COUNTRY_NAMES[country as Country]).text;
              return (
                <LinkRow
                  key={country}
                  label={ms.length > 1 ? t('assess2.blockedGroup', { country: name, n: count(ms.length) }) : pick(r.name).text}
                  sub={pick(r.blockedCitizenships!.reason).text}
                  onPress={() => router.push(ms.length > 1 ? `/(tabs)/countries/country/${country}` : `/(tabs)/countries/route/${r.key}`)}
                />
              );
            })}
          </Ruled>
        </View>
      ) : null}

      <Button kind="link" icon={null} label={t('assess2.retake')} onPress={() => router.push('/assessment')} />
      <Disclaimer onAbout={() => router.navigate('/(tabs)/me/about')} />
    </Screen>
  );
}
