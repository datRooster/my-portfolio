#!/bin/bash

# 🚀 Portfolio Deployment Script per Aruba Linux Hosting
# Uso: ./deploy.sh [static|server]

set -e  # Exit on any error

echo "🚀 Starting Portfolio Deployment..."

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funzione per logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Parametri
DEPLOY_TYPE=${1:-"server"}
PROJECT_DIR=$(cd .. && pwd)  # Parent directory (project root)
BACKUP_DIR="$PROJECT_DIR/backups"
DATE=$(date +%Y%m%d_%H%M%S)

log "Deployment type: $DEPLOY_TYPE"
log "Project directory: $PROJECT_DIR"

# Crea directory backup se non esiste
mkdir -p "$BACKUP_DIR"

# Funzione per backup database
backup_database() {
    if [ ! -z "$DATABASE_URL" ]; then
        log "Creating database backup..."
        pg_dump "$DATABASE_URL" > "$BACKUP_DIR/db_backup_$DATE.sql" || warn "Database backup failed"
    else
        warn "DATABASE_URL not set, skipping database backup"
    fi
}

# Funzione per deployment statico
deploy_static() {
    log "Preparing static deployment..."
    
    # Backup configurazione
    cp next.config.js "next.config.backup.$DATE.js"
    
    # Usa configurazione per export statico
    if [ -f "next.config.static.js" ]; then
        cp next.config.static.js next.config.js
        log "Using static configuration"
    else
        warn "next.config.static.js not found, using current config"
    fi
    
    # Install dependencies
    log "Installing dependencies..."
    npm ci --only=production
    
    # Build per export statico
    log "Building static version..."
    npm run build
    
    # Export statico (se configurato)
    if npm run export >/dev/null 2>&1; then
        log "Static export completed"
        log "Upload the 'out' folder to your hosting via FTP"
    else
        log "Static export not configured, upload '.next' folder instead"
    fi
    
    # Ripristina configurazione originale
    mv "next.config.backup.$DATE.js" next.config.js
    
    log "Static deployment prepared!"
    echo "📁 Files to upload:"
    echo "   - out/ folder (static export) OR"
    echo "   - .next/ folder + package.json + package-lock.json"
}

# Funzione per deployment server
deploy_server() {
    log "Preparing server deployment..."
    
    # Backup database
    backup_database
    
    # Install dependencies
    log "Installing dependencies..."
    npm ci --only=production
    
    # Build application
    log "Building application..."
    npm run build
    
    # Se PM2 è installato, restart
    if command -v pm2 >/dev/null 2>&1; then
        log "Restarting with PM2..."
        pm2 restart portfolio || pm2 start scripts/ecosystem.config.js
    else
        warn "PM2 not found. Start manually with: npm start"
    fi
    
    log "Server deployment completed!"
}

# Pre-deployment checks
log "Running pre-deployment checks..."

# Spostati nella directory del progetto
cd "$PROJECT_DIR"
log "Working in directory: $(pwd)"

# Check se è un progetto Next.js
if [ ! -f "package.json" ]; then
    error "package.json not found. Are you in the right directory?"
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js 18+ required. Current version: $(node --version)"
fi

# Check environment variables
if [ "$DEPLOY_TYPE" = "server" ] && [ -z "$DATABASE_URL" ]; then
    warn "DATABASE_URL not set. Make sure to configure it before starting the server."
fi

# Run deployment based on type
case $DEPLOY_TYPE in
    "static")
        deploy_static
        ;;
    "server")
        deploy_server
        ;;
    *)
        error "Invalid deployment type. Use 'static' or 'server'"
        ;;
esac

log "🎉 Deployment completed successfully!"

# Istruzioni finali
echo ""
echo "📋 Next Steps:"
case $DEPLOY_TYPE in
    "static")
        echo "1. Upload the generated files to your hosting via FTP"
        echo "2. Configure your web server to serve the files"
        echo "3. Set up .htaccess for proper routing (if needed)"
        ;;
    "server")
        echo "1. Make sure your server has Node.js 18+ installed"
        echo "2. Configure environment variables"
        echo "3. Start the application: npm start or pm2 start"
        echo "4. Configure reverse proxy (nginx/apache)"
        echo "5. Set up SSL certificate"
        ;;
esac

echo ""
echo "📚 For detailed instructions, check DEPLOYMENT.md"