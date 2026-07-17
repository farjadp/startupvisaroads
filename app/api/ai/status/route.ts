export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session?.username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobId = req.nextUrl.searchParams.get('jobId');
    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
    }

    const job = await prisma.aiKeyword.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.status === 'COMPLETED') {
      // The articleId is stored in the error field as a workaround
      return NextResponse.json({ status: job.status, articleId: job.error });
    } else if (job.status === 'ERROR') {
      return NextResponse.json({ status: job.status, error: job.error });
    }

    return NextResponse.json({ status: job.status });

  } catch (error: any) {
    console.error('AI Status Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
