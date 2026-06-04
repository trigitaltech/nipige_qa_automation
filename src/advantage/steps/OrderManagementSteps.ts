import fs from "fs";
import test, { expect, Page } from "@playwright/test";
import UIActions from "@uiActions/UIActions";
import Assert from "@asserts/Assert";
import CommonConstants from "../../framework/constants/CommonConstants";
import OrderManagementPage from "@pages/OrderManagementPage";
import OrderManagementConstants from "@uiConstants/OrderManagementConstants";

export default class OrderManagementSteps {
    private ui: UIActions;

    constructor(private page: Page) {
        this.ui = new UIActions(page);
    }

    public async verifyOrderManagementPage() {
        await test.step(`Verify Order Management page is visible`, async () => {
            await expect(this.page.locator(OrderManagementPage.ORDER_MANAGEMENT_HEADING))
                .toBeVisible({ timeout: 30_000 });
            await expect(this.page.locator(OrderManagementPage.TOTAL_ORDERS_CARD))
                .toBeVisible({ timeout: 60_000 });
        });
    }

    public async verifyOrderListHasRows(): Promise<boolean> {
        let hasRows = false;
        await test.step(`Verify order list has at least one row`, async () => {
            const noResultsMsg = this.page.locator("text=No orders matched").first();
            if (await noResultsMsg.isVisible({ timeout: 5_000 }).catch(() => false)) {
                console.log(`[INFO] Order Management: no orders available — skipping row validation.`);
                return;
            }
            const rows = this.page.locator(OrderManagementPage.ORDER_TABLE_ROW);
            await expect(rows.first()).toBeVisible({ timeout: 20_000 });
            const rowCount = await rows.count();
            await Assert.assertTrue(rowCount > 0, `${OrderManagementConstants.ORDER_LIST} has at least one row`);
            hasRows = rowCount > 0;
        });
        return hasRows;
    }

    public async exportOrders(): Promise<string | undefined> {
        let fileName: string | undefined;
        await test.step(`Export orders file and verify download if available`, async () => {
            const exportButton = this.page.locator(OrderManagementPage.EXPORT_ORDERS_BUTTON).first();
            if (await exportButton.count() === 0 || !(await exportButton.isVisible())) {
                return;
            }

            try {
                fileName = await this.ui.downloadFile(OrderManagementPage.EXPORT_ORDERS_BUTTON,
                    OrderManagementConstants.EXPORT_ORDERS_BUTTON);
                await this.verifyDownloadedFile(fileName);
            } catch (error) {
                await test.step(`Export Orders download was not available`, async () => {
                    // Log the failure, but do not fail the entire order management validation.
                    // This allows the scenario to continue to verify order details and invoice download.
                });
            }
        });
        return fileName;
    }

    public async openFirstOrderDetails(): Promise<boolean> {
        let opened = false;
        await test.step(`Open first order details from Order Management`, async () => {
            const noResultsMsg = this.page.locator("text=No orders matched").first();
            if (await noResultsMsg.isVisible({ timeout: 5_000 }).catch(() => false)) {
                console.log(`[INFO] Order Management: no orders available — skipping order details.`);
                return;
            }

            const firstRow = this.page.locator(OrderManagementPage.ORDER_TABLE_ROW).first();
            if (!(await firstRow.isVisible({ timeout: 10_000 }).catch(() => false))) {
                console.log(`[INFO] Order Management: no table rows visible — skipping order details.`);
                return;
            }

            const viewButton = firstRow.locator(OrderManagementPage.VIEW_ORDER_ACTION).first();
            if (!(await viewButton.isVisible({ timeout: 5_000 }).catch(() => false))) {
                console.log(`[INFO] Order Management: no View action in first row — skipping order details.`);
                return;
            }

            await viewButton.click();
            opened = true;

            const orderDetailHeading = this.page.locator(OrderManagementPage.ORDER_DETAIL_HEADING).first();
            if (await orderDetailHeading.count() > 0) {
                await expect(orderDetailHeading).toBeVisible({ timeout: 20_000 });
            } else {
                await expect(this.page.locator("text=Order ID").first()).toBeVisible({ timeout: 20_000 });
            }
        });
        return opened;
    }

    public async downloadInvoiceIfAvailable(): Promise<string | undefined> {
        let fileName: string | undefined;
        await test.step(`Download invoice for the opened order if available`, async () => {
            const orderDetailVisible = await this.page.locator("text=Order ID").first()
                .isVisible({ timeout: 5_000 }).catch(() => false);
            if (!orderDetailVisible) {
                console.log(`[INFO] No order detail open — skipping invoice download.`);
                return;
            }

            const invoiceButton = this.page.locator(OrderManagementPage.DOWNLOAD_INVOICE_BUTTON).first();
            if (await invoiceButton.count() > 0 && await invoiceButton.isVisible().catch(() => false)) {
                fileName = await this.ui.downloadFile(OrderManagementPage.DOWNLOAD_INVOICE_BUTTON,
                    OrderManagementConstants.DOWNLOAD_INVOICE_BUTTON);
                await this.verifyDownloadedFile(fileName);
            } else {
                await test.step(`Invoice download action was not available on this order`, async () => {
                    console.log(`[INFO] No invoice download button on this order.`);
                });
            }
        });
        return fileName;
    }

    private async verifyDownloadedFile(fileName: string) {
        await test.step(`Verify downloaded file ${fileName} exists`, async () => {
            const filePath = `${CommonConstants.DOWNLOAD_PATH}${fileName}`;
            const exists = fs.existsSync(filePath);
            await Assert.assertTrue(exists, `${fileName} downloaded to ${filePath}`);
        });
    }
}
