// A segmented control of 2–4 equal tabs (spec 2026-11-09 §1): 1.5 pt ink
// border, the selected tab filled with the indicator colour and bg-coloured
// text (acid is never the only mark on paper), labels that shrink no further
// than caption size. Above fontScale 1.3, or when any label would need two
// lines, it renders as a PickerRow ("Section: Rules ›") instead of cramped
// tabs. Order mirrors in RTL by the layout direction alone.
import { useState } from 'react';
import { Pressable, View, useWindowDimensions, type NativeSyntheticEvent, type TextLayoutEventData } from 'react-native';
import { useI18n } from '@/i18n/I18nProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { size, space, typeSpec } from '@/theme/tokens';
import { PickerRow } from './PickerRow';
import { T } from './T';

export type Segment = { id: string; label: string };

export function Segments({ items, value, onChange, label }: { items: Segment[]; value: string; onChange: (id: string) => void; label?: string }) {
  const { c } = useTheme();
  const { t, count, meta } = useI18n();
  const { fontScale } = useWindowDimensions();
  const [wrapped, setWrapped] = useState<Record<string, boolean>>({});
  const needsRow = fontScale > 1.3 || Object.values(wrapped).some(Boolean);
  const minScale = typeSpec('caption', meta.script).fontSize / typeSpec('row', meta.script).fontSize;

  if (needsRow) {
    return <PickerRow label={label ?? t('common.section')} options={items} value={value} onChange={onChange} />;
  }
  const onLayout = (id: string) => (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const two = e.nativeEvent.lines.length > 1;
    if (two !== !!wrapped[id]) setWrapped((w) => ({ ...w, [id]: two }));
  };
  return (
    <View accessibilityRole="tablist" accessibilityLabel={label} style={{ flexDirection: 'row', borderWidth: 1.5, borderColor: c.fg }}>
      {items.map((it, i) => {
        const selected = it.id === value;
        return (
          <Pressable
            key={it.id}
            onPress={() => onChange(it.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={t('common.tabPosition', { label: it.label, n: count(i + 1), total: count(items.length) })}
            style={({ pressed }) => ({
              flex: 1,
              minHeight: size.row,
              paddingHorizontal: space.s2,
              paddingVertical: space.s2,
              alignItems: 'center',
              justifyContent: 'center',
              borderStartWidth: i === 0 ? 0 : 1.5,
              borderStartColor: c.fg,
              backgroundColor: selected ? c.indicator : pressed ? c.rowPressed : 'transparent',
            })}
          >
            <T variant="row" weight="bold" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={minScale} onTextLayout={onLayout(it.id)} style={selected ? { color: c.bg } : undefined}>
              {it.label}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}
