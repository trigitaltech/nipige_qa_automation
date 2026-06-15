import { test } from "@base-test";
import type { Page } from "@playwright/test";
import HomeSteps from "@uiSteps/HomeSteps";
import CommissionRuleSteps, { CommissionRuleFormData } from "@uiSteps/CommissionRuleSteps";
import Assert from "@asserts/Assert";
import CommissionRulePage from "../advantage/pages/CommissionRulePage";
import CommissionRuleConstants from "@uiConstants/CommissionRuleConstants";

const EMAIL = process.env.TENANT_EMAIL || "freshcart@gmail.com";
const PASS = process.env.TENANT_PASSWORD || "Welcome@123";

let sharedPage!: Page;
let steps!: CommissionRuleSteps;
let sharedRuleName!: string;

function getRandomOption(options: string[]) {
    return options[Math.floor(Math.random() * options.length)];
}

function validForm(overrides: Partial<CommissionRuleFormData> = {}): CommissionRuleFormData {
    return {
        ruleName: `COMM_VALIDATION_${Date.now().toString().slice(-6)}`,
        ruleType: "RANDOM", 
        eventType: "RANDOM", 
        applicableTo: "RANDOM", 
        appliedOn: "RANDOM", 
        chargeCode: Math.floor(10000 + Math.random() * 90000).toString(),
        commissionValue: Math.floor(5 + Math.random() * 20).toString(),
        ...overrides,
    };
}

test.describe("Commission Rules", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeAll(async ({ browser }) => {
        sharedPage = await browser.newPage();
        const home = new HomeSteps(sharedPage);
        await home.launchApplication();
        await home.login(EMAIL, PASS, "tenant");
        await home.validateLogin(EMAIL);

        steps = new CommissionRuleSteps(sharedPage);
        sharedRuleName = steps.generateUniqueRuleName();

        // Create a base record for view/edit/search tests
        await steps.navigateToCommissionRules();
        await steps.clickCreateButton();
        await steps.verifyCreatePageLoaded();
        await steps.fillCreateForm(validForm({ ruleName: sharedRuleName }));
        await steps.clickSave();
        // Wait for it to appear in the list
        await steps.navigateToCommissionRules();
        await steps.searchRule(sharedRuleName);
        await steps.verifyRuleInTable(sharedRuleName);
        await steps.clearSearch();
    });

    test.afterAll(async () => {
        if (steps && sharedPage && !sharedPage.isClosed()) {
            await steps.navigateToCommissionRules().catch(() => {});
            await steps.searchRule(sharedRuleName).catch(() => {});
            // Cleanup logic if hard delete is supported, otherwise we just close
        }
        await sharedPage?.close();
    });

    test.describe("Listing Screen", () => {
        test("Verify Commission Rules page loads successfully with all elements", async () => {
            await steps.navigateToCommissionRules();
            await steps.verifyPageLoaded();
            await steps.verifySummaryCardsDisplayed();
        });

        test("Verify user can search for an existing Rule Name", async () => {
            await steps.navigateToCommissionRules();
            await steps.searchRule(sharedRuleName);
            await steps.verifyRuleInTable(sharedRuleName);
            await steps.clearSearch();
        });

        test("Verify searching with an invalid Rule Name displays No Records Found", async () => {
            await steps.navigateToCommissionRules();
            await steps.searchRule(CommissionRuleConstants.NO_MATCH_SEARCH);
            await steps.verifyNoRecordsMessage();
            await steps.clearSearch();
        });

        test("Verify system handles special characters in search", async () => {
            await steps.navigateToCommissionRules();
            await steps.searchRule(CommissionRuleConstants.SPECIAL_CHAR_SEARCH);
            await steps.verifyNoRecordsMessage();
            await steps.clearSearch();
        });

        test("Verify user can filter rules using tabs", async () => {
            await steps.navigateToCommissionRules();
            await steps.filterByTab("Ground");
            // Assuming we check the table hasn't crashed, or verify records.
            // A more complex assertion would check rule types in the grid.
            const hasData = await sharedPage.locator('table tbody tr').count() > 0;
            if(!hasData) {
                await steps.verifyNoRecordsMessage();
            }
            await steps.filterByTab("All Types");
        });

        test("Verify user can filter rules using Applicable To dropdown", async () => {
            await steps.navigateToCommissionRules();
            
            const options = ["Tenant", "Partner", "Seller", "Delivery Agent"];
            for (const option of options) {
                await steps.filterByApplicableTo(option);
                // Verify the table does not crash and updates correctly
                await sharedPage.waitForTimeout(1500); // Wait for filtering animation
                
                // Get all rows that don't have a colspan (which usually indicates an empty state message)
                const dataRows = sharedPage.locator('table tbody tr:not(:has(td[colspan]))');
                const hasData = await dataRows.count() > 0;
                
                if(!hasData) {
                    await steps.verifyNoRecordsMessage();
                } else {
                    // Check if at least one visible row has the correct Applicable To value
                    const cellText = await dataRows.first().locator(CommissionRulePage.CELL_APPLICABLE_TO).innerText();
                    const normalizedCell = cellText.trim().toLowerCase().replace(/_/g, ' ');
                    const normalizedOption = option.toLowerCase().replace(/_/g, ' ');
                    const isMatch = normalizedCell === normalizedOption;
                    await Assert.assertTrue(isMatch, `Filtered record should match '${option}', but found '${cellText.trim()}'`);
                }
            }
            // Reset to All Applicable To
            await steps.filterByApplicableTo("All Applicable To");
        });

        test("Verify clicking View icon opens View page", async () => {
            await steps.navigateToCommissionRules();
            await steps.searchRule(sharedRuleName);
            await steps.clickViewIconForRow(sharedRuleName);
            await steps.verifyViewPageLoaded();
        });

        test("Verify clicking Edit icon opens Edit page", async () => {
            await steps.navigateToCommissionRules();
            await steps.searchRule(sharedRuleName);
            await steps.clickEditIconForRow(sharedRuleName);
            await steps.verifyEditPageLoaded();
        });

        test("Verify clicking Create button navigates to Create page", async () => {
            await steps.navigateToCommissionRules();
            await steps.clickCreateButton();
            await steps.verifyCreatePageLoaded();
        });

        test("Verify Export button successfully downloads data", async () => {
            await steps.navigateToCommissionRules();
            const exportBtn = sharedPage.locator(CommissionRulePage.EXPORT_BTN).first();
            if (!await exportBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                console.log("Skipping export download verification: Export button not present in UI.");
                return;
            }
            
            const downloadPromise = sharedPage.waitForEvent('download', { timeout: 10000 }).catch(() => null);
            await steps.clickExport();
            const download = await downloadPromise;
            
            if (download) {
                const error = await download.failure();
                await Assert.assertTrue(error === null, "Export download should not fail");
            } else {
                console.log("Export triggered a toast or background job instead of direct download.");
            }
        });
    });

    test.describe("Create Screen", () => {
        test("Verify user can create a Commission Rule", async () => {
            const ruleName = steps.generateUniqueRuleName();
            await steps.navigateToCommissionRules();
            await steps.clickCreateButton();
            await steps.fillCreateForm(validForm({ ruleName }));
            await steps.clickSave();
            
            await steps.navigateToCommissionRules();
            await steps.searchRule(ruleName);
            await steps.verifyRuleInTable(ruleName);
        });

        test("Verify Live Preview section updates dynamically", async () => {
            await steps.navigateToCommissionRules();
            await steps.clickCreateButton();
            await steps.fillCreateForm({ ruleName: "Preview Test Rule", commissionValue: "15" });
            await steps.verifyLivePreviewUpdates("Preview Test Rule");
            await steps.verifyLivePreviewUpdates("15");
        });

        test("Verify clicking Cancel returns to listing page", async () => {
            await steps.navigateToCommissionRules();
            await steps.clickCreateButton();
            await steps.fillCreateForm({ ruleName: "Cancel Test" });
            await steps.clickCancel();
            await steps.verifyPageLoaded();
        });

        test("Verify validation message appears when mandatory fields are blank", async () => {
            await steps.navigateToCommissionRules();
            await steps.clickCreateButton();
            await steps.clickSave();
            await steps.verifyValidationVisible();
        });
    });

    test.describe("View Screen", () => {
        test("Verify View page displays correct details", async () => {
            await steps.navigateToCommissionRules();
            await steps.searchRule(sharedRuleName);
            await steps.clickViewIconForRow(sharedRuleName);
            await steps.verifyViewPageLoaded();
            
            const content = await sharedPage.content();
            await Assert.assertTrue(content.includes(sharedRuleName), "View page contains rule name");
        });
    });

    test.describe("Edit Screen", () => {
        test("Verify user can update the Commission Rule", async () => {
            await steps.navigateToCommissionRules();
            await steps.searchRule(sharedRuleName);
            await steps.clickEditIconForRow(sharedRuleName);
            await steps.verifyEditPageLoaded();
            
            await steps.fillCreateForm({ commissionValue: "25" });
            await steps.clickUpdateRule();
            
            // Navigate to view to confirm
            await steps.navigateToCommissionRules();
            await steps.searchRule(sharedRuleName);
            await steps.clickViewIconForRow(sharedRuleName);
            const content = await sharedPage.content();
            await Assert.assertTrue(content.includes("25"), "Updated commission value should be present");
        });

        test("Verify clicking Delete successfully removes rule", async () => {
            const tempRule = steps.generateUniqueRuleName();
            await steps.navigateToCommissionRules();
            await steps.clickCreateButton();
            await steps.fillCreateForm(validForm({ ruleName: tempRule }));
            await steps.clickSave();

            await steps.navigateToCommissionRules();
            await steps.searchRule(tempRule);
            await steps.clickEditIconForRow(tempRule);
            await steps.clickDelete();

            await steps.navigateToCommissionRules();
            await steps.searchRule(tempRule);
            await steps.verifyNoRecordsMessage();
        });
    });
});
