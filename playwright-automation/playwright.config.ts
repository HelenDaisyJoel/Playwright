import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const brand       = process.env.BRAND ?? 'NCL';
const role        = process.env.ROLE  ?? 'analyst';

const runStamp    = new Date().toISOString().replace(/[:.]/g, '-');
const htmlReport  = process.env.PW_HTML_REPORT_DIR ?? `html-report/run-${runStamp}`;

/** Escape TEST_TAG so it is treated as a literal string in the RegExp,
 *  preventing ReDoS from a malformed CI variable value. */
const tagToRun = process.env.TEST_TAG ?? `@${brand}-${role}`;
const testTagPattern = new RegExp(tagToRun.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

export default defineConfig({
  testDir: 'tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 3,
  workers: 2,
  timeout: 60_000,
  use: {
    baseURL: process.env.BASE_URL ?? process.env.PLAYWRIGHT_BASE_URL ?? 'http://qa1-rms.nclh.io/',
    headless: true,
    viewport: { width: 1440, height: 1024 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    storageState: `./fixtures/auth_${brand}_${role}.json`,
  },
  reporter: [
    ['allure-playwright'],
    ['html', { outputFolder: htmlReport, open: 'never' }],
    ['list'],
    ['./reporters/xray-reporter.ts'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  grep: testTagPattern,
  globalSetup: './global-setup.ts',
});
