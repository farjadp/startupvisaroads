// Road quiz (spec 2026-10-27 road map): one question at a time, Check, then
// the answer with its reason, then Next. Options shuffle each attempt. Wrong
// is "Not this one", never "Wrong"; right and wrong carry an icon and a word,
// never colour alone. No timer, no confetti. Leaving drops the attempt; the
// best score is kept. Answers come from the route's official data only.
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Platform, View, findNodeHandle, type Text as RNText } from 'react-native';
import { routeV2 } from '@shared/routes-v2';
import { extrasOf } from '@shared/routes-v2/extras';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { space } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Button, Disclaimer, Heading, Progress, RadioRow, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

function shuffled(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** iOS sheet: a Close button at the top start (HIG); Android keeps its Back. */
function useHeader(title: string) {
  const { t } = useI18n();
  return {
    title,
    headerLeft: Platform.OS === 'ios' ? () => <Button kind="link" label={t('assess2.close')} onPress={() => router.back()} /> : undefined,
  };
}

export default function Quiz() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const { t, pick, count } = useI18n();
  const { state, set } = useStore();
  const header = useHeader(t('quiz.title'));
  const route = routeV2(String(key));
  const quiz = extrasOf(String(key))?.quiz ?? [];
  const [attempt, setAttempt] = useState(0);
  const orders = useMemo(() => quiz.map((q) => shuffled(q.options.length)), [quiz, attempt]);
  const [i, setI] = useState(0);
  // After Next, screen-reader focus moves to the new question (WCAG 2.4.3), not the button's old spot.
  const questionRef = useRef<RNText>(null);
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) return;
    const node = questionRef.current && findNodeHandle(questionRef.current);
    if (node) AccessibilityInfo.setAccessibilityFocus(node);
  }, [i]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [right, setRight] = useState(0);
  const [error, setError] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!route || !quiz.length) return null;
  const q = quiz[i];
  const best = state.quizBest[route.key];

  const check = () => {
    if (chosen === null) {
      setError(true);
      return;
    }
    const ok = chosen === q.answer;
    if (ok) setRight(right + 1);
    setChecked(true);
    AccessibilityInfo.announceForAccessibility(`${ok ? t('quiz.right') : t('quiz.notThis')}. ${pick(q.why).text}`);
  };

  const next = () => {
    if (i + 1 < quiz.length) {
      moved.current = true;
      setI(i + 1);
      setChosen(null);
      setChecked(false);
      return;
    }
    if (!best || right > best.right) set({ quizBest: { ...state.quizBest, [route.key]: { right, of: quiz.length } } });
    setFinished(true);
  };

  const again = () => {
    setAttempt(attempt + 1);
    setI(0);
    setChosen(null);
    setChecked(false);
    setRight(0);
    setFinished(false);
  };

  const title = pick(route.name).text;

  if (finished) {
    const kept = Math.max(best?.right ?? 0, right);
    return (
      <Screen edges={[]}>
        <Stack.Screen options={header} />
        <T variant="label" tone="fgMuted">
          {title}
        </T>
        <Heading role="display-m">{t('quiz.result', { right: count(right), total: count(quiz.length) })}</Heading>
        <T variant="body" tone="fgMuted">
          {t('quiz.best', { right: count(kept), total: count(quiz.length) })}
        </T>
        {kept === quiz.length ? (
          <View accessible style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2 }}>
            <Icon name="check" />
            <T variant="row" weight="bold">
              {t('quiz.badge')}
            </T>
          </View>
        ) : null}
        <T variant="caption" tone="fgMuted">
          {t('quiz.notApproval')}
        </T>
        <Button kind="secondary" label={t('quiz.again')} onPress={again} />
        <Button kind="link" label={t('quiz.back')} onPress={() => router.back()} />
        {/* The iOS sheet covers the tabs: close it first, or the About page opens unseen underneath. */}
        <Disclaimer
          onAbout={() => {
            router.back();
            router.navigate('/(tabs)/me/about');
          }}
        />
      </Screen>
    );
  }

  const correct = chosen === q.answer;
  const qText = pick(q.q);
  return (
    <Screen edges={[]}>
      <Stack.Screen options={header} />
      <T variant="label" tone="fgMuted">
        {/* Separate strings so T isolates the route's Latin name on its own (a joined " · " pulled the ")" into the isolate). */}
        {title}
        {' · '}
        {t('quiz.progress', { n: count(i + 1), total: count(quiz.length) })}
      </T>
      <Progress value={(i / quiz.length) * 100} />
      <T ref={questionRef} variant="headline" weight="bold" accessibilityRole="header" lang={qText.lang}>
        {qText.text}
      </T>
      <View accessibilityRole="radiogroup">
        {orders[i].map((o) => {
          const label = pick(q.options[o]);
          const mark = checked && (o === q.answer ? ` · ${t('quiz.right')}` : o === chosen ? ` · ${t('quiz.notThis')}` : '');
          return (
            <RadioRow
              key={o}
              label={`${label.text}${mark || ''}`}
              selected={chosen === o}
              muted={checked && o !== q.answer && o !== chosen}
              onPress={() => {
                if (checked) return;
                setChosen(o);
                setError(false);
              }}
            />
          );
        })}
      </View>
      {error ? (
        <T variant="caption" tone="error" accessibilityLiveRegion="polite">
          {t('quiz.pick')}
        </T>
      ) : null}
      {checked ? (
        <View accessible style={{ gap: space.s1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2 }}>
            <Icon name={correct ? 'check' : 'alert'} />
            <T variant="row" weight="bold">
              {correct ? t('quiz.right') : t('quiz.answerIs', { text: pick(q.options[q.answer]).text })}
            </T>
          </View>
          <T variant="body" lang={pick(q.why).lang}>
            {pick(q.why).text}
          </T>
        </View>
      ) : null}
      {checked ? (
        <Button label={i + 1 < quiz.length ? t('quiz.next') : t('quiz.finish')} onPress={next} />
      ) : (
        <Button label={t('quiz.check')} icon={null} onPress={check} />
      )}
    </Screen>
  );
}
