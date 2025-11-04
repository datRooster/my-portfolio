# 🔧 Fix Errore CORS iframe - Railway Webchat

## 🚨 Problema

```
[Error] Blocked a frame with origin "https://web-production-75688.up.railway.app" 
from accessing a frame with origin "https://www.webrooster.it". 
Protocols, domains, and ports must match.
```

## ✅ Soluzione

Devi modificare il file `next.config.ts` del progetto **ircapp su Railway** per permettere l'embed dell'iframe.

### 📝 Passo 1: Aggiorna `next.config.ts` su ircapp

Aggiungi gli headers per permettere l'embed dal tuo portfolio:

```typescript
// next.config.ts nel progetto ircapp
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
  
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Environment variables
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },

  // ✅ NUOVO: Headers per permettere l'embed in iframe
  async headers() {
    return [
      {
        // Applica a tutte le route
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://www.webrooster.it', // Permetti embed dal tuo portfolio
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://www.webrooster.it https://localhost:3000", // CSP più moderno
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.webrooster.it', // CORS per comunicazione cross-origin
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### 🔄 Passo 2: Deploy su Railway

```bash
# Nel progetto ircapp
cd /path/to/ircapp

# Commit il cambio
git add next.config.ts
git commit -m "feat: allow iframe embed from webrooster.it"

# Push su GitHub (Railway deploya automaticamente)
git push origin main
```

### ⏱️ Passo 3: Attendi il Deploy

Railway re-deployerà automaticamente (circa 2-3 minuti).

### ✅ Passo 4: Verifica

Dopo il deploy:
1. Vai su `https://www.webrooster.it/contact`
2. Clicca su "Chat in Tempo Reale"
3. L'iframe dovrebbe caricarsi senza errori CORS

---

## 🔍 Alternative / Troubleshooting

### Opzione A: Wildcard per tutti i domini (meno sicuro)

Se vuoi permettere embed da qualsiasi dominio (utile per testing):

```typescript
{
  key: 'X-Frame-Options',
  value: 'SAMEORIGIN', // O rimuovi completamente questo header
},
{
  key: 'Content-Security-Policy',
  value: "frame-ancestors *", // Permetti da qualsiasi dominio
},
```

### Opzione B: Headers via middleware.ts

Se preferisci usare il middleware Next.js invece di `next.config.ts`:

```typescript
// middleware.ts nel progetto ircapp
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Permetti embed da portfolio
  response.headers.set('X-Frame-Options', 'ALLOW-FROM https://www.webrooster.it')
  response.headers.set('Content-Security-Policy', "frame-ancestors 'self' https://www.webrooster.it")
  response.headers.set('Access-Control-Allow-Origin', 'https://www.webrooster.it')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  
  return response
}

export const config = {
  matcher: '/:path*',
}
```

### Opzione C: Configurazione Railway (headers nativi)

Railway permette anche di configurare headers via `railway.toml`:

```toml
# railway.toml nel progetto ircapp
[deploy]
healthcheckPath = "/"
healthcheckTimeout = 100
restartPolicyType = "never"

[[deploy.headers]]
source = "/:path*"
headers = { X-Frame-Options = "ALLOW-FROM https://www.webrooster.it", Content-Security-Policy = "frame-ancestors 'self' https://www.webrooster.it" }
```

---

## 🎯 Soluzione Definitiva: Sottodominio

Per una soluzione più pulita e professionale, considera di usare un **sottodominio**:

```
Portfolio: https://www.webrooster.it
Webchat:   https://chat.webrooster.it
```

**Vantaggi:**
- Stesso dominio principale (webrooster.it)
- CORS più semplice da gestire
- Cookies condivisi (possibile SSO futuro)
- URL più professionale

**Setup:**
1. Su Railway: Settings → Domains → Add Custom Domain: `chat.webrooster.it`
2. Su DNS (Cloudflare): Aggiungi record CNAME per `chat` → Railway URL
3. Railway gestisce automaticamente SSL
4. Aggiorna URL webchat nel portfolio

```tsx
// src/components/ui/WebchatEmbed.tsx
webchatUrl = 'https://chat.webrooster.it' // Invece di Railway URL
```

---

## 📊 Verifica Configurazione

Dopo il deploy, testa con curl:

```bash
# Verifica headers
curl -I https://web-production-75688.up.railway.app

# Dovresti vedere:
# X-Frame-Options: ALLOW-FROM https://www.webrooster.it
# Content-Security-Policy: frame-ancestors 'self' https://www.webrooster.it
# Access-Control-Allow-Origin: https://www.webrooster.it
```

---

## 🔐 Note Sicurezza

**IMPORTANTE:**
- Non usare `frame-ancestors *` in produzione (troppo permissivo)
- Specifica sempre domini esatti per sicurezza
- Se usi sottodominio, aggiorna anche CSP del portfolio

**CSP del Portfolio** (in `my-portfolio/next.config.js`):

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "frame-src 'self' https://web-production-75688.up.railway.app https://chat.webrooster.it",
        },
      ],
    },
  ];
},
```

---

**Fatto! L'iframe dovrebbe funzionare dopo queste modifiche.** 🎉
