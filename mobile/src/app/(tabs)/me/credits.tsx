import * as WebBrowser from 'expo-web-browser';
import { ROUTE_ORDER, ROUTES } from '@/content/routes';
import { useI18n } from '@/i18n/I18nProvider';
import { Label, LinkRow, Ruled, Screen } from '@/ui/kit';

export default function Credits() {
  const { pick, t } = useI18n();
  const seen = new Set<string>();
  const photos = ROUTE_ORDER.map((k) => ROUTES[k].photo).filter((p) => !seen.has(p.page) && seen.add(p.page) && p.page.includes('pexels'));
  return (
    <Screen edges={[]}>
      <Ruled>
        {photos.map((p) => (
          <LinkRow key={p.page} external label={pick(p.alt).text} sub={p.credit} onPress={() => void WebBrowser.openBrowserAsync(p.page)} />
        ))}
      </Ruled>
      <Label>{t('credits.flags')}</Label>
      <Ruled>
        <LinkRow external label="flag-icons" sub={t('credits.flagsCredit')} onPress={() => void WebBrowser.openBrowserAsync('https://github.com/lipis/flag-icons')} />
      </Ruled>
    </Screen>
  );
}
