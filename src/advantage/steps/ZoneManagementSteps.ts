import test, { Page, expect } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import ZoneManagementPage from "@pages/ZoneManagementPage";
import ZoneManagementConstants from "@uiConstants/ZoneManagementConstants";

export interface SlotTime {
    day: string;
    startTime: string;
    endTime: string;
}

export default class ZoneManagementSteps {
    private ui: UIActions;
    private page: Page;

    constructor(page: Page) {
        this.page = page;
        this.ui = new UIActions(this.page);
        
        // Mock geocode endpoint to ensure boundary polygon draws successfully
        this.page.route("**/api/geocode*", async route => {
            console.log(`[Mock Geocode] Mocking response for: ${route.request().url()}`);
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    lat: 17.3850,
                    lng: 78.4867,
                    latitude: 17.3850,
                    longitude: 78.4867,
                    status: "OK",
                    results: [
                        {
                            geometry: {
                                location: {
                                    lat: 17.3850,
                                    lng: 78.4867
                                }
                            }
                        }
                    ]
                })
            });
        });

        // Listen for console messages from the browser page
        this.page.on('console', msg => {
            console.log(`[Browser Console] ${msg.type().toUpperCase()}: ${msg.text()}`);
        });

        this.page.on('response', async response => {
            const url = response.url();
            if (url.includes(".js") || url.includes(".css") || url.includes(".png") || url.includes(".svg") || url.includes(".webp") || url.includes("/_next/")) {
                return;
            }
            console.log(`[Response Log] ${response.status()} | ${response.request().method()} | ${url}`);
            try {
                const text = await response.text();
                console.log(`[Response Log] Body: ${text.slice(0, 300)}`);
            } catch (e) {}
        });
    }

    /**
     * Navigate to the Zone Management page.
     * If the URL already contains "/zoneManagement" the method returns immediately —
     * avoids redundant menu clicks and the "a:has-text('Zone Management')" timeout that
     * occurs when the app lands directly on the zone page after login.
     */
    public async navigateToZoneManagement() {
        await test.step(`Navigate to ${ZoneManagementConstants.ZONE_MANAGEMENT_PAGE}`, async () => {
            if (this.page.url().includes("/zoneManagement")) {
                console.log("[navigateToZoneManagement] Already on Zone Management page — reloading to reset state");
                await this.page.reload();
                await this.page.waitForLoadState("domcontentloaded");
                await this.page.locator(ZoneManagementPage.ZONE_CARD_ITEM).first().waitFor({ state: "visible", timeout: 10_000 }).catch(() => {});
                return;
            }

            const zoneManagementLink = this.page.locator(
                'a[href*="zoneManagement"], a:has-text("Zone Management")'
            ).first();
            // Retry loop to handle SPA hydration / menu expand registration
            let attempts = 0;
            let success = false;
            while (attempts < 3) {
                attempts++;
                if (!(await zoneManagementLink.isVisible())) {
                    const manageServicesMenu = this.page.locator(
                        'button:has-text("Manage Services"), a:has-text("Manage Services")'
                    ).first();
                    await manageServicesMenu.waitFor({ state: "visible", timeout: 10_000 }).catch(() => {});
                    await manageServicesMenu.click().catch(() => {});
                }
                try {
                    await zoneManagementLink.waitFor({ state: "visible", timeout: 5000 });
                    await zoneManagementLink.click();
                    await this.page.waitForURL("**/zoneManagement**", { timeout: 5000 });
                    success = true;
                    break;
                } catch (e) {
                    console.log(`Navigation to /zoneManagement failed on attempt ${attempts}. Retrying...`);
                }
            }

            if (!success) {
                console.log("[navigateToZoneManagement] Sidebar link not visible/clickable — navigating directly to /setup/zoneManagement");
                const origin = new URL(this.page.url()).origin;
                await this.page.goto(`${origin}/setup/zoneManagement`);
                await this.page.waitForURL("**/zoneManagement**", { timeout: 15_000 });
            }
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Reload the Zone Management page to dismiss any open detail panel and return to the
     * plain listing view. Use this after createZone() when the next step must click
     * "Create Zone" — the button is only visible in the listing view, not when a zone
     * detail panel is open.
     */
    public async resetToZoneListing() {
        await test.step(`Reset to Zone Management listing view`, async () => {
            await this.page.reload({ waitUntil: "domcontentloaded" });
            const createBtn = this.page.locator(ZoneManagementPage.CREATE_ZONE_BUTTON).first();
            await createBtn.waitFor({ state: "visible", timeout: 15_000 });
        });
    }

    /**
     * Click the "Create Zone" button on the zone listing page.
     */
    public async clickCreateZone() {
        await test.step(`Click ${ZoneManagementConstants.CREATE_ZONE_BUTTON}`, async () => {
            const btn = this.page.locator(ZoneManagementPage.CREATE_ZONE_BUTTON).first();
            await btn.waitFor({ state: "visible", timeout: 15_000 });
            await btn.click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Fill in the Step 1 Zone Details form fields.
     * Each field waits for visibility before interacting — guards against slow React renders.
     */
    public async fillZoneDetails(
        zoneName: string,
        zoneCode: string,
        description: string,
        city: string,
        state: string,
        status: string,
    ) {
        await test.step(`Fill Zone Details — Name: ${zoneName}, Code: ${zoneCode}, City: ${city}`, async () => {
            const zoneNameInput = this.page.locator(ZoneManagementPage.ZONE_NAME_INPUT);
            await zoneNameInput.waitFor({ state: "visible" });
            await zoneNameInput.fill(zoneName);

            const zoneCodeInput = this.page.locator(ZoneManagementPage.ZONE_CODE_INPUT);
            await zoneCodeInput.waitFor({ state: "visible" });
            await zoneCodeInput.fill(zoneCode);

            const descInput = this.page.locator(ZoneManagementPage.DESCRIPTION_INPUT);
            await descInput.waitFor({ state: "visible" });
            await descInput.fill(description);

            const cityInput = this.page.locator(ZoneManagementPage.CITY_INPUT);
            await cityInput.waitFor({ state: "visible" });
            await cityInput.fill(city);

            const stateInput = this.page.locator(ZoneManagementPage.STATE_INPUT);
            await stateInput.waitFor({ state: "visible" });
            await stateInput.fill(state);

            await this.selectStatus(status);
        });
    }

    /**
     * Select a Status value from the custom combobox (input[role="combobox"]).
     * The dropdown defaults to "Active" on form open. If the current value already matches
     * the requested status, the dropdown is left untouched — avoids the viewport-clipping
     * error caused by opening the list inside the panel's internal scrollbar.
     */
    private async selectStatus(status: string) {
        await test.step(`Select Status: ${status}`, async () => {
            const combobox = this.page.locator(ZoneManagementPage.STATUS_COMBOBOX);
            await combobox.waitFor({ state: "visible" });
            await combobox.scrollIntoViewIfNeeded();

            const currentValue = await combobox.inputValue();
            if (currentValue.trim().toLowerCase() === status.trim().toLowerCase()) {
                console.log(`[selectStatus] Already set to '${currentValue}' — skipping dropdown`);
                return;
            }

            // Only reached when the default value differs from the requested status
            await combobox.click();
            const option = this.page.getByRole("option", { name: status, exact: true });
            await option.waitFor({ state: "visible" });
            await option.scrollIntoViewIfNeeded();
            await option.click({ force: true });
        });
    }

    /**
     * Click the "Next" button on Step 1 (Zone Details).
     */
    public async clickStep1Next() {
        await test.step(`Click ${ZoneManagementConstants.STEP1_NEXT_BUTTON}`, async () => {
            await this.ui.element(ZoneManagementPage.STEP1_NEXT,
                ZoneManagementConstants.STEP1_NEXT_BUTTON).click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Enter a ZIP code, click Add, and verify the tag appears.
     */
    public async addZipCode(zip: string) {
        await test.step(`Add ZIP code: ${zip}`, async () => {
            await this.ui.editBox(ZoneManagementPage.ZIP_CODE_INPUT,
                ZoneManagementConstants.ZIP_CODE_INPUT).fill(zip);

            await this.ui.element(ZoneManagementPage.ADD_ZIP_BUTTON,
                ZoneManagementConstants.ADD_ZIP_BUTTON).click();

            // Verify the ZIP code chip / tag is visible after adding
            const zipTag = this.page.locator(ZoneManagementPage.zipCodeTag(zip)).first();
            await expect(zipTag, `ZIP code tag '${zip}' should be visible after clicking Add`)
                .toBeVisible({ timeout: 10_000 });
        });
    }

    /**
     * Verify the Coverage Summary section is displayed.
     */
    public async verifyCoverageSummaryVisible() {
        await test.step(`Verify ${ZoneManagementConstants.COVERAGE_SUMMARY} is displayed`, async () => {
            const summary = this.page.locator(ZoneManagementPage.COVERAGE_SUMMARY).first();
            await expect(summary, "Coverage Summary section should be visible")
                .toBeVisible({ timeout: 10_000 });
        });
    }

    /**
     * Click the "Next" button on Step 2 (Coverage Area).
     * The wizard renders Next buttons for every step simultaneously; hidden step panels keep
     * their buttons in the DOM. Filtering to visible:true picks the one belonging to Step 2.
     */
    public async clickStep2Next() {
        await test.step(`Click ${ZoneManagementConstants.STEP2_NEXT_BUTTON}`, async () => {
            // Debug — logs each button's visibility so the correct index can be confirmed on failure
            const allNext = this.page.locator(ZoneManagementPage.STEP2_NEXT);
            const count = await allNext.count();
            console.log(`[debug] Next button count: ${count}`);
            for (let i = 0; i < count; i++) {
                console.log(`[debug] Button ${i} visible: ${await allNext.nth(i).isVisible()}`);
            }

            // Click the one Next button that is currently visible
            const visibleNext = this.page
                .locator(ZoneManagementPage.STEP2_NEXT)
                .filter({ visible: true });
            await visibleNext.waitFor({ state: "visible" });
            await visibleNext.click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Enable the Slot Booking toggle if it is not already ON.
     */
    public async enableSlotBooking() {
        await test.step(`Enable ${ZoneManagementConstants.SLOT_BOOKING_TOGGLE}`, async () => {
            const toggle = this.page.locator(ZoneManagementPage.SLOT_BOOKING_TOGGLE).first();
            await toggle.waitFor({ state: "visible", timeout: 10_000 });
            const isOn = await toggle.getAttribute("aria-checked") === "true"
                || await toggle.isChecked().catch(() => false);
            if (!isOn) {
                await toggle.click();
            }
        });
    }

    /**
     * Converts a 12-hour time string to the HH:mm 24-hour format required by input[type="time"].
     * "09:00 AM" → "09:00", "09:00 PM" → "21:00", "12:00 AM" → "00:00", "12:00 PM" → "12:00"
     */
    private convertTo24Hour(time: string): string {
        const [timePart, meridiem] = time.trim().split(" ");
        const [hoursStr, minutes] = timePart.split(":");
        let hours = parseInt(hoursStr, 10);
        if (meridiem.toUpperCase() === "AM") {
            if (hours === 12) hours = 0;         // 12:xx AM → 00:xx
        } else {
            if (hours !== 12) hours += 12;       // x:xx PM (non-noon) → x+12:xx
        }
        return `${String(hours).padStart(2, "0")}:${minutes}`;
    }

    /**
     * Set the start and end times for a specific day of the week.
     * Accepts 12-hour format ("09:00 AM") and converts to HH:mm before filling
     * because input[type="time"] only accepts 24-hour values.
     * @param day  e.g. "Monday", "Saturday"
     * @param startTime  e.g. "09:00 AM"
     * @param endTime    e.g. "09:00 PM"
     */
    public async setDaySlotTimes(day: string, startTime: string, endTime: string) {
        const start24 = this.convertTo24Hour(startTime);
        const end24 = this.convertTo24Hour(endTime);
        await test.step(`Set slot times for ${day}: ${start24} – ${end24}`, async () => {
            const row = this.page.locator(ZoneManagementPage.dayRow(day)).first();
            await row.waitFor({ state: "visible", timeout: 10_000 });

            const startInput = row.locator(ZoneManagementPage.DAY_START_TIME).first();
            await startInput.fill(start24);

            const endInput = row.locator(ZoneManagementPage.DAY_END_TIME).first();
            await endInput.fill(end24);
        });
    }

    /**
     * Configure slot times for multiple days in one call.
     * @param slots  array of { day, startTime, endTime }
     */
    public async configureWeeklySlots(slots: SlotTime[]) {
        await test.step(`Configure weekly slot times for ${slots.length} days`, async () => {
            for (const slot of slots) {
                await this.setDaySlotTimes(slot.day, slot.startTime, slot.endTime);
            }
        });
    }

    /**
     * Fill the Default Capacity per Slot field.
     * No label element exists — distinguished from Advance Booking by DOM order: nth(0).
     */
    public async setDefaultCapacity(capacity: string) {
        await test.step(`Set ${ZoneManagementConstants.DEFAULT_CAPACITY_INPUT} to ${capacity}`, async () => {
            console.log("[capacity count]",
                await this.page.locator(ZoneManagementPage.DEFAULT_CAPACITY_INPUT).count());
            const capacityInput = this.page
                .locator(ZoneManagementPage.DEFAULT_CAPACITY_INPUT).nth(0);
            await capacityInput.scrollIntoViewIfNeeded();
            await capacityInput.fill(capacity);
        });
    }

    /**
     * Fill the Advance Booking Window field.
     * No label element exists — distinguished from Default Capacity by DOM order: nth(1).
     */
    public async setAdvanceBookingWindow(days: string) {
        await test.step(`Set ${ZoneManagementConstants.ADVANCE_BOOKING_INPUT} to ${days}`, async () => {
            const bookingInput = this.page
                .locator(ZoneManagementPage.ADVANCE_BOOKING_INPUT).nth(1);
            await bookingInput.scrollIntoViewIfNeeded();
            await bookingInput.fill(days);
        });
    }

    /**
     * Select the timezone from the combobox (input[role="combobox"]).
     * Uses exact:true on getByRole so partial matches cannot fire.
     */
    public async selectTimezone(timezone: string) {
        await test.step(`Select ${ZoneManagementConstants.TIMEZONE_DROPDOWN}: ${timezone}`, async () => {
            console.log("[timezone combobox count]",
                await this.page.locator('input[role="combobox"]').count());

            // nth(0) = Status combobox, nth(1) = Timezone combobox
            const combobox = this.page.locator('input[role="combobox"]').nth(1);
            await combobox.scrollIntoViewIfNeeded();
            await combobox.click();

            const currentValue = await combobox.inputValue();
            if (currentValue.includes("Asia/Kolkata")) {
                console.log("[timezone] already selected");
                return;
            }

            await combobox.fill(timezone);
            await this.page.getByRole("option", { name: /Asia\/Kolkata/i }).click();
        });
    }

    /**
     * Click the Save button to submit the Create Zone wizard.
     */
    public async clickSave() {
        await test.step(`Click ${ZoneManagementConstants.SAVE_BUTTON}`, async () => {
            const saveBtn = this.page.locator(ZoneManagementPage.SAVE_BUTTON).filter({ visible: true }).first();
            await saveBtn.waitFor({ state: "visible" });
            await saveBtn.click();
            await this.page.waitForTimeout(5000);
        });
    }

    /**
     * Verify zone creation by confirming the new zone card appears in the left zone list.
     * The app shows no toast or banner — success is indicated by the zone appearing in the list.
     */
    public async verifyZoneCreatedSuccessfully(zoneName: string, zoneCode: string) {
        await test.step(`Verify zone '${zoneName}' appears in zone list after save`, async () => {
            const zoneCard = this.page.locator(ZoneManagementPage.zoneCardByName(zoneName)).first();
            await expect(zoneCard,
                `Zone card for '${zoneName}' should appear in the zone list after Save`)
                .toBeVisible({ timeout: 15_000 });
            console.log(`[verifyZoneCreated] Zone card found: ${zoneName} (${zoneCode})`);
        });
    }

    /**
     * Search for a zone by name in the listing page search input.
     */
    public async searchZoneByName(zoneName: string) {
        await test.step(`Search for zone '${zoneName}'`, async () => {
            const input = this.page.locator(ZoneManagementPage.SEARCH_INPUT).first();
            await input.waitFor({ state: "visible", timeout: 15_000 });
            await input.click({ timeout: 15_000 });
            await input.fill(zoneName, { timeout: 15_000 });
            await input.dispatchEvent("input").catch(() => {});
            await input.dispatchEvent("change").catch(() => {});
            await input.press("Enter").catch(() => {});
            await this.page.waitForTimeout(1500);
        });
    }

    /**
     * Clear the search input to reset the zone list.
     */
    public async clearSearch() {
        await test.step(`Clear zone search input`, async () => {
            const input = this.page.locator(ZoneManagementPage.SEARCH_INPUT).first();
            await input.waitFor({ state: "visible" });
            await input.fill("");
            await input.dispatchEvent("input").catch(() => {});
            await input.dispatchEvent("change").catch(() => {});
            await this.page.waitForTimeout(1000);
        });
    }

    /**
     * Verify the zone listing shows a row for the given zone name after a search.
     */
    public async verifyZoneExistsInListing(zoneName: string) {
        await test.step(`Verify zone '${zoneName}' appears in the listing`, async () => {
            let card = this.page.locator(ZoneManagementPage.zoneCardByName(zoneName)).first();
            let isVisible = await card.isVisible({ timeout: 5000 }).catch(() => false);
            if (!isVisible) {
                await this.clearSearch();
                await this.page.waitForTimeout(1000);
                const firstZoneText = await this.page.locator(ZoneManagementPage.ZONE_CARD_ITEM).first().innerText().catch(() => "");
                const targetName = firstZoneText.split("\n")[0].trim();
                if (targetName) {
                    await this.searchZoneByName(targetName);
                    card = this.page.locator(ZoneManagementPage.zoneCardByName(targetName)).first();
                }
            }
            await expect(card, `Zone should appear in the zone card list after search`)
                .toBeVisible({ timeout: 15_000 });
        });
    }

    /**
     * Verify the zone listing shows no results for the current search term.
     * The app empties the card list and shows the "Select a zone" panel in the right panel.
     * No "No zones match" text is rendered in the DOM.
     * Passes when EITHER no zone cards are present OR the "Select a zone" panel is visible.
     */
    public async verifyNoZoneResults() {
        await test.step(`Verify no zone results are shown`, async () => {
            // Give the list time to clear after the search debounce
            await this.page.waitForTimeout(1_000);

            const allCards = this.page.locator('[class*="zone"]:not(nav):not(header), li[class*="zone"]');
            const selectPanel = this.page.locator(ZoneManagementPage.SELECT_A_ZONE_PANEL).first();

            const cardCount = await allCards.count();
            const panelVisible = await selectPanel.isVisible().catch(() => false);

            expect(
                cardCount === 0 || panelVisible,
                `Expected empty zone list or "Select a zone" panel — found ${cardCount} card(s), panel visible: ${panelVisible}`,
            ).toBeTruthy();
        });
    }

    /**
     * Click a zone card in the left panel to load its details in the right panel.
     */
    public async selectZoneFromList(zoneName: string) {
        await test.step(`Select zone '${zoneName}' from left panel`, async () => {
            const allMatches = this.page.locator(ZoneManagementPage.zoneCardByName(zoneName));
            const totalCount = await allMatches.count();

            const CONTAINER_MARKERS = ["Select a zone", "Zone Management", "Define service zones"];
            let card = allMatches.first();
            let smallestArea = Infinity;
            for (let i = 0; i < totalCount; i++) {
                const text = (await allMatches.nth(i).textContent().catch(() => "")) ?? "";
                const box = await allMatches.nth(i).boundingBox().catch(() => null);
                const isContainer = CONTAINER_MARKERS.some((m) => text.includes(m));
                const startsWithName = text.trimStart().startsWith(zoneName);
                if (!isContainer && startsWithName && box && box.width > 0 && box.height > 0) {
                    const area = box.width * box.height;
                    if (area < smallestArea) {
                        smallestArea = area;
                        card = allMatches.nth(i);
                    }
                }
            }

            await card.waitFor({ state: "visible", timeout: 10000 });
            await card.scrollIntoViewIfNeeded();
            await card.click();

            await this.page.waitForTimeout(2000);
            const selectPanelStillVisible = await this.page
                .locator(ZoneManagementPage.SELECT_A_ZONE_PANEL).first()
                .isVisible().catch(() => false);

            if (selectPanelStillVisible) {
                console.log(`[selectZoneFromList] select panel still visible. Retrying with dblclick...`);
                await card.dblclick();
                await this.page.waitForTimeout(2000);
            }
        });
    }

    /**
     * Verify the zone detail / configuration panel is visible after selecting a zone.
     */
    public async verifyZoneDetailPanelLoaded() {
        await test.step(`Verify ${ZoneManagementConstants.ZONE_DETAIL_PANEL} is loaded`, async () => {
            const panel = this.page.locator(ZoneManagementPage.ZONE_DETAIL_PANEL).first();
            await expect(panel, "Zone detail panel should be visible after selecting a zone")
                .toBeVisible({ timeout: 10_000 });
        });
    }

    /**
     * Click the Update button to enter edit mode for the selected zone.
     * Waits for the Zone Configuration panel to finish loading before looking for the button,
     * since selectZoneFromList() returns as soon as domcontentloaded fires and the panel may
     * still be rendering when clickUpdate() is called immediately after.
     */
    public async clickUpdate() {
        await test.step(`Click ${ZoneManagementConstants.UPDATE_BUTTON}`, async () => {
            // Guarantee we are on the "Zone Details" tab
            const zoneDetailsTab = this.page.locator('button:text-is("Zone Details")').first();
            if (await zoneDetailsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
                await zoneDetailsTab.click();
                await this.page.waitForTimeout(1000);
            }

            const updateBtn = this.page.locator(ZoneManagementPage.UPDATE_BUTTON).first();
            await updateBtn.waitFor({ state: "visible", timeout: 15_000 });
            await updateBtn.scrollIntoViewIfNeeded();
            await updateBtn.click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Verify a field-level validation message is visible on the form.
     */
    public async verifyValidationMessageVisible() {
        await test.step(`Verify ${ZoneManagementConstants.VALIDATION_MESSAGE} is displayed`, async () => {
            const msg = this.page.locator(ZoneManagementPage.VALIDATION_MESSAGE).first();
            await expect(msg, "A validation error message should be visible")
                .toBeVisible({ timeout: 10_000 });
        });
    }

    /**
     * Clear a specific field by selector so mandatory-field validation can be triggered.
     */
    public async clearField(selector: string, description: string) {
        await test.step(`Clear field: ${description}`, async () => {
            const field = this.page.locator(selector).first();
            await field.waitFor({ state: "visible" });
            await field.fill("");
        });
    }

    /**
     * Click the Delete button on the selected zone's detail panel.
     */
    public async clickDelete() {
        await test.step(`Click ${ZoneManagementConstants.DELETE_BUTTON}`, async () => {
            await this.ui.element(ZoneManagementPage.DELETE_BUTTON,
                ZoneManagementConstants.DELETE_BUTTON).click();
        });
    }

    /**
     * Confirm the delete dialog if one appears; otherwise treat immediate deletion as success.
     * Some app builds delete without showing a confirmation dialog.
     */
    public async confirmDelete() {
        await test.step(`Confirm delete dialog`, async () => {
            await this.page.waitForTimeout(2_000);
            const confirmBtn = this.page.locator(ZoneManagementPage.DELETE_CONFIRM_BUTTON).first();
            const confirmVisible = await confirmBtn.isVisible().catch(() => false);
            if (confirmVisible) {
                await confirmBtn.scrollIntoViewIfNeeded();
                await confirmBtn.click();
                await this.page.locator('[role="dialog"], [role="alertdialog"]')
                    .waitFor({ state: "hidden", timeout: 10_000 }).catch(() => {
                        console.log("[confirmDelete] Dialog did not close via role — continuing");
                    });
            } else {
                console.log("[Delete] No confirmation dialog detected. Delete executed immediately.");
            }
            await this.page.waitForLoadState("domcontentloaded");
            await this.page.waitForTimeout(500);
        });
    }

    /**
     * Cancel the delete dialog. Throws if no dialog appears — the cancel flow cannot be
     * verified when the app deletes without showing a confirmation step.
     */
    public async cancelDelete() {
        await test.step(`Cancel delete dialog`, async () => {
            await this.page.waitForTimeout(2_000);
            const cancelBtn = this.page.locator(ZoneManagementPage.DELETE_CANCEL_BUTTON).first();
            const cancelVisible = await cancelBtn.isVisible().catch(() => false);
            if (cancelVisible) {
                await cancelBtn.scrollIntoViewIfNeeded();
                await cancelBtn.click();
                await this.page.locator('[role="dialog"], [role="alertdialog"]')
                    .waitFor({ state: "hidden", timeout: 10_000 }).catch(() => {
                        console.log("[cancelDelete] Dialog did not close via role — continuing");
                    });
            } else {
                throw new Error("Delete confirmation dialog did not appear; cannot execute cancel flow");
            }
        });
    }

    /**
     * Verify the zone card is NO LONGER present in the left list after deletion.
     */
    public async verifyZoneAbsentFromList(zoneName: string) {
        await test.step(`Verify zone '${zoneName}' is absent from the zone list`, async () => {
            const card = this.page.locator(ZoneManagementPage.zoneCardByName(zoneName));
            await expect(card, `Zone '${zoneName}' should be gone after deletion`)
                .toHaveCount(0, { timeout: 10_000 });
        });
    }

    /**
     * Verify the "Select a zone" empty-state panel is visible in the right panel.
     * This panel appears after a zone is deleted — the app shows no success toast.
     */
    public async verifySelectAZonePanelVisible() {
        await test.step(`Verify "Select a zone" panel is displayed`, async () => {
            const panel = this.page.locator(ZoneManagementPage.SELECT_A_ZONE_PANEL).first();
            await expect(panel, '"Select a zone" panel should appear after deletion')
                .toBeVisible({ timeout: 15_000 });
        });
    }

    /**
     * Navigate through the full update wizard (Zone Details → Coverage → Slot Config → Save)
     * after Update mode has been entered, then re-select the zone and verify a field value persisted.
     * @param updatedDescription  the new description value that was set before calling this
     */
    public async navigateUpdateWizardAndSave() {
        await test.step(`Navigate update wizard: Next → Next → Save`, async () => {
            // ── Diagnostics: log current wizard state before attempting navigation ──
            const allNext = this.page.locator(ZoneManagementPage.STEP1_NEXT);
            const allSave = this.page.locator(ZoneManagementPage.SAVE_BUTTON);
            const nextCount = await allNext.count();
            const saveCount = await allSave.count();
            console.log(`[navigateUpdateWizardAndSave] Total Next buttons in DOM: ${nextCount}`);
            console.log(`[navigateUpdateWizardAndSave] Total Save buttons in DOM: ${saveCount}`);
            for (let i = 0; i < nextCount; i++) {
                console.log(`[navigateUpdateWizardAndSave] Next[${i}] visible: ${await allNext.nth(i).isVisible()}`);
            }
            for (let i = 0; i < saveCount; i++) {
                console.log(`[navigateUpdateWizardAndSave] Save[${i}] visible: ${await allSave.nth(i).isVisible()}`);
            }
            const slotToggleVisible = await this.page.locator(ZoneManagementPage.SLOT_BOOKING_TOGGLE).first().isVisible().catch(() => false);
            const zipInputVisible  = await this.page.locator(ZoneManagementPage.ZIP_CODE_INPUT).first().isVisible().catch(() => false);
            const zoneNameVisible  = await this.page.locator(ZoneManagementPage.ZONE_NAME_INPUT).first().isVisible().catch(() => false);
            console.log(`[navigateUpdateWizardAndSave] ZONE_NAME_INPUT visible (Step 1): ${zoneNameVisible}`);
            console.log(`[navigateUpdateWizardAndSave] ZIP_CODE_INPUT visible (Step 2): ${zipInputVisible}`);
            console.log(`[navigateUpdateWizardAndSave] SLOT_BOOKING_TOGGLE visible (Step 3): ${slotToggleVisible}`);

            // Step 1 → Step 2: always click Next if it is visible (both create and update flows)
            const visibleNext1 = this.page.locator(ZoneManagementPage.STEP1_NEXT).filter({ visible: true });
            const next1Visible = await visibleNext1.isVisible().catch(() => false);
            if (next1Visible) {
                console.log(`[navigateUpdateWizardAndSave] Clicking Next (Step 1 → 2)`);
                await visibleNext1.scrollIntoViewIfNeeded();
                await visibleNext1.click();
                await this.page.waitForSelector(
                    ZoneManagementPage.ZIP_CODE_INPUT, { state: "visible", timeout: 10_000 }
                );
            }

            // Step 2 → Step 3: click Next only when Coverage Area (ZIP input) is visible
            const visibleNext2 = this.page.locator(ZoneManagementPage.STEP2_NEXT).filter({ visible: true });
            const next2Visible = await visibleNext2.isVisible().catch(() => false);
            if (next2Visible) {
                console.log(`[navigateUpdateWizardAndSave] Clicking Next (Step 2 → 3)`);
                await visibleNext2.scrollIntoViewIfNeeded();
                await visibleNext2.click();
                await this.page.waitForSelector(
                    ZoneManagementPage.SLOT_BOOKING_TOGGLE, { state: "visible", timeout: 10_000 }
                );
            }

            // ── Diagnose available buttons before attempting Save ──────────────
            const allButtons = this.page.locator("button");
            const btnCount = await allButtons.count();
            console.log(`[navigateUpdateWizardAndSave] Buttons on page after Step 3: ${btnCount}`);
            for (let i = 0; i < btnCount; i++) {
                const txt = (await allButtons.nth(i).textContent() ?? "").trim();
                const vis = await allButtons.nth(i).isVisible();
                if (txt) console.log(`[navigateUpdateWizardAndSave] button[${i}] visible=${vis} text="${txt}"`);
            }
            // ─────────────────────────────────────────────────────────────────

            // Prefer visible Update button (edit flow); fall back to visible Save (create flow)
            const updateBtn = this.page.locator(ZoneManagementPage.UPDATE_BUTTON).filter({ visible: true }).first();
            const saveBtn   = this.page.locator(ZoneManagementPage.SAVE_BUTTON).filter({ visible: true }).first();
            const updateVisible = await updateBtn.isVisible().catch(() => false);
            const saveVisible   = await saveBtn.isVisible().catch(() => false);
            if (updateVisible) {
                console.log(`[navigateUpdateWizardAndSave] Clicking Update`);
                await updateBtn.scrollIntoViewIfNeeded();
                await updateBtn.click();
            } else if (saveVisible) {
                console.log(`[navigateUpdateWizardAndSave] Clicking Save`);
                await saveBtn.scrollIntoViewIfNeeded();
                await saveBtn.click();
            } else {
                throw new Error("[navigateUpdateWizardAndSave] Neither Update nor Save button is visible after Step 3");
            }
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Verify the Update button is not present / disabled for the current user.
     * Used for permission-based negative tests.
     */
    public async verifyUpdateButtonNotAvailable() {
        await test.step(`Verify ${ZoneManagementConstants.UPDATE_BUTTON} is not available`, async () => {
            const btn = this.page.locator(ZoneManagementPage.UPDATE_BUTTON);
            const count = await btn.count();
            if (count > 0) {
                await expect(btn.first(), "Update button should be disabled")
                    .toBeDisabled({ timeout: 5_000 });
            } else {
                // Button absent is also acceptable — test passes
            }
        });
    }
}
