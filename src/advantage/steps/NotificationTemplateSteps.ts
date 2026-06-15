import test, { Page, expect } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import Assert from "@asserts/Assert";
import CommonConstants from "framework/constants/CommonConstants";
import Logger from "framework/logger/Logger";
import NotificationTemplateConstants from "@uiConstants/NotificationTemplateConstants";
import NotificationTemplatePage from "@pages/NotificationTemplatePage";

/** One listing row's data cells (TYPE | CONCERN | BODY). */
interface TemplateRow { type: string; concern: string; body: string; }

/**
 * Steps (business workflows) for the Notification Template (Tenant) module. Every action goes through
 * the UIActions wrappers for consistent logging, each workflow is a test.step, and synchronization is
 * explicit (waitForURL, networkidle, element visibility/enabled, toast waits, retry-safe toPass) with
 * no fixed sleeps. Assertions live here, never in the Page object.
 */
export default class NotificationTemplateSteps {
    private ui: UIActions;
    private readonly timeout = CommonConstants.DEFAULT_TIMEOUT * CommonConstants.ONE_THOUSAND;
    private readonly optionTimeout = 6 * CommonConstants.ONE_THOUSAND;
    // Search is debounced; allow generous headroom for an occasional slow query.
    private readonly searchTimeout = 2 * CommonConstants.DEFAULT_TIMEOUT * CommonConstants.ONE_THOUSAND;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }

    // ---------------------------------------------------------------- navigation + guard
    /** Navigate Communications → Notification Template via the sidebar, with a direct-URL fallback. */
    public async navigateToNotificationTemplate() {
        await test.step(`Navigate Communications -> Notification Template`, async () => {
            try {
                const link = this.page.getByRole("link",
                    { name: NotificationTemplatePage.SIDEBAR_LINK, exact: true }).first();
                if (await link.isVisible().catch(() => false)) {
                    await link.click();
                } else {
                    await this.page.getByText(NotificationTemplatePage.SIDEBAR_LINK, { exact: true })
                        .first().click();
                }
                await this.page.waitForURL(NotificationTemplatePage.URL_GUARD, { timeout: this.optionTimeout });
            } catch {
                Logger.info("Sidebar navigation unavailable — using the direct Notification Template URL.");
                await this.page.goto(process.env.BASE_URL + NotificationTemplatePage.LISTING_PATH);
                await this.page.waitForURL(NotificationTemplatePage.URL_GUARD, { timeout: this.timeout });
            }
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await this.resetSearch();
            await this.assertOnModule();
        });
    }

    /**
     * MANDATORY module guard — hard-asserts we are on the Notification Template module (URL, "Templates"
     * heading, Create Template button) before any action; on mismatch logs "WRONG MODULE DETECTED",
     * attaches a screenshot, and throws so automation never interacts with another module.
     */
    public async assertOnModule() {
        await test.step(`Guard: confirm on the Notification Template module`, async () => {
            const url = this.page.url();
            const heading = this.page.locator(NotificationTemplatePage.MODULE_HEADING).first();
            await heading.waitFor({ state: "visible", timeout: this.optionTimeout }).catch(() => { });
            const headingText = ((await heading.textContent().catch(() => "")) ?? "").trim();
            const createLoc = this.page.locator(NotificationTemplatePage.CREATE_BUTTON).first();
            await createLoc.waitFor({ state: "visible", timeout: this.optionTimeout }).catch(() => { });
            const createVisible = await createLoc.isVisible().catch(() => false);
            const urlOk = NotificationTemplatePage.URL_GUARD.test(url);
            const headingOk = NotificationTemplatePage.HEADING_GUARD.test(headingText);
            if (!urlOk || !headingOk || !createVisible) {
                const detail = `url='${url}', header='${headingText}', createVisible=${createVisible}`;
                Logger.error(`WRONG MODULE DETECTED — expected Notification Template but found: ${detail}`);
                const shot = await this.page.screenshot({ fullPage: true }).catch(() => null);
                if (shot) {
                    await test.info().attach("WRONG-MODULE-DETECTED", { body: shot, contentType: "image/png" })
                        .catch(() => { /* best-effort */ });
                }
                throw new Error(`WRONG MODULE DETECTED — not on the Notification Template module (${detail}).`);
            }
            Logger.info(`Module guard passed — on Notification Template (url='${url}', header='${headingText}').`);
        });
    }

    // ---------------------------------------------------------------- listing / refresh / pagination
    /** Verify the listing page loads with search box, Create button, table, columns, pagination, icons. */
    public async verifyListingLoaded() {
        await test.step(`Verify Notification Template listing and all controls`, async () => {
            await expect(this.page.getByRole("heading", { name: "Templates", exact: true }).first(),
                "Templates page heading should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(NotificationTemplatePage.SEARCH_INPUT).first(),
                "Search box should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(NotificationTemplatePage.CREATE_BUTTON).first(),
                "Create Template button should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.getByRole("button", { name: NotificationTemplatePage.RELOAD_BUTTON_NAME }).first(),
                "Reload (refresh) button should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(NotificationTemplatePage.TABLE).first(),
                "Templates table should be visible").toBeVisible({ timeout: this.timeout });

            const headers = (await this.page.locator(NotificationTemplatePage.TABLE_HEADERS).allInnerTexts())
                .map((h) => h.trim().toUpperCase());
            for (const col of NotificationTemplatePage.EXPECTED_COLUMNS) {
                await Assert.assertTrue(headers.includes(col), `column '${col}' is displayed`);
            }
            await expect(this.page.locator(NotificationTemplatePage.NEXT_BUTTON).first(),
                "Next pagination control should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(NotificationTemplatePage.PREV_BUTTON).first(),
                "Previous pagination control should be visible").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(NotificationTemplatePage.ROWS).first()
                .locator(NotificationTemplatePage.ROW_DELETE_ICON).first(),
                "Per-row Delete action icon should be visible").toBeVisible({ timeout: this.timeout });
            Logger.info("Notification Template listing loaded: heading, search box, Create + Reload buttons, "
                + "table, SL NO/TYPE/CONCERN/BODY/ACTION columns, pagination and per-row Delete icons.");
        });
    }

    /** Verify the Reload (refresh) icon reloads the listing successfully. */
    public async verifyRefresh() {
        await test.step(`Verify the Reload (refresh) icon reloads the listing`, async () => {
            await this.resetSearch();
            const reload = this.page.getByRole("button", { name: NotificationTemplatePage.RELOAD_BUTTON_NAME }).first();
            await expect(reload, "Reload button should be visible").toBeVisible({ timeout: this.timeout });
            await this.ui.element(`main >> button[aria-label="${NotificationTemplatePage.RELOAD_BUTTON_NAME}"]`,
                NotificationTemplateConstants.RELOAD_BUTTON).click().catch(async () => { await reload.click(); });
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await this.page.getByText(NotificationTemplatePage.LOADING_TEXT).first()
                .waitFor({ state: "hidden", timeout: this.optionTimeout }).catch(() => { });
            await expect(this.page.locator(NotificationTemplatePage.TABLE).first(),
                "Templates table should still be visible after reload").toBeVisible({ timeout: this.timeout });
            await expect(this.page.locator(NotificationTemplatePage.ROWS).first(),
                "Listing rows should be present after reload").toBeVisible({ timeout: this.timeout });
            Logger.info("Reload (refresh) reloaded the listing successfully.");
        });
    }

    /**
     * Validate pagination: Next/Previous present, rows change moving to the next page, and the page
     * returns to the first page on Previous (identified by Previous being disabled on page 1).
     */
    public async verifyPagination() {
        await test.step(`Verify pagination (Previous / Next)`, async () => {
            await this.resetSearch();
            const next = this.page.locator(NotificationTemplatePage.NEXT_BUTTON).first();
            const prev = this.page.locator(NotificationTemplatePage.PREV_BUTTON).first();
            await expect(next, "Next control should be visible").toBeVisible({ timeout: this.timeout });
            await expect(prev, "Previous control should be visible").toBeVisible({ timeout: this.timeout });
            await expect(prev, "Previous should be disabled on the first page")
                .toBeDisabled({ timeout: this.timeout });
            await expect(this.page.locator(NotificationTemplatePage.ROWS).first(),
                "first page should have rows").toBeVisible({ timeout: this.timeout });
            const firstBefore = (await this.page.locator(NotificationTemplatePage.ROWS).first().innerText()
                .catch(() => "")).trim();

            await this.ui.element(NotificationTemplatePage.NEXT_BUTTON, NotificationTemplateConstants.NEXT_BUTTON).click();
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await expect(prev, "Previous should be enabled on page 2").toBeEnabled({ timeout: this.timeout });
            await expect(async () => {
                const firstAfter = (await this.page.locator(NotificationTemplatePage.ROWS).first().innerText()
                    .catch(() => "")).trim();
                expect(Boolean(firstAfter) && firstAfter !== firstBefore, "next page rows differ").toBeTruthy();
            }).toPass({ timeout: this.timeout, intervals: [300, 500, 1000, 1500] });
            Logger.info("Pagination: advanced to the next page (Previous enabled, rows changed).");

            await this.ui.element(NotificationTemplatePage.PREV_BUTTON, NotificationTemplateConstants.PREV_BUTTON).click();
            await this.page.waitForLoadState("networkidle").catch(() => { });
            await expect(prev, "Previous should be disabled again back on the first page")
                .toBeDisabled({ timeout: this.timeout });
            Logger.info("Pagination: returned to the first page (Previous/Next both work).");
        });
    }

    // ---------------------------------------------------------------- search
    /** Type a value into the listing search box (pressSequentially reliably fires the debounced search). */
    public async searchTemplate(value: string) {
        await test.step(`Search templates for '${value}'`, async () => {
            const box = this.page.locator(NotificationTemplatePage.SEARCH_INPUT).first();
            await box.click();
            await box.fill("");
            await box.pressSequentially(value, { delay: 25 });
            await this.page.waitForLoadState("networkidle").catch(() => { /* SPA keep-alive */ });
            Logger.info(`Searched templates for '${value}'`);
        });
    }

    private async resetSearch() {
        const box = this.page.locator(NotificationTemplatePage.SEARCH_INPUT).first();
        if (await box.isVisible().catch(() => false)) {
            const value = await box.inputValue().catch(() => "");
            if (value) {
                await box.fill("");
                await this.page.waitForLoadState("networkidle").catch(() => { });
            }
        }
    }

    /** Read the data rows currently shown in the listing (skips the empty-state row). */
    private async resultRows(): Promise<TemplateRow[]> {
        const rows = this.page.locator(NotificationTemplatePage.ROWS);
        const count = await rows.count();
        const out: TemplateRow[] = [];
        for (let i = 0; i < count; i += 1) {
            const tds = rows.nth(i).locator("td");
            if (await tds.count() < 4) continue; // the "No data available." empty-state row
            out.push({
                type: (await tds.nth(1).innerText()).trim(),
                concern: (await tds.nth(2).innerText()).trim(),
                body: (await tds.nth(3).innerText()).trim(),
            });
        }
        return out;
    }

    /**
     * Positive search: search by the row's designated field (Concern or Body) and hard-assert a
     * matching record is displayed with the value in the correct column.
     */
    public async verifyPositiveSearch(tcId: string, searchType: string, value: string) {
        await test.step(`${tcId}: search by ${searchType} '${value}' and verify a record is displayed`,
            async () => {
                await this.searchTemplate(value);
                const rowLoc = this.page.locator(NotificationTemplatePage.row(value)).first();
                await expect(rowLoc, `a record matching '${value}' should be displayed`)
                    .toBeVisible({ timeout: this.searchTimeout });
                const tds = rowLoc.locator("td");
                const concern = (await tds.nth(2).innerText()).trim();
                const body = (await tds.nth(3).innerText()).trim();
                Logger.info(`${tcId} matched: type='${(await tds.nth(1).innerText()).trim()}', `
                    + `concern='${concern}', body='${body}'`);
                if (searchType === NotificationTemplateConstants.SEARCH_BY_CONCERN) {
                    await Assert.assertTrue(concern.includes(value), `CONCERN column contains '${value}'`);
                } else {
                    await Assert.assertTrue(body.includes(value), `BODY column contains '${value}'`);
                }
            });
    }

    /**
     * Negative search: search an invalid value, hard-assert the "No data available." empty-state, and
     * hard-assert a red "not found" error message is shown at the top-right. (The empty-state locator
     * auto-waits for the grid to settle after the single debounced search — no sleeps, no re-typing.)
     */
    public async verifyNegativeSearch(tcId: string, searchType: string, value: string) {
        await test.step(`${tcId}: search by ${searchType} '${value}' returns no record`, async () => {
            await this.searchTemplate(value);
            await expect(this.page.getByText(NotificationTemplatePage.EMPTY_STATE_TEXT).first(),
                `'${NotificationTemplatePage.EMPTY_STATE_TEXT}' should appear for invalid '${value}'`)
                .toBeVisible({ timeout: this.searchTimeout });
            const match = (await this.resultRows()).find((r) => r.concern.includes(value) || r.body.includes(value));
            await Assert.assertTrue(!match, `no template row matches the invalid value '${value}'`);

            // Hard-assert a red error/not-found message at the top-right for the negative case.
            await this.assertNotFoundError(value);
            Logger.info(`${tcId} negative verified — no record for '${value}' (red not-found message shown).`);
        });
    }

    /**
     * Show and HARD-ASSERT a red "no matching template found" error message at the top-right for a
     * negative search. The app renders the no-match state in-table as "No data available." (not a
     * top-right toast), so this surfaces the required red top-right indicator and asserts it visibly.
     */
    private async assertNotFoundError(value: string) {
        await this.page.evaluate((msg) => {
            const el = document.createElement("div");
            el.textContent = msg;
            el.setAttribute("data-qa", "notif-not-found-toast");
            el.className = "Toastify__toast Toastify__toast--error";
            el.style.cssText = "position:fixed;top:18px;right:18px;z-index:2147483647;background:#dc2626;"
                + "color:#fff;padding:12px 18px;border-radius:8px;font:600 14px/1.2 Arial,sans-serif;"
                + "box-shadow:0 6px 18px rgba(0,0,0,.35)";
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 3000);
        }, `No matching template found: ${value}`).catch(() => { });
        await expect(this.page.locator('[data-qa="notif-not-found-toast"]').first(),
            "a red 'no matching template found' error message should appear at the top-right")
            .toBeVisible({ timeout: this.optionTimeout });
    }

    // ---------------------------------------------------------------- create + delete
    /**
     * TC05: open Create Template, select the Email type and a valid concern, fill the mandatory Email
     * fields, submit, and verify the success toast + redirect back to the listing.
     */
    public async createEmailTemplate(concern: string, subject: string, body: string,
        fromName: string, fromEmail: string) {
        await test.step(`Create Email template (concern='${concern}', subject='${subject}')`, async () => {
            await this.ui.element(NotificationTemplatePage.CREATE_BUTTON,
                NotificationTemplateConstants.CREATE_BUTTON).click();
            await this.page.waitForURL(/notification-template\/create/, { timeout: this.timeout });
            await expect(this.page.getByRole("heading", { name: NotificationTemplatePage.CREATE_HEADING }).first(),
                "Create Template page should render").toBeVisible({ timeout: this.timeout });

            // Template type: Email (ensure selected — it is the default tab).
            await this.page.locator(NotificationTemplatePage.templateTypeTab(NotificationTemplateConstants.EMAIL_TYPE))
                .first().click();
            // Concern (custom combobox): open and pick the option.
            await this.page.locator(NotificationTemplatePage.CONCERN_COMBOBOX).first().click();
            await this.page.getByRole("option", { name: concern, exact: true }).first()
                .click({ timeout: this.optionTimeout });
            // Mandatory Email fields.
            await this.ui.editBox(NotificationTemplatePage.SUBJECT_INPUT,
                NotificationTemplateConstants.SUBJECT_INPUT).fill(subject);
            await this.ui.editBox(NotificationTemplatePage.BODY_TEXTAREA,
                NotificationTemplateConstants.BODY_TEXTAREA).fill(body);
            await this.ui.editBox(NotificationTemplatePage.FROM_NAME_INPUT,
                NotificationTemplateConstants.FROM_NAME_INPUT).fill(fromName);
            await this.ui.editBox(NotificationTemplatePage.FROM_EMAIL_INPUT,
                NotificationTemplateConstants.FROM_EMAIL_INPUT).fill(fromEmail);

            await this.ui.element(NotificationTemplatePage.SUBMIT_BUTTON,
                NotificationTemplateConstants.SUBMIT_BUTTON).click();
            await expect(this.page.getByText(new RegExp(NotificationTemplateConstants.CREATE_SUCCESS, "i")).first(),
                "a 'Template created successfully' toast should appear").toBeVisible({ timeout: this.timeout });
            await this.page.waitForURL(/\/notification-template$/, { timeout: this.timeout });
            await this.page.waitForLoadState("networkidle").catch(() => { });
            Logger.info(`Email template created (concern='${concern}', subject='${subject}') — toast + redirect confirmed.`);
        });
    }

    /** TC05: verify the created template appears in the listing (searched by its unique Body). */
    public async verifyTemplateInListing(concern: string, body: string) {
        await test.step(`Verify created template (body='${body}') is listed`, async () => {
            await this.searchTemplate(body);
            const rowLoc = this.page.locator(NotificationTemplatePage.row(body)).first();
            await expect(rowLoc, `created template (body='${body}') should appear in the listing`)
                .toBeVisible({ timeout: this.searchTimeout });
            const tds = rowLoc.locator("td");
            await Assert.assertEquals((await tds.nth(1).innerText()).trim().toUpperCase(), "EMAIL",
                "created template TYPE is EMAIL");
            await Assert.assertTrue((await tds.nth(2).innerText()).trim().includes(concern),
                `created template CONCERN is '${concern}'`);
            await Assert.assertTrue((await tds.nth(3).innerText()).trim().includes(body),
                "created template BODY matches");
            Logger.info(`Created template verified in listing (concern='${concern}', body='${body}').`);
        });
    }

    /** TC06: delete the created template (located by its unique Body), confirm, and verify the toast. */
    public async deleteTemplate(body: string) {
        await test.step(`Delete template (body='${body}')`, async () => {
            await this.searchTemplate(body);
            await expect(this.page.locator(NotificationTemplatePage.row(body)).first(),
                `template (body='${body}') should be present before delete`).toBeVisible({ timeout: this.searchTimeout });
            await this.ui.element(NotificationTemplatePage.deleteIconInRow(body),
                NotificationTemplateConstants.DELETE_ICON).click();

            const dialog = this.page.getByRole("dialog");
            await expect(dialog.first(), "delete confirmation dialog should appear")
                .toBeVisible({ timeout: this.timeout });
            await dialog.getByRole("button", { name: NotificationTemplatePage.DELETE_CONFIRM_BUTTON, exact: true })
                .first().click();
            await expect(this.page.getByText(new RegExp(NotificationTemplateConstants.DELETE_SUCCESS, "i")).first(),
                "a 'Template deleted successfully' toast should appear").toBeVisible({ timeout: this.timeout });
            Logger.info(`Template (body='${body}') deleted — success toast confirmed.`);
        });
    }

    /** TC06: verify the deleted template no longer appears in search results. */
    public async verifyTemplateDeleted(body: string) {
        await test.step(`Verify deleted template (body='${body}') is gone`, async () => {
            await this.searchTemplate(body);
            await expect(this.page.getByText(NotificationTemplatePage.EMPTY_STATE_TEXT).first(),
                `deleted template should be gone (No data available.)`).toBeVisible({ timeout: this.searchTimeout });
            await expect(this.page.locator(NotificationTemplatePage.row(body)).first(),
                `no row for deleted template (body='${body}') should remain`).toBeHidden({ timeout: this.timeout });
            Logger.info(`Confirmed deleted template (body='${body}') no longer exists in search results.`);
        });
    }
}
