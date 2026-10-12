import {cp, copyFile, readFile, writeFile, unlink} from 'node:fs/promises';
// Vite has already produced dist. Never copy local credentials or stored data.
await cp('api','dist/api',{recursive:true,filter:source => !/(^|[\\/])(config\.local\.php|storage|uploads)([\\/]|$)/.test(source)});
await copyFile('hosting/.htaccess','dist/.htaccess');
await copyFile('src/app/favicon.ico','dist/favicon.ico');
const html = await readFile('dist/index.html','utf8');
const bootstrap = `<?php
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Cache-Control: no-cache');
$base = rtrim(str_replace('\\\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/') . '/';
?>\n`;
await writeFile('dist/index.php',bootstrap+html.replace('<!-- APP_BASE -->','<base href="<?= htmlspecialchars($base, ENT_QUOTES, \'UTF-8\') ?>" />'));
await unlink('dist/index.html');
console.log('Pacchetto Aruba pronto in dist/. La configurazione privata non viene inclusa.');
