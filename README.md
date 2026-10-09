# Automation Frameworks – Unified Overview

## 1. Overview

This repository contains **two independent automation frameworks** designed to cover different layers of testing and use cases within the organization:

- **Playwright Automation Framework**  
  Focused on modern UI end-to-end testing with browser-based automation, multi-brand execution, role-based authentication, and deep TestRail integration.

- **Pytest Automation Framework**  
  Focused on API and backend end-to-end testing with strong support for environment-driven execution, Okta authentication, TestRail reporting, and Dockerized runs.

Both frameworks follow best practices around scalability, maintainability, configurability, and reporting, while remaining independent so teams can use the right tool for the right problem.

---

## 2. Frameworks in This Repository

### ▶ Playwright Automation Framework (UI)

The Playwright framework is used for **UI and browser-based end-to-end testing**.

Key characteristics:
- Multi-brand and multi-role execution
- Okta-based authentication using global setup
- Centralized locator management
- Reusable action utilities and fixtures
- Automated TestRail test run creation and result publishing
- HTML reports, screenshots, and video capture
- Optimized for fast, stable UI regression and sanity testing

📄 **Documentation:**  
➡️ [Playwright Framework README](./playwright-automation/README.md)

---

### ▶ Pytest Automation Framework (API / Backend)

The Pytest framework is used for **API-level and backend end-to-end testing**, with optional UI and performance coverage.

Key characteristics:
- Modular, feature-based test organization
- Environment- and brand-driven execution
- Centralized configuration and test data handling
- Okta authentication support
- TestRail integration for traceability
- HTML reporting and structured logging
- Dockerized execution for local and CI environments

📄 **Documentation:**  
➡️ [Pytest Framework README](./pytest-automation/README.md)

---

## 3. When to Use Which Framework

| Use Case | Recommended Framework |
|--------------------------------|------------------------|
UI regression & sanity testing   | Playwright             |
Cross-browser UI validation      | Playwright             |
API / backend validation         | Pytest                 |
Service-level E2E workflows      | Pytest                 |
Fast feedback in CI              | Both (layered testing) |

Both frameworks can be executed independently or combined in CI pipelines to provide **full-stack test coverage**.

---

## 4. Repository Structure (High-Level)

```text
playwright-automation/
├── playwright/                 # Playwright UI automation framework
│   └── README.md
│
├── pytest-automation/          # Pytest API / backend automation framework
│   └── README.md
│
└── README.md                   # This file (common overview)
```
