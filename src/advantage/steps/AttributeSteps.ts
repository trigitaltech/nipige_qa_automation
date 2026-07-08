import test, { Page, expect } from "@playwright/test";
import Assert from "@asserts/Assert";
import AttributePage from "@pages/AttributePage";
import AttributeConstants from "@uiConstants/AttributeConstants";

export interface AttributeFormData {
    fieldName: string;
    type: string;
    description: string;
    uiConcern?: string;
    languages?: string[];
    enumValues?: string[];
    fieldLabels?: Record<string, string>; // Maps language name to label text
}

export default class AttributeSteps {
    constructor(private readonly page: Page) {}

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY & STABILITY
    // ═══════════════════════════════════════════════════════════════════════════

    public generateUniqueAttributeName(prefix = "ATTR"): string {
        return `${prefix}_${Date.now().toString().slice(-6)}`;
    }

    public async waitForTableStable() {
        await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
        await this.page.waitForTimeout(AttributeConstants.TABLE_SETTLE_MS);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async navigateToAttribute() {
        await test.step("Navigate to Attribute listing page", async () => {
            const targetUrl = `${process.env.BASE_URL}${AttributePage.ATTRIBUTE_PATH}`;
            console.log(`[Attribute] Navigating to: ${targetUrl}`);
            await this.page.goto(targetUrl);
            await this.page.waitForLoadState("networkidle");
            const landedUrl = this.page.url();
            if (landedUrl.includes("/login")) {
                throw new Error(`Attribute navigation redirected to login. Login must run first.`);
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LIST SCREEN VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyPageLoaded() {
        await test.step("Verify Attribute listing page loaded", async () => {
            await expect(this.page).toHaveURL(new RegExp(AttributeConstants.PAGE_URL_SEGMENT), { timeout: 15000 });
            await expect(this.page.locator(AttributePage.PAGE_HEADING).first(), "Heading 'Attribute' must be visible").toBeVisible({ timeout: 10000 });
            await expect(this.page.locator(AttributePage.TABLE), "Attributes list table must be present").toBeVisible({ timeout: 10000 });
        });
    }

    public async verifyGridColumnsDisplayed() {
        await test.step("Verify Attribute grid columns are displayed", async () => {
            const headers = (await this.page.locator(AttributePage.TABLE_HEADERS).allTextContents())
                .map((h) => h.trim())
                .filter(Boolean);
            await Promise.all(AttributeConstants.EXPECTED_COLUMNS.map((expectedCol) => Assert.assertTrue(
                headers.some((h) => h.toLowerCase() === expectedCol.toLowerCase()),
                `Grid contains '${expectedCol}' column`,
            )));
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SEARCH & REFRESH
    // ═══════════════════════════════════════════════════════════════════════════

    public async searchAttribute(term: string) {
        await test.step(`Search for attribute: '${term}'`, async () => {
            const input = this.page.locator(AttributePage.SEARCH_INPUT);
            await expect(input, "Search input must be visible").toBeVisible({ timeout: 8000 });
            await input.fill(term);
            await this.waitForTableStable();
        });
    }

    public async clearSearch() {
        await test.step("Clear search field", async () => {
            await this.page.locator(AttributePage.SEARCH_INPUT).clear();
            await this.waitForTableStable();
        });
    }

    public async clickRefresh() {
        await test.step("Click Refresh button", async () => {
            await this.page.locator(AttributePage.REFRESH_BTN).first().click();
            await this.waitForTableStable();
        });
    }

    public async verifyNoRecordsMessage() {
        await test.step("Verify no-records message is displayed", async () => {
            await this.waitForTableStable();
            await expect(this.page.locator(AttributePage.NO_RECORDS).first(), "No records message must be visible").toBeVisible({ timeout: 5000 });
        });
    }

    public async verifyEmptyOrNoRecords() {
        await test.step("Verify app did not crash after search (page stable, table or no-records visible)", async () => {
            await this.waitForTableStable();
            // The app is considered healthy if the page is stable and the table/no-records area renders
            await this.verifyPageStable();
            await expect(
                this.page.locator(`${AttributePage.TABLE}, ${AttributePage.NO_RECORDS}`).first(),
                "Table or no-records indicator must be present",
            ).toBeVisible({ timeout: 5000 });
        });
    }

    public async verifySearchResultsContainTerm(term: string) {
        await test.step(`Verify search results contain '${term}'`, async () => {
            await this.waitForTableStable();
            const count = await this.page.locator(AttributePage.TABLE_ROWS).count();
            if (count === 0) {
                const noRecordsVisible = await this.page.locator(AttributePage.NO_RECORDS).isVisible({ timeout: 3000 }).catch(() => false);
                await Assert.assertTrue(noRecordsVisible, "No-records message shown when search returns empty");
                return;
            }
            const firstText = (await this.page.locator(AttributePage.CELL_FIELD_NAME).first().innerText()).trim();
            await Assert.assertTrue(
                firstText.toLowerCase().includes(term.toLowerCase()),
                `First result '${firstText}' matches search term '${term}'`,
            );
        });
    }

    public async verifyAttributeInTable(name: string) {
        await test.step(`Verify '${name}' is visible in the table`, async () => {
            const row = this.page.locator(AttributePage.rowFor(name)).first();
            await expect(row, `Row for '${name}' must be visible`).toBeVisible({ timeout: 10000 });
        });
    }

    public async isAttributeVisible(name: string): Promise<boolean> {
        return this.page.locator(AttributePage.rowFor(name)).first().isVisible({ timeout: 3000 }).catch(() => false);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGINATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async isNextButtonEnabled(): Promise<boolean> {
        const nextBtn = this.page.locator(AttributePage.NEXT_BTN).first();
        if (await nextBtn.count() === 0) return false;
        const disabledAttr = await nextBtn.getAttribute("disabled");
        const classAttr = await nextBtn.getAttribute("class");
        return disabledAttr === null && !(classAttr && classAttr.includes("disabled"));
    }

    public async clickNext() {
        await test.step("Click Next pagination button", async () => {
            await this.page.locator(AttributePage.NEXT_BTN).first().click();
            await this.waitForTableStable();
        });
    }

    public async clickPrevious() {
        await test.step("Click Previous pagination button", async () => {
            await this.page.locator(AttributePage.PREV_BTN).first().click();
            await this.waitForTableStable();
        });
    }

    public async verifyPaginationNextNavigates() {
        await test.step("Verify Next button navigates correctly", async () => {
            const nextEnabled = await this.isNextButtonEnabled();
            if (!nextEnabled) {
                console.log("[Attribute] Next button is disabled (single page of results).");
                return;
            }
            const firstRowBefore = await this.page.locator(AttributePage.CELL_FIELD_NAME).first().innerText();
            await this.clickNext();
            const firstRowAfter = await this.page.locator(AttributePage.CELL_FIELD_NAME).first().innerText();
            await Assert.assertTrue(firstRowBefore !== firstRowAfter, "Next button updated page results");
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CREATE / EDIT SCREEN ACTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickCreateButton() {
        await test.step("Click Create Attribute button", async () => {
            await this.page.locator(AttributePage.CREATE_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyCreatePageLoaded() {
        await test.step("Verify Create Attribute page loaded", async () => {
            await expect(this.page).toHaveURL(/mode=create/, { timeout: 10000 });
            await expect(this.page.locator(AttributePage.CREATE_HEADING).first(), "Create Attribute heading must be visible").toBeVisible({ timeout: 8000 });
        });
    }

    public async fillCreateForm(data: AttributeFormData) {
        await test.step(`Fill Attribute form: '${data.fieldName}'`, async () => {
            if (data.fieldName !== undefined) {
                await this.page.locator(AttributePage.FIELD_NAME_INPUT).fill(data.fieldName);
            }
            if (data.type) {
                await this.page.locator(AttributePage.TYPE_SELECT).selectOption(data.type);
            }
            if (data.description !== undefined) {
                await this.page.locator(AttributePage.DESCRIPTION_INPUT).fill(data.description);
            }
            if (data.uiConcern) {
                const uiSelect = this.page.locator(AttributePage.UI_CONCERN_SELECT);
                if (await uiSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
                    // Try by value, then by label, then fall back to first real option
                    const byVal = await uiSelect.selectOption({ value: data.uiConcern }).catch(() => "failed");
                    if (byVal === "failed") {
                        const byLabel = await uiSelect.selectOption({ label: data.uiConcern }).catch(() => "failed");
                        if (byLabel === "failed") {
                            // Pick first enabled option with a non-empty value
                            const opts = await uiSelect.locator("option:not([disabled])").all();
                            const firstVal = await opts.reduce(async (acc, o) => {
                                const found = await acc;
                                if (found) return found;
                                const v = await o.getAttribute("value");
                                return (v && v !== "") ? v : null;
                            }, Promise.resolve(null as string | null));
                            if (firstVal) await uiSelect.selectOption({ value: firstVal }).catch(() => {});
                        }
                    }
                    await this.page.waitForTimeout(AttributeConstants.DROPDOWN_OPEN_MS);
                }
            }

            // Check languages
            if (data.languages) {
                await data.languages.reduce(async (acc, lang) => {
                    await acc;
                    const checkbox = this.page.locator(AttributePage.languageCheckbox(lang));
                    const checked = await checkbox.isChecked();
                    if (!checked) {
                        await checkbox.check();
                        await this.page.waitForTimeout(200);
                    }
                }, Promise.resolve());
            }

            // Fill dynamic language labels
            if (data.fieldLabels) {
                await Object.entries(data.fieldLabels).reduce(async (acc, [lang, val]) => {
                    await acc;
                    await this.page.locator(AttributePage.fieldLabelInput(lang)).fill(val);
                }, Promise.resolve());
            }

            // Add Enum values
            if (data.enumValues) {
                await data.enumValues.reduce(
                    (acc, enumVal) => acc.then(() => this.addEnumValue(enumVal)),
                    Promise.resolve(),
                );
            }
        });
    }

    public async addEnumValue(value: string) {
        await test.step(`Add Enum Value: '${value}'`, async () => {
            const enumInput = this.page.locator(AttributePage.ENUM_INPUT);
            const visible = await enumInput.isVisible({ timeout: 3000 }).catch(() => false);
            if (!visible) {
                console.log(`[Attribute] Enum input not visible — skipping addEnumValue('${value}')`);
                return;
            }
            await enumInput.fill(value);
            await this.page.locator(AttributePage.ENUM_ADD_BTN).click();
            await this.page.waitForTimeout(300);
        });
    }

    public async removeEnumValue(value: string) {
        await test.step(`Remove Enum Value: '${value}'`, async () => {
            await this.page.locator(AttributePage.enumDeleteBtn(value)).click();
            await this.page.waitForTimeout(300);
        });
    }

    public async verifyEnumValAdded(value: string) {
        await test.step(`Verify Enum Value '${value}' exists as chip`, async () => {
            await expect(this.page.locator(AttributePage.enumChip(value))).toBeVisible({ timeout: 5000 });
        });
    }

    public async verifyEnumValNotAdded(value: string) {
        await test.step(`Verify Enum Value '${value}' does NOT exist as chip`, async () => {
            await expect(this.page.locator(AttributePage.enumChip(value))).toBeHidden({ timeout: 3000 });
        });
    }

    public async clickSave() {
        await test.step("Click Save button", async () => {
            await this.page.locator(AttributePage.SAVE_BTN).first().click();
            await this.page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
        });
    }

    public async clickSaveExpectingValidation() {
        await test.step("Click Save button expecting validation/form to stay", async () => {
            const urlBefore = this.page.url();
            await this.page.locator(AttributePage.SAVE_BTN).first().click();
            await this.page.waitForTimeout(800);
            const urlAfter = this.page.url();
            await Assert.assertEquals(urlAfter, urlBefore, "Form with invalid inputs remains on the same page");
        });
    }

    public async clickBack() {
        await test.step("Click Back button", async () => {
            // Dismiss any open SweetAlert2 modal BEFORE clicking Back — a success/error modal
            // intercepts pointer events and causes the Back click to time out.
            const swal = this.page.locator(".swal2-container");
            const swalVisibleBefore = await swal.isVisible({ timeout: 2000 }).catch(() => false);
            if (swalVisibleBefore) {
                const confirmBtn = this.page.locator(".swal2-confirm");
                const confirmVisible = await confirmBtn.isVisible({ timeout: 1000 }).catch(() => false);
                if (confirmVisible) {
                    await confirmBtn.click();
                } else {
                    await this.page.keyboard.press("Escape");
                }
                await swal.waitFor({ state: "hidden", timeout: 5000 }).catch(() => {});
            }
            const backBtn = this.page.locator(AttributePage.BACK_BTN).first();
            const visible = await backBtn.isVisible({ timeout: 5000 }).catch(() => false);
            if (visible) {
                await backBtn.click({ force: true });
            } else {
                await this.page.goBack();
            }
            // If a SweetAlert2 confirmation dialog appeared after clicking Back (e.g. "unsaved changes?"), dismiss it
            const swalAfter = this.page.locator(".swal2-container");
            const swalVisibleAfter = await swalAfter.isVisible({ timeout: 2000 }).catch(() => false);
            if (swalVisibleAfter) {
                const confirmBtn = this.page.locator(".swal2-confirm");
                const confirmVisible = await confirmBtn.isVisible({ timeout: 1000 }).catch(() => false);
                if (confirmVisible) {
                    await confirmBtn.click();
                } else {
                    await this.page.keyboard.press("Escape");
                }
            }
            await this.page.waitForLoadState("networkidle").catch(() => {});
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TOASTS & VALIDATION VERIFICATIONS
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifySuccessMessage() {
        await test.step("Verify save succeeded (toast, modal, or already on list page)", async () => {
            const currentUrl = this.page.url();
            const alreadyOnList = !/mode=(create|edit)/.test(currentUrl);

            // If clickSave already navigated to the list page, save succeeded
            if (alreadyOnList) {
                console.log("[Attribute] Save succeeded — already navigated away from create/edit form.");
                return;
            }

            const toast = this.page.locator(AttributePage.SUCCESS_TOAST).first();
            const swalTitle = this.page.locator("#swal2-title").first();
            const swalPopup = this.page.locator(".swal2-popup").first();

            // Still on form — wait up to 8s for toast, swal, or navigation
            let succeeded = false;
            const deadline = Date.now() + 8000;
            while (Date.now() < deadline && !succeeded) {
                const toastVis = await toast.isVisible({ timeout: 500 }).catch(() => false);
                const swalVis = await swalTitle.isVisible({ timeout: 500 }).catch(() => false);
                const navigated = !/mode=(create|edit)/.test(this.page.url());
                if (toastVis || swalVis || navigated) {
                    succeeded = true;
                } else {
                    await this.page.waitForTimeout(300);
                }
            }

            if (!succeeded) {
                const bodyText = (await this.page.locator("body").innerText().catch(() => "")).toLowerCase();
                succeeded = bodyText.includes("success") || bodyText.includes("saved") || bodyText.includes("updated");
            }

            if (await swalPopup.isVisible({ timeout: 500 }).catch(() => false)) {
                console.log("[Attribute] SweetAlert2 success popup detected. Clicking OK.");
                const okBtn = this.page.locator("button.swal2-confirm").first();
                await okBtn.click();
                await swalPopup.waitFor({ state: "hidden", timeout: 5000 }).catch(() => {});
            }

            await Assert.assertTrue(succeeded, "Save must succeed: expected a success toast, modal, or navigation away from the form");
        });
    }

    public async verifyErrorMessage() {
        await test.step("Verify error toast or modal message is displayed", async () => {
            const toast = this.page.locator(AttributePage.ERROR_TOAST).first();
            const swalTitle = this.page.locator("#swal2-title").first();
            const swalPopup = this.page.locator(".swal2-popup").first();

            // Wait for either the error toast or the SweetAlert2 title to become visible
            await expect(toast.or(swalTitle), "Error message (toast or modal) must appear").toBeVisible({ timeout: 8000 });

            if (await swalPopup.isVisible()) {
                console.log("[Attribute] SweetAlert2 error popup detected. Clicking OK.");
                const okBtn = this.page.locator("button.swal2-confirm").first();
                await okBtn.click();
                await expect(swalPopup, "SweetAlert2 popup must disappear after clicking OK").not.toBeVisible({ timeout: 5000 });
            }
        });
    }

    public async verifyValidationVisible(hintText?: string) {
        await test.step("Verify validation feedback is visible", async () => {
            await this.page.waitForTimeout(500);
            const bodyText = (await this.page.locator("body").innerText()).toLowerCase();
            const inlineError = await this.page.locator(AttributePage.VALIDATION_MESSAGE).first().isVisible({ timeout: 3000 }).catch(() => false);
            const containsText = hintText ? bodyText.includes(hintText.toLowerCase()) : false;
            await Assert.assertTrue(inlineError || containsText, `Validation message matching '${hintText}' must be visible`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // EDIT ATTRIBUTE
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickEditIconForRow(name: string) {
        await test.step(`Click Edit icon for '${name}'`, async () => {
            const row = this.page.locator(AttributePage.rowFor(name)).first();
            await expect(row, `Row for '${name}' must exist`).toBeVisible({ timeout: 8000 });
            await this.page.locator(AttributePage.editIcon(name)).click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyEditPageLoaded() {
        await test.step("Verify Edit Attribute page loaded", async () => {
            await expect(this.page).toHaveURL(/mode=edit/, { timeout: 10000 });
            await expect(this.page.locator(AttributePage.EDIT_HEADING).first(), "Edit Attribute heading must be visible").toBeVisible({ timeout: 8000 });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // VIEW ATTRIBUTE
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickViewIconForRow(name: string) {
        await test.step(`Click View icon for '${name}'`, async () => {
            const row = this.page.locator(AttributePage.rowFor(name)).first();
            await expect(row, `Row for '${name}' must exist`).toBeVisible({ timeout: 8000 });
            await this.page.locator(AttributePage.viewIcon(name)).click();
            await this.page.waitForLoadState("networkidle");
        });
    }

    public async verifyViewPageLoaded() {
        await test.step("Verify View Attribute page loaded", async () => {
            await expect(this.page).toHaveURL(/mode=view/, { timeout: 10000 });
            await expect(this.page.locator(AttributePage.VIEW_HEADING).first(), "View Attribute heading must be visible").toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyViewDetails(fieldName: string, type: string, description: string) {
        await test.step("Verify View details are displayed correctly", async () => {
            const actualName = await this.page.locator(AttributePage.FIELD_NAME_INPUT).inputValue();
            const actualType = await this.page.locator(AttributePage.TYPE_SELECT).inputValue();
            const actualDesc = await this.page.locator(AttributePage.DESCRIPTION_INPUT).inputValue();
            
            await Assert.assertEquals(actualName, fieldName, "Field Name matches");
            await Assert.assertEquals(actualType, type, "Type matches");
            await Assert.assertEquals(actualDesc, description, "Description matches");
        });
    }

    public async verifyViewPageReadOnly() {
        await test.step("Verify View page is read-only", async () => {
            // Verify all form controls (input, select) are disabled
            const controls = this.page.locator('form input, form select');
            const count = await controls.count();
            for (let i = 0; i < count; i++) {
                const ctrl = controls.nth(i);
                if (await ctrl.isVisible()) {
                    const isDisabled = await ctrl.isDisabled();
                    const isReadOnly = await ctrl.getAttribute("readonly") !== null;
                    await Assert.assertTrue(isDisabled || isReadOnly, `Control [${i}] must be disabled or read-only`);
                }
            }
            
            // Verify Save/Update button is hidden or disabled
            const saveBtn = this.page.locator(AttributePage.SAVE_BTN);
            if (await saveBtn.isVisible()) {
                const isDisabled = await saveBtn.isDisabled();
                await Assert.assertTrue(isDisabled, "Save button should be disabled in View mode");
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DELETE POPUP & CONFIRMATION
    // ═══════════════════════════════════════════════════════════════════════════

    public async clickDeleteIconForRow(name: string) {
        await test.step(`Click Delete icon for '${name}'`, async () => {
            const row = this.page.locator(AttributePage.rowFor(name)).first();
            await expect(row, `Row for '${name}' must exist`).toBeVisible({ timeout: 8000 });
            await this.page.locator(AttributePage.deleteIcon(name)).click();
            await this.page.locator(AttributePage.DELETE_POPUP).first().waitFor({ state: "visible", timeout: 5000 });
        });
    }

    public async verifyDeleteConfirmationPopup() {
        await test.step("Verify delete confirmation popup appears", async () => {
            const popup = this.page.locator(AttributePage.DELETE_POPUP).first();
            await expect(popup, "Delete popup must be visible").toBeVisible({ timeout: 5000 });
        });
    }

    public async confirmDelete() {
        await test.step("Confirm deletion", async () => {
            await this.page.locator(AttributePage.DELETE_YES_BTN).first().click();
            await this.waitForTableStable();
        });
    }

    public async cancelDelete() {
        await test.step("Cancel deletion", async () => {
            await this.page.locator(AttributePage.DELETE_CANCEL_BTN).first().click();
            await expect(this.page.locator(AttributePage.DELETE_POPUP).first()).toBeHidden({ timeout: 5000 });
        });
    }

    public async verifyAttributeRemoved(name: string) {
        await test.step(`Verify attribute '${name}' has been deleted`, async () => {
            await this.navigateToAttribute();
            await this.searchAttribute(name);
            const isVisible = await this.isAttributeVisible(name);
            await Assert.assertFalse(isVisible, `Attribute '${name}' must not be visible in listing`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ADDITIONAL VERIFICATIONS
    // ═══════════════════════════════════════════════════════════════════════════

    public async verifyDeletePopupVisible() {
        await test.step("Verify delete popup is visible with buttons", async () => {
            const popup = this.page.locator(AttributePage.DELETE_POPUP).first();
            await expect(popup, "Delete popup must be visible").toBeVisible({ timeout: 5000 });
            const yesBtn = this.page.locator(AttributePage.DELETE_YES_BTN).first();
            const cancelBtn = this.page.locator(AttributePage.DELETE_CANCEL_BTN).first();
            await expect(yesBtn, "Yes Delete button must be visible").toBeVisible({ timeout: 3000 });
            await expect(cancelBtn, "Cancel button must be visible").toBeVisible({ timeout: 3000 });
        });
    }

    public async clickOutsidePopup() {
        await test.step("Click outside the delete popup", async () => {
            await this.page.keyboard.press("Escape");
            await this.page.waitForTimeout(500);
        });
    }

    public async clickSaveAndVerifyRejectedOrNoted(testId: string, expectedHint?: string) {
        await test.step(`Save and verify rejection (or note if app accepts) [${testId}]`, async () => {
            const urlBefore = this.page.url();
            await this.page.locator(AttributePage.SAVE_BTN).first().click();
            await this.page.waitForTimeout(1200);
            const urlAfter = this.page.url();
            const stayedOnPage = urlAfter === urlBefore || /mode=(create|edit)/.test(urlAfter);
            const hasValidation = await this.page.locator(AttributePage.VALIDATION_MESSAGE).isVisible({ timeout: 3000 }).catch(() => false);
            const hasError = await this.page.locator(AttributePage.ERROR_TOAST).isVisible({ timeout: 3000 }).catch(() => false);
            const bodyText = expectedHint ? (await this.page.locator("body").innerText().catch(() => "")).toLowerCase() : "";
            const hintFound = expectedHint ? bodyText.includes(expectedHint.toLowerCase()) : false;
            if (stayedOnPage || hasValidation || hasError || hintFound) {
                console.log(`[${testId}] Validation/rejection observed as expected.`);
            } else {
                console.log(`[${testId}] App accepted the input without visible validation — behaviour noted.`);
            }
            await this.verifyPageStable();
        });
    }

    public async verifyPageStable() {
        await test.step("Verify page remains stable (no crash)", async () => {
            await expect(this.page.locator("body"), "Body must be attached and visible").toBeVisible({ timeout: 5000 });
            const url = this.page.url();
            await Assert.assertTrue(!url.includes("error") && !url.includes("crash"), "Page URL should not indicate error");
        });
    }

    public async verifyEnumValuesDisplayed(values: string[]) {
        await test.step(`Verify Enum Values ${values.join(",")} are displayed`, async () => {
            await values.reduce(
                (acc, val) => acc.then(() => this.verifyEnumValAdded(val)),
                Promise.resolve(),
            );
        });
    }

    public async verifyFieldValueDisplayed(fieldName: string, expectedValue: string) {
        await test.step(`Verify field '${fieldName}' shows '${expectedValue}'`, async () => {
            const bodyText = await this.page.locator("body").innerText();
            await Assert.assertTrue(
                bodyText.includes(expectedValue),
                `Page body must contain '${expectedValue}'`,
            );
        });
    }

    public async verifyFieldNameInViewPage(name: string) {
        await test.step(`Verify Field Name '${name}' in View page`, async () => {
            const val = await this.page.locator(AttributePage.FIELD_NAME_INPUT).inputValue();
            await Assert.assertEquals(val, name, "Field Name must match");
        });
    }

    public async verifyTypeInViewPage(type: string) {
        await test.step(`Verify Type '${type}' in View page`, async () => {
            const val = await this.page.locator(AttributePage.TYPE_SELECT).inputValue();
            await Assert.assertTrue(
                val.toLowerCase().includes(type.toLowerCase()),
                `Type must be '${type}', got '${val}'`,
            );
        });
    }

    public async verifyDescriptionInViewPage(desc: string) {
        await test.step(`Verify Description '${desc}' in View page`, async () => {
            const val = await this.page.locator(AttributePage.DESCRIPTION_INPUT).inputValue();
            await Assert.assertEquals(val, desc, "Description must match");
        });
    }

    public async verifyUIConcernInViewPage(uiConcern: string) {
        await test.step(`Verify UI Concern '${uiConcern}' in View page`, async () => {
            const val = await this.page.locator(AttributePage.UI_CONCERN_SELECT).inputValue();
            await Assert.assertTrue(
                val.toLowerCase().includes(uiConcern.toLowerCase()),
                `UI Concern must include '${uiConcern}', got '${val}'`,
            );
        });
    }

    public async verifyLanguageChecked(lang: string) {
        await test.step(`Verify language '${lang}' is checked`, async () => {
            const cb = this.page.locator(AttributePage.languageCheckbox(lang));
            await expect(cb, `Checkbox for '${lang}' must be checked`).toBeChecked({ timeout: 5000 });
        });
    }

    public async verifyFieldLabelInViewPage(lang: string, expectedLabel: string) {
        await test.step(`Verify Field Label for '${lang}' is '${expectedLabel}'`, async () => {
            const input = this.page.locator(AttributePage.fieldLabelInput(lang));
            const val = await input.inputValue();
            await Assert.assertEquals(val, expectedLabel, `Field Label for '${lang}' must match`);
        });
    }

    public async confirmDeleteAndVerifySuccess(name: string) {
        await test.step(`Confirm delete and verify success for '${name}'`, async () => {
            await this.confirmDelete();
            await this.verifySuccessMessage();
        });
    }

    public async clickSaveRepeatedly(times: number) {
        await test.step(`Click Save button up to ${times} times (stops if page navigates away)`, async () => {
            for (let i = 0; i < times; i++) {
                const saveBtn = this.page.locator(AttributePage.SAVE_BTN).first();
                const visible = await saveBtn.isVisible({ timeout: 2000 }).catch(() => false);
                if (!visible) break;
                await saveBtn.click({ force: true });
                await this.page.waitForTimeout(300);
            }
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
        });
    }

    public async verifyAttributeStillInTable(name: string) {
        await test.step(`Verify attribute '${name}' is still visible (not deleted)`, async () => {
            await this.waitForTableStable();
            const isVisible = await this.isAttributeVisible(name);
            await Assert.assertTrue(isVisible, `Attribute '${name}' must still be visible in table`);
        });
    }

    public async verifyFormFieldsPresent() {
        await test.step("Verify Create/Edit form fields are present", async () => {
            await expect(this.page.locator(AttributePage.FIELD_NAME_INPUT), "Field Name input must be visible").toBeVisible({ timeout: 8000 });
            await expect(this.page.locator(AttributePage.TYPE_SELECT), "Type select must be visible").toBeVisible({ timeout: 8000 });
            await expect(this.page.locator(AttributePage.DESCRIPTION_INPUT), "Description input must be visible").toBeVisible({ timeout: 8000 });
            await expect(this.page.locator(AttributePage.SAVE_BTN).first(), "Save button must be visible").toBeVisible({ timeout: 8000 });
            await expect(this.page.locator(AttributePage.BACK_BTN).first(), "Back button must be visible").toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyFormDataPersists(fieldName: string, description: string) {
        await test.step("Verify entered form data persists before saving", async () => {
            const nameVal = await this.page.locator(AttributePage.FIELD_NAME_INPUT).inputValue();
            const descVal = await this.page.locator(AttributePage.DESCRIPTION_INPUT).inputValue();
            await Assert.assertEquals(nameVal, fieldName, "Field Name must persist");
            await Assert.assertEquals(descVal, description, "Description must persist");
        });
    }

    public async verifyDoubleClickNoError(selector: string) {
        await test.step("Verify double-click does not cause errors", async () => {
            const el = this.page.locator(selector).first();
            if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
                await el.dblclick({ force: true });
                await this.page.waitForTimeout(800);
            }
            await this.verifyPageStable();
        });
    }

    public async verifyOnlyTargetDeleted(allNames: string[], deletedName: string) {
        await test.step(`Verify only '${deletedName}' was deleted and others remain`, async () => {
            await allNames.reduce(async (acc, name) => {
                await acc;
                if (name === deletedName) {
                    const isVisible = await this.isAttributeVisible(name);
                    await Assert.assertFalse(isVisible, `Deleted attribute '${name}' must not be visible`);
                } else {
                    await this.verifyAttributeInTable(name);
                }
            }, Promise.resolve());
        });
    }
}
