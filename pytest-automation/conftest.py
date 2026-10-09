import os
import pytest
import json
from data.clients.base_client import BaseClient
from config import read_from_config_files
from utils.json_helper import deserialize_json_to_object
from utils.okta_brand import get_authenticated_session
from utils.creds import get_selected_creds
from utils.xray_client import (
    get_tests_by_label,
    create_test_execution,
    add_results_for_tests,
    _xray_status_from_report,
)
from dotenv import load_dotenv

load_dotenv()

url_config = read_from_config_files('urls.ini', 'ncl_urls')


def _require_brand_role():
    brand = os.getenv("BRAND")
    role = os.getenv("ROLE")
    if not brand or not role:
        raise pytest.UsageError(
            "❌ BRAND and ROLE must be set.\n"
            "Use either:\n"
            "  BRAND=REGENT ROLE=manager pytest\n"
            "or:\n"
            "  pytest --brand REGENT --role manager"
        )
    return brand, role


def pytest_addoption(parser):
    parser.addoption("--brand", action="store", default=None, help="Brand (e.g. REGENT)")
    parser.addoption("--role", action="store", default=None, help="Role (e.g. manager)")


def pytest_configure(config):
    """
    1) Allow passing brand/role via CLI, set env vars early.
    2) Resolve creds + label and stash them.
    """
    brand_cli = config.getoption("--brand")
    role_cli = config.getoption("--role")

    if (brand_cli and not role_cli) or (role_cli and not brand_cli):
        raise pytest.UsageError("❌ Use both --brand and --role together (e.g. --brand REGENT --role manager).")

    if brand_cli:
        os.environ["BRAND"] = brand_cli
    if role_cli:
        os.environ["ROLE"] = role_cli

    brand, role = _require_brand_role()
    label = f"{brand}_{role}"

    creds = get_selected_creds(brand,role)

    config._creds = creds
    config._label = label
    config._brand_role_marker = label
    config._xray_results = []


def pytest_sessionstart(session):
    """
    Fetch the Xray Tests tagged with this label so collection can filter against
    them.

    The Test Execution is NOT created here: at this point we only know which
    tests carry the label in Xray, not which of them are actually automated.
    Seeding the execution with every labelled test leaves the unautomated ones
    stuck at TODO forever, so it is created in pytest_collection_modifyitems
    once we know what will really run.
    """
    config = session.config

    if os.getenv("SKIP_XRAY", "").lower() in ("1", "true", "yes"):
        print("SKIP_XRAY set - skipping Xray fetch/execution creation for this run.")
        return

    label = getattr(config, "_label", None)

    tests = get_tests_by_label(label)
    test_keys = [t["key"] for t in tests if t.get("key")]
    print(f"✅ Fetched {len(test_keys)} test cases from Xray for label {label}")

    config._allowed_test_keys = set(test_keys)


def pytest_collection_modifyitems(config, items):
    """
    Only run tests that:
      1) Have marker == <BRAND>_<ROLE> (e.g. @pytest.mark.REGENT_manager)
      2) Have @pytest.mark.xray_test_case(<test_key>) AND test_key is in allowed_test_keys
    """
    brand_role_marker = getattr(config, "_brand_role_marker", None)
    allowed_test_keys = getattr(config, "_allowed_test_keys", [])

    if not allowed_test_keys:
        return

    selected, deselected = [], []

    for item in items:
        # must match brand/role marker
        if brand_role_marker and not item.get_closest_marker(brand_role_marker):
            deselected.append(item)
            continue

        # must have xray_test_case(test_key)
        tr = item.get_closest_marker("xray_test_case")
        if not tr or not tr.args:
            deselected.append(item)
            continue

        test_key = str(tr.args[0])
        if test_key not in allowed_test_keys:
            deselected.append(item)
            continue

        selected.append(item)

    if deselected:
        config.hook.pytest_deselected(items=deselected)

    items[:] = selected

    # Now that we know exactly which tests will run, create the execution with
    # just their keys. Anything labelled in Xray but not automated here is left
    # out entirely rather than being added as a TODO(<owner>) that never gets updated.
    selected_keys = []
    seen = set()
    for item in selected:
        key = str(item.get_closest_marker("xray_test_case").args[0])
        if key not in seen:
            seen.add(key)
            selected_keys.append(key)

    if not selected_keys:
        print("ℹ️ No automated tests matched this brand/role - skipping Xray execution.")
        return

    execution_key = create_test_execution(getattr(config, "_label", None), selected_keys)
    print(f"✅ Execution {execution_key} created with {len(selected_keys)} tests")

    config._execution_key = execution_key


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()

    if report.when != "call":
        return

    config = item.config
    execution_key = getattr(config, "_execution_key", None)

    if not execution_key:
        return

    tr = item.get_closest_marker("xray_test_case")
    if not tr or not tr.args:
        return

    test_key = str(tr.args[0])
    status = _xray_status_from_report(report)

    results = getattr(config, "_xray_results", [])
    results.append({"test_key": test_key, "status": status})
    config._xray_results = results


def pytest_sessionfinish(session, exitstatus):
    """
    Publish all buffered results to the created Xray Test Execution.
    """
    config = session.config
    execution_key = getattr(config, "_execution_key", None)
    results = getattr(config, "_xray_results", [])
    print("✅ Updating test execution with execution status:", execution_key)

    if execution_key and results:
        add_results_for_tests(execution_key, results)
    elif execution_key:
        print("ℹ️ No results collected to post to Xray.")


# --- Okta / Playwright auth: cookies from Playwright storage state ---

@pytest.fixture(scope="session")
def api_session():
    """
    Session-scoped requests.Session with Okta cookies from Playwright auth file.
    """
    return get_authenticated_session()


@pytest.fixture(scope="session")
def api_client(api_session):
    """BaseClient that sends Okta cookies on every API request. Use this for authenticated API tests."""
    return BaseClient(session=api_session)


@pytest.fixture(scope="session")
def get_voyage_code(api_client):
    json_payload = json.dumps({"filters": {}, "sort": []})
    post_response = deserialize_json_to_object(
        api_client.post_request(
            url_config['pricing_table_url'],
            json.loads(json_payload),
            None, 200,
            {'page': '1', 'page_size': '25', 'startRow': '0', 'endRow': '25'}
        )
    )
    voyage_code = post_response.results[0].voyage_info.voyage_code
    return voyage_code


@pytest.fixture(scope="session")
def get_meta_code(get_voyage_code, api_client):
    assert get_voyage_code is not None
    response = deserialize_json_to_object(
        api_client.get_request(url_config['vdd_info'], None, 200, None, get_voyage_code)
    )
    print(response.meta_categories[0].meta.code)
    return response.meta_categories[0].meta.code


@pytest.fixture(scope="session")
def get_meta_name(get_voyage_code, api_client):
    assert get_voyage_code is not None
    response = deserialize_json_to_object(
        api_client.get_request(url_config['vdd_info'], None, 200, None, get_voyage_code)
    )
    print(response.meta_categories[0].meta.name)
    return response.meta_categories[0].meta.name
    