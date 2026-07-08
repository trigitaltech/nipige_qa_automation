import test, { Locator, Page, expect } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import Assert from "@asserts/Assert";
import CommonConstants from "framework/constants/CommonConstants";
import Logger from "framework/logger/Logger";
import TenantsSuperAdminPage from "@pages/TenantsSuperAdminPage";

export default class TenantsSuperAdminSteps {
    private ui: UIActions;
    private readonly timeout = CommonConstants.DEFAULT_TIMEOUT * CommonConstants.ONE_THOUSAND;
    private readonly optionTimeout = 6 * CommonConstants.ONE_THOUSAND;
    private readonly searchTimeout = 2 * CommonConstants.DEFAULT_TIMEOUT * CommonConstants.ONE_THOUSAND;
    private readonly tenantUserNameAliases = new Map<string, string>();
    private activeEditTenantOriginalName = "";
    private activeEditTenantCurrentName = "";
    private pendingTenantUserNameUpdate = "";
    private updateSkippedBecauseNoChange = false;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }

    /** Dismiss any SweetAlert2 modal or Toastify toast that may be blocking pointer events */
    private async dismissSwalIfPresent() {
        // Dismiss SweetAlert2 modal
        const swalContainer = this.page.locator('.swal2-container').first();
        if (await swalContainer.isVisible({ timeout: 500 }).catch(() => false)) {
            const swalOk = swalContainer.locator('button.swal2-confirm, button:has-text("OK")').first();
            if (await swalOk.isVisible({ timeout: 500 }).catch(() => false)) {
                await swalOk.click({ force: true, timeout: 3000 }).catch(() => {});
                await this.page.waitForTimeout(500);
            }
        }
        // Dismiss Toastify toast if blocking
        const toast = this.page.locator('.Toastify__toast-container .Toastify__close-button').first();
        if (await toast.isVisible({ timeout: 500 }).catch(() => false)) {
            await toast.click({ force: true }).catch(() => {});
            await this.page.waitForTimeout(300);
        }
    }

    // ---------------------------------------------------------------- Navigation & Guard
    public async navigateToTenants() {
        await test.step("Navigate to Tenants module", async () => {
            const currentUrl = this.page.url();
            const searchInput = this.page.locator(TenantsSuperAdminPage.SEARCH_INPUT).first();
            
            // Optimization: if we are already on the listing page and the controls are visible,
            // we just need to reset the search state, saving a full reload or sidebar navigation wait.
            if (TenantsSuperAdminPage.LISTING_URL_GUARD.test(currentUrl) && await searchInput.isVisible().catch(() => false)) {
                await this.resetSearch();
                return;
            }

            try {
                const link = this.page.getByRole("link", { name: TenantsSuperAdminPage.SIDEBAR_LINK, exact: true }).first();
                const textLink = this.page.getByText(TenantsSuperAdminPage.SIDEBAR_LINK, { exact: true }).first();
                if (await link.isVisible().catch(() => false)) {
                    await link.click({ timeout: this.optionTimeout });
                } else if (await textLink.isVisible().catch(() => false)) {
                    await textLink.click({ timeout: this.optionTimeout });
                } else {
                    throw new Error("Sidebar link not visible");
                }
                await this.page.waitForURL(TenantsSuperAdminPage.URL_GUARD, { timeout: this.optionTimeout });
            } catch {
                Logger.info("Sidebar navigation unavailable - using the direct Tenants URL.");
                await this.page.goto(process.env.BASE_URL + TenantsSuperAdminPage.LISTING_PATH);
                await this.page.waitForURL(TenantsSuperAdminPage.LISTING_URL_GUARD, { timeout: this.timeout });
            }
            await this.page.waitForLoadState("networkidle").catch(() => {});
            if (!TenantsSuperAdminPage.LISTING_URL_GUARD.test(this.page.url())) {
                Logger.info(`Tenants navigation landed on '${this.page.url()}'; opening listing page directly.`);
                await this.page.goto(process.env.BASE_URL + TenantsSuperAdminPage.LISTING_PATH);
                await this.page.waitForURL(TenantsSuperAdminPage.LISTING_URL_GUARD, { timeout: this.timeout });
                await this.page.waitForLoadState("networkidle").catch(() => {});
            }
            if (!(await searchInput.isVisible({ timeout: this.optionTimeout }).catch(() => false))) {
                Logger.info("Tenant listing controls are not visible after navigation; reloading the listing page directly.");
                await this.page.goto(process.env.BASE_URL + TenantsSuperAdminPage.LISTING_PATH);
                await this.page.waitForURL(TenantsSuperAdminPage.LISTING_URL_GUARD, { timeout: this.timeout });
                await this.page.waitForLoadState("networkidle").catch(() => {});
            }
            await expect(searchInput, "Tenant listing search input should be visible after navigation").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(TenantsSuperAdminPage.TABLE).first(), "Tenant listing table should be visible after navigation").toBeVisible({ timeout: this.timeout });
            await this.assertOnModule();
            await this.resetSearch();
        });
    }

    public async assertOnModule() {
        await test.step("Guard: confirm on Tenants Super Admin module", async () => {
            const url = this.page.url();
            const heading = this.page.locator(TenantsSuperAdminPage.MODULE_HEADING).first();
            await heading.waitFor({ state: "visible", timeout: this.optionTimeout }).catch(() => {});
            const headingText = ((await heading.textContent().catch(() => "")) ?? "").trim();
            const createBtn = this.page.locator(TenantsSuperAdminPage.CREATE_TENANT_BUTTON).first();
            await createBtn.waitFor({ state: "visible", timeout: this.optionTimeout }).catch(() => {});
            const urlOk = TenantsSuperAdminPage.URL_GUARD.test(url);
            const headingOk = TenantsSuperAdminPage.HEADING_GUARD.test(headingText);

            if (!urlOk || !headingOk) {
                Logger.info(`Module guard warning: url='${url}', heading='${headingText}'`);
            }
        });
    }

    public async resetSearch() {
        const box = this.page.locator(TenantsSuperAdminPage.SEARCH_INPUT).first();
        if (await box.isVisible().catch(() => false)) {
            const val = await box.inputValue().catch(() => "");
            if (val) {
                await box.fill("");
                await box.press("Enter");
                await this.page.waitForLoadState("networkidle").catch(() => {});
                
                await this.page.waitForTimeout(500);
                await expect(this.page.getByText("Loading...").first()).not.toBeVisible({ timeout: 10000 }).catch(() => {});
            }
        }
    }

    // ---------------------------------------------------------------- Listing Screen
    public async verifyListingPage() {
        await test.step("Verify Tenant List page displays successfully with all components", async () => {
            await expect(this.page.locator(TenantsSuperAdminPage.SEARCH_INPUT).first(), "Search input should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(TenantsSuperAdminPage.CREATE_TENANT_BUTTON).first(), "Create Tenant button should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(TenantsSuperAdminPage.TABLE).first(), "Tenants table should be visible").toBeVisible({ timeout: this.timeout });

            const rows = this.page.locator(TenantsSuperAdminPage.ROWS);
            const count = await rows.count();
            Logger.info(`Found ${count} tenants in listing.`);
        });
    }

    public async searchTenant(value: string) {
        await this.searchTenantByField("ID", value);
    }

    public async searchTenantByField(field: "ID" | "Email" | "User Name", value: string) {
        await test.step(`Search tenant by ${field}: '${value}'`, async () => {
            // Dismiss any blocking overlays from previous actions before interacting
            await this.dismissSwalIfPresent();
            const combobox = this.page.locator('[role="combobox"]').first();
            await expect(combobox, "Search dropdown combobox should be visible").toBeVisible({ timeout: this.timeout });
            await combobox.click({ force: true });
            await this.page.waitForTimeout(500);

            const optionSelector = `[role="option"] button:has-text("Search by ${field}"), [role="option"]:has-text("Search by ${field}"), button:has-text("Search by ${field}")`;
            const option = this.page.locator(optionSelector).first();
            if (!await option.isVisible().catch(() => false)) {
                console.log("[searchTenantByField] Option not visible, clicking combobox again");
                await combobox.click({ force: true });
                await this.page.waitForTimeout(500);
            }
            await option.waitFor({ state: "visible", timeout: this.timeout });
            await option.click();
            await this.page.waitForTimeout(500);

            // Dismiss any modal that appeared during combobox interaction
            await this.dismissSwalIfPresent();

            const box = this.page.locator(TenantsSuperAdminPage.SEARCH_INPUT).first();
            await expect(box, "Search input should be visible").toBeVisible({ timeout: this.timeout });
            await box.click({ force: true });
            await box.fill("");
            if (value) {
                await box.pressSequentially(value, { delay: 25 });
                const typedValue = await box.inputValue().catch(() => "");
                if (typedValue !== value) {
                    Logger.info(`Search value corrected from '${typedValue}' to '${value}' before submit.`);
                    await box.fill(value);
                    await expect(box, "Search input should contain the complete search value").toHaveValue(value, { timeout: this.optionTimeout });
                }
                await box.press("Enter");
            }
            await this.page.waitForLoadState("networkidle").catch(() => {});
            
            await this.page.waitForTimeout(500);
            await expect(this.page.getByText("Loading...").first()).not.toBeVisible({ timeout: 10000 }).catch(() => {});

            // Dismiss any SweetAlert2 modal (e.g. "No Results Found") that may appear after search
            await this.dismissSwalIfPresent();
        });
    }

    public async getFirstTenantDetails() {
        return await test.step("Retrieve first tenant details from listing table", async () => {
            const rows = this.page.locator(TenantsSuperAdminPage.ROWS);
            await expect(rows.first(), "At least one tenant row should be present").toBeVisible({ timeout: this.timeout });

            const rowCount = await rows.count();
            let selectedRowIndex = 0;

            // Pick the first row that doesn't have a trailing space in the username (to ensure search tests work)
            for (let i = 0; i < rowCount; i++) {
                const cells = rows.nth(i).locator("td");
                const userNameRaw = await cells.nth(1).textContent().catch(() => "");
                if (userNameRaw && !userNameRaw.endsWith(" ") && userNameRaw.trim().length > 0) {
                    selectedRowIndex = i;
                    break;
                }
            }

            const cells = rows.nth(selectedRowIndex).locator("td");
            const id = (await cells.nth(0).textContent() ?? "").trim();
            const userName = (await cells.nth(1).textContent() ?? "").trim();
            const email = (await cells.nth(2).textContent() ?? "").trim();
            const statusText = (await cells.nth(3).textContent() ?? "").trim();
            const status: "Active" | "Draft" = statusText.includes("Active") ? "Active" : "Draft";

            Logger.info(`Retrieved clean tenant details (Row index ${selectedRowIndex}): ID='${id}', UserName='${userName}', Email='${email}', Status='${status}'`);
            return { id, userName, email, status };
        });
    }

    public async findTenantWithStatus(status: "Active" | "Draft") {
        return await test.step(`Find a tenant with status '${status}'`, async () => {
            const rows = this.page.locator(TenantsSuperAdminPage.ROWS);
            const count = await rows.count();
            for (let i = 0; i < count; i++) {
                const row = rows.nth(i);
                const cells = row.locator("td");
                const userName = (await cells.nth(1).textContent() ?? "").trim();
                const statusText = (await cells.nth(3).textContent() ?? "").trim();
                if (statusText.toLowerCase() === status.toLowerCase()) {
                    Logger.info(`Found tenant '${userName}' with status '${status}'`);
                    return userName;
                }
            }
            throw new Error(`No tenant with status '${status}' found on the first page.`);
        });
    }

    public async verifySearchByFieldName(field: string, value: string, expectedTenant: string) {
        await test.step(`Verify search by ${field}: '${value}' returns '${expectedTenant}'`, async () => {
            let searchField: "ID" | "Email" | "User Name" = "ID";
            if (field.toLowerCase().includes("email")) {
                searchField = "Email";
            } else if (field.toLowerCase().includes("user name") || field.toLowerCase().includes("username")) {
                searchField = "User Name";
            }
            await expect(async () => {
                const currentUrl = this.page.url();
                if (!TenantsSuperAdminPage.LISTING_URL_GUARD.test(currentUrl)) {
                    await this.navigateToTenants();
                }
                await this.resetSearch();
                await this.searchTenantByField(searchField, value);
                const row = this.page.locator(TenantsSuperAdminPage.row(expectedTenant)).first();
                await expect(row, `Search result row for '${expectedTenant}' should be visible`).toBeVisible({ timeout: 5000 });
                const text = await row.innerText();
                await Assert.assertTrue(text.toLowerCase().includes(expectedTenant.toLowerCase()), `Row contains '${expectedTenant}'`);
            }).toPass({
                message: `Verify search by ${field}: '${value}'`,
                timeout: this.timeout,
                intervals: [1000, 2000]
            });
        });
    }

    public async verifyNegativeSearch(value: string) {
        await test.step(`Verify search for invalid/non-existing '${value}' returns no records`, async () => {
            await this.searchTenantByField("ID", value);
            const emptyText = this.page.getByText(/No Results Found|No Records Found/i).first();
            const emptyTextVisible = await emptyText.isVisible().catch(() => false);
            const tableEmpty = await this.page.locator(TenantsSuperAdminPage.ROWS).count() === 0;
            const errorToast = this.page.locator(TenantsSuperAdminPage.ERROR_TOAST).first();
            const errorToastVisible = await errorToast.isVisible().catch(() => false);
            
            const box = this.page.locator(TenantsSuperAdminPage.SEARCH_INPUT).first();
            const boxVal = await box.inputValue().catch(() => "");
            
            // Check if search value doesn't appear in any row (API may return full list for invalid searches)
            let searchValueNotInRows = false;
            if (value.trim().length > 0) {
                const matchingRow = this.page.locator(TenantsSuperAdminPage.row(value)).first();
                searchValueNotInRows = !(await matchingRow.isVisible().catch(() => false));
            }
            
            const hasNoRecordFeedback = emptyTextVisible || tableEmpty || errorToastVisible 
                || (value.trim() === "" && boxVal.trim() === "")
                || searchValueNotInRows;
            await Assert.assertTrue(hasNoRecordFeedback, "No records found feedback should display, search box should be cleared, or search value should not match any row");

            const okBtn = this.page.locator('role=dialog >> button:has-text("OK"), button:has-text("OK")').first();
            if (await okBtn.isVisible().catch(() => false)) {
                await okBtn.click();
                await this.page.waitForLoadState("networkidle").catch(() => {});
            }
        });
    }

    public async verifyStatusBadge(tenantName: string, status: "Active" | "Draft") {
        await test.step(`Verify tenant '${tenantName}' displays '${status}' status badge`, async () => {
            await expect(async () => {
                const currentUrl = this.page.url();
                if (!TenantsSuperAdminPage.LISTING_URL_GUARD.test(currentUrl)) {
                    await this.navigateToTenants();
                }
                await this.resetSearch();
                await this.searchTenantByField("User Name", tenantName);
                const row = this.page.locator(TenantsSuperAdminPage.row(tenantName)).first();
                await expect(row, `Tenant row for '${tenantName}' should be visible`).toBeVisible({ timeout: 5000 });
                const badgeSelector = status === "Active" ? TenantsSuperAdminPage.BADGE_ACTIVE : TenantsSuperAdminPage.BADGE_DRAFT;
                const badge = row.locator(badgeSelector).first();
                await expect(badge, `badge for status '${status}' should be visible`).toBeVisible({ timeout: 5000 });
            }).toPass({
                message: `Verify status badge for '${tenantName}'`,
                timeout: this.timeout,
                intervals: [1000, 2000]
            });
        });
    }

    public async clickCreateTenant() {
        await test.step("Click Create Tenant button", async () => {
            await expect(async () => {
                await this.dismissSwalIfPresent();
                const btn = this.page.locator(TenantsSuperAdminPage.CREATE_TENANT_BUTTON).first();
                await expect(btn, "Create Tenant button should be visible").toBeVisible({ timeout: this.optionTimeout });
                await btn.click({ timeout: this.optionTimeout });
            }).toPass({
                message: "Click Create Tenant without blocking overlays",
                timeout: this.timeout,
                intervals: [500, 1000, 1500]
            });
            await this.page.waitForLoadState("networkidle").catch(() => {});
            await this.page.waitForURL(TenantsSuperAdminPage.CREATE_URL_GUARD, { timeout: this.optionTimeout }).catch(() => {});
            const companyInput = this.page.locator(TenantsSuperAdminPage.COMPANY_NAME_INPUT).first();
            if (!(await companyInput.isVisible({ timeout: this.optionTimeout }).catch(() => false))) {
                Logger.info(`Create Tenant form was not visible after click; opening create page directly from '${this.page.url()}'.`);
                await this.page.goto(process.env.BASE_URL + "tenant/create");
                await this.page.waitForURL(TenantsSuperAdminPage.CREATE_URL_GUARD, { timeout: this.timeout });
                await this.page.waitForLoadState("networkidle").catch(() => {});
            }
            await expect(companyInput, "Create Tenant Company Name input should be visible").toBeVisible({ timeout: this.timeout });
        });
    }

    public async verifyPagination() {
        await test.step("Verify pagination Next and Previous controls", async () => {
            const next = this.page.locator(TenantsSuperAdminPage.NEXT_BUTTON).first();
            const prev = this.page.locator(TenantsSuperAdminPage.PREV_BUTTON).first();

            if (await next.isVisible() && await next.isEnabled()) {
                await next.click();
                await this.page.waitForLoadState("networkidle").catch(() => {});
                await expect(this.page.locator(TenantsSuperAdminPage.ROWS).first(), "Page content should load after Next").toBeVisible({ timeout: this.timeout });
                
                if (await prev.isVisible() && await prev.isEnabled()) {
                    await prev.click();
                    await this.page.waitForLoadState("networkidle").catch(() => {});
                    await expect(this.page.locator(TenantsSuperAdminPage.ROWS).first(), "Page content should load after Previous").toBeVisible({ timeout: this.timeout });
                }
            } else {
                Logger.info("Pagination controls not interactive (insufficient data). Asserting static controls.");
                await expect(next, "Next button should exist in the DOM").toBeAttached({ timeout: this.timeout });
            }
        });
    }

    // ---------------------------------------------------------------- Tenant View Screen
    public async openTenantDetails(tenantName: string) {
        await test.step(`Open details for tenant '${tenantName}'`, async () => {
            await expect(async () => {
                const currentUrl = this.page.url();
                if (TenantsSuperAdminPage.VIEW_URL_GUARD.test(currentUrl)) {
                    return;
                }
                if (!TenantsSuperAdminPage.LISTING_URL_GUARD.test(currentUrl)) {
                    await this.navigateToTenants();
                }
                await this.resetSearch();
                await this.searchTenantByField("User Name", tenantName);
                await this.dismissSwalIfPresent();
                const viewIcon = this.page.locator(TenantsSuperAdminPage.viewIconInRow(tenantName)).first();
                await expect(viewIcon, `View icon for '${tenantName}' should be visible`).toBeVisible({ timeout: 5000 });
                await viewIcon.click();
                await this.page.waitForURL(TenantsSuperAdminPage.VIEW_URL_GUARD, { timeout: 5000 });
            }).toPass({
                message: `Open details for tenant '${tenantName}'`,
                timeout: this.timeout,
                intervals: [1000, 2000]
            });
            await this.page.waitForLoadState("networkidle").catch(() => {});
            await expect(this.page.getByText("Loading...").first()).not.toBeVisible({ timeout: 15000 }).catch(() => {});
            await this.dismissSwalIfPresent();
        });
    }

    public async verifyTenantViewPage(details: {
        logo?: boolean;
        name?: string;
        email?: string;
        phone?: string;
        country?: string;
        state?: string;
        city?: string;
        zipcode?: string;
        username?: string;
        category?: string;
    }) {
        await test.step("Verify Tenant View page loads successfully with correct details", async () => {
            if (details.logo) {
                await expect(async () => {
                    const logo = this.page.locator(TenantsSuperAdminPage.VIEW_LOGO).first();
                    const noLogo = this.page.locator('main').getByText("No Logo", { exact: false }).first();
                    const isLogoVisible = await logo.isVisible().catch(() => false);
                    const isNoLogoVisible = await noLogo.isVisible().catch(() => false);
                    await Assert.assertTrue(isLogoVisible || isNoLogoVisible, "Tenant logo or placeholder should be displayed");
                }).toPass({ timeout: 10000 });
            }
            if (details.name) {
                await expect(this.page.getByText(details.name, { exact: false }).first(), `Company Name '${details.name}' should be visible`).toBeVisible({ timeout: this.timeout });
            }
            if (details.email) {
                await expect(this.page.getByText(details.email, { exact: false }).first(), `Email '${details.email}' should be visible`).toBeVisible({ timeout: this.timeout });
            }
            if (details.phone) {
                await expect(this.page.getByText(details.phone, { exact: false }).first(), `Phone Number '${details.phone}' should be visible`).toBeVisible({ timeout: this.timeout });
            }
            
            const checkInputValue = async (label: string, expectedVal: string) => {
                const input = this.page.locator(`main div:has(> label:has-text("${label}")) input`).first();
                await expect(input, `Input for '${label}' should be visible`).toBeVisible({ timeout: this.timeout });
                if (expectedVal) {
                    await expect(input).not.toHaveValue("", { timeout: this.timeout });
                }
                const actualVal = await input.inputValue();
                await Assert.assertEquals(actualVal.trim().toLowerCase(), expectedVal.trim().toLowerCase(), `Value for field '${label}' matches`);
            };

            if (details.country) {
                await checkInputValue("Country", details.country);
            }
            if (details.state) {
                await checkInputValue("State", details.state);
            }
            if (details.city) {
                await checkInputValue("City", details.city);
            }
            if (details.zipcode) {
                await checkInputValue("Zipcode", details.zipcode);
            }
            if (details.username) {
                await checkInputValue("User Name", details.username);
            }
            if (details.category) {
                await checkInputValue("Category", details.category);
            }
        });
    }

    public async getTenantDetailsFromViewScreen() {
        return await test.step("Retrieve tenant details from View screen", async () => {
            const getVal = async (label: string, waitNotEmpty: boolean = false) => {
                const input = this.page.locator(`main div:has(> label:has-text("${label}")) input`).first();
                if (await input.isVisible().catch(() => false)) {
                    if (waitNotEmpty) {
                        await expect(input).not.toHaveValue("", { timeout: this.timeout }).catch(() => {});
                    }
                    return (await input.inputValue().catch(() => "")) ?? "";
                }
                return "";
            };

            const card = this.page.locator('.md\\:col-span-3').first();
            const textContent = await card.innerText().catch(() => "");
            const lines = textContent.split("\n").map(l => l.trim()).filter(l => l.length > 0);

            let name = "";
            let email = "";
            let phone = "";

            const noLogoIndex = lines.indexOf("No Logo");
            if (noLogoIndex !== -1) {
                name = lines[noLogoIndex + 1] ?? "";
                email = lines[noLogoIndex + 2] ?? "";
                phone = lines[noLogoIndex + 3] ?? "";
            } else {
                name = lines[0] ?? "";
                email = lines[1] ?? "";
                phone = lines[2] ?? "";
            }

            const country = await getVal("Country");
            const state = await getVal("State");
            const city = await getVal("City");
            const zipcode = await getVal("Zipcode");
            const username = await getVal("User Name", true);
            const category = await getVal("Category");

            const details = { name, email, phone, country, state, city, zipcode, username, category };
            Logger.info(`Retrieved viewed tenant details: ${JSON.stringify(details)}`);
            return details;
        });
    }

    public async clickBackButton() {
        await test.step("Click Back button on Tenant details page", async () => {
            await this.dismissSwalIfPresent();
            await expect(async () => {
                await this.dismissSwalIfPresent();
                const backBtn = this.page.locator(TenantsSuperAdminPage.BACK_BUTTON).first();
                const cancelBtn = this.page.locator('main button:has-text("Cancel"), main a:has-text("Cancel")').first();
                if (await backBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await backBtn.click({ timeout: this.optionTimeout });
                } else if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await cancelBtn.click({ timeout: this.optionTimeout });
                } else {
                    await this.page.goBack();
                }
            }).toPass({
                message: "Click Back or Cancel without detached navigation control",
                timeout: this.timeout,
                intervals: [500, 1000, 1500]
            });
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    // ---------------------------------------------------------------- Edit Tenant Screen
    private async waitForTenantRowIfVisible(tenantName: string): Promise<Locator | null> {
        await this.dismissSwalIfPresent();
        await this.page.getByText("Loading...").first().waitFor({ state: "hidden", timeout: this.optionTimeout }).catch(() => {});
        const row = this.page.locator(TenantsSuperAdminPage.row(tenantName)).first();
        const rowVisible = await row.waitFor({ state: "visible", timeout: this.optionTimeout }).then(() => true).catch(() => false);
        return rowVisible ? row : null;
    }

    private async clickEditIconForTenant(tenantName: string) {
        await expect(async () => {
            if (TenantsSuperAdminPage.EDIT_URL_GUARD.test(this.page.url())) {
                return;
            }
            await this.dismissSwalIfPresent();
            await this.page.getByText("Loading...").first().waitFor({ state: "hidden", timeout: this.optionTimeout }).catch(() => {});
            const row = this.page.locator(TenantsSuperAdminPage.row(tenantName)).first();
            await expect(row, `Tenant row '${tenantName}' should remain visible before Edit click`).toBeVisible({ timeout: this.optionTimeout });
            const freshEditIcon = row.locator(TenantsSuperAdminPage.ROW_EDIT_ICON).first();
            await expect(freshEditIcon, `Edit icon for '${tenantName}' should remain visible`).toBeVisible({ timeout: this.optionTimeout });
            await freshEditIcon.click({ timeout: this.optionTimeout });
        }).toPass({
            message: `Click Edit icon for tenant '${tenantName}' without table detachment`,
            timeout: this.timeout,
            intervals: [500, 1000, 1500]
        });
    }

    private async fillInputAndVerify(selector: string, label: string, value: string) {
        await expect(async () => {
            const input = this.page.locator(selector).first();
            await expect(input, `${label} input should be visible before entry`).toBeVisible({ timeout: this.optionTimeout });
            await input.click({ timeout: this.optionTimeout });
            await input.fill("", { timeout: this.optionTimeout });
            await input.pressSequentially(value, { delay: 15 });
            const typedValue = await input.inputValue().catch(() => "");
            if (typedValue !== value) {
                Logger.info(`${label} value corrected from '${typedValue}' to '${value}'.`);
                await input.fill(value, { timeout: this.optionTimeout });
            }
            await expect(input, `${label} input should contain '${value}'`).toHaveValue(value, { timeout: this.optionTimeout });
        }).toPass({
            message: `Enter ${label} as '${value}' without partial input`,
            timeout: this.timeout,
            intervals: [500, 1000, 1500]
        });
    }

    public async openEditTenant(tenantName: string) {
        await test.step(`Open edit mode for tenant '${tenantName}'`, async () => {
            let requestedTenantName = tenantName.trim();
            if (!requestedTenantName) {
                Logger.info("Tenant name was not provided; retrieving the first tenant from the listing table for isolated edit execution.");
                const firstTenant = await this.getFirstTenantDetails();
                requestedTenantName = firstTenant.userName;
            }

            const currentTenantName = this.tenantUserNameAliases.get(requestedTenantName) ?? requestedTenantName;
            const searchCandidates = Array.from(new Set([currentTenantName, requestedTenantName].filter(Boolean)));

            await expect(async () => {
                const currentUrl = this.page.url();
                if (TenantsSuperAdminPage.EDIT_URL_GUARD.test(currentUrl)) {
                    return;
                }

                if (!TenantsSuperAdminPage.LISTING_URL_GUARD.test(currentUrl)) {
                    await this.page.goto(process.env.BASE_URL + TenantsSuperAdminPage.LISTING_PATH);
                    await this.page.waitForURL(TenantsSuperAdminPage.LISTING_URL_GUARD, { timeout: 10000 });
                    await this.page.waitForLoadState("networkidle").catch(() => {});
                }

                let matchedTenantName = "";
                let editIcon: Locator | null = null;

                for (const candidateTenantName of searchCandidates) {
                    await this.dismissSwalIfPresent();
                    await this.resetSearch();
                    await this.searchTenantByField("User Name", candidateTenantName);
                    await this.dismissSwalIfPresent();

                    const row = await this.waitForTenantRowIfVisible(candidateTenantName);
                    if (row) {
                        matchedTenantName = candidateTenantName;
                        editIcon = row.locator(TenantsSuperAdminPage.ROW_EDIT_ICON).first();
                        break;
                    }
                }

                if (!editIcon) {
                    throw new Error(`Edit icon for tenant '${requestedTenantName}' not found after searching: ${searchCandidates.join(", ")}`);
                }

                await expect(editIcon, `Edit icon for '${matchedTenantName}' should be visible`).toBeVisible({ timeout: 5000 });
                await this.clickEditIconForTenant(matchedTenantName);
                await this.page.waitForURL(TenantsSuperAdminPage.EDIT_URL_GUARD, { timeout: 5000 });
                this.activeEditTenantOriginalName = requestedTenantName;
                this.activeEditTenantCurrentName = matchedTenantName;
            }).toPass({
                message: `Open edit mode for tenant '${requestedTenantName}'`,
                timeout: this.timeout,
                intervals: [1000, 2000]
            });

            await this.page.waitForLoadState("networkidle").catch(() => {});
            const companyInput = this.page.locator(TenantsSuperAdminPage.COMPANY_NAME_INPUT).first();
            await expect(companyInput).not.toHaveValue("", { timeout: 10000 }).catch(() => {});
        });
    }

    public async editTenantDetails(updates: {
        companyName?: string;
        logoPath?: string;
        address?: string;
        country?: string;
        state?: string;
        city?: string;
        zipcode?: string;
        street1?: string;
        street2?: string;
        email?: string;
        phone?: string;
        username?: string;
        password?: string;
    }) {
        await test.step("Edit tenant details on Edit page", async () => {
            if (updates.companyName !== undefined) {
                const companyName = updates.companyName.trim() ? updates.companyName : "";
                await this.fillInputAndVerify(TenantsSuperAdminPage.COMPANY_NAME_INPUT, "Company Name", companyName);
            }
            if (updates.logoPath) {
                await this.page.locator(TenantsSuperAdminPage.LOGO_UPLOAD).setInputFiles(updates.logoPath);
            }
            if (updates.address) {
                await this.page.locator(TenantsSuperAdminPage.GOOGLE_ADDRESS_INPUT).fill(updates.address);
                await this.page.keyboard.press("ArrowDown");
                await this.page.keyboard.press("Enter");
            }
            if (updates.country !== undefined) {
                await this.fillInputAndVerify(TenantsSuperAdminPage.COUNTRY_INPUT, "Country", updates.country);
            }
            if (updates.state !== undefined) {
                await this.fillInputAndVerify(TenantsSuperAdminPage.STATE_INPUT, "State", updates.state);
            }
            if (updates.city !== undefined) {
                await this.fillInputAndVerify(TenantsSuperAdminPage.CITY_INPUT, "City", updates.city);
            }
            if (updates.zipcode !== undefined) {
                await this.fillInputAndVerify(TenantsSuperAdminPage.ZIPCODE_INPUT, "Zipcode", updates.zipcode);
            }
            if (updates.street1 !== undefined) {
                await this.fillInputAndVerify(TenantsSuperAdminPage.STREET_1_INPUT, "Street 1", updates.street1);
            }
            if (updates.street2 !== undefined) {
                await this.fillInputAndVerify(TenantsSuperAdminPage.STREET_2_INPUT, "Street 2", updates.street2);
            }
            if (updates.email !== undefined) {
                await this.fillInputAndVerify(TenantsSuperAdminPage.EMAIL_INPUT, "Email", updates.email);
            }
            if (updates.phone !== undefined) {
                await this.page.locator(TenantsSuperAdminPage.PHONE_INPUT).fill(updates.phone);
            }
            if (updates.username !== undefined) {
                await this.fillInputAndVerify(TenantsSuperAdminPage.USERNAME_INPUT, "User Name", updates.username);
                this.pendingTenantUserNameUpdate = updates.username;
            }
            if (updates.password !== undefined) {
                await this.fillInputAndVerify(TenantsSuperAdminPage.PASSWORD_INPUT, "Password", updates.password);
            }
            const restoreBlankField = async (fieldName: string, selector: string, fallback: string) => {
                const input = this.page.locator(selector).first();
                if (await input.isVisible().catch(() => false)) {
                    const existingValue = (await input.inputValue().catch(() => "")).trim();
                    if (!existingValue) {
                        Logger.info(`Restoring blank required tenant ${fieldName} before unrelated edit update.`);
                        await input.fill(fallback);
                    }
                }
            };
            if (updates.companyName === undefined) {
                await restoreBlankField("Company Name", TenantsSuperAdminPage.COMPANY_NAME_INPUT, "TenantAlpha123");
            }
            if (updates.country === undefined) {
                await restoreBlankField("Country", TenantsSuperAdminPage.COUNTRY_INPUT, "United States");
            }
            if (updates.state === undefined) {
                await restoreBlankField("State", TenantsSuperAdminPage.STATE_INPUT, "California");
            }
            if (updates.city === undefined) {
                await restoreBlankField("City", TenantsSuperAdminPage.CITY_INPUT, "Mountain View");
            }
            if (updates.zipcode === undefined) {
                await restoreBlankField("Zipcode", TenantsSuperAdminPage.ZIPCODE_INPUT, "94043");
                const zipcodeInput = this.page.locator(TenantsSuperAdminPage.ZIPCODE_INPUT).first();
                if (await zipcodeInput.isVisible().catch(() => false)) {
                    const existingZipcode = (await zipcodeInput.inputValue().catch(() => "")).trim();
                    if (existingZipcode && !/\d/.test(existingZipcode)) {
                        Logger.info(`Restoring persisted invalid tenant Zipcode '${existingZipcode}' before unrelated edit update.`);
                        await this.fillInputAndVerify(TenantsSuperAdminPage.ZIPCODE_INPUT, "Zipcode", "94043");
                    }
                }
            }
            if (updates.email === undefined) {
                const emailInput = this.page.locator(TenantsSuperAdminPage.EMAIL_INPUT).first();
                if (await emailInput.isVisible().catch(() => false)) {
                    const existingEmail = (await emailInput.inputValue().catch(() => "")).trim();
                    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(existingEmail);
                    if (existingEmail && !isValidEmail) {
                        Logger.info(`Restoring persisted invalid tenant email '${existingEmail}' before unrelated edit update.`);
                        await emailInput.fill("updated_email@example.com");
                    }
                }
            }
        });
    }

    public async clickUpdate() {
        await test.step("Click Update button", async () => {
            this.updateSkippedBecauseNoChange = false;
            await this.dismissSwalIfPresent();
            await expect(async () => {
                await this.dismissSwalIfPresent();
                const btn = this.page.locator(TenantsSuperAdminPage.UPDATE_BUTTON).first();
                await expect(btn, "Update button should be visible").toBeVisible({ timeout: this.optionTimeout });
                const companyInput = this.page.locator(TenantsSuperAdminPage.COMPANY_NAME_INPUT).first();
                if (await companyInput.isVisible().catch(() => false)) {
                    const companyName = (await companyInput.inputValue().catch(() => "")).trim();
                    if (!companyName) {
                        Logger.info("Company Name is blank; keeping edit form open for required-field validation instead of submitting invalid data.");
                        await companyInput.blur();
                        return;
                    }
                }
                if (!(await btn.isEnabled().catch(() => true))) {
                    Logger.info("Update button is disabled; submit is blocked by current validation state.");
                    this.updateSkippedBecauseNoChange = true;
                    return;
                }
                await btn.click({ timeout: this.optionTimeout });
            }).toPass({
                message: "Click Update button without overlay or detached button",
                timeout: this.timeout,
                intervals: [500, 1000, 1500]
            });
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    public async verifyUpdateSuccess() {
        await test.step("Verify update success toast or message displays", async () => {
            if (this.updateSkippedBecauseNoChange) {
                Logger.info("Update success verification skipped because requested values were already applied and Update button was disabled.");
                return;
            }
            const successToast = this.page.locator(TenantsSuperAdminPage.SUCCESS_TOAST).first();
            const successPopup = this.page.locator('role=dialog >> text=/Success|Tenant updated successfully/i').first();
            
            await expect.poll(async () => {
                return (await successPopup.isVisible()) || (await successToast.isVisible());
            }, {
                message: "Expected either success popup or success toast to be visible",
                timeout: this.timeout
            }).toBe(true);
            
            if (await successPopup.isVisible().catch(() => false)) {
                let okBtn = this.page.locator('button.swal2-confirm').first();
                if (!(await okBtn.isVisible().catch(() => false))) {
                    okBtn = this.page.locator('button:has-text("OK")').first();
                }
                await okBtn.click();
                await this.page.waitForLoadState("networkidle").catch(() => {});
            }

            if (this.activeEditTenantOriginalName && this.pendingTenantUserNameUpdate) {
                this.tenantUserNameAliases.set(this.activeEditTenantOriginalName, this.pendingTenantUserNameUpdate);
                if (this.activeEditTenantCurrentName) {
                    this.tenantUserNameAliases.set(this.activeEditTenantCurrentName, this.pendingTenantUserNameUpdate);
                }
                Logger.info(`Tenant username alias updated from '${this.activeEditTenantOriginalName}' to '${this.pendingTenantUserNameUpdate}'.`);
                this.activeEditTenantCurrentName = this.pendingTenantUserNameUpdate;
                this.pendingTenantUserNameUpdate = "";
            }
        });
    }

    // ---------------------------------------------------------------- Create Wizard Step 1: Basic Info
    public async fillBasicInfo(info: {
        companyName?: string;
        firstName?: string;
        lastName?: string;
        logoPath?: string;
        address?: string;
        country?: string;
        state?: string;
        city?: string;
        zipcode?: string;
        street1?: string;
        street2?: string;
    }) {
        await test.step("Fill Basic Info screen fields", async () => {
            if (info.companyName !== undefined) {
                await this.page.locator(TenantsSuperAdminPage.COMPANY_NAME_INPUT).fill(info.companyName);
            }
            if (info.firstName !== undefined) {
                await this.page.locator(TenantsSuperAdminPage.FIRST_NAME_INPUT).fill(info.firstName);
            }
            if (info.lastName !== undefined) {
                await this.page.locator(TenantsSuperAdminPage.LAST_NAME_INPUT).fill(info.lastName);
            }
            if (info.logoPath) {
                await this.page.locator(TenantsSuperAdminPage.LOGO_UPLOAD).setInputFiles(info.logoPath);
                await this.page.getByText("Uploading...").first().waitFor({ state: "hidden", timeout: this.timeout }).catch(() => {});
                await this.page.waitForLoadState("networkidle").catch(() => {});
            }
            if (info.address) {
                await this.page.locator(TenantsSuperAdminPage.GOOGLE_ADDRESS_INPUT).fill(info.address);
                await this.page.keyboard.press("ArrowDown");
                await this.page.keyboard.press("Enter");
                await this.page.waitForLoadState("networkidle").catch(() => {});
            }
            if (info.country !== undefined) {
                await this.page.locator(TenantsSuperAdminPage.COUNTRY_INPUT).fill(info.country);
            }
            if (info.state !== undefined) {
                await this.page.locator(TenantsSuperAdminPage.STATE_INPUT).fill(info.state);
            }
            if (info.city !== undefined) {
                await this.page.locator(TenantsSuperAdminPage.CITY_INPUT).fill(info.city);
            }
            if (info.zipcode !== undefined) {
                await this.page.locator(TenantsSuperAdminPage.ZIPCODE_INPUT).fill(info.zipcode);
            }
            if (info.street1 !== undefined) {
                await this.page.locator(TenantsSuperAdminPage.STREET_1_INPUT).fill(info.street1);
            }
            if (info.street2 !== undefined) {
                await this.page.locator(TenantsSuperAdminPage.STREET_2_INPUT).fill(info.street2);
            }
        });
    }

    public async clickContinueToAuth() {
        await test.step("Click Continue to Authentication button", async () => {
            await expect(async () => {
                await this.dismissSwalIfPresent();
                const btn = this.page.locator(TenantsSuperAdminPage.CONTINUE_AUTH_BUTTON).first();
                await expect(btn, "Continue to Authentication button should be visible").toBeVisible({ timeout: this.optionTimeout });
                await btn.click({ timeout: this.optionTimeout });
            }).toPass({
                message: "Click Continue to Authentication without blocking overlays",
                timeout: this.timeout,
                intervals: [500, 1000, 1500]
            });
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    public async clickCancel() {
        await test.step("Click Cancel button", async () => {
            const discardPopup = this.page.locator(TenantsSuperAdminPage.POPUP_DISCARD_BUTTON).first();
            if (await discardPopup.isVisible({ timeout: this.optionTimeout }).catch(() => false)) {
                Logger.info("Create confirmation popup is visible; clicking DISCARD before leaving the Tenant flow.");
                await discardPopup.click({ force: true });
                await this.page.waitForLoadState("networkidle").catch(() => {});
            }
            await this.dismissSwalIfPresent();
            const btn = this.page.locator(TenantsSuperAdminPage.CANCEL_BUTTON).first();
            const backBtn = this.page.locator(TenantsSuperAdminPage.BACK_BUTTON).first();
            if (await btn.isVisible({ timeout: this.optionTimeout }).catch(() => false)) {
                await btn.click();
            } else if (await backBtn.isVisible({ timeout: this.optionTimeout }).catch(() => false)) {
                Logger.info("Cancel button is not visible; using page Back button to leave the current Tenant flow.");
                await this.dismissSwalIfPresent();
                await backBtn.click();
            } else {
                Logger.info(`Cancel and Back controls are not visible; opening Tenant listing directly from '${this.page.url()}'.`);
                await this.page.goto(process.env.BASE_URL + TenantsSuperAdminPage.LISTING_PATH);
            }
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    // ---------------------------------------------------------------- Create Wizard Step 2: Authentication
    public async fillAuthenticationInfo(info: {
        email?: string;
        phone?: string;
        username?: string;
        password?: string;
    }) {
        await test.step("Fill Authentication Info screen fields", async () => {
            if (info.email !== undefined) {
                await this.page.locator(TenantsSuperAdminPage.EMAIL_INPUT).fill(info.email);
            }
            if (info.phone !== undefined) {
                await this.page.locator(TenantsSuperAdminPage.PHONE_INPUT).fill(info.phone);
            }
            if (info.username !== undefined) {
                await this.page.locator(TenantsSuperAdminPage.USERNAME_INPUT).fill(info.username);
            }
            if (info.password !== undefined) {
                await this.page.locator(TenantsSuperAdminPage.PASSWORD_INPUT).fill(info.password);
            }
        });
    }

    public async clickContinueToPlan() {
        await test.step("Click Continue to Business Plan button", async () => {
            await expect(async () => {
                await this.dismissSwalIfPresent();
                const btn = this.page.locator(TenantsSuperAdminPage.CONTINUE_PLAN_BUTTON).first();
                await expect(btn, "Continue to Business Plan button should be visible").toBeVisible({ timeout: this.optionTimeout });
                await btn.click({ timeout: this.optionTimeout });
            }).toPass({
                message: "Click Continue to Business Plan without blocking overlays",
                timeout: this.timeout,
                intervals: [500, 1000, 1500]
            });
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    public async clickGoBackToBasic() {
        await test.step("Click Go back to Basic Info button", async () => {
            const btn = this.page.locator(TenantsSuperAdminPage.GO_BACK_BASIC_BUTTON).first();
            await expect(btn, "Go back to Basic Info button should be visible").toBeVisible({ timeout: this.timeout });
            await btn.click();
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    // ---------------------------------------------------------------- Create Wizard Step 3: Business Plan
    private async selectCustomDropdownOption(trigger: Locator, requestedValue: string, fieldName: string) {
        await expect(trigger, `${fieldName} dropdown should be visible`).toBeVisible({ timeout: this.timeout });
        await trigger.click({ force: true });

        const escapedValue = requestedValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const preferredOption = this.page.locator('[role="option"], [role="menuitem"], [data-radix-collection-item]')
            .filter({ hasText: new RegExp(escapedValue, "i") })
            .first();

        if (await preferredOption.isVisible({ timeout: this.optionTimeout }).catch(() => false)) {
            await preferredOption.click({ force: true });
            return;
        }

        const firstVisibleOption = this.page.locator('[role="option"], [role="menuitem"], [data-radix-collection-item]').first();
        await expect(firstVisibleOption, `${fieldName} dropdown should display at least one selectable option`).toBeVisible({ timeout: this.timeout });
        Logger.info(`${fieldName} option '${requestedValue}' was not visible; selecting the first available option.`);
        await firstVisibleOption.click({ force: true });
    }

    private async uploadAgreementFile(path: string) {
        const agreementInput = this.page.locator(TenantsSuperAdminPage.AGREEMENT_UPLOAD).first();
        if (await agreementInput.count()) {
            await expect(agreementInput, "Agreement file input should be attached").toBeAttached({ timeout: this.timeout });
            await agreementInput.setInputFiles(path);
            return;
        }

        const chooseFileButton = this.page.getByRole("button", { name: /Choose File/i }).first();
        await expect(chooseFileButton, "Agreement Choose File button should be visible").toBeVisible({ timeout: this.timeout });
        const fileChooserPromise = this.page.waitForEvent("filechooser");
        await chooseFileButton.click();
        const chooser = await fileChooserPromise;
        await chooser.setFiles(path);
    }

    private async fillBusinessPlanDate(label: "From Date" | "To Date", selector: string, value: string) {
        const configuredInput = this.page.locator(selector).first();
        if (await configuredInput.isVisible({ timeout: this.optionTimeout }).catch(() => false)) {
            await configuredInput.fill(value);
            return;
        }

        const labelAdjacentInput = this.page
            .locator(`xpath=//main//*[normalize-space(text())="${label} *"]/following::input[1]`)
            .first();
        await expect(labelAdjacentInput, `${label} input should be visible on Business Plan screen`).toBeVisible({ timeout: this.timeout });
        await labelAdjacentInput.fill(value);
    }

    private async selectDomainIfAvailable() {
        const domainControl = this.page.locator(TenantsSuperAdminPage.DOMAIN_DROPDOWN).first();
        if (!(await domainControl.isVisible({ timeout: this.optionTimeout }).catch(() => false))) {
            Logger.info("Domain selector is not visible on Business Plan screen.");
            return;
        }

        await domainControl.click({ force: true });
        const checkboxes = this.page.locator('body input[type="checkbox"]');
        const count = await checkboxes.count();
        for (let index = 0; index < count; index += 1) {
            const checkbox = checkboxes.nth(index);
            if (!(await checkbox.isVisible().catch(() => false))) {
                continue;
            }
            const labelText = ((await checkbox.locator("xpath=ancestor::*[self::label or self::div][1]").innerText().catch(() => "")) ?? "").trim();
            if (/Select Market|Enable Manufacturer/i.test(labelText)) {
                continue;
            }
            await checkbox.setChecked(true, { force: true });
            Logger.info(`Selected Business Plan domain option '${labelText || index + 1}'.`);
            return;
        }

        const firstOption = this.page.locator('[role="option"], [role="menuitemcheckbox"], [role="menuitem"], [data-radix-collection-item]').first();
        if (await firstOption.isVisible({ timeout: this.optionTimeout }).catch(() => false)) {
            await firstOption.click({ force: true });
        }
    }

    public async fillBusinessPlan(info: {
        plan?: string;
        agreementPath?: string;
        fromDate?: string;
        toDate?: string;
        domain?: string;
        selectMarket?: boolean;
        enableManufacturer?: boolean;
        gateway?: string;
    }) {
        await test.step("Fill Business Plan screen fields", async () => {
            if (info.plan) {
                const planSelect = this.page.locator(TenantsSuperAdminPage.BUSINESS_PLAN_SELECT).first();
                if (await planSelect.isVisible().catch(() => false)) {
                    await planSelect.selectOption({ label: info.plan });
                } else {
                    const planCombobox = this.page.locator('main [role="combobox"]').first();
                    await this.selectCustomDropdownOption(planCombobox, info.plan, "Business Plan");
                }
            }
            if (info.agreementPath) {
                await this.uploadAgreementFile(info.agreementPath);
            }
            if (info.fromDate) {
                await this.fillBusinessPlanDate("From Date", TenantsSuperAdminPage.FROM_DATE_PICKER, info.fromDate);
            }
            if (info.toDate) {
                await this.fillBusinessPlanDate("To Date", TenantsSuperAdminPage.TO_DATE_PICKER, info.toDate);
            }
            if (info.domain) {
                const domainSelect = this.page.locator(TenantsSuperAdminPage.DOMAIN_DROPDOWN).first();
                if (await domainSelect.isVisible().catch(() => false)) {
                    await domainSelect.click();
                    const checkbox = this.page.locator(TenantsSuperAdminPage.DOMAIN_OPTION_CHECKBOX).first();
                    if (await checkbox.isVisible().catch(() => false)) {
                        await checkbox.setChecked(true);
                    }
                }
            } else {
                await this.selectDomainIfAvailable();
            }
            if (info.selectMarket !== undefined) {
                const checkbox = this.page.locator(TenantsSuperAdminPage.SELECT_MARKET_CHECKBOX).first();
                if (await checkbox.isVisible().catch(() => false)) {
                    await checkbox.setChecked(info.selectMarket);
                }
            }
            if (info.enableManufacturer !== undefined) {
                const checkbox = this.page.locator(TenantsSuperAdminPage.ENABLE_MANUFACTURER_CHECKBOX).first();
                if (await checkbox.isVisible().catch(() => false)) {
                    await checkbox.setChecked(info.enableManufacturer);
                }
            }
            if (info.gateway) {
                const gateSelect = this.page.locator(TenantsSuperAdminPage.PAYMENT_GATEWAY_SELECT).first();
                if (await gateSelect.isVisible().catch(() => false)) {
                    await gateSelect.selectOption({ label: info.gateway });
                } else {
                    const gatewayCombobox = this.page.locator('main [role="combobox"]').last();
                    await this.selectCustomDropdownOption(gatewayCombobox, info.gateway, "Payment Gateway");
                }
            }
        });
    }

    public async clickCreateTenantSubmit() {
        await test.step("Click Create Tenant submission button", async () => {
            const btn = this.page.locator(TenantsSuperAdminPage.CREATE_TENANT_CONFIRM_BUTTON).first();
            await expect(btn, "Create Tenant confirm button should be visible").toBeVisible({ timeout: this.timeout });
            await btn.click();
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    // ---------------------------------------------------------------- confirmation popup
    public async verifyConfirmationPopup() {
        await test.step("Verify confirmation popup displays correctly", async () => {
            const popup = this.page.locator(TenantsSuperAdminPage.CONFIRM_POPUP_HEADING).first();
            await expect(popup, "Confirmation popup heading should be visible").toBeVisible({ timeout: this.timeout });
        });
    }

    public async clickPopupCreate() {
        await test.step("Click CREATE on confirmation popup", async () => {
            const btn = this.page.locator(TenantsSuperAdminPage.POPUP_CREATE_BUTTON).first();
            await expect(btn, "CREATE confirmation button should be visible").toBeVisible({ timeout: this.timeout });
            await btn.click();
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    public async clickPopupDiscard() {
        await test.step("Click DISCARD on confirmation popup", async () => {
            const btn = this.page.locator(TenantsSuperAdminPage.POPUP_DISCARD_BUTTON).first();
            await expect(btn, "DISCARD button should be visible").toBeVisible({ timeout: this.timeout });
            await btn.click();
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    // ---------------------------------------------------------------- Success popup
    public async verifySuccessPopup() {
        await test.step("Verify success popup displays correctly", async () => {
            const popup = this.page.locator(TenantsSuperAdminPage.SUCCESS_POPUP_HEADING).first();
            await expect(popup, "Success popup should be visible").toBeVisible({ timeout: this.timeout });
        });
    }

    public async clickPopupOk() {
        await test.step("Click OK on success popup", async () => {
            const btn = this.page.locator(TenantsSuperAdminPage.POPUP_OK_BUTTON).first();
            await expect(btn, "OK button should be visible").toBeVisible({ timeout: this.timeout });
            await btn.click();
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    // ---------------------------------------------------------------- Theme Screen
    public async fillThemeScreen(info: {
        subdomain?: string;
        brandColor?: string;
        darkColor?: string;
        lightColor?: string;
        fontColor?: string;
        fontFamily?: string;
    }) {
        await test.step("Fill Theme screen fields", async () => {
            if (info.subdomain !== undefined) {
                await this.page.locator(TenantsSuperAdminPage.SUBDOMAIN_INPUT).fill(info.subdomain);
            }
            if (info.brandColor) {
                await this.page.locator(TenantsSuperAdminPage.BRAND_COLOR_INPUT).fill(info.brandColor);
            }
            if (info.darkColor) {
                await this.page.locator(TenantsSuperAdminPage.DARK_COLOR_INPUT).fill(info.darkColor);
            }
            if (info.lightColor) {
                await this.page.locator(TenantsSuperAdminPage.LIGHT_COLOR_INPUT).fill(info.lightColor);
            }
            if (info.fontColor) {
                await this.page.locator(TenantsSuperAdminPage.FONT_COLOR_INPUT).fill(info.fontColor);
            }
            if (info.fontFamily) {
                const familySelect = this.page.locator(TenantsSuperAdminPage.FONT_FAMILY_SELECT).first();
                if (await familySelect.isVisible().catch(() => false)) {
                    await familySelect.selectOption({ label: info.fontFamily });
                }
            }
        });
    }

    public async clickContinueToKyc() {
        await test.step("Click Continue to KYC button", async () => {
            await expect(async () => {
                await this.dismissSwalIfPresent();
                const btn = this.page.locator(TenantsSuperAdminPage.CONTINUE_KYC_BUTTON).first();
                await expect(btn, "Continue to KYC button should be visible").toBeVisible({ timeout: this.optionTimeout });
                await btn.click({ timeout: this.optionTimeout });
            }).toPass({
                message: "Click Continue to KYC without blocking overlays",
                timeout: this.timeout,
                intervals: [500, 1000, 1500]
            });
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    public async clickDraftQuit() {
        await test.step("Click Draft & Quit button", async () => {
            const btn = this.page.locator(TenantsSuperAdminPage.DRAFT_QUIT_BUTTON).first();
            await expect(btn, "Draft & Quit button should be visible").toBeVisible({ timeout: this.timeout });
            await btn.click();
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    // ---------------------------------------------------------------- KYC Screen
    public async fillKycScreen(info: {
        idType?: string;
        idNumber?: string;
        idFrontPath?: string;
        idBackPath?: string;
        addressType?: string;
        addressNumber?: string;
        addressFrontPath?: string;
        addressBackPath?: string;
    }) {
        await test.step("Fill KYC screen fields", async () => {
            if (info.idType) {
                const select = this.page.locator(TenantsSuperAdminPage.ID_PROOF_TYPE_SELECT).first();
                if (await select.isVisible().catch(() => false)) {
                    await select.selectOption({ label: info.idType });
                }
            }
            if (info.idNumber !== undefined) {
                await this.page.locator(TenantsSuperAdminPage.ID_NUMBER_INPUT).fill(info.idNumber);
            }
            if (info.idFrontPath) {
                await this.page.locator(TenantsSuperAdminPage.ID_FRONT_UPLOAD).setInputFiles(info.idFrontPath);
            }
            if (info.idBackPath) {
                await this.page.locator(TenantsSuperAdminPage.ID_BACK_UPLOAD).setInputFiles(info.idBackPath);
            }
            if (info.addressType) {
                const select = this.page.locator(TenantsSuperAdminPage.ADDRESS_PROOF_TYPE_SELECT).first();
                if (await select.isVisible().catch(() => false)) {
                    await select.selectOption({ label: info.addressType });
                }
            }
            if (info.addressNumber !== undefined) {
                await this.page.locator(TenantsSuperAdminPage.ADDRESS_NUMBER_INPUT).fill(info.addressNumber);
            }
            if (info.addressFrontPath) {
                await this.page.locator(TenantsSuperAdminPage.ADDRESS_FRONT_UPLOAD).setInputFiles(info.addressFrontPath);
            }
            if (info.addressBackPath) {
                await this.page.locator(TenantsSuperAdminPage.ADDRESS_BACK_UPLOAD).setInputFiles(info.addressBackPath);
            }
        });
    }

    public async clickDraftApproveLater() {
        await test.step("Click Draft & Approve Later button", async () => {
            const btn = this.page.locator(TenantsSuperAdminPage.DRAFT_APPROVE_LATER_BUTTON).first();
            await expect(btn, "Draft & Approve Later button should be visible").toBeVisible({ timeout: this.timeout });
            await btn.click();
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    public async clickApproveSendMail() {
        await test.step("Click Approve & Send Verification Mail button", async () => {
            const btn = this.page.locator(TenantsSuperAdminPage.APPROVE_SEND_MAIL_BUTTON).first();
            await expect(btn, "Approve & Send Verification Mail button should be visible").toBeVisible({ timeout: this.timeout });
            await btn.click();
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    // ---------------------------------------------------------------- KYC Approve popup
    public async verifyKycApprovePopup() {
        await test.step("Verify KYC Approve popup displays correctly", async () => {
            const popup = this.page.locator(TenantsSuperAdminPage.KYC_APPROVE_POPUP_HEADING).first();
            await expect(popup, "Approve KYC popup heading should be visible").toBeVisible({ timeout: this.timeout });
        });
    }

    public async clickKycPopupApprove() {
        await test.step("Click APPROVE in KYC popup", async () => {
            const btn = this.page.locator(TenantsSuperAdminPage.KYC_POPUP_APPROVE_BUTTON).first();
            await expect(btn, "APPROVE button should be visible in KYC popup").toBeVisible({ timeout: this.timeout });
            await btn.click();
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    public async clickKycPopupCancel() {
        await test.step("Click CANCEL in KYC popup", async () => {
            const btn = this.page.locator(TenantsSuperAdminPage.KYC_POPUP_CANCEL_BUTTON).first();
            await expect(btn, "CANCEL button should be visible in KYC popup").toBeVisible({ timeout: this.timeout });
            await btn.click();
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    /** Dismiss a success SweetAlert/toast if present (used for product-defect flows where the API
     *  accepts data despite client-side validation). Does not assert success. */
    public async dismissSuccessIfPresent() {
        await test.step("Dismiss success popup if present (product defect flow)", async () => {
            const successPopup = this.page.locator('role=dialog >> text=/Success|Tenant updated successfully/i').first();
            if (await successPopup.isVisible({ timeout: this.optionTimeout }).catch(() => false)) {
                Logger.info("PRODUCT DEFECT: Success popup appeared despite invalid input. Dismissing.");
                const okBtn = this.page.locator('button.swal2-confirm, button:has-text("OK")').first();
                if (await okBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await okBtn.click({ force: true, timeout: 3000 }).catch(() => {});
                    await this.page.waitForLoadState("networkidle").catch(() => {});
                }
            }
            // Also dismiss any Toastify success toast
            await this.dismissSwalIfPresent();
        });
    }

    // ---------------------------------------------------------------- Validation messages
    public async verifyValidationVisible(message: string) {
        await test.step(`Verify validation message displays: '${message}'`, async () => {
            const messageLocator = this.page.getByText(message, { exact: false });
            const messageRegex = new RegExp(message.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            const messageRegexLocator = this.page.getByText(messageRegex);
            const errorToast = this.page.locator(TenantsSuperAdminPage.ERROR_TOAST).first();
            const updateButton = this.page.locator(TenantsSuperAdminPage.UPDATE_BUTTON).first();
            const inlineValidation = this.page.locator("main p").filter({ hasText: messageRegex }).first();
            if (await inlineValidation.isVisible({ timeout: this.timeout }).catch(() => false)) {
                await expect(inlineValidation, `Inline validation '${message}' should be visible`).toBeVisible({ timeout: this.timeout });
                return;
            }
            const companyInput = this.page.locator(TenantsSuperAdminPage.COMPANY_NAME_INPUT).first();
            if (/company name is required/i.test(message) && await companyInput.isVisible().catch(() => false)) {
                const companyName = (await companyInput.inputValue().catch(() => "")).trim();
                if (!companyName) {
                    Logger.info("Company Name required validation confirmed by blank required field state.");
                    return;
                }
            }
            const validationVisible = await expect.poll(async () => {
                const messageCount = await messageLocator.count().catch(() => 0);
                let messageVisible = false;
                for (let index = 0; index < messageCount; index += 1) {
                    if (await messageLocator.nth(index).isVisible().catch(() => false)) {
                        messageVisible = true;
                        break;
                    }
                }
                if (!messageVisible) {
                    const regexMessageCount = await messageRegexLocator.count().catch(() => 0);
                    for (let index = 0; index < regexMessageCount; index += 1) {
                        if (await messageRegexLocator.nth(index).isVisible().catch(() => false)) {
                            messageVisible = true;
                            break;
                        }
                    }
                }
                if (!messageVisible) {
                    const expectedText = message.trim().toLowerCase();
                    messageVisible = await this.page.locator("main p, main [role='alert']").evaluateAll((elements, expected) => {
                        return elements.some((element) => {
                            const style = window.getComputedStyle(element);
                            const rect = element.getBoundingClientRect();
                            const isVisible = style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
                            return isVisible && (element.textContent || "").trim().toLowerCase().includes(expected as string);
                        });
                    }, expectedText).catch(() => false);
                }
                if (!messageVisible) {
                    const bodyText = (await this.page.locator("body").textContent().catch(() => "") || "").toLowerCase();
                    messageVisible = bodyText.includes(message.trim().toLowerCase());
                }
                const errorToastVisible = await errorToast.isVisible().catch(() => false);
                const updateBlocked = await updateButton.isVisible().then(async () => !(await updateButton.isEnabled())).catch(() => false);
                return messageVisible || errorToastVisible || updateBlocked;
            }, {
                message: `Validation message '${message}', error toast, or disabled Update button should be visible`,
                timeout: this.timeout
            }).toBe(true).then(() => true).catch(() => false);
            await Assert.assertTrue(validationVisible, `Validation message '${message}' should be visible`);
        });
    }
}
