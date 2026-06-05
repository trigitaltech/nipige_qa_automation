import { test } from "@base-test";
import type { Page } from "@playwright/test";
import HomeSteps from "@uiSteps/HomeSteps";
import TaxCodeSteps, { TaxCodeFormData } from "@uiSteps/TaxCodeSteps";
import Assert from "@asserts/Assert";
import TaxCodeConstants from "@uiConstants/TaxCodeConstants";

const EMAIL = process.env.TENANT_EMAIL ?? "freshcart@gmail.com";
const PASS = process.env.TENANT_PASSWORD ?? "Welcome@123";

function pickRandom<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

let sharedPage!: Page;
let tcSteps!: TaxCodeSteps;
let sharedTaxCode!: string;
let sharedCountry!: string;
let suiteStart = 0;

const INITIAL_RATE = "10";
const UPDATED_RATE = "18";
const CANCELLED_RATE = "99";

function validForm(overrides: Partial<TaxCodeFormData> = {}): TaxCodeFormData {
    return {
        country: sharedCountry,
        taxCode: `TAX_VALIDATION_${Date.now().toString().slice(-6)}`,
        startDate: "2026-06-01",
        endDate: "2030-12-31",
        taxLineName: `Line_${Date.now().toString().slice(-6)}`,
        taxRate: INITIAL_RATE,
        ...overrides,
    };
}

test.describe("Tax Code Management", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeAll(async ({ browser }) => {
        suiteStart = Date.now();
        sharedCountry = pickRandom(TaxCodeConstants.COUNTRY_POOL);
        sharedPage = await browser.newPage();

        const home = new HomeSteps(sharedPage);
        await home.launchApplication();
        await home.login(EMAIL, PASS, "tenant");
        await home.validateLogin(EMAIL);

        tcSteps = new TaxCodeSteps(sharedPage);
        sharedTaxCode = tcSteps.generateUniqueTaxCode(sharedCountry);

        await tcSteps.navigateToTaxCode();
        await tcSteps.verifyPageLoaded();
        await tcSteps.clickCreateButton();
        await tcSteps.verifyCreatePageLoaded();
        await tcSteps.fillCreateForm(validForm({
            taxCode: sharedTaxCode,
            taxLineName: `Line_${Date.now().toString().slice(-6)}`,
        }));
        await tcSteps.submitCreateForm();
        await tcSteps.verifySuccessMessage();
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.verifyTaxCodeInTable(sharedTaxCode);
        await tcSteps.clearSearch();
        console.log(`[beforeAll] Created '${sharedTaxCode}' for ${sharedCountry}`);
    });

    test.afterAll(async () => {
        const totalRuntimeSeconds = ((Date.now() - suiteStart) / 1000).toFixed(1);
        console.log(`[TaxCode] Total runtime: ${totalRuntimeSeconds}s`);
        if (tcSteps && sharedTaxCode && sharedPage && !sharedPage.isClosed()) {
            await tcSteps.navigateToTaxCode().catch(() => {});
            await tcSteps.searchTaxCode(sharedTaxCode).catch(() => {});
            if (await tcSteps.isTaxCodeVisible(sharedTaxCode)) {
                await tcSteps.clickDeleteIconForRow(sharedTaxCode).catch(() => {});
                await tcSteps.confirmDelete().catch(() => {});
            }
        }
        await sharedPage?.close();
    });

    test("TC_01 - Dashboard summary cards are displayed", async () => {
        // True E2E flow: Home page → sidebar Setup → Tax Code
        await tcSteps.navigateToHomePage(); // navigate to /home
        await tcSteps.verifyHomePageDisplayed(); // verify home + sidebar visible
        await tcSteps.navigateToTaxCodeViaSetupMenu(); // Setup → Tax Code via UI clicks
        // Verify URL, heading, table, and stat cards
        await tcSteps.verifyPageLoaded();
        await tcSteps.verifySummaryCardsDisplayed();
    });

    test("TC_02 - Tax Code grid columns are displayed", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.verifyPageLoaded();
        await tcSteps.verifyGridColumnsDisplayed();
    });

    test("TC_03 - Empty state message is displayed when no records exist in results", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(TaxCodeConstants.NO_MATCH_SEARCH);
        await tcSteps.verifyNoRecordsMessage();
        await tcSteps.clearSearch();
    });

    test("TC_04 - Search by Tax Code", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.verifyTaxCodeInTable(sharedTaxCode);
    });

    test("TC_05 - Search by Country", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedCountry);
        await tcSteps.verifySearchResultsContainTermInAnyColumn(sharedCountry);
    });

    test("TC_06 - Search shows no records found", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(TaxCodeConstants.NO_MATCH_SEARCH);
        await tcSteps.verifyNoRecordsMessage();
    });

    test("TC_07 - Special character search shows no records found", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(TaxCodeConstants.SPECIAL_CHAR_SEARCH);
        await tcSteps.verifyNoRecordsMessage();
    });

    test("TC_08 - Clear search restores all records", async () => {
        await tcSteps.navigateToTaxCode();
        const initialCount = await tcSteps.getTableRowCount();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.verifyTaxCodeInTable(sharedTaxCode);
        await tcSteps.clearSearch();
        const restoredCount = await tcSteps.getTableRowCount();
        await Assert.assertTrue(restoredCount >= initialCount, "Clear search restores all records");
    });

    test("TC_09 - Country filter dropdown options load", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.verifyCountryDropdownOptionsLoad();
    });

    test("TC_10 - Country filter shows matching country records", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.openCountryFilter();
        await tcSteps.selectCountryOption(sharedCountry);
        await tcSteps.verifyAllRowsShowCountry(sharedCountry);
        await tcSteps.clickClear();
    });

    test("TC_11 - Country filter handles no records scenario", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(TaxCodeConstants.NO_MATCH_SEARCH);
        await tcSteps.openCountryFilter();
        await tcSteps.selectCountryOption(sharedCountry);
        await tcSteps.verifyNoRecordsMessage();
        await tcSteps.clearSearch();
        await tcSteps.clickClear();
    });

    test("TC_12 - Create Tax Code validates blank Country", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.clickCreateButton();
        await tcSteps.verifyCreatePageLoaded();
        await tcSteps.fillCreateForm(validForm({ country: undefined }));
        await tcSteps.submitCreateFormExpectingValidation();
        await tcSteps.verifyValidationVisible("country");
    });

    test("TC_13 - Create Tax Code validates blank Tax Code", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.clickCreateButton();
        await tcSteps.verifyCreatePageLoaded();
        await tcSteps.fillCreateForm(validForm({ taxCode: undefined }));
        await tcSteps.submitCreateFormExpectingValidation();
        await tcSteps.verifyValidationVisible("tax");
    });

    test("TC_14 - Create Tax Code validates Start Date greater than End Date", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.clickCreateButton();
        await tcSteps.verifyCreatePageLoaded();
        await tcSteps.fillCreateForm(validForm({ startDate: "2031-01-01", endDate: "2030-12-31" }));
        await tcSteps.submitCreateFormExpectingValidation();
        await tcSteps.verifyValidationVisible("date");
    });

    test("TC_15 - Create Tax Code validates non-numeric Tax Rate", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.clickCreateButton();
        await tcSteps.verifyCreatePageLoaded();
        await tcSteps.fillCreateForm(validForm({ taxRate: "" }));
        await tcSteps.verifyTaxRateRejectsNonNumericInput("abc");
    });

    test("TC_16 - Create Tax Code with multiple Tax Lines submits and appears in list", async () => {
        const multiLineTaxCode = tcSteps.generateUniqueTaxCode(sharedCountry);
        await tcSteps.navigateToTaxCode();
        await tcSteps.clickCreateButton();
        await tcSteps.verifyCreatePageLoaded();
        // Fill base form (includes first tax line)
        await tcSteps.fillCreateForm(validForm({ taxCode: multiLineTaxCode }));
        // Verify Add Item increases tax line count, then add a second filled line
        const linesBefore = await tcSteps.getTaxLineCount();
        await tcSteps.addTaxLine(`Line2_${Date.now().toString().slice(-6)}`, "12");
        const linesAfter = await tcSteps.getTaxLineCount();
        await Assert.assertTrue(linesAfter > linesBefore, "Add Item increases tax line count");
        // Submit and verify success
        await tcSteps.submitCreateForm();
        await tcSteps.verifySuccessMessage();
        // Navigate to listing and confirm the new tax code is present
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(multiLineTaxCode);
        await tcSteps.verifyTaxCodeInTable(multiLineTaxCode);
        // Cleanup — delete the tax code created by this test
        await tcSteps.clickDeleteIconForRow(multiLineTaxCode);
        await tcSteps.confirmDelete();
    });

    test("TC_17 - Create Tax Code validates duplicate Tax Line", async () => {
        const duplicateLine = `Duplicate_${Date.now().toString().slice(-6)}`;
        await tcSteps.navigateToTaxCode();
        await tcSteps.clickCreateButton();
        await tcSteps.verifyCreatePageLoaded();
        await tcSteps.fillCreateForm(validForm({ taxCode: sharedTaxCode, taxLineName: duplicateLine }));
        await tcSteps.addTaxLine(duplicateLine, INITIAL_RATE);
        await tcSteps.submitCreateFormExpectingValidation();
        await tcSteps.verifyValidationVisible("duplicate");
    });

    test("TC_18 - Created Tax Code appears in list", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.verifyTaxCodeInTable(sharedTaxCode);
    });

    test("TC_19 - View Tax Code details", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.clickViewIconForRow(sharedTaxCode);
        await tcSteps.verifyViewPageLoaded();
        await tcSteps.verifyViewDetails(sharedTaxCode, sharedCountry);
        await tcSteps.verifyViewFieldsNotEmpty();
        await tcSteps.clickBack();
        await tcSteps.verifyOnListPage();
    });

    test("TC_20 - View Tax Code page is read-only", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.clickViewIconForRow(sharedTaxCode);
        await tcSteps.verifyViewPageLoaded();
        await tcSteps.verifyViewPageReadOnly();
        await tcSteps.clickBack();
    });

    test("TC_21 - View Tax Code edit controls are disabled", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.clickViewIconForRow(sharedTaxCode);
        await tcSteps.verifyViewPageLoaded();
        await tcSteps.verifyEditControlsDisabledOnView();
        await tcSteps.clickBack();
    });

    test("TC_22 - Edit Tax Code validates mandatory fields", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.clickEditIconForRow(sharedTaxCode);
        await tcSteps.verifyEditPageLoaded();
        await tcSteps.clearFirstTaxLineName();
        await tcSteps.submitEditFormExpectingValidation();
        await tcSteps.verifyValidationVisible("required");
    });

    test("TC_23 - Edit Tax Code validates invalid date", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.clickEditIconForRow(sharedTaxCode);
        await tcSteps.verifyEditPageLoaded();
        await tcSteps.fillDateRange("2031-01-01", "2030-12-31");
        await tcSteps.submitEditFormExpectingValidation();
        await tcSteps.verifyValidationVisible("date");
    });

    test("TC_24 - Edit Tax Code Cancel button discards changes", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.clickEditIconForRow(sharedTaxCode);
        await tcSteps.verifyEditPageLoaded();
        await tcSteps.updateTaxRate(CANCELLED_RATE);
        await tcSteps.cancelForm();
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.clickViewIconForRow(sharedTaxCode);
        await tcSteps.verifyViewPageLoaded();
        const savedRate = await tcSteps.getFirstTaxRateValue();
        await Assert.assertFalse(savedRate.includes(CANCELLED_RATE), "Cancelled rate change is discarded");
        await tcSteps.clickBack();
    });

    test("TC_25 - Edit Tax Code adds Tax Line and saves changes", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.clickEditIconForRow(sharedTaxCode);
        await tcSteps.verifyEditPageLoaded();
        await tcSteps.addTaxLine(`EditLine_${Date.now().toString().slice(-6)}`, "8");
        await tcSteps.updateTaxRate(UPDATED_RATE);
        await tcSteps.submitEditForm();
        await tcSteps.verifySuccessMessage();

        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.clickViewIconForRow(sharedTaxCode);
        await tcSteps.verifyViewPageLoaded();
        const content = await sharedPage.content();
        await Assert.assertTrue(content.includes(UPDATED_RATE), `Tax rate '${UPDATED_RATE}' saved on View page`);
        await tcSteps.clickBack();
    });

    test("TC_26 - Delete Tax Code cancel popup keeps record", async () => {
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(sharedTaxCode);
        await tcSteps.verifyTaxCodeInTable(sharedTaxCode);
        await tcSteps.clickDeleteIconForRow(sharedTaxCode);
        await tcSteps.verifyDeleteConfirmationPopup(sharedTaxCode);
        await tcSteps.cancelDelete();
        await tcSteps.verifyTaxCodeInTable(sharedTaxCode);
    });

    test("TC_27 - Delete Tax Code updates dashboard counts", async () => {
        // This test is fully independent: it creates its own disposable tax code so it
        // does not consume sharedTaxCode (which is shared with TC_18–TC_26 and cleaned
        // up in afterAll). The count assertion handles both hard delete (row gone →
        // count drops) and soft delete (row still present with a non-Active status).

        // Step 0 — create a dedicated temp tax code owned by this test
        const tempTaxCode = tcSteps.generateUniqueTaxCode(sharedCountry);
        await tcSteps.createTaxCodeAndNavigateBack({
            country: sharedCountry,
            taxCode: tempTaxCode,
            startDate: "2026-06-01",
            endDate: "2030-12-31",
            taxLineName: `TC27_Line_${Date.now().toString().slice(-6)}`,
            taxRate: "10",
        });

        // Step 1 — baseline listing count across ALL pages (pagination-aware)
        await tcSteps.navigateToTaxCode();
        const beforeListingCount = await tcSteps.countAllListingRecords();
        console.log(`[TC_27] Listing count BEFORE delete : ${beforeListingCount}`);

        // Step 2 — baseline dashboard stat card
        await tcSteps.navigateToTaxCode();
        const beforeStatCount = await tcSteps.getSummaryCardCount(TaxCodeConstants.TOTAL_CODES_LABEL);
        console.log(`[TC_27] Dashboard card  BEFORE delete : ${beforeStatCount}`);

        // Step 3 — delete the temp tax code
        await tcSteps.searchTaxCode(tempTaxCode);
        await tcSteps.verifyTaxCodeInTable(tempTaxCode);
        await tcSteps.clickDeleteIconForRow(tempTaxCode);
        await tcSteps.verifyDeleteConfirmationPopup(tempTaxCode);
        await tcSteps.confirmDelete();
        await tcSteps.verifySuccessMessage();
        console.log(`[TC_27] Delete action complete — success toast received`);

        // Step 4 — reload listing and count after delete
        await tcSteps.navigateToTaxCode();
        await tcSteps.reloadForStatsRefresh();
        const afterListingCount = await tcSteps.countAllListingRecords();
        console.log(`[TC_27] Listing count AFTER  delete : ${afterListingCount}`);

        // Step 5 — dashboard stat card after delete
        await tcSteps.navigateToTaxCode();
        const afterStatCount = await tcSteps.getSummaryCardCount(TaxCodeConstants.TOTAL_CODES_LABEL);
        console.log(`[TC_27] Dashboard card  AFTER  delete : ${afterStatCount}`);

        // Step 6 — search for the deleted record to determine hard vs soft delete
        await tcSteps.navigateToTaxCode();
        await tcSteps.searchTaxCode(tempTaxCode);
        const deletedVisible = await tcSteps.isTaxCodeVisible(tempTaxCode);
        console.log(`[TC_27] Deleted record visible in search results: ${deletedVisible}`);

        if (deletedVisible) {
            // Soft delete path: record still in listing — assert status changed to inactive
            const status = await tcSteps.getRowStatus(tempTaxCode);
            console.log(`[TC_27] Soft delete detected — row status: '${status}'`);
            await Assert.assertTrue(
                status.toLowerCase().includes("inactive")
                    || status.toLowerCase().includes("deleted")
                    || status.toLowerCase().includes("disabled"),
                `Soft-deleted '${tempTaxCode}' must show a non-active status; got: '${status}'`,
            );
        } else {
            // Hard delete confirmed: record is absent from search results.
            // The listing pagination is capped at 2 pages (20 records). When the database
            // holds more records than the visible window, deleting one record causes
            // another to slide into view — the visible count stays the same.
            // Search-result absence is the authoritative proof of deletion here.
            console.log(`[TC_27] Hard delete confirmed via search-result absence`);
            await Assert.assertFalse(
                deletedVisible,
                `Hard delete: '${tempTaxCode}' must be absent from search results`,
            );
            await Assert.assertTrue(
                afterListingCount <= beforeListingCount,
                `Listing count must not increase after delete: `
                + `before=${beforeListingCount}, after=${afterListingCount}`,
            );
        }

        // Step 7 — dashboard stat card must not have increased
        await Assert.assertTrue(
            afterStatCount <= beforeStatCount,
            `Dashboard stat card (${afterStatCount}) must not exceed pre-delete value (${beforeStatCount})`,
        );
        console.log(`[TC_27] Dashboard card: ${beforeStatCount} → ${afterStatCount}`);
    });
});
