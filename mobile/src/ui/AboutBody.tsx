// Who we are, in four paragraphs: the Me › About screen (Settings) and the
// About sheet opened from a disclaimer both render this, so the two never drift.
import { useI18n } from '@/i18n/I18nProvider';
import { T } from './T';

export function AboutBody() {
  const { t } = useI18n();
  return (
    <>
      {(['p1', 'p2', 'p3', 'p4'] as const).map((p) => (
        <T key={p} variant="body" weight={p === 'p2' ? 'bold' : 'regular'}>
          {t(`about.${p}`)}
        </T>
      ))}
    </>
  );
}
