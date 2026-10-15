import { useFonts } from 'expo-font';
import { LocaleProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useCallback, useEffect, useState } from 'react';
import { I18nManager, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nProvider, applyDirectionAndRestart, deviceLocale, directionRestartJustTried, syncAppLanguage } from '@/i18n/I18nProvider';
import { LOCALES } from '@/i18n/locales';
import { StoreProvider, useStore } from '@/state/store';
import { FONT_ASSETS } from '@/theme/fonts';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { Intro } from '@/ui/Intro';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Shell() {
  const { state, hydrated, introSeenAtLaunch, persistNow, set } = useStore();
  const { mode, c } = useTheme();
  const [fontsLoaded, fontError] = useFonts(FONT_ASSETS);

  // The stored language decides layout direction. If the native layer
  // disagrees (first launch on an RTL device that chose English, or the
  // reverse), fix it once and restart before anything is shown.
  const locale = state.locale ?? deviceLocale();
  const rtl = LOCALES[locale].rtl;
  const directionWrong = hydrated && rtl !== I18nManager.isRTL;
  // A restart into this locale that did not take is not repeated (no loop);
  // the root view then lays out in the chosen direction anyway.
  const restartTried = directionWrong && directionRestartJustTried(locale);
  const restarting = directionWrong && !restartTried;
  useEffect(() => {
    // The one place a direction restart starts: the chosen language is written first, or the restart could come back in the old one.
    if (restarting) void persistNow().then(() => applyDirectionAndRestart(locale));
  }, [restarting, locale, persistNow]);

  // iOS draws its own chrome (tab bar, alerts) in the app's language: keep it the one chosen here.
  useEffect(() => {
    if (hydrated) syncAppLanguage(locale);
  }, [hydrated, locale]);

  const ready = hydrated && (fontsLoaded || !!fontError) && !restarting;
  // The ink intro covers the launch: it hides the native splash once it is on screen and
  // opens onto the app when the app is ready. The full motion plays once (1A); a restart
  // into a new direction never plays it again, because it is marked seen before that.
  const [introOn, setIntroOn] = useState(true);
  const introDone = useCallback(() => {
    setIntroOn(false);
    if (!state.introSeen) set({ introSeen: true });
  }, [state.introSeen, set]);
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(c.bg).catch(() => {});
  }, [c.bg]);

  // Until storage is read the native splash stays up: whether the intro plays depends on it.
  if (!hydrated || restarting) return null;
  return (
    <View style={{ flex: 1, direction: rtl ? 'rtl' : 'ltr', backgroundColor: c.bg }}>
      <StatusBar style={mode === 'night' ? 'light' : 'dark'} />
      {/* Screens mount once fonts are in, under the ink, so no text ever swaps face on screen.
          Native headers take the chosen direction too, not only the one iOS launched with. */}
      {ready ? (
        <LocaleProvider direction={rtl ? 'rtl' : 'ltr'}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: c.bg },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="language" options={{ gestureEnabled: false }} />
            <Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
            <Stack.Screen name="follow" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="pathfinder" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
          </Stack>
        </LocaleProvider>
      ) : null}
      {introOn ? <Intro full={!introSeenAtLaunch} ready={ready} onDone={introDone} /> : null}
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <ThemeProvider>
          <I18nProvider>
            <Shell />
          </I18nProvider>
        </ThemeProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
