import HomeSteps from "@uiSteps/HomeSteps";
import SubscriptionPlanSteps from "@uiSteps/SubscriptionPlanSteps";
import SubscriptionPlanPage from "@pages/SubscriptionPlanPage";
import { test as base, applyExecutionZoom } from "@base-test";
import { Page } from "@playwright/test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "Subscription Plan( Tenant)";

// Tenant account for this module
const TENANT = { userName: "freshcart@gmail.com", password: "Welcome@123", persona: "tenant" };

const test = base.extend<{ tenantPage: Page }, { workerTenantPage: Page }>({
    workerTenantPage: [async ({ browser }, use) => {
        const context = await browser.newContext({ viewport: null });
        await applyExecutionZoom(context);
        const page = await context.newPage();
        const home = new HomeSteps(page);
        await home.launchApplication();
        await home.login(TENANT.userName, TENANT.password, TENANT.persona);
        await home.validateLogin(TENANT.userName);
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

test.describe.configure({ retries: 1, mode: 'serial' });

const SUB_ROWS = ExcelUtil.getTestDataArray(SHEET);
function row(id: string) {
    const found = SUB_ROWS.find((r) => r.TC_ID === id);
    if (!found) throw new Error(`TC_ID '${id}' not found on '${SHEET}' sheet`);
    return found;
}

const REFERENCE_PLAN = `RefPlan_${Date.now()}`;

test.describe("Subscription Plan - Module", () => {
    test("Listing, dashboard cards and create form load", async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.verifyListingLoaded();
        await sub.verifyDashboardCards();
        await sub.openCreatePlanForm();
    });
});

test.describe("Subscription Plan - Positive", () => {
    test(`TC_SP_01 - ${row("TC_SP_01").Expected_Result}`, async ({ tenantPage }) => {
        Allure.attachDetails("Create subscription plan", "");
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.fillCreatePlanForm(row("TC_SP_01"));
        await sub.submitCreatePlan();
        await sub.verifyPlanCreated();
    });

    test(`TC_SP_02 - ${row("TC_SP_02").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.selectAndVerifyCombobox("Scope", row("TC_SP_02").Scope);
        await sub.selectAndVerifyCombobox("Org Access", row("TC_SP_02").Org_Access);
        await sub.selectAndVerifyCombobox("Payment Type", row("TC_SP_02").Payment_Type);
        await sub.selectAndVerifyCombobox("Cadence Type", row("TC_SP_02").Cadence);
    });

    test(`TC_SP_03 - ${row("TC_SP_03").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyPriceAcceptsDecimal(String(row("TC_SP_03").Price));
    });

    test(`TC_SP_04 - ${row("TC_SP_04").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.toggleAutoRenewalAndVerify();
    });

    test(`TC_SP_05 - ${row("TC_SP_05").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.addFeaturesAndVerify(row("TC_SP_05"), 2);
    });

    test(`TC_SP_06 - ${row("TC_SP_06").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyPlanPreviewUpdates(`${row("TC_SP_06").Plan_Name}_${Date.now() % 100000}`, row("TC_SP_06").Scope);
    });

    test(`TC_SP_07 - ${row("TC_SP_07").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.fillCreatePlanForm(row("TC_SP_07"));
        await sub.submitCreatePlan();
        await sub.verifyRedirectToListing();
    });

    test(`TC_SP_08 - ${row("TC_SP_08").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.fillCreatePlanForm(row("TC_SP_08"));
        await sub.submitCreatePlan();
        await sub.verifyPlanCreated();
    });

    test(`TC_SP_09 - ${row("TC_SP_09").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.ensurePlanExists(REFERENCE_PLAN);
        await sub.navigateToSubscriptionPlans();
        await sub.searchAndVerifyContent(REFERENCE_PLAN, `${REFERENCE_PLAN} description`);
    });

    test(`TC_SP_10 - ${row("TC_SP_10").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.filterScopeAndVerifyAllRows("Partner", "PARTNER");
    });

    test(`TC_SP_11 - ${row("TC_SP_11").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.fillCreatePlanForm(row("TC_SP_11"));
        await sub.submitCreatePlan();
        await sub.verifyPlanCreated();
        await sub.viewCreatedPlan();
    });

    test(`TC_SP_12 - ${row("TC_SP_12").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.ensurePlanExists(REFERENCE_PLAN);
        await sub.navigateToSubscriptionPlans();
        await sub.verifyEditFormPreloaded(REFERENCE_PLAN);
    });

    test(`TC_SP_13 - ${row("TC_SP_13").Expected_Result}`, async ({ tenantPage }) => {
        const data = row("TC_SP_13");
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.fillCreatePlanForm(data);
        await sub.submitCreatePlan();
        await sub.verifyPlanCreated();
        await sub.updateCreatedPlan(String(data.Price));
    });

    test(`TC_SP_14 - ${row("TC_SP_14").Expected_Result}`, async ({ tenantPage }) => {
        // Redundant with 13 but covering the specific text of TC_SP_14
        const data = row("TC_SP_14");
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.fillCreatePlanForm(data);
        await sub.submitCreatePlan();
        await sub.verifyPlanCreated();
        await sub.updateCreatedPlan("20");
    });

    test(`TC_SP_15 - ${row("TC_SP_15").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.verifyPaginationDefensive();
    });
});

test.describe("Subscription Plan - Negative", () => {
    
    const simpleValFails = ["TC_SP_NEG_01", "TC_SP_NEG_02"];
    for (const id of simpleValFails) {
        const data = row(id);
        test(`${data.TC_ID} - ${data.Expected_Result}`, async ({ tenantPage }) => {
            const sub = new SubscriptionPlanSteps(tenantPage);
            await sub.navigateToSubscriptionPlans();
            await sub.openCreatePlanForm();
            await sub.fillCreatePlanForm(data);
            await sub.submitCreatePlan();
            await sub.verifyValidationError();
        });
    }

    test(`TC_SP_NEG_03 - ${row("TC_SP_NEG_03").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyNumericFieldRejects("Price", String(row("TC_SP_NEG_03").Price));
    });

    test(`TC_SP_NEG_04 - ${row("TC_SP_NEG_04").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        // Negative inputs aren't always typed as letters, so we use validation check
        await sub.fillCreatePlanForm(row("TC_SP_NEG_04"));
        await sub.submitCreatePlan();
        await sub.verifyValidationError();
    });

    test(`TC_SP_NEG_05 - ${row("TC_SP_NEG_05").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyNumericFieldRejects("Validity", String(row("TC_SP_NEG_05").Validity_Days));
    });

    test(`TC_SP_NEG_06 - ${row("TC_SP_NEG_06").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.ensurePlanExists(REFERENCE_PLAN);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.fillCreatePlanForm({ ...row("TC_SP_NEG_06"), Plan_Name: REFERENCE_PLAN, useExactName: true });
        await sub.submitCreatePlan();
        await sub.verifyDuplicateAccepted(REFERENCE_PLAN);
    });

    test(`TC_SP_NEG_07 - ${row("TC_SP_NEG_07").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyLongDescriptionAccepted(2000);
    });

    test(`TC_SP_NEG_08 - ${row("TC_SP_NEG_08").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyInvalidOptionRejected("Tax Code", String(row("TC_SP_NEG_08").Tax_Code),
            SubscriptionPlanPage.TAX_CODE_COMBOBOX);
    });

    test(`TC_SP_NEG_09 - ${row("TC_SP_NEG_09").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyDropdownAlwaysSet("Scope");
    });

    test(`TC_SP_NEG_10 - ${row("TC_SP_NEG_10").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.fillCreatePlanForm(row("TC_SP_NEG_10"));
        await sub.addBlankFeature();
        await sub.submitCreatePlan();
        await sub.verifyValidationError();
    });

    test(`TC_SP_NEG_11 - ${row("TC_SP_NEG_11").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyDropdownAlwaysSet("Currency");
    });

    test(`TC_SP_NEG_12 - ${row("TC_SP_NEG_12").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyInvalidOptionRejected("Cadence Type", String(row("TC_SP_NEG_12").Cadence));
    });

    test(`TC_SP_NEG_13 - ${row("TC_SP_NEG_13").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.fillCreatePlanForm(row("TC_SP_NEG_13"));
        await sub.submitWithApiFailure();
    });

    test(`TC_SP_NEG_14 - ${row("TC_SP_NEG_14").Expected_Result}`, async ({ tenantPage }) => {
        const data = row("TC_SP_NEG_14");
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.fillCreatePlanForm(data);
        await sub.submitCreatePlan();
        await sub.verifyPlanCreated();
        await sub.clearMandatoryEditFieldAndVerifyError();
    });

    test(`TC_SP_NEG_15 - ${row("TC_SP_NEG_15").Expected_Result}`, async ({ tenantPage }) => {
        await tenantPage.goto(`${process.env.BASE_URL}${SubscriptionPlanPage.LISTING_PATH}/INVALID-PLAN-ID-999999`);
        await tenantPage.waitForLoadState("domcontentloaded").catch(() => { });
        const body = (await tenantPage.locator("body").innerText()).toLowerCase();
        const errored = /not found|error|invalid|something went wrong|404/.test(body)
            || !/create plan/i.test(body);
        if (!errored) throw new Error("Expected an error / not-found state for an invalid plan URL");
    });
});
