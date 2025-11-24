import { test, expect } from '@playwright/test';
import { SITES_CONFIG } from '../../config/sites.config';

const siteConfig = SITES_CONFIG.TREKPLEISTER;

test.describe('Trekpleister', () => {  
  test('homepage title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Trekpleister/);
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
});