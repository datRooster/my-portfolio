import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    const tempToken = request.cookies.get('temp_token')?.value;

    if (!tempToken) {
      return NextResponse.json(
        { success: false, message: 'Sessione scaduta, rifare login' },
        { status: 401 }
      );
    }

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { success: false, message: 'Codice 2FA non valido' },
        { status: 400 }
      );
    }

    // TODO: Implementare validazione TOTP reale
    // Per ora, accetta solo 123456 come codice valido
    if (code === '123456') {
      // Genera token di autenticazione finale
      const authToken = 'auth_token_' + Date.now();
      
      const response = NextResponse.json({
        success: true,
        message: 'Autenticazione completata con successo'
      });

      // Rimuovi token temporaneo e imposta token di autenticazione
      response.cookies.delete('temp_token');
      response.cookies.set('auth_token', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600 // 1 ora
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Codice 2FA non valido' },
      { status: 401 }
    );

  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Errore interno del server' },
      { status: 500 }
    );
  }
}