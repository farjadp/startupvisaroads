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
  'Global Talent & Compliance'
];

export async function ensureDefaultCategories() {
  const count = await prisma.category.count();
  if (count === 0) {
    console.log('Seeding default categories...');
    for (const name of DEFAULT_CATEGORIES) {
      const slug = slugify(name, { lower: true, strict: true }) || 'general';
      await prisma.category.create({
        data: { name, slug }
      });
    }
  }
}
