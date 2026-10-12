<?php
if(PHP_SAPI!=='cli') exit;
require dirname(__DIR__).'/api/lib/bootstrap.php';
if(!preg_match('/^portfolio_test_[a-f0-9]{12}$/D',config()['db_name'])) throw new RuntimeException('Solo database isolati di test');
$before=['projects'=>records('projects'),'services'=>records('services')];
foreach(array_keys($before) as $table) query('DELETE FROM '.tableName($table));
db()->multi_query(file_get_contents($argv[1]));
do {if($result=db()->store_result()) $result->free();} while(db()->more_results() && db()->next_result());
foreach($before as $table=>$rows) {
    $after=records($table);
    $byId=fn($a,$b)=>strcmp($a['id'],$b['id']);
    usort($rows,$byId);usort($after,$byId);
    if($rows!==$after) throw new RuntimeException('Esportazione non equivalente: '.$table);
}
echo "Export SQL verificato.\n";
