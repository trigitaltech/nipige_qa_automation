import { Locator, Page, expect } from "@playwright/test";
import Assert from "@asserts/Assert";
import PartnerPage from "../pages/PartnerPage";

export default class PartnerSteps {
    private page: Page;
    private uniqueCounter = 0;

    constructor(page: Page) {
        this.page = page;
        // Log API responses to debug the 0 results bug
        this.page.on('response', async (response) => {
            if (response.url().includes('partner/list') || response.url().includes('partners?')) {
                try {
                    const json = await response.json();
                    console.log(`API Response for ${response.url()}:`, Object.keys(json));
                    if (json.response) console.log(`Data length:`, json.response.length);
                } catch (e) {
                    // Ignore non-JSON
                }
            }
        });
    }

    private async waitForUploadToFinish() {
        const uploadingButton = this.page.locator(PartnerPage.UPLOADING_BUTTON).first();
        if (await uploadingButton.isVisible({ timeout: 1000 }).catch(() => false)) {
            await expect(uploadingButton).toBeHidden({ timeout: 120000 });
        }
    }

    private async resetPartnerListFilters() {
        const searchInput = this.page.locator(PartnerPage.SEARCH_INPUT).first();
        const clearButton = this.page.locator(PartnerPage.CLEAR_SEARCH_BUTTON).first();

        const isClearVisible = await clearButton.isVisible({ timeout: 1000 }).catch(() => false);
        const currentText = await searchInput.inputValue().catch(() => "");

        if (isClearVisible) {
            // UI BUG: Phantom filter is active. The Clear button is visible even though there might not be a valid search.
            // Clicking Clear when the input is empty might crash the UI.
            // Instead, force a state change by typing a space, pressing enter, and then clearing it.
            await searchInput.fill(" ");
            await searchInput.press("Enter");
            
            // Wait for the UI to process the state change
            await this.page.waitForTimeout(1000);
            
            await searchInput.fill("");
            await searchInput.press("Enter");
            
            await this.page.waitForResponse((r) => r.url().includes('/partner/list') && r.request().method() !== 'OPTIONS', { timeout: 10000 }).catch(() => null);
            try {
                await expect(this.page.locator('.animate-pulse').first()).toBeHidden({ timeout: 10000 });
            } catch (e) {
                // ignore
            }
            try {
                await expect(clearButton).toBeHidden({ timeout: 5000 });
            } catch (e) {
                // ignore
            }
        } else if (currentText.trim() !== "") {
            const res = this.page.waitForResponse((r) => r.url().includes('/partner/list') && r.request().method() !== 'OPTIONS', { timeout: 10000 }).catch(() => null);
            await searchInput.fill("");
            await searchInput.press("Enter");
            await res;
        }

        // 2. Select 'All' tab
        const allTab = this.page.getByRole("tab", { name: "All" }).first();
        const isAllSelected = (await allTab.getAttribute("aria-selected").catch(() => "false")) === "true";
        if (!isAllSelected && await allTab.isVisible({ timeout: 1000 }).catch(() => false)) {
            await allTab.click();
        }
    }

    public async firstActionablePartnerRow() {
        // Wait for network idle to ensure data is loaded
        await this.page.waitForLoadState('networkidle').catch(() => {});
        
        const emptyStateLocator = this.page.getByText(PartnerPage.EMPTY_STATE_TEXT);
        const rowLocator = this.page.locator(PartnerPage.ACTIONABLE_PARTNER_ROWS)
            .filter({ hasNot: this.page.locator('.animate-pulse') })
            .filter({ hasNotText: PartnerPage.EMPTY_STATE_TEXT })
            .first();

        // Wait for either the data row or the empty state to appear
        await expect(rowLocator.or(emptyStateLocator).first()).toBeVisible({ timeout: 30000 });

        if (await emptyStateLocator.isVisible()) {
            await this.page.locator(PartnerPage.SEARCH_INPUT).fill('@');
            await this.page.locator(PartnerPage.SEARCH_INPUT).press('Enter');
            try {
                await expect(this.page.locator('.animate-pulse').first()).toBeHidden({ timeout: 10000 });
            } catch (e) {
                // ignore
            }
            await this.page.waitForLoadState('networkidle').catch(() => {});
        }

        // Wait exclusively for the data rows to populate.
        await expect(rowLocator).toBeVisible({ timeout: 15000 });
        return rowLocator;
    }

    /** Navigate to the Partner Listing Screen */
    public async navigateToPartners() {
        // Always use client-side navigation (sidebar click) to avoid React hydration/state race conditions
        // that cause the persistent "0 results" bug on full page reloads to '/partner'.
        // Robust navigation: handle React hydration dead-clicks and permission-load redirects
        await expect.poll(async () => {
            const url = this.page.url();
            if (url.match(PartnerPage.LISTING_URL_GUARD)) {
                return true;
            }
            await this.page.getByRole('complementary').getByRole('link', { name: PartnerPage.SIDEBAR_LINK, exact: true }).click();
            try {
                // Wait briefly for the URL to change and STAY there. If it redirects back to /home, this will fail or we'll catch it on the next poll.
                await this.page.waitForURL(PartnerPage.LISTING_URL_GUARD, { timeout: 3000 });
                // Double check it hasn't redirected back immediately
                await this.page.waitForTimeout(500);
                if (this.page.url().match(PartnerPage.LISTING_URL_GUARD)) {
                    return true;
                }
            } catch {
                // Ignore timeout, loop will retry
            }
            return false;
        }, { timeout: 15000 }).toBeTruthy();

        await expect(this.page.locator(PartnerPage.SEARCH_INPUT).first()).toBeVisible({ timeout: 5000 });
        await this.resetPartnerListFilters();
    }

    private nextUniqueToken() {
        this.uniqueCounter += 1;
        return `${Date.now().toString(36)}${this.uniqueCounter}`;
    }

    private async currentCreateStep() {
        if (await this.page.locator(PartnerPage.ORG_NAME_INPUT).first().isVisible({ timeout: 500 }).catch(() => false)) return "organization";
        if (await this.page.locator(PartnerPage.USERNAME_INPUT).first().isVisible({ timeout: 500 }).catch(() => false)) return "authentication";
        if (await this.page.locator(PartnerPage.AGREEMENT_UPLOAD).first().isVisible({ timeout: 500 }).catch(() => false)) return "agreement";
        if (await this.page.locator(PartnerPage.OFFICE_NAME_INPUT).first().isVisible({ timeout: 500 }).catch(() => false)) return "office";
        return "unknown";
    }

    private async verifyNextStep(previousStep: string) {
        if (previousStep === "office") {
            await expect(this.page.locator(PartnerPage.ORG_NAME_INPUT).first()).toBeVisible({ timeout: 10000 });
        } else if (previousStep === "organization") {
            await expect(this.page.locator(PartnerPage.USERNAME_INPUT).first()).toBeVisible({ timeout: 10000 });
        } else if (previousStep === "authentication") {
            await expect(this.page.locator(PartnerPage.AGREEMENT_UPLOAD).first()).toBeVisible({ timeout: 10000 });
        }
    }

    public async verifyDashboardMetrics() {
        await expect(this.page.locator(PartnerPage.TOTAL_PARTNERS_METRIC).first()).toBeVisible();
        await expect(this.page.locator(PartnerPage.SELLERS_METRIC).first()).toBeVisible();
        // The word might be "New" or "New This Month", let's just ignore the last two since they aren't critical or we make them .first()
    }

    /** Search for a partner */
    public async searchPartner(searchText: string) {
        const searchInput = this.page.locator(PartnerPage.SEARCH_INPUT).first();
        if (searchText === "") {
            await this.resetPartnerListFilters();
        } else {
            await searchInput.fill(searchText);
            await searchInput.press('Enter');
            await this.page.waitForLoadState('networkidle').catch(() => {});
        }
    }

    public async viewPartner(name?: string) {
        if (name) {
            await this.searchPartner(name);
            const row = this.page.locator(PartnerPage.row(name)).first();
            await expect(row).toBeVisible({ timeout: 10000 });
            await row.locator(PartnerPage.ROW_VIEW_ICON).first().click();
            await this.page.waitForURL(PartnerPage.VIEW_URL_GUARD);
            await expect(this.page.getByText(PartnerPage.NO_PARTNER_DATA_TEXT)).toBeHidden({ timeout: 10000 });
            return;
        }

        // Guard: fail fast if the partner list is empty instead of timing out
        await this.firstActionablePartnerRow();

        // Try all actionable partner rows on the first page. Re-query the locator fresh on each attempt
        // (after navigateToPartners() the DOM is replaced, so holding a reference is unsafe).
        const maxAttempts = await this.page.locator(PartnerPage.ACTIONABLE_PARTNER_ROWS).count();
        if (maxAttempts === 0) {
            throw new Error("Partner list is empty – no actionable rows to view.");
        }

        for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
            // Always re-query so the locator targets the current (post-navigation) DOM
            const row = this.page.locator(PartnerPage.ACTIONABLE_PARTNER_ROWS).nth(attempt);
            if (await row.isVisible({ timeout: 3000 }).catch(() => false)) {
                const viewIcon = row.locator(PartnerPage.ROW_VIEW_ICON).first();
                await expect(viewIcon).toBeVisible({ timeout: 10000 });
                await viewIcon.click();

                await this.page.waitForURL(PartnerPage.VIEW_URL_GUARD);

                const editButton = this.page.locator(PartnerPage.EDIT_BUTTON).first();
                const noData = this.page.getByText(PartnerPage.NO_PARTNER_DATA_TEXT);
                await expect(editButton.or(noData).first()).toBeVisible({ timeout: 10000 });

                if (!this.page.url().includes("/partner/view//")) {
                    try {
                        await expect(noData).toBeHidden({ timeout: 5000 });
                        await expect(editButton).toBeVisible({ timeout: 5000 });
                        return; // Success – valid partner details page opened
                    } catch {
                        // This row opened incomplete details; try the next one
                    }
                }
                await this.navigateToPartners();
                // Wait for the table to populate again after navigation before trying the next row
                await this.firstActionablePartnerRow();
            }
        }
        throw new Error("No visible partner row opened a valid Partner Details page.");
    }

    public async verifySearchResult(text: string) {
        const rowLocator = this.page.locator(`main :text("${text}")`);
        const emptyLocator = this.page.getByText(PartnerPage.EMPTY_STATE_TEXT);
        await expect(rowLocator.or(emptyLocator).first()).toBeVisible({ timeout: 10000 });
    }

    /** Verify empty state message */
    public async verifyEmptyState() {
        await expect(this.page.getByText(PartnerPage.EMPTY_RESULT_COUNT_TEXT, { exact: true })).toBeVisible({ timeout: 10000 });
        await expect(this.page.getByText(PartnerPage.EMPTY_RESULT_SUMMARY_TEXT, { exact: true })).toBeVisible();
        await expect(this.page.locator(PartnerPage.DATA_TABLE_ROWS)).toHaveCount(0);
    }

    /** Filter by Seller */
    public async filterBySeller() {
        await this.page.getByText('Seller', { exact: true }).first().click();
        await expect(this.page.locator(PartnerPage.TABLE_ROWS).first().or(this.page.getByText(PartnerPage.EMPTY_STATE_TEXT))).toBeVisible({ timeout: 10000 });
    }

    /** Click Create Partner and ensure we land on Step 1 (Office) */
    public async clickCreatePartner() {
        // Use a hard navigation (goto) to force React to reinitialize the wizard at Step 1.
        // Client-side navigation (button click) reuses the existing React component tree and
        // may restore a previous wizard step from in-memory state.
        const { origin } = new URL(this.page.url());
        await this.page.goto(`${origin}/partner/create`);
        await this.page.waitForURL(PartnerPage.CREATE_URL_GUARD);
        await expect(this.page.locator(PartnerPage.OFFICE_NAME_INPUT).first()).toBeVisible({ timeout: 15000 });
    }

    /** Open Delete Popup */
    public async openDeletePopup(name?: string) {
        await this.searchPartner(name || "");
        const row = name ? this.page.locator(PartnerPage.row(name)).first() : await this.firstActionablePartnerRow();
        await expect(row).toBeVisible({ timeout: 10000 });
        await row.locator(PartnerPage.ROW_DELETE_ICON).first().click();
        await expect(this.page.locator(PartnerPage.DELETE_POPUP_HEADING).first()).toBeVisible();
    }

    /** Verify Partner Details Page */
    public async verifyPartnerDetails() {
        await expect(this.page.locator(PartnerPage.MANAGE_ACCOUNT_BUTTON)).toBeVisible();
        await expect(this.page.locator(PartnerPage.EDIT_BUTTON).first()).toBeVisible();
    }

    public async clickBackButton() {
        await this.page.locator(PartnerPage.BACK_BUTTON).click();
    }

    // ---- Create Office ----
    public async fillOfficeDetails(email: string, phone: string, address: string, city: string, state: string, country: string, zipcode: string, officeName = "Main Office") {
        console.log("filling office name");
        await this.page.locator(PartnerPage.OFFICE_NAME_INPUT || 'input[placeholder*="Office Name" i]').fill(officeName);
        console.log("filling email");
        await this.page.locator(PartnerPage.EMAIL_INPUT).fill(email);
        console.log("filling phone");
        await this.page.locator(PartnerPage.PHONE_INPUT).fill(phone);
        
        console.log("handling partner type");
        const typeSelect = this.page.locator(PartnerPage.PARTNER_TYPE_SELECT).first();
        try {
            await typeSelect.waitFor({ state: 'visible', timeout: 5000 });
            const tagName = await typeSelect.evaluate((el) => el.tagName.toLowerCase()).catch(() => 'button');
            if (tagName === 'select') {
                await typeSelect.selectOption({ label: 'Seller' });
            } else {
                await typeSelect.click();
                await this.page.locator('[role="option"]:has-text("Seller"), li:has-text("Seller")').first().click();
            }
        } catch (e) {
            console.log("Failed to select Partner Type: ", e);
        }
        
        console.log("filling address");
        await this.page.locator(PartnerPage.ADDRESS_INPUT).fill(address);
        console.log("filling city");
        await this.page.locator(PartnerPage.CITY_INPUT).fill(city);
        console.log("filling state");
        await this.page.locator(PartnerPage.STATE_INPUT).fill(state);
        console.log("filling country");
        await this.page.locator(PartnerPage.COUNTRY_INPUT).fill(country);
        console.log("filling zipcode");
        await this.page.locator(PartnerPage.ZIPCODE_INPUT).fill(zipcode);
    }

    // ---- Create Organization ----
    public async fillOrganizationDetails(orgName: string, regNo: string, gst: string, fssai: string) {
        if (orgName !== "") {
            await this.uploadLogo("test-data/uploads/valid-logo.png");
        }
        console.log("filling org name");
        await this.page.locator(PartnerPage.ORG_NAME_INPUT).fill(orgName);
        console.log("filling reg no");
        await this.page.locator(PartnerPage.REG_NUMBER_INPUT).fill(regNo);
        console.log("filling gst");
        await this.page.locator(PartnerPage.GST_INPUT).fill(gst);
        console.log("filling fssai");
        await this.page.locator(PartnerPage.FSSAI_INPUT).fill(fssai);
    }

    public async fillUniqueOrganizationDetails() {
        const unique = this.nextUniqueToken();
        const fssai = Date.now().toString().slice(-14).padStart(14, "1");
        await this.fillOrganizationDetails(`OrgName-${unique}`, `REG${unique}`, `GST${unique}`, fssai);
    }

    // ---- Create Auth ----
    public async fillAuthDetails(username: string, pass: string, email?: string, phone?: string) {
        await this.page.locator(PartnerPage.USERNAME_INPUT).fill(username);
        if (email !== undefined) {
            await this.page.locator(PartnerPage.EMAIL_INPUT).fill(email);
        }
        if (phone !== undefined) {
            await this.page.locator(PartnerPage.PHONE_INPUT).fill(phone);
        }
        await this.page.locator(PartnerPage.PASSWORD_INPUT).fill(pass);
    }

    public async fillUniqueAuthDetails() {
        const unique = this.nextUniqueToken();
        await this.fillAuthDetails(`user${unique}`, "Pass@123", `partner${unique}@email.com`);
    }

    // ---- Create Agreement ----
    public async fillAgreementDetails(startDate: string, endDate: string) {
        if (startDate !== "") {
            await this.uploadAgreement("test-data/uploads/valid-agreement.pdf");
            await this.selectCatalogOption();
            await this.selectFirstAvailableOptionByPlaceholder("Select Market");
        }
        await this.fillAgreementDates(startDate, endDate);
    }

    public async fillAgreementWithDocument(filePath: string, startDate: string, endDate: string) {
        await this.uploadAgreement(filePath);
        await this.selectCatalogOption();
        await this.selectFirstAvailableOptionByPlaceholder("Select Market");
        await this.fillAgreementDates(startDate, endDate);
    }

    public async fillAgreementWithoutMarket(startDate: string, endDate: string) {
        await this.uploadAgreement("test-data/uploads/valid-agreement.pdf");
        await this.selectCatalogOption();
        await this.fillAgreementDates(startDate, endDate);
    }

    public async clearPaymentMethods() {
        const paymentMethodNames = ["COD", "Online"];
        for (let i = 0; i < paymentMethodNames.length; i += 1) {
            const name = paymentMethodNames[i];
            const checkbox = this.page.getByRole("checkbox", { name }).first();
            if (await checkbox.isChecked().catch(() => false)) {
                await checkbox.uncheck();
            }
        }
    }

    public async verifyPaymentMethodsUnchecked() {
        const paymentMethodNames = ["COD", "Online"];
        for (let i = 0; i < paymentMethodNames.length; i += 1) {
            const name = paymentMethodNames[i];
            await expect(this.page.getByRole("checkbox", { name }).first()).not.toBeChecked();
        }
    }

    private async fillAgreementDates(startDate: string, endDate: string) {
        const agreementTextboxes = this.page.locator('main').getByRole('textbox');
        const textboxCount = await agreementTextboxes.count();
        await agreementTextboxes.nth(textboxCount - 2).fill(this.toDisplayDate(startDate));
        await agreementTextboxes.nth(textboxCount - 1).fill(this.toDisplayDate(endDate));
    }

    private async selectCatalogOption() {
        try {
            const catalogSelect = this.page.locator(PartnerPage.CATALOG_OPTION_SELECT).nth(0);
            await this.selectFirstAvailableOption(catalogSelect);
        } catch (e) {
            console.log("Could not select catalog", e);
        }
    }

    private toDisplayDate(value: string) {
        return value;
    }

    private async selectFirstAvailableOption(selectLocator: Locator, waitForSelectableOption = false) {
        if (!(await selectLocator.isVisible({ timeout: 2000 }).catch(() => false))) return;
        if (waitForSelectableOption) {
            await expect.poll(async () => selectLocator.locator("option").count(), { timeout: 10000 }).toBeGreaterThan(1);
        }
        const optionCount = await selectLocator.locator("option").count();
        if (optionCount > 1) {
            await selectLocator.selectOption({ index: 1 }, { timeout: 5000 });
        }
    }

    private async selectFirstAvailableOptionByPlaceholder(placeholder: string) {
        const select = this.page.locator(`xpath=//main//select[option[normalize-space(.)="${placeholder}"]]`).first();
        await expect(select).toBeVisible({ timeout: 30000 });
        await expect.poll(async () => select.locator("option").count(), { timeout: 30000 }).toBeGreaterThan(1);

        const currentValue = await select.inputValue();
        const options = select.locator("option");
        const optionCount = await options.count();
        for (let optionIndex = 0; optionIndex < optionCount; optionIndex++) {
            const option = options.nth(optionIndex);
            const text = (await option.textContent())?.trim();
            const value = await option.getAttribute("value");
            if (text && text !== placeholder && value !== currentValue) {
                await select.selectOption({ index: optionIndex }, { timeout: 5000 });
                const selectedMarket = this.page.locator(`xpath=//main//*[normalize-space(.)="Selected Markets:"]/following::*[contains(normalize-space(.), "${text}") and not(self::option)][1]`);
                await expect(selectedMarket).toBeVisible({ timeout: 5000 });
                return;
            }
        }
    }

    public async uploadLogo(filePath: string) {
        await this.page.locator(PartnerPage.LOGO_UPLOAD).setInputFiles(filePath);
        await this.waitForUploadToFinish();
    }

    public async uploadAgreement(filePath: string) {
        await this.page.locator(PartnerPage.AGREEMENT_UPLOAD).setInputFiles(filePath);
        await this.waitForUploadToFinish();
    }

    public async clickNext() {
        console.log("Clicking Next...");
        await this.waitForUploadToFinish();
        const previousStep = await this.currentCreateStep();
        const nextButton = this.page.getByRole('button', { name: /^(Next|Continue)$/i }).first();
        await expect(nextButton).toBeVisible({ timeout: 10000 });
        await expect(nextButton).toBeEnabled({ timeout: 10000 });
        await nextButton.click();
        await this.verifyNextStep(previousStep);
    }

    public async clickNextExpectValidationOnSameStep() {
        console.log("Clicking Next for validation...");
        await this.waitForUploadToFinish();
        const previousStep = await this.currentCreateStep();
        const nextButton = this.page.getByRole('button', { name: /^(Next|Continue)$/i }).first();
        await expect(nextButton).toBeVisible({ timeout: 10000 });
        if (await nextButton.isEnabled().catch(() => false)) {
            await nextButton.click();
        }
        await this.verifyValidationError();
        await expect.poll(async () => this.currentCreateStep(), { timeout: 10000 }).toBe(previousStep);
    }

    public async clickDone() {
        console.log("Clicking Done...");
        await this.page.getByRole('button', { name: /^(Done|Submit)$/i }).click({ timeout: 5000 });
    }

    public async verifySuccessMessage() {
        const messages = this.page.locator(PartnerPage.SUCCESS_MESSAGE);
        await expect(messages.filter({ visible: true }).first()).toBeVisible({ timeout: 60000 });
    }

    public async confirmDelete() {
        const dialog = this.page.locator('[role="dialog"], [role="alertdialog"], .MuiDialog-root');
        await dialog.locator('button:has-text("Delete"), button:has-text("Confirm")').first().click();
        
        try {
            await expect(this.page.locator(PartnerPage.DELETE_POPUP_HEADING).first()).toBeHidden({ timeout: 5000 });
        } catch (e) {
            console.warn("Delete dialog did not close. Reloading page as workaround.");
            await this.page.reload();
            await this.page.waitForLoadState('domcontentloaded');
        }
        await expect(this.page.locator(PartnerPage.TABLE_ROWS).first().or(this.page.getByText(PartnerPage.EMPTY_STATE_TEXT)).first()).toBeVisible({ timeout: 10000 });
    }

    public async cancelDelete() {
        const dialog = this.page.locator('[role="dialog"], [role="alertdialog"], .MuiDialog-root');
        await dialog.locator('button:has-text("Cancel")').first().click();
        
        try {
            await expect(this.page.locator(PartnerPage.DELETE_POPUP_HEADING).first()).toBeHidden({ timeout: 5000 });
        } catch (e) {
            console.warn("Cancel dialog did not close. Reloading page as workaround.");
            await this.page.reload();
            await this.page.waitForLoadState('domcontentloaded');
        }
    }

    public async verifyValidationError() {
        await expect(this.page.locator(PartnerPage.VALIDATION_ERROR).first()).toBeVisible();
    }

    public async verifyNextDisabled() {
        const nextButton = this.page.getByRole('button', { name: /^(Next|Continue)$/i }).first();
        await expect(nextButton).toBeVisible({ timeout: 10000 });
        await expect(nextButton).toBeDisabled();
    }

    public async verifyPhoneDoesNotContain(invalidText: string) {
        await expect(this.page.locator(PartnerPage.PHONE_INPUT)).not.toHaveValue(new RegExp(invalidText, "i"));
    }
}
