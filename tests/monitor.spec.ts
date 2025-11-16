import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';

let browser: Browser;
let context: BrowserContext;
let page: Page;

test.beforeEach(async () => {
  console.log("⏱ Setup test:", new Date().toISOString());
  
  // Lancia Chromium con HTTP/2 disabilitato
  browser = await chromium.launch({
    headless: true,
    args: ['--disable-http2']
  });

  // Crea un context ignorando errori SSL
  context = await browser.newContext({
    ignoreHTTPSErrors: true
  });

  page = await context.newPage();
});

test.afterEach(async () => {
  if (browser) {
    await browser.close();
  }
});

test('has title', async () => {
  console.log("⏱ Esecuzione test:", new Date().toISOString());

  // Naviga verso il sito
  await page.goto('https://www.trekpleister.nl', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Trekpleister | Homepage/)
});

test('Controlla contenuto su trekpleister.nl', async () => {
  console.log("⏱ Esecuzione test:", new Date().toISOString());

  try {
    // Naviga verso il sito
    await page.goto('https://www.trekpleister.nl', {
      waitUntil: 'domcontentloaded',
      timeout: 60000 // 60 secondi
    });

    // Leggi tutto il contenuto del body
    const body = await page.textContent('body');

    // Verifica che il testo sia presente
    expect(body?.includes('Uit onze folder')).toBeTruthy();

    console.log("✔ Test OK: testo trovato");

  } catch (error) {
    console.error("❌ Test FALLITO:", error);
    throw error; // permette a GitHub Actions di rilevare il fallimento e inviare Telegram
  }
});
