import test, { Page, expect } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import BulkPromotionPage from "@pages/BulkPromotionPage";
import BulkPromotionConstants from "@uiConstants/BulkPromotionConstants";

export default class BulkPromotionSteps {
    private ui: UIActions;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }

    public async navigateToBulkPromotion() {
        await test.step(`Navigate to ${BulkPromotionConstants.BULK_PROMOTION_PAGE}`, async () => {
            await this.ui.element(BulkPromotionPage.MENU_BULK_PROMOTION,
                BulkPromotionConstants.MENU_BULK_PROMOTION).click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    public async clickCreate() {
        await test.step(`Click ${BulkPromotionConstants.CREATE_BUTTON}`, async () => {
            await this.page.getByRole("button", { name: "Create" }).click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Entity is the first <select> on the Create page (nth 0).
     */
    public async selectEntity(entity: string) {
        await test.step(`Select entity '${entity}' from ${BulkPromotionConstants.ENTITY_DROPDOWN}`, async () => {
            await this.page.locator(BulkPromotionPage.SELECT).nth(0).selectOption({ label: entity });
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Criteria is the second <select> on the page (nth 1).
     * rowIndex is kept for future multi-row support but currently maps to nth(1 + rowIndex).
     */
    public async selectCriteria(criteria: string, rowIndex = 0) {
        await test.step(`Select criteria '${criteria}' on row ${rowIndex + 1}`, async () => {
            await this.page.locator(BulkPromotionPage.CRITERIA_DROPDOWN)
                .nth(1 + rowIndex)
                .selectOption({ label: criteria });
        });
    }

    public async addCondition() {
        await test.step(`Click ${BulkPromotionConstants.ADD_CONDITION_BUTTON}`, async () => {
            await this.page.locator(BulkPromotionPage.ADD_CONDITION_BUTTON).first().click();
        });
    }

    /**
     * Remove condition row at the given 0-based index among visible "-" buttons.
     */
    public async removeCondition(rowIndex = 0) {
        await test.step(`Click ${BulkPromotionConstants.REMOVE_CONDITION_BUTTON} on row ${rowIndex + 1}`, async () => {
            await this.page.locator(BulkPromotionPage.REMOVE_CONDITION_BUTTON)
                .nth(rowIndex)
                .click();
        });
    }

    /**
     * Operator is the third <select> on the page (nth 2).
     * rowIndex shifts by one per additional condition row.
     */
    public async selectOperator(operator: string, rowIndex = 0) {
        await test.step(`Select operator '${operator}' on row ${rowIndex + 1}`, async () => {
            const locator = this.page.locator(BulkPromotionPage.OPERATOR_DROPDOWN).nth(2 + rowIndex);
            await locator.selectOption({ label: operator });
        });
    }

    /**
     * Value input - one per condition row, matched by placeholder^="Enter".
     */
    public async enterValue(value: string | number, rowIndex = 0) {
        await test.step(`Enter value '${value}' on row ${rowIndex + 1}`, async () => {
            await this.page.locator(BulkPromotionPage.VALUE_INPUT)
                .nth(rowIndex)
                .fill(String(value));
        });
    }

    public async enterDateRange(fromDate: string, toDate: string, rowIndex = 0) {
        await test.step(`Enter date range '${fromDate}' to '${toDate}' on row ${rowIndex + 1}`, async () => {
            const convertedFromDate = this.convertExcelDateToNativeDate(fromDate);
            const convertedToDate = this.convertExcelDateToNativeDate(toDate);
            console.log(`[BulkPromotion] Original date '${fromDate}' -> Converted date '${convertedFromDate}'`);
            console.log(`[BulkPromotion] Original date '${toDate}' -> Converted date '${convertedToDate}'`);

            const dateInputs = this.page.locator(BulkPromotionPage.DATE_INPUTS);
            const startIndex = rowIndex * 2;
            await dateInputs.nth(startIndex).fill(convertedFromDate);
            await dateInputs.nth(startIndex + 1).fill(convertedToDate);
        });
    }

    private convertExcelDateToNativeDate(date: string) {
        const [day, month, year] = date.split("-").map((part) => part.trim());
        return `${year}-${month}-${day}`;
    }

    public async clickViewImpactedCustomer() {
        await test.step(`Click ${BulkPromotionConstants.VIEW_IMPACTED_BUTTON}`, async () => {
            await this.page.getByRole("button", { name: /VIEW IMPACTED CUSTOMER/i }).click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Verify the impacted customer section is visible and the count contains a number.
     */
    public async verifyImpactedCustomers(): Promise<string> {
        return test.step(`Verify ${BulkPromotionConstants.IMPACTED_COUNT} is displayed`, async () => {
            const label = this.page.getByText("TOTAL IMPACTED");
            await expect(label,
                "Expected TOTAL IMPACTED card to be visible on the listing page")
                .toBeVisible({ timeout: 15_000 });
            const card = label.locator("..");
            const count = card.locator("text=/^\\d+$/");
            await expect(count,
                "Expected numeric count to be visible inside TOTAL IMPACTED card")
                .toBeVisible({ timeout: 5_000 });
            const countText = ((await count.textContent()) ?? "").trim();
            expect(countText,
                "Expected TOTAL IMPACTED count to be a number")
                .toMatch(/^\d+$/);
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
                "Expected modal to contain 'Criteria created successfully.'")
                .toContainText("Criteria created successfully.", { timeout: 5_000 });
            await this.page.locator("button.swal2-confirm").click();
            await expect(this.page.locator(".swal2-popup"),
                "Expected SweetAlert2 modal to disappear after clicking OK")
                .not.toBeVisible({ timeout: 10_000 });
        });
    }

    /**
     * Verify no validation error toast is present after submitting valid criteria.
     */
    public async verifyNoValidationError() {
        await test.step("Verify no validation error is displayed", async () => {
            await expect(this.page.locator(BulkPromotionPage.VALIDATION_ERROR),
                "Expected no validation error toast after valid criteria input")
                .toHaveCount(0, { timeout: 5_000 });
        });
    }

    public async verifyDownloadButtonEnabled() {
        await test.step(`Verify ${BulkPromotionConstants.DOWNLOAD_BUTTON} is enabled`, async () => {
            const btn = this.page.getByRole("button", { name: /Download/i });
            await expect(btn, "Expected Download button to be visible")
                .toBeVisible({ timeout: 10_000 });
            await expect(btn, "Expected Download button to be enabled")
                .toBeEnabled();
        });
    }

    public async verifyConditionRowCount(expectedCount: number) {
        await test.step(`Verify condition row count is ${expectedCount}`, async () => {
            await expect(this.page.locator(BulkPromotionPage.CONDITION_ROW),
                `Expected ${expectedCount} condition row(s)`)
                .toHaveCount(expectedCount, { timeout: 5_000 });
        });
    }

    /**
     * Verify the View button exists in the listing table (at least one row present).
     */
    public async verifyViewButton() {
        await test.step(`Verify ${BulkPromotionConstants.TABLE_VIEW_BUTTON} is present in listing`, async () => {
            await expect(this.page.locator(BulkPromotionPage.TABLE_VIEW_BUTTON).first(),
                "Expected at least one View button in the Bulk Promotion listing table")
                .toBeVisible({ timeout: 10_000 });
        });
    }

    /**
     * Identify the latest promotion row (first row in the listing, which is the most recently
     * created), click its View button, and return the 0-based row index so downstream steps
     * can scope the Download button to the same row.
     */
    public async openLatestPromotion(): Promise<number> {
        let rowIndex = 0;
        await test.step("Open latest promotion via View button", async () => {
            const rows = this.page.locator(BulkPromotionPage.TABLE_ROW);
            const rowCount = await rows.count();
            console.log(`[openLatestPromotion] total rows=${rowCount}`);
            rowIndex = 0;
            const rowTextBeforeView = (await rows.nth(rowIndex).innerText().catch(() => "<?>")).trim();
            console.log(`[openLatestPromotion] row[${rowIndex}] text BEFORE View click: ${rowTextBeforeView}`);
            await rows.nth(rowIndex).locator(BulkPromotionPage.TABLE_VIEW_BUTTON).click();
            await this.page.waitForLoadState("domcontentloaded");
        });
        return rowIndex;
    }

    /**
     * Verify the details page: heading, TOTAL IMPACTED section, Download button, Back button.
     * Does NOT check the listing table's Download icon - that is verified after returning.
     */
    public async verifyPromotionDetailsPage() {
        await test.step("Verify Bulk Promotion details page", async () => {
            await expect(this.page.locator(BulkPromotionPage.DETAILS_HEADING).first(),
                "Expected 'View Bulk Promotion' heading on the details page")
                .toBeVisible({ timeout: 10_000 });
            await expect(this.page.getByText("TOTAL IMPACTED"),
                "Expected impacted customer section on the details page")
                .toBeVisible({ timeout: 10_000 });
            await expect(this.page.locator(BulkPromotionPage.DETAILS_DOWNLOAD_BUTTON).first(),
                "Expected Download button on the details page")
                .toBeVisible({ timeout: 5_000 });
            await expect(this.page.locator(BulkPromotionPage.BACK_BUTTON),
                "Expected Back button on the details page")
                .toBeVisible({ timeout: 5_000 });
        });
    }

    /**
     * Click the Back button on the details page and wait for the listing to reload.
     */
    public async clickBackFromDetails() {
        await test.step("Click Back button to return to Bulk Promotion listing", async () => {
            await this.page.locator(BulkPromotionPage.BACK_BUTTON).click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Verify the Download icon button on the specific row (rowIndex) exists in the listing.
     * @param rowIndex 0-based index of the promotion row returned by openLatestPromotion()
     */
    public async verifyTableDownloadButton(rowIndex = 0) {
        await test.step(`Verify Download button on row ${rowIndex} is present in listing table`, async () => {
            const btn = this.page.locator(BulkPromotionPage.TABLE_ROW)
                .nth(rowIndex)
                .locator(BulkPromotionPage.TABLE_DOWNLOAD_BUTTON);
            console.log(`Verifying Download button on row index ${rowIndex}`);
            await expect(btn,
                `Expected Download button on row ${rowIndex} in the Bulk Promotion listing table`)
                .toBeVisible({ timeout: 10_000 });
        });
    }

    /**
     * Click the Download button on the specific row and verify the download event fires.
     * @param rowIndex 0-based index of the promotion row returned by openLatestPromotion()
     */
    public async downloadPromotionCsv(rowIndex = 0) {
        await test.step(`Click Download button on row ${rowIndex} and verify CSV download`, async () => {
            const btn = this.page.locator(BulkPromotionPage.TABLE_ROW)
                .nth(rowIndex)
                .locator(BulkPromotionPage.TABLE_DOWNLOAD_BUTTON);
            console.log(`Clicking Download button on row index ${rowIndex}`);
            console.log("Download button HTML:", await btn.evaluate((el) => el.outerHTML));

            const [download] = await Promise.all([
                this.page.waitForEvent("download", { timeout: 30_000 }),
                btn.click(),
            ]);
            console.log("Download triggered, filename:", download.suggestedFilename());
            expect(download.suggestedFilename(),
                `Expected a file to be downloaded from row ${rowIndex}`)
                .toBeTruthy();
        });
    }

    private async completeImpactedCustomerFlow(criteria: string) {
        await this.clickViewImpactedCustomer();
        await this.verifyCriteriaCreatedSuccessfully();
        await this.verifyNoValidationError();
        await this.verifyImpactedCustomers();
        await this.verifyViewButton();
        const rowIndex = await this.openLatestPromotion();
        await this.verifyPromotionDetailsPage();
        await this.clickBackFromDetails();

        const row = this.page.locator(BulkPromotionPage.TABLE_ROW).nth(rowIndex);
        await expect(row, "Expected listing row to finish loading")
            .not.toContainText("Loading...", { timeout: 15_000 });

        const rowText = await row.innerText().catch(() => "<row not found>");
        // eslint-disable-next-line no-console
        console.log(`[BulkPromotion] criteria='${criteria}' row[${rowIndex}] text: ${rowText}`);

        // Extract impacted count from the row — supports both CUSTOMER and ORDER rows.
        // Row text format: "27\nORDER\n..." or "5\nCUSTOMER\n..." or "0\nORDER\n..."
        const rowCountMatch = rowText.match(/^(\d+)\s*(CUSTOMER|ORDER)/i);
        const rowImpactedCount = rowCountMatch ? parseInt(rowCountMatch[1], 10) : 0;
        // eslint-disable-next-line no-console
        console.log(`[BulkPromotion] criteria='${criteria}' rowImpactedCount=${rowImpactedCount}`);

        if (rowImpactedCount > 0) {
            await this.verifyTableDownloadButton(rowIndex);
            await this.downloadPromotionCsv(rowIndex);
        } else {
            // eslint-disable-next-line no-console
            console.log(
                "[BulkPromotion] No impacted customers available in listing. "
                + "Download not expected - skipping download verification.",
            );
        }
    }

    /**
     * Full single-criteria flow:
     * select criteria -> add condition -> select operator -> enter value ->
     * click View Impacted Customer -> dismiss success modal -> verify no error ->
     * verify TOTAL IMPACTED count -> verify View button in listing ->
     * open details page -> verify details page -> click Back ->
     * verify table Download button -> download CSV.
     * Entity must be selected by the caller before invoking this method.
     */
    public async runCriteriaFlow(criteria: string, value: string, operator = "Equal (eq)") {
        await test.step(`Criteria flow: [${criteria}] ${operator} '${value}'`, async () => {
            await this.selectCriteria(criteria);
            await this.addCondition();
            await this.selectOperator(operator);
            await this.enterValue(value);
            await this.completeImpactedCustomerFlow(criteria);
        });
    }

    public async runPhoneCriteriaFlow(criteria: string, value: string, operator: string) {
        await test.step(`Criteria flow: [${criteria}] ${operator} '${value}'`, async () => {
            const [firstPhone, secondPhone] = this.splitDelimitedValue(value, 2, "phone value");
            const [comparisonOperator, logicalOperator] = this.splitDelimitedValue(operator, 2, "phone operator");

            await this.selectCriteria(criteria);
            await this.addCondition();
            await this.selectOperator(comparisonOperator);
            await this.enterValue(firstPhone);

            await this.addCondition();
            await this.selectOperator(logicalOperator, 1);
            await this.enterValue(secondPhone, 1);

            await this.completeImpactedCustomerFlow(criteria);
        });
    }

    public async runDateCriteriaFlow(criteria: string, fromDate: string, toDate: string, operator = "Date") {
        await test.step(`Criteria flow: [${criteria}] ${operator} '${fromDate}' to '${toDate}'`, async () => {
            await this.selectCriteria(criteria);
            await this.addCondition();
            await this.selectOperator(operator);
            await this.enterDateRange(fromDate, toDate);
            await this.completeImpactedCustomerFlow(criteria);
        });
    }

    public async runRangeCriteriaFlow(criteria: string, minValue: string, maxValue: string, operator = "Range") {
        await test.step(`Criteria flow: [${criteria}] ${operator} '${minValue}' to '${maxValue}'`, async () => {
            await this.selectCriteria(criteria);
            await this.addCondition();
            await this.selectOperator(operator);
            console.log(`[BulkPromotion] Filling Lower Amount: ${minValue}`);
            await this.page.locator(BulkPromotionPage.RANGE_LOWER_INPUT).fill(minValue);
            console.log(`[BulkPromotion] Filling Higher Amount: ${maxValue}`);
            await this.page.locator(BulkPromotionPage.RANGE_HIGHER_INPUT).fill(maxValue);
            await this.completeImpactedCustomerFlow(criteria);
        });
    }

    private splitDelimitedValue(value: string, expectedCount: number, description: string) {
        const values = String(value).split("|").map((item) => item.trim()).filter(Boolean);
        expect(values,
            `Expected ${expectedCount} ${description}(s) separated by '|'`)
            .toHaveLength(expectedCount);
        return values;
    }
}
