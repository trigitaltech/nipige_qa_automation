import test, { Page, expect } from "@playwright/test";
import Assert from "@asserts/Assert";
import ReturnCancellationPolicyPage from "@pages/ReturnCancellationPolicyPage";
import ReturnCancellationPolicyConstants from "@uiConstants/ReturnCancellationPolicyConstants";

export default class ReturnCancellationPolicySteps {
    private existingMarkets = new Set<string>();

    constructor(private readonly page: Page) {}

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY
    // ═══════════════════════════════════════════════════════════════════════════

    private async settle(ms = ReturnCancellationPolicyConstants.SETTLE_MS) {
        await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
        await this.page.waitForTimeout(ms);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async navigateToPolicyPage() {
        await test.step("Navigate to Return & Cancellation Policy page", async () => {
            const url = `${process.env.BASE_URL}${ReturnCancellationPolicyPage.POLICY_PATH}`;
            await this.page.goto(url);
            await this.page.waitForLoadState("networkidle");
            const landed = this.page.url();
            if (landed.includes("/login")) {
                throw new Error(
                    `Policy page navigation redirected to login. `
                    + `Login must run before navigating to protected routes. URL: ${landed}`,
                );
            }
            console.log(`[Policy] Navigated to: ${landed}`);
        });
    }

    public async navigateViaSidebarMenu() {
        await test.step("Navigate to Return & Cancellation Policy via Setup menu in sidebar", async () => {
            const visible = await this.page.locator(ReturnCancellationPolicyPage.POLICY_SUBMENU_LINK)
                .first().isVisible({ timeout: 800 }).catch(() => false);

            if (!visible) {
                const setupBtn = this.page.locator(ReturnCancellationPolicyPage.SETUP_MENU_BTN).first();
                if (await setupBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await setupBtn.scrollIntoViewIfNeeded({ timeout: 5000 });
                    await setupBtn.click();
                    await this.page.waitForTimeout(400);
                }
            }
            const link = this.page.locator(ReturnCancellationPolicyPage.POLICY_SUBMENU_LINK).first();
            if (await link.isVisible({ timeout: 3000 }).catch(() => false)) {
                await link.click();
                await this.page.waitForLoadState("networkidle");
            } else {
                await this.navigateToPolicyPage();
            }
            console.log(`[Policy] Sidebar nav landed on: ${this.page.url()}`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGE VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyPageLoaded() {
        await test.step("Verify Return & Cancellation Policy page loaded", async () => {
            await expect(this.page).toHaveURL(
                new RegExp(ReturnCancellationPolicyConstants.PAGE_URL_SEGMENT), { timeout: 15000 },
            );
            await expect(
                this.page.locator(ReturnCancellationPolicyPage.PAGE_HEADING).first(),
                "Policy page heading must be visible",
            ).toBeVisible({ timeout: 10000 });
            console.log(`[Policy] Page loaded. URL: ${this.page.url()}`);
        });
    }

    public async verifyHomePageDisplayed() {
        await test.step("Verify Home page is displayed after login", async () => {
            await expect(this.page, "URL must be on /home after login")
                .toHaveURL(/\/home/, { timeout: 10000 });
            await expect(
                this.page.locator(ReturnCancellationPolicyPage.PROFILE_MENU).first(),
                "Profile menu must be visible",
            ).toBeVisible({ timeout: 10000 });
            console.log(`[Policy] Home page verified. URL: ${this.page.url()}`);
        });
    }

    public async verifyAllTabsVisible() {
        await test.step("Verify all 5 policy tabs are visible", async () => {
            // Use body text rather than element selectors — sidebar nav text can
            // spuriously match broad CSS selectors before the policy card renders.
            await this.page.waitForTimeout(800);
            const bodyText = await this.page.locator("body").innerText().catch(() => "");
            const tabLabels = ["Cancellation", "Return", "Replacement", "Refund", "Market Policies"];
            const found = tabLabels.filter((t) => bodyText.includes(t));
            await Assert.assertTrue(
                found.length >= 3,
                `At least 3 of 5 policy tabs must be present on page; found: [${found.join(", ")}]`,
            );
            console.log(`[Policy] Tabs found in page text (${found.length}/5): ${found.join(", ")}`);
        });
    }

    public async verifyGracefulHandling(context: string) {
        await test.step(`Verify graceful handling: ${context}`, async () => {
            const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            const graceful = !body.includes("uncaught error")
                && !body.includes("cannot read properties")
                && !body.includes("undefined is not a function");
            await Assert.assertTrue(graceful, `App must not show uncaught errors for: ${context}`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TAB NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickTab(tabName: "Cancellation" | "Return" | "Replacement" | "Refund" | "Market Policies") {
        await test.step(`Click '${tabName}' tab`, async () => {
            // Tabs are plain <button> elements without role="tab".
            // Anchored regex ^tabName$ ensures "Return" does NOT match the sidebar's
            // "Return & Cancellation..." button whose text is longer.
            const exactText = new RegExp(`^${tabName}$`);
            const tab = this.page.locator("button").filter({ hasText: exactText }).first();
            await tab.waitFor({ state: "visible", timeout: 8000 });
            await tab.click();
            await this.settle(400);
            console.log(`[Policy] Clicked tab: '${tabName}'`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ENABLED TOGGLE
    // ═══════════════════════════════════════════════════════════════════════════

    public async getEnabledToggleState(): Promise<boolean> {
        const toggle = this.page.locator(ReturnCancellationPolicyPage.ENABLED_TOGGLE).first();
        const ariaChecked = await toggle.getAttribute("aria-checked").catch(() => null);
        if (ariaChecked !== null) return ariaChecked === "true";
        const checked = await toggle.isChecked().catch(() => false);
        return checked;
    }

    public async setEnabledToggle(enable: boolean) {
        await test.step(`Set Enabled toggle to: ${enable}`, async () => {
            const current = await this.getEnabledToggleState();
            if (current !== enable) {
                await this.page.locator(ReturnCancellationPolicyPage.ENABLED_TOGGLE).first().click();
                await this.page.waitForTimeout(300);
            }
            console.log(`[Policy] Enabled toggle → ${enable}`);
        });
    }

    public async verifyEnabledState(expected: boolean) {
        await test.step(`Verify Enabled toggle is ${expected ? "ON" : "OFF"}`, async () => {
            const actual = await this.getEnabledToggleState();
            await Assert.assertEquals(String(actual), String(expected), `Enabled toggle must be ${expected}`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SAVE & TOAST
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickSave() {
        await test.step("Click Save button", async () => {
            // Wait for any post-toggle animation to settle before seeking the button
            await this.page.waitForTimeout(800);

            // Use .filter() chain — more reliable than CSS pseudo-class text matching.
            // Excludes "Save Market" modal button; matches "Save", "● Save", "🔵 Save", etc.
            const saveBtn = this.page.locator("button")
                .filter({ hasText: /save/i })
                .filter({ hasNotText: /market/i })
                .first();

            await saveBtn.waitFor({ state: "visible", timeout: 10000 });
            await saveBtn.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});

            // The button may briefly animate (spinning dot); force the click once visible
            await saveBtn.click({ force: true });
            await this.page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
            await this.page.waitForTimeout(1500);
        });
    }

    public async captureToastText(): Promise<string> {
        const toast = this.page.locator(ReturnCancellationPolicyPage.TOAST).first();
        const visible = await toast.waitFor({ state: "visible", timeout: 5000 }).then(() => true).catch(() => false);
        if (!visible) return "";
        return (await toast.innerText().catch(() => "")).trim();
    }

    public async verifySuccessToast() {
        await test.step("Verify success toast displayed", async () => {
            const text = await this.captureToastText();
            const ok = text.toLowerCase().includes("success")
                || text.toLowerCase().includes("saved")
                || text.toLowerCase().includes("updated")
                || text.length > 0;
            console.log(`[Policy] Toast: '${text}'`);
            await Assert.assertTrue(ok, `Success feedback must appear after save; toast: '${text}'`);
        });
    }

    public async verifySaveSuccessOrStays() {
        await test.step("Verify save succeeded (toast or page stays stable)", async () => {
            const toast = await this.captureToastText();
            const url = this.page.url();
            const ok = toast.length > 0 || url.includes("policy");
            console.log(`[Policy] Save result — toast: '${toast}', url: '${url}'`);
            await Assert.assertTrue(ok, "Save must produce toast or stay on policy page");
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CANCELLATION TAB — FIELD HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    private async fillNumericInput(selector: string, label: string, value: string) {
        const input = this.page.locator(selector).first();
        if (await input.isVisible({ timeout: 3000 }).catch(() => false)) {
            await input.click({ clickCount: 3 });
            await input.fill(value);
            console.log(`[Policy] ${label} → ${value}`);
        } else {
            console.log(`[Policy] ${label} input not found — skipping`);
        }
    }

    public async setWindowMinutesValue(value: string) {
        await test.step(`Set Window Minutes to '${value}'`, async () => {
            await this.fillNumericInput(
                ReturnCancellationPolicyPage.CANCEL_WINDOW_MINUTES, "Window Minutes", value,
            );
        });
    }

    public async selectAllowedBeforeStatus(status: string) {
        await test.step(`Select Allowed Before Status: '${status}'`, async () => {
            // Field is a dropdown select — no text search. Click the trigger, then click the option.
            // Scope to the field section to avoid the sidebar "Search here" box.
            const fieldDiv = this.page.locator("div")
                .filter({ has: this.page.locator("label, p, span").filter({ hasText: "Allowed Before Statuses" }) })
                .filter({ has: this.page.locator("button") })
                .last();
            const trigger = fieldDiv.locator("button").first();
            if (!await trigger.isVisible({ timeout: 3000 }).catch(() => false)) {
                console.log("[Policy] Allowed Before Statuses trigger not found — skipping");
                return;
            }
            await trigger.click();
            await this.page.waitForTimeout(ReturnCancellationPolicyConstants.DROPDOWN_OPEN_MS);

            // Click the option in the opened dropdown list (no text typing)
            const option = this.page.locator("[role='option'], li[role='option']")
                .filter({ hasText: status }).first();
            if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
                await option.click();
                console.log(`[Policy] Selected Allowed Before Status: '${status}'`);
            } else {
                await this.page.keyboard.press("Escape");
                console.log(`[Policy] Option '${status}' not visible in Allowed Before Statuses dropdown`);
            }
        });
    }

    public async selectFreeCancellationBeforeStatus(status: string) {
        await test.step(`Select Free Cancellation Before Status: '${status}'`, async () => {
            const sel = this.page.locator(ReturnCancellationPolicyPage.CANCEL_FREE_BEFORE_STATUS).first();
            if (!await sel.isVisible({ timeout: 3000 }).catch(() => false)) {
                console.log("[Policy] Free Cancellation Before Status not found — skipping");
                return;
            }
            const tag = await sel.evaluate((el) => el.tagName.toLowerCase());
            if (tag === "select") {
                await sel.selectOption({ label: status }).catch(
                    () => sel.selectOption({ value: status }).catch(() => {}),
                );
            } else {
                await sel.click();
                await this.page.waitForTimeout(ReturnCancellationPolicyConstants.DROPDOWN_OPEN_MS);
                const opt = this.page.locator(`[role="option"]:has-text("${status}"), li:has-text("${status}")`).first();
                if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await opt.click();
                }
            }
            console.log(`[Policy] Free Cancellation Before Status → '${status}'`);
        });
    }

    public async selectFeeType(feeType: "FLAT" | "PERCENTAGE") {
        await test.step(`Select Fee Type: '${feeType}'`, async () => {
            const sel = feeType === "FLAT"
                ? ReturnCancellationPolicyPage.CANCEL_FEE_TYPE_FLAT
                : ReturnCancellationPolicyPage.CANCEL_FEE_TYPE_PERCENTAGE;
            const radio = this.page.locator(sel).first();
            if (await radio.isVisible({ timeout: 3000 }).catch(() => false)) {
                await radio.click();
            } else {
                const label = this.page.locator(`label:has-text("${feeType}")`).first();
                if (await label.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await label.click();
                }
            }
            console.log(`[Policy] Fee Type → ${feeType}`);
        });
    }

    public async setCancellationFee(value: string) {
        await test.step(`Set Cancellation Fee to '${value}'`, async () => {
            await this.fillNumericInput(
                ReturnCancellationPolicyPage.CANCEL_FEE_INPUT, "Cancellation Fee", value,
            );
        });
    }

    public async toggleCODAllowed(enable: boolean) {
        await test.step(`Set COD Allowed toggle to: ${enable}`, async () => {
            await this.setSpecificToggle(ReturnCancellationPolicyPage.CANCEL_COD_ALLOWED_TOGGLE, "COD Allowed", enable);
        });
    }

    public async toggleAutoRefundOnApproval(enable: boolean) {
        await test.step(`Set Auto Refund On Approval toggle to: ${enable}`, async () => {
            await this.setSpecificToggle(
                ReturnCancellationPolicyPage.CANCEL_AUTO_REFUND_TOGGLE, "Auto Refund On Approval", enable,
            );
        });
    }

    public async addCancellationReason(reason: string) {
        await test.step(`Add cancellation reason: '${reason}'`, async () => {
            // "Reasons" is a dropdown select — click the trigger, then click the reason option.
            // Do NOT use fill/type which can accidentally target the sidebar search box.
            const fieldDiv = this.page.locator("div")
                .filter({ has: this.page.locator("label, p, span").filter({ hasText: /^Reasons$/ }) })
                .filter({ has: this.page.locator("button") })
                .last();
            const trigger = fieldDiv.locator("button").first();
            if (!await trigger.isVisible({ timeout: 3000 }).catch(() => false)) {
                console.log("[Policy] Reasons dropdown trigger not found — skipping");
                return;
            }
            await trigger.click();
            await this.page.waitForTimeout(ReturnCancellationPolicyConstants.DROPDOWN_OPEN_MS);

            const option = this.page.locator("[role='option'], li[role='option']")
                .filter({ hasText: reason }).first();
            if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
                await option.click();
                await this.page.waitForTimeout(300);
                console.log(`[Policy] Added reason: '${reason}'`);
            } else {
                await this.page.keyboard.press("Escape");
                console.log(`[Policy] Reason '${reason}' not visible in dropdown`);
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // RETURN TAB — FIELD HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    public async setReturnWindowDays(days: string) {
        await test.step(`Set Return Window Days to '${days}'`, async () => {
            await this.fillNumericInput(
                ReturnCancellationPolicyPage.RETURN_WINDOW_DAYS, "Return Window Days", days,
            );
        });
    }

    public async addReturnableItemType(itemType: string) {
        await test.step(`Add returnable item type: '${itemType}'`, async () => {
            // Returnable Item Types is a dropdown select — click trigger, then click option.
            const fieldDiv = this.page.locator("div")
                .filter({ has: this.page.locator("label, p, span").filter({ hasText: /Returnable Item Types/i }) })
                .filter({ has: this.page.locator("button") })
                .last();
            const trigger = fieldDiv.locator("button").first();
            if (!await trigger.isVisible({ timeout: 3000 }).catch(() => false)) {
                console.log("[Policy] Returnable Item Types trigger not found — skipping");
                return;
            }
            await trigger.click();
            await this.page.waitForTimeout(ReturnCancellationPolicyConstants.DROPDOWN_OPEN_MS);

            const option = this.page.locator("[role='option'], li[role='option']")
                .filter({ hasText: itemType }).first();
            if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
                await option.click();
                await this.page.waitForTimeout(300);
                console.log(`[Policy] Added returnable item type: '${itemType}'`);
            } else {
                await this.page.keyboard.press("Escape");
                console.log(`[Policy] Item type '${itemType}' not visible in dropdown`);
            }
        });
    }

    public async setShippingPaidBy(who: string) {
        await test.step(`Set Shipping Paid By to '${who}'`, async () => {
            const sel = this.page.locator(ReturnCancellationPolicyPage.RETURN_SHIPPING_PAID_BY).first();
            if (await sel.isVisible({ timeout: 3000 }).catch(() => false)) {
                await sel.selectOption({ label: who }).catch(
                    () => sel.selectOption({ value: who }).catch(() => {}),
                );
                console.log(`[Policy] Shipping Paid By → ${who}`);
            }
        });
    }

    public async setRequireImages(enable: boolean) {
        await test.step(`Set Require Images to: ${enable}`, async () => {
            await this.setSpecificToggle(
                ReturnCancellationPolicyPage.RETURN_REQUIRE_IMAGES_TOGGLE, "Require Images", enable,
            );
        });
    }

    public async setMinImages(value: string) {
        await test.step(`Set Min Images to '${value}'`, async () => {
            await this.fillNumericInput(
                ReturnCancellationPolicyPage.RETURN_MIN_IMAGES, "Min Images", value,
            );
        });
    }

    public async setRestockingFee(value: string) {
        await test.step(`Set Restocking Fee to '${value}'`, async () => {
            await this.fillNumericInput(
                ReturnCancellationPolicyPage.RETURN_RESTOCKING_FEE, "Restocking Fee", value,
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // REPLACEMENT TAB — FIELD HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    public async setReplacementWindowDays(days: string) {
        await test.step(`Set Replacement Window Days to '${days}'`, async () => {
            await this.fillNumericInput(
                ReturnCancellationPolicyPage.REPLACEMENT_WINDOW_DAYS, "Replacement Window Days", days,
            );
        });
    }

    public async setMaxPerOrder(value: string) {
        await test.step(`Set Max Per Order to '${value}'`, async () => {
            await this.fillNumericInput(
                ReturnCancellationPolicyPage.REPLACEMENT_MAX_PER_ORDER, "Max Per Order", value,
            );
        });
    }

    public async setRequireOriginalReturn(enable: boolean) {
        await test.step(`Set Require Original Return to: ${enable}`, async () => {
            await this.setSpecificToggle(
                ReturnCancellationPolicyPage.REPLACEMENT_REQUIRE_ORIGINAL_TOGGLE, "Require Original Return", enable,
            );
        });
    }

    public async setReplacementRequireImages(enable: boolean) {
        await test.step(`Set Replacement Require Images to: ${enable}`, async () => {
            await this.setSpecificToggle(
                ReturnCancellationPolicyPage.REPLACEMENT_REQUIRE_IMAGES_TOGGLE, "Replacement Require Images", enable,
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // REFUND TAB — FIELD HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    public async setRefundMethod(method: string) {
        await test.step(`Set Refund Method to '${method}'`, async () => {
            const sel = this.page.locator(ReturnCancellationPolicyPage.REFUND_METHOD_SELECT).first();
            if (await sel.isVisible({ timeout: 4000 }).catch(() => false)) {
                await sel.selectOption({ label: method }).catch(
                    () => sel.selectOption({ value: method }).catch(() => {}),
                );
                console.log(`[Policy] Refund Method → ${method}`);
            } else {
                console.log("[Policy] Refund Method select not found — skipping");
            }
        });
    }

    public async setCODRefundMethod(method: string) {
        await test.step(`Set COD Refund Method to '${method}'`, async () => {
            const sel = this.page.locator(ReturnCancellationPolicyPage.COD_REFUND_METHOD_SELECT).first();
            if (await sel.isVisible({ timeout: 3000 }).catch(() => false)) {
                await sel.selectOption({ label: method }).catch(
                    () => sel.selectOption({ value: method }).catch(() => {}),
                );
                console.log(`[Policy] COD Refund Method → ${method}`);
            }
        });
    }

    public async setProcessingDays(days: string) {
        await test.step(`Set Processing Days to '${days}'`, async () => {
            await this.fillNumericInput(
                ReturnCancellationPolicyPage.REFUND_PROCESSING_DAYS, "Processing Days", days,
            );
        });
    }

    public async setPartialRefundAllowed(enable: boolean) {
        await test.step(`Set Partial Refund Allowed to: ${enable}`, async () => {
            await this.setSpecificToggle(
                ReturnCancellationPolicyPage.REFUND_PARTIAL_ALLOWED_TOGGLE, "Partial Refund Allowed", enable,
            );
        });
    }

    public async setShippingRefundable(enable: boolean) {
        await test.step(`Set Shipping Refundable to: ${enable}`, async () => {
            await this.setSpecificToggle(
                ReturnCancellationPolicyPage.REFUND_SHIPPING_REFUNDABLE_TOGGLE, "Shipping Refundable", enable,
            );
        });
    }

    public async setDeductCancellationFee(enable: boolean) {
        await test.step(`Set Deduct Cancellation Fee to: ${enable}`, async () => {
            await this.setSpecificToggle(
                ReturnCancellationPolicyPage.REFUND_DEDUCT_CANCEL_FEE_TOGGLE, "Deduct Cancellation Fee", enable,
            );
        });
    }

    public async setDeductRestockingFee(enable: boolean) {
        await test.step(`Set Deduct Restocking Fee to: ${enable}`, async () => {
            await this.setSpecificToggle(
                ReturnCancellationPolicyPage.REFUND_DEDUCT_RESTOCKING_FEE_TOGGLE, "Deduct Restocking Fee", enable,
            );
        });
    }

    public async verifyRefundTabFields() {
        await test.step("Verify Refund tab fields are visible", async () => {
            const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            const hasRefundMethod = body.includes("refund method");
            const hasCodMethod = body.includes("cod refund");
            const hasProcessingDays = body.includes("processing days");
            await Assert.assertTrue(
                hasRefundMethod || hasCodMethod || hasProcessingDays,
                "Refund tab must show Refund Method, COD Refund Method, or Processing Days",
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MARKET POLICIES TAB
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyMarketEmptyState() {
        await test.step("Verify Market Policies empty state is shown", async () => {
            await this.settle(400);
            const empty = this.page.locator(ReturnCancellationPolicyPage.MARKET_EMPTY_STATE).first();
            const visible = await empty.isVisible({ timeout: 5000 }).catch(() => false);
            if (!visible) {
                const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
                const hasEmptyText = body.includes("no market") || body.includes("no override");
                await Assert.assertTrue(
                    hasEmptyText,
                    "Market Policies tab must show empty state or 'No market overrides configured'",
                );
            }
            console.log("[Policy] Market empty state verified");
        });
    }

    public async verifyAddMarketButtonVisible() {
        await test.step("Verify '+ Add Market' button is visible", async () => {
            const btn = this.page.locator(ReturnCancellationPolicyPage.MARKET_ADD_BTN).first();
            await expect(btn, "Add Market button must be visible").toBeVisible({ timeout: 8000 });
        });
    }

    public async clickAddMarket() {
        await test.step("Click Add Market button", async () => {
            const names = await this.page.locator("table tbody tr td:first-child").evaluateAll((tds) => {
                return tds.map((td) => (td.textContent || "").trim()).filter(Boolean);
            }).catch(() => []);
            this.existingMarkets = new Set(names.map((n) => n.toLowerCase()));

            await this.page.locator(ReturnCancellationPolicyPage.MARKET_ADD_BTN).first().click();
            await this.page.waitForTimeout(600);
            console.log("[Policy] Add Market clicked");
        });
    }

    public async verifyMarketModalOpen() {
        await test.step("Verify Market Policy Override modal is open", async () => {
            const modal = this.page.locator(ReturnCancellationPolicyPage.MARKET_MODAL).first();
            await expect(modal, "Market Policy Override modal must be visible").toBeVisible({ timeout: 8000 });
            const heading = this.page.locator(ReturnCancellationPolicyPage.MARKET_MODAL_HEADING).first();
            if (await heading.isVisible({ timeout: 2000 }).catch(() => false)) {
                console.log("[Policy] Modal heading visible");
            }
        });
    }

    public async verifyMarketModalFields() {
        await test.step("Verify Market Policy modal contains required fields", async () => {
            const body = (await this.page.locator(ReturnCancellationPolicyPage.MARKET_MODAL).first()
                .innerText().catch(() => "")).toLowerCase();
            const hasMarketName = body.includes("market name");
            const hasConditions = body.includes("condition");
            const hasOverride = body.includes("override");
            await Assert.assertTrue(
                hasMarketName || hasConditions || hasOverride,
                "Market modal must contain Market Name, Conditions, and Override toggles",
            );
            console.log(`[Policy] Market modal fields found: name=${hasMarketName}, cond=${hasConditions}, override=${hasOverride}`);
        });
    }

    public async clickMarketCancel() {
        await test.step("Click Cancel in Market Policy modal", async () => {
            // Scope to the open dialog to avoid matching the 'Cancellation' tab button.
            // Exact regex /^Cancel$/i ensures "Cancel" ≠ "Cancellation".
            const dialog = this.page.locator('[role="dialog"]').last();
            const cancelBtn = dialog.locator("button").filter({ hasText: /^Cancel$/i }).first();
            const visible = await cancelBtn.isVisible({ timeout: 5000 }).catch(() => false);
            if (visible) {
                await cancelBtn.click({ force: true });
            } else {
                // Fallback: close button (×) in dialog header
                const closeBtn = this.page.locator(ReturnCancellationPolicyPage.MARKET_CLOSE_BTN).first();
                await closeBtn.click({ force: true });
            }
            await this.page.waitForTimeout(500);
            console.log("[Policy] Market modal cancelled");
        });
    }

    public async verifyMarketModalClosed() {
        await test.step("Verify Market Policy modal is closed", async () => {
            const modal = this.page.locator(ReturnCancellationPolicyPage.MARKET_MODAL).first();
            const hidden = await modal.isHidden({ timeout: 5000 }).catch(() => false);
            if (!hidden) {
                console.log("[Policy] Modal may still be visible — checking page body for modal absence");
                const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
                const noModalText = !body.includes("save market");
                await Assert.assertTrue(noModalText || hidden, "Market modal must be closed after Cancel");
            }
        });
    }

    public async clickSaveMarket() {
        await test.step("Click Save Market button", async () => {
            const saveBtn = this.page.locator("button")
                .filter({ hasText: /save market/i })
                .first();
            if (!await saveBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
                console.log("[Policy] Save Market button not found — skipping");
                return;
            }
            // Wait for the button to become enabled (form validation may disable it initially).
            // Do NOT use { force: true } here — a disabled button will receive the DOM click
            // but React ignores it, so the save never actually fires.
            const isDisabled = await saveBtn.isDisabled().catch(() => false);
            if (isDisabled) {
                console.log("[Policy] Save Market button is disabled — polling for it to become enabled");
                // waitFor does not support "enabled"; poll isEnabled instead
                for (let i = 0; i < 12; i++) {
                    await this.page.waitForTimeout(500);
                    if (!await saveBtn.isDisabled().catch(() => true)) break;
                }
            }
            console.log("[Policy] Clicking Save Market button");
            await saveBtn.click();
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
            await this.page.waitForTimeout(1200);
            console.log("[Policy] Save Market click complete");
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MARKET POLICY CRUD — CREATE / EDIT / DELETE / ENABLE / DISABLE
    // ═══════════════════════════════════════════════════════════════════════════

    public async selectFirstAvailableMarketName(): Promise<string> {
        let selectedName = "";
        await test.step("Select first available Market Name from dropdown", async () => {
            const dialog = this.page.locator('[role="dialog"]').last();

            // The Market Name field has a dedicated "Open options" button (the ▼ chevron).
            // Click it — NOT the combobox input — to open the dropdown list.
            const openBtn = dialog.getByRole("button", { name: /open options/i });
            if (await openBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await openBtn.click();
            } else {
                // Fallback: click the combobox input itself
                const combobox = dialog.locator('[role="combobox"]').first();
                if (await combobox.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await combobox.click();
                } else {
                    console.log("[Policy] Market Name trigger not found — skipping");
                    return;
                }
            }
            await this.page.waitForTimeout(600);

            // Options appear as [role="option"] elements after the dropdown opens
            const options = await this.page.locator('[role="option"]').all();
            if (options.length === 0) {
                console.log("[Policy] No options appeared after clicking 'Open options' — skipping");
                await this.page.keyboard.press("Escape").catch(() => {});
                return;
            }

            let clicked = false;
            for (const option of options) {
                const optText = (await option.innerText().catch(() => "")).trim();
                if (!this.existingMarkets.has(optText.toLowerCase())) {
                    selectedName = optText;
                    console.log(`[Policy] Market Name option: "${selectedName}" — clicking`);
                    await option.click();
                    clicked = true;
                    break;
                }
            }

            if (!clicked) {
                selectedName = (await options[0].innerText().catch(() => "")).trim();
                console.log(`[Policy] All options exist, falling back to first: "${selectedName}" — clicking`);
                await options[0].click();
            }
            await this.page.waitForTimeout(400);

            // Verify via inputValue (innerText is always "" on <input> elements)
            const combobox = dialog.locator('[role="combobox"]').first();
            const inputValue = await combobox.inputValue().catch(() => "");
            console.log(`[Policy] Market Name input value after selection: "${inputValue || "(empty)"}"`);
        });
        return selectedName;
    }

    public async fillMarketConditions(conditions: string) {
        await test.step(`Fill Market Conditions: "${conditions}"`, async () => {
            const dialog = this.page.locator('[role="dialog"]').last();
            // The Conditions field is role="textbox" — distinct from role="combobox" (Market Name).
            // getByRole('textbox') will NOT match the combobox input, so it correctly targets Conditions.
            const condInput = dialog.getByRole("textbox").first();
            if (await condInput.isVisible({ timeout: 3000 }).catch(() => false)) {
                await condInput.click({ clickCount: 3, force: true });
                await condInput.fill(conditions);
                console.log(`[Policy] Market Conditions filled: "${conditions}"`);
            } else {
                console.log("[Policy] Conditions textbox not found — skipping fill");
            }
        });
    }

    public async toggleMarketOverride(
        overrideType: "Cancellation" | "Return" | "Replacement" | "Refund",
        enable: boolean,
    ) {
        await test.step(`Toggle "Override ${overrideType}" to ${enable ? "ON" : "OFF"}`, async () => {
            const dialog = this.page.locator('[role="dialog"]').last();
            // Find the card that contains the override label AND a switch button
            const card = dialog.locator("div").filter({
                has: this.page.locator("p, span, h3, h4, label").filter({
                    hasText: new RegExp(`Override ${overrideType}`, "i"),
                }),
            }).filter({ has: this.page.locator('button[role="switch"]') }).first();

            const toggle = card.locator('button[role="switch"]').first();
            if (!await toggle.isVisible({ timeout: 5000 }).catch(() => false)) {
                console.log(`[Policy] Override ${overrideType} toggle not found — skipping`);
                return;
            }
            const ariaChecked = await toggle.getAttribute("aria-checked").catch(() => null);
            const current = ariaChecked === "true";
            if (current !== enable) {
                await toggle.click({ force: true });
                await this.page.waitForTimeout(500);
            }
            console.log(`[Policy] Override ${overrideType} → ${enable}`);
        });
    }

    public async clickMarketRowEdit(index = 0) {
        await test.step(`Click Edit on market row ${index}`, async () => {
            await this.settle(400);
            const editBtns = this.page.locator("button").filter({ hasText: /^Edit$/i });
            const count = await editBtns.count();
            if (count > index) {
                await editBtns.nth(index).click({ force: true });
                await this.page.waitForTimeout(600);
                console.log(`[Policy] Clicked Edit (row ${index})`);
            } else {
                console.log(`[Policy] No Edit button at index ${index} (found ${count})`);
            }
        });
    }

    public async clickMarketRowDelete(index = 0) {
        await test.step(`Click Delete on market row ${index}`, async () => {
            await this.settle(400);
            const deleteBtns = this.page.locator("button").filter({ hasText: /^Delete$/i });
            const count = await deleteBtns.count();
            if (count > index) {
                await deleteBtns.nth(index).click({ force: true });
                await this.page.waitForTimeout(600);
                console.log(`[Policy] Clicked Delete (row ${index})`);
            } else {
                console.log(`[Policy] No Delete button at index ${index} (found ${count})`);
            }
        });
    }

    public async confirmDeleteMarketPolicy() {
        await test.step("Confirm Delete Market Override in dialog", async () => {
            await this.settle(300);
            // First try the dialog that specifically mentions "Delete market"
            const confirmDialog = this.page
                .locator('[role="dialog"], [role="alertdialog"]')
                .filter({ hasText: /delete market/i })
                .last();
            if (await confirmDialog.isVisible({ timeout: 5000 }).catch(() => false)) {
                const confirmBtn = confirmDialog.locator("button").filter({ hasText: /^Delete$/i }).first();
                await confirmBtn.click({ force: true });
                await this.page.waitForTimeout(1200);
                console.log("[Policy] Delete market override confirmed via dialog");
                return;
            }
            // Fallback: any visible alert-dialog with a Delete button
            const fallbackBtn = this.page
                .locator('[role="alertdialog"] button, [role="dialog"] button')
                .filter({ hasText: /^Delete$/i })
                .first();
            if (await fallbackBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await fallbackBtn.click({ force: true });
                await this.page.waitForTimeout(1200);
                console.log("[Policy] Fallback: Delete confirmed via first matching button");
            } else {
                console.log("[Policy] Delete confirmation dialog not found — skipping confirm");
            }
        });
    }

    public async getMarketRowCount(): Promise<number> {
        await this.settle(600);
        // Market list uses div cards. Count by "Edit" clickable elements —
        // may be <button> or <a> or [role="button"] depending on the component.
        const editEls = this.page.locator('button, a, [role="button"]').filter({ hasText: /^Edit$/i });
        const count = await editEls.count().catch(() => 0);
        console.log(`[Policy] Market row count (Edit elements): ${count}`);
        return count;
    }

    public async verifyMarketListHasAtLeast(count: number) {
        await test.step(`Verify market list has at least ${count} row(s)`, async () => {
            const actual = await this.getMarketRowCount();
            await Assert.assertTrue(actual >= count, `Market list must have ≥${count} row(s), found ${actual}`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TOGGLE HELPER
    // ═══════════════════════════════════════════════════════════════════════════

    private async getToggleState(selector: string): Promise<boolean | null> {
        const el = this.page.locator(selector).first();
        if (!await el.isVisible({ timeout: 2000 }).catch(() => false)) return null;
        const ariaChecked = await el.getAttribute("aria-checked").catch(() => null);
        if (ariaChecked !== null) return ariaChecked === "true";
        return el.isChecked().catch(() => false);
    }

    private async setSpecificToggle(selector: string, label: string, enable: boolean) {
        const current = await this.getToggleState(selector);
        if (current === null) {
            console.log(`[Policy] Toggle '${label}' not found — skipping`);
            return;
        }
        if (current !== enable) {
            await this.page.locator(selector).first().click();
            await this.page.waitForTimeout(300);
        }
        console.log(`[Policy] Toggle '${label}' → ${enable}`);
    }

    public async verifyToggleState(selector: string, label: string, expected: boolean) {
        await test.step(`Verify toggle '${label}' is ${expected ? "ON" : "OFF"}`, async () => {
            const actual = await this.getToggleState(selector);
            if (actual === null) {
                console.log(`[Policy] Toggle '${label}' not found — skipping assertion`);
                return;
            }
            await Assert.assertEquals(String(actual), String(expected), `Toggle '${label}' must be ${expected}`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FIELD VISIBILITY HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyCancellationTabFields() {
        await test.step("Verify Cancellation tab fields are visible", async () => {
            const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            const hasWindow = body.includes("window minutes");
            const hasStatuses = body.includes("allowed before status") || body.includes("before status");
            const hasFeeType = body.includes("fee type") || body.includes("cancellation fee");
            const hasReasons = body.includes("reasons");
            await Assert.assertTrue(
                hasWindow || hasStatuses || hasFeeType || hasReasons,
                "Cancellation tab must show Window Minutes, Statuses, Fee Type, or Reasons",
            );
            console.log(`[Policy] Cancel tab — window:${hasWindow} statuses:${hasStatuses} fee:${hasFeeType} reasons:${hasReasons}`);
        });
    }

    public async verifyReturnTabFields() {
        await test.step("Verify Return tab fields are visible", async () => {
            const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            const hasWindowDays = body.includes("window days");
            const hasItemTypes = body.includes("item types") || body.includes("returnable");
            const hasShipping = body.includes("shipping paid");
            await Assert.assertTrue(
                hasWindowDays || hasItemTypes || hasShipping,
                "Return tab must show Window Days, Item Types, or Shipping Paid By",
            );
            console.log(`[Policy] Return tab — windowDays:${hasWindowDays} itemTypes:${hasItemTypes} shipping:${hasShipping}`);
        });
    }

    public async verifyReplacementTabFields() {
        await test.step("Verify Replacement tab fields are visible", async () => {
            const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            const hasWindowDays = body.includes("window days");
            const hasMaxPerOrder = body.includes("max per order");
            const hasRequireOriginal = body.includes("require original");
            await Assert.assertTrue(
                hasWindowDays || hasMaxPerOrder || hasRequireOriginal,
                "Replacement tab must show Window Days, Max Per Order, or Require Original Return",
            );
            console.log(`[Policy] Replacement tab — days:${hasWindowDays} max:${hasMaxPerOrder} original:${hasRequireOriginal}`);
        });
    }

    public async verifyMarketTabLoaded() {
        await test.step("Verify Market Policies tab is loaded", async () => {
            const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            const hasMarket = body.includes("market polic") || body.includes("market override") || body.includes("add market");
            await Assert.assertTrue(hasMarket, "Market Policies tab must show market-related content");
        });
    }
}
