export default class OrderManagementPage {

    static readonly ORDER_MANAGEMENT =
        "text=Order Management";

    static readonly PAGE_HEADER =
        "text=Order Management";

    static readonly STATUS_FILTER =
        "(//input[@role='combobox'])[1]";

    static readonly DATE_FILTER =
        "(//input[@role='combobox'])[2]";

    static readonly SELLER_FILTER =
        "(//input[@role='combobox'])[3]";

    static readonly SELLER_NAME =
        "input[placeholder='Seller Name']";

    static readonly DIRECT_SELLER_DROPDOWN =
        "input[placeholder='Select Seller']";

    static readonly MARKET_FILTER =
        "(//input[@role='combobox'])[4]";

    static readonly ORDER_ID =
        "input[placeholder='Order ID']";

    static readonly APPLY_BUTTON =
        "text=Apply";

    static readonly RESET_BUTTON =
        "text=Reset";

    // TC05
    static readonly VIEW_ORDER =
    "tbody tr:first-child td:last-child button";

static readonly VIEW_INVOICE =
    "text=View Invoice";
    static readonly INVOICE_POPUP =
    "//div[@role='dialog']";
static readonly CLOSE_INVOICE =
    "//button//*[name()='svg']/ancestor::button";
static FROM_DATE = "input[type='date']";
static APPLY_RANGE_BUTTON = "button:has-text('Apply Range')";
}
