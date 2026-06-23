import test, { Page, expect } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import Assert from "@asserts/Assert";
import CommonConstants from "@uiConstants/CommonConstants";
import HomePageConstants from "@uiConstants/HomePageConstants";
import HomePage from "@pages/HomePage";

export default class HomeSteps {    
    private ui: UIActions;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }
    /**
     * Launch the Application
     */
    public async launchApplication() {
        await test.step(`Launching the application`, async () => {
            await this.ui.goto(process.env.BASE_URL, HomePageConstants.HOME_PAGE);
        });
    }
    /**
     * Log into the application.
     * @param userName email address / username
     * @param password account password
     * @param persona optional "Login as" role to select before submitting (e.g. "tenant",
     *                "seller"). The Nipige login screen requires picking the role the account
     *                belongs to; omit it for screens/flows that do not present role buttons.
     * @param tenant optional tenant to select from the "Select Tenant" dropdown. Omit it to use
     *               the persona's default tenant (see {@link HomePage.PERSONA_TENANTS}); pass a
     *               value only to override that default for a specific test.
     */
    public async login(userName: string, password: string, persona?: string, tenant?: string) {
        await test.step(`Login as ${userName}${persona ? ` with role '${persona}'` : ""}`, async () => {
            await this.enterLoginDetails(userName, password, persona, tenant);
        });
    }
    /**
     * Enter login details and submit.
     * @param userName email address / username
     * @param password account password
     * @param persona optional "Login as" role to select before submitting
     * @param tenant optional tenant override; defaults to the persona's configured tenant
     */
    public async enterLoginDetails(userName: string, password: string, persona?: string, tenant?: string) {
        await test.step(`Enter login credentials as ${userName}`, async () => {
            await this.ui.editBox(HomePage.USER_NAME_TEXTBOX, HomePageConstants.USER_NAME).fill(userName);
            await this.ui.editBox(HomePage.PASSWORD_TEXTBOX, HomePageConstants.PASSWORD).fill(password);
            if (persona) {
                await this.selectLoginRole(persona);
                // Tenant-scoped personas (e.g. Seller) reveal a "Select Tenant" dropdown once their
                // role is chosen, and the app blocks login until a tenant is picked. An explicit
                // override wins; otherwise fall back to the persona's configured tenant. Personas
                // that are not tenant-scoped (e.g. Tenant) resolve to undefined and are skipped.
                const tenantToSelect = tenant ?? HomePage.tenantFor(persona);
                if (tenantToSelect) {
                    await this.selectTenant(tenantToSelect);
                }
            }
            await this.ui.element(HomePage.SIGN_IN_BUTTON, HomePageConstants.SIGN_IN_BUTTON).click();
        });
    }
    /**
     * Selects a tenant from the "Select Tenant" dropdown that tenant-scoped personas must set
     * before logging in. The control is a custom dropdown, so it is opened by clicking it and
     * the tenant is then chosen from the rendered option list.
     * @param tenant exact tenant name as shown in the dropdown (e.g. "Fresh Cart")
     */
    private async selectTenant(tenant: string) {
        await test.step(`Select '${tenant}' from the tenant dropdown`, async () => {
            await this.ui.element(HomePage.TENANT_DROPDOWN, HomePageConstants.TENANT_DROPDOWN).click();
            await this.ui.element(HomePage.tenantOption(tenant),
                `${HomePageConstants.TENANT_OPTION} (${tenant})`).click();
        });
    }
    /**
     * Selects the "Login as" role button matching the given persona. The Excel data stores the
     * persona in lower case (e.g. "tenant", "sub dealer"); the on-screen buttons are title-cased
     * (e.g. "Tenant", "Sub Dealer"), so we normalise before matching.
     * @param persona role name as stored in the test data
     */
    private async selectLoginRole(persona: string) {
        const role = persona.trim().split(/\s+/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
        await test.step(`Select '${role}' as the login role`, async () => {
            await this.ui.element(HomePage.loginAsRole(role),
                `${HomePageConstants.LOGIN_AS_ROLE} (${role})`).click();
        });
    }
    /**
     * Validate that the user is successfully logged in.
     * The Nipige app shows an account display name rather than the login email, so success is
     * asserted via the dashboard URL plus a visible profile menu rather than by matching the
     * username text.
     * @param userName the account used to log in (used only for clearer failure messages)
     */
    public async validateLogin(userName: string) {
        await test.step(`Verify that user is successfully logged in as ${userName}`, async () => {
            const profileMenu = this.page.locator(HomePage.PROFILE_MENU).first();
            const signInError = this.page.locator(HomePage.SIGN_IN_ERROR_MESSAGE);
            // Wait for the app to settle into EITHER a logged-in or a failed state, so an
            // unsuccessful login fails fast with a clear reason instead of a long visibility timeout.
            // Allow generous headroom: the migration backend can cold-start and leave the
            // Log in button in a "Loading..." state for several seconds.
            const LOGIN_STATE_TIMEOUT_MS = 120_000;
            await expect(profileMenu.or(signInError).first(),
                `Neither the logged-in profile menu nor a sign-in error appeared for '${userName}'`)
                .toBeVisible({ timeout: LOGIN_STATE_TIMEOUT_MS });
            if (await signInError.isVisible()) {
                const errText = (await signInError.innerText()).trim();
                // HTTP 429 (rate-limit) — wait 10s before throwing so Playwright's retry backoff
                // gives the server time to recover between attempts.
                if (errText.includes("429")) {
                    await this.page.waitForTimeout(10_000);
                }
                throw new Error(`Login failed for '${userName}': ${errText}`);
            }
            await expect(this.page,
                `Expected to land on the dashboard after logging in as '${userName}'`)
                .toHaveURL(/\/home/, { timeout: LOGIN_STATE_TIMEOUT_MS });
        });
    }
    /**
     * Validate invalid login
     * @param errorMessage 
     */
    public async validateInvalidLogin(errorMessage: string) {
        await test.step(`Verify that error message ${errorMessage}`, async () => {
            const user = await this.ui.element(HomePage.SIGN_IN_ERROR_MESSAGE, HomePageConstants.SIGN_IN_ERROR_MESSAGE)
                .getTextContent();
            await Assert.assertEquals(user, errorMessage, HomePageConstants.SIGN_IN_ERROR_MESSAGE);
        });
    }
    /**
     * Log out of the application
     */
    public async logout() {
        await test.step(`Logged out of application`, async () => {
            await this.ui.element(HomePage.PROFILE_MENU, HomePageConstants.PROFILE_MENU).click();
            await this.ui.element(HomePage.SIGN_OUT_LINK, HomePageConstants.SIGN_OUT_LINK).click();
            await expect(this.page.locator(HomePage.USER_NAME_TEXTBOX),
                "Expected to return to the login page after logging out")
                .toBeVisible({ timeout: CommonConstants.DEFAULT_TIMEOUT * CommonConstants.ONE_THOUSAND });
        });
    }
    /**
     * Navigate to Create Account page
     */
    public async navigateToCreateAccount() {
        await test.step(`Navigate to Create Account page`, async () => {
            await this.ui.element(HomePage.USER_ICON, HomePageConstants.USER_ICON).click();
            await this.ui.element(HomePage.CREATE_NEW_ACCOUNT_LINK, HomePageConstants.CREATE_NEW_ACCOUNT_LINK).click();
        });
    }
    /**
     * Enters details into Contact Us
     * @param category 
     * @param product 
     * @param email 
     * @param subject 
     */
    public async enterContactUsDetails(category: string, product: string, email: string, subject: string) {
        await test.step(`Entering Contact Us details`, async () => {
            await this.ui.dropdown(HomePage.CATEGORY_DROPDOWN, HomePageConstants.CATEGORY_DROPDOWN)
                .selectByVisibleText(category);
            await this.ui.dropdown(HomePage.PRODUCT_DROPDOWN, HomePageConstants.PRODUCT_DROPDOWN)
                .selectByVisibleText(product);
            await this.ui.editBox(HomePage.EMAIL_TEXTBOX, HomePageConstants.EMAIL_TEXTBOX).fill(email);
            await this.ui.editBox(HomePage.SUBJECT_TEXTAREA, HomePageConstants.SUBJECT_TEXTAREA).fill(subject);
        });
    }
    /**
     * Click on Send button of Contact Us
     */
    public async sendMessage() {
        await test.step(`Click on Send button of Contact Us`, async () => {
            await this.ui.element(HomePage.SEND_BUTTON, HomePageConstants.SEND_BUTTON).click();
        });
    }
    /**
     * Verify the success message of Contact Us
     * @param message 
     */
    public async verifySuccessMessage(message: string) {
        await test.step(`Verifying Success Message of Contact Us`, async () => {
            const actualMessage = await this.ui.element(HomePage.CONTACT_US_MESSAGE,
                HomePageConstants.CONTACT_US_MESSAGE).getTextContent();
            await Assert.assertEquals(actualMessage, message, HomePageConstants.CONTACT_US_MESSAGE);
        });
    }
    /**
     * Search for Product
     * @param product 
     */
    public async searchProduct(product: string) {
        await test.step(`Searching for product '${product}'`, async () => {
            await this.ui.element(HomePage.SEARCH_ICON, HomePageConstants.SEARCH_ICON).click();
            await (await this.ui.editBox(HomePage.SEARCH_TEXTBOX, HomePageConstants.SEARCH_TEXTBOX).type(product))
                .keyPress(HomePageConstants.ENTER_KEY);
            await this.ui.element(HomePage.SEARCH_CLOSE_IMAGE, HomePageConstants.SEARCH_CLOSE_IMAGE).click();
        });
    }
    /**
     * Navigate to Management Console screen
     */
    public async navigateToManagementConsole() {
        let newPage: Page;
        await test.step(`Navigate to Management Console screen`, async () => {
            await this.ui.waitForLoadingImage();
            await this.ui.element(HomePage.HELP_ICON, HomePageConstants.HELP_ICON).click();
            newPage = await this.ui.switchToNewWindow(HomePage.MANAGEMENT_CONSOLE_LINK,
                HomePageConstants.MANAGEMENT_CONSOLE_LINK);
        });
        return newPage;
    }
}
