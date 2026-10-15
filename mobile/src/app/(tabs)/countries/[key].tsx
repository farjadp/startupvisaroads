// Route guide (1.3) with its checklist (1.5): the fact that changes the
// decision first, then what the rules ask, what is not scored, your steps,
// the source with its checked date, and the full guide on the website.
import { Stack, router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { View } from 'react-native';
import { RATES_TO_CAD } from '@shared/fa/programmes';
import { STEPS } from '@/content/checklist';
import { ROUTES, ruleFor, sourceFor, type RouteKey } from '@/content/routes';
import { roadView } from '@/engine/road';
import { checksFor, completeAnswers } from '@/engine/readiness';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { Button, CheckRow, Disclaimer, Heading, Hero, Label, Ruled, Screen, SourceLine, StatusRow } from '@/ui/kit';
import { CHECK_ICON, checkLabel } from '@/ui/phrases';
import { ScoreBlock } from '@/ui/ScoreBlock';
import { T } from '@/ui/T';

const SITE = 'https://visaroads.com';

export default function RouteGuide() {
  const { key: param } = useLocalSearchParams<{ key: string }>();
  const key = (param in ROUTES ? param : 'nova-scotia') as RouteKey;
  const route = ROUTES[key];
  const { state, toggleStep, openedSource } = useStore();
  const i18n = useI18n();
  const { t, pick, locale, meta, count } = i18n;
  const { c } = useTheme();
  const rule = ruleFor(key);
  const src = sourceFor(key);
  const hasAnswers = state.outcome !== null;
  const v = roadView(key, state.answers, state.done[key], { sourceOpened: state.sourcesOpened.includes(key), newsRead: state.newsRead });
  // Without pathfinder answers the rules are listed, never scored against defaults.
  const rules = rule ? checksFor(rule, completeAnswers(state.answers).answers, RATES_TO_CAD).checks : [];
  const fact = pick(route.fact);
  const unscored = locale === 'fa' && rule ? rule.unscored ?? [] : route.unscoredEn;
  const contentLang = locale === 'fa' ? 'fa' : 'en';
  const guidePath = meta.siteLocale === 'fa' && route.guide.fa ? route.guide.fa : `/en${route.guide.en}`;

  return (
    <>
      <Stack.Screen options={{ title: pick(route.name).text }} />
      <Screen edges={[]}>
        <Hero source={route.photo.source} alt={pick(route.photo.alt).text} caption={pick(route.photo.alt).text} height={180} />
        <Heading role="display-m">{pick(route.name).text}</Heading>

        <View style={{ gap: space.s2, padding: space.s4, borderWidth: 1, borderColor: c.fg }}>
          <Label>{t('route.fact')}</Label>
          <T variant="body" weight="medium" lang={fact.fallback ? fact.lang : undefined}>
            {fact.text}
          </T>
          {fact.fallback ? (
            <T variant="caption" tone="fgMuted">
              {t('common.inEnglish')}
            </T>
          ) : null}
        </View>

        {hasAnswers ? <ScoreBlock score={v.score} level={v.level.level} next={v.level.next} pointsToNext={v.level.pointsToNext} /> : null}

        {rules.length ? (
          <View>
            <Label>{t('route.rules')}</Label>
            <Ruled>
              {rules.map((r) =>
                hasAnswers ? (
                  <StatusRow key={r.key} icon={CHECK_ICON[r.key]} label={checkLabel(r, i18n)} status={r.status} statusLabel={t(`status.${r.status}`)} />
                ) : (
                  <View key={r.key} accessible style={{ flexDirection: 'row', gap: space.s3, alignItems: 'center', minHeight: 48, borderBottomWidth: 1, borderBottomColor: c.rule }}>
                    <T variant="row">{checkLabel(r, i18n)}</T>
                  </View>
                ),
              )}
            </Ruled>
          </View>
        ) : null}

        <View style={{ gap: space.s2 }}>
          <Label>{t('route.unscored')}</Label>
          {unscored.map((u) => (
            <T key={u} variant="row" tone="fgMuted" lang={contentLang !== locale ? contentLang : undefined}>
              {'—  '}
              {u}
            </T>
          ))}
          {contentLang !== locale ? (
            <T variant="caption" tone="fgMuted">
              {t('common.inEnglish')}
            </T>
          ) : null}
        </View>

        <View>
          <Label>{t('route.steps')}</Label>
          <T variant="caption" tone="fgMuted" style={{ marginBottom: space.s2 }}>
            {t('route.stepsLead')}
          </T>
          <Ruled>
            {v.steps.map((s) => (
              <CheckRow
                key={s}
                label={pick(STEPS[s]).text}
                checked={v.stepsDone.includes(s)}
                onToggle={() => toggleStep(key, s)}
                trailing={`+${count(Math.round(40 / v.steps.length))}`}
              />
            ))}
          </Ruled>
        </View>

        <SourceLine url={src.url} updated={src.updated} onOpen={() => openedSource(key)} />
        <Button
          kind="secondary"
          icon="external"
          label={t('common.fullGuide')}
          hint={t('common.opensBrowser')}
          onPress={() => {
            openedSource(key);
            void WebBrowser.openBrowserAsync(`${SITE}${guidePath}`);
          }}
        />
        {!hasAnswers ? <Button kind="link" label={t('roads.start')} onPress={() => router.push('/assessment')} /> : null}
        <Disclaimer onAbout={() => router.navigate('/(tabs)/me/about')} />
        <T variant="caption" tone="fgMuted">
          {t('route.photoCredit', { credit: route.photo.credit })}
        </T>
      </Screen>
    </>
  );
}
