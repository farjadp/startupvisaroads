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

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    
    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if directory exists
    }

    const path = join(uploadDir, filename);
    await writeFile(path, buffer);

    // Return the URL that can be used to access the image
    const url = `/uploads/${filename}`;
    
    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload image' }, { status: 500 });
  }
}
