import HomeSteps from "@uiSteps/HomeSteps";
import OrderManagementSteps from "@uiSteps/OrderManagementSteps";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "OrderManagementTest";

const testCases = [
    "TC01_OrderManagementLoad",
    "TC02_DateAndStatusFilter",
    "TC03_DateAndSellerFilter",
    "TC04_DateAndOrderIdFilter",
    "TC05_DateStatusOrderViewInvoice"
];

for (const testCase of testCases) {

    const data = ExcelUtil.getTestData(
        SHEET,
        testCase
    );

    test(`${data.TestID} - ${data.Description} @regression @operations @smoke`,
        async ({ page }) => {

            Allure.attachDetails(
                data.Description,
                data.Issue
            );

            const home =
                new HomeSteps(page);

            const order =
                new OrderManagementSteps(page);

            await home.launchApplication();

            // Login Data From Excel
           await home.login(
    data.UserName,
    data.Password,
    data.persona
);

            await order.openOrderManagement();

            await order.verifyOrderManagementLoaded();

            switch (data.TestID) {

                case "TC01_OrderManagementLoad":
                    break;

                case "TC02_DateAndStatusFilter":
                    await order.verifyStatusFilter();
                    break;

                case "TC03_DateAndSellerFilter":
                    await order.verifyDateAndSellerFilter();
                    break;

                case "TC04_DateAndOrderIdFilter":
                    await order.verifyDateAndOrderIdFilter();
                    break;

                case "TC05_DateStatusOrderViewInvoice":
                    await order.verifyDateStatusOrderViewInvoice();
                    break;
            }

            await home.logout();
        }
    );
}