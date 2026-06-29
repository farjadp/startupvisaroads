import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Delete any contact matching this email address
    const result = await prisma.marketingContact.deleteMany({
      where: {
        email: cleanEmail,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Unsubscribed successfully',
      deletedCount: result.count,
    });
  } catch (error) {
    console.error('Error in unsubscribe API:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
