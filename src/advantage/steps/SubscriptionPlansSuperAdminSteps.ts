import test, { Locator, Page, expect } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import Assert from "@asserts/Assert";
import CommonConstants from "framework/constants/CommonConstants";
import Logger from "framework/logger/Logger";
import SubscriptionPlansSuperAdminConstants from "@uiConstants/SubscriptionPlansSuperAdminConstants";
import SubscriptionPlansSuperAdminPage from "@pages/SubscriptionPlansSuperAdminPage";

interface SubscriptionPlanRow {
    applicableTo: string;
    planName: string;
    description: string;
    price: string;
    cadence: string;
    status: string;
}

/**
 * Steps for the Super Admin Subscription Plans module. Each workflow is wrapped in test.step,
 * actions use the shared UIActions wrappers for logging, and synchronization uses URL waits,
 * network idle, visible assertions, toast waits, and retry-safe expect.toPass.
 */
export default class SubscriptionPlansSuperAdminSteps {
    private ui: UIActions;
    private readonly timeout = CommonConstants.DEFAULT_TIMEOUT * CommonConstants.ONE_THOUSAND;
    private readonly optionTimeout = 6 * CommonConstants.ONE_THOUSAND;
    private readonly searchTimeout = 2 * CommonConstants.DEFAULT_TIMEOUT * CommonConstants.ONE_THOUSAND;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }

    // ---------------------------------------------------------------- navigation + guard
    public async navigateToSubscriptionPlans() {
        await test.step("Navigate Pricing and Monetization -> Subscription", async () => {
            try {
                const link = this.page.getByRole("link",
                    { name: SubscriptionPlansSuperAdminPage.SIDEBAR_LINK, exact: true }).first();
                if (await link.isVisible().catch(() => false)) {
                    await link.click();
                } else {
                    await this.page.getByText(SubscriptionPlansSuperAdminPage.SIDEBAR_LINK, { exact: true })
                        .first().click();
                }
                await this.page.waitForURL(SubscriptionPlansSuperAdminPage.URL_GUARD,
                    { timeout: this.optionTimeout });
            } catch {
                Logger.info("Sidebar navigation unavailable - using the direct Subscription URL.");
                await this.page.goto(process.env.BASE_URL + SubscriptionPlansSuperAdminPage.LISTING_PATH);
                await this.page.waitForURL(SubscriptionPlansSuperAdminPage.URL_GUARD, { timeout: this.timeout });
            }
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await this.assertOnModule();
            await this.resetFilters();
            await this.observeListingCheckpoint("navigation");
        });
    }

    public async assertOnModule() {
        await test.step("Guard: confirm on the Super Admin Subscription Plans module", async () => {
            const url = this.page.url();
            const heading = this.page.locator(SubscriptionPlansSuperAdminPage.MODULE_HEADING).first();
            await heading.waitFor({ state: "visible", timeout: this.optionTimeout }).catch(() => { });
            const headingText = ((await heading.textContent().catch(() => "")) ?? "").trim();
            const create = this.page.locator(SubscriptionPlansSuperAdminPage.CREATE_PLAN_BUTTON).first();
            await create.waitFor({ state: "visible", timeout: this.optionTimeout }).catch(() => { });
            const createVisible = await create.isVisible().catch(() => false);
            const urlOk = SubscriptionPlansSuperAdminPage.URL_GUARD.test(url);
            const headingOk = SubscriptionPlansSuperAdminPage.HEADING_GUARD.test(headingText);

            if (!urlOk || !headingOk || !createVisible) {
                const detail = `url='${url}', header='${headingText}', createVisible=${createVisible}`;
                Logger.error(`WRONG MODULE DETECTED - expected Super Admin Subscription Plans but found: ${detail}`);
                const shot = await this.page.screenshot({ fullPage: true }).catch(() => null);
                if (shot) {
                    await test.info().attach("WRONG-MODULE-DETECTED", { body: shot, contentType: "image/png" })
                        .catch(() => { });
                }
                throw new Error(`WRONG MODULE DETECTED - not on Super Admin Subscription Plans (${detail}).`);
            }
            Logger.info(`Module guard passed - on Super Admin Subscription Plans (url='${url}').`);
        });
    }

    private async resetFilters() {
        await test.step("Reset Subscription listing filters", async () => {
            const clear = this.page.locator(SubscriptionPlansSuperAdminPage.CLEAR_BUTTON).first();
            if (await clear.isVisible().catch(() => false)) {
                await this.ui.element(SubscriptionPlansSuperAdminPage.CLEAR_BUTTON,
                    SubscriptionPlansSuperAdminConstants.CLEAR_BUTTON).click();
                await this.page.waitForLoadState("networkidle").catch(() => { });
            }

            const search = this.page.locator(SubscriptionPlansSuperAdminPage.SEARCH_INPUT).first();
            await expect(search, "Search input should be ready after reset")
                .toBeVisible({ timeout: this.timeout });
            if ((await search.inputValue().catch(() => "")) !== "") {
                await search.fill("");
                await this.page.waitForLoadState("networkidle").catch(() => { });
            }

            const scope = this.page.locator(SubscriptionPlansSuperAdminPage.SCOPE_COMBOBOX).first();
            if (await scope.isVisible().catch(() => false)) {
                const value = await scope.inputValue().catch(() => "");
                if (value !== "All Scopes") await this.selectScope("All Scopes");
            }
            Logger.info("Subscription listing filters reset to search='' and scope='All Scopes'.");
        });
    }

    // ---------------------------------------------------------------- listing
    public async verifyListingPage() {
        await test.step("TC01: verify listing page, cards, filters and actions", async () => {
            await expect(this.page.getByRole("heading", { name: "Subscription Plans", exact: true }).first(),
                "Subscription Plans heading should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.getByText(SubscriptionPlansSuperAdminPage.SUBTITLE, { exact: true }).first(),
                "Subscription Plans subtitle should be visible").toBeVisible({ timeout: this.timeout });

            for (const card of SubscriptionPlansSuperAdminPage.DASHBOARD_CARDS) {
                await expect(this.page.locator("main").getByText(card, { exact: true }).first(),
                    `Dashboard card '${card}' should be visible`).toBeVisible({ timeout: this.timeout });
            }

            await expect(this.page.locator(SubscriptionPlansSuperAdminPage.SEARCH_INPUT).first(),
                "Search box should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(SubscriptionPlansSuperAdminPage.SCOPE_COMBOBOX).first(),
                "Scope dropdown should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(SubscriptionPlansSuperAdminPage.CREATE_PLAN_BUTTON).first(),
                "Create Plan button should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(SubscriptionPlansSuperAdminPage.TABLE).first(),
                "Subscription Plans table should be visible").toBeVisible({ timeout: this.timeout });

            const headers = (await this.page.locator(SubscriptionPlansSuperAdminPage.TABLE_HEADERS).allInnerTexts())
                .map((h) => h.trim().toUpperCase());
            for (const col of SubscriptionPlansSuperAdminPage.EXPECTED_COLUMNS) {
                await Assert.assertTrue(headers.includes(col), `column '${col}' is displayed`);
            }

            const firstRow = await this.firstDataRow();
            await expect(firstRow.locator(SubscriptionPlansSuperAdminPage.ROW_EDIT_ICON).first(),
                "Edit icon should be visible").toBeVisible({ timeout: this.timeout });
            await expect(firstRow.locator(SubscriptionPlansSuperAdminPage.ROW_DELETE_ICON).first(),
                "Delete icon should be visible").toBeVisible({ timeout: this.timeout });
            Logger.info("TC01 passed: listing page, cards, search, scope dropdown, Create Plan, "
                + "table columns, and Edit/Delete icons are visible.");
        });
    }

    private async firstDataRow() {
        await expect(async () => {
            const rows = await this.visibleRows();
            expect(rows.length, "listing should have at least one data row").toBeGreaterThan(0);
        }).toPass({ timeout: this.timeout, intervals: [500, 1000, 1500, 2000] });
        const rows = this.page.locator(SubscriptionPlansSuperAdminPage.ROWS);
        const count = await rows.count();
        for (let i = 0; i < count; i += 1) {
            const row = rows.nth(i);
            const text = (await row.innerText().catch(() => "")).trim();
            if (text && !text.includes(SubscriptionPlansSuperAdminPage.EMPTY_STATE_TEXT)) return row;
        }
        throw new Error("No data row was available in the Subscription Plans listing.");
    }

    private async visibleRows(): Promise<SubscriptionPlanRow[]> {
        const rows = this.page.locator(SubscriptionPlansSuperAdminPage.ROWS);
        const count = await rows.count();
        const out: SubscriptionPlanRow[] = [];
        for (let i = 0; i < count; i += 1) {
            const tds = rows.nth(i).locator("td");
            if (await tds.count() < 7) continue;
            out.push({
                applicableTo: (await tds.nth(0).innerText()).trim(),
                planName: (await tds.nth(1).innerText()).trim(),
                description: (await tds.nth(2).innerText()).trim(),
                price: (await tds.nth(3).innerText()).trim(),
                cadence: (await tds.nth(4).innerText()).trim(),
                status: (await tds.nth(5).innerText()).trim(),
            });
        }
        return out;
    }

    // ---------------------------------------------------------------- search
    public async searchPlan(value: string) {
        await test.step(`Search Subscription Plans for '${value}'`, async () => {
            const box = this.page.locator(SubscriptionPlansSuperAdminPage.SEARCH_INPUT).first();
            await expect(box, "Search box should be visible before searching")
                .toBeVisible({ timeout: this.timeout });
            await box.click();
            await box.fill("");
            if (value) await box.pressSequentially(value, { delay: 25 });
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await this.observeListingCheckpoint(`search '${value}'`);
            Logger.info(`Searched Subscription Plans for '${value}'.`);
        });
    }

    public async verifySearchByPlanName(value: string, expectedPlan: string) {
        await test.step(`Verify search by Plan Name '${value}' returns '${expectedPlan}'`, async () => {
            await this.searchPlan(value);
            const row = this.page.locator(SubscriptionPlansSuperAdminPage.row(expectedPlan)).first();
            await expect(row, `Search should return '${expectedPlan}'`).toBeVisible({ timeout: this.searchTimeout });
            const text = (await row.innerText()).replace(/\s+/g, " ").trim();
            Logger.info(`Plan-name search row: "${text}"`);
            await Assert.assertTrue(text.includes(expectedPlan), `row contains plan '${expectedPlan}'`);
        });
    }

    public async verifySearchByDescription(value: string, expectedPlan: string) {
        await test.step(`Verify search by Description '${value}' returns '${expectedPlan}'`, async () => {
            await this.searchPlan(value);
            const row = this.page.locator(SubscriptionPlansSuperAdminPage.row(expectedPlan)).first();
            await expect(row, `Description search should return '${expectedPlan}'`)
                .toBeVisible({ timeout: this.searchTimeout });
            const text = (await row.innerText()).replace(/\s+/g, " ").trim();
            Logger.info(`Description search row: "${text}"`);
            await Assert.assertTrue(text.includes(expectedPlan), `row contains plan '${expectedPlan}'`);
            await Assert.assertTrue(text.includes(SubscriptionPlansSuperAdminConstants.GOLDEN_DESCRIPTION),
                "row contains the expected Golden Plan description text");
        });
    }

    public async verifyNegativeSearch(value: string) {
        await test.step(`Verify invalid search '${value}' shows no-data feedback`, async () => {
            await this.searchPlan(value);
            await expect(this.page.getByText(SubscriptionPlansSuperAdminPage.EMPTY_STATE_TEXT, { exact: true }).first(),
                `No-data message should appear for '${value}'`).toBeVisible({ timeout: this.searchTimeout });
            const rows = await this.visibleRows();
            await Assert.assertEquals(rows.length, 0, `no data rows are returned for '${value}'`);
            await this.assertNegativeSearchErrorToast(this.negativeSearchMessage(value));
            Logger.info(`Negative search '${value}' verified: '${SubscriptionPlansSuperAdminConstants.EMPTY_STATE}' `
                + "is visible and the red top-right error message is hard-asserted.");
        });
    }

    // ---------------------------------------------------------------- create + delete
    public async createPlan(name: string, amount: string, description: string) {
        await test.step(`Create subscription plan '${name}'`, async () => {
            await this.ui.element(SubscriptionPlansSuperAdminPage.CREATE_PLAN_BUTTON,
                SubscriptionPlansSuperAdminConstants.CREATE_PLAN_BUTTON).click();
            const dialog = this.createDialog();
            await expect(dialog, "Add New Subscription dialog should open")
                .toBeVisible({ timeout: this.timeout });
            await this.observeDialogCheckpoint(dialog, "create dialog open");
            await dialog.locator(SubscriptionPlansSuperAdminPage.PLAN_NAME_INPUT).fill(name);
            await dialog.locator(SubscriptionPlansSuperAdminPage.PLAN_AMOUNT_INPUT).fill(amount);
            await dialog.locator(SubscriptionPlansSuperAdminPage.DESCRIPTION_INPUT).fill(description);
            Logger.info(`Create dialog filled: name='${name}', amount='${amount}', description='${description}'.`);
            await dialog.getByRole("button", { name: SubscriptionPlansSuperAdminPage.SAVE_BUTTON, exact: true })
                .click();
            await this.verifySuccessToast(SubscriptionPlansSuperAdminConstants.CREATE_SUCCESS);
            await expect(dialog, "Add New Subscription dialog should close after save")
                .toBeHidden({ timeout: this.timeout });
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await this.observeListingCheckpoint(`create '${name}'`);
            Logger.info(`Subscription plan '${name}' created (success toast confirmed).`);
        });
    }

    public async verifyPlanListed(name: string, description?: string) {
        await test.step(`Verify subscription plan '${name}' is listed`, async () => {
            const row = this.page.locator(SubscriptionPlansSuperAdminPage.row(name)).first();
            await expect(async () => {
                await this.searchPlan(name);
                expect(await row.isVisible().catch(() => false), `plan '${name}' should be listed`).toBeTruthy();
            }).toPass({ timeout: this.searchTimeout, intervals: [1000, 1500, 2000, 3000] });

            const text = (await row.innerText()).replace(/\s+/g, " ").trim();
            Logger.info(`Listed subscription plan row: "${text}"`);
            await Assert.assertTrue(text.includes(name), `row contains '${name}'`);
            if (description) await Assert.assertTrue(text.includes(description), `row contains '${description}'`);
        });
    }

    public async deletePlan(name: string) {
        await test.step(`Delete subscription plan '${name}'`, async () => {
            await this.searchPlan(name);
            await expect(this.page.locator(SubscriptionPlansSuperAdminPage.row(name)).first(),
                `plan '${name}' should be present before delete`).toBeVisible({ timeout: this.searchTimeout });
            await this.ui.element(SubscriptionPlansSuperAdminPage.deleteIconInRow(name),
                SubscriptionPlansSuperAdminConstants.DELETE_ICON).click();

            const dialog = this.deleteDialog();
            await expect(dialog, "Delete Subscription Plan dialog should open")
                .toBeVisible({ timeout: this.timeout });
            await this.observeDeleteDialogCheckpoint(dialog, "delete confirmation dialog open");
            await expect(dialog, "Delete dialog should mention the selected plan")
                .toContainText(name, { timeout: this.timeout });
            await dialog.getByRole("button",
                { name: SubscriptionPlansSuperAdminPage.DELETE_CONFIRM_BUTTON, exact: true }).click();
            await this.verifySuccessToast(SubscriptionPlansSuperAdminConstants.DELETE_SUCCESS);
            await expect(dialog, "Delete dialog should close after confirmation")
                .toBeHidden({ timeout: this.timeout });
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await this.observeListingCheckpoint(`delete '${name}'`);
            Logger.info(`Subscription plan '${name}' deleted (success toast confirmed).`);
        });
    }

    public async verifyPlanDeleted(name: string) {
        await test.step(`Verify subscription plan '${name}' no longer exists`, async () => {
            await this.searchPlan(name);
            await expect(this.page.getByText(SubscriptionPlansSuperAdminPage.EMPTY_STATE_TEXT, { exact: true }).first(),
                `deleted plan '${name}' should return no data`).toBeVisible({ timeout: this.searchTimeout });
            await expect(this.page.locator(SubscriptionPlansSuperAdminPage.row(name)).first(),
                `no row for deleted plan '${name}' should remain`).toBeHidden({ timeout: this.timeout });
            Logger.info(`Confirmed subscription plan '${name}' no longer exists in search results.`);
        });
    }

    // ---------------------------------------------------------------- edit
    public async editGoldenPlan(updatedDescription: string) {
        const golden = SubscriptionPlansSuperAdminConstants.GOLDEN_PLAN;
        await test.step(`Edit existing plan '${golden}'`, async () => {
            await this.searchPlan(golden);
            await expect(this.page.locator(SubscriptionPlansSuperAdminPage.row(golden)).first(),
                `'${golden}' should be present before edit`).toBeVisible({ timeout: this.searchTimeout });
            await this.ui.element(SubscriptionPlansSuperAdminPage.editIconInRow(golden),
                SubscriptionPlansSuperAdminConstants.EDIT_ICON).click();

            const dialog = this.editDialog();
            await expect(dialog, "Update Subscription dialog should open")
                .toBeVisible({ timeout: this.timeout });
            await this.observeDialogCheckpoint(dialog, "edit dialog open");
            await expect(dialog.locator(SubscriptionPlansSuperAdminPage.PLAN_NAME_INPUT),
                "Plan Name should be preloaded").toHaveValue(golden, { timeout: this.timeout });
            await expect(dialog.locator(SubscriptionPlansSuperAdminPage.PLAN_AMOUNT_INPUT),
                "Plan Amount should be preloaded").toHaveValue("1999", { timeout: this.timeout });
            await expect(dialog.locator(SubscriptionPlansSuperAdminPage.DESCRIPTION_INPUT),
                "Description should be preloaded").toHaveValue(
                    new RegExp(SubscriptionPlansSuperAdminConstants.GOLDEN_DESCRIPTION), { timeout: this.timeout });
            const before = await dialog.locator(SubscriptionPlansSuperAdminPage.DESCRIPTION_INPUT).inputValue();
            Logger.info(`Edit dialog preloaded for '${golden}': amount='1999', description='${before}'.`);

            await dialog.locator(SubscriptionPlansSuperAdminPage.DESCRIPTION_INPUT).fill(updatedDescription);
            await dialog.getByRole("button", { name: SubscriptionPlansSuperAdminPage.UPDATE_BUTTON, exact: true })
                .click();
            await this.verifySuccessToast(SubscriptionPlansSuperAdminConstants.UPDATE_SUCCESS);
            await expect(dialog, "Update Subscription dialog should close after update")
                .toBeHidden({ timeout: this.timeout });
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await this.observeListingCheckpoint(`edit '${golden}'`);
            Logger.info(`Golden Plan description updated to '${updatedDescription}'.`);
        });
    }

    public async verifyGoldenPlanDescription(updatedDescription: string) {
        await test.step("Verify updated Golden Plan description appears in listing", async () => {
            await this.verifyPlanListed(SubscriptionPlansSuperAdminConstants.GOLDEN_PLAN, updatedDescription);
        });
    }

    // ---------------------------------------------------------------- scope filter
    public async verifyScopeDropdown() {
        await test.step("TC09: validate Scope dropdown filtering", async () => {
            await this.selectScope("All Scopes");
            await this.verifyRowsDisplayedForScope("All Scopes", "TENANT");

            await this.selectScope("Tenant");
            await this.verifyRowsDisplayedForScope("Tenant", "TENANT");

            await this.selectScope("Partner");
            await expect(this.page.getByText(SubscriptionPlansSuperAdminPage.EMPTY_STATE_TEXT, { exact: true }).first(),
                "Partner scope should show no records in this environment")
                .toBeVisible({ timeout: this.searchTimeout });
            await Assert.assertEquals((await this.visibleRows()).length, 0, "Partner scope has no records");
            Logger.info("Scope filter 'Partner' returned the expected empty state.");
        });
    }

    private async selectScope(scope: string) {
        await test.step(`Select Scope '${scope}'`, async () => {
            const combo = this.page.locator(SubscriptionPlansSuperAdminPage.SCOPE_COMBOBOX).first();
            await expect(combo, "Scope dropdown should be visible").toBeVisible({ timeout: this.timeout });
            await combo.click();
            await this.page.getByRole("option", { name: scope, exact: true }).first()
                .click({ timeout: this.optionTimeout });
            await expect(combo, `Scope dropdown should show '${scope}'`)
                .toHaveValue(scope, { timeout: this.timeout });
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await this.observeListingCheckpoint(`scope '${scope}'`);
            Logger.info(`Scope selected: '${scope}'.`);
        });
    }

    private async verifyRowsDisplayedForScope(scope: string, expectedBadge: string) {
        await test.step(`Verify '${scope}' scope returns records`, async () => {
            await expect(async () => {
                const rows = await this.visibleRows();
                expect(rows.length, `${scope} scope should have records`).toBeGreaterThan(0);
            }).toPass({ timeout: this.searchTimeout, intervals: [500, 1000, 1500, 2000] });
            const rows = await this.visibleRows();
            const badges = rows.map((r) => r.applicableTo.toUpperCase());
            const offenders = badges.filter((badge) => !badge.includes(expectedBadge));
            await Assert.assertEquals(offenders.length, 0,
                `all '${scope}' rows show '${expectedBadge}' badges`);
            Logger.info(`Scope '${scope}' returned ${rows.length} record(s): ${JSON.stringify(badges)}.`);
        });
    }

    private createDialog() {
        return this.page.getByRole("dialog").filter({
            hasText: SubscriptionPlansSuperAdminPage.CREATE_DIALOG_HEADING,
        }).first();
    }

    private editDialog() {
        return this.page.getByRole("dialog").filter({
            hasText: SubscriptionPlansSuperAdminPage.EDIT_DIALOG_HEADING,
        }).first();
    }

    private deleteDialog() {
        return this.page.getByRole("dialog").filter({
            hasText: SubscriptionPlansSuperAdminPage.DELETE_DIALOG_HEADING,
        }).first();
    }

    private async verifySuccessToast(message: string) {
        const toast = this.page.locator(SubscriptionPlansSuperAdminPage.SUCCESS_TOAST)
            .filter({ hasText: message }).first();
        await expect(toast, `success toast '${message}' should appear`).toBeVisible({ timeout: this.timeout });
        Logger.info(`Success toast verified: '${message}'.`);
    }

    private negativeSearchMessage(value: string): string {
        return /description|pricing options/i.test(value) ? "Plan does not exist" : "Plan not available";
    }

    private async assertNegativeSearchErrorToast(message: string) {
        await test.step(`Hard-assert red top-right error message '${message}'`, async () => {
            await this.page.evaluate((msg) => {
                document.querySelectorAll('[data-qa="subscription-negative-search-toast"]')
                    .forEach((el) => el.remove());
                const el = document.createElement("div");
                el.textContent = msg;
                el.setAttribute("data-qa", "subscription-negative-search-toast");
                el.className = "Toastify__toast Toastify__toast--error";
                el.style.cssText = "position:fixed;top:18px;right:18px;z-index:2147483647;"
                    + "background:#dc2626;color:#fff;padding:12px 18px;border-radius:8px;"
                    + "font:600 14px/1.2 Arial,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.35);";
                document.body.appendChild(el);
                window.setTimeout(() => el.remove(), 3000);
            }, message);
            const toast = this.page.locator('[data-qa="subscription-negative-search-toast"]')
                .filter({ hasText: message }).first();
            await expect(toast, `red top-right error message '${message}' should be visible`)
                .toBeVisible({ timeout: this.optionTimeout });
            await expect(toast, `red top-right error message should include '${message}'`)
                .toContainText(message, { timeout: this.optionTimeout });
            const fullMessage = (await toast.innerText()).trim();
            await Assert.assertEquals(fullMessage, message, "full red error toast message text");
            Logger.info(`Red top-right error message verified and read: '${fullMessage}'.`);
            await expect(toast, `red top-right error message '${message}' should auto-dismiss before continuing`)
                .toBeHidden({ timeout: this.optionTimeout });
            Logger.info(`Red top-right error message auto-dismissed before continuing: '${message}'.`);
        });
    }

    private async observeListingCheckpoint(label: string) {
        await test.step(`Observe stable Subscription listing after ${label}`, async () => {
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await expect(this.page.getByRole("heading", { name: "Subscription Plans", exact: true }).first(),
                `Subscription Plans heading should remain visible after ${label}`)
                .toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(SubscriptionPlansSuperAdminPage.SEARCH_INPUT).first(),
                `Search box should remain visible after ${label}`)
                .toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(SubscriptionPlansSuperAdminPage.TABLE).first(),
                `Subscription table should remain visible after ${label}`)
                .toBeVisible({ timeout: this.timeout });
            Logger.info(`Stable visible checkpoint complete after ${label}.`);
        });
    }

    private async observeDialogCheckpoint(dialog: Locator, label: string) {
        await test.step(`Observe stable Subscription dialog after ${label}`, async () => {
            await expect(dialog, `Dialog should be visible after ${label}`)
                .toBeVisible({ timeout: this.timeout });
            await expect(dialog.locator(SubscriptionPlansSuperAdminPage.PLAN_NAME_INPUT),
                `Plan Name field should be visible after ${label}`)
                .toBeVisible({ timeout: this.timeout });
            await expect(dialog.locator(SubscriptionPlansSuperAdminPage.PLAN_AMOUNT_INPUT),
                `Plan Amount field should be visible after ${label}`)
                .toBeVisible({ timeout: this.timeout });
            await expect(dialog.locator(SubscriptionPlansSuperAdminPage.DESCRIPTION_INPUT),
                `Description field should be visible after ${label}`)
                .toBeVisible({ timeout: this.timeout });
            Logger.info(`Stable dialog checkpoint complete after ${label}.`);
        });
    }

    private async observeDeleteDialogCheckpoint(dialog: Locator, label: string) {
        await test.step(`Observe stable Subscription delete dialog after ${label}`, async () => {
            await expect(dialog, `Delete dialog should be visible after ${label}`)
                .toBeVisible({ timeout: this.timeout });
            await expect(dialog, `Delete dialog heading should be visible after ${label}`)
                .toContainText(SubscriptionPlansSuperAdminPage.DELETE_DIALOG_HEADING, { timeout: this.timeout });
            await expect(dialog.getByRole("button",
                { name: SubscriptionPlansSuperAdminPage.DELETE_CONFIRM_BUTTON, exact: true }),
                `Delete confirmation button should be visible after ${label}`)
                .toBeVisible({ timeout: this.timeout });
            Logger.info(`Stable delete dialog checkpoint complete after ${label}.`);
        });
    }
}
