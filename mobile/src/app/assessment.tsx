// The v2 assessment (spec 2026-10-15 §4, auditor review of 15 Oct): an intro
// that names the sensitive questions, then ten screens, one question each
// (some with two short groups). Every group has "Prefer not to say", which
// counts as unscored; "none" is an answer. Answers are saved as you go and
// the flow resumes; Close keeps them. Nothing leaves the phone.
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AccessibilityInfo, BackHandler, Pressable, View, findNodeHandle, type Text as RNText } from 'react-native';
import { fromUsd, type FxCurrency } from '@shared/fx';
import { ROUTES_V2 } from '@shared/routes-v2';
import {
  AGE_BANDS,
  ASSESS_ORDER,
  DEGREES,
  GOALS,
  HOME_CURRENCY,
  LANGUAGE_BANDS,
  MONEY_EDGES,
  RESIDENCES,
  STAGES,
  TALENT_SIGNALS,
  WORK_BANDS,
  type AssessAnswers,
  type MoneyKey,
} from '@/content/assessment';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Button, Label, RadioRow, Ruled, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

const SKIP = 'skip';
type Field = keyof AssessAnswers;

/** Rounds a converted band edge to two significant figures, so bands read as bands. */
const nice = (n: number) => {
  if (n < 10) return Math.round(n);
  const p = 10 ** (Math.floor(Math.log10(n)) - 1);
  return Math.round(n / p) * p;
};

function Group({ title, field, options }: { title?: string; field: Field; options: { id: string; label: string }[] }) {
  const { state, set } = useStore();
  const { t } = useI18n();
  const value = state.assess[field] as string | undefined;
  const choose = (id: string) => set({ assess: { ...state.assess, [field]: id } });
  return (
    <View accessibilityRole="radiogroup">
      {title ? <Label>{title}</Label> : null}
      <Ruled>
        {options.map((o) => (
          <RadioRow key={o.id} label={o.label} selected={value === o.id} onPress={() => choose(o.id)} />
        ))}
        <RadioRow label={t('assess2.skip')} muted selected={value === SKIP} onPress={() => choose(SKIP)} />
      </Ruled>
    </View>
  );
}

function MoneyGroup({ title, field, kind, currency }: { title: string; field: Field; kind: MoneyKey; currency: FxCurrency }) {
  const { t, money } = useI18n();
  const edges = MONEY_EDGES[kind];
  const show = (usd: number) => money(nice(fromUsd(usd, currency)), currency);
  // Each range is isolated (FSI … PDI) so "10,000 – 50,000" never flips in right-to-left text.
  const options = edges.map((lo, i) => {
    const label =
      i === 0 ? t('assess2.under', { amount: `⁨${show(edges[1])}⁩` }) : i === edges.length - 1 ? t('assess2.over', { amount: `⁨${show(lo)}⁩` }) : `⁨${show(lo)} – ${show(edges[i + 1])}⁩`;
    return { id: String(i), label };
  });
  return <Group title={title} field={field} options={options} />;
}

function YesNo({ field, label }: { field: 'admission' | 'jobOffer' | 'endorsement'; label: string }) {
  const { t } = useI18n();
  return <Group title={label} field={field} options={[{ id: 'yes', label: t('assess2.yes') }, { id: 'no', label: t('assess2.no') }]} />;
}

function Question({ index }: { index: number }) {
  const { t } = useI18n();
  const { state, set } = useStore();
  const a = state.assess;
  const currency: FxCurrency = a.residence && a.residence !== SKIP ? HOME_CURRENCY[a.residence] : 'USD';
  const key = ASSESS_ORDER[index];
  switch (key) {
    case 'goal':
      return <Group field="goal" options={GOALS.map((g) => ({ id: g, label: t(`assess2.goals.${g}`) }))} />;
    case 'where':
      return (
        <>
          <Group title={t('assess2.residence')} field="residence" options={RESIDENCES.map((r) => ({ id: r, label: t(`assess2.places.${r}`) }))} />
          <Group title={t('assess2.citizenship')} field="citizenship" options={RESIDENCES.map((r) => ({ id: r, label: t(`assess2.places.${r}`) }))} />
        </>
      );
    case 'age':
      return <Group field="age" options={AGE_BANDS.map((b) => ({ id: b.id, label: t(`assess2.ages.${b.id}`) }))} />;
    case 'degree':
      return <Group field="degree" options={DEGREES.map((d) => ({ id: d, label: t(`assess2.degrees.${d}`) }))} />;
    case 'work':
      return <Group field="work" options={WORK_BANDS.map((b) => ({ id: b.id, label: t(`assess2.works.${b.id}`) }))} />;
    case 'language':
      return (
        <>
          <Group title={t('assess2.english')} field="english" options={LANGUAGE_BANDS.map((b) => ({ id: b.id, label: t(`assess2.levels.${b.id}`) }))} />
          <Group title={t('assess2.french')} field="french" options={LANGUAGE_BANDS.map((b) => ({ id: b.id, label: t(`assess2.levels.${b.id}`) }))} />
        </>
      );
    case 'money':
      return (
        <>
          {currency === 'USD' && a.residence === 'IR' ? (
            <T variant="caption" tone="fgMuted">
              {t('assess2.usdNote')}
            </T>
          ) : null}
          <MoneyGroup title={t('assess2.liquid')} field="liquid" kind="liquid" currency={currency} />
          <MoneyGroup title={t('assess2.netWorth')} field="netWorth" kind="netWorth" currency={currency} />
        </>
      );
    case 'earning':
      return (
        <>
          <MoneyGroup title={t('assess2.income')} field="income" kind="income" currency={currency} />
          <MoneyGroup title={t('assess2.investment')} field="investment" kind="investment" currency={currency} />
        </>
      );
    case 'business':
      return (
        <>
          <Group field="businessStage" options={STAGES.map((s) => ({ id: s, label: t(`assess2.stages.${s}`) }))} />
          {a.businessStage === 'revenue' || a.businessStage === 'established' ? <MoneyGroup title={t('assess2.revenue')} field="revenue" kind="revenue" currency={currency} /> : null}
        </>
      );
    case 'extras': {
      const talent = a.goal === 'talent' || a.goal === 'unsure' || a.goal === SKIP || !a.goal;
      const picked = a.talent ?? [];
      const toggle = (s: string) => set({ assess: { ...a, talent: picked.includes(s) ? picked.filter((x) => x !== s) : [...picked, s] } });
      return (
        <>
          <YesNo field="admission" label={t('assess2.admission')} />
          <YesNo field="jobOffer" label={t('assess2.jobOffer')} />
          <YesNo field="endorsement" label={t('assess2.endorsement')} />
          {talent ? (
            <View>
              <Label>{t('assess2.talent')}</Label>
              <Ruled>
                {TALENT_SIGNALS.map((s) => (
                  <TalentRow key={s} label={t(`assess2.signals.${s}`)} checked={picked.includes(s)} onToggle={() => toggle(s)} />
                ))}
              </Ruled>
            </View>
          ) : null}
        </>
      );
    }
  }
}

function TalentRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: space.s3, minHeight: 56, paddingVertical: space.s2, borderBottomWidth: 1, borderBottomColor: c.rule, backgroundColor: pressed ? c.rowPressed : 'transparent' })}
    >
      <View style={{ width: 22, height: 22, borderWidth: 1.5, borderColor: c.fg, backgroundColor: checked ? c.fg : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
        {checked ? <Icon name="check" size={16} tone="buttonFg" /> : null}
      </View>
      <T variant="row" style={{ flex: 1 }}>
        {label}
      </T>
    </Pressable>
  );
}

/** Every group on the screen has an answer (or "prefer not to say"). Talent signals are optional. */
function answered(index: number, a: AssessAnswers): boolean {
  const has = (f: Field) => a[f] !== undefined;
  switch (ASSESS_ORDER[index]) {
    case 'goal':
      return has('goal');
    case 'where':
      return has('residence') && has('citizenship');
    case 'age':
      return has('age');
    case 'degree':
      return has('degree');
    case 'work':
      return has('work');
    case 'language':
      return has('english') && has('french');
    case 'money':
      return has('liquid') && has('netWorth');
    case 'earning':
      return has('income') && has('investment');
    case 'business':
      return has('businessStage') && (!(a.businessStage === 'revenue' || a.businessStage === 'established') || has('revenue'));
    case 'extras':
      return has('admission') && has('jobOffer') && has('endorsement');
  }
}

export default function Assessment() {
  const { state, set } = useStore();
  const { t, count } = useI18n();
  const { c } = useTheme();
  const step = Math.max(-1, Math.min(state.assessStep, ASSESS_ORDER.length - 1));
  const headingRef = useRef<RNText>(null);
  const total = ASSESS_ORDER.length;

  useEffect(() => {
    const node = headingRef.current ? findNodeHandle(headingRef.current) : null;
    if (node) AccessibilityInfo.setAccessibilityFocus(node);
  }, [step]);

  // Close keeps the answers; the flow resumes where it stopped.
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)/home'));
  const back = () => (step === -1 ? close() : set({ assessStep: step - 1 }));
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      back();
      return true;
    });
    return () => sub.remove();
  });

  const next = () => {
    if (step < total - 1) return set({ assessStep: step + 1 });
    set({ assessAt: new Date().toISOString(), assessStep: -1 });
    router.replace('/(tabs)/assess/results');
  };

  const intro = step === -1;
  const ok = intro || answered(step, state.assess);

  return (
    <Screen
      footer={<Button label={intro ? t('assess2.begin') : step === total - 1 ? t('assess2.finish') : t('assess2.next')} onPress={next} disabled={!ok} />}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button kind="link" icon={null} label={intro ? t('assess2.close') : t('assess2.back')} onPress={back} />
        {intro ? null : <Button kind="link" icon={null} label={t('assess2.close')} onPress={close} />}
      </View>
      {intro ? null : (
        <View style={{ gap: space.s2 }}>
          <T variant="caption" tone="fgMuted">
            {t('assess2.progress', { n: count(step + 1), total: count(total) })}
          </T>
          {/* Fills from the start edge, in both directions. */}
          <View accessible={false} style={{ height: 4, backgroundColor: c.progressTrack, flexDirection: 'row' }}>
            <View style={{ flex: step + 1, backgroundColor: c.progressFill }} />
            <View style={{ flex: total - step - 1 }} />
          </View>
        </View>
      )}
      <T ref={headingRef} variant="display-m" accessibilityRole="header">
        {intro ? t('assess2.introTitle') : t(`assess2.q.${ASSESS_ORDER[step]}`)}
      </T>
      {intro ? (
        <View style={{ gap: space.s3 }}>
          <T variant="body">{t('assess2.introBody', { routes: count(ROUTES_V2.length), countries: count(new Set(ROUTES_V2.map((r) => r.country)).size) })}</T>
          <T variant="body">{t('assess2.introPrivate')}</T>
          <T variant="caption" tone="fgMuted">
            {t('assess2.introNotApproval')}
          </T>
        </View>
      ) : (
        <Question index={step} />
      )}
    </Screen>
  );
}
