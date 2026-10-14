// Route check (2.3): exact numbers against every road's published rules.
// Uses the website's own `assess` thresholds via RULES; nothing leaves the phone.
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';
import { RATES_TO_CAD, RULES, type Rule } from '@shared/fa/programmes';
import { ROUTES, type RouteKey } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { space, size } from '@/theme/tokens';
import { Chip, Disclaimer, Label, LinkRow, Ruled, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

type Venture = 'idea' | 'mvp' | 'revenue';
type Inputs = { netWorth: string; investable: string; founders: string; age: string; clb: string };
const RANK = { idea: 0, mvp: 1, revenue: 2 } as const;

function verdictFor(rule: Rule, v: { netWorth: number; investable: number; founders: number; age: number; clb: number; venture: Venture }) {
  const cad = (a: { amount: number; currency: keyof typeof RATES_TO_CAD }) => Math.round(a.amount * RATES_TO_CAD[a.currency]);
  const fails: boolean[] = [];
  if (rule.founders?.min !== undefined) fails.push(v.founders < rule.founders.min);
  if (rule.founders?.max !== undefined) fails.push(v.founders > rule.founders.max);
  if (rule.netWorth) fails.push(v.netWorth < cad(rule.netWorth));
  if (rule.investment) fails.push(v.investable < cad(rule.investment));
  if (rule.yearlyFunds) fails.push(v.investable < cad(rule.yearlyFunds) * (rule.yearlyFunds.perFounder ? Math.max(1, v.founders) : 1));
  if (rule.age) fails.push(v.age < rule.age.min || v.age > rule.age.max);
  if (rule.clb !== undefined) fails.push(v.clb < rule.clb);
  if (rule.venture) fails.push(RANK[v.venture] < RANK[rule.venture]);
  const failed = fails.filter(Boolean).length;
  return { verdict: failed === 0 ? 'clears' : failed === 1 ? 'close' : 'not-yet', failed, scored: fails.length } as const;
}

function Field({ label, value, onChange, error }: { label: string; value: string; onChange: (s: string) => void; error?: string }) {
  const { c } = useTheme();
  const { meta } = useI18n();
  return (
    <View style={{ gap: space.s1 }}>
      <T variant="row" tone="fgMuted">
        {label}
      </T>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="number-pad"
        inputMode="numeric"
        accessibilityLabel={label}
        accessibilityHint={error}
        allowFontScaling
        maxFontSizeMultiplier={2}
        style={{
          minHeight: size.row,
          borderWidth: 1,
          borderColor: error ? c.error : c.fg,
          paddingHorizontal: space.s3,
          color: c.fg,
          fontSize: 17,
          textAlign: meta.rtl ? 'right' : 'left',
          writingDirection: 'ltr',
        }}
        placeholderTextColor={c.fgMuted}
      />
      {error ? (
        <T variant="caption" tone="error" accessibilityLiveRegion="polite">
          {error}
        </T>
      ) : null}
    </View>
  );
}

export default function RouteCheck() {
  const { t, pick } = useI18n();
  const [inp, setInp] = useState<Inputs>({ netWorth: '', investable: '', founders: '1', age: '', clb: '' });
  const [venture, setVenture] = useState<Venture>('mvp');
  const num = (s: string) => (/^\d+$/.test(s.replace(/[,\s]/g, '')) ? Number(s.replace(/[,\s]/g, '')) : NaN);
  const errors = Object.fromEntries(Object.entries(inp).map(([k, v]) => [k, v !== '' && Number.isNaN(num(v)) ? t('check.invalid') : undefined])) as Record<keyof Inputs, string | undefined>;
  const complete = Object.values(inp).every((v) => v !== '' && !Number.isNaN(num(v)));

  const results = useMemo(() => {
    if (!complete) return [];
    const v = { netWorth: num(inp.netWorth), investable: num(inp.investable), founders: num(inp.founders), age: num(inp.age), clb: num(inp.clb), venture };
    const rank = { clears: 0, close: 1, 'not-yet': 2 } as const;
    return RULES.filter((r) => r.key in ROUTES)
      .map((r) => ({ key: r.key as RouteKey, ...verdictFor(r, v) }))
      .sort((a, b) => rank[a.verdict] - rank[b.verdict]);
  }, [inp, venture, complete]);

  const set = (k: keyof Inputs) => (s: string) => setInp((p) => ({ ...p, [k]: s }));

  return (
    <Screen edges={[]}>
      <T variant="body" tone="fgMuted">
        {t('check.lead')}
      </T>
      <Field label={t('check.netWorth')} value={inp.netWorth} onChange={set('netWorth')} error={errors.netWorth} />
      <Field label={t('check.investable')} value={inp.investable} onChange={set('investable')} error={errors.investable} />
      <View style={{ flexDirection: 'row', gap: space.s3 }}>
        <View style={{ flex: 1 }}>
          <Field label={t('check.founders')} value={inp.founders} onChange={set('founders')} error={errors.founders} />
        </View>
        <View style={{ flex: 1 }}>
          <Field label={t('check.age')} value={inp.age} onChange={set('age')} error={errors.age} />
        </View>
        <View style={{ flex: 1 }}>
          <Field label={t('check.clb')} value={inp.clb} onChange={set('clb')} error={errors.clb} />
        </View>
      </View>
      <View style={{ gap: space.s2 }}>
        <T variant="row" tone="fgMuted">
          {t('check.venture')}
        </T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 }} accessibilityRole="radiogroup">
          {(['idea', 'mvp', 'revenue'] as Venture[]).map((v) => (
            <Chip key={v} label={t(`check.ventures.${v}`)} selected={venture === v} onPress={() => setVenture(v)} />
          ))}
        </View>
      </View>
      {results.length ? (
        <View>
          <Label>{t('check.results')}</Label>
          <Ruled>
            {results.map((r) => (
              <LinkRow key={r.key} label={pick(ROUTES[r.key].name).text} sub={t(`check.verdict.${r.verdict}`)} onPress={() => router.push(`/(tabs)/roads/${r.key}`)} />
            ))}
          </Ruled>
          <T variant="caption" tone="fgMuted" style={{ marginTop: space.s2 }}>
            {t('result.noApproval')}
          </T>
        </View>
      ) : null}
      <Disclaimer onAbout={() => router.navigate('/(tabs)/me/about')} />
    </Screen>
  );
}
