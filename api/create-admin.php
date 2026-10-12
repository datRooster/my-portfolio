<?php
// Generate an SQL file for phpMyAdmin when the hosting plan has no terminal.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
$email = strtolower(trim($argv[1] ?? ''));
if (!filter_var($email,FILTER_VALIDATE_EMAIL)) { fwrite(STDERR,"Uso: php api/create-admin.php email@example.com > admin.sql\n"); exit(1); }
$password = bin2hex(random_bytes(12));
$hash = password_hash($password,PASSWORD_DEFAULT);
$id = bin2hex(random_bytes(16));
// HEX literals avoid SQL quoting differences between servers.
$emailHex=bin2hex($email); $hashHex=bin2hex($hash);
echo "INSERT INTO users (id,email,name,password_hash) VALUES ('$id',CONVERT(0x$emailHex USING utf8mb4),'Amministratore',CONVERT(0x$hashHex USING utf8mb4));\n";
fwrite(STDERR,"Email: $email\nPassword: $password\nConserva queste credenziali in un luogo sicuro.\n");
