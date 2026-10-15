import { useFonts } from 'expo-font';
import { LocaleProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { I18nManager, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nProvider, applyDirectionAndRestart, deviceLocale, directionRestartJustTried, syncAppLanguage } from '@/i18n/I18nProvider';
import { LOCALES } from '@/i18n/locales';
import { StoreProvider, useStore } from '@/state/store';
import { FONT_ASSETS } from '@/theme/fonts';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Shell() {
  const { state, hydrated, persistNow } = useStore();
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
  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(c.bg).catch(() => {});
  }, [c.bg]);

  if (!ready) return null;
  return (
    <View style={{ flex: 1, direction: rtl ? 'rtl' : 'ltr' }}>
      <StatusBar style={mode === 'night' ? 'light' : 'dark'} />
      {/* Native headers take the chosen direction too, not only the one iOS launched with. */}
      <LocaleProvider direction={rtl ? 'rtl' : 'ltr'}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: c.bg },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="pathfinder" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
        </Stack>
      </LocaleProvider>
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
