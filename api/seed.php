<?php
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
function seedDemo(): void {
    if (!record('projects','demo-portfolio')) save('projects',[
        'title'=>'Portfolio dimostrativo','slug'=>'demo-portfolio','description'=>'Progetto di esempio da sostituire con i tuoi lavori.',
        'longDescription'=>'Un portfolio responsive con pannello amministrativo e contenuti gestiti in autonomia.',
        'category'=>'Web Development','status'=>'completed','priority'=>3,'featured'=>true,'startDate'=>'2026-01-01T00:00:00Z','endDate'=>'2026-02-01T00:00:00Z',
        'technologies'=>['React','PHP','MySQL'],'skills'=>['Frontend','API Design'],'tags'=>['demo','portfolio'],
        'gallery'=>[],'screenshots'=>[],'team'=>[],'role'=>'Sviluppatore','client'=>'Cliente dimostrativo','metrics'=>[],
    ]);
    if (!record('services','sito-web-demo')) save('services',[
        'name'=>'Sviluppo sito web — esempio','title'=>'Sviluppo sito web — esempio','slug'=>'sito-web-demo',
        'description'=>'Servizio dimostrativo: progettazione e sviluppo di un sito responsive.','longDescription'=>'Contenuto di esempio modificabile.',
        'category'=>'WEB_DEVELOPMENT','type'=>'CONSULTING','pricing'=>'CUSTOM','status'=>'ACTIVE','available'=>true,'featured'=>true,'order'=>0,
        'currency'=>'EUR','duration'=>'Da concordare','features'=>['Layout responsive','Pannello amministrativo'],'deliverables'=>['Sito pubblicabile'],'requirements'=>['Testi e immagini'],'gallery'=>[],'tags'=>['demo'],
    ]);
    if (!record('bug_reports','demo-report')) save('bug_reports',[
        'slug'=>'demo-report','title'=>'Report dimostrativo su ambiente di laboratorio','description'=>'Esempio fittizio; non rappresenta una vulnerabilità reale.',
        'severity'=>'LOW','category'=>'INFORMATION_DISCLOSURE','program'=>'Laboratorio demo','platform'=>'Laboratorio','status'=>'RESOLVED',
        'reward'=>0,'currency'=>'EUR','discoveredAt'=>'2026-02-01T00:00:00Z','reportedAt'=>'2026-02-01T00:00:00Z','resolvedAt'=>'2026-02-03T00:00:00Z',
        'methodology'=>['Analisi manuale'],'tools'=>[],'screenshots'=>[],'publicVisible'=>true,
    ]);
    if (!record('methodologies','demo-method')) save('methodologies',[
        'slug'=>'demo-method','name'=>'Revisione applicativa — esempio','description'=>'Procedura dimostrativa per ambienti autorizzati.',
        'category'=>'WEB_APPLICATION','difficulty'=>'BEGINNER','steps'=>['Definire il perimetro autorizzato','Analizzare i risultati','Documentare le osservazioni'],
        'tools'=>[],'prerequisites'=>['Autorizzazione del proprietario'],'exampleTargets'=>[],'examplePayloads'=>[],'commonMistakes'=>[],'resources'=>[],'references'=>[],
        'timesUsed'=>0,'bugsFound'=>0,'featured'=>true,'publicVisible'=>true,
    ]);
    echo "Dati dimostrativi disponibili.\n";
}
