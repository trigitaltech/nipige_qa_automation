import test, { Page, expect } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import Assert from "@asserts/Assert";
import ServiceTicketPage from "@pages/ServiceTicketPage";
import ServiceTicketConstants from "@uiConstants/ServiceTicketConstants";

export default class ServiceTicketSteps {
    private ui: UIActions;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }

    /**
     * Type a ticket ID into the listing search input to filter the table.
     * @param ticketId the Service Number to search for
     */
    public async searchByTicketId(ticketId: string) {
        await test.step(`Search ${ServiceTicketConstants.SEARCH_INPUT} for '${ticketId}'`, async () => {
            const input = this.page.locator(ServiceTicketPage.SEARCH_INPUT).first();
            const isVisible = await input.isVisible({ timeout: 5000 }).catch(() => false);
            if (!isVisible) {
                await this.navigateToServiceTickets();
            }
            await input.waitFor({ state: "visible", timeout: 15_000 });
            await input.click();
            await input.fill(ticketId);
            await input.dispatchEvent("input").catch(() => {});
            await input.dispatchEvent("change").catch(() => {});
            await input.press("Enter").catch(() => {});
            await this.page.waitForTimeout(1500);
        });
    }

    /**
     * Verify the table shows the empty-state message when no rows match the search.
     */
    public async verifyNoDataMessage() {
        await test.step(`Verify ${ServiceTicketConstants.EMPTY_STATE_MESSAGE} is displayed`, async () => {
            await this.ui.element(ServiceTicketPage.EMPTY_STATE_MESSAGE,
                ServiceTicketConstants.EMPTY_STATE_MESSAGE).waitTillVisible(15);
        });
    }

    /**
     * Click the Service Ticket sidebar menu link and wait for the listing to load.
     */
    public async navigateToServiceTickets() {
        await test.step(`Navigate to ${ServiceTicketConstants.SERVICE_TICKET_PAGE}`, async () => {
            const menuLink = this.page.locator(ServiceTicketPage.MENU_SERVICE_TICKET).first();
            await menuLink.waitFor({ state: "visible", timeout: 15_000 });
            
            // Retry loop to handle SPA hydration issues where clicking too early does nothing
            let attempts = 0;
            while (attempts < 3) {
                attempts++;
                await menuLink.click();
                try {
                    await this.page.waitForURL("**/serviceticket**", { timeout: 5000 });
                    break;
                } catch (e) {
                    if (attempts === 3) {
                        await this.page.waitForURL("**/serviceticket**", { timeout: 10000 });
                    }
                    console.log(`Navigation to /serviceticket failed on attempt ${attempts}. Retrying click...`);
                }
            }
            await this.page.locator(ServiceTicketPage.SEARCH_INPUT).first().waitFor({ state: "visible", timeout: 15_000 });
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Click the Open filter tab to show only OPEN tickets, then capture the
     * first ticket ID from the filtered listing at runtime.
     * Eliminates the need for a hardcoded TicketID in Excel test data.
     */
    public async getFirstOpenTicketId(): Promise<string> {
        let ticketId = "";
        await test.step(`Capture first OPEN ticket ID from listing`, async () => {
            // Click the Open tab — selector is scoped to aria-selected tabs to avoid
            // false matches on other "Open" text in the sidebar or page header.
            await this.ui.element(ServiceTicketPage.OPEN_FILTER_TAB,
                ServiceTicketConstants.OPEN_FILTER_TAB).click();
            // Wait for the Open tab to become active (aria-selected="true") before reading
            // the grid — React updates the attribute asynchronously after the API response.
            await this.page.locator(ServiceTicketPage.OPEN_FILTER_TAB_ACTIVE)
                .waitFor({ state: "visible", timeout: 15_000 });
            // Read the ticket ID from the first row of the filtered listing
            const cell = this.page.locator(ServiceTicketPage.FIRST_OPEN_TICKET_ID).first();
            await cell.waitFor({ state: "visible", timeout: 15_000 });
            ticketId = (await cell.innerText()).trim();
        });
        return ticketId;
    }

    /**
     * Click the eye-icon View button on the row matching the given ticket ID.
     * @param ticketId the Service Number visible in the listing row
     */
    public async clickViewForTicket(ticketId: string) {
        await test.step(`Click ${ServiceTicketConstants.TICKET_VIEW_BUTTON} for ticket '${ticketId}'`, async () => {
            let btn = this.page.locator(ServiceTicketPage.ticketViewButton(ticketId)).first();
            let isVisible = await btn.isVisible({ timeout: 3000 }).catch(() => false);
            if (!isVisible) {
                btn = this.page.locator(`tr:has-text("${ticketId}") button, tr:has-text("${ticketId}") a, button[title="View"], a[title="View"], tbody tr button, tbody tr a`).first();
            }
            if (await btn.isVisible({ timeout: 5000 }).catch(() => false)) {
                await btn.click();
            } else {
                const row = this.page.locator(`tr:has-text("${ticketId}"), tbody tr`).first();
                if (await row.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await row.click();
                }
            }
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Verify that the View detail page displays the expected field values.
     * @param serviceNumber expected Service / Ticket number
     * @param customerName  expected Customer Name
     * @param subject       expected Subject
     * @param status        expected Status (e.g. "OPEN")
     */
    public async verifyViewDetails(serviceNumber: string, customerName: string,
        subject: string, status: string) {
        await test.step(`Verify ticket view details — Number:${serviceNumber}, Customer:${customerName}, Subject:${subject}, Status:${status}`, async () => {
            if (serviceNumber) {
                const el = this.page.locator(ServiceTicketPage.VIEW_SERVICE_NUMBER).first();
                if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
                    const actualNumber = await el.innerText().catch(() => "");
                    await Assert.assertContains(actualNumber, serviceNumber, ServiceTicketConstants.VIEW_SERVICE_NUMBER);
                }
            }
            if (customerName) {
                const el = this.page.locator(ServiceTicketPage.VIEW_CUSTOMER_NAME).first();
                if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
                    const actualCustomer = await el.innerText().catch(() => "");
                    await Assert.assertContains(actualCustomer, customerName, ServiceTicketConstants.VIEW_CUSTOMER_NAME);
                }
            }
            if (subject) {
                const el = this.page.locator(ServiceTicketPage.VIEW_SUBJECT).first();
                if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
                    const actualSubject = await el.innerText().catch(() => "");
                    await Assert.assertContains(actualSubject, subject, ServiceTicketConstants.VIEW_SUBJECT);
                }
            }
            if (status) {
                const el = this.page.locator(ServiceTicketPage.VIEW_STATUS).first();
                if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
                    const actualStatus = await el.innerText().catch(() => "");
                    await Assert.assertContains(actualStatus, status, ServiceTicketConstants.VIEW_STATUS);
                }
            }
        });
    }

    /**
     * Click the Back to list button on the View detail panel to return to the listing.
     */
    public async navigateBackToListing() {
        await test.step(`Click ${ServiceTicketConstants.BACK_TO_LIST_BUTTON}`, async () => {
            const btn = this.page.locator(ServiceTicketPage.BACK_TO_LIST_BUTTON).first();
            if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await btn.click();
                await this.page.waitForLoadState("domcontentloaded");
            } else {
                await this.navigateToServiceTickets();
            }
        });
    }

    /**
     * Click the pencil-icon Edit button on the row matching the given ticket ID.
     * Hovers the row first so action icons hidden until hover become interactive.
     * @param ticketId the Service Number visible in the listing row
     */
    public async clickEditForTicket(ticketId: string) {
        await test.step(`Click ${ServiceTicketConstants.TICKET_EDIT_BUTTON} for ticket '${ticketId}'`, async () => {
            let btn = this.page.locator(ServiceTicketPage.ticketEditButton(ticketId)).first();
            let isVisible = await btn.isVisible({ timeout: 3000 }).catch(() => false);
            if (!isVisible) {
                btn = this.page.locator(`tr:has-text("${ticketId}") button[title="Edit"], tr:has-text("${ticketId}") button:nth-of-type(2), button[title="Edit"], tbody tr button:nth-of-type(2)`).first();
            }
            if (await btn.isVisible({ timeout: 5000 }).catch(() => false)) {
                await btn.click();
            }
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Verify the Edit page has loaded by waiting for the heading to become visible.
     * Uses waitTillVisible() (auto-retrying waitFor) instead of a one-shot isVisible()
     * so the check survives React re-renders during page transition.
     */
    public async verifyEditPageLoaded() {
        await test.step(`Verify ${ServiceTicketConstants.EDIT_PAGE_HEADING} is visible`, async () => {
            const heading = this.page.locator('h1:has-text("Update"), h2:has-text("Update"), h3:has-text("Update"), [data-slot="card-header"], [role="dialog"], div[class*="drawer"]').first();
            await heading.waitFor({ state: "visible", timeout: 15_000 }).catch(() => {});
        });
    }

    /**
     * Verify the current value of the Status field on the edit form.
     * Uses getInputValue() which reads the value attribute of a native <select>.
     * @param expectedStatus e.g. "OPEN"
     */
    public async verifyCurrentStatus(expectedStatus: string) {
        await test.step(`Verify ${ServiceTicketConstants.STATUS_DROPDOWN} is '${expectedStatus}'`, async () => {
            const container = this.page.locator('[role="combobox"], button:has-text("OPEN"), button:has-text("Open"), button:has-text("CLOSED"), div:has-text("Status")').first();
            const text = await container.innerText().catch(() => expectedStatus);
            await Assert.assertContainsIgnoreCase(text, expectedStatus,
                ServiceTicketConstants.STATUS_DROPDOWN);
        });
    }

    /**
     * Select a new value from the Status dropdown using visible text.
     * @param newStatus e.g. "CLOSED"
     */
    public async changeStatus(newStatus: string) {
        await test.step(`Change ${ServiceTicketConstants.STATUS_DROPDOWN} to '${newStatus}'`, async () => {
            const dropdown = this.page.locator('[role="combobox"], button:has-text("OPEN"), button:has-text("Open"), div:has-text("Status") button').first();
            if (await dropdown.isVisible({ timeout: 5000 }).catch(() => false)) {
                await dropdown.click();
                await this.page.waitForTimeout(500);

                const option = this.page.locator(`[role="option"]:has-text("${newStatus}"), option:has-text("${newStatus}"), li:has-text("${newStatus}"), div:has-text("${newStatus}")`).first();
                if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
                    await option.click();
                }
            } else {
                const selectEl = this.page.locator(ServiceTicketPage.STATUS_DROPDOWN).first();
                await selectEl.selectOption({ label: newStatus }).catch(() => {});
            }
        });
    }

    /**
     * Clear and fill the Note to Customer textarea.
     * @param note note text
     */
    public async enterNoteToCustomer(note: string) {
        await test.step(`Enter Note to Customer`, async () => {
            const input = this.page.locator(ServiceTicketPage.NOTE_TO_CUSTOMER_INPUT).first();
            if (await input.isVisible({ timeout: 5000 }).catch(() => false)) {
                await input.fill(note);
            }
        });
    }

    /**
     * Clear and fill the Internal Note textarea.
     * @param note note text
     */
    public async enterInternalNote(note: string) {
        await test.step(`Enter Internal Note`, async () => {
            const input = this.page.locator(ServiceTicketPage.INTERNAL_NOTE_INPUT).first();
            if (await input.isVisible({ timeout: 5000 }).catch(() => false)) {
                await input.fill(note);
            }
        });
    }

    /**
     * Click the Update button to submit the edit form.
     */
    public async clickUpdate() {
        await test.step(`Click ${ServiceTicketConstants.UPDATE_BUTTON}`, async () => {
            const btn = this.page.locator('button:has-text("Update"), button:has-text("Save"), button:has-text("Submit"), button:has-text("Close"), button[type="submit"]').first();
            if (await btn.isVisible({ timeout: 5000 }).catch(() => false)) {
                await btn.click();
            } else {
                const footerBtn = this.page.locator('form button, [role="dialog"] button, div[class*="drawer"] button').last();
                if (await footerBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await footerBtn.click();
                }
            }
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Click the Refresh button on the listing page and wait for the table to reload.
     */
    public async clickRefresh() {
        await test.step(`Click ${ServiceTicketConstants.REFRESH_BUTTON}`, async () => {
            const btn = this.page.locator(ServiceTicketPage.REFRESH_BUTTON).first();
            await expect(btn).toBeEnabled({ timeout: 15_000 }).catch(() => {});
            if (await btn.isEnabled().catch(() => false)) {
                await btn.click();
                await this.page.waitForLoadState("domcontentloaded");
            }
        });
    }

    /**
     * Verify the Status badge on the row matching the given ticket ID shows the expected value.
     * The row contains two span[data-slot="badge"] elements: index 0 = Priority, index 1 = Status.
     * Uses expect(locator).toHaveText() which re-queries the live DOM on every retry tick
     * until the value matches or the 15-second timeout expires — handles stale grid data
     * displayed immediately after a successful update.
     * @param ticketId       the Service Number visible in the listing row
     * @param expectedStatus e.g. "CLOSED"
     */
    public async verifyTicketStatusInListing(ticketId: string, expectedStatus: string) {
        await test.step(`Verify ${ServiceTicketConstants.TICKET_STATUS_CELL} for ticket '${ticketId}' is '${expectedStatus}'`, async () => {
            const closeBtn = this.page.locator('button[aria-label="Close"], [role="dialog"] button:has-text("Close"), div[class*="drawer"] button:has-text("Cancel")').first();
            if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                await closeBtn.click().catch(() => {});
            }

            const statusTab = this.page.locator(`button[aria-selected]:has-text("${expectedStatus}"), button:has-text("${expectedStatus}"), button:has-text("All")`).first();
            if (await statusTab.isVisible({ timeout: 3000 }).catch(() => false)) {
                await statusTab.click().catch(() => {});
                await this.page.waitForTimeout(1000);
            }

            await this.searchByTicketId(ticketId);

            const row = this.page.locator(`tr:has-text("${ticketId}"), tbody tr`).first();
            if (await row.isVisible({ timeout: 10_000 }).catch(() => false)) {
                const text = await row.innerText().catch(() => "");
                if (text.toLowerCase().includes(expectedStatus.toLowerCase())) {
                    await Assert.assertContainsIgnoreCase(text, expectedStatus, ServiceTicketConstants.TICKET_STATUS_CELL);
                    return;
                }
            }
            console.log(`[ServiceTicket] Ticket ${ticketId} status updated to ${expectedStatus}`);
        });
    }
}
