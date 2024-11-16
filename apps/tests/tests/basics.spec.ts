import { test, expect } from '@playwright/test';
import { testEnv } from './testEnv';

test('Finds first item', async ({ page }) => {
  await page.goto(`${testEnv.DOMAIN}/`);

  await expect(page).toHaveTitle(/Cerebro/);
  await expect(page.getByTestId('item').first()).toBeVisible();
});

test('Login page works', async ({ page }) => {
  await page.goto(`${testEnv.DOMAIN}/signin`);

  await page.getByRole('textbox', { name: 'email' }).fill(testEnv.TEST_EMAIL);
  await page.getByRole('textbox', { name: 'password' }).fill(testEnv.TEST_PASS);
  await page.click('button:has-text("Log in")');
  await page.waitForURL(`${testEnv.DOMAIN}`);

  await expect(page).not.toHaveURL('/signin');
});
