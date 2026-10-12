param([string]$Php = 'C:\MAMP\bin\php\php8.3.1\php.exe', [string]$Mysql = 'C:\MAMP\bin\mysql\bin\mysql.exe')
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
New-Item -ItemType Directory -Force '.tools' | Out-Null
$env:MYSQL_PWD = 'root'
try {
    & $Mysql -u root -h 127.0.0.1 -P 3306 -e 'CREATE DATABASE IF NOT EXISTS portfolio_aruba CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'
    if ($LASTEXITCODE -ne 0) { throw 'Impossibile collegarsi al MySQL MAMP con le credenziali predefinite.' }
} finally { Remove-Item Env:MYSQL_PWD }
if (-not (Test-Path 'api/config.local.php')) {
    $key = & $Php -r 'echo bin2hex(random_bytes(32));'
    $config = "<?php`nreturn ['db_host'=>'127.0.0.1','db_port'=>3306,'db_name'=>'portfolio_aruba','db_user'=>'root','db_password'=>'root','app_key'=>'$key','session_seconds'=>3600,'upload_max_bytes'=>5242880,'storage_dir'=>__DIR__.'/storage'];`n"
    [IO.File]::WriteAllText((Join-Path $PWD 'api/config.local.php'),$config,[Text.UTF8Encoding]::new($false))
}
# This local pointer has no credentials and must not be uploaded to Aruba.
$pointer = "<?php`nreturn require dirname(__DIR__, 2) . '/api/config.local.php';`n"
if (Test-Path 'dist/api') { [IO.File]::WriteAllText((Join-Path $PWD 'dist/api/config.local.php'),$pointer,[Text.UTF8Encoding]::new($false)) }
# Keep uploaded files outside dist so rebuilding cannot destroy them.
$configFile = Join-Path $PWD 'api/config.local.php'
$env:PORTFOLIO_CONFIG = $configFile
$env:PORTFOLIO_ADMIN_EMAIL = 'admin@example.com'
if (-not (Test-Path '.tools/local-access.txt')) {
    $env:PORTFOLIO_ADMIN_PASSWORD = & $Php -r 'echo bin2hex(random_bytes(12));'
    [IO.File]::WriteAllText((Join-Path $PWD '.tools/local-access.txt'),"URL: http://localhost/my-portfolio/dist/login`nEmail: $env:PORTFOLIO_ADMIN_EMAIL`nPassword: $env:PORTFOLIO_ADMIN_PASSWORD`n",[Text.UTF8Encoding]::new($false))
}
try {
    & $Php api/install.php --seed
    if ($LASTEXITCODE -ne 0) { throw 'Installazione database non riuscita.' }
    & $Php scripts/import-portfolio.php
    if ($LASTEXITCODE -ne 0) { throw 'Importazione contenuti portfolio non riuscita.' }
} finally {
    Remove-Item Env:PORTFOLIO_ADMIN_PASSWORD -ErrorAction SilentlyContinue
    Remove-Item Env:PORTFOLIO_ADMIN_EMAIL
    Remove-Item Env:PORTFOLIO_CONFIG
}
Write-Output 'MAMP pronto: http://localhost/my-portfolio/dist/ — credenziali in .tools/local-access.txt'
