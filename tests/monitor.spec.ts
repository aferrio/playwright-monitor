import { test, expect, chromium } from '@playwright/test';

test('Controlla contenuto su trekpleister.nl', async () => {
  console.log("⏱ Esecuzione test:", new Date().toISOString());

  // Lancia Chromium con HTTP/2 disabilitato
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-http2']
  });

  // Crea un context ignorando errori SSL
  const context = await browser.newContext({
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

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
  } finally {
    await browser.close();
  }
});
