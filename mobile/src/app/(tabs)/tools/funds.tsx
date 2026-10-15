// Funds to show, by country (2.2; per-country since 15 Oct 2026). Every
// figure is read from lib/funds.ts and lib/canada-suv.ts, the modules the
// website prints, never copied into the app. Each country says how its figure
// is counted (per month, per year, one-off), what the money must show, and
// where the figure comes from; showing it never means approval (trust rules).
import { router } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { AccessibilityInfo, Platform, Pressable, Switch, View } from 'react-native';
import { SUV_SETTLEMENT_FUNDS, SUV_SETTLEMENT_FUNDS_EXTRA_PER_PERSON, SUV_SETTLEMENT_FUNDS_UPDATED, SUV_SOURCES, SUV_VERIFIED, settlementFundsFor } from '@shared/canada-suv';
import { FUNDS, type FundsCountry, type FundsLine } from '@shared/funds';
import { FX, toUsd, type FxCurrency } from '@shared/fx';
import { parseIsoDate } from '@/i18n/format';
import { COUNTRY_NAMES, COUNTRY_ORDER, ROUTES } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space, size } from '@/theme/tokens';
import { Flag } from '@/ui/Flag';
import { Icon } from '@/ui/Icon';
import { Banner, Disclaimer, Heading, SourceLine, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

const MAX = 12;

// "Also show in US dollars" (Farjad, 15 Oct 2026). The official figure stays first and unchanged;
// the dollar line is small, muted, rounded, says "about" and names the ECB rate date.
const FX_AGE_DAYS = Math.floor((Date.now() - parseIsoDate(FX.date).getTime()) / 86_400_000);
const FX_OLD = FX_AGE_DAYS > 30;
const FX_TOO_OLD = FX_AGE_DAYS > 90;
const UsdCtx = createContext(false);

/** The "about USD …" line for an amount, or null when the dollar view is off. */
function useUsdLine(short = false): (amount: number, currency: FxCurrency) => string | null {
  const on = useContext(UsdCtx);
  const { t, money, date } = useI18n();
  // Table rows say only "about USD …": the rate and its date are on the figure above them.
  return (amount, currency) => {
    if (!on) return null;
    const usd = money(toUsd(amount, currency), 'USD');
    return short ? t('funds.about', { amount: usd }) : t('funds.usdLine', { amount: usd, date: date(FX.date) });
  };
}

function UsdSwitch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  const { t } = useI18n();
  const { c } = useTheme();
  return (
    <View style={{ gap: space.s2 }}>
      <Pressable
        onPress={() => onChange(!on)}
        accessibilityRole="switch"
        accessibilityState={{ checked: on }}
        accessibilityLabel={t('funds.usdSwitch')}
        style={{ flexDirection: 'row', alignItems: 'center', gap: space.s3, minHeight: Platform.OS === 'android' ? size.touchMinAndroid : size.touchMin }}
      >
        <T variant="row" style={{ flex: 1 }} importantForAccessibility="no">
          {t('funds.usdSwitch')}
        </T>
        <Switch value={on} onValueChange={onChange} trackColor={{ true: c.indicator, false: c.fgMuted }} ios_backgroundColor={c.fgMuted} thumbColor={Platform.OS === 'android' ? c.bg : undefined} accessible={false} importantForAccessibility="no-hide-descendants" />
      </Pressable>
      {/* Read before the figures: the dollar amounts are a guide, never the requirement. */}
      {on ? (
        <T variant="caption" tone="fgMuted">
          {FX_OLD ? `${t('funds.usdNote')} ${t('funds.usdOld')}` : t('funds.usdNote')}
        </T>
      ) : null}
    </View>
  );
}

function CanadaFunds() {
  const { t, money, count, date, meta } = useI18n();
  const usd = useUsdLine();
  const usdShort = useUsdLine(true);
  const { c } = useTheme();
  const [n, setN] = useState(3);
  const amount = settlementFundsFor(n);
  const people = n === 1 ? t('funds.person', { n: count(1) }) : t('funds.people', { n: count(n) });

  const change = (d: number) => {
    const next = Math.max(1, Math.min(MAX, n + d));
    setN(next);
    // Announce the new amount (spec 8). Android reads the live region below.
    if (Platform.OS === 'ios') {
      const p = next === 1 ? t('funds.person', { n: count(1) }) : t('funds.people', { n: count(next) });
      AccessibilityInfo.announceForAccessibility(t('funds.announce', { people: p, amount: money(settlementFundsFor(next), 'CAD') }));
    }
  };

  return (
    <>
        <T variant="row" tone="fgMuted" nativeID="familyLabel">
          {t('funds.family')}
        </T>
        <View
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={t('funds.family')}
          accessibilityValue={{ text: people }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={(e) => change(e.nativeEvent.actionName === 'increment' ? 1 : -1)}
          style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: c.fg, minHeight: size.button }}
        >
          <Pressable
            onPress={() => change(-1)}
            disabled={n <= 1}
            accessibilityLabel={t('funds.fewer')}
            importantForAccessibility="no"
            style={({ pressed }) => ({ width: size.button, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', borderEndWidth: 1, borderColor: c.fg, backgroundColor: pressed ? c.rowPressed : 'transparent' })}
          >
            <T variant="headline" tone={n <= 1 ? 'disabledFg' : 'fg'}>
              −
            </T>
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: space.s2 }}>
            <Icon name="person" />
            <T variant="headline">{people}</T>
          </View>
          <Pressable
            onPress={() => change(1)}
            disabled={n >= MAX}
            accessibilityLabel={t('funds.more')}
            importantForAccessibility="no"
            style={({ pressed }) => ({ width: size.button, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', borderStartWidth: 1, borderColor: c.fg, backgroundColor: pressed ? c.rowPressed : 'transparent' })}
          >
            <T variant="headline" tone={n >= MAX ? 'disabledFg' : 'fg'}>
              +
            </T>
          </Pressable>
        </View>

        <View accessibilityLiveRegion="polite" accessible style={{ gap: space.s2, paddingVertical: space.s5, borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.fg }}>
          <T variant="row" tone="fgMuted">
            {t('funds.need')}
          </T>
          <View style={{ alignSelf: 'flex-start', backgroundColor: c.accent, paddingHorizontal: space.s2, paddingTop: space.s2 }}>
            {/* Estedad's wide digits wrap the amount in fa/ar; shrink to fit there. Latin keeps its natural size (fitting clips DM Serif tops on iOS). */}
            <T variant="figure" tone="onAccent" {...(meta.script === 'arabic' ? { numberOfLines: 1, adjustsFontSizeToFit: true, minimumFontScale: 0.6 } : null)}>
              {money(amount, 'CAD')}
            </T>
          </View>
          <T variant="caption" tone="fgMuted">
            {t('funds.unit')}
          </T>
          {usd(amount, 'CAD') ? (
            <T variant="caption" tone="fgMuted">
              {usd(amount, 'CAD')}
            </T>
          ) : null}
          <T variant="caption" tone="fgMuted">
            {t('funds.notApproval')}
          </T>
        </View>

        <View accessible={false}>
          {Object.entries(SUV_SETTLEMENT_FUNDS).map(([k, v]) => {
            const size_ = Number(k);
            const mine = size_ === n;
            return (
              <View
                key={k}
                accessible
                accessibilityLabel={[`${size_ === 1 ? t('funds.person', { n: count(1) }) : t('funds.people', { n: count(size_) })}: ${money(v, 'CAD')}`, usdShort(v, 'CAD')].filter(Boolean).join(', ')}
                style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: c.rule }}>
                <T variant="row" weight={mine ? 'bold' : 'regular'} tone={mine ? 'fg' : 'fgMuted'}>
                  {size_ === 1 ? t('funds.person', { n: count(1) }) : t('funds.people', { n: count(size_) })}
                </T>
                <View style={{ alignItems: 'flex-end' }}>
                  <T variant="row" weight={mine ? 'bold' : 'regular'}>
                    {money(v, 'CAD')}
                  </T>
                  {usdShort(v, 'CAD') ? (
                    <T variant="caption" tone="fgMuted">
                      {usdShort(v, 'CAD')}
                    </T>
                  ) : null}
                </View>
              </View>
            );
          })}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
            <T variant="row" tone="fgMuted">
              {t('funds.extra')} (8+)
            </T>
            <T variant="row">+ {money(SUV_SETTLEMENT_FUNDS_EXTRA_PER_PERSON, 'CAD')}</T>
          </View>
        </View>

        <T variant="caption" tone="fgMuted">
          {t('funds.source', { date: date(SUV_SETTLEMENT_FUNDS_UPDATED) })}
        </T>
        <SourceLine url={SUV_SOURCES.eligibility} updated={SUV_VERIFIED} />
    </>
  );
}

function Figure({ line }: { line: FundsLine }) {
  const { t, money, meta } = useI18n();
  const { c } = useTheme();
  const usd = useUsdLine()(line.amount, line.currency);
  const amount = money(line.amount, line.currency);
  const shown = line.approx ? t('funds.about', { amount }) : amount;
  // Label, figure, unit and the dollar guide in one element, read in that order.
  return (
    <View accessible accessibilityLabel={[`${t(`funds.lines.${line.key}`)}: ${shown}`, t(`funds.basis.${line.basis}`), usd].filter(Boolean).join(', ')} style={{ gap: space.s2, paddingVertical: space.s4, borderBottomWidth: 1, borderColor: c.fg }}>
      <T variant="row" tone="fgMuted">
        {t(`funds.lines.${line.key}`)}
      </T>
      <View style={{ alignSelf: 'flex-start', backgroundColor: c.accent, paddingHorizontal: space.s2, paddingTop: space.s2 }}>
        <T variant="figure" tone="onAccent" {...(meta.script === 'arabic' ? { numberOfLines: 1, adjustsFontSizeToFit: true, minimumFontScale: 0.6 } : null)}>
          {shown}
        </T>
      </View>
      <T variant="caption" tone="fgMuted">
        {t(`funds.basis.${line.basis}`)}
      </T>
      {usd ? (
        <T variant="caption" tone="fgMuted">
          {usd}
        </T>
      ) : null}
    </View>
  );
}

function TierRow({ line }: { line: FundsLine }) {
  const { t, money } = useI18n();
  const { c } = useTheme();
  const usd = useUsdLine(true)(line.amount, line.currency);
  const amount = money(line.amount, line.currency);
  return (
    <View
      accessible
      accessibilityLabel={[`${t(`funds.lines.${line.key}`)}: ${line.approx ? t('funds.about', { amount }) : amount}`, t(`funds.basis.${line.basis}`), usd].filter(Boolean).join(', ')}
      style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.s3, paddingVertical: space.s3, borderBottomWidth: 1, borderBottomColor: c.rule }}
    >
      <T variant="row" tone="fgMuted" style={{ flexShrink: 1 }}>
        {t(`funds.lines.${line.key}`)}
      </T>
      <View style={{ alignItems: 'flex-end' }}>
        <T variant="row" weight="bold">
          {line.approx ? t('funds.about', { amount }) : amount}
        </T>
        {usd ? (
          <T variant="caption" tone="fgMuted">
            {usd}
          </T>
        ) : null}
      </View>
    </View>
  );
}

function CountryFunds({ country }: { country: Exclude<FundsCountry, 'CA'> }) {
  const { t } = useI18n();
  const { c } = useTheme();
  const entry = FUNDS[country];
  // One source line per site: two pages on the same host read as a repeat.
  const hosts = new Set<string>();
  const sources = entry.sources
    .filter((url) => {
      const host = new URL(url).host;
      return hosts.has(host) ? false : (hosts.add(host), true);
    })
    .map((url) => <SourceLine key={url} url={url} updated={entry.checked ?? ''} />);
  if (!entry.verified) {
    // A figure we could not read on the official page is not shown: the source is (trust rules).
    return (
      <>
        <Banner text={t('funds.unverified')} />
        {sources}
      </>
    );
  }
  if (entry.kind === 'none') {
    return (
      <>
        <T variant="body">{t(`funds.note.${entry.note}`)}</T>
        {sources}
      </>
    );
  }
  return (
    <>
      <View style={{ borderTopWidth: 1, borderColor: c.fg }}>
        {/* Italy leads with an income test, not money to show: no "minimum to show" over it. */}
        {entry.lines?.[0]?.basis === 'prevYearIncome' ? null : (
          <T variant="row" tone="fgMuted" style={{ paddingTop: space.s3 }}>
            {t('funds.need')}
          </T>
        )}
        {/* The first figure leads; further tiers of the same kind follow as a table under it (Denmark's
            households); a figure of another kind gets its own card (Italy's income vs project money). */}
        {entry.lines?.map((line, i, all) =>
          i > 0 && line.basis === all[0].basis ? <TierRow key={line.key} line={line} /> : <Figure key={line.key} line={line} />,
        )}
      </View>
      <T variant="caption" tone="fgMuted">
        {t('funds.notApproval')}
      </T>
      {entry.show ? <T variant="body">{t(`funds.show.${entry.show}`)}</T> : null}
      {entry.note ? (
        <T variant="caption" tone="fgMuted">
          {t(`funds.note.${entry.note}`)}
        </T>
      ) : null}
      {sources}
    </>
  );
}

/** Country choice: wrapping chips (not a scroller), name always in text, the flag decorative. */
function CountryChips({ value, onChange }: { value: FundsCountry; onChange: (c: FundsCountry) => void }) {
  const { pick } = useI18n();
  const { c } = useTheme();
  return (
    <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 }}>
      {COUNTRY_ORDER.map((k) => {
        const selected = k === value;
        const name = pick(COUNTRY_NAMES[k]);
        return (
          <Pressable
            key={k}
            onPress={() => onChange(k)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: space.s2,
              minHeight: Platform.OS === 'android' ? size.touchMinAndroid : size.touchMin,
              paddingHorizontal: space.s3,
              borderWidth: selected ? 2 : 1,
              borderColor: c.fg,
              backgroundColor: selected ? c.buttonBg : pressed ? c.rowPressed : 'transparent',
            })}
          >
            <Flag country={k} width={20} />
            <T variant="row" weight={selected ? 'bold' : 'medium'} tone={selected ? 'buttonFg' : 'fg'} lang={name.lang}>
              {name.text}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function Funds() {
  const { t, pick } = useI18n();
  const { c } = useTheme();
  const { state, set } = useStore();
  // Opens on a road the user follows, else the pathfinder's road, else Canada.
  const initial: FundsCountry =
    (state.following[0] && ROUTES[state.following[0]].country) || (state.outcome && state.outcome !== 'too-early' ? ROUTES[state.outcome].country : null) || 'CA';
  const [country, setCountry] = useState<FundsCountry>(initial);
  const usdOn = state.fundsUsd && !FX_TOO_OLD;

  useEffect(() => {
    if (!state.fundsUsed) set({ fundsUsed: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (k: FundsCountry) => {
    setCountry(k);
    AccessibilityInfo.announceForAccessibility(pick(COUNTRY_NAMES[k]).text);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Screen edges={[]}>
        <CountryChips value={country} onChange={choose} />
        {/* Rates over 90 days old are not offered at all rather than shown stale. */}
        {FX_TOO_OLD ? null : <UsdSwitch on={usdOn} onChange={(v) => set({ fundsUsd: v })} />}
        <Heading role="display-m">{country === 'CA' ? `${pick(COUNTRY_NAMES.CA).text} · ${t('funds.caRoute')}` : pick(COUNTRY_NAMES[country]).text}</Heading>
        <UsdCtx.Provider value={usdOn}>{country === 'CA' ? <CanadaFunds /> : <CountryFunds country={country} />}</UsdCtx.Provider>
        <Disclaimer onAbout={() => router.navigate('/(tabs)/me/about')} />
      </Screen>
    </View>
  );
}
