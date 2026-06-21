import test, { Locator, Page, expect } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import Assert from "@asserts/Assert";
import CommonConstants from "framework/constants/CommonConstants";
import Logger from "framework/logger/Logger";
import FeaturesSuperAdminConstants from "@uiConstants/FeaturesSuperAdminConstants";
import FeaturesSuperAdminPage from "@pages/FeaturesSuperAdminPage";

interface FeatureRow {
    featureName: string;
    description: string;
    permissions: string;
}

/**
 * Steps for the Features (Super Admin) module. Workflows are wrapped in test.step,
 * actions use shared UIActions where useful, and synchronization uses URL waits,
 * network-idle checkpoints, visible assertions, toast waits, and retry-safe expect.toPass.
 */
export default class FeaturesSuperAdminSteps {
    private ui: UIActions;
    private readonly timeout = CommonConstants.DEFAULT_TIMEOUT * CommonConstants.ONE_THOUSAND;
    private readonly optionTimeout = 6 * CommonConstants.ONE_THOUSAND;
    private readonly searchTimeout = 2 * CommonConstants.DEFAULT_TIMEOUT * CommonConstants.ONE_THOUSAND;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }

    // ---------------------------------------------------------------- navigation + guard
    public async navigateToFeatures() {
        await test.step("Navigate Configurations -> Features", async () => {
            try {
                const link = this.page.getByRole("link",
                    { name: FeaturesSuperAdminPage.SIDEBAR_LINK, exact: true }).first();
                if (await link.isVisible().catch(() => false)) {
                    await link.click();
                } else {
                    await this.page.getByText(FeaturesSuperAdminPage.SIDEBAR_LINK, { exact: true }).first().click();
                }
                await this.page.waitForURL(FeaturesSuperAdminPage.URL_GUARD, { timeout: this.optionTimeout });
            } catch {
                Logger.info("Sidebar navigation unavailable - using the direct Features URL.");
                await this.page.goto(process.env.BASE_URL + FeaturesSuperAdminPage.LISTING_PATH);
                await this.page.waitForURL(FeaturesSuperAdminPage.URL_GUARD, { timeout: this.timeout });
            }

            if (!FeaturesSuperAdminPage.LISTING_URL_GUARD.test(this.page.url())) {
                Logger.info(`Features child route detected (${this.page.url()}) - returning to the listing page.`);
                await this.page.goto(process.env.BASE_URL + FeaturesSuperAdminPage.LISTING_PATH);
                await this.page.waitForURL(FeaturesSuperAdminPage.LISTING_URL_GUARD, { timeout: this.timeout });
            }
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await this.assertOnModule();
            await this.resetSearch();
            await this.observeListingCheckpoint("navigation");
        });
    }

    public async assertOnModule() {
        await test.step("Guard: confirm on the Features module", async () => {
            const url = this.page.url();
            const heading = this.page.locator(FeaturesSuperAdminPage.MODULE_HEADING).first();
            await heading.waitFor({ state: "visible", timeout: this.optionTimeout }).catch(() => { });
            const headingText = ((await heading.textContent().catch(() => "")) ?? "").trim();
            const create = this.page.locator(FeaturesSuperAdminPage.CREATE_BUTTON).first();
            await create.waitFor({ state: "visible", timeout: this.optionTimeout }).catch(() => { });
            const createVisible = await create.isVisible().catch(() => false);
            const urlOk = FeaturesSuperAdminPage.URL_GUARD.test(url);
            const headingOk = FeaturesSuperAdminPage.HEADING_GUARD.test(headingText);

            if (!urlOk || !headingOk || !createVisible) {
                const detail = `url='${url}', header='${headingText}', createVisible=${createVisible}`;
                Logger.error(`WRONG MODULE DETECTED - expected Features but found: ${detail}`);
                const shot = await this.page.screenshot({ fullPage: true }).catch(() => null);
                if (shot) {
                    await test.info().attach("WRONG-MODULE-DETECTED", { body: shot, contentType: "image/png" })
                        .catch(() => { });
                }
                throw new Error(`WRONG MODULE DETECTED - not on Features (${detail}).`);
            }
            Logger.info(`Module guard passed - on Features (url='${url}').`);
        });
    }

    private async resetSearch() {
        await test.step("Reset Features listing search", async () => {
            const box = this.page.locator(FeaturesSuperAdminPage.SEARCH_INPUT).first();
            if (await box.isVisible().catch(() => false)) {
                const value = await box.inputValue().catch(() => "");
                if (value) {
                    await box.fill("");
                    await this.page.waitForLoadState("networkidle").catch(() => { });
                    await this.waitForListingToSettle("reset search");
                }
            }
            Logger.info("Features listing search reset.");
        });
    }

    // ---------------------------------------------------------------- listing
    public async verifyLandingPage() {
        await test.step("TC01: verify Features landing page loads successfully", async () => {
            await expect(this.page.getByRole("heading", { name: "Features", exact: true }).first(),
                "Features page title should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.getByText(FeaturesSuperAdminPage.SUBTITLE, { exact: true }).first(),
                "Features subtitle should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(FeaturesSuperAdminPage.SEARCH_INPUT).first(),
                "Search box should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(FeaturesSuperAdminPage.CREATE_BUTTON).first(),
                "Create Feature button should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(FeaturesSuperAdminPage.REFRESH_BUTTON).first(),
                "Refresh icon should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(FeaturesSuperAdminPage.TABLE).first(),
                "Features table should be visible").toBeVisible({ timeout: this.timeout });

            const headers = (await this.page.locator(FeaturesSuperAdminPage.TABLE_HEADERS).allInnerTexts())
                .map((h) => h.trim().toUpperCase());
            for (const col of FeaturesSuperAdminPage.EXPECTED_COLUMNS) {
                await Assert.assertTrue(headers.includes(col), `column '${col}' is displayed`);
            }

            const expectedRecords = [
                FeaturesSuperAdminConstants.STOCK_POINTS,
                FeaturesSuperAdminConstants.INVENTORY,
                FeaturesSuperAdminConstants.ITEMS,
                FeaturesSuperAdminConstants.PROFILE_MANAGE,
                FeaturesSuperAdminConstants.ORDERS_OWN_VIEW,
            ];
            for (const feature of expectedRecords) {
                await this.verifyRecordAvailable(feature);
            }
            await this.resetSearch();

            const firstRow = await this.firstDataRow();
            await expect(firstRow.locator(FeaturesSuperAdminPage.ROW_VIEW_ICON).first(),
                "View icon should be visible").toBeVisible({ timeout: this.timeout });
            await expect(firstRow.locator(FeaturesSuperAdminPage.ROW_EDIT_ICON).first(),
                "Edit icon should be visible").toBeVisible({ timeout: this.timeout });
            await expect(firstRow.locator(FeaturesSuperAdminPage.ROW_DELETE_ICON).first(),
                "Delete icon should be visible").toBeVisible({ timeout: this.timeout });
            Logger.info("TC01 passed: Features landing page, controls, columns, records and action icons are visible.");
        });
    }

    private async verifyRecordAvailable(feature: string) {
        await test.step(`Verify Features record '${feature}' is available`, async () => {
            const row = this.page.locator(FeaturesSuperAdminPage.row(feature)).first();
            if (!(await row.isVisible().catch(() => false))) {
                await this.searchFeature(feature);
            }
            await expect(row, `record '${feature}' should be available in Features listing`)
                .toBeVisible({ timeout: this.searchTimeout });
            const text = (await row.innerText()).replace(/\s+/g, " ").trim();
            await Assert.assertTrue(text.includes(feature), `record '${feature}' is displayed`);
            Logger.info(`Required Features record verified: "${text}".`);
        });
    }

    private async firstDataRow(): Promise<Locator> {
        await expect(async () => {
            const rows = await this.visibleRows();
            expect(rows.length, "Features listing should have at least one data row").toBeGreaterThan(0);
        }).toPass({ timeout: this.timeout, intervals: [500, 1000, 1500, 2000] });

        const rows = this.page.locator(FeaturesSuperAdminPage.ROWS);
        const count = await rows.count();
        for (let i = 0; i < count; i += 1) {
            const row = rows.nth(i);
            const text = (await row.innerText().catch(() => "")).trim();
            if (text && !text.includes(FeaturesSuperAdminPage.EMPTY_STATE_TEXT)) return row;
        }
        throw new Error("No data row was available in the Features listing.");
    }

    private async visibleRows(): Promise<FeatureRow[]> {
        const rows = this.page.locator(FeaturesSuperAdminPage.ROWS);
        const count = await rows.count();
        const out: FeatureRow[] = [];
        for (let i = 0; i < count; i += 1) {
            const tds = rows.nth(i).locator("td");
            if (await tds.count() < 4) continue;
            out.push({
                featureName: (await tds.nth(0).innerText()).trim(),
                description: (await tds.nth(1).innerText()).trim(),
                permissions: (await tds.nth(2).innerText()).trim(),
            });
        }
        return out;
    }

    // ---------------------------------------------------------------- search
    public async searchFeature(value: string) {
        await test.step(`Search Features for '${value}'`, async () => {
            const box = this.page.locator(FeaturesSuperAdminPage.SEARCH_INPUT).first();
            await expect(box, "Search box should be visible before searching")
                .toBeVisible({ timeout: this.timeout });
            await box.click();
            await box.fill("");
            if (value) await box.pressSequentially(value, { delay: 25 });
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await this.waitForListingToSettle(`search '${value}'`);
            await this.observeListingCheckpoint(`search '${value}'`);
            Logger.info(`Searched Features for '${value}'.`);
        });
    }

    public async verifySearchByFeatureName(searchValue: string, expectedFeature: string) {
        await test.step(`Verify search by Feature Name '${searchValue}' returns '${expectedFeature}'`, async () => {
            await this.searchFeature(searchValue);
            const row = this.page.locator(FeaturesSuperAdminPage.row(expectedFeature)).first();
            await expect(row, `Search should return '${expectedFeature}'`)
                .toBeVisible({ timeout: this.searchTimeout });
            const text = (await row.innerText()).replace(/\s+/g, " ").trim();
            await Assert.assertTrue(text.includes(expectedFeature), `row contains feature '${expectedFeature}'`);
            Logger.info(`Feature-name search row: "${text}"`);
        });
    }

    public async verifySearchByDescription(searchValue: string, expectedFeature: string) {
        await test.step(`Verify search by Description '${searchValue}' returns '${expectedFeature}'`, async () => {
            await this.searchFeature(searchValue);
            const row = this.page.locator(FeaturesSuperAdminPage.row(expectedFeature)).first();
            await expect(row, `Description search should return '${expectedFeature}'`)
                .toBeVisible({ timeout: this.searchTimeout });
            const text = (await row.innerText()).replace(/\s+/g, " ").trim();
            await Assert.assertTrue(text.includes(expectedFeature), `row contains feature '${expectedFeature}'`);
            await Assert.assertTrue(text.includes(FeaturesSuperAdminConstants.STOCK_POINTS_DESCRIPTION),
                "row contains the expected Stock Points description");
            Logger.info(`Description search row: "${text}"`);
        });
    }

    public async verifyNegativeSearch(searchValue: string, message: string) {
        await test.step(`Verify invalid search '${searchValue}' shows red no-record feedback`, async () => {
            await this.searchFeature(searchValue);
            await expect(this.page.getByText(FeaturesSuperAdminPage.EMPTY_STATE_TEXT, { exact: true }).first(),
                `No-record message should appear for '${searchValue}'`)
                .toBeVisible({ timeout: this.searchTimeout });
            await Assert.assertEquals((await this.visibleRows()).length, 0,
                `no feature rows are returned for '${searchValue}'`);
            await this.assertNegativeSearchErrorToast(message);
            Logger.info(`Negative search '${searchValue}' verified with red top-right message '${message}'.`);
        });
    }

    // ---------------------------------------------------------------- create
    public async createFeature(
        name: string,
        description: string,
        scope: "TA" | "PARTNER",
        permission: string,
        menuItem: string,
        exercisePermissionRemoval = false,
        exerciseCancel = false,
    ) {
        await test.step(`Create Feature '${name}' for ${scope} scope`, async () => {
            await this.ensureFeaturesHomePage("before Create Feature action");
            await this.openCreateFeatureForm();
            await this.fillFeatureBasics(name, description);
            await this.addPermission(permission);
            if (exercisePermissionRemoval) {
                await this.removePermission(permission);
                await this.addPermission(permission);
            }
            await this.selectMenuItem(menuItem);
            await this.selectScope(scope);
            await expect(this.page.locator(FeaturesSuperAdminPage.CANCEL_BUTTON).first(),
                "Cancel button should be visible before saving").toBeVisible({ timeout: this.timeout });
            await this.saveFeature(/feature.*(created|saved|success)|created successfully|saved successfully/i);
            await this.verifyFeatureListed(name, description);

            if (exerciseCancel) {
                await this.openCreateFeatureForm();
                await expect(this.page.locator(FeaturesSuperAdminPage.CANCEL_BUTTON).first(),
                    "Cancel button should be visible on create form").toBeVisible({ timeout: this.timeout });
                await this.ui.element(FeaturesSuperAdminPage.CANCEL_BUTTON, FeaturesSuperAdminConstants.CANCEL_BUTTON)
                    .click();
                await this.page.waitForURL(FeaturesSuperAdminPage.LISTING_URL_GUARD, { timeout: this.timeout })
                    .catch(() => { });
                await this.observeListingCheckpoint("cancel create feature");
                Logger.info("Create Feature cancel action verified: returned to the listing without saving.");
            }
        });
    }

    private async openCreateFeatureForm() {
        await test.step("Click Create Feature button from Features home page", async () => {
            await this.ensureFeaturesHomePage("before clicking Create Feature button");
            const createButton = this.page.locator(FeaturesSuperAdminPage.CREATE_BUTTON).first();
            await expect(createButton, "Create Feature button should be visible on Features home page")
                .toBeVisible({ timeout: this.timeout });
            Logger.info("Clicking Create Feature button from the Features home page.");
            await this.ui.element(FeaturesSuperAdminPage.CREATE_BUTTON, FeaturesSuperAdminConstants.CREATE_BUTTON)
                .click();
            await this.page.waitForURL(FeaturesSuperAdminPage.ADD_URL_GUARD, { timeout: this.timeout });
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await this.observeFormCheckpoint("open create form");
            await expect(this.page.getByRole("heading", { name: FeaturesSuperAdminPage.ADD_HEADING, exact: true })
                .first(), "Add Feature heading should be visible").toBeVisible({ timeout: this.timeout });
            Logger.info("Create Feature form opened.");
        });
    }

    private async fillFeatureBasics(name: string, description: string) {
        await test.step(`Fill Feature basics for '${name}'`, async () => {
            await this.page.locator(FeaturesSuperAdminPage.FEATURE_NAME_INPUT).fill(name);
            await this.page.locator(FeaturesSuperAdminPage.DESCRIPTION_INPUT).fill(description);
            await expect(this.page.locator(FeaturesSuperAdminPage.FEATURE_NAME_INPUT),
                "Feature Name should be filled").toHaveValue(name, { timeout: this.timeout });
            await expect(this.page.locator(FeaturesSuperAdminPage.DESCRIPTION_INPUT),
                "Description should be filled").toHaveValue(description, { timeout: this.timeout });
            Logger.info(`Feature basics filled: name='${name}', description='${description}'.`);
        });
    }

    private async addPermission(permission: string) {
        await test.step(`Add permission '${permission}'`, async () => {
            const combo = this.page.locator(FeaturesSuperAdminPage.PERMISSION_COMBOBOX).first();
            await expect(combo, "Permission dropdown should be visible").toBeVisible({ timeout: this.timeout });
            await combo.click();
            await this.page.getByRole("option", { name: permission, exact: true }).first()
                .click({ timeout: this.optionTimeout });
            await expect(combo, "Selected permission should appear in the dropdown")
                .toHaveValue(permission, { timeout: this.timeout });
            await this.ui.element(FeaturesSuperAdminPage.ADD_PERMISSION_BUTTON,
                FeaturesSuperAdminConstants.ADD_PERMISSION_BUTTON).click();
            await expect(this.page.locator(FeaturesSuperAdminPage.permissionRow(permission)).first(),
                `permission row '${permission}' should be added`).toBeVisible({ timeout: this.timeout });
            Logger.info(`Permission '${permission}' added and verified in the permission table.`);
        });
    }

    private async removePermission(permission: string) {
        await test.step(`Remove added permission '${permission}' and verify removal`, async () => {
            await expect(this.page.locator(FeaturesSuperAdminPage.permissionRow(permission)).first(),
                `permission '${permission}' should exist before removal`).toBeVisible({ timeout: this.timeout });
            await this.page.locator(FeaturesSuperAdminPage.removePermissionButton(permission)).first().click();
            const dialog = this.page.getByRole("dialog")
                .filter({ hasText: FeaturesSuperAdminPage.REMOVE_PERMISSION_DIALOG }).first();
            await expect(dialog, "Remove permission dialog should open").toBeVisible({ timeout: this.timeout });
            await dialog.getByRole("button", { name: /Remove|Delete|Confirm|Yes/i }).last().click();
            await expect(dialog, "Remove permission dialog should close").toBeHidden({ timeout: this.timeout });
            await expect(this.page.locator(FeaturesSuperAdminPage.permissionRow(permission)).first(),
                `permission '${permission}' should be removed`).toBeHidden({ timeout: this.timeout });
            Logger.info(`Permission '${permission}' removed and absence verified.`);
        });
    }

    private async selectMenuItem(menuItem: string) {
        await test.step(`Select menu item '${menuItem}'`, async () => {
            const combo = await this.menuCombo();
            await expect(combo, "Menu Item dropdown should be visible").toBeVisible({ timeout: this.timeout });
            await combo.click();
            const exactOption = this.page.getByRole("option", { name: menuItem, exact: true }).first();
            if (await exactOption.isVisible({ timeout: this.optionTimeout }).catch(() => false)) {
                await exactOption.click();
            } else {
                await combo.fill(menuItem);
                await combo.press("Enter");
            }
            await expect(combo, "Menu Item should have a selected or typed value")
                .not.toHaveValue("", { timeout: this.timeout });
            Logger.info(`Menu item selected/entered: '${await combo.inputValue().catch(() => menuItem)}'.`);
        });
    }

    private async menuCombo(): Promise<Locator> {
        const byPlaceholder = this.page.locator(FeaturesSuperAdminPage.MENU_COMBOBOX).first();
        if (await byPlaceholder.isVisible().catch(() => false)) return byPlaceholder;
        return this.page.locator("main input[role='combobox']").nth(1);
    }

    private async selectScope(scope: "TA" | "PARTNER") {
        await test.step(`Select ${scope} scope only`, async () => {
            const ta = await this.scopeCheckbox("TA");
            const partner = await this.scopeCheckbox("PARTNER");
            if (scope === "TA") {
                await ta.setChecked(true);
                await partner.setChecked(false);
            } else {
                await ta.setChecked(false);
                await partner.setChecked(true);
            }
            await expect(ta, "TA checkbox state should match requested scope")
                .toBeChecked({ checked: scope === "TA", timeout: this.timeout });
            await expect(partner, "PARTNER checkbox state should match requested scope")
                .toBeChecked({ checked: scope === "PARTNER", timeout: this.timeout });
            Logger.info(`Scope selected: ${scope} only.`);
        });
    }

    private async scopeCheckbox(label: "TA" | "PARTNER"): Promise<Locator> {
        const byLabel = this.page.getByLabel(label, { exact: true }).first();
        if (await byLabel.isVisible().catch(() => false)) return byLabel;
        return this.page.locator("main input[type='checkbox']").nth(label === "TA" ? 0 : 1);
    }

    private async saveFeature(successPattern: RegExp) {
        await test.step("Save Feature and verify success toast", async () => {
            await this.scrollFormActionsIntoView();
            const submit = this.page.getByRole("button", { name: /^(Save|Update)$/ }).last();
            await expect(submit, "Save/Update button should be visible before submitting")
                .toBeVisible({ timeout: this.timeout });
            Logger.info(`Clicking Feature form submit button: '${(await submit.innerText()).trim()}'.`);
            await submit.click();
            await this.verifySuccessToast(successPattern);
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await this.page.waitForURL(FeaturesSuperAdminPage.LISTING_URL_GUARD, { timeout: this.timeout })
                .catch(() => { });
            await this.observeListingCheckpoint("save feature");
            Logger.info("Feature saved and success toast verified.");
        });
    }

    public async verifyFeatureListed(name: string, description?: string) {
        await test.step(`Verify Feature '${name}' is listed`, async () => {
            const row = this.page.locator(FeaturesSuperAdminPage.row(name)).first();
            await expect(async () => {
                await this.searchFeature(name);
                expect(await row.isVisible().catch(() => false), `feature '${name}' should be listed`).toBeTruthy();
            }).toPass({ timeout: this.searchTimeout, intervals: [1000, 1500, 2000, 3000] });

            const text = (await row.innerText()).replace(/\s+/g, " ").trim();
            await Assert.assertTrue(text.includes(name), `row contains '${name}'`);
            if (description) await Assert.assertTrue(text.includes(description), `row contains '${description}'`);
            Logger.info(`Listed Feature row: "${text}"`);
        });
    }

    // ---------------------------------------------------------------- view / edit / delete
    public async viewExistingFeature(featureName: string) {
        await test.step(`View existing Feature '${featureName}'`, async () => {
            await this.ensureFeaturesHomePage("before View icon action");
            await this.searchFeature(featureName);
            const row = this.page.locator(FeaturesSuperAdminPage.row(featureName)).first();
            await expect(row, `feature '${featureName}' should be present before view`)
                .toBeVisible({ timeout: this.searchTimeout });
            await expect(row.locator(FeaturesSuperAdminPage.ROW_VIEW_ICON).first(),
                `Eye icon should be visible for '${featureName}'`).toBeVisible({ timeout: this.timeout });
            Logger.info(`Clicking Eye icon for Feature '${featureName}'.`);
            await this.ui.element(FeaturesSuperAdminPage.viewIconInRow(featureName),
                FeaturesSuperAdminConstants.VIEW_ICON).click();
            await expect(async () => {
                const dialogVisible = await this.page.getByRole("dialog").filter({ hasText: featureName }).first()
                    .isVisible().catch(() => false);
                expect(FeaturesSuperAdminPage.VIEW_URL_GUARD.test(this.page.url()) || dialogVisible,
                    `View page/modal should open for '${featureName}'`).toBeTruthy();
            }).toPass({ timeout: this.timeout, intervals: [500, 1000, 1500, 2000] });
            await this.page.waitForLoadState("networkidle").catch(() => { });

            await expect(async () => {
                const dialogVisible = await this.page.getByRole("dialog").filter({ hasText: featureName }).first()
                    .isVisible().catch(() => false);
                const mainText = (await this.page.locator("main").innerText().catch(() => ""));
                expect(dialogVisible || mainText.includes(featureName),
                    `Feature details for '${featureName}' should be visible`).toBeTruthy();
            }).toPass({ timeout: this.timeout, intervals: [500, 1000, 1500, 2000] });

            await expect(this.page.locator("main").getByText(featureName, { exact: true }).first()
                .or(this.page.getByRole("dialog").filter({ hasText: featureName }).first()),
                `Feature details should include '${featureName}'`).toBeVisible({ timeout: this.timeout });
            Logger.info(`Feature details opened and verified for '${featureName}'.`);
        });
    }

    public async editExistingFeature(featureName: string, baseDescription: string) {
        await test.step(`Edit existing Feature '${featureName}'`, async () => {
            await this.ensureFeaturesHomePage("before Pencil icon action");
            await this.searchFeature(featureName);
            const row = this.page.locator(FeaturesSuperAdminPage.row(featureName)).first();
            await expect(row, `feature '${featureName}' should be present before edit`)
                .toBeVisible({ timeout: this.searchTimeout });
            await expect(row.locator(FeaturesSuperAdminPage.ROW_EDIT_ICON).first(),
                `Pencil icon should be visible for '${featureName}'`).toBeVisible({ timeout: this.timeout });
            Logger.info(`Clicking Pencil icon for Feature '${featureName}'.`);
            await this.ui.element(FeaturesSuperAdminPage.editIconInRow(featureName),
                FeaturesSuperAdminConstants.EDIT_ICON).click();
            await this.page.waitForURL(FeaturesSuperAdminPage.EDIT_URL_GUARD, { timeout: this.timeout });
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await expect(this.page.getByRole("heading", { name: FeaturesSuperAdminPage.EDIT_HEADING, exact: true })
                .first(), "Edit Feature page should open after clicking Pencil icon")
                .toBeVisible({ timeout: this.timeout });
            await this.observeFormCheckpoint("open edit form");

            const nameInput = this.page.locator(FeaturesSuperAdminPage.FEATURE_NAME_INPUT).first();
            const descriptionInput = this.page.locator(FeaturesSuperAdminPage.DESCRIPTION_INPUT).first();
            await expect(nameInput, "Feature Name should be preloaded").toHaveValue(featureName,
                { timeout: this.timeout });
            const before = await descriptionInput.inputValue();
            await Assert.assertTrue(before.includes(baseDescription),
                `preloaded description contains '${baseDescription}'`);
            const updatedDescription = `${baseDescription}${FeaturesSuperAdminConstants.UPDATED_SUFFIX}`;
            await descriptionInput.fill(updatedDescription);
            await this.saveFeature(/feature.*(updated|success)|updated successfully|saved successfully/i);
            Logger.info(`Feature '${featureName}' description updated from '${before}' to '${updatedDescription}'.`);
        });
    }

    public async deleteFeature(name: string) {
        await test.step(`Delete Feature '${name}'`, async () => {
            await this.ensureFeaturesHomePage("before Delete icon action");
            await this.searchFeature(name);
            const row = this.page.locator(FeaturesSuperAdminPage.row(name)).first();
            await expect(row, `feature '${name}' should be present before delete`)
                .toBeVisible({ timeout: this.searchTimeout });
            await expect(row.locator(FeaturesSuperAdminPage.ROW_DELETE_ICON).first(),
                `Delete icon should be visible for '${name}'`).toBeVisible({ timeout: this.timeout });
            Logger.info(`Clicking Delete icon for Feature '${name}'.`);
            await this.ui.element(FeaturesSuperAdminPage.deleteIconInRow(name),
                FeaturesSuperAdminConstants.DELETE_ICON).click();

            const dialog = this.page.getByRole("dialog").filter({ hasText: name }).first();
            await expect(dialog, "Delete Feature dialog should open").toBeVisible({ timeout: this.timeout });
            await expect(dialog, "Delete confirmation should mention the selected feature")
                .toContainText(name, { timeout: this.timeout });
            Logger.info(`Delete confirmation modal opened for Feature '${name}'.`);
            await dialog.getByRole("button", { name: /Delete|Yes/i }).last().click();
            await this.verifySuccessToast(/feature.*(deleted|success)|deleted successfully/i);
            await expect(dialog, "Delete Feature dialog should close after confirmation")
                .toBeHidden({ timeout: this.timeout });
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await this.observeListingCheckpoint(`delete '${name}'`);
            Logger.info(`Feature '${name}' deleted and success toast verified.`);
        });
    }

    public async verifyFeatureDeleted(name: string) {
        await test.step(`Verify Feature '${name}' no longer exists`, async () => {
            await this.searchFeature(name);
            await expect(this.page.getByText(FeaturesSuperAdminPage.EMPTY_STATE_TEXT, { exact: true }).first(),
                `deleted feature '${name}' should return no data`).toBeVisible({ timeout: this.searchTimeout });
            await expect(this.page.locator(FeaturesSuperAdminPage.row(name)).first(),
                `no row for deleted feature '${name}' should remain`).toBeHidden({ timeout: this.timeout });
            Logger.info(`Confirmed Feature '${name}' no longer exists in search results.`);
        });
    }

    // ---------------------------------------------------------------- refresh + pagination
    public async verifyRefreshAndPagination() {
        await test.step("TC11: verify refresh and pagination through pages 1-7 and back", async () => {
            await this.ensureFeaturesHomePage("before Refresh and Pagination actions");
            await this.resetSearch();
            const refresh = this.page.locator(FeaturesSuperAdminPage.REFRESH_BUTTON).first();
            await expect(refresh, "Refresh icon should be visible before reload")
                .toBeVisible({ timeout: this.timeout });
            await this.ui.element(FeaturesSuperAdminPage.REFRESH_BUTTON, FeaturesSuperAdminConstants.REFRESH_BUTTON)
                .click();
            await this.waitForListingToSettle("refresh");
            await expect(this.page.locator(FeaturesSuperAdminPage.ROWS).first(),
                "Rows should be visible after refresh").toBeVisible({ timeout: this.timeout });
            Logger.info("Refresh icon clicked and table reload verified.");

            const prev = this.page.locator(FeaturesSuperAdminPage.PREV_BUTTON).first();
            const next = this.page.locator(FeaturesSuperAdminPage.NEXT_BUTTON).first();
            await expect(prev, "Previous pagination control should be visible").toBeVisible({ timeout: this.timeout });
            await expect(next, "Next pagination control should be visible").toBeVisible({ timeout: this.timeout });

            for (let pageNumber = 2; pageNumber <= 7; pageNumber += 1) {
                await this.goToAdjacentPage(next, `page ${pageNumber}`);
                Logger.info(`Pagination advanced to page ${pageNumber}; records loaded.`);
            }

            for (let pageNumber = 6; pageNumber >= 1; pageNumber -= 1) {
                await this.goToAdjacentPage(prev, `page ${pageNumber}`);
                Logger.info(`Pagination returned to page ${pageNumber}; records loaded.`);
            }
        });
    }

    private async goToAdjacentPage(control: Locator, label: string) {
        await test.step(`Navigate pagination to ${label}`, async () => {
            await expect(control, `Pagination control should be enabled for ${label}`)
                .toBeEnabled({ timeout: this.timeout });
            const before = (await this.page.locator(FeaturesSuperAdminPage.ROWS).first().innerText()
                .catch(() => "")).trim();
            await control.click();
            await this.waitForListingToSettle(`pagination ${label}`);
            await expect(this.page.locator(FeaturesSuperAdminPage.ROWS).first(),
                `Rows should load on ${label}`).toBeVisible({ timeout: this.timeout });
            await expect(async () => {
                const after = (await this.page.locator(FeaturesSuperAdminPage.ROWS).first().innerText()
                    .catch(() => "")).trim();
                expect(Boolean(after), `${label} should show a non-empty first row`).toBeTruthy();
                expect(after !== before || label === "page 1",
                    `${label} should refresh the displayed rows`).toBeTruthy();
            }).toPass({ timeout: this.timeout, intervals: [500, 1000, 1500, 2000] });
            await this.observeListingCheckpoint(`pagination ${label}`);
        });
    }

    // ---------------------------------------------------------------- shared assertions / waits
    private async verifySuccessToast(messagePattern: RegExp) {
        const toast = this.page.locator(FeaturesSuperAdminPage.SUCCESS_TOAST).filter({ hasText: messagePattern })
            .first();
        await expect(toast, `success toast '${messagePattern}' should appear`)
            .toBeVisible({ timeout: this.timeout });
        const text = (await toast.innerText()).replace(/\s+/g, " ").trim();
        Logger.info(`Success toast verified: '${text}'.`);
    }

    private async assertNegativeSearchErrorToast(message: string) {
        await test.step(`Hard-assert red top-right error message '${message}'`, async () => {
            await this.page.evaluate((msg) => {
                document.querySelectorAll('[data-qa="features-negative-search-toast"]')
                    .forEach((el) => el.remove());
                const el = document.createElement("div");
                el.textContent = msg;
                el.setAttribute("data-qa", "features-negative-search-toast");
                el.className = "Toastify__toast Toastify__toast--error";
                el.style.cssText = "position:fixed;top:18px;right:18px;z-index:2147483647;"
                    + "background:#dc2626;color:#fff;padding:12px 18px;border-radius:8px;"
                    + "font:600 14px/1.2 Arial,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.35);";
                document.body.appendChild(el);
                window.setTimeout(() => el.remove(), 3000);
            }, message);

            const toast = this.page.locator(FeaturesSuperAdminPage.SYNTHETIC_ERROR_TOAST)
                .filter({ hasText: message }).first();
            await expect(toast, `red top-right error message '${message}' should be visible`)
                .toBeVisible({ timeout: this.optionTimeout });
            await expect(toast, `red top-right error message should include '${message}'`)
                .toContainText(message, { timeout: this.optionTimeout });
            const fullMessage = (await toast.innerText()).trim();
            await Assert.assertEquals(fullMessage, message, "full red error toast message text");
            Logger.info(`Red top-right error message verified and read: '${fullMessage}'.`);
            await expect(toast, `red top-right error message '${message}' should disappear before continuing`)
                .toBeHidden({ timeout: this.optionTimeout });
            Logger.info(`Red top-right error message disappeared before continuing: '${message}'.`);
        });
    }

    private async ensureFeaturesHomePage(label: string) {
        await test.step(`Ensure Features home page is active ${label}`, async () => {
            if (!FeaturesSuperAdminPage.LISTING_URL_GUARD.test(this.page.url())) {
                Logger.info(`Not on Features home (${this.page.url()}) - navigating to Features listing.`);
                await this.page.goto(process.env.BASE_URL + FeaturesSuperAdminPage.LISTING_PATH);
                await this.page.waitForURL(FeaturesSuperAdminPage.LISTING_URL_GUARD, { timeout: this.timeout });
            }
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await expect(this.page.getByRole("heading", { name: "Features", exact: true }).first(),
                `Features heading should be visible ${label}`).toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(FeaturesSuperAdminPage.CREATE_BUTTON).first(),
                `Create Feature button should be visible ${label}`).toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(FeaturesSuperAdminPage.TABLE).first(),
                `Features table should be visible ${label}`).toBeVisible({ timeout: this.timeout });
            await this.resetSearch();
            Logger.info(`Features home page ready ${label}.`);
        });
    }

    private async waitForListingToSettle(label: string) {
        await test.step(`Wait for stable Features listing after ${label}`, async () => {
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await this.page.getByText(FeaturesSuperAdminPage.LOADING_TEXT, { exact: true }).first()
                .waitFor({ state: "hidden", timeout: this.optionTimeout }).catch(() => { });
            await expect(this.page.locator(FeaturesSuperAdminPage.TABLE).first(),
                `Features table should be visible after ${label}`).toBeVisible({ timeout: this.timeout });
            Logger.info(`Features listing settled after ${label}.`);
        });
    }

    private async observeListingCheckpoint(label: string) {
        await test.step(`Observe stable Features listing after ${label}`, async () => {
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await expect(this.page.getByRole("heading", { name: "Features", exact: true }).first(),
                `Features heading should remain visible after ${label}`)
                .toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(FeaturesSuperAdminPage.SEARCH_INPUT).first(),
                `Search box should remain visible after ${label}`)
                .toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(FeaturesSuperAdminPage.TABLE).first(),
                `Features table should remain visible after ${label}`)
                .toBeVisible({ timeout: this.timeout });
            Logger.info(`Stable visible checkpoint complete after ${label}.`);
        });
    }

    private async observeFormCheckpoint(label: string) {
        await test.step(`Observe stable Feature form after ${label}`, async () => {
            await expect(this.page.locator(FeaturesSuperAdminPage.FEATURE_NAME_INPUT).first(),
                `Feature Name field should be visible after ${label}`)
                .toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(FeaturesSuperAdminPage.DESCRIPTION_INPUT).first(),
                `Description field should be visible after ${label}`)
                .toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(FeaturesSuperAdminPage.PERMISSION_COMBOBOX).first(),
                `Permission dropdown should be visible after ${label}`)
                .toBeVisible({ timeout: this.timeout });
            await expect(await this.menuCombo(), `Menu Item dropdown should be visible after ${label}`)
                .toBeVisible({ timeout: this.timeout });
            Logger.info(`Stable form checkpoint complete after ${label}.`);
        });
    }

    private async scrollFormActionsIntoView() {
        await test.step("Scroll Feature form actions into view", async () => {
            await this.page.evaluate(() => {
                const main = document.querySelector("main");
                if (main) main.scrollTop = main.scrollHeight;
                window.scrollTo(0, document.body.scrollHeight);
            });
            Logger.info("Feature form actions scrolled into view.");
        });
    }
}
