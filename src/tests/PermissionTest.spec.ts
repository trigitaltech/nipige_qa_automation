import HomeSteps from "@uiSteps/HomeSteps";
import PermissionSteps from "@uiSteps/PermissionSteps";
import { test as base, applyExecutionZoom } from "@base-test";
import { Page } from "@playwright/test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "Permission";

// Admin account for this module (separate from the tenant modules). The app stores auth in
// sessionStorage and throttles rapid repeat logins, so the session is kept alive once per worker.
const ADMIN = { email: "nipigev2@yopmail.com", password: "admin@123", persona: "admin" };

const test = base.extend<{ adminPage: Page }, { workerAdminPage: Page }>({
    workerAdminPage: [async ({ browser }, use) => {
        // viewport:null uses the full maximized window (launch config sets --start-maximized) so the
        // complete application screen is visible during execution and recording.
        const context = await browser.newContext({ viewport: null });
        await applyExecutionZoom(context);
        const page = await context.newPage();
        const home = new HomeSteps(page);
        await home.launchApplication();
        await home.login(ADMIN.email, ADMIN.password, ADMIN.persona);
        await home.validateLogin(ADMIN.email);
        await use(page);
        await context.close();
    }, { scope: "worker" }],
    adminPage: async ({ workerAdminPage }, use) => { await use(workerAdminPage); },
});

test.afterEach(async ({ adminPage }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        const shot = await adminPage.screenshot({ fullPage: true }).catch(() => null);
        if (shot) await testInfo.attach("failure-screenshot", { body: shot, contentType: "image/png" });
    }
});

test.describe.configure({ retries: 1 });

// The Permission sheet keys rows by "TC_ID"; read the array and match on it (no framework change).
const PERM_ROWS = ExcelUtil.getTestDataArray(SHEET);
function row(id: string) {
    const found = PERM_ROWS.find((r) => r.TC_ID === id);
    if (!found) throw new Error(`TC_ID '${id}' not found on '${SHEET}' sheet`);
    return found;
}

// ---------- 1. Listing page validation + pagination ----------
test.describe("Permission - Listing", () => {
    test("Permission listing loads with all controls and columns", async ({ adminPage }) => {
        const perm = new PermissionSteps(adminPage);
        await perm.navigateToPermission(); // Configurations → Permission (+ mandatory module guard)
        await perm.verifyListingLoaded();
    });

    test("Pagination (Previous / Next) works", async ({ adminPage }) => {
        const perm = new PermissionSteps(adminPage);
        await perm.navigateToPermission();
        await perm.verifyPagination();
    });
});

// ---------- 2a. Positive search (TC01–TC05) — 2 by Resource URL, 3 by Permission Name ----------
test.describe("Permission - Positive Search", () => {
    for (const id of ["TC01", "TC02", "TC03", "TC04", "TC05"]) {
        const data = row(id);
        test(`${data.TC_ID} - ${data.Method} search '${data.Permission_Name}' (by ${data.Search_By})`,
            async ({ adminPage }) => {
                Allure.attachDetails(`Positive: ${data.Permission_Name} (${data.Method})`, "");
                const perm = new PermissionSteps(adminPage);
                await perm.navigateToPermission();
                await perm.verifyPositiveSearch(data);
            });
    }
});

// ---------- 2b. Negative search (TC06–TC10) — invalid values, no record + red FAILED banner ----------
test.describe("Permission - Negative Search", () => {
    for (const id of ["TC06", "TC07", "TC08", "TC09", "TC10"]) {
        const data = row(id);
        test(`${data.TC_ID} - invalid ${data.Method} search returns no record`, async ({ adminPage }) => {
            Allure.attachDetails(`Negative: ${data.Search_Value}`, "");
            const perm = new PermissionSteps(adminPage);
            await perm.navigateToPermission();
            await perm.verifyNegativeSearch(data);
        });
    }
});

// ---------- 3 & 4. Create then Delete a permission (random values; delete depends on create) ----------
test.describe.serial("Permission - Create & Delete", () => {
    const stamp = Date.now() % 1000000;
    const createdName = `AUTO_PERM_${stamp}`;
    const createdUrl = `/api/automation/test/${stamp}`;
    const createdMethod = "POST";

    test(`TC11 - Create a new permission and verify it is listed`, async ({ adminPage }) => {
        Allure.attachDetails(`Create permission ${createdName}`, "");
        const perm = new PermissionSteps(adminPage);
        await perm.navigateToPermission();
        await perm.createPermission(createdName, createdMethod, createdUrl);
        await perm.verifyPermissionInListing(createdName, createdMethod, createdUrl);
    });

    test(`TC12 - Delete the created permission and verify it is removed`, async ({ adminPage }) => {
        Allure.attachDetails(`Delete permission ${createdName}`, "");
        const perm = new PermissionSteps(adminPage);
        await perm.navigateToPermission();
        await perm.deletePermission(createdName);
        await perm.verifyPermissionDeleted(createdName);
    });
});

// ---------- TC13. Edit a permission and verify the updated values (self-isolated record) ----------
test.describe("Permission - Edit", () => {
    test(`TC13 - Edit existing permission and verify updated values`, async ({ adminPage }) => {
        const stamp = Date.now() % 1000000;
        const name = `AUTO_PERM_${stamp}`;
        const url = `/api/automation/test/${stamp}`;
        const updatedName = `AUTO_PERM_EDIT_${stamp}`;
        const updatedUrl = `/api/automation/edit/${stamp}`;
        Allure.attachDetails(`Edit permission ${name} -> ${updatedName}`, "");

        const perm = new PermissionSteps(adminPage);
        await perm.navigateToPermission();
        // Create a unique permission for isolation, then edit it.
        await perm.createPermission(name, "POST", url);
        await perm.openEditModal(name);
        // Verify the modal is fully preloaded (Permission Name, Method, Resource URL) before editing.
        await perm.verifyEditModalPreloaded(name, "POST", url);
        // Update Permission Name and Resource URL; keep Method unchanged.
        await perm.updatePermissionTo(updatedName, updatedUrl);
        // Search the updated name and verify the new values are in the grid; re-search for persistence.
        await perm.verifyUpdatedInGrid(updatedName, "POST", updatedUrl);
    });
});
