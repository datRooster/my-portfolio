<?php
if(PHP_SAPI!=='cli')exit;
$zip=new ZipArchive();
if($zip->open(dirname(__DIR__).'/.tools/portfolio-aruba.zip')!==true)throw new RuntimeException('ZIP missing');
foreach(['.htaccess','index.php','api/.htaccess','api/index.php','api/config.example.php','api/schema.sql'] as $file)if($zip->locateName($file)===false)throw new RuntimeException('Missing '.$file);
$local=require dirname(__DIR__).'/api/config.local.php';
for($i=0;$i<$zip->numFiles;$i++){
    $name=str_replace('\\','/',$zip->getNameIndex($i));
    if(preg_match('~(^|/)(config\.local\.php|storage|node_modules|\.git|\.tools)(/|$)~',$name))throw new RuntimeException('Private file in ZIP: '.$name);
    if(preg_match('/\.(php|js|json|html|sql)$/',$name) && str_contains($zip->getFromIndex($i),$local['app_key']))throw new RuntimeException('Private app key in ZIP');
}
echo 'ZIP verificato: '.$zip->numFiles." file, regole Apache incluse, nessuna configurazione privata.\n";
