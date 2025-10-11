import { NextRequest, NextResponse } from 'next/server';
import { jwtService } from '@/lib/security/jwt';
import { twoFactorService } from '@/lib/security/2fa';
import { withRateLimit } from '@/lib/security/middleware';

interface Verify2FARequest {
  challengeId: string;
  code: string;
  deviceInfo: {
    userAgent: string;
    timezone?: string;
    language?: string;
    screen?: string;
  };
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

async function verify2FAHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as Verify2FARequest;
    const { challengeId, code, deviceInfo } = body;

    if (!challengeId || !code) {
      return NextResponse.json({
        success: false,
        error: 'Missing challenge ID or code'
      }, { status: 400 });
    }

    // Mock user data (normalmente dal database tramite challengeId)
    const mockUser = {
      id: 'admin-1',
      email: 'admin@thewebrooster.dev',
      role: 'admin',
      permissions: ['all'],
      twoFactorSecret: 'MOCK_SECRET_BASE32',
      backupCodes: []
    };

    // Verifica codice 2FA
    const verification = await twoFactorService.verifyCode(
      mockUser.id,
      code,
      mockUser.twoFactorSecret,
      mockUser.backupCodes
    );

    if (!verification.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid 2FA code'
      }, { status: 401 });
    }

    // Genera token di accesso
    const tokenPair = await jwtService.generateTokenPair(mockUser, {
      userAgent: deviceInfo.userAgent,
      ipAddress: getClientIP(request),
      timezone: deviceInfo.timezone,
      language: deviceInfo.language,
      screen: deviceInfo.screen
    });

    return NextResponse.json({
      success: true,
      tokens: {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
        expiresAt: tokenPair.expiresAt
      },
      user: {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      },
      twoFactorUsed: {
        usedBackupCode: verification.usedBackupCode,
        remainingBackupCodes: verification.remainingBackupCodes
      }
    });

  } catch (error) {
    console.error('2FA verification error:', error);
    
    return NextResponse.json({
      success: false,
      error: '2FA verification failed'
    }, { status: 500 });
  }
}

export const runtime = 'nodejs';

export const POST = withRateLimit(verify2FAHandler);