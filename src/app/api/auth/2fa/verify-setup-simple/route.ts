import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/security/2fa-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, code } = body;

    // Verifica il token temporaneo
    const cookieStore = await cookies();
    const tempToken = cookieStore.get('temp_auth_token')?.value;
    const tempSecret = cookieStore.get('temp_2fa_secret')?.value;

    if (!tempToken || !tempSecret) {
      return NextResponse.json(
        { success: false, error: 'Session expired. Please login again.' },
        { status: 401 }
      );
    }

    // Verifica che il secret corrisponda
    if (secret !== tempSecret) {
      return NextResponse.json(
        { success: false, error: 'Invalid secret' },
        { status: 400 }
      );
    }

    // Verifica il codice TOTP
    const isValidCode = verifyToken(code, secret);
    
    if (!isValidCode) {
      return NextResponse.json(
        { success: false, error: 'Codice non valido. Riprova.' },
        { status: 400 }
      );
    }

    // Setup completato con successo
    const authToken = 'auth_' + Math.random().toString(36).substr(2, 9);

    // Genera codici di backup per completare il setup
    const backupCodes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substr(2, 8).toUpperCase()
    );

    const response = NextResponse.json({
      success: true,
      message: '2FA configurato con successo!',
      backupCodes: backupCodes,
      user: {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        twoFactorEnabled: true
      }
    });

    // Rimuovi i token temporanei
    response.cookies.delete('temp_auth_token');
    response.cookies.delete('temp_2fa_secret');

    // Imposta il token di autenticazione finale
    response.cookies.set('auth_token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 giorni
    });

    // Imposta cookie per tracciare che 2FA è stato configurato
    response.cookies.set('has_2fa_configured', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365 // 1 anno
    });

    return response;
  } catch (error) {
    console.error('2FA verify setup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}