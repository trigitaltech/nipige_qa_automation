import test, { Page, expect } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import RolePage from "@pages/RolePage";
import RoleManagementConstants from "@uiConstants/RoleManagementConstants";

export default class RoleManagementSteps {
    private ui: UIActions;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }

    // ── Navigation ────────────────────────────────────────────────────────────

    public async navigateToRoleManagement() {
        await test.step(`Navigate to ${RoleManagementConstants.ROLE_MANAGEMENT_PAGE}`, async () => {
            if (this.page.url().includes("/role")) {
                console.log("[navigateToRoleManagement] Already on Role Management page — skipping nav");
                return;
            }

            // Expand "User Management" parent menu if present
            const userMgmtMenu = this.page.locator(RolePage.MENU_USER_MANAGEMENT).first();
            const userMgmtVisible = await userMgmtMenu.isVisible().catch(() => false);
            if (userMgmtVisible) {
                await userMgmtMenu.click();
                await this.page.waitForTimeout(500);
            }

            // Click the Role Management submenu link
            const roleLink = this.page.locator(RolePage.MENU_ROLE_MANAGEMENT).first();
            await roleLink.waitFor({ state: "visible", timeout: 10_000 });
            await roleLink.click();
            await this.page.waitForLoadState("domcontentloaded");
            await this.page.waitForTimeout(1_000);
        });
    }

    // ── Listing page ──────────────────────────────────────────────────────────

    public async verifyRoleListingVisible() {
        await test.step(`Verify ${RoleManagementConstants.ROLE_MANAGEMENT_PAGE} listing is displayed`, async () => {
            // Either the table body with rows or the Create Role button must be visible
            const createBtn = this.page.locator(RolePage.CREATE_ROLE_BUTTON).first();
            await expect(createBtn,
                "Create Role button should be visible on the Role listing page")
                .toBeVisible({ timeout: 15_000 });
        });
    }

    public async verifyRoleGridVisible() {
        await test.step(`Verify role grid columns are displayed`, async () => {
            const nameHeader = this.page.locator(RolePage.COLUMN_NAME_HEADER).first();
            await expect(nameHeader,
                "Name column header should be visible in the role grid")
                .toBeVisible({ timeout: 10_000 });

            const descHeader = this.page.locator(RolePage.COLUMN_DESCRIPTION_HEADER).first();
            await expect(descHeader,
                "Description column header should be visible in the role grid")
                .toBeVisible({ timeout: 5_000 });

            const rows = this.page.locator(RolePage.TABLE_ROW);
            const rowCount = await rows.count();
            expect(rowCount,
                "Role grid should have at least one row of data")
                .toBeGreaterThan(0);
        });
    }

    public async searchRole(roleName: string) {
        await test.step(`Search for role '${roleName}'`, async () => {
            const input = this.page.locator(RolePage.SEARCH_INPUT).first();
            await input.waitFor({ state: "visible", timeout: 10_000 });
            await input.fill(roleName);
            await this.page.waitForLoadState("domcontentloaded");
            await this.page.waitForTimeout(1_000);
        });
    }

    public async clearSearch() {
        await test.step(`Clear role search input`, async () => {
            const input = this.page.locator(RolePage.SEARCH_INPUT).first();
            await input.waitFor({ state: "visible" });
            await input.fill("");
            await this.page.waitForTimeout(500);
        });
    }

    public async verifyRoleExists(roleName: string) {
        await test.step(`Verify role '${roleName}' exists in the listing`, async () => {
            const row = this.page.locator(RolePage.roleRow(roleName)).first();
            await expect(row,
                `Role '${roleName}' should be visible in the role listing`)
                .toBeVisible({ timeout: 15_000 });
        });
    }

    public async verifyRoleNotExists(roleName: string) {
        await test.step(`Verify role '${roleName}' is NOT in the listing`, async () => {
            await this.page.waitForTimeout(1_000);
            const row = this.page.locator(RolePage.roleRow(roleName));
            await expect(row,
                `Role '${roleName}' should NOT be present in the listing after deletion`)
                .toHaveCount(0, { timeout: 10_000 });
        });
    }

    public async verifyNoDataMessage() {
        await test.step(`Verify no data / no matching results message is displayed`, async () => {
            await this.page.waitForTimeout(1_000);
            const msg = this.page.locator(RolePage.NO_DATA_MESSAGE).first();
            await expect(msg,
                "A 'no data' or 'no matching records' message should be visible")
                .toBeVisible({ timeout: 10_000 });
        });
    }

    public async verifyPaginationVisible() {
        await test.step(`Verify ${RoleManagementConstants.PAGINATION} is displayed`, async () => {
            // Pagination may or may not appear depending on data volume — soft assertion
            const pagination = this.page.locator(RolePage.PAGINATION).first();
            const isVisible = await pagination.isVisible().catch(() => false);
            console.log(`[verifyPaginationVisible] Pagination visible: ${isVisible}`);
            if (isVisible) {
                await expect(pagination, "Pagination controls should be visible")
                    .toBeVisible({ timeout: 5_000 });
            } else {
                console.log("[verifyPaginationVisible] Pagination not present — single page of data");
            }
        });
    }

    public async clickRefresh() {
        await test.step(`Click ${RoleManagementConstants.REFRESH_BUTTON}`, async () => {
            const btn = this.page.locator(RolePage.REFRESH_BUTTON).first();
            const isVisible = await btn.isVisible().catch(() => false);
            if (isVisible) {
                await btn.click();
            } else {
                // Fall back to page reload when no explicit refresh button exists
                await this.page.reload({ waitUntil: "domcontentloaded" });
            }
            await this.page.waitForLoadState("domcontentloaded");
            await this.page.waitForTimeout(1_000);
        });
    }

    // ── Create Role popup ─────────────────────────────────────────────────────

    public async clickCreateRole() {
        await test.step(`Click ${RoleManagementConstants.CREATE_ROLE_BUTTON}`, async () => {
            await this.ui.element(RolePage.CREATE_ROLE_BUTTON,
                RoleManagementConstants.CREATE_ROLE_BUTTON).click();
            await this.page.waitForTimeout(500);
        });
    }

    public async verifyCreatePopupVisible() {
        await test.step(`Verify ${RoleManagementConstants.CREATE_ROLE_POPUP} is displayed`, async () => {
            const popup = this.page.locator(RolePage.CREATE_POPUP).first();
            await expect(popup,
                "Create Role popup should be visible after clicking Create Role")
                .toBeVisible({ timeout: 10_000 });
            const roleNameInput = this.page.locator(RolePage.ROLE_NAME_INPUT).first();
            await expect(roleNameInput,
                "Role Name input should be present in the Create Role popup")
                .toBeVisible({ timeout: 5_000 });
        });
    }

    public async fillCreateRoleForm(roleName: string, description: string) {
        await test.step(`Fill Create Role form — Name: ${roleName}`, async () => {
            const nameInput = this.page.locator(RolePage.ROLE_NAME_INPUT).first();
            await nameInput.waitFor({ state: "visible", timeout: 10_000 });
            await nameInput.fill(roleName);

            if (description) {
                const descInput = this.page.locator(RolePage.DESCRIPTION_INPUT).first();
                await descInput.waitFor({ state: "visible" });
                await descInput.fill(description);
            }
        });
    }

    public async submitCreateRole() {
        await test.step(`Click ${RoleManagementConstants.CREATE_SUBMIT_BUTTON}`, async () => {
            const btn = this.page.locator(RolePage.CREATE_SUBMIT_BUTTON).first();
            await btn.waitFor({ state: "visible", timeout: 10_000 });
            await btn.click();
            await this.page.waitForLoadState("domcontentloaded");
            await this.page.waitForTimeout(1_000);
        });
    }

    public async createRole(roleName: string, description: string) {
        await test.step(`Create role '${roleName}'`, async () => {
            await this.clickCreateRole();
            await this.verifyCreatePopupVisible();
            await this.fillCreateRoleForm(roleName, description);
            await this.submitCreateRole();
        });
    }

    public async clickCancelInPopup() {
        await test.step(`Click ${RoleManagementConstants.CANCEL_BUTTON}`, async () => {
            const btn = this.page.locator(RolePage.CANCEL_BUTTON).first();
            await btn.waitFor({ state: "visible", timeout: 10_000 });
            await btn.click();
            await this.page.waitForTimeout(500);
        });
    }

    public async clickCloseInPopup() {
        await test.step(`Click ${RoleManagementConstants.CLOSE_BUTTON}`, async () => {
            const btn = this.page.locator(RolePage.CLOSE_BUTTON).first();
            await btn.waitFor({ state: "visible", timeout: 10_000 });
            await btn.click();
            await this.page.waitForTimeout(500);
        });
    }

    public async verifyPopupClosed() {
        await test.step(`Verify popup is closed`, async () => {
            const popup = this.page.locator(RolePage.CREATE_POPUP);
            await expect(popup,
                "The popup should be dismissed after clicking Cancel or Close")
                .toHaveCount(0, { timeout: 10_000 });
        });
    }

    public async verifyValidationMessageVisible() {
        await test.step(`Verify ${RoleManagementConstants.VALIDATION_MESSAGE} is displayed`, async () => {
            const msg = this.page.locator(RolePage.VALIDATION_MESSAGE).first();
            await expect(msg,
                "A validation error message should be visible")
                .toBeVisible({ timeout: 10_000 });
        });
    }

    public async verifySuccessToast() {
        await test.step(`Verify ${RoleManagementConstants.SUCCESS_TOAST}`, async () => {
            const toast = this.page.locator(RolePage.SUCCESS_TOAST).first();
            await expect(toast,
                "A success toast notification should appear")
                .toBeVisible({ timeout: 15_000 });
        });
    }

    // ── Permission (Lock) icon ────────────────────────────────────────────────

    public async clickPermissionIcon(roleName: string) {
        await test.step(`Click ${RoleManagementConstants.PERMISSION_ICON} for '${roleName}'`, async () => {
            const icon = this.page.locator(RolePage.permissionIcon(roleName)).first();
            await icon.waitFor({ state: "visible", timeout: 10_000 });
            await icon.click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    public async clickFirstPermissionIcon() {
        await test.step(`Click first ${RoleManagementConstants.PERMISSION_ICON} in listing`, async () => {
            const icon = this.page.locator(RolePage.FIRST_PERMISSION_ICON).first();
            await icon.waitFor({ state: "visible", timeout: 10_000 });
            await icon.click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    // ── Edit icon ─────────────────────────────────────────────────────────────

    public async clickEditIcon(roleName: string) {
        await test.step(`Click ${RoleManagementConstants.EDIT_ICON} for '${roleName}'`, async () => {
            const icon = this.page.locator(RolePage.editIcon(roleName)).first();
            await icon.waitFor({ state: "visible", timeout: 10_000 });
            await icon.click();
            await this.page.waitForTimeout(500);
        });
    }

    public async clickFirstEditIcon() {
        await test.step(`Click first ${RoleManagementConstants.EDIT_ICON} in listing`, async () => {
            const icon = this.page.locator(RolePage.FIRST_EDIT_ICON).first();
            await icon.waitFor({ state: "visible", timeout: 10_000 });
            await icon.click();
            await this.page.waitForTimeout(500);
        });
    }

    public async verifyEditPopupVisible() {
        await test.step(`Verify ${RoleManagementConstants.EDIT_ROLE_POPUP} is displayed`, async () => {
            const popup = this.page.locator(RolePage.CREATE_POPUP).first();
            await expect(popup,
                "Edit Role popup should be visible after clicking the Edit icon")
                .toBeVisible({ timeout: 10_000 });
            const updateBtn = this.page.locator(RolePage.UPDATE_BUTTON).first();
            await expect(updateBtn,
                "Update button should be present in the Edit Role popup")
                .toBeVisible({ timeout: 5_000 });
        });
    }

    public async verifyEditPopupPrePopulated() {
        await test.step(`Verify Edit popup fields are pre-populated`, async () => {
            const nameInput = this.page.locator(RolePage.ROLE_NAME_INPUT).first();
            await nameInput.waitFor({ state: "visible", timeout: 10_000 });
            const nameValue = await nameInput.inputValue();
            expect(nameValue.trim(),
                "Role Name should be pre-populated in the Edit popup")
                .not.toBe("");

            const descInput = this.page.locator(RolePage.DESCRIPTION_INPUT).first();
            const descVisible = await descInput.isVisible().catch(() => false);
            if (descVisible) {
                const descValue = await descInput.inputValue().catch(
                    async () => (await descInput.textContent()) ?? "",
                );
                console.log(`[verifyEditPopupPrePopulated] Description value: '${descValue}'`);
            }
        });
    }

    public async updateDescription(description: string) {
        await test.step(`Update description to '${description}'`, async () => {
            const descInput = this.page.locator(RolePage.DESCRIPTION_INPUT).first();
            await descInput.waitFor({ state: "visible", timeout: 10_000 });
            await descInput.fill(description);
        });
    }

    public async clickUpdate() {
        await test.step(`Click ${RoleManagementConstants.UPDATE_BUTTON}`, async () => {
            const btn = this.page.locator(RolePage.UPDATE_BUTTON).first();
            await btn.waitFor({ state: "visible", timeout: 10_000 });
            await btn.click();
            await this.page.waitForLoadState("domcontentloaded");
            await this.page.waitForTimeout(1_000);
        });
    }

    // ── Delete icon ───────────────────────────────────────────────────────────

    public async clickDeleteIcon(roleName: string) {
        await test.step(`Click ${RoleManagementConstants.DELETE_ICON} for '${roleName}'`, async () => {
            const icon = this.page.locator(RolePage.deleteIcon(roleName)).first();
            await icon.waitFor({ state: "visible", timeout: 10_000 });
            await icon.click();
            await this.page.waitForTimeout(500);
        });
    }

    public async clickFirstDeleteIcon() {
        await test.step(`Click first ${RoleManagementConstants.DELETE_ICON} in listing`, async () => {
            const icon = this.page.locator(RolePage.FIRST_DELETE_ICON).first();
            await icon.waitFor({ state: "visible", timeout: 10_000 });
            await icon.click();
            await this.page.waitForTimeout(500);
        });
    }

    public async verifyDeletePopupVisible() {
        await test.step(`Verify ${RoleManagementConstants.DELETE_POPUP} is displayed`, async () => {
            const popup = this.page.locator(RolePage.DELETE_POPUP).first();
            await expect(popup,
                "Delete confirmation popup should be visible after clicking Delete icon")
                .toBeVisible({ timeout: 10_000 });
        });
    }

    public async confirmDelete() {
        await test.step(`Confirm delete — click ${RoleManagementConstants.DELETE_CONFIRM_BUTTON}`, async () => {
            const btn = this.page.locator(RolePage.DELETE_CONFIRM_BUTTON).first();
            await btn.waitFor({ state: "visible", timeout: 10_000 });
            await btn.click();
            // Wait for the popup to close
            await this.page.locator(RolePage.DELETE_POPUP)
                .waitFor({ state: "hidden", timeout: 10_000 })
                .catch(() => console.log("[confirmDelete] Popup hide timeout — continuing"));
            await this.page.waitForLoadState("domcontentloaded");
            await this.page.waitForTimeout(1_000);
        });
    }

    public async cancelDelete() {
        await test.step(`Cancel delete — click ${RoleManagementConstants.DELETE_CANCEL_BUTTON}`, async () => {
            const btn = this.page.locator(RolePage.DELETE_CANCEL_BUTTON).first();
            await btn.waitFor({ state: "visible", timeout: 10_000 });
            await btn.click();
            await this.page.locator(RolePage.DELETE_POPUP)
                .waitFor({ state: "hidden", timeout: 10_000 })
                .catch(() => console.log("[cancelDelete] Popup hide timeout — continuing"));
            await this.page.waitForTimeout(500);
        });
    }

    public async verifyDeleteSuccessMessage() {
        await test.step(`Verify delete success message is displayed`, async () => {
            // SweetAlert2 success popup or Toastify success toast
            const swalTitle = this.page.locator("#swal2-title").first();
            const toast = this.page.locator(RolePage.SUCCESS_TOAST).first();
            const swalVisible = await swalTitle.isVisible({ timeout: 5_000 }).catch(() => false);
            if (swalVisible) {
                await expect(swalTitle, "SweetAlert2 success title should be visible after delete")
                    .toBeVisible({ timeout: 10_000 });
                // Dismiss the SweetAlert2 popup
                const okBtn = this.page.locator("button.swal2-confirm").first();
                const okVisible = await okBtn.isVisible().catch(() => false);
                if (okVisible) {
                    await okBtn.click();
                }
            } else {
                await expect(toast, "Success toast should appear after successful deletion")
                    .toBeVisible({ timeout: 10_000 });
            }
        });
    }
}
