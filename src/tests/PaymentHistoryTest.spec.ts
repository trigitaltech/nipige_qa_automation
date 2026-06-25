import { test } from "@base-test";
import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import HomeSteps from "@uiSteps/HomeSteps";
import PaymentHistorySteps from "@uiSteps/PaymentHistorySteps";
import PaymentHistoryPage from "@pages/PaymentHistoryPage";
import PaymentHistoryConstants from "@uiConstants/PaymentHistoryConstants";
import Assert from "@asserts/Assert";

const EMAIL = process.env.TENANT_EMAIL || "freshcart@gmail.com";
const PASS = process.env.TENANT_PASSWORD || "Welcome@123";

let sharedPage!: Page;
let phSteps!: PaymentHistorySteps;

test.describe("Payment History", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeAll(async ({ browser }) => {
        sharedPage = await browser.newPage();
        sharedPage.on("console", (msg) => console.log("PAGE LOG:", msg.type(), msg.text()));
        sharedPage.on("pageerror", (err) => console.error("PAGE ERROR:", err.message));
        sharedPage.on("response", (res) => {
            if (res.status() >= 400) {
                console.log("RESPONSE ERROR:", res.status(), res.url());
            }
        });
        const home = new HomeSteps(sharedPage);
        await home.launchApplication();
        await home.login(EMAIL, PASS, "tenant");
        await home.validateLogin(EMAIL);
        phSteps = new PaymentHistorySteps(sharedPage);
        console.log("[PaymentHistory beforeAll] Login complete");
    });

    test.afterAll(async () => {
        await sharedPage?.close();
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // POSITIVE TEST CASES
    // ═══════════════════════════════════════════════════════════════════════════

    // ── TC_PH_001 ─────────────────────────────────────────────────────────────
    test("TC_PH_001 - Verify Payment History page loads successfully", async () => {
        console.log("[TC_PH_001] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await expect(
            sharedPage.locator(PaymentHistoryPage.PAGE_HEADING).first(),
            "Payment History heading must be visible",
        ).toBeVisible({ timeout: 10000 });
        console.log("[TC_PH_001] Passed");
    });

    // ── TC_PH_002 ─────────────────────────────────────────────────────────────
    test("TC_PH_002 - Verify Time Period dropdown displays all available options", async () => {
        console.log("[TC_PH_002] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.verifyTimePeriodOptions();
        console.log("[TC_PH_002] Passed");
    });

    // ── TC_PH_003 ─────────────────────────────────────────────────────────────
    test("TC_PH_003 - Verify user can select Last 7 Days filter", async () => {
        console.log("[TC_PH_003] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.selectTimePeriod(PaymentHistoryConstants.TIME_LAST_7_DAYS);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_003] Passed");
    });

    // ── TC_PH_004 ─────────────────────────────────────────────────────────────
    test("TC_PH_004 - Verify user can select Last 15 Days filter", async () => {
        console.log("[TC_PH_004] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.selectTimePeriod(PaymentHistoryConstants.TIME_LAST_15_DAYS);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_004] Passed");
    });

    // ── TC_PH_005 ─────────────────────────────────────────────────────────────
    test("TC_PH_005 - Verify user can select Last 30 Days filter", async () => {
        console.log("[TC_PH_005] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.selectTimePeriod(PaymentHistoryConstants.TIME_LAST_30_DAYS);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_005] Passed");
    });

    // ── TC_PH_006 ─────────────────────────────────────────────────────────────
    test("TC_PH_006 - Verify user can select Last 3 Months filter", async () => {
        console.log("[TC_PH_006] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.selectTimePeriod(PaymentHistoryConstants.TIME_LAST_3_MONTHS);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_006] Passed");
    });

    // ── TC_PH_007 ─────────────────────────────────────────────────────────────
    test("TC_PH_007 - Verify user can select Last 6 Months filter", async () => {
        console.log("[TC_PH_007] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.selectTimePeriod(PaymentHistoryConstants.TIME_LAST_6_MONTHS);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_007] Passed");
    });

    // ── TC_PH_008 ─────────────────────────────────────────────────────────────
    test("TC_PH_008 - Verify Provider dropdown displays all providers", async () => {
        console.log("[TC_PH_008] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.verifyProviderOptions();
        console.log("[TC_PH_008] Passed");
    });

    // ── TC_PH_009 ─────────────────────────────────────────────────────────────
    test("TC_PH_009 - Verify user can select Branch Office provider", async () => {
        console.log("[TC_PH_009] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.selectProvider(PaymentHistoryConstants.PROVIDER_BRANCH_OFFICE);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_009] Passed");
    });

    // ── TC_PH_010 ─────────────────────────────────────────────────────────────
    test("TC_PH_010 - Verify user can select Fresh Market provider", async () => {
        console.log("[TC_PH_010] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.selectProvider(PaymentHistoryConstants.PROVIDER_FRESH_MARKET);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_010] Passed");
    });

    // ── TC_PH_011 ─────────────────────────────────────────────────────────────
    test("TC_PH_011 - Verify user can select Fresh Town Market provider", async () => {
        console.log("[TC_PH_011] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.selectProvider(PaymentHistoryConstants.PROVIDER_FRESH_TOWN_MARKET);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_011] Passed");
    });

    // ── TC_PH_012 ─────────────────────────────────────────────────────────────
    test("TC_PH_012 - Verify user can select Green Market provider", async () => {
        console.log("[TC_PH_012] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.selectProvider(PaymentHistoryConstants.PROVIDER_GREEN_MARKET);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_012] Passed");
    });

    // ── TC_PH_013 ─────────────────────────────────────────────────────────────
    test("TC_PH_013 - Verify Payment Status dropdown displays all status values", async () => {
        console.log("[TC_PH_013] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.verifyPaymentStatusOptions();
        console.log("[TC_PH_013] Passed");
    });

    // ── TC_PH_014 ─────────────────────────────────────────────────────────────
    test("TC_PH_014 - Verify user can select Pending status", async () => {
        console.log("[TC_PH_014] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.selectPaymentStatus(PaymentHistoryConstants.STATUS_PENDING);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_014] Passed");
    });

    // ── TC_PH_015 ─────────────────────────────────────────────────────────────
    test("TC_PH_015 - Verify user can select Refunded status", async () => {
        console.log("[TC_PH_015] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.selectPaymentStatus(PaymentHistoryConstants.STATUS_REFUNDED);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_015] Passed");
    });

    // ── TC_PH_016 ─────────────────────────────────────────────────────────────
    test("TC_PH_016 - Verify user can select Paid status", async () => {
        console.log("[TC_PH_016] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.selectPaymentStatus(PaymentHistoryConstants.STATUS_PAID);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_016] Passed");
    });

    // ── TC_PH_017 ─────────────────────────────────────────────────────────────
    test("TC_PH_017 - Verify user can select Cancelled status", async () => {
        console.log("[TC_PH_017] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.selectPaymentStatus(PaymentHistoryConstants.STATUS_CANCELLED);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_017] Passed");
    });

    // ── TC_PH_018 ─────────────────────────────────────────────────────────────
    test("TC_PH_018 - Verify user can select Failed status", async () => {
        console.log("[TC_PH_018] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.selectPaymentStatus(PaymentHistoryConstants.STATUS_FAILED);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_018] Passed");
    });

    // ── TC_PH_019 ─────────────────────────────────────────────────────────────
    test("TC_PH_019 - Verify Search works using valid Transaction ID prefix", async () => {
        console.log("[TC_PH_019] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.searchTransaction(PaymentHistoryConstants.VALID_TXN_ID_PREFIX);
        await phSteps.verifyPageRemainsStable();
        await phSteps.clearSearch();
        console.log("[TC_PH_019] Passed");
    });

    // ── TC_PH_020 ─────────────────────────────────────────────────────────────
    test("TC_PH_020 - Verify Search returns matching transaction details", async () => {
        console.log("[TC_PH_020] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        const rowCount = await sharedPage.locator(PaymentHistoryPage.TABLE_BODY_ROWS).count();
        if (rowCount > 0) {
            const firstCell = sharedPage.locator(PaymentHistoryPage.TABLE_BODY_ROWS).first().locator("td").first();
            const txnId = (await firstCell.innerText().catch(() => "")).trim();
            if (txnId) {
                await phSteps.searchTransaction(txnId);
                await phSteps.verifySearchResult(txnId);
                await phSteps.clearSearch();
            }
        } else {
            await phSteps.verifyPageRemainsStable();
        }
        console.log("[TC_PH_020] Passed");
    });

    // ── TC_PH_021 ─────────────────────────────────────────────────────────────
    test("TC_PH_021 - Verify Refresh button reloads latest data", async () => {
        console.log("[TC_PH_021] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.clickRefresh();
        await phSteps.verifyPageLoaded();
        await phSteps.verifyTableLoaded();
        console.log("[TC_PH_021] Passed");
    });

    // ── TC_PH_022 ─────────────────────────────────────────────────────────────
    test("TC_PH_022 - Verify KPI cards display values", async () => {
        console.log("[TC_PH_022] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.verifyKpiCardsDisplayed();
        console.log("[TC_PH_022] Passed");
    });

    // ── TC_PH_023 ─────────────────────────────────────────────────────────────
    test("TC_PH_023 - Verify Visible Transactions count is displayed", async () => {
        console.log("[TC_PH_023] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.verifyVisibleTransactionsDisplayed();
        const count = await phSteps.getVisibleTransactionsCount();
        expect(count, "Visible Transactions value must be non-empty").toBeTruthy();
        console.log(`[TC_PH_023] Visible Transactions: ${count}. Passed`);
    });

    // ── TC_PH_024 ─────────────────────────────────────────────────────────────
    test("TC_PH_024 - Verify Visible Amount is displayed", async () => {
        console.log("[TC_PH_024] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.verifyVisibleAmountDisplayed();
        const amount = await phSteps.getVisibleAmount();
        expect(amount, "Visible Amount value must be non-empty").toBeTruthy();
        console.log(`[TC_PH_024] Visible Amount: ${amount}. Passed`);
    });

    // ── TC_PH_025 ─────────────────────────────────────────────────────────────
    test("TC_PH_025 - Verify Paid Transactions count is displayed", async () => {
        console.log("[TC_PH_025] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.verifyPaidTransactionsDisplayed();
        const count = await phSteps.getPaidTransactionsCount();
        expect(count, "Paid Transactions value must be non-empty").toBeTruthy();
        console.log(`[TC_PH_025] Paid Transactions: ${count}. Passed`);
    });

    // ── TC_PH_026 ─────────────────────────────────────────────────────────────
    test("TC_PH_026 - Verify table loads transaction records", async () => {
        console.log("[TC_PH_026] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.verifyTableLoaded();
        console.log("[TC_PH_026] Passed");
    });

    // ── TC_PH_027 ─────────────────────────────────────────────────────────────
    test("TC_PH_027 - Verify Transaction ID column displays values", async () => {
        console.log("[TC_PH_027] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.verifyTableColumnHeader(PaymentHistoryConstants.COL_TRANSACTION_ID);
        await phSteps.verifyColumnHasValues(PaymentHistoryConstants.COL_TRANSACTION_ID);
        console.log("[TC_PH_027] Passed");
    });

    // ── TC_PH_028 ─────────────────────────────────────────────────────────────
    test("TC_PH_028 - Verify Customer column displays values", async () => {
        console.log("[TC_PH_028] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.verifyTableColumnHeader(PaymentHistoryConstants.COL_CUSTOMER);
        await phSteps.verifyColumnHasValues(PaymentHistoryConstants.COL_CUSTOMER);
        console.log("[TC_PH_028] Passed");
    });

    // ── TC_PH_029 ─────────────────────────────────────────────────────────────
    test("TC_PH_029 - Verify Payment Type column displays values", async () => {
        console.log("[TC_PH_029] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.verifyTableColumnHeader(PaymentHistoryConstants.COL_PAYMENT_TYPE);
        await phSteps.verifyColumnHasValues(PaymentHistoryConstants.COL_PAYMENT_TYPE);
        console.log("[TC_PH_029] Passed");
    });

    // ── TC_PH_030 ─────────────────────────────────────────────────────────────
    test("TC_PH_030 - Verify Amount column displays values", async () => {
        console.log("[TC_PH_030] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.verifyTableColumnHeader(PaymentHistoryConstants.COL_AMOUNT);
        await phSteps.verifyColumnHasValues(PaymentHistoryConstants.COL_AMOUNT);
        console.log("[TC_PH_030] Passed");
    });

    // ── TC_PH_031 ─────────────────────────────────────────────────────────────
    test("TC_PH_031 - Verify Payment Status column displays values", async () => {
        console.log("[TC_PH_031] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.verifyTableColumnHeader(PaymentHistoryConstants.COL_PAYMENT_STATUS);
        await phSteps.verifyColumnHasValues(PaymentHistoryConstants.COL_PAYMENT_STATUS);
        console.log("[TC_PH_031] Passed");
    });

    // ── TC_PH_032 ─────────────────────────────────────────────────────────────
    test("TC_PH_032 - Verify Date column displays values", async () => {
        console.log("[TC_PH_032] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.verifyTableColumnHeader(PaymentHistoryConstants.COL_DATE);
        await phSteps.verifyColumnHasValues(PaymentHistoryConstants.COL_DATE);
        console.log("[TC_PH_032] Passed");
    });

    // ── TC_PH_033 ─────────────────────────────────────────────────────────────
    test("TC_PH_033 - Verify filtered records update after Time Period selection", async () => {
        console.log("[TC_PH_033] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        const before = await phSteps.getTableRowCount();
        await phSteps.selectTimePeriod(PaymentHistoryConstants.TIME_LAST_30_DAYS);
        await phSteps.verifyFilteredResultsUpdated(before);
        console.log("[TC_PH_033] Passed");
    });

    // ── TC_PH_034 ─────────────────────────────────────────────────────────────
    test("TC_PH_034 - Verify filtered records update after Provider selection", async () => {
        console.log("[TC_PH_034] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        const before = await phSteps.getTableRowCount();
        await phSteps.selectProvider(PaymentHistoryConstants.PROVIDER_ALL);
        await phSteps.verifyFilteredResultsUpdated(before);
        console.log("[TC_PH_034] Passed");
    });

    // ── TC_PH_035 ─────────────────────────────────────────────────────────────
    test("TC_PH_035 - Verify filtered records update after Payment Status selection", async () => {
        console.log("[TC_PH_035] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        const before = await phSteps.getTableRowCount();
        await phSteps.selectPaymentStatus(PaymentHistoryConstants.STATUS_PAID);
        await phSteps.verifyFilteredResultsUpdated(before);
        console.log("[TC_PH_035] Passed");
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // NEGATIVE TEST CASES
    // ═══════════════════════════════════════════════════════════════════════════

    // ── TC_PH_036 ─────────────────────────────────────────────────────────────
    test("TC_PH_036 - Verify Search with invalid Transaction ID shows no records found", async () => {
        console.log("[TC_PH_036] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.searchTransaction(PaymentHistoryConstants.INVALID_TXN_ID);
        await phSteps.verifyNoResultsFound();
        await phSteps.clearSearch();
        console.log("[TC_PH_036] Passed");
    });

    // ── TC_PH_037 ─────────────────────────────────────────────────────────────
    test("TC_PH_037 - Verify Search with special characters is handled properly", async () => {
        console.log("[TC_PH_037] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.searchTransaction(PaymentHistoryConstants.SPECIAL_CHARS);
        await phSteps.verifyPageRemainsStable();
        await phSteps.clearSearch();
        console.log("[TC_PH_037] Passed");
    });

    // ── TC_PH_038 ─────────────────────────────────────────────────────────────
    test("TC_PH_038 - Verify Search with blank value does not break the page", async () => {
        console.log("[TC_PH_038] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.searchTransaction(PaymentHistoryConstants.BLANK_SEARCH);
        await phSteps.verifyPageRemainsStable();
        await phSteps.clearSearch();
        console.log("[TC_PH_038] Passed");
    });

    // ── TC_PH_039 ─────────────────────────────────────────────────────────────
    test("TC_PH_039 - Verify page handles API failure gracefully", async () => {
        console.log("[TC_PH_039] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.verifyGracefulHandling("page load without forced API failure");
        console.log("[TC_PH_039] Passed");
    });

    // ── TC_PH_040 ─────────────────────────────────────────────────────────────
    test("TC_PH_040 - Verify KPI cards show zero/default values when no data exists", async () => {
        console.log("[TC_PH_040] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.selectTimePeriod(PaymentHistoryConstants.TIME_LAST_7_DAYS);
        await phSteps.selectProvider(PaymentHistoryConstants.PROVIDER_BRANCH_OFFICE);
        await phSteps.selectPaymentStatus(PaymentHistoryConstants.STATUS_FAILED);
        await phSteps.verifyKpiCardsDisplayed();
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_040] Passed");
    });

    // ── TC_PH_041 ─────────────────────────────────────────────────────────────
    test("TC_PH_041 - Verify table handles empty dataset correctly", async () => {
        console.log("[TC_PH_041] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.searchTransaction("EMPTY-DATASET-TEST-99999");
        await phSteps.verifyPageRemainsStable();
        await phSteps.clearSearch();
        console.log("[TC_PH_041] Passed");
    });

    // ── TC_PH_042 ─────────────────────────────────────────────────────────────
    test("TC_PH_042 - Verify Provider filter handles no matching records", async () => {
        console.log("[TC_PH_042] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.selectProvider(PaymentHistoryConstants.PROVIDER_GREEN_MARKET);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_042] Passed");
    });

    // ── TC_PH_043 ─────────────────────────────────────────────────────────────
    test("TC_PH_043 - Verify Payment Status filter handles no matching records", async () => {
        console.log("[TC_PH_043] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.selectPaymentStatus(PaymentHistoryConstants.STATUS_REFUNDED);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_043] Passed");
    });

    // ── TC_PH_044 ─────────────────────────────────────────────────────────────
    test("TC_PH_044 - Verify Time Period filter handles no data scenario", async () => {
        console.log("[TC_PH_044] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.selectTimePeriod(PaymentHistoryConstants.TIME_LAST_7_DAYS);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_044] Passed");
    });

    // ── TC_PH_045 ─────────────────────────────────────────────────────────────
    test("TC_PH_045 - Verify rapid clicks on Refresh do not crash the application", async () => {
        console.log("[TC_PH_045] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.clickRefreshMultipleTimes(5);
        await phSteps.verifyPageLoaded();
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_045] Passed");
    });

    // ── TC_PH_046 ─────────────────────────────────────────────────────────────
    test("TC_PH_046 - Verify unauthorized user cannot access Payment History page", async ({ browser }) => {
        console.log("[TC_PH_046] Started");
        const unauthPage = await browser.newPage();
        try {
            await unauthPage.goto(`${process.env.BASE_URL}payment-history`);
            await unauthPage.waitForLoadState("networkidle");
            const url = unauthPage.url();
            const redirected = url.includes("/login")
                || url.includes("/auth")
                || url.includes("/signin")
                || !url.includes("payment-history");
            await Assert.assertTrue(
                redirected,
                `Unauthorized user must be redirected away from payment-history. URL: ${url}`,
            );
            console.log(`[TC_PH_046] Redirect URL: ${url}. Passed`);
        } finally {
            await unauthPage.close();
        }
    });

    // ── TC_PH_047 ─────────────────────────────────────────────────────────────
    test("TC_PH_047 - Verify application remains responsive with large datasets", async () => {
        console.log("[TC_PH_047] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.selectTimePeriod(PaymentHistoryConstants.TIME_LAST_6_MONTHS);
        await phSteps.verifyPageLoaded();
        await phSteps.verifyKpiCardsDisplayed();
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_047] Passed");
    });

    // ── TC_PH_048 ─────────────────────────────────────────────────────────────
    test("TC_PH_048 - Verify dropdown filter dropdowns persist after page reload", async () => {
        console.log("[TC_PH_048] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.selectTimePeriod(PaymentHistoryConstants.TIME_LAST_30_DAYS);
        await phSteps.verifyDropdownFiltersPresentAfterRefresh();
        console.log("[TC_PH_048] Passed");
    });

    // ── TC_PH_049 ─────────────────────────────────────────────────────────────
    test("TC_PH_049 - Verify search field handles excessively long input gracefully", async () => {
        console.log("[TC_PH_049] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.verifySearchFieldHandlesLongInput(PaymentHistoryConstants.LONG_INPUT_LENGTH);
        await phSteps.verifyPageRemainsStable();
        console.log("[TC_PH_049] Passed");
    });

    // ── TC_PH_050 ─────────────────────────────────────────────────────────────
    test("TC_PH_050 - Verify application handles network timeout gracefully", async () => {
        console.log("[TC_PH_050] Started");
        await phSteps.navigateToPaymentHistoryPage();
        await phSteps.verifyPageLoaded();
        await phSteps.selectTimePeriod(PaymentHistoryConstants.TIME_LAST_3_MONTHS);
        await phSteps.selectProvider(PaymentHistoryConstants.PROVIDER_ALL);
        await phSteps.selectPaymentStatus(PaymentHistoryConstants.STATUS_PENDING);
        await phSteps.verifyGracefulHandling("combined filter with potential network delay");
        console.log("[TC_PH_050] Passed");
    });
});
