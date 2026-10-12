<?php
// Copy to config.local.php on the destination, then enter that environment's values.
return [
    'db_host' => '127.0.0.1',
    'db_port' => 3306,
    'db_name' => 'portfolio_aruba',
    'db_user' => 'portfolio',
    'db_password' => '',
    // Generate with: php -r "echo bin2hex(random_bytes(32));"
    'app_key' => 'CHANGE_ME_WITH_64_RANDOM_HEX_CHARACTERS',
    'session_seconds' => 3600,
    'upload_max_bytes' => 5 * 1024 * 1024,
];
