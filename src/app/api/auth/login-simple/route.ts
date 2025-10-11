import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validazione base
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email e password sono richiesti'
      }, { status: 400 });
    }

    // Controlla credenziali demo
    if (email !== 'admin@example.com' || password !== 'admin123') {
      return NextResponse.json({
        success: false,
        message: 'Credenziali non valide'
      }, { status: 401 });
    }

    // Controlla se l'utente ha 2FA abilitato
    // Questo valore potrebbe venire dal database in produzione
    const userHas2FA = true; // Cambia a false per testare login diretto

    if (userHas2FA) {
      // Genera token temporaneo per il processo 2FA
      const tempToken = 'temp_token_' + Date.now();
      
      // Crea la risposta con redirect alla scelta 2FA
    const response = NextResponse.json({
      success: true,
      requiresTwoFactor: true,
      requires2FAChoice: true, // Indica che l'utente può scegliere
      message: 'Choose your security level',
      tempToken: tempToken
    });

    // Imposta cookie temporaneo per 2FA
    response.cookies.set('temp_auth_token', tempToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 300 // 5 minuti per completare 2FA
    });

    return response;
    }

    // Login diretto senza 2FA (solo per test)
    const authToken = 'auth_token_' + Date.now();
    
    const response = NextResponse.json({
      success: true,
      requires2FA: false,
      message: 'Login completato con successo'
    });

    // Imposta cookie di autenticazione finale
    response.cookies.set('auth_token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1 ora
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Errore interno del server'
    }, { status: 500 });
  }
}