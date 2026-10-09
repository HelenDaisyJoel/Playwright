# Domain Knowledge — Proxima RMS

---

## Domain: Global

### GBL-001 — Multi-brand execution model
Applies to: all tests, authentication, navigation, configuration
Rule: Every test run targets exactly one brand (NCL, OCEANIA, or REGENT) and one role (admin, manager, analyst). Brand and role are injected via BRAND and ROLE environment variables. Auth state is stored per brand+role pair in fixtures/auth_{BRAND}_{ROLE}.json.
Scenario implication: Tests must never assume a specific brand is active. Brand-specific UI differences (labels, available config sections, visible columns) must be accounted for per test scope.
Confirmed: yes
Suite: global
Source: human-provided

### GBL-002 — Role-based access control
Applies to: admin, pricing, config, saved_view, action_modal
Rule: Three roles exist — admin, manager, analyst. Admins can perform all actions including user management. Managers can approve/reject analyst actions and access the Admin page. Analysts can review and submit pricing actions but cannot approve their own.
Scenario implication: Tests tagged @NCL-admin may assert UI elements or actions not available to @NCL-analyst. Role-restricted UI elements must not be asserted in cross-role tests.
Confirmed: yes
Suite: admin
Source: human-provided

### GBL-003 — Okta SSO authentication
Applies to: global-setup, authentication
Rule: Authentication is performed via Okta SSO (nclh.okta.com). The session is captured as browser storageState and reused across all tests in a run. There is no in-test login flow — auth must succeed in global-setup before any test executes.
Scenario implication: Tests must never navigate to the Okta login page directly. If auth fails, all tests in the suite fail. Security question (OKTA_SQ) handling is optional and only triggered when Okta prompts for it.
Confirmed: yes
Suite: global
Source: human-provided

---

## Domain: Dashboard

### DSH-001 — Summary flex header colors
Applies to: dashboard, summary flex component
Rule: The summary flex component shows two KPI headers for gross and net revenue of future sailings. Header background color is determined by API response: avg_pct_revenue_from_promos drives blue (viz-blue-2), avg_pct_voyages_under_budget drives error (red) or success (green) thresholds.
Scenario implication: Color assertions must mock the API response to control the threshold values. Do not rely on live API data for color tests.
Confirmed: yes
Suite: dashboard
Source: human-provided

### DSH-002 — Opportunity Breakdown tile navigation
Applies to: dashboard, opportunity breakdown, pricing
Rule: Each opportunity breakdown tile (Spill+PC, Spill+Tactical, No Change, Optimisation, Blackout, Spoil+PC, Spoil+Tactical) navigates to the Pricing page with pre-applied filters matching that tile's category.
Scenario implication: After clicking a tile, assert the URL contains /analytics/sailings and the relevant filter is active. Use { text: '<TileName>' } option when clicking tiles from the locator.
Confirmed: yes
Suite: dashboard
Source: human-provided

### DSH-003 — Review Rate charts require network idle
Applies to: dashboard, review rate, review rate breakdown
Rule: The review rate and review rate breakdown charts are rendered by ApexCharts from async API data. Tests must await page.waitForLoadState('networkidle') before asserting chart elements.
Scenario implication: Never assert ApexCharts series or legend elements without a networkidle wait or a specific API response intercept.
Confirmed: yes
Suite: dashboard
Source: human-provided

---

## Domain: Pricing

### PRI-001 — Pricing table requires POST response
Applies to: pricing, sailings table
Rule: The pricing table at /analytics/sailings is populated by a POST to /api/voyages/price-prioritization/. Tests must await this response before asserting table content.
Scenario implication: Use page.waitForResponse(r => r.url().includes('/voyages/price-prioritization/') && r.request().method() === 'POST') after navigation.
Confirmed: yes
Suite: pricing
Source: human-provided

### PRI-002 — Date format transformation
Applies to: pricing, lettered voyage, API payload
Rule: Departure dates displayed in the UI as MM-DD-YYYY must be transformed to ISO 8601 (YYYY-MM-DD) when sent in API request payloads. The Advanced Filter applies this transformation before sending.
Scenario implication: When testing filter submission, assert the outgoing request payload contains ISO-formatted dates, not MM-DD-YYYY.
Confirmed: yes
Suite: pricing
Source: human-provided

### PRI-003 — Action modal states
Applies to: pricing, action modal, voyage deep dive
Rule: The action modal supports three action tabs: Approve, Override, and Tactical. The modal is accessible from the pricing-opportunity column and the overbooking-opportunity column. Not all action tabs are visible to all roles.
Scenario implication: Admin and manager tests may assert all three tabs. Analyst tests must only assert tabs visible to their role.
Confirmed: pending
Suite: pricing
Source: human-provided

---

## Domain: Voyage Deep Dive (VDD)

### VDD-001 — VDD sub-tab structure
Applies to: voyage_deep_dive, vdd_cabin, vdd_channel, vdd_promotions, vdd_sourceMarket, vdd_group, vdd_occupancy
Rule: The Voyage Deep Dive page has two primary inventory views: VI (Voyage Inventory) and Meta. Each sub-tab (Cabin, Channel, Promotions, Source Market, Group, Occupancy) is available under both views. Tests must explicitly navigate to the correct view before asserting sub-tab content.
Scenario implication: Tag tests with the view they target (VI tab or Meta tab). Never assume the default view.
Confirmed: yes
Suite: voyage_deep_dive
Source: human-provided

### VDD-002 — VDD data is voyage-specific
Applies to: all VDD sub-tabs
Rule: All VDD API endpoints are parameterized by voyage ID (e.g. /api/voyages/inventory/{voyageId}/). Tests that assert specific data values must mock the API response. Tests that only assert component structure may use live data with networkidle wait.
Scenario implication: Structural tests (grid headers, tab labels, component presence) can use live data. Data-value tests must use page.route() to mock the response.
Confirmed: yes
Suite: voyage_deep_dive
Source: human-provided

---

## Domain: Saved Views

### SVW-001 — Saved view scope
Applies to: saved_view, pricing, vdd_cabin
Rule: Saved views exist in two scopes: private (visible only to the creating user) and public (visible to all users of the same brand). Views are available on the Pricing (prio pane) and Cabin VDD pages (VI and Meta tabs).
Scenario implication: Tests that create public views must clean up after themselves to avoid polluting the shared view list for other test runs. Private view cleanup is user-scoped and safe to leave.
Confirmed: pending
Suite: saved_view
Source: human-provided

---

## Domain: Configuration

### CFG-001 — Config page sections by brand
Applies to: config, admin
Rule: The Config page exposes different sections depending on the active brand. NCL has all sections. OCEANIA and REGENT may have a subset. Tests scoped to O&R brands must only assert sections known to be present for those brands.
Scenario implication: Use brand-scoped tags (@OCEANIA-admin, @REGENT-admin) and limit assertions to shared config sections unless the test is explicitly brand-specific.
Confirmed: pending
Suite: config
Source: human-provided

---

## Domain: Performance

### PRF-001 — Performance page filter reset
Applies to: performance
Rule: The Performance page supports revenue metric filters. Filters must be explicitly reset between tests or test steps that mutate filter state, as the page does not reset on navigation.
Scenario implication: Always reset filters in teardown or use a fresh page context for filter-sensitive tests.
Confirmed: pending
Suite: performance
Source: human-provided
