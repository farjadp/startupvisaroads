// Express Entry in the app (spec 2026-11-09 §4, amendments 2, 4 and 8; Farjad
// chose option B: one screen, live score). The score sits on top and follows
// every picker; the grid is the site's engine on config/crs-points.json. No
// auto-advance: a choice closes the sheet and nothing else opens. The animated
// total is hidden from screen readers; the change is announced once, after the
// sheet has gone. Rows are kept on the phone only.
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Keyboard, Platform, Pressable, ScrollView, TextInput, View, findNodeHandle, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ABILITIES,
  AGES,
  CANADIAN_EDUCATION,
  CANADIAN_WORK,
  CATEGORY_META,
  CLB_BANDS,
  EDUCATION,
  FIRST_LANGUAGE,
  FOREIGN_WORK,
  GRID,
  MARITAL,
  NOCS,
  SECOND_LANGUAGE,
  WAGE,
  bestGain,
  categoriesForNoc,
  daysSince,
  latestGeneral,
  resultOf,
  searchNoc,
  spouseCounts,
  DRAWS_MAX_AGE_DAYS,
  type CrsField,
  type CrsInputs,
  type Gain,
  type SavedDraws,
} from '@/engine/crs';
import { cachedDraws, fetchDraws } from '@/engine/crs-draws';
import { toPersianDigits } from '@/i18n/format';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { fontFor } from '@/theme/fonts';
import { useTheme } from '@/theme/ThemeProvider';
import { motion, size, space, typeSpec } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Disclaimer, Label, LinkRow, RadioRow, Ruled, SourceLine, useReduceMotion } from '@/ui/kit';
import { PickerRow, type PickerOption } from '@/ui/PickerRow';
import { Sheet } from '@/ui/Sheet';
import { T } from '@/ui/T';

const HIT = Platform.OS === 'android' ? size.touchMinAndroid : size.touchMin;
/** Signed and ratio figures keep their direction inside right-to-left text (amendment 8). */
const iso = (s: string) => `⁨${s}⁩`;

/** Counts from the last shown total to the new one; jumps under Reduce Motion (or before it is known). */
function useCountUp(target: number, reduce: boolean | null): number {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (reduce !== false) {
      from.current = target;
      setShown(target);
      return;
    }
    const start = from.current;
    const t0 = Date.now();
    let raf = 0;
    const step = () => {
      const k = Math.min(1, (Date.now() - t0) / motion.reveal);
      const v = Math.round(start + (target - start) * (1 - (1 - k) ** 3));
      from.current = v;
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, reduce]);
  return shown;
}

type Row = { field: Exclude<CrsField, 'noc'>; label: string; sub?: string; options: PickerOption[] };

function useRows(i: Partial<CrsInputs>) {
  const { t, count, date, locale } = useI18n();
  // "1.3x" → "1.3×"; Persian digits and the Persian decimal sign in fa.
  const multiple = (w: string) => {
    const x = w.replace('x', '×');
    return locale === 'fa' ? toPersianDigits(x).replace('.', '٫') : locale === 'fr' ? x.replace('.', ',') : x;
  };
  const opt = (id: string, label: string): PickerOption => ({ id, label });
  const clb = (b: string) => (b === 'lt4' ? t('crs.opt.clbLt4') : b === '10' ? t('crs.opt.clb10') : iso(t('crs.opt.clb', { n: count(Number(b)) })));
  const bands = CLB_BANDS.map((b) => opt(b, clb(b)));
  const years = (list: readonly string[], plusAt: string) =>
    list.map((y) => opt(y, y === '0' ? t('crs.opt.none') : y === plusAt ? t('crs.opt.yearsPlus', { n: count(Number(y)) }) : y === '1' ? t('crs.opt.year1') : t('crs.opt.years', { n: count(Number(y)) })));
  const yesNo = [opt('yes', t('crs.opt.yes')), opt('no', t('crs.opt.no'))];
  const education = EDUCATION.map((e) => opt(e, t(`crs.opt.education.${e}`)));
  const wage = (none: string) => WAGE.map((w) => opt(w, w === 'none' ? none : t('crs.opt.wage', { x: iso(multiple(w)) })));
  const married = i.marital === 'married' || i.marital === 'commonLaw';

  const rows = {
    you: [
      { field: 'age', label: t('crs.rows.age'), sub: t('crs.subs.age'), options: AGES.map((a) => opt(a, a === '17' ? t('crs.opt.age17') : a === '45' ? t('crs.opt.age45') : count(Number(a)))) },
      { field: 'marital', label: t('crs.rows.marital'), options: MARITAL.map((m) => opt(m, t(`crs.opt.marital.${m}`))) },
      ...(married ? [{ field: 'spouseComing', label: t('crs.rows.spouseComing'), options: yesNo } as Row] : []),
    ],
    language: [
      { field: 'firstLanguage', label: t('crs.rows.firstLanguage'), options: FIRST_LANGUAGE.map((l) => opt(l, t(`crs.opt.${l}`))) },
      ...ABILITIES.map((a) => ({ field: a, label: t(`crs.rows.${a}`), options: bands }) as Row),
      { field: 'secondLanguage', label: t('crs.rows.secondLanguage'), sub: t('crs.subs.second'), options: SECOND_LANGUAGE.map((b) => (b === 'none' ? opt(b, t('crs.opt.noSecond')) : opt(b, clb(b)))) },
    ],
    work: [
      { field: 'education', label: t('crs.rows.education'), options: education },
      { field: 'foreignWork', label: t('crs.rows.foreignWork'), sub: t('crs.subs.work'), options: years(FOREIGN_WORK, '3') },
      { field: 'canadianWork', label: t('crs.rows.canadianWork'), sub: t('crs.subs.work'), options: years(CANADIAN_WORK, '5') },
      { field: 'highWage', label: t('crs.rows.highWage'), sub: t('crs.subs.highWage'), options: wage(t('crs.opt.wageNone')) },
      { field: 'certificate', label: t('crs.rows.certificate'), options: yesNo },
      { field: 'canadianEducation', label: t('crs.rows.canadianEducation'), options: CANADIAN_EDUCATION.map((e) => opt(e, t(`crs.opt.canadianEducation.${e}`))) },
    ],
    offers: [
      { field: 'jobOffer', label: t('crs.rows.jobOffer'), sub: t('crs.subs.jobOffer', { date: date(GRID.lmiEffective) }), options: wage(t('crs.opt.noOffer')) },
      { field: 'nomination', label: t('crs.rows.nomination'), options: yesNo },
      { field: 'sibling', label: t('crs.rows.sibling'), sub: t('crs.subs.sibling'), options: yesNo },
    ],
    spouse: [
      { field: 'spouseEducation', label: t('crs.rows.spouseEducation'), options: education },
      { field: 'spouseLanguage', label: t('crs.rows.spouseLanguage'), sub: t('crs.subs.second'), options: bands },
      { field: 'spouseCanadianWork', label: t('crs.rows.spouseCanadianWork'), options: years(CANADIAN_WORK, '5') },
    ],
  } satisfies Record<string, Row[]>;
  return rows as Record<keyof typeof rows, Row[]>;
}

/** "label … value" on a rule; the pair is one element for screen readers. */
function Line({ label, value, strong, sub }: { label: string; value: string; strong?: boolean; sub?: string }) {
  const { c } = useTheme();
  const { fontScale } = useWindowDimensions();
  const stacked = fontScale > 1.3;
  return (
    <View accessible accessibilityLabel={`${label}, ${value}`} style={{ paddingVertical: space.s3, borderBottomWidth: 1, borderBottomColor: c.rule, gap: space.s1 }}>
      <View style={{ flexDirection: stacked ? 'column' : 'row', justifyContent: 'space-between', gap: space.s3 }}>
        <T variant="row" weight={strong ? 'bold' : 'medium'} style={stacked ? undefined : { flex: 1 }}>
          {label}
        </T>
        <T variant="row" weight="bold">
          {value}
        </T>
      </View>
      {sub ? (
        <T variant="caption" tone="fgMuted">
          {sub}
        </T>
      ) : null}
    </View>
  );
}

/** The occupation row: a sheet with a search field over config/noc-codes.json. Optional and never scored. */
function NocRow({ value, onChange, onDismissed }: { value?: string; onChange: (code: string | undefined) => void; onDismissed: () => void }) {
  const { c } = useTheme();
  const { t, meta, locale, count } = useI18n();
  const { fontScale, height } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [keyboard, setKeyboard] = useState(0);
  const rowRef = useRef<View>(null);
  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', (e) => setKeyboard(e.endCoordinates.height));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboard(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  const chosen = NOCS.find((n) => n.code === value);
  const title = (n: { title: string; titleFa: string }) => (locale === 'fa' ? n.titleFa : n.title);
  const shown = chosen ? `${chosen.code} · ${title(chosen)}` : undefined;
  const results = searchNoc(query);
  const s = typeSpec('body', meta.script);
  // A chosen occupation is a long line: the label then sits above it.
  const stacked = fontScale > 1.3 || !!shown;
  const dismissed = () => {
    const node = rowRef.current ? findNodeHandle(rowRef.current) : null;
    if (node) AccessibilityInfo.setAccessibilityFocus(node);
    onDismissed();
  };
  const close = () => {
    Keyboard.dismiss();
    setOpen(false);
  };
  return (
    <>
      <Pressable
        ref={rowRef}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${t('crs.noc.row')}, ${shown ?? t('common.choose')}`}
        accessibilityHint={t('common.opensList')}
        style={({ pressed }) => ({
          flexDirection: stacked ? 'column' : 'row',
          alignItems: stacked ? 'stretch' : 'center',
          gap: stacked ? space.s1 : space.s3,
          minHeight: Math.max(HIT, size.row + 12),
          paddingVertical: space.s3,
          borderBottomWidth: 1,
          borderBottomColor: c.rule,
          backgroundColor: pressed ? c.rowPressed : 'transparent',
        })}
      >
        <T variant="row" weight="bold" style={stacked ? undefined : { flex: 1 }}>
          {t('crs.noc.row')}
        </T>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2, flexShrink: 1, justifyContent: stacked ? 'space-between' : 'flex-end' }}>
          <T variant="row" tone={shown ? 'fg' : 'fgMuted'} style={{ flexShrink: 1 }} numberOfLines={2}>
            {shown ?? t('common.choose')}
          </T>
          <Icon name="chevron" tone="fgMuted" />
        </View>
      </Pressable>
      <Sheet open={open} onClose={close} onDismissed={dismissed} title={t('crs.noc.row')} sub={t('crs.noc.seed', { n: count(NOCS.length) })}>
        {/* A tall body keeps the card high, so the search field stays above the keyboard. */}
        <View style={{ minHeight: height * 0.6, gap: space.s3 }}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('crs.noc.search')}
            placeholderTextColor={c.fgMuted}
            accessibilityLabel={t('crs.noc.search')}
            autoCorrect={false}
            returnKeyType="search"
            style={{
              minHeight: HIT,
              borderWidth: 1.5,
              borderColor: c.fg,
              paddingHorizontal: space.s3,
              color: c.fg,
              fontSize: s.fontSize,
              textAlign: meta.rtl ? 'right' : 'left',
              ...fontFor(meta.script, false, 'regular'),
            }}
          />
          <View accessibilityRole="radiogroup">
            <Ruled>
              {value ? <RadioRow label={t('crs.noc.clear')} muted selected={false} onPress={() => (onChange(undefined), close())} /> : null}
              {results.map((n) => (
                <RadioRow key={n.code} label={`${n.code} · ${title(n)}`} selected={n.code === value} onPress={() => (onChange(n.code), close())} />
              ))}
            </Ruled>
          </View>
          {results.length === 0 ? (
            <T variant="body" tone="fgMuted">
              {t('crs.noc.none')}
            </T>
          ) : null}
          <View style={{ height: keyboard }} />
        </View>
      </Sheet>
    </>
  );
}

export default function ExpressEntry() {
  const { state, set } = useStore();
  const { t, count, date, locale, meta } = useI18n();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = useReduceMotion();
  const inputs = state.crs;
  const rows = useRows(inputs);
  const result = useMemo(() => resultOf(inputs), [inputs]);
  const gain = useMemo(() => bestGain(inputs), [inputs]);
  const total = result.total;
  const shown = useCountUp(total, reduce);
  const max = count(GRID.maxTotal);
  const withSpouse = spouseCounts(inputs);


  // Announce once after a sheet has gone, with the change since the last announcement.
  const announced = useRef(total);
  const [change, setChange] = useState<number | null>(null);
  const announce = useCallback(() => {
    const d = total - announced.current;
    if (d === 0) return;
    announced.current = total;
    setChange(d);
    const text = t(d > 0 ? 'crs.a11yUp' : 'crs.a11yDown', { n: count(total), max, d: count(Math.abs(d)) });
    if (Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(text);
  }, [total, t, count, max]);

  const setField = (field: CrsField, value: string | undefined) => {
    const next: Partial<CrsInputs> = { ...inputs };
    if (value === undefined) delete next[field];
    else (next as Record<string, string>)[field] = value;
    set({ crs: next, crsAt: new Date().toISOString() });
  };

  // The compact total pins under the header once the score block has scrolled away.
  const [pinned, setPinned] = useState(false);
  const scoreBottom = useRef(0);

  // Rounds of invitations: the saved copy first, then the site.
  const [draws, setDraws] = useState<SavedDraws | null>(null);
  const [drawsState, setDrawsState] = useState<'loading' | 'live' | 'offline' | 'error'>('loading');
  const loadDraws = useCallback(() => {
    let live = true;
    setDrawsState('loading');
    void cachedDraws().then((saved) => live && saved && setDraws((d) => d ?? saved));
    fetchDraws()
      .then((fresh) => {
        if (!live) return;
        setDraws(fresh);
        setDrawsState('live');
      })
      .catch(() => {
        if (!live) return;
        setDrawsState('offline');
      });
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => loadDraws(), [loadDraws]);

  const optionLabel = (field: Exclude<CrsField, 'noc'>, id: string) => {
    for (const list of Object.values(rows)) {
      const row = list.find((r) => r.field === field);
      if (row) return { row: row.label, value: row.options.find((o) => o.id === id)?.label ?? id };
    }
    return { row: field, value: id };
  };
  const gainText = (g: Gain) => {
    if (g.field === 'allFour') return t('crs.gain.allFour', { band: rows.language[1].options.find((o) => o.id === g.to)?.label ?? g.to });
    const { row, value } = optionLabel(g.field, g.to);
    return `${row}: ${value}`;
  };
  const answeredGainRows = (['speaking', 'listening', 'reading', 'writing', 'education', 'foreignWork', 'canadianWork'] as const).some((f) => inputs[f] !== undefined);

  const b = result.breakdown;
  const general = draws ? latestGeneral(draws.rounds) : null;
  const stale = draws ? daysSince(draws.savedAt, new Date()) > DRAWS_MAX_AGE_DAYS : false;
  const categories = categoriesForNoc(inputs.noc);
  const lang = meta.siteLocale === 'fa' ? 'fa' : 'en';

  const group = (title: string, list: Row[]) => (
    <View style={{ gap: space.s2 }}>
      <Label>{title}</Label>
      <Ruled>
        {list.map((r) => (
          <PickerRow key={r.field} label={r.label} sub={r.sub} options={r.options} value={inputs[r.field]} onChange={(id) => setField(r.field, id)} onDismissed={announce} />
        ))}
      </Ruled>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        scrollEventThrottle={32}
        onScroll={(e) => {
          const p = e.nativeEvent.contentOffset.y > scoreBottom.current;
          if (p !== pinned) setPinned(p);
        }}
        contentContainerStyle={{ paddingTop: space.s4, paddingBottom: Math.max(insets.bottom, space.s4) + space.s6, paddingHorizontal: space.s6, gap: space.s5 }}
      >
        {/* Score block */}
        <View onLayout={(e) => (scoreBottom.current = e.nativeEvent.layout.y + e.nativeEvent.layout.height)} style={{ gap: space.s2, paddingBottom: space.s4, borderBottomWidth: 1.5, borderBottomColor: c.fg }}>
          <T variant="label" tone="fgMuted" accessibilityRole="header">
            {t('crs.scoreLabel')}
          </T>
          <View accessible accessibilityLabel={t('crs.a11yTotal', { n: count(total), max })} style={{ flexDirection: 'row', alignItems: 'baseline', gap: space.s3, flexWrap: 'wrap' }}>
            <T variant="figure" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              {count(shown)}
            </T>
            <T variant="row" tone="fgMuted" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              {t('crs.of', { max })}
            </T>
          </View>
          {/* Visible change line; on Android the polite live region reads it when it changes. */}
          <T
            variant="caption"
            tone="fgMuted"
            accessibilityLiveRegion="polite"
            accessibilityLabel={change ? t(change > 0 ? 'crs.a11yUp' : 'crs.a11yDown', { n: count(total), max, d: count(Math.abs(change)) }) : undefined}
          >
            {change ? t(change > 0 ? 'crs.up' : 'crs.down', { d: iso(count(Math.abs(change))) }) : t('crs.emptyNote')}
          </T>
          <T variant="caption" tone="fgMuted">
            {t('crs.grid', { date: date(GRID.lmiEffective), version: GRID.rulesVersion })}
          </T>
          <SourceLine url={GRID.source} updated={GRID.lastVerified} />
        </View>

        {group(t('crs.groups.you'), rows.you)}
        <View style={{ gap: space.s2 }}>
          {group(t('crs.groups.language'), rows.language)}
          <LinkRow external icon="speech" label={t('crs.converter')} sub="visaroads.com" onPress={() => void WebBrowser.openBrowserAsync(`https://visaroads.com/${lang}/tools/express-entry`)} />
        </View>
        {group(t('crs.groups.work'), rows.work)}
        {group(t('crs.groups.offers'), rows.offers)}
        {withSpouse ? group(t('crs.groups.spouse'), rows.spouse) : null}

        {/* Breakdown */}
        <View style={{ gap: space.s2 }}>
          <Label>{t('crs.breakdown.title')}</Label>
          <View>
            <Line label={t('crs.breakdown.core')} value={count(b.coreHumanCapital.subtotal - b.coreHumanCapital.labourMarketIntegration)} />
            <Line label={t('crs.breakdown.lmi')} value={count(b.coreHumanCapital.labourMarketIntegration)} sub={t('crs.breakdown.lmiNote', { date: date(GRID.lmiEffective) })} />
            {withSpouse ? <Line label={t('crs.breakdown.spouse')} value={count(b.spouseFactors.subtotal)} /> : null}
            <Line label={t('crs.breakdown.transfer')} value={count(b.skillTransferability.subtotal)} />
            <Line label={t('crs.breakdown.additional')} value={count(b.additionalPoints.subtotal)} />
            <Line strong label={t('crs.breakdown.total')} value={count(total)} />
          </View>
        </View>

        {/* What adds the most points */}
        <View style={{ gap: space.s2 }}>
          <Label>{t('crs.gain.title')}</Label>
          <T variant="body" weight={gain ? 'bold' : 'regular'}>
            {gain ? `${gainText(gain)}: ${iso(`+${count(gain.gain)}`)}` : answeredGainRows ? t('crs.gain.none') : t('crs.gain.empty')}
          </T>
          <T variant="caption" tone="fgMuted">
            {t('crs.gain.notAdvice')}
          </T>
        </View>

        {/* Category draws that list your NOC */}
        <View style={{ gap: space.s2 }}>
          <Label>{t('crs.noc.title')}</Label>
          <Ruled>
            <NocRow value={inputs.noc} onChange={(code) => setField('noc', code)} onDismissed={() => {}} />
          </Ruled>
          {inputs.noc ? (
            categories.length ? (
              <View style={{ gap: space.s1 }}>
                <T variant="body">{t('crs.noc.listed', { code: iso(inputs.noc) })}</T>
                {categories.map((cat) => (
                  <T key={cat.id} variant="body" weight="bold">
                    {`· ${locale === 'fa' ? cat.nameFa : cat.name}${cat.canadianExperience ? ` (${t('crs.noc.canadianExp')})` : ''}`}
                  </T>
                ))}
              </View>
            ) : (
              <T variant="body">{t('crs.noc.notListed', { code: iso(inputs.noc) })}</T>
            )
          ) : (
            <T variant="caption" tone="fgMuted">
              {t('crs.noc.optional')}
            </T>
          )}
          <T variant="caption" tone="fgMuted">
            {t('crs.noc.otherConditions')}
          </T>
          <SourceLine url={CATEGORY_META.source} updated={CATEGORY_META.lastVerified} />
        </View>

        {/* Last rounds */}
        <View style={{ gap: space.s2 }}>
          <Label>{t('crs.draws.title')}</Label>
          {draws ? (
            <>
              <T variant="body" weight="bold">
                {general
                  ? t('crs.draws.lastGeneral', { date: date(general.date), cutoff: count(general.crsCutoff), n: count(total) })
                  : t('crs.draws.noGeneral', { n: count(draws.rounds.length) })}
              </T>
              {drawsState === 'offline' || stale ? (
                <T variant="caption" tone="fgMuted">
                  {drawsState === 'offline' ? t('common.offline', { date: date(draws.savedAt) }) : t('crs.draws.saved', { date: date(draws.savedAt) })}
                </T>
              ) : null}
              <View>
                {draws.rounds.slice(0, 3).map((r) => (
                  <View
                    key={`${r.drawNumber}-${r.date}`}
                    accessible
                    accessibilityLabel={`${date(r.date)}, ${r.roundType}, ${t('crs.draws.cutoff', { n: count(r.crsCutoff) })}, ${t('crs.draws.invitations', { n: count(r.invitations) })}`}
                    style={{ paddingVertical: space.s3, borderBottomWidth: 1, borderBottomColor: c.rule, gap: space.s1 }}
                  >
                    <T variant="caption" tone="fgMuted">
                      {date(r.date)}
                    </T>
                    <T variant="row" weight="bold" lang="en">
                      {r.roundType}
                    </T>
                    <T variant="caption">{`${t('crs.draws.cutoff', { n: count(r.crsCutoff) })} · ${t('crs.draws.invitations', { n: count(r.invitations) })}`}</T>
                  </View>
                ))}
              </View>
              <SourceLine url={draws.source} updated={(draws.fetchedAt || draws.savedAt).slice(0, 10)} />
            </>
          ) : drawsState === 'loading' ? (
            <T variant="body" tone="fgMuted">
              {t('crs.draws.loading')}
            </T>
          ) : (
            <View style={{ gap: space.s2 }}>
              <T variant="body">{t('crs.draws.error')}</T>
              <Pressable accessibilityRole="button" onPress={loadDraws} style={{ minHeight: HIT, justifyContent: 'center' }}>
                <T variant="row" weight="bold" style={{ textDecorationLine: 'underline' }}>
                  {t('common.retry')}
                </T>
              </Pressable>
            </View>
          )}
        </View>

        <Disclaimer />
      </ScrollView>

      {/* Compact total, visual only (screen readers have the score block and the announcement). */}
      {pinned ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          style={{ position: 'absolute', top: 0, start: 0, end: 0, flexDirection: 'row', alignItems: 'baseline', gap: space.s2, paddingHorizontal: space.s6, paddingVertical: space.s2, backgroundColor: c.bg, borderBottomWidth: 1.5, borderBottomColor: c.fg }}
        >
          <T variant="label" tone="fgMuted">
            {t('crs.pinned')}
          </T>
          <T variant="headline">{count(shown)}</T>
          <T variant="caption" tone="fgMuted">
            {t('crs.of', { max })}
          </T>
        </View>
      ) : null}
    </View>
  );
}
