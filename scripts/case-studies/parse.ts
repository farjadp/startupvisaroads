// Stage 2: parse the cached decision into numbered paragraphs, JUDGMENT block
// and certified question. Writes parsed.json (no party names) and
// parties.private.json (names, used only as the anonymiser's list) next to the
// raw file, outside git.
// Usage: npx tsx scripts/case-studies/parse.ts "2025 FC 12" | --all
import { dispositionFromJudgment, remittedFromJudgment } from '../../lib/case-studies/fc-parser';
import { cliCitations, parseCached, runMain, writeJson } from './lib/case-files';

async function parseOne(citation: string): Promise<void> {
  const parsed = await parseCached(citation);
  const { private: priv, ...pub } = parsed;
  writeJson(citation, 'parsed.json', pub);
  writeJson(citation, 'parties.private.json', priv);
  const j = parsed.judgmentText ?? '';
  console.log(
    `${citation}: ${Object.keys(parsed.paragraphs).length} paras, analysis from ${parsed.analysisStartPara ?? '?'}, ` +
      `disposition=${dispositionFromJudgment(j)}, remitted=${remittedFromJudgment(j)}, certified=${parsed.certifiedQuestionStatus}` +
      (parsed.warnings.length ? `, warnings: ${parsed.warnings.join('; ')}` : ''),
  );
}

runMain(async () => {
  for (const c of cliCitations(process.argv, 'parse.ts "<citation>" | --all')) await parseOne(c);
});
