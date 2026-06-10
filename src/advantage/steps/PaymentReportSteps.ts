import { Page } from "@playwright/test";
import PaymentReportPage from "../pages/PaymentReportPage";

export default class PaymentReportSteps {

    constructor(private page: Page) {}

    async openPaymentReport() {

        await this.page.locator(
            PaymentReportPage.BI_ANALYTICS
        ).scrollIntoViewIfNeeded();

        await this.page.waitForTimeout(2000);

        await this.page.locator(
            PaymentReportPage.BI_ANALYTICS
        ).click();

        await this.page.waitForTimeout(2000);

        await this.page.locator(
    PaymentReportPage.PAYMENT_REPORTS
).click();

        await this.page.waitForTimeout(5000);
    }

    async verifyPaymentReportLoaded() {

        await this.page.locator(
            PaymentReportPage.TODAY
        ).waitFor({
            state: "visible",
            timeout: 10000
        });

        await this.page.locator(
            PaymentReportPage.SEVEN_DAYS
        ).waitFor({
            state: "visible"
        });

        await this.page.locator(
            PaymentReportPage.THIRTY_DAYS
        ).waitFor({
            state: "visible"
        });

        await this.page.locator(
            PaymentReportPage.NINETY_DAYS
        ).waitFor({
            state: "visible"
        });

        await this.page.locator(
            PaymentReportPage.YTD
        ).waitFor({
            state: "visible"
        });

        console.log(
            "Payment Report Loaded Successfully"
        );
    }

    async verifyDateFilters() {

        const filters = [
            PaymentReportPage.TODAY,
            PaymentReportPage.SEVEN_DAYS,
            PaymentReportPage.THIRTY_DAYS,
            PaymentReportPage.NINETY_DAYS,
            PaymentReportPage.YTD
        ];

        for (const filter of filters) {

            await this.page.locator(
                filter
            ).click();

            await this.page.waitForTimeout(
                3000
            );

            console.log(
                `Filter Applied: ${filter}`
            );
        }
    }

    async verifyRefreshButton() {

        await this.page.locator(
            PaymentReportPage.REFRESH
        ).click();

        await this.page.waitForTimeout(
            5000
        );

        console.log(
            "Refresh Successful"
        );
    }


async verifyCollectionTrendFilters(
    fromDate: any,
    toDate: any
) {

    await this.verifyCollectionTrendToday();

    await this.verifyCollectionTrend7Days();

    await this.verifyCollectionTrend30Days();

    await this.verifyCollectionTrendCustom(
        fromDate,
        toDate
    );
}

async verifyCollectionTrendToday() {

    await this.selectCollectionDate(
        "Today"
    );

    await this.verifyCollectionStatuses();
}

async verifyCollectionTrend7Days() {

    await this.selectCollectionDate(
        "7 days"
    );

    await this.verifyCollectionStatuses();
}

async verifyCollectionTrend30Days() {

    await this.selectCollectionDate(
        "30 days"
    );

    await this.verifyCollectionStatuses();
}

async verifyCollectionTrendCustom(
    fromDate: any,
    toDate: any
) {

    await this.selectCollectionDate(
        "Custom",
        fromDate,
        toDate
    );

    await this.verifyCollectionStatuses();
}

private async selectCollectionDate(
    date: string,
    fromDate?: any,
    toDate?: any
) {

    await this.page.locator(
        PaymentReportPage.COLLECTION_DATE
    ).scrollIntoViewIfNeeded();

    await this.page.waitForTimeout(1000);

    await this.page.locator(
        PaymentReportPage.COLLECTION_DATE
    ).click();

    await this.page.waitForTimeout(1000);

    if (date === "Custom") {

        await this.page.getByRole(
            "button",
            {
                name: "Custom",
                exact: true
            }
        ).click();

        await this.page.waitForTimeout(2000);

        const from =
            new Date(fromDate)
                .toISOString()
                .split("T")[0];

        const to =
            new Date(toDate)
                .toISOString()
                .split("T")[0];

        console.log(
            `From Date = ${from}`
        );

        console.log(
            `To Date = ${to}`
        );

        await this.page.locator(
            PaymentReportPage.CUSTOM_FROM_DATE
        ).fill(from);

        await this.page.locator(
            PaymentReportPage.CUSTOM_TO_DATE
        ).fill(to);

        await this.page.waitForTimeout(1000);

        await this.page.locator(
            PaymentReportPage.APPLY_BUTTON
        ).click();

        await this.page.waitForTimeout(5000);

        console.log(
            `Custom Date Applied = ${from} To ${to}`
        );

        return;
    }

    await this.page.getByRole(
        "button",
        {
            name: date,
            exact: true
        }
    ).last().click();

    await this.page.waitForTimeout(3000);

    console.log(
        `Date Selected = ${date}`
    );
}

private async verifyCollectionStatuses() {

    const statuses = [
        "All Status",
        "Collected",
        "Pending",
        "Cancelled",
        "Refunded"
    ];

    for (const status of statuses) {

        await this.page.locator(
            PaymentReportPage.COLLECTION_STATUS
        ).click();

        await this.page.waitForTimeout(1000);

        await this.page.getByRole(
            "button",
            {
                name: status,
                exact: true
            }
        ).click();

        await this.page.waitForTimeout(3000);

        console.log(
            `Status Selected = ${status}`
        );

        // Scroll Down

        await this.page.mouse.wheel(
            0,
            2500
        );

        await this.page.waitForTimeout(2000);

        // Scroll Up

        await this.page.mouse.wheel(
            0,
            -2500
        );

        await this.page.waitForTimeout(2000);

        await this.page.locator(
            PaymentReportPage.COLLECTION_STATUS
        ).scrollIntoViewIfNeeded();

        await this.page.waitForTimeout(1000);
    }
}}