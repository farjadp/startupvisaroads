// A bottom sheet on React Native's Modal (spec 2026-11-09 §1; no new
// dependency). Square corners like every other surface (radius.none), a 1.5 pt
// ink top rule, a drag handle, a title the screen reader lands on, a visible
// Done button, and a body that scrolls inside 85 % of the window. Closes on
// Done, backdrop, Android Back, the iOS accessibility escape gesture and a
// swipe down of 60 pt or more (a shortcut, never the only way).
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Modal, PanResponder, Platform, Pressable, ScrollView, View, findNodeHandle, useWindowDimensions, type Text as RNText } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '@/i18n/I18nProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { motion, space } from '@/theme/tokens';
import { Button, useReduceMotion } from './kit';
import { T } from './T';

/** The dim behind the card (spec §1). design/tokens.json has no scrim role yet; this is the one value outside it. */
const SCRIM = 'rgba(0, 0, 0, 0.45)';
const SWIPE_TO_CLOSE = 60;

export function Sheet({
  open,
  onClose,
  onDismissed,
  title,
  sub,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  /** Fired once the modal has fully left the screen (iOS: Modal onDismiss; Android: after the close). */
  onDismissed?: () => void;
  title: string;
  sub?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { c } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const reduce = useReduceMotion();
  const titleRef = useRef<RNText>(null);
  const drag = useMemo(() => new Animated.Value(0), []);

  // Android has no onDismiss: the close itself is the dismissal.
  const wasOpen = useRef(open);
  useEffect(() => {
    if (wasOpen.current && !open && Platform.OS !== 'ios') onDismissed?.();
    wasOpen.current = open;
  }, [open, onDismissed]);

  const focusTitle = () => {
    const node = titleRef.current ? findNodeHandle(titleRef.current) : null;
    if (node) AccessibilityInfo.setAccessibilityFocus(node);
  };

  const pan = useMemo(
    () =>
      PanResponder.create({
        // The header (handle and title) takes the touch from the start; the Done button still wins its own taps.
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) => g.dy > 4 && Math.abs(g.dy) > Math.abs(g.dx),
        onPanResponderMove: (_, g) => drag.setValue(Math.max(0, g.dy)),
        onPanResponderRelease: (_, g) => {
          if (g.dy >= SWIPE_TO_CLOSE) {
            drag.setValue(0);
            onClose();
          } else if (reduce) {
            drag.setValue(0);
          } else {
            Animated.timing(drag, { toValue: 0, duration: motion.state, useNativeDriver: true }).start();
          }
        },
        onPanResponderTerminate: () => drag.setValue(0),
      }),
    [drag, onClose, reduce],
  );

  return (
    <Modal visible={open} transparent statusBarTranslucent animationType={reduce ? 'fade' : 'slide'} onRequestClose={onClose} onShow={focusTitle} onDismiss={onDismissed} supportedOrientations={['portrait', 'landscape']}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: SCRIM }}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('common.close')} onPress={onClose} style={{ flex: 1 }} />
        <Animated.View
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
          style={{ maxHeight: height * 0.85, backgroundColor: c.bg, borderTopWidth: 1.5, borderTopColor: c.fg, transform: [{ translateY: drag }] }}
        >
          <View {...pan.panHandlers} style={{ paddingHorizontal: space.s6, paddingTop: space.s2, gap: space.s2 }}>
            <View accessible={false} importantForAccessibility="no-hide-descendants" style={{ alignSelf: 'center', width: 36, height: 4, backgroundColor: c.rule }} />
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space.s3 }}>
              <View style={{ flex: 1, gap: space.s1, paddingTop: space.s2 }}>
                <T ref={titleRef} variant="label" tone="fgMuted" accessibilityRole="header">
                  {title}
                </T>
                {sub ? (
                  <T variant="caption" tone="fgMuted">
                    {sub}
                  </T>
                ) : null}
              </View>
              <Button kind="link" icon={null} label={t('common.done')} onPress={onClose} />
            </View>
          </View>
          <ScrollView bounces={false} contentContainerStyle={{ paddingHorizontal: space.s6, paddingTop: space.s2, paddingBottom: Math.max(insets.bottom, space.s4) + space.s2, gap: space.s3 }}>
            {children}
            {footer}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
