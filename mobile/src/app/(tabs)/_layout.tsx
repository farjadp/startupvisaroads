// The platform's own tab bar: UITabBarController on iOS, the Material 3
// navigation bar on Android, each with its native icon set (SF Symbols /
// Material Symbols). The brand only sets colour: selection is marked with
// the indicator role (ink in paper, acid in night), never acid on paper.
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';
import { useI18n } from '@/i18n/I18nProvider';
import { useTheme } from '@/theme/ThemeProvider';

export default function TabsLayout() {
  const { t, meta } = useI18n();
  const { c, mode } = useTheme();
  return (
    <NativeTabs
      backgroundColor={c.bg}
      tintColor={c.fg}
      // iOS marks the selected tab by tint; Android draws the icon on the indicator pill, so it takes the pill's contrast colour.
      iconColor={{ default: c.fgMuted, selected: Platform.OS === 'android' ? (mode === 'night' ? c.bg : c.buttonFg) : c.fg }}
      labelStyle={{ default: { color: c.fgMuted }, selected: { color: c.fg } }}
      indicatorColor={c.indicator}
      rippleColor={c.rowPressed}
      labelVisibilityMode="labeled"
      minimizeBehavior="never"
      // The tab bar follows the chosen language at once, not only after the next cold launch.
      unstable_nativeProps={{ direction: meta.rtl ? 'rtl' : 'ltr' }}
    >
      <NativeTabs.Trigger name="roads">
        <NativeTabs.Trigger.Label>{t('tabs.roads')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'signpost.right', selected: 'signpost.right.fill' }} md="alt_route" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tools">
        <NativeTabs.Trigger.Label>{t('tabs.tools')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'function', selected: 'function' }} md="calculate" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="news">
        <NativeTabs.Trigger.Label>{t('tabs.news')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'newspaper', selected: 'newspaper.fill' }} md="newspaper" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="me">
        <NativeTabs.Trigger.Label>{t('tabs.me')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'person', selected: 'person.fill' }} md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
