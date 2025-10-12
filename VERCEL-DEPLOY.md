# 🚀 Guida Deploy Vercel - Portfolio theWebRooster

## 📋 Checklist Pre-Deploy

- [ ] Account GitHub con repository pubblico
- [ ] Account Vercel (gratuito)
- [ ] Account Railway o Supabase per database PostgreSQL
- [ ] Secrets di produzione generati

---

## 🗄️ Step 1: Setup Database PostgreSQL Gratuito

### Opzione A: Railway (Raccomandato)
1. Vai su [railway.app](https://railway.app)
2. Accedi con GitHub
3. "New Project" → "Provision PostgreSQL"
4. Copia la `DATABASE_URL` dal dashboard

### Opzione B: Supabase
1. Vai su [supabase.com](https://supabase.com) 
2. "New Project"
3. Settings → Database → Connection string
4. Sostituisci `[YOUR-PASSWORD]` con la tua password

---

## 🔑 Step 2: Genera Secrets di Produzione

```bash
# Genera JWT secrets sicuri
node -e "console.log('JWT_ACCESS_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('PASSWORD_PEPPER=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))"
```

**⚠️ IMPORTANTE**: Salva questi valori al sicuro!

---

## 🚀 Step 3: Deploy su Vercel

### 3.1 - Connetti Repository
1. Vai su [vercel.com](https://vercel.com)
2. "Import Project" → Seleziona repository GitHub
3. Framework: **Next.js** (auto-detect)
4. Root Directory: `./` (default)

### 3.2 - Configura Environment Variables
Nel dashboard Vercel → Settings → Environment Variables:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Secrets (USA QUELLI GENERATI SOPRA!)
JWT_ACCESS_SECRET=your-generated-64-byte-secret
JWT_REFRESH_SECRET=your-generated-64-byte-secret  
PASSWORD_PEPPER=your-generated-64-byte-secret
ENCRYPTION_KEY=your-generated-32-byte-secret

# Admin
ADMIN_EMAIL=admin@thewebrooster.dev
ADMIN_PASSWORD=YourSecurePassword123!

# App
NEXTAUTH_URL=https://your-app.vercel.app
```

### 3.3 - Deploy
1. Click **"Deploy"**
2. Aspetta il build (2-3 minuti)
3. Il tuo portfolio sarà live su `https://your-app.vercel.app`

---

## 📊 Step 4: Setup Database

Dopo il primo deploy:

```bash
# Installa Vercel CLI
npm i -g vercel

# Login
vercel login

# Run migrations su Vercel
vercel env pull .env.production
npx prisma migrate deploy
npx prisma db seed
```

---

## 🌐 Step 5: Collega il tuo Dominio Aruba

### Opzione A: Redirect Completo
Nel tuo hosting Aruba, crea `.htaccess`:

```apache
# Redirect tutto il sito al portfolio Vercel
RewriteEngine On
RewriteRule ^(.*)$ https://your-portfolio.vercel.app/$1 [R=301,L]
```

### Opzione B: Sottodominio
1. **DNS Aruba**: Aggiungi record CNAME:
   ```
   portfolio.thewebrooster.dev → cname.vercel-dns.com
   ```

2. **Vercel Dashboard** → Settings → Domains:
   - Aggiungi: `portfolio.thewebrooster.dev`

### Opzione C: Dominio Custom
1. **Vercel Dashboard** → Settings → Domains
2. Aggiungi: `thewebrooster.dev`
3. Configura DNS secondo istruzioni Vercel

---

## ✅ Step 6: Verifica Tutto Funzioni

1. **Homepage**: ✅ Si carica correttamente
2. **Database**: ✅ Progetti mostrati
3. **Admin Login**: ✅ Autenticazione funziona  
4. **Upload File**: ✅ (con limitazioni Vercel)
5. **2FA**: ✅ Codici TOTP funzionano

---

## 💰 Costi

- **Vercel**: GRATUITO (Hobby plan)
- **Railway PostgreSQL**: GRATUITO (5GB)
- **Dominio Aruba**: PAGATO (già hai)
- **Totale**: €0/mese 🎉

---

## 🔧 Comandi Utili

```bash
# Deploy locale
npm run build
npm run start

# Check Vercel logs
vercel logs

# Update environment variables
vercel env add VARIABLE_NAME

# Database operations
npx prisma migrate deploy
npx prisma studio
```

---

## 🆘 Troubleshooting

### Build Error su Vercel
- Check logs: `vercel logs`
- Verifica environment variables
- Test build locale: `npm run build`

### Database Connection Error
- Verifica `DATABASE_URL` corretta
- Check IP whitelist su Railway/Supabase
- Test connessione: `psql $DATABASE_URL`

### Upload Files Non Funziona
- Vercel ha limite /tmp
- Considera AWS S3 o Cloudinary per storage

---

**Il tuo portfolio sarà live in 10 minuti! 🚀**