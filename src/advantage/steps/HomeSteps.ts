import test, { Page, expect } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import HomePageConstants from "@uiConstants/HomePageConstants";
import HomePage from "@pages/HomePage";
import Allure from "@allure";

export default class HomeSteps {
    private ui: UIActions;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }

    public async launchNipigeLoginApplication() {
        await test.step(`Launching the Nipige login page`, async () => {
            const baseUrl = process.env.BASE_URL as string | undefined;
            if (!baseUrl) {
                throw new Error("process.env.BASE_URL is required but was not set");
            }
            const loginUrl = new URL("/login", baseUrl).toString();
            await this.ui.goto(loginUrl, HomePageConstants.HOME_PAGE);
        });
    }

    public async loginAsSeller(email: string, password: string, tenant: string) {
        await test.step(`Login to Nipige as seller ${email} for tenant ${tenant}`, async () => {
            await expect(this.page.locator(HomePage.NIPIGE_LOGIN_HEADING)).toBeVisible();
            await this.ui.editBox(HomePage.NIPIGE_EMAIL_TEXTBOX, HomePageConstants.NIPIGE_EMAIL_TEXTBOX).fill(email);
            await this.ui.editBox(HomePage.NIPIGE_PASSWORD_TEXTBOX, HomePageConstants.NIPIGE_PASSWORD_TEXTBOX).fill(password);
            const tenantListResponse = this.page.waitForResponse(
                response => response.url().includes("/tenant/list-ids"),
                { timeout: 15_000 }
            ).catch(() => null);
            await this.ui.element(HomePage.NIPIGE_SELLER_ROLE_BUTTON, HomePageConstants.NIPIGE_SELLER_ROLE_BUTTON).click();
            await tenantListResponse;
            await this.selectNipigeTenant(tenant);
            await this.ui.element(HomePage.NIPIGE_LOGIN_BUTTON, HomePageConstants.NIPIGE_LOGIN_BUTTON).click();
        });
    }

    public async loginAsAdmin(email: string, password: string, tenant: string) {
        await test.step(`Login to Nipige with wrong role for ${email}`, async () => {
            await expect(this.page.locator(HomePage.NIPIGE_LOGIN_HEADING)).toBeVisible();
            await this.ui.editBox(HomePage.NIPIGE_EMAIL_TEXTBOX, HomePageConstants.NIPIGE_EMAIL_TEXTBOX).fill(email);
            await this.ui.editBox(HomePage.NIPIGE_PASSWORD_TEXTBOX, HomePageConstants.NIPIGE_PASSWORD_TEXTBOX).fill(password);
            const wrongRoleButton = this.page.locator(HomePage.NIPIGE_ADMIN_ROLE_BUTTON).first();
            if (await wrongRoleButton.count() > 0) {
                const tenantListResponse = this.page.waitForResponse(
                    response => response.url().includes("/tenant/list-ids"),
                    { timeout: 15_000 }
                ).catch(() => null);
                await wrongRoleButton.click();
                await tenantListResponse;
                await this.selectNipigeTenant(tenant);
            }
            await this.ui.element(HomePage.NIPIGE_LOGIN_BUTTON, HomePageConstants.NIPIGE_LOGIN_BUTTON).click();
        });
    }

    private async selectNipigeTenant(tenant: string) {
        await test.step(`Select Nipige tenant ${tenant}`, async () => {
            if (!tenant) return; // empty tenant — skip selection; login will show validation error

            const nativeSelect = this.page.locator("select").first();
            try {
                await nativeSelect.waitFor({ state: "visible", timeout: 5_000 });
                await nativeSelect.selectOption({ label: tenant });
                return;
            } catch { /* no native select — try combobox */ }

            const tenantDropdown = this.page.getByRole("combobox").first();
            try {
                await tenantDropdown.waitFor({ state: "visible", timeout: 5_000 });
                await tenantDropdown.click();
                await this.page.getByRole("option", { name: tenant }).click();
            } catch {
                // close the dropdown if it opened but selection failed
                await this.page.keyboard.press("Escape");
            }
        });
    }

    public async validateNipigeLogin() {
        await test.step(`Verify that Nipige login is successful`, async () => {
            await expect(this.page.getByRole("button", { name: /Loading/i })).toBeHidden({ timeout: 30_000 });

            const errorTexts = await this.page.locator(HomePage.NIPIGE_LOGIN_ERROR).allInnerTexts();
            const visibleError = errorTexts.map(text => text.trim()).find(text => text.length > 0);
            if (visibleError) {
                throw new Error(`Nipige login failed: ${visibleError}`);
            }

            await expect(this.page.locator(HomePage.NIPIGE_LOGIN_HEADING)).toBeHidden({ timeout: 20_000 });
        });
    }

    public async validateInvalidNipigeLogin(expectedErrorMessage?: string) {
        await test.step(`Verify that Nipige login failed with error message`, async () => {
            await expect(this.page.locator(HomePage.NIPIGE_LOGIN_HEADING)).toBeVisible({ timeout: 20_000 });

            const specificInvalidLocator = this.page.locator(HomePage.SIGN_IN_ERROR_MESSAGE);
            const hasSpecific = await specificInvalidLocator.first().isVisible().catch(() => false);

            let actualErrorMessage = "";
            let usedLocator = this.page.locator(HomePage.NIPIGE_LOGIN_ERROR).first();

            if (hasSpecific) {
                usedLocator = specificInvalidLocator.first();
                await expect(usedLocator).toBeVisible({ timeout: 10_000 });
                actualErrorMessage = (await usedLocator.innerText()).trim();
            } else {
                const allErrorTexts = await this.page.locator(HomePage.NIPIGE_LOGIN_ERROR).allInnerTexts();
                actualErrorMessage = allErrorTexts.map(t => t.trim()).find(t => t.length > 0) ?? "";
                await expect(this.page.locator(HomePage.NIPIGE_LOGIN_ERROR).first()).toBeVisible({ timeout: 10_000 });
            }

            console.log(`\n========================================`);
            console.log(`  Login Error Message: "${actualErrorMessage}"`);
            console.log(`========================================\n`);

            await Allure.attachText("Login Error Message", actualErrorMessage);

            if (expectedErrorMessage) {
                await expect(usedLocator).toContainText(expectedErrorMessage);
            } else {
                await expect(usedLocator).toHaveText(/.+/);
            }
        });
    }

    public async navigateToOrderManagement() {
        await test.step(`Navigate to Order Management`, async () => {
            await this.page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => null);

            const orderManagementLink = this.page.getByRole("link", { name: /order management/i }).first();
            if (await orderManagementLink.count() > 0) {
                await orderManagementLink.click();
            } else {
                const orderManagementButton = this.page.getByRole("button", { name: /order management/i }).first();
                if (await orderManagementButton.count() > 0) {
                    await orderManagementButton.click();
                } else {
                    await this.ui.element(HomePage.NIPIGE_ORDER_MANAGEMENT_LINK,
                        HomePageConstants.NIPIGE_ORDER_MANAGEMENT_LINK).click();
                }
            }
            await expect(this.page.locator(HomePage.NIPIGE_ORDER_MANAGEMENT_STAT_CARD).first())
                .toBeVisible({ timeout: 60_000 });
        });
    }
}
