import { Stack } from 'expo-router';
import { useI18n } from '@/i18n/I18nProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { stackOptions } from '@/ui/stackOptions';

// A screen reached by a link or from another tab still has its tab root under it, so Back always works.
export const unstable_settings = { initialRouteName: 'index' };

export default function AssessStack() {
  const { c } = useTheme();
  const { meta, t } = useI18n();
  return (
    <Stack screenOptions={stackOptions(c, meta.script)}>
      <Stack.Screen name="index" options={{ headerShown: false, title: t('tabs.assess') }} />
      <Stack.Screen name="result" options={{ title: t('assess.result') }} />
      <Stack.Screen name="funds" options={{ title: t('funds.title') }} />
      <Stack.Screen name="check" options={{ title: t('check.title') }} />
    </Stack>
  );
}
