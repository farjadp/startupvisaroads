// Roads to follow (onboarding 3B): every road on one screen, grouped by
// country under its flag, each with its route-type icon. Optional and
// skippable. Followed roads lead the Roads tab and the News "My roads"
// filter; they are never a match, never ranked, never scored (trust rules).
// `next` says where to go after: into the app (pathfinder or browse), or
// back to Settings.
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { COUNTRY_NAMES, COUNTRY_ORDER, ROUTE_ORDER, ROUTE_TYPE, ROUTES, type RouteKey } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { Flag } from '@/ui/Flag';
import { Icon } from '@/ui/Icon';
import { Button, Heading, Screen } from '@/ui/kit';
import { stackOptions } from '@/ui/stackOptions';
import { T } from '@/ui/T';

type Next = 'pathfinder' | 'browse' | 'back';

function FollowRow({ route, checked, onToggle }: { route: RouteKey; checked: boolean; onToggle: () => void }) {
  const { c } = useTheme();
  const { t, pick } = useI18n();
  const name = pick(ROUTES[route].name);
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.s3,
        minHeight: 60,
        paddingVertical: space.s2,
        borderBottomWidth: 1,
        borderBottomColor: c.rule,
        backgroundColor: pressed ? c.rowPressed : 'transparent',
      })}
    >
      <Icon name={ROUTE_TYPE[route]} />
      <View style={{ flex: 1, gap: 2 }}>
        <T variant="row" weight="bold" lang={name.lang}>
          {name.text}
        </T>
        <T variant="caption" tone="fgMuted">
          {t(`follow.types.${ROUTE_TYPE[route]}`)}
        </T>
      </View>
      <View style={{ width: 24, height: 24, borderWidth: 1.5, borderColor: c.fg, backgroundColor: checked ? c.accent : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
        {checked ? <Icon name="check" size={16} color={c.onAccent} /> : null}
      </View>
    </Pressable>
  );
}

export default function Follow() {
  const { next = 'browse' } = useLocalSearchParams<{ next?: Next }>();
  const { state, set } = useStore();
  const { t, pick, count, meta } = useI18n();
  const { c } = useTheme();
  const [selected, setSelected] = useState<RouteKey[]>(state.following);
  const editing = next === 'back';

  const toggle = (k: RouteKey) => setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  const finish = (keys: RouteKey[]) => {
    // Kept in the app's road order, so nothing reads as a ranking.
    const following = ROUTE_ORDER.filter((k) => keys.includes(k));
    if (editing) {
      set({ following });
      router.back();
      return;
    }
    set({ following, onboarded: true });
    router.replace('/(tabs)/roads');
    if (next === 'pathfinder') router.push('/pathfinder');
  };

  const n = selected.length;
  const cta = editing ? t('follow.save') : n === 0 ? t('follow.ctaNone') : n === 1 ? t('follow.ctaOne') : t('follow.cta', { n: count(n) });

  return (
    <Screen edges={editing ? [] : ['top']} footer={<Button label={cta} onPress={() => finish(selected)} />}>
      {/* From Settings this is a pushed page: it needs the native header and its Back (HIG navigation stack). */}
      <Stack.Screen options={editing ? { ...stackOptions(c, meta.script), headerShown: true, title: t('settings.following') } : { headerShown: false }} />
      {editing ? null : (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button kind="link" label={t('follow.skip')} onPress={() => finish([])} />
        </View>
      )}
      <Heading>{t('follow.title')}</Heading>
      <T variant="body" tone="fgMuted">
        {t('follow.lead')}
      </T>
      {COUNTRY_ORDER.map((country) => {
        const roads = ROUTE_ORDER.filter((k) => ROUTES[k].country === country);
        const name = pick(COUNTRY_NAMES[country]);
        return (
          <View key={country}>
            <View accessible style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2, paddingBottom: space.s2 }} accessibilityRole="header">
              <Flag country={country} />
              <T variant="label" tone="fgMuted" lang={name.lang}>
                {name.text}
              </T>
            </View>
            {roads.map((k) => (
              <FollowRow key={k} route={k} checked={selected.includes(k)} onToggle={() => toggle(k)} />
            ))}
          </View>
        );
      })}
    </Screen>
  );
}
