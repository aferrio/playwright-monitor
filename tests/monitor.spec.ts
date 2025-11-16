import { test, expect } from '@playwright/test';

test('Controlla contenuto su trekpleister.com', async ({ page }) => {
  await page.goto('https://www.trekpleister.com', { waitUntil: 'domcontentloaded' });
  const body = await page.textContent('body');
  expect(body?.includes('Uit onze folder')).toBeTruthy();
});
