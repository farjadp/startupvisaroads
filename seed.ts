import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const category1 = await prisma.category.upsert({
    where: { slug: 'policy' },
    update: {},
    create: { name: 'Policy', slug: 'policy' }
  });

  const category2 = await prisma.category.upsert({
    where: { slug: 'venture' },
    update: {},
    create: { name: 'Venture', slug: 'venture' }
  });

  const category3 = await prisma.category.upsert({
    where: { slug: 'case-study' },
    update: {},
    create: { name: 'Case Study', slug: 'case-study' }
  });

  await prisma.article.createMany({
    data: [
      {
        title: "Canada's SUV Cap: How it affects SaaS Founders",
        slug: "canada-suv-cap-saas-" + Date.now(),
        content: "<p>The recent changes to the Canada Startup Visa program...</p>",
        status: "PUBLISHED",
        locale: "en",
        categoryId: category1.id,
        coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop"
      },
      {
        title: "Structuring Equity for North American VCs",
        slug: "structuring-equity-vcs-" + Date.now(),
        content: "<p>When seeking investment from North American Venture Capitalists...</p>",
        status: "PUBLISHED",
        locale: "en",
        categoryId: category2.id,
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
      },
      {
        title: "MedTech Startup's 8-Month Journey to Toronto",
        slug: "medtech-journey-toronto-" + Date.now(),
        content: "<p>A detailed case study of how a leading MedTech startup relocated to Toronto...</p>",
        status: "PUBLISHED",
        locale: "en",
        categoryId: category3.id,
        coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
      }
    ]
  });

  console.log('Seed data inserted successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
