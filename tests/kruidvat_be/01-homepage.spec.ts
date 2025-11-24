import { test, expect } from '@playwright/test';

test.describe('Kruidvat Belgium', () => {  
  test('homepage title', async ({ page }) => {
    await page.goto('/nl');  // Kruidvat BE usa /nl path
    await expect(page).toHaveTitle(/Kruidvat/);
  });
});
