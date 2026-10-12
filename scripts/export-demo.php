<?php
if(PHP_SAPI!=='cli') exit;
require dirname(__DIR__).'/api/lib/bootstrap.php';
echo "-- Solo contenuti dimostrativi. Importare dopo api/schema.sql.\n";
foreach(['projects'=>'demo-portfolio','services'=>'sito-web-demo','bug_reports'=>'demo-report','methodologies'=>'demo-method'] as $table=>$slug) {
    $row=record($table,$slug);
    if(!$row) continue;
    // The explicit slugs prevent exporting messages, accounts, or other portfolio data.
    $values=[$row['id'],$slug,json_encode($row,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR),$row['updatedAt']];
    $literals=array_map(fn($value)=>'CONVERT(0x'.bin2hex($value).' USING utf8mb4)',$values);
    echo 'INSERT IGNORE INTO '.$table.' (id,slug,document,updated_at) VALUES ('.implode(',',$literals).");\n";
}
