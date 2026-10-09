/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
import 'dotenv/config';
import { credentials, type Brand, type Role } from './fixtures/credentials';
import { getTestsByLabel, createTestExecution } from './utils/xrayClient';
import { readFileWithin, writeFileWithin } from './utils/safeFs';

function getSelectedCreds() {
  const brand = process.env.BRAND as Brand | undefined;
  const role  = process.env.ROLE  as Role  | undefined;

  if (!brand || !role) {
    throw new Error('❌ BRAND and ROLE must be set');
  }

  const user = credentials[brand]?.[role];

  if (!user) {
    throw new Error(`❌ No credentials found for BRAND=${brand}, ROLE=${role}`);
  }
  if (!user.username || !user.password) {
    throw new Error(
      `❌ Missing username/password for BRAND=${brand}, ROLE=${role}. ` +
      `Check your .env: OKTA_USERNAME_... and OKTA_PASSWORD_...`,
    );
  }

  return {
    username: user.username,
    password: user.password,
    sq:       user.sq ?? '',
  };
}

export default async function globalSetup(): Promise<void> {
  // Clear allure results from previous run
  const allureResultsDir = path.resolve('allure-results');
  fs.rmSync(allureResultsDir, { recursive: true, force: true });
  fs.mkdirSync(allureResultsDir, { recursive: true });

  const brand = process.env.BRAND as Brand;
  const role  = process.env.ROLE  as Role;
  const label = `${brand}_${role}`;

  try {
    const testKeysFile = process.env.XRAY_TEST_KEYS_FILE;
    const testPlanKey  = process.env.XRAY_TEST_PLAN_KEY;

    let testKeys: string[];
    if (testKeysFile) {
      const parsed = JSON.parse(readFileWithin(process.cwd(), testKeysFile));
      testKeys = (Array.isArray(parsed) ? parsed : parsed.unique_keys ?? []).filter(Boolean);
    } else {
      const tests = await getTestsByLabel(label);
      testKeys = tests.map(t => t.key).filter(Boolean);
    }

    if (testKeys.length > 0) {
      const executionKey = await createTestExecution(label, testKeys, testPlanKey);
      const xrayDir = path.resolve('.xray');
      fs.mkdirSync(xrayDir, { recursive: true });
      writeFileWithin(xrayDir, path.join(xrayDir, 'execution-key.txt'), executionKey);
    }
  } catch {
    // best-effort Xray setup -- failures here should not block the auth/setup flow
  }

  const { username, password, sq } = getSelectedCreds();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page    = await context.newPage();

  page.setDefaultTimeout(120_000);
  page.setDefaultNavigationTimeout(180_000);

  await page.goto('https://nclh.okta.com/');
  await page.fill('#input28', username);
  await page.fill('#input36', password);
  await page.click('[data-type="save"]');

  try {
    await page.fill('#input70', sq);
    await page.click('[data-type="save"]');
  } catch {
    console.warn('⚠️ Not able to input security question');
  }

  await page.waitForURL('**/app/**', { timeout: 180_000 });

  if (process.env.BASE_URL) {
    await page.goto(`${process.env.BASE_URL}/dashboard`);
  } else {
    console.warn('⚠️ BASE_URL not set; skipping dashboard navigation.');
  }

  const outDir = path.resolve('fixtures');
  fs.mkdirSync(outDir, { recursive: true });
  await context.storageState({ path: path.join(outDir, `auth_${label}.json`) });

  await browser.close();
  console.log(`✅ Auth state saved for ${label}`);
}
