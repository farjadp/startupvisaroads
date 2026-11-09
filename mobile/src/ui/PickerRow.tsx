// A ruled row "label … value ›" that opens its options in a Sheet (spec
// 2026-11-09 §1). One tap chooses and closes; a muted trailing option carries
// "Prefer not to say". The open state may be controlled (the assessment opens
// the next empty row itself); otherwise the row keeps it. Above fontScale 1.3
// the label stacks over the value. Focus goes back to the row when the sheet
// has gone.
import { useCallback, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Platform, Pressable, View, findNodeHandle, useWindowDimensions } from 'react-native';
import { useI18n } from '@/i18n/I18nProvider';
import type { Locale } from '@/i18n/locales';
import { useTheme } from '@/theme/ThemeProvider';
import { size, space } from '@/theme/tokens';
import { Icon } from './Icon';
import { Button, RadioRow, Ruled } from './kit';
import { Sheet } from './Sheet';
import { T } from './T';

const HIT = Platform.OS === 'android' ? size.touchMinAndroid : size.touchMin;

export type PickerOption = { id: string; label: string; muted?: boolean };

/** Figures and ranges keep their own direction inside right-to-left text (FSI … PDI). */
const isolate = (s: string) => (/[\d%+\-–]/.test(s) ? `⁨${s}⁩` : s);

export function PickerRow({
  label,
  sheetTitle,
  sub,
  options,
  value,
  valueText,
  onChange,
  multiple,
  lang,
  open: openProp,
  onOpenChange,
  onDismissed,
  rowRef,
  footer,
}: {
  label: string;
  /** The sheet's title when it should read as the full question; defaults to the row label. */
  sheetTitle?: string;
  /** Shown under the sheet title (a note on the options). */
  sub?: string;
  options: PickerOption[];
  /** The chosen option id, or ids when `multiple`. */
  value?: string | string[];
  /** Overrides the text shown in the row (e.g. "3 selected"). */
  valueText?: string;
  onChange: (id: string) => void;
  /** Checkbox-style options; the sheet stays open and closes on Done. */
  multiple?: boolean;
  /** The options' language when it is not the UI's (route names). */
  lang?: Locale;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The sheet has fully left the screen. */
  onDismissed?: () => void;
  /** Callback ref to the row (the assessment scrolls the next empty row into view). */
  rowRef?: (node: View | null) => void;
  footer?: ReactNode;
}) {
  const { c } = useTheme();
  const { t } = useI18n();
  const { fontScale } = useWindowDimensions();
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = useCallback(
    (o: boolean) => {
      setOpenState(o);
      onOpenChange?.(o);
    },
    [onOpenChange],
  );
  const ownRef = useRef<View>(null);
  const setRefs = (node: View | null) => {
    ownRef.current = node;
    rowRef?.(node);
  };

  const ids = Array.isArray(value) ? value : value !== undefined ? [value] : [];
  const chosen = options.filter((o) => ids.includes(o.id));
  const shown = valueText ?? (chosen.length ? chosen.map((o) => o.label).join(', ') : undefined);
  const stacked = fontScale > 1.3;

  const dismissed = useCallback(() => {
    // The row that opened the sheet gets the focus back.
    const node = ownRef.current ? findNodeHandle(ownRef.current) : null;
    if (node) AccessibilityInfo.setAccessibilityFocus(node);
    onDismissed?.();
  }, [onDismissed]);

  const choose = (id: string) => {
    onChange(id);
    if (!multiple) setOpen(false);
  };

  return (
    <>
      <Pressable
        ref={setRefs}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${shown ?? t('common.choose')}`}
        accessibilityHint={t('common.opensList')}
        style={({ pressed }) => ({
          flexDirection: stacked ? 'column' : 'row',
          alignItems: stacked ? 'stretch' : 'center',
          gap: stacked ? space.s1 : space.s3,
          minHeight: Math.max(HIT, size.row + 12),
          paddingVertical: space.s3,
          borderBottomWidth: 1,
          borderBottomColor: c.rule,
          backgroundColor: pressed ? c.rowPressed : 'transparent',
        })}
      >
        <T variant="row" weight="bold" style={stacked ? undefined : { flex: 1 }}>
          {label}
        </T>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2, flexShrink: 1, justifyContent: stacked ? 'space-between' : 'flex-end' }}>
          <T variant="row" tone={shown ? 'fg' : 'fgMuted'} lang={shown ? lang : undefined} style={{ flexShrink: 1 }}>
            {shown ? isolate(shown) : t('common.choose')}
          </T>
          {/* Directional icons mirror by layout direction (Icon.tsx). */}
          <Icon name="chevron" tone="fgMuted" />
        </View>
      </Pressable>
      <Sheet open={open} onClose={() => setOpen(false)} onDismissed={dismissed} title={sheetTitle ?? label} sub={sub}>
        <View accessibilityRole={multiple ? undefined : 'radiogroup'}>
          <Ruled>
            {options.map((o) => (
              <RadioRow key={o.id} label={o.label} muted={o.muted} selected={ids.includes(o.id)} onPress={() => choose(o.id)} lang={lang} check={multiple} />
            ))}
          </Ruled>
        </View>
        {footer}
        {multiple ? <Button kind="secondary" icon={null} label={t('common.done')} onPress={() => setOpen(false)} /> : null}
      </Sheet>
    </>
  );
}
