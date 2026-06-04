import HomeSteps from "@uiSteps/HomeSteps";
import { test } from "@base-test";
import Allure from "@allure";
import { getCredential, Role } from "@config/Credentials";

test("TC01 - Seller can login to NipigeV2", async ({ page }) => {
    Allure.attachDetails("Verify seller login works for NipigeV2.", "");
    const seller = getCredential(Role.SELLER);
    const home = new HomeSteps(page);

    await home.launchNipigeLoginApplication();
    await home.loginAsSeller(seller.email!, seller.password!, seller.tenant!);
    await home.validateNipigeLogin();
    await home.navigateToOrderManagement();
});

test("TC02 - Seller cannot login with invalid password", async ({ page }) => {
    Allure.attachDetails("Verify error message for invalid password.", "");
    const seller = getCredential(Role.SELLER);
    const home = new HomeSteps(page);

    await home.launchNipigeLoginApplication();
    await home.loginAsSeller(
        seller.email!,
        `${seller.password!}Invalid`,
        seller.tenant!
    );

    await home.validateInvalidNipigeLogin();
});

test("TC03 - Seller cannot login with invalid email", async ({ page }) => {
    Allure.attachDetails("Verify error message for invalid email.", "");
    const seller = getCredential(Role.SELLER);
    const home = new HomeSteps(page);

    await home.launchNipigeLoginApplication();
    await home.loginAsSeller(
        "invalidseller@test.com",
        seller.password!,
        seller.tenant!
    );

    await home.validateInvalidNipigeLogin();
});

test("TC04 - Seller cannot login with invalid email and password", async ({ page }) => {
    Allure.attachDetails("Verify error message when both email and password are invalid.", "");
    const seller = getCredential(Role.SELLER);
    const home = new HomeSteps(page);

    await home.launchNipigeLoginApplication();
    await home.loginAsSeller(
        "invalidseller@test.com",
        "WrongPassword123",
        seller.tenant!
    );

    await home.validateInvalidNipigeLogin();
});

test("TC05 - Seller cannot login with wrong tenant selected", async ({ page }) => {
    Allure.attachDetails("Verify error message when wrong tenant is selected.", "");
    const seller = getCredential(Role.SELLER);
    const home = new HomeSteps(page);

    await home.launchNipigeLoginApplication();
    await home.loginAsSeller(
        seller.email!,
        seller.password!,
        "Wrong Tenant"
    );

    await home.validateInvalidNipigeLogin();
});

test("TC06 - Seller cannot login with empty email", async ({ page }) => {
    Allure.attachDetails("Verify validation for empty email.", "");
    const seller = getCredential(Role.SELLER);
    const home = new HomeSteps(page);

    await home.launchNipigeLoginApplication();
    await home.loginAsSeller(
        "",
        seller.password!,
        seller.tenant!
    );

    await home.validateInvalidNipigeLogin();
});

test("TC07 - Seller cannot login with empty password", async ({ page }) => {
    Allure.attachDetails("Verify validation for empty password.", "");
    const seller = getCredential(Role.SELLER);
    const home = new HomeSteps(page);

    await home.launchNipigeLoginApplication();
    await home.loginAsSeller(
        seller.email!,
        "",
        seller.tenant!
    );

    await home.validateInvalidNipigeLogin();
});

test("TC08 - Seller cannot login with empty tenant selection", async ({ page }) => {
    Allure.attachDetails("Verify validation for empty tenant selection.", "");
    const seller = getCredential(Role.SELLER);
    const home = new HomeSteps(page);

    await home.launchNipigeLoginApplication();
    await home.loginAsSeller(
        seller.email!,
        seller.password!,
        ""
    );

    await home.validateInvalidNipigeLogin();
});

test("TC09 - Seller cannot login with wrong role selected", async ({ page }) => {
    Allure.attachDetails("Verify seller cannot login when wrong role is selected.", "");
    const seller = getCredential(Role.SELLER);
    const home = new HomeSteps(page);

    await home.launchNipigeLoginApplication();

    await home.loginAsAdmin(
        seller.email!,
        seller.password!,
        seller.tenant!
    );

    await home.validateInvalidNipigeLogin();
});

test("TC10 - Seller cannot login with all fields empty", async ({ page }) => {
    Allure.attachDetails("Verify validation when all fields are empty.", "");
    const home = new HomeSteps(page);

    await home.launchNipigeLoginApplication();

    await home.loginAsSeller(
        "",
        "",
        ""
    );

    await home.validateInvalidNipigeLogin();
});