import HomeSteps from "@uiSteps/HomeSteps";
import DashboardSteps from "@uiSteps/DashboardSteps";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "DashboardTest";

const USERNAME = "freshcart@gmail.com";
const PASSWORD = "Welcome@123";
const PERSONA = "tenant";

const scenarios = [
    "TC01_DashboardLoad",
    "TC03_DashboardFilters",
    "TC04_OrderChartDropdown",
    "TC05_TopRevenueDropdown",
];

for (let i = 0; i < scenarios.length; i += 1) {
    const scenario = scenarios[i];

    const data = ExcelUtil.getTestData(
        SHEET,
        scenario,
    );

    test(`${data.TestID} - ${data.Description} @regression @admin @sanity`,
        async ({ page }) => {
            Allure.attachDetails(
                data.Description,
                data.Issue,
            );

            const home = new HomeSteps(page);
            const dashboard = new DashboardSteps(page);

            // Launch Application
            await home.launchApplication();

            // Login
            await home.login(
                USERNAME,
                PASSWORD,
                PERSONA,
            );

            // Open Dashboard
            await dashboard.openDashboard();

            // Verify Dashboard Loaded
            await dashboard.verifyDashboardLoaded();

            switch (data.TestID) {
                case "TC01_DashboardLoad":
                    break;

                case "TC03_DashboardFilters":
                    await dashboard.verifyDashboardFilters();
                    break;

                case "TC04_OrderChartDropdown":
                    await dashboard.scrollDashboardPage();
                    await dashboard.verifyOrderChartDropdown();
                    break;

                case "TC05_TopRevenueDropdown":
                    await dashboard.scrollDashboardPage();
                    await dashboard.verifyTopRevenueDropdown();
                    break;

                default:
                    break;
            }

            // Logout
            await home.logout();
        },
    );
}
