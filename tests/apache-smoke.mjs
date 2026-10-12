import assert from 'node:assert/strict';
const base=process.env.PORTFOLIO_BROWSER_URL || 'http://localhost/my-portfolio/dist';
for(const file of ['api/config.local.php','api/config.example.php','api/schema.sql','api/lib/bootstrap.php','api/storage/uploads/test.png','.htaccess','.git/config']){
  const response=await fetch(`${base}/${file}`);assert.equal(response.status,403,`Private path: ${file}`);await response.text();
}
const denied=await fetch(base+'/api/projects',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(denied.status,403);
const home=await fetch(base+'/');assert.equal(home.headers.get('x-content-type-options'),'nosniff');assert.equal(home.headers.get('x-frame-options'),'SAMEORIGIN');
console.log('Apache: 7 percorsi privati bloccati, controllo richieste e intestazioni verificati.');
