import HomeSteps from "@uiSteps/HomeSteps";
import RoleManagementSteps from "@uiSteps/RoleManagementSteps";
import RolePermissionSteps from "@uiSteps/RolePermissionSteps";
import { test, expect } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";
import { getCredential, Role } from "@config/Credentials";
import RolePage from "@pages/RolePage";
import RoleManagementConstants from "@uiConstants/RoleManagementConstants";

const SHEET = "RoleManagementTest";

// ── Credentials ───────────────────────────────────────────────────────────────
const credential = getCredential(Role.ADMIN);
const PERSONA = "admin";

// ── Helpers ───────────────────────────────────────────────────────────────────
// Timestamp snapshot — unique per test invocation, avoids collisions
function uniqueRoleName(prefix: string): string {
    return `${prefix}${Date.now()}`;
}

function val(v: string, fallback: string): string {
    return v && v.trim() ? v.trim() : fallback;
}

async function loginAsAdmin(home: HomeSteps) {
    await home.launchApplication();
    await home.login(credential.email, credential.password, PERSONA);
    await home.validateLogin(credential.email);
}

async function cleanUpRole(role: RoleManagementSteps, page: any, roleName: string) {
    try {
        const cancelBtn = page.locator(RolePage.CANCEL_BUTTON).first();
        if (await cancelBtn.isVisible().catch(() => false)) {
            await role.clickCancelInPopup().catch(() => {});
        }
        const delCancelBtn = page.locator(RolePage.DELETE_CANCEL_BUTTON).first();
        if (await delCancelBtn.isVisible().catch(() => false)) {
            await role.cancelDelete().catch(() => {});
        }
        await role.navigateToRoleManagement().catch(() => {});
        await role.searchRole(roleName).catch(() => {});
        const deleteIcon = page.locator(RolePage.deleteIcon(roleName)).first();
        if (await deleteIcon.isVisible().catch(() => false)) {
            await role.clickDeleteIcon(roleName).catch(() => {});
            await role.confirmDelete().catch(() => {});
        }
    } catch (err) {
        console.log(`[cleanup] Failed to clean up role '${roleName}':`, err);
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// ROLE LISTING TESTS — TC01–TC10
// ═════════════════════════════════════════════════════════════════════════════

// ── TC01: Verify Role page loads successfully ─────────────────────────────────
const d01 = ExcelUtil.getTestData(SHEET, "TC01_RolePageLoad");
test(`${d01.TestID} - ${d01.Description}`, async ({ page }) => {
    Allure.attachDetails(d01.Description, d01.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.verifyRoleListingVisible();
    await home.logout();
});

// ── TC02: Verify role grid displays ──────────────────────────────────────────
const d02 = ExcelUtil.getTestData(SHEET, "TC02_RoleGridDisplay");
test(`${d02.TestID} - ${d02.Description}`, async ({ page }) => {
    Allure.attachDetails(d02.Description, d02.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.verifyRoleGridVisible();
    const firstEditIcon = page.locator(RolePage.FIRST_EDIT_ICON).first();
    await expect(firstEditIcon, d02.ExpectedMessage ?? "").toBeVisible({ timeout: 10_000 });
    const firstDeleteIcon = page.locator(RolePage.FIRST_DELETE_ICON).first();
    await expect(firstDeleteIcon, d02.ExpectedMessage ?? "").toBeVisible({ timeout: 10_000 });
    await home.logout();
});

// ── TC03: Verify search with valid role ───────────────────────────────────────
const d03 = ExcelUtil.getTestData(SHEET, "TC03_SearchValidRole");
test(`${d03.TestID} - ${d03.Description}`, async ({ page }) => {
    Allure.attachDetails(d03.Description, d03.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.searchRole(val(d03.SearchTerm, RoleManagementConstants.SEARCH_VALID_ROLE));
    const row = page.locator(RolePage.TABLE_ROW).first();
    await expect(row, d03.ExpectedMessage ?? "").toBeVisible({ timeout: 10_000 });
    await home.logout();
});

// ── TC04: Verify search with invalid role ─────────────────────────────────────
const d04 = ExcelUtil.getTestData(SHEET, "TC04_SearchInvalidRole");
test(`${d04.TestID} - ${d04.Description}`, async ({ page }) => {
    Allure.attachDetails(d04.Description, d04.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.searchRole(val(d04.SearchTerm, RoleManagementConstants.SEARCH_INVALID_ROLE));
    await role.verifyNoDataMessage();
    await home.logout();
});

// ── TC05: Verify Create Role button opens popup ───────────────────────────────
const d05 = ExcelUtil.getTestData(SHEET, "TC05_CreateRoleButtonPopup");
test(`${d05.TestID} - ${d05.Description}`, async ({ page }) => {
    Allure.attachDetails(d05.Description, d05.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    try {
        await role.navigateToRoleManagement();
        await role.clickCreateRole();
        await role.verifyCreatePopupVisible();
    } finally {
        const cancelBtn = page.locator(RolePage.CANCEL_BUTTON).first();
        if (await cancelBtn.isVisible().catch(() => false)) {
            await role.clickCancelInPopup().catch(() => {});
            await role.verifyPopupClosed().catch(() => {});
        }
        await home.logout();
    }
});

// ── TC06: Verify Lock icon opens Role Permission page ─────────────────────────
const d06 = ExcelUtil.getTestData(SHEET, "TC06_LockIconPermPage");
test(`${d06.TestID} - ${d06.Description}`, async ({ page }) => {
    Allure.attachDetails(d06.Description, d06.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    const perm = new RolePermissionSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.clickFirstPermissionIcon();
    await perm.verifyPermissionPageVisible();
    await home.logout();
});

// ── TC07: Verify Edit icon opens Edit popup ───────────────────────────────────
const d07 = ExcelUtil.getTestData(SHEET, "TC07_EditIconPopup");
test(`${d07.TestID} - ${d07.Description}`, async ({ page }) => {
    Allure.attachDetails(d07.Description, d07.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    try {
        await role.navigateToRoleManagement();
        await role.clickFirstEditIcon();
        await role.verifyEditPopupVisible();
    } finally {
        const cancelBtn = page.locator(RolePage.CANCEL_BUTTON).first();
        if (await cancelBtn.isVisible().catch(() => false)) {
            await role.clickCancelInPopup().catch(() => {});
            await role.verifyPopupClosed().catch(() => {});
        }
        await home.logout();
    }
});

// ── TC08: Verify Delete icon opens confirmation popup ────────────────────────
const d08 = ExcelUtil.getTestData(SHEET, "TC08_DeleteIconPopup");
test(`${d08.TestID} - ${d08.Description}`, async ({ page }) => {
    Allure.attachDetails(d08.Description, d08.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.clickFirstDeleteIcon();
    await role.verifyDeletePopupVisible();
    await role.cancelDelete();
    await home.logout();
});

// ── TC09: Verify Refresh reloads role list ────────────────────────────────────
const d09 = ExcelUtil.getTestData(SHEET, "TC09_RefreshReloads");
test(`${d09.TestID} - ${d09.Description}`, async ({ page }) => {
    Allure.attachDetails(d09.Description, d09.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.clickRefresh();
    await role.verifyRoleListingVisible();
    await home.logout();
});

// ── TC10: Verify pagination controls ─────────────────────────────────────────
const d10 = ExcelUtil.getTestData(SHEET, "TC10_PaginationVisible");
test(`${d10.TestID} - ${d10.Description}`, async ({ page }) => {
    Allure.attachDetails(d10.Description, d10.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.verifyPaginationVisible();
    await home.logout();
});

// ═════════════════════════════════════════════════════════════════════════════
// CREATE ROLE TESTS — TC11–TC17
// ═════════════════════════════════════════════════════════════════════════════

// ── TC11: Verify role created successfully ────────────────────────────────────
const d11 = ExcelUtil.getTestData(SHEET, "TC11_CreateRoleSuccess");
test(`${d11.TestID} - ${d11.Description}`, async ({ page }) => {
    Allure.attachDetails(d11.Description, d11.Issue);
    const roleName = uniqueRoleName(val(d11.RoleName, RoleManagementConstants.ROLE_PREFIX));
    const description = val(d11.Description_Input, "Automation Role Description");
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    try {
        await role.navigateToRoleManagement();
        await role.createRole(roleName, description);
        const popup = page.locator(RolePage.CREATE_POPUP);
        const popupGone = await popup.count().then((c) => c === 0);
        if (!popupGone) {
            await role.verifySuccessToast();
        }
    } finally {
        await cleanUpRole(role, page, roleName);
        await home.logout();
    }
});

// ── TC12: Verify created role appears in listing ──────────────────────────────
const d12 = ExcelUtil.getTestData(SHEET, "TC12_CreatedRoleInListing");
test(`${d12.TestID} - ${d12.Description}`, async ({ page }) => {
    Allure.attachDetails(d12.Description, d12.Issue);
    const roleName = uniqueRoleName(val(d12.RoleName, RoleManagementConstants.ROLE_PREFIX));
    const description = val(d12.Description_Input, "Automation Role Description");
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    try {
        await role.navigateToRoleManagement();
        await role.createRole(roleName, description);
        await role.searchRole(roleName);
        await role.verifyRoleExists(roleName);
    } finally {
        await cleanUpRole(role, page, roleName);
        await home.logout();
    }
});

// ── TC13: Verify Cancel closes Create popup ───────────────────────────────────
const d13 = ExcelUtil.getTestData(SHEET, "TC13_CancelClosesCreatePopup");
test(`${d13.TestID} - ${d13.Description}`, async ({ page }) => {
    Allure.attachDetails(d13.Description, d13.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.clickCreateRole();
    await role.verifyCreatePopupVisible();
    await role.clickCancelInPopup();
    await role.verifyPopupClosed();
    await home.logout();
});

// ── TC14: Verify Close (X) closes Create popup ────────────────────────────────
const d14 = ExcelUtil.getTestData(SHEET, "TC14_CloseXClosesCreatePopup");
test(`${d14.TestID} - ${d14.Description}`, async ({ page }) => {
    Allure.attachDetails(d14.Description, d14.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.clickCreateRole();
    await role.verifyCreatePopupVisible();
    await role.clickCloseInPopup();
    await role.verifyPopupClosed();
    await home.logout();
});

// ── TC15: Verify Role Name required validation ────────────────────────────────
const d15 = ExcelUtil.getTestData(SHEET, "TC15_RoleNameRequiredValidation");
test(`${d15.TestID} - ${d15.Description}`, async ({ page }) => {
    Allure.attachDetails(d15.Description, d15.Issue);
    const description = val(d15.Description_Input, "Automation Role Description");
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    try {
        await role.navigateToRoleManagement();
        await role.clickCreateRole();
        await role.verifyCreatePopupVisible();
        // Leave Role Name blank (empty string from Excel RoleName column)
        await role.fillCreateRoleForm("", description);
        await role.submitCreateRole();
        await role.verifyValidationMessageVisible();
    } finally {
        const cancelBtn = page.locator(RolePage.CANCEL_BUTTON).first();
        if (await cancelBtn.isVisible().catch(() => false)) {
            await role.clickCancelInPopup().catch(() => {});
            await role.verifyPopupClosed().catch(() => {});
        }
        await home.logout();
    }
});

// ── TC16: Verify spaces-only Role Name validation ─────────────────────────────
const d16 = ExcelUtil.getTestData(SHEET, "TC16_SpacesOnlyRoleName");
test(`${d16.TestID} - ${d16.Description}`, async ({ page }) => {
    Allure.attachDetails(d16.Description, d16.Issue);
    // RoleName column has "     " (spaces) in the Excel sheet
    const spacesRoleName = d16.RoleName || "     ";
    const description = val(d16.Description_Input, "Automation Role Description");
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    try {
        await role.navigateToRoleManagement();
        await role.clickCreateRole();
        await role.verifyCreatePopupVisible();
        await role.fillCreateRoleForm(spacesRoleName, description);
        await role.submitCreateRole();
        await role.verifyValidationMessageVisible();
    } finally {
        const cancelBtn = page.locator(RolePage.CANCEL_BUTTON).first();
        if (await cancelBtn.isVisible().catch(() => false)) {
            await role.clickCancelInPopup().catch(() => {});
            await role.verifyPopupClosed().catch(() => {});
        }
        await home.logout();
    }
});

// ── TC17: Verify duplicate role validation ────────────────────────────────────
const d17 = ExcelUtil.getTestData(SHEET, "TC17_DuplicateRoleValidation");
test(`${d17.TestID} - ${d17.Description}`, async ({ page }) => {
    Allure.attachDetails(d17.Description, d17.Issue);
    const roleName = uniqueRoleName(val(d17.RoleName, RoleManagementConstants.ROLE_PREFIX));
    const description = val(d17.Description_Input, "Automation Role Description");
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    try {
        await role.navigateToRoleManagement();
        // Create the role the first time
        await role.createRole(roleName, description);
        // Navigate back to listing and attempt to create the same role again
        await role.navigateToRoleManagement();
        await role.clickCreateRole();
        await role.verifyCreatePopupVisible();
        await role.fillCreateRoleForm(roleName, description);
        await role.submitCreateRole();
        await role.verifyValidationMessageVisible();
        await role.clickCancelInPopup();
    } finally {
        await cleanUpRole(role, page, roleName);
        await home.logout();
    }
});

// ═════════════════════════════════════════════════════════════════════════════
// ROLE PERMISSION TESTS — TC18–TC26
// ═════════════════════════════════════════════════════════════════════════════

// ── TC18: Verify permission page opens ────────────────────────────────────────
const d18 = ExcelUtil.getTestData(SHEET, "TC18_PermissionPageOpens");
test(`${d18.TestID} - ${d18.Description}`, async ({ page }) => {
    Allure.attachDetails(d18.Description, d18.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    const perm = new RolePermissionSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.clickFirstPermissionIcon();
    await perm.verifyPermissionPageVisible();
    await home.logout();
});

// ── TC19: Assign permission successfully ──────────────────────────────────────
const d19 = ExcelUtil.getTestData(SHEET, "TC19_AssignPermissionToast");
test(`${d19.TestID} - ${d19.Description}`, async ({ page }) => {
    Allure.attachDetails(d19.Description, d19.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    const perm = new RolePermissionSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.clickFirstPermissionIcon();
    await perm.verifyPermissionPageVisible();
    await perm.selectPermission();
    await perm.assignPermission();
    await perm.verifyAssignSuccessToast();
    await home.logout();
});

// ── TC20: Verify permission count increments ──────────────────────────────────
const d20 = ExcelUtil.getTestData(SHEET, "TC20_PermissionCountIncrements");
test(`${d20.TestID} - ${d20.Description}`, async ({ page }) => {
    Allure.attachDetails(d20.Description, d20.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    const perm = new RolePermissionSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.clickFirstPermissionIcon();
    await perm.verifyPermissionPageVisible();
    const beforeCount = await perm.getPermissionCount();
    await perm.selectPermission();
    await perm.assignPermission();
    await perm.verifyAssignSuccessToast();
    const afterCount = await perm.getPermissionCount();
    expect(afterCount, d20.ExpectedMessage ?? "").toBe(beforeCount + 1);
    await home.logout();
});

// ── TC21: Verify permission search works ──────────────────────────────────────
const d21 = ExcelUtil.getTestData(SHEET, "TC21_PermissionSearchValid");
test(`${d21.TestID} - ${d21.Description}`, async ({ page }) => {
    Allure.attachDetails(d21.Description, d21.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    const perm = new RolePermissionSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.clickFirstPermissionIcon();
    await perm.verifyPermissionPageVisible();
    // Assign a permission so there is something in the assigned list to search
    await perm.selectPermission();
    await perm.assignPermission();
    await perm.verifyAssignSuccessToast();
    // Get the name of the first assigned permission row and search for its prefix
    const firstRow = page.locator("div.space-y-2 p.font-semibold, tbody tr:first-child td:first-child").first();
    const assignedPermName = ((await firstRow.textContent().catch(() => "")) ?? "").trim();
    if (assignedPermName) {
        await perm.searchPermission(assignedPermName.substring(0, 5));
        const row = page.locator(`div:has(p:text-is("${assignedPermName}")), tr:has-text("${assignedPermName}")`).first();
        await expect(row, d21.ExpectedMessage ?? "").toBeVisible({ timeout: 10_000 });
    }
    await home.logout();
});

// ── TC22: Verify invalid permission search ────────────────────────────────────
const d22 = ExcelUtil.getTestData(SHEET, "TC22_PermissionSearchInvalid");
test(`${d22.TestID} - ${d22.Description}`, async ({ page }) => {
    Allure.attachDetails(d22.Description, d22.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    const perm = new RolePermissionSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.clickFirstPermissionIcon();
    await perm.verifyPermissionPageVisible();
    await perm.searchPermission(val(d22.SearchTerm, RoleManagementConstants.SEARCH_INVALID_PERMISSION));
    await perm.verifyNoPermissionResults();
    await home.logout();
});

// ── TC23: Verify permission deletion ─────────────────────────────────────────
const d23 = ExcelUtil.getTestData(SHEET, "TC23_DeletePermission");
test(`${d23.TestID} - ${d23.Description}`, async ({ page }) => {
    Allure.attachDetails(d23.Description, d23.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    const perm = new RolePermissionSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.clickFirstPermissionIcon();
    await perm.verifyPermissionPageVisible();
    // Assign first, then delete
    await perm.selectPermission();
    await perm.assignPermission();
    await perm.verifyAssignSuccessToast();
    await perm.deleteFirstPermission();
    const rows = page.locator("div.space-y-2 > div, tbody tr");
    const count = await rows.count();
    console.log(`[${d23.TestID}] Permissions remaining after delete: ${count}`);
    await home.logout();
});

// ── TC24: Verify permission count decrements ──────────────────────────────────
const d24 = ExcelUtil.getTestData(SHEET, "TC24_PermissionCountDecrements");
test(`${d24.TestID} - ${d24.Description}`, async ({ page }) => {
    Allure.attachDetails(d24.Description, d24.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    const perm = new RolePermissionSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.clickFirstPermissionIcon();
    await perm.verifyPermissionPageVisible();
    // Ensure at least one permission is assigned
    await perm.selectPermission();
    await perm.assignPermission();
    await perm.verifyAssignSuccessToast();
    const beforeCount = await perm.getPermissionCount();
    await perm.deleteFirstPermission();
    const afterCount = await perm.getPermissionCount();
    expect(afterCount, d24.ExpectedMessage ?? "").toBe(beforeCount - 1);
    await home.logout();
});

// ── TC25: Verify Back button returns to Role listing ──────────────────────────
const d25 = ExcelUtil.getTestData(SHEET, "TC25_BackButtonReturnsListing");
test(`${d25.TestID} - ${d25.Description}`, async ({ page }) => {
    Allure.attachDetails(d25.Description, d25.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    const perm = new RolePermissionSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.clickFirstPermissionIcon();
    await perm.verifyPermissionPageVisible();
    await perm.clickBack();
    await role.verifyRoleListingVisible();
    await home.logout();
});

// ── TC26: Verify assign without selecting permission shows validation ──────────
const d26 = ExcelUtil.getTestData(SHEET, "TC26_AssignWithoutSelectValidation");
test(`${d26.TestID} - ${d26.Description}`, async ({ page }) => {
    Allure.attachDetails(d26.Description, d26.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    const perm = new RolePermissionSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.clickFirstPermissionIcon();
    await perm.verifyPermissionPageVisible();
    await perm.assignPermission();
    await perm.verifyValidationMessageVisible();
    await home.logout();
});

// ═════════════════════════════════════════════════════════════════════════════
// EDIT ROLE TESTS — TC27–TC33
// ═════════════════════════════════════════════════════════════════════════════

// ── TC27: Verify edit popup pre-populated ─────────────────────────────────────
const d27 = ExcelUtil.getTestData(SHEET, "TC27_EditPopupPrePopulated");
test(`${d27.TestID} - ${d27.Description}`, async ({ page }) => {
    Allure.attachDetails(d27.Description, d27.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    try {
        await role.navigateToRoleManagement();
        await role.clickFirstEditIcon();
        await role.verifyEditPopupVisible();
        await role.verifyEditPopupPrePopulated();
    } finally {
        const cancelBtn = page.locator(RolePage.CANCEL_BUTTON).first();
        if (await cancelBtn.isVisible().catch(() => false)) {
            await role.clickCancelInPopup().catch(() => {});
            await role.verifyPopupClosed().catch(() => {});
        }
        await home.logout();
    }
});

// ── TC28: Update description ──────────────────────────────────────────────────
const d28 = ExcelUtil.getTestData(SHEET, "TC28_UpdateDescription");
test(`${d28.TestID} - ${d28.Description}`, async ({ page }) => {
    Allure.attachDetails(d28.Description, d28.Issue);
    const roleName = uniqueRoleName(val(d28.RoleName, RoleManagementConstants.EDIT_PREFIX));
    const updatedDescription = `${val(d28.Description_Input, "Updated_Desc_")}${Date.now()}`;
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    try {
        await role.navigateToRoleManagement();
        await role.createRole(roleName, "Initial Description");
        await role.navigateToRoleManagement();
        await role.searchRole(roleName);
        await role.clickEditIcon(roleName);
        await role.verifyEditPopupVisible();
        await role.updateDescription(updatedDescription);
        await role.clickUpdate();
        await role.verifyPopupClosed();
    } finally {
        await cleanUpRole(role, page, roleName);
        await home.logout();
    }
});

// ── TC29: Verify updated description saved ────────────────────────────────────
const d29 = ExcelUtil.getTestData(SHEET, "TC29_UpdatedDescriptionSaved");
test(`${d29.TestID} - ${d29.Description}`, async ({ page }) => {
    Allure.attachDetails(d29.Description, d29.Issue);
    const roleName = uniqueRoleName(val(d29.RoleName, RoleManagementConstants.EDIT_PREFIX));
    const updatedDescription = `${val(d29.Description_Input, "SavedDesc_")}${Date.now()}`;
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    try {
        await role.navigateToRoleManagement();
        await role.createRole(roleName, "Initial Description");
        await role.navigateToRoleManagement();
        await role.searchRole(roleName);
        await role.clickEditIcon(roleName);
        await role.verifyEditPopupVisible();
        await role.updateDescription(updatedDescription);
        await role.clickUpdate();
        await role.navigateToRoleManagement();
        await role.searchRole(roleName);
        const row = page.locator(RolePage.roleRow(roleName)).first();
        await expect(row, d29.ExpectedMessage ?? "").toBeVisible({ timeout: 10_000 });
    } finally {
        await cleanUpRole(role, page, roleName);
        await home.logout();
    }
});

// ── TC30: Verify Cancel closes edit popup ─────────────────────────────────────
const d30 = ExcelUtil.getTestData(SHEET, "TC30_CancelClosesEditPopup");
test(`${d30.TestID} - ${d30.Description}`, async ({ page }) => {
    Allure.attachDetails(d30.Description, d30.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.clickFirstEditIcon();
    await role.verifyEditPopupVisible();
    await role.clickCancelInPopup();
    await role.verifyPopupClosed();
    await home.logout();
});

// ── TC31: Verify Close (X) closes edit popup ──────────────────────────────────
const d31 = ExcelUtil.getTestData(SHEET, "TC31_CloseXClosesEditPopup");
test(`${d31.TestID} - ${d31.Description}`, async ({ page }) => {
    Allure.attachDetails(d31.Description, d31.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.clickFirstEditIcon();
    await role.verifyEditPopupVisible();
    await role.clickCloseInPopup();
    await role.verifyPopupClosed();
    await home.logout();
});

// ── TC32: Verify empty description validation ─────────────────────────────────
const d32 = ExcelUtil.getTestData(SHEET, "TC32_EmptyDescriptionValidation");
test(`${d32.TestID} - ${d32.Description}`, async ({ page }) => {
    Allure.attachDetails(d32.Description, d32.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    try {
        await role.navigateToRoleManagement();
        await role.clickFirstEditIcon();
        await role.verifyEditPopupVisible();
        await role.updateDescription("");
        await role.clickUpdate();
        await role.verifyValidationMessageVisible();
    } finally {
        const cancelBtn = page.locator(RolePage.CANCEL_BUTTON).first();
        if (await cancelBtn.isVisible().catch(() => false)) {
            await role.clickCancelInPopup().catch(() => {});
            await role.verifyPopupClosed().catch(() => {});
        }
        await home.logout();
    }
});

// ── TC33: Verify spaces-only description validation ───────────────────────────
const d33 = ExcelUtil.getTestData(SHEET, "TC33_SpacesDescriptionValidation");
test(`${d33.TestID} - ${d33.Description}`, async ({ page }) => {
    Allure.attachDetails(d33.Description, d33.Issue);
    // Description_Input column has "      " (spaces) in the Excel sheet
    const spacesDesc = d33.Description_Input || "      ";
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    try {
        await role.navigateToRoleManagement();
        await role.clickFirstEditIcon();
        await role.verifyEditPopupVisible();
        await role.updateDescription(spacesDesc);
        await role.clickUpdate();
        await role.verifyValidationMessageVisible();
    } finally {
        const cancelBtn = page.locator(RolePage.CANCEL_BUTTON).first();
        if (await cancelBtn.isVisible().catch(() => false)) {
            await role.clickCancelInPopup().catch(() => {});
            await role.verifyPopupClosed().catch(() => {});
        }
        await home.logout();
    }
});

// ═════════════════════════════════════════════════════════════════════════════
// DELETE ROLE TESTS — TC34–TC38
// ═════════════════════════════════════════════════════════════════════════════

// ── TC34: Verify delete popup displayed ───────────────────────────────────────
const d34 = ExcelUtil.getTestData(SHEET, "TC34_DeletePopupVisible");
test(`${d34.TestID} - ${d34.Description}`, async ({ page }) => {
    Allure.attachDetails(d34.Description, d34.Issue);
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    await role.navigateToRoleManagement();
    await role.clickFirstDeleteIcon();
    await role.verifyDeletePopupVisible();
    await role.cancelDelete();
    await home.logout();
});

// ── TC35: Verify cancel delete ────────────────────────────────────────────────
const d35 = ExcelUtil.getTestData(SHEET, "TC35_CancelDeletePreservesRole");
test(`${d35.TestID} - ${d35.Description}`, async ({ page }) => {
    Allure.attachDetails(d35.Description, d35.Issue);
    const roleName = uniqueRoleName(val(d35.RoleName, RoleManagementConstants.DELETE_PREFIX));
    const description = val(d35.Description_Input, "Automation Role Description");
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    try {
        await role.navigateToRoleManagement();
        await role.createRole(roleName, description);
        await role.navigateToRoleManagement();
        await role.searchRole(roleName);
        await role.clickDeleteIcon(roleName);
        await role.verifyDeletePopupVisible();
        await role.cancelDelete();
        await role.searchRole(roleName);
        await role.verifyRoleExists(roleName);
    } finally {
        await cleanUpRole(role, page, roleName);
        await home.logout();
    }
});

// ── TC36: Verify confirm delete ───────────────────────────────────────────────
const d36 = ExcelUtil.getTestData(SHEET, "TC36_ConfirmDeleteSuccess");
test(`${d36.TestID} - ${d36.Description}`, async ({ page }) => {
    Allure.attachDetails(d36.Description, d36.Issue);
    const roleName = uniqueRoleName(val(d36.RoleName, RoleManagementConstants.DELETE_PREFIX));
    const description = val(d36.Description_Input, "Automation Role Description");
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    try {
        await role.navigateToRoleManagement();
        await role.createRole(roleName, description);
        await role.navigateToRoleManagement();
        await role.searchRole(roleName);
        await role.clickDeleteIcon(roleName);
        await role.verifyDeletePopupVisible();
        await role.confirmDelete();
    } finally {
        await cleanUpRole(role, page, roleName);
        await home.logout();
    }
});

// ── TC37: Verify deleted role removed from listing ────────────────────────────
const d37 = ExcelUtil.getTestData(SHEET, "TC37_DeletedRoleNotInListing");
test(`${d37.TestID} - ${d37.Description}`, async ({ page }) => {
    Allure.attachDetails(d37.Description, d37.Issue);
    const roleName = uniqueRoleName(val(d37.RoleName, RoleManagementConstants.DELETE_PREFIX));
    const description = val(d37.Description_Input, "Automation Role Description");
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    try {
        await role.navigateToRoleManagement();
        await role.createRole(roleName, description);
        await role.navigateToRoleManagement();
        await role.searchRole(roleName);
        await role.clickDeleteIcon(roleName);
        await role.verifyDeletePopupVisible();
        await role.confirmDelete();
        await role.searchRole(roleName);
        await role.verifyRoleNotExists(roleName);
    } finally {
        await cleanUpRole(role, page, roleName);
        await home.logout();
    }
});

// ── TC38: Verify success message displayed after deletion ─────────────────────
const d38 = ExcelUtil.getTestData(SHEET, "TC38_DeleteSuccessMessage");
test(`${d38.TestID} - ${d38.Description}`, async ({ page }) => {
    Allure.attachDetails(d38.Description, d38.Issue);
    const roleName = uniqueRoleName(val(d38.RoleName, RoleManagementConstants.DELETE_PREFIX));
    const description = val(d38.Description_Input, "Automation Role Description");
    const home = new HomeSteps(page);
    const role = new RoleManagementSteps(page);
    await loginAsAdmin(home);
    try {
        await role.navigateToRoleManagement();
        await role.createRole(roleName, description);
        await role.navigateToRoleManagement();
        await role.searchRole(roleName);
        await role.clickDeleteIcon(roleName);
        await role.verifyDeletePopupVisible();
        await role.confirmDelete();
        await role.verifyDeleteSuccessMessage();
    } finally {
        await cleanUpRole(role, page, roleName);
        await home.logout();
    }
});
