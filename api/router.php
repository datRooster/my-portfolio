<?php
// Development only: php -S 127.0.0.1:8080 -t dist api/router.php
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (str_starts_with($path, '/api/')) {
    $_SERVER['SCRIPT_NAME'] = '/api/index.php';
    require __DIR__ . '/index.php';
} elseif (is_file($_SERVER['DOCUMENT_ROOT'] . $path) && !str_ends_with($path,'.php') && !str_contains($path,'/.')) {
    return false;
} else {
    $_SERVER['SCRIPT_NAME'] = '/index.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/index.php';
}
