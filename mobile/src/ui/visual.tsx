// Route page, option A "a visual per tab" (Farjad, 9 Nov 2026): status marks
// and count tiles for the rules, one-line rows whose full text opens in a
// Sheet, indicator tiles and the strengths / weaknesses cards for After.
// Brand palette only (paper, ink, acid): state is carried by a mark's shape and
// its word, never by colour alone.
import { useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Platform, Pressable, View, findNodeHandle, useWindowDimensions } from 'react-native';
import type { CountryProfile, Indicator } from '@shared/routes-v2/extras-types';
import type { CriterionState } from '@shared/routes-v2/match';
import type { Criterion, L10n, Source } from '@shared/routes-v2/types';
import type { Tally } from '@/engine/tally';
import { toPersianDigits } from '@/i18n/format';
import { useI18n } from '@/i18n/I18nProvider';
import type { Locale } from '@/i18n/locales';
import { useTheme } from '@/theme/ThemeProvider';
import { size, space } from '@/theme/tokens';
import { Icon } from './Icon';
import { Button, Label, SourceLine } from './kit';
import { Sheet } from './Sheet';
import { T } from './T';

const HIT = Platform.OS === 'android' ? size.touchMinAndroid : size.touchMin;
/** Above this a one-line row may take two lines: an ellipsis at accessibility sizes hides too much. */
const LARGE_TEXT = 1.3;
/** Characters past which a note folds to a few lines and a "Read more" sheet. */
const LONG = 160;

/** Moves screen-reader focus back to the row that opened a sheet (spec amendment 1). */
function useFocusReturn() {
  const ref = useRef<View>(null);
  const back = () => {
    const node = ref.current ? findNodeHandle(ref.current) : null;
    if (node) AccessibilityInfo.setAccessibilityFocus(node);
  };
  return { ref, back };
}

// ------------------------------------------------------------------ status mark

export type Mark = 'met' | 'close' | 'not-yet' | 'unscored';

/**
 * A small circle with its own glyph: met = ink disc with a check, close = acid disc with "!", not yet = open
 * ink ring, not checked = dashed ring with "?". Decorative: the status word always sits beside it.
 */
export function StatusMark({ state, size: d = 24 }: { state: Mark; size?: number }) {
  const { c } = useTheme();
  const box = { width: d, height: d, borderRadius: d / 2, alignItems: 'center', justifyContent: 'center' } as const;
  const glyph = (ch: string, tone: 'onAccent' | 'fgMuted') => (
    <T variant="caption" weight="bold" tone={tone} maxFontSizeMultiplier={1} style={{ lineHeight: d - 4 }}>
      {ch}
    </T>
  );
  const inner =
    state === 'met' ? (
      <View style={[box, { backgroundColor: c.fg }]}>
        <Icon name="check" size={d * 0.66} tone="buttonFg" />
      </View>
    ) : state === 'close' ? (
      // Acid is a fill only (1.03:1 on paper): the ink ring is what makes the mark visible.
      <View style={[box, { backgroundColor: c.accent, borderWidth: 1.5, borderColor: c.fg }]}>{glyph('!', 'onAccent')}</View>
    ) : state === 'not-yet' ? (
      <View style={[box, { backgroundColor: c.bg, borderWidth: 1.5, borderColor: c.fg }]} />
    ) : (
      <View style={[box, { backgroundColor: c.bg, borderWidth: 1.5, borderColor: c.fgMuted, borderStyle: 'dashed' }]}>{glyph('?', 'fgMuted')}</View>
    );
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants">
      {inner}
    </View>
  );
}

/** The status word beside a mark, in the same words as the tally. */
export function useStatusWord() {
  const { t } = useI18n();
  return (s: CriterionState): string => (s === 'unscored' ? t('route2.notChecked') : t(`status.${s}`));
}

// ------------------------------------------------------------------ count tiles

/** Met and close always, then not yet and not checked when there are any. Coverage under them (trust rule). */
export function CountTiles({ counts, coverage }: { counts: Tally; coverage: string }) {
  const { t, count } = useI18n();
  const { c } = useTheme();
  const { fontScale } = useWindowDimensions();
  const tiles: { mark: Mark; n: number; word: string; spoken: string }[] = [
    { mark: 'met', n: counts.met, word: t('status.met'), spoken: t('route2.tallyMet', { n: count(counts.met) }) },
    { mark: 'close', n: counts.close, word: t('status.close'), spoken: t('route2.tallyClose', { n: count(counts.close) }) },
    ...(counts.notYet ? [{ mark: 'not-yet' as const, n: counts.notYet, word: t('status.not-yet'), spoken: t('route2.tallyNotYet', { n: count(counts.notYet) }) }] : []),
    ...(counts.unchecked ? [{ mark: 'unscored' as const, n: counts.unchecked, word: t('route2.notChecked'), spoken: t('assess2.unchecked', { n: count(counts.unchecked) }) }] : []),
  ];
  const wide = fontScale > LARGE_TEXT;
  return (
    <View style={{ gap: space.s2 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 }}>
        {tiles.map((x) => (
          <View
            key={x.mark}
            accessible
            accessibilityLabel={x.spoken}
            style={{ flexBasis: wide ? '100%' : '47%', flexGrow: 1, padding: space.s3, gap: space.s1, borderWidth: 1, borderColor: c.fg }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2 }}>
              <StatusMark state={x.mark} />
              <T variant="headline">{count(x.n)}</T>
            </View>
            <T variant="row" weight="bold">
              {x.word}
            </T>
          </View>
        ))}
      </View>
      <T variant="caption" tone="fgMuted">
        {coverage}
      </T>
    </View>
  );
}

// ------------------------------------------------------------------ fold rows

/** One line (two at large text) with a chevron; the full text opens in a Sheet and focus comes back on close. */
export function FoldRow({ lead, title, lang, sub, value, sheetTitle, label, children }: { lead?: ReactNode; title: string; lang?: Locale; sub?: string; value?: string; sheetTitle: string; label?: string; children: ReactNode }) {
  const { t } = useI18n();
  const { c } = useTheme();
  const { fontScale } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const { ref, back } = useFocusReturn();
  return (
    <>
      <Pressable
        ref={ref}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={label ?? [title, value].filter(Boolean).join(': ')}
        accessibilityHint={t('route5.opensFull')}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: space.s3, minHeight: HIT + 4, paddingVertical: space.s2, borderBottomWidth: 1, borderBottomColor: c.rule, backgroundColor: pressed ? c.rowPressed : 'transparent' })}
      >
        {lead}
        <View style={{ flex: 1, gap: 2 }}>
          <T variant="row" lang={lang} numberOfLines={fontScale > LARGE_TEXT ? 2 : 1}>
            {title}
          </T>
          {sub ? (
            <T variant="caption" weight="bold" tone="fgMuted">
              {sub}
            </T>
          ) : null}
        </View>
        {value ? (
          <T variant="row" weight="bold" style={{ flexShrink: 0, maxWidth: '45%' }} numberOfLines={2}>
            {value}
          </T>
        ) : null}
        <Icon name="chevron" tone="fgMuted" />
      </Pressable>
      <Sheet open={open} onClose={() => setOpen(false)} onDismissed={back} title={sheetTitle}>
        {children}
      </Sheet>
    </>
  );
}

/** Body text that folds to three lines and a "Read more" sheet once it runs long (option A: long notes anywhere). */
export function LongText({ text, title, variant = 'body', tone }: { text: L10n; title: string; variant?: 'body' | 'caption'; tone?: 'fg' | 'fgMuted' }) {
  const { t, pick } = useI18n();
  const p = pick(text);
  const [open, setOpen] = useState(false);
  const { ref, back } = useFocusReturn();
  if (p.text.length <= LONG) {
    return (
      <T variant={variant} tone={tone} lang={p.lang}>
        {p.text}
      </T>
    );
  }
  return (
    <View style={{ gap: space.s1 }}>
      <T variant={variant} tone={tone} lang={p.lang} numberOfLines={3} accessible={false} importantForAccessibility="no">
        {p.text}
      </T>
      <View ref={ref} collapsable={false}>
        <Button kind="link" label={t('route5.readMore')} hint={t('route5.opensFull')} onPress={() => setOpen(true)} />
      </View>
      <Sheet open={open} onClose={() => setOpen(false)} onDismissed={back} title={title}>
        <T variant="body" lang={p.lang}>
          {p.text}
        </T>
      </Sheet>
    </View>
  );
}

// ------------------------------------------------------------------ conditions

/** A condition: its mark and word when the assessment scored it, label on one line, the note in the sheet. */
export function ConditionRow({ c, status, section, sources }: { c: Criterion; status?: CriterionState; section: string; sources?: Source[] }) {
  const { t, pick } = useI18n();
  const word = useStatusWord();
  const label = pick(c.label);
  const note = c.note ? pick(c.note) : null;
  const w = status ? word(status) : undefined;
  return (
    <FoldRow
      lead={status ? <StatusMark state={status} /> : null}
      title={label.text}
      lang={label.lang}
      sub={w}
      sheetTitle={section}
      label={[w ? `${label.text}: ${w}` : label.text, note?.text].filter(Boolean).join('. ')}
    >
      <T variant="headline" lang={label.lang}>
        {label.text}
      </T>
      {status && w ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2 }}>
          <StatusMark state={status} />
          <T variant="row" weight="bold">
            {t('route5.status', { status: w })}
          </T>
        </View>
      ) : null}
      {note ? (
        <T variant="body" lang={note.lang}>
          {note.text}
        </T>
      ) : null}
      {/* Every figure carries its source and checked date, in the sheet too (trust rule). */}
      {sources?.map((src) => <SourceLine key={src.url} url={src.url} updated={src.checked} />)}
    </FoldRow>
  );
}

// ------------------------------------------------------------------ country (After)

function useIndicatorValue() {
  const { t, count, money } = useI18n();
  return (i: Indicator): string =>
    i.rank != null
      ? i.of != null
        ? t('profile.rank', { rank: count(i.rank), of: count(i.of) })
        : t('profile.rankOnly', { rank: count(i.rank) })
      : i.value != null
        ? // US$ stays Latin as money; a % is in the name, so the figure is a plain count (no "% 8.7" bidi flip).
          i.unit === 'USD'
          ? money(i.value, 'USD')
          : `${count(i.value)}${i.unit && i.unit !== '%' ? ` ${i.unit}` : ''}`
        : '';
}

function IndicatorTile({ i, wide }: { i: Indicator; wide: boolean }) {
  const { t, meta } = useI18n();
  const { c } = useTheme();
  const valueOf = useIndicatorValue();
  const [open, setOpen] = useState(false);
  const { ref, back } = useFocusReturn();
  // A year is a label, not a quantity: no thousands separator.
  const year = meta.proseDigits === 'persian' ? toPersianDigits(String(i.year)) : String(i.year);
  const name = t(`profile.names.${i.key}`);
  const value = valueOf(i);
  return (
    <>
      <Pressable
        ref={ref}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${year}: ${value}`}
        accessibilityHint={t('route5.opensSource')}
        style={({ pressed }) => ({ flexBasis: wide ? '100%' : '47%', flexGrow: 1, minHeight: HIT, padding: space.s3, gap: space.s1, borderWidth: 1, borderColor: c.fg, backgroundColor: pressed ? c.rowPressed : 'transparent' })}
      >
        <T variant="headline" numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </T>
        <T variant="caption" tone="fgMuted" numberOfLines={wide ? undefined : 2}>
          {name}
        </T>
        <T variant="caption" tone="fgMuted">
          {year}
        </T>
      </Pressable>
      <Sheet open={open} onClose={() => setOpen(false)} onDismissed={back} title={name}>
        <T variant="headline">{value}</T>
        <T variant="body">{t('route5.year', { year })}</T>
        <SourceLine url={i.source.url} updated={i.source.checked} />
      </Sheet>
    </>
  );
}

/** A compact card: up to three bullets of two lines each; the card opens the whole list in a sheet. */
function PointsCard({ title, items, sign }: { title: string; items: L10n[]; sign: string }) {
  const { t, pick } = useI18n();
  const { c } = useTheme();
  const [open, setOpen] = useState(false);
  const { ref, back } = useFocusReturn();
  const bullet = (s: L10n, k: number, lines?: number) => {
    const p = pick(s);
    return (
      <View key={k} style={{ flexDirection: 'row', gap: space.s2 }}>
        <T variant="row" weight="bold" importantForAccessibility="no" accessibilityElementsHidden>
          {sign}
        </T>
        <T variant={lines ? 'row' : 'body'} lang={p.lang} numberOfLines={lines} style={{ flex: 1 }}>
          {p.text}
        </T>
      </View>
    );
  };
  return (
    <>
      <Pressable
        ref={ref}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${title}: ${items.map((s) => pick(s).text).join('. ')}`}
        accessibilityHint={t('route5.opensList')}
        style={({ pressed }) => ({ padding: space.s3, gap: space.s2, borderWidth: 1, borderColor: c.fg, backgroundColor: pressed ? c.rowPressed : 'transparent' })}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2 }}>
          <T variant="label" tone="fgMuted" style={{ flex: 1 }}>
            {title}
          </T>
          <Icon name="chevron" tone="fgMuted" />
        </View>
        {items.slice(0, 3).map((s, k) => bullet(s, k, 2))}
      </Pressable>
      <Sheet open={open} onClose={() => setOpen(false)} onDismissed={back} title={title}>
        {items.map((s, k) => bullet(s, k))}
      </Sheet>
    </>
  );
}

/** The country, as After shows it: indicator tiles, then strengths and weaknesses as two cards. */
export function CountryAtAGlance({ profile }: { profile: CountryProfile }) {
  const { t } = useI18n();
  const { fontScale } = useWindowDimensions();
  const wide = fontScale > LARGE_TEXT;
  return (
    <>
      {profile.indicators.length ? (
        <View style={{ gap: space.s2 }}>
          <Label>{t('profile.indicators')}</Label>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 }}>
            {profile.indicators.map((i) => (
              <IndicatorTile key={i.key} i={i} wide={wide} />
            ))}
          </View>
        </View>
      ) : null}
      {profile.strengths.length || profile.weaknesses.length ? (
        <View style={{ gap: space.s2 }}>
          {profile.strengths.length ? <PointsCard title={t('profile.strengths')} items={profile.strengths} sign="+" /> : null}
          {profile.weaknesses.length ? <PointsCard title={t('profile.weaknesses')} items={profile.weaknesses} sign="−" /> : null}
        </View>
      ) : null}
    </>
  );
}
