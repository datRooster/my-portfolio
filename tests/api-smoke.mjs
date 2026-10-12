import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,rm} from 'node:fs/promises';
import path from 'node:path';
import {randomBytes,createHmac} from 'node:crypto';
const php=process.env.PHP_BINARY || 'C:/MAMP/bin/php/php8.3.1/php.exe';
const temp=path.resolve('.tools',`api-test-${randomBytes(5).toString('hex')}`);
await mkdir(temp,{recursive:true});
const config=path.join(temp,'config.php');
const password=randomBytes(16).toString('hex');
const email='test@example.com';
const port=18081;
const base=`http://127.0.0.1:${port}`;
let server;let checks=0;let logs='';
function check(value,message){assert.ok(value,message);checks++;}
function client(cookie='') {
  return async (url,method='GET',data,extra={})=>{
    const headers={'X-Requested-With':'Portfolio',...extra};if(cookie)headers.Cookie=cookie;
    if(data && !(data instanceof FormData))headers['Content-Type']='application/json';
    const response=await fetch(base+'/api/'+url,{method,headers,body:data instanceof FormData?data:data?JSON.stringify(data):undefined});
    for(const item of response.headers.getSetCookie()) if(item.startsWith('portfolio_session='))cookie=item.split(';')[0];
    const type=response.headers.get('content-type')||'';
    const body=type.includes('application/json')?await response.json():await response.arrayBuffer();
    return {status:response.status,body,headers:response.headers};
  };
}
function totp(secret,offset=0) {
  const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';let bits='';
  for(const c of secret)bits+=alphabet.indexOf(c).toString(2).padStart(5,'0');
  const key=Buffer.from(bits.match(/.{8}/g).map(b=>parseInt(b,2)));
  const counter=Buffer.alloc(8);counter.writeBigUInt64BE(BigInt(Math.floor(Date.now()/30000)+offset));
  const hash=createHmac('sha1',key).update(counter).digest();const at=hash[19]&15;
  return ((hash.readUInt32BE(at)&0x7fffffff)%1000000).toString().padStart(6,'0');
}
try {
  execFileSync(php,['tests/database.php','create',config],{stdio:'pipe'});
  const env={...process.env,PORTFOLIO_CONFIG:config,PORTFOLIO_ADMIN_EMAIL:email,PORTFOLIO_ADMIN_PASSWORD:password};
  execFileSync(php,['api/install.php','--seed'],{env,stdio:'pipe'});
  server=spawn(php,['-S',`127.0.0.1:${port}`,'-t','dist','api/router.php'],{env,stdio:'pipe',windowsHide:true});
  server.stderr.on('data',b=>logs+=b.toString());
  let ready=false;
  for(let i=0;i<60;i++){try{if((await fetch(base+'/api/health')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}
  check(ready,'PHP server ready');
  const home=await fetch(base+'/');check(home.ok && (await home.text()).includes('<base href="/"'),'HTML works at domain root');
  const deep=await fetch(base+'/projects/demo-portfolio');check(deep.ok && (await deep.text()).includes('<base href="/"'),'Direct nested page works at domain root');
  const guest=client();const admin=client();
  check((await guest('auth/check')).status===401,'Unauthenticated access denied');
  check((await client('auth_token=auth_forged')('auth/check')).status===401,'Legacy forged cookie rejected');
  check((await guest('projects','POST',{title:'Forbidden'})).status===401,'Anonymous writes denied');
  check((await guest('services/inquiries')).status===401,'Messages private');
  check((await guest('auth/login-simple','POST',{email,password},{Origin:'https://invalid.example'})).status===403,'Cross-origin login rejected');
  check((await guest('auth/login-simple','POST',{email,password},{'X-Requested-With':''})).status===403,'CSRF header required');
  check((await guest('auth/login-simple','POST',{email,password:'wrong'})).status===401,'Bad password rejected');
  check((await admin('auth/login-simple','POST',{email,password})).body.success,'Login succeeds');
  check((await admin('auth/check')).body.user.email===email,'Session persisted');
  const draft=await admin('projects','POST',{title:'Private draft',description:'A private draft.',slug:'private-draft',status:'draft'});
  check(draft.status===201,'Create project');
  check((await guest('projects/private-draft')).status===404,'Draft detail private');
  check(!(await guest('projects?status=draft')).body.projects.length,'Draft list private');
  const updated=await admin('projects/private-draft','PUT',{title:'Published',status:'completed',slug:'published-project'});
  check(updated.body.title==='Published','Update/rename project');
  check((await guest('projects/published-project')).status===200,'Published detail works');
  check((await guest('projects/private-draft')).status===404,'Previous slug removed');
  check((await admin('projects','POST',{title:'Duplicate',description:'X',slug:'published-project'})).status===409,'Duplicate slug rejected');
  check((await guest('projects/published-project')).body.title==='Published','Slug collision does not overwrite');
  check((await admin('projects/published-project','PUT',{title:''})).status===400,'Validation enforced');
  check((await guest('projects?search=Published&limit=1')).body.total===1,'Search and pagination');
  check((await guest('projects?limit=-99')).body.pageSize===1,'Pagination bounded');
  const editorial=await admin('projects/published-project','PUT',{featuredImage:'/images/projects/forno-atelier.jpg',period:'Demo 2026',highlights:['Catalogo','Setup'],projectNotes:'Demo funzionale',publicationUrl:'https://wordpress.org/plugins/datrooster-partial-payments/'});
  check(editorial.status===200 && editorial.body.highlights.length===2 && editorial.body.period==='Demo 2026','Project editorial fields and local image persist');
  check((await admin('projects/published-project','PUT',{featuredImage:'/images/projects/../private.png'})).status===400,'Invalid local image path denied');
  for(const [route,payload] of [
    ['services',{name:'Test Service',description:'Service details',slug:'test-service'}],
    ['bug-bounty/reports',{title:'Test report',description:'Fictitious report',privateNotes:'not-public'}],
    ['bug-bounty/platforms',{name:'Test Platform',username:'test'}],
    ['bug-bounty/achievements',{title:'Test achievement',description:'Sample'}],
    ['bug-bounty/methodologies',{name:'Test methodology',description:'Sample'}],
    ['testimonials',{clientName:'Test client',content:'Sample testimonial'}],
  ]){
    const r=await admin(route,'POST',payload);check(r.status===201,`Create ${route}`);
    const id=r.body.id;check(!!id,`ID ${route}`);
    const publicDetail=await guest(`${route}/${id}`);
    if(route==='testimonials'){check(publicDetail.status===404,'Unapproved testimonial hidden');await admin(`${route}/${id}`,'PUT',{approved:true});}
    else check(publicDetail.status===200,`Read ${route}`);
    if(route==='bug-bounty/reports')check(!('privateNotes' in publicDetail.body),'Report private notes excluded');
    check((await admin(`${route}/${id}`,'PUT',{featured:true})).status===200,`Update ${route}`);
    check((await admin(`${route}/${id}`,'DELETE')).status===200,`Delete ${route}`);
    check((await admin(`${route}/${id}`)).status===404,`Deletion persists ${route}`);
  }
  const image=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aV1EAAAAASUVORK5CYII=','base64');
  const form=new FormData();form.append('file',new Blob([image],{type:'image/png'}),'test.png');
  check((await guest('upload','POST',form)).status===401,'Upload requires auth');
  const upload=await admin('upload','POST',form);check(upload.status===201,'Image upload');
  const media=await guest(upload.body.url.replace('/api/',''));check(media.status===200 && media.body.byteLength===image.length,'Media read persists');
  const invalid=new FormData();invalid.append('file',new Blob(['<?php echo 1; ?>'],{type:'image/png'}),'evil.png');
  check((await admin('upload','POST',invalid)).status===400,'Fake image rejected');
  const contact=await guest('contact','POST',{name:'Visitor',email:'visitor@example.com',message:'Test message',status:'CLOSED'});
  check(contact.status===201,'Contact saved');
  const inbox=await admin('services/inquiries');check(inbox.body.inquiries[0].message==='Test message'&&inbox.body.inquiries[0].status==='NEW','Inbox and status protection');
  check((await guest('contact','POST',{name:'Test',email:'invalid',message:'x'})).status===400,'Contact validation');
  await guest('visitors/track','POST',{page:'/projects'});
  check((await guest('visitors/stats')).body.totalVisitors===1,'Real visitor count');
  for(const route of ['analytics/projects','admin/visitor-analytics','services/stats'])check((await admin(route)).status===200,route);
  check((await guest('bug-bounty/stats')).body.totalBugs===1,'Bounty stats use stored reports');
  check((await admin('projects/published-project','DELETE')).status===200,'Delete project');
  check((await admin('auth/skip-2fa','POST',{})).status===401,'Cannot skip without pending auth');
  const setup=await admin('auth/2fa/setup-simple','POST',{});check(setup.status===200 && setup.body.otpauthUrl.startsWith('otpauth://'),'TOTP setup');
  const verified=await admin('auth/2fa/verify-setup-simple','POST',{code:totp(setup.body.secret)});check(verified.status===200 && verified.body.backupCodes.length===8,'TOTP setup verification');
  check((await admin('auth/2fa/setup-simple','POST',{})).status===409,'Cannot reset active 2FA');
  await admin('auth/logout-simple','POST',{});
  check((await admin('auth/check')).status===401,'Logout invalidates session');
  check((await admin('auth/login-simple','POST',{email,password})).body.requiresTwoFactor,'2FA required after enabling');
  check((await admin('auth/check')).status===401,'Pending 2FA has no admin access');
  check((await admin('auth/skip-2fa','POST',{})).status===403,'Enabled 2FA cannot be skipped');
  check((await admin('auth/verify-2fa-simple','POST',{code:'invalid'})).status===401,'Bad 2FA rejected');
  check((await admin('auth/verify-2fa-simple','POST',{code:verified.body.backupCodes[0]})).status===200,'Recovery code accepted');
  await admin('auth/logout-simple','POST',{});
  await admin('auth/login-simple','POST',{email,password});
  check((await admin('auth/verify-2fa-simple','POST',{code:verified.body.backupCodes[0]})).status===401,'Recovery code single-use');
  check((await admin('auth/verify-2fa-simple','POST',{code:totp(setup.body.secret,1)})).status===200,'Authenticator login');
  const newPassword=randomBytes(16).toString('hex');
  check((await admin('auth/password','POST',{currentPassword:password,newPassword})).status===200,'Change password');
  await admin('auth/logout-simple','POST',{});
  check((await admin('auth/login-simple','POST',{email,password})).status===401,'Old password rejected');
  check((await admin('auth/login-simple','POST',{email,password:newPassword})).body.requiresTwoFactor,'New password works');
  let limited;
  for(let i=0;i<11;i++)limited=await guest('auth/login-simple','POST',{email:'rate@example.com',password:'wrong'});
  check(limited.status===429,'Login rate limit persists across sessions');
  const cybersecurity=JSON.stringify((await guest('bug-bounty/reports')).body);
  execFileSync(php,['scripts/import-portfolio.php'],{env,stdio:'pipe'});
  const portfolio=(await guest('projects')).body.projects;
  check(portfolio.length===9 && !portfolio.some(p=>p.slug==='demo-portfolio'),'Import installs 9 real projects and replaces demo');
  check((await guest('services')).body.services.length===4,'Import installs 4 services');
  check(JSON.stringify((await guest('bug-bounty/reports')).body)===cybersecurity,'Import preserves cybersecurity');
  execFileSync(php,['scripts/import-portfolio.php'],{env,stdio:'pipe'});
  check(JSON.stringify((await guest('projects')).body.projects)===JSON.stringify(portfolio),'Repeated import preserves content and IDs');
  const sqlFile=path.join(temp,'portfolio.sql');
  execFileSync(php,['scripts/import-portfolio.php','--export='+sqlFile],{env,stdio:'pipe'});
  execFileSync(php,['tests/portfolio-export.php',sqlFile],{env,stdio:'pipe'});
  check((await guest('projects')).body.projects.length===9 && (await guest('services')).body.services.length===4,'SQL export restores content into empty collections');
  console.log(`API: ${checks} verifiche superate (database isolato, sessioni, 2FA, CRUD, contatti, upload, statistiche).`);
} catch(error){console.error(error);console.error(logs.slice(-3500));process.exitCode=1;}
finally{
  if(server){server.kill();await new Promise(resolve=>{if(server.exitCode!==null)resolve();else server.once('exit',resolve);});}
  try{execFileSync(php,['tests/database.php','drop',config],{stdio:'pipe'});}catch(error){console.error('Cleanup database di test:',error.message);process.exitCode=1;}
  // Only the uniquely named test directory inside .tools is removed.
  if(path.dirname(temp)===path.resolve('.tools') && /^api-test-[a-f0-9]{10}$/.test(path.basename(temp)))await rm(temp,{recursive:true,force:true});
}
