import { NextRequest, NextResponse } from 'next/server';
import { jwtService } from '@/lib/security/jwt';
import { withRateLimit } from '@/lib/security/middleware';

interface RefreshRequest {
  refreshToken: string;
  deviceInfo: {
    userAgent: string;
    timezone?: string;
    language?: string;
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

export const runtime = 'nodejs';

export const POST = withRateLimit(refreshHandler);