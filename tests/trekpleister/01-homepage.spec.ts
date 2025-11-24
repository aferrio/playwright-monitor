import { test, expect } from '@playwright/test';

test.describe('Trekpleister', () => {  
  test('homepage title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Trekpleister/);
  });
});