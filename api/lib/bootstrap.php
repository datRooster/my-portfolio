<?php
declare(strict_types=1);

function config(): array {
    static $config;
    if ($config !== null) return $config;
    // A private directory outside the public document root can also be used.
    $file = getenv('PORTFOLIO_CONFIG') ?: dirname(__DIR__) . '/config.local.php';
    if (!is_file($file)) throw new RuntimeException('Configurazione del database mancante.');
    $config = require $file;
    $config['storage_dir'] = $config['storage_dir'] ?? dirname($file).'/storage';
    if (strlen($config['app_key'] ?? '') < 64 || !ctype_xdigit($config['app_key'])) throw new RuntimeException('Configurare app_key con 32 byte casuali in esadecimale.');
    return $config;
}
function db(): mysqli {
    static $db;
    if ($db) return $db;
    $c = config();
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $db = new mysqli($c['db_host'], $c['db_user'], $c['db_password'], $c['db_name'], (int)$c['db_port']);
    $db->set_charset('utf8mb4');
    return $db;
}
function query(string $sql, array $params = []): mysqli_result|bool {
    $stmt = db()->prepare($sql);
    if ($params) $stmt->bind_param(str_repeat('s', count($params)), ...$params);
    $stmt->execute();
    return $stmt->get_result();
}
function now(): string { return gmdate('Y-m-d\TH:i:s\Z'); }
function uid(): string { return bin2hex(random_bytes(16)); }
function respond(mixed $data, int $status = 200): never {
    if (session_status() === PHP_SESSION_ACTIVE) session_write_close();
    http_response_code($status);
    $json=json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    header('Content-Length: '.strlen($json));
    echo $json;
    exit;
}
function fail(string $message, int $status = 400): never { respond(['success'=>false,'error'=>$message,'message'=>$message],$status); }
function body(): array {
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 1048576) fail('Richiesta troppo grande',413);
    try { $value = json_decode(file_get_contents('php://input') ?: '{}', true, 64, JSON_THROW_ON_ERROR); }
    catch (JsonException $e) { fail('JSON non valido'); }
    if (!is_array($value)) fail('Oggetto JSON richiesto');
    return $value;
}
function startSession(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    session_name('portfolio_session');
    ini_set('session.use_strict_mode', '1');
    session_set_cookie_params(['lifetime'=>0,'path'=>'/','httponly'=>true,'secure'=>$secure,'samesite'=>'Lax']);
    session_start();
    if (isset($_SESSION['expires']) && $_SESSION['expires'] < time()) $_SESSION = [];
    if (in_array($_SERVER['REQUEST_METHOD'] ?? '', ['GET','HEAD'],true)) session_write_close();
}
function user(): ?array {
    if (empty($_SESSION['user_id'])) return null;
    $u = query('SELECT * FROM users WHERE id = ?', [$_SESSION['user_id']])->fetch_assoc();
    if (!$u || !hash_equals(hash('sha256',$u['password_hash']),$_SESSION['auth_version'] ?? '')) return null;
    return $u;
}
function requireAdmin(): array {
    $u = user();
    if (!$u) fail('Autenticazione richiesta',401);
    return $u;
}
function publicUser(array $u): array {
    return ['id'=>$u['id'],'email'=>$u['email'],'name'=>$u['name'],'username'=>$u['name'],'role'=>'admin','isVerified'=>true,'lastLogin'=>$u['last_login'],'twoFactorEnabled'=>(bool)$u['totp_secret']];
}
function loginUser(array $u): void {
    session_regenerate_id(true);
    $_SESSION = ['user_id'=>$u['id'],'auth_version'=>hash('sha256',$u['password_hash']),'expires'=>time()+(int)config()['session_seconds']];
    query('UPDATE users SET last_login = ? WHERE id = ?', [now(),$u['id']]);
}
function checkWriteRequest(): void {
    if (in_array($_SERVER['REQUEST_METHOD'], ['GET','HEAD'], true)) return;
    // A cross-origin form cannot supply this header. No permissive CORS is enabled.
    if (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'Portfolio') fail('Richiesta non autorizzata',403);
    if (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') fail('Origine non autorizzata',403);
    if (!empty($_SERVER['HTTP_ORIGIN'])) {
        $origin = parse_url($_SERVER['HTTP_ORIGIN']);
        $originHost = ($origin['host'] ?? '') . (isset($origin['port']) ? ':'.$origin['port'] : '');
        if (strtolower($originHost) !== strtolower($_SERVER['HTTP_HOST'] ?? '')) fail('Origine non autorizzata',403);
    }
}
function rateLimit(string $bucket, int $limit, int $seconds, string $subject = ''): void {
    $identifier = hash_hmac('sha256', $subject ?: ($_SERVER['REMOTE_ADDR'] ?? 'local'), config()['app_key']);
    $window = (int)(time() / $seconds);
    $key = hash('sha256', "$bucket:$identifier:$window");
    query('INSERT INTO rate_limits (id, hits, expires) VALUES (?, 1, ?) ON DUPLICATE KEY UPDATE hits = hits + 1', [$key,time()+$seconds]);
    $row = query('SELECT hits FROM rate_limits WHERE id = ?', [$key])->fetch_assoc();
    if ((int)$row['hits'] > $limit) { header('Retry-After: '.$seconds); fail('Troppi tentativi. Riprova più tardi.',429); }
    query('DELETE FROM rate_limits WHERE expires < ?', [time()]);
}
const TABLES = ['projects','services','bug_reports','platforms','achievements','methodologies','testimonials','inquiries','inquiry_responses','settings'];
function tableName(string $table): string {
    if (!in_array($table, TABLES, true)) throw new LogicException('Unknown table');
    return $table;
}
function records(string $table): array {
    $rows = query('SELECT document FROM '.tableName($table).' ORDER BY updated_at DESC')->fetch_all(MYSQLI_ASSOC);
    return array_map(fn($r)=>json_decode($r['document'], true, 64, JSON_THROW_ON_ERROR), $rows);
}
function record(string $table, string $key): ?array {
    $row = query('SELECT document FROM '.tableName($table).' WHERE id = ? OR slug = ? LIMIT 1',[$key,$key])->fetch_assoc();
    return $row ? json_decode($row['document'], true, 64, JSON_THROW_ON_ERROR) : null;
}
function save(string $table, array $data, ?string $id = null): array {
    $data['id'] = $id ?: uid();
    $data['createdAt'] = $data['createdAt'] ?? now();
    $data['updatedAt'] = now();
    $slug = empty($data['slug']) ? null : $data['slug'];
    // INSERT never replaces another record merely because its slug collides.
    if ($id && record($table,$id)) {
        query('UPDATE '.tableName($table).' SET slug = ?, document = ?, updated_at = ? WHERE id = ?',[$slug,json_encode($data,JSON_THROW_ON_ERROR),now(),$id]);
    } else {
        query('INSERT INTO '.tableName($table).' (id, slug, document, updated_at) VALUES (?,?,?,?)',[$data['id'],$slug,json_encode($data,JSON_THROW_ON_ERROR),now()]);
    }
    return $data;
}
