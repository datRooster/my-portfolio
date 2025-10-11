import { NextRequest, NextResponse } from 'next/server';
import rateLimit from 'express-rate-limit';
import { jwtService, TokenPayload } from './jwt';
import { SECURITY_CONFIG } from './config';
import { encryption } from './encryption';

/**
 * Authentication Middleware - Military Grade
 * Implementa autenticazione JWT con rate limiting e controlli di sicurezza
 */

export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload;
  sessionId?: string;
  deviceFingerprint?: string;
}

export interface SecurityEvent {
  type: 'LOGIN_ATTEMPT' | 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'TOKEN_INVALID' | 'SUSPICIOUS_ACTIVITY' | 'RATE_LIMIT_EXCEEDED';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  metadata?: any;
}

// Rate limiter per login
const loginLimiter = rateLimit({
  windowMs: SECURITY_CONFIG.RATE_LIMIT.LOGIN_ATTEMPTS.WINDOW_MS,
  max: SECURITY_CONFIG.RATE_LIMIT.LOGIN_ATTEMPTS.MAX_ATTEMPTS,
  message: {
    error: 'Too many login attempts',
    retryAfter: SECURITY_CONFIG.RATE_LIMIT.LOGIN_ATTEMPTS.WINDOW_MS / 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyGenerator: (req: any) => {
    // Rate limit per IP + User-Agent per maggiore precisione
    const ip = (req.ip as string) || (req.headers as Record<string, string>)['x-forwarded-for'] || 'unknown';
    const userAgent = (req.headers as Record<string, string>)['user-agent'] || 'unknown';
    return encryption.computeHash(`${ip}:${userAgent.slice(0, 100)}`);
  }
});

// Rate limiter generale per API
const apiLimiter = rateLimit({
  windowMs: SECURITY_CONFIG.RATE_LIMIT.API_CALLS.WINDOW_MS,
  max: SECURITY_CONFIG.RATE_LIMIT.API_CALLS.MAX_REQUESTS,
  message: {
    error: 'Too many API requests',
    retryAfter: SECURITY_CONFIG.RATE_LIMIT.API_CALLS.WINDOW_MS / 1000
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Middleware principale di autenticazione
 */
export async function authMiddleware(
  request: NextRequest,
  requireAuth: boolean = true
): Promise<{ success: boolean; response?: NextResponse; user?: TokenPayload }> {
  try {
    // Estrai informazioni di base
    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const deviceInfo = {
      userAgent,
      ipAddress: ip,
      timezone: request.headers.get('x-timezone') || undefined,
      language: request.headers.get('accept-language')?.split(',')[0]
    };

    // Controlli di sicurezza preliminari
    const securityCheck = await performSecurityChecks(request, ip, userAgent);
    if (!securityCheck.allowed) {
      await logSecurityEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        ipAddress: ip,
        userAgent,
        timestamp: new Date(),
        metadata: securityCheck.reason
      });

      return {
        success: false,
        response: NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      };
    }

    // Se non richiede autenticazione, passa oltre
    if (!requireAuth) {
      return { success: true };
    }

    // Estrai token dal header Authorization
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      };
    }

    // Valida il token JWT
    const payload = await jwtService.validateAccessToken(token, deviceInfo);
    if (!payload) {
      await logSecurityEvent({
        type: 'TOKEN_INVALID',
        ipAddress: ip,
        userAgent,
        timestamp: new Date(),
        metadata: { token: token.slice(0, 10) + '...' }
      });

      return {
        success: false,
        response: NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      };
    }

    // Controlli aggiuntivi sul payload
    if (payload.ipAddress && payload.ipAddress !== ip) {
      // IP address change - potenziale hijacking
      if ((SECURITY_CONFIG as any).SECURITY?.ENABLE_IP_VALIDATION) {
        await logSecurityEvent({
          type: 'SUSPICIOUS_ACTIVITY',
          userId: payload.userId,
          ipAddress: ip,
          userAgent,
          timestamp: new Date(),
          metadata: { 
            reason: 'IP_ADDRESS_CHANGE',
            originalIP: payload.ipAddress,
            newIP: ip
          }
        });

        return {
          success: false,
          response: NextResponse.json(
            { error: 'Session security violation' },
            { status: 403 }
          )
        };
      }
    }

    // Tutto ok - l'utente è autenticato
    return {
      success: true,
      user: payload
    };

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Authentication error' },
        { status: 500 }
      )
    };
  }
}

/**
 * Middleware per rate limiting dei login
 */
export function loginRateLimit() {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    return new Promise((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req = request as any;
      const res = {
        status: (code: number) => ({
          json: (data: Record<string, unknown>) => resolve(NextResponse.json(data, { status: code }))
        })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      loginLimiter(req, res, () => {
        resolve(null); // No rate limit hit
      });
    });
  };
}

/**
 * Middleware per rate limiting delle API
 */
export function apiRateLimit() {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    return new Promise((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req = request as any;
      const res = {
        status: (code: number) => ({
          json: (data: Record<string, unknown>) => resolve(NextResponse.json(data, { status: code }))
        })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      apiLimiter(req, res, () => {
        resolve(null);
      });
    });
  };
}

/**
 * Controlli di sicurezza preliminari
 */
async function performSecurityChecks(
  request: NextRequest,
  ip: string,
  userAgent: string
): Promise<{ allowed: boolean; reason?: string }> {
  
  // Controllo lista nera IP
  if (await isIPBlacklisted(ip)) {
    return { allowed: false, reason: 'IP_BLACKLISTED' };
  }

  // Controllo geo-blocking (se abilitato)
  if ((SECURITY_CONFIG as any).SECURITY?.ENABLE_GEO_BLOCKING) {
    const geoAllowed = await checkGeoLocation(ip);
    if (!geoAllowed) {
      return { allowed: false, reason: 'GEO_BLOCKED' };
    }
  }

  // Controllo User-Agent sospetti
  if (isSuspiciousUserAgent(userAgent)) {
    return { allowed: false, reason: 'SUSPICIOUS_USER_AGENT' };
  }

  // Controllo honeypot (se abilitato)
  if ((SECURITY_CONFIG as any).SECURITY?.ENABLE_HONEYPOT) {
    const honeypotField = request.headers.get('x-honeypot');
    if (honeypotField) { // Se il campo honeypot è compilato, è un bot
      return { allowed: false, reason: 'HONEYPOT_TRIGGERED' };
    }
  }

  return { allowed: true };
}

/**
 * Ottieni IP del client considerando proxy
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  // Cloudflare
  if (cfConnectingIP) return cfConnectingIP;
  
  // Nginx proxy
  if (realIP) return realIP;
  
  // Standard forwarded header
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  // Fallback
  return 'unknown';
}

/**
 * Controlla se un IP è nella blacklist
 */
async function isIPBlacklisted(ip: string): Promise<boolean> {
  // Qui dovresti controllare nel database o Redis
  // Lista di IP bloccati, range di IP, etc.
  
  const blacklistedIPs: string[] = [
    // IPs noti per attacchi
    // Ranges di IP sospetti
  ];
  
  return blacklistedIPs.includes(ip);
}

/**
 * Controllo geo-location (stub)
 */
async function checkGeoLocation(_ip: string): Promise<boolean> {
  // Qui dovresti usare un servizio di geo-location
  // per verificare che l'IP sia da una location permessa
  
  // Per ora permettiamo tutto
  return true;
}

/**
 * Controlla User-Agent sospetti
 */
function isSuspiciousUserAgent(userAgent: string): boolean {
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /postman/i,
    // Aggiungi altri pattern sospetti
  ];

  return suspiciousPatterns.some(pattern => pattern.test(userAgent));
}

/**
 * Log eventi di sicurezza
 */
async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  try {
    // Qui dovresti salvare nel database o inviare a un servizio di logging
    console.warn('Security Event:', {
      ...event,
      timestamp: event.timestamp.toISOString()
    });

    // In produzione potresti inviare a servizi come:
    // - Sentry per errori
    // - DataDog per metriche
    // - CloudWatch per AWS
    // - Custom webhook per notifiche
    
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

/**
 * Helper per applicare helmet security headers
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
  );

  // Other security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Remove sensitive headers
  response.headers.delete('X-Powered-By');
  response.headers.delete('Server');

  return response;
}

/**
 * Wrapper per route protette
 */
export function withAuth(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = await authMiddleware(request, true);
    
    if (!authResult.success) {
      return authResult.response!;
    }

    // Aggiunge le informazioni utente alla request
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = authResult.user;
    authenticatedRequest.sessionId = authResult.user?.sessionId;

    const response = await handler(authenticatedRequest);
    
    // Applica security headers
    return applySecurityHeaders(response);
  };
}

/**
 * Wrapper per route pubbliche con rate limiting
 */
export function withRateLimit(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Applica rate limiting
    const rateLimitResponse = await apiRateLimit()(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const response = await handler(request);
    
    // Applica security headers
    return applySecurityHeaders(response);
  };
}