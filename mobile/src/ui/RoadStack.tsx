// Home's road stack (B1 "photo stack", Farjad 28 Oct 2026; auditor build spec):
// one photo card per followed road, in follow order (never ranked). A runnable
// road shows its done count and a rail of its steps; a paused or closed road
// shows its status only; a road shut to the passport is a short ink card with
// no progress and no offer. Text sits on a flat ink scrim (6:1 on a white
// pixel), never on the soft part of it. Motion plays once per app session.
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { routeV2, type RouteV2 } from '@shared/routes-v2';
import { extrasOf } from '@shared/routes-v2/extras';
import { COUNTRY_HERO, COUNTRY_NAMES, PATH_PHOTO, ROUTES, type Country, type Photo } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { V1_TO_V2 } from '@/state/migrate';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { motion, raw_acid, raw_ink, raw_paper, space } from '@/theme/tokens';
import { Flag } from '@/ui/Flag';
import { Icon } from '@/ui/Icon';
import { useReduceMotion } from '@/ui/kit';
import { T } from '@/ui/T';

const CARD = 216;
const SHUT = 96;
// Flat ink under every glyph: 0.72 gives 6.04:1 for paper over a white pixel; 0.65 is the floor (auditor §3).
const SCRIM_TOP = 0.72;
const SCRIM_BOTTOM = 0.85;
const FADE = 48;
const ease = Easing.bezier(...motion.ease);
// The reveal plays on the first Home mount of a session only, not on every return to the tab.
let played = false;

/** The road's own photo, unless it is the generic path; then the country's; else none (ink cover). */
function photoOf(route: RouteV2): Photo | null {
  const v1 = (Object.keys(V1_TO_V2) as (keyof typeof V1_TO_V2)[]).find((k) => V1_TO_V2[k] === route.key);
  const own = v1 && v1 in ROUTES ? ROUTES[v1 as keyof typeof ROUTES].photo : null;
  if (own && own.source !== PATH_PHOTO) return own;
  return COUNTRY_HERO[route.country as Country];
}

function CountryTag({ country, extra }: { country: Country; extra?: string }) {
  const { pick, meta } = useI18n();
  const latin = meta.script === 'latin';
  const plate = { backgroundColor: raw_ink, paddingHorizontal: 6, paddingVertical: 2, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6 };
  const caps = latin ? { textTransform: 'uppercase' as const, letterSpacing: 0.7 } : undefined;
  return (
    <View style={{ flexDirection: 'row', gap: space.s2, alignSelf: 'flex-start' }}>
      <View style={plate}>
        <Flag country={country} width={14} />
        <T variant="caption" weight="bold" tone="photoPlateFg" style={caps}>
          {pick(COUNTRY_NAMES[country]).text}
        </T>
      </View>
      {extra ? (
        <View style={plate}>
          <T variant="caption" weight="bold" tone="photoPlateFg">
            {extra}
          </T>
        </View>
      ) : null}
    </View>
  );
}

/** No photo for this country yet: an ink cover with the name set large and faint, never a faded flag. */
function Cover({ country }: { country: Country }) {
  const { pick } = useI18n();
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: raw_ink, overflow: 'hidden' }]} accessible={false} importantForAccessibility="no-hide-descendants">
      {/* Set high, under the tag, so it never sits behind the route name. */}
      <T variant="display-xl" tone="photoPlateFg" numberOfLines={1} style={{ position: 'absolute', top: 34, start: space.s4, fontSize: 72, lineHeight: 84, opacity: 0.08, width: 900 }}>
        {pick(COUNTRY_NAMES[country]).text}
      </T>
    </View>
  );
}

/** Clear photo above, a short fade, then flat ink from the top of the text block down: text never sits on the soft part. */
function Scrim({ width, height, textTop }: { width: number; height: number; textTop: number }) {
  const top = Math.max(0, Math.min(textTop, height));
  const start = Math.max(0, top - FADE);
  const span = Math.max(1, height - start);
  const knee = ((top - start) / span).toFixed(3);
  return (
    // Overdrawn by 2pt each side (the card clips it): an exact fit left a 1px unscrimmed sliver at the card edge. Symmetric, so direction-neutral.
    <Svg style={{ position: 'absolute', top: 0, left: -2 }} width={Math.ceil(width) + 4} height={Math.ceil(height) + 2} pointerEvents="none">
      <Defs>
        <LinearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={raw_ink} stopOpacity="0" />
          <Stop offset={knee} stopColor={raw_ink} stopOpacity={String(SCRIM_TOP)} />
          <Stop offset="1" stopColor={raw_ink} stopOpacity={String(SCRIM_BOTTOM)} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={start} width={Math.ceil(width) + 4} height={span + 2} fill="url(#scrim)" />
    </Svg>
  );
}

/** One segment per step, in step order from the start edge. Done fills from the start edge; the current one is taller. */
function Rail({ total, nowAt, animate, delay }: { total: number; nowAt: number; animate: boolean; delay: number }) {
  const fill = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!animate) return;
    Animated.sequence([
      Animated.delay(delay + 150),
      Animated.timing(fill, { toValue: 1, duration: motion.step, easing: ease, useNativeDriver: false }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 0.4, duration: 300, easing: ease, useNativeDriver: false }),
          Animated.timing(pulse, { toValue: 1, duration: 300, easing: ease, useNativeDriver: false }),
        ]),
        { iterations: 2 },
      ),
    ]).start();
  }, [animate, delay, fill, pulse]);
  const width = fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants" style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 8 }}>
      {Array.from({ length: total }, (_, i) =>
        i === nowAt ? (
          <Animated.View key={i} style={{ flex: 1, height: 8, backgroundColor: raw_acid, opacity: pulse }} />
        ) : (
          <View key={i} style={{ flex: 1, height: 4, backgroundColor: 'rgba(242,240,233,0.4)', flexDirection: 'row' }}>
            {i < nowAt ? <Animated.View style={{ width, height: 4, backgroundColor: raw_paper }} /> : null}
          </View>
        ),
      )}
    </View>
  );
}

function RoadCard({ route, index, animate, shut }: { route: RouteV2; index: number; animate: boolean; shut: boolean }) {
  const { t, pick, count } = useI18n();
  const { state } = useStore();
  const { mode, c } = useTheme();
  // Ink on night is 1.1:1: a hairline keeps the shut and cover cards reading as cards.
  const edge = mode === 'night' ? { borderWidth: 1, borderColor: c.rule } : null;
  const country = route.country as Country;
  const name = pick(route.name);
  const countryName = pick(COUNTRY_NAMES[country]).text;
  const delay = Math.min(index, 3) * 80;
  const shown = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const [box, setBox] = useState({ w: 0, h: shut ? SHUT : CARD });
  const [textTop, setTextTop] = useState(CARD * 0.5);
  useEffect(() => {
    if (animate) Animated.timing(shown, { toValue: 1, duration: motion.reveal, delay, easing: ease, useNativeDriver: true }).start();
  }, [animate, delay, shown]);
  const lift = shown.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });
  const open = () => router.push(`/(tabs)/countries/route/${route.key}`);

  const steps = extrasOf(route.key)?.steps ?? [];
  const done = new Set((state.journey[route.key] ?? []).filter((k) => steps.some((s) => s.key === k)));
  const nowKey = steps.find((s) => !done.has(s.key))?.key;
  // Drawn by position, counted by ticks: the same figures the route page shows.
  const nowAt = nowKey ? steps.findIndex((s) => s.key === nowKey) : steps.length;
  const runnable = !shut && (route.status === 'open' || route.status === 'limited') && steps.length > 0;
  const status = route.status !== 'open' ? t(`route2.statusShort.${route.status}`) : undefined;

  if (shut) {
    return (
      <Animated.View style={{ opacity: shown, transform: [{ translateY: lift }] }}>
        <Pressable
          onPress={open}
          accessibilityRole="button"
          accessibilityLabel={`${name.text}, ${countryName}. ${t('follow.notForPassport')}`}
          accessibilityHint={t('home.opensRoad')}
          style={({ pressed }) => ({ minHeight: SHUT, backgroundColor: raw_ink, padding: space.s4, gap: space.s2, opacity: pressed ? 0.85 : 1, ...edge })}
        >
          <CountryTag country={country} />
          <T variant="display-m" tone="photoPlateFg" lang={name.lang}>
            {name.text}
          </T>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2 }}>
            <Icon name="alert" size={16} color={raw_paper} />
            <T variant="caption" tone="photoPlateFg">
              {t('follow.notForPassport')}
            </T>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  const photo = photoOf(route);
  const fraction = t('home.fraction', { done: '\u0000', total: count(steps.length) });
  const [before, after] = fraction.split('\u0000');
  const a11y = !runnable
    ? [name.text, countryName, status].filter(Boolean).join(', ')
    : (nowKey ? t('home.roadA11y', { route: name.text, country: countryName, done: count(done.size), total: count(steps.length) }) : t('home.roadA11yAll', { route: name.text, country: countryName, total: count(steps.length) })) + (route.status === 'limited' && status ? ` ${status}.` : '');
  return (
    <Animated.View style={{ opacity: shown, transform: [{ translateY: lift }] }}>
      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={a11y}
        accessibilityHint={t('home.opensRoad')}
        onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
        style={({ pressed }) => ({ minHeight: CARD, justifyContent: 'space-between', padding: space.s4, gap: space.s3, overflow: 'hidden', backgroundColor: raw_ink, opacity: pressed ? 0.85 : 1, ...(photo ? null : edge) })}
      >
        {photo ? <Image source={photo.source} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} /> : <Cover country={country} />}
        {box.w ? <Scrim width={box.w} height={box.h} textTop={textTop} /> : null}
        <CountryTag country={country} extra={route.status === 'limited' ? status : undefined} />
        <View onLayout={(e) => setTextTop(e.nativeEvent.layout.y - space.s2)} style={{ gap: space.s2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: space.s3 }}>
            <T variant="display-m" tone="photoPlateFg" lang={name.lang} style={{ flex: 1, flexShrink: 1 }}>
              {name.text}
            </T>
            {runnable ? (
              <View style={{ alignItems: 'flex-end' }}>
                <T variant="display-m" tone="photoPlateFg">
                  {before}
                  {count(done.size)}
                  <T variant="caption" weight="bold" tone="photoPlateFg">
                    {after}
                  </T>
                </T>
                <T variant="caption" tone="photoPlateFg">
                  {t('home.stepsWord')}
                </T>
              </View>
            ) : status ? (
              <View style={{ backgroundColor: raw_ink, paddingHorizontal: 6, paddingVertical: 2 }}>
                <T variant="caption" weight="bold" tone="photoPlateFg">
                  {status}
                </T>
              </View>
            ) : null}
          </View>
          {runnable ? <Rail total={steps.length} nowAt={nowAt} animate={animate} delay={delay} /> : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function RoadStack() {
  const { state } = useStore();
  const reduce = useReduceMotion();
  const [animate] = useState(() => !played);
  useEffect(() => {
    played = true;
  }, []);
  const passport = state.assess.citizenship && state.assess.citizenship !== 'skip' ? state.assess.citizenship : null;
  const routes = state.following.map((k) => routeV2(k)).filter((r) => !!r);
  // Wait for the Reduce Motion answer so nothing starts and then jumps.
  if (!routes.length || reduce === null) return null;
  return (
    <View style={{ gap: space.s3 }}>
      {routes.map((r, i) => (
        <RoadCard key={r.key} route={r} index={i} animate={animate && !reduce} shut={!!passport && !!r.blockedCitizenships?.codes.includes(passport)} />
      ))}
    </View>
  );
}
