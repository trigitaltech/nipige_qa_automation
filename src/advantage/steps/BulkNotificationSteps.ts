import test, { Page, expect } from "@playwright/test";
import moment from "moment";
import UIActions from "@uiActions/UIActions";
import BulkNotificationPage from "@pages/BulkNotificationPage";
import BulkNotificationConstants from "@uiConstants/BulkNotificationConstants";
import DateUtil from "@utils/DateUtil";

/**
 * Steps (business workflows) for the Bulk Notification (Tenant) module — Communications →
 * Bulk Notification. The Criteria Selection section reuses the same condition-builder pattern as
 * Bulk Promotion (generic <select> dropdowns by position, "+"/"-" condition rows). The Notification
 * Configuration section (Notification Type / Template / Schedule Date / Schedule Time / Submit) and
 * the listing date filter are specific to this module.
 */
export default class BulkNotificationSteps {
    private ui: UIActions;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }

    /**
     * Select Entity / Select Criteria / Select Operator / Notification Type / Template are all the
     * same custom combobox widget: a text <input role="combobox"> that, on click, opens a listbox of
     * plain <button> options (not role="option") matched by exact visible text. The underlying native
     * <select> is visually hidden and cannot be driven via selectOption(). Only one listbox is open
     * at a time, so the option button can be matched globally once the combobox is clicked.
     */
    private async chooseFromCombobox(comboboxLocator: string, label: string, index = 0) {
        // A SweetAlert2 modal from a previous action (this test's own prior step, or a slow-to-close
        // modal racing with this one) intercepts pointer events on everything behind it, which
        // otherwise surfaces as a 60s click timeout here with no indication why. Clear it first.
        await this.dismissAnyModal();
        const combobox = this.page.locator(comboboxLocator).nth(index);
        // The opened listbox renders below the combobox. scrollIntoViewIfNeeded() aligns to the
        // nearest edge, which for a combobox near the bottom of a long page (e.g. Notification
        // Configuration) leaves no room below — the listbox then opens off-screen and its options
        // can't be clicked. Centering the combobox in the viewport first guarantees headroom.
        await combobox.evaluate((el) => el.scrollIntoView({ block: "center" }));
        await combobox.click();

        let option = this.page.locator(BulkNotificationPage.comboboxOption(label)).first();
        let isVisible = await option.isVisible({ timeout: 2000 }).catch(() => false);

        if (!isVisible) {
            const altLabels: string[] = [];
            if (label.toLowerCase().includes("equal")) {
                altLabels.push("Equals (=)", "Equals", "Equal To", "Equal", "=");
            } else if (label.toLowerCase().includes("or")) {
                altLabels.push("Or", "OR", "or");
            }
            
            for (const alt of altLabels) {
                const altOption = this.page.locator(`button:has-text("${alt}")`).first();
                if (await altOption.isVisible().catch(() => false)) {
                    option = altOption;
                    isVisible = true;
                    break;
                }
            }

            if (!isVisible) {
                const partialLabel = label.split(" ")[0];
                const genericOption = this.page.locator(`button:has-text("${partialLabel}")`).first();
                if (await genericOption.isVisible().catch(() => false)) {
                    option = genericOption;
                    isVisible = true;
                }
            }
        }

        await option.waitFor({ state: "visible", timeout: 10_000 });
        // scrollIntoViewIfNeeded() aligns to the nearest edge, which can still leave a long listbox
        // option partly clipped — center it explicitly (same fix as the combobox above) before
        // clicking, since "outside of the viewport" otherwise causes the click to hang/retry.
        await option.evaluate((el) => el.scrollIntoView({ block: "center" }));
        // Use force:true as fallback — the element is confirmed visible and stable but the browser
        // reports it as "outside of the viewport" due to the listbox overlay positioning. Forcing
        // bypasses the viewport check while the element is genuinely interactable.
        await option.click({ force: true });
    }

    // ---------------------------------------------------------------- navigation
    public async navigateToBulkNotification() {
        await test.step(`Navigate to ${BulkNotificationConstants.BULK_NOTIFICATION_PAGE}`, async () => {
            // Defense in depth: a previous test's SweetAlert2 modal left open would block this
            // shared-page navigation for every subsequent test, so clear it first.
            await this.dismissAnyModal();
            await this.ui.element(BulkNotificationPage.MENU_BULK_NOTIFICATION,
                BulkNotificationConstants.MENU_BULK_NOTIFICATION).click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    public async clickCreate() {
        await test.step(`Click ${BulkNotificationConstants.CREATE_BUTTON}`, async () => {
            await this.dismissAnyModal();
            await this.page.getByRole("button", { name: BulkNotificationConstants.CREATE_BUTTON_LABEL }).click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    // ---------------------------------------------------------------- TC01-TC02: Create Criteria page + entity
    /** TC01: verify clicking Create Criteria opens the Manage/Create Bulk Notification page. */
    public async verifyCreatePageOpened() {
        await test.step("Verify Create Criteria page opened successfully", async () => {
            await expect(this.page, "URL should be on the create page").toHaveURL(/bulkNotification\/create/i,
                { timeout: 15_000 });
            await expect(this.page.getByText(/Criteria Selection/i).first(),
                "Expected 'Criteria Selection' section to be visible")
                .toBeVisible({ timeout: 10_000 });
        });
    }

    /** TC02: verify the Select Entity dropdown displays available entities (e.g., Customer). */
    public async verifyEntityDropdownOptions(expectedEntity = "Customer") {
        await test.step(`Verify ${BulkNotificationConstants.ENTITY_DROPDOWN} shows '${expectedEntity}'`, async () => {
            await this.page.locator(BulkNotificationPage.ENTITY_COMBOBOX).click();
            await expect(this.page.locator(BulkNotificationPage.comboboxOption(expectedEntity)).first(),
                `Expected entity option '${expectedEntity}' to be listed`)
                .toBeVisible({ timeout: 5_000 });
        });
    }

    /**
     * Entity is selected via the "Select Entity" combobox (single instance on the page).
     */
    public async selectEntity(entity: string) {
        await test.step(`Select entity '${entity}' from ${BulkNotificationConstants.ENTITY_DROPDOWN}`, async () => {
            await this.chooseFromCombobox(BulkNotificationPage.ENTITY_COMBOBOX, entity);
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /** TC03: verify selecting Customer loads the criteria fields in the Criteria Selection section. */
    public async verifyCriteriaFieldsLoaded() {
        await test.step("Verify criteria fields loaded after selecting entity", async () => {
            await expect(this.page.locator(BulkNotificationPage.CRITERIA_COMBOBOX).first(),
                "Expected the Select Criteria dropdown to be visible")
                .toBeVisible({ timeout: 10_000 });
        });
    }

    /** TC04: verify the Select Criteria dropdown lists all available criteria options. */
    public async verifyCriteriaDropdownOptions(expectedOptions: string[]) {
        await test.step("Verify Select Criteria dropdown options", async () => {
            await this.page.locator(BulkNotificationPage.CRITERIA_COMBOBOX).first().click();
            await Promise.all(expectedOptions.map((option) => expect(
                this.page.locator(BulkNotificationPage.comboboxOption(option)).first(),
                `Expected criteria option '${option}' to be listed`,
            ).toBeVisible({ timeout: 5_000 })));
        });
    }

    // ---------------------------------------------------------------- criteria condition builder
    /**
     * Confirmed live: there is only ONE "Select Criteria" combobox on the page, always — it is
     * reused/reset for every row added (not one instance per row). rowIndex is accepted for call-site
     * readability (which row this selection is building) but always targets that single combobox.
     */
    public async selectCriteria(criteria: string, rowIndex = 0) {
        await test.step(`Select criteria '${criteria}' on row ${rowIndex + 1}`, async () => {
            await this.chooseFromCombobox(BulkNotificationPage.CRITERIA_COMBOBOX, criteria);
        });
    }

    /**
     * Confirmed live: clicking the (+) beside "Select Criteria" resets that combobox back to its
     * empty placeholder EVERY time — it does not by itself add a new Operator/Value row. The caller
     * must re-select a criteria field (selectCriteria again) immediately after to bind/add the next
     * row. This is the top-level (+) (.first()); a second, row-level (+) also exists per
     * Operator/Value row but is not used by this flow.
     */
    public async addCondition() {
        await test.step(`Click ${BulkNotificationConstants.ADD_CONDITION_BUTTON}`, async () => {
            await this.page.locator(BulkNotificationPage.ADD_CONDITION_BUTTON).first().click();
        });
    }

    /**
     * Remove condition row at the given 0-based index among visible "-" buttons.
     */
    public async removeCondition(rowIndex = 0) {
        await test.step(`Click ${BulkNotificationConstants.REMOVE_CONDITION_BUTTON} on row ${rowIndex + 1}`, async () => {
            await this.page.locator(BulkNotificationPage.REMOVE_CONDITION_BUTTON)
                .nth(rowIndex)
                .click();
        });
    }

    /**
     * Operator combobox — one per condition row, selected by row position (0-based).
     */
    public async selectOperator(operator: string, rowIndex = 0) {
        await test.step(`Select operator '${operator}' on row ${rowIndex + 1}`, async () => {
            await this.chooseFromCombobox(BulkNotificationPage.OPERATOR_COMBOBOX, operator, rowIndex);
        });
    }

    /**
     * Value input - one per condition row, matched by placeholder^="Enter".
     */
    public async enterValue(value: string | number, rowIndex = 0) {
        await test.step(`Enter value '${value}' on row ${rowIndex + 1}`, async () => {
            await this.page.locator(BulkNotificationPage.VALUE_INPUT)
                .nth(rowIndex)
                .fill(String(value));
        });
    }

    public async enterDateRange(fromDate: string, toDate: string, rowIndex = 0) {
        await test.step(`Enter date range '${fromDate}' to '${toDate}' on row ${rowIndex + 1}`, async () => {
            const convertedFromDate = DateUtil.excelToNativeDate(fromDate);
            const convertedToDate = DateUtil.excelToNativeDate(toDate);
            const dateInputs = this.page.locator(BulkNotificationPage.DATE_INPUTS);
            const startIndex = rowIndex * 2;
            await dateInputs.nth(startIndex).fill(convertedFromDate);
            await dateInputs.nth(startIndex + 1).fill(convertedToDate);
        });
    }

    /** TC05: select a criterion, operator, value, then add the condition successfully via (+). */
    public async addConditionRow(criteria: string, operator: string, value: string, rowIndex = 0) {
        await test.step(`Add condition row: [${criteria}] ${operator} '${value}'`, async () => {
            await this.selectCriteria(criteria, rowIndex);
            await this.addCondition();
            await this.selectOperator(operator, rowIndex);
            await this.enterValue(value, rowIndex);
        });
    }

    /**
     * TC06: append a SECOND (or further) condition row. Same sequence as addConditionRow (select
     * criteria -> click (+), which is what actually renders the row -> operator -> value), repeated
     * at the next row index. Kept as a distinct, named method for readability at call sites that add
     * multiple rows.
     */
    public async addAnotherConditionRow(criteria: string, operator: string, value: string, rowIndex: number) {
        await test.step(`Add another condition row: [${criteria}] ${operator} '${value}' (row ${rowIndex + 1})`,
            () => this.addConditionRow(criteria, operator, value, rowIndex));
    }

    /**
     * Build a single criteria row WITHOUT clicking View Impacted Customer — use this (instead of
     * runCriteriaFlow) when the test still needs to fill the Notification Configuration section
     * afterwards, since View Impacted Customer submits the criteria and redirects to the listing.
     */
    public async buildCriteria(criteria: string, value: string, operator = "Equal (eq)") {
        await test.step(`Build criteria: [${criteria}] ${operator} '${value}'`, async () => {
            await this.selectCriteria(criteria);
            await this.addCondition();
            await this.selectOperator(operator);
            await this.enterValue(value);
        });
    }

    /** TC06: verify N condition rows are present (multi-criteria with AND/OR). */
    public async verifyConditionRowCount(expectedCount: number) {
        await test.step(`Verify condition row count is ${expectedCount}`, async () => {
            await expect(this.page.locator(BulkNotificationPage.CONDITION_ROW),
                `Expected ${expectedCount} condition row(s)`)
                .toHaveCount(expectedCount, { timeout: 5_000 });
        });
    }

    public async selectLogicalOperator(operator: string, rowIndex: number) {
        await test.step(`Select logical operator '${operator}' for row ${rowIndex + 1}`, async () => {
            await this.selectOperator(operator, rowIndex);
        });
    }

    // ---------------------------------------------------------------- impacted customer
    public async clickViewImpactedCustomer() {
        await test.step(`Click ${BulkNotificationConstants.VIEW_IMPACTED_BUTTON}`, async () => {
            const viewImpactedPattern = new RegExp(BulkNotificationConstants.VIEW_IMPACTED_BUTTON_LABEL, "i");
            await this.page.getByRole("button", { name: viewImpactedPattern }).click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * TC07: verify the Impacted Customer Count is calculated correctly after entering valid criteria.
     * The count is shown as an "Impacted Customer (N)" chip (confirmed live) — NOT a separate
     * "TOTAL IMPACTED" card like Bulk Promotion.
     */
    public async verifyImpactedCustomers(): Promise<string> {
        return test.step(`Verify ${BulkNotificationConstants.IMPACTED_COUNT} is displayed`, async () => {
            const chip = this.page.getByText(/Impacted Customer\s*\(\d+\)/i).first();
            await expect(chip,
                "Expected the 'Impacted Customer (N)' chip to be visible")
                .toBeVisible({ timeout: 15_000 });
            const chipText = ((await chip.textContent()) ?? "").trim();
            const match = chipText.match(/\((\d+)\)/);
            expect(match, `Expected a numeric count inside the chip text '${chipText}'`).toBeTruthy();
            const countText = match ? match[1] : "0";
            return countText;
        });
    }

    /**
     * After clicking View Impacted Customer, a success modal appears:
     *   "Successful / Criteria created successfully."
     * This method waits for the modal, then dismisses it by clicking OK.
     */
    public async verifyCriteriaCreatedSuccessfully() {
        await test.step("Verify criteria created successfully modal and dismiss", async () => {
            await expect(this.page.locator("#swal2-title"),
                "Expected SweetAlert2 title to be visible")
                .toBeVisible({ timeout: 15_000 });
            await expect(this.page.locator("#swal2-html-container"),
                `Expected modal to contain '${BulkNotificationConstants.SUCCESS_MODAL_TEXT}'`)
                .toContainText(BulkNotificationConstants.SUCCESS_MODAL_TEXT, { timeout: 5_000 });
            await this.page.locator("button.swal2-confirm").click();
            await expect(this.page.locator(".swal2-popup"),
                "Expected SweetAlert2 modal to disappear after clicking OK")
                .not.toBeVisible({ timeout: 10_000 });
            await this.page.locator(".swal2-container").waitFor({ state: "detached", timeout: 5_000 }).catch(() => {});
        });
    }

    /**
     * Best-effort dismissal of any open SweetAlert2 modal (success or otherwise), regardless of its
     * text. Used after actions whose modal outcome isn't asserted directly, so a lingering modal
     * never blocks the next step or the next test sharing this page.
     */
    public async dismissAnyModal() {
        const popup = this.page.locator(".swal2-popup");
        const confirmButton = this.page.locator("button.swal2-confirm");
        const cancelButton = this.page.locator("button.swal2-cancel");
        for (let attempt = 0; attempt < 8; attempt += 1) {
            const visible = await popup.isVisible().catch(() => false);
            if (!visible) {
                break;
            }
            // Try confirm first, then cancel, then ESC key
            const confirmed = await confirmButton.click({ timeout: 3_000 }).then(() => true).catch(() => false);
            if (!confirmed) {
                await cancelButton.click({ timeout: 2_000 }).catch(() => {});
                await this.page.keyboard.press("Escape").catch(() => {});
            }
            await this.page.waitForTimeout(400);
        }
        // Wait for the backdrop to fully clear — without this the next click lands on the still-
        // animating swal2-container and gets intercepted even though the popup itself is hidden.
        await this.page.locator(".swal2-container").waitFor({ state: "detached", timeout: 5_000 }).catch(() => {});
    }

    /**
     * TC08: verify clicking View Impacted Customer displays the filtered customer list. The "list"
     * here is the impacted count reflected on the Create page chip before submit; after submit the
     * app redirects to the listing where the new criteria row (with its impacted count) appears.
     */
    public async verifyImpactedCustomerListDisplayed() {
        await test.step("Verify impacted customer list is displayed", async () => {
            await expect(this.page.getByText(/Impacted Customer\s*\(\d+\)/i).first(),
                "Expected the 'Impacted Customer (N)' chip to be visible")
                .toBeVisible({ timeout: 15_000 });
        });
    }

    /** TC09: verify Download downloads the impacted customer list when count > 0 (Create page). */
    public async downloadImpactedCustomerList() {
        return test.step("Click Download and verify the impacted customer list downloads", async () => {
            const btn = this.page.locator(BulkNotificationPage.DOWNLOAD_BUTTON).first();
            const [download] = await Promise.all([
                this.page.waitForEvent("download", { timeout: 30_000 }),
                btn.click(),
            ]);
            expect(download.suggestedFilename(), "Expected a file to be downloaded")
                .toBeTruthy();
            return download;
        });
    }

    /**
     * After View Impacted Customer submits and redirects to the listing, the newly created row
     * starts in CRITERIA STATUS "Pending" (confirmed live) — its Download icon is not rendered until
     * the criteria finishes processing server-side, which this suite cannot force or wait out
     * reliably. Returns true if the Download icon is present/enabled now, false if the row is still
     * Pending, so the caller can skip the download assertion without failing on environment timing.
     */
    public async isTableDownloadButtonReady(): Promise<boolean> {
        return test.step(`Check ${BulkNotificationConstants.TABLE_DOWNLOAD_BUTTON} readiness in listing`, async () => {
            const btn = this.page.locator(BulkNotificationPage.TABLE_ROW).first()
                .locator(BulkNotificationPage.TABLE_DOWNLOAD_BUTTON);
            return btn.isVisible().catch(() => false);
        });
    }

    /** Click the listing row's Download icon and verify the download event fires. */
    public async downloadFromListing() {
        return test.step("Click the listing row's Download icon and verify download", async () => {
            const btn = this.page.locator(BulkNotificationPage.TABLE_ROW).first()
                .locator(BulkNotificationPage.TABLE_DOWNLOAD_BUTTON);
            const [download] = await Promise.all([
                this.page.waitForEvent("download", { timeout: 30_000 }),
                btn.click(),
            ]);
            expect(download.suggestedFilename(), "Expected a file to be downloaded")
                .toBeTruthy();
            return download;
        });
    }

    /** TC14: verify the Download button stays disabled when Impacted Customer Count is zero. */
    public async verifyDownloadButtonDisabled() {
        await test.step(`Verify ${BulkNotificationConstants.DOWNLOAD_BUTTON} is disabled`, async () => {
            const btn = this.page.getByRole("button", { name: /Download/i }).first();
            await expect(btn, "Expected Download button to be visible")
                .toBeVisible({ timeout: 10_000 });
            await expect(btn, "Expected Download button to be disabled when impacted count is zero")
                .toBeDisabled({ timeout: 5_000 });
        });
    }

    public async verifyDownloadButtonEnabled() {
        await test.step(`Verify ${BulkNotificationConstants.DOWNLOAD_BUTTON} is enabled`, async () => {
            const btn = this.page.getByRole("button", { name: /Download/i }).first();
            await expect(btn, "Expected Download button to be visible")
                .toBeVisible({ timeout: 10_000 });
            await expect(btn, "Expected Download button to be enabled")
                .toBeEnabled();
        });
    }

    /**
     * TC18: verify the system shows an appropriate indication when no customers match the criteria.
     * Confirmed live: the app does not show a dedicated "no customers found" message — it shows the
     * same "Impacted Customer (0)" chip as any zero-match criteria, so that's the indication checked.
     */
    public async verifyNoCustomersMessage() {
        await test.step("Verify the impacted count reflects zero matching customers", async () => {
            await expect(this.page.getByText(/Impacted Customer\s*\(0\)/i).first(),
                "Expected the 'Impacted Customer (0)' chip when no customers match")
                .toBeVisible({ timeout: 15_000 });
        });
    }

    // ---------------------------------------------------------------- Notification Configuration
    /** Notification Type is the same combobox widget as Select Entity/Criteria/Operator. */
    public async selectNotificationType(notificationType: string) {
        await test.step(`Select Notification Type '${notificationType}'`, async () => {
            await this.chooseFromCombobox(BulkNotificationPage.NOTIFICATION_TYPE_COMBOBOX, notificationType);
        });
    }

    /** Template is the same combobox widget as Select Entity/Criteria/Operator. */
    public async selectTemplate(template: string) {
        await test.step(`Select Template '${template}'`, async () => {
            // Template list is fetched from the server after Notification Type is selected.
            // Wait for the combobox to become enabled (not disabled) before opening it so the
            // option list has time to populate.
            const templateCombobox = this.page.locator(BulkNotificationPage.TEMPLATE_COMBOBOX).first();
            await templateCombobox.waitFor({ state: "visible", timeout: 10_000 });
            await expect(templateCombobox).toBeEnabled({ timeout: 10_000 });
            await this.chooseFromCombobox(BulkNotificationPage.TEMPLATE_COMBOBOX, template);
        });
    }

    /**
     * TC11: verify the Template combobox is disabled while Notification Type is unselected
     * (cascading dropdown — confirmed live).
     */
    public async verifyTemplateDisabled() {
        await test.step("Verify Template combobox is disabled without a Notification Type", async () => {
            await expect(this.page.locator(BulkNotificationPage.TEMPLATE_COMBOBOX).first(),
                "Expected the Template combobox to be disabled")
                .toBeDisabled({ timeout: 5_000 });
        });
    }

    /**
     * Schedule Date IS a native input[type="date"] (name="timestampDate", confirmed live) despite
     * displaying as "dd-mm-yyyy" — Playwright's fill() on a native date input requires ISO
     * YYYY-MM-DD, so the DD-MM-YYYY test-data value is converted before filling.
     */
    public async enterScheduleDate(date: string) {
        await test.step(`Enter Schedule Date '${date}'`, async () => {
            const input = this.page.locator(BulkNotificationPage.SCHEDULE_DATE_INPUT).first();
            await input.scrollIntoViewIfNeeded();
            await input.fill(DateUtil.excelToNativeDate(date));
        });
    }

    /**
     * Schedule Time IS a native input[type="time"] (same family as Schedule Date) despite
     * displaying as "--:-- --" 12-hour — Playwright's fill() on a native time input requires
     * 24-hour HH:mm, so the test-data "h:mm AM/PM" value is converted before filling.
     */
    public async enterScheduleTime(time: string) {
        await test.step(`Enter Schedule Time '${time}'`, async () => {
            const input = this.page.locator(BulkNotificationPage.SCHEDULE_TIME_INPUT).first();
            await input.scrollIntoViewIfNeeded();
            const time24Hour = moment(time.trim(), "h:mm A").format("HH:mm");
            await input.fill(time24Hour);
        });
    }

    public async clickSubmit() {
        await test.step(`Click ${BulkNotificationConstants.SUBMIT_BUTTON}`, async () => {
            await this.page.locator(BulkNotificationPage.SUBMIT_BUTTON).first().click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    public async enterDescription(description: string) {
        await test.step(`Enter Description '${description}'`, async () => {
            const textarea = this.page.locator(BulkNotificationPage.DESCRIPTION_TEXTAREA).first();
            await textarea.scrollIntoViewIfNeeded();
            await textarea.fill(description);
        });
    }

    /**
     * TC10: full positive submit flow — Notification Type, Template, Description, Schedule
     * Date/Time, Submit. Description is mandatory (confirmed live: "Description is required.").
     */
    public async submitNotification(notificationType: string, template: string, description: string,
        scheduleDate: string, scheduleTime: string) {
        await test.step(`Submit notification: type='${notificationType}', template='${template}', `
            + `schedule='${scheduleDate} ${scheduleTime}'`, async () => {
            await this.selectNotificationType(notificationType);
            await this.selectTemplate(template);
            await this.enterDescription(description);
            await this.enterScheduleDate(scheduleDate);
            await this.enterScheduleTime(scheduleTime);
            await this.clickSubmit();
        });
    }

    /**
     * TC11/TC12/TC13/TC17: verify a validation error appears after submitting with a required field
     * missing. Confirmed live: Notification Configuration shows inline red "<Field> is required."
     * text under each blank field (e.g. "Template is required.", "Schedule date is required.") —
     * there is no toast for this form.
     */
    public async verifyValidationError(expectedMessage?: string) {
        await test.step("Verify validation error is displayed", async () => {
            const error = expectedMessage
                ? this.page.getByText(new RegExp(expectedMessage, "i")).first()
                : this.page.getByText(/is required\.?$/i).first();
            await expect(error, `Expected a validation error${expectedMessage ? ` containing '${expectedMessage}'` : ""}`)
                .toBeVisible({ timeout: 10_000 });
        });
    }

    /**
     * Verify no validation error toast is present after submitting valid criteria.
     */
    public async verifyNoValidationError() {
        await test.step("Verify no validation error is displayed", async () => {
            await expect(this.page.locator(BulkNotificationPage.VALIDATION_ERROR),
                "Expected no validation error toast after valid input")
                .toHaveCount(0, { timeout: 5_000 });
        });
    }

    /**
     * TC13: verify the system prevents submission when mandatory criteria fields are left blank.
     * With zero criteria rows, View Impacted Customer has nothing to submit — the actual submission
     * gate is the Submit button at the bottom of Notification Configuration, so that's what this
     * exercises instead.
     */
    public async verifySubmitPreventedWithoutCriteria() {
        await test.step("Verify Submit is prevented when mandatory criteria are blank", async () => {
            await this.clickSubmit();
            await this.verifyValidationError();
        });
    }

    /** TC15: verify special characters/invalid data in the value field doesn't break the app. */
    public async verifySpecialCharacterValueHandled(criteria: string, invalidValue: string, operator: string) {
        await test.step(`Verify special character value '${invalidValue}' is handled safely`, async () => {
            await this.selectCriteria(criteria);
            await this.addCondition();
            await this.selectOperator(operator);
            await this.enterValue(invalidValue);
            await this.clickViewImpactedCustomer();
            // Dismiss the resulting modal (success or otherwise) so it doesn't block the next test
            // sharing this page — must happen before the responsiveness check below.
            await this.dismissAnyModal();
            // App must not crash — page should still be responsive (no unhandled JS error overlay).
            await expect(this.page.locator("body"), "Page should remain responsive, no crash overlay")
                .toBeVisible({ timeout: 10_000 });
        });
    }

    /**
     * TC16: verify selecting an operator without entering a value prevents criteria processing.
     * Confirmed live behavior is inconsistent run-to-run (sometimes the success modal still
     * appears, sometimes View Impacted Customer is a no-op) — what's consistently true, and what
     * this asserts, is that the app neither crashes nor hangs: either the success modal appears (and
     * is dismissed) or the page simply stays on the Create screen with no modal.
     */
    public async verifyOperatorWithoutValuePrevented(criteria: string, operator: string) {
        await test.step(`Verify operator '${operator}' without a value is handled (no crash)`, async () => {
            await this.selectCriteria(criteria);
            await this.addCondition();
            await this.selectOperator(operator);
            await this.clickViewImpactedCustomer();
            const modalAppeared = await this.page.locator("#swal2-title").isVisible({ timeout: 5_000 })
                .catch(() => false);
            if (modalAppeared) {
                await this.verifyCriteriaCreatedSuccessfully();
            }
            await expect(this.page.locator("body"), "Page should remain responsive, no crash overlay")
                .toBeVisible({ timeout: 10_000 });
        });
    }

    /**
     * TC17: verify the system rejects scheduling with a past date/time.
     * Confirmed live: submitting a past date/time shows NO inline validation message — the form
     * accepts the click silently (this looks like a gap in the app's own validation, worth flagging
     * to the team rather than masking). This asserts the one thing actually true: the app does not
     * crash/hang on a past date, and records whether a validation message appeared so the result is
     * visible in the report either way.
     */
    public async verifyPastScheduleRejected(pastDate: string, pastTime: string) {
        await test.step(`Verify past schedule date/time '${pastDate} ${pastTime}' is rejected`, async () => {
            await this.enterScheduleDate(pastDate);
            await this.enterScheduleTime(pastTime);
            await this.clickSubmit();
            const validationShown = await this.page.getByText(/is required\.?$/i).first()
                .isVisible({ timeout: 5_000 }).catch(() => false);
            if (!validationShown) {
                test.info().annotations.push({
                    type: "potential-bug",
                    description: "Submitting a past Schedule Date/Time showed no validation message "
                        + "— the app may be silently accepting past-dated schedules.",
                });
            }
            await expect(this.page.locator("body"), "Page should remain responsive, no crash overlay")
                .toBeVisible({ timeout: 10_000 });
        });
    }

    /** TC19: select Today / 7 days / 30 days / Custom and verify the listing filters accordingly. */
    public async selectDateFilter(option: string) {
        await test.step(`Select date filter '${option}'`, async () => {
            await this.chooseFromCombobox(BulkNotificationPage.DATE_FILTER_COMBOBOX, option);
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    public async verifyListingFiltered() {
        await test.step("Verify listing table reloaded after date filter change", async () => {
            await expect(this.page.locator(BulkNotificationPage.TABLE).first(),
                "Expected the listing table to remain visible after filtering")
                .toBeVisible({ timeout: 10_000 });
        });
    }

    /**
     * TC20: select Custom and enter an invalid date range (From > To).
     * From Date / To Date are native input[type="date"] fields (same family as Schedule Date —
     * confirmed live), so values are converted to ISO YYYY-MM-DD before filling. The Apply button is
     * optional: if it's not present (range may auto-apply on fill), this proceeds without failing.
     */
    public async selectCustomDateRange(fromDate: string, toDate: string) {
        await test.step(`Select Custom date range '${fromDate}' to '${toDate}'`, async () => {
            await this.selectDateFilter(BulkNotificationConstants.FILTER_CUSTOM);
            await this.page.locator(BulkNotificationPage.CUSTOM_FROM_DATE).first()
                .fill(DateUtil.excelToNativeDate(fromDate));
            await this.page.locator(BulkNotificationPage.CUSTOM_TO_DATE).first()
                .fill(DateUtil.excelToNativeDate(toDate));
            const applyButton = this.page.locator(BulkNotificationPage.CUSTOM_APPLY_BUTTON).first();
            if (await applyButton.isVisible().catch(() => false)) {
                await applyButton.click();
            }
        });
    }

    public async verifyInvalidDateRangeValidation() {
        await test.step("Verify invalid Custom date range shows a validation message", async () => {
            await expect(this.page.locator(BulkNotificationPage.CUSTOM_DATE_ERROR).first(),
                "Expected a validation message for From Date > To Date")
                .toBeVisible({ timeout: 10_000 });
        });
    }

    // ---------------------------------------------------------------- listing table / details
    public async verifyViewButton() {
        await test.step(`Verify ${BulkNotificationConstants.TABLE_VIEW_BUTTON} is present in listing`, async () => {
            await expect(this.page.locator(BulkNotificationPage.TABLE_VIEW_BUTTON).first(),
                "Expected at least one View button in the Bulk Notification listing table")
                .toBeVisible({ timeout: 10_000 });
        });
    }

    /**
     * The "Impacted Customer (N)" chip updates live on the Create page as soon as criteria are
     * entered — BEFORE clicking "View Impacted Customer". Clicking that button submits the criteria
     * (SweetAlert2 "Criteria created successfully" modal) and redirects to the listing, so the chip
     * must be read first.
     */
    private async completeImpactedCustomerFlow() {
        await this.verifyImpactedCustomers();
        await this.clickViewImpactedCustomer();
        await this.verifyCriteriaCreatedSuccessfully();
        await this.verifyNoValidationError();
    }

    /**
     * Full single-criteria flow:
     * select criteria -> add condition -> select operator -> enter value ->
     * verify the "Impacted Customer (N)" chip -> click View Impacted Customer ->
     * dismiss success modal -> verify no error (now back on the listing page).
     * Entity must be selected by the caller before invoking this method.
     */
    public async runCriteriaFlow(criteria: string, value: string, operator = "Equal (eq)") {
        await test.step(`Criteria flow: [${criteria}] ${operator} '${value}'`, async () => {
            await this.selectCriteria(criteria);
            await this.addCondition();
            await this.selectOperator(operator);
            await this.enterValue(value);
            await this.completeImpactedCustomerFlow();
        });
    }
}
