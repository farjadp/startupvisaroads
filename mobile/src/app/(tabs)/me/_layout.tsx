import { Stack } from 'expo-router';
import { useI18n } from '@/i18n/I18nProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { stackOptions } from '@/ui/stackOptions';

// A screen reached by a link or from another tab still has its tab root under it, so Back always works.
export const unstable_settings = { initialRouteName: 'index' };

export default function MeStack() {
  const { c } = useTheme();
  const { meta, t } = useI18n();
  return (
    <Stack screenOptions={stackOptions(c, meta.script)}>
      <Stack.Screen name="index" options={{ headerShown: false, title: t('tabs.me') }} />
      <Stack.Screen name="settings" options={{ title: t('settings.title') }} />
      <Stack.Screen name="mentor" options={{ title: t('mentor.title') }} />
      <Stack.Screen name="about" options={{ title: t('about.title') }} />
      <Stack.Screen name="credits" options={{ title: t('credits.title') }} />
    </Stack>
  );
}
