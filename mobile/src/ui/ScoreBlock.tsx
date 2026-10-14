// The score, its level and the readiness sentence, read as one element
// (spec 20). The sentence is never optional (gamification rule 1).
import { View } from 'react-native';
import { useI18n } from '@/i18n/I18nProvider';
import type { Level } from '@/engine/readiness';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { Progress } from './kit';
import { T } from './T';

export function ScoreBlock({ score, level, next, pointsToNext }: { score: number; level: Level; next?: Level; pointsToNext?: number }) {
  const { t, count } = useI18n();
  const { c } = useTheme();
  const levelName = t(`levels.${level}`);
  const spoken = `${t('result.spoken', { score, level: levelName })} ${t('common.readiness')}`;
  return (
    <View accessible accessibilityLabel={spoken} style={{ gap: space.s2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'wrap', gap: space.s3 }}>
        <T variant="figure">{count(score)}</T>
        <T variant="row" tone="fgMuted" style={{ marginBottom: 8 }}>
          {t('result.scoreLabel')}
        </T>
        <View style={{ marginStart: 'auto', marginBottom: 8, paddingHorizontal: space.s3, paddingVertical: 6, backgroundColor: c.accent }}>
          <T variant="label" tone="onAccent">
            {levelName}
          </T>
        </View>
      </View>
      <Progress value={score} />
      <T variant="caption" tone="fgMuted">
        {next && pointsToNext ? `${t('result.toNext', { n: count(pointsToNext), level: t(`levels.${next}`) })} · ` : ''}
        {t('common.readiness')}
      </T>
    </View>
  );
}
