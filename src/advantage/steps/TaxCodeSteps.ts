import test, { Page, expect } from "@playwright/test";
import Assert from "@asserts/Assert";
import TaxCodePage from "@pages/TaxCodePage";
import TaxCodeConstants from "@uiConstants/TaxCodeConstants";

export interface TaxCodeFormData {
    country: string;
    taxCode: string;
    startDate: string;
    endDate: string;
    taxLineName: string;
    taxRate: string;
}

export default class TaxCodeSteps {
    constructor(private readonly page: Page) {}

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY
    // ═══════════════════════════════════════════════════════════════════════════

    // Generates TAX_<COUNTRY_PREFIX>_<timestamp> e.g. TAX_USA_941690
    public generateUniqueTaxCode(country?: string): string {
        const ts = Date.now().toString().slice(-6);
        if (country) {
            const prefix = country.toUpperCase().replace(/[^A-Z]/g, "").substring(0, 3);
            return `TAX_${prefix}_${ts}`;
        }
        return `TAX_AUTO_${ts}`;
    }

    // Prefer network-idle over a fixed timeout; falls back if idle takes too long
    public async waitForTableStable() {
        await this.page.waitForLoadState("networkidle", { timeout: 5000 })
            .catch(() => this.page.waitForTimeout(TaxCodeConstants.TABLE_SETTLE_MS));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async navigateToTaxCode() {
        await test.step("Navigate to Tax Code listing page", async () => {
            const targetUrl = `${process.env.BASE_URL}${TaxCodePage.TAX_CODE_PATH}`;
            console.log(`[TaxCode] URL before navigation : ${this.page.url()}`);
            console.log(`[TaxCode] Navigating to         : ${targetUrl}`);
            await this.page.goto(targetUrl);
            await this.page.waitForLoadState("networkidle");
            const landedUrl = this.page.url();
            console.log(`[TaxCode] URL after navigation  : ${landedUrl}`);
            if (landedUrl.includes("/login")) {
                throw new Error(
                    `Tax Code navigation redirected to login page — `
                    + `validateLogin() must complete before navigating to protected routes. `
                    + `Actual URL: ${landedUrl}`,
                );
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGE VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyPageLoaded() {
        await test.step("Verify Tax Code listing page loaded", async () => {
            await expect(this.page).toHaveURL(
                new RegExp(TaxCodeConstants.PAGE_URL_SEGMENT), { timeout: 15000 },
            );
            const heading = this.page.locator(TaxCodePage.PAGE_HEADING).first();
            await expect(heading, "Tax Setup heading must be visible").toBeVisible({ timeout: 10000 });
            const headingText = (await heading.innerText()).trim();
            await Assert.assertContains(headingText, TaxCodeConstants.PAGE_TITLE, "Page heading");
            await expect(
                this.page.locator(TaxCodePage.TABLE),
                "Tax Code table must be present on listing page",
            ).toBeVisible({ timeout: 8000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TABLE HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    public async hasDataRows(): Promise<boolean> {
        return (await this.page.locator(TaxCodePage.TABLE_ROWS).count().catch(() => 0)) > 0;
    }

    public async getTableRowCount(): Promise<number> {
        await this.waitForTableStable();
        return this.page.locator(TaxCodePage.TABLE_ROWS).count();
    }

    public async getFirstTaxCodeName(): Promise<string> {
        const cell = this.page.locator(TaxCodePage.CELL_TAX_CODE).first();
        await expect(cell).toBeVisible({ timeout: 8000 });
        return (await cell.innerText()).trim();
    }

    public async getFirstCountryName(): Promise<string> {
        const cell = this.page.locator(TaxCodePage.CELL_COUNTRY).first();
        await expect(cell).toBeVisible({ timeout: 8000 });
        return (await cell.innerText()).trim();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SEARCH
    // ═══════════════════════════════════════════════════════════════════════════

    public async searchTaxCode(term: string) {
        await test.step(`Search for tax code: '${term}'`, async () => {
            const input = this.page.locator(TaxCodePage.SEARCH_INPUT);
            await expect(input, "Search input must be visible").toBeVisible({ timeout: 8000 });
            await input.fill(term);
            await this.waitForTableStable();
        });
    }

    public async clearSearch() {
        await test.step("Clear search field", async () => {
            await this.page.locator(TaxCodePage.SEARCH_INPUT).clear();
            await this.waitForTableStable();
        });
    }

    public async verifySearchResults(term: string) {
        await test.step(`Verify search results contain '${term}'`, async () => {
            await this.waitForTableStable();
            const count = await this.page.locator(TaxCodePage.TABLE_ROWS).count();
            if (count === 0) {
                const noRecords = this.page.locator(TaxCodePage.NO_RECORDS);
                const visible = await noRecords.isVisible({ timeout: 3000 }).catch(() => false);
                await Assert.assertTrue(visible, "No-records message shown when search returns empty");
                return;
            }
            const firstText = (await this.page.locator(TaxCodePage.CELL_TAX_CODE).first().innerText()).trim();
            await Assert.assertTrue(
                firstText.toLowerCase().includes(term.toLowerCase()),
                `First result '${firstText}' matches search term '${term}'`,
            );
        });
    }

    public async verifyTaxCodeInTable(taxCode: string) {
        await test.step(`Verify '${taxCode}' is visible in the table`, async () => {
            const row = this.page.locator(TaxCodePage.rowFor(taxCode)).first();
            await expect(row, `Row for '${taxCode}' must be visible`).toBeVisible({ timeout: 10000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // COUNTRY FILTER
    // ═══════════════════════════════════════════════════════════════════════════

    private async isNativeSelect(): Promise<boolean> {
        return (await this.page.locator(TaxCodePage.COUNTRY_SELECT).count()) > 0;
    }

    public async openCountryFilter() {
        await test.step("Open Country filter dropdown", async () => {
            if (await this.isNativeSelect()) {
                return; // Native <select> — options are read directly, no click needed
            }
            await this.page.locator(TaxCodePage.COUNTRY_FILTER_TRIGGER).first().click({ timeout: 8000 });
            await this.page.waitForTimeout(TaxCodeConstants.DROPDOWN_OPEN_MS);
        });
    }

    public async getCountryOptions(): Promise<string[]> {
        if (await this.isNativeSelect()) {
            const texts = await this.page.locator(`${TaxCodePage.COUNTRY_SELECT} option`).allTextContents();
            return texts.map((t) => t.trim()).filter(Boolean);
        }
        const options = this.page.locator(TaxCodePage.DROPDOWN_OPTION);
        await expect(options.first(), "At least one country option must appear").toBeVisible({ timeout: 5000 });
        const texts = await options.allTextContents();
        return texts.map((t) => t.trim()).filter(Boolean);
    }

    public async selectCountryOption(country: string) {
        await test.step(`Select country: '${country}'`, async () => {
            if (await this.isNativeSelect()) {
                await this.page.locator(TaxCodePage.COUNTRY_SELECT).first().selectOption(country);
            } else {
                await this.page.locator(`${TaxCodePage.DROPDOWN_OPTION}:has-text("${country}")`).first().click();
            }
            await this.waitForTableStable();
        });
    }

    public async verifyAllRowsShowCountry(country: string) {
        await test.step(`Verify every visible row has country '${country}'`, async () => {
            const count = await this.page.locator(TaxCodePage.TABLE_ROWS).count();
            if (count === 0) return;
            const allCountries = await this.page.locator(TaxCodePage.CELL_COUNTRY).allTextContents();
            for (let i = 0; i < allCountries.length; i++) {
                const c = allCountries[i].trim();
                await Assert.assertTrue(
                    c.toLowerCase() === country.toLowerCase(),
                    `Row [${i}] country '${c}' matches filter '${country}'`,
                );
            }
        });
    }

    public async clickClear() {
        await test.step("Click Clear to reset country filter", async () => {
            await this.page.locator(TaxCodePage.CLEAR_BTN).click();
            await this.waitForTableStable();
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CREATE TAX CODE
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickCreateButton() {
        await test.step("Click Create Tax Code button", async () => {
            await this.page.locator(TaxCodePage.CREATE_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyCreatePageLoaded() {
        await test.step("Verify Create Tax Code page loaded", async () => {
            await expect(this.page).toHaveURL(/taxcode\/create|taxcode\/new/, { timeout: 10000 });
            await expect(this.page.locator(TaxCodePage.CREATE_HEADING).first()).toBeVisible({ timeout: 8000 });
        });
    }

    public async fillCreateForm(data: TaxCodeFormData) {
        await test.step("Fill Create Tax Code form", async () => {
            // Tenant Country — combobox first, fall back to native select
            const countryInput = this.page.locator(TaxCodePage.TENANT_COUNTRY_INPUT).first();
            await countryInput.click();
            await countryInput.fill(data.country);
            await this.page.waitForTimeout(TaxCodeConstants.DROPDOWN_OPEN_MS);
            const countryOption = this.page
                .locator(`[role="option"]:has-text("${data.country}"), [role="listbox"] li:has-text("${data.country}")`)
                .first();
            if (await countryOption.isVisible({ timeout: 3000 }).catch(() => false)) {
                await countryOption.click();
            } else {
                await this.page.locator('select').first().selectOption(data.country).catch(() => {});
            }

            await this.page.locator(TaxCodePage.TAX_CODE_NAME_INPUT).first().fill(data.taxCode);

            // nth(0) = start date, nth(1) = end date
            const dateInputs = this.page.locator(TaxCodePage.DATE_INPUTS);
            await dateInputs.nth(0).fill(data.startDate);
            await dateInputs.nth(1).fill(data.endDate);

            await this.page.locator(TaxCodePage.TAX_LINE_NAME_INPUT).first().fill(data.taxLineName);
            await this.page.locator(TaxCodePage.TAX_RATE_INPUT).first().fill(data.taxRate);
        });
    }

    public async submitCreateForm() {
        await test.step("Click Create Tax Code submit button", async () => {
            await this.page.locator(TaxCodePage.CREATE_SUBMIT_BTN).click();
            // Wait for the network request to complete; verifySuccessMessage() checks the toast
            await this.page.waitForLoadState("networkidle", { timeout: 10000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SUCCESS / TOAST
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifySuccessMessage() {
        await test.step("Verify success toast message is displayed", async () => {
            const toast = this.page.locator(TaxCodePage.TOAST).first();
            await expect(toast, "Success toast must appear").toBeVisible({ timeout: 8000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // VIEW TAX CODE
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickViewIconForRow(taxCode: string) {
        await test.step(`Click View icon for '${taxCode}'`, async () => {
            const row = this.page.locator(TaxCodePage.rowFor(taxCode)).first();
            await expect(row, `Row for '${taxCode}' must exist`).toBeVisible({ timeout: 8000 });
            await row.locator('td:last-child').locator('button, a').nth(0).click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyViewPageLoaded() {
        await test.step("Verify View Tax Code page loaded", async () => {
            await expect(this.page).toHaveURL(/taxcode\/view/, { timeout: 10000 });
            await expect(this.page.locator(TaxCodePage.VIEW_HEADING).first()).toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyViewDetails(taxCode: string, country: string) {
        await test.step("Verify View page displays correct Tax Code details", async () => {
            const content = await this.page.content();
            await Assert.assertTrue(
                content.toLowerCase().includes(taxCode.toLowerCase()),
                `View page contains tax code name '${taxCode}'`,
            );
            await Assert.assertTrue(
                content.toLowerCase().includes(country.toLowerCase()),
                `View page contains country '${country}'`,
            );
        });
    }

    public async verifyViewFieldsNotEmpty() {
        await test.step("Verify View page fields are populated (not empty)", async () => {
            // Sidebar always has an empty "Search here" input — check known form fields directly
            const taxCodeVal = await this.page.locator(TaxCodePage.TAX_CODE_NAME_INPUT)
                .first().inputValue().catch(() => "");
            await Assert.assertTrue(taxCodeVal.trim().length > 0, "TAX CODE field is not empty");

            const dateInputs = this.page.locator(TaxCodePage.DATE_INPUTS);
            const startDateVal = await dateInputs.nth(0).inputValue().catch(() => "");
            await Assert.assertTrue(startDateVal.trim().length > 0, "START DATE field is not empty");

            const endDateVal = await dateInputs.nth(1).inputValue().catch(() => "");
            await Assert.assertTrue(endDateVal.trim().length > 0, "END DATE field is not empty");
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // EDIT TAX CODE
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickEditIconForRow(taxCode: string) {
        await test.step(`Click Edit icon for '${taxCode}'`, async () => {
            const row = this.page.locator(TaxCodePage.rowFor(taxCode)).first();
            await expect(row, `Row for '${taxCode}' must exist`).toBeVisible({ timeout: 8000 });
            await row.locator('td:last-child').locator('button, a').nth(1).click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyEditPageLoaded() {
        await test.step("Verify Edit Tax Code page loaded", async () => {
            await expect(this.page).toHaveURL(/taxcode\/edit/, { timeout: 10000 });
            await expect(this.page.locator(TaxCodePage.EDIT_HEADING).first()).toBeVisible({ timeout: 8000 });
        });
    }

    public async updateTaxRate(newRate: string) {
        await test.step(`Update Tax Rate to '${newRate}'`, async () => {
            const input = this.page.locator(TaxCodePage.TAX_RATE_INPUT).first();
            await input.click({ clickCount: 3 });
            await input.fill(newRate);
        });
    }

    public async submitEditForm() {
        await test.step("Click Update Tax Code submit button", async () => {
            await this.page.locator(TaxCodePage.UPDATE_SUBMIT_BTN).click();
            await this.page.waitForLoadState("networkidle", { timeout: 10000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DELETE TAX CODE
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickDeleteIconForRow(taxCode: string) {
        await test.step(`Click Delete icon for '${taxCode}'`, async () => {
            const row = this.page.locator(TaxCodePage.rowFor(taxCode)).first();
            await expect(row, `Row for '${taxCode}' must exist`).toBeVisible({ timeout: 8000 });
            await row.locator('td:last-child').locator('button, a').last().click();
            // Wait for the confirmation popup to appear rather than a fixed pause
            await this.page.locator(TaxCodePage.DELETE_POPUP)
                .waitFor({ state: "visible", timeout: 5000 });
        });
    }

    public async verifyDeleteConfirmationPopup(taxCode: string) {
        await test.step("Verify delete confirmation popup appears", async () => {
            const popup = this.page.locator(TaxCodePage.DELETE_POPUP).first();
            await expect(popup, "Delete confirmation popup must appear").toBeVisible({ timeout: 5000 });
            const popupText = (await popup.innerText()).toLowerCase();
            await Assert.assertTrue(
                popupText.includes("delete"),
                `Confirmation popup mentions 'delete' for tax code '${taxCode}'`,
            );
        });
    }

    public async confirmDelete() {
        await test.step("Confirm deletion — click 'Yes, delete it!'", async () => {
            await this.page.locator(TaxCodePage.DELETE_YES_BTN).first().click();
            await this.page.waitForLoadState("networkidle", { timeout: 10000 });
            // Server commits deletion asynchronously after responding; without this buffer
            // the fresh list load returns the item still present.
            await this.page.waitForTimeout(1500);
        });
    }

    public async verifyTaxCodeRemoved(taxCode: string) {
        await test.step(`Verify '${taxCode}' is no longer in the table`, async () => {
            // The search box still holds the old term from before deletion.
            // A same-value fill() fires no change event → no fresh API call → stale row visible.
            // Navigate fresh to guarantee a clean list, then re-search.
            await this.navigateToTaxCode();
            await this.searchTaxCode(taxCode);
            const deletedRow = this.page.locator(TaxCodePage.rowFor(taxCode));
            const isVisible = await deletedRow.isVisible({ timeout: 3000 }).catch(() => false);
            await Assert.assertFalse(isVisible, `Deleted tax code '${taxCode}' must not appear in table`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // BACK / LIST PAGE
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickBack() {
        await test.step("Click Back button", async () => {
            await this.page.locator(TaxCodePage.BACK_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyOnListPage() {
        await test.step("Verify navigation returned to Tax Code listing page", async () => {
            await expect(this.page).toHaveURL(
                new RegExp(TaxCodeConstants.PAGE_URL_SEGMENT), { timeout: 10000 },
            );
            await expect(this.page.locator(TaxCodePage.PAGE_HEADING).first()).toBeVisible({ timeout: 8000 });
        });
    }
}
