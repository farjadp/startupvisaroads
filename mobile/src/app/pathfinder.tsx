// Seven questions, one per screen, in a full-screen modal (spec 2, 6, 14).
// No auto-advance; Next is disabled until a choice; "rather not say" counts;
// answers persist so a closed pathfinder can be resumed.
import { router, useNavigation } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AccessibilityInfo, BackHandler, Platform, Pressable, View, findNodeHandle, type Text as RNText } from 'react-native';
import { outcomeFor } from '@/engine/road';
import { QUIZ_KEYS, type QuizKey } from '@/engine/readiness';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space, size } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Button, RadioRow, Ruled, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

// 44 pt on iOS, 48 dp on Android (HIG / Material 3).
const HIT = Platform.OS === 'android' ? size.touchMinAndroid : size.touchMin;

const OPTIONS: Record<QuizKey, string[]> = {
  goal: ['residency', 'growth', 'family'],
  team: ['solo', 'team'],
  business: ['none', 'idea', 'mvp', 'revenue'],
  language: ['low', 'mid', 'high'],
  capital: ['under50', '50to200', '200to500', 'over500'],
  background: ['none', 'professional', 'research'],
  horizon: ['urgent', 'medium', 'long'],
};

export default function Pathfinder() {
  const { state, set, answer } = useStore();
  const { t, count } = useI18n();
  const { c } = useTheme();
  const step = Math.min(state.step, QUIZ_KEYS.length - 1);
  const key = QUIZ_KEYS[step];
  const value = state.answers[key];
  const last = step === QUIZ_KEYS.length - 1;
  const headingRef = useRef<RNText>(null);

  // Focus moves to each new question (spec 21).
  useEffect(() => {
    const node = headingRef.current ? findNodeHandle(headingRef.current) : null;
    if (node) AccessibilityInfo.setAccessibilityFocus(node);
  }, [step]);

  // Opened from a link there may be nothing under the modal: close to Roads then.
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)/home'));
  const back = () => (step === 0 ? close() : set({ step: step - 1 }));

  // Android Back steps to the previous question, then closes (spec 2).
  const nav = useNavigation();
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      back();
      return true;
    });
    return () => sub.remove();
  }, [step, nav]);

  const next = () => {
    if (!last) return set({ step: step + 1 });
    const { outcome } = outcomeFor(state.answers);
    set({ outcome, step: 0 });
    if (router.canGoBack()) router.back();
    router.navigate('/(tabs)/home');
  };

  const hint = t(`pathfinder.hint.${key}`);
  return (
    <Screen
      footer={<Button label={last ? t('pathfinder.finish') : t('common.next')} onPress={next} disabled={value === undefined} />}
    >
      <View style={{ gap: space.s3 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={back} accessibilityRole="button" accessibilityLabel={t('common.back')} hitSlop={8} style={{ width: HIT, height: HIT, justifyContent: 'center', marginStart: -space.s3, alignItems: 'center' }}>
            <View style={{ transform: [{ scaleX: -1 }] }}>
              <Icon name="chevron" />
            </View>
          </Pressable>
          <T variant="label" tone="fgMuted">
            {t('pathfinder.progress', { n: count(step + 1), total: count(QUIZ_KEYS.length) })}
          </T>
          <Pressable onPress={close} accessibilityRole="button" accessibilityLabel={t('common.close')} hitSlop={8} style={{ minWidth: HIT, height: HIT, justifyContent: 'center', alignItems: 'flex-end' }}>
            <T variant="row" weight="bold">
              {t('common.close')}
            </T>
          </Pressable>
        </View>
        <View accessible={false} importantForAccessibility="no-hide-descendants" style={{ flexDirection: 'row', gap: 4 }}>
          {QUIZ_KEYS.map((k, i) => (
            <View key={k} style={{ flex: 1, height: 3, backgroundColor: i <= step ? c.indicator : c.rule }} />
          ))}
        </View>
      </View>
      <View style={{ gap: space.s3 }}>
        <T ref={headingRef} variant="display-m" accessibilityRole="header">
          {t(`pathfinder.q.${key}`)}
        </T>
        {hint ? (
          <T variant="body" tone="fgMuted">
            {hint}
          </T>
        ) : null}
      </View>
      <View accessibilityRole="radiogroup">
        <Ruled>
          {OPTIONS[key].map((o) => (
            <RadioRow key={o} label={t(`pathfinder.o.${key}.${o}`)} selected={value === o} onPress={() => answer(key, o)} />
          ))}
          <RadioRow label={t('pathfinder.skip')} selected={value === 'skip'} onPress={() => answer(key, 'skip')} muted />
        </Ruled>
      </View>
    </Screen>
  );
}
