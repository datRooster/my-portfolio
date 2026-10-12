<?php
if (PHP_SAPI !== 'cli') exit;
$action=$argv[1]; $file=$argv[2];
mysqli_report(MYSQLI_REPORT_ERROR|MYSQLI_REPORT_STRICT);
$base=require getenv('PORTFOLIO_TEST_CONFIG') ?: dirname(__DIR__).'/api/config.local.php';
$db=new mysqli($base['db_host'],$base['db_user'],$base['db_password'],'',(int)$base['db_port']);
if($action==='create') {
    $name='portfolio_test_'.bin2hex(random_bytes(6));
    $db->query('CREATE DATABASE '.$name.' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    $base['db_name']=$name; $base['storage_dir']=dirname($file).'/storage';
    file_put_contents($file,'<?php return '.var_export($base,true).';');
} elseif($action==='drop') {
    $test=require $file;
    if(!preg_match('/^portfolio_test_[a-f0-9]{12}$/D',$test['db_name'])) throw new RuntimeException('Not a test database');
    $db->query('DROP DATABASE '.$test['db_name']);
}
