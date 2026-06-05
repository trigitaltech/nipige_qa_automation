import test, { Page } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import Assert from "@asserts/Assert";
import FreshCartPage from "@pages/FreshCartPage";
import FreshCartConstants from "@uiConstants/FreshCartConstants";

export default class FreshCartSteps {
    private ui: UIActions;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }

    /**
     * Navigate to the FreshCart login page and sign in.
     * Credentials are read from env vars FRESHCART_EMAIL / FRESHCART_PASSWORD.
     */
    public async loginToFreshCart() {
        await test.step(`Login to ${FreshCartConstants.LOGIN_PAGE}`, async () => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const freshCartRow = require("@utils/ExcelUtil").default.getTestData("LoginTest", "TC05_FreshCartLogin");
            const url = process.env.FRESHCART_URL || "https://freshcart-usa.nipige.com/login";
            const email = process.env.FRESHCART_EMAIL || freshCartRow.UserName;
            const password = process.env.FRESHCART_PASSWORD || freshCartRow.Password;
            await this.ui.goto(url, FreshCartConstants.LOGIN_PAGE);
            await this.ui.editBox(FreshCartPage.USERNAME_INPUT,
                FreshCartConstants.USERNAME_INPUT).fill(email);
            await this.ui.editBox(FreshCartPage.PASSWORD_INPUT,
                FreshCartConstants.PASSWORD_INPUT).fill(password);
            await this.ui.element(FreshCartPage.LOGIN_BUTTON,
                FreshCartConstants.LOGIN_BUTTON).click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Click the Orders link in the top navigation menu.
     */
    public async navigateToOrders() {
        await test.step(`Navigate to ${FreshCartConstants.ORDERS_PAGE}`, async () => {
            await this.ui.element(FreshCartPage.ORDERS_LINK,
                FreshCartConstants.ORDERS_LINK).click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Open the first available order by clicking View Details.
     */
    public async openFirstOrder() {
        await test.step(`Click ${FreshCartConstants.FIRST_ORDER_VIEW_DETAILS}`, async () => {
            await this.ui.element(FreshCartPage.FIRST_ORDER_VIEW_DETAILS,
                FreshCartConstants.FIRST_ORDER_VIEW_DETAILS).click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Click the Need Help button on the order detail page.
     */
    public async clickNeedHelp() {
        await test.step(`Click ${FreshCartConstants.NEED_HELP_BUTTON}`, async () => {
            await this.ui.element(FreshCartPage.NEED_HELP_BUTTON,
                FreshCartConstants.NEED_HELP_BUTTON).click();
        });
    }

    /**
     * Click the Support Ticket option from the Need Help panel.
     */
    public async clickSupportTicketOption() {
        await test.step(`Click ${FreshCartConstants.SUPPORT_TICKET_OPTION}`, async () => {
            await this.ui.element(FreshCartPage.SUPPORT_TICKET_OPTION,
                FreshCartConstants.SUPPORT_TICKET_OPTION).click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Click the Raise Ticket button to open the ticket creation form.
     */
    public async clickRaiseTicket() {
        await test.step(`Click ${FreshCartConstants.RAISE_TICKET_BUTTON}`, async () => {
            await this.ui.element(FreshCartPage.RAISE_TICKET_BUTTON,
                FreshCartConstants.RAISE_TICKET_BUTTON).click();
        });
    }

    /**
     * Fill in the ticket creation form and submit.
     * @param issueType  visible text of the Issue Type option to select
     * @param issue      text for the Issue field
     * @param description text for the Description field
     */
    public async fillAndSubmitTicket(issueType: string, issue: string, description: string) {
        await test.step(`Fill and submit support ticket`, async () => {
            await this.ui.dropdown(FreshCartPage.ISSUE_TYPE_DROPDOWN,
                FreshCartConstants.ISSUE_TYPE_DROPDOWN).selectByVisibleText(issueType);
            await this.ui.editBox(FreshCartPage.ISSUE_INPUT,
                FreshCartConstants.ISSUE_INPUT).fill(issue);
            await this.ui.editBox(FreshCartPage.DESCRIPTION_INPUT,
                FreshCartConstants.DESCRIPTION_INPUT).fill(description);
            await this.ui.element(FreshCartPage.SUBMIT_TICKET_BUTTON,
                FreshCartConstants.SUBMIT_TICKET_BUTTON).click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Read the Ticket ID from the first row of the Support Tickets listing
     * and return it as a string (e.g. "SR3148986164").
     * The listing must be visible before calling this method.
     */
    public async captureGeneratedTicketId(): Promise<string> {
        let ticketId = "";
        await test.step(`Capture ${FreshCartConstants.FIRST_TICKET_ID_CELL}`, async () => {
            await this.page.reload({ waitUntil: "networkidle" });
            await this.ui.element(FreshCartPage.FIRST_TICKET_ID_CELL,
                FreshCartConstants.FIRST_TICKET_ID_CELL).waitTillVisible(10);
            ticketId = await this.ui.element(FreshCartPage.FIRST_TICKET_ID_CELL,
                FreshCartConstants.FIRST_TICKET_ID_CELL).getTextContent();
        });
        return ticketId.trim();
    }

    /**
     * Navigate to the Support Tickets listing page via the nav link,
     * then hard-reload so the status reflects any external changes.
     */
    public async hardRefreshSupportTickets() {
        await test.step(`Hard refresh ${FreshCartConstants.SUPPORT_TICKETS_PAGE}`, async () => {
            await this.ui.element(FreshCartPage.SUPPORT_TICKETS_LINK,
                FreshCartConstants.SUPPORT_TICKETS_LINK).click();
            await this.page.waitForLoadState("domcontentloaded");
            await this.page.reload({ waitUntil: "networkidle" });
        });
    }

    /**
     * Verify the status for the row containing ticketId shows expectedStatus.
     * Uses a text-proximity anchor so it works regardless of table/list/div layout.
     * DEBUG: logs the innerText of the ticket ID element to reveal surrounding DOM.
     * @param ticketId       SR number to locate the row
     * @param expectedStatus e.g. "Closed"
     */
    public async verifyTicketStatusInFreshCart(ticketId: string, expectedStatus: string) {
        await test.step(`Verify ${FreshCartConstants.TICKET_STATUS_BADGE} for '${ticketId}' is '${expectedStatus}'`, async () => {
            const rowText = await this.page
                .locator(FreshCartPage.ticketRowAnchor(ticketId))
                .first()
                .locator("xpath=../..")
                .innerText();
            await Assert.assertContainsIgnoreCase(rowText, expectedStatus,
                FreshCartConstants.TICKET_STATUS_BADGE);
        });
    }

    /**
     * Click the profile menu and then the Logout option.
     */
    public async logoutFromFreshCart() {
        await test.step(`Logout from FreshCart`, async () => {
            await this.ui.element(FreshCartPage.PROFILE_MENU,
                FreshCartConstants.PROFILE_MENU).click();
            await this.ui.element(FreshCartPage.LOGOUT_LINK,
                FreshCartConstants.LOGOUT_LINK).click();
            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Verify the FreshCart login page is displayed by waiting for the email input.
     */
    public async verifyFreshCartLoginPage() {
        await test.step(`Verify ${FreshCartConstants.LOGIN_PAGE_INDICATOR} is visible`, async () => {
            await this.ui.element(FreshCartPage.LOGIN_PAGE_INDICATOR,
                FreshCartConstants.LOGIN_PAGE_INDICATOR).waitTillVisible(10);
        });
    }
}
