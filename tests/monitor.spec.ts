import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';

let browser: Browser;
let context: BrowserContext;
let page: Page;

test.beforeEach(async () => {
  console.log("⏱ Setup test:", new Date().toISOString());
  
  // Lancia Chromium con parametri ottimizzati per CDN
  browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-http2',
      '--disable-web-security',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--ignore-certificate-errors',
      '--ignore-ssl-errors',
      '--ignore-certificate-errors-spki-list',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection'
    ]
  });

  // Crea un context con configurazioni per CDN
  context = await browser.newContext({
    ignoreHTTPSErrors: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    extraHTTPHeaders: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    },
    viewport: { width: 1920, height: 1080 }
  });

  page = await context.newPage();
  
  // Imposta timeout di navigazione più lungo per CDN
  page.setDefaultNavigationTimeout(45000);
  page.setDefaultTimeout(30000);
});

test.afterEach(async () => {
  if (browser) {
    await browser.close();
  }
});

test('has title', async () => {
  console.log("⏱ Esecuzione test:", new Date().toISOString());

  // Naviga verso il sito con strategia per CDN
  await page.goto('https://www.trekpleister.nl', {
    waitUntil: 'networkidle', // Aspetta che la rete sia inattiva (importante per CDN)
    timeout: 45000
  });

  // Aspetta un po' per assicurarsi che la CDN abbia caricato tutto
  await page.waitForTimeout(2000);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Trekpleister | Homepage/)
});

test('Controlla contenuto su trekpleister.nl', async () => {
  console.log("⏱ Esecuzione test:", new Date().toISOString());

  let retries = 3;
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Tentativo ${i + 1}/${retries}`);
      
      // Naviga verso il sito con strategia ottimizzata per CDN
      await page.goto('https://www.trekpleister.nl', {
        waitUntil: 'networkidle', // Aspetta che tutti i request di rete siano completati
        timeout: 45000 // Timeout più lungo per CDN lente
      });

      // Aspetta che la CDN abbia completato il caricamento
      await page.waitForTimeout(3000);

      // Leggi tutto il contenuto del body
      const body = await page.textContent('body');

      // Verifica che il testo sia presente
      expect(body?.includes('Uit onze folder')).toBeTruthy();

      console.log("✔ Test OK: testo trovato");
      return; // Uscita dal loop se il test ha successo

    } catch (error) {
      lastError = error;
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Tentativo ${i + 1} fallito:`, errorMessage);
      
      if (i < retries - 1) {
        console.log("⏳ Aspetto 2 secondi prima del prossimo tentativo...");
        await page.waitForTimeout(2000);
      }
    }
  }

  // Se arriviamo qui, tutti i tentativi sono falliti
  console.error("❌ Test FALLITO dopo tutti i tentativi:", lastError);
  throw lastError; // permette a GitHub Actions di rilevare il fallimento e inviare Telegram
});
