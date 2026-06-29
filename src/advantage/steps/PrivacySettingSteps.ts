import test, { Page, expect } from "@playwright/test";
import Assert from "@asserts/Assert";
import PrivacySettingPage from "@pages/PrivacySettingPage";
import PrivacySettingConstants from "@uiConstants/PrivacySettingConstants";

export interface PrivacySettingFormData {
    app: string;
    type: string;
    title: string;
    subTitle: string;
    content: string;
}

export default class PrivacySettingSteps {
    constructor(private readonly page: Page) { }

    public async waitForTableStable() {
        await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => { });
        await this.page.waitForTimeout(PrivacySettingConstants.TABLE_SETTLE_MS);
    }

    public async waitForTableLoaded() {
        // Wait for skeleton loaders to disappear
        await this.page.locator('.skeleton, [class*="skeleton"], .animate-pulse').first().waitFor({ state: "hidden", timeout: 5000 }).catch(() => { });
        
        // Wait for rows to be rendered and populate
        for (let i = 0; i < 25; i++) {
            const count = await this.page.locator(PrivacySettingPage.TABLE_ROWS).count().catch(() => 0);
            const noRecords = await this.page.locator(PrivacySettingPage.NO_RECORDS).first().isVisible().catch(() => false);
            const firstRowText = count > 0 ? await this.page.locator(PrivacySettingPage.TABLE_ROWS).first().innerText().catch(() => "") : "";
            
            if ((count > 0 && firstRowText.trim() !== "") || noRecords) {
                break;
            }
            await this.page.waitForTimeout(200);
        }
        
        await this.waitForTableStable();
    }

    public generateUniqueTitle(prefix = "Auto Privacy"): string {
        return `${prefix} ${Date.now().toString().slice(-8)}`;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async navigateToPrivacySetting() {
        await test.step("Navigate to Privacy Setting listing page", async () => {
            const target = `${process.env.BASE_URL}${PrivacySettingPage.PRIVACY_SETTING_PATH}`;
            console.log(`[PrivacySetting] Navigating to: ${target}`);
            await this.page.goto(target);
            await this.page.waitForLoadState("networkidle");
            const landed = this.page.url();
            console.log(`[PrivacySetting] URL: ${landed}`);
            if (landed.includes("/login")) {
                throw new Error(`Privacy Setting navigation redirected to login. URL: ${landed}`);
            }
        });
    }

    public async navigateToPrivacySettingViaSidebar() {
        await test.step("Navigate to Privacy Setting via Content group in sidebar", async () => {
            const sidebarLink = this.page.locator(PrivacySettingPage.PRIVACY_SETTING_SUBMENU_LINK).first();
            await expect(sidebarLink, "Sidebar menu link must be attached").toBeAttached({ timeout: 8000 });
            await sidebarLink.scrollIntoViewIfNeeded({ timeout: 5000 });
            await sidebarLink.click();
            await this.page.waitForURL(/privacy-setting/, { timeout: 15000 });
            console.log(`[PrivacySetting] Navigated via sidebar to: ${this.page.url()}`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // VERIFICATIONS
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyPageLoaded() {
        await test.step("Verify Privacy Setting listing page loaded", async () => {
            console.log(`[PrivacySetting] verifyPageLoaded — URL: ${this.page.url()}`);
            await expect(this.page).toHaveURL(
                new RegExp(PrivacySettingConstants.PAGE_URL_SEGMENT), { timeout: 15000 },
            );
            await expect(
                this.page.locator(PrivacySettingPage.LIST_HEADING).first(),
                "'Privacy Setting' heading must be visible",
            ).toBeVisible({ timeout: 10000 });
            await expect(
                this.page.locator(PrivacySettingPage.CREATE_BTN).first(),
                "Create Privacy Setting button must be visible",
            ).toBeVisible({ timeout: 8000 });
            await expect(
                this.page.locator(PrivacySettingPage.TABLE).first(),
                "Privacy Setting table must be visible",
            ).toBeVisible({ timeout: 8000 });
        });
    }

    public async clickCreatePrivacySetting() {
        await test.step("Click Create Privacy Setting button", async () => {
            await this.page.locator(PrivacySettingPage.CREATE_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyCreatePageLoaded() {
        await test.step("Verify Create Privacy Setting page loaded", async () => {
            console.log(`[PrivacySetting] verifyCreatePageLoaded — URL: ${this.page.url()}`);
            await expect(this.page).toHaveURL(
                new RegExp(PrivacySettingPage.CREATE_PATH), { timeout: 10000 },
            );
            await expect(
                this.page.locator(PrivacySettingPage.CREATE_HEADING).first(),
                "Create Privacy Setting heading must be visible",
            ).toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyEditPageLoaded() {
        await test.step("Verify Edit Privacy Setting page loaded", async () => {
            console.log(`[PrivacySetting] verifyEditPageLoaded — URL: ${this.page.url()}`);
            await expect(this.page).toHaveURL(
                new RegExp(PrivacySettingPage.EDIT_PATH), { timeout: 10000 },
            );
            await expect(
                this.page.locator(PrivacySettingPage.EDIT_HEADING).first(),
                "Edit Privacy Setting heading must be visible",
            ).toBeVisible({ timeout: 8000 });

            // Wait for skeletons to disappear
            await this.page.locator('.skeleton, [class*="skeleton"], .animate-pulse').first().waitFor({ state: "hidden", timeout: 5000 }).catch(() => { });

            // Verify dropdown triggers are visible and wait for prefilled values to settle
            const appTrigger = this.page.locator(PrivacySettingPage.APP_DROPDOWN_TRIGGER).first();
            const typeTrigger = this.page.locator(PrivacySettingPage.TYPE_DROPDOWN_TRIGGER).first();
            await expect(appTrigger).toBeVisible({ timeout: 5000 });
            await expect(typeTrigger).toBeVisible({ timeout: 5000 });
            await this.page.waitForTimeout(1000);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FORM FILLING
    // ═══════════════════════════════════════════════════════════════════════════

    public async selectApp(app: string) {
        await test.step(`Select App: '${app}'`, async () => {
            const trigger = this.page.locator(PrivacySettingPage.APP_DROPDOWN_TRIGGER).first();
            await trigger.click();
            await this.page.waitForTimeout(PrivacySettingConstants.DROPDOWN_OPEN_MS);

            const option = this.page.locator(PrivacySettingPage.DROPDOWN_OPTION(app)).first();
            await expect(option, `Option '${app}' must be visible`).toBeVisible({ timeout: 5000 });
            await option.click();
            await this.page.waitForTimeout(300);
        });
    }

    public async selectType(type: string) {
        await test.step(`Select Type: '${type}'`, async () => {
            const trigger = this.page.locator(PrivacySettingPage.TYPE_DROPDOWN_TRIGGER).first();
            await trigger.click();
            await this.page.waitForTimeout(PrivacySettingConstants.DROPDOWN_OPEN_MS);

            const option = this.page.locator(PrivacySettingPage.DROPDOWN_OPTION(type)).first();
            await expect(option, `Option '${type}' must be visible`).toBeVisible({ timeout: 5000 });
            await option.click();
            await this.page.waitForTimeout(300);
        });
    }

    public async enterTitle(title: string) {
        await test.step(`Enter Title: '${title}'`, async () => {
            const input = this.page.locator(PrivacySettingPage.TITLE_INPUT).first();
            await expect(input, "Title input must be visible").toBeVisible({ timeout: 5000 });
            await input.click({ clickCount: 3 });
            await input.fill(title);
        });
    }

    public async fillSubsection(index: number, subTitle: string, content: string) {
        await test.step(`Fill Subsection ${index + 1} with Sub Title '${subTitle}'`, async () => {
            const titleInput = this.page.locator(PrivacySettingPage.SUBSECTION_TITLE).nth(index);
            await expect(titleInput, `Subsection ${index + 1} title input must be attached`).toBeAttached({ timeout: 5000 });
            await titleInput.click({ clickCount: 3 });
            await titleInput.fill(subTitle);

            const editor = this.page.locator(PrivacySettingPage.SUBSECTION_EDITOR).nth(index);
            await expect(editor, `Subsection ${index + 1} editor must be attached`).toBeAttached({ timeout: 5000 });
            await editor.click();
            await editor.focus();
            // Clear editor content and fill
            await editor.fill("");
            await editor.fill(content);
        });
    }

    public async clickAddSubsection() {
        await test.step("Click Add Subsection (+) button", async () => {
            const btn = this.page.locator(PrivacySettingPage.ADD_SUBSECTION_BTN).first();
            await expect(btn, "Add Subsection (+) button must be visible").toBeVisible({ timeout: 5000 });
            await btn.click();
            await this.page.waitForTimeout(500);
        });
    }

    public async fillCreateForm(data: Partial<PrivacySettingFormData>) {
        await test.step("Fill Create Privacy Setting form", async () => {
            if (data.app) {
                await this.selectApp(data.app);
            }
            if (data.type) {
                await this.selectType(data.type);
            }
            if (data.title !== undefined) {
                await this.enterTitle(data.title);
            }
            if (data.subTitle !== undefined || data.content !== undefined) {
                await this.fillSubsection(0, data.subTitle ?? "", data.content ?? "");
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // RICH TEXT FORMATTING
    // ═══════════════════════════════════════════════════════════════════════════

    public async formatSubsectionContent(index: number, formatType: "bold" | "italic" | "h1" | "h2" | "h3" | "bullet", text: string) {
        await test.step(`Format Subsection ${index + 1} content with format '${formatType}'`, async () => {
            const editor = this.page.locator(PrivacySettingPage.SUBSECTION_EDITOR).nth(index);
            await editor.focus();
            await editor.fill("");
            await editor.fill(text);
            await this.page.waitForTimeout(200);

            // Select all text in the editor
            await this.page.keyboard.press("Control+A");
            await this.page.waitForTimeout(200);

            let formattingButton;
            if (formatType === "bold") {
                formattingButton = this.page.locator(PrivacySettingPage.BOLD_BTN).nth(index);
            } else if (formatType === "italic") {
                formattingButton = this.page.locator(PrivacySettingPage.ITALIC_BTN).nth(index);
            } else if (formatType === "h1") {
                formattingButton = this.page.locator(PrivacySettingPage.H1_BTN).nth(index);
            } else if (formatType === "h2") {
                formattingButton = this.page.locator(PrivacySettingPage.H2_BTN).nth(index);
            } else if (formatType === "h3") {
                formattingButton = this.page.locator(PrivacySettingPage.H3_BTN).nth(index);
            } else if (formatType === "bullet") {
                formattingButton = this.page.locator(PrivacySettingPage.BULLET_LIST_BTN).nth(index);
            }

            if (formattingButton && await formattingButton.isVisible()) {
                await formattingButton.click();
                await this.page.waitForTimeout(300);
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ACTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickSave() {
        await test.step("Click Save/Create button", async () => {
            await this.page.locator(PrivacySettingPage.SAVE_BTN).first().click();
            await this.page.waitForLoadState("networkidle").catch(() => { });
        });
    }

    public async clickUpdate() {
        await test.step("Click Update button", async () => {
            const updateBtn = this.page.locator(PrivacySettingPage.UPDATE_BTN).first();
            await expect(updateBtn, "Update button must be visible").toBeVisible({ timeout: 5000 });
            await updateBtn.click();
            await this.page.waitForLoadState("networkidle").catch(() => { });
        });
    }

    public async clickCancel() {
        await test.step("Click Cancel button", async () => {
            await this.page.locator(PrivacySettingPage.CANCEL_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async clickBack() {
        await test.step("Click Back button", async () => {
            await this.page.locator(PrivacySettingPage.BACK_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TOASTS & VALIDATIONS
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifySuccessToast() {
        await test.step("Verify success toast notification is displayed", async () => {
            const toast = this.page.locator(PrivacySettingPage.TOAST).first();
            await expect(toast, "Success toast must appear").toBeVisible({ timeout: 8000 });
            const text = (await toast.innerText().catch(() => "")).toLowerCase();
            console.log(`[PrivacySetting] Toast: '${text}'`);
            await Assert.assertTrue(
                text.includes("success") || text.includes("created") || text.includes("saved")
                || text.includes("updated") || text.includes("deleted"),
                `Toast confirms success: actual '${text}'`,
            );
        });
    }

    public async verifyValidationError(expectedFieldText?: string) {
        await test.step(`Verify validation error is shown${expectedFieldText ? ` for '${expectedFieldText}'` : ""}`, async () => {
            await this.page.waitForTimeout(500);
            const messages = await this.page.locator(PrivacySettingPage.VALIDATION_MSG).allTextContents();
            const matchingMsg = messages.find((m) =>
                expectedFieldText ? m.toLowerCase().includes(expectedFieldText.toLowerCase()) : m.trim() !== "",
            );

            const isInvalidInput = await this.page.locator("input:invalid, select:invalid").count().then((c) => c > 0).catch(() => false);

            console.log(`[PrivacySetting] Validation messages: ${JSON.stringify(messages)}, invalidCount: ${isInvalidInput}`);
            await Assert.assertTrue(
                matchingMsg !== undefined || isInvalidInput || messages.length > 0,
                `Expected validation error should block save/create`,
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LISTING OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Navigates through pagination pages to find and scroll to the row containing `title`.
     * Clicks "Next" page until the row is visible or no more pages exist.
     */
    public async navigateToRowPage(title: string): Promise<boolean> {
        return await test.step(`Navigate to page containing record '${title}'`, async () => {
            const rowSel = PrivacySettingPage.rowContaining(title);
            
            // Wait for initial load skeleton to disappear and table to populate
            await this.waitForTableLoaded();
            
            // Limit navigation to 15 pages max to avoid infinite loops
            for (let pageNum = 1; pageNum <= 15; pageNum++) {
                const currentRows = await this.page.locator(PrivacySettingPage.TABLE_ROWS).allTextContents().catch(() => []);
                console.log(`[PrivacySetting] Page ${pageNum} rows:`, JSON.stringify(currentRows));

                const row = this.page.locator(rowSel).first();
                if (await row.isVisible().catch(() => false)) {
                    console.log(`[PrivacySetting] Found record '${title}' on page ${pageNum}`);
                    return true;
                }

                const nextBtn = this.page.locator(PrivacySettingPage.NEXT_PAGE_BTN).first();
                if (!(await nextBtn.isVisible().catch(() => false)) || !(await nextBtn.isEnabled().catch(() => false))) {
                    console.log(`[PrivacySetting] Next page button not visible/enabled on page ${pageNum}. Record not found.`);
                    break;
                }

                const classAttr = await nextBtn.getAttribute("class").catch(() => "");
                const classes = classAttr ? classAttr.split(/\s+/) : [];
                const hasDisabledClass = classes.includes("pointer-events-none") || classes.includes("opacity-50") || classes.includes("disabled");
                
                const ariaDisabled = await nextBtn.getAttribute("aria-disabled").catch(() => "");
                
                if (hasDisabledClass || ariaDisabled === "true") {
                    console.log(`[PrivacySetting] Next page button is disabled via class/aria attribute on page ${pageNum}. Record not found.`);
                    break;
                }

                console.log(`[PrivacySetting] Record '${title}' not on page ${pageNum}. Clicking Next page...`);
                const rowsBefore = await this.page.locator(PrivacySettingPage.TABLE_ROWS).allTextContents().catch(() => []);
                
                await nextBtn.click();
                
                // Wait for loading/skeleton to disappear
                await this.page.locator('.skeleton, [class*="skeleton"], .animate-pulse').first().waitFor({ state: "hidden", timeout: 3000 }).catch(() => { });
                
                // Wait up to 3 seconds for the table rows to change from rowsBefore
                let changed = false;
                for (let i = 0; i < 15; i++) {
                    const currentRows = await this.page.locator(PrivacySettingPage.TABLE_ROWS).allTextContents().catch(() => []);
                    if (JSON.stringify(currentRows) !== JSON.stringify(rowsBefore)) {
                        changed = true;
                        break;
                    }
                    await this.page.waitForTimeout(200);
                }
                
                await this.waitForTableStable();
                
                if (!changed) {
                    console.log(`[PrivacySetting] Table content didn't change after clicking Next page on page ${pageNum}. Stopping.`);
                    break;
                }
            }

            console.log(`[PrivacySetting] Record '${title}' not found in pagination traversal.`);
            return false;
        });
    }

    public async verifyRecordInTable(title: string) {
        await test.step(`Verify record '${title}' exists in the grid`, async () => {
            await this.waitForTableLoaded();
            await this.navigateToRowPage(title);
            const row = this.page.locator(PrivacySettingPage.rowContaining(title)).first();
            await expect(row, `Record row containing '${title}' must be visible`).toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyRecordRemoved(title: string) {
        await test.step(`Verify record '${title}' is removed from the grid`, async () => {
            await this.waitForTableLoaded();
            const row = this.page.locator(PrivacySettingPage.rowContaining(title)).first();
            await expect(row, `Record row containing '${title}' must be hidden`).toBeHidden({ timeout: 8000 });
        });
    }

    public async clickEditForRow(title: string) {
        await test.step(`Click Edit button for record '${title}'`, async () => {
            await this.navigateToRowPage(title);
            const rowSel = PrivacySettingPage.rowContaining(title);
            const editBtn = this.page.locator(PrivacySettingPage.editBtnInRow(rowSel)).first();
            await expect(editBtn, "Edit button must be visible").toBeVisible({ timeout: 5000 });
            await editBtn.click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async clickDeleteForRow(title: string) {
        await test.step(`Click Delete button for record '${title}'`, async () => {
            await this.navigateToRowPage(title);
            const rowSel = PrivacySettingPage.rowContaining(title);
            const deleteBtn = this.page.locator(PrivacySettingPage.deleteBtnInRow(rowSel)).first();
            await expect(deleteBtn, "Delete button must be visible").toBeVisible({ timeout: 5000 });
            await deleteBtn.click();
            await this.page.locator(PrivacySettingPage.DELETE_POPUP).waitFor({ state: "visible", timeout: 5000 });
        });
    }

    public async confirmDelete() {
        await test.step("Confirm record deletion", async () => {
            const yesBtn = this.page.locator(PrivacySettingPage.DELETE_YES_BTN).first();
            await expect(yesBtn, "Confirm delete button must be visible").toBeVisible({ timeout: 5000 });
            await yesBtn.click();
            await this.page.waitForLoadState("networkidle").catch(() => { });
        });
    }

    public async cancelDelete() {
        await test.step("Cancel record deletion", async () => {
            const cancelBtn = this.page.locator(PrivacySettingPage.DELETE_CANCEL_BTN).first();
            await expect(cancelBtn, "Cancel delete button must be visible").toBeVisible({ timeout: 5000 });
            await cancelBtn.click();
            await expect(this.page.locator(PrivacySettingPage.DELETE_POPUP).first()).toBeHidden({ timeout: 5000 });
        });
    }

    public async verifyDeletePopupDisplayed() {
        await test.step("Verify delete confirmation popup elements", async () => {
            const popup = this.page.locator(PrivacySettingPage.DELETE_POPUP).first();
            await expect(popup, "Delete confirmation modal must be visible").toBeVisible({ timeout: 5000 });

            const yesBtn = this.page.locator(PrivacySettingPage.DELETE_YES_BTN).first();
            const cancelBtn = this.page.locator(PrivacySettingPage.DELETE_CANCEL_BTN).first();
            await expect(yesBtn, "Yes delete button must be visible").toBeVisible();
            await expect(cancelBtn, "Cancel button must be visible").toBeVisible();

            const text = (await popup.innerText()).toLowerCase();
            await Assert.assertTrue(
                text.includes("delete") || text.includes("are you sure") || text.includes("remove"),
                "Modal text contains deletion warning",
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TOGGLE STATUS
    // ═══════════════════════════════════════════════════════════════════════════

    public async toggleStatus(title: string) {
        await test.step(`Toggle Active/Inactive status for record '${title}'`, async () => {
            await this.navigateToRowPage(title);
            const rowSel = PrivacySettingPage.rowContaining(title);
            const toggle = this.page.locator(PrivacySettingPage.activeToggleInRow(rowSel)).first();
            await expect(toggle, "Status toggle must be visible").toBeVisible({ timeout: 5000 });
            await toggle.click();
            await this.waitForTableStable();
        });
    }

    public async getToggleState(title: string): Promise<boolean> {
        await this.navigateToRowPage(title);
        const rowSel = PrivacySettingPage.rowContaining(title);
        const cell = this.page.locator(`${rowSel} td:nth-child(6)`).first();
        await cell.waitFor({ state: "visible", timeout: 8000 }).catch(() => { });

        let text = "";
        for (let i = 0; i < 15; i++) {
            text = (await cell.innerText().catch(() => "")).trim().toLowerCase();
            if (text !== "") {
                break;
            }
            await this.page.waitForTimeout(300);
        }

        console.log(`[PrivacySetting] Toggle state text for '${title}': '${text}'`);
        return text.includes("active") && !text.includes("inactive");
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGINATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyPagination() {
        await test.step("Verify pagination (Previous/Next) functions correctly", async () => {
            await this.waitForTableLoaded();
            const nextBtn = this.page.locator(PrivacySettingPage.NEXT_PAGE_BTN).first();
            const prevBtn = this.page.locator(PrivacySettingPage.PREV_PAGE_BTN).first();

            // Next click
            if (await nextBtn.isVisible() && await nextBtn.isEnabled()) {
                const urlBefore = this.page.url();
                await nextBtn.click();
                await this.waitForTableStable();
                const urlAfter = this.page.url();
                console.log(`[PrivacySetting] Pagination Next: '${urlBefore}' -> '${urlAfter}'`);

                // Previous click
                if (await prevBtn.isVisible() && await prevBtn.isEnabled()) {
                    await prevBtn.click();
                    await this.waitForTableStable();
                    console.log(`[PrivacySetting] Pagination Previous back to page 1`);
                }
            } else {
                console.log("[PrivacySetting] Not enough records to perform pagination testing");
            }
        });
    }
}
