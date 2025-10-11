import { NextResponse } from 'next/server';
import { twoFactorService } from '@/lib/security/2fa';
import { withAuth, AuthenticatedRequest } from '@/lib/security/middleware';

/**
 * Verifica setup 2FA
 * POST /api/auth/2fa/verify-setup
 */

interface VerifySetupRequest {
  setupToken: string;
  totpCode: string;
}

async function verifySetup2FAHandler(request: AuthenticatedRequest): Promise<NextResponse> {
  try {
    if (!request.user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const body = await request.json() as VerifySetupRequest;
    const { setupToken, totpCode } = body;

    if (!setupToken || !totpCode) {
      return NextResponse.json({
        success: false,
        error: 'Setup token and TOTP code required'
      }, { status: 400 });
    }

    // Verifica setup
    const result = await twoFactorService.verifySetup(setupToken, totpCode);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid TOTP code or expired setup'
      }, { status: 400 });
    }

    // Qui dovresti salvare nel database:
    // - Abilitare 2FA per l'utente
    // - Salvare il secret crittografato
    // - Salvare i backup codes crittografati

    return NextResponse.json({
      success: true,
      message: '2FA enabled successfully',
      backupCodes: result.backupCodes // Mostra solo una volta
    });

  } catch (error) {
    console.error('2FA setup verification error:', error);
    
    return NextResponse.json({
      success: false,
      error: '2FA setup verification failed'
    }, { status: 500 });
  }
}

export const runtime = 'nodejs';

export const POST = withAuth(verifySetup2FAHandler);