// Settlement funds (2.2). The table is IRCC's, read from lib/canada-suv.ts —
// the same module the website prints — never copied into the app.
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform, Pressable, View } from 'react-native';
import { SUV_SETTLEMENT_FUNDS, SUV_SETTLEMENT_FUNDS_EXTRA_PER_PERSON, SUV_SETTLEMENT_FUNDS_UPDATED, SUV_SOURCES, SUV_VERIFIED, settlementFundsFor } from '@shared/canada-suv';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space, size } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Disclaimer, SourceLine, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

const MAX = 12;

export default function Funds() {
  const { t, money, count, date, meta } = useI18n();
  const { c } = useTheme();
  const { state, set } = useStore();
  const [n, setN] = useState(3);
  const amount = settlementFundsFor(n);
  const people = n === 1 ? t('funds.person', { n: count(1) }) : t('funds.people', { n: count(n) });

  useEffect(() => {
    if (!state.fundsUsed) set({ fundsUsed: true });
  }, []);

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
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Screen edges={[]}>
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
        </View>

        <View accessible={false}>
          {Object.entries(SUV_SETTLEMENT_FUNDS).map(([k, v]) => {
            const size_ = Number(k);
            const mine = size_ === n;
            return (
              <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: c.rule }}>
                <T variant="row" weight={mine ? 'bold' : 'regular'} tone={mine ? 'fg' : 'fgMuted'}>
                  {size_ === 1 ? t('funds.person', { n: count(1) }) : t('funds.people', { n: count(size_) })}
                </T>
                <T variant="row" weight={mine ? 'bold' : 'regular'}>
                  {money(v, 'CAD')}
                </T>
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
        <Disclaimer onAbout={() => router.navigate('/(tabs)/me/about')} />
      </Screen>
    </View>
  );
}
