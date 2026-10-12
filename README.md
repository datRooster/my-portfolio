# Portfolio su Aruba e MAMP

Il progetto ora usa **React + TypeScript + Vite** per il frontend e **PHP + MySQL** per le API. Il sito pubblicato non richiede Node.js, PostgreSQL, Prisma, Railway o Vercel. Node.js serve solo sul computer di sviluppo per compilare i file statici.

## Avvio locale già predisposto

Con Apache e MySQL di MAMP accesi:

- Sito: <http://localhost/my-portfolio/dist/>
- Amministrazione: <http://localhost/my-portfolio/dist/login>
- Credenziali locali generate: `.tools/local-access.txt` (file privato, escluso da Git).
- Database nuovo: `portfolio_aruba`. I dati di esempio sono contrassegnati come dimostrativi.

La cartella sorgente è protetta da `.htaccess`: MAMP espone soltanto `dist/`. Configurazione e upload locali risiedono in `api/config.local.php` e `api/storage/`, esclusi da Git. `dist/api/config.local.php` è un collegamento PHP alla configurazione locale, da non caricare su Aruba.

## Requisiti

- Per compilare: Node.js 22.12 o superiore, npm.
- Per eseguire: PHP 8.1 o superiore (consigliato 8.3), estensioni `mysqli` e `session`, Apache con `mod_rewrite` e `.htaccess` abilitato.
- Database MySQL 5.7+/8 o MariaDB compatibile, codifica `utf8mb4`.
- Cartella `api/storage` scrivibile dal processo PHP. Per gli upload da 5 MB, configurare `upload_max_filesize = 5M` o superiore e `post_max_size` maggiore di tale limite.

Su questo computer è disponibile anche una copia portatile di Node in `.tools/node-v22.23.3-win-x64`. In PowerShell, per usarla nella sessione corrente:

```powershell
$env:PATH = "$PWD\.tools\node-v22.23.3-win-x64;$env:PATH"
npm.cmd run build
```

## Installazione da un nuovo clone

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd run setup:mamp
```

`setup:mamp` usa i percorsi standard di MAMP Windows, MySQL locale sulla porta 3306 e le credenziali predefinite `root`/`root`. Crea solo il database `portfolio_aruba`, non elimina altri database, non reimposta gli utenti esistenti e non duplica i contenuti dimostrativi. Per configurazioni diverse modificare `api/config.local.php`, partendo da `api/config.example.php`.

L’esecuzione PowerShell con `ExecutionPolicy Bypass` riguarda solo il processo dello script; non cambia le impostazioni del sistema.

## Sviluppo

Per una preview completa usare MAMP e ricompilare con `npm run build`. Per lo sviluppo con aggiornamento automatico, aprire due terminali:

```powershell
# Terminale 1: API PHP locali
& C:\MAMP\bin\php\php8.3.1\php.exe -S 127.0.0.1:8080 -t dist api/router.php

# Terminale 2: frontend Vite con proxy alle API
npm.cmd run dev
```

Aprire l’indirizzo stampato da Vite. Il proxy mantiene l’autenticazione sullo stesso dominio. `npm run preview` mostra soltanto i file frontend: per provare API e sessioni usare MAMP o il comando PHP sopra.

## Pubblicazione su Aruba Hosting Basic Linux

Il piano supporta PHP; verificare nel pannello che sia attivo anche un servizio MySQL. Le credenziali FTP, dell’account Aruba e del database sono diverse. Non utilizzare quelle di MAMP sul server.

1. Compilare con `npm run build`. Caricare **il contenuto** di `dist/` nella cartella web del dominio, includendo `.htaccess`, ma **escludendo `dist/api/config.local.php` e qualsiasi `api/storage` locale**. Il pacchetto `.tools/portfolio-aruba.zip`, se generato, contiene già solo i file pubblicabili.
2. Nel pannello MySQL/phpMyAdmin Aruba selezionare un database vuoto assegnato al proprio account e importare `api/schema.sql`. Lo schema non crea database e non contiene `DROP TABLE`.
3. Creare sul server `api/config.local.php` a partire da `api/config.example.php`: inserire host, porta, nome database, utente e password forniti da Aruba. Per `app_key` generare 32 byte casuali in esadecimale:

   ```powershell
   & C:\MAMP\bin\php\php8.3.1\php.exe -r 'echo bin2hex(random_bytes(32));'
   ```

4. Creare l’amministratore importando il file `.tools/aruba-admin.sql` predisposto in questa sessione; le sue credenziali sono in `.tools/aruba-access.txt`. In alternativa generare un utente nuovo sul computer locale:

   ```powershell
   # In un terminale che supporta redirect UTF-8, salvare l'output SQL.
   php api/create-admin.php admin@webrooster.it
   ```

   Il comando stampa l’SQL su stdout e le credenziali casuali su stderr. Importare **solo l’SQL** in phpMyAdmin. Nessuna password amministratore predefinita è inclusa nel sorgente.
5. Importare `.tools/aruba-portfolio.sql` per aggiungere i **9 progetti e 4 servizi** preparati; il file non contiene account, messaggi o dati della sezione cybersecurity. Gli inserimenti non sovrascrivono contenuti già presenti con lo stesso slug. Le immagini sono incluse nel pacchetto del sito. Controllare `https://webrooster.it/api/health` e accedere a `/login`.
6. Per gli aggiornamenti successivi caricare i nuovi file della build preservando `api/config.local.php` e `api/storage/` del server.

Non caricare l’intero repository, `.git`, `.tools`, `node_modules`, i file delle credenziali o la configurazione MAMP. Il database locale e quello Aruba sono indipendenti. Il pacchetto usa percorsi relativi e un `<base>` generato da PHP, quindi funziona anche in una sottocartella.

Su Windows il pacchetto si rigenera con `npm run package:aruba`, dopo la build. Questo comando include anche i file `.htaccess` e filtra configurazione privata, log e upload locali. I file SQL dell’account Aruba e le credenziali restano separati dallo ZIP.

## Funzionalità disponibili

### Contenuti del portfolio

Il catalogo versionato in `api/lib/portfolio.json` comprende i quattro temi locali (Morgante Costruzioni, Morgante Group, Morgante Home Solution e Forno Atelier), il tema pubblico Marcello Scavo Tattoo, IRC Community, questo portfolio e i plugin Partial Payments e Treasure Coupons. Le specifiche derivano dai sorgenti e dalla documentazione; non sono state dedotte date di consegna o metriche commerciali. I badge del profilo WordPress sono indicati con i nomi ufficiali **Plugin Developer** e **Translation Contributor**.

Il setup MAMP importa automaticamente i contenuti mancanti. Per importare o esportare manualmente:

```powershell
& C:\MAMP\bin\php\php8.3.1\php.exe scripts/import-portfolio.php
& C:\MAMP\bin\php\php8.3.1\php.exe scripts/import-portfolio.php --export=.tools/aruba-portfolio.sql
```

L'importazione crea un backup privato di progetti e servizi in `.tools/`, non duplica gli slug e conserva le modifiche dal pannello. Rimuove solo i due esempi iniziali marcati `demo`, lasciando invariata la cybersecurity. L'opzione esplicita `--update` riapplica il catalogo anche alle schede già presenti: usarla solo per sostituire le modifiche editoriali con il contenuto del file. Dopo modifiche dal pannello, rigenerare l'export SQL per Aruba.

Le immagini in `public/images/projects/` sono copie delle anteprime fornite con i temi, un'anteprima locale del configuratore Home Solution e il banner ufficiale del plugin. Le copertine SVG dei progetti senza screenshot sono grafiche editoriali, non rappresentazioni delle interfacce. Le didascalie distinguono le immagini illustrative e le demo. I temi originali non vengono modificati.

Home e Chi sono mostrano le contribuzioni WordPress; la Home carica i progetti in evidenza dalle API. Periodo, funzionalità, compatibilità, didascalia e link alla pubblicazione si modificano nella scheda amministrativa del progetto. La sezione cybersecurity resta in attesa delle prossime indicazioni.

### Gestione del sito

- Portfolio, dettagli dei progetti, servizi, pagine Bug Bounty e layout esistente.
- Creazione/modifica/eliminazione progetti; gestione servizi, report, piattaforme, riconoscimenti, metodologie e testimonianze da **Gestione contenuti**.
- Contatti salvati in **Messaggi ricevuti**. Le risposte si inviano dal proprio programma di posta; l’invio automatico di notifiche email non è configurato.
- Upload di JPEG, PNG, GIF e WebP sul proprio spazio web. I file sono serviti come immagini attraverso PHP e la cartella privata è bloccata via HTTP.
- Sessioni PHP, password hash, limitazione dei tentativi, controllo delle richieste di scrittura e 2FA TOTP con codici di recupero monouso. Il cambio password invalida le altre sessioni amministrative.
- Statistiche ricavate dai dati salvati; i visitatori sono conteggiati per sessione, senza geolocalizzazione o fingerprint. Le durate sono stime, non misurazioni precise.

Le vecchie schermate con salvataggi di impostazioni simulati sono state sostituite con controlli realmente collegati alle API. La chat esterna è stata sostituita dal collegamento al modulo contatti. La sincronizzazione automatica delle piattaforme Bug Bounty e il precedente cron non sono attivi: i dati si gestiscono manualmente dal pannello. Il pulsante di aggiornamento ricarica i dati locali.

Il frontend è una SPA: i dettagli dei contenuti vengono caricati tramite API dopo l’avvio. Non viene più eseguito il rendering React sul server. Titolo e descrizione generali sono presenti nell’HTML.

## Verifiche

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run test:api
npm.cmd run test:browser
npm.cmd run test:portfolio
npm.cmd audit
node tests/apache-smoke.mjs
npm.cmd run package:aruba
& C:\MAMP\bin\php\php8.3.1\php.exe tests/archive-check.php
```

`test:api` crea e rimuove un database temporaneo con prefisso `portfolio_test_`, usa un server PHP locale dedicato e controlla autorizzazioni, CRUD, privacy dei contenuti, 2FA, upload, contatti e statistiche. Richiede MySQL attivo e la configurazione locale. Il test non modifica `portfolio_aruba`. Usare `PHP_BINARY` e `PORTFOLIO_TEST_CONFIG` per percorsi personalizzati.

`test:browser` usa Chrome in modalità headless e il sito MAMP già compilato. Verifica pagine pubbliche e amministrative, login, modifica progetto, creazione/rimozione di un servizio di prova e layout mobile. Le visite compaiono nelle statistiche locali. Gli screenshot sono in `.tools/screenshots/`.

`test:portfolio` verifica tutte le nuove schede, i quattro servizi, filtri combinati, galleria e immagini locali su desktop e mobile. Presuppone il catalogo iniziale importato. I test API includono anche importazione ripetuta e ripristino dell'export SQL in un database isolato.

## Struttura

```text
src/          Componenti, pagine React, routing e client API
api/          Backend PHP, schema MySQL e strumenti CLI
hosting/      Regole Apache del sito pubblicato
scripts/      Build, preparazione MAMP e pacchetto di pubblicazione
tests/        Verifiche di integrazione API e browser
public/       Immagini e icone locali
dist/         Build pubblicabile (esclusa da Git)
.tools/       Runtime locale, credenziali e risultati test (privati)
```

Riferimenti: [Aruba — linguaggi supportati](https://guide.aruba.it/faq/hosting-e-domini/linguaggi-e-spazio-web-linux), [Vite](https://vite.dev/guide/), [React Router](https://reactrouter.com/start/declarative/installation), [password_hash PHP](https://www.php.net/manual/en/function.password-hash.php).
