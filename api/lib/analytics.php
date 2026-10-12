<?php
declare(strict_types=1);
function projectAnalytics(): array {
    $rows=records('projects'); $total=count($rows); $counts=[]; $categories=[]; $priorities=[]; $tech=[]; $skills=[]; $months=[];
    foreach($rows as $r) {
        $status=strtoupper(str_replace('-','_',$r['status'])); $counts[$status]=($counts[$status] ?? 0)+1;
        $categories[$r['category']]=($categories[$r['category']] ?? 0)+1;
        $priorities[$r['priority']]=($priorities[$r['priority']] ?? 0)+1;
        foreach($r['technologies'] ?? [] as $name) $tech[$name]=($tech[$name] ?? 0)+1;
        foreach($r['skills'] ?? [] as $name) $skills[$name]=($skills[$name] ?? 0)+1;
        $month=substr($r['createdAt'],0,7); $months[$month]=($months[$month] ?? 0)+1;
    }
    $percent=fn($n)=>$total ? round($n/$total*100) : 0;
    $rank=function($values) use($percent) { arsort($values); $result=[]; foreach($values as $name=>$count) $result[]=['id'=>$name,'name'=>$name,'projectCount'=>$count,'percentage'=>$percent($count),'color'=>null,'icon'=>null]; return array_slice($result,0,10); };
    $categoryList=[]; foreach($categories as $name=>$count) $categoryList[]=['id'=>$name,'name'=>$name,'count'=>$count,'percentage'=>$percent($count),'color'=>'#eab308','icon'=>'📁'];
    $priorityList=[]; foreach($priorities as $priority=>$count) $priorityList[]=['priority'=>$priority,'count'=>$count,'percentage'=>$percent($count)];
    $statusList=[]; foreach(['IN_PROGRESS'=>'In corso','COMPLETED'=>'Completato','DRAFT'=>'Bozza','ARCHIVED'=>'Archiviato'] as $status=>$label) $statusList[]=['status'=>$status,'label'=>$label,'count'=>$counts[$status] ?? 0,'percentage'=>$percent($counts[$status] ?? 0)];
    $featured=count(array_filter($rows,fn($r)=>$r['featured'] ?? false));
    return ['summary'=>['totalProjects'=>$total,'activeProjects'=>$counts['IN_PROGRESS'] ?? 0,'completedProjects'=>$counts['COMPLETED'] ?? 0,'draftProjects'=>$counts['DRAFT'] ?? 0,'archivedProjects'=>$counts['ARCHIVED'] ?? 0,'inDevelopmentProjects'=>$counts['IN_PROGRESS'] ?? 0,'featuredProjects'=>$featured,'completionRate'=>$percent($counts['COMPLETED'] ?? 0),'featuredRate'=>$percent($featured),'avgProjectsPerCategory'=>count($categories) ? round($total/count($categories),2) : 0],
        'distribution'=>['byCategory'=>$categoryList,'byPriority'=>$priorityList,'byStatus'=>$statusList],'topTechnologies'=>$rank($tech),'topSkills'=>$rank($skills),
        'timeline'=>['monthlyDistribution'=>(object)$months,'recentProjects'=>array_map(fn($r)=>array_replace($r,['status'=>strtoupper(str_replace('-','_',$r['status'])),'category'=>['name'=>$r['category'],'color'=>'#eab308']]),array_slice($rows,0,5))]];
}
function bountyStats(): array {
    $rows=array_values(array_filter(records('bug_reports'),fn($r)=>visible('bug_reports',$r)));
    $stats=['totalBugs'=>count($rows),'criticalBugs'=>0,'highBugs'=>0,'mediumBugs'=>0,'lowBugs'=>0,'informationalBugs'=>0,'totalReward'=>0,'totalBounty'=>0,'avgRewardPerBug'=>0,'cveAssigned'=>0,'hallOfFame'=>0,'publicDisclosures'=>0,'avgResolutionDays'=>0,'fastestResolution'=>0];
    $days=[];
    foreach($rows as $r) {
        $key=strtolower($r['severity']).'Bugs'; if(isset($stats[$key])) $stats[$key]++;
        $stats['totalReward']+=(float)($r['reward'] ?? 0);
        if(!empty($r['cveId'])) $stats['cveAssigned']++;
        if(!empty($r['publicUrl'])) $stats['publicDisclosures']++;
        if(!empty($r['resolvedAt'])) $days[]=max(0,(strtotime($r['resolvedAt'])-strtotime($r['reportedAt']))/86400);
    }
    $stats['totalBounty']=$stats['totalReward'];
    $stats['avgRewardPerBug']=count($rows) ? $stats['totalReward']/count($rows) : 0;
    $stats['avgResolutionDays']=$days ? round(array_sum($days)/count($days),1) : 0;
    $stats['fastestResolution']=$days ? min($days) : 0;
    return $stats+['reports'=>array_slice(array_map(fn($r)=>exposed('bug_reports',$r),$rows),0,5),'platforms'=>array_values(array_filter(records('platforms'),fn($r)=>visible('platforms',$r))),'achievements'=>array_values(array_filter(records('achievements'),fn($r)=>visible('achievements',$r))),'updatedAt'=>now()];
}
function visitorStats(): array {
    $today=strtotime(gmdate('Y-m-d').' UTC');
    $r=query('SELECT COUNT(*) total, COALESCE(SUM(last_seen >= ?),0) online, COALESCE(SUM(last_seen >= ?),0) today FROM visitors',[time()-300,$today])->fetch_assoc();
    return ['totalVisitors'=>(int)$r['total'],'currentOnline'=>(int)$r['online'],'todayVisitors'=>(int)$r['today'],'timestamp'=>now()];
}
function visitorAnalytics(): array {
    $range=$_GET['timeRange'] ?? '7d'; $days=['24h'=>1,'7d'=>7,'30d'=>30,'90d'=>90][$range] ?? 7;
    $rows=query('SELECT * FROM visitors WHERE last_seen >= ?',[time()-$days*86400])->fetch_all(MYSQLI_ASSOC);
    $total=count($rows); $views=0; $duration=0; $bounced=0; $returning=0; $devices=['mobile'=>0,'desktop'=>0,'tablet'=>0]; $sources=[]; $pages=[];
    foreach($rows as $r) {
        $views+=(int)$r['page_views']; $duration+=min(3600,$r['last_seen']-$r['first_seen']);
        if($r['page_views']==1) $bounced++; else $returning++;
        $devices[$r['device']]++;
        $source=parse_url($r['referrer'],PHP_URL_HOST) ?: 'Direct'; $sources[$source]=($sources[$source] ?? 0)+1;
        $page=$r['current_page'];
        if(!isset($pages[$page])) $pages[$page]=['page'=>$page,'views'=>0,'uniqueViews'=>0,'avgTime'=>0];
        $pages[$page]['views']+=(int)$r['page_views']; $pages[$page]['uniqueViews']++;
    }
    $sourceList=[]; foreach($sources as $source=>$count) $sourceList[]=['source'=>$source,'visitors'=>$count,'sessions'=>$count,'percentage'=>$total ? $count/$total*100 : 0];
    $timeline=[]; $steps=$range==='24h' ? 24 : $days; $unit=$range==='24h' ? 3600 : 86400;
    for($i=$steps-1;$i>=0;$i--) {
        $start=(int)(time()/$unit)*$unit-$i*$unit; $end=$start+$unit;
        $bucket=array_filter($rows,fn($r)=>$r['last_seen']>=$start && $r['last_seen']<$end);
        $timeline[]=['date'=>gmdate($range==='24h' ? 'Y-m-d\TH:00:00\Z' : 'Y-m-d',$start),'visitors'=>count($bucket),'sessions'=>count($bucket),'pageViews'=>array_sum(array_column($bucket,'page_views'))];
    }
    $stats=visitorStats();
    $week=query('SELECT COUNT(*) n FROM visitors WHERE last_seen >= ?',[time()-7*86400])->fetch_assoc()['n'];
    $month=query('SELECT COUNT(*) n FROM visitors WHERE last_seen >= ?',[strtotime(gmdate('Y-m-01').' UTC')])->fetch_assoc()['n'];
    return ['overview'=>['totalVisitors'=>$stats['totalVisitors'],'uniqueVisitors'=>$total,'pageViews'=>$views,'avgSessionDuration'=>$total ? round($duration/$total) : 0,'bounceRate'=>$total ? round($bounced/$total*100,1) : 0,'returningVisitors'=>$returning],
        'realTime'=>['currentOnline'=>$stats['currentOnline'],'todayVisitors'=>$stats['todayVisitors'],'thisWeekVisitors'=>(int)$week,'thisMonthVisitors'=>(int)$month],
        'traffic'=>['sources'=>$sourceList,'pages'=>array_values($pages)],'devices'=>$devices,'geographic'=>[],'timeline'=>$timeline];
}
function analyticsRoutes(string $route,string $method): never {
    if($route==='visitors/track' && $method==='POST') {
        rateLimit('visitors',120,60);
        $data=body(); $id=$_SESSION['visitor_id'] ?? uid(); $_SESSION['visitor_id']=$id;
        $page=substr((string)($data['page'] ?? '/'),0,255); $referrer=substr((string)($data['referrer'] ?? ''),0,255);
        $agent=$_SERVER['HTTP_USER_AGENT'] ?? ''; $device=preg_match('/ipad|tablet/i',$agent) ? 'tablet' : (preg_match('/mobile|android/i',$agent) ? 'mobile' : 'desktop');
        query('INSERT INTO visitors (id,first_seen,last_seen,current_page,referrer,device) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE page_views = page_views + 1, last_seen = VALUES(last_seen), current_page = VALUES(current_page)',[$id,time(),time(),$page,$referrer,$device]);
        respond(['success'=>true]);
    }
    if($method!=='GET') fail('Metodo non consentito',405);
    if($route==='visitors/stats') respond(visitorStats());
    if($route==='bug-bounty/stats') respond(bountyStats());
    requireAdmin();
    if($route==='analytics/projects') respond(projectAnalytics());
    if($route==='admin/visitor-analytics') respond(visitorAnalytics());
    if($route==='services/stats') {
        $services=records('services'); $inquiries=records('inquiries'); $testimonials=records('testimonials');
        respond(['totalServices'=>count($services),'activeServices'=>count(array_filter($services,fn($s)=>$s['status']==='ACTIVE')),'totalInquiries'=>count($inquiries),'newInquiries'=>count(array_filter($inquiries,fn($i)=>$i['status']==='NEW')),'totalTestimonials'=>count($testimonials),'recentInquiries'=>array_slice($inquiries,0,5)]);
    }
    fail('Endpoint non trovato',404);
}
