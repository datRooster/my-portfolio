import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
const base=process.env.PORTFOLIO_BROWSER_URL || 'http://localhost/my-portfolio/dist';
const catalog=JSON.parse(await readFile('api/lib/portfolio.json','utf8'));
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];const external=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('request',r=>{if(/^https?:/.test(r.url()) && new URL(r.url()).origin!==new URL(base).origin)external.push(r.url());});
await mkdir('.tools/screenshots',{recursive:true});
try {
  for(const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
    await page.setViewportSize(viewport);
    for(const route of ['/','/about','/projects','/services','/contact',...catalog.projects.map(p=>'/projects/'+p.slug),...catalog.services.map(s=>'/services/'+s.slug)]) {
      await page.goto(base+route);await page.waitForLoadState('networkidle');
      await page.locator('img').evaluateAll(async images=>{for(const img of images)img.loading='eager';await Promise.all(images.map(img=>img.decode()));});
      await page.evaluate(()=>Promise.all(document.getAnimations().filter(a=>Number.isFinite(a.effect?.getComputedTiming().endTime)).map(a=>a.finished.catch(()=>{}))));
      assert.ok(await page.locator('h1').count(),route);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'Overflow '+route+' '+viewport.width);
      const broken=await page.locator('img').evaluateAll(images=>images.filter(img=>img.complete && img.naturalWidth===0).map(img=>img.src));
      assert.deepEqual(broken,[],'Images '+route);
      assert.ok(!(await page.locator('body').innerText()).includes('Invalid Date'),'Dates '+route);
      if(route.startsWith('/projects/')) {
        const project=catalog.projects.find(p=>route.endsWith('/'+p.slug));
        assert.equal(await page.locator('h1').innerText(),project.title);
        await page.getByRole('heading',{name:'Funzionalità sviluppate'}).waitFor();
        await page.getByRole('heading',{name:'Stato e compatibilità'}).waitFor();
      }
      if(['/projects','/projects/datrooster-partial-payments','/projects/morgante-home-solution','/about'].includes(route))await page.screenshot({path:'.tools/screenshots/content-'+route.slice(1).replaceAll('/','-')+'-'+viewport.width+'.png',fullPage:true});
    }
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(base+'/projects');await page.waitForLoadState('networkidle');
  await page.getByRole('button',{name:'Mostra Filtri'}).click();
  await page.getByLabel('Plugin WordPress',{exact:true}).check();
  await page.getByRole('heading',{name:'2 di 9 progetti',exact:true}).waitFor();
  await page.getByLabel('Solo progetti in evidenza').check();
  await page.getByRole('heading',{name:'1 di 9 progetti',exact:true}).waitFor();
  await page.getByRole('button',{name:'Rimuovi tutti i filtri'}).click();
  await page.getByLabel('React',{exact:true}).check();
  await page.getByRole('heading',{name:'2 di 9 progetti',exact:true}).waitFor();
  await page.getByLabel('PHP',{exact:true}).check();
  await page.getByRole('heading',{name:'1 di 9 progetti',exact:true}).waitFor();
  await page.goto(base+'/projects/morgante-home-solution');await page.waitForLoadState('networkidle');
  await page.getByRole('button',{name:'Apri immagine 1 di Morgante Home Solution'}).click();
  await page.getByTitle('Close (Esc)').waitFor();
  await page.keyboard.press('Escape');
  assert.deepEqual(errors,[],'No JavaScript errors');
  assert.deepEqual(external,[],'All assets local; external profiles open only on click');
  console.log('Portfolio: 18 pagine a 1440 e 390 px, 9 schede, 4 servizi, immagini, filtri combinati e galleria verificati.');
} finally {await browser.close();}
