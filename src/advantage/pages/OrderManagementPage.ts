export default class OrderManagementPage {
    static readonly ORDER_MANAGEMENT_HEADING = "h2:has-text('Order Management'), h1:has-text('Order Management')";
    static readonly TOTAL_ORDERS_CARD = "text=TOTAL ORDERS";
    static readonly ORDER_TABLE_ROW = "table tbody tr";
    static readonly EXPORT_ORDERS_BUTTON = "button:has-text('Export Orders')";
    static readonly VIEW_ORDER_ACTION = "button:has-text('View'), a:has-text('View'), [aria-label*='view'], [title*='view']";
    static readonly ORDER_DETAIL_HEADING = "text=Order Details";
    static readonly DOWNLOAD_INVOICE_BUTTON = "button:has-text('Download Invoice'), a:has-text('Download Invoice'), button:has-text('Invoice'), a:has-text('Invoice')";
}