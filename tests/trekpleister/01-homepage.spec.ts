import { test, expect } from '@playwright/test';
import { SITES_CONFIG, TIMEOUTS, TEST_URLS } from '../../config/sites.config';
import { TestReportManager } from '../../utils/testReportManager';
import { CookieHelper } from '../../utils/cookieHelper';

const siteConfig = SITES_CONFIG.TREKPLEISTER;
const reportManager = TestReportManager.getInstance();

test.describe(`${siteConfig.name} Tests`, () => {
  test.beforeEach(async ({ page }) => {
    console.log(`🔧 Setup per ${siteConfig.name}...`);
    
    // Naviga al sito target
    console.log(`🎯 Navigando verso ${siteConfig.name}...`);
    await page.goto(siteConfig.url, {
      waitUntil: 'commit',
      timeout: TIMEOUTS.NAVIGATION
    });
    
    // Gestisci cookie popup
    await CookieHelper.handleAllCookies(page, 'trekpleister');
    
    await page.waitForTimeout(TIMEOUTS.TREKPLEISTER_LOAD_DELAY);
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

    try {
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
      
    } catch (error) {
      console.error(`❌ Errore test contenuto ${siteConfig.name}:`, error);
      
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
  
  test(`Folder content check`, async ({ page }) => {
    console.log(`⏱ Test folder content:`, new Date().toISOString());
    const testName = `${siteConfig.name} - Folder content check`;

    try {
      // La pagina è già caricata dal beforeEach, verifica la presenza di "Uit onze folder"
      await page.waitForSelector('body', { timeout: TIMEOUTS.ELEMENT_WAIT });

      const body = await page.textContent('body');
      
      if (!body) {
        throw new Error('Body vuoto o non trovato');
      }

      const hasFolderContent = body.toLowerCase().includes('uit onze folder');

      if (!hasFolderContent) {
        throw new Error(`Testo "Uit onze folder" non trovato nella homepage`);
      }

      console.log(`✅ Test folder content ${siteConfig.name} - OK`);
      
      // Registra successo
      reportManager.addTestResult({
        testName,
        siteUrl: siteConfig.url,
        status: 'passed',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error(`❌ Errore test folder content ${siteConfig.name}:`, error);
      
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
});