export default class DailyRegistrationPage {
    // ── Navigation paths ──────────────────────────────────────────────────────
    static readonly DRR_PATH = "analytics/dailyRegistration";
    static readonly CDH_PATH = "analytics/history/CUSTOMER";

    // ── Page headings ─────────────────────────────────────────────────────────
    static readonly PAGE_HEADING = [
        'h1:has-text("Daily Registration Report")',
        'h2:has-text("Daily Registration Report")',
        ':is(h1,h2,h3):has-text("Daily Registration")',
    ].join(", ");

    static readonly CDH_HEADING = [
        'h1:has-text("Download History")',
        'h2:has-text("Download History")',
        ':is(h1,h2,h3):has-text("Download History")',
    ].join(", ");

    // ── Date filter buttons ───────────────────────────────────────────────────
    static readonly FILTER_TODAY = [
        'button:has-text("Today"):not(:has-text("View"))',
        'button[class*="active"]:has-text("Today")',
    ].join(", ");

    static readonly FILTER_7D = 'button:has-text("7D")';
    static readonly FILTER_30D = 'button:has-text("30D")';
    static readonly FILTER_CUSTOM = 'button:has-text("Custom")';

    // ── Custom date range picker ──────────────────────────────────────────────
    static readonly CUSTOM_DATE_TRIGGER = [
        'button:has-text("Custom")',
        '[class*="date-picker"]',
        '[class*="datepicker"]',
    ].join(", ");

    // Screenshot shows placeholder="dd-mm-yyyy" native date inputs; use type selector + index in steps
    static readonly DATE_INPUTS = [
        'input[type="date"]',
        'input[placeholder="dd-mm-yyyy"]',
        'input[placeholder*="yyyy"]',
    ].join(", ");

    static readonly APPLY_DATE_BTN = [
        'button:has-text("Apply Range")',
        'button:has-text("Apply")',
    ].join(", ");

    // ── Action buttons ────────────────────────────────────────────────────────
    static readonly REFRESH_BTN = [
        'button:has-text("Refresh")',
        'button[aria-label*="refresh" i]',
        '[class*="refresh"]',
    ].join(", ");

    static readonly VIEW_DOWNLOAD_HISTORY_BTN = [
        'button:has-text("View Download History")',
        'a:has-text("View Download History")',
    ].join(", ");

    static readonly EXPORT_CSV_BTN = [
        'button:has-text("Export CSV")',
        'button:has-text("CSV")',
        'a:has-text("Export CSV")',
        '[aria-label*="export csv" i]',
    ].join(", ");

    static readonly EXPORT_PDF_BTN = [
        'button:has-text("PDF")',
        'button:has-text("Export PDF")',
        'a:has-text("PDF")',
        '[aria-label*="pdf" i]',
    ].join(", ");

    static readonly SCHEDULE_REPORT_BTN = [
        'button:has-text("Schedule")',
        'button:has-text("Schedule Report")',
        '[aria-label*="schedule" i]',
    ].join(", ");

    // ── KPI Cards ─────────────────────────────────────────────────────────────
    static readonly KPI_TOTAL_REGISTRATIONS = [
        '[class*="card"]:has-text("TOTAL REGISTRATIONS")',
        'div:has-text("TOTAL REGISTRATIONS")',
        'p:has-text("TOTAL REGISTRATIONS")',
    ].join(", ");

    static readonly KPI_CUSTOMERS = [
        '[class*="card"]:has-text("CUSTOMERS")',
        'div:has-text("CUSTOMERS")',
    ].join(", ");

    static readonly KPI_PARTNERS = [
        '[class*="card"]:has-text("PARTNERS")',
        'div:has-text("PARTNERS")',
    ].join(", ");

    static readonly KPI_STAFF = [
        '[class*="card"]:has-text("STAFF")',
        'div:has-text("STAFF")',
    ].join(", ");

    static readonly KPI_VERIFIED_RATE = [
        '[class*="card"]:has-text("VERIFIED RATE")',
        'div:has-text("VERIFIED RATE")',
    ].join(", ");

    // ── Trend chart tabs ──────────────────────────────────────────────────────
    static readonly TREND_TAB_ALL = [
        'button:has-text("All"):not([class*="role" i])',
        '[role="tab"]:has-text("All")',
    ].join(", ");

    static readonly TREND_TAB_CUSTOMER = [
        'button:has-text("Customer"):not([class*="role" i]):not([class*="dropdown"])',
        '[role="tab"]:has-text("Customer")',
    ].join(", ");

    static readonly TREND_TAB_PARTNER = [
        'button:has-text("Partner"):not([class*="dropdown"])',
        '[role="tab"]:has-text("Partner")',
    ].join(", ");

    static readonly TREND_TAB_STAFF = [
        'button:has-text("Staff"):not([class*="dropdown"])',
        '[role="tab"]:has-text("Staff")',
    ].join(", ");

    static readonly REG_DETAIL_SECTION = 'div:has(h2:has-text("Registration Detail"))';

    // ── Registration Detail table ─────────────────────────────────────────────
    static readonly DETAIL_SEARCH = 'input[placeholder*="Search name, email, phone" i]';

    static readonly DETAIL_CLEAR_SEARCH = [
        'button[aria-label*="clear" i]',
        'button:has-text("×")',
        '[class*="clear"]',
    ].join(", ");

    // Radix/shadcn Select triggers — role="combobox" is the reliable discriminator
    static readonly ROLE_DROPDOWN = 'input[role="combobox"]';
    static readonly SOURCE_DROPDOWN = 'input[role="combobox"]';
    static readonly STATUS_DROPDOWN = 'input[role="combobox"]';

    static readonly APPLY_FILTER_BTN = 'button:has-text("Apply")';

    static readonly TABLE_ROWS = "table tbody tr";
    static readonly TABLE_HEADER = "table thead tr th";
    static readonly TABLE_FIRST_ROW = "table tbody tr:first-child";

    static readonly NO_DATA_MSG = [
        ':text("No data available")',
        ':text("No records found")',
        ':text("No Records Found")',
        'td:has-text("No")',
        '[class*="empty"]',
        '[class*="no-data"]',
    ].join(", ");

    // ── Pagination ────────────────────────────────────────────────────────────
    static readonly PAGINATION = [
        '[class*="pagination"]',
        'nav[aria-label*="pagination" i]',
        'div:has(button:has-text("Previous")):has(button:has-text("Next"))',
    ].join(", ");

    static readonly PAGINATION_PREV = [
        'button:has-text("Previous")',
        'button[aria-label*="previous" i]',
    ].join(", ");

    static readonly PAGINATION_NEXT = [
        'button:has-text("Next")',
        'button[aria-label*="next" i]',
    ].join(", ");

    // ── Download History page ─────────────────────────────────────────────────
    static readonly CDH_DATE_FILTER = [
        'select:has-text("Today")',
        '[class*="dropdown"]:has-text("Today")',
        'button:has-text("Today"):visible',
    ].join(", ");

    static readonly CDH_VIEW_REPORT_BTN = [
        'button:has-text("VIEW CUSTOMER REPORT")',
        'button:has-text("View Customer Report")',
        'a:has-text("VIEW CUSTOMER REPORT")',
    ].join(", ");

    static readonly CDH_TABLE_ROWS = "table tbody tr";

    static readonly CDH_COLUMN_REQUEST = [
        'th:has-text("REQUEST#")',
        'th:has-text("Request#")',
        'th:has-text("Request ID")',
    ].join(", ");

    static readonly CDH_COLUMN_DATE = [
        'th:has-text("REQUEST DATE")',
        'th:has-text("Request Date")',
    ].join(", ");

    static readonly CDH_COLUMN_TYPE = [
        'th:has-text("REQUEST TYPE")',
        'th:has-text("Request Type")',
    ].join(", ");

    static readonly CDH_COLUMN_BY = [
        'th:has-text("REQUESTED BY")',
        'th:has-text("Requested By")',
    ].join(", ");

    static readonly CDH_COLUMN_STATUS = [
        'th:has-text("STATUS")',
    ].join(", ");

    static readonly CDH_COLUMN_ACTION = [
        'th:has-text("ACTION")',
    ].join(", ");

    // ── Dynamic helpers ───────────────────────────────────────────────────────
    static dropdownOption(value: string): string {
        return [
            `li[role="option"] button:has-text("${value}")`,
            `li[role="option"] button:text-is("${value}")`,
            `[role="option"]:text-is("${value}")`,
            `[role="option"]:has-text("${value}")`,
            `li[role="option"]:has-text("${value}")`,
            `div[data-radix-select-item]:has-text("${value}")`,
            `div[class*="option"]:has-text("${value}")`,
        ].join(", ");
    }

    static tableCell(text: string): string {
        return `table tbody td:has-text("${text}")`;
    }
}
