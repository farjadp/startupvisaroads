import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { data } = body;

    if (!data) {
      return NextResponse.json({ error: 'Invalid backup file contents' }, { status: 400 });
    }

    const operations: any[] = [];

    // 1. Restore Settings
    if (data.settings && Array.isArray(data.settings)) {
      for (const item of data.settings) {
        operations.push(
          prisma.setting.upsert({
            where: { key: item.key },
            update: { value: item.value },
            create: { key: item.key, value: item.value },
          })
        );
      }
    }

    // 2. Restore Categories
    if (data.categories && Array.isArray(data.categories)) {
      for (const item of data.categories) {
        operations.push(
          prisma.category.upsert({
            where: { id: item.id },
            update: { name: item.name, slug: item.slug },
            create: { id: item.id, name: item.name, slug: item.slug },
          })
        );
      }
    }

    // 3. Restore Tags
    if (data.tags && Array.isArray(data.tags)) {
      for (const item of data.tags) {
        operations.push(
          prisma.tag.upsert({
            where: { id: item.id },
            update: { name: item.name },
            create: { id: item.id, name: item.name },
          })
        );
      }
    }

    // 4. Restore Articles
    if (data.articles && Array.isArray(data.articles)) {
      for (const item of data.articles) {
        operations.push(
          prisma.article.upsert({
            where: { id: item.id },
            update: {
              title: item.title,
              slug: item.slug,
              excerpt: item.excerpt,
              content: item.content,
              coverImage: item.coverImage,
              status: item.status,
              locale: item.locale,
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
              categoryId: item.categoryId,
              sharedToLinkedin: item.sharedToLinkedin ?? false,
              sharedToTwitter: item.sharedToTwitter ?? false,
              sharedToFacebook: item.sharedToFacebook ?? false,
            },
            create: {
              id: item.id,
              title: item.title,
              slug: item.slug,
              excerpt: item.excerpt,
              content: item.content,
              coverImage: item.coverImage,
              status: item.status,
              locale: item.locale,
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
              categoryId: item.categoryId,
              sharedToLinkedin: item.sharedToLinkedin ?? false,
              sharedToTwitter: item.sharedToTwitter ?? false,
              sharedToFacebook: item.sharedToFacebook ?? false,
            },
          })
        );
      }
    }

    // 5. Restore Marketing Groups
    if (data.marketingGroups && Array.isArray(data.marketingGroups)) {
      for (const item of data.marketingGroups) {
        operations.push(
          prisma.marketingGroup.upsert({
            where: { id: item.id },
            update: { name: item.name, color: item.color, createdAt: new Date(item.createdAt) },
            create: { id: item.id, name: item.name, color: item.color, createdAt: new Date(item.createdAt) },
          })
        );
      }
    }

    // 6. Restore Marketing Contacts
    if (data.marketingContacts && Array.isArray(data.marketingContacts)) {
      for (const item of data.marketingContacts) {
        operations.push(
          prisma.marketingContact.upsert({
            where: { id: item.id },
            update: {
              email: item.email,
              phone: item.phone,
              name: item.name,
              tags: item.tags,
              groupId: item.groupId,
              createdAt: new Date(item.createdAt),
            },
            create: {
              id: item.id,
              email: item.email,
              phone: item.phone,
              name: item.name,
              tags: item.tags,
              groupId: item.groupId,
              createdAt: new Date(item.createdAt),
            },
          })
        );
      }
    }

    // 7. Restore Campaigns
    if (data.campaigns && Array.isArray(data.campaigns)) {
      for (const item of data.campaigns) {
        operations.push(
          prisma.campaign.upsert({
            where: { id: item.id },
            update: {
              name: item.name,
              type: item.type,
              status: item.status,
              subject: item.subject,
              body: item.body,
              smsBody: item.smsBody,
              scheduledAt: item.scheduledAt ? new Date(item.scheduledAt) : null,
              sentAt: item.sentAt ? new Date(item.sentAt) : null,
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
            },
            create: {
              id: item.id,
              name: item.name,
              type: item.type,
              status: item.status,
              subject: item.subject,
              body: item.body,
              smsBody: item.smsBody,
              scheduledAt: item.scheduledAt ? new Date(item.scheduledAt) : null,
              sentAt: item.sentAt ? new Date(item.sentAt) : null,
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
            },
          })
        );
      }
    }

    // 8. Restore Campaign Groups
    if (data.campaignGroups && Array.isArray(data.campaignGroups)) {
      for (const item of data.campaignGroups) {
        operations.push(
          prisma.campaignGroup.upsert({
            where: { campaignId_groupId: { campaignId: item.campaignId, groupId: item.groupId } },
            update: {},
            create: { campaignId: item.campaignId, groupId: item.groupId },
          })
        );
      }
    }

    // 9. Restore Campaign Logs
    if (data.campaignLogs && Array.isArray(data.campaignLogs)) {
      for (const item of data.campaignLogs) {
        operations.push(
          prisma.campaignLog.upsert({
            where: { id: item.id },
            update: {
              campaignId: item.campaignId,
              contactId: item.contactId,
              channel: item.channel,
              status: item.status,
              error: item.error,
              sentAt: new Date(item.sentAt),
              openCount: item.openCount ?? 0,
              openedAt: item.openedAt ? new Date(item.openedAt) : null,
              clickCount: item.clickCount ?? 0,
              clickedAt: item.clickedAt ? new Date(item.clickedAt) : null,
              clickedUrls: item.clickedUrls ?? '[]',
            },
            create: {
              id: item.id,
              campaignId: item.campaignId,
              contactId: item.contactId,
              channel: item.channel,
              status: item.status,
              error: item.error,
              sentAt: new Date(item.sentAt),
              openCount: item.openCount ?? 0,
              openedAt: item.openedAt ? new Date(item.openedAt) : null,
              clickCount: item.clickCount ?? 0,
              clickedAt: item.clickedAt ? new Date(item.clickedAt) : null,
              clickedUrls: item.clickedUrls ?? '[]',
            },
          })
        );
      }
    }

    if (operations.length > 0) {
      await prisma.$transaction(operations);
    }

    return NextResponse.json({
      success: true,
      recordsRestored: operations.length,
    });
  } catch (error) {
    console.error('Error restoring backup:', error);
    return NextResponse.json({ error: 'Failed to restore backup: ' + String(error) }, { status: 500 });
  }
}
