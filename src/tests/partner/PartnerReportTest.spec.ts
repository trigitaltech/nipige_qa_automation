// import HomeSteps from "@uiSteps/HomeSteps";
// import PartnerReportSteps from "@uiSteps/PartnerReportSteps";
// import { test } from "@base-test";
// import Allure from "@allure";
// import ExcelUtil from "@utils/ExcelUtil";

// const SHEET = "PartnerReportTest";

// const testCases = [
//     "TC01_PartnerReportLoad",
//     "TC02_PartnerDateFilters",
//     "TC03_PartnerRefresh"
// ];

// for (const testCase of testCases) {

//     const data = ExcelUtil.getTestData(
//         SHEET,
//         testCase
//     );

//     test(
//         `${data.TestID} - ${data.Description}`,
//         async ({ page }) => {

//             Allure.attachDetails(
//                 data.Description,
//                 data.Issue
//             );

//             const home =
//                 new HomeSteps(page);

//             const partner =
//                 new PartnerReportSteps(page);

//             await home.launchApplication();

//             await home.login(
//                 data.UserName,
//                 data.Password,
//                 data.persona
//             );

//             await partner.openPartnerReport();

//             switch (data.TestID) {

//                 case "TC01_PartnerReportLoad":

//                     await partner.verifyPartnerReportLoaded();

//                     break;

//                 case "TC02_PartnerDateFilters":

//                     await partner.verifyDateFilters(
//                         data.FromDate,
//                         data.ToDate
//                     );

//                     break;

//                 case "TC03_PartnerRefresh":

//                     await partner.verifyRefreshButton();

//                     break;
//             }

//             await home.logout();
//         }
//     );
// }

import HomeSteps from "@uiSteps/HomeSteps";
import PartnerReportSteps from "@uiSteps/PartnerReportSteps";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "PartnerReportTest";

const testCases = [
    "TC01_PartnerReportLoad",
    "TC02_DateFilterValidation",
    "TC03_RefreshValidation",
    "TC04_PartnerDirectorySearchValidation",
    "TC05_PartnerDirectoryTypeFilterValidation",
    "TC06_PartnerDirectoryStatusFilterValidation"
];

for (const testCase of testCases) {

    const data = ExcelUtil.getTestData(
        SHEET,
        testCase
    );

    test(`${data.TestID} - ${data.Description} @regression`,

        async ({ page }) => {

            Allure.attachDetails(
                data.Description,
                data.Issue
            );

            const home =
                new HomeSteps(page);

            const partner =
                new PartnerReportSteps(page);

            await home.launchApplication();

            await home.login(
                data.UserName,
                data.Password,
                data.persona
            );

            await partner.openPartnerReport();

            switch (data.TestID) {

                case "TC01_PartnerReportLoad":

                    await partner.verifyPartnerReportLoaded();

                    break;

                case "TC02_DateFilterValidation":

                    await partner.verifyDateFilters(
                        data.FromDate,
                        data.ToDate
                    );

                    break;

                case "TC03_RefreshValidation":

                    await partner.verifyRefreshButton();

                    break;

                case "TC04_PartnerDirectorySearchValidation":

                    await partner.verifyPartnerDirectorySearch(
                        data.ValidSearch,
                        data.InvalidSearch
                    );

                    break;

                case "TC05_PartnerDirectoryTypeFilterValidation":

                    await partner.verifyPartnerTypeFilters();

                    break;

                case "TC06_PartnerDirectoryStatusFilterValidation":

                    await partner.verifyPartnerStatusFilters();

                    break;
            }

            await home.logout();
        }
    );
}