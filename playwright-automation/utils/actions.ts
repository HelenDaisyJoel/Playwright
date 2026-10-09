/* eslint-disable no-console */
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { locatorRegistry, type PageName, type LocatorKey } from '../locators';

export interface ActionClickOptions {
  index?: number;
  text?:  string;
  force?: boolean;
}

export interface VerifyTextOptions {
  index?:    number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  partial?:  boolean;
  timeout?:  number;
}

export interface VerifyVisibilityOptions {
  index?: number;
  timeout?: number;
}

export interface WriteTextOptions {
  index?: number;
}

export interface ReadTextOptions {
  index?: number;
  isTrimmed?: boolean;
}

// ─── actionClick ─────────────────────────────────────────────────────────────

export async function actionClick<P extends PageName>(
  page: Page,
  pageName: P,
  key: LocatorKey<P>,
  options: ActionClickOptions = {},
): Promise<void> {
  const locator = locatorRegistry[pageName][key] as string;

  let element = page.locator(locator);
  const count = await element.count();

  if (count > 1 && options.index === undefined && !options.text) {
    throw new Error(
      `Locator '${String(key)}' in page '${pageName}' matched ${count} elements. Use 'options.index' or 'options.text' to specify which one.`,
    );
  }

  if (options.index !== undefined) {
    element = element.nth(options.index);
  } else if (options.text) {
    const matchedElement = element.filter({ hasText: options.text }).first();
    await expect(matchedElement).toBeVisible({ timeout: 10000 });
    element = matchedElement;
  }

  await element.click(options.force ? { force: true } : undefined);
  console.log(
    `✅ Clicked '${String(key)}' on page '${pageName}'` +
    (options.index !== undefined ? ` [index ${options.index}]` : '') +
    (options.text ? ` [text "${options.text}"]` : ''),
  );
}

// ─── typeText ─────────────────────────────────────────────────────────────────

export async function typeText<P extends PageName>(
  page: Page,
  pageName: P,
  key: LocatorKey<P>,
  value: string,
): Promise<void> {
  const locator = locatorRegistry[pageName][key] as string;
  await page.fill(locator, value);
}

// ─── verifyText ──────────────────────────────────────────────────────────────

// eslint-disable-next-line max-params
export async function verifyText<P extends PageName>(
  page: Page,
  pageName: P,
  locatorKey: LocatorKey<P>,
  expected: string | RegExp,
  options: VerifyTextOptions = {},
): Promise<void> {
  const locator = locatorRegistry[pageName][locatorKey] as string;
  const baseLocator = page.locator(locator);
  const count = await baseLocator.count();

  if (count > 1 && options.index === undefined) {
    throw new Error(
      `Locator '${String(locatorKey)}' in page '${pageName}' matched ${count} elements. Use 'options.index' to specify which one.`,
    );
  }

  const element = options.index !== undefined ? baseLocator.nth(options.index) : baseLocator;

  if (options.partial) {
    await expect(element).toContainText(expected, { timeout: options.timeout });
  } else {
    await expect(element).toHaveText(expected, { timeout: options.timeout });
  }

  console.log(
    `✅ Verified ${options.partial ? 'partial' : 'exact'} text for '${String(locatorKey)}' on page '${pageName}'` +
    (options.index !== undefined ? ` [index ${options.index}]` : '') +
    ` — expected: ${expected instanceof RegExp ? expected.toString() : `"${expected}"`}`,
  );
}

// ─── verifyAllTexts ──────────────────────────────────────────────────────────

// eslint-disable-next-line max-params
export async function verifyAllTexts<P extends PageName>(
  page: Page,
  pageName: P,
  locatorKey: LocatorKey<P>,
  expectedList: (string | RegExp)[],
  options: VerifyTextOptions = {},
): Promise<void> {
  const locator = locatorRegistry[pageName]?.[locatorKey] as string | undefined;
  if (!locator) {
    throw new Error(`Locator '${String(locatorKey)}' not found in page '${pageName}'`);
  }

  const elements = page.locator(locator);
  const actualTexts = (await elements.allTextContents()).map(t => t.trim());

  expectedList.forEach((expected, i) => {
    if (options.partial) {
      expect(actualTexts[i]).toContain(expected);
    } else {
      expect(actualTexts[i]).toBe(expected);
    }
  });

  console.log(
    `✅ Verified ${expectedList.length}/${actualTexts.length} ${options.partial ? 'partial' : 'exact'} text(s) for '${String(locatorKey)}' on page '${pageName}': [${
      expectedList.map(v => (v instanceof RegExp ? v.toString() : `"${v}"`)).join(', ')
    }]`,
  );
}

// ─── verifyAttribute ─────────────────────────────────────────────────────────

// eslint-disable-next-line max-params
export async function verifyAttribute<P extends PageName>(
  page: Page,
  pageName: P,
  locatorKey: LocatorKey<P>,
  attributeName: string,
  expectedValue: string | RegExp,
): Promise<void> {
  const locator = locatorRegistry[pageName][locatorKey] as string;
  const element = page.locator(locator);
  await expect(element).toHaveAttribute(attributeName, expectedValue);
  console.log(
    `✅ Verified attribute '${attributeName}' on '${String(locatorKey)}' in page '${pageName}' — expected ${
      expectedValue instanceof RegExp ? expectedValue.toString() : `"${expectedValue}"`
    }`,
  );
}

// ─── verifyUrl ───────────────────────────────────────────────────────────────

export async function verifyUrl(page: Page, expectedValue: string | RegExp): Promise<void> {
  const currentUrl = page.url();
  const url = new URL(currentUrl);
  await expect(url.pathname).toContain(expectedValue);
  console.log(
    `✅ Verified URL — pathname "${url.pathname}" contains ${
      expectedValue instanceof RegExp ? expectedValue.toString() : `"${expectedValue}"`
    } (full URL: ${currentUrl})`,
  );
}

// ─── verifyVisibility ────────────────────────────────────────────────────────

// eslint-disable-next-line max-params
export async function verifyVisibility<P extends PageName>(
  page: Page,
  pageName: P,
  locatorKey: LocatorKey<P>,
  shouldBeVisible: boolean = true,
  options: VerifyVisibilityOptions = {},
): Promise<void> {
  const locator = locatorRegistry[pageName][locatorKey] as string;
  let element = page.locator(locator);
  const count = await element.count();

  if (count > 1 && options.index === undefined) {
    throw new Error(
      `Locator '${String(locatorKey)}' in page '${pageName}' matched ${count} elements. Use 'options.index' to specify which one.`,
    );
  }

  if (options.index !== undefined) {
    element = element.nth(options.index);
  }

  const expectOptions = options.timeout !== undefined ? { timeout: options.timeout } : undefined;

  if (shouldBeVisible) {
    await expect(element).toBeVisible(expectOptions);
    await expect(element).toBeVisible({ timeout: options.timeout });
  } else {
    await expect(element).toBeHidden(expectOptions);
    await expect(element).toBeHidden({ timeout: options.timeout });
  }

  console.log(
    `✅ Verified ${shouldBeVisible ? 'visible' : 'hidden'} state for '${String(locatorKey)}' on page '${pageName}'` +
    (options.index !== undefined ? ` [index ${options.index}]` : ''),
  );
}

// ─── writeTextInLocator ──────────────────────────────────────────────────────

// eslint-disable-next-line max-params
export async function writeTextInLocator<P extends PageName>(
  page: Page,
  pageName: P,
  locatorKey: LocatorKey<P>,
  text: string,
  options: WriteTextOptions = {},
): Promise<void> {
  const locator = locatorRegistry[pageName]?.[locatorKey] as string | undefined;
  if (!locator) {
    throw new Error(`Locator '${String(locatorKey)}' not found in page '${pageName}'`);
  }

  let element = page.locator(locator);
  const count = await element.count();

  if (count > 1 && options.index === undefined) {
    throw new Error(
      `Locator '${String(locatorKey)}' in page '${pageName}' matched ${count} elements. Use 'options.index' to specify which one.`,
    );
  }

  if (options.index !== undefined) {
    element = element.nth(options.index);
  }

  await element.waitFor({ state: 'visible' });
  await element.clear();
  await element.type(text);
  console.log(
    `✅ Wrote text to '${String(locatorKey)}' on page '${pageName}'${options.index !== undefined ? ` [index ${options.index}]` : ''}: "${text}"`,
  );
}

// ─── readTextFromLocator ────────────────────────────────────────────────────

// eslint-disable-next-line max-params
export async function readTextFromLocator<P extends PageName>(
  page: Page,
  pageName: P,
  locatorKey: LocatorKey<P>,
  options: ReadTextOptions = {},
): Promise<string> {
  const locator = locatorRegistry[pageName]?.[locatorKey] as string | undefined;
  if (!locator) {
    throw new Error(`Locator '${String(locatorKey)}' not found in page '${pageName}'`);
  }

  let element = page.locator(locator);
  const count = await element.count();

  if (count > 1 && options.index === undefined) {
    throw new Error(
      `Locator '${String(locatorKey)}' in page '${pageName}' matched ${count} elements. Use 'options.index' to specify which one.`,
    );
  }

  if (options.index !== undefined) {
    element = element.nth(options.index);
  }

  const content = (await element.textContent()) ?? '';
  return options.isTrimmed === false ? content : content.trim();
}

// ─── verifyElementCount ──────────────────────────────────────────────────────

export async function verifyElementCount<P extends PageName>(
  page: Page,
  pageName: P,
  locatorKey: LocatorKey<P>,
  expectedCount: number,
): Promise<void> {
  const locator = locatorRegistry[pageName]?.[locatorKey] as string | undefined;
  if (!locator) {
    throw new Error(`Locator '${String(locatorKey)}' not found in page '${pageName}'`);
  }

  const element = page.locator(locator);
  const actualCount = await element.count();

  if (actualCount !== expectedCount) {
    throw new Error(
      `Locator '${String(locatorKey)}' in page '${pageName}' expected ${expectedCount} elements but found ${actualCount}.`,
    );
  }

  console.log(`✅ Verified: Locator '${String(locatorKey)}' in page '${pageName}' has ${expectedCount} elements.`);
}


