import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logout completato con successo'
    });

    // Rimuovi tutti i cookie di autenticazione
    response.cookies.delete('auth_token');
    response.cookies.delete('temp_token');
    response.cookies.delete('refresh_token');

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante il logout' },
      { status: 500 }
    );
  }
}