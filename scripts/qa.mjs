import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const baseURL = process.env.QA_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch({ channel: process.env.QA_BROWSER || 'msedge', headless: true });
const errors = [];
const results = [];
const sections = ['#programa', '#acompanhamento', '#imersao', '#para-quem', '#feedbacks'];
const whatsappGroupURL = 'https://chat.whatsapp.com/LmII1YduewFGVAvKpfpuU3?s=cl&p=a&iam=2';
const topics = ['Estruturação de equipe', 'Missão e visão', 'Plano de negócio', 'Modelos de contratos', 'Gerenciamento de conflitos', 'Lei do Inquilinato', 'Estratégia de captação', 'Ganhos além da taxa', 'Sistemas para locação'];
await mkdir('artifacts', { recursive: true });
async function dismissWelcome(page) {
  await page.waitForFunction(() => {
    const entry = document.querySelector('[data-site-entry]');
    return entry && ['video', 'done'].includes(entry.dataset.entryStage);
  });
  assert.equal(await page.locator('.site-intro, .vapour-text').count(), 0, 'Sem animação de entrada');
  const modal = page.locator('.welcome-video-modal');
  if (await modal.count()) {
    await modal.waitFor({ state: 'visible' });
    const box = await modal.boundingBox();
    const viewport = page.viewportSize();
    assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.width <= viewport.width && box.y + box.height <= viewport.height, 'Modal cabe inteiro na tela');
    const mediaBox = await modal.locator('video').boundingBox();
    const cta = modal.getByRole('link', { name: 'Entrar na mentoria', exact: true });
    const ctaBox = await cta.boundingBox();
    assert.ok(ctaBox.y >= mediaBox.y + mediaBox.height, 'Botão abaixo do vídeo');
    assert.equal(await cta.getAttribute('href'), whatsappGroupURL);
    assert.equal(await modal.getByRole('button').count(), 2, 'Play com som e X no vídeo');
    assert.equal(await modal.locator('video').evaluate(el => el.paused && el.currentTime === 0), true, 'Vídeo aguarda o clique em play');
    assert.equal(await modal.getByRole('button', { name: 'Reproduzir vídeo com som' }).isVisible(), true);
    assert.equal(await modal.locator('video').getAttribute('controls'), null);
    await modal.getByRole('button', { name: 'Fechar vídeo' }).click();
    await modal.waitFor({ state: 'detached' });
  }
}
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  // Keep the real bootstrap and inspect its queue without sending test visits to Meta.
  await context.route('https://connect.facebook.net/**', route => route.fulfill({ contentType: 'application/javascript', body: '' }));
  context.setDefaultTimeout(15000);
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(baseURL)) errors.push(`${response.status()} ${response.url()}`); });
  for (const width of [320, 360, 390, 700, 768, 900, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    await dismissWelcome(page);
    await page.waitForFunction(() => typeof window.fbq === 'function');
    assert.deepEqual(await page.evaluate(() => window.fbq.queue.map(args => Array.from(args))), [
      ['init', '1615223779888343'], ['track', 'PageView'],
    ], 'Pixel inicializa uma vez e registra um PageView por carregamento');
    console.log(`Conferindo layout em ${width}px`);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('main').evaluate(el => getComputedStyle(el, '::before').content), 'none', 'Sem moldura vertical no corpo');
    assert.equal(await page.locator('.ambient-streak, .program-orbit, .program-horizon').count(), 0);
    const portrait = await page.locator('.hero-photo').boundingBox();
    assert.ok(Math.abs(portrait.x + portrait.width / 2 - width / 2) < 2, `Retrato original centralizado em ${width}`);
    assert.equal(await page.locator('#inicio video').count(), 0, 'Hero original com foto');
    const introHeading = await page.locator('.intro-heading').boundingBox();
    const introCopy = await page.locator('.intro-copy').boundingBox();
    if (width > 700) assert.ok(introCopy.x > introHeading.x + introHeading.width, 'Título à esquerda e informações à direita');
    else assert.ok(introCopy.y >= introHeading.y + introHeading.height, 'Informações abaixo do título no celular');
    assert.equal(await page.locator('.intro-copy p').count(), 2, 'Textos da proposta preservados');
    for (const video of await page.locator('video').all()) {
      const box = await video.boundingBox();
      assert.ok(Math.abs(box.width / box.height - 9 / 16) < 0.01, 'Vídeos verticais sem corte');
      assert.equal(await video.getAttribute('preload'), 'none');
      assert.equal(await video.getAttribute('autoplay'), null);
      assert.ok(await video.getAttribute('poster'));
    }
    assert.equal(await page.locator('video').count(), 1);
    assert.equal(await page.locator('.feedback-card').count(), 3);
    assert.equal(await page.getByText('Exemplo fictício', { exact: true }).count(), 3);
    const audienceHeading = await page.locator('#audience-title').boundingBox();
    const audienceVideo = await page.locator('.audience-video').boundingBox();
    const audienceCards = await page.locator('.audience-cards').boundingBox();
    assert.ok(audienceVideo.y >= audienceHeading.y + audienceHeading.height, 'PORTUGAL_V04 abaixo do título');
    assert.ok(audienceCards.y >= audienceVideo.y + audienceVideo.height, 'Vídeo antes dos cards de identificação');
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
    results.push({ viewport: width, overflow: false, programCards: 6, welcomeModal: 'cabe inteiro na tela', hero: 'retrato original', proposal: width > 700 ? 'duas colunas' : 'empilhada', illustrativeFeedbacks: 3 });
    if (width === 390 || width === 1440) {
      await page.locator('.mentor-image').scrollIntoViewIfNeeded();
      await page.locator('#feedbacks').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `artifacts/${width === 390 ? 'mobile' : 'desktop'}.png`, fullPage: true });
    }
  }
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  await dismissWelcome(page);
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
  const links = await page.locator('a[href*="whatsapp.com"], a[href*="wa.me"]').evaluateAll(els => els.map(el => el.href));
  assert.equal(links.length, 8, 'Todos os oito CTAs de WhatsApp presentes');
  for (const href of links) assert.equal(href, whatsappGroupURL);
  results.push({ whatsapp: links.length, anchors: 'todos os destinos válidos' });
  for (const video of await page.locator('video').all()) {
    const source = await video.locator('source').getAttribute('src');
    const mediaResponse = await page.request.get(new URL(source, baseURL).href, { headers: { Range: 'bytes=0-1023' } });
    assert.equal(mediaResponse.status(), 206, 'Entrega parcial para reprodução e busca');
    assert.equal(mediaResponse.headers()['content-type'], 'video/mp4');
    assert.equal((await mediaResponse.body()).length, 1024);
    await video.scrollIntoViewIfNeeded();
    await video.locator('..').getByRole('button', { name: /^Assistir ao vídeo:/ }).click();
    await video.locator('..').locator('.video-cover').waitFor({ state: 'detached' });
    const playback = await video.evaluate(async el => {
      await el.play();
      el.pause();
      await new Promise((resolve, reject) => {
        el.addEventListener('seeked', resolve, { once: true });
        el.addEventListener('error', () => reject(new Error('Falha no vídeo')), { once: true });
        el.currentTime = 2;
      });
      return { width: el.videoWidth, height: el.videoHeight, seconds: el.duration, time: el.currentTime };
    });
    assert.equal(playback.width, 1080);
    assert.equal(playback.height, 1920);
    assert.ok(playback.seconds > 28);
    assert.equal(playback.time, 2);
  }
  results.push({ audienceVideo: 'PORTUGAL_V04 reproduz e permite busca; entrega parcial válida' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  await dismissWelcome(page);
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
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    await dismissWelcome(page);
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    await writeFile(`artifacts/accessibility-${width}.json`, JSON.stringify(audit.violations, null, 2));
    assert.deepEqual(audit.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })), []);
    results.push({ accessibility: width, violations: 0 });
  }
  const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const fallbackRequests = [];
  await noJS.route('https://www.facebook.com/tr**', route => {
    fallbackRequests.push(route.request().url());
    return route.fulfill({ status: 204 });
  });
  await noJS.goto(baseURL);
  assert.deepEqual(fallbackRequests, ['https://www.facebook.com/tr?id=1615223779888343&ev=PageView&noscript=1']);
  assert.equal(await noJS.locator('.site-intro').isVisible(), false);
  assert.equal(await noJS.locator('.welcome-video-modal').count(), 0, 'Sem modal bloqueando a página sem JavaScript');
  for (const video of await noJS.locator('video').all()) {
    assert.equal(await video.getAttribute('controls'), '');
    assert.equal(await video.locator('..').locator('.video-cover').isVisible(), false, 'Player nativo acessível sem JavaScript');
  }
  for (const card of await noJS.locator('.program-card').all()) await card.locator('summary').click();
  for (const topic of topics) assert.equal(await noJS.locator('#programa').getByRole('heading', { name: topic, exact: true }).isVisible(), true);
  await noJS.close();
  results.push({ noJavaScript: 'página acessível e nove assuntos disponíveis' });
  results.push({ metaPixel: '1615223779888343; um PageView por carregamento; fallback sem JavaScript aprovado; visitas de teste interceptadas' });

  const motionContext = await browser.newContext({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 950 } });
  await motionContext.route('https://connect.facebook.net/**', route => route.fulfill({ contentType: 'application/javascript', body: '' }));
  motionContext.setDefaultTimeout(15000);
  const motionPage = await motionContext.newPage();
  const motionErrors = [];
  motionPage.on('pageerror', error => motionErrors.push(error.message));
  motionPage.on('console', message => { if (message.type() === 'error') motionErrors.push(message.text()); });
  await motionPage.goto(baseURL, { waitUntil: 'domcontentloaded' });
  const intro = motionPage.locator('.site-intro');
  assert.equal(await intro.count(), 0, 'Abertura em partículas removida');
  const welcome = motionPage.locator('.welcome-video-modal');
  await welcome.waitFor({ state: 'visible' });
  assert.equal(await motionPage.evaluate(() => document.documentElement.style.overflow), 'hidden');
  assert.equal(await motionPage.locator('#hero-title [data-text-state="visible"]').count(), 0, 'Títulos aguardam o fechamento do vídeo');
  const welcomeVideo = welcome.locator('video');
  const welcomeMedia = await welcomeVideo.elementHandle();
  assert.equal(await welcomeVideo.getAttribute('controls'), null);
  assert.equal(await welcomeVideo.getAttribute('autoplay'), null);
  assert.equal(await welcomeVideo.getAttribute('preload'), 'none');
  assert.equal(await welcomeVideo.evaluate(el => el.paused && el.currentTime === 0), true);
  const playWelcome = welcome.getByRole('button', { name: 'Reproduzir vídeo com som' });
  await playWelcome.press('Enter');
  await motionPage.waitForFunction(() => document.querySelector('.welcome-video-modal video')?.currentTime > 0);
  assert.equal(await welcomeVideo.evaluate(el => !el.muted && el.volume === 1 && !el.paused), true, 'Clique em play inicia o vídeo com som');
  await motionPage.waitForFunction(() => document.querySelector('.welcome-video-modal video')?.webkitAudioDecodedByteCount > 0);
  assert.equal(await playWelcome.count(), 0, 'Botão de play desaparece durante a reprodução');
  assert.equal(await welcomeVideo.evaluate(el => el.videoWidth), 1080);
  assert.equal(await welcomeVideo.evaluate(el => el.videoHeight), 1920);
  const welcomeSource = await welcomeVideo.getAttribute('src');
  const welcomeResponse = await motionPage.request.get(new URL(welcomeSource, baseURL).href, { headers: { Range: 'bytes=0-1023' } });
  assert.equal(welcomeResponse.status(), 206);
  assert.notEqual(await welcome.locator('.video-frame-animated').evaluate(el => getComputedStyle(el, '::before').animationName), 'none', 'Borda dourada animada');
  const welcomeAudit = await new AxeBuilder({ page: motionPage }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  assert.deepEqual(welcomeAudit.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), []);
  const closeWelcome = welcome.getByRole('button', { name: 'Fechar vídeo' });
  await closeWelcome.focus();
  await motionPage.keyboard.press('Tab');
  assert.equal(await welcome.getByRole('link', { name: 'Entrar na mentoria', exact: true }).evaluate(el => el === document.activeElement), true);
  await motionPage.keyboard.press('Tab');
  assert.equal(await welcome.evaluate(el => document.activeElement === document.body || el.contains(document.activeElement)), true, 'Tab não alcança a página atrás do modal');
  // Chromium can visit browser chrome between the last and first dialog action.
  if (await motionPage.evaluate(() => document.activeElement === document.body)) await motionPage.keyboard.press('Tab');
  assert.equal(await closeWelcome.evaluate(el => el === document.activeElement), true, 'Tab retorna ao X do modal');
  await motionPage.keyboard.press('Escape');
  await welcome.waitFor({ state: 'detached' });
  assert.equal(await welcomeMedia.evaluate(el => el.paused), true, 'Fechar interrompe a reprodução');
  assert.notEqual(await motionPage.evaluate(() => document.documentElement.style.overflow), 'hidden');
  assert.equal(await motionPage.locator('.hero-actions .button').evaluate(el => el === document.activeElement), true, 'Foco volta à mentoria');
  results.push({ entry: 'Modal direto, sem animação de entrada → vídeo com som → hero com foto; áudio decodificado, Escape, pausa, foco e acessibilidade aprovados' });
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
  await welcome.waitFor({ state: 'visible' });
  await motionPage.keyboard.press('Escape');
  await welcome.waitFor({ state: 'detached' });
  assert.equal(await motionPage.locator('[data-site-entry]').getAttribute('data-entry-stage'), 'done');
  await motionPage.reload({ waitUntil: 'domcontentloaded' });
  await welcome.waitFor({ state: 'visible' });
  const join = welcome.getByRole('link', { name: 'Entrar na mentoria', exact: true });
  assert.equal(await join.getAttribute('href'), whatsappGroupURL);
  await join.evaluate(el => el.addEventListener('click', event => event.preventDefault(), { once: true }));
  await join.click();
  await welcome.waitFor({ state: 'detached' });
  await motionPage.reload({ waitUntil: 'domcontentloaded' });
  await welcome.waitFor({ state: 'visible' });
  await motionPage.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await intro.count(), 0);
  await welcome.waitFor({ state: 'visible' });
  assert.equal(await welcome.locator('.video-frame-animated').evaluate(el => getComputedStyle(el, '::before').animationName), 'none', 'Borda estática com movimento reduzido');
  await dismissWelcome(motionPage);
  const staticEffects = await motionPage.locator('.ticker-inner, .spotlight-21st, .ambient-gradient, .ambient-wash, .ambient-halo, .animated-word').evaluateAll(els => els.map(el => getComputedStyle(el).animationName));
  assert.ok(staticEffects.every(name => name === 'none'));
  assert.ok(await motionPage.locator('.animated-word').evaluateAll(els => els.every(el => getComputedStyle(el).opacity === '1')));
  await motionPage.emulateMedia({ reducedMotion: 'no-preference' });
  assert.equal(await intro.isVisible(), false);
  assert.deepEqual(motionErrors, []);
  await motionContext.close();
  const deepLink = await browser.newPage({ reducedMotion: 'no-preference' });
  await deepLink.route('https://connect.facebook.net/**', route => route.fulfill({ contentType: 'application/javascript', body: '' }));
  await deepLink.goto(`${baseURL}/#programa`);
  await deepLink.waitForFunction(() => document.querySelector('[data-site-entry]')?.dataset.entryStage === 'done');
  assert.equal(await deepLink.locator('.site-intro[open], .welcome-video-modal').count(), 0, 'Links diretos preservam a navegação para a seção');
  await deepLink.close();
  results.push({ entryControls: 'X, Escape, CTA para o grupo, movimento reduzido e links diretos aprovados, sem erros' });
  await writeFile('artifacts/qa-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
