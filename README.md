# 🐓 theWebRooster Portfolio

Portfolio personale sviluppato con Next.js, TypeScript, Tailwind CSS e PostgreSQL.

## 🚀 Caratteristiche

- **Frontend moderno**: Next.js 15 + TypeScript + Tailwind CSS
- **Database PostgreSQL**: Dockerizzato con Prisma ORM
- **Gestione progetti dinamica**: CRUD completo con API RESTful
- **Design responsive**: Dark theme con accenti gialli
- **Performance ottimizzate**: Componenti ottimizzati e caching

## 🛠️ Stack Tecnologico

### Frontend
- **Next.js 15** - Framework React full-stack
- **TypeScript** - Tipizzazione statica
- **Tailwind CSS** - Framework CSS utility-first
- **React 19** - Libreria UI moderna

### Backend & Database
- **PostgreSQL** - Database relazionale
- **Prisma** - ORM moderno e type-safe
- **Docker** - Containerizzazione servizi
- **Redis** - Caching (opzionale)

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
