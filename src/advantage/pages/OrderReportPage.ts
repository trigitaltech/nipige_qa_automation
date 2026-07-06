export default class OrderReportPage {
static BI_ANALYTICS = "//span[text()='BI & Analytics']";

static ORDER_REPORTS = "//span[text()='Order Reports']";

static PAGE_HEADER = "//h1[contains(text(),'Order Report')]";

static TODAY = "//button[text()='Today']";

static SEVEN_DAYS = "//button[text()='7D']";

static THIRTY_DAYS = "//button[text()='30D']";

static NINETY_DAYS = "//button[text()='90D']";

static YTD = "//button[text()='YTD']";

static REFRESH = "//button[contains(.,'Refresh')]";

// Order Value Chart Filters
static ORDER_VALUE_DATE_FILTER = "(//input[@role='combobox'])[1]";

// Order Status Filters
static ORDER_STATUS_FILTER = "(//input[@role='combobox'])[2]";

static ORDER_STATUS_DATE_FILTER = "(//input[@role='combobox'])[3]";

// Custom Date Popup
static CUSTOM_FROM_DATE = "#custom-date-from";

static CUSTOM_TO_DATE = "#custom-date-to";

static APPLY_BUTTON = "button[data-variant='default']";

static ORDER_BY_SALES_CHANNEL = "//h2[text()='Order by Sales Channel']";

static ORDER_BY_TYPE = "//h2[text()='Order by Type']";

    // Order Detail
    static ORDER_DETAIL_HEADER = "//h2[contains(text(),'Order Detail')]";

static SEARCH_BOX = "//input[@aria-label='Search orders']";

static STATUS_FILTER = "//select[@aria-label='All Status']";

static ORDER_DETAIL_APPLY_BUTTON = "//div[@role='search']//button[text()='Apply']";
}
