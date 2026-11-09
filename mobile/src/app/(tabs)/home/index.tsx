// Home, "Today" (spec 2026-11-09 §6, amendment 6): three blocks and nothing
// else. The next step on the first road the user can run (or the closest road
// from the assessment, or the two doors), the Express Entry score beside the
// last general draw, and the newest news on their countries. No % anywhere on
// Home: the figure and its coverage live on the results screen.
import * as WebBrowser from 'expo-web-browser';
import { router, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { toUsdExact } from '@shared/fx';
import { ROUTES_V2, routeV2 } from '@shared/routes-v2';
import { extrasOf } from '@shared/routes-v2/extras';
import { rank } from '@shared/routes-v2/match';
import { preferredFamily, toProfile } from '@/content/assessment';
import { cachedFeed, fetchFeed, type NewsItem } from '@/content/news';
import { COUNTRY_NAMES, type Country } from '@/content/routes';
import { latestGeneral, scoreOf, type SavedDraws } from '@/engine/crs';
import { cachedDraws, fetchDraws } from '@/engine/crs-draws';
import { nextStep, type NextStep } from '@/engine/next-step';
import { useI18n } from '@/i18n/I18nProvider';
import { useStore } from '@/state/store';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { Doors } from '@/ui/Doors';
import { Flag } from '@/ui/Flag';
import { Icon } from '@/ui/Icon';
import { DisclaimerWithAbout } from '@/ui/InfoSheets';
import { Heading, Label, LinkRow, Ruled, Screen } from '@/ui/kit';
import { T } from '@/ui/T';

const routePage = (key: string, tab: 'do' | 'rules') => `/(tabs)/countries/route/${key}?tab=${tab}` as Href;

/** The one action on the acid card, ink on acid in both modes. */
function AcidAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" hitSlop={4} style={({ pressed }) => ({ minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: space.s2, opacity: pressed ? 0.6 : 1 })}>
      <T variant="row" weight="bold" tone="onAccent" style={{ flexShrink: 1, textDecorationLine: 'underline' }}>
        {label}
      </T>
      <Icon name="chevron" tone="onAccent" />
    </Pressable>
  );
}

function AcidCard({ eyebrow, country, header, lines, action, onPress }: { eyebrow: string; country?: Country; header: string; lines: string[]; action: string; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <View style={{ backgroundColor: c.accent, paddingHorizontal: space.s4, paddingTop: space.s4, paddingBottom: space.s2, gap: space.s2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2 }}>
        {country ? <Flag country={country} width={20} /> : null}
        <T variant="caption" weight="bold" tone="onAccent" style={{ flexShrink: 1 }}>
          {eyebrow}
        </T>
      </View>
      <T variant="headline" tone="onAccent" accessibilityRole="header">
        {header}
      </T>
      {lines.map((l) => (
        <T key={l} variant="caption" tone="onAccent">
          {l}
        </T>
      ))}
      <AcidAction label={action} onPress={onPress} />
    </View>
  );
}

function NextCard({ next }: { next: Exclude<NextStep, { kind: 'fresh' }> }) {
  const { t, pick, count } = useI18n();
  if (next.kind === 'all-blocked') {
    return <T variant="body">{t('today.allBlocked')}</T>;
  }
  const route = routeV2(next.routeKey);
  if (!route) return null;
  const name = pick(route.name).text;
  const eyebrow = `${name} · ${pick(COUNTRY_NAMES[route.country as Country]).text}`;
  if (next.kind === 'all-done') {
    return <T variant="body">{t('today.allDone', { route: name })}</T>;
  }
  if (next.kind === 'best-match') {
    const close = next.close === 0 ? t('today.closeNone') : next.close === 1 ? t('today.closeOne') : t('today.closeN', { n: count(next.close) });
    return <AcidCard eyebrow={t('today.closest')} country={route.country as Country} header={name} lines={[close]} action={t('today.seeRules')} onPress={() => router.push(routePage(route.key, 'rules'))} />;
  }
  const takes = next.step.takes ? pick(next.step.takes).text : null;
  return (
    <AcidCard
      eyebrow={eyebrow}
      country={route.country as Country}
      header={t('today.stepOf', { n: count(next.stepIndex + 1), total: count(next.stepCount), title: pick(next.step.title).text })}
      lines={takes ? [t('today.takes', { takes })] : []}
      // "Usually 10 working days" carries its source: the route page's Do segment shows it with the checked date.
      action={takes ? t('today.takesSource') : t('today.openSteps')}
      onPress={() => router.push(routePage(route.key, 'do'))}
    />
  );
}

function ExpressCard({ show }: { show: boolean }) {
  const { t, count, date } = useI18n();
  const { c } = useTheme();
  const { state } = useStore();
  const [draws, setDraws] = useState<SavedDraws | null>(null);
  const hasCrs = !!state.crsAt && Object.keys(state.crs).length > 0;
  useEffect(() => {
    if (!hasCrs) return;
    let live = true;
    void cachedDraws().then((d) => live && d && setDraws((cur) => cur ?? d));
    fetchDraws()
      .then((d) => live && setDraws(d))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [hasCrs]);
  if (!hasCrs && !show) return null;
  if (!hasCrs) {
    return <LinkRow icon="calculator" label={t('today.eeStart')} onPress={() => router.push('/(tabs)/assess/express-entry')} />;
  }
  const n = count(scoreOf(state.crs));
  const general = draws ? latestGeneral(draws.rounds) : null;
  // Like with like only (amendment 4): a category draw is never set against the user's score.
  const line = !draws ? t('today.eeNoDraws', { n }) : general ? t('today.eeLine', { n, cutoff: count(general.crsCutoff), date: date(general.date) }) : t('today.eeNoGeneral', { n });
  return (
    <Pressable
      onPress={() => router.push('/(tabs)/assess/express-entry')}
      accessibilityRole="button"
      accessibilityLabel={`${t('today.ee')}. ${line}`}
      accessibilityHint={t('today.eeOpen')}
      style={({ pressed }) => ({ borderWidth: 1.5, borderColor: c.fg, minHeight: 56, paddingHorizontal: space.s4, paddingVertical: space.s3, flexDirection: 'row', alignItems: 'center', gap: space.s3, backgroundColor: pressed ? c.rowPressed : 'transparent' })}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <T variant="row" weight="bold">
          {t('today.ee')}
        </T>
        <T variant="caption" tone="fgMuted">
          {line}
        </T>
      </View>
      <Icon name="chevron" tone="fgMuted" />
    </Pressable>
  );
}

type Item = NewsItem & { slug?: string };

function CountryNews({ countries }: { countries: Country[] }) {
  const { t, meta } = useI18n();
  const [items, setItems] = useState<Item[]>([]);
  const lang = meta.siteLocale;
  useEffect(() => {
    let live = true;
    const take = (list: Item[]) => live && setItems(list);
    void cachedFeed(lang).then((f) => f && take(f.items));
    fetchFeed(lang)
      .then((f) => take(f.items))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [lang]);
  const newest = items
    .filter((i) => i.countries.some((k) => countries.includes(k)))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 2);
  if (!newest.length) return null;
  return (
    <View>
      <Label>{t('today.news')}</Label>
      <Ruled>
        {newest.map((i) => (
          <LinkRow
            key={i.link}
            external={!i.slug}
            label={i.title}
            lang={lang}
            onPress={() => (i.slug ? router.push(`/(tabs)/news/${i.slug}` as Href) : void WebBrowser.openBrowserAsync(i.link))}
          />
        ))}
      </Ruled>
    </View>
  );
}

export default function Home() {
  const { t } = useI18n();
  const { state } = useStore();
  const passport = state.assess.citizenship && state.assess.citizenship !== 'skip' ? state.assess.citizenship : null;
  const ranked = state.assessAt ? rank(ROUTES_V2, toProfile(state.assess), toUsdExact, preferredFamily(state.assess)) : null;
  const next = nextStep({ following: state.following, journey: state.journey, passport, ranked, routeOf: routeV2, stepsOf: (k) => extrasOf(k)?.steps });
  const followed = state.following.map((k) => routeV2(k)).filter((r) => !!r);
  // Following nothing yet: news follows the countries of the closest roads instead.
  const countries = [...new Set((followed.length ? followed.map((r) => r.country) : (ranked ?? []).slice(0, 3).map((m) => routeV2(m.route)!.country)) as Country[])];
  const showExpress = followed.some((r) => r.country === 'CA') || state.assess.goal === 'express';

  return (
    <Screen>
      <Heading>{t('today.title')}</Heading>
      {next.kind === 'fresh' ? (
        <>
          <T variant="body" tone="fgMuted">
            {t('home.emptyLead')}
          </T>
          <Doors onRoad={() => router.navigate('/(tabs)/countries')} onAssess={() => router.push('/assessment')} />
        </>
      ) : (
        <NextCard next={next} />
      )}
      <ExpressCard show={showExpress} />
      <CountryNews countries={countries} />
      <DisclaimerWithAbout />
    </Screen>
  );
}
