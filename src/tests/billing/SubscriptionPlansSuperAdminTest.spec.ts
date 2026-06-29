import test, { Page } from "@playwright/test";
import HomeSteps from "@uiSteps/HomeSteps";
import SubscriptionPlansSuperAdminSteps from "@uiSteps/SubscriptionPlansSuperAdminSteps";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "Subscription plans( Super admin";
const ADMIN = { email: "nipigev2@yopmail.com", password: "admin@123", persona: "admin" };

const baseTest = test.extend<{ adminPage: Page }, { workerAdminPage: Page }>({
    workerAdminPage: [async ({ browser }, use) => {
        // Use viewport: null to maximize to native screen layout
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
    adminPage: async ({ workerAdminPage }, use) => { await use(workerAdminPage); },
});

const ROWS = ExcelUtil.getTestDataArray(SHEET);

baseTest.describe("Subscription Plans Super Admin Test Suite", () => {
    baseTest.describe.configure({ mode: "serial" });

    if (!ROWS || ROWS.length === 0) {
        baseTest("No Data Found", () => {
            console.log(`No test data found for sheet: ${SHEET}`);
        });
        return;
    }

    for (const data of ROWS) {
        if (data.TC_ID && data.TC_ID.includes("NEG")) {
            baseTest(`${data.TC_ID} - ${data.Scenario}`, async ({ adminPage }) => {
                const steps = new SubscriptionPlansSuperAdminSteps(adminPage);
                await steps.navigateToSubscriptionPlans();
                await steps.runNegativeTest(data);
            });
        } else if (data.TC_ID) {
            baseTest(`${data.TC_ID} - ${data.Scenario}`, async ({ adminPage }) => {
                const steps = new SubscriptionPlansSuperAdminSteps(adminPage);
                await steps.navigateToSubscriptionPlans();
                await steps.runPositiveTest(data);
            });
        }
    }
});
