// Route page v2 (spec 2026-10-15 §3), read from lib/routes-v2: the deciding
// fact first, then the conditions we can check and the ones only the
// authority decides, the money (with "about USD" when the user asked for it),
// time, fees, the path to permanent residence and every source with its date.
// Unverified routes say so before any figure.
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';
import { toUsd, type FxCurrency } from '@shared/fx';
import { routeV2 } from '@shared/routes-v2';
import type { Criterion, MoneyLine } from '@shared/routes-v2/types';
import { COUNTRY_NAMES, type Country, type RouteKey } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { Flag } from '@/ui/Flag';
import { Banner, Button, Disclaimer, Heading, Label, LinkRow, Ruled, Screen, SourceLine } from '@/ui/kit';
import { T } from '@/ui/T';

/** Label beside amount; stacked at accessibility text sizes so the label never breaks word by word (HIG Dynamic Type). */
function useAmountRow() {
  const { fontScale } = useWindowDimensions();
  return fontScale >= 1.35
    ? ({ flexDirection: 'column', gap: 2 } as const)
    : ({ flexDirection: 'row', justifyContent: 'space-between', gap: space.s3 } as const);
}

// v2 routes the app already has a step checklist for (v1 route pages).
const V1_CHECKLIST: Record<string, RouteKey> = {
  'ca-pnp-nova-scotia': 'nova-scotia',
  'ca-pnp-new-brunswick': 'new-brunswick',
  'us-eb2-niw': 'eb2niw',
  'dk-startup': 'denmark',
  'fi-startup': 'finland',
  'ee-startup': 'estonia',
  'nl-startup': 'netherlands',
  'it-startup': 'italy',
  'tr-tech-visa': 'turkey',
};

function CriterionRow({ c }: { c: Criterion }) {
  const { pick } = useI18n();
  const { c: col } = useTheme();
  const label = pick(c.label);
  return (
    <View style={{ paddingVertical: space.s3, borderBottomWidth: 1, borderBottomColor: col.rule, gap: space.s1 }}>
      <T variant="row" weight={c.weight === 3 ? 'bold' : 'medium'} lang={label.lang}>
        {label.text}
      </T>
      {c.note ? (
        <T variant="caption" tone="fgMuted" lang={pick(c.note).lang}>
          {pick(c.note).text}
        </T>
      ) : null}
    </View>
  );
}

function MoneyRow({ m }: { m: MoneyLine }) {
  const { t, pick, money } = useI18n();
  const { c } = useTheme();
  const { state } = useStore();
  const amount = money(m.amount, m.currency);
  const shown = m.approx ? t('funds.about', { amount }) : amount;
  const usd = state.fundsUsd && m.currency !== 'USD' ? t('funds.about', { amount: money(toUsd(m.amount, m.currency as FxCurrency), 'USD') }) : null;
  const label = pick(m.label);
  const row = useAmountRow();
  const basis = m.basis === 'perYear' ? t('route2.perYear') : t(`funds.basis.${m.basis}`);
  return (
    <View
      accessible
      accessibilityLabel={[`${label.text}: ${shown}`, basis, usd].filter(Boolean).join(', ')}
      style={{ paddingVertical: space.s3, borderBottomWidth: 1, borderBottomColor: c.rule, gap: 2 }}
    >
      <View style={row}>
        <T variant="row" tone="fgMuted" lang={label.lang} style={{ flexShrink: 1 }}>
          {label.text}
        </T>
        <T variant="row" weight="bold">
          {shown}
        </T>
      </View>
      <T variant="caption" tone="fgMuted">
        {[basis, usd].filter(Boolean).join(' · ')}
      </T>
      {m.shows ? (
        <T variant="caption" tone="fgMuted" lang={pick(m.shows).lang}>
          {pick(m.shows).text}
        </T>
      ) : null}
    </View>
  );
}

export default function RoutePage() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const { t, pick, money } = useI18n();
  const row = useAmountRow();
  const route = routeV2(String(key));
  if (!route) return null;

  const name = pick(route.name);
  const fact = pick(route.fact);
  const agency = pick(route.agency);
  const checkable = route.criteria.filter((c) => c.scoreable);
  const authority = route.criteria.filter((c) => !c.scoreable);
  // Every source keeps its own line and date: several figures can come from different pages of one site (Migri).
  const seen = new Set<string>();
  const sources = route.sources.filter((s) => (seen.has(s.url) ? false : (seen.add(s.url), true)));
  // A paused or closed route carries no offer: no CTA, no checklist (trust rules).
  const runnable = route.status === 'open' || route.status === 'limited';
  const v1 = runnable ? V1_CHECKLIST[route.key] : undefined;

  return (
    <Screen edges={[]}>
      <Stack.Screen options={{ title: pick(COUNTRY_NAMES[route.country as Country]).text }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2 }}>
        <Flag country={route.country as Country} width={20} />
        <T variant="label" tone="fgMuted">
          {t(`families.${route.family}`)}
        </T>
      </View>
      <Heading role="display-m" lang={name.fallback ? name.lang : undefined}>
        {name.text}
      </Heading>
      {/* The deciding authority, in plain text: some names are long (UAE: ICP or GDRFA, with a DFF nomination). */}
      <T variant="caption" tone="fgMuted" lang={agency.lang}>
        {agency.text}
      </T>
      {/* Unverified before any figure (the fact can hold one); the status banner follows the fact it refers to. */}
      {!route.verified ? <Banner text={t('route2.unverified')} /> : null}
      <T variant="body" weight="bold" lang={fact.lang}>
        {fact.text}
      </T>
      {fact.fallback ? (
        <T variant="caption" tone="fgMuted">
          {t('common.inEnglish')}
        </T>
      ) : null}
      {route.status !== 'open' ? <Banner text={t(`route2.status.${route.status}`)} /> : null}

      {checkable.length ? (
        <View>
          <Label>{t('route2.checkable')}</Label>
          <Ruled>{checkable.map((c) => <CriterionRow key={c.key} c={c} />)}</Ruled>
        </View>
      ) : null}
      {authority.length ? (
        <View>
          <Label>{t('route2.authority')}</Label>
          <Ruled>{authority.map((c) => <CriterionRow key={c.key} c={c} />)}</Ruled>
        </View>
      ) : null}

      {route.money.length ? (
        <View>
          <Label>{t('route2.money')}</Label>
          <Ruled>{route.money.map((m) => <MoneyRow key={m.key} m={m} />)}</Ruled>
          <T variant="caption" tone="fgMuted" style={{ marginTop: space.s2 }}>
            {t('funds.notApproval')}
          </T>
        </View>
      ) : null}

      {route.processing || route.fees?.length ? (
        <View style={{ gap: space.s2 }}>
          <Label>{t('route2.timeAndFees')}</Label>
          {route.processing ? <T variant="body" lang={pick(route.processing.text).lang}>{pick(route.processing.text).text}</T> : null}
          {route.fees?.map((f, i) => (
            <View key={i} style={row}>
              <T variant="row" tone="fgMuted" lang={pick(f.label).lang} style={{ flexShrink: 1 }}>
                {pick(f.label).text}
              </T>
              <T variant="row" weight="bold">
                {money(f.amount, f.currency)}
              </T>
            </View>
          ))}
        </View>
      ) : null}

      <View style={{ gap: space.s2 }}>
        <Label>{t('route2.pr')}</Label>
        <T variant="body" lang={pick(route.pr).lang}>
          {pick(route.pr).text}
        </T>
      </View>

      {v1 ? (
        <Ruled>
          <LinkRow icon="doc" label={t('route2.steps')} onPress={() => router.push(`/(tabs)/countries/${v1}`)} />
        </Ruled>
      ) : null}
      {runnable ? <Button kind="secondary" label={t('route2.talk')} onPress={() => router.navigate('/(tabs)/me/mentor')} /> : null}
      {sources.map((s) => (
        <SourceLine key={s.url} url={s.url} updated={s.checked} />
      ))}
      <Disclaimer onAbout={() => router.navigate('/(tabs)/me/about')} />
    </Screen>
  );
}
