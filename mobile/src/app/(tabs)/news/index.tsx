// News (3.1): cached first, then refreshed; offline banner with the saved
// date; error with Retry; empty state that offers all news (spec 24, 26).
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cachedFeed, fetchFeed, type Feed, type NewsItem } from '@/content/news';
import { Image } from 'expo-image';
import { routeV2 } from '@shared/routes-v2';
import { COUNTRY_NAMES, COUNTRY_PHOTO, type Country } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { Banner, Button, Chip, Heading } from '@/ui/kit';
import { T } from '@/ui/T';

const FILTERS: Country[] = ['CA', 'DK', 'FI', 'EE', 'NL', 'IT', 'TR', 'US'];
type Filter = 'all' | 'mine' | Country;

export default function News() {
  const { t, pick, meta, locale, date } = useI18n();
  const { c } = useTheme();
  const { state, set } = useStore();
  const insets = useSafeAreaInsets();
  const lang = meta.siteLocale;
  // "My roads": the countries of the v2 routes the user follows (3B).
  const myCountries = [...new Set(state.following.flatMap((k) => routeV2(k)?.country ?? []))] as Country[];
  const mine = myCountries.length > 0;

  const [feed, setFeed] = useState<Feed | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'offline' | 'error'>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>(mine ? 'mine' : 'all');

  const load = useCallback(
    async (pull = false) => {
      if (pull) setRefreshing(true);
      const cached = await cachedFeed(lang);
      if (cached && !pull) setFeed(cached);
      try {
        setFeed(await fetchFeed(lang));
        setStatus('ok');
      } catch {
        setStatus(cached ? 'offline' : 'error');
      } finally {
        setRefreshing(false);
      }
    },
    [lang],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const countries = filter === 'mine' ? myCountries : filter === 'all' ? null : [filter];
  const items = (feed?.items ?? []).filter((i) => !countries || i.countries.some((k) => countries.includes(k)));

  const open = (item: NewsItem) => {
    if (!state.newsRead) set({ newsRead: true });
    void WebBrowser.openBrowserAsync(item.link);
  };

  const header = (
    <View style={{ gap: space.s4, paddingTop: insets.top + space.s4, paddingBottom: space.s3 }}>
      <Heading>{t('news.title')}</Heading>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.s2, paddingVertical: 4 }} style={{ marginHorizontal: -space.s6 }}>
        <View style={{ width: space.s6 - space.s2 }} />
        {mine ? <Chip label={t('news.myRoads')} selected={filter === 'mine'} onPress={() => setFilter('mine')} /> : null}
        <Chip label={t('news.all')} selected={filter === 'all'} onPress={() => setFilter('all')} />
        {FILTERS.map((f) => (
          <Chip key={f} label={pick(COUNTRY_NAMES[f]).text} selected={filter === f} onPress={() => setFilter(f)} />
        ))}
        <View style={{ width: space.s6 - space.s2 }} />
      </ScrollView>
      {locale !== 'en' && locale !== 'fa' ? (
        <T variant="caption" tone="fgMuted">
          {t('news.englishFeed')}
        </T>
      ) : null}
      {status === 'offline' && feed ? <Banner text={t('common.offline', { date: date(feed.savedAt) })} action={t('common.retry')} onAction={() => void load(true)} /> : null}
      <View style={{ height: 1, backgroundColor: c.fg }} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.link}
        contentContainerStyle={{ paddingHorizontal: space.s6, paddingBottom: space.s10 }}
        ListHeaderComponent={header}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor={c.fg} colors={[c.fg]} />}
        ListEmptyComponent={
          status === 'loading' ? (
            <View accessibilityRole="progressbar" style={{ gap: space.s4, paddingTop: space.s4 }}>
              {[0, 1, 2].map((k) => (
                <View key={k} style={{ height: 72, backgroundColor: c.rule }} />
              ))}
            </View>
          ) : status === 'error' ? (
            <View style={{ gap: space.s3, paddingTop: space.s4 }}>
              <T variant="body">{t('news.error')}</T>
              <Button kind="secondary" icon={null} label={t('common.retry')} onPress={() => void load(true)} />
            </View>
          ) : (
            <View style={{ gap: space.s3, paddingTop: space.s4 }}>
              <T variant="body">{t('news.empty')}</T>
              <Button kind="secondary" icon={null} label={t('news.showAll')} onPress={() => setFilter('all')} />
            </View>
          )
        }
        renderItem={({ item }) => {
          const where = item.countries.map((k) => pick(COUNTRY_NAMES[k]).text).join(' · ');
          const when = item.date ? date(item.date) : '';
          const first = item.countries.find((k) => k in COUNTRY_PHOTO) as keyof typeof COUNTRY_PHOTO | undefined;
          const photo = first ? COUNTRY_PHOTO[first] : undefined;
          return (
            <Pressable
              onPress={() => open(item)}
              accessibilityRole="link"
              accessibilityLabel={[where, item.title, t('news.analysis'), when].filter(Boolean).join(', ')}
              accessibilityHint={t('common.opensBrowser')}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: space.s4, paddingVertical: space.s4, borderBottomWidth: 1, borderBottomColor: c.rule, backgroundColor: pressed ? c.rowPressed : 'transparent' })}
            >
              <View style={{ flex: 1, gap: space.s2 }}>
              {where ? (
                <T variant="label" tone="fgMuted">
                  {where}
                </T>
              ) : null}
              <T variant="headline">{item.title}</T>
              <T variant="caption" tone="fgMuted">
                {t('news.analysis')} · {when}
              </T>
              </View>
              {photo ? <Image source={photo} style={{ width: 64, height: 64 }} contentFit="cover" accessible={false} /> : null}
            </Pressable>
          );
        }}
      />
      <View accessible={false} pointerEvents="none" style={{ position: 'absolute', top: 0, start: 0, end: 0, height: insets.top, backgroundColor: c.bg }} />
    </View>
  );
}
