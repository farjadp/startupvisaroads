import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

async function checkAuth(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  return !!session?.username;
}

export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') ?? '';
  const groupId = searchParams.get('groupId') ?? undefined;
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '50');
  const skip = (page - 1) * limit;

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
          ],
        }
      : {}),
    ...(groupId ? { groupId } : {}),
  };

  const [contacts, total] = await Promise.all([
    prisma.marketingContact.findMany({
      where,
      skip,
      take: limit,
      include: { group: { select: { id: true, name: true, color: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.marketingContact.count({ where }),
  ]);

  return NextResponse.json({ contacts, total, page, limit });
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, email, phone, groupId, tags } = body;

  if (!email && !phone) {
    return NextResponse.json({ error: 'Email or phone required' }, { status: 400 });
  }

  const contact = await prisma.marketingContact.create({
    data: {
      name: name || null,
      email: email || null,
      phone: phone || null,
      groupId: groupId || null,
    },
  });

  return NextResponse.json({ contact }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'ids required' }, { status: 400 });
  }

  await prisma.marketingContact.deleteMany({ where: { id: { in: ids } } });
  return NextResponse.json({ deleted: ids.length });
}
