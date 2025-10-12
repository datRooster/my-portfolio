import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import crypto from 'crypto';
import { requireAdmin } from '@/lib/auth';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const generateSecureFilename = (originalName: string, mimeType: string): string => {
  const timestamp = Date.now();
  const randomBytes = crypto.randomBytes(8).toString('hex');
  const extension = mimeType.split('/')[1];
  const safeName = originalName
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .substring(0, 20);
  return `${safeName}-${timestamp}-${randomBytes}.${extension}`;
};

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Vercel Blob Upload started');
    
    const user = await requireAdmin();
    console.log('✅ Admin verified:', user.email);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nessun file fornito' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File troppo grande. Massimo ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Tipo di file non supportato. Usa: JPEG, PNG, WebP, GIF' 
      }, { status: 400 });
    }

    const filename = generateSecureFilename(file.name, file.type);

    console.log('☁️ Uploading to Vercel Blob...');
    
    // Check if BLOB_READ_WRITE_TOKEN is available
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('⚠️ BLOB_READ_WRITE_TOKEN not found - using development fallback');
      // In development, return a placeholder URL
      if (process.env.NODE_ENV === 'development') {
        const placeholderUrl = `https://via.placeholder.com/800x600/4F46E5/ffffff?text=${encodeURIComponent(filename)}`;
        return NextResponse.json({
          success: true,
          url: placeholderUrl,
          filename: filename,
          size: file.size,
          type: file.type,
          note: 'Development mode - using placeholder image'
        });
      }
    }
    
    const blob = await put(`projects/${filename}`, file, {
      access: 'public'
    });

    console.log('✅ Upload successful:', blob.url);

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: filename,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('💥 Upload error:', error);
    
    if (error instanceof Error && error.message.includes('Accesso admin')) {
      return NextResponse.json({ error: 'Accesso admin richiesto' }, { status: 403 });
    }
    
    return NextResponse.json({ 
      error: 'Errore interno del server', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
