// The platform's own tab bar: UITabBarController on iOS, the Material 3
// navigation bar on Android, each with its native icon set (SF Symbols /
// Material Symbols). The brand only sets colour: selection is marked with
// the indicator role (ink in paper, acid in night), never acid on paper.
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform, PlatformColor } from 'react-native';
import { useI18n } from '@/i18n/I18nProvider';
import { useTheme } from '@/theme/ThemeProvider';

export default function TabsLayout() {
  const { t, meta } = useI18n();
  const { c, mode } = useTheme();
  return (
    <NativeTabs
      backgroundColor={c.bg}
      // iOS: the system label colour, which the glass flips with what is under it (ink on light, paper on dark).
      tintColor={Platform.OS === 'ios' ? PlatformColor('label') : c.fg}
      // iOS marks the selected tab by tint; Android draws the icon on the indicator pill, so it takes the pill's contrast colour.
      // iOS 26 Liquid Glass turns light over photos (the Countries grid): fixed night colours there fall
      // below 3:1, so iOS keeps the glass's own adaptive colours and only takes the tint (HIG; WCAG 1.4.3).
      iconColor={Platform.OS === 'android' ? { default: c.fgMuted, selected: mode === 'night' ? c.bg : c.buttonFg } : undefined}
      labelStyle={Platform.OS === 'android' ? { default: { color: c.fgMuted }, selected: { color: c.fg } } : undefined}
      indicatorColor={c.indicator}
      rippleColor={c.rowPressed}
      labelVisibilityMode="labeled"
      minimizeBehavior="never"
      // The tab bar follows the chosen language at once, not only after the next cold launch.
      unstable_nativeProps={{ direction: meta.rtl ? 'rtl' : 'ltr' }}
    >
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>{t('tabs.home')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="countries">
        <NativeTabs.Trigger.Label>{t('tabs.countries')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'globe.europe.africa', selected: 'globe.europe.africa.fill' }} md="public" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="assess">
        <NativeTabs.Trigger.Label>{t('tabs.assess')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'checklist', selected: 'checklist' }} md="checklist" />
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
