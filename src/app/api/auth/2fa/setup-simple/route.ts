import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateSecret, generateQRCode } from '@/lib/security/2fa-utils';

export async function POST(request: NextRequest) {
  try {
    // Verifica il token temporaneo
    const cookieStore = await cookies();
    const tempToken = cookieStore.get('temp_auth_token')?.value;

    if (!tempToken) {
      return NextResponse.json(
        { success: false, error: 'Session not found. Please login again.' },
        { status: 401 }
      );
    }

    // Genera secret per 2FA
    const secret = generateSecret();
    
    // Genera QR code per l'app authenticator
    const qrCode = await generateQRCode(secret, 'admin@example.com', 'Portfolio Admin');
    
    // Genera codici di backup
    const backupCodes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substr(2, 8).toUpperCase()
    );

    // Salva il secret temporaneamente nei cookie per la verifica
    const response = NextResponse.json({
      success: true,
      secret: secret,
      qrCode: qrCode,
      backupCodes: backupCodes,
      message: '2FA setup initialized'
    });

    // Salva il secret temporaneamente per la verifica
    response.cookies.set('temp_2fa_secret', secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 300 // 5 minuti per completare setup
    });

    return response;
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}