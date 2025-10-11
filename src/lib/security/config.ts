// Security Configuration - Environment Variables
// Tutte le chiavi devono essere generate crittograficamente sicure

import crypto from 'crypto';

export const SECURITY_CONFIG = {
    // JWT Configuration
  JWT: {
    ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_SECRET || crypto.randomBytes(64).toString('hex'),
    REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_SECRET || crypto.randomBytes(64).toString('hex'),
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || crypto.randomBytes(64).toString('hex'),
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || crypto.randomBytes(64).toString('hex'),
    ACCESS_TOKEN_EXPIRES: '15m' as const,
    REFRESH_TOKEN_EXPIRES: '7d' as const,
    ACCESS_TOKEN_EXPIRY: 15 * 60, // 15 minuti in secondi
    REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 giorni in secondi
    ALGORITHM: 'HS256' as const,
    ISSUER: 'thewebrooster.dev',
    AUDIENCE: 'thewebrooster-admin',
    CLEANUP_INTERVAL: 60 * 60 * 1000 // 1 ora in millisecondi
  },

  // Password Security
  PASSWORD: {
    MIN_LENGTH: 12,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL: true,
    BCRYPT_ROUNDS: 14, // CPU-intensive per maggiore sicurezza
    PEPPER: process.env.PASSWORD_PEPPER || 'fallback-pepper-change-in-production',
    MAX_AGE_DAYS: 90, // Forza cambio password ogni 90 giorni
    HISTORY_COUNT: 12 // Non riutilizzare ultime 12 password
  },

    // Two-Factor Authentication
  TWO_FACTOR: {
    ISSUER: 'theWebRooster Portfolio',
    WINDOW: 2, // Finestra di tolleranza TOTP
    TOTP_WINDOW: 2, // Alias per compatibilità
    BACKUP_CODES_COUNT: 10,
    BACKUP_CODE_LENGTH: 8,
    SECRET_LENGTH: 32 // Lunghezza secret TOTP
  },

  // Session Security
  SESSION: {
    MAX_CONCURRENT: 3, // Massimo 3 sessioni simultanee
    IDLE_TIMEOUT: 30 * 60 * 1000, // 30 minuti di inattività
    ABSOLUTE_TIMEOUT: 8 * 60 * 60 * 1000, // 8 ore massime
    SECURE_COOKIES: process.env.NODE_ENV === 'production',
    SAME_SITE: 'strict' as const
  },

  // Rate Limiting
  RATE_LIMIT: {
    LOGIN_ATTEMPTS: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minuti
      MAX_ATTEMPTS: 5,
      LOCKOUT_DURATION: 30 * 60 * 1000 // 30 minuti lockout
    },
    API_CALLS: {
      WINDOW_MS: 15 * 60 * 1000,
      MAX_REQUESTS: 1000 // Per IP
    },
    ADMIN_API: {
      WINDOW_MS: 15 * 60 * 1000,
      MAX_REQUESTS: 200 // Più restrittivo per admin
    }
  },

  // Security Headers
  SECURITY_HEADERS: {
    CONTENT_SECURITY_POLICY: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
        fontSrc: ["'self'", 'fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"]
      }
    },
    HSTS_MAX_AGE: 31536000, // 1 anno
    REFERRER_POLICY: 'strict-origin-when-cross-origin'
  },

  // Encryption
  ENCRYPTION: {
    ALGORITHM: 'aes-256-gcm',
    KEY_DERIVATION: 'pbkdf2',
    ITERATIONS: 100000,
    KEY_LENGTH: 32,
    IV_LENGTH: 16,
    TAG_LENGTH: 16,
    SALT_LENGTH: 32
  },

  // Audit & Monitoring
  AUDIT: {
    RETENTION_DAYS: 365, // Mantieni log per 1 anno
    CRITICAL_EVENTS_WEBHOOK: process.env.SECURITY_WEBHOOK_URL,
    REAL_TIME_ALERTS: true
  },

  // Geo & IP Security
  GEO_SECURITY: {
    ENABLED: true,
    BLOCKED_COUNTRIES: ['CN', 'RU', 'KP'], // Blocca paesi ad alto rischio
    SUSPICIOUS_COUNTRIES: ['IR', 'SY'], // Richiedi verifica aggiuntiva
    VPN_DETECTION: true,
    TOR_DETECTION: true
  },

  // Device Fingerprinting
  DEVICE_FINGERPRINTING: {
    ENABLED: true,
    REQUIRE_DEVICE_VERIFICATION: true, // Per nuovi device
    TRUST_DURATION_DAYS: 30
  }
} as const;

// Validation functions
export function validateSecurityConfig() {
  const missing = [];
  
  if (!process.env.JWT_ACCESS_SECRET || process.env.JWT_ACCESS_SECRET.length < 32) {
    missing.push('JWT_ACCESS_SECRET (minimum 32 characters)');
  }
  
  if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.length < 32) {
    missing.push('JWT_REFRESH_SECRET (minimum 32 characters)');
  }
  
  if (!process.env.PASSWORD_PEPPER || process.env.PASSWORD_PEPPER.length < 32) {
    missing.push('PASSWORD_PEPPER (minimum 32 characters)');
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing security configuration: ${missing.join(', ')}`);
  }
}

// Aggiungi la configurazione SECURITY al SECURITY_CONFIG
const ADDITIONAL_SECURITY_CONFIG = {
  // Security Settings
  SECURITY: {
    STRICT_DEVICE_VERIFICATION: true,
    ENABLE_IP_VALIDATION: true,
    ENABLE_GEO_BLOCKING: true,
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 30 * 60, // 30 minuti
    ENABLE_HONEYPOT: true
  }
};

// Estendi la configurazione principale
Object.assign(SECURITY_CONFIG, ADDITIONAL_SECURITY_CONFIG);

// Generate secure secrets for production
export function generateSecureSecrets() {
  return {
    JWT_ACCESS_SECRET: crypto.randomBytes(64).toString('hex'),
    JWT_REFRESH_SECRET: crypto.randomBytes(64).toString('hex'),
    PASSWORD_PEPPER: crypto.randomBytes(64).toString('hex'),
    ENCRYPTION_KEY: crypto.randomBytes(32).toString('hex')
  };
}