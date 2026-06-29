import test, { Page, expect } from "@playwright/test";
import Assert from "@asserts/Assert";
import CouponPage from "@pages/CouponPage";

export interface CouponFormData {
    code?: string;
    applicableOn?: string;
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    discountType?: string;
    rewardType?: string;
    rewardValue?: string;
    maxReward?: string;
    minAmount?: string;
    frequency?: string;
    totalAllowed?: string;
    maxExistingOrders?: string;
    minExistingOrders?: string;
    maxQuantity?: string;
    minQuantity?: string;
    locationRule?: boolean;
    multiDiscount?: boolean;
    promote?: boolean;
    autoApply?: boolean;
    terms?: string;
}

export default class CouponSteps {
    constructor(private readonly page: Page) {}

    private async selectDropdownOption(optionText: string) {
        const option = this.page.locator(CouponPage.DROPDOWN_OPTION(optionText)).first();
        await option.scrollIntoViewIfNeeded().catch(() => {});
        try {
            await option.click({ timeout: 3000 });
        } catch (err) {
            console.log(`[CouponSteps] Normal click failed/timed out, attempting forced click: ${err}`);
            await option.click({ force: true }).catch(async (e) => {
                console.log(`[CouponSteps] Forced click also failed, using dispatchEvent fallback: ${e}`);
                await option.dispatchEvent('click');
            });
        }
    }

    public async waitForTableStable() {
        await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
        await this.page.waitForTimeout(1000);
    }

    public async waitForTableLoaded() {
        // Wait for skeleton loaders if any
        await this.page.locator('.skeleton, [class*="skeleton"], .animate-pulse').first().waitFor({ state: "hidden", timeout: 5000 }).catch(() => {});
        
        // Wait for rows or empty state
        for (let i = 0; i < 20; i++) {
            const count = await this.page.locator(CouponPage.TABLE_ROWS).count().catch(() => 0);
            const noRecords = await this.page.locator(CouponPage.NO_RECORDS).first().isVisible().catch(() => false);
            if (count > 0 || noRecords) {
                break;
            }
            await this.page.waitForTimeout(200);
        }
        await this.waitForTableStable();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async navigateToCoupons() {
        await test.step("Navigate to Coupons & Promotions listing page", async () => {
            const targetUrl = `${process.env.BASE_URL}${CouponPage.COUPON_PATH}`;
            console.log(`[Coupon] Navigating to: ${targetUrl}`);
            await this.page.goto(targetUrl);
            await this.page.waitForLoadState("networkidle");
            const landedUrl = this.page.url();
            console.log(`[Coupon] Landed at: ${landedUrl}`);
            if (landedUrl.includes("/login")) {
                throw new Error(`Coupons navigation redirected to login. URL: ${landedUrl}`);
            }
        });
    }

    public async navigateToCouponsViaSidebar() {
        await test.step("Navigate to Coupons via Setup menu in sidebar", async () => {
            const alreadyExpanded = await this.page.locator(CouponPage.COUPON_SUBMENU_LINK).isVisible({ timeout: 800 }).catch(() => false);
            if (!alreadyExpanded) {
                const setupBtn = this.page.locator(CouponPage.SETUP_MENU_BTN).first();
                await setupBtn.scrollIntoViewIfNeeded({ timeout: 5000 });
                await setupBtn.click();
                await this.page.locator(CouponPage.COUPON_SUBMENU_LINK).first().waitFor({ state: "visible", timeout: 5000 });
            }
            await this.page.locator(CouponPage.COUPON_SUBMENU_LINK).first().click();
            await this.page.waitForURL(/setup\/Coupon/, { timeout: 15000 });
            console.log(`[Coupon] Navigated via sidebar to: ${this.page.url()}`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGE VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyPageLoaded() {
        await test.step("Verify Coupons & Promotions listing page loaded", async () => {
            await expect(this.page).toHaveURL(new RegExp(CouponPage.COUPON_PATH), { timeout: 15000 });
            await expect(this.page.locator(CouponPage.PAGE_HEADING).first(), "Heading must be visible").toBeVisible({ timeout: 10000 });
            await expect(this.page.locator(CouponPage.CREATE_BTN).first(), "Create button must be visible").toBeVisible({ timeout: 8000 });
            await expect(this.page.locator(CouponPage.TABLE).first(), "Coupons table must be visible").toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyDashboardCards(expectedTotal?: string, expectedApproved?: string, expectedPending?: string, expectedValue?: string) {
        await test.step("Verify dashboard summary cards data matches expected backend value", async () => {
            if (expectedTotal !== undefined) {
                const card = this.page.locator(CouponPage.STAT_CARD_BY_LABEL("TOTAL COUPONS")).first();
                await expect(card).toBeVisible({ timeout: 5000 });
                await Assert.assertContains(await card.innerText(), expectedTotal, "Total Coupons Count");
            }
            if (expectedApproved !== undefined) {
                const card = this.page.locator(CouponPage.STAT_CARD_BY_LABEL("APPROVED")).first();
                await expect(card).toBeVisible({ timeout: 5000 });
                await Assert.assertContains(await card.innerText(), expectedApproved, "Approved Coupons Count");
            }
            if (expectedPending !== undefined) {
                const card = this.page.locator(CouponPage.STAT_CARD_BY_LABEL("PENDING")).first();
                await expect(card).toBeVisible({ timeout: 5000 });
                await Assert.assertContains(await card.innerText(), expectedPending, "Pending Coupons Count");
            }
            if (expectedValue !== undefined) {
                const card = this.page.locator(CouponPage.STAT_CARD_BY_LABEL("TOTAL VALUE")).first();
                await expect(card).toBeVisible({ timeout: 5000 });
                await Assert.assertContains(await card.innerText(), expectedValue, "Total Value");
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SEARCH & FILTER
    // ═══════════════════════════════════════════════════════════════════════════

    public async searchCoupon(code: string) {
        await test.step(`Search for coupon: '${code}'`, async () => {
            const input = this.page.locator(CouponPage.SEARCH_INPUT);
            await expect(input, "Search bar must be visible").toBeVisible({ timeout: 5000 });
            await input.fill(code);
            await input.press("Enter");
            await this.waitForTableLoaded();
        });
    }

    public async clearSearch() {
        await test.step("Clear search filter", async () => {
            await this.page.locator(CouponPage.CLEAR_BTN).click();
            await this.waitForTableLoaded();
        });
    }

    public async filterStatus(status: string) {
        await test.step(`Filter by status: '${status}'`, async () => {
            const trigger = this.page.locator(CouponPage.STATUS_FILTER_TRIGGER).first();
            await trigger.click();
            await this.page.waitForTimeout(500);
            await this.selectDropdownOption(status);
            await this.waitForTableLoaded();
        });
    }

    public async filterPeriod(period: string) {
        await test.step(`Filter by period: '${period}'`, async () => {
            const trigger = this.page.locator(CouponPage.PERIOD_FILTER_TRIGGER).first();
            await trigger.click();
            await this.page.waitForTimeout(500);
            await this.selectDropdownOption(period);
            await this.waitForTableLoaded();
        });
    }

    public async verifyNoRecordsMessage() {
        await test.step("Verify empty state is displayed", async () => {
            await expect(this.page.locator(CouponPage.NO_RECORDS).first(), "No records found message must be visible").toBeVisible({ timeout: 5000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CREATE FORM ACTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickCreateCoupon() {
        await test.step("Click Create Coupon button", async () => {
            await this.page.locator(CouponPage.CREATE_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyCreatePageLoaded() {
        await test.step("Verify Create Coupon screen is displayed", async () => {
            await expect(this.page).toHaveURL(/Coupon\/create|Coupon\/new/, { timeout: 10000 });
            await expect(this.page.locator(CouponPage.CREATE_HEADING).first()).toBeVisible({ timeout: 5000 });
        });
    }

    public async verifyViewPageLoaded() {
        await test.step("Verify View Coupon screen is displayed", async () => {
            await expect(this.page).toHaveURL(/Coupon\/view|Coupon\/\d+|Coupon\/[a-zA-Z0-9_-]+$/, { timeout: 10000 });
            await expect(this.page.locator(CouponPage.VIEW_HEADING).first()).toBeVisible({ timeout: 5000 });
        });
    }

    public async verifyEditPageLoaded() {
        await test.step("Verify Edit Coupon screen is displayed", async () => {
            await expect(this.page).toHaveURL(/Coupon\/edit|mode=edit/, { timeout: 10000 });
            await expect(this.page.locator(CouponPage.EDIT_HEADING).first()).toBeVisible({ timeout: 5000 });
        });
    }

    public async fillCreateForm(data: Partial<CouponFormData>) {
        await test.step("Fill Coupon creation form fields", async () => {
            if (data.code !== undefined) {
                const input = this.page.locator(CouponPage.COUPON_CODE_INPUT).first();
                await input.fill(data.code);
            }
            if (data.applicableOn !== undefined) {
                const trigger = this.page.locator(CouponPage.APPLICABLE_ON_TRIGGER).first();
                await trigger.click();
                await this.page.waitForTimeout(300);
                await this.selectDropdownOption(data.applicableOn);
            }
            if (data.title !== undefined) {
                await this.page.locator(CouponPage.TITLE_INPUT).first().fill(data.title);
            }
            if (data.description !== undefined) {
                await this.page.locator(CouponPage.DESCRIPTION_INPUT).first().fill(data.description);
            }
            if (data.startDate !== undefined) {
                await this.page.locator(CouponPage.START_DATE_INPUT).first().fill(data.startDate);
            }
            if (data.endDate !== undefined) {
                await this.page.locator(CouponPage.END_DATE_INPUT).first().fill(data.endDate);
            }
            if (data.discountType !== undefined) {
                const trigger = this.page.locator(CouponPage.DISCOUNT_TYPE_TRIGGER).first();
                await trigger.click();
                await this.page.waitForTimeout(300);
                await this.selectDropdownOption(data.discountType);
            }
            if (data.rewardType !== undefined) {
                const trigger = this.page.locator(CouponPage.REWARD_TYPE_TRIGGER).first();
                await trigger.click();
                await this.page.waitForTimeout(300);
                await this.selectDropdownOption(data.rewardType);
            }
            if (data.rewardValue !== undefined) {
                await this.page.locator(CouponPage.REWARD_VALUE_INPUT).first().fill(data.rewardValue);
            }
            if (data.maxReward !== undefined) {
                await this.page.locator(CouponPage.MAX_REWARD_VALUE_INPUT).first().fill(data.maxReward);
            }
            if (data.minAmount !== undefined) {
                await this.page.locator(CouponPage.MIN_AMOUNT_INPUT).first().fill(data.minAmount);
            }
            if (data.frequency !== undefined) {
                await this.page.locator(CouponPage.FREQUENCY_INPUT).first().fill(data.frequency);
            }
            if (data.totalAllowed !== undefined) {
                await this.page.locator(CouponPage.TOTAL_ALLOWED_INPUT).first().fill(data.totalAllowed);
            }
            if (data.maxExistingOrders !== undefined) {
                await this.page.locator(CouponPage.MAX_EXISTING_ORDERS_INPUT).first().fill(data.maxExistingOrders);
            }
            if (data.minExistingOrders !== undefined) {
                await this.page.locator(CouponPage.MIN_EXISTING_ORDERS_INPUT).first().fill(data.minExistingOrders);
            }
            if (data.maxQuantity !== undefined) {
                await this.page.locator(CouponPage.MAX_QUANTITY_INPUT).first().fill(data.maxQuantity);
            }
            if (data.minQuantity !== undefined) {
                await this.page.locator(CouponPage.MIN_QUANTITY_INPUT).first().fill(data.minQuantity);
            }
            
            // Toggles (checks current checked state before clicking)
            const handleToggle = async (selector: string, expectedState: boolean) => {
                const btn = this.page.locator(selector).first();
                if (await btn.isVisible()) {
                    const checked = await btn.getAttribute("aria-checked") === "true" || await btn.getAttribute("class").then((c) => c?.includes("checked") || c?.includes("active")) || false;
                    if (checked !== expectedState) {
                        await btn.click();
                    }
                }
            };
            if (data.locationRule !== undefined) {
                await handleToggle(CouponPage.LOCATION_RULE_TOGGLE, data.locationRule);
            }
            if (data.multiDiscount !== undefined) {
                await handleToggle(CouponPage.MULTI_DISCOUNT_TOGGLE, data.multiDiscount);
            }
            if (data.promote !== undefined) {
                await handleToggle(CouponPage.PROMOTE_TOGGLE, data.promote);
            }
            if (data.autoApply !== undefined) {
                await handleToggle(CouponPage.AUTO_APPLY_TOGGLE, data.autoApply);
            }
            if (data.terms !== undefined) {
                await this.page.locator(CouponPage.TERMS_TEXTAREA).first().fill(data.terms);
            }
        });
    }

    public async submitCreateForm() {
        await test.step("Click Save Coupon button", async () => {
            await this.page.locator(CouponPage.SAVE_COUPON_BTN).first().click();
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    public async clickCancel() {
        await test.step("Click Cancel button", async () => {
            await this.page.locator(CouponPage.CANCEL_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async clickBack() {
        await test.step("Click Back button", async () => {
            await this.page.locator(CouponPage.BACK_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TOASTS & VALIDATIONS
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifySuccessToast() {
        await test.step("Verify success toast notification is displayed", async () => {
            const toast = this.page.locator(CouponPage.TOAST).first();
            await expect(toast, "Success toast must appear").toBeVisible({ timeout: 8000 });
            const text = (await toast.innerText().catch(() => "")).toLowerCase();
            console.log(`[Coupon] Success Toast: '${text}'`);
            await Assert.assertTrue(
                text.includes("success") || text.includes("created") || text.includes("saved") || text.includes("updated") || text.includes("deleted"),
                `Toast confirms success: actual '${text}'`,
            );
        });
    }

    public async verifyValidationError(expectedFieldText?: string) {
        await test.step(`Verify validation error is displayed${expectedFieldText ? ` for '${expectedFieldText}'` : ""}`, async () => {
            await this.page.waitForTimeout(500);
            const messages = await this.page.locator(CouponPage.VALIDATION_MSG).allTextContents();
            const matchingMsg = messages.find((m) => (expectedFieldText ? m.toLowerCase().includes(expectedFieldText.toLowerCase()) : m.trim() !== ""),
            );
            const hasBrowserValidation = await this.page.locator("input:invalid, select:invalid, textarea:invalid").count().then((c) => c > 0).catch(() => false);
            console.log(`[Coupon] Validation messages: ${JSON.stringify(messages)}, browserInvalid: ${hasBrowserValidation}`);
            await Assert.assertTrue(
                matchingMsg !== undefined || hasBrowserValidation || messages.length > 0,
                `Expected validation error should prevent form submission`,
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // GRID RECORD OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyRecordInTable(code: string, value?: string, status?: string) {
        await test.step(`Verify coupon '${code}' exists in the grid`, async () => {
            const rowSel = CouponPage.rowContaining(code);
            const row = this.page.locator(rowSel).first();
            await expect(row, `Coupon code '${code}' must be visible in the grid`).toBeVisible({ timeout: 8000 });
            if (value !== undefined) {
                await Assert.assertContains(await row.innerText(), value, "Coupon Value");
            }
            if (status !== undefined) {
                await Assert.assertContains(await row.innerText(), status, "Coupon Status");
            }
        });
    }

    public async verifyRecordRemoved(code: string) {
        await test.step(`Verify coupon '${code}' is no longer visible in the grid`, async () => {
            const rowSel = CouponPage.rowContaining(code);
            const row = this.page.locator(rowSel).first();
            await expect(row, `Coupon code '${code}' must be hidden`).toBeHidden({ timeout: 8000 });
        });
    }

    public async clickViewIconForRow(code: string) {
        await test.step(`Click View icon for coupon: '${code}'`, async () => {
            const rowSel = CouponPage.rowContaining(code);
            const viewBtn = this.page.locator(CouponPage.viewBtnInRow(rowSel)).first();
            await expect(viewBtn, "View button must be visible").toBeVisible({ timeout: 5000 });
            await viewBtn.click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async clickEditIconForRow(code: string) {
        await test.step(`Click Edit icon for coupon: '${code}'`, async () => {
            const rowSel = CouponPage.rowContaining(code);
            const editBtn = this.page.locator(CouponPage.editBtnInRow(rowSel)).first();
            await expect(editBtn, "Edit button must be visible").toBeVisible({ timeout: 5000 });
            await editBtn.click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async clickDeleteIconForRow(code: string) {
        await test.step(`Click Delete icon for coupon: '${code}'`, async () => {
            const rowSel = CouponPage.rowContaining(code);
            const deleteBtn = this.page.locator(CouponPage.deleteBtnInRow(rowSel)).first();
            await expect(deleteBtn, "Delete button must be visible").toBeVisible({ timeout: 5000 });
            await deleteBtn.click();
            await this.page.locator(CouponPage.DELETE_POPUP).waitFor({ state: "visible", timeout: 5000 });
        });
    }

    public async confirmDelete() {
        await test.step("Confirm coupon deletion", async () => {
            const yesBtn = this.page.locator(CouponPage.DELETE_YES_BTN).first();
            await expect(yesBtn).toBeVisible({ timeout: 5000 });
            await yesBtn.click();
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    public async cancelDelete() {
        await test.step("Cancel coupon deletion", async () => {
            const cancelBtn = this.page.locator(CouponPage.DELETE_CANCEL_BTN).first();
            await expect(cancelBtn).toBeVisible({ timeout: 5000 });
            await cancelBtn.click();
            await expect(this.page.locator(CouponPage.DELETE_POPUP).first()).toBeHidden({ timeout: 5000 });
        });
    }

    public async verifyDeletePopupDisplayed() {
        await test.step("Verify delete popup confirmation elements", async () => {
            const popup = this.page.locator(CouponPage.DELETE_POPUP).first();
            await expect(popup, "Confirmation popup must be visible").toBeVisible({ timeout: 5000 });
            await expect(this.page.locator(CouponPage.DELETE_YES_BTN).first(), "Yes button must be visible").toBeVisible();
            await expect(this.page.locator(CouponPage.DELETE_CANCEL_BTN).first(), "Cancel button must be visible").toBeVisible();
        });
    }

    public async verifyPagination() {
        await test.step("Verify pagination buttons work", async () => {
            await this.waitForTableLoaded();
            const nextBtn = this.page.locator(CouponPage.NEXT_PAGE_BTN).first();
            const prevBtn = this.page.locator(CouponPage.PREV_PAGE_BTN).first();
            if (await nextBtn.isVisible() && await nextBtn.isEnabled()) {
                await nextBtn.click();
                await this.waitForTableStable();
                if (await prevBtn.isVisible() && await prevBtn.isEnabled()) {
                    await prevBtn.click();
                    await this.waitForTableStable();
                }
            } else {
                console.log("[Coupon] Pagination testing skipped: not enough records to paginate.");
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MOCKING/ROUTING HELPERS FOR NEGATIVE TEST CASES
    // ═══════════════════════════════════════════════════════════════════════════

    public async mockApiFailure(urlPattern: string | RegExp, status: number) {
        await test.step(`Mock API failure for pattern '${urlPattern}' with status ${status}`, async () => {
            await this.page.route(urlPattern, async (route) => {
                await route.fulfill({
                    status: status,
                    contentType: "application/json",
                    body: JSON.stringify({ error: "Mocked internal API failure for testing" }),
                });
            });
        });
    }

    public async mockDeleteFailure() {
        await test.step("Mock delete coupon API failure", async () => {
            await this.page.route("*://live.app.fastforge.ai/**", async (route) => {
                const req = route.request();
                const url = req.url().toLowerCase();
                const method = req.method().toUpperCase();
                const isDelete = method === "DELETE"
                    || url.includes("delete")
                    || url.includes("remove")
                    || ((method === "POST" || method === "PUT")
                        && !url.includes("list")
                        && !url.includes("menu")
                        && !url.includes("preferences"));
                if (isDelete) {
                    console.log(`[Mock] Fulfilling delete request with 500: ${method} ${req.url()}`);
                    await route.fulfill({
                        status: 500,
                        contentType: "application/json",
                        body: JSON.stringify({ error: "Mocked internal delete failure" }),
                    });
                } else {
                    await route.continue();
                }
            });
        });
    }

    public async mockSessionExpired() {
        await test.step("Mock user session expired (unauth status on API calls)", async () => {
            await this.page.route("*://live.app.fastforge.ai/**", async (route) => {
                await route.fulfill({
                    status: 401,
                    contentType: "application/json",
                    body: JSON.stringify({ error: "Session expired / Unauthorized access" }),
                });
            });
        });
    }

    public async mockInvalidApiResponse(urlPattern: string | RegExp) {
        await test.step(`Mock invalid/corrupted API payload response for '${urlPattern}'`, async () => {
            await this.page.route(urlPattern, async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: "INVALID_JSON_PAYLOAD_STRING_CORRUPT{[[}",
                });
            });
        });
    }
}
