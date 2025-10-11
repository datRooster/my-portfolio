import { NextRequest, NextResponse } from 'next/server';
import { jwtService } from '@/lib/security/jwt';
import { encryption } from '@/lib/security/encryption';
import { twoFactorService } from '@/lib/security/2fa';
import { withRateLimit, loginRateLimit } from '@/lib/security/middleware';

/**
 * API Route: Login con autenticazione militare
 * POST /api/auth/login
 */

interface LoginRequest {
  email: string;
  password: string;
  deviceInfo: {
    userAgent: string;
    timezone?: string;
    language?: string;
    screen?: string;
  };
  honeypot?: string; // Campo honeypot per rilevare bot
}

async function loginHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as LoginRequest;
    const { email, password, deviceInfo, honeypot } = body;

    // Controllo honeypot - se compilato, è un bot
    if (honeypot && honeypot.trim() !== '') {
      console.warn('Honeypot triggered:', { email, honeypot });
      // Ritorna successo falso per non rivelare che è un honeypot
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simula ritardo
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    // Validazione input
    if (!email || !password || !deviceInfo?.userAgent) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Qui dovresti recuperare l'utente dal database
    // Per ora uso dati mockati
    const mockUser = {
      id: 'admin-1',
      email: 'admin@thewebrooster.dev',
      passwordHash: '', // Recupera dal DB
      passwordSalt: '', // Recupera dal DB
      role: 'admin',
      permissions: ['all'],
      twoFactorEnabled: true,
      twoFactorSecret: '', // Recupera dal DB se abilitato
      isLocked: false,
      failedAttempts: 0
    };

    // Simula verifica credenziali (qui useresti il database)
    if (email !== mockUser.email) {
      // Simula ritardo per proteggere da timing attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    // Qui dovresti verificare la password con encryption.verifyPassword()
    // const isValidPassword = await encryption.verifyPassword(password, mockUser.passwordHash, mockUser.passwordSalt);
    const isValidPassword = password === 'AdminSecure123!'; // Mock

    if (!isValidPassword) {
      // Incrementa tentativi falliti (nel database)
      // Se supera il limite, blocca l'account
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    // Se ha 2FA abilitato, non genera ancora i token
    if (mockUser.twoFactorEnabled) {
      const challengeId = encryption.generateSecureToken(32);
      
      // Salva challenge temporanea (in Redis o database)
      // Per ora mock
      console.log('2FA Challenge created:', challengeId);

      return NextResponse.json({
        success: true,
        requiresTwoFactor: true,
        challengeId
      });
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

/**
 * Verifica codice 2FA e completa il login
 * POST /api/auth/verify-2fa
 */
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

    // Qui dovresti recuperare la challenge dal database/Redis
    // e verificare che non sia scaduta
    
    // Mock user data (normalmente dal database tramite challengeId)
    const mockUser = {
      id: 'admin-1',
      email: 'admin@thewebrooster.dev',
      role: 'admin',
      permissions: ['all'],
      twoFactorSecret: 'MOCK_SECRET_BASE32', // Dal database
      backupCodes: [] // Dal database
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

    // Se ha usato un backup code, aggiorna il database
    if (verification.usedBackupCode) {
      console.log(`Backup code used. Remaining: ${verification.remainingBackupCodes}`);
      // Aggiorna backup codes nel database
    }

    // Genera token di accesso
    const tokenPair = await jwtService.generateTokenPair(mockUser, {
      userAgent: deviceInfo.userAgent,
      ipAddress: getClientIP(request),
      timezone: deviceInfo.timezone,
      language: deviceInfo.language,
      screen: deviceInfo.screen
    });

    // Rimuovi challenge dal database/Redis
    console.log('Challenge completed:', challengeId);

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
    console.error('2FA verification error:', error);
    
    return NextResponse.json({
      success: false,
      error: '2FA verification failed'
    }, { status: 500 });
  }
}

/**
 * Refresh token
 * POST /api/auth/refresh
 */
interface RefreshRequest {
  refreshToken: string;
  deviceInfo: {
    userAgent: string;
    timezone?: string;
    language?: string;
  };
}

async function refreshHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as RefreshRequest;
    const { refreshToken, deviceInfo } = body;

    if (!refreshToken) {
      return NextResponse.json({
        success: false,
        error: 'Refresh token required'
      }, { status: 400 });
    }

    const newTokenPair = await jwtService.refreshAccessToken(refreshToken, {
      userAgent: deviceInfo.userAgent,
      ipAddress: getClientIP(request),
      timezone: deviceInfo.timezone,
      language: deviceInfo.language
    });

    if (!newTokenPair) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired refresh token'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      tokens: {
        accessToken: newTokenPair.accessToken,
        refreshToken: newTokenPair.refreshToken,
        expiresAt: newTokenPair.expiresAt
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Token refresh failed'
    }, { status: 500 });
  }
}

/**
 * Logout
 * POST /api/auth/logout
 */
async function logoutHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (token) {
      // Estrai session ID dal token
      const payload = jwtService.extractPayload(token);
      const sessionId = payload?.sessionId;

      // Revoca token e sessione
      await jwtService.revokeToken(token, sessionId);
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Logout failed'
    }, { status: 500 });
  }
}

// Helper per ottenere IP client
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

// Export handlers con rate limiting
export const POST = withRateLimit(async (request: NextRequest) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Applica rate limiting specifico per login
  if (pathname.includes('/login')) {
    const rateLimitResponse = await loginRateLimit()(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    
    return loginHandler(request);
  }

  if (pathname.includes('/verify-2fa')) {
    return verify2FAHandler(request);
  }

  if (pathname.includes('/refresh')) {
    return refreshHandler(request);
  }

  if (pathname.includes('/logout')) {
    return logoutHandler(request);
  }

  return NextResponse.json({
    error: 'Route not found'
  }, { status: 404 });
});