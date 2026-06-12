import HomeSteps from "@uiSteps/HomeSteps";
import NotificationTemplateSteps from "@uiSteps/NotificationTemplateSteps";
import { test as base } from "@base-test";
import { BrowserContext, Page } from "@playwright/test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "NotificationTemplate";

// Tenant account for this module (sessionStorage auth + rapid-login throttle → log in once per worker).
const TENANT = { email: "freshcart@gmail.com", password: "Welcome@123", persona: "tenant" };

/**
 * Execution-view zoom at 80% so the small text is readable while keeping the COMPLETE screen visible.
 * Applied via the CSS `zoom` property in an init script (does not change the viewport, locators, or
 * any behaviour). Scoped to this module's context only — the shared framework zoom is untouched.
 */
async function applyEightyPercentZoom(context: BrowserContext): Promise<void> {
    await context.addInitScript(() => {
        const apply = () => document.documentElement?.style.setProperty("zoom", "0.8");
        apply();
        document.addEventListener("DOMContentLoaded", apply);
    });
}

const test = base.extend<{ tenantPage: Page }, { workerTenantPage: Page }>({
    workerTenantPage: [async ({ browser }, use) => {
        // viewport:null uses the full maximized window (launch config sets --start-maximized) so the
        // complete application screen is visible during execution.
        const context = await browser.newContext({ viewport: null });
        await applyEightyPercentZoom(context);
        const page = await context.newPage();
        const home = new HomeSteps(page);
        await home.launchApplication();
        await home.login(TENANT.email, TENANT.password, TENANT.persona);
        await home.validateLogin(TENANT.email);
        await use(page);
        await context.close();
    }, { scope: "worker" }],
    tenantPage: async ({ workerTenantPage }, use) => { await use(workerTenantPage); },
});

test.afterEach(async ({ tenantPage }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        const shot = await tenantPage.screenshot({ fullPage: true }).catch(() => null);
        if (shot) await testInfo.attach("failure-screenshot", { body: shot, contentType: "image/png" });
    }
});

test.describe.configure({ retries: 1 });

// The sheet keys rows by "TC_ID"; columns include spaces ("Search Type", "Test Data").
const ROWS = ExcelUtil.getTestDataArray(SHEET);
function row(id: string) {
    const found = ROWS.find((r) => r.TC_ID === id);
    if (!found) throw new Error(`TC_ID '${id}' not found on '${SHEET}' sheet`);
    return found;
}

// ---------- Listing page: load + refresh + pagination ----------
test.describe("Notification Template - Listing", () => {
    test("Listing page loads with all controls and columns", async ({ tenantPage }) => {
        const notif = new NotificationTemplateSteps(tenantPage);
        await notif.navigateToNotificationTemplate(); // Communications → Notification Template + guard
        await notif.verifyListingLoaded();
    });

    test("Refresh (Reload) icon reloads the page successfully", async ({ tenantPage }) => {
        const notif = new NotificationTemplateSteps(tenantPage);
        await notif.navigateToNotificationTemplate();
        await notif.verifyRefresh();
    });

    test("Pagination (Previous / Next) works across pages", async ({ tenantPage }) => {
        const notif = new NotificationTemplateSteps(tenantPage);
        await notif.navigateToNotificationTemplate();
        await notif.verifyPagination();
    });
});

// ---------- Search: positive + negative (TC01–TC04, data-driven) ----------
test.describe("Notification Template - Search", () => {
    for (const id of ["TC01", "TC02"]) {
        const data = row(id);
        test(`${data.TC_ID} - Search by ${data["Search Type"]} (Positive): '${data["Test Data"]}'`,
            async ({ tenantPage }) => {
                Allure.attachDetails(`${data.Scenario}: ${data["Test Data"]}`, "");
                const notif = new NotificationTemplateSteps(tenantPage);
                await notif.navigateToNotificationTemplate();
                await notif.verifyPositiveSearch(data.TC_ID, data["Search Type"], data["Test Data"]);
            });
    }
    for (const id of ["TC03", "TC04"]) {
        const data = row(id);
        test(`${data.TC_ID} - Search by ${data["Search Type"]} (Negative): '${data["Test Data"]}'`,
            async ({ tenantPage }) => {
                Allure.attachDetails(`${data.Scenario}: ${data["Test Data"]}`, "");
                const notif = new NotificationTemplateSteps(tenantPage);
                await notif.navigateToNotificationTemplate();
                await notif.verifyNegativeSearch(data.TC_ID, data["Search Type"], data["Test Data"]);
            });
    }
});

// ---------- Create then Delete (TC05 → TC06; delete depends on create) ----------
test.describe.serial("Notification Template - Create & Delete", () => {
    const stamp = Date.now() % 1000000;
    const concern = "PROMOTIONAL"; // existing valid concern (from the create dropdown)
    const subject = `AUTO_TEMPLATE_${stamp}`;
    const body = `Test notification body ${stamp}`; // unique so the created template is searchable/deletable
    const fromName = "Automation User";
    const fromEmail = `auto_${stamp}@mailinator.com`;

    test(`TC05 - Create Notification Template and verify it is listed`, async ({ tenantPage }) => {
        Allure.attachDetails(`Create template ${subject}`, "");
        const notif = new NotificationTemplateSteps(tenantPage);
        await notif.navigateToNotificationTemplate();
        await notif.createEmailTemplate(concern, subject, body, fromName, fromEmail);
        await notif.verifyTemplateInListing(concern, body);
    });

    test(`TC06 - Delete the created template and verify it is removed`, async ({ tenantPage }) => {
        Allure.attachDetails(`Delete template ${subject}`, "");
        const notif = new NotificationTemplateSteps(tenantPage);
        await notif.navigateToNotificationTemplate();
        await notif.deleteTemplate(body);
        await notif.verifyTemplateDeleted(body);
    });
});
