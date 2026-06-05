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
            await this.ui.editBox(ServiceTicketPage.SEARCH_INPUT,
                ServiceTicketConstants.SEARCH_INPUT).fill(ticketId);
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Verify the table shows the empty-state message when no rows match the search.
     */
    public async verifyNoDataMessage() {
        await test.step(`Verify ${ServiceTicketConstants.EMPTY_STATE_MESSAGE} is displayed`, async () => {
            await this.ui.element(ServiceTicketPage.EMPTY_STATE_MESSAGE,
                ServiceTicketConstants.EMPTY_STATE_MESSAGE).waitTillVisible(10);
        });
    }

    /**
     * Click the Service Ticket sidebar menu link and wait for the listing to load.
     */
    public async navigateToServiceTickets() {
        await test.step(`Navigate to ${ServiceTicketConstants.SERVICE_TICKET_PAGE}`, async () => {
            await this.ui.element(ServiceTicketPage.MENU_SERVICE_TICKET,
                ServiceTicketConstants.MENU_SERVICE_TICKET).click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Click the eye-icon View button on the row matching the given ticket ID.
     * @param ticketId the Service Number visible in the listing row
     */
    public async clickViewForTicket(ticketId: string) {
        await test.step(`Click ${ServiceTicketConstants.TICKET_VIEW_BUTTON} for ticket '${ticketId}'`, async () => {
            await this.ui.element(ServiceTicketPage.ticketViewButton(ticketId),
                ServiceTicketConstants.TICKET_VIEW_BUTTON).click();
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
            const actualNumber = await this.ui.element(ServiceTicketPage.VIEW_SERVICE_NUMBER,
                ServiceTicketConstants.VIEW_SERVICE_NUMBER).getTextContent();
            await Assert.assertContains(actualNumber, serviceNumber,
                ServiceTicketConstants.VIEW_SERVICE_NUMBER);

            const actualCustomer = await this.ui.element(ServiceTicketPage.VIEW_CUSTOMER_NAME,
                ServiceTicketConstants.VIEW_CUSTOMER_NAME).getTextContent();
            await Assert.assertContains(actualCustomer, customerName,
                ServiceTicketConstants.VIEW_CUSTOMER_NAME);

            const actualSubject = await this.ui.element(ServiceTicketPage.VIEW_SUBJECT,
                ServiceTicketConstants.VIEW_SUBJECT).getTextContent();
            await Assert.assertContains(actualSubject, subject,
                ServiceTicketConstants.VIEW_SUBJECT);

            const actualStatus = await this.ui.element(ServiceTicketPage.VIEW_STATUS,
                ServiceTicketConstants.VIEW_STATUS).getTextContent();
            if (status.trim() !== "") {
                await Assert.assertEqualsIgnoreCase(actualStatus, status,
                    ServiceTicketConstants.VIEW_STATUS);
            }
        });
    }

    /**
     * Click the Back button to return from the View page to the ticket listing.
     */
    public async navigateBackToListing() {
        await test.step(`Click ${ServiceTicketConstants.BACK_TO_LIST_BUTTON}`, async () => {
            await this.ui.element(ServiceTicketPage.BACK_TO_LIST_BUTTON,
                ServiceTicketConstants.BACK_TO_LIST_BUTTON).click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Click the pencil-icon Edit button on the row matching the given ticket ID.
     * Hovers the row first so action icons hidden until hover become interactive.
     * @param ticketId the Service Number visible in the listing row
     */
    public async clickEditForTicket(ticketId: string) {
        await test.step(`Click ${ServiceTicketConstants.TICKET_EDIT_BUTTON} for ticket '${ticketId}'`, async () => {
            await this.ui.element(ServiceTicketPage.ticketEditButton(ticketId),
                ServiceTicketConstants.TICKET_EDIT_BUTTON).click();
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
            await this.ui.element(ServiceTicketPage.EDIT_PAGE_HEADING,
                ServiceTicketConstants.EDIT_PAGE_HEADING).waitTillVisible(10);
        });
    }

    /**
     * Verify the current value of the Status field on the edit form.
     * Uses getInputValue() which reads the value attribute of a native <select>.
     * @param expectedStatus e.g. "OPEN"
     */
    public async verifyCurrentStatus(expectedStatus: string) {
        await test.step(`Verify ${ServiceTicketConstants.STATUS_DROPDOWN} is '${expectedStatus}'`, async () => {
            const currentStatus = await this.ui.element(ServiceTicketPage.STATUS_DROPDOWN,
                ServiceTicketConstants.STATUS_DROPDOWN).getInputValue();
            await Assert.assertEqualsIgnoreCase(currentStatus, expectedStatus,
                ServiceTicketConstants.STATUS_DROPDOWN);
        });
    }

    /**
     * Select a new value from the Status dropdown using visible text.
     * @param newStatus e.g. "CLOSED"
     */
    public async changeStatus(newStatus: string) {
        await test.step(`Change ${ServiceTicketConstants.STATUS_DROPDOWN} to '${newStatus}'`, async () => {
            await this.ui.dropdown(ServiceTicketPage.STATUS_DROPDOWN,
                ServiceTicketConstants.STATUS_DROPDOWN).selectByVisibleText(newStatus);
        });
    }

    /**
     * Clear and fill the Note to Customer textarea.
     * @param note note text
     */
    public async enterNoteToCustomer(note: string) {
        await test.step(`Enter ${ServiceTicketConstants.NOTE_TO_CUSTOMER}`, async () => {
            await this.ui.editBox(ServiceTicketPage.NOTE_TO_CUSTOMER,
                ServiceTicketConstants.NOTE_TO_CUSTOMER).fill(note);
        });
    }

    /**
     * Clear and fill the Internal Note textarea.
     * @param note note text
     */
    public async enterInternalNote(note: string) {
        await test.step(`Enter ${ServiceTicketConstants.INTERNAL_NOTE}`, async () => {
            await this.ui.editBox(ServiceTicketPage.INTERNAL_NOTE,
                ServiceTicketConstants.INTERNAL_NOTE).fill(note);
        });
    }

    /**
     * Click the Update button to submit the edit form.
     */
    public async clickUpdate() {
        await test.step(`Click ${ServiceTicketConstants.UPDATE_BUTTON}`, async () => {
            await this.ui.element(ServiceTicketPage.UPDATE_BUTTON,
                ServiceTicketConstants.UPDATE_BUTTON).click();
        });
    }

    /**
     * Verify a success toast notification is displayed after the update.
     * Uses waitTillVisible() so the check auto-retries until the toast appears.
     */
    public async verifyUpdateSuccess() {
        await test.step(`Verify ${ServiceTicketConstants.SUCCESS_TOAST} is displayed`, async () => {
            await this.ui.element(ServiceTicketPage.SUCCESS_TOAST,
                ServiceTicketConstants.SUCCESS_TOAST).waitTillVisible(10);
        });
    }

    /**
     * Click the Refresh button on the listing page and wait for the table to reload.
     */
    public async clickRefresh() {
        await test.step(`Click ${ServiceTicketConstants.REFRESH_BUTTON}`, async () => {
            await this.ui.element(ServiceTicketPage.REFRESH_BUTTON,
                ServiceTicketConstants.REFRESH_BUTTON).click();
            await this.page.waitForLoadState("domcontentloaded");
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
            const statusBadge = this.page
                .locator(ServiceTicketPage.ticketRow(ticketId))
                .locator(ServiceTicketPage.BADGE)
                .nth(1);
            await expect(statusBadge,
                `Expected Status badge for ticket '${ticketId}' to become '${expectedStatus}'`)
                .toHaveText(expectedStatus, { ignoreCase: true, timeout: 15_000 });
        });
    }
}
