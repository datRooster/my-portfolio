-- Inizializzazione database portfolio
-- Questo file viene eseguito automaticamente al primo avvio del container PostgreSQL

-- Estensioni utili
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Commento di inizializzazione
COMMENT ON DATABASE portfolio IS 'Database per il portfolio theWebRooster con gestione progetti, blog e servizi';