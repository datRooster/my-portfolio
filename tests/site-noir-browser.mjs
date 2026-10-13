import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';

const base = process.env.PORTFOLIO_BROWSER_URL || 'http://localhost/my-portfolio/dist';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const errors = [], external = [], failedAssets = [];
page.on('pageerror', e => errors.push(e.message));
page.on('request', r => { if (/^https?:/.test(r.url()) && new URL(r.url()).origin !== new URL(base).origin) external.push(r.url()); });
page.on('response', r => { if (r.status() >= 400 && /\.(png|jpg|svg|ttf|css|js)(\?|$)/.test(r.url())) failedAssets.push(r.url()); });
await mkdir('.tools/screenshots/noir-site', { recursive: true });

try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const [route, scene] of [['projects','projects'], ['services','services'], ['about','about'], ['contact','contact'], ['bug-bounty','security']]) {
      await page.goto(base + '/' + route);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('.noir-scene')).toHaveAttribute('data-scene', scene);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, route + ' overflow');
      await expect(page.locator('.noir-button')).toBeInViewport();
      const atlas = await page.locator('.noir-frame').first().evaluate(e => getComputedStyle(e).backgroundImage);
      assert.ok(atlas.includes('noir-' + scene + '-v1.png'), 'Dedicated local scene');
      const distance = await page.locator('.noir-scene').evaluate(e => e.offsetHeight - e.querySelector('.noir-stage').offsetHeight);
      for (const progress of [0.5, 1, 0]) {
        await page.evaluate(y => scrollTo(0, y), distance * progress);
        await expect.poll(() => page.locator('.noir-scene').evaluate(e => Number(e.style.getPropertyValue('--scene-progress')))).toBeCloseTo(progress, 2);
        assert.ok(Math.abs(await page.locator('.noir-stage').evaluate(e => e.getBoundingClientRect().top)) <= 1, 'Scene stays pinned');
      }
      await page.screenshot({ path: '.tools/screenshots/noir-site/' + scene + '-' + viewport.width + '.png' });
      await page.locator('.noir-button').click();
      await expect(page.locator('#' + scene + '-content')).toBeFocused();
      if (route === 'contact') {
        await page.getByRole('button', { name: 'Profili pubblici' }).click();
        await expect(page.getByRole('heading', { name: 'Codice, plugin e contribuzioni' })).toBeVisible();
        await page.getByRole('button', { name: /Apri il modulo/ }).click();
        await expect(page.getByPlaceholder('Il tuo nome', { exact: true })).toBeVisible();
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await page.locator('.noir-scene').evaluate(e => e.offsetHeight - e.querySelector('.noir-stage').offsetHeight), 0, 'No spacer with reduced motion');
      await page.emulateMedia({ reducedMotion: 'no-preference' });
    }
    for (const route of ['/bug-bounty/reports', '/bug-bounty/methodology', '/bug-bounty/achievements', '/login']) {
      await page.goto(base + route); await page.waitForLoadState('networkidle');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, route + ' overflow');
    }
  }
  // Check the real contact UI against a deterministic local response without storing messages.
  await page.goto(base + '/contact'); await page.waitForLoadState('networkidle');
  await page.locator('.noir-button').click();
  await page.getByPlaceholder('Il tuo nome', { exact: true }).fill('Collaudo grafica');
  await page.getByPlaceholder('la.tua@email.com', { exact: true }).fill('test@example.com');
  await page.getByPlaceholder('Raccontami del tuo progetto, delle tue esigenze e dei tuoi obiettivi...').fill('Verifica del modulo dopo il cambio di grafica.');
  await page.route('**/api/contact', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) }));
  await page.locator('button[type=submit]').click();
  await expect(page.getByRole('heading', { name: 'Messaggio Inviato!' })).toBeVisible();
  await page.unroute('**/api/contact');
  // Read-only admin views, using the existing local development account.
  const access = await readFile('.tools/local-access.txt', 'utf8');
  const email = access.match(/Email: (.+)/)[1].trim(), password = access.match(/Password: (.+)/)[1].trim();
  const login = await context.request.post(base + '/api/auth/login-simple', { data: { email, password }, headers: { 'X-Requested-With': 'Portfolio' } });
  assert.equal(login.status(), 200, 'Local admin login');
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const route of ['/admin', '/admin/projects', '/admin/content', '/admin/messages', '/admin/analytics', '/admin/security', '/admin/settings', '/admin/bug-bounty']) {
      await page.goto(base + route); await page.waitForLoadState('networkidle');
      assert.ok(page.url().includes('/admin'), 'Authenticated admin route');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, route + ' admin overflow');
    }
    await page.screenshot({ path: '.tools/screenshots/noir-site/admin-' + viewport.width + '.png' });
  }
  await context.request.post(base + '/api/auth/logout', { headers: { 'X-Requested-With': 'Portfolio' } });
  assert.deepEqual(errors, [], 'No JavaScript errors');
  assert.deepEqual(failedAssets, [], 'All assets load');
  assert.deepEqual(external, [], 'No external runtime dependencies');
  console.log('Noir site OK: 5 scenes, reverse scroll, skips, reduced motion, contact flow, security pages and 8 admin views at desktop/mobile sizes.');
} finally { await browser.close(); }
