// "Not scored here", one line per condition (rule 6). Each item is its own
// Text: the pathfinder gaps are in the UI language, the authority's
// conditions may be English content (spec 22: tagged so screen readers
// switch voice), and one long joined caption clipped at large text sizes.
import { View } from 'react-native';
import type { PathfinderGap } from '@/engine/readiness';
import { useI18n } from '@/i18n/I18nProvider';
import type { Locale } from '@/i18n/locales';
import { space } from '@/theme/tokens';
import { gapLabel } from './phrases';
import { T } from './T';

export function NotScored({ gaps, items, itemsLang }: { gaps: PathfinderGap[]; items: string[]; itemsLang: Locale }) {
  const i18n = useI18n();
  const foreign = itemsLang !== i18n.locale ? itemsLang : undefined;
  return (
    <View style={{ gap: space.s1 }}>
      <T variant="caption" weight="bold" accessibilityRole="header">
        {i18n.t('result.notScored')}
      </T>
      {gaps.map((g) => (
        <T key={g} variant="caption" tone="fgMuted">
          {`—  ${gapLabel(g, i18n)}`}
        </T>
      ))}
      {items.map((u) => (
        <T key={u} variant="caption" tone="fgMuted" lang={foreign}>
          {`—  ${u}`}
        </T>
      ))}
      {foreign ? (
        <T variant="caption" tone="fgMuted">
          {i18n.t('common.inEnglish')}
        </T>
      ) : null}
    </View>
  );
}
