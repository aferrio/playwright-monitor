import { Page } from '@playwright/test';

/**
 * Selettori comuni per i popup dei cookie sui vari siti
 */
const COOKIE_SELECTORS = {
  // Selettori generici comuni
  generic: [
    '[data-testid="accept-cookies"]',
    '[data-testid="cookie-accept"]',
    'button[id*="cookie"][id*="accept"]',
    'button[class*="cookie"][class*="accept"]',
    'button:has-text("Accept")',
    'button:has-text("Accepteer")',
    'button:has-text("Akkoord")',
    'button:has-text("OK")',
    'button:has-text("Agree")',
    'button:has-text("Toestaan")',
    '.cookie-accept',
    '.accept-cookies',
    '#accept-cookies',
    '#cookie-accept'
  ],
  
  // Selettori specifici per Kruidvat
  kruidvat: [
    '[data-testid="cookie-consent-accept"]',
    '.cookie-banner button',
    '.gdpr-banner button',
    'button[aria-label*="cookie"]',
    'button[aria-label*="akkoord"]'
  ],
  
  // Selettori specifici per Trekpleister
  trekpleister: [
    '[data-testid="cookie-banner-accept"]',
    '.cookie-notification button',
    '.consent-banner button',
    'button[data-cy="accept-cookies"]'
  ]
};

/**
 * Accetta automaticamente i popup dei cookie
 */
export class CookieHelper {
  
  /**
   * Tenta di accettare i cookie su una pagina
   * @param page - La pagina Playwright
   * @param siteType - Tipo di sito per selettori specifici ('kruidvat', 'trekpleister', o 'generic')
   * @param timeout - Timeout per cercare i popup (default: 5000ms)
   */
  static async acceptCookies(page: Page, siteType: 'kruidvat' | 'trekpleister' | 'generic' = 'generic', timeout: number = 5000): Promise<boolean> {
    console.log(`🍪 Cercando popup cookie per ${siteType}...`);
    
    try {
      // Seleziona i selettori appropriati
      let selectorsToTry = COOKIE_SELECTORS.generic;
      if (siteType !== 'generic' && COOKIE_SELECTORS[siteType]) {
        selectorsToTry = [...COOKIE_SELECTORS[siteType], ...COOKIE_SELECTORS.generic];
      }
      
      // Aspetta un momento per permettere al popup di apparire
      await page.waitForTimeout(1000);
      
      // Prova ogni selettore
      for (const selector of selectorsToTry) {
        try {
          const element = page.locator(selector).first();
          
          // Controlla se l'elemento è visibile
          const isVisible = await element.isVisible({ timeout: 500 });
          
          if (isVisible) {
            console.log(`🍪 Trovato popup cookie con selettore: ${selector}`);
            await element.click();
            console.log('✅ Cookie popup accettato con successo');
            
            // Aspetta un momento dopo il click per assicurarsi che sia stato processato
            await page.waitForTimeout(1000);
            return true;
          }
        } catch (error) {
          // Continua con il prossimo selettore se questo fallisce
          continue;
        }
      }
      
      // Se non troviamo popup specifici, prova a cercare iframe di cookie
      await CookieHelper.handleCookieIframes(page);
      
      console.log('ℹ️ Nessun popup cookie trovato o già gestito');
      return false;
      
    } catch (error) {
      console.log('⚠️ Errore durante gestione cookie:', error);
      return false;
    }
  }
  
  /**
   * Gestisce i popup dei cookie all'interno di iframe
   */
  private static async handleCookieIframes(page: Page): Promise<void> {
    try {
      // Cerca iframe che potrebbero contenere popup di cookie
      const iframes = page.frameLocator('iframe');
      
      const iframeSelectors = [
        'button:has-text("Accept")',
        'button:has-text("Accepteer")',
        'button:has-text("Akkoord")',
        '[id*="accept"]',
        '[class*="accept"]'
      ];
      
      for (const selector of iframeSelectors) {
        try {
          const element = iframes.locator(selector).first();
          const isVisible = await element.isVisible({ timeout: 1000 });
          
          if (isVisible) {
            console.log(`🍪 Trovato popup cookie in iframe: ${selector}`);
            await element.click();
            console.log('✅ Cookie popup in iframe accettato');
            await page.waitForTimeout(1000);
            return;
          }
        } catch (error) {
          continue;
        }
      }
    } catch (error) {
      // Iframe handling fallito, non è critico
    }
  }
  
  /**
   * Rimuove banner di cookie tramite CSS se i click non funzionano
   */
  static async removeCookieBanners(page: Page): Promise<void> {
    try {
      await page.addStyleTag({
        content: `
          /* Nasconde banner cookie comuni */
          .cookie-banner,
          .cookie-notice,
          .cookie-bar,
          .gdpr-banner,
          .consent-banner,
          [class*="cookie"][class*="banner"],
          [class*="cookie"][class*="notice"],
          [id*="cookie"][id*="banner"],
          [id*="cookie"][id*="notice"] {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* Ripristina scroll se bloccato dai cookie */
          body {
            overflow: auto !important;
          }
        `
      });
      console.log('🎨 CSS per nascondere banner cookie applicato');
    } catch (error) {
      console.log('⚠️ Errore applicando CSS cookie:', error);
    }
  }
  
  /**
   * Metodo combinato che prova tutti gli approcci
   */
  static async handleAllCookies(page: Page, siteType: 'kruidvat' | 'trekpleister' | 'generic' = 'generic'): Promise<void> {
    console.log('🍪 Iniziando gestione completa cookie...');
    
    // 1. Prova ad accettare i cookie
    const accepted = await CookieHelper.acceptCookies(page, siteType);
    
    // 2. Se non riesce, rimuovi i banner con CSS
    if (!accepted) {
      await CookieHelper.removeCookieBanners(page);
    }
    
    // 3. Aspetta un momento finale per stabilizzare la pagina
    await page.waitForTimeout(1500);
    
    console.log('✅ Gestione cookie completata');
  }
}