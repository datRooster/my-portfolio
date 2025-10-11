import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Controlla token di autenticazione
    const token = request.cookies.get('auth_token')?.value;

    if (!token || !token.startsWith('auth_')) {
      return NextResponse.json(
        { success: false, message: 'No valid token provided' },
        { status: 401 }
      );
    }

    // Controlla lo stato 2FA dell'utente
    const cookieStore = await cookies();
    const has2FAConfigured = cookieStore.get('has_2fa_configured')?.value === 'true';
    const skip2FAReminder = cookieStore.get('skip_2fa_reminder')?.value === 'true';
    
    // L'utente ha 2FA se l'ha configurata, altrimenti usa lo stato di skip
    const has2FA = has2FAConfigured;
    
    // Per ora, simula utente autenticato se il token è valido
    const mockUser = {
      id: '1',
      email: 'admin@example.com',
      name: 'Amministratore',
      role: 'ADMIN',
      lastLogin: new Date().toISOString(),
      twoFactorEnabled: has2FA
    };

    return NextResponse.json({
      success: true,
      user: mockUser
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 401 }
    );
  }
}