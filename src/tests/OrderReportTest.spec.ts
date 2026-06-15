import HomeSteps from "@uiSteps/HomeSteps";
import OrderReportSteps from "@uiSteps/OrderReportSteps";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "OrderReportTest";

const testCases = [
    "TC01_OrderReportLoad",
    "TC02_DateFilterValidation",
    "TC03_RefreshValidation",
    "TC04_OrderValueChartFilter",
    "TC05_OrderStatusFilter",
    "TC06_SalesChannelAndOrderTypeValidation",
    "TC07_OrderDetailFiltersValidation"
];

for (const testCase of testCases) {

    const data = ExcelUtil.getTestData(
        SHEET,
        testCase
    );

    test(
        `${data.TestID} - ${data.Description}`,
        async ({ page }) => {

            Allure.attachDetails(
                data.Description,
                data.Issue
            );

            const home =
                new HomeSteps(page);

            const order =
                new OrderReportSteps(page);

            await home.launchApplication();

            await home.login(
                data.UserName,
                data.Password,
                data.persona
            );

            await order.openOrderReport();

            switch (data.TestID) {

                case "TC01_OrderReportLoad":

                    await order.verifyOrderReportLoaded();

                    break;

                case "TC02_DateFilterValidation":

                    await order.verifyDateFilters();

                    break;
                case "TC03_RefreshValidation":

    await order.verifyRefreshButton();

    break;

   case "TC04_OrderValueChartFilter":

    await order.verifyOrderValueChartFilter(
        data.FromDate,
        data.ToDate
    );

    break;

   case "TC05_OrderStatusFilter":

    await order.verifyOrderStatusFilter(
        data.FromDate,
        data.ToDate
    );

    break;

    case "TC06_SalesChannelAndOrderTypeValidation":

    await order.verifyOrderBySalesChannelAndType();

    break;

    case "TC07_OrderDetailFiltersValidation":

    await order.verifyOrderDetailFilters(
        data.ValidSearch,
        data.SearchOrderId,
        data.InvalidSearch
    );

    break;
            }

            await home.logout();
        }
    );
}