// The v2 assessment (spec 2026-10-15 §4; v4 journey 2026-11-09 §2): an intro
// that names the sensitive questions, then two screens of picker rows ("You",
// "Money and plan") instead of ten screens of radios. Every sheet has "Prefer
// not to say", which counts as unscored; "none" is an answer. After a choice
// the sheet closes and, with no screen reader and no Reduce Motion, the next
// empty row's sheet opens once the first has fully gone (never on a timer,
// never past the last row). Answers are saved as you go and the flow resumes;
// Close keeps them. Nothing leaves the phone.
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, BackHandler, View, findNodeHandle, type ScrollView, type Text as RNText } from 'react-native';
import { fromUsd, type FxCurrency } from '@shared/fx';
import { ROUTES_V2 } from '@shared/routes-v2';
import {
  AGE_BANDS,
  ASSESS_SCREENS,
  DEGREES,
  GOALS,
  HOME_CURRENCY,
  LANGUAGE_BANDS,
  MONEY_EDGES,
  RESIDENCES,
  STAGES,
  TALENT_SIGNALS,
  WORK_BANDS,
  answeredCount,
  fieldsOf,
  missingFields,
  nextEmptyField,
  type AssessAnswers,
  type AssessField,
  type MoneyKey,
} from '@/content/assessment';
import { useI18n } from '@/i18n/I18nProvider';
import { normaliseAssessStep } from '@/state/migrate';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { Button, Ruled, Screen, useReduceMotion, useScreenReader } from '@/ui/kit';
import { PickerRow, type PickerOption } from '@/ui/PickerRow';
import { T } from '@/ui/T';

const SKIP = 'skip';

/** Rounds a converted band edge to two significant figures, so bands read as bands. */
const nice = (n: number) => {
  if (n < 10) return Math.round(n);
  const p = 10 ** (Math.floor(Math.log10(n)) - 1);
  return Math.round(n / p) * p;
};

type RowSpec = { field: AssessField; label: string; sheetTitle?: string; sub?: string; options: PickerOption[] };

/** The row for each field: label, sheet title (the full question where it reads better) and options, "Prefer not to say" last. */
function useRows(a: AssessAnswers) {
  const { t, money } = useI18n();
  const currency: FxCurrency = a.residence && a.residence !== SKIP ? HOME_CURRENCY[a.residence] : 'USD';
  const skip: PickerOption = { id: SKIP, label: t('assess2.skip'), muted: true };
  const list = (ids: readonly string[], path: string): PickerOption[] => [...ids.map((id) => ({ id, label: t(`${path}.${id}`) })), skip];
  const moneyOptions = (kind: MoneyKey): PickerOption[] => {
    const edges = MONEY_EDGES[kind];
    const show = (usd: number) => money(nice(fromUsd(usd, currency)), currency);
    // Each range is isolated (FSI … PDI) so "10,000 – 50,000" never flips in right-to-left text.
    return [
      ...edges.map((lo, i) => ({
        id: String(i),
        label: i === 0 ? t('assess2.under', { amount: `⁨${show(edges[1])}⁩` }) : i === edges.length - 1 ? t('assess2.over', { amount: `⁨${show(lo)}⁩` }) : `⁨${show(lo)} – ${show(edges[i + 1])}⁩`,
      })),
      skip,
    ];
  };
  const usdNote = currency === 'USD' && a.residence === 'IR' ? t('assess2.usdNote') : undefined;
  const yesNo: PickerOption[] = [{ id: 'yes', label: t('assess2.yes') }, { id: 'no', label: t('assess2.no') }, skip];
  const places = RESIDENCES.map((r) => ({ id: r, label: t(`assess2.places.${r}`) }));
  const rows: Record<Exclude<AssessField, 'talent'>, RowSpec> = {
    goal: { field: 'goal', label: t('assess2.rows.goal'), sheetTitle: t('assess2.q.goal'), options: list(GOALS, 'assess2.goals') },
    residence: { field: 'residence', label: t('assess2.residence'), options: [...places, skip] },
    citizenship: { field: 'citizenship', label: t('assess2.citizenship'), options: [...places, skip] },
    age: { field: 'age', label: t('assess2.rows.age'), sheetTitle: t('assess2.q.age'), options: list(AGE_BANDS.map((b) => b.id), 'assess2.ages') },
    degree: { field: 'degree', label: t('assess2.rows.degree'), sheetTitle: t('assess2.q.degree'), options: list(DEGREES, 'assess2.degrees') },
    work: { field: 'work', label: t('assess2.rows.work'), sheetTitle: t('assess2.q.work'), options: list(WORK_BANDS.map((b) => b.id), 'assess2.works') },
    english: { field: 'english', label: t('assess2.english'), options: list(LANGUAGE_BANDS.map((b) => b.id), 'assess2.levels') },
    french: { field: 'french', label: t('assess2.french'), options: list(LANGUAGE_BANDS.map((b) => b.id), 'assess2.levels') },
    liquid: { field: 'liquid', label: t('assess2.liquid'), sub: usdNote, options: moneyOptions('liquid') },
    netWorth: { field: 'netWorth', label: t('assess2.netWorth'), sub: usdNote, options: moneyOptions('netWorth') },
    income: { field: 'income', label: t('assess2.income'), sub: usdNote, options: moneyOptions('income') },
    investment: { field: 'investment', label: t('assess2.investment'), sub: usdNote, options: moneyOptions('investment') },
    businessStage: { field: 'businessStage', label: t('assess2.rows.businessStage'), sheetTitle: t('assess2.q.business'), options: list(STAGES, 'assess2.stages') },
    revenue: { field: 'revenue', label: t('assess2.revenue'), sub: usdNote, options: moneyOptions('revenue') },
    admission: { field: 'admission', label: t('assess2.admission'), options: yesNo },
    jobOffer: { field: 'jobOffer', label: t('assess2.jobOffer'), options: yesNo },
    endorsement: { field: 'endorsement', label: t('assess2.endorsement'), options: yesNo },
  };
  return rows;
}

export default function Assessment() {
  const { state, set } = useStore();
  const { t, count } = useI18n();
  const { c } = useTheme();
  const reduce = useReduceMotion();
  const reader = useScreenReader();
  // Stored steps from the ten-screen flow fold onto the two screens (migrate.ts).
  const step = normaliseAssessStep(state.assessStep);
  const a = state.assess;
  const rows = useRows(a);
  const headingRef = useRef<RNText>(null);
  const scrollRef = useRef<ScrollView>(null);
  const rowRefs = useRef<Partial<Record<AssessField, View | null>>>({});
  const listRef = useRef<View>(null);
  const listY = useRef(0);
  const [openField, setOpenField] = useState<AssessField | null>(null);
  // The row to open once the current sheet has fully gone (Modal onDismiss), or null.
  const pending = useRef<AssessField | null>(null);

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

  const intro = step === -1;
  const missing = intro ? [] : missingFields(step, a);
  const ok = missing.length === 0;
  const progress = answeredCount(a);

  const next = () => {
    if (step < 1) return set({ assessStep: step + 1 });
    set({ assessAt: new Date().toISOString(), assessStep: -1 });
    router.replace('/(tabs)/assess/results');
  };

  const bringIntoView = (field: AssessField) => {
    const row = rowRefs.current[field];
    const scroll = scrollRef.current;
    if (!row || !scroll) return;
    const list = listRef.current;
    if (!list) return;
    try {
      // The row's offset inside the list, plus the list's offset in the scroll content.
      row.measureLayout(
        list,
        (_x, y) => scroll.scrollTo({ y: Math.max(0, listY.current + y - space.s6), animated: !reduce }),
        () => {},
      );
    } catch {
      // Measuring can fail while the sheet is still mounted; the row is then simply not scrolled to.
    }
    if (reader) {
      const node = findNodeHandle(row);
      if (node) AccessibilityInfo.setAccessibilityFocus(node);
    }
  };

  const choose = (field: AssessField, id: string) => {
    const updated: AssessAnswers = { ...a, [field]: id };
    set({ assess: updated });
    setOpenField(null);
    pending.current = step >= 0 ? nextEmptyField(step, updated, field) : null;
  };

  // Runs when the closed sheet has fully left the screen: the next empty row comes into view and,
  // without a screen reader or Reduce Motion, its sheet opens. Never a setTimeout.
  const dismissed = useCallback(() => {
    const field = pending.current;
    pending.current = null;
    if (!field) return;
    bringIntoView(field);
    if (!reader && !reduce) setOpenField(field);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reader, reduce]);

  const toggleTalent = (s: string) => {
    const picked = a.talent ?? [];
    set({ assess: { ...a, talent: picked.includes(s) ? picked.filter((x) => x !== s) : [...picked, s] } });
  };
  const askTalent = a.goal === 'talent' || a.goal === 'unsure' || a.goal === SKIP || !a.goal;

  const helper = ok ? undefined : missing.length === 1 ? t('assess2.leftOne') : t('assess2.left', { n: count(missing.length) });

  return (
    <Screen
      scrollRef={scrollRef}
      footer={
        <>
          {/* A disabled button says why (tokens: disabled state); screen readers hear it once, as the hint. */}
          {helper ? (
            <T variant="caption" tone="fgMuted" accessibilityElementsHidden importantForAccessibility="no">
              {helper}
            </T>
          ) : null}
          <Button label={intro ? t('assess2.begin') : step === 1 ? t('assess2.finish') : t('assess2.next')} onPress={next} disabled={!ok} hint={helper} />
        </>
      }
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button kind="link" icon={null} label={intro ? t('assess2.close') : t('assess2.back')} onPress={back} />
        {intro ? null : <Button kind="link" icon={null} label={t('assess2.close')} onPress={close} />}
      </View>
      <T ref={headingRef} variant="display-m" accessibilityRole="header">
        {intro ? t('assess2.introTitle') : step === 0 ? t('assess2.screens.you') : t('assess2.screens.money')}
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
        <>
          <View style={{ gap: space.s2 }}>
            <T variant="caption" tone="fgMuted">
              {t('assess2.answered', { n: count(progress.n), total: count(progress.total) })}
            </T>
            {/* Decorative: the value is the text above. Fills from the start edge, in both directions. */}
            <View accessible={false} importantForAccessibility="no-hide-descendants" style={{ height: 4, backgroundColor: c.progressTrack, flexDirection: 'row' }}>
              <View style={{ flex: progress.n, backgroundColor: c.progressFill }} />
              <View style={{ flex: Math.max(0, progress.total - progress.n) }} />
            </View>
          </View>
          <View ref={listRef} onLayout={(e) => (listY.current = e.nativeEvent.layout.y)}>
            <Ruled>
              {ASSESS_SCREENS[step].flatMap((key) =>
                fieldsOf(key, a).map((field) => {
                  const r = rows[field as Exclude<AssessField, 'talent'>];
                  return (
                    <PickerRow
                      key={field}
                      rowRef={(node) => {
                        rowRefs.current[field] = node;
                      }}
                      label={r.label}
                      sheetTitle={r.sheetTitle}
                      sub={r.sub}
                      options={r.options}
                      value={a[field] as string | undefined}
                      onChange={(id) => choose(field, id)}
                      open={openField === field}
                      onOpenChange={(o) => setOpenField(o ? field : null)}
                      onDismissed={dismissed}
                    />
                  );
                }),
              )}
              {step === 1 && askTalent ? (
                <PickerRow
                  label={t('assess2.rows.talent')}
                  sheetTitle={t('assess2.talent')}
                  multiple
                  options={TALENT_SIGNALS.map((s) => ({ id: s, label: t(`assess2.signals.${s}`) }))}
                  value={a.talent ?? []}
                  valueText={a.talent?.length ? t('assess2.selectedN', { n: count(a.talent.length) }) : undefined}
                  onChange={toggleTalent}
                  open={openField === 'talent'}
                  onOpenChange={(o) => setOpenField(o ? 'talent' : null)}
                  onDismissed={dismissed}
                />
              ) : null}
            </Ruled>
          </View>
        </>
      )}
    </Screen>
  );
}
