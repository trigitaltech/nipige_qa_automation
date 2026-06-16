// import { expect, Page } from "@playwright/test";
// import PartnerReportPage from "../pages/PartnerReportPage";

// export default class PartnerReportSteps {

//     constructor(private page: Page) {}

//     async openPartnerReport() {

//         await this.page.locator(
//             PartnerReportPage.BI_ANALYTICS
//         ).click();

//         await this.page.waitForTimeout(2000);

//         await this.page.locator(
//             PartnerReportPage.PARTNER_REPORTS
//         ).click();

//         await this.page.waitForTimeout(5000);
//     }

//     async verifyPartnerReportLoaded() {

//         await expect(
//             this.page.locator(
//                 PartnerReportPage.PAGE_HEADER
//             )
//         ).toBeVisible();

//         console.log(
//             "Partner Report Loaded Successfully"
//         );
//     }

//     private formatDate(
//         dateValue: any
//     ): string {

//         const date =
//             new Date(dateValue);

//         const year =
//             date.getUTCFullYear();

//         const month =
//             String(
//                 date.getUTCMonth() + 1
//             ).padStart(2, "0");

//         const day =
//             String(
//                 date.getUTCDate()
//             ).padStart(2, "0");

//         return `${year}-${month}-${day}`;
//     }

//     private async scrollDownAndUp(
//         locator: string
//     ) {

//         await this.page.mouse.wheel(
//             0,
//             300
//         );

//         await this.page.waitForTimeout(1500);

//         await this.page.mouse.wheel(
//             0,
//             -300
//         );

//         await this.page.waitForTimeout(1500);

//         await this.page.locator(
//             locator
//         ).scrollIntoViewIfNeeded();

//         await this.page.waitForTimeout(1000);
//     }

//     private async validateTopPerformers() {

//         await this.page.locator(
//             PartnerReportPage.TOP_PERFORMERS
//         ).scrollIntoViewIfNeeded();

//         await this.page.waitForTimeout(3000);

//         await this.page.locator(
//             PartnerReportPage.ORDER_VALUE_TAB
//         ).click();

//         console.log(
//             "Order Value Selected"
//         );

//         await this.page.waitForTimeout(3000);

//         await this.scrollDownAndUp(
//             PartnerReportPage.TOP_PERFORMERS
//         );

//         await this.page.locator(
//             PartnerReportPage.ORDER_COUNT_TAB
//         ).click();

//         console.log(
//             "Order Count Selected"
//         );

//         await this.page.waitForTimeout(3000);

//         await this.scrollDownAndUp(
//             PartnerReportPage.TOP_PERFORMERS
//         );
//     }

//     async verifyDateFilters(
//         fromDate: any,
//         toDate: any
//     ) {

//         const filters = [
//             PartnerReportPage.TODAY,
//             PartnerReportPage.SEVEN_DAYS,
//             PartnerReportPage.THIRTY_DAYS,
//             PartnerReportPage.NINETY_DAYS,
//             PartnerReportPage.YTD
//         ];

//         for (const filter of filters) {

//             await this.page.locator(
//                 filter
//             ).click();

//             await this.page.waitForTimeout(5000);

//             console.log(
//                 `Filter Applied: ${filter}`
//             );

//             await this.validateTopPerformers();
//         }

//         // Custom Filter

//         await this.page.locator(
//             PartnerReportPage.CUSTOM
//         ).click();

//         await this.page.waitForTimeout(2000);

//         await this.page.locator(
//             PartnerReportPage.CUSTOM_FROM_DATE
//         ).fill(
//             this.formatDate(fromDate)
//         );

//         await this.page.locator(
//             PartnerReportPage.CUSTOM_TO_DATE
//         ).fill(
//             this.formatDate(toDate)
//         );

//         await this.page.waitForTimeout(1000);

//         await this.page.locator(
//             PartnerReportPage.APPLY_BUTTON
//         ).last()
//         .click();

//         await this.page.waitForTimeout(5000);

//         console.log(
//             "Custom Filter Applied"
//         );

//         await this.validateTopPerformers();
//     }

//     async verifyRefreshButton() {

//         await this.page.locator(
//             PartnerReportPage.REFRESH
//         ).click();

//         await this.page.waitForTimeout(5000);

//         console.log(
//             "Refresh Successful"
//         );
//     }
// }


import { expect, Page } from "@playwright/test";
import PartnerReportPage from "../pages/PartnerReportPage";

export default class PartnerReportSteps {

    constructor(private page: Page) {}

    async openPartnerReport() {

        await this.page.locator(
            PartnerReportPage.BI_ANALYTICS
        ).click();

        await this.page.waitForTimeout(2000);

        await this.page.locator(
            PartnerReportPage.PARTNER_REPORTS
        ).click();

        await this.page.waitForTimeout(5000);
    }

    async verifyPartnerReportLoaded() {

        await expect(
            this.page.locator(
                PartnerReportPage.PAGE_HEADER
            )
        ).toBeVisible();

        console.log(
            "Partner Report Loaded Successfully"
        );
    }

    private formatDate(
        dateValue: any
    ): string {

        const date = new Date(dateValue);

        const year =
            date.getUTCFullYear();

        const month =
            String(date.getUTCMonth() + 1)
                .padStart(2, "0");

        const day =
            String(date.getUTCDate())
                .padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    private async scrollByValue(
        locator: string,
        pixels: number
    ) {

        await this.page.mouse.wheel(
            0,
            pixels
        );

        await this.page.waitForTimeout(1000);

        await this.page.mouse.wheel(
            0,
            -pixels
        );

        await this.page.waitForTimeout(1000);

        await this.page.locator(
            locator
        ).scrollIntoViewIfNeeded();

        await this.page.waitForTimeout(1000);
    }

    private async validateTopPerformers() {

        await this.page.locator(
            PartnerReportPage.TOP_PERFORMERS
        ).scrollIntoViewIfNeeded();

        await this.page.waitForTimeout(2000);

        await this.page.locator(
            PartnerReportPage.ORDER_VALUE_TAB
        ).click();

        await this.page.waitForTimeout(3000);

        await this.scrollByValue(
            PartnerReportPage.TOP_PERFORMERS,
            300
        );

        await this.page.locator(
            PartnerReportPage.ORDER_COUNT_TAB
        ).click();

        await this.page.waitForTimeout(3000);

        await this.scrollByValue(
            PartnerReportPage.TOP_PERFORMERS,
            300
        );
    }

    async verifyDateFilters(
        fromDate: any,
        toDate: any
    ) {

        const filters = [
            PartnerReportPage.TODAY,
            PartnerReportPage.SEVEN_DAYS,
            PartnerReportPage.THIRTY_DAYS,
            PartnerReportPage.NINETY_DAYS,
            PartnerReportPage.YTD
        ];

        for (const filter of filters) {

            await this.page.locator(
                filter
            ).click();

            await this.page.waitForTimeout(5000);

            await this.validateTopPerformers();
        }

        await this.page.locator(
            PartnerReportPage.CUSTOM
        ).click();

        await this.page.waitForTimeout(2000);

        await this.page.locator(
            PartnerReportPage.CUSTOM_FROM_DATE
        ).fill(
            this.formatDate(fromDate)
        );

        await this.page.locator(
            PartnerReportPage.CUSTOM_TO_DATE
        ).fill(
            this.formatDate(toDate)
        );

        await this.page.waitForTimeout(1000);

        await this.page.locator(
            PartnerReportPage.APPLY_BUTTON
        ).last()
        .click();

        await this.page.waitForTimeout(5000);

        await this.validateTopPerformers();
    }

    async verifyRefreshButton() {

        await this.page.locator(
            PartnerReportPage.REFRESH
        ).click();

        await this.page.waitForTimeout(5000);
    }

    async verifyPartnerDirectorySearch(
        validSearch: string,
        invalidSearch: string
    ) {

        await this.page.locator(
            PartnerReportPage.PARTNER_DIRECTORY_HEADER
        ).scrollIntoViewIfNeeded();

        await this.page.waitForTimeout(2000);

        await this.page.fill(
            PartnerReportPage.SEARCH_BOX,
            validSearch
        );

        await this.page.waitForTimeout(3000);

        await this.scrollByValue(
            PartnerReportPage.PARTNER_DIRECTORY_HEADER,
            400
        );

        await this.page.fill(
            PartnerReportPage.SEARCH_BOX,
            invalidSearch
        );

        await this.page.waitForTimeout(3000);

        await this.scrollByValue(
            PartnerReportPage.PARTNER_DIRECTORY_HEADER,
            400
        );

        await this.page.fill(
            PartnerReportPage.SEARCH_BOX,
            ""
        );
    }

    async verifyPartnerTypeFilters() {

    const types = [
        "All Types",
        "Seller",
        "Partner",
        "Distributor",
        "Dealer"
    ];

    await this.page.locator(
        PartnerReportPage.PARTNER_DIRECTORY_HEADER
    ).scrollIntoViewIfNeeded();

    await this.page.waitForTimeout(2000);

    for (const type of types) {

        await this.page.locator(
            PartnerReportPage.TYPE_DROPDOWN
        ).click();

        await this.page.waitForTimeout(1000);

        await this.page.getByRole(
            "option",
            { name: type, exact: true }
        ).click();

        await this.page.waitForTimeout(3000);

        console.log(
            `Type Filter Applied: ${type}`
        );

        await this.scrollByValue(
            PartnerReportPage.TYPE_DROPDOWN,
            500
        );
    }
}

   async verifyPartnerStatusFilters() {

    const statuses = [
        "All Status",
        "Active",
        "Inactive"
    ];

    await this.page.locator(
        PartnerReportPage.PARTNER_DIRECTORY_HEADER
    ).scrollIntoViewIfNeeded();

    await this.page.waitForTimeout(2000);

    for (const status of statuses) {

        await this.page.locator(
            PartnerReportPage.STATUS_DROPDOWN
        ).click();

        await this.page.waitForTimeout(1000);

        await this.page.getByRole(
            "option",
            { name: status, exact: true }
        ).click();

        await this.page.waitForTimeout(3000);

        console.log(
            `Status Filter Applied: ${status}`
        );

        await this.scrollByValue(
            PartnerReportPage.STATUS_DROPDOWN,
            600
        );
    }
}
}