// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Visual Comparison – GitHub Username Change', () => {
 
  test.beforeEach(async ({ page }) => {
    await page.goto('https://github.com/login');

    // Disable animations &  caret
    await page.addStyleTag({
      content: `
        * {
          animation: none !important;
          transition: none !important;
          caret-color: transparent !important;
        }
      `
    });

    await page.waitForLoadState('networkidle');
  });

  test('Visual Comparison ',{tag: '@chromium'}, async ({ page }) => {

    const usernameInput = page.getByRole('textbox', {
      name: 'Username or email address',
    });
    
    // Baseline – empty input
    await expect(usernameInput).toHaveScreenshot('username-input.png');
    
    // Modify UI
    await usernameInput.fill('test');
    
    // Same screenshot name → visual diff
    await expect(usernameInput).toHaveScreenshot('username-input.png');
    
    });
  });
