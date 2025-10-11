import { NextRequest, NextResponse } from 'next/server';
import { jwtService } from '@/lib/security/jwt';
import { encryption } from '@/lib/security/encryption';
import { withRateLimit, loginRateLimit } from '@/lib/security/middleware';

interface LoginRequest {
  email: string;
  password: string;
  deviceInfo: {
    userAgent: string;
    timezone?: string;
    language?: string;
    screen?: string;
  };
  honeypot?: string;
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

async function loginHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validazione input base
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email e password sono richiesti'
      }, { status: 400 });
    }

    // Mock user (in produzione useresti il database)
    const mockUser = {
      id: 'admin-1',
      email: 'admin@thewebrooster.dev',
      role: 'admin',
      permissions: ['all'],
      twoFactorEnabled: true
    };

    // Verifica credenziali
    if (email !== mockUser.email || password !== 'AdminSecure123!') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    // Se ha 2FA abilitato
    if (mockUser.twoFactorEnabled) {
      const challengeId = encryption.generateSecureToken(32);
      
      return NextResponse.json({
        success: true,
        requiresTwoFactor: true,
        challengeId
      });
    }

    // Genera token (temporaneamente commentato per risolvere errori)
    // const tokenPair = await jwtService.generateTokenPair(mockUser, {
    //   userAgent: deviceInfo.userAgent,
    //   ipAddress: getClientIP(request),
    //   timezone: deviceInfo.timezone,
    //   language: deviceInfo.language,
    //   screen: deviceInfo.screen
    // });
    
    // Mock token per test
    const tokenPair = {
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

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
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Authentication failed'
    }, { status: 500 });
  }
}

// Specifica Node.js runtime per supportare crypto
export const runtime = 'nodejs';

export const POST = async (request: NextRequest) => {
  // Applica rate limiting per login
  const rateLimitResponse = await loginRateLimit()(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  return withRateLimit(loginHandler)(request);
};