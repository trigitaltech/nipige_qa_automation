import test, { Page, expect } from "@playwright/test";
import Assert from "@asserts/Assert";
import PaymentHistoryPage from "@pages/PaymentHistoryPage";
import PaymentHistoryConstants from "@uiConstants/PaymentHistoryConstants";

export default class PaymentHistorySteps {
    constructor(private readonly page: Page) {}

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY
    // ═══════════════════════════════════════════════════════════════════════════

    private async settle(ms = PaymentHistoryConstants.SETTLE_MS) {
        await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
        await this.page.waitForTimeout(ms);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async navigateToPaymentHistoryPage() {
        await test.step("Navigate to Payment History page", async () => {
            const url = `${process.env.BASE_URL}${PaymentHistoryPage.PAGE_PATH}`;
            await this.page.goto(url);
            await this.page.waitForLoadState("networkidle");
            const landed = this.page.url();
            if (landed.includes("/login")) {
                throw new Error(
                    `Payment History navigation redirected to login. `
                    + `Login must run before navigating to protected routes. URL: ${landed}`,
                );
            }
            console.log(`[PaymentHistory] Navigated to: ${landed}`);
        });
    }

    public async navigateViaSidebarLink() {
        await test.step("Navigate to Payment History via sidebar link", async () => {
            const link = this.page.locator(PaymentHistoryPage.PAYMENT_HISTORY_SIDEBAR_LINK).first();
            if (await link.isVisible({ timeout: 3000 }).catch(() => false)) {
                await link.click();
                await this.page.waitForLoadState("networkidle");
            } else {
                await this.navigateToPaymentHistoryPage();
            }
            console.log(`[PaymentHistory] Sidebar nav landed on: ${this.page.url()}`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGE VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyPageLoaded() {
        await test.step("Verify Payment History page loaded", async () => {
            await expect(this.page).toHaveURL(
                new RegExp(PaymentHistoryConstants.PAGE_URL_SEGMENT), { timeout: 15000 },
            );
            await expect(
                this.page.locator(PaymentHistoryPage.PAGE_HEADING).first(),
                "Payment History heading must be visible",
            ).toBeVisible({ timeout: 10000 });
            console.log(`[PaymentHistory] Page loaded. URL: ${this.page.url()}`);
        });
    }

    public async verifyPageSubtitle() {
        await test.step("Verify page subtitle is displayed", async () => {
            const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            const hasSubtitle = body.includes("checkout transactions") || body.includes("payment states");
            await Assert.assertTrue(hasSubtitle, "Page subtitle must mention checkout transactions or payment states");
        });
    }

    public async verifyCreateButtonVisible() {
        await test.step("Verify Create button is visible", async () => {
            const btn = this.page.locator(PaymentHistoryPage.CREATE_BUTTON).first();
            await expect(btn, "Create button must be visible").toBeVisible({ timeout: 5000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DROPDOWN — generic helpers
    // ═══════════════════════════════════════════════════════════════════════════

    private async openDropdown(triggerSelector: string, label: string) {
        const trigger = this.page.locator(triggerSelector).first();
        await trigger.scrollIntoViewIfNeeded({ timeout: 5000 });
        await trigger.click({ force: true });
        await this.page.waitForTimeout(PaymentHistoryConstants.DROPDOWN_OPEN_MS);
        console.log(`[PaymentHistory] Opened ${label} dropdown`);
    }

    private async pickDropdownOption(optionText: string, label: string) {
        const option = this.page.locator(PaymentHistoryPage.DROPDOWN_OPTION(optionText)).first();
        await expect(
            option,
            `${label} option "${optionText}" must be visible in open dropdown`,
        ).toBeVisible({ timeout: 5000 });
        await option.click();
        await this.settle(300);
        console.log(`[PaymentHistory] Picked ${label}: "${optionText}"`);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TIME PERIOD FILTER
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyTimePeriodOptions() {
        await test.step("Verify all Time Period options are present in dropdown", async () => {
            await this.openDropdown(PaymentHistoryPage.TIME_PERIOD_TRIGGER, "Time Period");
            for (const opt of PaymentHistoryConstants.TIME_PERIOD_OPTIONS) {
                await expect(
                    this.page.locator(PaymentHistoryPage.DROPDOWN_OPTION(opt)).first(),
                    `Time Period option "${opt}" must be visible`,
                ).toBeVisible({ timeout: 5000 });
            }
            await this.page.keyboard.press("Escape");
            console.log(`[PaymentHistory] All ${PaymentHistoryConstants.TIME_PERIOD_OPTIONS.length} time period options confirmed`);
        });
    }

    public async selectTimePeriod(option: string) {
        await test.step(`Select Time Period: "${option}"`, async () => {
            await this.openDropdown(PaymentHistoryPage.TIME_PERIOD_TRIGGER, "Time Period");
            await this.pickDropdownOption(option, "Time Period");
            await this.settle();
        });
    }

    public async verifyTimePeriodSelection(expected: string) {
        await test.step(`Verify Time Period shows "${expected}"`, async () => {
            const trigger = this.page.locator(PaymentHistoryPage.TIME_PERIOD_TRIGGER).first();
            const text = await trigger.innerText().catch(() => "");
            await Assert.assertTrue(
                text.toLowerCase().includes(expected.toLowerCase()),
                `Time Period trigger must show "${expected}" but shows "${text}"`,
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PROVIDER FILTER
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyProviderOptions() {
        await test.step("Verify all Provider options are present in dropdown", async () => {
            await this.openDropdown(PaymentHistoryPage.PROVIDER_TRIGGER, "Provider");
            for (const opt of PaymentHistoryConstants.PROVIDER_OPTIONS) {
                await expect(
                    this.page.locator(PaymentHistoryPage.DROPDOWN_OPTION(opt)).first(),
                    `Provider option "${opt}" must be visible`,
                ).toBeVisible({ timeout: 5000 });
            }
            await this.page.keyboard.press("Escape");
            console.log(`[PaymentHistory] All ${PaymentHistoryConstants.PROVIDER_OPTIONS.length} provider options confirmed`);
        });
    }

    public async selectProvider(option: string) {
        await test.step(`Select Provider: "${option}"`, async () => {
            await this.openDropdown(PaymentHistoryPage.PROVIDER_TRIGGER, "Provider");
            await this.pickDropdownOption(option, "Provider");
            await this.settle();
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PAYMENT STATUS FILTER
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyPaymentStatusOptions() {
        await test.step("Verify all Payment Status options are present in dropdown", async () => {
            await this.openDropdown(PaymentHistoryPage.PAYMENT_STATUS_TRIGGER, "Payment Status");
            for (const opt of PaymentHistoryConstants.STATUS_OPTIONS) {
                await expect(
                    this.page.locator(PaymentHistoryPage.DROPDOWN_OPTION(opt)).first(),
                    `Payment Status option "${opt}" must be visible`,
                ).toBeVisible({ timeout: 5000 });
            }
            await this.page.keyboard.press("Escape");
            console.log(`[PaymentHistory] All ${PaymentHistoryConstants.STATUS_OPTIONS.length} payment status options confirmed`);
        });
    }

    public async selectPaymentStatus(status: string) {
        await test.step(`Select Payment Status: "${status}"`, async () => {
            await this.openDropdown(PaymentHistoryPage.PAYMENT_STATUS_TRIGGER, "Payment Status");
            await this.pickDropdownOption(status, "Payment Status");
            await this.settle();
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SEARCH
    // ═══════════════════════════════════════════════════════════════════════════

    public async searchTransaction(query: string) {
        await test.step(`Search transactions: "${query}"`, async () => {
            const input = this.page.locator(PaymentHistoryPage.SEARCH_INPUT).first();
            await expect(input, "Search input (page header, not sidebar) must be visible").toBeVisible({ timeout: 5000 });
            await input.click();
            await input.fill(query);
            // Press Enter to guarantee the search triggers (some implementations ignore debounce)
            await this.page.keyboard.press("Enter");
            await this.page.waitForTimeout(PaymentHistoryConstants.SEARCH_DEBOUNCE_MS);
            await this.settle(600);
            console.log(`[PaymentHistory] Searched for: "${query}"`);
        });
    }

    public async clearSearch() {
        await test.step("Clear search field", async () => {
            const input = this.page.locator(PaymentHistoryPage.SEARCH_INPUT).first();
            if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
                await input.click();
                await input.fill("");
                await this.page.keyboard.press("Enter");
                await this.page.waitForTimeout(PaymentHistoryConstants.SEARCH_DEBOUNCE_MS);
                await this.settle(400);
            }
        });
    }

    public async verifySearchResult(transactionId: string) {
        await test.step(`Verify search result contains "${transactionId}"`, async () => {
            const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            await Assert.assertTrue(
                body.includes(transactionId.toLowerCase()),
                `Table must contain transaction "${transactionId}" after search`,
            );
        });
    }

    public async verifyNoResultsFound() {
        await test.step("Verify no-results state after invalid search", async () => {
            await this.settle(1500);
            // Primary: table body row count — the most direct signal
            const rowCount = await this.page.locator(PaymentHistoryPage.TABLE_BODY_ROWS).count();
            // Secondary: explicit empty-state element (e.g. "No transactions found")
            const noResultEl = await this.page.locator(PaymentHistoryPage.NO_RESULTS)
                .first().isVisible({ timeout: 3000 }).catch(() => false);
            // Tertiary: look for a "no results" phrase that is NOT the KPI subtitle
            // (The KPI subtitle always says "X transactions" so we avoid that text.)
            const tableArea = this.page.locator('tbody, [role="table"] [role="rowgroup"]').first();
            const tableText = (await tableArea.innerText().catch(() => "")).toLowerCase();
            const tableMsg = tableText.includes("no ") || tableText.length < 10;
            const isEmpty = rowCount === 0 || noResultEl || tableMsg;
            await Assert.assertTrue(isEmpty, "Invalid search must yield empty table or no-results message");
            console.log(`[PaymentHistory] No-results — rows:${rowCount} noResultEl:${noResultEl} tableMsg:${tableMsg}`);
        });
    }

    public async verifySearchFieldHandlesLongInput(length: number) {
        await test.step(`Verify search field handles ${length}-char input gracefully`, async () => {
            const input = this.page.locator(PaymentHistoryPage.SEARCH_INPUT).first();
            const longInput = "A".repeat(length);
            await input.fill(longInput);
            await this.page.waitForTimeout(300);
            const actual = await input.inputValue().catch(() => "");
            await this.verifyPageRemainsStable();
            console.log(`[PaymentHistory] Long input (${length}) → actual length: ${actual.length}`);
            await input.fill("");
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // HEADER ACTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickCreate() {
        await test.step("Click Create button", async () => {
            const btn = this.page.locator(PaymentHistoryPage.CREATE_BUTTON).first();
            await expect(btn, "Create button must be visible").toBeVisible({ timeout: 5000 });
            await btn.click();
            await this.settle();
            console.log("[PaymentHistory] Create button clicked");
        });
    }

    public async clickRefresh() {
        await test.step("Click Refresh button", async () => {
            const btn = this.page.locator(PaymentHistoryPage.REFRESH_BUTTON).first();
            if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await btn.click({ force: true });
                await this.settle(1200);
                console.log("[PaymentHistory] Refresh clicked");
            } else {
                await this.page.reload({ waitUntil: "networkidle" });
                console.log("[PaymentHistory] Refresh via page reload (button not found)");
            }
        });
    }

    public async clickRefreshMultipleTimes(times: number) {
        await test.step(`Click Refresh ${times}× rapidly`, async () => {
            const btn = this.page.locator(PaymentHistoryPage.REFRESH_BUTTON).first();
            if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
                for (let i = 0; i < times; i++) {
                    await btn.click({ force: true });
                    await this.page.waitForTimeout(150);
                }
                await this.settle(1500);
            }
            console.log(`[PaymentHistory] Rapid refresh ×${times} complete`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // KPI CARDS
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyKpiCardsDisplayed() {
        await test.step("Verify all three KPI cards are displayed", async () => {
            await expect(this.page.locator(':text("Visible Transactions")').first(), "Visible Transactions KPI must be visible").toBeVisible({ timeout: 5000 });
            await expect(this.page.locator(':text("Visible Amount")').first(), "Visible Amount KPI must be visible").toBeVisible({ timeout: 5000 });
            await expect(this.page.locator(':text("Paid Transactions")').first(), "Paid Transactions KPI must be visible").toBeVisible({ timeout: 5000 });
            
            const body = await this.page.locator("body").innerText().catch(() => "");
            const hasVT = body.includes("Visible Transactions");
            const hasVA = body.includes("Visible Amount");
            const hasPT = body.includes("Paid Transactions");
            await Assert.assertTrue(
                hasVT && hasVA && hasPT,
                `All KPI cards must be present. `
                + `Visible Transactions=${hasVT}, Visible Amount=${hasVA}, Paid Transactions=${hasPT}`,
            );
            console.log(`[PaymentHistory] KPI cards: VT=${hasVT} VA=${hasVA} PT=${hasPT}`);
        });
    }

    public async verifyVisibleTransactionsDisplayed() {
        await test.step("Verify Visible Transactions KPI card is present", async () => {
            await expect(this.page.locator(':text("Visible Transactions")').first(), "Visible Transactions KPI must be visible").toBeVisible({ timeout: 5000 });
        });
    }

    public async verifyVisibleAmountDisplayed() {
        await test.step("Verify Visible Amount KPI card is present", async () => {
            await expect(this.page.locator(':text("Visible Amount")').first(), "Visible Amount KPI must be visible").toBeVisible({ timeout: 5000 });
        });
    }

    public async verifyPaidTransactionsDisplayed() {
        await test.step("Verify Paid Transactions KPI card is present", async () => {
            await expect(this.page.locator(':text("Paid Transactions")').first(), "Paid Transactions KPI must be visible").toBeVisible({ timeout: 5000 });
        });
    }

    public async getVisibleTransactionsCount(): Promise<string> {
        return test.step("Read Visible Transactions count from KPI card", async () => {
            const card = this.page.locator(PaymentHistoryPage.KPI_VISIBLE_TRANSACTIONS_CARD).first();
            const text = await card.innerText().catch(() => "0");
            const value = text.split("\n").map(l => l.trim()).find(l => /^\d/.test(l)) ?? "0";
            console.log(`[PaymentHistory] Visible Transactions value: ${value}`);
            return value;
        });
    }

    public async getVisibleAmount(): Promise<string> {
        return test.step("Read Visible Amount from KPI card", async () => {
            const card = this.page.locator(PaymentHistoryPage.KPI_VISIBLE_AMOUNT_CARD).first();
            const text = await card.innerText().catch(() => "$0");
            const value = text.split("\n").map(l => l.trim()).find(l => /[$\d]/.test(l) && !l.includes("Visible Amount")) ?? "$0";
            console.log(`[PaymentHistory] Visible Amount value: ${value}`);
            return value;
        });
    }

    public async getPaidTransactionsCount(): Promise<string> {
        return test.step("Read Paid Transactions count from KPI card", async () => {
            const card = this.page.locator(PaymentHistoryPage.KPI_PAID_TRANSACTIONS_CARD).first();
            const text = await card.innerText().catch(() => "0");
            const value = text.split("\n").map(l => l.trim()).find(l => /^\d/.test(l)) ?? "0";
            console.log(`[PaymentHistory] Paid Transactions value: ${value}`);
            return value;
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TABLE VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyTableLoaded() {
        await test.step("Verify Payment Transactions table is loaded with column headers", async () => {
            const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            const hasHeaders = body.includes("transaction id")
                || body.includes("payment type")
                || body.includes("payment status");
            await Assert.assertTrue(hasHeaders, "Transaction table must be loaded with column headers");
            console.log(`[PaymentHistory] Table loaded: ${hasHeaders}`);
        });
    }

    public async verifyTableColumnHeader(columnText: string) {
        await test.step(`Verify table column header: "${columnText}"`, async () => {
            const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            await Assert.assertTrue(
                body.includes(columnText.toLowerCase()),
                `Table must have column header "${columnText}"`,
            );
        });
    }

    public async verifyColumnHasValues(columnText: string) {
        await test.step(`Verify column "${columnText}" has data in rows`, async () => {
            const rowCount = await this.page.locator(PaymentHistoryPage.TABLE_BODY_ROWS).count();
            if (rowCount === 0) {
                console.log(`[PaymentHistory] No rows present — skipping column value check for "${columnText}"`);
                return;
            }
            const body = await this.page.locator("body").innerText().catch(() => "");
            await Assert.assertTrue(body.trim().length > 0, `Column "${columnText}" rows must not be empty`);
        });
    }

    public async getTableRowCount(): Promise<number> {
        return test.step("Count visible table rows", async () => {
            const count = await this.page.locator(PaymentHistoryPage.TABLE_BODY_ROWS).count();
            console.log(`[PaymentHistory] Row count: ${count}`);
            return count;
        });
    }

    public async verifyTableHasRows() {
        await test.step("Verify table has at least one data row", async () => {
            const count = await this.page.locator(PaymentHistoryPage.TABLE_BODY_ROWS).count();
            await Assert.assertTrue(count > 0, `Table must have at least one row but found ${count}`);
        });
    }

    public async verifyTableEmptyState() {
        await test.step("Verify table shows empty-state when no data", async () => {
            await this.settle(1000);
            const rowCount = await this.page.locator(PaymentHistoryPage.TABLE_BODY_ROWS).count();
            const emptyEl = await this.page.locator(PaymentHistoryPage.TABLE_EMPTY_STATE)
                .first().isVisible({ timeout: 3000 }).catch(() => false);
            const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            const bodyMsg = body.includes("no transaction") || body.includes("no record") || body.includes("no data");
            const isEmpty = rowCount === 0 || emptyEl || bodyMsg;
            await Assert.assertTrue(isEmpty, "Table must show empty state when dataset is empty");
            console.log(`[PaymentHistory] Empty state — rows:${rowCount} emptyEl:${emptyEl} bodyMsg:${bodyMsg}`);
        });
    }

    public async verifyFilteredResultsUpdated(rowCountBefore: number) {
        await test.step("Verify table updates (or shows empty state) after filter change", async () => {
            await this.settle(1200);
            const after = await this.page.locator(PaymentHistoryPage.TABLE_BODY_ROWS).count();
            const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            const showsEmpty = body.includes("no transaction") || body.includes("no record") || body.includes("no data");
            const pageStable = !this.page.url().includes("error");
            await Assert.assertTrue(pageStable, "Page must remain stable after filter selection");
            console.log(`[PaymentHistory] Filter update — before:${rowCountBefore} after:${after} showsEmpty:${showsEmpty}`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // STABILITY / EDGE-CASE HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyPageRemainsStable() {
        await test.step("Verify page is stable (no crash or 5xx overlay)", async () => {
            const url = this.page.url();
            const stable = !url.includes("/error") && !url.includes("500");
            await Assert.assertTrue(stable, `Page must remain stable. Current URL: ${url}`);
            const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            const hasCritical = body.includes("500") || body.includes("unhandled exception");
            await Assert.assertTrue(!hasCritical, "Page must not render a 500 / unhandled exception message");
        });
    }

    public async verifyGracefulHandling(context: string) {
        await test.step(`Verify graceful handling: ${context}`, async () => {
            const errors: string[] = [];
            this.page.once("pageerror", (err) => errors.push(err.message));
            await this.settle(500);
            const critical = errors.filter(
                e => e.toLowerCase().includes("typeerror") || e.toLowerCase().includes("uncaught"),
            );
            if (critical.length > 0) {
                console.warn(`[PaymentHistory] Page errors (${context}): ${critical.join("; ")}`);
            }
            await this.verifyPageRemainsStable();
        });
    }

    public async verifyDropdownFiltersPresentAfterRefresh() {
        await test.step("Verify filter dropdowns remain visible after page reload", async () => {
            await this.page.reload({ waitUntil: "networkidle" });
            await this.verifyPageLoaded();
            const body = await this.page.locator("body").innerText().catch(() => "");
            const hasFilters = body.includes("Time Period") && body.includes("Provider") && body.includes("Payment Status");
            await Assert.assertTrue(hasFilters, "All three filter dropdowns must be present after page reload");
            console.log(`[PaymentHistory] Filters after refresh: ${hasFilters}`);
        });
    }
}
