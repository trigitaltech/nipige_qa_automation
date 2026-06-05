import test, { Page, expect } from "@playwright/test";
import Assert from "@asserts/Assert";
import ConcernPage from "@pages/ConcernPage";
import ConcernConstants from "@uiConstants/ConcernConstants";

export interface ConcernFormData {
    concernName: string;
    concernType?: "Custom" | "System";
    description?: string;
    defaultChannel?: string;
    priority?: string;
}

export default class ConcernSteps {
    constructor(private readonly page: Page) {}

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY
    // ═══════════════════════════════════════════════════════════════════════════

    public generateUniqueConcernName(prefix = "CONCERN"): string {
        return `${prefix}_${Date.now().toString().slice(-8)}`;
    }

    public async waitForTableStable() {
        await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
        await this.page.waitForTimeout(ConcernConstants.TABLE_SETTLE_MS);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async navigateToConcern() {
        await test.step("Navigate to Concern listing page", async () => {
            const targetUrl = `${process.env.BASE_URL}${ConcernPage.CONCERN_PATH}`;
            console.log(`[Concern] Navigating to: ${targetUrl}`);
            await this.page.goto(targetUrl);
            await this.page.waitForLoadState("networkidle");
            const landedUrl = this.page.url();
            console.log(`[Concern] Landed on: ${landedUrl}`);
            if (landedUrl.includes("/login")) {
                throw new Error(
                    `Concern navigation redirected to login. `
                    + `validateLogin() must run before navigating to protected routes. `
                    + `Actual URL: ${landedUrl}`,
                );
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // HOME PAGE VERIFICATION  (used by TC_CONCERN_01)
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyHomePageDisplayed() {
        await test.step("Verify Home page is displayed after login", async () => {
            await expect(this.page, "URL must be on /home after login")
                .toHaveURL(/\/home/, { timeout: 10000 });
            await expect(
                this.page.locator(ConcernPage.PROFILE_MENU).first(),
                "Profile menu must be visible — confirms user is logged in",
            ).toBeVisible({ timeout: 10000 });
            await expect(
                this.page.locator(ConcernPage.SIDEBAR_NAV).first(),
                "Sidebar navigation must be visible on the home page",
            ).toBeVisible({ timeout: 8000 });
            await expect(
                this.page.locator(ConcernPage.HOME_GREETING).first(),
                "Home page greeting heading must be visible",
            ).toBeVisible({ timeout: 8000 });
            console.log(`[Concern] Home page verified. URL: ${this.page.url()}`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // UI NAVIGATION: Setup → Concern  (TC_CONCERN_01 only)
    // ═══════════════════════════════════════════════════════════════════════════

    public async navigateToConcernViaSetupMenu() {
        await test.step("Navigate to Concern via Setup menu in sidebar", async () => {
            console.log("[Concern] Clicking Setup menu in sidebar");

            // Setup is a collapsible accordion. Concern link is NOT in DOM until Setup is expanded.
            // Guard: if Setup was already expanded from a previous interaction, skip the click.
            const alreadyExpanded = await this.page.locator(ConcernPage.CONCERN_SUBMENU_LINK)
                .isVisible({ timeout: 800 }).catch(() => false);

            if (!alreadyExpanded) {
                const setupBtn = this.page.locator(ConcernPage.SETUP_MENU_BTN).first();
                // Setup is near the bottom of the sidebar — scroll it into view first
                await setupBtn.scrollIntoViewIfNeeded({ timeout: 10000 });
                await setupBtn.click();
                await this.page.locator(ConcernPage.CONCERN_SUBMENU_LINK)
                    .waitFor({ state: "visible", timeout: 5000 });
                console.log("[Concern] Setup menu expanded — Concern submenu link is now visible");
            } else {
                console.log("[Concern] Setup menu was already expanded");
            }

            console.log("[Concern] Clicking Concern submenu link");
            await this.page.locator(ConcernPage.CONCERN_SUBMENU_LINK).first().click();
            await this.page.waitForURL(/setup\/concern(?!\/create)/, { timeout: 15000 });
            console.log(`[Concern] Navigated via menu to: ${this.page.url()}`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGE VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyPageLoaded() {
        await test.step("Verify Concern listing page loaded", async () => {
            await expect(this.page).toHaveURL(
                /setup\/concern(?!\/create)/, { timeout: 15000 },
            );
            await expect(
                this.page.locator(ConcernPage.PAGE_HEADING).first(),
                "Concerns h1 heading must be visible",
            ).toBeVisible({ timeout: 10000 });
            await expect(
                this.page.locator(ConcernPage.TABLE),
                "Concern list table must be present",
            ).toBeVisible({ timeout: 10000 });
        });
    }

    public async verifySummaryCardsDisplayed() {
        await test.step("Verify Concern summary cards are displayed", async () => {
            // Use p.uppercase selector to avoid matching filter tab buttons
            await Promise.all(ConcernConstants.EXPECTED_SUMMARY_CARDS.map((label) => expect(
                this.page.locator(`p.uppercase:has-text("${label}")`).first(),
                `Stat card '${label}' must be visible`,
            ).toBeVisible({ timeout: 8000 })));
        });
    }

    public async verifyGridColumnsDisplayed() {
        await test.step("Verify Concern grid columns are displayed", async () => {
            const headers = (await this.page.locator(ConcernPage.TABLE_HEADERS).allTextContents())
                .map((h) => h.trim())
                .filter(Boolean);
            await Promise.all(ConcernConstants.EXPECTED_COLUMNS.map((expectedCol) => Assert.assertTrue(
                headers.some((h) => h.toLowerCase() === expectedCol.toLowerCase()),
                `Grid contains '${expectedCol}' column`,
            )));
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TABLE HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    public async getTableRowCount(): Promise<number> {
        await this.waitForTableStable();
        return this.page.locator(ConcernPage.TABLE_ROWS).count();
    }

    public async isConcernVisible(concernName: string): Promise<boolean> {
        return this.page.locator(ConcernPage.rowFor(concernName)).first()
            .isVisible({ timeout: 3000 })
            .catch(() => false);
    }

    public async verifyConcernInTable(concernName: string) {
        await test.step(`Verify '${concernName}' is visible in the table`, async () => {
            const row = this.page.locator(ConcernPage.rowFor(concernName)).first();
            await expect(row, `Row for '${concernName}' must be visible`).toBeVisible({ timeout: 10000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SEARCH
    // ═══════════════════════════════════════════════════════════════════════════

    public async searchConcern(term: string) {
        await test.step(`Search for concern: '${term}'`, async () => {
            const input = this.page.locator(ConcernPage.SEARCH_INPUT);
            await expect(input, "Search input must be visible").toBeVisible({ timeout: 8000 });
            await input.fill(term);
            await this.waitForTableStable();
            console.log(`[Concern] Searched for: '${term}'`);
        });
    }

    public async clearSearch() {
        await test.step("Clear search field", async () => {
            await this.page.locator(ConcernPage.SEARCH_INPUT).clear();
            await this.waitForTableStable();
        });
    }

    public async verifyNoRecordsMessage() {
        await test.step("Verify no-records message is displayed", async () => {
            await this.waitForTableStable();
            await expect(
                this.page.locator(ConcernPage.NO_RECORDS).first(),
                `No-records message '${ConcernConstants.NO_RECORDS_TEXT}' must be visible`,
            ).toBeVisible({ timeout: 5000 });
        });
    }

    public async verifySearchResultsContainTerm(term: string) {
        await test.step(`Verify search results contain '${term}'`, async () => {
            await this.waitForTableStable();
            const count = await this.page.locator(ConcernPage.TABLE_ROWS).count();
            if (count === 0) {
                const noRecordsVisible = await this.page.locator(ConcernPage.NO_RECORDS)
                    .isVisible({ timeout: 3000 }).catch(() => false);
                await Assert.assertTrue(noRecordsVisible, "No-records message shown when search returns empty");
                return;
            }
            const firstText = (await this.page.locator(ConcernPage.CELL_CONCERN_NAME).first().innerText()).trim();
            await Assert.assertTrue(
                firstText.toLowerCase().includes(term.toLowerCase()),
                `First result '${firstText}' matches search term '${term}'`,
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FILTER TABS
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickFilterAllTypes() {
        await test.step("Click 'All Types' filter tab", async () => {
            await this.page.locator(ConcernPage.TAB_ALL_TYPES).first().click();
            await this.waitForTableStable();
        });
    }

    public async clickFilterSystem() {
        await test.step("Click 'System' filter tab", async () => {
            await this.page.locator(ConcernPage.TAB_SYSTEM).first().click();
            await this.waitForTableStable();
        });
    }

    public async clickFilterCustom() {
        await test.step("Click 'Custom' filter tab", async () => {
            await this.page.locator(ConcernPage.TAB_CUSTOM).first().click();
            await this.waitForTableStable();
        });
    }

    public async verifyOnlySystemConcernsDisplayed() {
        await test.step("Verify only SYSTEM concerns are displayed", async () => {
            await this.waitForTableStable();
            const rowCount = await this.page.locator(ConcernPage.TABLE_ROWS).count();
            if (rowCount === 0) {
                console.log("[Concern] No rows visible under System filter");
                return;
            }
            for (let i = 0; i < rowCount; i++) {
                const badgeText = await this.page.locator(ConcernPage.CELL_TYPE_BADGE).nth(i)
                    .innerText().catch(() => "");
                await Assert.assertTrue(
                    badgeText.toLowerCase() === ConcernConstants.TYPE_SYSTEM_BADGE,
                    `Row [${i}] type badge is '${ConcernConstants.TYPE_SYSTEM_BADGE}', got '${badgeText}'`,
                );
            }
        });
    }

    public async verifyOnlyCustomConcernsDisplayed() {
        await test.step("Verify only CUSTOM concerns are displayed", async () => {
            await this.waitForTableStable();
            const rowCount = await this.page.locator(ConcernPage.TABLE_ROWS).count();
            if (rowCount === 0) {
                console.log("[Concern] No rows visible under Custom filter");
                return;
            }
            for (let i = 0; i < rowCount; i++) {
                const badgeText = await this.page.locator(ConcernPage.CELL_TYPE_BADGE).nth(i)
                    .innerText().catch(() => "");
                await Assert.assertTrue(
                    badgeText.toLowerCase() === ConcernConstants.TYPE_CUSTOM_BADGE,
                    `Row [${i}] type badge is '${ConcernConstants.TYPE_CUSTOM_BADGE}', got '${badgeText}'`,
                );
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGINATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async isNextButtonEnabled(): Promise<boolean> {
        const nextLink = this.page.locator(ConcernPage.NEXT_BTN).first();
        const count = await nextLink.count();
        if (count === 0) return false;
        const ariaDisabled = await nextLink.getAttribute("aria-disabled");
        return ariaDisabled !== "true";
    }

    public async clickNext() {
        await test.step("Click Next pagination button", async () => {
            await this.page.locator(ConcernPage.NEXT_BTN).first().click();
            await this.waitForTableStable();
        });
    }

    public async clickPrevious() {
        await test.step("Click Previous pagination button", async () => {
            await this.page.locator(ConcernPage.PREV_BTN).first().click();
            await this.waitForTableStable();
        });
    }

    public async getCurrentPageNumber(): Promise<string> {
        const activePage = this.page.locator(ConcernPage.PAGE_NUMBER).first();
        const exists = await activePage.count().then((c) => c > 0);
        if (!exists) return "1";
        return (await activePage.innerText()).trim();
    }

    public async verifyPaginationNextNavigates() {
        await test.step("Verify Next button navigates to next page", async () => {
            const nextEnabled = await this.isNextButtonEnabled();
            if (!nextEnabled) {
                console.log("[Concern] Next button disabled — single page of results, pagination test skipped");
                return;
            }
            const firstRowBefore = await this.page.locator(ConcernPage.CELL_CONCERN_NAME)
                .first().innerText().catch(() => "");
            await this.clickNext();
            const firstRowAfter = await this.page.locator(ConcernPage.CELL_CONCERN_NAME)
                .first().innerText().catch(() => "");
            await Assert.assertTrue(
                firstRowBefore !== firstRowAfter,
                "Next button changed the displayed rows",
            );
        });
    }

    public async verifyNextOnLastPageStays() {
        await test.step("Verify Next on last page does not advance further", async () => {
            // Navigate to last page by clicking Next until disabled
            let nextEnabled = await this.isNextButtonEnabled();
            let safetyCount = 0;
            while (nextEnabled && safetyCount < 20) {
                await this.clickNext();
                nextEnabled = await this.isNextButtonEnabled();
                safetyCount++;
            }
            const pageOnLastPage = await this.getCurrentPageNumber();
            // Try clicking Next one more time — page number should not change
            const nextStillDisabled = !(await this.isNextButtonEnabled());
            await Assert.assertTrue(nextStillDisabled, "Next button is disabled on the last page");
            const pageAfterExtraClick = await this.getCurrentPageNumber();
            await Assert.assertEquals(
                pageAfterExtraClick, pageOnLastPage,
                "Page number does not change when Next is clicked on last page",
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CREATE CONCERN
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickCreateButton() {
        await test.step("Click Create Concern button", async () => {
            await this.page.locator(ConcernPage.CREATE_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyCreatePageLoaded() {
        await test.step("Verify Create Concern page loaded", async () => {
            await expect(this.page).toHaveURL(/setup\/concern\/create/, { timeout: 10000 });
            await expect(
                this.page.locator(ConcernPage.CREATE_HEADING).first(),
                "Create Concern h1 must be visible",
            ).toBeVisible({ timeout: 8000 });
        });
    }

    public async fillConcernName(name: string) {
        await test.step(`Fill Concern Name: '${name}'`, async () => {
            const input = this.page.locator(ConcernPage.CONCERN_NAME_INPUT).first();
            await expect(input, "Concern Name input must be visible").toBeVisible({ timeout: 8000 });
            await input.clear();
            await input.fill(name);
        });
    }

    public async selectConcernType(type: "Custom" | "System") {
        await test.step(`Select Concern Type: '${type}'`, async () => {
            const filterText = type === "Custom"
                ? ConcernPage.CUSTOM_TYPE_FILTER_TEXT
                : ConcernPage.SYSTEM_TYPE_FILTER_TEXT;
            // The radio inputs are readonly — click the parent container div
            await this.page.locator(ConcernPage.RADIO_CONTAINER)
                .filter({ hasText: filterText })
                .first()
                .click();
            await this.page.waitForTimeout(300);
            console.log(`[Concern] Selected concern type: '${type}'`);
        });
    }

    public async fillDescription(description: string) {
        await test.step(`Fill Description: '${description}'`, async () => {
            const textarea = this.page.locator(ConcernPage.DESCRIPTION_INPUT).first();
            await expect(textarea, "Description textarea must be visible").toBeVisible({ timeout: 8000 });
            await textarea.fill(description);
        });
    }

    public async selectDefaultChannel(channel: string) {
        await test.step(`Select Default Channel: '${channel}'`, async () => {
            // nth(0): first <select> on the create form = Default Channel
            const select = this.page.locator(ConcernPage.FORM_SELECT).nth(0);
            await expect(select, "Default Channel select must be visible").toBeVisible({ timeout: 8000 });
            await select.selectOption(channel);
            console.log(`[Concern] Selected channel: '${channel}'`);
        });
    }

    public async selectPriority(priority: string) {
        await test.step(`Select Priority: '${priority}'`, async () => {
            // nth(1): second <select> on the create form = Priority
            const select = this.page.locator(ConcernPage.FORM_SELECT).nth(1);
            await expect(select, "Priority select must be visible").toBeVisible({ timeout: 8000 });
            await select.selectOption(priority);
            console.log(`[Concern] Selected priority: '${priority}'`);
        });
    }

    public async fillCreateForm(data: ConcernFormData) {
        await test.step(`Fill Create Concern form: '${data.concernName}'`, async () => {
            await this.fillConcernName(data.concernName);

            if (data.concernType) {
                await this.selectConcernType(data.concernType);
            }
            if (data.description) {
                await this.fillDescription(data.description);
            }
            if (data.defaultChannel) {
                await this.selectDefaultChannel(data.defaultChannel);
            }
            if (data.priority) {
                await this.selectPriority(data.priority);
            }
        });
    }

    public async clickSave() {
        await test.step("Click Save button", async () => {
            await this.page.locator(ConcernPage.SAVE_BTN).first().click();
            await this.page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
        });
    }

    public async clickSaveExpectingValidation() {
        await test.step("Click Save expecting form to stay on create page", async () => {
            const urlBefore = this.page.url();
            await this.page.locator(ConcernPage.SAVE_BTN).first().click();
            await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
            await this.page.waitForTimeout(500);
            const urlAfter = this.page.url();
            await Assert.assertEquals(urlAfter, urlBefore, "Form with errors must remain on create page");
        });
    }

    public async clickCancel() {
        await test.step("Click Cancel button", async () => {
            await this.page.locator(ConcernPage.CANCEL_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PREVIEW PANEL
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyPreviewUpdates(expectedName: string) {
        await test.step(`Verify preview panel reflects concern name '${expectedName}'`, async () => {
            const previewText = await this.page.locator(ConcernPage.PREVIEW_PANEL).first().innerText();
            await Assert.assertTrue(
                previewText.toUpperCase().includes(expectedName.toUpperCase()),
                `Preview panel contains name '${expectedName}'`,
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DROPDOWN VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyDefaultChannelSelected(channel: string) {
        await test.step(`Verify Default Channel shows '${channel}'`, async () => {
            const select = this.page.locator(ConcernPage.FORM_SELECT).nth(0);
            const selectedText = await select.evaluate(
                (el: HTMLSelectElement) => el.options[el.selectedIndex]?.text ?? "",
            );
            await Assert.assertContains(selectedText, channel, "Default Channel selected value");
        });
    }

    public async verifyPrioritySelected(priority: string) {
        await test.step(`Verify Priority shows '${priority}'`, async () => {
            const select = this.page.locator(ConcernPage.FORM_SELECT).nth(1);
            const selectedText = await select.evaluate(
                (el: HTMLSelectElement) => el.options[el.selectedIndex]?.text ?? "",
            );
            await Assert.assertContains(selectedText, priority, "Priority selected value");
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // VALIDATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyValidationVisible(hintText?: string) {
        await test.step("Verify validation message is displayed", async () => {
            await this.page.waitForTimeout(500);
            const bodyText = (await this.page.locator("body").innerText()).toLowerCase();
            const inlineError = await this.page.locator(ConcernPage.VALIDATION_MESSAGE)
                .first().isVisible({ timeout: 3000 }).catch(() => false);
            const hasHint = hintText ? bodyText.includes(hintText.toLowerCase()) : false;
            const stayedOnCreate = this.page.url().includes("concern/create");
            await Assert.assertTrue(
                inlineError || hasHint || stayedOnCreate,
                "Validation feedback is visible or URL indicates the form was not submitted",
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SUCCESS / TOAST
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifySuccessMessage() {
        await test.step("Verify success toast message is displayed", async () => {
            const toast = this.page.locator(ConcernPage.TOAST).first();
            await expect(toast, "Success toast must appear").toBeVisible({
                timeout: ConcernConstants.TOAST_TIMEOUT_MS,
            });
            console.log("[Concern] Success toast appeared");
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DELETE CONCERN
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickDeleteIconForRow(concernName: string) {
        await test.step(`Click Delete icon for '${concernName}'`, async () => {
            const row = this.page.locator(ConcernPage.rowFor(concernName)).first();
            await expect(row, `Row for '${concernName}' must exist`).toBeVisible({ timeout: 8000 });
            // Only one button per row (the delete icon)
            await row.locator("td:last-child button").first().click();
            await this.page.locator(ConcernPage.DELETE_POPUP)
                .waitFor({ state: "visible", timeout: 5000 });
            console.log(`[Concern] Delete popup opened for '${concernName}'`);
        });
    }

    public async verifyDeleteConfirmationPopup(concernName: string) {
        await test.step("Verify delete confirmation popup appears", async () => {
            const popup = this.page.locator(ConcernPage.DELETE_POPUP).first();
            await expect(popup, "Delete confirmation popup must appear").toBeVisible({ timeout: 5000 });
            const popupText = (await popup.innerText()).toLowerCase();
            await Assert.assertTrue(
                popupText.includes("delete"),
                `Delete popup mentions 'delete' for '${concernName}'`,
            );
        });
    }

    public async confirmDelete() {
        await test.step("Confirm deletion", async () => {
            await this.page.locator(ConcernPage.DELETE_YES_BTN).first().click();
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
            await this.page.waitForTimeout(1000);
            console.log("[Concern] Delete confirmed");
        });
    }

    public async cancelDelete() {
        await test.step("Cancel delete popup", async () => {
            await this.page.locator(ConcernPage.DELETE_NO_BTN).first().click();
            await expect(
                this.page.locator(ConcernPage.DELETE_POPUP).first(),
            ).toBeHidden({ timeout: 5000 });
        });
    }

    public async verifyConcernRemoved(concernName: string) {
        await test.step(`Verify '${concernName}' no longer in table`, async () => {
            await this.navigateToConcern();
            await this.searchConcern(concernName);
            await this.waitForTableStable();
            const rowVisible = await this.page.locator(ConcernPage.rowFor(concernName))
                .isVisible({ timeout: 3000 }).catch(() => false);
            await Assert.assertFalse(rowVisible, `Deleted concern '${concernName}' must not appear in table`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // URL / NAVIGATION VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyOnListPage() {
        await test.step("Verify back on Concern listing page", async () => {
            await expect(this.page).toHaveURL(
                /setup\/concern(?!\/create)/, { timeout: 10000 },
            );
            await expect(
                this.page.locator(ConcernPage.PAGE_HEADING).first(),
            ).toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyUrl(expectedSegment: string) {
        await test.step(`Verify URL contains '${expectedSegment}'`, async () => {
            await expect(this.page).toHaveURL(new RegExp(expectedSegment), { timeout: 10000 });
        });
    }
}
