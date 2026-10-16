// @ts-check
import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

const reportDir = process.env.REPORT_DIR || 'reports/html-report';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: { timeout: 10000 },

  // Run tests sequentially while investigating flaky failures
  fullyParallel: false,

  // CI configuration
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,

  // HTML report
  reporter: [
    ['html', {
      outputFolder: reportDir,
      open: 'never',
    }],
  ],

  // Shared settings for all projects
  use: {
    baseURL: 'https://scholar-circle-psi.vercel.app',

    // Capture debugging information
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
