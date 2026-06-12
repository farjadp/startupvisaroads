import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { verifyJWT } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate the request
    const sessionCookie = request.cookies.get('admin_session')?.value;
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-1234';
    let isAuthenticated = false;
    
    if (sessionCookie) {
      const payload = await verifyJWT(sessionCookie, jwtSecret);
      if (payload && payload.username) {
        isAuthenticated = true;
      }
    }

    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Process form data
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // 3. File validation (security hardening)
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Invalid file type. Only images (JPG, PNG, WEBP, GIF) are allowed.' }, { status: 400 });
    }

    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      return NextResponse.json({ success: false, error: 'Invalid file extension.' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      return NextResponse.json({ success: false, error: 'File size exceeds the 5MB limit.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    
    // Return Base64 data URL directly
    const url = `data:${mimeType};base64,${base64}`;
    
    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload image' }, { status: 500 });
  }
}
