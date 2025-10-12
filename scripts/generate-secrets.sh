#!/bin/bash

# 🔑 Generatore Secrets per Deploy Vercel
# Genera tutti i secrets necessari per la produzione

echo "🔑 Generando secrets di produzione per Vercel..."
echo ""

echo "# ===== COPIA QUESTI VALORI IN VERCEL DASHBOARD ====="
echo "# Settings → Environment Variables"
echo ""

echo "# Database (sostituisci con il tuo DATABASE_URL da Railway/Supabase)"
echo "DATABASE_URL=postgresql://username:password@host:port/database"
echo ""

echo "# JWT Secrets (generati automaticamente)"
echo "JWT_ACCESS_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")"
echo "JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")"
echo ""

echo "# Password Security" 
echo "PASSWORD_PEPPER=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")"
echo ""

echo "# Encryption Key"
echo "ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
echo ""

echo "# Admin Credentials (personalizza)"
echo "ADMIN_EMAIL=admin@thewebrooster.dev"
echo "ADMIN_PASSWORD=YourSecurePassword123!"
echo ""

echo "# App URLs (sostituisci con il tuo URL Vercel)"
echo "NEXTAUTH_URL=https://your-portfolio.vercel.app"
echo "VERCEL_URL=your-portfolio.vercel.app"
echo ""

echo "# Upload Configuration"
echo "UPLOAD_DIR=/tmp/uploads"
echo "MAX_FILE_SIZE=5242880"
echo ""

echo "✅ Secrets generati! Copia questi valori nel dashboard Vercel."
echo ""
echo "📋 Prossimi step:"
echo "1. Vai su vercel.com e importa il repository"
echo "2. Aggiungi tutte le environment variables sopra"
echo "3. Configura il database PostgreSQL su Railway/Supabase"
echo "4. Deploy! 🚀"