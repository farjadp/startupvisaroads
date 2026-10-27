// Route page v3 sections, layout A "road map" (spec 2026-10-27, auditor
// review). Each section renders nothing when its data is missing. Points are
// never shown here; they live on Me.
import * as WebBrowser from 'expo-web-browser';
import { useRef, useState } from 'react';
import { AccessibilityInfo, Platform, Pressable, Switch, View, useWindowDimensions } from 'react-native';
import { FX, convert, type FxCurrency } from '@shared/fx';
import type { DocItem, FundLine, Reality, Step, Timeline } from '@shared/routes-v2/extras-types';
import type { CountryProfile, Indicator } from '@shared/routes-v2/extras-types';
import type { L10n } from '@shared/routes-v2/types';
import { toPersianDigits } from '@/i18n/format';
import { FX_OLD, FX_TOO_OLD } from '@/engine/fx-age';
import { linesFor, sizeMissing, type Who } from '@/engine/household';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { size, space } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { Button, CheckRow, Label, Progress, Ruled, SourceLine } from './kit';
import { T } from './T';

const HIT = Platform.OS === 'android' ? size.touchMinAndroid : size.touchMin;
// iOS 26 draws the off-state thumb white whatever thumbColor says and lightens the off track it is
// given; at night fgMuted rendered #B4B4B4 (2.07:1 with the thumb). This fill renders #919091 on
// iOS 26: 5.8:1 against night but only 3.18:1 with the white thumb, so re-measure after any change
// (WCAG 1.4.11). Android uses it as given, with a light knob, since a dark knob vanishes at night.
const OFF_TRACK_NIGHT = '#6B6A67';
// The on knob is drawn white too, so the paper track left it at 1.1:1. Farjad chose a dimmed acid
// (27 Oct 2026) over a darker grey: on reads by colour, 4.7:1 against night, 4.0:1 with the knob.
const ON_TRACK_NIGHT = '#6E8A00';

/** The day the v3 route depth (funds, realities, timelines) was read from the official pages. Move it into the data when a file is re-checked. */
const EXTRAS_CHECKED = '2026-10-27';

/** Message key for a count of years or children: singular, Arabic dual and 11+, otherwise the regular form (no ICU in t()). */
function countKey(base: string, n: number, locale: string): string {
  if (n === 1 && locale !== 'zh') return `${base}One`;
  if (locale === 'fr' && n < 2) return `${base}One`;
  if (locale === 'ar' && n === 2) return `${base}Two`;
  if (locale === 'ar' && Number.isInteger(n) && n >= 11) return `${base}Many`;
  return base;
}

/** Localised text with its language, so screen readers switch voice for English fallbacks. */
function Txt({ text, variant = 'body', tone, weight }: { text: L10n; variant?: 'body' | 'row' | 'caption'; tone?: 'fg' | 'fgMuted'; weight?: 'bold' | 'medium' }) {
  const { pick } = useI18n();
  const p = pick(text);
  return (
    <T variant={variant} tone={tone} weight={weight} lang={p.lang}>
      {p.text}
    </T>
  );
}

// ------------------------------------------------------------------ your road

type StepState = 'done' | 'now' | 'ahead';

function Marker({ state }: { state: StepState }) {
  const { c } = useTheme();
  const box = { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' } as const;
  if (state === 'done') return <View style={[box, { backgroundColor: c.fg }]}>{<Icon name="check" size={16} tone="buttonFg" />}</View>;
  if (state === 'now') return <View style={[box, { backgroundColor: c.accent, borderWidth: 1.5, borderColor: c.fg }]} />;
  return <View style={[box, { borderWidth: 1.5, borderColor: c.fgFaint }]} />;
}

function StepRow({ step, n, total, state, open, onOpen, onToggle }: { step: Step; n: number; total: number; state: StepState; open: boolean; onOpen: () => void; onToggle: () => void }) {
  const { t, pick, count } = useI18n();
  const { c, mode } = useTheme();
  const offTrack = mode === 'night' ? OFF_TRACK_NIGHT : c.fgMuted;
  const onTrack = mode === 'night' ? ON_TRACK_NIGHT : c.fg;
  const title = pick(step.title);
  const stateWord = t(`road.${state}`);
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: c.rule }}>
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={t('road.stepA11y', { n: count(n), total: count(total), state: stateWord, title: title.text })}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: space.s3, minHeight: size.row + 4, paddingVertical: space.s2, backgroundColor: pressed ? c.rowPressed : 'transparent' })}
      >
        <Marker state={state} />
        <T variant="row" weight={state === 'now' ? 'bold' : 'medium'} tone={state === 'ahead' ? 'fgMuted' : 'fg'} lang={title.lang} style={{ flex: 1 }}>
          {title.text}
        </T>
        {state === 'now' ? (
          // Ink on an acid chip, never acid text on paper (auditor, Brand Book).
          <View style={{ backgroundColor: c.accent, paddingHorizontal: space.s2, paddingVertical: 2 }}>
            <T variant="label" tone="onAccent">
              {stateWord}
            </T>
          </View>
        ) : state === 'done' ? (
          <T variant="caption" tone="fgMuted">
            {stateWord}
          </T>
        ) : null}
      </Pressable>
      {open ? (
        <View style={{ gap: space.s2, paddingBottom: space.s3, paddingStart: 24 + space.s3 }}>
          <Txt text={step.detail} />
          {step.takes ? <T variant="caption" tone="fgMuted">{t('road.takes', { text: pick(step.takes).text })}</T> : null}
          {step.link ? <Button kind="link" label={t('road.openOfficial')} hint={t('common.opensBrowser')} onPress={() => void WebBrowser.openBrowserAsync(step.link!)} /> : null}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s3, minHeight: HIT }}>
            <T variant="row" style={{ flex: 1 }}>
              {t('road.markDone')}
            </T>
            <Switch value={state === 'done'} onValueChange={onToggle} accessibilityLabel={t('road.markDoneA11y', { title: title.text })} trackColor={{ true: onTrack, false: offTrack }} ios_backgroundColor={offTrack} thumbColor={mode === 'night' ? c.fg : c.bg} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

export function YourRoad({ routeKey, steps, authority }: { routeKey: string; steps: Step[]; authority: L10n }) {
  const { t, pick, count } = useI18n();
  const { state, toggleIn } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  if (!steps.length) return null;
  const done = new Set((state.journey[routeKey] ?? []).filter((k) => steps.some((s) => s.key === k)));
  const nowKey = steps.find((s) => !done.has(s.key))?.key;
  const stateOf = (s: Step): StepState => (done.has(s.key) ? 'done' : s.key === nowKey ? 'now' : 'ahead');
  return (
    <View style={{ gap: space.s2 }}>
      <Label>{t('road.yourRoad')}</Label>
      <T variant="row" tone="fgMuted">
        {t('road.stepsDone', { done: count(done.size), total: count(steps.length) })}
      </T>
      <Progress value={(done.size / steps.length) * 100} />
      <Ruled>
        {steps.map((s, i) => (
          <StepRow key={s.key} step={s} n={i + 1} total={steps.length} state={stateOf(s)} open={open === s.key} onOpen={() => setOpen(open === s.key ? null : s.key)} onToggle={() => toggleIn('journey', routeKey, s.key)} />
        ))}
        {/* The outcome is the authority's to decide: never tickable, never counted, never "Now" (auditor P0). */}
        <View accessible style={{ flexDirection: 'row', alignItems: 'center', gap: space.s3, minHeight: size.row + 4, paddingVertical: space.s2 }}>
          <View style={{ width: 24, alignItems: 'center' }}>
            <Icon name="route" size={20} tone="fgMuted" />
          </View>
          <T variant="row" tone="fgMuted" style={{ flex: 1 }}>
            {/* The whole authority line: its first part can be the wrong body (Denmark: the panel, not SIRI, which grants residence). */}
            {t('road.outcome', { authority: pick(authority).text })}
          </T>
        </View>
      </Ruled>
    </View>
  );
}

// ------------------------------------------------------------- check what you know

export function CheckWhatYouKnow({ routeKey, questions, onQuiz }: { routeKey: string; questions: number; onQuiz: () => void }) {
  const { t, count } = useI18n();
  const { c } = useTheme();
  const { state } = useStore();
  if (!questions) return null;
  const best = state.quizBest[routeKey];
  return (
    <View>
      <Label>{t('road.check')}</Label>
      <Ruled>
        <Pressable
          onPress={onQuiz}
          accessibilityRole="button"
          style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: space.s3, minHeight: 60, paddingVertical: space.s3, borderBottomWidth: 1, borderBottomColor: c.rule, backgroundColor: pressed ? c.rowPressed : 'transparent' })}
        >
          <Icon name="compass" />
          <View style={{ flex: 1, gap: 2 }}>
            <T variant="row" weight="bold">
              {t('road.quiz', { n: count(questions) })}
            </T>
            <T variant="caption" tone="fgMuted">
              {best ? t('road.quizBest', { right: count(best.right), of: count(best.of) }) : t('road.quizNew')}
            </T>
          </View>
          <Icon name="chevron" tone="fgMuted" />
        </Pressable>
      </Ruled>
    </View>
  );
}

// ------------------------------------------------------------------ documents

const STAGES = ['apply', 'visa', 'permit', 'renewal', 'other'] as const;

export function Documents({ routeKey, docs }: { routeKey: string; docs: DocItem[] }) {
  const { t, pick, count } = useI18n();
  const { state, toggleIn } = useStore();
  const ready = new Set(state.docs[routeKey] ?? []);
  const groups = STAGES.map((stage) => ({ stage, items: docs.filter((d) => (d.stage ?? 'other') === stage) })).filter((g) => g.items.length);
  // The first stage starts open; the rest are one row each until opened (auditor: no wall of documents).
  const [open, setOpen] = useState<Set<string>>(() => new Set(groups[0] ? [groups[0].stage] : []));
  if (!docs.length) return null;
  const doneCount = docs.filter((d) => ready.has(d.key)).length;
  return (
    <View style={{ gap: space.s2 }}>
      <Label>{t('road.docs')}</Label>
      <T variant="row" tone="fgMuted">
        {t('road.docsReady', { done: count(doneCount), total: count(docs.length) })}
      </T>
      <Progress value={(doneCount / docs.length) * 100} />
      {groups.map((g) => {
        const isOpen = open.has(g.stage) || groups.length === 1;
        const gDone = g.items.filter((d) => ready.has(d.key)).length;
        const head = t('road.stageReady', { stage: t(`road.stages.${g.stage}`), done: count(gDone), total: count(g.items.length) });
        return (
          <View key={g.stage}>
            {groups.length > 1 ? (
              <Pressable
                onPress={() => setOpen((s) => new Set(s.has(g.stage) ? [...s].filter((x) => x !== g.stage) : [...s, g.stage]))}
                accessibilityRole="button"
                accessibilityLabel={head}
                accessibilityState={{ expanded: isOpen }}
                style={{ flexDirection: 'row', alignItems: 'center', minHeight: HIT, gap: space.s2 }}
              >
                <T variant="row" weight="bold" style={{ flex: 1 }}>
                  {head}
                </T>
                <T variant="row" tone="fgMuted" importantForAccessibility="no">
                  {isOpen ? '−' : '+'}
                </T>
              </Pressable>
            ) : null}
            {isOpen ? (
              <Ruled>
                {g.items.map((d) => (
                  <View key={d.key}>
                    <CheckRow label={pick(d.label).text} checked={ready.has(d.key)} onToggle={() => toggleIn('docs', routeKey, d.key)} />
                    {d.note ? (
                      <View style={{ paddingStart: 22 + space.s3, paddingBottom: space.s2 }}>
                        <Txt text={d.note} variant="caption" tone="fgMuted" />
                      </View>
                    ) : null}
                  </View>
                ))}
              </Ruled>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

// ------------------------------------------------------------ money for your team

function Stepper({ label, value, valueText, min, max, onChange, fewer, more }: { label: string; value: number; valueText: string; min: number; max: number; onChange: (n: number) => void; fewer: string; more: string }) {
  const { c } = useTheme();
  // Two quick taps can both land before Pressable picks up the new handler; read the value through refs and build
  // each step on the last value sent, so a double-tap on + counts twice (auditor, fourth pass).
  const shown = useRef(value);
  shown.current = value;
  const sent = useRef<number | null>(null);
  if (sent.current === value) sent.current = null;
  const step = (d: number) => {
    const from = sent.current ?? shown.current;
    const n = Math.max(min, Math.min(max, from + d));
    if (n === from) return;
    sent.current = n;
    onChange(n);
  };
  const btn = (enabled: boolean) =>
    ({ pressed }: { pressed: boolean }) => ({ width: HIT, height: HIT, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: enabled ? c.fg : c.fgFaint, backgroundColor: pressed ? c.rowPressed : 'transparent' }) as const;
  // iOS: one adjustable element. Android: separate labelled buttons (TalkBack has no adjustable role).
  const ios = Platform.OS === 'ios';
  return (
    <View
      accessible={ios}
      accessibilityRole={ios ? 'adjustable' : undefined}
      accessibilityLabel={ios ? label : undefined}
      accessibilityValue={ios ? { text: valueText } : undefined}
      accessibilityActions={ios ? [{ name: 'increment' }, { name: 'decrement' }] : undefined}
      onAccessibilityAction={(e) => step(e.nativeEvent.actionName === 'increment' ? 1 : -1)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2, minHeight: HIT }}
    >
      <View style={{ flex: 1 }}>
        <T variant="row">{label}</T>
        <T variant="caption" tone="fgMuted" accessibilityLiveRegion="polite">
          {valueText}
        </T>
      </View>
      <Pressable onPress={() => step(-1)} disabled={value <= min} accessibilityRole="button" accessibilityLabel={fewer} importantForAccessibility={ios ? 'no' : 'yes'} style={btn(value > min)}>
        <T variant="headline" tone={value <= min ? 'disabledFg' : 'fg'}>
          −
        </T>
      </Pressable>
      <Pressable onPress={() => step(1)} disabled={value >= max} accessibilityRole="button" accessibilityLabel={more} importantForAccessibility={ios ? 'no' : 'yes'} style={btn(value < max)}>
        <T variant="headline" tone={value >= max ? 'disabledFg' : 'fg'}>
          +
        </T>
      </Pressable>
    </View>
  );
}

type Basis = 'once' | 'firstYear' | 'year' | 'month';

// 'year' in the data is one lump sum covering the first year (Denmark); 'perYear' recurs.
const BASIS: Record<FundLine['basis'], Basis> = { once: 'once', year: 'firstYear', perYear: 'year', prevYearIncome: 'year', month: 'month' };

export function TeamMoney({ funds, authority, home, onAbout, founderRange }: { funds: FundLine[]; authority: L10n; home: FxCurrency | null; onAbout: () => void; founderRange?: { min?: number; max?: number } }) {
  const { t, pick, money, count, date, locale } = useI18n();
  const { c, mode } = useTheme();
  const offTrack = mode === 'night' ? OFF_TRACK_NIGHT : c.fgMuted;
  const onTrack = mode === 'night' ? ON_TRACK_NIGHT : c.fg;
  const { state, patchTeam } = useStore();
  const { fontScale } = useWindowDimensions();
  const [how, setHow] = useState(false);
  if (!funds.length) return null;
  const team = state.team;
  const has = (...per: FundLine['per'][]) => funds.some((f) => per.includes(f.per));
  const sized = funds.some((f) => f.householdSize != null);
  // Controls appear only when a published amount depends on them (auditor P1).
  const showFounders = has('founder', 'further-founder');
  const showSpouse = sized || has('spouse');
  const showChildren = sized || has('child', 'children');
  const fMin = founderRange?.min ?? 1;
  const fMax = founderRange?.max ?? 5;
  const founders = Math.max(fMin, Math.min(fMax, team.founders));
  const who: Who = { founders: showFounders ? founders : 1, spouse: showSpouse && team.spouse, children: showChildren ? team.children : 0 };
  const announce = (msg: string) => {
    if (Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(msg);
  };
  const setTeam = (patch: Partial<typeof team>) => {
    patchTeam(patch);
    announce(t('road.recounted'));
  };
  const stacked = fontScale > 1.35;
  const lines = linesFor(funds, who);
  const missing = sizeMissing(funds, who);
  if (!lines.length) return null;
  // Converted amounts name the ECB rate date, as the Funds tool does (trust rule: every figure dated).
  const converted = !FX_TOO_OLD && lines.some(({ f }) => f.currency !== 'USD' || (home != null && home !== f.currency));
  return (
    <View style={{ gap: space.s2 }}>
      <Label>{t('road.money')}</Label>
      {showFounders ? (
        <Stepper
          label={t('road.founders')}
          value={founders}
          valueText={founders === 1 ? t('road.foundersOne') : t('road.foundersValue', { n: count(founders) })}
          min={fMin}
          max={fMax}
          onChange={(n) => setTeam({ founders: n })}
          fewer={t('road.fewerFounders')}
          more={t('road.moreFounders')}
        />
      ) : null}
      {showSpouse ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s3, minHeight: HIT }}>
          <T variant="row" style={{ flex: 1 }}>
            {t('road.spouse')}
          </T>
          <Switch value={team.spouse} onValueChange={(v) => setTeam({ spouse: v })} accessibilityLabel={t('road.spouse')} trackColor={{ true: onTrack, false: offTrack }} ios_backgroundColor={offTrack} thumbColor={mode === 'night' ? c.fg : c.bg} />
        </View>
      ) : null}
      {showChildren ? (
        <Stepper
          label={t('road.children')}
          value={team.children}
          valueText={team.children === 1 ? t('road.childrenOne') : t('road.childrenValue', { n: count(team.children) })}
          min={0}
          max={4}
          onChange={(n) => setTeam({ children: n })}
          fewer={t('road.fewerChildren')}
          more={t('road.moreChildren')}
        />
      ) : null}
      {!showSpouse && !showChildren ? (
        <T variant="caption" tone="fgMuted">
          {t('road.noFamilyAmount', { authority: pick(authority).text })}
        </T>
      ) : null}
      {missing != null ? (
        <T variant="caption" tone="fgMuted">
          {t('road.sizeMissing', { n: count(missing) })}
        </T>
      ) : null}
      {(['show', 'spend', 'invest'] as const).map((kind) => {
        const rows = lines.filter((l) => l.f.kind === kind);
        if (!rows.length) return null;
        return (
          <View key={kind}>
            <T variant="label" tone="fgMuted" style={{ marginTop: space.s2 }}>
              {t(`road.total.${kind}`)}
            </T>
            <Ruled>
              {rows.map(({ f, times }) => {
                const amount = f.amount * times;
                const shown = f.approx ? t('funds.about', { amount: money(amount, f.currency) }) : money(amount, f.currency);
                const label = pick(f.label);
                const meta = [times > 1 ? `${count(times)} × ${money(f.amount, f.currency)}` : f.householdSize != null ? null : t(`road.per.${f.per}`), t(`road.basis.${BASIS[f.basis]}`)].filter(Boolean).join(' · ');
                const usd = !FX_TOO_OLD && f.currency !== 'USD' ? t('funds.about', { amount: money(convert(amount, f.currency, 'USD'), 'USD') }) : null;
                const alt = !FX_TOO_OLD && home && home !== f.currency && home !== 'USD' ? t('funds.about', { amount: money(convert(amount, f.currency, home), home) }) : null;
                return (
                  <View key={f.key} accessible style={{ paddingVertical: space.s3, borderBottomWidth: 1, borderBottomColor: c.rule, gap: 2 }}>
                    <View style={stacked ? { gap: 2 } : { flexDirection: 'row', justifyContent: 'space-between', gap: space.s3 }}>
                      <T variant="row" tone="fgMuted" lang={label.lang} style={{ flexShrink: 1 }}>
                        {label.text}
                      </T>
                      <T variant="row" weight="bold">
                        {shown}
                      </T>
                    </View>
                    <T variant="caption" tone="fgMuted">
                      {[meta, usd, alt].filter(Boolean).join(' · ')}
                    </T>
                  </View>
                );
              })}
            </Ruled>
          </View>
        );
      })}
      {converted ? (
        <T variant="caption" tone="fgMuted">
          {`${t('funds.rates', { date: date(FX.date) })}${FX_OLD ? ` ${t('funds.usdOld')}` : ''}`}
        </T>
      ) : null}
      <Button kind="link" label={t('road.howCounted')} onPress={() => setHow(!how)} />
      {how
        ? funds.map((f) => (
            <View key={f.key} style={{ gap: 2 }}>
              <T variant="caption" lang={pick(f.label).lang}>
                {`${pick(f.label).text}: ${f.approx ? t('funds.about', { amount: money(f.amount, f.currency) }) : money(f.amount, f.currency)} · ${t(`road.per.${f.per}`)}`}
              </T>
              <SourceLine url={f.source} updated={EXTRAS_CHECKED} />
            </View>
          ))
        : null}
      <T variant="caption" tone="fgMuted">
        {t('road.minimumOnly')}
      </T>
      <Button kind="link" label={t('common.aboutLink')} onPress={onAbout} />
    </View>
  );
}

// ------------------------------------------------------------- what no one tells you

const KIND_ICON: Record<Reality['kind'], IconName> = { challenge: 'alert', tip: 'speech', myth: 'shield' };

export function Realities({ items }: { items: Reality[] }) {
  const { t, pick, count } = useI18n();
  const { c } = useTheme();
  const [all, setAll] = useState(false);
  if (!items.length) return null;
  const shown = all ? items : items.slice(0, 3);
  return (
    <View>
      <Label>{t('road.realities')}</Label>
      <Ruled>
        {shown.map((r) => (
          <View key={r.key} style={{ paddingVertical: space.s3, borderBottomWidth: 1, borderBottomColor: c.rule, gap: space.s1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2 }}>
              <Icon name={KIND_ICON[r.kind]} size={18} tone="fgMuted" />
              <T variant="label" tone="fgMuted">
                {t(`road.kinds.${r.kind}`)}
              </T>
            </View>
            <T variant="row" weight="bold" lang={pick(r.title).lang}>
              {pick(r.title).text}
            </T>
            <Txt text={r.detail} />
            {r.source ? <SourceLine url={r.source} updated={EXTRAS_CHECKED} /> : null}
          </View>
        ))}
      </Ruled>
      {items.length > 3 ? <Button kind="link" label={all ? t('road.showLess') : t('road.showAll', { n: count(items.length) })} onPress={() => setAll(!all)} /> : null}
    </View>
  );
}

// ------------------------------------------------------------ residence to citizenship

export function ToCitizenship({ timeline }: { timeline: Timeline }) {
  const { t, pick, count, locale } = useI18n();
  const { c } = useTheme();
  const { fontScale } = useWindowDimensions();
  const pr = timeline.prAfterYears;
  const cit = timeline.citizenshipAfterYears;
  const nodes = [
    t('road.arrive'),
    // 0 years: permanent from the start (Australia's NIV, Canada's PR routes), never "after 0 years".
    pr != null ? (pr === 0 ? t('road.prFromStart') : t(`road.${countKey('prAfter', pr, locale)}`, { n: count(pr) })) : null,
    cit != null ? t(`road.${countKey('citizenAfter', cit, locale)}`, { n: count(cit) }) : null,
  ].filter((x): x is string => !!x);
  // Stacked at large text (auditor: French labels wrap); a list for screen readers either way.
  const stacked = fontScale > 1.3 || nodes.some((n) => n.length > 48);
  return (
    <View style={{ gap: space.s2 }}>
      <Label>{t('road.timeline')}</Label>
      <View accessibilityRole="list" style={{ flexDirection: stacked ? 'column' : 'row', gap: space.s2 }}>
        {nodes.map((n, i) => (
          <View key={i} accessibilityRole="text" style={{ flex: stacked ? undefined : 1, flexDirection: stacked ? 'row' : 'column', gap: space.s2, alignItems: stacked ? 'center' : 'flex-start' }}>
            <View style={{ width: 14, height: 14, backgroundColor: i === 0 ? c.fg : 'transparent', borderWidth: 1.5, borderColor: c.fg }} />
            <T variant="caption" weight={i === 0 ? 'bold' : 'medium'} style={{ flexShrink: 1 }}>
              {n}
            </T>
          </View>
        ))}
      </View>
      <T variant="body">{t(`road.dual.${timeline.dualCitizenship}`)}</T>
      {/* No lang here: the label is in the UI language, and an English fallback would flip an Arabic line's direction. */}
      {/* First-strong isolate: an English fallback keeps its own order (and its full stop) inside an RTL line. */}
      {timeline.language ? <T variant="body">{t('road.language', { text: `\u2068${pick(timeline.language).text}\u2069` })}</T> : null}
      {timeline.note ? <Txt text={timeline.note} variant="caption" tone="fgMuted" /> : null}
      <SourceLine url={timeline.source} updated={EXTRAS_CHECKED} />
    </View>
  );
}

// ------------------------------------------------------------------ country profile

function IndicatorRow({ i }: { i: Indicator }) {
  const { t, count, meta, money } = useI18n();
  // A year is a label, not a quantity: no thousands separator.
  const year = meta.proseDigits === 'persian' ? toPersianDigits(String(i.year)) : String(i.year);
  const { c } = useTheme();
  const value =
    i.rank != null
      ? i.of != null
        ? t('profile.rank', { rank: count(i.rank), of: count(i.of) })
        : t('profile.rankOnly', { rank: count(i.rank) })
      : i.value != null
        ? // US$ stays Latin as money; a % is already in the row's name, so the figure is a plain count
          // (Persian digits in fa, and no "% 8.7" bidi flip). Other units are still English in the data.
          i.unit === 'USD'
          ? money(i.value, 'USD')
          : `${count(i.value)}${i.unit && i.unit !== '%' ? ` ${i.unit}` : ''}`
        : '';
  return (
    <View style={{ paddingVertical: space.s2, borderBottomWidth: 1, borderBottomColor: c.rule }}>
      <View accessible style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.s3 }}>
        <T variant="row" tone="fgMuted" style={{ flexShrink: 1 }}>
          {`${t(`profile.names.${i.key}`)} · ${year}`}
        </T>
        <T variant="row" weight="bold">
          {value}
        </T>
      </View>
      <SourceLine url={i.source.url} updated={i.source.checked} />
    </View>
  );
}

export function CountryProfileView({ profile }: { profile: CountryProfile }) {
  const { t } = useI18n();
  const list = (items: L10n[], sign: string) =>
    items.map((s, k) => (
      <View key={k} style={{ flexDirection: 'row', gap: space.s2, paddingVertical: space.s1 }}>
        <T variant="body" weight="bold" importantForAccessibility="no">
          {sign}
        </T>
        <View style={{ flex: 1 }}>
          <Txt text={s} />
        </View>
      </View>
    ));
  return (
    <>
      {profile.strengths.length ? (
        <View>
          <Label>{t('profile.strengths')}</Label>
          {list(profile.strengths, '+')}
        </View>
      ) : null}
      {profile.weaknesses.length ? (
        <View>
          <Label>{t('profile.weaknesses')}</Label>
          {list(profile.weaknesses, '−')}
        </View>
      ) : null}
      {profile.indicators.length ? (
        <View>
          <Label>{t('profile.indicators')}</Label>
          <Ruled>{profile.indicators.map((i) => <IndicatorRow key={i.key} i={i} />)}</Ruled>
        </View>
      ) : null}
    </>
  );
}
