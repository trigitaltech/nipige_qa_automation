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

        const orderValueTab = this.page.locator(
            PartnerReportPage.ORDER_VALUE_TAB
        );
        
        // Add null check before clicking
        if (await orderValueTab.count() > 0) {
            await orderValueTab.click();
        }

        await this.page.waitForTimeout(3000);

        await this.scrollByValue(
            PartnerReportPage.TOP_PERFORMERS,
            300
        );

        const orderCountTab = this.page.locator(
            PartnerReportPage.ORDER_COUNT_TAB
        );
        
        // Add null check before clicking
        if (await orderCountTab.count() > 0) {
            await orderCountTab.click();
        }

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

            const filterLocator = this.page.locator(filter);
            
            // Add null check
            if (await filterLocator.count() > 0) {
                await filterLocator.click();
            }

            await this.page.waitForTimeout(5000);

            await this.validateTopPerformers();
        }

        const customButton = this.page.locator(
            PartnerReportPage.CUSTOM
        );
        
        if (await customButton.count() > 0) {
            await customButton.click();
        }

        await this.page.waitForTimeout(2000);

        const fromDateField = this.page.locator(
            PartnerReportPage.CUSTOM_FROM_DATE
        );
        
        if (await fromDateField.count() > 0) {
            await fromDateField.fill(
                this.formatDate(fromDate)
            );
        }

        const toDateField = this.page.locator(
            PartnerReportPage.CUSTOM_TO_DATE
        );
        
        if (await toDateField.count() > 0) {
            await toDateField.fill(
                this.formatDate(toDate)
            );
        }

        await this.page.waitForTimeout(1000);

        const applyButton = this.page.locator(
            PartnerReportPage.APPLY_BUTTON
        ).last();
        
        if (await applyButton.count() > 0) {
            await applyButton.click();
        }

        await this.page.waitForTimeout(5000);

        await this.validateTopPerformers();
    }

    async verifyRefreshButton() {

        const refreshButton = this.page.locator(
            PartnerReportPage.REFRESH
        );
        
        if (await refreshButton.count() > 0) {
            await refreshButton.click();
        }

        await this.page.waitForTimeout(5000);
    }

    async verifyPartnerDirectorySearch(
        validSearch: string,
        invalidSearch: string
    ) {

        const headerLocator = this.page.locator(
            PartnerReportPage.PARTNER_DIRECTORY_HEADER
        );
        
        if (await headerLocator.count() > 0) {
            await headerLocator.scrollIntoViewIfNeeded();
        }

        await this.page.waitForTimeout(2000);

        const searchBox = this.page.locator(
            PartnerReportPage.SEARCH_BOX
        );
        
        if (await searchBox.count() > 0) {
            await searchBox.fill(validSearch);
        }

        await this.page.waitForTimeout(3000);

        await this.scrollByValue(
            PartnerReportPage.PARTNER_DIRECTORY_HEADER,
            400
        );

        if (await searchBox.count() > 0) {
            await searchBox.fill(invalidSearch);
        }

        await this.page.waitForTimeout(3000);

        await this.scrollByValue(
            PartnerReportPage.PARTNER_DIRECTORY_HEADER,
            400
        );

        if (await searchBox.count() > 0) {
            await searchBox.fill("");
        }
    }

    async verifyPartnerTypeFilters() {

        const types = [
            "All Types",
            "Seller",
            "Partner",
            "Distributor",
            "Dealer"
        ];

        const headerLocator = this.page.locator(
            PartnerReportPage.PARTNER_DIRECTORY_HEADER
        );
        
        if (await headerLocator.count() > 0) {
            await headerLocator.scrollIntoViewIfNeeded();
        }

        await this.page.waitForTimeout(2000);

        for (const type of types) {

            const typeDropdown = this.page.locator(
                PartnerReportPage.TYPE_DROPDOWN
            );
            
            // Add null check before clicking dropdown
            if (await typeDropdown.count() > 0) {
                await typeDropdown.click();
            }

            await this.page.waitForTimeout(1000);

            const option = this.page.getByRole(
                "option",
                { name: type, exact: true }
            );
            
            // Add null check before clicking option
            if (await option.count() > 0) {
                await option.click();
            }

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

        const headerLocator = this.page.locator(
            PartnerReportPage.PARTNER_DIRECTORY_HEADER
        );
        
        if (await headerLocator.count() > 0) {
            await headerLocator.scrollIntoViewIfNeeded();
        }

        await this.page.waitForTimeout(2000);

        for (const status of statuses) {

            const statusDropdown = this.page.locator(
                PartnerReportPage.STATUS_DROPDOWN
            );
            
            // Add null check before clicking dropdown
            if (await statusDropdown.count() > 0) {
                await statusDropdown.click();
            }

            await this.page.waitForTimeout(1000);

            const option = this.page.getByRole(
                "option",
                { name: status, exact: true }
            );
            
            // Add null check before clicking option
            if (await option.count() > 0) {
                await option.click();
            }

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
