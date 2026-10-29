// Route page v2 (spec 2026-10-15 §3), read from lib/routes-v2: the deciding
// fact first, then the conditions we can check and the ones only the
// authority decides, the money (with "about USD" when the user asked for it),
// time, fees, the path to permanent residence and every source with its date.
// Unverified routes say so before any figure. v3 (spec 2026-10-27, layout A):
// the road (steps), the quiz, documents and team money, then the conditions,
// realities, the timeline to citizenship and the country, for routes this user
// can run; routes closed to them keep only the facts and the reason.
// Trimmed after the UX review (27 Oct 2026): a status tally for assessed
// users, the drawn road, then three folding chapters (Do, The rules, After
// you arrive). Nothing is dropped; the mentor, sources and disclaimer stay
// unfolded at the end.
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { AccessibilityInfo, Platform, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { FX, convert, toUsdExact, type FxCurrency } from '@shared/fx';
import { routeV2 } from '@shared/routes-v2';
import { extrasOf } from '@shared/routes-v2/extras';
import { match, type CriterionState } from '@shared/routes-v2/match';
import type { Criterion, MoneyLine } from '@shared/routes-v2/types';
import { HOME_CURRENCY, toProfile, type Residence } from '@/content/assessment';
import { FX_OLD, FX_TOO_OLD } from '@/engine/fx-age';
import { statusByKey, tally, type Tally } from '@/engine/tally';
import { COUNTRY_NAMES, type Country } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { size, space } from '@/theme/tokens';
import { Flag } from '@/ui/Flag';
import { Icon } from '@/ui/Icon';
import { Banner, Button, Chapter, Disclaimer, Heading, Label, LinkRow, Ruled, Screen, SourceLine, useReduceMotion } from '@/ui/kit';
import { CheckWhatYouKnow, Documents, Realities, TeamMoney, ToCitizenship, YourRoad } from '@/ui/road';
import { T } from '@/ui/T';

/** Label beside amount; stacked at accessibility text sizes so the label never breaks word by word (HIG Dynamic Type). */
function useAmountRow() {
  const { fontScale } = useWindowDimensions();
  return fontScale >= 1.35
    ? ({ flexDirection: 'column', gap: 2 } as const)
    : ({ flexDirection: 'row', justifyContent: 'space-between', gap: space.s3 } as const);
}

const HIT = Platform.OS === 'android' ? size.touchMinAndroid : size.touchMin;

/** First letter up where the script has case ("based on…" opens a spoken label). */
function upFirst(s: string, locale: string): string {
  return s.charAt(0).toLocaleUpperCase(locale) + s.slice(1);
}

/** A condition, with what the assessment found for it when there is one (the same states as the tally). */
function CriterionRow({ c, status }: { c: Criterion; status?: CriterionState }) {
  const { t, pick } = useI18n();
  const { c: col } = useTheme();
  const row = useAmountRow();
  const label = pick(c.label);
  const word = status ? (status === 'unscored' ? t('route2.notChecked') : t(`status.${status}`)) : null;
  const note = c.note ? pick(c.note).text : null;
  return (
    <View
      accessible={!!word}
      accessibilityLabel={word ? [`${label.text}: ${word}`, note].filter(Boolean).join('. ') : undefined}
      style={{ paddingVertical: space.s3, borderBottomWidth: 1, borderBottomColor: col.rule, gap: space.s1 }}
    >
      <View style={word ? row : undefined}>
        <T variant="row" weight={c.weight === 3 ? 'bold' : 'medium'} lang={label.lang} style={{ flexShrink: 1 }}>
          {label.text}
        </T>
        {word ? (
          <T variant="row" weight="bold">
            {word}
          </T>
        ) : null}
      </View>
      {c.note ? (
        <T variant="caption" tone="fgMuted" lang={pick(c.note).lang}>
          {pick(c.note).text}
        </T>
      ) : null}
    </View>
  );
}

/** The extra currency chosen in the Funds tool (older installs: the USD switch); none past 90 days. */
function altCurrency(state: { fundsCurrency: FxCurrency | 'none' | null; fundsUsd: boolean }): FxCurrency | null {
  const chosen = state.fundsCurrency ?? (state.fundsUsd ? 'USD' : 'none');
  return FX_TOO_OLD || chosen === 'none' ? null : chosen;
}

function MoneyRow({ m }: { m: MoneyLine }) {
  const { t, pick, money } = useI18n();
  const { c } = useTheme();
  const { state } = useStore();
  const amount = money(m.amount, m.currency);
  const shown = m.approx ? t('funds.about', { amount }) : amount;
  const alt = altCurrency(state);
  const usd = alt && m.currency !== alt ? t('funds.about', { amount: money(convert(m.amount, m.currency as FxCurrency, alt), alt) }) : null;
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
        {[basis, usd].filter(Boolean).join(t('route2.sep'))}
      </T>
      {m.shows ? (
        <T variant="caption" tone="fgMuted" lang={pick(m.shows).lang}>
          {pick(m.shows).text}
        </T>
      ) : null}
    </View>
  );
}

/**
 * What the assessment found for this route, as one line of counts (never a %, never a heading). Opens The rules at
 * the conditions. Wraps rather than truncates at large text.
 */
function StatusTally({ counts, coverage, onPress }: { counts: Tally; coverage: string; onPress: () => void }) {
  const { t, count, locale } = useI18n();
  const { c } = useTheme();
  const parts = [
    counts.met ? t('route2.tallyMet', { n: count(counts.met) }) : null,
    counts.close ? t('route2.tallyClose', { n: count(counts.close) }) : null,
    counts.notYet ? t('route2.tallyNotYet', { n: count(counts.notYet) }) : null,
    counts.unchecked ? t('assess2.unchecked', { n: count(counts.unchecked) }) : null,
  ].filter((x): x is string => !!x);
  return (
    <View style={{ gap: space.s2 }}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        // Coverage first, then the counts (trust rule: no figure without what it rests on).
        accessibilityLabel={`${upFirst(coverage, locale)}: ${parts.join(', ')}`}
        accessibilityHint={t('route2.tallyHint')}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: space.s3, minHeight: HIT, paddingVertical: space.s3, paddingHorizontal: space.s4, borderWidth: 1, borderColor: c.fg, backgroundColor: pressed ? c.rowPressed : 'transparent' })}
      >
        <T variant="row" weight="bold" style={{ flex: 1 }}>
          {parts.join(t('route2.sep'))}
        </T>
        <Icon name="chevron" tone="fg" />
      </Pressable>
      <T variant="caption" tone="fgMuted">
        {t('common.readiness')}
      </T>
    </View>
  );
}

type ChapterKey = 'do' | 'rules' | 'after';

export default function RoutePage() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const { t, pick, money, date, count, locale } = useI18n();
  const { c: col } = useTheme();
  const { state, openedSource } = useStore();
  const row = useAmountRow();
  const reduce = useReduceMotion();
  // Chapters start folded and stay as the user leaves them for this visit only.
  const [open, setOpen] = useState<Record<ChapterKey, boolean>>({ do: false, rules: false, after: false });
  const scroll = useRef<ScrollView>(null);
  const conditions = useRef<View>(null);
  const conditionsHead = useRef<View>(null);
  const seeking = useRef(false);
  const route = routeV2(String(key));
  if (!route) return null;
  const extras = extrasOf(route.key) ?? {};
  const about = () => router.navigate('/(tabs)/me/about');
  // The passport gate (v2 flow §3): a route closed to the user's passport carries no journey, quiz or offer.
  const passport = state.assess.citizenship && state.assess.citizenship !== 'skip' ? state.assess.citizenship : null;
  const blocked = passport && route.blockedCitizenships?.codes.includes(passport) ? route.blockedCitizenships : null;
  const residence = state.assess.residence && state.assess.residence !== 'skip' ? (state.assess.residence as Residence) : null;
  const home = residence ? HOME_CURRENCY[residence] : null;
  const moneyAlt = altCurrency(state);

  const name = pick(route.name);
  const fact = pick(route.fact);
  const agency = pick(route.agency);
  const checkable = route.criteria.filter((c) => c.scoreable);
  const authority = route.criteria.filter((c) => !c.scoreable);
  // Every source keeps its own line and date: several figures can come from different pages of one site (Migri).
  const seen = new Set<string>();
  const sources = route.sources.filter((s) => (seen.has(s.url) ? false : (seen.add(s.url), true)));
  // A paused or closed route carries no offer: no CTA, no checklist (trust rules).
  const runnable = (route.status === 'open' || route.status === 'limited') && !blocked;
  const calculator = !!extras.funds?.length && runnable;
  // The same engine as Results and the match card. Shown only when it scores this route: a finished assessment,
  // a route open to this passport, and at least one condition answered (pct is null otherwise).
  const found = state.assessAt && !blocked ? match(route, toProfile(state.assess), toUsdExact) : null;
  const scored = found && found.pct !== null ? found : null;
  const statuses = scored ? statusByKey(scored.results) : null;

  const toggle = (k: ChapterKey) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  /** Scroll to the conditions once they are laid out, and move a screen reader there too. */
  const reachConditions = () => {
    const node = conditions.current;
    const sv = scroll.current;
    // getInnerViewRef is on every ScrollView at runtime but missing from the legacy typings; Fabric's measureLayout
    // takes a host ref, never the node number getInnerViewNode returns.
    const inner = (sv as unknown as { getInnerViewRef?: () => View | null } | null)?.getInnerViewRef?.();
    if (!node || !sv || !inner) return;
    seeking.current = false;
    node.measureLayout(
      inner,
      (_x, y) => {
        sv.scrollTo({ y: Math.max(0, y - space.s4), animated: reduce === false });
        if (conditionsHead.current) AccessibilityInfo.sendAccessibilityEvent(conditionsHead.current, 'focus');
      },
      () => {},
    );
  };
  const seekConditions = () => {
    if (open.rules) return reachConditions();
    seeking.current = true;
    setOpen((o) => ({ ...o, rules: true }));
  };

  const quiz = runnable && !!extras.quiz?.length;
  const docs = runnable && !!extras.documents?.length;
  const team = calculator && !!extras.funds;
  const officialMoney = route.money.length > 0 && !calculator;
  const timeFees = !!route.processing || !!route.fees?.length;
  const sub = (keys: (string | false)[]) =>
    upFirst(
      keys
        .filter((k): k is string => !!k)
        .map((k) => t(`route2.parts.${k}`))
        .join(t('route2.sep')),
      locale,
    );
  const doSub = sub([quiz && 'quiz', docs && 'documents', team && 'teamMoney']);
  const rulesSub = sub([checkable.length > 0 && 'conditions', authority.length > 0 && 'authority', officialMoney && 'money', timeFees && 'timeFees', 'pr']);
  const afterSub = sub([!!extras.realities?.length && 'realities', !!extras.timeline && 'citizenship', 'country']);

  return (
    <Screen edges={[]} scrollRef={scroll}>
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
      {blocked ? <Banner text={t('road.notForYou', { reason: pick(blocked.reason).text })} /> : null}

      {scored ? (
        <StatusTally
          counts={tally(scored.results)}
          coverage={t('assess2.coverage', { n: count(scored.coverage.scored), total: count(scored.coverage.of) })}
          onPress={seekConditions}
        />
      ) : null}

      {runnable && extras.steps ? <YourRoad routeKey={route.key} steps={extras.steps} authority={route.agency} /> : null}

      <View style={{ borderBottomWidth: 1, borderBottomColor: col.rule }}>
        {doSub ? (
          <Chapter title={t('route2.chapters.do')} sub={doSub} open={open.do} onToggle={() => toggle('do')}>
            {quiz && extras.quiz ? <CheckWhatYouKnow routeKey={route.key} questions={extras.quiz.length} onQuiz={() => router.push(`/(tabs)/countries/quiz/${route.key}`)} /> : null}
            {docs && extras.documents ? <Documents routeKey={route.key} docs={extras.documents} /> : null}
            {/* Paused, closed or passport-blocked routes show the official figures only, no calculator (Farjad, 27-28 Oct 2026). */}
            {team && extras.funds ? <TeamMoney funds={extras.funds} authority={route.agency} home={home} onAbout={about} founderRange={extras.founders} /> : null}
          </Chapter>
        ) : null}

        <Chapter title={t('route2.chapters.rules')} sub={rulesSub} open={open.rules} onToggle={() => toggle('rules')}>
          {checkable.length ? (
            <View ref={conditions} onLayout={() => (seeking.current ? reachConditions() : undefined)}>
              <View ref={conditionsHead} accessible accessibilityRole="header">
                <Label>{t('route2.checkable')}</Label>
              </View>
              <Ruled>{checkable.map((c) => <CriterionRow key={c.key} c={c} status={statuses?.get(c.key)} />)}</Ruled>
            </View>
          ) : null}
          {authority.length ? (
            <View>
              <Label>{t('route2.authority')}</Label>
              <Ruled>{authority.map((c) => <CriterionRow key={c.key} c={c} />)}</Ruled>
            </View>
          ) : null}

          {officialMoney ? (
            <View>
              <Label>{t('route2.money')}</Label>
              <Ruled>{route.money.map((m) => <MoneyRow key={m.key} m={m} />)}</Ruled>
              {moneyAlt && route.money.some((m) => m.currency !== moneyAlt) ? (
                <T variant="caption" tone="fgMuted" style={{ marginTop: space.s2 }}>
                  {`${t('funds.rates', { date: date(FX.date) })}${FX_OLD ? ` ${t('funds.usdOld')}` : ''}`}
                </T>
              ) : null}
              <T variant="caption" tone="fgMuted" style={{ marginTop: space.s2 }}>
                {t('funds.notApproval')}
              </T>
            </View>
          ) : null}

          {timeFees ? (
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
        </Chapter>

        <Chapter title={t('route2.chapters.after')} sub={afterSub} open={open.after} onToggle={() => toggle('after')}>
          {extras.realities ? <Realities items={extras.realities} /> : null}
          {extras.timeline ? <ToCitizenship timeline={extras.timeline} /> : null}
          <Ruled>
            <LinkRow icon="globe" label={t('road.aboutCountry', { country: pick(COUNTRY_NAMES[route.country as Country]).text })} onPress={() => router.push(`/(tabs)/countries/country/${route.country}`)} />
          </Ruled>
        </Chapter>
      </View>

      {runnable ? <Button kind="secondary" label={t('route2.talk')} onPress={() => router.navigate('/(tabs)/me/mentor')} /> : null}
      {sources.map((s) => (
        <SourceLine key={s.url} url={s.url} updated={s.checked} onOpen={() => openedSource(route.key)} />
      ))}
      <Disclaimer onAbout={() => router.navigate('/(tabs)/me/about')} />
    </Screen>
  );
}
