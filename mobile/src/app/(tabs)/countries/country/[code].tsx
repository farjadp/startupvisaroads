// Country page (v2): its picture, its roads grouped by family, and its funds.
// Roads open the route page. Countries still being researched say so plainly.
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { FUNDS } from '@shared/funds';
import { routesOf } from '@shared/routes-v2';
import { COUNTRY_HERO, COUNTRY_NAMES, COUNTRY_ORDER, FAMILY_ICON, FAMILY_ORDER, type Country } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { space } from '@/theme/tokens';
import { CountryPicture } from '@/ui/CountryPicture';
import { Disclaimer, Heading, Label, LinkRow, Ruled, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

export default function CountryPage() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { t, pick } = useI18n();
  const country = (COUNTRY_ORDER.includes(code as Country) ? code : 'CA') as Country;
  const name = pick(COUNTRY_NAMES[country]);
  const roads = routesOf(country);
  const photo = COUNTRY_HERO[country];

  return (
    <Screen edges={[]}>
      <Stack.Screen options={{ title: name.text }} />
      <View style={{ marginHorizontal: -space.s6, marginTop: -space.s4 }}>
        <CountryPicture country={country} height={220} />
      </View>
      {photo ? (
        <T variant="caption" tone="fgMuted">
          {`${pick(photo.alt).text} · ${photo.credit}`}
        </T>
      ) : null}
      <Heading role="display-l">{name.text}</Heading>
      {roads.length === 0 ? (
        <T variant="body" tone="fgMuted">
          {t('countries.researchingLong')}
        </T>
      ) : (
        FAMILY_ORDER.filter((f) => roads.some((r) => r.family === f)).map((f) => (
          <View key={f}>
            <Label>{t(`families.${f}`)}</Label>
            <Ruled>
              {roads
                .filter((r) => r.family === f)
                .map((r) => (
                  <LinkRow
                    key={r.key}
                    icon={FAMILY_ICON[f]}
                    label={pick(r.name).text}
                    sub={r.status !== 'open' ? t(`route2.statusShort.${r.status}`) : undefined}
                    onPress={() => router.push(`/(tabs)/countries/route/${r.key}`)}
                  />
                ))}
            </Ruled>
          </View>
        ))
      )}
      {country in FUNDS ? (
        <Ruled>
          <LinkRow icon="wallet" label={t('countries.funds')} onPress={() => router.push({ pathname: '/(tabs)/assess/funds', params: { country } })} />
        </Ruled>
      ) : null}
      <Disclaimer onAbout={() => router.navigate('/(tabs)/me/about')} />
    </Screen>
  );
}
