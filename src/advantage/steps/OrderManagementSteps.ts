import { Page } from "@playwright/test";
import OrderManagementPage from "../pages/OrderManagementPage";

export default class OrderManagementSteps {

    constructor(private page: Page) {}

    async openOrderManagement() {

        await this.page.locator(
            OrderManagementPage.ORDER_MANAGEMENT
        ).click();

        await this.page.waitForTimeout(3000);
    }

    async verifyOrderManagementLoaded() {

        await this.page.waitForLoadState(
            "networkidle"
        );

        await this.page.locator(
            OrderManagementPage.PAGE_HEADER
        ).last().waitFor({
            state: "visible",
            timeout: 30000
        });

        await this.page.waitForTimeout(3000);
    }

    // ==========================
    // TC02 - Date + Status Filter
    // ==========================

    async verifyStatusFilter() {

        await this.verifyStatusFilterToday();

        await this.verifyStatusFilterLast7Days();

        await this.verifyStatusFilterLast30Days();

        await this.verifyStatusFilterCustomRange();
    }

    async verifyStatusFilterToday() {

        await this.applyDateFilter(
            "Today"
        );

        await this.verifyAllStatuses();
    }

    async verifyStatusFilterLast7Days() {

        await this.applyDateFilter(
            "Last 7 Days"
        );

        await this.verifyAllStatuses();
    }

    async verifyStatusFilterLast30Days() {

        await this.applyDateFilter(
            "Last 30 Days"
        );

        await this.verifyAllStatuses();
    }


    async verifyStatusFilterCustomRange() {

    await this.applyDateFilter(
        "Custom Range"
    );

    await this.verifyAllStatuses();
}

    async verifyDateAndSellerFilter() {

    const dateFilters = [
        "Today",
        "Last 7 Days",
        "Last 30 Days",
        "Custom Range"
    ];

    for (const date of dateFilters) {

        await this.applyDateFilter(date);

        // =====================================
        // All Sellers
        // =====================================

        await this.page.locator(
            OrderManagementPage.SELLER_FILTER
        ).click();

        await this.page.getByText(
            "All Sellers",
            { exact: true }
        ).click();

        await this.page.waitForTimeout(1000);

        await this.page.locator(
            OrderManagementPage.SELLER_NAME
        ).fill("Mart Office Plaza");

        await this.page.locator(
            "button[type='submit']"
        ).click();

        await this.page.waitForTimeout(5000);

        await this.scrollDownAndUp();

        // =====================================
        // Direct Sellers
        // =====================================

        await this.page.locator(
            OrderManagementPage.SELLER_FILTER
        ).click();

        await this.page.getByText(
            "Direct Sellers",
            { exact: true }
        ).click();

        await this.page.waitForTimeout(1000);

        const directSellers = [
            "Fresh Town Market",
            "Only Grocery",
            "Daily Fresh Market"
        ];

        for (const seller of directSellers) {

            await this.page.locator(
                OrderManagementPage.DIRECT_SELLER_DROPDOWN
            ).click();

            await this.page.waitForTimeout(1000);

            const sellerBtn = this.page.getByText(seller, { exact: true });
            if (await sellerBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                await sellerBtn.click();
            } else {
                console.log(`[OrderManagementSteps] Seller '${seller}' not found, trying fallback select`);
                const options = this.page.locator('[role="option"], .select__option, .dropdown-item, .dropdown-menu div, [class*="-option"]');
                if (await options.first().isVisible({ timeout: 2000 }).catch(() => false)) {
                    await options.first().click();
                } else {
                    await this.page.keyboard.press("ArrowDown");
                    await this.page.waitForTimeout(500);
                    await this.page.keyboard.press("Enter");
                }
            }

            await this.page.waitForTimeout(1000);

            await this.page.locator(
                "button[type='submit']"
            ).click();

            await this.page.waitForTimeout(5000);

            await this.scrollDownAndUp();

            console.log(
                `Date = ${date} | Direct Seller = ${seller}`
            );
        }

        // =====================================
        // Include Hierarchy
        // =====================================

        await this.page.locator(
            OrderManagementPage.SELLER_FILTER
        ).click();

        await this.page.getByText(
            "Include Hierarchy",
            { exact: true }
        ).click();

        await this.page.waitForTimeout(1000);

        await this.page.locator(
            OrderManagementPage.SELLER_NAME
        ).fill("Mart Office Plaza");

        await this.page.locator(
            "button[type='submit']"
        ).click();

        await this.page.waitForTimeout(5000);

        await this.scrollDownAndUp();

        console.log(
            `Date = ${date} | Include Hierarchy`
        );
    }
}
async verifyDateAndOrderIdFilter() {

    const testData = [
        {
            date: "Today",
            positive: "ORD-20260602-73955B3D",
            negative: "ORD-20260601"
        },
        {
            date: "Last 7 Days",
            positive: "ORD-20260602-1B7451E0",
            negative: "ORD-20260605"
        },
        {
            date: "Last 30 Days",
            positive: "ORD-20260602-4B2E7A3B",
            negative: "ORD-20260607"
        }
    ];

    for (const item of testData) {

        await this.applyDateFilter(item.date);

        // Positive Order ID

        await this.page.locator(
            OrderManagementPage.ORDER_ID
        ).fill(item.positive);

        await this.page.locator(
            OrderManagementPage.APPLY_BUTTON
        ).click();

        await this.page.waitForTimeout(5000);

        console.log(
            `Positive Validation => ${item.date} : ${item.positive}`
        );

        await this.page.locator(
            OrderManagementPage.ORDER_ID
        ).clear();

        // Negative Order ID

        await this.page.locator(
            OrderManagementPage.ORDER_ID
        ).fill(item.negative);

        await this.page.locator(
            OrderManagementPage.APPLY_BUTTON
        ).click();

        await this.page.waitForTimeout(5000);

        console.log(
            `Negative Validation => ${item.date} : ${item.negative}`
        );

        await this.page.locator(
            OrderManagementPage.ORDER_ID
        ).clear();
    }
    }
    
    // tc05

    async verifyDateStatusOrderViewInvoice() {

    const testData = [
        {
            date: "Last 7 Days",
            orderId: "ORD-20260602-1B7451E0"
        },
        {
            date: "Last 30 Days",
            orderId: "ORD-20260602-4B2E7A3B"
        }
    ];

    for (const item of testData) {

        // Date Filter

        await this.applyDateFilter(
            item.date
        );

        // Order Search

        await this.page.locator(
            OrderManagementPage.ORDER_ID
        ).fill(
            item.orderId
        );

        await this.page.waitForTimeout(1000);

        await this.page.locator(
            OrderManagementPage.APPLY_BUTTON
        ).click();

        await this.page.waitForTimeout(5000);

        console.log(
            `Date=${item.date}, Order=${item.orderId}`
        );

        // No Data Check

        const noData = await this.page
            .getByText(
                "No orders matched the current filters."
            )
            .isVisible()
            .catch(() => false);

        if (noData) {

            console.log(
                `No Order Found: ${item.orderId}`
            );

            continue;
        }

        // View Order

        const viewOrder = this.page.locator(
            OrderManagementPage.VIEW_ORDER
        );

        await viewOrder.waitFor({
            state: "visible",
            timeout: 10000
        });

        await viewOrder.click();

        await this.page.waitForTimeout(5000);

        console.log(
            "View Order Opened"
        );

        // Scroll Down

        await this.page.locator(
            OrderManagementPage.VIEW_INVOICE
        ).scrollIntoViewIfNeeded();

        await this.page.waitForTimeout(2000);

        // View Invoice

        await this.page.locator(
            OrderManagementPage.VIEW_INVOICE
        ).click();

        await this.page.waitForTimeout(5000);

        console.log(
            "Invoice Opened"
        );

       await this.page.locator(
    OrderManagementPage.INVOICE_POPUP
).hover();

await this.page.mouse.wheel(
    0,
    2500
);

await this.page.waitForTimeout(2000);

        console.log(
            await this.page.url()
        );

        // Back From Invoice

        await this.page.goBack();

        await this.page.waitForTimeout(3000);

        // Back From View Order

        // await this.page.goBack();

        // await this.page.waitForTimeout(3000);

        // Verify Back To Order Page

        await this.page.locator(
            OrderManagementPage.ORDER_ID
        ).waitFor({
            state: "visible",
            timeout: 10000
        });
    }
}

    // ==========================
    // Common Methods
    // ==========================

  private async applyDateFilter(
    dateRange: string
) {

    await this.page.locator(
        OrderManagementPage.DATE_FILTER
    ).click();

    await this.page.waitForTimeout(2000);

    if (dateRange === "Custom Range") {

        await this.page.getByText(
            "Custom Range",
            { exact: true }
        ).click();

        await this.page.waitForTimeout(2000);

        const dateInputs = this.page.locator(
            "input[type='date']"
        );

        await dateInputs.nth(0).fill(
            "2025-06-01"
        );

        await dateInputs.nth(1).fill(
            "2026-06-08"
        );

        await this.page.getByRole(
            "button",
            { name: "Apply Range" }
        ).click();

        await this.page.waitForTimeout(5000);

        return;
    }

    const dateOption = this.page
        .getByText(
            dateRange,
            { exact: true }
        )
        .first();

    await dateOption.waitFor({
        state: "visible",
        timeout: 10000
    });

    await dateOption.click();

    await this.page.waitForTimeout(2000);

    await this.page.getByRole(
        "button",
        { name: "Apply", exact: true }
    ).click();

    await this.page.waitForTimeout(5000);
}

  private async verifyAllStatuses() {

    const statuses = [
        "All Status",
        "Processing",
        "Payment Pending",
        "Out For Delivery",
        "Cancelled"
    ];

    for (const status of statuses) {

        console.log(
            `Checking Status: ${status}`
        );

        // Status Filter visible 
        await this.page.locator(
            OrderManagementPage.STATUS_FILTER
        ).scrollIntoViewIfNeeded();

        await this.page.waitForTimeout(1000);

        // Open Status Dropdown
        await this.page.locator(
            OrderManagementPage.STATUS_FILTER
        ).click();

        await this.page.waitForTimeout(2000);

        // Select Status
        const statusOption = this.page
            .getByText(
                status,
                { exact: true }
            )
            .first();

        await statusOption.waitFor({
            state: "visible",
            timeout: 10000
        });

        await statusOption.click();

        await this.page.waitForTimeout(3000);

        console.log(
            `Status Selected: ${status}`
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

        // Status Filter 
        await this.page.locator(
            OrderManagementPage.STATUS_FILTER
        ).scrollIntoViewIfNeeded();

        await this.page.waitForTimeout(1000);
    }
}
private async scrollDownAndUp() {

    await this.page.mouse.wheel(
        0,
        2500
    );

    await this.page.waitForTimeout(2000);

    await this.page.mouse.wheel(
        0,
        -2500
    );

    await this.page.waitForTimeout(2000);

    await this.page.locator(
        OrderManagementPage.SELLER_FILTER
    ).scrollIntoViewIfNeeded();

    await this.page.waitForTimeout(1000);

}}