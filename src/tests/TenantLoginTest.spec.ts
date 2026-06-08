// import HomeSteps from "@uiSteps/HomeSteps";
// import RegistrationSteps from "@uiSteps/RegistrationSteps";
// import { test } from "@base-test";
// import { Page } from "@playwright/test";
// import Allure from "@allure";
// import ExcelUtil from "@utils/ExcelUtil";
// import StringUtil from "@utils/StringUtil";

// const SHEET = "LoginTest";

// /**
//  * Provides a known-good account for the valid-login scenarios.
//  *
//  * Priority:
//  *  1. Credentials from a NON-COMMITTED .env (VALID_USERNAME / VALID_PASSWORD) — use these
//  *     to point the tests at a real, currently-valid account.
//  *  2. Fallback: register a fresh account on the live demo and reuse it. The public AOS demo
//  *     periodically wipes user accounts, so self-provisioning keeps the valid-login test
//  *     CI-stable without depending on a hard-coded account that may no longer exist.
//  *
//  * @param page Playwright page used to drive registration when no env credentials are supplied
//  */
// async function getValidCredentials(page: Page): Promise<{ userName: string; password: string }> {
//     if (process.env.VALID_USERNAME && process.env.VALID_PASSWORD) {
//         return { userName: process.env.VALID_USERNAME, password: process.env.VALID_PASSWORD };
//     }
//     // AOS requires an alphanumeric password; keep the default free of special characters.
//     const password = process.env.VALID_PASSWORD ?? "Test1234";
//     const email = `${StringUtil.randomLowercaseString(10)}@example.com`;
//     const home = new HomeSteps(page);
//     const register = new RegistrationSteps(page);
//     await home.launchApplication();
//     await home.navigateToCreateAccount();
//     const userName = await register.createAccount(email, password, password, "Jane", "Doe",
//         "020-7935-7788", "India", "Amdavad", "42, Kamal Estate", "Gujarat", "380023", "true");
//     await register.saveRegistration();
//     await home.validateLogin(userName); // AOS auto-logs-in after registration
//     await home.logout();
//     return { userName, password };
// }

// const data1 = ExcelUtil.getTestData(SHEET, "TC01_ValidLogin");
// test(`${data1.TestID} - ${data1.Description}`, async ({ page }) => {
//     Allure.attachDetails(data1.Description, data1.Issue);
//     const home = new HomeSteps(page);
//     await home.launchApplication();
//     // Nipige requires selecting the account's role ("Login as") — driven by the `persona`
//     // column in the test data (e.g. tenant / seller).
//     await home.login(data1.UserName, data1.Password, data1.persona);
//     await home.validateLogin(data1.UserName);
//     await home.logout();
// });

// const data2 = ExcelUtil.getTestData(SHEET, "TC02_InValidLogin");
// test(`${data2.TestID} - ${data2.Description}`, async ({ page }) => {
//     Allure.attachDetails(data2.Description, data2.Issue);
//     const home = new HomeSteps(page);
//     await home.launchApplication();
//     await home.login(data2.UserName, data2.Password);
//     await home.validateInvalidLogin(data2.ErrorMessage);
// });

// const data3 = ExcelUtil.getTestData(SHEET, "TC03_LoginCreateAccount");
// test(`${data3.TestID} - ${data3.Description}`, async ({ page }) => {
//     Allure.attachDetails(data3.Description, data3.Issue);
//     const { userName, password } = await getValidCredentials(page);
//     const home = new HomeSteps(page);
//     await home.launchApplication();
//     await home.navigateToCreateAccount();
//     const register = new RegistrationSteps(page);
//     await register.alreadyHaveAccount();
//     await home.enterLoginDetails(userName, password);
//     await home.validateLogin(userName);
//     await home.logout();
// });


// import HomeSteps from "@uiSteps/HomeSteps";
// import { test } from "@base-test";
// import Allure from "@allure";
// import ExcelUtil from "@utils/ExcelUtil";

// const SHEET = "LoginTest";

// /**
//  * TC01 - Valid Login
//  */
// const data1 = ExcelUtil.getTestData(SHEET, "TC01_ValidLogin");

// test(`${data1.TestID} - ${data1.Description}`, async ({ page }) => {
//     Allure.attachDetails(data1.Description, data1.Issue);

//     const home = new HomeSteps(page);

//     await home.launchApplication();

//     await home.login(
//         data1.UserName,
//         data1.Password,
//         data1.persona
//     );

//     await home.validateLogin(data1.UserName);

//     await home.logout();
// });

// /**
//  * TC02 - Invalid Login
//  */
// const data2 = ExcelUtil.getTestData(SHEET, "TC02_InValidLogin");

// test(`${data2.TestID} - ${data2.Description}`, async ({ page }) => {
//     Allure.attachDetails(data2.Description, data2.Issue);

//     const home = new HomeSteps(page);

//     await home.launchApplication();

//     await home.login(
//         data2.UserName,
//         data2.Password,
//         data2.persona
//     );

//     await home.validateInvalidLogin(
//         data2.ErrorMessage
//     );
// });

import HomeSteps from "@uiSteps/HomeSteps";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "LoginTest";

const scenarios = [
    "TC01_ValidLogin",
    "TC02_InValidLogin",
    "TC03_LoginCreateAccount",
    "TC04_InvalidUsername",
];

for (const scenario of scenarios) {

    const data = ExcelUtil.getTestData(SHEET, scenario);

    test(`${data.TestID} - ${data.Description}`, async ({ page }) => {

        Allure.attachDetails(data.Description, data.Issue);

        const home = new HomeSteps(page);

        await home.launchApplication();

        await home.login(
            data.UserName || "",
            data.Password || "",
            data.persona || ""
        );

        if (data.TestID === "TC01_ValidLogin" || data.TestID === "TC03_LoginCreateAccount") {

            await home.validateLogin(data.UserName);

            await home.logout();

        } else {

            await home.validateInvalidLogin(
                data.ErrorMessage
            );
        }
    });
}