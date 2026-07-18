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
  retries: 0,
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
  ],

  use: {
    baseURL: 'https://storedemo.testdino.com/products',
    headless: true,
    // 1.59: new trace mode keeps traces for all attempts when retries fail
    trace: 'retain-on-failure-and-retries',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
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
