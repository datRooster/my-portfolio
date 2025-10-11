import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Ottieni il token temporaneo dai cookie
    const cookieStore = await cookies();
    const tempToken = cookieStore.get('temp_auth_token')?.value;

    if (!tempToken) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 401 }
      );
    }

    // Simula la creazione di un token di autenticazione completo
    // In produzione, aggiorna il database per indicare che l'utente ha scelto di non usare 2FA
    const authToken = 'auth_' + Math.random().toString(36).substr(2, 9);

    // Crea la risposta
    const response = NextResponse.json({
      success: true,
      message: '2FA skipped successfully',
      user: {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        twoFactorEnabled: false,
        skipReminder: true // Indica che l'utente ha scelto di saltare
      }
    });

    // Rimuovi il token temporaneo
    response.cookies.delete('temp_auth_token');

    // Imposta il token di autenticazione
    response.cookies.set('auth_token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 giorni
    });

    // Imposta un cookie per ricordare che l'utente ha saltato 2FA
    response.cookies.set('skip_2fa_reminder', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 giorni prima del prossimo promemoria
    });

    return response;
  } catch (error) {
    console.error('Skip 2FA error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}