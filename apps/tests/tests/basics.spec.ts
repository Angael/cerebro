import { test, expect } from '@playwright/test';
import z from 'zod';

const DOMAIN = z.string().parse(process.env.DOMAIN);
const EMAIL = z.string().parse(process.env.TEST_USER);
const PASSWORD = z.string().parse(process.env.TEST_PASS);

test('Finds first item', async ({ page }) => {
  await page.goto(`${DOMAIN}/`);

  await expect(page).toHaveTitle(/Cerebro/);
  await expect(page.getByRole('link', { name: 'item' }).first()).toBeVisible();
});

test('Login page works', async ({ page }) => {
  await page.goto(`${DOMAIN}/signin`);

  await page.getByRole('textbox', { name: 'email' }).fill(EMAIL);
  await page.getByRole('textbox', { name: 'password' }).fill(PASSWORD);
  await page.click('button:has-text("Log in")');
  await page.waitForURL(`${DOMAIN}`);

  await expect(page).not.toHaveURL('/signin');
});
