// The article reader (spec v4 §5, Amendment 5): read inside the app from the
// synced cache. Title, country · date, cover, body drawn natively by `Html`,
// the article's links as a list, then "Read on visaroads.com" and Share.
// Direction follows the article's language, not the UI's.
import { Stack, router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Linking, Share, View } from 'react-native';
import { articleRef, cachedArticle, type NewsItem, type NewsLang } from '@/content/news';
import { COUNTRY_NAMES } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { LOCALES } from '@/i18n/locales';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { Html, articleTextStyle } from '@/ui/Html';
import { htmlToBlocks, linksOf } from '@/ui/html-parse';
import { Button, Label, LinkRow, Ruled, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

const hostOf = (url: string) => url.replace(/^https:\/\/(www\.)?/, '').split(/[/?#]/)[0];

export default function Reader() {
  const params = useLocalSearchParams<{ slug: string; lang?: string }>();
  const slug = String(params.slug ?? '');
  const wanted: NewsLang | undefined = params.lang === 'fa' || params.lang === 'en' ? params.lang : undefined;
  const { t, pick, date, meta, locale } = useI18n();
  const { c } = useTheme();
  const { state, set } = useStore();
  const [item, setItem] = useState<NewsItem | null | undefined>(undefined);

  useEffect(() => {
    let live = true;
    void cachedArticle(slug, wanted ?? meta.siteLocale).then((hit) => live && setItem(hit));
    return () => {
      live = false;
    };
  }, [slug, wanted, meta.siteLocale]);

  useEffect(() => {
    if (item && !state.newsRead) set({ newsRead: true });
  }, [item, state.newsRead, set]);

  const blocks = useMemo(() => (item ? htmlToBlocks(item.html) : []), [item]);
  const links = useMemo(() => linksOf(blocks), [blocks]);

  // visaroads.com articles open here when the phone has them; every other https link opens in the browser.
  const onLink = useCallback(async (href: string) => {
    const ref = articleRef(href);
    if (ref && (await cachedArticle(ref.slug, ref.locale))) {
      router.push({ pathname: '/(tabs)/news/[slug]', params: { slug: ref.slug, lang: ref.locale } });
      return;
    }
    if (href.startsWith('https://')) void Linking.openURL(href).catch(() => {});
  }, []);

  if (item === undefined) return <Screen edges={[]}>{null}</Screen>;

  if (item === null) {
    const url = `https://visaroads.com/${wanted ?? meta.siteLocale}/blog/${encodeURIComponent(slug)}`;
    return (
      <Screen edges={[]}>
        <T variant="body">{t('news4.notSaved')}</T>
        <Button kind="secondary" icon="external" label={t('news4.readOnSite')} hint={t('common.opensBrowser')} onPress={() => void WebBrowser.openBrowserAsync(url)} />
      </Screen>
    );
  }

  const lang = item.locale;
  const rtl = LOCALES[lang].rtl;
  const text = articleTextStyle(rtl, meta.rtl);
  const where = item.countries.map((k) => pick(COUNTRY_NAMES[k]).text).join(' · ');
  const meta1 = [where, date(item.publishedAt)].filter(Boolean).join(' · ');
  const foreign = lang !== locale;

  return (
    <Screen
      edges={[]}
      stickyFooter={false}
      footer={
        <>
          <Button kind="primary" icon="external" label={t('news4.readOnSite')} hint={t('common.opensBrowser')} onPress={() => void WebBrowser.openBrowserAsync(item.url)} />
          <Button kind="secondary" icon={null} label={t('news4.share')} onPress={() => void Share.share({ message: `${item.title}\n${item.url}`, url: item.url, title: item.title }).catch(() => {})} />
        </>
      }
    >
      <Stack.Screen options={{ title: t('tabs.news') }} />
      <View style={{ gap: space.s3, direction: rtl ? 'rtl' : 'ltr' }}>
        {meta1 ? (
          <T variant="label" tone="fgMuted">
            {meta1}
          </T>
        ) : null}
        <T variant="display-m" lang={lang} accessibilityRole="header" style={text ?? undefined}>
          {item.title}
        </T>
        {foreign && lang === 'en' ? (
          <T variant="caption" tone="fgMuted">
            {t('news4.inEnglish')}
          </T>
        ) : null}
      </View>
      {item.coverImage ? (
        <View style={{ marginHorizontal: -space.s6 }}>
          <Image source={{ uri: item.coverImage }} contentFit="cover" style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: c.rule }} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
        </View>
      ) : null}
      <Html html={item.html} blocks={blocks} lang={lang} onLink={(href) => void onLink(href)} />
      {links.length > 0 ? (
        <View>
          <Label>{t('news4.linksTitle')}</Label>
          <Ruled>
            {links.map((l) => {
              const internal = articleRef(l.href) !== null;
              return <LinkRow key={l.href} label={l.text} sub={hostOf(l.href)} lang={lang} external={!internal} onPress={() => void onLink(l.href)} />;
            })}
          </Ruled>
        </View>
      ) : null}
    </Screen>
  );
}
