import { NextRequest, NextResponse } from 'next/server';
import { jwtService } from '@/lib/security/jwt';
import { withAuth } from '@/lib/security/middleware';

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

export const runtime = 'nodejs';

export const POST = withAuth(logoutHandler);