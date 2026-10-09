import fs from 'node:fs';
import path from 'node:path';
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { addResultsForTests, type XrayResult } from '../utils/xrayClient';
import { readFileWithin } from '../utils/safeFs';

const CASE_KEY_RE = /\[(RST-\d+(?:\s*,\s*RST-\d+)*)\]/;
const RST_KEY_RE = /RST-\d+/g;

function statusFor(result: TestResult): XrayResult['status'] {
  if (result.status === 'passed') {
    return 'PASSED';
  }
  if (result.status === 'failed' || result.status === 'timedOut') {
    return 'FAILED';
  }
  return 'TODO';
}

export default class XrayReporter implements Reporter {
  private executionKey: string | undefined;

  private results: XrayResult[] = [];

  onBegin(): void {
    const xrayDir = path.resolve('.xray');
    const keyPath = path.join(xrayDir, 'execution-key.txt');
    if (!fs.existsSync(keyPath)) {
      return;
    }
    this.executionKey = readFileWithin(xrayDir, keyPath).trim();
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (!this.executionKey) {
      return;
    }

    const match = CASE_KEY_RE.exec(test.title);
    if (!match) {
      return;
    }

    const status = statusFor(result);
    const testKeys = match[1].match(RST_KEY_RE) ?? [];
    for (const testKey of testKeys) {
      this.results.push({ testKey, status });
    }
  }

  async onEnd(): Promise<void> {
    if (!this.executionKey || this.results.length === 0) {
      return;
    }

    try {
      await addResultsForTests(this.executionKey, this.results);
    } catch {
      // best-effort reporting -- a failed Xray sync should not fail the test run
    }
  }
}
