// @ts-check
import { expect, test } from '@playwright/test';
import AllPages from '../pages/AllPages.js';
import dotenv from 'dotenv';
dotenv.config({ override: true });

let allPages;

test.beforeEach(async ({ page }) => {
  allPages = new AllPages(page);
  await page.goto('/');
});

test('test', {tag: '@chromium'}, async ({ page }) => {
  await test.step('Test visual comparison', async () => {
  await page.goto('https://github.com/login');
  });
  await test.step('Verify that it is the same as the baseline image', async () => {
    await expect(page).toHaveScreenshot('github-login.png');
  });
  await test.step('Verify visual comparison', async () => {
  await page.getByRole('textbox', { name: 'Username or email address' }).click();
  await page.getByRole('textbox', { name: 'Username or email address' }).fill('test');
  await expect(page).toHaveScreenshot('github-login.png');
  });
});