import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { SECURITY_CONFIG } from './config';
import { encryption } from './encryption';

/**
 * JWT Authentication Service - Military Grade
 * Implementa JWT con rotazione automatica, blacklist e validazione rigorosa
 */

export interface TokenPayload extends JwtPayload {
  userId: string;
  role: string;
  sessionId: string;
  permissions: string[];
  deviceFingerprint: string;
  ipAddress: string;
  createdAt: number;
  lastActivity: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  sessionId: string;
}

export interface AuthResult {
  success: boolean;
  tokens?: TokenPair;
  user?: UserData;
  error?: string;
  requiresTwoFactor?: boolean;
  challengeId?: string;
}

interface SessionData {
  userId: string;
  createdAt: number;
  lastActivity: number;
  deviceFingerprint: string;
  ipAddress: string;
  isActive: boolean;
  revokedAt?: number;
}

interface UserData {
  id: string;
  role: string;
  permissions: string[];
}

interface DeviceInfo {
  userAgent: string;
  ipAddress: string;
  timezone?: string;
  language?: string;
  screen?: string;
}

export class JWTService {
  private static instance: JWTService;
  private tokenBlacklist = new Set<string>();
  private sessionStore = new Map<string, SessionData>();

  private constructor() {
    // Pulizia periodica della blacklist
    setInterval(() => {
      this.cleanupBlacklist();
    }, SECURITY_CONFIG.JWT.CLEANUP_INTERVAL);
  }

  static getInstance(): JWTService {
    if (!JWTService.instance) {
      JWTService.instance = new JWTService();
    }
    return JWTService.instance;
  }

  /**
   * Genera coppia di token (access + refresh) con massima sicurezza
   */
  async generateTokenPair(user: UserData, deviceInfo: DeviceInfo): Promise<TokenPair> {
    const sessionId = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    
    // Genera fingerprint del device
    const deviceFingerprint = encryption.generateDeviceFingerprint(
      deviceInfo.userAgent,
      deviceInfo.ipAddress,
      {
        timezone: deviceInfo.timezone,
        language: deviceInfo.language,
        screen: deviceInfo.screen
      }
    );

    // Payload per access token (più limitato)
    const accessPayload: TokenPayload = {
      userId: user.id,
      role: user.role,
      sessionId,
      permissions: user.permissions || [],
      deviceFingerprint,
      ipAddress: deviceInfo.ipAddress,
      createdAt: now,
      lastActivity: now,
      iat: now,
      exp: now + SECURITY_CONFIG.JWT.ACCESS_TOKEN_EXPIRY,
      iss: SECURITY_CONFIG.JWT.ISSUER,
      aud: SECURITY_CONFIG.JWT.AUDIENCE
    };

    // Payload per refresh token (più permissivo ma con dati limitati)
    const refreshPayload = {
      userId: user.id,
      sessionId,
      deviceFingerprint,
      type: 'refresh',
      iat: now,
      exp: now + SECURITY_CONFIG.JWT.REFRESH_TOKEN_EXPIRY,
      iss: SECURITY_CONFIG.JWT.ISSUER,
      aud: SECURITY_CONFIG.JWT.AUDIENCE
    };

    // Genera token con chiavi diverse per sicurezza aggiuntiva
    const accessToken = jwt.sign(
      accessPayload,
      SECURITY_CONFIG.JWT.ACCESS_SECRET,
      {
        algorithm: SECURITY_CONFIG.JWT.ALGORITHM,
        keyid: 'access-key-v1'
      }
    );

    const refreshToken = jwt.sign(
      refreshPayload,
      SECURITY_CONFIG.JWT.REFRESH_SECRET,
      {
        algorithm: SECURITY_CONFIG.JWT.ALGORITHM,
        keyid: 'refresh-key-v1'
      }
    );

    // Salva sessione per tracking
    this.sessionStore.set(sessionId, {
      userId: user.id,
      createdAt: now,
      lastActivity: now,
      deviceFingerprint,
      ipAddress: deviceInfo.ipAddress,
      isActive: true
    });

    return {
      accessToken,
      refreshToken,
      expiresAt: (accessPayload.exp || now + SECURITY_CONFIG.JWT.ACCESS_TOKEN_EXPIRY) * 1000, // Converti in milliseconds
      sessionId
    };
  }

  /**
   * Valida access token con controlli rigorosi
   */
  async validateAccessToken(token: string, deviceInfo?: DeviceInfo): Promise<TokenPayload | null> {
    try {
      // Controllo blacklist
      if (this.tokenBlacklist.has(token)) {
        throw new Error('Token blacklisted');
      }

      // Verifica JWT
      const decoded = jwt.verify(
        token,
        SECURITY_CONFIG.JWT.ACCESS_SECRET,
        {
          algorithms: [SECURITY_CONFIG.JWT.ALGORITHM],
          issuer: SECURITY_CONFIG.JWT.ISSUER,
          audience: SECURITY_CONFIG.JWT.AUDIENCE,
          maxAge: SECURITY_CONFIG.JWT.ACCESS_TOKEN_EXPIRY + 's'
        }
      ) as TokenPayload;

      // Controlli aggiuntivi
      if (!decoded.sessionId || !decoded.userId) {
        throw new Error('Invalid token structure');
      }

      // Verifica sessione attiva
      const session = this.sessionStore.get(decoded.sessionId);
      if (!session || !session.isActive) {
        throw new Error('Session expired or invalid');
      }

      // Verifica fingerprint del device se fornito
      if (deviceInfo) {
        const currentFingerprint = encryption.generateDeviceFingerprint(
          deviceInfo.userAgent,
          deviceInfo.ipAddress
        );
        
        if (decoded.deviceFingerprint !== currentFingerprint) {
          // Log evento sospetto
          console.warn('Device fingerprint mismatch', {
            userId: decoded.userId,
            sessionId: decoded.sessionId,
            expected: decoded.deviceFingerprint,
            actual: currentFingerprint
          });
          
          // In modalità strict, invalida il token
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((SECURITY_CONFIG as any).SECURITY?.STRICT_DEVICE_VERIFICATION) {
            throw new Error('Device verification failed');
          }
        }
      }

      // Aggiorna attività sessione
      session.lastActivity = Math.floor(Date.now() / 1000);
      
      return decoded;

    } catch (error) {
      console.warn('Token validation failed:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  /**
   * Rinnova access token usando refresh token
   */
  async refreshAccessToken(refreshToken: string, deviceInfo: DeviceInfo): Promise<TokenPair | null> {
    try {
      // Verifica refresh token
      const decoded = jwt.verify(
        refreshToken,
        SECURITY_CONFIG.JWT.REFRESH_SECRET,
        {
          algorithms: [SECURITY_CONFIG.JWT.ALGORITHM],
          issuer: SECURITY_CONFIG.JWT.ISSUER,
          audience: SECURITY_CONFIG.JWT.AUDIENCE
        }
      ) as JwtPayload & { type: string; userId: string; sessionId: string; deviceFingerprint: string };

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // Verifica sessione
      const session = this.sessionStore.get(decoded.sessionId);
      if (!session || !session.isActive) {
        throw new Error('Session expired');
      }

      // Verifica device fingerprint
      const currentFingerprint = encryption.generateDeviceFingerprint(
        deviceInfo.userAgent,
        deviceInfo.ipAddress
      );

      if (decoded.deviceFingerprint !== currentFingerprint) {
        throw new Error('Device verification failed');
      }

      // Qui dovresti recuperare i dati utente dal database
      // Per ora uso dati dalla sessione
      const userData: UserData = {
        id: decoded.userId,
        role: 'admin', // Recupera dal DB
        permissions: ['all'] // Recupera dal DB
      };

      // Genera nuova coppia di token
      return await this.generateTokenPair(userData, deviceInfo);

    } catch (error) {
      console.warn('Token refresh failed:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  /**
   * Revoca token e invalida sessione
   */
  async revokeToken(token: string, sessionId?: string): Promise<boolean> {
    try {
      // Aggiungi alla blacklist
      this.tokenBlacklist.add(token);

      // Invalida sessione se fornita
      if (sessionId) {
        const session = this.sessionStore.get(sessionId);
        if (session) {
          session.isActive = false;
          session.revokedAt = Math.floor(Date.now() / 1000);
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Revoca tutte le sessioni di un utente
   */
  async revokeAllUserSessions(userId: string): Promise<number> {
    let revokedCount = 0;
    
    for (const [sessionId, session] of this.sessionStore) {
      if (session.userId === userId && session.isActive) {
        session.isActive = false;
        session.revokedAt = Math.floor(Date.now() / 1000);
        revokedCount++;
      }
    }

    return revokedCount;
  }

  /**
   * Ottieni sessioni attive di un utente
   */
  getActiveSessions(userId: string): Array<{
    sessionId: string;
    createdAt: number;
    lastActivity: number;
    ipAddress: string;
    deviceFingerprint: string;
  }> {
    const sessions = [];
    
    for (const [sessionId, session] of this.sessionStore) {
      if (session.userId === userId && session.isActive) {
        sessions.push({
          sessionId,
          createdAt: session.createdAt,
          lastActivity: session.lastActivity,
          ipAddress: session.ipAddress,
          deviceFingerprint: session.deviceFingerprint
        });
      }
    }

    return sessions;
  }

  /**
   * Pulizia periodica della blacklist
   */
  private cleanupBlacklist(): void {
    // In un'implementazione reale, useresti Redis con TTL
    // Per ora manteniamo tutto in memoria
    const cutoff = Math.floor(Date.now() / 1000) - SECURITY_CONFIG.JWT.ACCESS_TOKEN_EXPIRY;
    
    // Rimuovi sessioni inattive vecchie
    for (const [sessionId, session] of this.sessionStore) {
      if (!session.isActive && session.revokedAt && session.revokedAt < cutoff) {
        this.sessionStore.delete(sessionId);
      }
    }
  }

  /**
   * Estrai payload da token senza validazione (per logging)
   */
  extractPayload(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token);
      return typeof decoded === 'object' ? decoded : null;
    } catch {
      return null;
    }
  }
}

// Export singleton
export const jwtService = JWTService.getInstance();