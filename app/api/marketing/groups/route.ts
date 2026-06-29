import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

async function checkAuth(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  return !!session?.username;
}

export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const groups = await prisma.marketingGroup.findMany({
    include: { _count: { select: { contacts: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ groups });
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, color } = await req.json();
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

  const group = await prisma.marketingGroup.create({
    data: { name, color: color ?? '#CCFF00' },
  });

  return NextResponse.json({ group }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, name, color } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const group = await prisma.marketingGroup.update({
    where: { id },
    data: { ...(name && { name }), ...(color && { color }) },
  });

  return NextResponse.json({ group });
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await prisma.marketingGroup.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
