// @ts-check
// Bulk-generated suite: one loop, TOTAL_TESTS test cases.
// Each iteration registers an independent test titled TC-<n>, so Playwright
// sees 5,000 real tests and distributes them evenly across shards/workers.
// Override the count with TC_COUNT (e.g. TC_COUNT=5000 npx playwright test).
// Default is 5 for now to keep TestDino streaming runs small.
import { expect, test } from '@playwright/test';

const TOTAL_TESTS = Number(process.env.TC_COUNT ?? 5);

test.describe('Bulk storefront checks', () => {
  for (let i = 1; i <= TOTAL_TESTS; i++) {
    test(`TC-${i}: Verify storefront loads and title is correct`, { tag: '@chromium' }, async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveTitle(/TestDino/);
    });
  }
});

// Intentionally flaky tests for BuildPulse/TestDino flake detection.
// Each fails randomly at a different rate, so across runs (and retries)
// they produce the pass/fail-on-same-commit signal flake detectors look for.
test.describe('Flaky suite', () => {
  const FLAKE_RATES = { 1: 0.3, 2: 0.4, 3: 0.5, 4: 0.6, 5: 0.2 };

  for (const [n, rate] of Object.entries(FLAKE_RATES)) {
    test(`FLAKY-${n}: intermittent assertion (fails ~${rate * 100}% of runs)`, { tag: '@chromium' }, async ({ page }) => {
      await page.goto('/');
      expect(Math.random(), `Simulated flake: random draw fell below ${rate}`).toBeGreaterThan(rate);
      await expect(page).toHaveTitle(/TestDino/);
    });
  }

  test('FLAKY-6: simulated slow dependency (1-3s) against a 2s budget', { tag: '@chromium' }, async ({ page }) => {
    const delay = 1000 + Math.floor(Math.random() * 2000);
    await page.goto('/');
    await page.waitForTimeout(delay);
    expect(delay, 'Simulated slow dependency exceeded 2s budget').toBeLessThan(2000);
  });
});
