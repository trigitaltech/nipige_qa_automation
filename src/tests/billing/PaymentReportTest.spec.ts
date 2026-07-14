import HomeSteps from "@uiSteps/HomeSteps";
import PaymentReportSteps from "@uiSteps/PaymentReportSteps";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "PaymentReportTest";

const testCases = [
    "TC01_PaymentReportLoad",
    "TC02_TodayFilter",
    "TC07_RefreshValidation",
    // "TC08_ExportCSV",
    // "TC09_PDFExport",
    "TC12_CollectionsTrendChart",
];

testCases.forEach((testCase) => {
    const data = ExcelUtil.getTestData(
        SHEET,
        testCase,
    );

    test(`${data.TestID} - ${data.Description} @regression @billing`,
        async ({ page }) => {
            Allure.attachDetails(
                data.Description,
                data.Issue,
            );

            const home = new HomeSteps(page);

            const payment = new PaymentReportSteps(page);

            await home.launchApplication();

            await home.login(
                data.UserName,
                data.Password,
                data.persona,
            );

            await payment.openPaymentReport();

            switch (data.TestID) {
                case "TC01_PaymentReportLoad":
                    await payment.verifyPaymentReportLoaded();
                    break;

                case "TC02_TodayFilter":
                    await payment.verifyDateFilters();
                    break;

                case "TC07_RefreshValidation":
                    await payment.verifyRefreshButton();
                    break;

                // case "TC08_ExportCSV":
                //     await payment.verifyExportCSV();
                //     break;

                // case "TC09_PDFExport":
                //     await payment.verifyPDFDownload();
                //     break;

                case "TC12_CollectionsTrendChart":
                    await payment.verifyCollectionTrendFilters(
                        data.FromDate,
                        data.ToDate,
                    );
                    break;

                default:
                    break;
            }

            await home.logout();
        },
    );
});
