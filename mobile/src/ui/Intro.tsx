// Opening motion (onboarding 1A). It sits above an app that is already
// mounting and never waits on the network. Its first frame is the native
// splash (plain ink), so hiding the splash shows no seam.
//
// First launch: the acid swoosh draws left to right, the plane lifts off,
// then the ink opens onto paper. About 1.2 s; a tap skips it.
// Later launches, and Reduce Motion: the ink only fades.
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Image, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { motion, raw_ink } from '@/theme/tokens';

const SWOOSH = require('../../assets/intro/swoosh.png');
const PLANE = require('../../assets/intro/plane.png');
// Both layers are cut from the app icon on the same 799 × 350 frame, so they stack in place.
const RATIO = 350 / 799;

const ease = Easing.bezier(...motion.ease);

export function Intro({ full, ready, onDone }: { full: boolean; ready: boolean; onDone: () => void }) {
  const { width } = useWindowDimensions();
  const markW = Math.min(width * 0.72, 340);
  const markH = markW * RATIO;

  const [cover] = useState(() => new Animated.Value(0)); // 0 → 1: the ink cover slides off the swoosh
  const [plane] = useState(() => new Animated.Value(0)); // 0 → 1: the plane appears
  const [lift] = useState(() => new Animated.Value(0)); // 0 → 1: the plane flies off
  const [fade] = useState(() => new Animated.Value(1)); // the whole ink layer

  const [laidOut, setLaidOut] = useState(false);
  const [played, setPlayed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);
  const finished = useRef(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => setReduceMotion(false));
  }, []);

  const animated = full && reduceMotion === false;
  // Without the full motion there is nothing to wait for but the app.
  const markDone = played || (reduceMotion !== null && !animated);

  // The overlay is on screen: the native splash can go.
  useEffect(() => {
    if (laidOut) SplashScreen.hideAsync().catch(() => {});
  }, [laidOut]);

  useEffect(() => {
    if (!laidOut || !animated) return;
    const d = { useNativeDriver: true, easing: ease };
    Animated.parallel([
      Animated.timing(cover, { toValue: 1, duration: 420, ...d }),
      Animated.sequence([
        Animated.delay(320),
        Animated.timing(plane, { toValue: 1, duration: 120, ...d }),
        Animated.delay(40),
        Animated.timing(lift, { toValue: 1, duration: 380, ...d }),
      ]),
    ]).start(() => setPlayed(true));
  }, [laidOut, animated, cover, plane, lift]);

  // Open onto the app once the mark has played and the app is ready to show.
  useEffect(() => {
    if (!markDone || !ready || finished.current) return;
    finished.current = true;
    Animated.timing(fade, { toValue: 0, duration: animated ? 300 : 150, easing: ease, useNativeDriver: true }).start(onDone);
  }, [markDone, ready, animated, fade, onDone]);

  const skip = () => {
    cover.stopAnimation();
    plane.stopAnimation();
    lift.stopAnimation();
    setPlayed(true);
  };

  return (
    <Animated.View
      onLayout={() => setLaidOut(true)}
      style={[StyleSheet.absoluteFill, { backgroundColor: raw_ink, opacity: fade, alignItems: 'center', justifyContent: 'center' }]}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <StatusBar style="light" />
      <Pressable onPress={skip} style={StyleSheet.absoluteFill} accessible={false} />
      {animated ? (
        // Physical coordinates on purpose: the mark is a picture and never mirrors.
        <View pointerEvents="none" style={{ width: markW, height: markH, direction: 'ltr' }}>
          <Image source={SWOOSH} style={{ position: 'absolute', left: 0, top: 0, width: markW, height: markH }} />
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: markW,
              height: markH,
              backgroundColor: raw_ink,
              transform: [{ translateX: cover.interpolate({ inputRange: [0, 1], outputRange: [0, markW] }) }],
            }}
          />
          <Animated.Image
            source={PLANE}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: markW,
              height: markH,
              opacity: Animated.multiply(plane, lift.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 1, 0] })),
              transform: [
                { translateX: lift.interpolate({ inputRange: [0, 1], outputRange: [0, markW * 0.16] }) },
                { translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -markW * 0.13] }) },
              ],
            }}
          />
        </View>
      ) : null}
    </Animated.View>
  );
}
