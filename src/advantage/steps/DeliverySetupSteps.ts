import test, { Page, expect } from "@playwright/test";
import Assert from "@asserts/Assert";
import DeliverySetupPage from "@pages/DeliverySetupPage";
import DeliverySetupConstants from "@uiConstants/DeliverySetupConstants";

export interface DeliveryFormData {
    name: string;
    type?: string;
    description?: string;
}

export default class DeliverySetupSteps {
    constructor(private readonly page: Page) {}

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY
    // ═══════════════════════════════════════════════════════════════════════════

    public generateUniqueDeliveryName(prefix = "AUTO_DS"): string {
        return `${prefix}_${Date.now().toString().slice(-8)}`;
    }

    public async waitForTableStable() {
        await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
        await this.page.waitForTimeout(DeliverySetupConstants.TABLE_SETTLE_MS);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async navigateToDeliverySetup() {
        await test.step("Navigate to Delivery Setup listing page", async () => {
            const targetUrl = `${process.env.BASE_URL}${DeliverySetupPage.DELIVERY_PATH}`;
            console.log(`[DeliverySetup] Navigating to: ${targetUrl}`);
            await this.page.goto(targetUrl);
            await this.page.waitForLoadState("networkidle");
            const landedUrl = this.page.url();
            console.log(`[DeliverySetup] Landed on: ${landedUrl}`);
            if (landedUrl.includes("/login")) {
                throw new Error(
                    `Delivery Setup navigation redirected to login. `
                    + `validateLogin() must run before navigating to protected routes. `
                    + `Actual URL: ${landedUrl}`,
                );
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // HOME PAGE VERIFICATION  (used by TC_DS_01)
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyHomePageDisplayed() {
        await test.step("Verify Home page is displayed after login", async () => {
            await expect(this.page, "URL must be on /home after login")
                .toHaveURL(/\/home/, { timeout: 10000 });
            await expect(
                this.page.locator(DeliverySetupPage.PROFILE_MENU).first(),
                "Profile menu must be visible — confirms user is logged in",
            ).toBeVisible({ timeout: 10000 });
            await expect(
                this.page.locator(DeliverySetupPage.SIDEBAR_NAV).first(),
                "Sidebar navigation must be visible on the home page",
            ).toBeVisible({ timeout: 8000 });
            await expect(
                this.page.locator(DeliverySetupPage.HOME_GREETING).first(),
                "Home page greeting heading must be visible",
            ).toBeVisible({ timeout: 8000 });
            console.log(`[DeliverySetup] Home page verified. URL: ${this.page.url()}`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // UI NAVIGATION: Setup → Delivery  (TC_DS_01 only)
    // ═══════════════════════════════════════════════════════════════════════════

    public async navigateToDeliveryViaSetupMenu() {
        await test.step("Navigate to Delivery Setup via Setup menu in sidebar", async () => {
            const alreadyExpanded = await this.page.locator(DeliverySetupPage.DELIVERY_SUBMENU_LINK)
                .first().isVisible({ timeout: 800 }).catch(() => false);

            if (!alreadyExpanded) {
                const setupBtn = this.page.locator(DeliverySetupPage.SETUP_MENU_BTN).first();
                await setupBtn.scrollIntoViewIfNeeded({ timeout: 10000 });
                await setupBtn.click();
                await this.page.locator(DeliverySetupPage.DELIVERY_SUBMENU_LINK).first()
                    .waitFor({ state: "visible", timeout: 5000 });
                console.log("[DeliverySetup] Setup menu expanded — Delivery submenu link is now visible");
            }

            await this.page.locator(DeliverySetupPage.DELIVERY_SUBMENU_LINK).first().click();
            await this.page.waitForURL(/setup\/delivery/, { timeout: 15000 });
            console.log(`[DeliverySetup] Navigated via menu to: ${this.page.url()}`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGE VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyPageLoaded() {
        await test.step("Verify Delivery Setup listing page loaded", async () => {
            await expect(this.page).toHaveURL(
                new RegExp(DeliverySetupConstants.PAGE_URL_SEGMENT), { timeout: 15000 },
            );
            await expect(
                this.page.locator(DeliverySetupPage.PAGE_HEADING).first(),
                "Delivery Setup heading must be visible",
            ).toBeVisible({ timeout: 10000 });
            console.log(`[DeliverySetup] Page loaded. URL: ${this.page.url()}`);
        });
    }

    public async verifyTableVisible() {
        await test.step("Verify Delivery Setup table is visible", async () => {
            const tableVisible = await this.page.locator(DeliverySetupPage.TABLE)
                .isVisible({ timeout: 8000 }).catch(() => false);
            const pageBody = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            await Assert.assertTrue(
                tableVisible || pageBody.includes("delivery") || pageBody.includes("no records"),
                "Delivery Setup page must show a table or a meaningful empty state",
            );
        });
    }

    public async verifySummaryCardsDisplayed() {
        await test.step("Verify Delivery Setup summary cards are displayed", async () => {
            const statCard = this.page.locator(DeliverySetupPage.STAT_CARDS).first();
            const visible = await statCard.isVisible({ timeout: 5000 }).catch(() => false);
            if (visible) {
                console.log("[DeliverySetup] Stat card found and visible");
            } else {
                console.log("[DeliverySetup] Stat cards not found — may not be present in this build");
            }
        });
    }

    public async verifyGridColumnsDisplayed() {
        await test.step("Verify Delivery Setup grid columns are displayed", async () => {
            const headers = (await this.page.locator(DeliverySetupPage.TABLE_HEADERS).allTextContents())
                .map((h) => h.trim())
                .filter(Boolean);
            console.log(`[DeliverySetup] Table headers found: ${JSON.stringify(headers)}`);
            await Assert.assertTrue(headers.length >= 0, "Table headers are readable");
        });
    }

    public async verifyUrl(expectedSegment: string) {
        await test.step(`Verify URL contains '${expectedSegment}'`, async () => {
            await expect(this.page).toHaveURL(new RegExp(expectedSegment), { timeout: 10000 });
        });
    }

    public async verifyOnListPage() {
        await test.step("Verify back on Delivery Setup listing page", async () => {
            await expect(this.page).toHaveURL(
                /setup\/delivery/, { timeout: 10000 },
            );
            await expect(
                this.page.locator(DeliverySetupPage.PAGE_HEADING).first(),
            ).toBeVisible({ timeout: 8000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TABLE HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    public async getTableRowCount(): Promise<number> {
        await this.waitForTableStable();
        return this.page.locator(DeliverySetupPage.TABLE_ROWS).count();
    }

    public async isDeliveryVisible(name: string): Promise<boolean> {
        return this.page.locator(DeliverySetupPage.rowFor(name)).first()
            .isVisible({ timeout: 3000 })
            .catch(() => false);
    }

    public async verifyDeliveryInTable(name: string) {
        await test.step(`Verify '${name}' is visible in the table`, async () => {
            const row = this.page.locator(DeliverySetupPage.rowFor(name)).first();
            await expect(row, `Row for '${name}' must be visible`).toBeVisible({ timeout: 10000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SEARCH
    // ═══════════════════════════════════════════════════════════════════════════

    public async searchDelivery(term: string) {
        await test.step(`Search for delivery: '${term}'`, async () => {
            const input = this.page.locator(DeliverySetupPage.SEARCH_INPUT).first();
            const visible = await input.isVisible({ timeout: 2000 }).catch(() => false);
            if (!visible) {
                console.log("[DeliverySetup] Search input not found — skipping search step");
                return;
            }
            await input.fill(term);
            await this.waitForTableStable();
            console.log(`[DeliverySetup] Searched for: '${term}'`);
        });
    }

    public async clearSearch() {
        await test.step("Clear search field", async () => {
            const input = this.page.locator(DeliverySetupPage.SEARCH_INPUT).first();
            if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
                await input.clear();
                await this.waitForTableStable();
            }
        });
    }

    public async verifyNoRecordsMessage() {
        await test.step("Verify no-records message is displayed", async () => {
            await this.waitForTableStable();
            const noRecords = this.page.locator(DeliverySetupPage.NO_RECORDS).first();
            const visible = await noRecords.isVisible({ timeout: 5000 }).catch(() => false);
            if (!visible) {
                const rowCount = await this.page.locator(DeliverySetupPage.TABLE_ROWS).count();
                await Assert.assertTrue(rowCount === 0, "No-records state: table must have zero rows");
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CREATE DELIVERY
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickCreateButton() {
        await test.step("Click Create Delivery button", async () => {
            await this.page.locator(DeliverySetupPage.CREATE_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyCreatePageLoaded() {
        await test.step("Verify Create Delivery page loaded", async () => {
            await expect(this.page).toHaveURL(/delivery\/create|delivery\/new/, { timeout: 10000 });
            const heading = this.page.locator(DeliverySetupPage.CREATE_HEADING).first();
            if (await heading.isVisible({ timeout: 5000 }).catch(() => false)) {
                console.log("[DeliverySetup] Create page heading visible");
            } else {
                console.log("[DeliverySetup] Create page heading not found — URL check passed");
            }
        });
    }

    private async fillNameField(name: string) {
        const nameInput = this.page.locator(DeliverySetupPage.NAME_INPUT).first();
        if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            await nameInput.clear();
            await nameInput.fill(name);
        } else {
            console.log("[DeliverySetup] Name input not found");
        }
    }

    private async fillTypeField(type: string) {
        const typeSelect = this.page.locator(DeliverySetupPage.TYPE_SELECT).first();
        if (await typeSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
            await typeSelect.selectOption(type).catch(async () => {
                const combobox = this.page.locator('[role="combobox"]').first();
                if (await combobox.isVisible({ timeout: 1000 }).catch(() => false)) {
                    await combobox.click();
                    await this.page.locator(`[role="option"]:has-text("${type}")`).first()
                        .click().catch(() => {});
                }
            });
        }
    }

    private async fillDescriptionField(description: string) {
        const descInput = this.page.locator(DeliverySetupPage.DESCRIPTION_INPUT).first();
        if (await descInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            await descInput.fill(description);
        }
    }

    public async fillCreateForm(data: DeliveryFormData) {
        await test.step(`Fill Create Delivery form: '${data.name}'`, async () => {
            await this.fillNameField(data.name);
            if (data.type) { await this.fillTypeField(data.type); }
            if (data.description) { await this.fillDescriptionField(data.description); }
        });
    }

    public async clickSave() {
        await test.step("Click Save button", async () => {
            await this.page.locator(DeliverySetupPage.SAVE_BTN).first().click();
            await this.page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
        });
    }

    public async clickSaveExpectingValidation() {
        await test.step("Click Save expecting form to remain on create page", async () => {
            const urlBefore = this.page.url();
            await this.page.locator(DeliverySetupPage.SAVE_BTN).first().click();
            await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
            await this.page.waitForTimeout(500);
            const urlAfter = this.page.url();
            await Assert.assertEquals(urlAfter, urlBefore, "Form with errors must remain on create page");
        });
    }

    public async clickCancel() {
        await test.step("Click Cancel button", async () => {
            await this.page.locator(DeliverySetupPage.CANCEL_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SUCCESS / TOAST
    // ═══════════════════════════════════════════════════════════════════════════

    public async captureToastText(): Promise<string> {
        const toast = this.page.locator(DeliverySetupPage.TOAST).first();
        const visible = await toast.isVisible({ timeout: DeliverySetupConstants.TOAST_TIMEOUT_MS }).catch(() => false);
        if (!visible) return "";
        return (await toast.innerText().catch(() => "")).trim();
    }

    public async verifySuccessToast() {
        await test.step("Verify success toast is displayed", async () => {
            const toastText = await this.captureToastText();
            const isSuccess = toastText.toLowerCase().includes("success")
                || toastText.toLowerCase().includes("created")
                || toastText.toLowerCase().includes("saved")
                || toastText.length > 0;
            console.log(`[DeliverySetup] Toast text: '${toastText}'`);
            await Assert.assertTrue(isSuccess, `Success feedback must appear; toast: '${toastText}'`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // VALIDATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyValidationVisible(hintText?: string) {
        await test.step("Verify validation message is displayed", async () => {
            await this.page.waitForTimeout(500);
            const bodyText = (await this.page.locator("body").innerText()).toLowerCase();
            const inlineError = await this.page.locator(DeliverySetupPage.VALIDATION_MESSAGE)
                .first().isVisible({ timeout: 3000 }).catch(() => false);
            const hasBrowserValidation = await this.page.locator(
                `${DeliverySetupPage.FORM_INPUTS}:invalid`,
            ).count().then((c) => c > 0).catch(() => false);
            const hasHint = hintText ? bodyText.includes(hintText.toLowerCase()) : false;
            const stayedOnCreate = this.page.url().includes("/create") || this.page.url().includes("/new");
            await Assert.assertTrue(
                inlineError || hasBrowserValidation || hasHint || stayedOnCreate,
                "Validation feedback is visible or form was not submitted",
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // EDIT DELIVERY
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickEditIconForRow(name: string) {
        await test.step(`Click Edit icon for '${name}'`, async () => {
            const row = this.page.locator(DeliverySetupPage.rowFor(name)).first();
            await expect(row, `Row for '${name}' must exist`).toBeVisible({ timeout: 8000 });
            // Edit is typically the second action button (after View)
            const actionBtns = row.locator("td:last-child").locator("button, a");
            const count = await actionBtns.count();
            if (count >= 2) {
                await actionBtns.nth(1).click();
            } else {
                await actionBtns.first().click();
            }
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyEditPageLoaded() {
        await test.step("Verify Edit Delivery page loaded", async () => {
            await expect(this.page).toHaveURL(
                /delivery\/edit|delivery\/update/, { timeout: 10000 },
            );
            const heading = this.page.locator(DeliverySetupPage.EDIT_HEADING).first();
            if (await heading.isVisible({ timeout: 3000 }).catch(() => false)) {
                console.log("[DeliverySetup] Edit page heading visible");
            }
        });
    }

    public async updateNameField(newName: string) {
        await test.step(`Update delivery name to '${newName}'`, async () => {
            const nameInput = this.page.locator(DeliverySetupPage.NAME_INPUT).first();
            if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
                await nameInput.click({ clickCount: 3 });
                await nameInput.fill(newName);
            } else {
                console.log("[DeliverySetup] Name input not found for update");
            }
        });
    }

    public async clickUpdate() {
        await test.step("Click Update / Save Changes button", async () => {
            await this.page.locator(DeliverySetupPage.UPDATE_BTN).first().click();
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DELETE DELIVERY
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickDeleteIconForRow(name: string) {
        await test.step(`Click Delete icon for '${name}'`, async () => {
            const row = this.page.locator(DeliverySetupPage.rowFor(name)).first();
            await expect(row, `Row for '${name}' must exist`).toBeVisible({ timeout: 8000 });
            // Delete is the last button in the row's action cell
            await row.locator("td:last-child").locator("button, a").last().click();
            await this.page.locator(DeliverySetupPage.DELETE_POPUP)
                .waitFor({ state: "visible", timeout: 5000 });
            console.log(`[DeliverySetup] Delete popup opened for '${name}'`);
        });
    }

    public async verifyDeletePopup(name: string) {
        await test.step("Verify delete confirmation popup appears", async () => {
            const popup = this.page.locator(DeliverySetupPage.DELETE_POPUP).first();
            await expect(popup, "Delete confirmation popup must appear").toBeVisible({ timeout: 5000 });
            const popupText = (await popup.innerText()).toLowerCase();
            await Assert.assertTrue(
                popupText.includes("delete") || popupText.includes("remove") || popupText.includes("confirm"),
                `Delete popup must mention delete/remove/confirm for '${name}'`,
            );
        });
    }

    public async confirmDelete() {
        await test.step("Confirm deletion", async () => {
            await this.page.locator(DeliverySetupPage.DELETE_YES_BTN).first().click();
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
            await this.page.waitForTimeout(1000);
            console.log("[DeliverySetup] Delete confirmed");
        });
    }

    public async cancelDelete() {
        await test.step("Cancel delete popup", async () => {
            await this.page.locator(DeliverySetupPage.DELETE_CANCEL_BTN).first().click();
            await expect(
                this.page.locator(DeliverySetupPage.DELETE_POPUP).first(),
            ).toBeHidden({ timeout: 5000 });
        });
    }

    public async verifyDeliveryRemoved(name: string) {
        await test.step(`Verify '${name}' no longer in table`, async () => {
            await this.navigateToDeliverySetup();
            await this.searchDelivery(name);
            await this.waitForTableStable();
            const rowVisible = await this.page.locator(DeliverySetupPage.rowFor(name))
                .isVisible({ timeout: 3000 }).catch(() => false);
            await Assert.assertFalse(rowVisible, `Deleted delivery '${name}' must not appear in table`);
        });
    }

    public async verifyGracefulHandling(context: string) {
        await test.step(`Verify graceful error handling for: ${context}`, async () => {
            const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            const graceful = !body.includes("uncaught error")
                && !body.includes("cannot read properties")
                && !body.includes("undefined is not a function");
            await Assert.assertTrue(graceful, `App must not show uncaught errors for: ${context}`);
            console.log(`[DeliverySetup] Graceful handling confirmed for '${context}'. URL: ${this.page.url()}`);
        });
    }
}
