import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {

  await page.goto(`/`);
});


test('check the homepage content', async ({ page }) => {

    // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Bestel gemakkelijk op Kruidvat.be | Kruidvat BE/);
});
