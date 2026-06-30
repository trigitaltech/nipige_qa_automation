import test, { Page } from "@playwright/test";
import HomeSteps from "@uiSteps/HomeSteps";
import CustomerReportSuperAdminSteps from "@uiSteps/CustomerReportSuperAdminSteps";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "Customer Report (Super Admin)";
const ADMIN = { email: "nipigev2@yopmail.com", password: "admin@123", persona: "admin" };
const TENANT_USER = { email: "freshcart@gmail.com", password: "Welcome@123", persona: "tenant" };

const baseTest = test.extend<{ adminPage: Page, tenantPage: Page }, { workerAdminPage: Page, workerTenantPage: Page }>({
    workerAdminPage: [async ({ browser }, use) => {
        const context = await browser.newContext({ viewport: null });
        const page = await context.newPage();
        const home = new HomeSteps(page);
        await home.launchApplication();
        
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
    
    workerTenantPage: [async ({ browser }, use) => {
        const context = await browser.newContext({ viewport: null });
        const page = await context.newPage();
        const home = new HomeSteps(page);
        await home.launchApplication();
        
        let retries = 3;
        while (retries > 0) {
            try {
                await home.login(TENANT_USER.email, TENANT_USER.password, TENANT_USER.persona);
                await home.validateLogin(TENANT_USER.email);
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
    tenantPage: async ({ workerTenantPage }, use) => { await use(workerTenantPage); },
});

const ROWS = ExcelUtil.getTestDataArray(SHEET);

baseTest.describe("Customer Report Super Admin Test Suite", () => {
    baseTest.describe.configure({ mode: "serial" });

    if (!ROWS || ROWS.length === 0) {
        baseTest("No Data Found", () => {
            console.log(`No test data found for sheet: ${SHEET}`);
        });
        return;
    }

    for (const data of ROWS) {
        if (data.TC_ID && data.TC_ID.includes("TC_CR_NEG_15")) {
             // Unauthorized access test uses an unauthenticated page
             baseTest(`${data.TC_ID} - ${data.Description}`, async ({ page }) => {
                const steps = new CustomerReportSuperAdminSteps(page);
                await steps.runNegativeTest(data);
            });
        }
        else if (data.TC_ID && data.TC_ID.includes("NEG")) {
            baseTest(`${data.TC_ID} - ${data.Description}`, async ({ adminPage }) => {
                const steps = new CustomerReportSuperAdminSteps(adminPage);
                await steps.runNegativeTest(data);
            });
        } else if (data.TC_ID) {
            baseTest(`${data.TC_ID} - ${data.Description}`, async ({ adminPage }) => {
                const steps = new CustomerReportSuperAdminSteps(adminPage);
                await steps.runPositiveTest(data);
            });
        }
    }
});
