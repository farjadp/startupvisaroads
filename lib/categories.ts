import prisma from '@/lib/prisma';
import slugify from 'slugify';

export const DEFAULT_CATEGORIES = [
  'Canada Startup Visa',
  'Canada PNP',
  'USA Business & Talent',
  'European Visas',
  'Australia Entrepreneurship',
  'UAE Golden Visa',
  'Mentorship & Business Planning',
  'Global Talent & Compliance',
  // The reader-first pillars (lib/autopilot/pillars.ts, 26 Oct 2026). Every
  // category above is a business route, so a study or family article had
  // nowhere to go but "European Visas".
  'Work & Skilled Immigration',
  'Study Abroad',
  'Life & Family Abroad',
];

/**
 * Create whichever default categories the table lacks. It used to seed only
 * an empty table, which meant a category added to the list above never
 * reached a database that already had rows.
 */
export async function ensureDefaultCategories() {
  const existing = new Set((await prisma.category.findMany({ select: { slug: true } })).map((c) => c.slug));
  const missing = DEFAULT_CATEGORIES.filter((name) => !existing.has(slugify(name, { lower: true, strict: true }) || 'general'));
  if (missing.length) {
    console.log(`Seeding categories: ${missing.join(', ')}`);
    for (const name of missing) {
      const slug = slugify(name, { lower: true, strict: true }) || 'general';
      try {
        await prisma.category.upsert({
          where: { slug },
          update: {},
          create: { name, slug }
        });
      } catch (err) {
        // Ignore unique constraint or parallel insert errors
        console.warn(`Parallel seeding ignored/handled for ${slug}`);
      }
    }
  }
}
