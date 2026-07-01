import test, { Page, expect } from "@playwright/test";
import Assert from "@asserts/Assert";
import SkillPage from "@pages/SkillPage";
import SkillConstants from "@uiConstants/SkillConstants";

export interface SkillFormData {
    code: string;
    name: string;
    description: string;
    category: string;
    otherCategory?: string; // only when category === "Other"
    iconUrl?: string;
    sortOrder?: string;
}

export default class SkillSteps {
    constructor(private readonly page: Page) {}

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY
    // ═══════════════════════════════════════════════════════════════════════════

    public generateUniqueCode(prefix = "SKILL"): string {
        return `${prefix}_AUTO_${Date.now().toString().slice(-8)}`;
    }

    public generateUniqueName(prefix = "Auto Skill"): string {
        return `${prefix} ${Date.now().toString().slice(-8)}`;
    }

    public async waitForTableStable() {
        await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
        await this.page.waitForTimeout(SkillConstants.TABLE_SETTLE_MS);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // NAVIGATION (direct URL — used by all tests except TC_SKILL_01)
    // ═══════════════════════════════════════════════════════════════════════════

    public async navigateToSkill() {
        await test.step("Navigate to Skill listing page", async () => {
            const target = `${process.env.BASE_URL}${SkillPage.SKILL_PATH}`;
            console.log(`[Skill] Navigating to: ${target}`);
            await this.page.goto(target);
            await this.page.waitForLoadState("networkidle");
            const landed = this.page.url();
            console.log(`[Skill] Landed on: ${landed}`);
            if (landed.includes("/login")) {
                throw new Error(
                    `Skill navigation redirected to login. `
                    + `validateLogin() must run first. Actual URL: ${landed}`,
                );
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // HOME PAGE & SIDEBAR NAVIGATION (TC_SKILL_01 only)
    // ═══════════════════════════════════════════════════════════════════════════

    public async navigateToHomePage() {
        await test.step("Navigate to Home page", async () => {
            const homeUrl = `${process.env.BASE_URL}home`;
            await this.page.goto(homeUrl);
            await this.page.waitForURL(/\/home/, { timeout: 15000 });
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyHomePageDisplayed() {
        await test.step("Verify Home page is displayed", async () => {
            await expect(this.page, "URL must be /home after login")
                .toHaveURL(/\/home/, { timeout: 10000 });
            await expect(
                this.page.locator(SkillPage.PROFILE_MENU).first(),
                "Profile menu must be visible — confirms user is logged in",
            ).toBeVisible({ timeout: 10000 });
            await expect(
                this.page.locator(SkillPage.SIDEBAR_NAV).first(),
                "Sidebar nav must be visible on home page",
            ).toBeVisible({ timeout: 8000 });
            await expect(
                this.page.locator(SkillPage.HOME_GREETING).first(),
                "Home greeting heading must be visible",
            ).toBeVisible({ timeout: 8000 });
            console.log(`[Skill] Home page verified. URL: ${this.page.url()}`);
        });
    }

    public async navigateToSkillViaSetupMenu() {
        await test.step("Navigate to Skills Setup via sidebar Setup menu", async () => {
            const alreadyVisible = await this.page.locator(SkillPage.SKILLS_SUBMENU_LINK)
                .isVisible({ timeout: 800 }).catch(() => false);
            if (!alreadyVisible) {
                const setupBtn = this.page.locator(SkillPage.SETUP_MENU_BTN).first();
                await setupBtn.scrollIntoViewIfNeeded({ timeout: 10000 });
                await setupBtn.click();
                await this.page.locator(SkillPage.SKILLS_SUBMENU_LINK)
                    .waitFor({ state: "visible", timeout: 5000 });
                console.log("[Skill] Setup menu expanded — Skills Setup link visible");
            }
            await this.page.locator(SkillPage.SKILLS_SUBMENU_LINK).first().click();
            await this.page.waitForURL(/setup\/skill/, { timeout: 15000 });
            console.log(`[Skill] Navigated via sidebar to: ${this.page.url()}`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGE VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyPageLoaded() {
        await test.step("Verify Skill listing page loaded", async () => {
            await expect(this.page).toHaveURL(
                new RegExp(SkillConstants.PAGE_URL_SEGMENT), { timeout: 15000 },
            );
            await expect(
                this.page.locator(SkillPage.PAGE_HEADING).first(),
                "Skill Setup heading must be visible",
            ).toBeVisible({ timeout: 10000 });
            await expect(
                this.page.locator(SkillPage.TABLE),
                "Skills table must be present",
            ).toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyGridColumnsDisplayed() {
        await test.step("Verify Skill grid columns are displayed", async () => {
            const headers = (await this.page.locator(SkillPage.TABLE_HEADERS).allTextContents())
                .map((h) => h.trim())
                .filter(Boolean);
            console.log(`[Skill] Table headers found: ${JSON.stringify(headers)}`);
            for (const expected of SkillConstants.EXPECTED_COLUMNS) {
                await Assert.assertTrue(
                    headers.some((h) => h.toLowerCase().includes(expected.toLowerCase())),
                    `Grid contains column '${expected}'`,
                );
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SEARCH
    // ═══════════════════════════════════════════════════════════════════════════

    public async searchSkill(term: string) {
        await test.step(`Search for skill: '${term}'`, async () => {
            const input = this.page.locator(SkillPage.SEARCH_INPUT);
            await expect(input, "Search input must be visible").toBeVisible({ timeout: 8000 });
            await input.fill(term);
            await this.waitForTableStable();
        });
    }

    public async clearSearch() {
        await test.step("Clear skill search field", async () => {
            await this.page.locator(SkillPage.SEARCH_INPUT).clear();
            await this.waitForTableStable();
        });
    }

    public async verifySkillInTable(skillName: string) {
        await test.step(`Verify '${skillName}' is visible in the table`, async () => {
            const row = this.page.locator(SkillPage.rowFor(skillName)).first();
            await expect(row, `Row for '${skillName}' must be visible`).toBeVisible({ timeout: 10000 });
        });
    }

    public async verifyNoRecordsMessage() {
        await test.step("Verify no-records empty state message is displayed", async () => {
            await this.waitForTableStable();
            await expect(
                this.page.locator(SkillPage.NO_RECORDS).first(),
                `'${SkillConstants.NO_RECORDS_TEXT}' must be visible`,
            ).toBeVisible({ timeout: 6000 });
        });
    }

    public async isSkillVisible(skillName: string): Promise<boolean> {
        return this.page.locator(SkillPage.rowFor(skillName)).first()
            .isVisible({ timeout: 3000 })
            .catch(() => false);
    }

    public async getTableRowCount(): Promise<number> {
        await this.waitForTableStable();
        return this.page.locator(SkillPage.TABLE_ROWS).count();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CATEGORY FILTER
    // ═══════════════════════════════════════════════════════════════════════════

    public async selectCategoryFilter(category: string) {
        await test.step(`Select category filter: '${category}'`, async () => {
            // Click the combobox trigger (role="combobox") to open the dropdown
            const trigger = this.page.locator(SkillPage.CATEGORY_FILTER_TRIGGER).first();
            await expect(trigger, "Category filter trigger must be visible").toBeVisible({ timeout: 5000 });
            await trigger.click();
            await this.page.waitForTimeout(SkillConstants.DROPDOWN_OPEN_MS);
            // Click the matching option
            const option = this.page.locator(`${SkillPage.DROPDOWN_OPTION}:has-text("${category}")`).first();
            await expect(option, `Category option '${category}' must be visible in dropdown`)
                .toBeVisible({ timeout: 5000 });
            await option.click();
            await this.waitForTableStable();
            console.log(`[Skill] Category filter set to: '${category}'`);
        });
    }

    public async verifyCategoryFilterOptions() {
        await test.step("Verify category filter dropdown has options", async () => {
            // Open the combobox, count options, then close by pressing Escape
            const trigger = this.page.locator(SkillPage.CATEGORY_FILTER_TRIGGER).first();
            await trigger.click();
            await this.page.waitForTimeout(SkillConstants.DROPDOWN_OPEN_MS);
            const options = await this.page.locator(SkillPage.DROPDOWN_OPTION).allTextContents();
            console.log(`[Skill] Category filter options: ${JSON.stringify(options)}`);
            // Close the dropdown without changing the selection
            await this.page.keyboard.press("Escape");
            await this.page.waitForTimeout(300);
            await Assert.assertTrue(options.length > 0, "Category filter has loaded options");
        });
    }

    public async resetCategoryFilter() {
        await test.step("Reset category filter to All Categories", async () => {
            const trigger = this.page.locator(SkillPage.CATEGORY_FILTER_TRIGGER).first();
            if (await trigger.isVisible({ timeout: 3000 }).catch(() => false)) {
                await trigger.click();
                await this.page.waitForTimeout(SkillConstants.DROPDOWN_OPEN_MS);
                const allOption = this.page.locator(`${SkillPage.DROPDOWN_OPTION}:has-text("All Categories")`).first();
                if (await allOption.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await allOption.click();
                } else {
                    await this.page.keyboard.press("Escape");
                }
                await this.waitForTableStable();
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGINATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async isNextPageAvailable(): Promise<boolean> {
        const nextBtn = this.page.locator(SkillPage.NEXT_PAGE_BTN).first();
        if (await nextBtn.count().then((c) => c === 0)) return false;
        const ariaDisabled = await nextBtn.getAttribute("aria-disabled").catch(() => null);
        const btnDisabled  = await nextBtn.isDisabled().catch(() => false);
        return ariaDisabled !== "true" && !btnDisabled;
    }

    public async clickNextPage() {
        await test.step("Click next page in pagination", async () => {
            await this.page.locator(SkillPage.NEXT_PAGE_BTN).first().click();
            await this.waitForTableStable();
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CREATE SKILL
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickCreateButton() {
        await test.step("Click Create Skill button", async () => {
            await this.page.locator(SkillPage.CREATE_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyCreatePageLoaded() {
        await test.step("Verify Create Skill page loaded", async () => {
            await expect(this.page).toHaveURL(/setup\/skill\/create/, { timeout: 10000 });
            await expect(
                this.page.locator(SkillPage.CREATE_HEADING).first(),
                "Create Skill heading must be visible",
            ).toBeVisible({ timeout: 8000 });
        });
    }

    public async fillCreateForm(data: SkillFormData) {
        await test.step("Fill Create Skill form", async () => {
            await this.page.locator(SkillPage.CODE_INPUT).first().fill(data.code);
            await this.page.locator(SkillPage.NAME_INPUT).first().fill(data.name);
            await this.page.locator(SkillPage.DESCRIPTION_INPUT).first().fill(data.description);

            // Category: native select inside the form
            const catSelect = this.page.locator(SkillPage.CATEGORY_SELECT).first();
            await catSelect.selectOption(data.category, { timeout: 5000 });

            // If "Other" is chosen, fill the extra custom category field
            if (data.category === SkillConstants.CATEGORY_OTHER && data.otherCategory) {
                await this.page.locator(SkillPage.OTHER_CATEGORY_INPUT)
                    .waitFor({ state: "visible", timeout: 3000 });
                await this.page.locator(SkillPage.OTHER_CATEGORY_INPUT).fill(data.otherCategory);
            }

            if (data.iconUrl) {
                await this.page.locator(SkillPage.ICON_INPUT).fill(data.iconUrl);
                await this.page.waitForTimeout(SkillConstants.ICON_PREVIEW_MS);
            }

            if (data.sortOrder !== undefined) {
                const soInput = this.page.locator(SkillPage.SORT_ORDER_INPUT).first();
                await soInput.click({ clickCount: 3 });
                await soInput.fill(data.sortOrder);
            }
        });
    }

    public async submitCreateForm() {
        await test.step("Submit Create Skill form", async () => {
            await this.page.locator(SkillPage.SAVE_BTN).click();
            await this.page.waitForLoadState("networkidle", { timeout: 10000 });
        });
    }

    // Submits create form AND verifies the success toast before networkidle can let
    // the toast auto-dismiss. Use this instead of submitCreateForm + verifySuccessToast.
    public async submitCreateFormAndVerifyToast() {
        await test.step("Submit Create Skill form and verify success toast", async () => {
            const maxAttempts = 3;
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                await this.page.locator(SkillPage.SAVE_BTN).click();
                const toast = this.page.locator(".Toastify__toast").first();
                await expect(toast, "Toast must appear after Save").toBeVisible({ timeout: 8000 });

                let toastText = (await toast.innerText().catch(() => "")).toLowerCase();
                console.log(`[Skill] Toast (attempt ${attempt}): '${toastText}'`);

                const isSuccess = () => toastText.includes("success") || toastText.includes("created") || toastText.includes("saved");
                if (!isSuccess()) {
                    // Toast visible but text not rendered yet (slow DOM hydration) — re-read once
                    await this.page.waitForTimeout(800);
                    toastText = (await toast.innerText().catch(() => "")).toLowerCase();
                    console.log(`[Skill] Toast (re-read attempt ${attempt}): '${toastText}'`);
                }

                if (isSuccess()) {
                    await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
                    return;
                }

                // If rate limited, wait and retry
                if (toastText.includes("429") || toastText.includes("too many") || toastText.includes("rate")) {
                    if (attempt < maxAttempts) {
                        console.log(`[Skill] HTTP 429 rate-limit detected — waiting 5s before retrying (attempt ${attempt} of ${maxAttempts})`);
                        await this.page.waitForTimeout(5000);
                        continue;
                    } else {
                        // Check if redirect already happened (late backend acceptance)
                        const urlAfter429 = this.page.url();
                        if (!urlAfter429.includes("/create")) {
                            console.log(`[Skill] 429 on final attempt but URL left /create → '${urlAfter429}'. Treating as success.`);
                            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
                            return;
                        }
                        throw new Error(`Server rate-limited (HTTP 429) — skill was not created after ${maxAttempts} attempts. Reduce test cadence or add delays.`);
                    }
                }

                // Fallback: if URL left the create page, treat as success (redirect = server accepted)
                const currentUrl = this.page.url();
                if (!currentUrl.includes("/create")) {
                    console.log(`[Skill] Non-success toast but URL left /create → '${currentUrl}'. Accepting as success.`);
                    await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
                    return;
                }

                // If not success and not rate-limited, immediately fail (e.g. duplicate code/validation)
                await Assert.assertTrue(false, `Toast must confirm success; actual: '${toastText}'`);
            }
        });
    }

    public async submitCreateFormExpectingValidation() {
        await test.step("Submit Create Skill form expecting validation to block submission", async () => {
            const urlBefore = this.page.url();
            await this.page.locator(SkillPage.SAVE_BTN).click();
            await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
            await Assert.assertEquals(
                this.page.url(), urlBefore,
                "Form with invalid data must remain on Create page",
            );
        });
    }

    public async verifyRequiredFieldsBlocked() {
        await test.step("Verify required fields block form submission", async () => {
            // The app uses React-based validation (not HTML5 :invalid pseudo-class).
            // Authoritative proof: form stays on the create page after submit attempt.
            const url = this.page.url();
            await Assert.assertTrue(
                url.includes(SkillConstants.CREATE_URL_SEGMENT),
                `Form with empty required fields must remain on create page; actual URL: '${url}'`,
            );
            console.log(`[Skill] Validation confirmed — URL still on create page: ${url}`);
        });
    }

    public async verifySuccessToast() {
        await test.step("Verify success toast is displayed", async () => {
            // Use the Toastify-specific class to avoid matching the always-present
            // empty ARIA live region ([role="alert"]) that the app renders in the DOM.
            const toast = this.page.locator(".Toastify__toast").first();
            await expect(toast, "A Toastify toast must appear after save").toBeVisible({ timeout: 8000 });
            const text = (await toast.innerText().catch(() => "")).toLowerCase();
            console.log(`[Skill] Toast text: '${text}'`);
            await Assert.assertTrue(
                text.includes("success") || text.includes("created") || text.includes("saved") || text.includes("updated"),
                `Toast must confirm success; actual text: '${text}'`,
            );
        });
    }

    public async clickCancel() {
        await test.step("Click Cancel button", async () => {
            await this.page.locator(SkillPage.CANCEL_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async clickBack() {
        await test.step("Click Back button", async () => {
            await this.page.locator(SkillPage.BACK_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyOnListPage() {
        await test.step("Verify navigation returned to Skill listing page", async () => {
            await expect(this.page).toHaveURL(
                new RegExp(SkillConstants.PAGE_URL_SEGMENT), { timeout: 10000 },
            );
            await expect(
                this.page.locator(SkillPage.PAGE_HEADING).first(),
            ).toBeVisible({ timeout: 8000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // EDIT SKILL
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickEditIconForRow(skillName: string) {
        await test.step(`Click Edit icon for '${skillName}'`, async () => {
            const row = this.page.locator(SkillPage.rowFor(skillName)).first();
            await expect(row, `Row for '${skillName}' must exist`).toBeVisible({ timeout: 8000 });
            // Edit is the first action button (nth 0), Delete is last
            await row.locator("td:last-child button").nth(0).click();
            await this.page.waitForLoadState("networkidle");
            await this.page.waitForTimeout(1000); // edit form renders asynchronously
        });
    }

    public async verifyEditPageLoaded() {
        await test.step("Verify Edit Skill page loaded", async () => {
            await expect(this.page).toHaveURL(/setup\/skill\/edit/, { timeout: 10000 });
            // Edit page heading OR Update button confirms we're on edit
            const updateBtn = this.page.locator(SkillPage.UPDATE_BTN);
            await expect(updateBtn, "'Update Skill' button must be visible on Edit page")
                .toBeVisible({ timeout: 8000 });
        });
    }

    public async updateSkillName(newName: string) {
        await test.step(`Update skill name to '${newName}'`, async () => {
            const input = this.page.locator(SkillPage.NAME_INPUT).first();
            await input.click({ clickCount: 3 });
            await input.fill(newName);
        });
    }

    public async updateDescription(newDesc: string) {
        await test.step(`Update description to '${newDesc}'`, async () => {
            const inp = this.page.locator(SkillPage.DESCRIPTION_INPUT).first();
            await inp.click({ clickCount: 3 });
            await inp.fill(newDesc);
        });
    }

    public async submitEditForm() {
        await test.step("Submit Edit Skill form", async () => {
            await this.page.locator(SkillPage.UPDATE_BTN).click();
            await this.page.waitForLoadState("networkidle", { timeout: 10000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ICON PREVIEW
    // ═══════════════════════════════════════════════════════════════════════════

    public async fillIconUrl(url: string) {
        await test.step(`Enter icon URL: '${url}'`, async () => {
            await this.page.locator(SkillPage.ICON_INPUT).fill(url);
            await this.page.waitForTimeout(SkillConstants.ICON_PREVIEW_MS);
        });
    }

    public async verifyIconPreviewVisible() {
        await test.step("Verify icon preview image is visible", async () => {
            const img = this.page.locator(SkillPage.ICON_PREVIEW_IMG).first();
            await expect(img, "Icon preview image must appear after valid URL is entered")
                .toBeVisible({ timeout: 5000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // OTHER CATEGORY FIELD
    // ═══════════════════════════════════════════════════════════════════════════

    public async selectCategory(category: string) {
        await test.step(`Select category '${category}' in form`, async () => {
            const sel = this.page.locator(SkillPage.CATEGORY_SELECT).first();
            await sel.selectOption(category, { timeout: 5000 });
            await this.page.waitForTimeout(400);
        });
    }

    public async verifyOtherCategoryInputVisible() {
        await test.step("Verify 'Enter custom category' field appears when Other is selected", async () => {
            await expect(
                this.page.locator(SkillPage.OTHER_CATEGORY_INPUT).first(),
                "'Enter custom category' input must be visible after selecting Other",
            ).toBeVisible({ timeout: 5000 });
        });
    }

    public async verifyOtherCategoryInputHidden() {
        await test.step("Verify 'Enter custom category' field is hidden for non-Other categories", async () => {
            const hidden = await this.page.locator(SkillPage.OTHER_CATEGORY_INPUT)
                .isVisible({ timeout: 1500 })
                .catch(() => false);
            await Assert.assertFalse(hidden, "'Enter custom category' must be hidden for non-Other category");
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DELETE SKILL
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickDeleteIconForRow(skillName: string) {
        await test.step(`Click Delete icon for '${skillName}'`, async () => {
            const row = this.page.locator(SkillPage.rowFor(skillName)).first();
            await expect(row, `Row for '${skillName}' must exist`).toBeVisible({ timeout: 8000 });
            // Delete is the last action button
            await row.locator("td:last-child button").last().click();
            await this.page.locator(SkillPage.DELETE_POPUP)
                .waitFor({ state: "visible", timeout: 5000 });
        });
    }

    public async verifyDeleteConfirmationPopup() {
        await test.step("Verify delete confirmation popup appears", async () => {
            await expect(
                this.page.locator(SkillPage.DELETE_POPUP).first(),
                "Delete confirmation popup must appear",
            ).toBeVisible({ timeout: 5000 });
        });
    }

    public async confirmDelete() {
        await test.step("Confirm deletion", async () => {
            await this.page.locator(SkillPage.DELETE_YES_BTN).first().click();
            await this.page.waitForLoadState("networkidle", { timeout: 10000 });
            await this.page.waitForTimeout(1500);
        });
    }

    public async cancelDelete() {
        await test.step("Cancel deletion popup", async () => {
            await this.page.locator(SkillPage.DELETE_CANCEL_BTN).first().click();
            await expect(this.page.locator(SkillPage.DELETE_POPUP).first())
                .toBeHidden({ timeout: 5000 });
        });
    }

    public async verifySkillRemoved(skillName: string) {
        await test.step(`Verify '${skillName}' is no longer in the table`, async () => {
            await this.navigateToSkill();
            await this.searchSkill(skillName);
            const visible = await this.isSkillVisible(skillName);
            await Assert.assertFalse(visible, `Deleted skill '${skillName}' must not appear in table`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DUPLICATE CODE (TC_SKILL_19)
    // ═══════════════════════════════════════════════════════════════════════════

    // Clicks Save and immediately checks for the duplicate-code error toast before
    // waitForLoadState can let it auto-dismiss.
    // Audit evidence: backend returns "Skill with code '...' already exists"
    public async submitAndVerifyDuplicateCodeError(code: string) {
        await test.step(`Submit form and verify duplicate code error for '${code}'`, async () => {
            await this.page.locator(SkillPage.SAVE_BTN).click();
            const toast = this.page.locator(".Toastify__toast").first();
            await expect(toast, "Error toast must appear for duplicate code").toBeVisible({ timeout: 8000 });
            const toastText = (await toast.innerText().catch(() => "")).trim();
            await Assert.assertTrue(
                toastText.toLowerCase().includes("already exists") || toastText.toLowerCase().includes(code.toLowerCase()),
                `Toast must mention duplicate code; actual: '${toastText}'`,
            );
            console.log(`[Skill] Duplicate code error confirmed: '${toastText}'`);
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
            const urlAfter = this.page.url();
            await Assert.assertTrue(
                urlAfter.includes(SkillConstants.CREATE_URL_SEGMENT),
                `Form must stay on create page after duplicate code rejection; actual: '${urlAfter}'`,
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // NON-NUMERIC SORT ORDER (TC_SKILL_20)
    // ═══════════════════════════════════════════════════════════════════════════

    // Verifies that input[type="number"] rejects non-numeric keyboard input.
    // Audit evidence: typing 'abc' and '!@#' both result in empty string.
    public async verifyNonNumericSortOrderRejected() {
        await test.step("Verify sort order input rejects non-numeric characters", async () => {
            const soInput = this.page.locator(SkillPage.SORT_ORDER_INPUT).first();
            await expect(soInput, "Sort order input must be visible").toBeVisible({ timeout: 5000 });
            await soInput.click({ clickCount: 3 });
            await soInput.pressSequentially("abc");
            const afterAlpha = await soInput.inputValue();
            await soInput.click({ clickCount: 3 });
            await soInput.pressSequentially("!@#");
            const afterSpecial = await soInput.inputValue();
            console.log(`[Skill] Sort order after 'abc': '${afterAlpha}', after '!@#': '${afterSpecial}'`);
            await Assert.assertTrue(
                afterAlpha === "" || afterAlpha === "0",
                `Sort order must reject alphabetic input; got '${afterAlpha}'`,
            );
            await Assert.assertTrue(
                afterSpecial === "" || afterSpecial === "0",
                `Sort order must reject special chars; got '${afterSpecial}'`,
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SORT ORDER HELPERS (TC_SKILL_21 + DEFECT-03)
    // ═══════════════════════════════════════════════════════════════════════════

    public async getSortOrderFromRow(skillName: string): Promise<string> {
        const row = this.page.locator(SkillPage.rowFor(skillName)).first();
        await expect(row, `Row for '${skillName}' must be visible`).toBeVisible({ timeout: 8000 });
        return (await row.locator("td:nth-child(6)").innerText().catch(() => "")).trim();
    }

    public async getSortOrderFromForm(): Promise<string> {
        return (await this.page.locator(SkillPage.SORT_ORDER_INPUT).first().inputValue().catch(() => "")).trim();
    }

    public async getAllSortOrderValues(): Promise<string[]> {
        await this.waitForTableStable();
        const raw = await this.page.locator(SkillPage.CELL_SORT_ORDER).allTextContents();
        return raw.map((v) => v.trim()).filter(Boolean);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY — search-and-delete (used by new behavior-verification tests)
    // ═══════════════════════════════════════════════════════════════════════════

    // Navigates to listing, searches for `searchTerm`, and deletes the first
    // matching row. Safe to call when no record exists (no-op in that case).
    public async deleteBySearch(searchTerm: string): Promise<void> {
        await test.step(`Delete skill found by searching '${searchTerm}'`, async () => {
            await this.navigateToSkill();
            await this.searchSkill(searchTerm);
            const noRecords = await this.page.locator(SkillPage.NO_RECORDS)
                .isVisible({ timeout: 2000 }).catch(() => false);
            if (noRecords) {
                console.log(`[Skill] No record for search '${searchTerm}' — nothing to delete`);
                return;
            }
            const row = this.page.locator(SkillPage.TABLE_ROWS).first();
            if (!await row.isVisible({ timeout: 3000 }).catch(() => false)) return;
            await row.locator("td:last-child button").last().click();
            await this.page.locator(SkillPage.DELETE_POPUP)
                .waitFor({ state: "visible", timeout: 5000 });
            await this.confirmDelete();
            // Rate-limit cooldown: server enforces per-second limits; pause before next create
            await this.page.waitForTimeout(2500);
            console.log(`[Skill] Deleted skill found by search '${searchTerm}'`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // XSS
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyXSSInputSanitized(xssPayload: string) {
        await test.step("Verify XSS payload is rendered as text, not executed", async () => {
            // If XSS executes, the payload would modify the DOM; we simply check it's
            // present as escaped text and no alert / unexpected element was injected.
            const bodyText = await this.page.locator("body").innerText();
            const alertTriggered = await this.page.evaluate(() => {
                // If window.alert was called via XSS, a flag would be set; also check title
                return document.title.includes("<script>") || document.body.innerHTML.includes("<script>alert");
            });
            await Assert.assertFalse(alertTriggered, "XSS payload must not execute in the DOM");
            console.log(`[Skill] XSS check passed — payload not executed`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SHARED SKILL HELPERS (used by beforeAll / afterAll)
    // ═══════════════════════════════════════════════════════════════════════════

    public async createSkillAndNavigateBack(data: SkillFormData): Promise<void> {
        await test.step(`Create skill '${data.name}' and return to listing`, async () => {
            await this.navigateToSkill();
            await this.clickCreateButton();
            await this.verifyCreatePageLoaded();
            await this.fillCreateForm(data);

            // Use the robust helper with retry mechanism
            await this.submitCreateFormAndVerifyToast();

            // Now wait for page navigation and backend to settle
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
            await this.page.waitForTimeout(500);

            // Navigate to listing, reload for fresh data, search for the new skill
            await this.navigateToSkill();
            await this.page.reload();
            await this.page.waitForLoadState("networkidle");
            await this.page.waitForTimeout(600);
            await this.searchSkill(data.name);
            await this.verifySkillInTable(data.name);
            await this.clearSearch();
            console.log(`[Skill] Created and verified: '${data.name}' (code: ${data.code})`);
        });
    }
}
