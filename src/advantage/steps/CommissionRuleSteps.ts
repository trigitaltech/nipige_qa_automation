import test, { Page, expect } from "@playwright/test";
import Assert from "@asserts/Assert";
import CommissionRulePage from "@pages/CommissionRulePage";
import CommissionRuleConstants from "@uiConstants/CommissionRuleConstants";

export interface CommissionRuleFormData {
    ruleName: string;
    ruleType: string;
    eventType: string;
    applicableTo: string;
    appliedOn: string;
    chargeCode: string;
    commissionValue: string;
}

export default class CommissionRuleSteps {
    constructor(private readonly page: Page) {}

    public generateUniqueRuleName(): string {
        return `COMM_RULE_${Date.now().toString().slice(-6)}`;
    }

    public async waitForTableStable() {
        await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
        await this.page.waitForTimeout(CommissionRuleConstants.TABLE_SETTLE_MS);
    }

    public async navigateToCommissionRules() {
        await test.step("Navigate to Commission Rules listing page", async () => {
            const targetUrl = `${process.env.BASE_URL}${CommissionRulePage.PAGE_PATH}`;
            await this.page.goto(targetUrl);
            await this.page.waitForLoadState("networkidle");
            if (this.page.url().includes("/login")) {
                throw new Error("Redirected to login page. Valid session required.");
            }
        });
    }

    public async verifyPageLoaded() {
        await test.step("Verify Commission Rules listing page loaded", async () => {
            await expect(this.page).toHaveURL(new RegExp(CommissionRuleConstants.PAGE_URL_SEGMENT), { timeout: 15000 });
            await expect(this.page.locator(CommissionRulePage.PAGE_HEADING).first()).toBeVisible({ timeout: 10000 });
            await expect(this.page.locator(CommissionRulePage.TABLE)).toBeVisible({ timeout: 8000 });
        });
    }

    public async verifySummaryCardsDisplayed() {
        await test.step("Verify summary cards are displayed", async () => {
            for (const label of CommissionRuleConstants.EXPECTED_SUMMARY_CARDS) {
                await expect(this.page.getByText(label, { exact: true }).first()).toBeVisible({ timeout: 8000 });
            }
        });
    }

    public async searchRule(term: string) {
        await test.step(`Search for rule: '${term}'`, async () => {
            const input = this.page.locator(CommissionRulePage.SEARCH_INPUT);
            await expect(input).toBeVisible({ timeout: 8000 });
            await input.fill(term);
            await this.waitForTableStable();
        });
    }

    public async clearSearch() {
        await test.step("Clear search field", async () => {
            await this.page.locator(CommissionRulePage.SEARCH_INPUT).clear();
            await this.waitForTableStable();
        });
    }

    public async verifyNoRecordsMessage() {
        await test.step("Verify no-records empty state message is displayed", async () => {
            await this.waitForTableStable();
            const emptyLoc = this.page.locator(CommissionRulePage.NO_RECORDS).first();
            const hasEmptyText = await emptyLoc.isVisible({ timeout: 3000 }).catch(() => false);
            if (hasEmptyText) {
                await expect(emptyLoc).toBeVisible();
            } else {
                const rowCount = await this.page.locator(CommissionRulePage.TABLE_ROWS).count();
                if (rowCount > 0) {
                    const rowText = await this.page.locator(CommissionRulePage.TABLE_ROWS).first().innerText();
                    // Some tables use a single row spanning columns for "No records"
                    const isEmptyRow = /no records|no data|empty|not found|0 results/i.test(rowText);
                    await Assert.assertTrue(isEmptyRow, `Expected empty table but found rows. First row: ${rowText}`);
                } else {
                    await Assert.assertTrue(rowCount === 0, "Table should have 0 data rows");
                }
            }
        });
    }

    public async verifyRuleInTable(ruleName: string) {
        await test.step(`Verify '${ruleName}' is visible in the table`, async () => {
            const row = this.page.locator(CommissionRulePage.rowFor(ruleName)).first();
            await expect(row).toBeVisible({ timeout: 10000 });
        });
    }

    public async filterByTab(tabName: string) {
        await test.step(`Filter by tab: '${tabName}'`, async () => {
            const tabBtn = this.page.locator(`button:has-text("${tabName}"), [role="tab"]:has-text("${tabName}")`).first();
            await tabBtn.click();
            await this.waitForTableStable();
        });
    }

    public async filterByApplicableTo(optionName: string) {
        await test.step(`Filter Applicable To dropdown by: '${optionName}'`, async () => {
            // Look for the filter dropdown next to search
            const filterContainer = this.page.locator('div:has(> select), div:has(> [role="combobox"])').filter({ hasText: /Applicable To|Tenant|Partner|Seller/i }).last();
            const element = filterContainer.locator('select, [role="combobox"]').first();
            const tagName = await element.evaluate(el => el.tagName.toLowerCase()).catch(() => "div");

            if (tagName === "select") {
                await element.selectOption({ label: optionName }).catch(() => element.selectOption(optionName));
            } else {
                await element.click();
                await this.page.waitForTimeout(CommissionRuleConstants.DROPDOWN_OPEN_MS);
                await this.page.locator(`[role="option"]:has-text("${optionName}"), li:has-text("${optionName}")`).first().click();
            }
            await this.waitForTableStable();
        });
    }

    public async clickCreateButton() {
        await test.step("Click Create Commission Rule button", async () => {
            await this.page.locator(CommissionRulePage.CREATE_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyCreatePageLoaded() {
        await test.step("Verify Create Commission Rule page loaded", async () => {
            await expect(this.page).toHaveURL(/commission\/create|commission\/new/, { timeout: 10000 });
            await expect(this.page.locator(CommissionRulePage.CREATE_HEADING).first()).toBeVisible({ timeout: 8000 });
        });
    }

    private async selectDropdownOption(label: string, value: string) {
        const element = this.page.locator(`:is(select, [role="combobox"]):below(:text("${label}"))`).first();
        const tagName = await element.evaluate(el => el.tagName.toLowerCase()).catch(() => "div");
        
        if (tagName === "select") {
            if (value === "RANDOM") {
                const optionsText = await element.locator('option').allTextContents();
                const validOptions = optionsText.map(o => o.trim()).filter(o => o && o.toLowerCase() !== "select");
                if (validOptions.length > 0) {
                    const randomOption = validOptions[Math.floor(Math.random() * validOptions.length)];
                    await element.selectOption({ label: randomOption });
                }
            } else {
                await element.selectOption(value);
            }
        } else {
            await element.click();
            await this.page.waitForTimeout(CommissionRuleConstants.DROPDOWN_OPEN_MS);
            if (value === "RANDOM") {
                const optionsLocator = this.page.locator('[role="option"], li');
                await expect(optionsLocator.first()).toBeVisible({ timeout: 5000 }).catch(() => null);
                const optionsCount = await optionsLocator.count();
                const validIndices = [];
                for(let i=0; i<optionsCount; i++) {
                    const text = await optionsLocator.nth(i).innerText();
                    if (text.trim() && text.trim().toLowerCase() !== "select") {
                        validIndices.push(i);
                    }
                }
                if (validIndices.length > 0) {
                    const randomIdx = validIndices[Math.floor(Math.random() * validIndices.length)];
                    await optionsLocator.nth(randomIdx).click();
                } else {
                    await optionsLocator.first().click();
                }
            } else {
                await this.page.locator(`[role="option"]:has-text("${value}")`).first().click();
            }
        }
    }

    public async fillCreateForm(data: Partial<CommissionRuleFormData>) {
        await test.step("Fill Create Commission Rule form", async () => {
            if (data.ruleName) await this.page.locator(`input:not([type="hidden"]):below(:text("Rule Name"))`).first().fill(data.ruleName);
            if (data.ruleType) await this.selectDropdownOption('Rule Type', data.ruleType);
            if (data.eventType) await this.selectDropdownOption('Event Type', data.eventType);
            if (data.applicableTo) await this.selectDropdownOption('Applicable To', data.applicableTo);
            if (data.appliedOn) await this.selectDropdownOption('Applied On', data.appliedOn);
            if (data.chargeCode) await this.page.locator(`input:not([type="hidden"]):below(:text("Charge Code"))`).first().fill(data.chargeCode);
            if (data.commissionValue) await this.page.locator(`input:not([type="hidden"]):below(:text("Commission Value"))`).first().fill(data.commissionValue);
        });
    }

    public async clickSave() {
        await test.step("Click Save button", async () => {
            await this.page.locator(CommissionRulePage.SAVE_BTN).click();
            await this.page.waitForLoadState("networkidle", { timeout: 10000 });
            await this.page.waitForTimeout(1500); // Allow toast/redirect to settle
        });
    }

    public async clickCancel() {
        await test.step("Click Cancel button", async () => {
            await this.page.locator(CommissionRulePage.CANCEL_BTN).click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyValidationVisible(expectedText?: string) {
        await test.step("Verify validation message is displayed", async () => {
            const visible = await this.page.locator(CommissionRulePage.VALIDATION_MESSAGE).first().isVisible({ timeout: 3000 }).catch(() => false);
            if (expectedText) {
                const content = (await this.page.locator("body").innerText()).toLowerCase();
                await Assert.assertTrue(visible || content.includes(expectedText.toLowerCase()), `Validation containing '${expectedText}' is active`);
            } else {
                await Assert.assertTrue(visible, "Validation feedback is visible");
            }
        });
    }

    public async clickViewIconForRow(ruleName: string) {
        await test.step(`Click View icon for '${ruleName}'`, async () => {
            const row = this.page.locator(CommissionRulePage.rowFor(ruleName)).first();
            await expect(row).toBeVisible({ timeout: 8000 });
            await row.locator(CommissionRulePage.CELL_ACTIONS).locator('xpath=.//button | .//a | .//svg[not(ancestor::button) and not(ancestor::a)]').nth(0).click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyViewPageLoaded() {
        await test.step("Verify View Commission Rule page loaded", async () => {
            await expect(this.page).toHaveURL(/commission\/view/, { timeout: 10000 });
            await expect(this.page.locator(CommissionRulePage.VIEW_HEADING).first()).toBeVisible({ timeout: 8000 });
        });
    }

    public async clickEditIconForRow(ruleName: string) {
        await test.step(`Click Edit icon for '${ruleName}'`, async () => {
            const row = this.page.locator(CommissionRulePage.rowFor(ruleName)).first();
            await expect(row).toBeVisible({ timeout: 8000 });
            await row.locator(CommissionRulePage.CELL_ACTIONS).locator('xpath=.//button | .//a | .//svg[not(ancestor::button) and not(ancestor::a)]').nth(1).click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyEditPageLoaded() {
        await test.step("Verify Edit Commission Rule page loaded", async () => {
            await expect(this.page).toHaveURL(/commission\/edit/, { timeout: 10000 });
            await expect(this.page.locator(CommissionRulePage.EDIT_HEADING).first()).toBeVisible({ timeout: 8000 });
        });
    }

    public async clickUpdateRule() {
        await test.step("Click Update Rule button", async () => {
            await this.page.locator(CommissionRulePage.UPDATE_RULE_BTN).click();
            await this.page.waitForLoadState("networkidle", { timeout: 10000 });
            await this.page.waitForTimeout(1500); // Allow toast/redirect to settle
        });
    }

    public async clickDelete() {
        await test.step("Click Delete button on edit page", async () => {
            // Auto-accept any native browser confirm dialogs
            this.page.once('dialog', dialog => dialog.accept().catch(() => {}));
            
            await this.page.locator(CommissionRulePage.DELETE_BTN).click();
            
            // Handle HTML-based modals (SweetAlert, AntD, Bootstrap, etc)
            const modalConfirmBtn = this.page.locator('[role="dialog"], .swal-modal, .swal2-popup, .modal, [class*="modal"]').locator('button:has-text("Yes"), button:has-text("Confirm"), button:has-text("Delete"), button:has-text("Ok")').first();
            if (await modalConfirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await modalConfirmBtn.click();
            }
            
            await this.page.waitForLoadState("networkidle", { timeout: 10000 });
            await this.page.waitForTimeout(1500); // Allow toast/redirect to settle
        });
    }

    public async verifyLivePreviewUpdates(expectedText: string) {
        await test.step(`Verify Live Preview contains '${expectedText}'`, async () => {
            const previewSection = this.page.locator(CommissionRulePage.LIVE_PREVIEW_SECTION).first();
            await expect(previewSection).toContainText(expectedText, { timeout: 5000 });
        });
    }

    public async clickExport() {
        await test.step("Click Export button", async () => {
            await this.page.locator(CommissionRulePage.EXPORT_BTN).click();
        });
    }
}
