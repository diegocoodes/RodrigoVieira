import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ channel: process.env.QA_BROWSER || 'msedge' });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  await page.addInitScript(() => {
    window.qaCLS = 0;
    window.qaLCP = 0;
    new PerformanceObserver(list => list.getEntries().forEach(entry => {
      if (!entry.hadRecentInput) window.qaCLS += entry.value;
    })).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(list => {
      window.qaLCP = list.getEntries().at(-1).startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await page.goto(process.env.QA_URL || 'http://127.0.0.1:3000', { waitUntil: 'domcontentloaded' });
  await page.locator('.site-intro').waitFor({ state: 'hidden' });
  const welcome = page.locator('.welcome-video-modal');
  await welcome.waitFor({ state: 'visible' });
  await page.screenshot({ path: 'artifacts/welcome-video-desktop.png' });
  await welcome.getByRole('button', { name: 'Reproduzir vídeo com som' }).click();
  await page.waitForFunction(() => document.querySelector('.welcome-video-modal video')?.currentTime > 0);
  assert.equal(await welcome.locator('video').evaluate(el => !el.muted && el.volume === 1), true);
  await welcome.getByRole('button', { name: 'Fechar vídeo' }).click();
  await welcome.waitFor({ state: 'detached' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.getAnimations().filter(animation => Number.isFinite(animation.effect?.getComputedTiming().endTime)).every(animation => animation.playState === 'finished'));
  const initialLCP = await page.evaluate(() => window.qaLCP);
  await page.screenshot({ path: 'artifacts/hero-desktop.png' });
  for (const element of await page.locator('.reveal:visible').all()) {
    await element.scrollIntoViewIfNeeded();
    await page.waitForFunction(el => getComputedStyle(el).opacity === '1', await element.elementHandle());
    assert.equal(await element.evaluate(el => getComputedStyle(el).opacity), '1');
  }
  await page.locator('#mentor').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.mentor-image img').complete);
  await page.locator('.mentor-layout').screenshot({ path: 'artifacts/mentor-desktop.png' });
  await page.locator('.program-card-section').screenshot({ path: 'artifacts/program-desktop.png' });
  await page.locator('#mentoria').screenshot({ path: 'artifacts/audience-video-desktop.png' });
  await page.locator('#feedbacks').screenshot({ path: 'artifacts/feedback-desktop.png' });
  await page.locator('#proposta').screenshot({ path: 'artifacts/proposal-desktop.png' });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'artifacts/desktop.png', fullPage: true });
  const metrics = await page.evaluate(() => ({
    environment: 'Local desktop, no network or CPU throttling. Not field data.',
    CLS: window.qaCLS,
    LCP_ms: window.qaLCP,
    resources: performance.getEntriesByType('resource').map(entry => ({ name: entry.name.split('/').pop(), bytes: entry.transferSize })),
    metadata: {
      title: document.title,
      description: document.querySelector('meta[name=description]')?.content,
      ogImage: document.querySelector('meta[property="og:image"]')?.content,
    },
  }));
  metrics.LCP_ms = initialLCP;
  await writeFile('artifacts/local-metrics.json', JSON.stringify(metrics, null, 2));
  console.log(JSON.stringify(metrics, null, 2));
  console.log('Revelações verificadas com movimento normal.');
} finally {
  await browser.close();
}
