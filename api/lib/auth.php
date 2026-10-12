<?php
declare(strict_types=1);
function pendingUser(): array {
    if (empty($_SESSION['pending_id']) || ($_SESSION['pending_until'] ?? 0) < time()) fail('Sessione scaduta. Accedi nuovamente.',401);
    $u = query('SELECT * FROM users WHERE id = ?',[$_SESSION['pending_id']])->fetch_assoc();
    if (!$u) fail('Sessione non valida',401);
    return $u;
}
function totpSecret(): string {
    $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    $secret = '';
    for ($i=0;$i<32;$i++) $secret .= $alphabet[random_int(0,31)];
    return $secret;
}
function totpAt(string $secret, int $step): string {
    $bits = ''; $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    foreach (str_split($secret) as $char) $bits .= str_pad(decbin(strpos($alphabet,$char)),5,'0',STR_PAD_LEFT);
    $key = '';
    for ($i=0;$i+8<=strlen($bits);$i+=8) $key .= chr(bindec(substr($bits,$i,8)));
    $hash = hash_hmac('sha1',pack('N2',0,$step),$key,true);
    $offset = ord($hash[19]) & 15;
    $number = unpack('N',substr($hash,$offset,4))[1] & 0x7fffffff;
    return str_pad((string)($number % 1000000),6,'0',STR_PAD_LEFT);
}
function verifyTotp(string $secret, string $code, int $last = -1): ?int {
    if (!preg_match('/^\d{6}$/D',$code)) return null;
    $step = (int)(time()/30);
    for ($i=-1;$i<=1;$i++) if ($step+$i > $last && hash_equals(totpAt($secret,$step+$i),$code)) return $step+$i;
    return null;
}
function authRoutes(string $route, string $method): never {
    if ($route === 'auth/check' && $method === 'GET') respond(['user'=>publicUser(requireAdmin())]);
    if ($method !== 'POST') fail('Metodo non consentito',405);
    $data = body();
    if ($route === 'auth/password') {
        $u = requireAdmin(); rateLimit('password',5,900,$u['id']);
        if (!password_verify((string)($data['currentPassword'] ?? ''),$u['password_hash'])) fail('Password attuale non valida',401);
        $new=(string)($data['newPassword'] ?? '');
        if (strlen($new)<12 || strlen($new)>200) fail('Usa una password tra 12 e 200 caratteri');
        $u['password_hash']=password_hash($new,PASSWORD_DEFAULT);
        query('UPDATE users SET password_hash = ? WHERE id = ?',[$u['password_hash'],$u['id']]);
        loginUser($u);
        respond(['success'=>true]);
    }
    if (in_array($route,['auth/login','auth/login-simple'],true)) {
        rateLimit('login-ip',30,900);
        $email = strtolower(trim((string)($data['email'] ?? '')));
        rateLimit('login-account',10,900,$email);
        $u = query('SELECT * FROM users WHERE email = ?',[$email])->fetch_assoc();
        $hash = $u['password_hash'] ?? '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.';
        if (!password_verify((string)($data['password'] ?? ''),$hash) || !$u) fail('Credenziali non valide',401);
        session_regenerate_id(true);
        $_SESSION = ['pending_id'=>$u['id'],'pending_until'=>time()+300];
        if ($u['totp_secret']) respond(['success'=>true,'requiresTwoFactor'=>true,'requires2FAChoice'=>false]);
        loginUser($u);
        respond(['success'=>true,'requiresTwoFactor'=>false,'user'=>publicUser($u)]);
    }
    if (in_array($route,['auth/logout','auth/logout-simple'],true)) {
        $_SESSION=[];
        session_destroy();
        setcookie(session_name(),'', ['expires'=>1,'path'=>'/','httponly'=>true,'samesite'=>'Lax']);
        respond(['success'=>true]);
    }
    if ($route === 'auth/enable-2fa') {
        $u = requireAdmin();
        if ($u['totp_secret']) fail('La verifica in due passaggi è già attiva',409);
        $_SESSION['pending_id']=$u['id']; $_SESSION['pending_until']=time()+300;
        respond(['success'=>true]);
    }
    if (in_array($route,['auth/2fa/setup','auth/2fa/setup-simple'],true)) {
        $u = user() ?: pendingUser();
        if ($u['totp_secret']) fail('La verifica in due passaggi è già attiva',409);
        $_SESSION['pending_id']=$u['id']; $_SESSION['pending_until']=time()+300;
        $secret = $_SESSION['setup_secret'] ?? totpSecret();
        $_SESSION['setup_secret']=$secret;
        respond(['success'=>true,'secret'=>$secret,'otpauthUrl'=>'otpauth://totp/'.rawurlencode('Portfolio:'.$u['email']).'?secret='.$secret.'&issuer=Portfolio&algorithm=SHA1&digits=6&period=30']);
    }
    if (in_array($route,['auth/2fa/verify-setup','auth/2fa/verify-setup-simple'],true)) {
        $u = pendingUser();
        rateLimit('2fa',10,300,$u['id']);
        $secret = $_SESSION['setup_secret'] ?? '';
        if (!$secret || $u['totp_secret']) fail('Configurazione non disponibile',409);
        $step = verifyTotp($secret,(string)($data['code'] ?? ''));
        if ($step === null) fail('Codice non valido');
        $codes=[];
        for($i=0;$i<8;$i++) $codes[]=strtoupper(bin2hex(random_bytes(5)));
        $hashes=array_map(fn($code)=>password_hash($code,PASSWORD_DEFAULT),$codes);
        query('UPDATE users SET totp_secret = ?, totp_last_step = ?, backup_codes = ? WHERE id = ? AND totp_secret IS NULL',[$secret,$step,json_encode($hashes),$u['id']]);
        loginUser($u);
        respond(['success'=>true,'backupCodes'=>$codes]);
    }
    if (in_array($route,['auth/verify-2fa','auth/verify-2fa-simple'],true)) {
        $u = pendingUser();
        rateLimit('2fa',10,300,$u['id']);
        $code = strtoupper(trim((string)($data['code'] ?? '')));
        db()->begin_transaction();
        $u = query('SELECT * FROM users WHERE id = ? FOR UPDATE',[$u['id']])->fetch_assoc();
        $step = $u['totp_secret'] ? verifyTotp($u['totp_secret'],$code,(int)$u['totp_last_step']) : null;
        $valid = $step !== null;
        $hashes = json_decode($u['backup_codes'] ?: '[]',true);
        if (!$valid) foreach($hashes as $i=>$hash) if (password_verify($code,$hash)) { unset($hashes[$i]); $valid=true; break; }
        if (!$valid) { db()->rollback(); fail('Codice non valido',401); }
        query('UPDATE users SET totp_last_step = ?, backup_codes = ? WHERE id = ?',[$step ?? $u['totp_last_step'],json_encode(array_values($hashes)),$u['id']]);
        db()->commit(); loginUser($u);
        respond(['success'=>true]);
    }
    if ($route === 'auth/skip-2fa') {
        $u = pendingUser();
        if ($u['totp_secret']) fail('La verifica in due passaggi è obbligatoria per questo account',403);
        loginUser($u); respond(['success'=>true]);
    }
    if ($route === 'auth/refresh') { requireAdmin(); $_SESSION['expires']=time()+(int)config()['session_seconds']; respond(['success'=>true]); }
    fail('Endpoint non trovato',404);
}
