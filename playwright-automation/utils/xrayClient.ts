const XRAY_BASE_URL = process.env.XRAY_BASE_URL ?? 'https://xray.cloud.getxray.app/api/v2';
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY;
const CLIENT_ID = process.env.XRAY_CLIENT_ID;
const CLIENT_SECRET = process.env.XRAY_CLIENT_SECRET;

const RETRY_MAX_ATTEMPTS = 3;
const RETRY_WAIT_MULTIPLIER_MS = 1000;
const RETRY_WAIT_MIN_MS = 2000;
const RETRY_WAIT_MAX_MS = 10000;

export interface XrayTest {
  key: string;
  summary?: string;
}

export interface XrayResult {
  testKey: string;
  status: 'PASSED' | 'FAILED' | 'TODO';
}

let cachedToken: string | undefined;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let attempt = 0;
  let lastError: unknown;

  while (attempt < RETRY_MAX_ATTEMPTS) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      attempt += 1;
      if (attempt >= RETRY_MAX_ATTEMPTS) {
        break;
      }
      const wait = Math.min(RETRY_WAIT_MULTIPLIER_MS * 2 ** (attempt - 1), RETRY_WAIT_MAX_MS);
      await sleep(Math.max(wait, RETRY_WAIT_MIN_MS));
    }
  }

  throw lastError;
}

// ─── authenticate ──────────────────────────────────────────────────────────

export async function authenticate(): Promise<string> {
  if (cachedToken) {
    return cachedToken;
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('❌ XRAY_CLIENT_ID and XRAY_CLIENT_SECRET must be set');
  }

  return withRetry(async () => {
    const response = await fetch(`${XRAY_BASE_URL}/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
    });

    if (!response.ok) {
      throw new Error(`❌ Xray authenticate failed (${response.status}): ${await response.text()}`);
    }

    const token = await response.json();
    if (typeof token !== 'string') {
      throw new Error('❌ Unexpected Xray authenticate response format');
    }

    cachedToken = token;
    return token;
  });
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await authenticate();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// ─── getTestsByLabel ─────────────────────────────────────────────────────────

const GET_TESTS_QUERY = `
query($jql: String!, $limit: Int!, $start: Int!) {
  getTests(jql: $jql, limit: $limit, start: $start) {
    total
    start
    results {
      issueId
      jira(fields: ["key", "summary"])
    }
  }
}
`;

export async function getTestsByLabel(label: string): Promise<XrayTest[]> {
  const allTests: XrayTest[] = [];
  const limit = 100;
  let start = 0;
  const jql = `project = ${JIRA_PROJECT_KEY} AND issuetype = Test AND labels = "${label}"`;

  for (;;) {
    // eslint-disable-next-line no-await-in-loop
    const body = await withRetry(async () => {
      const response = await fetch(`${XRAY_BASE_URL}/graphql`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({ query: GET_TESTS_QUERY, variables: { jql, limit, start } }),
      });

      if (!response.ok) {
        throw new Error(`❌ getTests failed (${response.status}): ${await response.text()}`);
      }

      const parsed = await response.json();
      if (parsed.errors) {
        throw new Error(`❌ getTests GraphQL errors: ${JSON.stringify(parsed.errors)}`);
      }

      return parsed;
    });

    const data = body?.data?.getTests ?? {};
    const results = data.results ?? [];
    for (const item of results) {
      const jiraFields = item.jira ?? {};
      allTests.push({ key: jiraFields.key, summary: jiraFields.summary });
    }

    const total = data.total ?? 0;
    start += limit;
    if (start >= total || results.length === 0) {
      break;
    }
  }

  return allTests;
}

// ─── createTestExecution ─────────────────────────────────────────────────────

export async function createTestExecution(
  label: string,
  testKeys: string[],
  testPlanKey?: string,
): Promise<string> {
  if (testKeys.length === 0) {
    throw new Error('❌ testKeys must be a non-empty array');
  }

  const summary = `RMS UI Regression Suite - ${label}`;
  const payload = {
    info: {
      project: JIRA_PROJECT_KEY,
      summary,
      description: `Automated execution for label ${label}`,
      ...(testPlanKey ? { testPlanKey } : {}),
    },
    tests: testKeys.map(key => ({ testKey: key, status: 'TODO' })),
  };

  return withRetry(async () => {
    const response = await fetch(`${XRAY_BASE_URL}/import/execution`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`❌ createTestExecution failed (${response.status}): ${await response.text()}`);
    }

    const body = await response.json();
    const executionKey = body?.key;
    if (!executionKey) {
      throw new Error(`❌ Unexpected import/execution response: ${JSON.stringify(body)}`);
    }

    return executionKey;
  });
}

// ─── addResultsForTests ──────────────────────────────────────────────────────

export async function addResultsForTests(executionKey: string, results: XrayResult[]): Promise<void> {
  if (!executionKey) {
    throw new Error('❌ executionKey is required');
  }
  if (results.length === 0) {
    throw new Error('❌ results must be a non-empty array');
  }

  const payload = {
    testExecutionKey: executionKey,
    tests: results.map(res => ({ testKey: res.testKey, status: res.status })),
  };

  await withRetry(async () => {
    const response = await fetch(`${XRAY_BASE_URL}/import/execution`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`❌ addResultsForTests failed (${response.status}): ${await response.text()}`);
    }
  });
}
