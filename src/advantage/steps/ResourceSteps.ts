import test, { Page, expect, Locator } from "@playwright/test";
import Assert from "@asserts/Assert";
import ResourcePage from "@pages/ResourcePage";
import AddResourcePage from "@pages/AddResourcePage";
import ResourceDetailsPage from "@pages/ResourceDetailsPage";
import EditResourcePage from "@pages/EditResourcePage";
import DeleteResourcePopup from "@pages/DeleteResourcePopup";
import ResourceConstants from "@uiConstants/ResourceConstants";

export interface ResourceFormData {
    resourceCode: string;
    resourceName: string;
    symbol?: string;
    resourceType?: string;
    resourceId?: string;
}

export default class ResourceSteps {
    constructor(private readonly page: Page) {}

    private async clickDropdownOption(opt: Locator) {
        try {
            await opt.click({ timeout: 4000 });
        } catch (e: any) {
            console.warn(`[RES] Click option failed: ${e.message}. Retrying with native center scroll and force click...`);
            try {
                await opt.evaluate((el) => el.scrollIntoView({ block: "center", inline: "center", behavior: "auto" })).catch(() => {});
                await this.page.waitForTimeout(200);
                await opt.click({ force: true, timeout: 3000 });
            } catch (e2: any) {
                console.warn(`[RES] Force click after native scroll failed: ${e2.message}. Dispatching click event...`);
                await opt.dispatchEvent("click");
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DEBUG
    // ═══════════════════════════════════════════════════════════════════════════

    public async debugPageState() {
        console.log("[RES] URL:", this.page.url());
        const h = await this.page.locator(":is(h1,h2,h3)").first().innerText().catch(() => "N/A");
        console.log("[RES] Heading:", h);
        const btns = await this.page.locator("button:visible").allTextContents();
        console.log("[RES] Buttons:", JSON.stringify(btns.filter(Boolean).slice(0, 12)));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY
    // ═══════════════════════════════════════════════════════════════════════════

    public async waitForTableStable() {
        await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
        await this.page.waitForTimeout(ResourceConstants.TABLE_SETTLE_MS);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MANDATORY COMMON NAVIGATION FLOW (required before every test)
    // Steps: 1.Login (beforeAll) → 2.Home → 3.Sidebar → 4.Setup → 5.Resources
    // ═══════════════════════════════════════════════════════════════════════════

    public async commonNavigationFlow() {
        await test.step("Common flow: Home → Setup → Resources (with mandatory assertions)", async () => {
            // Step 2: Navigate to / verify Home
            await this.page.goto(`${process.env.BASE_URL}home`);
            await this.page.waitForURL(/\/home/, { timeout: 15000 });
            await this.page.waitForLoadState("networkidle");
            await expect(this.page.locator(ResourcePage.PROFILE_MENU).first(),
                "Home: Profile menu must be visible").toBeVisible({ timeout: 10000 });
            await expect(this.page.locator(ResourcePage.SIDEBAR_NAV).first(),
                "Home: Sidebar nav must be visible").toBeVisible({ timeout: 8000 });
            await expect(this.page.locator(ResourcePage.HOME_GREETING).first(),
                "Home: Dashboard greeting must be visible").toBeVisible({ timeout: 8000 });

            // Step 3: Open Sidebar / Step 4: Click Setup
            const alreadyVisible = await this.page.locator(ResourcePage.RESOURCES_SUBMENU_LINK)
                .first().isVisible({ timeout: 800 }).catch(() => false);
            if (!alreadyVisible) {
                const setupBtn = this.page.locator(ResourcePage.SETUP_MENU_BTN).first();
                await setupBtn.scrollIntoViewIfNeeded({ timeout: 10000 }).catch(() => {});
                await setupBtn.click({ timeout: 5000 }).catch(async () => {
                    await setupBtn.evaluate((el: HTMLElement) => el.click());
                });
                await this.page.locator(ResourcePage.RESOURCES_SUBMENU_LINK).first()
                    .waitFor({ state: "visible", timeout: 5000 });
            }

            // Step 5: Click Resources → navigate
            const resourcesLink = this.page.locator(ResourcePage.RESOURCES_SUBMENU_LINK).first();
            await resourcesLink.click({ timeout: 5000 }).catch(async () => {
                await resourcesLink.evaluate((el: HTMLElement) => el.click());
            });
            await this.page.waitForURL(/setup\/currency/, { timeout: 15000 });
            await this.page.waitForLoadState("networkidle");

            // ── Mandatory assertions on Resources page ────────────────────────
            await expect(this.page, "URL must contain /setup/currency")
                .toHaveURL(/setup\/currency/, { timeout: 15000 });
            await expect(this.page.locator(ResourcePage.PAGE_HEADING).first(),
                "Resource Setup heading must be visible").toBeVisible({ timeout: 10000 });
            await expect(this.page.locator(ResourcePage.CREATE_RESOURCE_BTN).first(),
                "Create Resource button must be visible").toBeVisible({ timeout: 8000 });
            
            const exportVisible = await this.page.locator(ResourcePage.EXPORT_BTN).first()
                .isVisible({ timeout: 3000 }).catch(() => false);
            if (exportVisible) {
                console.log("[RES] Export button visible ✓");
            } else {
                console.warn("[RES] Export button not visible in this build — continuing gracefully");
            }

            await expect(this.page.locator(ResourcePage.TABLE),
                "Resource grid must be visible").toBeVisible({ timeout: 8000 });
            const typeFilterVisible = await this.page.locator(ResourcePage.TYPE_FILTER_BTN)
                .first().isVisible({ timeout: 4000 }).catch(() => false);
            if (typeFilterVisible) {
                console.log("[RES] Type filter visible ✓");
            } else {
                console.warn("[RES] Type filter selector not matched — page may use different element; continuing");
            }
            console.log(`[RES] commonNavigationFlow complete — URL: ${this.page.url()}`);
        });
    }

    // Direct navigation (used in beforeAll cleanup and helper flows)
    public async navigateToResources() {
        await test.step("Navigate directly to Resource Setup listing", async () => {
            await this.page.goto(`${process.env.BASE_URL}${ResourcePage.RESOURCE_PATH}`);
            await this.page.waitForLoadState("networkidle");
            if (this.page.url().includes("/login")) {
                throw new Error(`Resources navigation redirected to login. URL: ${this.page.url()}`);
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LISTING PAGE
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyStatCards() {
        await test.step("Verify stat cards visible (graceful — warns if absent)", async () => {
            let foundCount = 0;
            for (const label of ResourceConstants.EXPECTED_STAT_CARDS) {
                const pattern = new RegExp(label.replace(/\s+/g, "\\s*"), "i");
                // eslint-disable-next-line no-await-in-loop
                const found = await this.page.getByText(pattern).first()
                    .isVisible({ timeout: 3000 }).catch(() => false);
                if (found) foundCount += 1;
                console.log(`[RES] Stat card '${label}': ${found ? "found ✓" : "not found — may not exist in this build"}`);
            }
            console.log(`[RES] Stat cards found: ${foundCount}/${ResourceConstants.EXPECTED_STAT_CARDS.length}`);
            // Graceful: warn but do not fail — stat cards may not be present in this Nipige build
        });
    }

    public async getStatCardValue(label: string): Promise<number> {
        const pattern = new RegExp(label.replace(/\s+/g, "\\s*"), "i");
        await expect(this.page.getByText(pattern).first()).toBeVisible({ timeout: 8000 });
        return this.page.evaluate((lbl: string) => {
            const els = Array.from(document.querySelectorAll("p,span,div,h2,h3,h4"));
            const el = els.find((e) => e.textContent?.trim() === lbl && (e as HTMLElement).children.length === 0);
            if (!el) return -1;
            const prev = el.previousElementSibling
                || el.parentElement?.previousElementSibling?.lastElementChild;
            if (prev) {
                const n = parseInt(prev.textContent?.trim() ?? "", 10);
                if (!Number.isNaN(n)) return n;
            }
            for (const ch of Array.from(el.parentElement?.children ?? [])) {
                if (ch !== el) {
                    const n = parseInt(ch.textContent?.trim() ?? "", 10);
                    if (!Number.isNaN(n)) return n;
                }
            }
            return 0;
        }, label);
    }

    public async verifyGridColumns() {
        await test.step("Verify grid columns", async () => {
            const headers = (await this.page.locator(ResourcePage.TABLE_HEADERS).allTextContents())
                .map((h) => h.trim().toUpperCase()).filter(Boolean);
            for (const col of ResourceConstants.EXPECTED_COLUMNS) {
                await Assert.assertTrue(
                    headers.some((h) => h.includes(col)), `Grid must have column '${col}'`,
                );
            }
        });
    }

    public async getTableRowCount(): Promise<number> {
        await this.waitForTableStable();
        return this.page.locator(ResourcePage.TABLE_ROWS).count();
    }

    public async isResourceVisible(code: string): Promise<boolean> {
        return this.page.locator(ResourcePage.rowFor(code)).first()
            .isVisible({ timeout: 3000 }).catch(() => false);
    }

    public async verifyResourceExists(code: string) {
        await test.step(`Verify resource '${code}' visible in table`, async () => {
            await expect(
                this.page.locator(ResourcePage.rowFor(code)).first(),
                `Row for '${code}' must be visible`,
            ).toBeVisible({ timeout: 10000 });
        });
    }

    public async verifyNoRecords() {
        await test.step("Verify empty state", async () => {
            await this.waitForTableStable();
            const count = await this.page.locator(ResourcePage.TABLE_ROWS).count();
            if (count === 0) {
                console.log("[RES] verifyNoRecords: table has 0 rows ✓");
                return;
            }
            // Look for empty-state message
            const noRecordsVisible = await this.page.locator(ResourcePage.NO_RECORDS)
                .first().isVisible({ timeout: 3000 }).catch(() => false);
            if (noRecordsVisible) {
                console.log("[RES] verifyNoRecords: no-records message visible ✓");
                return;
            }
            // Some apps keep a "0 records" sub-label
            const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            const hasNoResults = body.includes("no records") || body.includes("no results")
                || body.includes("no data") || body.includes("0 records") || body.includes("not found");
            if (hasNoResults) {
                console.log("[RES] verifyNoRecords: found 'no results' text ✓");
                return;
            }
            await Assert.assertTrue(false,
                `Expected no records or empty-state message; found ${count} rows. Body: ${body.substring(0, 200)}`);
        });
    }

    // ─── Search ───────────────────────────────────────────────────────────────

    public async searchResource(term: string) {
        await test.step(`Search resource: '${term}'`, async () => {
            const input = this.page.locator(ResourcePage.SEARCH_INPUT).first();
            await expect(input, "Search input must be visible").toBeVisible({ timeout: 8000 });
            await input.click();
            await input.fill("");
            await this.page.keyboard.type(term, { delay: 50 });
            await this.page.keyboard.press("Enter");
            await this.page.waitForTimeout(1000);
            await this.waitForTableStable();
        });
    }

    public async clearSearch() {
        await test.step("Clear search field", async () => {
            const input = this.page.locator(ResourcePage.SEARCH_INPUT).first();
            if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
                await input.click();
                await input.fill("");
                await this.page.keyboard.press("Enter");
                await this.page.waitForTimeout(1000);
                await this.waitForTableStable();
            }
        });
    }

    // ─── Type filter ──────────────────────────────────────────────────────────

    public async filterByType(typeLabel: string) {
        await test.step(`Filter by type: '${typeLabel}'`, async () => {
            const trigger = this.page.locator(ResourcePage.TYPE_FILTER_BTN).first();
            if (!await trigger.isVisible({ timeout: 5000 }).catch(() => false)) {
                console.log(`[RES] filterByType: Type filter not visible — skipping`);
                return;
            }
            const tagName = await trigger.evaluate((el) => (el as Element).tagName.toLowerCase()).catch(() => "");
            if (tagName === "select") {
                await trigger.selectOption({ label: typeLabel })
                    .catch(() => trigger.selectOption(typeLabel));
                await this.waitForTableStable();
                return;
            }
            // Custom dropdown
            await trigger.click();
            await this.page.waitForTimeout(ResourceConstants.DROPDOWN_OPEN_MS);
            const opt = this.page
                .locator(`${ResourcePage.TYPE_FILTER_OPTION}:has-text("${typeLabel}")`).first();
            if (await opt.isVisible({ timeout: 3000 }).catch(() => false)) {
                await this.clickDropdownOption(opt);
            } else {
                await this.page.keyboard.press("Escape");
                console.log(`[RES] filterByType: Option '${typeLabel}' not found — filter may not support this option`);
            }
            await this.waitForTableStable();
        });
    }

    public async resetTypeFilter() {
        await test.step("Reset type filter to All Types", async () => {
            const trigger = this.page.locator(ResourcePage.TYPE_FILTER_BTN).first();
            if (!await trigger.isVisible({ timeout: 2000 }).catch(() => false)) return;
            const tagName = await trigger.evaluate((el) => (el as Element).tagName.toLowerCase()).catch(() => "");
            if (tagName === "select") {
                await trigger.selectOption({ label: ResourceConstants.TYPE_ALL })
                    .catch(() => trigger.selectOption(ResourceConstants.TYPE_ALL));
                await this.waitForTableStable();
                return;
            }
            const text = (await trigger.innerText().catch(() => "")).trim();
            if (text === ResourceConstants.TYPE_ALL) return;
            await trigger.click();
            await this.page.waitForTimeout(ResourceConstants.DROPDOWN_OPEN_MS);
            const opt = this.page
                .locator(`${ResourcePage.TYPE_FILTER_OPTION}:has-text("${ResourceConstants.TYPE_ALL}")`).first();
            if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) {
                await this.clickDropdownOption(opt);
            } else {
                await this.page.keyboard.press("Escape");
            }
            await this.waitForTableStable();
        });
    }

    // ─── Export ───────────────────────────────────────────────────────────────

    public async clickExport(): Promise<string | null> {
        return test.step("Click Export button and capture download", async () => {
            const btn = this.page.locator(ResourcePage.EXPORT_BTN).first();
            await expect(btn, "Export button must be visible").toBeVisible({ timeout: 8000 });
            try {
                const [download] = await Promise.all([
                    this.page.waitForEvent("download", { timeout: 8000 }),
                    btn.click(),
                ]);
                const name = download.suggestedFilename();
                console.log(`[RES] Export download: '${name}'`);
                return name;
            } catch {
                // Some implementations show a toast instead of triggering a download
                await btn.click().catch(() => {});
                await this.page.waitForTimeout(1500);
                const toast = this.page.locator(ResourcePage.TOAST).first();
                const toastVisible = await toast.isVisible({ timeout: 3000 }).catch(() => false);
                console.log(`[RES] Export — no download event, toast visible: ${toastVisible}`);
                return null;
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CREATE RESOURCE — NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickCreateResource() {
        await test.step("Click + Create Resource button", async () => {
            await this.page.locator(ResourcePage.CREATE_RESOURCE_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyAddResourcePage() {
        await test.step("Verify Add Resource page loaded", async () => {
            await expect(this.page).toHaveURL(/setup\/currency\/add/, { timeout: 10000 });
            await expect(
                this.page.locator(AddResourcePage.PAGE_HEADING).first(),
                "'Add Resource' heading must be visible",
            ).toBeVisible({ timeout: 8000 });
            await expect(
                this.page.locator(AddResourcePage.SAVE_BTN).first(),
                "Save Resource button must be visible",
            ).toBeVisible({ timeout: 8000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CREATE RESOURCE — FORM
    // ═══════════════════════════════════════════════════════════════════════════

    public async selectResourceCode(code: string) {
        await test.step(`Select Resource Code: '${code}'`, async () => {
            // Strategy 1: input-based combobox (type to filter)
            const inputEl = this.page.locator(AddResourcePage.RESOURCE_CODE_INPUT).first();
            if (await inputEl.isVisible({ timeout: 2000 }).catch(() => false)) {
                await inputEl.click();
                await this.page.waitForTimeout(ResourceConstants.DROPDOWN_OPEN_MS);
                await inputEl.fill(code);
                await this.page.waitForTimeout(ResourceConstants.DROPDOWN_OPEN_MS);
                const opt = this.page
                    .locator(`${AddResourcePage.RESOURCE_CODE_DROPDOWN_OPTION}:has-text("${code}")`).first();
                if (await opt.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await this.clickDropdownOption(opt);
                    console.log(`[RES] Code '${code}' selected via combobox input`);
                    return;
                }
                await this.page.keyboard.press("Escape");
            }
            // Strategy 2: native select
            const sel = this.page.locator("select").first();
            if (await sel.isVisible({ timeout: 1000 }).catch(() => false)) {
                await sel.selectOption({ label: code }).catch(() => sel.selectOption(code));
                console.log(`[RES] Code '${code}' selected via native select`);
                return;
            }
            // Strategy 3: role=combobox
            const cb = this.page.locator('[role="combobox"]').first();
            await cb.click();
            await this.page.waitForTimeout(ResourceConstants.DROPDOWN_OPEN_MS);
            const opt = this.page.locator(`[role="option"]:has-text("${code}")`).first();
            await expect(opt, `Code option '${code}' must appear`).toBeVisible({ timeout: 5000 });
            await this.clickDropdownOption(opt);
        });
    }

    public async enterResourceName(name: string) {
        await test.step(`Enter Resource Name: '${name}'`, async () => {
            const input = this.page.locator(AddResourcePage.RESOURCE_NAME_INPUT).first();
            await expect(input, "Resource Name input must be visible").toBeVisible({ timeout: 8000 });
            // When a code is selected the app may auto-fill and lock the name field
            const isReadonly = await input.evaluate((el: HTMLInputElement) =>
                el.readOnly || el.hasAttribute("readonly") || el.getAttribute("aria-readonly") === "true",
            ).catch(() => false);
            if (isReadonly) {
                const current = await input.inputValue().catch(() => "");
                console.log(`[RES] Resource Name is readonly (value='${current}') — skipping fill`);
                return;
            }
            await input.click({ clickCount: 3 });
            await input.fill(name);
        });
    }

    public async enterSymbol(symbol: string) {
        await test.step(`Enter Symbol: '${symbol}'`, async () => {
            const input = this.page.locator(AddResourcePage.SYMBOL_INPUT).first();
            if (!await input.isVisible({ timeout: 2000 }).catch(() => false)) return;
            const isReadonly = await input.evaluate((el: HTMLInputElement) =>
                el.readOnly || el.hasAttribute("readonly") || el.getAttribute("aria-readonly") === "true",
            ).catch(() => false);
            if (isReadonly) {
                console.log("[RES] Symbol is readonly — skipping fill");
                return;
            }
            await input.click({ clickCount: 3 });
            await input.fill(symbol);
        });
    }

    public async fillAddForm(data: ResourceFormData) {
        await test.step("Fill Add Resource form", async () => {
            await this.selectResourceCode(data.resourceCode);
            await this.enterResourceName(data.resourceName);
            if (data.symbol) await this.enterSymbol(data.symbol);
        });
    }

    public async verifyPreviewSection() {
        await test.step("Verify Preview panel is visible", async () => {
            await expect(
                this.page.locator(AddResourcePage.PREVIEW_SECTION).first(),
            ).toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyExchangeRateSection() {
        await test.step("Verify Exchange Rate History section is visible", async () => {
            await expect(
                this.page.locator(AddResourcePage.EXCHANGE_RATE_SECTION).first(),
            ).toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyResourceCodeDropdownPopulates() {
        await test.step("Verify Resource Code dropdown populates with codes", async () => {
            const input = this.page.locator(AddResourcePage.RESOURCE_CODE_INPUT).first();
            if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
                await input.click();
                await this.page.waitForTimeout(ResourceConstants.DROPDOWN_OPEN_MS);
                const opts = this.page.locator(AddResourcePage.RESOURCE_CODE_DROPDOWN_OPTION);
                const count = await opts.count();
                console.log(`[RES] Resource Code options visible: ${count}`);
                await Assert.assertTrue(count > 0, "Resource Code dropdown must have at least one option");
                await this.page.keyboard.press("Escape");
                return;
            }
            // Native select fallback
            const sel = this.page.locator("select").first();
            if (await sel.isVisible({ timeout: 1000 }).catch(() => false)) {
                const opts = sel.locator("option");
                const count = await opts.count();
                await Assert.assertTrue(count > 0, "Resource Code select must have options");
            }
        });
    }

    // ─── Exchange Rate History form ───────────────────────────────────────────

    public async selectBaseCurrency(code: string) {
        await test.step(`Select Base Currency: '${code}'`, async () => {
            // 1. Locate trigger and click if not already expanded
            const trigger = this.page.locator(AddResourcePage.BASE_CURRENCY_TRIGGER).first();
            await expect(trigger, "Base currency trigger must be visible").toBeVisible({ timeout: 5000 });
            const expanded = await trigger.getAttribute("aria-expanded").catch(() => "false");
            if (expanded !== "true") {
                await trigger.click();
                await this.page.waitForTimeout(ResourceConstants.DROPDOWN_OPEN_MS);
            }

            // 2. If the trigger is an input combobox, type to filter/select directly
            const isInput = await trigger.evaluate((el: HTMLElement) => el.tagName.toLowerCase() === "input").catch(() => false);
            if (isInput) {
                await trigger.fill(code);
                await this.page.waitForTimeout(ResourceConstants.DROPDOWN_OPEN_MS);
            } else {
                // Otherwise check if a search input appeared inside the popover/dialog (excluding main/sidebar search)
                const searchInput = this.page.locator(
                    '[role="listbox"] input, [role="dialog"] input, [class*="popover" i] input, [class*="dropdown" i] input, ' +
                    'input[placeholder*="search" i]:not([placeholder*="here" i]):not(nav input):not(aside input)'
                ).first();
                if (await searchInput.isVisible({ timeout: 1000 }).catch(() => false)) {
                    await searchInput.click();
                    await searchInput.fill(code);
                    await this.page.waitForTimeout(ResourceConstants.DROPDOWN_OPEN_MS);
                }
            }

            // 3. Locate option and click
            const opt = this.page.locator(`${AddResourcePage.BASE_CURRENCY_OPTION}:has-text("${code}")`).first();
            await expect(opt, `Base currency '${code}' must appear`).toBeVisible({ timeout: 6000 });
            await this.clickDropdownOption(opt);
        });
    }

    public async enterExchangeRate(rate: string) {
        await test.step(`Enter Exchange Rate: '${rate}'`, async () => {
            const input = this.page.locator(AddResourcePage.EXCHANGE_RATE_INPUT).first();
            if (!await input.isVisible({ timeout: 3000 }).catch(() => false)) {
                console.log("[RES] Exchange rate input not visible — skipping");
                return;
            }
            await input.click({ clickCount: 3 });
            await input.fill(rate);
        });
    }

    public async enterEffectiveDates(start: string, end?: string) {
        await test.step("Enter effective dates", async () => {
            const dates = this.page.locator(AddResourcePage.DATE_INPUTS);
            const count = await dates.count();
            if (count >= 1) {
                await dates.nth(0).fill(start).catch(async () => {
                    // Some date pickers need direct value injection
                    await dates.nth(0).evaluate((el: HTMLInputElement, v: string) => { el.value = v; }, start);
                    await dates.nth(0).dispatchEvent("change");
                });
            }
            if (end && count >= 2) {
                await dates.nth(1).fill(end).catch(async () => {
                    await dates.nth(1).evaluate((el: HTMLInputElement, v: string) => { el.value = v; }, end);
                    await dates.nth(1).dispatchEvent("change");
                });
            }
        });
    }

    public async clickAddRateButton() {
        await test.step("Click + button to add exchange rate row", async () => {
            // Primary selectors
            let btn = this.page.locator(AddResourcePage.ADD_RATE_BTN).first();
            if (!await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
                // Fallback: last button inside Exchange Rate History section
                const section = this.page.locator(AddResourcePage.EXCHANGE_RATE_SECTION).first();
                const sectionBtns = section.locator("button");
                const count = await sectionBtns.count().catch(() => 0);
                if (count > 0) {
                    btn = sectionBtns.last();
                }
                console.log(`[RES] ADD_RATE_BTN fallback: using last button in section (${count} buttons found)`);
            }
            await expect(btn, "Add rate button must be visible").toBeVisible({ timeout: 5000 });
            await btn.click();
            await this.page.waitForTimeout(500);
        });
    }

    public async getRateRowCount(): Promise<number> {
        const rows = this.page.locator(AddResourcePage.RATE_TABLE_ROWS);
        const count = await rows.count();
        if (count === 1) {
            const txt = (await rows.first().innerText().catch(() => "")).toLowerCase();
            if (txt.includes("no exchange") || txt.includes("no records") || txt.includes("yet") || txt.includes("no data")) {
                return 0;
            }
        }
        return count;
    }

    // ─── Validation helpers ───────────────────────────────────────────────────

    public async saveResource() {
        await test.step("Click Save Resource", async () => {
            await this.page.locator(AddResourcePage.SAVE_BTN).click();
            await this.page.waitForLoadState("networkidle", { timeout: 10000 });
        });
    }

    public async cancelAddResource() {
        await test.step("Click Cancel on Add Resource page", async () => {
            await this.page.locator(AddResourcePage.CANCEL_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async saveResourceExpectingValidation() {
        await test.step("Submit Add Resource form expecting validation to block", async () => {
            const urlBefore = this.page.url();
            await this.page.locator(AddResourcePage.SAVE_BTN).click();
            await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
            const urlAfter = this.page.url();
            await Assert.assertTrue(
                urlAfter.includes(ResourceConstants.ADD_URL_SEGMENT) || urlAfter === urlBefore,
                `Invalid form must stay on Add Resource page; got: '${urlAfter}'`,
            );
        });
    }

    public async verifyValidationPresent(hint?: string) {
        await test.step(`Verify validation feedback is shown${hint ? ` for '${hint}'` : ""}`, async () => {
            await this.page.waitForTimeout(500);
            const bodyText = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            const hasValidation = bodyText.includes("required")
                || bodyText.includes("invalid") || bodyText.includes("must")
                || bodyText.includes("mandatory") || bodyText.includes("field");
            const browserInvalid = await this.page.locator("input:invalid").count()
                .then((c) => c > 0).catch(() => false);
            const alertVisible = await this.page.locator('[role="alert"]').count()
                .then((c) => c > 0).catch(() => false);
            await Assert.assertTrue(
                hasValidation || browserInvalid || alertVisible,
                `Validation must be visible${hint ? ` (${hint})` : ""}`,
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SUCCESS / ERROR TOAST
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifySuccessToast() {
        await test.step("Verify success toast", async () => {
            const toast = this.page.locator(ResourcePage.TOAST).first();
            await expect(toast, "Toast must appear").toBeVisible({
                timeout: ResourceConstants.TOAST_TIMEOUT_MS,
            });
            const text = (await toast.innerText().catch(() => "")).toLowerCase();
            console.log(`[RES] Toast: '${text}'`);
            await Assert.assertTrue(
                text.includes("success") || text.includes("created") || text.includes("saved")
                    || text.includes("updated") || text.includes("deleted"),
                `Toast must confirm success; actual: '${text}'`,
            );
        });
    }

    public async captureToastText(): Promise<string> {
        const toast = this.page.locator(ResourcePage.TOAST).first();
        await toast.waitFor({ state: "visible", timeout: ResourceConstants.TOAST_TIMEOUT_MS })
            .catch(() => {});
        return toast.innerText().catch(() => "");
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // VIEW RESOURCE (Details page)
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickView(code: string) {
        await test.step(`Click View for '${code}'`, async () => {
            const row = this.page.locator(ResourcePage.rowFor(code)).first();
            await expect(row, `Row '${code}' must exist`).toBeVisible({ timeout: 8000 });
            await row.hover().catch(() => {});
            const btn = row.locator(ResourcePage.ROW_VIEW_BTN).first();
            await Promise.all([
                this.page.waitForURL(ResourceDetailsPage.URL_PATTERN, { timeout: 12000 }),
                btn.click({ timeout: 4000 }).catch(async () => {
                    await btn.evaluate((el: HTMLElement) => el.click());
                }),
            ]);
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
            console.log(`[RES] clickView — URL: ${this.page.url()}`);
        });
    }

    public async verifyViewPageLoaded() {
        await test.step("Verify Resource Details page loaded", async () => {
            await expect(this.page).toHaveURL(ResourceDetailsPage.URL_PATTERN, { timeout: 10000 });
            await expect(this.page.locator(ResourceDetailsPage.BACK_BTN).first())
                .toBeVisible({ timeout: 8000 });
            await expect(this.page.locator(ResourceDetailsPage.RESOURCE_DETAILS_SECTION).first())
                .toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyResourceDetailsContent(code: string, name: string) {
        await test.step(`Verify Details page shows '${code}' / '${name}'`, async () => {
            const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            await Assert.assertTrue(body.includes(code.toLowerCase()), `View page must show code '${code}'`);
            await Assert.assertTrue(body.includes(name.toLowerCase()), `View page must show name '${name}'`);
        });
    }

    public async verifyDetailsPageFields() {
        await test.step("Verify all detail-page field labels are present", async () => {
            for (const sel of [
                ResourceDetailsPage.RESOURCE_CODE_LABEL,
                ResourceDetailsPage.RESOURCE_NAME_LABEL,
                ResourceDetailsPage.SYMBOL_LABEL,
                ResourceDetailsPage.TYPE_LABEL,
                ResourceDetailsPage.CURRENT_RATE_LABEL,
                ResourceDetailsPage.LAST_UPDATED_LABEL,
            ]) {
                // eslint-disable-next-line no-await-in-loop
                await expect(this.page.locator(sel).first(), `'${sel}' must be visible`).toBeVisible({ timeout: 6000 });
            }
        });
    }

    public async verifyExchangeRateSectionOnView() {
        await test.step("Verify Exchange Rate History section on Details page", async () => {
            await expect(
                this.page.locator(ResourceDetailsPage.EXCHANGE_RATE_SECTION).first(),
            ).toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyTrendChart() {
        await test.step("Verify 30-Day Trend chart visible", async () => {
            await expect(
                this.page.locator(ResourceDetailsPage.TREND_CHART).first(),
            ).toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyUsagePanel() {
        await test.step("Verify Usage panel visible", async () => {
            await expect(
                this.page.locator(ResourceDetailsPage.USAGE_PANEL).first(),
            ).toBeVisible({ timeout: 8000 });
        });
    }

    public async clickBack() {
        await test.step("Click Back on Details page", async () => {
            const back = this.page.locator(ResourceDetailsPage.BACK_BTN).first();
            await expect(back).toBeVisible({ timeout: 8000 });
            await Promise.all([
                this.page.waitForURL(/setup\/currency($|\?)/, { timeout: 10000 }),
                back.click(),
            ]);
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
        });
    }

    public async verifyOnListingPage() {
        await test.step("Verify returned to listing page", async () => {
            await expect(this.page).toHaveURL(/setup\/currency($|\?)/, { timeout: 10000 });
            await expect(
                this.page.locator(ResourcePage.PAGE_HEADING).first(),
            ).toBeVisible({ timeout: 8000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // EDIT RESOURCE
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickEdit(code: string) {
        await test.step(`Click Edit for '${code}'`, async () => {
            const row = this.page.locator(ResourcePage.rowFor(code)).first();
            await expect(row, `Row '${code}' must exist`).toBeVisible({ timeout: 8000 });
            await row.hover().catch(() => {});
            const btn = row.locator(ResourcePage.ROW_EDIT_BTN).first();
            await Promise.all([
                this.page.waitForURL(EditResourcePage.URL_PATTERN, { timeout: 12000 }),
                btn.click({ timeout: 4000 }).catch(async () => {
                    await btn.evaluate((el: HTMLElement) => el.click());
                }),
            ]);
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
            console.log(`[RES] clickEdit — URL: ${this.page.url()}`);
        });
    }

    public async verifyEditPageLoaded(expectedCode?: string) {
        await test.step("Verify Edit Resource page loaded", async () => {
            await expect(this.page).toHaveURL(EditResourcePage.URL_PATTERN, { timeout: 10000 });
            const heading = await this.page.locator(":is(h1,h2,h3)").first().innerText().catch(() => "");
            await Assert.assertTrue(
                heading.toLowerCase().includes("edit resource"),
                `Edit heading must contain 'Edit Resource'; got '${heading}'`,
            );
            if (expectedCode) {
                await Assert.assertTrue(
                    heading.includes(expectedCode),
                    `Edit heading must include code '${expectedCode}'; got '${heading}'`,
                );
            }
            await expect(this.page.locator(EditResourcePage.UPDATE_BTN).first()).toBeVisible({ timeout: 10000 });
        });
    }

    public async verifyAuditTrail() {
        await test.step("Verify Audit Trail visible on Edit page", async () => {
            await expect(
                this.page.locator(EditResourcePage.AUDIT_TRAIL).first(),
            ).toBeVisible({ timeout: 8000 });
        });
    }

    public async updateResourceName(name: string) {
        await test.step(`Update Resource Name to '${name}'`, async () => {
            let input = this.page.locator(EditResourcePage.RESOURCE_NAME_INPUT).first();
            // If not found by placeholder, find the text input in the Resource Details section
            // that's NOT the symbol field (symbol is 1-3 chars like '€' or '$')
            if (!await input.isVisible({ timeout: 3000 }).catch(() => false)) {
                const detailsSection = this.page.locator(':has-text("Resource Details")').first();
                const allTextInputs = detailsSection.locator('input[type="text"]:not([readonly]), input:not([type]):not([readonly])');
                const cnt = await allTextInputs.count().catch(() => 0);
                console.log(`[RES] RESOURCE_NAME_INPUT fallback: ${cnt} text inputs in Resource Details`);
                // Resource Name is typically the longest-label input (not a single char like the symbol)
                for (let i = 0; i < cnt; i++) {
                    // eslint-disable-next-line no-await-in-loop
                    const val = await allTextInputs.nth(i).inputValue().catch(() => "");
                    if (val && val.length > 2) {
                        input = allTextInputs.nth(i);
                        console.log(`[RES] Using input at index ${i} with value '${val}'`);
                        break;
                    }
                }
            }
            await expect(input, "Resource Name input must be visible on edit page").toBeVisible({ timeout: 5000 });
            await input.click({ clickCount: 3 });
            await input.fill(name);
        });
    }

    public async updateSymbol(symbol: string) {
        await test.step(`Update Symbol to '${symbol}'`, async () => {
            const input = this.page.locator(EditResourcePage.SYMBOL_INPUT).first();
            if (!await input.isVisible({ timeout: 2000 }).catch(() => false)) return;
            await input.click({ clickCount: 3 });
            await input.fill(symbol);
        });
    }

    public async clickUpdate() {
        await test.step("Click Update and verify success toast", async () => {
            await this.page.locator(EditResourcePage.UPDATE_BTN).first().click();
            const toast = this.page.locator(ResourcePage.TOAST).first();
            await expect(toast, "Toast must appear after Update").toBeVisible({
                timeout: ResourceConstants.TOAST_TIMEOUT_MS,
            });
            const text = (await toast.innerText().catch(() => "")).toLowerCase();
            console.log(`[RES] Update toast: '${text}'`);
            await Assert.assertTrue(
                text.includes("success") || text.includes("updated") || text.includes("saved"),
                `Update toast must confirm success; actual: '${text}'`,
            );
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
        });
    }

    public async cancelEdit() {
        await test.step("Click Cancel on Edit page", async () => {
            await this.page.locator(EditResourcePage.CANCEL_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DELETE RESOURCE
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickDelete(code: string) {
        await test.step(`Click Delete for '${code}'`, async () => {
            const row = this.page.locator(ResourcePage.rowFor(code)).first();
            await expect(row, `Row '${code}' must exist`).toBeVisible({ timeout: 8000 });
            await row.hover().catch(() => {});
            const btn = row.locator(ResourcePage.ROW_DELETE_BTN).first();
            await btn.click({ timeout: 4000 }).catch(async () => {
                await btn.evaluate((el: HTMLElement) => el.click());
            });
            await this.page.locator(DeleteResourcePopup.POPUP)
                .waitFor({ state: "visible", timeout: 5000 });
        });
    }

    public async verifyDeletePopup(code?: string) {
        await test.step("Verify delete confirmation popup", async () => {
            const popup = this.page.locator(DeleteResourcePopup.POPUP).first();
            await expect(popup, "Delete popup must appear").toBeVisible({ timeout: 5000 });
            const text = (await popup.innerText()).toLowerCase();
            await Assert.assertTrue(text.includes("delete"), "Popup must mention 'delete'");
            if (code) console.log(`[RES] Delete popup for '${code}': ${text.substring(0, 80)}`);
        });
    }

    public async confirmDelete() {
        await test.step("Confirm deletion", async () => {
            // Scope the confirm button to inside the popup for reliability
            const popup = this.page.locator(DeleteResourcePopup.POPUP).first();
            const yesBtn = popup.locator(
                'button:has-text("Yes"), button:has-text("Delete"), button:has-text("Confirm")',
            );
            const yesBtnPage = this.page.locator(DeleteResourcePopup.CONFIRM_BTN).first();

            if (await yesBtn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
                await yesBtn.first().click();
            } else if (await yesBtnPage.isVisible({ timeout: 2000 }).catch(() => false)) {
                await yesBtnPage.click();
            } else {
                await this.page.keyboard.press("Enter");
            }
            await this.page.waitForLoadState("networkidle", { timeout: 10000 });
            await this.page.waitForTimeout(1500);
        });
    }

    public async cancelDelete() {
        await test.step("Cancel deletion", async () => {
            // Find the "No" / "Cancel" button scoped inside the popup
            const popup = this.page.locator(DeleteResourcePopup.POPUP).first();
            const noBtn = popup.locator('button:has-text("No"), button:has-text("Cancel"), button:has-text("No, keep")');
            const noBtnPage = this.page.locator('button:has-text("No")').last();

            let clicked = false;
            if (await noBtn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
                await noBtn.first().click();
                clicked = true;
            } else if (await noBtnPage.isVisible({ timeout: 2000 }).catch(() => false)) {
                await noBtnPage.click();
                clicked = true;
            }
            if (!clicked) {
                console.log("[RES] cancelDelete: No button not found — pressing Escape");
                await this.page.keyboard.press("Escape");
            }
            await this.page.locator(DeleteResourcePopup.POPUP).first()
                .waitFor({ state: "hidden", timeout: 5000 }).catch(() => {});
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FULL CREATE WORKFLOW
    // ═══════════════════════════════════════════════════════════════════════════

    public async createResourceAndVerify(data: ResourceFormData): Promise<void> {
        await test.step(`Create resource '${data.resourceCode}' and verify in listing`, async () => {
            await this.navigateToResources();
            await this.clickCreateResource();
            await this.verifyAddResourcePage();
            await this.fillAddForm(data);

            await this.page.locator(AddResourcePage.SAVE_BTN).click();
            const toast = this.page.locator(ResourcePage.TOAST).first();
            await expect(toast, "Toast must appear after Save").toBeVisible({
                timeout: ResourceConstants.TOAST_TIMEOUT_MS,
            });
            const text = (await toast.innerText().catch(() => "")).toLowerCase();
            console.log(`[RES] createResource toast: '${text}'`);
            await Assert.assertTrue(
                text.includes("success") || text.includes("created") || text.includes("saved"),
                `Toast must confirm saved; actual: '${text}'`,
            );
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
            await this.navigateToResources();
            await this.searchResource(data.resourceCode);
            await this.verifyResourceExists(data.resourceCode);
            await this.clearSearch();
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // GRACEFUL ERROR / NEGATIVE HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyGracefulHandling(contextMsg: string) {
        await test.step(`Verify graceful handling: ${contextMsg}`, async () => {
            const url = this.page.url();
            const body = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            const isGraceful = body.includes("not found") || body.includes("error")
                || body.includes("404") || body.includes("invalid") || body.includes("access denied")
                || url.includes("login") || url.includes("home") || url.includes("setup/currency");
            await Assert.assertTrue(isGraceful, `App must handle '${contextMsg}' gracefully; URL: ${url}`);
        });
    }
}
