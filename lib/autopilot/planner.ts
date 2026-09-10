// ============================================================================
// lib/autopilot/planner.ts
// Topic selection — anchored to the site and the immigration calendar,
// avoiding what we already wrote. This is what replaces the static
// keywords.json queue: topics come from what the site can actually answer
// and link to, not from a list of generic search terms.
// ============================================================================
import type { Locale } from '@/lib/seo';
import { BRAND_FACTS, linkBlock, type Inventory } from './inventory';
import { pickTopics, topicToBrief } from '@/content/fa/topics';
import { keywordsForToday } from '@/content/keywords';
import { chatJson, WRITER_MODEL } from './pipeline';

export type Brief = {
  category: string; // one of inventory.categories[].name
  workingTitle: string;
  angle: string;
  whyNow: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchQueryEn: string;
  mustLink: string[]; // paths from the inventory only
  imageScenes: [string, string];
  depth: 'standard' | 'deep';
  /**
   * The backlog topic this brief came from, when it came from one. Recorded on
   * the article so a later run can tell what has been written without having
   * to recognise a title the writer rewrote.
   */
  topicSlug?: string;
};

/** What is on a founder's or skilled worker's mind this month. */
export function seasonalHooks(now = new Date()): string[] {
  const m = now.getMonth() + 1;
  const hooks: string[] = ['Express Entry candidates should verify recent draw types and results with IRCC before acting'];
  if (m >= 1 && m <= 2) hooks.push('Verify current federal immigration levels and provincial nomination availability with the responsible authority', 'Founders comparing H-1B with EB-2 NIW should verify current USCIS instructions and dates');
  if (m >= 2 && m <= 4) hooks.push('First-year Canadian filers can verify current tax deadlines and registered-account rules with the responsible authority');
  if (m >= 3 && m <= 5) hooks.push('Founders considering a designated organisation should verify its current status directly with IRCC');
  if (m >= 6 && m <= 8) hooks.push('Families planning a move should verify current school registration and provincial immigration information');
  if (m >= 8 && m <= 10) hooks.push('Students and graduates should verify current study-permit and PGWP rules with IRCC');
  if (m >= 10 && m <= 12) hooks.push('Applicants planning next year should verify published federal, provincial and US programme updates with the responsible authorities');
  if (m === 3) hooks.push('Nowruz — Persian founders planning the year');
  return hooks;
}

type RawBrief = Partial<Record<keyof Brief, unknown>>;

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String).map((s) => s.trim()).filter(Boolean) : [];
}

function coerce(raw: RawBrief, inv: Inventory): Brief | null {
  const known = new Set(inv.targets.map((t) => t.path));
  const catNames = inv.categories.map((c) => c.name);
  const category = catNames.find((c) => c.toLowerCase() === String(raw.category ?? '').toLowerCase()) ?? catNames[0];
  const mustLink = asStringArray(raw.mustLink).filter((p) => known.has(p));
  const scenes = asStringArray(raw.imageScenes);
  const workingTitle = String(raw.workingTitle ?? '').trim();
  if (!workingTitle || !category || mustLink.length === 0 || scenes.length < 2) return null;
  return {
    category,
    workingTitle,
    angle: String(raw.angle ?? '').trim(),
    whyNow: String(raw.whyNow ?? '').trim(),
    primaryKeyword: String(raw.primaryKeyword ?? '').trim(),
    secondaryKeywords: asStringArray(raw.secondaryKeywords),
    searchQueryEn: String(raw.searchQueryEn ?? '').trim(),
    mustLink,
    imageScenes: [scenes[0], scenes[1]],
    depth: raw.depth === 'deep' ? 'deep' : 'standard',
  };
}

/** Plan `n` briefs for today. Categories least recently covered come first. */
export async function planBriefs(n: number, inv: Inventory): Promise<Brief[]> {
  // Persian draws from the human-picked backlog first. Left to itself the
  // planner writes about whatever the site already covers — in practice,
  // Canada — while the questions that justify a Persian magazine at all are
  // the ones no English article here will ever answer. When the backlog is
  // exhausted the model plans the remainder as before, so the lane never
  // stops for want of a topic.
  if (inv.locale === 'fa') {
    const picked = pickTopics(n, inv.recentTitles, inv.recentTopicSlugs).map(topicToBrief);
    if (picked.length >= n) {
      console.log(`autopilot/planner: ${picked.length}/${n} briefs from the Persian backlog`);
      return picked.slice(0, n);
    }
    if (picked.length) {
      console.log(`autopilot/planner: ${picked.length} from the Persian backlog, ${n - picked.length} to plan`);
      const rest = await planBriefsWithModel(n - picked.length, inv);
      return [...picked, ...rest].slice(0, n);
    }
  }
  return planBriefsWithModel(n, inv);
}

async function planBriefsWithModel(n: number, inv: Inventory): Promise<Brief[]> {
  const counts = new Map<string, number>();
  for (const c of inv.categories) counts.set(c.name, 0);
  for (const c of inv.recentCategories) if (counts.has(c)) counts.set(c, (counts.get(c) ?? 0) + 1);
  const wanted = [...counts.entries()].sort((a, b) => a[1] - b[1]).map(([name]) => name).slice(0, Math.max(n, 3));

  const lang = inv.locale === 'fa' ? 'Persian (Farsi)' : 'English';
  // Three candidates per brief, so the model has room to choose one it can
  // write a real article to without being handed the same head of the list
  // every morning.
  const keywords = keywordsForToday(inv.locale, inv.usedKeywords, n * 3);
  const keywordRule = keywords.length
    ? `TARGET KEYWORDS — this is the queue, not a suggestion. Choose ${n} of these, one per brief, and set primaryKeyword to the chosen keyword EXACTLY as written here. Build the brief around what someone searching it actually wants; if a keyword is too thin for an article on its own, widen it into the decision behind it rather than swapping it for a different subject. Never reuse one across two briefs.
${keywords.map((k) => `- ${k}`).join('\n')}`
    : 'The keyword queue is empty, so choose the keyword yourself: one specific search a founder or skilled professional would actually type.';
  const { briefs } = await chatJson<{ briefs: RawBrief[] }>(
    `You are the content editor of Startup Visa Roads (visaroads.com). Plan ${n} article briefs for today, to be written in ${lang}.

BRAND FACTS: ${BRAND_FACTS}

Editorial line: useful, specific, grounded in a decision a founder or skilled professional actually faces — which programme, which province, which document, in what order, what gets cases refused. Never generic listicles ("10 tips…"). Each brief answers one real question and links to real pages on the site.
Prefer these categories today (least recently covered): ${wanted.join(', ')}.

${keywordRule}
Today: ${new Date().toISOString().slice(0, 10)}. Calendar hooks: ${seasonalHooks().join('; ')}.

INVENTORY of linkable paths (mustLink only from here; at least two per brief, one of them a programme page):
${linkBlock(inv)}

Already written in ${lang} (do not repeat, do not paraphrase, do not write the same topic from a slightly different angle):
${inv.recentTitles.map((t) => `- ${t}`).join('\n') || '(nothing yet)'}

Rules:
- workingTitle: a statement or how-to, not a rhetorical question, ≤ 70 characters, specific (a programme, a province or a document in it). In ${lang}.
- Each brief has a distinct angle; no two briefs about the same programme.
- At least one brief tied to a calendar hook; at least one comparison piece (two programmes or two provinces side by side).
- depth: "deep" for a core pathway guide (EB-2 NIW evidence, active PNP comparison) — 2000–2800 words; "standard" otherwise — 1100–1500 words. At most one "deep" per day.
- imageScenes: two sentences for an editorial photograph, cover then inline — a concrete object, workspace or place, no people's faces, no text, no flags.
- category: exactly one of ${JSON.stringify(inv.categories.map((c) => c.name))}.

Return JSON: {"briefs":[{"category","workingTitle","angle","whyNow","primaryKeyword","secondaryKeywords":[],"searchQueryEn","mustLink":[],"imageScenes":["",""],"depth"}]}`,
    0.8,
  );

  const out: Brief[] = [];
  for (const raw of briefs ?? []) {
    const b = coerce(raw, inv);
    if (b) out.push(b);
    else console.warn('autopilot/planner: dropped malformed brief', JSON.stringify(raw).slice(0, 200));
  }
  // At most one deep guide per run, whatever the model marked.
  let deepSeen = false;
  for (const b of out) {
    if (b.depth === 'deep') {
      if (deepSeen) b.depth = 'standard';
      deepSeen = true;
    }
  }
  console.log(`autopilot/planner: ${out.length}/${n} briefs (${WRITER_MODEL})`);
  return out.slice(0, n);
}
