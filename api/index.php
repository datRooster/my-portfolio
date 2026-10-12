<?php
declare(strict_types=1);
ini_set('display_errors','0');
ini_set('zlib.output_compression','0');
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
require __DIR__.'/lib/bootstrap.php';
require __DIR__.'/lib/auth.php';
require __DIR__.'/lib/content.php';
require __DIR__.'/lib/analytics.php';
try {
    startSession();
    checkWriteRequest();
    $path=rawurldecode(parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH) ?: '/');
    $prefix=rtrim(str_replace('\\','/',dirname($_SERVER['SCRIPT_NAME'])),'/');
    if (!str_starts_with($path,$prefix.'/')) fail('Endpoint non trovato',404);
    $route=trim(substr($path,strlen($prefix)),'/');
    $method=$_SERVER['REQUEST_METHOD'];
    if (str_starts_with($route,'auth/')) authRoutes($route,$method);
    if ($route==='health' && $method==='GET') { db(); respond(['status'=>'ok','database'=>'mysql']); }
    if ($route==='upload' && $method==='POST') {
        requireAdmin(); rateLimit('upload',30,3600);
        $file=$_FILES['file'] ?? null;
        if (!$file || $file['error']!==UPLOAD_ERR_OK) fail('Upload non riuscito. Controlla il limite PHP del server.');
        if ($file['size'] > config()['upload_max_bytes']) fail('Immagine troppo grande',413);
        $info=@getimagesize($file['tmp_name']);
        $types=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','image/gif'=>'gif'];
        if (!$info || !isset($types[$info['mime']]) || $info[0]*$info[1]>40000000) fail('Immagine non valida');
        $directory=config()['storage_dir'].'/uploads';
        if(!is_dir($directory) && !mkdir($directory,0750,true)) throw new RuntimeException('Cannot create upload directory');
        $filename=uid().'.'.$types[$info['mime']];
        if(!move_uploaded_file($file['tmp_name'],$directory.'/'.$filename)) throw new RuntimeException('Upload failed');
        respond(['success'=>true,'url'=>'/api/media/'.$filename,'filename'=>$filename,'size'=>$file['size']],201);
    }
    if (preg_match('~^media/([a-f0-9]{32}\.(?:jpg|png|gif|webp))$~D',$route,$matches) && $method==='GET') {
        $file=config()['storage_dir'].'/uploads/'.$matches[1];
        if(!is_file($file)) fail('Immagine non trovata',404);
        $info=getimagesize($file);
        header('Content-Type: '.$info['mime']);
        header('Content-Length: '.filesize($file));
        header('Cache-Control: public, max-age=31536000, immutable');
        readfile($file); exit;
    }
    if ($route==='contact') { if($method!=='POST') fail('Metodo non consentito',405); inquiryRoutes('services/inquiries',$method); }
    if (str_starts_with($route,'services/inquiries')) inquiryRoutes($route,$method);
    if (in_array($route,['analytics/projects','admin/visitor-analytics','visitors/track','visitors/stats','bug-bounty/stats','services/stats'],true)) analyticsRoutes($route,$method);
    if (in_array($route,['bug-bounty/settings','bug-bounty/sync-platforms'],true)) {
        requireAdmin();
        if($method==='GET') respond(['autoSync'=>false,'syncInterval'=>24,'platforms'=>records('platforms'),'lastUpdate'=>null,'lastSync'=>null,'nextSync'=>null]);
        fail('Sincronizzazione esterna non configurata. Gestisci i dati dal pannello contenuti.',409);
    }
    $routes=['projects'=>'projects','services'=>'services','testimonials'=>'testimonials','bug-bounty/reports'=>'bug_reports','bug-bounty/platforms'=>'platforms','bug-bounty/achievements'=>'achievements','bug-bounty/methodologies'=>'methodologies'];
    foreach($routes as $base=>$table) if ($route===$base || str_starts_with($route,$base.'/')) {
        $key=$route===$base ? null : substr($route,strlen($base)+1);
        if($key && str_contains($key,'/')) fail('Endpoint non trovato',404);
        contentRoutes($table,$key,$method);
    }
    fail('Endpoint non trovato',404);
} catch(mysqli_sql_exception $e) {
    if($e->getCode()===1062) fail('Esiste già un contenuto con questo identificativo',409);
    error_log('Portfolio database: '.$e->getMessage());
    fail('Database non disponibile. Verifica la configurazione del server.',503);
} catch(Throwable $e) {
    error_log('Portfolio API: '.$e->getMessage());
    fail('Servizio non disponibile. Verifica la configurazione del server.',503);
}
