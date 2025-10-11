import { NextResponse } from 'next/server';
import { twoFactorService } from '@/lib/security/2fa';
import { withAuth, AuthenticatedRequest } from '@/lib/security/middleware';

/**
 * Setup 2FA per utente autenticato
 * POST /api/auth/2fa/setup
 */
async function setup2FAHandler(request: AuthenticatedRequest): Promise<NextResponse> {
  try {
    if (!request.user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const userId = request.user.userId;
    
    // Mock user email (normalmente dal database)
    const userEmail = 'admin@thewebrooster.dev';

    // Inizializza setup 2FA
    const setup = await twoFactorService.initializeSetup(userId, userEmail);

    return NextResponse.json({
      success: true,
      setup: {
        qrCodeUrl: setup.qrCodeUrl,
        backupCodes: setup.backupCodes,
        setupToken: setup.setupToken
      }
    });

  } catch (error) {
    console.error('2FA setup error:', error);
    
    return NextResponse.json({
      success: false,
      error: '2FA setup failed'
    }, { status: 500 });
  }
}

export const runtime = 'nodejs';

export const POST = withAuth(setup2FAHandler);