import HomeSteps from "@uiSteps/HomeSteps";
import AdminDashboardSteps from "@uiSteps/AdminDashboardSteps";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "AdminDashboardTest";

const scenarios = [
    "TC01_AdminDashboardLoad",
    "TC02_AdminDashboardFilters",
    "TC03_AdminOrderChartDropdown",
    "TC04_AdminRevenueDropdown"
];

for (const scenario of scenarios) {

    const data = ExcelUtil.getTestData(
        SHEET,
        scenario
    );

    test(
        `${data.TestID} - ${data.Description}`,
        async ({ page }) => {

            Allure.attachDetails(
                data.Description,
                data.Issue
            );

            const home = new HomeSteps(page);

            const dashboard =
                new AdminDashboardSteps(page);

            await home.launchApplication();

            await home.login(
                data.UserName,
                data.Password,
                data.Persona
            );

            await dashboard.openDashboard();

            await dashboard.verifyDashboardLoaded();

            switch (data.TestID) {

                case "TC01_AdminDashboardLoad":

                    break;

                case "TC02_AdminDashboardFilters":

    await dashboard.verifyDashboardFilters(
        data.FromDate,
        data.ToDate
    );

    break;

                case "TC03_AdminOrderChartDropdown":

    await dashboard.scrollDashboardPage();

    await dashboard.verifyOrderChartDropdown(
        data.FromDate,
        data.ToDate
    );

    break;

               case "TC04_AdminRevenueDropdown":

    await dashboard.scrollDashboardPage();

    await dashboard.verifyTopRevenueDropdown(
        data.FromDate,
        data.ToDate
    );

    break;
            }

            await home.logout();
        }
    );
}