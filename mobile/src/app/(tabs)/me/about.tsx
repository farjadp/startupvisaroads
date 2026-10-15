import { useI18n } from '@/i18n/I18nProvider';
import { Screen } from '@/ui/kit';
import { T } from '@/ui/T';

export default function About() {
  const { t } = useI18n();
  return (
    <Screen edges={[]}>
      {(['p1', 'p2', 'p3', 'p4'] as const).map((p) => (
        <T key={p} variant="body" weight={p === 'p2' ? 'bold' : 'regular'}>
          {t(`about.${p}`)}
        </T>
      ))}
    </Screen>
  );
}
