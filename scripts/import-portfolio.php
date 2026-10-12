<?php
declare(strict_types=1);
if (PHP_SAPI!=='cli') { http_response_code(404); exit; }
require dirname(__DIR__).'/api/lib/bootstrap.php';
require dirname(__DIR__).'/api/lib/content.php';
$catalog=json_decode(file_get_contents(dirname(__DIR__).'/api/lib/portfolio.json'),true,512,JSON_THROW_ON_ERROR);
$update=in_array('--update',$argv,true);
$export=null;
foreach($argv as $arg) if(str_starts_with($arg,'--export=')) $export=substr($arg,9);
try {
    if(!$export) {
        // Back up only the two content collections changed by this importer.
        $backup=dirname(__DIR__).'/.tools/portfolio-before-'.gmdate('Ymd-His').'-'.bin2hex(random_bytes(3)).'.json';
        if(!is_dir(dirname($backup))) mkdir(dirname($backup),0700,true);
        file_put_contents($backup,json_encode(['projects'=>records('projects'),'services'=>records('services')],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_THROW_ON_ERROR));
        $pending=[];
        foreach(['projects','services'] as $table) foreach($catalog[$table] as $row) {
            $existing=record($table,$row['slug']);
            if($existing && !$update) continue;
            if($table==='services') $row+=['title'=>$row['name'],'pricing'=>'CUSTOM','type'=>'CONSULTING','duration'=>'Da concordare sul progetto'];
            $pending[]=[$table,validated($table,$row,$existing),$existing['id'] ?? null];
        }
        db()->begin_transaction();
        foreach($pending as [$table,$row,$id]) save($table,$row,$id);
        foreach(['projects'=>'demo-portfolio','services'=>'sito-web-demo'] as $table=>$slug) {
            $demo=record($table,$slug);
            if($demo && in_array('demo',$demo['tags'] ?? [],true)) query('DELETE FROM '.tableName($table).' WHERE id=?',[$demo['id']]);
        }
        db()->commit();
        echo count($pending)." contenuti inseriti/aggiornati. Contenuti esistenti conservati salvo --update. Backup: $backup\n";
    } else {
        $sql="-- Progetti e servizi WebRooster. Importare dopo api/schema.sql. Nessun account o dato privato.\nSET NAMES utf8mb4;\nSTART TRANSACTION;\n";
        foreach(['projects','services'] as $table) foreach($catalog[$table] as $item) {
            $row=record($table,$item['slug']);
            if(!$row) throw new RuntimeException('Contenuto mancante: '.$item['slug']);
            $values=[$row['id'],$row['slug'],json_encode($row,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR),$row['updatedAt']];
            $literals=array_map(fn($v)=>'CONVERT(0x'.bin2hex($v).' USING utf8mb4)',$values);
            $sql.='INSERT IGNORE INTO '.$table.' (id,slug,document,updated_at) VALUES ('.implode(',',$literals).");\n";
        }
        $sql.="COMMIT;\n";
        if(file_put_contents($export,$sql)===false) throw new RuntimeException('Esportazione non riuscita');
        echo "Contenuti esportati in $export\n";
    }
} catch(Throwable $e) { if(isset($backup)) db()->rollback(); fwrite(STDERR,$e->getMessage()."\n"); exit(1); }
