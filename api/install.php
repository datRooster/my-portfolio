<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__.'/lib/bootstrap.php';
try {
    $sql = file_get_contents(__DIR__.'/schema.sql');
    db()->multi_query($sql);
    do { if ($result=db()->store_result()) $result->free(); } while(db()->more_results() && db()->next_result());
    $email = strtolower(trim(getenv('PORTFOLIO_ADMIN_EMAIL') ?: ''));
    $password = getenv('PORTFOLIO_ADMIN_PASSWORD') ?: '';
    if ($email || $password) {
        if (!filter_var($email,FILTER_VALIDATE_EMAIL)) throw new RuntimeException('Email valida richiesta.');
        if (query('SELECT id FROM users WHERE email = ?',[$email])->num_rows === 0) {
            if (strlen($password)<12) throw new RuntimeException('Password di almeno 12 caratteri richiesta.');
            query('INSERT INTO users (id,email,name,password_hash) VALUES (?,?,?,?)',[uid(),$email,'Amministratore',password_hash($password,PASSWORD_DEFAULT)]);
            echo "Amministratore creato.\n";
        } else echo "Amministratore già presente: credenziali mantenute.\n";
    }
    if (in_array('--seed',$argv,true)) { require __DIR__.'/seed.php'; seedDemo(); }
    echo "Database pronto. Nessun dato esistente è stato eliminato.\n";
} catch(Throwable $e) { fwrite(STDERR,$e->getMessage()."\n"); exit(1); }
