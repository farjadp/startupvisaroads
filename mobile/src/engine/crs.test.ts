// Run: npm test
// The site engine (lib/express-entry) is written for bundlers: extensionless
// imports, a TypeScript enum, JSON without import attributes, and the app reads
// it through the @shared alias. These hooks let plain node:test load it as it is.
import { registerHooks, stripTypeScriptTypes } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const LIB = new URL('../../../lib/', import.meta.url);
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith('@shared/')) specifier = new URL(`${specifier.slice('@shared/'.length)}.ts`, LIB).href;
    else if (context.parentURL?.includes('/lib/express-entry/') && specifier.startsWith('.') && !/\.(ts|json)$/.test(specifier)) {
      specifier = new URL(`${specifier}.ts`, context.parentURL).href;
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.endsWith('.json')) return { format: 'module', source: `export default ${readFileSync(fileURLToPath(url), 'utf8')};`, shortCircuit: true };
    if (url.includes('/lib/express-entry/') && url.endsWith('.ts')) {
      return { format: 'module', source: stripTypeScriptTypes(readFileSync(fileURLToPath(url), 'utf8'), { mode: 'transform' }), shortCircuit: true };
    }
    return next(url, context);
  },
});

const crs = await import(pathToFileURL(fileURLToPath(new URL('./crs.ts', import.meta.url))).href);
const { bestGain, categoriesForNoc, cleanInputs, daysSince, latestGeneral, parseDraws, resultOf, scoreOf, searchNoc, GRID } = crs as typeof import('./crs.ts');
type CrsInputs = import('./crs.ts').CrsInputs;

const grid = JSON.parse(readFileSync(new URL('../../../config/crs-points.json', import.meta.url), 'utf8'));

// Profile 1: single, 30, master's, CLB 9 in all four, 3 years foreign work, nothing in Canada.
const single: Partial<CrsInputs> = {
  age: '30', marital: 'single', firstLanguage: 'english',
  speaking: '9', listening: '9', reading: '9', writing: '9', secondLanguage: 'none',
  education: '6', foreignWork: '3', canadianWork: '0', highWage: 'none', certificate: 'no',
  canadianEducation: 'none', jobOffer: 'none', nomination: 'no', sibling: 'no',
};

test('profile 1 by hand: 105 + 135 + 4×31 core, 50 + 50 transferability = 464', () => {
  const core = grid.coreHumanCapital;
  const byHand =
    core.age.withoutSpouse['30'] + // 105
    core.education.withoutSpouse['6'] + // 135
    4 * core.firstOfficialLanguage.withoutSpouse.clb9.perAbility + // 124
    Math.min(grid.skillTransferability.educationLanguage.twoPlusOrMastersOrHigherAndCLB9plus + grid.skillTransferability.foreignExpLanguage.foreignExp3plusYearsAndCLB9plus, grid.skillTransferability.maxTotal); // 100
  assert.equal(byHand, 464);
  const r = resultOf(single);
  assert.equal(r.total, 464);
  assert.equal(r.breakdown.coreHumanCapital.subtotal, 364);
  assert.equal(r.breakdown.skillTransferability.subtotal, 100);
  assert.equal(r.breakdown.additionalPoints.subtotal, 0);
});

// Profile 2: married, spouse coming, 30, bachelor's, CLB 8 in all four, 2 years foreign, 1 year Canadian;
// spouse bachelor's, CLB 7, no Canadian work.
const couple: Partial<CrsInputs> = {
  age: '30', marital: 'married', spouseComing: 'yes', firstLanguage: 'english',
  speaking: '8', listening: '8', reading: '8', writing: '8',
  education: '4', foreignWork: '2', canadianWork: '1', highWage: 'none',
  spouseEducation: '4', spouseLanguage: '7', spouseCanadianWork: '0',
};

test('profile 2 by hand: core 95 + 112 + 88 + 35, spouse 8 + 12, transferability 4×13 = 402', () => {
  const core = grid.coreHumanCapital;
  const st = grid.skillTransferability;
  const coreSum = core.age.withSpouse['30'] + core.education.withSpouse['4'] + 4 * core.firstOfficialLanguage.withSpouse.clb8.perAbility + core.canadianWorkExperience.withSpouse['1'];
  const spouse = grid.spouseFactors.education.points['4'] + 4 * grid.spouseFactors.firstOfficialLanguage.points.clb7.perAbility;
  const transfer = st.educationLanguage.postSecondaryAndCLB7to8 + st.educationCanadianExperience.postSecondaryAnd1Year + st.foreignExpLanguage.foreignExp1to2YearsAndCLB7to8 + st.foreignExpCanadianExp.foreignExp1to2YearsAndCanadian1Year;
  assert.deepEqual([coreSum, spouse, transfer], [330, 20, 52]);
  const r = resultOf(couple);
  assert.equal(r.total, 402);
  assert.equal(r.breakdown.coreHumanCapital.subtotal, 330);
  assert.equal(r.breakdown.spouseFactors.subtotal, 20);
  assert.equal(r.breakdown.skillTransferability.subtotal, 52);
  assert.equal(r.breakdown.labourMarketIntegration.applied, 'experience');
});

test('a spouse who is not coming uses the single tables', () => {
  assert.equal(scoreOf({ ...single, marital: 'married', spouseComing: 'no', spouseEducation: '7', spouseLanguage: '10' }), 464);
});

test('empty rows score nothing; the grid total comes from config', () => {
  assert.equal(scoreOf({}), 0);
  assert.equal(GRID.maxTotal, grid.maxTotal);
  assert.equal(GRID.rulesVersion, grid.rulesVersion);
});

test('French as the second language at NCLC 7+ adds the French points', () => {
  const withFrench = scoreOf({ ...single, secondLanguage: '7' });
  // Second language 4×3 = 12, French bonus with English CLB 5+ = 50.
  assert.equal(withFrench - 464, 4 * grid.coreHumanCapital.secondOfficialLanguage.withoutSpouse.clb7.perAbility + grid.additionalPoints.frenchLanguage.tier2_englishCLB5plusAllAbilities);
});

test('most points: one year of Canadian work for profile 1 (+40, transferability is already at 100)', () => {
  const g = bestGain(single);
  assert.deepEqual(g && { field: g.field, to: g.to, gain: g.gain }, { field: 'canadianWork', to: '1', gain: 40 });
});

test('most points never moves age, marital status, spouse, sibling or offers', () => {
  const g = bestGain({ age: '30', marital: 'married', spouseComing: 'yes', nomination: 'no', sibling: 'no', jobOffer: 'none', spouseEducation: '0' });
  assert.equal(g, null);
});

test('raising all four abilities together is tried', () => {
  const g = bestGain({ ...single, speaking: '8', listening: '8', reading: '8', writing: '8', foreignWork: '3', canadianWork: '5', highWage: '2x', education: '7', canadianEducation: 'threeOrMore', certificate: 'yes', secondLanguage: '10' });
  assert.equal(g?.field, 'allFour');
  assert.equal(g?.to, '9');
});

test('stored inputs are cleaned', () => {
  assert.deepEqual(cleanInputs({ age: '30', speaking: '11', noc: '21231', foo: 'x', education: 6 }), { age: '30', noc: '21231' });
  assert.deepEqual(cleanInputs(null), {});
});

test('NOC search and the categories that list it', () => {
  assert.ok(searchNoc('2123').every((n) => n.code.startsWith('2123')));
  assert.ok(searchNoc('software').length > 0);
  const nurse = searchNoc('registered nurses')[0];
  assert.ok(nurse && categoriesForNoc(nurse.code).some((c) => c.id === 'healthcare'));
  assert.deepEqual(categoriesForNoc(undefined), []);
});

const round = (drawNumber: number, date: string, roundType: string, program = roundType) => ({ drawNumber, date, roundType, program, crsCutoff: 500, invitations: 1000 });

test('the last general draw is a general round, never a category or programme round', () => {
  const feed = parseDraws({ source: 's', fetchedAt: 'f', rounds: [round(3, '2026-10-28', 'Transport Occupations, 2026-Version 2'), round(2, '2026-10-15', 'Canadian Experience Class'), round(1, '2026-09-01', 'Provincial Nominee Program')] });
  assert.ok(feed);
  assert.equal(latestGeneral(feed.rounds), null);
  const withGeneral = parseDraws({ source: 's', rounds: [round(1, '2026-08-01', 'No Program Specified'), round(2, '2026-10-01', 'French-Language proficiency')] });
  assert.equal(withGeneral?.rounds[0].drawNumber, 2, 'newest first');
  assert.equal(latestGeneral(withGeneral!.rounds)?.drawNumber, 1);
  assert.equal(latestGeneral([round(5, '2026-01-01', 'General')])?.drawNumber, 5);
  assert.equal(parseDraws({ rounds: 'x' }), null);
});

test('days since the draws were saved', () => {
  assert.equal(daysSince('2026-11-01', new Date(2026, 10, 9, 23, 30)), 8);
  assert.equal(daysSince('2026-11-09', new Date(2026, 10, 9, 0, 5)), 0);
});
