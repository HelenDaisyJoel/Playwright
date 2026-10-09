import { test as base, expect as baseExpect } from '@playwright/test';
import type { Page } from '@playwright/test';
import type { PageName, LocatorKey } from '../locators';
import {
  actionClick as baseClick,
  typeText as baseType,
  verifyText as baseVerifyText,
  verifyAllTexts as baseVerifyAllTexts,
  verifyAttribute as baseVerifyAttribute,
  verifyUrl as baseVerifyUrl,
  verifyVisibility as baseVerifyVisibility,
  writeTextInLocator as baseWriteTextInLocator,
  verifyElementCount as baseVerifyElementCount,
  type ActionClickOptions,
  type VerifyTextOptions,
  type VerifyVisibilityOptions,
  type WriteTextOptions,
} from '../utils/actions';

interface CustomFixtures {
  actionClick:        <P extends PageName>(pageName: P, key: LocatorKey<P>, options?: ActionClickOptions) => Promise<void>;
  typeText:           <P extends PageName>(pageName: P, key: LocatorKey<P>, value: string) => Promise<void>;
  verifyText:         <P extends PageName>(pageName: P, key: LocatorKey<P>, expected: string | RegExp, options?: VerifyTextOptions) => Promise<void>;
  verifyAllTexts:     <P extends PageName>(pageName: P, locatorKey: LocatorKey<P>, expected: (string | RegExp)[], options?: VerifyTextOptions) => Promise<void>;
  verifyAttribute:    <P extends PageName>(pageName: P, locatorKey: LocatorKey<P>, attributeName: string, expectedValue: string | RegExp) => Promise<void>;
  verifyUrl:          (expectedValue: string | RegExp) => Promise<void>;
  verifyVisibility:   <P extends PageName>(pageName: P, locatorKey: LocatorKey<P>, shouldBeVisible?: boolean, options?: VerifyVisibilityOptions) => Promise<void>;
  writeTextInLocator: <P extends PageName>(pageName: P, locatorKey: LocatorKey<P>, text: string, options?: WriteTextOptions) => Promise<void>;
  verifyElementCount: <P extends PageName>(pageName: P, locatorKey: LocatorKey<P>, expectedCount: number) => Promise<void>;
}

export const test = base.extend<CustomFixtures>({
  actionClick: async ({ page }: { page: Page }, use: (fn: CustomFixtures['actionClick']) => Promise<void>) => {
    await use((pageName, key, option) => baseClick(page, pageName, key, option));
  },
  typeText: async ({ page }: { page: Page }, use: (fn: CustomFixtures['typeText']) => Promise<void>) => {
    await use((pageName, key, value) => baseType(page, pageName, key, value));
  },
  verifyText: async ({ page }: { page: Page }, use: (fn: CustomFixtures['verifyText']) => Promise<void>) => {
    await use((pageName, key, expected, options) => baseVerifyText(page, pageName, key, expected, options));
  },
  verifyAllTexts: async ({ page }: { page: Page }, use: (fn: CustomFixtures['verifyAllTexts']) => Promise<void>) => {
    await use((locator, expected, options) => baseVerifyAllTexts(page, locator, expected, options));
  },
  verifyAttribute: async ({ page }: { page: Page }, use: (fn: CustomFixtures['verifyAttribute']) => Promise<void>) => {
    await use((pageName, locatorKey, attributeName, expectedValue) =>
      baseVerifyAttribute(page, pageName, locatorKey, attributeName, expectedValue),
    );
  },
  verifyUrl: async ({ page }: { page: Page }, use: (fn: CustomFixtures['verifyUrl']) => Promise<void>) => {
    await use((expectedValue) => baseVerifyUrl(page, expectedValue));
  },
  verifyVisibility: async ({ page }: { page: Page }, use: (fn: CustomFixtures['verifyVisibility']) => Promise<void>) => {
    await use((pageName, locatorKey, shouldBeVisible = true, options) =>
      baseVerifyVisibility(page, pageName, locatorKey, shouldBeVisible, options),
    );
  },
  writeTextInLocator: async ({ page }: { page: Page }, use: (fn: CustomFixtures['writeTextInLocator']) => Promise<void>) => {
    await use((pageName, locatorKey, text, options = {}) =>
      baseWriteTextInLocator(page, pageName, locatorKey, text, options),
    );
  },
  verifyElementCount: async ({ page }: { page: Page }, use: (fn: CustomFixtures['verifyElementCount']) => Promise<void>) => {
    await use((pageName, locatorKey, expectedCount) =>
      baseVerifyElementCount(page, pageName, locatorKey, expectedCount),
    );
  },
});

export { baseExpect as expect };
