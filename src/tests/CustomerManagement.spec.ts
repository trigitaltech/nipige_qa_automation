import HomeSteps from "@uiSteps/HomeSteps";
import CustomerManagementSteps from "@uiSteps/CustomerManagementSteps";
import { test as base } from "@base-test";
import { Page } from "@playwright/test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "CustomerManagement";

// Tenant account for this scope. The CustomerManagement sheet carries customer data, not
// credentials, so login reuses the framework's existing HomeSteps with these values. Same account as
// LoginTest's TC01, kept here as scoped constants so this feature does not depend on any LoginTest case.
const TENANT = { userName: "freshcart@gmail.com", password: "Welcome@123", persona: "tenant" };

/**
 * LOG IN ONCE PER WORKER. This app stores auth in sessionStorage (not cookies/localStorage), so a
 * session cannot be restored via storageState — but sessionStorage DOES persist within a single
 * browser context. Keeping one authenticated context/page alive for the whole worker means every
 * test reuses that session, so we log in exactly once and never trigger the demo backend's
 * rapid-repeat-login throttle. A fixed large viewport keeps the full sidebar expanded (no collapse).
 */
const test = base.extend<{ tenantPage: Page }, { workerTenantPage: Page }>({
    workerTenantPage: [async ({ browser }, use) => {
        const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
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

// The authenticated page lives in a worker-managed context, so Playwright's automatic on-failure
// screenshot does not cover it — re-attach one here so failures remain debuggable.
test.afterEach(async ({ tenantPage }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        const screenshot = await tenantPage.screenshot({ fullPage: true }).catch(() => null);
        if (screenshot) {
            await testInfo.attach("failure-screenshot", { body: screenshot, contentType: "image/png" });
        }
    }
});

// One login per worker removes the throttle, so a single retry is ample as a transient safety net.
// Scoped to THIS spec only — the global RETRIES setting and other suites (e.g. LoginTest) are unaffected.
test.describe.configure({ retries: 1 });

/**
 * Open the Customer Admin page from an already-authenticated session. Each test starts from a fresh
 * /home load (session persists in the shared context) and then navigates via the menu, which remounts
 * the Customer 360° search in its default state.
 */
async function openCustomerAdmin(page: Page): Promise<CustomerManagementSteps> {
    const customer = new CustomerManagementSteps(page);
    await page.goto(process.env.BASE_URL + "home");
    await customer.navigateToCustomerAdmin();
    return customer;
}

/** Generic POSITIVE search-by-<type> flow: search and verify the opened customer profile. */
async function runPositiveSearch(page: Page, data): Promise<void> {
    const customer = await openCustomerAdmin(page);
    await customer.searchCustomer(data.SearchType, data.SearchValue);
    await customer.verifyCustomerProfile(data.CustomerName, data.CustomerID, data.Email);
}

/** Generic NEGATIVE search-by-<type> flow: search an invalid value and verify no customer is found. */
async function runNegativeSearch(page: Page, data): Promise<void> {
    const customer = await openCustomerAdmin(page);
    await customer.searchCustomerExpectingNoResult(data.SearchType, data.SearchValue);
    await customer.verifyInvalidCustomerSearch();
}

// Every search type is exercised positive + negative through the SAME generic engine (Phone,
// Customer ID, Email, Order ID, Ticket ID). Data — search type, value and expected customer — is
// driven entirely from the CustomerManagement sheet; nothing is hard-coded here.
const POSITIVE_TESTS = [
    "TC01_SearchCustomerByPhone",
    "TC03_SearchCustomerByCustomerID",
    "TC05_SearchCustomerByEmail",
    "TC07_SearchCustomerByOrderID",
    "TC09_SearchCustomerByTicketId",
];

const NEGATIVE_TESTS = [
    "TC02_SearchCustomerByInvalidPhone",
    "TC04_SearchCustomerByInvalidCustomerID",
    "TC06_SearchCustomerByInvalidEmail",
    "TC08_SearchCustomerByInvalidOrderID",
    "TC10_SearchCustomerByInvalidTicketId",
];

for (const testId of POSITIVE_TESTS) {
    const data = ExcelUtil.getTestData(SHEET, testId);
    test(`${data.TestID} - ${data.Description}`, async ({ tenantPage }) => {
        Allure.attachDetails(data.Description, data.Issue);
        await runPositiveSearch(tenantPage, data);
    });
}

for (const testId of NEGATIVE_TESTS) {
    const data = ExcelUtil.getTestData(SHEET, testId);
    test(`${data.TestID} - ${data.Description}`, async ({ tenantPage }) => {
        Allure.attachDetails(data.Description, data.Issue);
        await runNegativeSearch(tenantPage, data);
    });
}

// ============================================================================================
// Orders Tab Validation — opens a customer that has orders (driven from the sheet) and validates
// the Orders tab: selection, columns, filters, status options, first-row data, and View details.
// ============================================================================================
test.describe("Orders Tab Validation", () => {
    const ordersData = ExcelUtil.getTestData(SHEET, "TC11_VerifyOrdersTab");
    test(`${ordersData.TestID} - ${ordersData.Description}`, async ({ tenantPage }) => {
        Allure.attachDetails(ordersData.Description, ordersData.Issue);
        const customer = await openCustomerAdmin(tenantPage);
        // Open a customer that has orders (search value from the sheet).
        await customer.searchCustomer(ordersData.SearchType, ordersData.SearchValue);

        // Phase 1 - Orders tab + table columns
        await customer.verifyOrdersTabSelected();
        await customer.verifyOrdersTableColumns();
        // Phase 2 - Order filters
        await customer.verifyOrderFilters();
        // Phase 3 - Status filter options
        await customer.verifyOrderStatusFilter();
        // Phase 4 - Grid validation (first row)
        await customer.verifyFirstOrderRow();
        // Phase 5 - View order details and return
        await customer.viewFirstOrderDetails();
    });
});

// ============================================================================================
// Address Management Tab Validation — opens a customer that has addresses (driven from the sheet),
// opens the Address Management tab and validates the cards, fields and badge-vs-card count.
// ============================================================================================
test.describe("Address Management Tab Validation", () => {
    const addressData = ExcelUtil.getTestData(SHEET, "TC12_VerifyAddressManagementTab");
    test(`${addressData.TestID} - ${addressData.Description}`, async ({ tenantPage }) => {
        Allure.attachDetails(addressData.Description, addressData.Issue);
        const customer = await openCustomerAdmin(tenantPage);
        // Open a customer that has addresses (search value from the sheet); searchCustomer pauses
        // to observe the profile after it opens.
        await customer.searchCustomer(addressData.SearchType, addressData.SearchValue);
        // Open the Address Management tab (pauses to observe after opening).
        await customer.openAddressManagementTab();
        // Validate the Address Management tab (pauses to observe after validation completes).
        await customer.verifyAddressManagement();
    });
});

// ============================================================================================
// Service Requests Tab Validation — opens a customer profile, opens the Service Requests tab and
// validates the tab/filters/statistics/table; handles BOTH records-present and no-records states.
// ============================================================================================
test.describe("Service Requests Tab Validation", () => {
    const srData = ExcelUtil.getTestData(SHEET, "TC13_VerifyServiceRequestsTab");
    test(`${srData.TestID} - ${srData.Description}`, async ({ tenantPage }) => {
        Allure.attachDetails(srData.Description, srData.Issue);
        const customer = await openCustomerAdmin(tenantPage);
        // Open a customer profile (search value from the sheet); searchCustomer pauses to observe.
        await customer.searchCustomer(srData.SearchType, srData.SearchValue);
        // Open the Service Requests tab (pauses to observe after opening).
        await customer.openServiceRequestsTab();
        // Validate the Service Requests tab (pauses to observe after validation completes).
        await customer.verifyServiceRequests();
    });
});
