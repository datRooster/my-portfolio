<?php
declare(strict_types=1);
function defaults(string $table): array {
    $common=['slug'=>null];
    return $common + match($table) {
        'projects'=>['title'=>'','description'=>'','shortDescription'=>'','longDescription'=>'','category'=>'Web Development','status'=>'draft','priority'=>1,'featured'=>false,'startDate'=>now(),'endDate'=>null,'featuredImage'=>'','gallery'=>[],'screenshots'=>[],'technologies'=>[],'skills'=>[],'tags'=>[],'team'=>[],'demoUrl'=>'','repositoryUrl'=>'','caseStudyUrl'=>'','role'=>'','client'=>'','metrics'=>[]],
        'services'=>['name'=>'','title'=>'','description'=>'','longDescription'=>'','category'=>'WEB_DEVELOPMENT','type'=>'CONSULTING','pricing'=>'CUSTOM','price'=>null,'basePrice'=>null,'maxPrice'=>null,'currency'=>'EUR','duration'=>'','status'=>'ACTIVE','featured'=>false,'available'=>true,'order'=>0,'features'=>[],'deliverables'=>[],'requirements'=>[],'gallery'=>[],'tags'=>[],'icon'=>'','image'=>''],
        'bug_reports'=>['title'=>'','description'=>'','severity'=>'LOW','category'=>'INFORMATION_DISCLOSURE','program'=>'','platform'=>'','status'=>'SUBMITTED','reward'=>0,'currency'=>'EUR','discoveredAt'=>now(),'reportedAt'=>now(),'resolvedAt'=>null,'cveId'=>'','methodology'=>[],'tools'=>[],'screenshots'=>[],'publicUrl'=>'','blogPostUrl'=>'','privateNotes'=>'','publicVisible'=>true],
        'platforms'=>['name'=>'','username'=>'','profileUrl'=>'','reputation'=>0,'rank'=>'','points'=>0,'level'=>'','bugsSubmitted'=>0,'bugsAccepted'=>0,'bugsDuplicate'=>0,'bugsInformational'=>0,'totalEarnings'=>0,'averageReward'=>0,'currency'=>'EUR','hallOfFame'=>0,'certificates'=>[],'badges'=>[],'joinedAt'=>null,'lastActive'=>null,'activeMonths'=>0,'active'=>true,'featured'=>false,'publicProfile'=>true],
        'achievements'=>['title'=>'','description'=>'','category'=>'RECOGNITION','icon'=>'','badgeUrl'=>'','color'=>'','issuedBy'=>'','certificateUrl'=>'','verificationUrl'=>'','criteria'=>'','difficulty'=>'BEGINNER','rarity'=>'','earnedAt'=>now(),'expiresAt'=>null,'points'=>0,'monetaryValue'=>0,'featured'=>false,'publicVisible'=>true],
        'methodologies'=>['name'=>'','description'=>'','category'=>'WEB_APPLICATION','steps'=>[],'tools'=>[],'prerequisites'=>[],'exampleTargets'=>[],'examplePayloads'=>[],'commonMistakes'=>[],'difficulty'=>'BEGINNER','estimatedTime'=>'','successRate'=>0,'resources'=>[],'references'=>[],'timesUsed'=>0,'bugsFound'=>0,'lastUsed'=>null,'featured'=>false,'publicVisible'=>true],
        'testimonials'=>['clientName'=>'','clientEmail'=>'','clientRole'=>'','company'=>'','content'=>'','rating'=>5,'avatar'=>'','serviceId'=>null,'projectId'=>null,'approved'=>false,'featured'=>false],
        default=>[],
    };
}
function validated(string $table,array $input,?array $existing=null): array {
    if($table==='projects') {
        foreach(['liveUrl'=>'demoUrl','githubUrl'=>'repositoryUrl','imageUrl'=>'featuredImage'] as $alias=>$key) if(empty($input[$key]) && !empty($input[$alias])) $input[$key]=$input[$alias];
        if(($input['status'] ?? '')==='active') $input['status']='in-progress';
    }
    $defaults=defaults($table);
    if ($table==='projects') $defaults+=['period'=>'','highlights'=>[],'projectNotes'=>'','imageCaption'=>'','publicationUrl'=>''];
    $data=array_replace($defaults,$existing ?: [],array_intersect_key($input,$defaults));
    foreach($defaults as $key=>$default) {
        $value=$data[$key];
        if (is_bool($default)) {
            if (!is_bool($value)) fail("Valore non valido: $key");
        } elseif (is_array($default)) {
            if (!is_array($value) || count($value)>100) fail("Lista non valida: $key");
            if ($key !== 'metrics') foreach($value as $item) if (!is_string($item) || strlen($item)>2000) fail("Elemento non valido: $key");
        } elseif (is_int($default) || in_array($key,['price','basePrice','maxPrice'],true)) {
            if ($value === null || $value === '') $data[$key]=null;
            elseif(!is_numeric($value) || (float)$value < 0) fail("Numero non valido: $key");
            else $data[$key]=(float)$value;
        } elseif ($value !== null && (!is_string($value) || strlen($value)>50000)) fail("Testo non valido: $key");
        if ($value && (str_ends_with($key,'Url') || in_array($key,['featuredImage','image','avatar'],true))) {
            if (!is_string($value) || (!preg_match('~^(https?://|/api/media/)~i',$value) && !preg_match('~^/images/projects/[a-z0-9-]+\.(?:png|jpe?g|webp|svg)$~D',$value))) fail("URL non valido: $key");
        }
        if ($value && (str_ends_with($key,'At') || str_ends_with($key,'Date')) && strtotime((string)$value)===false) fail("Data non valida: $key");
    }
    $required=match($table) {
        'projects','bug_reports','achievements'=>['title','description'],
        'services','methodologies'=>['name','description'],
        'platforms'=>['name','username'],
        'testimonials'=>['clientName','content'],
        default=>[],
    };
    foreach($required as $key) if (!is_string($data[$key]) || !trim($data[$key])) fail("Campo richiesto: $key");
    if (in_array($table,['projects','services'],true)) {
        $data['slug']=$data['slug'] ?: trim(strtolower(preg_replace('/[^a-zA-Z0-9]+/','-',$data['title'] ?: $data['name'])),'-');
        if (!preg_match('/^[a-z0-9][a-z0-9-]{0,189}$/D',$data['slug'])) fail('Slug non valido');
    }
    if ($table==='projects') {
        $data['status']=str_replace('_','-',strtolower($data['status']));
        if (!in_array($data['status'],['draft','in-progress','completed','archived'],true)) fail('Stato progetto non valido');
        if ($data['priority']<1 || $data['priority']>5) fail('Priorità tra 1 e 5 richiesta');
    }
    if ($table==='services' && !in_array($data['status'],['ACTIVE','INACTIVE','DRAFT','ARCHIVED'],true)) fail('Stato servizio non valido');
    if ($table==='testimonials' && ($data['rating']<1 || $data['rating']>5)) fail('Valutazione tra 1 e 5 richiesta');
    foreach(['serviceId'=>'services','projectId'=>'projects'] as $key=>$target) if (!empty($data[$key]) && !record($target,$data[$key])) fail('Riferimento non valido: '.$key);
    return $data;
}
function visible(string $table,array $row): bool {
    if (user()) return true;
    return match($table) {
        'projects'=>($row['status'] ?? '')!=='draft',
        'services'=>($row['status'] ?? '')==='ACTIVE' && ($row['available'] ?? false),
        'testimonials'=>($row['approved'] ?? false),
        'platforms'=>($row['publicProfile'] ?? true),
        default=>($row['publicVisible'] ?? true),
    };
}
function exposed(string $table,array $row): array {
    if($table==='projects') $row+=['githubUrl'=>$row['repositoryUrl'] ?? '', 'liveUrl'=>$row['demoUrl'] ?? '', 'imageUrl'=>$row['featuredImage'] ?? ''];
    if (!user()) foreach(['privateNotes','clientEmail'] as $key) unset($row[$key]);
    if ($table==='services') {
        $testimonials=array_filter(records('testimonials'),fn($r)=>($r['serviceId'] ?? '')===$row['id'] && ($r['approved'] ?? false));
        $row['testimonials']=array_map(fn($r)=>exposed('testimonials',$r),array_values($testimonials));
        $row['_count']=['testimonials'=>count($testimonials),'inquiries'=>0];
        $row['title']=$row['title'] ?: $row['name'];
        $row['shortDescription']=$row['description'];
        $row['reviewCount']=count($testimonials);
        $row['averageRating']=$testimonials ? array_sum(array_column($testimonials,'rating'))/count($testimonials) : 0;
        $row['isActive']=$row['status']==='ACTIVE';
        $price=$row['price'] ?? $row['basePrice'] ?? null;
        $row['packages']=$price!==null ? [['id'=>$row['id'],'name'=>$row['title'],'price'=>(float)$price,'features'=>$row['features'],'deliveryTime'=>$row['duration'] ?: 'Da concordare']] : [];
    }
    return $row;
}
function filtered(string $table): array {
    $rows=array_values(array_filter(records($table),fn($r)=>visible($table,$r)));
    foreach(['category','status','type','severity','platform','difficulty','serviceId','projectId'] as $key) {
        if (isset($_GET[$key]) && $_GET[$key]!=='' && $_GET[$key]!=='all') {
            $value=(string)$_GET[$key];
            if($table==='projects' && $key==='status') $value=str_replace('_','-',strtolower($value));
            $rows=array_values(array_filter($rows,fn($r)=>strcasecmp((string)($r[$key] ?? ''),$value)===0));
        }
    }
    foreach(['featured','active','available','approved'] as $key) if (isset($_GET[$key])) {
        $wanted=$_GET[$key]==='true';
        $rows=array_values(array_filter($rows,fn($r)=>(bool)($r[$key] ?? false)===$wanted));
    }
    foreach(['technologies','tags'] as $key) if (!empty($_GET[$key])) {
        $wanted=explode(',',(string)$_GET[$key]);
        $rows=array_values(array_filter($rows,fn($r)=>!array_diff($wanted,$r[$key] ?? [])));
    }
    if (!empty($_GET['search'])) $rows=array_values(array_filter($rows,fn($r)=>stripos(implode(' ',[$r['title'] ?? '',$r['name'] ?? '',$r['description'] ?? '',$r['program'] ?? '']),(string)$_GET['search'])!==false));
    $sort=in_array($_GET['sortBy'] ?? '',['title','name','createdAt','updatedAt','discoveredAt','reward','earnedAt','priority','order'],true) ? $_GET['sortBy'] : 'createdAt';
    $direction=($_GET['sortOrder'] ?? 'desc')==='asc' ? 1 : -1;
    usort($rows,fn($a,$b)=>(($a[$sort] ?? '')<=>($b[$sort] ?? ''))*$direction);
    return $rows;
}
function contentRoutes(string $table,?string $key,string $method): never {
    if ($method==='GET') {
        if ($key) {
            $row=record($table,$key);
            if (!$row || !visible($table,$row)) fail('Contenuto non trovato',404);
            respond(exposed($table,$row));
        }
        $rows=filtered($table); $total=count($rows);
        $page=max(1,(int)($_GET['page'] ?? 1));
        $limit=max(1,min(100,(int)($_GET['limit'] ?? $_GET['pageSize'] ?? 50)));
        $offset=max(0,(int)($_GET['offset'] ?? (($page-1)*$limit)));
        $rows=array_map(fn($r)=>exposed($table,$r),array_slice($rows,$offset,$limit));
        $pagination=['page'=>$page,'limit'=>$limit,'total'=>$total,'totalPages'=>(int)ceil($total/$limit),'hasNext'=>$offset+$limit<$total,'hasPrev'=>$offset>0];
        respond(match($table) {
            'projects'=>['projects'=>$rows,'total'=>$total,'page'=>$page,'pageSize'=>$limit,'hasMore'=>$offset+$limit<$total],
            'services'=>['services'=>$rows,'pagination'=>$pagination],
            'testimonials'=>['testimonials'=>$rows,'pagination'=>$pagination],
            'bug_reports'=>['reports'=>$rows,'totalCount'=>$total,'hasMore'=>$offset+$limit<$total],
            default=>$rows,
        });
    }
    requireAdmin();
    if (!in_array($method,['POST','PUT','PATCH','DELETE'],true)) fail('Metodo non consentito',405);
    $input=$method==='DELETE' ? [] : body();
    $key=$key ?: (string)($input['id'] ?? $_GET['id'] ?? '');
    $existing=$key ? record($table,$key) : null;
    if ($method!=='POST' && !$existing) fail('Contenuto non trovato',404);
    if ($method==='DELETE') {
        query('DELETE FROM '.tableName($table).' WHERE id = ?',[$existing['id']]);
        respond(['success'=>true]);
    }
    $data=validated($table,$input,$method==='POST' ? null : $existing);
    $saved=save($table,$data,$method==='POST' ? null : $existing['id']);
    respond(exposed($table,$saved),$method==='POST'?201:200);
}
function inquiryRoutes(string $route,string $method): never {
    $parts=explode('/',$route); $id=$parts[2] ?? null; $responses=($parts[3] ?? '')==='responses';
    if ($method==='POST' && !$id) {
        rateLimit('contact',5,3600);
        $data=body();
        $name=trim((string)($data['name'] ?? $data['clientName'] ?? ''));
        $email=trim((string)($data['email'] ?? $data['clientEmail'] ?? ''));
        $message=trim((string)($data['message'] ?? ''));
        if (!$name || strlen($name)>150 || !filter_var($email,FILTER_VALIDATE_EMAIL) || strlen($message)<3 || strlen($message)>10000) fail('Nome, email e messaggio validi sono obbligatori');
        $serviceId=(string)($data['serviceId'] ?? '');
        if ($serviceId && (!($service=record('services',$serviceId)) || !visible('services',$service))) fail('Servizio non disponibile');
        $allowed=array_intersect_key($data,array_flip(['company','phone','subject','budget','timeline','projectType']));
        foreach($allowed as $value) if(!is_string($value) || strlen($value)>1000) fail('Campo non valido');
        $saved=save('inquiries',$allowed+['name'=>$name,'clientName'=>$name,'email'=>$email,'clientEmail'=>$email,'message'=>$message,'serviceId'=>$serviceId ?: null,'status'=>'NEW','priority'=>'MEDIUM','notes'=>'']);
        respond(['success'=>true,'id'=>$saved['id'],'message'=>'Messaggio ricevuto'],201);
    }
    requireAdmin();
    if (!$id && $method==='GET') {
        $rows=records('inquiries');
        if (!empty($_GET['status'])) $rows=array_values(array_filter($rows,fn($r)=>$r['status']===$_GET['status']));
        respond(['inquiries'=>$rows,'pagination'=>['total'=>count($rows),'page'=>1,'totalPages'=>1]]);
    }
    $inquiry=$id ? record('inquiries',$id) : null;
    if (!$inquiry) fail('Messaggio non trovato',404);
    $inquiry['service']=!empty($inquiry['serviceId']) ? record('services',$inquiry['serviceId']) : null;
    $list=array_values(array_filter(records('inquiry_responses'),fn($r)=>$r['inquiryId']===$id));
    if ($method==='GET') respond($responses ? ['responses'=>$list] : $inquiry+['responses'=>$list]);
    if ($responses && $method==='POST') {
        $data=body(); $message=trim((string)($data['message'] ?? $data['content'] ?? ''));
        if(!$message || strlen($message)>10000) fail('Messaggio non valido');
        respond(save('inquiry_responses',['inquiryId'=>$id,'message'=>$message,'isInternal'=>true,'sentViaEmail'=>false]),201);
    }
    if ($method==='PUT' || $method==='PATCH') {
        $data=body();
        foreach(['status','priority','notes'] as $field) if(isset($data[$field])) {
            if(!is_string($data[$field]) || strlen($data[$field])>10000) fail('Campo non valido');
            $inquiry[$field]=$data[$field];
        }
        respond(save('inquiries',$inquiry,$id));
    }
    if($method==='DELETE') { query('DELETE FROM inquiries WHERE id = ?',[$id]); respond(['success'=>true]); }
    fail('Metodo non consentito',405);
}
