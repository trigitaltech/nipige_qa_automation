import { test } from "@base-test";
import type { Page } from "@playwright/test";
import HomeSteps from "@uiSteps/HomeSteps";
import TaxCodeSteps from "@uiSteps/TaxCodeSteps";
import Assert from "@asserts/Assert";
import TaxCodeConstants from "@uiConstants/TaxCodeConstants";

// ─── Credentials ─────────────────────────────────────────────────────────────
const EMAIL = process.env.TENANT_EMAIL ?? "freshcart@gmail.com";
const PASS = process.env.TENANT_PASSWORD ?? "Welcome@123";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pickRandom<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Suite-level shared state — set once in beforeAll ─────────────────────────
let sharedPage!: Page;
let tcSteps!: TaxCodeSteps;
let sharedTaxCode!: string;
let sharedCountry!: string;
const UPDATED_RATE = "18";

// ═════════════════════════════════════════════════════════════════════════════
// Tax Code Management — serial suite
//
// beforeAll:  Login + create ONE shared tax code (TAX_<PREFIX>_<ts>)
// TC_01      Search functionality (independent of shared code)
// TC_02      Country filter      (independent of shared code)
// TC_03      Verify shared tax code is listed
// TC_04      View shared tax code
// TC_05      Edit shared tax code (rate → 18)
// TC_06      Delete shared tax code — runs last, cleans up
// afterAll:  Close shared browser page
// ═════════════════════════════════════════════════════════════════════════════
test.describe("Tax Code Management", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeAll(async ({ browser }) => {
        sharedCountry = pickRandom(TaxCodeConstants.COUNTRY_POOL);
        sharedPage = await browser.newPage();

        const home = new HomeSteps(sharedPage);
        await home.launchApplication();
        await home.login(EMAIL, PASS, "tenant");
        await home.validateLogin(EMAIL);

        tcSteps = new TaxCodeSteps(sharedPage);
        sharedTaxCode = tcSteps.generateUniqueTaxCode(sharedCountry);

        // Create the ONE shared tax code used by TC_03 – TC_06
        await tcSteps.navigateToTaxCode();
        await tcSteps.verifyPageLoaded();
        await tcSteps.clickCreateButton();
        await tcSteps.verifyCreatePageLoaded();
        await tcSteps.fillCreateForm({
            country: sharedCountry,
            taxCode: sharedTaxCode,
            startDate: "2026-06-01",
            endDate: "2030-12-31",
            taxLineName: `Line_${Date.now()}`,
            taxRate: "10",
        });
        await tcSteps.submitCreateForm();
        await tcSteps.verifySuccessMessage();
        await tcSteps.navigateToTaxCode();
        console.log(`[beforeAll] Created: '${sharedTaxCode}' (country: ${sharedCountry})`);
    });

    test.afterAll(async () => {
        await sharedPage?.close();
    });

    // ─── TC_01 — Search ───────────────────────────────────────────────────────
    test("TC_01 - Verify Search Functionality", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.verifyPageLoaded();

        const hasRows = await tcSteps.hasDataRows();
        if (!hasRows) {
            console.warn("[TC_01] No tax codes in table — skipping");
            return;
        }

        const searchTerm = (await tcSteps.getFirstTaxCodeName()).substring(0, 6);
        console.log(`[TC_01] Searching for: '${searchTerm}'`);
        await tcSteps.searchTaxCode(searchTerm);
        await tcSteps.verifySearchResults(searchTerm);

        await tcSteps.clearSearch();
        await tcSteps.waitForTableStable();
        const rowCount = await tcSteps.getTableRowCount();
        await Assert.assertTrue(rowCount > 0, "All records visible after clearing search");
        console.log(`[TC_01] PASS — ${rowCount} rows visible after clear`);
    });

    // ─── TC_02 — Country Filter ───────────────────────────────────────────────
    test("TC_02 - Verify Country Filter", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.verifyPageLoaded();

        await tcSteps.openCountryFilter();
        const allOptions = await tcSteps.getCountryOptions();
        await Assert.assertTrue(allOptions.length > 0, "Country filter exposes at least one option");
        console.log(`[TC_02] Options: ${allOptions.join(" | ")}`);

        const countriesToTest = allOptions
            .filter((o) => o.toLowerCase() !== TaxCodeConstants.COUNTRY_ALL.toLowerCase() && o.trim() !== "")
            .slice(0, 3);

        // Alias to const so the loop closure doesn't capture a re-assignable let variable
        const steps = tcSteps;
        for (let i = 0; i < countriesToTest.length; i++) {
            const country = countriesToTest[i];
            await test.step(`Filter by country: '${country}'`, async () => {
                await steps.openCountryFilter();
                await steps.selectCountryOption(country);
                const count = await steps.getTableRowCount();
                console.log(`  '${country}' → ${count} row(s)`);
                if (count > 0) {
                    await steps.verifyAllRowsShowCountry(country);
                }
            });
        }

        await tcSteps.clickClear();
        const totalCount = await tcSteps.getTableRowCount();
        await Assert.assertTrue(totalCount > 0, "All records visible after clicking Clear");
        console.log(`[TC_02] PASS — ${totalCount} records after Clear`);
    });

    // ─── TC_03 — Verify the shared tax code appears in the listing ────────────
    test("TC_03 - Create Tax Code (Verify in Listing)", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.verifyTaxCodeInTable(sharedTaxCode);
        console.log(`[TC_03] PASS — '${sharedTaxCode}' confirmed in listing`);
    });

    // ─── TC_04 — View ─────────────────────────────────────────────────────────
    test("TC_04 - Verify View Tax Code", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.clickViewIconForRow(sharedTaxCode);
        await tcSteps.verifyViewPageLoaded();
        await tcSteps.verifyViewDetails(sharedTaxCode, sharedCountry);
        await tcSteps.verifyViewFieldsNotEmpty();
        await tcSteps.clickBack();
        await tcSteps.verifyOnListPage();
        console.log("[TC_04] PASS — View details verified");
    });

    // ─── TC_05 — Edit ─────────────────────────────────────────────────────────
    test("TC_05 - Edit Tax Code", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.clickEditIconForRow(sharedTaxCode);
        await tcSteps.verifyEditPageLoaded();
        await tcSteps.updateTaxRate(UPDATED_RATE);
        await tcSteps.submitEditForm();
        await tcSteps.verifySuccessMessage();

        // Confirm updated rate is reflected on the View page
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.clickViewIconForRow(sharedTaxCode);
        await tcSteps.verifyViewPageLoaded();
        const content = await sharedPage.content();
        await Assert.assertTrue(content.includes(UPDATED_RATE), `Tax rate '${UPDATED_RATE}' saved on View page`);
        await tcSteps.clickBack();
        console.log(`[TC_05] PASS — rate updated to ${UPDATED_RATE}`);
    });

    // ─── TC_06 — Delete (always last — cleans up shared tax code) ────────────
    test("TC_06 - Delete Tax Code", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.verifyTaxCodeInTable(sharedTaxCode);
        await tcSteps.clickDeleteIconForRow(sharedTaxCode);
        await tcSteps.verifyDeleteConfirmationPopup(sharedTaxCode);
        await tcSteps.confirmDelete();
        await tcSteps.verifySuccessMessage();
        await tcSteps.verifyTaxCodeRemoved(sharedTaxCode);
        console.log(`[TC_06] PASS — '${sharedTaxCode}' deleted and removed`);
    });
});
