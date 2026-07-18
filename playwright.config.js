// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  testMatch: ['bulk-tc.spec.js'],
  snapshotDir: './__screenshots__',  // ✅ Baseline image storage
  fullyParallel: true,
  forbidOnly: isCI,
  // 1 retry in CI so intentionally-flaky tests register as "flaky" (pass on
  // retry) instead of failing the shard outright.
  retries: isCI ? 1 : 0,
  workers: 3,

  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  
  reporter: [
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never'
    }],
    ['blob', { outputDir: 'blob-report' }], // Blob reporter for merging
    ['json', { outputFile: './playwright-report/report.json' }],
    ['junit', { outputFile: 'junit.xml' }], // JUnit XML for BuildPulse

    // NOTE: ciRunId (shard grouping) intentionally NOT set — runs streamed with
    // ciRunId are ingested but never appear on the staging dashboard (backend bug).
    // Re-add `ciRunId: process.env.GITHUB_RUN_ID` once server-side grouping is fixed.
    ['@testdino/playwright', { token: process.env.TESTDINO_TOKEN }], // Real-time streaming to TestDino
  ],

  use: {
    baseURL: 'https://storedemo.testdino.com/products',
    headless: true,
    // Always record so every artifact reaches TestDino
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
