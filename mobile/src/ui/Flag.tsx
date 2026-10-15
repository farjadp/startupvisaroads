// A country flag, 4:3, with a hairline so white flags (Finland) hold their
// edge on paper. Decorative: the country name is always beside it in text,
// and flags never mirror in right-to-left layouts.
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import type { Country } from '@/content/routes';
import { useTheme } from '@/theme/ThemeProvider';
import { FLAG_SVG } from './flags';

export function Flag({ country, width = 24 }: { country: Country; width?: number }) {
  const { c } = useTheme();
  const height = (width * 3) / 4;
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants" style={{ borderWidth: 1, borderColor: c.fgFaint }}>
      <SvgXml xml={FLAG_SVG[country]} width={width} height={height} />
    </View>
  );
}
