import { test, expect } from '@playwright/test';
import { SITES_CONFIG } from '../../config/sites.config';

const siteConfig = SITES_CONFIG.KRUIDVAT_NL;

test.describe('Kruidvat Nederland', () => {  
  test('homepage title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Kruidvat/);
  });

  test('homepage content check', async ({ page }) => {
    await page.goto('/');
    
    const body = await page.textContent('body');
    
    if (!body) {
      throw new Error('Body vuoto o non trovato');
    }

    // Verifica che TUTTI i contenuti attesi siano presenti
    const missingContent = siteConfig.expectedContent.filter(content => 
      !body.toLowerCase().includes(content.toLowerCase())
    );

    if (missingContent.length > 0) {
      throw new Error(`Contenuti mancanti: ${missingContent.join(', ')}`);
    }

    // Verifica singolarmente ogni contenuto atteso
    for (const content of siteConfig.expectedContent) {
      await expect(page.locator('body')).toContainText(content, { ignoreCase: true });
    }
  });

  test('cart page access', async ({ page }) => {
    await page.goto('/cart');
    
    // Verifica che la pagina contenga il testo "Winkelmandje"
    await expect(page.locator('body')).toContainText('Winkelmandje', { ignoreCase: true });
    
    console.log('✅ Pagina carrello caricata correttamente con testo "Winkelmandje"');
  });
});