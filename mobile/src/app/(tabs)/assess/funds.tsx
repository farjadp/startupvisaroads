// Funds to show, by country (2.2; per-country since 15 Oct 2026). Every
// figure is read from lib/funds.ts and lib/canada-suv.ts, the modules the
// website prints, never copied into the app. Each country says how its figure
// is counted (per month, per year, one-off), what the money must show, and
// where the figure comes from; showing it never means approval (trust rules).
// Family size is a row of figures to tap; other currencies are pills (Farjad,
// 15 Oct 2026: "make it pleasing"). Both choices are remembered on the phone.
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, PixelRatio, Platform, Pressable, Share, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { SUV_SETTLEMENT_FUNDS, SUV_SETTLEMENT_FUNDS_EXTRA_PER_PERSON, SUV_SETTLEMENT_FUNDS_UPDATED, SUV_SOURCES, SUV_STATE, SUV_VERIFIED, settlementFundsFor } from '@shared/canada-suv';
import { FUNDS, type FundsCountry, type FundsLine } from '@shared/funds';
import { FX, convert, type FxCurrency } from '@shared/fx';
import { HOME_CURRENCY } from '@/content/assessment';
import { parseIsoDate } from '@/i18n/format';
import { COUNTRY_NAMES, COUNTRY_ORDER, ROUTES } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import type { Locale } from '@/i18n/locales';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { motion, space, size } from '@/theme/tokens';
import { Flag } from '@/ui/Flag';
import { Banner, Button, Chip, Disclaimer, Heading, Label, SourceLine, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

/** Countries with a funds entry, in the app's country order. */
const FUNDS_ORDER = COUNTRY_ORDER.filter((k): k is FundsCountry => k in FUNDS);

const MAX = 12;
/** Figures drawn in the family row: IRCC's table lists 1–7; "8+" hands over to the stepper. */
const GLYPHS = 7;

const SYMBOL: Record<FxCurrency, string> = { EUR: '€', USD: '$', CAD: 'C$', DKK: 'kr', TRY: '₺', ILS: '₪', AED: 'د.إ', GBP: '£', CNY: '¥', INR: '₹' };
/** The official currency of each country's figure (the one never offered as an extra). */
const OFFICIAL: Record<FundsCountry, FxCurrency> = { CA: 'CAD', DK: 'DKK', FI: 'EUR', EE: 'EUR', NL: 'EUR', IT: 'EUR', TR: 'TRY', US: 'USD' } as Record<FundsCountry, FxCurrency>;
/** Home currency when the assessment has not said where the user lives. */
const BY_LOCALE: Record<Locale, FxCurrency> = { en: 'USD', fa: 'USD', fr: 'EUR', zh: 'CNY', ar: 'AED' };

// The official figure stays first and unchanged; converted lines are small, muted, rounded,
// say "about" and name the ECB rate date. Rates over 90 days old are not offered at all.
const FX_AGE_DAYS = Math.floor((Date.now() - parseIsoDate(FX.date).getTime()) / 86_400_000);
const FX_OLD = FX_AGE_DAYS > 30;
const FX_TOO_OLD = FX_AGE_DAYS > 90;
const AltCtx = createContext<FxCurrency | null>(null);

// One tick per real change; Android goes through the system setting for touch feedback.
const tick = () => {
  (Platform.OS === 'android' ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Segment_Tick) : Haptics.selectionAsync()).catch(() => {});
};

/** True when the person asked the system for less motion: figures then swap instead of rising. */
function useReduceMotion() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setOn).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setOn);
    return () => sub.remove();
  }, []);
  return on;
}

/** The "about USD …" line for an amount, or null when no extra currency is on. */
function useAltLine(): (amount: number, currency: FxCurrency) => string | null {
  const chosen = useContext(AltCtx);
  const { t, money } = useI18n();
  return (amount, currency) => (chosen && chosen !== currency ? t('funds.about', { amount: `⁨${money(convert(amount, currency, chosen), chosen)}⁩` }) : null);
}

/** Pills for one currency to show besides the official one, or none. */
function CurrencyChips({ official, value, onChange }: { official: FxCurrency; value: FxCurrency | null; onChange: (v: FxCurrency | 'none') => void }) {
  const { t, date, locale } = useI18n();
  const { state } = useStore();
  const residence = state.assess.residence;
  const home: FxCurrency = residence && residence !== 'skip' ? HOME_CURRENCY[residence] : BY_LOCALE[locale];
  const options = [...new Set<FxCurrency>([home, 'USD', 'EUR', 'GBP'])].filter((c) => c !== official).slice(0, 4);
  const choose = (c: FxCurrency | 'none') => {
    if ((c === 'none' ? null : c) === value) return;
    tick();
    onChange(c);
  };
  return (
    <View style={{ gap: space.s2 }}>
      <Label>{t('funds.alsoIn')}</Label>
      <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 }}>
        <Chip label={t('funds.none')} selected={value === null} onPress={() => choose('none')} />
        {options.map((c) => (
          <Chip key={c} label={`${SYMBOL[c]} ${c}`} selected={value === c} onPress={() => choose(c)} />
        ))}
      </View>
      {value ? (
        <T variant="caption" tone="fgMuted">
          {`${t('funds.rates', { date: date(FX.date) })}${value === 'AED' ? `; ${t('funds.aedPeg')}` : ''} · ${t('funds.currencyHint')}${FX_OLD ? ` ${t('funds.usdOld')}` : ''}`}
        </T>
      ) : null}
    </View>
  );
}

/** One figure of the family row: filled for a counted person, outlined otherwise. */
function PersonGlyph({ filled, size: s }: { filled: boolean; size: number }) {
  const { c } = useTheme();
  const p = { stroke: c.fg, strokeWidth: 1.8, strokeLinecap: 'square' as const, strokeLinejoin: 'miter' as const, fill: filled ? c.fg : 'none' };
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24" accessible={false} importantForAccessibility="no-hide-descendants">
      <Circle cx="12" cy="7" r="3.5" {...p} />
      <Path d="M5 21c1-5 13-5 14 0z" {...p} />
    </Svg>
  );
}

/** A figure that fades and rises in each time its text changes (no count-up: the number is the number). */
function Rising({ children, dep }: { children: React.ReactNode; dep: unknown }) {
  const [v] = useState(() => new Animated.Value(1));
  const first = useRef(true);
  const still = useReduceMotion();
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (still) return;
    v.setValue(0);
    Animated.timing(v, { toValue: 1, duration: motion.state, easing: Easing.bezier(...motion.ease), useNativeDriver: true }).start();
  }, [dep, v, still]);
  return <Animated.View style={{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) }] }}>{children}</Animated.View>;
}

function ShareButton({ text }: { text: string }) {
  const { t } = useI18n();
  return <Button kind="secondary" icon={null} label={t('funds.share')} onPress={() => Share.share({ message: text }).catch(() => {})} />;
}

function CanadaFunds() {
  const { t, money, count, date, pick, meta } = useI18n();
  const alt = useAltLine();
  const { c } = useTheme();
  const { state, set } = useStore();
  const n = Math.max(1, Math.min(MAX, state.fundsPeople));
  const amount = settlementFundsFor(n);
  const people = (k: number) => (k === 1 ? t('funds.person', { n: count(1) }) : t('funds.people', { n: count(k) }));
  const oneMore = settlementFundsFor(n + 1) - amount;
  const paused = t('funds.caPaused', { date: date(SUV_STATE.pausedOn) });

  const setN = (next: number, quiet = false) => {
    const clamped = Math.max(1, Math.min(MAX, next));
    if (clamped === n) return;
    if (!quiet) tick();
    set({ fundsPeople: clamped });
    // Announce the new amount (spec 8) for taps; an adjustable swipe already reads the new value. Android reads the live region below.
    if (Platform.OS === 'ios' && !quiet) AccessibilityInfo.announceForAccessibility(t('funds.announce', { people: people(clamped), amount: money(settlementFundsFor(clamped), 'CAD') }));
  };

  // Figures grow with the text size (capped), and the row wraps rather than shrinks.
  const glyph = Math.round(size.icon * 1.4 * Math.min(PixelRatio.getFontScale(), 1.5));
  const cell = Platform.OS === 'android' ? size.touchMinAndroid : size.touchMin;
  const shareText = t('funds.shareCa', {
    title: `${pick(COUNTRY_NAMES.CA).text} · ${t('funds.caRoute')}`,
    people: people(n),
    amount: money(amount, 'CAD'),
    basis: t('funds.source', { date: date(SUV_SETTLEMENT_FUNDS_UPDATED) }),
    paused,
    notApproval: t('funds.notApproval'),
    url: SUV_SOURCES.eligibility,
    from: t('funds.shareFrom'),
  });

  return (
    <>
      <Banner text={paused} />
      <T variant="row" tone="fgMuted" accessibilityElementsHidden importantForAccessibility="no">
        {t('funds.family')}
      </T>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={t('funds.family')}
        accessibilityValue={{ text: `${people(n)}, ${money(amount, 'CAD')}` }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => setN(n + (e.nativeEvent.actionName === 'increment' ? 1 : -1), true)}
        style={{ borderWidth: 1, borderColor: c.fg }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            onPress={() => setN(n - 1)}
            disabled={n <= 1}
            accessibilityLabel={t('funds.fewer')}
            importantForAccessibility="no"
            style={({ pressed }) => ({ width: size.button, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', borderEndWidth: 1, borderColor: c.fg, backgroundColor: pressed ? c.rowPressed : 'transparent' })}
          >
            <T variant="headline" tone={n <= 1 ? 'disabledFg' : 'fg'}>
              −
            </T>
          </Pressable>
          {/* Fills from the start edge: the first figure is you. Each tap sets the size directly; "8+" hands over to the stepper. */}
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', paddingVertical: space.s2, gap: space.s1 }}>
            {Array.from({ length: GLYPHS }, (_, i) => i + 1).map((k) => (
              <Pressable key={k} onPress={() => setN(k)} importantForAccessibility="no" style={({ pressed }) => ({ minWidth: cell, minHeight: cell, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}>
                <PersonGlyph filled={k <= n} size={glyph} />
              </Pressable>
            ))}
            <Pressable onPress={() => setN(Math.max(n, GLYPHS + 1))} importantForAccessibility="no" style={({ pressed }) => ({ minWidth: cell, minHeight: cell, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}>
              <T variant="row" weight={n > GLYPHS ? 'bold' : 'regular'} tone={n > GLYPHS ? 'fg' : 'fgMuted'}>
                {`${count(GLYPHS + 1)}+`}
              </T>
            </Pressable>
          </View>
          <Pressable
            onPress={() => setN(n + 1)}
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
        <View style={{ borderTopWidth: 1, borderColor: c.fg, paddingVertical: space.s2, alignItems: 'center' }}>
          <T variant="headline">{people(n)}</T>
        </View>
      </View>

      <View accessibilityLiveRegion="polite" accessible style={{ gap: space.s2, paddingVertical: space.s5, borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.fg }}>
        <T variant="row" tone="fgMuted">
          {t('funds.need')}
        </T>
        <Rising dep={n}>
          <View style={{ alignSelf: 'flex-start', backgroundColor: c.accent, paddingHorizontal: space.s2, paddingTop: space.s2 }}>
            {/* Estedad's wide digits wrap the amount in fa/ar; shrink to fit there. Latin keeps its natural size (fitting clips DM Serif tops on iOS). */}
            <T variant="figure" tone="onAccent" {...(meta.script === 'arabic' ? { numberOfLines: 1, adjustsFontSizeToFit: true, minimumFontScale: 0.6 } : null)}>
              {money(amount, 'CAD')}
            </T>
          </View>
        </Rising>
        <T variant="caption" tone="fgMuted">
          {t('funds.unit')}
        </T>
        {alt(amount, 'CAD') ? (
          <T variant="caption" tone="fgMuted">
            {alt(amount, 'CAD')}
          </T>
        ) : null}
        {n < MAX ? (
          <T variant="caption" tone="fgMuted">
            {t('funds.oneMore', { total: `⁨${money(amount + oneMore, 'CAD').replace(' ', '\u00a0')}⁩`, delta: `⁨${money(oneMore, 'CAD').replace(' ', '\u00a0')}⁩` })}
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
            <Pressable
              key={k}
              onPress={() => setN(size_)}
              accessible
              accessibilityRole="button"
              accessibilityState={{ selected: mine }}
              accessibilityLabel={[`${people(size_)}: ${money(v, 'CAD')}`, alt(v, 'CAD')].filter(Boolean).join(', ')}
              style={({ pressed }) => ({ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: space.s3, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: c.rule, backgroundColor: pressed ? c.rowPressed : 'transparent' })}
            >
              <T variant="row" weight={mine ? 'bold' : 'regular'} tone={mine ? 'fg' : 'fgMuted'}>
                {people(size_)}
              </T>
              <View style={{ alignItems: 'flex-end', marginStart: 'auto' }}>
                <T variant="row" weight={mine ? 'bold' : 'regular'}>
                  {money(v, 'CAD')}
                </T>
                {alt(v, 'CAD') ? (
                  <T variant="caption" tone="fgMuted">
                    {alt(v, 'CAD')}
                  </T>
                ) : null}
              </View>
            </Pressable>
          );
        })}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: space.s3, paddingVertical: 6 }}>
          <T variant="row" tone="fgMuted">
            {`${t('funds.extra')} (${count(GLYPHS + 1)}+)`}
          </T>
          <T variant="row" style={{ marginStart: 'auto' }}>+ {money(SUV_SETTLEMENT_FUNDS_EXTRA_PER_PERSON, 'CAD')}</T>
        </View>
      </View>

      <T variant="caption" tone="fgMuted">
        {t('funds.source', { date: date(SUV_SETTLEMENT_FUNDS_UPDATED) })}
      </T>
      <SourceLine url={SUV_SOURCES.eligibility} updated={SUV_VERIFIED} />
      <ShareButton text={shareText} />
    </>
  );
}

function Figure({ line }: { line: FundsLine }) {
  const { t, money, meta } = useI18n();
  const { c } = useTheme();
  const alt = useAltLine()(line.amount, line.currency);
  const amount = money(line.amount, line.currency);
  const shown = line.approx ? t('funds.about', { amount }) : amount;
  // Label, figure, unit and the converted guide in one element, read in that order.
  return (
    <View accessible accessibilityLabel={[`${t(`funds.lines.${line.key}`)}: ${shown}`, t(`funds.basis.${line.basis}`), alt].filter(Boolean).join(', ')} style={{ gap: space.s2, paddingVertical: space.s4, borderBottomWidth: 1, borderColor: c.fg }}>
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
      {alt ? (
        <T variant="caption" tone="fgMuted">
          {alt}
        </T>
      ) : null}
    </View>
  );
}

function TierRow({ line }: { line: FundsLine }) {
  const { t, money } = useI18n();
  const { c } = useTheme();
  const alt = useAltLine()(line.amount, line.currency);
  const amount = money(line.amount, line.currency);
  return (
    <View
      accessible
      accessibilityLabel={[`${t(`funds.lines.${line.key}`)}: ${line.approx ? t('funds.about', { amount }) : amount}`, t(`funds.basis.${line.basis}`), alt].filter(Boolean).join(', ')}
      style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.s3, paddingVertical: space.s3, borderBottomWidth: 1, borderBottomColor: c.rule }}
    >
      <T variant="row" tone="fgMuted" style={{ flexShrink: 1 }}>
        {t(`funds.lines.${line.key}`)}
      </T>
      <View style={{ alignItems: 'flex-end' }}>
        <T variant="row" weight="bold">
          {line.approx ? t('funds.about', { amount }) : amount}
        </T>
        {alt ? (
          <T variant="caption" tone="fgMuted">
            {alt}
          </T>
        ) : null}
      </View>
    </View>
  );
}

function CountryFunds({ country }: { country: Exclude<FundsCountry, 'CA'> }) {
  const { t, money, pick } = useI18n();
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
  const shareText = t('funds.shareCountry', {
    title: pick(COUNTRY_NAMES[country]).text,
    lines: (entry.lines ?? []).map((l) => `${t(`funds.lines.${l.key}`)}: ${l.approx ? t('funds.about', { amount: money(l.amount, l.currency) }) : money(l.amount, l.currency)} (${t(`funds.basis.${l.basis}`)})`).join('\n'),
    notApproval: t('funds.notApproval'),
    url: entry.sources[0],
    from: t('funds.shareFrom'),
  });
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
      <ShareButton text={shareText} />
    </>
  );
}

/** Country choice: wrapping chips (not a scroller), name always in text, the flag decorative. */
function CountryChips({ value, onChange }: { value: FundsCountry; onChange: (c: FundsCountry) => void }) {
  const { pick } = useI18n();
  const { c } = useTheme();
  return (
    <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 }}>
      {FUNDS_ORDER.map((k) => {
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
  // A country page links here with ?country=; otherwise a road the user follows, the pathfinder's, or Canada.
  const { country: asked } = useLocalSearchParams<{ country?: string }>();
  const preferred = asked || (state.following[0] && ROUTES[state.following[0]].country) || (state.outcome && state.outcome !== 'too-early' ? ROUTES[state.outcome].country : null);
  const initial: FundsCountry = preferred && preferred in FUNDS ? (preferred as FundsCountry) : 'CA';
  const [country, setCountry] = useState<FundsCountry>(initial);
  const official = OFFICIAL[country] ?? 'USD';
  // The v1 dollar switch carries over once; after that the pills are the choice.
  const stored = state.fundsCurrency ?? (state.fundsUsd ? 'USD' : 'none');
  const chosen: FxCurrency | null = FX_TOO_OLD || stored === 'none' || stored === official ? null : stored;

  useEffect(() => {
    if (!state.fundsUsed) set({ fundsUsed: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (k: FundsCountry) => {
    if (k === country) return;
    tick();
    setCountry(k);
    AccessibilityInfo.announceForAccessibility(pick(COUNTRY_NAMES[k]).text);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Screen edges={[]}>
        <CountryChips value={country} onChange={choose} />
        <Heading role="display-m">{country === 'CA' ? `${pick(COUNTRY_NAMES.CA).text} · ${t('funds.caRoute')}` : pick(COUNTRY_NAMES[country]).text}</Heading>
        {/* Rates over 90 days old are not offered at all rather than shown stale. */}
        {FX_TOO_OLD ? null : <CurrencyChips official={official} value={chosen} onChange={(v) => set({ fundsCurrency: v })} />}
        <AltCtx.Provider value={chosen}>{country === 'CA' ? <CanadaFunds /> : <CountryFunds country={country} />}</AltCtx.Provider>
        <Disclaimer onAbout={() => router.navigate('/(tabs)/me/about')} />
      </Screen>
    </View>
  );
}
