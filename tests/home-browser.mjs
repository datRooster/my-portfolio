import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = process.env.PORTFOLIO_BROWSER_URL || 'http://127.0.0.1:8080';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
const errors = [];
const external = [];
page.on('pageerror', error => errors.push(error.message));
page.on('request', request => {
  if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(base).origin) external.push(request.url());
});
await mkdir('.tools/screenshots', { recursive: true });

try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 375, height: 667 }]) {
    await page.setViewportSize(viewport);
    await page.goto(base + '/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'No horizontal overflow');
    await expect(page.getByRole('button', { name: 'Esplora i progetti' })).toBeInViewport();
    const distance = await page.locator('.noir-scene').evaluate(scene => scene.offsetHeight - scene.querySelector('.noir-stage').offsetHeight);
    for (const progress of [0, 0.5, 1, 0]) {
      await page.evaluate(y => window.scrollTo(0, y), distance * progress);
      await expect.poll(() => page.locator('.noir-scene').evaluate(scene => Number(scene.style.getPropertyValue('--scene-progress')))).toBeCloseTo(progress, 2);
      const top = await page.locator('.noir-stage').evaluate(stage => stage.getBoundingClientRect().top);
      assert.ok(Math.abs(top) <= 1, 'Scene stays pinned until the gesture finishes');
    }
    await page.getByRole('button', { name: 'Esplora i progetti' }).click();
    await expect(page.locator('#selected-work')).toBeFocused();
    await expect(page.getByRole('heading', { name: 'Il codice prende forma.' })).toBeInViewport();
    assert.equal(await page.locator('.noir-project').count(), 3);
    const link = page.locator('.noir-project').first();
    const expectedTitle = await link.locator('h3').innerText();
    await link.click();
    await expect(page.locator('h1')).toHaveText(expectedTitle);
    await page.goto(base + '/');
    await page.waitForLoadState('networkidle');
    if (viewport.width < 768) {
      await page.getByRole('button', { name: 'Apri menu' }).click();
      await page.getByRole('button', { name: 'Chi Sono', exact: true }).click();
      await expect(page).toHaveURL(/\/about$/);
      await page.goto(base + '/');
      await page.waitForLoadState('networkidle');
    }
    await page.screenshot({ path: `.tools/screenshots/noir-home-${viewport.width}.png` });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.locator('.noir-stage').evaluate(stage => getComputedStyle(stage).position)).toBe('relative');
  const sizes = await page.locator('.noir-scene').evaluate(scene => ({ scene: scene.offsetHeight, stage: scene.querySelector('.noir-stage').offsetHeight }));
  assert.equal(sizes.scene, sizes.stage, 'Reduced motion has no long scroll spacer');
  assert.equal(await page.locator('.noir-frame').last().evaluate(frame => getComputedStyle(frame).opacity), '1');
  await page.screenshot({ path: '.tools/screenshots/noir-home-reduced-motion.png' });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 844, height: 390 });
  assert.equal(await page.locator('.noir-stage').evaluate(stage => getComputedStyle(stage).position), 'relative', 'Short landscape uses a readable static scene');
  assert.deepEqual(errors, [], 'No browser errors');
  assert.deepEqual(external, [], 'No requests to external assets, fonts or services');
  console.log('Home OK: desktop, 2 mobile sizes, reversible pinned animation, skip/focus, projects, mobile menu, reduced motion, landscape and local-only resources.');
} finally {
  await browser.close();
}
