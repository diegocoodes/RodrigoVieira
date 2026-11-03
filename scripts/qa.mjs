import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const baseURL = process.env.QA_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch({ channel: process.env.QA_BROWSER || 'msedge', headless: true });
const errors = [];
const results = [];
const sections = ['#programa', '#acompanhamento', '#imersao', '#para-quem'];
const topics = ['Estruturação de equipe', 'Missão e visão', 'Plano de negócio', 'Modelos de contratos', 'Gerenciamento de conflitos', 'Lei do Inquilinato', 'Estratégia de captação', 'Ganhos além da taxa', 'Sistemas para locação'];
await mkdir('artifacts', { recursive: true });
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(baseURL)) errors.push(`${response.status()} ${response.url()}`); });
  for (const width of [320, 360, 390, 700, 768, 900, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('main').evaluate(el => getComputedStyle(el, '::before').content), 'none', 'Sem moldura vertical no corpo');
    assert.equal(await page.locator('.ambient-streak, .program-orbit, .program-horizon').count(), 0);
    const portrait = await page.locator('.hero-photo').boundingBox();
    assert.ok(Math.abs(portrait.x + portrait.width / 2 - width / 2) < 2, `Retrato centralizado em ${width}`);
    const delivery = await page.locator('.delivery-card').all();
    const first = await delivery[0].boundingBox();
    const second = await delivery[1].boundingBox();
    if (width > 700) assert.ok(Math.abs(first.y - second.y) < 2, 'Acompanhamento e imersão lado a lado');
    else assert.ok(second.y > first.y + first.height, 'Cards empilhados no celular');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow em ${width}`);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.ticker-set').first().locator(':scope > span').count(), 12);
    assert.equal(await page.locator('[data-text-state="pending"]').count(), 0, 'Texto legível com movimento reduzido');
    assert.equal(await page.locator('.motion-toggle, .program-details, .site-intro[open]').count(), 0);
    for (const selector of sections) assert.equal(await page.locator(selector).isVisible(), true);
    assert.equal(await page.locator('.program-card').count(), 6);
    for (const card of await page.locator('.program-card').all()) assert.equal(await card.isVisible(), true);
    assert.equal(await page.locator('.faq-item').first().isVisible(), true);
    if (width >= 700) assert.equal(await page.locator('.program-cards-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), 3);
    results.push({ viewport: width, overflow: false, programCards: 6 });
    if (width === 390 || width === 1440) {
      await page.locator('.mentor-image').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `artifacts/${width === 390 ? 'mobile' : 'desktop'}.png`, fullPage: true });
    }
  }
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto(baseURL);
  const cards = page.locator('.program-card');
  for (const card of await cards.all()) {
    await card.locator('summary').click();
    assert.equal(await card.getAttribute('open'), '');
    await card.locator('.program-card-content').waitFor({ state: 'visible' });
    await card.locator('summary').press('Enter');
    assert.equal(await card.getAttribute('open'), null);
  }
  for (const card of await cards.all()) await card.locator('summary').click();
  for (const topic of topics) assert.equal(await page.locator('#programa').getByRole('heading', { name: topic, exact: true }).isVisible(), true);
  results.push({ program: 'seis cards por mouse e teclado, nove assuntos preservados' });
  for (const detail of await page.locator('.faq-item').all()) {
    await detail.locator('summary').click();
    assert.equal(await detail.getAttribute('open'), '');
    await detail.locator('summary').press('Enter');
    assert.equal(await detail.getAttribute('open'), null);
  }
  results.push({ faq: 'seis respostas por mouse e teclado' });
  const anchors = await page.locator('a[href^="#"]').evaluateAll(els => els.map(el => el.getAttribute('href')));
  for (const anchor of anchors) assert.equal(await page.locator(anchor).count(), 1);
  const links = await page.locator('a[href^="https://wa.me/"]').evaluateAll(els => els.map(el => el.href));
  for (const href of links) { const url = new URL(href); assert.equal(url.pathname, '/558192017793'); assert.ok(url.searchParams.get('text')?.startsWith('Olá!')); }
  results.push({ whatsapp: links.length, anchors: 'todos os destinos válidos' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL);
  const menu = page.locator('.menu-toggle');
  await menu.click();
  await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  assert.equal(await menu.evaluate(el => el === document.activeElement), true);
  await menu.click();
  await page.locator('#main-navigation').getByRole('link', { name: 'O programa', exact: true }).click();
  await page.waitForURL('**/#programa');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  assert.deepEqual(errors, []);
  results.push({ menu: 'navegação, Escape e foco aprovados' });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto(baseURL);
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    await writeFile(`artifacts/accessibility-${width}.json`, JSON.stringify(audit.violations, null, 2));
    assert.deepEqual(audit.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })), []);
    results.push({ accessibility: width, violations: 0 });
  }
  const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await noJS.goto(baseURL);
  assert.equal(await noJS.locator('.site-intro').isVisible(), false);
  for (const card of await noJS.locator('.program-card').all()) await card.locator('summary').click();
  for (const topic of topics) assert.equal(await noJS.locator('#programa').getByRole('heading', { name: topic, exact: true }).isVisible(), true);
  await noJS.close();
  results.push({ noJavaScript: 'página acessível e nove assuntos disponíveis' });

  const motionContext = await browser.newContext({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 950 } });
  const motionPage = await motionContext.newPage();
  const motionErrors = [];
  motionPage.on('pageerror', error => motionErrors.push(error.message));
  motionPage.on('console', message => { if (message.type() === 'error') motionErrors.push(message.text()); });
  await motionPage.goto(baseURL, { waitUntil: 'domcontentloaded' });
  const intro = motionPage.locator('.site-intro');
  await intro.waitFor({ state: 'visible' });
  assert.equal(await intro.getByText('Rodrigo Vieira', { exact: true }).count(), 1);
  assert.equal(await motionPage.locator('#hero-title [data-text-state="visible"]').count(), 0, 'Títulos aguardam a introdução');
  await motionPage.locator('.vapour-text[data-canvas-ready="true"]').waitFor();
  assert.equal(await motionPage.evaluate(() => document.documentElement.style.overflow), 'hidden');
  await intro.waitFor({ state: 'hidden', timeout: 5000 });
  assert.notEqual(await motionPage.evaluate(() => document.documentElement.style.overflow), 'hidden');
  assert.equal(await intro.locator('canvas').count(), 0);
  results.push({ entry: 'Rodrigo Vieira vaporiza uma vez, encerra e libera a navegação' });
  await motionPage.waitForFunction(() => [...document.querySelectorAll('#hero-title [data-text-reveal]')].every(el => el.dataset.textState === 'visible'));
  await motionPage.waitForFunction(() => [...document.querySelectorAll('#hero-title .animated-word')].every(el => getComputedStyle(el).opacity === '1'));
  const tickerMotion = await motionPage.locator('.ticker-inner').evaluate(el => {
    const animation = el.getAnimations()[0];
    animation.pause();
    animation.currentTime = 1000;
    const first = new DOMMatrix(getComputedStyle(el).transform).m41;
    animation.currentTime = 2000;
    const second = new DOMMatrix(getComputedStyle(el).transform).m41;
    animation.play();
    return { first, second };
  });
  assert.ok(tickerMotion.second > tickerMotion.first, 'Faixa move para a direita');
  assert.notEqual(await motionPage.locator('.ambient-gradient').evaluate(el => getComputedStyle(el).animationName), 'none');
  assert.equal(await motionPage.locator('#programa [data-text-reveal]').first().getAttribute('data-text-state'), 'pending');
  await motionPage.locator('#program-title').scrollIntoViewIfNeeded();
  await motionPage.waitForFunction(() => [...document.querySelectorAll('#program-title [data-text-reveal]')].every(el => el.dataset.textState === 'visible'));
  await motionPage.waitForFunction(() => [...document.querySelectorAll('#program-title .animated-word')].every(el => getComputedStyle(el).opacity === '1'));
  results.push({ motion: '12 temas na faixa para a direita, títulos após a entrada e no scroll, degradê animado' });
  await motionPage.reload({ waitUntil: 'domcontentloaded' });
  await intro.waitFor({ state: 'visible' });
  await motionPage.keyboard.press('Escape');
  await intro.waitFor({ state: 'hidden' });
  await motionPage.reload({ waitUntil: 'domcontentloaded' });
  await intro.waitFor({ state: 'visible' });
  await intro.getByRole('button', { name: 'Entrar no site' }).click();
  await intro.waitFor({ state: 'hidden' });
  await motionPage.reload({ waitUntil: 'domcontentloaded' });
  await intro.waitFor({ state: 'visible' });
  await motionPage.emulateMedia({ reducedMotion: 'reduce' });
  await intro.waitFor({ state: 'hidden' });
  assert.equal(await intro.locator('canvas').count(), 0);
  const staticEffects = await motionPage.locator('.ticker-inner, .spotlight-21st, .ambient-gradient, .ambient-wash, .ambient-halo, .animated-word').evaluateAll(els => els.map(el => getComputedStyle(el).animationName));
  assert.ok(staticEffects.every(name => name === 'none'));
  assert.ok(await motionPage.locator('.animated-word').evaluateAll(els => els.every(el => getComputedStyle(el).opacity === '1')));
  await motionPage.emulateMedia({ reducedMotion: 'no-preference' });
  assert.equal(await intro.isVisible(), false);
  assert.deepEqual(motionErrors, []);
  await motionContext.close();
  results.push({ entryControls: 'Escape, entrada direta e movimento reduzido aprovados, sem erros' });
  await writeFile('artifacts/qa-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
