// @ts-check
// Bulk-generated suite: one loop, TOTAL_TESTS test cases.
// Each iteration registers an independent test titled TC-<n>, so Playwright
// sees 5,000 real tests and distributes them evenly across shards/workers.
// Override the count locally with TC_COUNT (e.g. TC_COUNT=50 npx playwright test).
import { expect, test } from '@playwright/test';

const TOTAL_TESTS = Number(process.env.TC_COUNT ?? 5000);

test.describe('Bulk storefront checks', () => {
  for (let i = 1; i <= TOTAL_TESTS; i++) {
    test(`TC-${i}: Verify storefront loads and title is correct`, { tag: '@chromium' }, async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveTitle(/TestDino/);
    });
  }
});
