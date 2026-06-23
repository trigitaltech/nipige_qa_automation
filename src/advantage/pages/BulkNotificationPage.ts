/**
 * Page Object for the Bulk Notification (Tenant) module — Communications → Bulk Notification
 * (route /bulkNotification). Locator strings / dynamic locator builders only; no assertions.
 *
 * Listing: "Bulk Notification" heading, a date-range filter (Today/7 days/30 days/Custom), a search
 * box, a "Create Criteria" button and a table (COLLECTION | CREATED DATE & TIME | CRITERIA ID |
 * CRITERIA STATUS | TEMPLATE STATUS | APPROVAL STATUS | ACTION). Create opens /bulkNotification/create
 * with a "Criteria Selection" section (Select Entity / Select Criteria / + button, mirrors Bulk
 * Promotion's condition builder) followed by a "Notification Configuration" section (Notification
 * Type, Template, Schedule Date, Schedule Time, Submit).
 */
export default class BulkNotificationPage {
    static readonly LISTING_PATH = "bulkNotification";
    static readonly CREATE_PATH = "bulkNotification/create";

    // ---- Navigation (sidebar: Communications → Bulk Notification) ----
    static readonly MENU_BULK_NOTIFICATION = 'a[href="/bulkNotification"]';
    static readonly SIDEBAR_LINK = "Bulk Notification";

    // ---- Module guard ----
    static readonly URL_GUARD = /\/bulkNotification/i;
    static readonly HEADING_GUARD = /^Bulk Notification$/i;
    static readonly MODULE_HEADING = "main h1, main h2";

    // ---- Listing page ----
    static readonly CREATE_BUTTON = 'button[data-slot="button"][data-size="sm"]:text-is("Create Criteria"), '
        + 'button:text-is("Create Criteria")';
    static readonly SEARCH_INPUT = 'input[placeholder="Search here"]';
    static readonly REFRESH_BUTTON = 'button:near(:text("Search here"))';
    // Same combobox widget as Select Entity/Criteria/Operator — input[role="combobox"], no
    // placeholder (it shows the currently selected value, e.g. "Today", as its value text instead).
    static readonly DATE_FILTER_COMBOBOX = 'input[role="combobox"][aria-haspopup="listbox"]'
        + ':not([placeholder])';
    // "Custom Date Range" section has "From Date" / "To Date" labels above native
    // input[type="date"] fields (same widget family as Schedule Date — confirmed live). The
    // placeholder text ("dd-mm-yyyy") is unreliable to match via CSS once a field has been
    // focused/touched, so these are matched structurally via the label text instead.
    static readonly CUSTOM_FROM_DATE = 'xpath=//*[normalize-space(text())="From Date"]/following::input[1]';
    static readonly CUSTOM_TO_DATE = 'xpath=//*[normalize-space(text())="To Date"]/following::input[1]';
    static readonly CUSTOM_APPLY_BUTTON = 'button:text-is("Apply")';
    static readonly CUSTOM_DATE_ERROR = ".Toastify__toast--error, [role=\"alert\"]";

    // ---- Listing table ----
    static readonly TABLE = "table";
    static readonly TABLE_HEADERS = "table thead th";
    static readonly TABLE_ROW = "tbody tr";
    static readonly TABLE_VIEW_BUTTON = 'button[title="View"]';
    static readonly TABLE_DOWNLOAD_BUTTON = 'button[title="Download"]';
    static readonly EXPECTED_COLUMNS = [
        "COLLECTION", "CREATED DATE & TIME", "CRITERIA ID",
        "CRITERIA STATUS", "TEMPLATE STATUS", "APPROVAL STATUS", "ACTION",
    ];
    static readonly EMPTY_STATE_TEXT = "No criteria found.";

    // ---- Criteria Selection (Create page) ----
    // "Select Entity" / "Select Criteria" / operator are NOT native <select> elements — each is a
    // text <input role="combobox"> that opens a listbox of plain <button> options on click (no
    // role="option", just styled buttons). The underlying native <select> is visually hidden
    // (class="hidden" aria-hidden="true") and cannot be driven via selectOption().
    static readonly ENTITY_COMBOBOX = 'input[role="combobox"][placeholder="Select Entity"]';
    static readonly CRITERIA_COMBOBOX = 'input[role="combobox"][placeholder="Select Criteria"]';
    static readonly OPERATOR_COMBOBOX = 'input[role="combobox"][placeholder="Select Operator"]';
    /** Option button inside whichever listbox is currently open, matched by its visible text. */
    static comboboxOption(label: string): string {
        return `button:text-is("${label}")`;
    }
    static readonly VALUE_INPUT = 'input[placeholder^="Enter"]';
    static readonly DATE_INPUTS = 'input[type="date"], input[placeholder="dd-mm-yyyy"]';
    static readonly RANGE_LOWER_INPUT = 'input[placeholder="Lower Amount"]';
    static readonly RANGE_HIGHER_INPUT = 'input[placeholder="Higher Amount"]';
    // Each condition row renders an Operator combobox + Value input together (confirmed live: after
    // clicking (+), a new "Operator | Value [-]" row appears below Select Entity/Criteria, which
    // reset to placeholders). Counting Value inputs is the most reliable proxy for row count.
    static readonly CONDITION_ROW = 'input[placeholder^="Enter"]';
    // The (+) add-condition button: a circular green icon button (bg-green-500), not Bulk
    // Promotion's bg-emerald-600 — confirmed via DevTools on the live Bulk Notification page.
    static readonly ADD_CONDITION_BUTTON = "button.rounded-full.bg-green-500";
    static readonly REMOVE_CONDITION_BUTTON = 'button.rounded-full:text-is("-")';

    // ---- Impacted customer ----
    static readonly VIEW_IMPACTED_BUTTON = 'button:text("View Impacted Customer")';
    static readonly DOWNLOAD_BUTTON = 'button:text("Download")';
    static readonly IMPACTED_SECTION = 'div:has-text("Impacted Customer"):visible';
    static readonly IMPACTED_COUNT = 'div:has-text("Impacted Customer") span:text-matches("\\d+")';

    // ---- Notification Configuration (Create page, below Criteria Selection) ----
    static readonly NOTIFICATION_CONFIG_HEADING = 'h2:has-text("Notification Configuration"), '
        + 'h3:has-text("Notification Configuration")';
    // Labels confirmed live: "Type of Notification" (not "Notification Type") and "Template".
    static readonly NOTIFICATION_TYPE_COMBOBOX = 'input[role="combobox"][placeholder="Type of Notification"]';
    static readonly TEMPLATE_COMBOBOX = 'input[role="combobox"][placeholder="Template"]';
    static readonly DESCRIPTION_TEXTAREA = 'textarea[placeholder="Description"]';
    // Schedule Date is a masked text input (dd-mm-yyyy) with a calendar icon, not input[type="date"].
    // Schedule Time is a masked text input (--:-- --, 12-hour AM/PM) with a clock icon, not
    // input[type="time"].
    // The placeholder text ("dd-mm-yyyy" / "--:-- --") is unreliable to match once the field has
    // been focused/touched once (the accessibility tree shows an unnamed textbox afterwards), so
    // these are matched structurally — the nearest <input> that follows the "Schedule Date" /
    // "Schedule Time" label text in document order.
    static readonly SCHEDULE_DATE_INPUT = 'xpath=//*[normalize-space(text())="Schedule Date"]/following::input[1]';
    static readonly SCHEDULE_TIME_INPUT = 'xpath=//*[normalize-space(text())="Schedule Time"]/following::input[1]';
    static readonly SUBMIT_BUTTON = 'button:text-is("Submit")';

    // ---- Validation ----
    static readonly VALIDATION_ERROR = ".Toastify__toast--error";
    static readonly FIELD_ERROR_TEXT = '[class*="error"], [role="alert"]';

    // ---- Details page ----
    static readonly DETAILS_HEADING = 'h1:has-text("View Bulk Notification"), '
        + 'h2:has-text("View Bulk Notification"), '
        + '[class*="heading"]:has-text("View Bulk Notification")';
    static readonly DETAILS_DOWNLOAD_BUTTON = 'button:has-text("Download")';
    static readonly BACK_BUTTON = 'button:text-is("Back")';

    /** Listing row that contains the given Criteria ID / text. */
    static row(text: string): string {
        return `tbody tr:has-text("${text}")`;
    }
}
