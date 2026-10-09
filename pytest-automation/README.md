# Pytest Automation Framework Documentation

## 1. Overview

This repository contains a **Pytest-based automation framework** designed for scalable, maintainable, and configurable testing of APIs and UI workflows. The framework supports multi-environment execution, Okta-based authentication, TestRail integration, and Dockerized execution for consistency across local and CI environments.

The framework follows industry best practices such as:
- Clear separation of concerns
- Reusable utilities and fixtures
- Environment-driven execution
- Centralized configuration and reporting

---

## 2. Key Features

- API test coverage using Pytest
- Modular test organization (Page-based)
- Centralized configuration and environment resolution
- Okta authentication support
- TestRail integration for test management
- HTML reporting
- Dockerized execution (API)
- Environment-variable–driven brand x role execution

---

## 3. Project Structure

```text
pytest-automation/
├── assets/                     # Static assets (if any)
├── data/                       # Test data & clients
│   ├── clients/                # Client-specific data
│   ├── __init__.py
│   └── __pycache__/
│
├── e2e_tests/                  # End-to-end test suites
│   ├── test_dashboard.py
│   ├── __init__.py
│   └── __pycache__/
│
├── fixtures/                   # Custom Pytest fixtures
│   ├── __init__.py
│
├── utils/                      # Reusable utilities
│   ├── creds.py                # Credential handling
│   ├── env_resolver.py         # Environment resolution logic
│   ├── json_helper.py          # JSON utilities
│   ├── logger.py               # Logging configuration
│   ├── okta_brand.py           # Brand-based Okta config
│   ├── okta_login.py           # Okta authentication flow
│   ├── testrail_client.py      # TestRail API client
│   ├── __init__.py
│   └── __pycache__/
│
├── config.py                   # Global configuration
├── conftest.py                 # Pytest hooks & fixtures
├── pytest.ini                  # Pytest configuration
├── requirements.txt            # Python dependencies
└──  urls.ini                    # Environment URLs
```

## 4. Installation & Setup

### 4.1 Prerequisites

Ensure the following are installed:

- Python 3.9+
- pip
- Docker & Docker Compose (optional, for containerized runs)
- Access to Okta accounts (if authentication is required)
- TestRail credentials (if reporting is enabled)

### 4.2 Install Dependencies

pip install -r requirements.txt

## 5. Environment Configuration

Create a .env file at the project root using .env.example as reference.

ENV=qa
BRAND=NCL
ROLE=admin

TESTRAIL_DOMAIN=https://<testrail-domain>
TESTRAIL_USERNAME=<username>
TESTRAIL_API_KEY=<api_key>
TESTRAIL_PROJECT_ID=<project_id>

## 6. Test Execution

### 6.1 Run All Tests

pytest

### 6.2 Run a Specific Test File

pytest e2e_tests/test_dashboard.py

### 6.3 Run Tests by Keyword

pytest -m "OCEANIA_manager"

### 6.4 Generate HTML Report

pytest --html=report.html

## 7. Fixtures & Configuration

### 7.1 Pytest Fixtures

Fixtures are defined in:
- fixtures/
- conftest.py

Shared setup and teardown logic is centralized

Fixtures handle:
- Environment setup
- Authentication
- Data initialization

### 7.2 Configuration Management

- config.py – global configuration
- env_resolver.py – resolves environment variables
- urls.ini – environment-specific endpoints

## 8. Authentication (Okta)

Okta login logic is implemented in:
- utils/okta_login.py
- utils/okta_brand.py

Credentials are resolved dynamically based on:

- ENV
- BRAND
- ROLE

Authentication logic is reusable across tests

## 9. TestRail Integration

Implemented via utils/testrail_client.py

Capabilities:
- Create test runs automatically
- Update test results
- Map automated tests to TestRail cases

Result status mapping:

- Passed → 1
- Failed → 5
- Skipped → 2

## 10. Reporting

HTML reports generated via Pytest HTML plugin

Output location:
- report.html

Logs generated using centralized logger

## 11. Docker Execution

### 11.1 Run API Tests

docker compose -f docker-compose-api.yml up --build

### 11.2 Run UI Tests

docker compose -f docker-compose-ui.yml up --build

Each Docker setup ensures:
- Consistent environment
- Dependency isolation
- CI-friendly execution

## 12. Best Practices

- Keep tests independent and idempotent
- Use fixtures instead of hard-coded setup
- Avoid hard waits; rely on polling/assertions
- Centralize credentials and configuration
- Use meaningful test names and assertions
- Reuse utilities instead of duplicating logic

## 13. Contribution Guidelines

- Follow existing test and folder conventions
- Add utilities to utils/ only if reusable
- Keep test data externalized in data/
- Update documentation when adding new features

## 14. Troubleshooting

- Ensure .env values are set correctly
- Validate URLs in urls.ini
- Check Docker logs for container failures
- Run tests with -s -v for debugging