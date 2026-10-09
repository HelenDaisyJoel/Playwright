# utils/xray_client.py
import os
import json
from typing import List, Dict, Any, Optional

import pytest
import requests
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from requests.exceptions import RequestException, Timeout, ConnectionError
from constants import (RETRY_MAX_ATTEMPTS, RETRY_WAIT_MULTIPLIER, RETRY_WAIT_MIN, RETRY_WAIT_MAX)


XRAY_BASE_URL = os.getenv("XRAY_BASE_URL", "https://xray.cloud.getxray.app/api/v2")
JIRA_PROJECT_KEY = os.getenv("JIRA_PROJECT_KEY")
CLIENT_ID = os.getenv("XRAY_CLIENT_ID")
CLIENT_SECRET = os.getenv("XRAY_CLIENT_SECRET")

VERIFY_SSL = True

session = requests.Session()
session.verify = VERIFY_SSL

_token: Optional[str] = None


@retry(
    stop=stop_after_attempt(RETRY_MAX_ATTEMPTS),
    wait=wait_exponential(multiplier=RETRY_WAIT_MULTIPLIER, min=RETRY_WAIT_MIN, max=RETRY_WAIT_MAX),
    retry=retry_if_exception_type((RequestException, Timeout, ConnectionError)),
    reraise=True
)
def _authenticate() -> str:
    global _token
    if _token:
        return _token

    if not CLIENT_ID or not CLIENT_SECRET:
        raise RuntimeError("❌ XRAY_CLIENT_ID and XRAY_CLIENT_SECRET must be set")

    url = f"{XRAY_BASE_URL}/authenticate"
    r = session.post(url, json={"client_id": CLIENT_ID, "client_secret": CLIENT_SECRET}, timeout=30)
    if not r.ok:
        raise RuntimeError(f"❌ Xray authenticate failed ({r.status_code}): {r.text}")

    token = r.json()
    if not isinstance(token, str):
        raise RuntimeError("❌ Unexpected Xray authenticate response format")

    _token = token
    return _token


def _auth_headers() -> Dict[str, str]:
    return {
        "Authorization": f"Bearer {_authenticate()}",
        "Content-Type": "application/json",
    }


def _xray_status_from_report(report: pytest.TestReport) -> str:
    # Returns one of Xray's three execution statuses (PASSED / FAILED / the
    # "not confirmed" placeholder) based on the pytest outcome.
    if report.passed:
        return "PASSED"
    if report.failed:
        return "FAILED"
    return "TODO"


@retry(
    stop=stop_after_attempt(RETRY_MAX_ATTEMPTS),
    wait=wait_exponential(multiplier=RETRY_WAIT_MULTIPLIER, min=RETRY_WAIT_MIN, max=RETRY_WAIT_MAX),
    retry=retry_if_exception_type((RequestException, Timeout, ConnectionError)),
    reraise=True
)
def get_tests_by_label(label: str) -> List[Dict[str, Any]]:
    all_tests: List[Dict[str, Any]] = []
    start = 0
    limit = 100
    jql = f'project = {JIRA_PROJECT_KEY} AND issuetype = "Xray Test" AND labels = "{label}"'

    query = """
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
    """

    while True:
        payload = {"query": query, "variables": {"jql": jql, "limit": limit, "start": start}}
        r = session.post(f"{XRAY_BASE_URL}/graphql", headers=_auth_headers(), data=json.dumps(payload), timeout=30)
        if not r.ok:
            raise RuntimeError(f"❌ getTests failed ({r.status_code}): {r.text}")

        body = r.json()
        if body.get("errors"):
            raise RuntimeError(f"❌ getTests GraphQL errors: {body['errors']}")

        data = body.get("data", {}).get("getTests", {}) or {}
        results = data.get("results", []) or []
        for item in results:
            jira_fields = item.get("jira", {}) or {}
            all_tests.append({"key": jira_fields.get("key"), "summary": jira_fields.get("summary")})

        total = data.get("total", 0)
        start += limit
        if start >= total or not results:
            break

    return all_tests


@retry(
    stop=stop_after_attempt(RETRY_MAX_ATTEMPTS),
    wait=wait_exponential(multiplier=RETRY_WAIT_MULTIPLIER, min=RETRY_WAIT_MIN, max=RETRY_WAIT_MAX),
    retry=retry_if_exception_type((RequestException, Timeout, ConnectionError)),
    reraise=True
)
def create_test_execution(label: str, test_keys: List[str]) -> str:
    if not test_keys:
        raise RuntimeError("❌ test_keys must be a non-empty list")

    summary = f"RMS API Regression Suite - {label}"
    payload = {
        "info": {
            "project": JIRA_PROJECT_KEY,
            "summary": summary,
            "description": f"Automated execution for label {label}",
        },
        "tests": [{"testKey": key, "status": "TODO"} for key in test_keys],
    }

    url = f"{XRAY_BASE_URL}/import/execution"
    r = session.post(url, headers=_auth_headers(), data=json.dumps(payload), timeout=30)
    if not r.ok:
        raise RuntimeError(f"❌ create_test_execution failed ({r.status_code}): {r.text}")

    body = r.json()
    execution_key = body.get("key")
    if not execution_key:
        raise RuntimeError(f"❌ Unexpected import/execution response: {body}")

    print(f"✅ New Xray test execution created: {execution_key}")
    return execution_key


@retry(
    stop=stop_after_attempt(RETRY_MAX_ATTEMPTS),
    wait=wait_exponential(multiplier=RETRY_WAIT_MULTIPLIER, min=RETRY_WAIT_MIN, max=RETRY_WAIT_MAX),
    retry=retry_if_exception_type((RequestException, Timeout, ConnectionError)),
    reraise=True
)
def add_results_for_tests(execution_key: str, results: List[Dict[str, Any]]) -> None:
    if not execution_key:
        raise RuntimeError("❌ execution_key is required")
    if not isinstance(results, list) or not results:
        raise RuntimeError("❌ results must be a non-empty list")

    payload = {
        "testExecutionKey": execution_key,
        "tests": [{"testKey": res["test_key"], "status": res["status"]} for res in results],
    }

    url = f"{XRAY_BASE_URL}/import/execution"
    r = session.post(url, headers=_auth_headers(), data=json.dumps(payload), timeout=30)

    if not r.ok:
        raise RuntimeError(f"❌ add_results_for_tests failed ({r.status_code}): {r.text}")

    for res in results:
        icon = "✔" if res["status"] == "PASSED" else "✘"
        print(f"{icon} Updated {res['test_key']} with status {res['status']}")

    print(f"✅ Xray batch update complete. Status code: {r.status_code}")
