import test, { Page, expect } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import Assert from "@asserts/Assert";
import CommonConstants from "framework/constants/CommonConstants";
import Logger from "framework/logger/Logger";
import PermissionConstants from "@uiConstants/PermissionConstants";
import PermissionPage from "@pages/PermissionPage";

/** One listing row's data cells (Resource | Permission | Method). */
interface PermissionRow { resource: string; permission: string; method: string; }

/**
 * Steps (business workflows) for the Permission (Admin) module. All actions go through the UIActions
 * wrappers for consistent logging, every workflow is wrapped in a test.step, and synchronization uses
 * explicit waits/assertions (network idle, element visibility, retry-safe expect.toPass) — no fixed
 * sleeps. Assertions live here (never in the Page object).
 */
export default class PermissionSteps {
    private ui: UIActions;
    private readonly timeout = CommonConstants.DEFAULT_TIMEOUT * CommonConstants.ONE_THOUSAND;
    private readonly optionTimeout = 6 * CommonConstants.ONE_THOUSAND;
    // Search is debounced + server-side; allow generous headroom for an occasional slow query.
    private readonly searchTimeout = 2 * CommonConstants.DEFAULT_TIMEOUT * CommonConstants.ONE_THOUSAND;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }

    // ---------------------------------------------------------------- navigation + guard
    /** Navigate Configurations → Permission via the sidebar (exact name), with a direct-URL fallback. */
    public async navigateToPermission() {
        await test.step(`Navigate Configurations -> Permission`, async () => {
            try {
                const link = this.page.getByRole("link",
                    { name: PermissionPage.SIDEBAR_PERMISSION, exact: true }).first();
                if (await link.isVisible().catch(() => false)) {
                    await link.click();
                } else {
                    await this.page.getByText(PermissionPage.SIDEBAR_PERMISSION, { exact: true }).first().click();
                }
                await this.page.waitForURL(PermissionPage.URL_GUARD, { timeout: this.optionTimeout });
            } catch {
                Logger.info("Sidebar navigation unavailable — using the direct Permission URL.");
                await this.page.goto(process.env.BASE_URL + PermissionPage.LISTING_PATH);
                await this.page.waitForURL(PermissionPage.URL_GUARD, { timeout: this.timeout });
            }
            // Clear any leftover search filter from a prior test (shared worker page) so the listing is
            // back to its full, ready state BEFORE the module guard inspects it.
            await this.resetSearch();
            await this.assertOnPermissionModule();
        });
    }

    /**
     * MANDATORY module guard — hard-asserts we are on the Permission module (URL, "Permission" heading,
     * Create Permission button) before any action; on mismatch logs "WRONG MODULE DETECTED", attaches a
     * screenshot, and throws so automation never interacts with another module.
     */
    public async assertOnPermissionModule() {
        await test.step(`Guard: confirm on the Permission module`, async () => {
            const url = this.page.url();
            const heading = this.page.locator(PermissionPage.MODULE_HEADING).first();
            await heading.waitFor({ state: "visible", timeout: this.optionTimeout }).catch(() => { });
            const headingText = ((await heading.textContent().catch(() => "")) ?? "").trim();
            // Give the listing header a fair chance to render the Create button before deciding.
            const createLoc = this.page.locator(PermissionPage.CREATE_BUTTON).first();
            await createLoc.waitFor({ state: "visible", timeout: this.optionTimeout }).catch(() => { });
            const createVisible = await createLoc.isVisible().catch(() => false);
            const urlOk = PermissionPage.URL_GUARD.test(url);
            const headingOk = PermissionPage.HEADING_GUARD.test(headingText);
            if (!urlOk || !headingOk || !createVisible) {
                const detail = `url='${url}', header='${headingText}', createVisible=${createVisible}`;
                Logger.error(`WRONG MODULE DETECTED — expected the Permission module but found: ${detail}`);
                const shot = await this.page.screenshot({ fullPage: true }).catch(() => null);
                if (shot) {
                    await test.info().attach("WRONG-MODULE-DETECTED", { body: shot, contentType: "image/png" })
                        .catch(() => { /* best-effort */ });
                }
                throw new Error(`WRONG MODULE DETECTED — not on the Permission module (${detail}).`);
            }
            Logger.info(`Module guard passed — on Permission (url='${url}', header='${headingText}').`);
        });
    }

    // ---------------------------------------------------------------- listing validation
    /** Verify the listing page loads with search box, Create button, table, columns, pagination, icons. */
    public async verifyListingLoaded() {
        await test.step(`Verify Permission listing page and all controls`, async () => {
            await expect(this.page.getByRole("heading", { name: "Permission", exact: true }).first(),
                "Permission page heading should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(PermissionPage.SEARCH_INPUT).first(),
                "Search box should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(PermissionPage.CREATE_BUTTON).first(),
                "Create Permission button should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(PermissionPage.TABLE).first(),
                "Permission table should be visible").toBeVisible({ timeout: this.timeout });

            const headers = (await this.page.locator(PermissionPage.TABLE_HEADERS).allInnerTexts())
                .map((h) => h.trim().toUpperCase());
            for (const col of PermissionPage.EXPECTED_COLUMNS) {
                await Assert.assertTrue(headers.includes(col), `column '${col}' is displayed`);
            }
            await expect(this.page.locator(PermissionPage.NEXT_BUTTON).first(),
                "Next pagination control should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(PermissionPage.PREV_BUTTON).first(),
                "Previous pagination control should be visible").toBeVisible({ timeout: this.timeout });
            const firstRow = this.page.locator(PermissionPage.ROWS).first();
            await expect(firstRow.locator(PermissionPage.ROW_EDIT_ICON).first(),
                "Edit action icon should be visible").toBeVisible({ timeout: this.timeout });
            await expect(firstRow.locator(PermissionPage.ROW_DELETE_ICON).first(),
                "Delete action icon should be visible").toBeVisible({ timeout: this.timeout });
            Logger.info("Permission listing loaded: heading, search box, Create button, table, "
                + "RESOURCE/PERMISSION/METHOD/ACTIONS columns, pagination and per-row action icons.");
        });
    }

    /**
     * Validate pagination: Next/Previous are present, the rows change when moving to the next page, and
     * the page returns to the first page on Previous. The first page is identified by the Previous
     * control being disabled (a stable indicator, unlike first-row text which shifts as data changes).
     */
    public async verifyPagination() {
        await test.step(`Verify pagination (Previous / Next)`, async () => {
            await this.resetSearch();
            const next = this.page.locator(PermissionPage.NEXT_BUTTON).first();
            const prev = this.page.locator(PermissionPage.PREV_BUTTON).first();
            await expect(next, "Next control should be visible").toBeVisible({ timeout: this.timeout });
            await expect(prev, "Previous control should be visible").toBeVisible({ timeout: this.timeout });
            await expect(prev, "Previous should be disabled on the first page")
                .toBeDisabled({ timeout: this.timeout });
            // Ensure the first page has rendered its data rows before snapshotting.
            await expect(this.page.locator(PermissionPage.ROWS).first(),
                "first page should have rows").toBeVisible({ timeout: this.timeout });
            const firstBefore = (await this.page.locator(PermissionPage.ROWS).first().innerText()
                .catch(() => "")).trim();

            // Next → page 2: Previous becomes enabled and the rows change.
            await this.ui.element(PermissionPage.NEXT_BUTTON, PermissionConstants.NEXT_BUTTON).click();
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await expect(prev, "Previous should be enabled on page 2").toBeEnabled({ timeout: this.timeout });
            await expect(async () => {
                const firstAfter = (await this.page.locator(PermissionPage.ROWS).first().innerText()
                    .catch(() => "")).trim();
                expect(Boolean(firstAfter) && firstAfter !== firstBefore, "next page rows differ").toBeTruthy();
            }).toPass({ timeout: this.timeout, intervals: [300, 500, 1000, 1500] });
            Logger.info("Pagination: advanced to the next page (Previous enabled, rows changed).");

            // Previous → back to page 1: Previous becomes disabled again.
            await this.ui.element(PermissionPage.PREV_BUTTON, PermissionConstants.PREV_BUTTON).click();
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await expect(prev, "Previous should be disabled again back on the first page")
                .toBeDisabled({ timeout: this.timeout });
            Logger.info("Pagination: returned to the first page (Previous/Next both work).");
        });
    }

    // ---------------------------------------------------------------- search
    /**
     * Type a value into the listing search box and wait (network idle) for the grid to update. Uses
     * pressSequentially (per-character input events) which reliably fires the app's debounced server
     * search — a single fill() can occasionally be missed by the React handler during a re-render.
     */
    public async searchPermission(value: string) {
        await test.step(`Search permissions for '${value}'`, async () => {
            const box = this.page.locator(PermissionPage.SEARCH_INPUT).first();
            await box.click();
            await box.fill("");
            await box.pressSequentially(value, { delay: 25 });
            await this.page.waitForLoadState("networkidle").catch(() => { /* SPA keep-alive */ });
            Logger.info(`Searched permissions for '${value}'`);
        });
    }

    /**
     * Search by `searchValue`, wait for the row that contains `permissionName` to render, then read and
     * return its Resource | Permission | Method cells. The generous searchTimeout absorbs an occasional
     * slow server query without any fixed sleep.
     */
    private async findRow(searchValue: string, permissionName: string): Promise<PermissionRow> {
        await this.searchPermission(searchValue);
        const rowLoc = this.page.locator(PermissionPage.row(permissionName)).first();
        await expect(rowLoc, `a row for '${permissionName}' should be returned`)
            .toBeVisible({ timeout: this.searchTimeout });
        const tds = rowLoc.locator("td");
        return {
            resource: (await tds.nth(0).innerText()).trim(),
            permission: (await tds.nth(1).innerText()).trim(),
            method: (await tds.nth(2).innerText()).trim(),
        };
    }

    private async resetSearch() {
        const box = this.page.locator(PermissionPage.SEARCH_INPUT).first();
        if (await box.isVisible().catch(() => false)) {
            const value = await box.inputValue().catch(() => "");
            if (value) {
                await box.fill("");
                await this.page.waitForLoadState("networkidle").catch(() => { });
            }
        }
    }

    /** Read the data rows currently shown in the listing (skips the empty-state row). */
    private async resultRows(): Promise<PermissionRow[]> {
        const rows = this.page.locator(PermissionPage.ROWS);
        const count = await rows.count();
        const out: PermissionRow[] = [];
        for (let i = 0; i < count; i += 1) {
            const tds = rows.nth(i).locator("td");
            if (await tds.count() < 3) continue; // the "No permissions found" empty-state row
            out.push({
                resource: (await tds.nth(0).innerText()).trim(),
                permission: (await tds.nth(1).innerText()).trim(),
                method: (await tds.nth(2).innerText()).trim(),
            });
        }
        return out;
    }

    /**
     * Positive search: search by the row's designated field (Permission Name OR Resource URL), then
     * hard-assert the returned record's Permission Name, Method and Resource URL all match.
     */
    public async verifyPositiveSearch(data) {
        await test.step(`${data.TC_ID}: search '${data.Permission_Name}' by ${data.Search_By} and verify`,
            async () => {
                const match = await this.findRow(data.Search_Value, data.Permission_Name);
                Logger.info(`${data.TC_ID} matched (searched by ${data.Search_By} = '${data.Search_Value}'): `
                    + `permission='${match.permission}', method='${match.method}', resource='${match.resource}'`);
                await Assert.assertEquals(match.permission, data.Permission_Name, "Permission Name matches");
                await Assert.assertEquals(match.method, data.Method, "Method matches");
                await Assert.assertEquals(match.resource, data.Resource_URL, "Resource URL matches");
            });
    }

    /**
     * Negative search: search an invalid value and hard-assert NO record is returned ("No permissions
     * found"). A red "FAILED" banner is flashed at the top-right during the run (visual marker for the
     * negative case, as required) — the pass/fail is decided by the empty-state assertion, not the banner.
     */
    public async verifyNegativeSearch(data) {
        await test.step(`${data.TC_ID}: invalid search '${data.Search_Value}' returns no record`, async () => {
            await this.searchPermission(data.Search_Value);
            await expect(this.page.getByText(PermissionPage.EMPTY_STATE_TEXT).first(),
                `'${PermissionPage.EMPTY_STATE_TEXT}' should appear for invalid '${data.Search_Value}'`)
                .toBeVisible({ timeout: this.searchTimeout });
            const match = (await this.resultRows()).find((r) => r.permission === data.Search_Value);
            await Assert.assertTrue(!match, `no permission row matches the invalid value '${data.Search_Value}'`);
            await this.flashNegativeFailure(`FAILED ❌ No record found: ${data.Search_Value}`);
            Logger.info(`${data.TC_ID} negative verified — no record for '${data.Search_Value}'.`);
        });
    }

    /** Flash a red "FAILED" banner at the top-right (visual marker for negative cases during execution). */
    private async flashNegativeFailure(message: string) {
        await this.page.evaluate((msg) => {
            const el = document.createElement("div");
            el.textContent = msg;
            el.setAttribute("data-qa", "negative-failed-banner");
            el.style.cssText = "position:fixed;top:18px;right:18px;z-index:2147483647;background:#dc2626;"
                + "color:#fff;padding:12px 18px;border-radius:8px;font:600 14px/1.2 Arial,sans-serif;"
                + "box-shadow:0 6px 18px rgba(0,0,0,.35)";
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 2500);
        }, message).catch(() => { });
        try {
            await expect(this.page.locator('[data-qa="negative-failed-banner"]').first(),
                "red FAILED banner should be shown for the negative case")
                .toBeVisible({ timeout: this.optionTimeout });
        } catch { /* the banner is a visual marker only — never fail the test on it */ }
    }

    // ---------------------------------------------------------------- create + delete
    /** Open the Create Permission dialog, fill the fields, save, and verify the success toast. */
    public async createPermission(name: string, method: string, url: string) {
        await test.step(`Create permission '${name}' (${method}, ${url})`, async () => {
            await this.ui.element(PermissionPage.CREATE_BUTTON, PermissionConstants.CREATE_BUTTON).click();
            const dialog = this.page.getByRole("dialog", { name: PermissionPage.CREATE_DIALOG_NAME });
            await expect(dialog, "Create Permission dialog should open").toBeVisible({ timeout: this.timeout });

            await dialog.locator(PermissionPage.NAME_INPUT).fill(name);
            await dialog.locator(PermissionPage.METHOD_COMBOBOX).click();
            await this.page.getByRole("option", { name: method, exact: true }).first()
                .click({ timeout: this.optionTimeout });
            await dialog.locator(PermissionPage.URL_INPUT).fill(url);
            await dialog.getByRole("button", { name: PermissionPage.SAVE_BUTTON, exact: true }).click();

            await expect(this.page.getByText(new RegExp(PermissionConstants.CREATE_SUCCESS, "i")).first(),
                "a 'created successfully' toast should appear").toBeVisible({ timeout: this.timeout });
            await expect(dialog, "the dialog should close after a successful create")
                .toBeHidden({ timeout: this.timeout });
            Logger.info(`Permission '${name}' created (success toast confirmed).`);
        });
    }

    /** Verify a created permission appears in the listing with the expected Method and Resource URL. */
    public async verifyPermissionInListing(name: string, method: string, url: string) {
        await test.step(`Verify created permission '${name}' is listed`, async () => {
            // A new record shows at the top of the (newest-first) unfiltered listing, while the search
            // index can lag — so verify against the refreshed listing. Reload ONCE per attempt and only
            // when it is enabled (clicking it mid-load restarts the fetch and keeps the grid in a
            // "Loading..." state), then wait for the load to finish before checking the row.
            const rowLoc = this.page.locator(PermissionPage.row(name)).first();
            await this.resetSearch();
            await expect(async () => {
                const reload = this.page.getByRole("button", { name: "Reload" }).first();
                if (await reload.isEnabled().catch(() => false)) {
                    await reload.click().catch(() => { });
                    await this.page.waitForLoadState("networkidle").catch(() => { });
                    await this.page.getByText("Loading...").first()
                        .waitFor({ state: "hidden", timeout: this.optionTimeout }).catch(() => { });
                }
                expect(await rowLoc.isVisible().catch(() => false),
                    `created permission '${name}' should appear in the listing`).toBeTruthy();
            }).toPass({ timeout: this.timeout, intervals: [2000, 3000, 3000, 4000] });

            const tds = rowLoc.locator("td");
            const resource = (await tds.nth(0).innerText()).trim();
            const permission = (await tds.nth(1).innerText()).trim();
            const rowMethod = (await tds.nth(2).innerText()).trim();
            await Assert.assertEquals(permission, name, "created permission Name matches");
            await Assert.assertEquals(rowMethod, method, "created permission Method matches");
            await Assert.assertEquals(resource, url, "created permission Resource URL matches");
            Logger.info(`Created permission '${name}' verified in the listing (Method='${rowMethod}', `
                + `Resource='${resource}').`);
        });
    }

    /** Delete the given permission via its row Delete icon, confirm, and verify the success toast. */
    public async deletePermission(name: string) {
        await test.step(`Delete permission '${name}'`, async () => {
            await this.searchPermission(name);
            await expect(this.page.locator(PermissionPage.row(name)).first(),
                `row for '${name}' should be present before delete`).toBeVisible({ timeout: this.searchTimeout });
            await this.ui.element(PermissionPage.deleteIconInRow(name), PermissionConstants.DELETE_ICON).click();

            const dialog = this.page.getByRole("dialog");
            await expect(dialog.first(), "delete confirmation dialog should appear")
                .toBeVisible({ timeout: this.timeout });
            await dialog.getByRole("button", { name: PermissionPage.DELETE_CONFIRM_BUTTON, exact: true })
                .first().click();

            await expect(this.page.getByText(new RegExp(PermissionConstants.DELETE_SUCCESS, "i")).first(),
                "a 'deleted successfully' toast should appear").toBeVisible({ timeout: this.timeout });
            Logger.info(`Permission '${name}' deleted (success toast confirmed).`);
        });
    }

    /** Verify a deleted permission no longer appears in search results. */
    public async verifyPermissionDeleted(name: string) {
        await test.step(`Verify deleted permission '${name}' is gone`, async () => {
            await this.searchPermission(name);
            await expect(this.page.getByText(PermissionPage.EMPTY_STATE_TEXT).first(),
                `'${name}' should be gone (No permissions found)`).toBeVisible({ timeout: this.searchTimeout });
            await expect(this.page.locator(PermissionPage.row(name)).first(),
                `no row for deleted '${name}' should remain`).toBeHidden({ timeout: this.timeout });
            Logger.info(`Confirmed '${name}' no longer exists in search results.`);
        });
    }

    // ---------------------------------------------------------------- edit (TC13)
    /** The Edit Permission dialog (no aria-label; identified by its "Edit Permission" heading). */
    private editDialog() {
        return this.page.getByRole("dialog").filter({ hasText: PermissionPage.EDIT_DIALOG_HEADING }).first();
    }

    /**
     * Refresh the listing (Reload once, only when enabled) until the row for `name` renders, then return
     * its locator. A just-created/updated record shows immediately at the top of the newest-first,
     * DB-backed listing — whereas the search index lags — so this is the reliable way to locate it.
     */
    private async ensureRowInListing(name: string) {
        const rowLoc = this.page.locator(PermissionPage.row(name)).first();
        await this.resetSearch();
        await expect(async () => {
            const reload = this.page.getByRole("button", { name: "Reload" }).first();
            if (await reload.isEnabled().catch(() => false)) {
                await reload.click().catch(() => { });
                await this.page.waitForLoadState("networkidle").catch(() => { });
                await this.page.getByText(PermissionPage.LOADING_TEXT).first()
                    .waitFor({ state: "hidden", timeout: this.optionTimeout }).catch(() => { });
            }
            expect(await rowLoc.isVisible().catch(() => false), `row '${name}' should be listed`).toBeTruthy();
        }).toPass({ timeout: this.timeout, intervals: [2000, 3000, 3000, 4000] });
        return rowLoc;
    }

    /** TC13: open the Edit modal for `name` (located via the listing) and wait for it to be visible. */
    public async openEditModal(name: string) {
        await test.step(`Open the Edit modal for '${name}'`, async () => {
            await this.ensureRowInListing(name);
            await this.ui.element(PermissionPage.editIconInRow(name), PermissionConstants.EDIT_ICON).click();
            await expect(this.editDialog(), "Edit Permission modal should open")
                .toBeVisible({ timeout: this.timeout });
            Logger.info(`Edit modal opened for '${name}'.`);
        });
    }

    /** TC13: hard-assert the Edit modal is fully preloaded (Permission Name, Method, Resource URL). */
    public async verifyEditModalPreloaded(name: string, method: string, url: string) {
        await test.step(`Verify Edit modal is preloaded for '${name}'`, async () => {
            const dialog = this.editDialog();
            await expect(dialog, "Edit modal should be visible before reading fields")
                .toBeVisible({ timeout: this.timeout });
            await expect(dialog.locator(PermissionPage.NAME_INPUT),
                "Permission Name should be preloaded").toHaveValue(name, { timeout: this.timeout });
            await expect(dialog.locator(PermissionPage.METHOD_COMBOBOX),
                "Method should be preloaded").toHaveValue(method, { timeout: this.timeout });
            await expect(dialog.locator(PermissionPage.URL_INPUT),
                "Resource URL should be preloaded").toHaveValue(url, { timeout: this.timeout });
            Logger.info(`Edit modal preloaded: Name='${name}', Method='${method}', Resource='${url}'.`);
        });
    }

    /**
     * TC13: update Permission Name and Resource URL (Method unchanged), submit, and wait for the
     * success toast, the modal to close, and the listing fetch to settle (network idle).
     */
    public async updatePermissionTo(newName: string, newUrl: string) {
        await test.step(`Update permission to '${newName}' (${newUrl})`, async () => {
            const dialog = this.editDialog();
            await dialog.locator(PermissionPage.NAME_INPUT).fill(newName);
            await dialog.locator(PermissionPage.URL_INPUT).fill(newUrl);
            await dialog.getByRole("button", { name: PermissionPage.UPDATE_BUTTON, exact: true }).click();
            await expect(this.page.getByText(new RegExp(PermissionConstants.UPDATE_SUCCESS, "i")).first(),
                "an 'updated successfully' toast should appear").toBeVisible({ timeout: this.timeout });
            await expect(dialog, "the modal should close after a successful update")
                .toBeHidden({ timeout: this.timeout });
            await this.page.waitForLoadState("networkidle").catch(() => { /* SPA keep-alive */ });
            Logger.info(`Permission updated to '${newName}' (success toast + modal close confirmed).`);
        });
    }

    /**
     * TC13: search by the updated Permission Name and hard-assert the updated Name, Method and Resource
     * URL are shown in the grid; then clear and re-search to confirm the change persisted. Re-issues the
     * search until the row appears (absorbs the search-index lag after an update) — no fixed sleeps.
     */
    public async verifyUpdatedInGrid(newName: string, method: string, newUrl: string) {
        await test.step(`Search '${newName}' and verify the updated values persist`, async () => {
            const rowLoc = this.page.locator(PermissionPage.row(newName)).first();
            await expect(async () => {
                await this.searchPermission(newName);
                expect(await rowLoc.isVisible().catch(() => false),
                    `updated row '${newName}' should be returned`).toBeTruthy();
            }).toPass({ timeout: this.searchTimeout, intervals: [1500, 2000, 2500, 3000, 3000] });

            const tds = rowLoc.locator("td");
            await Assert.assertEquals((await tds.nth(1).innerText()).trim(), newName,
                "updated Permission Name is shown in the grid");
            await Assert.assertEquals((await tds.nth(2).innerText()).trim(), method,
                "Method is unchanged in the grid");
            await Assert.assertEquals((await tds.nth(0).innerText()).trim(), newUrl,
                "updated Resource URL is shown in the grid");
            Logger.info(`Updated record verified in grid: Name='${newName}', Method='${method}', `
                + `Resource='${newUrl}'.`);

            // Persistence: clear the search and re-search for the updated name.
            await this.resetSearch();
            await expect(async () => {
                await this.searchPermission(newName);
                expect(await rowLoc.isVisible().catch(() => false),
                    `updated row '${newName}' should still be found on re-search`).toBeTruthy();
            }).toPass({ timeout: this.searchTimeout, intervals: [1500, 2000, 2500, 3000, 3000] });
            await expect(rowLoc, "updated permission should persist on re-search")
                .toContainText(newName, { timeout: this.timeout });
            Logger.info(`Persistence confirmed: '${newName}' still present after clear + re-search.`);
        });
    }
}
