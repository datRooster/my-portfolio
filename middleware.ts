import { NextRequest, NextResponse } from 'next/server';
import { applySecurityHeaders } from './src/lib/security/middleware';

/**
 * Middleware globale per Next.js
 * Applica security headers e controlli di sicurezza a tutte le route
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Applica security headers a tutte le response
  const response = NextResponse.next();
  
  // Security headers globali
  applySecurityHeaders(response);

  // Controlli specifici per path
  if (pathname.startsWith('/admin')) {
    // Qui potresti aggiungere controlli specifici per l'admin
    console.log('Admin area access attempt:', {
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString()
    });
  }

  // Blocca accesso diretto a file sensibili
  if (pathname.includes('.env') || 
      pathname.includes('database') || 
      pathname.includes('backup') ||
      pathname.includes('config') ||
      pathname.includes('.log')) {
    return NextResponse.json(
      { error: 'Access denied' },
      { status: 403 }
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/public (public API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/public|_next/static|_next/image|favicon.ico|public).*)',
  ],
};