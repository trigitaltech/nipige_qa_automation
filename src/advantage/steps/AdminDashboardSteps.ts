import { expect, Page } from "@playwright/test";
import AdminDashboardPage from "../pages/AdminDashboardPage";

export default class AdminDashboardSteps {

    constructor(private page: Page) {}

    async openDashboard() {

        await this.page.locator(
            AdminDashboardPage.DASHBOARD_MENU
        ).click();

        await this.page.waitForLoadState(
            "networkidle"
        );
        await this.page.waitForTimeout(2000);
    }

    async verifyDashboardLoaded() {

        await expect(
            this.page.locator(
                AdminDashboardPage.PAGE_HEADER
            )
        ).toBeVisible();
        await this.page.waitForTimeout(2000);
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

async verifyDashboardFilters(
    fromDate: string | Date,
    toDate: string | Date
) {

    // Today
    await this.page.locator(
        AdminDashboardPage.TODAY_BUTTON
    ).click();

    await this.page.waitForTimeout(1000);

    // 7 Days
    await this.page.locator(
        AdminDashboardPage.SEVEN_DAYS_BUTTON
    ).click();

    await this.page.waitForTimeout(2000);

    // 30 Days
    await this.page.locator(
        AdminDashboardPage.THIRTY_DAYS_BUTTON
    ).click();

    await this.page.waitForTimeout(2000);

    // Custom
    await this.page.locator(
        AdminDashboardPage.CUSTOM_BUTTON
    ).click();
    await this.page.waitForTimeout(2000);

    const from =
        this.formatDate(fromDate);

    const to =
        this.formatDate(toDate);

    await expect(
        this.page.locator(
            AdminDashboardPage.CUSTOM_DATE_DIALOG
        )
    ).toBeVisible();
    await this.page.waitForTimeout(2000);

    await this.page.locator(
        AdminDashboardPage.FROM_DATE
    ).fill(from);
    await this.page.waitForTimeout(2000);

    await this.page.locator(
        AdminDashboardPage.TO_DATE
    ).fill(to);
    await this.page.waitForTimeout(2000);

    await this.page.locator(
        AdminDashboardPage.APPLY_BUTTON
    ).click();
    await this.page.waitForTimeout(2000);

    await this.page.waitForLoadState(
        "networkidle"
    );

    await this.page.waitForTimeout(2000);
}
    
// =============================
async scrollDashboardPage() {

    await this.page.locator("main").evaluate(
        (element) => {
            element.scrollTop =
                element.scrollHeight;
        }
    );

    await this.page.waitForTimeout(2000);
}

async verifyOrderChartDropdown(
    fromDate: string | Date,
    toDate: string | Date
) {

    // Today
    await this.page.locator(
        AdminDashboardPage.ORDER_CHART_DATE_FILTER
    ).click();

    await this.page.locator(
        AdminDashboardPage.TODAY_OPTION
    ).last().click();

    await this.page.waitForTimeout(1000);

    // 7 Days
    await this.page.locator(
        AdminDashboardPage.ORDER_CHART_DATE_FILTER
    ).click();

    await this.page.locator(
        AdminDashboardPage.SEVEN_DAYS_OPTION
    ).last().click();

    await this.page.waitForTimeout(1000);

    // 30 Days
    await this.page.locator(
        AdminDashboardPage.ORDER_CHART_DATE_FILTER
    ).click();

    await this.page.locator(
        AdminDashboardPage.THIRTY_DAYS_OPTION
    ).last().click();

    await this.page.waitForTimeout(1000);

    // Custom
    await this.page.locator(
        AdminDashboardPage.ORDER_CHART_DATE_FILTER
    ).click();

    await this.page.locator(
        AdminDashboardPage.CUSTOM_OPTION
    ).last().click();

    await expect(
        this.page.locator(
            AdminDashboardPage.CUSTOM_DATE_DIALOG
        )
    ).toBeVisible();

    const from = this.formatDate(fromDate);
    const to = this.formatDate(toDate);

    await this.page.locator(
        AdminDashboardPage.FROM_DATE
    ).fill(from);

    await this.page.locator(
        AdminDashboardPage.TO_DATE
    ).fill(to);

    await this.page.locator(
        AdminDashboardPage.APPLY_BUTTON
    ).click();

    await this.page.waitForTimeout(2000);
}

async verifyTopRevenueDropdown(
    fromDate: string | Date,
    toDate: string | Date
) {

    // Today
    await this.page.locator(
        AdminDashboardPage.TOP_REVENUE_DATE_FILTER
    ).click();

    await this.page.locator(
        AdminDashboardPage.TODAY_OPTION
    ).last().click();

    await this.page.waitForTimeout(1000);

    // 7 Days
    await this.page.locator(
        AdminDashboardPage.TOP_REVENUE_DATE_FILTER
    ).click();

    await this.page.locator(
        AdminDashboardPage.SEVEN_DAYS_OPTION
    ).last().click();

    await this.page.waitForTimeout(1000);

    // 30 Days
    await this.page.locator(
        AdminDashboardPage.TOP_REVENUE_DATE_FILTER
    ).click();

    await this.page.locator(
        AdminDashboardPage.THIRTY_DAYS_OPTION
    ).last().click();

    await this.page.waitForTimeout(1000);

    // Custom
    await this.page.locator(
        AdminDashboardPage.TOP_REVENUE_DATE_FILTER
    ).click();

    await this.page.locator(
        AdminDashboardPage.CUSTOM_OPTION
    ).last().click();

    await expect(
        this.page.locator(
            AdminDashboardPage.CUSTOM_DATE_DIALOG
        )
    ).toBeVisible();

    const from = this.formatDate(fromDate);
    const to = this.formatDate(toDate);

    await this.page.locator(
        AdminDashboardPage.FROM_DATE
    ).fill(from);

    await this.page.locator(
        AdminDashboardPage.TO_DATE
    ).fill(to);

    await this.page.locator(
        AdminDashboardPage.APPLY_BUTTON
    ).click();

    await this.page.waitForTimeout(2000);
}}