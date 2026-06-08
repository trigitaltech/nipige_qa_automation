import HomeSteps from "@uiSteps/HomeSteps";
import RegistrationSteps from "@uiSteps/RegistrationSteps";
import { test } from "@base-test";
import { Page } from "@playwright/test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";
import StringUtil from "@utils/StringUtil";

const SHEET = "LoginTest";

/**
 * Provides a known-good account for the valid-login scenarios.
 *
 * Priority:
 *  1. Credentials from a NON-COMMITTED .env (VALID_USERNAME / VALID_PASSWORD) — use these
 *     to point the tests at a real, currently-valid account.
 *  2. Fallback: register a fresh account on the live demo and reuse it. The public AOS demo
 *     periodically wipes user accounts, so self-provisioning keeps the valid-login test
 *     CI-stable without depending on a hard-coded account that may no longer exist.
 *
 * @param page Playwright page used to drive registration when no env credentials are supplied
 */
async function getValidCredentials(page: Page): Promise<{ userName: string; password: string }> {
    if (process.env.VALID_USERNAME && process.env.VALID_PASSWORD) {
        return { userName: process.env.VALID_USERNAME, password: process.env.VALID_PASSWORD };
    }
    // AOS requires an alphanumeric password; keep the default free of special characters.
    const password = process.env.VALID_PASSWORD ?? "Test1234";
    const email = `${StringUtil.randomLowercaseString(10)}@example.com`;
    const home = new HomeSteps(page);
    const register = new RegistrationSteps(page);
    await home.launchApplication();
    await home.navigateToCreateAccount();
    const userName = await register.createAccount(email, password, password, "Jane", "Doe",
        "020-7935-7788", "India", "Amdavad", "42, Kamal Estate", "Gujarat", "380023", "true");
    await register.saveRegistration();
    await home.validateLogin(userName); // AOS auto-logs-in after registration
    await home.logout();
    return { userName, password };
}

const data1 = ExcelUtil.getTestData(SHEET, "TC01_ValidLogin");
test(`${data1.TestID} - ${data1.Description}`, async ({ page }) => {
    Allure.attachDetails(data1.Description, data1.Issue);
    const home = new HomeSteps(page);
    await home.launchApplication();
    // Nipige requires selecting the account's role ("Login as") — driven by the `persona`
    // column in the test data (e.g. tenant / seller).
    await home.login(data1.UserName, data1.Password, data1.persona);
    await home.validateLogin(data1.UserName);
    await home.logout();
});

const data2 = ExcelUtil.getTestData(SHEET, "TC02_InValidLogin");
test(`${data2.TestID} - ${data2.Description}`, async ({ page }) => {
    Allure.attachDetails(data2.Description, data2.Issue);
    const home = new HomeSteps(page);
    await home.launchApplication();
    // Nipige requires choosing a "Login as" role before it validates credentials; without it the
    // app stops at "Please select login way" instead of returning the invalid-credentials error.
    await home.login(data2.UserName, data2.Password, data2.persona);
    await home.validateInvalidLogin(data2.ErrorMessage);
});

const data3 = ExcelUtil.getTestData(SHEET, "TC03_LoginCreateAccount");
test(`${data3.TestID} - ${data3.Description}`, async ({ page }) => {
    Allure.attachDetails(data3.Description, data3.Issue);
    const { userName, password } = await getValidCredentials(page);
    const home = new HomeSteps(page);
    await home.launchApplication();
    await home.navigateToCreateAccount();
    const register = new RegistrationSteps(page);
    await register.alreadyHaveAccount();
    await home.enterLoginDetails(userName, password);
    await home.validateLogin(userName);
    await home.logout();
});
const data4 = ExcelUtil.getTestData(SHEET, "TC04_ValidSellerLogin");

test(`${data4.TestID} - ${data4.Description}`, async ({ page }) => {
    Allure.attachDetails(data4.Description, data4.Issue);

    const home = new HomeSteps(page);

    await home.launchApplication();
    await home.login(
        data4.UserName,
        data4.Password,
        data4.persona
    );

    await home.validateLogin(data4.UserName);
    await home.logout();
});

const data5 = ExcelUtil.getTestData(SHEET, "TC05_InvalidSellerLogin");

test(`${data5.TestID} - ${data5.Description}`, async ({ page }) => {
    Allure.attachDetails(data5.Description, data5.Issue);

    const home = new HomeSteps(page);

    await home.launchApplication();
    await home.login(
        data5.UserName,
        data5.Password,
        data5.persona
    );

    await home.validateInvalidLogin(data5.ErrorMessage);
});