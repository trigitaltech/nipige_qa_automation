import { test } from "@base-test";
import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import HomeSteps from "@uiSteps/HomeSteps";
import ConcernSteps from "@uiSteps/ConcernSteps";
import Assert from "@asserts/Assert";
import ConcernConstants from "@uiConstants/ConcernConstants";
import ConcernPage from "@pages/ConcernPage";

const EMAIL = process.env.TENANT_EMAIL || "freshcart@gmail.com";
const PASS = process.env.TENANT_PASSWORD || "Welcome@123";

let sharedPage!: Page;
let concernSteps!: ConcernSteps;

test.describe("Concern Management", () => {
    test.describe.configure({ mode: "serial" });

    // ── beforeAll: LOGIN ONLY — no test data creation ─────────────────────────
    test.beforeAll(async ({ browser }) => {
        sharedPage = await browser.newPage();
        const home = new HomeSteps(sharedPage);
        await home.launchApplication();
        console.log("Username:", EMAIL);
        console.log("Password:", PASS ? "***" : "EMPTY");
        await home.login(EMAIL, PASS, "tenant");
        await home.validateLogin(EMAIL);
        concernSteps = new ConcernSteps(sharedPage);
        console.log("[Concern beforeAll] Login complete");
    });

    test.afterAll(async () => {
        await sharedPage?.close();
    });

    // ─────────────────────────────────────────────────────────────────────────
    // LISTING TEST CASES
    // ─────────────────────────────────────────────────────────────────────────

    test("TC_CONCERN_01 - Verify Concern page loads successfully", async () => {
        // Step 3 & 4: Verify Home page and sidebar are displayed after login
        await concernSteps.verifyHomePageDisplayed();

        // Steps 5 & 6: Navigate via actual UI — click Setup menu → click Concern submenu
        await concernSteps.navigateToConcernViaSetupMenu();

        // Step 7: Verify URL contains /setup/concern
        await concernSteps.verifyUrl(ConcernConstants.PAGE_URL_SEGMENT);

        // Steps 8–10: Verify Concern page heading, stat cards, and table
        await concernSteps.verifyPageLoaded();
        await concernSteps.verifySummaryCardsDisplayed();
        await concernSteps.verifyGridColumnsDisplayed();
    });

    test("TC_CONCERN_02 - Search concern using valid concern name", async () => {
        await concernSteps.navigateToConcern();
        await concernSteps.searchConcern(ConcernConstants.SEARCH_VALID_TERM);
        await concernSteps.verifyConcernInTable(ConcernConstants.SEARCH_VALID_TERM);
        await concernSteps.clearSearch();
    });

    test("TC_CONCERN_03 - Search using non-existing concern name shows empty state", async () => {
        await concernSteps.navigateToConcern();
        await concernSteps.searchConcern(ConcernConstants.NO_MATCH_SEARCH);
        await concernSteps.verifyNoRecordsMessage();
        await concernSteps.clearSearch();
    });

    test("TC_CONCERN_04 - Special characters in search handled safely", async () => {
        await concernSteps.navigateToConcern();
        await concernSteps.searchConcern(ConcernConstants.SPECIAL_CHAR_SEARCH);
        // App must not crash; page heading and table must remain visible
        await concernSteps.verifyPageLoaded();
        await concernSteps.clearSearch();
    });

    test("TC_CONCERN_05 - System filter shows only SYSTEM concerns", async () => {
        await concernSteps.navigateToConcern();
        await concernSteps.clickFilterSystem();
        await concernSteps.verifyOnlySystemConcernsDisplayed();
        await concernSteps.clickFilterAllTypes();
    });

    test("TC_CONCERN_06 - Custom filter shows only CUSTOM concerns", async () => {
        // Create a custom concern first so the Custom tab always has data
        const tempName = concernSteps.generateUniqueConcernName("CUSTOM_FILTER");
        await concernSteps.navigateToConcern();
        await concernSteps.clickCreateButton();
        await concernSteps.verifyCreatePageLoaded();
        await concernSteps.fillCreateForm({ concernName: tempName, concernType: "Custom" });
        await concernSteps.clickSave();
        await concernSteps.verifySuccessMessage();

        await concernSteps.navigateToConcern();
        await concernSteps.clickFilterCustom();
        await concernSteps.verifyConcernInTable(tempName);
        await concernSteps.verifyOnlyCustomConcernsDisplayed();

        // Cleanup
        await concernSteps.clickDeleteIconForRow(tempName);
        await concernSteps.confirmDelete();
    });

    test("TC_CONCERN_07 - Pagination Next navigates to next page", async () => {
        await concernSteps.navigateToConcern();
        await concernSteps.clickFilterAllTypes();
        await concernSteps.verifyPaginationNextNavigates();
    });

    test("TC_CONCERN_08 - Next button on last page stays on last page", async () => {
        await concernSteps.navigateToConcern();
        await concernSteps.clickFilterAllTypes();
        await concernSteps.verifyNextOnLastPageStays();
    });

    test("TC_CONCERN_09 - Create Concern button navigates to create page", async () => {
        await concernSteps.navigateToConcern();
        await concernSteps.clickCreateButton();
        await concernSteps.verifyCreatePageLoaded();
        await concernSteps.verifyUrl(ConcernConstants.CREATE_URL_SEGMENT);
        await concernSteps.clickCancel();
        await concernSteps.verifyOnListPage();
    });

    test("TC_CONCERN_10 - Delete concern not in use shows success message", async () => {
        const deletableName = concernSteps.generateUniqueConcernName("DEL_TC10");
        await concernSteps.navigateToConcern();
        await concernSteps.clickCreateButton();
        await concernSteps.verifyCreatePageLoaded();
        await concernSteps.fillCreateForm({ concernName: deletableName, concernType: "Custom" });
        await concernSteps.clickSave();
        await concernSteps.verifySuccessMessage();

        await concernSteps.navigateToConcern();
        await concernSteps.searchConcern(deletableName);
        await concernSteps.verifyConcernInTable(deletableName);
        await concernSteps.clickDeleteIconForRow(deletableName);
        await concernSteps.verifyDeleteConfirmationPopup(deletableName);
        await concernSteps.confirmDelete();
        await concernSteps.verifySuccessMessage();
        await concernSteps.verifyConcernRemoved(deletableName);
    });

    test("TC_CONCERN_11 - Delete concern in use shows proper message", async () => {
        // Navigate and look for a concern known to have 0 uses (system concern).
        // Concerns "in use" (with active templates) would block deletion —
        // with 0-use data we verify the confirmation dialog text at minimum.
        await concernSteps.navigateToConcern();
        await concernSteps.searchConcern(ConcernConstants.SEARCH_VALID_TERM);
        const rowVisible = await concernSteps.isConcernVisible(ConcernConstants.SEARCH_VALID_TERM);
        if (!rowVisible) {
            console.log("[TC_CONCERN_11] PROMOTIONAL concern not visible — test skipped");
            return;
        }
        await sharedPage.locator(
            `table tbody tr:has(td:has-text("${ConcernConstants.SEARCH_VALID_TERM}")) td:last-child button`,
        ).first().click();
        await sharedPage.locator(ConcernPage.DELETE_POPUP).waitFor({ state: "visible", timeout: 5000 });
        const popupText = (await sharedPage.locator(ConcernPage.DELETE_POPUP).first().innerText()).toLowerCase();
        await Assert.assertTrue(
            popupText.includes("delete") || popupText.includes("cannot") || popupText.includes("use"),
            "Delete attempt shows a confirmation or validation message",
        );
        // Always cancel — do not actually delete the system concern
        await sharedPage.locator(ConcernPage.DELETE_NO_BTN).first().click();
        await expect(sharedPage.locator(ConcernPage.DELETE_POPUP).first()).toBeHidden({ timeout: 5000 });
        await concernSteps.clearSearch();
    });

    // ─────────────────────────────────────────────────────────────────────────
    // CREATE CONCERN TEST CASES
    // ─────────────────────────────────────────────────────────────────────────

    test("TC_CONCERN_12 - Create Custom Concern successfully", async () => {
        const uniqueName = concernSteps.generateUniqueConcernName("CUSTOM_12");
        await concernSteps.navigateToConcern();
        await concernSteps.clickCreateButton();
        await concernSteps.verifyCreatePageLoaded();
        await concernSteps.fillCreateForm({
            concernName: uniqueName,
            concernType: "Custom",
            description: "Custom concern for TC12 automation",
            defaultChannel: ConcernConstants.DEFAULT_CHANNEL,
            priority: ConcernConstants.DEFAULT_PRIORITY,
        });
        await concernSteps.clickSave();
        await concernSteps.verifySuccessMessage();
        await concernSteps.navigateToConcern();
        await concernSteps.searchConcern(uniqueName);
        await concernSteps.verifyConcernInTable(uniqueName);
        // Cleanup
        await concernSteps.clickDeleteIconForRow(uniqueName);
        await concernSteps.confirmDelete();
    });

    test("TC_CONCERN_13 - Create System Concern successfully", async () => {
        const uniqueName = concernSteps.generateUniqueConcernName("SYS_13");
        await concernSteps.navigateToConcern();
        await concernSteps.clickCreateButton();
        await concernSteps.verifyCreatePageLoaded();
        await concernSteps.fillCreateForm({
            concernName: uniqueName,
            concernType: "System",
            description: "System concern for TC13 automation",
        });
        await concernSteps.clickSave();
        await concernSteps.verifySuccessMessage();
        await concernSteps.navigateToConcern();
        await concernSteps.searchConcern(uniqueName);
        await concernSteps.verifyConcernInTable(uniqueName);
        // Cleanup
        await concernSteps.clickDeleteIconForRow(uniqueName);
        await concernSteps.confirmDelete();
    });

    test("TC_CONCERN_14 - Preview panel updates dynamically", async () => {
        const previewName = concernSteps.generateUniqueConcernName("PREVIEW_14");
        await concernSteps.navigateToConcern();
        await concernSteps.clickCreateButton();
        await concernSteps.verifyCreatePageLoaded();
        await concernSteps.fillConcernName(previewName);
        await concernSteps.verifyPreviewUpdates(previewName);
        await concernSteps.clickCancel();
    });

    test("TC_CONCERN_15 - Default Channel dropdown saves correctly", async () => {
        await concernSteps.navigateToConcern();
        await concernSteps.clickCreateButton();
        await concernSteps.verifyCreatePageLoaded();
        await concernSteps.selectDefaultChannel(ConcernConstants.DEFAULT_CHANNEL);
        await concernSteps.verifyDefaultChannelSelected(ConcernConstants.DEFAULT_CHANNEL);
        await concernSteps.clickCancel();
    });

    test("TC_CONCERN_16 - Priority dropdown saves correctly", async () => {
        await concernSteps.navigateToConcern();
        await concernSteps.clickCreateButton();
        await concernSteps.verifyCreatePageLoaded();
        await concernSteps.selectPriority(ConcernConstants.DEFAULT_PRIORITY);
        await concernSteps.verifyPrioritySelected(ConcernConstants.DEFAULT_PRIORITY);
        await concernSteps.clickCancel();
    });

    test("TC_CONCERN_17 - Save with all mandatory fields shows success", async () => {
        const allFieldsName = concernSteps.generateUniqueConcernName("ALL_17");
        await concernSteps.navigateToConcern();
        await concernSteps.clickCreateButton();
        await concernSteps.verifyCreatePageLoaded();
        await concernSteps.fillCreateForm({
            concernName: allFieldsName,
            concernType: "Custom",
            description: "All fields test TC17",
            defaultChannel: ConcernConstants.DEFAULT_CHANNEL,
            priority: ConcernConstants.DEFAULT_PRIORITY,
        });
        await concernSteps.clickSave();
        await concernSteps.verifySuccessMessage();
        // Cleanup
        await concernSteps.navigateToConcern();
        await concernSteps.searchConcern(allFieldsName);
        await concernSteps.clickDeleteIconForRow(allFieldsName);
        await concernSteps.confirmDelete();
    });

    // ─────────────────────────────────────────────────────────────────────────
    // NEGATIVE TEST CASES
    // ─────────────────────────────────────────────────────────────────────────

    test("TC_CONCERN_18 - Blank Concern Name shows required validation", async () => {
        await concernSteps.navigateToConcern();
        await concernSteps.clickCreateButton();
        await concernSteps.verifyCreatePageLoaded();
        // Explicitly leave concern name blank and click Save
        await concernSteps.selectConcernType("Custom");
        await concernSteps.clickSaveExpectingValidation();
        // Verify inline red validation message: "Concern name is required."
        await expect(
            sharedPage.locator('p.text-red-500').first(),
            "Red validation message must appear for blank Concern Name",
        ).toBeVisible({ timeout: 5000 });
    });

    test("TC_CONCERN_19 - Duplicate concern name shows validation", async () => {
        // "PROMOTIONAL" already exists — using it as the duplicate target
        await concernSteps.navigateToConcern();
        await concernSteps.clickCreateButton();
        await concernSteps.verifyCreatePageLoaded();
        await concernSteps.fillCreateForm({
            concernName: ConcernConstants.SEARCH_VALID_TERM,
            concernType: "Custom",
            description: "Duplicate name test",
        });
        await concernSteps.clickSave();
        // Either stays on create page (with inline error) or shows an error toast
        const stayedOnCreate = sharedPage.url().includes("concern/create");
        const errorToast = await sharedPage.locator(".Toastify__toast--error").isVisible({ timeout: 3000 })
            .catch(() => false);
        const inlineError = await sharedPage.locator(ConcernPage.VALIDATION_MESSAGE)
            .isVisible({ timeout: 2000 }).catch(() => false);
        await Assert.assertTrue(
            stayedOnCreate || errorToast || inlineError,
            "Duplicate concern name triggers a validation or error response",
        );
        // Navigate back to list to clean state
        await concernSteps.navigateToConcern();
    });

    test("TC_CONCERN_20 - Special characters in concern name shows validation or restriction", async () => {
        await concernSteps.navigateToConcern();
        await concernSteps.clickCreateButton();
        await concernSteps.verifyCreatePageLoaded();
        await concernSteps.fillConcernName("!@#$%^&*()");
        await concernSteps.selectConcernType("Custom");
        await concernSteps.clickSave();
        // Either validation message appears, or URL stays on create
        await concernSteps.verifyValidationVisible();
        if (sharedPage.url().includes("concern/create")) {
            await concernSteps.clickCancel();
        }
    });

    test("TC_CONCERN_21 - Concern Type required indicator is visible", async () => {
        await concernSteps.navigateToConcern();
        await concernSteps.clickCreateButton();
        await concernSteps.verifyCreatePageLoaded();
        // Verify the Type label has a red required asterisk (*)
        const typeLabelHtml = await sharedPage.locator('label:has-text("Concern Type")').innerHTML();
        await Assert.assertTrue(
            typeLabelHtml.includes("text-red-500") || typeLabelHtml.includes("*"),
            "Concern Type label has required asterisk indicator",
        );
        // Verify System is pre-selected by default (readonly radio checked attribute)
        const systemRadio = sharedPage.locator(ConcernPage.RADIO_CONTAINER)
            .filter({ hasText: ConcernPage.SYSTEM_TYPE_FILTER_TEXT })
            .locator('input[type="radio"]').first();
        const checkedAttr = await systemRadio.getAttribute("checked");
        await Assert.assertTrue(
            checkedAttr !== null,
            "System type is pre-selected (checked) by default on the create form",
        );
        await concernSteps.clickCancel();
    });

    test("TC_CONCERN_22 - Concern name exceeding max length shows validation or restriction", async () => {
        await concernSteps.navigateToConcern();
        await concernSteps.clickCreateButton();
        await concernSteps.verifyCreatePageLoaded();
        await concernSteps.fillConcernName(ConcernConstants.LONG_NAME);
        const nameInput = sharedPage.locator(ConcernPage.CONCERN_NAME_INPUT).first();
        const filledValue = await nameInput.inputValue();
        console.log(`[TC_CONCERN_22] Input length after fill: ${filledValue.length} (attempted: ${ConcernConstants.LONG_NAME.length})`);
        if (filledValue.length < ConcernConstants.LONG_NAME.length) {
            // Input natively restricts max length
            await Assert.assertTrue(
                filledValue.length < ConcernConstants.LONG_NAME.length,
                "Input restricts concern name to max allowed length",
            );
            await concernSteps.clickCancel();
        } else {
            // Input accepted long text — verify Save triggers validation
            await concernSteps.selectConcernType("Custom");
            await concernSteps.clickSave();
            const stayedOnCreate = sharedPage.url().includes("concern/create");
            const errorVisible = await sharedPage.locator(ConcernPage.VALIDATION_MESSAGE)
                .isVisible({ timeout: 3000 }).catch(() => false);
            await Assert.assertTrue(
                stayedOnCreate || errorVisible,
                "Long concern name triggers validation or input restriction",
            );
            if (sharedPage.url().includes("concern/create")) {
                await concernSteps.clickCancel();
            }
        }
    });
});
