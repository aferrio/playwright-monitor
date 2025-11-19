import { test, expect } from '@playwright/test';
import { SITES_CONFIG, TIMEOUTS } from '../../config/sites.config';
import { TestReportManager } from '../../utils/testReportManager';
import { CookieHelper } from '../../utils/cookieHelper';

const siteConfig = SITES_CONFIG.KRUIDVAT_NL;
const reportManager = TestReportManager.getInstance();

test.describe(`${siteConfig.name} Tests`, () => {
  test.beforeEach(async ({ page }) => {
    console.log(`🔧 Setup per ${siteConfig.name}...`);
    
    // Naviga al sito
    await page.goto(siteConfig.url, {
      waitUntil: 'commit',
      timeout: TIMEOUTS.NAVIGATION
    });

    // Gestisci cookie popup
    await CookieHelper.handleAllCookies(page, 'kruidvat');
    
    await page.waitForTimeout(TIMEOUTS.PAGE_LOAD_DELAY);
    console.log(`✅ Setup completato per ${siteConfig.name}`);
  });

  test(`Homepage title`, async ({ page }) => {
    console.log(`⏱ Test homepage title:`, new Date().toISOString());
    const testName = `${siteConfig.name} - Homepage title`;

    try {
      await expect(page).toHaveTitle(siteConfig.titlePattern);
      
      console.log(`✅ Test ${siteConfig.name} homepage - OK`);
      
      // Registra successo
      reportManager.addTestResult({
        testName,
        siteUrl: siteConfig.url,
        status: 'passed',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error(`❌ Errore test ${siteConfig.name}:`, error);
      
      // Registra fallimento
      const errorMessage = error instanceof Error ? error.message : String(error);
      reportManager.addTestResult({
        testName,
        siteUrl: siteConfig.url,
        status: 'failed',
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  });
  
  test(`Homepage content check`, async ({ page }) => {
    console.log(`⏱ Test contenuto homepage:`, new Date().toISOString());
    const testName = `${siteConfig.name} - Homepage content check`;

    let retries = 3;
    let lastError;

    for (let i = 0; i < retries; i++) {
      try {
        console.log(`🔄 Tentativo ${i + 1}/${retries}`);
        
        // La pagina è già caricata dal beforeEach, verifica solo il contenuto
        await page.waitForSelector('body', { timeout: TIMEOUTS.ELEMENT_WAIT });

        const body = await page.textContent('body');
        
        if (!body) {
          throw new Error('Body vuoto o non trovato');
        }

        const hasExpectedContent = siteConfig.expectedContent.some(content => 
          body.toLowerCase().includes(content.toLowerCase())
        );

        if (!hasExpectedContent) {
          throw new Error(`Contenuto atteso non trovato. Contenuti cercati: ${siteConfig.expectedContent.join(', ')}`);
        }

        console.log(`✅ Test contenuto ${siteConfig.name} - OK`);
        
        // Registra successo
        reportManager.addTestResult({
          testName,
          siteUrl: siteConfig.url,
          status: 'passed',
          timestamp: new Date().toISOString()
        });
        
        return;

      } catch (error) {
        lastError = error;
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ Tentativo ${i + 1} fallito:`, errorMessage);
        
        if (i < retries - 1) {
          console.log("⏳ Aspetto 5 secondi prima del prossimo tentativo...");
          await page.waitForTimeout(TIMEOUTS.RETRY_DELAY);
        }
      }
    }

    // Se arriviamo qui, tutti i tentativi sono falliti
    console.error(`❌ Test contenuto ${siteConfig.name} FALLITO dopo tutti i tentativi:`, lastError);
    
    // Registra fallimento finale
    const finalErrorMessage = lastError instanceof Error ? lastError.message : String(lastError);
    reportManager.addTestResult({
      testName,
      siteUrl: siteConfig.url,
      status: 'failed',
      error: finalErrorMessage,
      timestamp: new Date().toISOString()
    });
    
    throw lastError;
  });
});