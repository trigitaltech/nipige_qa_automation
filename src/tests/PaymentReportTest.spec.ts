import HomeSteps from "@uiSteps/HomeSteps";
import PaymentReportSteps from "@uiSteps/PaymentReportSteps";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "PaymentReportTest";

const testCases = [
    "TC01_PaymentReportLoad",
    "TC02_DateFilterValidation",
    "TC03_RefreshValidation",
    // "TC04_ExportCSVValidation",
    // "TC05_PDFValidation",
    "TC06_CollectionTrendFilters"
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

            const payment =
                new PaymentReportSteps(page);

            await home.launchApplication();

            await home.login(
                data.UserName,
                data.Password,
                data.persona
            );

            await payment.openPaymentReport();

            switch (data.TestID) {

                case "TC01_PaymentReportLoad":
                    await payment.verifyPaymentReportLoaded();
                    break;

                case "TC02_DateFilterValidation":
                    await payment.verifyDateFilters();
                    break;

                case "TC03_RefreshValidation":
                    await payment.verifyRefreshButton();
                    break;

                // case "TC04_ExportCSVValidation":
                //     await payment.verifyExportCSV();
                //     break;

                // case "TC05_PDFValidation":
                //     await payment.verifyPDFDownload();
                //     break;

                case "TC06_CollectionTrendFilters":

    await payment.verifyCollectionTrendFilters(
        data.FromDate,
        data.ToDate
    );

    break;

    break;
            }

            await home.logout();
        }
    );
}