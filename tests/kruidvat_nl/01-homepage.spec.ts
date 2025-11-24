import { test, expect } from '@playwright/test';

test.describe('Kruidvat Nederland', () => {  
  test('homepage title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Kruidvat/);
  });
});