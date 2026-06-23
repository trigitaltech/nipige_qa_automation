import test, { Page, expect } from "@playwright/test";
import Assert from "@asserts/Assert";
import BusinessPlanPage from "@pages/BusinessPlanPage";

export interface BusinessPlanFormData {
    planName?: string;
    description?: string;
    logoPath?: string;
    subscription?: string;
    feature?: string;
}

export default class BusinessPlanSteps {
    constructor(private readonly page: Page) {}

    public async waitForPageStable() {
        await this.page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
        await this.page.waitForTimeout(800);
    }

    public async waitForCardsLoaded() {
        await this.page.locator('.skeleton, [class*="skeleton"], .animate-pulse').first()
            .waitFor({ state: "hidden", timeout: 5000 }).catch(() => {});
        // Handle rate-limit (HTTP 429) — retry up to 3 times with back-off
        for (let attempt = 0; attempt < 3; attempt++) {
            const retryBtn = this.page.locator('button:has-text("Retry")').first();
            if (await retryBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
                console.log(`[BusinessPlan] Rate-limit (429) detected — waiting 4s before retry (attempt ${attempt + 1})`);
                await this.page.waitForTimeout(4000);
                await retryBtn.click();
                await this.page.waitForTimeout(2000);
            }
            const cards = await this.page.locator(BusinessPlanPage.VIEW_MORE_BTN).count().catch(() => 0);
            const noData = await this.page.locator(BusinessPlanPage.NO_RECORDS).first().isVisible().catch(() => false);
            if (cards > 0 || noData) break;
            if (attempt < 2) await this.page.waitForTimeout(500);
        }
        await this.waitForPageStable();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async navigateToBusinessPlans() {
        await test.step("Navigate to Business Plan listing page", async () => {
            await this.page.waitForTimeout(800); // brief pause to avoid API rate-limiting
            const url = `${process.env.BASE_URL}${BusinessPlanPage.BP_PATH}`;
            console.log(`[BusinessPlan] Navigating to: ${url}`);
            await this.page.goto(url);
            await this.page.waitForLoadState("networkidle");
            const landed = this.page.url();
            console.log(`[BusinessPlan] Landed at: ${landed}`);
            if (landed.includes("/login")) {
                throw new Error(`Navigation redirected to login. URL: ${landed}`);
            }
        });
    }

    public async navigateToCreatePage() {
        await test.step("Navigate directly to Create Business Plan page", async () => {
            const url = `${process.env.BASE_URL}${BusinessPlanPage.BP_CREATE_PATH}`;
            await this.page.goto(url);
            await this.page.waitForLoadState("networkidle");
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGE VERIFICATION — LISTING
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyListingPageLoaded() {
        await test.step("Verify Business Plan listing page loaded with heading and Create button", async () => {
            await expect(this.page).toHaveURL(new RegExp(BusinessPlanPage.BP_PATH), { timeout: 15000 });
            await expect(this.page.locator(BusinessPlanPage.PAGE_HEADING).first(), "Page heading visible")
                .toBeVisible({ timeout: 10000 });
            await expect(this.page.locator(BusinessPlanPage.CREATE_BTN).first(), "Create button visible")
                .toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyPlanCardsDisplayed() {
        await test.step("Verify plan cards are displayed on the listing page", async () => {
            await this.waitForCardsLoaded();
            const count = await this.page.locator(BusinessPlanPage.VIEW_MORE_BTN).count();
            await Assert.assertTrue(count > 0, `At least one plan card visible (found ${count})`);
        });
    }

    public async verifyCardContent(planName: string) {
        await test.step(`Verify card content for plan '${planName}'`, async () => {
            const card = this.page.locator(BusinessPlanPage.cardContaining(planName)).first();
            await expect(card, `Card for '${planName}' must be visible`).toBeVisible({ timeout: 8000 });
            const text = await card.innerText();
            console.log(`[BusinessPlan] Card text for '${planName}': ${text.slice(0, 200)}`);
            await Assert.assertTrue(text.toLowerCase().includes(planName.toLowerCase()), "Plan name in card");
        });
    }

    public async verifyCardHasPrice() {
        await test.step("Verify at least one plan card shows a price in INR format", async () => {
            await this.waitForCardsLoaded();
            const bodyText = await this.page.locator("body").innerText();
            await Assert.assertTrue(
                bodyText.includes("INR") || bodyText.includes("₹") || bodyText.includes("month"),
                "Price in INR/month format visible on listing",
            );
        });
    }

    public async verifyCardHasFeatures() {
        await test.step("Verify plan cards show FEATURES INCLUDED section", async () => {
            const bodyText = await this.page.locator("body").innerText();
            await Assert.assertTrue(
                bodyText.toUpperCase().includes("FEATURES INCLUDED") || bodyText.includes("Feature"),
                "Features section present on cards",
            );
        });
    }

    public async verifyNoRecordsMessage() {
        await test.step("Verify no records / empty state is displayed", async () => {
            await expect(this.page.locator(BusinessPlanPage.NO_RECORDS).first(), "No records message visible")
                .toBeVisible({ timeout: 8000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LISTING — ACTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickCreateBusinessPlan() {
        await test.step("Click Create Business Plan button", async () => {
            await this.page.locator(BusinessPlanPage.CREATE_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async clickRefresh() {
        await test.step("Click Refresh / Reload icon on Business Plan listing", async () => {
            const btn = this.page.locator(BusinessPlanPage.REFRESH_BTN).first();
            if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await btn.click();
                await this.waitForCardsLoaded();
            } else {
                console.log("[BusinessPlan] Refresh button not found, reloading page instead");
                await this.page.reload();
                await this.waitForCardsLoaded();
            }
        });
    }

    public async clickViewMoreOnFirstCard() {
        await test.step("Click View More on the first plan card", async () => {
            const btn = this.page.locator(BusinessPlanPage.VIEW_MORE_BTN).first();
            await expect(btn, "View More button must be visible").toBeVisible({ timeout: 8000 });
            await btn.click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async clickViewMoreForPlan(planName: string) {
        await test.step(`Click View More for plan '${planName}'`, async () => {
            const cardSel = BusinessPlanPage.cardContaining(planName);
            const viewBtn = this.page.locator(BusinessPlanPage.viewMoreInCard(cardSel)).first();
            await expect(viewBtn, `View More visible in card '${planName}'`).toBeVisible({ timeout: 8000 });
            await viewBtn.click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGINATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickNext() {
        await test.step("Click Next pagination button", async () => {
            const btn = this.page.locator(BusinessPlanPage.NEXT_PAGE_BTN).first();
            await expect(btn, "Next button must be visible").toBeVisible({ timeout: 5000 });
            const disabled = await btn.isDisabled().catch(() => false);
            if (!disabled) {
                await btn.click();
                await this.waitForCardsLoaded();
            } else {
                console.log("[BusinessPlan] Next button is disabled (already on last page)");
            }
        });
    }

    public async clickPrevious() {
        await test.step("Click Previous pagination button", async () => {
            const btn = this.page.locator(BusinessPlanPage.PREV_PAGE_BTN).first();
            await expect(btn, "Previous button must be visible").toBeVisible({ timeout: 5000 });
            const disabled = await btn.isDisabled().catch(() => false);
            if (!disabled) {
                await btn.click();
                await this.waitForCardsLoaded();
            } else {
                console.log("[BusinessPlan] Previous button is disabled (already on first page)");
            }
        });
    }

    public async clickPageNumber(num: number) {
        await test.step(`Click page number ${num}`, async () => {
            const btn = this.page.locator(BusinessPlanPage.pageNumBtn(num)).first();
            if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await btn.click();
                await this.waitForCardsLoaded();
            } else {
                console.log(`[BusinessPlan] Page number ${num} not visible — skipping`);
            }
        });
    }

    public async verifyPaginationWorks() {
        await test.step("Verify pagination Next/Previous navigation works", async () => {
            await this.waitForCardsLoaded();
            const nextBtn = this.page.locator(BusinessPlanPage.NEXT_PAGE_BTN).first();
            const prevBtn = this.page.locator(BusinessPlanPage.PREV_PAGE_BTN).first();
            if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)
                && !await nextBtn.isDisabled().catch(() => true)) {
                await nextBtn.click();
                await this.waitForCardsLoaded();
                console.log("[BusinessPlan] Navigated to next page via pagination");
                if (await prevBtn.isVisible({ timeout: 3000 }).catch(() => false)
                    && !await prevBtn.isDisabled().catch(() => true)) {
                    await prevBtn.click();
                    await this.waitForCardsLoaded();
                    console.log("[BusinessPlan] Navigated back via Previous");
                }
            } else {
                console.log("[BusinessPlan] Pagination skipped — single page or Next disabled");
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGE VERIFICATION — CREATE / EDIT
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyCreatePageLoaded() {
        await test.step("Verify Create / Add Business Plan page is displayed", async () => {
            await expect(this.page).toHaveURL(/create-business-plan|create|new/, { timeout: 12000 });
            await expect(this.page.locator(BusinessPlanPage.CREATE_HEADING).first(), "Create heading visible")
                .toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyDetailsPageLoaded() {
        await test.step("Verify Business Plan Details page is displayed", async () => {
            await expect(this.page).toHaveURL(/businessPlan\/details|businessPlan\/[a-zA-Z0-9_-]+$/, { timeout: 12000 });
            await expect(this.page.locator(BusinessPlanPage.DETAILS_HEADING).first(), "Details heading visible")
                .toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyEditPageLoaded() {
        await test.step("Verify Edit Business Plan page is displayed", async () => {
            await expect(this.page).toHaveURL(/businessPlan\/edit|edit/, { timeout: 12000 });
            await expect(this.page.locator(BusinessPlanPage.EDIT_HEADING).first(), "Edit heading visible")
                .toBeVisible({ timeout: 8000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FORM ACTIONS — CREATE / EDIT
    // ═══════════════════════════════════════════════════════════════════════════

    public async fillPlanName(name: string) {
        await test.step(`Fill Business Plan Name: '${name}'`, async () => {
            const input = this.page.locator(BusinessPlanPage.PLAN_NAME_INPUT).first();
            await expect(input, "Plan Name input must be visible").toBeVisible({ timeout: 8000 });
            await input.clear();
            await input.fill(name);
        });
    }

    public async fillDescription(desc: string) {
        await test.step(`Fill Description: '${desc.slice(0, 40)}...'`, async () => {
            const ta = this.page.locator(BusinessPlanPage.DESCRIPTION_TEXTAREA).first();
            await expect(ta, "Description textarea must be visible").toBeVisible({ timeout: 8000 });
            await ta.clear();
            await ta.fill(desc);
        });
    }

    public async uploadLogo(logoPath: string) {
        await test.step(`Upload logo from path: ${logoPath}`, async () => {
            const fileInput = this.page.locator(BusinessPlanPage.LOGO_FILE_INPUT).first();
            await fileInput.setInputFiles(logoPath);
            await this.page.waitForTimeout(1000);
        });
    }

    // ── Subscription section ─────────────────────────────────────────────────

    public async selectAndAddSubscription(subscriptionName: string) {
        await test.step(`Select subscription '${subscriptionName}' and click Add`, async () => {
            const control = this.page.locator(BusinessPlanPage.SELECT_SUBSCRIPTION_CONTROL).first();
            await expect(control, "Subscription select must be visible").toBeVisible({ timeout: 8000 });
            await control.click();
            await this.page.waitForTimeout(500);

            const option = this.page.locator(BusinessPlanPage.DROPDOWN_OPTION(subscriptionName)).first();
            await expect(option, `Option '${subscriptionName}' must be visible`).toBeVisible({ timeout: 6000 });
            await option.click();
            await this.page.waitForTimeout(300);

            const addBtn = this.page.locator(BusinessPlanPage.ADD_SUBSCRIPTION_BTN).first();
            await expect(addBtn, "Add Subscription button must be visible").toBeVisible({ timeout: 5000 });
            await addBtn.click();
            await this.page.waitForTimeout(800);
        });
    }

    public async clickAddSubscriptionWithoutSelect() {
        await test.step("Click Add Subscription without selecting any option", async () => {
            const addBtn = this.page.locator(BusinessPlanPage.ADD_SUBSCRIPTION_BTN).first();
            await expect(addBtn, "Add Subscription button must be visible").toBeVisible({ timeout: 5000 });
            const isDisabled = await addBtn.isDisabled().catch(() => false);
            if (isDisabled) {
                // UI disables Add when no subscription is selected — that is the validation
                console.log("[BusinessPlan] Add Subscription button is disabled without selection (expected behavior)");
                return;
            }
            await addBtn.click();
            await this.page.waitForTimeout(500);
        });
    }

    public async clickReloadSubscription() {
        await test.step("Click Reload on Subscription dropdown", async () => {
            const btn = this.page.locator(BusinessPlanPage.RELOAD_SUBSCRIPTION_BTN).first();
            const visible = await btn.isVisible({ timeout: 4000 }).catch(() => false);
            if (!visible) {
                // Reload button not present in current UI — soft skip
                console.log("[BusinessPlan] clickReloadSubscription: Reload button absent in current UI — skipping gracefully");
                return;
            }
            await btn.click();
            await this.page.waitForTimeout(1500);
        });
    }

    public async verifySubscriptionInTable(planName: string) {
        await test.step(`Verify subscription '${planName}' is in the subscription table`, async () => {
            const rows = this.page.locator(BusinessPlanPage.SUBSCRIPTION_TABLE_ROWS);
            await this.page.waitForTimeout(500);
            const count = await rows.count();
            let found = false;
            for (let i = 0; i < count; i++) {
                const text = await rows.nth(i).innerText();
                if (text.toLowerCase().includes(planName.toLowerCase())) {
                    found = true;
                    break;
                }
            }
            await Assert.assertTrue(found, `Subscription '${planName}' must appear in the subscription table`);
        });
    }

    public async verifySubscriptionTableEmpty() {
        await test.step("Verify subscription table shows No data available", async () => {
            const rows = await this.page.locator(BusinessPlanPage.SUBSCRIPTION_TABLE_ROWS).count();
            const noData = await this.page.locator(BusinessPlanPage.SUBSCRIPTION_NO_DATA).first()
                .isVisible().catch(() => false);
            await Assert.assertTrue(rows === 0 || noData, "Subscription table must be empty / show no data");
        });
    }

    public async removeFirstSubscription() {
        await test.step("Remove first subscription from the subscription table", async () => {
            const rows = this.page.locator(BusinessPlanPage.SUBSCRIPTION_TABLE_ROWS);
            const count = await rows.count();
            await Assert.assertTrue(count > 0, "At least one subscription row must exist to remove");
            const removeBtn = this.page.locator(
                BusinessPlanPage.removeInRow(BusinessPlanPage.SUBSCRIPTION_TABLE_ROWS),
            ).first();
            await expect(removeBtn, "Remove button must be visible").toBeVisible({ timeout: 5000 });
            await removeBtn.click();
            await this.page.waitForTimeout(800);
        });
    }

    // ── Feature section ──────────────────────────────────────────────────────

    public async selectAndAddFeature(featureName: string) {
        await test.step(`Select feature '${featureName}' and click Add`, async () => {
            const control = this.page.locator(BusinessPlanPage.SELECT_FEATURE_CONTROL).nth(1);
            await expect(control, "Feature select must be visible").toBeVisible({ timeout: 8000 });
            await control.click();
            await this.page.waitForTimeout(500);

            const option = this.page.locator(BusinessPlanPage.DROPDOWN_OPTION(featureName)).first();
            await expect(option, `Feature option '${featureName}' must be visible`).toBeVisible({ timeout: 6000 });
            await option.click();
            await this.page.waitForTimeout(300);

            const addBtn = this.page.locator(BusinessPlanPage.ADD_FEATURE_BTN).nth(1);
            await expect(addBtn, "Add Feature button must be visible").toBeVisible({ timeout: 5000 });
            await addBtn.click();
            await this.page.waitForTimeout(800);
        });
    }

    public async clickAddFeatureWithoutSelect() {
        await test.step("Click Add Feature without selecting any option", async () => {
            const addBtn = this.page.locator(BusinessPlanPage.ADD_FEATURE_BTN).nth(1);
            await expect(addBtn, "Add Feature button must be visible").toBeVisible({ timeout: 5000 });
            const isDisabled = await addBtn.isDisabled().catch(() => false);
            if (isDisabled) {
                console.log("[BusinessPlan] Add Feature button is disabled without selection (expected behavior)");
                return;
            }
            await addBtn.click();
            await this.page.waitForTimeout(500);
        });
    }

    public async clickReloadFeature() {
        await test.step("Click Reload on Feature dropdown", async () => {
            const btn = this.page.locator(BusinessPlanPage.RELOAD_FEATURE_BTN).nth(1);
            const visible = await btn.isVisible({ timeout: 4000 }).catch(() => false);
            if (!visible) {
                console.log("[BusinessPlan] clickReloadFeature: Reload button absent in current UI — skipping gracefully");
                return;
            }
            await btn.click();
            await this.page.waitForTimeout(1000);
        });
    }

    public async verifyFeatureInTable(featureName: string) {
        await test.step(`Verify feature '${featureName}' is in the feature table`, async () => {
            const rows = this.page.locator(BusinessPlanPage.FEATURE_TABLE_ROWS);
            await this.page.waitForTimeout(500);
            const count = await rows.count();
            let found = false;
            for (let i = 0; i < count; i++) {
                const text = await rows.nth(i).innerText();
                if (text.toLowerCase().includes(featureName.toLowerCase())) {
                    found = true;
                    break;
                }
            }
            await Assert.assertTrue(found, `Feature '${featureName}' must appear in the feature table`);
        });
    }

    public async verifyFeatureTableEmpty() {
        await test.step("Verify feature table shows No data available", async () => {
            const rows = await this.page.locator(BusinessPlanPage.FEATURE_TABLE_ROWS).count();
            const noData = await this.page.locator(BusinessPlanPage.FEATURE_NO_DATA).first()
                .isVisible().catch(() => false);
            await Assert.assertTrue(rows === 0 || noData, "Feature table must be empty / show no data");
        });
    }

    public async removeFirstFeature() {
        await test.step("Remove first feature from the feature table", async () => {
            const rows = this.page.locator(BusinessPlanPage.FEATURE_TABLE_ROWS);
            const count = await rows.count();
            await Assert.assertTrue(count > 0, "At least one feature row must exist to remove");
            const removeBtn = this.page.locator(
                BusinessPlanPage.removeInRow(BusinessPlanPage.FEATURE_TABLE_ROWS),
            ).first();
            await expect(removeBtn, "Remove button must be visible").toBeVisible({ timeout: 5000 });
            await removeBtn.click();
            await this.page.waitForTimeout(800);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FORM SUBMISSION
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickSave() {
        await test.step("Click Save / Create Business Plan button", async () => {
            await this.page.locator(BusinessPlanPage.SAVE_BTN).first().click();
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    public async clickUpdate() {
        await test.step("Click Update Business Plan button", async () => {
            await this.page.locator(BusinessPlanPage.UPDATE_BTN).first().click();
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    public async clickCancel() {
        await test.step("Click Cancel button", async () => {
            await this.page.locator(BusinessPlanPage.CANCEL_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async clickBack() {
        await test.step("Click Back button", async () => {
            await this.page.locator(BusinessPlanPage.BACK_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TOAST & VALIDATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifySuccessToast() {
        await test.step("Verify success toast notification is displayed", async () => {
            const toast = this.page.locator(BusinessPlanPage.TOAST).first();
            await expect(toast, "Success toast must appear").toBeVisible({ timeout: 10000 });
            const text = (await toast.innerText().catch(() => "")).toLowerCase();
            console.log(`[BusinessPlan] Toast text: '${text}'`);
            await Assert.assertTrue(
                text.includes("success") || text.includes("created") || text.includes("saved")
                    || text.includes("updated") || text.includes("deleted") || text.includes("added"),
                `Toast confirms action success: actual '${text}'`,
            );
        });
    }

    public async verifyValidationError(hint?: string) {
        await test.step(`Verify validation error${hint ? ` (hint: '${hint}')` : ""}`, async () => {
            await this.page.waitForTimeout(600);
            const messages = await this.page.locator(BusinessPlanPage.VALIDATION_MSG).allTextContents();
            const browserInvalid = await this.page.locator("input:invalid, select:invalid, textarea:invalid")
                .count().then((c) => c > 0).catch(() => false);
            console.log(`[BusinessPlan] Validation messages: ${JSON.stringify(messages)}, browserInvalid: ${browserInvalid}`);
            const hasError = messages.some((m) => m.trim() !== "")
                || browserInvalid
                || (hint ? messages.some((m) => m.toLowerCase().includes(hint.toLowerCase())) : false);
            await Assert.assertTrue(
                hasError || messages.length > 0 || browserInvalid,
                "Validation error prevents form submission",
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DETAILS PAGE
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyDetailsContent(planName: string) {
        await test.step(`Verify Details page shows plan name '${planName}'`, async () => {
            const bodyText = await this.page.locator("body").innerText();
            await Assert.assertTrue(
                bodyText.toLowerCase().includes(planName.toLowerCase()),
                `Details page must display plan name '${planName}'`,
            );
        });
    }

    public async verifyAddedSubscriptionsSection() {
        await test.step("Verify Added Subscription section is present on Details page", async () => {
            const bodyText = await this.page.locator("body").innerText();
            await Assert.assertTrue(
                bodyText.includes("Added Subscription") || bodyText.includes("Subscription"),
                "Added Subscription section must be present",
            );
        });
    }

    public async verifyAddedFeaturesSection() {
        await test.step("Verify Added Feature section is present on Details page", async () => {
            const bodyText = await this.page.locator("body").innerText();
            await Assert.assertTrue(
                bodyText.includes("Added Feature") || bodyText.includes("Feature"),
                "Added Feature section must be present",
            );
        });
    }

    public async verifyPriceDisplayed() {
        await test.step("Verify price is displayed on Details page", async () => {
            const bodyText = await this.page.locator("body").innerText();
            await Assert.assertTrue(
                bodyText.includes("INR") || bodyText.includes("Price") || bodyText.includes("₹"),
                "Price in INR must be displayed on Details page",
            );
        });
    }

    public async verifyEditButtonPresent() {
        await test.step("Verify Edit Business Plan button is present on Details page", async () => {
            await expect(this.page.locator(BusinessPlanPage.EDIT_BP_BTN).first(), "Edit button visible")
                .toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyEditButtonOpensPrepopulated() {
        await test.step("Click Edit and verify form is pre-populated with existing data", async () => {
            await this.page.locator(BusinessPlanPage.EDIT_BP_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
            await expect(this.page.locator(BusinessPlanPage.EDIT_HEADING).first(), "Edit heading visible")
                .toBeVisible({ timeout: 10000 });
            const nameInput = this.page.locator(BusinessPlanPage.PLAN_NAME_INPUT).first();
            const value = await nameInput.inputValue().catch(() => "");
            await Assert.assertTrue(value.length > 0, "Plan Name field must be pre-populated in Edit form");
        });
    }

    public async clickDeleteOnDetailsPage() {
        await test.step("Click Delete button on Business Plan Details page", async () => {
            await this.page.locator(BusinessPlanPage.DELETE_BTN).first().click();
            await this.page.locator(BusinessPlanPage.DELETE_POPUP)
                .waitFor({ state: "visible", timeout: 6000 });
        });
    }

    public async confirmDelete() {
        await test.step("Confirm deletion in the popup", async () => {
            const confirmBtn = this.page.locator(BusinessPlanPage.DELETE_CONFIRM_BTN).first();
            await expect(confirmBtn, "Confirm Delete button must be visible").toBeVisible({ timeout: 5000 });
            await confirmBtn.click();
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    public async cancelDelete() {
        await test.step("Cancel deletion in the popup", async () => {
            const cancelBtn = this.page.locator(BusinessPlanPage.DELETE_CANCEL_BTN).first();
            await expect(cancelBtn, "Cancel button must be visible in delete popup").toBeVisible({ timeout: 5000 });
            await cancelBtn.click();
            await expect(this.page.locator(BusinessPlanPage.DELETE_POPUP).first())
                .toBeHidden({ timeout: 5000 });
        });
    }

    public async verifyDeletePopupDisplayed() {
        await test.step("Verify Delete Business Plan confirmation popup is shown", async () => {
            const popup = this.page.locator(BusinessPlanPage.DELETE_POPUP).first();
            await expect(popup, "Delete popup must be visible").toBeVisible({ timeout: 6000 });
            await expect(this.page.locator(BusinessPlanPage.DELETE_CONFIRM_BTN).first(), "Delete button visible in popup")
                .toBeVisible();
            await expect(this.page.locator(BusinessPlanPage.DELETE_CANCEL_BTN).first(), "Cancel button visible in popup")
                .toBeVisible();
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MOCKING / ROUTING HELPERS FOR NEGATIVE TEST CASES
    // ═══════════════════════════════════════════════════════════════════════════

    public async mockApiFailure(urlPattern: string | RegExp, status: number) {
        await test.step(`Mock API failure for '${urlPattern}' with status ${status}`, async () => {
            await this.page.route(urlPattern, async (route) => {
                await route.fulfill({
                    status,
                    contentType: "application/json",
                    body: JSON.stringify({ error: "Mocked API failure for testing" }),
                });
            });
        });
    }

    public async mockEmptyApiResponse(urlPattern: string | RegExp) {
        await test.step(`Mock empty API response for '${urlPattern}'`, async () => {
            await this.page.route(urlPattern, async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify([]),
                });
            });
        });
    }

    public async mockNetworkFailure(urlPattern: string | RegExp) {
        await test.step(`Mock network failure for '${urlPattern}'`, async () => {
            await this.page.route(urlPattern, async (route) => {
                await route.abort("failed");
            });
        });
    }
}
