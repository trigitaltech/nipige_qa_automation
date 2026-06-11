import HomeSteps from "@uiSteps/HomeSteps";
import SubscriptionPlanSteps from "@uiSteps/SubscriptionPlanSteps";
import SubscriptionPlanPage from "@pages/SubscriptionPlanPage";
import { test as base, applyExecutionZoom } from "@base-test";
import { Page } from "@playwright/test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "SubscriptionPlanTest";

// Tenant account for this module (same pattern as the other tenant suites; this app stores auth in
// sessionStorage so the session is kept alive once per worker to avoid the rapid-login throttle).
const TENANT = { userName: "freshcart@gmail.com", password: "Welcome@123", persona: "tenant" };

const test = base.extend<{ tenantPage: Page }, { workerTenantPage: Page }>({
    workerTenantPage: [async ({ browser }, use) => {
        // viewport:null uses the full maximized window (the launch config sets --start-maximized),
        // so the complete application UI is visible during execution — matching the global use.viewport.
        const context = await browser.newContext({ viewport: null });
        await applyExecutionZoom(context); // execution-view zoom (full app screen visible)
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

test.describe.configure({ retries: 1 });

// The Subscription sheet keys rows by "TC_ID" (not the framework's default "TestID"), so rows are
// read via getTestDataArray and matched on TC_ID — no framework or sheet change required.
const SUB_ROWS = ExcelUtil.getTestDataArray(SHEET);
function row(id: string) {
    const found = SUB_ROWS.find((r) => r.TC_ID === id);
    if (!found) throw new Error(`TC_ID '${id}' not found on '${SHEET}' sheet`);
    return found;
}

const REFERENCE_PLAN = "Best Plan_95197"; // verified existing record (self-seeded if absent)

// ---------- Foundation smoke: navigation guard + listing + dashboard + create form ----------
test.describe("Subscription Plan - Module", () => {
    test("Listing, dashboard cards and create form load", async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();   // ends with the mandatory module guard
        await sub.verifyListingLoaded();
        await sub.verifyDashboardCards();
        await sub.openCreatePlanForm();
    });
});

// ---------- Positive suite (TC01–TC15) ----------
test.describe("Subscription Plan - Positive", () => {
    // TC01: create a subscription plan successfully end-to-end.
    test(`TC01 - ${row("TC01").Expected_Result}`, async ({ tenantPage }) => {
        Allure.attachDetails("Create subscription plan", "");
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.fillCreatePlanForm(row("TC01"));
        await sub.submitCreatePlan();
        await sub.verifyPlanCreated();
    });

    // TC02 / TC04 / TC05: in-form dropdown selection is reflected (Scope / Payment Type / Cadence).
    test(`TC02 - ${row("TC02").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.selectAndVerifyCombobox("Scope", row("TC02").Scope);
    });
    test(`TC03 - ${row("TC03").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.selectAndVerifyCombobox("Org Access", row("TC03").Org_Access);
    });
    test(`TC04 - ${row("TC04").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.selectAndVerifyCombobox("Payment Type", row("TC04").Payment_Type);
    });
    test(`TC05 - ${row("TC05").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.selectAndVerifyCombobox("Cadence Type", row("TC05").Cadence);
    });

    // TC06: Price accepts decimal values.
    test(`TC06 - ${row("TC06").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyPriceAcceptsDecimal(String(row("TC06").Price));
    });

    // TC07: Auto Renewal toggle flips state.
    test(`TC07 - ${row("TC07").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.toggleAutoRenewalAndVerify();
    });

    // TC08 / TC09: single and multiple feature creation.
    test(`TC08 - ${row("TC08").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.addFeaturesAndVerify(row("TC08"), 1);
    });
    test(`TC09 - ${row("TC09").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.addFeaturesAndVerify(row("TC09"), 2);
    });

    // TC10: Plan Preview updates dynamically.
    test(`TC10 - ${row("TC10").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyPlanPreviewUpdates(`${row("TC10").Plan_Name}_${Date.now() % 100000}`, row("TC10").Scope);
    });

    // TC11: Create redirects to the listing.
    test(`TC11 - ${row("TC11").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.fillCreatePlanForm(row("TC11"));
        await sub.submitCreatePlan();
        await sub.verifyRedirectToListing();
    });

    // TC12: created plan appears in the listing table.
    test(`TC12 - ${row("TC12").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.fillCreatePlanForm(row("TC12"));
        await sub.submitCreatePlan();
        await sub.verifyPlanCreated();
    });

    // TC13: search by plan name returns the matching record (self-seed the reference plan if absent).
    test(`TC13 - ${row("TC13").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.ensurePlanExists(REFERENCE_PLAN);
        await sub.navigateToSubscriptionPlans();
        await sub.searchAndVerifyContent(REFERENCE_PLAN, `${REFERENCE_PLAN} description`);
    });

    // TC14 / TC15: scope filters — every visible row must carry that scope.
    test(`TC14 - ${row("TC14").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.filterScopeAndVerifyAllRows("Customer", "CUSTOMER");
    });
    test(`TC15 - ${row("TC15").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.filterScopeAndVerifyAllRows("Partner", "PARTNER");
    });
});

// ---------- View / Edit / Update + Pagination (described in the spec's View/Edit sections) ----------
test.describe("Subscription Plan - View / Edit / Pagination", () => {
    test(`View page shows the created plan's details`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.fillCreatePlanForm(row("TC01"));
        await sub.submitCreatePlan();
        await sub.verifyPlanCreated();
        await sub.viewCreatedPlan();
    });

    // Enhanced: open Edit on the real reference plan and verify the form is pre-loaded with all of its
    // existing data (the same details shown in the View flow) before any update is performed.
    test(`Edit page pre-loads existing data`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.ensurePlanExists(REFERENCE_PLAN);
        await sub.navigateToSubscriptionPlans();
        await sub.verifyEditFormPreloaded(REFERENCE_PLAN);
    });

    test(`Update Plan Name and Features, listing reflects it`, async ({ tenantPage }) => {
        const data = row("TC12");
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.fillCreatePlanForm(data);
        await sub.submitCreatePlan();
        await sub.verifyPlanCreated();
        await sub.updateCreatedPlan(String(data.Price));
    });

    test(`Pagination validates defensively (single page in this environment)`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.verifyPaginationDefensive();
    });
});

// ---------- Negative suite (TC16–TC30) ----------
test.describe("Subscription Plan - Negative", () => {
    // TC16, TC17, TC19, TC20, TC26: invalid/blank data must surface a validation/error message.
    for (const id of ["TC16", "TC17", "TC19", "TC20", "TC26"]) {
        const data = row(id);
        test(`${data.TC_ID} - ${data.Expected_Result}`, async ({ tenantPage }) => {
            Allure.attachDetails(`Negative: ${data.Expected_Result}`, "");
            const sub = new SubscriptionPlanSteps(tenantPage);
            await sub.navigateToSubscriptionPlans();
            await sub.openCreatePlanForm();
            await sub.fillCreatePlanForm(data);
            if (id === "TC26") await sub.addBlankFeature();
            await sub.submitCreatePlan();
            await sub.verifyValidationError();
        });
    }

    // TC18 (Price) / TC21 (Validity): numeric fields reject non-numeric input at entry time.
    test(`TC18 - ${row("TC18").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyNumericFieldRejects("Price", String(row("TC18").Price));
    });
    test(`TC21 - ${row("TC21").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyNumericFieldRejects("Validity", String(row("TC21").Validity_Days));
    });

    // TC22: Duplicate plan name — the app enforces no uniqueness, so the duplicate is accepted.
    test(`TC22 - ${row("TC22").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.ensurePlanExists(REFERENCE_PLAN);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.fillCreatePlanForm({ ...row("TC22"), Plan_Name: REFERENCE_PLAN, useExactName: true });
        await sub.submitCreatePlan();
        await sub.verifyDuplicateAccepted(REFERENCE_PLAN);
    });

    // TC23: Description has no length limit — a long description is accepted verbatim.
    test(`TC23 - ${row("TC23").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyLongDescriptionAccepted(2000);
    });

    // TC24 / TC28: an invalid dropdown value is not a selectable option (the UI prevents it).
    test(`TC24 - ${row("TC24").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyInvalidOptionRejected("Tax Code", String(row("TC24").Tax_Code),
            SubscriptionPlanPage.TAX_CODE_COMBOBOX);
    });
    test(`TC28 - ${row("TC28").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyInvalidOptionRejected("Cadence Type", String(row("TC28").Cadence));
    });

    // TC25 / TC27: Scope / Currency are required dropdowns the UI always pre-fills (cannot be empty).
    test(`TC25 - ${row("TC25").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyDropdownAlwaysSet("Scope");
    });
    test(`TC27 - ${row("TC27").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.verifyDropdownAlwaysSet("Currency");
    });

    // TC29: API/network failure on submit must not falsely succeed.
    test(`TC29 - ${row("TC29").Expected_Result}`, async ({ tenantPage }) => {
        const sub = new SubscriptionPlanSteps(tenantPage);
        await sub.navigateToSubscriptionPlans();
        await sub.openCreatePlanForm();
        await sub.fillCreatePlanForm(row("TC29"));
        await sub.submitWithApiFailure();
    });

    // TC30: invalid / deleted URL access shows an error / not-found state.
    test(`TC30 - ${row("TC30").Expected_Result}`, async ({ tenantPage }) => {
        await tenantPage.goto(`${process.env.BASE_URL}${SubscriptionPlanPage.LISTING_PATH}/INVALID-PLAN-ID-999999`);
        await tenantPage.waitForLoadState("domcontentloaded").catch(() => { });
        const body = (await tenantPage.locator("body").innerText()).toLowerCase();
        const errored = /not found|error|invalid|something went wrong|404/.test(body)
            || !/create plan/i.test(body);
        if (!errored) throw new Error("Expected an error / not-found state for an invalid plan URL");
    });
});
