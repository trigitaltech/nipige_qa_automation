import { expect, Page } from "@playwright/test";
import OrderReportPage from "../pages/OrderReportPage";

export default class OrderReportSteps {

    constructor(private page: Page) {}

    async openOrderReport() {

        await this.page.locator(
            OrderReportPage.BI_ANALYTICS
        ).click();

        await this.page.waitForTimeout(2000);

        await this.page.locator(
            OrderReportPage.ORDER_REPORTS
        ).click();

        await this.page.waitForTimeout(5000);
    }

    async verifyOrderReportLoaded() {

        await expect(
            this.page.locator(
                OrderReportPage.PAGE_HEADER
            )
        ).toBeVisible();

        console.log(
            "Order Report Loaded Successfully"
        );
    }

    async verifyDateFilters() {

        const filters = [
            {
                locator: OrderReportPage.TODAY,
                name: "Today"
            },
            {
                locator: OrderReportPage.SEVEN_DAYS,
                name: "7 Days"
            },
            {
                locator: OrderReportPage.THIRTY_DAYS,
                name: "30 Days"
            },
            {
                locator: OrderReportPage.NINETY_DAYS,
                name: "90 Days"
            },
            {
                locator: OrderReportPage.YTD,
                name: "YTD"
            }
        ];

        for (const filter of filters) {

            await this.page.locator(
                filter.locator
            ).click();

            await this.page.waitForTimeout(3000);

            console.log(
                `Filter Applied: ${filter.name}`
            );
        }
    }

    async verifyRefreshButton() {

        await this.page.locator(
            OrderReportPage.REFRESH
        ).click();

        await this.page.waitForTimeout(5000);

        console.log(
            "Refresh Successful"
        );
    }

    private formatDate(
        dateValue: string | Date
    ): string {

        const date =
            new Date(dateValue);

        const year =
            date.getUTCFullYear();

        const month =
            String(
                date.getUTCMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getUTCDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    private async scrollDownAndUp(
        locator: string
    ) {

        await this.page.mouse.wheel(
            0,
            150
        );

        await this.page.waitForTimeout(1000);

        await this.page.mouse.wheel(
            0,
            -150
        );

        await this.page.waitForTimeout(1000);

        await this.page.locator(
            locator
        ).scrollIntoViewIfNeeded();

        await this.page.waitForTimeout(1000);
    }

    private async applyCustomDateRange(
        fromDate: string | Date,
        toDate: string | Date
    ) {

        await this.page.locator(
            OrderReportPage.CUSTOM_FROM_DATE
        ).fill(
            this.formatDate(fromDate)
        );

        await this.page.locator(
            OrderReportPage.CUSTOM_TO_DATE
        ).fill(
            this.formatDate(toDate)
        );

        await this.page.waitForTimeout(1000);

        await this.page.locator(
            OrderReportPage.APPLY_BUTTON
        ).last()
        .click();

        await this.page.waitForTimeout(5000);
    }

    async verifyOrderValueChartFilter(
        fromDate: string | Date,
        toDate: string | Date
    ) {

        await this.page.mouse.wheel(
            0,
            700
        );

        await this.page.waitForTimeout(3000);

        const dateFilters = [
            "Today",
            "7 days",
            "30 days",
            "Custom"
        ];

        for (const date of dateFilters) {

            await this.page.locator(
                OrderReportPage.ORDER_VALUE_DATE_FILTER
            ).click();

            await this.page.waitForTimeout(1000);

            if (date === "Custom") {

                await this.page
                    .getByRole(
                        "option",
                        { name: "Custom" }
                    )
                    .locator("button")
                    .click();

                await this.page.waitForTimeout(2000);

                await this.applyCustomDateRange(
                    fromDate,
                    toDate
                );

                console.log(
                    "Date Selected = Custom"
                );

                await this.scrollDownAndUp(
                    OrderReportPage.ORDER_VALUE_DATE_FILTER
                );

                continue;
            }

            await this.page
                .getByRole("option")
                .getByRole(
                    "button",
                    {
                        name: date,
                        exact: true
                    }
                )
                .click();

            await this.page.waitForTimeout(3000);

            console.log(
                `Date Selected = ${date}`
            );

            await this.scrollDownAndUp(
                OrderReportPage.ORDER_VALUE_DATE_FILTER
            );
        }
    }

    async verifyOrderStatusFilter(
        fromDate: string | Date,
        toDate: string | Date
    ) {

        const statuses = [
            "All Status",
            "Processing",
            "Delivered",
            "Created",
            "Out For Delivery"
        ];

        const dates = [
            "Today",
            "7 days",
            "30 days",
            "Custom"
        ];

        await this.page.locator(
            OrderReportPage.ORDER_STATUS_FILTER
        ).scrollIntoViewIfNeeded();

        await this.page.waitForTimeout(2000);

        for (const date of dates) {

            await this.page.locator(
                OrderReportPage.ORDER_STATUS_DATE_FILTER
            ).click();

            await this.page.waitForTimeout(1000);

            if (date === "Custom") {

                await this.page
                    .getByRole(
                        "button",
                        {
                            name: "Custom",
                            exact: true
                        }
                    )
                    .last()
                    .click();

                await this.page.waitForTimeout(2000);

                await this.applyCustomDateRange(
                    fromDate,
                    toDate
                );
            }
            else {

                await this.page
                    .getByRole(
                        "button",
                        {
                            name: date,
                            exact: true
                        }
                    )
                    .last()
                    .click();

                await this.page.waitForTimeout(3000);
            }

            console.log(
                `Date Selected = ${date}`
            );

            for (const status of statuses) {

                await this.page.locator(
                    OrderReportPage.ORDER_STATUS_FILTER
                ).click();

                await this.page.waitForTimeout(1000);

                await this.page
                    .getByRole(
                        "button",
                        {
                            name: status,
                            exact: true
                        }
                    )
                    .last()
                    .click();

                await this.page.waitForTimeout(3000);

                console.log(
                    `Status Selected = ${status}`
                );

                await this.scrollDownAndUp(
                    OrderReportPage.ORDER_STATUS_FILTER
                );
            }
        }
    }

    async verifyOrderBySalesChannelAndType() {

        await this.page.locator(
            OrderReportPage.ORDER_BY_SALES_CHANNEL
        ).scrollIntoViewIfNeeded();

        await this.page.waitForTimeout(2000);

        await expect(
            this.page.locator(
                OrderReportPage.ORDER_BY_SALES_CHANNEL
            )
        ).toBeVisible();

        console.log(
            "Order By Sales Channel Visible"
        );

        await expect(
            this.page.locator(
                OrderReportPage.ORDER_BY_TYPE
            )
        ).toBeVisible();

        console.log(
            "Order By Type Visible"
        );

        await this.page.waitForTimeout(2000);
    }

    async verifyOrderDetailFilters(
        searchName: string,
        searchOrderId: string,
        invalidSearch: string
    ) {

        const searches = [
            searchName,
            searchOrderId
        ];

        const statuses = [
            "All Status",
            "Created",
            "Payment Pending",
            "Fulfillment Pending",
            "Out For Delivery",
            "Partially Delivered",
            "Delivered"
        ];

        await this.page.locator(
            OrderReportPage.ORDER_DETAIL_HEADER
        ).scrollIntoViewIfNeeded();

        await this.page.waitForTimeout(2000);

        // Positive Search

        for (const searchText of searches) {

            await this.page.fill(
                OrderReportPage.SEARCH_BOX,
                searchText
            );

            await this.page.locator(
                OrderReportPage.ORDER_DETAIL_APPLY_BUTTON
            ).click();

            await this.page.waitForTimeout(3000);

            console.log(
                `Search Applied: ${searchText}`
            );

            await this.scrollDownAndUp(
                OrderReportPage.ORDER_DETAIL_HEADER
            );

            await this.page.fill(
                OrderReportPage.SEARCH_BOX,
                ""
            );

            await this.page.waitForTimeout(1000);
        }

        // Negative Search

        await this.page.fill(
            OrderReportPage.SEARCH_BOX,
            invalidSearch
        );

        await this.page.locator(
            OrderReportPage.ORDER_DETAIL_APPLY_BUTTON
        ).click();

        await this.page.waitForTimeout(3000);

        console.log(
            `Negative Search Applied: ${invalidSearch}`
        );

        await this.scrollDownAndUp(
            OrderReportPage.ORDER_DETAIL_HEADER
        );

        await this.page.fill(
            OrderReportPage.SEARCH_BOX,
            ""
        );

        await this.page.locator(
            OrderReportPage.ORDER_DETAIL_APPLY_BUTTON
        ).click();

        await this.page.waitForTimeout(1000);

        // Status Filter

        for (const status of statuses) {

            await this.page.selectOption(
                OrderReportPage.STATUS_FILTER,
                { label: status }
            );

            await this.page.locator(
                OrderReportPage.ORDER_DETAIL_APPLY_BUTTON
            ).click();

            await this.page.waitForTimeout(3000);

            console.log(
                `Status Filter Applied: ${status}`
            );

            await this.scrollDownAndUp(
                OrderReportPage.ORDER_DETAIL_HEADER
            );
        }

        // Reset Status

        await this.page.selectOption(
            OrderReportPage.STATUS_FILTER,
            { label: "All Status" }
        );

        await this.page.locator(
            OrderReportPage.ORDER_DETAIL_APPLY_BUTTON
        ).click();

        await this.page.waitForTimeout(1000);
    }
}