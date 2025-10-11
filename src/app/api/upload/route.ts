import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { requireAdmin } from '@/lib/auth';

// Configurazioni di sicurezza
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/gif'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'images', 'projects');

// Utility per validare il tipo di file tramite magic bytes
const getFileTypeFromBuffer = (buffer: Buffer): string | null => {
  const hex = buffer.toString('hex', 0, 8);
  
  // JPEG
  if (hex.startsWith('ffd8ff')) return 'image/jpeg';
  
  // PNG
  if (hex.startsWith('89504e47')) return 'image/png';
  
  // GIF
  if (hex.startsWith('47494638')) return 'image/gif';
  
  // WebP
  if (hex.includes('57454250')) return 'image/webp';
  
  return null;
};

// Genera nome file sicuro
const generateSecureFilename = (originalName: string, mimeType: string): string => {
  const timestamp = Date.now();
  const randomBytes = crypto.randomBytes(8).toString('hex');
  const extension = mimeType.split('/')[1];
  
  // Sanitize original name (solo caratteri alfanumerici e trattini)
  const safeName = originalName
    .replace(/\.[^/.]+$/, '') // rimuovi estensione
    .replace(/[^a-zA-Z0-9-_]/g, '-') // sostituisci caratteri speciali
    .substring(0, 20); // limita lunghezza
  
  return `${safeName}-${timestamp}-${randomBytes}.${extension}`;
};

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Upload handler started');
    
    // Verifica autenticazione admin
    console.log('� Checking admin auth...');
    const user = await requireAdmin();
    console.log('✅ Admin verified:', user.email);
    
    // Verifica che la directory esista
    if (!existsSync(UPLOAD_DIR)) {
      console.log('📁 Creating upload directory:', UPLOAD_DIR);
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    console.log('📥 Parsing form data...');
    const formData = await request.formData();
    const file = formData.get('file') as File;
    console.log('📄 File received:', file ? { name: file.name, size: file.size, type: file.type } : 'null');

    if (!file) {
      return NextResponse.json(
        { error: 'Nessun file fornito' },
        { status: 400 }
      );
    }

    // Validazione dimensione
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File troppo grande. Massimo ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Validazione tipo MIME dichiarato
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo di file non supportato. Usa: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    // Leggi il contenuto del file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validazione tipo file tramite magic bytes (sicurezza extra)
    const actualFileType = getFileTypeFromBuffer(buffer);
    if (!actualFileType || !ALLOWED_TYPES.includes(actualFileType)) {
      return NextResponse.json(
        { error: 'Tipo di file non valido o corrotto' },
        { status: 400 }
      );
    }

    // Verifica che il tipo dichiarato corrisponda al tipo reale
    if (file.type !== actualFileType && 
        !(file.type === 'image/jpg' && actualFileType === 'image/jpeg')) {
      return NextResponse.json(
        { error: 'Tipo di file non corrisponde al contenuto' },
        { status: 400 }
      );
    }

    // Genera nome file sicuro
    const filename = generateSecureFilename(file.name, actualFileType);
    const filepath = path.join(UPLOAD_DIR, filename);

    // Salva il file
    await writeFile(filepath, buffer);

    // Restituisci URL pubblico
    const publicUrl = `/images/projects/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      size: file.size,
      type: actualFileType
    });

  } catch (error) {
    console.error('💥 Upload error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    
    // Se è un errore di autenticazione, restituisci 403
    if (error instanceof Error && error.message.includes('Accesso admin')) {
      return NextResponse.json(
        { error: 'Accesso admin richiesto' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Errore interno del server', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

