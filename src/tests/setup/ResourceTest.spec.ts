import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { test as baseTest } from "@base-test";
import HomeSteps from "@uiSteps/HomeSteps";
import ResourceSteps from "@uiSteps/ResourceSteps";
import Assert from "@asserts/Assert";
import ResourceConstants from "@uiConstants/ResourceConstants";
import ResourcePage from "@pages/ResourcePage";
import AddResourcePage from "@pages/AddResourcePage";

const EMAIL = process.env.TENANT_EMAIL || "tenant@test.com";
const PASS = process.env.TENANT_PASSWORD || "Tenant@123";

let sharedPage!: Page;
let resSteps!: ResourceSteps;
let suiteStartTime = 0;

const SHARED_CODE = ResourceConstants.SHARED_CODE;   // "EUR"
const SHARED_NAME = ResourceConstants.SHARED_NAME;   // "Euro"
const SHARED_SYMBOL = ResourceConstants.SHARED_SYMBOL; // "€"
const TEMP_CODE = ResourceConstants.TEMP_CODE_DELETE;  // "XAF"
const TEMP_NAME = ResourceConstants.TEMP_NAME_DELETE;  // "Central African CFA Franc"

baseTest.describe("Resource Setup", () => {
    baseTest.describe.configure({ mode: "serial" });

    baseTest.beforeAll(async ({ browser }) => {
        suiteStartTime = Date.now();
        sharedPage = await browser.newPage();
        const home = new HomeSteps(sharedPage);
        await home.launchApplication();
        await home.login(EMAIL, PASS, "tenant");
        await home.validateLogin(EMAIL);

        resSteps = new ResourceSteps(sharedPage);

        // Cleanup stale EUR from a previous failed run
        await resSteps.navigateToResources();
        const searchInput = sharedPage.locator(ResourcePage.SEARCH_INPUT).first();
        if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
            await searchInput.fill(SHARED_CODE);
            await sharedPage.waitForTimeout(ResourceConstants.TABLE_SETTLE_MS);
            if (await resSteps.isResourceVisible(SHARED_CODE)) {
                console.log(`[beforeAll] Deleting stale '${SHARED_CODE}' …`);
                await resSteps.clickDelete(SHARED_CODE);
                await resSteps.confirmDelete();
            }
            await searchInput.fill(TEMP_CODE);
            await sharedPage.waitForTimeout(ResourceConstants.TABLE_SETTLE_MS);
            if (await resSteps.isResourceVisible(TEMP_CODE)) {
                console.log(`[beforeAll] Deleting stale '${TEMP_CODE}' …`);
                await resSteps.clickDelete(TEMP_CODE);
                await resSteps.confirmDelete();
            }
            await searchInput.clear();
            await sharedPage.waitForTimeout(ResourceConstants.TABLE_SETTLE_MS);
        }

        // Create the shared EUR resource used by most tests
        await resSteps.createResourceAndVerify({ resourceCode: SHARED_CODE, resourceName: SHARED_NAME, symbol: SHARED_SYMBOL });
        console.log(`[beforeAll] Created shared resource: '${SHARED_CODE}'`);
    });

    baseTest.afterAll(async () => {
        const runtime = ((Date.now() - suiteStartTime) / 1000).toFixed(1);
        console.log(`[ResourceTest] Total runtime: ${runtime}s`);
        if (resSteps && sharedPage && !sharedPage.isClosed()) {
            await resSteps.navigateToResources().catch(() => {});
            for (const code of [SHARED_CODE, TEMP_CODE]) {
                if (await resSteps.isResourceVisible(code).catch(() => false)) {
                    await resSteps.clickDelete(code).catch(() => {});
                    await resSteps.confirmDelete().catch(() => {});
                }
            }
        }
        await sharedPage?.close();
    });

    // ═══════════════════════════════════════════════════════════════[...]
    // TC_RES_01 — Stat cards (Total Currencies, Active Rates, Pending Update, Last Sync)
    // ═══════════════════════════════════════════════════════════════[...]
    baseTest("TC_RES_01 - All stat cards visible on Resource Setup page", async () => {
        await resSteps.commonNavigationFlow();
        await resSteps.verifyStatCards();
    });

    // ═══════════════════════════════════════════════════════════════[...]
    // TC_RES_02 — Create Resource button opens Add Resource page
    // ═══════════════════════════════════════════════════════════════[...]
    baseTest("TC_RES_02 - Create Resource button navigates to Add Resource form", async () => {
        await resSteps.commonNavigationFlow();
        await resSteps.clickCreateResource();
        await resSteps.verifyAddResourcePage();
        await resSteps.cancelAddResource();
        await resSteps.verifyOnListingPage();
    });

    // ═══════════════════════════════════════════════════════════════[...]
    // TC_RES_03 — Search returns matching results (code / name / symbol)
    // ══════════════════════════════════════════════════════════════██[...]
    baseTest("TC_RES_03 - Search by resource code returns matching row", async () => {
        await resSteps.commonNavigationFlow();
        await resSteps.searchResource(SHARED_CODE);
        await resSteps.verifyResourceExists(SHARED_CODE);
        await resSteps.clearSearch();
    });
});
