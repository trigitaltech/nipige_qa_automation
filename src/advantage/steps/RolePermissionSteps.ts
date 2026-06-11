import test, { Page, expect } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import RolePermissionPage from "@pages/RolePermissionPage";
import DeleteResourcePopup from "@pages/DeleteResourcePopup";
import RoleManagementConstants from "@uiConstants/RoleManagementConstants";

export default class RolePermissionSteps {
    private ui: UIActions;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }

    // ── Page verification ─────────────────────────────────────────────────────

    public async verifyPermissionPageVisible() {
        await test.step(`Verify ${RoleManagementConstants.PERMISSION_PAGE} is displayed`, async () => {
            const heading = this.page.locator(RolePermissionPage.PAGE_HEADING).first();
            await expect(heading,
                "Role Permission page heading should be visible")
                .toBeVisible({ timeout: 15_000 });
        });
    }

    // ── Permission assignment ─────────────────────────────────────────────────

    public async selectPermission(permissionName?: string) {
        await test.step(`Select permission${permissionName ? ` '${permissionName}'` : " (first available)"}`, async () => {
            const dropdown = this.page.locator(RolePermissionPage.PERMISSION_DROPDOWN).first();
            await dropdown.waitFor({ state: "visible", timeout: 10_000 });

            // 1. Wait for network requests to settle so the assigned permissions list is fully loaded
            await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
            await this.page.waitForTimeout(1000); // safety buffer

            // 2. Get all assigned permissions text BEFORE opening the dropdown, traversing all pagination pages
            let assignedText = "";
            let hasNext = true;
            let pageNum = 1;
            while (hasNext && pageNum <= 10) {
                const pageText = await this.page.locator('div:has(h2:has-text("Assigned Permissions"))').first().innerText().catch(() => "");
                assignedText += " " + pageText;
                
                const nextBtn = this.page.locator('button:has-text("Next"), a:has-text("Next")').first();
                if (await nextBtn.isVisible().catch(() => false)) {
                    const isDisabled = await nextBtn.isDisabled().catch(() => false);
                    const classAttr = await nextBtn.getAttribute("class").catch(() => "") ?? "";
                    const ariaDisabled = await nextBtn.getAttribute("aria-disabled").catch(() => "") ?? "";
                    if (isDisabled || classAttr.includes("disabled") || ariaDisabled === "true") {
                        hasNext = false;
                    } else {
                        await nextBtn.click();
                        await this.page.waitForTimeout(500);
                        pageNum++;
                    }
                } else {
                    hasNext = false;
                }
            }
            // Navigate back to page 1
            if (pageNum > 1) {
                const firstPageBtn = this.page.locator('button:text-is("1"), a:text-is("1")').first();
                if (await firstPageBtn.isVisible().catch(() => false)) {
                    await firstPageBtn.click();
                    await this.page.waitForTimeout(500);
                }
            }
            console.log(`[selectPermission] Assigned permissions (all pages): "${assignedText.replace(/\n/g, ' ')}"`);

            const tagName = await dropdown.evaluate((el) => el.tagName.toLowerCase());
            if (tagName === "select") {
                // Native <select> — use selectOption
                if (permissionName) {
                    await (dropdown as ReturnType<Page["locator"]>).selectOption({ label: permissionName });
                } else {
                    const options = await dropdown.locator("option").all();
                    const startIndex = Math.floor(options.length / 2) + Math.floor(Math.random() * (options.length / 2));
                    for (let j = 0; j < options.length; j++) {
                        const i = (startIndex + j) % options.length;
                        const opt = options[i];
                        const text = (await opt.textContent() ?? "").trim();
                        const value = await opt.getAttribute("value") ?? "";
                        if (text && value && text.toLowerCase() !== "select" && text !== "--") {
                            const permName = text.split(" ")[0].trim();
                            if (!assignedText.includes(permName)) {
                                await (dropdown as ReturnType<Page["locator"]>).selectOption({ label: text });
                                console.log(`[selectPermission] Selected: '${text}'`);
                                return;
                            }
                        }
                    }
                    // Fallback to first non-empty option if all are assigned
                    for (let i = 0; i < options.length; i++) {
                        const opt = options[i];
                        const text = (await opt.textContent() ?? "").trim();
                        const value = await opt.getAttribute("value") ?? "";
                        if (text && value && text.toLowerCase() !== "select" && text !== "--") {
                            await (dropdown as ReturnType<Page["locator"]>).selectOption({ label: text });
                            console.log(`[selectPermission] Fallback selected: '${text}'`);
                            return;
                        }
                    }
                }
            } else {
                // Custom combobox — click to open and pick first option
                await dropdown.click();
                
                // Wait for at least one option to be visible so options are rendered in the DOM
                const firstOptLocator = this.page.getByRole("option").first();
                await firstOptLocator.waitFor({ state: "visible", timeout: 10_000 });

                if (permissionName) {
                    const optionLocator = this.page.getByRole("option", { name: permissionName });
                    await optionLocator.waitFor({ state: "visible", timeout: 10_000 });
                    await optionLocator.click();
                } else {
                    const options = await this.page.getByRole("option").all();
                    const startIndex = Math.floor(options.length / 2) + Math.floor(Math.random() * (options.length / 2));
                    console.log(`[selectPermission] Found ${options.length} custom combobox options. Starting search from index ${startIndex}`);
                    for (let j = 0; j < options.length; j++) {
                        const i = (startIndex + j) % options.length;
                        const opt = options[i];
                        const text = (await opt.textContent() ?? "").trim();
                        if (text) {
                            const permName = text.split(" ")[0].trim();
                            if (!assignedText.includes(permName)) {
                                await opt.click();
                                console.log(`[selectPermission] Selected custom option: '${text}'`);
                                return;
                            }
                        }
                    }
                    // Fallback to first option if all are assigned
                    console.log("[selectPermission] Fallback: selecting the first option.");
                    await firstOptLocator.click();
                }
            }
        });
    }

    public async assignPermission() {
        await test.step(`Click ${RoleManagementConstants.ASSIGN_BUTTON}`, async () => {
            const btn = this.page.locator(RolePermissionPage.ASSIGN_BUTTON).first();
            await btn.waitFor({ state: "visible", timeout: 10_000 });
            const isDisabled = await btn.isDisabled();
            if (isDisabled) {
                console.log("[assignPermission] Assign button is disabled (this acts as validation). Skipping click.");
                return;
            }
            await btn.click();
        });
    }

    public async verifyAssignSuccessToast() {
        await test.step(`Verify permission assignment success toast`, async () => {
            const toast = this.page.locator(RolePermissionPage.SUCCESS_TOAST).first();
            await expect(toast,
                `Success toast "${RoleManagementConstants.PERMISSION_ASSIGNED_TOAST}" should appear after assignment`)
                .toBeVisible({ timeout: 15_000 });
            const toastText = (await toast.textContent() ?? "").trim();
            console.log(`[verifyAssignSuccessToast] Toast text: '${toastText}'`);
            await this.page.waitForLoadState("domcontentloaded").catch(() => {});
            await this.page.waitForTimeout(1_000);
        });
    }

    public async verifyPermissionAssigned(permissionName: string) {
        await test.step(`Verify permission '${permissionName}' appears in the assigned list`, async () => {
            const row = this.page.locator(
                RolePermissionPage.assignedPermissionRow(permissionName),
            ).first();
            await expect(row,
                `Permission '${permissionName}' should appear in the assigned permissions list`)
                .toBeVisible({ timeout: 10_000 });
        });
    }

    // ── Permission count ──────────────────────────────────────────────────────

    public async getPermissionCount(): Promise<number> {
        return test.step(`Get current ${RoleManagementConstants.PERMISSION_COUNT}`, async () => {
            // Wait for network requests to settle so the assigned permissions count is fully loaded
            await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
            await this.page.waitForTimeout(1000); // safety buffer

            const countEl = this.page.locator(RolePermissionPage.PERMISSION_COUNT).first();
            const isVisible = await countEl.isVisible({ timeout: 10_000 }).catch(() => false);
            if (!isVisible) {
                // Fall back to counting table rows
                const rows = this.page.locator('tbody tr');
                const rowCount = await rows.count();
                console.log(`[getPermissionCount] Count element not found; row count fallback: ${rowCount}`);
                return rowCount;
            }
            const text = (await countEl.textContent() ?? "").trim();
            console.log(`[getPermissionCount] Count text: '${text}'`);
            const match = text.match(/(\d+)/);
            const count = match ? parseInt(match[1], 10) : 0;
            console.log(`[getPermissionCount] Parsed count: ${count}`);
            return count;
        });
    }

    // ── Search permissions ────────────────────────────────────────────────────

    public async searchPermission(permissionName: string) {
        await test.step(`Search permission '${permissionName}'`, async () => {
            const input = this.page.locator(RolePermissionPage.PERMISSION_SEARCH).first();
            await input.waitFor({ state: "visible", timeout: 10_000 });
            await input.fill(permissionName);
            await this.page.waitForLoadState("domcontentloaded");
            await this.page.waitForTimeout(1_000);
        });
    }

    public async clearPermissionSearch() {
        await test.step(`Clear permission search input`, async () => {
            const input = this.page.locator(RolePermissionPage.PERMISSION_SEARCH).first();
            await input.waitFor({ state: "visible" });
            await input.fill("");
            await this.page.waitForTimeout(500);
        });
    }

    public async verifyNoPermissionResults() {
        await test.step(`Verify no permissions match the search`, async () => {
            await this.page.waitForTimeout(1_000);
            const msg = this.page.locator(RolePermissionPage.NO_RESULTS_MESSAGE).first();
            await expect(msg,
                "No results message should be displayed for invalid permission search")
                .toBeVisible({ timeout: 10_000 });
        });
    }

    public async verifyPermissionSearchResult(permissionName: string) {
        await test.step(`Verify search result contains '${permissionName}'`, async () => {
            const row = this.page.locator(
                RolePermissionPage.assignedPermissionRow(permissionName),
            ).first();
            await expect(row,
                `Permission '${permissionName}' should appear in the search results`)
                .toBeVisible({ timeout: 10_000 });
        });
    }

    // ── Delete permission ─────────────────────────────────────────────────────

    public async deletePermission(permissionName: string) {
        await test.step(`Delete permission '${permissionName}'`, async () => {
            const icon = this.page.locator(
                RolePermissionPage.deletePermissionIcon(permissionName),
            ).first();
            await icon.waitFor({ state: "visible", timeout: 10_000 });
            await icon.click();
            await this.page.waitForLoadState("domcontentloaded");
            await this.page.waitForTimeout(1_000);

            // Handle SweetAlert confirmation popup if visible
            const popup = this.page.locator(DeleteResourcePopup.POPUP).first();
            if (await popup.isVisible({ timeout: 3000 }).catch(() => false)) {
                const yesBtn = popup.locator(DeleteResourcePopup.CONFIRM_BTN).first();
                if (await yesBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await yesBtn.click();
                } else {
                    await this.page.keyboard.press("Enter");
                }
                await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
                await this.page.waitForTimeout(1000);
            }
        });
    }

    public async deleteFirstPermission() {
        await test.step(`Delete first permission in the assigned list`, async () => {
            const icon = this.page.locator(RolePermissionPage.FIRST_DELETE_ICON).first();
            await icon.waitFor({ state: "visible", timeout: 10_000 });
            await icon.click();
            await this.page.waitForLoadState("domcontentloaded");
            await this.page.waitForTimeout(1_000);

            // Handle SweetAlert confirmation popup if visible
            const popup = this.page.locator(DeleteResourcePopup.POPUP).first();
            if (await popup.isVisible({ timeout: 3000 }).catch(() => false)) {
                const yesBtn = popup.locator(DeleteResourcePopup.CONFIRM_BTN).first();
                if (await yesBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await yesBtn.click();
                } else {
                    await this.page.keyboard.press("Enter");
                }
                await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
                await this.page.waitForTimeout(1000);
            }
        });
    }

    public async verifyPermissionDeleted(permissionName: string) {
        await test.step(`Verify permission '${permissionName}' is removed from the list`, async () => {
            await this.page.waitForTimeout(1_000);
            const row = this.page.locator(
                RolePermissionPage.assignedPermissionRow(permissionName),
            );
            await expect(row,
                `Permission '${permissionName}' should be removed from the assigned list`)
                .toHaveCount(0, { timeout: 10_000 });
        });
    }

    // ── Validation messages ───────────────────────────────────────────────────

    public async verifyValidationMessageVisible() {
        await test.step(`Verify ${RoleManagementConstants.VALIDATION_MESSAGE} is displayed or assign button is disabled`, async () => {
            const btn = this.page.locator(RolePermissionPage.ASSIGN_BUTTON).first();
            const isDisabled = await btn.isDisabled();
            if (isDisabled) {
                console.log("[verifyValidationMessageVisible] Assign button is disabled, validation check passed.");
                return;
            }
            const msg = this.page.locator(RolePermissionPage.VALIDATION_MESSAGE).first();
            await expect(msg,
                "A validation or error message should be visible")
                .toBeVisible({ timeout: 10_000 });
        });
    }

    // ── Navigation ────────────────────────────────────────────────────────────

    public async clickBack() {
        await test.step(`Click ${RoleManagementConstants.BACK_BUTTON}`, async () => {
            const btn = this.page.locator(RolePermissionPage.BACK_BUTTON).first();
            await btn.waitFor({ state: "visible", timeout: 10_000 });
            await btn.click();
            await this.page.waitForLoadState("domcontentloaded");
            await this.page.waitForTimeout(1_000);
        });
    }
}
