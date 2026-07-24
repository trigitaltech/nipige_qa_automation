import HomeSteps from "@uiSteps/HomeSteps";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";
import { getCredential, Role } from "@config/Credentials";

// Retries guard against HTTP 429 rate-limiting from the backend when the regression suite
// runs many login-heavy tests back-to-back. Two retries with Playwright's built-in backoff
// give the server time to recover without adding artificial sleeps.
test.describe.configure({ retries: 2 });

const SHEET = "LoginTest";

const data1 = ExcelUtil.getTestData(SHEET, "TC06_AdminValidLogin");
test(`${data1.TestID} - ${data1.Description} @regression @auth`, async ({ page }) => {
    Allure.attachDetails(data1.Description, data1.Issue);
    const credential = getCredential(Role.ADMIN);
    const home = new HomeSteps(page);
    await home.launchApplication();
    await home.login(credential.email, credential.password, data1.persona);
    await home.validateLogin(credential.email);
    await home.logout();
});

const data2 = ExcelUtil.getTestData(SHEET, "TC07_AdminInvalidUsername");
test(`${data2.TestID} - ${data2.Description} @regression @auth`, async ({ page }) => {
    Allure.attachDetails(data2.Description, data2.Issue);
    const home = new HomeSteps(page);
    await home.launchApplication();
    await home.enterLoginDetails(data2.UserName, data2.Password, data2.persona);
    await home.validateInvalidLogin(data2.ErrorMessage);
});

const data3 = ExcelUtil.getTestData(SHEET, "TC08_AdminInvalidPassword");
test(`${data3.TestID} - ${data3.Description} @regression @auth`, async ({ page }) => {
    Allure.attachDetails(data3.Description, data3.Issue);
    const home = new HomeSteps(page);
    await home.launchApplication();
    await home.enterLoginDetails(data3.UserName, data3.Password, data3.persona);
    await home.validateInvalidLogin(data3.ErrorMessage);
});

const data4 = ExcelUtil.getTestData(SHEET, "TC09_AdminInvalidUsernameAndPassword");
test(`${data4.TestID} - ${data4.Description} @regression @auth`, async ({ page }) => {
    Allure.attachDetails(data4.Description, data4.Issue);
    const home = new HomeSteps(page);
    await home.launchApplication();
    await home.enterLoginDetails(data4.UserName, data4.Password, data4.persona);
    await home.validateInvalidLogin(data4.ErrorMessage);
});
