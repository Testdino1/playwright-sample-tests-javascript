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

test('visual comparison test', async ({ page }) => {
  await page.goto('https://github.com/login');
  await expect(page).toHaveScreenshot('github-login.png');
  await page.getByRole('textbox', { name: 'Username or email address' }).click();
  await page.getByRole('textbox', { name: 'Username or email address' }).fill('test');
  await expect(page).toHaveScreenshot('github-login.png');
});