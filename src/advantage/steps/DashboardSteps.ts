import { Page } from "@playwright/test";

export default class DashboardSteps {

    constructor(private page: Page) {}

    async openDashboard() {

        await this.page.getByText(
            "Dashboard",
            { exact: true }
        ).click();

        await this.page.waitForTimeout(3000);
    }

    async verifyDashboardLoaded() {

        await this.page.waitForLoadState(
            "networkidle"
        );

        await this.page.locator(
            "text=Business Overview"
        ).waitFor({
            state: "visible",
            timeout: 30000
        });

        await this.page.waitForTimeout(3000);
    }

    async scrollDashboardPage() {

    await this.page.locator("main").evaluate(
        (el: any) => {
            el.scrollTop = el.scrollHeight;
        }
    );

    await this.page.waitForTimeout(2000);
}

async scrollDashboardToTop() {

    await this.page.locator("main").evaluate(
        (el: any) => {
            el.scrollTop = 0;
        }
    );

    await this.page.waitForTimeout(2000);
}

    async verifyDashboardFilters() {

        // Today
        await this.page.getByRole(
            "button",
            {
                name: "Today",
                exact: true
            }
        ).click();

        await this.page.waitForTimeout(2000);

        // 7 Days
        await this.page.getByRole(
            "button",
            {
                name: "7 days",
                exact: true
            }
        ).click();

        await this.page.waitForTimeout(2000);

        // 30 Days
        await this.page.getByRole(
            "button",
            {
                name: "30 days",
                exact: true
            }
        ).click();

        await this.page.waitForTimeout(3000);

        // Custom
        await this.page.getByRole(
            "button",
            {
                name: "Custom",
                exact: true
            }
        ).click();

        await this.page.waitForTimeout(2000);

        await this.page.locator(
            "#custom-date-from"
        ).fill("2026-01-01");

        await this.page.locator(
            "#custom-date-to"
        ).fill("2026-06-04");

        await this.page.waitForTimeout(2000);

        await this.page.getByRole(
            "button",
            {
                name: "Apply",
                exact: true
            }
        ).click();

        await this.page.waitForLoadState(
            "networkidle"
        );

        await this.page.waitForTimeout(3000);
    }

    async verifyOrderChartDropdown() {


        await this.page.locator(
            "text=Order Chart"
        ).scrollIntoViewIfNeeded();

        await this.page.waitForTimeout(3000);

        const dropdown = this.page.locator(
            "(//input[@role='combobox'])[1]"
        );

        // Today
        await dropdown.click();

        await this.page.waitForTimeout(2000);

        await this.page.getByText(
            "Today",
            { exact: true }
        ).last().click();

        await this.page.waitForTimeout(3000);

        // 7 Days
        await dropdown.click();

        await this.page.waitForTimeout(2000);

        await this.page.getByText(
            "7 days",
            { exact: true }
        ).last().click();

        await this.page.waitForTimeout(3000);

        // 30 Days
        await dropdown.click();

        await this.page.waitForTimeout(2000);

        await this.page.getByText(
            "30 days",
            { exact: true }
        ).last().click();

        await this.page.waitForTimeout(3000);

        // Custom
        await dropdown.click();

        await this.page.waitForTimeout(2000);

        await this.page.getByText(
            "Custom",
            { exact: true }
        ).last().click();

        await this.page.locator(
            "#custom-date-from"
        ).waitFor({
            state: "visible",
            timeout: 10000
        });

        await this.page.locator(
            "#custom-date-from"
        ).fill("2026-01-01");

        await this.page.locator(
            "#custom-date-to"
        ).fill("2026-06-04");

        await this.page.waitForTimeout(2000);

        await this.page.getByRole(
            "button",
            {
                name: "Apply",
                exact: true
            }
        ).click();

        await this.page.waitForLoadState(
            "networkidle"
        );

        await this.page.waitForTimeout(3000);

        await this.page.evaluate(() => {
            window.scrollTo(0, 0);
        });

        await this.page.waitForTimeout(2000);
    }

    async verifyTopRevenueDropdown() {
        await this.page.locator(
            "text=Top Revenue Category"
        ).scrollIntoViewIfNeeded();

        await this.page.waitForTimeout(3000);

        const dropdown = this.page.locator(
            "(//input[@role='combobox'])[2]"
        );

        // Today
        await dropdown.click();

        await this.page.getByText(
            "Today",
            { exact: true }
        ).last().click();

        await this.page.waitForTimeout(3000);

        // 7 Days
        await dropdown.click();

        await this.page.getByText(
            "7 days",
            { exact: true }
        ).last().click();

        await this.page.waitForTimeout(3000);

        // 30 Days
        await dropdown.click();

        await this.page.getByText(
            "30 days",
            { exact: true }
        ).last().click();

        await this.page.waitForTimeout(3000);

        // Custom
        await dropdown.click();

        await this.page.getByText(
            "Custom",
            { exact: true }
        ).last().click();

        await this.page.locator(
            "#custom-date-from"
        ).waitFor({
            state: "visible",
            timeout: 10000
        });

        await this.page.locator(
            "#custom-date-from"
        ).fill("2026-01-01");

        await this.page.locator(
            "#custom-date-to"
        ).fill("2026-06-04");

        await this.page.waitForTimeout(2000);

        await this.page.getByRole(
            "button",
            {
                name: "Apply",
                exact: true
            }
        ).click();

        await this.page.waitForLoadState(
            "networkidle"
        );

        await this.page.waitForTimeout(3000);

        await this.page.evaluate(() => {
            window.scrollTo(0, 0);
        });

        await this.page.waitForTimeout(3000);
    }
}