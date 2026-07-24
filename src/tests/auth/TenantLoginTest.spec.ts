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

scenarios.forEach((scenario) => {
    const data = ExcelUtil.getTestData(SHEET, scenario);

    test(`${data.TestID} - ${data.Description} @regression @auth`, async ({ page }) => {
        Allure.attachDetails(data.Description, data.Issue);

        const home = new HomeSteps(page);

        await home.launchApplication();

        if (data.TestID === "TC01_ValidLogin" || data.TestID === "TC03_LoginCreateAccount") {
            await home.login(
                data.UserName || "",
                data.Password || "",
                data.persona || "",
            );
            await home.logout();
        } else {
            await home.enterLoginDetails(
                data.UserName || "",
                data.Password || "",
                data.persona || "",
            );
            await home.validateInvalidLogin(data.ErrorMessage);
        }
    });
});
