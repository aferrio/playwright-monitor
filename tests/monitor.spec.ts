import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';

let browser: Browser;
let context: BrowserContext;
let page: Page;

test.beforeEach(async () => {
  console.log("⏱ Setup test:", new Date().toISOString());
  
  // Lancia Chromium con parametri per bypassare protezioni CDN/bot
  browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
      '--disable-client-side-phishing-detection',
      '--disable-crash-reporter',
      '--disable-oopr-debug-crash-dump',
      '--no-crash-upload',
      '--disable-low-res-tiling',
      '--disable-extensions',
      '--disable-default-apps'
    ]
  });

  // Crea un context con stealth mode
  context = await browser.newContext({
    ignoreHTTPSErrors: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    extraHTTPHeaders: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1'
    },
    viewport: { width: 1366, height: 768 },
    locale: 'nl-NL',
    timezoneId: 'Europe/Amsterdam'
  });

  page = await context.newPage();
  
  // Nascondi il fatto che siamo Playwright
  await page.addInitScript(() => {
    // Rimuovi webdriver property
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    });
    
    // Modifica la property chrome per sembrare un vero Chrome
    Object.defineProperty(navigator, 'chrome', {
      get: () => ({
        runtime: {},
      }),
    });
    
    // Override plugins
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
    });
    
    // Override languages
    Object.defineProperty(navigator, 'languages', {
      get: () => ['nl-NL', 'nl', 'en'],
    });
  });
  
  // Timeout più lunghi
  page.setDefaultNavigationTimeout(60000);
  page.setDefaultTimeout(45000);
});

test.afterEach(async () => {
  if (browser) {
    await browser.close();
  }
});

test('has title', async () => {
  console.log("⏱ Esecuzione test:", new Date().toISOString());

  try {
    // Prima prova con un sito semplice per testare la connessione
    console.log("🧪 Test connessione con httpbin.org...");
    await page.goto('https://httpbin.org/ip', {
      waitUntil: 'load',
      timeout: 15000
    });
    console.log("✅ Connessione base OK");
    
    // Ora prova il sito target
    console.log("🎯 Navigando verso trekpleister...");
    await page.goto('https://www.trekpleister.nl', {
      waitUntil: 'commit',
      timeout: 45000
    });
    
    // Aspetta un po' e poi controlla il titolo
    await page.waitForTimeout(5000);

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Trekpleister | Homepage/)
    
  } catch (error) {
    console.error("❌ Errore nel test title:", error);
    // Prova strategia alternativa
    console.log("🔄 Tentativo con strategia alternativa...");
    await page.goto('https://www.trekpleister.nl', {
      waitUntil: 'load',
      timeout: 60000
    });
    await page.waitForTimeout(3000);
    await expect(page).toHaveTitle(/Trekpleister | Homepage/)
  }
});

test('Controlla contenuto su trekpleister.nl', async () => {
  console.log("⏱ Esecuzione test:", new Date().toISOString());

  let retries = 3;
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Tentativo ${i + 1}/${retries}`);
      
      // Prima prova a navigare senza aspettare il caricamento completo
      if (i === 0) {
        await page.goto('https://www.trekpleister.nl', {
          waitUntil: 'commit', // Solo aspetta che la navigazione inizi
          timeout: 30000
        });
        await page.waitForTimeout(5000); // Aspetta 5 secondi
      } else {
        // Negli altri tentativi usa strategia più aggressiva
        await page.goto('https://www.trekpleister.nl', {
          waitUntil: 'load',
          timeout: 60000
        });
        await page.waitForTimeout(3000);
      }

      // Prova a aspettare che ci sia del contenuto nel body
      await page.waitForSelector('body', { timeout: 10000 });

      // Leggi tutto il contenuto del body
      const body = await page.textContent('body');

      if (!body) {
        throw new Error('Body vuoto o non trovato');
      }

      // Verifica che il testo sia presente
      expect(body?.includes('Uit onze folder')).toBeTruthy();

      console.log("✔ Test OK: testo trovato");
      return; // Uscita dal loop se il test ha successo

    } catch (error) {
      lastError = error;
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Tentativo ${i + 1} fallito:`, errorMessage);
      
      if (i < retries - 1) {
        console.log("⏳ Aspetto 5 secondi prima del prossimo tentativo...");
        // Prova a ricaricare la pagina se non è il primo tentativo
        if (i > 0) {
          try {
            await page.reload({ waitUntil: 'commit', timeout: 15000 });
          } catch (reloadError) {
            console.log("Reload fallito, continuo con nuovo goto");
          }
        }
        await page.waitForTimeout(5000);
      }
    }
  }

  // Se arriviamo qui, tutti i tentativi sono falliti
  console.error("❌ Test FALLITO dopo tutti i tentativi:", lastError);
  throw lastError; // permette a GitHub Actions di rilevare il fallimento e inviare Telegram
});
