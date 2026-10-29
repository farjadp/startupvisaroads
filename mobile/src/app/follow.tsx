// Roads to follow (onboarding 3B, on ink like the language step): every v2
// route, one card per country in the app's country order with its flag faded
// behind it, each road with its family icon. 59 roads in 15 countries is long,
// so each card folds: closed by default, its header saying how many of its
// roads are followed. Optional and skippable. Followed roads lead Home and the
// News "My roads" filter; they are never a match, never ranked, never scored
// (trust rules). A road shut to the user's passport is listed but cannot be
// followed (passport gate), only let go of if it already was.
// `next` says where to go after: into the app (assessment or browse), or
// back to Settings.
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { ROUTES_V2, type RouteV2 } from '@shared/routes-v2';
import { COUNTRY_NAMES, COUNTRY_ORDER, FAMILY_ICON, type Country } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { space, size } from '@/theme/tokens';
import { Flag } from '@/ui/Flag';
import { FLAG_SVG } from '@/ui/flags';
import { Icon } from '@/ui/Icon';
import { Button, Heading, Screen } from '@/ui/kit';
import { stackOptions } from '@/ui/stackOptions';
import { T } from '@/ui/T';

type Next = 'assessment' | 'pathfinder' | 'browse' | 'back';

/** Every v2 route in the app's order: country by country, each country's routes as the data lists them. */
const ORDER = COUNTRY_ORDER.flatMap((country) => ROUTES_V2.filter((r) => r.country === country).map((r) => r.key));

function FollowRow({ route, checked, shut, onToggle }: { route: RouteV2; checked: boolean; shut: boolean; onToggle: () => void }) {
  const { c } = useTheme();
  const { t, pick } = useI18n();
  const name = pick(route.name);
  // Shut to their passport: no offer to follow; a road followed before can still be let go of.
  const disabled = shut && !checked;
  const sub = shut ? t('follow.notForPassport') : [t(`families.${route.family}`), route.status !== 'open' ? t(`route2.statusShort.${route.status}`) : null].filter(Boolean).join(' · ');
  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={`${name.text}, ${sub}`}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.s3,
        minHeight: 60,
        paddingVertical: space.s2,
        borderTopWidth: 1,
        borderTopColor: c.rule,
        backgroundColor: pressed ? c.rowPressed : 'transparent',
      })}
    >
      <Icon name={FAMILY_ICON[route.family]} tone={shut ? 'fgMuted' : 'fg'} />
      <View style={{ flex: 1, gap: 2 }}>
        <T variant="row" weight="bold" tone={shut ? 'fgMuted' : 'fg'} lang={name.lang}>
          {name.text}
        </T>
        <T variant="caption" tone="fgMuted">
          {sub}
        </T>
      </View>
      {disabled ? (
        <View style={{ width: 24, height: 24, borderWidth: 1.5, borderStyle: 'dashed', borderColor: c.fgFaint }} />
      ) : (
        <View style={{ width: 24, height: 24, borderWidth: 1.5, borderColor: c.fg, backgroundColor: checked ? c.accent : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          {checked ? <Icon name="check" size={16} color={c.onAccent} /> : null}
        </View>
      )}
    </Pressable>
  );
}

/** A country's flag, full-bleed and faded, behind its card (mood only; the name is always in text). 0.12 keeps fg-muted at 4.82:1 over white (0.15 gave 4.34:1, WCAG 1.4.3). */
function FlagWash({ country }: { country: Country }) {
  return (
    <View pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants" style={[StyleSheet.absoluteFill, { opacity: 0.12 }]}>
      <SvgXml xml={FLAG_SVG[country]} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
    </View>
  );
}

/** One country, folded by default; the header says how many of its roads are followed. */
function CountryCard({ country, selected, passport, onToggle }: { country: Country; selected: string[]; passport: string | null; onToggle: (k: string) => void }) {
  const { c } = useTheme();
  const { t, pick, count, meta } = useI18n();
  const [open, setOpen] = useState(false);
  const roads = ROUTES_V2.filter((r) => r.country === country);
  if (!roads.length) return null;
  const name = pick(COUNTRY_NAMES[country]);
  const n = roads.filter((r) => selected.includes(r.key)).length;
  const total = roads.length === 1 ? t('countries.road') : t('countries.roads', { n: count(roads.length) });
  const status = n ? `${total} · ${t('follow.followedN', { n: count(n) })}` : total;
  return (
    <View style={{ overflow: 'hidden', borderWidth: 1, borderColor: n ? c.fg : c.rule, paddingHorizontal: space.s4 }}>
      <FlagWash country={country} />
      <Pressable
        onPress={() => setOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${name.text}, ${status}`}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: space.s3, minHeight: size.touchMin + space.s4, paddingVertical: space.s3, opacity: pressed ? 0.7 : 1 })}
      >
        <Flag country={country} />
        <View style={{ flex: 1, gap: 2 }}>
          <T variant="headline" lang={name.lang}>
            {name.text}
          </T>
          <T variant="caption" tone={n ? 'fg' : 'fgMuted'} weight={n ? 'bold' : 'regular'}>
            {status}
          </T>
        </View>
        {/* Points forward when folded, down when open; the chevron mirrors in RTL, so it turns the other way there. */}
        <View style={{ transform: [{ rotate: open ? (meta.rtl ? '-90deg' : '90deg') : '0deg' }] }}>
          <Icon name="chevron" />
        </View>
      </Pressable>
      {open
        ? roads.map((r) => (
            <FollowRow key={r.key} route={r} checked={selected.includes(r.key)} shut={!!passport && !!r.blockedCitizenships?.codes.includes(passport)} onToggle={() => onToggle(r.key)} />
          ))
        : null}
    </View>
  );
}

function FollowScreen() {
  const { next = 'browse' } = useLocalSearchParams<{ next?: Next }>();
  const { state, set } = useStore();
  const { t, count, meta } = useI18n();
  const { c } = useTheme();
  const [selected, setSelected] = useState<string[]>(state.following);
  const editing = next === 'back';
  const passport = state.assess.citizenship && state.assess.citizenship !== 'skip' ? state.assess.citizenship : null;

  const toggle = (k: string) => setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  const finish = (keys: string[]) => {
    // Kept in the app's road order, so nothing reads as a ranking.
    const following = ORDER.filter((k) => keys.includes(k));
    if (editing) {
      set({ following });
      router.back();
      return;
    }
    set({ following, onboarded: true });
    router.replace('/(tabs)/home');
    if (next === 'assessment' || next === 'pathfinder') router.push('/assessment');
  };

  const n = ORDER.filter((k) => selected.includes(k)).length;
  const cta = editing ? t('follow.save') : n === 0 ? t('follow.ctaNone') : n === 1 ? t('follow.ctaOne') : t('follow.cta', { n: count(n) });

  return (
    <Screen edges={editing ? [] : ['top']} footer={<Button label={cta} onPress={() => finish(selected)} />}>
      <StatusBar style="light" />
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
      {COUNTRY_ORDER.map((country) => (
        <CountryCard key={country} country={country} selected={selected} passport={passport} onToggle={toggle} />
      ))}
    </Screen>
  );
}

export default function Follow() {
  return (
    <ThemeProvider force="night">
      <FollowScreen />
    </ThemeProvider>
  );
}
