import HomeSteps from "@uiSteps/HomeSteps";
import CustomerManagementSteps from "@uiSteps/CustomerManagementSteps";
import { test as base } from "@base-test";
import { Page } from "@playwright/test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "Customer Management( Tenant)";
const TENANT = { userName: "freshcart@gmail.com", password: "Welcome@123", persona: "tenant" };

const test = base.extend<{ tenantPage: Page }, { workerTenantPage: Page }>({
    workerTenantPage: [async ({ browser }, use) => {
        const context = await browser.newContext({ viewport: null });
        const page = await context.newPage();
        const home = new HomeSteps(page);
        await home.launchApplication();
        await home.login(TENANT.userName, TENANT.password, TENANT.persona);
        await home.validateLogin(TENANT.userName);
        await use(page);
        await context.close();
    }, { scope: "worker" }],
    tenantPage: async ({ workerTenantPage }, use) => {
        await use(workerTenantPage);
    },
});

test.afterEach(async ({ tenantPage }, testInfo) => {
    await tenantPage.unrouteAll({ behavior: 'ignoreErrors' }).catch(() => {});
    if (testInfo.status !== testInfo.expectedStatus) {
        const screenshot = await tenantPage.screenshot({ fullPage: true }).catch(() => null);
        if (screenshot) {
            await testInfo.attach("failure-screenshot", { body: screenshot, contentType: "image/png" });
        }
    }
});

// Single retry is ample as a transient safety net since login throttle is mitigated.
test.describe.configure({ retries: 1 }); // Run sequentially via --workers=1 to avoid race conditions.

async function openCustomerAdmin(page: Page): Promise<CustomerManagementSteps> {
    const customer = new CustomerManagementSteps(page);
    await page.goto(`${process.env.BASE_URL}home`);
    await customer.navigateToCustomerAdmin();
    return customer;
}

const ALL_TESTS = ExcelUtil.getTestDataArray(SHEET);

test.describe("Customer Management - Dashboard", () => {
    test("Verify Listing and dashboard cards load", async ({ tenantPage }) => {
        Allure.attachDetails("Verify dashboard loads", "");
        const sub = await openCustomerAdmin(tenantPage);
        await sub.verifyCustomerDashboard();
    });
});

test.describe("Customer Management Test Suite", () => {
    const positiveTests = ALL_TESTS.filter((r) => r.Type === "Positive");
    positiveTests.forEach((data) => {
        test(`${data.TC_ID} - ${data.Expected_Result}`, async ({ tenantPage }) => {
            Allure.attachDetails(data.Expected_Result, "");
            const customer = await openCustomerAdmin(tenantPage);
            await customer.runPositiveTest(data);
        });
    });
});

test.describe("Customer Management - Negative", () => {
    const negativeTests = ALL_TESTS.filter((r) => r.Type === "Negative");
    negativeTests.forEach((data) => {
        test(`${data.TC_ID} - ${data.Expected_Result}`, async ({ tenantPage }) => {
            Allure.attachDetails(data.Expected_Result, "");
            const customer = await openCustomerAdmin(tenantPage);
            await customer.runNegativeTest(data);
        });
    });
});
