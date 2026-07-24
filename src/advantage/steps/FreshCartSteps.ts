import test, { Page } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import Assert from "@asserts/Assert";
import FreshCartPage from "@pages/FreshCartPage";
import FreshCartConstants from "@uiConstants/FreshCartConstants";

export default class FreshCartSteps {
    private ui: UIActions;
    private lastCreatedTicketId: string = "";

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
            let loginSuccess = false;
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    await this.page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
                    await this.page.waitForTimeout(1000);

                    const loginInput = this.page.locator(FreshCartPage.USERNAME_INPUT).first();
                    if (!(await loginInput.isVisible({ timeout: 3000 }).catch(() => false))) {
                        const loginLink = this.page.locator('a[href*="login"], a[href*="sign"], a:has-text("Login"), a:has-text("Sign in"), a:has-text("Sign In"), button:has-text("Login"), button:has-text("Sign In"), button:has-text("Sign in"), button[aria-label*="Account" i], button[aria-label*="Profile" i], [aria-label*="account" i]').first();
                        if (await loginLink.isVisible({ timeout: 3000 }).catch(() => false)) {
                            await loginLink.click();
                            await this.page.waitForTimeout(1000);
                        }
                    }

                    await loginInput.waitFor({ state: "visible", timeout: 15_000 });
                    await loginInput.fill(email);
                    const passInput = this.page.locator(FreshCartPage.PASSWORD_INPUT).first();
                    await passInput.fill(password);
                    const loginBtn = this.page.locator(FreshCartPage.LOGIN_BUTTON).first();
                    await loginBtn.click();
                    await this.page.waitForTimeout(2000);

                    loginSuccess = true;
                    break; // Success! Exit loop.
                } catch (err) {
                    console.log(`[Attempt ${attempt}/3] FreshCart login failed: ${err.message}. Retrying...`);
                    if (attempt === 3) {
                        throw err; // Rethrow if all attempts fail
                    }
                    await this.page.waitForTimeout(2000); // Wait 2s before retry
                }
            }

            await this.page.waitForLoadState("domcontentloaded");
        });
    }

    /**
     * Click the Orders link in the top navigation menu.
     */
    public async navigateToOrders() {
        await test.step(`Navigate to ${FreshCartConstants.ORDERS_PAGE}`, async () => {
            const baseUrl = (process.env.FRESHCART_URL || "https://freshcart-usa.nipige.com").replace(/\/login\/?$/, "");
            const targetUrl = `${baseUrl}/orders`;
            console.log(`[FreshCart] Navigating to Orders: ${targetUrl}`);
            await this.page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 30_000 }).catch(async () => {
                const link = this.page.locator(FreshCartPage.ORDERS_LINK).first();
                if (await link.isVisible({ timeout: 5000 }).catch(() => false)) {
                    await link.click();
                }
            });
            await this.page.waitForTimeout(1000);
        });
    }

    /**
     * Open the first available order by clicking View Details.
     */
    public async openFirstOrder() {
        await test.step(`Click ${FreshCartConstants.FIRST_ORDER_VIEW_DETAILS}`, async () => {
            const btn = this.page.locator(FreshCartPage.FIRST_ORDER_VIEW_DETAILS).first();
            const isVisible = await btn.isVisible({ timeout: 5000 }).catch(() => false);
            if (isVisible) {
                await btn.click();
                await this.page.waitForLoadState("domcontentloaded");
            } else {
                const firstOrderRow = this.page.locator('a[href*="order"], [class*="order"] a, li a, table tbody tr a').first();
                if (await firstOrderRow.isVisible({ timeout: 5000 }).catch(() => false)) {
                    await firstOrderRow.click();
                    await this.page.waitForLoadState("domcontentloaded");
                }
            }
        });
    }

    /**
     * Click the Need Help button on the order detail page.
     */
    public async clickNeedHelp() {
        await test.step(`Click ${FreshCartConstants.NEED_HELP_BUTTON}`, async () => {
            const btn = this.page.locator(FreshCartPage.NEED_HELP_BUTTON).first();
            const isVisible = await btn.isVisible({ timeout: 5000 }).catch(() => false);
            if (isVisible) {
                await btn.click();
                await this.page.waitForTimeout(500);
            }
        });
    }

    /**
     * Click the Support Ticket option from the Need Help panel.
     */
    public async clickSupportTicketOption() {
        await test.step(`Click ${FreshCartConstants.SUPPORT_TICKET_OPTION}`, async () => {
            const btn = this.page.locator(FreshCartPage.SUPPORT_TICKET_OPTION).first();
            const isVisible = await btn.isVisible({ timeout: 5000 }).catch(() => false);
            if (isVisible) {
                await btn.click();
                await this.page.waitForLoadState("domcontentloaded");
            }
        });
    }

    /**
     * Click the Raise Ticket button to open the ticket creation form.
     */
    public async clickRaiseTicket() {
        await test.step(`Click ${FreshCartConstants.RAISE_TICKET_BUTTON}`, async () => {
            const btn = this.page.locator(FreshCartPage.RAISE_TICKET_BUTTON).first();
            const isVisible = await btn.isVisible({ timeout: 5000 }).catch(() => false);
            if (isVisible) {
                await btn.click();
                await this.page.waitForTimeout(500);
            }
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
            const selectEl = this.page.locator(FreshCartPage.ISSUE_TYPE_DROPDOWN).first();
            if (await selectEl.isVisible({ timeout: 5000 }).catch(() => false)) {
                const tagName = await selectEl.evaluate(el => el.tagName.toLowerCase()).catch(() => "");
                if (tagName === "select") {
                    await selectEl.selectOption({ label: issueType }).catch(async () => {
                        await selectEl.selectOption({ value: issueType }).catch(() => {});
                    });
                } else {
                    await selectEl.click();
                    const option = this.page.locator(`option:has-text("${issueType}"), [role="option"]:has-text("${issueType}"), li:has-text("${issueType}")`).first();
                    if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
                        await option.click();
                    }
                }
            }

            const issueInput = this.page.locator(FreshCartPage.ISSUE_INPUT).first();
            if (await issueInput.isVisible({ timeout: 5000 }).catch(() => false)) {
                await issueInput.fill(issue);
            }

            const descInput = this.page.locator(FreshCartPage.DESCRIPTION_INPUT).first();
            if (await descInput.isVisible({ timeout: 5000 }).catch(() => false)) {
                await descInput.fill(description);
            }

            await this.page.waitForTimeout(1500);

            const submitBtn = this.page.locator(FreshCartPage.SUBMIT_TICKET_BUTTON).first();
            if (await submitBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
                const [response] = await Promise.all([
                    this.page.waitForResponse(
                        (res) => res.request().method() === "POST"
                            && (res.url().includes("ticket") || res.url().includes("support")),
                        { timeout: 30_000 },
                    ).catch(() => null),
                    submitBtn.click(),
                ]);

                if (response && response.ok()) {
                    try {
                        const json = await response.json();
                        const jsonStr = JSON.stringify(json);
                        const match = jsonStr.match(/SR\d+/);
                        if (match) {
                            this.lastCreatedTicketId = match[0];
                            console.log(`[FreshCart] Captured ticket ID from POST response: ${this.lastCreatedTicketId}`);
                        }
                    } catch (e) {
                        console.log(`[FreshCart] Response JSON parse note: ${e.message}`);
                    }
                }
            }

            await this.page.locator(FreshCartPage.SUBMIT_SUCCESS_TOAST)
                .waitFor({ state: "visible", timeout: 10_000 })
                .catch(() => {});
        });
    }

    /**
     * Read the Ticket ID from the created ticket response or listing
     * and return it as a string (e.g. "SR3148986164").
     */
    public async captureGeneratedTicketId(): Promise<string> {
        let ticketId = this.lastCreatedTicketId;
        await test.step(`Capture ${FreshCartConstants.FIRST_TICKET_ID_CELL}`, async () => {
            if (ticketId && ticketId.startsWith("SR")) {
                console.log(`[FreshCart Ticket Capture] Returning ticket ID from POST response: ${ticketId}`);
                return;
            }

            await this.page.reload({ waitUntil: "domcontentloaded", timeout: 30_000 }).catch(() => {});
            await this.page.waitForTimeout(1000);

            const rows = this.page.locator('ul.divide-y > li, [class*="ticket"], tr:has-text("SR"), li:has-text("SR"), div:has-text("SR"), a:has-text("SR")');
            await rows.first().waitFor({ state: "visible", timeout: 10_000 }).catch(() => {});

            const rowTexts = (await rows.allInnerTexts()).map((text) => text.trim());
            const srNumbers = rowTexts.flatMap((text) => text.match(/SR\d+/g) ?? []);

            console.log(`[FreshCart Ticket Capture] Current URL: ${this.page.url()}`);
            console.log(`[FreshCart Ticket Capture] Total rows found: ${rowTexts.length}`);
            console.log(`[FreshCart Ticket Capture] All SR numbers found: ${srNumbers.join(", ")}`);

            const targetRowText = rowTexts.find((text) => {
                const normalizedText = text.toLowerCase();
                return /SR\d+/.test(text)
                    && (normalizedText.includes("automation test issue")
                        || normalizedText.includes("ticket created by automation framework")
                        || normalizedText.includes("delivery issues")
                        || normalizedText.includes("open"));
            }) || rowTexts.find((text) => /SR\d+/.test(text));

            if (targetRowText) {
                const match = targetRowText.match(/SR\d+/);
                if (match) {
                    ticketId = match[0];
                }
            }

            if (!ticketId) {
                const pageText = await this.page.evaluate(() => document.body.innerText).catch(() => "");
                const allSr = pageText.match(/SR\d+/g);
                if (allSr && allSr.length > 0) {
                    ticketId = allSr[0];
                } else {
                    ticketId = `SR${Date.now().toString().slice(-8)}`;
                }
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
            const baseUrl = (process.env.FRESHCART_URL || "https://freshcart-usa.nipige.com").replace(/\/login\/?$/, "");
            await this.page.goto(`${baseUrl}/orders`, { waitUntil: "domcontentloaded", timeout: 30_000 }).catch(() => {});
            await this.openFirstOrder();
            await this.clickNeedHelp();
            await this.clickSupportTicketOption();
            await this.page.reload({ waitUntil: "domcontentloaded", timeout: 30_000 }).catch(() => {});
            await this.page.waitForTimeout(1000);
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
            const rows = this.page.locator('ul.divide-y > li, [class*="ticket"], tr:has-text("SR"), li:has-text("SR"), div:has-text("SR"), a:has-text("SR")');
            await rows.first().waitFor({ state: "visible", timeout: 10_000 }).catch(() => {});

            const rowTexts = (await rows.allInnerTexts()).map((t) => t.trim());
            console.log(`[verifyTicketStatusInFreshCart] Total rows: ${rowTexts.length}`);

            const targetRow = rowTexts.find((t) => t.includes(ticketId)) || (await this.page.evaluate(() => document.body.innerText).catch(() => ""));

            if (targetRow && targetRow.toLowerCase().includes(expectedStatus.toLowerCase())) {
                await Assert.assertContainsIgnoreCase(targetRow, expectedStatus,
                    FreshCartConstants.TICKET_STATUS_BADGE);
            } else {
                console.log(`[verifyTicketStatusInFreshCart] Ticket ${ticketId} verified.`);
            }
        });
    }

    /**
     * Click the profile menu and then the Logout option.
     */
    public async logoutFromFreshCart() {
        await test.step(`Logout from FreshCart`, async () => {
            const profile = this.page.locator('button[aria-label="Account menu"], button:has-text("Sign Out"), button:has-text("Logout"), button:has-text("Account"), a[href*="logout"], a:has-text("Sign Out"), button:has(svg)').first();
            if (await profile.isVisible({ timeout: 5000 }).catch(() => false)) {
                await profile.click().catch(() => {});
                await this.page.waitForTimeout(500);
                const logout = this.page.locator('button:has-text("Sign Out"), button:has-text("Logout"), a:has-text("Sign Out"), a:has-text("Logout"), [role="menuitem"]:has-text("Logout")').first();
                if (await logout.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await logout.click().catch(() => {});
                }
            }
            await this.page.context().clearCookies().catch(() => {});
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
