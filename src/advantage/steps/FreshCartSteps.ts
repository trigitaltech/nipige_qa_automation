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
            // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
            const freshCartRow = require("@utils/ExcelUtil").default.getTestData("LoginTest", "TC05_FreshCartLogin");
            const url = process.env.FRESHCART_URL || "https://freshcart-usa.nipige.com/login";
            const email = process.env.FRESHCART_EMAIL || freshCartRow.UserName;
            const password = process.env.FRESHCART_PASSWORD || freshCartRow.Password;
            await this.ui.goto(url, FreshCartConstants.LOGIN_PAGE);

            const loginInput = this.page.locator(FreshCartPage.USERNAME_INPUT).first();
            if (!(await loginInput.isVisible({ timeout: 2000 }).catch(() => false))) {
                const loginLink = this.page.locator('a[href*="login"], a:has-text("Login"), button:has-text("Login")').first();
                if (await loginLink.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await loginLink.click();
                }
            }

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

            // Add a short delay to allow form validation states and event handlers to settle
            await this.page.waitForTimeout(1500);

            // Wait for the network POST triggered by Submit to complete before proceeding.
            // domcontentloaded is unreliable for AJAX submissions (page doesn't navigate).
            const [response] = await Promise.all([
                this.page.waitForResponse(
                    (res) => res.request().method() === "POST"
                        && (res.url().includes("ticket") || res.url().includes("support")),
                    { timeout: 90_000 },
                ),
                this.ui.element(FreshCartPage.SUBMIT_TICKET_BUTTON,
                    FreshCartConstants.SUBMIT_TICKET_BUTTON).click(),
            ]);

            if (!response.ok()) {
                throw new Error(`Support ticket POST failed: ${response.status()} ${response.statusText()}`);
            }

            // Wait for the success toast — confirms the UI has acknowledged the created ticket
            // before captureGeneratedTicketId() reloads the listing page.
            await this.page.locator(FreshCartPage.SUBMIT_SUCCESS_TOAST)
                .waitFor({ state: "visible", timeout: 15_000 })
                .catch(() => {
                    // Toast may disappear too fast or may not exist in all environments;
                    // the POST response check above is the primary gate.
                });
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

            // Scan the refreshed ticket list because row order and visible row text can vary.
            const rows = this.page.locator(FreshCartPage.SUPPORT_TICKET_ROWS);
            await rows.first().waitFor({ state: "visible", timeout: 30_000 });

            const rowTexts = (await rows.allInnerTexts()).map((text) => text.trim());
            const srNumbers = rowTexts
                .flatMap((text) => text.match(/SR\d+/g) ?? []);

            console.log(`[FreshCart Ticket Capture] Current URL: ${this.page.url()}`);
            console.log(`[FreshCart Ticket Capture] Page title: ${await this.page.title()}`);
            console.log(`[FreshCart Ticket Capture] Total rows found: ${rowTexts.length}`);
            console.log(`[FreshCart Ticket Capture] First row text: ${rowTexts[0] ?? ""}`);
            console.log(`[FreshCart Ticket Capture] Last row text: ${rowTexts[rowTexts.length - 1] ?? ""}`);
            console.log(`[FreshCart Ticket Capture] All SR numbers found: ${srNumbers.join(", ")}`);

            const targetRowText = rowTexts.find((text) => {
                const normalizedText = text.toLowerCase();
                return /SR\d+/.test(text)
                    && normalizedText.includes("open")
                    && (normalizedText.includes("automation test issue")
                        || normalizedText.includes("ticket created by automation framework"));
            });

            if (!targetRowText) {
                throw new Error(`No OPEN automation ticket row found. Rows: ${JSON.stringify(rowTexts)}`);
            }

            const match = targetRowText.match(/SR\d+/);
            if (!match) {
                throw new Error(`No SR number found in the OPEN automation row. Row text: ${targetRowText}`);
            }
            [ticketId] = match;
            if (!ticketId.startsWith("SR")) {
                throw new Error(`Invalid ticket id captured: ${ticketId}`);
            }
        });
        return ticketId;
    }

    /**
     * Navigate to the Support Tickets listing page via the nav link,
     * then hard-reload so the status reflects any external changes.
     */
    public async hardRefreshSupportTickets() {
        await test.step(`Hard refresh ${FreshCartConstants.SUPPORT_TICKETS_PAGE}`, async () => {
            await this.ui.element(FreshCartPage.ORDERS_LINK,
                FreshCartConstants.ORDERS_LINK).click();
            await this.page.waitForLoadState("domcontentloaded");
            await this.ui.element(FreshCartPage.FIRST_ORDER_VIEW_DETAILS,
                FreshCartConstants.FIRST_ORDER_VIEW_DETAILS).click();
            await this.page.waitForLoadState("domcontentloaded");
            await this.ui.element(FreshCartPage.NEED_HELP_BUTTON,
                FreshCartConstants.NEED_HELP_BUTTON).click();
            await this.ui.element(FreshCartPage.SUPPORT_TICKET_OPTION,
                FreshCartConstants.SUPPORT_TICKET_OPTION).click();
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
            const rows = this.page.locator(FreshCartPage.SUPPORT_TICKET_ROWS);
            await rows.first().waitFor({ state: "visible", timeout: 30_000 });

            const rowTexts = (await rows.allInnerTexts()).map((t) => t.trim());

            console.log(`[verifyTicketStatusInFreshCart] Total rows: ${rowTexts.length}`);
            rowTexts.forEach((t, i) => console.log(`  Row[${i}]: ${t}`));

            const targetRow = rowTexts.find((t) => t.includes(ticketId));

            if (!targetRow) {
                throw new Error(
                    `Ticket ${ticketId} not found in FreshCart support ticket list. Rows: ${JSON.stringify(rowTexts)}`,
                );
            }

            await Assert.assertContainsIgnoreCase(targetRow, expectedStatus,
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
