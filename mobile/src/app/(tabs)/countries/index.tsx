// Countries (v2, option 2A, Farjad 15 Oct 2026): a two-column photo grid of
// the ten countries, each with its flag, name and number of roads, filtered
// by route family. Countries whose photo is not sourced yet show their flag
// faded on ink, the mood of onboarding. Thumbnails are allowed in lists.
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { routesOf } from '@shared/routes-v2';
import { COUNTRY_NAMES, COUNTRY_ORDER, FAMILY_ORDER, type Country, type RouteFamily } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { CountryPicture } from '@/ui/CountryPicture';
import { Flag } from '@/ui/Flag';
import { Chip, Heading, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

const GAP = space.s3;

function CountryCard({ country, width }: { country: Country; width: number }) {
  const { t, pick, count } = useI18n();
  const { c } = useTheme();
  const name = pick(COUNTRY_NAMES[country]);
  const n = routesOf(country).length;
  const sub = n === 0 ? t('countries.researching') : n === 1 ? t('countries.road') : t('countries.roads', { n: count(n) });
  return (
    <Pressable
      onPress={() => router.push(`/(tabs)/countries/country/${country}`)}
      accessibilityRole="button"
      accessibilityLabel={`${name.text}, ${sub}`}
      style={({ pressed }) => ({ width, opacity: pressed ? 0.8 : 1, gap: space.s1 })}
    >
      <CountryPicture country={country} height={Math.round(width * 0.72)} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2, marginTop: space.s1 }}>
        <Flag country={country} width={18} />
        <T variant="row" weight="bold" lang={name.lang} style={{ flexShrink: 1 }}>
          {name.text}
        </T>
      </View>
      <T variant="caption" tone={n === 0 ? 'fgFaint' : 'fgMuted'}>
        {sub}
      </T>
      <View style={{ height: 1, backgroundColor: c.rule, marginTop: space.s1 }} />
    </Pressable>
  );
}

export default function Countries() {
  const { t } = useI18n();
  const { width, fontScale } = useWindowDimensions();
  const [family, setFamily] = useState<RouteFamily | 'all'>('all');
  // Only families the app has roads for, so a chip never leads to an empty grid.
  const families = FAMILY_ORDER.filter((f) => COUNTRY_ORDER.some((k) => routesOf(k, f).length > 0));
  const shown = family === 'all' ? COUNTRY_ORDER : COUNTRY_ORDER.filter((k) => routesOf(k, family).length > 0);
  // At accessibility text sizes two columns break names mid-word ("Canad/a"): one column then (HIG Dynamic Type).
  const columns = fontScale >= 1.35 ? 1 : 2;
  const cardW = Math.floor((width - space.s6 * 2 - GAP * (columns - 1)) / columns);

  return (
    <Screen>
      <Heading>{t('countries.title')}</Heading>
      <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 }}>
        <Chip label={t('countries.all')} selected={family === 'all'} onPress={() => setFamily('all')} />
        {families.map((f) => (
          <Chip key={f} label={t(`families.${f}`)} selected={family === f} onPress={() => setFamily(f)} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP }}>
        {shown.map((k) => (
          <CountryCard key={k} country={k} width={cardW} />
        ))}
      </View>
      <View style={{ height: space.s6 }} />
    </Screen>
  );
}
