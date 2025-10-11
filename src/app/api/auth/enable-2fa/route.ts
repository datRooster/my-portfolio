import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Verifica che l'utente sia autenticato
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken || !authToken.startsWith('auth_')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Crea un token temporaneo per il setup 2FA
    const tempToken = 'temp_2fa_' + Math.random().toString(36).substr(2, 9);

    const response = NextResponse.json({
      success: true,
      message: 'Ready for 2FA setup',
      setupUrl: '/login/setup-2fa'
    });

    // Imposta il token temporaneo per permettere il setup
    response.cookies.set('temp_auth_token', tempToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600 // 10 minuti per completare setup
    });

    return response;
  } catch (error) {
    console.error('Enable 2FA error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}