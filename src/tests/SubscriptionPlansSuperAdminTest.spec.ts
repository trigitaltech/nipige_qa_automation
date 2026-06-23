import HomeSteps from "@uiSteps/HomeSteps";
import SubscriptionPlansSuperAdminSteps from "@uiSteps/SubscriptionPlansSuperAdminSteps";
import SubscriptionPlansSuperAdminConstants from "@uiConstants/SubscriptionPlansSuperAdminConstants";
import { test as base } from "@base-test";
import { BrowserContext, Page } from "@playwright/test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "Subscription Plan(Super admin)";

const ADMIN = { email: "nipigev2@yopmail.com", password: "admin@123", persona: "admin" };

async function applyEightyPercentZoom(context: BrowserContext): Promise<void> {
    await context.addInitScript(() => {
        const apply = () => document.documentElement?.style.setProperty("zoom", "0.8");
        apply();
        document.addEventListener("DOMContentLoaded", apply);
    });
}

const test = base.extend<{ adminPage: Page }, { workerAdminPage: Page }>({
    workerAdminPage: [async ({ browser }, use) => {
        const context = await browser.newContext({ viewport: null });
        await applyEightyPercentZoom(context);
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

const ROWS = ExcelUtil.getTestDataArray(SHEET);
function row(id: string) {
    const found = ROWS.find((r) => r.TC_ID === id);
    if (!found) throw new Error(`TC_ID '${id}' not found on '${SHEET}' sheet`);
    return found;
}

test.describe("Subscription Plans - Super Admin", () => {
    test.describe.configure({ mode: "serial", retries: 0 });
    let createdPlanName = "";

    test("TC01 - Listing Page Validation", async ({ adminPage }) => {
        const data = row("TC01");
        Allure.attachDetails(`${data.Module}: ${data.Scenario}`, "");
        const sub = new SubscriptionPlansSuperAdminSteps(adminPage);
        await sub.navigateToSubscriptionPlans();
        await sub.verifyListingPage();
    });

    test("TC02 - Search by Plan Name (Positive)", async ({ adminPage }) => {
        const data = row("TC02");
        const sub = new SubscriptionPlansSuperAdminSteps(adminPage);
        await sub.navigateToSubscriptionPlans();
        await sub.verifySearchByPlanName(data["Test Data"], SubscriptionPlansSuperAdminConstants.GOLDEN_PLAN);
    });

    test("TC03 - Search by Plan Name (Negative)", async ({ adminPage }) => {
        const data = row("TC03");
        const sub = new SubscriptionPlansSuperAdminSteps(adminPage);
        await sub.navigateToSubscriptionPlans();
        await sub.verifyNegativeSearch(data["Test Data"]);
    });

    test("TC04 - Search by Description (Positive)", async ({ adminPage }) => {
        const data = row("TC04");
        const sub = new SubscriptionPlansSuperAdminSteps(adminPage);
        await sub.navigateToSubscriptionPlans();
        await sub.verifySearchByDescription(data["Test Data"], SubscriptionPlansSuperAdminConstants.GOLDEN_PLAN);
    });

    test("TC05 - Search by Description (Negative)", async ({ adminPage }) => {
        const data = row("TC05");
        const sub = new SubscriptionPlansSuperAdminSteps(adminPage);
        await sub.navigateToSubscriptionPlans();
        await sub.verifyNegativeSearch(data["Test Data"]);
    });

    test("TC06 - Create Subscription Plan", async ({ adminPage }) => {
        const data = row("TC06");
        createdPlanName = `AUTO_PLAN_${Date.now()}`;
        Allure.attachDetails(`Create subscription plan ${createdPlanName}`, "");
        const sub = new SubscriptionPlansSuperAdminSteps(adminPage);
        await sub.navigateToSubscriptionPlans();
        await sub.createPlan(createdPlanName, String(data["Plan Amount"]), data.Description);
        await sub.verifyPlanListed(createdPlanName, data.Description);
    });

    test("TC07 - Delete Created Plan", async ({ adminPage }) => {
        const sub = new SubscriptionPlansSuperAdminSteps(adminPage);
        await sub.navigateToSubscriptionPlans();
        await sub.deletePlan(createdPlanName);
        await sub.verifyPlanDeleted(createdPlanName);
    });

    test("TC08 - Edit Existing Plan", async ({ adminPage }) => {
        const data = row("TC08");
        const updatedDescription = data.Description
            || SubscriptionPlansSuperAdminConstants.UPDATED_GOLDEN_DESCRIPTION;
        const sub = new SubscriptionPlansSuperAdminSteps(adminPage);
        await sub.navigateToSubscriptionPlans();
        await sub.editGoldenPlan(updatedDescription);
        await sub.verifyGoldenPlanDescription(updatedDescription);
    });

    test("TC09 - Scope Dropdown Validation", async ({ adminPage }) => {
        const sub = new SubscriptionPlansSuperAdminSteps(adminPage);
        await sub.navigateToSubscriptionPlans();
        await sub.verifyScopeDropdown();
    });
});
