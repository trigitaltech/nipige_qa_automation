# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Playwright + TypeScript test-automation framework, **data-driven** (test logic is separated
from test data, which lives in an Excel workbook). It unifies UI, API (REST & SOAP), Database
(MSSQL/Oracle/DB2), PDF, and visual-image testing under one suite with Allure/HTML/JUnit reports.

The suite is mid-migration from the original demo target (Advantage Online Shopping, "AOS") to
**Nipige**. Many class/folder names still say `advantage`, but the live behaviour being tested is
Nipige's (e.g. role-based "Login as" personas — see `HomeSteps.login`). When editing UI flows,
follow Nipige's actual behaviour, not the legacy AOS naming.

## Commands

```bash
npm run lint              # eslint over all .ts (airbnb-typescript + playwright rules)

# Local single-test run — TEST_NAME in .env is a substring matched against spec filenames
npm run local:test        # headed run of the spec(s) matching *TEST_NAME*
npm run local:test:ui     # same, in Playwright UI mode (watch/debug)

# Full suite run (CI path) — two steps:
npm run create:suite      # generates <Sheet>.test.ts from the Excel suite sheet (prompts for SHEET)
npm test                  # runs the generated *.test.ts via the "suite" project

npm run report            # allure serve (opens the Allure report from allure-results)
```

There is **no build step** — `ts-node` / Playwright execute TypeScript directly.

### Running one test
Set `TEST_NAME` in `.env` to a substring of the spec filename (e.g. `LoginTest`) and run
`npm run local:test`. The `local` Playwright project does `testMatch: *${TEST_NAME}*`. Playwright's
own `-g` title grep also works against the `TestID - Description` titles.

## Architecture

### Dynamic suite generation (the key non-obvious flow)
`npm test` does **not** run the `.spec.ts` files directly. Instead:
1. `create:suite` runs `src/framework/manager/SuiteManager.ts`, which reads a suite sheet from
   `src/resources/data/testData.xlsx` (rows with `Run = YES`), and for each test writes a
   `test.describe(...) { require("./<TestName>.spec.ts") }` block into a generated
   `src/tests/<Sheet>.test.ts` file (per `SuiteTemplate.ts`). The `Mode` column injects
   `test.describe.configure({ mode: 'serial' | 'parallel' })`.
2. `playwright.config.ts` `suite` project matches `*.test.ts` and runs that generated file, which
   pulls in the specs. Generated `*.test.ts` files are deleted/regenerated each `create:suite`.

So: specs are the building blocks; the Excel suite sheet decides *which* run and in *what mode*;
the generated `.test.ts` is the entry point. `testDir` is `./src/tests` (not `./tests` — the
README's tree is slightly stale).

### Data-driven tests
Specs fetch their parameters by `TestID` from a named sheet in `testData.xlsx`:
`ExcelUtil.getTestData("LoginTest", "TC01_ValidLogin")` returns the matching row as an object whose
keys are the column headers (`TestID`, `Description`, `UserName`, `Password`, `persona`,
`ErrorMessage`, `Issue`, ...). `testData.xlsx` is a **binary file** — it cannot be edited with text
tools; data changes require the spreadsheet.

### Layered UI (Page Object Model)
```
*.spec.ts  →  *Steps.ts (@uiSteps)  →  UIActions (@uiActions)  →  *Page.ts selectors (@pages)
```
- **Page classes** (`src/advantage/pages/*Page.ts`): only locator strings / dynamic locator
  functions. No assertions, no logic.
- **Steps classes** (`src/advantage/steps/*Steps.ts`): business workflows wrapped in
  `test.step(...)` for log segmentation; this is where assertions live (`@asserts/Assert`).
- **Action wrappers** (`src/framework/playwright/actions/`): `UIActions` is the facade exposing
  `element()`, `editBox()`, `dropdown()`, `checkbox()`, `alert()`, navigation, downloads, etc.
  Tests/steps should go through these wrappers, never raw Playwright `page.*` calls, so logging and
  timeouts stay consistent.

### Other framework layers
- **API**: `src/framework/playwright/API/` (`RESTRequest`/`RESTResponse`, `SOAPRequest`/`SOAPResponse`,
  `APIActions`). REST/SOAP payload templates live in `src/resources/API/`. Domain steps under
  `src/API/REST/steps` and `src/API/SOAP/steps`.
- **Database**: `src/framework/utils/DBUtil.ts` + `src/database/steps`; connection string from
  `DB_CONFIG`. Drivers: `mssql`, `oracledb`, `ibm_db`.
- **PDF**: `PDFUtil.ts` extracts text+coords (`pdf.js-extract`), masks volatile fields with black
  rectangles (`pdf-lib`), then pixel-compares (`compare-pdf-plus`); diffs attach to Allure.
- **Visual**: `ImageComparator.ts` (resemblejs); auto-creates the baseline on first run if absent.
- **Reporting**: `TestListener.ts` (custom Playwright reporter) logs lifecycle via Winston to
  `test-results/logs/`; `Allure.ts` attaches descriptions/links/PNG/PDF. Reporters configured in
  `playwright.config.ts`.

### Credentials & config
- `playwright.config.ts` reads everything from `.env` (via dotenv). Timeouts in the config are in
  **minutes** (multiplied by `timeInMin`); `BROWSER` selects browser/channel via
  `Browser.ts`. Runs are **headed** (`headless: false`, `--start-maximized`).
- Role-based company logins are read lazily by `src/framework/config/Credentials.ts` via
  `getCredential(Role.TENANT|SELLER|DELIVERY|USER)`. Missing required env vars throw a clear
  "set it in .env" error. Real credentials live only in the git-ignored `.env` (copy `.env.example`).
- `LoginTest.spec.ts` shows the credential pattern: prefer `VALID_USERNAME`/`VALID_PASSWORD` from
  env; otherwise self-register a fresh account at runtime for CI stability.

### Path aliases
Imports use TS path aliases defined in `tsconfig.json` (`baseUrl: ./src`), e.g. `@uiSteps/*`,
`@pages/*`, `@uiActions/*`, `@utils/*`, `@asserts/*`, `@apiActions/*`, `@allure`, `@base-test`,
`@config/*`. Use these aliases rather than long relative paths when adding imports.

### Test fixtures
Specs import `test`/`expect` from `@base-test` (`src/framework/config/base-test.ts`), an extended
Playwright fixture that adds a worker-scoped `gData` Map for sharing data between tests.

## Conventions
- ESLint (airbnb-typescript) enforces semicolons and warns on lines > 120 chars.
- Wrap user-visible step actions in `test.step(...)` so Allure/logs stay readable.
- New UI test: add the `*Page.ts` selectors, the `*Steps.ts` workflow, the `*.spec.ts` reading its
  row via `ExcelUtil.getTestData`, add the row(s) to the relevant sheet in `testData.xlsx`, and add
  the test name to the suite sheet with `Run = YES`.
- **Data-Driven & Dynamic Data Guidelines:**
  - Avoid hardcoding credentials, endpoints, dynamic fields, or static default values.
  - Store configuration items and static fallback values in JSON fixtures (e.g. `src/resources/fixtures/reusableData.json` read via `JsonUtil.getFixtureData(...)`).
  - Generate dynamic/random test values (names, passwords, phone numbers, addresses, etc.) using `@faker-js/faker` to keep tests realistic and reliable.
- **Parallel vs. Sequential Execution Rules:**
  - **Worker Scaling:** Different test files are executed concurrently. Worker count is controlled by `PARALLEL_THREAD` in `.env` (default is 3, automatically scaled up to 4 on CI/CD pipelines).
  - **Dependent State Flows:** Wrap dependent, stateful tests within a single spec (e.g., Create -> Update -> Delete) in a `test.describe.configure({ mode: 'serial' })` block. Avoid running tests within a single file concurrently if they share state.
  - **Database Conflict Prevention:** Ensure strict test isolation. Always use unique identifiers/Faker suffixes for DB/UI records so concurrently running specs never read, edit, or delete other tests' data. Cleanup code should target exact entities by ID rather than using generic wildcards.

