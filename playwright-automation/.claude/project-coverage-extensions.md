# Test Coverage Rules — Proxima RMS QA

This file is the **project-specific coverage extension** consumed by the `derive-scenario-coverage`
skill. It only extends SDK defaults — it never redefines or relaxes them.

---

## Promoted Scenario Types — Contextual → Core

### `api-mock` (promoted from Contextual)

For any test that asserts data-driven UI behaviour (colors, counts, computed values), API mocking
via `page.route()` is **mandatory**, not optional. Live API data is non-deterministic in QA environments.

Applies to: dashboard summary flex, opportunity breakdown tiles, VDD data values, pricing table content.

The mock must:
1. Intercept the specific API endpoint
2. Return a controlled payload with known values
3. Assert the UI reflects those exact values

### `multi-brand` (promoted from Contextual)

Any test covering a feature that differs by brand (NCL vs OCEANIA/REGENT) must have brand-scoped
variants. A single test tagged for all brands is only acceptable when behaviour is confirmed
identical across brands.

---

## RMS Domain — Negative Case Triggers

| AC pattern | RMS negative to derive |
|---|---|
| "user submits a pricing action" | action rejected when role lacks permission |
| "filter is applied" | table/chart unchanged when filter value is invalid or returns no results |
| "saved view is applied" | saved view not listed when created under a different brand |
| "action is approved" | approval unavailable to analyst role |
| "config value is saved" | save fails with validation error on out-of-range input |
| "chart renders" | empty/zero-data state shown when API returns empty array |

---

## RMS Domain — Edge Case Dimensions

| Dimension | RMS values |
|---|---|
| **Brand** | NCL, OCEANIA, REGENT — all three must be covered for brand-sensitive features |
| **Role** | admin, manager, analyst — all three for role-gated features |
| **Inventory view** | VI (Voyage Inventory), Meta — both views for all VDD sub-tabs |
| **Action state** | No Action Yet, To Review, Syncing, Planned, Pending Validation, Accepted, Overridden |
| **Opportunity category** | Spill+PC, Spill+Tactical, No Change, Optimisation, Blackout, Spoil+PC, Spoil+Tactical |

---

## Rule — Tagging Completeness

Every test must carry all applicable tags:

| Tag type | Format | Required when |
|---|---|---|
| Regression tier | `@regression` or `@sanity` | Always |
| Brand+role | `@NCL-admin`, `@OCEANIA-manager`, etc. | Always |
| Inventory view | `@VI`, `@meta` | VDD sub-tab tests |
| API mock | `@mocked` | Tests using page.route() |

---

## Checklist — Before Marking a Suite Complete

```
[ ] Every UI component in scope has a presence/visibility assertion
[ ] Data-driven assertions use page.route() mocks — not live API data
[ ] Brand-specific behaviour has per-brand test variants or explicit cross-brand confirmation
[ ] Role-restricted elements are only asserted in tests tagged for that role
[ ] All VDD tests specify VI or Meta view explicitly
[ ] Filter tests include both apply and reset steps
[ ] No test.skip — failing tests must FAIL loudly
```
