// A country's picture: the real, credited photo when there is one, else its
// flag faded on ink (the onboarding mood). Decorative: the country is always
// named in text beside it.
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { COUNTRY_HERO, type Country } from '@/content/routes';
import { raw_ink } from '@/theme/tokens';
import { FLAG_SVG } from './flags';

/** The card's picture: the real photo when there is one, else the flag faded on ink. */
export function CountryPicture({ country, height }: { country: Country; height: number }) {
  const photo = COUNTRY_HERO[country];
  if (photo) return <Image source={photo.source} style={{ height }} contentFit="cover" accessible={false} />;
  return (
    <View style={{ height, backgroundColor: raw_ink, overflow: 'hidden' }} accessible={false} importantForAccessibility="no-hide-descendants">
      <View style={[StyleSheet.absoluteFill, { opacity: 0.18 }]}>
        <SvgXml xml={FLAG_SVG[country]} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
      </View>
    </View>
  );
}
