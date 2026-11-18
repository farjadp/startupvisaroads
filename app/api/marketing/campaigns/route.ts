import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { LOCKED_STATUSES } from '@/lib/campaign-queue/admin';

// The queue states are set only by /campaigns/:id/queue and the worker.
const EDITABLE_STATUSES = ['DRAFT', 'SCHEDULED'];
const LOCKED_MESSAGE = 'This campaign is in the send queue or was interrupted, so its log and content must stay as they are.';

async function checkAuth(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  return !!session?.username;
}

export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const campaigns = await prisma.campaign.findMany({
    include: {
      _count: { select: { logs: true } },
      groups: { include: { group: { select: { id: true, name: true, color: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ campaigns });
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, type, subject, body: emailBody, smsBody, groupIds, scheduledAt } = body;

  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

  const campaign = await prisma.campaign.create({
    data: {
      name,
      type: type ?? 'EMAIL',
      subject: subject ?? null,
      body: emailBody ?? '',
      smsBody: smsBody ?? null,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      groups: groupIds?.length
        ? { create: groupIds.map((gid: string) => ({ groupId: gid })) }
        : undefined,
    },
    include: { groups: true },
  });

  return NextResponse.json({ campaign }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, name, type, subject, body: emailBody, smsBody, groupIds, scheduledAt, status } = body;

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  if (status !== undefined && !EDITABLE_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const current = await prisma.campaign.findUnique({ where: { id }, select: { status: true } });
  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (LOCKED_STATUSES.includes(current.status)) return NextResponse.json({ error: LOCKED_MESSAGE }, { status: 409 });

  const updateData: Record<string, unknown> = {};
  if (name !== undefined) updateData.name = name;
  if (type !== undefined) updateData.type = type;
  if (subject !== undefined) updateData.subject = subject;
  if (emailBody !== undefined) updateData.body = emailBody;
  if (smsBody !== undefined) updateData.smsBody = smsBody;
  if (scheduledAt !== undefined) updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
  if (status !== undefined) updateData.status = status;

  if (groupIds !== undefined) {
    await prisma.campaignGroup.deleteMany({ where: { campaignId: id } });
    if (groupIds.length > 0) {
      await prisma.campaignGroup.createMany({
        data: groupIds.map((gid: string) => ({ campaignId: id, groupId: gid })),
      });
    }
  }

  const campaign = await prisma.campaign.update({
    where: { id },
    data: updateData,
    include: {
      groups: { include: { group: true } },
      _count: { select: { logs: true } },
    },
  });

  return NextResponse.json({ campaign });
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  // Deleting would also delete the logs that stop a second send.
  const current = await prisma.campaign.findUnique({ where: { id }, select: { status: true } });
  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (LOCKED_STATUSES.includes(current.status)) return NextResponse.json({ error: LOCKED_MESSAGE }, { status: 409 });

  await prisma.campaign.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
