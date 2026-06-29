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
    const { selections } = body;

    const backupData: Record<string, any> = {};

    // 1. Settings
    if (!selections || selections.includes('settings')) {
      backupData.settings = await prisma.setting.findMany();
    }

    // 2. Articles & Categories
    if (!selections || selections.includes('articles')) {
      backupData.categories = await prisma.category.findMany();
      backupData.tags = await prisma.tag.findMany();
      backupData.articles = await prisma.article.findMany();
    }

    // 3. Marketing Groups & Contacts
    if (!selections || selections.includes('contacts')) {
      backupData.marketingGroups = await prisma.marketingGroup.findMany();
      backupData.marketingContacts = await prisma.marketingContact.findMany();
    }

    // 4. Campaigns & Logs
    if (!selections || selections.includes('campaigns')) {
      backupData.campaigns = await prisma.campaign.findMany();
      backupData.campaignGroups = await prisma.campaignGroup.findMany();
      backupData.campaignLogs = await prisma.campaignLog.findMany();
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: backupData,
    });
  } catch (error) {
    console.error('Error generating backup:', error);
    return NextResponse.json({ error: 'Failed to generate backup: ' + String(error) }, { status: 500 });
  }
}
