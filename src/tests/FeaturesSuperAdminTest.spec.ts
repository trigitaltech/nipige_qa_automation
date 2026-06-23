import HomeSteps from "@uiSteps/HomeSteps";
import FeaturesSuperAdminSteps from "@uiSteps/FeaturesSuperAdminSteps";
import FeaturesSuperAdminConstants from "@uiConstants/FeaturesSuperAdminConstants";
import { test as base } from "@base-test";
import { BrowserContext, Page } from "@playwright/test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "FeaturesSuperAdminTest";

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

test.describe("Features - Super Admin", () => {
    test.describe.configure({ mode: "serial", retries: 0 });
    let createdTaFeatureName = "";
    let createdPartnerFeatureName = "";

    test("TC01 - Verify Features landing page loads successfully", async ({ adminPage }) => {
        const data = row("TC01");
        Allure.attachDetails(`${data.Module}: ${data.Scenario}`, "");
        const features = new FeaturesSuperAdminSteps(adminPage);
        await features.navigateToFeatures();
        await features.verifyLandingPage();
    });

    test("TC02 - Positive Search by Feature Name", async ({ adminPage }) => {
        const data = row("TC02");
        const features = new FeaturesSuperAdminSteps(adminPage);
        await features.navigateToFeatures();
        await features.verifySearchByFeatureName(data.SearchValue, FeaturesSuperAdminConstants.STOCK_POINTS);
    });

    test("TC03 - Negative Search by Feature Name", async ({ adminPage }) => {
        const data = row("TC03");
        const features = new FeaturesSuperAdminSteps(adminPage);
        await features.navigateToFeatures();
        await features.verifyNegativeSearch(data.SearchValue, FeaturesSuperAdminConstants.FEATURE_NOT_AVAILABLE);
    });

    test("TC04 - Positive Search by Description", async ({ adminPage }) => {
        const data = row("TC04");
        const features = new FeaturesSuperAdminSteps(adminPage);
        await features.navigateToFeatures();
        await features.verifySearchByDescription(data.SearchValue, FeaturesSuperAdminConstants.STOCK_POINTS);
    });

    test("TC05 - Negative Search by Description", async ({ adminPage }) => {
        const data = row("TC05");
        const features = new FeaturesSuperAdminSteps(adminPage);
        await features.navigateToFeatures();
        await features.verifyNegativeSearch(data.SearchValue, FeaturesSuperAdminConstants.FEATURE_DOES_NOT_EXIST);
    });

    test("TC06 - Create Feature (TA Scope)", async ({ adminPage }) => {
        const data = row("TC06");
        createdTaFeatureName = `${data.FeatureName}_${Date.now()}`;
        Allure.attachDetails(`Create TA Feature ${createdTaFeatureName}`, "");
        const features = new FeaturesSuperAdminSteps(adminPage);
        await features.navigateToFeatures();
        await features.createFeature(
            createdTaFeatureName,
            data.Description,
            "TA",
            data.Permission,
            data.MenuItem,
            true,
        );
    });

    test("TC07 - Create Feature (PARTNER Scope)", async ({ adminPage }) => {
        const data = row("TC07");
        createdPartnerFeatureName = `${data.FeatureName}_${Date.now()}`;
        Allure.attachDetails(`Create PARTNER Feature ${createdPartnerFeatureName}`, "");
        const features = new FeaturesSuperAdminSteps(adminPage);
        await features.navigateToFeatures();
        await features.createFeature(
            createdPartnerFeatureName,
            data.Description,
            "PARTNER",
            data.Permission,
            data.MenuItem,
            false,
            true,
        );
    });

    test("TC08 - View Existing Feature", async ({ adminPage }) => {
        const data = row("TC08");
        const features = new FeaturesSuperAdminSteps(adminPage);
        await features.navigateToFeatures();
        await features.viewExistingFeature(data.SearchValue);
    });

    test("TC09 - Edit Existing Feature", async ({ adminPage }) => {
        const data = row("TC09");
        const features = new FeaturesSuperAdminSteps(adminPage);
        await features.navigateToFeatures();
        await features.editExistingFeature(data.SearchValue, FeaturesSuperAdminConstants.STOCK_POINTS_DESCRIPTION);
    });

    test("TC10 - Delete Created Feature", async ({ adminPage }) => {
        const features = new FeaturesSuperAdminSteps(adminPage);
        await features.navigateToFeatures();
        await features.deleteFeature(createdPartnerFeatureName);
        await features.verifyFeatureDeleted(createdPartnerFeatureName);
    });

    test("TC11 - Refresh & Pagination", async ({ adminPage }) => {
        const features = new FeaturesSuperAdminSteps(adminPage);
        await features.navigateToFeatures();
        await features.verifyRefreshAndPagination();
    });
});
