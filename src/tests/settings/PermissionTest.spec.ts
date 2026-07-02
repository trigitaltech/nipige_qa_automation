import HomeSteps from "@uiSteps/HomeSteps";
import PermissionSteps from "@uiSteps/PermissionSteps";
import { test as base } from "@base-test";
import { Page } from "@playwright/test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";
import { getCredential, Role } from "@config/Credentials";

const SHEET = "Permission( Super admin)";

// Admin credentials come from .env (ADMIN_EMAIL/ADMIN_PASSWORD) with the Excel
// "LoginTest" sheet as fallback — never hard-code accounts in specs.
const adminCredential = getCredential(Role.ADMIN);
const ADMIN = { email: adminCredential.email, password: adminCredential.password, persona: "admin" };

const test = base.extend<{ adminPage: Page }, { workerAdminPage: Page }>({
    workerAdminPage: [async ({ browser }, use) => {
        // Use viewport: null to let the window natively maximize to the user's physical screen without cropping
        const context = await browser.newContext({ viewport: null });
        const page = await context.newPage();
        const home = new HomeSteps(page);
        await home.launchApplication();
        
        // Mitigate 429 API rate limits during login
        let retries = 3;
        while (retries > 0) {
            try {
                await home.login(ADMIN.email, ADMIN.password, ADMIN.persona);
                await home.validateLogin(ADMIN.email);
                break;
            } catch (e) {
                retries--;
                if (retries === 0) throw e;
                await page.waitForTimeout(10000);
                await page.reload();
            }
        }
        await use(page);
        await context.close();
    }, { scope: "worker" }],
    adminPage: async ({ workerAdminPage }, use) => { await use(workerAdminPage); },
});

test.afterEach(async ({ adminPage }, testInfo) => {
    await adminPage.unrouteAll({ behavior: "ignoreErrors" }).catch(() => {});
    if (testInfo.status !== testInfo.expectedStatus) {
        const shot = await adminPage.screenshot({ fullPage: true }).catch(() => null);
        if (shot) await testInfo.attach("failure-screenshot", { body: shot, contentType: "image/png" });
    }
});

test.describe.configure({ retries: 1 });

const PERM_ROWS = ExcelUtil.getTestDataArray(SHEET);

test.describe("Permission Super Admin Test Suite", () => {
    const positiveRows = PERM_ROWS.filter((r) => r.Type === "Positive");
    positiveRows.forEach((data) => {
        test(`${data.TC_ID} - ${data.Expected_Result}`, async ({ adminPage }) => {
            Allure.attachDetails(data.Expected_Result, "");
            const perm = new PermissionSteps(adminPage);
            await perm.navigateToPermission();
            await perm.runPositiveTest(data);
        });
    });
});

test.describe("Permission Super Admin - Negative", () => {
    const negativeRows = PERM_ROWS.filter((r) => r.Type === "Negative");
    negativeRows.forEach((data) => {
        test(`${data.TC_ID} - ${data.Expected_Result}`, async ({ adminPage }) => {
            Allure.attachDetails(data.Expected_Result, "");
            const perm = new PermissionSteps(adminPage);
            await perm.navigateToPermission();
            await perm.runNegativeTest(data);
        });
    });
});
