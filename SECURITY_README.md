# 🛡️ Sistema di Autenticazione Militare

## 🎯 Panoramica

Sistema di autenticazione a "prova di guerra cibernetica" implementato per il portfolio di TheWebRooster. Include:

- **Crittografia AES-256-GCM** con derivazione chiavi PBKDF2
- **JWT con rotazione automatica** e blacklist token
- **Autenticazione a due fattori (2FA)** con TOTP e backup codes
- **Rate limiting intelligente** per prevenire attacchi brute force
- **Device fingerprinting** per rilevare sessioni sospette
- **Security headers** completi e protezioni CSRF
- **Audit logging** per tracciare eventi di sicurezza

## 🏗️ Architettura

```
src/lib/security/
├── config.ts           # Configurazione sicurezza
├── encryption.ts       # Servizio crittografia AES-256
├── jwt.ts             # Gestione JWT e sessioni
├── 2fa.ts             # Autenticazione a due fattori
└── middleware.ts      # Middleware sicurezza e rate limiting

src/app/api/auth/
├── login/route.ts     # Endpoint login
├── verify-2fa/route.ts # Verifica codice 2FA
├── refresh/route.ts   # Refresh token
├── logout/route.ts    # Logout e revoca sessione
└── 2fa/
    ├── setup/route.ts       # Setup 2FA
    └── verify-setup/route.ts # Verifica setup 2FA
```

## 🔐 Funzionalità di Sicurezza

### Crittografia
- **AES-256-GCM** per dati sensibili
- **PBKDF2** per derivazione chiavi (100.000+ iterazioni)
- **Salt e IV** casuali per ogni operazione
- **Password hashing** con bcrypt + salt + pepper

### Autenticazione JWT
- **Access token** (15 minuti) e **refresh token** (7 giorni)
- **Device fingerprinting** per sessioni uniche
- **IP validation** per prevenire hijacking
- **Token blacklist** per revoca immediata
- **Sessioni multiple** con gestione centralizzata

### Two-Factor Authentication
- **TOTP** compatibile con Google Authenticator, Authy
- **Backup codes** crittografati (10 codici usa-e-getta)
- **QR code** per setup semplice
- **Window tolleranza** configurabile per sync problemi

### Rate Limiting
- **Login attempts**: 5 tentativi per 15 minuti
- **API calls**: 1000 richieste per ora
- **Admin API**: 100 richieste per ora
- **Key generation** per IP + User-Agent

### Protezioni Aggiuntive
- **Honeypot fields** per rilevare bot
- **Geo-blocking** opzionale per IP esteri
- **User-Agent validation** contro scraper noti
- **Security headers** completi (CSP, HSTS, etc.)

## 🚀 Utilizzo

### 1. Login Base
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@thewebrooster.dev',
    password: 'AdminSecure123!',
    deviceInfo: {
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    },
    honeypot: '' // Lascia sempre vuoto
  })
});

const data = await response.json();

if (data.requiresTwoFactor) {
  // Procedi con 2FA
  const challengeId = data.challengeId;
} else {
  // Login completato
  const { accessToken, refreshToken } = data.tokens;
}
```

### 2. Verifica 2FA
```typescript
const response = await fetch('/api/auth/verify-2fa', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    challengeId: 'challenge-id-dal-login',
    code: '123456', // Codice TOTP o backup code
    deviceInfo: {
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    }
  })
});
```

### 3. Setup 2FA
```typescript
// Inizializza setup
const setupResponse = await fetch('/api/auth/2fa/setup', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});

const { qrCodeUrl, backupCodes, setupToken } = setupResponse.data.setup;

// Mostra QR code all'utente, poi verifica
const verifyResponse = await fetch('/api/auth/2fa/verify-setup', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    setupToken,
    totpCode: '123456' // Codice dall'app authenticator
  })
});
```

### 4. Refresh Token
```typescript
const response = await fetch('/api/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    refreshToken: storedRefreshToken,
    deviceInfo: {
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  })
});
```

### 5. Logout
```typescript
await fetch('/api/auth/logout', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

## ⚙️ Configurazione

### Variabili Ambiente (.env.local)
```env
# JWT Secrets (genera con crypto.randomBytes(64).toString('hex'))
JWT_ACCESS_SECRET=your-super-secret-access-key-64-bytes
JWT_REFRESH_SECRET=your-super-secret-refresh-key-64-bytes

# Password Security
PASSWORD_PEPPER=your-password-pepper-64-bytes

# Encryption
ENCRYPTION_KEY=your-encryption-key-32-bytes

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio

# Redis (per sessioni e rate limiting)
REDIS_URL=redis://localhost:6379
```

### Generazione Secrets
```bash
# Genera secrets sicuri
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🔒 Sicurezza in Produzione

### Checklist Pre-Deploy
- [ ] **Secrets unici** generati crittograficamente
- [ ] **HTTPS obbligatorio** con certificato valido
- [ ] **Database protetto** con credenziali uniche
- [ ] **Rate limiting** abilitato su proxy/CDN
- [ ] **Backup database** crittografati
- [ ] **Monitoring** eventi di sicurezza
- [ ] **IP whitelist** per admin se necessario

### Monitoring Consigliato
- **Failed login attempts** oltre soglia
- **Multiple device access** simultaneo
- **Geo-anomalies** (login da paesi diversi)
- **Rate limit violations** ripetute
- **Token manipulation** attempts
- **2FA bypass** tentativi

### Rate Limiting Produzione
```typescript
// Usa Redis per rate limiting distribuito
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Implementa sliding window o token bucket
// per rate limiting più sofisticato
```

## 🛠️ Troubleshooting

### Errori Comuni

**"Invalid or expired token"**
- Token scaduto: usa refresh token
- Device fingerprint mismatch: ri-autentica
- Token manipolato: login completo necessario

**"2FA code invalid"**
- Clock sync issue: controlla time window
- Backup code già usato: genera nuovi codes
- Secret corrupted: reset 2FA setup

**"Rate limit exceeded"**
- Troppi tentativi: aspetta finestra temporale
- IP bloccato: controlla blacklist
- User-Agent sospetto: verifica headers

### Log Debugging
```bash
# Controlla eventi di sicurezza
docker logs portfolio-app | grep "Security Event"

# Monitor rate limiting
docker logs portfolio-app | grep "Rate limit"

# Verifica token issues
docker logs portfolio-app | grep "Token validation"
```

## 📚 Riferimenti

- [OWASP Authentication Guidelines](https://owasp.org/www-project-authentication-cheat-sheet/)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-jwt-bcp)
- [TOTP RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238)
- [AES-GCM Encryption](https://csrc.nist.gov/publications/detail/sp/800-38d/final)

---

## 🎖️ Certificazione Militare

Questo sistema implementa standard di sicurezza equivalenti a:
- **NIST Cybersecurity Framework**
- **ISO 27001 Controls**
- **OWASP Top 10 Protection**
- **Military-Grade Encryption (AES-256)**

**Status**: ✅ **CYBER WARFARE READY** ✅