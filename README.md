# 🐓 theWebRooster Portfolio

Portfolio personale professionale sviluppato con Next.js, TypeScript, Tailwind CSS e sistema di autenticazione militare.

## 🚀 Caratteristiche Principali

- **Frontend Moderno**: Next.js 15 + TypeScript + Tailwind CSS
- **Sistema Admin Completo**: CRUD progetti con autenticazione 2FA
- **Upload Sicuro**: Sistema di upload immagini con validazione magic bytes
- **Database PostgreSQL**: Dockerizzato con Prisma ORM type-safe
- **Sicurezza Militare**: Crittografia AES-256, JWT, 2FA, rate limiting
- **Design Responsive**: Dark theme professionale con accenti gialli
- **Performance Ottimizzate**: Componenti ottimizzati e caching

## 🛠️ Stack Tecnologico

### Frontend
- **Next.js 15** - Framework React full-stack con App Router
- **TypeScript** - Tipizzazione statica completa
- **Tailwind CSS** - Framework CSS utility-first
- **React 19** - Libreria UI moderna
- **Lucide React** - Libreria icone professionali

### Backend & Database
- **PostgreSQL** - Database relazionale con Prisma ORM
- **Prisma** - ORM moderno e type-safe
- **Docker** - Containerizzazione servizi
- **Redis** - Sessioni e rate limiting

### Sicurezza
- **AES-256-GCM** - Crittografia militare
- **JWT + 2FA** - Autenticazione a due fattori
- **PBKDF2** - Derivazione chiavi sicura
- **Rate Limiting** - Protezione attacchi brute force

### DevOps
- **Docker Compose** - Orchestrazione servizi
- **pgAdmin** - Interfaccia gestione database
- **Prisma Studio** - Database browser

## 📦 Installazione

### 1. Installa le dipendenze
```bash
npm install
```

### 2. Copia le variabili di ambiente
```bash
cp .env.example .env
```

### 3. Avvia i servizi Docker
```bash
npm run docker:up
```

Questo avvierà:
- **PostgreSQL** su porta 5432
- **pgAdmin** su porta 5050 (admin@example.com / admin123)
- **Redis** su porta 6379

### 4. Configura il database
```bash
# Genera il client Prisma
npm run db:generate

# Esegui le migrazioni
npm run db:migrate

# Popola il database con dati di esempio
npm run db:seed
```

### 5. Avvia l'applicazione
```bash
npm run dev
```

L'app sarà disponibile su [http://localhost:3000](http://localhost:3000)

## 🗄️ Gestione Database

### Comandi utili
```bash
# Avvia/ferma Docker
npm run docker:up
npm run docker:down

# Database
npm run db:generate    # Genera client Prisma
npm run db:migrate     # Applica migrazioni
npm run db:seed        # Popola con dati di esempio
npm run db:studio      # Apri Prisma Studio
npm run db:reset       # Reset completo database

# Sviluppo
npm run dev           # Avvia dev server
npm run build         # Build produzione
npm run start         # Avvia server produzione
```

### Accesso ai servizi
- **App**: http://localhost:3000
- **pgAdmin**: http://localhost:5050
- **Prisma Studio**: http://localhost:5555

## 🌐 API Endpoints

### Progetti
- `GET /api/projects` - Lista progetti (con filtri)
- `GET /api/projects/[slug]` - Singolo progetto

### Parametri di filtro
- `category` - Filtra per categoria
- `status` - Filtra per stato (completed, in-progress, etc.)
- `featured` - Solo progetti in evidenza (true/false)
- `technologies` - Filtra per tecnologie (comma-separated)

### Esempi
```bash
# Tutti i progetti
curl http://localhost:3000/api/projects

# Progetti completati
curl http://localhost:3000/api/projects?status=completed

# Progetti React in evidenza
curl http://localhost:3000/api/projects?technologies=React&featured=true
```

---

## 📁 Struttura del Progetto

### 🏗️ Directory Organization

```
my-portfolio/
├── 📄 Configuration Files
│   ├── next.config.js          # Next.js configuration
│   ├── tsconfig.json           # TypeScript configuration
│   ├── eslint.config.mjs       # ESLint configuration
│   ├── postcss.config.mjs      # PostCSS configuration
│   └── package.json            # Dependencies and scripts
│
├── 🔐 Environment & Security
│   ├── .env                    # Environment variables (private)
│   ├── .env.example           # Environment template
│   └── middleware.ts          # Next.js middleware
│
├── 🗄️ Database
│   ├── prisma/                # Database schema and migrations
│   └── seed-projects.mjs      # Database seeding script
│
├── 🎨 Frontend (src/)
│   ├── app/                   # Next.js App Router pages and API
│   │   ├── api/              # API endpoints
│   │   ├── admin/            # Admin panel pages
│   │   ├── auth/             # Authentication pages
│   │   └── projects/         # Portfolio pages
│   │
│   ├── components/           # React components (organized by feature)
│   │   ├── portfolio/        # Portfolio-related components
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectFilters.tsx
│   │   │   └── ProjectGrid.tsx
│   │   ├── layout/           # Layout and general UI components
│   │   │   └── CoinFlip.tsx
│   │   ├── admin/            # Admin-specific components
│   │   └── ui/               # Reusable UI components
│   │       └── FileUpload.tsx
│   │
│   ├── lib/                  # Utilities and configurations
│   │   ├── database/         # Database utilities
│   │   │   └── prisma.ts
│   │   ├── security/         # Security modules
│   │   │   ├── 2fa.ts
│   │   │   ├── config.ts
│   │   │   ├── encryption.ts
│   │   │   ├── jwt.ts
│   │   │   └── middleware.ts
│   │   ├── utils/            # General utilities
│   │   ├── auth.ts           # Authentication logic
│   │   ├── auth-client.ts    # Client-side auth utilities
│   │   └── index.ts          # Centralized exports
│   │
│   └── types/                # TypeScript type definitions
│       └── project.ts
│
└── 🌐 Public Assets
    ├── icons/                # SVG icons and logos
    └── images/               # Images and media
        ├── avatar.jpg
        ├── gallo.png
        └── projects/         # Project images (uploads)
```

### 🎯 Organization Principles

#### **Components Structure**
- `portfolio/` - Components specific to portfolio display
- `admin/` - Components for admin functionality
- `layout/` - General layout and UI components
- `ui/` - Reusable, generic UI components

#### **Lib Structure**
- `database/` - Database connection and utilities
- `security/` - Security-related modules (2FA, JWT, encryption)
- `utils/` - General utility functions
- `index.ts` - Centralized exports for easy imports

#### **Development Guidelines**
1. **Import Organization**: Use centralized exports from `lib/index.ts`
2. **Component Placement**: Place components in appropriate feature directories
3. **Type Safety**: All database operations are type-safe with Prisma
4. **Security First**: All admin operations require authentication
5. **File Organization**: Keep related files together in logical directories

---

## 🛡️ Sistema di Sicurezza Militare

### 🎯 Panoramica Sicurezza

Sistema di autenticazione "cyber warfare ready" che include:

- **Crittografia AES-256-GCM** con derivazione chiavi PBKDF2
- **JWT con rotazione automatica** e blacklist token
- **Autenticazione a due fattori (2FA)** con TOTP e backup codes
- **Rate limiting intelligente** per prevenire attacchi brute force
- **Device fingerprinting** per rilevare sessioni sospette
- **Security headers** completi e protezioni CSRF
- **File upload sicuro** con validazione magic bytes

### 🏗️ Architettura Sicurezza

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

### 🔐 Funzionalità di Sicurezza

#### **Crittografia**
- **AES-256-GCM** per dati sensibili
- **PBKDF2** per derivazione chiavi (100.000+ iterazioni)
- **Salt e IV** casuali per ogni operazione
- **Password hashing** con bcrypt + salt + pepper

#### **Autenticazione JWT**
- **Access token** (15 minuti) e **refresh token** (7 giorni)
- **Device fingerprinting** per sessioni uniche
- **IP validation** per prevenire hijacking
- **Token blacklist** per revoca immediata

#### **Two-Factor Authentication**
- **TOTP** compatibile con Google Authenticator, Authy
- **Backup codes** crittografati (10 codici usa-e-getta)
- **QR code** per setup semplice
- **Window tolleranza** configurabile per sync problemi

#### **Rate Limiting**
- **Login attempts**: 5 tentativi per 15 minuti
- **API calls**: 1000 richieste per ora
- **Admin API**: 100 richieste per ora
- **Upload files**: Validazione magic bytes, dimensioni, tipi

### 🚀 Utilizzo API di Autenticazione

#### **1. Login Base**
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
    }
  })
});

const data = await response.json();
if (data.requiresTwoFactor) {
  // Procedi con 2FA
  const challengeId = data.challengeId;
}
```

#### **2. Verifica 2FA**
```typescript
const response = await fetch('/api/auth/verify-2fa', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    challengeId: 'challenge-id-dal-login',
    code: '123456' // Codice TOTP o backup code
  })
});
```

#### **3. Setup 2FA**
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
```

#### **4. Upload Sicuro File**
```typescript
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}` 
  },
  body: formData
});
```

### ⚙️ Configurazione Sicurezza

#### **Variabili Ambiente (.env)**
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

#### **Generazione Secrets**
```bash
# Genera secrets sicuri
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 🔒 Sicurezza in Produzione

#### **Checklist Pre-Deploy**
- [ ] **Secrets unici** generati crittograficamente
- [ ] **HTTPS obbligatorio** con certificato valido
- [ ] **Database protetto** con credenziali uniche
- [ ] **Rate limiting** abilitato su proxy/CDN
- [ ] **Backup database** crittografati
- [ ] **Monitoring** eventi di sicurezza
- [ ] **File upload** con validazione server-side

#### **Monitoring Consigliato**
- **Failed login attempts** oltre soglia
- **Multiple device access** simultaneo
- **Rate limit violations** ripetute
- **File upload** tentativi malevoli
- **Token manipulation** attempts

### 🎖️ Certificazione Standard

Questo sistema implementa:
- **NIST Cybersecurity Framework**
- **ISO 27001 Controls**
- **OWASP Top 10 Protection**
- **Military-Grade Encryption (AES-256)**

**Status**: ✅ **CYBER WARFARE READY** ✅

---

## 📝 Note per Sviluppatori

### **Script Utili**
```bash
npm run clean         # Pulisce file temporanei e .DS_Store
npm run lint:fix      # Corregge automaticamente errori ESLint
npm run db:studio     # Apri Prisma Studio per gestione database
npm run docker:up     # Avvia servizi Docker (PostgreSQL, pgAdmin)
```

### **Troubleshooting Comune**

**Errore "Invalid or expired token":**
- Token scaduto: usa refresh token
- Device fingerprint mismatch: ri-autentica

**Errore "2FA code invalid":**
- Clock sync issue: controlla time window
- Backup code già usato: genera nuovi codes

**Errore upload "File type not allowed":**
- Validazione magic bytes fallita
- Tipo file non supportato (solo JPEG, PNG, WebP, GIF)

### **Performance Note**
- Immagini ottimizzate automaticamente con Next.js Image
- Database query ottimizzate con Prisma
- Caching intelligente per progetti e media
- Rate limiting per proteggere API

---

**Sviluppato con ❤️ da theWebRooster** 🐓
