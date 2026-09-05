// ============================================================================
// scripts/fix-fa-article-links.ts
// Persian articles published before the Persian site had its own IA link to
// paths that now 301 to English. Re-run enforceLinks with the new Persian
// inventory: retired paths lose their <a> and keep their words.
//
//   npx tsx scripts/fix-fa-article-links.ts          # report only
//   npx tsx scripts/fix-fa-article-links.ts --write  # apply
// ============================================================================
import prisma from '../lib/prisma';
import { buildInventory } from '../lib/autopilot/inventory';
import { enforceLinks } from '../lib/autopilot/text';

async function main() {
  const write = process.argv.includes('--write');
  const inv = await buildInventory('fa');
  const articles = await prisma.article.findMany({
    where: { locale: 'fa' },
    select: { id: true, slug: true, content: true },
  });

  let changed = 0;
  for (const a of articles) {
    if (!a.content) continue;
    const { html } = enforceLinks(a.content, inv);
    if (html === a.content) continue;
    changed++;
    console.log(`${write ? 'fixing' : 'would fix'}  ${a.slug}`);
    if (write) {
      await prisma.article.update({ where: { id: a.id }, data: { content: html } });
    }
  }

  console.log(`\n${changed}/${articles.length} Persian articles ${write ? 'updated' : 'need updating'}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
