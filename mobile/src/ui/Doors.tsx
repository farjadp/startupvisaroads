// The two ways in (v2 Start, option 1B, Farjad 15 Oct 2026): "Choose a road"
// on paper with its photo, "Get assessed" in ink with its time tag, so the
// assessment reads as the suggested way without hiding the other.
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';
import { ROUTES_V2 } from '@shared/routes-v2';
import { useI18n } from '@/i18n/I18nProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { T } from './T';

const ROAD_PHOTO = require('../../assets/photos/italy.webp');
const ASSESS_PHOTO = require('../../assets/photos/netherlands.webp');

function Door({ title, sub, tag, photo, ink, onPress }: { title: string; sub: string; tag?: string; photo: number; ink?: boolean; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[title, tag, sub].filter(Boolean).join(', ')}
      style={({ pressed }) => ({ borderWidth: 1.5, borderColor: c.fg, backgroundColor: ink ? c.buttonBg : c.bg, opacity: pressed ? 0.85 : 1 })}
    >
      {/* Decorative: the door is named in text. */}
      <Image source={photo} style={{ height: 112 }} contentFit="cover" accessible={false} />
      <View style={{ padding: space.s4, gap: space.s1 }}>
        {/* Wraps: at large text or in French the time tag was pushed off the card (HIG Dynamic Type). */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space.s2 }}>
          <T variant="display-m" tone={ink ? 'buttonFg' : 'fg'} style={{ flexShrink: 1 }}>
            {title}
          </T>
          {tag ? (
            <View style={{ backgroundColor: c.accent, paddingHorizontal: 6, paddingVertical: 2 }}>
              <T variant="caption" weight="bold" tone="onAccent">
                {tag}
              </T>
            </View>
          ) : null}
        </View>
        <T variant="caption" tone={ink ? 'buttonFg' : 'fgMuted'}>
          {sub}
        </T>
      </View>
    </Pressable>
  );
}

export function Doors({ onRoad, onAssess }: { onRoad: () => void; onAssess: () => void }) {
  const { t, count } = useI18n();
  // Counted from the route data so the door never trails the content (it said 10 after v3 added five).
  const countries = new Set(ROUTES_V2.map((r) => r.country)).size;
  return (
    <View style={{ gap: space.s3 }}>
      <Door title={t('start.roadTitle')} sub={t('start.roadSub', { n: count(countries) })} photo={ROAD_PHOTO} onPress={onRoad} />
      <Door title={t('start.assessTitle')} sub={t('start.assessSub')} tag={t('start.assessTag')} photo={ASSESS_PHOTO} ink onPress={onAssess} />
    </View>
  );
}
