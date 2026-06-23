import { test } from "@base-test";

import HomeSteps from "@uiSteps/HomeSteps";
import UserManagementSteps from "@uiSteps/UserManagementSteps";

import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "UserManagement";

const testCases = [
    "TC01_PageLoad",
    "TC02_SearchUserPositive",
    "TC03_SearchUserByEmail",
    "TC04_SearchUserNegative",
    "TC06_VerifyTabs",
    "TC07_ViewUserDetails",
    "TC08_EditUser",
    "TC09_DeleteUser",
    "TC10_CreateUser"
];

for (const testCase of testCases) {

    const data = ExcelUtil.getTestData(
        SHEET,
        testCase
    );

    test(
        `${data.TestID} - ${data.Description}`,

        async ({ page }) => {

            const home =
                new HomeSteps(page);

            const userManagement =
                new UserManagementSteps(page);

            await home.launchApplication();

            await home.login(
                data.UserName,
                data.Password,
                data.persona
            );

            await userManagement.openUserManagementPage();

            switch (testCase) {

                case "TC01_PageLoad":

                    await userManagement.verifyPageLoaded();

                    break;

                case "TC02_SearchUserPositive":

                case "TC03_SearchUserByEmail":

                case "TC04_SearchUserNegative":

                    await userManagement.searchUser(
                        data.SearchText,
                        data.ExpectedResult
                    );

                    break;

                case "TC06_VerifyTabs":

                    await userManagement.verifyTabs();

                    break;

               case "TC07_ViewUserDetails":

    await userManagement.viewUserDetails(
        data.SearchText
    );

    break;

case "TC08_EditUser":

    await userManagement.editUser(
        data.SearchText,
        data.UpdatedName
    );

    break;

case "TC09_DeleteUser":

    await userManagement.deleteUser(
        data.SearchText
    );

    break;

                case "TC09_DeleteUser":

                    await userManagement.deleteUser(
                        data.SearchText
                    );

                    break;

    case "TC10_CreateUser":

    await userManagement.createUser(data);

    break;
            }

            await home.logout();
        }
    );
}