// A small native renderer for article bodies (spec v4 §5, Amendment 5). No
// WebView: the restricted tag set is parsed in `html-parse.ts` and drawn with
// `T`, so type, colour and Dynamic Type follow the theme. Text direction
// follows the article's language, not the UI's.
import { Image } from 'expo-image';
import { Fragment, useMemo, useState, type ReactNode } from 'react';
import { View, type TextStyle } from 'react-native';
import { useI18n } from '@/i18n/I18nProvider';
import { LOCALES, type Locale } from '@/i18n/locales';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { htmlToBlocks, type Block, type Inline } from './html-parse';
import { T } from './T';

type Ctx = { lang: Locale; rtl: boolean; text: TextStyle | null; onLink: (href: string) => void; linkHint: string };

const PERSIAN = '۰۱۲۳۴۵۶۷۸۹';
const num = (n: number, lang: Locale) => (lang === 'fa' ? String(n).replace(/\d/g, (d) => PERSIAN[Number(d)]) : String(n));

/** Direction for article text: right-to-left text inside a left-to-right UI needs it set on each text node. */
export function articleTextStyle(articleRtl: boolean, uiRtl: boolean): TextStyle | null {
  return articleRtl && !uiRtl ? { direction: 'rtl', writingDirection: 'rtl' } : null;
}

function Runs({ inlines, ctx, variant, bold }: { inlines: Inline[]; ctx: Ctx; variant: 'body' | 'headline' | 'row'; bold?: boolean }) {
  return (
    <>
      {inlines.map((i, k) => {
        if ('br' in i) return <Fragment key={k}>{'\n'}</Fragment>;
        const weight = i.bold || bold ? 'bold' : undefined;
        if (i.href) {
          const href = i.href;
          return (
            <T
              key={k}
              variant={variant}
              lang={ctx.lang}
              weight={weight}
              italic={i.italic}
              accessibilityRole="link"
              accessibilityHint={href.startsWith('https://visaroads.com/') ? undefined : ctx.linkHint}
              onPress={() => ctx.onLink(href)}
              style={[{ textDecorationLine: 'underline' }, ...(ctx.text ? [ctx.text] : [])]}
            >
              {i.text}
            </T>
          );
        }
        if (!weight && !i.italic) return <Fragment key={k}>{i.text}</Fragment>;
        return (
          <T key={k} variant={variant} lang={ctx.lang} weight={weight} italic={i.italic} style={ctx.text ?? undefined}>
            {i.text}
          </T>
        );
      })}
    </>
  );
}

function Para({ inlines, ctx, variant = 'body', header, bold }: { inlines: Inline[]; ctx: Ctx; variant?: 'body' | 'headline' | 'row'; header?: boolean; bold?: boolean }) {
  return (
    <T variant={variant} lang={ctx.lang} weight={bold ? 'bold' : undefined} accessibilityRole={header ? 'header' : undefined} style={ctx.text ?? undefined}>
      <Runs inlines={inlines} ctx={ctx} variant={variant} bold={bold} />
    </T>
  );
}

function ArticleImage({ src, alt }: { src: string; alt: string }) {
  const { c } = useTheme();
  const [ratio, setRatio] = useState(16 / 9);
  const decorative = alt.length === 0;
  return (
    <Image
      source={{ uri: src }}
      onLoad={(e) => {
        const { width, height } = e.source;
        if (width > 0 && height > 0) setRatio(width / height);
      }}
      contentFit="cover"
      style={{ width: '100%', aspectRatio: ratio, backgroundColor: c.rule }}
      accessible={!decorative}
      accessibilityRole={decorative ? undefined : 'image'}
      accessibilityLabel={decorative ? undefined : alt}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
    />
  );
}

function Blocks({ blocks, ctx }: { blocks: Block[]; ctx: Ctx }): ReactNode {
  const { c } = useTheme();
  return blocks.map((b, k) => {
    switch (b.kind) {
      case 'p':
        return <Para key={k} inlines={b.inlines} ctx={ctx} />;
      case 'h':
        return <Para key={k} inlines={b.inlines} ctx={ctx} header variant={b.level === 2 ? 'headline' : b.level === 3 ? 'row' : 'body'} bold={b.level > 2} />;
      case 'list':
        return (
          <View key={k} style={{ gap: space.s2 }}>
            {b.items.map((item, n) => (
              <View key={n} style={{ flexDirection: 'row', gap: space.s2 }}>
                <T variant="body" lang={ctx.lang} weight="bold" accessibilityElementsHidden importantForAccessibility="no" style={[{ minWidth: b.ordered ? 24 : 14 }, ...(ctx.text ? [ctx.text] : [])]}>
                  {b.ordered ? `${num(n + 1, ctx.lang)}.` : '•'}
                </T>
                <View style={{ flex: 1, gap: space.s2 }}>
                  <Blocks blocks={item} ctx={ctx} />
                </View>
              </View>
            ))}
          </View>
        );
      case 'quote':
        return (
          <View key={k} style={{ borderStartWidth: 2, borderStartColor: c.fg, paddingStart: space.s4, gap: space.s3 }}>
            <Blocks blocks={b.blocks} ctx={ctx} />
          </View>
        );
      case 'img':
        return <ArticleImage key={k} src={b.src} alt={b.alt} />;
      case 'table':
        // At phone width a table reads as stacked rows, each cell "Header: value".
        return (
          <View key={k} style={{ borderTopWidth: 1.5, borderTopColor: c.fg }}>
            {b.rows.map((row, r) => {
              const hasLink = row.some((cell) => cell.inlines.some((i) => !('br' in i) && i.href));
              return (
                <View key={r} accessible={!hasLink} style={{ gap: space.s1, paddingVertical: space.s3, borderBottomWidth: 1, borderBottomColor: c.rule }}>
                  {row.map((cell, n) => (
                    <T key={n} variant="body" lang={ctx.lang} style={ctx.text ?? undefined}>
                      {cell.header ? (
                        <T variant="body" lang={ctx.lang} weight="bold" style={ctx.text ?? undefined}>
                          {`${cell.header}: `}
                        </T>
                      ) : null}
                      <Runs inlines={cell.inlines} ctx={ctx} variant="body" />
                    </T>
                  ))}
                </View>
              );
            })}
          </View>
        );
      case 'hr':
        return <View key={k} accessible={false} style={{ height: 1, backgroundColor: c.rule }} />;
    }
  });
}

/** Draws article HTML. `lang` is the article's language; links go to `onLink` (https only). */
export function Html({ html, lang, onLink, blocks: given }: { html: string; lang: Locale; onLink: (href: string) => void; blocks?: Block[] }) {
  const { meta, t } = useI18n();
  const blocks = useMemo(() => given ?? htmlToBlocks(html), [given, html]);
  const rtl = LOCALES[lang].rtl;
  const ctx: Ctx = { lang, rtl, text: articleTextStyle(rtl, meta.rtl), onLink, linkHint: t('common.opensBrowser') };
  return (
    <View style={{ gap: space.s4, direction: rtl ? 'rtl' : 'ltr' }}>
      <Blocks blocks={blocks} ctx={ctx} />
    </View>
  );
}
