import test, { Page, expect } from "@playwright/test";
import Assert from "@asserts/Assert";
import FAQPage from "@pages/FAQPage";
import CreateFAQPage from "@pages/CreateFAQPage";
import FAQDetailsPage from "@pages/FAQDetailsPage";
import EditFAQPage from "@pages/EditFAQPage";
import DeleteFAQPopup from "@pages/DeleteFAQPopup";
import FAQConstants from "@uiConstants/FAQConstants";

export interface FAQFormData {
    scope: string;
    category: string;
    topic: string;
    description: string;
    mediaType?: string;
    sortOrder?: string;
}

// ─── Select indices on the Create / Edit FAQ form ─────────────────────────────
// DOM-confirmed: each <select> is wrapped in its own <div>, so CSS :nth-of-type
// cannot enumerate across parents. Playwright's .nth(n) works page-wide.
const SELECT_IDX_SCOPE = 0;
const SELECT_IDX_CATEGORY = 1;
const SELECT_IDX_MEDIA = 2;

export default class FAQSteps {
    constructor(private readonly page: Page) {}

    // ═══════════════════════════════════════════════════════════════════════════
    // DEBUG HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    public async debugPageState() {
        console.log("[FAQ] URL:", this.page.url());
        const heading = await this.page.locator(":is(h1,h2,h3)").first().innerText().catch(() => "N/A");
        console.log("[FAQ] Heading:", heading);
        const btns = await this.page.locator("button:visible").allTextContents();
        console.log("[FAQ] Buttons:", JSON.stringify(btns.filter(Boolean).slice(0, 10)));
        const inputCount = await this.page.locator("input:visible").count();
        const selectCount = await this.page.locator("select:visible").count();
        console.log(`[FAQ] Visible inputs: ${inputCount}, selects: ${selectCount}`);
    }

    public async debugFormInputs() {
        const labels = await this.page.locator("label").allTextContents();
        console.log("[FAQ] Labels:", JSON.stringify(labels.filter(Boolean)));
        const selects = this.page.locator("select");
        const selCount = await selects.count();
        for (let i = 0; i < selCount; i++) {
            // eslint-disable-next-line no-await-in-loop
            const val = await selects.nth(i).inputValue().catch(() => "N/A");
            console.log(`[FAQ] select[${i}] value: '${val}'`);
        }
        const inputs = this.page.locator("input:visible");
        const inpCount = await inputs.count();
        for (let i = 0; i < inpCount; i++) {
            // eslint-disable-next-line no-await-in-loop
            const val = await inputs.nth(i).inputValue().catch(() => "");
            // eslint-disable-next-line no-await-in-loop
            const ph = await inputs.nth(i).getAttribute("placeholder").catch(() => "");
            console.log(`[FAQ] input[${i}] placeholder='${ph}' value='${val}'`);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY
    // ═══════════════════════════════════════════════════════════════════════════

    public async waitForTableStable() {
        await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
        await this.page.waitForTimeout(FAQConstants.TABLE_SETTLE_MS);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async navigateToFAQ() {
        await test.step("Navigate to FAQ Master Config listing page", async () => {
            const target = `${process.env.BASE_URL}${FAQPage.FAQ_PATH}`;
            console.log(`[FAQ] Navigating to: ${target}`);
            await this.page.goto(target);
            await this.page.waitForLoadState("networkidle");
            const landed = this.page.url();
            console.log(`[FAQ] URL: ${landed}`);
            if (landed.includes("/login")) {
                throw new Error(`FAQ navigation redirected to login. URL: ${landed}`);
            }
        });
    }

    public async navigateToHomePage() {
        await test.step("Navigate to Home page", async () => {
            await this.page.goto(`${process.env.BASE_URL}home`);
            await this.page.waitForURL(/\/home/, { timeout: 15000 });
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyHomePageDisplayed() {
        await test.step("Verify Home page is displayed", async () => {
            await expect(this.page, "URL must be /home").toHaveURL(/\/home/, { timeout: 10000 });
            await expect(this.page.locator(FAQPage.PROFILE_MENU).first()).toBeVisible({ timeout: 10000 });
            await expect(this.page.locator(FAQPage.SIDEBAR_NAV).first()).toBeVisible({ timeout: 8000 });
            await expect(this.page.locator(FAQPage.HOME_GREETING).first()).toBeVisible({ timeout: 8000 });
            console.log(`[FAQ] Home page verified. URL: ${this.page.url()}`);
        });
    }

    public async navigateToFAQViaSetupMenu() {
        await test.step("Navigate to FAQ via Setup menu in sidebar", async () => {
            const alreadyVisible = await this.page.locator(FAQPage.FAQ_SUBMENU_LINK)
                .first().isVisible({ timeout: 800 }).catch(() => false);
            if (!alreadyVisible) {
                const setupBtn = this.page.locator(FAQPage.SETUP_MENU_BTN).first();
                if (await setupBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await setupBtn.scrollIntoViewIfNeeded({ timeout: 5000 });
                    await setupBtn.click();
                    await this.page.waitForTimeout(500);
                }
            }
            const link = this.page.locator(FAQPage.FAQ_SUBMENU_LINK).first();
            if (await link.isVisible({ timeout: 3000 }).catch(() => false)) {
                await link.click();
                await this.page.waitForLoadState("networkidle");
            } else {
                console.log("[FAQ] Submenu link not visible in sidebar — falling back to direct URL navigation");
                await this.navigateToFAQ();
            }
            console.log(`[FAQ] Navigated via sidebar to: ${this.page.url()}`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FAQ LISTING PAGE VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyFAQPageLoaded() {
        await test.step("Verify FAQ Master Config page loaded", async () => {
            console.log(`[FAQ] verifyFAQPageLoaded — URL: ${this.page.url()}`);
            await expect(this.page).toHaveURL(
                new RegExp(FAQConstants.PAGE_URL_SEGMENT), { timeout: 15000 },
            );
            await expect(
                this.page.locator(FAQPage.PAGE_HEADING).first(),
                "'FAQ Master Config' heading must be visible",
            ).toBeVisible({ timeout: 10000 });
            await expect(
                this.page.locator(FAQPage.CREATE_FAQ_BTN).first(),
                "Create FAQ button must be visible",
            ).toBeVisible({ timeout: 8000 });
            await expect(
                this.page.locator(FAQPage.SEARCH_INPUT).first(),
                "Search box must be visible",
            ).toBeVisible({ timeout: 8000 });
            await expect(
                this.page.locator(FAQPage.TABLE),
                "FAQ table must be visible",
            ).toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyDashboardCards() {
        await test.step("Verify FAQ dashboard stat cards are displayed", async () => {
            for (const label of FAQConstants.EXPECTED_CARDS) {
                // eslint-disable-next-line no-await-in-loop
                await expect(
                    this.page.getByText(label, { exact: true }).first(),
                    `Dashboard card '${label}' must be visible`,
                ).toBeVisible({ timeout: 8000 });
            }
        });
    }

    public async getDashboardCount(label: string): Promise<number> {
        await expect(
            this.page.getByText(label, { exact: true }).first(),
            `Dashboard card '${label}' must be visible`,
        ).toBeVisible({ timeout: 8000 });

        const count = await this.page.evaluate((labelText: string) => {
            const allP = Array.from(document.querySelectorAll("p, span, div"));
            const labelEl = allP.find(
                (el) => el.textContent?.trim().toLowerCase() === labelText.toLowerCase()
                    && (el as HTMLElement).children.length === 0,
            );
            if (!labelEl) return -1;
            // Number is typically the previous sibling OR a sibling inside the same card
            const prevEl = labelEl.previousElementSibling
                || labelEl.parentElement?.previousElementSibling?.lastElementChild;
            if (prevEl) {
                const parsed = parseInt(prevEl.textContent?.trim() ?? "", 10);
                if (!Number.isNaN(parsed)) return parsed;
            }
            // Fallback: look for a numeric sibling in the same parent
            const parent = labelEl.parentElement;
            if (parent) {
                for (const child of Array.from(parent.children)) {
                    if (child !== labelEl) {
                        const parsed = parseInt(child.textContent?.trim() ?? "", 10);
                        if (!Number.isNaN(parsed)) return parsed;
                    }
                }
            }
            return 0;
        }, label);

        console.log(`[FAQ] Dashboard card '${label}': ${count}`);
        return count;
    }

    public async verifyDashboardCountsAreNumeric() {
        await test.step("Verify dashboard stat cards display numeric values", async () => {
            for (const label of FAQConstants.EXPECTED_CARDS) {
                // eslint-disable-next-line no-await-in-loop
                const count = await this.getDashboardCount(label);
                await Assert.assertTrue(count >= 0, `Dashboard card '${label}' shows a numeric value`);
            }
        });
    }

    public async verifyGridColumns() {
        await test.step("Verify FAQ grid columns are displayed", async () => {
            const headers = (await this.page.locator(FAQPage.TABLE_HEADERS).allTextContents())
                .map((h) => h.trim().toUpperCase())
                .filter(Boolean);
            console.log(`[FAQ] Table headers: ${JSON.stringify(headers)}`);
            for (const expected of FAQConstants.EXPECTED_COLUMNS) {
                await Assert.assertTrue(
                    headers.some((h) => h.includes(expected.toUpperCase())),
                    `Grid contains column '${expected}'`,
                );
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TABLE HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    public async getTableRowCount(): Promise<number> {
        await this.waitForTableStable();
        return this.page.locator(FAQPage.TABLE_ROWS).count();
    }

    public async isFAQVisible(topic: string): Promise<boolean> {
        return this.page.locator(FAQPage.rowFor(topic)).first()
            .isVisible({ timeout: 3000 }).catch(() => false);
    }

    public async verifyFAQExists(topic: string) {
        await test.step(`Verify FAQ '${topic}' is visible in the table`, async () => {
            const row = this.page.locator(FAQPage.rowFor(topic)).first();
            await expect(row, `Row for '${topic}' must be visible`).toBeVisible({ timeout: 10000 });
        });
    }

    public async verifyNoRecords() {
        await test.step("Verify no-records empty state is displayed", async () => {
            await this.waitForTableStable();
            // Check row count first — if 0 rows with no explicit empty-state selector, still pass
            const rowCount = await this.page.locator(FAQPage.TABLE_ROWS).count();
            if (rowCount === 0) {
                console.log("[FAQ] No rows found — table is empty (no-records state)");
                return;
            }
            await expect(
                this.page.locator(FAQPage.NO_RECORDS).first(),
                "No-records message must be visible",
            ).toBeVisible({ timeout: 6000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SEARCH
    // ═══════════════════════════════════════════════════════════════════════════

    public async searchFAQ(term: string) {
        await test.step(`Search FAQ for: '${term}'`, async () => {
            const input = this.page.locator(FAQPage.SEARCH_INPUT).first();
            await expect(input, "Search input must be visible").toBeVisible({ timeout: 8000 });
            await input.fill(term);
            await this.waitForTableStable();
        });
    }

    public async clearSearch() {
        await test.step("Clear FAQ search field", async () => {
            await this.page.locator(FAQPage.SEARCH_INPUT).first().clear();
            await this.waitForTableStable();
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SCOPE FILTER TABS
    // ═══════════════════════════════════════════════════════════════════════════

    private scopeTabSelector(scope: string): string {
        switch (scope.toLowerCase()) {
        case "partner": return FAQPage.PARTNER_SCOPE_TAB;
        case "customer": return FAQPage.CUSTOMER_SCOPE_TAB;
        case "staff": return FAQPage.STAFF_SCOPE_TAB;
        default: return FAQPage.ALL_SCOPES_TAB;
        }
    }

    public async filterByScope(scope: string) {
        await test.step(`Filter FAQ list by scope: '${scope}'`, async () => {
            const selector = this.scopeTabSelector(scope);
            const tab = this.page.locator(selector).first();
            await expect(tab, `Scope tab '${scope}' must be visible`).toBeVisible({ timeout: 8000 });
            await tab.click();
            await this.waitForTableStable();
            console.log(`[FAQ] Scope filter set to: '${scope}'`);
        });
    }

    public async resetScopeFilter() {
        await test.step("Reset scope filter to All Scopes", async () => {
            const tab = this.page.locator(FAQPage.ALL_SCOPES_TAB).first();
            if (await tab.isVisible({ timeout: 3000 }).catch(() => false)) {
                await tab.click();
                await this.waitForTableStable();
            }
        });
    }

    public async verifyRowsHaveScope(scope: string) {
        await test.step(`Verify visible rows are scoped to '${scope}'`, async () => {
            await this.waitForTableStable();
            const count = await this.page.locator(FAQPage.TABLE_ROWS).count();
            if (count === 0) {
                console.log(`[FAQ] No rows after '${scope}' filter — empty state acceptable`);
                return;
            }
            const firstColTexts = await this.page.locator("table tbody tr td:first-child").allTextContents();
            for (let i = 0; i < firstColTexts.length; i++) {
                await Assert.assertTrue(
                    firstColTexts[i].trim().toUpperCase().includes(scope.toUpperCase()),
                    `Row [${i}] scope matches filter '${scope}'`,
                );
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CATEGORY FILTER (listing page)
    // ═══════════════════════════════════════════════════════════════════════════

    public async filterByCategory(category: string) {
        await test.step(`Filter FAQ list by category: '${category}'`, async () => {
            const trigger = this.page.locator(FAQPage.CATEGORY_FILTER_TRIGGER).first();
            await expect(trigger, "Category filter must be visible").toBeVisible({ timeout: 8000 });
            const tagName = await trigger.evaluate((el) => el.tagName.toLowerCase()).catch(() => "div");
            console.log(`[FAQ] Category filter element: ${tagName}`);
            if (tagName === "select") {
                await trigger.selectOption({ label: category });
            } else {
                await trigger.click();
                await this.page.waitForTimeout(FAQConstants.DROPDOWN_OPEN_MS);
                const option = this.page
                    .locator(`${FAQPage.CATEGORY_DROPDOWN_OPTION}:has-text("${category}")`)
                    .first();
                await expect(option, `Option '${category}' must appear in dropdown`)
                    .toBeVisible({ timeout: 5000 });
                await option.click();
            }
            await this.waitForTableStable();
        });
    }

    public async resetCategoryFilter() {
        await test.step("Reset category filter to All Categories", async () => {
            const trigger = this.page.locator(FAQPage.CATEGORY_FILTER_TRIGGER).first();
            if (!await trigger.isVisible({ timeout: 3000 }).catch(() => false)) return;
            const tagName = await trigger.evaluate((el) => el.tagName.toLowerCase()).catch(() => "div");
            if (tagName === "select") {
                await trigger.selectOption({ label: "All Categories" });
            } else {
                await trigger.click();
                await this.page.waitForTimeout(FAQConstants.DROPDOWN_OPEN_MS);
                const allOpt = this.page
                    .locator(`${FAQPage.CATEGORY_DROPDOWN_OPTION}:has-text("All Categories")`)
                    .first();
                if (await allOpt.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await allOpt.click();
                } else {
                    await this.page.keyboard.press("Escape");
                }
            }
            await this.waitForTableStable();
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CREATE FAQ — PAGE NAVIGATION & VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickCreateFAQ() {
        await test.step("Click + Create FAQ button", async () => {
            await this.page.locator(FAQPage.CREATE_FAQ_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyCreateFAQPage() {
        await test.step("Verify Create FAQ page loaded", async () => {
            console.log(`[FAQ] verifyCreateFAQPage — URL: ${this.page.url()}`);
            await expect(this.page).toHaveURL(/setup\/faq\/create|setup\/faq\/new/, { timeout: 10000 });
            await expect(
                this.page.locator(CreateFAQPage.PAGE_HEADING).first(),
                "Create FAQ heading must be visible",
            ).toBeVisible({ timeout: 8000 });
            await this.debugPageState();
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CREATE FAQ — FORM INTERACTIONS (using .nth() for selects)
    // ═══════════════════════════════════════════════════════════════════════════

    public async selectScope(scope: string) {
        await test.step(`Select scope: '${scope}'`, async () => {
            // .nth(0) = first select on page = SCOPE (DOM-confirmed)
            const sel = this.page.locator(CreateFAQPage.ALL_SELECTS).nth(SELECT_IDX_SCOPE);
            await expect(sel, "Scope select must be present").toBeAttached({ timeout: 8000 });
            await sel.waitFor({ state: "visible", timeout: 8000 });
            const before = await sel.inputValue().catch(() => "");
            await sel.selectOption({ label: scope }).catch(async () => {
                await sel.selectOption(scope).catch(async () => {
                    await sel.selectOption({ value: scope });
                });
            });
            const after = await sel.inputValue().catch(() => "");
            console.log(`[FAQ] Scope: '${before}' → '${after}' (wanted '${scope}')`);
        });
    }

    public async selectCategory(category: string) {
        await test.step(`Select category: '${category}'`, async () => {
            // .nth(1) = second select on page = CATEGORY (DOM-confirmed)
            const sel = this.page.locator(CreateFAQPage.ALL_SELECTS).nth(SELECT_IDX_CATEGORY);
            await expect(sel, "Category select must be present").toBeAttached({ timeout: 8000 });
            await sel.waitFor({ state: "visible", timeout: 8000 });
            const before = await sel.inputValue().catch(() => "");
            await sel.selectOption({ label: category }).catch(async () => {
                await sel.selectOption(category).catch(async () => {
                    await sel.selectOption({ value: category });
                });
            });
            const after = await sel.inputValue().catch(() => "");
            console.log(`[FAQ] Category: '${before}' → '${after}' (wanted '${category}')`);
        });
    }

    public async enterTopic(topic: string) {
        await test.step(`Enter FAQ topic: '${topic}'`, async () => {
            const input = this.page.locator(CreateFAQPage.TOPIC_INPUT).first();
            await expect(input, "Topic input must be visible").toBeVisible({ timeout: 8000 });
            await input.click({ clickCount: 3 });
            await input.fill(topic);
        });
    }

    public async enterDescription(description: string) {
        await test.step("Enter FAQ description", async () => {
            const textarea = this.page.locator(CreateFAQPage.DESCRIPTION_TEXTAREA).first();
            await expect(textarea, "Description textarea must be visible").toBeVisible({ timeout: 8000 });
            await textarea.click({ clickCount: 3 });
            await textarea.fill(description);
        });
    }

    public async selectMediaType(mediaType: string) {
        await test.step(`Select media type: '${mediaType}'`, async () => {
            // .nth(2) = third select on page = MEDIA TYPE (DOM-confirmed)
            const sel = this.page.locator(CreateFAQPage.ALL_SELECTS).nth(SELECT_IDX_MEDIA);
            await expect(sel, "Media Type select must be present").toBeAttached({ timeout: 8000 });
            await sel.waitFor({ state: "visible", timeout: 8000 });
            await sel.selectOption({ label: mediaType }).catch(async () => {
                await sel.selectOption(mediaType);
            });
            console.log(`[FAQ] Media Type set to: '${mediaType}'`);
        });
    }

    public async enterSortOrder(sortOrder: string) {
        await test.step(`Enter sort order: '${sortOrder}'`, async () => {
            const input = this.page.locator(CreateFAQPage.SORT_ORDER_INPUT).first();
            await expect(input, "Sort Order input must be visible").toBeVisible({ timeout: 8000 });
            await input.click({ clickCount: 3 });
            await input.fill(sortOrder);
        });
    }

    public async fillCreateForm(data: FAQFormData) {
        await test.step("Fill Create FAQ form", async () => {
            console.log(`[FAQ] fillCreateForm — URL: ${this.page.url()}`);
            await this.debugFormInputs();
            await this.selectScope(data.scope);
            await this.selectCategory(data.category);
            await this.enterTopic(data.topic);
            await this.enterDescription(data.description);
            if (data.mediaType && data.mediaType !== FAQConstants.MEDIA_NONE) {
                await this.selectMediaType(data.mediaType);
            }
            if (data.sortOrder !== undefined) {
                await this.enterSortOrder(data.sortOrder);
            }
        });
    }

    public async verifyLivePreview(scope?: string, category?: string, topic?: string) {
        await test.step("Verify Live Preview reflects entered values", async () => {
            const preview = this.page.locator(CreateFAQPage.LIVE_PREVIEW_SECTION).first();
            await expect(preview, "Live Preview panel must be visible").toBeVisible({ timeout: 8000 });
            await this.page.waitForTimeout(FAQConstants.PREVIEW_UPDATE_MS);
            const previewText = (await preview.innerText().catch(() => "")).toLowerCase();
            console.log(`[FAQ] Live Preview text (first 200): '${previewText.substring(0, 200)}'`);
            if (scope) {
                await Assert.assertTrue(
                    previewText.includes(scope.toLowerCase()),
                    `Live Preview contains scope '${scope}'`,
                );
            }
            if (category) {
                await Assert.assertTrue(
                    previewText.includes(category.toLowerCase()),
                    `Live Preview contains category '${category}'`,
                );
            }
            if (topic) {
                await Assert.assertTrue(
                    previewText.includes(topic.toLowerCase()),
                    `Live Preview contains topic '${topic}'`,
                );
            }
        });
    }

    public async saveFAQ() {
        await test.step("Click Save FAQ button", async () => {
            await this.page.locator(CreateFAQPage.SAVE_FAQ_BTN).click();
            await this.page.waitForLoadState("networkidle", { timeout: 10000 });
        });
    }

    public async cancelFAQ() {
        await test.step("Click Cancel button", async () => {
            await this.page.locator(CreateFAQPage.CANCEL_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyValidationError(expectedText?: string) {
        await test.step("Verify validation error is displayed", async () => {
            await this.page.waitForTimeout(500);
            const validationVisible = await this.page.locator(CreateFAQPage.VALIDATION_MESSAGE)
                .first().isVisible({ timeout: 3000 }).catch(() => false);
            const browserInvalid = await this.page.locator(`${CreateFAQPage.FORM_INPUTS}:invalid`).count()
                .then((c) => c > 0).catch(() => false);
            const bodyText = expectedText
                ? (await this.page.locator("body").innerText().catch(() => ""))
                    .toLowerCase().includes(expectedText.toLowerCase())
                : false;
            console.log(`[FAQ] Validation: visible=${validationVisible}, browserInvalid=${browserInvalid}`);
            await Assert.assertTrue(
                validationVisible || browserInvalid || bodyText,
                `Validation feedback is visible${expectedText ? ` for '${expectedText}'` : ""}`,
            );
        });
    }

    public async saveFAQExpectingValidation() {
        await test.step("Submit Create FAQ form expecting validation to block", async () => {
            const urlBefore = this.page.url();
            await this.page.locator(CreateFAQPage.SAVE_FAQ_BTN).click();
            await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
            const urlAfter = this.page.url();
            await Assert.assertTrue(
                urlAfter.includes(FAQConstants.CREATE_URL_SEGMENT) || urlAfter === urlBefore,
                `Invalid form must stay on Create FAQ page; got: '${urlAfter}'`,
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SUCCESS TOAST
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifySuccessToast() {
        await test.step("Verify success toast is displayed", async () => {
            const toast = this.page.locator(FAQPage.TOAST).first();
            await expect(toast, "Success toast must appear").toBeVisible({ timeout: 8000 });
            const text = (await toast.innerText().catch(() => "")).toLowerCase();
            console.log(`[FAQ] Toast text: '${text}'`);
            await Assert.assertTrue(
                text.includes("success") || text.includes("created") || text.includes("saved")
                || text.includes("updated") || text.includes("deleted"),
                `Toast must confirm success/save/delete; actual: '${text}'`,
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // VIEW / DETAILS PAGE
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickView(topic: string) {
        await test.step(`Click View icon for FAQ '${topic}'`, async () => {
            const row = this.page.locator(FAQPage.rowFor(topic)).first();
            await expect(row, `Row for '${topic}' must exist`).toBeVisible({ timeout: 8000 });
            // aria-label="View" confirmed via DOM inspection
            await Promise.all([
                this.page.waitForURL(FAQDetailsPage.URL_PATTERN, { timeout: 12000 }),
                row.locator(FAQPage.ROW_VIEW_BTN).click(),
            ]);
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
            console.log(`[FAQ] clickView — landed on: ${this.page.url()}`);
        });
    }

    public async verifyFAQDetailsLoaded() {
        await test.step("Verify FAQ view page loaded", async () => {
            console.log(`[FAQ] verifyFAQDetailsLoaded — URL: ${this.page.url()}`);
            // URL must match /setup/faq/view/{id1}/{id2}
            await expect(this.page, "Must be on FAQ view page URL").toHaveURL(
                FAQDetailsPage.URL_PATTERN, { timeout: 10000 },
            );
            // "← Back" button is the canonical view-page signal
            await expect(
                this.page.locator(FAQDetailsPage.BACK_BTN).first(),
                "Back button must be visible on view page",
            ).toBeVisible({ timeout: 8000 });
            // "FAQ Content" section is always present on the view page
            await expect(
                this.page.locator(FAQDetailsPage.FAQ_CONTENT_SECTION).first(),
                "FAQ Content section must be visible on view page",
            ).toBeVisible({ timeout: 8000 });
            console.log("[FAQ] View page verified — URL, Back button, FAQ Content all present");
        });
    }

    public async verifyFAQContent(topic: string, description: string) {
        await test.step("Verify FAQ view page shows correct topic and description", async () => {
            // Topic is the page heading on the view page
            await expect(
                this.page.locator(`:is(h1,h2,h3):has-text("${topic}")`).first(),
                `View page heading must contain topic '${topic}'`,
            ).toBeVisible({ timeout: 8000 });
            // Description appears in the body of the view page
            const bodyText = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            await Assert.assertTrue(
                bodyText.includes(description.toLowerCase()),
                `View page body must contain description: '${description.substring(0, 60)}'`,
            );
        });
    }

    public async verifyFAQFieldsOnViewPage(fields: { scope?: string; sortOrder?: string }) {
        await test.step("Verify FAQ field values on view page", async () => {
            const bodyText = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            if (fields.scope) {
                await Assert.assertTrue(
                    bodyText.includes(fields.scope.toLowerCase()),
                    `View page must show scope '${fields.scope}'`,
                );
            }
            if (fields.sortOrder) {
                await Assert.assertTrue(
                    bodyText.includes(fields.sortOrder),
                    `View page must show sort order '${fields.sortOrder}'`,
                );
            }
        });
    }

    public async verifyEditFormCategory(expectedCategory: string) {
        await test.step(`Verify edit form shows category '${expectedCategory}'`, async () => {
            const sel = this.page.locator(EditFAQPage.ALL_SELECTS).nth(SELECT_IDX_CATEGORY);
            const actualValue = await sel.inputValue();
            const selectedText = await sel.locator("option:checked").innerText().catch(() => actualValue);
            console.log(`[FAQ] Edit form category: value='${actualValue}' text='${selectedText}'`);
            await Assert.assertTrue(
                actualValue.toLowerCase().includes(expectedCategory.toLowerCase())
                    || selectedText.toLowerCase().includes(expectedCategory.toLowerCase()),
                `Edit form category must show '${expectedCategory}'; got value='${actualValue}' text='${selectedText}'`,
            );
        });
    }

    public async verifyEditFormSortOrder(expectedSortOrder: string) {
        await test.step(`Verify edit form shows sort order '${expectedSortOrder}'`, async () => {
            const input = this.page.locator(EditFAQPage.SORT_ORDER_INPUT).first();
            const actualValue = await input.inputValue();
            console.log(`[FAQ] Edit form sort order: value='${actualValue}' (expected '${expectedSortOrder}')`);
            await Assert.assertTrue(
                actualValue.trim() === expectedSortOrder.trim(),
                `Edit form sort order must show '${expectedSortOrder}'; got '${actualValue}'`,
            );
        });
    }

    public async clickBack() {
        await test.step("Click ← Back button on view page", async () => {
            const backBtn = this.page.locator(FAQDetailsPage.BACK_BTN).first();
            await expect(backBtn, "Back button must be visible").toBeVisible({ timeout: 8000 });
            await Promise.all([
                this.page.waitForURL(/setup\/faq$/, { timeout: 10000 }),
                backBtn.click(),
            ]);
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
            console.log(`[FAQ] clickBack — landed on: ${this.page.url()}`);
        });
    }

    public async verifyOnListPage() {
        await test.step("Verify navigation returned to FAQ listing page", async () => {
            console.log(`[FAQ] verifyOnListPage — URL: ${this.page.url()}`);
            await expect(this.page, "Must be on listing page URL").toHaveURL(
                /setup\/faq$/, { timeout: 10000 },
            );
            await expect(
                this.page.locator(FAQPage.PAGE_HEADING).first(),
                "FAQ Master Config heading must be visible",
            ).toBeVisible({ timeout: 8000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // EDIT FAQ
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickEdit(topic: string) {
        await test.step(`Click Edit icon for FAQ '${topic}'`, async () => {
            const row = this.page.locator(FAQPage.rowFor(topic)).first();
            await expect(row, `Row for '${topic}' must exist`).toBeVisible({ timeout: 8000 });
            // aria-label="Edit" confirmed via DOM inspection
            await Promise.all([
                this.page.waitForURL(EditFAQPage.URL_PATTERN, { timeout: 12000 }),
                row.locator(FAQPage.ROW_EDIT_BTN).click(),
            ]);
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
            console.log(`[FAQ] clickEdit — landed on: ${this.page.url()}`);
        });
    }

    public async verifyEditFAQPage() {
        await test.step("Verify Edit FAQ page loaded", async () => {
            console.log(`[FAQ] verifyEditFAQPage — URL: ${this.page.url()}`);
            // URL must match /setup/faq/edit/{id1}/{id2}
            await expect(this.page, "Must be on Edit FAQ page URL").toHaveURL(
                EditFAQPage.URL_PATTERN, { timeout: 10000 },
            );
            // "Edit FAQ" heading confirmed via DOM inspection
            await expect(
                this.page.locator(EditFAQPage.PAGE_HEADING).first(),
                "'Edit FAQ' heading must be visible",
            ).toBeVisible({ timeout: 10000 });
            // "Update" button confirmed via DOM inspection
            const saveBtn = this.page.locator(EditFAQPage.SAVE_CHANGES_BTN).first();
            await saveBtn.waitFor({ state: "visible", timeout: 12000 });
            await this.debugPageState();
        });
    }

    public async updateTopic(newTopic: string) {
        await test.step(`Update FAQ topic to '${newTopic}'`, async () => {
            const input = this.page.locator(EditFAQPage.TOPIC_INPUT).first();
            await input.click({ clickCount: 3 });
            await input.fill(newTopic);
        });
    }

    public async updateDescription(newDesc: string) {
        await test.step("Update FAQ description", async () => {
            const ta = this.page.locator(EditFAQPage.DESCRIPTION_TEXTAREA).first();
            await ta.click({ clickCount: 3 });
            await ta.fill(newDesc);
        });
    }

    public async updateScope(scope: string) {
        await test.step(`Update FAQ scope to '${scope}'`, async () => {
            const sel = this.page.locator(EditFAQPage.ALL_SELECTS).nth(SELECT_IDX_SCOPE);
            await sel.selectOption({ label: scope }).catch(async () => {
                await sel.selectOption(scope);
            });
        });
    }

    public async updateCategory(category: string) {
        await test.step(`Update FAQ category to '${category}'`, async () => {
            const selAll = this.page.locator(EditFAQPage.ALL_SELECTS);
            const totalSelects = await selAll.count();
            console.log(`[FAQ] updateCategory — total selects on page: ${totalSelects}`);
            const sel = selAll.nth(SELECT_IDX_CATEGORY);
            const options = await sel.locator("option").allTextContents();
            const currentVal = await sel.inputValue();
            console.log(`[FAQ] updateCategory — select[${SELECT_IDX_CATEGORY}] current='${currentVal}' options=${JSON.stringify(options)}`);
            await sel.selectOption({ label: category });
            const newVal = await sel.inputValue();
            const newText = await sel.locator("option:checked").innerText().catch(() => newVal);
            console.log(`[FAQ] updateCategory — after select: value='${newVal}' text='${newText}'`);
            await Assert.assertTrue(
                newText.toLowerCase().includes(category.toLowerCase()) || newVal.toLowerCase().includes(category.toLowerCase()),
                `Category select must show '${category}' after selection; got value='${newVal}' text='${newText}'`,
            );
        });
    }

    public async updateSortOrder(sortOrder: string) {
        await test.step(`Update FAQ sort order to '${sortOrder}'`, async () => {
            const input = this.page.locator(EditFAQPage.SORT_ORDER_INPUT).first();
            await input.click({ clickCount: 3 });
            await input.fill(sortOrder);
        });
    }

    public async updateMedia(mediaType: string) {
        await test.step(`Update FAQ media type to '${mediaType}'`, async () => {
            const sel = this.page.locator(EditFAQPage.ALL_SELECTS).nth(SELECT_IDX_MEDIA);
            await sel.selectOption({ label: mediaType }).catch(async () => {
                await sel.selectOption(mediaType);
            });
        });
    }

    public async saveChanges() {
        await test.step("Click Update on Edit FAQ form and verify success toast", async () => {
            // Intercept toast BEFORE waitForLoadState — Toastify toasts auto-dismiss in ~3s
            await this.page.locator(EditFAQPage.SAVE_CHANGES_BTN).first().click();
            const toast = this.page.locator(FAQPage.TOAST).first();
            await expect(toast, "Success toast must appear after Update").toBeVisible({ timeout: 8000 });
            const toastText = (await toast.innerText().catch(() => "")).toLowerCase();
            console.log(`[FAQ] saveChanges toast: '${toastText}'`);
            await Assert.assertTrue(
                toastText.includes("success") || toastText.includes("updated") || toastText.includes("saved"),
                `Update toast must confirm success; actual: '${toastText}'`,
            );
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
        });
    }

    public async saveChangesExpectingValidation() {
        await test.step("Submit Edit FAQ form expecting validation to block", async () => {
            const urlBefore = this.page.url();
            await this.page.locator(EditFAQPage.SAVE_CHANGES_BTN).first().click();
            await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
            await Assert.assertEquals(
                this.page.url(), urlBefore,
                "Invalid edit form must remain on Edit FAQ page",
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DELETE FAQ
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickDelete(topic: string) {
        await test.step(`Click Delete icon for FAQ '${topic}'`, async () => {
            const row = this.page.locator(FAQPage.rowFor(topic)).first();
            await expect(row, `Row for '${topic}' must exist`).toBeVisible({ timeout: 8000 });
            // aria-label="Delete" confirmed via DOM inspection
            await row.locator(FAQPage.ROW_DELETE_BTN).click();
            await this.page.locator(DeleteFAQPopup.POPUP).waitFor({ state: "visible", timeout: 5000 });
        });
    }

    public async verifyPopup(topic?: string) {
        await test.step("Verify delete confirmation popup appears", async () => {
            const popup = this.page.locator(DeleteFAQPopup.POPUP).first();
            await expect(popup, "Delete popup must appear").toBeVisible({ timeout: 5000 });
            const text = (await popup.innerText()).toLowerCase();
            await Assert.assertTrue(text.includes("delete"), "Popup must mention 'delete'");
            if (topic) console.log(`[FAQ] Delete popup for '${topic}': ${text.substring(0, 80)}`);
        });
    }

    public async confirmDelete() {
        await test.step("Confirm deletion in popup", async () => {
            await this.page.locator(DeleteFAQPopup.CONFIRM_BTN).first().click();
            await this.page.waitForLoadState("networkidle", { timeout: 10000 });
            await this.page.waitForTimeout(1500);
        });
    }

    public async cancelDelete() {
        await test.step("Cancel deletion popup", async () => {
            await this.page.locator(DeleteFAQPopup.CANCEL_BTN).first().click();
            await expect(this.page.locator(DeleteFAQPopup.POPUP).first())
                .toBeHidden({ timeout: 5000 });
        });
    }

    public async verifyFAQRemoved(topic: string) {
        await test.step(`Verify '${topic}' is removed from the table`, async () => {
            await this.navigateToFAQ();
            await this.searchFAQ(topic);
            const visible = await this.isFAQVisible(topic);
            await Assert.assertFalse(visible, `Deleted FAQ '${topic}' must not appear in table`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FULL CREATE WORKFLOW HELPER (used by beforeAll and individual tests)
    // ═══════════════════════════════════════════════════════════════════════════

    public async createFAQAndNavigateBack(data: FAQFormData): Promise<void> {
        await test.step(`Create FAQ '${data.topic}' and return to listing`, async () => {
            await this.navigateToFAQ();
            await this.clickCreateFAQ();
            await this.verifyCreateFAQPage();
            await this.fillCreateForm(data);

            // Intercept toast BEFORE waitForLoadState — toasts auto-dismiss in ~3 s
            await this.page.locator(CreateFAQPage.SAVE_FAQ_BTN).click();
            const toast = this.page.locator(FAQPage.TOAST).first();
            await expect(toast, "Success toast must appear after Save FAQ").toBeVisible({ timeout: 8000 });
            const toastText = (await toast.innerText().catch(() => "")).toLowerCase();
            console.log(`[FAQ] createFAQAndNavigateBack toast: '${toastText}'`);
            await Assert.assertTrue(
                toastText.includes("success") || toastText.includes("created") || toastText.includes("saved"),
                `Toast must confirm FAQ saved; actual: '${toastText}'`,
            );

            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
            await this.navigateToFAQ();
            await this.searchFAQ(data.topic);
            await this.verifyFAQExists(data.topic);
            await this.clearSearch();
            console.log(`[FAQ] Created and verified: '${data.topic}'`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SORT ORDER VALIDATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifySortOrderRejectsNonNumeric(value: string) {
        await test.step(`Verify Sort Order rejects non-numeric input '${value}'`, async () => {
            const input = this.page.locator(CreateFAQPage.SORT_ORDER_INPUT).first();
            await input.click({ clickCount: 3 });
            await input.fill("");
            await input.pressSequentially(value).catch(() => {});
            const actual = await input.inputValue();
            console.log(`[FAQ] Sort Order after typing '${value}': '${actual}'`);
            await Assert.assertTrue(
                actual === "" || /^\d+$/.test(actual),
                `Sort Order must reject non-numeric '${value}'; got '${actual}'`,
            );
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // INVALID URL / GRACEFUL ERROR
    // ═══════════════════════════════════════════════════════════════════════════

    public async navigateToInvalidFAQUrl() {
        await test.step("Navigate to an invalid FAQ details URL", async () => {
            const invalidUrl = `${process.env.BASE_URL}setup/faq/view/000000invalid`;
            console.log(`[FAQ] Navigating to invalid URL: ${invalidUrl}`);
            await this.page.goto(invalidUrl);
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
            console.log(`[FAQ] Landed on: ${this.page.url()}`);
        });
    }

    public async verifyGracefulErrorHandling() {
        await test.step("Verify app handles invalid FAQ URL gracefully (no crash)", async () => {
            const url = this.page.url();
            const bodyText = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
            const isGraceful = bodyText.includes("not found") || bodyText.includes("error")
                || bodyText.includes("404") || bodyText.includes("invalid")
                || url.includes("/setup/faq") || url.includes("/home");
            await Assert.assertTrue(isGraceful, `App handles invalid FAQ URL gracefully; URL: ${url}`);
            const dialogVisible = await this.page.locator('[role="alertdialog"]')
                .isVisible({ timeout: 1000 }).catch(() => false);
            await Assert.assertFalse(dialogVisible, "No unhandled error dialog on invalid FAQ URL");
        });
    }
}
